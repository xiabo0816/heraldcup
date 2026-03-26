import { Shell } from "@/components/shell";
import { MatchesPageBanner } from "@/components/matches-page-banner";
import { MatchesPageSections } from "@/components/matches-page-sections";
import { getMatchSeasonGraphs } from "@/lib/queries";

export default async function MatchesPage() {
  const seasonGraphs = await getMatchSeasonGraphs();

  return (
    <Shell>
      <section className="space-y-6">
        <MatchesPageBanner seasonGraphs={seasonGraphs} />
        <MatchesPageSections seasonGraphs={seasonGraphs} />
      </section>
    </Shell>
  );
}
