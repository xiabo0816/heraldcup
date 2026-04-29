# 今晚就来社区 / Visual Foundations

## 1. 视觉方向

- Dota 2 世界观气质优先于游戏 HUD 模仿
- 全站底盘允许随阵营切换：天辉为浅色石白底盘，夜魇为深色竞技底盘
- 秩序感大于花哨感
- 荣誉感大于庆典噪音
- 社区参与感大于纯资讯陈列
- 全站统一采用大色块作为视觉母题；首页允许全宽舞台，其余页面保持 1240 版心约束，不回到松散的同构卡列
- 参考方向是高完成度游戏官网的七巧板式信息舞台：大块面、强分区、清晰悬停反馈
- 这是一套全站语言，不是只有首页能使用的特效风格

题材总纲：

- 这是远古史诗感的内容平台，不是把 Dota 2 战斗 HUD 搬到网页上
- 视觉母题来自 Dota 2 的英雄谱系、阵营冲突、远古遗迹、仪式感与战争感
- 所有视觉细节都要服从对象识别和阅读效率，不能为了“像游戏”牺牲可读性

优先抓住的气质：

- 厚重史诗感先于花哨感
- 世界观气质先于皮肤感
- 内容识别先于装饰完整度
- 官方式可读性先于夸张特效

页面家族适配原则：

- 首页：使用全宽舞台，用最强的大色块拼接建立品牌舞台
- 频道页：在 1240 版心内用非对称大块面组织筛选、焦点和列表入口
- 详情页：在 1240 版心内用大块面建立对象门面、主体叙事和关系侧栏
- 阅读页：在 1240 外壳内保留可读性，并用块面题头、目录块和文末回流块承接母题
- 操作页：在 1240 版心内用块面划分身份、表单、状态和下一步动作
- 后台页：在 1240 版心内用克制的大块面做信息分区，不做庆典式拼贴秀

Dota 2 化而不 HUD 化：

- 可以抽取材质语言：黑石、铜金、烟雾、古地图、磨损纹理、符印、旗帜、阵营徽章
- 可以抽取构图语言：中轴稳重、仪式感、阵营感、分段框和碑刻式层级
- 不直接照搬战斗 HUD、技能槽、复杂面板、满屏雕花边框
- 用户必须在 2 秒内同时感到“这是 Dota 2 社区”与“这个页面很好用”

形状语言基线：

- 每个板块都必须定义自己的块面形状，而不是只给一个矩形容器
- 形状必须说明四件事：外轮廓、圆角策略、直角保留位置、与相邻板块的拼接边
- 不规则优先来自错位、跨栏、局部缺口、包角、直角收边和边界落差，不依赖切角或随意多边形
- 同一屏形状语言最多保留 2 到 3 种主句法，避免每块都长得不一样
- 切角不再作为本项目默认形状语言使用
- 圆角和直角必须合理交叉：主焦点块偏圆，导航轨、工具条、侧栏、工作台、页脚收束块偏直

推荐形状词汇：

- 整宽舞台块
- 横向长条块
- 纵向高柱块
- L 形包裹块
- 阶梯错位块
- 双卡咬合块
- 上下咬边块
- 内凹缺口块
- 尾部收束带

## 2. 断点

- xs: 0-639
- sm: 640-767
- md: 768-1023
- lg: 1024-1279
- xl: 1280-1535
- 2xl: 1536+

要求：

- 所有页面至少定义 xs、md、lg 三档
- 展示页和后台页补充 xl 档规则

## 3. 布局与栅格

- 桌面端采用 14 栏内容栅格
- 外层安全边距：lg 32, xl 40, 2xl 56
- 标准 gutter：24
- 后台 dense gutter：20
- 阅读页 gutter：28
- 除首页外，全站页面默认必须有明确版心；首页使用全宽舞台，但仍受安全边距与栅格约束

布局 token：

- layout.container.nav = fluid
- layout.container.home = fluid
- layout.container.channel = 1240
- layout.container.standard = 1240
- layout.container.reading = 760
- layout.container.reading-shell = 1240
- layout.container.admin = 1240
- layout.inset.mobile = 16
- layout.inset.tablet = 24
- layout.inset.desktop = 32
- layout.gutter.default = 24
- layout.gutter.dense = 20
- layout.gutter.reading = 28
- layout.section.default = 24-32
- layout.section.heavy = 48-64
- layout.stack.compact = 12-16
- layout.stack.default = 16-20
- layout.stack.roomy = 24-32

常用组合：

- 3 + 6 + 3 首页三轨
- 5 + 5 双核
- 8 + 4 主副栏
- 9 + 3 阅读偏置
- 3 + 9 Sticky 筛选
- 4 + 4 + 6 拼贴
- 7 + 7 对比双列
- 3 + 4 + 7 非对称舞台
- 5 + 3 + 6 大色块错位拼接
- 2 行跨栏 Mosaic：6 + 8 / 4 + 4 + 6

容器宽度：

- 顶部导航栏始终使用全宽容器，仅受安全边距约束
- 首页使用全宽舞台，仅受安全边距约束
- 除首页外的页面默认版心宽度：1240
- 标准内容最大宽度：1240
- 阅读正文最大宽度：760
- 阅读题头与侧栏最大宽度：1240
- 后台工作区最大宽度：1240
- 后台表单正文建议控制在 960 内

