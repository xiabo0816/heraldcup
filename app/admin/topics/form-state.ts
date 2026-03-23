export type CommunityTopicFormState = {
  status: "idle" | "success" | "error";
  message: string;
};

export const initialCommunityTopicFormState: CommunityTopicFormState = {
  status: "idle",
  message: "热门话题会直接挂到社区页顶部热区。"
};