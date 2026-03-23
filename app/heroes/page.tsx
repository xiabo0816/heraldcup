import Image from "next/image";
import { Shell } from "@/components/shell";
import { getHeroDirectory } from "@/lib/queries";

const heroGroups = [
  {
    key: "str",
    label: "力量英雄",
    shortLabel: "力量",
    description: "按游戏里的属性分组先看前排、开团和耐久型英雄。",
    accent: "text-rose-200",
    panelClass: "from-rose-500/16 via-transparent to-transparent",
    borderClass: "border-rose-400/20",
    chipClass: "bg-rose-400/12 text-rose-100"
  },
  {
    key: "agi",
    label: "敏捷英雄",
    shortLabel: "敏捷",
    description: "中后期核心、切入点和持续输出通常都集中在这一组。",
    accent: "text-emerald-200",
    panelClass: "from-emerald-500/16 via-transparent to-transparent",
    borderClass: "border-emerald-400/20",
    chipClass: "bg-emerald-400/12 text-emerald-100"
  },
  {
    key: "int",
    label: "智力英雄",
    shortLabel: "智力",
    description: "控制、节奏、团战技能与法术爆发优先从这里找。",
    accent: "text-sky-200",
    panelClass: "from-sky-500/16 via-transparent to-transparent",
    borderClass: "border-sky-400/20",
    chipClass: "bg-sky-400/12 text-sky-100"
  },
  {
    key: "all",
    label: "全才英雄",
    shortLabel: "全才",
    description: "7.33 之后的全才组，兼具多维属性与更灵活的定位。",
    accent: "text-amber-200",
    panelClass: "from-amber-500/16 via-transparent to-transparent",
    borderClass: "border-amber-400/20",
    chipClass: "bg-amber-400/12 text-amber-100"
  }
] as const;

const attackTypeLabel: Record<string, string> = {
  Melee: "近战",
  Ranged: "远程"
};

const attackTypeBadgeClass: Record<string, string> = {
  Melee: "border-rose-300/25 bg-rose-400/10 text-rose-100",
  Ranged: "border-sky-300/25 bg-sky-400/10 text-sky-100"
};

