# 今晚就来社区 / Component Variant Matrix

## 1. 这份文档解决什么问题

- 组件文档告诉我们有哪些组件
- 变体矩阵告诉我们每个组件允许怎么变，避免每页重新发明按钮、卡片和状态样式

## 2. 使用原则

- 页面只能使用矩阵里已经定义的变体组合
- 如果现有变体不够，先补矩阵，再改页面
- 不允许页面私自发明新的 tone、size、state 命名

## 3. Button

| 属性 | 允许值 |
| --- | --- |
| variant | primary | secondary | ghost | danger |
| size | sm | md | lg |
| state | default | hover | active | focus-visible | disabled | loading |
| icon | none | leading | trailing |

规则：

- 每屏最多一个 primary 主动作簇
- danger 只用于不可逆或高风险动作
- loading 态必须保留按钮尺寸，避免布局跳动
- primary 在主题页默认映射到 theme-main；secondary 映射到 N0 + theme-border + theme-strong；ghost 保持中性骨架，只在 hover 使用 theme-bg-soft
- disabled 统一回退到 N2 N6，不保留主题高亮

## 4. SurfaceCard

| 属性 | 允许值 |
| --- | --- |
| tone | default | muted | accent |
| density | compact | default | roomy |
| emphasis | normal | strong |
| state | default | hover | active | selected | disabled |

规则：

- 同一列表优先统一 density
- accent 只用于少量焦点卡或品牌关联卡
- strong 只给首页主焦点卡、冠军卡、后台风险摘要卡
- 全站都可把 SurfaceCard 作为块面单元使用，但同一屏只允许少量 strong 强调块
- hover 态允许轻抬升、描边加强、媒体遮罩滑移，不允许引发布局重排
- 英雄、战队、赛事卡的封面图优先保证 silhouette、轮廓和对象可认性，不允许被厚重边框和装饰吞没

## 5. PageIntro / DetailHero

| 属性 | 允许值 |
| --- | --- |
| tone | neutral | brand | celebration |
| density | compact | default | expanded |
| actions | none | single | dual |
| stats | none | inline | grid |

规则：

- celebration 只用于赛季结算、冠军宣告、重大活动页
- channel 页默认使用 neutral 或 brand
- 阅读页和后台正文区不使用 celebration
- detail、reading、operation、admin 页面也应保留块面题头，但通过 neutral 或 brand 的克制变化体现，不做统一平条头部

## 6. Badge

| 属性 | 允许值 |
| --- | --- |
| tone | neutral | info | success | warning | danger | brand |
| size | sm | md |
| shape | rounded | pill |

规则：

- Badge 只表达状态、类型、分组，不表达主 CTA
- 同一信息群内最多使用两种 tone

## 7. Tabs

| 属性 | 允许值 |
| --- | --- |
| style | underline | segmented |
| size | sm | md |
| tone | neutral | theme-a | theme-b | theme-c |
| state | default | hover | active | disabled |

规则：

- 用于同层级内容切换
- 不把 Tabs 顶部区域重新做成 Hero
- 范围 Tabs 只允许用于全部 / 先锋杯 / 传奇杯 / 冠绝杯 4 项切换
- 范围 Tabs 必须由页面顶部的胶囊二级导航承接当前态，其中“全部”固定使用 neutral，且“全部”态不显示 Banner
- Banner 只能挂在胶囊二级导航下方，不能包进 Tabs，也不能先于范围 Tabs 出现
- currentScope 为 pioneer / legend / crown 时，二级导航以下的频道内容壳层统一切换到对应的 theme-a / theme-b / theme-c；currentScope=all 时整段内容壳层统一回退到 neutral
- 人物推荐、战队推荐、赛程焦点只允许作为这个 Banner 槽位的内容变体存在；同一首屏不允许再出现第二个 Banner 组件实例
- 对象导航与范围 Tabs 不能混成一排，也不能共享同一个当前态样式
- 范围 Tabs 的整体视觉强度必须低于顶部导航；主次关系靠整条层级控制，不靠缩小文字硬压
- 首页左侧内容入口侧轨不复用范围 Tabs 语义；它属于 Link / SurfaceCard 组合，不属于顶栏导航或范围切换组件
- theme-a theme-b theme-c 是抽象主题槽位；第一期可以分别映射到当前范围主题，后续也可映射到其他二级子模块主题，但组件写法不跟业务文案耦合

推荐组合：

