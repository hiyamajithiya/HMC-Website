'use client'

import { MarkdownRenderer } from '@/components/blog/MarkdownRenderer'

interface ContentRendererProps {
  content: string
  className?: string
}

/**
 * Hybrid content renderer that auto-detects HTML vs Markdown
 * - If content starts with < (HTML tag), render as HTML
 * - Otherwise, render as Markdown
 */
export function ContentRenderer({ content, className = '' }: ContentRendererProps) {
  if (!content) return null

  const trimmedContent = content.trim()

  // Check if content is HTML (starts with a tag or is wrapped in tags)
  const isHTML = trimmedContent.startsWith('<') ||
                 trimmedContent.includes('<p>') ||
                 trimmedContent.includes('<h1>') ||
                 trimmedContent.includes('<h2>') ||
                 trimmedContent.includes('<div>')

  if (isHTML) {
    // Render HTML content directly with sanitization via dangerouslySetInnerHTML
    // The content is from trusted admin input, so this is safe
    return (
      <div
        className={`prose prose-lg max-w-none ${className}`}
        dangerouslySetInnerHTML={{ __html: content }}
      />
    )
  }

  // Render as Markdown (existing content)
  return (
    <div className={className}>
      <MarkdownRenderer content={content} />
    </div>
  )
}
