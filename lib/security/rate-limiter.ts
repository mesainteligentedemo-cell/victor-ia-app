import { NextRequest, NextResponse } from 'next/server';

/**
 * In-memory rate limiting (for development)
 * In production, use Redis for distributed rate limiting
 */
class RateLimiter {
  private requests: Map<string, number[]> = new Map();
  private readonly windowMs: number; // Time window in ms
  private readonly maxRequests: number; // Max requests per window

  constructor(windowMs: number = 60000, maxRequests: number = 100) {
    this.windowMs = windowMs;
    this.maxRequests = maxRequests;
  }

  isAllowed(key: string): boolean {
    const now = Date.now();
    const windowStart = now - this.windowMs;

    // Get existing requests for this key
    const requests = this.requests.get(key) || [];

    // Filter out old requests outside the window
    const recentRequests = requests.filter(time => time > windowStart);

    // Check if limit exceeded
    if (recentRequests.length >= this.maxRequests) {
      return false;
    }

    // Add new request
    recentRequests.push(now);
    this.requests.set(key, recentRequests);

    // Cleanup old entries
    if (this.requests.size > 10000) {
      this.cleanup();
    }

    return true;
  }

  private cleanup() {
    const now = Date.now();
    const windowStart = now - this.windowMs;

    for (const [key, requests] of this.requests.entries()) {
      const recent = requests.filter(time => time > windowStart);
      if (recent.length === 0) {
        this.requests.delete(key);
      } else {
        this.requests.set(key, recent);
      }
    }
  }

  getRemainingRequests(key: string): number {
    const now = Date.now();
    const windowStart = now - this.windowMs;
    const requests = this.requests.get(key) || [];
    const recentRequests = requests.filter(time => time > windowStart);
    return Math.max(0, this.maxRequests - recentRequests.length);
  }
}

// Global instances
const apiRateLimiter = new RateLimiter(3600000, 10000); // 10K per hour
const authRateLimiter = new RateLimiter(900000, 100); // 100 per 15 min
const generalRateLimiter = new RateLimiter(60000, 100); // 100 per minute

/**
 * Middleware to enforce rate limiting
 */
export async function checkRateLimit(
  req: NextRequest,
  userId: string,
  type: 'api' | 'auth' | 'general' = 'general'
) {
  const limiter = type === 'api' ? apiRateLimiter : type === 'auth' ? authRateLimiter : generalRateLimiter;

  const key = `${type}:${userId}`;
  const allowed = limiter.isAllowed(key);
  const remaining = limiter.getRemainingRequests(key);

  if (!allowed) {
    return {
      allowed: false,
      response: NextResponse.json(
        { error: 'Rate limit exceeded. Try again later.' },
        {
          status: 429,
          headers: {
            'X-RateLimit-Limit': '100',
            'X-RateLimit-Remaining': '0',
            'Retry-After': '60',
          },
        }
      ),
    };
  }

  return {
    allowed: true,
    remaining,
    headers: {
      'X-RateLimit-Remaining': remaining.toString(),
    },
  };
}

/**
 * Get current rate limit status for a user
 */
export function getRateLimitStatus(userId: string, type: 'api' | 'auth' | 'general' = 'general') {
  const limiter = type === 'api' ? apiRateLimiter : type === 'auth' ? authRateLimiter : generalRateLimiter;
  const key = `${type}:${userId}`;
  const remaining = limiter.getRemainingRequests(key);

  return {
    remaining,
    limit: limiter['maxRequests'],
  };
}