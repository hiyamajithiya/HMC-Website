import { TwitterApi } from 'twitter-api-v2'
import { prisma } from '@/lib/prisma'
import { getSocialMediaSettings } from '@/lib/social-media'
import path from 'path'
import fs from 'fs'

interface BlogPostData {
  id: string
  title: string
  slug: string
  excerpt: string
  coverImage: string | null
  tags: string[]
}

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://himanshumajithiya.com'

// Build post text for Twitter (280 char limit, links use ~23 chars)
function buildTwitterText(post: BlogPostData): string {
  const blogUrl = `${SITE_URL}/resources/blog/${post.slug}`
  const hashtags = post.tags.slice(0, 3).map(t => `#${t.replace(/\s+/g, '')}`).join(' ')
  const urlLen = 23 // t.co shortened URL length
  const hashtagLen = hashtags ? hashtags.length + 1 : 0 // +1 for newline
  const maxExcerpt = 280 - urlLen - hashtagLen - 10 // 10 for spacing/newlines

  let excerpt = post.excerpt
  if (excerpt.length > maxExcerpt) {
    excerpt = excerpt.substring(0, maxExcerpt - 3) + '...'
  }

  let text = `${excerpt}\n\n${blogUrl}`
  if (hashtags) {
    text += `\n${hashtags}`
  }
  return text
}

// Build post text for Facebook (63,206 char limit — practically unlimited)
function buildFacebookText(post: BlogPostData): string {
  const blogUrl = `${SITE_URL}/resources/blog/${post.slug}`
  const hashtags = post.tags.slice(0, 5).map(t => `#${t.replace(/\s+/g, '')}`).join(' ')

  let text = `${post.title}\n\n${post.excerpt}\n\nRead more: ${blogUrl}`
  if (hashtags) {
    text += `\n\n${hashtags}`
  }
  return text
}

// Build caption for Instagram (2,200 char limit, no clickable links in caption)
function buildInstagramCaption(post: BlogPostData): string {
  const hashtags = post.tags.slice(0, 10).map(t => `#${t.replace(/\s+/g, '')}`).join(' ')

  let text = `${post.title}\n\n${post.excerpt}`
  // Instagram doesn't support clickable links in captions, so just mention the site
  text += `\n\nLink in bio | ${SITE_URL}`
  if (hashtags) {
    text += `\n\n${hashtags}`
  }

  // Instagram caption max is 2,200 chars
  if (text.length > 2200) {
    text = text.substring(0, 2197) + '...'
  }
  return text
}

// Build post text for LinkedIn (3000 char limit)
function buildLinkedInText(post: BlogPostData): string {
  const blogUrl = `${SITE_URL}/resources/blog/${post.slug}`
  const hashtags = post.tags.slice(0, 5).map(t => `#${t.replace(/\s+/g, '')}`).join(' ')

  let text = `${post.title}\n\n${post.excerpt}\n\nRead more: ${blogUrl}`
  if (hashtags) {
    text += `\n\n${hashtags}`
  }
  return text
}

// Resolve cover image to a local file path for upload
function resolveCoverImagePath(coverImage: string): string | null {
  if (!coverImage) return null

  // Handle /api/uploads/blog/filename pattern
  const match = coverImage.match(/\/api\/uploads\/blog\/(.+)$/)
  if (match) {
    const filename = match[1]
    const uploadsPath = process.env.UPLOADS_PATH
    if (uploadsPath) {
      return path.join(uploadsPath, 'blog', filename)
    }
    return path.join(process.cwd(), 'public', 'uploads', 'blog', filename)
  }

  return null
}

// Get MIME type from file extension
function getMimeType(filePath: string): string {
  const ext = path.extname(filePath).toLowerCase()
  const mimeTypes: Record<string, string> = {
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.png': 'image/png',
    '.gif': 'image/gif',
    '.webp': 'image/webp',
    '.svg': 'image/svg+xml',
  }
  return mimeTypes[ext] || 'image/jpeg'
}