全站统一原则：

- 首页必须先定义全宽舞台和安全区，再定义块面分区、错位层级和明确边界；其他页面先定义 1240 版心
- 页面即使统一使用版心，或首页采用无版心舞台，也不能退回一整页单容器白板式排版
- 顶部题头、关键摘要、关系区、表单区、风险区、尾部回流区，都应至少有一层块面语义可感知
- 每个块面都必须写清与上一块、下一块、左邻块、右邻块的拼接方式：对齐、错位、咬合、悬挑、嵌入或留缝
- 页面 Blueprint 必须写清顶部导航是否全宽、首页是否全宽舞台，或其他页面的 1240 版心宽度，以及区块是否贴版心边界

布局底线：

- 不先定容器再硬塞内容，布局必须服务内容类型和操作优先级
- 首屏只能有一个主重块，第二层优先进入证明、筛选、关系或正文
- 首页允许全宽地使用可解释的块面拼接；展示页和频道页在 1240 版心内使用块面拼接，但不要再依赖切角制造异形感
- 详情页和阅读页仍优先采用可解释的栅格组合，不使用无逻辑自由拼贴
- 移动端必须重排任务顺序，不允许只把桌面布局整块压缩
- 同一屏的大色块数量建议控制在 3 到 6 个，必须有 1 个主块、1 到 2 个次重点、其余为辅助块
- 不允许把所有卡片做成相同尺寸后再强行错位，错位必须来自信息层级而不是装饰冲动
- 首页首屏优先使用 3 + 6 + 3 三轨：左轨内容入口侧轨，中轨内容主体，右轨身份信息

导航层级视觉规则：

- 顶部对象入口与顶部工具入口共处同一条全宽顶栏，但只承担全站结构识别，不承担频道主题表达
- /matches、/players、/teams 的胶囊二级导航仍然承担页面级第二层，但页面表现改为顶栏下方的一行胶囊按钮，不与顶栏做成同一排 Tabs
- 首页左侧 3 栏是内容入口侧轨，视觉上可以更像目录块，但不能伪装成第二条全站顶栏
- 首页不参与这套二级导航结构，因此首页任何区块都不能复用比赛、选手、战队页面中的胶囊二级导航样式

全站颜色 token 分层：

- 所有颜色先拆成两层：全站基础色（MD3 neutral / surface 系列）和赛事范围 scope 色（MD3 custom color 四件套）；禁止把所有业务色直接散落到一级导航、Banner 和正文中
- 全站基础色只服务一级导航、正文骨架、分区边界和默认组件，它们必须足够中性，保证整站先站稳结构，再表达主题
- 基础色映射：surface 页面主背景，surface-container 分区底色，outline-variant 描边或分割线，on-surface 正文主文字，on-surface-variant 次要文字
- 赛事范围 scope 色服务 /matches、/players、/teams 中二级导航以下的频道内容壳层；它负责接管 Banner、标题区、工具条、主列表容器、右栏、回流区和频道内 CTA 的表面层级，但不破坏正文文字和数据的可读对比
- 每组 scope 通过 MD3 custom color 四件套实现：scope-primary、scope-on-primary、scope-primary-container、scope-on-primary-container
- scope 是抽象主题槽位，通过 CSS class `.scope-pioneer`、`.scope-legend`、`.scope-crown` 切换变量值；切换主题时只替换变量，不改布局与组件骨架
- 页面样式实现时，/matches、/players、/teams 在 pioneer / legend / crown 任一具体杯赛态下，二级导航以下的外层内容容器统一挂接当前 scope 变量；切回"全部"态时，整段内容容器回到 neutral surface 系列

导航主次关系：

- 顶部导航是全站主导航，品牌、对象入口、工具入口都在这里完成识别；它的视觉优先级必须高于二级导航
- 二级导航是频道内范围切换，只解决“当前对象看哪个范围”；它要紧贴顶部导航，但整体视觉强度必须比顶部导航低一档
- Banner 只是范围补充说明，不参与导航主次竞争；它的存在感低于二级导航，高于普通工具条
- 正文首块是进入内容的主工作面；二级导航和 Banner 都不能抢走正文第一落点的注意力

首屏一体化原则：

- 顶部导航、二级导航、Banner、正文首块不应被做成 3 到 4 张彼此分离的卡，而应共享同一条版心中轴、同一套表面层级和连续的上下边界
- 用户进入 /matches、/players、/teams 时，应感到自己仍停留在同一页面系统内，只是从“对象识别”下沉到“范围识别”，再进入对应杯赛内容；不应出现像连续开启两个新页面头部的断裂感
- 一体化的关键不是把二级导航和 Banner 做得更重，而是让它们和正文首块之间的宽度、边线、阴影家族、圆角逻辑保持连续
- 顶部导航负责全站身份，二级导航负责范围切换，Banner 负责当前杯赛摘要，正文首块负责实际任务；四者必须功能分层清楚，但视觉上属于一个连续首屏容器
- 优秀站点的共性通常是“导航薄而清楚、内容带短而稳、主内容立即接住”，而不是“导航下面再起一个独立大舞台”；Herald Cup 频道页应沿这个方向收口

