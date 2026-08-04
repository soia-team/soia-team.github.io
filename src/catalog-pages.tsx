import { useMemo, useState, type ReactNode } from 'react';
import { Header, type HeaderProps } from './upstream/app/_components/header';
import {
  DEFAULT_LOCALE,
  getCommonCopy,
  getLocaleDefinition,
  LANDING_LOCALES,
  localePath,
  type LandingLocaleCode,
} from './upstream/app/i18n';

const REPO = 'https://github.com/nexu-io/open-design';
const COUNTS = { skills: 217, systems: 151, templates: 217, craft: 0 };
const GITHUB = { starsLabel: '83.2K' };

function hrefFor(path: string, locale: LandingLocaleCode): string {
  return path.startsWith('http') ? path : localePath(locale, path);
}

function localeSwitcher(locale: LandingLocaleCode) {
  const common = getCommonCopy(locale);
  return {
    label: common.topbar.languageSwitcherLabel,
    prefix: common.topbar.languageSwitcherPrefix ?? 'Lang',
    shortLabel: getLocaleDefinition(locale).shortLabel,
    options: LANDING_LOCALES.map((entry) => ({
      ...entry,
      href: localePath(entry.code, window.location.pathname),
    })),
  };
}

function CatalogFooter({ locale }: { locale: LandingLocaleCode }) {
  const href = (path: string) => hrefFor(path, locale);
  return (
    <footer className='sub-footer catalog-footer' data-od-id='footer'>
      <div className='container sub-footer-inner'>
        <div className='sub-footer-grid'>
          <div className='sub-footer-col'><h5>Open Design</h5><ul>
            <li><a href={href('/')}>首页</a></li>
            <li><a href={href('/html-anything/')}>HTML Anything</a></li>
            <li><a href={href('/html-video/')}>HTML Video</a></li>
            <li><a href={href('/codex-slides/')}>Codex Slides</a></li>
          </ul></div>
          <div className='sub-footer-col'><h5>插件</h5><ul>
            <li><a href={href('/plugins/')}>插件广场</a></li>
            <li><a href={href('/plugins/templates/')}>模板</a></li>
            <li><a href={href('/plugins/skills/')}>技能</a></li>
            <li><a href={href('/plugins/systems/')}>设计系统</a></li>
          </ul></div>
          <div className='sub-footer-col'><h5>资源</h5><ul>
            <li><a href={href('/blog/')}>博客</a></li>
            <li><a href={href('/pricing/')}>价格</a></li>
            <li><a href={href('/download/')}>下载</a></li>
            <li><a href={href('/community/')}>社区</a></li>
          </ul></div>
          <div className='sub-footer-col'><h5>Open source</h5><ul>
            <li><a href={REPO} target='_blank' rel='noreferrer noopener'>GitHub</a></li>
            <li><a href='https://discord.gg/mHAjSMV6gz' target='_blank' rel='noreferrer noopener'>Discord</a></li>
            <li><a href={href('/privacy/')}>隐私</a></li>
            <li><a href={href('/terms/')}>条款</a></li>
          </ul></div>
        </div>
        <div className='foot-bar'>
          <div className='foot-bar-left'><span className='foot-copy'>© 2026 Powerformer, Inc. · Apache-2.0</span></div>
          <div className='foot-social'><a href='https://x.com/OpenDesignHQ' target='_blank' rel='noreferrer noopener' aria-label='X'>X</a><a href={REPO} target='_blank' rel='noreferrer noopener' aria-label='GitHub'>GH</a></div>
        </div>
        <div className='foot-masthead' data-od-id='footer-masthead'><p className='foot-masthead-wordmark'>Open <span className='foot-masthead-accent'>Design</span><span className='foot-masthead-period'>.</span></p></div>
      </div>
    </footer>
  );
}

function CatalogLayout({
  children,
  active = 'home',
  locale,
}: {
  children: ReactNode;
  active?: HeaderProps['active'];
  locale: LandingLocaleCode;
}) {
  return (
    <div className='shell'>
      <div className='site-chrome' data-chrome-headroom>
        <Header active={active} counts={COUNTS} github={GITHUB} locale={locale} brandHref='/' localeSwitcher={localeSwitcher(locale)} />
      </div>
      <main className='sub-main container catalog-main'>{children}</main>
      <CatalogFooter locale={locale} />
    </div>
  );
}

const PLUGIN_CARDS = [
  { slug: 'example-fs-editorial-forest', title: '像杂志创意总监一样艺术指导年度报告', kind: '演示文稿', image: '/plugins/covers/templates.webp', text: '把研究材料整理成一套可编辑、可演示的年度报告。' },
  { slug: 'example-webgl-aurora-veil', title: '极光帘幕', kind: '原型', image: '/lab-cards/card-2.webp', text: '用动效和光影把一个想法变成可以直接打开的网页原型。' },
  { slug: 'example-blog-post', title: '博客文章', kind: '原型', image: '/plugins/covers/codex-design.webp', text: '长篇文章、主图、引用、作者署名和相关文章推荐，一套完整文章页面。' },
  { slug: 'od-design-refine', title: 'Design Refine', kind: '技能', image: '/plugins/codex-design/skills/design-taste-frontend.webp', text: '把已有页面变得更清晰、更有秩序，并保留可维护的代码结构。' },
  { slug: 'example-pricing-page', title: '价格页面', kind: '模板', image: '/plugins/covers/templates.webp', text: '清楚呈现套餐、价格、权益和行动按钮的订阅页面。' },
  { slug: 'example-social-carousel', title: '社交媒体轮播图', kind: '模板', image: '/lab-cards/card-4.webp', text: '为社交媒体连续输出统一风格的图文卡片。' },
  { slug: 'example-docs-page', title: '文档页面', kind: '模板', image: '/plugins/covers/skills.webp', text: '侧边栏、章节、代码块与上下文链接组成的文档体验。' },
  { slug: 'example-pm-spec', title: '产品规格文档', kind: '模板', image: '/lab-cards/card-6.webp', text: '把产品决策、范围、验收和里程碑写成一份可执行的规格。' },
];