// Post to X/Twitter
async function postToTwitter(post: BlogPostData): Promise<{ postId: string; postUrl: string }> {
  const settings = await getSocialMediaSettings()
  if (!settings?.twitter.enabled) {
    throw new Error('Twitter is not enabled')
  }

  const { apiKey, apiSecret, accessToken, accessSecret } = settings.twitter
  if (!apiKey || !apiSecret || !accessToken || !accessSecret) {
    throw new Error('Twitter credentials are incomplete')
  }

  const client = new TwitterApi({
    appKey: apiKey,
    appSecret: apiSecret,
    accessToken: accessToken,
    accessSecret: accessSecret,
  })

  const text = buildTwitterText(post)

  // Try uploading cover image
  let mediaId: string | undefined
  if (post.coverImage) {
    const imagePath = resolveCoverImagePath(post.coverImage)
    if (imagePath && fs.existsSync(imagePath)) {
      try {
        mediaId = await client.v1.uploadMedia(imagePath)
      } catch (err) {
        console.error('Failed to upload Twitter media:', err)
        // Continue without image
      }
    }
  }

  const tweetPayload: any = { text }
  if (mediaId) {
    tweetPayload.media = { media_ids: [mediaId] }
  }

  const result = await client.v2.tweet(tweetPayload)
  const tweetId = result.data.id
  // Construct tweet URL (need username — we'll use a generic format)
  const postUrl = `https://x.com/i/status/${tweetId}`

  return { postId: tweetId, postUrl }
}

// Upload an image to LinkedIn and return the asset URN
async function uploadImageToLinkedIn(
  imagePath: string,
  accessToken: string,
  personUrn: string
): Promise<string | null> {
  try {
    // Step 1: Register the upload
    const registerResponse = await fetch(
      'https://api.linkedin.com/v2/assets?action=registerUpload',
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          registerUploadRequest: {
            recipes: ['urn:li:digitalmediaRecipe:feedshare-image'],
            owner: personUrn,
            serviceRelationships: [
              {
                relationshipType: 'OWNER',
                identifier: 'urn:li:userGeneratedContent',
              },
            ],
          },
        }),
      }
    )

    if (!registerResponse.ok) {
      const errText = await registerResponse.text()
      console.error('LinkedIn register upload failed:', errText)
      return null
    }

    const registerData = await registerResponse.json()
    const uploadUrl =
      registerData.value?.uploadMechanism?.[
        'com.linkedin.digitalmedia.uploading.MediaUploadHttpRequest'
      ]?.uploadUrl
    const asset = registerData.value?.asset

    if (!uploadUrl || !asset) {
      console.error('LinkedIn register upload: missing uploadUrl or asset')
      return null
    }

    // Step 2: Upload the image binary
    const imageBuffer = fs.readFileSync(imagePath)
    const uploadResponse = await fetch(uploadUrl, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/octet-stream',
      },
      body: imageBuffer,
    })

    if (!uploadResponse.ok) {
      const errText = await uploadResponse.text()
      console.error('LinkedIn image upload failed:', errText)
      return null
    }

    return asset // e.g. "urn:li:digitalmediaAsset:XXXXX"
  } catch (err) {
    console.error('LinkedIn image upload error:', err)
    return null
  }
}

// Post to LinkedIn using Share API v2
async function postToLinkedIn(post: BlogPostData): Promise<{ postId: string; postUrl: string }> {
  const settings = await getSocialMediaSettings()
  if (!settings?.linkedin.enabled) {
    throw new Error('LinkedIn is not enabled')
  }

  const { accessToken, personUrn } = settings.linkedin
  if (!accessToken || !personUrn) {
    throw new Error('LinkedIn credentials are incomplete')
  }

  const text = buildLinkedInText(post)
  const blogUrl = `${SITE_URL}/resources/blog/${post.slug}`

  // Try uploading cover image to LinkedIn
  let imageAsset: string | null = null
  if (post.coverImage) {
    const imagePath = resolveCoverImagePath(post.coverImage)
    if (imagePath && fs.existsSync(imagePath)) {
      imageAsset = await uploadImageToLinkedIn(imagePath, accessToken, personUrn)
    }
  }

  // Build the share payload
  let sharePayload: any

  if (imageAsset) {
    // Post with uploaded image — shows the cover image prominently
    sharePayload = {
      author: personUrn,
      lifecycleState: 'PUBLISHED',
      specificContent: {
        'com.linkedin.ugc.ShareContent': {
          shareCommentary: { text },
          shareMediaCategory: 'IMAGE',
          media: [
            {
              status: 'READY',
              media: imageAsset,
              title: { text: post.title },
            },
          ],
        },
      },
      visibility: {
        'com.linkedin.ugc.MemberNetworkVisibility': 'PUBLIC',
      },
    }
  } else {
    // Fallback: post as article link preview (no uploaded image)
    sharePayload = {
      author: personUrn,
      lifecycleState: 'PUBLISHED',
      specificContent: {
        'com.linkedin.ugc.ShareContent': {
          shareCommentary: { text },
          shareMediaCategory: 'ARTICLE',
          media: [
            {
              status: 'READY',
              originalUrl: blogUrl,
              title: { text: post.title },
              description: { text: post.excerpt.substring(0, 200) },
            },
          ],
        },
      },
      visibility: {
        'com.linkedin.ugc.MemberNetworkVisibility': 'PUBLIC',
      },
    }
  }

  const response = await fetch('https://api.linkedin.com/v2/ugcPosts', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
      'X-Restli-Protocol-Version': '2.0.0',
    },
    body: JSON.stringify(sharePayload),
  })

  if (!response.ok) {
    const errorText = await response.text()
    throw new Error(`LinkedIn API error (${response.status}): ${errorText}`)
  }

  const data = await response.json()
  const shareId = data.id // urn:li:share:XXXXX or urn:li:ugcPost:XXXXX

  const postUrl = `https://www.linkedin.com/feed/update/${shareId}`

  return { postId: shareId, postUrl }
}

