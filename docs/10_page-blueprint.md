# 今晚就来社区 / Page Blueprint

## 1. 这份文档解决什么问题

- Page Brief 回答页面要完成什么
- Page Blueprint 回答页面具体怎么排、先看什么、点哪里、怎么在不同设备上变形
- Promptframe 是 Page Blueprint 的执行层，要求把布局和 AI 内容约束绑在一起写

结论：

- Page Brief 不是最终页面规格
- 进入设计稿或代码前，核心页面必须先补 Blueprint

## 2. 适用范围

必须提供 Blueprint 的页面：

- 首页
- 所有频道页
- 所有详情页
- 我的主页与身份相关页
- 英雄页与搜索弹层
- 所有后台首页、列表页、编辑页

可简化处理的页面：

- 单纯阅读型静态页可使用轻 Blueprint
- 只有正文和目录的规则页、指引页可复用阅读页 Blueprint 模板

## 3. 一份 Blueprint 必须包含的 12 项

1. 页面名称与路由
2. 页面目标与唯一主 CTA
3. 关键用户状态
4. 页面版心宽度或首页舞台边界
5. 区块顺序
6. 每个区块的布局模式
7. 每个区块的形状定义
8. 每个区块与周围区块的拼接关系
9. 注意力顺序
10. 组件引用与允许变体
11. 内容槽位长度
12. 响应式重排规则与 Promptframe 约束

## 4. 标准输出格式

### 4.1 页面头部

- 页面名称
- 路由
- 页面类型：home | channel | reading | detail | operation | admin
- 页面目标
- 唯一主 CTA
- 次 CTA
- 用户状态
- 页面版心或舞台边界

### 4.2 布局总览表

每个页面必须先给一张总览表：

| 区块顺序 | 区块名称 | 目标 | 布局模式 | 形状定义 | 拼接关系 | 主视觉权重 | 组件 | 主动作 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | Hero / PageIntro | 建立对象认知 | 14 栏整宽 / 8 + 4 | 整宽舞台块或双块咬合舞台 | 下一区块必须贴边进入 | A | PageIntro / DetailHero | 查看当前赛季 |
| 2 | Proof Strip | 证明现在值得点进去 | 4 卡横排 | 横向证明带 | 与 Hero 共用一条连续边 | B | SurfaceCard | 查看关键比赛 |

规则：

- 同一页只能有一个 A 级主视觉块
- A 级后必须是证明、筛选、关系或正文，不允许再堆第二个舞台块
- 后台页不使用庆典式 A 级视觉
- 全站都要复用不规则大色块母题，但不同页面类型的块面强度不同：home/channel 最强，detail 次之，reading/operation/admin 以克制分区为主
- 每个页面实例必须明确写出顶部导航是否全宽、首页是否全宽舞台或其他页面的版心宽度，例如导航栏 fluid、首页 fluid、其他页面 1240、阅读正文 760

### 4.3 区块详细规格

每个区块必须继续写成以下字段：

- 区块名称
- 区块目标
- 布局模式：单栏 | 8 + 4 | 9 + 3 | 3 列网格 | 表格 | 双核 | 拼贴
- 栅格占比
- 形状定义
- 拼接关系
- 内容槽位
- 允许组件
- 允许组件变体
- 禁止项
- 主 CTA 位置
- 响应式变化

## 5. Promptframe 写法

每个区块后都要附一段可直接喂给 AI 的内容约束：

- 生成什么内容
- 长度上限
- 语气
- 是否允许数据、引用、徽章、图片
- 明确不要写什么

推荐格式：

```text
区块：推荐选手 Banner
生成目标：突出 1 位焦点选手，并给出为什么值得点进去
形状定义：左宽右高双块拼接，右卡为人物高块
拼接关系：与上一区块底边连续，与下一区块左边界顺接
标题长度：12-20 字
描述长度：30-50 字
CTA：1 个，使用“查看选手详情”
语气：专业、克制、带一点竞技感
禁止：不要喊口号，不要伪造高光数据，不要出现第二主 CTA
```

## 6. 页面 Blueprint 模板

```text
页面名称：
路由：
页面类型：
页面目标：
唯一主 CTA：
次 CTA：
用户状态：
页面版心或舞台边界：

区块顺序：
1.
2.
3.

区块 1：
- 目标：
- 布局模式：
- 栅格占比：
- 形状定义：
- 拼接关系：
- 注意力权重：A / B / C
- 内容槽位：
- 允许组件：
- 允许变体：
- 禁止项：
- CTA 位置：
- 响应式：xs / md / lg
- Promptframe：

区块 2：
...
```

## 7. Herald Cup 页面类型默认蓝图

### 首页 Blueprint 基线

- 页面舞台边界：fluid
- 游客态：3 + 6 + 3 首页首屏 -> 中栏内容主体 -> 杯赛说明 -> 合作支持 -> Footer
- 登录态：3 + 6 + 3 首页首屏 -> 中栏内容主体 -> 我的比赛或我的战队相关内容 -> 后续区块 -> Footer

### 频道页 Blueprint 基线

- 页面版心：1240
- 版心内部默认采用 12 栏内容栅格，主副栏优先使用左 8 / 右 4
- 桌面端默认采用独立滚动关系：左侧 8 栏主区负责页面滚动，右侧 4 栏侧轨固定在视口内作为持续关系锚点
- 第一期开赛相关频道页必须把双轴矩阵做成可感知结构：顶部对象入口负责对象维，PageIntro 内的范围舞台带负责范围维
- 范围舞台带不能退化成普通标签行；当前范围必须驱动 PageIntro 标题、统计、主列表标题或右侧关系卡中的至少一组内容
- 比赛、选手、战队三个频道之间横向跳转时，Blueprint 默认要求保留当前范围，否则双轴只剩单页局部状态
- 非对称 PageIntro / Mosaic 题头
- 工具条或筛选条块
- 主列表或 8 + 4 主副栏
- 回流区
- Footer

### 阅读页 Blueprint 基线

- 页面版心：reading-shell 1240，正文 760
- 块面题头
- 摘要块
- 正文流
- 右栏关系卡或目录块
- 文末推荐块

### 详情页 Blueprint 基线

- 页面版心：1240
- DetailHero
- DetailStatGrid 或状态摘要
- 8 + 4 主副栏
- 左栏主体叙事
- 右栏状态与关系
- 尾部回流

补充：

- 详情页至少要有 1 个横向大块和 1 个竖向块面形成错位，不要从头到尾整齐对齐成表格式长页

### 后台页 Blueprint 基线

- 页面版心：1240
- 标题区
- 工具条
- 指标或表格 / 表单主区
- 状态配置
- 风险操作
- 审计记录

补充：

- 后台区块同样用不规则块面分区，但块面差异优先通过留白、边框、弱底色和高度变化建立，不依赖强品牌色
- 后台数据中，User 与 Player 必须视为两张独立表，不允许把注册用户自动等同为选手
- 用户登录后默认只有账号身份；要成为选手，必须发起申请并经过后台审核，审核结果可以是关联既有 Player 档案或审核通过后再建立 Player 档案
- 后台管理员可以手动创建一个没有关联用户的 Player 档案，用于历史选手、资料补录、未注册选手或临时运营录入

## 8. Blueprint 验收清单

- 是否只有一个主重块
- 是否写清区块顺序而不是只写“建议出现”
- 是否给出布局模式而不是只写内容主题
- 是否给出每个区块的形状定义
- 是否给出每个区块与上下左右区块的拼接关系
- 是否写清主 CTA 的位置和唯一性
- 是否给出允许组件与允许变体
- 是否给出 xs、md、lg 的重排规则
- 是否附带 promptframe 约束
- 是否说明哪些区块可复用、哪些是页面特有

## 9. 实例 A：首页 /

页面名称：今晚就来社区首页
路由：/
页面类型：home
页面目标：用固定的左 3 / 中 6 / 右 3 首屏结构，把首页做成“内容入口侧轨 + 内容主体 + 身份入口”的稳定门户
唯一主 CTA：查看比赛中心
次 CTA：查看比赛详情 / 查看选手详情 / 进入我的主页
用户状态：游客；已登录未成为选手；已成为选手用户
页面舞台边界：fluid

### 9.1 布局总览表

| 区块顺序 | 区块名称 | 目标 | 布局模式 | 形状定义 | 拼接关系 | 主视觉权重 | 组件 | 主动作 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | Left Rail Navigation | 把热门比赛、热门选手、社区玩法、社区赞助收进固定内容入口侧轨 | 左侧 3 栏内容入口侧轨 | 4 个纵向入口块，偏直角 | 与中栏共顶线；固定贴左侧起线；与中栏保持稳定 gutter | B | SurfaceCard / Link / Badge | 打开内容入口 |
| 2 | Center Content Stack | 承接首页主内容主体 | 中间 6 栏纵向主内容流 | 中栏顶部为主摘要与主 CTA，下方由热门比赛、热门选手、社区玩法和社区赞助 4 个明确模块顺排组成 | 与左右侧轨共顶线；在同一条中轴中连续展开；左右侧轨不得插入中栏主体 | A | SectionIntro / SurfaceCard / MatchCard / PlayerCard / AvatarGroup | 查看内容详情 |
| 3 | Right Rail Identity | 右侧固定承担登录引导或登录后数据 | 右侧 3 栏身份轨 | 登录前为引导块，登录后为 OpenDota 数据块；已成为选手时在下方追加参赛信息块 | 与中栏共顶线；固定贴右侧起线；与中栏保持稳定 gutter | B | SurfaceCard / Button / Badge | 快来登录 |

