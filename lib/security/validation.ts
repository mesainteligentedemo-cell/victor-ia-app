/**
 * Input validation utilities
 * Prevent injection attacks, XSS, malformed data
 */

/**
 * Validate email format
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email) && email.length <= 254;
}

/**
 * Validate UUID format (v4)
 */
export function isValidUUID(id: string): boolean {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return uuidRegex.test(id);
}

/**
 * Sanitize string input to prevent XSS
 */
export function sanitizeString(input: string, maxLength: number = 1000): string {
  if (typeof input !== 'string') {
    throw new Error('Input must be a string');
  }

  // Trim whitespace
  let sanitized = input.trim();

  // Enforce max length
  if (sanitized.length > maxLength) {
    sanitized = sanitized.substring(0, maxLength);
  }

  // Remove potentially dangerous HTML/script tags
  sanitized = sanitized
    .replace(/<script[^>]*>.*?<\/script>/gi, '') // Remove scripts
    .replace(/<iframe[^>]*>.*?<\/iframe>/gi, '') // Remove iframes
    .replace(/on\w+\s*=\s*["'][^"']*["']/gi, '') // Remove event handlers
    .replace(/javascript:/gi, ''); // Remove javascript protocol

  return sanitized;
}

/**
 * Validate JSON payload size
 */
export function validatePayloadSize(payload: unknown, maxSizeKB: number = 1024): boolean {
  const json = JSON.stringify(payload);
  const sizeKB = Buffer.byteLength(json, 'utf-8') / 1024;
  return sizeKB <= maxSizeKB;
}

/**
 * Validate string is alphanumeric + hyphens/underscores
 */
export function isValidSlug(slug: string): boolean {
  const slugRegex = /^[a-z0-9_-]+$/i;
  return slugRegex.test(slug) && slug.length >= 3 && slug.length <= 100;
}

/**
 * Validate phone number (basic)
 */
export function isValidPhone(phone: string): boolean {
  const phoneRegex = /^[\d\s\-\+\(\)]{10,}$/;
  return phoneRegex.test(phone.replace(/\s/g, ''));
}

/**
 * Validate URL
 */
export function isValidURL(url: string): boolean {
  try {
    const parsed = new URL(url);
    // Only allow http/https
    return parsed.protocol === 'http:' || parsed.protocol === 'https:';
  } catch {
    return false;
  }
}

/**
 * Validate date format (YYYY-MM-DD)
 */
export function isValidDate(date: string): boolean {
  const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
  if (!dateRegex.test(date)) return false;

  const d = new Date(date);
  return d instanceof Date && !isNaN(d.getTime());
}

/**
 * Validate number is within range
 */
export function isNumberInRange(num: number, min: number, max: number): boolean {
  return Number.isFinite(num) && num >= min && num <= max;
}

/**
 * Validate object has required fields
 */
export function hasRequiredFields(obj: unknown, fields: string[]): boolean {
  if (typeof obj !== 'object' || obj === null) {
    return false;
  }

  for (const field of fields) {
    if (!(field in obj) || (obj as Record<string, unknown>)[field] === null || (obj as Record<string, unknown>)[field] === undefined) {
      return false;
    }
  }

  return true;
}

/**
 * Validate enum value
 */
export function isValidEnum<T extends Record<string, string>>(value: unknown, enumObj: T): value is T[keyof T] {
  return Object.values(enumObj).includes(value as T[keyof T]);
}

/**
 * Create safe response without leaking sensitive data
 */
export function getSafeErrorResponse(error: Error): Record<string, unknown> {
  // In production, never expose internal error details
  return {
    error: 'An error occurred processing your request',
    ...(process.env.NODE_ENV === 'development' && { debug: error.message }),
  };
}