import Link from "next/link";
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

  return (
    <Shell>
      <section className="relative overflow-hidden rounded-[36px] border border-white/10 bg-[radial-gradient(circle_at_top_left,rgba(56,189,248,0.16),transparent_24%),linear-gradient(180deg,rgba(2,6,23,0.98),rgba(15,23,42,0.95))] p-8 shadow-glow md:p-10">
        <div className="text-xs uppercase tracking-[0.3em] text-cyan-200">Announcements</div>
        <h1 className="mt-3 text-4xl font-semibold tracking-tight text-white md:text-5xl">社区公告与置顶更新</h1>
        <p className="mt-5 max-w-3xl text-sm leading-8 text-slate-300 md:text-base">
          赛程调整、活动提醒、规则更新和置顶消息都会集中发布在这里。想最快掌握今晚的重要变化，先看公告就够了。
        </p>
      </section>

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