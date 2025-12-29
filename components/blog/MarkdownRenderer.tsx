'use client'

import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

interface MarkdownRendererProps {
  content: string
}

export function MarkdownRenderer({ content }: MarkdownRendererProps) {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      components={{
        // Headings
        h1: ({ children }) => (
          <h1 className="text-3xl font-bold text-primary mt-8 mb-4 first:mt-0">{children}</h1>
        ),
        h2: ({ children }) => (
          <h2 className="text-2xl font-bold text-primary mt-6 mb-3">{children}</h2>
        ),
        h3: ({ children }) => (
          <h3 className="text-xl font-semibold text-primary mt-5 mb-2">{children}</h3>
        ),
        h4: ({ children }) => (
          <h4 className="text-lg font-semibold text-primary mt-4 mb-2">{children}</h4>
        ),
        h5: ({ children }) => (
          <h5 className="text-base font-semibold text-primary mt-3 mb-1">{children}</h5>
        ),
        h6: ({ children }) => (
          <h6 className="text-sm font-semibold text-primary mt-3 mb-1">{children}</h6>
        ),

        // Paragraphs
        p: ({ children }) => (
          <p className="text-text-secondary leading-relaxed mb-4">{children}</p>
        ),

        // Bold and Italic
        strong: ({ children }) => (
          <strong className="font-bold text-text-primary">{children}</strong>
        ),
        em: ({ children }) => (
          <em className="italic">{children}</em>
        ),

        // Links
        a: ({ href, children }) => (
          <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary hover:text-primary-light underline"
          >
            {children}
          </a>
        ),

        // Lists
        ul: ({ children }) => (
          <ul className="list-disc list-inside mb-4 space-y-2 text-text-secondary">{children}</ul>
        ),
        ol: ({ children }) => (
          <ol className="list-decimal list-inside mb-4 space-y-2 text-text-secondary">{children}</ol>
        ),
        li: ({ children }) => (
          <li className="leading-relaxed">{children}</li>
        ),

        // Blockquotes
        blockquote: ({ children }) => (
          <blockquote className="border-l-4 border-primary pl-4 py-2 my-4 bg-primary/5 italic text-text-secondary">
            {children}
          </blockquote>
        ),

        // Code
        code: ({ className, children }) => {
          const isInline = !className
          if (isInline) {
            return (
              <code className="bg-gray-100 text-primary px-1.5 py-0.5 rounded text-sm font-mono">
                {children}
              </code>
            )
          }
          return (
            <code className="block bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto text-sm font-mono">
              {children}
            </code>
          )
        },
        pre: ({ children }) => (
          <pre className="mb-4 overflow-x-auto">{children}</pre>
        ),

        // Tables
        table: ({ children }) => (
          <div className="overflow-x-auto mb-4">
            <table className="min-w-full border-collapse border border-border-light">
              {children}
            </table>
          </div>
        ),
        thead: ({ children }) => (
          <thead className="bg-primary/10">{children}</thead>
        ),
        tbody: ({ children }) => (
          <tbody>{children}</tbody>
        ),
        tr: ({ children }) => (
          <tr className="border-b border-border-light">{children}</tr>
        ),
        th: ({ children }) => (
          <th className="px-4 py-2 text-left font-semibold text-primary border border-border-light">
            {children}
          </th>
        ),
        td: ({ children }) => (
          <td className="px-4 py-2 text-text-secondary border border-border-light">
            {children}
          </td>
        ),

        // Images
        img: ({ src, alt }) => (
          <img
            src={src}
            alt={alt || ''}
            className="max-w-full h-auto rounded-lg my-4"
          />
        ),

        // Horizontal rule
        hr: () => (
          <hr className="my-8 border-t border-border-light" />
        ),
      }}
    >
      {content}
    </ReactMarkdown>
  )
}
