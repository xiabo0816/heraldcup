import Link from "next/link";
import { Shell } from "@/components/shell";

const rules = [
  {
    title: "讨论先围绕比赛与社区",
    description: "优先发布与赛事、战队、选手、战报、招募和活动有关的内容，减少无关灌水。"
  },
  {
    title: "赛后讨论欢迎有观点",
    description: "可以复盘、质疑和开玩笑，但不鼓励人身攻击、贴标签或持续挑衅。"
  },
  {
    title: "招募帖要写清楚需求",
    description: "如果是找队或补位，尽量写明位置、活跃时间、当前段位和联系方式。"
  },
  {
    title: "内容页优先给完整信息",
    description: "海报、快报和战报尽量补足赛季、比赛、主客队和摘要，方便内容回流。"
  }
] as const;

export default function CommunityRulesPage() {
  return (
    <Shell>
      <section className="relative overflow-hidden rounded-[36px] border border-white/10 bg-[radial-gradient(circle_at_top_left,rgba(56,189,248,0.16),transparent_24%),linear-gradient(180deg,rgba(2,6,23,0.98),rgba(15,23,42,0.95))] p-8 shadow-glow md:p-10">
        <div className="text-xs uppercase tracking-[0.3em] text-cyan-200">Community Rules</div>
        <h1 className="mt-3 text-4xl font-semibold tracking-tight text-white md:text-5xl">把规则说清楚，讨论才会更舒服。</h1>
        <p className="mt-5 max-w-3xl text-sm leading-8 text-slate-300 md:text-base">
          无论你是来聊比赛、发招募、看海报还是做赛后复盘，先把这些基本规则看一遍，交流会更顺畅，内容也更容易被大家接受。
        </p>

        <div className="mt-8 grid gap-4 md:grid-cols-2">
          {rules.map((rule, index) => (
            <article key={rule.title} className="rounded-[24px] border border-white/10 bg-slate-950/55 p-5">
              <div className="text-xs uppercase tracking-[0.22em] text-slate-500">规则 {index + 1}</div>
              <div className="mt-2 text-xl font-semibold text-white">{rule.title}</div>
              <p className="mt-3 text-sm leading-7 text-slate-400">{rule.description}</p>
            </article>
          ))}
        </div>

        <div className="mt-8 flex flex-wrap gap-3">
          <Link href="/community" className="rounded-full bg-gradient-to-r from-cyan-300 to-emerald-300 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:opacity-90">
            回到社区首页
          </Link>
          <Link href="/community/activities" className="rounded-full border border-white/15 px-5 py-3 text-sm font-semibold text-slate-100 transition hover:border-cyan-300/40 hover:text-white">
            看投稿与活动
          </Link>
        </div>
      </section>
    </Shell>
  );
}