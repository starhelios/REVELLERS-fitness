const addStripeCustomer = ({ name, email }) => {
    return fetch('/.netlify/functions/createCustomer', {
        method: 'POST',
        // Add in shipping details in here JAMES
        body: JSON.stringify({
            name,
            email,
        }),
    });
};

export default addStripeCustomer;
