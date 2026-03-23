import Link from "next/link";
import { notFound } from "next/navigation";
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
      <section className="relative overflow-hidden rounded-[36px] border border-white/10 bg-[radial-gradient(circle_at_top_left,rgba(56,189,248,0.16),transparent_24%),linear-gradient(180deg,rgba(2,6,23,0.98),rgba(15,23,42,0.95))] p-8 shadow-glow md:p-10">
        <div className="inline-flex rounded-full border border-cyan-300/20 bg-cyan-300/10 px-4 py-2 text-xs uppercase tracking-[0.24em] text-cyan-100">
          {announcement.featured ? "重点公告" : "公告"}
        </div>
        <h1 className="mt-5 text-4xl font-semibold tracking-tight text-white md:text-5xl">{announcement.title}</h1>
        <p className="mt-4 max-w-3xl text-sm leading-8 text-slate-300 md:text-base">{announcement.excerpt ?? "这条公告没有单独摘要。"}</p>
        <div className="mt-6 text-sm text-slate-400">发布时间：{formatDateLabel(announcement.publishedAt)}</div>
      </section>

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