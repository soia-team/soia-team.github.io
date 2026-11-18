import { SubpageLayout, hrefFor } from './shell';
import type { LandingLocaleCode } from './upstream/app/i18n';
import { SKILL_DOCS } from './skill-data';
import './missing-pages.css';

const DOC_URL = (name: string) =>
  `https://github.com/soia-team/soia-open-skills/blob/main/docs/skills/${name}.md`;
const SRC_URL = (repo: string, name: string) => `${repo}/tree/main/skills/${name}`;

type Domain = {
  slug: string;
  plugin: string;
  repo: string;
  tokens: string;
  cover: string;
  name: { zh: string; en: string };
  blurb: { zh: string; en: string };
};

export const SKILL_DOMAINS: readonly Domain[] = [
  {
    slug: 'pkm',
    plugin: 'soia-pkm-vault',
    repo: 'https://github.com/soia-team/soia-open-pkm-vault-skills',
    tokens: '~2.4k',
    cover: '/soia/domains/cover-pkm.png',
    name: { zh: '知识库 PKM', en: 'PKM Vault' },
    blurb: {
      zh: '别再收藏吃灰。网页、公众号、X、小红书、抖音、GitHub、云盘进本地 Markdown vault，再整理、提炼、转成图。',
      en: 'Clip the web, WeChat, X, Rednote, Douyin, GitHub and drives into a local Markdown vault, then organize and distill.',
    },
  },
  {
    slug: 'dev',
    plugin: 'soia-dev',
    repo: 'https://github.com/soia-team/soia-open-dev-skills',
    tokens: '~550',
    cover: '/soia/domains/cover-dev.png',
    name: { zh: '工程 Dev', en: 'Engineering' },
    blurb: {
      zh: '让 AI 改代码不再「应该没问题」就交差：定边界、最小改动、真跑验证、只读审查。',
      en: 'Bounded changes, real verification, and read-only review — not “should be fine”.',
    },
  },
  {
    slug: 'office',
    plugin: 'soia-cwork-office',
    repo: 'https://github.com/soia-team/soia-open-cwork-office-skills',
    tokens: '~680',
    cover: '/soia/domains/cover-office.png',
    name: { zh: '办公与内容', en: 'Office & content' },
    blurb: {
      zh: '飞书、ProcessOn 落成本地文件；成文、传统构图配图；公众号 / 小红书 / X 只建草稿，绝不自动群发。',
      en: 'Feishu and ProcessOn to local files; drafts and images; WeChat / Rednote / X drafts only — never auto-publish.',
    },
  },
  {
    slug: 'meta',
    plugin: 'soia-meta',
    repo: 'https://github.com/soia-team/soia-open-skills',
    tokens: '~250',
    cover: '/soia/domains/cover-meta.png',
    name: { zh: '生态 Meta', en: 'Meta' },
    blurb: {
      zh: '技能越来越多，最麻烦的是不知道该叫谁。按需求检索、同步、发布，并把提示词写清楚。',
      en: 'Find, sync, release, and clarify prompts across the whole skill family.',
    },
  },
];

export type SkillDomainSlug = (typeof SKILL_DOMAINS)[number]['slug'];

const isZh = (locale: LandingLocaleCode) => locale === 'zh';
const pick = <T,>(locale: LandingLocaleCode, value: { zh: T; en: T }): T =>
  isZh(locale) ? value.zh : value.en;

const domainOf = (slug: string) => SKILL_DOMAINS.find((d) => d.slug === slug);
const skillsOf = (slug: string) => SKILL_DOCS.filter((s) => s.domain === slug);

/** Bold-safe inline text: renders **strong** segments from the skill docs. */
function Inline({ text }: { text: string }) {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return (
    <>
      {parts.map((part, i) =>
        part.startsWith('**') && part.endsWith('**') ? (
          <strong key={i}>{part.slice(2, -2)}</strong>
        ) : (
          <span key={i}>{part}</span>
        ),
      )}
    </>
  );
}

