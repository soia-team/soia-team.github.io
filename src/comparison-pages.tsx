import {
  getAlternativeCopy,
  getInfoPageCopy,
  type AgentCtaAction,
  type AgentRichBlock,
  type AgentRichCopy,
  type AlternativeDetailCopy,
} from './upstream/app/info-page-i18n';
import type { LandingLocaleCode } from './upstream/app/i18n';
import { hrefFor, REPO, SubpageLayout } from './shell';

const getCommonCopy = (locale: LandingLocaleCode) => getInfoPageCopy(locale).common;

/**
 * Batch B mirrors the Open Design comparison source:
 * six competitor pages plus the comparison hub. The copy already lives in
 * the upstream i18n snapshot; this module is the React renderer for that
 * contract, including the long-form rich sections and visible FAQ.
 */
export const ALTERNATIVE_SLUGS = ['bolt', 'claude-design', 'figma', 'framer', 'lovable', 'v0'] as const;
export type AlternativeSlug = (typeof ALTERNATIVE_SLUGS)[number];

const COMPETITOR_NAMES: Record<AlternativeSlug, string> = {
  bolt: 'Bolt',
  'claude-design': 'Claude Design',
  figma: 'Figma',
  framer: 'Framer',
  lovable: 'Lovable',
  v0: 'v0',
};

function HtmlText({ text }: { text: string }) {
  return <span dangerouslySetInnerHTML={{ __html: text }} />;
}

function actionHref(action: AgentCtaAction, locale: LandingLocaleCode) {
  return action.external || action.href.startsWith('http') ? action.href : hrefFor(action.href, locale);
}

/** Match the upstream comparison CTA policy: download first, then GitHub. */
function comparisonCtas(actions: readonly AgentCtaAction[], locale: LandingLocaleCode) {
  const kept = actions.filter((action) => action.href !== '/quickstart/');
  const download = kept.find((action) => action.href === '/download/' || action.href.includes('/releases')) ?? kept[0];
  const star = kept.find((action) => action.href === REPO);
  const result: AgentCtaAction[] = [];
  if (download) result.push({ ...download, href: '/download/', external: false, variant: 'primary' });
  if (star) result.push({ ...star, variant: 'ghost', external: true });
  return result.length ? result : actions.map((action) => ({ ...action, href: actionHref(action, locale) }));
}

function RichComparisonBlock({ block }: { block: AgentRichBlock }) {
  if (block.kind === 'p') return <p><HtmlText text={block.text} /></p>;
  if (block.kind === 'ul') return <ul>{block.items.map((item, index) => <li key={`${index}-${item.slice(0, 24)}`}><HtmlText text={item} /></li>)}</ul>;
  if (block.kind === 'ol') return <ol>{block.items.map((item, index) => <li key={`${index}-${item.slice(0, 24)}`}><HtmlText text={item} /></li>)}</ol>;
  if (block.kind === 'steps') return <ul className="comparison-steps">{block.items.map((item) => <li key={item.label}><strong>{item.label}:</strong> <HtmlText text={item.body} /></li>)}</ul>;
  if (block.kind === 'code') return <pre className="agent-code"><code>{block.code}</code></pre>;
  if (block.kind === 'table') {
    return (
      <div className={`compare-table-wrap${block.compact ? ' compare-table-wrap--compact' : ''}`}>
        <table className="compare-table">
          <thead><tr>{block.columns.map((column) => <th key={column}><HtmlText text={column} /></th>)}</tr></thead>
          <tbody>{block.rows.map((row, rowIndex) => <tr key={`${rowIndex}-${row[0]}`}>
            {row.map((cell, cellIndex) => cellIndex === 0
              ? <th scope="row" key={`${rowIndex}-${cellIndex}`}><HtmlText text={cell} /></th>
              : <td key={`${rowIndex}-${cellIndex}`}><HtmlText text={cell} /></td>)}
          </tr>)}</tbody>
        </table>
      </div>
    );
  }
  if (block.kind === 'split') {
    return (
      <div className={`comparison-split comparison-split--${block.imageSide}`}>
        <div className="comparison-split-copy">{block.text.map((text, index) => <p key={`${index}-${text.slice(0, 24)}`}><HtmlText text={text} /></p>)}</div>
        <figure className="comparison-figure">
          <img src={block.image.src} alt={block.image.alt} loading="lazy" decoding="async" />
          {block.image.caption ? <figcaption>{block.image.caption}</figcaption> : null}
        </figure>
      </div>
    );
  }
  return (
    <figure className="comparison-figure comparison-figure-wide">
      <img src={block.src} alt={block.alt} loading="lazy" decoding="async" />
      {block.caption ? <figcaption>{block.caption}</figcaption> : null}
    </figure>
  );
}

function ComparisonToc({ rich }: { rich: AgentRichCopy }) {
  return <nav className="comparison-toc" aria-label={rich.tocLabel}><span>{rich.tocLabel}</span>{rich.toc.map((item) => <a href={`#${item.id}`} key={item.id}>{item.label}</a>)}<a href="#faq">{rich.faqTitle}</a></nav>;
}

