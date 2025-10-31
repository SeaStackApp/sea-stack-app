/** @type {import('next').NextConfig} */
const nextConfig = {
    transpilePackages: ['@repo/api', '@repo/db'],
};

export default nextConfig;
