import { SignJWT, jwtVerify } from 'jose'
import { prisma } from '@/lib/prisma'
import crypto from 'crypto'

const SECRET = new TextEncoder().encode(process.env.AUTH_SECRET)

const ACCESS_TOKEN_EXPIRY = '15m'
const REFRESH_TOKEN_EXPIRY = '30d'

export interface MobileTokenPayload {
  sub: string // userId
  email: string
  name: string
  role: string
}

/**
 * Sign a new access token (short-lived)
 */
export async function signAccessToken(payload: MobileTokenPayload): Promise<string> {
  return new SignJWT({ ...payload })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(ACCESS_TOKEN_EXPIRY)
    .setAudience('hmc-mobile')
    .sign(SECRET)
}

/**
 * Sign a new refresh token (long-lived)
 */
export async function signRefreshToken(payload: MobileTokenPayload): Promise<string> {
  return new SignJWT({ ...payload })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(REFRESH_TOKEN_EXPIRY)
    .setAudience('hmc-mobile-refresh')
    .sign(SECRET)
}

/**
 * Verify an access token from Authorization: Bearer header
 */
export async function verifyAccessToken(token: string): Promise<MobileTokenPayload | null> {
  try {
    const { payload } = await jwtVerify(token, SECRET, {
      audience: 'hmc-mobile',
    })
    return {
      sub: payload.sub as string,
      email: payload.email as string,
      name: payload.name as string,
      role: payload.role as string,
    }
  } catch {
    return null
  }
}

/**
 * Verify a refresh token
 */
export async function verifyRefreshToken(token: string): Promise<MobileTokenPayload | null> {
  try {
    const { payload } = await jwtVerify(token, SECRET, {
      audience: 'hmc-mobile-refresh',
    })
    return {
      sub: payload.sub as string,
      email: payload.email as string,
      name: payload.name as string,
      role: payload.role as string,
    }
  } catch {
    return null
  }
}

/**
 * Extract Bearer token from request Authorization header
 */
export function extractBearerToken(request: Request): string | null {
  const authHeader = request.headers.get('Authorization')
  if (!authHeader?.startsWith('Bearer ')) return null
  return authHeader.slice(7)
}

/**
 * Verify mobile token from request and return user payload.
 * Use this in API routes to authenticate mobile requests.
 */
export async function verifyMobileRequest(request: Request): Promise<MobileTokenPayload | null> {
  const token = extractBearerToken(request)
  if (!token) return null
  return verifyAccessToken(token)
}

/**
 * Generate a cryptographically random refresh token family ID
 */
export function generateTokenFamily(): string {
  return crypto.randomBytes(32).toString('hex')
}

/**
 * Store a refresh token in the database (with rotation support)
 */
export async function storeRefreshToken(
  userId: string,
  token: string,
  family: string
): Promise<void> {
  await prisma.refreshToken.create({
    data: {
      userId,
      token,
      family,
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
    },
  })
}

/**
 * Rotate a refresh token: invalidate old one, issue new one
 * Returns null if the old token is not found (possible replay attack)
 */
export async function rotateRefreshToken(
  oldToken: string,
  newToken: string,
  userId: string
): Promise<{ family: string } | null> {
  const existing = await prisma.refreshToken.findUnique({
    where: { token: oldToken },
  })

  if (!existing || existing.userId !== userId || existing.revokedAt) {
    // Possible token reuse attack - revoke entire family
    if (existing) {
      await prisma.refreshToken.updateMany({
        where: { family: existing.family },
        data: { revokedAt: new Date() },
      })
    }
    return null
  }

  if (existing.expiresAt < new Date()) {
    return null
  }

  // Revoke old token and create new one in the same family
  await prisma.refreshToken.update({
    where: { id: existing.id },
    data: { revokedAt: new Date() },
  })

  await storeRefreshToken(userId, newToken, existing.family)

  return { family: existing.family }
}

/**
 * Revoke all refresh tokens for a user (logout from all devices)
 */
export async function revokeAllUserTokens(userId: string): Promise<void> {
  await prisma.refreshToken.updateMany({
    where: { userId, revokedAt: null },
    data: { revokedAt: new Date() },
  })
}

/**
 * Revoke all tokens in a family (single device logout)
 */
export async function revokeTokenFamily(family: string): Promise<void> {
  await prisma.refreshToken.updateMany({
    where: { family, revokedAt: null },
    data: { revokedAt: new Date() },
  })
}
