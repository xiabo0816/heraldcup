"use server";

import { revalidatePath } from "next/cache";
import { Prisma } from "@prisma/client";
import type { ContentPageFormState } from "@/app/admin/content-pages/form-state";
import { db } from "@/lib/db";
import { createContentPageSchema, deleteContentPageSchema, updateContentPageSchema } from "@/lib/validators";

function normalizeDateTime(value: string | undefined) {
  if (!value) {
    return null;
  }

  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
}

function revalidateContentViews() {
  revalidatePath("/admin/content-pages");
  revalidatePath("/matches");
  revalidatePath("/");
}

function toContentData(payload: {
  title: string;
  slug: string;
  pageType: string;
  excerpt?: string;
  bodyText: string;
  publishedAt?: string;
  featured: boolean;
  matchId?: string;
}) {
  return {
    title: payload.title,
    slug: payload.slug,
    pageType: payload.pageType,
    excerpt: payload.excerpt || null,
    body: {
      content: payload.bodyText
    },
    publishedAt: normalizeDateTime(payload.publishedAt),
    featured: payload.featured,
    matchId: payload.matchId || null
  };
}

export async function createContentPageAction(
  _: ContentPageFormState,
  formData: FormData
): Promise<ContentPageFormState> {
  const payload = createContentPageSchema.safeParse({
    title: formData.get("title"),
    slug: formData.get("slug"),
    pageType: formData.get("pageType"),
    excerpt: formData.get("excerpt"),
    bodyText: formData.get("bodyText"),
    publishedAt: formData.get("publishedAt"),
    featured: formData.get("featured"),
    matchId: formData.get("matchId")
  });

  if (!payload.success) {
    return {
      status: "error",
      message: payload.error.issues[0]?.message ?? "表单校验失败。"
    };
  }

  try {
    await db.contentPage.create({
      data: toContentData(payload.data)
    });

    revalidateContentViews();

    return {
      status: "success",
      message: `内容页 ${payload.data.title} 已创建。`
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
      message: "创建内容页失败，请检查数据库连接或稍后重试。"
    };
  }
}

export async function updateContentPageAction(formData: FormData) {
  const payload = updateContentPageSchema.safeParse({
    id: formData.get("id"),
    title: formData.get("title"),
    slug: formData.get("slug"),
    pageType: formData.get("pageType"),
    excerpt: formData.get("excerpt"),
    bodyText: formData.get("bodyText"),
    publishedAt: formData.get("publishedAt"),
    featured: formData.get("featured"),
    matchId: formData.get("matchId")
  });

  if (!payload.success) {
    throw new Error(payload.error.issues[0]?.message ?? "更新内容页失败。");
  }

  await db.contentPage.update({
    where: { id: payload.data.id },
    data: toContentData(payload.data)
  });

  revalidateContentViews();
}

export async function deleteContentPageAction(formData: FormData) {
  const payload = deleteContentPageSchema.safeParse({
    id: formData.get("id")
  });

  if (!payload.success) {
    throw new Error(payload.error.issues[0]?.message ?? "删除内容页失败。");
  }

  await db.contentPage.delete({
    where: { id: payload.data.id }
  });

  revalidateContentViews();
}
