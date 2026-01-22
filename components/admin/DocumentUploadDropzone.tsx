'use client'

import { useState, useCallback, useRef } from 'react'
import { Upload, X, FileText, Folder, Loader2, CheckCircle, AlertCircle, Calendar } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'

// Generate financial year options (Indian FY: April to March)
function getFinancialYearOptions(): string[] {
  const currentDate = new Date()
  const currentYear = currentDate.getFullYear()
  const currentMonth = currentDate.getMonth() // 0-indexed (0 = January)

  // If we're in Jan-March, current FY started last year
  // If we're in April-December, current FY started this year
  const currentFYStartYear = currentMonth < 3 ? currentYear - 1 : currentYear

  const years: string[] = []
  // Show 5 years back and current year
  for (let i = currentFYStartYear; i >= currentFYStartYear - 5; i--) {
    years.push(`${i}-${(i + 1).toString().slice(-2)}`)
  }
  return years
}

interface FileWithPath extends File {
  relativePath?: string
}

interface UploadFile {
  file: FileWithPath
  id: string
  status: 'pending' | 'uploading' | 'success' | 'error'
  progress: number
  error?: string
  folderId?: string
}

interface DocumentUploadDropzoneProps {
  userId: string
  folderId?: string | null
  defaultFinancialYear?: string
  onUploadComplete: () => void
  onCreateFolder?: (name: string, parentId?: string) => Promise<string>
}