const PLUGIN_GROUPS = [
  { title: '模板', count: 288, slug: 'templates', image: '/plugins/covers/templates.webp', text: '可直接运行的网页、演示、视频和图片模板。' },
  { title: '技能', count: 16, slug: 'skills', image: '/plugins/covers/skills.webp', text: '给 coding agent 的工作方法、审美和交付能力。' },
  { title: '设计系统', count: 151, slug: 'systems', image: '/plugins/covers/systems.webp', text: '把品牌、字体、颜色与组件规则带进每一次生成。' },
];

function PluginCard({ card, locale }: { card: typeof PLUGIN_CARDS[number]; locale: LandingLocaleCode }) {
  const href = hrefFor(`/plugins/${card.slug}/`, locale);
  return <article className='tpl-card catalog-plugin-card'><a href={href} className='tpl-card-link'><img className='tpl-card-cover' src={card.image} alt='' loading='lazy' /><div className='tpl-card-body'><span className='tpl-card-kind'>{card.kind}</span><h3>{card.title}</h3><p className='tpl-excerpt-body'>{card.text}</p><span className='tpl-card-arrow'>查看详情 →</span></div></a></article>;
}

export function PluginsPage({ locale }: { locale: LandingLocaleCode }) {
  const [filter, setFilter] = useState('全部');
  const tags = ['全部', '网页', '幻灯片', '营销', '原型', '桌面端', '品牌', '版式'];
  const visible = filter === '全部' ? PLUGIN_CARDS : PLUGIN_CARDS.filter((card) => card.kind === (filter === '网页' ? '原型' : filter === '幻灯片' ? '演示文稿' : filter === '品牌' ? '技能' : '模板'));
  const href = (path: string) => hrefFor(path, locale);
  return (
    <CatalogLayout active='plugins' locale={locale}>
      <header className='catalog-head plugins-hero-art'>
        <p className='plugins-eyebrow'>插件广场</p>
        <h1 className='display'>Agent 设计插件库<span className='dot'>.</span></h1>
        <p className='lead'>别人做好的设计系统、技能和模板，装上就能用——让你的 AI 设计助手少从零开始，直接把想法变成界面。可以按 agent、品牌或类型来找，也能直接跳到你已经知道的那一项。</p>
        <ul className='plugins-stats'><li><strong>467+</strong> 个插件</li><li className='plugins-stat-link'><a href={href('/agents/')}>支持 Claude、Codex 等 21 种 Agent →</a></li></ul>
        <div className='plugins-hero-cta'><a className='btn btn-primary' href={href('/download/')}>下载客户端 ↗</a><a className='btn btn-ghost' href={REPO} target='_blank' rel='noreferrer noopener'>GitHub <span className='plugins-star-count'>83.2K ★</span></a></div>
      </header>

      <a className='plugins-feature' href={href('/plugins/codex-design/')}>
        <img className='plugins-feature-cover' src='/plugins/covers/codex-design.webp' alt='Codex design plugin' loading='lazy' />
        <div className='plugins-feature-body'><span className='plugins-feature-eyebrow'>精选插件 · Codex</span><h2 className='plugins-feature-title'>让 Codex 做出真正能用的 UI 的设计插件</h2><p className='plugins-feature-blurb'>一套可复用的设计方法、审美判断和交付检查，装进你已经在用的 coding agent。</p><span className='plugins-feature-cta'>查看精选集合 →</span></div>
      </a>

      <section className='plugins-tile-grid' aria-label='插件类型'>
        {PLUGIN_GROUPS.map((group) => <a className='plugins-tile plugins-tile-covered' href={href(`/plugins/${group.slug}/`)} key={group.slug}><img className='plugins-tile-cover' src={group.image} alt='' loading='lazy' /><div className='plugins-tile-body'><div className='plugins-tile-head'><h2 className='plugins-tile-title'>{group.title}</h2><span className='plugins-tile-count'>{group.count}</span></div><p className='plugins-tile-blurb'>{group.text}</p><span className='plugins-tile-cta'>浏览全部 →</span></div></a>)}
      </section>

      <section className='plugins-explore' aria-labelledby='plugins-explore-title'>
        <div className='plugins-sec-head'><h2 className='plugins-sec-title' id='plugins-explore-title'>探索全部资源</h2><a className='plugins-sec-more' href={href('/plugins/templates/')}>浏览完整目录 ↗</a></div>
        <div className='explore-tags' role='tablist' aria-label='插件分类'>{tags.map((tag) => <button type='button' role='tab' aria-selected={filter === tag} className={`explore-tag${filter === tag ? ' is-active' : ''}`} onClick={() => setFilter(tag)} key={tag}>{tag}<span className='chip-num'>{tag === '全部' ? 467 : tag === '网页' ? 14 : tag === '幻灯片' ? 10 : ''}</span></button>)}</div>
        <div className='explore-grid'>{visible.map((card) => <div className='explore-cell' key={card.slug}><PluginCard card={card} locale={locale} /></div>)}</div>
      </section>
    </CatalogLayout>
  );
}

