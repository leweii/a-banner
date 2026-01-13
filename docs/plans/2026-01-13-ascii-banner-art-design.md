# ASCII Banner Art Generator - Design Document

## Overview

A web application that generates ASCII art banners and transforms them into artistic images using AI. Target users are general consumers seeking entertainment and personalized content for sharing.

## Core Features

1. **Text Input** - User enters text to convert
2. **ASCII Generation** - Convert text to ASCII art using figlet.js
3. **Style Selection** - Choose from 5 artistic styles
4. **AI Art Generation** - Transform ASCII into styled artwork via Google Imagen
5. **Download** - Save result as PNG/JPG

## Technical Architecture

```
┌─────────────────────────────────────────────────┐
│              Vercel Deployment                  │
│                                                 │
│  ┌───────────────────────────────────────────┐ │
│  │         Next.js Application               │ │
│  │                                           │ │
│  │  Frontend (React)                         │ │
│  │  ├── Text input                           │ │
│  │  ├── Font selector (figlet fonts)         │ │
│  │  ├── Art style selector                   │ │
│  │  ├── Real-time ASCII preview              │ │
│  │  └── Result display + download            │ │
│  │                                           │ │
│  │  API Routes (Serverless)                  │ │
│  │  ├── /api/banner - figlet.js ASCII gen    │ │
│  │  └── /api/generate - Google Imagen call   │ │
│  │       ├── Captcha verification            │ │
│  │       └── IP rate limiting                │ │
│  └───────────────────────────────────────────┘ │
└─────────────────────────────────────────────────┘
```

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **ASCII Generation**: figlet.js
- **AI API**: Google Imagen (Gemini)
- **Captcha**: hCaptcha or Cloudflare Turnstile
- **Rate Limiting**: Upstash Redis
- **Deployment**: Vercel

## User Flow

```
① Input text → ② Select font → ③ Preview ASCII
                                      ↓
⑥ Download ← ⑤ View result ← ④ Select style + Generate
```

- Steps ①②③: Real-time, no waiting
- Step ④: Captcha required before generation
- Step ⑤: Loading animation (~3-5 seconds)
- Step ⑥: PNG/JPG format options

## API Design

### 1. ASCII Banner Generation

```
POST /api/banner

Request:
{
  "text": "HELLO",
  "font": "Standard"
}

Response:
{
  "ascii": "  _   _  ___  _     _      ___  \n ..."
}
```

### 2. AI Art Generation

```
POST /api/generate

Request:
{
  "ascii": "...",
  "style": "watercolor",
  "captchaToken": "xxx"
}

Response:
{
  "imageUrl": "data:image/png;base64,..."
}

Error Responses:
{ "error": "rate_limit", "message": "Daily limit reached" }
{ "error": "captcha_failed", "message": "Captcha verification failed" }
```

### Rate Limiting

- 10 generations per IP per day
- Stored in Upstash Redis
- Captcha required for each generation

## Art Styles

| Style | Key | Description |
|-------|-----|-------------|
| Watercolor | watercolor | Soft edges, flowing colors |
| Oil Painting | oil | Visible brush strokes, rich textures |
| Pixel Art | pixel | 8-bit retro game aesthetic |
| Neon | neon | Glowing lights, dark background |
| Graffiti | graffiti | Street art, spray paint effect |

## AI Prompt Strategy

```javascript
function buildPrompt(ascii, style) {
  const stylePrompts = {
    watercolor: "watercolor painting style, soft edges, flowing colors",
    oil: "oil painting style, visible brush strokes, rich textures",
    pixel: "pixel art style, 8-bit retro game aesthetic",
    neon: "neon sign style, glowing lights, dark background",
    graffiti: "street graffiti style, spray paint, urban wall"
  };

  return `
    Create an artistic image of the text "${extractText(ascii)}"
    displayed in ASCII art style with these characters:
    ${ascii}

    Style: ${stylePrompts[style]}
    Keep the text readable and prominent.
  `;
}
```

## Project Structure

```
a-banner/
├── app/
│   ├── layout.tsx
│   ├── page.tsx
│   └── api/
│       ├── banner/route.ts
│       └── generate/route.ts
├── components/
│   ├── TextInput.tsx
│   ├── FontSelector.tsx
│   ├── StyleSelector.tsx
│   ├── AsciiPreview.tsx
│   ├── ResultDisplay.tsx
│   └── Captcha.tsx
├── lib/
│   ├── figlet.ts
│   ├── imagen.ts
│   ├── rateLimit.ts
│   └── prompt.ts
├── public/
├── .env.local
├── package.json
└── vercel.json
```

## Dependencies

```json
{
  "dependencies": {
    "next": "^14.0.0",
    "react": "^18.0.0",
    "figlet": "^1.7.0",
    "@google/generative-ai": "^0.1.0",
    "@upstash/ratelimit": "^1.0.0",
    "@upstash/redis": "^1.0.0",
    "@hcaptcha/react-hcaptcha": "^1.0.0"
  }
}
```

## Security Considerations

1. **API Key Protection**: Google API key stored in environment variables, never exposed to client
2. **Rate Limiting**: Prevents abuse and cost overrun
3. **Captcha**: Blocks automated/bot requests
4. **Input Validation**: Sanitize text input, limit length

## Future Considerations (Out of Scope)

- User accounts and saved history
- Social sharing integration
- Additional art styles
- Custom font uploads
