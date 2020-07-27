const stripe = require('stripe')(process.env.GATSBY_STRIPE_SECRET_KEY, {
    maxNetworkRetries: 2,
});

export function handler(event, context, callback) {
    stripe.plans
        .list({ active: true }, function(error, plans) {
            if (error) {
                console.error('Error fetching plans: ', error); // asynchronously called
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
                        message: 'Plans list',
                        plans,
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
