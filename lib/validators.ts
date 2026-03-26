import { z } from "zod";

const splitListInput = (value: unknown) => {
  if (typeof value !== "string") {
    return [] as string[];
  }

  return value
    .split(/[\n,]/)
    .map((item) => item.trim())
    .filter(Boolean);
};

const checkboxToBoolean = (value: unknown) => value === "on" || value === true;

const optionalInteger = z.preprocess((value) => {
  if (value === "" || value === null || value === undefined) {
    return undefined;
  }

  const parsed = Number(value);
  return Number.isNaN(parsed) ? value : parsed;
}, z.number().int().nonnegative().optional());

export const registerIdentityAccountSchema = z.object({
  name: z.string().trim().min(2, "昵称至少 2 个字符。").max(40, "昵称不能超过 40 个字符。"),
  email: z.string().trim().email("邮箱格式不正确。").max(120, "邮箱不能超过 120 个字符。"),
  password: z.string().min(8, "密码至少 8 位。").max(128, "密码不能超过 128 位。")
});

export const loginIdentitySessionSchema = z.object({
  email: z.string().trim().email("邮箱格式不正确。").max(120, "邮箱不能超过 120 个字符。"),
  password: z.string().min(8, "密码至少 8 位。").max(128, "密码不能超过 128 位。")
});

export const bindSteamAccountSchema = z.object({
  steamId: z.string().trim().min(8, "SteamID 不能少于 8 位。").max(32, "SteamID 不能超过 32 位。")
});

export const createClaimRequestSchema = z.object({
  playerId: z.string().trim().min(1, "请选择要认领的选手。"),
  note: z.string().trim().max(600, "补充说明不能超过 600 个字符。").optional().or(z.literal(""))
});

export const cancelClaimRequestSchema = z.object({
  claimRequestId: z.string().trim().min(1, "缺少申请 ID。").optional()
});

export const reviewClaimRequestSchema = z.object({
  claimRequestId: z.string().trim().min(1, "缺少申请 ID。"),
  decision: z.enum(["APPROVE", "REJECT", "CANCEL", "SAVE"]),
  reviewNote: z.string().trim().max(600, "审核备注不能超过 600 个字符。").optional().or(z.literal(""))
});

export const createTeamSchema = z.object({
  name: z.string().trim().min(1, "队伍名称不能为空。"),
  slug: z
    .string()
    .trim()
    .min(1, "slug 不能为空。")
    .regex(/^[a-z0-9-]+$/, "slug 只能包含小写字母、数字和连字符。"),
  slogan: z.string().trim().max(120, "slogan 不能超过 120 个字符。").optional().or(z.literal("")),
  logoUrl: z.string().trim().max(300, "队徽链接不能超过 300 个字符。").optional().or(z.literal("")),
  honorPoints: z.preprocess((value) => {
    if (value === "" || value === null || value === undefined) {
      return 0;
    }

    const parsed = Number(value);
    return Number.isNaN(parsed) ? value : parsed;
  }, z.number().int().min(0, "战队积分不能小于 0。")),
  coach: z.string().trim().max(60, "教练字段不能超过 60 个字符。").optional().or(z.literal("")),
  captain: z.string().trim().max(60, "队长字段不能超过 60 个字符。").optional().or(z.literal("")),
  summary: z.string().trim().max(500, "队伍介绍不能超过 500 个字符。").optional().or(z.literal(""))
});

export const updateTeamSchema = createTeamSchema.extend({
  id: z.string().trim().min(1, "缺少队伍 ID。")
});

export const deleteTeamSchema = z.object({
  id: z.string().trim().min(1, "缺少队伍 ID。")
});

