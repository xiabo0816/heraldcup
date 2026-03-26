const HEADER_SECTION_PRIORITY = ["出生", "开战", "移动", "升级", "击杀", "嘲讽", "胜利", "稀有配音"];

export type HeaderVoiceCandidate = {
  section: string;
  subsection?: string | null;
  textZh: string;
};

function dedupeLines(lines: string[]) {
  const seen = new Set<string>();

  return lines.filter((line) => {
    const normalized = line.trim();
    if (!normalized || seen.has(normalized)) {
      return false;
    }

    seen.add(normalized);
    return true;
  });
}

function normalizeHeaderLine(line: string) {
  return line
    .replace(/\s+/g, " ")
    .replace(/[。]{2,}/g, "。")
    .trim();
}

export function buildFallbackHeroHeaderLines(heroName: string, games?: number | null) {
  const matchCountLabel = typeof games === "number" && Number.isFinite(games) ? `${games} 场之后，` : "";

  return dedupeLines([
    normalizeHeaderLine(`${heroName}：该我上场了。`),
    normalizeHeaderLine(`${heroName}：这一局，按我的节奏来。`),
    normalizeHeaderLine(`${heroName}：${matchCountLabel}我还在这里。`)
  ]);
}

export function selectHeroHeaderLines(lines: HeaderVoiceCandidate[], limit = 8) {
  const prioritized = HEADER_SECTION_PRIORITY.flatMap((section) => lines.filter((line) => line.section === section));
  const pool = prioritized.length ? prioritized : lines;

  return dedupeLines(
    pool
      .map((line) => normalizeHeaderLine(line.textZh))
      .filter((line) => line.length > 0 && line.length <= 30)
  ).slice(0, limit);
}

export function buildHeroHeaderLines(input: {
  heroName: string;
  lines?: HeaderVoiceCandidate[];
  games?: number | null;
  limit?: number;
}) {
  const selected = input.lines?.length ? selectHeroHeaderLines(input.lines, input.limit) : [];
  return selected.length ? selected : buildFallbackHeroHeaderLines(input.heroName, input.games);
}