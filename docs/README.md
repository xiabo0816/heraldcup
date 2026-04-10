# Docs 使用说明

## 目标

这套文档不是为了留档，而是为了把产品目标、信息架构、页面结构、内容语气、视觉约束、组件边界和 AI 输出规则固定下来，减少后续设计与实现漂移。

分期基线：

- 第一期聚焦比赛、赛季、选手、战队、我的与后台核心维护链路
- 第二期承接社区、内容、新闻、英雄及其运营关系网，统一收口到 14_phase-two-extension.md
- 读取文档时先判断当前需求属于第一期还是第二期，再进入对应 page brief 和 blueprint

## 阅读顺序

推荐按以下顺序阅读：

第一期主链路：

1. 00_project-brief.md
2. 01_information-architecture.md
3. 02_sitemap.md
4. 03_page-briefs-home.md
5. 04_page-briefs-channel-and-reading.md
6. 05_page-briefs-detail-operation-admin.md
7. 10_page-blueprint.md
8. 11_section-specs.md
9. 12_wireflow-and-state-spec.md
10. 13_component-variant-matrix.md

第二期统一入口：

11. 14_phase-two-extension.md
12. 15_phase-two-blueprints-and-specs.md

第二期通用设计规则补充：

13. 06_content-standards.md
14. 07_visual-foundations.md
15. 08_components-and-patterns.md
16. 09_ai-promptbook.md

阅读原则：

- 先看业务目标，再看结构，再看页面任务，再看页面蓝图与区块规格，再看内容、视觉、组件，最后看 AI 执行规则
- 第一期开发默认读 00 到 13；遇到社区、内容、新闻、英雄需求时，先读 14_phase-two-extension.md 和 15_phase-two-blueprints-and-specs.md，再回到通用设计规则
- IA 负责解释为什么这样分组，Sitemap 负责把结构画出来，不要混用
- Page Brief 负责单类页面目标与区块顺序，不替代组件文档和视觉规范
- Page Blueprint 负责把单页落成可执行布局规格，Section Spec 负责把区块写成可复用的硬约束
- 有交互的页面必须补 Wireflow / State Spec，不能只停在静态布局
- 如果某个页面已经有真实 blueprint 实例，后续设计和实现优先引用实例，不再退回通用模板

## 每份文档解决什么问题

### 00_project-brief.md

回答这是什么站点、服务谁、追求什么结果、不允许走向什么风格。

### 01_information-architecture.md

定义第一期顶部对象入口、顶部工具入口、对象维与杯赛范围维的双轴关系、命名原则和核心内容层级，用来约束主线分组与入口命名；第二期统一见 14_phase-two-extension.md。

补充：双轴矩阵是第一期公开对象页的导航构成，不是额外露出的一个栏目名称或独立矩阵区块；页面设计应通过“顶部对象入口 + 页面级范围条（Range Stage Band） + 当前范围驱动的正文与侧栏”共同表达，其中页面级范围条就是双轴矩阵在页面上的范围维呈现，不是普通筛选条。

### 02_sitemap.md

把第一期 IA 变成页面树和跳转关系图，用来查漏补缺并校验页面归属；第二期统一见 14_phase-two-extension.md。

### 03_page-briefs-home.md

定义首页的目标用户状态、区块顺序、唯一主任务和禁止元素。

补充：首页不参与双轴矩阵；比赛、选手、战队频道的页面级范围条只属于对象频道，不进入首页。首页与其他页面都应在文档中定义 Footer 收束规则。

### 04_page-briefs-channel-and-reading.md

定义第一期频道页、阅读页、静态说明页的结构模板与任务优先级；第二期统一见 14_phase-two-extension.md。

补充：比赛、选手、战队三个频道页采用双轴矩阵设计：顶部对象入口承载对象维，页面级范围条承载杯赛范围维并负责当前范围舞台的视觉表达；首页、阅读页、操作页、后台页不参与双轴矩阵。

### 05_page-briefs-detail-operation-admin.md

定义第一期详情页、操作页、后台页的结构、状态和风险控制要求；第二期统一见 14_phase-two-extension.md。

### 06_content-standards.md

定义品牌语气、标题规则、按钮文案、长度约束、模板文案和禁用表达。

### 10_page-blueprint.md

定义每个核心页面的蓝图包：区块顺序、布局模式、注意力路径、主 CTA、响应式和 promptframe 约束。

### 11_section-specs.md

定义区块级规格表：布局、内容槽位、允许组件、禁止项、组件变体和 AI 生成约束。

### 12_wireflow-and-state-spec.md

定义有交互页面的流转和状态：触发条件、切换路径、表单反馈、空态、错态和权限态。

### 13_component-variant-matrix.md

定义共享组件的变体矩阵：size、tone、state、density、responsive 行为，避免页面各自发明组件。

### 07_visual-foundations.md

定义色彩、字体、间距、圆角、边框、阴影、栅格、断点和对比度底线。

补充：其中包含页面级范围条与全站 Footer 的视觉规则，不要只定义主体区块而漏掉页底收束区。

### 08_components-and-patterns.md

定义共享组件、变体、状态、适用边界和常见页面 pattern，优先用于复用而不是重新发明区块。

### 09_ai-promptbook.md

定义 AI 的默认执行顺序、复用规则、输出格式、响应式要求和生成后的自检清单。

