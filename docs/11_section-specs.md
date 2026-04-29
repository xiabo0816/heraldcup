# 今晚就来社区 / Section Specs

## 1. 这份文档解决什么问题

- Page Blueprint 决定页面怎么排
- Section Spec 决定单个区块怎么写、怎么复用、怎么限制 AI 发挥
- 本文保留区块规格方法和真实实例；组件职责去 08_components-and-patterns.md，组件合法变体去 13_component-variant-matrix.md

## 2. 每个 Section Spec 的最小字段

- 区块名称
- 区块用途
- 布局模式与栅格占比
- 形状定义与拼接关系
- 内容槽位
- 允许组件与允许变体
- 禁止项
- 响应式规则
- Promptframe 约束

## 3. 通用区块家族

| 区块家族 | 用途 | 常见布局 | 关键底线 |
| --- | --- | --- | --- |
| Hero / PageIntro | 建立对象认知、承接主 CTA | 整宽或 8 + 4 | 不出现第二个平级 Hero |
| Mosaic Stage | 用大块面承接主叙事、证明和入口 | 流体 14 栏拼接 | 只允许 1 个主块承担绝对主视觉 |
| Filter Toolbar | 缩小范围、排序、切换视图 | 横向工具条或 3 + 9 侧筛 | 必须附着在主列表上缘或侧缘 |
| Card Grid | 承接可浏览对象列表 | 2 到 4 列网格或单列大卡流 | 同一组卡片只允许 1 套错位规则 |
| Reading Flow | 承接正文、规则、长阅读 | 9 + 3 或 3 + 9 | 正文主轴不能被目录或推荐块切断 |
| Detail Summary Aside | 放状态、关系、快捷动作 | 8 + 4 右栏 | 右栏不能变第二内容流 |
| CTA Band | 尾部收束页面任务 | 整宽带状或双列收束 | 不能像新页面开头一样重新起势 |
| Banner | 仅在具体杯赛态承接当前范围摘要 | 整宽轻 Banner 或 8 + 4 轻拼接 | “全部”态不出现，首屏只允许 1 个 Banner |
| Global Footer | 页底收束品牌、回流、版权 | 3 到 4 列信息组 | 不承接主 CTA 和范围切换 |
| Admin Table Region / Admin Workbench Mosaic | 后台批量浏览、筛选、主工作区 | 标题区 + 工具条 + 表格 / 工作台 | 风险块和审计块不能切碎主工作区 |

## 4. Promptframe 模板

```text
区块名称：
区块用途：
形状定义：
拼接关系：
要生成的内容：
标题长度：
描述长度：
数据项数量：
图片或图标规则：
允许组件：
允许变体：
禁止项：
响应式：
```

## 5. 使用顺序

1. 先在 10_page-blueprint.md 确定页面实例或页面级骨架
2. 再在本文件选择区块实例或通用区块家族
3. 再在 08_components-and-patterns.md 与 13_component-variant-matrix.md 确认组件和变体

## 6. 区块验收清单

- 是否写清布局、形状和拼接关系
- 是否限制了列数、长度、组件范围和禁止项
- 是否给出移动端折叠、换列或抽屉规则
- 是否说明该区块是复用型还是页面专属型

## 6.5 配色执行底线

- 所有区块先跟随 Radiant / Dire 的页面基础层；杯赛色只进入 Banner、模块入口、标签、专题头图和专题 CTA
- `currentScope=crown` 在本文件中仍表示冠绝杯；视觉 token 如需沿用设计稿命名，可映射到 `cup-immortal`
- 非当前态按钮和非当前态 Tabs 继续使用主题 surface + border + text-secondary，不预铺低强度杯赛底色
- 默认主 CTA 跟随当前主题 `--primary`；杯赛按钮色只在 Banner 或明确杯赛专题块中作为模块 CTA 使用

## 7. Herald Cup 项目专用区块实例

## 7. Herald Cup 项目专用区块实例

### 7.1 Banner（选手变体）

