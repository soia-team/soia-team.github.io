import { useEffect, useState } from 'react';
import { SubpageLayout, hrefFor } from './shell';
import type { LandingLocaleCode } from './upstream/app/i18n';
import { SKILL_DOCS, type LocaleText, type SkillDoc } from './skill-data';
import './missing-pages.css';

type Lang = 'zh' | 'en' | 'ja';
const langOf = (locale: LandingLocaleCode): Lang => (locale === 'zh' ? 'zh' : locale === 'ja' ? 'ja' : 'en');
const t3 = <T,>(locale: LandingLocaleCode, zh: T, en: T, ja: T): T => {
  const l = langOf(locale);
  return l === 'zh' ? zh : l === 'ja' ? ja : en;
};

function ZoomableFigure({
  src,
  alt,
  className = 'tutorial-detail-hero',
  zh,
  locale,
  lazy = false,
  marginTop,
}: {
  src: string;
  alt: string;
  className?: string;
  zh?: boolean;
  locale?: LandingLocaleCode;
  lazy?: boolean;
  marginTop?: number;
}) {
  const l: Lang = locale ? langOf(locale) : zh ? 'zh' : 'en';
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [open]);

  return (
    <>
      <figure
        className={`${className} zoomable-figure`}
        style={marginTop !== undefined ? { marginTop } : undefined}
        onClick={() => setOpen(true)}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            setOpen(true);
          }
        }}
        aria-label={l === 'zh' ? `放大查看：${alt}` : l === 'ja' ? `拡大表示：${alt}` : `Zoom image: ${alt}`}
      >
        <img src={src} alt={alt} loading={lazy ? 'lazy' : undefined} />
        <span className="zoomable-hint">{l === 'zh' ? '点击查看大图' : l === 'ja' ? 'クリックで拡大' : 'Click to zoom'}</span>
      </figure>
      {open && (
        <div
          className="lightbox-backdrop"
          role="dialog"
          aria-modal="true"
          aria-label={alt}
          onClick={() => setOpen(false)}
        >
          <button
            type="button"
            className="lightbox-close"
            aria-label={l === 'zh' ? '关闭大图' : l === 'ja' ? '閉じる' : 'Close preview'}
            onClick={() => setOpen(false)}
          >
            ×
          </button>
          <img
            className="lightbox-img"
            src={src}
            alt={alt}
            onClick={(e) => e.stopPropagation()}
          />
          <p className="lightbox-caption">{alt}</p>
        </div>
      )}
    </>
  );
}

type AgentSupportLevel = 'supported' | 'experimental' | 'planned';

type CodingAgentEntry = {
  id: string;
  name: string;
  cmd: string;
  level: AgentSupportLevel;
  protocol: { zh: string; en: string };
  version: { zh: string; en: string };
  auth: { zh: string; en: string };
  detail: { zh: string; en: string };
};

const CODING_AGENTS_19: ReadonlyArray<CodingAgentEntry> = [
  {
    id: 'claude',
    name: 'Claude Code',
    cmd: 'claude',
    level: 'supported',
    protocol: { zh: 'stream-json 原生控制协议', en: 'stream-json native control' },
    version: { zh: '最低 ≥ 2.1.280（实测 2.1.286）', en: 'min ≥ 2.1.280 (verified 2.1.286)' },
    auth: { zh: '官方登录 claude auth login', en: 'vendor login (claude auth login)' },
    detail: {
      zh: '正式支持：原生审批（can_use_tool）、会话续接（--resume）、上下文压缩、图片、模型清单、额度限速与回合结束用量。',
      en: 'Supported: native approvals (can_use_tool), --resume, compact, images, model catalog, rate limits, and turn-end usage.',
    },
  },
  {
    id: 'codex',
    name: 'Codex',
    cmd: 'codex',
    level: 'supported',
    protocol: { zh: 'subscription-cli / app-server (JSON-RPC)', en: 'subscription-cli / app-server (JSON-RPC)' },
    version: { zh: '最低 ≥ 0.156.1（实测 0.159.3）', en: 'min ≥ 0.156.1 (verified 0.159.3)' },
    auth: { zh: '官方登录 codex login', en: 'vendor login (codex login)' },
    detail: {
      zh: '正式支持：原生审批、会话续接、中途插话引导（turn/steer）、Plan 模式提问、压缩、图片、模型清单、额度与实时用量。',
      en: 'Supported: native approvals, resume, mid-turn steer, plan-mode questions, compact, images, model catalog, rate limits, and live usage.',
    },
  },
  {
    id: 'dsh',
    name: 'dsh',
    cmd: 'dsh',
    level: 'supported',
    protocol: { zh: 'ACP (stdio)', en: 'ACP (stdio)' },
    version: { zh: '最低 ≥ 0.1.7-alpha.2（已实测）', en: 'min ≥ 0.1.7-alpha.2 (verified)' },
    auth: { zh: '环境变量配置 Provider Key', en: 'env provider API key (no login subcmd)' },
    detail: {
      zh: '正式支持：原生审批、会话续接、模型清单、子代理、git diff 与实时上下文用量。',
      en: 'Supported: native approvals, resume, model catalog, subagents, git diff fallback, and live context usage.',
    },
  },
  {
    id: 'pi',
    name: 'pi',
    cmd: 'pi',
    level: 'supported',
    protocol: { zh: 'pi-rpc 原生 RPC（Node ≥ 22.19）', en: 'pi-rpc native RPC (Node ≥ 22.19)' },
    version: { zh: '最低 ≥ 0.84.4', en: 'min ≥ 0.84.4' },
    auth: { zh: '交互 /login 或环境变量 API Key', en: 'interactive /login or API-key env' },
    detail: {
      zh: '正式支持：扩展审批、会话续接、中途引导（steer）、提问、压缩、图片、模型清单/默认模型、成本与用量统计。',
      en: 'Supported: extension approvals, resume, steer, questions, compact, images, model catalog, cost, and usage.',
    },
  },
  {
    id: 'opencode',
    name: 'OpenCode',
    cmd: 'opencode',
    level: 'experimental',
    protocol: { zh: 'ACP (stdio)', en: 'ACP (stdio)' },
    version: { zh: '最低 ≥ 1.18.25（已实测）', en: 'min ≥ 1.18.25 (verified)' },
    auth: { zh: 'opencode auth login / Provider Key', en: 'opencode auth login / provider keys' },
    detail: {
      zh: '试验接入：原生审批、模型清单、子代理、图片、agent 上报 diff、成本与用量统计；暂不支持 resume/steer。',
      en: 'Experimental: approvals, model catalog, subagents, images, agent diffs, cost & usage; no resume/steer yet.',
    },
  },
  {
    id: 'kimi',
    name: 'Kimi Code',
    cmd: 'kimi',
    level: 'experimental',
    protocol: { zh: 'ACP (stdio)', en: 'ACP (stdio)' },
    version: { zh: '最低 ≥ 2.0.2（已实测）', en: 'min ≥ 2.0.2 (verified)' },
    auth: { zh: '设备码登录 kimi login', en: 'device-code login (kimi login)' },
    detail: {
      zh: '试验接入：原生审批、Plan 模式、图片、子代理、agent diff 与回合末用量。',
      en: 'Experimental: approvals, plan mode, images, subagents, agent diffs, and turn-end usage.',
    },
  },
  {
    id: 'qwen',
    name: 'Qwen Code',
    cmd: 'qwen',
    level: 'experimental',
    protocol: { zh: 'ACP (stdio)', en: 'ACP (stdio)' },
    version: { zh: '最低 ≥ 0.24.4（已实测）', en: 'min ≥ 0.24.4 (verified)' },
    auth: { zh: '仅交互端 Qwen OAuth / API Key', en: 'interactive OAuth or API-key env' },
    detail: {
      zh: '试验接入：原生审批、Plan 模式、图片、子代理、agent diff 与实时用量。',
      en: 'Experimental: approvals, plan mode, images, subagents, agent diffs, and live usage.',
    },
  },
  {
    id: 'hermes',
    name: 'Hermes',
    cmd: 'hermes',
    level: 'experimental',
    protocol: { zh: 'ACP (stdio)', en: 'ACP (stdio)' },
    version: { zh: '最低 ≥ 0.20.0（已实测）', en: 'min ≥ 0.20.0 (verified)' },
    auth: { zh: 'hermes login / Provider Key', en: 'hermes login / provider keys' },
    detail: {
      zh: '试验接入：原生审批、模型清单、Plan 模式、图片、子代理与上下文用量。',
      en: 'Experimental: approvals, model catalog, plan mode, images, subagents, and context usage.',
    },
  },
  {
    id: 'grok',
    name: 'Grok',
    cmd: 'grok',
    level: 'experimental',
    protocol: { zh: 'ACP (stdio)', en: 'ACP (stdio)' },
    version: { zh: '最低 ≥ 1.0.8（实测 1.0.13）', en: 'min ≥ 1.0.8 (verified 1.0.13)' },
    auth: { zh: 'grok login --oauth', en: 'grok login --oauth' },
    detail: {
      zh: '试验接入：已完成 initialize 握手，支持原生审批、Plan 模式与回合末用量（session/new 待实测）。',
      en: 'Experimental: initialize verified; supports approvals, plan mode, and turn-end usage (session/new unverified).',
    },
  },
  {
    id: 'copilot',
    name: 'GitHub Copilot',
    cmd: 'copilot',
    level: 'experimental',
    protocol: { zh: 'ACP (stdio · --acp)', en: 'ACP (stdio · --acp)' },
    version: { zh: '最低 ≥ 1.0.62（实测 1.0.88）', en: 'min ≥ 1.0.62 (verified 1.0.88)' },
    auth: { zh: 'OAuth 设备流 copilot login', en: 'OAuth device flow (copilot login)' },
    detail: {
      zh: '试验接入：已完成 initialize 握手，支持原生审批与图片；ACP 暂无用量通道（session/new 待实测）。',
      en: 'Experimental: initialize verified; supports approvals & images; no ACP usage channel yet.',
    },
  },
  {
    id: 'gemini',
    name: 'Gemini CLI',
    cmd: 'gemini',
    level: 'experimental',
    protocol: { zh: 'ACP (stdio · --acp)', en: 'ACP (stdio · --acp)' },
    version: { zh: '最低 ≥ 0.56.0（握手待本地实测）', en: 'min ≥ 0.56.0 (handshake pending)' },
    auth: { zh: '首次启动 Google OAuth', en: 'first-run Google OAuth' },
    detail: {
      zh: '试验接入：声明支持原生审批与图片；本地实机握手与会话创建在排期实测中。',
      en: 'Experimental: declares approvals & images; local handshake and session verification pending.',
    },
  },
  {
    id: 'cursor',
    name: 'Cursor',
    cmd: 'cursor-agent',
    level: 'experimental',
    protocol: { zh: 'ACP (stdio · acp 子命令)', en: 'ACP (stdio · acp subcommand)' },
    version: { zh: '最低 ≥ 2026.8.11（日历版本待适配）', en: 'min ≥ 2026.8.11 (calendar ver)' },
    auth: { zh: 'cursor-agent login', en: 'cursor-agent login' },
    detail: {
      zh: '试验接入：声明原生审批；日历版本号解析与实机握手待补齐，cursor/* 扩展消息暂未消费。',
      en: 'Experimental: declares native approvals; calendar-version parser & local handshake pending.',
    },
  },
  {
    id: 'qoder',
    name: 'Qoder CLI',
    cmd: 'qodercli',
    level: 'experimental',
    protocol: { zh: 'ACP (stdio · --acp)', en: 'ACP (stdio · --acp)' },
    version: { zh: '最低 ≥ 0.2.14（握手待实测）', en: 'min ≥ 0.2.14 (handshake pending)' },
    auth: { zh: 'qodercli login', en: 'qodercli login' },
    detail: {
      zh: '试验接入：声明原生审批；禁止使用 --yolo 跳过审批模式，实机握手与命令名一致性待验。',
      en: 'Experimental: declares native approvals (never uses --yolo bypass); local handshake pending.',
    },
  },
  {
    id: 'antigravity',
    name: 'Antigravity',
    cmd: 'agy',
    level: 'planned',
    protocol: { zh: '计划接入（预留 antigravity-acp）', en: 'Planned (antigravity-acp reserved)' },
    version: { zh: 'P2 排期 · 待定版本基线', en: 'P2 planned · version TBD' },
    auth: { zh: '认证归属 Antigravity 桌面应用', en: 'auth owned by desktop app' },
    detail: {
      zh: '计划登记：`agy` CLI 无独立登录子命令，暂按已装产品探测，驱动与版本基线待 P2 接入。',
      en: 'Planned: `agy` lacks a standalone login subcommand; currently tracked as installed product pending P2 driver.',
    },
  },
  {
    id: 'workbuddy',
    name: 'WorkBuddy',
    cmd: 'workbuddy',
    level: 'planned',
    protocol: { zh: '计划：只读导入（CodeBuddy 另走 ACP）', en: 'Planned: read-only import (CodeBuddy -> ACP)' },
    version: { zh: 'P2 排期 · 已定分流方案', en: 'P2 planned · split design approved' },
    auth: { zh: '桌面侧车注入（不外调）', en: 'desktop sidecar auth (internal only)' },
    detail: {
      zh: '计划登记：Owner 已定 WorkBuddy 只做历史会话只读导入（不强驱内部桥接）；实时聊天另立 codebuddy 条目走 CodeBuddy Code CLI + --acp。',
      en: 'Planned: WorkBuddy will support read-only session import only; live ACP chat will be added separately via CodeBuddy Code CLI (--acp).',
    },
  },
  {
    id: 'fx',
    name: 'fx (Z.ai GLM)',
    cmd: 'fx',
    level: 'planned',
    protocol: { zh: '计划接入（P2）', en: 'Planned (P2)' },
    version: { zh: '待接入驱动', en: 'driver pending' },
    auth: { zh: '未接入', en: 'unintegrated' },
    detail: {
      zh: '计划登记：已纳入 19 条清单占位，驱动与认证流程待后续补齐。',
      en: 'Planned: registered in the 19-agent manifest index; driver and auth pending.',
    },
  },
  {
    id: 'kiro',
    name: 'Kiro',
    cmd: 'kiro',
    level: 'planned',
    protocol: { zh: '计划接入（P2）', en: 'Planned (P2)' },
    version: { zh: '待接入驱动', en: 'driver pending' },
    auth: { zh: '未接入', en: 'unintegrated' },
    detail: {
      zh: '计划登记：已纳入 19 条清单占位，驱动与认证流程待后续补齐。',
      en: 'Planned: registered in the 19-agent manifest index; driver and auth pending.',
    },
  },
  {
    id: 'omp',
    name: 'oh-my-pi',
    cmd: 'omp',
    level: 'planned',
    protocol: { zh: '计划接入（P2）', en: 'Planned (P2)' },
    version: { zh: '待接入驱动', en: 'driver pending' },
    auth: { zh: '未接入', en: 'unintegrated' },
    detail: {
      zh: '计划登记：已纳入 19 条清单占位，驱动与认证流程待后续补齐。',
      en: 'Planned: registered in the 19-agent manifest index; driver and auth pending.',
    },
  },
  {
    id: 'trae',
    name: 'Trae',
    cmd: 'trae',
    level: 'planned',
    protocol: { zh: '计划接入（P2）', en: 'Planned (P2)' },
    version: { zh: '待接入驱动', en: 'driver pending' },
    auth: { zh: '未接入', en: 'unintegrated' },
    detail: {
      zh: '计划登记：已纳入 19 条清单占位，驱动与认证流程待后续补齐。',
      en: 'Planned: registered in the 19-agent manifest index; driver and auth pending.',
    },
  },
];

const DOMAIN_WORKFLOWS: Record<
  string,
  {
    steps: { zh: ReadonlyArray<{ no: string; title: string; desc: string }>; en: ReadonlyArray<{ no: string; title: string; desc: string }> };
    deliverableTitle: { zh: string; en: string };
    deliverableTree: string;
    sampleImage: string;
    sampleAlt: { zh: string; en: string };
  }
> = {
  pkm: {
    steps: {
      zh: [
        { no: 'STEP 01', title: '多源采集与清洗', desc: '从网页、公众号、X、小红书、抖音、GitHub 或云盘抽取正文与元数据。' },
        { no: 'STEP 02', title: '本地 Markdown 落盘', desc: '按统一 Frontmatter 规范写入本地 Obsidian Vault，保留原文与来源链接。' },
        { no: 'STEP 03', title: '双链与 MOC 沉淀', desc: '自动归档、建立主题双链、生成卡片索引或抽认卡，供后续检索复用。' },
      ],
      en: [
        { no: 'STEP 01', title: 'Clip & clean', desc: 'Extract clean content and metadata from web pages, WeChat, X, Rednote, Douyin, or GitHub.' },
        { no: 'STEP 02', title: 'Local Markdown vault', desc: 'Write structured Markdown with unified frontmatter and canonical source links to your vault.' },
        { no: 'STEP 03', title: 'Link & distill', desc: 'Connect bidirectional wiki-links, update MOCs, or distill into cards and diagrams.' },
      ],
    },
    deliverableTitle: { zh: '典型本地 Vault 产出目录', en: 'Typical local Vault output' },
    deliverableTree: `vault/\n├── 00-inbox/2026-11-18-clipped-note.md\n├── 20-notes/topic-moc.md\n└── assets/attachments/`,
    sampleImage: '/soia/domains/cover-pkm.png',
    sampleAlt: { zh: 'PKM 多源剪藏与本地双链沉淀示意图', en: 'PKM clipping and local vault workflow' },
  },
  dev: {
    steps: {
      zh: [
        { no: 'STEP 01', title: '先定边界与计划', desc: '只读梳理相关调用链与受影响文件，明确修改范围与验收标准。' },
        { no: 'STEP 02', title: '最小精准改动', desc: '在授权边界内修改真源，复用现有模式，不顺手重做无关模块。' },
        { no: 'STEP 03', title: '真跑验证与审查', desc: '执行定向构建、类型检查与测试，必要时触发只读审查并汇报真实结果。' },
      ],
      en: [
        { no: 'STEP 01', title: 'Scope & plan', desc: 'Trace relevant call sites read-only and lock the change boundary and verification plan.' },
        { no: 'STEP 02', title: 'Minimal patch', desc: 'Edit only the authorized source files while reusing existing helpers and patterns.' },
        { no: 'STEP 03', title: 'Verify & review', desc: 'Run real builds, typechecks, and tests, followed by read-only review before reporting.' },
      ],
    },
    deliverableTitle: { zh: '典型工程验收回执结构', en: 'Typical verification output' },
    deliverableTree: `1. Scope & files changed (git diff --stat)\n2. Verification: tsc / lint / unit tests (exit 0)\n3. Open risks & review notes`,
    sampleImage: '/soia/domains/cover-dev.png',
    sampleAlt: { zh: 'Dev 受控边界、最小改动与真实验证工作流示意图', en: 'Dev bounded change and verification workflow' },
  },
  office: {
    steps: {
      zh: [
        { no: 'STEP 01', title: '结构化事实提取', desc: '从文档、飞书或 ProcessOn 抽取真实结构与内容要点，落成本地资产。' },
        { no: 'STEP 02', title: '七块规范编译 / 创作', desc: '按目标平台比例与中文/视觉风格规范生成文稿、SVG 图标或高清配图。' },
        { no: 'STEP 03', title: '落盘草稿与人工复核', desc: '仅写入本地目录或平台草稿箱，逐图/逐字核验后再交由人工确认发布。' },
      ],
      en: [
        { no: 'STEP 01', title: 'Ground facts locally', desc: 'Pull structured facts from docs, Feishu, or ProcessOn into clean local files.' },
        { no: 'STEP 02', title: 'Compile & create', desc: 'Produce articles, SVG assets, or aspect-aware illustrations following platform specs.' },
        { no: 'STEP 03', title: 'Draft-only delivery', desc: 'Save to local files or platform draft boxes for visual and factual review—never auto-publish.' },
      ],
    },
    deliverableTitle: { zh: '典型内容与配图交付包', en: 'Typical content & artwork bundle' },
    deliverableTree: `delivery/\n├── prompts/01-cover.md\n├── cover-1280x800.png\n└── manifest.yml (draft status + checks)`,
    sampleImage: '/soia/domains/cover-office.png',
    sampleAlt: { zh: '办公与内容本地落盘、传统美学配图与草稿匣示意图', en: 'Office local files, artwork, and draft tray workflow' },
  },
  meta: {
    steps: {
      zh: [
        { no: 'STEP 01', title: '需求匹配与检索', desc: '根据当前任务在 SOIA 技能树中定位最匹配的领域技能与前置依赖。' },
        { no: 'STEP 02', title: '契约与版本校验', desc: '核对真源仓、dev/main 分支状态、版本号与插件安装清单一致性。' },
        { no: 'STEP 03', title: '跨仓同步与交付', desc: '按发布纪律完成 PR、pin 更新或安装引导，不越权修改未授权环境。' },
      ],
      en: [
        { no: 'STEP 01', title: 'Match & route', desc: 'Locate the best-fit SOIA skill and prerequisites for the task across domains.' },
        { no: 'STEP 02', title: 'Contract & version check', desc: 'Verify source repos, dev/main alignment, versions, and plugin manifest consistency.' },
        { no: 'STEP 03', title: 'Sync & release', desc: 'Execute authorized PRs, pin updates, or install instructions with explicit scope.' },
      ],
    },
    deliverableTitle: { zh: '典型技能路由与发布清单', en: 'Typical routing & release checklist' },
    deliverableTree: `skill-match -> repo/branch check -> version/pin sync -> install command`,
    sampleImage: '/soia/domains/cover-meta.png',
    sampleAlt: { zh: 'Meta 技能发现路由与跨仓治理示意图', en: 'Meta skill discovery and governance workflow' },
  },
};

const DOC_URL = (name: string) =>
  `https://github.com/soia-team/soia-open-skills/blob/main/docs/skills/${name}.md`;
const SRC_URL = (repo: string, name: string) => `${repo}/tree/main/skills/${name}`;

type Domain = {
  slug: string;
  plugin: string;
  repo: string;
  tokens: string;
  cover: string;
  name: LocaleText;
  blurb: LocaleText;
};

export const SKILL_DOMAINS: readonly Domain[] = [
  {
    slug: 'meta',
    plugin: 'soia-meta',
    repo: 'https://github.com/soia-team/soia-open-skills',
    tokens: '~250',
    cover: '/soia/domains/cover-meta.png',
    name: { zh: '生态 Meta（核心包）', en: 'Meta (Core)', ja: 'エコシステム Meta（中核）' },
    blurb: {
      zh: '所有 SOIA 技能的市场总入口与核心元包：按需求找技能、同步到多个 AI 宿主、规范提示词并发布更新。',
      en: 'Core marketplace portal & meta skills: discover skills by need, sync hosts, clarify prompts, and release.',
      ja: '全スキルのハブ兼マーケットプレイス中核：要件検索・ホスト同期・プロンプト構造化・リリース管理。',
    },
  },
  {
    slug: 'pkm',
    plugin: 'soia-pkm-vault',
    repo: 'https://github.com/soia-team/soia-open-pkm-vault-skills',
    tokens: '~2.4k',
    cover: '/soia/domains/cover-pkm.png',
    name: { zh: '知识库 PKM', en: 'PKM Vault', ja: 'ナレッジベース PKM' },
    blurb: {
      zh: '别再收藏吃灰。网页、公众号、X、小红书、抖音、GitHub、云盘进本地 Markdown vault，再整理、提炼、转成图。',
      en: 'Clip the web, WeChat, X, Rednote, Douyin, GitHub and drives into a local Markdown vault, then organize and distill.',
      ja: 'Web、WeChat、X、RED、TikTok系、GitHub、クラウドをローカル Markdown Vault に保存し、整理・要約・可視化まで一気通貫。',
    },
  },
  {
    slug: 'dev',
    plugin: 'soia-dev',
    repo: 'https://github.com/soia-team/soia-open-dev-skills',
    tokens: '~550',
    cover: '/soia/domains/cover-dev.png',
    name: { zh: '工程 Dev', en: 'Engineering', ja: 'エンジニアリング Dev' },
    blurb: {
      zh: '让 AI 改代码不再「应该没问题」就交差：定边界、最小改动、真跑验证、只读审查。',
      en: 'Bounded changes, real verification, and read-only review — not “should be fine”.',
      ja: '「たぶん大丈夫」で終わらせない：変更範囲を限定し、実テストと読み取り専用レビューを徹底。',
    },
  },
  {
    slug: 'office',
    plugin: 'soia-cwork-office',
    repo: 'https://github.com/soia-team/soia-open-cwork-office-skills',
    tokens: '~680',
    cover: '/soia/domains/cover-office.png',
    name: { zh: '办公与内容', en: 'Office & content', ja: 'オフィス & コンテンツ' },
    blurb: {
      zh: '飞书、ProcessOn 落成本地文件；成文、传统构图配图；公众号 / 小红书 / X 只建草稿，绝不自动群发。',
      en: 'Feishu and ProcessOn to local files; drafts and images; WeChat / Rednote / X drafts only — never auto-publish.',
      ja: 'Feishu や ProcessOn をローカル保存し、執筆と図版生成。WeChat / RED / X は下書きのみ作成し自動投稿しません。',
    },
  },
];

export type SkillDomainSlug = (typeof SKILL_DOMAINS)[number]['slug'];

type SkillSubcategory = {
  id: string;
  label: LocaleText;
  desc: LocaleText;
  skills: readonly string[];
};

