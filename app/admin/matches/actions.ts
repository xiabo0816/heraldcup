"use server";

import { revalidatePath } from "next/cache";
import { Prisma, type MatchStatus } from "@prisma/client";
import type { MatchFormState } from "@/app/admin/matches/form-state";
import { db } from "@/lib/db";
import { createMatchSchema, deleteMatchSchema, updateMatchSchema } from "@/lib/validators";

function normalizeDateTime(value: string | undefined) {
  if (!value) {
    return null;
  }

  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
}

function revalidateMatchViews() {
  revalidatePath("/admin/matches");
  revalidatePath("/matches");
  revalidatePath("/");
  revalidatePath("/community");
  revalidatePath("/community/topics");
}

function toMatchData(payload: {
  title: string;
  slug: string;
  externalMatchId?: string;
  scheduledAt?: string;
  format?: string;
  status: MatchStatus | "DRAFT" | "SCHEDULED" | "LIVE" | "FINISHED" | "ARCHIVED";
  scoreHome?: number;
  scoreAway?: number;
  streamUrl?: string;
  summary?: string;
  topicId?: string;
  seasonId?: string;
  homeTeamId?: string;
  awayTeamId?: string;
}) {
  return {
    title: payload.title,
    slug: payload.slug,
    externalMatchId: payload.externalMatchId || null,
    scheduledAt: normalizeDateTime(payload.scheduledAt),
    format: payload.format || null,
    status: payload.status,
    scoreHome: payload.scoreHome ?? null,
    scoreAway: payload.scoreAway ?? null,
    streamUrl: payload.streamUrl || null,
    summary: payload.summary || null,
    topicId: payload.topicId || null,
    seasonId: payload.seasonId || null,
    homeTeamId: payload.homeTeamId || null,
    awayTeamId: payload.awayTeamId || null
  };
}

export async function createMatchAction(_: MatchFormState, formData: FormData): Promise<MatchFormState> {
  const payload = createMatchSchema.safeParse({
    title: formData.get("title"),
    slug: formData.get("slug"),
    externalMatchId: formData.get("externalMatchId"),
    scheduledAt: formData.get("scheduledAt"),
    format: formData.get("format"),
    status: formData.get("status"),
    scoreHome: formData.get("scoreHome"),
    scoreAway: formData.get("scoreAway"),
    streamUrl: formData.get("streamUrl"),
    summary: formData.get("summary"),
    topicId: formData.get("topicId"),
    seasonId: formData.get("seasonId"),
    homeTeamId: formData.get("homeTeamId"),
    awayTeamId: formData.get("awayTeamId")
  });

  if (!payload.success) {
    return {
      status: "error",
      message: payload.error.issues[0]?.message ?? "表单校验失败。"
    };
  }

  try {
    await db.match.create({
      data: toMatchData(payload.data)
    });

    revalidateMatchViews();

    return {
      status: "success",
      message: `比赛 ${payload.data.title} 已创建。`
    };
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
      return {
        status: "error",
        message: "slug 已存在，请更换一个新的 slug。"
      };
    }

    return {
      status: "error",
      message: "创建比赛失败，请检查数据库连接或稍后重试。"
    };
  }
}

export async function updateMatchAction(formData: FormData) {
  const payload = updateMatchSchema.safeParse({
    id: formData.get("id"),
    title: formData.get("title"),
    slug: formData.get("slug"),
    externalMatchId: formData.get("externalMatchId"),
    scheduledAt: formData.get("scheduledAt"),
    format: formData.get("format"),
    status: formData.get("status"),
    scoreHome: formData.get("scoreHome"),
    scoreAway: formData.get("scoreAway"),
    streamUrl: formData.get("streamUrl"),
    summary: formData.get("summary"),
    topicId: formData.get("topicId"),
    seasonId: formData.get("seasonId"),
    homeTeamId: formData.get("homeTeamId"),
    awayTeamId: formData.get("awayTeamId")
  });

  if (!payload.success) {
    throw new Error(payload.error.issues[0]?.message ?? "更新比赛失败。");
  }

  await db.match.update({
    where: { id: payload.data.id },
    data: toMatchData(payload.data)
  });

  revalidateMatchViews();
}

export async function deleteMatchAction(formData: FormData) {
  const payload = deleteMatchSchema.safeParse({
    id: formData.get("id")
  });

  if (!payload.success) {
    throw new Error(payload.error.issues[0]?.message ?? "删除比赛失败。");
  }

  await db.match.delete({
    where: { id: payload.data.id }
  });

  revalidateMatchViews();
}