### 9.2 区块详细规格

区块 1：Left Rail Navigation
- 目标：让左栏成为首页稳定内容入口侧轨，而不是一组临时资讯卡
- 布局模式：左侧 3 栏纵向内容入口侧轨
- 栅格占比：lg 3，md 4，xs 14
- 形状定义：4 个纵向入口块，分别对应热门比赛、热门选手、社区玩法、社区赞助；块面以直角和小圆角混用为主
- 拼接关系：固定贴左边界；与中栏保持连续 gutter；各入口块之间用统一节奏竖向堆叠，不做异形插接
- 注意力权重：B
- 内容槽位：栏目名、1 行说明、入口标签 1-3 个
- 允许组件：SurfaceCard / Link / Badge / SectionIntro
- 允许变体：SurfaceCard.tone=muted|default；Badge.tone=brand|info
- 禁止项：把左栏写成第二内容流；入口项没有明确去向；把左栏误写成全站一级导航；所有块都做大圆角
- CTA 位置：整卡可点击或块底部轻入口
- 响应式：md 保留为顶部轻入口条；xs 固定排在中栏主体之前
- Promptframe：

```text
区块：Left Rail Navigation
生成目标：用左侧固定入口侧轨告诉用户首页中栏会看到哪四个模块
入口项：热门比赛、热门选手、社区玩法、社区赞助
每项内容：名称 1 个、说明 1 行、轻量入口标签 1 到 3 个
交互：点击后跳转到首页对应模块锚点，不承担详情内容本身
禁止：不要把左栏写成资讯摘要，不要在左栏重复中栏详细数据
```

区块 2：Center Content Stack
- 目标：把首页主要内容稳定放在中间 6 栏；顶部先讲主摘要与主 CTA，再固定收敛为热门比赛、热门选手、社区玩法、社区赞助四个明确模块
- 布局模式：中间 6 栏纵向主内容流
- 栅格占比：lg 6，md 8，xs 14
- 形状定义：中栏顶部为唯一主重摘要块，下方按热门比赛、热门选手、社区玩法、社区赞助 4 段纵向分节；模块之间使用统一留缝和标题条，不额外再起第二舞台
- 拼接关系：与左右侧轨共顶线；顶部摘要块和下方四模块在同一条中轴里连续展开；左右栏可延续但不得插入中栏主体
- 注意力权重：A
- 内容槽位：
	- 顶部摘要：标题 1-2 行、主摘要 2-4 行、主 CTA 1 个、次 CTA 1-2 个
	- 热门比赛：从比赛库读取 1-多条比赛摘要，并组织成多条轮播；轮播项展示名称、时间、状态、结果等基础信息，不展示赛程表
	- 热门选手：从选手库读取 1-多条选手摘要，并组织成多条轮播；轮播项展示名称、Steam ID、擅长位置、擅长英雄、OpenDota 关键数据，不展示完整档案
	- 社区玩法：并列展示先锋杯、传奇杯、冠绝杯三档要求，三者同权，不做主次排序
	- 社区赞助：展示核心作者“啵酱该吃饭了”，并列展示其他赞助者头像与 ID
- 允许组件：SectionIntro / SurfaceCard / MatchCard / PlayerCard / Button / Badge / AvatarGroup
- 允许变体：SurfaceCard.tone=default|accent；Button.secondary=md；Badge.tone=brand|info
- 禁止项：把中栏切成多个平级主舞台；把登录信息混入中栏；在首页展示比赛赛程表；在首页展示选手完整档案；把社区玩法做成单一卡压制其他杯赛
- CTA 位置：每个分段标题右侧或卡片底部
- 响应式：xs 改为单列主内容流，仍保留“热门比赛 -> 热门选手 -> 社区玩法 -> 社区赞助”顺序
- Promptframe：

```text
区块：Center Content Stack
生成目标：用四个连续模块把首页中栏写成稳定内容主轴
模块顺序：热门比赛 -> 热门选手 -> 社区玩法 -> 社区赞助
热门比赛：读取 1 到多条比赛摘要，并组织成轮播；每条必须包含比赛名称、时间、状态、结果；如果赛季已结束与进行中，需要用不同状态样式；禁止展示赛程表；点击进入比赛详情
热门选手：读取 1 到多条选手摘要，并组织成轮播；每条必须包含名称、Steam ID、擅长位置、擅长英雄、OpenDota 关键数据；禁止展示完整选手档案；点击进入选手详情
社区玩法：并列展示先锋杯、传奇杯、冠绝杯的参赛要求；三档同权，不排序，不设单独主推
社区赞助：必须突出核心作者“啵酱该吃饭了”，同时展示其他多位赞助者头像与 ID
语气：信息化、清楚、不过度宣传
禁止：不要伪造完整赛程，不要伪造选手全量数据，不要把赞助区写成空泛鸣谢文，不要把轮播写成同时平铺的长列表
```

区块 3：Right Rail Identity
- 目标：右栏固定承担登录引导、登录后的 OpenDota 数据，以及已成为选手后的参赛信息，不再和主内容抢戏
- 布局模式：右侧 3 栏身份轨
- 栅格占比：lg 3，md 4，xs 14
- 形状定义：登录前为单个引导主块；登录后至少包含 1 个 OpenDota 数据块；已成为选手时再向下叠加 1 个参赛信息块；直角为主，局部单侧圆角
- 拼接关系：固定贴右边界；与中栏保持连续 gutter；不同状态块纵向堆叠，但不能扩展成第二内容流
- 注意力权重：B
- 内容槽位：
	- 登录前：标题、登录收益说明、登录动作
	- 登录后未成为选手：OpenDota 数据摘要、个人入口
	- 登录后已成为选手：OpenDota 数据摘要、参赛信息、个人入口
- 允许组件：SurfaceCard / Button / Badge / Link
- 允许变体：SurfaceCard.tone=accent|default；Button.primary=md
- 禁止项：右栏放第二内容流；右栏脱离身份和个人数据主题；切角样式；未成为选手时提前展示参赛信息
- CTA 位置：卡片底部
- 响应式：xs 固定排在中栏主体之后，状态块改为顺序堆叠
- Promptframe：

```text
区块：Right Rail Identity
生成目标：用右侧身份轨区分登录前、登录后、已成为选手三种状态
登录前：展示“快来登录”，并明确说明登录后可以看到 OpenDota 数据和个人入口
登录后未成为选手：展示 OpenDota 数据摘要，不展示参赛信息
登录后已成为选手：在 OpenDota 数据摘要之外，再展示参赛信息
语气：直接、信息化、不要喊口号
禁止：不要把右栏写成广告区，不要在未成为选手时伪造参赛记录
```

### 9.3 首页注意力路径

- 游客态：左栏内容入口侧轨 -> 中栏内容主体 -> 右栏“快来登录”
- 登录态：左栏内容入口侧轨 -> 中栏内容主体 -> 右栏 OpenDota 数据
- 已成为选手态：左栏内容入口侧轨 -> 中栏内容主体 -> 右栏 OpenDota 数据 -> 右栏参赛信息

### 9.4 复用与页面特有边界

- 可复用：Left Rail Navigation、Right Rail Identity
- 页面特有：Center Content Stack

## 10. 实例 B：比赛总览 /matches

页面名称：比赛中心
页面顶栏：全宽导航
路由：/matches
页面类型：channel
页面目标：把比赛页收口为“顶部对象入口 + 页面级范围舞台带 + 8/4 比赛工作台”的统一入口，让用户只在这里处理赛程、赛季和比赛结果
唯一主 CTA：查看当前赛程主线
次 CTA：查看赛季详情 / 切换范围 / 去选手频道 / 去战队频道
用户状态：游客；普通用户；已是选手；队长

页面版心或舞台边界：1240

### 10.1 布局总览表

| 区块顺序 | 区块名称 | 目标 | 布局模式 | 形状定义 | 拼接关系 | 主视觉权重 | 组件 | 主动作 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | Range Stage Band | 在比赛频道顶部建立“全部 / 先锋杯 / 传奇杯 / 冠绝杯”的范围认知，并用对应主题色建立当前范围舞台 | 12 栏范围舞台带 | 左侧范围标题和说明，中部 4 个范围切换块，右侧范围统计或资格摘要；当前态由大块主题色承接 | 顶边贴全宽导航；底边直接接 Match Workspace，不单独做第二个 Hero | A | Tabs / Badge / SurfaceCard | 切换范围 |
| 2 | Match Workspace | 在左 8 栏只浏览当前范围下的赛季、赛程、阶段和结果入口 | 8 栏主工作台 | 整块比赛工作台，顶部为工具条，中段为赛季与赛程对象流，底部为轻回流 | 与右侧 Match Range Rail 共顶线；桌面端左侧滚动、右侧固定 | B | Input / SurfaceCard / MatchRow / SeasonCard / Badge | 打开比赛或赛季详情 |
| 3 | Match Range Rail | 在右 4 栏说明当前范围、当前身份和跨对象跳转入口 | 4 栏固定侧轨 | 纵向状态卡与范围说明卡堆叠；按游客/用户/选手/队长切换动作，但不在此页直接承载选手/战队目录动作 | 顶边与 Match Workspace 共顶线；底边与工作台最低边共同收口 | B | IdentityPanel / SurfaceCard / Button / Link / Badge | 成为选手 / 建立队伍 / 去当前范围选手池 |
| 4 | Workspace Relay | 收束到海报页、历史赛季与跨频道回流 | 12 栏单列轻卡流 | 尾部短块流，收束而不重起舞台 | 从 Match Workspace 与 Match Range Rail 的共同底边顺接 | C | SurfaceCard / Link | 去海报页或其他频道 |

