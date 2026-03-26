import type { MyPageMatch } from "@/lib/my-page-types";

export function sortMatchesByPriority(matches: MyPageMatch[]) {
  const now = Date.now();

  return [...matches].sort((left, right) => {
    const leftTime = left.scheduledAt ? new Date(left.scheduledAt).getTime() : Number.MAX_SAFE_INTEGER;
    const rightTime = right.scheduledAt ? new Date(right.scheduledAt).getTime() : Number.MAX_SAFE_INTEGER;
    const leftUpcoming = leftTime >= now;
    const rightUpcoming = rightTime >= now;

    if (leftUpcoming !== rightUpcoming) {
      return leftUpcoming ? -1 : 1;
    }

    if (leftUpcoming) {
      return leftTime - rightTime;
    }

    return rightTime - leftTime;
  });
}

export function formatDateLabel(value: Date | string | null) {
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

export function formatMatchLabel(match: MyPageMatch) {
  const names = match.participantTeamNames.length ? match.participantTeamNames : [match.homeTeamName, match.awayTeamName].filter(Boolean);
  return names.length <= 2 ? names.join(" vs ") : names.join(" / ");
}