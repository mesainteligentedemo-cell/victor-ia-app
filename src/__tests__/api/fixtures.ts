/**
 * Shared test fixtures and mocks for API testing
 * Includes mock data, database utilities, and common test helpers
 */

export const mockUser = {
  id: 'user_123',
  email: 'test@example.com',
  name: 'Test User',
  role: 'user',
  createdAt: new Date('2024-01-01'),
}

export const mockUserPremium = {
  id: 'user_456',
  email: 'premium@example.com',
  name: 'Premium User',
  role: 'premium',
  createdAt: new Date('2023-06-01'),
}

export const mockContactFormSubmission = {
  email: 'contact@example.com',
  name: 'Contact User',
  message: 'I have a question about your services',
  company: 'Acme Corp',
  phone: '+1-555-0100',
}

export const mockAuthCredentials = {
  email: 'newuser@example.com',
  password: 'SecurePassword123!@#',
}

export const mockAuthLogin = {
  email: 'test@example.com',
  password: 'SecurePassword123!@#',
}

export const mockAnalyticsEvent = {
  userId: 'user_123',
  eventName: 'page_view',
  eventProperties: {
    page: '/dashboard',
    referrer: '/home',
    timestamp: new Date().toISOString(),
  },
  sessionId: 'session_789',
}

export const mockStripePlan = {
  id: 'price_pro_monthly',
  name: 'Pro Monthly',
  amount: 4999, // $49.99 in cents
  currency: 'usd',
  interval: 'month',
  trialDays: 14,
}

export const mockBillingSubscription = {
  customerId: 'cus_123abc',
  priceId: 'price_pro_monthly',
  quantity: 1,
}

export const mockUserProfile = {
  id: 'user_123',
  email: 'test@example.com',
  name: 'Test User',
  avatar: 'https://example.com/avatar.jpg',
  bio: 'Test bio',
  timezone: 'America/New_York',
  notifications: {
    email: true,
    push: true,
    sms: false,
  },
}

export const mockUserProfileUpdate = {
  name: 'Updated Name',
  bio: 'Updated bio',
  timezone: 'America/Los_Angeles',
  notifications: {
    email: false,
    push: true,
    sms: true,
  },
}

// Rate limit tracking for tests
export const createRateLimitStore = () => {
  const store = new Map<string, { count: number; resetAt: number }>()

  return {
    checkLimit: (key: string, maxRequests: number, windowMs: number): boolean => {
      const now = Date.now()
      const existing = store.get(key)

      if (!existing || now > existing.resetAt) {
        store.set(key, { count: 1, resetAt: now + windowMs })
        return true
      }

      if (existing.count < maxRequests) {
        existing.count++
        return true
      }

      return false
    },
    reset: () => store.clear(),
    get: (key: string) => store.get(key),
  }
}

// Mock database operations
export const mockDatabase = {
  users: new Map(),
  contacts: new Map(),
  analytics: new Map(),
  subscriptions: new Map(),

  createUser: function (data: any) {
    const id = `user_${Date.now()}`
    this.users.set(id, { id, ...data, createdAt: new Date() })
    return this.users.get(id)
  },

  getUser: function (id: string) {
    return this.users.get(id)
  },

  getUserByEmail: function (email: string) {
    for (const user of this.users.values()) {
      if (user.email === email) return user
    }
    return null
  },

  updateUser: function (id: string, data: any) {
    const user = this.users.get(id)
    if (user) {
      Object.assign(user, data, { updatedAt: new Date() })
    }
    return user
  },

  deleteUser: function (id: string) {
    return this.users.delete(id)
  },

  createContact: function (data: any) {
    const id = `contact_${Date.now()}`
    this.contacts.set(id, { id, ...data, createdAt: new Date() })
    return this.contacts.get(id)
  },

  getContacts: function (userId: string) {
    const contacts = []
    for (const contact of this.contacts.values()) {
      if (contact.userId === userId) contacts.push(contact)
    }
    return contacts
  },

  logAnalyticsEvent: function (data: any) {
    const id = `event_${Date.now()}`
    this.analytics.set(id, { id, ...data })
    return this.analytics.get(id)
  },

  getAnalyticsEvents: function (userId: string) {
    const events = []
    for (const event of this.analytics.values()) {
      if (event.userId === userId) events.push(event)
    }
    return events
  },

  createSubscription: function (data: any) {
    const id = `sub_${Date.now()}`
    this.subscriptions.set(id, { id, ...data, createdAt: new Date() })
    return this.subscriptions.get(id)
  },

  getSubscription: function (customerId: string) {
    for (const sub of this.subscriptions.values()) {
      if (sub.customerId === customerId) return sub
    }
    return null
  },

  updateSubscription: function (id: string, data: any) {
    const sub = this.subscriptions.get(id)
    if (sub) {
      Object.assign(sub, data, { updatedAt: new Date() })
    }
    return sub
  },

  reset: function () {
    this.users.clear()
    this.contacts.clear()
    this.analytics.clear()
    this.subscriptions.clear()
  },
}

// Email validation
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email) && email.length <= 254
}

// XSS detection
export const containsXSS = (input: string): boolean => {
  const xssPatterns = [
    /<script[^>]*>.*?<\/script>/gi,
    /on\w+\s*=/gi,
    /<iframe[^>]*>/gi,
    /javascript:/gi,
    /<embed[^>]*>/gi,
    /<object[^>]*>/gi,
  ]

  return xssPatterns.some((pattern) => pattern.test(input))
}

// Password validation
export const isValidPassword = (password: string): boolean => {
  const minLength = 8
  const hasUpperCase = /[A-Z]/.test(password)
  const hasLowerCase = /[a-z]/.test(password)
  const hasNumbers = /\d/.test(password)
  const hasSpecialChar = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)

  return (
    password.length >= minLength &&
    hasUpperCase &&
    hasLowerCase &&
    hasNumbers &&
    hasSpecialChar
  )
}

// Generate test tokens
export const generateTestToken = (userId: string, expiresIn: number = 3600000): string => {
  const payload = Buffer.from(
    JSON.stringify({
      userId,
      iat: Date.now(),
      exp: Date.now() + expiresIn,
    })
  ).toString('base64')

  return `test.${payload}.signature`
}

// Error response builder
export const createErrorResponse = (status: number, message: string, code?: string) => {
  return {
    status,
    body: {
      error: message,
      ...(code && { code }),
      timestamp: new Date().toISOString(),
    },
  }
}

// Success response builder
export const createSuccessResponse = (data: any, status: number = 200) => {
  return {
    status,
    body: {
      success: true,
      data,
      timestamp: new Date().toISOString(),
    },
  }
}
