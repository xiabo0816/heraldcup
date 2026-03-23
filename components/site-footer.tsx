import Link from "next/link";

const footerGroups = [
  {
    title: "社区",
    links: [
      { href: "/community", label: "社区首页" },
      { href: "/content", label: "最新资讯" },
      { href: "/my", label: "认领自己" }
    ]
  },
  {
    title: "赛事",
    links: [
      { href: "/matches", label: "今晚赛程" },
      { href: "/teams", label: "战队榜" },
      { href: "/players", label: "选手墙" }
    ]
  },
  {
    title: "了解更多",
    links: [
      { href: "/community/rules", label: "社区规则" },
      { href: "/community/guide", label: "浏览指引" },
      { href: "/community/activities", label: "投稿与活动" },
      { href: "/admin", label: "内容维护" }
    ]
  }
] as const;

export function SiteFooter() {
  return (
    <footer className="mt-12 border-t border-white/10 bg-slate-950/60 backdrop-blur-xl">
      <div className="mx-auto grid max-w-7xl gap-8 px-6 py-8 lg:grid-cols-[0.95fr_1.05fr] lg:items-start">
        <div className="max-w-xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-cyan-300/20 bg-cyan-300/10 px-3 py-1.5 text-[11px] uppercase tracking-[0.22em] text-cyan-100">
            今晚就来社区
          </div>
          <h2 className="mt-4 text-xl font-semibold text-white">从页尾也能很快回到最常用的页面。</h2>
          <p className="mt-3 text-sm leading-7 text-slate-400">
            无论你是想看今晚赛程、补战报、逛社区，还是回到自己的主页，这里都留了最稳定的回路。
          </p>

          <div className="mt-5 flex flex-wrap gap-2 text-sm">
            <Link href="/matches" className="rounded-full border border-cyan-300/25 bg-cyan-300/10 px-4 py-2 font-semibold text-cyan-100 transition hover:border-cyan-300/45 hover:text-white">
              今晚赛程
            </Link>
            <Link href="/teams" className="rounded-full border border-white/15 px-4 py-2 font-semibold text-slate-200 transition hover:border-amber-300/40 hover:text-white">
              战队榜
            </Link>
            <Link href="/players" className="rounded-full border border-white/15 px-4 py-2 font-semibold text-slate-200 transition hover:border-cyan-300/40 hover:text-white">
              选手墙
            </Link>
            <Link href="/my" className="rounded-full border border-white/15 px-4 py-2 font-semibold text-slate-200 transition hover:border-emerald-300/40 hover:text-white">
              我的主页
            </Link>
            <Link href="/community" className="rounded-full border border-white/15 px-4 py-2 font-semibold text-slate-200 transition hover:border-cyan-300/40 hover:text-white">
              打开社区
            </Link>
          </div>

          <div className="mt-6 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs uppercase tracking-[0.18em] text-slate-500">
            <span>Dota2 社区赛事门户</span>
            <span className="h-1 w-1 rounded-full bg-white/20" />
            <span>Tonight First</span>
            <span className="h-1 w-1 rounded-full bg-white/20" />
            <span>Community Next</span>
          </div>
        </div>

        <div className="rounded-[28px] border border-white/10 bg-white/[0.03] p-5">
          <div className="grid gap-6 sm:grid-cols-3">
            {footerGroups.map((group) => (
              <div key={group.title}>
                <div className="text-xs uppercase tracking-[0.24em] text-slate-500">{group.title}</div>
                <div className="mt-4 space-y-3">
                  {group.links.map((link) => (
                    <Link key={link.href + link.label} href={link.href} className="block text-sm text-slate-300 transition hover:text-white">
                      {link.label}
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 border-t border-white/10 pt-4 text-xs text-slate-500">
            Herald Cup · 今晚赛程、社区热讯、人物与战报，都能从这里继续出发。
          </div>
        </div>
      </div>
    </footer>
  );
}