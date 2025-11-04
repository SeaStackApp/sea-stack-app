/** @type {import('next').NextConfig} */
const nextConfig = {
    output: 'standalone',
    transpilePackages: ['@repo/api', '@repo/db'],
    serverExternalPackages: ['ssh2'],
};

export default nextConfig;
