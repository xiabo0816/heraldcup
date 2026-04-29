# 今晚就来社区 / Page Blueprint

## 1. 这份文档解决什么问题

- Page Brief 定义页面任务
- Page Blueprint 定义页面如何落成可执行布局
- 本文只保留页面级蓝图方法和真实实例；区块硬约束去 11_section-specs.md，组件合法变体去 13_component-variant-matrix.md

## 2. 哪些页面必须写 Blueprint

- 首页
- 所有频道页
- 所有详情页
- 我的主页与身份相关页
- 搜索弹层
- 所有后台首页、列表页、编辑页

可简化：纯阅读型静态页可以使用轻 Blueprint，但仍要写版心、区块顺序和响应式。

## 3. 每份 Blueprint 的最小字段

1. 页面名称、路由、页面类型
2. 页面目标、唯一主 CTA、关键用户状态
3. 页面版心或舞台边界
4. 区块顺序与注意力权重
5. 每个区块的布局模式、形状定义、拼接关系
6. 内容槽位、允许组件、允许变体
7. 主 CTA 位置与禁止项
8. xs、md、lg 响应式重排与 promptframe

## 4. 标准骨架

### 页面头部

- 页面名称
- 路由
- 页面类型：home | channel | reading | detail | operation | admin
- 页面目标
- 唯一主 CTA
- 次 CTA
- 用户状态
- 页面版心或舞台边界

### 布局总览表

| 区块顺序 | 区块名称 | 目标 | 布局模式 | 形状定义 | 拼接关系 | 主视觉权重 | 组件 | 主动作 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |

### 区块详细规格

- 区块名称
- 区块目标
- 布局模式与栅格占比
- 形状定义与拼接关系
- 内容槽位
- 允许组件与允许变体
- 禁止项
- CTA 位置
- 响应式变化
- Promptframe

## 5. 页面类型基线

### 首页

- 页面舞台边界：fluid
- 基线结构：3 + 6 + 3 首屏 -> 主内容续段 -> Footer
- 首页不参与对象页胶囊二级导航

### 频道页

- 页面版心：1240
- 主副栏优先使用左 8 / 右 4
- /matches、/players、/teams 的首屏固定为顶部对象入口 -> 胶囊二级导航 -> 可选 Banner -> 主区
- /matches、/players、/teams 的顶部导航之后不允许再起独立题头；“比赛工作台 / 选手目录 / 战队目录”只能是主区标题，不是导航层级
- “全部”态无 Banner；具体杯赛态允许 1 个 Banner，且二级导航以下只切入当前杯赛的模块强调层，页面基础背景、卡片底、边框和正文文字仍跟随 Radiant / Dire
- 在对象频道之间横向跳转时默认保留当前范围

### 阅读页

- 页面版心：reading-shell 1240，正文 760
- 基线结构：题头块 -> 摘要块 -> 正文流 -> 目录或关系块 -> 文末推荐 -> Footer

### 详情页

- 页面版心：1240
- 基线结构：DetailHero -> 状态摘要 -> 8 + 4 主副栏 -> 尾部回流 -> Footer
- 至少保留 1 个横向大块和 1 个竖向块面形成错位

### 后台页

- 页面版心：1240
- 基线结构：标题区 -> 工具条 -> 主工作区 -> 状态配置 -> 风险操作 -> 审计记录
- 后台块面差异主要靠留白、边框、弱底色和高度变化建立，不依赖强品牌色

### 配色执行基线

- 所有 Blueprint 默认先确定当前页面使用 Radiant 还是 Dire，再决定是否局部引入杯赛色
- 先锋杯 Banner 主色固定为 `#236D5C`，渐变为 `#163F36 -> #236D5C -> #2E8C77`
- 传奇杯 Banner 主色固定为 `#563880`，渐变为 `#34214F -> #563880 -> #6D4AA1`
- 冠绝杯 Banner 主色固定为 `#853454`，渐变为 `#552137 -> #853454 -> #A24569`
- `currentScope=crown` 在页面结构层仍表示冠绝杯；视觉 token 可映射到 `cup-immortal` 命名
- 默认主 CTA 跟随当前主题 `--primary`；只有 Banner 内部或杯赛专题块中的模块 CTA 才切换到对应杯赛按钮色
- 凡写“当前杯赛主色”“当前杯赛主题色”，都指上述三组 Banner 色，而不是让杯赛色接管正文区背景

## 6. Promptframe 底线

- 说明生成目标、长度上限、语气、允许元素和禁止项
- 禁止生成第二主 CTA、伪造数据、无来源引用或与页面任务无关的装饰内容

## 7. Blueprint 验收清单

- 是否只有一个主重块
- 是否写清区块顺序和注意力路径
- 是否定义布局模式、形状和拼接关系
- 是否写清主 CTA 的位置和唯一性
- 是否给出允许组件与允许变体
- 是否给出 xs、md、lg 的重排规则
- 是否附带 promptframe 约束
- 是否定义 Footer 的收束关系

## 8. 实例前说明

- 下面从真实页面实例开始，优先复用实例，不重新发明同页家族结构
- 第二期实例统一收口到 16_phase-two-features.md

## 9. 实例 A：首页 /

页面名称：Herald Cup 首页
路由：/
页面类型：home
页面目标：用固定的左 3 / 中 6 / 右 3 首屏结构，把首页做成“比赛、人物、战队、身份”四条稳定主线的入口门户
唯一主 CTA：进入比赛中心
次 CTA：查看人物档案 / 查看战队名册 / 进入我的主页
用户状态：游客；已登录未成为选手；已成为选手用户
页面舞台边界：fluid

推荐首页首屏运营文案：

- 主标题：Herald Cup 把比赛、人物、战队和身份放回同一条主线
- 主描述：先看当前赛季与焦点对阵，再进入人物档案和战队名册；登录后继续完成认领、建队与邀请处理。
- 主 CTA：进入比赛中心
- 次 CTA：查看人物档案 / 查看战队名册
- 左栏四入口：比赛中心 / 人物档案 / 战队名册 / 身份链路
- 中栏五卡顺序：Herald Cup 主线摘要 / 当前赛季与焦点对阵 / 认证选手与代表比赛 / 活跃阵容与当前归属 / 从登录到上场的下一步
- 右栏标题：登录后继续你的身份进度 / 某某的身份进度

### 9.1 布局总览表

