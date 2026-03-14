import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  async headers() {
    return [
      {
        source: '/(.*)',
        output: 'export', // Tells Next.js to produce a static site
        images: {
          unoptimized: true, // Required because GitHub Pages doesn't support the default Image Optimization
        },
        headers: [
          {
            key: 'Cross-Origin-Embedder-Policy',
            value: 'require-corp',
          },
          {
            key: 'Cross-Origin-Opener-Policy',
            value: 'same-origin',
          },
        ],
      },
    ];
    
  },
};

export default nextConfig;

