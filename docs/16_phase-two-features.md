# 今晚就来社区 / 第二期功能

## 1. 这份文档解决什么问题

- 把社区、新闻、公告、话题、活动、招募、英雄与第二期后台相关内容统一收口到一份文档中
- 不再把第二期内容拆散在 IA、Sitemap、Page Brief、Blueprint、Section Spec、Wireflow 与组件变体文档中来回跳转
- 第一期开发默认先读 00 到 13；只要涉及第二期范围，优先进入本文件

第二期范围：

- 社区
- 新闻
- 公告
- 话题
- 活动
- 招募
- 英雄
- 第二期后台内容运营模块

## 2. 第二期产品定位

- 第二期承接社区参与、内容运营与关系网络，不替代第一期比赛、选手、战队、我的主链路
- 新闻在对外路径上保持独立，但在产品归属上视为社区内容主线的一部分
- 英雄是人物与玩法偏好的补充入口，不单独承担第一任务入口
- 第二期优先补关系网、参与路径与运营阵地，不把页面做成孤立资讯页

## 3. 第二期信息架构

第二期导航边界：

- 第二期只扩展顶部对象入口，在第一期比赛 / 选手 / 战队之外新增社区、英雄
- 搜索 / 我的 / 后台仍固定停留在顶部工具入口，不与社区、英雄混排成另一套分组
- 全部 / 先锋杯 / 传奇杯 / 冠绝杯的胶囊二级导航继续只属于第一期对象页面；第二期页面不复用这套 community 风格胶囊二级导航与 Banner 结构

### 顶部对象入口扩展

- 社区
- 英雄

### 二级结构

#### 社区

解决的问题：

- 社区现在在讨论什么、通知什么、组织什么
- 用户怎么从旁观转为参与
- 哪些内容与比赛、人物和队伍主线相关

二级层级：

- 社区首页 /community
- 公告列表与详情 /community/announcements, /community/announcements/[slug]
- 话题列表与详情 /community/topics, /community/topics/[slug]
- 活动列表与详情 /community/activities, /community/activities/[slug]
- 招募列表与详情 /community/recruitments, /community/recruitments/[slug]
- FAQ /community/faq
- 社区规则 /community/rules
- 社区指引 /community/guide
- 新闻列表与详情 /news, /news/[slug]

#### 英雄

解决的问题：

- 快速查看英雄面板
- 让英雄作为人物与玩法偏好的补充入口

二级层级：

- 英雄列表 /heroes
- 英雄详情 /heroes/[slug]

#### 第二期后台

解决的问题：

- 维护社区内容、公告、话题、活动、招募与内容页
- 统一处理发布、下线、审核、回滚与运营排期

二级层级：

- /admin/news
- /admin/announcements
- /admin/topics
- /admin/recruitments
- /admin/activities
- /admin/content-pages
- /admin/content

## 4. 第二期站点地图

```text
/community
├── /community/announcements
│   └── /community/announcements/[slug]
├── /community/topics
│   └── /community/topics/[slug]
├── /community/activities
│   └── /community/activities/[slug]
├── /community/recruitments
│   └── /community/recruitments/[slug]
├── /community/faq
├── /community/rules
└── /community/guide
/news
└── /news/[slug]
/heroes
└── /heroes/[slug]
/admin
├── /admin/news
├── /admin/announcements
├── /admin/topics
├── /admin/recruitments
├── /admin/activities
├── /admin/content-pages
└── /admin/content
```

页面层级说明：

- 第二期落地页：/community、/news、/heroes
- 第二期频道页：/community/announcements、/community/topics、/community/activities、/community/recruitments、/news
- 第二期阅读页：/news/[slug]、/community/announcements/[slug]、/community/rules、/community/guide、/community/faq
- 第二期详情页：/community/topics/[slug]、/community/activities/[slug]、/community/recruitments/[slug]、/heroes/[slug]

## 5. 第二期主跳转与关系跳转

主跳转：

