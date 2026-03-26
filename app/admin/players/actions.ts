"use server";

import { revalidatePath } from "next/cache";
import { Prisma } from "@prisma/client";
import type { PlayerFormState } from "@/app/admin/players/form-state";
import { db } from "@/lib/db";
import { createPlayerSchema, deletePlayerSchema, updatePlayerSchema } from "@/lib/validators";

function revalidatePlayerViews() {
  revalidatePath("/admin/players");
  revalidatePath("/players");
  revalidatePath("/");
}

export async function createPlayerAction(_: PlayerFormState, formData: FormData): Promise<PlayerFormState> {
  const payload = createPlayerSchema.safeParse({
    displayName: formData.get("displayName"),
    slug: formData.get("slug"),
    steamId: formData.get("steamId"),
    primaryRole: formData.get("primaryRole"),
    preferredRolesText: formData.get("preferredRolesText"),
    heroPoolText: formData.get("heroPoolText"),
    ladderScore: formData.get("ladderScore"),
    gameYears: formData.get("gameYears"),
    playStylesText: formData.get("playStylesText"),
    highlightMatchIdsText: formData.get("highlightMatchIdsText"),
    bio: formData.get("bio"),
    gameUnderstanding: formData.get("gameUnderstanding"),
    active: formData.get("active"),
    featured: formData.get("featured")
  });

  if (!payload.success) {
    return {
      status: "error",
      message: payload.error.issues[0]?.message ?? "表单校验失败。"
    };
  }

  try {
    await db.player.create({
      data: {
        displayName: payload.data.displayName,
        slug: payload.data.slug,
        steamId: payload.data.steamId || null,
        primaryRole: payload.data.primaryRole || null,
        preferredRoles: payload.data.preferredRolesText,
        heroPool: payload.data.heroPoolText,
        ladderScore: payload.data.ladderScore ?? null,
        gameYears: payload.data.gameYears ?? null,
        playStyles: payload.data.playStylesText,
        highlightMatchIds: payload.data.highlightMatchIdsText,
        bio: payload.data.bio || null,
        gameUnderstanding: payload.data.gameUnderstanding || null,
        active: payload.data.active,
        featured: payload.data.featured
      }
    });

    revalidatePlayerViews();

    return {
      status: "success",
      message: `选手 ${payload.data.displayName} 已创建。`
    };
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
      return {
        status: "error",
        message: "slug 或 SteamID 已存在，请检查后重试。"
      };
    }

    return {
      status: "error",
      message: "创建选手失败，请检查数据库连接或稍后重试。"
    };
  }
}

export async function updatePlayerAction(formData: FormData) {
  const payload = updatePlayerSchema.safeParse({
    id: formData.get("id"),
    displayName: formData.get("displayName"),
    slug: formData.get("slug"),
    steamId: formData.get("steamId"),
    primaryRole: formData.get("primaryRole"),
    preferredRolesText: formData.get("preferredRolesText"),
    heroPoolText: formData.get("heroPoolText"),
    ladderScore: formData.get("ladderScore"),
    gameYears: formData.get("gameYears"),
    playStylesText: formData.get("playStylesText"),
    highlightMatchIdsText: formData.get("highlightMatchIdsText"),
    bio: formData.get("bio"),
    gameUnderstanding: formData.get("gameUnderstanding"),
    active: formData.get("active"),
    featured: formData.get("featured")
  });

  if (!payload.success) {
    throw new Error(payload.error.issues[0]?.message ?? "更新选手失败。");
  }

  await db.player.update({
    where: { id: payload.data.id },
    data: {
      displayName: payload.data.displayName,
      slug: payload.data.slug,
      steamId: payload.data.steamId || null,
      primaryRole: payload.data.primaryRole || null,
      preferredRoles: payload.data.preferredRolesText,
      heroPool: payload.data.heroPoolText,
      ladderScore: payload.data.ladderScore ?? null,
      gameYears: payload.data.gameYears ?? null,
      playStyles: payload.data.playStylesText,
      highlightMatchIds: payload.data.highlightMatchIdsText,
      bio: payload.data.bio || null,
      gameUnderstanding: payload.data.gameUnderstanding || null,
      active: payload.data.active,
      featured: payload.data.featured
    }
  });

  revalidatePlayerViews();
}

export async function deletePlayerAction(formData: FormData) {
  const payload = deletePlayerSchema.safeParse({
    id: formData.get("id")
  });

  if (!payload.success) {
    throw new Error(payload.error.issues[0]?.message ?? "删除选手失败。");
  }

  await db.player.delete({
    where: { id: payload.data.id }
  });

  revalidatePlayerViews();
}
