

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Transpile leaflet for compatibility
  transpilePackages: ["leaflet", "react-leaflet"],
  eslint: { ignoreDuringBuilds: true },
  typescript: { ignoreBuildErrors: true },
};

export default nextConfig;
