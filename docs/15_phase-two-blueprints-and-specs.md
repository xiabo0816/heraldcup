# 今晚就来社区 / 第二期蓝图与规格

本文件已归档。

- 第二期 Blueprint、Section Spec、Wireflow 与组件模式已统一并入 16_phase-two-features.md
- 如无兼容性需求，不再从本文件进入第二期设计与实现流程

## 1. 这份文档解决什么问题

- 承接第二期页面的 Blueprint、Section Spec、Wireflow 与组件变体规则
- 让 10_page-blueprint.md、11_section-specs.md、12_wireflow-and-state-spec.md、13_component-variant-matrix.md 回到第一期主线与全站通用规则
- 避免第二期页面实例继续散落在多份第一期文档末尾

使用方式：

- 第二期先读 16_phase-two-features.md 明确页面职责与范围
- 再读本文件确定页面蓝图、区块规格、状态流与组件模式
- 第二期页面统一继承顶部对象入口与顶部工具入口，但不再启用第一期比赛 / 选手 / 战队的页面级范围条与条件性 Banner 结构

## 2. 第二期 Blueprint 实例

### 2.1 新闻频道 /news

页面名称：新闻频道
路由：/news
页面类型：channel
页面目标：让新闻先承担“回流到比赛、话题和战队”的任务，而不是历史海报归档页
唯一主 CTA：先看比赛
次 CTA：社区主线
用户状态：看战报的用户；找专题的用户；想从新闻回到社区主线的用户

布局总览：

| 区块顺序 | 区块名称 | 目标 | 布局模式 | 主视觉权重 | 组件 | 主动作 |
| --- | --- | --- | --- | --- | --- | --- |
| 1 | News Intro With Headline | 讲清新闻主线并给一条当前头条 | PageIntro 8 + 4 | A | PageIntro / SurfaceCard | 继续阅读 |
| 2 | News Filter Sidebar | 用内容类型、主线话题、历史归档缩小入口 | 4 栏侧筛 | B | SurfaceCard / Button | 切换类型 |
| 3 | News Stream Stack | 把新闻与专题、赛事回流、历史归档分层展示 | 主栏单列分段 | B | SurfaceCard / NewsCard | 打开新闻正文 |
| 4 | Channel Summary | 给当前筛选结果和浏览说明 | 整宽说明卡 | C | SurfaceCard | 浏览当前结果 |

### 2.2 社区首页 /community

页面名称：社区首页
路由：/community
页面类型：channel
页面目标：把公告、活动、话题、招募和赛后内容收束成一条可继续浏览的社区主线
唯一主 CTA：打开话题主线
次 CTA：查看招募
用户状态：第一次进入社区的用户；沿比赛回流来的用户；想找活动和招募的用户

布局总览：

| 区块顺序 | 区块名称 | 目标 | 布局模式 | 主视觉权重 | 组件 | 主动作 |
| --- | --- | --- | --- | --- | --- | --- |
| 1 | Community Intro With Hot Zone | 讲清社区主线并给今晚热区 | PageIntro 8 + 4 | A | PageIntro / SurfaceCard | 打开话题主线 |
| 2 | Community Docs Strip | 给规则、指引、FAQ、活动的轻入口 | 4 卡网格 | B | SurfaceCard / Link | 打开社区文档 |
| 3 | Community Channel Grid | 左侧公告与热门话题，右侧主内容流 | 4 + 10 | B | PageGrid / SurfaceCard | 打开公告、话题、内容 |
| 4 | Post Match Relay | 把新闻与最近完赛并列，形成赛后回流 | 6 + 6 | B | SurfaceCard / Link | 打开新闻或比赛 |
| 5 | Honor And Spotlight | 用荣誉榜和人物聚光连接赛事与社区人物 | 6 + 6 | C | SurfaceCard / Link | 去战队或人物页 |
| 6 | Recruitment Entry Grid | 让招募成为明确参与入口 | 3 卡网格 | C | SurfaceCard / Badge | 查看招募 |

### 2.3 社区详情页家族

页面名称：社区详情页家族
路由：/community/topics/[slug]；/community/recruitments/[slug]；/community/activities/[slug]；/community/announcements/[slug]
页面类型：detail | reading
页面目标：让用户在读完当前对象后，能沿同一条社区主线继续进入比赛、内容、活动或招募
唯一主 CTA：查看主线对象或联系队伍或参与活动
次 CTA：返回对应列表 / 回到社区首页

