import { MatchesPageView } from "@/components/real-pages";
import { getMatchesPageData, resolveScope } from "@/lib/queries";
import { getViewer } from "@/lib/session";

export default async function MatchesPage({
  searchParams
}: {
  searchParams?: Promise<{ scope?: string }>;
}) {
  const params = (await searchParams) ?? {};
  const scope = resolveScope(params.scope);
  const [viewer, data] = await Promise.all([getViewer(), getMatchesPageData(scope)]);

  return <MatchesPageView data={data} scope={scope} viewer={viewer} />;
}