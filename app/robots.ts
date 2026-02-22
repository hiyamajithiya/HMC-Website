import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/hmc-club/', '/api/', '/admin/'],
      },
    ],
    sitemap: 'https://www.himanshumajithiya.com/sitemap.xml',
  }
}
