import { NextRequest, NextResponse } from 'next/server'
import { getSession } from '@/lib/auth-check'
import { prisma } from '@/lib/prisma'
import { readFile } from 'fs/promises'
import path from 'path'
import { existsSync } from 'fs'
import { decryptDocument } from '@/lib/encryption'

export const dynamic = 'force-dynamic'

// Get the base directory for document storage
function getDocumentsBaseDir(): string {
  const uploadsPath = process.env.UPLOADS_PATH
  if (uploadsPath) {
    return uploadsPath
  }
  return process.cwd()
}

// GET - Securely download or view a document
// Use ?view=true to view inline, otherwise downloads as attachment
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSession()
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params
    const { searchParams } = new URL(request.url)
    const viewMode = searchParams.get('view') === 'true'

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

    // SECURITY CHECK: Admin/Staff can access all, clients can ONLY access their own documents
    // This is critical - clients should NEVER be able to access other clients' documents
    if (currentUser.role !== 'ADMIN' && currentUser.role !== 'STAFF' && document.userId !== currentUser.id) {
      return NextResponse.json({ error: 'Access denied' }, { status: 403 })
    }

    // Determine file path (handle both UPLOADS_PATH and legacy paths)
    let filePath: string
    const uploadsPath = process.env.UPLOADS_PATH

    if (document.filePath.startsWith('private/documents/')) {
      // Document path format: private/documents/{userId}/{fileName}
      // Extract the documents/{userId}/{fileName} part
      const relativePath = document.filePath.replace('private/', '')

      // Try UPLOADS_PATH first (persistent storage), then fallback to process.cwd()
      if (uploadsPath) {
        const uploadsPathFile = path.join(uploadsPath, relativePath)
        const cwdPathFile = path.join(process.cwd(), document.filePath)

        if (existsSync(uploadsPathFile)) {
          filePath = uploadsPathFile
        } else if (existsSync(cwdPathFile)) {
          // Fallback to old location for existing documents
          filePath = cwdPathFile
        } else {
          filePath = uploadsPathFile // Will trigger "file not found" error
        }
      } else {
        filePath = path.join(process.cwd(), document.filePath)
      }
    } else if (document.filePath.startsWith('private/')) {
      // Other private paths
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
    let fileBuffer: Buffer = Buffer.from(await readFile(filePath))

    // Check if file is encrypted (ends with .enc)
    const isEncrypted = document.filePath.endsWith('.enc')

    if (isEncrypted) {
      try {
        // Decrypt the file before serving
        fileBuffer = decryptDocument(fileBuffer)
      } catch (decryptError: any) {
        console.error('Decryption failed:', decryptError)

        // If decryption key is missing, try serving as-is (might be legacy unencrypted file with .enc extension)
        if (decryptError.message?.includes('DOCUMENT_ENCRYPTION_KEY')) {
          console.warn('Warning: DOCUMENT_ENCRYPTION_KEY not set. Cannot decrypt document.')
          return NextResponse.json(
            { error: 'Document encryption key not configured. Please contact administrator.' },
            { status: 500 }
          )
        }

        // Other decryption errors (corrupted file, wrong key, etc.)
        return NextResponse.json(
          { error: 'Failed to decrypt document. The file may be corrupted.' },
          { status: 500 }
        )
      }
    }

    // Create response with proper headers for download
    const encodedFilename = encodeURIComponent(document.fileName)
    const contentDisposition = viewMode
      ? `inline; filename="${document.fileName}"; filename*=UTF-8''${encodedFilename}`
      : `attachment; filename="${document.fileName}"; filename*=UTF-8''${encodedFilename}`

    // Convert Buffer to Uint8Array for Response compatibility
    const responseBody = new Uint8Array(fileBuffer)

    return new Response(responseBody, {
      status: 200,
      headers: {
        'Content-Type': document.fileType || 'application/octet-stream',
        'Content-Disposition': contentDisposition,
        'Content-Length': fileBuffer.length.toString(),
        'X-Content-Type-Options': 'nosniff',
        'Cache-Control': 'private, no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0',
      },
    })
  } catch (error) {
    console.error('Failed to download document:', error)
    return NextResponse.json(
      { error: 'Failed to download document' },
      { status: 500 }
    )
  }
}