布局总览：

| 区块顺序 | 区块名称 | 目标 | 布局模式 | 主视觉权重 | 组件 | 主动作 |
| --- | --- | --- | --- | --- | --- | --- |
| 1 | Topic Or Reading Intro | 先讲清对象和当前状态 | PageIntro 或 DetailHero | A | PageIntro / DetailHero / SurfaceCard | 返回列表或参与动作 |
| 2 | Topic Tabs Or Reading Body | 话题页用 Tabs 聚合，公告页用正文流，招募/活动页用要求与说明主区 | 8 + 4 或 reading | B | PageGrid / ReadingFlow / SurfaceCard | 查看关联对象 |
| 3 | Relation Clusters | 将比赛、内容、活动、招募关系成组摆放 | 2 列或 4 卡网格 | B | SurfaceCard / Link / Badge | 进入关系对象 |
| 4 | Action Aside | 招募联系方式、活动报名、阅读快捷入口统一放在侧轨 | 4 栏侧轨 | C | SurfaceCard / Button / Link | 联系 / 报名 / 返回 |

### 2.4 英雄目录与 FAQ

页面名称：英雄目录与 FAQ
路由：/heroes；/community/faq
页面类型：channel | reading
页面目标：前者帮助用户快速缩小英雄范围并进入单页，后者提前解答高频问题并引导回规则或指引
唯一主 CTA：查看英雄资料或查看规则
次 CTA：浏览选手名册 / 查看指引 / 回到社区

布局总览：

| 区块顺序 | 区块名称 | 目标 | 布局模式 | 主视觉权重 | 组件 | 主动作 |
| --- | --- | --- | --- | --- | --- | --- |
| 1 | Utility Intro | 建立目录或 FAQ 的使用方式 | PageIntro 或轻标题区 | A | PageIntro / SurfaceCard | 查看规则或进入频道 |
| 2 | Directory Aside Or FAQ Groups | 英雄页左侧是属性目录，FAQ 首页中段是问题组卡片 | 4 + 10 或 3 列 | B | PageGrid(channel) / SurfaceCard / Link | 跳到分组 |
| 3 | Main Grid Or Answers | 英雄矩阵或 FAQ 解答正文 | channel 主栏或阅读卡流 | B | SurfaceCard / Link / Image | 查看详情 |
| 4 | Return CTA | 在尾部把用户送回比赛、规则或身份页 | 双列或 CTA 带 | C | SurfaceCard / Button / Link | 返回对应页面 |

### 2.5 第二期后台扩展

页面名称：第二期后台工作页家族
路由：/admin/news；/admin/announcements；/admin/topics；/admin/recruitments；/admin/activities；/admin/content-pages；/admin/content
页面类型：admin
页面目标：保证第二期内容运营模块沿用统一后台秩序，不与第一期审核和资料维护混排

布局总览：

| 区块顺序 | 区块名称 | 目标 | 布局模式 | 主视觉权重 | 组件 | 主动作 |
| --- | --- | --- | --- | --- | --- | --- |
| 1 | AdminPageIntro | 讲清当前资源和今日任务 | 标题区 + 动作区 | A | AdminPageIntro | 新建或审核 |
| 2 | Filtered List Workspace | 列表页承接筛选、统计、表格和分页 | 工具条 + 列表 | B | AdminListPanel / Table / Badge | 查看对象 |
| 3 | Admin Workspace Split | 编辑页把表单放左、预览与说明放右 | 6 + 8 或 7 + 5 | B | AdminWorkspace / AdminSidePanel / Form | 保存或发布 |
| 4 | Risk And Audit Footer | 高风险操作和历史记录始终在页底收束 | 双列 | C | AdminSidePanel / Table / Dialog | 下线、回滚、删除 |

## 3. 第二期 Section Specs

### 3.1 Topic Aggregate Tabs

| 字段 | 内容 |
| --- | --- |
| 区块名称 | Topic Aggregate Tabs |
| 用途 | 将活动、比赛、内容、招募按稳定分类聚合在同一条话题主线下 |
| 布局 | 顶部 Tabs + 下方分区卡流 |
| 栅格占比 | 14 栏整宽 |
| 内容槽位 | tabs 4 个，分区 2-4 组，卡片每组 0-4 张 |
| 允许组件 | Tabs / SurfaceCard / Link / Badge |
| 允许变体 | Tabs.style=segmented；SurfaceCard.tone=default|muted|accent |
| 禁止 | 每个 Tab 再做 Hero；分区缺空态；不同实体混成一条无标签列表 |
| 响应式 | xs tabs 换行，卡片改单列 |

