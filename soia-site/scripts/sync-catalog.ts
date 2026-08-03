import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';

type DomainMeta = {
  slug: string;
  label: string;
  labelEn: string;
  description: string;
  descriptionEn: string;
};

type SkillRecord = {
  slug: string;
  domain: string;
  title: string;
  summary: string;
  detail: string;
  triggers: string[];
  install: string[];
  sourceUrl: string;
};

const domainMeta: Record<string, DomainMeta> = {
  'soia-pkm-vault': {
    slug: 'pkm-vault',
    label: '知识库与个人知识系统',
    labelEn: 'Knowledge & PKM',
    description: '采集、整理、检索、提炼与转换长期知识。',
    descriptionEn: 'Capture, organize, retrieve, distill, and transform durable knowledge.',
  },
  'soia-env': {
    slug: 'environment',
    label: '环境安装与支持',
    labelEn: 'Environment & Setup',
    description: '安装、诊断和维护 AI CLI 与本地工作环境。',
    descriptionEn: 'Install, diagnose, and maintain AI CLIs and local work environments.',
  },
  'soia-dev': {
    slug: 'development',
    label: '软件开发与交付',
    labelEn: 'Development & Delivery',
    description: '从需求、实现、测试到发版的可检查工程闭环。',
    descriptionEn: 'An inspectable engineering loop from requirements to release.',
  },
  'soia-dev-design': {
    slug: 'development-design',
    label: '产品设计与技术表达',
    labelEn: 'Product Design & Technical Communication',
    description: 'PRD、原型、架构图、Office 文档和设计探索。',
    descriptionEn: 'PRDs, prototypes, diagrams, Office documents, and design exploration.',
  },
  'soia-media-content': {
    slug: 'media-content',
    label: '内容生产与分发',
    labelEn: 'Content Production & Distribution',
    description: '从用户观点到文章、视觉和多平台发布草稿。',
    descriptionEn: 'From owned viewpoints to articles, visuals, and channel-ready drafts.',
  },
  'soia-meta': {
    slug: 'meta',
    label: '技能生态管理',
    labelEn: 'Skill Ecosystem Management',
    description: '检索、同步、发布和维护整个 SOIA 能力生态。',
    descriptionEn: 'Find, sync, release, and maintain the SOIA capability ecosystem.',
  },
  'soia-cwork-office': {
    slug: 'collaborative-office',
    label: '办公协作与文档',
    labelEn: 'Workplace Collaboration',
    description: '飞书、ProcessOn 与可复核的办公资料同步。',
    descriptionEn: 'Reviewable workplace research and sync across Feishu and ProcessOn.',
  },
  'soia-edu-course': {
    slug: 'education-course',
    label: '课程与教学设计',
    labelEn: 'Course & Learning Design',
    description: '从学习目标到课程大纲、教案和课堂活动。',
    descriptionEn: 'From learning outcomes to outlines, lesson plans, and activities.',
  },
};

function argValue(name: string): string | undefined {
  const index = process.argv.indexOf(name);
  return index >= 0 ? process.argv[index + 1] : undefined;
}

function cleanMarkdown(value: string): string {
  return value
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    .replace(/`([^`]+)`/g, '$1')
    .replace(/\*\*([^*]+)\*\*/g, '$1')
    .replace(/\s+/g, ' ')
    .trim();
}

function extractSection(markdown: string, heading: string): string {
  const start = markdown.indexOf(heading);
  if (start < 0) return '';
  const rest = markdown.slice(start + heading.length).trimStart();
  const next = rest.search(/^#{2,3} /m);
  return (next >= 0 ? rest.slice(0, next) : rest).trim();
}

function parseSkill(domain: string, slug: string, summary: string, markdown: string): SkillRecord {
  const triggerSection = extractSection(markdown, '## 怎么触发');
  const triggers = [...triggerSection.matchAll(/「([^」]+)」/g)].map((match) => match[1]);
  const capability = extractSection(markdown, '### 这个技能可以做什么')
    .split(/^\|/m)[0]
    .split('\n')
    .filter((line) => line.trim() && !line.startsWith('#'))
    .map(cleanMarkdown)
    .join(' ');
  const installSection = extractSection(markdown, '## 安装');
  const install = [...installSection.matchAll(/```(?:bash)?\n([\s\S]*?)```/g)]
    .map((match) => match[1].trim())
    .filter(Boolean);
  const sourceUrl = markdown.match(/\[技能源码\]\(([^)]+)\)/)?.[1] ??
    `https://github.com/soia-team/soia-open-skills/tree/main/skills/${slug}`;

  return {
    slug,
    domain,
    title: slug,
    summary: cleanMarkdown(summary),
    detail: capability || cleanMarkdown(summary),
    triggers,
    install,
    sourceUrl,
  };
}

async function main() {
  const sourceRoot = path.resolve(
    argValue('--source') ?? process.env.SOIA_OPEN_SKILLS_ROOT ?? '',
  );
  if (!argValue('--source') && !process.env.SOIA_OPEN_SKILLS_ROOT) {
    throw new Error('Pass --source <soia-open-skills> or set SOIA_OPEN_SKILLS_ROOT.');
  }

  const docsRoot = path.join(sourceRoot, 'docs', 'skills');
  const index = await readFile(path.join(docsRoot, 'README.md'), 'utf8');
  const blocks = index.split(/^## /m).slice(1);
  const skills: SkillRecord[] = [];
  const domains: Array<DomainMeta & { count: number; plugin: string }> = [];

  for (const block of blocks) {
    const plugin = block.match(/^`([^`]+)`/)?.[1];
    if (!plugin || !domainMeta[plugin]) continue;
    const rows = [...block.matchAll(/^\| \[`([^`]+)`\]\(([^)]+)\) \| (.+) \|$/gm)];
    for (const row of rows) {
      const [, slug, detailFile, summary] = row;
      const markdown = await readFile(path.join(docsRoot, detailFile), 'utf8');
      skills.push(parseSkill(domainMeta[plugin].slug, slug, summary, markdown));
    }
    domains.push({ ...domainMeta[plugin], count: rows.length, plugin });
  }

  const output = {
    generatedAt: new Date().toISOString(),
    source: 'soia-open-skills/docs/skills',
    total: skills.length,
    domains,
    skills,
  };
  const target = path.resolve(process.cwd(), 'src/data/catalog.generated.json');
  await mkdir(path.dirname(target), { recursive: true });
  await writeFile(target, `${JSON.stringify(output, null, 2)}\n`, 'utf8');
  console.log(`Wrote ${skills.length} skills across ${domains.length} domains to ${target}`);
}

await main();