function RichAlternativePage({ page, slug, locale }: { page: AlternativeDetailCopy; slug: AlternativeSlug; locale: LandingLocaleCode }) {
  const rich = page.rich!;
  const href = (path: string) => hrefFor(path, locale);
  const heroCtas = comparisonCtas(rich.heroCtaActions, locale);
  const finalCtas = comparisonCtas(rich.ctaActions, locale);
  return (
    <SubpageLayout active="home" locale={locale}>
      <nav className="breadcrumb" aria-label={getInfoPageCopy(locale).common.breadcrumbAria}>
        <a href={href('/')}>Open Design</a><span>/</span><a href={href('/compare/')}>Compare</a><span>/</span><span aria-current="page">{page.breadcrumb}</span>
      </nav>
      <article className="comparison-v4" data-od-id={`alternative-${slug}`}>
        <section className="comparison-band comparison-hero">
          <div className="comparison-inner">
            <p className="comparison-eyebrow">{page.label}</p>
            <h1>{page.heading}</h1>
            <p className="comparison-dek">{rich.heroCtaLead}</p>
            <div className="comparison-cta-row">{heroCtas.map((action) => <a className={action.variant === 'primary' ? 'comparison-btn comparison-btn-primary' : 'comparison-btn comparison-btn-ghost'} href={actionHref(action, locale)} target={action.external ? '_blank' : undefined} rel={action.external ? 'noreferrer noopener' : undefined} key={action.label}>{action.label}</a>)}</div>
            {rich.heroImage ? <figure className="comparison-hero-figure"><img src={rich.heroImage.src} alt={rich.heroImage.alt} loading="eager" decoding="async" />{rich.heroImage.caption ? <figcaption>{rich.heroImage.caption}</figcaption> : null}</figure> : null}
          </div>
        </section>
        <section className="comparison-band comparison-band-alt">
          <div className="comparison-inner"><div className="comparison-intro">{rich.intro.map((text, index) => <p key={`${index}-${text.slice(0, 24)}`}><HtmlText text={text} /></p>)}</div><ComparisonToc rich={rich} /></div>
        </section>
        {rich.sections.map((section, index) => <section className={`comparison-band${index % 2 ? ' comparison-band-alt' : ''}`} id={section.id} key={section.id}><div className="comparison-inner"><p className="comparison-eyebrow comparison-section-index">{String(index + 1).padStart(2, '0')}</p><h2>{section.heading}</h2><div className="comparison-blocks">{section.blocks.map((block, blockIndex) => <RichComparisonBlock block={block} key={`${section.id}-${blockIndex}`} />)}</div></div></section>)}
        <section className="comparison-band comparison-band-alt" id="faq"><div className="comparison-inner"><p className="comparison-eyebrow">FAQ</p><h2>{rich.faqTitle}</h2><ol className="comparison-faq">{rich.faq.map((faq, index) => <li className="faq-item" key={faq.name}><details><summary><span className="faq-index">{String(index + 1).padStart(2, '0')}</span><span className="faq-q">{faq.name}</span><span className="faq-toggle" aria-hidden="true">+</span></summary><p className="faq-a">{faq.text}</p></details></li>)}</ol></div></section>
        <section className="comparison-band comparison-final"><div className="comparison-inner"><h2>{rich.ctaTitle}</h2><p>{rich.ctaBody}</p><div className="comparison-cta-row">{finalCtas.map((action) => <a className={action.variant === 'primary' ? 'comparison-btn comparison-btn-coral' : 'comparison-btn comparison-btn-dark-ghost'} href={actionHref(action, locale)} target={action.external ? '_blank' : undefined} rel={action.external ? 'noreferrer noopener' : undefined} key={action.label}>{action.label}</a>)}</div><p className="comparison-meta">● {getInfoPageCopy(locale).common.apache} · {getInfoPageCopy(locale).common.localFirst} · {getInfoPageCopy(locale).common.byok} · <a href={href('/compare/')}>{rich.hubLinkLabel}</a></p></div></section>
      </article>
    </SubpageLayout>
  );
}

