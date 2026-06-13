/**
 * Gateway Client — Simplified interface for calling proxied APIs
 * Abstracts away the proxy path construction and header management
 */

export interface GatewayRequestOptions {
  service: 'stripe' | 'data' | 'ai' | 'mail';
  endpoint: string;
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  body?: Record<string, any>;
  query?: Record<string, string | number | boolean>;
  headers?: Record<string, string>;
  timeout?: number;
}

export interface GatewayResponse<T = any> {
  data: T;
  status: number;
  headers: Record<string, string>;
}

export class GatewayClient {
  private baseUrl: string;
  private timeout: number;

  constructor(
    baseUrl: string = typeof window === 'undefined'
      ? `http://localhost:3000/api/proxy`
      : `/api/proxy`,
    timeout: number = 30000
  ) {
    this.baseUrl = baseUrl;
    this.timeout = timeout;
  }

  /**
   * Make a request through the API Gateway
   */
  async request<T = any>(options: GatewayRequestOptions): Promise<GatewayResponse<T>> {
    const {
      service,
      endpoint,
      method = 'GET',
      body,
      query,
      headers = {},
      timeout = this.timeout,
    } = options;

    // Build URL
    const url = new URL(
      `${this.baseUrl}/${service}/${endpoint}`,
      typeof window === 'undefined' ? `http://localhost:3000` : undefined
    );

    // Add query parameters
    if (query) {
      Object.entries(query).forEach(([key, value]) => {
        url.searchParams.append(key, String(value));
      });
    }

    // Build request
    const fetchOptions: RequestInit = {
      method,
      headers: {
        'Content-Type': 'application/json',
        ...headers,
      },
      signal: AbortSignal.timeout?.(timeout),
    };

    if (body && ['POST', 'PUT', 'PATCH'].includes(method)) {
      fetchOptions.body = JSON.stringify(body);
    }

    try {
      const response = await fetch(url.toString(), fetchOptions);

      let data: T;
      const contentType = response.headers.get('content-type');

      if (contentType?.includes('application/json')) {
        data = await response.json();
      } else {
        data = (await response.text()) as unknown as T;
      }

      if (!response.ok) {
        throw new GatewayError(
          `Gateway request failed: ${response.statusText}`,
          response.status,
          data
        );
      }

      // Convert headers to object
      const responseHeaders: Record<string, string> = {};
      response.headers.forEach((value, key) => {
        responseHeaders[key] = value;
      });

      return {
        data,
        status: response.status,
        headers: responseHeaders,
      };
    } catch (error) {
      if (error instanceof GatewayError) {
        throw error;
      }

      if (error instanceof TypeError && error.message.includes('Failed to fetch')) {
        throw new GatewayError('Network error', 0, { message: 'Failed to connect to gateway' });
      }

      throw new GatewayError(
        'Unknown gateway error',
        0,
        error instanceof Error ? { message: error.message } : { error }
      );
    }
  }

  /**
   * Stripe API proxy
   */
  async stripe<T = any>(
    endpoint: string,
    method: 'GET' | 'POST' | 'DELETE' = 'POST',
    body?: Record<string, any>
  ): Promise<GatewayResponse<T>> {
    return this.request({
      service: 'stripe',
      endpoint,
      method,
      body,
    });
  }

  /**
   * Supabase REST API proxy
   */
  async data<T = any>(
    endpoint: string,
    method: 'GET' | 'POST' | 'PUT' | 'DELETE' = 'GET',
    body?: Record<string, any>,
    query?: Record<string, string | number | boolean>
  ): Promise<GatewayResponse<T>> {
    return this.request({
      service: 'data',
      endpoint,
      method,
      body,
      query,
    });
  }

  /**
   * OpenAI/Anthropic API proxy
   */
  async ai<T = any>(
    endpoint: string,
    method: 'POST' | 'GET' = 'POST',
    body?: Record<string, any>
  ): Promise<GatewayResponse<T>> {
    return this.request({
      service: 'ai',
      endpoint,
      method,
      body,
    });
  }

  /**
   * Email service proxy
   */
  async mail<T = any>(
    endpoint: string,
    method: 'POST' = 'POST',
    body?: Record<string, any>
  ): Promise<GatewayResponse<T>> {
    return this.request({
      service: 'mail',
      endpoint,
      method,
      body,
    });
  }
}

export class GatewayError extends Error {
  constructor(
    message: string,
    public statusCode: number,
    public data: any
  ) {
    super(message);
    this.name = 'GatewayError';
  }
}

// Export singleton instance
export const gatewayClient = new GatewayClient();
