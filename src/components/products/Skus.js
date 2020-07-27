import React from 'react';
import { loadStripe } from '@stripe/stripe-js';

const buttonStyles = {
    fontSize: '13px',
    textAlign: 'center',
    color: '#fff',
    outline: 'none',
    padding: '12px 60px',
    boxShadow: '2px 5px 10px rgba(0,0,0,.1)',
    backgroundColor: 'rgb(255, 178, 56)',
    borderRadius: '6px',
    letterSpacing: '1.5px',
};

const stripePromise = loadStripe('pk_test_gh7gCCqWy7YtQfFfCSevEa9J00j738YQlX');

const redirectToCheckout = async event => {
    event.preventDefault();
    const stripe = await stripePromise;
    const url = window ? window.location.href : '';

    const { error } = await stripe.redirectToCheckout({
        items: [{ sku: 'sku_H9HK8jAKQqkek6', quantity: 1 }],
        // THIS MIGHT BREAK IT IN PROD
        successUrl: `${url}`,
        cancelUrl: `${url}`, // TODO: need to display that the payment was cancelled
    });
    if (error) {
        console.warn('Error:', error);
    }
};

const Checkout = () => {
    return (
        <button style={buttonStyles} onClick={redirectToCheckout}>
            BUY THIS VIDEO
        </button>
    );
};

export default Checkout;
