import { useMemo, useState } from 'react';
import { SubpageLayout, hrefFor } from './shell';
import type { LandingLocaleCode } from './upstream/app/i18n';
import './missing-pages.css';

type PageProps = { locale: LandingLocaleCode };

const TUTORIALS = [
  { slug: 'open-design-ai-ppt-tutorial', category: '教程', title: '用 Open Design 做一套 AI PPT', summary: '从原始笔记开始，生成可编辑的演示文稿，再完成素材、图表、动效和最终检查。', date: '2026 年 7 月 28 日', image: '/tutorials/open-design-ai-ppt-tutorial-cover.webp' },
  { slug: 'open-design-in-20-minutes-coding-menace', category: '入门', title: '20 分钟了解 Open Design', summary: '从工作区、设计系统到模板，快速走完第一次完整创作循环。', date: '2026 年 7 月 20 日', image: '/tutorials/open-design-in-20-minutes/01-open-design-home.webp' },
  { slug: 'open-design-31-skills-72-systems-popular-ai', category: '演示', title: '31 个 Skills 与 72 套设计系统', summary: '看看插件、设计系统和 Agent 如何一起工作，让每次交付都保留方法。', date: '2026 年 7 月 12 日', image: '/tutorials/open-design-31-skills-72-systems-popular-ai/01-workspace.webp' },
  { slug: 'open-design-feature-tour-silicon-hotpot', category: '演示', title: '从工作区到成品的完整演示', summary: '一次走完模板、设计系统、原型和交付文件。', date: '2026 年 7 月 5 日', image: '/tutorials/open-design-feature-tour-silicon-hotpot/01-workspace.webp' },
  { slug: 'open-design-open-source-alternative-claude-design-nyndra-ai', category: '社区', title: '开源替代方案实战', summary: '社区成员分享如何把自己的 Agent 和本地项目接入 Open Design。', date: '2026 年 6 月 28 日', image: '/tutorials/open-design-open-source-alternative-claude-design-nyndra-ai/generated-prototype.webp' },
  { slug: 'open-design-local-setup-ollama-alternative-ai-automation-station', category: '入门', title: '本地模型与 Open Design', summary: '配置本地模型，保持素材与产物留在自己的机器上。', date: '2026 年 6 月 21 日', image: '/tutorials/open-design-local-setup-ollama-alternative-ai-automation-station/01-workspace.webp' },
] as const;

type ShowcaseItem = { id: string; type: string; title: string; summary: string; image: string; madeWith: string; href?: string; badge?: string };
const SHOWCASE: readonly ShowcaseItem[] = [
  { id: 'fable5-site', type: '落地页', title: 'Claude Fable 5 模型介绍站', summary: '从 Hero、能力到价格的一套完整模型介绍页面。', image: '/showcase/fable5-site.jpg', madeWith: 'Open Design', href: 'https://asme-nu.vercel.app/' },
  { id: 'opendesign-y2k', type: '落地页', title: 'Open Design Y2K 品牌页', summary: '贴纸拼贴、液态 3D 字体和一体化 HTML 交付。', image: '/showcase/opendesign-y2k.jpg', madeWith: 'Open Design' },
  { id: 'oryzo-replica', type: '落地页', title: 'Oryzo 产品页复刻', summary: '以真实站点为参考，验证网页复刻的结构与视觉还原。', image: '/showcase/oryzo-replica.jpg', madeWith: 'Open Design', badge: '复刻演示' },
  { id: 'github-dashboard', type: '原型', title: 'GitHub 数据看板', summary: '星标、Fork、贡献者和 issue 组成的可运行数据页面。', image: '/previews/plugins/example-github-dashboard.jpg', madeWith: 'Open Design', href: '/plugins/example-github-dashboard/' },
  { id: 'swiss-deck', type: '演示文稿', title: 'Swiss International Deck', summary: '16 列网格、单一强调色和一套完整的演示系统。', image: '/previews/plugins/example-deck-swiss-international.jpg', madeWith: 'Open Design', href: '/plugins/example-deck-swiss-international/' },
  { id: 'launch-0-10-0', type: '视频', title: 'Open Design 0.10.0 发布影片', summary: '从提示词到设计循环的 Hyperframes 发布影片。', image: '/showcase/launch-0-10-0.jpg', madeWith: 'Hyperframes', href: 'https://x.com/i/status/2067081172878873014' },
  { id: 'event-shanghai', type: '视频', title: 'Open Design 上海活动', summary: '用动效讲清楚 Open Design 如何进入真实工作流。', image: '/showcase/event-shanghai.jpg', madeWith: 'Hyperframes', href: 'https://x.com/i/status/2072932345636626898' },
] as const;

