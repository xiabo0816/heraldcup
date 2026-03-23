import Link from "next/link";
import { Shell } from "@/components/shell";

const guideSections = [
  {
    title: "首页先带你进入今晚主线",
    description: "一进站先看焦点比赛、个人主页入口、社区头条和荣誉榜，快速找到今晚最值得追的内容。"
  },
  {
    title: "比赛页集中看赛程与结果",
    description: "今晚与本周安排会优先排在前面，完赛结果也能顺着跳去战报、冠军页和社区讨论。"
  },
  {
    title: "内容页把资讯分层整理",
    description: "官方更新、赛事战报和归档海报分开陈列，补看内容时不容易迷路。"
  },
  {
    title: "社区页把热度继续接住",
    description: "公告、活动、讨论和人物都会回流到社区页，看完比赛后还能继续顺着热度逛下去。"
  }
] as const;

export default function CommunityGuidePage() {
  return (
    <Shell>
      <section className="relative overflow-hidden rounded-[36px] border border-white/10 bg-[radial-gradient(circle_at_top_left,rgba(244,114,182,0.16),transparent_24%),linear-gradient(180deg,rgba(2,6,23,0.98),rgba(15,23,42,0.95))] p-8 shadow-glow md:p-10">
        <div className="text-xs uppercase tracking-[0.3em] text-rose-200">Product Guide</div>
        <h1 className="mt-3 text-4xl font-semibold tracking-tight text-white md:text-5xl">第一次来站里，可以先从这里认识整条浏览路线。</h1>
        <p className="mt-5 max-w-3xl text-sm leading-8 text-slate-300 md:text-base">
          如果你想知道首页、比赛页、内容页和社区页分别适合看什么，这页会把最清晰的逛站方式讲给你。
        </p>

        <div className="mt-8 grid gap-4 md:grid-cols-2">
          {guideSections.map((section) => (
            <article key={section.title} className="rounded-[24px] border border-white/10 bg-slate-950/55 p-5">
              <div className="text-xl font-semibold text-white">{section.title}</div>
              <p className="mt-3 text-sm leading-7 text-slate-400">{section.description}</p>
            </article>
          ))}
        </div>

        <div className="mt-8 flex flex-wrap gap-3">
          <Link href="/matches" className="rounded-full bg-gradient-to-r from-rose-300 to-amber-300 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:opacity-90">
            去看比赛页
          </Link>
          <Link href="/content" className="rounded-full border border-white/15 px-5 py-3 text-sm font-semibold text-slate-100 transition hover:border-rose-300/40 hover:text-white">
            去看资讯流
          </Link>
        </div>
      </section>
    </Shell>
  );
}