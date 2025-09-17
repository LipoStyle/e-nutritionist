import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  eslint: { ignoreDuringBuilds: true }, // skip ESLint during `next build`

  images: {
    remotePatterns: [
      // Heroku ActiveStorage
      {
        protocol: 'https',
        hostname: 'e-nutritionist-backend-0404ce3393a8.herokuapp.com',
        port: '',
        pathname: '/rails/active_storage/**',
      },
      // Unsplash (optional)
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
        pathname: '/**',
      },
      // S3 bucket (virtual-hosted style)
      {
        protocol: 'https',
        hostname: 'enutritionist-assets.s3.eu-north-1.amazonaws.com',
        port: '',
        pathname: '/recipes/**',
      },
      // If you ever use path-style URLs, uncomment this:
      // {
      //   protocol: 'https',
      //   hostname: 's3.eu-north-1.amazonaws.com',
      //   port: '',
      //   pathname: '/enutritionist-assets/recipes/**',
      // },
    ],
  },

  async redirects() {
    return [
      {
        source: '/:lang/admin-dashboard',
        destination: '/:lang/admin',
        permanent: false,
      },
    ]
  },
}

export default nextConfig
