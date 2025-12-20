"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Plus,
  Upload,
  Trash2,
  Edit,
  Download,
  FileText,
  FileSpreadsheet,
  File,
  Eye,
  EyeOff,
  X,
  Search,
  Filter,
} from "lucide-react"

interface DownloadItem {
  id: string
  title: string
  description: string | null
  fileName: string
  filePath: string
  fileSize: number
  fileType: string
  category: string
  sortOrder: number
  isActive: boolean
  downloadCount: number
  createdAt: string
  updatedAt: string
}

const categoryLabels: Record<string, string> = {
  GUIDES_TEMPLATES: "Guides & Templates",
  FORMS: "Forms",
  CHECKLISTS: "Checklists",
  TOOLS: "Tools",
  OTHER: "Other",
}

const categoryColors: Record<string, string> = {
  GUIDES_TEMPLATES: "bg-orange-100 text-orange-700",
  FORMS: "bg-blue-100 text-blue-700",
  CHECKLISTS: "bg-green-100 text-green-700",
  TOOLS: "bg-purple-100 text-purple-700",
  OTHER: "bg-gray-100 text-gray-700",
}

export default function AdminDownloadsPage() {
  const [downloads, setDownloads] = useState<DownloadItem[]>([])
  const [loading, setLoading] = useState(true)
  const [showAddModal, setShowAddModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [editingDownload, setEditingDownload] = useState<DownloadItem | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterCategory, setFilterCategory] = useState<string>("all")
  const [uploading, setUploading] = useState(false)

  // Form state
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "GUIDES_TEMPLATES",
    sortOrder: 0,
    isActive: true,
  })
  const [selectedFile, setSelectedFile] = useState<File | null>(null)

  useEffect(() => {
    fetchDownloads()
  }, [])

  const fetchDownloads = async () => {
    try {
      const response = await fetch("/api/admin/downloads")
      if (response.ok) {
        const data = await response.json()
        setDownloads(data)
      }
    } catch (error) {
      console.error("Failed to fetch downloads:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleAddDownload = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedFile) {
      alert("Please select a file to upload")
      return
    }

    setUploading(true)
    try {
      const formDataToSend = new FormData()
      formDataToSend.append("file", selectedFile)
      formDataToSend.append("title", formData.title)
      formDataToSend.append("description", formData.description)
      formDataToSend.append("category", formData.category)
      formDataToSend.append("sortOrder", formData.sortOrder.toString())

      const response = await fetch("/api/admin/downloads", {
        method: "POST",
        body: formDataToSend,
      })

      if (response.ok) {
        fetchDownloads()
        setShowAddModal(false)
        resetForm()
      } else {
        const error = await response.json()
        alert(error.error || "Failed to add download")
      }
    } catch (error) {
      console.error("Failed to add download:", error)
      alert("Failed to add download")
    } finally {
      setUploading(false)
    }
  }

  const handleEditDownload = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingDownload) return

    setUploading(true)
    try {
      const formDataToSend = new FormData()
      if (selectedFile) {
        formDataToSend.append("file", selectedFile)
      }
      formDataToSend.append("title", formData.title)
      formDataToSend.append("description", formData.description)
      formDataToSend.append("category", formData.category)
      formDataToSend.append("sortOrder", formData.sortOrder.toString())
      formDataToSend.append("isActive", formData.isActive.toString())

      const response = await fetch(`/api/admin/downloads/${editingDownload.id}`, {
        method: "PATCH",
        body: formDataToSend,
      })

      if (response.ok) {
        fetchDownloads()
        setShowEditModal(false)
        setEditingDownload(null)
        resetForm()
      } else {
        const error = await response.json()
        alert(error.error || "Failed to update download")
      }
    } catch (error) {
      console.error("Failed to update download:", error)
      alert("Failed to update download")
    } finally {
      setUploading(false)
    }
  }

  const handleDeleteDownload = async (id: string) => {
    if (!confirm("Are you sure you want to delete this download?")) return

    try {
      const response = await fetch(`/api/admin/downloads/${id}`, {
        method: "DELETE",
      })

      if (response.ok) {
        fetchDownloads()
      } else {
        alert("Failed to delete download")
      }
    } catch (error) {
      console.error("Failed to delete download:", error)
      alert("Failed to delete download")
    }
  }

  const toggleActive = async (download: DownloadItem) => {
    try {
      const response = await fetch(`/api/admin/downloads/${download.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive: !download.isActive }),
      })

      if (response.ok) {
        fetchDownloads()
      }
    } catch (error) {
      console.error("Failed to toggle status:", error)
    }
  }

  const openEditModal = (download: DownloadItem) => {
    setEditingDownload(download)
    setFormData({
      title: download.title,
      description: download.description || "",
      category: download.category,
      sortOrder: download.sortOrder,
      isActive: download.isActive,
    })
    setSelectedFile(null)
    setShowEditModal(true)
  }

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      category: "GUIDES_TEMPLATES",
      sortOrder: 0,
      isActive: true,
    })
    setSelectedFile(null)
  }

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + " B"
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB"
    return (bytes / (1024 * 1024)).toFixed(1) + " MB"
  }

  const getFileIcon = (fileType: string) => {
    switch (fileType) {
      case "PDF":
        return <FileText className="h-5 w-5 text-red-500" />
      case "Excel":
        return <FileSpreadsheet className="h-5 w-5 text-green-500" />
      case "Word":
        return <FileText className="h-5 w-5 text-blue-500" />
      default:
        return <File className="h-5 w-5 text-gray-500" />
    }
  }

  const filteredDownloads = downloads.filter((download) => {
    const matchesSearch =
      download.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      download.description?.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = filterCategory === "all" || download.category === filterCategory
    return matchesSearch && matchesCategory
  })

  // Stats
  const stats = {
    total: downloads.length,
    active: downloads.filter((d) => d.isActive).length,
    totalDownloads: downloads.reduce((sum, d) => sum + d.downloadCount, 0),
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Downloads Management</h1>
          <p className="text-gray-600">Manage downloadable resources for your website</p>
        </div>
        <Button
          onClick={() => {
            resetForm()
            setShowAddModal(true)
          }}
          className="bg-primary hover:bg-primary-light"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Download
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Files</p>
                <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
              </div>
              <div className="h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center">
                <File className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active</p>
                <p className="text-2xl font-bold text-green-600">{stats.active}</p>
              </div>
              <div className="h-12 w-12 bg-green-100 rounded-full flex items-center justify-center">
                <Eye className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Downloads</p>
                <p className="text-2xl font-bold text-purple-600">{stats.totalDownloads}</p>
              </div>
              <div className="h-12 w-12 bg-purple-100 rounded-full flex items-center justify-center">
                <Download className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search downloads..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-gray-400" />
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="px-3 py-2 border rounded-lg text-sm"
              >
                <option value="all">All Categories</option>
                {Object.entries(categoryLabels).map(([key, label]) => (
                  <option key={key} value={key}>
                    {label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Downloads Table */}
      <Card>
        <CardHeader>
          <CardTitle>Downloads ({filteredDownloads.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {filteredDownloads.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <File className="h-12 w-12 mx-auto mb-4 opacity-30" />
              <p>No downloads found</p>
              <p className="text-sm">Add your first download to get started</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b text-left text-sm text-gray-600">
                    <th className="pb-3 font-medium">File</th>
                    <th className="pb-3 font-medium">Category</th>
                    <th className="pb-3 font-medium">Size</th>
                    <th className="pb-3 font-medium">Downloads</th>
                    <th className="pb-3 font-medium">Status</th>
                    <th className="pb-3 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredDownloads.map((download) => (
                    <tr key={download.id} className="border-b last:border-b-0">
                      <td className="py-4">
                        <div className="flex items-center gap-3">
                          {getFileIcon(download.fileType)}
                          <div>
                            <p className="font-medium text-gray-900">{download.title}</p>
                            <p className="text-sm text-gray-500">{download.fileName}</p>
                            {download.description && (
                              <p className="text-xs text-gray-400 mt-1 max-w-xs truncate">
                                {download.description}
                              </p>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="py-4">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${
                            categoryColors[download.category]
                          }`}
                        >
                          {categoryLabels[download.category]}
                        </span>
                      </td>
                      <td className="py-4 text-sm text-gray-600">
                        {formatFileSize(download.fileSize)}
                      </td>
                      <td className="py-4 text-sm text-gray-600">{download.downloadCount}</td>
                      <td className="py-4">
                        <button
                          onClick={() => toggleActive(download)}
                          className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                            download.isActive
                              ? "bg-green-100 text-green-700"
                              : "bg-gray-100 text-gray-600"
                          }`}
                        >
                          {download.isActive ? (
                            <>
                              <Eye className="h-3 w-3" /> Active
                            </>
                          ) : (
                            <>
                              <EyeOff className="h-3 w-3" /> Hidden
                            </>
                          )}
                        </button>
                      </td>
                      <td className="py-4">
                        <div className="flex items-center gap-2">
                          <a
                            href={download.filePath}
                            target="_blank"
                            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                            title="Preview"
                          >
                            <Eye className="h-4 w-4 text-gray-600" />
                          </a>
                          <button
                            onClick={() => openEditModal(download)}
                            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                            title="Edit"
                          >
                            <Edit className="h-4 w-4 text-blue-600" />
                          </button>
                          <button
                            onClick={() => handleDeleteDownload(download.id)}
                            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                            title="Delete"
                          >
                            <Trash2 className="h-4 w-4 text-red-600" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Add Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-4 border-b">
              <h2 className="text-lg font-semibold">Add New Download</h2>
              <button onClick={() => setShowAddModal(false)}>
                <X className="h-5 w-5 text-gray-500" />
              </button>
            </div>
            <form onSubmit={handleAddDownload} className="p-4 space-y-4">
              <div>
                <Label htmlFor="file">File *</Label>
                <div className="mt-1 border-2 border-dashed rounded-lg p-4 text-center">
                  <input
                    type="file"
                    id="file"
                    accept=".pdf,.xls,.xlsx,.doc,.docx,.txt,.zip"
                    onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                    className="hidden"
                  />
                  <label htmlFor="file" className="cursor-pointer">
                    <Upload className="h-8 w-8 mx-auto text-gray-400 mb-2" />
                    {selectedFile ? (
                      <p className="text-sm text-primary font-medium">{selectedFile.name}</p>
                    ) : (
                      <p className="text-sm text-gray-500">Click to upload PDF, Excel, Word, or ZIP</p>
                    )}
                  </label>
                </div>
              </div>

              <div>
                <Label htmlFor="title">Title *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g., Tax Planning Guide"
                  required
                />
              </div>

              <div>
                <Label htmlFor="description">Description</Label>
                <textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Brief description of the download"
                  className="w-full px-3 py-2 border rounded-lg text-sm min-h-[80px]"
                />
              </div>

              <div>
                <Label htmlFor="category">Category *</Label>
                <select
                  id="category"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg text-sm"
                >
                  {Object.entries(categoryLabels).map(([key, label]) => (
                    <option key={key} value={key}>
                      {label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <Label htmlFor="sortOrder">Sort Order</Label>
                <Input
                  id="sortOrder"
                  type="number"
                  value={formData.sortOrder}
                  onChange={(e) => setFormData({ ...formData, sortOrder: parseInt(e.target.value) || 0 })}
                  placeholder="0"
                />
                <p className="text-xs text-gray-500 mt-1">Lower numbers appear first</p>
              </div>

              <div className="flex gap-3 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={uploading}
                  className="flex-1 bg-primary hover:bg-primary-light"
                >
                  {uploading ? "Uploading..." : "Add Download"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {showEditModal && editingDownload && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-4 border-b">
              <h2 className="text-lg font-semibold">Edit Download</h2>
              <button onClick={() => setShowEditModal(false)}>
                <X className="h-5 w-5 text-gray-500" />
              </button>
            </div>
            <form onSubmit={handleEditDownload} className="p-4 space-y-4">
              <div>
                <Label htmlFor="editFile">Replace File (optional)</Label>
                <div className="mt-1 border-2 border-dashed rounded-lg p-4 text-center">
                  <input
                    type="file"
                    id="editFile"
                    accept=".pdf,.xls,.xlsx,.doc,.docx,.txt,.zip"
                    onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                    className="hidden"
                  />
                  <label htmlFor="editFile" className="cursor-pointer">
                    <Upload className="h-8 w-8 mx-auto text-gray-400 mb-2" />
                    {selectedFile ? (
                      <p className="text-sm text-primary font-medium">{selectedFile.name}</p>
                    ) : (
                      <p className="text-sm text-gray-500">
                        Current: {editingDownload.fileName}
                        <br />
                        <span className="text-xs">Click to replace</span>
                      </p>
                    )}
                  </label>
                </div>
              </div>

              <div>
                <Label htmlFor="editTitle">Title *</Label>
                <Input
                  id="editTitle"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                />
              </div>

              <div>
                <Label htmlFor="editDescription">Description</Label>
                <textarea
                  id="editDescription"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg text-sm min-h-[80px]"
                />
              </div>

              <div>
                <Label htmlFor="editCategory">Category *</Label>
                <select
                  id="editCategory"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg text-sm"
                >
                  {Object.entries(categoryLabels).map(([key, label]) => (
                    <option key={key} value={key}>
                      {label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <Label htmlFor="editSortOrder">Sort Order</Label>
                <Input
                  id="editSortOrder"
                  type="number"
                  value={formData.sortOrder}
                  onChange={(e) => setFormData({ ...formData, sortOrder: parseInt(e.target.value) || 0 })}
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="editIsActive"
                  checked={formData.isActive}
                  onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                  className="rounded"
                />
                <Label htmlFor="editIsActive">Active (visible on website)</Label>
              </div>

              <div className="flex gap-3 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowEditModal(false)}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={uploading}
                  className="flex-1 bg-primary hover:bg-primary-light"
                >
                  {uploading ? "Saving..." : "Save Changes"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
