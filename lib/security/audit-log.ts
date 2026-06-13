import { supabase } from '@/lib/supabase';

export type AuditAction =
  | 'user_login'
  | 'user_logout'
  | 'user_created'
  | 'user_updated'
  | 'api_key_created'
  | 'api_key_revoked'
  | 'workflow_created'
  | 'workflow_executed'
  | 'workflow_deleted'
  | 'data_exported'
  | 'settings_changed'
  | 'access_denied'
  | 'suspicious_activity';

export interface AuditLogEntry {
  userId: string;
  action: AuditAction;
  resource: string; // What was affected (e.g., 'workflow:123')
  details?: Record<string, unknown>; // Additional context
  ipAddress?: string;
  userAgent?: string;
  timestamp: Date;
}

/**
 * Log security audit event
 */
export async function auditLog(entry: AuditLogEntry) {
  try {
    await supabase
      .from('audit_logs')
      .insert({
        user_id: entry.userId,
        action: entry.action,
        resource: entry.resource,
        details: entry.details || {},
        ip_address: entry.ipAddress,
        user_agent: entry.userAgent,
        timestamp: entry.timestamp.toISOString(),
      });
  } catch (error) {
    console.error('Failed to log audit event:', error);
    // Don't throw - logging failure shouldn't break the app
  }
}

/**
 * Log suspicious activity and alert
 */
export async function logSuspiciousActivity(
  userId: string,
  reason: string,
  details?: Record<string, unknown>
) {
  await auditLog({
    userId,
    action: 'suspicious_activity',
    resource: 'user:' + userId,
    details: {
      reason,
      ...details,
    },
    timestamp: new Date(),
  });

  // TODO: Send alert to security team (email, Slack, etc)
  console.warn(`[SECURITY] Suspicious activity detected for user ${userId}: ${reason}`);
}

/**
 * Get audit logs for user
 */
export async function getUserAuditLogs(userId: string, limit: number = 100) {
  const { data, error } = await supabase
    .from('audit_logs')
    .select('*')
    .eq('user_id', userId)
    .order('timestamp', { ascending: false })
    .limit(limit);

  if (error) {
    console.error('Failed to fetch audit logs:', error);
    return [];
  }

  return data || [];
}

/**
 * Get audit logs for specific resource
 */
export async function getResourceAuditLogs(resource: string, limit: number = 50) {
  const { data, error } = await supabase
    .from('audit_logs')
    .select('*')
    .eq('resource', resource)
    .order('timestamp', { ascending: false })
    .limit(limit);

  if (error) {
    console.error('Failed to fetch resource audit logs:', error);
    return [];
  }

  return data || [];
}

/**
 * Detect suspicious patterns
 * Returns true if suspicious activity detected
 */
export async function detectSuspiciousActivity(userId: string): Promise<boolean> {
  // Get recent audit logs
  const logs = await getUserAuditLogs(userId, 50);

  // Check for multiple failed accesses in short time
  const recentFailures = logs.filter(
    (log) =>
      log.action === 'access_denied' &&
      new Date(log.timestamp).getTime() > Date.now() - 15 * 60 * 1000 // Last 15 min
  );

  if (recentFailures.length > 5) {
    return true; // Possible brute force attempt
  }

  // Check for unusual access pattern (geographic inconsistency)
  // TODO: Implement IP geolocation checks

  // Check for rapid API key creation
  const recentApiKeyCreations = logs.filter(
    (log) =>
      log.action === 'api_key_created' &&
      new Date(log.timestamp).getTime() > Date.now() - 60 * 60 * 1000 // Last hour
  );

  if (recentApiKeyCreations.length > 3) {
    return true; // Unusual API key creation pattern
  }

  return false;
}