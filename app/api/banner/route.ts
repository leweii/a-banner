import { NextRequest, NextResponse } from 'next/server';
import { generateAscii, FontName, getAvailableFonts } from '@/lib/figlet';

interface BannerRequest {
  text: string;
  font?: FontName;
}

export async function POST(request: NextRequest) {
  let body: BannerRequest;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: 'invalid_json', message: 'Invalid JSON in request body' },
      { status: 400 }
    );
  }

  try {
    const { text, font = 'block' } = body;

    if (!text || text.trim() === '') {
      return NextResponse.json(
        { error: 'text_required', message: 'Text is required' },
        { status: 400 }
      );
    }

    if (text.length > 50) {
      return NextResponse.json(
        { error: 'text_too_long', message: 'Text must be 50 characters or less' },
        { status: 400 }
      );
    }

    const availableFonts = getAvailableFonts();
    if (!availableFonts.includes(font)) {
      return NextResponse.json(
        { error: 'invalid_font', message: `Invalid font. Available fonts: ${availableFonts.join(', ')}` },
        { status: 400 }
      );
    }

    const ascii = await generateAscii(text, font);

    return NextResponse.json({ ascii });
  } catch (error) {
    console.error('Banner generation error:', error);
    return NextResponse.json(
      { error: 'generation_failed', message: 'Failed to generate banner' },
      { status: 500 }
    );
  }
}