一级导航颜色规则：

- 一级导航背景使用 surface，底部分割线使用 outline-variant，默认文字使用 on-surface-variant
- 一级导航 hover 使用 state layer（on-surface 8%），不用主题主色整块铺底
- 一级导航当前态优先通过 on-surface 文字、surface-container-high 轻底色表达，不依赖高饱和主题色
- 一级导航不直接使用任何杯赛 scope-primary；一级导航必须始终像全站骨架，而不是频道主题条
- 一级导航的层级差主要靠字重变化、轻底色变化、细线提示、留白和间距来完成，而不是靠大面积高对比色块

二级导航颜色规则：

- 二级导航 4 个按钮必须分别拥有独立色系；默认态、hover 态、active 态都要按按钮所属范围区分，不再允许 4 个按钮默认态长成同一套中性底色
- “全部”按钮继续使用 neutral 体系，但要有自己独立的默认底色、hover 底色和 active 高亮色，不与三个杯赛按钮共用同一组交互面
- 先锋杯按钮固定使用 pioneer 系列：default 使用 pioneer 的低强度底色与描边，hover 提升到 pioneer primary-container，active 再切到更强的 pioneer 主色高亮
- 传奇杯按钮固定使用 legend 系列：default 使用 legend 的低强度底色与描边，hover 提升到 legend primary-container，active 再切到更强的 legend 主色高亮
- 冠绝杯按钮固定使用 crown 系列：default 使用 crown 的低强度底色与描边，hover 提升到 crown primary-container，active 再切到更强的 crown 主色高亮
- active 态优先通过更高对比的范围底色、强调描边和局部抬升共同建立；不再给按钮额外挂底部把手线或底边强调线
- 如果页面需要更重的营销式表达，允许把 active 态做成 scope-primary 实底 + scope-on-primary 文字，但这不是后台和高密度频道页的默认方案
- 最稳妥的频道页写法固定为：每个按钮 default = 本范围低强度 container / outline / 对应文字色，hover = 同范围更亮的 primary-container / primary / on-primary-container，active = 同范围主高亮底色 + 强描边 + 局部阴影
- 二级导航整体背景仍以中性色表面为主，主题色只应集中作用在按钮交互和当前态标记上
- 二级导航自身不做整条实底染色；主题切换的主体发生在二级导航以下的频道内容壳层，而不是把第二条导航做成新的重头部

二级导航展示规则：

- 对象页在页面上的直接表现是“二级导航（胶囊按钮） + Banner（可选） + 下方对象主体”，而不是单独的大舞台块
- 同一频道页首屏只保留 1 个 Banner 槽位；范围摘要、焦点人物、推荐战队、焦点赛程等内容只能合并进这一个 Banner，不得再叠加第二个正文 Banner
- 胶囊二级导航作为二级导航，必须做成与 community 一致的胶囊按钮行：紧接顶部导航下方，和页面主体共享 1240 版心
- 二级导航内部固定为 4 个胶囊按钮，顺序固定为全部、先锋杯、传奇杯、冠绝杯
- “全部”固定使用中性色按钮语义；先锋杯、传奇杯、冠绝杯三个按钮从默认态开始就分别挂接各自范围色系，不再等到 hover 才出现差异
- 统计、资格和说明不放进二级导航本体；它们回到正文首块或右栏首卡，不把导航条写成复合信息块
- “全部”态时，二级导航之后直接进入主工作台或主目录，不出现 Banner；具体范围态时，才允许保留 1 个对应 Banner，且它作为频道页头部摘要存在于二级导航之后
- 当前杯赛的 scope 色应覆盖二级导航以下的页面背景雾面、标题区、工具条、主列表外壳、右栏首卡与回流区；局部重点再通过 scope-primary 提升，不把高饱和主色直接铺满长文本区域
- xs 端二级导航继续使用胶囊按钮语法，允许换行，不必维持整条范围带或横向滚动条的强制语义
- 二级导航与顶部导航仍属于同一导航体系的上下两级，但通过位置下沉到频道主区入口、轻描边和更弱阴影，让用户立刻看出主次
- 二级导航整体不再使用整条背景壳层；不要做成与顶部导航同亮、同厚、同重量的第二条头部
- 二级导航按钮的高亮应该精确落在当前范围按钮上，而不是把整条二级导航抬成第二个大主块
- 二级导航与 Banner、正文首块必须共用相同版心宽度；禁止 Banner 更窄、正文首块再缩一档，导致首屏像三段松散拼接
- 二级导航底边、Banner 顶边、正文首块顶边优先通过连续描边、连续底色或连续阴影家族衔接，而不是靠大留白硬切开

页面主题联动规则：

