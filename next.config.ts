import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  // Skip ESLint during `next build` (e.g., on Vercel)
  eslint: { ignoreDuringBuilds: true },

  // Uncomment only if you also want to bypass TS build errors
  // typescript: { ignoreBuildErrors: true },

  async redirects() {
    return [
      // Legacy -> new admin path
      { source: '/:lang/admin-dashboard', destination: '/:lang/admin', permanent: false },
    ]
  },
}

export default nextConfig
