import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  eslint: { ignoreDuringBuilds: true }, // skip ESLint during `next build`

  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'e-nutritionist-backend-0404ce3393a8.herokuapp.com',
        port: '',
        pathname: '/rails/active_storage/**',
      },
      // Optional: if you also pull stock images
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
        pathname: '/**',
      },
    ],
  },

  async redirects() {
    return [
      { source: '/:lang/admin-dashboard', destination: '/:lang/admin', permanent: false },
    ]
  },
}

export default nextConfig