- /matches、/players、/teams 在切到 pioneer / legend / crown 任一具体杯赛态时，二级导航以下的频道内容壳层整体切换为当前主题；这包括页面背景雾面、分区底、描边、标题区、工具条、列表外壳、右栏、回流区与频道内 CTA
- 主题切换后，正文段落文字、表格正文、表单输入内容和长阅读信息仍优先沿用 on-surface / on-surface-variant 中性色文字体系，避免牺牲可读性
- 跟主题联动的模块包括：页面外层背景、PageIntro（若作为 Banner 内部形态或正文首块标题区）、Banner、当前筛选项、主列表容器、右栏卡堆、主按钮、图标高亮、KPI 数字、图表主线、Tag 或 Badge、空状态点缀、Focus Ring、回流区
- 不跟主题联动的模块包括：长正文段落文字、普通输入控件内文、表格大多数正文文本、跨页面复用的一级导航与全站 Footer 主骨架
- 主题联动强度建议按 55 30 15 控制：55% 中性色，30% 主题浅色，15% 主题主色与深强调色
- 大面积铺底优先使用 scope-primary-container 浅底色；scope-primary 只用于主按钮、当前态线条、关键数字、焦点控件和少量强调面

全站双主主题规则（天辉 / 夜魇）：

- 全站基础主题拆分为两套：天辉模式（Radiant）与夜魇模式（Dire）；两者只替换基础色层，不改变信息架构、布局、组件层级和交互语义
- 天辉模式用于明亮自然基调，参考风行者的林地配色：石白、鼠尾草、林地橄榄与少量箭羽琥珀；页面底色以低饱和石白和浅苔白为主，允许明显偏白，但必须保留一点自然灰绿感，避免做成医院白或薄荷糖色
- 夜魇模式用于阴暗压迫基调，主色倾向赤红与暗灰黑，页面底色保持低亮深色岩质感
- 依据 Dota 2 阵营设定：Radiant 为 bright, natural theme；Dire 为 dark, gloomy theme；在视觉映射上分别落为“亮面绿青系”与“暗面赤红系”
- 基础主题切换只影响 MD3 neutral / surface / outline / primary 等全站基础 role；不直接改写赛事范围 scope 色
- 切换主题后必须保证正文可读性：长正文、表格正文、表单输入文字仍优先使用 on-surface / on-surface-variant 对比体系
- 主题切换优先服务全站骨架层（顶栏、页底、页面底盘、分区容器）；频道范围表达仍由 scope 层负责

全站配色结构：

- 全站只保留两套主主题：Radiant 与 Dire；页面背景、卡片、边框、正文和默认 CTA 先跟随当前全站主题
- 先锋杯、传奇杯、冠绝杯只作为范围层，不替代全站主题主色；它们只主导 Banner、模块入口、专题头图、模块标签和模块内 CTA
- “全部”态回到纯主题骨架；具体杯赛态时，二级导航以下进入当前杯赛的模块强调层，但正文区和功能区仍使用主题 surface / text 体系
- 路由与状态仍沿用 `pioneer / legend / crown`；其中 `crown` 在视觉 token 上映射到冠绝杯的 `cup-immortal` 变量

导航主次关系：

- 顶部导航是全站主导航，品牌、对象入口、工具入口都在这里完成识别；它的视觉优先级必须高于二级导航
- 二级导航是频道内范围切换，只解决“当前对象看哪个范围”；它要紧贴顶部导航，但整体视觉强度必须比顶部导航低一档
- Banner 只是范围补充说明，不参与导航主次竞争；它的存在感低于二级导航，高于普通工具条
- 正文首块是进入内容的主工作面；二级导航和 Banner 都不能抢走正文第一落点的注意力

首屏一体化原则：

- 顶部导航、二级导航、Banner、正文首块应共享同一条版心中轴、同一套表面层级和连续的上下边界
- 用户进入 /matches、/players、/teams 时，应感到自己仍停留在同一页面系统内，只是从“对象识别”下沉到“范围识别”，再进入对应杯赛内容
- 顶部导航负责全站身份，二级导航负责范围切换，Banner 负责当前杯赛摘要，正文首块负责实际任务；四者必须功能分层清楚，但视觉上属于一个连续首屏容器

## 5. 色彩 Token

总规则：

- 文档中描述颜色时统一优先写语义 token 与 MD3 role；确需落到色值时，只使用本节定义的 Radiant / Dire 与 cup token
- 页面基础层统一引用 `--bg`、`--bg-secondary`、`--surface`、`--surface-elevated`、`--border`、`--text`、`--text-secondary`、`--text-muted`
- 范围层统一引用 `--cup-pioneer-*`、`--cup-legend-*`、`--cup-immortal-*`；不要再发明 `theme-a / theme-b / theme-c` 之类抽象代号

### 5.1 Theme Architecture

| 层级 | 颜色来源 | 主要作用 | 不承担 |
| --- | --- | --- | --- |
| 全站主题层 | Radiant / Dire | 页面背景、卡片、边框、正文、默认 CTA、一级导航、Footer | 杯赛识别 |
| 杯赛范围层 | 先锋杯 / 传奇杯 / 冠绝杯 | Banner、模块入口、模块标签、专题头图、专题 CTA、当前态强调 | 正文区主背景、基础文字色、基础边框色 |

落地原则：

- 全站看主题，模块看杯赛
- 主题负责阅读和结构，杯赛负责识别和氛围
- 杯赛色用于 Banner / 标签 / 专题 CTA，不接管正文区

### 5.2 Radiant Theme

