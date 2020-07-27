const createStripeCheckoutSession = ({
    stripeId,
    customerEmail,
    successUrl,
    cancelUrl, // TODO: need some way to display payment cancelled
    lineItems,
    metadata,
    subscription,
    subscriptionSuccessUrl,
}) => {
    return fetch('/.netlify/functions/createCheckoutSession', {
        method: 'POST',
        body: JSON.stringify({
            stripeId,
            customerEmail,
            successUrl,
            cancelUrl,
            lineItems,
            metadata,
            subscription,
            subscriptionSuccessUrl,
        }),
    });
};

export default createStripeCheckoutSession;
