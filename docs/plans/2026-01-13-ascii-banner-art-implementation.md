# ASCII Banner Art Generator - Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Build a web app that generates ASCII banners and transforms them into AI art.

**Architecture:** Next.js 14 App Router with React frontend, serverless API routes for ASCII generation (figlet.js) and AI art generation (Google Imagen), rate limiting via Upstash Redis, captcha via hCaptcha.

**Tech Stack:** Next.js 14, React 18, TypeScript, figlet.js, @google/generative-ai, Upstash Redis, hCaptcha, Tailwind CSS

---

### Task 1: Initialize Next.js Project

**Files:**
- Create: `package.json`
- Create: `tsconfig.json`
- Create: `next.config.js`
- Create: `tailwind.config.js`
- Create: `.env.local.example`

**Step 1: Create Next.js project with TypeScript and Tailwind**

```bash
cd /Users/JakobHe/AgentWorkspace/a-banner
npx create-next-app@14 . --typescript --tailwind --eslint --app --src-dir=false --import-alias="@/*" --use-npm
```

**Step 2: Verify project structure**

```bash
ls -la app/
```

Expected: `layout.tsx`, `page.tsx`, `globals.css` files exist

**Step 3: Install dependencies**

```bash
npm install figlet @types/figlet @google/generative-ai @upstash/ratelimit @upstash/redis @hcaptcha/react-hcaptcha
```

**Step 4: Create environment example file**

Create `.env.local.example`:
```
GOOGLE_AI_API_KEY=your_google_ai_api_key
UPSTASH_REDIS_REST_URL=your_upstash_url
UPSTASH_REDIS_REST_TOKEN=your_upstash_token
HCAPTCHA_SITE_KEY=your_hcaptcha_site_key
HCAPTCHA_SECRET_KEY=your_hcaptcha_secret_key
```

**Step 5: Run dev server to verify setup**

```bash
npm run dev
```

Expected: Server starts at http://localhost:3000

**Step 6: Commit**

```bash
git add -A
git commit -m "feat: initialize Next.js 14 project with dependencies"
```

---

### Task 2: Create Figlet Library Wrapper

**Files:**
- Create: `lib/figlet.ts`
- Create: `lib/__tests__/figlet.test.ts`

**Step 1: Write the failing test**

Create `lib/__tests__/figlet.test.ts`:
```typescript
import { generateAscii, getAvailableFonts } from '../figlet';

describe('generateAscii', () => {
  it('should generate ASCII art from text', async () => {
    const result = await generateAscii('Hi', 'Standard');
    expect(result).toContain('_');
    expect(result).toContain('|');
    expect(result.length).toBeGreaterThan(10);
  });

  it('should throw error for empty text', async () => {
    await expect(generateAscii('', 'Standard')).rejects.toThrow('Text is required');
  });
});

describe('getAvailableFonts', () => {
  it('should return array of font names', () => {
    const fonts = getAvailableFonts();
    expect(Array.isArray(fonts)).toBe(true);
    expect(fonts).toContain('Standard');
    expect(fonts.length).toBeGreaterThan(0);
  });
});
```

**Step 2: Install Jest and run test to verify it fails**

```bash
npm install -D jest @types/jest ts-jest
npx ts-jest config:init
npm test -- lib/__tests__/figlet.test.ts
```

Expected: FAIL with "Cannot find module '../figlet'"

**Step 3: Write minimal implementation**

Create `lib/figlet.ts`:
```typescript
import figlet from 'figlet';

const AVAILABLE_FONTS = [
  'Standard',
  'Banner',
  'Big',
  'Block',
  'Bubble',
  'Digital',
  'Ivrit',
  'Lean',
  'Mini',
  'Script',
  'Shadow',
  'Slant',
  'Small',
  'Star Wars',
] as const;

export type FontName = (typeof AVAILABLE_FONTS)[number];

export function getAvailableFonts(): FontName[] {
  return [...AVAILABLE_FONTS];
}

export async function generateAscii(text: string, font: FontName = 'Standard'): Promise<string> {
  if (!text || text.trim() === '') {
    throw new Error('Text is required');
  }

  return new Promise((resolve, reject) => {
    figlet.text(text, { font }, (err, result) => {
      if (err) {
        reject(err);
        return;
      }
      resolve(result || '');
    });
  });
}
```

