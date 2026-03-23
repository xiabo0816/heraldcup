"use server";

import { Prisma } from "@prisma/client";
import { revalidatePath } from "next/cache";
import type { RecruitmentPostFormState } from "@/app/admin/recruitments/form-state";
import { db } from "@/lib/db";
import { createRecruitmentPostSchema, deleteRecruitmentPostSchema, updateRecruitmentPostSchema } from "@/lib/validators";

function toRecruitmentData(payload: {
  title: string;
  slug: string;
  teamName: string;
  topicId?: string;
  contact?: string;
  neededRolesText: string[];
  status: string;
  excerpt?: string;
  featured: boolean;
}) {
  return {
    title: payload.title,
    slug: payload.slug,
    teamName: payload.teamName,
    topicId: payload.topicId || null,
    contact: payload.contact || null,
    neededRoles: payload.neededRolesText,
    status: payload.status,
    excerpt: payload.excerpt || null,
    featured: payload.featured
  };
}

function revalidateRecruitmentViews() {
  revalidatePath("/admin/recruitments");
  revalidatePath("/community");
  revalidatePath("/community/activities");
  revalidatePath("/community/recruitments");
  revalidatePath("/community/topics");
}

export async function createRecruitmentPostAction(
  _: RecruitmentPostFormState,
  formData: FormData
): Promise<RecruitmentPostFormState> {
  const payload = createRecruitmentPostSchema.safeParse({
    title: formData.get("title"),
    slug: formData.get("slug"),
    teamName: formData.get("teamName"),
    topicId: formData.get("topicId"),
    contact: formData.get("contact"),
    neededRolesText: formData.get("neededRolesText"),
    status: formData.get("status"),
    excerpt: formData.get("excerpt"),
    featured: formData.get("featured")
  });

  if (!payload.success) {
    return { status: "error", message: payload.error.issues[0]?.message ?? "表单校验失败。" };
  }

  try {
    await db.recruitmentPost.create({ data: toRecruitmentData(payload.data) });
    revalidateRecruitmentViews();
    return { status: "success", message: `招募帖 ${payload.data.title} 已创建。` };
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
      return { status: "error", message: "slug 已存在，请更换一个新的 slug。" };
    }

    return { status: "error", message: "创建招募帖失败，请稍后重试。" };
  }
}

export async function updateRecruitmentPostAction(formData: FormData) {
  const payload = updateRecruitmentPostSchema.safeParse({
    id: formData.get("id"),
    title: formData.get("title"),
    slug: formData.get("slug"),
    teamName: formData.get("teamName"),
    topicId: formData.get("topicId"),
    contact: formData.get("contact"),
    neededRolesText: formData.get("neededRolesText"),
    status: formData.get("status"),
    excerpt: formData.get("excerpt"),
    featured: formData.get("featured")
  });

  if (!payload.success) {
    throw new Error(payload.error.issues[0]?.message ?? "更新招募帖失败。");
  }

  await db.recruitmentPost.update({
    where: { id: payload.data.id },
    data: toRecruitmentData(payload.data)
  });

  revalidateRecruitmentViews();
}

export async function deleteRecruitmentPostAction(formData: FormData) {
  const payload = deleteRecruitmentPostSchema.safeParse({ id: formData.get("id") });

  if (!payload.success) {
    throw new Error(payload.error.issues[0]?.message ?? "删除招募帖失败。");
  }

  await db.recruitmentPost.delete({ where: { id: payload.data.id } });
  revalidateRecruitmentViews();
}