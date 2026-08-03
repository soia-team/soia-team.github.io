import { useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLink, useLocale } from '../components/SiteChrome';
import { CodeBlock, PageHero, Status } from '../components/PageBits';
import { catalog, domainBySlug, experts, localizedPath, skillBySlug, skillsForDomain, t } from '../data/site';

export function OpenPage() {
  const locale = useLocale();
  const zh = locale === 'zh';
  const to = (path: string) => localizedPath(path, locale);
  const [query, setQuery] = useState('');
  const [domainFilter, setDomainFilter] = useState('all');
  const results = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return catalog.skills.filter((skill) =>
      (domainFilter === 'all' || skill.domain === domainFilter) &&
      (!needle || `${skill.slug} ${skill.summary} ${skill.triggers.join(' ')}`.toLowerCase().includes(needle)),
    );
  }, [query, domainFilter]);

  return (
    <>
      <PageHero eyebrow="SOIA / OPEN ECOSYSTEM" title={zh ? <>公开的方法，<br /><em>可检查的能力。</em></> : <>Open method.<br /><em>Inspectable capability.</em></>} lead={<p>{zh ? `${catalog.total} 个公开 Skills、${catalog.domains.length} 个领域插件与 8 个 WorkBuddy Experts。先按要完成的结果查找，不必先背产品名字。` : `${catalog.total} open Skills, ${catalog.domains.length} domain plugins, and 8 WorkBuddy Experts. Search by outcome, not by product name.`}</p>} aside={<div className="hero-metrics"><div><strong>{catalog.total}</strong><span>Skills</span></div><div><strong>{catalog.domains.length}</strong><span>Plugins</span></div><div><strong>8</strong><span>Experts</span></div></div>} />
      <section className="catalog-domains section-pad">
        <div className="section-head split"><div><p className="section-label">01 / DOMAINS</p><h2>{zh ? '八个能力域，各自保持清晰边界。' : 'Eight domains with clear ownership.'}</h2></div><p>{zh ? '领域插件负责安装一组相关 Skills；Expert 负责把角色、资料和推荐任务组织成入口。' : 'A domain plugin installs related Skills; an Expert adds role, knowledge, and suggested tasks.'}</p></div>
        <div className="domain-card-grid">{catalog.domains.map((domain, index) => <Link key={domain.slug} to={to(`/open/${domain.slug}/`)} className="domain-card"><span>0{index + 1}</span><Status>{domain.count} Skills</Status><h3>{zh ? domain.label : domain.labelEn}</h3><p>{zh ? domain.description : domain.descriptionEn}</p><i>↗</i></Link>)}</div>
      </section>
      <section className="skill-index section-pad">
        <div className="section-head split"><div><p className="section-label">02 / SKILL INDEX</p><h2>{zh ? '按任务检索全部 Skills。' : 'Search every Skill by task.'}</h2></div><p>{zh ? '名称、简介和触发语都会参与本地筛选。' : 'Name, summary, and trigger phrases are searchable locally.'}</p></div>
        <div className="catalog-controls"><label><span className="sr-only">Search</span><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder={zh ? '例如：归档网页、写 PRD、安装 Codex…' : 'Try: archive a page, draft a PRD, install Codex…'} /></label><select value={domainFilter} onChange={(event) => setDomainFilter(event.target.value)}><option value="all">{zh ? `全部领域 · ${catalog.total}` : `All domains · ${catalog.total}`}</option>{catalog.domains.map((domain) => <option key={domain.slug} value={domain.slug}>{zh ? domain.label : domain.labelEn} · {domain.count}</option>)}</select><span>{results.length} results</span></div>
        <div className="skill-table">{results.map((skill, index) => <Link to={to(`/open/${skill.domain}/${skill.slug}/`)} key={skill.slug}><span>{String(index + 1).padStart(3, '0')}</span><b>{skill.slug}</b><p>{skill.summary}</p><i>↗</i></Link>)}</div>
      </section>
    </>
  );
}

