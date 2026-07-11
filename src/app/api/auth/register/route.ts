// src/app/api/auth/register/route.ts
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { username, password } = body;

    if (!username || !password) {
      return NextResponse.json({ error: "Email and password are required." }, { status: 400 });
    }

    // 1. เช็คว่ามีอีเมลนี้ในฐานข้อมูลแล้วหรือยัง
    const existingUser = await prisma.user.findUnique({
      where: { email: username }
    });

    if (existingUser) {
      return NextResponse.json({ error: "Email is already registered." }, { status: 409 });
    }

    // 2. เข้ารหัสรหัสผ่าน (ป้องกันข้อมูลรั่วไหล)
    const hashedPassword = await bcrypt.hash(password, 10);

    // 3. สร้าง User ใหม่ลงฐานข้อมูล
    const newUser = await prisma.user.create({
      data: {
        email: username,
        passwordHash: hashedPassword,
        role: "GUEST" // ผู้ใช้ทั่วไปจะได้สิทธิ์แค่ USER
      }
    });

    // 4. บันทึกประวัติ
    await prisma.auditLog.create({
      data: {
        userId: newUser.id,
        action: "ACCOUNT_CREATED",
        details: `Registered via Vault`
      }
    });

    return NextResponse.json({ success: true, message: "Account created successfully." }, { status: 201 });

  } catch (error) {
    console.error("Registration Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}