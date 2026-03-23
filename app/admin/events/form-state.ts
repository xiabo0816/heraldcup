export type CommunityEventFormState = {
  status: "idle" | "success" | "error";
  message: string;
};

export const initialCommunityEventFormState: CommunityEventFormState = {
  status: "idle",
  message: "发布后会同步展示在活动页和搜索结果中。"
};