| 字段 | 内容 |
| --- | --- |
| 区块名称 | Banner（选手变体） |
| 用途 | 在选手频道首屏建立单一人物印象，再把用户送进筛选与人物关系流 |
| 布局 | 8 + 4，左侧频道说明与统计，右侧推荐人物卡 |
| 栅格占比 | lg 8 + 4；md 单列；xs 单列 |
| 形状定义 | 左侧横向信息大块，右侧纵向人物高卡，右卡顶部保留直角、主体用圆角 |
| 拼接关系 | 左块与右卡共用顶线；右卡下缘低于左块形成半档落差；下一区块从左块底边起接 |
| 内容槽位 | 频道标题 1 行，说明 2-3 行，统计 3 项，推荐人物 1 位，打法标签 2-4 个，英雄 Chip 2-4 个，CTA 1-2 个 |
| 允许组件 | SurfaceCard / PlayerAvatar / HeroChip / Button |
| 允许变体 | SurfaceCard.tone=accent；HeroChip.size=sm；Button.primary=md |
| 禁止 | 多位推荐人物平级并列；用轮播切人物；顶部筛选条抢主视觉 |
| 响应式 | xs 统计卡纵向堆叠，推荐人物卡下沉到频道说明之后 |

Promptframe：

```text
区块名称：Banner（选手变体）
区块用途：用一个人物说明当前杯赛范围下的选手池值得点开；它就是选手页首屏唯一 Banner
形状定义：左宽右高的双块拼接，人物卡是右侧竖向高块
拼接关系：左块和右卡顶对齐，下一区块从左块底边顺接，不要让人物卡孤立漂浮
要生成的内容：频道说明、人物简介、打法标签、英雄池提示
标题长度：10-16 字
描述长度：30-60 字
数据项数量：3 项
图片或图标规则：只允许 1 个头像主图，不要大面积背景插画
允许组件：SurfaceCard / PlayerAvatar / HeroChip / Button
允许变体：SurfaceCard.tone=accent
禁止项：不要写成战队荣誉 Banner，不要同时突出多个人，不要在它后面再叠第二个人物 Banner
响应式：移动端改为单列，统计置于人物卡之前
```

### 7.1A Home Hero Mosaic

| 字段 | 内容 |
| --- | --- |
| 区块名称 | Home Hero Mosaic |
| 用途 | 在首页首屏用固定 3 + 6 + 3 三栏同时讲清内容入口侧轨、内容主体和身份入口 |
| 布局 | 流体 12 栏，左 3 栏内容入口侧轨，中 6 栏主内容，右 3 栏身份信息 |
| 栅格占比 | lg 3 + 6 + 3；md 4 + 8；xs 单列 |
| 形状定义 | 左侧内容入口纵向块组，中间主体宽块，右侧身份纵向信息块；中块偏圆角，侧块偏直角或单侧圆角 |
| 拼接关系 | 三栏共用顶线；中栏承担唯一主内容；左右侧轨可延续但不得插入中栏主体 |
| 内容槽位 | 左栏内容入口 4 组，分别对应比赛中心、人物档案、战队名册、身份链路，并作为跳到中栏对应模块的最小按钮目录；左栏更窄且不再额外包外层框；页面下滚后左栏继续固定；中栏固定为 5 张顺排卡，依次是平台定位卡与四张主线模块卡；右栏固定为从上到下平铺的 4 个身份模块，桌面端随页面滚动时继续固定在视口内 |
| 允许组件 | PageIntro / SurfaceCard / Badge / Button |
| 允许变体 | SurfaceCard.tone=accent|default；Button.variant=primary|secondary |
| 禁止 | 使用切角；把左栏做成第二内容流；把右栏做成广告位；让中栏失去主位 |
| 响应式 | md 改为左轻入口条 + 右主内容；xs 改为内容入口 -> 主体 -> 身份入口 |

Promptframe：

