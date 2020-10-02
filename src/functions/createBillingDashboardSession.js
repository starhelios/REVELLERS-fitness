require('dotenv').config();
const stripe = require('stripe')(process.env.GATSBY_STRIPE_SECRET_KEY);
export function handler(event, context, callback) {
    const data = JSON.parse(event.body);
    const { stripeId } = data;

    stripe.billingPortal.sessions
        .create(
            {
                customer: stripeId,
                return_url: 'https://www.revelwell.com.au/app/profile',
            },
            function(error, customer) {
                if (error) {
                    console.error('Error initializing Dashboard: ', error); // asynchronously called
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
                            message: 'Dashboard Initialized',
                            customer,
                        }),
                    });
                }
            }
        )
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
