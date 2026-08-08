/*
 * /solutions/ hub, solution detail pages and /download/ — React ports of the
 * upstream Astro pages. Structure and copy mirror
 *   app/pages/solutions/index.astro
 *   app/pages/solutions/screenshot-to-code/index.astro
 *   app/pages/download/index.astro
 * from the Open Design landing page source (soia Website project).
 * The /download/ matrix follows upstream's dual behavior: static fallback
 * links to the neutral GitHub releases page; a client-side enhancer refetches
 * releases/latest and patches real asset hrefs + the recommended card.
 */
import { useEffect, useState, type ReactNode } from 'react';
import { getCommonCopy, getHeaderProductMenuCopy, type LandingLocaleCode } from './upstream/app/i18n';
import { getInfoPageCopy } from './upstream/app/info-page-i18n';
import { getSolutionsIndexCopy } from './upstream/app/solutions-index-i18n';
import { getSolutionPageCopy, type SolutionPageKey } from './upstream/app/solution-pages-i18n';
import { DESIGN_SYSTEM_CARDS, SOLUTION_PLUGIN_CARDS, type DesignSystemCard, type SolutionCard } from './solution-featured';
import { SOLUTION_CARD_MEDIA } from './solution-card-media';
import { hrefFor, REPO, SubpageLayout } from './shell';

// Pages whose hero image doubles as a live-proof link to the template
// library (the ↗ arrow CTA the live original renders via
// .solution-proof-media) — mirrors the four pages that use
// solution-proof-media in the upstream Astro source.
const PROOF_MEDIA_SLUGS = new Set(['ai-landing-page-generator', 'prototype', 'slides', 'product-managers']);

const REPO_RELEASES = `${REPO}/releases`;
const REPO_API = 'https://api.github.com/repos/nexu-io/open-design';

/* ------------------------------------------------------------------ *
 * /solutions/ — solution hub
 * ------------------------------------------------------------------ */

type Entry = { key: SolutionPageKey; slug: string };

// Order mirrors the header dropdown: Tools → Use cases → Roles.
const TOOLS: ReadonlyArray<Entry> = [
  { key: 'aiWireframeGenerator', slug: 'ai-wireframe-generator' },
  { key: 'aiUiGenerator', slug: 'ai-ui-generator' },
  { key: 'aiPrototypeGenerator', slug: 'ai-prototype-generator' },
  { key: 'aiLandingPageGenerator', slug: 'ai-landing-page-generator' },
  { key: 'designToCode', slug: 'design-to-code' },
  { key: 'figmaToCode', slug: 'figma-to-code' },
  { key: 'screenshotToCode', slug: 'screenshot-to-code' },
  { key: 'htmlToPpt', slug: 'html-to-ppt' },
];

const USE_CASES: ReadonlyArray<Entry> = [
  { key: 'prototype', slug: 'prototype' },
  { key: 'dashboard', slug: 'dashboard' },
  { key: 'slides', slug: 'slides' },
  { key: 'image', slug: 'image' },
  { key: 'video', slug: 'video' },
  { key: 'designSystem', slug: 'design-system' },
];

const ROLES: ReadonlyArray<Entry> = [
  { key: 'roleSoloBuilder', slug: 'solo-builder' },
  { key: 'roleDesigner', slug: 'designer' },
  { key: 'roleEngineering', slug: 'engineering' },
  { key: 'roleProductManagers', slug: 'product-managers' },
  { key: 'roleMarketing', slug: 'marketing' },
];

function SolutionCard({ entry, locale }: { entry: Entry; locale: LandingLocaleCode }) {
  const copy = getSolutionPageCopy(locale, entry.key);
  return (
    <li className="compare-card">
      <h3>{copy.breadcrumb}</h3>
      <p>{copy.description}</p>
      <a className="btn btn-ghost solution-card-action" href={hrefFor(`/solutions/${entry.slug}/`, locale)}>
        <span>{copy.breadcrumb}</span>
        <span className="ri" aria-hidden="true">&#xea6c;</span>
      </a>
    </li>
  );
}