```text
区块名称：Home Hero Mosaic
区块用途：用固定 3 + 6 + 3 三栏讲清首页第一屏该先看什么，并让中栏稳定保持 5 张顺排卡
形状定义：左内容入口纵向块，中间主体宽块，右侧身份块；不用切角，主块偏圆、侧块偏直
拼接关系：三栏共顶线，中栏为唯一主内容区，左右栏作为侧轨延续
要生成的内容：左栏只保留比赛中心、人物档案、战队名册、身份链路 4 个固定按钮，且更窄、更像目录条；中栏按平台定位、比赛中心、人物档案、战队名册、身份链路 5 张卡顺排；右栏登录或身份进度拆成从上到下平铺的 4 个模块，并在桌面端与左栏一起固定，只让中栏主轴继续滚动
标题长度：10-18 字
描述长度：30-70 字
数据项数量：主舞台 0-3 项，其余块各 0-2 项
图片或图标规则：允许局部色块纹理或导航图标，不要满屏背景海报
允许组件：PageIntro / SurfaceCard / Badge / Button
允许变体：SurfaceCard.tone=accent|default
禁止项：不要回到居中 Hero + 三功能卡；不要使用切角；不要让左右栏抢中栏主位；不要把左栏四项写成独立频道页入口；不要把左栏按钮扩成带说明的内容卡；不要保留左栏重复双边框；不要把中栏四个模块包回平台定位卡内部；不要把右栏四段再合并成单一总卡
响应式：移动端回到单列顺序流，仍保持内容入口 -> 主体 -> 身份顺序
```

### 7.2 Player Browser Workspace

| 字段 | 内容 |
| --- | --- |
| 区块名称 | Player Browser Workspace |
| 用途 | 在一个工作区内完成筛选、聚焦和选手浏览 |
| 布局 | 单列工作台，内部顺序为 Filter Bar -> Focus Players -> Player Grid |
| 栅格占比 | 主栏 8-10 栏 |
| 内容槽位 | 筛选按钮 4 组，下拉 3 组，搜索 1 个，统计 3 项，焦点人物 0-3 张，结果卡若干 |
| 允许组件 | SurfaceCard / Form Field / Tabs / HeroChip / PlayerCard |
| 允许变体 | FormField.state=default|focus-visible|error；SurfaceCard.tone=default |
| 禁止 | 焦点人物和全量卡片混排；筛选后不回显结果数；空态没有清空入口 |
| 响应式 | md 双列筛选；xs 所有字段单列并保留结果统计 |

### 7.3 Team Honor And Recruitment Split

| 字段 | 内容 |
| --- | --- |
| 区块名称 | Team Honor And Recruitment Split |
| 用途 | 同屏展示荣誉秩序和当前招募需求 |
| 布局 | 7 + 5，左荣誉右招募 |
| 栅格占比 | lg 7 + 5；xs 单列 |
| 内容槽位 | 荣誉榜 3 张，招募焦点 1 张，状态标签 1-4 个，CTA 1-2 个 |
| 允许组件 | SurfaceCard / TeamMark / Badge / Button |
| 允许变体 | SurfaceCard.tone=default|muted；Badge.tone=brand|info |
| 禁止 | 招募焦点升格为 Hero；荣誉榜扩成完整目录；状态只靠色块表达 |
| 响应式 | xs 先荣誉后招募，标签压缩至最多 3 个 |

### 7.4 第二期频道与回流区块

- News Filter Sidebar、Community Docs Strip、Post Match Relay 已统一移入 16_phase-two-features.md。

### 7.7 My Identity Rail

| 字段 | 内容 |
| --- | --- |
| 区块名称 | My Identity Rail |
| 用途 | 在频道右侧持续暴露账号状态、选手申请状态以及下一步 |
| 布局 | 侧轨首卡 |
| 栅格占比 | 4 栏 |
| 内容槽位 | 状态标题 1 行，说明 2-3 行，账号/选手关系标签 2-4 个，CTA 1-2 个 |
| 允许组件 | SurfaceCard / Button / HeroChip |
| 允许变体 | SurfaceCard.tone=default；Button.variant=primary|secondary |
| 禁止 | 未申请态伪装成完整人物页；把用户账号直接等同于选手；无下一步 CTA |
| 响应式 | xs 下沉到主工作区之后，但仍保留第一优先侧卡位置 |

### 7.7A Tournament Brand Tabs

| 字段 | 内容 |
| --- | --- |
| 区块名称 | 胶囊二级导航 |
| 用途 | 作为对象频道首屏二级导航，固定展示全部、先锋杯、传奇杯、冠绝杯 4 个范围入口 |
| 布局 | 主区顶部导航行 |
| 栅格占比 | 12 栏整宽 |
| 内容槽位 | 范围入口 4 个；Banner 不属于此区块 |
| 允许组件 | Tabs / Badge / SurfaceCard |
| 允许变体 | Tabs.style=segmented；Tabs.size=md；Tabs.tone=neutral|pioneer|legend|crown |
| 禁止 | 把二级导航做成普通细筛选条；把“全部”做成任一杯赛色；把 Banner 混进导航本体 |
| 响应式 | xs 允许换行，但顺序固定为全部 / 先锋杯 / 传奇杯 / 冠绝杯 |

