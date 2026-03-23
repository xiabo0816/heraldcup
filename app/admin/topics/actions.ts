"use server";

import { Prisma } from "@prisma/client";
import { revalidatePath } from "next/cache";
import type { CommunityTopicFormState } from "@/app/admin/topics/form-state";
import { db } from "@/lib/db";
import { createCommunityTopicSchema, deleteCommunityTopicSchema, updateCommunityTopicSchema } from "@/lib/validators";

function toTopicData(payload: {
  title: string;
  slug: string;
  description?: string;
  activityNote?: string;
  featured: boolean;
}) {
  return {
    title: payload.title,
    slug: payload.slug,
    description: payload.description || null,
    activityNote: payload.activityNote || null,
    featured: payload.featured
  };
}

function revalidateTopicViews() {
  revalidatePath("/admin/topics");
  revalidatePath("/community");
}

export async function createCommunityTopicAction(
  _: CommunityTopicFormState,
  formData: FormData
): Promise<CommunityTopicFormState> {
  const payload = createCommunityTopicSchema.safeParse({
    title: formData.get("title"),
    slug: formData.get("slug"),
    description: formData.get("description"),
    activityNote: formData.get("activityNote"),
    featured: formData.get("featured")
  });

  if (!payload.success) {
    return { status: "error", message: payload.error.issues[0]?.message ?? "表单校验失败。" };
  }

  try {
    await db.communityTopic.create({ data: toTopicData(payload.data) });
    revalidateTopicViews();
    return { status: "success", message: `话题 ${payload.data.title} 已创建。` };
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
      return { status: "error", message: "slug 已存在，请更换一个新的 slug。" };
    }

    return { status: "error", message: "创建话题失败，请稍后重试。" };
  }
}

export async function updateCommunityTopicAction(formData: FormData) {
  const payload = updateCommunityTopicSchema.safeParse({
    id: formData.get("id"),
    title: formData.get("title"),
    slug: formData.get("slug"),
    description: formData.get("description"),
    activityNote: formData.get("activityNote"),
    featured: formData.get("featured")
  });

  if (!payload.success) {
    throw new Error(payload.error.issues[0]?.message ?? "更新话题失败。");
  }

  await db.communityTopic.update({
    where: { id: payload.data.id },
    data: toTopicData(payload.data)
  });

  revalidateTopicViews();
}

export async function deleteCommunityTopicAction(formData: FormData) {
  const payload = deleteCommunityTopicSchema.safeParse({ id: formData.get("id") });

  if (!payload.success) {
    throw new Error(payload.error.issues[0]?.message ?? "删除话题失败。");
  }

  await db.communityTopic.delete({ where: { id: payload.data.id } });
  revalidateTopicViews();
}