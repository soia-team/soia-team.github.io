# Open Design React 复刻：实现交接与验收文档

> 文档用途：交给其他 AI 实现缺失页面，由 Codex 按本文档进行复核。
>
> 当前阶段：只复刻 Open Design，不加入 SOIA 产品内容。
>
> 审计日期：2026-08-04

## 1. 目标

把本仓库实现成 Open Design 中文站的可运行 React/Vite 复刻：

- 页面结构、导航、下拉菜单、页脚、响应式布局与原站保持一致。
- 页面文字、图片、文章、插件说明优先取原站对应页面，不自行编造产品叙事。
- 所有原站导航链接都必须落到真实页面，不允许显示 `This page wandered off.`。
- 先完成 Open Design 复刻，再考虑替换为 SOIA 自有内容。

原站参考：<https://open-design.ai/zh/>  
本地预览：<http://127.0.0.1:4173/zh/>

## 2. 当前工程与运行方式

项目目录：

```text
/Users/zp/owen/code/gitrepo/jiuan/server/v7/soia-team.github.io
```

技术栈：React 18 + TypeScript + Vite。

```bash
cd /Users/zp/owen/code/gitrepo/jiuan/server/v7/soia-team.github.io
pnpm install
pnpm dev
pnpm build
```

开发服务器默认地址：`http://127.0.0.1:4173`。

当前重要文件：

| 文件 | 作用 |
|---|---|
| `src/App.tsx` | 路由分发、首页增强交互、Agent 与产品页 |
| `src/routes.ts` | 产品、Agent 与已覆盖路由清单 |
| `src/catalog-pages.tsx` | 插件、价格、博客及其详情页 |
| `src/open-design.css` | 首页与基础 Open Design 视觉样式 |
| `src/sub-pages.css` | 二级、三级页面样式 |
| `src/upstream/app/` | 已导入的 Open Design 文案、组件和多语言资料 |
| `public/` | 原站图片、视频、图标和其他静态素材 |

不要删除 `src/upstream/app/` 或 `public/` 中已经存在的原站素材；优先复用，不要重新生成近似图片。

## 2.1 必须结合的技能

其他 AI 不能只按普通 React 页面开发；实现和回归必须按下面的技能契约执行。技能不可用时，先在回执中说明，不得假装已经完成对应检查。

### A. Open Design 原子操作：`soia-dev-open-design-ops`

这是本项目的主技能，负责把 Open Design 项目、设计稿、原站素材和本地 React 产物连接起来。使用它来：

- 读取项目的 `DESIGN.md`、Open Design 项目文件和现有素材。
- 检查 Open Design 环境、daemon/API 和项目入口；不要自行启动第二套 Open Design 服务。
- 查询 functional skills 与 rendering templates 时分开记录，不要把两者混成一个能力列表。
- 需要从 Open Design 继续设计或导出时，复用同一个 project/session；不要每个页面新建一个项目。
- 每次原子操作都返回真实 API、文件存在性或产物可打开性的证据。

该技能只负责可验证的 Open Design 原子操作，不替代页面视觉取舍；页面结构和内容必须以原站页面为事实来源。

### B. 工程实现契约：`soia-dev-coding-protocol`

所有代码改动必须遵守：

- 写代码前先写“假设、范围、验证计划”。
- 只做当前批次需要的最小改动，不借机重构或换技术栈。
- 不用 TODO、注释、吞错、统一跳转或宽松断言伪装完成。
- 改完搜索同类路由和组件，说明哪些纳入、哪些排除。
- 回执必须列出实际改动、实际命令、实际结果和残余风险。

### C. 问题修复闭环：`soia-dev-fix-loop`

用户或审核 AI 提出的每个问题都要形成 finding，并按“复现 → 决策 → 最小修复 → 回归 → 回执”处理。每条 finding 只能是 `fix`、`reject` 或 `defer`，不能静默遗漏；高风险删除、覆盖、发布或扩大范围必须先确认。

### D. 多视角审核：`soia-dev-review-panel`

交给 Codex 审核前，其他 AI 至少按以下视角自查一次：

- 正确性与自证：真实读取完整文件和路由，不只看 diff。
- 内容与视觉：对照原站 DOM、标题、素材、章节和响应式布局。
- 安全与范围：没有凭据、私有路径、SOIA 内容或无关重构进入页面。
- 测试与反假修复：构建、路由、资源、控制台和移动端均有证据。

