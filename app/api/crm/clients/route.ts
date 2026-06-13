import { NextResponse } from 'next/server';

export const runtime = 'nodejs';

interface ClientRequest {
  userId: string;
  name: string;
  company?: string;
  type?: string;
  stage?: 'prospect' | 'proposal' | 'authorized' | 'completed';
  value?: number;
  email?: string;
  phone?: string;
}

// In-memory storage (replace with Supabase)
const clients: Record<string, any> = {};

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as ClientRequest;
    const { userId, name, company, type, stage, value, email, phone } = body;

    if (!userId || !name) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const client = {
      id: crypto.randomUUID(),
      userId,
      name,
      company,
      type,
      stage: stage || 'prospect',
      value: value || 0,
      email,
      phone,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    clients[client.id] = client;

    return NextResponse.json({
      success: true,
      client,
    });
  } catch (error) {
    console.error('Client creation error:', error);
    return NextResponse.json(
      { error: 'Failed to create client' },
      { status: 500 }
    );
  }
}

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const userId = url.searchParams.get('userId');

    if (!userId) {
      return NextResponse.json(
        { error: 'Missing userId' },
        { status: 400 }
      );
    }

    const userClients = Object.values(clients).filter(
      (c) => c.userId === userId
    );

    return NextResponse.json({
      success: true,
      clients: userClients,
      count: userClients.length,
    });
  } catch (error) {
    console.error('Clients fetch error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch clients' },
      { status: 500 }
    );
  }
}