- 首页补充社区、新闻、英雄入口
- 顶部对象入口扩展社区、英雄
- 搜索扩展到新闻、公告、话题、活动、招募、英雄

关系跳转：

- 比赛详情 -> 新闻详情、话题详情
- 赛季详情 -> 新闻列表、话题详情
- 选手详情 -> 新闻详情、英雄页、话题详情
- 战队详情 -> 招募详情、新闻详情
- 新闻详情 -> 比赛详情、战队详情、选手详情、活动详情、话题详情
- 话题详情 -> 比赛、新闻、活动、招募
- 招募详情 -> 战队详情、话题详情、相关新闻

查找效率要求：

- 2 到 3 次点击内找到社区首页
- 2 到 3 次点击内找到最新公告、活动、招募和新闻
- 2 到 3 次点击内找到英雄目录与相关回流入口

## 6. 第二期 Page Brief

### 新闻列表 /news

页面目标：

- 承接战报、冠军稿、人物稿和赛事新闻
- 强化新闻属于社区主线的认知

主 CTA：阅读主稿

必须区块：

- 页面说明与筛选区
- featured 主稿区
- 规则新闻矩阵
- 关联对象标识

禁止项：

- 多主稿竞争
- 海报型噪音卡片铺满列表

### 公告列表 /community/announcements

页面目标：

- 承接规则更新、赛程通知和运营公告
- 保持正式通知秩序

主 CTA：查看置顶公告

必须区块：

- 页面说明
- 置顶公告
- 单列时间线流

禁止项：

- 长封面图瀑布
- 公告和新闻完全同构

### 话题列表 /community/topics

页面目标：

- 显性化社区主线
- 帮助用户发现比赛、新闻、活动与招募的关系

主 CTA：进入话题详情

必须区块：

- 整宽说明区
- 热门话题条带
- 三列话题卡

禁止项：

- 只展示封面，不展示关系摘要

### 招募列表 /community/recruitments

页面目标：

- 快速判断谁在招、招什么位置、要求是什么
- 优先浏览效率

主 CTA：查看招募详情

必须区块：

- Sticky 筛选
- 单列大卡流
- 位置、要求、时间、联系方式摘要
- 清晰状态标签

禁止项：

- 大面积品牌氛围盖过信息密度
- 联系方式先于要求说明

### 活动列表 /community/activities

页面目标：

- 承接运营活动、社区活动和专题活动入口
- 在氛围和清晰之间保持平衡

主 CTA：查看活动详情

必须区块：

- featured 活动区
- 三列活动矩阵
- 时间、类型、参与方式、状态

禁止项：

- 纯静态海报集合

### 话题详情 /community/topics/[slug]

页面目标：成为主线聚合中枢页

主 CTA：查看最关键比赛或主稿

必须区块：

- 主题介绍
- Tabs
- 比赛、新闻、活动、招募聚合流

禁止项：

- 每个 Tab 重复做 Hero

### 招募详情 /community/recruitments/[slug]

页面目标：先判断是否适合自己，再决定是否联系

主 CTA：联系队伍

必须区块：

- 标题摘要
- 要求说明
- 队伍介绍
- 联系方式
- 关联话题
- 相关战队
- 其他职位
- 举报入口
- 关闭或过期说明

禁止项：

- 联系方式抢在要求说明之前
- 相关资源做成重卡拼贴

### 活动详情 /community/activities/[slug]

页面目标：让用户先理解活动内容、状态和参与方式

主 CTA：报名或查看联动内容

必须区块：

- 活动 Hero
- 活动说明与正文
- 相关新闻
- 公告联动
- 比赛联动
- 报名入口
- 底部 CTA

禁止项：

- 活动结束后继续展示误导性报名按钮

### 新闻详情 /news/[slug]

页面目标：

- 优先正文阅读
- 次级承接比赛、战队、选手、话题和活动回流

主 CTA：阅读正文，文末回流到最相关对象

必须区块：

- 标题区
- 摘要
- 正文
- 文末推荐
- 右栏关系卡

禁止项：

