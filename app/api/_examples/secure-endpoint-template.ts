/**
 * SECURE ENDPOINT TEMPLATE
 *
 * Use this as a template for all new/updated API endpoints.
 * Implements full security layer with auth, rate limiting, validation, and audit logging.
 */

import { NextRequest } from 'next/server';
import { supabase } from '@/lib/supabase';
import { guardEndpoint, secureResponse, secureErrorResponse } from '@/lib/security/endpoint-guard';
import { isValidEmail, hasRequiredFields } from '@/lib/security/validation';

// ============ GET ENDPOINT EXAMPLE ============

export async function GET(req: NextRequest) {
  // Security guard: verify auth, rate limit, audit
  const guard = await guardEndpoint(req, {
    method: 'GET',
    requireAuth: true,
    rateLimit: 'api',
    audit: true,
  });

  // If guard failed, return error response
  if (!guard.ok) return guard.response;

  // Extract authenticated user
  const { userId } = guard;

  try {
    // Get query parameters (e.g., /api/example?id=123)
    const id = req.nextUrl.searchParams.get('id');

    if (!id) {
      return secureErrorResponse('Missing required parameter: id', 400);
    }

    // Fetch data from database (RLS handles user isolation)
    const { data, error } = await supabase
      .from('your_table')
      .select('*')
      .eq('id', id)
      .eq('user_id', userId) // RLS will also enforce this
      .single();

    if (error) throw error;
    if (!data) {
      return secureErrorResponse('Not found', 404);
    }

    // Return secure response with data
    return secureResponse({ success: true, data });
  } catch (error) {
    // Return secure error (doesn't leak internal details in production)
    return secureErrorResponse(error, 500);
  }
}

// ============ POST ENDPOINT EXAMPLE ============

export async function POST(req: NextRequest) {
  // Security guard: verify auth, rate limit, validate payload, audit
  const guard = await guardEndpoint(req, {
    method: 'POST',
    requireAuth: true,
    rateLimit: 'api',
    maxPayloadKB: 1024, // 1MB max
    requiredFields: ['name', 'email'], // Validate required fields
    validatePayload: (body: any) => {
      // Custom validation
      if (!isValidEmail(body.email)) return false;
      if (body.name.length < 3) return false;
      return true;
    },
    audit: true,
  });

  if (!guard.ok) return guard.response;

  const { userId, body } = guard;

  try {
    // Type-safe body
    const { name, email } = body as { name: string; email: string };

    // Insert into database
    const { data, error } = await supabase
      .from('your_table')
      .insert({
        user_id: userId,
        name,
        email,
        created_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) throw error;

    // Return success with 201 Created status
    return secureResponse({ success: true, data }, 201);
  } catch (error) {
    return secureErrorResponse(error, 500);
  }
}

// ============ PUT ENDPOINT EXAMPLE ============

export async function PUT(req: NextRequest) {
  const guard = await guardEndpoint(req, {
    method: 'PUT',
    requireAuth: true,
    rateLimit: 'api',
    maxPayloadKB: 1024,
    requiredFields: ['id', 'name'],
    audit: true,
  });

  if (!guard.ok) return guard.response;

  const { userId, body } = guard;

  try {
    const { id, name, email } = body as { id: string; name: string; email?: string };

    // Update database (RLS ensures user can only update own data)
    const { data, error } = await supabase
      .from('your_table')
      .update({ name, email, updated_at: new Date().toISOString() })
      .eq('id', id)
      .eq('user_id', userId)
      .select()
      .single();

    if (error) throw error;
    if (!data) {
      return secureErrorResponse('Not found or unauthorized', 404);
    }

    return secureResponse({ success: true, data });
  } catch (error) {
    return secureErrorResponse(error, 500);
  }
}

// ============ DELETE ENDPOINT EXAMPLE ============

export async function DELETE(req: NextRequest) {
  const guard = await guardEndpoint(req, {
    method: 'DELETE',
    requireAuth: true,
    rateLimit: 'api',
    audit: true,
  });

  if (!guard.ok) return guard.response;

  const { userId } = guard;

  try {
    const id = req.nextUrl.searchParams.get('id');

    if (!id) {
      return secureErrorResponse('Missing required parameter: id', 400);
    }

    // Delete (RLS ensures ownership)
    const { error } = await supabase
      .from('your_table')
      .delete()
      .eq('id', id)
      .eq('user_id', userId);

    if (error) throw error;

    // Return 204 No Content on success
    return secureResponse({ success: true }, 204);
  } catch (error) {
    return secureErrorResponse(error, 500);
  }
}