层级原则：

- 顶部导航是主导航，胶囊二级导航是次导航；两者必须连续，但不能等权
- 胶囊二级导航必须看起来像顶部导航的下一级，而不是独立新舞台
- 当前态按钮是二级导航里的唯一主重点；其余按钮与整条导航都应服务于衬托当前态，而不是整体一起变重
- 胶囊二级导航要与下方 Banner 或正文首块共同组成一个连续首屏系统；它不能只在顶部自成一条孤立横条

尺寸与样式参数：

- 整体：共享频道主区 1240 版心；单按钮高度建议 36 到 44；xs 为 32 到 40
- 内边距：按钮内边距遵循胶囊按钮骨架，导航行本身不额外包壳层
- 结构：4 个按钮按文案自适应宽度，使用稳定 gap 排列；xs 端允许换行
- 圆角：按钮使用 shape.xl；整行导航不再保留整条直线外框
- 描边：单按钮描边 1px border.default；当前态按钮描边 1px border.emphasis；不再使用按钮之间的内分隔线
- 阴影：当前态按钮使用 elevation-2 到 elevation-3 的局部抬升；非当前态按钮无阴影
- 按钮尺寸：lg 高 40 到 44；md 高 36 到 40；xs 高 32 到 40
- 按钮内容：标题 1 行 + 可选短标签 1 行；不允许第三行说明
- 颜色：全部、先锋杯、传奇杯、冠绝杯都必须各自定义 default / hover / active 三态；全部使用 neutral 三态，先锋杯使用 pioneer 三态，传奇杯使用 legend 三态，冠绝杯使用 crown 三态

补充规则：

- 二级导航必须固定在频道主区顶部，不能回退成整条贴顶范围带或悬浮为第二张卡
- 页面首屏层级固定为顶部导航 -> 胶囊二级导航 -> Banner（仅某杯态，可选） -> 主工作台或主目录
- 顶部导航与胶囊二级导航之间不允许出现任何额外题头；“比赛工作台 / 选手目录 / 战队目录”只能是主工作台或主目录内部的区块标题
- 频道页如需使用 PageIntro，只能把它作为唯一 Banner 的内部版式，或正文首块自身的标题区；不得在二级导航之后额外插入独立 Hero / PageIntro
- “全部”按钮固定使用中性色；先锋杯、传奇杯、冠绝杯按钮分别使用各自主题色系统，且从默认态开始就要可见差异
- 四个按钮的形制、留白、shape.xl 和按钮骨架四态保持一致，只替换颜色强弱和文案状态
- 不允许在二级导航里塞入长说明、统计块、标题块或营销文案
- 不允许在二级导航上方额外补一条“当前频道标题带”来重复解释当前对象页是什么
- 4 个范围入口必须同高度、同圆角、同内边距；当前态可增加背景和强调边框，但不改变骨架尺寸
- 非当前态至少保留范围名，不得压缩成图标按钮或统一灰条
- 统计区只承载当前范围计数、阶段或资格摘要，不扩展成完整数据看板
- “全部”态下二级导航之后直接进入工作台；不得自动跟一个中性色 Banner
- 当前态与非当前态的层级差必须由底色 + 边框或底色 + 阴影共同建立，不能只靠文字颜色变化
- 当前态按钮文字统一使用对应杯赛文字色；副文案建议使用同色 72% 到 84% 透明度
- 非当前态按钮继续保留统一骨架，但要预铺各自范围的低强度底色与描边，不能把三个杯赛按钮压成同一套灰色默认态
- 整条二级导航的表面层级、亮度和阴影都必须弱于顶部导航；只允许当前态按钮局部增强，不允许整条导航整体抬成第二主块
- 二级导航、Banner、正文首块必须共用同一版心与外侧边界；不允许导航 1240、Banner 1200、正文 1160 这样逐层收窄，破坏首屏一体感
- 二级导航进入 Banner 或正文时优先使用连续底边、连续描边或连续阴影家族衔接；避免用 24 以上大留白把频道页首屏切成三段