**Step 4: Run test to verify it passes**

```bash
npm test -- lib/__tests__/figlet.test.ts
```

Expected: PASS

**Step 5: Commit**

```bash
git add lib/figlet.ts lib/__tests__/figlet.test.ts jest.config.js
git commit -m "feat: add figlet wrapper with font support"
```

---

### Task 3: Create Banner API Route

**Files:**
- Create: `app/api/banner/route.ts`
- Create: `app/api/banner/__tests__/route.test.ts`

**Step 1: Write the failing test**

Create `app/api/banner/__tests__/route.test.ts`:
```typescript
import { POST } from '../route';
import { NextRequest } from 'next/server';

describe('POST /api/banner', () => {
  it('should generate ASCII banner', async () => {
    const request = new NextRequest('http://localhost/api/banner', {
      method: 'POST',
      body: JSON.stringify({ text: 'Hi', font: 'Standard' }),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.ascii).toBeDefined();
    expect(data.ascii.length).toBeGreaterThan(0);
  });

  it('should return 400 for empty text', async () => {
    const request = new NextRequest('http://localhost/api/banner', {
      method: 'POST',
      body: JSON.stringify({ text: '', font: 'Standard' }),
    });

    const response = await POST(request);
    expect(response.status).toBe(400);
  });
});
```

**Step 2: Run test to verify it fails**

```bash
npm test -- app/api/banner/__tests__/route.test.ts
```

Expected: FAIL with "Cannot find module '../route'"

**Step 3: Write minimal implementation**

Create `app/api/banner/route.ts`:
```typescript
import { NextRequest, NextResponse } from 'next/server';
import { generateAscii, FontName } from '@/lib/figlet';

interface BannerRequest {
  text: string;
  font?: FontName;
}

export async function POST(request: NextRequest) {
  try {
    const body: BannerRequest = await request.json();
    const { text, font = 'Standard' } = body;

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
```

**Step 4: Run test to verify it passes**

```bash
npm test -- app/api/banner/__tests__/route.test.ts
```

Expected: PASS

**Step 5: Commit**

```bash
git add app/api/banner/route.ts app/api/banner/__tests__/route.test.ts
git commit -m "feat: add /api/banner endpoint for ASCII generation"
```

---

### Task 4: Create Rate Limiting Utility

**Files:**
- Create: `lib/rateLimit.ts`
- Create: `lib/__tests__/rateLimit.test.ts`

**Step 1: Write the failing test**

Create `lib/__tests__/rateLimit.test.ts`:
```typescript
import { checkRateLimit, RateLimitResult } from '../rateLimit';

// Mock Upstash Redis
jest.mock('@upstash/redis', () => ({
  Redis: jest.fn().mockImplementation(() => ({
    get: jest.fn(),
    set: jest.fn(),
    incr: jest.fn(),
  })),
}));

describe('checkRateLimit', () => {
  it('should return allowed: true when under limit', async () => {
    const result = await checkRateLimit('127.0.0.1');
    expect(result).toHaveProperty('allowed');
    expect(result).toHaveProperty('remaining');
  });
});
```

**Step 2: Run test to verify it fails**

```bash
npm test -- lib/__tests__/rateLimit.test.ts
```

Expected: FAIL with "Cannot find module '../rateLimit'"

**Step 3: Write minimal implementation**

Create `lib/rateLimit.ts`:
```typescript
import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';

export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  reset: number;
}

const DAILY_LIMIT = 10;

let ratelimit: Ratelimit | null = null;

function getRatelimit(): Ratelimit {
  if (!ratelimit) {
    if (!process.env.UPSTASH_REDIS_REST_URL || !process.env.UPSTASH_REDIS_REST_TOKEN) {
      // Return a mock for development without Redis
      return {
        limit: async () => ({
          success: true,
          remaining: DAILY_LIMIT,
          reset: Date.now() + 86400000,
          limit: DAILY_LIMIT,
        }),
      } as unknown as Ratelimit;
    }

    const redis = new Redis({
      url: process.env.UPSTASH_REDIS_REST_URL,
      token: process.env.UPSTASH_REDIS_REST_TOKEN,
    });

    ratelimit = new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(DAILY_LIMIT, '1 d'),
      analytics: true,
      prefix: 'ascii-banner',
    });
  }
  return ratelimit;
}

export async function checkRateLimit(ip: string): Promise<RateLimitResult> {
  const limiter = getRatelimit();
  const { success, remaining, reset } = await limiter.limit(ip);

  return {
    allowed: success,
    remaining,
    reset,
  };
}
```

