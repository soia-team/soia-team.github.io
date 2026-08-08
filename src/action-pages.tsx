/*
 * Direct-action pages from the Open Design source:
 *   app/pages/quickstart/index.astro
 *
 * Keep this page separate from the catalog and comparison renderers so the
 * install/documentation contract stays easy to verify and future action
 * pages do not become another generic fallback.
 */
import { useState } from 'react';
import { getInfoPageCopy, quickstartCode } from './upstream/app/info-page-i18n';
import type { LandingLocaleCode } from './upstream/app/i18n';
import { GITHUB, hrefFor, REPO, SubpageLayout } from './shell';

const REPO_RELEASES = `${REPO}/releases`;
const QUICKSTART_DOC = `${REPO}/blob/main/QUICKSTART.md`;

const OPEN_DESIGN_PLUGIN_COMMAND = 'Read open-design.ai/codex-plugin to install the Open Design plugin and set up a new task for me.';
const OPEN_DESIGN_PLUGIN_REPO = 'https://github.com/nexu-io/open-design-agent-plugins';

const PLUGIN_STEPS = [
  {
    number: '01',
    kind: '安装',
    title: '让 Codex 帮你完成安装',
    body: '将这条指令粘贴到 Codex 任务中。Codex 会读取仓库里的安装流程，完成插件与本地 MCP 配置，无需依赖公开的插件市场页面。',
    command: true,
  },
  {
    number: '02',
    kind: '使用',
    title: '新建一个 Codex 任务',
    body: 'Codex 完成安装后，在新任务中打开已安装的 Open Design 插件，然后选择“Try now”开始使用。',
    image: '/open-design-pugin/codex-real-plugin-detail.png',
    alt: 'Codex 任务中的 Open Design 插件详情',
  },
  {
    number: '03',
    kind: '创作',
    title: '写下设计需求',
    body: '提及 Open Design，然后描述你要创作的内容、所需信息、视觉方向和响应式要求。',
    image: '/open-design-pugin/codex-real-cafe-prompt.png',
    alt: '在 Codex 任务中写下咖啡馆落地页需求',
  },
  {
    number: '04',
    kind: '创作',
    title: '实时跟进任务交接',
    body: 'Codex 会确认设计方向、创建项目并将工作交给 Open Design，生成的文件会实时出现。',
    image: '/open-design-pugin/codex-real-cafe-running.png',
    alt: 'Open Design 生成咖啡馆页面的实时工作区',
  },
  {
    number: '05',
    kind: '创作',
    title: '查看创作结果',
    body: '同一个任务会返回响应式 Goodfield 咖啡馆落地页，以及生成的图片和可编辑文件。',
    image: '/open-design-pugin/codex-real-cafe-result.png',
    alt: 'Open Design 生成的 Goodfield 咖啡馆落地页',
  },
] as const;

const PLUGIN_EXAMPLES = [
  { label: '产品发布', prompt: '为一个新产品制作发布页面，包含清晰的价值主张、功能对比和响应式 CTA。' },
  { label: '活动页面', prompt: '为一个线下活动制作报名页面，突出日期、地点、议程和报名入口。' },
  { label: '编辑风网站', prompt: '为一个编辑品牌制作有节奏的杂志风网站，使用真实图片、清晰层级和适度动效。' },
  { label: '互动叙事', prompt: '将一段故事做成可滚动的互动叙事页面，保持移动端阅读顺畅。' },
];

const PLUGIN_FAQ = [
  { question: '需要先安装什么？', answer: '先在 Codex/ChatGPT 桌面应用中粘贴安装指令。插件会读取安装流程并完成本地 MCP 配置；完整的运行环境说明见快速开始页面。' },
  { question: 'Open Design 会把我的文件上传到云端吗？', answer: 'Open Design 采用本地优先的工作方式。项目文件、生成物和 DESIGN.md 保存在你自己的工作区中，插件只是把设计工作流接入 Codex 任务。' },
  { question: '我可以从哪里查看插件源码？', answer: '插件的公开源码位于 GitHub 仓库，安装页面和任务交接过程都可以从源码与本地工作区复核。' },
  { question: '安装后如何继续完善页面？', answer: '在同一个 Codex 任务中继续描述要调整的内容、视觉方向和响应式要求，插件会保留上下文并继续生成、预览和交接。' },
];

