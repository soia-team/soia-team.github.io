/*
 * Sticky Header — static markup rendered at build time. Headroom-style
 * hide/show and the live GitHub star count are attached by the tiny inline
 * scripts on each Astro page, so this marketing page ships no React runtime
 * to the browser.
 *
 * The primary resource link points to the Skill catalog. Catalog counts are
 * still accepted by the public prop shape because sub-pages pass them through.
 */

import {
  DEFAULT_LOCALE,
  getCommonCopy,
  getHeaderProductMenuCopy,
  localizedHref,
  type HeaderCopy,
  type LandingLocaleCode,
} from '../i18n';

const REPO = 'https://github.com/soia-team/soia-open-skills';
const REPO_RUNTIME = 'https://github.com/soia-team/soia';
const REPO_ORG = 'https://github.com/soia-team';
const REPO_DISCUSSIONS = `${REPO}/discussions`;

const USE_CASE_HREFS = [
  '/skills/pkm/',
  '/skills/dev/',
  '/skills/office/',
  REPO_DISCUSSIONS,
  '/soiadeck/#models',
  '/soiadeck/',
] as const;

const ROLE_HREFS = [
  '/#labs',
  '/skills/dev/',
  '/skills/office/',
  '/#contact',
  REPO_DISCUSSIONS,
] as const;

const FEATURED_SKILLS: ReadonlyArray<{ name: string; href: string }> = [
  { name: 'soia-meta-find-skill', href: '/skills/meta/soia-meta-find-skill/' },
  { name: 'soia-pkm-clip-web', href: '/skills/pkm/soia-pkm-clip-web/' },
  { name: 'soia-pkm-query-vault', href: '/skills/pkm/soia-pkm-query-vault/' },
  { name: 'soia-dev-implement-task', href: '/skills/dev/soia-dev-implement-task/' },
  { name: 'soia-dev-review-code', href: '/skills/dev/soia-dev-review-code/' },
  { name: 'soia-cwork-feishu-cli', href: '/skills/office/soia-cwork-feishu-cli/' },
  { name: 'soia-media-compose-article-draft', href: '/skills/office/soia-media-compose-article-draft/' },
  { name: 'soia-media-generate-article-image', href: '/skills/office/soia-media-generate-article-image/' },
];

const ext = {
  target: '_blank',
  rel: 'noreferrer noopener',
} as const;

export interface HeaderProps {
  /** Nav highlight target. `'home'` is the default for `/`. */
  active?:
    | 'home'
    | 'product'
    | 'html-anything'
    | 'html-video'
    | 'codex-slides'
    | 'solution'
    | 'agent'
    | 'plugins'
    | 'pricing'
    | 'library'
    | 'skills'
    | 'systems'
    | 'templates'
    | 'craft'
    | 'resources'
    | 'blog'
    | 'stories'
    | 'tutorials'
    | 'download'
    | 'community'
    // Standalone landing pages (e.g. /enterprise/) that intentionally do not
    // belong under any top-nav tab — pass this so no tab renders as active.
    | 'enterprise';
  /**
   * Live counts from the Markdown catalogs. Required so we can never
   * silently render stale fallback numbers when a caller forgets to
   * thread `getCatalogCounts()` through. Header only consumes these
   * four scalar fields; the homepage passes the wider `CatalogCounts`
   * value (with `byMode` / `byPlatform`) by structural subtyping.
   */
  counts: {
    skills: number;
    systems: number;
    templates: number;
    craft: number;
  };
  github?: {
    starsLabel: string;
  };
  localeSwitcher?: {
    label: string;
    prefix: string;
    shortLabel: string;
    options: ReadonlyArray<{
      code: LandingLocaleCode;
      href: string;
      htmlLang: string;
      label: string;
    }>;
  };
  /** UI locale for nav labels and accessibility text. */
  locale?: LandingLocaleCode;
  /** Optional override for callers that already resolved localized chrome. */
  copy?: HeaderCopy;
  /** Brand link target — `#top` on the homepage, `/` on sub-pages. */
  brandHref?: string;
}

