/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  // Cloudflare Pages静态导出配置
  output: 'export',
  distDir: 'out',
  trailingSlash: true,
}

export default nextConfig