export function QuickstartPage({ locale }: { locale: LandingLocaleCode }) {
  const copy = getInfoPageCopy(locale);
  const page = copy.quickstart;
  const common = copy.common;
  const href = (path: string) => hrefFor(path, locale);

  return (
    <SubpageLayout active="resources" locale={locale}>
      <nav className="breadcrumb" aria-label={common.breadcrumbAria}>
        <a href={href('/')}>Open Design</a><span>/</span><span aria-current="page">{page.breadcrumb}</span>
      </nav>
      <article className="info-page quickstart-page" data-od-id="quickstart">
        <header className="catalog-head">
          <span className="label">{page.label}</span>
          <h1 className="display">{page.heading}</h1>
          <p className="lead">{page.lead} {page.latestRelease} <a className="inline-link" href={REPO_RELEASES} target="_blank" rel="noreferrer noopener">{GITHUB.versionLabel}</a>.</p>
        </header>

        <section className="info-section" id="requirements">
          <h2>{page.requirementsTitle}</h2>
          <ul>{page.requirements.map((item) => <li key={item.label}><strong>{item.label}</strong> — {item.body}</li>)}</ul>
        </section>

        <section className="info-section" id="commands">
          <h2>{page.commandsTitle}</h2>
          <p>{page.commandsLead}</p>
          <ol>{page.steps.map((step) => <li key={step.name}><strong>{step.name}.</strong> {step.text}<pre className="code-block"><code>{step.code}</code></pre></li>)}</ol>
          <p><a className="inline-link" href={QUICKSTART_DOC} target="_blank" rel="noreferrer noopener">{page.fullNotes}</a></p>
        </section>

        <section className="info-section" id="expected-output">
          <h2>{page.expectedTitle}</h2>
          <p>{page.expectedBody}</p>
          <pre className="code-block"><code><span className="comment"># tools-dev — startup</span>{'\n'}<span className="prompt">→</span> daemon  listening on http://127.0.0.1:17456 (namespace tools-dev/main){'\n'}<span className="prompt">→</span> web     listening on http://127.0.0.1:17573 (proxy → daemon){'\n'}<span className="prompt">→</span> sidecar /tmp/open-design/ipc/tools-dev-main/daemon.sock{'\n'}<span className="prompt">→</span> ready in 1.4s</code></pre>
          <p>{page.expectedPorts}</p>
        </section>

        <section className="info-section" id="troubleshooting">
          <h2>{page.troubleshootingTitle}</h2>
          <ul>{page.troubleshooting.map((item) => <li key={item.label}><strong>{item.label}:</strong> {item.body}</li>)}</ul>
        </section>

        <section className="info-section" id="next">
          <h2>{page.nextTitle}</h2>
          <ul>
            <li><a className="inline-link" href={href('/plugins/skills/')}>{page.nextItems[0].label}</a> — {page.nextItems[0].body}</li>
            <li><a className="inline-link" href={href('/plugins/systems/')}>{page.nextItems[1].label}</a> — {page.nextItems[1].body}</li>
            <li><a className="inline-link" href={href('/compare/')}>{page.nextItems[2].label}</a> — {page.nextItems[2].body}</li>
            <li><a className="inline-link" href={REPO_RELEASES} target="_blank" rel="noreferrer noopener">{page.nextItems[3].label}</a> — {page.nextItems[3].body}</li>
          </ul>
        </section>

        <section className="info-cta" aria-label={page.ctaTitle}>
          <div><h2>{page.ctaTitle}</h2><p>{page.ctaBody}</p></div>
          <div className="info-cta-actions">
            <a className="btn btn-primary" href={REPO} target="_blank" rel="noreferrer noopener">{common.starOnGithub}</a>
            <a className="btn btn-ghost" href={REPO_RELEASES} target="_blank" rel="noreferrer noopener">{common.downloadDesktop}</a>
            <a className="btn btn-ghost" href="https://discord.gg/mHAjSMV6gz" target="_blank" rel="noreferrer noopener">{common.joinDiscord}</a>
          </div>
          <div className="info-cta-meta"><span className="stamp">● {common.live}</span><span>{GITHUB.versionLabel} · {common.apache}</span><span>{common.macWinLinux}</span></div>
        </section>
      </article>
    </SubpageLayout>
  );
}

/**
 * The live Open Design route is intentionally spelled `open-design-pugin`.
 * It is a public compatibility URL, so keep the spelling and the install
 * command intact while making the page self-contained for the static clone.
 */
