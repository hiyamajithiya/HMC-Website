import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { encrypt } from '@/lib/encryption'
import { checkAdmin } from '@/lib/auth-check'
import { clearSocialMediaCache } from '@/lib/social-media'

export const dynamic = 'force-dynamic'

const ENCRYPTED_KEYS = [
  'social_twitter_api_secret',
  'social_twitter_access_token',
  'social_twitter_access_secret',
  'social_linkedin_access_token',
  'social_facebook_page_access_token',
]

const ALL_KEYS = [
  'social_twitter_enabled',
  'social_twitter_api_key',
  'social_twitter_api_secret',
  'social_twitter_access_token',
  'social_twitter_access_secret',
  'social_linkedin_enabled',
  'social_linkedin_access_token',
  'social_linkedin_person_urn',
  'social_facebook_enabled',
  'social_facebook_page_access_token',
  'social_facebook_page_id',
  'social_instagram_enabled',
  'social_instagram_account_id',
]

// GET - Get social media settings
export async function GET() {
  try {
    const adminCheck = await checkAdmin()
    if ('error' in adminCheck) {
      return NextResponse.json({ error: adminCheck.error }, { status: adminCheck.status })
    }

    const settings = await prisma.siteSetting.findMany({
      where: { key: { in: ALL_KEYS } },
    })

    const settingsObj: Record<string, string> = {}
    for (const setting of settings) {
      if (ENCRYPTED_KEYS.includes(setting.key)) {
        // Don't send actual tokens, just indicate if set
        settingsObj[setting.key] = setting.value ? '********' : ''
      } else {
        settingsObj[setting.key] = setting.value
      }
    }

    return NextResponse.json({
      success: true,
      settings: {
        twitter: {
          enabled: settingsObj.social_twitter_enabled === 'true',
          apiKey: settingsObj.social_twitter_api_key || '',
          apiSecret: settingsObj.social_twitter_api_secret || '',
          accessToken: settingsObj.social_twitter_access_token || '',
          accessSecret: settingsObj.social_twitter_access_secret || '',
        },
        linkedin: {
          enabled: settingsObj.social_linkedin_enabled === 'true',
          accessToken: settingsObj.social_linkedin_access_token || '',
          personUrn: settingsObj.social_linkedin_person_urn || '',
        },
        facebook: {
          enabled: settingsObj.social_facebook_enabled === 'true',
          pageAccessToken: settingsObj.social_facebook_page_access_token || '',
          pageId: settingsObj.social_facebook_page_id || '',
        },
        instagram: {
          enabled: settingsObj.social_instagram_enabled === 'true',
          instagramAccountId: settingsObj.social_instagram_account_id || '',
        },
      },
    })
  } catch (error) {
    console.error('Failed to get social media settings:', error)
    return NextResponse.json({ error: 'Failed to get settings' }, { status: 500 })
  }
}

// POST - Save social media settings
export async function POST(request: NextRequest) {
  try {
    const adminCheck = await checkAdmin()
    if ('error' in adminCheck) {
      return NextResponse.json({ error: adminCheck.error }, { status: adminCheck.status })
    }

    const body = await request.json()
    const { twitter, linkedin, facebook, instagram } = body

    const settingsToSave: Array<{ key: string; value: string }> = []

    // Twitter settings
    if (twitter) {
      settingsToSave.push({ key: 'social_twitter_enabled', value: String(!!twitter.enabled) })
      if (twitter.apiKey !== undefined) {
        settingsToSave.push({ key: 'social_twitter_api_key', value: twitter.apiKey })
      }
      if (twitter.apiSecret && twitter.apiSecret !== '********') {
        settingsToSave.push({ key: 'social_twitter_api_secret', value: encrypt(twitter.apiSecret) })
      }
      if (twitter.accessToken && twitter.accessToken !== '********') {
        settingsToSave.push({ key: 'social_twitter_access_token', value: encrypt(twitter.accessToken) })
      }
      if (twitter.accessSecret && twitter.accessSecret !== '********') {
        settingsToSave.push({ key: 'social_twitter_access_secret', value: encrypt(twitter.accessSecret) })
      }
    }

    // LinkedIn settings
    if (linkedin) {
      settingsToSave.push({ key: 'social_linkedin_enabled', value: String(!!linkedin.enabled) })
      if (linkedin.accessToken && linkedin.accessToken !== '********') {
        settingsToSave.push({ key: 'social_linkedin_access_token', value: encrypt(linkedin.accessToken) })
      }
      if (linkedin.personUrn !== undefined) {
        settingsToSave.push({ key: 'social_linkedin_person_urn', value: linkedin.personUrn })
      }
    }

    // Facebook settings
    if (facebook) {
      settingsToSave.push({ key: 'social_facebook_enabled', value: String(!!facebook.enabled) })
      if (facebook.pageAccessToken && facebook.pageAccessToken !== '********') {
        settingsToSave.push({ key: 'social_facebook_page_access_token', value: encrypt(facebook.pageAccessToken) })
      }
      if (facebook.pageId !== undefined) {
        settingsToSave.push({ key: 'social_facebook_page_id', value: facebook.pageId })
      }
    }

    // Instagram settings
    if (instagram) {
      settingsToSave.push({ key: 'social_instagram_enabled', value: String(!!instagram.enabled) })
      if (instagram.instagramAccountId !== undefined) {
        settingsToSave.push({ key: 'social_instagram_account_id', value: instagram.instagramAccountId })
      }
      // Instagram uses the same Facebook Page Access Token — saved under Facebook settings
    }

    // Upsert each setting
    for (const setting of settingsToSave) {
      await prisma.siteSetting.upsert({
        where: { key: setting.key },
        update: { value: setting.value },
        create: { key: setting.key, value: setting.value },
      })
    }

    clearSocialMediaCache()

    return NextResponse.json({
      success: true,
      message: 'Social media settings saved successfully',
    })
  } catch (error) {
    console.error('Failed to save social media settings:', error)
    return NextResponse.json({ error: 'Failed to save settings' }, { status: 500 })
  }
}