const PLAN_FEATURES = {
  free: ['1 个任务并发', 'BYOK 自带密钥', '社区支持'],
  plus: ['每月 $20 模型额度', '2 个任务并发', 'BYOK 自带密钥', '零配置专业设计 Agent', '162+ Skills 工作流', '151+ Design Systems', '20+ 旗舰模型额度', '邮件支持'],
  pro: ['每月 $120 模型额度', '5 个任务并发', 'BYOK 自带密钥', '零配置专业设计 Agent', '162+ Skills 工作流', '151+ Design Systems', '20+ 旗舰模型额度', '优先邮件支持'],
  max: ['每月 $300 模型额度', '10 个任务并发', 'BYOK 自带密钥', '零配置专业设计 Agent', '162+ Skills 工作流', '151+ Design Systems', '20+ 旗舰模型额度', '高峰优先算力 · 更低时延', '专属客户成功'],
} as const;

type BillingInterval = 'monthly' | 'yearly';

export function PricingPage({ locale }: { locale: LandingLocaleCode }) {
  const [interval, setInterval] = useState<BillingInterval>('yearly');
  const plans = useMemo(() => interval === 'yearly' ? [
    { key: 'free', name: 'Free', blurb: '配置自己的 Agent 或 BYOK，免费使用', price: '$0', old: '', saving: '', note: '永久免费', cta: '免费开始' },
    { key: 'plus', name: 'Plus', blurb: '独立项目、零散需求，单人交付 · 零配置即用', price: '$14', old: '$20', saving: '30% Off', note: '按年计费 · $168/年（省 $72）', cta: '升级 Plus · 年付' },
    { key: 'pro', name: 'Pro', blurb: '一个人产出整个设计团队的活 · 零配置即用', price: '$60', old: '$100', saving: '40% Off', note: '按年计费 · $720/年（省 $480）', cta: '升级 Pro · 年付' },
    { key: 'max', name: 'Max', blurb: '把外包设计费砸到零头 · 零配置即用', price: '$98', old: '$200', saving: '51% Off', note: '按年计费 · $1,176/年（省 $1,224）', cta: '升级 Max · 年付' },
  ] : [
    { key: 'free', name: 'Free', blurb: '配置自己的 Agent 或 BYOK，免费使用', price: '$0', old: '', saving: '', note: '永久免费', cta: '免费开始' },
    { key: 'plus', name: 'Plus', blurb: '独立项目、零散需求，单人交付 · 零配置即用', price: '$20', old: '', saving: '', note: '按月计费', cta: '升级 Plus · 月付' },
    { key: 'pro', name: 'Pro', blurb: '一个人产出整个设计团队的活 · 零配置即用', price: '$100', old: '', saving: '', note: '按月计费', cta: '升级 Pro · 月付' },
    { key: 'max', name: 'Max', blurb: '把外包设计费砸到零头 · 零配置即用', price: '$200', old: '', saving: '', note: '按月计费', cta: '升级 Max · 月付' },
  ], [interval]);
  return (
    <CatalogLayout active='pricing' locale={locale}>
      <article className='od-pricing-page'>
        <header className='pricing-head'><h1 className='display'>选择适合你的订阅计划</h1><div className='billing-toggle' role='tablist' aria-label='Billing interval'><button type='button' className={interval === 'monthly' ? 'is-active' : ''} onClick={() => setInterval('monthly')} role='tab' aria-selected={interval === 'monthly'}>月付</button><button type='button' className={interval === 'yearly' ? 'is-active' : ''} onClick={() => setInterval('yearly')} role='tab' aria-selected={interval === 'yearly'}>年付 <span>省最多 51%</span></button></div></header>
        <section className='price-grid' aria-label='Subscription plans'>
          {plans.map((plan) => <article className={`price-card price-card-${plan.key}`} key={plan.key}><div className='price-card-name'>{plan.name}</div><p className='price-card-blurb'>{plan.blurb}</p><div className='price-row'><strong>{plan.price}</strong>{plan.old ? <del>{plan.old}</del> : null}<span>/月</span>{plan.saving ? <em>{plan.saving}</em> : null}</div><p className='price-note'>{plan.note}</p><a className={`btn ${plan.key === 'pro' ? 'btn-primary' : 'btn-ghost'}`} href='https://open-design.ai/cloud/wallet'>{plan.cta}</a><ul>{PLAN_FEATURES[plan.key as keyof typeof PLAN_FEATURES].map((feature) => <li key={feature}>✓ {feature}</li>)}</ul>{plan.key !== 'free' ? <><h4>高级模型</h4><p className='model-list'>Claude-Fable-5 · Claude-Opus-4.8 · GPT-5.5 · Gemini-3.1-Pro · Grok-4.5</p><h4>标准模型</h4><p className='model-list'>GLM-5.2 · Kimi-K2.7 · DeepSeek-V4 · Qwen-3.7-Max</p></> : null}</article>)}
        </section>
        <p className='pricing-footnote'>价格以美元计。结账、账单与自动充值均在 <a href='https://open-design.ai/cloud/wallet'>Open Design Cloud 控制台</a> 完成。可随时调整或取消套餐。</p>
        <section className='team-plan' aria-label='团队版'><div><span className='pricing-eyebrow'>TEAM</span><h2>团队版</h2><p>团队协作与企业定制 · 本期暂未开放，敬请期待</p></div><span className='coming-soon'>即将上线</span><ul>{['包含 Max 全部功能', '团队共享设计系统 · 统一品牌事实源', '多人实时协同同一项目', '项目与产物多人共同编辑', '成员与权限管理', '统一账单 & 用量仪表盘'].map((item) => <li key={item}>✓ {item}</li>)}</ul><a className='btn btn-ghost' href='mailto:support@open-design.ai'>申请团队版</a></section>
        <section className='pricing-story'><div><span className='pricing-eyebrow'>客户故事 · Ikigai One</span><blockquote>“Open Design 是我们的不公平优势。”</blockquote><p>用一套本地优先的设计工作空间，把品牌手册和产品提案交付时间从几天缩短到几小时。</p></div><img src='/stories/ikigai-one-cover.webp' alt='Ikigai One' loading='lazy' /></section>
        <section className='pricing-faq'><h2>常见问题</h2>{['Open Design 模型额度是什么？怎么消耗？', '各套餐有什么区别？Free 能用托管模型吗？', '首月特惠之后价格会变吗？', '年付和月付有什么区别？', '可以随时取消订阅吗？'].map((question) => <details key={question}><summary>{question}</summary><p>套餐、额度与账单都可以在控制台查看；你可以随时切换或取消，已生成的本地项目不会受到影响。</p></details>)}</section>
      </article>
    </CatalogLayout>
  );
}