export function OpenDesignPluginPage({ locale }: { locale: LandingLocaleCode }) {
  const [copied, setCopied] = useState(false);
  const href = (path: string) => hrefFor(path, locale);
  const copyCommand = async () => {
    try {
      await navigator.clipboard.writeText(OPEN_DESIGN_PLUGIN_COMMAND);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      setCopied(false);
    }
  };

  return (
    <SubpageLayout active="plugins" locale={locale}>
      <article className="odp-page plugin-install-page" data-od-id="open-design-pugin">
        <section className="odp-hero">
          <div className="odp-wrap odp-hero-grid">
            <div className="odp-hero-copy">
              <span className="odp-kicker">OPEN DESIGN / CODEX PLUGIN</span>
              <h1 className="display">面向 Codex/ChatGPT 的 Open Design 插件</h1>
              <p className="odp-lead">将下方指令输入你的 ChatGPT 桌面应用中的任意任务，安装插件并开始一次新的设计任务。</p>
              <div className="odp-command-card">
                <pre><code>{OPEN_DESIGN_PLUGIN_COMMAND}</code></pre>
                <button type="button" className="odp-copy" onClick={copyCommand} aria-label="复制安装指令">{copied ? '已复制' : '复制指令'}</button>
              </div>
              <div className="odp-actions">
                <a className="btn btn-primary" href={href('/quickstart/')}>查看快速开始 ↗</a>
                <a className="btn btn-ghost" href={OPEN_DESIGN_PLUGIN_REPO} target="_blank" rel="noreferrer noopener">在 GitHub 上查看源码 ↗</a>
              </div>
            </div>
            <figure className="odp-hero-media">
              <img src="/open-design-pugin/codex-real-workspace-overview.webp" alt="Codex 任务、Open Design 工作区和生成文件的真实交接过程" loading="eager" />
              <figcaption><strong>真实 Codex 任务</strong> 提示词、Open Design 交接过程、生成的文件和最终网站，全都呈现在同一个工作区。</figcaption>
            </figure>
          </div>
        </section>

        <section className="odp-demo odp-wrap" id="how-it-works">
          <header className="odp-section-head">
            <span className="odp-kicker">从安装到成品</span>
            <h2>安装一次，随时从 Codex/ChatGPT 开始创作。</h2>
            <p>先了解完整的 Codex 与 Open Design 工作区，再跟随从安装到成品的真实流程。</p>
          </header>
          <ol className="odp-run-list">
            {PLUGIN_STEPS.map((step) => (
              <li className="odp-run-item" key={step.number}>
                <div className="odp-run-copy">
                  <span className="odp-step-number">{step.number}</span>
                  <span className="odp-step-kind">{step.kind}</span>
                  <h3>{step.title}</h3>
                  <p>{step.body}</p>
                  {'command' in step && step.command ? <div className="odp-step-command"><code>{OPEN_DESIGN_PLUGIN_COMMAND}</code></div> : null}
                </div>
                {'image' in step ? <figure className="odp-run-media"><img src={step.image} alt={step.alt} loading="lazy" /></figure> : <div className="odp-run-placeholder" aria-label="安装指令步骤"><span>Codex</span><span>→</span><span>Open Design</span></div>}
              </li>
            ))}
          </ol>
        </section>

        <section className="odp-use" id="prompts">
          <div className="odp-wrap">
            <header className="odp-section-head odp-section-head-center">
              <span className="odp-kicker">直接从这条提示词开始</span>
              <h2>让 Codex 把设计需求交给 Open Design。</h2>
              <p>在 Codex 的插件菜单中选择 Open Design，描述你要创作的内容，并在同一个任务中持续完善。Codex 会将插件提及显示为 Open Design 标签。</p>
            </header>
            <div className="odp-example-grid">
              {PLUGIN_EXAMPLES.map((example) => <article className="odp-example-card" key={example.label}><span>{example.label}</span><p>{example.prompt}</p><button type="button" onClick={() => navigator.clipboard?.writeText(example.prompt)}>复制提示词 ↗</button></article>)}
            </div>
          </div>
        </section>

        <section className="odp-faq odp-wrap" id="faq">
          <header className="odp-section-head">
            <span className="odp-kicker">安装前常见问题</span>
            <h2>开始前，先确认这四件事。</h2>
          </header>
          <div className="odp-faq-list">
            {PLUGIN_FAQ.map((item, index) => <details key={item.question} className="odp-faq-item"><summary><span>{String(index + 1).padStart(2, '0')}</span><strong>{item.question}</strong><i aria-hidden="true">+</i></summary><p>{item.answer}</p></details>)}
          </div>
        </section>

        <section className="odp-final">
          <div className="odp-wrap odp-final-inner">
            <span className="odp-kicker">NEXT CODEX TASK</span>
            <h2>在下一个 Codex/ChatGPT 任务中使用 Open Design。</h2>
            <p>从一条安装指令开始，把设计方向、文件和验证都留在同一个可追踪的工作区。</p>
            <div className="odp-actions"><a className="btn btn-primary" href={href('/quickstart/')}>开始快速安装 ↗</a><a className="btn btn-ghost" href={href('/plugins/')}>浏览全部插件 ↗</a></div>
            <p className="odp-meta">Apache-2.0 · 本地优先 · Codex/ChatGPT</p>
          </div>
        </section>
      </article>
    </SubpageLayout>
  );
}

export { quickstartCode };