- 桌面端默认：Tabs.style=segmented，Tabs.size=md，单项高度 40，容器不再做整条范围带壳层，default 使用 neutral 骨架，active 再切换到当前主题 tone
- 桌面端紧凑：Tabs.style=segmented，Tabs.size=md，单项高度 36，适用于正文首块密度较高的频道页
- 移动端：Tabs.style=segmented，Tabs.size=sm，单项高度 32 到 40；若宽度不足优先换行，不允许换成下拉

状态细化：

- neutral.default：N0 背景 + N2 边框 + N6 文字
- neutral.hover：N1 背景 + N2 边框 + N8 文字
- theme-a.hover：A1 背景 + A2 边框 + A7 文字
- theme-b.hover：B1 背景 + B2 边框 + B7 文字
- theme-c.hover：C1 背景 + C2 边框 + C7 文字
- theme-a.active：A1 背景 + A2 边框 + A7 文字 + A5 底边线或左色条
- theme-b.active：B1 背景 + B2 边框 + B7 文字 + B5 底边线或左色条
- theme-c.active：C1 背景 + C2 边框 + C7 文字 + C5 底边线或左色条
- disabled：回退中性骨架并降低到 40% 到 56% 可见度，但仍保留文本可读性

不推荐组合：

- 不要给整个 Tabs 容器加比顶部导航更重的阴影或整条背景壳层
- 不要把 Tabs.size=sm 用在桌面端主频道首屏
- 不要把 active 和 inactive 只做文字色差，不做底色层级差
- 不要让全部按钮和具体主题按钮同时大面积使用主色，导致二级导航整条失去主次

## 8. Accordion

| 属性 | 允许值 |
| --- | --- |
| density | compact | default |
| icon | chevron | plus-minus |
| state | collapsed | expanded | disabled |

规则：

- FAQ 默认优先单开
- 比赛单局列表可多开，但不能成为第二主视觉

## 9. Form Field

| 属性 | 允许值 |
| --- | --- |
| size | sm | md | lg |
| tone | default | danger |
| state | default | focus-visible | filled | disabled | error | loading |

规则：

- error 必须配字段级反馈
- loading 态不隐藏字段标签
- danger tone 只用于删除、下线、回滚确认流

## 10. Dialog / Sheet

| 属性 | 允许值 |
| --- | --- |
| type | dialog | sheet |
| size | sm | md | lg |
| purpose | confirm | picker | filter | preview | apply-player | create-team | disband-team | invite-player | invite-scrim |
| state | default | loading | error |

规则：

- 桌面复杂确认优先 Dialog
- 移动端复杂筛选优先 Sheet
- Dialog 不承载长阅读正文
- apply-player 用于普通用户发起成为选手申请
- create-team 用于已是选手用户发起建立队伍
- disband-team 只用于队长的高风险不可逆动作
- invite-player 只用于队长从选手上下文发起入队邀请
- invite-scrim 只用于队长从队伍上下文发起训练赛邀请

## 11. Table

| 属性 | 允许值 |
| --- | --- |
| density | compact | default |
| state | default | selected | loading | empty |
| selection | none | single | multi |

规则：

- 状态优先通过 Badge 和列文案表达
- multi selection 时必须显示选中数量与退出入口

## 12. 组件变体验收清单

- 是否给出了 variant、size、state 等关键属性
- 是否限制了什么页面能用什么 tone
- 是否避免前台与后台混用情绪化视觉
- 是否给出移动端替代形态

## 13. SectionIntro

| 属性 | 允许值 |
| --- | --- |
| align | left | center |
| action | none | inline-link | button |
| density | compact | default |

规则：

- channel 与 detail 页默认使用 left
- center 只用于首页次级区块或尾部收束区
- action=button 时同一区块内不要再出现第二组并列主动作

## 14. PageGrid

| 属性 | 允许值 |
| --- | --- |
| variant | sidebar | channel | reading | detail |
| asideBehavior | static | sticky |
| collapse | none | stack |

规则：

- 第二期频道页若使用 PageGrid(channel)，具体实例统一见 16_phase-two-features.md
- reading 只用于正文加侧栏目录或关系卡
- xs 时 channel 和 detail 必须 collapse=stack
- 全站 PageGrid 都要允许块面错位和边界差异，但 reading 与 admin 只允许克制错位，不允许夸张拼贴

## 15. HeroChip

| 属性 | 允许值 |
| --- | --- |
| size | sm | md |
| density | compact | default |
| state | default | muted |

规则：

