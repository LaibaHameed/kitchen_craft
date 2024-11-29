/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'img.spoonacular.com',
                pathname: '/**',
            },
        ],
    },
};

export default nextConfig;
