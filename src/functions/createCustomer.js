const stripe = require('stripe')(process.env.GATSBY_STRIPE_SECRET_KEY);

export function handler(event, context, callback) {
    const data = JSON.parse(event.body);
    const { email, name } = data; //destructure shipping here JAMES

    // need to check if the customer exists and if they do return error

    stripe.customers
        // Add shipping details here too JAMES
        .create(
            {
                email,
                name,
            },
            function(error, customer) {
                if (error) {
                    console.error('Error creating stripe customer: ', error); // asynchronously called
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
                            message: 'Customer added',
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
