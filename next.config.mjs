/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
      {
        protocol: 'http',
        hostname: 'localhost',
      },
    ],
  },
  // Rewrites to serve uploaded files via API routes
  // This handles both new paths and legacy paths
  async rewrites() {
    return [
      // Rewrite /uploads/* to /api/uploads/* (for persistent storage)
      {
        source: '/uploads/:path*',
        destination: '/api/uploads/:path*',
      },
      // Rewrite /downloads/* to /api/download/* (for tool downloads)
      {
        source: '/downloads/:path*',
        destination: '/api/download/:path*',
      },
    ]
  },
};

export default nextConfig;