// Post to Facebook Page using Graph API
async function postToFacebook(post: BlogPostData): Promise<{ postId: string; postUrl: string }> {
  const settings = await getSocialMediaSettings()
  if (!settings?.facebook.enabled) {
    throw new Error('Facebook is not enabled')
  }

  const { pageAccessToken, pageId } = settings.facebook
  if (!pageAccessToken || !pageId) {
    throw new Error('Facebook credentials are incomplete')
  }

  const text = buildFacebookText(post)
  const blogUrl = `${SITE_URL}/resources/blog/${post.slug}`

  // Try posting with cover image, otherwise post as link share
  let response: Response

  if (post.coverImage) {
    const imagePath = resolveCoverImagePath(post.coverImage)
    if (imagePath && fs.existsSync(imagePath)) {
      // Post as photo with message
      const formData = new FormData()
      const imageBuffer = fs.readFileSync(imagePath)
      const mimeType = getMimeType(imagePath)
      const blob = new Blob([imageBuffer], { type: mimeType })
      formData.append('source', blob, path.basename(imagePath))
      formData.append('message', text)
      formData.append('access_token', pageAccessToken)

      response = await fetch(`https://graph.facebook.com/v19.0/${pageId}/photos`, {
        method: 'POST',
        body: formData,
      })
    } else {
      // Fall back to link share
      response = await fetch(`https://graph.facebook.com/v19.0/${pageId}/feed`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text,
          link: blogUrl,
          access_token: pageAccessToken,
        }),
      })
    }
  } else {
    // Post as link share (Facebook auto-generates link preview)
    response = await fetch(`https://graph.facebook.com/v19.0/${pageId}/feed`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message: text,
        link: blogUrl,
        access_token: pageAccessToken,
      }),
    })
  }

  if (!response.ok) {
    const errorData = await response.json()
    throw new Error(`Facebook API error (${response.status}): ${errorData.error?.message || JSON.stringify(errorData)}`)
  }

  const data = await response.json()
  const fbPostId = data.id || data.post_id
  const postUrl = `https://www.facebook.com/${fbPostId}`

  return { postId: fbPostId, postUrl }
}

// Post to Instagram using Instagram Graph API (Content Publishing API)
// Requires: Instagram Business/Creator Account with valid access token
async function postToInstagram(post: BlogPostData): Promise<{ postId: string; postUrl: string }> {
  const settings = await getSocialMediaSettings()
  if (!settings?.instagram.enabled) {
    throw new Error('Instagram is not enabled')
  }

  const { pageAccessToken, instagramAccountId } = settings.instagram
  if (!pageAccessToken || !instagramAccountId) {
    throw new Error('Instagram credentials are incomplete')
  }

  const caption = buildInstagramCaption(post)

  // Instagram requires a public image URL — can't upload local files directly
  // Use nginx-served /uploads/ path (not /api/uploads/) so Instagram can fetch it
  let imageUrl = ''
  if (post.coverImage) {
    if (post.coverImage.startsWith('http')) {
      imageUrl = post.coverImage
    } else {
      // Convert /api/uploads/blog/file.png → /uploads/blog/file.png for direct nginx serving
      const directPath = post.coverImage.replace(/^\/api\/uploads\//, '/uploads/')
      imageUrl = `${SITE_URL}${directPath}`
    }
  }

  if (!imageUrl) {
    throw new Error('Instagram requires an image. Please add a cover image to the blog post.')
  }

  // Step 1: Create a media container
  const containerResponse = await fetch(
    `https://graph.instagram.com/v22.0/${instagramAccountId}/media`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        media_type: 'IMAGE',
        image_url: imageUrl,
        caption: caption,
        access_token: pageAccessToken,
      }),
    }
  )

  if (!containerResponse.ok) {
    const errorData = await containerResponse.json()
    throw new Error(`Instagram container error (${containerResponse.status}): ${errorData.error?.message || JSON.stringify(errorData)}`)
  }

  const containerData = await containerResponse.json()
  const containerId = containerData.id

  // Step 2: Wait briefly for the container to be ready, then publish
  // Instagram needs a moment to process the image
  await new Promise(resolve => setTimeout(resolve, 5000))

  const publishResponse = await fetch(
    `https://graph.instagram.com/v22.0/${instagramAccountId}/media_publish`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        creation_id: containerId,
        access_token: pageAccessToken,
      }),
    }
  )

  if (!publishResponse.ok) {
    const errorData = await publishResponse.json()
    throw new Error(`Instagram publish error (${publishResponse.status}): ${errorData.error?.message || JSON.stringify(errorData)}`)
  }

  const publishData = await publishResponse.json()
  const igPostId = publishData.id

  // Get the permalink for the published post
  let postUrl = `https://www.instagram.com`
  try {
    const permalinkResponse = await fetch(
      `https://graph.instagram.com/v22.0/${igPostId}?fields=permalink&access_token=${pageAccessToken}`
    )
    if (permalinkResponse.ok) {
      const permalinkData = await permalinkResponse.json()
      if (permalinkData.permalink) {
        postUrl = permalinkData.permalink
      }
    }
  } catch {
    // Use default Instagram URL if permalink fetch fails
  }

  return { postId: igPostId, postUrl }
}

