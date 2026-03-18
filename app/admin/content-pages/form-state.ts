export type ContentPageFormState = {
  status: "idle" | "success" | "error";
  message: string;
};

export const initialContentPageFormState: ContentPageFormState = {
  status: "idle",
  message: "正文先按纯文本维护，后续再升级成结构化 block 或 markdown。"
};
