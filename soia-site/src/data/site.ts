import catalogJson from './catalog.generated.json';

export type Locale = 'zh' | 'en';
export type Localized = { zh: string; en: string };

export type SkillRecord = {
  slug: string;
  domain: string;
  title: string;
  summary: string;
  detail: string;
  triggers: string[];
  install: string[];
  sourceUrl: string;
};

export type DomainRecord = {
  slug: string;
  label: string;
  labelEn: string;
  description: string;
  descriptionEn: string;
  count: number;
  plugin: string;
};

export const catalog = catalogJson as {
  generatedAt: string;
  source: string;
  total: number;
  domains: DomainRecord[];
  skills: SkillRecord[];
};

export const t = (value: Localized, locale: Locale) => value[locale];

export const productShapes = [
  {
    id: '01',
    status: { zh: '开放 · 免费', en: 'Open · Free' },
    name: 'Skill',
    title: { zh: '单个可安装能力', en: 'One installable capability' },
    body: {
      zh: '把一个重复任务封装成触发、输入、步骤、输出、边界和验收都清楚的最小单元。',
      en: 'A focused unit with explicit triggers, inputs, steps, outputs, boundaries, and acceptance.',
    },
    href: '/open/',
  },
  {
    id: '02',
    status: { zh: '组合 · 预览', en: 'Compose · Preview' },
    name: 'Workflow',
    title: { zh: '多个 Skill 工作流', en: 'Multi-Skill workflow' },
    body: {
      zh: '把多个能力按顺序连接，明确交接、人工批准、失败处理和最终回执。',
      en: 'Connect capabilities with explicit handoffs, approvals, failure handling, and receipts.',
    },
    href: '/spec/',
  },
  {
    id: '03',
    status: { zh: '宿主 · 预览', en: 'Host · Preview' },
    name: 'Plugin',
    title: { zh: 'Claude Code / Codex 插件', en: 'Claude Code / Codex plugin' },
    body: {
      zh: '把一组能力按版本、安装、启停和宿主兼容边界，放进真正使用的 Agent 环境。',
      en: 'Package capabilities for real agent hosts with versions, installation, and compatibility boundaries.',
    },
    href: '/docs/',
  },
  {
    id: '04',
    status: { zh: '角色 · 预览', en: 'Role · Preview' },
    name: 'Expert',
    title: { zh: 'WorkBuddy 领域专家', en: 'WorkBuddy domain expert' },
    body: {
      zh: '把角色、Skills、资料和推荐任务组织成一个可调用、可维护的专家入口。',
      en: 'Organize a role, skills, knowledge, and suggested tasks into a maintainable expert entry point.',
    },
    href: '/open/experts/',
  },
];

export const experts = [
  ['pkm-vault', '个人知识与内容资产专家', 'Knowledge & Content Asset Expert', '剪藏、检索、提炼、知识库治理与多种内容转换。'],
  ['environment', 'AI 工作环境管家', 'AI Environment Steward', '安装、诊断和维护 Codex、Claude Code、WorkBuddy 与常用 CLI。'],
  ['development', '软件交付专家', 'Software Delivery Expert', '需求、编码、Review、测试、修复与发版闭环。'],
  ['development-design', '产品设计与文档专家', 'Product Design & Documentation Expert', 'PRD、原型、架构图、Office 文档与设计评审。'],
  ['media-content', '内容生产与分发专家', 'Content Production Expert', '从观点和资料到文章、视觉与多平台草稿。'],
  ['meta', '技能生态管家', 'Skill Ecosystem Manager', '按需求找到、同步、发布和维护适合的能力。'],
  ['collaborative-office', '办公资料助手', 'Workplace Docs Aide', '飞书、ProcessOn 与办公资料的只读研究和可复核同步。'],
  ['education-course', '课程设计师', 'Course Designer', '从受众与课时约束到大纲、教案和课堂活动。'],
].map(([slug, zh, en, body]) => ({ slug, name: { zh, en }, body }));

