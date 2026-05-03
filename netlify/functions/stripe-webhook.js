const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

async function sbUpsert(table, row) {
  const res = await fetch(`${process.env.SUPABASE_URL}/rest/v1/${table}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'apikey': process.env.SUPABASE_SERVICE_KEY,
      'Authorization': `Bearer ${process.env.SUPABASE_SERVICE_KEY}`,
      'Prefer': 'resolution=merge-duplicates'
    },
    body: JSON.stringify(row)
  });
  if (!res.ok) throw new Error(`Supabase upsert failed: ${await res.text()}`);
}

async function sbPatch(path, body) {
  const res = await fetch(`${process.env.SUPABASE_URL}/rest/v1/${path}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      'apikey': process.env.SUPABASE_SERVICE_KEY,
      'Authorization': `Bearer ${process.env.SUPABASE_SERVICE_KEY}`
    },
    body: JSON.stringify(body)
  });
  if (!res.ok) throw new Error(`Supabase patch failed: ${await res.text()}`);
}

exports.handler = async (event) => {
  const sig = event.headers['stripe-signature'];
  let stripeEvent;

  try {
    stripeEvent = stripe.webhooks.constructEvent(
      event.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    return { statusCode: 400, body: `Webhook Error: ${err.message}` };
  }

  const { type, data } = stripeEvent;

  try {
    if (type === 'checkout.session.completed') {
      const session = data.object;
      const sub = await stripe.subscriptions.retrieve(session.subscription);
      await sbUpsert('subscriptions', {
        user_id: session.metadata.user_id,
        stripe_customer_id: session.customer,
        stripe_subscription_id: session.subscription,
        status: sub.status,
        current_period_end: new Date(sub.current_period_end * 1000).toISOString(),
        updated_at: new Date().toISOString()
      });
    }

    if (type === 'customer.subscription.updated') {
      const sub = data.object;
      if (sub.metadata.user_id) {
        await sbUpsert('subscriptions', {
          user_id: sub.metadata.user_id,
          stripe_customer_id: sub.customer,
          stripe_subscription_id: sub.id,
          status: sub.status,
          current_period_end: new Date(sub.current_period_end * 1000).toISOString(),
          updated_at: new Date().toISOString()
        });
      }
    }

    if (type === 'customer.subscription.deleted') {
      const sub = data.object;
      if (sub.metadata.user_id) {
        await sbPatch(`subscriptions?user_id=eq.${sub.metadata.user_id}`, {
          status: 'inactive',
          updated_at: new Date().toISOString()
        });
      }
    }
  } catch (err) {
    console.error('Webhook handler error:', err);
    return { statusCode: 500, body: err.message };
  }

  return { statusCode: 200, body: JSON.stringify({ received: true }) };
};
