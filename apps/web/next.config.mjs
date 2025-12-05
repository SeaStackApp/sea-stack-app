/** @type {import('next').NextConfig} */
const nextConfig = {
    output: 'standalone',
    transpilePackages: ['@repo/api', '@repo/db'],
    serverExternalPackages: ['ssh2', 'pino', 'pino-pretty', '@dotenvx/dotenvx'],
};

export default nextConfig;
