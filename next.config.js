/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['gaming-cdn.com', 'r2.fivemanage.com', 'youtube.com', 'example.com', 'stripe.com', 'https://m.stripe.network'], // Dominios permitidos
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=31536000; includeSubDomains; preload',
          },
        ],
      },
    ];
  },
};

module.exports = nextConfig;