**Step 4: Run test to verify it passes**

```bash
npm test -- lib/__tests__/rateLimit.test.ts
```

Expected: PASS

**Step 5: Commit**

```bash
git add lib/rateLimit.ts lib/__tests__/rateLimit.test.ts
git commit -m "feat: add rate limiting utility with Upstash Redis"
```

---

### Task 5: Create Prompt Builder Utility

**Files:**
- Create: `lib/prompt.ts`
- Create: `lib/__tests__/prompt.test.ts`

**Step 1: Write the failing test**

Create `lib/__tests__/prompt.test.ts`:
```typescript
import { buildPrompt, ArtStyle, getAvailableStyles } from '../prompt';

describe('buildPrompt', () => {
  it('should build prompt with watercolor style', () => {
    const ascii = ' _   _ \n| | | |\n|_| |_|';
    const prompt = buildPrompt(ascii, 'watercolor');

    expect(prompt).toContain('watercolor');
    expect(prompt).toContain(ascii);
  });

  it('should include style description', () => {
    const prompt = buildPrompt('TEST', 'neon');
    expect(prompt).toContain('glowing');
    expect(prompt).toContain('neon');
  });
});

describe('getAvailableStyles', () => {
  it('should return all 5 styles', () => {
    const styles = getAvailableStyles();
    expect(styles).toHaveLength(5);
    expect(styles.map((s) => s.key)).toContain('watercolor');
    expect(styles.map((s) => s.key)).toContain('oil');
    expect(styles.map((s) => s.key)).toContain('pixel');
    expect(styles.map((s) => s.key)).toContain('neon');
    expect(styles.map((s) => s.key)).toContain('graffiti');
  });
});
```

**Step 2: Run test to verify it fails**

```bash
npm test -- lib/__tests__/prompt.test.ts
```

Expected: FAIL with "Cannot find module '../prompt'"

**Step 3: Write minimal implementation**

Create `lib/prompt.ts`:
```typescript
export type ArtStyle = 'watercolor' | 'oil' | 'pixel' | 'neon' | 'graffiti';

interface StyleInfo {
  key: ArtStyle;
  name: string;
  description: string;
  prompt: string;
}

const STYLES: Record<ArtStyle, StyleInfo> = {
  watercolor: {
    key: 'watercolor',
    name: '水彩',
    description: '柔和、流动、淡雅',
    prompt: 'watercolor painting style, soft edges, flowing colors, delicate washes, artistic',
  },
  oil: {
    key: 'oil',
    name: '油画',
    description: '厚重、笔触明显',
    prompt: 'oil painting style, visible brush strokes, rich textures, impasto technique, classical',
  },
  pixel: {
    key: 'pixel',
    name: '像素',
    description: '复古游戏感',
    prompt: 'pixel art style, 8-bit retro game aesthetic, blocky pixels, vibrant colors, nostalgic',
  },
  neon: {
    key: 'neon',
    name: '霓虹',
    description: '发光、赛博朋克',
    prompt: 'neon sign style, glowing lights, dark background, cyberpunk aesthetic, electric colors',
  },
  graffiti: {
    key: 'graffiti',
    name: '涂鸦',
    description: '街头、喷漆质感',
    prompt: 'street graffiti style, spray paint effect, urban wall, bold colors, street art',
  },
};

export function getAvailableStyles(): StyleInfo[] {
  return Object.values(STYLES);
}

export function buildPrompt(ascii: string, style: ArtStyle): string {
  const styleInfo = STYLES[style];

  return `Create an artistic typography image based on this ASCII art text:

${ascii}

Transform this ASCII art into a beautiful ${styleInfo.prompt}.

Requirements:
- Keep the text clearly readable and prominent
- Apply the artistic style to the entire composition
- Make it visually striking and suitable for sharing
- High quality, detailed artwork`;
}
```

**Step 4: Run test to verify it passes**

```bash
npm test -- lib/__tests__/prompt.test.ts
```

Expected: PASS

**Step 5: Commit**

