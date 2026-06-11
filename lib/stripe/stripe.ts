import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "");

export const PLANS = {
  starter: {
    name: "Starter",
    price: 29,
    features: ["50 generations/month", "2 agents", "Basic analytics"],
    stripe_price_id: process.env.STRIPE_STARTER_PRICE_ID || "",
  },
  pro: {
    name: "Professional",
    price: 99,
    features: ["500 generations/month", "8 agents", "Advanced analytics", "Priority support"],
    stripe_price_id: process.env.STRIPE_PRO_PRICE_ID || "",
  },
  enterprise: {
    name: "Enterprise",
    price: 299,
    features: ["Unlimited generations", "Unlimited agents", "Custom features", "Dedicated support"],
    stripe_price_id: process.env.STRIPE_ENTERPRISE_PRICE_ID || "",
  },
};

export async function createCheckoutSession(userId: string, planKey: keyof typeof PLANS) {
  const plan = PLANS[planKey];

  const session = await stripe.checkout.sessions.create({
    customer_email: undefined,
    payment_method_types: ["card"],
    line_items: [
      {
        price: plan.stripe_price_id,
        quantity: 1,
      },
    ],
    mode: "subscription",
    success_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/billing?success=true`,
    cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/pricing?cancelled=true`,
    metadata: {
      userId,
      plan: planKey,
    },
  });

  return session;
}

export async function getCustomerSubscriptions(stripeCustomerId: string) {
  const subscriptions = await stripe.subscriptions.list({
    customer: stripeCustomerId,
    limit: 10,
  });

  return subscriptions.data;
}

export async function cancelSubscription(subscriptionId: string) {
  const subscription = await stripe.subscriptions.update(subscriptionId, {
    cancel_at_period_end: true,
  });

  return subscription;
}

export async function createBillingPortalSession(customerId: string, returnUrl: string) {
  const session = await stripe.billingPortal.sessions.create({
    customer: customerId,
    return_url: returnUrl,
  });

  return session;
}
