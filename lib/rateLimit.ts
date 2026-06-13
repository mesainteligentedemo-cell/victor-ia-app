const requestCounts = new Map<string, { count: number; resetTime: number }>();

export function rateLimit(identifier: string, limit: number = 60, windowMs: number = 60000) {
  const now = Date.now();
  const record = requestCounts.get(identifier);

  if (!record || now > record.resetTime) {
    // Reset or create new record
    requestCounts.set(identifier, {
      count: 1,
      resetTime: now + windowMs,
    });
    return { success: true, remaining: limit - 1 };
  }

  if (record.count >= limit) {
    return {
      success: false,
      remaining: 0,
      retryAfter: Math.ceil((record.resetTime - now) / 1000),
    };
  }

  record.count++;
  return { success: true, remaining: limit - record.count };
}

export function createRateLimitMiddleware(limit: number = 60, windowMs: number = 60000) {
  return (identifier: string) => {
    return rateLimit(identifier, limit, windowMs);
  };
}

// Cleanup old entries every hour
setInterval(() => {
  const now = Date.now();
  for (const [key, value] of requestCounts.entries()) {
    if (now > value.resetTime) {
      requestCounts.delete(key);
    }
  }
}, 3600000);