```bash
git add lib/prompt.ts lib/__tests__/prompt.test.ts
git commit -m "feat: add prompt builder for AI art styles"
```

---

### Task 6: Create Google Imagen API Wrapper

**Files:**
- Create: `lib/imagen.ts`
- Create: `lib/__tests__/imagen.test.ts`

**Step 1: Write the failing test**

Create `lib/__tests__/imagen.test.ts`:
```typescript
import { generateArtImage } from '../imagen';

// Mock Google AI
jest.mock('@google/generative-ai', () => ({
  GoogleGenerativeAI: jest.fn().mockImplementation(() => ({
    getGenerativeModel: jest.fn().mockReturnValue({
      generateContent: jest.fn().mockResolvedValue({
        response: {
          candidates: [
            {
              content: {
                parts: [{ inlineData: { data: 'base64data', mimeType: 'image/png' } }],
              },
            },
          ],
        },
      }),
    }),
  })),
}));

describe('generateArtImage', () => {
  it('should return base64 image data', async () => {
    const result = await generateArtImage('ASCII ART', 'watercolor');
    expect(result).toHaveProperty('imageData');
    expect(result).toHaveProperty('mimeType');
  });
});
```

**Step 2: Run test to verify it fails**

```bash
npm test -- lib/__tests__/imagen.test.ts
```

Expected: FAIL with "Cannot find module '../imagen'"

**Step 3: Write minimal implementation**

Create `lib/imagen.ts`:
```typescript
import { GoogleGenerativeAI } from '@google/generative-ai';
import { buildPrompt, ArtStyle } from './prompt';

export interface ImageResult {
  imageData: string;
  mimeType: string;
}

let genAI: GoogleGenerativeAI | null = null;

function getGenAI(): GoogleGenerativeAI {
  if (!genAI) {
    const apiKey = process.env.GOOGLE_AI_API_KEY;
    if (!apiKey) {
      throw new Error('GOOGLE_AI_API_KEY is not configured');
    }
    genAI = new GoogleGenerativeAI(apiKey);
  }
  return genAI;
}

export async function generateArtImage(ascii: string, style: ArtStyle): Promise<ImageResult> {
  const ai = getGenAI();
  const model = ai.getGenerativeModel({ model: 'gemini-2.0-flash-exp-image-generation' });

  const prompt = buildPrompt(ascii, style);

  const result = await model.generateContent({
    contents: [{ role: 'user', parts: [{ text: prompt }] }],
    generationConfig: {
      responseModalities: ['image', 'text'],
    } as any,
  });

  const response = result.response;
  const candidate = response.candidates?.[0];

  if (!candidate?.content?.parts) {
    throw new Error('No image generated');
  }

  for (const part of candidate.content.parts) {
    if ('inlineData' in part && part.inlineData) {
      return {
        imageData: part.inlineData.data,
        mimeType: part.inlineData.mimeType || 'image/png',
      };
    }
  }

  throw new Error('No image data in response');
}
```

**Step 4: Run test to verify it passes**

```bash
npm test -- lib/__tests__/imagen.test.ts
```

Expected: PASS

**Step 5: Commit**

```bash
git add lib/imagen.ts lib/__tests__/imagen.test.ts
git commit -m "feat: add Google Imagen API wrapper"
```

---

### Task 7: Create Generate API Route

**Files:**
- Create: `app/api/generate/route.ts`

**Step 1: Write the implementation**

Create `app/api/generate/route.ts`:
```typescript
import { NextRequest, NextResponse } from 'next/server';
import { generateArtImage } from '@/lib/imagen';
import { checkRateLimit } from '@/lib/rateLimit';
import { ArtStyle } from '@/lib/prompt';

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

    if (!style) {
      return NextResponse.json(
        { error: 'style_required', message: 'Art style is required' },
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
    return NextResponse.json(
      { error: 'generation_failed', message: 'Failed to generate image' },
      { status: 500 }
    );
  }
}
```

**Step 2: Commit**

```bash
git add app/api/generate/route.ts
git commit -m "feat: add /api/generate endpoint for AI art generation"
```

---

### Task 8: Create Frontend Components

**Files:**
- Create: `components/TextInput.tsx`
- Create: `components/FontSelector.tsx`
- Create: `components/StyleSelector.tsx`
- Create: `components/AsciiPreview.tsx`
- Create: `components/ResultDisplay.tsx`
- Create: `components/Captcha.tsx`

