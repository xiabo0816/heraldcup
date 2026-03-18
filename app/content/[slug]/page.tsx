import Link from "next/link";
import { notFound } from "next/navigation";
import { Shell } from "@/components/shell";
import { SectionCard } from "@/components/section-card";
import { getContentPageBySlug } from "@/lib/queries";

export default async function ContentDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const page = await getContentPageBySlug(slug);

  if (!page) {
    notFound();
  }

  return (
    <Shell>
      <SectionCard title={page.title} eyebrow={page.pageType}>
        <div className="space-y-4 text-sm leading-7 text-slate-300">
          <p>内容 slug：{page.slug}</p>
          <p>发布时间：{page.publishedAt ? new Date(page.publishedAt).toLocaleString("zh-CN") : "未设置"}</p>
          <p>赛事：{page.tournamentName ?? "未绑定赛事"}{page.seasonTitle ? ` / ${page.seasonTitle}` : ""}</p>
          {page.matchSlug ? (
            <div className="rounded-3xl border border-white/10 bg-white/5 p-5">
              <div className="text-xs uppercase tracking-[0.22em] text-accent-gold">关联对阵</div>
              <div className="mt-3 flex flex-wrap items-center gap-3 text-base font-semibold text-white">
                {page.homeTeamSlug ? (
                  <Link href={`/teams/${page.homeTeamSlug}`} className="transition hover:text-cyan-200">
                    {page.homeTeamName ?? "待定"}
                  </Link>
                ) : (
                  <span>{page.homeTeamName ?? "待定"}</span>
                )}
                <span className="text-slate-500">vs</span>
                {page.awayTeamSlug ? (
                  <Link href={`/teams/${page.awayTeamSlug}`} className="transition hover:text-amber-200">
                    {page.awayTeamName ?? "待定"}
                  </Link>
                ) : (
                  <span>{page.awayTeamName ?? "待定"}</span>
                )}
              </div>
            </div>
          ) : null}
          <p>{page.excerpt ?? "暂无摘要"}</p>
          <div className="rounded-3xl border border-white/10 bg-white/5 p-5 whitespace-pre-wrap">{page.bodyText}</div>
          {page.matchSlug ? (
            <div className="flex flex-wrap gap-3">
              <Link href={`/matches/${page.matchSlug}`} className="inline-flex rounded-full border border-white/15 px-4 py-2 text-sm font-semibold text-slate-100 transition hover:border-accent-cyan/40">
                查看关联比赛：{page.matchTitle}
              </Link>
              {page.homeTeamSlug ? (
                <Link href={`/teams/${page.homeTeamSlug}`} className="inline-flex rounded-full border border-cyan-400/20 bg-cyan-400/5 px-4 py-2 text-sm font-semibold text-cyan-100 transition hover:border-cyan-300/40">
                  查看主队
                </Link>
              ) : null}
              {page.awayTeamSlug ? (
                <Link href={`/teams/${page.awayTeamSlug}`} className="inline-flex rounded-full border border-amber-400/20 bg-amber-400/5 px-4 py-2 text-sm font-semibold text-amber-100 transition hover:border-amber-300/40">
                  查看客队
                </Link>
              ) : null}
            </div>
          ) : null}
        </div>
      </SectionCard>
    </Shell>
  );
}
