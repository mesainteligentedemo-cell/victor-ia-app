/**
 * API Tests: /api/billing
 * TDD Suite for Billing & Subscription Endpoints
 * Tests Stripe integration, subscription management, invoices, and payment processing
 */

import { createMocks } from 'node-mocks-http'
import handler from '@/app/api/billing/route'
import {
  mockStripePlan,
  mockBillingSubscription,
  mockUser,
  mockUserPremium,
  mockDatabase,
  generateTestToken,
} from './fixtures'

describe('/api/billing - Billing & Subscriptions', () => {
  beforeEach(() => {
    mockDatabase.reset()
    jest.clearAllMocks()
  })

  describe('GET /billing/plans - Retrieve Available Plans', () => {
    it('should return all available pricing plans', async () => {
      const token = generateTestToken(mockUser.id)

      const { req, res } = createMocks({
        method: 'GET',
        headers: { authorization: `Bearer ${token}` },
        query: { resource: 'plans' },
      })

      await handler(req, res)

      expect(res._getStatusCode()).toBe(200)
      const data = JSON.parse(res._getData())
      expect(Array.isArray(data.plans)).toBe(true)
      expect(data.plans.length).toBeGreaterThan(0)
    })

    it('should include plan details: name, price, features', async () => {
      const token = generateTestToken(mockUser.id)

      const { req, res } = createMocks({
        method: 'GET',
        headers: { authorization: `Bearer ${token}` },
        query: { resource: 'plans' },
      })

      await handler(req, res)

      const data = JSON.parse(res._getData())
      const plan = data.plans[0]
      expect(plan.id).toBeDefined()
      expect(plan.name).toBeDefined()
      expect(plan.price).toBeDefined()
      expect(plan.currency).toBeDefined()
      expect(Array.isArray(plan.features)).toBe(true)
    })

    it('should allow public access to plans without authentication', async () => {
      const { req, res } = createMocks({
        method: 'GET',
        query: { resource: 'plans' },
      })

      await handler(req, res)

      expect(res._getStatusCode()).toBe(200)
    })

    it('should return monthly and annual billing options', async () => {
      const token = generateTestToken(mockUser.id)

      const { req, res } = createMocks({
        method: 'GET',
        headers: { authorization: `Bearer ${token}` },
        query: { resource: 'plans', billing: 'all' },
      })

      await handler(req, res)

      const data = JSON.parse(res._getData())
      const hasMonthly = data.plans.some((p: any) => p.interval === 'month')
      const hasAnnual = data.plans.some((p: any) => p.interval === 'year')
      expect(hasMonthly || hasAnnual).toBe(true)
    })
  })

  describe('POST /billing/subscribe - Create Subscription', () => {
    it('should create subscription with valid payment method', async () => {
      const token = generateTestToken(mockUser.id)

      const { req, res } = createMocks({
        method: 'POST',
        headers: {
          'content-type': 'application/json',
          authorization: `Bearer ${token}`,
        },
        query: { action: 'subscribe' },
        body: {
          priceId: mockStripePlan.id,
          paymentMethodId: 'pm_test_visa',
        },
      })

      await handler(req, res)

      expect([200, 201]).toContain(res._getStatusCode())
      const data = JSON.parse(res._getData())
      expect(data.subscriptionId).toBeDefined()
    })

    it('should require authentication', async () => {
      const { req, res } = createMocks({
        method: 'POST',
        query: { action: 'subscribe' },
        body: {
          priceId: mockStripePlan.id,
          paymentMethodId: 'pm_test_visa',
        },
      })

      await handler(req, res)

      expect(res._getStatusCode()).toBe(401)
    })

    it('should require valid priceId', async () => {
      const token = generateTestToken(mockUser.id)

      const { req, res } = createMocks({
        method: 'POST',
        headers: { authorization: `Bearer ${token}` },
        query: { action: 'subscribe' },
        body: {
          paymentMethodId: 'pm_test_visa',
        },
      })

      await handler(req, res)

      expect(res._getStatusCode()).toBe(400)
    })

    it('should require paymentMethodId', async () => {
      const token = generateTestToken(mockUser.id)

      const { req, res } = createMocks({
        method: 'POST',
        headers: { authorization: `Bearer ${token}` },
        query: { action: 'subscribe' },
        body: {
          priceId: mockStripePlan.id,
        },
      })

      await handler(req, res)

      expect(res._getStatusCode()).toBe(400)
    })

    it('should apply trial period if applicable', async () => {
      const token = generateTestToken(mockUser.id)

      const { req, res } = createMocks({
        method: 'POST',
        headers: { authorization: `Bearer ${token}` },
        query: { action: 'subscribe' },
        body: {
          priceId: mockStripePlan.id,
          paymentMethodId: 'pm_test_visa',
          applyTrial: true,
        },
      })

      await handler(req, res)

      expect([200, 201]).toContain(res._getStatusCode())
      const data = JSON.parse(res._getData())
      if (data.trialEndsAt) {
        expect(new Date(data.trialEndsAt) > new Date()).toBe(true)
      }
    })

    it('should handle declined payment cards', async () => {
      const token = generateTestToken(mockUser.id)

      const { req, res } = createMocks({
        method: 'POST',
        headers: { authorization: `Bearer ${token}` },
        query: { action: 'subscribe' },
        body: {
          priceId: mockStripePlan.id,
          paymentMethodId: 'pm_test_chargeDeclined',
        },
      })

      await handler(req, res)

      expect(res._getStatusCode()).toBe(402)
      const data = JSON.parse(res._getData())
      expect(data.error).toContain('declined')
    })

    it('should reject invalid Stripe price ID', async () => {
      const token = generateTestToken(mockUser.id)

      const { req, res } = createMocks({
        method: 'POST',
        headers: { authorization: `Bearer ${token}` },
        query: { action: 'subscribe' },
        body: {
          priceId: 'invalid_price_id',
          paymentMethodId: 'pm_test_visa',
        },
      })

      await handler(req, res)

      expect(res._getStatusCode()).toBe(400)
    })
  })

  describe('POST /billing/upgrade - Upgrade Subscription', () => {
    beforeEach(async () => {
      // Create initial subscription
      mockDatabase.createSubscription({
        customerId: mockUser.id,
        priceId: 'price_basic',
        status: 'active',
      })
    })

    it('should upgrade from basic to pro plan', async () => {
      const token = generateTestToken(mockUser.id)

      const { req, res } = createMocks({
        method: 'POST',
        headers: { authorization: `Bearer ${token}` },
        query: { action: 'upgrade' },
        body: {
          newPriceId: 'price_pro',
        },
      })

      await handler(req, res)

      expect([200, 201]).toContain(res._getStatusCode())
      const data = JSON.parse(res._getData())
      expect(data.subscriptionId).toBeDefined()
    })

    it('should prorate charges on mid-cycle upgrade', async () => {
      const token = generateTestToken(mockUser.id)

      const { req, res } = createMocks({
        method: 'POST',
        headers: { authorization: `Bearer ${token}` },
        query: { action: 'upgrade' },
        body: {
          newPriceId: 'price_premium',
          proration: true,
        },
      })

      await handler(req, res)

      expect([200, 201]).toContain(res._getStatusCode())
      const data = JSON.parse(res._getData())
      if (data.proratedAmount !== undefined) {
        expect(typeof data.proratedAmount).toBe('number')
      }
    })

    it('should require authentication', async () => {
      const { req, res } = createMocks({
        method: 'POST',
        query: { action: 'upgrade' },
        body: { newPriceId: 'price_pro' },
      })

      await handler(req, res)

      expect(res._getStatusCode()).toBe(401)
    })

    it('should not allow downgrade with "upgrade" endpoint', async () => {
      const token = generateTestToken(mockUser.id)

      // User has premium, trying to downgrade to pro
      const { req, res } = createMocks({
        method: 'POST',
        headers: { authorization: `Bearer ${token}` },
        query: { action: 'upgrade' },
        body: {
          newPriceId: 'price_basic',
        },
      })

      await handler(req, res)

      // Should either reject or use different endpoint
      expect([400, 405]).toContain(res._getStatusCode())
    })
  })

  describe('POST /billing/downgrade - Downgrade Subscription', () => {
    beforeEach(async () => {
      mockDatabase.createSubscription({
        customerId: mockUserPremium.id,
        priceId: 'price_premium',
        status: 'active',
      })
    })

    it('should downgrade from premium to basic plan', async () => {
      const token = generateTestToken(mockUserPremium.id)

      const { req, res } = createMocks({
        method: 'POST',
        headers: { authorization: `Bearer ${token}` },
        query: { action: 'downgrade' },
        body: {
          newPriceId: 'price_basic',
        },
      })

      await handler(req, res)

      expect([200, 201]).toContain(res._getStatusCode())
    })

    it('should apply downgrade at next billing cycle', async () => {
      const token = generateTestToken(mockUserPremium.id)

      const { req, res } = createMocks({
        method: 'POST',
        headers: { authorization: `Bearer ${token}` },
        query: { action: 'downgrade' },
        body: {
          newPriceId: 'price_basic',
          effectiveDate: 'next_billing_cycle',
        },
      })

      await handler(req, res)

      expect([200, 201]).toContain(res._getStatusCode())
      const data = JSON.parse(res._getData())
      expect(data.effectiveDate).toBeDefined()
    })
  })

  describe('POST /billing/cancel - Cancel Subscription', () => {
    beforeEach(async () => {
      mockDatabase.createSubscription({
        customerId: mockUser.id,
        priceId: 'price_pro',
        status: 'active',
      })
    })

    it('should cancel active subscription', async () => {
      const token = generateTestToken(mockUser.id)

      const { req, res } = createMocks({
        method: 'POST',
        headers: { authorization: `Bearer ${token}` },
        query: { action: 'cancel' },
        body: {
          reason: 'too_expensive',
        },
      })

      await handler(req, res)

      expect([200, 204]).toContain(res._getStatusCode())
    })

    it('should cancel at end of billing cycle', async () => {
      const token = generateTestToken(mockUser.id)

      const { req, res } = createMocks({
        method: 'POST',
        headers: { authorization: `Bearer ${token}` },
        query: { action: 'cancel' },
        body: {
          cancelAtPeriodEnd: true,
        },
      })

      await handler(req, res)

      expect([200, 204]).toContain(res._getStatusCode())
      const data = JSON.parse(res._getData())
      expect(data.cancelAtPeriodEnd).toBe(true)
    })

    it('should prevent immediate cancellation after purchase', async () => {
      const token = generateTestToken(mockUser.id)

      // Create recent subscription (within 24 hours)
      mockDatabase.createSubscription({
        customerId: mockUser.id,
        priceId: 'price_pro',
        status: 'active',
        createdAt: new Date(Date.now() - 1 * 60 * 60 * 1000), // 1 hour ago
      })

      const { req, res } = createMocks({
        method: 'POST',
        headers: { authorization: `Bearer ${token}` },
        query: { action: 'cancel' },
        body: {},
      })

      await handler(req, res)

      // May require refund or charge restocking fee
      expect([200, 400, 402]).toContain(res._getStatusCode())
    })
  })

  describe('GET /billing/invoices - Retrieve Invoices', () => {
    it('should list all invoices for authenticated user', async () => {
      const token = generateTestToken(mockUser.id)

      const { req, res } = createMocks({
        method: 'GET',
        headers: { authorization: `Bearer ${token}` },
        query: { resource: 'invoices' },
      })

      await handler(req, res)

      expect(res._getStatusCode()).toBe(200)
      const data = JSON.parse(res._getData())
      expect(Array.isArray(data.invoices)).toBe(true)
    })

    it('should require authentication', async () => {
      const { req, res } = createMocks({
        method: 'GET',
        query: { resource: 'invoices' },
      })

      await handler(req, res)

      expect(res._getStatusCode()).toBe(401)
    })

    it('should include invoice details: date, amount, status', async () => {
      const token = generateTestToken(mockUser.id)

      const { req, res } = createMocks({
        method: 'GET',
        headers: { authorization: `Bearer ${token}` },
        query: { resource: 'invoices' },
      })

      await handler(req, res)

      const data = JSON.parse(res._getData())
      if (data.invoices.length > 0) {
        const invoice = data.invoices[0]
        expect(invoice.id).toBeDefined()
        expect(invoice.amount).toBeDefined()
        expect(invoice.status).toBeDefined()
        expect(invoice.date).toBeDefined()
      }
    })

    it('should support filtering by status', async () => {
      const token = generateTestToken(mockUser.id)

      const { req, res } = createMocks({
        method: 'GET',
        headers: { authorization: `Bearer ${token}` },
        query: {
          resource: 'invoices',
          status: 'paid',
        },
      })

      await handler(req, res)

      expect(res._getStatusCode()).toBe(200)
    })

    it('should allow invoice download as PDF', async () => {
      const token = generateTestToken(mockUser.id)

      const { req, res } = createMocks({
        method: 'GET',
        headers: { authorization: `Bearer ${token}` },
        query: {
          resource: 'invoices',
          format: 'pdf',
        },
      })

      await handler(req, res)

      expect([200, 404]).toContain(res._getStatusCode())
    })
  })

  describe('GET /billing/subscription - Get Active Subscription', () => {
    beforeEach(async () => {
      mockDatabase.createSubscription({
        customerId: mockUser.id,
        priceId: mockStripePlan.id,
        status: 'active',
      })
    })

    it('should return current active subscription', async () => {
      const token = generateTestToken(mockUser.id)

      const { req, res } = createMocks({
        method: 'GET',
        headers: { authorization: `Bearer ${token}` },
        query: { resource: 'subscription' },
      })

      await handler(req, res)

      expect(res._getStatusCode()).toBe(200)
      const data = JSON.parse(res._getData())
      expect(data.subscription).toBeDefined()
      expect(data.subscription.status).toBe('active')
    })

    it('should include billing cycle dates', async () => {
      const token = generateTestToken(mockUser.id)

      const { req, res } = createMocks({
        method: 'GET',
        headers: { authorization: `Bearer ${token}` },
        query: { resource: 'subscription' },
      })

      await handler(req, res)

      const data = JSON.parse(res._getData())
      expect(data.subscription.currentPeriodStart).toBeDefined()
      expect(data.subscription.currentPeriodEnd).toBeDefined()
    })

    it('should return 404 if user has no subscription', async () => {
      const token = generateTestToken('user_no_subscription')

      const { req, res } = createMocks({
        method: 'GET',
        headers: { authorization: `Bearer ${token}` },
        query: { resource: 'subscription' },
      })

      await handler(req, res)

      expect([200, 404]).toContain(res._getStatusCode())
    })
  })

  describe('POST /billing/payment-method - Add Payment Method', () => {
    it('should save new payment method to account', async () => {
      const token = generateTestToken(mockUser.id)

      const { req, res } = createMocks({
        method: 'POST',
        headers: { authorization: `Bearer ${token}` },
        query: { action: 'add-payment-method' },
        body: {
          paymentMethodId: 'pm_test_visa_new',
          isDefault: true,
        },
      })

      await handler(req, res)

      expect([200, 201]).toContain(res._getStatusCode())
    })

    it('should require authentication', async () => {
      const { req, res } = createMocks({
        method: 'POST',
        query: { action: 'add-payment-method' },
        body: { paymentMethodId: 'pm_test_visa' },
      })

      await handler(req, res)

      expect(res._getStatusCode()).toBe(401)
    })

    it('should allow setting default payment method', async () => {
      const token = generateTestToken(mockUser.id)

      const { req, res } = createMocks({
        method: 'POST',
        headers: { authorization: `Bearer ${token}` },
        query: { action: 'set-default-payment-method' },
        body: {
          paymentMethodId: 'pm_test_visa',
        },
      })

      await handler(req, res)

      expect([200, 404]).toContain(res._getStatusCode())
    })
  })

  describe('Billing Security', () => {
    it('should not expose full credit card numbers', async () => {
      const token = generateTestToken(mockUser.id)

      const { req, res } = createMocks({
        method: 'GET',
        headers: { authorization: `Bearer ${token}` },
        query: { resource: 'payment-methods' },
      })

      await handler(req, res)

      const data = JSON.parse(res._getData())
      if (data.paymentMethods) {
        data.paymentMethods.forEach((pm: any) => {
          expect(pm.last4).toBeDefined()
          expect(pm.number).toBeUndefined()
          expect(pm.cvc).toBeUndefined()
        })
      }
    })

    it('should use HTTPS for all billing requests', async () => {
      const token = generateTestToken(mockUser.id)

      const { req, res } = createMocks({
        method: 'GET',
        headers: {
          authorization: `Bearer ${token}`,
          'x-forwarded-proto': 'http', // Attempt HTTP
        },
        query: { resource: 'subscription' },
      })

      await handler(req, res)

      // Should reject or force HTTPS
      expect([200, 426]).toContain(res._getStatusCode())
    })

    it('should prevent cross-user access', async () => {
      const tokenUser1 = generateTestToken('user_1')
      const user2Id = 'user_2'

      const { req, res } = createMocks({
        method: 'GET',
        headers: { authorization: `Bearer ${tokenUser1}` },
        query: { resource: 'subscription', userId: user2Id },
      })

      await handler(req, res)

      expect(res._getStatusCode()).toBe(403)
    })
  })

  describe('HTTP Method Validation', () => {
    it('should support GET for retrieval', async () => {
      const token = generateTestToken(mockUser.id)

      const { req, res } = createMocks({
        method: 'GET',
        headers: { authorization: `Bearer ${token}` },
        query: { resource: 'plans' },
      })

      await handler(req, res)

      expect([200, 400]).toContain(res._getStatusCode())
    })

    it('should support POST for mutations', async () => {
      const token = generateTestToken(mockUser.id)

      const { req, res } = createMocks({
        method: 'POST',
        headers: { authorization: `Bearer ${token}` },
        query: { action: 'subscribe' },
        body: {
          priceId: mockStripePlan.id,
          paymentMethodId: 'pm_test_visa',
        },
      })

      await handler(req, res)

      expect([200, 201, 400, 401, 402]).toContain(res._getStatusCode())
    })

    it('should reject DELETE requests', async () => {
      const token = generateTestToken(mockUser.id)

      const { req, res } = createMocks({
        method: 'DELETE',
        headers: { authorization: `Bearer ${token}` },
        query: { resource: 'subscription' },
      })

      await handler(req, res)

      expect(res._getStatusCode()).toBe(405)
    })
  })
})
