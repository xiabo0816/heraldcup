import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

function stableSlug(value: string, prefix: string) {
  const normalized = value
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");

  if (normalized && /^[a-z0-9-]+$/.test(normalized) && /[a-z]/.test(normalized) && normalized.length >= 4) {
    return normalized;
  }

  return `${prefix}-${Buffer.from(value, "utf8").toString("hex").slice(0, 24)}`;
}

function isStableAsciiSlug(value: string | null | undefined) {
  return Boolean(value && /^[a-z0-9-]+$/.test(value) && /[a-z]/.test(value) && value.length >= 4);
}

function resolveUniqueSlug(baseSlug: string, usedSlugs: Set<string>, currentSlug?: string | null) {
  let candidate = baseSlug;
  let attempt = 2;

  while (usedSlugs.has(candidate) && candidate !== currentSlug) {
    candidate = `${baseSlug}-${attempt}`;
    attempt += 1;
  }

  return candidate;
}

function avatarUrl(displayName: string) {
  return `https://api.dicebear.com/9.x/thumbs/svg?seed=${encodeURIComponent(displayName)}&backgroundType=gradientLinear`;
}

async function main() {
  const players = await prisma.player.findMany({ select: { id: true, displayName: true, slug: true } });
  const usedPlayerSlugs = new Set<string>();
  for (const player of players) {
    const nextSlug = resolveUniqueSlug(stableSlug(player.displayName, "player"), usedPlayerSlugs, player.slug);
    await prisma.player.update({
      where: { id: player.id },
      data: {
        slug: nextSlug,
        avatarUrl: avatarUrl(player.displayName)
      }
    });
    usedPlayerSlugs.add(nextSlug);
  }

  const teams = await prisma.team.findMany({ select: { id: true, name: true, slug: true } });
  const usedTeamSlugs = new Set<string>();
  for (const team of teams) {
    const baseSlug = isStableAsciiSlug(team.slug) ? team.slug : stableSlug(team.name, "team");
    const desiredSlug = resolveUniqueSlug(baseSlug, usedTeamSlugs, team.slug);
    await prisma.team.update({
      where: { id: team.id },
      data: {
        slug: desiredSlug
      }
    });
    usedTeamSlugs.add(desiredSlug);
  }

  console.log(`已修复 ${players.length} 名选手与 ${teams.length} 支队伍的 slug/头像。`);
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });