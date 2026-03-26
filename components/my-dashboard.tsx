"use client";

import { MyDashboardCertifiedPanel } from "@/components/my-dashboard-certified-panel";
import { useMyPageDerivedData } from "@/hooks/use-my-page-derived-data";
import type { IdentitySnapshot } from "@/lib/identity";
import type { MyPageMatch, MyPagePlayer, MyPageTeam } from "@/lib/my-page-types";

export function MyDashboard({
  identity,
  players,
  teams,
  matches
}: {
  identity: IdentitySnapshot;
  players: MyPagePlayer[];
  teams: MyPageTeam[];
  matches: MyPageMatch[];
}) {
  const { currentPlayer, currentTeam, relatedMatches } = useMyPageDerivedData({
    identity,
    players,
    teams,
    matches
  });

  if (!currentPlayer) {
    return null;
  }

  return <MyDashboardCertifiedPanel identity={identity} currentPlayer={currentPlayer} currentTeam={currentTeam} relatedMatches={relatedMatches} />;
}