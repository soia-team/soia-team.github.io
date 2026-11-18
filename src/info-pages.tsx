/*
 * Standalone SOIA information pages: FAQ, About, Privacy and Terms.
 * Reuses the Open Design `.standalone-info` / `.faq-page` / `.legal-page` /
 * `.about-page` layout classes and design tokens verbatim.
 */
import { getHomeFaq, type LandingLocaleCode } from './upstream/app/i18n';
import { hrefFor, REPO, REPO_DISCUSSIONS, REPO_ORG, SubpageLayout } from './shell';

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

const ABOUT_COPY = {
  en: {
    eyebrow: 'ABOUT',
    title: 'About SOIA',
    lead: 'SOIA is a local-first agent platform built by soia-team: one desktop workbench (SoiaDeck), 47 composable open skills, and an open-source Agent OS.',
    vision: 'How the family fits together',
    paragraphs: [
      'SoiaDeck is the current lead — a desktop AI platform with a local daemon, an AI Workbench for 19 coding agents including Claude Code and Codex, plus local LLM and AI network management. It is private today and coming open source.',
      'Open Skills is a 47-skill public library across four domains (PKM Vault, Dev, Office & content, and Meta). Each skill is a plain method folder you install at project scope on Claude Code, Codex, or WorkBuddy.',
      'SoiaCode (command si) is our lightweight Rust coding agent in design (milestone M1), built so every tool call, permission check, and verification step stays visible and auditable.',
      'SOIA Runtime is the open-source Agent OS layer underneath at github.com/soia-team/soia.',
    ],
    closing: 'Built in public by soia-team. Consulting is open via GitHub Discussions.',
  },
  zh: {
    eyebrow: '关于',
    title: '关于 SOIA',
    lead: 'SOIA 是由 soia-team 构建的本地优先 Agent 平台：包含桌面 AI 作业台 SoiaDeck、47 个可组合开源技能与开源 Agent OS 底层。',
    vision: 'SOIA 家族成员',
    paragraphs: [
      'SoiaDeck 是当前主角：基于本机 daemon 的桌面 AI 平台，内置 AI 作业台（已接入 Claude Code、Codex 等 19 个 coding agent）、本地 LLM 与 AI 网络管理，即将开源。',
      '开源技能（Open Skills）覆盖知识库 PKM（27）、工程 Dev（9）、办公与内容 Office（7）、生态 Meta（4）共 47 个公开技能，默认按项目级、明确宿主安装到 Claude Code、Codex 或 WorkBuddy。',
      'SoiaCode（命令 si）是正在方案设计阶段（M1）的轻量 Rust coding agent，强调工具边界、权限检查与每一步可追溯验证。',
      'SOIA Runtime 是位于 github.com/soia-team/soia 的开源 Agent OS 底层。',
    ],
    closing: '由 soia-team 公开构建。企业咨询可通过 GitHub Discussions 联系。',
  },
} as const;

export function AboutPage({ locale }: { locale: LandingLocaleCode }) {
  const copy = ABOUT_COPY[languageKey(locale)];
  const href = (path: string) => hrefFor(path, locale);
  return (
    <SubpageLayout active="community" locale={locale}>
      <article className="standalone-info about-page" data-od-id="about">
        <header className="standalone-head">
          <span className="standalone-kicker">{copy.eyebrow}</span>
          <h1>{copy.title}<span>.</span></h1>
          <p>{copy.lead}</p>
        </header>
        <section className="about-body">
          <h2>{copy.vision}</h2>
          {copy.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
          <p className="about-closing">{copy.closing}</p>
        </section>
        <div className="info-cta-actions">
          <a className="btn btn-primary" href={href('/soiadeck/')}>SoiaDeck</a>
          <a className="btn btn-ghost" href={href('/skills/')}>{languageKey(locale) === 'zh' ? '浏览开源技能 ↗' : 'Open skills ↗'}</a>
        </div>
      </article>
    </SubpageLayout>
  );
}