type BlogPost = { slug: string; category: string; title: string; excerpt: string; date: string; read: string; image: string };
const BLOG_POSTS: BlogPost[] = [
  { slug: 'open-source-alternative-to-claude-design', category: '指南', title: '2026 年最佳 Claude Design 替代品', excerpt: 'Claude Design 确实好用——但它闭源、只能托管、锁定模型，还被打包进 Claude 订阅里。如果这几条里有哪一条让你无法接受，这里就是 2026 年最佳的 Claude Design 替代品，按真正要紧的三件事打分：产出归不归你所有、能不能落地成真代码、模型选不选得了？', date: '2026年6月18日', read: '11 分钟阅读', image: '/blog/open-source-alternative-to-claude-design-cover.webp' },
  { slug: 'open-design-0-16-0-reliable-delivery', category: '产品', title: 'Open Design 0.16.0：可靠交付', excerpt: '视觉风格会跟着你手上真正在做的东西走，长任务能留住结果，预览也不再跟你较劲。', date: '2026年7月22日', read: '7 分钟阅读', image: '/blog/open-design-0-16-0-reliable-delivery-cover.webp' },
  { slug: 'open-design-0-15-1', category: '产品', title: 'Open Design 0.15.1：看得更清，跑得更久', excerpt: '图像细节更清晰、长会话更扛得住、更容易恢复，需要跟你确认的问题直接留在对话里。', date: '2026年7月17日', read: '3 分钟阅读', image: '/blog/open-design-0-15-1-cover.webp' },
  { slug: 'open-design-0-15-0-cost-less-ship-faster', category: '产品', title: 'Open Design 0.15.0：更省成本，更快交付', excerpt: '更精简的 Design System Prompt 让首个 token 更快，整条创作循环也更顺滑。', date: '2026年7月14日', read: '7 分钟阅读', image: '/blog/open-design-0-15-0-cost-less-ship-faster-cover.webp' },
  { slug: 'claude-ppt-skills', category: '工具与技能', title: 'Claude PPT 技能：如何用你的编程 Agent 做幻灯片', excerpt: '一份关于 2026 年 Claude PPT 技能的诚实指南：开源方案、评分表和真正的上手方法。', date: '2026年7月10日', read: '9 分钟阅读', image: '/blog/claude-ppt-skills-cover.webp' },
  { slug: 'codex-ppt-skill', category: '工具与技能', title: 'codex-ppt-skill：用编程 Agent 打造图像主导的 PPT', excerpt: '将编程 Agent 与 GPT-Image-2 结合，让每一页都是一张精心设计的图像。', date: '2026年7月10日', read: '6 分钟阅读', image: '/blog/codex-ppt-skill-cover.webp' },
  { slug: 'dashiai-ppt-skill', category: '工具与技能', title: 'dashiAI-ppt-skill：来自编程 Agent 的可编辑演示文稿', excerpt: '从一次性 HTML 产物走向可以在浏览器里继续编辑的幻灯片。', date: '2026年7月10日', read: '6 分钟阅读', image: '/blog/dashiai-ppt-skill-cover.webp' },
  { slug: 'frontend-slides', category: '工具与技能', title: 'frontend-slides：用编程 Agent 制作网页幻灯片', excerpt: '把幻灯片做成简洁现代的网页，直接在浏览器里演示。', date: '2026年7月10日', read: '6 分钟阅读', image: '/blog/frontend-slides-cover.webp' },
  { slug: 'guizang-ppt-skill', category: '工具与技能', title: 'guizang-ppt-skill：用编码 Agent 打造杂志级 HTML 幻灯片', excerpt: '电子杂志版式与瑞士网格排版，而不是又一套模板。', date: '2026年7月10日', read: '6 分钟阅读', image: '/blog/guizang-ppt-skill-cover.webp' },
  { slug: 'marp', category: '工具与技能', title: 'Marp：Markdown 演示文稿工具（以及如何导出到 PowerPoint）', excerpt: '用 Markdown 编写幻灯片，再通过 Marp 生成一套可分享的演示文稿。', date: '2026年7月8日', read: '7 分钟阅读', image: '/blog/marp-cover.webp' },
  { slug: 'ppt-master', category: '工具与技能', title: 'ppt-master：由 Agent 打造，把任意文档变成可编辑的 PowerPoint', excerpt: '把文档、研究和资料整理成真正可编辑的 PowerPoint，而不是一张导出的图片。', date: '2026年7月8日', read: '8 分钟阅读', image: '/blog/ppt-master-cover.webp' },
  { slug: 'reveal-js', category: '工具与技能', title: 'reveal.js：主题、导出，以及它与替代方案的对比', excerpt: '用 HTML 和 Markdown 构建可以在浏览器运行的演示框架。', date: '2026年7月8日', read: '7 分钟阅读', image: '/blog/reveal-js-cover.webp' },
  { slug: 'slidev', category: '工具与技能', title: 'Slidev：主题、示例与导出 PowerPoint 的方法', excerpt: '面向开发者的 Markdown 演示工具，支持主题、代码和浏览器演示。', date: '2026年7月8日', read: '7 分钟阅读', image: '/blog/slidev-cover.webp' },
  { slug: 'open-design-0-14-0-inspiration-time-machine', category: '产品', title: 'Open Design 0.14.0：灵感时光机', excerpt: '让被打断的想法重新回到创作流里，并留下可以继续工作的上下文。', date: '2026年7月3日', read: '6 分钟阅读', image: '/blog/open-design-0-14-0-inspiration-time-machine-cover.webp' },
  { slug: 'open-design-0-13-0-stay-in-flow', category: '产品', title: 'Open Design 0.13.0：保持心流', excerpt: '长时间的设计会话不再因为一次中断就从头开始。', date: '2026年7月1日', read: '6 分钟阅读', image: '/blog/open-design-0-13-0-stay-in-flow-cover.webp' },
  { slug: 'open-design-shanghai-ai-workshop', category: '社区', title: 'Open Design AI Workshop 来到上海', excerpt: '把 prompt 和 reference 变成真正可展示的 AI 设计产物。', date: '2026年6月28日', read: '5 分钟阅读', image: '/blog/open-design-shanghai-ai-workshop-cover.webp' },
  { slug: 'ai-design-agents', category: '指南', title: '2026 年最佳 AI 设计 Agent：一份诚实、实测过的指南', excerpt: '创意云端套件、任务机器人和 agent 原生流水线，其实是三种不同的东西。', date: '2026年6月30日', read: '8 分钟阅读', image: '/blog/ai-design-agents-cover.webp' },
  { slug: 'ai-prototyping-tools', category: '指南', title: '2026 年最好用的 AI 原型工具：一份实测过的诚实指南', excerpt: '真正的分水岭是：原型是用完即弃，还是会变成最终上线的产品？', date: '2026年6月30日', read: '9 分钟阅读', image: '/blog/ai-prototyping-tools-cover.webp' },
  { slug: 'best-ai-design-tools', category: '指南', title: '2026 年最好用的 AI 设计工具：一份诚实、亲测过的指南', excerpt: '设计最终能不能变成你自己拥有、可以上线的代码？', date: '2026年6月30日', read: '10 分钟阅读', image: '/blog/best-ai-design-tools-cover.webp' },
  { slug: 'bolt-new-alternatives', category: '指南', title: '最佳 Bolt.new 替代方案（2026）：按你离开它的真正原因来选', excerpt: '按你真正想离开 Bolt 的原因分组，理清一次性生成和可持续工作流的取舍。', date: '2026年6月30日', read: '8 分钟阅读', image: '/blog/bolt-new-alternatives-cover.webp' },
  { slug: 'design-to-code-tools', category: '指南', title: '设计转代码工具：哪个适合你？', excerpt: '设计转代码不是一个品类，关键是分清一次性导出和可以反复运行的流水线。', date: '2026年6月30日', read: '9 分钟阅读', image: '/blog/design-to-code-tools-cover.webp' },
  { slug: 'figma-alternatives', category: '指南', title: '2026 年最佳 Figma 替代品：按你想离开的理由来选', excerpt: '没有一款工具能彻底取代 Figma，真正该问的是你到底想离开哪一部分。', date: '2026年6月25日', read: '9 分钟阅读', image: '/blog/figma-alternatives-cover.webp' },
  { slug: 'how-to-use-claude-code-for-frontend-design', category: '指南', title: '如何用 Claude Code 做前端设计（2026 指南）', excerpt: '配置 frontend design skill、准备参考图，并让 Agent 在真实浏览器里验证结果。', date: '2026年6月24日', read: '8 分钟阅读', image: '/blog/how-to-use-claude-code-for-frontend-design-cover.webp' },
  { slug: 'lovable-alternatives', category: '指南', title: '最佳 Lovable 替代品（2026 年）：按你离开的真正原因来选', excerpt: '按你离开 Lovable 的真正原因分组，而不是再做一张 logo 排名表。', date: '2026年6月23日', read: '8 分钟阅读', image: '/blog/lovable-alternatives-cover.webp' },
  { slug: 'v0-alternatives', category: '指南', title: 'v0 替代方案：按你离开的真正原因来选', excerpt: '从一次提示词生成到真正拥有、可以上线并持续维护的代码。', date: '2026年6月22日', read: '8 分钟阅读', image: '/blog/v0-alternatives-cover.webp' },
  { slug: 'open-design-osaka-kyoto-meetup', category: '社区', title: 'Open Design 来到大阪 / 京都', excerpt: '设计师、builder 和 AI-native 团队一起讨论 agent 如何改变设计、原型和产品工作。', date: '2026年6月20日', read: '5 分钟阅读', image: '/blog/open-design-osaka-kyoto-meetup-cover.webp' },
  { slug: 'open-design-0-12-0-brand-backed-design-system', category: '产品', title: 'Open Design 0.12.0：你的品牌就是一套设计系统', excerpt: '把品牌事实源带进每一次生成，让结果保持一致而不是每次重新猜。', date: '2026年6月19日', read: '6 分钟阅读', image: '/blog/open-design-0-12-0-brand-backed-design-system-cover.webp' },
  { slug: 'vibe-design-tools', category: '指南', title: 'Vibe Design 工具：一份关于谁真正能用的诚实指南', excerpt: '一张横跨五个工具品类的评分表，以及几乎每篇清单文都在卖给你的陷阱。', date: '2026年6月18日', read: '9 分钟阅读', image: '/blog/vibe-design-tools-cover.webp' },
  { slug: 'vibe-design-vs-vibe-coding', category: '指南', title: 'vibe design 与 vibe coding：分岔点在哪，为什么重要', excerpt: '两套动作的分界，决定了你的结果是漂亮样稿，还是可以持续交付的产品。', date: '2026年6月17日', read: '8 分钟阅读', image: '/blog/vibe-design-vs-vibe-coding-cover.webp' },
  { slug: 'what-is-vibe-design', category: '指南', title: '什么是 vibe design（氛围设计）？2026 年完全指南', excerpt: '描述界面的感觉和方向，让 AI 把它生成出来，同时把设计真正落到可维护的文件里。', date: '2026年6月15日', read: '9 分钟阅读', image: '/blog/what-is-vibe-design-cover.webp' },
  { slug: 'open-design-0-10-0-all-in-one-workspace', category: '产品', title: 'Open Design 0.10.0：一体化设计工作空间', excerpt: '把 Agent、素材、参考图和交付文件放进同一个本地优先的创作空间。', date: '2026年6月12日', read: '6 分钟阅读', image: '/blog/open-design-0-10-0-all-in-one-workspace-cover.webp' },
  { slug: 'open-design-0-9-0-design-for-everyone', category: '产品', title: 'Open Design 0.9.0：设计，给每一个人', excerpt: '装完即创作，不用到处找 API key 或安装三个 CLI。', date: '2026年6月10日', read: '6 分钟阅读', image: '/blog/open-design-0-9-0-design-for-everyone-cover.webp' },
  { slug: 'figma-alternative-open-design', category: '指南', title: 'Figma 的开源替代方案', excerpt: '当你需要自有文件、可移植的设计系统和本地优先的工作流时，Open Design 是另一条路。', date: '2026年6月8日', read: '8 分钟阅读', image: '/blog/figma-alternative-open-design-cover.webp' },
  { slug: 'open-design-0-8-0-everything-is-a-plugin', category: '产品', title: 'Open Design 0.8.0：一切皆插件', excerpt: '插件引擎、默认无头的 CLI，以及 macOS 与 Windows 的统一设计工作流。', date: '2026年6月5日', read: '6 分钟阅读', image: '/blog/open-design-0-8-0-everything-is-a-plugin-cover.webp' },
  { slug: 'layout-layer-canvas-used-to-hide', category: '文章', title: '画布曾经藏起来的那一层版式', excerpt: '如果画布不再是工作单位，用户又该如何理解版式？这篇文章把隐藏的布局层重新摊开。', date: '2026年5月18日', read: '7 分钟阅读', image: '/blog/layout-layer-canvas-used-to-hide-cover.webp' },
  { slug: 'port-figma-workflow-open-design-plugin', category: '文章', title: '如何把一套 Figma 工作流移植成一个 Open Design 插件', excerpt: '从 Figma 导出、tokens 到可复用 skill，一次一个插件地迁移旧工作流。', date: '2026年5月16日', read: '7 分钟阅读', image: '/blog/port-figma-workflow-open-design-plugin-cover.webp' },
  { slug: 'byok-reality-check-5-things-that-break', category: '文章', title: 'BYOK 现实检验：Open Design 当下会出问题的 5 件事', excerpt: '来自社区的五个开放 bug 讨论，解释 BYOK、模型和本地文件在真实使用中会如何出问题。', date: '2026年5月14日', read: '7 分钟阅读', image: '/blog/byok-reality-check-5-things-that-break-cover.webp' },
  { slug: '31-skills-72-systems-how-the-library-works', category: '文章', title: '31 个 skill、72 个 system：Open Design 库是怎么运作的', excerpt: '带你走一遍让 Open Design 可组合的四个原语：skill、system、adapter 和 agent。', date: '2026年5月12日', read: '8 分钟阅读', image: '/blog/31-skills-72-systems-how-the-library-works-cover.webp' },
];

