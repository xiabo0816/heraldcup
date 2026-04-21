# Docs 使用说明

## 目标

这套文档用于固定产品目标、信息架构、页面规格、视觉约束、组件边界和 AI 生成规则，减少设计与实现漂移。

分期基线：

- 第一期聚焦比赛、赛季、选手、战队、我的与后台核心维护链路
- 第二期聚焦社区、新闻、活动、招募、英雄与内容运营，统一收口到 16_phase-two-features.md
- 先判断需求属于哪一期，再进入对应页面规格

## 文档地图

### 1. 战略层

- 00_project-brief.md：站点目标、受众、风格边界
- 06_content-standards.md：文案、标题、CTA、空态表达

### 2. 结构层

- 01_information-architecture.md：导航分层、对象维与范围维、命名原则
- 02_sitemap.md：第一期页面树与主跳转，只负责查页面归属
- 16_phase-two-features.md：第二期的 IA、Sitemap、Page Brief、Blueprint、Section、Wireflow 统一入口

### 3. 页面实施层

- 03_page-briefs-home.md：首页目标、区块顺序、禁止项
- 04_page-briefs-channel-and-reading.md：第一期频道页、阅读页、静态说明页
- 05_page-briefs-detail-operation-admin.md：第一期详情页、操作页、后台页
- 10_page-blueprint.md：页面级布局蓝图与实例
- 11_section-specs.md：区块级硬约束与 promptframe
- 12_wireflow-and-state-spec.md：交互流、状态切换、空错权限态

### 4. 系统约束层

- 07_visual-foundations.md：基于 Material Design 3 的色彩 role、shape scale、elevation、版式、导航与 Footer 视觉规则（含 Radiant / Dire 双主主题、先锋杯 / 传奇杯 / 冠绝杯 Banner 色、组件映射与 CSS variables）
- 08_components-and-patterns.md：共享组件与复用模式
- 09_ai-promptbook.md：AI 执行顺序、输出格式、自检清单
- 13_component-variant-matrix.md：组件变体矩阵

## 阅读路径

### 第一期默认路径

1. 00_project-brief.md
2. 01_information-architecture.md
3. 02_sitemap.md
4. 对应 page brief
5. 10_page-blueprint.md
6. 11_section-specs.md
7. 有交互时补 12_wireflow-and-state-spec.md
8. 07_visual-foundations.md
9. 08_components-and-patterns.md
10. 13_component-variant-matrix.md
11. 09_ai-promptbook.md

### 第二期默认路径

1. 16_phase-two-features.md
2. 06_content-standards.md
3. 07_visual-foundations.md
4. 08_components-and-patterns.md
5. 09_ai-promptbook.md
6. 13_component-variant-matrix.md

说明：14_phase-two-extension.md 与 15_phase-two-blueprints-and-specs.md 仅保留归档说明，不再作为工作入口。

## 按任务查文档

| 你要做什么 | 先看 | 再看 |
| --- | --- | --- |
| 新做第一期页面 | 对应 page brief | 10 -> 11 -> 12 |
| 新做第二期页面 | 16_phase-two-features.md | 07 -> 08 -> 09 |
| 改导航、入口层级、栏目命名 | 01_information-architecture.md | 02_sitemap.md 与受影响 page brief |
| 改页面结构、区块顺序、响应式 | 对应 page brief | 10_page-blueprint.md、11_section-specs.md |
| 改表单、弹层、筛选、切换 | 对应 page brief | 12_wireflow-and-state-spec.md |
| 改文案、CTA、空态 | 06_content-standards.md | 对应 page brief |
| 改颜色、字号、间距、表面层级 | 07_visual-foundations.md | 08_components-and-patterns.md、13_component-variant-matrix.md |
| 新增组件或 pattern | 08_components-and-patterns.md | 13_component-variant-matrix.md |
| 让 AI 产出页面或代码 | 对应 page brief | 10、11、12、07、08、09、13 |

## 唯一来源规则

- 导航层级、对象维、范围维只在 01_information-architecture.md 定义
- 第一期开页归属和主跳转只在 02_sitemap.md 汇总，不重复解释导航设计原因
- 页面目标、主 CTA、必须区块、禁止项以 03 到 05 为准
- 单页布局与实例以 10_page-blueprint.md 为准
- 区块级硬约束与 promptframe 以 11_section-specs.md 为准
- 交互流与状态命名以 12_wireflow-and-state-spec.md 为准
- 视觉 token、Radiant / Dire 主题切换与三杯赛 Banner 色规则以 07_visual-foundations.md 为准
- 第二期页面规格统一以 16_phase-two-features.md 为准

## 协作规则

- 新页面先补或更新 page brief，再进入设计或实现
- 新页面在进入设计稿或代码前，至少补 page blueprint；复杂页面同步补 section spec
- 登录、筛选、表单、弹层、切换、后台编辑等页面，必须补 wireflow / state spec
- 有实例的页面家族优先复用实例命名和结构，不重新发明近似版本
- 导航与栏目归属调整时，必须同时更新 IA 和 Sitemap
- 视觉 token、文案策略、组件变体变化时，必须同步更新各自唯一来源文档
- 视觉与 Tailwind 实现描述统一先写 MD3 语义角色，再写本项目 token；避免在蓝图和 Prompt 中直接散写 hex、Tailwind 色系名或默认大圆角
- AI 结果连续偏移时，优先补文档，不反复口头纠偏

## 最小执行路径

时间有限时，至少按这条链路工作：

1. Project Brief
2. IA
3. Sitemap
4. 对应 Page Brief
5. Page Blueprint
6. Section Spec
7. Visual Foundations
8. Components and Patterns
9. AI Promptbook

页面存在交互流转时，再补 Wireflow / State Spec。