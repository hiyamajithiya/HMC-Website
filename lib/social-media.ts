import { prisma } from '@/lib/prisma'
import { decrypt } from '@/lib/encryption'

// Cache for social media settings (refresh every 5 minutes)
let socialSettingsCache: {
  settings: SocialMediaSettings | null
  timestamp: number
} = {
  settings: null,
  timestamp: 0,
}

const CACHE_TTL = 5 * 60 * 1000 // 5 minutes

export interface TwitterSettings {
  enabled: boolean
  apiKey: string
  apiSecret: string
  accessToken: string
  accessSecret: string
}

export interface LinkedInSettings {
  enabled: boolean
  accessToken: string
  personUrn: string // urn:li:person:XXXXX or urn:li:organization:XXXXX
}

export interface SocialMediaSettings {
  twitter: TwitterSettings
  linkedin: LinkedInSettings
}

const SOCIAL_KEYS = [
  'social_twitter_enabled',
  'social_twitter_api_key',
  'social_twitter_api_secret',
  'social_twitter_access_token',
  'social_twitter_access_secret',
  'social_linkedin_enabled',
  'social_linkedin_access_token',
  'social_linkedin_person_urn',
]

// Encrypted keys (these get decrypted when read)
const ENCRYPTED_KEYS = [
  'social_twitter_api_secret',
  'social_twitter_access_token',
  'social_twitter_access_secret',
  'social_linkedin_access_token',
]

export async function getSocialMediaSettings(): Promise<SocialMediaSettings | null> {
  const now = Date.now()

  // Return cached settings if still valid
  if (socialSettingsCache.settings && now - socialSettingsCache.timestamp < CACHE_TTL) {
    return socialSettingsCache.settings
  }

  try {
    const settings = await prisma.siteSetting.findMany({
      where: { key: { in: SOCIAL_KEYS } },
    })

    if (settings.length === 0) {
      return null
    }

    const map: Record<string, string> = {}
    for (const s of settings) {
      if (ENCRYPTED_KEYS.includes(s.key) && s.value) {
        map[s.key] = decrypt(s.value)
      } else {
        map[s.key] = s.value
      }
    }

    const socialSettings: SocialMediaSettings = {
      twitter: {
        enabled: map.social_twitter_enabled === 'true',
        apiKey: map.social_twitter_api_key || '',
        apiSecret: map.social_twitter_api_secret || '',
        accessToken: map.social_twitter_access_token || '',
        accessSecret: map.social_twitter_access_secret || '',
      },
      linkedin: {
        enabled: map.social_linkedin_enabled === 'true',
        accessToken: map.social_linkedin_access_token || '',
        personUrn: map.social_linkedin_person_urn || '',
      },
    }

    socialSettingsCache = { settings: socialSettings, timestamp: now }
    return socialSettings
  } catch (error) {
    console.error('Failed to get social media settings:', error)
    return null
  }
}

export function clearSocialMediaCache() {
  socialSettingsCache = { settings: null, timestamp: 0 }
}
