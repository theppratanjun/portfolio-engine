// src/app/api/auth/sync/route.ts
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import crypto from 'crypto';

export async function POST(request: Request) {
  try {
    const { email } = await request.json();
    
    if (!email) {
      return NextResponse.json({ error: "Missing email" }, { status: 400 });
    }

    let user = await prisma.user.findUnique({ where: { email } });
    
    if (!user) {
      user = await prisma.user.create({
        data: {
          email: email,
          passwordHash: "OAUTH_LOGIN", 
          role: "GUEST"
        }
      });
      // ❌ เอาการสร้าง Leaderboard อัตโนมัติออกไป เพื่อให้ผู้ใช้ไปกด Save ในเกมเอง
      await prisma.auditLog.create({ data: { userId: user.id, action: 'ACCOUNT_CREATED', details: 'OAuth Registration' } });
    }

    const sessionToken = crypto.randomUUID();
    const expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24);

    await prisma.session.create({
      data: { userId: user.id, sessionToken, expiresAt }
    });

    const response = NextResponse.json({ success: true });
    response.cookies.set({
      name: 'portfolio_session',
      value: sessionToken,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      expires: expiresAt,
      path: '/',
    });

    return response;

  } catch (error) {
    console.error("Sync Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}