import { type ClaimRequestStatus } from "@prisma/client";
import { buildPlayerReport } from "@/lib/opendota";
import { db } from "@/lib/db";

type ReviewDecision = "APPROVE" | "REJECT" | "CANCEL" | "SAVE";

function buildClaimClosureNote(status: Exclude<ClaimRequestStatus, "PENDING">) {
  if (status === "REJECTED") {
    return "申请已被拒绝。";
  }

  if (status === "CANCELLED") {
    return "申请已关闭。";
  }

  return "申请已通过。";
}

export async function bindSteamIdentity(options: {
  userId: string;
  steamId: string;
  certifiedPlayerId?: string | null;
}) {
  const steamId = options.steamId.trim();
  const existingActiveClaim = await db.claimRequest.findFirst({
    where: {
      userId: options.userId,
      status: "PENDING"
    },
    select: {
      id: true,
      submittedSteamId: true,
      player: {
        select: {
          displayName: true
        }
      }
    }
  });

  if (existingActiveClaim && existingActiveClaim.submittedSteamId !== steamId) {
    throw new Error(`当前正在审核 ${existingActiveClaim.player.displayName} 的申请。请先等待审核结果，或取消申请后再更换 SteamID。`);
  }

  const report = await buildPlayerReport(steamId);
  const existingBinding = await db.playerBinding.findUnique({
    where: { steamId },
    select: { userId: true }
  });

  if (existingBinding && existingBinding.userId !== options.userId) {
    throw new Error("这个 SteamID 已经绑定到其他账号。");
  }

  const binding = await db.playerBinding.upsert({
    where: { userId: options.userId },
    update: {
      steamId,
      openDotaId: report.summary.accountId,
      status: "ACTIVE",
      lastBoundAt: new Date(),
      lastError: null
    },
    create: {
      userId: options.userId,
      steamId,
      openDotaId: report.summary.accountId,
      status: "ACTIVE",
      lastBoundAt: new Date()
    }
  });

  if (options.certifiedPlayerId) {
    await db.player.update({
      where: { id: options.certifiedPlayerId },
      data: {
        steamId,
        avatarUrl: report.summary.avatarUrl ?? undefined,
        ladderScore: report.summary.mmrEstimate ?? undefined
      }
    });
  }

  await db.playerReport.create({
    data: {
      playerId: options.certifiedPlayerId ?? null,
      bindingId: binding.id,
      steamId,
      summary: report.summary,
      topHeroes: report.topHeroes,
      recentMatches: report.recentMatches,
      rawPayload: report.rawPayload,
      syncedAt: new Date()
    }
  });

  return {
    binding,
    summary: report.summary
  };
}

export async function createClaimRequest(options: {
  userId: string;
  playerId: string;
  note?: string | null;
}) {
  const user = await db.user.findUnique({
    where: { id: options.userId },
    select: {
      id: true,
      playerId: true,
      steamBinding: {
        select: {
          id: true,
          steamId: true
        }
      }
    }
  });

  if (!user) {
    throw new Error("请先登录账号。");
  }

  if (!user.steamBinding) {
    throw new Error("请先绑定 Steam 身份，再提交认领申请。");
  }

  if (user.playerId) {
    throw new Error("当前账号已经是已认证选手，无需重复申请。");
  }

  const existingPendingClaim = await db.claimRequest.findFirst({
    where: {
      userId: user.id,
      status: "PENDING"
    },
    select: { id: true }
  });

  if (existingPendingClaim) {
    throw new Error("当前已经有一条待审核申请，请等待后台处理。");
  }

  const [player, existingCertifiedUser] = await Promise.all([
    db.player.findUnique({
      where: { id: options.playerId },
      select: { id: true, displayName: true, slug: true }
    }),
    db.user.findFirst({
      where: { playerId: options.playerId },
      select: { id: true }
    })
  ]);

  if (!player) {
    throw new Error("选手不存在。");
  }

  if (existingCertifiedUser) {
    throw new Error("这位选手已经完成正式认领，不能重复申请。");
  }

  const claim = await db.claimRequest.create({
    data: {
      userId: user.id,
      playerId: player.id,
      bindingId: user.steamBinding.id,
      submittedSteamId: user.steamBinding.steamId,
      note: options.note?.trim() || null,
      status: "PENDING"
    }
  });

  return {
    claim,
    player
  };
}