**Step 1: Create TextInput component**

Create `components/TextInput.tsx`:
```tsx
'use client';

interface TextInputProps {
  value: string;
  onChange: (value: string) => void;
  maxLength?: number;
}

export default function TextInput({ value, onChange, maxLength = 50 }: TextInputProps) {
  return (
    <div className="w-full">
      <label htmlFor="text-input" className="block text-sm font-medium mb-2">
        输入文字
      </label>
      <input
        id="text-input"
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        maxLength={maxLength}
        placeholder="输入要转换的文字..."
        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
      />
      <p className="text-sm text-gray-500 mt-1">
        {value.length}/{maxLength} 字符
      </p>
    </div>
  );
}
```

**Step 2: Create FontSelector component**

Create `components/FontSelector.tsx`:
```tsx
'use client';

import { FontName } from '@/lib/figlet';

interface FontSelectorProps {
  value: FontName;
  onChange: (font: FontName) => void;
  fonts: FontName[];
}

export default function FontSelector({ value, onChange, fonts }: FontSelectorProps) {
  return (
    <div className="w-full">
      <label htmlFor="font-selector" className="block text-sm font-medium mb-2">
        选择字体
      </label>
      <select
        id="font-selector"
        value={value}
        onChange={(e) => onChange(e.target.value as FontName)}
        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
      >
        {fonts.map((font) => (
          <option key={font} value={font}>
            {font}
          </option>
        ))}
      </select>
    </div>
  );
}
```

**Step 3: Create StyleSelector component**

Create `components/StyleSelector.tsx`:
```tsx
'use client';

import { ArtStyle } from '@/lib/prompt';

interface StyleInfo {
  key: ArtStyle;
  name: string;
  description: string;
}

interface StyleSelectorProps {
  value: ArtStyle;
  onChange: (style: ArtStyle) => void;
  styles: StyleInfo[];
}

export default function StyleSelector({ value, onChange, styles }: StyleSelectorProps) {
  return (
    <div className="w-full">
      <label className="block text-sm font-medium mb-2">选择艺术风格</label>
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        {styles.map((style) => (
          <button
            key={style.key}
            onClick={() => onChange(style.key)}
            className={`p-4 rounded-lg border-2 transition-all ${
              value === style.key
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <div className="font-medium">{style.name}</div>
            <div className="text-xs text-gray-500 mt-1">{style.description}</div>
          </button>
        ))}
      </div>
    </div>
  );
}
```

**Step 4: Create AsciiPreview component**

Create `components/AsciiPreview.tsx`:
```tsx
'use client';

interface AsciiPreviewProps {
  ascii: string;
  loading?: boolean;
}

export default function AsciiPreview({ ascii, loading }: AsciiPreviewProps) {
  return (
    <div className="w-full">
      <label className="block text-sm font-medium mb-2">ASCII 预览</label>
      <div className="bg-gray-900 text-green-400 p-4 rounded-lg overflow-x-auto min-h-[150px]">
        {loading ? (
          <div className="flex items-center justify-center h-[120px]">
            <div className="animate-pulse">生成中...</div>
          </div>
        ) : (
          <pre className="font-mono text-xs md:text-sm whitespace-pre">{ascii || '在上方输入文字预览 ASCII 效果'}</pre>
        )}
      </div>
    </div>
  );
}
```

**Step 5: Create ResultDisplay component**

Create `components/ResultDisplay.tsx`:
```tsx
'use client';

interface ResultDisplayProps {
  imageUrl: string | null;
  loading?: boolean;
  onDownload: () => void;
}

