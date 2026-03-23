import Link from "next/link";
import { notFound } from "next/navigation";
import { Shell } from "@/components/shell";
import { getCommunityEventBySlug } from "@/lib/queries";

function formatDateLabel(value: Date | string | null) {
  if (!value) {
    return "时间待定";
  }

  return new Date(value).toLocaleString("zh-CN", {
    month: "numeric",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  });
}

export default async function CommunityEventDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const event = await getCommunityEventBySlug(slug);

  if (!event) {
    notFound();
  }

  return (
    <Shell>
      <section className="relative overflow-hidden rounded-[36px] border border-white/10 bg-[radial-gradient(circle_at_top_left,rgba(16,185,129,0.16),transparent_24%),linear-gradient(180deg,rgba(2,6,23,0.98),rgba(15,23,42,0.95))] p-8 shadow-glow md:p-10">
        <div className="inline-flex rounded-full border border-emerald-300/20 bg-emerald-300/10 px-4 py-2 text-xs uppercase tracking-[0.24em] text-emerald-100">{event.status}</div>
        <h1 className="mt-5 text-4xl font-semibold tracking-tight text-white md:text-5xl">{event.title}</h1>
        <p className="mt-4 max-w-3xl text-sm leading-8 text-slate-300 md:text-base">{event.summary ?? "这是一场面向社区成员的活动，继续往下看就能了解完整安排。"}</p>
        <div className="mt-6 flex flex-wrap gap-3 text-sm text-slate-300">
          <span>开始：{formatDateLabel(event.startsAt)}</span>
          {event.endsAt ? <span>结束：{formatDateLabel(event.endsAt)}</span> : null}
          {event.location ? <span>地点：{event.location}</span> : null}
        </div>
      </section>

      <section className="mt-6 grid gap-6 xl:grid-cols-[0.96fr_1.04fr]">
        <article className="brand-shell p-6">
          <div className="section-kicker">活动说明</div>
          <article className="mt-4 rounded-[24px] border border-white/10 bg-white/5 p-5 whitespace-pre-wrap text-sm leading-8 text-slate-300">{event.bodyText}</article>
          <div className="mt-6 flex flex-wrap gap-3">
            {event.ctaHref ? <Link href={event.ctaHref} className="rounded-full bg-gradient-to-r from-emerald-300 to-cyan-300 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:opacity-90">{event.ctaLabel ?? "参与活动"}</Link> : null}
            <Link href="/community/activities" className="rounded-full border border-white/15 px-5 py-3 text-sm font-semibold text-slate-100 transition hover:border-emerald-300/40 hover:text-white">返回活动页</Link>
          </div>
        </article>

        <article className="brand-shell p-6">
          <div className="section-kicker">关联主线</div>
          <div className="mt-6 space-y-4">
            {event.topic ? (
              <Link href={`/community/topics/${event.topic.slug}`} className="block rounded-[24px] border border-cyan-300/20 bg-cyan-300/10 p-5 transition hover:border-cyan-300/40">
                <div className="text-xs uppercase tracking-[0.22em] text-cyan-100">所属话题</div>
                <div className="mt-2 text-xl font-semibold text-white">#{event.topic.title}</div>
                <p className="mt-3 text-sm leading-7 text-slate-300">{event.topic.description ?? "从这场活动回到话题主线，还能继续追相关比赛与内容。"}</p>
              </Link>
            ) : null}

            {event.relatedMatches.map((match) => (
              <Link key={match.id} href={`/matches/${match.slug}`} className="block rounded-[20px] border border-white/10 bg-white/[0.03] px-4 py-4 transition hover:border-white/20">
                <div className="text-xs uppercase tracking-[0.18em] text-slate-500">{match.status}</div>
                <div className="mt-2 text-lg font-semibold text-white">{match.title}</div>
                <div className="mt-2 text-sm text-slate-400">{match.homeTeamName} vs {match.awayTeamName}</div>
              </Link>
            ))}

            {event.relatedContentPages.map((page) => (
              <Link key={page.id} href={`/content/${page.slug}`} className="block rounded-[20px] border border-white/10 bg-white/[0.03] px-4 py-4 transition hover:border-white/20">
                <div className="text-xs uppercase tracking-[0.18em] text-slate-500">{page.pageType}</div>
                <div className="mt-2 text-lg font-semibold text-white">{page.title}</div>
                <div className="mt-2 text-sm text-slate-400">{page.excerpt ?? "点开继续看这场活动相关的完整内容。"}</div>
              </Link>
            ))}

            {event.relatedRecruitments.map((post) => (
              <Link key={post.id} href={`/community/recruitments/${post.slug}`} className="block rounded-[20px] border border-white/10 bg-white/[0.03] px-4 py-4 transition hover:border-white/20">
                <div className="text-xs uppercase tracking-[0.18em] text-slate-500">{post.status}</div>
                <div className="mt-2 text-lg font-semibold text-white">{post.title}</div>
                <div className="mt-2 text-sm text-slate-400">{post.teamName}</div>
              </Link>
            ))}
          </div>
        </article>
      </section>
    </Shell>
  );
}