"use server";

import { Prisma } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { playerPath, teamPath } from "@/lib/routes";
import {
  createCaptainTeamSchema,
  createPlayerReviewSchema,
  manageCaptainTeamMemberSchema,
  togglePlayerReviewVisibilitySchema
} from "@/lib/validators";

export type MyActionState = {
  status: "idle" | "success" | "error";
  message: string;
};

export const initialMyActionState: MyActionState = {
  status: "idle",
  message: "准备就绪。"
};

function revalidatePlayerAndTeamViews(paths: string[]) {
  revalidatePath("/my");
  revalidatePath("/players");
  revalidatePath("/teams");
  revalidatePath("/");

  for (const path of paths) {
    revalidatePath(path);
  }
}

export async function createCaptainTeamAction(_: MyActionState, formData: FormData): Promise<MyActionState> {
  const payload = createCaptainTeamSchema.safeParse({
    captainPlayerId: formData.get("captainPlayerId"),
    name: formData.get("name"),
    slug: formData.get("slug"),
    slogan: formData.get("slogan"),
    summary: formData.get("summary")
  });

  if (!payload.success) {
    return {
      status: "error",
      message: payload.error.issues[0]?.message ?? "创建队伍失败。"
    };
  }

  const captainPlayer = await db.player.findUnique({
    where: { id: payload.data.captainPlayerId },
    select: { id: true, displayName: true }
  });

  if (!captainPlayer) {
    return { status: "error", message: "当前认领的选手不存在。" };
  }

  const currentMembership = await db.teamMember.findFirst({
    where: {
      playerId: captainPlayer.id,
      isCurrent: true
    }
  });

  if (currentMembership) {
    return { status: "error", message: "你已经在一支现役队伍中，不能重复创建队伍。" };
  }

  const existingCaptainTeam = await db.team.findFirst({
    where: { captainPlayerId: captainPlayer.id },
    select: { id: true, name: true }
  });

  if (existingCaptainTeam) {
    return { status: "error", message: `你已经是 ${existingCaptainTeam.name} 的队长。` };
  }

  try {
    const team = await db.team.create({
      data: {
        name: payload.data.name,
        slug: payload.data.slug,
        slogan: payload.data.slogan || null,
        summary: payload.data.summary || null,
        captain: captainPlayer.displayName,
        captainPlayerId: captainPlayer.id,
        members: {
          create: {
            playerId: captainPlayer.id,
            isCurrent: true,
            joinedAt: new Date()
          }
        }
      }
    });

    revalidatePlayerAndTeamViews([teamPath(team.id), playerPath(captainPlayer.id)]);

    return {
      status: "success",
      message: `队伍 ${team.name} 已创建，你现在是队长。`
    };
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
      return { status: "error", message: "队伍 slug 已存在，请换一个新的。" };
    }

    return { status: "error", message: "创建队伍失败，请稍后再试。" };
  }
}

export async function addCaptainTeamMemberAction(formData: FormData) {
  const payload = manageCaptainTeamMemberSchema.safeParse({
    captainPlayerId: formData.get("captainPlayerId"),
    teamId: formData.get("teamId"),
    playerId: formData.get("playerId")
  });

  if (!payload.success) {
    return;
  }

  if (payload.data.captainPlayerId === payload.data.playerId) {
    return;
  }

  const team = await db.team.findFirst({
    where: {
      id: payload.data.teamId,
      captainPlayerId: payload.data.captainPlayerId
    },
    select: {
      id: true,
      members: {
        where: {
          playerId: payload.data.playerId
        },
        select: {
          id: true,
          isCurrent: true
        }
      }
    }
  });

  if (!team) {
    return;
  }

  const currentMembership = await db.teamMember.findFirst({
    where: {
      playerId: payload.data.playerId,
      isCurrent: true
    }
  });

  if (currentMembership) {
    return;
  }

  const historicalMembership = team.members.find((member) => !member.isCurrent) ?? null;

  if (historicalMembership) {
    await db.teamMember.update({
      where: { id: historicalMembership.id },
      data: {
        isCurrent: true,
        joinedAt: new Date(),
        leftAt: null
      }
    });
  } else {
    await db.teamMember.create({
      data: {
        teamId: payload.data.teamId,
        playerId: payload.data.playerId,
        isCurrent: true,
        joinedAt: new Date()
      }
    });
  }

  revalidatePlayerAndTeamViews([teamPath(payload.data.teamId), playerPath(payload.data.playerId), playerPath(payload.data.captainPlayerId)]);
}

