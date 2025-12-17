import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'
import { readFile } from 'fs/promises'
import path from 'path'
import { existsSync } from 'fs'

export const dynamic = 'force-dynamic'

// GET - Securely download a document
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params

    // Get user from database
    const currentUser = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { id: true, role: true }
    })

    if (!currentUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Get document
    const document = await prisma.document.findUnique({
      where: { id }
    })

    if (!document) {
      return NextResponse.json({ error: 'Document not found' }, { status: 404 })
    }

    // Check access: Admin can access all, clients only their own documents
    if (currentUser.role !== 'ADMIN' && document.userId !== currentUser.id) {
      return NextResponse.json({ error: 'Access denied' }, { status: 403 })
    }

    // Determine file path (handle both new private and legacy public paths)
    let filePath: string
    if (document.filePath.startsWith('private/')) {
      filePath = path.join(process.cwd(), document.filePath)
    } else {
      // Legacy path in public folder
      filePath = path.join(process.cwd(), 'public', document.filePath)
    }

    // Check if file exists
    if (!existsSync(filePath)) {
      return NextResponse.json({ error: 'File not found on server' }, { status: 404 })
    }

    // Read file
    const fileBuffer = await readFile(filePath)

    // Create response with proper headers for download
    const response = new NextResponse(fileBuffer)

    // Set content type
    response.headers.set('Content-Type', document.fileType || 'application/octet-stream')

    // Set content disposition for download with original filename
    const encodedFilename = encodeURIComponent(document.fileName)
    response.headers.set(
      'Content-Disposition',
      `attachment; filename="${document.fileName}"; filename*=UTF-8''${encodedFilename}`
    )

    // Set content length
    response.headers.set('Content-Length', fileBuffer.length.toString())

    // Security headers
    response.headers.set('X-Content-Type-Options', 'nosniff')
    response.headers.set('Cache-Control', 'private, no-cache, no-store, must-revalidate')
    response.headers.set('Pragma', 'no-cache')
    response.headers.set('Expires', '0')

    return response
  } catch (error) {
    console.error('Failed to download document:', error)
    return NextResponse.json(
      { error: 'Failed to download document' },
      { status: 500 }
    )
  }
}
