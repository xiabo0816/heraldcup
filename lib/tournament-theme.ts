export type TournamentThemeKind = "PIONEER" | "GUANJUE" | "LEGEND" | "CUSTOM";

export type TournamentTheme = {
  kind: TournamentThemeKind;
  label: string;
  pageBackground: string;
  panelBorder: string;
  panelBackground: string;
  badgeClass: string;
  titleGradient: string;
  primaryButton: string;
  secondaryButton: string;
  primaryCard: string;
  secondaryCard: string;
  infoIcon: string;
  divider: string;
  accentText: string;
  trophyText: string;
  spotlightGlow: string;
};

const THEMES: Record<TournamentThemeKind, TournamentTheme> = {
  PIONEER: {
    kind: "PIONEER",
    label: "先锋杯",
    pageBackground: "bg-[radial-gradient(circle_at_top,#0f766e_0,#020617_58%,#020617_100%)]",
    panelBorder: "border-emerald-400/25",
    panelBackground: "bg-slate-900/60",
    badgeClass: "border-emerald-400/60 bg-slate-950/40 text-sky-200",
    titleGradient: "from-emerald-400 to-sky-400",
    primaryButton: "bg-gradient-to-r from-emerald-500/90 to-sky-500/90 text-slate-950 shadow-emerald-500/30",
    secondaryButton: "border-emerald-400/50 bg-emerald-400/10 text-emerald-100 hover:bg-emerald-400/20",
    primaryCard: "border-emerald-400/45 bg-gradient-to-br from-slate-950/50 to-emerald-900/10 shadow-emerald-500/10",
    secondaryCard: "border-sky-400/45 bg-gradient-to-br from-slate-950/50 to-sky-900/10 shadow-sky-500/10",
    infoIcon: "border-emerald-400/40 bg-emerald-400/10 text-emerald-200",
    divider: "via-emerald-300/35",
    accentText: "text-emerald-200",
    trophyText: "text-sky-200",
    spotlightGlow: "bg-[radial-gradient(circle_at_15%_0%,rgba(52,211,153,0.18),transparent_55%),radial-gradient(circle_at_85%_100%,rgba(56,189,248,0.22),transparent_60%),radial-gradient(circle_at_65%_15%,rgba(16,185,129,0.12),transparent_55%)]"
  },
  GUANJUE: {
    kind: "GUANJUE",
    label: "冠绝杯",
    pageBackground: "bg-[radial-gradient(circle_at_top,#7f1d1d_0,#020617_58%,#020617_100%)]",
    panelBorder: "border-rose-400/25",
    panelBackground: "bg-slate-900/60",
    badgeClass: "border-rose-400/60 bg-slate-950/40 text-rose-200",
    titleGradient: "from-rose-400 to-amber-400",
    primaryButton: "bg-gradient-to-r from-rose-500/90 to-amber-500/90 text-slate-950 shadow-rose-500/30",
    secondaryButton: "border-rose-400/50 bg-rose-400/10 text-rose-100 hover:bg-rose-400/20",
    primaryCard: "border-rose-400/45 bg-gradient-to-br from-slate-950/50 to-rose-900/10 shadow-rose-500/10",
    secondaryCard: "border-amber-400/45 bg-gradient-to-br from-slate-950/50 to-amber-900/10 shadow-amber-500/10",
    infoIcon: "border-rose-400/40 bg-rose-400/10 text-rose-200",
    divider: "via-rose-300/35",
    accentText: "text-rose-200",
    trophyText: "text-amber-200",
    spotlightGlow: "bg-[radial-gradient(circle_at_15%_0%,rgba(251,113,133,0.18),transparent_60%),radial-gradient(circle_at_85%_100%,rgba(251,191,36,0.22),transparent_60%)]"
  },
  LEGEND: {
    kind: "LEGEND",
    label: "传奇杯",
    pageBackground: "bg-[radial-gradient(circle_at_top,#581c87_0,#020617_58%,#020617_100%)]",
    panelBorder: "border-violet-400/25",
    panelBackground: "bg-slate-900/60",
    badgeClass: "border-violet-400/60 bg-slate-950/40 text-violet-200",
    titleGradient: "from-violet-400 to-amber-400",
    primaryButton: "bg-gradient-to-r from-violet-500/90 to-amber-500/90 text-slate-950 shadow-violet-500/30",
    secondaryButton: "border-violet-400/50 bg-violet-400/10 text-violet-100 hover:bg-violet-400/20",
    primaryCard: "border-violet-400/45 bg-gradient-to-br from-slate-950/50 to-violet-900/10 shadow-violet-500/10",
    secondaryCard: "border-amber-400/45 bg-gradient-to-br from-slate-950/50 to-amber-900/10 shadow-amber-500/10",
    infoIcon: "border-violet-400/40 bg-violet-400/10 text-violet-200",
    divider: "via-violet-300/35",
    accentText: "text-violet-200",
    trophyText: "text-amber-200",
    spotlightGlow: "bg-[radial-gradient(circle_at_15%_0%,rgba(167,139,250,0.22),transparent_60%),radial-gradient(circle_at_85%_100%,rgba(245,158,11,0.24),transparent_60%)]"
  },
  CUSTOM: {
    kind: "CUSTOM",
    label: "社区赛事",
    pageBackground: "bg-[radial-gradient(circle_at_top,#1e293b_0,#020617_58%,#020617_100%)]",
    panelBorder: "border-cyan-400/20",
    panelBackground: "bg-slate-900/60",
    badgeClass: "border-cyan-400/60 bg-slate-950/40 text-cyan-200",
    titleGradient: "from-cyan-400 to-emerald-400",
    primaryButton: "bg-gradient-to-r from-cyan-500/90 to-emerald-500/90 text-slate-950 shadow-cyan-500/30",
    secondaryButton: "border-cyan-400/50 bg-cyan-400/10 text-cyan-100 hover:bg-cyan-400/20",
    primaryCard: "border-cyan-400/40 bg-gradient-to-br from-slate-950/50 to-cyan-900/10 shadow-cyan-500/10",
    secondaryCard: "border-emerald-400/40 bg-gradient-to-br from-slate-950/50 to-emerald-900/10 shadow-emerald-500/10",
    infoIcon: "border-cyan-400/40 bg-cyan-400/10 text-cyan-200",
    divider: "via-cyan-300/35",
    accentText: "text-cyan-200",
    trophyText: "text-emerald-200",
    spotlightGlow: "bg-[radial-gradient(circle_at_15%_0%,rgba(34,211,238,0.18),transparent_55%),radial-gradient(circle_at_85%_100%,rgba(52,211,153,0.18),transparent_60%)]"
  }
};

export function inferTournamentKind(value?: string | null): TournamentThemeKind {
  const normalized = value?.trim().toLowerCase() ?? "";

  if (normalized.includes("先锋") || normalized.includes("pioneer")) {
    return "PIONEER";
  }

  if (normalized.includes("冠绝") || normalized.includes("guanjue")) {
    return "GUANJUE";
  }

  if (normalized.includes("传奇") || normalized.includes("legend")) {
    return "LEGEND";
  }

  return "CUSTOM";
}

export function getTournamentTheme(kind?: string | null, fallbackName?: string | null) {
  const resolvedKind = (kind as TournamentThemeKind | undefined) ?? inferTournamentKind(fallbackName);
  return THEMES[resolvedKind] ?? THEMES.CUSTOM;
}