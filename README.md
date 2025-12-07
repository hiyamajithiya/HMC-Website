# Himanshu Majithiya & Co. - Website

Professional website for Himanshu Majithiya & Co., a Chartered Accountant firm in Ahmedabad, Gujarat, India.

## Project Overview

This is a Next.js 14 website built with TypeScript, Tailwind CSS, and Prisma ORM. The website is designed to be ICAI-compliant and follows all professional guidelines for CA firm websites in India.

## Features

- ✅ ICAI-compliant design and content
- ✅ Responsive design (Mobile, Tablet, Desktop)
- ✅ Professional color scheme (Navy Blue & Gold)
- ✅ Modern UI with shadcn/ui components
- ✅ Services showcase
- ✅ Tax calculators
- ✅ Compliance calendar
- ✅ Automation tools
- ✅ Blog/Articles section
- ✅ Client portal
- ✅ Contact forms
- ✅ WhatsApp integration
- ✅ Cookie consent
- ✅ SEO optimized
- ✅ Multi-language support (English & Gujarati)

## Technology Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui
- **Database**: PostgreSQL
- **ORM**: Prisma
- **Authentication**: NextAuth.js v5
- **Forms**: React Hook Form + Zod
- **Email**: Nodemailer
- **Icons**: Lucide React
- **Animation**: Framer Motion
- **Date Handling**: date-fns

## Getting Started

### Prerequisites

- Node.js 18.x or higher
- npm or yarn
- PostgreSQL database

### Installation

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Set up environment variables**

   Copy `.env.example` to `.env.local` and update the values:
   ```bash
   cp .env.example .env.local
   ```

   Edit `.env.local` with your configuration:
   ```env
   DATABASE_URL="postgresql://username:password@localhost:5432/himanshumajithiya_db"
   NEXTAUTH_SECRET="your-secure-random-string"
   NEXTAUTH_URL="http://localhost:3000"
   SMTP_HOST="smtp.example.com"
   SMTP_PORT="587"
   SMTP_USER="info@himanshumajithiya.com"
   SMTP_PASS="your-email-password"
   ```

3. **Set up the database**

   Generate Prisma client and run migrations:
   ```bash
   npx prisma generate
   npx prisma migrate dev
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**

   Visit [http://localhost:3000](http://localhost:3000)

## Project Structure

```
himanshumajithiya-website/
├── app/                          # Next.js app directory
│   ├── (main)/                   # Main website routes
│   │   ├── about/
│   │   ├── services/
│   │   ├── resources/
│   │   ├── tools/
│   │   ├── contact/
│   │   └── book-appointment/
│   ├── (client-portal)/          # Client portal routes
│   ├── (legal)/                  # Legal pages
│   ├── (gujarati)/               # Gujarati pages
│   ├── api/                      # API routes
│   ├── globals.css               # Global styles
│   └── layout.tsx                # Root layout
├── components/                   # React components
│   ├── ui/                       # shadcn/ui components
│   ├── layout/                   # Layout components
│   ├── common/                   # Common components
│   ├── forms/                    # Form components
│   └── home/                     # Homepage components
├── lib/                          # Utility libraries
│   ├── prisma.ts                 # Prisma client
│   ├── utils.ts                  # Utility functions
│   └── constants.ts              # Constants
├── prisma/                       # Prisma schema
│   └── schema.prisma
├── public/                       # Static assets
├── types/                        # TypeScript types
└── content/                      # Content files
    └── blog/                     # MDX blog posts
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint
- `npx prisma studio` - Open Prisma Studio (database GUI)
- `npx prisma migrate dev` - Create and apply migrations
- `npx prisma generate` - Generate Prisma Client

## ICAI Compliance Guidelines

This website is designed in compliance with ICAI Website Guidelines dated 14-10-2020. The following principles are followed:

### Permitted Content:
- ✅ Firm name, address, contact details
- ✅ Year of establishment
- ✅ Professional qualifications
- ✅ Services offered (factual listing)
- ✅ Educational articles and resources
- ✅ Social media links
- ✅ Links to regulatory bodies (ICAI, Income Tax, GST, RBI, MCA)

### Prohibited Content:
- ❌ Client names or logos
- ❌ Testimonials with names
- ❌ Awards, certifications, rankings
- ❌ Promotional language (best, leading, top)
- ❌ Professional fees
- ❌ Event galleries
- ❌ "Why Choose Us" sections

### Content Guidelines:
- Use factual, objective language only
- No superlatives or comparative statements
- Services listed as "Areas of Practice"
- Pull-model website (users request information)
- No auto-playing content or pop-ups

## Next Steps

The basic structure is in place. Continue building:

1. **Create Service Pages** - Individual pages for each service
2. **Build About Page** - Professional profile and firm information
3. **Legal Pages** - Privacy Policy, Terms of Use, Disclaimer, Cookie Policy
4. **Resources Section** - Blog, Calculators, Compliance Calendar
5. **Contact & Appointment** - Contact forms and booking system
6. **Client Portal** - Authentication and document management
7. **Tools Section** - Automation tools showcase

## Contact

**Himanshu Majithiya & Co.**
Chartered Accountants

- **Email**: info@himanshumajithiya.com
- **Phone**: +91 98795 03465
- **Address**: 507-508, Maple Trade Centre, SAL Hospital Road, Near Surdhara Circle, Thaltej, Ahmedabad - 380059, Gujarat, India

## Legal

- ICAI Membership: 126185
- Firm Registration No.: 128134W
- Established: 2007

## License

© 2024 Himanshu Majithiya & Co. All rights reserved.

Website designed in compliance with ICAI Guidelines.