### 3.2 Recruitment Contact Aside

| 字段 | 内容 |
| --- | --- |
| 区块名称 | Recruitment Contact Aside |
| 用途 | 把招募联系方式、关联话题和同队其他职位稳定放在右侧行动区 |
| 布局 | 4 栏侧轨 |
| 栅格占比 | lg 4；xs 单列下沉 |
| 内容槽位 | 联系方式 1 块，关联话题 0-1 块，同队职位 0-3 条 |
| 允许组件 | SurfaceCard / Link / Button / Badge |
| 允许变体 | SurfaceCard.tone=accent|muted；Badge.tone=success|warning|neutral |
| 禁止 | 联系方式早于要求说明；联系方式藏在正文末尾；过期状态仍展示激进 CTA |
| 响应式 | xs 下沉到正文和相关内容之后 |

### 3.3 Activity Action Rail

| 字段 | 内容 |
| --- | --- |
| 区块名称 | Activity Action Rail |
| 用途 | 在活动详情页侧栏稳定承接报名、所属话题和联动资源 |
| 布局 | 4 栏侧轨 |
| 栅格占比 | lg 4；xs 单列 |
| 内容槽位 | 报名卡 0-1 张，所属话题 0-1 张，联动比赛 0-3 条，相关招募 0-3 条 |
| 允许组件 | SurfaceCard / Link / Button / Badge |
| 允许变体 | SurfaceCard.tone=accent|default|muted |
| 禁止 | 活动结束后保留误导性报名按钮；联动资源比活动说明更重 |
| 响应式 | xs 报名卡保留在第一位，其余资源纵向堆叠 |

### 3.4 Hero Attribute Directory

| 字段 | 内容 |
| --- | --- |
| 区块名称 | Hero Attribute Directory |
| 用途 | 用属性分组和焦点英雄帮助用户缩小浏览范围 |
| 布局 | 4 栏目录 + 10 栏矩阵 |
| 栅格占比 | lg 4 + 10；xs 单列 |
| 内容槽位 | 属性组 4 个，焦点英雄 0-4 个，英雄卡若干 |
| 允许组件 | PageGrid / SurfaceCard / Link / Image |
| 允许变体 | PageGrid.variant=channel；SurfaceCard.tone=default|accent |
| 禁止 | 巨型海报；不同卡片高度策略混用；目录不具备锚点 |
| 响应式 | xs 目录置顶为单列导航，矩阵卡片单列或双列 |

### 3.5 FAQ Cluster Grid

| 字段 | 内容 |
| --- | --- |
| 区块名称 | FAQ Cluster Grid |
| 用途 | 以问题组卡片而非长文形式承接高频问题 |
| 布局 | 3 列问题组 + 2 列收束区 |
| 栅格占比 | lg 3 列；xs 单列 |
| 内容槽位 | 问题组 3 个，每组问题 2-4 条，尾部收束卡 2 张 |
| 允许组件 | SurfaceCard / Link |
| 允许变体 | SurfaceCard.tone=default|muted |
| 禁止 | 把 FAQ 做成规则页全文复制；问题卡没有主题分组 |
| 响应式 | xs 问题组和收束卡都改为单列 |

## 4. 第二期 Wireflow

### 4.1 新闻类型切换 /news

页面名称：新闻频道类型切换
交互目标：在不打断阅读的前提下切换全部、快报、战报、专题和归档类型

起点状态：默认全部类型
触发动作：点击类型按钮
成功状态：更新 URL 查询参数、侧栏当前态、摘要计数和主内容分段
失败状态：保留当前按钮高亮和上一组内容，显示轻量错误说明
空状态：当前类型下没有内容时显示“当前类型暂无内容”，并给出返回全部入口

### 4.2 社区首页导流 /community

页面名称：社区导流流转
交互目标：让用户从公告、活动、热门话题快速进入一条明确的社区主线

起点状态：显示今晚热区、公告与活动、热门话题
触发动作：点击热区胶囊；点击公告卡；点击话题条目
成功状态：进入对应详情页或话题页，来源信息保留在浏览历史中
失败状态：目标内容不可用时显示“内容暂不可访问”，并提供回到社区首页入口
空状态：某一分区为空时保留区块标题并给出说明，不整块消失

### 4.3 话题详情 Tabs /community/topics/[slug]

