import { Metadata } from "next"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import {
  Download,
  FileText,
  FileSpreadsheet,
  File,
  BookOpen,
  ClipboardList,
  Wrench,
  FolderOpen,
  ArrowRight,
} from "lucide-react"
import { prisma } from "@/lib/prisma"
import { ResourceDownloadButton } from "@/components/downloads/ResourceDownloadButton"

export const metadata: Metadata = {
  title: "Downloads",
  description:
    "Download useful forms, guides, templates, and automation tools for tax and compliance.",
}

export const dynamic = "force-dynamic"

const categoryConfig: Record<
  string,
  { label: string; icon: any; color: string; bg: string }
> = {
  GUIDES_TEMPLATES: {
    label: "Guides & Templates",
    icon: BookOpen,
    color: "text-orange-600",
    bg: "bg-orange-500/10",
  },
  FORMS: {
    label: "Forms",
    icon: FileText,
    color: "text-blue-600",
    bg: "bg-blue-500/10",
  },
  CHECKLISTS: {
    label: "Checklists",
    icon: ClipboardList,
    color: "text-green-600",
    bg: "bg-green-500/10",
  },
  TOOLS: {
    label: "Tools",
    icon: Wrench,
    color: "text-purple-600",
    bg: "bg-purple-500/10",
  },
  OTHER: {
    label: "Other Resources",
    icon: FolderOpen,
    color: "text-gray-600",
    bg: "bg-gray-500/10",
  },
}

async function getDownloads() {
  try {
    const downloads = await prisma.download.findMany({
      where: { isActive: true },
      orderBy: [
        { category: "asc" },
        { sortOrder: "asc" },
        { createdAt: "desc" },
      ],
    })
    return downloads
  } catch (error) {
    console.error("Failed to fetch downloads:", error)
    return []
  }
}

function getFileIcon(fileType: string) {
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

function formatFileSize(bytes: number) {
  if (bytes < 1024) return bytes + " B"
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB"
  return (bytes / (1024 * 1024)).toFixed(1) + " MB"
}

export default async function DownloadsPage() {
  const downloads = await getDownloads()
  const hasDownloads = downloads.length > 0

  return (
    <div>
      {/* Hero Section */}
      <section className="bg-primary text-white py-16">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 bg-white/10 text-white/90 text-sm font-medium px-4 py-1.5 rounded-full mb-4">
              <Download className="h-4 w-4" />
              Free Resources & Templates
            </div>
            <h1 className="text-4xl md:text-5xl font-heading font-bold mb-4">
              Downloads
            </h1>
            <p className="text-xl text-white/90 max-w-2xl mx-auto">
              Free forms, guides, templates, and tools to simplify your tax and
              compliance work
            </p>
          </div>
        </div>
      </section>

      {/* Downloads Grid */}
      <section className="section-padding">
        <div className="container-custom">
          <div className="max-w-6xl mx-auto">
            {!hasDownloads ? (
              <div className="text-center py-16">
                <FolderOpen className="h-16 w-16 mx-auto text-gray-300 mb-4" />
                <h3 className="text-xl font-semibold text-gray-600 mb-2">
                  No Downloads Available
                </h3>
                <p className="text-gray-500">
                  Check back soon for useful resources and templates.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {downloads.map((item) => {
                  const config =
                    categoryConfig[item.category] || categoryConfig.OTHER
                  const CategoryIcon = config.icon

                  return (
                    <div
                      key={item.id}
                      className="group bg-white rounded-xl border border-gray-200 hover:border-primary/30 hover:shadow-lg transition-all duration-300 overflow-hidden flex flex-col"
                    >
                      {/* Card Header */}
                      <div className="p-6 pb-3">
                        {/* Category + File Type */}
                        <div className="flex items-center justify-between mb-4">
                          <span
                            className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full ${config.bg} ${config.color}`}
                          >
                            <CategoryIcon className="h-3 w-3" />
                            {config.label}
                          </span>
                          <span className="inline-flex items-center gap-1 text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                            {getFileIcon(item.fileType)}
                            {item.fileType}
                          </span>
                        </div>

                        {/* Title */}
                        <h3 className="text-lg font-heading font-bold text-primary group-hover:text-primary-light transition-colors mb-2">
                          {item.title}
                        </h3>

                        {/* Description */}
                        {item.description && (
                          <p className="text-sm text-text-secondary leading-relaxed line-clamp-3">
                            {item.description}
                          </p>
                        )}
                      </div>

                      {/* Card Footer */}
                      <div className="mt-auto p-6 pt-3">
                        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                          <div className="flex items-center gap-3 text-xs text-gray-500">
                            <span>{formatFileSize(item.fileSize)}</span>
                            {item.downloadCount > 0 && (
                              <>
                                <span>·</span>
                                <span>
                                  {item.downloadCount.toLocaleString()} downloads
                                </span>
                              </>
                            )}
                          </div>
                          <ResourceDownloadButton
                            downloadId={item.id}
                            downloadName={item.title}
                            variant="compact"
                          />
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Tools Section CTA */}
      <section className="section-padding bg-bg-secondary">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-heading font-bold text-primary mb-4">
              Looking for Automation Tools?
            </h2>
            <p className="text-text-secondary text-lg mb-8">
              Explore our professional automation tools for tax, GST, and
              compliance workflows
            </p>
            <Link href="/tools">
              <Button
                size="lg"
                className="bg-primary hover:bg-primary-light text-white"
              >
                Explore Tools
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Disclaimer */}
      <section className="section-padding">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto">
            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-6 rounded-r">
              <h3 className="font-semibold text-yellow-800 mb-2">
                Important Note
              </h3>
              <p className="text-sm text-yellow-700 mb-2">
                All downloadable resources are provided for informational
                purposes. Please ensure compliance with the latest regulations
                and consult with a qualified professional before use.
              </p>
              <p className="text-sm text-yellow-700">
                For the latest official forms, please visit respective government
                portals (Income Tax, GST, MCA, etc.).
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section-padding bg-primary text-white">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-heading font-bold mb-4">
              Need Custom Solutions?
            </h2>
            <p className="text-xl text-white/90 mb-8">
              We can create custom automation tools tailored to your specific
              requirements
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/services/ai-automation">
                <button className="bg-secondary hover:bg-secondary-dark text-white font-semibold py-3 px-8 rounded-lg transition-colors">
                  Automation Services
                </button>
              </Link>
              <Link href="/contact">
                <button className="bg-white/10 hover:bg-white/20 border-2 border-white/30 text-white font-semibold py-3 px-8 rounded-lg transition-colors">
                  Contact Us
                </button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