const CRAFT = [
  { slug: 'brief-to-artifact', name: '从 Brief 到 Artifact', summary: '把目标、参考和交付边界组织成一条可复用的创作路径。', steps: ['明确目标和受众', '选择模板与设计系统', '生成并检查可运行的 Artifact'] },
  { slug: 'design-system', name: '品牌设计系统', summary: '把字体、颜色、间距和组件规则保存为每次生成都能读取的事实源。', steps: ['建立 tokens.css', '补充 DESIGN.md 规则', '在项目中验证视觉一致性'] },
  { slug: 'delivery-checklist', name: '交付检查', summary: '让页面不止看起来完成，还能被打开、复用和继续维护。', steps: ['检查路由和资源', '验证移动端和桌面端', '归档源码与最终产物'] },
] as const;

export function TutorialsPage({ locale }: PageProps) {
  const [filter, setFilter] = useState('全部');
  const categories = ['全部', '入门', '教程', '演示', '社区'];
  const items = useMemo(() => filter === '全部' ? TUTORIALS : TUTORIALS.filter((item) => item.category === filter), [filter]);
  const href = (path: string) => hrefFor(path, locale);
  return <SubpageLayout active="tutorials" locale={locale}><article className="missing-page tutorials-page"><header className="catalog-head"><span className="label">Tutorials / 教程</span><h1 className="display">把第一次创作，变成一套方法。</h1><p className="lead">从工作区、设计系统到最终交付，跟着真实案例走完 Open Design 的完整流程。</p></header><nav className="missing-filter" aria-label="教程分类">{categories.map((category) => <button type="button" className={filter === category ? 'is-active' : ''} onClick={() => setFilter(category)} key={category}>{category}</button>)}</nav><section className="tutorial-grid">{items.map((item) => <article className="tutorial-card" key={item.slug}><a href={href(`/tutorials/${item.slug}/`)}><img src={item.image} alt="" loading="lazy" /><div className="tutorial-card-body"><span className="label">{item.category}</span><h2>{item.title}</h2><p>{item.summary}</p><div className="tutorial-meta"><span>{item.date}</span><span>阅读教程 ↗</span></div></div></a></article>)}</section></article></SubpageLayout>;
}

export function TutorialDetailPage({ locale, slug }: PageProps & { slug: string }) {
  const item = TUTORIALS.find((entry) => entry.slug === slug) ?? TUTORIALS[0];
  const href = (path: string) => hrefFor(path, locale);
  return <SubpageLayout active="tutorials" locale={locale}><article className="missing-page tutorial-detail"><nav className="breadcrumb"><a href={href('/tutorials/')}>Tutorials</a><span>/</span><span>{item.title}</span></nav><header className="catalog-head"><span className="label">{item.category} · {item.date}</span><h1 className="display">{item.title}</h1><p className="lead">{item.summary}</p></header><figure className="tutorial-detail-hero"><img src={item.image} alt="" /></figure><div className="tutorial-detail-layout"><aside className="missing-toc"><span>本页内容</span><a href="#start">准备工作</a><a href="#workflow">工作流</a><a href="#ship">交付检查</a></aside><div className="missing-article"><section id="start"><h2>准备工作</h2><p>打开桌面端，准备目标页面、参考图片和你希望最终交付的文件格式。Open Design 会把这些输入保留在同一个项目里。</p></section><section id="workflow"><h2>工作流</h2><ol>{['用一句话描述目标和受众。', '选择合适的模板、Skill 或设计系统。', '让 Agent 生成可运行的页面，并在预览中检查。'].map((step) => <li key={step}>{step}</li>)}</ol></section><section id="ship"><h2>交付检查</h2><p>确认路由、资源、移动端布局和源码都能独立运行，再把项目交给下一位协作者。</p></section><div className="missing-cta"><a className="btn btn-primary" href={href('/download/')}>下载桌面端</a><a className="btn btn-ghost" href={href('/tutorials/')}>返回教程</a></div></div></div></article></SubpageLayout>;
}

export function ShowcasePage({ locale }: PageProps) {
  const [filter, setFilter] = useState('全部');
  const types = ['全部', '落地页', '原型', '演示文稿', '视频'];
  const items = filter === '全部' ? SHOWCASE : SHOWCASE.filter((item) => item.type === filter);
  const href = (path: string) => hrefFor(path, locale);
  return <SubpageLayout active="library" locale={locale}><article className="missing-page showcase-page"><header className="catalog-head showcase-head"><span className="label">Showcase / 展示</span><h1 className="display">真实产物，而不是概念图。</h1><p className="lead">这些是用 Open Design 生成并交付的落地页、原型、演示文稿和视频。按类型筛选，直接看结果。</p></header><nav className="missing-filter" aria-label="展示类型">{types.map((type) => <button type="button" className={filter === type ? 'is-active' : ''} onClick={() => setFilter(type)} key={type}>{type}</button>)}</nav><section className="showcase-grid-local">{items.map((item) => <article className="showcase-card-local" key={item.id}><div className="showcase-cover"><img src={item.image} alt="" loading="lazy" />{item.badge ? <span className="showcase-badge">{item.badge}</span> : null}<span className="showcase-type">{item.type}</span></div><div className="showcase-card-body"><h2>{item.title}</h2><p>{item.summary}</p><div className="showcase-card-foot"><span>使用 {item.madeWith}</span>{item.href ? <a href={item.href.startsWith('http') ? item.href : href(item.href)} target={item.href.startsWith('http') ? '_blank' : undefined} rel={item.href.startsWith('http') ? 'noreferrer noopener' : undefined}>{item.href.startsWith('http') ? '查看作品 ↗' : '打开模板 ↗'}</a> : null}</div></div></article>)}</section><section className="showcase-note"><span className="label">为什么不一样</span><h2>把设计系统、Agent 和最终文件放在同一条路径里。</h2><p>Open Design 不只生成一张图，而是把参考、规则、代码和交付物一起留下。</p><a className="inline-link" href={href('/compare/')}>查看工具对比 →</a></section></article></SubpageLayout>;
}

