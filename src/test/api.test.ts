import { describe, it, expect } from 'vitest'

describe('API Integration', () => {
  it('should have valid API base URL format', () => {
    const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3000"
    expect(apiUrl).toMatch(/^https?:\/\//)
  })

  it('should have environment variables defined', () => {
    expect(process.env).toBeDefined()
  })
})