// Main auto-post function — called when a blog is published
export async function autoPostBlog(post: BlogPostData): Promise<void> {
  const settings = await getSocialMediaSettings()
  if (!settings) {
    console.log('No social media settings configured, skipping auto-post')
    return
  }

  // Check if already posted (prevent double-posting)
  const existingPosts = await prisma.socialPostLog.findMany({
    where: { blogPostId: post.id },
  })

  const platforms: Array<{
    name: 'TWITTER' | 'LINKEDIN' | 'FACEBOOK' | 'INSTAGRAM'
    enabled: boolean
    postFn: (post: BlogPostData) => Promise<{ postId: string; postUrl: string }>
  }> = [
    { name: 'TWITTER', enabled: settings.twitter.enabled, postFn: postToTwitter },
    { name: 'LINKEDIN', enabled: settings.linkedin.enabled, postFn: postToLinkedIn },
    { name: 'FACEBOOK', enabled: settings.facebook.enabled, postFn: postToFacebook },
    { name: 'INSTAGRAM', enabled: settings.instagram.enabled, postFn: postToInstagram },
  ]

  for (const platform of platforms) {
    // Skip if not enabled
    if (!platform.enabled) continue

    // Skip if already successfully posted to this platform
    const alreadyPosted = existingPosts.find(
      p => p.platform === platform.name && p.status === 'POSTED'
    )
    if (alreadyPosted) {
      console.log(`Already posted to ${platform.name}, skipping`)
      continue
    }

    // Create PENDING log entry
    const log = await prisma.socialPostLog.create({
      data: {
        blogPostId: post.id,
        platform: platform.name,
        status: 'PENDING',
      },
    })

    try {
      const result = await platform.postFn(post)

      // Update to POSTED
      await prisma.socialPostLog.update({
        where: { id: log.id },
        data: {
          status: 'POSTED',
          postId: result.postId,
          postUrl: result.postUrl,
        },
      })

      console.log(`Successfully posted to ${platform.name}:`, result.postUrl)
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'Unknown error'
      console.error(`Failed to post to ${platform.name}:`, errorMsg)

      // Update to FAILED
      await prisma.socialPostLog.update({
        where: { id: log.id },
        data: {
          status: 'FAILED',
          error: errorMsg.substring(0, 500),
        },
      })
    }
  }
}

// Retry a failed social post
export async function retryPostToSocial(logId: string): Promise<{ success: boolean; error?: string }> {
  const log = await prisma.socialPostLog.findUnique({
    where: { id: logId },
    include: { blogPost: true },
  })

  if (!log) {
    return { success: false, error: 'Log entry not found' }
  }

  if (log.status === 'POSTED') {
    return { success: false, error: 'Already posted successfully' }
  }
  if (!log.blogPost) {
    return { success: false, error: 'Blog post not found' }
  }


  const post: BlogPostData = {
    id: log.blogPost.id,
    title: log.blogPost.title,
    slug: log.blogPost.slug,
    excerpt: log.blogPost.excerpt,
    coverImage: log.blogPost.coverImage,
    tags: log.blogPost.tags,
  }

  const platformFns: Record<string, (post: BlogPostData) => Promise<{ postId: string; postUrl: string }>> = {
    TWITTER: postToTwitter,
    LINKEDIN: postToLinkedIn,
    FACEBOOK: postToFacebook,
    INSTAGRAM: postToInstagram,
  }

  const postFn = platformFns[log.platform]
  if (!postFn) {
    return { success: false, error: `Unknown platform: ${log.platform}` }
  }

  try {
    const result = await postFn(post)

    await prisma.socialPostLog.update({
      where: { id: logId },
      data: {
        status: 'POSTED',
        postId: result.postId,
        postUrl: result.postUrl,
        error: null,
      },
    })

    return { success: true }
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : 'Unknown error'

    await prisma.socialPostLog.update({
      where: { id: logId },
      data: {
        status: 'FAILED',
        error: errorMsg.substring(0, 500),
      },
    })

    return { success: false, error: errorMsg }
  }
}

