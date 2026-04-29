"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { InvitationStatus, InvitationType } from "@prisma/client";
import { hashPassword, normalizeEmail, verifyPassword } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { createUserSession, destroyUserSession, getViewer, isAdmin } from "@/lib/session";

function required(value: FormDataEntryValue | null, message: string) {
  if (!value || typeof value !== "string" || !value.trim()) {
    throw new Error(message);
  }

  return value.trim();
}

function slugify(input: string) {
  return input
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9\u4e00-\u9fa5]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 48);
}

function resolveSafeRedirect(target: string | null | undefined) {
  if (!target || typeof target !== "string") {
    return "/my";
  }

  if (!target.startsWith("/") || target.startsWith("//") || target.startsWith("/login")) {
    return "/my";
  }

  return target;
}

export async function registerAction(formData: FormData) {
  const name = required(formData.get("name"), "请输入昵称");
  const email = normalizeEmail(required(formData.get("email"), "请输入邮箱"));
  const password = required(formData.get("password"), "请输入密码");
  const redirectTo = resolveSafeRedirect(typeof formData.get("redirectTo") === "string" ? (formData.get("redirectTo") as string) : undefined);

  const existing = await prisma.user.findUnique({
    where: {
      email
    }
  });

  if (existing) {
    throw new Error("该邮箱已被注册");
  }

  const user = await prisma.user.create({
    data: {
      name,
      email,
      passwordHash: await hashPassword(password)
    }
  });

  await createUserSession(user.id);
  redirect(redirectTo);
}

export async function loginAction(formData: FormData) {
  const email = normalizeEmail(required(formData.get("email"), "请输入邮箱"));
  const password = required(formData.get("password"), "请输入密码");
  const remember = formData.get("remember") === "1";
  const redirectTo = resolveSafeRedirect(typeof formData.get("redirectTo") === "string" ? (formData.get("redirectTo") as string) : undefined);

  const user = await prisma.user.findUnique({
    where: {
      email
    }
  });

  if (!user?.passwordHash) {
    throw new Error("账号不存在或未设置密码");
  }

  const valid = await verifyPassword(password, user.passwordHash);
  if (!valid) {
    throw new Error("邮箱或密码错误");
  }

  await createUserSession(user.id, { persistent: remember });
  redirect(redirectTo);
}

export async function logoutAction() {
  await destroyUserSession();
  redirect("/");
}

export async function createClaimAction(formData: FormData) {
  const viewer = await getViewer();
  if (!viewer) {
    redirect("/login");
  }

  if (viewer.player) {
    throw new Error("你已经是认证选手");
  }

  if (viewer.pendingClaim) {
    throw new Error("你已有审核中的认领申请");
  }

  const displayName = required(formData.get("displayName"), "请输入选手名");
  const steamId = required(formData.get("steamId"), "请输入 SteamID");
  const note = typeof formData.get("note") === "string" ? (formData.get("note") as string).trim() : "";
  const redirectTo = resolveSafeRedirect(typeof formData.get("redirectTo") === "string" ? (formData.get("redirectTo") as string) : "/my/claims");
  const slugBase = slugify(displayName) || `player-${Date.now()}`;

  const result = await prisma.$transaction(async (transaction) => {
    const player = await transaction.player.create({
      data: {
        displayName,
        slug: `${slugBase}-${Date.now().toString().slice(-5)}`,
        heroPool: [],
        highlightMatchIds: [],
        bio: note || `${displayName} 的认领申请`
      }
    });

    const binding = await transaction.playerBinding.upsert({
      where: {
        userId: viewer.user.id
      },
      update: {
        steamId,
        status: "PENDING"
      },
      create: {
        userId: viewer.user.id,
        steamId,
        status: "PENDING"
      }
    });

    const claim = await transaction.claimRequest.create({
      data: {
        userId: viewer.user.id,
        playerId: player.id,
        bindingId: binding.id,
        submittedSteamId: steamId,
        note,
        status: "PENDING"
      }
    });

    return claim;
  });

  revalidatePath("/my");
  revalidatePath("/my/claims");
  redirect(`${redirectTo}?claim=${result.id}`);
}

