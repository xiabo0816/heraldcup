export type PlayerPoolKey = "PIONEER" | "LEGEND" | "GUANJUE";

export type PlayerPoolMeta = {
  key: PlayerPoolKey;
  label: string;
  description: string;
};

export const PLAYER_POOL_META: Record<PlayerPoolKey, PlayerPoolMeta> = {
  PIONEER: {
    key: "PIONEER",
    label: "先锋池",
    description: "0 - 2999"
  },
  LEGEND: {
    key: "LEGEND",
    label: "传奇池",
    description: "3000 - 5999"
  },
  GUANJUE: {
    key: "GUANJUE",
    label: "冠绝池",
    description: "6000+ / 未定分"
  }
};

export function resolvePlayerPoolKey(ladderScore: number | null | undefined): PlayerPoolKey {
  if (ladderScore === null || ladderScore === undefined) {
    return "GUANJUE";
  }

  const normalizedScore = ladderScore;

  if (normalizedScore >= 6000) {
    return "GUANJUE";
  }

  if (normalizedScore >= 3000) {
    return "LEGEND";
  }

  return "PIONEER";
}

export function resolvePlayerPoolMeta(ladderScore: number | null | undefined): PlayerPoolMeta {
  return PLAYER_POOL_META[resolvePlayerPoolKey(ladderScore)];
}

export function groupPlayersByPool<T extends { ladderScore?: number | null }>(players: T[]) {
  return (Object.keys(PLAYER_POOL_META) as PlayerPoolKey[]).map((key) => ({
    ...PLAYER_POOL_META[key],
    players: players.filter((player) => resolvePlayerPoolKey(player.ladderScore) === key)
  }));
}