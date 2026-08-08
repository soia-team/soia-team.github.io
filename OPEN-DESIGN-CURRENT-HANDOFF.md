# Open Design React 复刻 · 当前交接

> 交给下一位 AI 的工作交接。当前目标仍是先复刻 Open Design，不加入 SOIA 产品内容。

更新时间：2026-08-08
仓库：`soia-team/soia-team.github.io`
当前分支：`codex/open-design-rebuild`
当前工作树：干净

## 1. 本轮已提交

最近三个提交：

```text
b70dd1b chore: expose new routes in site navigation
be7671f feat: add tutorials showcase craft and enterprise routes
f704811 feat: expand Open Design page coverage
```

已执行：

```bash
pnpm build
git diff --check
```

结果：构建通过，TypeScript 无错误，`git diff --check` 通过。Vite 仍提示主 JS chunk 大于 500KB，这是已有性能风险，不是构建失败。

本轮没有执行：push、PR、合并、部署、Open Design 项目写入或删除操作。

## 2. 工程与运行方式

```bash
cd /Users/zp/owen/code/gitrepo/jiuan/server/v7/soia-team.github.io
pnpm install
pnpm dev
```

预览：<http://127.0.0.1:4173/zh/>
生产构建：`pnpm build`
静态预览：`pnpm preview`

不要启动第二套 Open Design 服务。Open Design 桌面版/daemon 是否可用，必须通过只读探测确认；不要把浏览器页面出现内容当成同步证据。

## 3. 当前代码覆盖

### 已有真实 React 路由

- 首页、产品页：HTML Anything、HTML Video、Codex Slides。
- Solutions：首页与 19 个详情页。
- Agents：首页与 21 个 Agent 详情页。
- Plugins：首页、templates、skills、systems，以及通用详情路由。
- Pricing、Blog、Blog 通用文章路由。
- Download、Quickstart、Open Design Plugin。
- Community：首页、ambassadors、contributors、moderators、events。
- Stories：首页、Ikigai One、Stuart Gardoll、Seungki Kim。
- Compare：首页及已有 6 个 comparison 页面。
- About、Careers、FAQ、Official、Privacy、Terms。
- 新增 Tutorials：首页和教程详情通用页面。
- 新增 Showcase：首页，包含类型筛选和作品卡片。
- 新增 Craft：首页和方法详情页面。
- 新增 Enterprise/Workspace 团队版页面，表单通过 mailto 生成本地邮件草稿，不伪称后端已提交。

### 本轮新增文件

```text
src/missing-pages.tsx
src/missing-pages.css
```

并修改：

```text
src/App.tsx
src/main.tsx
src/shell.tsx
src/upstream/app/_components/header.tsx
```

导航新增：

- Resources 下的 `展示 Showcase`。
- Plugins 下的 `方法 Craft`。
- 页脚的 `团队版`。

## 4. 重要事实：路由存在不等于 1:1 完成

以下新增页面目前是“真实路由 + 可运行内容 + Open Design 风格的第一版”，还不是原站逐段 1:1 内容复刻：

- Tutorials 的完整内容集合、视频 iframe、分类查询和所有教程详情。
- Showcase 的全部作品数据、CDN hover 视频和原站完整文案。
- Craft 的真实 catalog 数据和所有 craft 详情页。
- Enterprise 的完整多字段 lead form、服务端提交和原站全部 demos。

通用 Plugin/Blog catch-all 路由也不能视为所有详情页完成；必须逐页核对标题、图片、章节、安装命令和 CTA。

## 5. 仍未覆盖或待深化

### 顶层页面

从 Open Design 源页面清单看，仍需继续核对或补齐：

```text
/alternatives/figma-make/
/alternatives/genspark/
/alternatives/pencil-dev/
/alternatives/qoder/
/alternatives/stitch/
/alternatives/trae/
```

另外，已有 alternatives 页面仍需逐页核对原站最新文案和素材。

### 详情深度

- 插件详情页仍有大量通用 renderer，需要按源页面逐个替换真实内容。
- Blog 文章详情目前不是完整文章迁移。
- Agent 详情需要继续对照原站章节、图片、安装命令和 FAQ。
- Community events 中的 Osaka meetup 详情链接仍需补真实页面。
- Stories、Tutorials 的多语言与完整文章内容仍需补齐。

### Open Design 同步

Open Design 源项目目录由用户本地桌面版维护。当前仓库代码与 Open Design 项目的 dist 产物不是同一份构建物；此前静态核对发现两边的 `index.html`、资源名、mtime 和 SHA-256 不同。因此不能写“已同步”。

下一位 AI 如需 OD-first：

1. 只读读取同一 Open Design project 的 `DESIGN.md`、`HANDOFF.md`、source page 和素材。
2. 在 Open Design App 内完成设计修改或导出，避免启动第二套 daemon。
3. 先验证 OD 产物存在且可打开，再把确定的源文件/素材同步到本仓库。
4. 同步后运行 `pnpm build`、资源存在性检查和路由检查。

## 6. 验证边界与阻塞

### 已验证

- `pnpm build`：通过。
- `git diff --check`：通过。
- 当前提交后工作树：干净。
- 新增路由已写入 `src/App.tsx`，并通过 TypeScript 编译。

### 未验证

- 本轮没有做完整浏览器矩阵、视觉截图对比或控制台错误扫描。
- 没有证明所有路由都能在 390px、1280px、1440px 正常显示。
- 没有证明所有图片、视频、外链和交互都与原站一致。

### 阻塞

- 无头 Chrome 在 community route 已连续重连 5/5 仍卡住；不要重复重试。后续页面验证单次最多 60 秒，超时立即记录并跳过。
- Open Design MCP 曾返回 `Transport closed`；daemon/API 同步状态不能仅凭 UI 判断。
- 预览服务可能存在旧进程，不要随意 kill 或重启；先确认 PID、端口和归属。

## 7. 下一位 AI 的首轮动作

```bash
cd /Users/zp/owen/code/gitrepo/jiuan/server/v7/soia-team.github.io
git status --short --branch
git log -3 --oneline
pnpm build
```

然后按以下顺序推进：

1. 先把 6 个缺失 alternatives 页面接入真实 source data，不要用统一 NotFound 或空壳页面。
2. 再逐个补插件详情页的真实内容和素材。
3. 对 Tutorials、Showcase、Craft、Enterprise 与 Open Design 源页面逐页对照。
4. 每批最多实现 3–4 个页面，先构建和静态路由检查，再进入下一批。
5. 不要在未完成视觉/交互核对前宣称“1:1 复刻”。

## 8. 回执格式

每一批完成后必须报告：

```text
已完成：具体路由、文件和构建结果
进行中：当前批次和剩余范围
未开始：明确列出下一批
阻塞项：超时、缺素材、OD API 不可用或其他限制
```

不要把“能打开页面”“路由未 404”或浏览器 UI 状态当成视觉复刻完成证据。
