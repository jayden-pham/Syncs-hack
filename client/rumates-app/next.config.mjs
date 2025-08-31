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

  // ADD THIS SECTION ↓
  async rewrites() {
    return [
      {
        source: "/api/:path*",                  // all API calls from Next.js
        destination: "http://127.0.0.1:5000/:path*", // your Flask backend
      },
    ];
  },
};

export default nextConfig;
