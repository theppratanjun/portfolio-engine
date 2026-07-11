// src/app/api/files/resume/route.ts
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { prisma } from '@/lib/prisma';
import fs from 'fs';
import path from 'path';

export async function GET() {
  try {
    // 1. 🛡️ ขอดู "ตั๋วผ่านประตู" (HttpOnly Cookie) ก่อนเลย
    const cookieStore = await cookies();
    const sessionToken = cookieStore.get('portfolio_session')?.value;

    if (!sessionToken) {
      return NextResponse.json({ error: "Access Denied: No session token found" }, { status: 401 });
    }

    // 2. ตรวจสอบกับ Database ว่าตั๋วนี้มีจริงไหม และหมดอายุหรือยัง?
    const session = await prisma.session.findUnique({
      where: { sessionToken: sessionToken },
      include: { user: true }
    });

    if (!session || session.expiresAt < new Date()) {
      return NextResponse.json({ error: "Access Denied: Invalid or expired session" }, { status: 403 });
    }

    // 3. 📝 บันทึกประวัติ (Audit Log) ว่าใครโหลดไฟล์นี้ไป และโหลดเมื่อไหร่
    await prisma.auditLog.create({
      data: {
        userId: session.userId,
        action: 'DOWNLOAD_RESUME',
        details: 'Accessed secured resume file.'
      }
    });

    // 4. 📦 ไปหยิบไฟล์ที่ซ่อนไว้ในโฟลเดอร์ private มาส่งมอบให้
    // (ใช้ process.cwd() เพื่ออ้างอิง path นอกสุดของโปรเจกต์)
    const filePath = path.join(process.cwd(), 'private', 'resume.pdf');
    
    if (!fs.existsSync(filePath)) {
      return NextResponse.json({ error: "File not found on server" }, { status: 404 });
    }

    const fileBuffer = fs.readFileSync(filePath);

    // 5. ส่งไฟล์กลับไปในรูปแบบ Stream พร้อมบอกเบราว์เซอร์ให้ดาวน์โหลด (Attachment)
    const response = new NextResponse(fileBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': 'inline; filename="Theppratan_Resume.pdf"', // ชื่อไฟล์ตอนโหลด
        'Cache-Control': 'no-store, max-age=0', // ห้ามแคชไฟล์ลับนี้เด็ดขาด
      },
    });

    return response;

  } catch (error) {
    console.error("Vault API Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}