### 10.2 区块详细规格

区块 1：Range Stage Band
- 目标：让用户一眼知道当前在看哪个范围，并把范围切换做成比赛主题而不是后台筛选条
- 布局模式：12 栏范围舞台带
- 栅格占比：12 栏整宽
- 形状定义：左文中控右摘要三段拼接；当前范围块由大块主题色承接，非当前范围为弱化签条；“全部”使用中性色舞台面
- 拼接关系：顶边贴全宽导航；底边直接接 Match Workspace
- 注意力权重：A
- 内容槽位：范围切换 4 个，当前态标题 1 组，范围说明 1 组，状态胶囊 0-2 个，统计 0-3 项
- 允许组件：Tabs / Badge / SurfaceCard
- 允许变体：Tabs.style=segmented；Tabs.size=md；Tabs.tone=neutral|pioneer|legend|crown
- 禁止项：把范围条做成细筛选器；把“全部”染成任一杯赛颜色；当前态没有大块背景承接
- CTA 位置：范围切换块本身承担切换
- 响应式：xs 允许横向滚动，但必须保留“全部 / 先锋杯 / 传奇杯 / 冠绝杯”四项

```text
区块：Range Stage Band
生成目标：让用户一眼知道自己当前在比赛频道里看的是哪一个范围
范围数量：4 个，固定为全部 / 先锋杯 / 传奇杯 / 冠绝杯
语气：对象识别优先，不写营销口号
布局要求：范围条必须在频道题头位置直接出现，并衔接下方工作台
颜色规则：全部=中性色；先锋杯=emerald + sky；传奇杯=violet + amber；冠绝杯=rose + amber-deep
禁止：不要做成第二条普通 Tabs，不要变成 Hero Banner，不要让四个范围长得完全一样
```

范围视觉节奏规则：
- 当前范围舞台面必须覆盖工作台起始可视区，至少同时包住范围说明、工具条上沿与右栏首卡上沿
- “全部”范围使用深色中性舞台面，只通过金属暖色与中性强调建立总览语义
- 三个杯赛范围的块面允许切换主题色和短说明，但三者保持同一圆角、留白和分栏骨架
- 范围切换只替换块面色、标题、副文案和统计，不改变对象频道骨架

区块 2：Match Workspace
- 目标：在左 8 栏工作台里只承接比赛对象本身，不再在比赛页混入选手和战队目录
- 布局模式：8 栏主工作台
- 栅格占比：lg 8，xs 14
- 形状定义：整块比赛工作台，顶部工具条，中段赛季卡与赛程行，底部历史回流
- 拼接关系：顶部贴 Range Stage Band；右侧与 Match Range Rail 保持固定 gutter；底部共同接 Workspace Relay
- 注意力权重：B
- 内容槽位：搜索 1 个，筛选 1-2 个，计数 1 组，赛季卡若干，赛程行若干
- 允许组件：Input / Tabs / Badge / MatchRow / SeasonCard / Link
- 允许变体：Input.tone=subtle；Badge.tone=brand|info|success；Tabs.style=segmented
- 禁止项：在比赛频道里再起“选手 / 战队”并列主 Tabs；把赛季、赛程、对象详情混成同一流水正文
- CTA 位置：赛季卡标题、赛程行标题或整卡点击
- 响应式：xs 工具条下沉为单列，赛程流回到单列顺序流

范围规则：
- 全部：展示跨杯赛聚合赛程和赛季摘要，必须显式标明所属杯赛
- 先锋杯 / 传奇杯 / 冠绝杯：只展示当前杯赛范围内的赛季、赛程、阶段与结果
- 比赛页不再承担选手池和战队池目录，它们分别回到 /players 与 /teams 的当前范围视图

工作台对象显示规则：
- 赛程使用紧凑行式列表，单行表达赛事名、对阵双方、轮次、状态与主跳转入口
- 赛季使用摘要卡，固定包含赛季名、杯赛归属、阶段进度、当前状态与主跳转入口
- 任一对象卡优先“去详情页”；跨对象浏览使用右栏中的频道入口，不分散到左侧对象卡

区块 3：Match Range Rail
- 目标：在右 4 栏解释当前范围、当前身份和可去的下一步，而不是承载第二条比赛内容流
- 布局模式：4 栏 sticky 侧轨
- 栅格占比：lg 4，xs 下沉到主工作台之后
- 形状定义：范围摘要卡 + 身份卡 + 跨频道入口卡堆叠
- 拼接关系：与 Match Workspace 共顶线，共同收口
- 注意力权重：B
- 内容槽位：范围说明 1 组，用户信息 1 组，选手信息 0-1 组，队伍信息 0-1 组，跨频道入口 1-2 个，动作按钮 1-2 个
- 允许组件：IdentityPanel / SurfaceCard / Button / Link / Badge
- 允许变体：Button.variant=primary|secondary；Badge.tone=neutral|pioneer|legend|crown
- 禁止项：右栏重复左侧赛程对象流；在比赛频道中直接暴露邀请入队或训练赛邀请；危险动作无确认链路
- CTA 位置：卡片底部
- 响应式：xs 下沉到主工作台后方，仍保持先范围后身份后动作

角色态约束：
- 游客：显示当前范围说明、登录提示与“去指引”入口
- 普通用户：显示基本用户信息、当前范围说明与“成为选手”入口
- 选手：显示基本用户信息、基本选手信息、当前范围资格说明与“建立队伍”入口
- 队长：显示基本用户信息、基本选手信息、基本队伍信息、当前范围资格说明与“去当前范围战队池”入口

区块 4：Workspace Relay
- 目标：收束到赛季上下文、海报页、历史赛季和跨频道回流
- 布局模式：12 栏轻卡流
- 栅格占比：12 栏整宽
- 形状定义：尾部短卡流
- 拼接关系：从 Match Workspace 与 Match Range Rail 的共同底边顺接
- 注意力权重：C
- 内容槽位：海报页入口 0-1 个、历史赛季入口 0-2 个、去当前范围选手池入口 0-1 个、去当前范围战队池入口 0-1 个
- 允许组件：SurfaceCard / Link / Badge
- 允许变体：SurfaceCard.tone=muted|default
- 禁止项：重起第二个主舞台；混入新闻或战报主线
- CTA 位置：整卡点击
- 响应式：xs 单列 3 到 4 张以内

### 10.3 比赛页注意力路径

- 范围舞台带 -> 当前范围赛季与赛程 -> 右侧范围与身份说明 -> 详情页或跨频道回流

### 10.4 复用与页面特有边界

- 可复用：Range Stage Band、Workspace Relay
- 页面特有：Match Workspace、Match Range Rail

## 11. 实例 C：选手频道 /players

页面名称：选手频道
页面顶栏：全宽导航
路由：/players
页面类型：channel
页面目标：把选手页维持为展示页，并用“对象频道 + 范围舞台带”明确区分全站选手目录与各杯选手池
唯一主 CTA：打开人物页
次 CTA：切换范围 / 去申请成为选手 / 先看战队
用户状态：游客；普通用户；已是选手；队长
页面版心或舞台边界：1240

### 11.1 布局总览表

| 区块顺序 | 区块名称 | 目标 | 布局模式 | 形状定义 | 拼接关系 | 主视觉权重 | 组件 | 主动作 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | Range Stage Band | 在选手频道顶部建立“全部 / 先锋杯 / 传奇杯 / 冠绝杯”的范围认知，并说明当前列表是全站目录还是某杯选手池 | 12 栏范围舞台带 | 左侧范围说明，中部 4 个范围切换块，右侧当前范围统计和资格摘要 | 顶边贴全宽导航；底边直接接 Player Browser Workspace | A | Tabs / Badge / SurfaceCard | 切换范围 |
| 2 | Player Browser Workspace | 承接筛选、焦点人物和当前范围内的主卡栅格 | 8 + 4 主副栏 | 左侧主工作台长块，顶部筛选条，中段焦点人物带，底部人物网格 | 顶边贴 Range Stage Band 左块底边；右侧侧轨与 My Identity Rail、Quick Relations 连成连续竖轨 | B | PlayersBrowser / SurfaceCard | 打开人物页 |
| 3 | My Identity Rail | 在右栏固定保留角色态身份、当前范围资格说明和动作入口 | 4 栏侧轨 | 右侧第一张纵向状态块 | 顶部贴 Range Stage Band 右块底边；底部与 Quick Relations 直接顺延 | B | SurfaceCard / Button / Dialog Trigger | 成为选手 / 建立队伍 / 邀请入队 |
| 4 | Quick Relations | 保留高频人物入口与杯池关系摘要 | 4 栏侧轨 | 多张短柱人物关系块组成轻侧流 | 顶边贴 My Identity Rail 底边；底边与 Cross Flow 起始线对齐 | C | SurfaceCard / PlayerAvatar / Badge | 打开人物页 |
| 5 | Cross Flow | 把用户继续带到战队、比赛或当前范围规则 | 单列轻卡流 | 横向收束轻流块 | 从 Player Browser Workspace 整体底边起接，并与右侧 Quick Relations 最低边共同收口 | C | SurfaceCard / Button | 去战队或比赛 |

### 11.2 区块详细规格

