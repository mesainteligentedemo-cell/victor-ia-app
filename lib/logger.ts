enum LogLevel {
  DEBUG = 'DEBUG',
  INFO = 'INFO',
  WARN = 'WARN',
  ERROR = 'ERROR',
}

interface LogEntry {
  timestamp: string;
  level: LogLevel;
  message: string;
  context?: Record<string, any>;
  error?: Error;
}

class Logger {
  private isDevelopment = process.env.NODE_ENV === 'development';
  private logs: LogEntry[] = [];
  private maxLogs = 1000;

  // ✅ SECURITY: Keys that must be redacted
  private sensitiveKeys = [
    'password',
    'token',
    'secret',
    'key',
    'apiKey',
    'api_key',
    'access_token',
    'refresh_token',
    'authorization',
    'stripe_key',
    'anthropic_key',
    'elevenlabs_key',
    'supabase_key',
    'clerk_secret',
  ];

  /**
   * ✅ SECURITY: Recursively sanitize object to remove sensitive keys
   */
  private sanitizeValue(value: any): any {
    if (value === null || value === undefined) {
      return value;
    }

    if (typeof value !== 'object') {
      return value;
    }

    if (Array.isArray(value)) {
      return value.map(item => this.sanitizeValue(item));
    }

    const sanitized: any = {};
    for (const [key, val] of Object.entries(value)) {
      const lowerKey = key.toLowerCase();
      const isSensitive = this.sensitiveKeys.some(sk => lowerKey.includes(sk));

      if (isSensitive) {
        sanitized[key] = '[REDACTED]';
      } else {
        sanitized[key] = this.sanitizeValue(val);
      }
    }

    return sanitized;
  }

  private createEntry(
    level: LogLevel,
    message: string,
    context?: Record<string, any>,
    error?: Error
  ): LogEntry {
    return {
      timestamp: new Date().toISOString(),
      level,
      message,
      // ✅ SECURITY: Sanitize before storing
      context: context ? this.sanitizeValue(context) : undefined,
      error,
    };
  }

  private addLog(entry: LogEntry) {
    this.logs.push(entry);
    if (this.logs.length > this.maxLogs) {
      this.logs.shift();
    }
  }

  private formatMessage(level: LogLevel, message: string): string {
    return `[${level}] ${message}`;
  }

  debug(message: string, context?: Record<string, any>) {
    const sanitized = context ? this.sanitizeValue(context) : undefined;
    const entry = this.createEntry(LogLevel.DEBUG, message, sanitized);
    this.addLog(entry);
    if (this.isDevelopment) {
      console.log(this.formatMessage(LogLevel.DEBUG, message), sanitized);
    }
  }

  info(message: string, context?: Record<string, any>) {
    const sanitized = context ? this.sanitizeValue(context) : undefined;
    const entry = this.createEntry(LogLevel.INFO, message, sanitized);
    this.addLog(entry);
    console.log(this.formatMessage(LogLevel.INFO, message), sanitized);
  }

  warn(message: string, context?: Record<string, any>) {
    const sanitized = context ? this.sanitizeValue(context) : undefined;
    const entry = this.createEntry(LogLevel.WARN, message, sanitized);
    this.addLog(entry);
    console.warn(this.formatMessage(LogLevel.WARN, message), sanitized);
  }

  error(message: string, error?: Error, context?: Record<string, any>) {
    const sanitized = context ? this.sanitizeValue(context) : undefined;
    const entry = this.createEntry(LogLevel.ERROR, message, sanitized, error);
    this.addLog(entry);
    console.error(this.formatMessage(LogLevel.ERROR, message), { error, ...sanitized });
  }

  getLogs(level?: LogLevel): LogEntry[] {
    if (level) {
      return this.logs.filter((log) => log.level === level);
    }
    return this.logs;
  }

  clearLogs() {
    this.logs = [];
  }

  exportLogs(): string {
    return JSON.stringify(this.logs, null, 2);
  }
}

export const logger = new Logger();