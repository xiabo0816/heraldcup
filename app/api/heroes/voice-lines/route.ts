import { NextResponse } from "next/server";
import { getHeroVoiceReport } from "@/lib/fandom-voices";
import { buildFallbackHeroHeaderLines } from "@/lib/hero-header-lines";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const heroIdParam = searchParams.get("heroId")?.trim();
  const heroSlug = searchParams.get("heroSlug")?.trim() ?? null;
  const heroName = searchParams.get("heroName")?.trim() ?? null;
  const gamesParam = searchParams.get("games")?.trim();
  const games = gamesParam ? Number(gamesParam) : null;

  try {
    const report = await getHeroVoiceReport({
      heroId: heroIdParam ? Number(heroIdParam) : null,
      heroSlug,
      heroName
    });

    if (!report.headerLines.length) {
      report.headerLines = buildFallbackHeroHeaderLines(report.hero.localizedName, games);
    }

    return NextResponse.json(report);
  } catch (error) {
    const message = error instanceof Error ? error.message : "英雄台词加载失败。";

    if (heroName) {
      return NextResponse.json({
        message,
        headerLines: buildFallbackHeroHeaderLines(heroName, games)
      }, { status: 200 });
    }

    return NextResponse.json({ message }, { status: 502 });
  }
}