页面名称：话题详情聚合
交互目标：在活动、比赛、内容、招募四类资源之间快速切换，同时保持同一条主线感

起点状态：进入话题详情页，顶部展示默认聚合段与锚点入口
触发动作：点击 Tabs 或锚点；点击关联卡片；目标内容为空
成功状态：滚动到对应分区或切换到对应分区，当前态明确可见
失败状态：目标分区数据加载失败时保留当前分区并显示“主线资源加载失败，请重试”
空状态：某一分区无数据时显示空态说明，但保留分区标题与返回社区入口

### 4.4 招募详情状态 /community/recruitments/[slug]

页面名称：招募详情
交互目标：让用户先判断岗位与队伍是否匹配，再决定是否联系

起点状态：打开招募详情页，展示要求说明、队伍说明和侧栏联系方式
触发动作：点击联系方式；点击关联话题；点击其他职位；招募状态变化为暂停或关闭
成功状态：用户进入外部或站内联系方式，或继续浏览同队其他职位与话题主线
失败状态：联系方式无效时显示“当前联系方式不可用，请稍后重试”并保留其他回流入口
空状态：无关联比赛或内容时，相关区块保留轻说明而不消失

### 4.5 活动详情状态 /community/activities/[slug]

页面名称：活动详情
交互目标：根据活动状态决定是否展示报名动作，并把用户继续送到话题、比赛和内容主线

起点状态：活动详情页已打开，显示正文、报名卡和侧栏联动资源
触发动作：点击报名入口；活动状态变化；联动资源为空；CTA 链接失效
成功状态：跳转到活动报名或外部参与入口，并保留回到站内的路径
失败状态：CTA 无法访问时显示错误反馈，并提供话题页或活动列表替代入口
空状态：没有联动比赛、内容或招募时，保留说明卡但不删整块

## 5. 第二期组件与模式

### 5.1 NewsCard

| 属性 | 允许值 |
| --- | --- |
| kind | news | recap | champion | poster | custom |
| emphasis | normal | featured |
| metaLinks | none | topic | match | teams | mixed |

规则：

- featured 只给频道头条或首页推荐位
- poster 和 champion 只在归档语境使用
- 单卡 meta 链接不超过 4 个
- 头条卡必须先让人读懂标题、对象和看点，不允许海报风封面压过信息层级

### 5.2 Community Entry Card

| 属性 | 允许值 |
| --- | --- |
| kind | doc | announcement | topic | event | recruitment |
| tone | default | muted | accent |
| action | full-card | inline-link |

规则：

- doc 默认为 default
- announcement 和 topic 可以使用 accent，但同屏不超过 2 张
- recruitment 卡优先 full-card，避免隐藏入口

### 5.3 Topic Tabs / Aggregate Groups

| 属性 | 允许值 |
| --- | --- |
| style | segmented | underline |
| count | 3 | 4 |
| state | default | active | disabled |

规则：

- 话题详情默认 style=segmented 且 count=4
- disabled 只在某分区明确不可用时使用，不用于单纯空态
- Tabs 只承担分类切换，不承担主 CTA

### 5.4 Recruitment Status Badge / Contact Card

| 属性 | 允许值 |
| --- | --- |
| status | open | tryout | paused | closed | archived |
| cardTone | accent | muted |
| contactMode | direct | read-only |

规则：

- open 和 tryout 可以使用 contactMode=direct
- paused、closed、archived 必须降级为 read-only
- 联系方式卡最多一个主动作，不允许和相关资源卡争抢主权重

### 5.5 Activity CTA Card

| 属性 | 允许值 |
| --- | --- |
| state | open | upcoming | finished | unavailable |
| emphasis | normal | featured |
| action | none | single |

规则：

- open 可以 action=single
- finished 和 unavailable 必须 action=none
- featured 只允许在活动详情侧栏第一块，不允许在正文重复出现

### 5.6 Hero Directory Card

| 属性 | 允许值 |
| --- | --- |
| size | compact | default |
| emphasis | normal | featured |
| media | image | initial |

规则：

- featured 只用于焦点英雄或首屏推荐
- 英雄目录卡优先可读性和识别度，不使用巨型海报式封面
- 同一矩阵内不混用超过两种视觉权重

## 6. 使用规则

- 第二期页面的详细蓝图、区块、状态流和组件模式，统一以本文件为准
- 第一期开发表述若需要引用第二期，只保留入口，不再复制完整实例