'use client'

import { useState, useEffect, useRef } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  FileText, Upload, Download, Trash2, Eye, Search,
  X, CheckCircle, AlertCircle, Loader2, User, Calendar,
  Folder, FolderPlus, ChevronRight, Home, MoreVertical, Pencil
} from 'lucide-react'
import { format } from 'date-fns'
import DocumentUploadDropzone from '@/components/admin/DocumentUploadDropzone'

interface DocumentFolder {
  id: string
  name: string
  parentId: string | null
  userId: string
  createdAt: string
  _count: {
    documents: number
    children: number
  }
}

interface Document {
  id: string
  title: string
  description: string | null
  fileName: string
  filePath: string
  fileSize: number
  fileType: string
  category: string
  financialYear: string | null
  folderId: string | null
  uploadedBy: string
  userId: string
  createdAt: string
  user: {
    name: string | null
    email: string
  }
  folder?: {
    id: string
    name: string
  } | null
}

// Generate financial year options (Indian FY: April to March)
function getFinancialYearOptions(): string[] {
  const currentDate = new Date()
  const currentYear = currentDate.getFullYear()
  const currentMonth = currentDate.getMonth()
  const currentFYStartYear = currentMonth < 3 ? currentYear - 1 : currentYear

  const years: string[] = []
  for (let i = currentFYStartYear; i >= currentFYStartYear - 5; i--) {
    years.push(`${i}-${(i + 1).toString().slice(-2)}`)
  }
  return years
}

interface UserOption {
  id: string
  name: string | null
  email: string
}

interface BreadcrumbItem {
  id: string | null
  name: string
}

const CATEGORIES = [
  { value: 'TAX_RETURNS', label: 'Tax Returns' },
  { value: 'AUDIT_REPORTS', label: 'Audit Reports' },
  { value: 'GST_RETURNS', label: 'GST Returns' },
  { value: 'COMPLIANCE', label: 'Compliance' },
  { value: 'INVOICES', label: 'Invoices' },
  { value: 'OTHER', label: 'Other' },
]