export const createPlayerSchema = z.object({
  displayName: z.string().trim().min(1, "选手名称不能为空。"),
  slug: z
    .string()
    .trim()
    .min(1, "slug 不能为空。")
    .regex(/^[a-z0-9-]+$/, "slug 只能包含小写字母、数字和连字符。"),
  steamId: z.string().trim().max(32, "SteamID 不能超过 32 个字符。").optional().or(z.literal("")),
  primaryRole: z.string().trim().max(40, "位置字段不能超过 40 个字符。").optional().or(z.literal("")),
  preferredRolesText: z.preprocess(splitListInput, z.array(z.string()).max(10, "擅长位置不能超过 10 条。")),
  heroPoolText: z.preprocess(splitListInput, z.array(z.string()).max(20, "擅长英雄数量不能超过 20 条。")),
  ladderScore: optionalInteger,
  gameYears: optionalInteger,
  playStylesText: z.preprocess(splitListInput, z.array(z.string()).max(12, "打法风格不能超过 12 条。")),
  highlightMatchIdsText: z.preprocess(splitListInput, z.array(z.string()).max(20, "高光比赛 ID 不能超过 20 条。")),
  bio: z.string().trim().max(500, "简介不能超过 500 个字符。").optional().or(z.literal("")),
  gameUnderstanding: z.string().trim().max(1200, "我的游戏理解不能超过 1200 个字符。").optional().or(z.literal("")),
  active: z.preprocess(checkboxToBoolean, z.boolean()),
  featured: z.preprocess(checkboxToBoolean, z.boolean())
});

export const updatePlayerSchema = createPlayerSchema.extend({
  id: z.string().trim().min(1, "缺少选手 ID。")
});

export const deletePlayerSchema = z.object({
  id: z.string().trim().min(1, "缺少选手 ID。")
});

export const createCaptainTeamSchema = z.object({
  name: z.string().trim().min(1, "队伍名称不能为空。"),
  slug: z
    .string()
    .trim()
    .min(1, "slug 不能为空。")
    .regex(/^[a-z0-9-]+$/, "slug 只能包含小写字母、数字和连字符。"),
  slogan: z.string().trim().max(120, "口号不能超过 120 个字符。").optional().or(z.literal("")),
  summary: z.string().trim().max(500, "队伍介绍不能超过 500 个字符。").optional().or(z.literal(""))
});

export const manageCaptainTeamMemberSchema = z.object({
  teamId: z.string().trim().min(1, "缺少队伍 ID。"),
  playerId: z.string().trim().min(1, "缺少选手 ID。")
});

export const createPlayerReviewSchema = z.object({
  targetPlayerId: z.string().trim().min(1, "缺少被评价选手 ID。"),
  content: z.string().trim().min(2, "评价内容至少写 2 个字。").max(600, "评价内容不能超过 600 个字符。")
});

export const togglePlayerReviewVisibilitySchema = z.object({
  reviewId: z.string().trim().min(1, "缺少评价 ID。"),
  targetPlayerId: z.string().trim().min(1, "缺少选手 ID。"),
  showOnProfile: z.preprocess((value) => value === "true" || value === true, z.boolean())
});

