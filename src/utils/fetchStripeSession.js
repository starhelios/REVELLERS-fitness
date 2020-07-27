const fetchStripeSession = ({ sessionId }) => {
    return fetch('/.netlify/functions/getCheckoutSession', {
        method: 'POST',
        body: JSON.stringify({ sessionId }),
    });
};

export default fetchStripeSession;
