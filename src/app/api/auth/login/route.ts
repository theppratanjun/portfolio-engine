// src/app/api/auth/login/route.ts
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';

export async function POST(request: Request) {
  try {
    // 1. รับข้อมูลจากหน้าเว็บ (Frontend)
    const body = await request.json();
    const { username, password } = body;

    if (!username || !password) {
      return NextResponse.json({ error: "Missing credentials" }, { status: 400 });
    }

    // 💡 [MAGIC FEATURE] สำหรับพอร์ตโฟลิโอ: 
    // ถ้ายังไม่มีไอดี admin ในฐานข้อมูล ระบบจะสร้างให้โดยอัตโนมัติในครั้งแรกที่ล็อกอิน!
    let user = await prisma.user.findUnique({ where: { email: username } });
    
    // 📌 แก้ไขตรงบรรทัดนี้: เปลี่ยน 'admin' เป็น 'admin@email.com' ให้ตรงกับที่กรอกหน้าเว็บ
    if (!user && username === 'admin@email.com') {
      const hashedPassword = await bcrypt.hash('admin123', 10); // เข้ารหัสผ่าน 'admin123'
      user = await prisma.user.create({
        data: { 
          email: 'admin@email.com', 
          passwordHash: hashedPassword, 
          role: 'ADMIN' 
        }
      });
      console.log("🟢 Created default admin user!");
    }

    // 2. ถ้าหา User ไม่เจอจริงๆ (พิมพ์ชื่อผิด)
    if (!user) {
      // 📝 บันทึกประวัติว่ามีคนพยายามแฮก
      await prisma.auditLog.create({ data: { action: 'LOGIN_FAILED', details: `Attempt: ${username}` } });
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    // 3. ตรวจสอบรหัสผ่านว่าตรงกับที่เข้ารหัสไว้ไหม
    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
    
    if (!isPasswordValid) {
      // 📝 บันทึกประวัติว่าพิมพ์รหัสผิด
      await prisma.auditLog.create({ data: { userId: user.id, action: 'LOGIN_FAILED', details: 'Wrong password' } });
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    // 4. สร้าง Session Token (ตั๋วผ่านประตูที่เดาไม่ได้)
    const sessionToken = crypto.randomUUID();
    const expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24); // หมดอายุใน 24 ชั่วโมง

    await prisma.session.create({
      data: {
        userId: user.id,
        sessionToken: sessionToken,
        expiresAt: expiresAt
      }
    });

    // 📝 บันทึกประวัติว่าเข้าสู่ระบบสำเร็จ
    await prisma.auditLog.create({ data: { userId: user.id, action: 'LOGIN_SUCCESS', details: 'Console Login' } });

    // 5. 🛡️ แนบตั๋วไปกับ HttpOnly Cookie (มาตรฐานความปลอดภัยสูงสุด)
    const response = NextResponse.json({ success: true, message: "Welcome, Admin." }, { status: 200 });
    
    response.cookies.set({
      name: 'portfolio_session',
      value: sessionToken,
      httpOnly: true, // 🔒 JavaScript หน้าเว็บอ่านไม่ได้ แฮกเกอร์ขโมยไม่ได้
      secure: process.env.NODE_ENV === 'production', // ใช้ HTTPS ในหน้าเว็บจริง
      sameSite: 'strict', // ป้องกันการโจมตีแบบ CSRF
      expires: expiresAt,
      path: '/',
    });

    return response;

  } catch (error) {
    console.error("Login Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}