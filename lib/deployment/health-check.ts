/**
 * Health Check & Monitoring
 * Application health status and service availability
 */

import { createClient } from '@supabase/supabase-js';

export interface HealthStatus {
  status: 'healthy' | 'degraded' | 'unhealthy';
  timestamp: number;
  uptime: number;
  checks: {
    api: HealthCheck;
    database: HealthCheck;
    stripe: HealthCheck;
    openai: HealthCheck;
    sendgrid: HealthCheck;
    cache: HealthCheck;
  };
  metrics: {
    avgResponseTime: number;
    errorRate: number;
    uptime: number;
  };
}

export interface HealthCheck {
  status: 'up' | 'down' | 'degraded';
  latency: number;
  lastChecked: number;
  error?: string;
}

class HealthChecker {
  private startTime = Date.now();
  private db: any;

  constructor(supabaseUrl: string, supabaseKey: string) {
    this.db = createClient(supabaseUrl, supabaseKey);
  }

  /**
   * Perform full health check
   */
  async checkHealth(): Promise<HealthStatus> {
    const [apiCheck, dbCheck, stripeCheck, openaiCheck, sendgridCheck, cacheCheck] =
      await Promise.all([
        this.checkAPI(),
        this.checkDatabase(),
        this.checkStripe(),
        this.checkOpenAI(),
        this.checkSendGrid(),
        this.checkCache(),
      ]);

    const checks = {
      api: apiCheck,
      database: dbCheck,
      stripe: stripeCheck,
      openai: openaiCheck,
      sendgrid: sendgridCheck,
      cache: cacheCheck,
    };

    const allDown = Object.values(checks).filter(c => c.status === 'down').length;
    const allDegraded = Object.values(checks).filter(c => c.status === 'degraded').length;

    let status: 'healthy' | 'degraded' | 'unhealthy' = 'healthy';
    if (allDown > 2) {
      status = 'unhealthy';
    } else if (allDegraded > 2 || allDown > 0) {
      status = 'degraded';
    }

    return {
      status,
      timestamp: Date.now(),
      uptime: Date.now() - this.startTime,
      checks,
      metrics: {
        avgResponseTime: this.calculateAvgResponseTime(checks),
        errorRate: this.calculateErrorRate(checks),
        uptime: ((Date.now() - this.startTime) / (30 * 24 * 60 * 60 * 1000)) * 100, // 30 days
      },
    };
  }

