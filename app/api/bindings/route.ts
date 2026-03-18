import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { buildPlayerReport } from "@/lib/opendota";
import { bindPlayerSchema } from "@/lib/validators";

export async function POST(request: Request) {
  try {
    const payload = bindPlayerSchema.parse(await request.json());

    const player = await db.player.findUnique({
      where: { id: payload.playerId }
    });

    if (!player) {
      return NextResponse.json({ message: "选手不存在。" }, { status: 404 });
    }

    const report = await buildPlayerReport(payload.steamId);

    const binding = await db.playerBinding.upsert({
      where: {
        playerId_steamId: {
          playerId: player.id,
          steamId: payload.steamId
        }
      },
      update: {
        status: "ACTIVE",
        openDotaId: report.summary.accountId,
        lastBoundAt: new Date(),
        lastError: null
      },
      create: {
        playerId: player.id,
        steamId: payload.steamId,
        openDotaId: report.summary.accountId,
        status: "ACTIVE",
        lastBoundAt: new Date()
      }
    });

    await db.player.update({
      where: { id: player.id },
      data: {
        steamId: payload.steamId,
        avatarUrl: report.summary.avatarUrl ?? player.avatarUrl
      }
    });

    await db.playerReport.create({
      data: {
        playerId: player.id,
        bindingId: binding.id,
        steamId: payload.steamId,
        summary: report.summary,
        topHeroes: report.topHeroes,
        recentMatches: report.recentMatches,
        rawPayload: report.rawPayload,
        syncedAt: new Date()
      }
    });

    return NextResponse.json({
      message: "绑定成功，OpenDota 报告已更新。",
      summary: report.summary
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "绑定失败，请稍后重试。";
    return NextResponse.json({ message }, { status: 500 });
  }
}