export async function removeCaptainTeamMemberAction(formData: FormData) {
  const payload = manageCaptainTeamMemberSchema.safeParse({
    captainPlayerId: formData.get("captainPlayerId"),
    teamId: formData.get("teamId"),
    playerId: formData.get("playerId")
  });

  if (!payload.success || payload.data.captainPlayerId === payload.data.playerId) {
    return;
  }

  const team = await db.team.findFirst({
    where: {
      id: payload.data.teamId,
      captainPlayerId: payload.data.captainPlayerId
    },
    select: { id: true }
  });

  if (!team) {
    return;
  }

  const membership = await db.teamMember.findFirst({
    where: {
      teamId: payload.data.teamId,
      playerId: payload.data.playerId,
      isCurrent: true
    },
    select: { id: true }
  });

  if (!membership) {
    return;
  }

  await db.teamMember.update({
    where: { id: membership.id },
    data: {
      isCurrent: false,
      leftAt: new Date()
    }
  });

  revalidatePlayerAndTeamViews([teamPath(payload.data.teamId), playerPath(payload.data.playerId), playerPath(payload.data.captainPlayerId)]);
}

export async function createPlayerReviewAction(_: MyActionState, formData: FormData): Promise<MyActionState> {
  const payload = createPlayerReviewSchema.safeParse({
    authorPlayerId: formData.get("authorPlayerId"),
    targetPlayerId: formData.get("targetPlayerId"),
    content: formData.get("content")
  });

  if (!payload.success) {
    return {
      status: "error",
      message: payload.error.issues[0]?.message ?? "提交评价失败。"
    };
  }

  if (payload.data.authorPlayerId === payload.data.targetPlayerId) {
    return { status: "error", message: "不能评价自己。" };
  }

  const [author, target] = await Promise.all([
    db.player.findUnique({ where: { id: payload.data.authorPlayerId }, select: { id: true, displayName: true } }),
    db.player.findUnique({ where: { id: payload.data.targetPlayerId }, select: { id: true, displayName: true } })
  ]);

  if (!author || !target) {
    return { status: "error", message: "评价双方的选手资料不完整。" };
  }

  await db.playerReview.upsert({
    where: {
      authorPlayerId_targetPlayerId: {
        authorPlayerId: author.id,
        targetPlayerId: target.id
      }
    },
    update: {
      content: payload.data.content
    },
    create: {
      authorPlayerId: author.id,
      targetPlayerId: target.id,
      content: payload.data.content
    }
  });

  revalidatePlayerAndTeamViews([playerPath(author.id), playerPath(target.id)]);

  return {
    status: "success",
    message: `你对 ${target.displayName} 的评价已保存。`
  };
}

export async function togglePlayerReviewVisibilityAction(formData: FormData) {
  const payload = togglePlayerReviewVisibilitySchema.safeParse({
    reviewId: formData.get("reviewId"),
    targetPlayerId: formData.get("targetPlayerId"),
    showOnProfile: formData.get("showOnProfile")
  });

  if (!payload.success) {
    return;
  }

  const review = await db.playerReview.findFirst({
    where: {
      id: payload.data.reviewId,
      targetPlayerId: payload.data.targetPlayerId
    },
    select: { id: true }
  });

  if (!review) {
    return;
  }

  await db.playerReview.update({
    where: { id: review.id },
    data: {
      showOnProfile: payload.data.showOnProfile
    }
  });

  revalidatePlayerAndTeamViews([playerPath(payload.data.targetPlayerId)]);
}