`soia-dev-review-panel` 只做只读审核，不代替实现、提交、合并或发布。最终审核仍由 Codex 依据本文第 10 节执行。

### 技能调用顺序

```text
soia-dev-open-design-ops
  → soia-dev-coding-protocol
  → React 实现
  → soia-dev-fix-loop（处理 findings）
  → soia-dev-review-panel（交付前自查/交给 Codex）
```

最低技能回执：

```markdown
技能：<实际调用的技能名>
Open Design 证据：<API、项目文件、素材或导出检查>
工程契约：<假设、范围、验证计划>
修复闭环：<finding 数量及 fix/reject/defer>
自查结果：<构建、路由、视觉、交互、响应式>
未覆盖项：<明确说明，不能写“无”来代替未检查>
```

## 3. 审计基线

本次从原站中文首页导航抽取了 82 个唯一页面入口，并在本地逐页打开检查：

- 39 个页面已能渲染真实页面。
- 43 个页面仍进入本地 `NotFound` 兜底页。
- 这 82 个页面是“首页导航覆盖基线”，不是原站完整 sitemap；博客文章、旧版重定向页还需单独检查。

本地兜底页的明确标志：

```text
This page wandered off.
本地 React 复刻没有为这个路径生成页面。
```

## 4. 未完成页面清单

以下路径均使用 `/zh` 前缀。例如 `/solutions/` 的完整本地地址是 `/zh/solutions/`。

### P0：主导航和高转化页面

#### 解决方案，共 20 页

```text
/solutions/
/solutions/ai-landing-page-generator/
/solutions/ai-prototype-generator/
/solutions/ai-ui-generator/
/solutions/ai-wireframe-generator/
/solutions/dashboard/
/solutions/design-system/
/solutions/design-to-code/
/solutions/designer/
/solutions/engineering/
/solutions/figma-to-code/
/solutions/html-to-ppt/
/solutions/image/
/solutions/marketing/
/solutions/product-managers/
/solutions/prototype/
/solutions/screenshot-to-code/
/solutions/slides/
/solutions/solo-builder/
/solutions/video/
```

#### Alternatives 与比较，共 7 页

```text
/alternatives/bolt/
/alternatives/claude-design/
/alternatives/figma/
/alternatives/framer/
/alternatives/lovable/
/alternatives/v0/
/compare/
```

#### 直接行动入口，共 3 页

```text
/download/
/quickstart/
/open-design-pugin/
```

`open-design-pugin` 是原站当前公开链接中的拼写，先按原站路径保留，不要擅自改成 `plugin`。

### P1：社区与内容资源

```text
/community/
/community/ambassadors/
/community/contributors/
/community/events/
/community/moderators/
/stories/
/tutorials/
```

### P2：公司与法律页面

```text
/about/
/careers/
/faq/
/official/
/privacy/
/terms/
```

## 5. 已有页面但仍需深化

这些页面不属于“路由缺失”，但当前还不能称为 1:1 复刻。

### 5.1 插件详情

当前插件详情共用 `PluginDetailPage` 的通用结构。后续每个插件应按原站详情页补齐：

- 独立标题、分类、作者、版本和来源信息。
- 真实预览图或视频，不使用无关占位图。
- 安装命令、支持的 Agent、输入输出和限制条件。
- `PUBLIC EVIDENCE`、源码、主页、返回目录等侧栏动作。
- 相关插件、版本或设计系统链接。

原站插件入口示例：

```text
/plugins/templates/deck/
/plugins/templates/hyperframes/
/plugins/templates/image/
/plugins/templates/live-artifact/
/plugins/templates/prototype/
/plugins/templates/video/
```

### 5.2 博客详情

博客归档页已有精选文章、分类筛选和文章卡片，但详情页目前仍是通用正文骨架。后续应逐篇迁移原站内容：

- 标题、分类、日期、阅读时长和作者。
- 原站封面及正文插图。
- 原文段落、代码块、表格、引用、目录锚点。
- 相关文章、返回博客和 CTA。
- 每篇文章必须拥有自己的 slug 和页面标题，不能所有文章共用一套正文。

### 5.3 三个产品页

`/html-anything/`、`/html-video/`、`/codex-slides/` 当前有可读内容，但仍是压缩版。需要对齐原站：

- 原站完整章节顺序。
- 原站的产品截图、示例画廊和说明文字。
- 产品专属 CTA、相关项目和资源链接。
- 桌面端、移动端的断点布局。

### 5.4 Agent 详情

