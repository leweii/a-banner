/** @type {import('next').NextConfig} */
const nextConfig = {
  // Ensure figlet fonts are bundled with serverless functions
  experimental: {
    serverComponentsExternalPackages: [],
  },
  // Prevent figlet from being externalized
  webpack: (config, { isServer }) => {
    if (isServer) {
      // Ensure figlet importable-fonts are bundled, not externalized
      config.externals = config.externals || [];
      if (Array.isArray(config.externals)) {
        config.externals = config.externals.filter(
          (external) => {
            if (typeof external === 'string') {
              return !external.includes('figlet');
            }
            return true;
          }
        );
      }
    }
    return config;
  },
};

export default nextConfig;