export default function ResultDisplay({ imageUrl, loading, onDownload }: ResultDisplayProps) {
  if (loading) {
    return (
      <div className="w-full bg-gray-100 rounded-lg p-8 flex flex-col items-center justify-center min-h-[300px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mb-4"></div>
        <p className="text-gray-600">AI 正在生成艺术图片...</p>
        <p className="text-sm text-gray-400 mt-2">大约需要 3-5 秒</p>
      </div>
    );
  }

  if (!imageUrl) {
    return (
      <div className="w-full bg-gray-100 rounded-lg p-8 flex items-center justify-center min-h-[300px]">
        <p className="text-gray-500">完成验证后点击生成按钮</p>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="bg-gray-100 rounded-lg p-4">
        <img src={imageUrl} alt="Generated Art" className="w-full rounded-lg" />
      </div>
      <button
        onClick={onDownload}
        className="mt-4 w-full py-3 bg-green-500 hover:bg-green-600 text-white font-medium rounded-lg transition-colors"
      >
        下载图片
      </button>
    </div>
  );
}
```

**Step 6: Create Captcha component**

Create `components/Captcha.tsx`:
```tsx
'use client';

import HCaptcha from '@hcaptcha/react-hcaptcha';
import { useRef } from 'react';

interface CaptchaProps {
  onVerify: (token: string) => void;
  onExpire: () => void;
}

export default function Captcha({ onVerify, onExpire }: CaptchaProps) {
  const captchaRef = useRef<HCaptcha>(null);
  const siteKey = process.env.NEXT_PUBLIC_HCAPTCHA_SITE_KEY || '10000000-ffff-ffff-ffff-000000000001';

  return (
    <div className="flex justify-center">
      <HCaptcha
        ref={captchaRef}
        sitekey={siteKey}
        onVerify={onVerify}
        onExpire={onExpire}
      />
    </div>
  );
}
```

**Step 7: Commit**

```bash
git add components/
git commit -m "feat: add frontend components for banner generator"
```

---

### Task 9: Create Main Page

**Files:**
- Modify: `app/page.tsx`
- Modify: `app/layout.tsx`
- Modify: `app/globals.css`

**Step 1: Update layout.tsx**

Replace `app/layout.tsx`:
```tsx
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'ASCII Banner Art Generator',
  description: 'Generate ASCII banners and transform them into AI art',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
```

**Step 2: Create main page**

Replace `app/page.tsx`:
```tsx
'use client';

import { useState, useEffect, useCallback } from 'react';
import TextInput from '@/components/TextInput';
import FontSelector from '@/components/FontSelector';
import StyleSelector from '@/components/StyleSelector';
import AsciiPreview from '@/components/AsciiPreview';
import ResultDisplay from '@/components/ResultDisplay';
import Captcha from '@/components/Captcha';
import { FontName } from '@/lib/figlet';
import { ArtStyle } from '@/lib/prompt';

const FONTS: FontName[] = [
  'Standard', 'Banner', 'Big', 'Block', 'Bubble',
  'Digital', 'Ivrit', 'Lean', 'Mini', 'Script',
  'Shadow', 'Slant', 'Small', 'Star Wars',
];

const STYLES = [
  { key: 'watercolor' as ArtStyle, name: '水彩', description: '柔和、流动、淡雅' },
  { key: 'oil' as ArtStyle, name: '油画', description: '厚重、笔触明显' },
  { key: 'pixel' as ArtStyle, name: '像素', description: '复古游戏感' },
  { key: 'neon' as ArtStyle, name: '霓虹', description: '发光、赛博朋克' },
  { key: 'graffiti' as ArtStyle, name: '涂鸦', description: '街头、喷漆质感' },
];

export default function Home() {
  const [text, setText] = useState('');
  const [font, setFont] = useState<FontName>('Standard');
  const [style, setStyle] = useState<ArtStyle>('watercolor');
  const [ascii, setAscii] = useState('');
  const [asciiLoading, setAsciiLoading] = useState(false);
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [imageLoading, setImageLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [remaining, setRemaining] = useState<number | null>(null);

  // Debounced ASCII generation
  useEffect(() => {
    if (!text.trim()) {
      setAscii('');
      return;
    }

    const timer = setTimeout(async () => {
      setAsciiLoading(true);
      try {
        const response = await fetch('/api/banner', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ text, font }),
        });
        const data = await response.json();
        if (data.ascii) {
          setAscii(data.ascii);
        }
      } catch (err) {
        console.error('ASCII generation failed:', err);
      } finally {
        setAsciiLoading(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [text, font]);

  const handleGenerate = useCallback(async () => {
    if (!ascii || !captchaToken) {
      setError('请先输入文字并完成验证');
      return;
    }

    setError(null);
    setImageLoading(true);

    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ascii, style, captchaToken }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || 'Generation failed');
        return;
      }

      setImageUrl(data.imageUrl);
      setRemaining(data.remaining);
    } catch (err) {
      setError('生成失败，请重试');
      console.error('Generation error:', err);
    } finally {
      setImageLoading(false);
      setCaptchaToken(null);
    }
  }, [ascii, style, captchaToken]);

  const handleDownload = useCallback(() => {
    if (!imageUrl) return;

    const link = document.createElement('a');
    link.href = imageUrl;
    link.download = `ascii-art-${Date.now()}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }, [imageUrl]);

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-2">ASCII Banner Art</h1>
        <p className="text-gray-600 text-center mb-8">
          将文字转换为 ASCII 艺术，再用 AI 生成独特的艺术图片
        </p>

        <div className="bg-white rounded-xl shadow-lg p-6 space-y-6">
          {/* Input Section */}
          <div className="grid md:grid-cols-2 gap-4">
            <TextInput value={text} onChange={setText} />
            <FontSelector value={font} onChange={setFont} fonts={FONTS} />
          </div>

          {/* ASCII Preview */}
          <AsciiPreview ascii={ascii} loading={asciiLoading} />

          {/* Style Selection */}
          <StyleSelector value={style} onChange={setStyle} styles={STYLES} />

          {/* Captcha & Generate */}
          <div className="space-y-4">
            <Captcha
              onVerify={(token) => setCaptchaToken(token)}
              onExpire={() => setCaptchaToken(null)}
            />

            <button
              onClick={handleGenerate}
              disabled={!ascii || !captchaToken || imageLoading}
              className={`w-full py-4 font-medium rounded-lg transition-colors ${
                !ascii || !captchaToken || imageLoading
                  ? 'bg-gray-300 cursor-not-allowed'
                  : 'bg-blue-500 hover:bg-blue-600 text-white'
              }`}
            >
              {imageLoading ? '生成中...' : '生成 AI 艺术图片'}
            </button>

            {error && (
              <p className="text-red-500 text-center">{error}</p>
            )}

            {remaining !== null && (
              <p className="text-gray-500 text-center text-sm">
                今日剩余次数: {remaining}
              </p>
            )}
          </div>

          {/* Result */}
          <ResultDisplay
            imageUrl={imageUrl}
            loading={imageLoading}
            onDownload={handleDownload}
          />
        </div>

        <footer className="text-center text-gray-400 text-sm mt-8">
          Powered by figlet.js & Google Imagen AI
        </footer>
      </div>
    </main>
  );
}
```

**Step 3: Commit**

```bash
git add app/page.tsx app/layout.tsx
git commit -m "feat: implement main page with all components integrated"
```

---

### Task 10: Final Configuration and Testing

**Files:**
- Create: `vercel.json`
- Update: `.env.local.example`

**Step 1: Create Vercel configuration**

Create `vercel.json`:
```json
{
  "functions": {
    "app/api/generate/route.ts": {
      "maxDuration": 30
    }
  }
}
```

**Step 2: Update environment example**

Update `.env.local.example`:
```
# Google AI
GOOGLE_AI_API_KEY=your_google_ai_api_key

# Upstash Redis (for rate limiting)
UPSTASH_REDIS_REST_URL=your_upstash_url
UPSTASH_REDIS_REST_TOKEN=your_upstash_token

# hCaptcha
HCAPTCHA_SECRET_KEY=your_hcaptcha_secret_key
NEXT_PUBLIC_HCAPTCHA_SITE_KEY=your_hcaptcha_site_key
```

**Step 3: Run all tests**

```bash
npm test
```

Expected: All tests pass

**Step 4: Run development server and manual test**

```bash
npm run dev
```

Test manually:
1. Enter text, see ASCII preview
2. Select font, see preview update
3. Select art style
4. Complete captcha
5. Click generate
6. Download result

**Step 5: Build for production**

```bash
npm run build
```

Expected: Build succeeds without errors

**Step 6: Final commit**

```bash
git add vercel.json .env.local.example
git commit -m "feat: add Vercel config and finalize setup"
```

---

## Summary

10 tasks total:
1. Initialize Next.js project
2. Create Figlet wrapper
3. Create Banner API
4. Create Rate Limiting utility
5. Create Prompt Builder
6. Create Imagen API wrapper
7. Create Generate API
8. Create Frontend components
9. Create Main page
10. Final configuration

**Estimated commits**: 10