// Manually trigger posting for a specific blog + platform
export async function manualPostToSocial(
  blogPostId: string,
  platform: 'TWITTER' | 'LINKEDIN' | 'FACEBOOK' | 'INSTAGRAM'
): Promise<{ success: boolean; error?: string }> {
  const blogPost = await prisma.blogPost.findUnique({
    where: { id: blogPostId },
  })

  if (!blogPost || !blogPost.isPublished) {
    return { success: false, error: 'Blog post not found or not published' }
  }

  const post: BlogPostData = {
    id: blogPost.id,
    title: blogPost.title,
    slug: blogPost.slug,
    excerpt: blogPost.excerpt,
    coverImage: blogPost.coverImage,
    tags: blogPost.tags,
  }

  const platformFns: Record<string, (post: BlogPostData) => Promise<{ postId: string; postUrl: string }>> = {
    TWITTER: postToTwitter,
    LINKEDIN: postToLinkedIn,
    FACEBOOK: postToFacebook,
    INSTAGRAM: postToInstagram,
  }

  const postFn = platformFns[platform]
  if (!postFn) {
    return { success: false, error: `Unknown platform: ${platform}` }
  }

  // Create log entry
  const log = await prisma.socialPostLog.create({
    data: {
      blogPostId: blogPost.id,
      platform,
      status: 'PENDING',
    },
  })

  try {
    const result = await postFn(post)

    await prisma.socialPostLog.update({
      where: { id: log.id },
      data: {
        status: 'POSTED',
        postId: result.postId,
        postUrl: result.postUrl,
      },
    })

    return { success: true }
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : 'Unknown error'

    await prisma.socialPostLog.update({
      where: { id: log.id },
      data: {
        status: 'FAILED',
        error: errorMsg.substring(0, 500),
      },
    })

    return { success: false, error: errorMsg }
  }
}

// ============================================================
// TOOL SOCIAL POSTING
// ============================================================

interface ToolPostData {
  id: string
  name: string
  slug: string
  shortDescription: string
  features: string[]
  category: string
  iconImage: string | null
}

function resolveToolImagePath(iconImage: string): string | null {
  if (!iconImage) return null
  const match = iconImage.match(/\/api\/uploads\/tools\/(.+)$/)
  if (match) {
    const filename = match[1]
    const uploadsPath = process.env.UPLOADS_PATH
    if (uploadsPath) {
      return path.join(uploadsPath, 'tools', filename)
    }
    return path.join(process.cwd(), 'public', 'uploads', 'tools', filename)
  }
  return null
}

function formatCategory(category: string): string {
  return category.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase())
}

function buildToolTwitterText(tool: ToolPostData): string {
  const toolUrl = `${SITE_URL}/tools/${tool.slug}`
  const category = formatCategory(tool.category)
  const urlLen = 23
  const hashtags = `#${category.replace(/\s+/g, '')} #tools`
  const hashtagLen = hashtags.length + 1
  const maxDesc = 280 - urlLen - hashtagLen - 10

  let text = `${tool.name} — ${tool.shortDescription}`
  if (text.length > maxDesc) {
    text = text.substring(0, maxDesc - 3) + '...'
  }
  return `${text}\n\n${toolUrl}\n${hashtags}`
}

function buildToolFacebookText(tool: ToolPostData): string {
  const toolUrl = `${SITE_URL}/tools/${tool.slug}`
  const category = formatCategory(tool.category)

  let text = `${tool.name}\n\n${tool.shortDescription}`
  if (tool.features.length > 0) {
    const featureList = tool.features.slice(0, 5).map(f => `• ${f}`).join('\n')
    text += `\n\nKey Features:\n${featureList}`
  }
  text += `\n\nCheck it out: ${toolUrl}`
  text += `\n\n#${category.replace(/\s+/g, '')} #tools #automation`
  return text
}

