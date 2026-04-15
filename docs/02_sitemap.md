# 今晚就来社区 / Sitemap

本文件只负责两件事：列出第一期页面树，汇总第一期主跳转。导航层级与设计原因统一见 01_information-architecture.md，第二期统一见 16_phase-two-features.md。

## 1. 页面树

```text
/ 
├── /matches
│   ├── ?scope=all|pioneer|legend|crown
│   ├── /matches/[slug]
│   └── /matches/seasons/[slug]
│       └── /matches/seasons/[slug]/final
├── /players
│   ├── ?scope=all|pioneer|legend|crown
│   └── /players/[slug]
├── /teams
│   ├── ?scope=all|pioneer|legend|crown
│   └── /teams/[slug]
├── /rules
├── /guide
├── /my
│   ├── /my/claims
│   ├── /my/team
│   └── /my/invitations
├── /login
└── /admin
    ├── /admin/claims
    │   └── /admin/claims/[id]
    ├── /admin/players
    ├── /admin/teams
    ├── /admin/matches
    ├── /admin/seasons
    └── /admin/tournaments
```

说明：/matches、/players、/teams 共享范围态，但仍是同一对象频道的不同视图，不新增页面类型。

## 2. 页面家族

| 页面家族 | 路由 | 说明 |
| --- | --- | --- |
| 首页 | / | 内容入口与主线导流 |
| 对象频道页 | /matches、/players、/teams | 第一期开页，统一承载 scope 视图 |
| 阅读页 | /rules、/guide | 静态说明与规则阅读 |
| 详情页 | /matches/[slug]、/matches/seasons/[slug]、/matches/seasons/[slug]/final、/players/[slug]、/teams/[slug] | 关系跳转节点 |
| 操作页 | /my、/my/claims、/my/team、/my/invitations、/login | 身份、认领、队伍管理 |
| 后台页 | /admin 及其子路由 | 审核、维护、发布、高风险变更 |

## 3. 主跳转

### 全站入口

- 首页直达比赛、选手、战队、我的
- 顶部对象入口直达比赛、选手、战队
- 顶部工具入口直达搜索、我的、后台
- 搜索可直达比赛、赛季、选手、战队

### 对象频道内跳转

- /matches、/players、/teams 共享全部、先锋杯、传奇杯、冠绝杯四个 scope
- 切换 scope 只改变当前对象的范围上下文，不改变当前对象频道
- 同一 scope 下横向切换对象频道时，默认保留当前范围
- 具体杯赛态允许在二级导航下方出现唯一 Banner；全部态不出现 Banner

### 关系跳转

- 比赛详情 -> 赛季详情、战队详情、选手详情
- 赛季详情 -> 比赛详情、战队详情
- 选手详情 -> 战队详情、比赛详情
- 战队详情 -> 选手详情、比赛详情
- /matches 工作台 -> 比赛详情、赛季详情
- /players 目录 -> 选手详情
- /teams 目录 -> 战队详情

### 任务跳转

- 游客 -> 登录、认领、指引
- 登录未认证 -> 我的主页、认领链路
- 队长态 -> 我的队伍管理、邀请与训练赛相关动作
- 被邀请选手 -> /my/invitations 查看并处理邀请
- 后台首页 -> 审核列表、发布列表、高风险待办

## 4. 维护规则

- 新增或删除第一期页面时，只更新页面树和页面家族，不在这里重写 IA 解释
- 改导航层级、对象维或范围维时，先更新 01_information-architecture.md，再同步这里的路由结果
- 第二期页面、跳转和后台扩展统一维护在 16_phase-two-features.md