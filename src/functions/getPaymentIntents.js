const stripe = require('stripe')(process.env.GATSBY_STRIPE_SECRET_KEY, {
    maxNetworkRetries: 2,
});

export function handler(event, context, callback) {
    const data = JSON.parse(event.body);
    const { stripeId } = data;

    if (!stripeId) {
        console.error('Error: Invalid Stripe ID', stripeId);
        // return error back to app
        return callback(null, {
            statusCode: 401,
            body: JSON.stringify({
                error: 'User not found',
            }),
        });
    }

    stripe.paymentIntents
        .list({ customer: stripeId }, function(error, paymentIntents) {
            if (error) {
                console.error('Error fetching stripe payment intents: ', error); // asynchronously called
                // return error back to app
                return callback(null, {
                    statusCode: 401,
                    body: JSON.stringify({
                        error,
                    }),
                });
            } else {
                // TODO: call secure database of customers and their purchases or find a way to include contentful video ids and/or urls in the paymentIntents metadata
                callback(null, {
                    statusCode: 200, // http status code
                    body: JSON.stringify({
                        message: 'Payment intents list',
                        paymentIntents,
                    }),
                });
            }
        })
        .catch(error => {
            console.error('error', error);
            // return error back to app
            return callback(null, {
                statusCode: 401,
                body: JSON.stringify({
                    error: error.message,
                }),
            });
        });
}
