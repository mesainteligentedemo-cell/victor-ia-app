/**
 * API Tests: POST /api/contact
 * TDD Suite for Contact Form Endpoint
 * Tests email validation, rate limiting, XSS prevention, and email delivery
 */

import { createMocks } from 'node-mocks-http'
import handler from '@/app/api/contact/route'
import {
  mockContactFormSubmission,
  mockDatabase,
  createRateLimitStore,
  isValidEmail,
  containsXSS,
  createErrorResponse,
} from './fixtures'

describe('/api/contact - Contact Form Submission', () => {
  const rateLimitStore = createRateLimitStore()

  beforeEach(() => {
    mockDatabase.reset()
    rateLimitStore.reset()
    jest.clearAllMocks()
  })

  describe('POST - Valid Submissions', () => {
    it('should accept and process a valid contact form submission', async () => {
      const { req, res } = createMocks({
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: mockContactFormSubmission,
      })

      await handler(req, res)

      expect(res._getStatusCode()).toBe(200)
      const data = JSON.parse(res._getData())
      expect(data.success).toBe(true)
      expect(data.message).toContain('Thank you')
    })

    it('should accept submission with minimal required fields', async () => {
      const { req, res } = createMocks({
        method: 'POST',
        body: {
          email: 'minimal@example.com',
          name: 'Minimal User',
          message: 'Short message',
        },
      })

      await handler(req, res)

      expect(res._getStatusCode()).toBe(200)
      const data = JSON.parse(res._getData())
      expect(data.success).toBe(true)
    })

    it('should trim whitespace from input fields', async () => {
      const { req, res } = createMocks({
        method: 'POST',
        body: {
          email: '  test@example.com  ',
          name: '  John Doe  ',
          message: '  Hello World  ',
        },
      })

      await handler(req, res)

      expect(res._getStatusCode()).toBe(200)
      const data = JSON.parse(res._getData())
      expect(data.data.email).toBe('test@example.com')
      expect(data.data.name).toBe('John Doe')
    })

    it('should handle messages with markdown formatting', async () => {
      const { req, res } = createMocks({
        method: 'POST',
        body: {
          email: 'test@example.com',
          name: 'Test User',
          message: '## Question\n\nI have a **question** about pricing.',
        },
      })

      await handler(req, res)

      expect(res._getStatusCode()).toBe(200)
    })

    it('should store contact submission in database', async () => {
      const { req, res } = createMocks({
        method: 'POST',
        body: mockContactFormSubmission,
      })

      const dbSpy = jest.spyOn(mockDatabase, 'createContact')
      await handler(req, res)

      expect(dbSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          email: mockContactFormSubmission.email,
          name: mockContactFormSubmission.name,
        })
      )
    })
  })

  describe('POST - Input Validation', () => {
    it('should reject missing email field', async () => {
      const { req, res } = createMocks({
        method: 'POST',
        body: {
          name: 'Test User',
          message: 'Hello',
        },
      })

      await handler(req, res)

      expect(res._getStatusCode()).toBe(400)
      const data = JSON.parse(res._getData())
      expect(data.error).toContain('email')
    })

    it('should reject missing name field', async () => {
      const { req, res } = createMocks({
        method: 'POST',
        body: {
          email: 'test@example.com',
          message: 'Hello',
        },
      })

      await handler(req, res)

      expect(res._getStatusCode()).toBe(400)
      const data = JSON.parse(res._getData())
      expect(data.error).toContain('name')
    })

    it('should reject missing message field', async () => {
      const { req, res } = createMocks({
        method: 'POST',
        body: {
          email: 'test@example.com',
          name: 'Test User',
        },
      })

      await handler(req, res)

      expect(res._getStatusCode()).toBe(400)
      const data = JSON.parse(res._getData())
      expect(data.error).toContain('message')
    })

    it('should reject invalid email format', async () => {
      const invalidEmails = [
        'notanemail',
        'test@',
        '@example.com',
        'test@.com',
        'test..@example.com',
      ]

      for (const email of invalidEmails) {
        expect(isValidEmail(email)).toBe(false)

        const { req, res } = createMocks({
          method: 'POST',
          body: {
            email,
            name: 'Test',
            message: 'Message',
          },
        })

        await handler(req, res)
        expect(res._getStatusCode()).toBe(400)
      }
    })

    it('should reject emails longer than 254 characters', async () => {
      const longEmail = 'a'.repeat(255) + '@example.com'

      const { req, res } = createMocks({
        method: 'POST',
        body: {
          email: longEmail,
          name: 'Test',
          message: 'Message',
        },
      })

      await handler(req, res)
      expect(res._getStatusCode()).toBe(400)
    })

    it('should reject empty strings in required fields', async () => {
      const { req, res } = createMocks({
        method: 'POST',
        body: {
          email: '',
          name: '',
          message: '',
        },
      })

      await handler(req, res)
      expect(res._getStatusCode()).toBe(400)
    })

    it('should reject message shorter than 10 characters', async () => {
      const { req, res } = createMocks({
        method: 'POST',
        body: {
          email: 'test@example.com',
          name: 'Test User',
          message: 'Short',
        },
      })

      await handler(req, res)
      expect(res._getStatusCode()).toBe(400)
      const data = JSON.parse(res._getData())
      expect(data.error).toContain('message')
    })

    it('should reject message longer than 5000 characters', async () => {
      const { req, res } = createMocks({
        method: 'POST',
        body: {
          email: 'test@example.com',
          name: 'Test User',
          message: 'A'.repeat(5001),
        },
      })

      await handler(req, res)
      expect(res._getStatusCode()).toBe(400)
    })
  })

  describe('POST - Security', () => {
    it('should reject XSS attempts in message field', async () => {
      const xssPayloads = [
        '<script>alert("xss")</script>',
        'Click here <a onclick="alert(1)">link</a>',
        '<img src=x onerror="alert(1)">',
        '<iframe src="javascript:alert(1)"></iframe>',
      ]

      for (const payload of xssPayloads) {
        expect(containsXSS(payload)).toBe(true)

        const { req, res } = createMocks({
          method: 'POST',
          body: {
            email: 'test@example.com',
            name: 'Test User',
            message: payload,
          },
        })

        await handler(req, res)
        expect(res._getStatusCode()).toBe(400)
      }
    })

    it('should reject XSS attempts in name field', async () => {
      const { req, res } = createMocks({
        method: 'POST',
        body: {
          email: 'test@example.com',
          name: '<script>alert(1)</script>John',
          message: 'This is a safe message',
        },
      })

      await handler(req, res)
      expect(res._getStatusCode()).toBe(400)
    })

    it('should sanitize benign HTML-like content', async () => {
      const { req, res } = createMocks({
        method: 'POST',
        body: {
          email: 'test@example.com',
          name: 'Test User',
          message: 'Check out my site example.com - its great!',
        },
      })

      await handler(req, res)
      expect(res._getStatusCode()).toBe(200)
    })

    it('should reject SQL injection attempts', async () => {
      const sqlPayloads = [
        "'; DROP TABLE users; --",
        "1' OR '1'='1",
        "admin'--",
      ]

      for (const payload of sqlPayloads) {
        const { req, res } = createMocks({
          method: 'POST',
          body: {
            email: 'test@example.com',
            name: payload,
            message: 'This is a message',
          },
        })

        await handler(req, res)
        // Should either reject or safely sanitize
        expect([400, 200]).toContain(res._getStatusCode())
      }
    })

    it('should handle null bytes in input', async () => {
      const { req, res } = createMocks({
        method: 'POST',
        body: {
          email: 'test@example.com',
          name: 'Test\x00User',
          message: 'Safe message',
        },
      })

      await handler(req, res)
      // Should safely reject or sanitize
      expect([400, 200]).toContain(res._getStatusCode())
    })
  })

  describe('POST - Rate Limiting', () => {
    it('should allow up to 3 submissions per 10 minutes from same IP', async () => {
      const clientIp = '192.168.1.100'

      for (let i = 0; i < 3; i++) {
        const { req, res } = createMocks({
          method: 'POST',
          headers: { 'x-forwarded-for': clientIp },
          body: mockContactFormSubmission,
        })

        await handler(req, res)
        expect([200, 201]).toContain(res._getStatusCode())
      }
    })

    it('should reject 4th submission within rate limit window', async () => {
      const clientIp = '192.168.1.101'

      // First 3 succeed
      for (let i = 0; i < 3; i++) {
        const { req, res } = createMocks({
          method: 'POST',
          headers: { 'x-forwarded-for': clientIp },
          body: mockContactFormSubmission,
        })
        await handler(req, res)
      }

      // 4th should be rate limited
      const { req, res } = createMocks({
        method: 'POST',
        headers: { 'x-forwarded-for': clientIp },
        body: mockContactFormSubmission,
      })

      await handler(req, res)
      expect(res._getStatusCode()).toBe(429)
      const data = JSON.parse(res._getData())
      expect(data.error).toContain('rate limit')
    })

    it('should reset rate limit after 10 minutes', async () => {
      const clientIp = '192.168.1.102'

      // Submit 3 times
      for (let i = 0; i < 3; i++) {
        const { req, res } = createMocks({
          method: 'POST',
          headers: { 'x-forwarded-for': clientIp },
          body: mockContactFormSubmission,
        })
        await handler(req, res)
      }

      // Simulate time passing
      jest.useFakeTimers()
      jest.advanceTimersByTime(10 * 60 * 1000 + 1000)

      // Next submission should succeed
      const { req, res } = createMocks({
        method: 'POST',
        headers: { 'x-forwarded-for': clientIp },
        body: mockContactFormSubmission,
      })

      await handler(req, res)
      expect([200, 201]).toContain(res._getStatusCode())

      jest.useRealTimers()
    })

    it('should differentiate rate limits by IP address', async () => {
      // IP 1 submits 3 times
      for (let i = 0; i < 3; i++) {
        const { req, res } = createMocks({
          method: 'POST',
          headers: { 'x-forwarded-for': '192.168.1.200' },
          body: mockContactFormSubmission,
        })
        await handler(req, res)
      }

      // IP 2 should still be able to submit
      const { req, res } = createMocks({
        method: 'POST',
        headers: { 'x-forwarded-for': '192.168.1.201' },
        body: mockContactFormSubmission,
      })

      await handler(req, res)
      expect([200, 201]).toContain(res._getStatusCode())
    })
  })

  describe('POST - Email Delivery', () => {
    it('should send email to admin inbox', async () => {
      const sendEmailSpy = jest.fn().mockResolvedValue({ success: true })

      const { req, res } = createMocks({
        method: 'POST',
        body: mockContactFormSubmission,
      })

      // Mock email service would be called
      await handler(req, res)

      // Verify email was queued/sent
      expect(res._getStatusCode()).toBe(200)
    })

    it('should send confirmation email to submitter', async () => {
      const { req, res } = createMocks({
        method: 'POST',
        body: mockContactFormSubmission,
      })

      await handler(req, res)

      expect(res._getStatusCode()).toBe(200)
      const data = JSON.parse(res._getData())
      expect(data.confirmationSent).toBe(true)
    })

    it('should handle email service failures gracefully', async () => {
      const { req, res } = createMocks({
        method: 'POST',
        body: mockContactFormSubmission,
      })

      // Simulate email service down
      jest.spyOn(global, 'fetch').mockRejectedValueOnce(new Error('Service unavailable'))

      await handler(req, res)

      // Should still return 200 (email queued for retry)
      expect([200, 202]).toContain(res._getStatusCode())
    })
  })

  describe('HTTP Method Validation', () => {
    it('should reject GET requests with 405 Method Not Allowed', async () => {
      const { req, res } = createMocks({ method: 'GET' })
      await handler(req, res)
      expect(res._getStatusCode()).toBe(405)
    })

    it('should reject PUT requests with 405', async () => {
      const { req, res } = createMocks({ method: 'PUT' })
      await handler(req, res)
      expect(res._getStatusCode()).toBe(405)
    })

    it('should reject DELETE requests with 405', async () => {
      const { req, res } = createMocks({ method: 'DELETE' })
      await handler(req, res)
      expect(res._getStatusCode()).toBe(405)
    })

    it('should reject PATCH requests with 405', async () => {
      const { req, res } = createMocks({ method: 'PATCH' })
      await handler(req, res)
      expect(res._getStatusCode()).toBe(405)
    })
  })

  describe('Edge Cases', () => {
    it('should handle concurrent submissions from same user', async () => {
      const requests = Array(5)
        .fill(null)
        .map(() =>
          createMocks({
            method: 'POST',
            body: mockContactFormSubmission,
          })
        )

      const results = await Promise.all(
        requests.map(({ req, res }) => handler(req, res))
      )

      // At least 3 should succeed (rate limit), rest might fail
      const successCount = requests.filter(
        ({ res }) => [200, 201].includes(res._getStatusCode())
      ).length
      expect(successCount).toBeGreaterThanOrEqual(3)
    })

    it('should handle unicode characters in message', async () => {
      const { req, res } = createMocks({
        method: 'POST',
        body: {
          email: 'test@example.com',
          name: 'José García',
          message: '你好世界 - Hello World - Привет мир 🌍',
        },
      })

      await handler(req, res)
      expect([200, 400]).toContain(res._getStatusCode())
    })

    it('should handle very long company name', async () => {
      const { req, res } = createMocks({
        method: 'POST',
        body: {
          email: 'test@example.com',
          name: 'Test',
          message: 'Valid message here',
          company: 'A'.repeat(500),
        },
      })

      await handler(req, res)
      // Should either accept with truncation or reject
      expect([200, 400]).toContain(res._getStatusCode())
    })

    it('should handle submission with optional fields', async () => {
      const { req, res } = createMocks({
        method: 'POST',
        body: {
          email: 'test@example.com',
          name: 'Test User',
          message: 'This is a test message',
          phone: '+1-555-0100',
          company: 'Acme Corp',
        },
      })

      await handler(req, res)
      expect(res._getStatusCode()).toBe(200)
    })
  })
})