| 区块顺序 | 区块名称 | 目标 | 布局模式 | 形状定义 | 拼接关系 | 主视觉权重 | 组件 | 主动作 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | Left Rail Navigation | 把比赛中心、人物档案、战队名册、身份链路收进固定入口侧轨 | 左侧收窄内容入口侧轨 | 4 个纵向轻按钮，偏直角 | 与中栏共顶线；固定贴左侧起线；与中栏保持稳定 gutter；页面下滚后左栏保持 sticky；不再额外包外层边框 | B | Link / Button | 跳到中栏对应模块 |
| 2 | Center Content Stack | 承接首页主内容主体 | 中间 6 栏纵向主内容流 | 中栏由 5 张顺排卡组成：第 1 张为平台定位与主 CTA，第 2 到第 5 张分别对应比赛中心、人物档案、战队名册、身份链路 | 与左右侧轨共顶线；5 张卡在同一条中轴中连续展开；左右侧轨不得插入中栏主体 | A | SectionIntro / SurfaceCard / MatchCard / PlayerCard / TeamCard / Button | 查看内容详情 |
| 3 | Right Rail Identity | 右侧固定承担登录引导或登录后身份进度 | 右侧身份轨 | 4 个纵向模块从上到下平铺，每行 1 个；登录前后都保持四段结构 | 与中栏共顶线；固定贴右侧起线；与中栏保持稳定 gutter；桌面端滚动时保持 sticky，只让中栏主轴继续滚动 | B | SurfaceCard / Button / Badge | 登录或进入我的主页 |

### 9.2 区块详细规格

区块 1：Left Rail Navigation
- 目标：让左栏成为首页稳定内容入口侧轨，而不是一组临时资讯卡
- 布局模式：左侧收窄纵向内容入口侧轨
- 栅格占比：lg 2 到 2.5，md 4，xs 14
- 形状定义：4 个纵向轻按钮，分别对应比赛中心、人物档案、战队名册、身份链路；整体接近按钮列而不是信息卡堆叠
- 拼接关系：固定贴左边界；与中栏保持连续 gutter；各按钮用统一节奏竖向堆叠；页面下滚后维持 sticky，不做异形插接；左栏自身不再额外包一层重复外框
- 注意力权重：B
- 内容槽位：按钮名 1 行
- 允许组件：Link / Button / SectionIntro
- 允许变体：Button.variant=ghost|secondary
- 禁止项：把左栏写成第二内容流；入口项没有明确去向；把左栏误写成全站一级导航；把四项写成独立页面跳转；给按钮补长说明或统计数字；同时保留外层框和内层按钮框制造双重边界；所有块都做大圆角
- CTA 位置：整按钮点击
- 响应式：md 保留为顶部轻入口条；xs 固定排在中栏主体之前
- Promptframe：

```text
区块：Left Rail Navigation
生成目标：用左侧更窄的固定入口侧轨告诉用户首页中栏会看到哪四个模块
入口项：比赛中心、人物档案、战队名册、身份链路
每项内容：只保留名称 1 个
交互：点击后滚动到首页中栏对应模块；页面下滚后侧轨保持固定，不承担详情内容本身
禁止：不要把左栏写成资讯摘要，不要在左栏重复中栏详细数据，不要附加说明副文案，不要再包一层重复外框
```

区块 2：Center Content Stack
- 目标：把首页主要内容稳定放在中间 6 栏；中部固定为 5 张顺排卡，先用平台定位卡讲清主 CTA，再固定收敛为比赛中心、人物档案、战队名册、身份链路四个明确模块
- 布局模式：中间 6 栏纵向主内容流
- 栅格占比：lg 6，md 8，xs 14
- 形状定义：中栏为 5 张单列顺排卡；首卡承担唯一主重摘要，后面 4 张分别承担比赛中心、人物档案、战队名册、身份链路；5 张卡都独立成块，保持统一留缝和标题条，不额外再起第二舞台
- 拼接关系：与左右侧轨共顶线；5 张卡在同一条中轴里连续展开；首卡不再作为后续 4 张模块卡的外层容器；左右栏可延续但不得插入中栏主体
- 注意力权重：A
- 内容槽位：
	- 顶部摘要：标题 1-2 行、主摘要 2-4 行、主 CTA 1 个、次 CTA 1-2 个
	- 比赛中心：从比赛库读取 1-多条比赛摘要，展示当前赛季、对阵双方、状态和结果，不展示完整赛程表
	- 人物档案：从选手库读取 1-多条人物摘要，展示名称、位置、当前归属与代表比赛，不展示完整档案
	- 战队名册：从战队库读取 1-多条战队摘要，展示战队名、当前杯赛归属、近期成绩或简介，不展示完整阵容表
	- 身份链路：用 2 到 4 条短步骤讲清登录、认领、建队与邀请的先后关系，并提供明确入口
- 允许组件：SectionIntro / SurfaceCard / MatchCard / PlayerCard / TeamCard / Button / Badge
- 允许变体：SurfaceCard.tone=default|accent；Button.secondary=md；Badge.tone=brand|info
- 禁止项：把中栏切成多个平级主舞台；把右栏身份摘要整块搬进中栏；在首页展示比赛赛程表；在首页展示选手完整档案；在首页展示完整战队阵容表
- CTA 位置：首卡放主 CTA 与次 CTA；其余每个分段标题右侧或卡片底部
- 响应式：桌面端到 xs 都保持单列主内容流，仍保留“比赛中心 -> 人物档案 -> 战队名册 -> 身份链路”顺序
- Promptframe：

```text
区块：Center Content Stack
生成目标：用一张平台定位卡加四个连续模块卡，把首页中栏写成稳定内容主轴
模块顺序：平台定位 -> 比赛中心 -> 人物档案 -> 战队名册 -> 身份链路
平台定位：独立成第 1 张卡，负责承接 Herald Cup 主标题、主描述、主 CTA 与次 CTA；不要把后续模块包进同一张大卡
比赛中心：读取 1 到多条比赛摘要；每条必须包含当前赛季、对阵双方、状态与结果；禁止展示完整赛程表；点击进入比赛详情
人物档案：读取 1 到多条人物摘要；每条必须包含名称、位置、当前归属和代表比赛；禁止展示完整人物档案；点击进入人物详情
战队名册：读取 1 到多条战队摘要；每条必须包含战队名称、当前杯赛归属和近期成绩或简介；禁止展示完整阵容表；点击进入战队详情
身份链路：说明登录、认领、建队、邀请的先后关系；每条动作必须能落到登录、我的主页或指引页
语气：信息化、清楚、不过度宣传
禁止：不要伪造完整赛程，不要伪造选手全量数据，不要伪造完整战队阵容，不要把身份链路写成空泛口号，不要把四个模块重新包回平台定位卡内部
```

