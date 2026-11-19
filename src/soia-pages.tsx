import { useEffect, useState } from 'react';
import { SubpageLayout, hrefFor } from './shell';
import type { LandingLocaleCode } from './upstream/app/i18n';
import { SKILL_DOCS, type SkillDoc } from './skill-data';
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

const CODING_AGENTS_19: ReadonlyArray<{ id: string; name: string; protocol: string }> = [
  { id: 'claude', name: 'Claude Code', protocol: 'stream-json' },
  { id: 'codex', name: 'Codex', protocol: 'subscription-cli' },
  { id: 'cursor', name: 'Cursor', protocol: 'ACP' },
  { id: 'gemini', name: 'Gemini CLI', protocol: 'ACP' },
  { id: 'copilot', name: 'GitHub Copilot', protocol: 'ACP' },
  { id: 'antigravity', name: 'Antigravity', protocol: 'ACP' },
  { id: 'opencode', name: 'OpenCode', protocol: 'ACP' },
  { id: 'kimi', name: 'Kimi Code', protocol: 'ACP' },
  { id: 'qwen', name: 'Qwen Code', protocol: 'ACP' },
  { id: 'qoder', name: 'Qoder CLI', protocol: 'ACP' },
  { id: 'grok', name: 'Grok', protocol: 'ACP' },
  { id: 'hermes', name: 'Hermes', protocol: 'ACP' },
  { id: 'dsh', name: 'dsh', protocol: 'ACP' },
  { id: 'pi', name: 'pi', protocol: 'pi-rpc' },
  { id: 'omp', name: 'oh-my-pi', protocol: 'CLI / PTY' },
  { id: 'kiro', name: 'Kiro', protocol: 'CLI / PTY' },
  { id: 'trae', name: 'Trae', protocol: 'CLI / PTY' },
  { id: 'fx', name: 'fx (Z.ai GLM)', protocol: 'CLI / PTY' },
  { id: 'workbuddy', name: 'WorkBuddy', protocol: 'CLI / PTY' },
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

const isZh = (locale: LandingLocaleCode) => locale === 'zh';
const pick = <T,>(locale: LandingLocaleCode, value: { zh: T; en: T }): T =>
  isZh(locale) ? value.zh : value.en;

const domainOf = (slug: string) => SKILL_DOMAINS.find((d) => d.slug === slug);
const skillsOf = (slug: string) => SKILL_DOCS.filter((s) => s.domain === slug);

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
        <section className="craft-list">
          {skills.map((skill, index) => (
            <a className="craft-row" href={href(`/skills/${slug}/${skill.name}/`)} key={skill.name}>
              <span className="craft-index">{String(index + 1).padStart(2, '0')}</span>
              <span>
                <strong>
                  {pick(locale, skill.title)}
                  <span className="skill-row-tech">{skill.name}{skill.version ? ` · v${skill.version}` : ''}</span>
                </strong>
                <small>{skill.tagline}</small>
              </span>
              <span className="craft-arrow">→</span>
            </a>
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
            {domain.plugin} · {domainLabel}{doc.version ? ` · v${doc.version}` : ''} · <code>{doc.name}</code>
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
        <ZoomableFigure
          src="/soia/products/soiadeck-workbench.png"
          alt="SoiaDeck AI Workbench"
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
                {section.id === 'agents' && (
                  <ul className="agent-matrix-list">
                    {CODING_AGENTS_19.map((agent, idx) => (
                      <li className="agent-matrix-item" key={agent.id}>
                        <span className="agent-matrix-name">
                          <strong>{String(idx + 1).padStart(2, '0')}. {agent.name}</strong>
                          <code>{agent.id}</code>
                        </span>
                        <span className="agent-matrix-proto">{agent.protocol}</span>
                      </li>
                    ))}
                  </ul>
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
        <ZoomableFigure
          src="/soia/products/soiacode-overview.png"
          alt="SoiaCode overview"
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