export const serviceLadder = [
  {
    id: '01', code: 'ASSESS', status: { zh: '可申请', en: 'Application' },
    title: { zh: '工作流诊断', en: 'Workflow Assessment' },
    body: { zh: '从现有工作中找到最适合 Agent 化的一步，写清风险、输入输出和首个 Pilot。', en: 'Find the best first step for an agent, with risks, inputs, outputs, and a first pilot.' },
    deliverables: ['流程、角色与工具图', '自动化候选与风险边界', '首个 Pilot 与验收指标'],
  },
  {
    id: '02', code: 'MVP', status: { zh: '可实施', en: 'Available' },
    title: { zh: 'Expert MVP Sprint', en: 'Expert MVP Sprint' },
    body: { zh: '把获授权的流程资料，做成一个可安装、可运行、可验收的 Agent 或 WorkBuddy Expert。', en: 'Turn authorized process material into an installable and testable agent or WorkBuddy Expert.' },
    deliverables: ['角色与职责边界', 'Skills、资料与模板组合', '安装、样例运行与验收回执'],
  },
  {
    id: '03', code: 'PRIVATE', status: { zh: '评估制', en: 'Scoped' },
    title: { zh: '私有 Skill / Plugin 交付', en: 'Private Skill / Plugin Delivery' },
    body: { zh: '把企业 SOP、模板与治理要求封装成私有能力，并按宿主验证版本和回滚。', en: 'Package SOPs, templates, and governance as private capabilities with host-specific validation.' },
    deliverables: ['公共方法与私有流程分层', '多宿主交付', '权限、版本、更新与回滚说明'],
  },
  {
    id: '04', code: 'ENABLE', status: { zh: '按需', en: 'On demand' },
    title: { zh: '培训、维护与扩展', en: 'Enablement & Maintenance' },
    body: { zh: '让交付能力真正被使用，并在宿主变化和流程迭代后继续可用。', en: 'Help teams adopt delivered capabilities and keep them working as hosts and workflows change.' },
    deliverables: ['团队培训与手册', '新增场景与能力扩展', '宿主更新与定期回归'],
  },
];

export const courseChapters = [
  ['01', '认知重启', 'Agent、工作流与知识库的关系', '6 节'],
  ['02', '电脑、网络与资料环境', '准备一个可运行、可复查的工作环境', '2 节'],
  ['03', 'Claude Code 入门与安装', '从安装到第一个可复现任务', '9 节'],
  ['04', 'Codex 安装与入门', '第二个核心工具与项目协作方式', '6 节'],
  ['05', 'Skill 封装', '把工作流变成可复用能力', '1 节'],
  ['06', '知识库构建', '把散乱知识变成可复用资产', '3 节'],
  ['07', '内容生产', '从文章到多平台发布草稿', '4 节'],
  ['08', '进阶技能', 'PPT、海报与图表工作流', '3 节'],
  ['09', '项目实战', '内容线与工具线完成一次真实运行', '2 节'],
  ['10', 'WorkBuddy 与多工具协同', '把 Skills、资料和任务组织成 Expert', '3 节'],
].map(([id, title, body, count]) => ({ id, title, body, count }));

export const posts = [
  {
    slug: 'from-open-skill-to-private-workflow',
    date: '2026-08-03',
    title: { zh: '从开放 Skill 到私有工作流：边界怎样才算清楚', en: 'From open Skill to private workflow: defining the boundary' },
    summary: { zh: '公共方法、客户资料、宿主适配与验收证据应该分别放在哪里。', en: 'Where public method, private material, host adapters, and acceptance evidence should live.' },
    tag: 'METHOD',
  },
  {
    slug: 'content-system-first-principles',
    date: '2026-08-02',
    title: { zh: '一个人的内容系统，不是把五个平台都自动发一遍', en: 'A solo content system is not blind auto-posting' },
    summary: { zh: '从观点、事实、成文、视觉草稿到人工发布与复盘，怎样保留真实表达。', en: 'Preserving authored judgment from sources and drafts through human publishing and review.' },
    tag: 'CONTENT',
  },
  {
    slug: 'skill-workflow-plugin-expert',
    date: '2026-08-01',
    title: { zh: 'Skill、Workflow、Plugin、Expert 到底有什么区别', en: 'Skill, Workflow, Plugin, and Expert: what changes?' },
    summary: { zh: '四种交付形态分别回答能力、组合、入口和角色问题。', en: 'Four delivery shapes answer capability, composition, entry-point, and role questions.' },
    tag: 'PRODUCT',
  },
];

export function localizedPath(path: string, locale: Locale): string {
  const normalized = path.startsWith('/') ? path : `/${path}`;
  return locale === 'en' ? `/en${normalized === '/' ? '/' : normalized}` : normalized;
}

export function domainBySlug(slug?: string): DomainRecord | undefined {
  return catalog.domains.find((domain) => domain.slug === slug);
}

export function skillsForDomain(slug?: string): SkillRecord[] {
  return catalog.skills.filter((skill) => skill.domain === slug);
}

export function skillBySlug(slug?: string): SkillRecord | undefined {
  return catalog.skills.find((skill) => skill.slug === slug);
}
