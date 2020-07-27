const cancelStripeSubscription = ({ stripeId, subscriptionId }) => {
    return fetch('/.netlify/functions/cancelSubscription', {
        method: 'POST',
        body: JSON.stringify({
            stripeId,
            subscriptionId,
        }),
    });
};

export default cancelStripeSubscription;
