import { InvitationsPageView } from "@/components/real-pages";
import { getInvitationsData } from "@/lib/queries";
import { getViewer } from "@/lib/session";

export default async function MyInvitationsPage() {
  const viewer = await getViewer();
  const data = await getInvitationsData(viewer);

  return <InvitationsPageView invitations={data} viewer={viewer} />;
}