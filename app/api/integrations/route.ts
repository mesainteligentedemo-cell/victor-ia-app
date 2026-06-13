import { NextRequest, NextResponse } from 'next/server';
import { IntegrationsService } from '@/lib/services';
import { logger } from '@/lib/logger';

export async function GET(request: NextRequest) {
  try {
    const userId = request.nextUrl.searchParams.get('userId');
    if (!userId) return NextResponse.json({ error: 'Missing userId' }, { status: 400 });

    const integrations = await IntegrationsService.listIntegrations(userId);
    return NextResponse.json(integrations);
  } catch (error) {
  logger.error('API error', error as Error);
    return NextResponse.json({ error: 'An error occurred processing your request' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { action, data } = await request.json();

    // Validación: action requerido
    if (!action) {
      return NextResponse.json({ error: 'Missing action parameter', code: 400 }, { status: 400 });
    }

    const sanitizedAction = String(action).trim().toLowerCase();

    // Validar que action sea válido
    const validActions = ['connect', 'disconnect', 'sync'];
    if (!validActions.includes(sanitizedAction)) {
      return NextResponse.json({ error: `Invalid action. Must be one of: ${validActions.join(', ')}`, code: 400 }, { status: 400 });
    }

    // Validación: data requerido
    if (!data || typeof data !== 'object') {
      return NextResponse.json({ error: 'Missing or invalid data object', code: 400 }, { status: 400 });
    }

    // Validación: integrationId requerido
    if (!data.integrationId) {
      return NextResponse.json({ error: 'Missing integrationId in data', code: 400 }, { status: 400 });
    }

    const sanitizedIntegrationId = String(data.integrationId).trim();
    if (!sanitizedIntegrationId) {
      return NextResponse.json({ error: 'integrationId cannot be empty', code: 400 }, { status: 400 });
    }

    // Sanitizar data
    const sanitizedData = {
      integrationId: sanitizedIntegrationId,
      userId: data.userId ? String(data.userId).trim() : undefined,
      config: data.config && typeof data.config === 'object' ? data.config : {},
    };

    console.log(`Integration action: ${sanitizedAction} for integrationId: ${sanitizedIntegrationId}`);

    if (sanitizedAction === 'connect') {
      return NextResponse.json({ success: true, integrationId: sanitizedIntegrationId });
    } else if (sanitizedAction === 'disconnect') {
      return NextResponse.json({ success: true, integrationId: sanitizedIntegrationId, disconnected: true });
    } else if (sanitizedAction === 'sync') {
      return NextResponse.json({ synced: true, integrationId: sanitizedIntegrationId });
    }

    return NextResponse.json({ error: 'Invalid action', code: 400 }, { status: 400 });
  } catch (error) {
    logger.error('Integration error:', error as Error);
    return NextResponse.json({ error: 'An error occurred processing your request', code: 500 }, { status: 500 });
  }
}
