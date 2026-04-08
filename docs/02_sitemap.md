# 今晚就来社区 / Sitemap

## 1. 页面树

### 第一期

```text
/
├── /matches
│   ├── 范围条：全部 / 先锋杯 / 传奇杯 / 冠绝杯（页内切换）
│   ├── /matches/[slug]
│   └── /matches/seasons/[slug]
│       └── /matches/seasons/[slug]/final
├── /teams
│   ├── 范围条：全部 / 先锋杯 / 传奇杯 / 冠绝杯（页内切换）
│   └── /teams/[slug]
├── /players
│   ├── 范围条：全部 / 先锋杯 / 传奇杯 / 冠绝杯（页内切换）
│   └── /players/[slug]
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
    ├── /admin/tournaments
```

### 第二期追加

- 第二期页面树统一见 14_phase-two-extension.md

## 2. 页面层级说明

第一期落地页：

- /
- /matches
- /teams
- /players
- /my
- /admin

第二期落地页统一见 14_phase-two-extension.md。

第一期频道页：

- /matches
- /teams
- /players

第一期页内工作台：

- /matches 内部固定为 8 + 4 的比赛对象工作台
- /players 内部固定为 8 + 4 的选手对象目录
- /teams 内部固定为 8 + 4 的战队对象目录
- 三个频道统一共享范围条：全部 / 先锋杯 / 传奇杯 / 冠绝杯
- 右侧 4 栏统一为角色态与当前范围说明栏，根据游客 / 普通用户 / 选手 / 队长切换内容和动作

第二期频道页统一见 14_phase-two-extension.md。

第一期阅读页：

- /rules
- /guide

第二期阅读页统一见 14_phase-two-extension.md。

第一期详情页：

- /matches/[slug]
- /matches/seasons/[slug]
- /matches/seasons/[slug]/final
- /players/[slug]
- /teams/[slug]

第二期详情页统一见 14_phase-two-extension.md。

第一期操作页：

- /my
- /my/claims
- /my/team
- /login

后台页：

- /admin 及其所有子页面

## 3. 跳转关系

第一期主跳转：

- 首页直达比赛、选手、战队、我的
- 顶栏对象入口直达比赛、选手、战队
- 顶栏工具入口直达搜索、我的、后台
- 比赛、选手、战队 3 个频道都共享同一套范围条：全部 / 先锋杯 / 传奇杯 / 冠绝杯
- 切换范围条只改变当前对象的杯赛上下文，不改变当前所在对象频道
- 搜索直达比赛、赛季、选手、战队

第二期主跳转统一见 14_phase-two-extension.md。

第一期关系跳转：

- 比赛详情 -> 赛季详情、战队详情、选手详情
- 赛季详情 -> 比赛详情、战队详情
- 选手详情 -> 战队详情、比赛详情
- 战队详情 -> 选手详情、比赛详情
- /matches 的范围工作区 -> 比赛详情、赛季详情
- /players 的范围目录 -> 选手详情；队长态在详情页可发起组队邀请
- /teams 的范围目录 -> 战队详情；队长态在详情页可发起训练赛邀请

第二期关系跳转统一见 14_phase-two-extension.md。

任务跳转：

- 游客入口 -> 登录 / 认领 / 指引
- 登录未认证 -> 我的主页 / 认领链路
- 队长态 -> 我的队伍管理 / 招募管理
- 普通用户 -> 成为选手弹层页
- 已是选手 -> 建立队伍弹层页
- 队长 -> 解散队伍确认弹层 / 邀请训练赛 / 邀请选手入队
- 被邀请选手 -> /my/invitations 查看并处理组队邀请
- 后台首页 -> 审核列表 / 发布列表 / 高风险待办

## 4. 导航层级与容器说明

第一期导航组织原则：

- 第一期开赛相关页面采用双轴矩阵，但“双轴矩阵”不是用户直接点击的导航名称
- 横轴是顶部对象入口：比赛 / 选手 / 战队
- 纵轴是页面级范围次导航：全部 / 先锋杯 / 传奇杯 / 冠绝杯
- 用户实际感知到的是“两层导航协同”，而不是看到一个名为“双轴矩阵”的栏目

第一期双轴矩阵视图：

| 范围 \ 对象 | 比赛 | 选手 | 战队 |
| --- | --- | --- | --- |
| 全部 | /matches | /players | /teams |
| 先锋杯 | /matches?scope=pioneer | /players?scope=pioneer | /teams?scope=pioneer |
| 传奇杯 | /matches?scope=legend | /players?scope=legend | /teams?scope=legend |
| 冠绝杯 | /matches?scope=crown | /players?scope=crown | /teams?scope=crown |

矩阵外独立工具路径：

- /my
- /login
- /admin

全站导航层级：

- 第一层：顶部对象入口，只负责比赛、选手、战队及后续第二期扩展频道
- 并列工具层：搜索、我的、后台
- 第二层：仅存在于 /matches、/players、/teams 的范围条，负责全部 / 先锋杯 / 传奇杯 / 冠绝杯
- 首页左侧 3 栏属于内容入口侧轨，不属于第一层全站导航

第一期纯导航容器：

- /admin 作为后台入口与模块分发页

第二期导航容器统一见 14_phase-two-extension.md。

兼具落地与导航属性：

- /matches
- /players
- /teams
- /my

第二期兼具落地与导航属性统一见 14_phase-two-extension.md。

不应成为独立强入口的页面：

- /matches/seasons/[slug]/final 依赖赛季主线进入
- /admin/claims/[id] 依赖列表页进入
- /heroes/[slug] 更适合由第二期列表或关系跳转进入，详见 14_phase-two-extension.md

## 5. 查漏检查

- 第一期先保证比赛、选手、战队、我的入口稳定可达
- 第二期查漏与入口原则统一见 14_phase-two-extension.md
- 后台路径独立，不向前台复用视觉与结构规则