- 右栏塞满无关资源
- 正文区域做视觉秀肌肉

### 公告详情 /community/announcements/[slug]

页面目标：以最克制的阅读体验传达正式通知

主 CTA：查看相关规则、活动或赛程

必须区块：

- 日期与类型信息
- 正文
- 轻关系区

禁止项：

- 花哨 Hero
- 装饰性大图夺走阅读注意力

### 英雄目录 /heroes 与详情 /heroes/[slug]

页面目标：作为人物与玩法偏好的补充入口，不抢比赛、选手、战队主线

主 CTA：查看英雄详情或关联人物

必须区块：

- 英雄目录或英雄题头
- 属性与定位信息
- 关联人物或玩法偏好回流

禁止项：

- 把英雄页做成独立第一入口
- 用纯装饰图替代可读信息

### /community/rules

- 作为社区规则入口复用第一期阅读页骨架
- 重点是社区秩序、安全边界和处罚说明

### /community/guide

- 作为社区参与指南复用第一期阅读页骨架
- 重点是如何发帖、参与活动、进入招募与讨论

### /community/faq

- 用 FAQ 回答高频参与问题
- 不用 FAQ 替代规则正文或活动正文

### 第二期后台

后台目标：

- 统一管理第二期内容实体
- 保证内容发布、审核、下线、回滚和审计链路清晰

后台模块：

- 新闻管理
- 公告管理
- 话题管理
- 招募管理
- 活动管理
- 内容页管理

后台禁止项：

- 前台与后台共用庆典式视觉
- 危险动作缺少确认与审计
- 内容状态只靠颜色不靠文案和标签表达

## 7. 第二期 Blueprint

### 7.1 新闻频道 /news

页面名称：新闻频道
页面类型：channel
页面目标：让新闻先承担“回流到比赛、话题和战队”的任务，而不是历史海报归档页
唯一主 CTA：先看比赛
次 CTA：社区主线

布局总览：

| 区块顺序 | 区块名称 | 目标 | 布局模式 | 主视觉权重 | 组件 | 主动作 |
| --- | --- | --- | --- | --- | --- | --- |
| 1 | News Intro With Headline | 讲清新闻主线并给一条当前头条 | PageIntro 8 + 4 | A | PageIntro / SurfaceCard | 继续阅读 |
| 2 | News Filter Sidebar | 用内容类型、主线话题、历史归档缩小入口 | 4 栏侧筛 | B | SurfaceCard / Button | 切换类型 |
| 3 | News Stream Stack | 把新闻与专题、赛事回流、历史归档分层展示 | 主栏单列分段 | B | SurfaceCard / NewsCard | 打开新闻正文 |
| 4 | Channel Summary | 给当前筛选结果和浏览说明 | 整宽说明卡 | C | SurfaceCard | 浏览当前结果 |

### 7.2 社区首页 /community

页面名称：社区首页
页面类型：channel
页面目标：把公告、活动、话题、招募和赛后内容收束成一条可继续浏览的社区主线
唯一主 CTA：打开话题主线
次 CTA：查看招募

布局总览：

| 区块顺序 | 区块名称 | 目标 | 布局模式 | 主视觉权重 | 组件 | 主动作 |
| --- | --- | --- | --- | --- | --- | --- |
| 1 | Community Intro With Hot Zone | 讲清社区主线并给今晚热区 | PageIntro 8 + 4 | A | PageIntro / SurfaceCard | 打开话题主线 |
| 2 | Community Docs Strip | 给规则、指引、FAQ、活动的轻入口 | 4 卡网格 | B | SurfaceCard / Link | 打开社区文档 |
| 3 | Community Channel Grid | 左侧公告与热门话题，右侧主内容流 | 4 + 10 | B | PageGrid / SurfaceCard | 打开公告、话题、内容 |
| 4 | Post Match Relay | 把新闻与最近完赛并列，形成赛后回流 | 6 + 6 | B | SurfaceCard / Link | 打开新闻或比赛 |
| 5 | Honor And Spotlight | 用荣誉榜和人物聚光连接赛事与社区人物 | 6 + 6 | C | SurfaceCard / Link | 去战队或人物页 |
| 6 | Recruitment Entry Grid | 让招募成为明确参与入口 | 3 卡网格 | C | SurfaceCard / Badge | 查看招募 |

