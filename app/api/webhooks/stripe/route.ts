import { NextResponse } from 'next/server';
import { constructWebhookEvent } from '@/lib/stripe';
import { supabase, updateUser } from '@/lib/supabase';

export const runtime = 'nodejs';

export async function POST(req: Request) {
  try {
    const body = await req.text();
    const signature = req.headers.get('stripe-signature') || '';

    const event = constructWebhookEvent(body, signature);

    switch (event.type) {
      case 'customer.subscription.updated': {
        const subscription = event.data.object;
        const customerId = subscription.customer as string;

        // Get user from Stripe customer ID
        const { data: users, error } = await supabase
          .from('users')
          .select('id')
          .eq('stripe_customer_id', customerId);

        if (error || !users || users.length === 0) {
          console.error('User not found for customer:', customerId);
          break;
        }

        const userId = users[0].id;
        const plan = subscription.items.data[0]?.metadata?.plan || 'pro';

        await updateUser(userId, { plan: plan as any });
        console.log(`Updated subscription for user ${userId}: ${plan}`);
        break;
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object;
        const customerId = subscription.customer as string;

        const { data: users, error } = await supabase
          .from('users')
          .select('id')
          .eq('stripe_customer_id', customerId);

        if (error || !users || users.length === 0) break;

        const userId = users[0].id;
        await updateUser(userId, { plan: 'starter' });
        console.log(`Downgraded user ${userId} to starter`);
        break;
      }

      case 'invoice.payment_succeeded': {
        const invoice = event.data.object;
        console.log(`Payment succeeded for invoice: ${invoice.id}`);
        break;
      }

      case 'invoice.payment_failed': {
        const invoice = event.data.object;
        console.log(`Payment failed for invoice: ${invoice.id}`);
        break;
      }

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json(
      { error: 'Webhook handler failed' },
      { status: 400 }
    );
  }
}