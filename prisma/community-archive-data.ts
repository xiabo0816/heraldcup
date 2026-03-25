export type ArchiveTournamentKind = "PIONEER" | "LEGEND" | "GUANJUE";

export type ArchiveTeam = {
  name: string;
  slogan?: string;
  players: string[];
  championshipCount: number;
};

export type ArchivePlayer = {
  name: string;
  currentTeamName: string | null;
  formerTeamNames: string[];
  championshipCount: number;
  ladderScore?: number | null;
};

export type ArchiveCup = {
  title: string;
  scheduledAt: string | null;
  participantTeamNames: string[];
  championTeamName: string | null;
  format?: string;
  status?: "SCHEDULED" | "FINISHED";
  summary?: string;
};

export const communityArchiveTeams: ArchiveTeam[] = [
  { name: "第一届队伍1", players: ["隔壁老王", "叉烧包", "害怕否决", "友善的火元素", "善良的小姨子"], championshipCount: 0 },
  { name: "第一届队伍2", players: ["The Bad Guy", "chairchen", "饭饭", "JackBot", "iScream"], championshipCount: 1 },
  { name: "第二届队伍1", players: ["友善的火元素", "大鹅", "王绿茶", "超凶残的猫", "suzuki"], championshipCount: 0 },
  { name: "第二届队伍2", players: ["派", "up ships！！", "杀猪酱", "无敌LOL大王", "iScream"], championshipCount: 1 },
  { name: "食神", players: ["iScream", "饭饭", "王绿茶", "隔壁老王", "友善的火元素", "红色巧克李"], championshipCount: 0 },
  { name: "牛牛小小说话吊吊1.0", players: ["鲨鱼辣椒", "geihei", "杀猪酱", "up ships！！", "无敌LOL大王", "黄师傅龙虾", "叉烧包"], championshipCount: 1 },
  { name: "草帽小子海贼团1.0", players: ["黄师傅龙虾", "最近不太行", "友善的火元素", "饭饭", "烟雨", "邓布利多"], championshipCount: 1 },
  { name: "牛牛小小说话吊吊2.0", players: ["杀猪酱", "V", "无敌LOL大王", "叉烧包", "geihei", "up ships！！"], championshipCount: 0 },
  { name: "花开富贵", players: ["大威天龙", "冷暴力大法师", "听风", "鹅城九筒", "M", "geihei", "大鹅"], championshipCount: 3 },
  { name: "草帽小子海贼团2.0", players: ["友善的火元素", "派", "烟雨", "邓布利多", "饭饭", "茶"], championshipCount: 0 },
  { name: "草帽小子海贼团3.0", players: ["通天兔", "potong雪糕大王", "Stupid", "黄师傅龙虾", "最近不太行", "杀猪酱"], championshipCount: 0 },
  { name: "雪王", players: ["potong雪糕大王", "Stupid", "七", "蛋炒饭", "冬木之虎", "王绿茶"], championshipCount: 0 },
  { name: "what's up", players: ["鹅城九筒", "The Bad Guy", "XXBee", "七", "喜剧演员", "海鸥不再眷恋大海"], championshipCount: 0 },
  { name: "患者", players: ["cook", "玉玉症患者", "德普大王", "伍六七", "+ +", "小王子"], championshipCount: 3 },
  { name: "西浦军校教导队", players: ["杀猪酱", "up ships！！", "入江", "V", "无敌LOL大王"], championshipCount: 0 },
  { name: "花开富贵2.0", players: ["geihei", "大威天龙", "冷暴力大法师", "听风", "M", "赢一把睡觉"], championshipCount: 0 },
  { name: "医生", players: ["赢一把睡觉", "potong雪糕大王", "八", "叫我女王大人！", "一瓶橙"], championshipCount: 0 }
] as const;