### 7.3 社区详情页家族

页面名称：社区详情页家族
页面类型：detail | reading
页面目标：让用户在读完当前对象后，能沿同一条社区主线继续进入比赛、内容、活动或招募

布局总览：

| 区块顺序 | 区块名称 | 目标 | 布局模式 | 主视觉权重 | 组件 | 主动作 |
| --- | --- | --- | --- | --- | --- | --- |
| 1 | Topic Or Reading Intro | 先讲清对象和当前状态 | PageIntro 或 DetailHero | A | PageIntro / DetailHero / SurfaceCard | 返回列表或参与动作 |
| 2 | Topic Tabs Or Reading Body | 话题页用 Tabs 聚合，公告页用正文流，招募/活动页用要求与说明主区 | 8 + 4 或 reading | B | PageGrid / ReadingFlow / SurfaceCard | 查看关联对象 |
| 3 | Relation Clusters | 将比赛、内容、活动、招募关系成组摆放 | 2 列或 4 卡网格 | B | SurfaceCard / Link / Badge | 进入关系对象 |
| 4 | Action Aside | 招募联系方式、活动报名、阅读快捷入口统一放在侧轨 | 4 栏侧轨 | C | SurfaceCard / Button / Link | 联系 / 报名 / 返回 |

### 7.4 英雄目录与 FAQ

页面名称：英雄目录与 FAQ
页面类型：channel | reading
页面目标：前者帮助用户快速缩小英雄范围并进入单页，后者提前解答高频问题并引导回规则或指引

布局总览：

| 区块顺序 | 区块名称 | 目标 | 布局模式 | 主视觉权重 | 组件 | 主动作 |
| --- | --- | --- | --- | --- | --- | --- |
| 1 | Utility Intro | 建立目录或 FAQ 的使用方式 | PageIntro 或轻标题区 | A | PageIntro / SurfaceCard | 查看规则或进入频道 |
| 2 | Directory Aside Or FAQ Groups | 英雄页左侧是属性目录，FAQ 首页中段是问题组卡片 | 4 + 10 或 3 列 | B | PageGrid(channel) / SurfaceCard / Link | 跳到分组 |
| 3 | Main Grid Or Answers | 英雄矩阵或 FAQ 解答正文 | channel 主栏或阅读卡流 | B | SurfaceCard / Link / Image | 查看详情 |
| 4 | Return CTA | 在尾部把用户送回比赛、规则或身份页 | 双列或 CTA 带 | C | SurfaceCard / Button / Link | 返回对应页面 |

### 7.5 第二期后台扩展

页面名称：第二期后台工作页家族
页面类型：admin
页面目标：保证第二期内容运营模块沿用统一后台秩序，不与第一期审核和资料维护混排

布局总览：

| 区块顺序 | 区块名称 | 目标 | 布局模式 | 主视觉权重 | 组件 | 主动作 |
| --- | --- | --- | --- | --- | --- | --- |
| 1 | AdminPageIntro | 讲清当前资源和今日任务 | 标题区 + 动作区 | A | AdminPageIntro | 新建或审核 |
| 2 | Filtered List Workspace | 列表页承接筛选、统计、表格和分页 | 工具条 + 列表 | B | AdminListPanel / Table / Badge | 查看对象 |
| 3 | Admin Workspace Split | 编辑页把表单放左、预览与说明放右 | 6 + 8 或 7 + 5 | B | AdminWorkspace / AdminSidePanel / Form | 保存或发布 |
| 4 | Risk And Audit Footer | 高风险操作和历史记录始终在页底收束 | 双列 | C | AdminSidePanel / Table / Dialog | 下线、回滚、删除 |

## 8. 第二期 Section Specs