具体设计方案：

- 桌面端默认值：按钮高度 40；导航行跟随频道主区内容宽度
- 紧凑桌面端：按钮高度 36；适用于正文首块本身较重的频道页
- 移动端默认值：按钮高度 32 到 40；允许换行但不改变单项骨架
- 默认表面：整条导航不使用杯赛主色满铺，但单按钮默认态必须带各自范围的低强度色面与描边
- 当前态按钮：使用对应杯赛主色或深色背景，叠加强调描边，文字使用对应杯赛文字色
- 非当前态按钮：使用对应杯赛主题的低强度底色；hover 态提升到对应范围的中强度容器色；active 态再提升到对应范围高亮色
- 分隔方式：按钮之间优先使用 8 到 12 的稳定 gap，不用整条容器和内分隔线制造范围带感
- 上下关系：Banner 如存在，Banner 到二级导航为 12 到 20；无 Banner 时二级导航到正文首块为 20 到 24
- 一体化推荐：顶部导航和二级导航使用直线拼接；Banner 改用同体系外轮廓但转入更柔和的底边；正文首块沿 Banner 底边直接接续，不另起新表面体系
- 一体化推荐：若正文首块为 8 + 4 主副栏，则 Banner 左右结构必须提前预告正文几何关系，让用户在进入内容前就感知左主区和右侧轨的秩序

展示解剖：

- 导航条：4 个固定顺序胶囊按钮。当前态最强，非当前态减弱，但四项始终同时可见
- 底边：二级导航必须直接与下方主工作台共边，或通过 1 条连续 gutter 进入 8 + 4 主副栏，不单独断开成第二个说明区

同步变化清单：

- 当前杯赛标题
- 当前杯赛说明
- 当前杯赛统计
- 当前杯赛资格 Badge
- 主工作台或主目录标题
- 右侧第一张身份或资格卡
- 当前态主题色回响位置

四态视觉映射：

- 全部：中性色按钮 + 全站目录语义 + 无 Banner
- 先锋杯：pioneer 主色按钮 + 对应 Banner + 新晋与入门赛道语义
- 传奇杯：legend 主色按钮 + 对应 Banner + 成熟与秩序赛道语义
- 冠绝杯：crown 视图使用冠绝杯主色按钮与 `cup-immortal` token + 高资格与荣誉赛道语义

### 7.7B Match Workspace Tabs

| 字段 | 内容 |
| --- | --- |
| 区块名称 | Match Workspace |
| 用途 | 在比赛主工作台内部浏览当前范围下的赛季、赛程、阶段和结果 |
| 布局 | 8 栏工作台，顶部工具条 + 下方对象流 |
| 栅格占比 | lg 8；xs 14 |
| 内容槽位 | 搜索 1 个，筛选 1-2 个，结果计数 1 组，赛季卡若干，赛程行若干 |
| 允许组件 | Form Field / SurfaceCard / MatchRow / SeasonCard / Badge |
| 允许变体 | FormField.size=md；SurfaceCard.tone=default |
| 禁止 | 在比赛频道里再起选手或队伍主 Tabs；对象流混入长正文；空态无清空或回退入口 |
| 响应式 | xs 保持工具条在顶部，对象流回到单列 |

补充规则：

- “全部”范围允许聚合多个杯赛赛程，但必须显式暴露所属杯赛标签
- 某杯范围只展示该杯赛季、赛程和阶段结果，不混入其他杯赛对象
- 工作台工具条顺序固定为范围承接 -> 搜索/筛选 -> 结果计数 -> 对象流
- 对象卡只暴露“去详情页”类跳转，跨对象浏览入口统一留在右栏或尾部回流

### 7.7C Role Adaptive Identity Rail

| 字段 | 内容 |
| --- | --- |
| 区块名称 | Match Range Rail |
| 用途 | 在右 4 栏根据游客 / 普通用户 / 选手 / 队长以及当前范围切换身份信息、资格摘要与跨频道动作 |
| 布局 | 4 栏 sticky 侧轨 |
| 栅格占比 | lg 4；xs 下沉到主工作区之后 |
| 内容槽位 | 范围说明 1 组，用户信息 1 组，选手信息 0-1 组，队伍信息 0-1 组，动作按钮 1-2 个，跨频道入口 1-2 个 |
| 允许组件 | SurfaceCard / Button / Badge / Dialog / Link |
| 允许变体 | Button.variant=primary|secondary|danger；Dialog.purpose=apply-player|create-team|disband-team |
| 禁止 | 右栏变成第二条内容流；无角色差异；在比赛频道直接暴露邀请入队或训练赛邀请 |
| 响应式 | xs 先状态卡后动作卡，不保留悬空 sticky 语法 |

