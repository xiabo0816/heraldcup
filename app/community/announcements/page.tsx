import Link from "next/link";
import { PageHero } from "@/components/page-hero";
import { Shell } from "@/components/shell";
import { getAnnouncements } from "@/lib/queries";

function formatDateLabel(value: Date | string | null) {
  if (!value) {
    return "待发布";
  }

  return new Date(value).toLocaleDateString("zh-CN", {
    month: "numeric",
    day: "numeric"
  });
}

export default async function CommunityAnnouncementsPage() {
  const announcements = await getAnnouncements();
  const featuredAnnouncement = announcements[0] ?? null;
  const featuredCount = announcements.filter((announcement) => announcement.featured).length;

  return (
    <Shell>
      <PageHero
        eyebrow="Announcements"
        badge="规则、通知、赛程提醒"
        title="社区公告与置顶更新"
        description="赛程调整、活动提醒、规则更新和置顶消息都会集中发布在这里。公告页不只是倒序列表，也承担社区广播站的角色。"
        actions={[
          { href: "/community/rules", label: "查看社区规则", variant: "solid" },
          { href: "/community/activities", label: "本周活动", variant: "outline" }
        ]}
        stats={[
          { label: "公告总数", value: announcements.length, description: "当前站内已发布的公告与通知。" },
          { label: "重点公告", value: featuredCount, description: "会优先在首页、社区页和页脚承接的公告数量。" },
          { label: "最新更新", value: featuredAnnouncement?.publishedAt ? formatDateLabel(featuredAnnouncement.publishedAt) : "待发布", description: "当前排在最前面的公告发布时间。" }
        ]}
        className="bg-[radial-gradient(circle_at_top_left,rgba(56,189,248,0.16),transparent_24%),linear-gradient(180deg,rgba(2,6,23,0.98),rgba(15,23,42,0.95))]"
        aside={featuredAnnouncement ? [
          <Link key={featuredAnnouncement.id} href={`/community/announcements/${featuredAnnouncement.slug}`} className="block rounded-[28px] border border-cyan-300/20 bg-cyan-300/10 p-5 transition hover:border-cyan-300/35">
            <div className="text-[11px] uppercase tracking-[0.24em] text-cyan-100">当前置顶</div>
            <div className="mt-3 text-xl font-semibold text-white">{featuredAnnouncement.title}</div>
            <p className="mt-3 text-sm leading-7 text-slate-300">{featuredAnnouncement.excerpt ?? "点开这条公告，查看完整安排和详细说明。"}</p>
          </Link>,
          <div key="announcement-hint" className="rounded-[28px] border border-white/10 bg-white/5 p-5">
            <div className="text-[11px] uppercase tracking-[0.24em] text-slate-500">浏览建议</div>
            <p className="mt-3 text-sm leading-7 text-slate-400">先看置顶公告，再看最近两三条更新，最后回到活动页或社区首页继续顺着当周节奏往下逛。</p>
          </div>
        ] : null}
      />

      <section className="mt-6 grid gap-4">
        {announcements.length ? announcements.map((announcement) => (
          <Link key={announcement.id} href={`/community/announcements/${announcement.slug}`} className="brand-shell p-6 transition hover:border-cyan-300/30 hover:bg-white/8">
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0 flex-1">
                <div className="text-xs uppercase tracking-[0.22em] text-cyan-200">{announcement.featured ? "重点公告" : "公告"}</div>
                <div className="mt-2 text-2xl font-semibold text-white">{announcement.title}</div>
                <p className="mt-3 text-sm leading-7 text-slate-400">{announcement.excerpt ?? "点开这条公告，查看完整安排和详细说明。"}</p>
              </div>
              <div className="rounded-full border border-white/10 bg-slate-950/60 px-3 py-1.5 text-xs font-semibold text-slate-200">{formatDateLabel(announcement.publishedAt)}</div>
            </div>
          </Link>
        )) : (
          <div className="brand-shell border-dashed p-6 text-sm leading-7 text-slate-400">目前还没有新的公告，稍后回来看看今晚是否有安排更新。</div>
        )}
      </section>
    </Shell>
  );
}