export const communityArchivePlayers: ArchivePlayer[] = [
  { name: "隔壁老王", currentTeamName: null, formerTeamNames: ["食神", "第一届队伍1"], championshipCount: 0 },
  { name: "叉烧包", currentTeamName: null, formerTeamNames: ["第一届队伍1", "牛牛小小说话吊吊1.0", "牛牛小小说话吊吊2.0"], championshipCount: 1 },
  { name: "害怕否决", currentTeamName: null, formerTeamNames: ["第一届队伍1"], championshipCount: 0 },
  { name: "友善的火元素", currentTeamName: null, formerTeamNames: ["食神", "第一届队伍1", "第二届队伍1", "草帽小子海贼团1.0", "草帽小子海贼团2.0"], championshipCount: 1 },
  { name: "善良的小姨子", currentTeamName: null, formerTeamNames: ["第一届队伍1"], championshipCount: 0 },
  { name: "The Bad Guy", currentTeamName: null, formerTeamNames: ["第一届队伍2", "what's up"], championshipCount: 1 },
  { name: "chairchen", currentTeamName: null, formerTeamNames: ["第一届队伍2"], championshipCount: 1 },
  { name: "饭饭", currentTeamName: null, formerTeamNames: ["食神", "第一届队伍2", "草帽小子海贼团1.0", "草帽小子海贼团2.0"], championshipCount: 2 },
  { name: "JackBot", currentTeamName: null, formerTeamNames: ["第一届队伍2"], championshipCount: 1 },
  { name: "iScream", currentTeamName: null, formerTeamNames: ["第二届队伍2", "食神", "第一届队伍2"], championshipCount: 2 },
  { name: "大鹅", currentTeamName: null, formerTeamNames: ["第二届队伍1", "花开富贵"], championshipCount: 3 },
  { name: "王绿茶", currentTeamName: null, formerTeamNames: ["食神", "第二届队伍1", "雪王"], championshipCount: 0 },
  { name: "超凶残的猫", currentTeamName: null, formerTeamNames: ["第二届队伍1"], championshipCount: 0 },
  { name: "suzuki", currentTeamName: null, formerTeamNames: ["第二届队伍1"], championshipCount: 0 },
  { name: "派", currentTeamName: null, formerTeamNames: ["第二届队伍2", "草帽小子海贼团2.0"], championshipCount: 1 },
  { name: "up ships！！", currentTeamName: null, formerTeamNames: ["第二届队伍2", "牛牛小小说话吊吊1.0", "牛牛小小说话吊吊2.0", "西浦军校教导队"], championshipCount: 2 },
  { name: "杀猪酱", currentTeamName: null, formerTeamNames: ["第二届队伍2", "牛牛小小说话吊吊1.0", "牛牛小小说话吊吊2.0", "草帽小子海贼团3.0", "西浦军校教导队"], championshipCount: 2 },
  { name: "无敌LOL大王", currentTeamName: null, formerTeamNames: ["第二届队伍2", "牛牛小小说话吊吊1.0", "牛牛小小说话吊吊2.0", "西浦军校教导队"], championshipCount: 2 },
  { name: "红色巧克李", currentTeamName: null, formerTeamNames: ["食神"], championshipCount: 0 },
  { name: "鲨鱼辣椒", currentTeamName: null, formerTeamNames: ["牛牛小小说话吊吊1.0"], championshipCount: 1 },
  { name: "geihei", currentTeamName: null, formerTeamNames: ["牛牛小小说话吊吊1.0", "牛牛小小说话吊吊2.0", "花开富贵", "花开富贵2.0"], championshipCount: 4 },
  { name: "黄师傅龙虾", currentTeamName: null, formerTeamNames: ["牛牛小小说话吊吊1.0", "草帽小子海贼团1.0", "草帽小子海贼团3.0"], championshipCount: 2 },
  { name: "最近不太行", currentTeamName: null, formerTeamNames: ["草帽小子海贼团1.0", "草帽小子海贼团3.0"], championshipCount: 1 },
  { name: "烟雨", currentTeamName: null, formerTeamNames: ["草帽小子海贼团1.0", "草帽小子海贼团2.0"], championshipCount: 1 },
  { name: "邓布利多", currentTeamName: null, formerTeamNames: ["草帽小子海贼团1.0", "草帽小子海贼团2.0"], championshipCount: 1 },
  { name: "V", currentTeamName: null, formerTeamNames: ["牛牛小小说话吊吊2.0", "西浦军校教导队"], championshipCount: 0 },
  { name: "大威天龙", currentTeamName: null, formerTeamNames: ["花开富贵", "花开富贵2.0"], championshipCount: 3 },
  { name: "冷暴力大法师", currentTeamName: null, formerTeamNames: ["花开富贵", "花开富贵2.0"], championshipCount: 3 },
  { name: "听风", currentTeamName: null, formerTeamNames: ["花开富贵", "花开富贵2.0"], championshipCount: 3 },
  { name: "鹅城九筒", currentTeamName: null, formerTeamNames: ["花开富贵", "what's up"], championshipCount: 3 },
  { name: "M", currentTeamName: null, formerTeamNames: ["花开富贵", "花开富贵2.0"], championshipCount: 3 },
  { name: "茶", currentTeamName: null, formerTeamNames: ["草帽小子海贼团2.0"], championshipCount: 0 },
  { name: "Stupid", currentTeamName: null, formerTeamNames: ["雪王", "草帽小子海贼团3.0"], championshipCount: 0 },
  { name: "potong雪糕大王", currentTeamName: null, formerTeamNames: ["雪王", "草帽小子海贼团3.0", "医生"], championshipCount: 0 },
  { name: "通天兔", currentTeamName: null, formerTeamNames: ["草帽小子海贼团3.0"], championshipCount: 0 },
  { name: "七", currentTeamName: null, formerTeamNames: ["雪王", "what's up"], championshipCount: 0 },
  { name: "蛋炒饭", currentTeamName: null, formerTeamNames: ["雪王"], championshipCount: 0 },
  { name: "冬木之虎", currentTeamName: null, formerTeamNames: ["雪王"], championshipCount: 0 },
  { name: "XXBee", currentTeamName: null, formerTeamNames: ["what's up"], championshipCount: 0 },
  { name: "喜剧演员", currentTeamName: null, formerTeamNames: ["what's up"], championshipCount: 0 },
  { name: "海鸥不再眷恋大海", currentTeamName: null, formerTeamNames: ["what's up"], championshipCount: 0 },
  { name: "cook", currentTeamName: null, formerTeamNames: ["患者"], championshipCount: 3 },
  { name: "德普大王", currentTeamName: null, formerTeamNames: ["患者"], championshipCount: 3 },
  { name: "玉玉症患者", currentTeamName: null, formerTeamNames: ["患者"], championshipCount: 3 },
  { name: "伍六七", currentTeamName: null, formerTeamNames: ["患者"], championshipCount: 3 },
  { name: "+ +", currentTeamName: null, formerTeamNames: ["患者"], championshipCount: 3 },
  { name: "入江", currentTeamName: null, formerTeamNames: ["西浦军校教导队"], championshipCount: 0 },
  { name: "赢一把睡觉", currentTeamName: null, formerTeamNames: ["花开富贵2.0", "医生"], championshipCount: 0 },
  { name: "小王子", currentTeamName: null, formerTeamNames: ["患者"], championshipCount: 3 },
  { name: "八", currentTeamName: null, formerTeamNames: ["医生"], championshipCount: 0 },
  { name: "叫我女王大人！", currentTeamName: null, formerTeamNames: ["医生"], championshipCount: 0 },
  { name: "一瓶橙", currentTeamName: null, formerTeamNames: ["医生"], championshipCount: 0 }
] as const;

