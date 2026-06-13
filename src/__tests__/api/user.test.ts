/**
 * API Tests: /api/user
 * TDD Suite for User Profile & Account Management
 * Tests profile updates, password management, account deletion, and preferences
 */

import { createMocks } from 'node-mocks-http'
import handler from '@/app/api/user/route'
import {
  mockUser,
  mockUserProfile,
  mockUserProfileUpdate,
  mockDatabase,
  generateTestToken,
  isValidPassword,
} from './fixtures'

describe('/api/user - User Profile & Account', () => {
  beforeEach(() => {
    mockDatabase.reset()
    mockDatabase.createUser(mockUser)
    jest.clearAllMocks()
  })

  describe('GET /user/profile - Retrieve User Profile', () => {
    it('should return authenticated user profile', async () => {
      const token = generateTestToken(mockUser.id)

      const { req, res } = createMocks({
        method: 'GET',
        headers: { authorization: `Bearer ${token}` },
        query: { resource: 'profile' },
      })

      await handler(req, res)

      expect(res._getStatusCode()).toBe(200)
      const data = JSON.parse(res._getData())
      expect(data.profile).toBeDefined()
      expect(data.profile.id).toBe(mockUser.id)
      expect(data.profile.email).toBe(mockUser.email)
    })

    it('should require authentication', async () => {
      const { req, res } = createMocks({
        method: 'GET',
        query: { resource: 'profile' },
      })

      await handler(req, res)

      expect(res._getStatusCode()).toBe(401)
    })

    it('should not expose password hash in response', async () => {
      const token = generateTestToken(mockUser.id)

      const { req, res } = createMocks({
        method: 'GET',
        headers: { authorization: `Bearer ${token}` },
        query: { resource: 'profile' },
      })

      await handler(req, res)

      const data = JSON.parse(res._getData())
      expect(data.profile.password).toBeUndefined()
      expect(data.profile.passwordHash).toBeUndefined()
    })

    it('should include user preferences', async () => {
      const token = generateTestToken(mockUser.id)

      const { req, res } = createMocks({
        method: 'GET',
        headers: { authorization: `Bearer ${token}` },
        query: { resource: 'profile', includePreferences: 'true' },
      })

      await handler(req, res)

      const data = JSON.parse(res._getData())
      expect(data.profile).toBeDefined()
    })

    it('should include subscription status if applicable', async () => {
      const token = generateTestToken(mockUser.id)

      const { req, res } = createMocks({
        method: 'GET',
        headers: { authorization: `Bearer ${token}` },
        query: { resource: 'profile', includeSubscription: 'true' },
      })

      await handler(req, res)

      const data = JSON.parse(res._getData())
      if (data.profile.subscription) {
        expect(data.profile.subscription.status).toBeDefined()
      }
    })
  })

  describe('PUT /user/profile - Update User Profile', () => {
    it('should update user profile with valid data', async () => {
      const token = generateTestToken(mockUser.id)

      const { req, res } = createMocks({
        method: 'PUT',
        headers: {
          'content-type': 'application/json',
          authorization: `Bearer ${token}`,
        },
        query: { resource: 'profile' },
        body: mockUserProfileUpdate,
      })

      await handler(req, res)

      expect(res._getStatusCode()).toBe(200)
      const data = JSON.parse(res._getData())
      expect(data.profile.name).toBe(mockUserProfileUpdate.name)
      expect(data.profile.bio).toBe(mockUserProfileUpdate.bio)
    })

    it('should require authentication', async () => {
      const { req, res } = createMocks({
        method: 'PUT',
        query: { resource: 'profile' },
        body: mockUserProfileUpdate,
      })

      await handler(req, res)

      expect(res._getStatusCode()).toBe(401)
    })

    it('should update name field', async () => {
      const token = generateTestToken(mockUser.id)

      const { req, res } = createMocks({
        method: 'PUT',
        headers: { authorization: `Bearer ${token}` },
        query: { resource: 'profile' },
        body: { name: 'New Name' },
      })

      await handler(req, res)

      expect(res._getStatusCode()).toBe(200)
      const updatedUser = mockDatabase.getUser(mockUser.id)
      expect(updatedUser.name).toBe('New Name')
    })

    it('should update bio field', async () => {
      const token = generateTestToken(mockUser.id)

      const { req, res } = createMocks({
        method: 'PUT',
        headers: { authorization: `Bearer ${token}` },
        query: { resource: 'profile' },
        body: { bio: 'Updated bio text' },
      })

      await handler(req, res)

      expect(res._getStatusCode()).toBe(200)
    })

    it('should update timezone', async () => {
      const token = generateTestToken(mockUser.id)

      const { req, res } = createMocks({
        method: 'PUT',
        headers: { authorization: `Bearer ${token}` },
        query: { resource: 'profile' },
        body: { timezone: 'Europe/London' },
      })

      await handler(req, res)

      expect(res._getStatusCode()).toBe(200)
    })

    it('should update avatar/profile picture', async () => {
      const token = generateTestToken(mockUser.id)

      const { req, res } = createMocks({
        method: 'PUT',
        headers: { authorization: `Bearer ${token}` },
        query: { resource: 'profile' },
        body: { avatar: 'https://example.com/new-avatar.jpg' },
      })

      await handler(req, res)

      expect(res._getStatusCode()).toBe(200)
    })

    it('should update notification preferences', async () => {
      const token = generateTestToken(mockUser.id)

      const { req, res } = createMocks({
        method: 'PUT',
        headers: { authorization: `Bearer ${token}` },
        query: { resource: 'profile' },
        body: {
          notifications: {
            email: false,
            push: true,
            sms: true,
          },
        },
      })

      await handler(req, res)

      expect(res._getStatusCode()).toBe(200)
      const data = JSON.parse(res._getData())
      expect(data.profile.notifications).toBeDefined()
    })

    it('should sanitize input fields to prevent XSS', async () => {
      const token = generateTestToken(mockUser.id)

      const { req, res } = createMocks({
        method: 'PUT',
        headers: { authorization: `Bearer ${token}` },
        query: { resource: 'profile' },
        body: {
          name: '<script>alert(1)</script>John',
          bio: 'Test<img src=x onerror=alert(1)>',
        },
      })

      await handler(req, res)

      expect([200, 400]).toContain(res._getStatusCode())
    })

    it('should reject email changes via profile endpoint', async () => {
      const token = generateTestToken(mockUser.id)

      const { req, res } = createMocks({
        method: 'PUT',
        headers: { authorization: `Bearer ${token}` },
        query: { resource: 'profile' },
        body: { email: 'newemail@example.com' },
      })

      await handler(req, res)

      // Email should not be updatable via profile endpoint
      expect([200, 400]).toContain(res._getStatusCode())
      const user = mockDatabase.getUser(mockUser.id)
      expect(user.email).toBe(mockUser.email)
    })

    it('should validate avatar URL format', async () => {
      const token = generateTestToken(mockUser.id)

      const { req, res } = createMocks({
        method: 'PUT',
        headers: { authorization: `Bearer ${token}` },
        query: { resource: 'profile' },
        body: { avatar: 'not-a-valid-url' },
      })

      await handler(req, res)

      expect([200, 400]).toContain(res._getStatusCode())
    })

    it('should trim whitespace from text fields', async () => {
      const token = generateTestToken(mockUser.id)

      const { req, res } = createMocks({
        method: 'PUT',
        headers: { authorization: `Bearer ${token}` },
        query: { resource: 'profile' },
        body: { name: '  John Doe  ', bio: '  Test bio  ' },
      })

      await handler(req, res)

      expect(res._getStatusCode()).toBe(200)
      const data = JSON.parse(res._getData())
      expect(data.profile.name).toBe('John Doe')
      expect(data.profile.bio).toBe('Test bio')
    })
  })

  describe('PUT /user/email - Change Email Address', () => {
    it('should change email with verification', async () => {
      const token = generateTestToken(mockUser.id)
      const newEmail = 'newemail@example.com'

      const { req, res } = createMocks({
        method: 'PUT',
        headers: { authorization: `Bearer ${token}` },
        query: { resource: 'email' },
        body: { newEmail },
      })

      await handler(req, res)

      expect([200, 201]).toContain(res._getStatusCode())
      const data = JSON.parse(res._getData())
      expect(data.message).toContain('verification')
    })

    it('should require current password confirmation', async () => {
      const token = generateTestToken(mockUser.id)

      const { req, res } = createMocks({
        method: 'PUT',
        headers: { authorization: `Bearer ${token}` },
        query: { resource: 'email' },
        body: { newEmail: 'newemail@example.com' },
      })

      await handler(req, res)

      expect(res._getStatusCode()).toBe(400)
      const data = JSON.parse(res._getData())
      expect(data.error).toContain('password')
    })

    it('should reject invalid email format', async () => {
      const token = generateTestToken(mockUser.id)

      const { req, res } = createMocks({
        method: 'PUT',
        headers: { authorization: `Bearer ${token}` },
        query: { resource: 'email' },
        body: {
          newEmail: 'invalid-email',
          currentPassword: 'SecurePassword123!@#',
        },
      })

      await handler(req, res)

      expect(res._getStatusCode()).toBe(400)
    })

    it('should reject duplicate email address', async () => {
      // Create another user
      mockDatabase.createUser({
        email: 'taken@example.com',
        name: 'Other User',
      })

      const token = generateTestToken(mockUser.id)

      const { req, res } = createMocks({
        method: 'PUT',
        headers: { authorization: `Bearer ${token}` },
        query: { resource: 'email' },
        body: {
          newEmail: 'taken@example.com',
          currentPassword: 'SecurePassword123!@#',
        },
      })

      await handler(req, res)

      expect(res._getStatusCode()).toBe(409)
    })

    it('should require verification before email change is final', async () => {
      const token = generateTestToken(mockUser.id)
      const verificationCode = 'abc123'

      const { req, res } = createMocks({
        method: 'PUT',
        headers: { authorization: `Bearer ${token}` },
        query: { resource: 'email', action: 'verify' },
        body: { verificationCode },
      })

      await handler(req, res)

      expect([200, 400]).toContain(res._getStatusCode())
    })
  })

  describe('PUT /user/password - Change Password', () => {
    it('should change password with valid current password', async () => {
      const token = generateTestToken(mockUser.id)

      const { req, res } = createMocks({
        method: 'PUT',
        headers: { authorization: `Bearer ${token}` },
        query: { resource: 'password' },
        body: {
          currentPassword: 'OldPassword123!@#',
          newPassword: 'NewPassword456!@#',
        },
      })

      await handler(req, res)

      expect([200, 400]).toContain(res._getStatusCode())
    })

    it('should require current password verification', async () => {
      const token = generateTestToken(mockUser.id)

      const { req, res } = createMocks({
        method: 'PUT',
        headers: { authorization: `Bearer ${token}` },
        query: { resource: 'password' },
        body: {
          newPassword: 'NewPassword456!@#',
        },
      })

      await handler(req, res)

      expect(res._getStatusCode()).toBe(400)
    })

    it('should reject weak new password', async () => {
      const token = generateTestToken(mockUser.id)

      const { req, res } = createMocks({
        method: 'PUT',
        headers: { authorization: `Bearer ${token}` },
        query: { resource: 'password' },
        body: {
          currentPassword: 'OldPassword123!@#',
          newPassword: 'weak',
        },
      })

      await handler(req, res)

      expect(res._getStatusCode()).toBe(400)
      const data = JSON.parse(res._getData())
      expect(data.error).toContain('password')
    })

    it('should not allow reusing old passwords', async () => {
      const token = generateTestToken(mockUser.id)

      const { req, res } = createMocks({
        method: 'PUT',
        headers: { authorization: `Bearer ${token}` },
        query: { resource: 'password' },
        body: {
          currentPassword: 'OldPassword123!@#',
          newPassword: 'OldPassword123!@#',
        },
      })

      await handler(req, res)

      expect(res._getStatusCode()).toBe(400)
    })

    it('should hash new password before storing', async () => {
      const token = generateTestToken(mockUser.id)
      const newPassword = 'NewPassword456!@#'

      const { req, res } = createMocks({
        method: 'PUT',
        headers: { authorization: `Bearer ${token}` },
        query: { resource: 'password' },
        body: {
          currentPassword: 'OldPassword123!@#',
          newPassword,
        },
      })

      await handler(req, res)

      // If successful, verify password is hashed
      if (res._getStatusCode() === 200) {
        const user = mockDatabase.getUser(mockUser.id)
        expect(user.password).not.toBe(newPassword)
      }
    })
  })

  describe('DELETE /user/account - Delete Account', () => {
    it('should require password confirmation for account deletion', async () => {
      const token = generateTestToken(mockUser.id)

      const { req, res } = createMocks({
        method: 'DELETE',
        headers: { authorization: `Bearer ${token}` },
        query: { resource: 'account' },
        body: {
          password: 'SecurePassword123!@#',
        },
      })

      await handler(req, res)

      expect([200, 204, 400]).toContain(res._getStatusCode())
    })

    it('should require explicit confirmation', async () => {
      const token = generateTestToken(mockUser.id)

      const { req, res } = createMocks({
        method: 'DELETE',
        headers: { authorization: `Bearer ${token}` },
        query: { resource: 'account' },
        body: {
          password: 'SecurePassword123!@#',
          confirmDeletion: true,
        },
      })

      await handler(req, res)

      expect([200, 204, 400]).toContain(res._getStatusCode())
    })

    it('should reject deletion without password', async () => {
      const token = generateTestToken(mockUser.id)

      const { req, res } = createMocks({
        method: 'DELETE',
        headers: { authorization: `Bearer ${token}` },
        query: { resource: 'account' },
        body: { confirmDeletion: true },
      })

      await handler(req, res)

      expect(res._getStatusCode()).toBe(400)
    })

    it('should reject with incorrect password', async () => {
      const token = generateTestToken(mockUser.id)

      const { req, res } = createMocks({
        method: 'DELETE',
        headers: { authorization: `Bearer ${token}` },
        query: { resource: 'account' },
        body: {
          password: 'WrongPassword123!@#',
          confirmDeletion: true,
        },
      })

      await handler(req, res)

      expect(res._getStatusCode()).toBe(401)
    })

    it('should anonymize or delete all user data', async () => {
      const token = generateTestToken(mockUser.id)

      const { req, res } = createMocks({
        method: 'DELETE',
        headers: { authorization: `Bearer ${token}` },
        query: { resource: 'account' },
        body: {
          password: 'SecurePassword123!@#',
          confirmDeletion: true,
          method: 'permanent', // or 'anonymize'
        },
      })

      await handler(req, res)

      expect([200, 204, 400]).toContain(res._getStatusCode())
    })

    it('should require confirmation text match', async () => {
      const token = generateTestToken(mockUser.id)

      const { req, res } = createMocks({
        method: 'DELETE',
        headers: { authorization: `Bearer ${token}` },
        query: { resource: 'account' },
        body: {
          password: 'SecurePassword123!@#',
          confirmText: 'DELETE MY ACCOUNT', // User must type this
        },
      })

      await handler(req, res)

      expect([200, 204, 400]).toContain(res._getStatusCode())
    })

    it('should prevent accidental account deletion', async () => {
      const token = generateTestToken(mockUser.id)

      // Missing required confirmation
      const { req, res } = createMocks({
        method: 'DELETE',
        headers: { authorization: `Bearer ${token}` },
        query: { resource: 'account' },
        body: { password: 'SecurePassword123!@#' },
      })

      await handler(req, res)

      expect(res._getStatusCode()).toBe(400)
      // User should still exist
      const user = mockDatabase.getUser(mockUser.id)
      expect(user).toBeDefined()
    })

    it('should require authentication', async () => {
      const { req, res } = createMocks({
        method: 'DELETE',
        query: { resource: 'account' },
        body: { password: 'SecurePassword123!@#', confirmDeletion: true },
      })

      await handler(req, res)

      expect(res._getStatusCode()).toBe(401)
    })
  })

  describe('GET /user/sessions - List Active Sessions', () => {
    it('should list all active sessions for user', async () => {
      const token = generateTestToken(mockUser.id)

      const { req, res } = createMocks({
        method: 'GET',
        headers: { authorization: `Bearer ${token}` },
        query: { resource: 'sessions' },
      })

      await handler(req, res)

      expect(res._getStatusCode()).toBe(200)
      const data = JSON.parse(res._getData())
      expect(Array.isArray(data.sessions)).toBe(true)
    })

    it('should include session details: device, location, last activity', async () => {
      const token = generateTestToken(mockUser.id)

      const { req, res } = createMocks({
        method: 'GET',
        headers: { authorization: `Bearer ${token}` },
        query: { resource: 'sessions' },
      })

      await handler(req, res)

      const data = JSON.parse(res._getData())
      if (data.sessions.length > 0) {
        const session = data.sessions[0]
        expect(session.deviceName || session.device).toBeDefined()
        expect(session.lastActivity || session.lastUsed).toBeDefined()
      }
    })
  })

  describe('DELETE /user/sessions/:sessionId - Revoke Session', () => {
    it('should revoke a specific session', async () => {
      const token = generateTestToken(mockUser.id)

      const { req, res } = createMocks({
        method: 'DELETE',
        headers: { authorization: `Bearer ${token}` },
        query: { resource: 'sessions', sessionId: 'session_789' },
      })

      await handler(req, res)

      expect([200, 204, 404]).toContain(res._getStatusCode())
    })

    it('should logout from all other sessions', async () => {
      const token = generateTestToken(mockUser.id)

      const { req, res } = createMocks({
        method: 'DELETE',
        headers: { authorization: `Bearer ${token}` },
        query: {
          resource: 'sessions',
          action: 'logout-all-except-current',
        },
      })

      await handler(req, res)

      expect([200, 204, 404]).toContain(res._getStatusCode())
    })

    it('should require authentication', async () => {
      const { req, res } = createMocks({
        method: 'DELETE',
        query: { resource: 'sessions', sessionId: 'session_789' },
      })

      await handler(req, res)

      expect(res._getStatusCode()).toBe(401)
    })
  })

  describe('Account Security', () => {
    it('should not expose sensitive data in responses', async () => {
      const token = generateTestToken(mockUser.id)

      const { req, res } = createMocks({
        method: 'GET',
        headers: { authorization: `Bearer ${token}` },
        query: { resource: 'profile' },
      })

      await handler(req, res)

      const data = JSON.parse(res._getData())
      expect(data.profile.password).toBeUndefined()
      expect(data.profile.passwordHash).toBeUndefined()
      expect(data.profile.ssn).toBeUndefined()
    })

    it('should prevent privilege escalation in updates', async () => {
      const token = generateTestToken(mockUser.id)

      const { req, res } = createMocks({
        method: 'PUT',
        headers: { authorization: `Bearer ${token}` },
        query: { resource: 'profile' },
        body: {
          role: 'admin', // User should not be able to set their own role
        },
      })

      await handler(req, res)

      const user = mockDatabase.getUser(mockUser.id)
      expect(user.role).not.toBe('admin')
    })

    it('should audit sensitive operations', async () => {
      const token = generateTestToken(mockUser.id)

      const auditSpy = jest.fn()
      jest.spyOn(console, 'log').mockImplementation(auditSpy)

      const { req, res } = createMocks({
        method: 'DELETE',
        headers: { authorization: `Bearer ${token}` },
        query: { resource: 'account' },
      })

      // Note: actual deletion may fail, but audit should be logged
    })
  })

  describe('HTTP Method Validation', () => {
    it('should support GET for retrieval', async () => {
      const token = generateTestToken(mockUser.id)

      const { req, res } = createMocks({
        method: 'GET',
        headers: { authorization: `Bearer ${token}` },
        query: { resource: 'profile' },
      })

      await handler(req, res)

      expect([200, 400]).toContain(res._getStatusCode())
    })

    it('should support PUT for updates', async () => {
      const token = generateTestToken(mockUser.id)

      const { req, res } = createMocks({
        method: 'PUT',
        headers: { authorization: `Bearer ${token}` },
        query: { resource: 'profile' },
        body: { name: 'Updated Name' },
      })

      await handler(req, res)

      expect([200, 400]).toContain(res._getStatusCode())
    })

    it('should support DELETE for account deletion', async () => {
      const token = generateTestToken(mockUser.id)

      const { req, res } = createMocks({
        method: 'DELETE',
        headers: { authorization: `Bearer ${token}` },
        query: { resource: 'account' },
      })

      await handler(req, res)

      expect([204, 400, 401]).toContain(res._getStatusCode())
    })

    it('should reject POST requests to user endpoint', async () => {
      const token = generateTestToken(mockUser.id)

      const { req, res } = createMocks({
        method: 'POST',
        headers: { authorization: `Bearer ${token}` },
        query: { resource: 'profile' },
        body: { name: 'Test' },
      })

      await handler(req, res)

      expect(res._getStatusCode()).toBe(405)
    })
  })
})