export async function cancelClaimRequest(options: {
  userId: string;
  claimRequestId?: string | null;
}) {
  const claim = await db.claimRequest.findFirst({
    where: {
      userId: options.userId,
      status: "PENDING",
      ...(options.claimRequestId ? { id: options.claimRequestId } : {})
    },
    include: {
      player: {
        select: {
          displayName: true,
          slug: true
        }
      }
    }
  });

  if (!claim) {
    throw new Error("当前没有可取消的待审核申请。");
  }

  const cancelled = await db.claimRequest.update({
    where: { id: claim.id },
    data: {
      status: "CANCELLED",
      reviewNote: "申请人主动取消。",
      reviewedAt: new Date()
    }
  });

  return {
    claim: cancelled,
    player: claim.player
  };
}

export async function reviewClaimRequest(options: {
  reviewerId: string;
  claimRequestId: string;
  decision: ReviewDecision;
  reviewNote?: string | null;
}) {
  const claim = await db.claimRequest.findUnique({
    where: { id: options.claimRequestId },
    include: {
      user: true,
      player: true,
      binding: true
    }
  });

  if (!claim) {
    throw new Error("认领申请不存在。");
  }

  const reviewNote = options.reviewNote?.trim() || null;

  if (options.decision === "SAVE") {
    return db.claimRequest.update({
      where: { id: claim.id },
      data: {
        reviewNote,
        reviewedByUserId: options.reviewerId
      }
    });
  }

  if (claim.status !== "PENDING") {
    throw new Error(buildClaimClosureNote(claim.status));
  }

  if (options.decision === "APPROVE") {
    const existingCertifiedUser = await db.user.findFirst({
      where: {
        playerId: claim.playerId,
        id: { not: claim.userId }
      },
      select: { id: true }
    });

    if (existingCertifiedUser) {
      throw new Error("该选手已经绑定到其他已认证账号，当前申请不能通过。");
    }

    return db.$transaction(async (transaction) => {
      const reviewedAt = new Date();

      const approvedClaim = await transaction.claimRequest.update({
        where: { id: claim.id },
        data: {
          status: "APPROVED",
          reviewNote,
          reviewedAt,
          reviewedByUserId: options.reviewerId
        }
      });

      await transaction.user.update({
        where: { id: claim.userId },
        data: { playerId: claim.playerId }
      });

      await transaction.player.update({
        where: { id: claim.playerId },
        data: { steamId: claim.submittedSteamId }
      });

      await transaction.playerBinding.update({
        where: { id: claim.bindingId },
        data: {
          status: "ACTIVE",
          lastError: null,
          lastBoundAt: reviewedAt
        }
      });

      await transaction.playerReport.updateMany({
        where: { bindingId: claim.bindingId },
        data: { playerId: claim.playerId }
      });

      await transaction.claimRequest.updateMany({
        where: {
          id: { not: claim.id },
          OR: [{ userId: claim.userId }, { playerId: claim.playerId }],
          status: "PENDING"
        },
        data: {
          status: "CANCELLED",
          reviewNote: "已因其他申请通过而自动关闭。",
          reviewedAt,
          reviewedByUserId: options.reviewerId
        }
      });

      return approvedClaim;
    });
  }

  return db.claimRequest.update({
    where: { id: claim.id },
    data: {
      status: options.decision === "REJECT" ? "REJECTED" : "CANCELLED",
      reviewNote,
      reviewedAt: new Date(),
      reviewedByUserId: options.reviewerId
    }
  });
}