export function CraftPage({ locale }: PageProps) {
  const href = (path: string) => hrefFor(path, locale);
  return <SubpageLayout active="craft" locale={locale}><article className="missing-page craft-page"><header className="catalog-head"><span className="label">Craft / 方法</span><h1 className="display">把好结果，做成可复用的方法。</h1><p className="lead">一组围绕工作流、设计系统和交付检查整理的实践条目。每一条都能继续展开成自己的 Skill。</p></header><section className="craft-list">{CRAFT.map((item, index) => <a href={href(`/craft/${item.slug}/`)} className="craft-row" key={item.slug}><span className="craft-index">{String(index + 1).padStart(2, '0')}</span><span><strong>{item.name}</strong><small>{item.summary}</small></span><span className="craft-arrow">→</span></a>)}</section></article></SubpageLayout>;
}

export function CraftDetailPage({ locale, slug }: PageProps & { slug: string }) {
  const item = CRAFT.find((entry) => entry.slug === slug) ?? CRAFT[0];
  const href = (path: string) => hrefFor(path, locale);
  return <SubpageLayout active="craft" locale={locale}><article className="missing-page craft-detail"><header className="catalog-head"><span className="label">Craft / 方法</span><h1 className="display">{item.name}</h1><p className="lead">{item.summary}</p></header><section className="craft-detail-steps"><h2>执行步骤</h2><ol>{item.steps.map((step) => <li key={step}>{step}</li>)}</ol></section><section className="missing-cta"><a className="btn btn-primary" href={href('/plugins/skills/')}>浏览 Skills</a><a className="btn btn-ghost" href={href('/craft/')}>返回方法目录</a></section></article></SubpageLayout>;
}

export function EnterprisePage({ locale }: PageProps) {
  const [sent, setSent] = useState(false);
  const href = (path: string) => hrefFor(path, locale);
  return <SubpageLayout active="enterprise" locale={locale}><article className="missing-page enterprise-page"><section className="enterprise-layout"><div><span className="label">Workspace / 团队版</span><h1 className="display">让整个团队，共用一条设计路径。</h1><p className="lead">共享工作空间、设计系统、项目和成员管理。告诉我们你的团队正在做什么，我们会一起评估适合的工作方式。</p><ul className="enterprise-perks"><li>共享项目、Skills 与模板</li><li>统一的品牌设计系统</li><li>团队账单与成员管理</li></ul><a className="enterprise-discord" href="https://discord.gg/mHAjSMV6gz" target="_blank" rel="noreferrer noopener">加入 Discord，和团队聊聊 →</a></div><div className="enterprise-card"><h2>申请团队版</h2><p>提交信息后会打开邮件客户端，由你确认并发送。</p>{sent ? <div className="enterprise-sent"><strong>邮件草稿已准备好</strong><span>请在邮件客户端中确认发送。</span></div> : <form onSubmit={(event) => { event.preventDefault(); const form = new FormData(event.currentTarget); const body = `公司：${form.get('company') || ''}\n团队规模：${form.get('team') || ''}\n需求：${form.get('message') || ''}`; window.location.href = `mailto:support@open-design.ai?subject=${encodeURIComponent('Workspace 团队版申请')}&body=${encodeURIComponent(body)}`; setSent(true); }}><label>工作邮箱<input name="email" type="email" placeholder="you@company.com" required /></label><label>公司<input name="company" placeholder="公司名称" required /></label><label>团队规模<select name="team" defaultValue=""><option value="" disabled>请选择</option><option>1–10 人</option><option>11–50 人</option><option>51–200 人</option><option>200 人以上</option></select></label><label>你想用它做什么？<textarea name="message" rows={4} placeholder="产品、原型、品牌、内容或其他工作流" /></label><button className="btn btn-primary" type="submit">准备邮件申请 ↗</button></form>}</div></section><section className="enterprise-note"><span className="label">团队能做什么</span><h2>从一个项目开始，逐步沉淀成团队资产。</h2><div><p>把真实参考、规则、生成过程和最终交付留在同一个项目里，新成员也能快速接手。</p><a className="inline-link" href={href('/pricing/')}>查看价格方案 →</a></div></section></article></SubpageLayout>;
}
