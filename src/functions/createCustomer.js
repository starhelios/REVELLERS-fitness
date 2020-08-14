const stripe = require('stripe')(process.env.GATSBY_STRIPE_SECRET_KEY);

function stripeCreate(email, name) {
    return new Promise((resolve, reject) => {
        stripe.customers
        .create({
            email,
            name,
        })
        .then(customer => {
            resolve(customer);
        })
        .catch(error => {
            reject(error);
        });
    })
}

function sleep() {
    return new Promise((resolve, reject) => {
        setTimeout(() => resolve(true), 1000);
    })
}

export async function handler(event, context, callback) {
    const data = JSON.parse(event.body);
    const { email, name } = data;
    let customer = null;
    let error = null;

    for (let i = 0; i < 5; i++) {
        try {
            customer = await stripeCreate(email, name);
            break;
        } catch (err) {
            error = err;
            await sleep();
        }
    }

    if (customer) {
        console.log('createCustomer(), Returned Details: ', customer);
        return callback(null, {
            statusCode: 200,
            body: JSON.stringify({
                message: 'SUCCESS: Customer Added To Stripe',
                customer,
            }),
        });
    } else {
        console.error('createCustomer(), ERROR: ', error);
        return callback(null, {
            statusCode: 401,
            body: JSON.stringify({
                error: error.message,
            }),
        });
    }     
}
