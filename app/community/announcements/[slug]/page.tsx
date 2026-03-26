import Link from "next/link";
import { notFound } from "next/navigation";
import { DetailHero } from "@/components/detail-hero";
import { Shell } from "@/components/shell";
import { getAnnouncementBySlug } from "@/lib/queries";

function formatDateLabel(value: Date | string | null) {
  if (!value) {
    return "待发布";
  }

  return new Date(value).toLocaleString("zh-CN", {
    month: "numeric",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  });
}

export default async function CommunityAnnouncementDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const announcement = await getAnnouncementBySlug(slug);

  if (!announcement) {
    notFound();
  }

  return (
    <Shell>
      <DetailHero
        eyebrow="Announcement Detail"
        badge={<span className="rounded-full border border-cyan-300/20 bg-cyan-300/10 px-4 py-2 text-xs uppercase tracking-[0.24em] text-cyan-100">{announcement.featured ? "重点公告" : "公告"}</span>}
        title={announcement.title}
        description={announcement.excerpt ?? "这条公告没有单独摘要。"}
        chips={<span className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-slate-300">发布时间：{formatDateLabel(announcement.publishedAt)}</span>}
        actions={[
          { href: "/community/announcements", label: "返回公告列表", variant: "solid" },
          { href: "/community", label: "回到社区首页", variant: "outline" }
        ]}
        stats={[
          { label: "公告级别", value: announcement.featured ? "重点" : "普通" },
          { label: "发布时间", value: formatDateLabel(announcement.publishedAt) }
        ]}
        className="bg-[radial-gradient(circle_at_top_left,rgba(56,189,248,0.16),transparent_24%),linear-gradient(180deg,rgba(2,6,23,0.98),rgba(15,23,42,0.95))]"
      />

      <section className="mt-6 brand-shell p-6">
        <article className="rounded-[28px] border border-white/10 bg-white/5 p-6 whitespace-pre-wrap text-sm leading-8 text-slate-300">
          {announcement.bodyText}
        </article>

        <div className="mt-6 flex flex-wrap gap-3">
          <Link href="/community/announcements" className="rounded-full bg-gradient-to-r from-cyan-300 to-emerald-300 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:opacity-90">返回公告列表</Link>
          <Link href="/community" className="rounded-full border border-white/15 px-5 py-3 text-sm font-semibold text-slate-100 transition hover:border-cyan-300/40 hover:text-white">回到社区首页</Link>
        </div>
      </section>
    </Shell>
  );
}