- 卡堆顺序规则：

- 第一张卡固定承担杯赛状态或账号状态说明
- 第二张卡优先承担 claim pending 或选手信息，不允许被动作卡抢位
- 队长态第三张卡固定承担队伍概览，第四张卡才承接跨频道动作
- 解散队伍永远独立为底部危险卡，不与普通动作共卡

范围动作矩阵：

- 对应杯赛 / 普通用户：基本用户信息 + 成为选手
- 对应杯赛 / 选手：基本用户信息 + 基本选手信息 + 建立队伍
- 对应杯赛 / 队长：基本用户信息 + 基本选手信息 + 基本队伍信息 + 去对应杯赛战队池
- 队伍上下文 / 选手：基本用户信息 + 基本选手信息 + 建立队伍
- 队伍上下文 / 队长：基本用户信息 + 基本选手信息 + 基本队伍信息 + 邀请训练赛；本人队伍上下文额外允许解散队伍

### 7.8 Reading Directory Aside

| 字段 | 内容 |
| --- | --- |
| 区块名称 | Reading Directory Aside |
| 用途 | 给规则页和指引页提供目录、自查项与快捷入口 |
| 布局 | 4 栏 sticky 侧栏 |
| 栅格占比 | lg 4；xs 单列 |
| 内容槽位 | 目录 3-6 条，自查卡 2-4 条，快捷入口 0-3 条 |
| 允许组件 | SurfaceCard / Link / Badge |
| 允许变体 | SurfaceCard.tone=default|muted |
| 禁止 | 目录层级过深；侧栏为空；目录与快捷入口混成一张卡 |
| 响应式 | xs 下沉到正文前，变成两段单列卡组 |

### 7.9 Claims History Workspace

| 字段 | 内容 |
| --- | --- |
| 区块名称 | Claims History Workspace |
| 用途 | 用状态筛选、统计和表格回看“成为选手”或“关联既有选手档案”的申请记录 |
| 布局 | 统计条 + 状态筛选 + Table/Card 双形态 |
| 栅格占比 | 14 栏整宽 |
| 内容槽位 | 状态统计 4 项，筛选 5 项，表头 6 列，申请类型 1 列，移动卡片若干 |
| 允许组件 | SurfaceCard / Table / Tabs / Link |
| 允许变体 | Table.selection=none；Tabs.style=segmented；SurfaceCard.tone=accent|muted |
| 禁止 | 结果计数和筛选分离；看不出申请的是“新建选手”还是“关联既有选手”；移动端仍强行保留桌面表格；审核备注缺说明 |
| 响应式 | lg Table，xs 改卡片列表 |

### 7.10 Login Explain Panel

| 字段 | 内容 |
| --- | --- |
| 区块名称 | Login Explain Panel |
| 用途 | 在登录页左侧建立品牌与社区认知，解释为什么先处理账号 |
| 布局 | 6 + 6 左介绍右账号 Tabs |
| 栅格占比 | lg 6 + 6；xs 单列 |
| 内容槽位 | 品牌标题 1 组，社区简介 2-3 行，收益点 3 条，辅助 CTA 1-2 个 |
| 允许组件 | SurfaceCard / Link / Badge |
| 允许变体 | SurfaceCard.tone=default |
| 禁止 | 混入比赛、审核记录、OpenDota 面板等后续内容；左侧做成新闻流或公告栏 |
| 响应式 | xs 介绍区在上，收益点纵向堆叠，账号 Tabs 面板紧随其后 |

### 7.10A Auth Tabs Panel

