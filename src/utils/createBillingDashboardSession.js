const createBillingDashboardSession = ({ stripeId }) => {
    return fetch('/.netlify/functions/createBillingDashboardSession', {
        method: 'POST',
        body: JSON.stringify({
            stripeId,
        }),
    });
};

export default createBillingDashboardSession;