export const communityArchiveCups: ArchiveCup[] = [
  { title: "第一届先锋杯", scheduledAt: "2025-11-23T00:00:00.000Z", participantTeamNames: ["第一届队伍1", "第一届队伍2"], championTeamName: "第一届队伍2" },
  { title: "第二届先锋杯", scheduledAt: "2025-11-28T00:00:00.000Z", participantTeamNames: ["第二届队伍1", "第二届队伍2"], championTeamName: "第二届队伍2" },
  { title: "第三届先锋杯", scheduledAt: "2025-12-05T00:00:00.000Z", participantTeamNames: ["食神", "牛牛小小说话吊吊1.0"], championTeamName: "牛牛小小说话吊吊1.0" },
  { title: "第四届先锋杯", scheduledAt: "2025-12-12T00:00:00.000Z", participantTeamNames: ["草帽小子海贼团1.0", "牛牛小小说话吊吊2.0"], championTeamName: "草帽小子海贼团1.0" },
  { title: "第五届先锋杯", scheduledAt: "2025-12-19T00:00:00.000Z", participantTeamNames: ["花开富贵", "草帽小子海贼团2.0"], championTeamName: "花开富贵" },
  { title: "第六届先锋杯", scheduledAt: "2025-12-26T00:00:00.000Z", participantTeamNames: ["花开富贵", "草帽小子海贼团3.0"], championTeamName: "花开富贵" },
  { title: "第七届先锋杯", scheduledAt: "2026-01-09T00:00:00.000Z", participantTeamNames: ["花开富贵", "雪王"], championTeamName: "花开富贵" },
  { title: "第八届先锋杯", scheduledAt: "2026-01-23T00:00:00.000Z", participantTeamNames: ["what's up", "患者", "西浦军校教导队", "花开富贵2.0"], championTeamName: "患者" },
  { title: "第九届先锋杯", scheduledAt: "2026-01-30T00:00:00.000Z", participantTeamNames: ["花开富贵", "患者"], championTeamName: "患者" },
  { title: "第十届先锋杯", scheduledAt: "2026-02-06T00:00:00.000Z", participantTeamNames: ["医生", "患者"], championTeamName: "患者" }
] as const;

