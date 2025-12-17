'use client'

import { useState, useEffect, useRef } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  FileText, Download, Eye, Upload, Trash2, Search,
  X, CheckCircle, AlertCircle, Loader2, Calendar, Folder,
  Filter, Grid, List, ArrowUpDown, FileIcon, MoreVertical
} from 'lucide-react'
import { format } from 'date-fns'

interface Document {
  id: string
  title: string
  description: string | null
  fileName: string
  filePath: string
  fileSize: number
  fileType: string
  category: string
  uploadedBy: string
  createdAt: string
}

interface ClientDocumentsContentProps {
  userId: string
}

const CATEGORIES = [
  { value: 'TAX_RETURNS', label: 'Tax Returns', color: 'blue', bgColor: 'bg-blue-50', textColor: 'text-blue-700', borderColor: 'border-blue-200' },
  { value: 'AUDIT_REPORTS', label: 'Audit Reports', color: 'purple', bgColor: 'bg-purple-50', textColor: 'text-purple-700', borderColor: 'border-purple-200' },
  { value: 'GST_RETURNS', label: 'GST Returns', color: 'green', bgColor: 'bg-green-50', textColor: 'text-green-700', borderColor: 'border-green-200' },
  { value: 'COMPLIANCE', label: 'Compliance', color: 'orange', bgColor: 'bg-orange-50', textColor: 'text-orange-700', borderColor: 'border-orange-200' },
  { value: 'INVOICES', label: 'Invoices', color: 'yellow', bgColor: 'bg-yellow-50', textColor: 'text-yellow-700', borderColor: 'border-yellow-200' },
  { value: 'OTHER', label: 'Other', color: 'gray', bgColor: 'bg-slate-50', textColor: 'text-slate-700', borderColor: 'border-slate-200' },
]

