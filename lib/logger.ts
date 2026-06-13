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
      context,
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
    const entry = this.createEntry(LogLevel.DEBUG, message, context);
    this.addLog(entry);
    if (this.isDevelopment) {
      console.log(this.formatMessage(LogLevel.DEBUG, message), context);
    }
  }

  info(message: string, context?: Record<string, any>) {
    const entry = this.createEntry(LogLevel.INFO, message, context);
    this.addLog(entry);
    console.log(this.formatMessage(LogLevel.INFO, message), context);
  }

  warn(message: string, context?: Record<string, any>) {
    const entry = this.createEntry(LogLevel.WARN, message, context);
    this.addLog(entry);
    console.warn(this.formatMessage(LogLevel.WARN, message), context);
  }

  error(message: string, error?: Error, context?: Record<string, any>) {
    const entry = this.createEntry(LogLevel.ERROR, message, context, error);
    this.addLog(entry);
    console.error(this.formatMessage(LogLevel.ERROR, message), { error, ...context });
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