"use client";

import { useState } from "react";
import { MyCertifiedPlayerPanel } from "@/components/my-certified-player-panel";
import { MyOpenDotaPanel } from "@/components/my-opendota-panel";
import type { IdentitySnapshot } from "@/lib/identity";
import type { MyPageMatch, MyPagePlayer, MyPageReview, MyPageTeam, MyPageVisibleReview } from "@/lib/my-page-types";

export function MyPlayerProfileWorkspace({
  identity,
  currentPlayer,
  currentTeam,
  players,
  teams,
  reviews,
  relatedMatches,
  visibleCurrentPlayerReviews
}: {
  identity: IdentitySnapshot;
  currentPlayer: MyPagePlayer | null;
  currentTeam: MyPageTeam | null;
  players: MyPagePlayer[];
  teams: MyPageTeam[];
  reviews: MyPageReview[];
  relatedMatches: MyPageMatch[];
  visibleCurrentPlayerReviews: MyPageVisibleReview[];
}) {
  const [openDotaPersonaName, setOpenDotaPersonaName] = useState<string | null>(null);
  const effectiveSteamId = identity.binding?.steamId ?? currentPlayer?.steamId ?? null;

  return (
    <>
      {effectiveSteamId ? (
        <MyOpenDotaPanel
          steamId={effectiveSteamId}
          playerName={currentPlayer?.displayName ?? identity.viewer?.name ?? "当前账号"}
          onProfileLoaded={(profile) => setOpenDotaPersonaName(profile.personaName)}
        />
      ) : null}

      {currentPlayer ? (
        <MyCertifiedPlayerPanel
          currentPlayer={currentPlayer}
          currentTeam={currentTeam}
          players={players}
          teams={teams}
          reviews={reviews}
          relatedMatches={relatedMatches}
          visibleCurrentPlayerReviews={visibleCurrentPlayerReviews}
          effectiveSteamId={effectiveSteamId}
          openDotaPersonaName={openDotaPersonaName}
        />
      ) : null}
    </>
  );
}