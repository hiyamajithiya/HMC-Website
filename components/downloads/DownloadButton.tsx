'use client'

import { Button } from "@/components/ui/button"
import { Download } from "lucide-react"

interface DownloadButtonProps {
  id: string
  filePath: string
}

export function DownloadButton({ id, filePath }: DownloadButtonProps) {
  const handleDownload = async () => {
    // Track download
    try {
      await fetch(`/api/downloads/${id}`, { method: 'POST' })
    } catch (error) {
      console.error('Failed to track download:', error)
    }
  }

  return (
    <a href={filePath} download onClick={handleDownload}>
      <Button size="sm" variant="outline" className="text-primary border-primary/50 hover:bg-primary/10">
        <Download className="h-4 w-4 mr-2" />
        Download
      </Button>
    </a>
  )
}