| Token | Color | 用途 |
| --- | --- | --- |
| `--bg` | `#F6F8F2` | 页面主背景 |
| `--bg-secondary` | `#EDF2E8` | 二级背景 |
| `--surface` | `#FFFFFF` | 卡片背景 |
| `--surface-elevated` | `#F8FBF5` | 弹层 / 悬浮卡片 |
| `--border` | `#CDD7C4` | 边框 / 分割线 |
| `--text` | `#172114` | 主文字 |
| `--text-secondary` | `#4F5F49` | 次文字 |
| `--text-muted` | `#788772` | 弱文字 |
| `--primary` | `#5E9141` | 主按钮 / 品牌主色 |
| `--primary-hover` | `#73A952` | 主按钮 hover |
| `--accent` | `#7BAA67` | 链接 / 信息高亮 |
| `--success` | `#67C26F` | 成功态 |
| `--warning` | `#D7B75A` | 警告态 |
| `--danger` | `#C95C4B` | 危险态 |

气质要求：自然、明亮、生命感。天辉默认应呈现白色相关底盘，绿色只承担强调、按钮、焦点和局部光带，不把整页重新染成深绿或高饱和青绿。

### 5.3 Dire Theme

| Token | Color | 用途 |
| --- | --- | --- |
| `--bg` | `#111214` | 页面主背景 |
| `--bg-secondary` | `#181A1D` | 二级背景 |
| `--surface` | `#202327` | 卡片背景 |
| `--surface-elevated` | `#2B2F34` | 弹层 / 悬浮卡片 |
| `--border` | `#3A3F45` | 边框 / 分割线 |
| `--text` | `#ECE7E1` | 主文字 |
| `--text-secondary` | `#BEB7AF` | 次文字 |
| `--text-muted` | `#8C857E` | 弱文字 |
| `--primary` | `#C04A36` | 主按钮 / 品牌主色 |
| `--primary-hover` | `#D45A45` | 主按钮 hover |
| `--accent` | `#7B6A58` | 次级强调 |
| `--success` | `#6D9A63` | 成功态 |
| `--warning` | `#B88A45` | 警告态 |
| `--danger` | `#D45A45` | 危险态 |

气质要求：冷峻、压迫、硬核感。可以有余烬式暖红提亮，但不把整页做成纯红黑冲撞。

### 5.4 Cup Module Banner Tokens

| 模块 | 主色 | Hover / 高亮 | 深色背景 | 浅色描边 | 推荐文字 |
| --- | --- | --- | --- | --- | --- |
| 先锋杯 | `#236D5C` | `#2E8C77` | `#163F36` | `#4FA594` | `#F3FBF8` |
| 传奇杯 | `#563880` | `#6D4AA1` | `#34214F` | `#8A69B5` | `#F7F3FD` |
| 冠绝杯 | `#853454` | `#A24569` | `#552137` | `#BC6787` | `#FFF4F7` |

实现映射：

- `pioneer` -> `--cup-pioneer-*`
- `legend` -> `--cup-legend-*`
- `crown` -> `--cup-immortal-*`

### 5.5 Banner Cheatsheet

先锋杯 Banner：

- 主背景：`#236D5C`
- 渐变建议：`#163F36 -> #236D5C -> #2E8C77`
- 标题文字：`#F3FBF8`
- 副标题文字：`rgba(243,251,248,0.82)`
- 按钮底色：`#2E8C77`
- 按钮文字：`#F3FBF8`
- 细描边 / 标签边框：`#4FA594`

传奇杯 Banner：

- 主背景：`#563880`
- 渐变建议：`#34214F -> #563880 -> #6D4AA1`
- 标题文字：`#F7F3FD`
- 副标题文字：`rgba(247,243,253,0.82)`
- 按钮底色：`#6D4AA1`
- 按钮文字：`#F7F3FD`
- 细描边 / 标签边框：`#8A69B5`

冠绝杯 Banner：

- 主背景：`#853454`
- 渐变建议：`#552137 -> #853454 -> #A24569`
- 标题文字：`#FFF4F7`
- 副标题文字：`rgba(255,244,247,0.84)`
- 按钮底色：`#A24569`
- 按钮文字：`#FFF4F7`
- 细描边 / 标签边框：`#BC6787`

### 5.6 组件映射 Cheatsheet

| 组件 | Radiant / Dire 规则 | 杯赛模块内规则 |
| --- | --- | --- |
| 页面背景 | 使用 `--bg` / `--bg-secondary` | 不变 |
| 卡片背景 | 使用 `--surface` / `--surface-elevated` | 不变 |
| 主标题 | 使用 `--text` | Banner 内改用对应杯赛文字色 |
| 次标题 | 使用 `--text-secondary` | Banner 内使用对应文字色的 82% 到 84% 透明度 |
| 主按钮 | 使用 `--primary` / `--primary-hover` | 专题 CTA 可切换到杯赛 hover 色 |
| 链接 / 信息态 | 使用 `--accent` | 不变 |
| 模块标签 | 默认使用主题描边与文字 | 使用对应杯赛描边和文字 |
| Banner 背景 | 不在普通页面使用 | 直接使用对应杯赛色与渐变 |

### 5.7 MD3 / Tailwind Semantic Mapping

