// src/lib/prisma.ts
import { PrismaClient } from '@prisma/client';

const globalForPrisma = global as unknown as { prisma: PrismaClient };

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    log: ['query'], // 📌 ใส่บรรทัดนี้ไว้เพื่อดู Log ตอนรัน (เอาไว้ Debug ตอนทำหลังบ้าน)
  });

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;