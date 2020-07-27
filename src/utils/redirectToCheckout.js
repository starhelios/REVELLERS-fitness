import { loadStripe } from '@stripe/stripe-js';
import createStripeCheckoutSession from './createStripeCheckoutSession';

const stripePromise = loadStripe(process.env.GATSBY_STRIPE_PUBLIC_KEY);
// Pass argument after subscirptions so you can check if you are buying a bike for success or error url
const redirectToCheckout = async (
    event,
    user,
    lineItems,
    metadata,
    subscription
) => {
    if (event) {
        event.preventDefault();
    }

    const { stripeId } = user?.user_metadata;
    const url = window ? window.location.origin + window.location.pathname : '';
    const subscriptionSuccessUrl =
        window && subscription
            ? `${window.location.origin}/app/daily_rides`
            : undefined;

    const response = await createStripeCheckoutSession({
        stripeId,
        customerEmail: user?.email,
        successUrl: `${url}`,
        cancelUrl: `${url}`, // TODO: need some way to display payment cancelled
        lineItems,
        metadata,
        subscription,
        subscriptionSuccessUrl,
    });
    const data = await response.json();
    const { id } = data?.session || {};

    const stripe = await stripePromise;
    const stripePayment = await stripe.redirectToCheckout({
        sessionId: id,
    });

    const { error } = stripePayment;
    if (error) {
        console.warn('Error:', error);
    }
};

export default redirectToCheckout;
