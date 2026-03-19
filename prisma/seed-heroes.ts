import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

type OpenDotaHero = {
  id: number;
  name: string;
  localized_name: string;
  primary_attr?: string;
  attack_type?: string;
  roles?: string[];
  img?: string;
  icon?: string;
};

const openDotaBaseUrl = process.env.OPENDOTA_API_BASE_URL ?? "https://api.opendota.com/api";
const steamAssetBaseUrl = "https://cdn.cloudflare.steamstatic.com";

function resolveAssetUrl(path?: string) {
  if (!path) {
    return null;
  }

  if (path.startsWith("http://") || path.startsWith("https://")) {
    return path;
  }

  return `${steamAssetBaseUrl}${path}`;
}

function heroSlugFromName(name: string) {
  return name.replace(/^npc_dota_hero_/, "").replace(/_/g, "-");
}

async function main() {
  const response = await fetch(`${openDotaBaseUrl}/heroStats`, {
    headers: {
      Accept: "application/json"
    }
  });

  if (!response.ok) {
    throw new Error(`获取 OpenDota 英雄列表失败：${response.status} ${response.statusText}`);
  }

  const heroes = (await response.json()) as OpenDotaHero[];

  for (const hero of heroes) {
    await prisma.hero.upsert({
      where: {
        name: hero.name
      },
      update: {
        heroId: hero.id,
        slug: heroSlugFromName(hero.name),
        localizedName: hero.localized_name,
        primaryAttr: hero.primary_attr ?? null,
        attackType: hero.attack_type ?? null,
        roles: hero.roles ?? [],
        iconUrl: resolveAssetUrl(hero.icon),
        imageUrl: resolveAssetUrl(hero.img)
      },
      create: {
        heroId: hero.id,
        name: hero.name,
        slug: heroSlugFromName(hero.name),
        localizedName: hero.localized_name,
        primaryAttr: hero.primary_attr ?? null,
        attackType: hero.attack_type ?? null,
        roles: hero.roles ?? [],
        iconUrl: resolveAssetUrl(hero.icon),
        imageUrl: resolveAssetUrl(hero.img)
      }
    });
  }

  console.log(`已同步 ${heroes.length} 个 Dota2 英雄到数据库。`);
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