区块 1：Range Stage Band
- 目标：让用户先明白当前在看“全站选手目录”还是“某杯选手池”
- 布局模式：12 栏范围舞台带
- 栅格占比：12 栏整宽
- 形状定义：左文中控右摘要三段拼接；当前范围块由主题色大面承接，“全部”使用中性色舞台面
- 拼接关系：顶边贴全宽导航；底边直接接 Player Browser Workspace
- 注意力权重：A
- 内容槽位：范围切换 4 个，当前态标题 1 组，范围说明 1 组，统计 0-3 项，资格胶囊 0-2 个
- 允许组件：Tabs / Badge / SurfaceCard
- 允许变体：Tabs.style=segmented；Tabs.tone=neutral|pioneer|legend|crown
- 禁止项：用小 badge 代替范围舞台；当前范围不改标题和统计；“全部”与某杯赛同色
- CTA 位置：范围切换块本身承担切换
- 响应式：xs 允许横向滚动，但必须完整保留四项

区块 2：Player Browser Workspace
- 目标：让筛选、焦点人物和当前范围内的选手网格处于同一工作区，降低切换成本
- 布局模式：主栏单列工作台，包含 Filter Bar、Focus Players、Player Grid
- 栅格占比：lg 8，xs 14
- 形状定义：一个连续主工作台长块，顶部嵌入筛选条，中段是短横焦点带，底部是规则网格块
- 拼接关系：顶部贴 Range Stage Band 左块底边；右侧与侧轨留一条固定 gutter；桌面端主工作台负责滚动，右侧侧轨固定
- 注意力权重：B
- 内容槽位：筛选按钮 4 组、下拉 3 组、搜索 1 个、结果统计 3 项、焦点人物 0-3 张、卡片栅格若干
- 允许组件：PlayersBrowser / SurfaceCard / Form Field / HeroChip / Badge
- 允许变体：FormField.size=md；SurfaceCard.tone=default；Tabs.style=segmented
- 禁止项：焦点人物和全量卡片混成一个列表；范围切换后列表标题不更新；选手卡不展示杯池标签
- CTA 位置：人物卡标题和焦点卡标题
- 响应式：md 筛选改为 2 列；xs 全部字段单列并保留当前结果统计

范围规则：
- 全部：展示全站选手目录，选手卡可同时露出多个杯池标签
- 先锋杯 / 传奇杯 / 冠绝杯：展示当前杯选手池，标题、计数和空态都必须显式写当前杯名

区块 3：My Identity Rail
- 目标：在右栏先讲清账号身份，再说明当前范围里的资格状态和下一步动作
- 布局模式：4 栏 sticky 侧轨中的首卡
- 栅格占比：lg 4，xs 下沉到主工作区之后
- 形状定义：纵向状态短柱块，顶部做轻包角，底部保持平直
- 拼接关系：顶边贴 Range Stage Band 右块底边；底边紧接 Quick Relations 第一张卡
- 注意力权重：B
- 内容槽位：身份标题、状态说明 2-3 行、账号/选手关系标签 2-4 个、当前范围资格标签 0-2 个、CTA 1-2 个
- 允许组件：SurfaceCard / Button / HeroChip / Badge
- 允许变体：SurfaceCard.tone=default；Button.primary=md；Button.secondary=md
- 禁止项：把用户账号直接写成已是选手；无当前范围资格说明；队长邀请入口埋进正文
- CTA 位置：卡片底部
- 响应式：xs 放到主列表后，仍保持第一张侧栏卡顺序

角色态约束：
- 游客：只显示浏览说明或登录提示
- 普通用户：显示基本用户信息与“成为选手”入口
- 选手：显示基本用户信息、基本选手信息、当前范围资格说明与“建立队伍”入口
- 队长：显示基本用户信息、基本选手信息、基本队伍信息、当前范围资格说明与“邀请该选手入队”入口

区块 4：Quick Relations
- 目标：持续暴露高频人物入口和杯池关系摘要，减少回滚到顶部重新筛选的次数
- 布局模式：侧轨竖向轻卡流
- 栅格占比：lg 4，xs 单列 3 张以内
- 形状定义：竖向短块流，卡片高度统一，首卡可略高于后续两卡
- 拼接关系：必须直接顺延在 My Identity Rail 下方；桌面端与 My Identity Rail 共享固定右轨
- 注意力权重：C

区块 5：Cross Flow
- 目标：把用户从选手频道继续送去战队、比赛或当前范围规则入口
- 布局模式：单列轻卡流
- 栅格占比：12 栏整宽
- 形状定义：横向收束轻流块，可内含 2 到 3 张短横关系卡
- 拼接关系：从 Player Browser Workspace 整体底边起接，并与右侧 Quick Relations 的最低边共同形成一条平直收口
- 注意力权重：C
- 内容槽位：关系入口 2-3 个、标题 1 行、说明 1-2 行、CTA 1 个
- 允许组件：SurfaceCard / Button / Link
- 允许变体：SurfaceCard.tone=muted|default；Button.secondary=md
- 禁止项：再做一个人物主舞台；混入无关内容入口；与上方工作台断开成独立页段
- CTA 位置：区块标题右侧或整卡底部
- 响应式：xs 单列顺延在主工作台和身份卡之后

### 11.3 选手页注意力路径

- 范围舞台带 -> 焦点人物 -> 筛选工作台 -> 主卡栅格 -> 我的身份与资格 -> 跨页回流

### 11.4 复用与页面特有边界

- 可复用：Range Stage Band、Player Browser Workspace、My Identity Rail、Quick Relations
- 页面特有：选手池标签和资格摘要

## 12. 实例 D：战队频道 /teams

页面名称：战队频道
页面顶栏：全宽导航
路由：/teams
页面类型：channel
页面目标：把战队页维持为“战队对象目录 + 杯赛范围”展示页，让用户清楚区分全站战队目录和各杯战队池
唯一主 CTA：查看战队详情
次 CTA：切换范围 / 建立队伍 / 邀请训练赛
用户状态：游客；普通用户；已是选手；队长
页面版心或舞台边界：1240

### 12.1 布局总览表

| 区块顺序 | 区块名称 | 目标 | 布局模式 | 形状定义 | 拼接关系 | 主视觉权重 | 组件 | 主动作 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | Range Stage Band | 在战队频道顶部建立“全部 / 先锋杯 / 传奇杯 / 冠绝杯”的范围认知，并说明当前列表是全站战队目录还是某杯战队池 | 12 栏范围舞台带 | 左侧范围说明，中部 4 个范围切换块，右侧范围统计和资格摘要 | 顶边贴全宽导航；底边直接接 Teams Directory | A | Tabs / Badge / SurfaceCard | 切换范围 |
| 2 | Team Intro With Recommended Team | 用推荐战队和频道摘要建立当前范围的战队秩序感 | PageIntro 8 + 4 | 左侧频道题头宽块，右侧推荐战队高块 | 下方 Teams Directory 贴左块底边进入；右高块与 Team Action Rail 共线 | B | PageIntro / SurfaceCard / TeamMark | 打开战队页 |
| 3 | Teams Directory | 承接当前范围内的完整浏览和筛选目录 | 8 + 4 主副栏 | 左侧目录工作台长块，右侧动作为轻侧轨 | 顶边贴 Team Intro 底边；底部与 Cross Flow 共同收口 | B | TeamsDirectory / SurfaceCard / Badge / Button | 浏览战队 |
| 4 | Team Action Rail | 把建立队伍、邀请训练赛、范围资格说明稳定放在展示页右栏 | 4 栏侧轨 | 纵向状态、资格和动作卡堆叠 | 顶边接 Range Stage Band 与推荐战队块；底边与 Teams Directory 最低边共同收口 | B | SurfaceCard / Button / Badge / Dialog | 建立队伍 / 邀请训练赛 |
| 5 | Cross Flow | 把用户继续带到比赛、选手或招募入口 | 单列轻卡流 | 横向收束轻流块 | 从 Teams Directory 与 Team Action Rail 整体底边起接 | C | SurfaceCard / Button | 去比赛或选手 |

### 12.2 区块详细规格

区块 1：Range Stage Band
- 目标：让用户先理解当前在看“全站战队目录”还是“某杯战队池”
- 布局模式：12 栏范围舞台带
- 栅格占比：12 栏整宽
- 形状定义：左文中控右摘要三段拼接；当前范围块由主题色大面承接，“全部”使用中性色舞台面
- 拼接关系：顶边贴全宽导航；底边直接接 Team Intro With Recommended Team
- 注意力权重：A
- 内容槽位：范围切换 4 个，当前态标题 1 组，说明 1 组，统计 0-3 项，资格胶囊 0-2 个
- 允许组件：Tabs / Badge / SurfaceCard
- 允许变体：Tabs.style=segmented；Tabs.tone=neutral|pioneer|legend|crown
- 禁止项：用细筛选条代替范围舞台；当前范围不切换统计与徽章
- CTA 位置：范围切换块本身承担切换
- 响应式：xs 允许横向滚动，但必须完整保留四项

区块 2：Team Intro With Recommended Team
- 目标：用当前范围内的一支代表战队建立秩序感，而不是做泛化庆典横幅
- 布局模式：PageIntro 左文右侧卡组
- 栅格占比：lg 8 + 4，xs 单列
- 形状定义：左侧频道题头宽块，右侧推荐战队纵向高块，右块顶部保留直角收边
- 拼接关系：左右共顶线；Teams Directory 从左块底边起接；右高块与 Team Action Rail 保持同一右轨控制线
- 注意力权重：B
- 内容槽位：标题 1-2 行、说明 2-4 行、CTA 2 个、推荐战队 1 张、频道统计 3 项
- 允许组件：PageIntro / SurfaceCard / TeamMark / Button
- 允许变体：PageIntro.tone=brand；SurfaceCard.tone=accent|muted
- 禁止项：旧式整页 Banner；多个推荐战队并排；将招募入口放成主 CTA
- CTA 位置：PageIntro 动作区
- 响应式：xs 推荐战队卡先于频道统计卡，统计卡改成纵向堆叠