区块 3：Right Rail Identity
- 目标：右栏固定承担登录引导、登录后的身份进度，以及已成为选手后的个人入口，不再和主内容抢戏
- 布局模式：右侧纵向身份轨
- 栅格占比：lg 3 到 3.5，md 4，xs 14
- 形状定义：固定为 4 个纵向模块从上到下平铺，每行 1 个模块；登录前后都只替换模块内容，不改四段骨架
- 拼接关系：固定贴右边界；与中栏保持连续 gutter；4 个模块纵向等节奏堆叠，不能再包成单一总卡片，也不能扩展成第二内容流；桌面端页面滚动时右栏保持 sticky，对齐左栏的固定节奏
- 注意力权重：B
- 内容槽位：
	- 登录前：身份提示、浏览提示、链路提示、登录动作
	- 登录后未成为选手：账号摘要、认领进度、队伍与邀请摘要、个人入口
	- 登录后已成为选手：账号摘要、认领进度、队伍与邀请摘要、个人入口
- 允许组件：SurfaceCard / Button / Badge / Link
- 允许变体：SurfaceCard.tone=accent|default；Button.primary=md
- 禁止项：右栏放第二内容流；右栏脱离身份和个人数据主题；切角样式；用 OpenDota 数据块替代身份主位
- CTA 位置：第 4 模块底部
- 响应式：xs 固定排在中栏主体之后，状态块改为顺序堆叠
- Promptframe：

```text
区块：Right Rail Identity
生成目标：用右侧身份轨区分登录前、登录后、已成为选手三种状态，并保持四段纵向模块骨架
登录前：显示身份提示、浏览提示、链路提示与进入登录页动作
登录后：显示账号、认领、队伍与邀请摘要，并给出个人入口
已成为选手：保持四段结构，最后一段给个人页或队伍入口
语气：直接、信息化、不要喊口号
禁止：不要把右栏写成广告区，不要用数据卡取代身份主位，不要在未成为选手时伪造队伍管理信息，不要把四段再包成单一大卡
```

### 9.3 首页注意力路径

- 游客态：左栏内容入口侧轨 -> 中栏内容主体 -> 右栏登录引导
- 登录态：左栏内容入口侧轨 -> 中栏内容主体 -> 右栏身份进度
- 已成为选手态：左栏内容入口侧轨 -> 中栏内容主体 -> 右栏身份进度 -> 右栏个人入口

### 9.4 复用与页面特有边界

- 可复用：Left Rail Navigation、Right Rail Identity
- 页面特有：Center Content Stack

## 10. 实例 B：比赛总览 /matches

页面名称：比赛中心
页面顶栏：全宽导航
路由：/matches
页面类型：channel
页面目标：把比赛页收口为“顶部对象入口 + 胶囊二级导航 + 杯赛 Banner + 8/4 比赛工作台”的统一入口，让用户只在这里处理赛程、赛季和比赛结果
首屏层级：顶部导航 -> 胶囊二级导航 -> Banner（仅 pioneer / legend / crown，可选） -> Match Workspace + Match Range Rail
PageIntro 使用规则：all 态不单独生成 PageIntro；pioneer / legend / crown 态如需 PageIntro，只能把它放进唯一 Banner 内部；“比赛工作台”作为 Match Workspace 内部标题出现，不得单独顶在胶囊二级导航之前
唯一主 CTA：查看当前赛程主线
次 CTA：查看赛季详情 / 切换范围 / 去选手频道 / 去战队频道
用户状态：游客；普通用户；已是选手；队长

页面版心或舞台边界：1240

### 10.1 布局总览表

| 区块顺序 | 区块名称 | 目标 | 布局模式 | 形状定义 | 拼接关系 | 主视觉权重 | 组件 | 主动作 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | 胶囊二级导航 | 作为比赛页首屏二级导航，建立“全部 / 先锋杯 / 传奇杯 / 冠绝杯”的范围认知，并完成范围切换 | 顶栏下方导航行 | 4 个固定顺序的胶囊按钮组成一行次导航 | 紧接顶部导航下方；“全部”态直接接工作台，某杯态下方可接 Banner | A | Tabs / Badge / SurfaceCard | 切换范围 |
| 2 | Banner | 仅在具体杯赛态承接当前杯赛摘要、焦点赛程或资格说明 | 12 栏轻 Banner | 横向摘要块或轻双块拼接，禁止做成首页 Hero | 顶边贴胶囊二级导航；仅在 pioneer/legend/crown 出现；底边接 Match Workspace | B | SurfaceCard / Badge / Link | 打开当前杯赛内容 |
| 3 | Match Workspace | 在左 8 栏只浏览当前范围下的赛季、赛程、阶段和结果入口 | 8 栏主工作台 | 整块比赛工作台，顶部为工具条，中段为赛季与赛程对象流，底部为轻回流 | 与右侧 Match Range Rail 共顶线；桌面端左侧滚动、右侧固定 | B | Input / SurfaceCard / MatchRow / SeasonCard / Badge | 打开比赛或赛季详情 |
| 4 | Match Range Rail | 在右 4 栏说明当前杯赛、当前身份和跨对象跳转入口 | 4 栏固定侧轨 | 纵向状态卡与资格卡堆叠；按游客/用户/选手/队长切换动作，但不在此页直接承载选手/战队目录动作 | 顶边与 Match Workspace 共顶线；底边与工作台最低边共同收口 | B | IdentityPanel / SurfaceCard / Button / Link / Badge | 成为选手 / 建立队伍 / 去对应杯赛选手池 |
| 5 | Workspace Relay | 收束到海报页、历史赛季与跨频道回流 | 12 栏单列轻卡流 | 尾部短块流，收束而不重起舞台 | 从 Match Workspace 与 Match Range Rail 的共同底边顺接 | C | SurfaceCard / Link | 去海报页或其他频道 |

### 10.2 区块详细规格

