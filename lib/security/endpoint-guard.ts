import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { checkRateLimit } from './rate-limiter';
import { addSecurityHeaders } from './headers';
import { validatePayloadSize, hasRequiredFields } from './validation';
import { auditLog, logSuspiciousActivity } from './audit-log';

export interface EndpointGuardOptions {
  method?: string | string[]; // Allowed HTTP methods
  requireAuth?: boolean; // Require Clerk authentication
  rateLimit?: 'api' | 'auth' | 'general';
  maxPayloadKB?: number;
  requiredFields?: string[]; // For POST/PUT bodies
  validatePayload?: (body: unknown) => boolean;
  audit?: boolean; // Log to audit trail
}

/**
 * Guard endpoint with security checks
 * Use in API route handlers
 *
 * @example
 * export async function POST(req: NextRequest) {
 *   const guard = await guardEndpoint(req, {
 *     requireAuth: true,
 *     rateLimit: 'api',
 *     requiredFields: ['name', 'email'],
 *   });
 *
 *   if (!guard.ok) return guard.response;
 *   const { userId } = guard;
 *   const body = guard.body;
 *   // Safe to proceed
 * }
 */
export async function guardEndpoint(
  req: NextRequest,
  options: EndpointGuardOptions = {}
) {
  const {
    method = ['GET', 'POST'],
    requireAuth = true,
    rateLimit = 'general',
    maxPayloadKB = 1024,
    requiredFields = [],
    validatePayload,
    audit = true,
  } = options;

  // 1. Check HTTP method
  const allowedMethods = Array.isArray(method) ? method : [method];
  if (!allowedMethods.includes(req.method)) {
    return {
      ok: false,
      response: new NextResponse(
        JSON.stringify({ error: 'Method not allowed' }),
        { status: 405 }
      ),
    };
  }

  // 2. Authenticate
  const { userId } = await auth();

  if (requireAuth && !userId) {
    return {
      ok: false,
      response: new NextResponse(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401 }
      ),
    };
  }

  // 3. Rate limiting
  if (userId && rateLimit) {
    const rateLimitResult = await checkRateLimit(req, userId, rateLimit);
    if (!rateLimitResult.allowed) {
      if (audit) {
        await logSuspiciousActivity(userId, 'Rate limit exceeded', {
          endpoint: req.nextUrl.pathname,
        });
      }
      return {
        ok: false,
        response: rateLimitResult.response,
      };
    }
  }

  // 4. Parse and validate body
  let body: unknown = null;
  if (['POST', 'PUT', 'PATCH'].includes(req.method)) {
    try {
      body = await req.json();

      // Check payload size
      if (!validatePayloadSize(body, maxPayloadKB)) {
        return {
          ok: false,
          response: new NextResponse(
            JSON.stringify({ error: 'Payload too large' }),
            { status: 413 }
          ),
        };
      }

      // Check required fields
      if (requiredFields.length > 0 && !hasRequiredFields(body, requiredFields)) {
        return {
          ok: false,
          response: new NextResponse(
            JSON.stringify({ error: 'Missing required fields' }),
            { status: 400 }
          ),
        };
      }

      // Custom validation
      if (validatePayload && !validatePayload(body)) {
        return {
          ok: false,
          response: new NextResponse(
            JSON.stringify({ error: 'Invalid payload' }),
            { status: 400 }
          ),
        };
      }
    } catch (error) {
      return {
        ok: false,
        response: new NextResponse(
          JSON.stringify({ error: 'Invalid JSON' }),
          { status: 400 }
        ),
      };
    }
  }

  // 5. Audit log
  if (audit && userId) {
    await auditLog({
      userId,
      action: 'user_login', // TODO: More granular action types
      resource: req.nextUrl.pathname,
      timestamp: new Date(),
    });
  }

  // Success - return guard data
  let response = new NextResponse();
  response = addSecurityHeaders(response);

  return {
    ok: true,
    response: null,
    userId: userId || undefined,
    body,
  };
}

/**
 * Respond with secured response
 */
export function secureResponse(data: unknown, status: number = 200) {
  const response = NextResponse.json(data, { status });
  return addSecurityHeaders(response);
}

/**
 * Respond with error securely
 */
export function secureErrorResponse(error: string | Error, status: number = 500) {
  const message = error instanceof Error ? error.message : error;

  // In production, don't expose internal errors
  const response = NextResponse.json(
    {
      error: process.env.NODE_ENV === 'production' ? 'Internal server error' : message,
    },
    { status }
  );

  return addSecurityHeaders(response);
}