/** Skills hub — tutorial-grid template, one card per domain. */
export function SkillsHubPage({ locale }: { locale: LandingLocaleCode }) {
  const href = (path: string) => hrefFor(path, locale);
  const zh = isZh(locale);
  return (
    <SubpageLayout active="plugins" locale={locale}>
      <article className="missing-page tutorials-page">
        <header className="catalog-head">
          <span className="label">Skills / 开源技能</span>
          <h1 className="display">{zh ? '47 个公开技能，4 个领域。' : '47 public skills, 4 domains.'}</h1>
          <p className="lead">
            {zh
              ? '技能越来越多，最麻烦的不是不会用，而是不知道该叫谁。装到 Claude Code、Codex 或 WorkBuddy；默认项目级、明确宿主、单个技能。'
              : 'The hard part is not using a skill — it is knowing which one to call. Install on Claude Code, Codex or WorkBuddy. Default: one project, one host, one skill.'}
          </p>
        </header>
        <section className="tutorial-grid">
          {SKILL_DOMAINS.map((domain) => (
            <article className="tutorial-card" key={domain.slug}>
              <a href={href(`/skills/${domain.slug}/`)}>
                <img src={domain.cover} alt="" loading="lazy" />
                <div className="tutorial-card-body">
                  <span className="label">{domain.plugin}</span>
                  <h2>{pick(locale, domain.name)}</h2>
                  <p>{pick(locale, domain.blurb)}</p>
                  <div className="tutorial-meta">
                    <span>{skillsOf(domain.slug).length} {zh ? '个技能' : 'skills'} · {domain.tokens} tok</span>
                    <span>{zh ? '查看技能 ↗' : 'View skills ↗'}</span>
                  </div>
                </div>
              </a>
            </article>
          ))}
        </section>
        <div className="missing-cta">
          <a className="btn btn-primary" href="https://github.com/soia-team/soia-open-skills" target="_blank" rel="noreferrer noopener">GitHub</a>
          <a className="btn btn-ghost" href={href('/soiadeck/')}>SoiaDeck</a>
        </div>
      </article>
    </SubpageLayout>
  );
}

/** One domain — craft-list template, one row per skill. */
export function SkillDomainPage({ locale, slug }: { locale: LandingLocaleCode; slug: SkillDomainSlug }) {
  const href = (path: string) => hrefFor(path, locale);
  const zh = isZh(locale);
  const domain = domainOf(slug);
  if (!domain) return null;
  const skills = skillsOf(slug);
  return (
    <SubpageLayout active="plugins" locale={locale}>
      <article className="missing-page craft-page">
        <nav className="breadcrumb" aria-label="breadcrumb">
          <a href={href('/skills/')}>{zh ? '开源技能' : 'Open skills'}</a><span>/</span>
          <span aria-current="page">{pick(locale, domain.name)}</span>
        </nav>
        <header className="catalog-head">
          <span className="label">{domain.plugin} · {skills.length} {zh ? '个技能' : 'skills'}</span>
          <h1 className="display">{pick(locale, domain.name)}</h1>
          <p className="lead">{pick(locale, domain.blurb)}</p>
        </header>
        <section className="tutorial-grid">
          {skills.map((skill, index) => (
            <article className="tutorial-card" key={skill.name}>
              <a href={href(`/skills/${slug}/${skill.name}/`)}>
                <img src={`/soia/skills/${skill.name}.png`} alt={skill.name} loading="lazy" />
                <div className="tutorial-card-body">
                  <span className="label">{String(index + 1).padStart(2, '0')} · {domain.plugin}</span>
                  <h2>{skill.name}</h2>
                  <p>{skill.tagline}</p>
                  <div className="tutorial-meta">
                    <span>{zh ? '查看详情' : 'Details'}</span>
                    <span>{zh ? '进入 →' : 'Open →'}</span>
                  </div>
                </div>
              </a>
            </article>
          ))}
        </section>
        <div className="missing-cta">
          <a className="btn btn-primary" href={domain.repo} target="_blank" rel="noreferrer noopener">GitHub</a>
          <a className="btn btn-ghost" href={href('/skills/')}>{zh ? '返回全部领域' : 'All domains'}</a>
        </div>
      </article>
    </SubpageLayout>
  );
}