  /**
   * Check API health
   */
  private async checkAPI(): Promise<HealthCheck> {
    const startTime = Date.now();
    try {
      // Simple ping endpoint
      const response = await fetch('/api/health/ping', { timeout: 5000 });
      const latency = Date.now() - startTime;

      if (response.ok) {
        return {
          status: 'up',
          latency,
          lastChecked: Date.now(),
        };
      } else {
        return {
          status: 'degraded',
          latency,
          lastChecked: Date.now(),
          error: `HTTP ${response.status}`,
        };
      }
    } catch (error) {
      return {
        status: 'down',
        latency: Date.now() - startTime,
        lastChecked: Date.now(),
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  /**
   * Check database health
   */
  private async checkDatabase(): Promise<HealthCheck> {
    const startTime = Date.now();
    try {
      const { error } = await this.db.from('documents').select('count').limit(1);

      if (error) {
        return {
          status: 'down',
          latency: Date.now() - startTime,
          lastChecked: Date.now(),
          error: error.message,
        };
      }

      const latency = Date.now() - startTime;
      const status = latency > 1000 ? 'degraded' : 'up';

      return {
        status: status as any,
        latency,
        lastChecked: Date.now(),
      };
    } catch (error) {
      return {
        status: 'down',
        latency: Date.now() - startTime,
        lastChecked: Date.now(),
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  /**
   * Check Stripe API health
   */
  private async checkStripe(): Promise<HealthCheck> {
    const startTime = Date.now();
    try {
      // Check Stripe API endpoint
      const response = await fetch('https://status.stripe.com/api/v2/status.json', {
        timeout: 5000,
      });

      const data = await response.json();
      const latency = Date.now() - startTime;

      if (data.status?.indicator === 'none') {
        return {
          status: 'up',
          latency,
          lastChecked: Date.now(),
        };
      } else if (data.status?.indicator === 'major') {
        return {
          status: 'down',
          latency,
          lastChecked: Date.now(),
          error: 'Major outage',
        };
      } else {
        return {
          status: 'degraded',
          latency,
          lastChecked: Date.now(),
          error: 'Partial outage',
        };
      }
    } catch (error) {
      return {
        status: 'down',
        latency: Date.now() - startTime,
        lastChecked: Date.now(),
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  /**
   * Check OpenAI API health
   */
  private async checkOpenAI(): Promise<HealthCheck> {
    const startTime = Date.now();
    try {
      const response = await fetch('https://status.openai.com/api/v2/status.json', {
        timeout: 5000,
      });

      const data = await response.json();
      const latency = Date.now() - startTime;

      if (data.status?.indicator === 'none') {
        return {
          status: 'up',
          latency,
          lastChecked: Date.now(),
        };
      } else if (data.status?.indicator === 'major') {
        return {
          status: 'down',
          latency,
          lastChecked: Date.now(),
          error: 'Major outage',
        };
      } else {
        return {
          status: 'degraded',
          latency,
          lastChecked: Date.now(),
          error: 'Partial outage',
        };
      }
    } catch (error) {
      return {
        status: 'down',
        latency: Date.now() - startTime,
        lastChecked: Date.now(),
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  /**
   * Check SendGrid API health
   */
  private async checkSendGrid(): Promise<HealthCheck> {
    const startTime = Date.now();
    try {
      // Check SendGrid API
      const response = await fetch('https://api.sendgrid.com/v3/stats', {
        headers: {
          Authorization: `Bearer ${process.env.SENDGRID_API_KEY}`,
        },
        timeout: 5000,
      });

      const latency = Date.now() - startTime;

      if (response.ok) {
        return {
          status: 'up',
          latency,
          lastChecked: Date.now(),
        };
      } else if (response.status >= 500) {
        return {
          status: 'down',
          latency,
          lastChecked: Date.now(),
          error: `SendGrid error: ${response.status}`,
        };
      } else {
        return {
          status: 'degraded',
          latency,
          lastChecked: Date.now(),
          error: `SendGrid warning: ${response.status}`,
        };
      }
    } catch (error) {
      return {
        status: 'down',
        latency: Date.now() - startTime,
        lastChecked: Date.now(),
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  /**
   * Check cache/Redis health
   */
  private async checkCache(): Promise<HealthCheck> {
    const startTime = Date.now();
    try {
      // Check Redis/cache connection
      const response = await fetch('/api/cache/ping', { timeout: 5000 });

      const latency = Date.now() - startTime;

      if (response.ok) {
        return {
          status: 'up',
          latency,
          lastChecked: Date.now(),
        };
      } else {
        return {
          status: latency > 2000 ? 'down' : 'degraded',
          latency,
          lastChecked: Date.now(),
          error: `Cache error: ${response.status}`,
        };
      }
    } catch (error) {
      // Cache is optional, don't fail overall health
      return {
        status: 'degraded',
        latency: Date.now() - startTime,
        lastChecked: Date.now(),
        error: 'Cache unavailable (non-critical)',
      };
    }
  }

  /**
   * Calculate average response time
   */
  private calculateAvgResponseTime(checks: HealthStatus['checks']): number {
    const latencies = Object.values(checks).map(c => c.latency);
    return Math.round(latencies.reduce((a, b) => a + b, 0) / latencies.length);
  }

  /**
   * Calculate error rate
   */
  private calculateErrorRate(checks: HealthStatus['checks']): number {
    const errors = Object.values(checks).filter(c => c.status === 'down').length;
    return (errors / Object.values(checks).length) * 100;
  }
}

export default HealthChecker;