"use client";

import { useMemo } from "react";
import type { IdentitySnapshot } from "@/lib/identity";
import { sortMatchesByPriority } from "@/lib/my-page-utils";
import type { MyPageMatch, MyPagePlayer, MyPageReview, MyPageTeam, MyPageVisibleReview } from "@/lib/my-page-types";

export function useMyPageDerivedData({
  identity,
  players,
  teams,
  matches,
  reviews = []
}: {
  identity: IdentitySnapshot;
  players: MyPagePlayer[];
  teams: MyPageTeam[];
  matches: MyPageMatch[];
  reviews?: MyPageReview[];
}) {
  return useMemo(() => {
    const currentPlayer = identity.certifiedPlayer
      ? players.find((player) => player.id === identity.certifiedPlayer?.id) ?? null
      : null;
    const currentTeam = currentPlayer?.teamId ? teams.find((team) => team.id === currentPlayer.teamId) ?? null : null;
    const currentPlayerHighlightMatchIds = new Set(currentPlayer?.highlightMatchIds ?? []);
    const relatedMatches = currentPlayer
      ? sortMatchesByPriority(matches.filter((match) => {
          const relatedToCurrentTeam = currentPlayer.teamId ? match.participantTeamIds.includes(currentPlayer.teamId) : false;
          return relatedToCurrentTeam || currentPlayerHighlightMatchIds.has(match.slug);
        })).slice(0, 6)
      : [];
    const visibleCurrentPlayerReviews: MyPageVisibleReview[] = currentPlayer
      ? reviews
        .filter((review) => review.targetPlayerId === currentPlayer.id && review.showOnProfile)
        .map((review) => ({
          id: review.id,
          authorPlayerName: review.authorPlayerName,
          content: review.content
        }))
      : [];

    return {
      currentPlayer,
      currentTeam,
      relatedMatches,
      visibleCurrentPlayerReviews
    };
  }, [identity.certifiedPlayer?.id, matches, players, reviews, teams]);
}