### 8.1 News Filter Sidebar

| 字段 | 内容 |
| --- | --- |
| 区块名称 | News Filter Sidebar |
| 用途 | 承担新闻频道的类型切换、主线话题入口和历史归档说明 |
| 布局 | 4 栏 sticky 侧栏 |
| 栅格占比 | lg 4；xs 单列段落 |
| 内容槽位 | 类型按钮 5 组，主线话题 0-5 条，历史归档计数 2 项 |
| 允许组件 | SurfaceCard / Button / Link / Badge |
| 允许变体 | Button.variant=primary|secondary；Badge.tone=neutral|warning |
| 禁止 | 侧栏像主导航；历史归档扩成正文列表；类型切换没有当前态 |
| 响应式 | xs 类型切换改为换行按钮组，话题和归档放到列表前 |

### 8.2 Community Docs Strip

| 字段 | 内容 |
| --- | --- |
| 区块名称 | Community Docs Strip |
| 用途 | 给规则、指引、FAQ、活动列表固定轻入口 |
| 布局 | 4 卡网格 |
| 栅格占比 | lg 4 列；md 2 列；xs 1 列 |
| 内容槽位 | 标题 1 行，描述 2-3 行，整卡跳转 |
| 允许组件 | SurfaceCard / Link |
| 允许变体 | SurfaceCard.tone=default |
| 禁止 | 做成轮播；卡片高度不一；长段正文 |
| 响应式 | xs 按既定顺序纵向堆叠 |

### 8.3 Post Match Relay

| 字段 | 内容 |
| --- | --- |
| 区块名称 | Post Match Relay |
| 用途 | 把已完赛海报页入口和最近完赛结果并列，让用户沿主线回流 |
| 布局 | 6 + 6 |
| 栅格占比 | lg 6 + 6；xs 单列 |
| 内容槽位 | 海报页入口 0-2 张，完赛卡 0-4 张，状态标签 0-1 个 |
| 允许组件 | SurfaceCard / Link / Badge |
| 允许变体 | SurfaceCard.tone=default；Badge.tone=brand|warning |
| 禁止 | 第一阶段接入内容页或战报页；海报入口和结果互不关联；完赛卡缺比分或缺对阵对象 |
| 响应式 | xs 单列堆叠并保留“内容在前、结果在后”顺序 |

### 8.4 Topic Aggregate Tabs

| 字段 | 内容 |
| --- | --- |
| 区块名称 | Topic Aggregate Tabs |
| 用途 | 将活动、比赛、内容、招募按稳定分类聚合在同一条话题主线下 |
| 布局 | 顶部 Tabs + 下方分区卡流 |
| 栅格占比 | 14 栏整宽 |
| 内容槽位 | tabs 4 个，分区 2-4 组，卡片每组 0-4 张 |
| 允许组件 | Tabs / SurfaceCard / Link / Badge |
| 允许变体 | Tabs.style=segmented；SurfaceCard.tone=default|muted|accent |
| 禁止 | 每个 Tab 再做 Hero；分区缺空态；不同实体混成一条无标签列表 |
| 响应式 | xs tabs 换行，卡片改单列 |

### 8.5 Recruitment Contact Aside

| 字段 | 内容 |
| --- | --- |
| 区块名称 | Recruitment Contact Aside |
| 用途 | 把招募联系方式、关联话题和同队其他职位稳定放在右侧行动区 |
| 布局 | 4 栏侧轨 |
| 栅格占比 | lg 4；xs 单列下沉 |
| 内容槽位 | 联系方式 1 块，关联话题 0-1 块，同队职位 0-3 条 |
| 允许组件 | SurfaceCard / Link / Button / Badge |
| 允许变体 | SurfaceCard.tone=accent|muted；Badge.tone=success|warning|neutral |
| 禁止 | 联系方式早于要求说明；联系方式藏在正文末尾；过期状态仍展示激进 CTA |
| 响应式 | xs 下沉到正文和相关内容之后 |

### 8.6 Activity Action Rail

