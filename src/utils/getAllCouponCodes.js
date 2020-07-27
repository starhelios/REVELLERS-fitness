const getAllCouponCodes = () => {
    return fetch('/.netlify/functions/getAllCouponCodes', {
        method: 'GET',
    });
};

export default getAllCouponCodes;
