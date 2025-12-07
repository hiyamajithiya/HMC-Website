// Navigation Types
export interface NavItem {
  label: string
  href: string
  submenu?: NavItem[]
}

// Service Types
export interface Service {
  id: string
  title: string
  slug: string
  icon: string
  description: string
}

// Blog Types
export interface BlogPost {
  id: string
  title: string
  titleGu?: string
  slug: string
  excerpt: string
  excerptGu?: string
  content: string
  contentGu?: string
  coverImage?: string
  category: string
  tags: string[]
  isPublished: boolean
  publishedAt?: Date
  viewCount: number
  createdAt: Date
  updatedAt: Date
}

// Tool Types
export interface Tool {
  id: string
  name: string
  slug: string
  description: string
  shortDesc: string
  version: string
  category: string
  toolType: string
  price?: number
  licenseType: string
  licenseDuration?: number
  downloadUrl?: string
  requirements?: string
  setupGuide?: string
  features: string[]
  screenshots: string[]
  downloadCount: number
  isActive: boolean
  createdAt: Date
  updatedAt: Date
}

// Contact Form Types
export interface ContactFormData {
  name: string
  email: string
  phone?: string
  service?: string
  message: string
}

// Appointment Form Types
export interface AppointmentFormData {
  name: string
  email: string
  phone: string
  service: string
  date: Date
  timeSlot: string
  message?: string
}

// Newsletter Types
export interface NewsletterFormData {
  email: string
  name?: string
}

// Calculator Types
export interface TaxCalculationInput {
  income: number
  regime: 'old' | 'new'
  age: number
  deductions?: {
    section80C?: number
    section80D?: number
    section80G?: number
    hra?: number
    homeLoan?: number
  }
}

export interface TaxCalculationResult {
  totalIncome: number
  taxableIncome: number
  totalDeductions: number
  taxLiability: number
  surcharge: number
  cess: number
  totalTax: number
  regime: string
}

// Compliance Calendar Types
export interface ComplianceEvent {
  id: string
  title: string
  titleGu?: string
  description?: string
  dueDate: Date
  category: string
  frequency: string
  isRecurring: boolean
}

// Document Types
export interface Document {
  id: string
  title: string
  description?: string
  fileName: string
  filePath: string
  fileSize: number
  fileType: string
  category: string
  uploadedBy: string
  createdAt: Date
  updatedAt: Date
}

// User Types
export interface User {
  id: string
  email: string
  name?: string
  phone?: string
  role: 'ADMIN' | 'CLIENT'
  isActive: boolean
  emailVerified?: Date
  image?: string
  createdAt: Date
  updatedAt: Date
}

// API Response Types
export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

// Pagination Types
export interface PaginationParams {
  page: number
  limit: number
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
}

export interface PaginatedResponse<T> {
  data: T[]
  pagination: {
    total: number
    page: number
    limit: number
    totalPages: number
    hasNext: boolean
    hasPrev: boolean
  }
}

// SEO Types
export interface SEOProps {
  title: string
  description: string
  keywords?: string[]
  canonical?: string
  ogImage?: string
  ogType?: string
  twitterCard?: string
}

// Schema.org Types
export interface SchemaOrgBreadcrumb {
  '@context': string
  '@type': string
  itemListElement: Array<{
    '@type': string
    position: number
    name: string
    item: string
  }>
}

export interface SchemaOrgOrganization {
  '@context': string
  '@type': string
  name: string
  url: string
  logo?: string
  description?: string
  address?: {
    '@type': string
    streetAddress: string
    addressLocality: string
    addressRegion: string
    postalCode: string
    addressCountry: string
  }
  contactPoint?: {
    '@type': string
    telephone: string
    contactType: string
    email: string
  }
  sameAs?: string[]
}

export interface SchemaOrgArticle {
  '@context': string
  '@type': string
  headline: string
  description: string
  image?: string
  datePublished: string
  dateModified: string
  author: {
    '@type': string
    name: string
  }
  publisher: {
    '@type': string
    name: string
    logo?: {
      '@type': string
      url: string
    }
  }
}
