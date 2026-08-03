/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    /*
      Next.js 16 nõuab lubatud kvaliteediväärtuste loetlemist.
      Kasutame 90 — fotod on portreed ja peavad püsima teravad.
    */
    qualities: [90],
    // Kaasaegsed vormingud: väiksem fail sama kvaliteedi juures
    formats: ["image/avif", "image/webp"],
  },
};

export default nextConfig;