| 字段 | 内容 |
| --- | --- |
| 区块名称 | Auth Tabs Panel |
| 用途 | 在登录页右侧单块中切换登录与注册，并默认打开登录 |
| 布局 | 单卡 Tabs 工作区 |
| 栅格占比 | lg 6；xs 12 |
| 内容槽位 | Tabs 2 个，当前表单 1 组，登录态记住我 1 项，回跳说明 1 行，提交按钮 1 个 |
| 允许组件 | Tabs / IdentityAccountPanel / Form Field / Checkbox / Button |
| 允许变体 | Tabs.style=segmented；Button.variant=primary；Checkbox.style=inline |
| 禁止 | 登录与注册同时展开；默认落在注册 Tab；把 Steam 绑定和认领流程塞进同一卡；加入演示账号快捷入口 |
| 响应式 | xs Tabs 保持顶部固定顺序“登录 / 注册”，默认态仍为登录；记住我位于密码字段下方 |

### 7.11 Admin Module Entry Grid

| 字段 | 内容 |
| --- | --- |
| 区块名称 | Admin Module Entry Grid |
| 用途 | 将后台模块收成清晰入口矩阵 |
| 布局 | 3 列或 2 列卡组 |
| 栅格占比 | lg 3 列；md 2 列；xs 1 列 |
| 内容槽位 | 模块名、说明 2-3 行、整卡点击 |
| 允许组件 | Link Card / SurfaceCard |
| 允许变体 | SurfaceCard.tone=default |
| 禁止 | 将模块入口做成强调视觉海报；同屏混入待办列表 |
| 响应式 | xs 单列固定顺序 |

### 7.12 Admin Priority Task List

| 字段 | 内容 |
| --- | --- |
| 区块名称 | Admin Priority Task List |
| 用途 | 让审核和高优先数据项在首页第一层可直接点击 |
| 布局 | 8 + 4，左列表右摘要 |
| 栅格占比 | lg 8 + 4；xs 单列 |
| 内容槽位 | 待办 0-5 条、状态标签 1 个、摘要 3 项、提示卡 1 条 |
| 允许组件 | AdminListPanel / AdminSidePanel / Badge / Link |
| 允许变体 | Badge.tone=warning|info |
| 禁止 | 待办没有对象名和状态；右栏比左栏信息更重 |
| 响应式 | xs 摘要区下沉到待办列表之后 |

### 7.13 Season Detail Narrative Stack

| 字段 | 内容 |
| --- | --- |
| 区块名称 | Season Detail Narrative Stack |
| 用途 | 在赛季详情页按淘汰赛对阵图、阶段、焦点比赛与海报页回流的顺序组织主体叙事 |
| 布局 | PageGrid(detail) 单列整宽纵向堆叠 |
| 栅格占比 | 12 栏整宽 |
| 内容槽位 | 主对阵图 1 块，阶段说明 1 块，焦点比赛 1 块，海报页回流 0-1 块 |
| 允许组件 | SurfaceCard / SectionIntro / MatchSeasonGraphView / Link / TeamMark |
| 允许变体 | SurfaceCard.tone=default|muted；PageGrid.variant=detail |
| 禁止 | 对阵图前没有摘要；焦点比赛早于阶段说明；右栏挤进主叙事；用线性“第几场”列表替代整张对阵图 |
| 响应式 | xs 变单列，对阵图后接阶段说明，再接焦点比赛 |

### 7.14 Match Bracket And Current Series Stack

| 字段 | 内容 |
| --- | --- |
| 区块名称 | Match Bracket And Current Series Stack |
| 用途 | 在比赛详情页用淘汰赛对阵图讲清当前轮次，再补当前对阵摘要和上下游关系 |
| 布局 | 单列整宽主叙事 |
| 栅格占比 | 12 栏整宽 |
| 内容槽位 | 淘汰赛对阵图 1 组，当前对阵摘要 1 组，状态提示 2-4 条，相关队伍卡 2 组，去向链接 2 个 |
| 允许组件 | SurfaceCard / TeamMark / PlayerAvatar / Badge / Link |
| 允许变体 | SurfaceCard.tone=default|accent；Badge.tone=info|success|warning |
| 禁止 | 当前对阵没有状态；相关队伍区缺队伍归属；把单局 Accordion 升格成主视觉；增加 4 栏关系轨 |
| 响应式 | xs 先对阵图，后当前对阵摘要，再上下游去向 |

### 7.15 Player Story Stack

