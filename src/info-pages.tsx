/*
 * Standalone SOIA information pages: FAQ, About, Privacy and Terms.
 * Reuses the Open Design `.standalone-info` / `.faq-page` / `.legal-page` /
 * `.about-page` layout classes and design tokens verbatim.
 */
import { getHomeFaq, type LandingLocaleCode } from './upstream/app/i18n';
import { hrefFor, REPO, REPO_DISCUSSIONS, REPO_ORG, SubpageLayout } from './shell';
import './missing-pages.css';

const LEGAL_COPY = {
  privacy: {
    en: { title: 'Privacy Policy', updated: 'Last updated: November 18, 2026' },
    zh: { title: '隐私政策', updated: '最后更新：2026 年 11 月 18 日' },
  },
  terms: {
    en: { title: 'Terms of Service', updated: 'Last updated: November 18, 2026' },
    zh: { title: '服务条款', updated: '最后更新：2026 年 11 月 18 日' },
  },
} as const;

type LegalSection = { heading: string; paragraphs: string[]; bullets?: string[] };

const PRIVACY: Record<'en' | 'zh', LegalSection[]> = {
  en: [
    { heading: '1. Local-first by default', paragraphs: ['SoiaDeck and SOIA open skills run on your own machine. Your files, local Markdown vaults, prompts, project worktrees, and model keys remain on your device.'] },
    { heading: '2. What this website stores', paragraphs: ['This static site is hosted on GitHub Pages. It does not run a tracking backend, sell user data, or require an account. The newsletter preview form currently stores entries only in your local browser session.'] },
    { heading: '3. Model and network calls', paragraphs: ['When you configure a model provider or CLI (such as Claude Code, Codex, or local MLX endpoints) or ask SoiaDeck to search/download local models, requests go directly to the endpoint you selected.'] },
    { heading: '4. Open skills and credentials', paragraphs: ['Credentials for third-party platforms (such as Feishu or WeChat drafts) stay in official login flows or local configuration outside skill repositories and are never committed or logged.'] },
    { heading: '5. Contact', paragraphs: ['Questions about privacy can be raised via GitHub Discussions at soia-team/soia-open-skills.'] },
  ],
  zh: [
    { heading: '1. 默认本地优先', paragraphs: ['SoiaDeck 与 SOIA 开源技能都在你自己的机器上运行。你的文件、本地 Markdown 知识库、提示词、工作树和模型密钥都留在本地设备中。'] },
    { heading: '2. 本站收集的信息', paragraphs: ['本站是托管在 GitHub Pages 上的静态站点，不设后台追踪、不出售用户数据、也不要求注册账号。订阅表单当前仅在本地浏览器会话内记录，尚未接入邮件列表后端。'] },
    { heading: '3. 模型与网络请求', paragraphs: ['当你配置模型供应商、CLI（如 Claude Code、Codex 或本机 MLX 端点）或主动搜索、下载本地模型时，请求会直接发往你选择的端点。'] },
    { heading: '4. 开源技能与凭据边界', paragraphs: ['第三方平台凭据（如飞书、公众号草稿箱等）由官方登录流程或本机隔离配置持有，不进入技能仓库、不写入日志。'] },
    { heading: '5. 联系方式', paragraphs: ['如有隐私相关问题，请在 GitHub 仓库 soia-team/soia-open-skills 的 Discussions 提出。'] },
  ],
};

