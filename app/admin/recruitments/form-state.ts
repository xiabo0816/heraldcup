export type RecruitmentPostFormState = {
  status: "idle" | "success" | "error";
  message: string;
};

export const initialRecruitmentPostFormState: RecruitmentPostFormState = {
  status: "idle",
  message: "发布后会直接出现在社区招募区，方便用户尽快看到队伍需求。"
};