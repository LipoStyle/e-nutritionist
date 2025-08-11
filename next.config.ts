import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
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