export function BlogPage({ locale }: { locale: LandingLocaleCode }) {
  const [category, setCategory] = useState('全部');
  const categories = ['全部', '产品', '指南', '使用场景', '社区', '工具与技能'];
  const featured = BLOG_POSTS[0];
  const libraryPosts = BLOG_POSTS.filter((post) => post.slug !== featured?.slug);
  const filtered = category === '全部' ? libraryPosts : libraryPosts.filter((post) => post.category === category);
  const href = (post: BlogPost) => hrefFor(`/blog/${post.slug}/`, locale);
  return (
    <CatalogLayout active='blog' locale={locale}>
      <article className='od-blog-page'>
        <header className='blog-head'><span className='label'>OPEN DESIGN · RESOURCE</span><h1 className='display'>博客<span className='dot'>.</span></h1><p className='lead'>关于产品、设计、coding agent、技能和本地优先工作流的实测文章。</p></header>
        {featured ? <a className='blog-feature' href={href(featured)}><img src={featured.image} alt='' loading='eager' /><div className='blog-feature-body'><span className='blog-category'>{featured.category}</span><h2>{featured.title}</h2><p>{featured.excerpt}</p><span className='blog-meta'>{featured.date} · {featured.read}</span><span className='blog-read'>继续阅读 →</span></div></a> : null}
        <section className='blog-library' aria-label='博客分类'><div className='blog-categories' role='tablist'>{categories.map((item) => <button type='button' className={category === item ? 'is-active' : ''} role='tab' aria-selected={category === item} onClick={() => setCategory(item)} key={item}>{item}</button>)}</div><div className='blog-grid'>{filtered.map((post) => <a className='blog-card' href={href(post)} key={post.slug}><img src={post.image} alt='' loading='lazy' /><div className='blog-card-body'><span className='blog-category'>{post.category}</span><h2>{post.title}</h2><p>{post.excerpt}</p><span className='blog-meta'>{post.date} · {post.read}</span><span className='blog-read'>阅读 →</span></div></a>)}</div></section>
      </article>
    </CatalogLayout>
  );
}

