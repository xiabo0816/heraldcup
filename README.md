# 今晚就来社区

这是一个基于 Next.js 15、React 19、Prisma 和 PostgreSQL 设计的 Dota2 社区赛事门户，用来替代原先的静态 HTML 海报集合。

项目定位不是纯后台，而是“今晚就来社区”的前台社区门户 + 一个轻量管理后台：

- 前台负责展示赛程、战队、冠军、海报、快报、战报和选手资料
- 后台只负责维护内容、队伍、比赛、赛事与选手数据

## 目标

- 用统一的数据模型管理选手、队伍、比赛、赛事和内容页
- 提供前台展示、后台 CRUD、正式账号认证、SteamID 绑定和 OpenDota 报告生成
- 将海报页、冠军页、快报页改造成结构化内容，而不是继续维护零散 HTML

## 技术栈

- Next.js 15 App Router
- React 19
- TypeScript
- Tailwind CSS
- Prisma
- PostgreSQL
- Zod

## 当前定位

- 前台门面：围绕先锋杯、冠绝杯、社区战队、赛程和内容页组织首页
- 小管理后台：仅作为内容维护与数据录入入口，不作为产品首页重心
- 英雄资料库：擅长英雄不再只是字符串，而是可以映射到 Dota2 全英雄头像数据

## 已实现骨架

- 首页、选手池、队伍池、比赛池、内容库、我的、后台首页
- 后台资源模块入口：认领审核、选手、队伍、比赛、赛事、内容页、公告、话题、招募、活动
- Prisma 数据模型：选手、队伍、赛事、赛季、比赛、绑定、报告、申请、认证会话、内容页
- 正式账号注册 / 登录 / 退出接口
- SteamID 绑定与选手认领申请接口
- OpenDota 报告服务层
- Dota2 全英雄数据库模型与同步脚本
- 我的页基于真实服务端身份状态显示账号、Steam、申请和认证选手能力
- 用户申请历史页与后台审核详情页
- 前台详情页：选手、队伍、比赛、内容
- 前台实体跳转闭环：选手、队伍、比赛、内容之间可互相跳转
- 首页已按社区赛事门户思路重构，参考旧站的 Hero、赛程、战队、内容布局重新组织

## 当前前台路由

- /: 首页，展示当前推荐赛季、焦点比赛、架构原则和最新内容
- /players: 选手池列表页
- /players/[slug]: 选手详情页，可跳转到当前队伍和高光比赛
- /teams: 队伍池列表页
- /teams/[slug]: 队伍详情页，可跳转到现役成员和相关比赛
- /matches: 比赛池列表页
- /matches/[slug]: 比赛详情页，可跳转到主客队、相关选手和关联内容
- /content: 内容库列表页，统一浏览海报、冠军页、快报、战报和自定义内容
- /content/[slug]: 内容详情页，可跳转到关联比赛和主客队
- /my: 身份中心，包含注册、登录、Steam 绑定、申请提交和认证选手能力
- /my/claims: 当前登录账号的认领申请历史
- /admin: 后台首页
- /admin/claims: 后台认领审核列表
- /admin/claims/[id]: 单条申请的审核详情

## 内容库说明

- 内容库使用 ContentPage 模型统一承载原来的海报页、冠军页、快报页和赛后战报
- 当前支持的内容类型：poster、champion、news、recap、custom
- 内容列表页会展示：内容类型、推荐标记、发布时间、摘要、关联赛事/赛季、关联比赛、主队、客队
- 首页会前置展示最新内容，便于从赛事首页直接进入内容浏览

## 内容库筛选参数

内容列表页通过查询参数 type 进行筛选：

- /content: 查看全部内容
- /content?type=poster: 只看海报
- /content?type=champion: 只看冠军页
- /content?type=news: 只看快报
- /content?type=recap: 只看战报
- /content?type=custom: 只看自定义内容

如果传入不支持的 type 值，页面会自动回退到全部内容。

## 本地开发

1. 安装依赖

	npm install

2. 配置环境变量

	复制 .env.example 为 .env 并填写 DATABASE_URL。

