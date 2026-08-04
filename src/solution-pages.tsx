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
import { useEffect, useState } from 'react';
import { getCommonCopy, getHeaderProductMenuCopy, type LandingLocaleCode } from './upstream/app/i18n';
import { getInfoPageCopy } from './upstream/app/info-page-i18n';
import { getSolutionsIndexCopy } from './upstream/app/solutions-index-i18n';
import { getSolutionPageCopy, type SolutionPageKey } from './upstream/app/solution-pages-i18n';
import { hrefFor, REPO, SubpageLayout } from './shell';

const REPO_RELEASES = `${REPO}/releases`;
const RELEASES_LATEST = `${REPO}/releases/latest`;
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
 * /solutions/screenshot-to-code/ — tool detail page
 * ------------------------------------------------------------------ */

export function ScreenshotToCodePage({ locale }: { locale: LandingLocaleCode }) {
  const page = getSolutionPageCopy(locale, 'screenshotToCode');
  const common = getInfoPageCopy(locale).common;
  const nav = getCommonCopy(locale).header.nav;
  const href = (path: string) => hrefFor(path, locale);
  const faq = page.faq;
  const relatedTools = page.related ?? [];
  return (
    <SubpageLayout active="solution" locale={locale}>
      <nav className="breadcrumb" aria-label={common.breadcrumbAria}>
        <a href={href('/')}>Open Design</a>
        <span>/</span>
        <a href={href('/solutions/')}>{nav.solution}</a>
        <span>/</span>
        <span aria-current="page">{page.breadcrumb}</span>
      </nav>
      <article className="info-page solution-page" data-od-id="route-solutions-screenshot-to-code">
        <div className="solution-hero-band">
          <header className="catalog-head">
            <span className="label">{page.label}</span>
            <h1 className="display">{page.heading}</h1>
            <p className="lead">{page.lead}</p>
            <div className="solution-hero-cta">
              <a className="btn btn-primary" href={href('/download/')}>{common.downloadDesktop}</a>
              <a className="btn btn-ghost" href={REPO} target="_blank" rel="noreferrer noopener">{common.starOnGithub}</a>
            </div>
          </header>
          <figure className="solution-hero">
            <img
              src="/solutions/screenshot-to-code-hero.webp"
              alt={page.heroImageAlt}
              loading="eager"
              width={1280}
              height={853}
            />
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
          <ul className="tool-feature-grid">
            {page.features.map((f) => (
              <li className="tool-feature-card" key={f.title}>
                <h3>{f.title}</h3>
                <p>{f.body}</p>
              </li>
            ))}
          </ul>
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
          <p>{page.galleryLead}</p>
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
            <a className="btn btn-ghost" href={REPO_RELEASES} target="_blank" rel="noreferrer noopener">{common.downloadDesktop}</a>
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
  versionLabel: string;
  publishedAt: string | null;
  releaseUrl: string;
  assets: {
    macArm64Dmg: ReleaseAsset | null;
    macX64Dmg: ReleaseAsset | null;
    winSetup: ReleaseAsset | null;
    linux: ReleaseAsset | null;
  };
}

const FALLBACK_RELEASE: LatestRelease = {
  versionLabel: 'v0.16.1',
  publishedAt: null,
  releaseUrl: RELEASES_LATEST,
  assets: { macArm64Dmg: null, macX64Dmg: null, winSetup: null, linux: null },
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
      return sib ? sib.browser_download_url : null;
    };
    const pick = (match: (name: string) => boolean): ReleaseAsset | null => {
      const a = assets.find((x) => !x.name.endsWith('.sha256') && match(x.name));
      if (!a) return null;
      return {
        name: a.name,
        url: a.browser_download_url,
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
    return {
      versionLabel,
      publishedAt: typeof release.published_at === 'string' ? release.published_at.slice(0, 10) : null,
      releaseUrl: typeof release.html_url === 'string' ? release.html_url : RELEASES_LATEST,
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
  const [release, setRelease] = useState<LatestRelease>(FALLBACK_RELEASE);
  const [platform, setPlatform] = useState<PlatformKey | null>(null);

  useEffect(() => {
    let cancelled = false;
    fetchLatestRelease().then((latest) => {
      if (cancelled || !latest) return;
      setRelease(latest);
    }).catch(() => undefined);
    setPlatform(detectPlatform());
    return () => { cancelled = true; };
  }, []);

  const m = release.assets;
  const versionLabel = release.versionLabel;
  const publishedLabel = release.publishedAt;
  const isRecommended = (key: PlatformKey) => platform === key;

  const cards: Array<{
    key: PlatformKey; osLabel: string; arch?: string; icon: React.ReactNode;
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
          <div className="dl-hero-mark" aria-hidden="true">
            <img src="/favicon.svg" alt="" width="48" height="48" />
          </div>
          <h1 className="dl-hero-heading">{page.heading}</h1>
          <p className="dl-hero-lead">{page.lead}</p>
          <p className="dl-mobile-notice" hidden>
            {page.mobileDesktopNotice}
          </p>
          <a
            className="btn btn-primary dl-hero-cta"
            href={release.releaseUrl}
            target="_blank"
            rel="noreferrer noopener"
            data-dl-auto
          >
            <span>{page.autoCtaFallback}</span>
          </a>
          <p className="dl-hero-meta">
            <a className="inline-link" href={release.releaseUrl} target="_blank" rel="noreferrer noopener">
              {versionLabel}
            </a>
            {publishedLabel && <span className="dl-version-date"> · {page.publishedPrefix} {publishedLabel}</span>}
            <span> · </span>
            <a className="inline-link" href={release.releaseUrl} target="_blank" rel="noreferrer noopener">{page.releaseNotes}</a>
          </p>
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
