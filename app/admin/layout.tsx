import { redirect } from "next/navigation";
import { requireAdminViewer } from "@/lib/identity";

export default async function AdminLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  try {
    await requireAdminViewer();
  } catch {
    redirect("/my");
  }

  return children;
}