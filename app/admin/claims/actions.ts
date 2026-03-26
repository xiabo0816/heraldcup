"use server";

import { revalidatePath } from "next/cache";
import { requireAdminViewer } from "@/lib/identity";
import { reviewClaimRequest } from "@/lib/identity-workflow";
import { reviewClaimRequestSchema } from "@/lib/validators";

export async function reviewClaimRequestAction(formData: FormData) {
  const admin = await requireAdminViewer();
  const viewer = admin.viewer;
  const payload = reviewClaimRequestSchema.safeParse({
    claimRequestId: formData.get("claimRequestId"),
    decision: formData.get("decision"),
    reviewNote: formData.get("reviewNote")
  });

  if (!payload.success) {
    return;
  }

  if (!viewer) {
    return;
  }

  await reviewClaimRequest({
    reviewerId: viewer.id,
    claimRequestId: payload.data.claimRequestId,
    decision: payload.data.decision,
    reviewNote: payload.data.reviewNote?.trim() || null
  });

  revalidatePath("/admin/claims");
  revalidatePath("/admin");
  revalidatePath("/my");
  revalidatePath("/players");
}