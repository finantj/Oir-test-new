// OIR_STATIC=1 produces a fully static export of the public site (display/exhibit
// mode only) that can be uploaded to any plain web host, e.g. shared cPanel hosting.
// The default build produces a self-contained Node server with the live admin.
const isStatic = process.env.OIR_STATIC === '1';

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: isStatic ? 'export' : 'standalone',
  trailingSlash: isStatic,
  env: {
    NEXT_PUBLIC_OIR_STATIC: isStatic ? '1' : '',
  },
};
module.exports = nextConfig;