/** One skill — plugin-detail template: head, hero, two columns, aside. */
export function SkillDetailPage({ locale, slug, skill }: { locale: LandingLocaleCode; slug: string; skill: string }) {
  const href = (path: string) => hrefFor(path, locale);
  const zh = isZh(locale);
  const domain = domainOf(slug);
  const doc = SKILL_DOCS.find((item) => item.name === skill && item.domain === slug);
  if (!domain || !doc) return null;
  return (
    <SubpageLayout active="plugins" locale={locale}>
      <nav className="breadcrumb" aria-label="breadcrumb">
        <a href={href('/skills/')}>{zh ? '开源技能' : 'Open skills'}</a><span>/</span>
        <a href={href(`/skills/${slug}/`)}>{pick(locale, domain.name)}</a><span>/</span>
        <span aria-current="page">{doc.name}</span>
      </nav>
      <article className="plugin-detail-page">
        <header className="plugin-detail-head">
          <span className="plugins-eyebrow">{domain.plugin} · {pick(locale, domain.name)}</span>
          <h1 className="display">{doc.name}<span className="dot">.</span></h1>
          <p className="lead">{doc.tagline}</p>
          <div className="od-route-actions">
            <a className="btn btn-primary" href="#install">{zh ? '安装' : 'Install'}</a>
            <a className="btn btn-ghost" href={DOC_URL(doc.name)} target="_blank" rel="noreferrer noopener">{zh ? '完整文档 ↗' : 'Full doc ↗'}</a>
          </div>
        </header>
        <figure className="plugin-detail-hero">
          <img src={`/soia/skills/${doc.name}.png`} alt={doc.name} loading="lazy" />
        </figure>
        <div className="plugin-detail-columns">
          <article>
            {doc.what.length > 0 && (
              <>
                <h2>{zh ? '它能做什么' : 'What it does'}</h2>
                {doc.what.length === 1 ? <p><Inline text={doc.what[0]} /></p> : (
                  <ul>{doc.what.map((item) => <li key={item}><Inline text={item} /></li>)}</ul>
                )}
              </>
            )}
            {doc.triggers.length > 0 && (
              <>
                <h2>{zh ? '怎么触发' : 'How to trigger'}</h2>
                {doc.triggers.map((item) => <p key={item}><Inline text={item} /></p>)}
              </>
            )}
            {doc.how.length > 0 && (
              <>
                <h2>{zh ? '如何使用' : 'How to use'}</h2>
                <ul>{doc.how.map((item) => <li key={item}><Inline text={item} /></li>)}</ul>
              </>
            )}
            <h2 id="install">{zh ? '安装' : 'Install'}</h2>
            {doc.install.length > 0 ? (
              doc.install.map((cmd) => (
                <pre className="agent-code" key={cmd}><code>{cmd}</code></pre>
              ))
            ) : (
              <p>{zh ? '见完整文档的安装节。' : 'See the install section in the full doc.'}</p>
            )}
            <p>
              {zh
                ? '默认项目级、明确宿主、单个技能；整域或全局安装须你明确选择。发布不会自动装到本机。'
                : 'Default is project scope, one host, one skill. Whole-domain or global installs need an explicit choice. Releases do not auto-install.'}
            </p>
            <h2>{zh ? '公开边界' : 'Boundaries'}</h2>
            <p>
              {zh
                ? '技能只提供方法，在你自己的机器上运行。写操作、发布与联网按当次明确授权执行；凭据由官方登录流程持有，不进仓库、不进日志。'
                : 'A skill is a method that runs on your machine. Writes, publishing and network access need explicit per-run approval; credentials stay with official login flows and never enter repos or logs.'}
            </p>
          </article>
          <aside className="plugin-detail-aside">
            <span className="plugins-eyebrow">{zh ? '来源' : 'Source'}</span>
            <p>{zh ? '本页内容派生自该技能的公开文档与源码。' : 'This page is derived from the skill’s public doc and source.'}</p>
            <a className="btn btn-primary" href={SRC_URL(domain.repo, doc.name)} target="_blank" rel="noreferrer noopener">{zh ? '查看源码 ↗' : 'Source ↗'}</a>
            <a className="btn btn-ghost" href={href(`/skills/${slug}/`)}>← {pick(locale, domain.name)}</a>
            <a className="btn btn-ghost" href={href('/skills/')}>{zh ? '全部领域' : 'All domains'}</a>
          </aside>
        </div>
      </article>
    </SubpageLayout>
  );
}

