import { MyPageClient } from "@/components/my-page-client";
import { Shell } from "@/components/shell";
import { getCurrentIdentitySnapshot } from "@/lib/identity";
import { getMatches, getPlayerReviews, getPlayers, getTeams } from "@/lib/queries";

export default async function MyPage() {
  const [identity, players, teams, matches, reviews] = await Promise.all([
    getCurrentIdentitySnapshot(),
    getPlayers(),
    getTeams(),
    getMatches(),
    getPlayerReviews()
  ]);

  return (
    <Shell>
      <MyPageClient identity={identity} players={players} teams={teams} matches={matches} reviews={reviews} />
    </Shell>
  );
}
