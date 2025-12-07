import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/client-portal/', '/api/', '/admin/'],
      },
    ],
    sitemap: 'https://www.himanshumajithiya.com/sitemap.xml',
  }
}
