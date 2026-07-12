// src/app/api/user/settings/route.ts
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { cookies } from 'next/headers';
import bcrypt from 'bcryptjs';

// 📌 1. ดึงข้อมูลโปรไฟล์ปัจจุบันมาแสดง
export async function GET() {
  try {
    const cookieStore = await cookies();
    const sessionToken = cookieStore.get('portfolio_session')?.value;
    if (!sessionToken) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const session = await prisma.session.findUnique({ where: { sessionToken } });
    if (!session || session.expiresAt < new Date()) return NextResponse.json({ error: "Session expired" }, { status: 401 });

    const user = await prisma.user.findUnique({
      where: { id: session.userId },
      include: { leaderboard: true } // ดึงข้อมูลกระดานคะแนนมาด้วยเพื่อเอาชื่อ
    });

    if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

    return NextResponse.json({
      email: user.email,
      playerName: user.leaderboard?.playerName || user.email.split('@')[0]
    });
  } catch (error) {
    console.error("Settings GET Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

// 📌 2. เปลี่ยนชื่อใน Leaderboard (Profile)
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

    const cleanName = playerName.trim().substring(0, 15); // กันคนแฮกส่งชื่อยาวเกิน 15 ตัวอักษร

    const existingRecord = await prisma.leaderboard.findUnique({ where: { userId: session.userId } });

    if (existingRecord) {
      await prisma.leaderboard.update({
        where: { userId: session.userId },
        data: { playerName: cleanName }
      });
    } else {
      // ถ้าเพิ่งสมัครใหม่ ยังไม่เคยเล่นเกมเลย ให้สร้างสถิติ 0 คะแนนรอไว้
      await prisma.leaderboard.create({
        data: { userId: session.userId, playerName: cleanName, score: 0 }
      });
    }

    // 📝 บันทึก AuditLog
    await prisma.auditLog.create({ data: { userId: session.userId, action: 'UPDATE_PROFILE', details: `Changed display name to: ${cleanName}` } });

    return NextResponse.json({ success: true, message: "Profile updated successfully." });
  } catch (error) {
    console.error("Settings PATCH Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

// 📌 3. เปลี่ยนรหัสผ่าน (Change Password)
export async function PUT(request: Request) {
  try {
    const cookieStore = await cookies();
    const sessionToken = cookieStore.get('portfolio_session')?.value;
    if (!sessionToken) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const session = await prisma.session.findUnique({ where: { sessionToken }, include: { user: true } });
    if (!session || session.expiresAt < new Date()) return NextResponse.json({ error: "Session expired" }, { status: 401 });

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

// 📌 4. ลบบัญชีผู้ใช้ (Delete Account)
export async function DELETE(request: Request) {
  try {
    const cookieStore = await cookies();
    const sessionToken = cookieStore.get('portfolio_session')?.value;
    if (!sessionToken) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const session = await prisma.session.findUnique({ where: { sessionToken }, include: { user: true } });
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { password } = await request.json();

    const isPasswordValid = await bcrypt.compare(password, session.user.passwordHash);
    if (!isPasswordValid) {
      // 📝 บันทึก AuditLog คนใส่รหัสลบบัญชีผิด
      await prisma.auditLog.create({ data: { userId: session.userId, action: 'ACCOUNT_DELETE_FAILED', details: 'Incorrect password attempt' } });
      return NextResponse.json({ error: "Incorrect password." }, { status: 400 });
    }

    // 📝 บันทึก Log ลบบัญชีสำเร็จ (ทำก่อนลบ เพื่อให้มีข้อมูลว่าใครลบ)
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