function FlatAlternativePage({ page, competitorName, locale }: { page: AlternativeDetailCopy; competitorName: string; locale: LandingLocaleCode }) {
  const href = (path: string) => hrefFor(path, locale);
  return (
    <SubpageLayout active="home" locale={locale}>
      <nav className="breadcrumb" aria-label={getInfoPageCopy(locale).common.breadcrumbAria}><a href={href('/')}>Open Design</a><span>/</span><a href={href('/compare/')}>Compare</a><span>/</span><span aria-current="page">{page.breadcrumb}</span></nav>
      <article className="info-page comparison-flat"><header className="catalog-head"><span className="label">{page.label}</span><h1 className="display">{page.heading}</h1><p className="lead">{page.lead}</p></header><div className="tldr-card"><h3>{page.tldrTitle}</h3><p>{page.tldrBody}</p></div><nav className="info-toc" aria-label={getCommonCopy(locale).onThisPage}><span>{getCommonCopy(locale).onThisPage}</span>{page.toc.map((item, index) => <a href={`#comparison-${index}`} key={item}>{item}</a>)}</nav><section className="info-section" id="comparison-0"><h2>{page.whyTitle}</h2><p>{page.whyLead}</p><ol>{page.reasons.map((item) => <li key={item.label}><strong>{item.label}</strong> {item.body}</li>)}</ol></section><section className="info-section" id="comparison-1"><h2>{page.localByokTitle}</h2>{page.localByokBody.map((item) => <p key={item}>{item}</p>)}</section><section className="info-section" id="comparison-2"><h2>{page.featureTitle}</h2><div className="compare-table-wrap"><table className="compare-table"><thead><tr><th>Feature</th><th>Open Design</th><th>{competitorName}</th></tr></thead><tbody>{page.features.map((item) => <tr key={item.name}><th scope="row">{item.name}</th><td>{item.od}</td><td>{item.cd}</td></tr>)}</tbody></table></div></section><section className="info-section" id="comparison-3"><h2>{page.whoTitle}</h2><h3>{page.pickClaudeTitle}</h3><ul>{page.pickClaude.map((item) => <li key={item}>{item}</li>)}</ul><h3>{page.pickOpenTitle}</h3><ul>{page.pickOpen.map((item) => <li key={item}>{item}</li>)}</ul></section><section className="info-section" id="comparison-4"><h2>{page.migrateTitle}</h2><p>{page.migrateLead}</p><ol>{page.migrateSteps.map((item) => <li key={item}>{item}</li>)}</ol><p>{page.migrateClosing}</p></section><section className="info-section" id="comparison-5"><h2>{page.faqTitle}</h2><ol className="faq-list">{page.faq.map((faq, index) => <li className="faq-item" key={faq.name}><details><summary><span className="faq-index">{String(index + 1).padStart(2, '0')}</span><span className="faq-q">{faq.name}</span><span className="faq-toggle" aria-hidden="true">+</span></summary><p className="faq-a">{faq.text}</p></details></li>)}</ol></section><section className="info-cta"><div><h2>{page.ctaTitle}</h2><p>{page.ctaBody}</p></div><div className="info-cta-actions"><a className="btn btn-primary" href={href('/download/')}>{getInfoPageCopy(locale).common.downloadDesktop}</a><a className="btn btn-ghost" href={REPO} target="_blank" rel="noreferrer noopener">{getInfoPageCopy(locale).common.starOnGithub}</a></div></section></article>
    </SubpageLayout>
  );
}

export function AlternativeDetailPage({ slug, locale }: { slug: string; locale: LandingLocaleCode }) {
  const page = getAlternativeCopy(locale, slug);
  if (!page) return null;
  const typedSlug = (ALTERNATIVE_SLUGS as readonly string[]).includes(slug) ? slug as AlternativeSlug : 'claude-design';
  return page.rich ? <RichAlternativePage page={page} slug={typedSlug} locale={locale} /> : <FlatAlternativePage page={page} competitorName={COMPETITOR_NAMES[typedSlug]} locale={locale} />;
}

const COMPARE_ORDER: AlternativeSlug[] = ['claude-design', 'figma', 'lovable', 'bolt', 'v0', 'framer'];

export function ComparePage({ locale }: { locale: LandingLocaleCode }) {
  const copy = getInfoPageCopy(locale);
  const page = copy.compare;
  const href = (path: string) => hrefFor(path, locale);
  return (
    <SubpageLayout active="resources" locale={locale}>
      <nav className="breadcrumb" aria-label={copy.common.breadcrumbAria}><a href={href('/')}>Open Design</a><span>/</span><span aria-current="page">{page.breadcrumb}</span></nav>
      <article className="info-page info-page-centered compare-hub"><header className="catalog-head compare-head"><span className="label">{page.label}</span><h1 className="display">{page.heading}</h1><p className="lead">{page.lead}</p></header><nav className="info-toc" aria-label={copy.common.onThisPage}><span>{copy.common.onThisPage}</span>{COMPARE_ORDER.map((slug) => <a href={`#${slug}`} key={slug}>vs {COMPETITOR_NAMES[slug]}</a>)}<a href="#limits">{page.limitsTitle}</a></nav><section className="info-section"><ul className="compare-grid">{COMPARE_ORDER.map((slug, index) => { const alt = getAlternativeCopy(locale, slug); const summary = page.comparisons[index]?.summary ?? alt?.tldrBody ?? ''; return <li className="compare-card" id={slug} key={slug}><h3>Open Design vs <em>{COMPETITOR_NAMES[slug]}</em></h3><p>{summary}</p><a href={href(`/alternatives/${slug}/`)}>{page.comparisons[index]?.cta ?? '查看完整对比 →'}</a></li>; })}</ul></section><section className="info-section" id="limits"><h2>{page.limitsTitle}</h2><p>{page.limitsBody}</p><ol className="faq-list">{page.limitsFaq.map((faq, index) => <li className="faq-item" key={faq.name}><details><summary><span className="faq-index">{String(index + 1).padStart(2, '0')}</span><span className="faq-q">{faq.name}</span><span className="faq-toggle" aria-hidden="true">+</span></summary><p className="faq-a">{faq.text}</p></details></li>)}</ol></section></article>
    </SubpageLayout>
  );
}
