"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Users,
  CheckCircle,
  Clock,
  Search,
  Filter,
  Trash2,
  Download,
  Mail,
  Phone,
  Building,
  Calendar,
  FileDown,
} from "lucide-react"

interface LeadSource {
  id: string
  name: string
  slug: string
}

interface DownloadLead {
  id: string
  name: string
  email: string
  phone: string | null
  company: string | null
  verified: boolean
  downloadedAt: string | null
  createdAt: string
  tool: {
    id: string
    name: string
    slug: string
  } | null
  article: {
    id: string
    title: string
    slug: string
  } | null
}

interface Stats {
  total: number
  verified: number
  pending: number
}

export default function AdminLeadsPage() {
  const [leads, setLeads] = useState<DownloadLead[]>([])
  const [stats, setStats] = useState<Stats>({ total: 0, verified: 0, pending: 0 })
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatus, setFilterStatus] = useState<string>("all")
  const [filterTool, setFilterTool] = useState<string>("all")

  // Get unique sources (tools + articles) for filter
  const getLeadSource = (lead: DownloadLead): LeadSource | null => {
    if (lead.tool) return { id: lead.tool.id, name: lead.tool.name, slug: lead.tool.slug }
    if (lead.article) return { id: lead.article.id, name: lead.article.title, slug: lead.article.slug }
    return null
  }

  const uniqueSources = Array.from(
    new Map(
      leads
        .map((lead) => getLeadSource(lead))
        .filter((s): s is LeadSource => s !== null)
        .map((s) => [s.id, s])
    ).values()
  )

  useEffect(() => {
    fetchLeads()
  }, [])

  const fetchLeads = async () => {
    try {
      const response = await fetch("/api/admin/leads")
      if (response.ok) {
        const data = await response.json()
        setLeads(data.leads)
        setStats(data.stats)
      }
    } catch (error) {
      console.error("Failed to fetch leads:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this lead?")) return

    try {
      const response = await fetch(`/api/admin/leads?id=${id}`, {
        method: "DELETE",
      })

      if (response.ok) {
        fetchLeads()
      } else {
        alert("Failed to delete lead")
      }
    } catch (error) {
      console.error("Failed to delete lead:", error)
      alert("Failed to delete lead")
    }
  }

  const exportToCSV = () => {
    const headers = ["Name", "Email", "Phone", "Company", "Source", "Status", "Downloaded At", "Created At"]
    const rows = filteredLeads.map((lead) => {
      const source = getLeadSource(lead)
      return [
        lead.name,
        lead.email,
        lead.phone || "",
        lead.company || "",
        source?.name || "Unknown",
        lead.verified ? "Verified" : "Pending",
        lead.downloadedAt ? new Date(lead.downloadedAt).toLocaleString() : "",
        new Date(lead.createdAt).toLocaleString(),
      ]
    })

    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers.join(","), ...rows.map((row) => row.map((cell) => `"${cell}"`).join(","))].join("\n")

    const link = document.createElement("a")
    link.setAttribute("href", encodeURI(csvContent))
    link.setAttribute("download", `download-leads-${new Date().toISOString().split("T")[0]}.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const filteredLeads = leads.filter((lead) => {
    const source = getLeadSource(lead)
    const matchesSearch =
      lead.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.company?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      source?.name.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus =
      filterStatus === "all" ||
      (filterStatus === "verified" && lead.verified) ||
      (filterStatus === "pending" && !lead.verified)

    const matchesSource = filterTool === "all" || source?.id === filterTool

    return matchesSearch && matchesStatus && matchesSource
  })

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
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
          <h1 className="text-2xl font-bold text-gray-900">Download Leads</h1>
          <p className="text-gray-600">View users who downloaded tools & articles</p>
        </div>
        <Button onClick={exportToCSV} variant="outline" className="gap-2">
          <FileDown className="h-4 w-4" />
          Export CSV
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Leads</p>
                <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
              </div>
              <div className="h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Verified (Downloaded)</p>
                <p className="text-2xl font-bold text-green-600">{stats.verified}</p>
              </div>
              <div className="h-12 w-12 bg-green-100 rounded-full flex items-center justify-center">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Pending</p>
                <p className="text-2xl font-bold text-yellow-600">{stats.pending}</p>
              </div>
              <div className="h-12 w-12 bg-yellow-100 rounded-full flex items-center justify-center">
                <Clock className="h-6 w-6 text-yellow-600" />
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
                placeholder="Search by name, email, company, or tool..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-gray-400" />
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-3 py-2 border rounded-lg text-sm"
              >
                <option value="all">All Status</option>
                <option value="verified">Verified</option>
                <option value="pending">Pending</option>
              </select>
              <select
                value={filterTool}
                onChange={(e) => setFilterTool(e.target.value)}
                className="px-3 py-2 border rounded-lg text-sm"
              >
                <option value="all">All Sources</option>
                {uniqueSources.map((source) => (
                  <option key={source.id} value={source.id}>
                    {source.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Leads Table */}
      <Card>
        <CardHeader>
          <CardTitle>Leads ({filteredLeads.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {filteredLeads.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <Users className="h-12 w-12 mx-auto mb-4 opacity-30" />
              <p>No leads found</p>
              <p className="text-sm">Leads will appear here when users download tools</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b text-left text-sm text-gray-600">
                    <th className="pb-3 font-medium">User</th>
                    <th className="pb-3 font-medium">Contact</th>
                    <th className="pb-3 font-medium">Source</th>
                    <th className="pb-3 font-medium">Status</th>
                    <th className="pb-3 font-medium">Date</th>
                    <th className="pb-3 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredLeads.map((lead) => (
                    <tr key={lead.id} className="border-b last:border-b-0 hover:bg-gray-50">
                      <td className="py-4">
                        <div>
                          <p className="font-medium text-gray-900">{lead.name}</p>
                          {lead.company && (
                            <p className="text-sm text-gray-500 flex items-center gap-1">
                              <Building className="h-3 w-3" />
                              {lead.company}
                            </p>
                          )}
                        </div>
                      </td>
                      <td className="py-4">
                        <div className="space-y-1">
                          <p className="text-sm flex items-center gap-1 text-gray-700">
                            <Mail className="h-3 w-3 text-gray-400" />
                            <a href={`mailto:${lead.email}`} className="hover:text-primary">
                              {lead.email}
                            </a>
                          </p>
                          {lead.phone && (
                            <p className="text-sm flex items-center gap-1 text-gray-700">
                              <Phone className="h-3 w-3 text-gray-400" />
                              <a href={`tel:${lead.phone}`} className="hover:text-primary">
                                {lead.phone}
                              </a>
                            </p>
                          )}
                        </div>
                      </td>
                      <td className="py-4">
                        <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${lead.article ? 'bg-blue-100 text-blue-700' : 'bg-purple-100 text-purple-700'}`}>
                          <Download className="h-3 w-3" />
                          {lead.tool?.name || lead.article?.title || "Unknown"}
                        </span>
                      </td>
                      <td className="py-4">
                        {lead.verified ? (
                          <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
                            <CheckCircle className="h-3 w-3" />
                            Downloaded
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-700">
                            <Clock className="h-3 w-3" />
                            Pending
                          </span>
                        )}
                      </td>
                      <td className="py-4">
                        <div className="text-sm text-gray-600">
                          <p className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {formatDate(lead.createdAt)}
                          </p>
                          {lead.downloadedAt && (
                            <p className="text-xs text-gray-400 mt-1">
                              Downloaded: {formatDate(lead.downloadedAt)}
                            </p>
                          )}
                        </div>
                      </td>
                      <td className="py-4">
                        <button
                          onClick={() => handleDelete(lead.id)}
                          className="p-2 hover:bg-red-50 rounded-lg transition-colors"
                          title="Delete"
                        >
                          <Trash2 className="h-4 w-4 text-red-600" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