| 字段 | 内容 |
| --- | --- |
| 区块名称 | Activity Action Rail |
| 用途 | 在活动详情页侧栏稳定承接报名、所属话题和联动资源 |
| 布局 | 4 栏侧轨 |
| 栅格占比 | lg 4；xs 单列 |
| 内容槽位 | 报名卡 0-1 张，所属话题 0-1 张，联动比赛 0-3 条，相关招募 0-3 条 |
| 允许组件 | SurfaceCard / Link / Button / Badge |
| 允许变体 | SurfaceCard.tone=accent|default|muted |
| 禁止 | 活动结束后保留误导性报名按钮；联动资源比活动说明更重 |
| 响应式 | xs 报名卡保留在第一位，其余资源纵向堆叠 |

### 8.7 Hero Attribute Directory

| 字段 | 内容 |
| --- | --- |
| 区块名称 | Hero Attribute Directory |
| 用途 | 用属性分组和焦点英雄帮助用户缩小浏览范围 |
| 布局 | 4 栏目录 + 10 栏矩阵 |
| 栅格占比 | lg 4 + 10；xs 单列 |
| 内容槽位 | 属性组 4 个，焦点英雄 0-4 个，英雄卡若干 |
| 允许组件 | PageGrid / SurfaceCard / Link / Image |
| 允许变体 | PageGrid.variant=channel；SurfaceCard.tone=default|accent |
| 禁止 | 巨型海报；不同卡片高度策略混用；目录不具备锚点 |
| 响应式 | xs 目录置顶为单列导航，矩阵卡片单列或双列 |

### 8.8 FAQ Cluster Grid

| 字段 | 内容 |
| --- | --- |
| 区块名称 | FAQ Cluster Grid |
| 用途 | 以问题组卡片而非长文形式承接高频问题 |
| 布局 | 3 列问题组 + 2 列收束区 |
| 栅格占比 | lg 3 列；xs 单列 |
| 内容槽位 | 问题组 3 个，每组问题 2-4 条，尾部收束卡 2 张 |
| 允许组件 | SurfaceCard / Link |
| 允许变体 | SurfaceCard.tone=default|muted |
| 禁止 | 把 FAQ 做成规则页全文复制；问题卡没有主题分组 |
| 响应式 | xs 问题组和收束卡都改为单列 |

## 9. 第二期 Wireflow

### 9.1 新闻类型切换 /news

交互目标：在不打断阅读的前提下切换全部、快报、战报、专题和归档类型

- 起点状态：默认全部类型
- 触发动作：点击类型按钮
- 成功状态：更新 URL 查询参数、侧栏当前态、摘要计数和主内容分段
- 失败状态：保留当前按钮高亮和上一组内容，显示轻量错误说明
- 空状态：当前类型下没有内容时显示“当前类型暂无内容”，并给出返回全部入口

### 9.2 社区首页导流 /community

交互目标：让用户从公告、活动、热门话题快速进入一条明确的社区主线

- 起点状态：显示今晚热区、公告与活动、热门话题
- 触发动作：点击热区胶囊；点击公告卡；点击话题条目
- 成功状态：进入对应详情页或话题页，来源信息保留在浏览历史中
- 失败状态：目标内容不可用时显示“内容暂不可访问”，并提供回到社区首页入口
- 空状态：某一分区为空时保留区块标题并给出说明，不整块消失

### 9.3 话题详情 Tabs /community/topics/[slug]

交互目标：在活动、比赛、内容、招募四类资源之间快速切换，同时保持同一条主线感

- 起点状态：进入话题详情页，顶部展示默认聚合段与锚点入口
- 触发动作：点击 Tabs 或锚点；点击关联卡片；目标内容为空
- 成功状态：滚动到对应分区或切换到对应分区，当前态明确可见
- 失败状态：目标分区数据加载失败时保留当前分区并显示“主线资源加载失败，请重试”
- 空状态：某一分区无数据时显示空态说明，但保留分区标题与返回社区入口