## 常见使用场景

### 新做一个页面

先看：

1. 00_project-brief.md
2. 01_information-architecture.md
3. 02_sitemap.md
4. 对应的 page brief
5. 10_page-blueprint.md
6. 11_section-specs.md
7. 如果有交互，再看 12_wireflow-and-state-spec.md
8. 13_component-variant-matrix.md
9. 07_visual-foundations.md
10. 08_components-and-patterns.md
11. 09_ai-promptbook.md

优先级补充：

- 如果 10_page-blueprint.md 中已经存在该页面或同页面家族实例，先用实例，再用模板
- 如果 11_section-specs.md 中已经存在同名区块实例，先套实例，不要重新造一个近似区块
- 如果 12_wireflow-and-state-spec.md 中已经存在该交互流，状态命名必须复用现有定义

### 先看现成实例再写

目前已经有真实实例可直接参考的页面家族：

1. 首页与比赛中心
2. 选手、战队、新闻、社区四个频道页
3. 赛季详情、比赛详情、选手详情、战队详情
4. 话题详情、招募详情、活动详情、公告阅读页
5. 我的主页、申请记录、登录页
6. 英雄目录、FAQ、后台首页、后台列表/编辑/审核页家族

### 改导航、栏目命名或入口层级

先看 01_information-architecture.md，再同步检查 02_sitemap.md 与受影响的 page brief。

修改时先判断你改的是哪一层：顶部对象入口、顶部工具入口、对象页页面级范围条，还是首页内容入口侧轨；不要把四层写成同级。

双轴矩阵由对象导航、页面级范围条（二级导航）、条件性范围 Banner、当前范围侧栏说明、跨对象范围连续性共同构成，不单独形成一个命名区块。

页面级范围条就是比赛、选手、战队频道页的二级导航，不是单独的页内小组件，也不是普通筛选条；它本质上是一条紧贴顶部导航栏的简单范围导航条，宽度与顶部导航一致，高度与顶部导航接近，固定承载 4 个范围入口。“全部”态不展示 Banner，只有切到具体杯赛态时才展示对应的范围 Banner。

比赛、选手、战队三个频道页的首屏层级必须固定读成“顶部导航 -> 二级导航（页面级范围条） -> 条件性范围 Banner（仅具体杯赛态） -> 主工作台或主目录”；不允许把 Banner 提到页面级范围条上方，也不允许让 Banner 夹在顶部导航与二级导航之间。

二级导航的 UI 层级必须服从“顶部导航主、二级导航次、Banner 再次、正文为主内容”的顺序：顶部导航在对比度、厚度和全站身份上最强；二级导航贴顶但弱一档，不抢顶部导航；Banner 只做当前杯赛补充，不得长成第二个导航头。

如果涉及社区、内容、新闻、英雄，默认先看 14_phase-two-extension.md，再同步核对通用设计规则。

### 改文案、CTA 或空态表达

先看 06_content-standards.md，再回查对应 page brief，确认页面任务没有被文案覆盖掉。

### 改颜色、字号、间距、表面层级

只先看 07_visual-foundations.md；如果需要改变组件表现，再补看 08_components-and-patterns.md。

### 改页面布局、区块顺序或响应式结构

先看对应的 page brief，再看 10_page-blueprint.md 和 11_section-specs.md；如果页面涉及筛选、提交、弹层或切换，再同步看 12_wireflow-and-state-spec.md。

### 新增组件或组合 pattern

先看 08_components-and-patterns.md 和 13_component-variant-matrix.md，确认现有组件及其变体是否已经能承载。只有现有组件无法表达时，才允许新增。

### 让 AI 直接产出页面结构或代码

必须先提供对应 page brief，再附上 10_page-blueprint.md、11_section-specs.md；有交互时补 12_wireflow-and-state-spec.md，再附上 07_visual-foundations.md、08_components-and-patterns.md、13_component-variant-matrix.md、09_ai-promptbook.md 的约束。

如果该页面已经在 10_page-blueprint.md 中有真实实例，提示里必须明确引用该实例，而不是只说“按频道页模板生成”。

## 协作规则

- 新页面先补或更新 page brief，再开始设计和实现
- 新页面在进入设计稿或代码前，必须补 page blueprint；复杂页面同步补 section spec
- 登录、筛选、表单、弹层、切换、后台编辑等页面，必须补 wireflow / state spec
- 已有 blueprint / section / state / variant 实例的页面家族，后续必须直接复用实例命名和结构
- 新组件先判断是否属于组件，还是只是某个 pattern 的实例
- 组件变体变化必须同步更新组件变体矩阵，不要只改页面实现
- 导航、命名、栏目归属的修改必须同时更新 IA 和 Sitemap
- 文案策略变化必须同步更新内容规范，不要只改页面实现
- 视觉 token 变化必须同步到视觉基础文档，不要只改样式文件
- AI 生成结果如果连续两次偏移，优先补文档，不要反复口头修正

## 最小执行路径

如果时间有限，至少按这条链路工作：

1. Project Brief
2. IA
3. Sitemap
4. 对应 Page Brief
5. Page Blueprint
6. Section Spec
7. Visual Foundations
8. Components and Patterns
9. AI Promptbook

这条路径已经足够支撑大多数页面设计、实现和 AI 协作；如果页面存在交互流转，再额外补 Wireflow / State Spec。