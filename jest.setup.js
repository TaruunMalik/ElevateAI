import '@testing-library/jest-dom'
import { TextEncoder, TextDecoder } from 'util'

// Add Node.js global for TextEncoder/TextDecoder
global.TextEncoder = TextEncoder
global.TextDecoder = TextDecoder

// Mock next/navigation
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    prefetch: jest.fn(),
  }),
  useSearchParams: () => ({
    get: jest.fn(),
  }),
  usePathname: () => '/',
}))

// Mock clerk auth
jest.mock('@clerk/nextjs/server', () => ({
  auth: jest.fn(),
}))

// Mock Google Generative AI BEFORE prisma is loaded
jest.mock('@google/generative-ai', () => ({
  GoogleGenerativeAI: jest.fn(() => ({
    getGenerativeModel: jest.fn(() => ({
      generateContent: jest.fn(),
    })),
  })),
}))

// Mock prisma db
jest.mock('@/lib/prisma', () => ({
  db: {
    user: {
      findUnique: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
    },
    assessment: {
      create: jest.fn(),
      findMany: jest.fn(),
    },
    voiceAssessment: {
      create: jest.fn(),
      findMany: jest.fn(),
    },
    resume: {
      create: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
      upsert: jest.fn(),
    },
    coverLetter: {
      create: jest.fn(),
      findMany: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
    industryInsight: {
      create: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
    },
    $transaction: jest.fn(),
  },
}))

// Mock next/cache
jest.mock('next/cache', () => ({
  revalidatePath: jest.fn(),
  revalidateTag: jest.fn(),
}))
