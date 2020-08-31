// Set your secret key. Remember to switch to your live secret key in production!
// See your keys here: https://dashboard.stripe.com/account/apikeys
require('dotenv').config();
const stripe = require('stripe')(process.env.GATSBY_STRIPE_SECRET_KEY, {
    apiVersion: '',
});

export function handler(event, context, callback) {
    const data = JSON.parse(event.body);
    const { stripeId, code } = data;
    stripe.customers.retrieve(stripeId).then(customer => {
        stripe.subscriptions
            .update(
                customer.subscriptions.data[0].id,
                { coupon: code },
                function(error, subscription) {
                    if (error) {
                        console.error(
                            'Error fetching stripe subscription: ',
                            error
                        );
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
                                message: 'Coupon Applied',
                                subscription,
                            }),
                        });
                    }
                }
            )
            .catch(error => {
                console.error('error', error);
                return callback(null, {
                    statusCode: 401,
                    body: JSON.stringify({
                        error: error.message,
                    }),
                });
            });
    });
}