const SKILL_SUBCATEGORIES: Record<SkillDomainSlug, readonly SkillSubcategory[]> = {
  pkm: [
    {
      id: 'pkm-vault',
      label: { zh: '知识库底座与治理', en: 'Vault core & governance', ja: 'Vault 基盤と統制' },
      desc: {
        zh: 'Vault 初始化、Obsidian 接入、分层检索、体检、生命周期整理与编码会话留痕。',
        en: 'Vault bootstrap, Obsidian wiring, layered search, health audits, lifecycle moves, and agent snapshots.',
        ja: 'Vault 初期化、Obsidian 連携、階層検索、ヘルス診断、ライフサイクル整理とセッション記録。',
      },
      skills: [
        'soia-pkm-bootstrap-vault-base',
        'soia-pkm-bootstrap-vault-obsidian',
        'soia-pkm-query-vault',
        'soia-pkm-maintain-vault-health',
        'soia-pkm-manage-vault-lifecycle',
        'soia-pkm-organize-article-moc',
        'soia-pkm-log-agent-sessions',
      ],
    },
    {
      id: 'pkm-clip',
      label: { zh: '内容采集与归档', en: 'Capture & clipping', ja: '収集・クリッピング' },
      desc: {
        zh: '网页、公众号、X、小红书、抖音、GitHub 与云盘 PDF 一键归档进本地 Markdown 仓库。',
        en: 'Clip web articles, WeChat, X, Rednote, Douyin, GitHub repos, and drives into local Markdown.',
        ja: 'Web 記事、WeChat、X、RED、Douyin、GitHub、クラウド PDF をローカル Markdown へ保存。',
      },
      skills: [
        'soia-pkm-clip-web',
        'soia-pkm-clip-wechat-article',
        'soia-pkm-clip-wechat-account',
        'soia-pkm-clip-x',
        'soia-pkm-clip-x-profile',
        'soia-pkm-clip-rednote',
        'soia-pkm-clip-douyin',
        'soia-pkm-clip-github-repo',
        'soia-pkm-clip-drive',
      ],
    },
    {
      id: 'pkm-distill',
      label: { zh: '阅读理解、精翻与提炼', en: 'Reading, translation & distillation', ja: '精読・翻訳・知識抽出' },
      desc: {
        zh: '独立 AI 选读评估、三档精翻、苏格拉底式个人观点提炼，以及全库长期知识沉淀。',
        en: 'AI critical reading, 3-tier ZH translation, Socratic opinion distillation, and long-term knowledge extraction.',
        ja: '批判的読解評価、3段階翻訳、ソクラテス式見解抽出、長期知識ベース蓄積。',
      },
      skills: [
        'soia-pkm-interpret-article-analysis',
        'soia-pkm-translate-article-zh',
        'soia-pkm-distill-article-opinion',
        'soia-pkm-extract-vault-knowledge',
      ],
    },
    {
      id: 'pkm-transform',
      label: { zh: '多媒体视觉与学习转化', en: 'Visual & learning transforms', ja: '視覚化・学習変換' },
      desc: {
        zh: '把长文转成长图、信息图、海报、Anki 闪卡、脑图与 NotebookLM 播客材料。',
        en: 'Turn articles into infographics, posters, flashcards, mind maps, and NotebookLM study packs.',
        ja: '長文記事を図解ポスター、Anki カード、マインドマップ、NotebookLM 用素材へ変換。',
      },
      skills: [
        'soia-pkm-transform-article-visual',
        'soia-pkm-transform-article-notebooklm',
      ],
    },
    {
      id: 'pkm-tools',
      label: { zh: '独立工具：个人书库与网盘', en: 'Standalone tools: Library & drives', ja: '単体ツール：蔵書とドライブ' },
      desc: {
        zh: '不绑完整文章流的独立工具：微信读书同步、纯本地书库底座，以及阿里云盘 / 百度网盘原子操作。',
        en: 'Standalone utilities for local book catalogs, WeRead sync, Alipan, and Baidu Netdisk.',
        ja: '蔵書管理、WeRead 同期、Alipan / Baidu Netdisk 操作などの単体ユーティリティ。',
      },
      skills: [
        'soia-pkm-library-book-catalog',
        'soia-pkm-library-weread-sync',
        'soia-pkm-alipan-drive-ops',
        'soia-pkm-alipan-curator',
        'soia-pkm-baidu-netdisk-ops',
      ],
    },
  ],
  office: [
    {
      id: 'office-sync',
      label: { zh: '协作办公同步工具', en: 'Collaborative office tools', ja: 'コラボ・同期ツール' },
      desc: {
        zh: '飞书只读调研/增量同步，以及 ProcessOn 图表安全盘点与导出归档。',
        en: 'Read-only Feishu wiki/drive sync and safe ProcessOn diagram export.',
        ja: 'Feishu 読み取り専用同期や ProcessOn 図表の安全なエクスポート。',
      },
      skills: [
        'soia-cwork-feishu-cli',
        'soia-cwork-processon-diagrams',
      ],
    },
    {
      id: 'office-create',
      label: { zh: '成文与视觉创作工坊', en: 'Writing & visual creation', ja: '記事執筆・図版制作' },
      desc: {
        zh: '以真实观点与 Vault 摘抄写长文草稿，并基于组合轴与中华传统色生成配图和 SVG。',
        en: 'Draft authentic articles from vault notes and compile artwork/SVGs.',
        ja: 'Vault のメモを基に長文下書きを執筆し、SVG 図版や挿絵を生成。',
      },
      skills: [
        'soia-media-compose-article-draft',
        'soia-media-generate-article-image',
      ],
    },
    {
      id: 'office-publish',
      label: { zh: '多平台多媒体草稿发布', en: 'Multi-platform draft publishing', ja: 'マルチチャネル下書き配信' },
      desc: {
        zh: '只建草稿箱或当次授权代传，绝不静默群发：覆盖微信公众号、小红书与 X。',
        en: 'Draft-only and per-approval upload pipelines for WeChat, Rednote, and X.',
        ja: 'WeChat / RED / X 向けに下書き保存・都度承認アップロードのみ実施（自動公開なし）。',
      },
      skills: [
        'soia-media-publish-wechat-draft',
        'soia-media-publish-rednote-card',
        'soia-media-publish-x',
      ],
    },
  ],
  dev: [
    {
      id: 'dev-design',
      label: { zh: '规范定界与架构设计', en: 'Specs & architecture design', ja: '仕様確定・設計ガバナンス' },
      desc: {
        zh: '写代码先定范围、复现、契约职责边界与 UI 状态设计交接。',
        en: 'Scope guardrails, cross-component architecture governance, and implementation-ready UI design.',
        ja: '実装前の変更範囲確定、アーキテクチャ境界統制、UI 状態設計。',
      },
      skills: [
        'soia-dev-enforce-coding-protocol',
        'soia-dev-govern-architecture',
        'soia-dev-design-ui',
      ],
    },
    {
      id: 'dev-build',
      label: { zh: '任务落地与 CLI 调度', en: 'Implementation & dispatch', ja: 'タスク実装・CLI 連携' },
      desc: {
        zh: '需求实现与缺陷修复，以及派单给外部 AI CLI 进程并核验多账号额度与产物。',
        en: 'End-to-end engineering delivery plus multi-account external AI CLI dispatch.',
        ja: '要件実装・バグ修正から外部 AI CLI プロセスへのジョブ委譲まで。',
      },
      skills: [
        'soia-dev-implement-task',
        'soia-dev-agent-cli-dispatch',
      ],
    },
    {
      id: 'dev-review',
      label: { zh: '只读审查与 UI 验收', en: 'Read-only review & audit', ja: '読み取り専用レビュー・UI 監査' },
      desc: {
        zh: '独立只读视角：代码与技能包的双轨合规/风险审查，以及 UI 技术证据/UX 分轨验收。',
        en: 'Independent read-only code/skill reviews and split technical/UX UI audits.',
        ja: '独立視点によるコード・スキル包の適合性レビューと UI 実機検証。',
      },
      skills: [
        'soia-dev-review-code',
        'soia-dev-audit-ui',
      ],
    },
    {
      id: 'dev-tools',
      label: { zh: '独立工具：GitHub 与视图', en: 'Standalone tools: GitHub & views', ja: '単体ツール：GitHub・進捗ビュー' },
      desc: {
        zh: 'GitHub PR/CI/Release 权限管家，以及按需生成的最小任务进度与调用链视图。',
        en: 'GitHub PR/CI/Release operations and on-demand minimal task progress views.',
        ja: 'GitHub PR/CI/Release 操作およびオンデマンド進捗 HTML 生成。',
      },
      skills: [
        'soia-dev-github-ops',
        'soia-dev-show-task-html',
      ],
    },
  ],
  meta: [
    {
      id: 'meta-prompt',
      label: { zh: '技能检索与提示词工程', en: 'Discovery & prompt engineering', ja: 'スキル検索・プロンプト設計' },
      desc: {
        zh: '按需求匹配已有或候选 SOIA 技能，以及起草、诊断并规格化清晰可执行的提示词。',
        en: 'Find the right SOIA skill without unauthorized installs, and clarify prompts.',
        ja: '要件に合う SOIA スキルの発見と曖昧なプロンプトの仕様化。',
      },
      skills: [
        'soia-meta-find-skill',
        'soia-meta-prompt-clarity',
      ],
    },
    {
      id: 'meta-release',
      label: { zh: '分发同步与发版管理', en: 'Sync & release ops', ja: '配信同期・リリース運用' },
      desc: {
        zh: '先 dry-run 再跨项目/宿主软链同步技能，以及严格祖先校验与快进 main 的发版流程。',
        en: 'Dry-run symlink sync across hosts and fast-forward main skill releases.',
        ja: 'ドライラン検証付きホスト間シンボリックリンク同期と Fast-forward リリース。',
      },
      skills: [
        'soia-meta-sync-skills',
        'soia-meta-skill-release',
      ],
    },
  ],
};

const isZh = (locale: LandingLocaleCode) => locale === 'zh';
const pick = <T,>(locale: LandingLocaleCode, value: { zh: T; en: T; ja?: T }): T => {
  const l = langOf(locale);
  if (l === 'zh') return value.zh;
  if (l === 'ja') return value.ja ?? value.en;
  return value.en;
};

const domainOf = (slug: string) => SKILL_DOMAINS.find((d) => d.slug === slug);
const skillsOf = (slug: string) => SKILL_DOCS.filter((s) => s.domain === slug);
const subcategoryOf = (domainSlug: string, skillName: string): SkillSubcategory | undefined => {
  const groups = SKILL_SUBCATEGORIES[domainSlug as SkillDomainSlug];
  return groups?.find((g) => g.skills.includes(skillName));
};

