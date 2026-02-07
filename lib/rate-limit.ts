/**
 * Simple in-memory rate limiter for API routes.
 * No external dependencies required.
 */

interface RateLimitEntry {
  count: number
  resetTime: number
}

const rateLimitMap = new Map<string, RateLimitEntry>()

// Clean up expired entries every 5 minutes
setInterval(() => {
  const now = Date.now()
  rateLimitMap.forEach((entry, key) => {
    if (now > entry.resetTime) {
      rateLimitMap.delete(key)
    }
  })
}, 5 * 60 * 1000)

interface RateLimitOptions {
  /** Maximum requests allowed in the window */
  max: number
  /** Time window in seconds */
  windowSeconds: number
}

interface RateLimitResult {
  success: boolean
  remaining: number
  resetTime: number
}

/**
 * Check rate limit for a given key (usually IP + route)
 */
export function checkRateLimit(
  key: string,
  options: RateLimitOptions = { max: 10, windowSeconds: 60 }
): RateLimitResult {
  const now = Date.now()
  const entry = rateLimitMap.get(key)

  if (!entry || now > entry.resetTime) {
    // New window
    rateLimitMap.set(key, {
      count: 1,
      resetTime: now + options.windowSeconds * 1000,
    })
    return { success: true, remaining: options.max - 1, resetTime: now + options.windowSeconds * 1000 }
  }

  if (entry.count >= options.max) {
    return { success: false, remaining: 0, resetTime: entry.resetTime }
  }

  entry.count++
  return { success: true, remaining: options.max - entry.count, resetTime: entry.resetTime }
}

/**
 * Get client IP from request headers
 */
export function getClientIp(request: Request): string {
  const forwarded = request.headers.get('x-forwarded-for')
  if (forwarded) {
    return forwarded.split(',')[0].trim()
  }
  return request.headers.get('x-real-ip') || 'unknown'
}