| 项目 token | 推荐 MD3 role | Tailwind 语义类 |
| --- | --- | --- |
| `--bg` | surface | `bg-surface` |
| `--bg-secondary` | surface-container-low | `bg-surface-container-low` |
| `--surface` | surface-container | `bg-surface-container` |
| `--surface-elevated` | surface-container-high | `bg-surface-container-high` |
| `--border` | outline-variant | `border-outline-variant` |
| `--text` | on-surface | `text-on-surface` |
| `--text-secondary` | on-surface-variant | `text-on-surface-variant` |
| `--primary` | primary | `bg-primary` / `text-primary` |
| `--primary-hover` | primary hover token | `hover:bg-primary-hover` |
| `--accent` | tertiary / info accent | `text-accent` / `bg-accent` |

补充说明：

- `--cup-*-dark` 优先用于 Banner 内局部深底、图片遮罩和说明胶囊
- `--cup-*-border` 优先用于 Banner 细描边、标签边框和局部强调线
- `--cup-*-text` 只在杯赛 Banner 和杯赛专题块中使用，不替代全站正文文字色

### 5.8 导航、Banner 与频道色彩规则

一级导航规则：

- 一级导航背景使用当前主题的 `--surface`，底部分割线使用 `--border`，默认文字使用 `--text-secondary`
- 一级导航 hover 使用基于 `--text` 的弱 state layer，不用杯赛主色整块铺底
- 一级导航当前态优先通过更高对比文字和轻底色表达，不直接使用杯赛色

二级导航规则：

- 默认态统一使用当前主题的 `--surface` 背景、`--border` 边框、`--text-secondary` 文字
- hover / active 态才切入杯赛色；表达方式优先为浅底、细描边、底边强调线，不把整条导航染成杯赛色
- “全部”始终使用中性骨架，不借任一杯赛主色

Banner 规则：

- Banner 只在先锋杯、传奇杯、冠绝杯三种具体范围态出现；“全部”态禁止显示 Banner
- Banner 必须位于二级导航下方、主工作台上方，宽度与顶部导航及二级导航一致
- Banner 用于承接当前范围摘要、焦点对象或轻说明，不承接第二套导航
- 同一页面只允许 1 个范围 Banner；切回“全部”时 Banner 立即消失，主工作台上提
- Banner 可使用轻渐变、低噪点纹理、方向性光带，但亮度峰值必须低于主 CTA

频道联动规则：

- /matches、/players、/teams 在具体杯赛态时，Banner、模块标题区、工具条、右栏首卡、范围标签和专题 CTA 可切换到对应杯赛色
- 正文段落、表格正文、表单输入和长阅读信息继续使用 `--text` / `--text-secondary`
- 列表卡、关系卡和表格外壳仍以当前主题的 surface 系列为主，只允许局部引入杯赛边线或标签

### 5.9 CSS Variables

```css
:root[data-theme="radiant"] {
	--bg: #111A12;
	--bg-secondary: #18231A;
	--surface: #1E2B20;
	--surface-elevated: #263629;
	--border: #314535;

	--text: #EAF3E3;
	--text-secondary: #B8C7B2;
	--text-muted: #8B9A86;

	--primary: #79B84A;
	--primary-hover: #8DCA5C;
	--accent: #58B8D8;

	--success: #67C26F;
	--warning: #D7B75A;
	--danger: #C95C4B;

	--cup-pioneer: #236D5C;
	--cup-legend: #563880;
	--cup-immortal: #853454;
}

:root[data-theme="dire"] {
	--bg: #111214;
	--bg-secondary: #181A1D;
	--surface: #202327;
	--surface-elevated: #2B2F34;
	--border: #3A3F45;

	--text: #ECE7E1;
	--text-secondary: #BEB7AF;
	--text-muted: #8C857E;

	--primary: #C04A36;
	--primary-hover: #D45A45;
	--accent: #7B6A58;

	--success: #6D9A63;
	--warning: #B88A45;
	--danger: #D45A45;

	--cup-pioneer: #236D5C;
	--cup-legend: #563880;
	--cup-immortal: #853454;
}

:root {
	--cup-pioneer-hover: #2E8C77;
	--cup-pioneer-dark: #163F36;
	--cup-pioneer-border: #4FA594;
	--cup-pioneer-text: #F3FBF8;

	--cup-legend-hover: #6D4AA1;
	--cup-legend-dark: #34214F;
	--cup-legend-border: #8A69B5;
	--cup-legend-text: #F7F3FD;

	--cup-immortal-hover: #A24569;
	--cup-immortal-dark: #552137;
	--cup-immortal-border: #BC6787;
	--cup-immortal-text: #FFF4F7;
}
```

### 5.10 状态与无障碍底线

- hover / focus / pressed 优先使用当前主题文字色或主色的弱 state layer；不要通过高饱和整块换底制造交互感
- Radiant 与 Dire 两套主题下，正文、正文链接、辅助文字与背景的对比度都必须满足 4.5:1
- 杯赛 Banner 内的标题、副文案与按钮也必须满足基本可读性；不要因渐变、纹理或光带牺牲对比
- 后台和高密度表格区不使用杯赛色做大面积底色；危险操作只使用 danger 语义，不借用杯赛红紫色制造伪风险感

Footer 视觉规则与导航栏呼应：