export default function ClientDocumentsContent({ userId }: ClientDocumentsContentProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [documents, setDocuments] = useState<Document[]>([])
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [showUploadModal, setShowUploadModal] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterCategory, setFilterCategory] = useState('ALL')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('list')

  // Upload form state
  const [uploadForm, setUploadForm] = useState({
    title: '',
    description: '',
    category: 'OTHER',
    file: null as File | null,
  })
  const [uploadError, setUploadError] = useState('')
  const [uploadSuccess, setUploadSuccess] = useState(false)

  useEffect(() => {
    fetchDocuments()
  }, [userId])

  const fetchDocuments = async () => {
    try {
      const response = await fetch('/api/documents')
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

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const nameWithoutExt = file.name.replace(/\.[^/.]+$/, '')
      setUploadForm(prev => ({
        ...prev,
        file,
        title: prev.title || nameWithoutExt
      }))
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

    setUploading(true)

    try {
      const formData = new FormData()
      formData.append('file', uploadForm.file)
      formData.append('title', uploadForm.title)
      formData.append('description', uploadForm.description)
      formData.append('category', uploadForm.category)

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

  const handleDelete = async (id: string, uploadedBy: string) => {
    if (uploadedBy !== 'CLIENT') {
      alert('You can only delete documents you uploaded')
      return
    }
    if (!confirm('Are you sure you want to delete this document?')) return

    try {
      const response = await fetch(`/api/documents/${id}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        setDocuments(documents.filter(d => d.id !== id))
      } else {
        const data = await response.json()
        alert(data.error || 'Failed to delete document')
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

  const getCategoryStyle = (category: string) => {
    const cat = CATEGORIES.find(c => c.value === category)
    return cat || CATEGORIES[CATEGORIES.length - 1]
  }

  // Filter documents
  const filteredDocuments = documents.filter(doc => {
    const matchesSearch = doc.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.fileName.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = filterCategory === 'ALL' || doc.category === filterCategory
    return matchesSearch && matchesCategory
  })

  // Category counts
  const categoryCounts = CATEGORIES.map(cat => ({
    ...cat,
    count: documents.filter(d => d.category === cat.value).length
  }))

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <Loader2 className="h-10 w-10 animate-spin text-primary mx-auto mb-4" />
          <p className="text-slate-500">Loading documents...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">My Documents</h1>
          <p className="text-slate-500 mt-1">Access, download, and upload your documents securely</p>
        </div>
        <Button onClick={() => setShowUploadModal(true)} className="bg-primary hover:bg-primary-dark text-white">
          <Upload className="h-4 w-4 mr-2" />
          Upload Document
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {categoryCounts.map(cat => (
          <button
            key={cat.value}
            onClick={() => setFilterCategory(filterCategory === cat.value ? 'ALL' : cat.value)}
            className={`p-4 rounded-xl border transition-all text-left ${
              filterCategory === cat.value
                ? `${cat.bgColor} ${cat.borderColor} border-2 shadow-sm`
                : 'bg-white border-slate-200 hover:border-slate-300 hover:shadow-sm'
            }`}
          >
            <p className={`text-2xl font-bold ${filterCategory === cat.value ? cat.textColor : 'text-slate-900'}`}>
              {cat.count}
            </p>
            <p className={`text-xs font-medium ${filterCategory === cat.value ? cat.textColor : 'text-slate-500'}`}>
              {cat.label}
            </p>
          </button>
        ))}
      </div>

      {/* Search and Filters */}
      <Card className="border-0 shadow-sm">
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search documents by name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm"
              />
            </div>
            <div className="flex gap-3">
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="px-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm bg-white"
              >
                <option value="ALL">All Categories</option>
                {CATEGORIES.map(cat => (
                  <option key={cat.value} value={cat.value}>{cat.label}</option>
                ))}
              </select>
              <div className="hidden sm:flex border border-slate-200 rounded-xl overflow-hidden">
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2.5 ${viewMode === 'list' ? 'bg-primary text-white' : 'bg-white text-slate-500 hover:bg-slate-50'}`}
                >
                  <List className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2.5 ${viewMode === 'grid' ? 'bg-primary text-white' : 'bg-white text-slate-500 hover:bg-slate-50'}`}
                >
                  <Grid className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Documents Display */}
      {filteredDocuments.length === 0 ? (
        <Card className="border-0 shadow-sm">
          <CardContent className="py-16">
            <div className="text-center">
              <div className="w-20 h-20 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-6">
                <FileText className="h-10 w-10 text-slate-400" />
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-2">No documents found</h3>
              <p className="text-slate-500 mb-6 max-w-md mx-auto">
                {searchTerm || filterCategory !== 'ALL'
                  ? 'Try adjusting your search or filter criteria'
                  : 'Your documents will appear here. Upload documents for our team to review.'}
              </p>
              <Button onClick={() => setShowUploadModal(true)} className="bg-primary hover:bg-primary-dark text-white">
                <Upload className="h-4 w-4 mr-2" />
                Upload Your First Document
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : viewMode === 'list' ? (
        <Card className="border-0 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                    Document
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                    Category
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                    Size
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-4 text-right text-xs font-semibold text-slate-600 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-slate-100">
                {filteredDocuments.map((doc) => {
                  const catStyle = getCategoryStyle(doc.category)
                  return (
                    <tr key={doc.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-4">
                          <div className={`w-10 h-10 rounded-lg ${catStyle.bgColor} flex items-center justify-center`}>
                            <FileText className={`h-5 w-5 ${catStyle.textColor}`} />
                          </div>
                          <div className="min-w-0">
                            <p className="text-sm font-medium text-slate-900 truncate max-w-[200px]">{doc.title}</p>
                            <p className="text-xs text-slate-500 truncate max-w-[200px]">{doc.fileName}</p>
                            {doc.uploadedBy === 'CLIENT' && (
                              <span className="inline-flex items-center text-xs text-blue-600 mt-0.5">
                                <Upload className="h-3 w-3 mr-1" />
                                Uploaded by you
                              </span>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex px-3 py-1 text-xs font-medium rounded-full ${catStyle.bgColor} ${catStyle.textColor}`}>
                          {catStyle.label}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-500">
                        {formatFileSize(doc.fileSize)}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center text-sm text-slate-500">
                          <Calendar className="h-4 w-4 mr-2 text-slate-400" />
                          {format(new Date(doc.createdAt), 'dd MMM yyyy')}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex justify-end gap-2">
                          <a
                            href={`/api/documents/${doc.id}/download?view=true`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-2 rounded-lg hover:bg-slate-100 text-slate-500 hover:text-primary transition-colors"
                            title="View"
                          >
                            <Eye className="h-4 w-4" />
                          </a>
                          <a
                            href={`/api/documents/${doc.id}/download`}
                            className="p-2 rounded-lg hover:bg-slate-100 text-slate-500 hover:text-green-600 transition-colors"
                            title="Download"
                          >
                            <Download className="h-4 w-4" />
                          </a>
                          {doc.uploadedBy === 'CLIENT' && (
                            <button
                              onClick={() => handleDelete(doc.id, doc.uploadedBy)}
                              className="p-2 rounded-lg hover:bg-red-50 text-slate-500 hover:text-red-600 transition-colors"
                              title="Delete"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </Card>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredDocuments.map((doc) => {
            const catStyle = getCategoryStyle(doc.category)
            return (
              <Card key={doc.id} className="border-0 shadow-sm hover:shadow-md transition-all group">
                <CardContent className="p-5">
                  <div className="flex items-start justify-between gap-3">
                    <div className={`w-12 h-12 rounded-xl ${catStyle.bgColor} flex items-center justify-center flex-shrink-0`}>
                      <FileText className={`h-6 w-6 ${catStyle.textColor}`} />
                    </div>
                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <a
                        href={`/api/documents/${doc.id}/download?view=true`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-primary transition-colors"
                      >
                        <Eye className="h-4 w-4" />
                      </a>
                      <a
                        href={`/api/documents/${doc.id}/download`}
                        className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-green-600 transition-colors"
                      >
                        <Download className="h-4 w-4" />
                      </a>
                      {doc.uploadedBy === 'CLIENT' && (
                        <button
                          onClick={() => handleDelete(doc.id, doc.uploadedBy)}
                          className="p-1.5 rounded-lg hover:bg-red-50 text-slate-400 hover:text-red-600 transition-colors"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  </div>
                  <div className="mt-4">
                    <h3 className="font-medium text-slate-900 truncate" title={doc.title}>{doc.title}</h3>
                    <p className="text-xs text-slate-500 truncate mt-0.5">{doc.fileName}</p>
                  </div>
                  <div className="flex items-center justify-between mt-4 pt-4 border-t border-slate-100">
                    <span className={`inline-flex px-2.5 py-1 text-xs font-medium rounded-full ${catStyle.bgColor} ${catStyle.textColor}`}>
                      {catStyle.label}
                    </span>
                    <span className="text-xs text-slate-400">{format(new Date(doc.createdAt), 'dd MMM')}</span>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}

      {/* Upload Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h2 className="text-xl font-bold text-slate-900">Upload Document</h2>
                  <p className="text-sm text-slate-500 mt-1">Add a new document to your account</p>
                </div>
                <button
                  onClick={() => setShowUploadModal(false)}
                  className="p-2 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {uploadSuccess ? (
                <div className="text-center py-8">
                  <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
                    <CheckCircle className="h-8 w-8 text-green-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-slate-900">Upload Successful!</h3>
                  <p className="text-slate-500 mt-2">Your document has been uploaded successfully.</p>
                </div>
              ) : (
                <form onSubmit={handleUpload} className="space-y-5">
                  {uploadError && (
                    <div className="flex items-center gap-3 p-4 bg-red-50 text-red-700 rounded-xl">
                      <AlertCircle className="h-5 w-5 flex-shrink-0" />
                      <p className="text-sm">{uploadError}</p>
                    </div>
                  )}

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Select File <span className="text-red-500">*</span>
                    </label>
                    <div className="border-2 border-dashed border-slate-200 rounded-xl p-6 text-center hover:border-primary/50 transition-colors">
                      <input
                        ref={fileInputRef}
                        type="file"
                        onChange={handleFileSelect}
                        accept=".pdf,.doc,.docx,.xls,.xlsx,.jpg,.jpeg,.png,.gif,.txt,.csv"
                        className="hidden"
                        id="file-upload"
                      />
                      <label htmlFor="file-upload" className="cursor-pointer">
                        <Upload className="h-8 w-8 text-slate-400 mx-auto mb-3" />
                        <p className="text-sm font-medium text-slate-700">
                          {uploadForm.file ? uploadForm.file.name : 'Click to select a file'}
                        </p>
                        <p className="text-xs text-slate-500 mt-1">
                          PDF, Word, Excel, Images (Max 10MB)
                        </p>
                      </label>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Document Title <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={uploadForm.title}
                      onChange={(e) => setUploadForm({ ...uploadForm, title: e.target.value })}
                      className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm"
                      placeholder="e.g., Bank Statement March 2024"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Category <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={uploadForm.category}
                      onChange={(e) => setUploadForm({ ...uploadForm, category: e.target.value })}
                      className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary bg-white text-sm"
                      required
                    >
                      {CATEGORIES.map(cat => (
                        <option key={cat.value} value={cat.value}>{cat.label}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Description (Optional)
                    </label>
                    <textarea
                      value={uploadForm.description}
                      onChange={(e) => setUploadForm({ ...uploadForm, description: e.target.value })}
                      className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm"
                      rows={3}
                      placeholder="Add any notes about this document..."
                    />
                  </div>

                  <div className="flex gap-3 pt-2">
                    <Button
                      type="button"
                      variant="outline"
                      className="flex-1"
                      onClick={() => setShowUploadModal(false)}
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      className="flex-1 bg-primary hover:bg-primary-dark text-white"
                      disabled={uploading}
                    >
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
