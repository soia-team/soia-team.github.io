import { useEffect, useRef, useState, type ReactNode } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { catalog, localizedPath, type Locale } from '../data/site';

export function useLocale(): Locale {
  return useLocation().pathname.startsWith('/en') ? 'en' : 'zh';
}

export function SoiaLogo({ compact = false }: { compact?: boolean }) {
  return (
    <span className="soia-logo" aria-label="SOIA">
      <span className="soia-mark" aria-hidden="true"><i /><i /><i /></span>
      {!compact && <b>SOIA</b>}
    </span>
  );
}

type MenuKey = 'product' | 'solutions' | 'open' | 'resources';

const menus: Record<MenuKey, { zh: string; en: string }> = {
  product: { zh: '产品', en: 'Products' },
  solutions: { zh: '解决方案', en: 'Solutions' },
  open: { zh: '开放生态', en: 'Open ecosystem' },
  resources: { zh: '资源', en: 'Resources' },
};

export function Header() {
  const locale = useLocale();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeMenu, setActiveMenu] = useState<MenuKey | null>(null);
  const headerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    setMobileOpen(false);
    setActiveMenu(null);
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [location.pathname]);

  useEffect(() => {
    const close = (event: PointerEvent) => {
      if (!headerRef.current?.contains(event.target as Node)) setActiveMenu(null);
    };
    document.addEventListener('pointerdown', close);
    return () => document.removeEventListener('pointerdown', close);
  }, []);

  const menuLabel = (key: MenuKey) => menus[key][locale];
  const to = (path: string) => localizedPath(path, locale);
  const languagePath = locale === 'zh'
    ? `/en${location.pathname === '/' ? '/' : location.pathname}`
    : location.pathname.replace(/^\/en/, '') || '/';

  return (
    <header className="site-header" ref={headerRef}>
      <div className="nav-shell">
        <Link className="brand-link" to={to('/')}><SoiaLogo /></Link>
        <button
          className="mobile-toggle"
          type="button"
          aria-label={locale === 'zh' ? '打开导航' : 'Open navigation'}
          aria-expanded={mobileOpen}
          onClick={() => setMobileOpen((value) => !value)}
        ><span /><span /></button>
        <nav className={mobileOpen ? 'primary-nav is-open' : 'primary-nav'} aria-label="Primary">
          <MenuItem label={menuLabel('product')} open={activeMenu === 'product'} onToggle={() => setActiveMenu(activeMenu === 'product' ? null : 'product')}>
            <MenuColumn label={locale === 'zh' ? '交付形态' : 'Delivery shapes'}>
              <MenuLink to={to('/products/')} title={locale === 'zh' ? '产品体系' : 'Product system'} body="Skill · Workflow · Plugin · Expert" />
              <MenuLink to={to('/pricing/')} title={locale === 'zh' ? '价格与边界' : 'Pricing & boundaries'} body={locale === 'zh' ? '免费、课程与私有交付' : 'Open, learning, and private delivery'} />
            </MenuColumn>
            <MenuColumn label={locale === 'zh' ? '开始使用' : 'Start here'}>
              <MenuLink to={to('/course/')} title={locale === 'zh' ? 'AI 内容系统实操课' : 'AI Content System Course'} body={locale === 'zh' ? '10 章 · 39 节 · ¥980' : '10 chapters · 39 lessons · ¥980'} />
              <MenuLink to={to('/services/')} title={locale === 'zh' ? '私有流程服务' : 'Private workflow services'} body={locale === 'zh' ? '诊断、Pilot、定制与维护' : 'Assess, pilot, customize, maintain'} />
            </MenuColumn>
          </MenuItem>
          <MenuItem label={menuLabel('solutions')} open={activeMenu === 'solutions'} onToggle={() => setActiveMenu(activeMenu === 'solutions' ? null : 'solutions')}>
            <MenuColumn label={locale === 'zh' ? '按结果' : 'By outcome'}>
              <MenuLink to={to('/solutions/knowledge/')} title={locale === 'zh' ? '知识与资料系统' : 'Knowledge systems'} body={locale === 'zh' ? '采集、检索、提炼、转换' : 'Capture, retrieve, distill, transform'} />
              <MenuLink to={to('/solutions/content/')} title={locale === 'zh' ? '内容生产系统' : 'Content systems'} body={locale === 'zh' ? '观点到文章与多平台草稿' : 'From ideas to channel-ready drafts'} />
              <MenuLink to={to('/solutions/delivery/')} title={locale === 'zh' ? '软件交付系统' : 'Software delivery'} body={locale === 'zh' ? '需求、实现、测试与发版' : 'Requirements, build, test, release'} />
            </MenuColumn>
            <MenuColumn label={locale === 'zh' ? '按使用者' : 'By role'}>
              <MenuLink to={to('/open/experts/')} title={locale === 'zh' ? '个人与创作者' : 'Individuals & creators'} body={locale === 'zh' ? '用开放能力搭自己的工作流' : 'Build workflows with open capabilities'} />
              <MenuLink to={to('/services/')} title={locale === 'zh' ? '团队与企业' : 'Teams & enterprises'} body={locale === 'zh' ? '围绕授权资料做私有 Pilot' : 'Private pilots with authorized material'} />
            </MenuColumn>
          </MenuItem>
          <MenuItem label={menuLabel('open')} open={activeMenu === 'open'} onToggle={() => setActiveMenu(activeMenu === 'open' ? null : 'open')}>
            <MenuColumn label={locale === 'zh' ? '能力目录' : 'Capability catalog'}>
              <MenuLink to={to('/open/')} title={`${catalog.total} Skills`} body={locale === 'zh' ? '按结果与领域查找' : 'Find by outcome and domain'} />
              <MenuLink to={to('/open/experts/')} title="8 Experts" body={locale === 'zh' ? '按领域召唤角色' : 'Role-based domain entry points'} />
            </MenuColumn>
            <MenuColumn label={locale === 'zh' ? '领域插件' : 'Domain plugins'}>
              {catalog.domains.slice(0, 4).map((domain) => (
                <MenuLink key={domain.slug} to={to(`/open/${domain.slug}/`)} title={locale === 'zh' ? domain.label : domain.labelEn} body={`${domain.count} Skills`} compact />
              ))}
              <MenuLink to={to('/open/')} title={locale === 'zh' ? '查看全部领域 →' : 'View every domain →'} body="" compact />
            </MenuColumn>
          </MenuItem>
          <NavLink className="nav-direct" to={to('/pricing/')}>{locale === 'zh' ? '价格' : 'Pricing'}</NavLink>
          <MenuItem label={menuLabel('resources')} open={activeMenu === 'resources'} onToggle={() => setActiveMenu(activeMenu === 'resources' ? null : 'resources')}>
            <MenuColumn label={locale === 'zh' ? '学习与使用' : 'Learn & use'}>
              <MenuLink to={to('/docs/')} title={locale === 'zh' ? '文档' : 'Documentation'} body={locale === 'zh' ? '安装、调用与边界' : 'Install, invoke, and understand boundaries'} />
              <MenuLink to={to('/blog/')} title={locale === 'zh' ? '博客' : 'Blog'} body={locale === 'zh' ? '方法、产品与实践文章' : 'Methods, products, and practice'} />
              <MenuLink to={to('/spec/')} title={locale === 'zh' ? '产品规格' : 'Product specification'} body={locale === 'zh' ? '体系、状态与接口说明' : 'System, status, and interface rules'} />
            </MenuColumn>
            <MenuColumn label={locale === 'zh' ? '关于 SOIA' : 'About SOIA'}>
              <MenuLink to={to('/about/')} title={locale === 'zh' ? '原则与边界' : 'Principles & boundaries'} body="Local-first · Human-controlled" />
              <MenuLink to={to('/showcase/')} title={locale === 'zh' ? '成品展示' : 'Showcase'} body={locale === 'zh' ? '可检查的技能与工作流成品' : 'Inspectable capability outcomes'} />
            </MenuColumn>
          </MenuItem>
        </nav>
        <div className="nav-actions">
          <Link className="lang-link" to={languagePath}>{locale === 'zh' ? 'EN' : '中'}</Link>
          <a className="nav-cta" href="https://github.com/soia-team/soia-open-skills" target="_blank" rel="noreferrer">GitHub <span>↗</span></a>
        </div>
      </div>
    </header>
  );
}

