export type MatchFormState = {
  status: "idle" | "success" | "error";
  message: string;
};

export const initialMatchFormState: MatchFormState = {
  status: "idle",
  message: "创建比赛时建议直接使用稳定 slug，方便高光比赛 ID 和内容页关联。"
};
