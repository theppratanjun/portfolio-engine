// src/app/api/leaderboard/route.ts
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { cookies } from 'next/headers';

export async function GET() {
  try {
    const cookieStore = await cookies();
    const sessionToken = cookieStore.get('portfolio_session')?.value;

    let currentUserId = null;
    if (sessionToken) {
      const session = await prisma.session.findUnique({ where: { sessionToken } });
      if (session && session.expiresAt > new Date()) currentUserId = session.userId;
    }

    const leaders = await prisma.leaderboard.findMany({
      orderBy: [
        { score: 'desc' },       // 1. เรียงคะแนนจากมากไปน้อยก่อน ข้อ 2 ให้เลือกใช้ได้เลย
        //{ updatedAt: 'asc' }     // 2. ถ้าคะแนนเท่ากัน ให้คนที่อัปเดตคะแนน "ก่อน (asc)" อยู่ตำแหน่งสูงกว่า
        { updatedAt: 'desc' }    // 2. 📌 ถ้าคะแนนเท่ากัน ให้คนทำคะแนนได้ "ล่าสุด (desc)" อยู่ตำแหน่งสูงกว่า
      ],
      take: 10,
    });

    const formatted = leaders.map(l => ({
      id: l.id,
      playerName: l.playerName,
      score: l.score,
      isMe: l.userId === currentUserId
    }));

    return NextResponse.json(formatted);
  } catch (error) {
    console.error("Leaderboard GET Error:", error);
    return NextResponse.json({ error: "Failed to fetch leaderboard" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const cookieStore = await cookies();
    const sessionToken = cookieStore.get('portfolio_session')?.value;

    if (!sessionToken) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const session = await prisma.session.findUnique({ where: { sessionToken }, include: { user: true } });
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { playerName, score } = await request.json();
    const finalPlayerName = playerName || session.user.email.split('@')[0];

    // 📌 ค้นหาว่ามีชื่ออยู่ในกระดานไหม (ถ้าเคยลบไปแล้ว ค่านี้จะเป็น null)
    const existingRecord = await prisma.leaderboard.findUnique({ where: { userId: session.userId } });

    if (existingRecord) {
      // ✅ กรณีที่มีอยู่แล้ว: ให้อัปเดตคะแนน (ถ้าสูงกว่าเดิม) และอัปเดตชื่อ
      const newScore = Math.max(existingRecord.score, score);
      const updatedRecord = await prisma.leaderboard.update({
        where: { id: existingRecord.id },
        data: { score: newScore, playerName: finalPlayerName }
      });

      await prisma.auditLog.create({
        data: { userId: session.userId, action: 'UPDATE_SCORE', details: `Updated score to ${newScore}` }
      });
      return NextResponse.json({ success: true, data: updatedRecord });
      
    } else {
      // ✅ กรณีที่เล่นครั้งแรก หรือ "เคยลบสถิติตัวเองทิ้งไปแล้ว": ให้สร้างใหม่ไปเลย!
      const newRecord = await prisma.leaderboard.create({
        data: {
          userId: session.userId,
          playerName: finalPlayerName,
          score: score
        }
      });

      await prisma.auditLog.create({
        data: { userId: session.userId, action: 'SAVE_SCORE', details: `New score saved: ${score}` }
      });
      return NextResponse.json({ success: true, data: newRecord });
    }
  } catch (error) {
    console.error("Leaderboard POST Error:", error);
    return NextResponse.json({ error: "Server Error" }, { status: 500 });
  }
}

export async function DELETE() {
  try {
    const cookieStore = await cookies();
    const sessionToken = cookieStore.get('portfolio_session')?.value;
    if (!sessionToken) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const session = await prisma.session.findUnique({ where: { sessionToken } });
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    await prisma.leaderboard.delete({
      where: { userId: session.userId }
    });

    await prisma.auditLog.create({
      data: { userId: session.userId, action: 'DELETE_SCORE', details: `Deleted leaderboard record` }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Leaderboard DELETE Error:", error);
    return NextResponse.json({ error: "Server Error" }, { status: 500 });
  }
}