export default function DocumentUploadDropzone({
  userId,
  folderId,
  defaultFinancialYear,
  onUploadComplete,
  onCreateFolder,
}: DocumentUploadDropzoneProps) {
  const [isDragging, setIsDragging] = useState(false)
  const [files, setFiles] = useState<UploadFile[]>([])
  const [isUploading, setIsUploading] = useState(false)
  const [financialYear, setFinancialYear] = useState(defaultFinancialYear || getFinancialYearOptions()[0])
  const fileInputRef = useRef<HTMLInputElement>(null)
  const folderInputRef = useRef<HTMLInputElement>(null)
  const financialYearOptions = getFinancialYearOptions()

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
    'text/csv',
  ]

  const maxFileSize = 25 * 1024 * 1024 // 25MB

  const validateFile = (file: File): string | null => {
    if (!allowedTypes.includes(file.type)) {
      return 'File type not allowed'
    }
    if (file.size > maxFileSize) {
      return 'File too large (max 25MB)'
    }
    return null
  }

  const addFiles = useCallback((newFiles: FileWithPath[]) => {
    const uploadFiles: UploadFile[] = newFiles.map((file) => ({
      file,
      id: `${file.name}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      status: 'pending' as const,
      progress: 0,
    }))
    setFiles((prev) => [...prev, ...uploadFiles])
  }, [])

  const handleDragEnter = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.currentTarget === e.target) {
      setIsDragging(false)
    }
  }, [])

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
  }, [])

  const processDataTransferItems = async (items: DataTransferItemList): Promise<FileWithPath[]> => {
    const files: FileWithPath[] = []

    const traverseFileTree = async (item: FileSystemEntry, path: string = ''): Promise<void> => {
      if (item.isFile) {
        const fileEntry = item as FileSystemFileEntry
        return new Promise((resolve) => {
          fileEntry.file((file) => {
            const fileWithPath = file as FileWithPath
            fileWithPath.relativePath = path + file.name
            files.push(fileWithPath)
            resolve()
          })
        })
      } else if (item.isDirectory) {
        const dirEntry = item as FileSystemDirectoryEntry
        const dirReader = dirEntry.createReader()
        return new Promise((resolve) => {
          dirReader.readEntries(async (entries) => {
            for (const entry of entries) {
              await traverseFileTree(entry, path + item.name + '/')
            }
            resolve()
          })
        })
      }
    }

    const promises: Promise<void>[] = []
    for (let i = 0; i < items.length; i++) {
      const item = items[i]
      if (item.kind === 'file') {
        const entry = item.webkitGetAsEntry()
        if (entry) {
          promises.push(traverseFileTree(entry))
        }
      }
    }

    await Promise.all(promises)
    return files
  }

  const handleDrop = useCallback(async (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)

    const items = e.dataTransfer.items
    if (items && items.length > 0) {
      const files = await processDataTransferItems(items)
      if (files.length > 0) {
        addFiles(files)
      }
    } else {
      const droppedFiles = Array.from(e.dataTransfer.files) as FileWithPath[]
      if (droppedFiles.length > 0) {
        addFiles(droppedFiles)
      }
    }
  }, [addFiles])

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = e.target.files
    if (selectedFiles && selectedFiles.length > 0) {
      addFiles(Array.from(selectedFiles) as FileWithPath[])
    }
    e.target.value = ''
  }, [addFiles])

  const handleFolderSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = e.target.files
    if (selectedFiles && selectedFiles.length > 0) {
      const filesWithPaths = Array.from(selectedFiles).map((file) => {
        const fileWithPath = file as FileWithPath
        fileWithPath.relativePath = (file as any).webkitRelativePath || file.name
        return fileWithPath
      })
      addFiles(filesWithPaths)
    }
    e.target.value = ''
  }, [addFiles])

  const removeFile = useCallback((id: string) => {
    setFiles((prev) => prev.filter((f) => f.id !== id))
  }, [])

  const uploadSingleFile = async (uploadFile: UploadFile, targetFolderId?: string): Promise<void> => {
    const error = validateFile(uploadFile.file)
    if (error) {
      setFiles((prev) =>
        prev.map((f) =>
          f.id === uploadFile.id ? { ...f, status: 'error' as const, error } : f
        )
      )
      return
    }

    setFiles((prev) =>
      prev.map((f) =>
        f.id === uploadFile.id ? { ...f, status: 'uploading' as const, progress: 0 } : f
      )
    )

    const formData = new FormData()
    formData.append('file', uploadFile.file)
    formData.append('title', uploadFile.file.name.replace(/\.[^/.]+$/, ''))
    formData.append('category', 'OTHER')
    formData.append('userId', userId)
    if (financialYear) {
      formData.append('financialYear', financialYear)
    }
    if (targetFolderId) {
      formData.append('folderId', targetFolderId)
    }

    try {
      const response = await fetch('/api/documents', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Upload failed')
      }

      setFiles((prev) =>
        prev.map((f) =>
          f.id === uploadFile.id ? { ...f, status: 'success' as const, progress: 100 } : f
        )
      )
    } catch (err) {
      setFiles((prev) =>
        prev.map((f) =>
          f.id === uploadFile.id
            ? { ...f, status: 'error' as const, error: err instanceof Error ? err.message : 'Upload failed' }
            : f
        )
      )
    }
  }

  const uploadFiles = async () => {
    if (files.length === 0 || isUploading) return

    setIsUploading(true)

    // Group files by their folder path
    const filesByFolder = new Map<string, UploadFile[]>()
    const folderCache = new Map<string, string>() // path -> folderId

    for (const uploadFile of files) {
      if (uploadFile.status !== 'pending') continue

      const relativePath = uploadFile.file.relativePath
      if (relativePath && relativePath.includes('/')) {
        const pathParts = relativePath.split('/')
        pathParts.pop() // Remove filename
        const folderPath = pathParts.join('/')

        if (!filesByFolder.has(folderPath)) {
          filesByFolder.set(folderPath, [])
        }
        filesByFolder.get(folderPath)!.push(uploadFile)
      } else {
        if (!filesByFolder.has('')) {
          filesByFolder.set('', [])
        }
        filesByFolder.get('')!.push(uploadFile)
      }
    }

    // Create folders and upload files
    const folderEntries = Array.from(filesByFolder.entries())
    for (const [folderPath, folderFiles] of folderEntries) {
      let targetFolderId = folderId || undefined

      if (folderPath && onCreateFolder) {
        // Create nested folders
        const pathParts = folderPath.split('/')
        let currentParentId = folderId || undefined

        for (const part of pathParts) {
          const cachePath = currentParentId ? `${currentParentId}/${part}` : part

          if (folderCache.has(cachePath)) {
            currentParentId = folderCache.get(cachePath)
          } else {
            try {
              const newFolderId = await onCreateFolder(part, currentParentId)
              folderCache.set(cachePath, newFolderId)
              currentParentId = newFolderId
            } catch (err) {
              console.error('Failed to create folder:', err)
            }
          }
        }
        targetFolderId = currentParentId
      }

      // Upload files to this folder
      for (const uploadFile of folderFiles) {
        await uploadSingleFile(uploadFile, targetFolderId)
      }
    }

    setIsUploading(false)
    onUploadComplete()
  }

  const clearCompleted = useCallback(() => {
    setFiles((prev) => prev.filter((f) => f.status === 'pending' || f.status === 'uploading'))
  }, [])

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const pendingCount = files.filter((f) => f.status === 'pending').length
  const successCount = files.filter((f) => f.status === 'success').length
  const errorCount = files.filter((f) => f.status === 'error').length

  return (
    <div className="space-y-4">
      {/* Financial Year Selector */}
      <div className="flex items-center gap-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
        <Calendar className="h-5 w-5 text-blue-600" />
        <label className="text-sm font-medium text-blue-900">Financial Year:</label>
        <select
          value={financialYear}
          onChange={(e) => setFinancialYear(e.target.value)}
          className="flex-1 max-w-[150px] h-9 px-3 rounded-md border border-blue-300 bg-white text-sm font-medium text-blue-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          {financialYearOptions.map((fy) => (
            <option key={fy} value={fy}>
              FY {fy}
            </option>
          ))}
        </select>
        <span className="text-xs text-blue-600">
          (April {financialYear.split('-')[0]} - March {parseInt(financialYear.split('-')[0]) + 1})
        </span>
      </div>

      {/* Drop Zone */}
      <div
        className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
          isDragging
            ? 'border-primary bg-primary/5'
            : 'border-gray-300 hover:border-gray-400'
        }`}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      >
        <Upload className={`h-12 w-12 mx-auto mb-4 ${isDragging ? 'text-primary' : 'text-gray-400'}`} />
        <p className="text-lg font-medium text-gray-700 mb-2">
          {isDragging ? 'Drop files or folders here' : 'Drag and drop files or folders'}
        </p>
        <p className="text-sm text-gray-500 mb-4">
          or click the buttons below to select
        </p>
        <div className="flex justify-center gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={() => fileInputRef.current?.click()}
          >
            <FileText className="h-4 w-4 mr-2" />
            Select Files
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => folderInputRef.current?.click()}
          >
            <Folder className="h-4 w-4 mr-2" />
            Select Folder
          </Button>
        </div>
        <input
          ref={fileInputRef}
          type="file"
          multiple
          className="hidden"
          onChange={handleFileSelect}
          accept=".pdf,.doc,.docx,.xls,.xlsx,.jpg,.jpeg,.png,.gif,.txt,.csv"
        />
        <input
          ref={folderInputRef}
          type="file"
          multiple
          className="hidden"
          onChange={handleFolderSelect}
          {...({ webkitdirectory: '', directory: '' } as any)}
        />
        <p className="text-xs text-gray-400 mt-4">
          Supported: PDF, Word, Excel, Images, Text, CSV (Max 25MB per file)
        </p>
      </div>

      {/* File List */}
      {files.length > 0 && (
        <div className="border rounded-lg overflow-hidden">
          <div className="bg-gray-50 px-4 py-3 border-b flex justify-between items-center">
            <div className="flex items-center gap-4">
              <span className="font-medium">{files.length} file(s)</span>
              {pendingCount > 0 && (
                <span className="text-sm text-gray-500">{pendingCount} pending</span>
              )}
              {successCount > 0 && (
                <span className="text-sm text-green-600">{successCount} uploaded</span>
              )}
              {errorCount > 0 && (
                <span className="text-sm text-red-600">{errorCount} failed</span>
              )}
            </div>
            <div className="flex gap-2">
              {(successCount > 0 || errorCount > 0) && (
                <Button variant="ghost" size="sm" onClick={clearCompleted}>
                  Clear Completed
                </Button>
              )}
              {pendingCount > 0 && (
                <Button
                  size="sm"
                  onClick={uploadFiles}
                  disabled={isUploading}
                  className="bg-primary hover:bg-primary-dark"
                >
                  {isUploading ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Uploading...
                    </>
                  ) : (
                    <>
                      <Upload className="h-4 w-4 mr-2" />
                      Upload All
                    </>
                  )}
                </Button>
              )}
            </div>
          </div>
          <div className="max-h-64 overflow-y-auto">
            {files.map((uploadFile) => (
              <div
                key={uploadFile.id}
                className="flex items-center gap-3 px-4 py-3 border-b last:border-b-0 hover:bg-gray-50"
              >
                <FileText className="h-5 w-5 text-gray-400 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {uploadFile.file.relativePath || uploadFile.file.name}
                  </p>
                  <p className="text-xs text-gray-500">
                    {formatFileSize(uploadFile.file.size)}
                  </p>
                  {uploadFile.status === 'uploading' && (
                    <Progress value={uploadFile.progress} className="h-1 mt-1" />
                  )}
                  {uploadFile.status === 'error' && uploadFile.error && (
                    <p className="text-xs text-red-600 mt-1">{uploadFile.error}</p>
                  )}
                </div>
                <div className="flex-shrink-0">
                  {uploadFile.status === 'pending' && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeFile(uploadFile.id)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                  {uploadFile.status === 'uploading' && (
                    <Loader2 className="h-5 w-5 text-primary animate-spin" />
                  )}
                  {uploadFile.status === 'success' && (
                    <CheckCircle className="h-5 w-5 text-green-600" />
                  )}
                  {uploadFile.status === 'error' && (
                    <AlertCircle className="h-5 w-5 text-red-600" />
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
