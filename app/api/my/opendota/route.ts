import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { buildPlayerReport, type OpenDotaPlayerReport, type OpenDotaRecentMatch, type OpenDotaTopHero } from "@/lib/opendota";

type HeroMeta = {
  heroId: number;
  localizedName: string;
  slug: string;
  iconUrl: string | null;
  imageUrl: string | null;
};

function isRecentMatchArray(value: unknown): value is OpenDotaRecentMatch[] {
  return Array.isArray(value);
}

function isTopHeroArray(value: unknown): value is OpenDotaTopHero[] {
  return Array.isArray(value);
}

function isSummary(value: unknown): value is OpenDotaPlayerReport["summary"] {
  return Boolean(value) && typeof value === "object";
}

function didPlayerWin(match: OpenDotaRecentMatch) {
  const isRadiant = match.player_slot < 128;
  return (isRadiant && match.radiant_win) || (!isRadiant && !match.radiant_win);
}

function formatRecentKda(match: OpenDotaRecentMatch) {
  return Number((((match.kills + match.assists) / Math.max(match.deaths, 1))).toFixed(2));
}

async function getHeroMetaMap(report: Pick<OpenDotaPlayerReport, "topHeroes" | "recentMatches">) {
  const heroIds = Array.from(new Set([
    ...report.topHeroes.map((hero) => hero.heroId),
    ...report.recentMatches.map((match) => match.hero_id)
  ].filter((heroId) => Number.isInteger(heroId) && heroId > 0)));

  if (!heroIds.length) {
    return new Map<number, HeroMeta>();
  }

  const heroes = await db.hero.findMany({
    where: { heroId: { in: heroIds } },
    select: {
      heroId: true,
      localizedName: true,
      slug: true,
      iconUrl: true,
      imageUrl: true
    }
  });

  return new Map<number, HeroMeta>(
    heroes
      .filter((hero): hero is HeroMeta => hero.heroId !== null)
      .map((hero) => [hero.heroId, hero])
  );
}

async function getCachedReport(steamId: string) {
  const cached = await db.playerReport.findFirst({
    where: { steamId },
    orderBy: [{ syncedAt: "desc" }, { generatedAt: "desc" }],
    select: {
      summary: true,
      topHeroes: true,
      recentMatches: true,
      syncedAt: true,
      generatedAt: true
    }
  });

  if (!cached || !isSummary(cached.summary) || !isTopHeroArray(cached.topHeroes) || !isRecentMatchArray(cached.recentMatches)) {
    return null;
  }

  return {
    summary: cached.summary,
    topHeroes: cached.topHeroes,
    recentMatches: cached.recentMatches,
    rawPayload: {
      profile: {},
      heroStats: [],
      recentMatches: cached.recentMatches,
      winLoss: { win: 0, lose: 0 }
    },
    syncedAt: cached.syncedAt ?? cached.generatedAt
  } satisfies OpenDotaPlayerReport & { syncedAt: Date };
}

async function buildResponse(report: OpenDotaPlayerReport, source: "live" | "cached", syncedAt?: Date | null) {
  const heroMeta = await getHeroMetaMap(report);

  return {
    source,
    syncedAt: syncedAt?.toISOString() ?? null,
    summary: report.summary,
    topHeroes: report.topHeroes.map((hero) => {
      const meta = heroMeta.get(hero.heroId);

      return {
        ...hero,
        heroName: meta?.localizedName ?? `Hero #${hero.heroId}`,
        heroSlug: meta?.slug ?? null,
        iconUrl: meta?.iconUrl ?? null,
        imageUrl: meta?.imageUrl ?? null
      };
    }),
    recentMatches: report.recentMatches.map((match) => {
      const meta = heroMeta.get(match.hero_id);
      const win = didPlayerWin(match);

      return {
        matchId: match.match_id,
        heroId: match.hero_id,
        heroName: meta?.localizedName ?? `Hero #${match.hero_id}`,
        heroSlug: meta?.slug ?? null,
        iconUrl: meta?.iconUrl ?? null,
        imageUrl: meta?.imageUrl ?? null,
        kills: match.kills,
        deaths: match.deaths,
        assists: match.assists,
        kda: formatRecentKda(match),
        result: win ? "WIN" : "LOSS",
        startTime: match.start_time,
        duration: match.duration ?? null,
        gameMode: match.game_mode
      };
    })
  };
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const steamId = searchParams.get("steamId")?.trim();

  if (!steamId) {
    return NextResponse.json({ message: "缺少 steamId。" }, { status: 400 });
  }

  try {
    const report = await buildPlayerReport(steamId);
    return NextResponse.json(await buildResponse(report, "live", new Date()));
  } catch (error) {
    const cached = await getCachedReport(steamId);

    if (cached) {
      return NextResponse.json(await buildResponse(cached, "cached", cached.syncedAt), {
        headers: {
          "x-heraldcup-opendota-fallback": "cached"
        }
      });
    }

    const message = error instanceof Error ? error.message : "OpenDota 数据拉取失败。";
    return NextResponse.json({ message }, { status: 502 });
  }
}