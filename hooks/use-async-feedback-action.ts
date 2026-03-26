"use client";

import { useState, useTransition } from "react";
import type { IdentityActionFeedback, IdentityFeedbackTone } from "@/lib/identity-client-types";

export function useAsyncFeedbackAction(initialMessage?: string) {
  const [message, setMessageState] = useState(initialMessage?.trim() ?? "");
  const [tone, setTone] = useState<IdentityFeedbackTone>("idle");
  const [isPending, startTransition] = useTransition();

  function setMessage(message: string, nextTone: IdentityFeedbackTone = "error") {
    setMessageState(message);
    setTone(message.trim() ? nextTone : "idle");
  }

  function clearMessage() {
    setMessageState("");
    setTone("idle");
  }

  function run(action: () => Promise<IdentityActionFeedback>) {
    startTransition(async () => {
      const result = await action();
      setMessage(result.message, result.ok ? "success" : "error");
    });
  }

  return {
    message,
    tone,
    setMessage,
    clearMessage,
    isPending,
    run
  };
}