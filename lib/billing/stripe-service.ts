/**
 * Stripe Billing Service
 * Payment processing, subscriptions, invoices, refunds
 */

import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_placeholder', {
  apiVersion: '2024-04-10',
});

export interface PricingTier {
  id: string;
  name: string;
  monthlyPrice: number;
  annualPrice: number;
  features: string[];
  stripePriceIdMonthly: string;
  stripePriceIdAnnual: string;
}

export const PRICING_TIERS: PricingTier[] = [
  {
    id: 'free',
    name: 'Free',
    monthlyPrice: 0,
    annualPrice: 0,
    features: [
      '3 documents',
      'Up to 2 collaborators',
      '1GB storage',
      'Web + Mobile',
    ],
    stripePriceIdMonthly: 'price_free',
    stripePriceIdAnnual: 'price_free',
  },
  {
    id: 'pro',
    name: 'Pro',
    monthlyPrice: 999, // $9.99
    annualPrice: 9990, // $99.90
    features: [
      'Unlimited documents',
      'Up to 10 collaborators',
      '100GB storage',
      'Priority support',
      'AI features (basic)',
      'Analytics',
    ],
    stripePriceIdMonthly: 'price_pro_monthly',
    stripePriceIdAnnual: 'price_pro_annual',
  },
  {
    id: 'business',
    name: 'Business',
    monthlyPrice: 4999, // $49.99
    annualPrice: 49990, // $499.90
    features: [
      'Team features',
      'SSO/SAML',
      'Advanced analytics',
      'API access',
      'SLA support',
      'Unlimited AI features',
      '1TB storage',
      'Custom branding',
    ],
    stripePriceIdMonthly: 'price_business_monthly',
    stripePriceIdAnnual: 'price_business_annual',
  },
];

export interface CreateCheckoutSessionParams {
  userId: string;
  email: string;
  priceId: string;
  successUrl: string;
  cancelUrl: string;
}

export interface CreatePortalSessionParams {
  customerId: string;
  returnUrl: string;
}

class StripeService {
  /**
   * Create a checkout session for subscription
   */
  async createCheckoutSession({
    userId,
    email,
    priceId,
    successUrl,
    cancelUrl,
  }: CreateCheckoutSessionParams): Promise<string | null> {
    try {
      const session = await stripe.checkout.sessions.create({
        customer_email: email,
        mode: 'subscription',
        payment_method_types: ['card'],
        line_items: [
          {
            price: priceId,
            quantity: 1,
          },
        ],
        success_url: successUrl,
        cancel_url: cancelUrl,
        metadata: {
          userId,
        },
      });

      return session.id;
    } catch (error) {
      console.error('Failed to create checkout session:', error);
      throw error;
    }
  }

  /**
   * Create customer in Stripe
   */
  async createCustomer(
    userId: string,
    email: string,
    name?: string
  ): Promise<string | null> {
    try {
      const customer = await stripe.customers.create({
        email,
        name,
        metadata: {
          userId,
        },
      });

      return customer.id;
    } catch (error) {
      console.error('Failed to create customer:', error);
      throw error;
    }
  }

  /**
   * Get customer by ID
   */
  async getCustomer(customerId: string): Promise<Stripe.Customer | null> {
    try {
      return await stripe.customers.retrieve(customerId);
    } catch (error) {
      console.error('Failed to retrieve customer:', error);
      return null;
    }
  }

  /**
   * Get subscription
   */
  async getSubscription(subscriptionId: string): Promise<Stripe.Subscription | null> {
    try {
      return await stripe.subscriptions.retrieve(subscriptionId);
    } catch (error) {
      console.error('Failed to retrieve subscription:', error);
      return null;
    }
  }

  /**
   * Cancel subscription
   */
  async cancelSubscription(subscriptionId: string): Promise<boolean> {
    try {
      await stripe.subscriptions.del(subscriptionId);
      return true;
    } catch (error) {
      console.error('Failed to cancel subscription:', error);
      return false;
    }
  }

  /**
   * Update subscription price
   */
  async updateSubscription(
    subscriptionId: string,
    newPriceId: string
  ): Promise<boolean> {
    try {
      const subscription = await stripe.subscriptions.retrieve(subscriptionId);

      if (subscription.items.data.length === 0) {
        return false;
      }

      await stripe.subscriptions.update(subscriptionId, {
        items: [
          {
            id: subscription.items.data[0].id,
            price: newPriceId,
          },
        ],
      });

      return true;
    } catch (error) {
      console.error('Failed to update subscription:', error);
      return false;
    }
  }