- 只用于人物和英雄池辅助信息，不作为主 CTA
- 同一卡片内最多 4 个首屏露出
- xs 优先使用 sm

## 16. PlayerAvatar / TeamMark

| 属性 | 允许值 |
| --- | --- |
| size | sm | md | lg |
| emphasis | default | featured |
| shape | rounded |

规则：

- lg 只用于首屏 Banner、推荐卡和详情页头部
- featured 只用于焦点人物、推荐战队等单对象主卡
- 目录列表默认使用 sm 或 md，避免视觉抢权
- 裁切优先保留头部、肩线、武器特征、队标和技能符号，不优先保留完整插画

## 17. Page-Level Patterns

### PlayersBrowser

| 属性 | 允许值 |
| --- | --- |
| toolbarLayout | inline | stacked |
| focusPlayers | 0 | 1 | 2 | 3 |
| gridColumns | 1 | 2 | 3 |
| emptyState | inline |

规则：

- lg 默认 toolbarLayout=inline，xs 必须 stacked
- focusPlayers 不超过 3
- 空态必须提供清空筛选入口

### TeamsDirectory

| 属性 | 允许值 |
| --- | --- |
| summaryMode | compact | expanded |
| recruitmentLink | none | inline |
| gridColumns | 1 | 2 | 3 |

规则：

- 频道页默认 summaryMode=expanded
- recruitmentLink 只在存在公开招募时显示
- xs 不超过 1 列

### 第二期频道卡模式

- NewsCard 与 Community Entry Card 的变体矩阵统一见 16_phase-two-features.md。

## 18. ReadingFlow / Detail Navigation

| 属性 | 允许值 |
| --- | --- |
| density | default | roomy |
| nav | none | anchor-rail | chip-nav |
| emphasis | plain | sectioned |

规则：

- /rules 默认 nav=anchor-rail
- /guide 可使用 emphasis=sectioned
- 详情页顶部锚点导航使用 chip-nav，但不能替代正文结构

## 19. AdminPageIntro / AdminMetricCard

| 属性 | 允许值 |
| --- | --- |
| introTone | neutral |
| metricTone | default | warning | success | info | danger |
| actions | none | single | dual |

规则：

- 后台首页默认 actions=single
- warning 用于待审核、待处理对象
- danger 不在首页泛滥使用，只给风险摘要

## 20. AdminListPanel / AdminSidePanel

| 属性 | 允许值 |
| --- | --- |
| layout | list | summary |
| state | default | empty |
| action | none | inline-button |

规则：

- AdminListPanel 只承载待办和列表，不承载编辑表单
- empty 状态必须给出转向建议
- AdminSidePanel 信息量必须低于主列表

## 21. Identity Panels

| 属性 | 允许值 |
| --- | --- |
| kind | account | quick-actions | team-summary | claim-status | reminder |
| tone | default | accent | muted |
| state | visitor | registered | steam-bound | pending | certified | player | captain |

规则：

- 任何 identity panel 都必须明确下一步
- visitor 和 registered 不显示“已认证”语义标签
- pending 优先使用 accent 或 warning 信息层，不使用 success
- player 状态必须同时显示用户信息和选手信息
- captain 状态必须同时显示用户信息、选手信息和队伍信息
- captain 状态允许出现 danger 动作，但只限解散队伍，并必须配 disband-team Dialog
- 动作型 panel 只允许放在状态型 panel 之后，不能跳到最上方
- claim-status 出现时优先级高于 quick-actions，且必须压住建队 CTA
- 同一右栏内状态型 panel 最多 3 张，超过后应转为详情页正文而不是继续叠高

## 21A. RangeStage Pattern

| 属性 | 允许值 |
| --- | --- |
| scopeTabs | 4 |
| layout | 12 |
| currentScope | all | pioneer | legend | crown |
| objectType | match | player | team |

规则：

- scopeTabs 固定为全部 / 先锋杯 / 传奇杯 / 冠绝杯
- currentScope=all 时固定使用中性色块面，不借任一杯赛主色
- 先锋杯、传奇杯、冠绝杯不改对象频道的 layout 骨架，但会统一切换二级导航以下频道内容壳层、分区底、描边、标题和 CTA 的 theme tone
- objectType 决定下方对象区使用的模式：match=MatchRow/SeasonCard，player=PlayerCard，team=TeamCard

## 21B. MatchWorkspace Pattern

| 属性 | 允许值 |
| --- | --- |
| layout | 8-4 |
| currentScope | all | pioneer | legend | crown |
| rightRailState | visitor | user | player | captain |