区块 3：TeamsDirectory
- 目标：承接当前范围内的完整战队目录，让全站目录和某杯战队池使用同一对象骨架
- 布局模式：目录工作台
- 栅格占比：lg 8，xs 14
- 形状定义：整宽目录工作台长块，顶部薄筛选条，中部目录网格，底部可选轻回流带
- 拼接关系：必须从 Team Intro With Recommended Team 左块底边顺接，作为页面最大连续块
- 注意力权重：B
- 内容槽位：筛选 2-4 组、统计 3 项、战队卡若干、招募入口 0-3 个
- 允许组件：TeamsDirectory / SurfaceCard / Badge / Button
- 允许变体：SurfaceCard.tone=default|muted；Badge.tone=brand|info
- 禁止项：目录网格随机高低错位；筛选条漂浮在工作台之外；战队卡不展示杯池标签
- CTA 位置：战队卡底部或整卡点击
- 响应式：xs 单列工作台，筛选条下沉为折叠段

范围规则：
- 全部：展示全站战队目录，战队卡可同时露出多个杯池标签
- 先锋杯 / 传奇杯 / 冠绝杯：展示当前杯战队池，标题、计数和空态必须显式写当前杯名

区块 4：Team Action Rail
- 目标：把建立队伍、邀请训练赛、范围资格说明稳定放在展示页右栏
- 布局模式：4 栏侧轨
- 栅格占比：lg 4，xs 下沉到目录之后
- 形状定义：纵向状态卡 + 资格卡 + 动作卡堆叠
- 拼接关系：顶边接 Range Stage Band 与推荐战队块；底边与 Teams Directory 最低边共同收口
- 注意力权重：B
- 内容槽位：账号信息 1 组，选手信息 0-1 组，队伍信息 0-1 组，当前范围资格标签 0-2 个，动作按钮 1-2 个
- 允许组件：SurfaceCard / Button / Badge / Dialog
- 允许变体：Button.variant=primary|secondary|danger；Badge.tone=neutral|pioneer|legend|crown
- 禁止项：动作卡重复左侧目录信息；本人队伍危险动作和普通动作并列在同一卡片
- CTA 位置：卡片底部
- 响应式：xs 下沉到目录之后，保持状态卡在前、动作卡在后、危险卡最后

右侧角色态动作约束：
- 普通用户：看到基本用户信息和“成为选手”说明，不直接显示建队动作
- 选手：显示基本选手信息、当前范围资格说明和“建立队伍”入口
- 队长：显示基本用户信息、基本选手信息、基本队伍信息；看其他队伍时显示“邀请训练赛”，仅本人队伍上下文显示“解散队伍”入口

区块 5：Cross Flow
- 目标：把用户从战队频道继续送去比赛、选手或招募入口
- 布局模式：单列轻卡流
- 栅格占比：12 栏整宽
- 形状定义：横向收束轻流块
- 拼接关系：从 TeamsDirectory 与 Team Action Rail 整体底边起接
- 注意力权重：C
- 内容槽位：关系入口 2-3 个、标题 1 行、说明 1-2 行、CTA 1 个
- 允许组件：SurfaceCard / Button / Link
- 允许变体：SurfaceCard.tone=muted|default；Button.secondary=md
- 禁止项：重起第二个战队主舞台；与上方目录断开成独立页段
- CTA 位置：区块标题右侧或整卡底部
- 响应式：xs 单列顺延在目录和右栏之后

### 12.3 战队页注意力路径

- 范围舞台带 -> 推荐战队 -> 当前范围目录 -> 队长动作侧栏 -> 跨页回流

### 12.4 复用与页面特有边界

- 可复用：Range Stage Band、TeamsDirectory
- 页面特有：Team Action Rail、当前范围推荐战队

## 13. 第二期频道页 Blueprint

- 新闻频道 /news 与社区首页 /community 的 Blueprint 实例统一见 15_phase-two-blueprints-and-specs.md。

## 15. 实例 G：规则与指引阅读页 /rules 与 /guide

页面名称：规则与指引阅读页
路由：/rules；/guide
页面类型：reading
页面目标：把说明型内容压进清晰阅读结构里，让用户先建立路径感，再决定下一步入口
唯一主 CTA：查看新手指引 或 先看比赛中心
次 CTA：常见问题 / 去我的页
用户状态：第一次进入站点；准备发帖或发招募；准备开始身份流程

### 15.1 布局总览表

| 区块顺序 | 区块名称 | 目标 | 布局模式 | 主视觉权重 | 组件 | 主动作 |
| --- | --- | --- | --- | --- | --- | --- |
| 1 | Reading Intro | 交代这页解决什么问题 | PageIntro | A | PageIntro / SurfaceCard | 查看下一步页面 |
| 2 | Directory Aside | 给目录、自查项和快捷入口 | 4 栏侧栏 | B | SurfaceCard / Link | 跳到锚点 |
| 3 | Reading Flow | 承接规则条目或步骤卡片 | 10 栏正文流 | B | ReadingFlow / SurfaceCard | 顺序阅读 |
| 4 | Tail FAQ Or Quick Routes | 在尾部收束到 FAQ 或下一步入口 | 单列或 3 卡网格 | C | SurfaceCard / Accordion | 去下一页 |

### 15.2 区块详细规格

区块 1：Reading Intro
- 目标：用最少视觉噪音交代阅读对象、适合谁看、看完去哪里
- 布局模式：PageIntro，无庆典图形
- 栅格占比：14 栏整宽
- 注意力权重：A
- 内容槽位：标题 1-2 行、说明 2-4 行、主次 CTA 1-2 个、可选统计卡 0-3 个
- 允许组件：PageIntro / SurfaceCard / Button
- 允许变体：PageIntro.tone=neutral；SurfaceCard.tone=muted
- 禁止项：沉浸式大海报；与内容主题无关的视觉装饰；多个主 CTA 竞争
- CTA 位置：PageIntro 动作区
- 响应式：xs 动作区纵向堆叠，统计卡下沉到正文前

区块 2：Directory Aside
- 目标：右栏持续提供锚点目录、自查清单或快捷路由，降低长阅读迷失感
- 布局模式：4 栏 sticky 侧栏
- 栅格占比：lg 4，xs 下沉到正文前
- 注意力权重：B
- 内容槽位：目录 3-6 条、自查卡 2-4 条、快捷入口 0-3 条
- 允许组件：SurfaceCard / Link / Badge
- 允许变体：SurfaceCard.tone=default|muted
- 禁止项：目录层级超过两层；目录与快捷入口混成一块；空侧栏
- CTA 位置：目录条目整卡点击
- 响应式：xs 变为正文前的单列两段卡组

区块 3：Reading Flow
- 目标：让规则条目、步骤卡或说明段落形成稳定的自上而下阅读路径
- 布局模式：ReadingFlow 或双列步骤卡
- 栅格占比：lg 10，xs 14
- 注意力权重：B
- 内容槽位：节标题、摘要 1 段、要点 2-5 条、可选状态标签 0-1 个
- 允许组件：ReadingFlow / SurfaceCard / Accordion / SectionIntro
- 允许变体：Accordion.density=default；SectionIntro.align=left
- 禁止项：正文内插大量装饰卡；规则正文写成表格墙；锚点与正文编号不一致
- CTA 位置：尾部 CTA 卡或步骤卡内按钮
- 响应式：xs 统一改单列，不改变条目顺序

### 15.3 阅读页注意力路径

- 页面目的 -> 目录/自查 -> 正文分段 -> FAQ 或快捷入口 -> 下一步页面

### 15.4 复用与页面特有边界

- 可复用：Reading Intro、Directory Aside、Tail FAQ Or Quick Routes
- 页面特有：/rules 的规则条目流；/guide 的步骤卡流

## 16. 实例 H：我的主页与申请记录 /my 与 /my/claims

页面名称：我的主页与申请记录
路由：/my；/my/claims；/my/team；/my/invitations
页面类型：operation
页面目标：把账号身份、选手申请、个人门面、邀请收件箱、战队工作台和申请历史收进明确的操作路径
唯一主 CTA：去申请成为选手 或 返回身份中心
次 CTA：查看代表比赛 / 浏览选手 / 打开队伍工作台
用户状态：游客；已登录未申请；申请中；已关联选手；已关联且为队长或现役成员

数据关系约束：
- User 与 Player 分表管理；用户注册后不自动生成 Player
- 用户要成为选手，必须发起申请；审核通过后才会关联到既有 Player 或生成新的 Player
- 后台允许管理员手动创建未关联任何用户的 Player 档案，后续再决定是否与某个用户关联

### 16.1 布局总览表