区块 1：胶囊二级导航
- 目标：让用户一眼知道当前在看哪个范围，并把二级导航做成与 community 一致的胶囊按钮行，而不是后台筛选条
- 布局模式：主区顶部导航行
- 栅格占比：12 栏整宽
- 形状定义：4 个固定顺序的胶囊按钮组成一行次导航；按钮不再等宽拼成整条范围带
- 拼接关系：紧接顶部导航下方；二级导航之后在“全部”态直接接 Match Workspace，某杯态由 Banner 承接头部摘要后进入 Match Workspace
- 注意力权重：A
- 内容槽位：范围切换 4 个
- 允许组件：Tabs / Badge / SurfaceCard
- 允许变体：Tabs.style=segmented；Tabs.size=md；Tabs.tone=neutral|pioneer|legend|crown
- 禁止项：把二级导航做成细筛选器；把“全部”染成任一杯赛颜色；把按钮重新拼回整条等宽范围带
- CTA 位置：范围切换块本身承担切换
- 响应式：xs 允许换行，但必须保留“全部 / 先锋杯 / 传奇杯 / 冠绝杯”四项
- 尺寸规格：二级导航共享 1240 版心；桌面端按钮高度建议 36 到 44；xs 端降为 32 到 40
- 入口规格：4 个范围按钮按文案自适应宽度；按钮之间保留稳定 gap，不做无外部间距拼接
- 外观规格：不再使用整条二级导航外框；单按钮保留 1px outline，当前态按钮使用 elevation-2 到 elevation-3 的局部抬升
- 颜色规格：4 个按钮分别拥有独立 default / hover / active 色板；全部使用 neutral surface 系列，先锋杯使用 `#236D5C` 系列三态色板，传奇杯使用 `#563880` 系列三态色板，冠绝杯使用 `#853454` 系列三态色板，必要时在实现层映射到 `cup-immortal` token

比赛页首屏推荐落地方案：

- 顶部导航：高度 68，全宽，深一层背景，承担全站主导航身份
- 二级导航：按钮高度 40，位于频道主区顶部，使用 1240 版心对齐；4 个按钮按内容自适应宽度，用 gap 组织
- 全部态：4 个按钮仍保持各自范围色系；“全部”按钮作为当前态拥有最强中性高亮，其余三个杯赛按钮显示各自低强度默认底色，确保用户在未切换前也能一眼区分范围
- 具体杯赛态：当前杯赛按钮切到对应杯赛 Banner 色；Banner 作为头部摘要存在于二级导航之后；Banner 与二级导航之间保持短过渡
- 正文起始：无 Banner 时，Match Workspace 顶边距二级导航 24；有 Banner 时，Match Workspace 顶边直接接 Banner 底边
- 右栏：Match Range Rail 顶线必须与正文主工作台齐平，不向上顶到二级导航处抢头部层级
- 一体化外观：顶部导航、胶囊二级导航、Banner、Match Workspace 首行共用 1240 壳层；顶部两层以直边贴合，Banner 到 Workspace 再转入统一外侧圆角
- 一体化色面：顶部导航保持最深中性色；二级导航为浅一层稳态面；Banner 只使用当前杯赛主色与对应渐变做轻强调，不把整块亮度抬到超过 Match Workspace 的主操作区
- 一体化边界：Banner 底边与 Match Workspace 顶边共用同一条分割逻辑；右侧 Match Range Rail 首卡顶线与 Match Workspace 顶线、Banner 结束线三者必须严格齐平

```text
区块：胶囊二级导航
生成目标：让用户一眼知道自己当前在比赛频道里看的是哪一个范围
范围数量：4 个，固定为全部 / 先锋杯 / 传奇杯 / 冠绝杯
语气：对象识别优先，不写营销口号
布局要求：胶囊二级导航必须是一行 community 风格的胶囊按钮；4 个按钮固定顺序、统一骨架，不再等宽并列
颜色规则：全部=neutral default / hover / active 三态；先锋杯=pioneer default / hover / active 三态；传奇杯=legend default / hover / active 三态；冠绝杯=crown default / hover / active 三态
禁止：不要做成第二条普通 Tabs，不要变成 Hero Banner，不要让四个范围长得完全一样
```

范围视觉节奏规则：
- 二级导航只负责切换范围，不承担复杂说明结构
- “全部”按钮使用深色中性语义；三个杯赛按钮从默认态开始就保留各自主题识别，只是强度显著低于当前态
- 范围切换只替换标题栏标题、副文案、统计和按钮强弱，不改变对象频道骨架
- 4 个按钮无论当前态如何切换都保持统一高度、shape.xl 和内边距；不做当前态单独放大
- 当前态与非当前态的层级差必须同时体现在背景、描边或投影中的至少两项，不允许只靠文字加粗表达
- 二级导航本身不承载统计块，统计仍放在正文首块或右栏
- “全部”态不显示任何杯赛 Banner；切换到具体杯赛态时才出现 Banner

区块 2：Banner
- 目标：只在具体杯赛态补充当前杯赛摘要，不把“全部”态硬塞成伪 Hero
- 布局模式：12 栏轻 Banner
- 栅格占比：12 栏整宽
- 形状定义：轻摘要横块或 8 + 4 轻拼接；视觉强度低于首页 Hero、高于普通工具条
- 拼接关系：顶边贴胶囊二级导航；仅在 pioneer / legend / crown 出现；底边直接接 Match Workspace
- 内容槽位：杯赛名 1 行、当前摘要 1 组、焦点入口 1 个、统计 0-2 项
- 允许组件：SurfaceCard / Badge / Link / Button
- 允许变体：SurfaceCard.tone=accent|default；Badge.tone=pioneer|legend|crown
- 禁止项：“全部”态显示 Banner；Banner 跑到二级导航上方；Banner 变成第二套导航；Banner 高于首页主舞台强度
- CTA 位置：标题右侧或卡片底部
- 响应式：xs 改为单列轻摘要块

比赛频道范围切换顺序图：

```text
all
顶部导航
-> 胶囊二级导航（全部当前态）
-> Match Workspace + Match Range Rail

pioneer / legend / crown
顶部导航
-> 胶囊二级导航（某杯当前态）
-> Banner
-> Match Workspace + Match Range Rail
```

区块 3：Match Workspace
- 目标：在左 8 栏工作台里只承接比赛对象本身，不再在比赛页混入选手和战队目录
- 布局模式：8 栏主工作台
- 栅格占比：lg 8，xs 14
- 形状定义：整块比赛工作台，顶部工具条，中段赛季卡与赛程行，底部历史回流
- 拼接关系：顶部贴 Banner 底边；若当前为“全部”态则直接贴胶囊二级导航底边；右侧与 Match Range Rail 保持固定 gutter；底部共同接 Workspace Relay
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
- 目标：在右 4 栏解释当前杯赛、当前身份和可去的下一步，而不是承载第二条比赛内容流
- 布局模式：4 栏 sticky 侧轨
- 栅格占比：lg 4，xs 下沉到主工作台之后
- 形状定义：杯赛状态卡 + 身份卡 + 跨频道入口卡堆叠
- 拼接关系：与 Match Workspace 共顶线，共同收口
- 注意力权重：B
- 内容槽位：杯赛状态 1 组，用户信息 1 组，选手信息 0-1 组，队伍信息 0-1 组，跨频道入口 1-2 个，动作按钮 1-2 个
- 允许组件：IdentityPanel / SurfaceCard / Button / Link / Badge
- 允许变体：Button.variant=primary|secondary；Badge.tone=neutral|pioneer|legend|crown
- 禁止项：右栏重复左侧赛程对象流；在比赛频道中直接暴露邀请入队或训练赛邀请；危险动作无确认链路
- CTA 位置：卡片底部
- 响应式：xs 下沉到主工作台后方，仍保持先范围后身份后动作

