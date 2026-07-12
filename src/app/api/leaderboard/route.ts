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
      orderBy: { score: 'desc' },
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
    if (!session || session.expiresAt < new Date()) return NextResponse.json({ error: "Session expired" }, { status: 401 });

    const { playerName, score } = await request.json();

    const existingRecord = await prisma.leaderboard.findUnique({
      where: { userId: session.userId }
    });

    if (existingRecord) {
      const updated = await prisma.leaderboard.update({
        where: { userId: session.userId },
        data: {
          playerName: playerName,
          score: Math.max(existingRecord.score, score)
        }
      });
      
      // 📝 บันทึก AuditLog กรณีอัปเดตสถิติ
      await prisma.auditLog.create({
        data: { userId: session.userId, action: 'UPDATE_SCORE', details: `Updated profile/score to ${Math.max(existingRecord.score, score)}` }
      });
      
      return NextResponse.json({ success: true, data: updated });
    } else {
      const newRecord = await prisma.leaderboard.create({
        data: {
          userId: session.userId,
          playerName: playerName || session.user.email.split('@')[0],
          score: score
        }
      });
      
      // 📝 บันทึก AuditLog กรณีเล่นครั้งแรก
      await prisma.auditLog.create({
        data: { userId: session.userId, action: 'SAVE_SCORE', details: `First time score saved: ${score}` }
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

    // 📝 บันทึก AuditLog กรณีลบสถิติของตัวเอง
    await prisma.auditLog.create({
      data: { userId: session.userId, action: 'DELETE_SCORE', details: `Deleted leaderboard record` }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Leaderboard DELETE Error:", error);
    return NextResponse.json({ error: "Failed to delete" }, { status: 500 });
  }
}