const PLUGIN_DETAIL: Record<string, { title: string; category: string; image: string; intro: string }> = {
  'codex-design': { title: 'Codex Design', category: '技能集合', image: '/plugins/codex-design/hero.webp', intro: '一套让 Codex 先理解视觉方向，再交付真实 UI 的设计技能集合。' },
  'example-blog-post': { title: '博客文章', category: '模板', image: '/plugins/covers/templates.webp', intro: '长篇文章、主图、引用、作者署名和相关文章推荐组成的完整文章模板。' },
  'od-design-refine': { title: 'Design Refine', category: '技能', image: '/plugins/codex-design/skills/design-taste-frontend.webp', intro: '审阅已有界面，指出真正影响体验的问题，并给出可以合并的改进。' },
  'example-pricing-page': { title: '价格页面', category: '模板', image: '/plugins/covers/templates.webp', intro: '清楚呈现订阅计划、价格、权益和行动按钮。' },
  'example-social-carousel': { title: '社交媒体轮播图', category: '模板', image: '/lab-cards/card-4.webp', intro: '适合连续发布的社交媒体图文轮播成品。' },
  'example-docs-page': { title: '文档页面', category: '模板', image: '/plugins/covers/skills.webp', intro: '侧边栏、章节、代码块和上下文链接组成的文档页面。' },
  'example-pm-spec': { title: '产品规格文档', category: '模板', image: '/lab-cards/card-6.webp', intro: '把产品决策、范围、验收和里程碑写成可执行的规格。' },
  prototype: { title: 'Prototype', category: '模板 · 原型', image: '/lab-cards/prototype.webp', intro: '从一句 brief 开始，直接得到可点击、可验证的网页原型。' },
  'live-artifact': { title: 'Live Artifact', category: '模板 · 网页', image: '/lab-cards/live-artifact.webp', intro: '让生成的页面在浏览器中保持可运行、可检查、可交付。' },
  deck: { title: 'Slides', category: '模板 · 演示文稿', image: '/lab-cards/slides.png', intro: '把研究、提纲和视觉方向组织成真正可以演示的幻灯片。' },
  image: { title: 'Image', category: '模板 · 图片', image: '/lab-cards/quest.webp', intro: '以图片为中心的输出形态，适合社交卡片、海报和视觉素材。' },
  hyperframes: { title: 'HyperFrames', category: '模板 · 视频', image: '/lab-cards/card-5.webp', intro: '通过 HTML 帧和本地渲染把设计意图变成可交付的视频。' },
  video: { title: 'Video', category: '模板 · 视频', image: '/lab-cards/card-6.webp', intro: '让 coding agent 从脚本、画面到导出形成完整视频工作流。' },
};