角色态约束：
- 游客：显示当前杯赛浏览说明、登录提示与“去指引”入口
- 普通用户：显示基本用户信息、当前杯赛浏览说明与“成为选手”入口
- 选手：显示基本用户信息、基本选手信息、对应杯赛资格说明与“建立队伍”入口
- 队长：显示基本用户信息、基本选手信息、基本队伍信息、对应杯赛资格说明与“去对应杯赛战队池”入口

区块 4：Workspace Relay
- 目标：收束到赛季上下文、海报页、历史赛季和跨频道回流
- 布局模式：12 栏轻卡流
- 栅格占比：12 栏整宽
- 形状定义：尾部短卡流
- 拼接关系：从 Match Workspace 与 Match Range Rail 的共同底边顺接
- 注意力权重：C
- 内容槽位：海报页入口 0-1 个、历史赛季入口 0-2 个、去对应杯赛选手池入口 0-1 个、去对应杯赛战队池入口 0-1 个
- 允许组件：SurfaceCard / Link / Badge
- 允许变体：SurfaceCard.tone=muted|default
- 禁止项：重起第二个主舞台；混入新闻或战报主线
- CTA 位置：整卡点击
- 响应式：xs 单列 3 到 4 张以内

### 10.3 比赛页注意力路径

- 二级导航 -> 条件性杯赛 Banner（仅某杯态）-> 当前杯赛赛季与赛程 -> 右侧身份与资格说明 -> 详情页或跨频道回流

### 10.4 复用与页面特有边界

- 可复用：胶囊二级导航、Workspace Relay
- 页面特有：Match Workspace、Match Range Rail

## 11. 实例 C：选手频道 /players

页面名称：选手频道
页面顶栏：全宽导航
路由：/players
页面类型：channel
页面目标：把选手页维持为展示页，并用“对象页面 + 胶囊二级导航 + Banner”明确区分全站选手目录与各杯选手池
首屏层级：顶部导航 -> 胶囊二级导航 -> Banner（选手变体，仅 pioneer / legend / crown，可选） -> Player Browser Workspace + My Identity Rail
PageIntro 使用规则：all 态不单独生成 PageIntro；pioneer / legend / crown 态允许在 Banner（选手变体）内部复用 PageIntro 结构；“选手目录”作为 Player Browser Workspace 内部标题出现，不得单独顶在胶囊二级导航之前
唯一主 CTA：打开人物页
次 CTA：切换范围 / 去申请成为选手 / 先看战队
用户状态：游客；普通用户；已是选手；队长
页面版心或舞台边界：1240

### 11.1 布局总览表

| 区块顺序 | 区块名称 | 目标 | 布局模式 | 形状定义 | 拼接关系 | 主视觉权重 | 组件 | 主动作 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | 胶囊二级导航 | 作为选手页首屏二级导航，建立“全部 / 先锋杯 / 传奇杯 / 冠绝杯”的范围认知，并完成范围切换 | 顶栏下方导航行 | 4 个固定顺序的胶囊按钮组成一行次导航 | 紧接顶部导航下方；“全部”态直接接 Player Browser Workspace；某杯态下方可先接 Banner（选手变体） | A | Tabs / Badge / SurfaceCard | 切换范围 |
| 2 | Banner（选手变体） | 仅在具体杯赛态突出当前杯池中的焦点人物；它就是选手页唯一 Banner | 12 栏轻 Banner | 横向人物摘要块或轻双块拼接，禁止做成首页 Hero | 顶边贴胶囊二级导航；仅在 pioneer/legend/crown 出现；底边接 Player Browser Workspace | B | SurfaceCard / Badge / Link | 打开人物页 |
| 3 | Player Browser Workspace | 承接筛选、焦点人物和当前范围内的主卡栅格 | 8 + 4 主副栏 | 左侧主工作台长块，顶部筛选条，底部人物网格 | 顶边贴胶囊二级导航或 Banner（选手变体）底边；右侧侧轨与 My Identity Rail、Quick Relations 连成连续竖轨 | B | PlayersBrowser / SurfaceCard | 打开人物页 |
| 4 | My Identity Rail | 在右栏固定保留角色态身份、对应杯赛资格说明和动作入口 | 4 栏侧轨 | 右侧第一张纵向状态块 | 顶部贴胶囊二级导航或 Banner（选手变体）底边；底部与 Quick Relations 直接顺延 | B | SurfaceCard / Button / Dialog Trigger | 成为选手 / 建立队伍 / 邀请入队 |
| 5 | Quick Relations | 保留高频人物入口与杯池关系摘要 | 4 栏侧轨 | 多张短柱人物关系块组成轻侧流 | 顶边贴 My Identity Rail 底边；底边与 Cross Flow 起始线对齐 | C | SurfaceCard / PlayerAvatar / Badge | 打开人物页 |
| 6 | Cross Flow | 把用户继续带到战队、比赛或当前范围规则 | 单列轻卡流 | 横向收束轻流块 | 从 Player Browser Workspace 整体底边起接，并与右侧 Quick Relations 最低边共同收口 | C | SurfaceCard / Button | 去战队或比赛 |

### 11.2 区块详细规格

区块 1：胶囊二级导航
- 目标：让用户先明白当前在看“全站选手目录”还是“某杯选手池”
- 布局模式：12 栏二级导航条
- 栅格占比：12 栏整宽
- 形状定义：4 个固定顺序的胶囊按钮组成一行次导航
- 拼接关系：紧接顶部导航下方；二级导航之后在“全部”态直接接 Player Browser Workspace；某杯态由 Banner（选手变体）承接头部摘要后进入 Player Browser Workspace
- 注意力权重：A
- 内容槽位：范围切换 4 个
- 允许组件：Tabs / Badge / SurfaceCard
- 允许变体：Tabs.style=segmented；Tabs.tone=neutral|pioneer|legend|crown
- 禁止项：用小 badge 代替二级导航；当前范围不改标题和统计；“全部”态出现 Banner
- CTA 位置：范围切换块本身承担切换
- 响应式：xs 允许换行，但必须完整保留四项

