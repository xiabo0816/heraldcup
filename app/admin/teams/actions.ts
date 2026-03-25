"use server";

import { revalidatePath } from "next/cache";
import { Prisma } from "@prisma/client";
import { db } from "@/lib/db";
import type { TeamFormState } from "@/app/admin/teams/form-state";
import { createTeamSchema, deleteTeamSchema, updateTeamSchema } from "@/lib/validators";

export async function createTeamAction(_: TeamFormState, formData: FormData): Promise<TeamFormState> {
  const payload = createTeamSchema.safeParse({
    name: formData.get("name"),
    slug: formData.get("slug"),
    slogan: formData.get("slogan"),
    logoUrl: formData.get("logoUrl"),
    honorPoints: formData.get("honorPoints"),
    coach: formData.get("coach"),
    captain: formData.get("captain"),
    summary: formData.get("summary")
  });

  if (!payload.success) {
    return {
      status: "error",
      message: payload.error.issues[0]?.message ?? "表单校验失败。"
    };
  }

  try {
    await db.team.create({
      data: {
        name: payload.data.name,
        slug: payload.data.slug,
        slogan: payload.data.slogan || null,
        logoUrl: payload.data.logoUrl || null,
        honorPoints: payload.data.honorPoints,
        coach: payload.data.coach || null,
        captain: payload.data.captain || null,
        summary: payload.data.summary || null
      }
    });

    revalidatePath("/admin/teams");
    revalidatePath("/teams");
    revalidatePath("/");

    return {
      status: "success",
      message: `队伍 ${payload.data.name} 已创建。`
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
      message: "创建队伍失败，请检查数据库连接或稍后重试。"
    };
  }
}

function revalidateTeamViews() {
  revalidatePath("/admin/teams");
  revalidatePath("/teams");
  revalidatePath("/");
}

export async function updateTeamAction(formData: FormData) {
  const payload = updateTeamSchema.safeParse({
    id: formData.get("id"),
    name: formData.get("name"),
    slug: formData.get("slug"),
    slogan: formData.get("slogan"),
    logoUrl: formData.get("logoUrl"),
    honorPoints: formData.get("honorPoints"),
    coach: formData.get("coach"),
    captain: formData.get("captain"),
    summary: formData.get("summary")
  });

  if (!payload.success) {
    throw new Error(payload.error.issues[0]?.message ?? "更新队伍失败。");
  }

  await db.team.update({
    where: { id: payload.data.id },
    data: {
      name: payload.data.name,
      slug: payload.data.slug,
      slogan: payload.data.slogan || null,
      logoUrl: payload.data.logoUrl || null,
      honorPoints: payload.data.honorPoints,
      coach: payload.data.coach || null,
      captain: payload.data.captain || null,
      summary: payload.data.summary || null
    }
  });

  revalidateTeamViews();
}

export async function deleteTeamAction(formData: FormData) {
  const payload = deleteTeamSchema.safeParse({
    id: formData.get("id")
  });

  if (!payload.success) {
    throw new Error(payload.error.issues[0]?.message ?? "删除队伍失败。");
  }

  await db.team.delete({
    where: { id: payload.data.id }
  });

  revalidateTeamViews();
}
