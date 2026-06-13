import { NextRequest, NextResponse } from 'next/server';
import { GeneratorsService } from '@/lib/services';

export async function POST(request: NextRequest) {
  try {
    const { userId, type, params } = await request.json();

    let result;
    switch (type) {
      case 'image':
        result = await GeneratorsService.generateImage(userId, params);
        break;
      case 'video':
        result = await GeneratorsService.generateVideo(userId, params);
        break;
      case 'presentation':
        result = await GeneratorsService.generatePresentation(userId, params);
        break;
      case 'email':
        result = await GeneratorsService.generateEmail(userId, params);
        break;
      case 'landing-page':
        result = await GeneratorsService.generateLandingPage(userId, params);
        break;
      case 'social-post':
        result = await GeneratorsService.generateSocialPost(userId, params);
        break;
      case 'audio':
        result = await GeneratorsService.generateAudio(userId, params);
        break;
      case 'pdf':
        result = await GeneratorsService.generatePDF(userId, params);
        break;
      default:
        return NextResponse.json({ error: 'Invalid type' }, { status: 400 });
    }

    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    const userId = request.nextUrl.searchParams.get('userId');
    if (!userId) return NextResponse.json({ error: 'Missing userId' }, { status: 400 });

    const history = await GeneratorsService.getHistory(userId);
    return NextResponse.json(history);
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}
