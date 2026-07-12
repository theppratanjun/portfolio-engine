// src/app/api/auth/logout/route.ts
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { prisma } from '@/lib/prisma';

export async function POST() {
  try {
    const cookieStore = await cookies();
    const sessionToken = cookieStore.get('portfolio_session')?.value;

    if (sessionToken) {
      const session = await prisma.session.findUnique({ where: { sessionToken } });
      if (session) {
        // 📝 บันทึกลง AuditLog ว่าออกจากระบบ
        await prisma.auditLog.create({
          data: { userId: session.userId, action: 'LOGOUT', details: 'User logged out securely' }
        });
        // ทำลาย Session ในฐานข้อมูล
        await prisma.session.delete({ where: { sessionToken } });
      }
    }

    const response = NextResponse.json({ success: true });
    
    // 🔒 สั่งเบราว์เซอร์ให้ "ทำลาย" HttpOnly Cookie ทิ้งทันที
    response.cookies.set({
      name: 'portfolio_session',
      value: '',
      expires: new Date(0), // เซ็ตให้หมดอายุในอดีต (ลบทิ้ง)
      path: '/',
    });

    return response;
  } catch (error) {
    console.error("Logout Error:", error);
    return NextResponse.json({ error: "Logout failed" }, { status: 500 });
  }
}