const TERMS: Record<'en' | 'zh', LegalSection[]> = {
  en: [
    { heading: '1. Open-source license', paragraphs: ['SOIA public skill repositories and docs under github.com/soia-team/soia-open-skills are licensed under the MIT License unless otherwise noted in each repository.'] },
    { heading: '2. Pre-release software', paragraphs: ['SoiaDeck is currently private and under active development; SoiaCode is in the design stage. This site documents public facts and does not promise unreleased timelines or hosted SaaS SLAs.'] },
    { heading: '3. Local execution responsibility', paragraphs: ['You are responsible for commands, file writes, drafts, and third-party API usage executed by coding agents on your machine. Write actions and publishing require your explicit approval.'] },
    { heading: '4. No warranty', paragraphs: ['Public repositories and documentation are provided "as is" without warranty of any kind, to the extent permitted by applicable law.'] },
    { heading: '5. Contact', paragraphs: ['Reach soia-team via GitHub Discussions or github.com/soia-team.'] },
  ],
  zh: [
    { heading: '1. 开源协议', paragraphs: ['github.com/soia-team/soia-open-skills 下的公开技能仓与文档采用 MIT 协议；具体以各仓库内的 LICENSE 文件为准。'] },
    { heading: '2. 未公开发布的组件', paragraphs: ['SoiaDeck 目前仍为私有仓并持续开发中；SoiaCode 处于设计阶段。本站仅陈述当前公开事实，不对未发布版本作商业 SLA 承诺。'] },
    { heading: '3. 本地执行与授权边界', paragraphs: ['你对你本机上由编码 Agent 执行的命令、文件写入、草稿创建与第三方 API 调用负责；写操作与对外发布应按当次明确授权执行。'] },
    { heading: '4. 免责声明', paragraphs: ['在适用法律允许的最大范围内，公开仓库、技能与文档按“现状”提供，不作任何明示或暗示担保。'] },
    { heading: '5. 联系方式', paragraphs: ['可通过 github.com/soia-team 或 GitHub Discussions 联系 soia-team。'] },
  ],
};

function languageKey(locale: LandingLocaleCode): 'en' | 'zh' {
  return locale === 'zh' ? 'zh' : 'en';
}

export function FaqPage({ locale }: { locale: LandingLocaleCode }) {
  const faq = getHomeFaq(locale, { origin: 'https://soia-team.github.io/', repo: REPO });
  const zh = languageKey(locale) === 'zh';
  return (
    <SubpageLayout active="resources" locale={locale}>
      <article className="standalone-info faq-page" data-od-id="faq">
        <header className="standalone-head">
          <span className="standalone-kicker">{zh ? '常见问题' : 'FAQ'}</span>
          <h1>{zh ? 'SOIA 常见问题' : 'SOIA FAQ'}<span>.</span></h1>
          <p>{zh ? '关于 SoiaDeck、开源技能、SoiaCode 与本地优先边界的常见问题。' : 'Common questions about SoiaDeck, open skills, SoiaCode, and local-first boundaries.'}</p>
        </header>
        <dl className="standalone-faq-list">
          {faq.map((item) => (
            <div className="standalone-faq-item" key={item.q}>
              <dt>{item.q}</dt>
              <dd>{item.a}</dd>
            </div>
          ))}
        </dl>
      </article>
    </SubpageLayout>
  );
}

