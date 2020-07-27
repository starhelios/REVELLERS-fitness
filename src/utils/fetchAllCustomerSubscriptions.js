const fetchAllCustomerSubscriptions = ({ users, currentUser }) => {
    return fetch('/.netlify/functions/getAllCustomerSubscriptions', {
        method: 'POST',
        body: JSON.stringify({
            users,
            currentUser,
        }),
    });
};

export default fetchAllCustomerSubscriptions;
