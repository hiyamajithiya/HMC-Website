'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Download } from 'lucide-react'
import { DownloadModal } from '@/components/tools/DownloadModal'

interface ResourceDownloadButtonProps {
  downloadId: string
  downloadName: string
  variant?: 'default' | 'compact'
}

export function ResourceDownloadButton({ downloadId, downloadName, variant = 'default' }: ResourceDownloadButtonProps) {
  const [isModalOpen, setIsModalOpen] = useState(false)

  return (
    <>
      <Button
        className={variant === 'compact'
          ? 'bg-primary hover:bg-primary-light text-white'
          : 'bg-primary hover:bg-primary-light text-white'
        }
        size={variant === 'compact' ? 'sm' : 'default'}
        onClick={() => setIsModalOpen(true)}
      >
        <Download className="h-4 w-4 mr-2" />
        Download
      </Button>

      <DownloadModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        mode="resource"
        resourceId={downloadId}
        resourceName={downloadName}
      />
    </>
  )
}