规则：

- 比赛工作台只承载赛季、赛程、阶段与结果
- 右栏状态必须随当前角色和当前范围同步变化
- 比赛工作台可以跳转到比赛详情和赛季详情，但不能在同页展开选手、战队目录
- 同一工作台内范围块面只改 tone 和文案，不改 layout、对象卡密度和右栏顺序
- 比赛工作台默认使用 MatchRow 与 SeasonCard，不混入 PlayerCard 或 TeamCard

## 22. DetailStatGrid / Summary Cards

| 属性 | 允许值 |
| --- | --- |
| columns | 2 | 3 | 4 |
| tone | default | muted | tournament |
| emphasis | normal | strong |

规则：

- 赛季和比赛详情默认 columns=4
- tournament 只在赛事详情和赛季结算页使用
- strong 只允许给冠军、比分或关键统计，不允许整组都 strong

## 23. 第二期专用组件模式

- Topic Tabs / Aggregate Groups、Recruitment Status Badge / Contact Card、Activity CTA Card、Hero Directory Card 统一见 16_phase-two-features.md。

## 27. FAQ Group Card

| 属性 | 允许值 |
| --- | --- |
| density | compact | default |
| emphasis | normal |
| action | none | inline-link |

规则：

- FAQ 默认不需要 featured 或 accent 情绪化变体
- inline-link 只用于“查看规则/指引”这类轻转向
- 每组问题数保持 2-4 条，超过后应拆组而不是继续加高

## 28. AdminWorkspace / Review Layout

| 属性 | 允许值 |
| --- | --- |
| variant | edit | review |
| asideDensity | compact | default |
| riskZone | inline-bottom | separate-panel |

规则：

- 编辑页默认 variant=edit
- 审核页默认 variant=review
- 风险操作优先使用 separate-panel，不直接混进主表单

## 29. Audit Timeline / History Row

| 属性 | 允许值 |
| --- | --- |
| layout | list | timeline |
| tone | neutral | warning | danger | success |
| detail | compact | expanded |

规则：

- 桌面可用 list，移动端优先 timeline
- danger 只用于驳回、删除、回滚等动作记录
- expanded 只给当前对象最近 1-2 条关键记录

## 30. Search Result Card

| 属性 | 允许值 |
| --- | --- |
| kind | player | team | match | news | topic | recruitment | activity | announcement |
| emphasis | normal | suggested |
| highlight | none | keyword |

规则：

- 搜索结果默认 highlight=keyword
- suggested 只用于空态推荐或未输入时快捷入口
- 各实体卡的高度策略要统一，不因 kind 不同而跳动

## 31. Detail-Level Business Cards

### MatchSeriesCard

| 属性 | 允许值 |
| --- | --- |
| state | live | finished | archived |
| emphasis | normal | featured |
| relation | none | topic | content |

规则：

- featured 只给赛季详情中的焦点比赛或结算页冠军之路首卡
- live 可使用 warning 或 info 状态层，但不升格为主舞台
- Season Schedule Groups 中的 MatchSeriesCard 按实际比赛数量逐条渲染，多场全部列出，单场也按单条列出
- 比赛频道列表态只显示名称、参赛队伍、状态，不展示时间轴、比分拆解或长摘要
- 比赛频道列表态不展示任何赛程图谱或 bracket
- 赛程详情默认进入淘汰赛对阵图，不把 MatchSeriesCard 扩写成整页线性赛程列表

### ContentRelayCard

| 属性 | 允许值 |
| --- | --- |
| kind | announcement | news | recap | champion | custom |
| emphasis | normal | featured |
| meta | none | date | topic | mixed |

规则：

- champion 和 featured 不应同时大量出现，同屏最多 1-2 张
- mixed 只在详情页关系回流里使用
- 第一期比赛、选手、战队详情默认不使用 ContentRelayCard 作为内容页或战报入口
- 已完赛比赛若需要页尾回流，优先使用海报页入口；点击后进入恭喜海报页

### RelationshipRailCard

| 属性 | 允许值 |
| --- | --- |
| kind | season-nav | topic-link | recruitment-link | activity-link | team-summary |
| tone | default | muted | accent |
| action | full-card | inline-link |

规则：

- 右栏关系卡优先 full-card
- accent 只给当前最重要的一张关系卡
- 同一侧栏最多 1 张 accent
- 比赛频道与赛程详情默认不使用 RelationshipRailCard 作为 4 栏固定侧轨