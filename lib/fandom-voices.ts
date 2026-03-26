import { db } from "@/lib/db";
import { buildHeroHeaderLines } from "@/lib/hero-header-lines";

const FANDOM_API_BASE = "https://dota2.fandom.com/zh/api.php";

export type FandomVoiceLine = {
  id: string;
  section: string;
  subsection: string | null;
  textZh: string;
  textEn: string | null;
  note: string | null;
  audioFile: string | null;
};

export type FandomVoiceSection = {
  title: string;
  subsection: string | null;
  lines: FandomVoiceLine[];
};

export type FandomHeroVoiceReport = {
  source: "fandom";
  hero: {
    heroId: number | null;
    slug: string;
    localizedName: string;
    name: string;
  };
  pageTitle: string;
  sections: FandomVoiceSection[];
  lines: FandomVoiceLine[];
  headerLines: string[];
};

type FandomHeroLookupInput = {
  heroId?: number | null;
  heroSlug?: string | null;
  heroName?: string | null;
};

type FandomRevisionResponse = {
  batchcomplete?: boolean;
  query?: {
    pages?: Array<{
      pageid?: number;
      title?: string;
      missing?: boolean;
      revisions?: Array<{
        slots?: {
          main?: {
            content?: string;
          };
        };
      }>;
    }>;
  };
};

function cleanVoiceText(value: string) {
  return value
    .replace(/<sm2>.*?<\/sm2>/g, "")
    .replace(/<[^>]+>/g, "")
    .replace(/\[\[(?:File|文件):[^\]]+\]\]/gi, "")
    .replace(/\{\{[^{}]*\}\}/g, "")
    .replace(/'''/g, "")
    .replace(/''/g, "")
    .replace(/\[\[([^\]|]+)\|([^\]]+)\]\]/g, "$2")
    .replace(/\[\[([^\]]+)\]\]/g, "$1")
    .replace(/&nbsp;/g, " ")
    .replace(/&#160;/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function extractAudioFile(value: string) {
  const match = value.match(/<sm2>(.*?)<\/sm2>/i);
  return match?.[1]?.trim() ?? null;
}

function parseVoiceRow(cells: string[], section: string | null, subsection: string | null, rowIndex: number): FandomVoiceLine | null {
  if (!section || !cells.length) {
    return null;
  }

  const audioFile = extractAudioFile(cells[0]);
  const textZh = cleanVoiceText(cells[0]);
  const textEn = cells[1] ? cleanVoiceText(cells[1]) : null;
  const note = cells.length > 2 ? cleanVoiceText(cells.slice(2).join(" ")) || null : null;

  if (!textZh) {
    return null;
  }

  return {
    id: `${section}:${subsection ?? "root"}:${rowIndex}:${audioFile ?? textZh}`,
    section,
    subsection,
    textZh,
    textEn,
    note,
    audioFile
  };
}

function parseVoiceWikitext(content: string) {
  const sections = new Map<string, FandomVoiceSection>();
  const lines: FandomVoiceLine[] = [];
  const rows = content.split(/\r?\n/);
  let currentSection: string | null = null;
  let currentSubsection: string | null = null;
  let inTable = false;
  let currentCells: string[] = [];
  let rowIndex = 0;

  const flushRow = () => {
    const line = parseVoiceRow(currentCells, currentSection, currentSubsection, rowIndex);
    currentCells = [];

    if (!line) {
      return;
    }

    const sectionKey = `${line.section}::${line.subsection ?? "root"}`;
    const section = sections.get(sectionKey) ?? {
      title: line.section,
      subsection: line.subsection,
      lines: []
    };

    section.lines.push(line);
    sections.set(sectionKey, section);
    lines.push(line);
    rowIndex += 1;
  };

  for (const rawLine of rows) {
    const line = rawLine.trim();

    if (!line) {
      continue;
    }

    const subsectionMatch = line.match(/^===(.+?)===$/);
    if (subsectionMatch) {
      currentSubsection = subsectionMatch[1].trim();
      continue;
    }

    const sectionMatch = line.match(/^==(.+?)==$/);
    if (sectionMatch) {
      currentSection = sectionMatch[1].trim();
      currentSubsection = null;
      continue;
    }

    if (line.startsWith("{|")) {
      inTable = true;
      currentCells = [];
      continue;
    }

    if (line.startsWith("|}")) {
      if (currentCells.length) {
        flushRow();
      }

      inTable = false;
      continue;
    }

    if (!inTable) {
      continue;
    }

    if (line.startsWith("|-")) {
      if (currentCells.length) {
        flushRow();
      }

      continue;
    }

    if (line.startsWith("|")) {
      currentCells.push(line.slice(1).trim());
    }
  }

  if (currentCells.length) {
    flushRow();
  }

  return {
    sections: Array.from(sections.values()),
    lines
  };
}

async function resolveHero(input: FandomHeroLookupInput) {
  const where = input.heroId
    ? { heroId: input.heroId }
    : input.heroSlug
      ? { slug: input.heroSlug }
      : input.heroName
        ? { localizedName: input.heroName }
        : null;

  if (!where) {
    throw new Error("缺少英雄标识。请提供 heroId、heroSlug 或 heroName。");
  }

  const hero = await db.hero.findFirst({
    where,
    select: {
      heroId: true,
      slug: true,
      localizedName: true,
      name: true
    }
  });

  if (!hero) {
    throw new Error("未找到对应英雄。请先确认 Hero 表已完成同步。");
  }

  return hero;
}

async function fandomFetch<T>(searchParams: URLSearchParams) {
  const url = new URL(FANDOM_API_BASE);
  url.search = searchParams.toString();

  const response = await fetch(url, {
    headers: {
      Accept: "application/json"
    },
    next: { revalidate: 60 * 60 * 12 }
  });

  if (!response.ok) {
    throw new Error(`Fandom request failed: ${response.status}`);
  }

  return response.json() as Promise<T>;
}

async function fetchVoicePageWikitext(pageTitle: string) {
  const params = new URLSearchParams({
    action: "query",
    titles: pageTitle,
    prop: "revisions",
    rvprop: "content",
    rvslots: "main",
    formatversion: "2",
    format: "json"
  });

  const payload = await fandomFetch<FandomRevisionResponse>(params);
  const page = payload.query?.pages?.[0];
  const content = page?.revisions?.[0]?.slots?.main?.content;

  if (!page || page.missing || !content) {
    throw new Error(`Fandom 台词页不存在：${pageTitle}`);
  }

  return {
    pageTitle: page.title ?? pageTitle,
    content
  };
}

export async function getHeroVoiceReport(input: FandomHeroLookupInput): Promise<FandomHeroVoiceReport> {
  const hero = await resolveHero(input);
  const pageTitle = `${hero.localizedName}/台词`;
  const page = await fetchVoicePageWikitext(pageTitle);
  const parsed = parseVoiceWikitext(page.content);

  return {
    source: "fandom",
    hero: {
      heroId: hero.heroId,
      slug: hero.slug,
      localizedName: hero.localizedName,
      name: hero.name
    },
    pageTitle: page.pageTitle,
    sections: parsed.sections,
    lines: parsed.lines,
    headerLines: buildHeroHeaderLines({
      heroName: hero.localizedName,
      lines: parsed.lines
    })
  };
}