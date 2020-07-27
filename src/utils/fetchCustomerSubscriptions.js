const fetchCustomerSubscriptions = ({ stripeId }) => {
    return fetch('/.netlify/functions/getCustomerSubscriptions', {
        method: 'POST',
        body: JSON.stringify({
            stripeId,
        }),
    });
};

export default fetchCustomerSubscriptions;
