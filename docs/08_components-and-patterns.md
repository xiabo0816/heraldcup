# 今晚就来社区 / Components And Patterns

本文件只回答两件事：组件应当承担什么职责，以及页面级 pattern 应该如何复用。区块级规格见 11_section-specs.md，具体 variant 组合见 13_component-variant-matrix.md。

## 1. 文档边界

- 08_components-and-patterns.md：定义组件职责、使用时机、页面级组合 pattern
- 11_section-specs.md：定义区块级布局、内容槽位、拼接关系与 promptframe
- 13_component-variant-matrix.md：定义组件的 size、tone、state、density 等合法组合

## 2. 组件总原则

- 先统一行为，再允许主题差异
- 一张卡只承担一个核心任务
- 异步数据区必须定义 loading、empty、error 三态
- 列表页优先统一高度，详情页优先信息完整
- 后台组件优先密度、对比和风险表达
- 不为单页效果临时发明 variant、size、tone、state
- 组件既是信息单元，也是块面边界；装饰必须服务对象识别和可读性
- 组件的颜色、圆角、阴影描述统一引用 07_visual-foundations.md 中的 MD3 color roles、shape scale 与 elevation；Tailwind 只负责实现语义 token，不直接写散乱色名和默认大圆角
- 主题增强优先在现有组件骨架上换皮，不为了视觉再额外套无意义 wrapper、容器壳或多层占位 div
- 需要材质、光带、弱纹理时，优先通过 token、描边、阴影和伪元素完成；只有当信息结构真的变化时才允许新增 DOM 层级
- 所有组件默认先跟随 Radiant / Dire 的基础层；先锋杯、传奇杯、冠绝杯只作为 Banner、标签、模块入口和专题 CTA 的强调色，而不是通用组件主底色

## 3. 优先复用的组件族

### 基础组件

- Button
- Badge
- Tabs
- Dialog / Sheet
- Accordion
- Form Field
- Table

### 页面骨架组件

- Navbar
- PageIntro / DetailHero
- SectionIntro
- SurfaceCard
- PageGrid
- ReadingFlow
- DetailStatGrid

### 业务卡片

- MatchCard
- PlayerCard
- TeamCard
- ContentCard
- TopicCard
- RecruitCard
- IdentityCard
- OpenDotaPanel

## 4. 核心组件使用规则

### Button

- 用于主 CTA、次 CTA、后台确认动作
- 每屏最多一个 primary 主动作簇
- 仅作目录跳转时优先文本链接或轻链接卡
- 默认 primary 跟随当前全站主题 `--primary`；只有处于明确杯赛模块内部时，专题 CTA 才可切到对应杯赛按钮色
- 具体 variant 组合以 13_component-variant-matrix.md 为准

### Navbar

- 只承担全站一级导航，不承担正文展示和首页左侧内容入口侧轨
- 固定三段式：左品牌、中对象入口、右工具入口
- 杯赛范围切换不进入 Navbar，只存在于对象页顶栏下方的胶囊二级导航
- 一级导航只使用当前 Radiant / Dire 的中性色骨架，不直接铺主题主色，也不使用杯赛色做大面积高亮

### PageIntro / DetailHero

- 用于建立对象认知和承接唯一主 CTA
- 在 /matches、/players、/teams 中，PageIntro 不是默认页头组件；它只在两种位置合法出现：唯一 Banner 的内部版式，或正文首块内部的标题区
- 在 /matches、/players、/teams 中，若当前范围是 all，默认不生成独立 Banner，因此也不应先单独生成一个 PageIntro 顶在二级导航前面
- 在 /matches、/players、/teams 中，若当前范围是 pioneer / legend / crown，允许把 PageIntro 作为唯一 Banner 的内部版式来承接当前范围摘要，但这个 Banner 仍然必须位于胶囊二级导航之后
- “比赛工作台 / 选手目录 / 战队目录”若需要作为标题出现，应由正文区内部的 SectionIntro 或 PageIntro 标题区承接，而不是变成二级导航上方的独立题头
- 不用于 Tab 内容区、后台列表正文区、阅读页正文段首

### SurfaceCard

- 用于摘要卡、状态卡、操作卡、目录卡、风险卡、回流卡
- 同一列表内高度和底部动作保持统一
- 不承担多任务混合叙事
- 进入首页舞台或频道拼贴时，可通过跨栏、内边距和色块背景形成大块面
- default 与 muted 默认使用当前主题 surface 系列；accent 只用于少量焦点卡、Banner 内卡或与当前杯赛强相关的模块卡，不把正文区整组卡片染成杯赛色

### Form Field / Table

- Form Field 用于登录、认领、后台编辑和筛选提交；字段错误必须和顶部摘要同时存在
- Table 仅用于后台高密度对比和批量处理；前台频道与详情页不用 Table 代替展示组件

## 5. 页面级 Pattern 库

| Pattern | 结构 | 适用页面 | 关键要求 |
| --- | --- | --- | --- |
| 首页三轨首屏 | 3 + 6 + 3 | 首页 | 左栏是内容入口侧轨，中栏是唯一主内容区，右栏只承担身份入口 |
| 频道页导航壳层 | Navbar -> 胶囊二级导航 -> Banner -> 正文首块 | /matches、/players、/teams | 顶部导航后立刻进入胶囊二级导航；四层共享版心、边线、阴影家族和圆角逻辑；首屏只有 1 个 Banner 槽位；正文标题不得上移成导航下题头 |
| 频道页主副栏 | 工具条 + 8 + 4 或 3 + 9 | 第一、二期频道页 | 筛选、主列表、关系回流三类职责必须清晰可识别 |
| Mosaic Stage | 3 到 6 个大色块拼接 | 首页首屏、频道首屏、专题聚合页 | 只允许 1 个主块承担绝对主视觉，移动端回退为顺序流 |
| 阅读页偏置阅读流 | 9 + 3 或 3 + 9 | 规则、指引、新闻详情、公告详情 | 装饰退后，正文主轴优先 |
| 详情页 8 + 4 双栏 | DetailHero + 左栏主体 + 右栏关系与状态 | 比赛、选手、战队详情 | 允许错位层级，但不切碎主叙事 |
| 后台列表页 | 标题区 + 工具条 + Table + 批量操作层 | 所有后台列表页 | 块面用于信息分区和风险提示，不做前台庆典视觉 |
| 后台编辑页 | FormSection + 发布设置 + 关系选择器 + 审计与历史 | 所有后台编辑页 | 表单、关系、审计、危险操作必须拆成独立块面 |

## 6. 使用顺序

1. 先用 page brief 判断页面任务
2. 再用 page blueprint 选页面级 pattern
3. 再用本文件选组件族
4. 再到 11_section-specs.md 套区块规格
5. 最后到 13_component-variant-matrix.md 选合法变体

## 7. 禁用总结

- 不为单页视觉临时造新组件名
- 不在列表页混用过多卡片高度和 CTA 命名
- 不在阅读页叠多个 Hero 或重复说明卡
- 不在后台复用前台庆典视觉和大面积品牌色
- 不把“有版心”理解成“退回模板站”；仍需块面分区、明确边界和响应式回退