import { PlayersPageView } from "@/components/real-pages";
import { getPlayersPageData, resolveScope } from "@/lib/queries";
import { getViewer } from "@/lib/session";

export default async function PlayersPage({
  searchParams
}: {
  searchParams?: Promise<{ scope?: string }>;
}) {
  const params = (await searchParams) ?? {};
  const scope = resolveScope(params.scope);
  const [viewer, data] = await Promise.all([getViewer(), getPlayersPageData(scope)]);

  return <PlayersPageView data={data} scope={scope} viewer={viewer} />;
}