选手页首屏推荐落地方案：

- 顶部导航：高度 68，全宽，负责对象识别与工具入口，保持频道页首屏最深一级表面
- 二级导航：按钮高度 40，位于频道主区顶部，4 个按钮按内容自适应宽度；整行作为 1240 版心内的稳定次导航，不悬浮、不分离
- 全部态：不出现 Banner；Player Browser Workspace 顶边距二级导航 24；My Identity Rail 顶线与 Player Browser Workspace 顶线严格齐平
- 某杯态：二级导航当前按钮切到对应杯赛 Banner 色；Banner（选手变体）作为头部摘要存在于二级导航之后；Banner 与二级导航之间保持 12 到 20 的短过渡
- Banner 结构：推荐使用左 8 右 4 的一体化轻拼接。左侧放当前杯池标题、1 行范围说明、1 组轻统计；右侧放 1 张焦点选手卡。整块仍算 1 个 Banner，不拆成两段
- 一体化边界：顶部导航与二级导航用直边贴合；Banner 外轮廓与下方 Player Browser Workspace 共用同一组外侧圆角；My Identity Rail 首卡顶线与 Banner 结束线、主工作台顶线三者必须齐平
- 一体化色面：顶部导航保持最深中性色；二级导航为浅一层稳态面；Banner 只使用当前杯赛主色与对应渐变做轻强调，焦点人物卡允许比 Banner 背景略亮半级，但不得亮过正文里的主 CTA
- 焦点人物卡：头像或人物主图只允许 1 个；卡片高度建议 112 到 136；人物名、打法标签、英雄倾向压缩在 2 到 3 层信息内，不再另起第二个人物横幅
- 正文接力：Player Browser Workspace 顶部筛选条必须像从 Banner 底边自然长出来；避免 Banner 结束后再插一个大标题带，导致首屏断成两段
- 右栏节奏：My Identity Rail 首卡保留对应杯赛资格与动作入口，但不重复 Banner 的大标题与人物主图；右栏负责资格解释，不与 Banner 争主视觉

区块 2：Banner（选手变体）
- 目标：仅在具体杯赛态突出当前杯池人物，不让“全部”态凭空长出 Banner；它占用选手页首屏唯一 Banner 槽位
- 布局模式：12 栏轻 Banner
- 栅格占比：12 栏整宽
- 形状定义：横向人物摘要块或轻双块拼接
- 拼接关系：顶边贴胶囊二级导航；仅在 pioneer / legend / crown 出现；底边接 Player Browser Workspace
- 内容槽位：焦点人物 1 张、杯池摘要 1 组、CTA 1 个
- 允许组件：SurfaceCard / Badge / Link
- 允许变体：SurfaceCard.tone=accent|default
- 禁止项：“全部”态显示 Banner；Banner 跑到二级导航上方；同时突出多个人；做成首页 Hero；在正文首块再重复起第二个人物 Banner
- CTA 位置：卡片底部或标题右侧
- 响应式：xs 单列轻摘要块

区块 3：Player Browser Workspace
- 目标：让筛选、焦点人物和当前范围内的选手网格处于同一工作区，降低切换成本
- 布局模式：主栏单列工作台，包含 Filter Bar、Focus Players、Player Grid
- 栅格占比：lg 8，xs 14
- 形状定义：一个连续主工作台长块，顶部嵌入筛选条，中段是短横焦点带，底部是规则网格块
- 拼接关系：顶部贴胶囊二级导航或 Banner（选手变体）底边；右侧与侧轨留一条固定 gutter；桌面端主工作台负责滚动，右侧侧轨固定
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

区块 4：My Identity Rail
- 目标：在右栏先讲清账号身份，再说明对应杯赛里的资格状态和下一步动作
- 布局模式：4 栏 sticky 侧轨中的首卡
- 栅格占比：lg 4，xs 下沉到主工作区之后
- 形状定义：纵向状态短柱块，顶部做轻包角，底部保持平直
- 拼接关系：顶边贴胶囊二级导航或 Banner（选手变体）底边；底边紧接 Quick Relations 第一张卡
- 注意力权重：B
- 内容槽位：身份标题、状态说明 2-3 行、账号/选手关系标签 2-4 个、对应杯赛资格标签 0-2 个、CTA 1-2 个
- 允许组件：SurfaceCard / Button / HeroChip / Badge
- 允许变体：SurfaceCard.tone=default；Button.primary=md；Button.secondary=md
- 禁止项：把用户账号直接写成已是选手；无对应杯赛资格说明；队长邀请入口埋进正文
- CTA 位置：卡片底部
- 响应式：xs 放到主列表后，仍保持第一张侧栏卡顺序

角色态约束：
- 游客：只显示浏览说明或登录提示
- 普通用户：显示基本用户信息与“成为选手”入口
- 选手：显示基本用户信息、基本选手信息、对应杯赛资格说明与“建立队伍”入口
- 队长：显示基本用户信息、基本选手信息、基本队伍信息、对应杯赛资格说明与“邀请该选手入队”入口

区块 5：Quick Relations
- 目标：持续暴露高频人物入口和杯池关系摘要，减少回滚到顶部重新筛选的次数
- 布局模式：侧轨竖向轻卡流
- 栅格占比：lg 4，xs 单列 3 张以内
- 形状定义：竖向短块流，卡片高度统一，首卡可略高于后续两卡
- 拼接关系：必须直接顺延在 My Identity Rail 下方；桌面端与 My Identity Rail 共享固定右轨
- 注意力权重：C

区块 6：Cross Flow
- 目标：把用户从选手频道继续送去战队、比赛或对应杯赛规则入口
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

- 二级导航 -> Banner（选手变体，仅某杯态）-> 筛选工作台 -> 主卡栅格 -> 我的身份与资格 -> 跨页回流

### 11.4 选手页范围切换顺序图

```text
all
顶部导航
-> 胶囊二级导航（全部当前态）
-> Player Browser Workspace + My Identity Rail
-> Quick Relations
-> Cross Flow

pioneer / legend / crown
顶部导航
-> 胶囊二级导航（某杯当前态）
-> Banner（选手变体）
-> Player Browser Workspace + My Identity Rail
-> Quick Relations
-> Cross Flow
```

### 11.5 复用与页面特有边界

