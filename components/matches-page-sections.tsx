"use client";

import { useMemo, useState } from "react";
import { MatchSeasonGraphView } from "@/components/match-season-graph";
import type { MatchSeasonGraph } from "@/lib/queries";
import { getTournamentTheme } from "@/lib/tournament-theme";

type MatchesPageSectionsProps = {
  seasonGraphs: MatchSeasonGraph[];
};

type FilterKey = "ALL" | "PIONEER" | "LEGEND" | "GUANJUE";

const FILTERS: Array<{ key: FilterKey; label: string }> = [
  { key: "ALL", label: "全部赛事" },
  { key: "PIONEER", label: "先锋杯" },
  { key: "LEGEND", label: "传奇杯" },
  { key: "GUANJUE", label: "冠绝杯" }
];

function resolveGraphFilterKey(graph: MatchSeasonGraph): FilterKey {
  const theme = getTournamentTheme(graph.tournamentKind, graph.tournamentName ?? graph.title);
  return theme.kind === "PIONEER" || theme.kind === "LEGEND" || theme.kind === "GUANJUE" ? theme.kind : "ALL";
}

export function MatchesPageSections({ seasonGraphs }: MatchesPageSectionsProps) {
  const [activeGraphFilter, setActiveGraphFilter] = useState<FilterKey>("ALL");
  const [searchTerm, setSearchTerm] = useState("");

  const scopedGraphs = useMemo(() => (
    activeGraphFilter === "ALL"
      ? seasonGraphs
      : seasonGraphs.filter((graph) => resolveGraphFilterKey(graph) === activeGraphFilter)
  ), [activeGraphFilter, seasonGraphs]);

  const visibleGraphs = useMemo(() => {
    const keyword = searchTerm.trim().toLowerCase();

    if (!keyword) {
      return scopedGraphs;
    }

    return scopedGraphs.filter((graph) => {
      const haystack = [graph.title, graph.tournamentName, graph.slug]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      return haystack.includes(keyword);
    });
  }, [scopedGraphs, searchTerm]);

  return (
    <section className="space-y-6">
      <div className="rounded-[32px] border border-white/10 bg-slate-950/35 p-6 backdrop-blur-sm">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <div className="text-xs uppercase tracking-[0.28em] text-slate-500">Season Graphs</div>
            <h2 className="mt-3 text-3xl font-semibold text-white md:text-4xl">我们全部的赛程图</h2>
          </div>
        </div>

        <div className="mt-6 flex flex-wrap gap-3">
          {FILTERS.map((filter) => (
            <button
              key={filter.key}
              type="button"
              onClick={() => setActiveGraphFilter(filter.key)}
              className={filter.key === activeGraphFilter
                ? "rounded-full border border-white bg-white px-4 py-2 text-sm font-semibold text-slate-950"
                : "rounded-full border border-slate-700 bg-slate-900/50 px-4 py-2 text-sm font-semibold text-slate-300 transition hover:border-slate-500 hover:text-white"
              }
            >
              {filter.label}
            </button>
          ))}
        </div>

        <div className="mt-5 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <label className="block md:max-w-md md:flex-1">
            <span className="sr-only">搜索当前标签内的赛程图</span>
            <input
              type="search"
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              placeholder="在当前标签内搜索赛事名或届次"
              className="w-full rounded-full border border-slate-700 bg-slate-900/60 px-4 py-3 text-sm text-slate-100 outline-none transition placeholder:text-slate-500 focus:border-white/30"
            />
          </label>
          <div className="text-sm text-slate-400">
            当前标签 {FILTERS.find((filter) => filter.key === activeGraphFilter)?.label} · {visibleGraphs.length} 条结果
          </div>
        </div>
      </div>

      {visibleGraphs.length ? visibleGraphs.map((graph) => (
        <MatchSeasonGraphView key={graph.id} graph={graph} />
      )) : (
        <div className="rounded-[32px] border border-dashed border-white/10 bg-slate-950/40 p-8 text-sm leading-8 text-slate-400">
          当前标签下没有匹配这次搜索的赛程图。
        </div>
      )}
    </section>
  );
}