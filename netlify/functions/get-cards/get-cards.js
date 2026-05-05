// Returns the flashcard catalogue, gated by an active Supabase subscription.
// Replaces the previous public static fetch of /cards.json — the data file
// has been moved into this function's folder so it is no longer served as
// a static asset, and access requires a valid Supabase JWT belonging to a
// user with subscription status of 'active' or 'trialing'.

const cards = require('./cards.json');

exports.handler = async (event) => {
  if (event.httpMethod !== 'GET') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  const auth = event.headers.authorization || event.headers.Authorization;
  if (!auth || !auth.startsWith('Bearer ')) {
    return { statusCode: 401, body: 'Missing authorization' };
  }
  const token = auth.slice(7);

  const supabaseUrl = process.env.SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_KEY;
  if (!supabaseUrl || !serviceKey) {
    return { statusCode: 500, body: 'Server misconfigured' };
  }

  try {
    // 1. Verify the JWT by asking Supabase for the user it represents.
    const userRes = await fetch(`${supabaseUrl}/auth/v1/user`, {
      headers: {
        apikey: serviceKey,
        Authorization: `Bearer ${token}`
      }
    });
    if (!userRes.ok) {
      return { statusCode: 401, body: 'Invalid token' };
    }
    const user = await userRes.json();
    const userId = user && user.id;
    if (!userId) {
      return { statusCode: 401, body: 'No user' };
    }

    // 2. Look up the user's subscription using the service key (bypasses RLS for read).
    const subUrl = `${supabaseUrl}/rest/v1/subscriptions?user_id=eq.${encodeURIComponent(userId)}&select=status`;
    const subRes = await fetch(subUrl, {
      headers: {
        apikey: serviceKey,
        Authorization: `Bearer ${serviceKey}`
      }
    });
    if (!subRes.ok) {
      return { statusCode: 500, body: 'Subscription check failed' };
    }
    const subs = await subRes.json();
    const active = Array.isArray(subs) && subs.some(s => s.status === 'active' || s.status === 'trialing');
    if (!active) {
      return { statusCode: 403, body: 'No active subscription' };
    }

    // 3. Authorized — return the cards.
    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'private, max-age=300'
      },
      body: JSON.stringify(cards)
    };
  } catch (err) {
    return {
      statusCode: 500,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: err.message })
    };
  }
};