Agent 路由已经覆盖，但仍需逐页做视觉验收：

- 头图、标题、Agent 图标、目录侧栏。
- 文章章节、代码块、表格、FAQ 和 CTA。
- 每个 Agent 的文案和链接不能误用其他 Agent 的内容。
- 页面标题不能全部退化为 `Open Design`。

## 6. 实现规则

### 6.1 路由

- 继续使用当前 `localPathname()` 的本地化路径解析规则。
- 同时支持无尾斜杠和带尾斜杠访问。
- 中文页面至少支持 `/zh/...`；不要破坏现有根路径 `/...`。
- 新路由必须加入 `src/routes.ts` 或明确的目录页路由表。
- 不要通过一个“大而全”的未知 slug 页面冒充所有详情页。
- 未完成页面可以暂时保留兜底，但提交前必须在清单中明确标记，不能把兜底当完成。

### 6.2 视觉

对照原站分别检查 1440px、1280px、390px 三个视口：

- 悬浮胶囊导航的宽度、阴影、模糊和滚动行为。
- 导航下拉菜单的打开、关闭、点击和键盘可访问性。
- 首页使用原站的留白、绿色强调色、黑色文字和线框卡片。
- 页脚列数、链接、版权和大字品牌标识。
- 不要重新引入早期 SOIA 页面中的黑白分裂样式。
- 不要通过超大字号或巨大空白“模拟”原站；布局应由真实内容撑开。

### 6.3 内容与素材

- 以原站对应页面为事实来源。
- 复用 `public/` 中现有同名素材。
- 图片必须有 `alt`；非首屏图片可懒加载。
- 不得把 SOIA、私有项目、内部提示词或本次实现讨论写进 Open Design 复刻页面。
- 不要删除原始素材来解决布局问题。

### 6.4 交互

至少实现：

- 导航下拉菜单。
- 博客分类筛选。
- 价格页月付/年付切换。
- 首页能力步骤点击、键盘切换和滚动联动。
- 首页图片/视频工作台卡片切换。
- 所有卡片、CTA、面包屑和页脚链接可到达目标路由。

## 7. 单页面实现模板

其他 AI 实现每个页面时，先按下面格式写短计划，再动代码：

```markdown
### 页面：<中文名称>
- 原站地址：<https://open-design.ai/zh/.../>
- 本地地址：<http://127.0.0.1:4173/zh/.../>
- 页面类型：hub / solution / alternative / community / legal / article / detail
- 页面标题：<document.title>
- H1：<原站 H1>
- 必须复用的素材：<public 路径列表>
- 必须实现的交互：<下拉、筛选、锚点、FAQ 等>
- 相关页面：<内部链接>
- 完成判定：<结构、内容、视觉、响应式、链接>
```

实现顺序：

1. 先读取原站页面的 DOM 结构、标题、章节和素材。
2. 再写 React 组件和路由。
3. 再写本页 CSS，优先复用现有 tokens 和组件。
4. 先在桌面端验证，再验证移动端。
5. 运行构建和链接检查后，才把页面从“未完成”移到“已完成”。

## 8. 页面完成验收标准

### 自动检查

```bash
cd /Users/zp/owen/code/gitrepo/jiuan/server/v7/soia-team.github.io
pnpm build
```

构建必须通过。Vite 的 chunk size warning 可以记录，但不能有 TypeScript、模块解析或构建失败。

### 浏览器检查

每个页面至少验证：

1. 地址可打开，不能出现 `This page wandered off.`。
2. `document.title` 不是通用的 `Open Design`。
3. 页面只有一个主 H1，标题与原站一致或明确对应。
4. 关键图片加载成功，没有 404 或空白占位。
5. 头部、页脚、面包屑和 CTA 链接可点击。
6. 1440px、1280px、390px 下无横向溢出。
7. 控制台没有 React 错误、未捕获异常或资源 404。
8. 返回、内部链接和带尾斜杠 URL 都能正常工作。

### 1:1 视觉检查

每个批次至少保留：

- 原站截图。
- 本地截图。
- 差异说明（结构、字体、间距、颜色、素材、交互）。
- 未解决问题列表。

“看起来差不多”不算完成；必须能说明差异是否有意、是否影响用户理解。

## 9. 提交给审核 AI 的回执格式

其他 AI 完成一个批次后，必须返回：