export function SolutionsIndexPage({ locale }: { locale: LandingLocaleCode }) {
  const page = getSolutionsIndexCopy(locale);
  const nav = getCommonCopy(locale).header.nav;
  const productMenu = getHeaderProductMenuCopy(locale);
  const common = getInfoPageCopy(locale).common;
  const href = (path: string) => hrefFor(path, locale);
  return (
    <SubpageLayout active="solution" locale={locale}>
      <nav className="breadcrumb" aria-label={common.breadcrumbAria}>
        <a href={href('/')}>Open Design</a>
        <span>/</span>
        <span aria-current="page">{page.heading}</span>
      </nav>
      <article className="info-page solution-index-page" data-od-id="route-solutions">
        <header className="catalog-head">
          <span className="label">{page.label}</span>
          <h1 className="display">{page.heading}</h1>
          <p className="lead">{page.lead}</p>
        </header>

        <section className="info-section" aria-labelledby="tools-heading">
          <h2 id="tools-heading">{productMenu.tools}</h2>
          <ul className="compare-grid">
            {TOOLS.map((entry) => <SolutionCard entry={entry} locale={locale} key={entry.slug} />)}
          </ul>
        </section>

        <section className="info-section" aria-labelledby="use-cases-heading">
          <h2 id="use-cases-heading">{nav.useCases}</h2>
          <ul className="compare-grid">
            {USE_CASES.map((entry) => <SolutionCard entry={entry} locale={locale} key={entry.slug} />)}
          </ul>
        </section>

        <section className="info-section" aria-labelledby="roles-heading">
          <h2 id="roles-heading">{nav.roles}</h2>
          <ul className="compare-grid">
            {ROLES.map((entry) => <SolutionCard entry={entry} locale={locale} key={entry.slug} />)}
          </ul>
        </section>
      </article>
    </SubpageLayout>
  );
}

/* ------------------------------------------------------------------ *
 * /solutions/<slug>/ — solution detail pages (tool / use-case / role / ds)
 * ------------------------------------------------------------------ */

export type SolutionPageKind = 'tool' | 'usecase' | 'role' | 'design-system' | 'html-ppt';

export type SolutionRouteSpec = {
  key: SolutionPageKey;
  kind: SolutionPageKind;
  hero: string;
};

// One entry per solution detail route. Keys mirror the header dropdown and
// the hub card order; hero paths match the live original page (lab-cards for
// prototype/slides/product-managers/landing-page, /solutions/<slug>-hero.*
// for the rest).
export const SOLUTION_ROUTES: Record<string, SolutionRouteSpec> = {
  'ai-wireframe-generator': { key: 'aiWireframeGenerator', kind: 'tool', hero: '/solutions/ai-wireframe-generator-hero.webp' },
  'ai-ui-generator': { key: 'aiUiGenerator', kind: 'tool', hero: '/solutions/ai-ui-generator-hero.webp' },
  'ai-prototype-generator': { key: 'aiPrototypeGenerator', kind: 'tool', hero: '/solutions/ai-prototype-generator-hero.webp' },
  'ai-landing-page-generator': { key: 'aiLandingPageGenerator', kind: 'tool', hero: '/lab-cards/prototype.webp' },
  'design-to-code': { key: 'designToCode', kind: 'tool', hero: '/solutions/design-to-code-hero.webp' },
  'figma-to-code': { key: 'figmaToCode', kind: 'tool', hero: '/solutions/figma-to-code-hero.webp' },
  'html-to-ppt': { key: 'htmlToPpt', kind: 'html-ppt', hero: '/solutions/html-to-ppt-hero.webp' },
  'screenshot-to-code': { key: 'screenshotToCode', kind: 'tool', hero: '/solutions/screenshot-to-code-hero.webp' },
  prototype: { key: 'prototype', kind: 'usecase', hero: '/lab-cards/prototype.webp' },
  dashboard: { key: 'dashboard', kind: 'usecase', hero: '/solutions/dashboard-hero.jpg' },
  slides: { key: 'slides', kind: 'usecase', hero: '/lab-cards/slides.webp' },
  image: { key: 'image', kind: 'usecase', hero: '/solutions/image-hero.jpg' },
  video: { key: 'video', kind: 'usecase', hero: '/solutions/video-hero.jpg' },
  'design-system': { key: 'designSystem', kind: 'design-system', hero: '/solutions/design-system-hero.jpg' },
  'solo-builder': { key: 'roleSoloBuilder', kind: 'role', hero: '/solutions/solo-builder-hero.jpg' },
  designer: { key: 'roleDesigner', kind: 'role', hero: '/solutions/designer-hero.jpg' },
  engineering: { key: 'roleEngineering', kind: 'role', hero: '/solutions/engineering-hero.jpg' },
  'product-managers': { key: 'roleProductManagers', kind: 'role', hero: '/lab-cards/live-artifact.webp' },
  marketing: { key: 'roleMarketing', kind: 'role', hero: '/solutions/marketing-hero.jpg' },
};

