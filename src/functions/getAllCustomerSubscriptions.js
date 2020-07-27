const stripe = require('stripe')(process.env.GATSBY_STRIPE_SECRET_KEY, {
    maxNetworkRetries: 2,
});

export function handler(event, context, callback) {
    const data = JSON.parse(event.body);
    const { users, currentUser } = data;

    if (
        !currentUser &&
        !currentUser.app_metadata &&
        !currentUser.app_metadata.roles &&
        !currentUser.app_metadata.roles.includes &&
        !currentUser.app_metadata.roles.includes('Admin')
    ) {
        // return error back to app
        return callback(null, {
            statusCode: 403,
            body: JSON.stringify({
                error: 'Permission denied',
            }),
        });
    }

    const usersWithoutStripeId = {};

    users.forEach(({ email, user_metadata }) => {
        const { full_name, stripeId, userPackage } = user_metadata || {};

        if (!stripeId) {
            console.error('Error: Invalid Stripe ID', stripeId);
            usersWithoutStripeId[email] = 1;
        }
    });

    stripe.subscriptions
        .list({ status: 'all', limit: 1000 }, function(error, subscriptions) {
            if (error) {
                console.error(
                    "Error fetching all customers' stripe subscriptions: ",
                    error
                ); // asynchronously called
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
                        usersBySubscription: {
                            subscriptions,
                            usersWithoutStripeId,
                        },
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