const matchSchemaBase = z.object({
  title: z.string().trim().min(1, "比赛标题不能为空。"),
  slug: z
    .string()
    .trim()
    .min(1, "slug 不能为空。")
    .regex(/^[a-z0-9-]+$/, "slug 只能包含小写字母、数字和连字符。"),
  externalMatchId: z.string().trim().max(64, "外部比赛 ID 不能超过 64 个字符。").optional().or(z.literal("")),
  scheduledAt: z.string().trim().optional().or(z.literal("")),
  format: z.string().trim().max(20, "赛制字段不能超过 20 个字符。").optional().or(z.literal("")),
  status: z.enum(["DRAFT", "SCHEDULED", "LIVE", "FINISHED", "ARCHIVED"]),
  streamUrl: z.string().trim().max(300, "直播链接不能超过 300 个字符。").optional().or(z.literal("")),
  summary: z.string().trim().max(500, "比赛摘要不能超过 500 个字符。").optional().or(z.literal("")),
  topicId: z.string().trim().optional().or(z.literal("")),
  seasonId: z.string().trim().optional().or(z.literal("")),
  stageId: z.string().trim().optional().or(z.literal("")),
  roundNumber: optionalInteger,
  sequenceNumber: optionalInteger,
  winnerTeamId: z.string().trim().optional().or(z.literal("")),
  teamAId: z.string().trim().optional().or(z.literal("")),
  teamBId: z.string().trim().optional().or(z.literal("")),
  teamCId: z.string().trim().optional().or(z.literal("")),
  teamDId: z.string().trim().optional().or(z.literal("")),
  scoreA: optionalInteger,
  scoreB: optionalInteger,
  scoreC: optionalInteger,
  scoreD: optionalInteger,
  rankA: optionalInteger,
  rankB: optionalInteger,
  rankC: optionalInteger,
  rankD: optionalInteger,
  gameExternalMatchId1: z.string().trim().max(64, "分局比赛 ID 不能超过 64 个字符。").optional().or(z.literal("")),
  gameExternalMatchId2: z.string().trim().max(64, "分局比赛 ID 不能超过 64 个字符。").optional().or(z.literal("")),
  gameExternalMatchId3: z.string().trim().max(64, "分局比赛 ID 不能超过 64 个字符。").optional().or(z.literal("")),
  gameExternalMatchId4: z.string().trim().max(64, "分局比赛 ID 不能超过 64 个字符。").optional().or(z.literal("")),
  gameExternalMatchId5: z.string().trim().max(64, "分局比赛 ID 不能超过 64 个字符。").optional().or(z.literal("")),
  gameWinnerTeamId1: z.string().trim().optional().or(z.literal("")),
  gameWinnerTeamId2: z.string().trim().optional().or(z.literal("")),
  gameWinnerTeamId3: z.string().trim().optional().or(z.literal("")),
  gameWinnerTeamId4: z.string().trim().optional().or(z.literal("")),
  gameWinnerTeamId5: z.string().trim().optional().or(z.literal("")),
  gameStatus1: z.enum(["DRAFT", "SCHEDULED", "LIVE", "FINISHED", "ARCHIVED"]).optional(),
  gameStatus2: z.enum(["DRAFT", "SCHEDULED", "LIVE", "FINISHED", "ARCHIVED"]).optional(),
  gameStatus3: z.enum(["DRAFT", "SCHEDULED", "LIVE", "FINISHED", "ARCHIVED"]).optional(),
  gameStatus4: z.enum(["DRAFT", "SCHEDULED", "LIVE", "FINISHED", "ARCHIVED"]).optional(),
  gameStatus5: z.enum(["DRAFT", "SCHEDULED", "LIVE", "FINISHED", "ARCHIVED"]).optional(),
  gameSummary1: z.string().trim().max(300, "分局说明不能超过 300 个字符。").optional().or(z.literal("")),
  gameSummary2: z.string().trim().max(300, "分局说明不能超过 300 个字符。").optional().or(z.literal("")),
  gameSummary3: z.string().trim().max(300, "分局说明不能超过 300 个字符。").optional().or(z.literal("")),
  gameSummary4: z.string().trim().max(300, "分局说明不能超过 300 个字符。").optional().or(z.literal("")),
  gameSummary5: z.string().trim().max(300, "分局说明不能超过 300 个字符。").optional().or(z.literal(""))
});

function withMatchValidation<T extends z.ZodTypeAny>(schema: T) {
  return schema.superRefine((value, context) => {
    const participantIds = [value.teamAId, value.teamBId, value.teamCId, value.teamDId].filter(Boolean);

    if (participantIds.length < 2) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        message: "至少需要 2 支参赛队伍。",
        path: ["teamBId"]
      });
    }

    if (new Set(participantIds).size !== participantIds.length) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        message: "参赛队伍不能重复。",
        path: ["teamBId"]
      });
    }
  });

}

export const createMatchSchema = withMatchValidation(matchSchemaBase);

export const updateMatchSchema = withMatchValidation(matchSchemaBase.extend({
  id: z.string().trim().min(1, "缺少比赛 ID。")
}));

export const deleteMatchSchema = z.object({
  id: z.string().trim().min(1, "缺少比赛 ID。")
});