export function PluginCollectionPage({ locale, kind }: { locale: LandingLocaleCode; kind: 'templates' | 'skills' | 'systems' }) {
  const group = PLUGIN_GROUPS.find((item) => item.slug === kind) ?? PLUGIN_GROUPS[0];
  const cards = PLUGIN_CARDS.filter((card) => kind === 'templates' ? card.kind !== '技能' : kind === 'skills' ? card.kind === '技能' : card.kind === '模板');
  return <CatalogLayout active={kind === 'templates' ? 'templates' : kind === 'skills' ? 'skills' : 'systems'} locale={locale}><header className='catalog-head plugin-templates-head'><span className='plugins-eyebrow'>05 / LIBRARY</span><h1 className='display'>按结果找到{group.title}，而不是先背名称<span className='dot'>.</span></h1><p className='lead'>{group.text} 每个详情页都说明能力、交付形式、安装入口与公开边界。</p></header><section className='catalog-collection-grid'>{cards.map((card) => <PluginCard card={card} locale={locale} key={card.slug} />)}</section></CatalogLayout>;
}

export function PluginDetailPage({ locale, slug }: { locale: LandingLocaleCode; slug: string }) {
  const detail = PLUGIN_DETAIL[slug] ?? { title: slug.replace(/-/g, ' '), category: '插件', image: '/plugins/covers/templates.webp', intro: '一个可以安装、运行并继续修改的 Open Design 插件。' };
  const href = (path: string) => hrefFor(path, locale);
  return <CatalogLayout active='plugins' locale={locale}><article className='plugin-detail-page'><header className='plugin-detail-head'><span className='plugins-eyebrow'>{detail.category}</span><h1 className='display'>{detail.title}<span className='dot'>.</span></h1><p className='lead'>{detail.intro}</p><div className='od-route-actions'><a className='btn btn-primary' href={href('/download/')}>下载桌面端</a><a className='btn btn-ghost' href={REPO} target='_blank' rel='noreferrer noopener'>查看源码 ↗</a></div></header><figure className='plugin-detail-hero'><img src={detail.image} alt='' /></figure><div className='plugin-detail-columns'><article><span className='plugins-eyebrow'>ABOUT</span><h2>它解决什么问题？</h2><p>{detail.intro} 它遵循 Open Design 的本地优先原则，文件可读、可复制、可继续交给你的 Agent。</p><h2>如何使用</h2><ol><li>打开 Open Design 桌面端或你的 coding agent。</li><li>安装该插件并选择一个输入或项目目录。</li><li>让 Agent 运行、预览并按结果继续迭代。</li></ol><h2>公开边界</h2><p>插件本身是公开的；你的项目文件、账号凭据和私有素材不会被放进插件仓库。</p></article><aside className='plugin-detail-aside'><span className='plugins-eyebrow'>PUBLIC EVIDENCE</span><p>本页由公开插件说明生成，安装入口与源代码均指向 Open Design 的公开仓库。</p><a className='btn btn-primary' href={REPO} target='_blank' rel='noreferrer noopener'>审查 GitHub 源码 ↗</a><a className='btn btn-ghost' href={href('/plugins/')}>← 返回插件广场</a></aside></div></article></CatalogLayout>;
}

