import { NextResponse } from 'next/server';
import { createCustomer } from '@/lib/stripe';
import { updateUser } from '@/lib/supabase';

export const runtime = 'nodejs';

interface CustomerRequest {
  userId: string;
  email: string;
  name: string;
}

export async function POST(req: Request) {
  try {
    const { userId, email, name } = (await req.json()) as CustomerRequest;

    if (!userId || !email) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Create Stripe customer
    const customer = await createCustomer(email, name);

    // Update user with Stripe customer ID
    await updateUser(userId, {
      stripe_customer_id: customer.id,
    } as any);

    return NextResponse.json({
      success: true,
      customerId: customer.id,
    });
  } catch (error) {
    console.error('Customer creation error:', error);
    return NextResponse.json(
      { error: 'Failed to create customer' },
      { status: 500 }
    );
  }
}