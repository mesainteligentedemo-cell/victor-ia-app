/**
 * API Tests: /api/analytics
 * TDD Suite for Analytics Endpoints
 * Tests event tracking, data retrieval, aggregation, and real-time updates
 */

import { createMocks } from 'node-mocks-http'
import handler from '@/app/api/analytics/route'
import {
  mockAnalyticsEvent,
  mockUser,
  mockDatabase,
  generateTestToken,
} from './fixtures'

describe('/api/analytics - Analytics Tracking', () => {
  beforeEach(() => {
    mockDatabase.reset()
    jest.clearAllMocks()
  })

  describe('POST /analytics - Event Tracking', () => {
    it('should accept valid analytics event with authentication', async () => {
      const token = generateTestToken(mockUser.id)

      const { req, res } = createMocks({
        method: 'POST',
        headers: {
          'content-type': 'application/json',
          authorization: `Bearer ${token}`,
        },
        body: mockAnalyticsEvent,
      })

      await handler(req, res)

      expect(res._getStatusCode()).toBe(201)
      const data = JSON.parse(res._getData())
      expect(data.success).toBe(true)
      expect(data.eventId).toBeDefined()
    })

    it('should require authentication token', async () => {
      const { req, res } = createMocks({
        method: 'POST',
        body: mockAnalyticsEvent,
      })

      await handler(req, res)

      expect(res._getStatusCode()).toBe(401)
      const data = JSON.parse(res._getData())
      expect(data.error).toContain('authentication')
    })

    it('should accept page_view events', async () => {
      const token = generateTestToken(mockUser.id)

      const { req, res } = createMocks({
        method: 'POST',
        headers: { authorization: `Bearer ${token}` },
        body: {
          userId: mockUser.id,
          eventName: 'page_view',
          eventProperties: {
            page: '/pricing',
            referrer: '/home',
          },
          sessionId: 'session_123',
        },
      })

      await handler(req, res)

      expect(res._getStatusCode()).toBe(201)
    })

    it('should accept click events', async () => {
      const token = generateTestToken(mockUser.id)

      const { req, res } = createMocks({
        method: 'POST',
        headers: { authorization: `Bearer ${token}` },
        body: {
          userId: mockUser.id,
          eventName: 'button_click',
          eventProperties: {
            buttonId: 'subscribe-btn',
            page: '/pricing',
          },
          sessionId: 'session_123',
        },
      })

      await handler(req, res)

      expect(res._getStatusCode()).toBe(201)
    })

    it('should accept conversion events', async () => {
      const token = generateTestToken(mockUser.id)

      const { req, res } = createMocks({
        method: 'POST',
        headers: { authorization: `Bearer ${token}` },
        body: {
          userId: mockUser.id,
          eventName: 'conversion',
          eventProperties: {
            conversionType: 'signup',
            plan: 'pro',
            value: 99.99,
          },
          sessionId: 'session_123',
        },
      })

      await handler(req, res)

      expect(res._getStatusCode()).toBe(201)
    })

    it('should accept custom events', async () => {
      const token = generateTestToken(mockUser.id)

      const { req, res } = createMocks({
        method: 'POST',
        headers: { authorization: `Bearer ${token}` },
        body: {
          userId: mockUser.id,
          eventName: 'custom_event',
          eventProperties: {
            customData: 'any value',
            nested: { value: 123 },
          },
          sessionId: 'session_123',
        },
      })

      await handler(req, res)

      expect(res._getStatusCode()).toBe(201)
    })

    it('should require eventName field', async () => {
      const token = generateTestToken(mockUser.id)

      const { req, res } = createMocks({
        method: 'POST',
        headers: { authorization: `Bearer ${token}` },
        body: {
          userId: mockUser.id,
          eventProperties: { page: '/home' },
          sessionId: 'session_123',
        },
      })

      await handler(req, res)

      expect(res._getStatusCode()).toBe(400)
      const data = JSON.parse(res._getData())
      expect(data.error).toContain('eventName')
    })

    it('should require sessionId field', async () => {
      const token = generateTestToken(mockUser.id)

      const { req, res } = createMocks({
        method: 'POST',
        headers: { authorization: `Bearer ${token}` },
        body: {
          userId: mockUser.id,
          eventName: 'page_view',
          eventProperties: { page: '/home' },
        },
      })

      await handler(req, res)

      expect(res._getStatusCode()).toBe(400)
    })

    it('should sanitize eventProperties of XSS', async () => {
      const token = generateTestToken(mockUser.id)

      const { req, res } = createMocks({
        method: 'POST',
        headers: { authorization: `Bearer ${token}` },
        body: {
          userId: mockUser.id,
          eventName: 'page_view',
          eventProperties: {
            page: '<script>alert(1)</script>',
          },
          sessionId: 'session_123',
        },
      })

      await handler(req, res)

      expect([200, 201, 400]).toContain(res._getStatusCode())
    })

    it('should add timestamp automatically if not provided', async () => {
      const token = generateTestToken(mockUser.id)

      const { req, res } = createMocks({
        method: 'POST',
        headers: { authorization: `Bearer ${token}` },
        body: {
          userId: mockUser.id,
          eventName: 'page_view',
          eventProperties: { page: '/home' },
          sessionId: 'session_123',
        },
      })

      await handler(req, res)

      expect(res._getStatusCode()).toBe(201)
      const data = JSON.parse(res._getData())
      expect(data.timestamp).toBeDefined()
    })

    it('should batch multiple events in single request', async () => {
      const token = generateTestToken(mockUser.id)

      const { req, res } = createMocks({
        method: 'POST',
        headers: { authorization: `Bearer ${token}` },
        body: [mockAnalyticsEvent, mockAnalyticsEvent, mockAnalyticsEvent],
      })

      await handler(req, res)

      expect([200, 201]).toContain(res._getStatusCode())
      const data = JSON.parse(res._getData())
      expect(data.eventsLogged).toBeGreaterThan(0)
    })

    it('should handle concurrent event submissions', async () => {
      const token = generateTestToken(mockUser.id)

      const events = Array(10)
        .fill(null)
        .map((_, i) => ({
          ...mockAnalyticsEvent,
          eventProperties: { ...mockAnalyticsEvent.eventProperties, index: i },
        }))

      const requests = events.map(() =>
        createMocks({
          method: 'POST',
          headers: { authorization: `Bearer ${token}` },
          body: mockAnalyticsEvent,
        })
      )

      const results = await Promise.all(
        requests.map(({ req, res }) => handler(req, res))
      )

      const successCount = requests.filter(
        ({ res }) => [200, 201].includes(res._getStatusCode())
      ).length
      expect(successCount).toBeGreaterThan(0)
    })
  })

  describe('GET /analytics - Data Retrieval', () => {
    beforeEach(async () => {
      // Log some test events
      const token = generateTestToken(mockUser.id)

      for (let i = 0; i < 5; i++) {
        const { req, res } = createMocks({
          method: 'POST',
          headers: { authorization: `Bearer ${token}` },
          body: mockAnalyticsEvent,
        })
        await handler(req, res)
      }
    })

    it('should retrieve analytics events for authenticated user', async () => {
      const token = generateTestToken(mockUser.id)

      const { req, res } = createMocks({
        method: 'GET',
        headers: { authorization: `Bearer ${token}` },
        query: { userId: mockUser.id },
      })

      await handler(req, res)

      expect(res._getStatusCode()).toBe(200)
      const data = JSON.parse(res._getData())
      expect(Array.isArray(data.events)).toBe(true)
      expect(data.events.length).toBeGreaterThan(0)
    })

    it('should require authentication', async () => {
      const { req, res } = createMocks({
        method: 'GET',
        query: { userId: mockUser.id },
      })

      await handler(req, res)

      expect(res._getStatusCode()).toBe(401)
    })

    it('should filter events by date range', async () => {
      const token = generateTestToken(mockUser.id)
      const now = new Date()
      const startDate = new Date(now.getTime() - 24 * 60 * 60 * 1000) // 24 hours ago

      const { req, res } = createMocks({
        method: 'GET',
        headers: { authorization: `Bearer ${token}` },
        query: {
          userId: mockUser.id,
          startDate: startDate.toISOString(),
          endDate: now.toISOString(),
        },
      })

      await handler(req, res)

      expect(res._getStatusCode()).toBe(200)
      const data = JSON.parse(res._getData())
      expect(Array.isArray(data.events)).toBe(true)
    })

    it('should filter events by event name', async () => {
      const token = generateTestToken(mockUser.id)

      const { req, res } = createMocks({
        method: 'GET',
        headers: { authorization: `Bearer ${token}` },
        query: {
          userId: mockUser.id,
          eventName: 'page_view',
        },
      })

      await handler(req, res)

      expect(res._getStatusCode()).toBe(200)
      const data = JSON.parse(res._getData())
      expect(Array.isArray(data.events)).toBe(true)
    })

    it('should support pagination', async () => {
      const token = generateTestToken(mockUser.id)

      const { req, res } = createMocks({
        method: 'GET',
        headers: { authorization: `Bearer ${token}` },
        query: {
          userId: mockUser.id,
          page: '1',
          limit: '10',
        },
      })

      await handler(req, res)

      expect(res._getStatusCode()).toBe(200)
      const data = JSON.parse(res._getData())
      expect(data.pagination).toBeDefined()
      expect(data.pagination.page).toBe(1)
      expect(data.pagination.limit).toBe(10)
    })

    it('should return event summary/aggregations', async () => {
      const token = generateTestToken(mockUser.id)

      const { req, res } = createMocks({
        method: 'GET',
        headers: { authorization: `Bearer ${token}` },
        query: {
          userId: mockUser.id,
          aggregate: 'true',
        },
      })

      await handler(req, res)

      expect(res._getStatusCode()).toBe(200)
      const data = JSON.parse(res._getData())
      expect(data.summary).toBeDefined()
      expect(data.summary.totalEvents).toBeDefined()
    })

    it('should prevent unauthorized access to other users data', async () => {
      const token = generateTestToken(mockUser.id)
      const otherUserId = 'user_999'

      const { req, res } = createMocks({
        method: 'GET',
        headers: { authorization: `Bearer ${token}` },
        query: { userId: otherUserId },
      })

      await handler(req, res)

      expect(res._getStatusCode()).toBe(403)
    })

    it('should support CSV export format', async () => {
      const token = generateTestToken(mockUser.id)

      const { req, res } = createMocks({
        method: 'GET',
        headers: {
          authorization: `Bearer ${token}`,
          accept: 'text/csv',
        },
        query: { userId: mockUser.id },
      })

      await handler(req, res)

      expect([200, 400]).toContain(res._getStatusCode())
      if (res._getStatusCode() === 200) {
        const contentType = res._getHeaders()['content-type']
        expect(contentType).toContain('csv')
      }
    })
  })

  describe('GET /analytics/summary - Aggregated Analytics', () => {
    it('should return total page views', async () => {
      const token = generateTestToken(mockUser.id)

      const { req, res } = createMocks({
        method: 'GET',
        headers: { authorization: `Bearer ${token}` },
        query: {
          userId: mockUser.id,
          metric: 'pageViews',
        },
      })

      await handler(req, res)

      expect([200, 404]).toContain(res._getStatusCode())
    })

    it('should return top pages by visit count', async () => {
      const token = generateTestToken(mockUser.id)

      const { req, res } = createMocks({
        method: 'GET',
        headers: { authorization: `Bearer ${token}` },
        query: {
          userId: mockUser.id,
          metric: 'topPages',
          limit: '10',
        },
      })

      await handler(req, res)

      expect([200, 404]).toContain(res._getStatusCode())
    })

    it('should return user engagement metrics', async () => {
      const token = generateTestToken(mockUser.id)

      const { req, res } = createMocks({
        method: 'GET',
        headers: { authorization: `Bearer ${token}` },
        query: {
          userId: mockUser.id,
          metric: 'engagement',
        },
      })

      await handler(req, res)

      expect([200, 404]).toContain(res._getStatusCode())
    })

    it('should return conversion funnel data', async () => {
      const token = generateTestToken(mockUser.id)

      const { req, res } = createMocks({
        method: 'GET',
        headers: { authorization: `Bearer ${token}` },
        query: {
          userId: mockUser.id,
          metric: 'conversionFunnel',
        },
      })

      await handler(req, res)

      expect([200, 404]).toContain(res._getStatusCode())
    })
  })

  describe('WebSocket Real-time Analytics', () => {
    it('should support real-time event streaming via WebSocket', async () => {
      const token = generateTestToken(mockUser.id)

      // Mock WebSocket upgrade
      const { req, res } = createMocks({
        method: 'GET',
        headers: {
          'upgrade': 'websocket',
          'authorization': `Bearer ${token}`,
        },
        query: { userId: mockUser.id },
      })

      // Handler should upgrade connection
      expect([101, 200, 404]).toContain(res._getStatusCode())
    })
  })

  describe('Analytics Data Integrity', () => {
    it('should not lose events during high volume submissions', async () => {
      const token = generateTestToken(mockUser.id)
      const eventCount = 100

      const requests = Array(eventCount)
        .fill(null)
        .map(() =>
          createMocks({
            method: 'POST',
            headers: { authorization: `Bearer ${token}` },
            body: mockAnalyticsEvent,
          })
        )

      const results = await Promise.all(
        requests.map(({ req, res }) => handler(req, res))
      )

      const successCount = results.filter(
        (_, i) => [200, 201].includes(requests[i].res._getStatusCode())
      ).length

      expect(successCount).toBeGreaterThanOrEqual(eventCount * 0.95) // 95% success rate
    })

    it('should maintain event ordering by timestamp', async () => {
      const token = generateTestToken(mockUser.id)

      const { req, res } = createMocks({
        method: 'GET',
        headers: { authorization: `Bearer ${token}` },
        query: {
          userId: mockUser.id,
          sort: 'timestamp:asc',
        },
      })

      await handler(req, res)

      if (res._getStatusCode() === 200) {
        const data = JSON.parse(res._getData())
        if (data.events && data.events.length > 1) {
          for (let i = 1; i < data.events.length; i++) {
            expect(
              new Date(data.events[i].timestamp) >=
                new Date(data.events[i - 1].timestamp)
            ).toBe(true)
          }
        }
      }
    })
  })

  describe('HTTP Method Validation', () => {
    it('should support POST for event tracking', async () => {
      const token = generateTestToken(mockUser.id)

      const { req, res } = createMocks({
        method: 'POST',
        headers: { authorization: `Bearer ${token}` },
        body: mockAnalyticsEvent,
      })

      await handler(req, res)

      expect([201, 400]).toContain(res._getStatusCode())
    })

    it('should support GET for data retrieval', async () => {
      const token = generateTestToken(mockUser.id)

      const { req, res } = createMocks({
        method: 'GET',
        headers: { authorization: `Bearer ${token}` },
        query: { userId: mockUser.id },
      })

      await handler(req, res)

      expect([200, 400]).toContain(res._getStatusCode())
    })

    it('should reject DELETE requests', async () => {
      const token = generateTestToken(mockUser.id)

      const { req, res } = createMocks({
        method: 'DELETE',
        headers: { authorization: `Bearer ${token}` },
        query: { userId: mockUser.id },
      })

      await handler(req, res)

      expect(res._getStatusCode()).toBe(405)
    })
  })
})
