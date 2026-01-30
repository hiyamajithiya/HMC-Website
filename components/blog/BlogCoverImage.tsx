'use client'

import { useState } from 'react'

interface BlogCoverImageProps {
  src: string
  alt: string
}

export function BlogCoverImage({ src, alt }: BlogCoverImageProps) {
  const [imageError, setImageError] = useState(false)

  if (imageError) {
    return null // Don't show anything if image fails to load
  }

  return (
    <div className="mb-8 rounded-xl overflow-hidden">
      <img
        src={src}
        alt={alt}
        className="w-full h-auto"
        onError={() => setImageError(true)}
      />
    </div>
  )
}
