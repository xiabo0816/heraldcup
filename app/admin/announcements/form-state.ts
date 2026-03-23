export type AnnouncementFormState = {
  status: "idle" | "success" | "error";
  message: string;
};

export const initialAnnouncementFormState: AnnouncementFormState = {
  status: "idle",
  message: "发布后会优先展示在社区首页，适合赛程提醒和重要通知。"
};