| 区块顺序 | 区块名称 | 目标 | 布局模式 | 主视觉权重 | 组件 | 主动作 |
| --- | --- | --- | --- | --- | --- | --- |
| 1 | Identity Hero | 用一句话和阶段摘要讲清当前账号与选手身份状态 | 双核 Hero | A | 自定义 Hero / SurfaceCard | 去申请成为选手 |
| 2 | Quick Actions | 固定暴露下一步，而不是把用户扔进长页面 | 侧轨卡组 | B | SurfaceCard / Link | 打开下一步 |
| 3 | Identity Workspace | 承接账号、申请、选手关联、OpenDota 与代表比赛 | 8 + 4 或 10 + 4 | B | SurfaceCard / 业务面板 | 继续当前流程 |
| 4 | Claims History | 以 Tabs + 表格/卡片形式回看成为选手或关联选手档案的申请记录 | 工具条 + Table | B | SurfaceCard / Table / Link | 过滤状态 |
| 5 | Invitation Inbox | 承接收到的组队邀请与训练赛邀请 | Tabs + 单列邀请流 | B | SurfaceCard / Tabs / Button | 接受或拒绝邀请 |
| 6 | Team Workspace | 以 detail 工作台处理阵容、招募和危险动作配置 | detail 双栏 | B | PageGrid / SurfaceCard / 表单面板 | 维护队伍 |

### 16.2 区块详细规格

区块 1：Identity Hero
- 目标：把“账号身份”和“选手身份”讲成一个明确阶段，而不是普通个人资料页头图
- 布局模式：双核 Hero，左侧门面与主动作，右侧人物门面与阶段统计
- 栅格占比：lg 8 + 4 + 2 侧信息，xs 单列
- 注意力权重：A
- 内容槽位：标题 1 行、摘要 2-4 行、状态胶囊 3-4 个、主次 CTA 2 个、阶段统计 4 项、账号/选手关系说明 1 组、英雄或昵称墙 0-8 个
- 允许组件：SurfaceCard / Button / Badge / HeroChip
- 允许变体：Button.primary=lg；SurfaceCard.tone=accent|default
- 禁止项：游客和已关联态共用同一套文案；把账号直接当成已存在选手档案；个人门面与阶段动作分离到两屏
- CTA 位置：主文案下方第一行
- 响应式：xs 主 CTA 保持第一屏可见，统计改 2 列或单列

区块 2：Claims History
- 目标：把“申请成为选手”或“申请关联既有选手档案”的状态切换、数据计数和历史记录放进统一工作台
- 布局模式：PageIntro + 统计条 + 状态筛选 + Table/Card 双形态
- 栅格占比：14 栏整宽
- 注意力权重：B
- 内容槽位：状态统计 4 项、Tabs 5 个、表头 6 列、移动卡片若干
- 允许组件：PageIntro / SurfaceCard / Table / Tabs / Link
- 允许变体：Table.selection=none；Tabs.style=segmented；SurfaceCard.tone=accent|muted
- 禁止项：状态过滤和结果计数分离；移动端仍强行保留完整表格；审核备注缺失说明
- CTA 位置：状态 Tabs、每行“查看目标选手”或“查看申请详情”
- 响应式：lg 使用 Table，xs 改卡片列表并保留状态过滤

区块 3：Invitation Inbox
- 目标：把组队邀请和训练赛邀请收进单独工作区，让用户能快速接受、拒绝或查看来源
- 布局模式：Tabs + 单列邀请流
- 栅格占比：14 栏整宽
- 注意力权重：B
- 内容槽位：邀请分类 Tabs 2-3 个、邀请卡若干、来源对象 1 组、接受/拒绝动作 2 个
- 允许组件：SurfaceCard / Tabs / Button / Link / Badge
- 允许变体：Tabs.style=segmented；Button.variant=primary|secondary；Badge.tone=info|warning
- 禁止项：邀请没有来源对象；接受和拒绝没有反馈；把邀请流混进申请历史表格
- CTA 位置：邀请卡底部动作区
- 响应式：xs 单列邀请卡，动作按钮纵向堆叠

区块 4：Team Workspace
- 目标：把阵容维护、招募配置和危险动作拆成主工作区与侧轨，而不是一个大表单
- 布局模式：PageGrid.detail，左主右辅
- 栅格占比：lg 8 + 4，xs 单列
- 注意力权重：B
- 内容槽位：身份摘要 2 卡、阵容统计 3 卡、阵容管理区 1 组、招募侧栏 1 组、危险动作 0-1 组
- 允许组件：PageIntro / PageGrid / SurfaceCard / Form Field / Dialog
- 允许变体：PageGrid.variant=detail；Dialog.purpose=confirm|preview|disband-team
- 禁止项：未登录或未认证态仍渲染完整工作台；招募区抢过阵容管理主位；解散队伍无二次确认
- CTA 位置：PageIntro 动作区和侧栏招募入口
- 响应式：xs 侧栏下沉到主工作区之后

### 16.3 我的页注意力路径

- 当前身份阶段 -> 下一步动作 -> 个人门面或绑定工作区 -> 申请历史 -> 邀请收件箱 -> 队伍工作台

### 16.4 复用与页面特有边界

- 可复用：Quick Actions、Claims History、Team Workspace
- 页面特有：Identity Hero

## 17. 实例 I：登录页 /login

页面名称：登录页
路由：/login
页面类型：operation
页面目标：在一屏内完成“为什么先登录”和“怎么登录”，并把已登录用户直接重定向回安全入口
唯一主 CTA：登录 / 注册
次 CTA：查看新手指引
用户状态：游客；已登录用户自动跳转

### 17.1 布局总览表

| 区块顺序 | 区块名称 | 目标 | 布局模式 | 主视觉权重 | 组件 | 主动作 |
| --- | --- | --- | --- | --- | --- | --- |
| 1 | Login Explain Panel | 用最少说明讲清登录后能做什么 | 6 + 8 | A | SurfaceCard / Link | 登录 / 注册 |
| 2 | Identity Account Panel | 处理真实账号输入和回跳路径 | 表单工作区 | A | IdentityAccountPanel | 提交账号 |
| 3 | Hint Cards | 用 3 条提示消化认知成本 | 单列卡组 | B | SurfaceCard | 去首页或指引 |

### 17.2 区块详细规格

区块 1：Login Explain Panel
- 目标：解释为什么这一页只处理账号，不再混入比赛或身份工作台信息
- 布局模式：左说明右表单
- 栅格占比：lg 6 + 8，xs 单列先说明后表单
- 注意力权重：A
- 内容槽位：标题 1 行、说明 2-3 行、提示卡 3 张、辅助 CTA 2 个
- 允许组件：SurfaceCard / Link / IdentityAccountPanel
- 允许变体：SurfaceCard.tone=default
- 禁止项：加入比赛、OpenDota、审核记录等二级内容；未登录页出现太多跳转目标
- CTA 位置：说明卡底部和表单提交按钮
- 响应式：xs 提示卡保持 3 张纵向堆叠

### 17.3 登录页注意力路径

- 为什么先登录 -> 提交账号 -> 成功回跳 -> 进入 /my 或 next 指定路径

### 17.4 复用与页面特有边界

- 可复用：Hint Cards
- 页面特有：Identity Account Panel 与 safe next redirect

## 18. 实例 J：后台首页 /admin

页面名称：后台首页
路由：/admin
页面类型：admin
页面目标：用最少装饰把今日最值得先点的审核、用户管理与选手档案管理模块推到第一层
唯一主 CTA：进入认领审核
次 CTA：查看全部待办
用户状态：管理员；编辑；审核者

后台数据约束：
- 用户表与选手表分开维护；用户管理、选手档案管理、申请审核必须视为三个相邻但不同的后台模块
- 后台允许先建立未关联用户的选手档案；待用户发起申请并审核通过后，再建立关联关系

### 18.1 布局总览表

| 区块顺序 | 区块名称 | 目标 | 布局模式 | 形状定义 | 拼接关系 | 主视觉权重 | 组件 | 主动作 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | Admin Intro With Metrics | 用一句话和指标条讲清今日重心 | 标题区 + 4 指标 | 顶部标题条块 + 下方 4 指标块组成工作台头部 | Module Entry Grid 从指标块共同底边起接；右侧摘要轨与后续待办右栏共线 | A | AdminPageIntro / AdminMetricGrid | 进入认领审核 |
| 2 | Module Entry Grid | 把后台模块收成低噪音入口矩阵 | 3 列卡组 | 3 列规则模块块组成矩阵带 | 顶边贴指标区底边；Priority Task List 从矩阵整体底边顺接 | B | Link 卡片 | 打开模块 |
| 3 | Priority Task List | 把优先处理的审核与数据项推到正文第一层 | 8 + 4 | 左侧待办长块，右侧摘要短柱块 | 顶边贴 Module Entry Grid 底边；右侧摘要柱与 Admin Summary Rail 合并成连续侧轨 | B | AdminListPanel / Link | 查看全部 |
| 4 | Admin Summary Rail | 右栏保留运营摘要和管理提示 | 4 栏侧轨 | 纵向摘要与提示块流 | 顶边接 Priority Task List 右栏；底部与后续后台工作页的侧轨语法保持一致 | C | AdminSidePanel | 无 |

### 18.2 区块详细规格

区块 1：Admin Intro With Metrics
- 目标：后台首页只讲今天最该处理什么，不承担品牌展示
- 布局模式：AdminPageIntro + MetricGrid
- 栅格占比：14 栏整宽
- 形状定义：顶部标题条块，下方 4 张规则指标块组成矩阵头部
- 拼接关系：指标区必须紧贴标题条底边；Module Entry Grid 从 4 指标共同底边顺接，不能穿插在指标之间
- 注意力权重：A
- 内容槽位：标题 1 行、说明 2 行、主 CTA 1 个、指标卡 4 张
- 允许组件：AdminPageIntro / AdminMetricGrid / AdminMetricCard / Button
- 允许变体：AdminMetricCard.tone=warning|info|default
- 禁止项：庆典式 Hero；背景插画；多个竞逐主动作
- CTA 位置：右上动作区
- 响应式：xs 指标卡变 2 列或单列