export function LegalPage({ locale, kind }: { locale: LandingLocaleCode; kind: 'privacy' | 'terms' }) {
  const key = languageKey(locale);
  const meta = LEGAL_COPY[kind][key];
  const sections = kind === 'privacy' ? PRIVACY[key] : TERMS[key];
  return (
    <SubpageLayout active="resources" locale={locale}>
      <article className="standalone-info legal-page" data-od-id={kind}>
        <header className="standalone-head">
          <span className="standalone-kicker">{kind === 'privacy' ? 'PRIVACY' : 'TERMS'} / SOIA</span>
          <h1>{meta.title}</h1>
          <p className="legal-updated">{meta.updated}</p>
        </header>
        {sections.map((section) => (
          <section className="legal-section" key={section.heading}>
            <h2>{section.heading}</h2>
            {section.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
            {section.bullets ? <ul>{section.bullets.map((bullet) => <li key={bullet}>{bullet}</li>)}</ul> : null}
          </section>
        ))}
        <footer className="legal-contact">
          <a href={REPO_ORG} target="_blank" rel="noreferrer noopener">soia-team</a>
          <span>·</span>
          <a href={REPO} target="_blank" rel="noreferrer noopener">GitHub</a>
          <span>·</span>
          <a href={REPO_DISCUSSIONS} target="_blank" rel="noreferrer noopener">Discussions</a>
        </footer>
      </article>
    </SubpageLayout>
  );
}

export function AboutPage({ locale }: { locale: LandingLocaleCode }) {
  const zh = languageKey(locale) === 'zh';
  const href = (path: string) => hrefFor(path, locale);

  const thesis = zh
    ? {
        problemTitle: '为什么今天的 AI Coding 仍然像聊天框？',
        problemBody:
          '瓶颈早就不是模型单轮有多聪明，而是外围控制面没有闭合：工作区没有收敛为唯一真源，权限审批、事实账本、记忆检索与跨端调度各自分裂——许多工具干脆把代码、密钥与会话关进单家云黑盒。',
        solutionTitle: 'SOIA 的解法：Workspace-first Agent OS',
        solutionBody:
          '我们不绑死模型也不制造闭源云墙。无论你在桌面端、手机端还是终端 CLI 干活，底层始终共享同一套可审计工作区、权限关口、事件流与事实账本——让你用已有的 CLI 订阅与本地模型真正可控地跑长任务。',
      }
    : {
        problemTitle: 'Why AI coding still stalls like chat',
        problemBody:
          'The bottleneck is no longer single-turn model IQ — it is a fragmented harness. Workspaces are not the source of truth, permissions and audit ledgers are missing, and sessions trap code inside proprietary cloud black boxes.',
        solutionTitle: 'SOIA’s answer: Workspace-first Agent OS',
        solutionBody:
          'Desktop, mobile, and CLI share one observable workspace, explicit permission gate, and append-only ledger — plugging straight into the coding CLI subscriptions and local models you already own.',
      };

  const primitives = zh
    ? [
        { code: '01 · Workspace', tag: '唯一真源', desc: '保存项目路径、Git Worktree、任务与配置。无论桌面、手机还是 CLI 接入，永远面向同一份本地客观事实。' },
        { code: '02 · AgentRun', tag: '可恢复事件流', desc: '把一次执行拆成可观察、可插话纠偏（Steer）、可断点恢复、可分叉探索的透明会话树。' },
        { code: '03 · Capability', tag: '权限与预算关口', desc: '高危命令、工作区外写入、外部联网与费用动作执行前必须过明确规则与人工授权闸门。' },
        { code: '04 · Ledger', tag: '不可篡改账本', desc: '工具调用、审批决策与文件快照全部 append-only 落盘（JSONL），出事不靠截图回忆，而是逐帧回放。' },
      ]
    : [
        { code: '01 · Workspace', tag: 'Source of Truth', desc: 'Repos, worktrees, tasks, and config stay local so every client sees one authoritative state.' },
        { code: '02 · AgentRun', tag: 'Recoverable Stream', desc: 'Turns run as observable, steerable, forkable event streams instead of ephemeral chat tabs.' },
        { code: '03 · Capability', tag: 'Permission Gate', desc: 'Shell exec, out-of-workspace edits, network, and spend checks pass explicit rules first.' },
        { code: '04 · Ledger', tag: 'Append-Only Audit', desc: 'Every tool invocation, approval decision, and file snapshot lands in plain JSONL for exact replay.' },
      ];

  const family = zh
    ? [
        {
          ord: '01 · LEAD PRODUCT',
          badge: '即将开源 · macOS arm64',
          name: 'SoiaDeck',
          desc: '跨端 AI 作业台：本机 daemon + 桌面 / 手机 / 加密中继 / 本地 MLX，统一并行驱动 19 个 Coding Agent，处理审批与 Diff。',
          to: href('/soiadeck/'),
          cta: '查看 SoiaDeck 架构 →',
        },
        {
          ord: '02 · CORE KERNEL',
          badge: '设计定稿阶段 · 0.0.1 M1',
          name: 'SoiaCode (si)',
          desc: '用 Rust 编写的轻量 Agent 内核。「人守住注意力，系统守住安全」——5 内置工具、10 挂载点与 34 个可扩展外围。',
          to: href('/soiacode/'),
          cta: '阅读系统边界与规格 →',
        },
        {
          ord: '03 · OPEN ECOSYSTEM',
          badge: '已开源 · MIT · 47 技能',
          name: 'Open Skills 技能生态',
          desc: '覆盖知识库 PKM（27）、工程 Dev（9）、办公 Office（7）、生态 Meta（4），按项目级最小范围装入宿主 CLI。',
          to: href('/skills/'),
          cta: '按分类浏览 47 个技能 →',
        },
        {
          ord: '04 · AGENT OS BASE',
          badge: 'github.com/soia-team/soia',
          name: 'SOIA Runtime',
          desc: '面向 Model → Harness → Agent OS 演进的底层运行时、方法论规格与六步最小闭环原语。',
          to: href('/soia/'),
          cta: '查看 Agent OS 演进 →',
        },
      ]
    : [
        {
          ord: '01 · LEAD PRODUCT',
          badge: 'Coming OSS · macOS arm64',
          name: 'SoiaDeck',
          desc: 'Cross-device workbench with local daemon, mobile diff approvals, encrypted NAT relay, MLX router, and 19 coding agent adapters.',
          to: href('/soiadeck/'),
          cta: 'Explore SoiaDeck →',
        },
        {
          ord: '02 · CORE KERNEL',
          badge: 'Design Stage · 0.0.1 M1',
          name: 'SoiaCode (si)',
          desc: 'Minimal Rust agent kernel built on “humans guard attention, the system guards safety” — 5 built-in tools & 10 mounts.',
          to: href('/soiacode/'),
          cta: 'Read boundaries & specs →',
        },
        {
          ord: '03 · OPEN ECOSYSTEM',
          badge: 'Open Source · MIT · 47 Skills',
          name: 'Open Skills',
          desc: '47 public workflow skills across PKM Vault (27), Dev (9), Office (7), and Meta (4) for Claude Code, Codex & WorkBuddy.',
          to: href('/skills/'),
          cta: 'Browse all 47 skills →',
        },
        {
          ord: '04 · AGENT OS BASE',
          badge: 'github.com/soia-team/soia',
          name: 'SOIA Runtime',
          desc: 'Underlying Model → Harness → Agent OS primitives, specifications, and closed-loop ledger architecture.',
          to: href('/soia/'),
          cta: 'View Agent OS specs →',
        },
      ];

  const guardrails = zh
    ? [
        { title: '默认零遥测、代码留本机', desc: '仓库文件、会话树与 API 凭据都在自己硬件里；NAT 中继只转发密文不留存原文。' },
        { title: '自带订阅与模型，拒绝锁死', desc: '直接复用已有 Claude Code / Codex / Cursor 等 CLI 订阅或本机 MLX 模型。' },
        { title: '草稿优先与逐条人工审批', desc: '公众号 / 小红书 / X 只建草稿不群发；命令执行与越界写入必须先经确认。' },
        { title: '工程诚实、边界透明', desc: '现阶段明确标注仅发布 macOS arm64、SoiaCode 尚无二进制包，不靠空话凑功能表。' },
      ]
    : [
        { title: 'Zero Telemetry & Local Ownership', desc: 'Repos, session JSONL trees, and credentials stay on your machines; relay sees ciphertext only.' },
        { title: 'Bring Your Subscriptions', desc: 'Reuse existing Claude Code, Codex, or local MLX models without vendor lock-in.' },
        { title: 'Draft-first & Explicit Approval', desc: 'Publishing skills create drafts only; risky commands and writes pause for explicit confirmation.' },
        { title: 'Honest Release Scope', desc: 'Clear status labels across every repo — no vaporware download promises for unverified targets.' },
      ];

  return (
    <SubpageLayout active="community" locale={locale}>
      <article className="about-editorial" data-od-id="about">
        <header className="about-hero-box">
          <div className="about-hero-acronym">
            SYSTEM · ORCHESTRATION · INTELLIGENCE · ASSURANCE
          </div>
          <h1>{zh ? '关于 SOIA' : 'About SOIA'}<span>.</span></h1>
          <p className="about-hero-lead">
            {zh
              ? '大模型天生无状态、易漂移；SOIA（Structured Orchestration for Intelligent Agents）的工作，是把它组织成可感知、可治理、可恢复、可审计的本地优先工程系统。'
              : 'LLMs are stateless and drift by nature. SOIA (Structured Orchestration for Intelligent Agents) turns them into an observable, governable, recoverable, and auditable local-first engineering system.'}
          </p>
        </header>

        <section className="about-sec">
          <div className="about-sec-head">
            <div>
              <span>01 · {zh ? '核心判断' : 'THE THESIS'}</span>
              <h2>{zh ? '为什么造 SOIA，而不是再套一个聊天壳' : 'Why build an Agent OS instead of another chat wrapper'}</h2>
            </div>
          </div>
          <div className="about-compare">
            <div className="about-compare-card">
              <strong>{thesis.problemTitle}</strong>
              <p>{thesis.problemBody}</p>
            </div>
            <div className="about-compare-card is-soia">
              <strong>{thesis.solutionTitle}</strong>
              <p>{thesis.solutionBody}</p>
            </div>
          </div>
        </section>

        <section className="about-sec">
          <div className="about-sec-head">
            <div>
              <span>02 · {zh ? '四大核心原语' : 'CORE PRIMITIVES'}</span>
              <h2>{zh ? '让 AI 从一次性对话进入工程控制平面' : 'From one-off prompts to a closed engineering control plane'}</h2>
            </div>
          </div>
          <div className="about-primitives">
            {primitives.map((p) => (
              <div className="about-prim-card" key={p.code}>
                <div className="about-prim-top">
                  <code>{p.code}</code>
                  <span>{p.tag}</span>
                </div>
                <p>{p.desc}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="about-sec">
          <div className="about-sec-head">
            <div>
              <span>03 · {zh ? '产品与生态版图' : 'THE SOIA FAMILY'}</span>
              <h2>{zh ? '从开源技能到桌面作业台，再到极小 Rust 内核' : 'How the four SOIA layers fit together'}</h2>
            </div>
          </div>
          <div className="about-family-grid">
            {family.map((item) => (
              <a className="about-family-card" href={item.to} key={item.name}>
                <div className="about-family-meta">
                  <span>{item.ord}</span>
                  <span className="about-family-badge">{item.badge}</span>
                </div>
                <strong>{item.name}</strong>
                <p>{item.desc}</p>
                <span className="about-family-link">{item.cta}</span>
              </a>
            ))}
          </div>
        </section>

        <section className="about-dark-band">
          <h2>{zh ? '我们坚持的工程底线（Anti-goals）' : 'Engineering boundaries we never cross'}</h2>
          <div className="about-dark-grid">
            {guardrails.map((g) => (
              <div className="about-dark-item" key={g.title}>
                <strong>{g.title}</strong>
                <p>{g.desc}</p>
              </div>
            ))}
          </div>
          <div className="info-cta-actions">
            <a className="btn btn-primary" href={href('/soiadeck/')}>SoiaDeck</a>
            <a className="btn btn-ghost" href={href('/skills/')}>{zh ? '浏览 47 个开源技能 ↗' : 'Browse 47 skills ↗'}</a>
            <a className="btn btn-ghost" href={REPO_DISCUSSIONS} target="_blank" rel="noreferrer noopener">GitHub Discussions ↗</a>
          </div>
        </section>
      </article>
    </SubpageLayout>
  );
}
