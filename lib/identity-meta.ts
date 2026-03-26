export const identityStageLabels = {
  guest: "游客",
  registered: "注册用户",
  "steam-bound": "已绑定 Steam",
  "claim-pending": "申请审核中",
  certified: "已认证选手"
} as const;

export const identityStageTimeline = [
  { key: "guest", label: identityStageLabels.guest },
  { key: "registered", label: identityStageLabels.registered },
  { key: "steam-bound", label: identityStageLabels["steam-bound"] },
  { key: "claim-pending", label: identityStageLabels["claim-pending"] },
  { key: "certified", label: identityStageLabels.certified }
] as const;

export function getIdentityStageLabel(stage: keyof typeof identityStageLabels) {
  return identityStageLabels[stage];
}