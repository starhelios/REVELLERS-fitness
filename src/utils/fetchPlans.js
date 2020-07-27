const fetchPlans = () => {
    return fetch('/.netlify/functions/getPlans', {
        method: 'POST',
    });
};

export default fetchPlans;
