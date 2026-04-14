# 今晚就来社区 / AI Promptbook

## 1. 使用目标

这份文档用于约束 AI 在本项目中生成页面结构、文案、视觉和代码时的默认行为，降低风格漂移、组件发散和结构失控。

## 2. 默认执行顺序

生成任何页面时，必须按以下顺序输出：

1. 页面目标与用户状态
2. 对应 page brief 中的页面任务摘要
3. Page Blueprint 的区块顺序与布局模式
4. 每个区块的形状定义与拼接关系
5. Section Spec 的区块约束与内容槽位
6. 如果有交互，补 Wireflow / State Spec
7. 视觉层级与 token 使用
8. 组件复用方案与允许变体
9. 响应式策略
10. 最后再输出 React + Tailwind 代码

禁止直接跳到代码。

补充规则：

- 如果 10_page-blueprint.md 已经存在对应页面实例，必须优先引用该实例，不得退回“首页模板 / 频道页模板 / 详情页模板”这类通用骨架
- 如果 11_section-specs.md 已经存在对应区块实例，必须优先引用实例名，而不是重新描述一个相近但未命名的新区块
- 如果 12_wireflow-and-state-spec.md 已经存在对应交互实例，状态命名和顺序必须与实例保持一致
- 如果 13_component-variant-matrix.md 已经定义了组件组合，输出代码时不得私自创造新的 tone、size、state 命名
- 任何区块如果没有写清形状定义和拼接关系，就视为规格不完整，不能直接生成代码

## 3. 强制复用规则

- 优先复用现有组件：SiteSection、SectionIntro、SurfaceCard、PageIntro、PageGrid、ReadingFlow、DetailHero、DetailStatGrid
- 业务卡优先从 MatchCard、PlayerCard、TeamCard、ContentCard、TopicCard、RecruitCard、IdentityCard、OpenDotaPanel 中复用
- 不允许为了单页视觉效果发明新组件体系
- 如果确实需要新组件，必须先说明为什么现有组件无法承载
- 组件变体必须先在 13_component-variant-matrix.md 中找到合法组合

## 4. 默认视觉规则

- 全站默认深色底盘
- 默认采用 14 栏栅格
- 顶部导航默认全宽
- 顶部导航默认拆成对象入口与工具入口两组；胶囊二级导航只允许出现在 /matches、/players、/teams 顶栏下方，形式采用与 /community 一致的胶囊式子导航按钮行；一级导航保持中性骨架，“全部”态下二级导航以下内容也保持中性，具体杯赛态时则要求二级导航以下的 Banner、PageIntro、工具条、主列表、右栏与回流区统一切换到对应主题色。若该 Banner 承接人物、战队或赛程焦点内容，也必须直接复用这同一个 Banner 槽位，不得额外生成第二个正文 Banner
- 首页默认全宽舞台
- 除首页外的页面默认使用 1240 明确版心
- 全站都要继承不规则大色块母题，只是按页面类型调节强度
- 默认题材方向是 Dota 2 的远古史诗气质 + 现代内容平台可读性，不做 HUD 拟态
- 默认普通区块间距为 24 到 32
- 默认重区块间距为 48 到 64
- 默认卡片圆角使用 xl 或 2xl
- 默认使用语义 token，不直接写零散色值命名
- hover 和进场反馈必须丝滑、克制、统一，优先用位移、描边、遮罩和局部高光，不要滥用缩放
- 先锋杯、传奇杯、冠绝杯既有主色必须保留，新的 Dota 2 基底色只能做全站底盘和中性色层级

## 5. 默认页面模板

以下模板只在没有页面实例时作为兜底使用；一旦某个页面已经在 10_page-blueprint.md 中存在真实实例，实例优先级高于模板。

首页模板：

- 首屏优先使用固定 3 + 6 + 3 三栏：左栏内容入口侧轨、中栏主体、右栏身份信息
- 后续区段继续围绕中栏主内容展开，左右栏只做辅助延续，不再各自长成第二主线

频道页模板：

- PageIntro
- 工具条
- 主列表或主副栏
- 下半部关系回流

频道页主题补充规则：

- 如果当前范围是 pioneer、legend 或 crown，频道页从 Banner 到回流区都必须处在同一主题壳层内生成；不要只改一个当前按钮或一张卡片
- 如果当前范围是 all，频道页二级导航以下必须回到中性骨架，不保留上一个杯赛主题残影

阅读页模板：

- 题头
- 摘要
- 正文流
- 侧栏关系卡或目录
- 文末推荐

详情页模板：

- DetailHero
- 8 + 4 双栏
- 左栏主体内容
- 右栏状态与关系

展示页补充规则：

- 当页面需要更强品牌感时，优先从 docs/11_section-specs.md 的 Mosaic Stage 或 Home Hero Mosaic 实例中取结构
- 七巧板式拼贴必须先定义每个块的内容职责，再决定跨栏与配色
- 不允许只因为想做“官网感”就把所有区块做成漂浮海报卡
- 首页必须先定义安全区与全宽舞台边界；其他页面先定义 1240 版心宽度，再定义拼贴块如何贴边、跨栏或收束

