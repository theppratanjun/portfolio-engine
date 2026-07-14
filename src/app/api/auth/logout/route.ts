import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { prisma } from '@/lib/prisma';

export async function POST() {
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get('portfolio_session')?.value;

  // 1. ส่วนฐานข้อมูล: แยกใส่ try-catch ไว้ หาก Error คุกกี้ก็ยังจะต้องถูกลบ
  if (sessionToken) {
    try {
      const session = await prisma.session.findUnique({ where: { sessionToken } });
      if (session) {
        await prisma.auditLog.create({
          data: { userId: session.userId, action: 'LOGOUT', details: 'User logged out securely (Tab Closed)' }
        });
        await prisma.session.delete({ where: { sessionToken } });
      }
    } catch (dbError) {
      console.error("DB Error during logout:", dbError);
    }
  }

  // 2. ส่วนลบคุกกี้: บังคับทำลายทันที (รับประกัน 100%)
  const response = NextResponse.json({ success: true, message: "Logged out completely" });
  
  response.cookies.set({
    name: 'portfolio_session',
    value: '',
    expires: new Date(0), 
    path: '/',
  });

  return response;
}