export default function AdminDocumentsPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const folderInputRef = useRef<HTMLInputElement>(null)

  const [documents, setDocuments] = useState<Document[]>([])
  const [folders, setFolders] = useState<DocumentFolder[]>([])
  const [users, setUsers] = useState<UserOption[]>([])
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [showUploadModal, setShowUploadModal] = useState(false)
  const [showCreateFolderModal, setShowCreateFolderModal] = useState(false)
  const [showBulkUploadModal, setShowBulkUploadModal] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterCategory, setFilterCategory] = useState('ALL')
  const [filterUser, setFilterUser] = useState('ALL')
  const [filterFinancialYear, setFilterFinancialYear] = useState('ALL')
  const financialYearOptions = getFinancialYearOptions()

  // Folder navigation state
  const [currentFolderId, setCurrentFolderId] = useState<string | null>(null)
  const [breadcrumbs, setBreadcrumbs] = useState<BreadcrumbItem[]>([{ id: null, name: 'Root' }])

  // New folder form
  const [newFolderName, setNewFolderName] = useState('')
  const [folderError, setFolderError] = useState('')

  // Edit folder state
  const [editingFolder, setEditingFolder] = useState<DocumentFolder | null>(null)
  const [editFolderName, setEditFolderName] = useState('')

  // Upload form state
  const [uploadForm, setUploadForm] = useState({
    title: '',
    description: '',
    category: 'OTHER',
    financialYear: getFinancialYearOptions()[0],
    userId: '',
    file: null as File | null,
  })
  const [uploadError, setUploadError] = useState('')
  const [uploadSuccess, setUploadSuccess] = useState(false)

  useEffect(() => {
    if (status === 'loading') return
    if (!session || (session.user?.role !== 'ADMIN' && session.user?.role !== 'STAFF')) {
      router.push('/client-portal/login')
      return
    }
    fetchUsers()
  }, [session, status])

  useEffect(() => {
    if (filterUser && filterUser !== 'ALL') {
      fetchFolders()
      fetchDocuments()
    } else {
      setFolders([])
      fetchDocuments()
    }
  }, [filterUser, currentFolderId, filterFinancialYear])

  const fetchDocuments = async () => {
    try {
      setLoading(true)
      let url = '/api/documents'
      const params = new URLSearchParams()

      if (filterUser && filterUser !== 'ALL') {
        params.append('userId', filterUser)
        if (currentFolderId) {
          params.append('folderId', currentFolderId)
        } else {
          params.append('folderId', 'root')
        }
      }

      if (filterFinancialYear && filterFinancialYear !== 'ALL') {
        params.append('financialYear', filterFinancialYear)
      }

      if (params.toString()) {
        url += '?' + params.toString()
      }

      const response = await fetch(url)
      if (response.ok) {
        const data = await response.json()
        setDocuments(data)
      }
    } catch (error) {
      console.error('Failed to fetch documents:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchFolders = async () => {
    if (!filterUser || filterUser === 'ALL') {
      setFolders([])
      return
    }

    try {
      const params = new URLSearchParams()
      params.append('userId', filterUser)
      if (currentFolderId) {
        params.append('parentId', currentFolderId)
      }

      const response = await fetch('/api/folders?' + params.toString())
      if (response.ok) {
        const data = await response.json()
        setFolders(data)
      }
    } catch (error) {
      console.error('Failed to fetch folders:', error)
    }
  }

  const fetchUsers = async () => {
    try {
      const response = await fetch('/api/admin/users')
      if (response.ok) {
        const data = await response.json()
        setUsers(data.filter((u: any) => u.role === 'CLIENT'))
      }
    } catch (error) {
      console.error('Failed to fetch users:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleCreateFolder = async (e: React.FormEvent) => {
    e.preventDefault()
    setFolderError('')

    if (!newFolderName.trim()) {
      setFolderError('Folder name is required')
      return
    }

    if (!filterUser || filterUser === 'ALL') {
      setFolderError('Please select a client first')
      return
    }

    try {
      const response = await fetch('/api/folders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: newFolderName.trim(),
          parentId: currentFolderId,
          userId: filterUser,
        }),
      })

      const data = await response.json()

      if (response.ok) {
        setNewFolderName('')
        setShowCreateFolderModal(false)
        fetchFolders()
      } else {
        setFolderError(data.error || 'Failed to create folder')
      }
    } catch (error) {
      setFolderError('Failed to create folder')
    }
  }

  const handleCreateFolderForUpload = async (name: string, parentId?: string): Promise<string> => {
    const response = await fetch('/api/folders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name,
        parentId: parentId || currentFolderId,
        userId: filterUser,
      }),
    })

    if (!response.ok) {
      const data = await response.json()
      throw new Error(data.error || 'Failed to create folder')
    }

    const folder = await response.json()
    return folder.id
  }

  const handleRenameFolder = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingFolder || !editFolderName.trim()) return

    try {
      const response = await fetch(`/api/folders/${editingFolder.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: editFolderName.trim() }),
      })

      if (response.ok) {
        setEditingFolder(null)
        setEditFolderName('')
        fetchFolders()
      }
    } catch (error) {
      console.error('Failed to rename folder:', error)
    }
  }

  const handleDeleteFolder = async (folderId: string) => {
    if (!confirm('Are you sure you want to delete this folder? Documents inside will be moved to the root folder.')) return

    try {
      const response = await fetch(`/api/folders/${folderId}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        fetchFolders()
        fetchDocuments()
      }
    } catch (error) {
      console.error('Failed to delete folder:', error)
    }
  }

  const navigateToFolder = async (folderId: string | null, folderName: string) => {
    setCurrentFolderId(folderId)

    if (folderId === null) {
      setBreadcrumbs([{ id: null, name: 'Root' }])
    } else {
      const existingIndex = breadcrumbs.findIndex(b => b.id === folderId)
      if (existingIndex >= 0) {
        setBreadcrumbs(breadcrumbs.slice(0, existingIndex + 1))
      } else {
        setBreadcrumbs([...breadcrumbs, { id: folderId, name: folderName }])
      }
    }
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setUploadForm({ ...uploadForm, file })
      if (!uploadForm.title) {
        const nameWithoutExt = file.name.replace(/\.[^/.]+$/, '')
        setUploadForm(prev => ({ ...prev, file, title: nameWithoutExt }))
      }
    }
  }

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault()
    setUploadError('')
    setUploadSuccess(false)

    if (!uploadForm.file) {
      setUploadError('Please select a file')
      return
    }
    if (!uploadForm.title) {
      setUploadError('Please enter a title')
      return
    }
    if (!uploadForm.userId) {
      setUploadError('Please select a client')
      return
    }

    setUploading(true)

    try {
      const formData = new FormData()
      formData.append('file', uploadForm.file)
      formData.append('title', uploadForm.title)
      formData.append('description', uploadForm.description)
      formData.append('category', uploadForm.category)
      formData.append('userId', uploadForm.userId)
      if (uploadForm.financialYear) {
        formData.append('financialYear', uploadForm.financialYear)
      }
      if (currentFolderId) {
        formData.append('folderId', currentFolderId)
      }

      const response = await fetch('/api/documents', {
        method: 'POST',
        body: formData,
      })

      const data = await response.json()

      if (response.ok) {
        setUploadSuccess(true)
        setUploadForm({
          title: '',
          description: '',
          category: 'OTHER',
          financialYear: getFinancialYearOptions()[0],
          userId: uploadForm.userId,
          file: null,
        })
        if (fileInputRef.current) {
          fileInputRef.current.value = ''
        }
        fetchDocuments()
        setTimeout(() => {
          setShowUploadModal(false)
          setUploadSuccess(false)
        }, 2000)
      } else {
        setUploadError(data.error || 'Upload failed')
      }
    } catch (error) {
      setUploadError('Upload failed. Please try again.')
    } finally {
      setUploading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this document?')) return

    try {
      const response = await fetch(`/api/documents/${id}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        setDocuments(documents.filter(d => d.id !== id))
      } else {
        alert('Failed to delete document')
      }
    } catch (error) {
      alert('Failed to delete document')
    }
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i]
  }

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      TAX_RETURNS: 'bg-blue-100 text-blue-800',
      AUDIT_REPORTS: 'bg-purple-100 text-purple-800',
      GST_RETURNS: 'bg-green-100 text-green-800',
      COMPLIANCE: 'bg-orange-100 text-orange-800',
      INVOICES: 'bg-yellow-100 text-yellow-800',
      OTHER: 'bg-gray-100 text-gray-800',
    }
    return colors[category] || colors.OTHER
  }

  // Filter documents by search
  const filteredDocuments = documents.filter(doc => {
    const matchesSearch = doc.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.fileName.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = filterCategory === 'ALL' || doc.category === filterCategory
    return matchesSearch && matchesCategory
  })

  // Filter folders by search
  const filteredFolders = folders.filter(folder =>
    folder.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  if (status === 'loading' || (loading && users.length === 0)) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Documents</h1>
          <p className="text-gray-600">Manage client documents and folders</p>
        </div>
        <div className="flex gap-2">
          {filterUser && filterUser !== 'ALL' && (
            <Button variant="outline" onClick={() => setShowCreateFolderModal(true)}>
              <FolderPlus className="h-4 w-4 mr-2" />
              New Folder
            </Button>
          )}
          <Button variant="outline" onClick={() => setShowBulkUploadModal(true)}>
            <Upload className="h-4 w-4 mr-2" />
            Bulk Upload
          </Button>
          <Button onClick={() => setShowUploadModal(true)}>
            <Upload className="h-4 w-4 mr-2" />
            Upload Document
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search documents and folders..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
            <select
              value={filterUser}
              onChange={(e) => {
                setFilterUser(e.target.value)
                setCurrentFolderId(null)
                setBreadcrumbs([{ id: null, name: 'Root' }])
              }}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="ALL">All Clients</option>
              {users.map(user => (
                <option key={user.id} value={user.id}>
                  {user.name || user.email}
                </option>
              ))}
            </select>
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="ALL">All Categories</option>
              {CATEGORIES.map(cat => (
                <option key={cat.value} value={cat.value}>{cat.label}</option>
              ))}
            </select>
            <select
              value={filterFinancialYear}
              onChange={(e) => setFilterFinancialYear(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="ALL">All Years</option>
              {financialYearOptions.map(fy => (
                <option key={fy} value={fy}>FY {fy}</option>
              ))}
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Breadcrumbs - Only show when a client is selected */}
      {filterUser && filterUser !== 'ALL' && (
        <div className="flex items-center gap-2 text-sm">
          {breadcrumbs.map((crumb, index) => (
            <div key={crumb.id || 'root'} className="flex items-center">
              {index > 0 && <ChevronRight className="h-4 w-4 text-gray-400 mx-1" />}
              <button
                onClick={() => navigateToFolder(crumb.id, crumb.name)}
                className={`flex items-center gap-1 hover:text-blue-600 ${
                  index === breadcrumbs.length - 1 ? 'font-medium text-gray-900' : 'text-gray-500'
                }`}
              >
                {index === 0 && <Home className="h-4 w-4" />}
                {crumb.name}
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Documents & Folders */}
      <Card>
        <CardHeader>
          <CardTitle>
            {filterUser && filterUser !== 'ALL'
              ? `${users.find(u => u.id === filterUser)?.name || 'Client'}'s Files`
              : `All Documents (${filteredDocuments.length})`
            }
          </CardTitle>
          <CardDescription>
            {filterUser && filterUser !== 'ALL'
              ? `${filteredFolders.length} folder(s), ${filteredDocuments.length} document(s)`
              : 'Select a client to manage their documents and folders'
            }
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
            </div>
          ) : filterUser === 'ALL' ? (
            // Show all documents across clients
            filteredDocuments.length === 0 ? (
              <div className="text-center py-12">
                <FileText className="h-16 w-16 mx-auto text-gray-400 mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No documents found</h3>
                <p className="text-gray-600 mb-6">Upload documents for your clients to access.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Document</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Client</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">FY</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Size</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Uploaded</th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredDocuments.map((doc) => (
                      <tr key={doc.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4">
                          <div className="flex items-center">
                            <FileText className="h-5 w-5 text-gray-400 mr-3" />
                            <div>
                              <p className="text-sm font-medium text-gray-900">{doc.title}</p>
                              <p className="text-sm text-gray-500">{doc.fileName}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center">
                            <User className="h-4 w-4 text-gray-400 mr-2" />
                            <div>
                              <p className="text-sm text-gray-900">{doc.user?.name || 'N/A'}</p>
                              <p className="text-xs text-gray-500">{doc.user?.email}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          {doc.financialYear ? (
                            <span className="px-2 py-1 text-xs font-medium rounded-full bg-indigo-100 text-indigo-800">
                              {doc.financialYear}
                            </span>
                          ) : (
                            <span className="text-xs text-gray-400">-</span>
                          )}
                        </td>
                        <td className="px-6 py-4">
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${getCategoryColor(doc.category)}`}>
                            {doc.category.replace('_', ' ')}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-500">{formatFileSize(doc.fileSize)}</td>
                        <td className="px-6 py-4">
                          <div className="flex items-center text-sm text-gray-500">
                            <Calendar className="h-4 w-4 mr-1" />
                            {format(new Date(doc.createdAt), 'MMM dd, yyyy')}
                          </div>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex justify-end gap-2">
                            <Button variant="ghost" size="sm" asChild title="View">
                              <a href={`/api/documents/${doc.id}/download?view=true`} target="_blank" rel="noopener noreferrer">
                                <Eye className="h-4 w-4" />
                              </a>
                            </Button>
                            <Button variant="ghost" size="sm" asChild title="Download">
                              <a href={`/api/documents/${doc.id}/download`}>
                                <Download className="h-4 w-4" />
                              </a>
                            </Button>
                            <Button variant="ghost" size="sm" onClick={() => handleDelete(doc.id)} className="text-red-600 hover:text-red-800">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )
          ) : (
            // Show folders and documents for selected client
            <div className="space-y-4">
              {/* Folders Grid */}
              {filteredFolders.length > 0 && (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                  {filteredFolders.map((folder) => (
                    <div
                      key={folder.id}
                      className="group relative border rounded-lg p-4 hover:bg-gray-50 cursor-pointer transition-colors"
                      onDoubleClick={() => navigateToFolder(folder.id, folder.name)}
                    >
                      <div className="flex flex-col items-center text-center">
                        <Folder className="h-12 w-12 text-yellow-500 mb-2" />
                        <p className="text-sm font-medium text-gray-900 truncate w-full">{folder.name}</p>
                        <p className="text-xs text-gray-500">
                          {folder._count.documents} files, {folder._count.children} folders
                        </p>
                      </div>
                      <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <div className="relative">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0"
                            onClick={(e) => {
                              e.stopPropagation()
                              setEditingFolder(folder)
                              setEditFolderName(folder.name)
                            }}
                          >
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Documents Table */}
              {filteredDocuments.length > 0 ? (
                <div className="overflow-x-auto border rounded-lg">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Document</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">FY</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Size</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Uploaded</th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {filteredDocuments.map((doc) => (
                        <tr key={doc.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4">
                            <div className="flex items-center">
                              <FileText className="h-5 w-5 text-gray-400 mr-3" />
                              <div>
                                <p className="text-sm font-medium text-gray-900">{doc.title}</p>
                                <p className="text-sm text-gray-500">{doc.fileName}</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            {doc.financialYear ? (
                              <span className="px-2 py-1 text-xs font-medium rounded-full bg-indigo-100 text-indigo-800">
                                {doc.financialYear}
                              </span>
                            ) : (
                              <span className="text-xs text-gray-400">-</span>
                            )}
                          </td>
                          <td className="px-6 py-4">
                            <span className={`px-2 py-1 text-xs font-medium rounded-full ${getCategoryColor(doc.category)}`}>
                              {doc.category.replace('_', ' ')}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-500">{formatFileSize(doc.fileSize)}</td>
                          <td className="px-6 py-4">
                            <div className="flex items-center text-sm text-gray-500">
                              <Calendar className="h-4 w-4 mr-1" />
                              {format(new Date(doc.createdAt), 'MMM dd, yyyy')}
                            </div>
                          </td>
                          <td className="px-6 py-4 text-right">
                            <div className="flex justify-end gap-2">
                              <Button variant="ghost" size="sm" asChild title="View">
                                <a href={`/api/documents/${doc.id}/download?view=true`} target="_blank" rel="noopener noreferrer">
                                  <Eye className="h-4 w-4" />
                                </a>
                              </Button>
                              <Button variant="ghost" size="sm" asChild title="Download">
                                <a href={`/api/documents/${doc.id}/download`}>
                                  <Download className="h-4 w-4" />
                                </a>
                              </Button>
                              <Button variant="ghost" size="sm" onClick={() => handleDelete(doc.id)} className="text-red-600 hover:text-red-800">
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : filteredFolders.length === 0 ? (
                <div className="text-center py-12">
                  <FileText className="h-16 w-16 mx-auto text-gray-400 mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">No files in this folder</h3>
                  <p className="text-gray-600 mb-6">Upload documents or create subfolders.</p>
                  <div className="flex justify-center gap-3">
                    <Button variant="outline" onClick={() => setShowCreateFolderModal(true)}>
                      <FolderPlus className="h-4 w-4 mr-2" />
                      Create Folder
                    </Button>
                    <Button onClick={() => setShowBulkUploadModal(true)}>
                      <Upload className="h-4 w-4 mr-2" />
                      Upload Files
                    </Button>
                  </div>
                </div>
              ) : null}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Create Folder Modal */}
      {showCreateFolderModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold">Create New Folder</h2>
                <button onClick={() => setShowCreateFolderModal(false)} className="text-gray-500 hover:text-gray-700">
                  <X className="h-6 w-6" />
                </button>
              </div>

              <form onSubmit={handleCreateFolder} className="space-y-4">
                {folderError && (
                  <div className="flex items-center gap-2 p-3 bg-red-50 text-red-700 rounded-lg">
                    <AlertCircle className="h-5 w-5" />
                    {folderError}
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Folder Name</label>
                  <input
                    type="text"
                    value={newFolderName}
                    onChange={(e) => setNewFolderName(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter folder name"
                    autoFocus
                  />
                </div>

                <div className="flex gap-3 pt-4">
                  <Button type="button" variant="outline" className="flex-1" onClick={() => setShowCreateFolderModal(false)}>
                    Cancel
                  </Button>
                  <Button type="submit" className="flex-1">
                    <FolderPlus className="h-4 w-4 mr-2" />
                    Create Folder
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Edit Folder Modal */}
      {editingFolder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold">Edit Folder</h2>
                <button onClick={() => setEditingFolder(null)} className="text-gray-500 hover:text-gray-700">
                  <X className="h-6 w-6" />
                </button>
              </div>

              <form onSubmit={handleRenameFolder} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Folder Name</label>
                  <input
                    type="text"
                    value={editFolderName}
                    onChange={(e) => setEditFolderName(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    autoFocus
                  />
                </div>

                <div className="flex gap-3 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    className="text-red-600 hover:text-red-700"
                    onClick={() => {
                      handleDeleteFolder(editingFolder.id)
                      setEditingFolder(null)
                    }}
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete
                  </Button>
                  <div className="flex-1" />
                  <Button type="button" variant="outline" onClick={() => setEditingFolder(null)}>
                    Cancel
                  </Button>
                  <Button type="submit">
                    <Pencil className="h-4 w-4 mr-2" />
                    Rename
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Bulk Upload Modal with Drag & Drop */}
      {showBulkUploadModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold">Bulk Upload Documents</h2>
                <button onClick={() => setShowBulkUploadModal(false)} className="text-gray-500 hover:text-gray-700">
                  <X className="h-6 w-6" />
                </button>
              </div>

              {filterUser && filterUser !== 'ALL' ? (
                <>
                  <div className="mb-4 p-3 bg-blue-50 rounded-lg">
                    <p className="text-sm text-blue-700">
                      <strong>Client:</strong> {users.find(u => u.id === filterUser)?.name || users.find(u => u.id === filterUser)?.email}
                    </p>
                    {currentFolderId && (
                      <p className="text-sm text-blue-700">
                        <strong>Current Folder:</strong> {breadcrumbs[breadcrumbs.length - 1]?.name}
                      </p>
                    )}
                  </div>

                  <DocumentUploadDropzone
                    userId={filterUser}
                    folderId={currentFolderId}
                    onUploadComplete={() => {
                      fetchDocuments()
                      fetchFolders()
                    }}
                    onCreateFolder={handleCreateFolderForUpload}
                  />
                </>
              ) : (
                <div className="text-center py-8">
                  <User className="h-16 w-16 mx-auto text-gray-400 mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Select a Client First</h3>
                  <p className="text-gray-600 mb-6">Please select a client from the dropdown filter to upload documents.</p>
                  <select
                    value={filterUser}
                    onChange={(e) => {
                      setFilterUser(e.target.value)
                      setCurrentFolderId(null)
                      setBreadcrumbs([{ id: null, name: 'Root' }])
                    }}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent min-w-[250px]"
                  >
                    <option value="ALL">Choose a client...</option>
                    {users.map(user => (
                      <option key={user.id} value={user.id}>
                        {user.name || user.email}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <div className="mt-6 flex justify-end">
                <Button variant="outline" onClick={() => setShowBulkUploadModal(false)}>
                  Close
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Single Upload Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-lg w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold">Upload Document</h2>
                <button onClick={() => setShowUploadModal(false)} className="text-gray-500 hover:text-gray-700">
                  <X className="h-6 w-6" />
                </button>
              </div>

              {uploadSuccess ? (
                <div className="text-center py-8">
                  <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900">Document Uploaded!</h3>
                  <p className="text-gray-600">The document has been uploaded successfully.</p>
                </div>
              ) : (
                <form onSubmit={handleUpload} className="space-y-4">
                  {uploadError && (
                    <div className="flex items-center gap-2 p-3 bg-red-50 text-red-700 rounded-lg">
                      <AlertCircle className="h-5 w-5" />
                      {uploadError}
                    </div>
                  )}

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Select Client *</label>
                    <select
                      value={uploadForm.userId}
                      onChange={(e) => setUploadForm({ ...uploadForm, userId: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    >
                      <option value="">Choose a client...</option>
                      {users.map(user => (
                        <option key={user.id} value={user.id}>
                          {user.name || user.email} ({user.email})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">File *</label>
                    <div
                      className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors cursor-pointer hover:border-blue-400 ${
                        uploadForm.file ? 'border-green-400 bg-green-50' : 'border-gray-300'
                      }`}
                      onDragOver={(e) => { e.preventDefault(); e.stopPropagation() }}
                      onDragEnter={(e) => { e.preventDefault(); e.stopPropagation() }}
                      onDrop={(e) => {
                        e.preventDefault()
                        e.stopPropagation()
                        const droppedFile = e.dataTransfer.files?.[0]
                        if (droppedFile) {
                          setUploadForm(prev => ({
                            ...prev,
                            file: droppedFile,
                            title: prev.title || droppedFile.name.replace(/\.[^/.]+$/, '')
                          }))
                        }
                      }}
                      onClick={() => fileInputRef.current?.click()}
                    >
                      {uploadForm.file ? (
                        <div className="flex items-center justify-center gap-3">
                          <FileText className="h-8 w-8 text-green-600" />
                          <div className="text-left">
                            <p className="text-sm font-medium text-gray-900">{uploadForm.file.name}</p>
                            <p className="text-xs text-gray-500">{formatFileSize(uploadForm.file.size)}</p>
                          </div>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation()
                              setUploadForm(prev => ({ ...prev, file: null }))
                              if (fileInputRef.current) fileInputRef.current.value = ''
                            }}
                            className="ml-2 p-1 hover:bg-gray-200 rounded"
                          >
                            <X className="h-4 w-4 text-gray-500" />
                          </button>
                        </div>
                      ) : (
                        <>
                          <Upload className="h-10 w-10 mx-auto text-gray-400 mb-2" />
                          <p className="text-sm text-gray-600 mb-1">Drag and drop a file here</p>
                          <p className="text-xs text-gray-400 mb-3">PDF, Word, Excel, Images, Text, CSV (Max 10MB)</p>
                          <div className="flex justify-center gap-2">
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation()
                                fileInputRef.current?.click()
                              }}
                            >
                              <FileText className="h-4 w-4 mr-1" />
                              Select File
                            </Button>
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation()
                                folderInputRef.current?.click()
                              }}
                            >
                              <Folder className="h-4 w-4 mr-1" />
                              Select Folder
                            </Button>
                          </div>
                        </>
                      )}
                    </div>
                    <input
                      ref={fileInputRef}
                      type="file"
                      onChange={handleFileSelect}
                      accept=".pdf,.doc,.docx,.xls,.xlsx,.jpg,.jpeg,.png,.gif,.txt,.csv"
                      className="hidden"
                    />
                    <input
                      ref={folderInputRef}
                      type="file"
                      onChange={handleFileSelect}
                      accept=".pdf,.doc,.docx,.xls,.xlsx,.jpg,.jpeg,.png,.gif,.txt,.csv"
                      className="hidden"
                      {...({ webkitdirectory: '', directory: '' } as any)}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Document Title *</label>
                    <input
                      type="text"
                      value={uploadForm.title}
                      onChange={(e) => setUploadForm({ ...uploadForm, title: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="e.g., ITR FY 2023-24"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Category *</label>
                    <select
                      value={uploadForm.category}
                      onChange={(e) => setUploadForm({ ...uploadForm, category: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    >
                      {CATEGORIES.map(cat => (
                        <option key={cat.value} value={cat.value}>{cat.label}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Financial Year *</label>
                    <select
                      value={uploadForm.financialYear}
                      onChange={(e) => setUploadForm({ ...uploadForm, financialYear: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    >
                      {financialYearOptions.map(fy => (
                        <option key={fy} value={fy}>FY {fy} (April {fy.split('-')[0]} - March {parseInt(fy.split('-')[0]) + 1})</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Description (Optional)</label>
                    <textarea
                      value={uploadForm.description}
                      onChange={(e) => setUploadForm({ ...uploadForm, description: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      rows={3}
                      placeholder="Add any notes about this document..."
                    />
                  </div>

                  <div className="flex gap-3 pt-4">
                    <Button type="button" variant="outline" className="flex-1" onClick={() => setShowUploadModal(false)}>
                      Cancel
                    </Button>
                    <Button type="submit" className="flex-1" disabled={uploading}>
                      {uploading ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Uploading...
                        </>
                      ) : (
                        <>
                          <Upload className="h-4 w-4 mr-2" />
                          Upload
                        </>
                      )}
                    </Button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
