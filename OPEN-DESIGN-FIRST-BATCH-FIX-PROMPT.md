# Open Design 首轮交付修复提示词

> 用途：把下面全文交给负责实现的 AI。只修复首轮复核发现的问题，不开始下一批页面。

## 任务背景

你正在继续实现一个 Open Design 中文站的 React/Vite 复刻项目。当前项目目录：

```bash
cd "/Users/zp/owen/code/gitrepo/jiuan/server/v7/soia-team.github.io"
```

先阅读：

```text
OPEN-DESIGN-IMPLEMENTATION-HANDOFF.md
package.json
src/App.tsx
src/solution-pages.tsx
src/sub-pages.css
src/upstream/app/
public/
```

当前首轮范围只有 3 个页面及其无尾斜杠变体：

```text
/zh/solutions/
/zh/solutions
/zh/solutions/screenshot-to-code/
/zh/solutions/screenshot-to-code
/zh/download/
/zh/download
```

本轮不要实现新的解决方案详情页、博客、社区、价格页或其他延期范围，也不要加入 SOIA 产品内容。

## 必须使用的技能

按以下顺序实际读取并使用技能；如果某个技能不可用，必须在最终回执中明确说明，不能假装完成：

1. `soia-dev-open-design-ops`
2. `soia-dev-coding-protocol`
3. `soia-dev-fix-loop`
4. `soia-dev-review-panel`

要求：

- 复用现有 Open Design 项目和 daemon/session，不要启动第二套 Open Design 服务。
- 先写出假设、范围和验证计划，再改代码。
- 每个问题都记录为 `fix`、`reject` 或 `defer`，不能静默忽略。
- 不删除现有素材，不执行 `git reset --hard`、`git checkout --` 或批量清理。
- 保持 React/Vite 技术栈和现有视觉系统，做最小改动。

## 必须修复的问题

### F-01（P1）：截图转代码页的下载 CTA 必须是直接安装包

当前实现存在：

- `src/solution-pages.tsx:144` 的主按钮指向 `/zh/download/`。
- `src/solution-pages.tsx:258` 的 CTA 指向 GitHub Releases 页面。

原站的这两个下载动作都会根据当前平台直接指向安装包，不是站内下载页，也不是 Releases 标签页。例如 macOS Apple Silicon 的实际链接形态为：

```text
https://github.com/nexu-io/open-design/releases/download/open-design-v0.17.0/open-design-0.17.0-mac-arm64.dmg
```

修复要求：

- 主 CTA 和底部 CTA 都必须输出直接安装包 URL。
- 必须保留平台识别，不能只为当前电脑硬编码 mac-arm64。
- URL 必须来自真实 release asset 或与原站相同的版本化资产规则。
- 不能用 `/zh/download/`、`/releases` 或 `/releases/latest` 伪装成下载完成。
- API 请求失败时，要有明确且可验证的直接资产 fallback；不能退回到普通 Releases 页面而不说明。

### F-02（P1）：下载页 Hero 与平台卡片必须对齐原站资源地址

当前实现 `src/solution-pages.tsx:339`、`:472` 使用 GitHub `release.html_url` 作为下载页 Hero 链接。原站最新版使用直接安装包资源，例如：

```text
https://releases.open-design.ai/stable/versions/0.17.0/open-design-0.17.0-mac-arm64.dmg
```

修复要求：

- 下载页 Hero 主按钮必须是当前平台的直接安装包 URL。
- macOS Apple Silicon、macOS Intel、Windows、Linux 四个平台卡片必须分别指向原站相同的直接资产地址和文件名。
- 发布说明、版本号、全部版本等信息链接可以继续指向 GitHub，但不能把这些页面地址当作“下载按钮”的 href。
- 不要用“能下载”替代“与原站行为一致”；需要在 DOM 中验证最终 href。
- 如果 release API 仍用于获取版本和校验和，必须把“版本信息链接”和“安装包下载链接”分开建模。

### F-03（P2）：移动端视觉回归

当前移动端功能可用，但与原站仍有明显高度差：Hero、移动端提示框和平台卡片偏高，Hero visual 的宽度和左右留白也不一致。

本轮在 F-01/F-02 修复后处理，要求：

- 对照原站 390×844 截图。
- 保持 `scrollWidth === clientWidth`，不得产生横向滚动。
- 移动端提示文案、显示条件和原站一致。
- Hero visual、提示框、平台卡片的宽度、间距和高度尽量对齐原站，不通过隐藏内容或固定空白伪造。

## 验证矩阵

必须实际打开下面 6 个 URL，并在 3 个视口验证，共 **18 组**，不能写成 12 组：

```text
视口一：1440×900
视口二：1280×800
视口三：390×844
```

每组至少检查：

1. HTTP/页面可打开，不能出现 `This page wandered off.`。
2. `document.title` 和唯一 H1 与原站一致。
3. 截图转代码页两个下载 CTA 的最终 `href` 均为直接安装包。
4. 下载页 Hero CTA 的最终 `href` 为直接安装包；四个平台卡片 href 与原站资源规则一致。
5. 390px 下无横向溢出，移动端提示可见。
6. 图片、favicon、图标字体等资源正常加载。
7. 控制台无新增 error/warn。

建议使用 Playwright 或现有浏览器控制技能记录 DOM 证据，不要只凭肉眼截图判断链接是否正确。

## 必须运行的命令

```bash
pnpm build
git diff --check
```

如果构建因为受限环境无法写入 `node_modules/.tmp`，要说明实际错误和重试方式；不能把未成功的构建写成通过。

截图可以写入临时目录，例如：

```text
/tmp/od-shots/round1-fix/
```

不要把临时截图、浏览器 cookies、网络抓取数据或私有凭据提交进 Git。

## 交付回执格式

最终回执必须包含：

```markdown
### 技能
- 实际调用的技能及证据

### 假设、范围、验证计划
- 本轮实际做什么
- 明确没有做什么

### Findings
- F-01：fix/reject/defer + 证据
- F-02：fix/reject/defer + 证据
- F-03：fix/reject/defer + 证据

### 实际改动
- 文件路径和改动目的

### 验证结果
- pnpm build
- git diff --check
- 18 组路由/视口结果
- 关键 CTA 的最终 href
- 控制台、资源、移动端结果

### 未完成与风险
- 只列真实未完成项，不写“全部完成”
```

只有 F-01、F-02 修复并通过上述 18 组验证后，才能请求下一批页面；在此之前不要扩展范围。

