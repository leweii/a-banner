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
      // Production safeguard: fail if Redis is not configured in production
      if (process.env.NODE_ENV === 'production') {
        console.error(
          '[SECURITY WARNING] Rate limiting is disabled in production! ' +
          'Set UPSTASH_REDIS_REST_URL and UPSTASH_REDIS_REST_TOKEN environment variables.'
        );
        throw new Error('Rate limiting requires Redis configuration in production');
      }

      // Log warning for development/test environments
      console.warn(
        '[Rate Limit] Redis not configured. Using mock rate limiter for development.'
      );

      // Cache the mock to maintain singleton behavior
      ratelimit = {
        limit: async () => ({
          success: true,
          remaining: DAILY_LIMIT,
          reset: Date.now() + 86400000,
          limit: DAILY_LIMIT,
        }),
      } as unknown as Ratelimit;
      return ratelimit;
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
