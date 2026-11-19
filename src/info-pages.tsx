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
    ja: { title: 'プライバシーポリシー', updated: '最終更新日：2026年11月18日' },
  },
  terms: {
    en: { title: 'Terms of Service', updated: 'Last updated: November 18, 2026' },
    zh: { title: '服务条款', updated: '最后更新：2026 年 11 月 18 日' },
    ja: { title: '利用規約', updated: '最終更新日：2026年11月18日' },
  },
} as const;

type LegalSection = { heading: string; paragraphs: string[]; bullets?: string[] };

const PRIVACY: Record<'en' | 'zh' | 'ja', LegalSection[]> = {
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
  ja: [
    { heading: '1. ローカル優先の原則', paragraphs: ['SoiaDeck と SOIA の公開スキルはすべてあなた自身のマシン上で動作します。ソースコード、ローカル Markdown vault、プロンプト、Worktree、API キーが外部に預けられることはありません。'] },
    { heading: '2. 本サイトが保持する情報', paragraphs: ['本サイトは GitHub Pages 上で配信される静的サイトです。ユーザー追跡やデータ販売、アカウント登録は行いません。ニュースレターフォームも現在はローカルブラウザ内でのみ保持されます。'] },
    { heading: '3. モデルおよび外部通信', paragraphs: ['利用するプロバイダーや CLI（Claude Code、Codex、ローカル MLX など）への通信は、あなた自身が選択したエンドポイントに直接送信されます。'] },
    { heading: '4. スキルと認証情報の境界', paragraphs: ['外部サービス連携の認証情報は公式ログインまたはローカルの隔離設定に保持され、スキルリポジトリやログには一切書き込まれません。'] },
    { heading: '5. お問い合わせ', paragraphs: ['プライバシーに関するご質問は github.com/soia-team/soia-open-skills の Discussions までお寄せください。'] },
  ],
};

const TERMS: Record<'en' | 'zh' | 'ja', LegalSection[]> = {
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
  ja: [
    { heading: '1. オープンソースライセンス', paragraphs: ['github.com/soia-team/soia-open-skills 配下の公開スキルおよびドキュメントは MIT ライセンスのもとで提供されます。'] },
    { heading: '2. 開発中・未公開コンポーネント', paragraphs: ['SoiaDeck は現在プライベートリポジトリで開発中、SoiaCode は仕様設計段階です。本サイトは現時点の公開事実のみを記載し、未リリース機能の SLA は約束しません。'] },
    { heading: '3. ローカル実行の責任', paragraphs: ['お手元のマシン上でコーディングエージェントが実行するコマンドやファイル編集、外部 API 利用は利用者の管理・承認の下で実行されます。'] },
    { heading: '4. 免責事項', paragraphs: ['公開リポジトリ・スキル・ドキュメントは現状有姿（"as is"）で提供され、明示または黙示を問わずいかなる保証も行いません。'] },
    { heading: '5. 連絡先', paragraphs: ['github.com/soia-team または GitHub Discussions よりご連絡ください。'] },
  ],
};

function languageKey(locale: LandingLocaleCode): 'en' | 'zh' | 'ja' {
  if (locale === 'zh') return 'zh';
  if (locale === 'ja') return 'ja';
  return 'en';
}

