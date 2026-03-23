import Link from "next/link";
import { Shell } from "@/components/shell";
import { SectionCard } from "@/components/section-card";

const adminEntries = [
  {
    href: "/admin/players",
    title: "选手管理",
    description: "录入选手身份信息、擅长英雄、代表比赛和战绩画像。"
  },
  {
    href: "/admin/teams",
    title: "队伍管理",
    description: "维护队伍资料、口号、教练、队长和赛季归属。"
  },
  {
    href: "/admin/matches",
    title: "比赛管理",
    description: "维护赛程、比分、直播链接、关联内容和高光节点。"
  },
  {
    href: "/admin/tournaments",
    title: "赛事管理",
    description: "维护赛事系列、届次信息、展示标题和首页推荐赛季。"
  },
  {
    href: "/admin/content-pages",
    title: "内容页管理",
    description: "维护海报、冠军页、快报与战报，并关联到对应比赛或话题。"
  },
  {
    href: "/admin/announcements",
    title: "公告管理",
    description: "维护社区首页置顶公告、赛程提醒和重要更新通知。"
  },
  {
    href: "/admin/topics",
    title: "话题管理",
    description: "维护热门话题、活动标签和社区页的主线聚合。"
  },
  {
    href: "/admin/recruitments",
    title: "招募帖管理",
    description: "维护招募组队、补位需求和对外展示的联系信息。"
  },
  {
    href: "/admin/events",
    title: "活动管理",
    description: "维护观赛夜、竞猜和专题活动，并挂接到对应话题与内容。"
  }
];

export default function AdminPage() {
  return (
    <Shell>
      <SectionCard title="管理后台" eyebrow="Admin">
        <div className="grid gap-4 md:grid-cols-2">
          {adminEntries.map((entry) => (
            <Link key={entry.href} href={entry.href} className="rounded-3xl border border-white/10 bg-white/5 p-5 transition hover:border-accent-cyan/40">
              <h3 className="text-xl font-semibold text-white">{entry.title}</h3>
              <p className="mt-3 text-sm leading-7 text-slate-400">{entry.description}</p>
            </Link>
          ))}
        </div>
      </SectionCard>
    </Shell>
  );
}
