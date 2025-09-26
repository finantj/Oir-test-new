/** @type {import('next').NextConfig} */
const nextConfig = {
  // keep it simple; add tweaks later
  output: 'standalone',        // good for Vercel & containers
  experimental: { typedRoutes: false }
};

export default nextConfig;
