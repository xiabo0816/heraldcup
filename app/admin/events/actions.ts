"use server";

import { Prisma } from "@prisma/client";
import { revalidatePath } from "next/cache";
import type { CommunityEventFormState } from "@/app/admin/events/form-state";
import { db } from "@/lib/db";
import { createCommunityEventSchema, deleteCommunityEventSchema, updateCommunityEventSchema } from "@/lib/validators";

function normalizeDateTime(value: string | undefined) {
  if (!value) {
    return null;
  }

  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
}

function toCommunityEventData(payload: {
  title: string;
  slug: string;
  topicId?: string;
  summary?: string;
  bodyText: string;
  startsAt?: string;
  endsAt?: string;
  location?: string;
  status: string;
  ctaLabel?: string;
  ctaHref?: string;
  featured: boolean;
}) {
  return {
    title: payload.title,
    slug: payload.slug,
    topicId: payload.topicId || null,
    summary: payload.summary || null,
    body: { content: payload.bodyText },
    startsAt: normalizeDateTime(payload.startsAt),
    endsAt: normalizeDateTime(payload.endsAt),
    location: payload.location || null,
    status: payload.status,
    ctaLabel: payload.ctaLabel || null,
    ctaHref: payload.ctaHref || null,
    featured: payload.featured
  };
}

function revalidateCommunityEventViews() {
  revalidatePath("/admin/events");
  revalidatePath("/community");
  revalidatePath("/community/activities");
}

export async function createCommunityEventAction(_: CommunityEventFormState, formData: FormData): Promise<CommunityEventFormState> {
  const payload = createCommunityEventSchema.safeParse({
    title: formData.get("title"),
    slug: formData.get("slug"),
    topicId: formData.get("topicId"),
    summary: formData.get("summary"),
    bodyText: formData.get("bodyText"),
    startsAt: formData.get("startsAt"),
    endsAt: formData.get("endsAt"),
    location: formData.get("location"),
    status: formData.get("status"),
    ctaLabel: formData.get("ctaLabel"),
    ctaHref: formData.get("ctaHref"),
    featured: formData.get("featured")
  });

  if (!payload.success) {
    return { status: "error", message: payload.error.issues[0]?.message ?? "表单校验失败。" };
  }

  try {
    await db.communityEvent.create({ data: toCommunityEventData(payload.data) });
    revalidateCommunityEventViews();
    return { status: "success", message: `活动 ${payload.data.title} 已创建。` };
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
      return { status: "error", message: "slug 已存在，请更换一个新的 slug。" };
    }

    return { status: "error", message: "创建活动失败，请稍后重试。" };
  }
}

export async function updateCommunityEventAction(formData: FormData) {
  const payload = updateCommunityEventSchema.safeParse({
    id: formData.get("id"),
    title: formData.get("title"),
    slug: formData.get("slug"),
    topicId: formData.get("topicId"),
    summary: formData.get("summary"),
    bodyText: formData.get("bodyText"),
    startsAt: formData.get("startsAt"),
    endsAt: formData.get("endsAt"),
    location: formData.get("location"),
    status: formData.get("status"),
    ctaLabel: formData.get("ctaLabel"),
    ctaHref: formData.get("ctaHref"),
    featured: formData.get("featured")
  });

  if (!payload.success) {
    throw new Error(payload.error.issues[0]?.message ?? "更新活动失败。");
  }

  await db.communityEvent.update({
    where: { id: payload.data.id },
    data: toCommunityEventData(payload.data)
  });

  revalidateCommunityEventViews();
}

export async function deleteCommunityEventAction(formData: FormData) {
  const payload = deleteCommunityEventSchema.safeParse({ id: formData.get("id") });

  if (!payload.success) {
    throw new Error(payload.error.issues[0]?.message ?? "删除活动失败。");
  }

  await db.communityEvent.delete({ where: { id: payload.data.id } });
  revalidateCommunityEventViews();
}