function buildToolInstagramCaption(tool: ToolPostData): string {
  const category = formatCategory(tool.category)

  let text = `${tool.name}\n\n${tool.shortDescription}`
  if (tool.features.length > 0) {
    const featureList = tool.features.slice(0, 5).map(f => `• ${f}`).join('\n')
    text += `\n\nKey Features:\n${featureList}`
  }
  text += `\n\nLink in bio | ${SITE_URL}`
  text += `\n\n#${category.replace(/\s+/g, '')} #tools #automation #accounting`

  if (text.length > 2200) {
    text = text.substring(0, 2197) + '...'
  }
  return text
}

function buildToolLinkedInText(tool: ToolPostData): string {
  const toolUrl = `${SITE_URL}/tools/${tool.slug}`
  const category = formatCategory(tool.category)

  let text = `${tool.name}\n\n${tool.shortDescription}`
  if (tool.features.length > 0) {
    const featureList = tool.features.slice(0, 5).map(f => `• ${f}`).join('\n')
    text += `\n\nKey Features:\n${featureList}`
  }
  text += `\n\nCheck it out: ${toolUrl}`
  text += `\n\n#${category.replace(/\s+/g, '')} #tools #automation`
  return text
}

async function postToolToTwitter(tool: ToolPostData): Promise<{ postId: string; postUrl: string }> {
  const settings = await getSocialMediaSettings()
  if (!settings?.twitter.enabled) throw new Error('Twitter is not enabled')

  const { apiKey, apiSecret, accessToken, accessSecret } = settings.twitter
  if (!apiKey || !apiSecret || !accessToken || !accessSecret) throw new Error('Twitter credentials are incomplete')

  const client = new TwitterApi({ appKey: apiKey, appSecret: apiSecret, accessToken, accessSecret })
  const text = buildToolTwitterText(tool)

  let mediaIds: string[] = []
  if (tool.iconImage) {
    const imagePath = resolveToolImagePath(tool.iconImage)
    if (imagePath && fs.existsSync(imagePath)) {
      const mediaId = await client.v1.uploadMedia(imagePath)
      mediaIds = [mediaId]
    }
  }

  const tweet = await client.v2.tweet({
    text,
    ...(mediaIds.length > 0 && { media: { media_ids: mediaIds as any } }),
  })

  return { postId: tweet.data.id, postUrl: `https://x.com/i/status/${tweet.data.id}` }
}

async function postToolToFacebook(tool: ToolPostData): Promise<{ postId: string; postUrl: string }> {
  const settings = await getSocialMediaSettings()
  if (!settings?.facebook.enabled) throw new Error('Facebook is not enabled')

  const { pageAccessToken, pageId } = settings.facebook
  if (!pageAccessToken || !pageId) throw new Error('Facebook credentials are incomplete')

  const text = buildToolFacebookText(tool)
  let response: Response

  if (tool.iconImage) {
    const imagePath = resolveToolImagePath(tool.iconImage)
    if (imagePath && fs.existsSync(imagePath)) {
      const formData = new FormData()
      const imageBuffer = fs.readFileSync(imagePath)
      const blob = new Blob([imageBuffer], { type: getMimeType(imagePath) })
      formData.append('source', blob, path.basename(imagePath))
      formData.append('message', text)
      formData.append('access_token', pageAccessToken)
      response = await fetch(`https://graph.facebook.com/v19.0/${pageId}/photos`, { method: 'POST', body: formData })
    } else {
      response = await fetch(`https://graph.facebook.com/v19.0/${pageId}/feed`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text, link: `${SITE_URL}/tools/${tool.slug}`, access_token: pageAccessToken }),
      })
    }
  } else {
    response = await fetch(`https://graph.facebook.com/v19.0/${pageId}/feed`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: text, link: `${SITE_URL}/tools/${tool.slug}`, access_token: pageAccessToken }),
    })
  }

  if (!response.ok) {
    const errorData = await response.json()
    throw new Error(`Facebook API error (${response.status}): ${errorData.error?.message || JSON.stringify(errorData)}`)
  }

  const data = await response.json()
  const fbPostId = data.id || data.post_id
  return { postId: fbPostId, postUrl: `https://www.facebook.com/${fbPostId}` }
}