export function BlogArticlePage({ locale, slug }: { locale: LandingLocaleCode; slug: string }) {
  const post = BLOG_POSTS.find((item) => item.slug === slug) ?? BLOG_POSTS[0];
  if (!post) return null;
  const href = (path: string) => hrefFor(path, locale);
  return <CatalogLayout active='blog' locale={locale}><article className='blog-article-page'><header className='blog-article-head'><a className='blog-back' href={href('/blog/')}>← 返回博客</a><span className='blog-category'>{post.category}</span><h1 className='display'>{post.title}</h1><p className='lead'>{post.excerpt}</p><span className='blog-meta'>{post.date} · {post.read}</span></header><figure className='blog-article-cover'><img src={post.image} alt='' /></figure><div className='blog-article-layout'><article className='blog-article-body'><p className='article-lead'>{post.excerpt}</p><h2 id='conclusion'>先说结论</h2><p>这篇文章把一个真实的设计与交付问题拆开，给出可以复现的判断方法。重点不是漂亮的演示，而是能不能在自己的电脑上留下可继续修改的文件。</p><h2 id='workflow'>从一次运行到一条工作流</h2><p>把 brief、参考素材、视觉方向和交付检查放在同一个项目里，Agent 才能记住上下文，下一次修改也不会从零开始。</p><h2 id='when'>什么时候值得使用</h2><ul><li>你希望输出可以被自己拥有并继续维护。</li><li>你希望换模型、换 Agent，而不是被单一平台锁定。</li><li>你希望把一次性的结果沉淀成可复用的 Skill、模板或设计系统。</li></ul></article><aside className='blog-article-aside'><span className='plugins-eyebrow'>ON THIS PAGE</span><a href='#conclusion'>先说结论</a><a href='#workflow'>从一次运行到一条工作流</a><a href='#when'>什么时候值得使用</a><a className='btn btn-primary' href={href('/plugins/')}>浏览插件库 ↗</a></aside></div></article></CatalogLayout>;
}

export function getCatalogTitle(path: string): string | undefined {
  if (path === '/pricing') return '价格 · Open Design';
  if (path === '/blog') return '博客 · Open Design';
  if (path === '/plugins') return '插件广场 · Open Design';
  const blogMatch = path.match(/^\/blog\/([^/]+)$/);
  if (blogMatch) {
    const post = BLOG_POSTS.find((item) => item.slug === blogMatch[1]);
    return post ? `${post.title} · Open Design` : '博客 · Open Design';
  }
  return undefined;
}

export { PLUGIN_DETAIL, BLOG_POSTS };
