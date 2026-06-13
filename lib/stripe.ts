import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2023-10-16',
});

export interface PricingPlan {
  name: string;
  price: number;
  currency: string;
  interval: 'month' | 'year';
  features: string[];
  stripePriceId: string;
}

export const PRICING_PLANS: Record<string, PricingPlan> = {
  starter: {
    name: 'Starter',
    price: 150,
    currency: 'usd',
    interval: 'month',
    features: [
      '1 sitio web activo',
      '5 especialistas',
      'Soporte por email',
      '1 actualización/mes',
      '45,000+ assets',
    ],
    stripePriceId: process.env.STRIPE_STARTER_PRICE_ID || '',
  },
  pro: {
    name: 'Pro',
    price: 500,
    currency: 'usd',
    interval: 'month',
    features: [
      '3 sitios web activos',
      '15 especialistas',
      'Soporte 24/7',
      '4 actualizaciones/mes',
      'Analytics avanzado',
      'Aprendizaje automático',
      '45,000+ assets',
    ],
    stripePriceId: process.env.STRIPE_PRO_PRICE_ID || '',
  },
  enterprise: {
    name: 'Enterprise',
    price: 0,
    currency: 'usd',
    interval: 'month',
    features: [
      'Sitios ilimitados',
      'Todos los 155 especialistas',
      'Soporte 24/7 dedicado',
      'Actualizaciones ilimitadas',
      'API access',
      'Training incluido',
      '45,000+ assets',
    ],
    stripePriceId: '',
  },
};

export async function createCheckoutSession(
  customerId: string,
  priceId: string,
  successUrl: string,
  cancelUrl: string
) {
  try {
    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: successUrl,
      cancel_url: cancelUrl,
    });

    return session;
  } catch (error) {
    console.error('Error creating checkout session:', error);
    throw error;
  }
}

export async function createCustomer(email: string, name: string) {
  try {
    const customer = await stripe.customers.create({
      email,
      name,
      metadata: {
        createdAt: new Date().toISOString(),
      },
    });

    return customer;
  } catch (error) {
    console.error('Error creating Stripe customer:', error);
    throw error;
  }
}

export async function getSubscription(subscriptionId: string) {
  try {
    const subscription = await stripe.subscriptions.retrieve(subscriptionId);
    return subscription;
  } catch (error) {
    console.error('Error retrieving subscription:', error);
    throw error;
  }
}

export async function cancelSubscription(subscriptionId: string) {
  try {
    const subscription = await stripe.subscriptions.del(subscriptionId);
    return subscription;
  } catch (error) {
    console.error('Error canceling subscription:', error);
    throw error;
  }
}

export async function updateSubscription(
  subscriptionId: string,
  priceId: string
) {
  try {
    const subscription = await stripe.subscriptions.retrieve(subscriptionId);

    const updated = await stripe.subscriptions.update(subscriptionId, {
      items: [
        {
          id: subscription.items.data[0].id,
          price: priceId,
        },
      ],
    });

    return updated;
  } catch (error) {
    console.error('Error updating subscription:', error);
    throw error;
  }
}

export async function constructWebhookEvent(body: string, signature: string) {
  try {
    const event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET || ''
    );

    return event;
  } catch (error) {
    console.error('Error constructing webhook event:', error);
    throw error;
  }
}