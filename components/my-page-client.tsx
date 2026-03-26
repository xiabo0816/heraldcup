"use client";

import { IdentityAccountPanel } from "@/components/identity-account-panel";
import { IdentityFlashToast } from "@/components/identity-flash-toast";
import { MyDashboard } from "@/components/my-dashboard";
import { MyIdentityWorkspace } from "@/components/my-identity-workspace";
import { MyPlayerProfileWorkspace } from "@/components/my-player-profile-workspace";
import { MyRecentClaimsPanel } from "@/components/my-recent-claims-panel";
import { useMyPageDerivedData } from "@/hooks/use-my-page-derived-data";
import type { IdentitySnapshot } from "@/lib/identity";
import type { MyPageMatch, MyPagePlayer, MyPageReview, MyPageTeam } from "@/lib/my-page-types";

type MyPageClientProps = {
  identity: IdentitySnapshot;
  players: MyPagePlayer[];
  teams: MyPageTeam[];
  matches: MyPageMatch[];
  reviews: MyPageReview[];
};

export function MyPageClient({ identity, players, teams, matches, reviews }: MyPageClientProps) {
  const { currentPlayer, currentTeam, relatedMatches, visibleCurrentPlayerReviews } = useMyPageDerivedData({
    identity,
    players,
    teams,
    matches,
    reviews
  });

  return (
    <div className="space-y-6">
      <IdentityFlashToast />

      <section>
        <IdentityAccountPanel identity={identity} />
      </section>

      <MyIdentityWorkspace identity={identity} players={players} />

      <MyPlayerProfileWorkspace
        identity={identity}
        currentPlayer={currentPlayer}
        currentTeam={currentTeam}
        players={players}
        teams={teams}
        reviews={reviews}
        relatedMatches={relatedMatches}
        visibleCurrentPlayerReviews={visibleCurrentPlayerReviews}
      />

      <MyRecentClaimsPanel identity={identity} />

      <MyDashboard identity={identity} players={players} teams={teams} matches={matches} />
    </div>
  );
}