/** SoiaDeck — tutorial-detail template. */
export function SoiaDeckPage({ locale }: { locale: LandingLocaleCode }) {
  const href = (path: string) => hrefFor(path, locale);
  const zh = isZh(locale);
  const sections: ReadonlyArray<{ id: string; title: string; body: string; image?: string; alt?: string }> = zh
    ? [
        { id: 'workbench', title: 'AI 作业台', body: '在桌面应用里开 Claude Code、Codex 等对话。每种 Agent 走自己的原生协议；没有原生协议的走 ACP，也有终端 PTY。对话由后端持有：关掉页面 Agent 继续跑，重开从缓冲重放。项目、工作树和权限审批都在这里管。', image: '/soia/products/soiadeck-wb-home.png', alt: 'SoiaDeck AI 作业台首页' },
        { id: 'factory', title: '工坊与项目', body: '左侧工坊切换工作区，下面是插件、作业台、本地 LLM、AI 网络四个入口。项目列表按仓库分组，每个条目显示待审批与待处理数量，新建项目直接在列表里完成。', image: '/soia/products/soiadeck-plugins.png', alt: 'SoiaDeck 插件中心' },
        { id: 'approvals', title: '权限审批', body: '要执行命令、写工作区外文件、联网前先问你。可以逐次允许、本对话内允许或拒绝；多条待审批可逐张处理。每一次决定都进会话记录，可回放。', image: '/soia/products/soiadeck-home.png', alt: 'SoiaDeck 首页待处理与权限审批' },
        { id: 'models', title: '本地 LLM', body: '发现、启停、下载本机模型，并提供一个 OpenAI 兼容入口。现在推理引擎以 MLX 系为主，所以本地模型在 Apple Silicon 上最完整。作业台本身不依赖本地模型。', image: '/soia/products/soiadeck-router.png', alt: 'SoiaDeck 本地 LLM 模型转发' },
        { id: 'network', title: 'AI 网络', body: '本机访问各 AI 服务走哪张网卡、连不连得通。核心管理能力断网可用。', image: '/soia/products/soiadeck-net.png', alt: 'SoiaDeck AI 网络监控' },
        { id: 'remote', title: '远程访问与手机端', body: '电脑开启远程访问或通过中继配对后，手机端可随时查看对话进度、看代码改动与 Diff，并在手机上远程审批权限或止损停轮。', image: '/soia/products/soiadeck-phone.png', alt: 'SoiaDeck 手机端远程访问与设计总览' },
        { id: 'account', title: '远程账号与名下主机', body: '账号网页支持邮箱验证码与 Passkey 登录，集中管理名下绑定的主机指纹、登录设备与中继流量；设备丢失时可一键标记丢失并自动通知中继收回授权。', image: '/soia/products/soiadeck-account.png', alt: 'SoiaDeck 远程账号与名下主机' },
        { id: 'relay', title: '中继服务', body: '不在同一局域网时，手机与电脑通过轻量中继建立加密通道，中继只做转发不看对话内容；维护期间支持 90 秒内自动续上，连接不断。', image: '/soia/products/soiadeck-relay.png', alt: 'SoiaDeck 中继服务状态与通道监控' },
        { id: 'admin', title: '账号管理后台', body: '面向自部署与团队管理员的后台界面，统一查看账号状态、邀请名单、登记主机、封禁异常主机及操作审计记录，支持只读与 SSH 隧道模式。', image: '/soia/products/soiadeck-admin.png', alt: 'SoiaDeck 账号管理后台' },
        { id: 'agents', title: '已接 19 个 coding agent', body: '包括 Claude Code、Codex、Cursor、Gemini CLI、Pi、OpenCode、Copilot、Qwen、Kimi、Kiro、Trae、Grok、Antigravity 等。清单以 SoiaDeck 的 agent-manifest-index 为准。', image: '/soia/products/soiadeck-19-agents.png', alt: 'SoiaDeck 已接入 19 个 Coding Agent 矩阵' },
        { id: 'open', title: '即将开源', body: '现在是私有仓，持续开发中。目前只发 macOS arm64 安装包；Linux / Windows 有构建入口，但没验收、不发包。官网不假装已有公开下载。' },
      ]
    : [
        { id: 'workbench', title: 'AI Workbench', body: 'Open Claude Code, Codex and other agent conversations in the desktop app. Each agent uses its native protocol; others use ACP or a PTY. The backend owns the conversation: close the page and the agent keeps working.', image: '/soia/products/soiadeck-wb-home.png', alt: 'SoiaDeck AI Workbench home' },
        { id: 'factory', title: 'Workshops and projects', body: 'Switch workspaces from the left rail; plugins, workbench, local LLM and AI network sit under it. Projects are grouped by repository with pending approvals and tasks counted per row.', image: '/soia/products/soiadeck-plugins.png', alt: 'SoiaDeck Plugin Center' },
        { id: 'approvals', title: 'Approvals', body: 'Commands, writes outside the workspace and network access ask first. Allow once, allow for this conversation, or deny; batch cards can be handled one by one. Every decision lands in the session record.', image: '/soia/products/soiadeck-home.png', alt: 'SoiaDeck desktop home and approvals' },
        { id: 'models', title: 'Local LLM', body: 'Discover, start/stop and download local models, plus one OpenAI-compatible endpoint. Engines today are mostly MLX, so local models are most complete on Apple Silicon.', image: '/soia/products/soiadeck-router.png', alt: 'SoiaDeck Local LLM router' },
        { id: 'network', title: 'AI Network', body: 'Which network interface the machine uses to reach AI services, and whether they are reachable. Core management still works offline.', image: '/soia/products/soiadeck-net.png', alt: 'SoiaDeck AI Network' },
        { id: 'remote', title: 'Remote & Mobile', body: 'Pair your phone over local LAN or relay to follow running sessions, inspect diffs, approve tool permissions, or stop a turn on the go.', image: '/soia/products/soiadeck-phone.png', alt: 'SoiaDeck mobile surface' },
        { id: 'account', title: 'Remote account & bound hosts', body: 'Sign in with email verification or Passkey on the Account Web to manage bound host fingerprints, active devices, and relay usage — or mark a lost device to revoke access immediately.', image: '/soia/products/soiadeck-account.png', alt: 'SoiaDeck account web and bound hosts' },
        { id: 'relay', title: 'Relay service', body: 'When away from your local network, desktop and mobile connect through an encrypted relay that forwards traffic without inspecting contents, with automatic 90s reconnect during maintenance.', image: '/soia/products/soiadeck-relay.png', alt: 'SoiaDeck relay service' },
        { id: 'admin', title: 'Admin console', body: 'A dedicated operator console for self-hosted and team deployments to inspect accounts, manage invite lists, ban anomalous hosts, and audit operations.', image: '/soia/products/soiadeck-admin.png', alt: 'SoiaDeck admin console' },
        { id: 'agents', title: '19 coding agents', body: 'Including Claude Code, Codex, Cursor, Gemini CLI, Pi, OpenCode, Copilot, Qwen, Kimi, Kiro, Trae, Grok and Antigravity.', image: '/soia/products/soiadeck-19-agents.png', alt: 'SoiaDeck 19 coding agents' },
        { id: 'open', title: 'Coming open source', body: 'Private today, under active development. Only macOS arm64 installers ship; Linux and Windows have build entry points but are not released.' },
      ];
  return (
    <SubpageLayout active="product" locale={locale}>
      <article className="missing-page tutorial-detail">
        <nav className="breadcrumb" aria-label="breadcrumb">
          <a href={href('/')}>SOIA</a><span>/</span><span>SoiaDeck</span>
        </nav>
        <header className="catalog-head">
          <span className="label">{zh ? 'SOIA 家族 · 当前主角 · 即将开源' : 'SOIA family · current lead · coming open source'}</span>
          <h1 className="display">SoiaDeck</h1>
          <p className="lead">
            {zh
              ? '桌面 AI 平台：本机 daemon + 桌面 / 网页 / CLI。主线是 AI 作业台——在桌面里跑 Claude Code、Codex 等编码 Agent，处理权限、项目和工作树，不用另开终端。'
              : 'A desktop AI platform: one local daemon, plus desktop, browser and CLI. The AI Workbench runs Claude Code, Codex and other coding agents with approvals, projects and worktrees.'}
          </p>
        </header>
        <figure className="tutorial-detail-hero">
          <img src="/soia/products/soiadeck-workbench.png" alt="SoiaDeck AI Workbench" />
        </figure>
        <div className="tutorial-detail-layout">
          <aside className="missing-toc">
            <span>{zh ? '本页内容' : 'On this page'}</span>
            {sections.map((section) => (
              <a href={`#${section.id}`} key={section.id}>{section.title}</a>
            ))}
          </aside>
          <div className="missing-article">
            {sections.map((section) => (
              <section id={section.id} key={section.id}>
                <h2>{section.title}</h2>
                <p>{section.body}</p>
                {section.image ? (
                  <figure className="tutorial-detail-hero" style={{ marginTop: 18 }}>
                    <img src={section.image} alt={section.alt ?? section.title} loading="lazy" />
                  </figure>
                ) : null}
              </section>
            ))}
            <div className="missing-cta">
              <a className="btn btn-primary" href={href('/skills/')}>{zh ? '看开源技能' : 'Open skills'}</a>
              <a className="btn btn-ghost" href={href('/soia/')}>SOIA Runtime</a>
            </div>
          </div>
        </div>
      </article>
    </SubpageLayout>
  );
}

