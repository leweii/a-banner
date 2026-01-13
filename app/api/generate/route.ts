import { NextRequest, NextResponse } from 'next/server';
import { generateArtImage } from '@/lib/imagen';
import { checkRateLimit } from '@/lib/rateLimit';
import { ArtStyle, getAvailableStyles } from '@/lib/prompt';

const MAX_ASCII_LENGTH = 5000;

interface GenerateRequest {
  ascii: string;
  style: ArtStyle;
  captchaToken: string;
}

async function verifyCaptcha(token: string): Promise<boolean> {
  const secret = process.env.HCAPTCHA_SECRET_KEY;

  if (!secret) {
    // Skip captcha in development
    console.warn('HCAPTCHA_SECRET_KEY not set, skipping captcha verification');
    return true;
  }

  const response = await fetch('https://hcaptcha.com/siteverify', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: `secret=${secret}&response=${token}`,
  });

  const data = await response.json();
  return data.success === true;
}

function getClientIP(request: NextRequest): string {
  const forwarded = request.headers.get('x-forwarded-for');
  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }
  return request.headers.get('x-real-ip') || '127.0.0.1';
}

export async function POST(request: NextRequest) {
  try {
    const body: GenerateRequest = await request.json();
    const { ascii, style, captchaToken } = body;

    // Validate input
    if (!ascii || ascii.trim() === '') {
      return NextResponse.json(
        { error: 'ascii_required', message: 'ASCII art is required' },
        { status: 400 }
      );
    }

    // Validate ASCII length to prevent cost/security issues
    if (ascii.length > MAX_ASCII_LENGTH) {
      return NextResponse.json(
        { error: 'ascii_too_long', message: `ASCII art must be ${MAX_ASCII_LENGTH} characters or less` },
        { status: 400 }
      );
    }

    if (!style) {
      return NextResponse.json(
        { error: 'style_required', message: 'Art style is required' },
        { status: 400 }
      );
    }

    // Validate style is a valid ArtStyle value
    const validStyles = getAvailableStyles().map(s => s.key);
    if (!validStyles.includes(style)) {
      return NextResponse.json(
        { error: 'invalid_style', message: `Invalid style. Valid styles are: ${validStyles.join(', ')}` },
        { status: 400 }
      );
    }

    // Verify captcha
    if (!captchaToken) {
      return NextResponse.json(
        { error: 'captcha_required', message: 'Please complete the captcha' },
        { status: 400 }
      );
    }

    const captchaValid = await verifyCaptcha(captchaToken);
    if (!captchaValid) {
      return NextResponse.json(
        { error: 'captcha_failed', message: 'Captcha verification failed' },
        { status: 400 }
      );
    }

    // Check rate limit
    const ip = getClientIP(request);
    const rateLimit = await checkRateLimit(ip);

    if (!rateLimit.allowed) {
      return NextResponse.json(
        {
          error: 'rate_limit',
          message: 'Daily limit reached. Please try again tomorrow.',
          remaining: 0,
          reset: rateLimit.reset,
        },
        { status: 429 }
      );
    }

    // Generate image
    const result = await generateArtImage(ascii, style);

    return NextResponse.json({
      imageUrl: `data:${result.mimeType};base64,${result.imageData}`,
      remaining: rateLimit.remaining - 1,
    });
  } catch (error) {
    console.error('Image generation error:', error);
    console.error('Error details:', {
      name: error instanceof Error ? error.name : 'Unknown',
      message: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
    });
    return NextResponse.json(
      {
        error: 'generation_failed',
        message: error instanceof Error ? error.message : 'Failed to generate image'
      },
      { status: 500 }
    );
  }
}
