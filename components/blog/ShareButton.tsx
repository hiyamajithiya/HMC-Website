'use client'

import { useState } from 'react'
import { Share2, Check, Copy, Facebook, Twitter, Linkedin, Mail } from 'lucide-react'

interface ShareButtonProps {
  title: string
  url?: string
}

export function ShareButton({ title, url }: ShareButtonProps) {
  const [showDropdown, setShowDropdown] = useState(false)
  const [copied, setCopied] = useState(false)

  const shareUrl = url || (typeof window !== 'undefined' ? window.location.href : '')

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (error) {
      console.error('Failed to copy:', error)
    }
  }

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: title,
          url: shareUrl,
        })
      } catch (error) {
        // User cancelled or error
        console.error('Share failed:', error)
      }
    } else {
      setShowDropdown(!showDropdown)
    }
  }

  const shareLinks = [
    {
      name: 'WhatsApp',
      icon: (
        <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
        </svg>
      ),
      url: `https://wa.me/?text=${encodeURIComponent(title + ' ' + shareUrl)}`,
      color: 'hover:bg-green-50 hover:text-green-600',
    },
    {
      name: 'Twitter',
      icon: <Twitter className="h-4 w-4" />,
      url: `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(shareUrl)}`,
      color: 'hover:bg-blue-50 hover:text-blue-500',
    },
    {
      name: 'Facebook',
      icon: <Facebook className="h-4 w-4" />,
      url: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`,
      color: 'hover:bg-blue-50 hover:text-blue-600',
    },
    {
      name: 'LinkedIn',
      icon: <Linkedin className="h-4 w-4" />,
      url: `https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(shareUrl)}&title=${encodeURIComponent(title)}`,
      color: 'hover:bg-blue-50 hover:text-blue-700',
    },
    {
      name: 'Email',
      icon: <Mail className="h-4 w-4" />,
      url: `mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent('Check out this article: ' + shareUrl)}`,
      color: 'hover:bg-gray-50 hover:text-gray-600',
    },
  ]

  return (
    <div className="relative">
      <button
        onClick={handleNativeShare}
        className="flex items-center text-text-muted hover:text-primary transition-colors"
      >
        <Share2 className="h-4 w-4 mr-2" />
        Share
      </button>

      {showDropdown && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-40"
            onClick={() => setShowDropdown(false)}
          />

          {/* Dropdown */}
          <div className="absolute right-0 bottom-full mb-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
            {shareLinks.map((link) => (
              <a
                key={link.name}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className={`flex items-center gap-3 px-4 py-2 text-sm text-gray-700 ${link.color} transition-colors`}
                onClick={() => setShowDropdown(false)}
              >
                {link.icon}
                {link.name}
              </a>
            ))}

            <div className="border-t border-gray-100 mt-2 pt-2">
              <button
                onClick={handleCopyLink}
                className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 w-full transition-colors"
              >
                {copied ? (
                  <>
                    <Check className="h-4 w-4 text-green-500" />
                    <span className="text-green-600">Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="h-4 w-4" />
                    Copy Link
                  </>
                )}
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
