/*
 * Shared sub-page chrome: header (SiteChrome), CompactFooter and the
 * SubpageLayout wrapper used by every non-home route. Extracted from App.tsx
 * so page modules (solution-pages.tsx, catalog-pages.tsx) can reuse the exact
 * same chrome without circular imports.
 */
import { useEffect, type ReactNode } from 'react';
import { Header, type HeaderProps } from './upstream/app/_components/header';
import {
  getCommonCopy,
  getLocaleDefinition,
  LANDING_LOCALES,
  localePath,
  type LandingLocaleCode,
} from './upstream/app/i18n';
import { AGENTS } from './routes';

export const REPO = 'https://github.com/nexu-io/open-design';

/** Counts and labels are the bounded values recorded by the clone evidence. */
export const COUNTS = {
  skills: 217,
  systems: 151,
  templates: 217,
  craft: 0,
  byMode: { prototype: 42, deck: 24, mobile: 18 },
  byPlatform: { mobile: 18, desktop: 62 },
};

export const GITHUB = { starsLabel: '83.2K', versionLabel: 'v0.16.1' };

export function hrefFor(path: string, locale: LandingLocaleCode): string {
  return path.startsWith('http') ? path : localePath(locale, path);
}

export function headerSwitcher(locale: LandingLocaleCode) {
  const common = getCommonCopy(locale);
  const definition = getLocaleDefinition(locale);
  return {
    label: common.topbar.languageSwitcherLabel,
    prefix: common.topbar.languageSwitcherPrefix ?? 'Lang',
    shortLabel: definition.shortLabel,
    options: LANDING_LOCALES.map((entry) => ({
      ...entry,
      href: localePath(entry.code, window.location.pathname),
    })),
  };
}

export function SiteChrome({ active = 'home', locale }: { active?: HeaderProps['active']; locale: LandingLocaleCode }) {
  return (
    <div className="site-chrome" data-chrome-headroom>
      <Header
        active={active}
        counts={COUNTS}
        github={GITHUB}
        locale={locale}
        brandHref="/"
        localeSwitcher={headerSwitcher(locale)}
      />
    </div>
  );
}

export function CompactFooter({ locale }: { locale: LandingLocaleCode }) {
  const href = (path: string) => hrefFor(path, locale);
  return (
    <footer className="sub-footer" data-od-id="footer">
      <div className="container sub-footer-inner">
        <div className="sub-footer-grid">
          <div className="sub-footer-col"><h5>Open Design</h5><ul>
            <li><a href={href('/')}>首页</a></li>
            <li><a href={href('/html-anything/')}>HTML Anything</a></li>
            <li><a href={href('/html-video/')}>HTML Video</a></li>
            <li><a href={href('/codex-slides/')}>Codex Slides</a></li>
          </ul></div>
          <div className="sub-footer-col"><h5><a href={href('/agents/')}>Agent</a></h5><ul>
            {AGENTS.slice(0, 6).map((agent) => <li key={agent.slug}><a href={href(`/agents/${agent.route}/`)}>{agent.name}</a></li>)}
          </ul></div>
          <div className="sub-footer-col"><h5>Resources</h5><ul>
            <li><a href={href('/quickstart/')}>快速开始</a></li>
            <li><a href={href('/download/')}>下载</a></li>
            <li><a href={href('/community/')}>社区</a></li>
            <li><a href={href('/faq/')}>FAQ</a></li>
            <li><a href={href('/enterprise/')}>团队版</a></li>
          </ul></div>
          <div className="sub-footer-col"><h5>Open source</h5><ul>
            <li><a href={REPO} target="_blank" rel="noreferrer noopener">GitHub</a></li>
            <li><a href="https://discord.gg/mHAjSMV6gz" target="_blank" rel="noreferrer noopener">Discord</a></li>
            <li><a href={href('/privacy/')}>隐私</a></li>
            <li><a href={href('/terms/')}>条款</a></li>
          </ul></div>
        </div>
        <div className="foot-bar">
          <div className="foot-bar-left"><span className="foot-copy">© 2026 Powerformer, Inc. · Apache-2.0</span></div>
          <div className="foot-social"><a href="https://x.com/OpenDesignHQ" target="_blank" rel="noreferrer noopener" aria-label="X">X</a><a href={REPO} target="_blank" rel="noreferrer noopener" aria-label="GitHub">GH</a></div>
        </div>
        <div className="foot-masthead" data-od-id="footer-masthead"><p className="foot-masthead-wordmark">Open <span className="foot-masthead-accent">Design</span><span className="foot-masthead-period">.</span></p></div>
      </div>
    </footer>
  );
}

export function SubpageLayout({ children, active = 'home', locale }: { children: ReactNode; active?: HeaderProps['active']; locale: LandingLocaleCode }) {
  useEffect(() => {
    document.body.classList.add('sub-page');
    return () => document.body.classList.remove('sub-page');
  }, []);
  return <div className="shell"><SiteChrome active={active} locale={locale} /><main className="sub-main container">{children}</main><CompactFooter locale={locale} /></div>;
}