export const legendArchiveTeams: ArchiveTeam[] = [
  {
    name: "桂花树下的小雨滴队",
    players: ["Stupid", "无敌破坏龟", "牛小伟", "无欲拔刀神", "陈小树", "iRain", "还是差点的帕琪", "White Noise"],
    championshipCount: 0
  },
  {
    name: "第一届传奇杯队伍二",
    players: ["了小土", "瞳", "狄拉克", "西普军校政治部主任", "macsed", "小肥星"],
    championshipCount: 0
  },
  {
    name: "态度队",
    players: ["无敌LOL大王", "小肥星", "郭律", "菜神", "Laffin"],
    championshipCount: 0
  }
] as const;

export const legendArchivePlayers: ArchivePlayer[] = [
  { name: "Stupid", currentTeamName: null, formerTeamNames: ["雪王", "草帽小子海贼团3.0", "桂花树下的小雨滴队"], championshipCount: 0, ladderScore: 4380 },
  { name: "无敌破坏龟", currentTeamName: null, formerTeamNames: ["桂花树下的小雨滴队"], championshipCount: 0, ladderScore: 4720 },
  { name: "牛小伟", currentTeamName: null, formerTeamNames: ["桂花树下的小雨滴队"], championshipCount: 0, ladderScore: 4510 },
  { name: "无欲拔刀神", currentTeamName: null, formerTeamNames: ["桂花树下的小雨滴队"], championshipCount: 0, ladderScore: 4890 },
  { name: "陈小树", currentTeamName: null, formerTeamNames: ["桂花树下的小雨滴队"], championshipCount: 0, ladderScore: 4630 },
  { name: "iRain", currentTeamName: null, formerTeamNames: ["桂花树下的小雨滴队"], championshipCount: 0, ladderScore: 4170 },
  { name: "还是差点的帕琪", currentTeamName: null, formerTeamNames: ["桂花树下的小雨滴队"], championshipCount: 0, ladderScore: 4340 },
  { name: "White Noise", currentTeamName: null, formerTeamNames: ["桂花树下的小雨滴队"], championshipCount: 0, ladderScore: 4580 },
  { name: "了小土", currentTeamName: null, formerTeamNames: ["第一届传奇杯队伍二"], championshipCount: 0, ladderScore: 4090 },
  { name: "瞳", currentTeamName: null, formerTeamNames: ["第一届传奇杯队伍二"], championshipCount: 0, ladderScore: 4760 },
  { name: "狄拉克", currentTeamName: null, formerTeamNames: ["第一届传奇杯队伍二"], championshipCount: 0, ladderScore: 4930 },
  { name: "西普军校政治部主任", currentTeamName: null, formerTeamNames: ["第一届传奇杯队伍二"], championshipCount: 0, ladderScore: 4410 },
  { name: "macsed", currentTeamName: null, formerTeamNames: ["第一届传奇杯队伍二"], championshipCount: 0, ladderScore: 5180 },
  { name: "小肥星", currentTeamName: null, formerTeamNames: ["第一届传奇杯队伍二", "态度队"], championshipCount: 0, ladderScore: 5070 },
  { name: "无敌LOL大王", currentTeamName: null, formerTeamNames: ["第二届队伍2", "牛牛小小说话吊吊1.0", "牛牛小小说话吊吊2.0", "西浦军校教导队", "态度队"], championshipCount: 2, ladderScore: 5340 },
  { name: "郭律", currentTeamName: null, formerTeamNames: ["态度队"], championshipCount: 0, ladderScore: 4810 },
  { name: "菜神", currentTeamName: null, formerTeamNames: ["态度队"], championshipCount: 0, ladderScore: 4460 },
  { name: "Laffin", currentTeamName: null, formerTeamNames: ["态度队"], championshipCount: 0, ladderScore: 4990 }
] as const;

