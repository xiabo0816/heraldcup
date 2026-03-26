import { ClaimPlayerDialog } from "@/components/claim-player-dialog";
import type { IdentitySnapshot } from "@/lib/identity";
import Link from "next/link";

export function PlayerClaimAction({
  identity,
  playerId,
  playerName
}: {
  identity: IdentitySnapshot;
  playerId: string;
  playerName: string;
}) {
  if (identity.certifiedPlayer?.id === playerId) {
    return (
      <Link href="/my" className="inline-flex rounded-full border border-emerald-400/25 bg-emerald-400/10 px-4 py-2 text-sm font-semibold text-emerald-100 transition hover:border-emerald-300/40 hover:text-white">
        进入我的主页
      </Link>
    );
  }

  if (identity.certifiedPlayer) {
    return <Link href="/my" className="inline-flex rounded-full border border-white/15 px-4 py-2 text-sm font-semibold text-slate-100 transition hover:border-cyan-300/40 hover:text-white">当前已认证为 {identity.certifiedPlayer.displayName}</Link>;
  }

  if (identity.activeClaim?.playerId === playerId) {
    return <Link href="/my" className="inline-flex rounded-full border border-amber-300/25 bg-amber-300/10 px-4 py-2 text-sm font-semibold text-amber-100 transition hover:border-amber-300/40 hover:text-white">申请审核中</Link>;
  }

  return (
    <ClaimPlayerDialog
      identity={identity}
      players={[{ id: playerId, displayName: playerName }]}
      playerId={playerId}
      triggerLabel={`这个是我 · 申请认领 ${playerName}`}
      triggerClassName="inline-flex rounded-full border border-cyan-400/25 bg-cyan-400/10 px-4 py-2 text-sm font-semibold text-cyan-100 transition hover:border-cyan-300/40 hover:text-white"
    />
  );
}