/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [new URL('https://api.spendy.deevoice.ru/**')],
    },
};

module.exports = nextConfig; 