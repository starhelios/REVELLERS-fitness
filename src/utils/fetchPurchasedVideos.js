const fetchPurchasedVideos = ({ stripeId }) => {
    return fetch('/.netlify/functions/getPaymentIntents', {
        method: 'POST',
        body: JSON.stringify({ stripeId }),
    });
};

export default fetchPurchasedVideos;