export default async function HeroesPage() {
  const heroes = await getHeroDirectory();
  const heroCountByGroup = heroGroups.map((group) => ({
    ...group,
    heroes: heroes.filter((hero) => (hero.primaryAttr ?? "all") === group.key)
  }));

  return (
    <Shell>
      <section id="top" className="relative overflow-hidden rounded-[36px] border border-white/10 bg-[radial-gradient(circle_at_top_left,rgba(244,63,94,0.16),transparent_22%),radial-gradient(circle_at_top_right,rgba(56,189,248,0.16),transparent_24%),linear-gradient(180deg,rgba(2,6,23,0.98),rgba(15,23,42,0.95))] p-8 shadow-glow md:p-10">
        <div className="grid gap-8 xl:grid-cols-[1.15fr_0.85fr] xl:items-end">
          <div className="max-w-4xl">
            <div className="text-xs uppercase tracking-[0.3em] text-slate-300">Hero Directory</div>
            <h1 className="mt-3 text-4xl font-semibold tracking-tight text-white md:text-5xl">把英雄页改成更像游戏选人面板的浏览方式。</h1>
            <p className="mt-5 text-sm leading-8 text-slate-300 md:text-base">四个属性分区保持和游戏一致，组内按英雄固定顺序排布。现在你扫一眼就能找到熟悉的位置，不需要再在一堆大卡片里上下翻。</p>
          </div>

          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-1">
            <div className="rounded-[28px] border border-white/10 bg-slate-950/60 p-5">
              <div className="text-[11px] uppercase tracking-[0.24em] text-slate-500">英雄总数</div>
              <div className="mt-3 text-4xl font-semibold text-white">{heroes.length}</div>
              <p className="mt-2 text-sm text-slate-400">已按属性分区与游戏内固定顺序整理。</p>
            </div>
            <div className="rounded-[28px] border border-white/10 bg-slate-950/60 p-5">
              <div className="text-[11px] uppercase tracking-[0.24em] text-slate-500">快速跳转</div>
              <div className="mt-4 flex flex-wrap gap-2">
                {heroCountByGroup.map((group) => (
                  <a
                    key={group.key}
                    href={`#heroes-${group.key}`}
                    className={`inline-flex items-center gap-2 rounded-full border border-white/10 px-3 py-2 text-xs font-semibold tracking-[0.18em] transition hover:border-white/20 hover:text-white ${group.chipClass}`}
                  >
                    <span>{group.shortLabel}</span>
                    <span className="text-white/75">{group.heroes.length}</span>
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mt-6 space-y-6">
        {heroCountByGroup.map((group) => (
          <article id={`heroes-${group.key}`} key={group.key} className={`overflow-hidden rounded-[32px] border bg-panel/80 shadow-glow backdrop-blur ${group.borderClass}`}>
            <div className={`border-b border-white/10 bg-gradient-to-r ${group.panelClass} p-6`}>
              <div className="flex flex-wrap items-end justify-between gap-4">
                <div>
                  <div className={`text-xs uppercase tracking-[0.28em] ${group.accent}`}>{group.label}</div>
                  <h2 className="mt-2 text-3xl font-semibold text-white">{group.heroes.length ? `${group.heroes.length} 位已收录` : "暂未收录"}</h2>
                </div>
                <div className="flex items-center gap-3">
                  <p className="max-w-2xl text-sm leading-7 text-slate-300">{group.description}</p>
                  <a href="#top" className="hidden rounded-full border border-white/10 px-3 py-2 text-xs font-semibold tracking-[0.18em] text-slate-300 transition hover:border-white/20 hover:text-white md:inline-flex">返回顶部</a>
                </div>
              </div>
            </div>

            <div className="p-6">
              {group.heroes.length ? (
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6">
                  {group.heroes.map((hero) => (
                    <article key={hero.id} className="group overflow-hidden rounded-[22px] border border-white/10 bg-slate-950/70 transition hover:-translate-y-0.5 hover:border-white/20 hover:bg-slate-950/85">
                      <div className="relative aspect-[1.38] overflow-hidden bg-slate-950/60">
                        {hero.imageUrl ? (
                          <Image
                            src={hero.imageUrl}
                            alt={hero.localizedName}
                            fill
                            unoptimized
                            className="object-cover transition duration-300 group-hover:scale-[1.04]"
                          />
                        ) : (
                          <div className="flex h-full items-center justify-center text-4xl font-semibold tracking-[0.2em] text-slate-500">
                            {hero.localizedName.slice(0, 1).toUpperCase()}
                          </div>
                        )}

                        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/30 to-transparent" />

                        <div className="absolute inset-x-0 top-0 flex items-start justify-between p-3">
                          <div className={`rounded-full border px-2 py-1 text-[10px] font-semibold tracking-[0.18em] ${attackTypeBadgeClass[hero.attackType ?? ""] ?? "border-white/10 bg-slate-950/70 text-slate-300"}`}>
                            {attackTypeLabel[hero.attackType ?? ""] ?? "未标注"}
                          </div>
                          <div className="rounded-full border border-white/10 bg-slate-950/70 px-2 py-1 text-[10px] font-semibold tracking-[0.18em] text-slate-300">
                            #{hero.heroId ?? "--"}
                          </div>
                        </div>

                        <div className="absolute inset-x-0 bottom-0 p-3">
                          <div className="flex items-end gap-3">
                            {hero.iconUrl ? (
                              <Image
                                src={hero.iconUrl}
                                alt={hero.localizedName}
                                width={38}
                                height={38}
                                unoptimized
                                className="h-9 w-9 rounded-xl border border-white/10 object-cover shadow-lg"
                              />
                            ) : (
                              <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-slate-950/80 text-xs font-semibold text-slate-300">
                                {hero.localizedName.slice(0, 1).toUpperCase()}
                              </div>
                            )}

                            <div className="min-w-0 flex-1">
                              <h3 className="truncate text-sm font-semibold text-white sm:text-base">{hero.localizedName}</h3>
                              <p className="mt-1 truncate text-[11px] tracking-[0.14em] text-slate-300/85">{hero.roles.slice(0, 2).join(" / ") || "定位待补充"}</p>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="flex min-h-14 items-center justify-between gap-3 border-t border-white/10 px-3 py-2.5 text-[11px] text-slate-300">
                        <div className="truncate">{hero.roles.slice(2, 4).join(" / ") || hero.name.replace(/^npc_dota_hero_/, "")}</div>
                        <div className={`shrink-0 rounded-full px-2 py-1 font-semibold ${group.chipClass}`}>{group.shortLabel}</div>
                      </div>
                    </article>
                  ))}
                </div>
              ) : (
                <div className="rounded-[28px] border border-dashed border-white/10 bg-white/5 p-6 text-sm text-slate-400">英雄库暂时为空。若数据库还没同步英雄，请执行 prisma:seed:heroes 后再查看。</div>
              )}
            </div>
          </article>
        ))}
      </section>
    </Shell>
  );
}