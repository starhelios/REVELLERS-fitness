require('dotenv').config();
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

    stripe.subscriptions
        .list({ customer: stripeId }, function(error, subscriptions) {
            if (error) {
                console.error('Error fetching stripe subscriptions: ', error); // asynchronously called
                // return error back to app
                return callback(null, {
                    statusCode: 401,
                    body: JSON.stringify({
                        error,
                    }),
                });
            } else {
                callback(null, {
                    statusCode: 200, // http status code
                    body: JSON.stringify({
                        message: 'Subscriptions list',
                        subscriptions,
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
