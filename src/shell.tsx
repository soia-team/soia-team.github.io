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

export const REPO = 'https://github.com/soia-team/soia-open-skills';
export const REPO_RUNTIME = 'https://github.com/soia-team/soia';
export const REPO_ORG = 'https://github.com/soia-team';
export const REPO_DISCUSSIONS = `${REPO}/discussions`;

/** Public skill inventory from soia-open-skills (4 domains, 47 skills). */
export const COUNTS = {
  skills: 47,
  systems: 4,
  templates: 47,
  craft: 4,
  byMode: { prototype: 27, deck: 9, mobile: 7 },
  byPlatform: { mobile: 7, desktop: 9 },
};

export const GITHUB = { starsLabel: '', versionLabel: '' };

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
  const zh = locale === 'zh';
  return (
    <footer className="sub-footer" data-od-id="footer">
      <div className="container sub-footer-inner">
        <div className="sub-footer-grid">
          <div className="sub-footer-col"><h5>SOIA</h5><ul>
            <li><a href={href('/soiadeck/')}>SoiaDeck</a></li>
            <li><a href={href('/soiacode/')}>SoiaCode</a></li>
            <li><a href={href('/skills/')}>{zh ? '开源技能' : 'Open Skills'}</a></li>
            <li><a href={href('/soia/')}>SOIA Runtime</a></li>
          </ul></div>
          <div className="sub-footer-col"><h5>{zh ? '技能域' : 'Skills'}</h5><ul>
            <li><a href={href('/skills/pkm/')}>PKM Vault</a></li>
            <li><a href={href('/skills/dev/')}>Dev</a></li>
            <li><a href={href('/skills/office/')}>Office</a></li>
            <li><a href={href('/skills/meta/')}>Meta</a></li>
          </ul></div>
          <div className="sub-footer-col"><h5>{zh ? '资源' : 'Resources'}</h5><ul>
            <li><a href={href('/about/')}>{zh ? '关于' : 'About'}</a></li>
            <li><a href={href('/faq/')}>{zh ? '常见问题' : 'FAQ'}</a></li>
            <li><a href={href('/#contact')}>{zh ? '企业咨询' : 'Consulting'}</a></li>
          </ul></div>
          <div className="sub-footer-col"><h5>Open source</h5><ul>
            <li><a href={REPO_ORG} target="_blank" rel="noreferrer noopener">GitHub</a></li>
            <li><a href={REPO_DISCUSSIONS} target="_blank" rel="noreferrer noopener">Discussions</a></li>
            <li><a href={href('/privacy/')}>{zh ? '隐私' : 'Privacy'}</a></li>
            <li><a href={href('/terms/')}>{zh ? '条款' : 'Terms'}</a></li>
          </ul></div>
        </div>
        <div className="foot-bar">
          <div className="foot-bar-left"><span className="foot-copy">© 2026 soia-team</span></div>
          <div className="foot-social"><a href={REPO_ORG} target="_blank" rel="noreferrer noopener" aria-label="GitHub">GH</a></div>
        </div>
        <div className="foot-masthead" data-od-id="footer-masthead"><p className="foot-masthead-wordmark">SO<span className="foot-masthead-accent">IA</span><span className="foot-masthead-period">.</span></p></div>
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