  /**
   * Create portal session (manage billing)
   */
  async createPortalSession({
    customerId,
    returnUrl,
  }: CreatePortalSessionParams): Promise<string | null> {
    try {
      const session = await stripe.billingPortal.sessions.create({
        customer: customerId,
        return_url: returnUrl,
      });

      return session.url;
    } catch (error) {
      console.error('Failed to create portal session:', error);
      return null;
    }
  }

  /**
   * Get customer invoices
   */
  async getInvoices(customerId: string): Promise<Stripe.Invoice[]> {
    try {
      const invoices = await stripe.invoices.list({
        customer: customerId,
        limit: 100,
      });

      return invoices.data;
    } catch (error) {
      console.error('Failed to retrieve invoices:', error);
      return [];
    }
  }

  /**
   * Create refund
   */
  async createRefund(
    chargeId: string,
    amountInCents?: number
  ): Promise<string | null> {
    try {
      const refund = await stripe.refunds.create({
        charge: chargeId,
        amount: amountInCents,
      });

      return refund.id;
    } catch (error) {
      console.error('Failed to create refund:', error);
      return null;
    }
  }

  /**
   * Record usage for metered billing
   */
  async recordUsage(
    subscriptionItemId: string,
    quantity: number,
    timestamp?: number
  ): Promise<boolean> {
    try {
      await stripe.subscriptionItems.createUsageRecord(subscriptionItemId, {
        quantity,
        timestamp,
      });

      return true;
    } catch (error) {
      console.error('Failed to record usage:', error);
      return false;
    }
  }

  /**
   * Verify webhook signature
   */
  verifyWebhookSignature(
    body: string,
    signature: string
  ): Stripe.Event | null {
    try {
      return stripe.webhooks.constructEvent(
        body,
        signature,
        process.env.STRIPE_WEBHOOK_SECRET || ''
      );
    } catch (error) {
      console.error('Failed to verify webhook signature:', error);
      return null;
    }
  }

  /**
   * Handle webhook event
   */
  async handleWebhookEvent(event: Stripe.Event): Promise<boolean> {
    try {
      switch (event.type) {
        case 'customer.subscription.created':
          return await this._handleSubscriptionCreated(
            event.data.object as Stripe.Subscription
          );
        case 'customer.subscription.updated':
          return await this._handleSubscriptionUpdated(
            event.data.object as Stripe.Subscription
          );
        case 'customer.subscription.deleted':
          return await this._handleSubscriptionDeleted(
            event.data.object as Stripe.Subscription
          );
        case 'invoice.payment_succeeded':
          return await this._handleInvoicePaymentSucceeded(
            event.data.object as Stripe.Invoice
          );
        case 'invoice.payment_failed':
          return await this._handleInvoicePaymentFailed(
            event.data.object as Stripe.Invoice
          );
        default:
          return true;
      }
    } catch (error) {
      console.error('Failed to handle webhook event:', error);
      return false;
    }
  }

  // Private webhook handlers
  private async _handleSubscriptionCreated(
    subscription: Stripe.Subscription
  ): Promise<boolean> {
    console.log('Subscription created:', subscription.id);
    // Update user subscription in database
    return true;
  }

  private async _handleSubscriptionUpdated(
    subscription: Stripe.Subscription
  ): Promise<boolean> {
    console.log('Subscription updated:', subscription.id);
    // Update user subscription in database
    return true;
  }

  private async _handleSubscriptionDeleted(
    subscription: Stripe.Subscription
  ): Promise<boolean> {
    console.log('Subscription deleted:', subscription.id);
    // Update user subscription in database, downgrade to free tier
    return true;
  }

  private async _handleInvoicePaymentSucceeded(
    invoice: Stripe.Invoice
  ): Promise<boolean> {
    console.log('Invoice payment succeeded:', invoice.id);
    // Log payment success
    return true;
  }

  private async _handleInvoicePaymentFailed(
    invoice: Stripe.Invoice
  ): Promise<boolean> {
    console.log('Invoice payment failed:', invoice.id);
    // Send failure notification to user
    return true;
  }
}

export default new StripeService();