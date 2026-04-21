import { LoginPageView } from "@/components/real-pages";
import { getViewer } from "@/lib/session";

export default async function LoginPage({
  searchParams
}: {
  searchParams?: Promise<{ redirectTo?: string }>;
}) {
  const [viewer, params] = await Promise.all([getViewer(), searchParams]);

  return <LoginPageView redirectTo={params?.redirectTo} viewer={viewer} />;
}