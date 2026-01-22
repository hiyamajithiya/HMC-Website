import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'
import { writeFile, mkdir } from 'fs/promises'
import path from 'path'
import { existsSync } from 'fs'
import crypto from 'crypto'
import { encryptDocument } from '@/lib/encryption'

export const dynamic = 'force-dynamic'

// Secure storage directory - OUTSIDE public folder
const SECURE_UPLOADS_DIR = path.join(process.cwd(), 'private', 'documents')

// GET - Fetch documents for a user
export async function GET(request: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get user from database using ID
    const currentUser = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { id: true, role: true }
    })

    if (!currentUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')
    const category = searchParams.get('category')
    const folderId = searchParams.get('folderId')
    const financialYear = searchParams.get('financialYear')

    // Build where clause based on role and filters
    const whereClause: any = {}

    // Admin and Staff can see all documents, or filter by specific user
    // Clients can ONLY see their own documents - this is critical for security
    if (currentUser.role === 'ADMIN' || currentUser.role === 'STAFF') {
      if (userId) {
        whereClause.userId = userId
      }
      // If no userId specified, admin/staff sees ALL documents
    } else {
      // CLIENT can ONLY see their own documents - enforced at database level
      whereClause.userId = currentUser.id
    }

    if (category && category !== 'ALL') {
      whereClause.category = category
    }

    // Filter by folder
    if (folderId === 'root') {
      whereClause.folderId = null
    } else if (folderId) {
      whereClause.folderId = folderId
    }

    // Filter by financial year
    if (financialYear && financialYear !== 'ALL') {
      whereClause.financialYear = financialYear
    }

    const documents = await prisma.document.findMany({
      where: whereClause,
      orderBy: { createdAt: 'desc' },
      include: {
        user: {
          select: { name: true, email: true }
        },
        folder: {
          select: { id: true, name: true }
        }
      }
    })

    return NextResponse.json(documents)
  } catch (error) {
    console.error('Failed to fetch documents:', error)
    return NextResponse.json(
      { error: 'Failed to fetch documents' },
      { status: 500 }
    )
  }
}

// POST - Upload a document
export async function POST(request: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get user from database using ID
    const currentUser = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { id: true, role: true, name: true }
    })

    if (!currentUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    const formData = await request.formData()
    const file = formData.get('file') as File
    const title = formData.get('title') as string
    const description = formData.get('description') as string
    const category = formData.get('category') as string
    const financialYear = formData.get('financialYear') as string | null // e.g., "2024-25"
    const targetUserId = formData.get('userId') as string // For admin uploading to client
    const folderId = formData.get('folderId') as string | null // Optional folder

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }

    if (!title) {
      return NextResponse.json({ error: 'Title is required' }, { status: 400 })
    }

    if (!category) {
      return NextResponse.json({ error: 'Category is required' }, { status: 400 })
    }

    // Determine target user
    let documentUserId = currentUser.id
    if ((currentUser.role === 'ADMIN' || currentUser.role === 'STAFF') && targetUserId) {
      // Admin/Staff uploading for a client
      const targetUser = await prisma.user.findUnique({
        where: { id: targetUserId }
      })
      if (!targetUser) {
        return NextResponse.json({ error: 'Target user not found' }, { status: 404 })
      }
      documentUserId = targetUserId
    }

    // Validate folder if provided
    let validFolderId: string | null = null
    if (folderId && folderId !== 'null' && folderId !== '') {
      const folder = await prisma.documentFolder.findUnique({
        where: { id: folderId }
      })
      if (!folder) {
        return NextResponse.json({ error: 'Folder not found' }, { status: 404 })
      }
      if (folder.userId !== documentUserId) {
        return NextResponse.json({ error: 'Folder does not belong to the target user' }, { status: 400 })
      }
      validFolderId = folderId
    }

    // Validate file type
    const allowedTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'image/jpeg',
      'image/png',
      'image/gif',
      'text/plain',
      'text/csv'
    ]

    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: 'File type not allowed. Allowed: PDF, Word, Excel, Images, Text, CSV' },
        { status: 400 }
      )
    }

    // Max file size: 25MB
    const maxSize = 25 * 1024 * 1024
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: 'File too large. Maximum size is 25MB' },
        { status: 400 }
      )
    }

    // Create secure uploads directory if it doesn't exist (OUTSIDE public folder)
    const uploadsDir = path.join(SECURE_UPLOADS_DIR, documentUserId)
    if (!existsSync(uploadsDir)) {
      await mkdir(uploadsDir, { recursive: true })
    }

    // Generate secure unique filename with random hash
    const timestamp = Date.now()
    const randomHash = crypto.randomBytes(16).toString('hex')
    const extension = path.extname(file.name)
    // Add .enc extension to indicate encrypted file
    const secureFileName = `${timestamp}_${randomHash}${extension}.enc`
    const filePath = path.join(uploadsDir, secureFileName)

    // Read file and encrypt it before saving
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    // Encrypt the document for secure storage
    let dataToSave: Buffer
    try {
      dataToSave = encryptDocument(buffer)
    } catch (encryptError: any) {
      console.error('Encryption failed:', encryptError)
      // If encryption key is not set, save unencrypted (for development)
      if (encryptError.message?.includes('DOCUMENT_ENCRYPTION_KEY')) {
        console.warn('Warning: DOCUMENT_ENCRYPTION_KEY not set. Saving document without encryption.')
        dataToSave = buffer
        // Save without .enc extension
        const unencryptedFileName = `${timestamp}_${randomHash}${extension}`
        const unencryptedFilePath = path.join(uploadsDir, unencryptedFileName)
        await writeFile(unencryptedFilePath, dataToSave)

        // Store path without .enc
        const securePath = `private/documents/${documentUserId}/${unencryptedFileName}`

        // Create document record in database
        const document = await prisma.document.create({
          data: {
            title,
            description: description || null,
            fileName: file.name,
            filePath: securePath,
            fileSize: file.size,
            fileType: file.type,
            category: category as any,
            financialYear: financialYear || null,
            folderId: validFolderId,
            uploadedBy: currentUser.role === 'ADMIN' || currentUser.role === 'STAFF' ? 'ADMIN' : 'CLIENT',
            userId: documentUserId,
          },
          include: {
            user: {
              select: { name: true, email: true }
            },
            folder: {
              select: { id: true, name: true }
            }
          }
        })

        return NextResponse.json({
          success: true,
          message: 'Document uploaded successfully',
          document
        })
      }
      throw encryptError
    }

    await writeFile(filePath, dataToSave)

    // Store secure path (not publicly accessible)
    const securePath = `private/documents/${documentUserId}/${secureFileName}`

    // Create document record in database
    const document = await prisma.document.create({
      data: {
        title,
        description: description || null,
        fileName: file.name,
        filePath: securePath,
        fileSize: file.size,
        fileType: file.type,
        category: category as any,
        financialYear: financialYear || null,
        folderId: validFolderId,
        uploadedBy: currentUser.role === 'ADMIN' || currentUser.role === 'STAFF' ? 'ADMIN' : 'CLIENT',
        userId: documentUserId,
      },
      include: {
        user: {
          select: { name: true, email: true }
        },
        folder: {
          select: { id: true, name: true }
        }
      }
    })

    return NextResponse.json({
      success: true,
      message: 'Document uploaded successfully',
      document
    })
  } catch (error) {
    console.error('Failed to upload document:', error)
    return NextResponse.json(
      { error: 'Failed to upload document' },
      { status: 500 }
    )
  }
}