- 可复用：胶囊二级导航、Player Browser Workspace、My Identity Rail、Quick Relations
- 页面特有：选手池标签和资格摘要

## 12. 实例 D：战队频道 /teams

页面名称：战队频道
页面顶栏：全宽导航
路由：/teams
页面类型：channel
页面目标：把战队页维持为“战队对象目录 + 杯赛范围”展示页，让用户清楚区分全站战队目录和各杯战队池
首屏层级：顶部导航 -> 胶囊二级导航 -> Banner（战队变体，仅 pioneer / legend / crown，可选） -> Teams Directory + Team Action Rail
PageIntro 使用规则：all 态不单独生成 PageIntro；pioneer / legend / crown 态允许在 Banner（战队变体）内部复用 PageIntro 结构；“战队目录”作为 Teams Directory 内部标题出现，不得单独顶在胶囊二级导航之前
唯一主 CTA：查看战队详情
次 CTA：切换范围 / 建立队伍 / 邀请训练赛
用户状态：游客；普通用户；已是选手；队长
页面版心或舞台边界：1240

### 12.1 布局总览表

| 区块顺序 | 区块名称 | 目标 | 布局模式 | 形状定义 | 拼接关系 | 主视觉权重 | 组件 | 主动作 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | 胶囊二级导航 | 作为战队页首屏二级导航，建立“全部 / 先锋杯 / 传奇杯 / 冠绝杯”的范围认知，并完成范围切换 | 顶栏下方导航行 | 4 个固定顺序的胶囊按钮组成一行次导航 | 紧接顶部导航下方；“全部”态直接接 Teams Directory；某杯态下方可先接 Banner（战队变体） | A | Tabs / Badge / SurfaceCard | 切换范围 |
| 2 | Banner（战队变体） | 用推荐战队和频道摘要建立当前范围的战队秩序感；它就是战队页唯一 Banner | PageIntro 8 + 4 | 左侧频道题头宽块，右侧推荐战队高块 | 顶边贴胶囊二级导航；仅在 pioneer / legend / crown 出现；下方 Teams Directory 贴左块底边进入；右高块与 Team Action Rail 共线 | B | PageIntro / SurfaceCard / TeamMark | 打开战队页 |
| 3 | Teams Directory | 承接当前范围内的完整浏览和筛选目录 | 8 + 4 主副栏 | 左侧目录工作台长块，右侧动作为轻侧轨 | 顶边贴 Banner（战队变体）底边；“全部”态则直接贴胶囊二级导航底边；底部与 Cross Flow 共同收口 | B | TeamsDirectory / SurfaceCard / Badge / Button | 浏览战队 |
| 4 | Team Action Rail | 把建立队伍、邀请训练赛、范围资格说明稳定放在展示页右栏 | 4 栏侧轨 | 纵向状态、资格和动作卡堆叠 | 顶边接胶囊二级导航与推荐战队块；底边与 Teams Directory 最低边共同收口 | B | SurfaceCard / Button / Badge / Dialog | 建立队伍 / 邀请训练赛 |
| 5 | Cross Flow | 把用户继续带到比赛、选手或招募入口 | 单列轻卡流 | 横向收束轻流块 | 从 Teams Directory 与 Team Action Rail 整体底边起接 | C | SurfaceCard / Button | 去比赛或选手 |

### 12.2 区块详细规格

区块 1：胶囊二级导航
- 目标：让用户先理解当前在看“全站战队目录”还是“某杯战队池”
- 布局模式：12 栏二级导航条
- 栅格占比：12 栏整宽
- 形状定义：4 个固定顺序的胶囊按钮组成一行次导航
- 拼接关系：紧接顶部导航下方；“全部”态二级导航之后直接接 TeamsDirectory；某杯态先由 Banner（战队变体）承接头部摘要
- 注意力权重：A
- 内容槽位：范围切换 4 个
- 允许组件：Tabs / Badge / SurfaceCard
- 允许变体：Tabs.style=segmented；Tabs.tone=neutral|pioneer|legend|crown
- 禁止项：用细筛选条代替二级导航；当前范围不切换统计与徽章；“全部”态出现 Banner
- CTA 位置：范围切换块本身承担切换
- 响应式：xs 允许换行，但必须完整保留四项

战队页首屏推荐落地方案：

- 顶部导航：高度 68，全宽，负责频道身份与工具入口；保持首屏最深一级表面，不与战队 Banner 争主位
- 二级导航：按钮高度 40，位于频道主区顶部；4 个范围按钮按内容自适应宽度排列，整体宽度跟随 1240 版心内容区
- 全部态：不出现 Banner；Teams Directory 顶边距二级导航 24；Team Action Rail 顶线与 Teams Directory 顶线齐平，直接形成 8 + 4 主副栏入口
- 某杯态：当前按钮切到对应杯赛 Banner 色；Banner（战队变体）作为头部摘要存在于二级导航之后；Banner 与二级导航之间保持 12 到 20 的短过渡
- Banner 结构：固定采用左 8 右 4 的一体化 PageIntro 形态。这里的 PageIntro 只是唯一 Banner 的内部版式，不是额外独立页头。左侧承接当前杯池标题、2 到 3 行战队范围说明和 2 个动作；右侧只保留 1 张推荐战队高卡和 2 到 3 个关键指标
- 一体化几何：左侧 Banner 块的底边直接顺接 Teams Directory；右侧推荐战队高卡与 Team Action Rail 共用同一右轨与顶线，形成“左侧目录、右侧状态”在首屏阶段就被预告出来的秩序感
- 一体化边界：顶部导航与二级导航使用直线拼接；Banner 与 Teams Directory 再转入统一外侧圆角；避免 Banner 自己一套圆角、目录再一套圆角，导致首屏像拼贴板
- 一体化色面：二级导航使用较稳的面层；Banner 用当前杯赛主色与对应渐变或低噪点纹理做轻强调；推荐战队高卡可以更亮半级，但整体亮度仍须低于目录区的主操作按钮
- 推荐战队卡：只允许 1 个主推荐对象；队标、战绩、活跃状态、CTA 压缩进单卡，不得再在目录前横向并排 2 到 3 支推荐战队，避免 Banner 变成第二个目录
- 正文接力：Teams Directory 的筛选条与统计条应从 Banner 左块底边自然延续下来，视觉上像同一大壳层的下一层，而不是 Banner 结束后另起一个新舞台
- 右栏节奏：Team Action Rail 负责身份、资格、动作与危险操作分层，不复述 Banner 的大标题和说明；右栏只保留当前杯赛标签和必要状态回响

