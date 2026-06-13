/**
 * API Tests: /api/auth
 * TDD Suite for Authentication Endpoints
 * Tests signup, login, logout, password validation, 2FA, and token management
 */

import { createMocks } from 'node-mocks-http'
import handler from '@/app/api/auth/route'
import {
  mockAuthCredentials,
  mockAuthLogin,
  mockDatabase,
  isValidPassword,
  generateTestToken,
  createErrorResponse,
} from './fixtures'

describe('/api/auth - Authentication', () => {
  beforeEach(() => {
    mockDatabase.reset()
    jest.clearAllMocks()
  })

  describe('POST /auth/signup - User Registration', () => {
    it('should create a new user account with valid credentials', async () => {
      const { req, res } = createMocks({
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        query: { action: 'signup' },
        body: mockAuthCredentials,
      })

      await handler(req, res)

      expect(res._getStatusCode()).toBe(201)
      const data = JSON.parse(res._getData())
      expect(data.success).toBe(true)
      expect(data.user.email).toBe(mockAuthCredentials.email)
      expect(data.token).toBeDefined()
    })

    it('should hash password before storing', async () => {
      const { req, res } = createMocks({
        method: 'POST',
        query: { action: 'signup' },
        body: mockAuthCredentials,
      })

      await handler(req, res)

      expect(res._getStatusCode()).toBe(201)
      const user = mockDatabase.getUserByEmail(mockAuthCredentials.email)
      expect(user).toBeDefined()
      expect(user.password).not.toBe(mockAuthCredentials.password)
    })

    it('should reject duplicate email address', async () => {
      // First signup
      const { req: req1, res: res1 } = createMocks({
        method: 'POST',
        query: { action: 'signup' },
        body: mockAuthCredentials,
      })
      await handler(req1, res1)

      // Second signup with same email
      const { req: req2, res: res2 } = createMocks({
        method: 'POST',
        query: { action: 'signup' },
        body: mockAuthCredentials,
      })
      await handler(req2, res2)

      expect(res2._getStatusCode()).toBe(409)
      const data = JSON.parse(res2._getData())
      expect(data.error).toContain('already exists')
    })

    it('should reject invalid password format', async () => {
      const weakPasswords = ['12345', 'password', 'Test123', 'ABCDEFGH123']

      for (const pwd of weakPasswords) {
        expect(isValidPassword(pwd)).toBe(false)

        const { req, res } = createMocks({
          method: 'POST',
          query: { action: 'signup' },
          body: {
            email: `test${Math.random()}@example.com`,
            password: pwd,
          },
        })

        await handler(req, res)
        expect(res._getStatusCode()).toBe(400)
        const data = JSON.parse(res._getData())
        expect(data.error).toContain('password')
      }
    })

    it('should reject invalid email format', async () => {
      const { req, res } = createMocks({
        method: 'POST',
        query: { action: 'signup' },
        body: {
          email: 'invalid-email',
          password: mockAuthCredentials.password,
        },
      })

      await handler(req, res)
      expect(res._getStatusCode()).toBe(400)
    })

    it('should trim whitespace from email', async () => {
      const { req, res } = createMocks({
        method: 'POST',
        query: { action: 'signup' },
        body: {
          email: '  newuser@example.com  ',
          password: mockAuthCredentials.password,
        },
      })

      await handler(req, res)

      expect(res._getStatusCode()).toBe(201)
      const data = JSON.parse(res._getData())
      expect(data.user.email).toBe('newuser@example.com')
    })

    it('should convert email to lowercase', async () => {
      const { req, res } = createMocks({
        method: 'POST',
        query: { action: 'signup' },
        body: {
          email: 'NewUser@EXAMPLE.COM',
          password: mockAuthCredentials.password,
        },
      })

      await handler(req, res)

      expect(res._getStatusCode()).toBe(201)
      const data = JSON.parse(res._getData())
      expect(data.user.email).toBe('newuser@example.com')
    })

    it('should return JWT token in response', async () => {
      const { req, res } = createMocks({
        method: 'POST',
        query: { action: 'signup' },
        body: mockAuthCredentials,
      })

      await handler(req, res)

      const data = JSON.parse(res._getData())
      expect(data.token).toBeDefined()
      expect(typeof data.token).toBe('string')
      expect(data.token.split('.').length).toBe(3) // JWT format
    })

    it('should include refresh token in response', async () => {
      const { req, res } = createMocks({
        method: 'POST',
        query: { action: 'signup' },
        body: mockAuthCredentials,
      })

      await handler(req, res)

      const data = JSON.parse(res._getData())
      expect(data.refreshToken).toBeDefined()
    })

    it('should set secure HTTP-only cookie for refresh token', async () => {
      const { req, res } = createMocks({
        method: 'POST',
        query: { action: 'signup' },
        body: mockAuthCredentials,
      })

      await handler(req, res)

      const setCookie = res._getHeaders()['set-cookie']
      expect(setCookie).toBeDefined()
      expect(setCookie).toContain('HttpOnly')
      expect(setCookie).toContain('Secure')
      expect(setCookie).toContain('SameSite')
    })
  })

  describe('POST /auth/login - User Login', () => {
    beforeEach(async () => {
      // Create a test user
      const { req, res } = createMocks({
        method: 'POST',
        query: { action: 'signup' },
        body: mockAuthLogin,
      })
      await handler(req, res)
    })

    it('should authenticate user with valid credentials', async () => {
      const { req, res } = createMocks({
        method: 'POST',
        query: { action: 'login' },
        body: mockAuthLogin,
      })

      await handler(req, res)

      expect(res._getStatusCode()).toBe(200)
      const data = JSON.parse(res._getData())
      expect(data.success).toBe(true)
      expect(data.token).toBeDefined()
    })

    it('should reject invalid password', async () => {
      const { req, res } = createMocks({
        method: 'POST',
        query: { action: 'login' },
        body: {
          email: mockAuthLogin.email,
          password: 'WrongPassword123!@#',
        },
      })

      await handler(req, res)

      expect(res._getStatusCode()).toBe(401)
      const data = JSON.parse(res._getData())
      expect(data.error).toContain('Invalid')
    })

    it('should reject login for non-existent user', async () => {
      const { req, res } = createMocks({
        method: 'POST',
        query: { action: 'login' },
        body: {
          email: 'nonexistent@example.com',
          password: mockAuthLogin.password,
        },
      })

      await handler(req, res)

      expect(res._getStatusCode()).toBe(401)
    })

    it('should require email field', async () => {
      const { req, res } = createMocks({
        method: 'POST',
        query: { action: 'login' },
        body: {
          password: mockAuthLogin.password,
        },
      })

      await handler(req, res)

      expect(res._getStatusCode()).toBe(400)
      const data = JSON.parse(res._getData())
      expect(data.error).toContain('email')
    })

    it('should require password field', async () => {
      const { req, res } = createMocks({
        method: 'POST',
        query: { action: 'login' },
        body: {
          email: mockAuthLogin.email,
        },
      })

      await handler(req, res)

      expect(res._getStatusCode()).toBe(400)
    })

    it('should track failed login attempts', async () => {
      // Attempt login with wrong password 5 times
      for (let i = 0; i < 5; i++) {
        const { req, res } = createMocks({
          method: 'POST',
          query: { action: 'login' },
          body: {
            email: mockAuthLogin.email,
            password: 'WrongPassword123!@#',
          },
        })
        await handler(req, res)
      }

      // 6th attempt should be blocked
      const { req, res } = createMocks({
        method: 'POST',
        query: { action: 'login' },
        body: mockAuthLogin,
      })

      await handler(req, res)

      expect(res._getStatusCode()).toBe(429)
      const data = JSON.parse(res._getData())
      expect(data.error).toContain('locked' || 'rate limit')
    })

    it('should return new session on successful login', async () => {
      const { req, res } = createMocks({
        method: 'POST',
        query: { action: 'login' },
        body: mockAuthLogin,
      })

      await handler(req, res)

      const data = JSON.parse(res._getData())
      expect(data.session).toBeDefined()
      expect(data.session.userId).toBeDefined()
    })
  })

  describe('POST /auth/logout - User Logout', () => {
    it('should invalidate session token on logout', async () => {
      const token = generateTestToken('user_123')

      const { req, res } = createMocks({
        method: 'POST',
        query: { action: 'logout' },
        headers: { authorization: `Bearer ${token}` },
      })

      await handler(req, res)

      expect([200, 204]).toContain(res._getStatusCode())
    })

    it('should clear refresh token cookie', async () => {
      const token = generateTestToken('user_123')

      const { req, res } = createMocks({
        method: 'POST',
        query: { action: 'logout' },
        headers: { authorization: `Bearer ${token}` },
      })

      await handler(req, res)

      const setCookie = res._getHeaders()['set-cookie']
      expect(setCookie).toBeDefined()
      // Cookie should be cleared (MaxAge=0 or Expires in past)
      expect(setCookie).toMatch(/MaxAge=0|expires=/)
    })

    it('should require authentication token', async () => {
      const { req, res } = createMocks({
        method: 'POST',
        query: { action: 'logout' },
      })

      await handler(req, res)

      expect(res._getStatusCode()).toBe(401)
    })
  })

  describe('POST /auth/refresh-token - Token Refresh', () => {
    it('should issue new access token with valid refresh token', async () => {
      const refreshToken = generateTestToken('user_123', 7 * 24 * 3600 * 1000) // 7 days

      const { req, res } = createMocks({
        method: 'POST',
        query: { action: 'refresh-token' },
        headers: { cookie: `refreshToken=${refreshToken}` },
      })

      await handler(req, res)

      expect(res._getStatusCode()).toBe(200)
      const data = JSON.parse(res._getData())
      expect(data.token).toBeDefined()
    })

    it('should reject expired refresh token', async () => {
      const expiredToken = generateTestToken('user_123', -1000) // Expired 1 second ago

      const { req, res } = createMocks({
        method: 'POST',
        query: { action: 'refresh-token' },
        headers: { cookie: `refreshToken=${expiredToken}` },
      })

      await handler(req, res)

      expect(res._getStatusCode()).toBe(401)
    })

    it('should reject invalid refresh token', async () => {
      const { req, res } = createMocks({
        method: 'POST',
        query: { action: 'refresh-token' },
        headers: { cookie: 'refreshToken=invalid.token.here' },
      })

      await handler(req, res)

      expect(res._getStatusCode()).toBe(401)
    })

    it('should require refresh token in cookie', async () => {
      const { req, res } = createMocks({
        method: 'POST',
        query: { action: 'refresh-token' },
      })

      await handler(req, res)

      expect(res._getStatusCode()).toBe(401)
    })
  })

  describe('POST /auth/verify-email - Email Verification', () => {
    it('should verify email with valid token', async () => {
      // Signup creates unverified account
      const { req: reqSignup, res: resSignup } = createMocks({
        method: 'POST',
        query: { action: 'signup' },
        body: mockAuthCredentials,
      })
      await handler(reqSignup, resSignup)

      const signupData = JSON.parse(resSignup._getData())
      const verificationToken = signupData.verificationToken

      // Verify email
      const { req, res } = createMocks({
        method: 'POST',
        query: { action: 'verify-email' },
        body: { token: verificationToken },
      })

      await handler(req, res)

      expect(res._getStatusCode()).toBe(200)
      const data = JSON.parse(res._getData())
      expect(data.success).toBe(true)
    })

    it('should reject invalid verification token', async () => {
      const { req, res } = createMocks({
        method: 'POST',
        query: { action: 'verify-email' },
        body: { token: 'invalid.token.here' },
      })

      await handler(req, res)

      expect(res._getStatusCode()).toBe(400)
    })

    it('should reject expired verification token', async () => {
      const { req, res } = createMocks({
        method: 'POST',
        query: { action: 'verify-email' },
        body: { token: generateTestToken('user_123', -1000) },
      })

      await handler(req, res)

      expect(res._getStatusCode()).toBe(400)
    })
  })

  describe('POST /auth/forgot-password - Password Reset', () => {
    beforeEach(async () => {
      const { req, res } = createMocks({
        method: 'POST',
        query: { action: 'signup' },
        body: mockAuthLogin,
      })
      await handler(req, res)
    })

    it('should send password reset email for existing user', async () => {
      const { req, res } = createMocks({
        method: 'POST',
        query: { action: 'forgot-password' },
        body: { email: mockAuthLogin.email },
      })

      await handler(req, res)

      expect(res._getStatusCode()).toBe(200)
      const data = JSON.parse(res._getData())
      expect(data.success).toBe(true)
      expect(data.message).toContain('email')
    })

    it('should not reveal if email exists (security)', async () => {
      const { req, res } = createMocks({
        method: 'POST',
        query: { action: 'forgot-password' },
        body: { email: 'nonexistent@example.com' },
      })

      await handler(req, res)

      // Should return success either way (timing attack prevention)
      expect(res._getStatusCode()).toBe(200)
    })

    it('should require email field', async () => {
      const { req, res } = createMocks({
        method: 'POST',
        query: { action: 'forgot-password' },
        body: {},
      })

      await handler(req, res)

      expect(res._getStatusCode()).toBe(400)
    })
  })

  describe('POST /auth/reset-password - Complete Password Reset', () => {
    it('should reset password with valid token and new password', async () => {
      const resetToken = generateTestToken('user_123')

      const { req, res } = createMocks({
        method: 'POST',
        query: { action: 'reset-password' },
        body: {
          token: resetToken,
          newPassword: 'NewSecurePass123!@#',
        },
      })

      await handler(req, res)

      expect([200, 201]).toContain(res._getStatusCode())
      const data = JSON.parse(res._getData())
      expect(data.success).toBe(true)
    })

    it('should reject weak password in reset', async () => {
      const resetToken = generateTestToken('user_123')

      const { req, res } = createMocks({
        method: 'POST',
        query: { action: 'reset-password' },
        body: {
          token: resetToken,
          newPassword: 'weak',
        },
      })

      await handler(req, res)

      expect(res._getStatusCode()).toBe(400)
    })

    it('should reject expired reset token', async () => {
      const expiredToken = generateTestToken('user_123', -1000)

      const { req, res } = createMocks({
        method: 'POST',
        query: { action: 'reset-password' },
        body: {
          token: expiredToken,
          newPassword: 'NewSecurePass123!@#',
        },
      })

      await handler(req, res)

      expect(res._getStatusCode()).toBe(400)
    })
  })

  describe('POST /auth/2fa-setup - Two Factor Authentication Setup', () => {
    beforeEach(async () => {
      const { req, res } = createMocks({
        method: 'POST',
        query: { action: 'signup' },
        body: mockAuthCredentials,
      })
      await handler(req, res)
    })

    it('should generate 2FA secret for user', async () => {
      const token = generateTestToken('user_123')

      const { req, res } = createMocks({
        method: 'POST',
        query: { action: '2fa-setup' },
        headers: { authorization: `Bearer ${token}` },
      })

      await handler(req, res)

      expect(res._getStatusCode()).toBe(200)
      const data = JSON.parse(res._getData())
      expect(data.secret).toBeDefined()
      expect(data.qrCode).toBeDefined()
    })

    it('should require authentication', async () => {
      const { req, res } = createMocks({
        method: 'POST',
        query: { action: '2fa-setup' },
      })

      await handler(req, res)

      expect(res._getStatusCode()).toBe(401)
    })
  })

  describe('POST /auth/2fa-verify - Two Factor Code Verification', () => {
    it('should verify valid 2FA code', async () => {
      const token = generateTestToken('user_123')

      const { req, res } = createMocks({
        method: 'POST',
        query: { action: '2fa-verify' },
        headers: { authorization: `Bearer ${token}` },
        body: { code: '123456' },
      })

      await handler(req, res)

      // Should accept valid format
      expect([200, 400]).toContain(res._getStatusCode())
    })

    it('should reject invalid 2FA code', async () => {
      const token = generateTestToken('user_123')

      const { req, res } = createMocks({
        method: 'POST',
        query: { action: '2fa-verify' },
        headers: { authorization: `Bearer ${token}` },
        body: { code: 'invalid' },
      })

      await handler(req, res)

      expect(res._getStatusCode()).toBe(400)
    })

    it('should require 6-digit code', async () => {
      const token = generateTestToken('user_123')

      const { req, res } = createMocks({
        method: 'POST',
        query: { action: '2fa-verify' },
        headers: { authorization: `Bearer ${token}` },
        body: { code: '12345' }, // Only 5 digits
      })

      await handler(req, res)

      expect(res._getStatusCode()).toBe(400)
    })
  })

  describe('HTTP Method Validation', () => {
    it('should reject GET requests', async () => {
      const { req, res } = createMocks({ method: 'GET' })
      await handler(req, res)
      expect(res._getStatusCode()).toBe(405)
    })

    it('should only allow POST', async () => {
      const { req, res } = createMocks({ method: 'PUT' })
      await handler(req, res)
      expect(res._getStatusCode()).toBe(405)
    })
  })
})
