/**
 * SETUP GUIDE (2 steps)
 * STEP 1: Set AI_RATE_LIMIT="10" in .env.local (requests per minute)
 * STEP 2: Implement in API routes that need protection
 * NOTE: In-memory rate limiting (use Redis in production)
 * TODO: Implement Redis-based rate limiting for production
 */

// BEGINNER: Set AI_RATE_LIMIT="10" in .env.local to limit AI requests

interface RateLimitData {
  count: number
  lastReset: number
}

// PERF: In-memory storage - use Redis in production for distributed systems
const rateLimitMap = new Map<string, RateLimitData>()

export function checkRateLimit(
  identifier: string,
  limit: number = parseInt(process.env.AI_RATE_LIMIT || '10'),
  windowMs: number = 60 * 1000 // 1 minute
): { allowed: boolean; remaining: number; resetTime: number } {
  const now = Date.now()
  const windowStart = now - windowMs
  
  let data = rateLimitMap.get(identifier)
  
  // Reset if window has passed
  if (!data || data.lastReset < windowStart) {
    data = {
      count: 0,
      lastReset: now,
    }
  }
  
  // Check if limit exceeded
  if (data.count >= limit) {
    return {
      allowed: false,
      remaining: 0,
      resetTime: data.lastReset + windowMs,
    }
  }
  
  // Increment counter
  data.count++
  rateLimitMap.set(identifier, data)
  
  return {
    allowed: true,
    remaining: limit - data.count,
    resetTime: data.lastReset + windowMs,
  }
}

// Clean up old entries periodically
export function cleanupRateLimit(): void {
  const now = Date.now()
  const threshold = now - (60 * 1000) // 1 minute ago
  
  for (const [key, data] of rateLimitMap.entries()) {
    if (data.lastReset < threshold) {
      rateLimitMap.delete(key)
    }
  }
}

// Get client IP for rate limiting
export function getClientIP(request: Request): string {
  const forwarded = request.headers.get('x-forwarded-for')
  const realIP = request.headers.get('x-real-ip')
  
  if (forwarded) {
    return forwarded.split(',')[0].trim()
  }
  
  if (realIP) {
    return realIP
  }
  
  return 'unknown'
}