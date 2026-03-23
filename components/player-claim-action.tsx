"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  readLocalPlayerBinding,
  subscribeToLocalPlayerBinding,
  type LocalPlayerBinding
} from "@/lib/local-binding";
import { ClaimPlayerDialog } from "@/components/claim-player-dialog";

export function PlayerClaimAction({
  playerId,
  playerName
}: {
  playerId: string;
  playerName: string;
}) {
  const [binding, setBinding] = useState<LocalPlayerBinding | null>(null);
  const router = useRouter();

  useEffect(() => {
    setBinding(readLocalPlayerBinding());
    return subscribeToLocalPlayerBinding(setBinding);
  }, []);

  if (binding?.playerId === playerId) {
    return (
      <button
        type="button"
        onClick={() => {
          router.push("/my");
          router.refresh();
        }}
        className="inline-flex rounded-full border border-emerald-400/25 bg-emerald-400/10 px-4 py-2 text-sm font-semibold text-emerald-100 transition hover:border-emerald-300/40 hover:text-white"
      >
        打开我的主页
      </button>
    );
  }

  return (
    <ClaimPlayerDialog
      players={[{ id: playerId, displayName: playerName }]}
      playerId={playerId}
      triggerLabel={`这个是我 · 认领 ${playerName}`}
      triggerClassName="inline-flex rounded-full border border-cyan-400/25 bg-cyan-400/10 px-4 py-2 text-sm font-semibold text-cyan-100 transition hover:border-cyan-300/40 hover:text-white"
    />
  );
}