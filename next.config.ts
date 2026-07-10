import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // อนุญาตให้ IP นี้เข้าถึงระบบ Dev ได้ (พิมพ์ IP ที่ขึ้นใน Error ลงไป)
  allowedDevOrigins: ['192.168.1.42'],
};

export default nextConfig;