区块 2：Module Entry Grid
- 目标：把后台模块整理成低噪音、可快速进入的入口矩阵
- 布局模式：3 列卡组
- 栅格占比：14 栏整宽
- 形状定义：3 列规则模块块组成矩阵带，首列和末列可有半档高度差，但语法一致
- 拼接关系：顶边贴 Admin Intro With Metrics 底边；Priority Task List 从矩阵整体底边顺接，不允许中间再插提示条
- 注意力权重：B
- 内容槽位：模块卡 6-9 张、状态数值 0-2 项、整卡入口
- 允许组件：Link Card / SurfaceCard / Badge
- 允许变体：SurfaceCard.tone=default|muted；Badge.tone=info|warning
- 禁止项：模块卡做成庆典色块；模块矩阵无分组节奏；把待办直接混入模块卡里
- CTA 位置：整卡可点击
- 响应式：xs 改为单列或双列模块带

区块 2：Priority Task List
- 目标：把审核和高优先数据项直接列出，不让用户再进模块找一遍
- 布局模式：8 + 4，左列表右摘要
- 栅格占比：lg 8 + 4，xs 单列
- 形状定义：左侧待办长块，右侧运营摘要短柱块
- 拼接关系：顶边贴 Module Entry Grid 底边；右侧摘要块与 Admin Summary Rail 连成连续侧轨；底边作为后台首页最后一条主要收口线
- 注意力权重：B
区块 4：Admin Summary Rail
- 目标：在右栏保留简短的运营提示和管理摘要，但不抢待办主位
- 布局模式：4 栏侧轨
- 栅格占比：lg 4，xs 下沉到待办列表之后
- 形状定义：纵向摘要与提示块流，首块略高于后续提示块
- 拼接关系：顶边顺接 Priority Task List 右栏；xs 下沉时必须整体放在待办列表后，不拆散插入中间
- 注意力权重：C
- 内容槽位：摘要 2-3 项、提示卡 1-2 张、轻入口 0-2 个
- 允许组件：AdminSidePanel / SurfaceCard / Link / Badge
- 允许变体：SurfaceCard.tone=muted|default；Badge.tone=info|warning
- 禁止项：右栏比左待办更重；摘要区变成第二个模块矩阵；空态无说明
- CTA 位置：提示卡底部或整卡点击
- 响应式：xs 整组下沉到待办之后
- 内容槽位：待办 0-5 条、查看全部按钮 1 个、运营摘要 3 项、提示卡 1 条
- 允许组件：AdminListPanel / AdminSidePanel / Badge / Link
- 允许变体：Badge.tone=warning|info；AdminSidePanel.state=default
- 禁止项：待办列表缺对象与状态；右栏比左栏更重；空态无转向建议
- CTA 位置：列表标题右侧和每行整卡点击
- 响应式：xs 摘要区下沉到待办列表之后

### 18.3 后台首页注意力路径

- 今日重心 -> 四项指标 -> 模块入口 -> 优先待办 -> 运营摘要

### 18.4 复用与页面特有边界

- 可复用：Module Entry Grid、Priority Task List
- 页面特有：Admin Intro With Metrics

## 19. 实例 K：赛季详情与比赛详情 /matches/seasons/[slug] 与 /matches/[slug]

页面名称：赛季详情与比赛详情
路由：/matches/seasons/[slug]；/matches/[slug]
页面类型：detail
页面目标：先讲清赛季或当前对阵的状态，再把 Battle Cup 风格淘汰赛对阵图、阶段说明和关联对象按主次展开
唯一主 CTA：查看关键比赛或返回赛季上下文
次 CTA：查看赛季结算 / 返回比赛中心 / 查看海报页
用户状态：游客；已登录用户；归档阅读用户

### 19.1 布局总览表

| 区块顺序 | 区块名称 | 目标 | 布局模式 | 主视觉权重 | 组件 | 主动作 |
| --- | --- | --- | --- | --- | --- | --- |
| 1 | Season Or Match DetailHero | 在首屏讲清赛季世界观或当前对阵状态 | 12 栏详情头图 | A | DetailHero / SurfaceCard / TeamMark | 查看赛季结算或赛季上下文 |
| 2 | DetailStatGrid | 用 4 项摘要建立读图顺序 | 4 卡横排 | B | DetailStatGrid / SurfaceCard | 无 |
| 3 | Main Narrative Stack | 用整宽主叙事承接淘汰赛对阵图、阶段说明和当前对阵上下文 | 12 栏主分组流 | B | PageGrid(detail) / SurfaceCard / MatchSeasonGraphView | 查看具体比赛 |
| 4 | Post Match Relay | 把参赛队伍、海报页和下一步入口收束到页尾 | 12 栏回流流 | C | SurfaceCard / Link / Badge | 查看海报页 |

### 19.2 区块详细规格

区块 1：Season Or Match DetailHero
- 目标：赛季页讲清赛制和阶段；比赛页讲清谁打谁、比分和上下游
- 布局模式：12 栏整宽详情头图
- 栅格占比：12 栏整宽
- 注意力权重：A
- 内容槽位：eyebrow 1 行、标题 1-2 行、描述 2-4 行、meta 3-4 项、动作 1-2 个、摘要卡 1-2 张
- 允许组件：DetailHero / SurfaceCard / TeamMark / PlayerAvatar / Link
- 允许变体：DetailHero.tone=brand；SurfaceCard.tone=default|muted|accent
- 禁止项：赛程图谱直接进 Hero；Accordion 抢头图权重；在详情页继续堆第二块舞台背景；用 4 栏关系轨切开头图与主赛程
- CTA 位置：左侧动作区第一位，比赛页优先“查看赛季上下文”，赛季页优先“查看焦点比赛”
- 响应式：xs 摘要卡下沉到描述之后，动作区仍保留在首屏

区块 2：Main Narrative Stack
- 目标：按“淘汰赛对阵图 -> 当前对阵或阶段说明 -> 参赛对象与回流”的顺序推进，不让读者在中段失去上下文
- 布局模式：PageGrid(detail) 单列主叙事堆叠
- 栅格占比：12 栏整宽
- 注意力权重：B
- 内容槽位：主体区块 3-4 个，每块标题 1 行、说明 2-3 行、内容卡若干
- 允许组件：SurfaceCard / MatchSeasonGraphView / PlayerAvatar / TeamMark / Link / Badge
- 允许变体：SurfaceCard.tone=default|muted；PageGrid.variant=detail
- 禁止项：把“第 1 场、第 2 场”线性列表当主体；单局列表成为第二主视觉；内容页或战报回流早于对阵图和阶段说明；再加 4 栏关系卡插入主叙事流
- CTA 位置：每块尾部整卡跳转或标题右侧轻链接
- 响应式：xs 改为单列堆叠，顺序固定为对阵图在前、阶段说明在后、回流内容最后

对阵图约束：
- 默认参考 Dota 2 勇士联赛 8 支队伍单败淘汰样式
- 轮次顺序固定为 8 进 4 -> 半决赛 -> 决赛
- 当前轮次与已完赛结果需在对阵图中直接可读，不依赖右侧补充说明

### 19.3 详情页注意力路径

- Hero 状态 -> 4 项摘要 -> 淘汰赛对阵图 -> 当前对阵或阶段说明 -> 焦点对象与海报页回流

### 19.4 复用与页面特有边界

- 可复用：Season Or Match DetailHero、DetailStatGrid、Post Match Relay
- 页面特有：Battle Cup 风格淘汰赛对阵图、当前对阵摘要块

## 20. 实例 L：选手详情与战队详情 /players/[slug] 与 /teams/[slug]

页面名称：人物详情与战队详情
路由：/players/[slug]；/teams/[slug]
页面类型：detail
页面目标：把对象从数据库记录转成社区人物或社区战队，并把比赛、内容、身份关系按秩序展开
唯一主 CTA：查看代表比赛或所属战队
次 CTA：返回频道页 / 查看招募 / 申请成为选手
用户状态：游客；已登录未申请；申请中；已关联选手用户；队伍成员

### 20.1 布局总览表

| 区块顺序 | 区块名称 | 目标 | 布局模式 | 主视觉权重 | 组件 | 主动作 |
| --- | --- | --- | --- | --- | --- | --- |
| 1 | Person Or Team Hero | 建立人物或战队门面，先让用户记住对象 | DetailHero + 侧卡 | A | DetailHero / PlayerAvatar / TeamMark / Button | 查看代表比赛 |
| 2 | Chip Nav Or Summary Stats | 让长页面可快速定位，同时建立摘要感 | 锚点条或 3 卡摘要 | B | Link / SurfaceCard | 跳到区块 |
| 3 | Profile And Capability Stack | 展开资料、英雄池、阵容、互评和荣誉 | 双列或纵向分段 | B | SurfaceCard / HeroChip / PlayerAvatar / TeamMark | 查看更多对象 |
| 4 | Match Relay | 把代表比赛和关联对象放到人物叙事之后 | 6 + 6 或上下堆叠 | B | SurfaceCard / Link / Badge | 查看比赛或战队 |
| 5 | Identity Or Recruitment Aside | 把选手申请动作、招募状态或浏览建议放到侧栏 | 4 栏侧轨 | C | SurfaceCard / Button / Link | 发起申请或查看招募 |

### 20.2 区块详细规格

