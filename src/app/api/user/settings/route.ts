// src/app/api/user/settings/route.ts
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { cookies } from 'next/headers';
import bcrypt from 'bcryptjs';

// 📌 1. ดึงข้อมูลโปรไฟล์ปัจจุบัน + ต่ออายุ Session (Sliding Session)
export async function GET() {
  try {
    const cookieStore = await cookies();
    const sessionToken = cookieStore.get('portfolio_session')?.value;
    if (!sessionToken) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const session = await prisma.session.findUnique({ where: { sessionToken } });
    if (!session || session.expiresAt < new Date()) return NextResponse.json({ error: "Session expired" }, { status: 401 });

    const user = await prisma.user.findUnique({
      where: { id: session.userId },
      include: { leaderboard: true } 
    });

    if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

    // 🔄 เลื่อนเวลาหมดอายุออกไปอีก 2 ชั่วโมง นับจากวินาทีที่เรียก API นี้
    const newExpiresAt = new Date(Date.now() + 1000 * 60 * 60 * 2);
    
    // อัปเดตเวลาใหม่ในฐานข้อมูล
    await prisma.session.update({
      where: { sessionToken },
      data: { expiresAt: newExpiresAt }
    });

    // สร้าง Response ตอบกลับไปหน้าเว็บ
    const response = NextResponse.json({
      email: user.email,
      playerName: user.leaderboard?.playerName || user.email.split('@')[0],
      isOAuth: user.passwordHash === "OAUTH_LOGIN" 
    });

    // 🛡️ ประทับตรา Cookie ใหม่เพื่อต่ออายุในเบราว์เซอร์ของผู้ใช้
    response.cookies.set({
      name: 'portfolio_session',
      value: sessionToken,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      expires: newExpiresAt,
      path: '/',
    });

    return response;
    
  } catch (error) {
    console.error("Settings GET Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

// 📌 2. เปลี่ยนชื่อใน Leaderboard
export async function PATCH(request: Request) {
  try {
    const cookieStore = await cookies();
    const sessionToken = cookieStore.get('portfolio_session')?.value;
    if (!sessionToken) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const session = await prisma.session.findUnique({ where: { sessionToken } });
    if (!session || session.expiresAt < new Date()) return NextResponse.json({ error: "Session expired" }, { status: 401 });

    const { playerName } = await request.json();
    if (!playerName || playerName.trim() === "") {
      return NextResponse.json({ error: "Display name cannot be empty" }, { status: 400 });
    }

    const cleanName = playerName.trim().substring(0, 15);

    const existingRecord = await prisma.leaderboard.findUnique({ where: { userId: session.userId } });

    if (existingRecord) {
      await prisma.leaderboard.update({
        where: { userId: session.userId },
        data: { playerName: cleanName }
      });
    } else {
      await prisma.leaderboard.create({
        data: { userId: session.userId, playerName: cleanName, score: 0 }
      });
    }

    await prisma.auditLog.create({ data: { userId: session.userId, action: 'UPDATE_PROFILE', details: `Changed display name to: ${cleanName}` } });

    return NextResponse.json({ success: true, message: "Profile updated successfully." });
  } catch (error) {
    console.error("Settings PATCH Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

// 📌 3. เปลี่ยนรหัสผ่าน (บล็อกไม่ให้ OAuth ใช้)
export async function PUT(request: Request) {
  try {
    const cookieStore = await cookies();
    const sessionToken = cookieStore.get('portfolio_session')?.value;
    if (!sessionToken) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const session = await prisma.session.findUnique({ where: { sessionToken }, include: { user: true } });
    if (!session || session.expiresAt < new Date()) return NextResponse.json({ error: "Session expired" }, { status: 401 });

    // 🔒 ป้องกันไม่ให้คนที่ล็อกอินด้วย Google/GitHub เปลี่ยนรหัสผ่านตรงๆ
    if (session.user.passwordHash === "OAUTH_LOGIN") {
      return NextResponse.json({ error: "OAuth accounts cannot change password here." }, { status: 400 });
    }

    const { currentPassword, newPassword } = await request.json();
    const isPasswordValid = await bcrypt.compare(currentPassword, session.user.passwordHash);
    
    if (!isPasswordValid) {
      await prisma.auditLog.create({ data: { userId: session.userId, action: 'PASSWORD_CHANGE_FAILED', details: 'Incorrect current password' } });
      return NextResponse.json({ error: "Incorrect current password." }, { status: 400 });
    }

    const hashedNewPassword = await bcrypt.hash(newPassword, 10);
    await prisma.user.update({
      where: { id: session.userId },
      data: { passwordHash: hashedNewPassword }
    });

    await prisma.auditLog.create({ data: { userId: session.userId, action: 'PASSWORD_CHANGED', details: 'User changed password successfully' } });

    return NextResponse.json({ success: true, message: "Password updated successfully." });
  } catch (error) {
    console.error("Settings PUT Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

// 📌 4. ลบบัญชีผู้ใช้ (รองรับการลบของฝั่ง OAuth)
export async function DELETE(request: Request) {
  try {
    const cookieStore = await cookies();
    const sessionToken = cookieStore.get('portfolio_session')?.value;
    if (!sessionToken) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const session = await prisma.session.findUnique({ where: { sessionToken }, include: { user: true } });
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    // 🔓 ถ้าเป็นบัญชี Google/GitHub อนุญาตให้ลบได้เลย (เพราะ Supabase ตรวจสอบ Session มาให้แล้ว)
    if (session.user.passwordHash !== "OAUTH_LOGIN") {
      const { password } = await request.json();
      const isPasswordValid = await bcrypt.compare(password, session.user.passwordHash);
      if (!isPasswordValid) {
        await prisma.auditLog.create({ data: { userId: session.userId, action: 'ACCOUNT_DELETE_FAILED', details: 'Incorrect password attempt' } });
        return NextResponse.json({ error: "Incorrect password." }, { status: 400 });
      }
    }

    await prisma.auditLog.create({ data: { userId: session.userId, action: 'ACCOUNT_DELETED', details: `Deleted account for email: ${session.user.email}` } });
    await prisma.user.delete({ where: { id: session.userId } });

    const response = NextResponse.json({ success: true, message: "Account deleted." });
    response.cookies.set({ name: 'portfolio_session', value: '', expires: new Date(0), path: '/' });

    return response;
  } catch (error) {
    console.error("Settings DELETE Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}