export const legendArchiveCups: ArchiveCup[] = [
  {
    title: "第一届传奇杯",
    scheduledAt: "2026-03-06T13:00:00.000Z",
    participantTeamNames: ["桂花树下的小雨滴队", "第一届传奇杯队伍二"],
    championTeamName: null,
    format: "BO3",
    status: "SCHEDULED",
    summary: "3 月 6 日晚 9 点 BO3，大名单暂定。桂花树下的小雨滴队：Stupid、无敌破坏龟、牛小伟、无欲拔刀神、陈小树、iRain、还是差点的帕琪；第一届传奇杯队伍二：了小土、瞳、狄拉克、西普军校政治部主任、macsed、小肥星。"
  },
  {
    title: "第二届传奇杯",
    scheduledAt: null,
    participantTeamNames: ["桂花树下的小雨滴队", "态度队"],
    championTeamName: null,
    format: "BO3",
    status: "SCHEDULED",
    summary: "桂花树下的小雨滴队对阵态度队。桂花树下的小雨滴队：Stupid、无敌破坏龟、牛小伟、无欲拔刀神、陈小树、White Noise、还是差点的帕琪；态度队：无敌LOL大王、小肥星、郭律、菜神、Laffin。具体开赛时间待补充。"
  },
  {
    title: "第三届传奇杯",
    scheduledAt: "2026-03-20T13:00:00.000Z",
    participantTeamNames: ["桂花树下的小雨滴队", "第一届传奇杯队伍二", "态度队"],
    championTeamName: "态度队",
    format: "BO3",
    status: "FINISHED",
    summary: "第三届传奇杯使用三队擂台赛结构。第一届传奇杯队伍二先与态度队进行预选，胜者再挑战桂花树下的小雨滴队，最终由态度队夺冠。"
  }
] as const;

export const guanjueArchiveTeams: ArchiveTeam[] = [
  {
    name: "喂110吗",
    players: ["歪？", "T-T", "没头脑儿", "园长", "X_IN", "阳光彩虹小白🐎"],
    championshipCount: 1
  },
  {
    name: "粉红绒绒兔",
    slogan: "没有人能忘记被粉红绒绒兔击败的耻辱。",
    players: ["郭律师", "敖丙的哥哥熬夜", "Invoker.", "小吴", "Oasis"],
    championshipCount: 0
  },
  {
    name: "顶风作案",
    players: ["我吃饭很慢", "茶", "赢一把睡觉", "宝贝周子一", "Atropse", "林夕月", "哈哈侠", "🤔😳😳"],
    championshipCount: 0
  }
] as const;

