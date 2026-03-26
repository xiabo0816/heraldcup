"use client";

import { useState } from "react";
import { useAsyncFeedbackAction } from "@/hooks/use-async-feedback-action";
import { useIdentityClient } from "@/hooks/use-identity-client";
import type { IdentitySnapshot } from "@/lib/identity";
import type { IdentityActionFeedback, IdentityFieldErrors } from "@/lib/identity-client-types";
import { bindSteamAccountSchema } from "@/lib/validators";

export function useIdentityWorkspaceState(identity: IdentitySnapshot) {
  const identityClient = useIdentityClient();
  const [steamId, setSteamId] = useState(identity.binding?.steamId ?? "");
  const [fieldErrors, setFieldErrors] = useState<IdentityFieldErrors>({});
  const bindSteamAction = useAsyncFeedbackAction();

  function updateSteamId(value: string) {
    setSteamId(value);
    setFieldErrors((current) => ({ ...current, steamId: undefined }));
    if (bindSteamAction.tone === "error") {
      bindSteamAction.clearMessage();
    }
  }

  function bindSteam() {
    const validation = bindSteamAccountSchema.safeParse({ steamId });

    if (!validation.success) {
      const issue = validation.error.issues[0];
      setFieldErrors({ steamId: issue?.message ?? "请输入正确的 SteamID。" });
      bindSteamAction.clearMessage();
      return;
    }

    setFieldErrors({});

    bindSteamAction.run(async () => {
      return identityClient.bindSteam({ steamId: steamId.trim() });
    });
  }

  async function cancelClaim(claimRequestId: string): Promise<IdentityActionFeedback> {
    const result = await identityClient.cancelClaim({ claimRequestId });
    return {
      ok: result.ok,
      message: result.message
    };
  }

  return {
    steamId,
    setSteamId: updateSteamId,
    fieldErrors,
    message: bindSteamAction.message,
    tone: bindSteamAction.tone,
    setMessage: bindSteamAction.setMessage,
    bindingPending: bindSteamAction.isPending,
    bindSteam,
    cancelClaim
  };
}