export async function claimExistingPlayerAction(formData: FormData) {
  const viewer = await getViewer();
  if (!viewer) {
    redirect("/login");
  }

  if (viewer.player) {
    throw new Error("你已经绑定了选手");
  }

  if (viewer.pendingClaim) {
    throw new Error("你已有审核中的认领申请");
  }

  const playerId = required(formData.get("playerId"), "缺少选手编号");
  const inputSteamId = typeof formData.get("steamId") === "string" ? (formData.get("steamId") as string).trim() : "";
  const note = typeof formData.get("note") === "string" ? (formData.get("note") as string).trim() : "";
  const redirectTo = resolveSafeRedirect(typeof formData.get("redirectTo") === "string" ? (formData.get("redirectTo") as string) : "/my/claims");

  const result = await prisma.$transaction(async (transaction) => {
    const player = await transaction.player.findUnique({
      where: { id: playerId },
      select: {
        id: true,
        slug: true,
        displayName: true,
        steamId: true
      }
    });

    if (!player) {
      throw new Error("选手不存在");
    }

    const claimedUser = await transaction.user.findFirst({
      where: { playerId },
      select: { id: true }
    });

    if (claimedUser) {
      throw new Error("该选手已经被其他用户绑定");
    }

    const submittedSteamId = inputSteamId || player.steamId;
    if (!submittedSteamId) {
      throw new Error("请输入 SteamID");
    }

    const binding = await transaction.playerBinding.upsert({
      where: {
        userId: viewer.user.id
      },
      update: {
        steamId: submittedSteamId,
        status: "PENDING"
      },
      create: {
        userId: viewer.user.id,
        steamId: submittedSteamId,
        status: "PENDING"
      }
    });

    const claim = await transaction.claimRequest.create({
      data: {
        userId: viewer.user.id,
        playerId: player.id,
        bindingId: binding.id,
        submittedSteamId,
        note,
        status: "PENDING"
      }
    });

    return {
      claimId: claim.id,
      playerSlug: player.slug
    };
  });

  revalidatePath("/my");
  revalidatePath("/my/claims");
  revalidatePath("/players");
  revalidatePath(`/players/${result.playerSlug}`);
  redirect(`${redirectTo}?claim=${result.claimId}`);
}

export async function unbindCurrentPlayerAction(formData: FormData) {
  const viewer = await getViewer();
  if (!viewer?.player) {
    redirect("/login");
  }

  const player = viewer.player;

  const playerId = required(formData.get("playerId"), "缺少选手编号");
  const redirectTo = resolveSafeRedirect(typeof formData.get("redirectTo") === "string" ? (formData.get("redirectTo") as string) : "/my");

  if (player.id !== playerId) {
    throw new Error("你只能解绑自己当前绑定的选手");
  }

  await prisma.$transaction(async (transaction) => {
    await transaction.user.update({
      where: { id: viewer.user.id },
      data: {
        playerId: null
      }
    });

    if (viewer.binding) {
      await transaction.playerBinding.update({
        where: { id: viewer.binding.id },
        data: {
          status: "UNBOUND"
        }
      });
    }
  });

  revalidatePath("/my");
  revalidatePath("/players");
  revalidatePath(`/players/${player.slug}`);
  redirect(`${redirectTo}?unbound=1`);
}

export async function createTeamAction(formData: FormData) {
  const viewer = await getViewer();
  if (!viewer?.player) {
    redirect("/login");
  }

  const player = viewer.player;

  if (viewer.currentTeam) {
    throw new Error("你已经加入战队");
  }

  const name = required(formData.get("name"), "请输入队伍名");
  const slogan = typeof formData.get("slogan") === "string" ? (formData.get("slogan") as string).trim() : null;
  const summary = typeof formData.get("summary") === "string" ? (formData.get("summary") as string).trim() : null;
  const redirectTo = resolveSafeRedirect(typeof formData.get("redirectTo") === "string" ? (formData.get("redirectTo") as string) : "/my/team");
  const slug = slugify(name) || `team-${Date.now()}`;

  await prisma.$transaction(async (transaction) => {
    const team = await transaction.team.create({
      data: {
        name,
        slug: `${slug}-${Date.now().toString().slice(-4)}`,
        slogan,
        summary,
        captain: player.displayName,
        captainPlayerId: player.id,
        active: true
      }
    });

    await transaction.teamMember.create({
      data: {
        teamId: team.id,
        playerId: player.id,
        isCurrent: true,
        inGameRole: "Captain"
      }
    });
  });

  revalidatePath("/my");
  revalidatePath("/my/team");
  revalidatePath("/teams");
  redirect(redirectTo);
}

