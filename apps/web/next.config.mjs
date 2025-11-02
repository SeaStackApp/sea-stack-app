/** @type {import('next').NextConfig} */
const nextConfig = {
    transpilePackages: ['@repo/api', '@repo/db'],
    serverExternalPackages: ['ssh2'],
};

export default nextConfig;
