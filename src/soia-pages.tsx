import { useEffect, useState } from 'react';
import { SubpageLayout, hrefFor } from './shell';
import type { LandingLocaleCode } from './upstream/app/i18n';
import { SKILL_DOCS, type LocaleText, type SkillDoc } from './skill-data';
import './missing-pages.css';

function ZoomableFigure({
  src,
  alt,
  className = 'tutorial-detail-hero',
  zh,
  lazy = false,
  marginTop,
}: {
  src: string;
  alt: string;
  className?: string;
  zh: boolean;
  lazy?: boolean;
  marginTop?: number;
}) {
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
        aria-label={zh ? `放大查看：${alt}` : `Zoom image: ${alt}`}
      >
        <img src={src} alt={alt} loading={lazy ? 'lazy' : undefined} />
        <span className="zoomable-hint">{zh ? '点击查看大图' : 'Click to zoom'}</span>
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
            aria-label={zh ? '关闭大图' : 'Close preview'}
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
      label: { zh: '知识库底座与治理', en: 'Vault core & governance' },
      desc: {
        zh: 'Vault 初始化、Obsidian 接入、分层检索、体检、生命周期整理与编码会话留痕。',
        en: 'Vault bootstrap, Obsidian wiring, layered search, health audits, lifecycle moves, and agent snapshots.',
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
      label: { zh: '内容采集与归档', en: 'Capture & clipping' },
      desc: {
        zh: '网页、公众号、X、小红书、抖音、GitHub 与云盘 PDF 一键归档进本地 Markdown 仓库。',
        en: 'Clip web articles, WeChat, X, Rednote, Douyin, GitHub repos, and drives into local Markdown.',
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
      label: { zh: '阅读理解、精翻与提炼', en: 'Reading, translation & distillation' },
      desc: {
        zh: '独立 AI 选读评估、三档精翻、苏格拉底式个人观点提炼，以及全库长期知识沉淀。',
        en: 'AI critical reading, 3-tier ZH translation, Socratic opinion distillation, and long-term knowledge extraction.',
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
      label: { zh: '多媒体视觉与学习转化', en: 'Visual & learning transforms' },
      desc: {
        zh: '把长文转成长图、信息图、海报、Anki 闪卡、脑图与 NotebookLM 播客材料。',
        en: 'Turn articles into infographics, posters, flashcards, mind maps, and NotebookLM study packs.',
      },
      skills: [
        'soia-pkm-transform-article-visual',
        'soia-pkm-transform-article-notebooklm',
      ],
    },
    {
      id: 'pkm-tools',
      label: { zh: '独立工具：个人书库与网盘', en: 'Standalone tools: Library & drives' },
      desc: {
        zh: '不绑完整文章流的独立工具：微信读书同步、纯本地书库底座，以及阿里云盘 / 百度网盘原子操作。',
        en: 'Standalone utilities for local book catalogs, WeRead sync, Alipan, and Baidu Netdisk.',
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
      label: { zh: '协作办公同步工具', en: 'Collaborative office tools' },
      desc: {
        zh: '飞书只读调研/增量同步，以及 ProcessOn 图表安全盘点与导出归档。',
        en: 'Read-only Feishu wiki/drive sync and safe ProcessOn diagram export.',
      },
      skills: [
        'soia-cwork-feishu-cli',
        'soia-cwork-processon-diagrams',
      ],
    },
    {
      id: 'office-create',
      label: { zh: '成文与视觉创作工坊', en: 'Writing & visual creation' },
      desc: {
        zh: '以真实观点与 Vault 摘抄写长文草稿，并基于组合轴与中华传统色生成配图和 SVG。',
        en: 'Draft authentic articles from vault notes and compile artwork/SVGs.',
      },
      skills: [
        'soia-media-compose-article-draft',
        'soia-media-generate-article-image',
      ],
    },
    {
      id: 'office-publish',
      label: { zh: '多平台多媒体草稿发布', en: 'Multi-platform draft publishing' },
      desc: {
        zh: '只建草稿箱或当次授权代传，绝不静默群发：覆盖微信公众号、小红书与 X。',
        en: 'Draft-only and per-approval upload pipelines for WeChat, Rednote, and X.',
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
      label: { zh: '规范定界与架构设计', en: 'Specs & architecture design' },
      desc: {
        zh: '写代码先定范围、复现、契约职责边界与 UI 状态设计交接。',
        en: 'Scope guardrails, cross-component architecture governance, and implementation-ready UI design.',
      },
      skills: [
        'soia-dev-enforce-coding-protocol',
        'soia-dev-govern-architecture',
        'soia-dev-design-ui',
      ],
    },
    {
      id: 'dev-build',
      label: { zh: '任务落地与 CLI 调度', en: 'Implementation & dispatch' },
      desc: {
        zh: '需求实现与缺陷修复，以及派单给外部 AI CLI 进程并核验多账号额度与产物。',
        en: 'End-to-end engineering delivery plus multi-account external AI CLI dispatch.',
      },
      skills: [
        'soia-dev-implement-task',
        'soia-dev-agent-cli-dispatch',
      ],
    },
    {
      id: 'dev-review',
      label: { zh: '只读审查与 UI 验收', en: 'Read-only review & audit' },
      desc: {
        zh: '独立只读视角：代码与技能包的双轨合规/风险审查，以及 UI 技术证据/UX 分轨验收。',
        en: 'Independent read-only code/skill reviews and split technical/UX UI audits.',
      },
      skills: [
        'soia-dev-review-code',
        'soia-dev-audit-ui',
      ],
    },
    {
      id: 'dev-tools',
      label: { zh: '独立工具：GitHub 与视图', en: 'Standalone tools: GitHub & views' },
      desc: {
        zh: 'GitHub PR/CI/Release 权限管家，以及按需生成的最小任务进度与调用链视图。',
        en: 'GitHub PR/CI/Release operations and on-demand minimal task progress views.',
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
      label: { zh: '技能检索与提示词工程', en: 'Discovery & prompt engineering' },
      desc: {
        zh: '按需求匹配已有或候选 SOIA 技能，以及起草、诊断并规格化清晰可执行的提示词。',
        en: 'Find the right SOIA skill without unauthorized installs, and clarify prompts.',
      },
      skills: [
        'soia-meta-find-skill',
        'soia-meta-prompt-clarity',
      ],
    },
    {
      id: 'meta-release',
      label: { zh: '分发同步与发版管理', en: 'Sync & release ops' },
      desc: {
        zh: '先 dry-run 再跨项目/宿主软链同步技能，以及严格祖先校验与快进 main 的发版流程。',
        en: 'Dry-run symlink sync across hosts and fast-forward main skill releases.',
      },
      skills: [
        'soia-meta-sync-skills',
        'soia-meta-skill-release',
      ],
    },
  ],
};

const isZh = (locale: LandingLocaleCode) => locale === 'zh';
const pick = <T,>(locale: LandingLocaleCode, value: { zh: T; en: T }): T =>
  isZh(locale) ? value.zh : value.en;

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
              ? '技能越来越多，最麻烦的不是不会用，而是不知道该叫谁。按能力子类整理，装到 Claude Code、Codex 或 WorkBuddy；默认项目级、明确宿主、单个技能。'
              : 'The hard part is not using a skill — it is knowing which one to call. Organized by workflow subcategory for Claude Code, Codex, or WorkBuddy.'}
          </p>
        </header>
        <section className="tutorial-grid">
          {SKILL_DOMAINS.map((domain) => {
            const subcats = SKILL_SUBCATEGORIES[domain.slug];
            return (
              <article className="tutorial-card" key={domain.slug}>
                <a href={href(`/skills/${domain.slug}/`)}>
                  <img src={domain.cover} alt="" loading="lazy" />
                  <div className="tutorial-card-body">
                    <span className="label">{domain.plugin}</span>
                    <h2>{pick(locale, domain.name)}</h2>
                    <p>{pick(locale, domain.blurb)}</p>
                    <div className="skill-hub-subcats">
                      {subcats.map((sub) => (
                        <span className="skill-hub-subcat" key={sub.id}>
                          {pick(locale, sub.label)} · {sub.skills.length}
                        </span>
                      ))}
                    </div>
                    <div className="tutorial-meta">
                      <span>{skillsOf(domain.slug).length} {zh ? '个技能' : 'skills'} · {domain.tokens} tok</span>
                      <span>{zh ? '查看分类 ↗' : 'Browse categories ↗'}</span>
                    </div>
                  </div>
                </a>
              </article>
            );
          })}
        </section>
        <div className="missing-cta">
          <a className="btn btn-primary" href="https://github.com/soia-team/soia-open-skills" target="_blank" rel="noreferrer noopener">GitHub</a>
          <a className="btn btn-ghost" href={href('/soiadeck/')}>SoiaDeck</a>
        </div>
      </article>
    </SubpageLayout>
  );
}

/** One domain — filterable subcategories + craft-list grouped by role. */
export function SkillDomainPage({ locale, slug }: { locale: LandingLocaleCode; slug: SkillDomainSlug }) {
  const href = (path: string) => hrefFor(path, locale);
  const zh = isZh(locale);
  const domain = domainOf(slug);
  const [activeCat, setActiveCat] = useState<string>('all');

  useEffect(() => {
    setActiveCat('all');
  }, [slug]);

  if (!domain) return null;
  const skills = skillsOf(slug);
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
      label: { zh: '其他工具', en: 'Other tools' },
      desc: { zh: '独立工具与未归类技能。', en: 'Additional domain skills.' },
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
          <a href={href('/skills/')}>{zh ? '开源技能' : 'Open skills'}</a><span>/</span>
          <span aria-current="page">{pick(locale, domain.name)}</span>
        </nav>
        <header className="catalog-head">
          <span className="label">{domain.plugin} · {skills.length} {zh ? '个技能' : 'skills'} · {groups.length} {zh ? '个子类' : 'categories'}</span>
          <h1 className="display">{pick(locale, domain.name)}</h1>
          <p className="lead">{pick(locale, domain.blurb)}</p>
        </header>

        <div className="missing-filter skill-cat-filter" role="tablist" aria-label={zh ? '按子类筛选' : 'Filter by category'}>
          <button
            type="button"
            className={activeCat === 'all' ? 'is-active' : undefined}
            onClick={() => setActiveCat('all')}
          >
            {zh ? '全部' : 'All'}
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

        {visibleGroups.map((group) => (
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
                return (
                  <a className="craft-row" href={href(`/skills/${slug}/${skill.name}/`)} key={skill.name}>
                    <span className="craft-index">{String(runningIndex).padStart(2, '0')}</span>
                    <span>
                      <strong>
                        {pick(locale, skill.title)}
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
        ))}

        <div className="missing-cta">
          <a className="btn btn-primary" href={domain.repo} target="_blank" rel="noreferrer noopener">GitHub</a>
          <a className="btn btn-ghost" href={href('/skills/')}>{zh ? '返回全部领域' : 'All domains'}</a>
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
  const domain = domainOf(slug);
  const doc = SKILL_DOCS.find((item) => item.name === skill && item.domain === slug);
  if (!domain || !doc) return null;

  const domainLabel = pick(locale, domain.name);
  const subcat = subcategoryOf(slug, doc.name);
  const friendlyTitle = pick(locale, doc.title);
  const mechanism = zh ? doc.mechanism.zh : doc.mechanism.en;
  const capabilities = zh ? doc.capabilities.zh : doc.capabilities.en;
  const prompts = zh ? doc.prompts.zh : doc.prompts.en;
  const trust = zh ? doc.trust.zh : doc.trust.en;
  const heroVisualUrl = buildSkillHeroCardDataUrl(doc, domainLabel, zh);

  return (
    <SubpageLayout active="plugins" locale={locale}>
      <nav className="breadcrumb" aria-label="breadcrumb">
        <a href={href('/skills/')}>{zh ? '开源技能' : 'Open skills'}</a><span>/</span>
        <a href={href(`/skills/${slug}/`)}>{domainLabel}</a><span>/</span>
        <span aria-current="page">{doc.name}</span>
      </nav>
      <article className="plugin-detail-page">
        <header className="plugin-detail-head">
          <span className="plugins-eyebrow">
            {domain.plugin} · {domainLabel}{subcat ? ` · ${pick(locale, subcat.label)}` : ''}{doc.version ? ` · v${doc.version}` : ''} · <code>{doc.name}</code>
          </span>
          <h1 className="display">{friendlyTitle}<span className="dot">.</span></h1>
          <p className="lead">{doc.tagline}</p>
          <div className="od-route-actions">
            <a className="btn btn-primary" href="#install">{zh ? '安装' : 'Install'}</a>
            <a className="btn btn-ghost" href={DOC_URL(doc.name)} target="_blank" rel="noreferrer noopener">{zh ? '完整文档 ↗' : 'Full doc ↗'}</a>
          </div>
        </header>

        <ZoomableFigure
          className="skill-hero-card"
          src={heroVisualUrl}
          alt={zh ? `${friendlyTitle}（${doc.name}）运行实况与产出预览` : `${friendlyTitle} (${doc.name}) live preview`}
          zh={zh}
        />

        <div className="plugin-detail-columns">
          <article>
            <h2>{zh ? '为什么需要它' : 'The problem it solves'}</h2>
            <p className="skill-prose"><Inline text={pick(locale, doc.pain)} /></p>

            <h2>{zh ? '它怎么解' : 'How it works'}</h2>
            <p className="skill-prose"><Inline text={pick(locale, doc.solution)} /></p>

            <section className="skill-mechanism-card" aria-label={zh ? '机制与底线卡' : 'Mechanism and guardrails'}>
              <div className="skill-mech-head">
                <span className="skill-mech-kicker">{zh ? '工作机制 · 步步留痕' : 'MECHANISM · STEP BY STEP'}</span>
                <code>{doc.name}</code>
              </div>
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
              <div className="skill-mech-guard">
                <span className="skill-mech-guard-title">{zh ? '边界底线 · 绝不越界' : 'HARD GUARDRAILS'}</span>
                <ul>
                  {mechanism.guardrails.map((g) => (
                    <li key={g}><Inline text={g} /></li>
                  ))}
                </ul>
              </div>
            </section>

            <h2>{zh ? '它能做什么（能力对照）' : 'What it handles'}</h2>
            <div className="skill-table-wrap">
              <table className="skill-cap-table">
                <thead>
                  <tr>
                    <th>{zh ? '你想做什么' : 'Goal'}</th>
                    <th>{zh ? '技能会怎么做' : 'What the skill does'}</th>
                    <th>{zh ? '你会看到什么' : 'What you get'}</th>
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

            <h2>{zh ? '零门槛用法：说人话就能触发' : 'How to trigger it'}</h2>
            <p className="skill-prose">
              {zh
                ? '不用背命令参数，装好后直接用自然语言说出你的目标和范围即可：'
                : 'No flags to memorize—once installed, speak naturally with your goal and scope:'}
            </p>
            <ul className="skill-prompt-list">
              {prompts.map((p) => (
                <li className="skill-prompt-item" key={p}>
                  <span className="skill-prompt-mark">“</span>
                  <span><Inline text={p} /></span>
                </li>
              ))}
            </ul>

            <h2 id="install">{zh ? '支持宿主与安装' : 'Hosts & install'}</h2>
            {doc.install.length > 0 ? (
              doc.install.map((cmd) => (
                <pre className="agent-code" key={cmd}><code>{cmd}</code></pre>
              ))
            ) : (
              <p>{zh ? '见完整文档的安装节。' : 'See the install section in the full doc.'}</p>
            )}
            <p className="skill-prose">
              {zh
                ? 'Claude Code、Codex 与 WorkBuddy（内置腾讯 SkillHub 搜名字或走角色化专家）全支持；默认项目级、明确宿主、单个技能。整域或全局安装须你明确选择，发布不会自动装到本机。'
                : 'Works on Claude Code, Codex, and WorkBuddy. Default is project scope, one explicit host, one skill; whole-domain or global installs always require your choice.'}
            </p>

            <h2>{zh ? '为什么信得过（开源可查与边界）' : 'Why trust it'}</h2>
            <ul>
              {trust.map((item) => (
                <li key={item}><Inline text={item} /></li>
              ))}
            </ul>
          </article>
          <aside className="plugin-detail-aside">
            <span className="plugins-eyebrow">{zh ? '来源与真源' : 'Source'}</span>
            <p>{zh ? '本页内容基于技能真源 SKILL.md 与配套脚本整理，MIT 开源可查。' : 'Grounded in the skill source SKILL.md and scripts; MIT open source.'}</p>
            <a className="btn btn-primary" href={SRC_URL(domain.repo, doc.name)} target="_blank" rel="noreferrer noopener">{zh ? '查看源码 ↗' : 'Source ↗'}</a>
            <a className="btn btn-ghost" href={href(`/skills/${slug}/`)}>← {domainLabel}</a>
            <a className="btn btn-ghost" href={href('/skills/')}>{zh ? '全部领域' : 'All domains'}</a>
          </aside>
        </div>
      </article>
    </SubpageLayout>
  );
}

/** SoiaDeck — desktop + mobile agent orchestration platform detail page. */
export function SoiaDeckPage({ locale }: { locale: LandingLocaleCode }) {
  const href = (path: string) => hrefFor(path, locale);
  const zh = isZh(locale);
  const [heroTab, setHeroTab] = useState(0);
  const [agentFilter, setAgentFilter] = useState<'all' | 'supported' | 'experimental' | 'planned'>('all');

  const heroTabs: ReadonlyArray<{ label: string; src: string; alt: string; note: string }> = zh
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

  const philosophyCards: ReadonlyArray<{ title: string; desc: string }> = zh
    ? [
        { title: 'Private · 本地优先', desc: '对话正文、秘钥与代码留在自己机器上；中继仅转发加密流量，核心桌面管理能力断网可用。' },
        { title: 'Daemon-backed · 永不断流', desc: '对话由本机后端 daemon 持有而非浏览器标签页，关闭界面继续跑，重开按缓冲实时重放。' },
        { title: 'Unified · 一致操控多协议', desc: '抹平 stream-json、app-server、ACP、pi-rpc 与 PTY 差异，切换 Agent 不用重新学一套工作流。' },
        { title: 'Permission-first · 权限可审计', desc: '执行命令、越界写入与联网请求必须先问人批准或拒绝，每次决策落盘会话树可追溯。' },
        { title: 'Composable · 组合现有生态', desc: '自带你已有的 Agent 订阅账号与 CLI，叠加 47 个公开 SOIA 技能和本机 MLX 模型即可工作。' },
        { title: 'Honest · 实事求是交付', desc: '现阶段明确仅发布 macOS arm64 验收安装包与 19 Agent 分级状态，未验收能力绝不虚标。' },
      ]
    : [
        { title: 'Private · Local-first', desc: 'Sessions, keys, and repos stay on your machines; the relay forwards ciphertext only and core controls work offline.' },
        { title: 'Daemon-backed · Persistent', desc: 'The local daemon owns running turns; close the window safely and replay buffered output anytime.' },
        { title: 'Unified · Protocol-agnostic', desc: 'Consistent UX across stream-json, app-server, ACP, pi-rpc, and PTY without re-learning tools.' },
        { title: 'Permission-first · Auditable', desc: 'Commands, out-of-workspace writes, and network calls ask first and persist every decision in the session record.' },
        { title: 'Composable · Zero Lock-in', desc: 'Bring your own CLI subscriptions, local skills (.agents/skills), and Apple Silicon MLX models.' },
        { title: 'Honest · Grounded Scope', desc: 'Currently ships macOS arm64 builds and reports exact agent readiness rather than fake promises.' },
      ];

  const sections: ReadonlyArray<{ id: string; title: string; body: string; image?: string; alt?: string }> = zh
    ? [
        { id: 'works-with', title: '自带你的工具与订阅', body: '无需重新购买额度或放弃熟悉的工作流：直接复用你本机已登录的 Claude Code、Codex、Gemini CLI、Antigravity、GitHub Copilot 等 CLI 订阅，挂载本地 .agents/skills（包括 47 个开源 SOIA 技能），也可叠加本机 MLX 模型。' },
        { id: 'workbench', title: 'AI 作业台', body: '在桌面应用里开 Claude Code、Codex 等对话。每种 Agent 走自己的原生协议；没有原生协议的走 ACP，也有终端 PTY。对话由后端持有：关掉页面 Agent 继续跑，重开从缓冲重放。项目、工作树和权限审批都在这里管。', image: '/soia/products/soiadeck-wb-home.png', alt: 'SoiaDeck AI 作业台首页' },
        { id: 'factory', title: '工坊与项目', body: '左侧工坊切换工作区，下面是插件、作业台、本地 LLM、AI 网络四个入口。项目列表按仓库分组，每个条目显示待审批与待处理数量，新建项目直接在列表里完成。', image: '/soia/products/soiadeck-plugins.png', alt: 'SoiaDeck 插件中心' },
        { id: 'approvals', title: '权限审批', body: '要执行命令、写工作区外文件、联网前先问你。可以逐次允许、本对话内允许或拒绝；多条待审批可逐张处理。每一次决定都进会话记录，可回放。', image: '/soia/products/soiadeck-home.png', alt: 'SoiaDeck 首页待处理与权限审批' },
        { id: 'models', title: '本地 LLM', body: '发现、启停、下载本机模型，并提供一个 OpenAI 兼容入口。现在推理引擎以 MLX 系为主，所以本地模型在 Apple Silicon 上最完整。作业台本身不依赖本地模型。', image: '/soia/products/soiadeck-router.png', alt: 'SoiaDeck 本地 LLM 模型转发' },
        { id: 'network', title: 'AI 网络', body: '本机访问各 AI 服务走哪张网卡、连不连得通。核心管理能力断网可用。', image: '/soia/products/soiadeck-net.png', alt: 'SoiaDeck AI 网络监控' },
        { id: 'remote', title: '远程访问与手机端', body: '电脑开启远程访问或通过中继配对后，手机端可随时查看对话进度、看代码改动与 Diff，并在手机上远程审批权限或止损停轮。', image: '/soia/products/soiadeck-phone.png', alt: 'SoiaDeck 手机端远程访问与设计总览' },
        { id: 'account', title: '远程账号与名下主机', body: '账号网页支持邮箱验证码与 Passkey 登录，集中管理名下绑定的主机指纹、登录设备与中继流量；设备丢失时可一键标记丢失并自动通知中继收回授权。', image: '/soia/products/soiadeck-account.png', alt: 'SoiaDeck 远程账号与名下主机' },
        { id: 'relay', title: '中继服务', body: '不在同一局域网时，手机与电脑通过轻量中继建立加密通道，中继只做转发不看对话内容；维护期间支持 90 秒内自动续上，连接不断。', image: '/soia/products/soiadeck-relay.png', alt: 'SoiaDeck 中继服务状态与通道监控' },
        { id: 'agents', title: '19 个 coding agent 接入清单与演进', body: '以 SoiaDeck 静态 manifest 真源（agent-manifest-index.json）为准，共登记 19 个 Agent：正式支持 4 个（stream-json / app-server / ACP / pi-rpc）、试验接入 9 个（统一走 ACP stdio）、计划接入 6 个。后续按底层统一方案收口到单一目录真源，补齐启停排序、更新计划、技能统计、活动账本以及 WorkBuddy 只读导入 + CodeBuddy ACP 分流。', image: '/soia/products/soiadeck-19-agents.png', alt: 'SoiaDeck 已接入 19 个 Coding Agent 矩阵' },
        { id: 'philosophy', title: '设计哲学与边界', body: '站在代码、API 密钥与远程主机之间的工具必须保持中立、可审查、不强绑云厂商。以下六条是 SoiaDeck 每一项能力的设计底线：' },
        { id: 'open', title: '即将开源', body: '现在是私有仓，持续开发中。目前只发 macOS arm64 安装包；Linux / Windows 有构建入口，但没验收、不发包。官网不假装已有公开下载。' },
      ]
    : [
        { id: 'works-with', title: 'Bring your tools & subscriptions', body: 'No forced lock-in or quota reselling: reuse your existing Claude Code, Codex, Gemini CLI, Antigravity, and Copilot subscriptions alongside local .agents/skills (including 47 open SOIA skills) and local MLX models.' },
        { id: 'workbench', title: 'AI Workbench', body: 'Open Claude Code, Codex and other agent conversations in the desktop app. Each agent uses its native protocol; others use ACP or a PTY. The backend owns the conversation: close the page and the agent keeps working.', image: '/soia/products/soiadeck-wb-home.png', alt: 'SoiaDeck AI Workbench home' },
        { id: 'factory', title: 'Workshops and projects', body: 'Switch workspaces from the left rail; plugins, workbench, local LLM and AI network sit under it. Projects are grouped by repository with pending approvals and tasks counted per row.', image: '/soia/products/soiadeck-plugins.png', alt: 'SoiaDeck Plugin Center' },
        { id: 'approvals', title: 'Approvals', body: 'Commands, writes outside the workspace and network access ask first. Allow once, allow for this conversation, or deny; batch cards can be handled one by one. Every decision lands in the session record.', image: '/soia/products/soiadeck-home.png', alt: 'SoiaDeck desktop home and approvals' },
        { id: 'models', title: 'Local LLM', body: 'Discover, start/stop and download local models, plus one OpenAI-compatible endpoint. Engines today are mostly MLX, so local models are most complete on Apple Silicon.', image: '/soia/products/soiadeck-router.png', alt: 'SoiaDeck Local LLM router' },
        { id: 'network', title: 'AI Network', body: 'Which network interface the machine uses to reach AI services, and whether they are reachable. Core management still works offline.', image: '/soia/products/soiadeck-net.png', alt: 'SoiaDeck AI Network' },
        { id: 'remote', title: 'Remote & Mobile', body: 'Pair your phone over local LAN or relay to follow running sessions, inspect diffs, approve tool permissions, or stop a turn on the go.', image: '/soia/products/soiadeck-phone.png', alt: 'SoiaDeck mobile surface' },
        { id: 'account', title: 'Remote account & bound hosts', body: 'Sign in with email verification or Passkey on the Account Web to manage bound host fingerprints, active devices, and relay usage — or mark a lost device to revoke access immediately.', image: '/soia/products/soiadeck-account.png', alt: 'SoiaDeck account web and bound hosts' },
        { id: 'relay', title: 'Relay service', body: 'When away from your local network, desktop and mobile connect through an encrypted relay that forwards traffic without inspecting contents, with automatic 90s reconnect during maintenance.', image: '/soia/products/soiadeck-relay.png', alt: 'SoiaDeck relay service' },
        { id: 'agents', title: '19 coding agents: current matrix & plan', body: 'Tracked in SoiaDeck’s agent-manifest-index.json: 4 supported (stream-json, app-server, ACP, pi-rpc), 9 experimental (ACP stdio), and 6 planned—with upcoming backend unification adding enable/order prefs, update plans, extension counts, activity ledger, and WorkBuddy read-only import + CodeBuddy ACP.', image: '/soia/products/soiadeck-19-agents.png', alt: 'SoiaDeck 19 coding agents' },
        { id: 'philosophy', title: 'Engineering philosophy', body: 'A tool sitting between you, your codebase, your keys, and your machines must stay transparent and neutral:' },
        { id: 'open', title: 'Coming open source', body: 'Private today, under active development. Only macOS arm64 installers ship; Linux and Windows have build entry points but are not released.' },
      ];
  const currentTab = heroTabs[heroTab] ?? heroTabs[0];
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
              ? '跨端 AI 作业台：本机 daemon + 桌面 / 手机 / 网页 / CLI。在同一工作台并行驱动 19 种 Coding Agent，随时随地处理权限、代码 Diff 与工作树。'
              : 'Cross-device AI Workbench: one local daemon plus desktop, mobile, browser, and CLI. Run 19 coding agents across workspaces, diffs, and approvals from your desk or phone.'}
          </p>
        </header>
        <section className="deck-showcase" aria-label={zh ? 'SoiaDeck 场景切换演示' : 'SoiaDeck interactive scene preview'}>
          <div className="deck-tab-bar" role="tablist">
            {heroTabs.map((tab, idx) => (
              <button
                type="button"
                role="tab"
                aria-selected={heroTab === idx}
                className={heroTab === idx ? 'is-active' : undefined}
                key={tab.label}
                onClick={() => setHeroTab(idx)}
              >
                {tab.label}
              </button>
            ))}
          </div>
          <ZoomableFigure src={currentTab.src} alt={currentTab.alt} zh={zh} />
          <p className="deck-showcase-caption">{currentTab.note}</p>
        </section>
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
                {section.id === 'agents' && (
                  <>
                    <div className="agent-filter-bar" role="tablist" aria-label={zh ? '按接入状态筛选 Agent' : 'Filter agents by status'}>
                      {(
                        [
                          { id: 'all', label: zh ? '全部' : 'All', count: CODING_AGENTS_19.length },
                          { id: 'supported', label: zh ? '正式支持' : 'Supported', count: CODING_AGENTS_19.filter((a) => a.level === 'supported').length },
                          { id: 'experimental', label: zh ? '试验接入' : 'Experimental', count: CODING_AGENTS_19.filter((a) => a.level === 'experimental').length },
                          { id: 'planned', label: zh ? '计划接入' : 'Planned', count: CODING_AGENTS_19.filter((a) => a.level === 'planned').length },
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
                              ? zh ? '正式支持' : 'Supported'
                              : agent.level === 'experimental'
                                ? zh ? '试验接入' : 'Experimental'
                                : zh ? '计划接入' : 'Planned';
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
                                <span><strong>{zh ? '协议' : 'Protocol'}:</strong> {pick(locale, agent.protocol)}</span>
                                <span><strong>{zh ? '版本' : 'Version'}:</strong> {pick(locale, agent.version)}</span>
                                <span><strong>{zh ? '认证' : 'Auth'}:</strong> {pick(locale, agent.auth)}</span>
                              </div>
                              <p className="agent-detail-desc">{pick(locale, agent.detail)}</p>
                            </li>
                          );
                        })}
                    </ol>
                  </>
                )}
                {section.id === 'philosophy' && (
                  <div className="deck-philosophy-grid">
                    {philosophyCards.map((card) => (
                      <div className="deck-philosophy-card" key={card.title}>
                        <strong>{card.title}</strong>
                        <p>{card.desc}</p>
                      </div>
                    ))}
                  </div>
                )}
                {section.image ? (
                  <ZoomableFigure
                    src={section.image}
                    alt={section.alt ?? section.title}
                    zh={zh}
                    lazy
                    marginTop={18}
                  />
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

/** SoiaCode (si) — native HTML interactive architecture diagrams grounded in soiacode/docs. */
function SoiaCodeProductDiagram({ zh }: { zh: boolean }) {
  return (
    <section className="sc-diagram sc-hero-diagram" aria-label={zh ? 'SoiaCode 五层产品架构' : 'SoiaCode 5-layer product architecture'}>
      <div className="sc-diagram-head">
        <span className="sc-diagram-title">{zh ? 'PRODUCT ARCHITECTURE · 五层产品架构总览' : 'PRODUCT ARCHITECTURE · 5-LAYER OVERVIEW'}</span>
        <span className="sc-diagram-sub">{zh ? '人守住注意力 · 系统守住安全' : 'Humans guard attention · System guards safety'}</span>
      </div>

      <div className="sc-band is-cyan">
        <div className="sc-band-head">
          <span className="sc-band-tag">{zh ? 'L4 之外 · 调用方（谁在用 si）' : 'CALLERS · WHO DRIVES SI'}</span>
          <span className="sc-band-note">{zh ? '开发者交互 / CI 脚本 / 编辑器 / 后台 / 其他 Agent' : 'Humans / Scripts / Editors / Services / External Agents'}</span>
        </div>
        <div className="sc-node-grid cols-3">
          <div className="sc-node">
            <strong>{zh ? '人（终端交互）' : 'Human CLI'}</strong>
            <span>{zh ? '日常编码 + 关键审批' : 'Daily coding + approvals'}</span>
          </div>
          <div className="sc-node">
            <strong>{zh ? '应用与编辑器' : 'Apps & Editors'}</strong>
            <span>{zh ? 'CI 脚本 / Zed ACP / 图形壳 RPC / Rust 嵌入' : 'CI print / Zed ACP / GUI RPC / Rust embed'}</span>
          </div>
          <div className="sc-node">
            <strong>{zh ? '其他 Agent' : 'External Agents'}</strong>
            <span>{zh ? '经子工具或 MCP / A2A 调用 si' : 'Call si via print, RPC, MCP, or A2A'}</span>
          </div>
        </div>
      </div>

      <div className="sc-arrow-down">↓</div>

      <div className="sc-band is-slate">
        <div className="sc-band-head">
          <span className="sc-band-tag">{zh ? '入口层 · 4 种运行方式 + 1 个 Rust 库' : 'ENTRYPOINTS · 4 RUN MODES + 1 SDK'}</span>
        </div>
        <div className="sc-node-grid">
          <div className="sc-node"><strong>si</strong><span>{zh ? '终端交互 Line-mode TUI' : 'Interactive CLI'}</span></div>
          <div className="sc-node"><strong>si -p</strong><span>{zh ? 'Print 单次脚本输出' : 'One-shot print mode'}</span></div>
          <div className="sc-node"><strong>--mode rpc</strong><span>{zh ? 'stdio JSON-RPC 长期驱动' : 'Long-lived stdio RPC'}</span></div>
          <div className="sc-node"><strong>--mode acp</strong><span>{zh ? 'Zed 等编辑器接入' : 'Editor ACP mode'}</span></div>
          <div className="sc-node"><strong>soiacode-sdk</strong><span>{zh ? 'Rust 进程内嵌入门面' : 'In-process Rust crate'}</span></div>
        </div>
      </div>

      <div className="sc-arrow-down">↓</div>

      <div className="sc-band is-amber">
        <div className="sc-band-head">
          <span className="sc-band-tag">{zh ? '内核核心（L0–L2）+ 内置能力（L3）' : 'MINIMAL KERNEL (L0–L2) + BUILT-IN CAPABILITIES (L3)'}</span>
          <span className="sc-band-note">{zh ? '极小、可审查、零遥测' : 'Small, auditable, zero telemetry'}</span>
        </div>
        <div className="sc-node-grid cols-2">
          <div className="sc-node"><strong>{zh ? 'agent 循环 · L2' : 'agent loop · L2'}</strong><span>{zh ? '上下文裁剪 · 压缩摘要 · Steer/FollowUp' : 'Context trim · Compaction · Steer/FollowUp'}</span></div>
          <div className="sc-node"><strong>{zh ? '挂载点与审批 · 10 Hook' : 'Mounts & approval · 10 hooks'}</strong><span>{zh ? 'deny > ask > allow · 写保护路径拦截' : 'deny > ask > allow · write-protected paths'}</span></div>
          <div className="sc-node"><strong>{zh ? 'JSONL 会话树 · L1' : 'JSONL session tree · L1'}</strong><span>{zh ? '/tree 分支 · /fork 深拷贝 · Blob 旁路' : '/tree branch · /fork copy · Blob offload'}</span></div>
          <div className="sc-node"><strong>{zh ? '5 工具 + 扩展宿主 · L3' : '5 tools + ext host · L3'}</strong><span>{zh ? 'read/write/edit/bash/grep · MCP 客户端 · 可选沙箱' : 'read/write/edit/bash/grep · MCP client · opt sandbox'}</span></div>
        </div>
      </div>

      <div className="sc-arrow-down">↓</div>

      <div className="sc-band is-emerald">
        <div className="sc-band-head">
          <span className="sc-band-tag">{zh ? '外部 · 内核之外独立演化' : 'PERIPHERAL · OUTSIDE THE KERNEL'}</span>
          <span className="sc-band-note">{zh ? 'JSON-RPC / stdio / HTTPS' : 'JSON-RPC / stdio / HTTPS'}</span>
        </div>
        <div className="sc-node-grid">
          <div className="sc-node"><strong>{zh ? '模型厂商' : 'LLM Providers'}</strong><span>{zh ? 'Anthropic / OpenAI / Gemini / Bedrock' : 'Anthropic / OpenAI / Gemini / Bedrock'}</span></div>
          <div className="sc-node"><strong>{zh ? '34 个官方扩展' : '34 Extensions'}</strong><span>{zh ? '独立子进程 · si install 按需装' : 'Subprocesses via si install'}</span></div>
          <div className="sc-node"><strong>{zh ? '自运行外围服务' : 'Standalone Services'}</strong><span>{zh ? 'si serve / mcp-server / a2a / inline' : 'si serve / mcp-server / a2a / inline'}</span></div>
          <div className="sc-node"><strong>soiacode-exec</strong><span>{zh ? 'SSH / 容器远端执行端（无凭据）' : 'Remote exec endpoint (no creds)'}</span></div>
        </div>
      </div>
    </section>
  );
}

function SoiaCodeSystemDiagram({ zh }: { zh: boolean }) {
  return (
    <div className="sc-diagram" aria-label={zh ? '系统运行时单进程多会话数据流' : 'System runtime process dataflow'}>
      <div className="sc-diagram-head">
        <span className="sc-diagram-title">{zh ? 'SYSTEM RUNTIME · 单 si 进程与外部边界' : 'SYSTEM RUNTIME · SINGLE PROCESS & EXTERNAL IO'}</span>
        <span className="sc-diagram-sub">{zh ? '多会话同进程隔离，所有落盘只追加 JSONL' : 'Multi-session in one process, append-only JSONL'}</span>
      </div>

      <div className="sc-band is-violet">
        <div className="sc-band-head">
          <span className="sc-band-tag">{zh ? 'si 进程内（可同时承载多个互不干扰的会话）' : 'INSIDE si PROCESS (MULTIPLE ISOLATED SESSIONS)'}</span>
        </div>
        <div className="sc-node" style={{ justifySelf: 'center', minWidth: '220px', textAlign: 'center' }}>
          <strong>{zh ? '入口调度 · 创建或恢复会话' : 'Entrypoint · Create or resume session'}</strong>
          <span>{zh ? 'stdio (RPC/ACP) · 命令行参数 (print) · 进程内 (Rust SDK)' : 'stdio (RPC/ACP) · args (print) · in-proc (Rust SDK)'}</span>
        </div>
        <div className="sc-bus-row">
          <div className="sc-node">
            <strong>{zh ? '挂载点与审批' : 'Mounts & Approval'}</strong>
            <span>{zh ? '每次工具/请求前后裁决' : 'Gate every call & request'}</span>
          </div>
          <div className="sc-bus-arrow">← {zh ? '调用前后' : 'hooks'} →</div>
          <div className="sc-node" style={{ borderColor: '#8b5cf6', background: '#faf8ff' }}>
            <strong>{zh ? 'agent 主循环' : 'agent loop'}</strong>
            <span>{zh ? '上下文拼接 · 回合控制 · 调度' : 'Context · Turn loop · Dispatch'}</span>
          </div>
          <div className="sc-bus-arrow">→ {zh ? '每一步' : 'every step'} →</div>
          <div className="sc-node">
            <strong>{zh ? '会话写入器' : 'Session Writer'}</strong>
            <span>{zh ? '追加到 ~/.soiacode/sessions/' : 'Append to ~/.soiacode/sessions/'}</span>
          </div>
        </div>
        <div className="sc-node-grid cols-3">
          <div className="sc-node">
            <strong>{zh ? '模型客户端 (L1)' : 'Provider Client (L1)'}</strong>
            <span>HTTPS {zh ? '流式 → 模型厂商' : 'stream → LLM Vendor'}</span>
          </div>
          <div className="sc-node">
            <strong>{zh ? '内置工具 (L3)' : 'Built-in Tools (L3)'}</strong>
            <span>{zh ? '管道 → 命令子进程' : 'Pipe → Command subprocess'}</span>
          </div>
          <div className="sc-node">
            <strong>{zh ? '扩展宿主 (L3)' : 'Extension Host (L3)'}</strong>
            <span>JSON-RPC → {zh ? '扩展 / MCP 子进程' : 'Extensions / MCP'}</span>
          </div>
        </div>
      </div>

      <div className="sc-band is-amber">
        <div className="sc-band-head">
          <span className="sc-band-tag">{zh ? '外部进程与持久化存储' : 'EXTERNAL PROCESSES & DISK'}</span>
          <span className="sc-band-note">{zh ? '~/.soiacode/{sessions,audit,confirmed.json,crashes.jsonl}' : '~/.soiacode/{sessions,audit,confirmed.json,crashes.jsonl}'}</span>
        </div>
        <div className="sc-node-grid">
          <div className="sc-node"><strong>{zh ? '模型厂商 API' : 'Model APIs'}</strong><span>{zh ? '仅经 soiacode-http 出站' : 'Outbound solely via soiacode-http'}</span></div>
          <div className="sc-node"><strong>{zh ? 'OS 命令子进程' : 'OS Subprocesses'}</strong><span>{zh ? '仅经 soiacode-local 拉起' : 'Spawned solely via soiacode-local'}</span></div>
          <div className="sc-node"><strong>{zh ? '扩展与 MCP' : 'Ext & MCP'}</strong><span>{zh ? '独立进程，不享内核内存' : 'Isolated OS processes'}</span></div>
          <div className="sc-node"><strong>{zh ? '本地磁盘 JSONL' : 'Local Disk JSONL'}</strong><span>{zh ? '只追加记录 + Blob 文件' : 'Append-only records + blobs'}</span></div>
        </div>
      </div>
    </div>
  );
}

function SoiaCodePeripheralDiagram({ zh }: { zh: boolean }) {
  const rows: ReadonlyArray<{ cmd: string; proto: string; role: string }> = zh
    ? [
        { cmd: 'si serve', proto: 'Unix socket / TCP+TLS', role: '常驻后台托管会话；复用 JSON-RPC 分派，分级 Token（read/prompt/approve/admin）管理跨终端接入。' },
        { cmd: 'si mcp-server', proto: 'stdio MCP', role: '把 si 包装为标准 MCP Server 供外部 Agent 调用（交任务 / 等待 / 取消 / 列会话），审批默认按规则或转交调用方。' },
        { cmd: 'si a2a', proto: 'HTTP + TLS + Token', role: '以 Agent2Agent 协议对外暴露 Agent Card；只听可信调用方 Token，触发的高危操作未预设放行一律拒绝。' },
        { cmd: 'si inline', proto: 'stdio LSP', role: '充当编辑器灰字行内补全语言服务器（si inline lsp）；不进长会话，默认屏蔽 .env 与密钥文件。' },
        { cmd: 'soiacode-exec', proto: 'SSH / 容器 stdio', role: '放到远端主机或容器里的轻量执行端；只依赖 local 与 protocol，按指令读写文件并起进程，不存用户凭据。' },
      ]
    : [
        { cmd: 'si serve', proto: 'Unix socket / TCP+TLS', role: 'Background daemon holding live sessions; exposes scoped tokens (read/prompt/approve/admin) across devices.' },
        { cmd: 'si mcp-server', proto: 'stdio MCP', role: 'Exposes si as a standard MCP server (submit / wait / cancel / list) for peer agents over stdio.' },
        { cmd: 'si a2a', proto: 'HTTP + TLS + Token', role: 'Exposes Agent2Agent discovery & task execution with per-caller tokens and strict approval rules.' },
        { cmd: 'si inline', proto: 'stdio LSP', role: 'Acts as an IDE LSP for FIM/chat inline completion; skips long session history and ignores .env/secret files.' },
        { cmd: 'soiacode-exec', proto: 'SSH / container stdio', role: 'Remote worker deployed inside SSH hosts or containers; only depends on local + protocol and holds zero credentials.' },
      ];
  return (
    <div className="sc-diagram" aria-label={zh ? '外围独立运行程序交互架构' : 'Standalone peripheral processes'}>
      <div className="sc-diagram-head">
        <span className="sc-diagram-title">{zh ? 'PERIPHERALS · 外围自运行程序边界' : 'PERIPHERALS · STANDALONE BINARIES'}</span>
        <span className="sc-diagram-sub">{zh ? '全为独立可执行/子命令，内核 si 本体不反向依赖它们' : 'Separate binaries/subcommands — the kernel never depends backward on them'}</span>
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

function SoiaCodeToolSequenceDiagram({ zh }: { zh: boolean }) {
  const [stepIdx, setStepIdx] = useState(0);
  const lanes = ['provider', 'dispatch', 'mounts', 'approval', 'writer', 'tools'] as const;
  const steps: ReadonlyArray<{ no: string; from: string; to: string; route: string; desc: string }> = zh
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
    <div className="sc-diagram" aria-label={zh ? '单次工具调用审批全链路时序' : 'Tool call sequence'}>
      <div className="sc-diagram-head">
        <span className="sc-diagram-title">{zh ? 'TOOL SEQUENCE · 单次工具调用全链路（10 步可点选推演）' : 'TOOL SEQUENCE · 10-STEP INTERACTIVE WALKTHROUGH'}</span>
        <div className="sc-seq-controls">
          <div className="sc-seq-btns">
            <button type="button" onClick={() => setStepIdx((s) => (s - 1 + steps.length) % steps.length)}>
              {zh ? '上一步' : 'Prev'}
            </button>
            <button type="button" onClick={() => setStepIdx((s) => (s + 1) % steps.length)}>
              {zh ? '下一步' : 'Next'}
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

function SoiaCodeCrateDiagram({ zh }: { zh: boolean }) {
  return (
    <div className="sc-diagram" aria-label={zh ? 'SoiaCode Crate 五层工程架构' : 'SoiaCode Rust crate layers'}>
      <div className="sc-diagram-head">
        <span className="sc-diagram-title">{zh ? 'WORKSPACE CRATES · 严格 L4 → L0 单向依赖矩阵' : 'WORKSPACE CRATES · STRICT L4 → L0 HIERARCHY'}</span>
        <span className="sc-diagram-sub">{zh ? '同层互不依赖，旁路与外围独立演进' : 'No sibling coupling, strict IO isolation'}</span>
      </div>

      <div className="sc-band is-cyan">
        <div className="sc-band-head"><span className="sc-band-tag">{zh ? 'L4 · 入口层（只接线）' : 'L4 · ENTRYPOINTS'}</span></div>
        <div className="sc-node-grid cols-2">
          <div className="sc-node"><strong>soiacode</strong><span>{zh ? '命令 si：组装各 crate 与运行模式' : 'CLI binary & assembler'}</span></div>
          <div className="sc-node"><strong>soiacode-rpc / -acp</strong><span>{zh ? 'stdio JSON-RPC 与编辑器 ACP 协议适配' : 'stdio JSON-RPC & ACP'}</span></div>
          <div className="sc-node"><strong>soiacode-sdk</strong><span>{zh ? '稳定 Rust 库门面（CLI/RPC/ACP 均建在其上）' : 'Stable Rust embedding facade'}</span></div>
        </div>
      </div>

      <div className="sc-band is-violet">
        <div className="sc-band-head"><span className="sc-band-tag">{zh ? 'L3 · 能力层' : 'L3 · CAPABILITIES'}</span></div>
        <div className="sc-node-grid">
          <div className="sc-node"><strong>soiacode-tools</strong><span>{zh ? '5 内置工具 + 本机环境' : 'Built-in tools'}</span></div>
          <div className="sc-node"><strong>soiacode-context</strong><span>{zh ? 'AGENTS.md / 规则来源' : 'Context sources'}</span></div>
          <div className="sc-node"><strong>soiacode-config</strong><span>{zh ? '三级配置与 trust.json' : 'Config & trust'}</span></div>
          <div className="sc-node"><strong>soiacode-extension</strong><span>{zh ? '扩展进程 / MCP / 远端环境宿主' : 'Extension subprocess host'}</span></div>
        </div>
      </div>

      <div className="sc-band is-amber">
        <div className="sc-band-head"><span className="sc-band-tag">{zh ? 'L2–L1 · 内核与基础层' : 'L2–L1 · CORE LOOP & FOUNDATIONS'}</span></div>
        <div className="sc-node-grid">
          <div className="sc-node">
            <div className="sc-node-top"><strong>soiacode-agent</strong><span className="sc-badge core">L2 {zh ? '内核' : 'Core'}</span></div>
            <span>{zh ? 'agent 循环与工具派发' : 'Agent loop & dispatch'}</span>
          </div>
          <div className="sc-node">
            <div className="sc-node-top"><strong>soiacode-provider</strong><span className="sc-badge core">L1 {zh ? '内核' : 'Core'}</span></div>
            <span>{zh ? '5 种 LLM 线协议（Gemini/Bedrock 可选 feature）' : '5 wire protocols'}</span>
          </div>
          <div className="sc-node">
            <div className="sc-node-top"><strong>soiacode-session</strong><span className="sc-badge core">L1 {zh ? '内核' : 'Core'}</span></div>
            <span>{zh ? 'JSONL 树存储与 Blob 旁路' : 'JSONL store & blobs'}</span>
          </div>
          <div className="sc-node">
            <div className="sc-node-top"><strong>soiacode-mcp</strong><span className="sc-badge opt">L1</span></div>
            <span>{zh ? '外部 MCP 客户端' : 'MCP client'}</span>
          </div>
          <div className="sc-node">
            <div className="sc-node-top"><strong>soiacode-sandbox</strong><span className="sc-badge opt">L1 {zh ? '可选' : 'Opt'}</span></div>
            <span>{zh ? 'feature 默认关闭' : 'Disabled by default'}</span>
          </div>
        </div>
      </div>

      <div className="sc-band is-slate">
        <div className="sc-band-head"><span className="sc-band-tag">{zh ? 'L0 · 底层（唯一 IO 边界）与旁路' : 'L0 · PRIMITIVES & BYPASS CRATES'}</span></div>
        <div className="sc-node-grid cols-3">
          <div className="sc-node">
            <div className="sc-node-top"><strong>soiacode-http</strong><span className="sc-badge base">{zh ? '唯一联网' : 'HTTP'}</span></div>
            <span>{zh ? '代理、自定义 CA、TLS、请求头脱敏' : 'Proxy, custom CA, header redact'}</span>
          </div>
          <div className="sc-node">
            <div className="sc-node-top"><strong>soiacode-local</strong><span className="sc-badge base">{zh ? '唯一本地IO' : 'OS'}</span></div>
            <span>{zh ? '原子写、路径解析、进程组起停' : 'Atomic write, paths, process groups'}</span>
          </div>
          <div className="sc-node">
            <div className="sc-node-top"><strong>soiacode-protocol</strong><span className="sc-badge core">{zh ? '零 IO' : 'Zero-IO'}</span></div>
            <span>{zh ? '全仓与扩展唯一类型真源' : 'Single type source of truth'}</span>
          </div>
        </div>
        <div className="sc-node-grid cols-2">
          <div className="sc-node"><strong>{zh ? '旁路（tui / testkit / eval）' : 'Bypass (tui / testkit / eval)'}</strong><span>{zh ? '仅限终端 UI、假厂商回放与离线评估，不反侵入内核' : 'Optional TUI & offline harness/eval'}</span></div>
          <div className="sc-node"><strong>{zh ? '外围（extkit / ext-* / svc-* / exec）' : 'Peripherals (extkit / ext-* / svc-* / exec)'}</strong><span>{zh ? '只依赖 protocol，作为独立二进制与子进程演进' : 'Depend only on protocol, evolve out-of-process'}</span></div>
        </div>
      </div>
    </div>
  );
}

/** SoiaCode (si) — architecture & specification detail page grounded in soiacode/docs. */
export function SoiaCodePage({ locale }: { locale: LandingLocaleCode }) {
  const href = (path: string) => hrefFor(path, locale);
  const zh = isZh(locale);
  const toc: ReadonlyArray<{ id: string; label: string }> = zh
    ? [
        { id: 'what', label: '1. 它是做什么的' },
        { id: 'support', label: '2. 支持什么能力' },
        { id: 'boundaries', label: '3. 精确边界与安全' },
        { id: 'architecture', label: '4. 工程分层与隔离' },
        { id: 'roadmap', label: '5. 路线与当前进度' },
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
            {zh
              ? 'SOIA 家族 · 方案与架构设计阶段（0.0.1 M1 进行中 · MIT）'
              : 'SOIA family · architecture & design stage (0.0.1 M1 active · MIT)'}
          </span>
          <h1 className="display">SoiaCode (si)</h1>
          <p className="lead">
            {zh
              ? '用 Rust 编写的轻量 Coding Agent 内核与命令行工具。核心宗旨是「人守住注意力，系统守住安全」（Your attention is all it needs.）——把极小、可审查、高确定性的循环与权限网关留在单二进制内核，把协作、常驻、浏览器、团队策略与远程执行全部解耦为独立扩展。'
              : 'A lightweight Rust coding agent kernel and CLI (si). Built around “humans guard attention, the system guards safety” (Your attention is all it needs.) — keeping a minimal, auditable agent loop and permission gateway in one static binary while decoupling daemons, team policies, browsers, and remote execution into extensions.'}
          </p>
        </header>

        <SoiaCodeProductDiagram zh={zh} />

        <div className="tutorial-detail-layout">
          <aside className="missing-toc">
            <span>{zh ? '本页目录' : 'On this page'}</span>
            {toc.map((item) => (
              <a href={`#${item.id}`} key={item.id}>{item.label}</a>
            ))}
          </aside>

          <div className="missing-article">
            <section id="what">
              <h2>{zh ? '1. 它到底做什么的' : '1. What it actually does'}</h2>
              <p>
                {zh
                  ? 'SoiaCode 不是一套重型 IDE 或托管 SaaS，而是一个可独立部署的 Agent 执行内核（命令行 si）。它专注解决三件事：低噪声地与模型对话改代码、在每次工具调用前把风险挡在确定性权限关口、以及把完整过程写成可回放、可分叉的明文会话树。'
                  : 'SoiaCode is not a heavyweight IDE or hosted SaaS control plane. It is a standalone Rust agent kernel (si) focused on three jobs: coding cleanly with low context noise, enforcing deterministic permission checks before every side effect, and persisting an append-only, replayable session tree.'}
              </p>

              <div className="soiacode-pill-row">
                {(zh
                  ? ['人守住注意力', '系统守住安全', '单二进制极小内核', '外围独立演化', '默认零遥测']
                  : ['Attention first', 'System-enforced safety', 'Single static binary', 'Independent peripheral evolution', 'Zero telemetry by default']
                ).map((pill) => (
                  <span className="soiacode-pill" key={pill}>{pill}</span>
                ))}
              </div>

              <h3>{zh ? '核心工作机制' : 'Core runtime mechanics'}</h3>
              <ul>
                <li>
                  {zh
                    ? '省注意力与上下文工程：系统提示词保持短小；工具输出先经过裁剪（Trim）和大文本旁路落盘（Blob offloading，会话里只留引用）再进入上下文；只在权限审批、风险写入与方向确认时打断人。'
                    : 'Attention & context engineering: short system prompt; tool outputs are trimmed and large blobs are offloaded with references before entering model context, interrupting humans only on approvals, risk, or direction.'}
                </li>
                <li>
                  {zh
                    ? '只追加树状会话（Append-only JSONL）：每个会话落盘为一份明文 .jsonl（在线可直接 grep / tail），每条记录带 id 与 parentId 构成树。/tree 可在同一文件任意节点长出新分支，/fork 复制路径与快照成独立新会话；edit 前自动保留文件快照。'
                    : 'Append-only tree sessions (JSONL): each session writes plain .jsonl records with id and parentId. /tree branches inside the same file; /fork copies lineage and blobs into an independent session; pre-edit file snapshots stay referenced.'}
                </li>
                <li>
                  {zh
                    ? '长任务 = 长会话：不另造第二套脱离会话的任务循环，通过上下文压缩摘要、Steer（即时注入下一轮）与 FollowUp（排队等当前轮完成）推进长程工作，支持断点恢复与多会话共享同一 si 进程。'
                    : 'Long task = long session: no separate orchestration engine outside sessions; long runs advance via compaction summaries, Steer/FollowUp queues, and clean resume across sessions inside one si process.'}
                </li>
              </ul>

              <SoiaCodeSystemDiagram zh={zh} />
            </section>

            <section id="support">
              <h2>{zh ? '2. 它支持什么能力' : '2. What it supports'}</h2>
              <p>
                {zh
                  ? '内核保持最小闭环，常用开发场景直接开箱；更重的工作流、常驻运维、浏览器操控和团队规则全部通过 34 个官方扩展与标准协议按需安装。'
                  : 'The core stays small out of the box, while heavier workflows, daemons, browser driving, and org policies load cleanly through 34 official extensions and standard protocols.'}
              </p>

              <div className="skill-table-wrap">
                <table className="skill-cap-table">
                  <thead>
                    <tr>
                      <th>{zh ? '能力维度' : 'Capability'}</th>
                      <th>{zh ? '具体支持范围（来自 docs 规格）' : 'Supported scope (from docs)'}</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td><strong>{zh ? '5 种运行方式' : '5 run modes'}</strong></td>
                      <td>
                        {zh
                          ? 'si（Line-mode 终端交互）、si -p "任务"（Print 无交互脚本/CI 排障）、si --mode rpc（stdio JSON-RPC 长期驱动）、si --mode acp（Zed 等编辑器接入）、soiacode-sdk（Rust 库门面直接嵌入宿主）。'
                          : 'si (interactive line-mode terminal), si -p "task" (print/CI mode), si --mode rpc (long-lived stdio JSON-RPC), si --mode acp (editors like Zed), and soiacode-sdk (Rust crate embedding).'}
                      </td>
                    </tr>
                    <tr>
                      <td><strong>{zh ? '5 个内置工具' : '5 built-in tools'}</strong></td>
                      <td>
                        {zh
                          ? 'read、write、edit、命令执行（bash / powershell）、grep。其余专业能力全部不硬编码进内核。'
                          : 'read, write, edit, command execution (bash / powershell), and grep. Everything else lives outside the core.'}
                      </td>
                    </tr>
                    <tr>
                      <td><strong>{zh ? '5 种模型线协议' : '5 wire protocols'}</strong></td>
                      <td>
                        {zh
                          ? 'soiacode-provider 支持 Anthropic、OpenAI Chat、OpenAI Responses，以及按 feature 编入的 Gemini 与 Bedrock。'
                          : 'soiacode-provider supports Anthropic, OpenAI Chat, OpenAI Responses, plus feature-gated Gemini and Bedrock.'}
                      </td>
                    </tr>
                    <tr>
                      <td><strong>{zh ? '扩展与 MCP 生态' : 'Extensions & MCP'}</strong></td>
                      <td>
                        {zh
                          ? '内置 MCP 客户端 + soiacode-extkit 扩展开发套件；官方提供 8 大类共 34 个可扩展包（si install <名>），运行在独立子进程或通过 si <服务> 独立启动。'
                          : 'Built-in MCP client + soiacode-extkit SDK; 34 official extensions across 8 categories via si install <name>, running as isolated subprocesses or standalone si <service> processes.'}
                      </td>
                    </tr>
                    <tr>
                      <td><strong>{zh ? '数据落盘目录' : 'Local state layout'}</strong></td>
                      <td>
                        {zh
                          ? '集中存于 ~/.soiacode/（sessions、settings.json、trust.json、extensions、bin、confirmed.json、serve、logs、crashes.jsonl、audit），支持项目级 .soiacode/ 与环境变量引用（"$ENV_VAR"）。'
                          : 'Stored under ~/.soiacode/ (sessions, settings.json, trust.json, extensions, bin, confirmed.json, serve, logs, crashes.jsonl, audit), with project-level .soiacode/ and "$ENV_VAR" secret refs.'}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <h3>{zh ? '34 个官方扩展全景（按能力域）' : '34 official extensions by capability domain'}</h3>
              <ul>
                <li>
                  <strong>{zh ? '多智能体与长任务编排' : 'Multi-agent & task workflows'}：</strong>
                  <span className="skill-inline-code">subagent</span> <span className="skill-inline-code">handoff</span> <span className="skill-inline-code">taskboard</span> <span className="skill-inline-code">jobs-panel</span> <span className="skill-inline-code">goal</span> <span className="skill-inline-code">memory</span> <span className="skill-inline-code">codemode</span> <span className="skill-inline-code">hooks</span> <span className="skill-inline-code">intercom</span> <span className="skill-inline-code">agent-claude</span> <span className="skill-inline-code">agent-copilot</span> <span className="skill-inline-code">agent-bridge</span>
                </li>
                <li>
                  <strong>{zh ? '代码索引、网页、浏览器与行内补全' : 'Code LSP, web, browser & inline'}：</strong>
                  <span className="skill-inline-code">lsp</span>（{zh ? '接本机已有语言服务器，编辑后自动附诊断' : 'connects local LSPs with post-edit diagnostics'}）、
                  <span className="skill-inline-code">web</span>（{zh ? '抓取与搜索，支持月度次数/费用封顶' : 'fetch & search with monthly caps'}）、
                  <span className="skill-inline-code">browser</span>（{zh ? '驱动本机 Chrome，独立临时 profile，提交表单必问人' : 'isolated Chrome sessions; form submits ask every time'}）、
                  <span className="skill-inline-code">inline</span>（{zh ? 'si inline lsp 编辑器灰字行内补全' : 'LSP inline FIM/chat completion'}）
                </li>
                <li>
                  <strong>{zh ? '治理规则与请求脱敏' : 'Governance & redaction'}：</strong>
                  <span className="skill-inline-code">policy</span>（{zh ? '系统/用户/项目三级 policy.json，禁推主干、拦私钥写入、依赖白名单' : '3-tier policy.json for protected branches, secret content & deps'}）、
                  <span className="skill-inline-code">redact</span>（{zh ? '发往模型前把密钥替换为占位符，执行前还原，原文只留本机' : 'placeholder secret redaction on requests, unredacted only at local exec'}）
                </li>
                <li>
                  <strong>{zh ? '执行环境、资源与沙箱辅助' : 'Remote exec, resources & sandbox helpers'}：</strong>
                  <span className="skill-inline-code">remote-exec</span>（{zh ? 'SSH / 容器 / runsc / krun / kubectl + 远端 soiacode-exec' : 'SSH / container / microVM / custom cmd via soiacode-exec'}）、
                  <span className="skill-inline-code">resources</span>（{zh ? 'CPU/内存/磁盘统计与电池低电量并发限流' : 'CPU/RAM/disk telemetry & battery concurrency throttling'}）、
                  <span className="skill-inline-code">sandbox-bwrap</span>、<span className="skill-inline-code">sandbox-acl</span>、<span className="skill-inline-code">writable-dirs</span>
                </li>
                <li>
                  <strong>{zh ? '常驻后台、事件与定时恢复' : 'Daemon, events & durable recovery'}：</strong>
                  <span className="skill-inline-code">serve</span>（{zh ? '常驻托管会话 + read/prompt/approve/admin 分级 token' : 'background daemon + scoped tokens'}）、
                  <span className="skill-inline-code">event-sources</span>（GitHub / Webhook / Telegram）、
                  <span className="skill-inline-code">schedule</span>、<span className="skill-inline-code">durable</span>（{zh ? '宿主机重启后受限自动续跑' : 'restart resume with maxContinues guard'}）、
                  <span className="skill-inline-code">dispatch</span>（{zh ? '事件自动建专责会话跟进' : 'auto-routed execution sessions'}）
                </li>
                <li>
                  <strong>{zh ? '对外服务与数据观测路由' : 'External protocols, search, storage & routing'}：</strong>
                  <span className="skill-inline-code">mcp-server</span>、<span className="skill-inline-code">a2a</span>（Agent2Agent）、
                  <span className="skill-inline-code">session-search</span>（{zh ? '模型查本会话摘要原文 / 人跨会话检索' : 'in-session recall & human cross-session search'}）、
                  <span className="skill-inline-code">metrics</span>（OTLP {zh ? '只传指标标签，不传代码与正文' : 'numeric telemetry only, never prompts/paths'}）、
                  <span className="skill-inline-code">storage</span>（SQLite / S3 / Tiered）、
                  <span className="skill-inline-code">router</span>（{zh ? '主模型过载回退与按规则切换模型' : 'fallback chains & cost/rule routing'}）
                </li>
              </ul>

              <SoiaCodePeripheralDiagram zh={zh} />
            </section>

            <section id="boundaries">
              <h2>{zh ? '3. 精确边界：做什么、不做什么、怎么拦' : '3. Exact boundaries & safety model'}</h2>

              <div className="soiacode-grid-2">
                <div className="soiacode-box is-in">
                  <h3>{zh ? '产品边界内（内核负责）' : 'Inside product boundary'}</h3>
                  <ul>
                    <li>{zh ? 'Agent 推理与工具调度闭环' : 'Agent loop & tool dispatch kernel'}</li>
                    <li>{zh ? '4 种入口模式（交互 / print / RPC / ACP）+ Rust SDK' : '4 run modes (CLI / print / RPC / ACP) + SDK'}</li>
                    <li>{zh ? '5 个内置工具与默认工作区路径检查' : '5 built-in tools & workspace path guards'}</li>
                    <li>{zh ? '10 个治理挂载点、权限引擎与审批记录' : '10 governance mounts, permission & approval log'}</li>
                    <li>{zh ? 'Append-only JSONL 会话树、快照与 Blob 旁路' : 'JSONL tree sessions, snapshots & blob offload'}</li>
                    <li>{zh ? '--no-session 下仍写入只追加审计日志（~/.soiacode/audit/）' : 'Audit-only log even under --no-session'}</li>
                    <li>{zh ? '扩展宿主进程管理与 MCP 客户端' : 'Extension subprocess host & MCP client'}</li>
                  </ul>
                </div>
                <div className="soiacode-box is-out">
                  <h3>{zh ? '产品边界外（内核明确不做）' : 'Outside product boundary'}</h3>
                  <ul>
                    <li>{zh ? '图形桌面壳（由上层如 SoiaDeck 或编辑器承担）' : 'Desktop GUI shell (handled by SoiaDeck or editors)'}</li>
                    <li>{zh ? 'SaaS 托管控制面与账号中心' : 'Hosted SaaS control plane or user cloud sync'}</li>
                    <li>{zh ? '硬编码企业策略（交由 policy 扩展或宿主挂载点实现）' : 'Hardcoded org policy (delegated to policy extension)'}</li>
                    <li>{zh ? '默认必开的外部重沙箱（soiacode-sandbox 为可选编译项）' : 'Mandatory heavy sandbox (soiacode-sandbox is opt-in)'}</li>
                    <li>{zh ? '常驻守护、MCP Server、A2A 网关、远端容器编排适配' : 'Daemon serve, MCP server, A2A gateway, managed sandbox drivers'}</li>
                    <li>{zh ? '默认遥测上报（Zero telemetry by default）' : 'Default telemetry (zero telemetry by default)'}</li>
                    <li>{zh ? '扩展在远端/容器中执行时不复制用户凭据到远端' : 'Credentials stay local during remote-exec'}</li>
                  </ul>
                </div>
              </div>

              <h3>{zh ? '10 个治理挂载点与审批铁律' : '10 governance mounts & decision precedence'}</h3>
              <p>
                {zh
                  ? '每一次用户输入、模型请求、工具调用与回合结束，都必须经过内置挂载点链条，确保策略扩展、脱敏扩展与宿主应用能以确定性顺序介入：'
                  : 'Every turn transitions through 10 deterministic mount points so built-in permissions, redact, policy, or host SDK hooks can inspect, rewrite, ask, or block cleanly:'}
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
                  <strong>{zh ? '优先级铁律 deny > ask > allow' : 'Precedence deny > ask > allow'}：</strong>
                  {zh
                    ? '一旦命中任何一条 deny 即拒绝；复合 shell 命令会拆分成子命令逐段判定，不因第一段无害就放行整条命令。'
                    : 'Any deny wins immediately; compound shell commands are split and evaluated per segment.'}
                </li>
                <li>
                  <strong>{zh ? '写保护敏感路径' : 'Write-protected paths'}：</strong>
                  {zh
                    ? '.git/、.soiacode/、si 数据目录及 shell 启动脚本（如 .zshrc）即便在工作区内，默认也会触发 ask 确认（仅显式 bypass 例外）。'
                    : '.git/, .soiacode/, data dirs, and shell rc files always trigger ask even inside workspace (unless bypass).'}
                </li>
                <li>
                  <strong>{zh ? '三种权限模式（Shift+Tab 切换）' : 'Three modes (Shift+Tab)'}：</strong>
                  {zh
                    ? 'plan（只读探索）、default（工作区内按规则自动读写，越界/执行/敏感写入问人）、bypass（显式全放行）。当策略为 never 或无人值守超时，所有 ask 一律按拒绝处理。'
                    : 'plan (read-only), default (workspace writes allowed with prompts on risk), bypass (explicitly permissive). Unattended or never approval always resolves ask as deny.'}
                </li>
              </ul>

              <SoiaCodeToolSequenceDiagram zh={zh} />

              <div className="soiacode-note">
                {zh
                  ? '沙箱边界原则：权限检查决定「许不许」，可选沙箱（soiacode-sandbox，默认关闭 feature）保证「放行了也越不了界」。支持从无沙箱 → 内置（macOS Seatbelt / Linux Landlock+seccomp / Windows 受限令牌+ACL，增强禁网需一次性管理员 si sandbox setup）→ bubblewrap → 容器 / gVisor / krun 微虚机 → remote-exec（soiacode-exec）7 档演进；要求受限模式但底层不支持时，命令直接拒绝执行，绝不静默降级。'
                  : 'Sandbox discipline: permissions decide whether an action is allowed; the optional sandbox (soiacode-sandbox, compiled out by default) guarantees allowed commands still cannot cross boundaries across 7 isolation tiers. When a restricted mode is requested on an unsupported host, commands refuse to run rather than silently downgrading.'}
              </div>
            </section>

            <section id="architecture">
              <h2>{zh ? '4. 工程 Crate 分层与隔离纪律' : '4. Engineering crate layers & isolation'}</h2>
              <p>
                {zh
                  ? '整个 Rust workspace 遵循严格的 L4 → L0 单向向下依赖。任何业务 crate 都禁止绕过抽象直接触网或触系统资源：全仓只有 L0 的 soiacode-http 能直接发起 HTTP/HTTPS 请求（统一代理、自定义 CA 与请求头脱敏），只有 soiacode-local 封装进程起停与文件原子写入，而 soiacode-protocol 作为零 IO 唯一类型真源让核心、SDK、扩展与 RPC/ACP 保持契约一致。'
                  : 'The Rust workspace enforces strict downward dependencies from L4 to L0. Only L0 soiacode-http performs network IO (centralizing proxies, custom CA, and header redaction), only L0 soiacode-local wraps OS process/file primitives, and zero-IO soiacode-protocol serves as the single source of truth across kernel, SDK, extensions, RPC, and ACP.'}
              </p>

              <SoiaCodeCrateDiagram zh={zh} />
            </section>

            <section id="roadmap">
              <h2>{zh ? '5. 版本路线与当前真实状态' : '5. Roadmap & current status'}</h2>
              <p>
                {zh
                  ? '当前处于架构定稿与详细设计阶段（0.0.1 M1 进行中），仓库内沉淀了完整的架构决策记录、用户规格、协议设计及可读站点，尚未发布可用 Rust 代码实现与二进制下载包。后续规划按 11 个里程碑渐进交付：'
                  : 'Currently in active architecture & detailed design (0.0.1 M1) with complete specs and decision records, prior to releasing Rust source crates or binaries. Planned across 11 incremental milestones:'}
              </p>
              <ul>
                <li><strong>0.0.1 – 0.0.2（进行中 → 下一步）</strong>：{zh ? '协议/HTTP/本机工具底座、单会话终端交互与 print/RPC 入口、权限挂载点闭环。' : 'Core L0–L4 crates, interactive CLI / print / RPC entrypoints, and mount/permission loop.'}</li>
                <li><strong>0.0.3 – 0.0.6</strong>：{zh ? '会话树分叉与压缩、上下文工程、MCP 客户端与扩展宿主/extkit，以及首批官方核心扩展。' : 'Session tree fork/compaction, context engineering, MCP client, extension host & extkit.'}</li>
                <li><strong>0.0.7 – 0.0.10</strong>：{zh ? 'ACP 编辑器接入、常驻 serve / event-sources / durable、多智能体编排与对外 mcp-server / a2a 服务。' : 'ACP integration, serve daemon / durable / events, subagent workflows, mcp-server & a2a.'}</li>
                <li><strong>0.0.11</strong>：{zh ? '可选编译的 os-native 原生沙箱后端（默认保持关闭，不侵入最小核心）。' : 'Opt-in os-native sandbox feature (disabled by default to keep the minimal core pure).'}</li>
              </ul>

              <div className="missing-cta">
                <a className="btn btn-primary" href={href('/soiadeck/')}>SoiaDeck</a>
                <a className="btn btn-ghost" href={href('/skills/')}>{zh ? '看开源技能' : 'Open skills'}</a>
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
  const zh = isZh(locale);
  const sections: ReadonlyArray<{ id: string; title: string; body: string; image?: string; alt?: string }> = zh
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
          <span className="label">{zh ? 'SOIA 家族 · Agent OS 规格与开源底座 · MIT' : 'SOIA family · Agent OS spec & open-source runtime · MIT'}</span>
          <h1 className="display">SOIA Agent OS</h1>
          <p className="lead">
            {zh
              ? '本地优先、Provider 中立、可审计的 Agent OS：以 Model → Harness → Agent OS 分层和 M1–M8 内核，把大模型转化为可验证的长期工作系统。'
              : 'A local-first, provider-neutral, auditable Agent OS: Model → Harness → Agent OS layers and M1–M8 kernels turning LLMs into verifiable long-running systems.'}
          </p>
        </header>
        <ZoomableFigure
          src="/soia/products/soia-agent-os-layers.png"
          alt={zh ? 'SOIA Agent OS 分层架构总览' : 'SOIA Agent OS layered architecture'}
          zh={zh}
        />
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
                  <ZoomableFigure
                    src={section.image}
                    alt={section.alt ?? section.title}
                    zh={zh}
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
