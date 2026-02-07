import { NextRequest, NextResponse } from 'next/server'
import { readFile, stat } from 'fs/promises'
import path from 'path'

export const dynamic = 'force-dynamic'

// Check if a file exists
async function fileExists(filePath: string): Promise<boolean> {
  try {
    await stat(filePath)
    return true
  } catch {
    return false
  }
}

// Get the file path - check persistent storage first, then fallback to public directory
async function getFilePath(filePath: string): Promise<string | null> {
  const persistentPath = process.env.UPLOADS_PATH
  const publicPath = path.join(process.cwd(), 'public', 'uploads', filePath)

  if (persistentPath) {
    const persistentFilePath = path.join(persistentPath, filePath)
    // Check persistent storage first
    if (await fileExists(persistentFilePath)) {
      return persistentFilePath
    }
    // Fallback to public directory (for pre-migration files)
    if (await fileExists(publicPath)) {
      return publicPath
    }
    return persistentFilePath // Return persistent path for error reporting
  }

  return publicPath
}

// Get content type based on file extension
function getContentType(fileName: string): string {
  const ext = path.extname(fileName).toLowerCase()
  const mimeTypes: Record<string, string> = {
    // Images
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.png': 'image/png',
    '.gif': 'image/gif',
    '.webp': 'image/webp',
    '.svg': 'image/svg+xml',
    '.ico': 'image/x-icon',
    // Documents
    '.pdf': 'application/pdf',
    '.doc': 'application/msword',
    '.docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    '.xlsx': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    '.xls': 'application/vnd.ms-excel',
    // Archives
    '.zip': 'application/zip',
    '.rar': 'application/x-rar-compressed',
    '.7z': 'application/x-7z-compressed',
  }
  return mimeTypes[ext] || 'application/octet-stream'
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  try {
    const { path: pathSegments } = await params
    const fileName = pathSegments.join('/')
    const filePath = await getFilePath(fileName)

    if (!filePath) {
      return NextResponse.json({ error: 'File not found' }, { status: 404 })
    }

    // Security: Prevent directory traversal attacks
    const normalizedPath = path.normalize(filePath)
    const uploadsBase = process.env.UPLOADS_PATH || path.join(process.cwd(), 'public', 'uploads')
    if (!normalizedPath.startsWith(path.normalize(uploadsBase)) &&
        !normalizedPath.startsWith(path.normalize(path.join(process.cwd(), 'public', 'uploads')))) {
      return NextResponse.json({ error: 'Invalid path' }, { status: 403 })
    }

    // Check if file exists
    if (!(await fileExists(filePath))) {
      return NextResponse.json({ error: 'File not found' }, { status: 404 })
    }

    // Read file
    const fileBuffer = await readFile(filePath)
    const contentType = getContentType(fileName)

    // Determine if this is an image (should be displayed) or a file (should be downloaded)
    const isImage = contentType.startsWith('image/')

    const headers: Record<string, string> = {
      'Content-Type': contentType,
      'Content-Length': fileBuffer.length.toString(),
    }

    if (isImage) {
      // Images - allow browser caching
      headers['Cache-Control'] = 'public, max-age=31536000, immutable'
    } else {
      // Downloads - no cache, force download
      headers['Content-Disposition'] = `attachment; filename="${path.basename(fileName)}"`
      headers['Cache-Control'] = 'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0'
      headers['Pragma'] = 'no-cache'
      headers['Expires'] = '0'
    }

    return new NextResponse(fileBuffer, { headers })
  } catch (error) {
    console.error('File serve error:', error)
    return NextResponse.json({ error: 'Failed to serve file' }, { status: 500 })
  }
}
