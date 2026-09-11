/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  async rewrites() {
    return [
      // تقديم موقع HTML الثابت على الصفحة الرئيسية
      { source: '/', destination: '/index.html' },
    ]
  },
}

export default nextConfig
