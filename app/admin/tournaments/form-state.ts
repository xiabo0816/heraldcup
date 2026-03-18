export type TournamentFormState = {
  status: "idle" | "success" | "error";
  message: string;
};

export const initialTournamentFormState: TournamentFormState = {
  status: "idle",
  message: "可直接创建新赛事系列与首个赛季；如果赛事 slug 已存在，则会复用原系列并新增赛季。"
};