**设计职能：** Footer 是与导航栏相对称的页脚收束块，形成全页上下 bracket 的视觉平衡。不是装饰，而是内容回流和快速导航的实质性工具区。

**结构呼应：**
- 导航栏采用三段式（左品牌、中对象导航、右工具），Footer 也采用分段式（品牌说明、对象频道、工具与规则、版权）
- 导航栏的所有主要导航入口（对象频道、工具）必须在 Footer 中有对应的回流链接
- Footer 保持 1240 版心约束，与导航栏的 page-shell 容器宽度对齐
- Footer 上方应有明确的分界线，与正文区形成视觉断层

**颜色与层级：**
- 背景使用当前主题的 `--bg` 或 `--surface` 做淡化底色，与导航栏使用 backdrop-blur 的透光感形成对比
- 主文字（品牌名、栏目标题）使用 `--text` 或 `--text-secondary` 
- Footer 链接使用 `--text-secondary`，hover 轻度提亮到 `--text`，与导航栏的链接交互状态保持一致
- Footer 不使用任何杯赛主色做大面积铺底

**形状与间距：**
- Footer 圆角使用 shape-none 或 shape-extra-small，与导航栏的 shape-medium (rounded-xl) 形成对比
- 上下 padding 建议 pt-8 pb-10，给予充分呼吸感
- 栏目间距保持 gap-6 以上，避免拥挤感
- 链接行高 > 32px，确保 touch target 可用性
### 6.3 Tailwind 类名映射

```
text-display-lg / text-display-md / text-display-sm
text-headline-lg / text-headline-md / text-headline-sm
text-title-lg / text-title-md / text-title-sm
text-body-lg / text-body-md / text-body-sm
text-label-lg / text-label-md / text-label-sm
```

### 6.4 规则

- 标题允许带一点史诗、雕刻、赛事感，但只用于 display 和 headline 级别
- 正文、评论、攻略、筛选、按钮和后台全部使用 body / label / title 级别
- 数字信息如版本号、胜率、更新时间、比分必须一眼可读
- 中文正文单列建议 28 到 36 字一行
- 阅读页不得出现 900+ 宽度的长行正文
- label-small 只承担补充信息，不承担主引导
- 原则是"标题有世界观，正文有产品感"

## 7. Shape 与 Elevation

### 7.1 MD3 Shape Scale

MD3 定义六级 shape token，本站映射如下：

| MD3 shape | 圆角值 | Tailwind 类名 | 适用场景 |
| --- | --- | --- | --- |
| shape-none | 0dp | rounded-none | 导航轨、表格壳层、Footer 收束带、贴边 Banner 顶边 |
| shape-extra-small | 4dp | rounded | 侧栏收口、列表项边缘、单侧圆角过渡 |
| shape-small | 8dp | rounded-lg | 工具条、输入框、密集摘要卡 |
| shape-medium | 12dp | rounded-xl | 标准卡片、胶囊二级导航按钮、对话框、普通 Banner 内卡 |
| shape-large | 16dp | rounded-2xl | 首页主舞台、Detail Hero 主卡、FAB、单屏唯一主焦点块 |
| shape-extra-large | 28dp | rounded-3xl | Sheet 顶部圆角 |
| shape-full | 50% | rounded-full | Chip、Pill badge、Avatar |

### 7.2 Border（描边）

- 描边统一使用 outline-variant 色，宽度 1px
- 重要边界（输入框、高对比分区）使用 outline 色
- 不依赖重阴影堆层次；普通卡片只用描边或 tonal elevation
- 禁止玻璃拟态和高反光边框

### 7.3 MD3 Elevation（表面层级）

MD3 dark theme 优先使用 tonal color（surface-container 梯度）表达层级，shadow 仅在必要时辅助使用。

| Elevation level | MD3 surface role | 用途 | Shadow |
| --- | --- | --- | --- |
| Level 0 | surface | 页面背景 | 无 |
| Level 1 | surface-container-low | 卡片默认、列表区域 | 无 |
| Level 2 | surface-container | 导航栏、面板、抬升容器 | 无 |
| Level 3 | surface-container-high | 对话框、高亮面板、Search bar | 可选轻阴影 |
| Level 4 | surface-container-highest | 浮层、下拉菜单 | 需要阴影 |
| Level 5 | surface-container-highest + scrim | 全屏覆盖层 | scrim 遮罩 |

Shadow token（仅在需要时使用）：

- shadow-sm: 0 1px 2px rgba(0,0,0,0.3), 0 1px 3px 1px rgba(0,0,0,0.15)
- shadow-md: 0 1px 2px rgba(0,0,0,0.3), 0 2px 6px 2px rgba(0,0,0,0.15)
- shadow-lg: 0 4px 8px 3px rgba(0,0,0,0.15), 0 1px 3px rgba(0,0,0,0.3)
- shadow-xl: 0 6px 10px 4px rgba(0,0,0,0.15), 0 2px 3px rgba(0,0,0,0.3)

### 7.4 规则

