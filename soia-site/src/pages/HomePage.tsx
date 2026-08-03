import { Link } from 'react-router-dom';
import { visuals } from '../assets';
import { ArrowLink, useLocale } from '../components/SiteChrome';
import { catalog, experts, localizedPath, productShapes, serviceLadder, t } from '../data/site';

export function HomePage() {
  const locale = useLocale();
  const to = (path: string) => localizedPath(path, locale);
  const zh = locale === 'zh';

  return (
    <>
      <section className="home-hero">
        <img className="hero-backdrop" src={visuals.heroBackdrop} alt="" />
        <div className="hero-copy">
          <p className="lime-kicker">{zh ? '从开放能力开始' : 'START WITH OPEN CAPABILITY'}</p>
          <h1><span className="serif">SOIA</span><br />{zh ? '把 AI 能力落进真实工作' : 'Capability for real work'}</h1>
          <div className="hero-actions">
            <Link className="pill-button is-dark" to={to('/open/')}>{zh ? '进入开放生态' : 'Explore open ecosystem'} <span>↗</span></Link>
            <a className="pill-button" href="https://github.com/soia-team/soia-open-skills" target="_blank" rel="noreferrer">GitHub · {catalog.total} Skills</a>
          </div>
          <p className="hero-lead">{zh
            ? '从一个重复而重要的任务开始，把公开 Skill、可组合 Workflow、宿主 Plugin 与 Expert 放进同一条可安装、可复跑、可验收的工作路径。'
            : 'Start with one repeated, important task. Turn open Skills, composable Workflows, host Plugins, and Experts into an installable and verifiable work path.'}</p>
        </div>
        <CapabilityStudio locale={locale} />
      </section>

      <section className="statement-section">
        <div className="section-rail"><span>01</span><span>{zh ? '问题' : 'THE PROBLEM'}</span></div>
        <div className="statement-copy">
          <p className="section-label">{zh ? '不是再多一个工具' : 'NOT ANOTHER TOOL'}</p>
          <h2>{zh ? <>让一件重要的事，<br />能稳定完成。</> : <>Make one important task<br />finish reliably.</>}</h2>
          <p>{zh ? 'SOIA 用结果、输入、步骤、交接与验收组织能力。先公开方法和证据，再在授权范围内接入私有资料。' : 'SOIA organizes capability around outcomes, inputs, steps, handoffs, and acceptance. Public method comes first; private context stays scoped.'}</p>
        </div>
      </section>

      <section className="product-showcase section-pad">
        <div className="section-head centered">
          <p className="section-label">02 / {zh ? '交付形态' : 'DELIVERY SHAPES'}</p>
          <h2>{zh ? '同一套方法，不止一种交付。' : 'One method. Four delivery shapes.'}</h2>
          <p>{zh ? '先看最终拿到什么，再决定需要免费能力、学习方法，还是私有落地。' : 'Start with the outcome, then choose open capability, learning, or private delivery.'}</p>
        </div>
        <div className="shape-grid">
          {productShapes.map((shape, index) => (
            <article className={`shape-card shape-${index + 1}`} key={shape.id}>
              <span className="card-number">{shape.id}</span>
              <small>{t(shape.status, locale)}</small>
              <h3>{shape.name}</h3>
              <h4>{t(shape.title, locale)}</h4>
              <p>{t(shape.body, locale)}</p>
              <ArrowLink to={to(shape.href)}>{zh ? '了解详情' : 'Explore'}</ArrowLink>
            </article>
          ))}
        </div>
      </section>

      <section className="workflow-section section-pad">
        <div className="workflow-title">
          <p className="section-label">03 / {zh ? '从任务到系统' : 'TASK TO SYSTEM'}</p>
          <h2>{zh ? <>把一次成功，<br />变成可以复跑的方法。</> : <>Turn one success<br />into a repeatable method.</>}</h2>
        </div>
        <div className="workflow-board">
          {[
            [zh ? '选择任务' : 'Choose outcome', zh ? '高频、重要、可检查' : 'Frequent, important, inspectable'],
            [zh ? '封装 Skill' : 'Package a Skill', zh ? '触发、输入、边界、验收' : 'Trigger, input, boundary, acceptance'],
            [zh ? '连接 Workflow' : 'Connect a Workflow', zh ? '交接、批准与失败处理' : 'Handoffs, approval, failure handling'],
            [zh ? '装入宿主' : 'Install into a host', 'Codex · Claude Code · WorkBuddy'],
            [zh ? '运行与复核' : 'Run and review', zh ? '真实输入、版本与回执' : 'Real inputs, versions, receipts'],
          ].map(([title, body], index) => <div className="workflow-step" key={title}><span>0{index + 1}</span><div><b>{title}</b><small>{body}</small></div></div>)}
        </div>
      </section>

      <section className="open-section section-pad">
        <div className="open-copy">
          <p className="section-label">04 / OPEN ECOSYSTEM</p>
          <h2>{zh ? <>先用公开能力，<br />证明它值得被使用。</> : <>Prove value with<br />open capability first.</>}</h2>
          <p>{zh ? `${catalog.total} 个公开 Skills 分布在 ${catalog.domains.length} 个能力域。源码、安装路径、适用边界和状态证据都可检查。` : `${catalog.total} open Skills across ${catalog.domains.length} domains, with inspectable source, installation, boundaries, and status evidence.`}</p>
          <ArrowLink to={to('/open/')} className="pill-button is-dark">{zh ? '浏览全部 Skills' : 'Browse all Skills'}</ArrowLink>
        </div>
        <div className="domain-list">
          {catalog.domains.map((domain, index) => (
            <Link to={to(`/open/${domain.slug}/`)} key={domain.slug}><span>0{index + 1}</span><b>{zh ? domain.label : domain.labelEn}</b><small>{domain.count} Skills</small><i>↗</i></Link>
          ))}
        </div>
      </section>

      <section className="expert-stage section-pad">
        <div className="expert-art"><img src={visuals.labArt} alt="" /></div>
        <div className="expert-panel">
          <p className="section-label">05 / WORKBUDDY EXPERTS</p>
          <h2>{zh ? '需要角色时，不必先背 80 个名字。' : 'Invoke a role instead of memorizing 80 names.'}</h2>
          <p>{zh ? '每个领域 Expert 都把角色、可用 Skills、资料边界和推荐任务组织在一起。' : 'Each domain Expert organizes a role, available Skills, knowledge boundaries, and suggested tasks.'}</p>
          <div className="expert-chips">{experts.map((expert) => <Link key={expert.slug} to={to(`/open/experts/${expert.slug}/`)}>{t(expert.name, locale)} <span>↗</span></Link>)}</div>
        </div>
      </section>

      <section className="course-band section-pad">
        <div>
          <p className="section-label">06 / COURSE</p>
          <h2>{zh ? <>自己掌握方法：<br />AI 内容系统实操课</> : <>Learn the method:<br />AI Content System Course</>}</h2>
          <p>{zh ? '10 章 39 节，围绕一个真实任务，把 Skill、Workflow、知识库、Plugin 和 Expert 串成可运行系统。' : 'Ten chapters and 39 lessons turn one real task into a running system across Skills, Workflows, knowledge, Plugins, and Experts.'}</p>
          <ArrowLink to={to('/course/')} className="pill-button is-dark">{zh ? '查看课程详情' : 'View course'}</ArrowLink>
        </div>
        <aside className="course-price"><small>{zh ? '首期内测价' : 'FIRST COHORT'}</small><strong>¥980</strong><span>{zh ? '一次性付费' : 'One-time payment'}</span><ul><li>{zh ? '约 8–10 小时' : 'About 8–10 hours'}</li><li>{zh ? '结业项目' : 'Capstone project'}</li><li>{zh ? '持续更新不少于 1 年' : 'At least one year of updates'}</li></ul></aside>
      </section>

      <section className="service-section section-pad">
        <div className="section-head split"><div><p className="section-label">07 / PRIVATE DELIVERY</p><h2>{zh ? '共同落地你的私有流程。' : 'Deliver a private workflow together.'}</h2></div><p>{zh ? '从一个边界清楚、可以验收的场景开始；资料、权限、宿主与维护范围分别确认。' : 'Start with one bounded, testable scenario. Confirm material, permissions, hosts, and maintenance separately.'}</p></div>
        <div className="service-grid">{serviceLadder.map((service) => <article key={service.id}><span>{service.id} / {service.code}</span><small>{t(service.status, locale)}</small><h3>{t(service.title, locale)}</h3><p>{t(service.body, locale)}</p><ArrowLink to={to('/services/')}>{zh ? '查看交付边界' : 'View scope'}</ArrowLink></article>)}</div>
      </section>

      <section className="final-cta">
        <img src={visuals.ctaArt} alt="" />
        <div><p className="section-label">START WITH ONE OUTCOME</p><h2>{zh ? '先用一个真实任务，验证第一项能力。' : 'Validate the first capability with one real task.'}</h2><div className="hero-actions"><Link className="pill-button is-dark" to={to('/open/')}>{zh ? '从免费能力开始' : 'Start free'}</Link><Link className="pill-button" to={to('/services/')}>{zh ? '带着流程来沟通' : 'Bring a workflow'}</Link></div></div>
      </section>
    </>
  );
}

