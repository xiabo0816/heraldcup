export type IdentityActionMessage = {
  message?: string;
};

export type IdentityFeedbackTone = "idle" | "success" | "error";

export type IdentityClientOptions = {
  refresh?: boolean;
  redirectTo?: string;
};

export type IdentityFieldErrors = Partial<Record<"name" | "email" | "password" | "steamId" | "playerId" | "note", string>>;

export type IdentityClientResult<T = undefined> = {
  ok: boolean;
  message: string;
  data: T;
};

export type IdentityActionFeedback = Pick<IdentityClientResult<undefined>, "ok" | "message">;

export type IdentityClaimPayload = {
  id: string;
  playerId: string;
  playerSlug: string;
  playerDisplayName: string;
  status: string;
  submittedAt: string;
};

export type SteamBindSummary = {
  personaName: string | null;
};