| 字段 | 内容 |
| --- | --- |
| 区块名称 | Player Story Stack |
| 用途 | 把选手资料、英雄池、互评、代表比赛按人物叙事顺序组织起来 |
| 布局 | 双列分段或纵向锚点流 |
| 栅格占比 | 14 栏整宽 |
| 内容槽位 | 资料块 1 个，英雄池 1 个，互评 1 个，代表比赛 1 个，关联对象回流 1 个 |
| 允许组件 | SurfaceCard / HeroChip / PlayerAvatar / Link |
| 允许变体 | HeroChip.size=sm|md；SurfaceCard.tone=default|muted |
| 禁止 | OpenDota 面板先于人物资料；所有区块无锚点；空态直接删段 |
| 响应式 | xs 保持单列，互评和代表比赛顺序不变 |

### 7.16 Team Roster Wall

| 字段 | 内容 |
| --- | --- |
| 区块名称 | Team Roster Wall |
| 用途 | 先展示核心阵容，再展开全员名单与当前招募状态 |
| 布局 | 1 主列 + 1 辅列 |
| 栅格占比 | lg 6 + 6；xs 单列 |
| 内容槽位 | 核心成员 0-3 张，全员成员若干，英雄 Chip 最多 4 个/人，招募卡 0-2 张 |
| 允许组件 | SurfaceCard / PlayerAvatar / HeroChip / Link / TeamMark |
| 允许变体 | SurfaceCard.tone=default|muted；HeroChip.size=sm |
| 禁止 | 全员名单先于核心阵容；无成员时整块消失；招募卡视觉超过阵容墙 |
| 响应式 | xs 先核心阵容后全员，再放招募卡 |

### 7.17 第二期专用区块实例

- Topic Aggregate Tabs、Recruitment Contact Aside、Activity Action Rail、Hero Attribute Directory、FAQ Cluster Grid 统一见 16_phase-two-features.md。

### 7.22 Admin Workspace Split

| 字段 | 内容 |
| --- | --- |
| 区块名称 | Admin Workspace Split |
| 用途 | 给后台编辑页提供统一的表单主区与说明侧区结构，适用于用户管理、选手档案管理和申请审核分开维护的后台模型 |
| 布局 | AdminWorkspace 6 + 8 或 7 + 5 |
| 栅格占比 | lg 双栏；xs 单列 |
| 内容槽位 | 表单分组 3-8 块，说明卡 2-4 张，状态卡 1 张，关系说明卡 1 张，风险卡 0-1 张 |
| 允许组件 | AdminWorkspace / AdminSidePanel / Form Field / Button / Dialog |
| 允许变体 | FormField.state=default|error|loading；AdminSidePanel.layout=summary |
| 禁止 | 把用户编辑和选手档案编辑混成同一张主表单；表单与风险操作混排；侧栏比主表单更重；保存反馈缺失 |
| 响应式 | xs 先表单后说明，再风险操作 |

### 7.23 Audit History Panel

| 字段 | 内容 |
| --- | --- |
| 区块名称 | Audit History Panel |
| 用途 | 在后台审核和编辑页保留可追溯的操作记录 |
| 布局 | 侧栏或底部单块列表 |
| 栅格占比 | 4 栏侧卡或 14 栏底部 |
| 内容槽位 | 时间戳、操作者、动作、结果、备注 |
| 允许组件 | AdminSidePanel / Table / Badge |
| 允许变体 | Badge.tone=info|warning|danger|success |
| 禁止 | 只有状态没有操作者；风险操作不留痕；把审计内容塞进主表单 |
| 响应式 | xs 改成纵向时间线卡片 |

### 7.24 Risk Action Panel

| 字段 | 内容 |
| --- | --- |
| 区块名称 | Risk Action Panel |
| 用途 | 收束下线、回滚、删除、驳回等高风险动作 |
| 布局 | 双列底部或侧栏单块 |
| 栅格占比 | 14 栏整宽或 4 栏侧卡 |
| 内容槽位 | 风险说明 1 段，动作按钮 1-2 个，恢复说明 1 条 |
| 允许组件 | AdminSidePanel / Dialog / Button / Badge |
| 允许变体 | Button.variant=danger|secondary；Dialog.purpose=confirm |
| 禁止 | 主表单区直接放删除按钮；危险动作没有对象名和可恢复说明 |
| 响应式 | xs 保持底部单列，确认动作进入 Dialog |