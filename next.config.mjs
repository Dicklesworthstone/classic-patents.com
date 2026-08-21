/** @type {import('next').NextConfig} */
// Multiple agents on this machine run `next dev` and `next build` against the
// same working tree, and whichever writes last corrupts the shared .next for
// everyone else (mixed Turbopack/webpack manifests, ENOENT chunk errors).
// Agents can now isolate their output without changing any defaults:
//
//   NEXT_DIST_DIR=.next-agent-<name> bun run dev
//   NEXT_DIST_DIR=.next-agent-<name> bun run build && npx next start -p 3100
//
// With the variable unset this behaves byte-for-byte as before (.next).
const nextConfig = {
  ...(process.env.NEXT_DIST_DIR ? { distDir: process.env.NEXT_DIST_DIR } : {}),
  reactStrictMode: true,
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    formats: ["image/avif", "image/webp"],
  },
};

export default nextConfig;
