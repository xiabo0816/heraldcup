export type ContentPageFormState = {
  status: "idle" | "success" | "error";
  message: string;
};

export const initialContentPageFormState: ContentPageFormState = {
  status: "idle",
  message: "录入标题、摘要和正文后，就可以先用于前台内容展示。"
};
