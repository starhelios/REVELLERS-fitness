const stripe = require('stripe')(process.env.GATSBY_STRIPE_SECRET_KEY, {
    maxNetworkRetries: 2,
});

export async function handler(event, context, callback) {
    const data = JSON.parse(event.body);
    const { sessionId } = data;

    const session = await stripe.checkout.sessions.retrieve(`${sessionId}`);

    stripe.paymentIntents
        .update(
            session.payment_intent,
            { metadata: session.metadata },
            function(error, paymentIntent) {
                if (error) {
                    console.error(
                        'Unable to complete payment intent update',
                        error,
                        paymentIntent
                    );
                }
            }
        )
        .catch(error =>
            console.error('Unable to update payment intent', error)
        );

    callback(null, {
        // return null to show no errors
        statusCode: 200, // http status code
        body: JSON.stringify({
            msg: 'Session retrieved',
            session,
            // updatedPaymentIntent,
        }),
    });
}
