// Set your secret key. Remember to switch to your live secret key in production!
// See your keys here: https://dashboard.stripe.com/account/apikeys

const stripe = require('stripe')(process.env.GATSBY_STRIPE_SECRET_KEY, {
    apiVersion: '',
});

export function handler(event, context, callback) {
    stripe.coupons
        .list()
        .then(codes => {
            console.log('ALL CODES: ', codes.data);
            return callback(null, {
                statusCode: 200,
                body: JSON.stringify({
                    data: codes.data,
                }),
            });
        })
        .catch(error => {
            console.error('error', error);
            return callback(null, {
                statusCode: 401,
                body: JSON.stringify({
                    error: error.message,
                }),
            });
        });
}