export const guanjueArchivePlayers: ArchivePlayer[] = [
  { name: "郭律师", currentTeamName: null, formerTeamNames: ["粉红绒绒兔"], championshipCount: 0 },
  { name: "敖丙的哥哥熬夜", currentTeamName: null, formerTeamNames: ["粉红绒绒兔"], championshipCount: 0 },
  { name: "Invoker.", currentTeamName: null, formerTeamNames: ["粉红绒绒兔"], championshipCount: 0 },
  { name: "小吴", currentTeamName: null, formerTeamNames: ["粉红绒绒兔"], championshipCount: 0 },
  { name: "Oasis", currentTeamName: null, formerTeamNames: ["粉红绒绒兔"], championshipCount: 0 },
  { name: "我吃饭很慢", currentTeamName: null, formerTeamNames: ["顶风作案"], championshipCount: 0 },
  { name: "茶", currentTeamName: null, formerTeamNames: ["草帽小子海贼团2.0", "顶风作案"], championshipCount: 0 },
  { name: "赢一把睡觉", currentTeamName: null, formerTeamNames: ["花开富贵2.0", "医生", "顶风作案"], championshipCount: 0 },
  { name: "宝贝周子一", currentTeamName: null, formerTeamNames: ["顶风作案"], championshipCount: 0 },
  { name: "Atropse", currentTeamName: null, formerTeamNames: ["顶风作案"], championshipCount: 0 },
  { name: "林夕月", currentTeamName: null, formerTeamNames: ["顶风作案"], championshipCount: 0 },
  { name: "哈哈侠", currentTeamName: null, formerTeamNames: ["顶风作案"], championshipCount: 0 },
  { name: "🤔😳😳", currentTeamName: null, formerTeamNames: ["顶风作案"], championshipCount: 0 },
  { name: "歪？", currentTeamName: null, formerTeamNames: ["喂110吗"], championshipCount: 1 },
  { name: "T-T", currentTeamName: null, formerTeamNames: ["喂110吗"], championshipCount: 1 },
  { name: "没头脑儿", currentTeamName: null, formerTeamNames: ["喂110吗"], championshipCount: 1 },
  { name: "园长", currentTeamName: null, formerTeamNames: ["喂110吗"], championshipCount: 1 },
  { name: "X_IN", currentTeamName: null, formerTeamNames: ["喂110吗"], championshipCount: 1 },
  { name: "阳光彩虹小白🐎", currentTeamName: null, formerTeamNames: ["喂110吗"], championshipCount: 1 }
] as const;

export const guanjueArchiveCups: ArchiveCup[] = [
  {
    title: "第三届冠绝杯",
    scheduledAt: null,
    participantTeamNames: ["喂110吗", "粉红绒绒兔", "顶风作案"],
    championTeamName: "喂110吗",
    format: "BO3",
    status: "FINISHED",
    summary: "第三届冠绝杯为三队擂台结构。粉红绒绒兔队口号为“没有人能忘记被粉红绒绒兔击败的耻辱。”。预选赛由粉红绒绒兔 2 比 0 击败顶风作案，随后擂主战由喂110吗 2 比 0 击败粉红绒绒兔夺冠。"
  }
] as const;

export const communityArchiveTournaments = [
  {
    tournament: {
      name: "先锋杯",
      slug: "pioneer-cup",
      kind: "PIONEER" as ArchiveTournamentKind,
      description: "今晚就来社区的先锋杯历史档案。"
    },
    teams: communityArchiveTeams,
    players: communityArchivePlayers,
    cups: communityArchiveCups
  },
  {
    tournament: {
      name: "传奇杯",
      slug: "legend-cup",
      kind: "LEGEND" as ArchiveTournamentKind,
      description: "今晚就来社区的传奇杯赛事档案。"
    },
    teams: legendArchiveTeams,
    players: legendArchivePlayers,
    cups: legendArchiveCups
  },
  {
    tournament: {
      name: "冠绝杯",
      slug: "guanjue-cup",
      kind: "GUANJUE" as ArchiveTournamentKind,
      description: "今晚就来社区的冠绝杯赛事档案。"
    },
    teams: guanjueArchiveTeams,
    players: guanjueArchivePlayers,
    cups: guanjueArchiveCups
  }
] as const;