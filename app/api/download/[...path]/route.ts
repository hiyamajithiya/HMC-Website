import { NextRequest, NextResponse } from 'next/server'
import { readFile, stat } from 'fs/promises'
import path from 'path'

export const dynamic = 'force-dynamic'

// Get the file path from persistent storage or public directory
function getFilePath(filePath: string): string {
  const persistentPath = process.env.UPLOADS_PATH
  if (persistentPath) {
    return path.join(persistentPath, 'downloads', filePath)
  }
  return path.join(process.cwd(), 'public', 'downloads', filePath)
}

// Get content type based on file extension
function getContentType(fileName: string): string {
  const ext = path.extname(fileName).toLowerCase()
  const mimeTypes: Record<string, string> = {
    '.zip': 'application/zip',
    '.rar': 'application/x-rar-compressed',
    '.7z': 'application/x-7z-compressed',
    '.py': 'text/x-python',
    '.xlsx': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    '.xls': 'application/vnd.ms-excel',
    '.exe': 'application/x-msdownload',
    '.msi': 'application/x-msi',
    '.pdf': 'application/pdf',
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
    const filePath = getFilePath(fileName)

    // Check if file exists
    try {
      await stat(filePath)
    } catch {
      return NextResponse.json({ error: 'File not found' }, { status: 404 })
    }

    // Read file
    const fileBuffer = await readFile(filePath)
    const contentType = getContentType(fileName)

    // Return file with no-cache headers to prevent browser caching
    return new NextResponse(fileBuffer, {
      headers: {
        'Content-Type': contentType,
        'Content-Disposition': `attachment; filename="${path.basename(fileName)}"`,
        'Content-Length': fileBuffer.length.toString(),
        // Prevent caching - always fetch fresh
        'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0',
        'Pragma': 'no-cache',
        'Expires': '0',
        // Add timestamp to help with debugging
        'X-Download-Time': new Date().toISOString(),
      },
    })
  } catch (error) {
    console.error('Download error:', error)
    return NextResponse.json({ error: 'Failed to download file' }, { status: 500 })
  }
}
