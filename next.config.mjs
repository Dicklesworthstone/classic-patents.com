/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  cleanDistDir: true,
  images: {
    formats: ["image/avif", "image/webp"],
  },
};

export default nextConfig;
