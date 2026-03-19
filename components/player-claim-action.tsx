"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { readLocalPlayerBinding, type LocalPlayerBinding } from "@/lib/local-binding";

export function PlayerClaimAction({ playerId, playerName }: { playerId: string; playerName: string }) {
  const [binding, setBinding] = useState<LocalPlayerBinding | null>(null);

  useEffect(() => {
    setBinding(readLocalPlayerBinding());
  }, []);

  if (binding?.playerId === playerId) {
    return (
      <div className="inline-flex rounded-full border border-emerald-400/25 bg-emerald-400/10 px-4 py-2 text-sm font-semibold text-emerald-100">
        这是我的主页
      </div>
    );
  }

  return (
    <Link
      href={`/my?claim=${playerId}`}
      className="inline-flex rounded-full border border-cyan-400/25 bg-cyan-400/10 px-4 py-2 text-sm font-semibold text-cyan-100 transition hover:border-cyan-300/40 hover:text-white"
    >
      这个是我
      <span className="ml-2 text-cyan-200/70">认领 {playerName}</span>
    </Link>
  );
}