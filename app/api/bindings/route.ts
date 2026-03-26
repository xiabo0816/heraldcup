import { NextResponse } from "next/server";

export async function POST() {
  return NextResponse.json(
    {
      message: "旧的即时认领接口已经停用，请改用 /api/identity/session、/api/identity/steam-binding 和 /api/identity/claims。"
    },
    { status: 410 }
  );
}