/** SoiaCode (si) — tutorial-detail template. */
export function SoiaCodePage({ locale }: { locale: LandingLocaleCode }) {
  const href = (path: string) => hrefFor(path, locale);
  const zh = isZh(locale);
  const sections: ReadonlyArray<{ id: string; title: string; body: string }> = zh
    ? [
        { id: 'overview', title: '极小内核，单二进制', body: 'SoiaCode（简称与命令 si）是用 Rust 编写的轻量 coding agent：一个极小内核加一个命令行工具，打成单个静态二进制，内存占用低，可以直接拷到线上服务器排查问题。' },
        { id: 'tools', title: '五个内置工具与按需扩展', body: '内置读（read）、写（write）、改（edit）、执行命令（bash）、搜索（search）五个工具，以及权限检查与会话管理。子 agent、todo、记忆、网页、LSP 等做成扩展按需安装，也支持接入 MCP 工具。' },
        { id: 'attention', title: '省注意力', body: '「Your attention is all it needs.」系统提示词短，工具输出先裁剪再进上下文，只在授权、风险和方向这些关键节点打断人，不把无关噪声堆进对话。' },
        { id: 'modes', title: '五种运行方式', body: '支持 si（终端交互）、si -p "任务"（print 模式用于脚本与 CI）、si --mode rpc（RPC 长期驱动）、si --mode acp（接入 Zed 等编辑器）以及作为 Rust 库 soiacode-sdk 嵌入外部程序。' },
        { id: 'safety', title: '内置权限检查与审计', body: '不依赖外部沙箱：工作区内读写默认放行，写工作区外文件、执行命令、联网、读取凭据均需经过权限挂载点，无人批准即拒绝。提供 plan（只读）、default、bypass 三种模式（Shift+Tab 切换），每次调用与决定均进会话可回放，凭据不入日志。' },
        { id: 'status', title: '当前进度', body: '目前处于方案与详细设计阶段（M1），还没有发布可用代码与二进制包。仓库内提供完整原则、架构、详细设计与决策记录。' },
      ]
    : [
        { id: 'overview', title: 'Minimal kernel, single binary', body: 'SoiaCode (command si) is a lightweight coding agent written in Rust: one tiny core plus a CLI compiled into a single static binary with a small memory footprint.' },
        { id: 'tools', title: 'Five built-in tools & extensions', body: 'Ships with read, write, edit, bash, and search, plus permission checks and session storage. Subagents, todo, memory, web, and LSP live as extensions or MCP tools.' },
        { id: 'attention', title: 'Attention-preserving', body: '“Your attention is all it needs.” Short system prompt, trimmed tool outputs before entering context, interrupting the user only on approvals, risk, and direction.' },
        { id: 'modes', title: 'Five ways to run', body: 'Interactive terminal (si), print mode (si -p "task"), long-lived RPC (si --mode rpc), ACP for editors like Zed (si --mode acp), and Rust crate embedding (soiacode-sdk).' },
        { id: 'safety', title: 'Built-in permissions & audit', body: 'Built-in permission hooks without relying on an external sandbox. Three modes via Shift+Tab: plan (read-only), default, and bypass. Every tool call and decision is recorded for replay; credentials never enter logs.' },
        { id: 'status', title: 'Current status', body: 'Currently in the design stage (milestone M1) with no released binary yet.' },
      ];
  return (
    <SubpageLayout active="product" locale={locale}>
      <article className="missing-page tutorial-detail">
        <nav className="breadcrumb" aria-label="breadcrumb">
          <a href={href('/')}>SOIA</a><span>/</span><span>SoiaCode</span>
        </nav>
        <header className="catalog-head">
          <span className="label">{zh ? 'SOIA 家族 · 方案阶段 · 暂未开源' : 'SOIA family · design stage · not open source yet'}</span>
          <h1 className="display">SoiaCode (si)</h1>
          <p className="lead">
            {zh
              ? '用 Rust 编写的轻量 coding agent：极小内核、内置五个工具与权限检查。宗旨是「人守住注意力，系统守住安全」。'
              : 'A lightweight Rust coding agent: minimal kernel, five built-in tools, and explicit permission checks.'}
          </p>
        </header>
        <figure className="tutorial-detail-hero">
          <img src="/soia/products/soiacode-overview.png" alt="SoiaCode overview" />
        </figure>
        <div className="tutorial-detail-layout">
          <aside className="missing-toc">
            <span>{zh ? '本页内容' : 'On this page'}</span>
            {sections.map((section) => (
              <a href={`#${section.id}`} key={section.id}>{section.title}</a>
            ))}
          </aside>
          <div className="missing-article">
            {sections.map((section) => (
              <section id={section.id} key={section.id}>
                <h2>{section.title}</h2>
                <p>{section.body}</p>
              </section>
            ))}
            <div className="missing-cta">
              <a className="btn btn-primary" href={href('/soiadeck/')}>SoiaDeck</a>
              <a className="btn btn-ghost" href={href('/skills/')}>{zh ? '看开源技能' : 'Open skills'}</a>
            </div>
          </div>
        </div>
      </article>
    </SubpageLayout>
  );
}