export const createMatchTemplateSchema = z.object({
  seasonId: z.string().trim().min(1, "请选择赛季。"),
  template: z.enum(["DIRECT_BO3", "GAUNTLET", "FINAL_FOUR"]),
  bestOf: z.preprocess((value) => {
    if (value === "" || value === null || value === undefined) {
      return 3;
    }

    const parsed = Number(value);
    return Number.isNaN(parsed) ? value : parsed;
  }, z.number().int().positive("赛制局数必须是正整数。")),
  scheduledAt: z.string().trim().optional().or(z.literal("")),
  replaceExisting: z.preprocess(checkboxToBoolean, z.boolean()),
  teamAId: z.string().trim().optional().or(z.literal("")),
  teamBId: z.string().trim().optional().or(z.literal("")),
  teamCId: z.string().trim().optional().or(z.literal("")),
  teamDId: z.string().trim().optional().or(z.literal(""))
}).superRefine((value, context) => {
  const participantIds = [value.teamAId, value.teamBId, value.teamCId, value.teamDId].filter(Boolean);

  if (new Set(participantIds).size !== participantIds.length) {
    context.addIssue({
      code: z.ZodIssueCode.custom,
      message: "模板中的队伍不能重复。",
      path: ["teamBId"]
    });
  }

  const requiredCount = value.template === "DIRECT_BO3" ? 2 : value.template === "GAUNTLET" ? 3 : 4;

  if (participantIds.length < requiredCount) {
    context.addIssue({
      code: z.ZodIssueCode.custom,
      message: `当前模板至少需要 ${requiredCount} 支队伍。`,
      path: ["teamDId"]
    });
  }
});

const tournamentKindSchema = z.enum(["PIONEER", "GUANJUE", "LEGEND", "CUSTOM"]);

const tournamentSeasonSchemaBase = z.object({
  tournamentName: z.string().trim().min(1, "赛事名称不能为空。"),
  tournamentSlug: z
    .string()
    .trim()
    .min(1, "赛事 slug 不能为空。")
    .regex(/^[a-z0-9-]+$/, "赛事 slug 只能包含小写字母、数字和连字符。"),
  tournamentKind: tournamentKindSchema,
  tournamentDescription: z.string().trim().max(300, "赛事描述不能超过 300 个字符。").optional().or(z.literal("")),
  title: z.string().trim().min(1, "届次标题不能为空。"),
  slug: z
    .string()
    .trim()
    .min(1, "赛季 slug 不能为空。")
    .regex(/^[a-z0-9-]+$/, "赛季 slug 只能包含小写字母、数字和连字符。"),
  seasonNumber: z.preprocess((value) => Number(value), z.number().int().positive("届次必须为正整数。")),
  statusLabel: z.string().trim().max(40, "状态标签不能超过 40 个字符。").optional().or(z.literal("")),
  themeColor: z.string().trim().max(40, "主题色不能超过 40 个字符。").optional().or(z.literal("")),
  summary: z.string().trim().max(500, "赛季摘要不能超过 500 个字符。").optional().or(z.literal("")),
  featured: z.preprocess(checkboxToBoolean, z.boolean())
});

export const createTournamentSeasonSchema = tournamentSeasonSchemaBase;

export const updateTournamentSeasonSchema = tournamentSeasonSchemaBase.extend({
  id: z.string().trim().min(1, "缺少赛季 ID。"),
  tournamentId: z.string().trim().min(1, "缺少赛事 ID。")
});

export const deleteTournamentSeasonSchema = z.object({
  id: z.string().trim().min(1, "缺少赛季 ID。")
});

export const createContentPageSchema = z.object({
  title: z.string().trim().min(1, "内容标题不能为空。"),
  slug: z
    .string()
    .trim()
    .min(1, "slug 不能为空。")
    .regex(/^[a-z0-9-]+$/, "slug 只能包含小写字母、数字和连字符。"),
  pageType: z.string().trim().min(1, "页面类型不能为空。"),
  excerpt: z.string().trim().max(300, "摘要不能超过 300 个字符。").optional().or(z.literal("")),
  bodyText: z.string().trim().min(1, "正文不能为空。"),
  publishedAt: z.string().trim().optional().or(z.literal("")),
  featured: z.preprocess(checkboxToBoolean, z.boolean()),
  matchId: z.string().trim().optional().or(z.literal("")),
  topicId: z.string().trim().optional().or(z.literal(""))
});

export const updateContentPageSchema = createContentPageSchema.extend({
  id: z.string().trim().min(1, "缺少内容页 ID。")
});

export const deleteContentPageSchema = z.object({
  id: z.string().trim().min(1, "缺少内容页 ID。")
});

