import { expect, afterEach, vi } from 'vitest'
import { cleanup } from '@testing-library/react'

// Cleanup after each test
afterEach(() => {
  cleanup()
})

// Mock next/navigation
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
    prefetch: vi.fn(),
    back: vi.fn(),
    forward: vi.fn(),
    refresh: vi.fn(),
  }),
  usePathname: () => '/',
  useSearchParams: () => new URLSearchParams(),
  useParams: () => ({}),
}))

// Mock next/image
vi.mock('next/image', () => ({
  default: {
    displayName: 'MockedImage',
    getBase64: vi.fn(),
  },
}))

// Mock clerk
vi.mock('@clerk/nextjs', () => ({
  useAuth: () => ({
    isLoaded: true,
    isSignedIn: true,
    userId: 'test-user-123',
  }),
  useUser: () => ({
    isLoaded: true,
    user: {
      id: 'test-user-123',
      primaryEmailAddress: { emailAddress: 'test@example.com' },
      firstName: 'Test',
      lastName: 'User',
    },
  }),
  useClerk: () => ({
    signOut: vi.fn(),
  }),
}))

// Suppress console errors/warnings in tests
global.console = {
  ...console,
  error: vi.fn(),
  warn: vi.fn(),
}
