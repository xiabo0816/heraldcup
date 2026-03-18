"use server";

import { revalidatePath } from "next/cache";
import { Prisma, type TournamentKind } from "@prisma/client";
import type { TournamentFormState } from "@/app/admin/tournaments/form-state";
import { db } from "@/lib/db";
import {
  createTournamentSeasonSchema,
  deleteTournamentSeasonSchema,
  updateTournamentSeasonSchema
} from "@/lib/validators";

function revalidateTournamentViews() {
  revalidatePath("/admin/tournaments");
  revalidatePath("/");
}

async function syncFeaturedSeason(seasonId: string, featured: boolean) {
  if (!featured) {
    return;
  }

  await db.tournamentSeason.updateMany({
    where: {
      id: {
        not: seasonId
      }
    },
    data: {
      featured: false
    }
  });
}

export async function createTournamentSeasonAction(
  _: TournamentFormState,
  formData: FormData
): Promise<TournamentFormState> {
  const payload = createTournamentSeasonSchema.safeParse({
    tournamentName: formData.get("tournamentName"),
    tournamentSlug: formData.get("tournamentSlug"),
    tournamentKind: formData.get("tournamentKind"),
    tournamentDescription: formData.get("tournamentDescription"),
    title: formData.get("title"),
    slug: formData.get("slug"),
    seasonNumber: formData.get("seasonNumber"),
    statusLabel: formData.get("statusLabel"),
    themeColor: formData.get("themeColor"),
    summary: formData.get("summary"),
    featured: formData.get("featured")
  });

  if (!payload.success) {
    return {
      status: "error",
      message: payload.error.issues[0]?.message ?? "表单校验失败。"
    };
  }

  try {
    const result = await db.$transaction(async (tx) => {
      const tournament = await tx.tournament.upsert({
        where: { slug: payload.data.tournamentSlug },
        update: {
          name: payload.data.tournamentName,
          kind: payload.data.tournamentKind as TournamentKind,
          description: payload.data.tournamentDescription || null
        },
        create: {
          name: payload.data.tournamentName,
          slug: payload.data.tournamentSlug,
          kind: payload.data.tournamentKind as TournamentKind,
          description: payload.data.tournamentDescription || null
        }
      });

      const season = await tx.tournamentSeason.create({
        data: {
          tournamentId: tournament.id,
          title: payload.data.title,
          slug: payload.data.slug,
          seasonNumber: payload.data.seasonNumber,
          statusLabel: payload.data.statusLabel || null,
          themeColor: payload.data.themeColor || null,
          summary: payload.data.summary || null,
          featured: payload.data.featured
        }
      });

      if (payload.data.featured) {
        await tx.tournamentSeason.updateMany({
          where: {
            id: {
              not: season.id
            }
          },
          data: {
            featured: false
          }
        });
      }

      return season;
    });

    await syncFeaturedSeason(result.id, payload.data.featured);
    revalidateTournamentViews();

    return {
      status: "success",
      message: `赛季 ${payload.data.title} 已创建。`
    };
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
      return {
        status: "error",
        message: "赛事 slug 或赛季 slug 已存在，请检查后重试。"
      };
    }

    return {
      status: "error",
      message: "创建赛事或赛季失败，请检查数据库连接或稍后重试。"
    };
  }
}

export async function updateTournamentSeasonAction(formData: FormData) {
  const payload = updateTournamentSeasonSchema.safeParse({
    id: formData.get("id"),
    tournamentId: formData.get("tournamentId"),
    tournamentName: formData.get("tournamentName"),
    tournamentSlug: formData.get("tournamentSlug"),
    tournamentKind: formData.get("tournamentKind"),
    tournamentDescription: formData.get("tournamentDescription"),
    title: formData.get("title"),
    slug: formData.get("slug"),
    seasonNumber: formData.get("seasonNumber"),
    statusLabel: formData.get("statusLabel"),
    themeColor: formData.get("themeColor"),
    summary: formData.get("summary"),
    featured: formData.get("featured")
  });

  if (!payload.success) {
    throw new Error(payload.error.issues[0]?.message ?? "更新赛事失败。");
  }

  await db.$transaction(async (tx) => {
    await tx.tournament.update({
      where: { id: payload.data.tournamentId },
      data: {
        name: payload.data.tournamentName,
        slug: payload.data.tournamentSlug,
        kind: payload.data.tournamentKind as TournamentKind,
        description: payload.data.tournamentDescription || null
      }
    });

    await tx.tournamentSeason.update({
      where: { id: payload.data.id },
      data: {
        title: payload.data.title,
        slug: payload.data.slug,
        seasonNumber: payload.data.seasonNumber,
        statusLabel: payload.data.statusLabel || null,
        themeColor: payload.data.themeColor || null,
        summary: payload.data.summary || null,
        featured: payload.data.featured
      }
    });

    if (payload.data.featured) {
      await tx.tournamentSeason.updateMany({
        where: {
          id: {
            not: payload.data.id
          }
        },
        data: {
          featured: false
        }
      });
    }
  });

  revalidateTournamentViews();
}

export async function deleteTournamentSeasonAction(formData: FormData) {
  const payload = deleteTournamentSeasonSchema.safeParse({
    id: formData.get("id")
  });

  if (!payload.success) {
    throw new Error(payload.error.issues[0]?.message ?? "删除赛季失败。");
  }

  await db.tournamentSeason.delete({
    where: { id: payload.data.id }
  });

  revalidateTournamentViews();
}