export const createAnnouncementSchema = z.object({
  title: z.string().trim().min(1, "公告标题不能为空。"),
  slug: z.string().trim().min(1, "slug 不能为空。").regex(/^[a-z0-9-]+$/, "slug 只能包含小写字母、数字和连字符。"),
  excerpt: z.string().trim().max(300, "摘要不能超过 300 个字符。").optional().or(z.literal("")),
  bodyText: z.string().trim().min(1, "公告正文不能为空。"),
  publishedAt: z.string().trim().optional().or(z.literal("")),
  featured: z.preprocess(checkboxToBoolean, z.boolean())
});

export const updateAnnouncementSchema = createAnnouncementSchema.extend({
  id: z.string().trim().min(1, "缺少公告 ID。")
});

export const deleteAnnouncementSchema = z.object({
  id: z.string().trim().min(1, "缺少公告 ID。")
});

export const createCommunityTopicSchema = z.object({
  title: z.string().trim().min(1, "话题标题不能为空。"),
  slug: z.string().trim().min(1, "slug 不能为空。").regex(/^[a-z0-9-]+$/, "slug 只能包含小写字母、数字和连字符。"),
  description: z.string().trim().max(300, "话题描述不能超过 300 个字符。").optional().or(z.literal("")),
  activityNote: z.string().trim().max(80, "活动标签不能超过 80 个字符。").optional().or(z.literal("")),
  featured: z.preprocess(checkboxToBoolean, z.boolean())
});

export const updateCommunityTopicSchema = createCommunityTopicSchema.extend({
  id: z.string().trim().min(1, "缺少话题 ID。")
});

export const deleteCommunityTopicSchema = z.object({
  id: z.string().trim().min(1, "缺少话题 ID。")
});

export const createRecruitmentPostSchema = z.object({
  title: z.string().trim().min(1, "招募标题不能为空。"),
  slug: z.string().trim().min(1, "slug 不能为空。").regex(/^[a-z0-9-]+$/, "slug 只能包含小写字母、数字和连字符。"),
  teamName: z.string().trim().min(1, "队伍名称不能为空。"),
  topicId: z.string().trim().optional().or(z.literal("")),
  contact: z.string().trim().max(120, "联系方式不能超过 120 个字符。").optional().or(z.literal("")),
  neededRolesText: z.preprocess(splitListInput, z.array(z.string()).max(10, "招募位置不能超过 10 条。")),
  status: z.string().trim().min(1, "状态不能为空。"),
  excerpt: z.string().trim().max(300, "摘要不能超过 300 个字符。").optional().or(z.literal("")),
  featured: z.preprocess(checkboxToBoolean, z.boolean())
});

export const updateRecruitmentPostSchema = createRecruitmentPostSchema.extend({
  id: z.string().trim().min(1, "缺少招募帖 ID。")
});

export const deleteRecruitmentPostSchema = z.object({
  id: z.string().trim().min(1, "缺少招募帖 ID。")
});

export const createCommunityEventSchema = z.object({
  title: z.string().trim().min(1, "活动标题不能为空。"),
  slug: z.string().trim().min(1, "slug 不能为空。").regex(/^[a-z0-9-]+$/, "slug 只能包含小写字母、数字和连字符。"),
  topicId: z.string().trim().optional().or(z.literal("")),
  summary: z.string().trim().max(300, "摘要不能超过 300 个字符。").optional().or(z.literal("")),
  bodyText: z.string().trim().min(1, "活动正文不能为空。"),
  startsAt: z.string().trim().optional().or(z.literal("")),
  endsAt: z.string().trim().optional().or(z.literal("")),
  location: z.string().trim().max(120, "活动地点不能超过 120 个字符。").optional().or(z.literal("")),
  status: z.string().trim().min(1, "活动状态不能为空。"),
  ctaLabel: z.string().trim().max(60, "按钮文案不能超过 60 个字符。").optional().or(z.literal("")),
  ctaHref: z.string().trim().max(300, "按钮链接不能超过 300 个字符。").optional().or(z.literal("")),
  featured: z.preprocess(checkboxToBoolean, z.boolean())
});

export const updateCommunityEventSchema = createCommunityEventSchema.extend({
  id: z.string().trim().min(1, "缺少活动 ID。")
});

export const deleteCommunityEventSchema = z.object({
  id: z.string().trim().min(1, "缺少活动 ID。")
});