### 9.4 招募详情状态 /community/recruitments/[slug]

交互目标：让用户先判断岗位与队伍是否匹配，再决定是否联系

- 起点状态：打开招募详情页，展示要求说明、队伍说明和侧栏联系方式
- 触发动作：点击联系方式；点击关联话题；点击其他职位；招募状态变化为暂停或关闭
- 成功状态：用户进入外部或站内联系方式，或继续浏览同队其他职位与话题主线
- 失败状态：联系方式无效时显示“当前联系方式不可用，请稍后重试”并保留其他回流入口
- 空状态：无关联比赛或内容时，相关区块保留轻说明而不消失

### 9.5 活动详情状态 /community/activities/[slug]

交互目标：根据活动状态决定是否展示报名动作，并把用户继续送到话题、比赛和内容主线

- 起点状态：活动详情页已打开，显示正文、报名卡和侧栏联动资源
- 触发动作：点击报名入口；活动状态变化；联动资源为空；CTA 链接失效
- 成功状态：跳转到活动报名或外部参与入口，并保留回到站内的路径
- 失败状态：CTA 无法访问时显示错误反馈，并提供话题页或活动列表替代入口
- 空状态：没有联动比赛、内容或招募时，保留说明卡但不删整块

## 10. 第二期组件与模式

### 10.1 NewsCard

| 属性 | 允许值 |
| --- | --- |
| kind | news | recap | champion | poster | custom |
| emphasis | normal | featured |
| metaLinks | none | topic | match | teams | mixed |

规则：

- featured 只给频道头条或首页推荐位
- poster 和 champion 只在归档语境使用
- 单卡 meta 链接不超过 4 个
- 头条卡必须先让人读懂标题、对象和看点，不允许海报风封面压过信息层级

### 10.2 Community Entry Card

| 属性 | 允许值 |
| --- | --- |
| kind | doc | announcement | topic | event | recruitment |
| tone | default | muted | accent |
| action | full-card | inline-link |

规则：

- doc 默认为 default
- announcement 和 topic 可以使用 accent，但同屏不超过 2 张
- recruitment 卡优先 full-card，避免隐藏入口

### 10.3 Topic Tabs / Aggregate Groups

| 属性 | 允许值 |
| --- | --- |
| style | segmented | underline |
| count | 3 | 4 |
| state | default | active | disabled |

规则：

- 话题详情默认 style=segmented 且 count=4
- disabled 只在某分区明确不可用时使用，不用于单纯空态
- Tabs 只承担分类切换，不承担主 CTA

### 10.4 Recruitment Status Badge / Contact Card

| 属性 | 允许值 |
| --- | --- |
| status | open | tryout | paused | closed | archived |
| cardTone | accent | muted |
| contactMode | direct | read-only |

规则：

- open 和 tryout 可以使用 contactMode=direct
- paused、closed、archived 必须降级为 read-only
- 联系方式卡最多一个主动作，不允许和相关资源卡争抢主权重

### 10.5 Activity CTA Card

| 属性 | 允许值 |
| --- | --- |
| state | open | upcoming | finished | unavailable |
| emphasis | normal | featured |
| action | none | single |

规则：

- open 可以 action=single
- finished 和 unavailable 必须 action=none
- featured 只允许在活动详情侧栏第一块，不允许在正文重复出现

### 10.6 Hero Directory Card

| 属性 | 允许值 |
| --- | --- |
| size | compact | default |
| emphasis | normal | featured |
| media | image | initial |

规则：

- featured 只用于焦点英雄或首屏推荐
- 英雄目录卡优先可读性和识别度，不使用巨型海报式封面
- 同一矩阵内不混用超过两种视觉权重

## 11. 使用规则

- 只要需求涉及社区、新闻、公告、话题、活动、招募、英雄或第二期后台内容，优先先读本文件
- 第一期开发表述若需要引用第二期，只保留入口，不再复制完整实例
- 第一期开发不再需要在 01、02、04、05、10、11、12、13 中穿插查找第二期说明