async function postToolToLinkedIn(tool: ToolPostData): Promise<{ postId: string; postUrl: string }> {
  const settings = await getSocialMediaSettings()
  if (!settings?.linkedin.enabled) throw new Error('LinkedIn is not enabled')

  const { accessToken, personUrn } = settings.linkedin
  if (!accessToken || !personUrn) throw new Error('LinkedIn credentials are incomplete')

  const text = buildToolLinkedInText(tool)
  const toolUrl = `${SITE_URL}/tools/${tool.slug}`
  let sharePayload: any

  if (tool.iconImage) {
    const imagePath = resolveToolImagePath(tool.iconImage)
    if (imagePath && fs.existsSync(imagePath)) {
      const registerResponse = await fetch('https://api.linkedin.com/v2/assets?action=registerUpload', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${accessToken}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          registerUploadRequest: {
            recipes: ['urn:li:digitalmediaRecipe:feedshare-image'],
            owner: personUrn,
            serviceRelationships: [{ relationshipType: 'OWNER', identifier: 'urn:li:userGeneratedContent' }],
          },
        }),
      })
      if (!registerResponse.ok) throw new Error(`LinkedIn register upload failed: ${await registerResponse.text()}`)

      const registerData = await registerResponse.json()
      const uploadUrl = registerData.value.uploadMechanism['com.linkedin.digitalmedia.uploading.MediaUploadHttpRequest'].uploadUrl
      const imageAsset = registerData.value.asset

      const uploadResponse = await fetch(uploadUrl, {
        method: 'PUT',
        headers: { 'Authorization': `Bearer ${accessToken}`, 'Content-Type': getMimeType(imagePath) },
        body: fs.readFileSync(imagePath),
      })
      if (!uploadResponse.ok) throw new Error(`LinkedIn image upload failed: ${uploadResponse.status}`)

      sharePayload = {
        author: personUrn, lifecycleState: 'PUBLISHED',
        specificContent: { 'com.linkedin.ugc.ShareContent': { shareCommentary: { text }, shareMediaCategory: 'IMAGE', media: [{ status: 'READY', media: imageAsset, title: { text: tool.name } }] } },
        visibility: { 'com.linkedin.ugc.MemberNetworkVisibility': 'PUBLIC' },
      }
    } else {
      sharePayload = {
        author: personUrn, lifecycleState: 'PUBLISHED',
        specificContent: { 'com.linkedin.ugc.ShareContent': { shareCommentary: { text }, shareMediaCategory: 'ARTICLE', media: [{ status: 'READY', originalUrl: toolUrl, title: { text: tool.name }, description: { text: tool.shortDescription.substring(0, 200) } }] } },
        visibility: { 'com.linkedin.ugc.MemberNetworkVisibility': 'PUBLIC' },
      }
    }
  } else {
    sharePayload = {
      author: personUrn, lifecycleState: 'PUBLISHED',
      specificContent: { 'com.linkedin.ugc.ShareContent': { shareCommentary: { text }, shareMediaCategory: 'ARTICLE', media: [{ status: 'READY', originalUrl: toolUrl, title: { text: tool.name }, description: { text: tool.shortDescription.substring(0, 200) } }] } },
      visibility: { 'com.linkedin.ugc.MemberNetworkVisibility': 'PUBLIC' },
    }
  }

  const response = await fetch('https://api.linkedin.com/v2/ugcPosts', {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${accessToken}`, 'Content-Type': 'application/json', 'X-Restli-Protocol-Version': '2.0.0' },
    body: JSON.stringify(sharePayload),
  })

  if (!response.ok) throw new Error(`LinkedIn API error (${response.status}): ${await response.text()}`)

  const data = await response.json()
  return { postId: data.id, postUrl: `https://www.linkedin.com/feed/update/${data.id}` }
}

async function postToolToInstagram(tool: ToolPostData): Promise<{ postId: string; postUrl: string }> {
  const settings = await getSocialMediaSettings()
  if (!settings?.instagram.enabled) throw new Error('Instagram is not enabled')

  const { pageAccessToken, instagramAccountId } = settings.instagram
  if (!pageAccessToken || !instagramAccountId) throw new Error('Instagram credentials are incomplete')

  const caption = buildToolInstagramCaption(tool)

  let imageUrl = ''
  if (tool.iconImage) {
    if (tool.iconImage.startsWith('http')) {
      imageUrl = tool.iconImage
    } else {
      const directPath = tool.iconImage.replace(/^\/api\/uploads\//, '/uploads/')
      imageUrl = `${SITE_URL}${directPath}`
    }
  }

  if (!imageUrl) throw new Error('Instagram requires an image. Please add an icon image to the tool.')

  const containerResponse = await fetch(`https://graph.instagram.com/v19.0/${instagramAccountId}/media`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ media_type: 'IMAGE', image_url: imageUrl, caption, access_token: pageAccessToken }),
  })

  if (!containerResponse.ok) {
    const errorData = await containerResponse.json()
    throw new Error(`Instagram container error (${containerResponse.status}): ${errorData.error?.message || JSON.stringify(errorData)}`)
  }

  const containerId = (await containerResponse.json()).id
  await new Promise(resolve => setTimeout(resolve, 5000))

  const publishResponse = await fetch(`https://graph.instagram.com/v19.0/${instagramAccountId}/media_publish`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ creation_id: containerId, access_token: pageAccessToken }),
  })

  if (!publishResponse.ok) {
    const errorData = await publishResponse.json()
    throw new Error(`Instagram publish error (${publishResponse.status}): ${errorData.error?.message || JSON.stringify(errorData)}`)
  }

  const igPostId = (await publishResponse.json()).id

  let postUrl = `https://www.instagram.com`
  try {
    const permalinkResponse = await fetch(`https://graph.instagram.com/v19.0/${igPostId}?fields=permalink&access_token=${pageAccessToken}`)
    if (permalinkResponse.ok) {
      const permalinkData = await permalinkResponse.json()
      if (permalinkData.permalink) postUrl = permalinkData.permalink
    }
  } catch { /* Use default */ }

  return { postId: igPostId, postUrl }
}

