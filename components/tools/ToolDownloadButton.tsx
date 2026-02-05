'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Download } from 'lucide-react'
import { DownloadModal } from './DownloadModal'

interface ToolDownloadButtonProps {
  toolId: string
  toolName: string
  hasDownloadUrl: boolean
  variant?: 'default' | 'compact'
}

export function ToolDownloadButton({ toolId, toolName, hasDownloadUrl, variant = 'default' }: ToolDownloadButtonProps) {
  const [isModalOpen, setIsModalOpen] = useState(false)

  if (!hasDownloadUrl) {
    return null
  }

  return (
    <>
      <Button
        className={variant === 'compact'
          ? "w-full bg-primary hover:bg-primary-light text-white"
          : "w-full bg-primary hover:bg-primary-light text-white"
        }
        size={variant === 'compact' ? 'default' : 'lg'}
        onClick={() => setIsModalOpen(true)}
      >
        <Download className="h-4 w-4 mr-2" />
        Download
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