区块 2：Banner（战队变体）
- 目标：只在具体杯赛态用当前范围内的一支代表战队建立秩序感，而不是做泛化庆典横幅；它始终位于二级导航下方，不是另起一层页头，并且占用战队页首屏唯一 Banner 槽位
- 布局模式：PageIntro 左文右侧卡组（作为 Banner 内部形态，不额外升格成独立 Hero）
- 栅格占比：lg 8 + 4，xs 单列
- 形状定义：左侧频道题头宽块，右侧推荐战队纵向高块，右块顶部保留直角收边
- 拼接关系：顶边必须贴胶囊二级导航底边；仅在 pioneer / legend / crown 出现；Teams Directory 从左块底边起接；右高块与 Team Action Rail 保持同一右轨控制线
- 注意力权重：B
- 内容槽位：标题 1-2 行、说明 2-4 行、CTA 2 个、推荐战队 1 张、频道统计 3 项
- 允许组件：PageIntro / SurfaceCard / TeamMark / Button
- 允许变体：PageIntro.tone=brand；SurfaceCard.tone=accent|muted
- 禁止项：“全部”态显示 Banner；把 Banner 挪到二级导航上方；旧式整页 Banner；多个推荐战队并排；将招募入口放成主 CTA；在目录前再叠第二个正文 Banner
- CTA 位置：PageIntro 动作区
- 响应式：xs 推荐战队卡先于频道统计卡，统计卡改成纵向堆叠

区块 3：TeamsDirectory
- 目标：承接当前范围内的完整战队目录，让全站目录和某杯战队池使用同一对象骨架
- 布局模式：目录工作台
- 栅格占比：lg 8，xs 14
- 形状定义：整宽目录工作台长块，顶部薄筛选条，中部目录网格，底部可选轻回流带
- 拼接关系：必须从 Banner（战队变体）左块底边顺接；若当前为“全部”态则直接从胶囊二级导航底边顺接，作为页面最大连续块
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
- 拼接关系：顶边与 Banner（战队变体）顶线对齐；若当前为“全部”态则顶边贴胶囊二级导航底边；底边与 Teams Directory 最低边共同收口
- 注意力权重：B
- 内容槽位：账号信息 1 组，选手信息 0-1 组，队伍信息 0-1 组，当前范围资格标签 0-2 个，动作按钮 1-2 个
- 允许组件：SurfaceCard / Button / Badge / Dialog
- 允许变体：Button.variant=primary|secondary|danger；Badge.tone=neutral|pioneer|legend|crown
- 禁止项：动作卡重复左侧目录信息；本人队伍危险动作和普通动作并列在同一卡片
- CTA 位置：卡片底部
- 响应式：xs 下沉到目录之后，保持状态卡在前、动作卡在后、危险卡最后

右侧角色态动作约束：
- 普通用户：看到基本用户信息和“成为选手”说明，不直接显示建队动作
- 选手：显示基本选手信息、对应杯赛资格说明和“建立队伍”入口
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

- 二级导航 -> Banner（战队变体，仅某杯态）-> 当前杯赛目录 -> 队长动作侧栏 -> 跨页回流

### 12.4 战队页范围切换顺序图

```text
all
顶部导航
-> 胶囊二级导航（全部当前态）
-> TeamsDirectory + Team Action Rail
-> Cross Flow

pioneer / legend / crown
顶部导航
-> 胶囊二级导航（某杯当前态）
-> Banner（战队变体）
-> TeamsDirectory + Team Action Rail
-> Cross Flow
```

### 12.5 复用与页面特有边界

- 可复用：胶囊二级导航、TeamsDirectory
- 页面特有：Team Action Rail、对应杯赛推荐战队

## 13. 第二期频道页 Blueprint

- 新闻频道 /news 与社区首页 /community 的 Blueprint 实例统一见 16_phase-two-features.md。

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
| 1 | Login Explain Panel | 用品牌与社区介绍解释为什么要先完成账号动作 | 6 + 6 | A | SurfaceCard / Link / Badge | 去新手指引 |
| 2 | Auth Tabs Panel | 在同一块面中切换登录与注册，默认落在登录 | 6 + 6 | A | Tabs / IdentityAccountPanel / Form Field | 登录 / 注册 |

### 17.2 区块详细规格

区块 1：Login Explain Panel
- 目标：解释为什么这一页先处理账号，并用品牌与社区介绍承接用户信任
- 布局模式：左介绍右账号 Tabs
- 栅格占比：lg 6 + 6，xs 单列先介绍后账号面板
- 注意力权重：A
- 内容槽位：品牌标题 1 组、社区简介 2-3 行、收益点 3 条、辅助 CTA 1-2 个
- 允许组件：SurfaceCard / Link / Badge
- 允许变体：SurfaceCard.tone=default
- 禁止项：加入比赛、OpenDota、审核记录等二级内容；左侧做成资讯流；未登录页出现太多跳转目标
- CTA 位置：左侧介绍底部；右侧 Tabs 面板内部
- 响应式：xs 品牌介绍保持在上，收益点纵向堆叠，Tabs 面板紧跟其后

区块 2：Auth Tabs Panel
- 目标：把登录与注册收在同一账号工作区，避免拆成两个页面或两个平级大卡
- 布局模式：右侧单卡 Tabs 面板
- 栅格占比：lg 6；xs 单列整宽
- 注意力权重：A
- 内容槽位：Tabs 2 个、当前表单 1 组、登录态记住我 1 项、回跳说明 1 行、提交按钮 1 个
- 允许组件：Tabs / IdentityAccountPanel / Form Field / Checkbox / Button
- 允许变体：Tabs.style=segmented；Button.variant=primary；Checkbox.style=inline
- 禁止项：默认落在注册 Tab；登录和注册同时展开；把找回密码、Steam 绑定、认领流程塞进这个面板；加入演示账号快捷入口
- CTA 位置：面板底部
- 响应式：xs Tabs 保持顶部固定顺序“登录 / 注册”，默认态仍为登录；记住我紧跟在密码字段下方

### 17.3 登录页注意力路径

- 先理解社区与品牌 -> 右侧默认登录 Tab -> 必要时切到注册 Tab -> 成功回跳 -> 进入 /my 或 next 指定路径

### 17.4 复用与页面特有边界

- 可复用：Login Explain Panel、Auth Tabs Panel
- 页面特有：safe next redirect、“默认登录 Tab”规则，以及登录表单中的“记住我，7 天内免登录”开关

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

- 社区详情页家族、英雄目录与 FAQ 的 Blueprint 实例统一见 16_phase-two-features.md。

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