export function Header({
  active = 'home',
  localeSwitcher,
  locale = DEFAULT_LOCALE,
  copy,
  brandHref = '#top',
}: HeaderProps) {
  const headerCopy = copy ?? getCommonCopy(locale).header;
  const href = (path: string) => localizedHref(path, locale);
  const homeBrandHref = brandHref === '/' ? href('/') : brandHref;
  const productMenuCopy = getHeaderProductMenuCopy(locale);

  return (
    <header className='nav' data-od-id='nav'>
      <div className='container nav-inner'>
        <a href={homeBrandHref} className='brand'>
          <img
            className='brand-logo'
            src='/soia/products/soiadeck-icon.png'
            alt='SOIA'
            width={40}
            height={40}
          />
        </a>
        {/*
          Mobile / tablet hamburger. Hidden by CSS at ≥1100px (the desktop
          breakpoint where the full nav fits). At narrower widths it toggles
          `.is-open` on the parent <header> via a small handler in
          `header-enhancer.astro` — when open, the `<nav>` element below
          drops down underneath the header bar as a vertical list.
        */}
        <button
          type='button'
          className='nav-toggle'
          aria-label={productMenuCopy.toggleNavigationMenu}
          aria-controls='primary-nav'
          aria-expanded='false'
          data-nav-toggle
        >
          <span className='nav-toggle-icon' aria-hidden='true' />
        </button>
        <nav id='primary-nav' data-nav-primary>
          <ul className='nav-links'>
            {/* Product — a mega menu whose columns are top-level categories:
                the Open Design product family and the Agent catalog today,
                with room to add more (e.g. Feature) as its own column later.
                The trigger is a <button> (not a link) so it never navigates —
                Product used to bounce to the homepage — but its panel is
                revealed by the SAME pure-CSS :hover / :focus-within rule as
                the hub menus, so it works with no JS (first paint / script
                failure) and on touch (tapping focuses the button →
                :focus-within). It lights up for the whole product family AND
                for /agents/ pages now that Agent lives inside it. */}
            <li className='has-dropdown'>
              <button
                type='button'
                className={
                  'nav-trigger' +
                  (active === 'product' ||
                  active === 'home' ||
                  active === 'html-anything' ||
                  active === 'html-video' ||
                  active === 'codex-slides' ||
                  active === 'agent'
                    ? ' is-active'
                    : '')
                }
              >
                {productMenuCopy.product}
                <span className='dropdown-caret' aria-hidden='true'>▾</span>
              </button>
              <ul
                className='nav-dropdown nav-dropdown-mega'
                aria-label={productMenuCopy.product}
              >
                {/* Products column — the Open Design product family. Names
                    only (no blurbs): keeps the column compact and aligned
                    with the Agent column, and avoids per-locale width blowups
                    from long descriptions. */}
                <li className='nav-mega-col'>
                  <span className='nav-mega-col-head'>{productMenuCopy.product}</span>
                  <ul className='nav-mega-list'>
                    <li>
                      <a href={href('/soiadeck/')}>
                        <span className='dropdown-name'>{productMenuCopy.openDesignName}</span>
                      </a>
                    </li>
                    <li>
                      <a href={href('/soiacode/')}>
                        <span className='dropdown-name'>{productMenuCopy.htmlAnythingName}</span>
                      </a>
                    </li>
                    <li>
                      <a href={href('/skills/')}>
                        <span className='dropdown-name'>{productMenuCopy.htmlVideoName}</span>
                      </a>
                    </li>
                    <li>
                      <a href={href('/soia/')}>
                        <span className='dropdown-name'>SOIA Runtime</span>
                      </a>
                    </li>
                  </ul>
                </li>
                {/* Agent column — the coding agents each with a dedicated
                    design page. The column header links to the /agents/ hub
                    (the old top-level Agent tab's target). The list caps its
                    own height and scrolls so 21 rows never run the panel
                    off-screen; the shorter Products column stays static. */}
                <li className='nav-mega-col nav-mega-col-agent'>
                  <a
                    href={href('/skills/')}
                    className='nav-mega-col-head'
                  >
                    {productMenuCopy.plugins}
                  </a>
                  <ul className='nav-mega-list'>
                    {[
                      { name: 'PKM Vault', href: '/skills/pkm/' },
                      { name: 'Dev', href: '/skills/dev/' },
                      { name: 'Office', href: '/skills/office/' },
                      { name: 'Meta', href: '/skills/meta/' },
                    ].map((domain) => (
                      <li key={domain.name}>
                        <a href={href(domain.href)}>
                          <span className='dropdown-name'>{domain.name}</span>
                        </a>
                      </li>
                    ))}
                  </ul>
                </li>
                {/* Future category columns (e.g. Feature) drop in here as
                    another <li className='nav-mega-col'> with its own head +
                    list; the panel widens automatically. */}
              </ul>
            </li>

            {/* Solution — Use cases + Roles. */}
            <li className='has-dropdown'>
              <a
                href={href('/skills/')}
                className={active === 'solution' ? 'is-active' : undefined}
              >
                {productMenuCopy.solution}
                <span className='dropdown-caret' aria-hidden='true'>▾</span>
              </a>
              <ul
                className='nav-dropdown nav-dropdown-solution'
                aria-label={productMenuCopy.solution}
              >
                <li className='nav-dropdown-group'>
                  <span className='nav-dropdown-group-label'>
                    {productMenuCopy.useCases}
                  </span>
                </li>
                {productMenuCopy.useCaseItems.map((name, index) => (
                  <li key={name}>
                    <a href={href(USE_CASE_HREFS[index]!)} {...(USE_CASE_HREFS[index]!.startsWith('http') ? ext : {})}>
                      <span className='dropdown-name'>{name}</span>
                    </a>
                  </li>
                ))}
                <li className='nav-dropdown-group'>
                  <span className='nav-dropdown-group-label'>
                    {productMenuCopy.roles}
                  </span>
                </li>
                {productMenuCopy.roleItems.map((name, index) => (
                  <li key={name}>
                    <a href={href(ROLE_HREFS[index]!)} {...(ROLE_HREFS[index]!.startsWith('http') ? ext : {})}>
                      <span className='dropdown-name'>{name}</span>
                    </a>
                  </li>
                ))}
                <li className='nav-dropdown-group'>
                  <span className='nav-dropdown-group-label'>
                    {productMenuCopy.tools}
                  </span>
                </li>
                {FEATURED_SKILLS.map((skill) => (
                  <li key={skill.name}>
                    <a href={href(skill.href)}>
                      <span className='dropdown-name'>{skill.name}</span>
                    </a>
                  </li>
                ))}
              </ul>
            </li>

            {/* Plugins — the three composable catalogs. */}
            <li className='has-dropdown'>
              <a
                href={href('/skills/')}
                className={
                  active === 'plugins' ||
                  active === 'library' ||
                  active === 'skills' ||
                  active === 'systems' ||
                  active === 'templates' ||
                  active === 'craft'
                    ? 'is-active'
                    : undefined
                }
              >
                {productMenuCopy.plugins}
                <span className='dropdown-caret' aria-hidden='true'>▾</span>
              </a>
              <ul className='nav-dropdown' aria-label={productMenuCopy.plugins}>
                <li>
                  <a href={href('/skills/pkm/')}>
                    <span className='dropdown-name'>
                      {productMenuCopy.pluginItems.templates}
                    </span>
                  </a>
                </li>
                <li>
                  <a href={href('/skills/dev/')}>
                    <span className='dropdown-name'>
                      {productMenuCopy.pluginItems.skills}
                    </span>
                  </a>
                </li>
                <li>
                  <a href={href('/skills/office/')}>
                    <span className='dropdown-name'>
                      {productMenuCopy.pluginItems.systems}
                    </span>
                  </a>
                </li>
                <li>
                  <a href={href('/skills/meta/')}>
                    <span className='dropdown-name'>Meta</span>
                  </a>
                </li>
              </ul>
            </li>

            {/* Pricing — localized page. The plan numbers it renders stay in
                sync with the vela commerce app at runtime (see
                app/_lib/pricing.ts); the card copy mirrors vela's subscription
                modal (see app/_lib/pricing-content.ts). */}
            <li>
              <a
                href={href('/#contact')}
                className={active === 'pricing' ? 'is-active' : undefined}
              >
                {productMenuCopy.pricing}
              </a>
            </li>

            {/* Resources — a category label (Blog / Tutorials / Compare), not
                a page; a <button> so it never navigates (it used to bounce to
                /blog/), with its dropdown revealed by the same pure-CSS
                :hover / :focus-within rule as the hub menus (see Product). */}
            <li className='has-dropdown'>
              <button
                type='button'
                className={
                  'nav-trigger' +
                  (active === 'resources' ||
                  active === 'blog' ||
                  active === 'stories' ||
                  active === 'tutorials' ||
                  active === 'download'
                    ? ' is-active'
                    : '')
                }
              >
                {productMenuCopy.resources}
                <span className='dropdown-caret' aria-hidden='true'>▾</span>
              </button>
              <ul className='nav-dropdown' aria-label={productMenuCopy.resources}>
                <li>
                  <a href={href('/soiadeck/')}>
                    <span className='dropdown-name'>SoiaDeck</span>
                  </a>
                </li>
                <li>
                  <a href={href('/skills/')}>
                    <span className='dropdown-name'>{productMenuCopy.htmlVideoName}</span>
                  </a>
                </li>
                <li>
                  <a href={href('/faq/')}>
                    <span className='dropdown-name'>FAQ</span>
                  </a>
                </li>
                <li>
                  <a href={REPO} {...ext}>
                    <span className='dropdown-name'>GitHub</span>
                  </a>
                </li>
              </ul>
            </li>

            {/* About — SOIA family, GitHub and Discussions. */}
            <li className='has-dropdown'>
              <a
                href={href('/about/')}
                className={active === 'community' ? 'is-active' : undefined}
              >
                {productMenuCopy.community}
                <span className='dropdown-caret' aria-hidden='true'>▾</span>
              </a>
              <ul className='nav-dropdown' aria-label={productMenuCopy.community}>
                <li>
                  <a href={href('/about/')}>
                    <span className='dropdown-name'>{productMenuCopy.community}</span>
                  </a>
                </li>
                <li>
                  <a href={REPO_ORG} {...ext}>
                    <span className='dropdown-name'>soia-team</span>
                  </a>
                </li>
                <li>
                  <a href={REPO_DISCUSSIONS} {...ext}>
                    <span className='dropdown-name'>
                      {productMenuCopy.communityItems.discussions}
                    </span>
                  </a>
                </li>
              </ul>
            </li>

          </ul>
        </nav>
        <div className='nav-side'>
          {localeSwitcher ? (
            <details className='locale-switch nav-locale-switch' data-locale-switch>
              <summary
                className='locale-trigger locale-trigger-iconic'
                aria-label={localeSwitcher.label}
                title={localeSwitcher.label}
              >
                {/* Language switcher rendered as the skill's Remix Icon
                    "translate-2" glyph (\f226) instead of the 语言 · 简中 text. */}
                <span className='locale-trigger-icon' aria-hidden='true' />
                {/* Dropdown caret as the skill's Remix Icon "arrow-down-s-line"
                    glyph () instead of an inline SVG path. */}
                <span className='locale-trigger-caret ri-glyph' aria-hidden='true'>
                  {''}
                </span>
              </summary>
              <div className='locale-menu' role='menu'>
                {localeSwitcher.options.map((entry) => (
                  <a
                    className={`locale-menu-item${
                      entry.code === locale ? ' is-active' : ''
                    }`}
                    role='menuitem'
                    data-locale-link
                    data-locale-code={entry.code}
                    href={entry.href}
                    lang={entry.htmlLang}
                    aria-current={entry.code === locale ? 'true' : undefined}
                    key={entry.code}
                  >
                    <span className='locale-menu-code'>
                      {entry.code.toUpperCase()}
                    </span>
                    <span className='locale-menu-label'>{entry.label}</span>
                  </a>
                ))}
              </div>
            </details>
          ) : null}
          <a
            className='nav-cta ghost'
            href={REPO}
            aria-label={headerCopy.downloadAria}
            title={headerCopy.downloadTitle}
            {...ext}
          >
            {headerCopy.download}
          </a>
        </div>
      </div>
      {/*
        Liquid Glass material — SVG displacement filter (chromatic edge
        refraction) ported 1:1 from Inspira UI's LiquidGlass.vue. Referenced
        by the nav's `backdrop-filter` once the bar condenses on scroll. The
        displacement map (the `feImage`) is generated and sized to the live
        bar by the inline script in `header-enhancer.astro` (ResizeObserver).
        Chromium-only; Safari/Firefox fall back to the plain `blur()` declared
        in globals.css, per the component's own browser-support note.
      */}
      <svg
        className='nav-glass-defs'
        aria-hidden='true'
        focusable='false'
        width='0'
        height='0'
      >
        <defs>
          <filter id='nav-liquid-glass' colorInterpolationFilters='sRGB'>
            <feImage
              x='0'
              y='0'
              width='100%'
              height='100%'
              preserveAspectRatio='none'
              result='map'
              data-nav-glass-map
            />
            <feDisplacementMap
              in='SourceGraphic'
              in2='map'
              xChannelSelector='R'
              yChannelSelector='B'
              scale='-50'
              result='dispRed'
            />
            <feColorMatrix
              in='dispRed'
              type='matrix'
              values='1 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 1 0'
              result='red'
            />
            <feDisplacementMap
              in='SourceGraphic'
              in2='map'
              xChannelSelector='R'
              yChannelSelector='B'
              scale='-47'
              result='dispGreen'
            />
            <feColorMatrix
              in='dispGreen'
              type='matrix'
              values='0 0 0 0 0 0 1 0 0 0 0 0 0 0 0 0 0 0 1 0'
              result='green'
            />
            <feDisplacementMap
              in='SourceGraphic'
              in2='map'
              xChannelSelector='R'
              yChannelSelector='B'
              scale='-44'
              result='dispBlue'
            />
            <feColorMatrix
              in='dispBlue'
              type='matrix'
              values='0 0 0 0 0 0 0 0 0 0 0 0 1 0 0 0 0 0 1 0'
              result='blue'
            />
            <feBlend in='red' in2='green' mode='screen' result='rg' />
            <feBlend in='rg' in2='blue' mode='screen' result='output' />
            <feGaussianBlur in='output' stdDeviation='0.7' />
          </filter>
        </defs>
      </svg>
    </header>
  );
}