export async function joinTeamAction(formData: FormData) {
  const viewer = await getViewer();
  if (!viewer?.player) {
    redirect("/login");
  }

  const player = viewer.player;

  if (viewer.currentTeam) {
    throw new Error("你已经加入战队");
  }

  const teamId = required(formData.get("teamId"), "缺少队伍编号");
  const redirectTo = resolveSafeRedirect(typeof formData.get("redirectTo") === "string" ? (formData.get("redirectTo") as string) : "/my");

  const team = await prisma.team.findUnique({
    where: { id: teamId },
    select: {
      id: true,
      slug: true,
      active: true
    }
  });

  if (!team?.active) {
    throw new Error("当前战队不可加入");
  }

  await prisma.$transaction(async (transaction) => {
    await transaction.teamMember.updateMany({
      where: {
        playerId: player.id,
        isCurrent: true
      },
      data: {
        isCurrent: false,
        leftAt: new Date()
      }
    });

    await transaction.teamMember.create({
      data: {
        teamId: team.id,
        playerId: player.id,
        joinedAt: new Date(),
        isCurrent: true
      }
    });
  });

  revalidatePath("/my");
  revalidatePath("/teams");
  revalidatePath(`/teams/${team.slug}`);
  redirect(`${redirectTo}?joined=${team.slug}`);
}

export async function leaveTeamAction(formData: FormData) {
  const viewer = await getViewer();
  if (!viewer?.player || !viewer.currentTeam) {
    redirect("/login");
  }

  const player = viewer.player;
  const currentTeam = viewer.currentTeam;
  const captainTeam = viewer.captainTeam;

  const teamId = required(formData.get("teamId"), "缺少队伍编号");
  const redirectTo = resolveSafeRedirect(typeof formData.get("redirectTo") === "string" ? (formData.get("redirectTo") as string) : "/my");

  if (currentTeam.id !== teamId) {
    throw new Error("你只能退出自己当前所属的战队");
  }

  const team = await prisma.team.findUnique({
    where: { id: teamId },
    select: {
      id: true,
      slug: true
    }
  });

  if (!team) {
    throw new Error("战队不存在");
  }

  await prisma.$transaction(async (transaction) => {
    await transaction.teamMember.updateMany({
      where: {
        teamId,
        playerId: player.id,
        isCurrent: true
      },
      data: {
        isCurrent: false,
        leftAt: new Date()
      }
    });

    if (captainTeam?.id === teamId) {
      await transaction.team.update({
        where: { id: teamId },
        data: {
          captain: null,
          captainPlayerId: null
        }
      });
    }
  });

  revalidatePath("/my");
  revalidatePath("/my/team");
  revalidatePath("/teams");
  revalidatePath(`/teams/${team.slug}`);
  redirect(`${redirectTo}?left=${team.slug}`);
}

export async function sendInvitationAction(formData: FormData) {
  const viewer = await getViewer();
  if (!viewer?.captainTeam || !viewer.player) {
    redirect("/login");
  }

  const team = viewer.captainTeam;

  const type = required(formData.get("type"), "缺少邀请类型") as InvitationType;
  const message = typeof formData.get("message") === "string" ? (formData.get("message") as string).trim() : null;
  const redirectTo = resolveSafeRedirect(typeof formData.get("redirectTo") === "string" ? (formData.get("redirectTo") as string) : "/my/invitations");

  if (type === InvitationType.TEAM_MEMBER) {
    const targetPlayerId = required(formData.get("targetPlayerId"), "缺少目标选手");
    const targetPlayer = await prisma.player.findUnique({
      where: { id: targetPlayerId },
      select: { displayName: true }
    });

    await prisma.invitation.create({
      data: {
        type,
        title: `邀请加入 ${team.name}`,
        message,
        sourceTeamId: team.id,
        targetPlayerId,
        createdByUserId: viewer.user.id
      }
    });

    revalidatePath("/my/invitations");
    redirect(`${redirectTo}?sent=${targetPlayer?.displayName ?? "player"}`);
  }

  const targetTeamId = required(formData.get("targetTeamId"), "缺少目标战队");
  const targetTeam = await prisma.team.findUnique({
    where: { id: targetTeamId },
    select: { name: true }
  });

  await prisma.invitation.create({
    data: {
      type,
      title: `${team.name} 发起训练赛邀请`,
      message,
      sourceTeamId: team.id,
      targetTeamId,
      createdByUserId: viewer.user.id
    }
  });

  revalidatePath("/my/invitations");
  redirect(`${redirectTo}?sent=${targetTeam?.name ?? "team"}`);
}