/** SOIA Runtime — tutorial-detail template. */
export function SoiaRuntimePage({ locale }: { locale: LandingLocaleCode }) {
  const href = (path: string) => hrefFor(path, locale);
  const zh = isZh(locale);
  const sections: ReadonlyArray<{ id: string; title: string; body: string }> = zh
    ? [
        { id: 'what', title: '开源 Agent Operating System', body: 'SOIA（System, Orchestration, Intelligence, Assurance）是本地运行 AI Agent 的开源运行时基础设施，位于 Claude Code、Codex CLI、Gemini CLI 等工具之下，负责统一凭据、执行历史记录、多 AI 协同调度与完整可审计性。' },
        { id: 'provider', title: 'Provider Plane 与认证家族', body: '通过统一注册表接入 Claude、Codex、Gemini、Ollama 或任意 OpenAI 兼容端点，支持 5 种认证家族（ApiKey、OauthSubscription、CliCredentialImport、IamCloud、CompatibleEndpoint）与 SSE 流式分发。' },
        { id: 'loop', title: 'Native Agent Loop 与上下文压缩', body: '内置 soia-agent-loop crate，提供 IterationBudget、InterruptToken 与并行工具批处理能力；配合 compact_with_summary、micro_compact 与 heuristic_summarize 防止长会话上下文溢出。' },
        { id: 'memory', title: '本地记忆与混合检索', body: '通过 BM25 + 向量混合检索与本地 RAG 跨会话保留上下文，所有记忆与会话数据留在本地机器，不依赖云端托管。' },
        { id: 'governance', title: '多 AI 治理与 8 层架构', body: '包含 Proposal 流水线、任务看板与审计日志以协同多个 AI 并行工作；底层由 29 个 Rust Runtime Crates 组成（覆盖 agent / channel / cli / foundation / gateway / llm / runtime / business 八层目录结构），上层提供 Tauri 2 + React 19 桌面端与 soia CLI。' },
      ]
    : [
        { id: 'what', title: 'Open-source Agent Operating System', body: 'SOIA (System, Orchestration, Intelligence, Assurance) is the open-source runtime layer beneath tools like Claude Code, Codex CLI, and Gemini CLI — managing credentials, execution history, multi-AI coordination, and auditability locally.' },
        { id: 'provider', title: 'Provider Plane & auth families', body: 'Unified registry for Claude, Codex, Gemini, Ollama, and OpenAI-compatible endpoints across 5 auth families (ApiKey, OauthSubscription, CliCredentialImport, IamCloud, CompatibleEndpoint) with SSE streaming.' },
        { id: 'loop', title: 'Native Agent Loop & compaction', body: 'soia-agent-loop provides IterationBudget, InterruptToken, and parallel tool batching, paired with compact_with_summary, micro_compact, and heuristic_summarize.' },
        { id: 'memory', title: 'Local memory & hybrid RAG', body: 'BM25 + vector hybrid search and local RAG persist context across sessions without sending data to a cloud service.' },
        { id: 'governance', title: 'Multi-AI governance & 8-layer runtime', body: 'Proposal pipeline, task board, and audit logs coordinate parallel agents across 29 Rust runtime crates, paired with a Tauri 2 + React 19 desktop app and the soia CLI.' },
      ];
  return (
    <SubpageLayout active="product" locale={locale}>
      <article className="missing-page tutorial-detail">
        <nav className="breadcrumb" aria-label="breadcrumb">
          <a href={href('/')}>SOIA</a><span>/</span><span>SOIA Runtime</span>
        </nav>
        <header className="catalog-head">
          <span className="label">{zh ? 'SOIA 家族 · 开源底层 · MIT' : 'SOIA family · open-source runtime · MIT'}</span>
          <h1 className="display">SOIA Runtime</h1>
          <p className="lead">
            {zh
              ? '开源 Agent Operating System（Rust + Tauri 2）：29 个 Runtime Crates、本地记忆与混合检索、多 AI 治理与 CLI。'
              : 'Open-source Agent Operating System (Rust + Tauri 2): 29 runtime crates, local hybrid memory, multi-AI governance, and CLI.'}
          </p>
        </header>
        <figure className="tutorial-detail-hero">
          <img src="/soia/products/soia-runtime-overview.png" alt="SOIA Runtime overview" />
        </figure>
        <div className="tutorial-detail-layout">
          <aside className="missing-toc">
            <span>{zh ? '本页内容' : 'On this page'}</span>
            {sections.map((section) => (
              <a href={`#${section.id}`} key={section.id}>{section.title}</a>
            ))}
          </aside>
          <div className="missing-article">
            {sections.map((section) => (
              <section id={section.id} key={section.id}>
                <h2>{section.title}</h2>
                <p>{section.body}</p>
              </section>
            ))}
            <div className="missing-cta">
              <a className="btn btn-primary" href="https://github.com/soia-team/soia" target="_blank" rel="noreferrer noopener">GitHub (soia-team/soia) ↗</a>
              <a className="btn btn-ghost" href={href('/soiadeck/')}>SoiaDeck</a>
            </div>
          </div>
        </div>
      </article>
    </SubpageLayout>
  );
}
