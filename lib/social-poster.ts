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

  // Build the share payload
  const sharePayload: any = {
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

  // Extract numeric ID for URL
  const numericId = shareId?.split(':').pop() || ''
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
      const blob = new Blob([imageBuffer])
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

// Post to Instagram using Facebook Graph API (Content Publishing API)
// Requires: Facebook Page linked to Instagram Business Account
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
  // Use the cover image URL or the blog URL for link preview
  let imageUrl = ''
  if (post.coverImage) {
    // If it's already a full URL, use it directly
    if (post.coverImage.startsWith('http')) {
      imageUrl = post.coverImage
    } else {
      // Convert local path to public URL
      imageUrl = `${SITE_URL}${post.coverImage}`
    }
  }

  if (!imageUrl) {
    throw new Error('Instagram requires an image. Please add a cover image to the blog post.')
  }

  // Step 1: Create a media container
  const containerResponse = await fetch(
    `https://graph.facebook.com/v19.0/${instagramAccountId}/media`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
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
    `https://graph.facebook.com/v19.0/${instagramAccountId}/media_publish`,
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
      `https://graph.facebook.com/v19.0/${igPostId}?fields=permalink&access_token=${pageAccessToken}`
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
