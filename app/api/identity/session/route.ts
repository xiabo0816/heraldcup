import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { normalizeActionErrorMessage } from "@/lib/action-message";
import { db } from "@/lib/db";
import {
  AUTH_SESSION_COOKIE,
  AUTH_SESSION_MAX_AGE_SECONDS,
  createSessionToken,
  getSessionExpiryDate,
  hashSessionToken,
  normalizeEmail,
  verifyPassword
} from "@/lib/auth";
import { getCurrentIdentitySnapshot } from "@/lib/identity";
import { loginIdentitySessionSchema } from "@/lib/validators";

export async function GET() {
  return NextResponse.json(await getCurrentIdentitySnapshot());
}

export async function POST(request: Request) {
  try {
    const payload = loginIdentitySessionSchema.parse(await request.json());
    const email = normalizeEmail(payload.email);
    const user = await db.user.findUnique({
      where: { email },
      select: {
        id: true,
        name: true,
        email: true,
        passwordHash: true
      }
    });

    if (!user?.passwordHash) {
      return NextResponse.json({ message: "邮箱或密码不正确。" }, { status: 401 });
    }

    const passwordMatches = await verifyPassword(payload.password, user.passwordHash);

    if (!passwordMatches) {
      return NextResponse.json({ message: "邮箱或密码不正确。" }, { status: 401 });
    }

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
      message: "登录成功。",
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
    const message = normalizeActionErrorMessage(error, "登录失败，请稍后重试。");
    return NextResponse.json({ message }, { status: 400 });
  }
}

export async function DELETE() {
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get(AUTH_SESSION_COOKIE)?.value?.trim() || null;

  if (sessionToken) {
    await db.authSession.deleteMany({
      where: {
        tokenHash: hashSessionToken(sessionToken)
      }
    });
  }

  const response = NextResponse.json({ message: "已退出当前身份会话。" });
  response.cookies.set(AUTH_SESSION_COOKIE, "", {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 0
  });
  return response;
}