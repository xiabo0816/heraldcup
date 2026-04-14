# 今晚就来社区 / 第二期统一文档

本文件已归档。

- 社区、新闻、英雄与第二期后台相关内容已统一并入 16_phase-two-features.md
- 如无兼容性需求，不再从本文件进入第二期设计与实现流程

## 1. 这份文档解决什么问题

- 把第二期要做的事情统一收口到一份文档中
- 不再把社区、新闻、活动、话题、招募、英雄与第二期后台模块拆散在 IA、Sitemap、Page Brief 多份文档里
- 第一期开发默认先看 00 到 13；只要涉及第二期范围，再进入本文件

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

### 页面层级说明

第二期落地页：

- /community
- /news
- /heroes

第二期频道页：

- /community/announcements
- /community/topics
- /community/activities
- /community/recruitments
- /news

第二期阅读页：

- /news/[slug]
- /community/announcements/[slug]
- /community/rules
- /community/guide
- /community/faq

第二期详情页：

- /community/topics/[slug]
- /community/activities/[slug]
- /community/recruitments/[slug]
- /heroes/[slug]

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

## 6. 第二期频道页 Brief

### 新闻列表 /news

页面目标：

- 承接战报、冠军稿、人物稿和赛事新闻
- 强化新闻属于社区主线的认知

主 CTA：

- 阅读主稿

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

主 CTA：

- 查看置顶公告

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

主 CTA：

- 进入话题详情

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

主 CTA：

- 查看招募详情

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

主 CTA：

- 查看活动详情

必须区块：

- featured 活动区
- 三列活动矩阵
- 时间、类型、参与方式、状态

禁止项：

- 纯静态海报集合

## 7. 第二期详情页 Brief

### 话题详情 /community/topics/[slug]

页面目标：

- 成为主线聚合中枢页

主 CTA：

- 查看最关键比赛或主稿

必须区块：

- 主题介绍
- Tabs
- 比赛、新闻、活动、招募聚合流

禁止项：

- 每个 Tab 重复做 Hero

### 招募详情 /community/recruitments/[slug]

页面目标：

- 先判断是否适合自己，再决定是否联系

主 CTA：

- 联系队伍

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

页面目标：

- 让用户先理解活动内容、状态和参与方式

主 CTA：

- 报名或查看联动内容

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

主 CTA：

- 阅读正文，文末回流到最相关对象

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

页面目标：

- 以最克制的阅读体验传达正式通知

主 CTA：

- 查看相关规则、活动或赛程

必须区块：

- 日期与类型信息
- 正文
- 轻关系区

禁止项：

- 花哨 Hero
- 装饰性大图夺走阅读注意力

### 英雄目录 /heroes 与详情 /heroes/[slug]

页面目标：

- 作为人物与玩法偏好的补充入口，不抢比赛、选手、战队主线

主 CTA：

- 查看英雄详情或关联人物

必须区块：

- 英雄目录或英雄题头
- 属性与定位信息
- 关联人物或玩法偏好回流

禁止项：

- 把英雄页做成独立第一入口
- 用纯装饰图替代可读信息

## 8. 第二期阅读与静态页 Brief

### /community/rules

- 作为社区规则入口复用第一期阅读页骨架
- 重点是社区秩序、安全边界和处罚说明

### /community/guide

- 作为社区参与指南复用第一期阅读页骨架
- 重点是如何发帖、参与活动、进入招募与讨论

### /community/faq

- 用 FAQ 回答高频参与问题
- 不用 FAQ 替代规则正文或活动正文

## 9. 第二期后台 Brief

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

## 10. 使用规则

- 只要需求涉及社区、新闻、公告、话题、活动、招募、英雄或第二期后台内容，优先先读本文件
- 需要继续落页面布局、区块规格、状态流和组件模式时，优先读 16_phase-two-features.md，再回到 10_page-blueprint.md、11_section-specs.md、12_wireflow-and-state-spec.md、13_component-variant-matrix.md 套用全站通用规格
- 第一期开发不再需要在 01、02、04、05 中穿插查找第二期说明