区块 1：Person Or Team Hero
- 目标：左侧建立人物或战队第一印象，右侧只放选手申请、浏览建议或当前招募
- 布局模式：8 + 4 详情头图
- 栅格占比：lg 8 + 4，xs 单列
- 注意力权重：A
- 内容槽位：主视觉对象 1 个、简介 2-4 行、chips 3-5 个、actions 1-2 个、stats 4-5 项、侧卡 1-2 张
- 允许组件：DetailHero / PlayerAvatar / TeamMark / HeroChip / PlayerClaimAction / Button / Link
- 允许变体：DetailHero.tone=brand；Button.variant=solid|outline；SurfaceCard.tone=default|accent
- 禁止项：OpenDota 面板前置到首屏；整页只剩字段表；招募卡比人物门面更抢
- CTA 位置：主视觉动作区第一位
- 响应式：xs 顶部 chips 换行，侧卡下沉到摘要之后

区块 2：Profile And Capability Stack
- 目标：人物页按资料 -> 英雄池 -> 互评 -> 代表作；战队页按核心阵容 -> 全员名单 -> 战绩 -> 内容与招募
- 布局模式：双列或纵向分段
- 栅格占比：主区 14 栏或双列平分
- 注意力权重：B
- 内容槽位：每段标题 1 行、说明 1-2 行、卡片 0-8 张
- 允许组件：SurfaceCard / HeroChip / PlayerAvatar / TeamMark / Link / Badge
- 允许变体：SurfaceCard.tone=default|muted；HeroChip.size=sm|md
- 禁止项：所有信息混成单长页无锚点；无内容时整段消失导致结构断裂
- CTA 位置：每段标题右侧或整卡点击
- 响应式：xs 所有双列改单列，人物锚点条保留在首屏摘要之后

### 20.3 人物页与战队页注意力路径

- 门面对象 -> 关键标签与动作 -> 资料或阵容 -> 代表比赛 -> 关联对象回流 -> 申请或招募关系

### 20.4 复用与页面特有边界

- 可复用：DetailHero、Match Relay、Relationship Aside
- 页面特有：人物锚点导航、战队阵容墙、OpenDota 面板

## 21. 第二期详情页与目录页 Blueprint

- 社区详情页家族、英雄目录与 FAQ 的 Blueprint 实例统一见 15_phase-two-blueprints-and-specs.md。

## 23. 实例 O：后台列表页、编辑页与审核页家族 /admin/*

页面名称：后台工作页家族
路由：/admin/claims；/admin/players；/admin/teams；/admin/matches；/admin/seasons；/admin/claims/[id]
页面类型：admin
页面目标：保证后台操作从列表到编辑再到审核都维持统一秩序，避免每个模块重新发明版式
唯一主 CTA：新建对象或进入审核处理
次 CTA：导出、返回列表、查看预览
用户状态：管理员；编辑；审核者

### 23.1 布局总览表

| 区块顺序 | 区块名称 | 目标 | 布局模式 | 形状定义 | 拼接关系 | 主视觉权重 | 组件 | 主动作 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | AdminPageIntro | 讲清当前资源和今日任务 | 标题区 + 动作区 | 顶部资源标题条块 | 下方工作区必须贴边进入，不能插入装饰摘要 | A | AdminPageIntro | 新建或审核 |
| 2 | Filtered List Workspace | 列表页承接筛选、统计、表格和分页 | 工具条 + 列表 | 上工具条块 + 下表格长块 | 顶边贴 AdminPageIntro；Risk And Audit Footer 从整体底边收束 | B | AdminListPanel / Table / Badge | 查看对象 |
| 3 | Admin Workspace Split | 编辑页把表单放左、预览与说明放右 | 6 + 8 或 7 + 5 | 左主表单长块 + 右侧说明预览柱块 | 两块共顶线；Risk And Audit Footer 从两块共同最低边起接 | B | AdminWorkspace / AdminSidePanel / Form | 保存或发布 |
| 4 | Review Decision Rail | 审核页在主体之外保留状态、操作和审计记录 | 主叙事 + 风险侧栏 | 左主叙事块 + 右风险决策柱块 | 右决策柱贴主叙事侧边；底部必须接 Risk And Audit Footer | B | AdminSidePanel / Dialog / Badge | 通过或驳回 |
| 5 | Risk And Audit Footer | 高风险操作和历史记录始终在页底收束 | 双列 | 左风险块 + 右审计块的尾部收束组 | 只能从上方主要工作区共同最低边起接，不能悬空或提前插入 | C | AdminSidePanel / Table / Dialog | 下线、回滚、删除 |

### 23.2 区块详细规格

区块 1：Filtered List Workspace
- 目标：列表页统一为“摘要 -> 筛选 -> 表格/卡片 -> 分页”，不让模块各自发明结构
- 布局模式：标题区 + 工具条 + Table/Card 列表
- 栅格占比：14 栏整宽
- 形状定义：上方筛选工具条块，下方表格长块；必要时分页作为底部薄条收束
- 拼接关系：顶边贴 AdminPageIntro 底边；Risk And Audit Footer 只能从表格整体底边接出，不能在中段切进来
- 注意力权重：B

区块 2：Admin Workspace Split
- 目标：编辑页把主表单、预览说明和关系配置拆成主辅两块，避免单张超长表单
- 布局模式：6 + 8 或 7 + 5
- 栅格占比：lg 8 + 4 或 7 + 5，xs 单列
- 形状定义：左侧主表单长块，右侧预览与说明柱块
- 拼接关系：左右两块共顶线；底部共同接到 Risk And Audit Footer；右侧柱块不得插入左侧表单中段
- 注意力权重：B
- 内容槽位：表单字段若干、关系选择区 1-2 组、预览 1 组、发布设置 1 组
- 允许组件：AdminWorkspace / Form / AdminSidePanel / Dialog / Badge
- 允许变体：FormField.state=default|error|loading；Dialog.purpose=confirm|preview
- 禁止项：把审计记录混在表单主块中；右侧预览比左表单更重；危险操作提前出现在页面中段
- CTA 位置：表单底部和右侧发布设置卡底部
- 响应式：xs 单列顺序为表单 -> 预览与说明 -> 风险与审计


区块 3：Review Decision Rail
- 目标：审核页把对象叙事、审核动作和风险说明拆开，避免动作埋在长正文里
- 布局模式：主叙事 + 风险侧栏
- 栅格占比：lg 8 + 4，xs 单列
- 形状定义：左侧主叙事块，右侧风险决策柱块，右块顶部可做警示包角
- 拼接关系：右侧决策柱必须贴左叙事块侧边；底部直接接 Risk And Audit Footer；不能先出现页底风险区再回到主体
- 注意力权重：B
- 内容槽位：对象摘要 1 组、审核上下文 1 组、决策按钮 2 个、风险提示 1 组、审计摘要 1 组
- 允许组件：AdminSidePanel / Dialog / Badge / Button / SurfaceCard
- 允许变体：Badge.tone=warning|danger|info；Dialog.purpose=confirm
- 禁止项：通过和驳回按钮分散在两处；风险说明缺少明确对象；右栏完全脱离主体
- CTA 位置：右侧决策柱底部
- 响应式：xs 先主叙事，后决策柱，再 Risk And Audit Footer


区块 4：Risk And Audit Footer
- 目标：把高风险操作和历史记录稳定收束在页底，形成统一的后台尾部语义
- 布局模式：双列
- 栅格占比：14 栏整宽
- 形状定义：左风险块 + 右审计块的尾部收束组，左右高度可不同但底边应对齐
- 拼接关系：只能从上方主要工作区共同最低边起接；不得提前插入列表或表单中部
- 注意力权重：C
- 内容槽位：危险操作 1-3 个、确认说明 1 组、审计记录 3-10 条
- 允许组件：AdminSidePanel / Table / Dialog / Button / Badge
- 允许变体：Button.variant=danger|secondary；Table.density=compact
- 禁止项：危险操作无二次确认；审计记录单独漂浮成第三页；尾部重新起一个主视觉
- CTA 位置：风险块底部
- 响应式：xs 先风险块，后审计块，保持页底收束
- 内容槽位：说明 1 段、计数 1 个、筛选 2-5 组、批量动作 0-2 个、表格或卡片列表若干
- 允许组件：AdminListPanel / Table / Badge / Dialog / Link / Button
- 允许变体：Table.selection=none|multi；Badge.tone=warning|success|info|danger
- 禁止项：列表页直接混进编辑表单；状态只靠整行颜色表达；无空态转向
- CTA 位置：标题区右侧和表格行内
- 响应式：xs 表格退化为卡片列表，批量操作进入二级条

区块 2：Admin Workspace Split
- 目标：编辑页统一为左侧表单、右侧预览/说明/状态，不再每页换布局
- 布局模式：AdminWorkspace 双栏
- 栅格占比：lg 6 + 8 或 7 + 5，xs 单列
- 注意力权重：B
- 内容槽位：表单分区 3-8 块、侧栏说明卡 2-4 张、状态卡 1 张、风险卡 0-1 张
- 允许组件：AdminWorkspace / AdminSidePanel / Form Field / Dialog / Button
- 允许变体：FormField.state=default|error|loading；AdminSidePanel.layout=summary
- 禁止项：高风险操作塞进主表单区；预览信息重于编辑本体；没有保存后反馈
- CTA 位置：表单顶部或底部主按钮簇
- 响应式：xs 表单在前、侧栏在后，风险操作固定压到最底部

### 23.3 后台家族注意力路径

- 页面标题与动作 -> 筛选或表单主体 -> 状态与审计 -> 风险操作

### 23.4 复用与页面特有边界

- 可复用：Filtered List Workspace、Admin Workspace Split、Risk And Audit Footer
- 页面特有：认领审核决策卡、比赛模板生成、内容预览卡