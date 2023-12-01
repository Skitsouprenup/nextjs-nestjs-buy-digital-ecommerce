/** @type {import('next').NextConfig} */

const nextConfig = {
  swcMinify: true,
  async rewrites() {
    return [
      {
        source: '/api/v1/:path*',
        /*backend proxy */
        destination: 'http://localhost:3000/api/v1/:path*'
      }
    ]
  }
}

module.exports = nextConfig