export function DomainPage() {
  const { domain: domainSlug } = useParams();
  const locale = useLocale();
  const zh = locale === 'zh';
  const to = (path: string) => localizedPath(path, locale);
  const domain = domainBySlug(domainSlug);
  const skills = skillsForDomain(domainSlug);
  if (!domain) return <Missing />;
  return (
    <>
      <PageHero eyebrow={`OPEN PLUGIN / ${domain.plugin.toUpperCase()}`} title={zh ? <>{domain.label}<br /><em>一组边界清楚的能力。</em></> : <>{domain.labelEn}<br /><em>One bounded capability family.</em></>} lead={<p>{zh ? domain.description : domain.descriptionEn} {zh ? '可按领域安装，也可只装一个 Skill。' : 'Install the domain plugin or select one Skill.'}</p>} aside={<div className="plugin-manifest"><small>PLUGIN MANIFEST</small><strong>{domain.plugin}</strong><span>{domain.count} Skills</span><span>Claude Code · Codex · WorkBuddy</span><Status>Available</Status></div>} />
      <section className="domain-intro section-pad"><div><p className="section-label">01 / WHAT YOU GET</p><h2>{zh ? '安装一个领域，按需调用其中能力。' : 'Install one domain. Invoke only what you need.'}</h2></div><ol><li><span>01</span><p><b>{zh ? '公开方法' : 'Open method'}</b>{zh ? '每个 Skill 都有职责、边界与来源。' : 'Every Skill has an owner, boundary, and source.'}</p></li><li><span>02</span><p><b>{zh ? '按宿主安装' : 'Host-aware install'}</b>Claude Code · Codex · WorkBuddy</p></li><li><span>03</span><p><b>{zh ? '可单独选择' : 'Select individually'}</b>{zh ? '不必为了一个任务加载整个领域。' : 'No need to load an entire domain for one task.'}</p></li></ol></section>
      <section className="domain-skills section-pad"><div className="section-head split"><div><p className="section-label">02 / {domain.count} SKILLS</p><h2>{zh ? '能力目录' : 'Capability catalog'}</h2></div><ArrowLink to={to('/open/')}>{zh ? '返回全部领域' : 'Back to all domains'}</ArrowLink></div><div className="domain-skill-grid">{skills.map((skill, index) => <Link to={to(`/open/${domain.slug}/${skill.slug}/`)} key={skill.slug}><span>{String(index + 1).padStart(2, '0')}</span><div><h3>{skill.slug}</h3><p>{skill.summary}</p>{skill.triggers.length > 0 && <small>“{skill.triggers[0]}”</small>}</div><i>↗</i></Link>)}</div></section>
    </>
  );
}

export function SkillPage() {
  const { skill: skillSlug } = useParams();
  const locale = useLocale();
  const zh = locale === 'zh';
  const to = (path: string) => localizedPath(path, locale);
  const skill = skillBySlug(skillSlug);
  const domain = domainBySlug(skill?.domain);
  if (!skill || !domain) return <Missing />;
  const command = skill.install[2] ?? skill.install[0] ?? '';
  return (
    <article className="skill-detail">
      <PageHero compact eyebrow={`${domain.plugin} / SKILL`} title={<><span className="skill-title-break">{skill.slug}</span><br /><em>{skill.summary}</em></>} lead={<div className="skill-hero-actions"><a className="pill-button is-dark" href={skill.sourceUrl} target="_blank" rel="noreferrer">{zh ? '查看源码' : 'View source'} ↗</a><Status>Available · ¥0</Status></div>} aside={<div className="skill-spec"><div><small>DOMAIN</small><b>{zh ? domain.label : domain.labelEn}</b></div><div><small>HOSTS</small><b>Claude Code<br />Codex<br />WorkBuddy</b></div><div><small>DELIVERY</small><b>Open Skill</b></div></div>} />
      <section className="skill-article section-pad"><div className="article-main"><p className="section-label">01 / OUTCOME</p><h2>{zh ? '这个 Skill 帮你完成什么' : 'What this Skill helps you finish'}</h2><p className="large-body">{skill.detail}</p><div className="outcome-board"><div><span>INPUT</span><p>{zh ? '你有权使用的文件、URL、仓库、工作区或清楚目标。' : 'Files, URLs, repositories, workspaces, or goals you are authorized to use.'}</p></div><div><span>METHOD</span><p>{zh ? '先走最小可靠步骤；可预览就先预览，风险动作保留人工确认。' : 'Take the smallest reliable step, preview when possible, and keep risky actions human-approved.'}</p></div><div><span>RECEIPT</span><p>{zh ? '文件变化、生成产物、验证结果、限制与下一步。' : 'File changes, artifacts, validation, limitations, and next steps.'}</p></div></div>{skill.triggers.length > 0 && <><p className="section-label">02 / SAY IT NATURALLY</p><h2>{zh ? '直接这样说' : 'Say it naturally'}</h2><div className="prompt-list">{skill.triggers.map((trigger) => <blockquote key={trigger}>“{trigger}”</blockquote>)}</div></>}<p className="section-label">03 / INSTALL</p><h2>{zh ? '安装整个领域，或只装这一个。' : 'Install the domain or only this Skill.'}</h2>{command && <CodeBlock>{command}</CodeBlock>}<div className="install-tabs">{skill.install.slice(0, 2).map((item, index) => <div key={item}><small>{index === 0 ? 'CLAUDE CODE' : 'CODEX'}</small><CodeBlock>{item}</CodeBlock></div>)}</div><p className="section-label">04 / BOUNDARY</p><h2>{zh ? '能力公开，不代表你的资料公开。' : 'Open capability does not make your data public.'}</h2><p className="large-body">{zh ? '公开仓库只包含通用方法、文档和验证。你的文件、账号、Cookie、Token、内部 SOP 与未公开代码不会因为安装 Skill 自动上传或进入公共仓库。高风险写入仍保留人工确认。' : 'The public repository contains reusable method, documentation, and validation. Your files, credentials, internal SOPs, and private code do not become public by installing a Skill. High-risk writes remain human-approved.'}</p></div><aside className="article-aside"><div className="sticky-card"><small>PUBLIC EVIDENCE</small><p>{zh ? '本页由公开技能目录生成；源码与安装说明是事实来源。' : 'This page is generated from the public capability catalog; source and install docs are the evidence.'}</p><a href={skill.sourceUrl} target="_blank" rel="noreferrer">{zh ? '审查 Skill 源码' : 'Inspect source'} ↗</a><Link to={to(`/open/${domain.slug}/`)}>{zh ? '返回能力域' : 'Back to domain'} →</Link></div></aside></section>
    </article>
  );
}

