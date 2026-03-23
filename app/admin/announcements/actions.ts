"use server";

import { Prisma } from "@prisma/client";
import { revalidatePath } from "next/cache";
import type { AnnouncementFormState } from "@/app/admin/announcements/form-state";
import { db } from "@/lib/db";
import { createAnnouncementSchema, deleteAnnouncementSchema, updateAnnouncementSchema } from "@/lib/validators";

function normalizeDateTime(value: string | undefined) {
  if (!value) {
    return null;
  }

  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
}

function toAnnouncementData(payload: {
  title: string;
  slug: string;
  excerpt?: string;
  bodyText: string;
  publishedAt?: string;
  featured: boolean;
}) {
  return {
    title: payload.title,
    slug: payload.slug,
    excerpt: payload.excerpt || null,
    body: { content: payload.bodyText },
    publishedAt: normalizeDateTime(payload.publishedAt),
    featured: payload.featured
  };
}

function revalidateAnnouncementViews() {
  revalidatePath("/admin/announcements");
  revalidatePath("/community");
}

export async function createAnnouncementAction(
  _: AnnouncementFormState,
  formData: FormData
): Promise<AnnouncementFormState> {
  const payload = createAnnouncementSchema.safeParse({
    title: formData.get("title"),
    slug: formData.get("slug"),
    excerpt: formData.get("excerpt"),
    bodyText: formData.get("bodyText"),
    publishedAt: formData.get("publishedAt"),
    featured: formData.get("featured")
  });

  if (!payload.success) {
    return {
      status: "error",
      message: payload.error.issues[0]?.message ?? "表单校验失败。"
    };
  }

  try {
    await db.announcement.create({ data: toAnnouncementData(payload.data) });
    revalidateAnnouncementViews();

    return {
      status: "success",
      message: `公告 ${payload.data.title} 已创建。`
    };
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
      return { status: "error", message: "slug 已存在，请更换一个新的 slug。" };
    }

    return { status: "error", message: "创建公告失败，请稍后重试。" };
  }
}

export async function updateAnnouncementAction(formData: FormData) {
  const payload = updateAnnouncementSchema.safeParse({
    id: formData.get("id"),
    title: formData.get("title"),
    slug: formData.get("slug"),
    excerpt: formData.get("excerpt"),
    bodyText: formData.get("bodyText"),
    publishedAt: formData.get("publishedAt"),
    featured: formData.get("featured")
  });

  if (!payload.success) {
    throw new Error(payload.error.issues[0]?.message ?? "更新公告失败。");
  }

  await db.announcement.update({
    where: { id: payload.data.id },
    data: toAnnouncementData(payload.data)
  });

  revalidateAnnouncementViews();
}

export async function deleteAnnouncementAction(formData: FormData) {
  const payload = deleteAnnouncementSchema.safeParse({ id: formData.get("id") });

  if (!payload.success) {
    throw new Error(payload.error.issues[0]?.message ?? "删除公告失败。");
  }

  await db.announcement.delete({ where: { id: payload.data.id } });
  revalidateAnnouncementViews();
}