'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Download } from 'lucide-react'
import { DownloadModal } from './DownloadModal'

interface DownloadButtonProps {
  toolId: string
  toolName: string
  hasDownloadUrl: boolean
}

export function DownloadButton({ toolId, toolName, hasDownloadUrl }: DownloadButtonProps) {
  const [isModalOpen, setIsModalOpen] = useState(false)

  if (!hasDownloadUrl) {
    return null
  }

  return (
    <>
      <Button
        className="w-full bg-primary hover:bg-primary-light text-white"
        size="lg"
        onClick={() => setIsModalOpen(true)}
      >
        <Download className="h-5 w-5 mr-2" />
        Download Now
      </Button>

      <DownloadModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        toolId={toolId}
        toolName={toolName}
      />
    </>
  )
}
