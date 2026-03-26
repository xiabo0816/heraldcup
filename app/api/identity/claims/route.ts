import { NextResponse } from "next/server";
import { normalizeActionErrorMessage } from "@/lib/action-message";
import { requireCurrentViewer } from "@/lib/identity";
import { cancelClaimRequest, createClaimRequest } from "@/lib/identity-workflow";
import { cancelClaimRequestSchema, createClaimRequestSchema } from "@/lib/validators";

export async function POST(request: Request) {
  try {
    const identity = await requireCurrentViewer();
    const viewer = identity.viewer;

    if (!viewer) {
      throw new Error("请先登录账号。");
    }

    const payload = createClaimRequestSchema.parse(await request.json());

    const { claim, player } = await createClaimRequest({
      userId: viewer.id,
      playerId: payload.playerId,
      note: payload.note?.trim() || null
    });

    return NextResponse.json({
      message: `已提交对 ${player.displayName} 的认领申请，等待后台审核。`,
      claim: {
        id: claim.id,
        playerId: player.id,
        playerSlug: player.slug,
        playerDisplayName: player.displayName,
        status: claim.status,
        submittedAt: claim.submittedAt.toISOString()
      }
    });
  } catch (error) {
    const message = normalizeActionErrorMessage(error, "提交申请失败，请稍后重试。");
    const status = message.includes("不存在") ? 404 : message.includes("不能") || message.includes("无需") || message.includes("请先") || message.includes("待审核") ? 409 : 400;
    return NextResponse.json({ message }, { status });
  }
}

export async function DELETE(request: Request) {
  try {
    const identity = await requireCurrentViewer();
    const viewer = identity.viewer;

    if (!viewer) {
      throw new Error("请先登录账号。");
    }

    const rawBody = await request.text();
    const payload = rawBody
      ? cancelClaimRequestSchema.parse(JSON.parse(rawBody) as unknown)
      : { claimRequestId: undefined };

    const { player } = await cancelClaimRequest({
      userId: viewer.id,
      claimRequestId: payload.claimRequestId
    });

    return NextResponse.json({
      message: `已取消 ${player.displayName} 的认领申请。`
    });
  } catch (error) {
    const message = normalizeActionErrorMessage(error, "取消申请失败，请稍后重试。");
    const status = message.includes("没有可取消") ? 404 : 400;
    return NextResponse.json({ message }, { status });
  }
}