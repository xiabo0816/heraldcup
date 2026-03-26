import { NextResponse } from "next/server";
import { normalizeActionErrorMessage } from "@/lib/action-message";
import { requireCurrentViewer } from "@/lib/identity";
import { bindSteamIdentity } from "@/lib/identity-workflow";
import { bindSteamAccountSchema } from "@/lib/validators";

export async function POST(request: Request) {
  try {
    const identity = await requireCurrentViewer();
    const viewer = identity.viewer;

    if (!viewer) {
      throw new Error("请先登录账号。");
    }

    const payload = bindSteamAccountSchema.parse(await request.json());
    const steamId = payload.steamId.trim();
    const { binding, summary } = await bindSteamIdentity({
      userId: viewer.id,
      steamId,
      certifiedPlayerId: identity.certifiedPlayer?.id ?? null
    });

    return NextResponse.json({
      message: "Steam 身份已完成绑定。",
      binding: {
        id: binding.id,
        steamId: binding.steamId,
        openDotaId: binding.openDotaId,
        status: binding.status,
        lastBoundAt: binding.lastBoundAt?.toISOString() ?? null
      },
      summary
    });
  } catch (error) {
    const message = normalizeActionErrorMessage(error, "Steam 绑定失败，请稍后重试。");
    const status = message.includes("其他账号") || message.includes("等待审核") ? 409 : 400;
    return NextResponse.json({ message }, { status });
  }
}