function MenuItem({ label, open, onToggle, children }: { label: string; open: boolean; onToggle: () => void; children: ReactNode }) {
  return (
    <div className={open ? 'nav-menu is-open' : 'nav-menu'}>
      <button type="button" className="nav-menu-trigger" aria-expanded={open} onClick={onToggle}>{label}<span aria-hidden="true">⌄</span></button>
      <div className="mega-menu">{children}</div>
    </div>
  );
}

function MenuColumn({ label, children }: { label: string; children: ReactNode }) {
  return <div className="mega-column"><p>{label}</p>{children}</div>;
}

function MenuLink({ to, title, body, compact = false }: { to: string; title: string; body: string; compact?: boolean }) {
  return <Link className={compact ? 'mega-link is-compact' : 'mega-link'} to={to}><b>{title}</b>{body && <small>{body}</small>}</Link>;
}

export function Footer() {
  const locale = useLocale();
  const to = (path: string) => localizedPath(path, locale);
  return (
    <footer className="site-footer">
      <div className="footer-grid">
        <div className="footer-brand"><SoiaLogo /><p>{locale === 'zh' ? '把 AI 的能力，落进真实工作。' : 'Put AI capability into real work.'}</p></div>
        <FooterColumn title={locale === 'zh' ? '产品' : 'Products'} links={[[to('/products/'), 'Skill / Workflow'], [to('/open/experts/'), 'Plugin / Expert'], [to('/pricing/'), locale === 'zh' ? '价格与边界' : 'Pricing']]} />
        <FooterColumn title={locale === 'zh' ? '开放生态' : 'Open'} links={[[to('/open/'), `${catalog.total} Skills`], [to('/open/experts/'), '8 Experts'], ['https://github.com/soia-team', 'GitHub ↗']]} />
        <FooterColumn title={locale === 'zh' ? '学习' : 'Learn'} links={[[to('/course/'), locale === 'zh' ? '实操课' : 'Course'], [to('/docs/'), locale === 'zh' ? '文档' : 'Docs'], [to('/blog/'), locale === 'zh' ? '博客' : 'Blog']]} />
        <FooterColumn title={locale === 'zh' ? '合作' : 'Work with us'} links={[[to('/services/'), locale === 'zh' ? '私有流程服务' : 'Private delivery'], [to('/about/'), locale === 'zh' ? '关于 SOIA' : 'About SOIA'], [to('/spec/'), locale === 'zh' ? '产品规格' : 'Product spec']]} />
      </div>
      <div className="footer-bottom"><span>© 2026 SOIA Team</span><span>Open method · Scoped private delivery</span></div>
      <div className="footer-wordmark" aria-hidden="true">SOIA<span>.</span></div>
    </footer>
  );
}

function FooterColumn({ title, links }: { title: string; links: string[][] }) {
  return <div className="footer-column"><p>{title}</p>{links.map(([href, label]) => href.startsWith('http') ? <a key={href} href={href} target="_blank" rel="noreferrer">{label}</a> : <Link key={href} to={href}>{label}</Link>)}</div>;
}

export function Layout({ children }: { children: ReactNode }) {
  return <><a className="skip-link" href="#main">Skip to content</a><Header /><main id="main">{children}</main><Footer /></>;
}

export function ArrowLink({ to, children, className = '' }: { to: string; children: ReactNode; className?: string }) {
  return <Link className={`arrow-link ${className}`} to={to}>{children}<span aria-hidden="true">↗</span></Link>;
}
