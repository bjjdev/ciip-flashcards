const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  try {
    const { priceId, userId, email } = JSON.parse(event.body);
    const baseUrl = process.env.URL || 'https://ciipflash.com';

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'subscription',
      customer_email: email,
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${baseUrl}/checkout-success.html`,
      cancel_url: `${baseUrl}/upgrade.html`,
      metadata: { user_id: userId },
      subscription_data: { metadata: { user_id: userId } },
      consent_collection: { terms_of_service: 'required' },
      custom_text: {
        terms_of_service_acceptance: {
          message: `I agree to the <a href="${baseUrl}/tos.html">Terms of Service</a> and <a href="${baseUrl}/privacy.html">Privacy Policy</a>.`
        }
      }
    });

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url: session.url })
    };
  } catch (err) {
    return {
      statusCode: 500,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: err.message })
    };
  }
};
