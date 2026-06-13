import { NextRequest, NextResponse } from 'next/server';
import { CRMService } from '@/lib/services';

export async function GET(request: NextRequest) {
  try {
    const userId = request.nextUrl.searchParams.get('userId');
    if (!userId) return NextResponse.json({ error: 'Missing userId' }, { status: 400 });

    const metrics = await CRMService.getPipeline(userId);
    return NextResponse.json(metrics);
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { userId, action, data } = await request.json();

    // Validación: userId y action requeridos
    if (!userId || !action) {
      return NextResponse.json({ error: 'Missing userId or action', code: 400 }, { status: 400 });
    }

    const sanitizedUserId = String(userId).trim();
    const sanitizedAction = String(action).trim().toLowerCase();

    if (!sanitizedUserId) {
      return NextResponse.json({ error: 'userId cannot be empty', code: 400 }, { status: 400 });
    }

    if (sanitizedAction === 'create') {
      // Validar que data existe y tiene al menos un campo requerido
      if (!data) {
        return NextResponse.json({ error: 'Missing data object for create action', code: 400 }, { status: 400 });
      }

      const { name, company, email } = data;
      if (!name && !company && !email) {
        return NextResponse.json({ error: 'At least one of name, company, or email is required', code: 400 }, { status: 400 });
      }

      // Sanitizar strings
      const sanitizedData = {
        name: name ? String(name).trim() : undefined,
        company: company ? String(company).trim() : undefined,
        email: email ? String(email).trim().toLowerCase() : undefined,
        ...data,
      };

      console.log(`Creating prospect for user: ${sanitizedUserId}`);
      const prospect = await CRMService.createProspect(sanitizedUserId, sanitizedData);
      return NextResponse.json(prospect);
    } else if (sanitizedAction === 'update') {
      if (!data || !data.id) {
        return NextResponse.json({ error: 'Missing data or data.id for update action', code: 400 }, { status: 400 });
      }

      const sanitizedData = {
        id: String(data.id).trim(),
        name: data.name ? String(data.name).trim() : data.name,
        company: data.company ? String(data.company).trim() : data.company,
        email: data.email ? String(data.email).trim().toLowerCase() : data.email,
        ...data,
      };

      console.log(`Updating prospect: ${sanitizedData.id}`);
      const prospect = await CRMService.updateProspect(sanitizedData.id, sanitizedData);
      return NextResponse.json(prospect);
    } else if (sanitizedAction === 'move') {
      if (!data || !data.prospectId || !data.stage) {
        return NextResponse.json({ error: 'Missing data.prospectId or data.stage for move action', code: 400 }, { status: 400 });
      }

      const sanitizedProspectId = String(data.prospectId).trim();
      const sanitizedStage = String(data.stage).trim();

      console.log(`Moving prospect ${sanitizedProspectId} to stage: ${sanitizedStage}`);
      await CRMService.moveProspectInPipeline(sanitizedProspectId, sanitizedStage);
      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ error: 'Invalid action. Must be create, update, or move', code: 400 }, { status: 400 });
  } catch (error) {
    console.error('CRM error:', error);
    return NextResponse.json({ error: String(error), code: 500 }, { status: 500 });
  }
}
