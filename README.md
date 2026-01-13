# ASCII Banner Art Generator

Transform text into ASCII art banners, then convert them into AI-generated artistic images.

## Features

- Generate ASCII art banners from text using multiple fonts
- Transform ASCII art into AI-generated images with 5 art styles:
  - Watercolor
  - Oil Painting
  - Pixel Art
  - Neon
  - Graffiti
- Rate limiting (10 generations per day per IP)
- Bot protection with hCaptcha
- Direct image download

## Tech Stack

- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS
- Google Generative AI (Gemini)
- Upstash Redis (rate limiting)
- hCaptcha

## Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Set up environment variables

Copy the example file:

```bash
cp .env.local.example .env.local
```

Then fill in the values (see [Environment Variables](#environment-variables) below).

### 3. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the app.

## Environment Variables

### GOOGLE_AI_API_KEY (Required)

Google AI API key for image generation.

1. Go to [Google AI Studio](https://aistudio.google.com/apikey)
2. Click "Create API Key"
3. Copy the key

### UPSTASH_REDIS_REST_URL & UPSTASH_REDIS_REST_TOKEN (Required for production)

Upstash Redis for rate limiting. Skipped in development if not configured.

1. Go to [Upstash Console](https://console.upstash.com/)
2. Create a free account
3. Click "Create Database" → Select "Redis"
4. Choose a region close to your deployment
5. Copy `UPSTASH_REDIS_REST_URL` and `UPSTASH_REDIS_REST_TOKEN` from the REST API section

### HCAPTCHA_SECRET_KEY & NEXT_PUBLIC_HCAPTCHA_SITE_KEY (Required for production)

hCaptcha for bot protection. Skipped in development if not configured.

1. Go to [hCaptcha Dashboard](https://dashboard.hcaptcha.com/)
2. Create a free account
3. Add a new site with your domain (e.g., `your-app.vercel.app`)
4. Copy the **Site Key** → `NEXT_PUBLIC_HCAPTCHA_SITE_KEY`
5. Go to Settings → Copy your **Secret Key** → `HCAPTCHA_SECRET_KEY`

## Deploy on Vercel

1. Push your code to GitHub
2. Go to [Vercel](https://vercel.com) and import the repository
3. Add all environment variables in the Vercel dashboard
4. Deploy

## Development

```bash
# Run tests
npm test

# Run linter
npm run lint

# Build for production
npm run build
```

## License

MIT
