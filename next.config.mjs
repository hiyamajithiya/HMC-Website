/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enable standalone output for Docker
  output: 'standalone',

  // Disable ESLint during build
  eslint: {
    ignoreDuringBuilds: true,
  },

  // Image optimization - restrict to specific domains only
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
      },
      {
        protocol: 'https',
        hostname: 'himanshumajithiya.com',
      },
      {
        protocol: 'https',
        hostname: 'www.himanshumajithiya.com',
      },
    ],
    formats: ['image/avif', 'image/webp'],
  },

  // Webpack configuration for better Windows compatibility
  webpack: (config, { dev }) => {
    if (dev) {
      config.watchOptions = {
        poll: 1000,
        aggregateTimeout: 300,
      }
    }
    return config
  },

  // Security headers
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on',
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin',
          },
        ],
      },
    ]
  },

  // Rewrites to serve uploaded files via API routes
  async rewrites() {
    return [
      {
        source: '/uploads/:path*',
        destination: '/api/uploads/:path*',
      },
      {
        source: '/downloads/:path*',
        destination: '/api/download/:path*',
      },
    ]
  },
};

export default nextConfig;
