const stripe = require('stripe')(process.env.GATSBY_STRIPE_SECRET_KEY, {
    maxNetworkRetries: 2,
});

export async function handler(event, context, callback) {
    const data = JSON.parse(event.body);
    const {
        stripeId,
        lineItems,
        successUrl,
        cancelUrl,
        metadata,
        subscription,
        subscriptionSuccessUrl,
    } = data;

    const customer = await stripe.customers.retrieve(stripeId);

    let trialPeriodDays;

    if (subscription) {
        const planAlreadySubscribedTo = customer.subscriptions.data.find(
            ({ plan }) => subscription.items[0].plan === plan.id
        );

        const planData = await stripe.plans.retrieve(
            subscription.items[0].plan
        );

        trialPeriodDays =
            planAlreadySubscribedTo && planAlreadySubscribedTo.id
                ? undefined
                : planData.trial_period_days;
    }

    const session = await stripe.checkout.sessions.create({
        customer: stripeId,
        payment_method_types: ['card'],
        success_url: `${
            subscriptionSuccessUrl ? subscriptionSuccessUrl : successUrl
        }?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: cancelUrl,
        line_items: lineItems,
        metadata,
        subscription_data: subscription
            ? {
                  ...subscription,
                  trial_period_days: trialPeriodDays,
              }
            : {},
    });

    callback(null, {
        // return null to show no errors
        statusCode: 200, // http status code
        body: JSON.stringify({
            msg: 'Session created',
            session,
        }),
    });
}
