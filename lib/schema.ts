import { SITE_INFO } from './constants'

// Organization Schema
export const organizationSchema = {
  '@context': 'https://schema.org',
  '@type': 'AccountingService',
  name: SITE_INFO.name,
  description: SITE_INFO.description,
  url: `https://${SITE_INFO.domain}`,
  telephone: SITE_INFO.phone.primary,
  email: SITE_INFO.email.primary,
  address: {
    '@type': 'PostalAddress',
    streetAddress: `${SITE_INFO.address.line1}, ${SITE_INFO.address.line2}`,
    addressLocality: SITE_INFO.address.city,
    addressRegion: SITE_INFO.address.state,
    postalCode: SITE_INFO.address.pincode,
    addressCountry: 'IN',
  },
  geo: {
    '@type': 'GeoCoordinates',
    latitude: '23.0469',
    longitude: '72.5112',
  },
  foundingDate: SITE_INFO.yearEstablished,
  founder: {
    '@type': 'Person',
    name: SITE_INFO.proprietor,
  },
  sameAs: [
    SITE_INFO.socialMedia.youtube,
    SITE_INFO.socialMedia.linkedin,
    SITE_INFO.socialMedia.facebook,
  ],
}

// Local Business Schema
export const localBusinessSchema = {
  '@context': 'https://schema.org',
  '@type': 'ProfessionalService',
  name: SITE_INFO.name,
  image: `https://${SITE_INFO.domain}/logo.png`,
  '@id': `https://${SITE_INFO.domain}`,
  url: `https://${SITE_INFO.domain}`,
  telephone: SITE_INFO.phone.primary,
  priceRange: '$$',
  address: {
    '@type': 'PostalAddress',
    streetAddress: `${SITE_INFO.address.line1}, ${SITE_INFO.address.line2}`,
    addressLocality: SITE_INFO.address.city,
    addressRegion: SITE_INFO.address.state,
    postalCode: SITE_INFO.address.pincode,
    addressCountry: 'IN',
  },
  geo: {
    '@type': 'GeoCoordinates',
    latitude: '23.0469',
    longitude: '72.5112',
  },
  openingHoursSpecification: {
    '@type': 'OpeningHoursSpecification',
    dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
    opens: '11:00',
    closes: '18:00',
  },
}

// Breadcrumb Schema Generator
export function generateBreadcrumbSchema(items: { name: string; url: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: `https://${SITE_INFO.domain}${item.url}`,
    })),
  }
}

// Service Schema Generator
export function generateServiceSchema(service: {
  name: string
  description: string
  url: string
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    serviceType: service.name,
    description: service.description,
    provider: {
      '@type': 'AccountingService',
      name: SITE_INFO.name,
    },
    areaServed: {
      '@type': 'City',
      name: 'Ahmedabad',
    },
    url: `https://${SITE_INFO.domain}${service.url}`,
  }
}

// FAQ Schema Generator
export function generateFAQSchema(faqs: { question: string; answer: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  }
}

// Article Schema Generator (for blog posts)
export function generateArticleSchema(article: {
  title: string
  description: string
  publishedDate: string
  modifiedDate?: string
  author?: string
  image?: string
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: article.title,
    description: article.description,
    author: {
      '@type': 'Person',
      name: article.author || SITE_INFO.proprietor,
    },
    publisher: {
      '@type': 'Organization',
      name: SITE_INFO.name,
      logo: {
        '@type': 'ImageObject',
        url: `https://${SITE_INFO.domain}/logo.png`,
      },
    },
    datePublished: article.publishedDate,
    dateModified: article.modifiedDate || article.publishedDate,
    image: article.image,
  }
}