全站母题补充规则：

- home：可以最强地使用非对称拼贴、大色块和动效反馈
- channel：用大块面组织入口、筛选、焦点和回流
- detail：用块面建立门面、主叙事和侧栏层级
- reading：保留正文可读性，但题头、目录、引用、文末推荐必须仍有块面语言
- operation：admin：用块面分区表达状态、表单、风险和工具，不退回无边界长页
- 所有页面都要先让用户认出英雄、战队、版本、赛事和内容类型，再去感受材质与世界观装饰

后台模板：

- 标题区
- 工具条
- 表格或表单主区
- 状态配置与高风险操作区

交互页附加要求：

- 登录、筛选、搜索、认领、后台编辑页面必须先给出状态流转再写代码
- 至少覆盖 loading、empty、error、permission-denied、success

## 6. 文案生成规则

- 先写清对象、状态、动作，再写语气
- CTA 必须使用明确动作词
- 不写模板味口号
- 不写与真实状态冲突的报名、发布、认领提示
- 卡片摘要只保留帮助点击决策的信息

## 7. 响应式规则

- xs、md、lg 必须明确结构变化
- 移动端必须重排任务顺序，不能只是桌面布局下压
- 复杂筛选在移动端改抽屉或 Sheet
- 桌面侧栏在移动端改为文末分组或吸底动作
- 首页无版心拼贴和其他页面的版心内拼贴，在移动端都必须回退成清晰顺序流，不能保留依赖绝对位置的桌面构图
- 小尺寸下的英雄头像、封面裁切和标签必须优先保留识别性，不保完整插画

## 8. 代码输出规范

- 使用 React + Tailwind
- 命名遵循现有组件与页面语义，不使用炫技命名
- 优先抽取复用区块，不在页面内重复大段结构
- 异步区域必须考虑 loading、empty、error、permission-denied
- 危险操作必须有确认层
- 不把后台和前台写成同一视觉层级
- 区块实现必须能回溯到 Page Blueprint 和 Section Spec，不能现场自由拼装

## 9. 页面验收清单

每次生成后自检：

- 是否明确页面唯一主任务
- 是否遵守 IA 和 sitemap
- 是否复用了既有组件
- 是否使用统一 token、间距、层级和 CTA 口径
- 是否为顶部导航定义了全宽容器、为首页定义了全宽舞台，或为其他页面定义了 1240 明确版心，并在此前提下仍保持清晰层级
- 是否补齐状态与无障碍底线
- 是否区分游客态、登录态、已认证态或权限态
- 是否避免发明母文档中不存在的新视觉系统
- 是否优先引用了已有实例，而不是退回通用模板

## 10. 当前已具备真实实例的页面家族

- 首页与比赛中心：/、/matches
- 频道页：/players、/teams、/news、/community
- 阅读页：/rules、/guide、/community/announcements/[slug]
- 身份与操作页：/my、/my/claims、/login
- 详情页：/matches/seasons/[slug]、/matches/[slug]、/players/[slug]、/teams/[slug]
- 社区详情页：/community/topics/[slug]、/community/recruitments/[slug]、/community/activities/[slug]
- 工具型页面：/heroes、/community/faq
- 后台页家族：/admin、/admin/* 列表页、编辑页、审核页

## 11. 推荐提示模板

在让 AI 生成页面前，先提供以下信息：

- 页面名称
- 页面目标
- 用户当前状态
- 唯一主 CTA
- 必须区块
- 禁止元素
- 参考已有组件
- 目标设备优先级
- 对应 Page Blueprint
- 涉及到的 Section Spec
- 如果有交互，对应 Wireflow / State Spec
- 每个区块的形状定义
- 每个区块与周边区块的拼接关系

推荐提示格式：

```text
请基于 docs/00_project-brief.md、docs/01_information-architecture.md、对应的 page brief、docs/10_page-blueprint.md、docs/11_section-specs.md、docs/07_visual-foundations.md、docs/08_components-and-patterns.md、docs/13_component-variant-matrix.md 生成 [页面名称]。

如果页面有交互，再补充 docs/12_wireflow-and-state-spec.md。

先输出：
1. 页面目标
2. 区块顺序与布局模式
3. 每个区块的形状定义与拼接关系
4. 使用的组件与变体
5. 响应式策略
6. 状态处理
7. 再输出 React + Tailwind 代码

约束：
- 只复用现有组件
- 使用深色底盘和既有 token
- 不发明新组件
- 补齐 loading / empty / error / permission-denied
```

## 12. Promptframe 要求

- AI 在生成页面前，必须先把每个区块解释成一条 promptframe 约束
- promptframe 至少包含：区块目标、形状定义、拼接关系、标题长度、描述长度、CTA 数量、允许组件、禁止项
- 如果没有 promptframe，就视为页面规格不完整