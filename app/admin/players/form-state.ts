export type PlayerFormState = {
  status: "idle" | "success" | "error";
  message: string;
};

export const initialPlayerFormState: PlayerFormState = {
  status: "idle",
  message: "英雄池和高光比赛 ID 支持用英文逗号或换行分隔。"
};
