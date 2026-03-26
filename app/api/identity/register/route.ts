import { NextResponse } from "next/server";
import { normalizeActionErrorMessage } from "@/lib/action-message";
import { db } from "@/lib/db";
import {
  AUTH_SESSION_COOKIE,
  AUTH_SESSION_MAX_AGE_SECONDS,
  createSessionToken,
  getSessionExpiryDate,
  hashPassword,
  hashSessionToken,
  normalizeEmail
} from "@/lib/auth";
import { registerIdentityAccountSchema } from "@/lib/validators";

export async function POST(request: Request) {
  try {
    const payload = registerIdentityAccountSchema.parse(await request.json());
    const email = normalizeEmail(payload.email);
    const existingUser = await db.user.findUnique({
      where: { email },
      select: { id: true }
    });

    if (existingUser) {
      return NextResponse.json({ message: "这个邮箱已经注册，请直接登录。" }, { status: 409 });
    }

    const passwordHash = await hashPassword(payload.password);
    const user = await db.user.create({
      data: {
        name: payload.name.trim(),
        email,
        passwordHash
      }
    });

    const sessionToken = createSessionToken();
    const expiresAt = getSessionExpiryDate();

    await db.authSession.create({
      data: {
        userId: user.id,
        tokenHash: hashSessionToken(sessionToken),
        expiresAt
      }
    });

    const response = NextResponse.json({
      message: "注册成功，已自动登录。",
      viewer: {
        id: user.id,
        name: user.name,
        email: user.email
      }
    });

    response.cookies.set(AUTH_SESSION_COOKIE, sessionToken, {
      httpOnly: true,
      sameSite: "lax",
      path: "/",
      maxAge: AUTH_SESSION_MAX_AGE_SECONDS,
      expires: expiresAt
    });

    return response;
  } catch (error) {
    const message = normalizeActionErrorMessage(error, "注册失败，请稍后重试。");
    return NextResponse.json({ message }, { status: 400 });
  }
}