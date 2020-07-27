const applyCouponCode = ({ stripeId, code }) => {
    return fetch('/.netlify/functions/applyCouponCode', {
        method: 'POST',
        body: JSON.stringify({
            stripeId,
            code,
        }),
    });
};

export default applyCouponCode;
