import { NextResponse } from 'next/server';
import { Webhook } from 'svix';
import { createUser } from '@/lib/supabase';

export const runtime = 'nodejs';

interface ClerkEvent {
  data: {
    id: string;
    email_addresses?: Array<{ email_address: string }>;
    first_name?: string;
    last_name?: string;
  };
  type: string;
}

export async function POST(req: Request) {
  try {
    const body = await req.text();
    const svixSecret = process.env.CLERK_WEBHOOK_SECRET || '';

    if (!svixSecret) {
      console.error('Missing CLERK_WEBHOOK_SECRET');
      return NextResponse.json(
        { error: 'Webhook secret not configured' },
        { status: 500 }
      );
    }

    const wh = new Webhook(svixSecret);
    const event = wh.verify(body, req.headers) as ClerkEvent;

    switch (event.type) {
      case 'user.created': {
        const { id, email_addresses, first_name, last_name } = event.data;
        const email = email_addresses?.[0]?.email_address;

        if (!email) {
          console.error('No email found for user', id);
          break;
        }

        const name = `${first_name || ''} ${last_name || ''}`.trim() || 'User';

        try {
          await createUser({
            id,
            email,
            name,
            plan: 'starter',
            credits: 1000,
          });

          console.log(`User created in Supabase: ${email}`);
        } catch (error) {
          console.error('Error creating user in Supabase:', error);
        }
        break;
      }

      case 'user.deleted': {
        const { id } = event.data;
        // Handle user deletion if needed
        console.log(`User deleted: ${id}`);
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