```markdown
## 本批次完成
- 实现页面：<路由列表>
- 新增/修改文件：<文件列表>
- 原站对照：<原站 URL>
- 交互验证：<逐项结果>
- 响应式验证：<1440 / 1280 / 390>
- 构建结果：`pnpm build` <通过/失败>
- 已知问题：<没有则写“无”>
- 待审核截图：<路径或截图说明>
```

## 10. Codex 审核流程

收到其他 AI 的实现后，Codex 按以下顺序审核：

1. 查看变更文件，确认没有删除现有素材或引入 SOIA 内容。
2. 运行 `pnpm build`。
3. 逐个打开本批次路由，检查是否仍为兜底页。
4. 对照原站检查 H1、章节、素材、导航、页脚和 CTA。
5. 检查桌面端、移动端和浏览器控制台。
6. 检查新增页面是否把其他页面的通用正文错误复用。
7. 输出“通过 / 需返工 / 阻塞”的逐页结论，不以构建通过代替视觉验收。

审核结论格式：

```markdown
| 路由 | 路由 | 内容 | 视觉 | 交互 | 结论 |
|---|---|---|---|---|---|
| `/zh/.../` | 通过/失败 | 通过/失败 | 通过/失败 | 通过/失败 | 通过/返工 |
```

## 11. 推荐实现批次

### 11.0 首轮试点门禁：只做 3 个页面

不要一次性实现全站。其他 AI 第一轮只允许实现下面 3 个页面，完成后立即停止，交给 Codex 复核：

```text
/zh/solutions/                         # 解决方案目录页
/zh/solutions/screenshot-to-code/      # 解决方案详情页
/zh/download/                          # 下载/行动入口页
```

这 3 页分别验证目录、详情和高转化 CTA 三种页面类型，也会同时暴露导航、页脚、素材、响应式和路由问题。第一轮禁止顺手实现其他缺失页面，禁止把通用占位组件扩散到全站。

第一轮完成后，其他 AI 必须只提交以下信息，等待 Codex 回复“通过”或“需返工”：

```markdown
## 首轮试点交付
- 实现路由：`/zh/solutions/`、`/zh/solutions/screenshot-to-code/`、`/zh/download/`
- 原站对照地址：<逐页 URL>
- 使用技能：<实际调用的技能名与结果>
- 变更文件：<完整文件列表>
- Open Design 证据：<读取的项目/设计文件、素材或 API 结果>
- 构建：`pnpm build` <通过/失败，附关键输出>
- 路由检查：<3 页是否都不再显示 fallback>
- 交互检查：<导航下拉、CTA、面包屑、页脚链接结果>
- 响应式检查：<1440 / 1280 / 390 结果>
- 截图：<原站截图、本地截图及存放路径>
- 已知问题：<逐条列出，不能用“无”代替未检查>
- 请求复核：请 Codex 先审核这 3 页，再决定下一批范围
```

Codex 复核至少输出逐页结论、构建结果、视觉差异、交互问题和是否放行下一批。只有首轮 3 页均达到第 8 节验收标准，才进入下面的批次 A；任一页面返工，先修复并重新提交，不得继续铺量。

### 批次 A：解决方案

先实现 `/solutions/` hub，再实现 19 个 solution detail。完成后必须修复头部“解决方案”下拉菜单的所有死链。

### 批次 B：Alternatives 与 Compare

实现 6 个 alternatives 和 `/compare/`，保持原站的比较表、优缺点、适用场景和 CTA 结构。

### 批次 C：Download、Quickstart、Plugin 介绍

实现 `/download/`、`/quickstart/`、`/open-design-pugin/`，确保首页和详情页所有下载 CTA 不再落到兜底页。

### 批次 D：社区、Stories、Tutorials

实现社区 hub、四个社区子页、Stories 和 Tutorials；优先复用 `public/community`、`public/showcase`、`public/tutorials` 中已有素材。

### 批次 E：公司与法律

实现 About、Official、FAQ、Careers、Privacy、Terms，并统一页脚链接、标题和法律文案。

### 批次 F：详情页深化

逐篇补齐博客正文、插件详情和产品长页面，再做全站回归。

## 12. 明确禁止

- 不要把所有未完成页面都指向首页。
- 不要把所有详情页渲染成同一段泛化正文。
- 不要仅修改导航文字而不实现目标页面。
- 不要删除旧代码、素材或备份来掩盖缺失页面。
- 不要把“构建通过”写成“1:1 复刻完成”。
- 不要在本阶段加入 SOIA 的产品、价格、课程或私有服务内容。