function SolutionPluginCard({ card, locale }: { card: SolutionCard; locale: LandingLocaleCode }) {
  const href = (path: string) => hrefFor(path, locale);
  // Real poster + kind chip from the template-card.astro resolution chain
  // (manifest poster → baked R2 preview → local screenshot). A card with no
  // known poster keeps the placeholder rather than rendering a broken image.
  const media = SOLUTION_CARD_MEDIA[card.href];
  return (
    <li className="tpl-card">
      <span className="tpl-band" aria-hidden="true" />
      <a className="tpl-media" href={href(card.href)} aria-label={card.title}>
        {media?.poster ? (
          <img
            className="tpl-media-poster"
            src={media.poster}
            alt={card.title}
            loading="lazy"
            decoding="async"
          />
        ) : (
          <span className="tpl-media-empty" aria-hidden="true" />
        )}
        {media?.kind && <span className="tpl-media-kind">{media.kind}</span>}
      </a>
      <div className="tpl-meta">
        <span className="tpl-author">@open-design</span>
        <span className="tpl-meta-date">Open Design</span>
      </div>
      <a className="tpl-excerpt" href={href(card.href)}>
        <span className="tpl-excerpt-head">查看完整提示词 →</span>
        <h3 className="tpl-excerpt-title">{card.title}</h3>
        <p className="tpl-excerpt-body">{card.desc}</p>
      </a>
      <div className="tpl-actions">
        <a className="tpl-cta" href={href(card.href)}>使用此模板</a>
      </div>
    </li>
  );
}

function SolutionSystemCard({ card, locale }: { card: DesignSystemCard; locale: LandingLocaleCode }) {
  const href = (path: string) => hrefFor(path, locale);
  return (
    <li className="system-card">
      <a href={href(card.href)}>
        <div className="system-swatches" aria-hidden="true">
          {(card.palette ?? []).map((color, index) => (
            <span className="swatch" key={`${color}-${index}`} style={{ backgroundColor: color }} />
          ))}
        </div>
        <span className="system-name">{card.name}</span>
        <span className="system-cat">{card.category}</span>
        <p className="system-tagline">{card.tagline}</p>
        <span className="system-cta">查看设计系统 →</span>
      </a>
    </li>
  );
}

