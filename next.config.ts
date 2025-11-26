// next.config.ts
import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "picsum.photos",
      },
    ],
  },
  experimental: {
    serverActions: {
      bodySizeLimit: "5mb",
    },
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  webpack: (config, { isServer }) => {
    // 👉 もともとの「Prisma を外部扱いにする」設定（そのまま残す）
    config.externals = config.externals || [];
    config.externals.push("@prisma/client", ".prisma/client");

    // 👉 サーバー側のバンドル時だけ、#main-entry-point の行き先を教える
    if (isServer) {
      config.resolve = config.resolve || {};
      config.resolve.alias = {
        ...(config.resolve.alias || {}),
        "#main-entry-point": path.resolve(
          process.cwd(),
          "node_modules/.prisma/client/index.js"
        ),
      };
    }

    return config;
  },
};

export default nextConfig;