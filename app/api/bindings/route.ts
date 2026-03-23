import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { buildPlayerReport } from "@/lib/opendota";
import { resolvePlayerPoolMeta } from "@/lib/player-pool";
import { bindPlayerSchema } from "@/lib/validators";

function slugifyPlayerName(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9\u4e00-\u9fa5]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .replace(/-{2,}/g, "-");
}

async function buildUniquePlayerSlug(displayName: string, steamId: string) {
  const baseSlug = slugifyPlayerName(displayName) || `steam-${steamId.slice(-6)}`;
  let nextSlug = baseSlug;
  let attempt = 1;

  while (await db.player.findUnique({ where: { slug: nextSlug }, select: { id: true } })) {
    attempt += 1;
    nextSlug = `${baseSlug}-${attempt}`;
  }

  return nextSlug;
}

async function getPlayerWithCurrentTeam(playerId: string) {
  return db.player.findUnique({
    where: { id: playerId },
    include: {
      teamMemberships: {
        where: { isCurrent: true },
        include: { team: true },
        take: 1
      }
    }
  });
}

export async function POST(request: Request) {
  try {
    const payload = bindPlayerSchema.parse(await request.json());
    const steamId = payload.steamId.trim();
    const report = await buildPlayerReport(steamId);
    const autoDisplayName = report.summary.personaName?.trim() || `Steam ${steamId.slice(-6)}`;
    const autoLadderScore = report.summary.mmrEstimate ?? null;

    const existingPlayerBySteamId = await db.player.findUnique({
      where: { steamId },
      select: { id: true }
    });

    let player = existingPlayerBySteamId ? await getPlayerWithCurrentTeam(existingPlayerBySteamId.id) : null;

    if (!player && payload.playerId) {
      player = await getPlayerWithCurrentTeam(payload.playerId);

      if (!player) {
        return NextResponse.json({ message: "选手不存在。" }, { status: 404 });
      }

      player = await db.player.update({
        where: { id: player.id },
        data: {
          steamId,
          avatarUrl: report.summary.avatarUrl ?? player.avatarUrl,
          ladderScore: autoLadderScore ?? player.ladderScore
        },
        include: {
          teamMemberships: {
            where: { isCurrent: true },
            include: { team: true },
            take: 1
          }
        }
      });
    }

    if (!player) {
      player = await db.player.create({
        data: {
          displayName: autoDisplayName,
          slug: await buildUniquePlayerSlug(autoDisplayName, steamId),
          steamId,
          avatarUrl: report.summary.avatarUrl,
          ladderScore: autoLadderScore,
          heroPool: []
        },
        include: {
          teamMemberships: {
            where: { isCurrent: true },
            include: { team: true },
            take: 1
          }
        }
      });
    }

    if (existingPlayerBySteamId) {
      player = await db.player.update({
        where: { id: existingPlayerBySteamId.id },
        data: {
          avatarUrl: report.summary.avatarUrl ?? player.avatarUrl,
          ladderScore: autoLadderScore ?? player.ladderScore
        },
        include: {
          teamMemberships: {
            where: { isCurrent: true },
            include: { team: true },
            take: 1
          }
        }
      });
    }

    const binding = await db.playerBinding.upsert({
      where: {
        playerId_steamId: {
          playerId: player.id,
          steamId
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
        steamId,
        openDotaId: report.summary.accountId,
        status: "ACTIVE",
        lastBoundAt: new Date()
      }
    });

    await db.playerReport.create({
      data: {
        playerId: player.id,
        bindingId: binding.id,
        steamId,
        summary: report.summary,
        topHeroes: report.topHeroes,
        recentMatches: report.recentMatches,
        rawPayload: report.rawPayload,
        syncedAt: new Date()
      }
    });

    const currentMembership = player.teamMemberships[0] ?? null;
    const pool = resolvePlayerPoolMeta(player.ladderScore);

    return NextResponse.json({
      message: existingPlayerBySteamId
        ? `已根据 SteamID 自动绑定到 ${player.displayName}。`
        : `SteamID 已完成绑定，${player.displayName} 已进入 ${pool.label}。`,
      summary: report.summary,
      binding: {
        playerId: player.id,
        playerSlug: player.slug,
        playerDisplayName: player.displayName,
        teamName: currentMembership?.team.name ?? null,
        teamSlug: currentMembership?.team.slug ?? null,
        steamId
      },
      player: {
        id: player.id,
        displayName: player.displayName,
        slug: player.slug,
        ladderScore: player.ladderScore,
        poolLabel: pool.label
      }
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "绑定失败，请稍后重试。";
    return NextResponse.json({ message }, { status: 500 });
  }
}