export function SolutionDetailPage({ slug, locale }: { slug: string; locale: LandingLocaleCode }) {
  const spec = SOLUTION_ROUTES[slug];
  const page = getSolutionPageCopy(locale, spec.key);
  const common = getInfoPageCopy(locale).common;
  const nav = getCommonCopy(locale).header.nav;
  const href = (path: string) => hrefFor(path, locale);
  const platform = useDetectedPlatform();
  const release = useLatestRelease();
  // Direct installer for the detected platform (versioned asset rule, same as
  // the live site). Unknown/linux platforms fall back to the in-site download
  // page which exposes the full platform matrix — never a bare releases page.
  const downloadHref = assetDownloadUrl(platform, release.version) ?? href('/download/');
  const downloadIsExternal = downloadHref.startsWith('http');
  const faq = page.faq;
  const relatedTools = page.related ?? [];
  const pluginCards = SOLUTION_PLUGIN_CARDS[slug];
  const systemCards = spec.kind === 'design-system' ? DESIGN_SYSTEM_CARDS : [];
  // Tool pages lead with the download CTA; use-case/role/design-system lead
  // with the GitHub star CTA (mirrors each page's hero on the live site).
  const isStarLead = spec.kind === 'usecase' || spec.kind === 'role' || spec.kind === 'design-system';
  const showBreadcrumbHub = spec.kind === 'tool' || spec.kind === 'html-ppt';
  return (
    <SubpageLayout active="solution" locale={locale}>
      <nav className="breadcrumb" aria-label={common.breadcrumbAria}>
        <a href={href('/')}>Open Design</a>
        <span>/</span>
        {showBreadcrumbHub ? (
          <><a href={href('/solutions/')}>{nav.solution}</a><span>/</span></>
        ) : null}
        <span aria-current="page">{page.breadcrumb}</span>
      </nav>
      <article className="info-page solution-page" data-od-id={`route-solutions-${slug}`}>
        <div className="solution-hero-band">
          <header className="catalog-head">
            <span className="label">{page.label}</span>
            <h1 className="display">{page.heading}</h1>
            <p className="lead">{page.lead}</p>
            <div className="solution-hero-cta">
              {isStarLead ? (
                <><a className="btn btn-primary" href={REPO} target="_blank" rel="noreferrer noopener">{common.starOnGithub}</a><a className="btn btn-ghost" href={downloadHref} target={downloadIsExternal ? '_blank' : undefined} rel={downloadIsExternal ? 'noreferrer noopener' : undefined}>{common.downloadDesktop}</a></>
              ) : (
                <><a className="btn btn-primary" href={downloadHref} target={downloadIsExternal ? '_blank' : undefined} rel={downloadIsExternal ? 'noreferrer noopener' : undefined}>{common.downloadDesktop}</a><a className="btn btn-ghost" href={REPO} target="_blank" rel="noreferrer noopener">{common.starOnGithub}</a></>
              )}
            </div>
          </header>
          <figure className={PROOF_MEDIA_SLUGS.has(slug) ? 'solution-hero solution-proof-media' : 'solution-hero'}>
            {PROOF_MEDIA_SLUGS.has(slug) ? (
              <a href={href(page.exampleHref)} aria-label={page.exampleLinkLabel}>
                <img
                  src={spec.hero}
                  alt={page.heroImageAlt}
                  loading="eager"
                  width={1280}
                  height={853}
                />
                <span className="solution-proof-open" aria-hidden="true">↗</span>
              </a>
            ) : (
              <img
                src={spec.hero}
                alt={page.heroImageAlt}
                loading="eager"
                width={1280}
                height={853}
              />
            )}
          </figure>
        </div>

        <div className="tldr-card">
          <h3>{page.tldrTitle}</h3>
          <p>{page.tldrBody}</p>
        </div>

        <section className="info-section" id="how">
          <h2>{page.stepsTitle}</h2>
          <ol className="solution-steps">
            {page.steps.map((step, idx) => (
              <li className="solution-step" key={step.title}>
                <span className="solution-step-index">{String(idx + 1).padStart(2, '0')}</span>
                <div className="solution-step-text">
                  <h3>{step.title}</h3>
                  <p>{step.body}</p>
                </div>
              </li>
            ))}
          </ol>
        </section>

        <section className="info-section" id="features">
          <h2>{page.featuresTitle}</h2>
          {spec.kind === 'design-system' ? (
            <ul className="solution-system-grid">
              {systemCards.map((card) => <SolutionSystemCard card={card} locale={locale} key={card.href} />)}
            </ul>
          ) : (spec.kind === 'usecase' || spec.kind === 'role') && pluginCards ? (
            <ul className="tpl-grid solution-tpl-grid">
              {pluginCards.map((card) => <SolutionPluginCard card={card} locale={locale} key={card.href} />)}
            </ul>
          ) : (
            <ul className="tool-feature-grid">
              {page.features.map((f) => (
                <li className="tool-feature-card" key={f.title}>
                  <h3>{f.title}</h3>
                  <p>{f.body}</p>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="info-section" id="compare">
          <h2>{page.tableTitle}</h2>
          <div className="compare-table-wrap">
            <table className="compare-table">
              <thead>
                <tr>
                  <th>{page.tableColCapability}</th>
                  <th>{page.tableColWithOd}</th>
                  <th>{page.tableColWithout}</th>
                </tr>
              </thead>
              <tbody>
                {page.tableRows.map((row) => (
                  <tr key={row.capability}>
                    <th scope="row">{row.capability}</th>
                    <td className="yes"><span className="check ri" aria-hidden="true">&#xeb7b;</span>{row.withOd}</td>
                    <td>{row.without}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="info-section" id="browse">
          {spec.kind === 'html-ppt' ? (
            <>
              <h2>{page.galleryTitle}</h2>
              <ul className="tpl-grid solution-tpl-grid">
                {(pluginCards ?? []).map((card) => <SolutionPluginCard card={card} locale={locale} key={card.href} />)}
              </ul>
            </>
          ) : (
            <p>{page.galleryLead}</p>
          )}
          <p>
            <a className="inline-link" href={href(page.exampleHref)}>{page.exampleLinkLabel} →</a>
          </p>
        </section>

        <section className="info-section" id="faq">
          <h2>{page.faqTitle}</h2>
          <ol className="faq-list">
            {faq.map((item, idx) => (
              <li className="faq-item" key={item.q}>
                <details>
                  <summary>
                    <span className="faq-index">{String(idx + 1).padStart(2, '0')}</span>
                    <span className="faq-q">{item.q}</span>
                    <span className="faq-toggle" aria-hidden="true">+</span>
                  </summary>
                  <p className="faq-a">{item.a}</p>
                </details>
              </li>
            ))}
          </ol>
        </section>

        {relatedTools.length > 0 && (
          <section className="info-section" id="related">
            <h2>{page.relatedTitle}</h2>
            <ul className="related-tools">
              {relatedTools.map((t) => (
                <li key={t.href}><a className="inline-link" href={href(t.href)}>{t.label} →</a></li>
              ))}
            </ul>
          </section>
        )}

        <section className="info-cta" aria-label="Open Design call to action">
          <div>
            <h2>{page.ctaTitle}</h2>
            <p>{page.ctaBody}</p>
          </div>
          <div className="info-cta-actions">
            <a className="btn btn-primary" href={REPO} target="_blank" rel="noreferrer noopener">{common.starOnGithub}</a>
            <a className="btn btn-ghost" href={downloadHref} target={downloadIsExternal ? '_blank' : undefined} rel={downloadIsExternal ? 'noreferrer noopener' : undefined}>{common.downloadDesktop}</a>
          </div>
          <div className="info-cta-meta">
            <span className="stamp">● {common.apache}</span>
            <span>{common.localFirst} · {common.byok}</span>
            <span>{common.macWinLinux}</span>
          </div>
        </section>
      </article>
    </SubpageLayout>
  );
}

/* ------------------------------------------------------------------ *
 * /download/ — download center
 * ------------------------------------------------------------------ */

interface ReleaseAsset { name: string; url: string; size: number; sha256Url: string | null; }
interface LatestRelease {
  /** Pure version, e.g. '0.17.0' (no leading v). */
  version: string;
  versionLabel: string;
  publishedAt: string | null;
  /** Version-info link (GitHub tag/release page) — NOT a download button href. */
  releaseUrl: string;
  assets: {
    macArm64Dmg: ReleaseAsset | null;
    macX64Dmg: ReleaseAsset | null;
    winSetup: ReleaseAsset | null;
    linux: ReleaseAsset | null;
  };
}

// Versioned asset rule identical to the live original site (and the OD
// project's landing-page/_lib/github.ts): every direct download AND checksum
// href is `https://releases.open-design.ai/stable/versions/<version>/<file>`.
// GitHub /releases/latest still supplies the version + asset list; the CDN
// serves the actual bytes. Verified reachable (HTTP 200) on 2026-08-05.
const RELEASES_CDN = 'https://releases.open-design.ai';
const PLATFORM_ASSET_FILE: Record<PlatformKey, ((version: string) => string) | null> = {
  'mac-arm64': (v) => `open-design-${v}-mac-arm64.dmg`,
  'mac-x64': (v) => `open-design-${v}-mac-x64.dmg`,
  win: (v) => `open-design-${v}-win-x64-setup.exe`,
  // No AppImage asset ships in the release; the original site keeps Linux on
  // the release page, and so do we.
  linux: null,
};

const cdnAssetUrl = (version: string, name: string): string =>
  `${RELEASES_CDN}/stable/versions/${version}/${name}`;

function assetDownloadUrl(platform: PlatformKey | null, version: string): string | null {
  if (!platform) return null;
  const file = PLATFORM_ASSET_FILE[platform];
  if (!file) return null;
  return cdnAssetUrl(version, file(version));
}

const FALLBACK_VERSION = '0.17.0';

// API-failure fallback: still a real, verified direct-asset URL built from the
// versioned rule above (never a bare /releases page) — see assetDownloadUrl.
const FALLBACK_RELEASE: LatestRelease = {
  version: FALLBACK_VERSION,
  versionLabel: `v${FALLBACK_VERSION}`,
  publishedAt: null,
  releaseUrl: `${REPO}/releases/tag/open-design-v${FALLBACK_VERSION}`,
  assets: {
    macArm64Dmg: { name: `open-design-${FALLBACK_VERSION}-mac-arm64.dmg`, url: assetDownloadUrl('mac-arm64', FALLBACK_VERSION)!, size: 0, sha256Url: cdnAssetUrl(FALLBACK_VERSION, `open-design-${FALLBACK_VERSION}-mac-arm64.dmg.sha256`) },
    macX64Dmg: { name: `open-design-${FALLBACK_VERSION}-mac-x64.dmg`, url: assetDownloadUrl('mac-x64', FALLBACK_VERSION)!, size: 0, sha256Url: cdnAssetUrl(FALLBACK_VERSION, `open-design-${FALLBACK_VERSION}-mac-x64.dmg.sha256`) },
    winSetup: { name: `open-design-${FALLBACK_VERSION}-win-x64-setup.exe`, url: assetDownloadUrl('win', FALLBACK_VERSION)!, size: 0, sha256Url: cdnAssetUrl(FALLBACK_VERSION, `open-design-${FALLBACK_VERSION}-win-x64-setup.exe.sha256`) },
    linux: null,
  },
};

function fmtSize(bytes: number): string | null {
  if (!bytes || bytes <= 0) return null;
  const mb = bytes / (1024 * 1024);
  return mb >= 1 ? `${mb.toFixed(0)} MB` : `${(bytes / 1024).toFixed(0)} KB`;
}

async function fetchLatestRelease(): Promise<LatestRelease | null> {
  try {
    const res = await fetch(`${REPO_API}/releases/latest`, { headers: { Accept: 'application/vnd.github+json' } });
    if (!res.ok) return null;
    const release: {
      tag_name?: unknown; name?: unknown; html_url?: unknown; published_at?: unknown; assets?: unknown;
    } = await res.json();
    const rawAssets = Array.isArray(release.assets) ? release.assets as Array<Record<string, unknown>> : [];
    const assets = rawAssets.filter((a): a is { name: string; browser_download_url: string; size?: unknown } =>
      !!a && typeof a.name === 'string' && typeof a.browser_download_url === 'string');
    const shaFor = (name: string): string | null => {
      const sib = assets.find((a) => a.name === `${name}.sha256`);
      return sib ? cdnAssetUrl(version, `${name}.sha256`) : null;
    };
    const pick = (match: (name: string) => boolean): ReleaseAsset | null => {
      const a = assets.find((x) => !x.name.endsWith('.sha256') && match(x.name));
      if (!a) return null;
      return {
        name: a.name,
        url: cdnAssetUrl(version, a.name),
        size: typeof a.size === 'number' && Number.isFinite(a.size) ? a.size : 0,
        sha256Url: shaFor(a.name),
      };
    };
    const fromName = (name: unknown): string | null => {
      if (typeof name !== 'string') return null;
      const match = name.match(/(\d+\.\d+\.\d+(?:[-+][\w.]+)?)/);
      return match ? `v${match[1]}` : null;
    };
    const fromTag = (tag: unknown): string | null => {
      if (typeof tag !== 'string') return null;
      const cleaned = tag.replace(/^open-design[-_]?v?/i, '').trim();
      return cleaned ? `v${cleaned.replace(/^v/, '')}` : null;
    };
    const versionLabel = fromName(release.name) ?? fromTag(release.tag_name) ?? FALLBACK_RELEASE.versionLabel;
    const version = versionLabel.replace(/^v/, '');
    return {
      version,
      versionLabel,
      publishedAt: typeof release.published_at === 'string' ? release.published_at.slice(0, 10) : null,
      releaseUrl: typeof release.html_url === 'string' ? release.html_url : FALLBACK_RELEASE.releaseUrl,
      assets: {
        macArm64Dmg: pick((n) => n.endsWith('mac-arm64.dmg')),
        macX64Dmg: pick((n) => n.endsWith('mac-x64.dmg')),
        winSetup: pick((n) => /win.*setup\.exe$/.test(n)),
        linux: pick((n) => /\.appimage$/i.test(n)),
      },
    };
  } catch {
    return null;
  }
}

type PlatformKey = 'mac-arm64' | 'mac-x64' | 'win' | 'linux';

function detectPlatform(): PlatformKey | null {
  const ua = (navigator.userAgent || '').toLowerCase();
  const p = ((navigator as unknown as { userAgentData?: { platform?: string } }).userAgentData?.platform || navigator.platform || '').toLowerCase();
  const isWin = /win/.test(p) || /windows/.test(ua);
  const isMac = /mac/.test(p) || (/mac os x/.test(ua) && !/iphone|ipad|ipod/.test(ua));
  const isLinux = /linux/.test(p) || (/linux/.test(ua) && !/android/.test(ua));
  if (isWin) return 'win';
  if (isMac) {
    const intel = (() => {
      try {
        const gl = document.createElement('canvas').getContext('webgl');
        const dbg = gl && gl.getExtension('WEBGL_debug_renderer_info');
        const r = dbg ? String(gl.getParameter(dbg.UNMASKED_RENDERER_WEBGL)) : '';
        return /intel|radeon|amd/i.test(r) && !/apple/i.test(r);
      } catch { return false; }
    })();
    return intel ? 'mac-x64' : 'mac-arm64';
  }
  if (isLinux) return 'linux';
  return null;
}

function useDetectedPlatform(): PlatformKey | null {
  const [platform, setPlatform] = useState<PlatformKey | null>(null);
  useEffect(() => { setPlatform(detectPlatform()); }, []);
  return platform;
}

function useLatestRelease(): LatestRelease {
  const [release, setRelease] = useState<LatestRelease>(FALLBACK_RELEASE);
  useEffect(() => {
    let cancelled = false;
    fetchLatestRelease().then((latest) => {
      if (cancelled || !latest) return;
      setRelease(latest);
    }).catch(() => undefined);
    return () => { cancelled = true; };
  }, []);
  return release;
}

const ICON_APPLE =
  <svg viewBox="0 0 24 24" width="26" height="26" fill="currentColor" aria-hidden="true"><path d="M16.36 12.78c.02 2.5 2.19 3.33 2.22 3.34-.02.06-.35 1.2-1.15 2.37-.69 1.01-1.41 2.02-2.54 2.04-1.11.02-1.47-.66-2.74-.66s-1.66.64-2.71.68c-1.09.04-1.92-1.09-2.62-2.1-1.42-2.06-2.51-5.83-1.05-8.37.72-1.27 2.01-2.07 3.41-2.09 1.07-.02 2.08.72 2.74.72.65 0 1.88-.89 3.17-.76.54.02 2.06.22 3.03 1.64-.08.05-1.81 1.06-1.79 3.15M14.28 5.6c.58-.7.97-1.68.86-2.65-.83.03-1.84.55-2.44 1.25-.54.62-1.01 1.61-.88 2.56.93.07 1.87-.47 2.46-1.16"/></svg>;
const ICON_WINDOWS =
  <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor" aria-hidden="true"><path d="M3 5.1 10.4 4v7.3H3zm0 13.8L10.4 20v-7.2H3zm8.2 1.2L21 21.3V12.8h-9.8zm0-16.2v7.4H21V2.7z"/></svg>;
const ICON_LINUX =
  <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor" aria-hidden="true"><path d="M12 2c-2.2 0-3.3 1.9-3.3 4.1 0 1.4.5 2.3.5 3.4 0 1-.7 1.8-1.4 2.9C6.9 13.9 6 15.6 6 17.3c0 .9.3 1.5.9 1.9-.1.5 0 1 .3 1.3.6.6 1.7.6 2.5.3.5-.2.8-.6.9-1.1.3 0 .6-.1.9-.1s.6 0 .9.1c.1.5.4.9.9 1.1.8.3 1.9.3 2.5-.3.3-.3.4-.8.3-1.3.6-.4.9-1 .9-1.9 0-1.7-.9-3.4-1.8-4.9-.7-1.1-1.4-1.9-1.4-2.9 0-1.1.5-2 .5-3.4C15.3 3.9 14.2 2 12 2m-1.3 4.3c.4 0 .7.4.7.9s-.3.9-.7.9-.7-.4-.7-.9.3-.9.7-.9m2.6 0c.4 0 .7.4.7.9s-.3.9-.7.9-.7-.4-.7-.9.3-.9.7-.9"/></svg>;

export function DownloadPage({ locale }: { locale: LandingLocaleCode }) {
  const copy = getInfoPageCopy(locale);
  const page = copy.download;
  const common = copy.common;
  const href = (path: string) => hrefFor(path, locale);
  const release = useLatestRelease();
  const platform = useDetectedPlatform();

  useEffect(() => {
    // Mirror upstream download-enhancer: show the mobile notice on narrow
    // viewports or mobile devices.
    const narrow = window.matchMedia('(max-width: 767px)');
    const isMobileUA = /android|iphone|ipad|ipod|mobile/i.test(navigator.userAgent);
    const syncNotice = () => {
      const notice = document.querySelector<HTMLElement>('[data-dl-mobile-notice]');
      if (notice) notice.hidden = !(isMobileUA || narrow.matches);
    };
    syncNotice();
    narrow.addEventListener('change', syncNotice);
    return () => {
      narrow.removeEventListener('change', syncNotice);
    };
  }, []);

  const platformLabel: Record<PlatformKey, string> = {
    'mac-arm64': 'macOS (Apple Silicon)',
    'mac-x64': 'macOS (Intel)',
    win: 'Windows',
    linux: 'Linux',
  };

  const m = release.assets;
  const versionLabel = release.versionLabel;
  const publishedLabel = release.publishedAt;
  const isRecommended = (key: PlatformKey) => platform === key;

  const cards: Array<{
    key: PlatformKey; osLabel: string; arch?: string; icon: ReactNode;
    rows: Array<{ variant: string; asset: ReleaseAsset | null }>; note?: string;
  }> = [
    {
      key: 'mac-arm64', osLabel: page.mac, arch: page.macArm, icon: ICON_APPLE,
      rows: [{ variant: page.dmg, asset: m.macArm64Dmg }],
    },
    {
      key: 'mac-x64', osLabel: page.mac, arch: page.macIntel, icon: ICON_APPLE,
      rows: [{ variant: page.dmg, asset: m.macX64Dmg }],
    },
    {
      key: 'win', osLabel: page.windows, icon: ICON_WINDOWS,
      rows: [{ variant: page.windowsInstaller, asset: m.winSetup }],
    },
    {
      key: 'linux', osLabel: page.linux, icon: ICON_LINUX,
      rows: [{ variant: 'AppImage', asset: m.linux }], note: page.linuxBody,
    },
  ];

  return (
    <SubpageLayout active="download" locale={locale}>
      <nav className="breadcrumb" aria-label={common.breadcrumbAria}>
        <a href={href('/')}>Open Design</a>
        <span>/</span>
        <span aria-current="page">{page.breadcrumb}</span>
      </nav>
      <article className="info-page dl-page" data-download-root>
        <header className="dl-hero">
          <div className="dl-hero-copy">
            <div className="dl-hero-brand">
              <span className="dl-hero-mark" aria-hidden="true">
                <img src="/favicon.svg" alt="" width="34" height="34" />
              </span>
              <span>Vibe Design Workspace</span>
            </div>
            <h1 className="dl-hero-heading">{page.heading}</h1>
            <p className="dl-hero-lead">{page.lead}</p>
            <p className="dl-mobile-notice" data-dl-mobile-notice hidden>
              {page.mobileDesktopNotice}
            </p>
            <div className="dl-hero-actions">
              <a
                className="btn btn-primary dl-hero-cta"
                href={assetDownloadUrl(platform, release.version) ?? release.releaseUrl}
                target="_blank"
                rel="noreferrer noopener"
                data-dl-auto
              >
                <span className="dl-hero-cta-icon" aria-hidden="true">↓</span>
                <span>{page.autoCtaFallback}</span>
                {platform && <span className="dl-auto-os"> {platformLabel[platform]}</span>}
              </a>
              <a className="dl-hero-release-link" href={release.releaseUrl} target="_blank" rel="noreferrer noopener">
                {page.releaseNotes} ↗
              </a>
            </div>
            <p className="dl-hero-meta">
              <a className="inline-link" href={release.releaseUrl} target="_blank" rel="noreferrer noopener">
                {versionLabel}
              </a>
              {publishedLabel && <span className="dl-version-date"> · {page.publishedPrefix} {publishedLabel}</span>}
            </p>
          </div>
          <figure className="dl-hero-visual">
            <div className="dl-hero-visual-shell">
              <img
                src="/hero-product-1280.webp"
                alt="Open Design 桌面工作区使用本地 Agent 和精选设计系统创建网站。"
                width="1280"
                height="741"
                loading="eager"
              />
            </div>
          </figure>
        </header>

        <section className="dl-platforms" id="platforms" aria-label={page.platformsTitle}>
          <div className="dl-grid">
            {cards.map((card) => (
              <div
                className="dl-card"
                data-dl-card
                data-dl-match={card.key}
                key={card.key}
                data-dl-recommended={isRecommended(card.key) ? 'true' : undefined}
              >
                {isRecommended(card.key) && <span className="dl-rec">{page.recommended}</span>}
                <span className="dl-card-icon" aria-hidden="true">{card.icon}</span>
                <h2 className="dl-os">{card.osLabel}</h2>
                <p className="dl-card-sub">
                  {card.arch && <span className="dl-arch">{card.arch}</span>}
                  <span className="dl-card-version">{versionLabel}</span>
                </p>
                {card.rows.length > 0 && (
                  <ul className="dl-rows">
                    {card.rows.map((row) => (
                      <li className="dl-row" key={row.variant}>
                        {row.asset ? (
                          <>
                            <a className="dl-link" href={row.asset.url} data-dl-key={`${card.key}-${row.variant.toLowerCase()}`}>
                              <span className="dl-dl-icon" aria-hidden="true">↓</span>
                              {page.downloadVerb} <strong>{row.variant}</strong>
                              {fmtSize(row.asset.size) && <span className="dl-size">{fmtSize(row.asset.size)}</span>}
                            </a>
                            {row.asset.sha256Url && (
                              <a className="dl-sha" href={row.asset.sha256Url} target="_blank" rel="noreferrer noopener">{page.checksum}</a>
                            )}
                          </>
                        ) : (
                          <a className="dl-link dl-link-fallback" href={release.releaseUrl} target="_blank" rel="noreferrer noopener">
                            <span className="dl-dl-icon" aria-hidden="true">↓</span>
                            {row.variant} <span className="dl-size">→ Releases</span>
                          </a>
                        )}
                      </li>
                    ))}
                  </ul>
                )}
                {card.note && (
                  <p className="dl-note">
                    <a className="inline-link" href={release.releaseUrl} target="_blank" rel="noreferrer noopener">{card.note}</a>
                  </p>
                )}
              </div>
            ))}
          </div>
          <p className="dl-releases-link">
            <a className="inline-link" href={REPO_RELEASES} target="_blank" rel="noreferrer noopener">{page.allReleasesTitle} →</a>
          </p>
        </section>

        <section className="dl-requirements" id="requirements" aria-label={page.requirementsTitle}>
          <ul>
            {page.requirements.map((item) => (
              <li key={item.label}><strong>{item.label}</strong> — {item.body}</li>
            ))}
          </ul>
        </section>

        <section className="info-cta" aria-label="Open Design call to action">
          <div>
            <h2>{page.ctaTitle}</h2>
            <p>{page.ctaBody}</p>
          </div>
          <div className="info-cta-actions">
            <a className="btn btn-primary" href={href('/quickstart/')}>{common.quickstart}</a>
            <a className="btn btn-ghost" href={REPO} target="_blank" rel="noreferrer noopener">{common.starOnGithub}</a>
          </div>
          <div className="info-cta-meta">
            <span className="stamp">● {common.live}</span>
            <span>{versionLabel} · Apache-2.0</span>
            <span>{common.macWinLinux}</span>
          </div>
        </section>
      </article>
    </SubpageLayout>
  );
}
