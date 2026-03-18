import Link from "next/link";
import { Shell } from "@/components/shell";
import { SectionCard } from "@/components/section-card";

const adminEntries = [
  {
    href: "/admin/players",
    title: "选手管理",
    description: "维护 SteamID、位置、擅长英雄、高光比赛和 OpenDota 报告刷新。"
  },
  {
    href: "/admin/teams",
    title: "队伍管理",
    description: "维护队伍基础信息、slogan、教练和队员编制。"
  },
  {
    href: "/admin/matches",
    title: "比赛管理",
    description: "维护赛程、比分、解说入口、内容页和高光记录。"
  },
  {
    href: "/admin/tournaments",
    title: "赛事管理",
    description: "维护赛事系列、届次、首页推荐和状态流转。"
  },
  {
    href: "/admin/content-pages",
    title: "内容页管理",
    description: "维护海报页、冠军页、快报页和赛后战报，并挂载到具体比赛。"
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
