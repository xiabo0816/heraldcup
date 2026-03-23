import { MyPageClient } from "@/components/my-page-client";
import { Shell } from "@/components/shell";
import { getMatches, getPlayerReviews, getPlayers, getTeams } from "@/lib/queries";

export default async function MyPage() {
  const [players, teams, matches, reviews] = await Promise.all([getPlayers(), getTeams(), getMatches(), getPlayerReviews()]);

  return (
    <Shell>
      <MyPageClient players={players} teams={teams} matches={matches} reviews={reviews} />
    </Shell>
  );
}
