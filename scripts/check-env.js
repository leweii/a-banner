#!/usr/bin/env node

/**
 * Build-time environment variable validation
 * This script runs during build to ensure all required env vars are set
 */

const requiredEnvVars = [
  'GOOGLE_AI_API_KEY',
  'UPSTASH_REDIS_REST_URL',
  'UPSTASH_REDIS_REST_TOKEN',
  'HCAPTCHA_SECRET_KEY',
  'NEXT_PUBLIC_HCAPTCHA_SITE_KEY',
];

const missing = [];

for (const envVar of requiredEnvVars) {
  if (!process.env[envVar]) {
    missing.push(envVar);
  }
}

if (missing.length > 0) {
  console.error('\n❌ BUILD FAILED: Missing required environment variables:\n');
  missing.forEach((v) => console.error(`   - ${v}`));
  console.error('\nPlease add these variables in Vercel Dashboard → Settings → Environment Variables');
  console.error('Or use: vercel env add <VAR_NAME> production\n');
  process.exit(1);
}

console.log('✓ All required environment variables are set');
