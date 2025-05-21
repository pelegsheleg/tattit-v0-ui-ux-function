/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Remove experimental.appDir as it's no longer needed
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    domains: ["hebbkx1anhila5yf.public.blob.vercel-storage.com"],
    unoptimized: true,
  },
  // Redirect any remaining pages API routes to their app counterparts
  async redirects() {
    return [
      {
        source: "/api/:path*",
        has: [
          {
            type: "header",
            key: "x-invoke-path",
            value: "/pages/api/:path*",
          },
        ],
        destination: "/api/:path*",
        permanent: false,
      },
    ]
  },
}

module.exports = nextConfig