export function ExpertsPage() {
  const locale = useLocale();
  const zh = locale === 'zh';
  const to = (path: string) => localizedPath(path, locale);
  return <><PageHero eyebrow="SOIA / WORKBUDDY EXPERTS" title={zh ? <>不用先背技能名，<br /><em>直接召唤一个角色。</em></> : <>Invoke a role,<br /><em>not a list of names.</em></>} lead={<p>{zh ? 'Expert 把一个领域的角色、Skills、资料边界与推荐任务组织成可维护入口；方法公开，私人资料仍留在授权范围。' : 'An Expert bundles role, Skills, knowledge boundaries, and suggested tasks while keeping private context scoped.'}</p>} aside={<div className="hero-metrics"><div><strong>8</strong><span>Experts</span></div><div><strong>{catalog.total}</strong><span>Skills</span></div></div>} /><section className="expert-directory section-pad"><div className="expert-directory-grid">{experts.map((expert, index) => { const domain = domainBySlug(expert.slug); return <Link key={expert.slug} to={to(`/open/experts/${expert.slug}/`)}><span>0{index + 1}</span><Status>Preview</Status><h2>{t(expert.name, locale)}</h2><p>{expert.body}</p><small>{domain?.count ?? 0} Skills</small><i>↗</i></Link>; })}</div></section></>;
}

export function ExpertPage() {
  const { expert: expertSlug } = useParams();
  const locale = useLocale();
  const zh = locale === 'zh';
  const to = (path: string) => localizedPath(path, locale);
  const expert = experts.find((item) => item.slug === expertSlug);
  const domain = domainBySlug(expertSlug);
  const skills = skillsForDomain(expertSlug);
  if (!expert || !domain) return <Missing />;
  return <><PageHero eyebrow="WORKBUDDY / EXPERT" title={<>{t(expert.name, locale)}<br /><em>{zh ? '按结果组织能力。' : 'Capabilities organized by outcome.'}</em></>} lead={<p>{expert.body}</p>} aside={<div className="plugin-manifest"><small>EXPERT MANIFEST</small><strong>soia-{expert.slug}</strong><span>{skills.length} Skills</span><Status>Preview</Status></div>} /><section className="expert-detail section-pad"><div className="expert-role"><p className="section-label">01 / ROLE</p><h2>{zh ? '这个专家负责什么' : 'What this Expert owns'}</h2><p>{zh ? `${domain.description} Expert 会按任务选择最小的能力集合，不默认读取不相关资料，也不会代替用户批准高风险动作。` : `${domain.descriptionEn} It selects the smallest useful capability set and does not replace human approval for risky actions.`}</p><div className="prompt-list"><blockquote>“{zh ? `帮我用${domain.label}专家完成这个任务，先给执行计划。` : `Use the ${domain.labelEn} Expert for this task and show the plan first.`}”</blockquote><blockquote>“{zh ? '只使用我明确提供的资料，不要扩展权限。' : 'Use only the material I explicitly provide; do not expand permissions.'}”</blockquote></div></div><div className="expert-capabilities"><p className="section-label">02 / INCLUDED SKILLS</p><div className="mini-skill-list">{skills.map((skill) => <Link key={skill.slug} to={to(`/open/${skill.domain}/${skill.slug}/`)}><b>{skill.slug}</b><span>{skill.summary}</span><i>↗</i></Link>)}</div></div></section></>;
}

function Missing() {
  const locale = useLocale();
  return <section className="missing"><p>404</p><h1>{locale === 'zh' ? '没有找到这个公开能力。' : 'This capability was not found.'}</h1><Link to={localizedPath('/open/', locale)}>{locale === 'zh' ? '返回开放生态' : 'Back to open ecosystem'} →</Link></section>;
}
