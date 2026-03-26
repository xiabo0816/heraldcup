"use client";

import { useMemo, useState } from "react";
import { useAsyncTask } from "@/hooks/use-async-task";
import { useIdentityClient } from "@/hooks/use-identity-client";
import type { IdentityClaimPayload, IdentityFieldErrors } from "@/lib/identity-client-types";
import type { IdentitySnapshot } from "@/lib/identity";
import { createClaimRequestSchema } from "@/lib/validators";

export type ClaimDialogPlayer = {
  id: string;
  displayName: string;
  subtitle?: string;
};

export type ClaimPlayerDialogState = {
  selectedPlayerId: string;
  setSelectedPlayerId: (value: string) => void;
  note: string;
  setNote: (value: string) => void;
  isDialogOpen: boolean;
  error: string | null;
  fieldErrors: IdentityFieldErrors;
  isPending: boolean;
  availablePlayers: ClaimDialogPlayer[];
  activeSelectedPlayerId: string;
  selectedPlayer: ClaimDialogPlayer | null;
  canSubmitClaim: boolean;
  openDialog: () => void;
  closeDialog: () => void;
  submitClaim: () => void;
};

export function useClaimPlayerDialog({
  identity,
  players,
  playerId
}: {
  identity: IdentitySnapshot;
  players: ClaimDialogPlayer[];
  playerId?: string;
}): ClaimPlayerDialogState {
  const identityClient = useIdentityClient();
  const [selectedPlayerId, setSelectedPlayerId] = useState(playerId ?? players[0]?.id ?? "");
  const [note, setNote] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<IdentityFieldErrors>({});
  const { error, setError, clearError, isPending, run } = useAsyncTask();

  const availablePlayers = useMemo(
    () => (playerId ? players.filter((player) => player.id === playerId) : players),
    [playerId, players]
  );
  const activeSelectedPlayerId = playerId ?? selectedPlayerId;
  const selectedPlayer = availablePlayers.find((player) => player.id === activeSelectedPlayerId) ?? availablePlayers[0] ?? null;
  const canSubmitClaim = Boolean(identity.viewer && identity.binding && !identity.certifiedPlayer && !identity.activeClaim);

  function openDialog() {
    const nextPlayerId = playerId ?? availablePlayers[0]?.id ?? "";
    setSelectedPlayerId(nextPlayerId);
    setNote("");
    setFieldErrors({});
    clearError();
    setIsDialogOpen(true);
  }

  function closeDialog() {
    if (isPending) {
      return;
    }

    setIsDialogOpen(false);
    setFieldErrors({});
    clearError();
  }

  function submitClaim() {
    const validation = createClaimRequestSchema.safeParse({
      playerId: activeSelectedPlayerId,
      note
    });

    if (!validation.success) {
      const nextFieldErrors: IdentityFieldErrors = {};
      for (const issue of validation.error.issues) {
        const field = issue.path[0];
        if (typeof field === "string" && !(field in nextFieldErrors)) {
          nextFieldErrors[field as keyof IdentityFieldErrors] = issue.message;
        }
      }

      setFieldErrors(nextFieldErrors);
      setError(null);
      return;
    }

    setFieldErrors({});
    clearError();

    run(async () => {
      const result = await identityClient.createClaim(
        {
          playerId: activeSelectedPlayerId,
          note: note.trim()
        },
        {
          redirectTo: "/my"
        }
      );

      if (!result.ok || !(result.data as IdentityClaimPayload | null)) {
        setError(result.message);
        return;
      }

      setIsDialogOpen(false);
    });
  }

  return {
    selectedPlayerId,
    setSelectedPlayerId,
    note,
    setNote,
    isDialogOpen,
    error,
    fieldErrors,
    isPending,
    availablePlayers,
    activeSelectedPlayerId,
    selectedPlayer,
    canSubmitClaim,
    openDialog,
    closeDialog,
    submitClaim
  };
}