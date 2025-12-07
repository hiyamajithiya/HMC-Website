import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://www.himanshumajithiya.com'

  // Static pages
  const staticPages = [
    '',
    '/about',
    '/contact',
    '/book-appointment',
    '/faq',
    '/services',
    '/services/income-tax',
    '/services/company-audit',
    '/services/ffmc-compliance',
    '/services/ai-automation',
    '/services/gst-services',
    '/services/other-services',
    '/resources',
    '/resources/blog',
    '/resources/calculators',
    '/resources/calculators/income-tax',
    '/resources/calculators/gst',
    '/resources/calculators/gst-composition',
    '/resources/calculators/gst-rcm',
    '/resources/calculators/gst-tcs',
    '/resources/calculators/gst-interest',
    '/resources/calculators/tds',
    '/resources/calculators/emi',
    '/resources/calculators/capital-gains',
    '/resources/calculators/advance-tax',
    '/resources/compliance-calendar',
    '/resources/downloads',
    '/resources/useful-links',
    '/tools',
    '/privacy-policy',
    '/terms-of-use',
    '/disclaimer',
    '/cookie-policy',
  ]

  return staticPages.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: route === '' ? 'weekly' : route.includes('calculator') ? 'monthly' : 'monthly',
    priority: route === '' ? 1.0 : route.includes('services') ? 0.9 : route.includes('calculator') ? 0.8 : 0.7,
  }))
}
