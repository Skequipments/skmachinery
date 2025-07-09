/** @type {import('next').NextConfig} */
const nextConfig = {
  // Production optimizations
  trailingSlash: true,
  poweredByHeader: false,
  compress: true,

  // Fix cross-origin issues
  experimental: {
    // Optimize for large data responses
    largePageDataBytes: 128 * 1000, // 128KB
  },

  // Handle static generation
  typescript: {
    ignoreBuildErrors: false,
  },
  eslint: {
    ignoreDuringBuilds: false,
  },

  // Allow cross-origin requests in development
  async rewrites() {
    return [];
  },

  async headers() {
    return [
      {
        source: '/api/:path*',
        headers: [
          { key: 'Access-Control-Allow-Origin', value: '*' },
          { key: 'Access-Control-Allow-Methods', value: 'GET, POST, PUT, DELETE, OPTIONS' },
          { key: 'Access-Control-Allow-Headers', value: 'Content-Type, Authorization' },
        ],
      },
    ];
  },

  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        pathname: '/rohitkrsah/**',
      },
      {
        protocol: 'https',
        hostname: '*.unsplash.com',
        pathname: '**',
      }
    ]
  },

  // Environment configuration
  env: {
    BASE_URL: process.env.NODE_ENV === 'production' 
      ? process.env.REPL_SLUG ? `https://${process.env.REPL_SLUG}.${process.env.REPL_OWNER}.repl.co` : process.env.BASE_URL || 'https://your-domain.com'
      : 'http://localhost:3000',
    MONGODB_URI: process.env.MONGODB_URI
  },


};

export default nextConfig;