export function FaqPage({ locale }: { locale: LandingLocaleCode }) {
  const faq = getHomeFaq(locale, { origin: 'https://soia-team.github.io/', repo: REPO });
  const lang = languageKey(locale);
  const t3 = (z: string, e: string, j: string) => (lang === 'zh' ? z : lang === 'ja' ? j : e);
  return (
    <SubpageLayout active="resources" locale={locale}>
      <article className="standalone-info faq-page" data-od-id="faq">
        <header className="standalone-head">
          <span className="standalone-kicker">{t3('常见问题', 'FAQ', 'よくある質問')}</span>
          <h1>{t3('SOIA 常见问题', 'SOIA FAQ', 'SOIA FAQ')}<span>.</span></h1>
          <p>{t3('关于 SoiaDeck、开源技能、SoiaCode 与本地优先边界的常见问题。', 'Common questions about SoiaDeck, open skills, SoiaCode, and local-first boundaries.', 'SoiaDeck・公開スキル・SoiaCode・ローカル優先の境界に関するよくある質問です。')}</p>
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
  const lang = languageKey(locale);
  const href = (path: string) => hrefFor(path, locale);

  const family =
    lang === 'zh'
      ? [
          {
            ord: '01 · 家族当前主角 · 桌面作业台',
            badge: '即将开源 · macOS arm64',
            name: 'SoiaDeck',
            desc: '面向日常开发的跨端 AI 作业台：由本机 daemon + 桌面端 + 手机端看 Diff/审批 + NAT 加密中继 + 本地 MLX 组成，统一并行驱动 19 个现有 Coding Agent，不绑定模型也不强迫重学工作流。',
            to: href('/soiadeck/'),
            cta: '查看 SoiaDeck 架构 →',
          },
          {
            ord: '02 · 已开源技能生态 · CLI 能力层',
            badge: '已开源 · MIT · 47 技能',
            name: 'Open Skills 技能生态',
            desc: '按项目级最小范围（.agents/skills/）装入 Claude Code、Codex 或 WorkBuddy 的公开能力集：涵盖知识库 PKM（27）、工程 Dev（9）、办公 Office（7）、生态 Meta（4），装好说人话即可调用。',
            to: href('/skills/'),
            cta: '浏览全部 47 个技能 →',
          },
          {
            ord: '03 · 独立轻量内核 · 命令行 Agent',
            badge: '设计定稿阶段 · 0.0.1 M1 · MIT',
            name: 'SoiaCode (si)',
            desc: '用 Rust 编写的单二进制极小 Coding Agent 内核。「人守住注意力，系统守住安全」——只保留 5 个内置工具与 10 个挂载点，其余能力通过 34 个独立扩展与 MCP 按需挂载。',
            to: href('/soiacode/'),
            cta: '阅读系统边界与规格 →',
          },
          {
            ord: '04 · 底层 Agent OS 与方法论底座',
            badge: 'github.com/soia-team/soia · MIT',
            name: 'SOIA Runtime (Agent OS)',
            desc: '家族名称里的核心底座仓（SOIA = System, Orchestration, Intelligence, Assurance），定义 Model → Harness → Agent OS 架构分层、M1–M8 一级边界与六步最小闭环；方法论文档全量托管于 soia-docs。',
            to: href('/soia/'),
            cta: '查看 SOIA Runtime 演进 →',
          },
        ]
      : lang === 'ja'
        ? [
            {
              ord: '01 · 現在の主力 · デスクトップ作業台',
              badge: '公開予定 OSS · macOS arm64',
              name: 'SoiaDeck',
              desc: '日常開発向けの統合 AI 作業台。ローカル daemon・デスクトップ・モバイル承認・暗号化リレー・ローカル MLX を備え、19 種の Coding Agent と Diff 承認をベンダーロックインなしで一元管理します。',
              to: href('/soiadeck/'),
              cta: 'SoiaDeck アーキテクチャを見る →',
            },
            {
              ord: '02 · 公開済みエコシステム · スキル層',
              badge: 'オープンソース · MIT · 47 スキル',
              name: 'Open Skills スキル群',
              desc: 'Claude Code / Codex / WorkBuddy にプロジェクト単位で導入できる公開スキル集。PKM (27)・Dev (9)・Office (7)・Meta (4) の計 47 スキルを最小スコープで利用できます。',
              to: href('/skills/'),
              cta: '47 スキルを探す →',
            },
            {
              ord: '03 · 独立軽量カーネル · Rust CLI',
              badge: '設計確定段階 · 0.0.1 M1 · MIT',
              name: 'SoiaCode (si)',
              desc: 'Rust 製の単一バイナリ型 Coding Agent カーネル。「人が注意力を守り、システムが安全を守る」を軸に 5 組込みツールと 10 フックのみを内蔵し、34 の拡張へ疎結合に分離します。',
              to: href('/soiacode/'),
              cta: '境界仕様と設計を読む →',
            },
            {
              ord: '04 · 家族の基盤 · Agent OS ランタイム',
              badge: 'github.com/soia-team/soia · MIT',
              name: 'SOIA Runtime (Agent OS)',
              desc: 'SOIA ファミリーの中で具体的な Agent OS 基盤を担うリポジトリ（System, Orchestration, Intelligence, Assurance）。Model → Harness → Agent OS 階層と M1–M8 境界仕様（soia-docs）を定義します。',
              to: href('/soia/'),
              cta: 'SOIA Runtime の仕様を見る →',
            },
          ]
        : [
            {
              ord: '01 · LEAD PRODUCT · WORKBENCH',
              badge: 'Coming OSS · macOS arm64',
              name: 'SoiaDeck',
              desc: 'Cross-device workbench for daily coding — combining a persistent local daemon, desktop UI, mobile Diff approvals, encrypted NAT relay, and local MLX router across 19 existing coding agents.',
              to: href('/soiadeck/'),
              cta: 'Explore SoiaDeck →',
            },
            {
              ord: '02 · OPEN ECOSYSTEM · SKILL LAYER',
              badge: 'Open Source · MIT · 47 Skills',
              name: 'Open Skills',
              desc: 'Project-scoped skills installed directly into Claude Code, Codex, or WorkBuddy — 47 transparent workflows across PKM Vault (27), Dev (9), Office (7), and Meta (4).',
              to: href('/skills/'),
              cta: 'Browse all 47 skills →',
            },
            {
              ord: '03 · STANDALONE KERNEL · RUST CLI',
              badge: 'Design Stage · 0.0.1 M1 · MIT',
              name: 'SoiaCode (si)',
              desc: 'Single-binary Rust coding agent kernel built around “humans guard attention, the system guards safety” — keeping 5 built-in tools & 10 mounts while offloading 34 peripherals.',
              to: href('/soiacode/'),
              cta: 'Read boundaries & specs →',
            },
            {
              ord: '04 · FOUNDATION · AGENT OS BASE',
              badge: 'github.com/soia-team/soia · MIT',
              name: 'SOIA Runtime (Agent OS)',
              desc: 'The foundational Agent OS repository inside the family (System, Orchestration, Intelligence, Assurance) — defining the Model → Harness → Agent OS stack and M1–M8 specs in soia-docs.',
              to: href('/soia/'),
              cta: 'View SOIA Runtime specs →',
            },
          ];

  const thesis =
    lang === 'zh'
      ? {
          problemTitle: '为什么不做一个封闭云桌面，而拆出四个互补成员？',
          problemBody:
            '不同用户与阶段要的东西不一样：有人明天就要把 Claude Code / Codex 接入 Obsidian 干活（需要 Open Skills），有人要多设备管 19 个 Agent 审批 Diff（需要 SoiaDeck），也有工程团队只要极小独立 Rust 内核（SoiaCode）或完整 Agent OS 规范（SOIA Runtime）。',
          solutionTitle: '清晰的职责边界，而非混为一谈的单体壳',
          solutionBody:
            '「SOIA 家族（The Agent Family）」是整体产品版图，「SOIA Runtime（Agent OS）」则是其中专注底座规格与原语的一员。四个层级共用本地工作区真源与安全审计哲学，又可以按需单独选用、独立演进。',
        }
      : lang === 'ja'
        ? {
            problemTitle: 'なぜ単一クラウド IDE にせず 4 層へ分けたのか？',
            problemBody:
              '今すぐ既存 CLI で使える公開スキルが欲しい人（Open Skills）、19 種の Agent と Diff 承認を一画面で束ねたい人（SoiaDeck）、極小 Rust カーネルや Agent OS 基盤仕様が必要なチーム（SoiaCode / SOIA Runtime）では、求められる粒度が異なるためです。',
            solutionTitle: '家族全体の構成と SOIA Runtime の明確な分離',
            solutionBody:
              '「SOIA ファミリー」は製品エコシステム全体の総称であり、「SOIA Runtime」はその中の Agent OS 基盤リポジトリです。ローカル真実源と監査可能な設計思想を共有しつつ、必要なレイヤーだけを独立導入できます。',
          }
        : {
            problemTitle: 'Why four focused layers instead of one monolithic cloud box?',
            problemBody:
              'Developers adopt AI tooling at different layers: installable project skills for existing CLIs (Open Skills), multi-agent desktop/mobile orchestration (SoiaDeck), a minimal standalone Rust loop (SoiaCode), or full Agent OS runtime primitives (SOIA Runtime).',
            solutionTitle: 'Clear distinction: SOIA Family vs SOIA Runtime',
            solutionBody:
              '“SOIA” as a family refers to the whole local-first ecosystem across all four products; “SOIA Runtime” is specifically the foundational Agent OS repo (soia-team/soia). Every layer stays composable with zero vendor lock-in.',
          };

  const primitives =
    lang === 'zh'
      ? [
          { code: '01 · Workspace', tag: '工作区真源', desc: 'SOIA Agent OS 与 SoiaDeck 共享的核心 premise：仓库路径、Git Worktree 与配置留在本地，跨端始终面向同一份客观事实。' },
          { code: '02 · AgentRun', tag: '可恢复事件流', desc: '把一次执行抽象成可观察、可随时插话纠偏（Steer）、可断点恢复与分叉探索的会话树，而不是阅后即焚聊天框。' },
          { code: '03 · Capability', tag: '权限与预算关口', desc: '高危命令、工作区外写入、外部联网与费用动作执行前必须过明确规则与人工审批，deny > ask > allow。' },
          { code: '04 · Ledger', tag: 'append-only 账本', desc: '工具调用、审批决策与文件快照全部以明文 JSONL 追加落盘，出问题可逐帧回放与审计，不靠事后截图猜测。' },
        ]
      : lang === 'ja'
        ? [
            { code: '01 · Workspace', tag: '単一真実源', desc: 'SOIA Runtime と SoiaDeck に共通する前提。リポジトリ・Worktree・設定をローカルに保持し、全端末で同一の事実を参照します。' },
            { code: '02 · AgentRun', tag: '復元可能ストリーム', desc: '実行を観測・途中介入（Steer）・チェックポイント復元・分岐探索が可能なセッションツリーとして扱います。' },
            { code: '03 · Capability', tag: '権限・予算ゲート', desc: '高リスクコマンド、領域外書き込み、外部通信や課金操作は、実行前に明示ルールと承認ゲートを通過します。' },
            { code: '04 · Ledger', tag: '追記専用台帳', desc: 'ツール呼び出し・承認判断・スナップショットを append-only JSONL へ記録し、後から正確に監査・再生できます。' },
          ]
        : [
            { code: '01 · Workspace', tag: 'Source of Truth', desc: 'Repos, Git worktrees, tasks, and config stay local so SoiaDeck and CLI tools always act on one authoritative state.' },
            { code: '02 · AgentRun', tag: 'Recoverable Stream', desc: 'Execution runs as observable, steerable, forkable event trees instead of fragile chat tabs.' },
            { code: '03 · Capability', tag: 'Permission Gate', desc: 'Shell exec, out-of-workspace writes, network calls, and spend checks pass explicit rules and approvals first.' },
            { code: '04 · Ledger', tag: 'Append-Only Audit', desc: 'Every tool invocation, approval decision, and file snapshot lands in plain JSONL for exact replay.' },
          ];

  const guardrails =
    lang === 'zh'
      ? [
          { title: '默认零遥测、代码留本机', desc: '仓库文件、会话树与 API 凭据都在自己硬件里；SoiaDeck NAT 中继只转发密文不留存原文。' },
          { title: '自带订阅与模型，拒绝锁死', desc: '直接复用已有 Claude Code / Codex / Cursor 等 CLI 订阅或本机 Apple Silicon MLX 模型。' },
          { title: '草稿优先与逐条人工审批', desc: 'Open Skills 中涉及公众号 / 小红书 / X 的技能只建草稿不群发；风险命令与越界写入先问后做。' },
          { title: '工程诚实、边界透明', desc: '明确区分各成员真实阶段——Open Skills 已开源、SoiaDeck 即将开源（macOS arm64）、SoiaCode 尚在设计定稿阶段，绝不虚标能力。' },
        ]
      : lang === 'ja'
        ? [
            { title: 'ゼロテレメトリ・ローカル所有', desc: 'リポジトリ・JSONL セッション・API 鍵は自分のマシンに留まり、NAT リレーは暗号文のみを転送します。' },
            { title: '既存サブスク・ローカルモデル活用', desc: 'お手持ちの Claude Code / Codex / Cursor 契約やローカル MLX モデルをベンダーロックインなしで再利用。' },
            { title: '下書き優先と明示的な承認ゲート', desc: 'SNS 連携スキルは下書き作成のみに留め、危険コマンドや領域外書き込みは必ず確認待ちで停止します。' },
            { title: '誠実なステータス表記', desc: 'Open Skills（公開済）、SoiaDeck（公開準備中・macOS arm64）、SoiaCode（設計段階）の現在地を正確に明記します。' },
          ]
        : [
            { title: 'Zero Telemetry & Local Ownership', desc: 'Repos, session JSONL trees, and credentials stay on your machines; relay sees ciphertext only.' },
            { title: 'Bring Your Subscriptions', desc: 'Reuse existing Claude Code, Codex, or local MLX models without vendor lock-in.' },
            { title: 'Draft-first & Explicit Approval', desc: 'Publishing skills create drafts only; risky commands and writes pause for explicit confirmation.' },
            { title: 'Honest Release Scope', desc: 'Clear status labels across every family member — no vaporware download promises.' },
          ];

  return (
    <SubpageLayout active="community" locale={locale}>
      <article className="about-editorial" data-od-id="about">
        <header className="about-hero-box">
          <div className="about-hero-acronym">
            {lang === 'zh'
              ? 'THE SOIA AGENT FAMILY · 四层本地优先 AI 工程产品版图'
              : lang === 'ja'
                ? 'THE SOIA AGENT FAMILY · 4 層のローカル優先 AI 工学エコシステム'
                : 'THE SOIA AGENT FAMILY · 4-LAYER LOCAL-FIRST AI ECOSYSTEM'}
          </div>
          <h1>{lang === 'zh' ? '关于 SOIA 家族' : lang === 'ja' ? 'SOIA ファミリーについて' : 'About the SOIA Family'}<span>.</span></h1>
          <p className="about-hero-lead">
            {lang === 'zh'
              ? 'SOIA（soia-team）是一个本地优先、开放可审计的 Agent 工程家族，而不是单一软件：它涵盖日常主导工作的跨端作业台 SoiaDeck、即装即用的 47 个 Open Skills、极小 Rust 内核 SoiaCode，以及作为整个家族底层理论与运行时底座的 SOIA Agent OS（soia-team/soia）。'
              : lang === 'ja'
                ? 'SOIA（soia-team）は単一のツールではなく、ローカル優先・監査可能な 4 層プロダクトからなる AI エージェントファミリーです。主力作業台 SoiaDeck、すぐ使える 47 の公開スキル Open Skills、極小 Rust カーネル SoiaCode、そして基盤ランタイム SOIA Agent OS（soia-team/soia）で構成されています。'
                : 'SOIA (soia-team) is a four-layer, local-first engineering family — not a single monolith. It spans the SoiaDeck workbench, 47 MIT Open Skills, the minimal SoiaCode Rust kernel, and the foundational SOIA Agent OS runtime repo (soia-team/soia).'}
          </p>
        </header>

        <section className="about-sec">
          <div className="about-sec-head">
            <div>
              <span>01 · {lang === 'zh' ? 'SOIA 家族成员' : lang === 'ja' ? 'SOIA ファミリー構成' : 'THE SOIA FAMILY'}</span>
              <h2>{lang === 'zh' ? '先认识 SOIA 家族的四层版图与各自定位' : lang === 'ja' ? '4 つの製品レイヤーとそれぞれの役割' : 'Four distinct layers across desktop workbench, skills, kernel, and OS'}</h2>
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

        <section className="about-sec">
          <div className="about-sec-head">
            <div>
              <span>02 · {lang === 'zh' ? '家族定位与职责边界' : lang === 'ja' ? 'ファミリー全体と基盤の切り分け' : 'ARCHITECTURE & ROLE SPLIT'}</span>
              <h2>{lang === 'zh' ? '为什么把家族拆成四层，并把 Runtime 单独作为底座' : lang === 'ja' ? 'なぜ 4 層に分け、Runtime を基盤リポジトリとして独立させたのか' : 'Separating the overall SOIA Family from the underlying SOIA Runtime'}</h2>
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
              <span>03 · {lang === 'zh' ? '底座通用原语（源自 SOIA Agent OS）' : lang === 'ja' ? '共通基盤原語（SOIA Agent OS 由来）' : 'SHARED PRIMITIVES (SOIA AGENT OS)'}</span>
              <h2>{lang === 'zh' ? '把 AI 对话拉进可恢复、可审批的工程控制平面' : lang === 'ja' ? '対話 AI を復元・監査可能な工学制御平面へ' : 'Four primitives shared across SoiaDeck & SOIA Runtime'}</h2>
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

        <section className="about-dark-band">
          <h2>{lang === 'zh' ? 'SOIA 家族共同坚持的工程底线（Anti-goals）' : lang === 'ja' ? 'SOIA ファミリーが越えない工学的境界（Anti-goals）' : 'Engineering boundaries across the entire SOIA family'}</h2>
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
            <a className="btn btn-ghost" href={href('/skills/')}>{lang === 'zh' ? '浏览 47 个开源技能 ↗' : lang === 'ja' ? '47 公開スキルを見る ↗' : 'Browse 47 skills ↗'}</a>
            <a className="btn btn-ghost" href={href('/soia/')}>SOIA Runtime ↗</a>
            <a className="btn btn-ghost" href={REPO_DISCUSSIONS} target="_blank" rel="noreferrer noopener">GitHub Discussions ↗</a>
          </div>
        </section>
      </article>
    </SubpageLayout>
  );
}

export function PricingPage({ locale }: { locale: LandingLocaleCode }) {
  const lang = languageKey(locale);
  const href = (path: string) => hrefFor(path, locale);

  const steps =
    lang === 'zh'
      ? [
          { no: 'STEP 01', title: '提出问题或定制需求', desc: '在 GitHub Discussions 描述现状、目标、期望成果，涉及保密细节先脱敏处理。' },
          { no: 'STEP 02', title: '确认档位与评估工时', desc: '一对一咨询按 30 分钟 / 1 小时定档；定制化技能先估算所需工具研发人天并对齐验收口径。' },
          { no: 'STEP 03', title: '开展会话或交付产物', desc: '咨询当场拆解架构与命令；定制技能交付 SKILL.md、执行脚本、护栏规则与校验用例。' },
          { no: 'STEP 04', title: '本地验收闭环', desc: '按项目级装入你自己的 Codex / Claude Code / WorkBuddy 验证通过，无后续强绑费用。' },
        ]
      : lang === 'ja'
        ? [
            { no: 'STEP 01', title: '相談またはカスタム要件を共有', desc: 'GitHub Discussions にて現状と目標をお知らせください（機密情報は事前にマスキングしてください）。' },
            { no: 'STEP 02', title: '枠の確定と工数の合意', desc: '1対1相談は 30分 / 1時間枠を選択。カスタムスキルは着手前に必要なエンジニア人日を見積もり合意します。' },
            { no: 'STEP 03', title: 'セッション実施・成果物納品', desc: '技術相談はその場で設計とコマンドを整理。カスタムスキルは SKILL.md、スクリプト、ガードレール、検証テスト一式を納品。' },
            { no: 'STEP 04', title: 'ローカル検証・ロックインなし', desc: 'お使いの Codex / Claude Code / WorkBuddy にプロジェクト単位で導入・動作確認して完了。月額課金はありません。' },
          ]
        : [
            { no: 'STEP 01', title: 'Share scope & goal', desc: 'Open a GitHub Discussion with your workflow problem or bespoke skill requirements (redact any secrets first).' },
            { no: 'STEP 02', title: 'Confirm slot or effort', desc: 'Pick a 30-min / 1-hr consulting slot, or agree on estimated engineering days for a custom skill.' },
            { no: 'STEP 03', title: 'Deliver & verify', desc: 'Live architecture session, or full SKILL.md, scripts, hard guardrails, and verification checks.' },
            { no: 'STEP 04', title: 'Zero lock-in handoff', desc: 'Install locally at project scope on Codex, Claude Code, or WorkBuddy with zero recurring fees.' },
          ];

  const rules =
    lang === 'zh'
      ? [
          { item: '一对一技术咨询', price: '¥200 / 30 分钟 / 次', note: '超过 30 分钟按每半小时 +¥200 计费，单次上限 1 小时封顶 ¥400。' },
          { item: '定制化技能（Skill）编写', price: '¥1,000 / 人天', note: '按实际工具研发工时核算人天，包含 SKILL.md、脚本、防呆护栏与测试清单，开工前先确认预估天数。' },
          { item: '开源软件与公开技能（MIT）', price: '¥0（免费）', note: '47 个公开技能与 SOIA Runtime 文档完全开源；不强制账号、不卖 SaaS 月租。' },
          { item: '隐私与密钥边界', price: '全程不碰生产密钥', note: '远程/咨询与定制开发不要求提供生产账号密码或私钥，全部按脱敏夹具或环境变量隔离验证。' },
        ]
      : lang === 'ja'
        ? [
            { item: '1対1 技術コンサルティング', price: '¥200 / 30分 / 回', note: '30分超過は30分ごとに +¥200、1回最大1時間（上限 ¥400）で打ち切り。' },
            { item: 'カスタムスキル（Skill）開発', price: '¥1,000 / 人日', note: '実工数ベースで算定。SKILL.md・スクリプト・安全ガードレール・検証チェックを含み、着手前に人日を確定します。' },
            { item: 'オープンソース & 公開スキル（MIT）', price: '¥0（無料）', note: '47個の公開スキルと SOIA Runtime 仕様は完全無料・MIT ライセンス。SaaS 月額課金は一切ありません。' },
            { item: 'プライバシー・認証境界', price: '本番鍵へのアクセスなし', note: '相談・受託開発ともに本番アカウントのパスワードや秘密鍵は不要。ダミーデータや環境変数分離で検証します。' },
          ]
        : [
            { item: '1-on-1 Technical Consulting', price: '¥200 / 30 min', note: 'Over 30 min billed at +¥200 per 30 min; capped cleanly at 1 hour (¥400 max).' },
            { item: 'Custom Skill Engineering', price: '¥1,000 / day', note: 'Billed strictly on estimated & agreed engineering hours (SKILL.md + scripts + guardrails + tests).' },
            { item: 'Open Skills & Runtime (MIT)', price: '¥0 (Free)', note: 'All 47 open skills and runtime docs remain MIT open source with zero SaaS subscriptions.' },
            { item: 'Credential & Data Boundary', price: 'Zero secret exposure', note: 'Never requires production keys or tokens; delivered cleanly with fixture tests.' },
          ];

  return (
    <SubpageLayout active="pricing" locale={locale}>
      <article className="about-editorial" data-od-id="pricing">
        <header className="about-hero-box">
          <div className="about-hero-acronym">
            {lang === 'zh'
              ? 'SERVICES & PRICING · 开源免费 · 咨询与定制明码标价'
              : lang === 'ja'
                ? 'SERVICES & PRICING · OSS 無料 · 相談とカスタム開発は明朗会計'
                : 'SERVICES & PRICING · TRANSPARENT RATES'}
          </div>
          <h1>{lang === 'zh' ? '服务与定价' : lang === 'ja' ? 'サービスと料金' : 'Services & Pricing'}<span>.</span></h1>
          <p className="about-hero-lead">
            {lang === 'zh'
              ? 'SOIA 不卖按月锁人的 SaaS 订阅。47 个公开技能与底层规范保持 MIT 开源免费；若团队需要 1 对 1 架构咨询或定制化技能开发，统一按次与工具工时透明计费。'
              : lang === 'ja'
                ? 'SOIA はユーザーを縛る月額 SaaS を販売しません。47個の公開スキルと基本仕様は MIT オープンソースのまま無料。1対1の技術相談やカスタムスキル開発が必要な場合のみ、回数・実工数ベースで明朗に請求します。'
                : 'SOIA does not sell SaaS subscriptions. Our 47 open skills are MIT open source; focused 1-on-1 consulting and bespoke skill engineering follow simple, transparent rates.'}
          </p>
        </header>

        <section className="about-sec">
          <div className="pricing-page-grid">
            <div className="consulting-card">
              <span className="consulting-tag">{lang === 'zh' ? '00 · 开源社区版' : lang === 'ja' ? '00 · オープンソース版' : '00 · OPEN SOURCE'}</span>
              <h3>{lang === 'zh' ? '47 开源技能与 Runtime' : lang === 'ja' ? '47 公開スキル & Runtime' : '47 Open Skills & Docs'}</h3>
              <div className="consulting-price-row">
                <span className="consulting-price">¥0</span>
                <span className="consulting-unit">{lang === 'zh' ? '/ 永久免费 · MIT' : lang === 'ja' ? '/ 永久無料 · MIT' : '/ forever · MIT'}</span>
              </div>
              <ul className="consulting-list">
                <li>{lang === 'zh' ? 'PKM (27) / Dev (9) / Office (7) / Meta (4) 全部源码公开' : lang === 'ja' ? 'PKM (27) / Dev (9) / Office (7) / Meta (4) 全ソース公開' : 'All 47 skills across 4 domains'}</li>
                <li>{lang === 'zh' ? '按项目级装入 Claude Code / Codex / WorkBuddy' : lang === 'ja' ? 'Claude Code / Codex / WorkBuddy へプロジェクト導入' : 'Project-scoped install on local CLIs'}</li>
                <li>{lang === 'zh' ? 'SoiaDeck 目前私仓开发中（即将开源）' : lang === 'ja' ? 'SoiaDeck はプライベート開発中（近日 OSS 公開）' : 'SoiaDeck coming open source'}</li>
              </ul>
              <div className="consulting-cta">
                <a className="btn btn-ghost" href={href('/skills/')}>{lang === 'zh' ? '浏览 47 个技能 →' : lang === 'ja' ? '47 スキルを見る →' : 'Browse skills →'}</a>
              </div>
            </div>

            <div className="consulting-card">
              <span className="consulting-tag">{lang === 'zh' ? '01 · 一对一技术咨询' : lang === 'ja' ? '01 · 1対1 技術コンサル' : '01 · 1-ON-1 CONSULTING'}</span>
              <h3>{lang === 'zh' ? '架构与工作流专项咨询' : lang === 'ja' ? 'アーキテクチャ & ワークフロー相談' : 'Architecture & Workflow Session'}</h3>
              <div className="consulting-price-row">
                <span className="consulting-price">¥200</span>
                <span className="consulting-unit">{lang === 'zh' ? '/ 30 分钟 / 次（上限 1 小时 ¥400）' : lang === 'ja' ? '/ 30分 / 回（最大1時間 ¥400）' : '/ 30 min (max 1h at ¥400)'}</span>
              </div>
              <ul className="consulting-list">
                <li>{lang === 'zh' ? '30 分钟以内：¥200 / 次' : lang === 'ja' ? '30分まで：¥200 / 回' : 'Up to 30 min: ¥200 per session'}</li>
                <li>{lang === 'zh' ? '超过 30 分钟：每半小时加 ¥200，至多 1 小时（封顶 ¥400）' : lang === 'ja' ? '30分超過：30分ごとに +¥200、最大1時間（上限 ¥400）' : 'Over 30 min: +¥200 / 30 min, capped at 1 hour (¥400)'}</li>
                <li>{lang === 'zh' ? '涵盖：多 Agent 集成、Obsidian PKM 设计、SoiaDeck 权限排查' : lang === 'ja' ? '対象：マルチ Agent 統合、Obsidian PKM 設計、権限設計レビュー' : 'Multi-agent integration, PKM architecture & governance checks'}</li>
              </ul>
              <div className="consulting-cta">
                <a className="btn btn-ghost" href={REPO_DISCUSSIONS} target="_blank" rel="noreferrer noopener">{lang === 'zh' ? '去 Discussions 预约 ↗' : lang === 'ja' ? 'Discussions で予約する ↗' : 'Book session ↗'}</a>
              </div>
            </div>

            <div className="consulting-card is-featured">
              <span className="consulting-tag">{lang === 'zh' ? '02 · 按工具工时定制开发' : lang === 'ja' ? '02 · カスタム開発（人日単価）' : '02 · CUSTOM ENGINEERING'}</span>
              <h3>{lang === 'zh' ? '定制化技能（Skill）编写' : lang === 'ja' ? 'カスタムスキル（Skill）開発' : 'Bespoke Skill Development'}</h3>
              <div className="consulting-price-row">
                <span className="consulting-price">¥1,000</span>
                <span className="consulting-unit">{lang === 'zh' ? '/ 人天（按实际工具研发工时）' : lang === 'ja' ? '/ 日（実エンジニア工数ベース）' : '/ day (billed by engineering hours)'}</span>
              </div>
              <ul className="consulting-list">
                <li>{lang === 'zh' ? '基准 ¥1,000 / 1 天，开工前先共同确认工具复杂度与工时' : lang === 'ja' ? '基準 ¥1,000 / 日（着手前に複雑さと工数を見積り合意）' : '¥1,000/day baseline estimated before work begins'}</li>
                <li>{lang === 'zh' ? '完整交付：SKILL.md、脚本、权限 Guardrails、验收用例' : lang === 'ja' ? '完全納品：SKILL.md、スクリプト、安全ガードレール、検証テスト' : 'Full SKILL.md, executable scripts, guardrails & test checks'}</li>
                <li>{lang === 'zh' ? '源码归团队自有，装入本地宿主即跑，不收运行抽成' : lang === 'ja' ? 'ソースコード完全買い切り、ローカル稼働でランニング課金なし' : 'Owned by your team with zero runtime royalties'}</li>
              </ul>
              <div className="consulting-cta">
                <a className="btn btn-primary" href={REPO_DISCUSSIONS} target="_blank" rel="noreferrer noopener">{lang === 'zh' ? '提交定制需求 ↗' : lang === 'ja' ? '開発を相談する ↗' : 'Request custom skill ↗'}</a>
              </div>
            </div>
          </div>
        </section>

        <section className="about-sec">
          <div className="about-sec-head">
            <div>
              <span>{lang === 'zh' ? '合作与计费流程' : lang === 'ja' ? 'ご依頼・お支払いの流れ' : 'HOW ENGAGEMENT WORKS'}</span>
              <h2>{lang === 'zh' ? '四步走完预约或定制交付' : lang === 'ja' ? '予約から納品まで 4 ステップ' : 'Four transparent steps from request to handoff'}</h2>
            </div>
          </div>
          <div className="pricing-step-grid">
            {steps.map((s) => (
              <div className="pricing-step-card" key={s.no}>
                <span>{s.no}</span>
                <strong>{s.title}</strong>
                <p>{s.desc}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="about-sec">
          <div className="about-sec-head">
            <div>
              <span>{lang === 'zh' ? '计费细则与边界' : lang === 'ja' ? '料金規定と開発境界' : 'BILLING & BOUNDARY DETAILS'}</span>
              <h2>{lang === 'zh' ? '计价口径一览' : lang === 'ja' ? '料金・対応範囲一覧' : 'Exact terms & scope summary'}</h2>
            </div>
          </div>
          <div className="skill-table-wrap">
            <table className="skill-cap-table">
              <thead>
                <tr>
                  <th>{lang === 'zh' ? '服务项目' : lang === 'ja' ? 'サービス項目' : 'Service'}</th>
                  <th>{lang === 'zh' ? '价格标准' : lang === 'ja' ? '料金基準' : 'Rate'}</th>
                  <th>{lang === 'zh' ? '计费说明与交付边界' : lang === 'ja' ? '請求ルールと納品範囲' : 'Terms & scope'}</th>
                </tr>
              </thead>
              <tbody>
                {rules.map((r) => (
                  <tr key={r.item}>
                    <td><strong>{r.item}</strong></td>
                    <td><code>{r.price}</code></td>
                    <td>{r.note}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </article>
    </SubpageLayout>
  );
}
