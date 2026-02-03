import { NextResponse } from 'next/server'
import { auth } from '@/auth'
import { writeFile, mkdir, unlink } from 'fs/promises'
import path from 'path'

export const dynamic = 'force-dynamic'

// Increase body size limit for this route (100MB)
export const maxDuration = 60 // seconds
export const fetchCache = 'force-no-store'

// Get uploads directory - use UPLOADS_PATH env var for persistent storage
// If not set, defaults to public directory (will be lost on rebuild)
function getUploadDir(type: string): string {
  const persistentPath = process.env.UPLOADS_PATH
  if (persistentPath) {
    // Use persistent path (e.g., /var/www/uploads)
    return type === 'images'
      ? path.join(persistentPath, 'images')
      : path.join(persistentPath, 'downloads')
  }
  // Default to app directory (not persistent across rebuilds)
  return type === 'images'
    ? path.join(process.cwd(), 'public', 'uploads', 'images')
    : path.join(process.cwd(), 'public', 'downloads')
}

// Helper to check admin status
async function checkAdmin() {
  const session = await auth()
  if (!session?.user?.email) {
    return { error: 'Unauthorized', status: 401 }
  }

  const isAdmin = session.user.role === 'ADMIN'

  if (!isAdmin) {
    return { error: 'Forbidden', status: 403 }
  }

  return { session }
}

export async function POST(request: Request) {
  try {
    const adminCheck = await checkAdmin()
    if ('error' in adminCheck) {
      return NextResponse.json({ error: adminCheck.error }, { status: adminCheck.status })
    }

    const formData = await request.formData()
    const file = formData.get('file') as File
    const type = formData.get('type') as string || 'tools' // 'tools' or 'images'
    const oldFilePath = formData.get('oldFilePath') as string | null // Path to delete after upload

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 })
    }

    // Validate file size (max 100MB)
    const maxSize = 100 * 1024 * 1024 // 100MB
    if (file.size > maxSize) {
      return NextResponse.json({ error: 'File size exceeds 100MB limit' }, { status: 400 })
    }

    // Determine upload directory (supports persistent storage via UPLOADS_PATH)
    const uploadDir = getUploadDir(type)

    // Ensure directory exists
    await mkdir(uploadDir, { recursive: true })

    // Generate unique filename
    const timestamp = Date.now()
    const originalName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_')
    const fileName = `${timestamp}-${originalName}`
    const filePath = path.join(uploadDir, fileName)

    // Convert file to buffer and save
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    await writeFile(filePath, buffer)

    // Delete old file if provided (after successful upload)
    if (oldFilePath) {
      try {
        // Extract filename from the URL path (e.g., /downloads/123-file.zip -> 123-file.zip)
        const oldFileName = oldFilePath.split('/').pop()
        if (oldFileName) {
          const oldFileFullPath = path.join(uploadDir, oldFileName)
          await unlink(oldFileFullPath)
          console.log(`Deleted old file: ${oldFileFullPath}`)
        }
      } catch (deleteError) {
        // Log but don't fail if old file deletion fails (file might not exist)
        console.warn('Could not delete old file:', deleteError)
      }
    }

    // Return the public URL path (nginx should serve from persistent storage)
    const publicPath = type === 'images'
      ? `/uploads/images/${fileName}`
      : `/downloads/${fileName}`

    return NextResponse.json({
      success: true,
      fileName,
      filePath: publicPath,
      fileSize: file.size,
      fileType: file.type,
    })
  } catch (error) {
    console.error('Upload error:', error)
    return NextResponse.json({ error: 'Failed to upload file' }, { status: 500 })
  }
}
