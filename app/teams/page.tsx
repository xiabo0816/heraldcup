import { TeamsPageView } from "@/components/real-pages";
import { getTeamsPageData, resolveScope } from "@/lib/queries";
import { getViewer } from "@/lib/session";

export default async function TeamsPage({
  searchParams
}: {
  searchParams?: Promise<{ scope?: string }>;
}) {
  const params = (await searchParams) ?? {};
  const scope = resolveScope(params.scope);
  const [viewer, data] = await Promise.all([getViewer(), getTeamsPageData(scope)]);

  return <TeamsPageView data={data} scope={scope} viewer={viewer} />;
}