export async function respondInvitationAction(formData: FormData) {
  const viewer = await getViewer();
  if (!viewer) {
    redirect("/login");
  }

  const invitationId = required(formData.get("invitationId"), "缺少邀请编号");
  const decision = required(formData.get("decision"), "缺少处理结果");

  const invitation = await prisma.invitation.findUnique({
    where: { id: invitationId },
    include: {
      sourceTeam: true,
      targetPlayer: true,
      targetTeam: true
    }
  });

  if (!invitation) {
    throw new Error("邀请不存在");
  }

  const canHandlePlayerInvite = invitation.targetPlayerId && viewer.player?.id === invitation.targetPlayerId;
  const canHandleScrimInvite = invitation.targetTeamId && viewer.captainTeam?.id === invitation.targetTeamId;

  if (!canHandlePlayerInvite && !canHandleScrimInvite) {
    throw new Error("你无权处理这条邀请");
  }

  const status = decision === "accept" ? InvitationStatus.ACCEPTED : InvitationStatus.DECLINED;
  const captainTeam = viewer.captainTeam;

  await prisma.$transaction(async (transaction) => {
    await transaction.invitation.update({
      where: {
        id: invitationId
      },
      data: {
        status,
        respondedAt: new Date()
      }
    });

    if (status === InvitationStatus.ACCEPTED && invitation.type === InvitationType.TEAM_MEMBER && invitation.targetPlayerId && invitation.sourceTeamId) {
      await transaction.teamMember.updateMany({
        where: {
          playerId: invitation.targetPlayerId,
          isCurrent: true
        },
        data: {
          isCurrent: false,
          leftAt: new Date()
        }
      });

      if (captainTeam?.id && captainTeam.id !== invitation.sourceTeamId) {
        await transaction.team.update({
          where: { id: captainTeam.id },
          data: {
            captain: null,
            captainPlayerId: null
          }
        });
      }

      await transaction.teamMember.create({
        data: {
          teamId: invitation.sourceTeamId,
          playerId: invitation.targetPlayerId,
          isCurrent: true,
          joinedAt: new Date()
        }
      });
    }
  });

  revalidatePath("/my/invitations");
  revalidatePath("/my/team");
  revalidatePath("/teams");
  redirect("/my/invitations");
}

export async function disbandTeamAction(formData: FormData) {
  const viewer = await getViewer();
  if (!viewer?.captainTeam || !viewer.player) {
    redirect("/login");
  }

  const teamId = required(formData.get("teamId"), "缺少队伍编号");

  if (viewer.captainTeam.id !== teamId) {
    throw new Error("你无权解散该队伍");
  }

  await prisma.$transaction(async (transaction) => {
    await transaction.team.update({
      where: { id: teamId },
      data: {
        active: false,
        summary: "该队伍已解散。"
      }
    });

    await transaction.teamMember.updateMany({
      where: {
        teamId,
        isCurrent: true
      },
      data: {
        isCurrent: false,
        leftAt: new Date()
      }
    });
  });

  revalidatePath("/my");
  revalidatePath("/my/team");
  revalidatePath("/teams");
  redirect("/my/team");
}

export async function reviewClaimAction(formData: FormData) {
  const viewer = await getViewer();
  if (!isAdmin(viewer)) {
    redirect("/login");
  }

  const claimId = required(formData.get("claimId"), "缺少认领编号");
  const decision = required(formData.get("decision"), "缺少审核结果");
  const reviewNote = typeof formData.get("reviewNote") === "string" ? (formData.get("reviewNote") as string).trim() : null;

  if (decision !== "approve" && decision !== "reject") {
    throw new Error("无效的审核结果");
  }

  const claim = await prisma.claimRequest.findUnique({
    where: {
      id: claimId
    }
  });

  if (!claim) {
    throw new Error("认领记录不存在");
  }

  if (claim.status !== "PENDING") {
    throw new Error("这条认领申请已经处理过了");
  }

  await prisma.$transaction(async (transaction) => {
    const status = decision === "approve" ? "APPROVED" : "REJECTED";

    await transaction.claimRequest.update({
      where: { id: claim.id },
      data: {
        status,
        reviewNote,
        reviewedAt: new Date(),
        reviewedByUserId: viewer!.user.id
      }
    });

    await transaction.playerBinding.update({
      where: { id: claim.bindingId },
      data: {
        status: decision === "approve" ? "ACTIVE" : "FAILED",
        lastBoundAt: decision === "approve" ? new Date() : undefined,
        lastError: decision === "approve" ? null : reviewNote ?? "审核未通过"
      }
    });

    if (decision === "approve") {
      await transaction.user.update({
        where: { id: claim.userId },
        data: {
          playerId: claim.playerId,
          role: "PLAYER"
        }
      });
    }
  });

  revalidatePath("/admin/claims");
  revalidatePath(`/admin/claims/${claimId}`);
  revalidatePath("/my");
  revalidatePath("/my/claims");
  redirect(`/admin/claims/${claimId}`);
}