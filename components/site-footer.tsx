import Link from "next/link";
import { getAnnouncements, getCommunityTopics, getRecruitmentPosts, getTeams } from "@/lib/queries";

const footerGroups = [
  {
    title: "平台导航",
    links: [
      { href: "/matches", label: "比赛中心" },
      { href: "/players", label: "选手名册" },
      { href: "/teams", label: "战队荣誉" },
      { href: "/my", label: "我的身份" }
    ]
  },
  {
    title: "社区说明",
    links: [
      { href: "/community", label: "社区首页" },
      { href: "/community/rules", label: "社区规则" },
      { href: "/community/guide", label: "新手指引" },
      { href: "/content", label: "内容归档" }
    ]
  },
  {
    title: "运营支持",
    links: [
      { href: "/community/activities", label: "活动与投稿" },
      { href: "/community/recruitments", label: "招募入口" },
      { href: "/community/announcements", label: "公告板" },
      { href: "/admin", label: "内容维护" }
    ]
  }
] as const;

export async function SiteFooter() {
  const [announcements, topics, recruitments, teams] = await Promise.all([
    getAnnouncements(),
    getCommunityTopics(),
    getRecruitmentPosts(),
    getTeams()
  ]);

  const featuredAnnouncement = announcements[0] ?? null;
  const featuredTopic = topics[0] ?? null;
  const featuredRecruitment = recruitments[0] ?? null;
  const topTeam = [...teams].sort((left, right) => right.honorScore - left.honorScore || right.championshipCount - left.championshipCount)[0] ?? null;

  return (
    <footer className="mt-14 border-t border-white/10 bg-slate-950/60 backdrop-blur-xl">
      <div className="mx-auto grid max-w-[1280px] gap-8 px-4 py-10 sm:px-6 lg:grid-cols-[1.02fr_0.98fr] lg:px-8 lg:items-start">
        <div className="max-w-xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-cyan-300/20 bg-cyan-300/10 px-3 py-1.5 text-[11px] uppercase tracking-[0.22em] text-cyan-100">
            今晚就来社区
          </div>
          <h2 className="mt-4 text-2xl font-semibold text-white">页尾不只负责收尾，也要继续把人带回社区主线。</h2>
          <p className="mt-3 text-sm leading-7 text-slate-400">
            公告、话题、招募和榜首战队会在这里继续承接。你从任何页面滑到底，都还能很快找到今晚最值得继续点开的入口。
          </p>

          <div className="mt-5 flex flex-wrap gap-2 text-sm">
            <Link href="/matches" className="rounded-full border border-cyan-300/25 bg-cyan-300/10 px-4 py-2 font-semibold text-cyan-100 transition hover:border-cyan-300/45 hover:text-white">
              比赛中心
            </Link>
            <Link href="/community" className="rounded-full border border-white/15 px-4 py-2 font-semibold text-slate-200 transition hover:border-cyan-300/40 hover:text-white">
              社区主线
            </Link>
            <Link href="/content" className="rounded-full border border-white/15 px-4 py-2 font-semibold text-slate-200 transition hover:border-amber-300/40 hover:text-white">
              内容回流
            </Link>
            <Link href="/my" className="rounded-full border border-white/15 px-4 py-2 font-semibold text-slate-200 transition hover:border-emerald-300/40 hover:text-white">
              我的身份
            </Link>
            <Link href="/community/recruitments" className="rounded-full border border-white/15 px-4 py-2 font-semibold text-slate-200 transition hover:border-sky-300/40 hover:text-white">
              今晚招募
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

        <div className="space-y-5">
          <div className="grid gap-4 md:grid-cols-2">
            <Link href={featuredAnnouncement ? `/community/announcements/${featuredAnnouncement.slug}` : "/community/announcements"} className="rounded-[28px] border border-white/10 bg-white/[0.03] p-5 transition hover:border-cyan-300/30 hover:bg-white/[0.05]">
              <div className="text-[11px] uppercase tracking-[0.24em] text-cyan-100">当前公告</div>
              <div className="mt-3 text-lg font-semibold text-white">{featuredAnnouncement?.title ?? "公告板待补充"}</div>
              <p className="mt-2 text-sm leading-7 text-slate-400">{featuredAnnouncement?.excerpt ?? "赛程调整、活动提醒和规则更新会先汇到这里。"}</p>
            </Link>

            <div className="grid gap-4">
              <Link href={featuredTopic ? `/community/topics/${featuredTopic.slug}` : "/community/topics"} className="rounded-[24px] border border-white/10 bg-white/[0.03] p-4 transition hover:border-rose-300/30 hover:bg-white/[0.05]">
                <div className="text-[11px] uppercase tracking-[0.24em] text-rose-200">热门话题</div>
                <div className="mt-2 text-base font-semibold text-white">{featuredTopic ? `#${featuredTopic.title}` : "社区主线待补充"}</div>
                <div className="mt-1 text-sm text-slate-400">{featuredTopic?.description ?? "比赛、内容和招募会围绕同一条主线继续聚合。"}</div>
              </Link>

              <Link href={featuredRecruitment ? `/community/recruitments/${featuredRecruitment.slug}` : "/community/recruitments"} className="rounded-[24px] border border-white/10 bg-white/[0.03] p-4 transition hover:border-sky-300/30 hover:bg-white/[0.05]">
                <div className="text-[11px] uppercase tracking-[0.24em] text-sky-200">今晚招募</div>
                <div className="mt-2 text-base font-semibold text-white">{featuredRecruitment?.title ?? "招募入口待补充"}</div>
                <div className="mt-1 text-sm text-slate-400">{featuredRecruitment?.excerpt ?? "缺人补位、建队和约训练都能从这里继续往下走。"}</div>
              </Link>
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
            {topTeam ? `当前荣誉榜首 ${topTeam.name} · 社区积分 ${topTeam.honorScore}` : "Herald Cup · 今晚赛程、社区热讯、人物与战报，都能从这里继续出发。"}
          </div>
        </div>
        </div>
      </div>
    </footer>
  );
}