function CapabilityStudio({ locale }: { locale: 'zh' | 'en' }) {
  const zh = locale === 'zh';
  return (
    <div className="studio-window" aria-label={zh ? 'SOIA 能力工作台示意' : 'SOIA capability studio illustration'}>
      <div className="studio-toolbar"><div><i /><i /><i /></div><span>SOIA CAPABILITY STUDIO</span><small>v0.1</small></div>
      <div className="studio-body">
        <aside><b>{zh ? '能力库' : 'Library'}</b>{['知识系统', '内容生产', '软件交付', '环境支持'].map((item, index) => <span className={index === 1 ? 'active' : ''} key={item}><i />{zh ? item : ['Knowledge', 'Content', 'Delivery', 'Environment'][index]}</span>)}</aside>
        <div className="studio-canvas">
          <div className="studio-path"><span>01</span><b>{zh ? '输入观点与资料' : 'Inputs & sources'}</b></div>
          <i className="path-line" />
          <div className="studio-path is-accent"><span>02</span><b>{zh ? '运行内容工作流' : 'Run content workflow'}</b><small>6 Skills</small></div>
          <i className="path-line" />
          <div className="studio-path"><span>03</span><b>{zh ? '生成多平台草稿' : 'Create channel drafts'}</b></div>
        </div>
        <aside className="studio-inspector"><b>{zh ? '验收' : 'Review'}</b><p><span>✓</span>{zh ? '事实来源' : 'Sources'}</p><p><span>✓</span>{zh ? '人工发布' : 'Human publish'}</p><p><span>✓</span>{zh ? '运行回执' : 'Run receipt'}</p></aside>
      </div>
    </div>
  );
}