- 同一屏的 shape token 不超过两档（如 shape-small + shape-medium）
- 同一屏最多同时出现三层 elevation
- 信息密度高的后台区域优先 shape-none 到 shape-small
- 详情页主卡和首页焦点卡可使用 shape-large，列表密集区优先 shape-small 到 shape-medium
- 禁止全页统一全圆角，也禁止全页统一全直角
- 推荐交叉规则：中轨主块和重点 CTA 块用 shape-medium 到 shape-large，侧轨、筛选条、表格、页脚用 shape-none 到 shape-extra-small
- 列表页优先 Level 1 / Level 2
- 详情页允许局部 Level 3
- 浮层统一使用 Level 4

## 8. Motion（MD3 动效）

MD3 motion 体系基于 duration 和 easing 两组 token。

### 8.1 Duration Token

| Token | 值 | 用途 |
| --- | --- | --- |
| duration-short1 | 50ms | 微交互（selection、toggle） |
| duration-short2 | 100ms | 快速反馈（fade in/out） |
| duration-short3 | 150ms | 按钮、chip、state layer |
| duration-short4 | 200ms | 小型展开（dropdown） |
| duration-medium1 | 250ms | 卡片 hover 位移、tooltip |
| duration-medium2 | 300ms | 导航切换、面板展开 |
| duration-medium3 | 350ms | 页面内容切换 |
| duration-medium4 | 400ms | 大面积展开 |
| duration-long1 | 450ms | 首屏入场 stagger |
| duration-long2 | 500ms | 全屏转场 |

### 8.2 Easing Token

| Token | 值 | 用途 |
| --- | --- | --- |
| easing-standard | cubic-bezier(0.2, 0, 0, 1) | 通用进出场 |
| easing-standard-decelerate | cubic-bezier(0, 0, 0, 1) | 进场（从远到近） |
| easing-standard-accelerate | cubic-bezier(0.3, 0, 1, 1) | 退场（从近到远） |
| easing-emphasized | cubic-bezier(0.2, 0, 0, 1) | 强调进出（hero 展开、page transition） |
| easing-emphasized-decelerate | cubic-bezier(0.05, 0.7, 0.1, 1) | 强调进场 |
| easing-emphasized-accelerate | cubic-bezier(0.3, 0, 0.8, 0.15) | 强调退场 |

### 8.3 规则

- hover 反馈优先使用位移、亮度、描边变化，不依赖夸张缩放
- 卡片 hover 位移建议控制在 Y 轴 -4 到 -8，duration 使用 medium1，easing 使用 standard
- hover/active/focus-visible 的 easing 优先使用 easing-standard，不使用生硬 linear
- 主卡、入口卡可增加局部 reveal 或遮罩滑移，duration 控制在 short4 到 medium2
- 页面首屏入场允许轻量 stagger，间隔 50ms，总时长不超过 long1
- 必须为 prefers-reduced-motion 提供降级：保留颜色和描边反馈，关闭位移与连续动画
- 交互感受应当是稳、准、硬朗，不是轻、弹、甜

动效禁止项：

- 禁止大幅缩放导致文字跳动
- 禁止 hover 时重新排版或导致周围卡片抖动
- 禁止连续漂浮、呼吸灯、随机闪烁等无信息价值动效
- 禁止高频扫光、全站粒子雨、过度金属翻折和注意力轰炸式特效

## 9. 组件尺寸基线

- 标准内容卡最小高度 180
- 人物、战队、比赛摘要卡常规高度 220 到 320
- 后台摘要卡最小高度 120
- 封面比例默认 16:9
- 人物卡与招募卡可用 4:5 或 1:1

页面级布局要求：

- Hero 标题区与首个证明区之间至少保留一档重区块间距
- 频道页工具条与首个列表区之间优先使用默认区块间距，不加装饰性大空白
- 阅读页正文内图片与段落的节奏优先跟随正文宽度，不单独放大成展示页海报
- 展示页大色块边界可以通过底色、直角收边、圆角、跨栏和内边距建立；首页可全宽组织舞台，其他页面必须服从 1240 页面版心
- 首页舞台可以不使用统一 page container；头图、焦点区、拼贴区可在安全区内自由展开，其他页面仍必须在 1240 版心内做不同栏宽展开
- 阅读页和后台虽然保留受控宽度，但题头、目录、信息摘要、风险操作和文末回流仍要在各自版心内以不规则块面区分层级
- 不允许出现“形状未定义，开发自行处理”这类留白；形状和拼接关系必须在文档层确定
- 社区首页和内容流的第一任务是让用户一眼看清内容类型、对象和是否值得点，不是先看材质装饰
- 主信息、次信息、操作信息必须始终分三层清楚排布，不能全做成同一种高亮金字
- 英雄、战队、版本号、赛事名必须优先于边框、粒子和纹理被识别

英雄识别规则：

- 英雄卡、话题封面、头像挂件优先使用强轮廓半身像、头部特征、武器特征、技能符号
- 小尺寸裁切后仍要能认出是谁，不能只剩一团气氛插画
- 不同英雄并排时必须保持轮廓、明度和色块的可分辨性
- 英雄识别优先于整张插画完整展示

## 10. 无障碍底线

- 正文、正文链接、辅助文字与背景对比度至少 4.5:1
- focus-visible 必须清晰可见
- 点击热区不小于 44 x 44
- 减少动态场景必须可关闭刺激性动效
- 彩色文字不得承担大段正文