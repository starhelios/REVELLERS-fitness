const stripe = require('stripe')(process.env.GATSBY_STRIPE_SECRET_KEY);
export function handler(event, context, callback) {
    const data = JSON.parse(event.body);
    const { email, name } = data;

    stripe.customers
        .create({
            email,
            name,
        })
        .then(customer => {
            console.log('createCustomer(), Returned Details: ', customer);
            return callback(null, {
                statusCode: 200,
                body: JSON.stringify({
                    message: 'SUCCESS: Customer Added To Stripe',
                    customer,
                }),
            });
        })
        .catch(error => {
            console.error('createCustomer(), ERROR: ', error);
            return callback(null, {
                statusCode: 401,
                body: JSON.stringify({
                    error: error.message,
                }),
            });
        });
}
