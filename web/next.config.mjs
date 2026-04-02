/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        pathname: '/**', 
      },
      // 🌟 লোকালহোস্ট ব্যাকএন্ডের জন্য হোয়াইটলিস্ট
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '5000',
        pathname: '/**',
      },
      // 🌟 প্রোডাকশনে তোর ব্যাকএন্ডের ডোমেইন থাকলে সেটাও অ্যাড করে রাখিস
      // {
      //   protocol: 'https',
      //   hostname: 'api.yourdomain.com',
      //   pathname: '/**',
      // },
    ],
  },
};

export default nextConfig;