import { type BindingStatus, type ClaimRequestStatus, type UserRole } from "@prisma/client";
import { cookies } from "next/headers";
import { AUTH_SESSION_COOKIE, hashSessionToken } from "@/lib/auth";
import { db } from "@/lib/db";

export type IdentitySnapshot = {
  viewer: null | {
    id: string;
    name: string;
    email: string | null;
    role: UserRole;
  };
  binding: null | {
    id: string;
    steamId: string;
    openDotaId: number | null;
    status: BindingStatus;
    lastBoundAt: string | null;
  };
  certifiedPlayer: null | {
    id: string;
    slug: string;
    displayName: string;
    teamId: string | null;
    teamSlug: string | null;
    teamName: string | null;
  };
  activeClaim: null | {
    id: string;
    playerId: string;
    playerSlug: string;
    playerDisplayName: string;
    status: ClaimRequestStatus;
    note: string | null;
    reviewNote: string | null;
    submittedSteamId: string;
    submittedAt: string;
    reviewedAt: string | null;
  };
  recentClaims: Array<{
    id: string;
    playerId: string;
    playerSlug: string;
    playerDisplayName: string;
    status: ClaimRequestStatus;
    note: string | null;
    reviewNote: string | null;
    submittedAt: string;
    reviewedAt: string | null;
  }>;
  stage: "guest" | "registered" | "steam-bound" | "claim-pending" | "certified";
};

function toIso(value: Date | null | undefined) {
  return value ? value.toISOString() : null;
}

export async function getIdentitySessionUserId() {
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get(AUTH_SESSION_COOKIE)?.value?.trim() || null;

  if (!sessionToken) {
    return null;
  }

  const session = await db.authSession.findUnique({
    where: {
      tokenHash: hashSessionToken(sessionToken)
    },
    select: {
      userId: true,
      expiresAt: true
    }
  });

  if (!session || session.expiresAt.getTime() <= Date.now()) {
    return null;
  }

  return session.userId;
}

export async function getCurrentIdentitySnapshot(): Promise<IdentitySnapshot> {
  const userId = await getIdentitySessionUserId();

  if (!userId) {
    return {
      viewer: null,
      binding: null,
      certifiedPlayer: null,
      activeClaim: null,
      recentClaims: [],
      stage: "guest"
    };
  }

  const user = await db.user.findUnique({
    where: { id: userId },
    include: {
      player: {
        include: {
          teamMemberships: {
            where: { isCurrent: true },
            include: { team: true },
            take: 1
          }
        }
      },
      steamBinding: true
    }
  });

  if (!user) {
    return {
      viewer: null,
      binding: null,
      certifiedPlayer: null,
      activeClaim: null,
      recentClaims: [],
      stage: "guest"
    };
  }

  const [activeClaim, recentClaimRecords] = await Promise.all([
    db.claimRequest.findFirst({
      where: {
        userId: user.id,
        status: "PENDING"
      },
      include: {
        player: {
          include: {
            teamMemberships: {
              where: { isCurrent: true },
              include: { team: true },
              take: 1
            }
          }
        }
      },
      orderBy: [{ submittedAt: "desc" }, { createdAt: "desc" }]
    }),
    db.claimRequest.findMany({
      where: { userId: user.id },
      orderBy: [{ updatedAt: "desc" }, { createdAt: "desc" }],
      include: {
        player: {
          include: {
            teamMemberships: {
              where: { isCurrent: true },
              include: { team: true },
              take: 1
            }
          }
        }
      },
      take: 6
    })
  ]);

  const certifiedMembership = user.player?.teamMemberships[0] ?? null;
  const recentClaims = recentClaimRecords.map((claim) => ({
    id: claim.id,
    playerId: claim.playerId,
    playerSlug: claim.player.slug,
    playerDisplayName: claim.player.displayName,
    status: claim.status,
    note: claim.note,
    reviewNote: claim.reviewNote,
    submittedAt: claim.submittedAt.toISOString(),
    reviewedAt: toIso(claim.reviewedAt)
  }));

  const stage = user.player
    ? "certified"
    : user.steamBinding
      ? activeClaim
        ? "claim-pending"
        : "steam-bound"
      : "registered";

  return {
    viewer: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role
    },
    binding: user.steamBinding ? {
      id: user.steamBinding.id,
      steamId: user.steamBinding.steamId,
      openDotaId: user.steamBinding.openDotaId,
      status: user.steamBinding.status,
      lastBoundAt: toIso(user.steamBinding.lastBoundAt)
    } : null,
    certifiedPlayer: user.player ? {
      id: user.player.id,
      slug: user.player.slug,
      displayName: user.player.displayName,
      teamId: certifiedMembership?.teamId ?? null,
      teamSlug: certifiedMembership?.team.slug ?? null,
      teamName: certifiedMembership?.team.name ?? null
    } : null,
    activeClaim: activeClaim ? {
      id: activeClaim.id,
      playerId: activeClaim.playerId,
      playerSlug: activeClaim.player.slug,
      playerDisplayName: activeClaim.player.displayName,
      status: activeClaim.status,
      note: activeClaim.note,
      reviewNote: activeClaim.reviewNote,
      submittedSteamId: activeClaim.submittedSteamId,
      submittedAt: activeClaim.submittedAt.toISOString(),
      reviewedAt: toIso(activeClaim.reviewedAt)
    } : null,
    recentClaims,
    stage
  };
}

export async function requireCurrentViewer() {
  const snapshot = await getCurrentIdentitySnapshot();

  if (!snapshot.viewer) {
    throw new Error("请先登录账号。");
  }

  return snapshot;
}

export async function requireAdminViewer() {
  const snapshot = await requireCurrentViewer();

  if (snapshot.viewer?.role !== "ADMIN") {
    throw new Error("当前账号没有后台审核权限。");
  }

  return snapshot;
}

export async function requireCertifiedIdentity() {
  const snapshot = await requireCurrentViewer();

  if (!snapshot.certifiedPlayer) {
    throw new Error("当前账号还不是已认证选手。");
  }

  return snapshot;
}

export async function getViewerClaimHistory(userId: string) {
  return db.claimRequest.findMany({
    where: { userId },
    include: {
      player: {
        include: {
          teamMemberships: {
            where: { isCurrent: true },
            include: { team: true },
            take: 1
          }
        }
      },
      binding: true,
      reviewedBy: {
        select: {
          id: true,
          name: true
        }
      }
    },
    orderBy: [{ updatedAt: "desc" }, { createdAt: "desc" }]
  });
}