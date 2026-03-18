export type TeamFormState = {
  status: "idle" | "success" | "error";
  message: string;
};

export const initialTeamFormState: TeamFormState = {
  status: "idle",
  message: "填写完队伍名称、slug 和 slogan 后即可直接创建。"
};
