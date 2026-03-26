"use client";

import { useRouter } from "next/navigation";
import { normalizeActionMessage } from "@/lib/action-message";
import { writeIdentityFlashMessage } from "@/lib/identity-flash";
import type {
  IdentityActionMessage,
  IdentityClaimPayload,
  IdentityClientOptions,
  IdentityClientResult,
  SteamBindSummary
} from "@/lib/identity-client-types";

async function readJson<T>(response: Response) {
  try {
    return (await response.json()) as T;
  } catch {
    return null;
  }
}

function resolveMessage(payload: IdentityActionMessage | null, fallback: string) {
  return normalizeActionMessage(payload?.message, fallback);
}

export function useIdentityClient() {
  const router = useRouter();

  async function finishSuccess(message: string, options?: IdentityClientOptions) {
    writeIdentityFlashMessage(message);

    if (options?.redirectTo) {
      router.push(options.redirectTo);
    }

    if (options?.refresh !== false) {
      router.refresh();
    }
  }

  async function register(input: { name: string; email: string; password: string }, options?: IdentityClientOptions): Promise<IdentityClientResult<undefined>> {
    try {
      const response = await fetch("/api/identity/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(input)
      });

      const payload = await readJson<IdentityActionMessage>(response);
      const result = {
        ok: response.ok,
        message: resolveMessage(payload, response.ok ? "注册成功。" : "注册失败。"),
        data: undefined
      };

      if (response.ok) {
        await finishSuccess(result.message, options);
      }

      return result;
    } catch (error) {
      return {
        ok: false,
        message: normalizeActionMessage(error instanceof Error ? error.message : null, "注册失败，请稍后重试。"),
        data: undefined
      };
    }
  }

  async function login(input: { email: string; password: string }, options?: IdentityClientOptions): Promise<IdentityClientResult<undefined>> {
    try {
      const response = await fetch("/api/identity/session", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(input)
      });

      const payload = await readJson<IdentityActionMessage>(response);
      const result = {
        ok: response.ok,
        message: resolveMessage(payload, response.ok ? "登录成功。" : "登录失败。"),
        data: undefined
      };

      if (response.ok) {
        await finishSuccess(result.message, options);
      }

      return result;
    } catch (error) {
      return {
        ok: false,
        message: normalizeActionMessage(error instanceof Error ? error.message : null, "登录失败，请稍后重试。"),
        data: undefined
      };
    }
  }

  async function logout(options?: IdentityClientOptions): Promise<IdentityClientResult<undefined>> {
    try {
      const response = await fetch("/api/identity/session", { method: "DELETE" });
      const payload = await readJson<IdentityActionMessage>(response);
      const result = {
        ok: response.ok,
        message: resolveMessage(payload, response.ok ? "已退出当前账号。" : "退出失败。"),
        data: undefined
      };

      if (response.ok) {
        await finishSuccess(result.message, options);
      }

      return result;
    } catch (error) {
      return {
        ok: false,
        message: normalizeActionMessage(error instanceof Error ? error.message : null, "退出失败，请稍后重试。"),
        data: undefined
      };
    }
  }

  async function bindSteam(input: { steamId: string }, options?: IdentityClientOptions): Promise<IdentityClientResult<SteamBindSummary>> {
    try {
      const response = await fetch("/api/identity/steam-binding", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(input)
      });

      const payload = await readJson<IdentityActionMessage & { summary?: { personaName?: string | null } }>(response);
      const personaName = payload?.summary?.personaName ?? null;
      const result = {
        ok: response.ok,
        message: personaName
          ? `${resolveMessage(payload, response.ok ? "Steam 绑定成功。" : "Steam 绑定失败。")} OpenDota 昵称：${personaName}`
          : resolveMessage(payload, response.ok ? "Steam 绑定成功。" : "Steam 绑定失败。"),
        data: { personaName }
      };

      if (response.ok) {
        await finishSuccess(result.message, options);
      }

      return result;
    } catch (error) {
      return {
        ok: false,
        message: normalizeActionMessage(error instanceof Error ? error.message : null, "Steam 绑定失败，请稍后重试。"),
        data: { personaName: null }
      };
    }
  }

  async function createClaim(input: { playerId: string; note: string }, options?: IdentityClientOptions): Promise<IdentityClientResult<IdentityClaimPayload | null>> {
    try {
      const response = await fetch("/api/identity/claims", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(input)
      });

      const payload = await readJson<IdentityActionMessage & { claim?: IdentityClaimPayload }>(response);
      const result = {
        ok: response.ok && Boolean(payload?.claim),
        message: resolveMessage(payload, response.ok ? "认领申请已提交。" : "认领失败。"),
        data: payload?.claim ?? null
      };

      if (result.ok) {
        await finishSuccess(result.message, options);
      }

      return result;
    } catch (error) {
      return {
        ok: false,
        message: normalizeActionMessage(error instanceof Error ? error.message : null, "认领失败，请稍后重试。"),
        data: null
      };
    }
  }

  async function cancelClaim(input: { claimRequestId: string }, options?: IdentityClientOptions): Promise<IdentityClientResult<undefined>> {
    try {
      const response = await fetch("/api/identity/claims", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(input)
      });

      const payload = await readJson<IdentityActionMessage>(response);
      const result = {
        ok: response.ok,
        message: resolveMessage(payload, response.ok ? "申请已取消。" : "取消申请失败。"),
        data: undefined
      };

      if (response.ok) {
        await finishSuccess(result.message, options);
      }

      return result;
    } catch (error) {
      return {
        ok: false,
        message: normalizeActionMessage(error instanceof Error ? error.message : null, "取消申请失败，请稍后重试。"),
        data: undefined
      };
    }
  }

  return {
    register,
    login,
    logout,
    bindSteam,
    createClaim,
    cancelClaim
  };
}