/** Inline text formatter: renders **strong** and `code` segments cleanly. */
function Inline({ text }: { text: string }) {
  const parts = text.split(/(\*\*[^*]+\*\*|`[^`]+`)/g);
  return (
    <>
      {parts.map((part, i) => {
        if (part.startsWith('**') && part.endsWith('**')) {
          return <strong key={i}>{part.slice(2, -2)}</strong>;
        }
        if (part.startsWith('`') && part.endsWith('`')) {
          return <code className="skill-inline-code" key={i}>{part.slice(1, -1)}</code>;
        }
        return <span key={i}>{part}</span>;
      })}
    </>
  );
}

function CopyButton({
  text,
  locale,
}: {
  text: string;
  locale: LandingLocaleCode;
}) {
  const [copied, setCopied] = useState(false);
  const label = copied
    ? t3(locale, '已复制', 'Copied', 'コピー済み')
    : t3(locale, '复制', 'Copy', 'コピー');
  return (
    <button
      type="button"
      className="skd-copy-btn"
      onClick={() => {
        if (navigator.clipboard?.writeText) {
          navigator.clipboard.writeText(text).catch(() => undefined);
        }
        setCopied(true);
        window.setTimeout(() => setCopied(false), 1600);
      }}
    >
      {label}
    </button>
  );
}

function matchesSkillQuery(
  doc: SkillDoc,
  query: string,
  locale: LandingLocaleCode,
): boolean {
  const q = query.trim().toLowerCase();
  if (!q) return true;
  const domain = domainOf(doc.domain);
  const subcat = subcategoryOf(doc.domain, doc.name);
  const lang = langOf(locale);
  const haystack = [
    doc.name,
    doc.tagline,
    doc.title.zh,
    doc.title.en,
    doc.title.ja ?? '',
    doc.pain.zh,
    doc.pain.en,
    doc.solution.zh,
    doc.solution.en,
    domain ? `${domain.plugin} ${domain.name.zh} ${domain.name.en} ${domain.name.ja ?? ''}` : '',
    subcat ? `${subcat.label.zh} ${subcat.label.en} ${subcat.label.ja ?? ''}` : '',
    ...(lang === 'zh' ? doc.prompts.zh : doc.prompts.en),
  ]
    .join(' ')
    .toLowerCase();
  return q.split(/\s+/).every((token) => haystack.includes(token));
}

const HOT_SKILLS: ReadonlySet<string> = new Set([
  // Core Meta
  'soia-meta-find-skill',
  'soia-meta-sync-skills',
  // PKM Vault daily essentials
  'soia-pkm-query-vault',
  'soia-pkm-clip-web',
  'soia-pkm-clip-wechat-article',
  'soia-pkm-bootstrap-vault-obsidian',
  'soia-pkm-maintain-vault-health',
  'soia-pkm-distill-article-opinion',
  'soia-pkm-translate-article-zh',
  // Dev & CLI dispatch essentials
  'soia-dev-agent-cli-dispatch',
  'soia-dev-implement-task',
  'soia-dev-review-code',
  'soia-dev-enforce-coding-protocol',
  'soia-dev-github-ops',
  // Office high-frequency essentials
  'soia-cwork-feishu-cli',
  'soia-media-compose-article-draft',
]);

function HotBadge({ locale }: { locale: LandingLocaleCode }) {
  return (
    <span className="sk-hot-badge">
      <svg viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
        <path d="M8.9 1.3c.2 1.8-.8 3-1.9 4-.8.8-1.4 1.6-1.4 2.8a2.4 2.4 0 0 0 4.8 0c0-.7-.2-1.3-.6-1.8 1.7.7 2.8 2.4 2.8 4.4A4.6 4.6 0 0 1 8 15.3 4.6 4.6 0 0 1 3.4 10.7c0-2.5 1.5-4.3 2.9-5.8.9-1 1.7-2 2.6-3.6Z" />
      </svg>
      {t3(locale, '常用推荐', 'Popular', '定番')}
    </span>
  );
}

function SkillCatalogCard({
  doc,
  locale,
}: {
  doc: SkillDoc;
  locale: LandingLocaleCode;
}) {
  const href = (path: string) => hrefFor(path, locale);
  const domain = domainOf(doc.domain);
  const subcat = subcategoryOf(doc.domain, doc.name);
  const isHot = HOT_SKILLS.has(doc.name);
  const summary = langOf(locale) === 'zh' ? doc.tagline : pick(locale, doc.pain);
  return (
    <article className={`sk-card${isHot ? ' is-hot' : ''}`}>
      <a className="sk-card-main" href={href(`/skills/${doc.domain}/${doc.name}/`)}>
        <div className="sk-card-head">
          <div className="sk-card-title-wrap">
            <strong>{pick(locale, doc.title)}</strong>
            <span className="sk-card-slug">{doc.name}</span>
          </div>
          {doc.version ? <span className="sk-card-ver">v{doc.version}</span> : null}
        </div>
        <p className="sk-card-desc">{summary}</p>
        <div className="sk-card-tags">
          {isHot ? <HotBadge locale={locale} /> : null}
          {domain ? (
            <span className={`sk-tag-domain is-${domain.slug}`}>
              {pick(locale, domain.name)}
            </span>
          ) : null}
          {subcat ? <span className="sk-tag-sub">{pick(locale, subcat.label)}</span> : null}
        </div>
      </a>
      <div className="sk-card-foot">
        <span>MIT · {domain?.plugin}</span>
        {domain ? (
          <a
            className="sk-card-src"
            href={SRC_URL(domain.repo, doc.name)}
            target="_blank"
            rel="noreferrer noopener"
          >
            SKILL.md ↗
          </a>
        ) : null}
      </div>
    </article>
  );
}

/** Skills hub — OpenDesign-inspired search, domain/subcategory filtering, 3-col skill grid & onboarding steps. */
export function SkillsHubPage({ locale }: { locale: LandingLocaleCode }) {
  const href = (path: string) => hrefFor(path, locale);
  const t = <T,>(zh: T, en: T, ja: T) => t3(locale, zh, en, ja);
  const [query, setQuery] = useState('');
  const [domainFilter, setDomainFilter] = useState<'all' | SkillDomainSlug>('all');
  const [subcatFilter, setSubcatFilter] = useState<string>('all');
  const [onlyHot, setOnlyHot] = useState(false);
  const [sortBy, setSortBy] = useState<'default' | 'az' | 'za'>('default');
  const [installTab, setInstallTab] = useState<'plugin' | 'workbuddy' | 'single'>('plugin');

  const availableSubcats =
    domainFilter === 'all'
      ? (Object.values(SKILL_SUBCATEGORIES).flat() as SkillSubcategory[])
      : SKILL_SUBCATEGORIES[domainFilter];

  const handleDomainChange = (next: 'all' | SkillDomainSlug) => {
    setDomainFilter(next);
    setSubcatFilter('all');
  };

  const filteredSkills = SKILL_DOCS.filter((doc) => {
    if (onlyHot && !HOT_SKILLS.has(doc.name)) return false;
    if (domainFilter !== 'all' && doc.domain !== domainFilter) return false;
    if (subcatFilter !== 'all') {
      const sub = subcategoryOf(doc.domain, doc.name);
      if (!sub || sub.id !== subcatFilter) return false;
    }
    return matchesSkillQuery(doc, query, locale);
  });

  const domainRank = new Map<string, number>(SKILL_DOMAINS.map((d, i) => [d.slug, i]));
  const sortedSkills =
    sortBy === 'default'
      ? [...filteredSkills].sort((a, b) => {
          const domCmp = (domainRank.get(a.domain) ?? 99) - (domainRank.get(b.domain) ?? 99);
          if (domCmp !== 0) return domCmp;
          return Number(HOT_SKILLS.has(b.name)) - Number(HOT_SKILLS.has(a.name));
        })
      : [...filteredSkills].sort((a, b) => {
          const cmp = a.name.localeCompare(b.name);
          return sortBy === 'az' ? cmp : -cmp;
        });

  const hasFilters = Boolean(query.trim()) || domainFilter !== 'all' || subcatFilter !== 'all' || onlyHot || sortBy !== 'default';

  return (
    <SubpageLayout active="plugins" locale={locale}>
      <article className="missing-page tutorials-page sk-hub">
        <header className="sk-hero-banner">
          <span className="sk-hero-kicker">
            <span className="sk-hero-kicker-dot" aria-hidden="true" />
            CLAUDE CODE · CODEX · WORKBUDDY · OPEN SOURCE
          </span>
          <h1>
            {t(
              '为 Claude Code、Codex 与 WorkBuddy 设计的开源 Skill 市场',
              'Open-source skills & plugins built for Claude Code, Codex, and WorkBuddy',
              'Claude Code・Codex・WorkBuddy のための公開スキル・プラグイン基盤',
            )}
          </h1>
          <p className="lead">
            {t(
              '以核心元包 soia-open-skills（Meta）为市场门户，串联 PKM（27）、Dev（9）、Office（7）共 47 个公开技能。既支持整域插件/角色化专家模式，也支持项目级单技能最小安装。',
              'Anchored by the core portal soia-open-skills (Meta), spanning 47 open skills across Meta (4), PKM (27), Dev (9), and Office (7). Install via host plugins, WorkBuddy role experts, or single-skill project scope.',
              '中核ポータル soia-open-skills（Meta）を起点に、PKM (27)・Dev (9)・Office (7) の計 47 スキルを統合。プラグイン形式・WorkBuddy エキスパート形式・プロジェクト単体導入の 3 方式に対応。',
            )}
          </p>
          <div className="sk-hero-actions">
            <a className="btn btn-primary" href="#catalog">
              {t('浏览全部 47 个 Skill ↓', 'Browse all 47 skills ↓', '全 47 スキルを探す ↓')}
            </a>
            <a className="btn btn-ghost" href="#install-modes">
              {t('宿主安装指南（插件 / 专家模式）↓', 'Host Install: Plugins & Experts ↓', '導入ガイド（プラグイン / エキスパート）↓')}
            </a>
          </div>
        </header>

        <section className="sk-facts" aria-label={t('技能库统计事实', 'Skill catalog facts', 'スキルカタログ概要')}>
          <div className="sk-fact">
            <span className="sk-fact-label">CORE &amp; DOMAINS</span>
            <strong>{t('Meta 核心 + 3 大领域 · 47 技能', 'Meta Core + 3 Domains · 47 Skills', 'Meta 中核 + 3 領域 · 47 スキル')}</strong>
            <span>{t('Meta (4) 为核心市场门户，联动 PKM (27) · Dev (9) · Office (7)', 'Meta (4) is the core portal linking PKM (27) · Dev (9) · Office (7)', 'Meta (4) がマーケット中核となり PKM・Dev・Office を連携')}</span>
          </div>
          <div className="sk-fact">
            <span className="sk-fact-label">PLUGIN &amp; EXPERT MODES</span>
            <strong>{t('插件模式 · 专家模式', 'Plugin & Expert Modes', 'プラグイン・エキスパート形式')}</strong>
            <span>{t('Claude Code / Codex 装域插件，WorkBuddy 装角色化专家（不召唤不占上下文）', 'Domain plugins for Claude/Codex; role experts for WorkBuddy desktop', 'Claude / Codex はドメインプラグイン、WorkBuddy はロール別エキスパート導入')}</span>
          </div>
          <div className="sk-fact">
            <span className="sk-fact-label">SINGLE-SKILL SCOPE</span>
            <strong>{t('MIT · 支持单技能最小安装', 'MIT · Project-scoped npx', 'MIT · プロジェクト単体導入')}</strong>
            <span>{t('明确宿主与作用域，绝不未授权覆盖全局环境或自动同步副本', 'Explicit host & scope without silent global overrides', 'ホストと適用スコープを明示しグローバル設定を汚染しません')}</span>
          </div>
        </section>

        <section className="sk-section-head" id="catalog">
          <div className="sk-section-eyebrow">
            <span className="sk-section-num">01</span>
            <span>{t('所有 SKILL · 分类与检索', 'ALL SKILLS · FILTER & SEARCH', 'ALL SKILLS · 分類と検索')}</span>
          </div>
          <h2>{t('按领域、子类或关键词查找全部 47 个 SOIA Skill', 'Search and filter all 47 SOIA skills by task', '領域・カテゴリ・キーワードから全 47 スキルを検索')}</h2>
          <p>
            {t(
              '支持按技能名、痛点场景、支持工具模糊搜索，也可点击下方 4 个领域卡进入分域专题列表。',
              'Filter by domain, workflow subcategory, or keyword — or jump directly to any domain overview below.',
              'スキル名・課題・ツール名での横断検索に加え、ドメイン別ページからも絞り込めます。',
            )}
          </p>
        </section>

        <div className="sk-domain-strip">
          {SKILL_DOMAINS.map((domain) => (
            <a className="sk-domain-chip" href={href(`/skills/${domain.slug}/`)} key={domain.slug}>
              <div className="sk-domain-chip-top">
                <span>{domain.plugin}</span>
                <span>{skillsOf(domain.slug).length} {t('项', 'skills', '件')} ↗</span>
              </div>
              <strong>{pick(locale, domain.name)}</strong>
              <small>{domain.tokens} tok · {SKILL_SUBCATEGORIES[domain.slug].length} {t('个子类', 'subcategories', 'カテゴリ')}</small>
            </a>
          ))}
        </div>

        <div className="sk-toolbar" role="search">
          <div className="sk-search-wrap">
            <span className="sk-search-icon" aria-hidden="true">⌕</span>
            <input
              type="search"
              className="sk-search-input"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={t(
                '搜索 skill 名称、中文标题、场景或命令（如 obsidian、wechat、review）',
                'Search skill name, title, task, or keyword (e.g. obsidian, review)',
                'スキル名・課題・キーワードで検索（例：obsidian, review）',
              )}
              aria-label={t('搜索技能', 'Search skills', 'スキルを検索')}
            />
            {query ? (
              <button
                type="button"
                className="sk-search-clear"
                aria-label={t('清空搜索', 'Clear search', '検索をクリア')}
                onClick={() => setQuery('')}
              >
                ×
              </button>
            ) : null}
          </div>

          <select
            className="sk-select"
            aria-label={t('按领域筛选', 'Filter by domain', '領域で絞り込み')}
            value={domainFilter}
            onChange={(e) => handleDomainChange(e.target.value as 'all' | SkillDomainSlug)}
          >
            <option value="all">{t('所有领域 (47)', 'All domains (47)', 'すべての領域 (47)')}</option>
            {SKILL_DOMAINS.map((d) => (
              <option value={d.slug} key={d.slug}>
                {pick(locale, d.name)} ({skillsOf(d.slug).length})
              </option>
            ))}
          </select>

          <select
            className="sk-select"
            aria-label={t('按子类筛选', 'Filter by subcategory', 'カテゴリで絞り込み')}
            value={subcatFilter}
            onChange={(e) => setSubcatFilter(e.target.value)}
          >
            <option value="all">{t('全部子类', 'All subcategories', 'すべてのカテゴリ')}</option>
            {availableSubcats.map((sub) => (
              <option value={sub.id} key={sub.id}>
                {pick(locale, sub.label)} ({sub.skills.length})
              </option>
            ))}
          </select>

          <select
            className="sk-select"
            aria-label={t('排序方式', 'Sort order', '並び替え')}
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as 'default' | 'az' | 'za')}
          >
            <option value="default">{t('默认领域序', 'Default order', '標準順')}</option>
            <option value="az">{t('名称 A–Z', 'Name A–Z', '名前 A–Z')}</option>
            <option value="za">{t('名称 Z–A', 'Name Z–A', '名前 Z–A')}</option>
          </select>

          {hasFilters ? (
            <button
              type="button"
              className="sk-clear-btn"
              onClick={() => {
                setQuery('');
                setDomainFilter('all');
                setSubcatFilter('all');
                setOnlyHot(false);
                setSortBy('default');
              }}
            >
              {t('清除筛选', 'Reset', 'リセット')}
            </button>
          ) : null}
        </div>

        <div className="sk-status-row">
          <span>
            {t(
              `显示 ${sortedSkills.length} / ${SKILL_DOCS.length} 个技能`,
              `Showing ${sortedSkills.length} of ${SKILL_DOCS.length} skills`,
              `${SKILL_DOCS.length} 件中 ${sortedSkills.length} 件を表示`,
            )}
          </span>
          <div className="sk-domain-pills" role="tablist" aria-label={t('快速切换领域', 'Quick domain filter', '領域クイック切替')}>
            <button
              type="button"
              className={`sk-domain-pill is-hot-pill${onlyHot ? ' is-active' : ''}`}
              onClick={() => setOnlyHot((v) => !v)}
            >
              {t(`🔥 常用推荐 (${HOT_SKILLS.size})`, `🔥 Popular (${HOT_SKILLS.size})`, `🔥 定番 (${HOT_SKILLS.size})`)}
            </button>
            <button
              type="button"
              className={`sk-domain-pill${domainFilter === 'all' ? ' is-active' : ''}`}
              onClick={() => handleDomainChange('all')}
            >
              {t('全部', 'All', 'すべて')} ({SKILL_DOCS.length})
            </button>
            {SKILL_DOMAINS.map((d) => (
              <button
                type="button"
                key={d.slug}
                className={`sk-domain-pill${domainFilter === d.slug ? ' is-active' : ''}`}
                onClick={() => handleDomainChange(d.slug as SkillDomainSlug)}
              >
                {pick(locale, d.name)} ({skillsOf(d.slug).length})
              </button>
            ))}
          </div>
        </div>

        <section className="sk-catalog-grid" aria-label={t('技能卡片列表', 'Skill catalog results', 'スキル一覧')}>
          {sortedSkills.length > 0 ? (
            sortedSkills.map((skill) => <SkillCatalogCard doc={skill} locale={locale} key={skill.name} />)
          ) : (
            <div className="sk-empty">
              <strong>{t('没有找到匹配的技能', 'No matching skills found', '一致するスキルが見つかりません')}</strong>
              <span>{t('换个关键词，或者先清空领域/子类筛选试试。', 'Try another keyword or clear active filters.', '別のキーワードを試すかフィルタをリセットしてください。')}</span>
              <button
                type="button"
                className="sk-clear-btn"
                onClick={() => {
                  setQuery('');
                  setDomainFilter('all');
                  setSubcatFilter('all');
                  setOnlyHot(false);
                }}
              >
                {t('显示全部 47 个技能', 'Show all 47 skills', '全 47 スキルを表示')}
              </button>
            </div>
          )}
        </section>

        <section className="sk-section-head" id="install-modes">
          <div className="sk-section-eyebrow">
            <span className="sk-section-num">02</span>
            <span>{t('宿主安装体系 · 整域插件 & 专家模式', 'HOST INSTALL MODES · PLUGINS & EXPERTS', 'ホスト別導入 · プラグイン / エキスパート')}</span>
          </div>
          <h2>
            {t(
              'Claude Code / Codex 插件模式、WorkBuddy 专家模式与单技能安装对照',
              'Install via Host Plugins (Claude / Codex), Role Experts (WorkBuddy), or Single Skill',
              'Claude Code / Codex プラグイン・WorkBuddy エキスパート・単体導入の使い分け',
            )}
          </h2>
          <p>
            {t(
              '每个 SOIA 领域仓（以核心包 soia-open-skills 为市场入口）同时是一份 Claude 插件、Codex 插件与 WorkBuddy 角色化专家包——源码不复制，按你的宿主习惯选装即可：',
              'Every SOIA domain repository serves simultaneously as a Claude plugin, a Codex plugin, and a WorkBuddy expert bundle without duplicating skill sources:',
              '各領域リポジトリ（soia-open-skills がマーケットポータル）は同時に Claude / Codex プラグインおよび WorkBuddy エキスパートパッケージとして機能します：',
            )}
          </p>
        </section>

        <div className="sk-install-tabs" role="tablist" aria-label={t('选择宿主安装模式', 'Choose host install mode', '導入モードを選択')}>
          <button
            type="button"
            role="tab"
            aria-selected={installTab === 'plugin'}
            className={`sk-install-tab${installTab === 'plugin' ? ' is-active' : ''}`}
            onClick={() => setInstallTab('plugin')}
          >
            {t('路线 B · Claude Code / Codex 插件模式（推荐整域）', 'Plugin Mode · Claude Code / Codex', 'プラグイン形式 · Claude Code / Codex')}
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={installTab === 'workbuddy'}
            className={`sk-install-tab${installTab === 'workbuddy' ? ' is-active' : ''}`}
            onClick={() => setInstallTab('workbuddy')}
          >
            {t('专家模式 · WorkBuddy 角色化专家（桌面端推荐）', 'Expert Mode · WorkBuddy Desktop', 'エキスパート形式 · WorkBuddy')}
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={installTab === 'single'}
            className={`sk-install-tab${installTab === 'single' ? ' is-active' : ''}`}
            onClick={() => setInstallTab('single')}
          >
            {t('路线 A · 项目级单技能安装（npx 通用 60+ 宿主）', 'Single Skill · Project-scoped npx', '単体導入 · プロジェクト npx')}
          </button>
        </div>

        {installTab === 'plugin' && (
          <div className="sk-install-panel">
            <div className="sk-install-grid">
              <div className="sk-install-card">
                <div className="sk-install-card-head">
                  <strong>Claude Code · {t('插件市场模式', 'Plugin Marketplace', 'プラグインモード')}</strong>
                  <span className="sk-install-badge">{t('支持 enable/disable', 'Switchable', '有効/無効切替')}</span>
                </div>
                <p>
                  {t(
                    '1) 先注册核心市场 soia-open-skills；2) 先装核心包 soia-meta@soia（~250 tok）再按需安装域插件。插件缓存在 ~/.claude/plugins/cache/，与 ~/.agents/skills 互相独立，不用时随时 disable 归零上下文成本。',
                    'Register soia-open-skills as the marketplace, install core soia-meta@soia first (~250 tok), then add any domain plugin. Disable unused domains anytime for zero context cost.',
                    'まず soia-open-skills マーケットを登録し、中核の soia-meta@soia（~250 tok）や必要なドメインを追加。不要時は disable でコンテキスト負荷をゼロにできます。',
                  )}
                </p>
                <div className="skd-cmd-box">
                  <code>claude plugin marketplace add soia-team/soia-open-skills</code>
                  <CopyButton text="claude plugin marketplace add soia-team/soia-open-skills" locale={locale} />
                </div>
                <div className="skd-cmd-box">
                  <code>claude plugin install soia-meta@soia</code>
                  <CopyButton text="claude plugin install soia-meta@soia" locale={locale} />
                </div>
                <div className="skd-cmd-box">
                  <code>claude plugin install soia-pkm-vault@soia</code>
                  <CopyButton text="claude plugin install soia-pkm-vault@soia" locale={locale} />
                </div>
              </div>

              <div className="sk-install-card">
                <div className="sk-install-card-head">
                  <strong>Codex CLI · {t('市场插件模式', 'Marketplace Plugin', 'プラグインモード')}</strong>
                  <span className="sk-install-badge">{t('原生 marketplace.json', 'Native format', '公式マニフェスト対応')}</span>
                </div>
                <p>
                  {t(
                    'Codex 读取根仓 .agents/plugins/marketplace.json。先添加市场，再安装核心 Meta 与所需领域插件。用 codex plugin list 或 codex debug prompt-input 检查实际挂载路径。',
                    'Codex reads .agents/plugins/marketplace.json. Register the marketplace, add core soia-meta@soia and domains, and verify via codex plugin list.',
                    'Codex は .agents/plugins/marketplace.json を参照します。マーケット追加後に soia-meta@soia 等を導入し、codex plugin list で確認できます。',
                  )}
                </p>
                <div className="skd-cmd-box">
                  <code>codex plugin marketplace add soia-team/soia-open-skills</code>
                  <CopyButton text="codex plugin marketplace add soia-team/soia-open-skills" locale={locale} />
                </div>
                <div className="skd-cmd-box">
                  <code>codex plugin add soia-meta@soia</code>
                  <CopyButton text="codex plugin add soia-meta@soia" locale={locale} />
                </div>
                <div className="skd-cmd-box">
                  <code>codex plugin add soia-dev@soia</code>
                  <CopyButton text="codex plugin add soia-dev@soia" locale={locale} />
                </div>
              </div>
            </div>

            <div className="sk-install-note">
              <strong>{t('机制提示（重要）：', 'Host Mechanism Note:', '仕組み上の注意：')}</strong>
              {t(
                'Claude Code 的插件缓存与 npx 共享目录相互独立；而 Codex 的插件是叠加在 ~/.agents/skills 共享真源之上的（Codex 实际技能 = 共享真源 + 已装插件 + 内置技能），因此 Codex 若想减少常驻索引，应精简 ~/.agents/skills 只留高频，长尾用 soia-meta-find-skill 按需找；可选整域插件：soia-meta（核心 Meta · 4）、soia-pkm-vault（PKM · 27）、soia-dev（Dev · 9）、soia-cwork-office（Office · 7）。',
                'Claude plugins stay isolated from ~/.agents/skills, whereas Codex stacks plugins on top of ~/.agents/skills. Available plugins: soia-meta (Core · 4), soia-pkm-vault (27), soia-dev (9), soia-cwork-office (7).',
                'Claude のプラグインは ~/.agents/skills と分離されますが、Codex は ~/.agents/skills の上に加算ロードされます。提供プラグイン：soia-meta (中核·4) / soia-pkm-vault (27) / soia-dev (9) / soia-cwork-office (7)。',
              )}
            </div>
          </div>
        )}

        {installTab === 'workbuddy' && (
          <div className="sk-install-panel">
            <div className="sk-install-grid">
              <div className="sk-install-card">
                <div className="sk-install-card-head">
                  <strong>WorkBuddy · {t('角色化专家模式（推荐）', 'Role-Based Expert Mode', 'ロール別エキスパートモード')}</strong>
                  <span className="sk-install-badge">{t('不召唤不占上下文', 'On-demand summon', '呼び出し時のみ展開')}</span>
                </div>
                <p>
                  {t(
                    'WorkBuddy 没有 CLI，且开关粒度不是普通插件而是「角色化专家」（一个域仓 = 一位带人设与全域技能的专家）。直接对已有 AI 助手说「装到 WorkBuddy」，或运行安装脚本将核心包 soia-meta（及所需域）写入硬编码目录并登记市场：',
                    'WorkBuddy desktop switches by Role Experts (one repo = one expert persona bundled with its domain skills, zero cost until summoned). Run the bundled installer from soia-open-skills or tell your agent “Install to WorkBuddy”:',
                    'WorkBuddy はプラグインではなく「エキスパート単位（1 リポジトリ = 1 専門家）」で切り替え、召喚しない限りコンテキストを消費しません。スクリプトで導入して再起動します：',
                  )}
                </p>
                <div className="skd-cmd-box">
                  <code>python3 skills/soia-meta-skill-release/scripts/install_workbuddy_experts.py soia-meta</code>
                  <CopyButton text="python3 skills/soia-meta-skill-release/scripts/install_workbuddy_experts.py soia-meta" locale={locale} />
                </div>
                <div className="skd-cmd-box">
                  <code>python3 skills/soia-meta-skill-release/scripts/install_workbuddy_experts.py soia-meta soia-pkm-vault</code>
                  <CopyButton text="python3 skills/soia-meta-skill-release/scripts/install_workbuddy_experts.py soia-meta soia-pkm-vault" locale={locale} />
                </div>
                <p>
                  {t(
                    '装完重启 WorkBuddy 客户端，到【专家·技能·连接器 → 我的专家】召唤对应专家，输入「你有多少个可用技能」即可验证全域技能已在场。',
                    'Restart WorkBuddy after installing and summon the expert from My Experts.',
                    '導入後に WorkBuddy を再起動し、【マイエキスパート】から召喚して利用スキル数を確認できます。',
                  )}
                </p>
              </div>

              <div className="sk-install-card">
                <div className="sk-install-card-head">
                  <strong>{t('4 位公开角色化专家对照', '4 Public Role Experts', '公開 4 エキスパート一覧')}</strong>
                  <span className="sk-install-badge">my-experts</span>
                </div>
                <div className="skill-table-wrap">
                  <table className="skill-cap-table">
                    <thead>
                      <tr>
                        <th>{t('插件 / 专家 ID', 'Expert ID', 'エキスパート ID')}</th>
                        <th>{t('花名 / 角色', 'Role Persona', 'ロール名')}</th>
                        <th>{t('携带技能数', 'Skills', '収録数')}</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td><code>soia-meta</code></td>
                        <td><strong>Soia Meta</strong> · {t('技能生态管家', 'Skill Ecosystem Manager', 'エコシステム管理')}</td>
                        <td>4</td>
                      </tr>
                      <tr>
                        <td><code>soia-pkm-vault</code></td>
                        <td><strong>Soia Vault</strong> · {t('知识库管家', 'Knowledge Vault Curator', 'PKM 管理')}</td>
                        <td>27</td>
                      </tr>
                      <tr>
                        <td><code>soia-dev</code></td>
                        <td><strong>Soia Dev</strong> · {t('软件工程师', 'Software Engineer', 'エンジニアリング')}</td>
                        <td>9</td>
                      </tr>
                      <tr>
                        <td><code>soia-cwork-office</code></td>
                        <td><strong>Soia Cowork</strong> · {t('办公与内容助手', 'Office & Content Aide', 'オフィス・執筆')}</td>
                        <td>7</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            <div className="sk-install-note">
              <strong>{t('WorkBuddy 装载约束（必读）：', 'WorkBuddy Loading Rules:', 'WorkBuddy 導入時の制約：')}</strong>
              {t(
                '① 自建专家只认硬编码路径 ~/.workbuddy/plugins/marketplaces/my-experts/plugins/<专家名>/（并在 my-experts/.codebuddy-plugin/marketplace.json 追加记录），换名目录或填 URL 不会显示；② 不能用软链（官方校验器会 resolve() 穿透判失败），必须放实体 checkout 克隆；③ 若不走专家模式，也可用 soia-meta-sync-skills 只把个别技能软链到 ~/.workbuddy/skills（全局常驻，无法按专家召唤隔离）。',
                'WorkBuddy only scans physical directories inside ~/.workbuddy/plugins/marketplaces/my-experts/plugins/<name>/ with relative paths in marketplace.json; symlinks fail path resolution.',
                'WorkBuddy は ~/.workbuddy/plugins/marketplaces/my-experts/plugins/<名>/ 配下の実体チェックアウトと相対パス定義のみを認識します（シンボリックリンクは解決検査で弾かれます）。',
              )}
            </div>
          </div>
        )}

        {installTab === 'single' && (
          <div className="sk-install-panel">
            <div className="sk-install-grid">
              <div className="sk-install-card">
                <div className="sk-install-card-head">
                  <strong>{t('第一步：先给项目装核心发现入口', 'Step 1: Add core finder skill', 'Step 1: 中核の検索スキルを導入')}</strong>
                  <span className="sk-install-badge">{t('推荐起点', 'Start here', '推奨')}</span>
                </div>
                <p>
                  {t(
                    '默认只在当前工作项目安装（写入 .agents/skills/），不加 -g 不改全局。给 Codex / Claude Code / Antigravity / Cursor / Windsurf 等任意宿主装上 soia-meta-find-skill 后，说「帮我找个整理知识库的技能」即可自动路由：',
                    'Installs cleanly into current project (.agents/skills/) without mutating global config. Replace codex with claude-code or your target CLI:',
                    '現在のプロジェクトのみへ単体導入（-g なしでグローバルを汚しません）。codex の部分は claude-code 等に変更可能：',
                  )}
                </p>
                <div className="skd-cmd-box">
                  <code>npx skills add soia-team/soia-open-skills -a codex -s soia-meta-find-skill</code>
                  <CopyButton text="npx skills add soia-team/soia-open-skills -a codex -s soia-meta-find-skill" locale={locale} />
                </div>
              </div>

              <div className="sk-install-card">
                <div className="sk-install-card-head">
                  <strong>{t('跨 60+ 宿主同步与增量管理', 'Multi-host sync & management', '複数ホスト同期と管理')}</strong>
                  <span className="sk-install-badge">dry-run</span>
                </div>
                <p>
                  {t(
                    'Codex / Cursor / Zed / Gemini CLI 直读共享 ~/.agents/skills；Claude Code 由 npx 自动建链；Windsurf / Trae / Qoder / Kimi / OpenCode 需先运行 soia-meta-sync-skills 做 --dry-run 核对后再建软链。',
                    'Check installed skills or dry-run multi-host symlink sync via soia-meta-sync-skills before copying across CLI directories.',
                    'Codex / Cursor / Gemini CLI は ~/.agents/skills を共有参照。他ツールへの同期は --dry-run で事前確認して実施します。',
                  )}
                </p>
                <div className="skd-cmd-box">
                  <code>npx skills add soia-team/soia-open-pkm-vault-skills -a claude-code -s soia-pkm-query-vault</code>
                  <CopyButton text="npx skills add soia-team/soia-open-pkm-vault-skills -a claude-code -s soia-pkm-query-vault" locale={locale} />
                </div>
              </div>
            </div>
          </div>
        )}
      </article>
    </SubpageLayout>
  );
}

/** One domain — searchable + filterable subcategories + craft-list grouped by role. */
export function SkillDomainPage({ locale, slug }: { locale: LandingLocaleCode; slug: SkillDomainSlug }) {
  const href = (path: string) => hrefFor(path, locale);
  const t = <T,>(zh: T, en: T, ja: T) => t3(locale, zh, en, ja);
  const domain = domainOf(slug);
  const [activeCat, setActiveCat] = useState<string>('all');
  const [onlyHot, setOnlyHot] = useState(false);
  const [query, setQuery] = useState('');

  useEffect(() => {
    setActiveCat('all');
    setOnlyHot(false);
    setQuery('');
  }, [slug]);

  if (!domain) return null;
  const allDomainSkills = skillsOf(slug);
  const domainHotCount = allDomainSkills.filter((s) => HOT_SKILLS.has(s.name)).length;
  const skills = allDomainSkills.filter(
    (s) => (!onlyHot || HOT_SKILLS.has(s.name)) && matchesSkillQuery(s, query, locale),
  );
  const subcats = SKILL_SUBCATEGORIES[slug];
  const byName = new Map(skills.map((s) => [s.name, s]));
  const assigned = new Set<string>();

  const groups = subcats
    .map((sub) => {
      const items = sub.skills
        .map((name) => byName.get(name))
        .filter((item): item is SkillDoc => Boolean(item));
      items.forEach((item) => assigned.add(item.name));
      return { ...sub, items };
    })
    .filter((g) => g.items.length > 0);

  const rest = skills.filter((s) => !assigned.has(s.name));
  if (rest.length > 0) {
    groups.push({
      id: `${slug}-other`,
      label: { zh: '其他工具', en: 'Other tools', ja: 'その他のツール' },
      desc: { zh: '独立工具与未归类技能。', en: 'Additional domain skills.', ja: '追加の単体スキル・ツール群。' },
      skills: rest.map((s) => s.name),
      items: rest,
    });
  }

  const visibleGroups = activeCat === 'all' ? groups : groups.filter((g) => g.id === activeCat);
  let runningIndex = 0;

  return (
    <SubpageLayout active="plugins" locale={locale}>
      <article className="missing-page craft-page">
        <nav className="breadcrumb" aria-label="breadcrumb">
          <a href={href('/skills/')}>{t('开源技能', 'Open skills', '公開スキル')}</a><span>/</span>
          <span aria-current="page">{pick(locale, domain.name)}</span>
        </nav>
        <header className="catalog-head">
          <span className="label">{domain.plugin} · {allDomainSkills.length} {t('个技能', 'skills', 'スキル')} · {subcats.length} {t('个子类', 'categories', 'カテゴリ')}</span>
          <h1 className="display">{pick(locale, domain.name)}</h1>
          <p className="lead">{pick(locale, domain.blurb)}</p>
        </header>

        <div className="sk-search-wrap" style={{ marginBottom: 16, maxWidth: 520 }}>
          <span className="sk-search-icon" aria-hidden="true">⌕</span>
          <input
            type="search"
            className="sk-search-input"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t(
              `在 ${pick(locale, domain.name)} 内搜索技能...`,
              `Search inside ${pick(locale, domain.name)}...`,
              `${pick(locale, domain.name)} 内を検索...`,
            )}
            aria-label={t('域内搜索', 'Search within domain', '領域内を検索')}
          />
          {query ? (
            <button type="button" className="sk-search-clear" onClick={() => setQuery('')} aria-label={t('清空', 'Clear', 'クリア')}>×</button>
          ) : null}
        </div>

        <div className="missing-filter skill-cat-filter" role="tablist" aria-label={t('按子类筛选', 'Filter by category', 'カテゴリで絞り込み')}>
          {domainHotCount > 0 ? (
            <button
              type="button"
              className={`is-hot-pill${onlyHot ? ' is-active' : ''}`}
              onClick={() => setOnlyHot((v) => !v)}
            >
              {t(`🔥 常用推荐`, `🔥 Popular`, `🔥 定番`)}
              <span className="cat-count">{domainHotCount}</span>
            </button>
          ) : null}
          <button
            type="button"
            className={activeCat === 'all' ? 'is-active' : undefined}
            onClick={() => setActiveCat('all')}
          >
            {t('全部', 'All', 'すべて')}
            <span className="cat-count">{skills.length}</span>
          </button>
          {groups.map((g) => (
            <button
              type="button"
              key={g.id}
              className={activeCat === g.id ? 'is-active' : undefined}
              onClick={() => setActiveCat(g.id)}
            >
              {pick(locale, g.label)}
              <span className="cat-count">{g.items.length}</span>
            </button>
          ))}
        </div>

        {visibleGroups.length > 0 ? (
          visibleGroups.map((group) => (
            <section className="skill-group" id={group.id} key={group.id}>
              <div className="skill-group-head">
                <h2>
                  {pick(locale, group.label)}
                  <span className="skill-group-count">{group.items.length}</span>
                </h2>
                <p className="skill-group-desc">{pick(locale, group.desc)}</p>
              </div>
              <div className="craft-list">
                {group.items.map((skill) => {
                  runningIndex += 1;
                  const isHot = HOT_SKILLS.has(skill.name);
                  return (
                    <a className={`craft-row${isHot ? ' is-hot' : ''}`} href={href(`/skills/${slug}/${skill.name}/`)} key={skill.name}>
                      <span className="craft-index">{String(runningIndex).padStart(2, '0')}</span>
                      <span>
                        <strong>
                          {pick(locale, skill.title)}
                          {isHot ? <HotBadge locale={locale} /> : null}
                          <span className="skill-row-tech">{skill.name}{skill.version ? ` · v${skill.version}` : ''}</span>
                        </strong>
                        <small>{skill.tagline}</small>
                      </span>
                      <span className="craft-arrow">→</span>
                    </a>
                  );
                })}
              </div>
            </section>
          ))
        ) : (
          <div className="sk-empty" style={{ marginTop: 18 }}>
            <strong>{t('当前域内没有匹配的技能', 'No matching skills in this domain', 'この領域に一致するスキルはありません')}</strong>
            <button
              type="button"
              className="sk-clear-btn"
              onClick={() => {
                setQuery('');
                setOnlyHot(false);
                setActiveCat('all');
              }}
            >
              {t('重置当前域筛选', 'Reset filters', 'フィルタをリセット')}
            </button>
          </div>
        )}

        <div className="missing-cta">
          <a className="btn btn-primary" href={domain.repo} target="_blank" rel="noreferrer noopener">GitHub</a>
          <a className="btn btn-ghost" href={href('/skills/')}>{t('返回全部领域', 'All domains', 'すべての領域へ戻る')}</a>
        </div>
      </article>
    </SubpageLayout>
  );
}

/** One skill — Obsidian-inspired narrative + terminal hero + mechanism card. */
function escXml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/\*\*/g, '');
}

function visualUnits(ch: string): number {
  return ch.charCodeAt(0) <= 0x00ff ? 1 : 1.85;
}

function wrapVisualLines(raw: string, maxUnits: number): string[] {
  const clean = raw.replace(/\*\*/g, '').replace(/\s+/g, ' ').trim();
  if (!clean) return [''];
  const lines: string[] = [];
  let cur = '';
  let units = 0;
  for (const ch of clean) {
    const w = visualUnits(ch);
    if (units + w > maxUnits && cur.length > 0) {
      const lastSpace = cur.lastIndexOf(' ');
      if (ch !== ' ' && lastSpace > cur.length * 0.55) {
        lines.push(cur.slice(0, lastSpace));
        cur = cur.slice(lastSpace + 1) + ch;
        units = Array.from(cur).reduce((acc, c) => acc + visualUnits(c), 0);
      } else {
        lines.push(cur.trimEnd());
        cur = ch === ' ' ? '' : ch;
        units = cur ? w : 0;
      }
    } else {
      cur += ch;
      units += w;
    }
  }
  if (cur.trimEnd()) lines.push(cur.trimEnd());
  return lines;
}

const TONE_COLOR: Record<string, string> = {
  green: '#4ADE80',
  amber: '#FB923C',
  cyan: '#38BDF8',
  muted: '#94A3B8',
  normal: '#E2E8F0',
};

function buildSkillHeroCardDataUrl(doc: SkillDoc, domainLabel: string, zh: boolean): string {
  const title = zh ? doc.title.zh : doc.title.en;
  const sample = zh ? doc.liveSample.zh : doc.liveSample.en;
  const ver = doc.version ? `v${doc.version}` : '';
  const promptLines = wrapVisualLines(sample.prompt, 76).slice(0, 2);

  const termRows: Array<{ text: string; color: string }> = [];
  for (const item of sample.lines) {
    const color = TONE_COLOR[item.tone || 'normal'] || '#E2E8F0';
    for (const wrapped of wrapVisualLines(item.text, 82)) {
      termRows.push({ text: wrapped, color });
    }
  }

  const promptY = 178;
  const promptBoxH = 44 + promptLines.length * 24;
  const termY = promptY + promptBoxH + 18;
  const termHeaderH = 48;
  const lineH = 26;
  const termBodyH = Math.max(1, termRows.length) * lineH + 22;
  const termBoxH = termHeaderH + termBodyH;
  const footerY = termY + termBoxH + 34;
  const totalH = footerY + 40;

  const promptSvg = promptLines
    .map(
      (line, idx) =>
        `<text x="72" y="${promptY + 46 + idx * 24}" font-family="-apple-system, BlinkMacSystemFont, 'PingFang SC', sans-serif" font-size="16" fill="#F8FAFC">${escXml(line)}</text>`,
    )
    .join('\n  ');

  const termSvg = termRows
    .map(
      (row, idx) =>
        `<text x="72" y="${termY + termHeaderH + 26 + idx * lineH}" font-family="ui-monospace, SFMono-Regular, Menlo, monospace" font-size="14" fill="${row.color}">${escXml(row.text)}</text>`,
    )
    .join('\n  ');

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="${totalH}" viewBox="0 0 1200 ${totalH}">
  <defs>
    <pattern id="grid" width="32" height="32" patternUnits="userSpaceOnUse">
      <path d="M 32 0 L 0 0 0 32" fill="none" stroke="#1E293B" stroke-width="1"/>
    </pattern>
  </defs>
  <rect width="1200" height="${totalH}" fill="#0E1526"/>
  <rect width="1200" height="${totalH}" fill="url(#grid)" opacity="0.55"/>
  <rect x="28" y="28" width="1144" height="${totalH - 56}" rx="18" fill="#0F172A" fill-opacity="0.86" stroke="#24324D" stroke-width="1.5"/>

  <text x="56" y="74" font-family="-apple-system, BlinkMacSystemFont, 'PingFang SC', sans-serif" font-size="15" fill="#94A3B8" font-weight="600">SOIA · ${escXml(domainLabel)} · ${escXml(title)}</text>
  <text x="56" y="114" font-family="ui-monospace, SFMono-Regular, Menlo, monospace" font-size="28" fill="#4ADE80" font-weight="700">${escXml(doc.name)}</text>
  <rect x="980" y="64" width="164" height="34" rx="17" fill="#132A23" stroke="#22C55E" stroke-opacity="0.45"/>
  <text x="1062" y="86" text-anchor="middle" font-family="ui-monospace, Menlo, monospace" font-size="13" fill="#4ADE80" font-weight="600">${ver ? `${escXml(ver)} · ` : ''}MIT</text>

  <line x1="56" y1="146" x2="1144" y2="146" stroke="#1E293B" stroke-width="1.5"/>

  <rect x="56" y="${promptY}" width="1088" height="${promptBoxH}" rx="12" fill="#131F38" stroke="#253657"/>
  <text x="72" y="${promptY + 24}" font-family="ui-monospace, Menlo, monospace" font-size="12" fill="#38BDF8" font-weight="600">${zh ? 'USER PROMPT / 你只需要这样说' : 'USER PROMPT'}</text>
  ${promptSvg}

  <rect x="56" y="${termY}" width="1088" height="${termBoxH}" rx="14" fill="#0B111E" stroke="#293856" stroke-width="1.5"/>
  <circle cx="80" cy="${termY + 22}" r="6" fill="#EF4444"/>
  <circle cx="100" cy="${termY + 22}" r="6" fill="#F59E0B"/>
  <circle cx="120" cy="${termY + 22}" r="6" fill="#22C55E"/>
  <text x="144" y="${termY + 27}" font-family="ui-monospace, Menlo, monospace" font-size="13" fill="#94A3B8">${escXml(sample.title)}</text>
  <text x="1124" y="${termY + 27}" text-anchor="end" font-family="ui-monospace, Menlo, monospace" font-size="11" fill="#64748B">${zh ? '格式示例 · Example' : 'Sample Output'}</text>
  <line x1="56" y1="${termY + 42}" x2="1144" y2="${termY + 42}" stroke="#1E293B"/>
  ${termSvg}

  <text x="56" y="${footerY}" font-family="-apple-system, BlinkMacSystemFont, 'PingFang SC', sans-serif" font-size="15" fill="#4ADE80" font-weight="600">✓ ${escXml(sample.footer)}</text>
  <text x="1144" y="${footerY}" text-anchor="end" font-family="ui-monospace, Menlo, monospace" font-size="13" fill="#64748B">github.com/soia-team</text>
</svg>`;
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
}

export function SkillDetailPage({ locale, slug, skill }: { locale: LandingLocaleCode; slug: string; skill: string }) {
  const href = (path: string) => hrefFor(path, locale);
  const zh = isZh(locale);
  const t = <T,>(zhV: T, enV: T, jaV: T) => t3(locale, zhV, enV, jaV);
  const domain = domainOf(slug);
  const doc = SKILL_DOCS.find((item) => item.name === skill && item.domain === slug);
  if (!domain || !doc) return null;

  const domainLabel = pick(locale, domain.name);
  const subcat = subcategoryOf(slug, doc.name);
  const subcatLabel = subcat ? pick(locale, subcat.label) : '';
  const friendlyTitle = pick(locale, doc.title);
  const mechanism = zh ? doc.mechanism.zh : doc.mechanism.en;
  const capabilities = zh ? doc.capabilities.zh : doc.capabilities.en;
  const prompts = zh ? doc.prompts.zh : doc.prompts.en;
  const trust = zh ? doc.trust.zh : doc.trust.en;
  const heroVisualUrl = buildSkillHeroCardDataUrl(doc, domainLabel, zh);
  const subSiblings = subcat
    ? skillsOf(slug).filter((s) => s.name !== doc.name && subcat.skills.includes(s.name))
    : [];
  const otherDomainSkills = skillsOf(slug).filter(
    (s) => s.name !== doc.name && !subSiblings.some((x) => x.name === s.name),
  );
  const related = [...subSiblings, ...otherDomainSkills].slice(0, 3);

  return (
    <SubpageLayout active="plugins" locale={locale}>
      <nav className="breadcrumb" aria-label="breadcrumb">
        <a href={href('/skills/')}>{t('开源技能', 'Open skills', '公開スキル')}</a><span>/</span>
        <a href={href(`/skills/${slug}/`)}>{domainLabel}</a><span>/</span>
        <span aria-current="page">{doc.name}</span>
      </nav>

      <article className="plugin-detail-page">
        <div className="skd-hero-grid">
          <header className="plugin-detail-head" style={{ marginBottom: 0 }}>
            <span className="plugins-eyebrow">
              {domain.plugin} · {domainLabel}{subcatLabel ? ` · ${subcatLabel}` : ''}{doc.version ? ` · v${doc.version}` : ''}
            </span>
            <h1 className="display">{friendlyTitle}<span className="dot">.</span></h1>
            <p className="lead">{zh ? doc.tagline : pick(locale, doc.pain)}</p>
            <div className="sk-card-tags" style={{ marginBottom: 18 }}>
              {HOT_SKILLS.has(doc.name) ? <HotBadge locale={locale} /> : null}
              <span className={`sk-tag-domain is-${domain.slug}`}>{domainLabel}</span>
              {subcatLabel ? <span className="sk-tag-sub">{subcatLabel}</span> : null}
              <span className="sk-tag-sub">MIT</span>
            </div>
            <div className="od-route-actions">
              <a className="btn btn-primary" href="#quickstart">{t('安装与示例 ↓', 'Install & Prompts ↓', '導入と実行例 ↓')}</a>
              <a className="btn btn-ghost" href={DOC_URL(doc.name)} target="_blank" rel="noreferrer noopener">{t('完整文档 ↗', 'Full doc ↗', 'ドキュメント ↗')}</a>
              <a className="btn btn-ghost" href={SRC_URL(domain.repo, doc.name)} target="_blank" rel="noreferrer noopener">SKILL.md ↗</a>
            </div>
          </header>

          <aside className="skd-inspect-card" aria-label={t('源文件摘要卡片', 'Source inspection summary', 'ソース要約カード')}>
            <div className="skd-inspect-head">
              <span>{t('源文件解读', 'SOURCE INSPECT', 'ソース解説')} · {doc.name.toUpperCase()}</span>
              <span className="skd-inspect-badge">SKILL.MD</span>
            </div>
            <div className="skd-inspect-body">
              <div className="skd-inspect-item">
                <span>{t('解决什么痛点', 'Task / Pain', '解決する課題')}</span>
                <p><Inline text={pick(locale, doc.pain)} /></p>
              </div>
              <div className="skd-inspect-item">
                <span>{t('方案与产出', 'Solution / Output', '仕組みと出力')}</span>
                <p><Inline text={pick(locale, doc.solution)} /></p>
              </div>
              <div className="skd-inspect-item">
                <span>{t('安装与执行边界', 'Scope & Guardrails', '適用スコープ')}</span>
                <p>{t('默认项目级 .agents/skills/ 单技能安装；风险操作需先确认。', 'Project-scoped single skill install under .agents/skills/; explicit consent on side effects.', '既定はプロジェクト単位の導入。副作用のある操作は事前確認を行います。')}</p>
              </div>
            </div>
            <div className="skd-inspect-foot">
              {t('真源', 'Source', '一次情報')}: {domain.plugin}/skills/{doc.name}
            </div>
          </aside>
        </div>

        <div className="skd-meta-strip">
          <div className="skd-meta-cell">
            <span>{t('所属领域', 'Domain', '領域')}</span>
            <strong>{domainLabel}{subcatLabel ? ` · ${subcatLabel}` : ''}</strong>
          </div>
          <div className="skd-meta-cell">
            <span>{t('开源许可', 'License', 'ライセンス')}</span>
            <strong>MIT</strong>
          </div>
          <div className="skd-meta-cell">
            <span>{t('当前版本', 'Version', 'バージョン')}</span>
            <strong>{doc.version ? `v${doc.version}` : 'main'}</strong>
          </div>
          <div className="skd-meta-cell">
            <span>{t('支持宿主', 'Supported Hosts', '対応ホスト')}</span>
            <strong>Claude Code · Codex · WorkBuddy</strong>
          </div>
        </div>

        <ZoomableFigure
          className="skill-hero-card"
          src={heroVisualUrl}
          alt={t(`${friendlyTitle}（${doc.name}）运行实况与产出预览`, `${friendlyTitle} (${doc.name}) live preview`, `${friendlyTitle} (${doc.name}) 実行プレビュー`)}
          locale={locale}
        />

        <div className="skd-layout" style={{ marginTop: 28 }}>
          <aside className="skd-toc">
            <span className="skd-toc-label">{t('本页目录', 'On this page', '目次')}</span>
            <a href="#overview">01 · {t('功能与工作机制', 'How it works', '機能とメカニズム')}</a>
            <a href="#scope">02 · {t('适用场景与边界', 'Scope & guardrails', '適用場面と境界')}</a>
            <a href="#quickstart">03 · {t('触发词与安装', 'Prompts & install', '実行例と導入')}</a>
            <a href="#source">04 · {t('来源与可信说明', 'Source & trust', 'ソースと信頼性')}</a>
            {related.length > 0 ? <a href="#related">05 · {t('同类技能推荐', 'Related skills', '関連スキル')}</a> : null}
          </aside>

          <div className="skd-main">
            <section className="skd-sec" id="overview">
              <div className="sk-section-eyebrow">
                <span className="sk-section-num">01</span>
                <span>{t('功能说明与工作机制', 'OVERVIEW & WORKFLOW', '機能概要と手順')}</span>
              </div>
              <h2>{t('为什么需要它，以及每一步怎么跑', 'The problem it solves & step-by-step execution', '課題と実行メカニズム')}</h2>

              <div className="skd-method-grid">
                <div className="skd-panel">
                  <h3>{t('核心解法与预期交付物', 'Approach & expected deliverables', '解法と期待される出力')}</h3>
                  <p className="skill-prose" style={{ margin: 0 }}><Inline text={pick(locale, doc.solution)} /></p>
                  <ul className="skd-deliver-list">
                    {capabilities.slice(0, 4).map((row) => (
                      <li key={row.want}>
                        <strong><Inline text={row.want} />：</strong><Inline text={row.outcome} />
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="skd-panel is-soft">
                  <h3>{t('分步机制（步步留痕）', 'Execution pipeline', 'ステップバイステップ手順')}</h3>
                  <ol className="skill-mech-steps">
                    {mechanism.steps.map((step, idx) => (
                      <li className="skill-mech-step" key={step.title}>
                        <span className="skill-mech-num">{idx + 1}</span>
                        <div>
                          <strong>{step.title}</strong>
                          <p><Inline text={step.desc} /></p>
                        </div>
                      </li>
                    ))}
                  </ol>
                </div>
              </div>
            </section>

            <section className="skd-sec" id="scope">
              <div className="sk-section-eyebrow">
                <span className="sk-section-num">02</span>
                <span>{t('适用场景与安全边界', 'USE CASES & GUARDRAILS', '適用範囲と安全境界')}</span>
              </div>
              <h2>{t('适用场景、能力对照与绝不越界规则', 'When to use it, capability matrix & hard guardrails', '対応ケースと厳守ガードレール')}</h2>

              <div className="skd-fit-grid">
                <div className="skd-fit-card is-good">
                  <span className="skd-fit-badge">✓ {t('适合的场景与输入目标', 'Good fit scenarios', '適している場面')}</span>
                  <ul className="skd-fit-list">
                    {capabilities.map((row) => (
                      <li key={row.want}>
                        <strong><Inline text={row.want} /></strong> — <Inline text={row.action} />
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="skd-fit-card is-guard">
                  <span className="skd-fit-badge">⚠ {t('硬性边界底线（绝不越界）', 'Hard guardrails', '厳守すべき安全境界')}</span>
                  <ul className="skd-fit-list">
                    {mechanism.guardrails.map((g) => (
                      <li key={g}><Inline text={g} /></li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="skill-table-wrap">
                <table className="skill-cap-table">
                  <thead>
                    <tr>
                      <th>{t('你想做什么', 'Goal', 'やりたいこと')}</th>
                      <th>{t('技能会怎么做', 'What the skill does', 'スキルの挙動')}</th>
                      <th>{t('你会看到什么', 'What you get', '出力結果')}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {capabilities.map((row) => (
                      <tr key={row.want}>
                        <td><strong><Inline text={row.want} /></strong></td>
                        <td><Inline text={row.action} /></td>
                        <td><Inline text={row.outcome} /></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>

            <section className="skd-sec" id="quickstart">
              <div className="sk-section-eyebrow">
                <span className="sk-section-num">03</span>
                <span>{t('快速上手', 'QUICKSTART & PROMPTS', 'クイックスタート')}</span>
              </div>
              <h2>{t('装好就能用：自然语言触发示例与安装命令', 'Trigger naturally & install at project scope', '自然な言葉での呼び出し例と導入コマンド')}</h2>

              <div className="skd-prompt-cards">
                {prompts.map((p) => (
                  <div className="skd-prompt-card" key={p}>
                    <span>“<Inline text={p} />”</span>
                    <CopyButton text={p.replace(/\*\*/g, '')} locale={locale} />
                  </div>
                ))}
              </div>

              <div id="install" style={{ display: 'grid', gap: 10, marginTop: 4 }}>
                {doc.install.length > 0 ? (
                  doc.install.map((cmd) => (
                    <div className="skd-cmd-box" key={cmd}>
                      <code>{cmd}</code>
                      <CopyButton text={cmd} locale={locale} />
                    </div>
                  ))
                ) : (
                  <p>{t('见完整文档的安装节。', 'See the install section in the full doc.', '詳細はフルドキュメントをご覧ください。')}</p>
                )}
                <div className="skd-cmd-box">
                  <code>{`python3 skills/soia-meta-skill-release/scripts/install_workbuddy_experts.py ${domain.plugin}`}</code>
                  <CopyButton text={`python3 skills/soia-meta-skill-release/scripts/install_workbuddy_experts.py ${domain.plugin}`} locale={locale} />
                </div>
                <p className="skill-prose" style={{ margin: 0 }}>
                  {t(
                    '默认项目级单技能（.agents/skills/）；如需按整域以插件模式（Claude Code / Codex）或角色化专家模式（WorkBuddy）安装，',
                    'Default is project-scoped single skill (.agents/skills/); for whole-domain Claude/Codex plugins or WorkBuddy role experts, see ',
                    '既定はプロジェクト単体導入（.agents/skills/）です。Claude/Codex プラグイン形式や WorkBuddy エキスパート形式の詳細は ',
                  )}
                  <a href={href('/skills/#install-modes')}>
                    {t('查看插件/专家安装说明 →', 'plugin & expert install guide →', '導入モード一覧 →')}
                  </a>
                </p>
              </div>
            </section>

            <section className="skd-sec" id="source">
              <div className="sk-section-eyebrow">
                <span className="sk-section-num">04</span>
                <span>{t('来源与可信边界', 'SOURCE & TRUST', 'ソース・ライセンス')}</span>
              </div>
              <h2>{t('源码位置、许可证与可信说明', 'Source provenance & safety commitments', 'ソース情報と検証基準')}</h2>

              <table className="skd-kv-table">
                <tbody>
                  <tr>
                    <th>{t('所属仓库', 'Repository', 'リポジトリ')}</th>
                    <td>
                      <a href={domain.repo} target="_blank" rel="noreferrer noopener">{domain.repo} ↗</a>
                    </td>
                  </tr>
                  <tr>
                    <th>{t('真源入口', 'Entry File', '一次ソース')}</th>
                    <td>
                      <a href={SRC_URL(domain.repo, doc.name)} target="_blank" rel="noreferrer noopener">skills/{doc.name}/SKILL.md ↗</a>
                    </td>
                  </tr>
                  <tr>
                    <th>{t('许可证', 'License', 'ライセンス')}</th>
                    <td>MIT</td>
                  </tr>
                  <tr>
                    <th>{t('宿主与安装域', 'Host Scope', '対応ホスト')}</th>
                    <td>Claude Code · Codex · WorkBuddy ({domain.plugin})</td>
                  </tr>
                </tbody>
              </table>

              <ul style={{ margin: 0, paddingLeft: 18, display: 'grid', gap: 6 }}>
                {trust.map((item) => (
                  <li key={item}><Inline text={item} /></li>
                ))}
              </ul>
            </section>

            {related.length > 0 ? (
              <section className="skd-sec" id="related">
                <div className="sk-section-eyebrow">
                  <span className="sk-section-num">05</span>
                  <span>{t('继续探索', 'RELATED SKILLS', '関連スキル')}</span>
                </div>
                <h2>{t('同类与相邻技能推荐', 'More skills in this domain', '同じ領域のおすすめスキル')}</h2>
                <div className="sk-catalog-grid">
                  {related.map((item) => (
                    <SkillCatalogCard doc={item} locale={locale} key={item.name} />
                  ))}
                </div>
              </section>
            ) : null}
          </div>
        </div>
      </article>
    </SubpageLayout>
  );
}

/** SoiaDeck — desktop + mobile agent orchestration platform detail page. */
export function SoiaDeckPage({ locale }: { locale: LandingLocaleCode }) {
  const href = (path: string) => hrefFor(path, locale);
  const lang = langOf(locale);
  const t = <T,>(zhV: T, enV: T, jaV: T) => t3(locale, zhV, enV, jaV);
  const [heroTab, setHeroTab] = useState(0);
  const [agentFilter, setAgentFilter] = useState<'all' | 'supported' | 'experimental' | 'planned'>('all');
  const [themeIdx, setThemeIdx] = useState(0);

  const heroTabs: ReadonlyArray<{ label: string; src: string; alt: string; note: string }> =
    lang === 'zh'
      ? [
          {
            label: 'AI 作业台 · 多协议并行',
            src: '/soia/products/soiadeck-workbench.png',
            alt: 'SoiaDeck AI 作业台多会话并行视图',
            note: '在同一桌面工作台中并行调度 Claude Code、Codex 与多种 ACP / PTY Agent，对话由本地 daemon 持久化持有，关窗不断流。',
          },
          {
            label: '手机端 · 远程看 Diff 与审批',
            src: '/soia/products/soiadeck-phone.png',
            alt: 'SoiaDeck 手机端远程访问界面',
            note: '离开电脑也能用手机端实时看进度、核查改动 Diff、逐条批准或拒绝高危命令，或随时终止跑偏回合。',
          },
          {
            label: '中继通道 · 不在局域网也能连',
            src: '/soia/products/soiadeck-relay.png',
            alt: 'SoiaDeck 加密中继与多端连接监控',
            note: '跨网通过轻量加密中继建连，中继只做密文转发不解密对话内容；维护或断线重连 90 秒内自动续上。',
          },
          {
            label: '19 Agent 清单矩阵',
            src: '/soia/products/soiadeck-19-agents.png',
            alt: 'SoiaDeck 19 个 Coding Agent 接入矩阵',
            note: '以 agent-manifest-index.json 为真源：已接入 4 个正式支持、9 个 ACP 试验接入与 6 个计划接入 Agent。',
          },
        ]
      : lang === 'ja'
        ? [
            {
              label: 'AI 作業台 · マルチプロトコル',
              src: '/soia/products/soiadeck-workbench.png',
              alt: 'SoiaDeck AI 作業台マルチセッションビュー',
              note: '同一デスクトップ作業台から Claude Code / Codex / ACP・PTY Agent を並列実行。会話はローカル daemon が保持するためウィンドウを閉じても継続します。',
            },
            {
              label: 'モバイル · Diff 確認と承認',
              src: '/soia/products/soiadeck-phone.png',
              alt: 'SoiaDeck モバイルリモート管理画面',
              note: '席を離れていてもスマホから進捗確認、コード Diff レビュー、危険コマンドの承認・拒否、ターン即時停止が可能です。',
            },
            {
              label: '暗号化リレー · LAN 外接続',
              src: '/soia/products/soiadeck-relay.png',
              alt: 'SoiaDeck 暗号化リレー接続モニター',
              note: 'NAT 越しでも暗号文のみを転送する軽量リレー経由で接続。90 秒以内の自動再接続に対応します。',
            },
            {
              label: '19 Agent 対応マトリクス',
              src: '/soia/products/soiadeck-19-agents.png',
              alt: 'SoiaDeck 19 Coding Agent 接続一覧',
              note: 'agent-manifest-index.json を一次ソースとして正式対応 4、ACP 試験接続 9、予定 6 の計 19 エージェントを管理。',
            },
          ]
        : [
            {
              label: 'AI Workbench · Multi-agent',
              src: '/soia/products/soiadeck-workbench.png',
              alt: 'SoiaDeck AI Workbench multi-session view',
              note: 'Orchestrate Claude Code, Codex, and ACP/PTY agents side by side. Daemon-owned sessions keep running even when you close the window.',
            },
            {
              label: 'Mobile · Diffs & Approvals',
              src: '/soia/products/soiadeck-phone.png',
              alt: 'SoiaDeck mobile remote control surface',
              note: 'Follow agent turns, inspect file diffs, approve commands one by one, or stop a run right from your phone.',
            },
            {
              label: 'Encrypted Relay · Any network',
              src: '/soia/products/soiadeck-relay.png',
              alt: 'SoiaDeck encrypted relay monitor',
              note: 'Connect across networks via a lightweight zero-inspection encrypted relay with automatic 90s reconnect recovery.',
            },
            {
              label: '19-Agent Matrix',
              src: '/soia/products/soiadeck-19-agents.png',
              alt: 'SoiaDeck 19 coding agents matrix',
              note: 'Driven by agent-manifest-index.json: 4 supported, 9 experimental (ACP stdio), and 6 planned CLI adapters.',
            },
          ];

  const philosophyCards: ReadonlyArray<{ title: string; desc: string }> =
    lang === 'zh'
      ? [
          { title: 'Private · 本地优先', desc: '对话正文、秘钥与代码留在自己机器上；中继仅转发加密流量，核心桌面管理能力断网可用。' },
          { title: 'Daemon-backed · 永不断流', desc: '对话由本机后端 daemon 持有而非浏览器标签页，关闭界面继续跑，重开按缓冲实时重放。' },
          { title: 'Unified · 一致操控多协议', desc: '抹平 stream-json、app-server、ACP、pi-rpc 与 PTY 差异，切换 Agent 不用重新学一套工作流。' },
          { title: 'Permission-first · 权限可审计', desc: '执行命令、越界写入与联网请求必须先问人批准或拒绝，每次决策落盘会话树可追溯。' },
          { title: 'Composable · 组合现有生态', desc: '自带你已有的 Agent 订阅账号与 CLI，叠加 47 个公开 SOIA 技能和本机 MLX 模型即可工作。' },
          { title: 'Honest · 实事求是交付', desc: '现阶段明确仅发布 macOS arm64 验收安装包与 19 Agent 分级状态，未验收能力绝不虚标。' },
        ]
      : lang === 'ja'
        ? [
            { title: 'Private · ローカルファースト', desc: '会話本文、鍵、コードは自分のマシンに保持。リレーは暗号化パケットのみを中継し、主要機能はオフラインでも動作します。' },
            { title: 'Daemon-backed · セッション永続化', desc: '実行ループはブラウザタブではなくローカル daemon が保有。画面を閉じても継続し、再接続時にバッファを再生します。' },
            { title: 'Unified · プロトコル差異を吸収', desc: 'stream-json / app-server / ACP / pi-rpc / PTY の違いを吸収し、Agent を切り替えても同じ操作感で使えます。' },
            { title: 'Permission-first · 監査可能な権限管理', desc: 'コマンド実行・領域外書き込み・外部通信は事前の人間承認を必須とし、すべての判断をセッション記録に残します。' },
            { title: 'Composable · 既存エコシステムと連携', desc: 'お手持ちの CLI サブスクリプションとローカル .agents/skills（47 公開スキル）、MLX モデルをそのまま組み合わせ可能。' },
            { title: 'Honest · 誇張のないステータス表記', desc: '現在は macOS arm64 配布対象と 19 エージェントの正確な対応状況をそのまま開示し、未検証機能を謳いません。' },
          ]
        : [
            { title: 'Private · Local-first', desc: 'Sessions, keys, and repos stay on your machines; the relay forwards ciphertext only and core controls work offline.' },
            { title: 'Daemon-backed · Persistent', desc: 'The local daemon owns running turns; close the window safely and replay buffered output anytime.' },
            { title: 'Unified · Protocol-agnostic', desc: 'Consistent UX across stream-json, app-server, ACP, pi-rpc, and PTY without re-learning tools.' },
            { title: 'Permission-first · Auditable', desc: 'Commands, out-of-workspace writes, and network calls ask first and persist every decision in the session record.' },
            { title: 'Composable · Zero Lock-in', desc: 'Bring your own CLI subscriptions, local skills (.agents/skills), and Apple Silicon MLX models.' },
            { title: 'Honest · Grounded Scope', desc: 'Currently ships macOS arm64 builds and reports exact agent readiness rather than fake promises.' },
          ];

  const P = '/soia/products/';
  type Feature = { id: string; kicker: string; title: string; body: string; points: string[]; img: string; alt: string; preview?: boolean; extraIds?: string[] };
  const features: ReadonlyArray<Feature> = [
    {
      id: 'workbench',
      kicker: t('作业台', 'Workbench', '作業台'),
      title: t('所有 Agent 对话，在一张桌面上并行', 'Every agent conversation, side by side on one desktop', 'すべての Agent セッションを一つのデスクトップで並列に'),
      body: t(
        '在桌面应用里开 Claude Code、Codex 等对话。每种 Agent 走自己的原生协议，没有原生协议的走 ACP 或终端 PTY，操作方式是同一套。',
        'Open Claude Code, Codex and other agents in the desktop app. Each one speaks its native protocol — or ACP, or a PTY — while you keep a single way of working.',
        'Claude Code や Codex などをデスクトップアプリで起動。各 Agent はネイティブプロトコル（なければ ACP / PTY）で動き、操作は一つに統一されます。',
      ),
      points: [
        t('对话由本机后端持有：关掉窗口 Agent 继续跑，重开从缓冲重放', 'The local daemon owns the session: close the window and the agent keeps running, reopen and it replays from the buffer', 'セッションはローカル daemon が保持。ウィンドウを閉じても実行が続き、再表示時にバッファから再生'),
        t('项目、工作树、分支就在输入框上方，不用另开终端', 'Project, worktree and branch sit right above the composer — no extra terminal', 'プロジェクト・Worktree・ブランチは入力欄のすぐ上。別ターミナル不要'),
        t('运行中可以继续排队发消息，本轮结束后按顺序投递', 'Queue follow-up messages while a turn is running; they are delivered in order afterwards', '実行中でも次のメッセージをキューに追加でき、ターン終了後に順番に送信'),
      ],
      img: P + 'soiadeck-wb-session.webp',
      alt: t('SoiaDeck 作业台：会话、排队消息与输入框', 'SoiaDeck workbench: session, queued messages and composer', 'SoiaDeck 作業台：セッション、キュー、入力欄'),
    },
    {
      id: 'factory',
      kicker: t('工坊与项目', 'Workshops & projects', 'ワークショップとプロジェクト'),
      title: t('一条侧栏，看清每个项目卡在哪', 'One sidebar that shows where every project is waiting', 'サイドバー一本で、各プロジェクトの待ち状態がわかる'),
      body: t(
        '左侧工坊切换工作区，下面是插件、作业台、本地 LLM、AI 网络四个入口。项目按仓库分组，每行直接显示待审批和待处理数量。',
        'Switch workshops on the left rail; plugins, workbench, local LLM and AI network sit below. Projects are grouped by repository, with pending approvals and tasks counted on each row.',
        '左レールでワークショップを切り替え、その下にプラグイン・作業台・ローカル LLM・AI ネットワーク。プロジェクトはリポジトリ別にまとまり、承認待ちと未処理数を行ごとに表示します。',
      ),
      points: [
        t('会话行显示这条对话用过哪些 Agent，当前的在最前', 'Each session row shows which agents it has used, current one first', '各セッション行に、使った Agent のアイコンを表示（現在のものが先頭）'),
        t('常驻的 DeckBot 可以分组，拖动整理', 'Long-running DeckBots can be grouped and reordered by drag', '常駐する DeckBot はグループ化でき、ドラッグで並べ替え'),
        t('运行中的会话标题有一道从左到右的扫光，不用点进去也知道在跑', 'A running session title carries a left-to-right shimmer, so you can tell without opening it', '実行中のセッションはタイトルに光が流れ、開かなくても状態がわかる'),
      ],
      img: P + 'soiadeck-wb-bots.webp',
      alt: t('SoiaDeck 二级栏：DeckBot 分组与项目会话列表', 'SoiaDeck sidebar: DeckBot groups and project sessions', 'SoiaDeck サイドバー：DeckBot グループとプロジェクトのセッション'),
      preview: true,
    },
    {
      id: 'approvals',
      kicker: t('权限审批', 'Approvals', '権限承認'),
      title: t('动手之前先问你，每次决定都留痕', 'It asks before it acts, and every decision is recorded', '実行前に必ず確認し、すべての判断を記録'),
      body: t(
        '要执行命令、写工作区外的文件、联网之前，Agent 会停下来等你。首页把所有项目里等你处理的事集中在一处。',
        'Before running a command, writing outside the workspace or going online, the agent stops and waits. The home view gathers everything that is waiting on you across projects.',
        'コマンド実行・ワークスペース外への書き込み・外部通信の前に、Agent は止まってあなたを待ちます。ホームには全プロジェクトの対応待ちがまとまります。',
      ),
      points: [
        t('逐次允许、本对话内允许，或拒绝', 'Allow once, allow for this conversation, or deny', '今回のみ許可／この会話で許可／拒否'),
        t('多条待审批逐张处理，不会一键放行一批', 'Handle a batch card by card — there is no approve-all shortcut', '複数の承認は一件ずつ処理。一括許可はありません'),
        t('每一次决定都进会话记录，可以回放', 'Every decision lands in the session record and can be replayed', 'すべての判断はセッション記録に残り、再生できます'),
      ],
      img: P + 'soiadeck-home.png',
      alt: t('SoiaDeck 首页：主机状态与待处理审批', 'SoiaDeck home: host status and pending approvals', 'SoiaDeck ホーム：ホスト状態と承認待ち'),
    },
  ];

  const remoteCards = [
    { id: 'remote', title: t('手机端', 'On your phone', 'スマートフォン'), body: t('电脑开启远程访问或通过中继配对后，手机上可以看对话进度、看代码改动与 Diff、审批权限，或者直接停掉这一轮。', 'Pair over LAN or relay to follow running sessions, read diffs, approve permissions or stop a turn from your phone.', 'LAN またはリレーでペアリングし、進行中のセッション確認、Diff 閲覧、承認、ターン停止をスマホから。'), img: P + 'soiadeck-phone.png', alt: t('SoiaDeck 手机端', 'SoiaDeck on mobile', 'SoiaDeck モバイル') },
    { id: 'account', title: t('账号与名下主机', 'Account & bound hosts', 'アカウントと紐付けホスト'), body: t('账号网页支持邮箱验证码与 Passkey 登录，集中管理名下主机指纹、登录设备与中继流量；设备丢了可以标记丢失，收回授权。', 'Sign in with an email code or a Passkey to manage host fingerprints, signed-in devices and relay usage — and mark a lost device to revoke it.', 'メール認証または Passkey でログインし、ホスト指紋・端末・リレー通信量を一元管理。紛失端末は即時失効できます。'), img: P + 'soiadeck-account.png', alt: t('SoiaDeck 远程账号与名下主机', 'SoiaDeck account web', 'SoiaDeck アカウント管理') },
    { id: 'relay', title: t('中继服务', 'Relay', 'リレー'), body: t('不在同一局域网时，手机与电脑通过轻量中继建立加密通道。中继只转发密文、不看对话内容；维护期间 90 秒内自动续上。', 'Away from your LAN, desktop and phone meet through a light relay that forwards ciphertext only and reconnects within 90 seconds during maintenance.', '同一 LAN 外では軽量リレー経由で暗号化接続。リレーは暗号文を転送するだけで、メンテナンス時も 90 秒以内に自動再接続します。'), img: P + 'soiadeck-relay.png', alt: t('SoiaDeck 中继服务', 'SoiaDeck relay service', 'SoiaDeck リレー') },
  ];

  const machineCards = [
    { id: 'models', title: t('本地 LLM', 'Local LLM', 'ローカル LLM'), body: t('发现、启停、下载本机模型，并提供一个 OpenAI 兼容入口。推理引擎目前以 MLX 系为主，所以在 Apple Silicon 上最完整。作业台本身不依赖本地模型。', 'Discover, start, stop and download local models behind one OpenAI-compatible endpoint. Engines are mostly MLX today, so Apple Silicon is the most complete. The workbench does not depend on local models.', 'ローカルモデルの検出・起動・停止・ダウンロードと OpenAI 互換エンドポイント。現在は MLX 系が中心で Apple Silicon が最も充実。作業台自体はローカルモデルに依存しません。'), img: P + 'soiadeck-router.png', alt: t('SoiaDeck 本地 LLM 模型转发', 'SoiaDeck local LLM router', 'SoiaDeck ローカル LLM ルーター') },
    { id: 'network', title: t('AI 网络', 'AI network', 'AI ネットワーク'), body: t('本机访问各家 AI 服务走哪张网卡、连不连得通，一眼看清。核心管理能力断网可用。', 'See which interface the machine uses to reach each AI service and whether it gets through. Core management keeps working offline.', '各 AI サービスへの経路インタフェースと到達性をひと目で確認。主要な管理機能はオフラインでも動作します。'), img: P + 'soiadeck-net.png', alt: t('SoiaDeck AI 网络', 'SoiaDeck AI network', 'SoiaDeck AI ネットワーク') },
    { id: 'plugins', title: t('插件中心', 'Plugin center', 'プラグインセンター'), body: t('主机上装了哪些插件、各自什么状态、哪些需要你处理，集中在一页。', 'One page for which plugins are installed on the host, how each is doing and which need your attention.', 'ホストに入っているプラグイン、その状態、対応が必要なものを一ページに。'), img: P + 'soiadeck-plugins.png', alt: t('SoiaDeck 插件中心', 'SoiaDeck plugin center', 'SoiaDeck プラグインセンター') },
  ];

  const themes = [
    { key: 'pixel', name: t('像素 · 星夜', 'Pixel · Starry Night', 'ピクセル · 星夜'), note: t('像素星空、月亮、松林，一间亮着灯的小木屋', 'Pixel stars, a moon, pines and a cabin with the light on', 'ピクセルの星空と月、松林、灯りのともる小屋') },
    { key: 'pixel-day', name: t('像素 · 晴日', 'Pixel · Sunny Day', 'ピクセル · 晴日'), note: t('像素蓝天、飘着的云、绿丘和一架转着的风车', 'Pixel sky, drifting clouds, green hills and a turning windmill', 'ピクセルの青空、流れる雲、丘と回る風車') },
    { key: 'neon', name: t('霓虹 · 雨夜', 'Neon · Rainy Night', 'ネオン · 雨夜'), note: t('品红与青两色霓虹，远处天际线，斜落的雨丝', 'Magenta and cyan neon, a far skyline and slanting rain', 'マゼンタとシアンのネオン、遠い街並み、斜めの雨') },
    { key: 'astro', name: t('星图', 'Star Chart', '星図'), note: t('深蓝夜空，一架极慢转动的黄铜星盘，连线的星座', 'Deep blue sky, a slowly turning brass astrolabe and drawn constellations', '深い夜空、ゆっくり回る真鍮の星盤、星座の線') },
    { key: 'aurora', name: t('极光', 'Aurora', 'オーロラ'), note: t('雪山、湖、星，天上几道慢慢摆动的极光', 'Snow peaks, a lake, stars and slow curtains of aurora', '雪山と湖、星空、ゆっくり揺れるオーロラ') },
  ];
  const curTheme = themes[themeIdx] ?? themes[0];

  const stats = [
    { n: '19', l: t('个 Coding Agent 登记在册', 'coding agents tracked', '種の Coding Agent を登録') },
    { n: '4', l: t('个入口：桌面 / 手机 / 网页 / CLI', 'surfaces: desktop, phone, web, CLI', 'つの入口：デスクトップ / スマホ / Web / CLI') },
    { n: '5', l: t('种协议抹平成一套操作', 'protocols behind one way of working', '種のプロトコルを一つの操作に') },
    { n: '0', l: t('默认遥测，代码与密钥留在本机', 'telemetry by default; code and keys stay local', 'デフォルトのテレメトリ。コードと鍵はローカルに') },
  ];

  const navItems = [
    ['workbench', t('作业台', 'Workbench', '作業台')],
    ['approvals', t('审批', 'Approvals', '承認')],
    ['remote', t('远程与手机', 'Remote & mobile', 'リモート')],
    ['models', t('本机能力', 'On this machine', 'ローカル機能')],
    ['themes', t('主题', 'Themes', 'テーマ')],
    ['agents', t('19 个 Agent', '19 agents', '19 Agent')],
    ['philosophy', t('设计底线', 'Principles', '設計原則')],
    ['open', t('开源进度', 'Open-source status', '公開状況')],
  ] as const;

  const statusCols = [
    { h: t('今天', 'Today', '現在'), items: [t('私有仓，持续开发中', 'Private repository, under active development', 'プライベートリポジトリで開発中'), t('只发 macOS arm64 安装包', 'Only macOS arm64 installers are built for release', '配布ビルドは macOS arm64 のみ'), t('19 个 Agent：正式支持 4、试验接入 9、计划接入 6', '19 agents: 4 supported, 9 experimental, 6 planned', '19 Agent：正式対応 4・試験接続 9・予定 6')] },
    { h: t('接下来', 'Next', '今後'), items: [t('开源', 'Open-sourcing the repository', 'リポジトリの公開'), t('Agent 目录收口到单一真源，补齐启停排序、更新计划与活动账本', 'One source of truth for the agent catalog, with enable/order preferences, update plans and an activity ledger', 'Agent カタログの一元化（有効化・並び順、更新計画、アクティビティ台帳）'), t('本页标了「设计预览」的界面陆续进产品', 'Screens marked “Design preview” on this page land in the product over time', '「デザインプレビュー」と記した画面を順次製品へ')] },
    { h: t('不假装', 'Not claimed', '謳わないこと'), items: [t('Linux / Windows 有构建入口，但没验收、不发包', 'Linux and Windows have build entry points but are not verified or shipped', 'Linux / Windows はビルド入口のみで未検証・未配布'), t('官网不提供公开下载，直到真的可以下载', 'No public download here until there really is one', '実際に配布できるまで公開ダウンロードは置きません'), t('未验收的能力不标成已支持', 'Nothing unverified is labelled as supported', '未検証の機能を「対応済み」と表記しません')] },
  ];

  const previewTag = <span className="dk-preview-tag">{t('设计预览', 'Design preview', 'デザインプレビュー')}</span>;
  const currentTab = heroTabs[heroTab] ?? heroTabs[0];
  return (
    <SubpageLayout active="product" locale={locale}>
      <article className="missing-page dk-page">
        <nav className="breadcrumb" aria-label="breadcrumb">
          <a href={href('/')}>SOIA</a><span>/</span><span>SoiaDeck</span>
        </nav>

        <header className="dk-hero">
          <span className="label">{t('SOIA 家族 · 当前主角 · 即将开源', 'SOIA family · current lead · coming open source', 'SOIA ファミリー · 主力製品 · 近日公開予定')}</span>
          <h1 className="display">SoiaDeck</h1>
          <p className="dk-tagline">
            {t('你的 Coding Agent，都在这一张桌面上。', 'All your coding agents, on one desk.', 'あなたの Coding Agent を、一つのデスクに。')}
          </p>
          <p className="lead">
            {t(
              '跨端 AI 作业台：一个本机 daemon，加桌面、手机、网页和 CLI 四个入口。并行驱动 19 种 Coding Agent，权限审批、代码 Diff 和工作树在同一处处理——人在电脑前或拿着手机都行。',
              'A cross-device AI workbench: one local daemon with desktop, phone, web and CLI surfaces. Drive 19 coding agents in parallel and handle approvals, diffs and worktrees in one place — at your desk or from your phone.',
              'マルチデバイス AI 作業台：ローカル daemon 一つに、デスクトップ・スマホ・Web・CLI の四つの入口。19 種の Coding Agent を並列に動かし、承認・Diff・Worktree を一か所で扱えます。',
            )}
          </p>
          <div className="dk-cta">
            <a className="btn btn-primary" href="#workbench">{t('看它能做什么', 'See what it does', '機能を見る')}</a>
            <a className="btn btn-ghost" href="#agents">{t('19 个 Agent 接入清单', '19-agent matrix', '19 Agent 対応表')}</a>
            <a className="btn btn-ghost" href="#open">{t('开源进度', 'Open-source status', '公開状況')}</a>
          </div>
          <dl className="dk-stats">
            {stats.map((s) => (
              <div key={s.l}><dt>{s.n}</dt><dd>{s.l}</dd></div>
            ))}
          </dl>
        </header>

        <section className="deck-showcase" aria-label={t('SoiaDeck 场景切换演示', 'SoiaDeck interactive scene preview', 'SoiaDeck シーン切替プレビュー')}>
          <div className="deck-tab-bar" role="tablist">
            {heroTabs.map((tab, idx) => (
              <button type="button" role="tab" aria-selected={heroTab === idx} className={heroTab === idx ? 'is-active' : undefined} key={tab.label} onClick={() => setHeroTab(idx)}>
                {tab.label}
              </button>
            ))}
          </div>
          <ZoomableFigure src={currentTab.src} alt={currentTab.alt} locale={locale} />
          <p className="deck-showcase-caption">{currentTab.note}</p>
        </section>

        <nav className="dk-nav" aria-label={t('本页内容', 'On this page', '目次')}>
          {navItems.map(([id, label]) => (
            <a href={`#${id}`} key={id}>{label}</a>
          ))}
        </nav>

        <section className="dk-arch" id="works-with" aria-label={t('SoiaDeck 怎么搭起来', 'How SoiaDeck fits together', 'SoiaDeck の構成')}>
          <div className="dk-section-head">
            <span className="dk-kicker">{t('怎么搭起来', 'How it fits together', '全体の構成')}</span>
            <h2>{t('一个本机 daemon，四个入口，自带你已有的工具', 'One local daemon, four surfaces, and the tools you already have', 'ローカル daemon 一つ、四つの入口、そして手持ちのツール')}</h2>
            <p>
              {t(
                '不用重新买额度，也不用换工作流：直接复用本机已登录的 Claude Code、Codex、Gemini CLI、Antigravity、GitHub Copilot 等订阅，挂上本地 .agents/skills（包括 47 个开源 SOIA 技能），也可以叠加本机 MLX 模型。',
                'No quota reselling and no new workflow: reuse the Claude Code, Codex, Gemini CLI, Antigravity and Copilot subscriptions already signed in on your machine, mount local .agents/skills (including the 47 open SOIA skills) and add local MLX models if you like.',
                '新たな課金やワークフロー変更は不要。ログイン済みの Claude Code / Codex / Gemini CLI / Antigravity / GitHub Copilot をそのまま使い、ローカルの .agents/skills（47 の公開 SOIA スキルを含む）や MLX モデルも組み合わせられます。',
              )}
            </p>
          </div>
          <div className="dk-arch-diagram">
            <div className="dk-arch-col">
              <span className="dk-arch-cap">{t('你用的入口', 'Where you are', '入口')}</span>
              {[t('桌面应用', 'Desktop app', 'デスクトップアプリ'), t('手机', 'Phone', 'スマートフォン'), t('网页', 'Web', 'Web'), 'CLI'].map((x) => <span className="dk-arch-chip" key={x}>{x}</span>)}
            </div>
            <div className="dk-arch-core">
              <strong>SoiaDeck daemon</strong>
              <span>{t('跑在你自己的机器上', 'runs on your own machine', 'あなたのマシン上で動作')}</span>
              <ul>
                <li>{t('持有对话，可重放', 'owns sessions, replayable', 'セッションを保持・再生')}</li>
                <li>{t('权限审批与记录', 'approvals and records', '承認と記録')}</li>
                <li>{t('项目与工作树', 'projects and worktrees', 'プロジェクトと Worktree')}</li>
              </ul>
            </div>
            <div className="dk-arch-col">
              <span className="dk-arch-cap">{t('它替你驱动的', 'What it drives', '駆動する対象')}</span>
              {[t('19 个 Coding Agent', '19 coding agents', '19 種の Coding Agent'), 'stream-json · app-server · ACP · pi-rpc · PTY', t('本地 .agents/skills', 'Local .agents/skills', 'ローカル .agents/skills'), t('本机 MLX 模型', 'Local MLX models', 'ローカル MLX モデル')].map((x) => <span className="dk-arch-chip" key={x}>{x}</span>)}
            </div>
          </div>
          <p className="dk-arch-foot">{t('不在同一局域网时，手机经加密中继连回这台机器；中继只转发密文。', 'Away from your LAN, the phone reaches this machine through an encrypted relay that forwards ciphertext only.', '同一 LAN 外では、スマホは暗号化リレー経由でこのマシンに接続します。リレーは暗号文のみを転送します。')}</p>
        </section>

        {features.map((f, i) => (
          <section className={`dk-feature${i % 2 ? ' is-flip' : ''}`} id={f.id} key={f.id}>
            <div className="dk-feature-text">
              <span className="dk-kicker">{f.kicker}{f.preview ? previewTag : null}</span>
              <h2>{f.title}</h2>
              <p>{f.body}</p>
              <ul>{f.points.map((pt) => <li key={pt}>{pt}</li>)}</ul>
            </div>
            <ZoomableFigure src={f.img} alt={f.alt} locale={locale} lazy className="dk-shot" />
          </section>
        ))}

        <section className="dk-block">
          <div className="dk-section-head">
            <span className="dk-kicker">{t('远程与手机', 'Remote & mobile', 'リモートとモバイル')}</span>
            <h2>{t('离开座位，事情照样往前走', 'Step away from the desk and the work keeps moving', '席を離れても、作業は止まらない')}</h2>
          </div>
          <div className="dk-cards">
            {remoteCards.map((c) => (
              <article className="dk-card" id={c.id} key={c.id}>
                <ZoomableFigure src={c.img} alt={c.alt} locale={locale} lazy className="dk-shot" />
                <h3>{c.title}</h3>
                <p>{c.body}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="dk-block">
          <div className="dk-section-head">
            <span className="dk-kicker">{t('本机能力', 'On this machine', 'ローカル機能')}</span>
            <h2>{t('模型、网络和插件，也归这张桌面管', 'Models, network and plugins live on the same desk', 'モデル・ネットワーク・プラグインも同じデスクで')}</h2>
          </div>
          <div className="dk-cards">
            {machineCards.map((c) => (
              <article className="dk-card" id={c.id} key={c.id}>
                <ZoomableFigure src={c.img} alt={c.alt} locale={locale} lazy className="dk-shot" />
                <h3>{c.title}</h3>
                <p>{c.body}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="dk-block dk-themes" id="themes">
          <div className="dk-section-head">
            <span className="dk-kicker">{t('主题套装', 'Theme packs', 'テーマパック')}{previewTag}</span>
            <h2>{t('天天对着的界面，可以换一幅景', 'A screen you look at all day can change its scenery', '毎日見る画面だから、景色を変えられる')}</h2>
            <p>{t('一套主题 = 一组颜色加一幅会动的景，景全部用代码画。下面五套是设计预览，还没进产品；系统开了「减少动效」时不动。', 'A pack is a palette plus one animated scene, drawn entirely in code. These five are design previews and are not in the product yet; they stay still when the system asks for reduced motion.', 'テーマパックは配色と、コードで描いた動く景色のセット。下の五つはデザインプレビューで、まだ製品には入っていません。「視差効果を減らす」設定では静止します。')}</p>
          </div>
          <div className="deck-tab-bar" role="tablist">
            {themes.map((th, idx) => (
              <button type="button" role="tab" aria-selected={themeIdx === idx} className={themeIdx === idx ? 'is-active' : undefined} key={th.key} onClick={() => setThemeIdx(idx)}>{th.name}</button>
            ))}
          </div>
          <ZoomableFigure src={`${P}soiadeck-theme-${curTheme.key}.webp`} alt={`SoiaDeck · ${curTheme.name}`} locale={locale} lazy className="dk-shot" />
          <p className="deck-showcase-caption">{curTheme.note}</p>
        </section>

        <section className="dk-block" id="agents">
          <div className="dk-section-head">
            <span className="dk-kicker">{t('接入清单', 'Agent matrix', '対応表')}</span>
            <h2>{t('19 个 Coding Agent，各到哪一步都写明白', '19 coding agents, each with its real status', '19 種の Coding Agent、それぞれの本当の対応状況')}</h2>
            <p>{t('以 SoiaDeck 的静态清单（agent-manifest-index.json）为准：正式支持 4 个（stream-json / app-server / ACP / pi-rpc），试验接入 9 个（统一走 ACP stdio），计划接入 6 个。', 'Tracked in SoiaDeck’s agent-manifest-index.json: 4 supported (stream-json, app-server, ACP, pi-rpc), 9 experimental (all over ACP stdio) and 6 planned.', 'SoiaDeck の静的マニフェスト（agent-manifest-index.json）に基づき、正式対応 4（stream-json / app-server / ACP / pi-rpc）、試験接続 9（ACP stdio）、予定 6。')}</p>
          </div>
          <ZoomableFigure src={P + 'soiadeck-19-agents.png'} alt={t('SoiaDeck 已接入 19 个 Coding Agent 矩阵', 'SoiaDeck 19 coding agents', 'SoiaDeck 19 Coding Agents')} locale={locale} lazy className="dk-shot" />
          <div className="dk-agents missing-article">
                    <div className="agent-filter-bar" role="tablist" aria-label={t('按接入状态筛选 Agent', 'Filter agents by status', 'ステータス別に絞り込む')}>
                      {(
                        [
                          { id: 'all', label: t('全部', 'All', 'すべて'), count: CODING_AGENTS_19.length },
                          { id: 'supported', label: t('正式支持', 'Supported', '正式対応'), count: CODING_AGENTS_19.filter((a) => a.level === 'supported').length },
                          { id: 'experimental', label: t('试验接入', 'Experimental', '試験接続'), count: CODING_AGENTS_19.filter((a) => a.level === 'experimental').length },
                          { id: 'planned', label: t('计划接入', 'Planned', '対応予定'), count: CODING_AGENTS_19.filter((a) => a.level === 'planned').length },
                        ] as const
                      ).map((tab) => (
                        <button
                          type="button"
                          key={tab.id}
                          className={agentFilter === tab.id ? 'is-active' : undefined}
                          onClick={() => setAgentFilter(tab.id)}
                        >
                          {tab.label}
                          <span className="count">{tab.count}</span>
                        </button>
                      ))}
                    </div>
                    <ol className="agent-detail-list">
                      {CODING_AGENTS_19
                        .map((agent, origIdx) => ({ agent, origIdx }))
                        .filter(({ agent }) => agentFilter === 'all' || agent.level === agentFilter)
                        .map(({ agent, origIdx }) => {
                          const levelText =
                            agent.level === 'supported'
                              ? t('正式支持', 'Supported', '正式対応')
                              : agent.level === 'experimental'
                                ? t('试验接入', 'Experimental', '試験接続')
                                : t('计划接入', 'Planned', '対応予定');
                          return (
                            <li className="agent-detail-row" key={agent.id}>
                              <div className="agent-detail-top">
                                <div className="agent-detail-id">
                                  <span className="agent-detail-idx">{String(origIdx + 1).padStart(2, '0')}</span>
                                  <strong>{agent.name}</strong>
                                  <code>{agent.id}</code>
                                  {agent.cmd !== agent.id && <code>cmd: {agent.cmd}</code>}
                                </div>
                                <span className={`agent-level-badge is-${agent.level}`}>{levelText}</span>
                              </div>
                              <div className="agent-detail-meta">
                                <span><strong>{t('协议', 'Protocol', 'プロトコル')}:</strong> {pick(locale, agent.protocol)}</span>
                                <span><strong>{t('版本', 'Version', 'バージョン')}:</strong> {pick(locale, agent.version)}</span>
                                <span><strong>{t('认证', 'Auth', '認証')}:</strong> {pick(locale, agent.auth)}</span>
                              </div>
                              <p className="agent-detail-desc">{pick(locale, agent.detail)}</p>
                            </li>
                          );
                        })}
                    </ol>
          </div>
        </section>

        <section className="dk-block" id="philosophy">
          <div className="dk-section-head">
            <span className="dk-kicker">{t('设计底线', 'Principles', '設計原則')}</span>
            <h2>{t('站在你、代码和密钥之间的工具，必须中立可审查', 'A tool that sits between you, your code and your keys has to stay neutral and auditable', 'あなたとコード、鍵の間に立つツールは、中立で監査可能でなければならない')}</h2>
          </div>
          <div className="deck-philosophy-grid">
            {philosophyCards.map((card) => (
              <div className="deck-philosophy-card" key={card.title}>
                <strong>{card.title}</strong>
                <p>{card.desc}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="dk-block" id="open">
          <div className="dk-section-head">
            <span className="dk-kicker">{t('开源进度', 'Open-source status', '公開状況')}</span>
            <h2>{t('即将开源。到哪一步，说哪一步', 'Coming open source — and we say exactly where it stands', '近日公開予定。現在地をそのまま伝えます')}</h2>
          </div>
          <div className="dk-status">
            {statusCols.map((c) => (
              <div className="dk-status-col" key={c.h}>
                <strong>{c.h}</strong>
                <ul>{c.items.map((it) => <li key={it}>{it}</li>)}</ul>
              </div>
            ))}
          </div>
          <div className="missing-cta">
            <a className="btn btn-primary" href={href('/skills/')}>{t('先用上开源技能', 'Start with the open skills', 'まず公開スキルを使う')}</a>
            <a className="btn btn-ghost" href={href('/soia/')}>SOIA Runtime</a>
            <a className="btn btn-ghost" href={href('/soiacode/')}>SoiaCode</a>
          </div>
        </section>
      </article>
    </SubpageLayout>
  );
}

/** SoiaCode (si) — native HTML interactive architecture diagrams grounded in soiacode/docs. */
function SoiaCodeProductDiagram({ locale }: { locale: LandingLocaleCode }) {
  const t = <T,>(zhV: T, enV: T, jaV: T) => t3(locale, zhV, enV, jaV);
  return (
    <section className="sc-diagram sc-hero-diagram" aria-label={t('SoiaCode 五层产品架构', 'SoiaCode 5-layer product architecture', 'SoiaCode 5 層アーキテクチャ')}>
      <div className="sc-diagram-head">
        <span className="sc-diagram-title">{t('PRODUCT ARCHITECTURE · 五层产品架构总览', 'PRODUCT ARCHITECTURE · 5-LAYER OVERVIEW', 'PRODUCT ARCHITECTURE · 5 層アーキテクチャ概要')}</span>
        <span className="sc-diagram-sub">{t('人守住注意力 · 系统守住安全', 'Humans guard attention · System guards safety', '人は注意力を守り · システムは安全を守る')}</span>
      </div>

      <div className="sc-band is-cyan">
        <div className="sc-band-head">
          <span className="sc-band-tag">{t('L4 之外 · 调用方（谁在用 si）', 'CALLERS · WHO DRIVES SI', 'CALLERS · si の呼び出し元')}</span>
          <span className="sc-band-note">{t('开发者交互 / CI 脚本 / 编辑器 / 后台 / 其他 Agent', 'Humans / Scripts / Editors / Services / External Agents', '対話端末 / CI スクリプト / エディタ / サービス / 他 Agent')}</span>
        </div>
        <div className="sc-node-grid cols-3">
          <div className="sc-node">
            <strong>{t('人（终端交互）', 'Human CLI', '開発者（対話 CLI）')}</strong>
            <span>{t('日常编码 + 关键审批', 'Daily coding + approvals', '日常コーディング＋承認')}</span>
          </div>
          <div className="sc-node">
            <strong>{t('应用与编辑器', 'Apps & Editors', 'アプリ・エディタ連携')}</strong>
            <span>{t('CI 脚本 / Zed ACP / 图形壳 RPC / Rust 嵌入', 'CI print / Zed ACP / GUI RPC / Rust embed', 'CI print / Zed ACP / GUI RPC / Rust 組込')}</span>
          </div>
          <div className="sc-node">
            <strong>{t('其他 Agent', 'External Agents', '外部 Agent')}</strong>
            <span>{t('经子工具或 MCP / A2A 调用 si', 'Call si via print, RPC, MCP, or A2A', 'print / RPC / MCP / A2A 経由で si を呼出')}</span>
          </div>
        </div>
      </div>

      <div className="sc-arrow-down">↓</div>

      <div className="sc-band is-slate">
        <div className="sc-band-head">
          <span className="sc-band-tag">{t('入口层 · 4 种运行方式 + 1 个 Rust 库', 'ENTRYPOINTS · 4 RUN MODES + 1 SDK', 'ENTRYPOINTS · 4 実行モード + 1 SDK')}</span>
        </div>
        <div className="sc-node-grid">
          <div className="sc-node"><strong>si</strong><span>{t('终端交互 Line-mode TUI', 'Interactive CLI', '対話 Line-mode TUI')}</span></div>
          <div className="sc-node"><strong>si -p</strong><span>{t('Print 单次脚本输出', 'One-shot print mode', '単発スクリプト出力')}</span></div>
          <div className="sc-node"><strong>--mode rpc</strong><span>{t('stdio JSON-RPC 长期驱动', 'Long-lived stdio RPC', '常駐 stdio JSON-RPC')}</span></div>
          <div className="sc-node"><strong>--mode acp</strong><span>{t('Zed 等编辑器接入', 'Editor ACP mode', 'エディタ ACP 接続')}</span></div>
          <div className="sc-node"><strong>soiacode-sdk</strong><span>{t('Rust 进程内嵌入门面', 'In-process Rust crate', 'Rust 組込みクレート')}</span></div>
        </div>
      </div>

      <div className="sc-arrow-down">↓</div>

      <div className="sc-band is-amber">
        <div className="sc-band-head">
          <span className="sc-band-tag">{t('内核核心（L0–L2）+ 内置能力（L3）', 'MINIMAL KERNEL (L0–L2) + BUILT-IN CAPABILITIES (L3)', '最小カーネル (L0–L2) + 組込み機能 (L3)')}</span>
          <span className="sc-band-note">{t('极小、可审查、零遥测', 'Small, auditable, zero telemetry', '極小・監査可能・ゼロテレメトリ')}</span>
        </div>
        <div className="sc-node-grid cols-2">
          <div className="sc-node"><strong>{t('agent 循环 · L2', 'agent loop · L2', 'agent ループ · L2')}</strong><span>{t('上下文裁剪 · 压缩摘要 · Steer/FollowUp', 'Context trim · Compaction · Steer/FollowUp', '文脈トリム · 要約圧縮 · Steer/FollowUp')}</span></div>
          <div className="sc-node"><strong>{t('挂载点与审批 · 10 Hook', 'Mounts & approval · 10 hooks', 'マウントと承認 · 10 Hook')}</strong><span>{t('deny > ask > allow · 写保护路径拦截', 'deny > ask > allow · write-protected paths', 'deny > ask > allow · 保護パス遮断')}</span></div>
          <div className="sc-node"><strong>{t('JSONL 会话树 · L1', 'JSONL session tree · L1', 'JSONL セッション木 · L1')}</strong><span>{t('/tree 分支 · /fork 深拷贝 · Blob 旁路', '/tree branch · /fork copy · Blob offload', '/tree 分岐 · /fork 複製 · Blob 退避')}</span></div>
          <div className="sc-node"><strong>{t('5 工具 + 扩展宿主 · L3', '5 tools + ext host · L3', '5 ツール + 拡張ホスト · L3')}</strong><span>{t('read/write/edit/bash/grep · MCP 客户端 · 可选沙箱', 'read/write/edit/bash/grep · MCP client · opt sandbox', 'read/write/edit/bash/grep · MCP · 任意サンドボックス')}</span></div>
        </div>
      </div>

      <div className="sc-arrow-down">↓</div>

      <div className="sc-band is-emerald">
        <div className="sc-band-head">
          <span className="sc-band-tag">{t('外部 · 内核之外独立演化', 'PERIPHERAL · OUTSIDE THE KERNEL', '周辺機能 · カーネル外で独立進化')}</span>
          <span className="sc-band-note">JSON-RPC / stdio / HTTPS</span>
        </div>
        <div className="sc-node-grid">
          <div className="sc-node"><strong>{t('模型厂商', 'LLM Providers', 'LLM プロバイダー')}</strong><span>Anthropic / OpenAI / Gemini / Bedrock</span></div>
          <div className="sc-node"><strong>{t('34 个官方扩展', '34 Extensions', '34 公式拡張')}</strong><span>{t('独立子进程 · si install 按需装', 'Subprocesses via si install', '独立子プロセス · si install')}</span></div>
          <div className="sc-node"><strong>{t('自运行外围服务', 'Standalone Services', '独立周辺サービス')}</strong><span>si serve / mcp-server / a2a / inline</span></div>
          <div className="sc-node"><strong>soiacode-exec</strong><span>{t('SSH / 容器远端执行端（无凭据）', 'Remote exec endpoint (no creds)', 'SSH / コンテナ遠隔実行（鍵非保持）')}</span></div>
        </div>
      </div>
    </section>
  );
}

function SoiaCodeSystemDiagram({ locale }: { locale: LandingLocaleCode }) {
  const t = <T,>(zhV: T, enV: T, jaV: T) => t3(locale, zhV, enV, jaV);
  return (
    <div className="sc-diagram" aria-label={t('系统运行时单进程多会话数据流', 'System runtime process dataflow', 'システム単一プロセス内データフロー')}>
      <div className="sc-diagram-head">
        <span className="sc-diagram-title">{t('SYSTEM RUNTIME · 单 si 进程与外部边界', 'SYSTEM RUNTIME · SINGLE PROCESS & EXTERNAL IO', 'SYSTEM RUNTIME · 単一 si プロセスと外部境界')}</span>
        <span className="sc-diagram-sub">{t('多会话同进程隔离，所有落盘只追加 JSONL', 'Multi-session in one process, append-only JSONL', '同一プロセス内で複数セッション分離 · append-only JSONL')}</span>
      </div>

      <div className="sc-band is-violet">
        <div className="sc-band-head">
          <span className="sc-band-tag">{t('si 进程内（可同时承载多个互不干扰的会话）', 'INSIDE si PROCESS (MULTIPLE ISOLATED SESSIONS)', 'si プロセス内部（複数セッションを干渉なく同時保持）')}</span>
        </div>
        <div className="sc-node" style={{ justifySelf: 'center', minWidth: '220px', textAlign: 'center' }}>
          <strong>{t('入口调度 · 创建或恢复会话', 'Entrypoint · Create or resume session', 'エントリポイント · セッション生成/復元')}</strong>
          <span>{t('stdio (RPC/ACP) · 命令行参数 (print) · 进程内 (Rust SDK)', 'stdio (RPC/ACP) · args (print) · in-proc (Rust SDK)', 'stdio (RPC/ACP) · 引数 (print) · プロセス内 (Rust SDK)')}</span>
        </div>
        <div className="sc-bus-row">
          <div className="sc-node">
            <strong>{t('挂载点与审批', 'Mounts & Approval', 'マウント・承認ゲート')}</strong>
            <span>{t('每次工具/请求前后裁决', 'Gate every call & request', '全ツール/通信の前後を検証')}</span>
          </div>
          <div className="sc-bus-arrow">← {t('调用前后', 'hooks', 'フック')} →</div>
          <div className="sc-node" style={{ borderColor: '#8b5cf6', background: '#faf8ff' }}>
            <strong>{t('agent 主循环', 'agent loop', 'agent メインループ')}</strong>
            <span>{t('上下文拼接 · 回合控制 · 调度', 'Context · Turn loop · Dispatch', '文脈統合 · ターン制御 · 実行')}</span>
          </div>
          <div className="sc-bus-arrow">→ {t('每一步', 'every step', '各ステップ')} →</div>
          <div className="sc-node">
            <strong>{t('会话写入器', 'Session Writer', 'セッションライター')}</strong>
            <span>{t('追加到 ~/.soiacode/sessions/', 'Append to ~/.soiacode/sessions/', '~/.soiacode/sessions/ へ追記')}</span>
          </div>
        </div>
        <div className="sc-node-grid cols-3">
          <div className="sc-node">
            <strong>{t('模型客户端 (L1)', 'Provider Client (L1)', 'モデルクライアント (L1)')}</strong>
            <span>HTTPS {t('流式 → 模型厂商', 'stream → LLM Vendor', 'ストリーム → LLM 側')}</span>
          </div>
          <div className="sc-node">
            <strong>{t('内置工具 (L3)', 'Built-in Tools (L3)', '組込みツール (L3)')}</strong>
            <span>{t('管道 → 命令子进程', 'Pipe → Command subprocess', 'パイプ → コマンド子プロセス')}</span>
          </div>
          <div className="sc-node">
            <strong>{t('扩展宿主 (L3)', 'Extension Host (L3)', '拡張ホスト (L3)')}</strong>
            <span>JSON-RPC → {t('扩展 / MCP 子进程', 'Extensions / MCP', '拡張 / MCP 子プロセス')}</span>
          </div>
        </div>
      </div>

      <div className="sc-band is-amber">
        <div className="sc-band-head">
          <span className="sc-band-tag">{t('外部进程与持久化存储', 'EXTERNAL PROCESSES & DISK', '外部プロセスと永続ストレージ')}</span>
          <span className="sc-band-note">~/.soiacode/{'{sessions,audit,confirmed.json,crashes.jsonl}'}</span>
        </div>
        <div className="sc-node-grid">
          <div className="sc-node"><strong>{t('模型厂商 API', 'Model APIs', 'モデル API')}</strong><span>{t('仅经 soiacode-http 出站', 'Outbound solely via soiacode-http', 'soiacode-http 経由のみ通信')}</span></div>
          <div className="sc-node"><strong>{t('OS 命令子进程', 'OS Subprocesses', 'OS サブプロセス')}</strong><span>{t('仅经 soiacode-local 拉起', 'Spawned solely via soiacode-local', 'soiacode-local 経由のみ起動')}</span></div>
          <div className="sc-node"><strong>{t('扩展与 MCP', 'Ext & MCP', '拡張・MCP')}</strong><span>{t('独立进程，不享内核内存', 'Isolated OS processes', 'カーネルとメモリ空間を分離')}</span></div>
          <div className="sc-node"><strong>{t('本地磁盘 JSONL', 'Local Disk JSONL', 'ローカル JSONL')}</strong><span>{t('只追加记录 + Blob 文件', 'Append-only records + blobs', '追記専用ログ + Blob 退避')}</span></div>
        </div>
      </div>
    </div>
  );
}

function SoiaCodePeripheralDiagram({ locale }: { locale: LandingLocaleCode }) {
  const lang = langOf(locale);
  const t = <T,>(zhV: T, enV: T, jaV: T) => t3(locale, zhV, enV, jaV);
  const rows: ReadonlyArray<{ cmd: string; proto: string; role: string }> =
    lang === 'zh'
      ? [
          { cmd: 'si serve', proto: 'Unix socket / TCP+TLS', role: '常驻后台托管会话；复用 JSON-RPC 分派，分级 Token（read/prompt/approve/admin）管理跨终端接入。' },
          { cmd: 'si mcp-server', proto: 'stdio MCP', role: '把 si 包装为标准 MCP Server 供外部 Agent 调用（交任务 / 等待 / 取消 / 列会话），审批默认按规则或转交调用方。' },
          { cmd: 'si a2a', proto: 'HTTP + TLS + Token', role: '以 Agent2Agent 协议对外暴露 Agent Card；只听可信调用方 Token，触发的高危操作未预设放行一律拒绝。' },
          { cmd: 'si inline', proto: 'stdio LSP', role: '充当编辑器灰字行内补全语言服务器（si inline lsp）；不进长会话，默认屏蔽 .env 与密钥文件。' },
          { cmd: 'soiacode-exec', proto: 'SSH / 容器 stdio', role: '放到远端主机或容器里的轻量执行端；只依赖 local 与 protocol，按指令读写文件并起进程，不存用户凭据。' },
        ]
      : lang === 'ja'
        ? [
            { cmd: 'si serve', proto: 'Unix socket / TCP+TLS', role: '常駐バックグラウンドでセッションをホスト。read/prompt/approve/admin の権限別トークンで複数端末を保護。' },
            { cmd: 'si mcp-server', proto: 'stdio MCP', role: 'si を標準 MCP サーバーとして外部 Agent へ公開（投入 / 待機 / 取消 / 一覧）。承認は既定ルールまたは呼出元へ委譲。' },
            { cmd: 'si a2a', proto: 'HTTP + TLS + Token', role: 'Agent2Agent プロトコルで公開。信頼されたトークンのみ受理し、未許可の危険操作は即座に拒否。' },
            { cmd: 'si inline', proto: 'stdio LSP', role: 'エディタ用のインライン補完 LSP（si inline lsp）。長期セッションには残さず .env や鍵ファイルは既定で除外。' },
            { cmd: 'soiacode-exec', proto: 'SSH / コンテナ stdio', role: 'SSH 先やコンテナ内に配置する軽量ワーカー。local と protocol のみに依存しユーザー認証鍵は保持しません。' },
          ]
        : [
            { cmd: 'si serve', proto: 'Unix socket / TCP+TLS', role: 'Background daemon holding live sessions; exposes scoped tokens (read/prompt/approve/admin) across devices.' },
            { cmd: 'si mcp-server', proto: 'stdio MCP', role: 'Exposes si as a standard MCP server (submit / wait / cancel / list) for peer agents over stdio.' },
            { cmd: 'si a2a', proto: 'HTTP + TLS + Token', role: 'Exposes Agent2Agent discovery & task execution with per-caller tokens and strict approval rules.' },
            { cmd: 'si inline', proto: 'stdio LSP', role: 'Acts as an IDE LSP for FIM/chat inline completion; skips long session history and ignores .env/secret files.' },
            { cmd: 'soiacode-exec', proto: 'SSH / container stdio', role: 'Remote worker deployed inside SSH hosts or containers; only depends on local + protocol and holds zero credentials.' },
          ];
  return (
    <div className="sc-diagram" aria-label={t('外围独立运行程序交互架构', 'Standalone peripheral processes', '独立動作周辺バイナリの境界')}>
      <div className="sc-diagram-head">
        <span className="sc-diagram-title">{t('PERIPHERALS · 外围自运行程序边界', 'PERIPHERALS · STANDALONE BINARIES', 'PERIPHERALS · 独立バイナリの境界')}</span>
        <span className="sc-diagram-sub">{t('全为独立可执行/子命令，内核 si 本体不反向依赖它们', 'Separate binaries/subcommands — the kernel never depends backward on them', 'すべて独立バイナリ／サブコマンドであり、カーネル si から逆依存しません')}</span>
      </div>
      {rows.map((r) => (
        <div className="sc-periph-row" key={r.cmd}>
          <span className="sc-periph-cmd">{r.cmd}</span>
          <span className="sc-periph-proto">{r.proto}</span>
          <span className="sc-periph-role">{r.role}</span>
        </div>
      ))}
    </div>
  );
}

function SoiaCodeToolSequenceDiagram({ locale }: { locale: LandingLocaleCode }) {
  const lang = langOf(locale);
  const t = <T,>(zhV: T, enV: T, jaV: T) => t3(locale, zhV, enV, jaV);
  const [stepIdx, setStepIdx] = useState(0);
  const lanes = ['provider', 'dispatch', 'mounts', 'approval', 'writer', 'tools'] as const;
  const steps: ReadonlyArray<{ no: string; from: string; to: string; route: string; desc: string }> =
    lang === 'zh'
      ? [
          { no: '01', from: 'provider', to: 'dispatch', route: 'provider → dispatch', desc: '模型响应带出工具调用，已统一转换并校验为 protocol 的 ToolCall 类型。' },
          { no: '02', from: 'dispatch', to: 'mounts', route: 'dispatch → mounts', desc: '触发 before_tool_call 挂载点（策略 / 扩展可放行、拒绝或原地改写参数）。' },
          { no: '03', from: 'mounts', to: 'approval', route: 'mounts → approval', desc: '内置权限规则介入：拆分复合命令，按 deny > ask > allow 与写保护路径判定。' },
          { no: '04', from: 'approval', to: 'approval', route: 'approval [ask / never]', desc: '若判定需要确认：交互端弹窗等用户批准；无人值守 / never 策略直接视为拒绝。' },
          { no: '05', from: 'approval', to: 'writer', route: 'approval → writer', desc: '先把审批决定追加写入会话记录；若落盘失败则保守按拒绝处理，绝不无痕执行。' },
          { no: '06', from: 'dispatch', to: 'tools', route: 'dispatch → tools', desc: '放行后进入执行：文件工具做工作区路径核查；命令进入可选 OS 沙箱或远端执行端。' },
          { no: '07', from: 'tools', to: 'dispatch', route: 'tools → dispatch', desc: '返回工具执行原文输出（及沙箱/退出码诊断标记）。' },
          { no: '08', from: 'dispatch', to: 'mounts', route: 'dispatch → mounts', desc: '触发 after_tool_result：超长输出裁剪、Blob 旁路与 redact 脱敏处理。' },
          { no: '09', from: 'dispatch', to: 'writer', route: 'dispatch → writer', desc: '将处理后的 ToolResult（带大输出引用 id）追加进只读会话树。' },
          { no: '10', from: 'dispatch', to: 'provider', route: 'dispatch → provider', desc: '结果回填上下文前缀，发起下一轮模型推理请求。' },
        ]
      : lang === 'ja'
        ? [
            { no: '01', from: 'provider', to: 'dispatch', route: 'provider → dispatch', desc: 'モデルの ToolCall 応答を soiacode-protocol の標準型へ変換・検証。' },
            { no: '02', from: 'dispatch', to: 'mounts', route: 'dispatch → mounts', desc: 'before_tool_call フックを呼び出し、ポリシー／拡張が許可・拒否・引数書換えを判定。' },
            { no: '03', from: 'mounts', to: 'approval', route: 'mounts → approval', desc: '複合シェルコマンドを分割し、deny > ask > allow と保護パス規則で判定。' },
            { no: '04', from: 'approval', to: 'approval', route: 'approval [ask / never]', desc: '確認が必要な場合は対話プロンプトを表示。無人実行または never 設定は即座に拒否。' },
            { no: '05', from: 'approval', to: 'writer', route: 'approval → writer', desc: '実行前に承認判断を JSONL へ記録。記録失敗時は安全側（拒否）へ倒し無痕跡実行を禁止。' },
            { no: '06', from: 'dispatch', to: 'tools', route: 'dispatch → tools', desc: '許可後に実行：ワークスペース境界チェック、任意の OS サンドボックスまたは remote-exec へ。' },
            { no: '07', from: 'tools', to: 'dispatch', route: 'tools → dispatch', desc: '生の出力結果と終了コード・サンドボックス診断情報を返却。' },
            { no: '08', from: 'dispatch', to: 'mounts', route: 'dispatch → mounts', desc: 'after_tool_result フック：長大出力のトリム、Blob 退避、機密情報の redact 処理。' },
            { no: '09', from: 'dispatch', to: 'writer', route: 'dispatch → writer', desc: '圧縮済み ToolResult（Blob 参照 ID 含む）を append-only JSONL へ追記。' },
            { no: '10', from: 'dispatch', to: 'provider', route: 'dispatch → provider', desc: '結果を文脈へ戻し、次の推論ターンを開始。' },
          ]
        : [
            { no: '01', from: 'provider', to: 'dispatch', route: 'provider → dispatch', desc: 'Model response emits a ToolCall normalized into soiacode-protocol types.' },
            { no: '02', from: 'dispatch', to: 'mounts', route: 'dispatch → mounts', desc: 'Invoke before_tool_call mount (policy/extensions can allow, deny, or rewrite args).' },
            { no: '03', from: 'mounts', to: 'approval', route: 'mounts → approval', desc: 'Built-in rules split compound commands and evaluate deny > ask > allow & protected paths.' },
            { no: '04', from: 'approval', to: 'approval', route: 'approval [ask / never]', desc: 'If confirmation is required: ask interactively, or auto-deny under never / unattended.' },
            { no: '05', from: 'approval', to: 'writer', route: 'approval → writer', desc: 'Persist approval decision before running; write failure safely aborts as deny.' },
            { no: '06', from: 'dispatch', to: 'tools', route: 'dispatch → tools', desc: 'Execute inside workspace guard / optional OS sandbox / remote-exec endpoint.' },
            { no: '07', from: 'tools', to: 'dispatch', route: 'tools → dispatch', desc: 'Return raw execution output plus exit status and sandbox markers.' },
            { no: '08', from: 'dispatch', to: 'mounts', route: 'dispatch → mounts', desc: 'Invoke after_tool_result: trim noisy output, offload blobs, and redact secrets.' },
            { no: '09', from: 'dispatch', to: 'writer', route: 'dispatch → writer', desc: 'Append compact ToolResult (plus blob reference id) to append-only JSONL.' },
            { no: '10', from: 'dispatch', to: 'provider', route: 'dispatch → provider', desc: 'Feed result back into next provider turn.' },
          ];
  const cur = steps[stepIdx] ?? steps[0];
  return (
    <div className="sc-diagram" aria-label={t('单次工具调用审批全链路时序', 'Tool call sequence', 'ツール実行承認フロー時系列')}>
      <div className="sc-diagram-head">
        <span className="sc-diagram-title">{t('TOOL SEQUENCE · 单次工具调用全链路（10 步可点选推演）', 'TOOL SEQUENCE · 10-STEP INTERACTIVE WALKTHROUGH', 'TOOL SEQUENCE · 10 ステップ対話シーケンス')}</span>
        <div className="sc-seq-controls">
          <div className="sc-seq-btns">
            <button type="button" onClick={() => setStepIdx((s) => (s - 1 + steps.length) % steps.length)}>
              {t('上一步', 'Prev', '前へ')}
            </button>
            <button type="button" onClick={() => setStepIdx((s) => (s + 1) % steps.length)}>
              {t('下一步', 'Next', '次へ')}
            </button>
          </div>
        </div>
      </div>

      <div className="sc-lane-strip">
        {lanes.map((lane) => {
          const isSrc = cur.from === lane;
          const isDst = cur.to === lane && cur.to !== cur.from;
          const cls = `sc-lane${isSrc ? ' is-active' : ''}${isDst ? ' is-target' : ''}`;
          return <div className={cls} key={lane}>{lane}</div>;
        })}
      </div>

      <ol className="sc-seq-list">
        {steps.map((s, idx) => (
          <li key={s.no}>
            <button
              type="button"
              className={`sc-seq-item${idx === stepIdx ? ' is-selected' : ''}`}
              onClick={() => setStepIdx(idx)}
            >
              <span className="sc-seq-no">{s.no}</span>
              <span className="sc-seq-route">{s.route}</span>
              <span className="sc-seq-desc">{s.desc}</span>
            </button>
          </li>
        ))}
      </ol>
    </div>
  );
}

function SoiaCodeCrateDiagram({ locale }: { locale: LandingLocaleCode }) {
  const t = <T,>(zhV: T, enV: T, jaV: T) => t3(locale, zhV, enV, jaV);
  return (
    <div className="sc-diagram" aria-label={t('SoiaCode Crate 五层工程架构', 'SoiaCode Rust crate layers', 'SoiaCode Rust クレート 5 層構成')}>
      <div className="sc-diagram-head">
        <span className="sc-diagram-title">{t('WORKSPACE CRATES · 严格 L4 → L0 单向依赖矩阵', 'WORKSPACE CRATES · STRICT L4 → L0 HIERARCHY', 'WORKSPACE CRATES · 厳格な L4 → L0 単方向依存階層')}</span>
        <span className="sc-diagram-sub">{t('同层互不依赖，旁路与外围独立演进', 'No sibling coupling, strict IO isolation', '同階層依存なし · IO 境界の徹底分離')}</span>
      </div>

      <div className="sc-band is-cyan">
        <div className="sc-band-head"><span className="sc-band-tag">{t('L4 · 入口层（只接线）', 'L4 · ENTRYPOINTS', 'L4 · エントリポイント層')}</span></div>
        <div className="sc-node-grid cols-2">
          <div className="sc-node"><strong>soiacode</strong><span>{t('命令 si：组装各 crate 与运行模式', 'CLI binary & assembler', 'CLI si バイナリ統合')}</span></div>
          <div className="sc-node"><strong>soiacode-rpc / -acp</strong><span>{t('stdio JSON-RPC 与编辑器 ACP 协议适配', 'stdio JSON-RPC & ACP', 'stdio JSON-RPC / エディタ ACP')}</span></div>
          <div className="sc-node"><strong>soiacode-sdk</strong><span>{t('稳定 Rust 库门面（CLI/RPC/ACP 均建在其上）', 'Stable Rust embedding facade', '安定版 Rust 組込みファサード')}</span></div>
        </div>
      </div>

      <div className="sc-band is-violet">
        <div className="sc-band-head"><span className="sc-band-tag">{t('L3 · 能力层', 'L3 · CAPABILITIES', 'L3 · 機能層')}</span></div>
        <div className="sc-node-grid">
          <div className="sc-node"><strong>soiacode-tools</strong><span>{t('5 内置工具 + 本机环境', 'Built-in tools', '5 組込みツール')}</span></div>
          <div className="sc-node"><strong>soiacode-context</strong><span>{t('AGENTS.md / 规则来源', 'Context sources', 'AGENTS.md・規則読込')}</span></div>
          <div className="sc-node"><strong>soiacode-config</strong><span>{t('三级配置与 trust.json', 'Config & trust', '3 段階設定・trust.json')}</span></div>
          <div className="sc-node"><strong>soiacode-extension</strong><span>{t('扩展进程 / MCP / 远端环境宿主', 'Extension subprocess host', '拡張／MCP サブプロセスホスト')}</span></div>
        </div>
      </div>

      <div className="sc-band is-amber">
        <div className="sc-band-head"><span className="sc-band-tag">{t('L2–L1 · 内核与基础层', 'L2–L1 · CORE LOOP & FOUNDATIONS', 'L2–L1 · コアループ・基盤層')}</span></div>
        <div className="sc-node-grid">
          <div className="sc-node">
            <div className="sc-node-top"><strong>soiacode-agent</strong><span className="sc-badge core">L2 {t('内核', 'Core', 'コア')}</span></div>
            <span>{t('agent 循环与工具派发', 'Agent loop & dispatch', 'ループ制御とツール実行')}</span>
          </div>
          <div className="sc-node">
            <div className="sc-node-top"><strong>soiacode-provider</strong><span className="sc-badge core">L1 {t('内核', 'Core', 'コア')}</span></div>
            <span>{t('5 种 LLM 线协议（Gemini/Bedrock 可选 feature）', '5 wire protocols', '5 種 LLM プロトコル')}</span>
          </div>
          <div className="sc-node">
            <div className="sc-node-top"><strong>soiacode-session</strong><span className="sc-badge core">L1 {t('内核', 'Core', 'コア')}</span></div>
            <span>{t('JSONL 树存储与 Blob 旁路', 'JSONL store & blobs', 'JSONL 木記録と Blob 退避')}</span>
          </div>
          <div className="sc-node">
            <div className="sc-node-top"><strong>soiacode-mcp</strong><span className="sc-badge opt">L1</span></div>
            <span>{t('外部 MCP 客户端', 'MCP client', '外部 MCP クライアント')}</span>
          </div>
          <div className="sc-node">
            <div className="sc-node-top"><strong>soiacode-sandbox</strong><span className="sc-badge opt">L1 {t('可选', 'Opt', '任意')}</span></div>
            <span>{t('feature 默认关闭', 'Disabled by default', '既定無効 feature')}</span>
          </div>
        </div>
      </div>

      <div className="sc-band is-slate">
        <div className="sc-band-head"><span className="sc-band-tag">{t('L0 · 底层（唯一 IO 边界）与旁路', 'L0 · PRIMITIVES & BYPASS CRATES', 'L0 · 最下層（唯一の IO 境界）とバイパス')}</span></div>
        <div className="sc-node-grid cols-3">
          <div className="sc-node">
            <div className="sc-node-top"><strong>soiacode-http</strong><span className="sc-badge base">{t('唯一联网', 'HTTP', '通信境界')}</span></div>
            <span>{t('代理、自定义 CA、TLS、请求头脱敏', 'Proxy, custom CA, header redact', 'プロキシ・CA・ヘッダ秘匿')}</span>
          </div>
          <div className="sc-node">
            <div className="sc-node-top"><strong>soiacode-local</strong><span className="sc-badge base">{t('唯一本地IO', 'OS', 'OS 境界')}</span></div>
            <span>{t('原子写、路径解析、进程组起停', 'Atomic write, paths, process groups', '原子的書込・パス・プロセス管理')}</span>
          </div>
          <div className="sc-node">
            <div className="sc-node-top"><strong>soiacode-protocol</strong><span className="sc-badge core">{t('零 IO', 'Zero-IO', 'Zero-IO')}</span></div>
            <span>{t('全仓与扩展唯一类型真源', 'Single type source of truth', '全クレート唯一の型定義源')}</span>
          </div>
        </div>
        <div className="sc-node-grid cols-2">
          <div className="sc-node"><strong>{t('旁路（tui / testkit / eval）', 'Bypass (tui / testkit / eval)', 'バイパス（tui / testkit / eval）')}</strong><span>{t('仅限终端 UI、假厂商回放与离线评估，不反侵入内核', 'Optional TUI & offline harness/eval', '端末 UI・擬似再生・評価専用')}</span></div>
          <div className="sc-node"><strong>{t('外围（extkit / ext-* / svc-* / exec）', 'Peripherals (extkit / ext-* / svc-* / exec)', '周辺（extkit / ext-* / svc-* / exec）')}</strong><span>{t('只依赖 protocol，作为独立二进制与子进程演进', 'Depend only on protocol, evolve out-of-process', 'protocol のみに依存しプロセス外で進化')}</span></div>
        </div>
      </div>
    </div>
  );
}

/** SoiaCode (si) — architecture & specification detail page grounded in soiacode/docs. */
export function SoiaCodePage({ locale }: { locale: LandingLocaleCode }) {
  const href = (path: string) => hrefFor(path, locale);
  const lang = langOf(locale);
  const t = <T,>(zhV: T, enV: T, jaV: T) => t3(locale, zhV, enV, jaV);
  const toc: ReadonlyArray<{ id: string; label: string }> =
    lang === 'zh'
      ? [
          { id: 'what', label: '1. 它是做什么的' },
          { id: 'support', label: '2. 支持什么能力' },
          { id: 'boundaries', label: '3. 精确边界与安全' },
          { id: 'architecture', label: '4. 工程分层与隔离' },
          { id: 'roadmap', label: '5. 路线与当前进度' },
        ]
      : lang === 'ja'
        ? [
            { id: 'what', label: '1. 何をするか' },
            { id: 'support', label: '2. 対応機能・拡張' },
            { id: 'boundaries', label: '3. 厳密な境界と安全' },
            { id: 'architecture', label: '4. クレート階層と分離' },
            { id: 'roadmap', label: '5. ロードマップと現在地' },
          ]
        : [
            { id: 'what', label: '1. What it does' },
            { id: 'support', label: '2. What it supports' },
            { id: 'boundaries', label: '3. Exact boundaries' },
            { id: 'architecture', label: '4. Crate architecture' },
            { id: 'roadmap', label: '5. Roadmap & status' },
          ];

  return (
    <SubpageLayout active="product" locale={locale}>
      <article className="missing-page tutorial-detail">
        <nav className="breadcrumb" aria-label="breadcrumb">
          <a href={href('/')}>SOIA</a><span>/</span><span>SoiaCode</span>
        </nav>
        <header className="catalog-head">
          <span className="label">
            {t(
              'SOIA 家族 · 方案与架构设计阶段（0.0.1 M1 进行中 · MIT）',
              'SOIA family · architecture & design stage (0.0.1 M1 active · MIT)',
              'SOIA ファミリー · アーキテクチャ設計段階 (0.0.1 M1 進行中 · MIT)',
            )}
          </span>
          <h1 className="display">SoiaCode (si)</h1>
          <p className="lead">
            {t(
              '用 Rust 编写的轻量 Coding Agent 内核与命令行工具。核心宗旨是「人守住注意力，系统守住安全」（Your attention is all it needs.）——把极小、可审查、高确定性的循环与权限网关留在单二进制内核，把协作、常驻、浏览器、团队策略与远程执行全部解耦为独立扩展。',
              'A lightweight Rust coding agent kernel and CLI (si). Built around “humans guard attention, the system guards safety” (Your attention is all it needs.) — keeping a minimal, auditable agent loop and permission gateway in one static binary while decoupling daemons, team policies, browsers, and remote execution into extensions.',
              'Rust 製の軽量 Coding Agent カーネル兼 CLI（si）。「人が注意力を守り、システムが安全を守る」（Your attention is all it needs.）を掲げ、最小・監査可能なループと権限ゲートウェイを単一バイナリに閉じ、常駐サーバーやブラウザ操作・チーム方針・遠隔実行を拡張へと完全に疎結合化します。',
            )}
          </p>
        </header>

        <SoiaCodeProductDiagram locale={locale} />

        <div className="tutorial-detail-layout">
          <aside className="missing-toc">
            <span>{t('本页目录', 'On this page', '目次')}</span>
            {toc.map((item) => (
              <a href={`#${item.id}`} key={item.id}>{item.label}</a>
            ))}
          </aside>

          <div className="missing-article">
            <section id="what">
              <h2>{t('1. 它到底做什么的', '1. What it actually does', '1. 何をするツールか')}</h2>
              <p>
                {t(
                  'SoiaCode 不是一套重型 IDE 或托管 SaaS，而是一个可独立部署的 Agent 执行内核（命令行 si）。它专注解决三件事：低噪声地与模型对话改代码、在每次工具调用前把风险挡在确定性权限关口、以及把完整过程写成可回放、可分叉的明文会话树。',
                  'SoiaCode is not a heavyweight IDE or hosted SaaS control plane. It is a standalone Rust agent kernel (si) focused on three jobs: coding cleanly with low context noise, enforcing deterministic permission checks before every side effect, and persisting an append-only, replayable session tree.',
                  'SoiaCode は重量級 IDE やクラウド SaaS ではなく、単体動作する Rust 製 Agent 実行カーネル（CLI si）です。低ノイズな対話コーディング、全ツール実行前の決定論的権限チェック、再生・分岐可能な平文 JSONL セッション木の永続化の 3 点に集中します。',
                )}
              </p>

              <div className="soiacode-pill-row">
                {(t(
                  ['人守住注意力', '系统守住安全', '单二进制极小内核', '外围独立演化', '默认零遥测'],
                  ['Attention first', 'System-enforced safety', 'Single static binary', 'Independent peripheral evolution', 'Zero telemetry by default'],
                  ['注意力優先', 'システム強制の安全性', '単一静的バイナリ', '周辺機能の独立進化', '既定ゼロテレメトリ'],
                )).map((pill) => (
                  <span className="soiacode-pill" key={pill}>{pill}</span>
                ))}
              </div>

              <h3>{t('核心工作机制', 'Core runtime mechanics', 'コア動作メカニズム')}</h3>
              <ul>
                <li>
                  {t(
                    '省注意力与上下文工程：系统提示词保持短小；工具输出先经过裁剪（Trim）和大文本旁路落盘（Blob offloading，会话里只留引用）再进入上下文；只在权限审批、风险写入与方向确认时打断人。',
                    'Attention & context engineering: short system prompt; tool outputs are trimmed and large blobs are offloaded with references before entering model context, interrupting humans only on approvals, risk, or direction.',
                    '注意力とコンテキスト工学：システムプロンプトを極小に保ち、ツール出力はトリムおよび Blob 退避（参照 ID のみ記録）を経てからモデルへ入力。承認や高リスク変更時のみ人に確認します。',
                  )}
                </li>
                <li>
                  {t(
                    '只追加树状会话（Append-only JSONL）：每个会话落盘为一份明文 .jsonl（在线可直接 grep / tail），每条记录带 id 与 parentId 构成树。/tree 可在同一文件任意节点长出新分支，/fork 复制路径与快照成独立新会话；edit 前自动保留文件快照。',
                    'Append-only tree sessions (JSONL): each session writes plain .jsonl records with id and parentId. /tree branches inside the same file; /fork copies lineage and blobs into an independent session; pre-edit file snapshots stay referenced.',
                    '追記専用ツリー型セッション（JSONL）：各レコードに id / parentId を持たせ /tree で同ファイル内分岐、/fork で系統ごと新規複製。edit 前のファイルスナップショットも自動保持されます。',
                  )}
                </li>
                <li>
                  {t(
                    '长任务 = 长会话：不另造第二套脱离会话的任务循环，通过上下文压缩摘要、Steer（即时注入下一轮）与 FollowUp（排队等当前轮完成）推进长程工作，支持断点恢复与多会话共享同一 si 进程。',
                    'Long task = long session: no separate orchestration engine outside sessions; long runs advance via compaction summaries, Steer/FollowUp queues, and clean resume across sessions inside one si process.',
                    '長時間タスク = 長期セッション：別立てのエンジンを作らず、要約圧縮と Steer / FollowUp キューにより同一 si プロセス内で中断・再開をシームレスに扱います。',
                  )}
                </li>
              </ul>

              <SoiaCodeSystemDiagram locale={locale} />
            </section>

            <section id="support">
              <h2>{t('2. 它支持什么能力', '2. What it supports', '2. 対応機能と拡張性')}</h2>
              <p>
                {t(
                  '内核保持最小闭环，常用开发场景直接开箱；更重的工作流、常驻运维、浏览器操控和团队规则全部通过 34 个官方扩展与标准协议按需安装。',
                  'The core stays small out of the box, while heavier workflows, daemons, browser driving, and org policies load cleanly through 34 official extensions and standard protocols.',
                  'カーネル自体は極小に保ちつつ、高度なワークフローや常駐デーモン・ブラウザ操作・組織ルールは 34 種の公式拡張と標準プロトコル経由で必要な分だけ導入できます。',
                )}
              </p>

              <div className="skill-table-wrap">
                <table className="skill-cap-table">
                  <thead>
                    <tr>
                      <th>{t('能力维度', 'Capability', '機能領域')}</th>
                      <th>{t('具体支持范围（来自 docs 规格）', 'Supported scope (from docs)', '仕様上の対応範囲')}</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td><strong>{t('5 种运行方式', '5 run modes', '5 つの実行モード')}</strong></td>
                      <td>
                        {t(
                          'si（Line-mode 终端交互）、si -p "任务"（Print 无交互脚本/CI 排障）、si --mode rpc（stdio JSON-RPC 长期驱动）、si --mode acp（Zed 等编辑器接入）、soiacode-sdk（Rust 库门面直接嵌入宿主）。',
                          'si (interactive line-mode terminal), si -p "task" (print/CI mode), si --mode rpc (long-lived stdio JSON-RPC), si --mode acp (editors like Zed), and soiacode-sdk (Rust crate embedding).',
                          'si（対話 CLI）、si -p "task"（単発 print/CI 用）、si --mode rpc（常駐 stdio JSON-RPC）、si --mode acp（Zed 等エディタ連携）、soiacode-sdk（Rust 組込クレート）。',
                        )}
                      </td>
                    </tr>
                    <tr>
                      <td><strong>{t('5 个内置工具', '5 built-in tools', '5 組込みツール')}</strong></td>
                      <td>
                        {t(
                          'read、write、edit、命令执行（bash / powershell）、grep。其余专业能力全部不硬编码进内核。',
                          'read, write, edit, command execution (bash / powershell), and grep. Everything else lives outside the core.',
                          'read / write / edit / コマンド実行（bash・powershell）/ grep の 5 つのみ。それ以外はすべてカーネル外に分離。',
                        )}
                      </td>
                    </tr>
                    <tr>
                      <td><strong>{t('5 种模型线协议', '5 wire protocols', '5 種 LLM プロトコル')}</strong></td>
                      <td>
                        {t(
                          'soiacode-provider 支持 Anthropic、OpenAI Chat、OpenAI Responses，以及按 feature 编入的 Gemini 与 Bedrock。',
                          'soiacode-provider supports Anthropic, OpenAI Chat, OpenAI Responses, plus feature-gated Gemini and Bedrock.',
                          'Anthropic / OpenAI Chat / OpenAI Responses に加え、feature 指定で Gemini と Bedrock にも対応。',
                        )}
                      </td>
                    </tr>
                    <tr>
                      <td><strong>{t('扩展与 MCP 生态', 'Extensions & MCP', '拡張・MCP エコシステム')}</strong></td>
                      <td>
                        {t(
                          '内置 MCP 客户端 + soiacode-extkit 扩展开发套件；官方提供 8 大类共 34 个可扩展包（si install <名>），运行在独立子进程或通过 si <服务> 独立启动。',
                          'Built-in MCP client + soiacode-extkit SDK; 34 official extensions across 8 categories via si install <name>, running as isolated subprocesses or standalone si <service> processes.',
                          '内蔵 MCP クライアント＋ soiacode-extkit SDK。si install <名> で 8 分野 34 種の拡張を独立プロセスとして導入可能。',
                        )}
                      </td>
                    </tr>
                    <tr>
                      <td><strong>{t('数据落盘目录', 'Local state layout', 'ローカル保存先')}</strong></td>
                      <td>
                        {t(
                          '集中存于 ~/.soiacode/（sessions、settings.json、trust.json、extensions、bin、confirmed.json、serve、logs、crashes.jsonl、audit），支持项目级 .soiacode/ 与环境变量引用（"$ENV_VAR"）。',
                          'Stored under ~/.soiacode/ (sessions, settings.json, trust.json, extensions, bin, confirmed.json, serve, logs, crashes.jsonl, audit), with project-level .soiacode/ and "$ENV_VAR" secret refs.',
                          '~/.soiacode/ 配下に集約し、プロジェクト固有の .soiacode/ および "$ENV_VAR" 参照に対応。',
                        )}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <h3>{t('34 个官方扩展全景（按能力域）', '34 official extensions by capability domain', '34 公式拡張パッケージ全体像')}</h3>
              <ul>
                <li>
                  <strong>{t('多智能体与长任务编排', 'Multi-agent & task workflows', 'マルチ Agent・長時間タスク')}：</strong>
                  <span className="skill-inline-code">subagent</span> <span className="skill-inline-code">handoff</span> <span className="skill-inline-code">taskboard</span> <span className="skill-inline-code">jobs-panel</span> <span className="skill-inline-code">goal</span> <span className="skill-inline-code">memory</span> <span className="skill-inline-code">codemode</span> <span className="skill-inline-code">hooks</span> <span className="skill-inline-code">intercom</span> <span className="skill-inline-code">agent-claude</span> <span className="skill-inline-code">agent-copilot</span> <span className="skill-inline-code">agent-bridge</span>
                </li>
                <li>
                  <strong>{t('代码索引、网页、浏览器与行内补全', 'Code LSP, web, browser & inline', 'LSP・Web・ブラウザ・補完')}：</strong>
                  <span className="skill-inline-code">lsp</span>, <span className="skill-inline-code">web</span>, <span className="skill-inline-code">browser</span>, <span className="skill-inline-code">inline</span>
                </li>
                <li>
                  <strong>{t('治理规则与请求脱敏', 'Governance & redaction', '統制ルール・機密マスキング')}：</strong>
                  <span className="skill-inline-code">policy</span>, <span className="skill-inline-code">redact</span>
                </li>
                <li>
                  <strong>{t('执行环境、资源与沙箱辅助', 'Remote exec, resources & sandbox helpers', '遠隔実行・リソース・サンドボックス')}：</strong>
                  <span className="skill-inline-code">remote-exec</span>, <span className="skill-inline-code">resources</span>, <span className="skill-inline-code">sandbox-bwrap</span>, <span className="skill-inline-code">sandbox-acl</span>, <span className="skill-inline-code">writable-dirs</span>
                </li>
                <li>
                  <strong>{t('常驻后台、事件与定时恢复', 'Daemon, events & durable recovery', '常駐・イベント・自動復旧')}：</strong>
                  <span className="skill-inline-code">serve</span>, <span className="skill-inline-code">event-sources</span>, <span className="skill-inline-code">schedule</span>, <span className="skill-inline-code">durable</span>, <span className="skill-inline-code">dispatch</span>
                </li>
                <li>
                  <strong>{t('对外服务与数据观测路由', 'External protocols, search, storage & routing', '外部公開・検索・ストレージ・ルーティング')}：</strong>
                  <span className="skill-inline-code">mcp-server</span>, <span className="skill-inline-code">a2a</span>, <span className="skill-inline-code">session-search</span>, <span className="skill-inline-code">metrics</span>, <span className="skill-inline-code">storage</span>, <span className="skill-inline-code">router</span>
                </li>
              </ul>

              <SoiaCodePeripheralDiagram locale={locale} />
            </section>

            <section id="boundaries">
              <h2>{t('3. 精确边界：做什么、不做什么、怎么拦', '3. Exact boundaries & safety model', '3. 厳密な境界と安全性モデル')}</h2>

              <div className="soiacode-grid-2">
                <div className="soiacode-box is-in">
                  <h3>{t('产品边界内（内核负责）', 'Inside product boundary', 'カーネルの責務範囲')}</h3>
                  <ul>
                    <li>{t('Agent 推理与工具调度闭环', 'Agent loop & tool dispatch kernel', '推論ループとツール実行制御')}</li>
                    <li>{t('4 种入口模式（交互 / print / RPC / ACP）+ Rust SDK', '4 run modes (CLI / print / RPC / ACP) + SDK', '4 種の起動モード + Rust SDK')}</li>
                    <li>{t('5 个内置工具与默认工作区路径检查', '5 built-in tools & workspace path guards', '5 組込みツールとパス境界検査')}</li>
                    <li>{t('10 个治理挂载点、权限引擎与审批记录', '10 governance mounts, permission & approval log', '10 フック、権限エンジン、承認記録')}</li>
                    <li>{t('Append-only JSONL 会话树、快照与 Blob 旁路', 'JSONL tree sessions, snapshots & blob offload', '追記専用 JSONL・スナップショット・Blob 退避')}</li>
                    <li>{t('--no-session 下仍写入只追加审计日志（~/.soiacode/audit/）', 'Audit-only log even under --no-session', '--no-session 時も監査ログへ記録')}</li>
                    <li>{t('扩展宿主进程管理与 MCP 客户端', 'Extension subprocess host & MCP client', '拡張サブプロセス管理と MCP クライアント')}</li>
                  </ul>
                </div>
                <div className="soiacode-box is-out">
                  <h3>{t('产品边界外（内核明确不做）', 'Outside product boundary', 'カーネル外へ分離する範囲')}</h3>
                  <ul>
                    <li>{t('图形桌面壳（由上层如 SoiaDeck 或编辑器承担）', 'Desktop GUI shell (handled by SoiaDeck or editors)', 'GUI デスクトップ殻（SoiaDeck 等が担当）')}</li>
                    <li>{t('SaaS 托管控制面与账号中心', 'Hosted SaaS control plane or user cloud sync', 'SaaS 制御面・クラウド同期')}</li>
                    <li>{t('硬编码企业策略（交由 policy 扩展或宿主挂载点实现）', 'Hardcoded org policy (delegated to policy extension)', '組織ポリシーのハードコード')}</li>
                    <li>{t('默认必开的外部重沙箱（soiacode-sandbox 为可选编译项）', 'Mandatory heavy sandbox (soiacode-sandbox is opt-in)', '重量級サンドボックスの強制組込')}</li>
                    <li>{t('常驻守护、MCP Server、A2A 网关、远端容器编排适配', 'Daemon serve, MCP server, A2A gateway, managed sandbox drivers', '常駐サーバー・MCP/A2A 公開・遠隔実行')}</li>
                    <li>{t('默认遥测上报（Zero telemetry by default）', 'Default telemetry (zero telemetry by default)', '既定でのテレメトリ送信（ゼロテレメトリ）')}</li>
                    <li>{t('扩展在远端/容器中执行时不复制用户凭据到远端', 'Credentials stay local during remote-exec', '遠隔実行先へのユーザー認証情報の複製')}</li>
                  </ul>
                </div>
              </div>

              <h3>{t('10 个治理挂载点与审批铁律', '10 governance mounts & decision precedence', '10 個の統制フックと承認優先順位')}</h3>
              <p>
                {t(
                  '每一次用户输入、模型请求、工具调用与回合结束，都必须经过内置挂载点链条，确保策略扩展、脱敏扩展与宿主应用能以确定性顺序介入：',
                  'Every turn transitions through 10 deterministic mount points so built-in permissions, redact, policy, or host SDK hooks can inspect, rewrite, ask, or block cleanly:',
                  '入力・モデル通信・ツール呼出・ターン終了のすべてが 10 個の決定的フックを通過し、ポリシー検証や機密マスキングを確実に適用します：',
                )}
              </p>
              <div className="soiacode-pill-row">
                {[
                  'before_user_input',
                  'before_compact',
                  'before_provider_request',
                  'after_provider_response',
                  'before_tool_call',
                  'after_tool_result',
                  'file_change',
                  'permission_request',
                  'before_turn_end',
                  'turn_end / session_end',
                ].map((hook) => (
                  <span className="soiacode-pill" key={hook}>{hook}</span>
                ))}
              </div>
              <ul>
                <li>
                  <strong>{t('优先级铁律 deny > ask > allow', 'Precedence deny > ask > allow', '優先鉄則 deny > ask > allow')}：</strong>
                  {t(
                    '一旦命中任何一条 deny 即拒绝；复合 shell 命令会拆分成子命令逐段判定，不因第一段无害就放行整条命令。',
                    'Any deny wins immediately; compound shell commands are split and evaluated per segment.',
                    'deny に 1 つでも該当すれば即拒否。複合シェルコマンドはサブコマンド単位に分解して検証します。',
                  )}
                </li>
                <li>
                  <strong>{t('写保护敏感路径', 'Write-protected paths', '書き込み保護対象パス')}：</strong>
                  {t(
                    '.git/、.soiacode/、si 数据目录及 shell 启动脚本（如 .zshrc）即便在工作区内，默认也会触发 ask 确认（仅显式 bypass 例外）。',
                    '.git/, .soiacode/, data dirs, and shell rc files always trigger ask even inside workspace (unless bypass).',
                    '.git/、.soiacode/、si データディレクトリ、シェル設定（.zshrc 等）はワークスペース内でも確認待ちになります。',
                  )}
                </li>
                <li>
                  <strong>{t('三种权限模式（Shift+Tab 切换）', 'Three modes (Shift+Tab)', '3 つの権限モード（Shift+Tab 切替）')}：</strong>
                  {t(
                    'plan（只读探索）、default（工作区内按规则自动读写，越界/执行/敏感写入问人）、bypass（显式全放行）。当策略为 never 或无人值守超时，所有 ask 一律按拒绝处理。',
                    'plan (read-only), default (workspace writes allowed with prompts on risk), bypass (explicitly permissive). Unattended or never approval always resolves ask as deny.',
                    'plan（読取専用）、default（範囲外・危険操作のみ確認）、bypass（明示許可）。無人環境または never 設定時は全 ask を拒否します。',
                  )}
                </li>
              </ul>

              <SoiaCodeToolSequenceDiagram locale={locale} />

              <div className="soiacode-note">
                {t(
                  '沙箱边界原则：权限检查决定「许不许」，可选沙箱（soiacode-sandbox，默认关闭 feature）保证「放行了也越不了界」。支持从无沙箱 → 内置（macOS Seatbelt / Linux Landlock+seccomp / Windows 受限令牌+ACL，增强禁网需一次性管理员 si sandbox setup）→ bubblewrap → 容器 / gVisor / krun 微虚机 → remote-exec（soiacode-exec）7 档演进；要求受限模式但底层不支持时，命令直接拒绝执行，绝不静默降级。',
                  'Sandbox discipline: permissions decide whether an action is allowed; the optional sandbox (soiacode-sandbox, compiled out by default) guarantees allowed commands still cannot cross boundaries across 7 isolation tiers. When a restricted mode is requested on an unsupported host, commands refuse to run rather than silently downgrading.',
                  'サンドボックス原則：権限チェックが「許可するか」を決め、任意のサンドボックス（soiacode-sandbox・既定無効）が「許可しても越境させない」ことを保証します。OS 非対応環境で制限モードが指定された場合、無言ダウングレードはせず実行を拒否します。',
                )}
              </div>
            </section>

            <section id="architecture">
              <h2>{t('4. 工程 Crate 分层与隔离纪律', '4. Engineering crate layers & isolation', '4. クレート階層設計と分離規律')}</h2>
              <p>
                {t(
                  '整个 Rust workspace 遵循严格的 L4 → L0 单向向下依赖。任何业务 crate 都禁止绕过抽象直接触网或触系统资源：全仓只有 L0 的 soiacode-http 能直接发起 HTTP/HTTPS 请求（统一代理、自定义 CA 与请求头脱敏），只有 soiacode-local 封装进程起停与文件原子写入，而 soiacode-protocol 作为零 IO 唯一类型真源让核心、SDK、扩展与 RPC/ACP 保持契约一致。',
                  'The Rust workspace enforces strict downward dependencies from L4 to L0. Only L0 soiacode-http performs network IO (centralizing proxies, custom CA, and header redaction), only L0 soiacode-local wraps OS process/file primitives, and zero-IO soiacode-protocol serves as the single source of truth across kernel, SDK, extensions, RPC, and ACP.',
                  'ワークスペース全体で L4 → L0 への厳格な単方向依存を遵守。HTTP/HTTPS 通信は L0 の soiacode-http のみに、OS ファイル・プロセス操作は soiacode-local のみに限定し、soiacode-protocol が Zero-IO の単一型真実源を担います。',
                )}
              </p>

              <SoiaCodeCrateDiagram locale={locale} />
            </section>

            <section id="roadmap">
              <h2>{t('5. 版本路线与当前真实状态', '5. Roadmap & current status', '5. ロードマップと現在地')}</h2>
              <p>
                {t(
                  '当前处于架构定稿与详细设计阶段（0.0.1 M1 进行中），仓库内沉淀了完整的架构决策记录、用户规格、协议设计及可读站点，尚未发布可用 Rust 代码实现与二进制下载包。后续规划按 11 个里程碑渐进交付：',
                  'Currently in active architecture & detailed design (0.0.1 M1) with complete specs and decision records, prior to releasing Rust source crates or binaries. Planned across 11 incremental milestones:',
                  '現在は設計確定および詳細設計段階（0.0.1 M1 進行中）にあり、設計判断記録（ADR）・ユーザー仕様・プロトコル定義を整備済みです（Rust 実装バイナリはまだ公開配布前）。今後 11 のマイルストーンで段階的に提供します：',
                )}
              </p>
              <ul>
                <li><strong>0.0.1 – 0.0.2</strong>：{t('协议/HTTP/本机工具底座、单会话终端交互与 print/RPC 入口、权限挂载点闭环。', 'Core L0–L4 crates, interactive CLI / print / RPC entrypoints, and mount/permission loop.', '基盤クレート（L0–L4）、対話 CLI / print / RPC 入口、権限フック閉ループ。')}</li>
                <li><strong>0.0.3 – 0.0.6</strong>：{t('会话树分叉与压缩、上下文工程、MCP 客户端与扩展宿主/extkit，以及首批官方核心扩展。', 'Session tree fork/compaction, context engineering, MCP client, extension host & extkit.', 'セッション分岐・要約圧縮、文脈工学、MCP クライアントと extkit 拡張ホスト。')}</li>
                <li><strong>0.0.7 – 0.0.10</strong>：{t('ACP 编辑器接入、常驻 serve / event-sources / durable、多智能体编排与对外 mcp-server / a2a 服务。', 'ACP integration, serve daemon / durable / events, subagent workflows, mcp-server & a2a.', 'ACP エディタ統合、serve / durable、マルチ Agent 連携と mcp-server / a2a 公開。')}</li>
                <li><strong>0.0.11</strong>：{t('可选编译的 os-native 原生沙箱后端（默认保持关闭，不侵入最小核心）。', 'Opt-in os-native sandbox feature (disabled by default to keep the minimal core pure).', 'オプトインの os-native サンドボックス（既定無効で最小コアを汚染しない）。')}</li>
              </ul>

              <div className="missing-cta">
                <a className="btn btn-primary" href={href('/soiadeck/')}>SoiaDeck</a>
                <a className="btn btn-ghost" href={href('/skills/')}>{t('看开源技能', 'Open skills', '公開スキルを見る')}</a>
              </div>
            </section>
          </div>
        </div>
      </article>
    </SubpageLayout>
  );
}

/** SOIA Runtime — tutorial-detail template. */
export function SoiaRuntimePage({ locale }: { locale: LandingLocaleCode }) {
  const href = (path: string) => hrefFor(path, locale);
  const lang = langOf(locale);
  const t = <T,>(zhV: T, enV: T, jaV: T) => t3(locale, zhV, enV, jaV);
  const sections: ReadonlyArray<{ id: string; title: string; body: string; image?: string; alt?: string }> =
    lang === 'zh'
      ? [
          {
            id: 'what',
            title: 'Model → Harness → Agent OS',
            body: 'SOIA（System, Orchestration, Intelligence, Assurance）的目标，是把天生无状态、易漂移、易失控的大模型能力，组织成可感知、可治理、可恢复、可审计、可长期运行的工程系统。核心公式：Agent = Model + Local State + Tool Interface；Harness = Runtime Control Plane around Agent；Agent OS = Workspace + Harness + Ledger + Policy + A2A + Channel + Apps。',
            image: '/soia/products/soia-agent-os-layers.png',
            alt: '模型、Harness 与 Agent OS 分层职责图',
          },
          {
            id: 'loop',
            title: '最小可实现闭环与四大原语',
            body: '系统是否进入 Agent OS 阶段的唯一判据，是打通「Task → AgentRun → RunLedger → CapabilityPolicy → SensorResult → Evidence」6 步闭环。围绕 Workspace（项目与身份唯一真源）、AgentRun（可恢复事件流）、Capability（工具调用前权限与预算闸门）和 Ledger（不可篡改事实账本），所有动作都可回放、可审计。',
            image: '/soia/products/soia-agent-os-loop.png',
            alt: '最小可实现 Agent OS 6 步闭环图',
          },
          {
            id: 'modules',
            title: 'M1–M8 一级内核与乙路线重构',
            body: '架构由 9 层 Stack、19 个 UUIDv7 主键（IDS）和 M1–M8 八个一级系统边界构成：Wave 1 先建 M1（工作区与身份）、M5（能力白名单 deny-by-default）与 M6（9 类账本 + Hash Chain）；Wave 2 启动 M3（会话与 AgentRun）；Wave 3 补齐 M2（任务图）、M4（记忆与上下文）与 M7（评估恢复与审批）；Wave 4 接入 M8（网关与 8 大产品表面）。代码采用「乙路线」隔离：在新建净土目录 runtime/crates/kernel/ 落地新契约，冻结旧 crate，避免原语继续分散。',
            image: '/soia/products/soia-agent-os-modules.png',
            alt: 'SOIA Agent OS M1-M8 八个一级模块与四波演进图',
          },
          {
            id: 'topologies',
            title: '7 大产品形态 · 8 大表面 · 5 种部署拓扑',
            body: '产品层覆盖 CLI（含精简 loop 模式）、Desktop（Tauri 2 + React 19）、Gateway、Edge Relay、Cloud Gateway、Agent Server 与 MCP Server，围绕保护深层注意力的 8 大表面展开；部署上支持从单机 Desktop / CLI，到 Desktop + Local Gateway daemon、Edge Relay 穿透唤起，再到云网关 + Agent Server 的 5 种渐进拓扑。',
            image: '/soia/products/soia-agent-os-topologies.png',
            alt: 'SOIA Agent OS 5 种最小部署拓扑图',
          },
          {
            id: 'docs',
            title: '架构规格与开源状态',
            body: '全部工程方法论、产品方法论、M1–M8 分册、Harness 蓝图与状态看板维护在 soia-docs，开源运行时代码位于 soia-team/soia（MIT）；架构处于 R019 冻结终检通过、等待 D-05 动工（Wave 1 first-gate 与 P0 安全修复）阶段。',
          },
        ]
      : lang === 'ja'
        ? [
            {
              id: 'what',
              title: 'Model → Harness → Agent OS',
              body: 'SOIA（System, Orchestration, Intelligence, Assurance）は、ステートレスでドリフトしやすい LLM を観測・統制・復元・監査・長期稼働可能な工学システムへ昇華させます。定義式：Agent = Model + Local State + Tool Interface、Harness = Runtime Control Plane around Agent、Agent OS = Workspace + Harness + Ledger + Policy + A2A + Channel + Apps。',
              image: '/soia/products/soia-agent-os-layers.png',
              alt: 'Model / Harness / Agent OS 階層設計図',
            },
            {
              id: 'loop',
              title: '最小実現可能ループと 4 原語',
              body: 'Agent OS 到達の基準は「Task → AgentRun → RunLedger → CapabilityPolicy → SensorResult → Evidence」の 6 ステップ閉ループの貫通です。Workspace・AgentRun・Capability・不変 Ledger の 4 原語により、すべての判断と副作用が再生・監査可能になります。',
              image: '/soia/products/soia-agent-os-loop.png',
              alt: '最小 Agent OS 6 ステップループ',
            },
            {
              id: 'modules',
              title: 'M1–M8 モジュールとクリーンカーネル再構築',
              body: '9 層スタック・19 個の UUIDv7 主キー・8 つの第一級境界モジュール（M1 Workspace, M2 Task, M3 AgentRun, M4 Memory, M5 Capability, M6 Ledger, M7 Eval/Approval, M8 Gateway/Surface）で構成。既存クレートを凍結し新規領域 runtime/crates/kernel/ に新契約を隔離構築します。',
              image: '/soia/products/soia-agent-os-modules.png',
              alt: 'SOIA Agent OS M1-M8 モジュール構成',
            },
            {
              id: 'topologies',
              title: '7 プロダクト形態 · 8 サーフェス · 5 配置トポロジ',
              body: 'CLI / Desktop (Tauri 2 + React 19) / Gateway / Edge Relay / Cloud Gateway / Agent Server / MCP Server の 7 形態を備え、ローカル単機構成から Edge Relay・クラウドクラスターまで 5 通りのトポロジへ段階拡張できます。',
              image: '/soia/products/soia-agent-os-topologies.png',
              alt: 'SOIA Agent OS 5 配置トポロジ',
            },
            {
              id: 'docs',
              title: '設計仕様とリポジトリ状況',
              body: '全方法論・M1–M8 仕様・Harness 設計は soia-docs にて管理され、オープンソースランタイムは soia-team/soia（MIT ライセンス）で公開しています。',
            },
          ]
        : [
            {
              id: 'what',
              title: 'Model → Harness → Agent OS',
              body: 'SOIA (System, Orchestration, Intelligence, Assurance) turns stateless, drifting LLM capabilities into observable, governable, recoverable, and auditable engineering systems. Formula: Agent = Model + Local State + Tool Interface; Harness = Runtime Control Plane around Agent; Agent OS = Workspace + Harness + Ledger + Policy + A2A + Channel + Apps.',
              image: '/soia/products/soia-agent-os-layers.png',
              alt: 'Model, Harness and Agent OS layers',
            },
            {
              id: 'loop',
              title: 'Minimum viable loop & core primitives',
              body: 'The criterion for entering the Agent OS stage is closing the 6-step fact loop: Task → AgentRun → RunLedger → CapabilityPolicy → SensorResult → Evidence, built on Workspace, AgentRun, Capability, and immutable Ledger primitives.',
              image: '/soia/products/soia-agent-os-loop.png',
              alt: 'Minimum Viable Agent OS loop',
            },
            {
              id: 'modules',
              title: 'M1–M8 modules & clean-kernel refactoring',
              body: 'Structured across a 9-layer stack, 19 UUIDv7 primary keys, and 8 first-class modules (M1 Workspace, M2 Task, M3 AgentRun, M4 Memory, M5 Capability, M6 Ledger, M7 Eval/Approval, M8 Gateway/Surface). Under Route B, new contracts live in an isolated runtime/crates/kernel/ boundary while legacy crates stay frozen.',
              image: '/soia/products/soia-agent-os-modules.png',
              alt: 'SOIA Agent OS M1-M8 modules overview',
            },
            {
              id: 'topologies',
              title: '7 products · 8 surfaces · 5 deployment topologies',
              body: 'Seven deliverables (CLI, Desktop, Gateway, Edge Relay, Cloud Gateway, Agent Server, MCP Server) project 8 shared surfaces across 5 deployment topologies — from single-machine Desktop/CLI to Edge Relay and Cloud Gateway clusters.',
              image: '/soia/products/soia-agent-os-topologies.png',
              alt: 'SOIA Agent OS 5 deployment topologies',
            },
            {
              id: 'docs',
              title: 'Specification & repository status',
              body: 'All methodology specs, M1–M8 blueprints, Harness reference, and status boards live in soia-docs; the MIT open-source repository is at soia-team/soia, ready for D-05 architecture freeze and Wave 1 first-gate execution.',
            },
          ];
  return (
    <SubpageLayout active="product" locale={locale}>
      <article className="missing-page tutorial-detail">
        <nav className="breadcrumb" aria-label="breadcrumb">
          <a href={href('/')}>SOIA</a><span>/</span><span>SOIA Agent OS</span>
        </nav>
        <header className="catalog-head">
          <span className="label">{t('SOIA 家族 · Agent OS 规格与开源底座 · MIT', 'SOIA family · Agent OS spec & open-source runtime · MIT', 'SOIA ファミリー · Agent OS 仕様・OSS 基盤 · MIT')}</span>
          <h1 className="display">SOIA Agent OS</h1>
          <p className="lead">
            {t(
              '本地优先、Provider 中立、可审计的 Agent OS：以 Model → Harness → Agent OS 分层和 M1–M8 内核，把大模型转化为可验证的长期工作系统。',
              'A local-first, provider-neutral, auditable Agent OS: Model → Harness → Agent OS layers and M1–M8 kernels turning LLMs into verifiable long-running systems.',
              'ローカルファースト・プロバイダー中立・監査可能な Agent OS：Model → Harness → Agent OS 階層と M1–M8 カーネルで LLM を検証可能な長期運用システムへ変革。',
            )}
          </p>
        </header>
        <ZoomableFigure
          src="/soia/products/soia-agent-os-layers.png"
          alt={t('SOIA Agent OS 分层架构总览', 'SOIA Agent OS layered architecture', 'SOIA Agent OS 階層アーキテクチャ')}
          locale={locale}
        />
        <div className="tutorial-detail-layout">
          <aside className="missing-toc">
            <span>{t('本页内容', 'On this page', '目次')}</span>
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
                  <ZoomableFigure
                    src={section.image}
                    alt={section.alt ?? section.title}
                    locale={locale}
                    lazy
                    marginTop={18}
                  />
                ) : null}
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
