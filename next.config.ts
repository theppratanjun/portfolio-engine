const nextConfig = {
  // ยังคงเก็บบังคับผ่าน TypeScript ไว้สำหรับตอน Build ขึ้น Vercel
  typescript: {
    ignoreBuildErrors: true,
  },
  
  // ปลดคอมเมนต์ออก เพื่ออนุญาตให้มือถือหรือคอมเครื่องอื่นในบ้านเข้าดูเว็บตอนรัน Dev ได้
  allowedDevOrigins: [
    "beaver-witness-ebooks-costa.trycloudflare.com",
    "localhost",
    "127.0.0.1",
    "192.168.1.42",
  ],
};

export default nextConfig;