export async function autoPostTool(tool: ToolPostData): Promise<void> {
  const settings = await getSocialMediaSettings()
  if (!settings) {
    console.log('No social media settings configured, skipping tool auto-post')
    return
  }

  const existingPosts = await prisma.socialPostLog.findMany({ where: { toolId: tool.id } })

  const platforms: Array<{
    name: 'TWITTER' | 'LINKEDIN' | 'FACEBOOK' | 'INSTAGRAM'
    enabled: boolean
    postFn: (tool: ToolPostData) => Promise<{ postId: string; postUrl: string }>
  }> = [
    { name: 'TWITTER', enabled: settings.twitter.enabled, postFn: postToolToTwitter },
    { name: 'LINKEDIN', enabled: settings.linkedin.enabled, postFn: postToolToLinkedIn },
    { name: 'FACEBOOK', enabled: settings.facebook.enabled, postFn: postToolToFacebook },
    { name: 'INSTAGRAM', enabled: settings.instagram.enabled, postFn: postToolToInstagram },
  ]

  for (const platform of platforms) {
    if (!platform.enabled) continue

    const alreadyPosted = existingPosts.find(p => p.platform === platform.name && p.status === 'POSTED')
    if (alreadyPosted) {
      console.log(`Tool already posted to ${platform.name}, skipping`)
      continue
    }

    const log = await prisma.socialPostLog.create({
      data: { toolId: tool.id, platform: platform.name, status: 'PENDING' },
    })

    try {
      const result = await platform.postFn(tool)
      await prisma.socialPostLog.update({
        where: { id: log.id },
        data: { status: 'POSTED', postId: result.postId, postUrl: result.postUrl },
      })
      console.log(`Successfully posted tool to ${platform.name}:`, result.postUrl)
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'Unknown error'
      console.error(`Failed to post tool to ${platform.name}:`, errorMsg)
      await prisma.socialPostLog.update({
        where: { id: log.id },
        data: { status: 'FAILED', error: errorMsg.substring(0, 500) },
      })
    }
  }
}

export async function manualPostToTool(
  toolId: string,
  platform: 'TWITTER' | 'LINKEDIN' | 'FACEBOOK' | 'INSTAGRAM'
): Promise<{ success: boolean; error?: string }> {
  const dbTool = await prisma.tool.findUnique({ where: { id: toolId } })

  if (!dbTool || !dbTool.isActive) {
    return { success: false, error: 'Tool not found or not active' }
  }

  const tool: ToolPostData = {
    id: dbTool.id, name: dbTool.name, slug: dbTool.slug,
    shortDescription: dbTool.shortDescription, features: dbTool.features,
    category: dbTool.category, iconImage: dbTool.iconImage,
  }

  const platformFns: Record<string, (t: ToolPostData) => Promise<{ postId: string; postUrl: string }>> = {
    TWITTER: postToolToTwitter, LINKEDIN: postToolToLinkedIn,
    FACEBOOK: postToolToFacebook, INSTAGRAM: postToolToInstagram,
  }

  const postFn = platformFns[platform]
  if (!postFn) return { success: false, error: `Unknown platform: ${platform}` }

  const log = await prisma.socialPostLog.create({
    data: { toolId: dbTool.id, platform, status: 'PENDING' },
  })

  try {
    const result = await postFn(tool)
    await prisma.socialPostLog.update({
      where: { id: log.id },
      data: { status: 'POSTED', postId: result.postId, postUrl: result.postUrl },
    })
    return { success: true }
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : 'Unknown error'
    await prisma.socialPostLog.update({
      where: { id: log.id },
      data: { status: 'FAILED', error: errorMsg.substring(0, 500) },
    })
    return { success: false, error: errorMsg }
  }
}
