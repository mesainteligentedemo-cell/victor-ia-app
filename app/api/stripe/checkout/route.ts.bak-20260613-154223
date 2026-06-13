import { NextResponse } from 'next/server';
import { createCheckoutSession } from '@/lib/stripe';

export const runtime = 'nodejs';

interface CheckoutRequest {
  customerId: string;
  priceId: string;
  successUrl: string;
  cancelUrl: string;
}

export async function POST(req: Request) {
  try {
    const { customerId, priceId, successUrl, cancelUrl } = (await req.json()) as CheckoutRequest;

    if (!customerId || !priceId) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const session = await createCheckoutSession(
      customerId,
      priceId,
      successUrl,
      cancelUrl
    );

    return NextResponse.json({
      success: true,
      sessionUrl: session.url,
      sessionId: session.id,
    });
  } catch (error) {
    console.error('Checkout session error:', error);
    return NextResponse.json(
      { error: 'Failed to create checkout session' },
      { status: 500 }
    );
  }
}