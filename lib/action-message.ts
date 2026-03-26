import { z } from "zod";

function collectMessages(value: unknown): string[] {
  if (!value) {
    return [];
  }

  if (typeof value === "string") {
    const message = value.trim();
    return message ? [message] : [];
  }

  if (Array.isArray(value)) {
    return value.flatMap((item) => collectMessages(item));
  }

  if (typeof value === "object") {
    const record = value as Record<string, unknown>;

    if (typeof record.message === "string") {
      return collectMessages(record.message);
    }

    if (Array.isArray(record.issues)) {
      return collectMessages(record.issues);
    }
  }

  return [];
}

function parseStructuredMessage(message: string) {
  try {
    return collectMessages(JSON.parse(message));
  } catch {
    return [];
  }
}

export function normalizeActionMessage(message: string | null | undefined, fallback: string) {
  const rawMessage = message?.trim();

  if (!rawMessage) {
    return fallback;
  }

  const parsedMessages = parseStructuredMessage(rawMessage);
  if (parsedMessages.length) {
    return parsedMessages[0] ?? fallback;
  }

  return rawMessage;
}

export function normalizeActionErrorMessage(error: unknown, fallback: string) {
  if (error instanceof z.ZodError) {
    return error.issues[0]?.message?.trim() || fallback;
  }

  if (error instanceof SyntaxError) {
    return "请求内容格式不正确，请刷新后重试。";
  }

  if (error instanceof Error) {
    return normalizeActionMessage(error.message, fallback);
  }

  return fallback;
}