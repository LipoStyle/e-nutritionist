import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  eslint: { ignoreDuringBuilds: true }, // skip ESLint during `next build`
  async redirects() {
    return [
      { source: '/:lang/admin-dashboard', destination: '/:lang/admin', permanent: false },
    ]
  },
}

export default nextConfig
