import { Metadata } from 'next'
import { SITE_INFO } from './constants'

interface PageMetadata {
  title: string
  description: string
  path?: string
  image?: string
  type?: 'website' | 'article'
  publishedTime?: string
  modifiedTime?: string
}

export function generateMetadata({
  title,
  description,
  path = '',
  image = '/og-image.png',
  type = 'website',
  publishedTime,
  modifiedTime,
}: PageMetadata): Metadata {
  const url = `https://${SITE_INFO.domain}${path}`
  const fullTitle = title.includes(SITE_INFO.name) ? title : `${title} | ${SITE_INFO.name}`

  return {
    title: fullTitle,
    description,
    keywords: [
      'Chartered Accountant Ahmedabad',
      'CA firm Thaltej',
      'Income Tax Consultant Gujarat',
      'Company Audit Ahmedabad',
      'FFMC Compliance',
      'GST Services Ahmedabad',
      'AI Automation CA',
    ],
    authors: [{ name: SITE_INFO.proprietor }],
    creator: SITE_INFO.name,
    publisher: SITE_INFO.name,
    metadataBase: new URL(`https://${SITE_INFO.domain}`),
    alternates: {
      canonical: url,
    },
    openGraph: {
      type,
      locale: 'en_IN',
      url,
      title: fullTitle,
      description,
      siteName: SITE_INFO.name,
      images: [
        {
          url: image,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
      ...(publishedTime && { publishedTime }),
      ...(modifiedTime && { modifiedTime }),
    },
    twitter: {
      card: 'summary_large_image',
      title: fullTitle,
      description,
      images: [image],
      creator: '@himanshumajithiya',
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
    verification: {
      google: 'google-site-verification-code', // To be replaced with actual code
    },
  }
}