3. 生成 Prisma Client

	npm run prisma:generate

4. 执行数据库迁移

	npm run prisma:migrate

5. 写入示例数据

	npm run prisma:seed

	默认会创建一个管理员账号：

	邮箱：admin@heraldcup.local
	密码：HeraldCupAdmin123

6. 导入历史赛事数据

	npm run prisma:seed:historical

7. 导入 Dota2 全英雄数据库

	npm run prisma:seed:heroes

8. 启动开发环境

	npm run dev

9. 打开浏览器

	访问 http://localhost:3000

## 快速启动

如果你只是想先把项目跑起来看页面，按下面顺序执行即可：

1. 安装依赖

	npm install

2. 创建本地环境变量文件

	cp .env.example .env

3. 如果你还没有安装 PostgreSQL，可以先在 macOS 上执行

	brew install postgresql@16
	brew services start postgresql@16

	如果你使用 Homebrew 安装，`createdb` 和 `psql` 默认不一定在 PATH 中；可以临时执行：

	export PATH="/opt/homebrew/opt/postgresql@16/bin:$PATH"

	如果想永久生效，可以把上面这一行追加到 ~/.zshrc。

4. 确保本地 PostgreSQL 可用，并创建数据库 heraldcup

	createdb heraldcup

	如果你使用 Homebrew 的默认本地数据库，.env 中的 DATABASE_URL 通常更适合写成：

	DATABASE_URL="postgresql://xiabo@localhost:5432/heraldcup"

	如果你的本地用户名、端口或认证方式不同，就改成你自己的连接串。

5. 生成 Prisma Client

	npm run prisma:generate

6. 执行迁移并初始化当前赛季数据

	npm run prisma:migrate
	npm run prisma:seed

	初始化后可直接使用默认管理员账号登录后台审核流程：

	邮箱：admin@heraldcup.local
	密码：HeraldCupAdmin123

6. 如果需要导入历史赛事数据，再执行

	npm run prisma:seed:historical

7. 同步 Dota2 全英雄数据

	npm run prisma:seed:heroes

8. 启动开发服务器

	npm run dev

9. 访问

	http://localhost:3000

## 常见启动问题

- 如果看到数据库连接错误：

	优先检查 .env 中的 DATABASE_URL 是否正确，以及本地 PostgreSQL 是否已经启动。

- 如果执行 Prisma 命令时报 DATABASE_URL 缺失：

	当前项目使用 prisma.config.ts。请先确认 .env 已正确配置，并在执行迁移时让 shell 加载环境变量。

- 如果提示 createdb 或 psql command not found：

	说明 PostgreSQL 客户端还没安装，或者没有加入 PATH。macOS + Homebrew 场景下先执行 brew install postgresql@16 和 brew services start postgresql@16，再把 /opt/homebrew/opt/postgresql@16/bin 加入 PATH。

- 如果 Prisma 报错找不到数据库：

	先手动创建数据库，再重新执行 npm run prisma:migrate。

- 如果只是想验证前端页面是否能打开：

	也建议先完成最小数据库初始化，因为当前项目的数据查询默认依赖 Prisma 连接；虽然部分页面有 demo fallback，但数据库环境仍然应当先配好。

- 如果选手资料里看不到英雄头像：

	先确认已经执行 npm run prisma:seed:heroes，并且数据库里已经同步了 Hero 表数据。

- 如果 3000 端口被占用：

	可以执行 npm run dev -- --port 3001，然后访问 http://localhost:3001。

## 目录说明

- app: 页面与 API 路由
- components: 通用 UI 组件
- lib: 数据访问、验证和 OpenDota 服务
- prisma: 数据模型与种子数据

历史比赛、往届赛季和旧内容迁移数据不建议继续混在主 seed 中，当前已经拆分到独立的初始化脚本 [prisma/seed-historical.ts](prisma/seed-historical.ts) 和数据源 [prisma/historical-data.ts](prisma/historical-data.ts)。

## 后续建议

- 将 OpenDota 报告刷新改成异步任务
- 为内容页正文升级为 Markdown 或结构化内容块
- 为内容库增加排序、分页和更细粒度筛选