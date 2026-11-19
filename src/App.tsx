import {
  useEffect,
  useMemo,
  useState,
} from 'react';
import OpenDesignHome from './upstream/app/page';
import {
  DEFAULT_LOCALE,
  getHomeFaq,
  getLocaleDefinition,
  localeFromPath,
  stripLocaleFromPath,
  type LandingLocaleCode,
} from './upstream/app/i18n';
import { FaqPage, LegalPage, AboutPage, PricingPage } from './info-pages';
import { COUNTS, GITHUB, hrefFor, REPO, SubpageLayout } from './shell';
import { SoiaDeckPage, SoiaCodePage, SoiaRuntimePage, SkillsHubPage, SkillDomainPage, SkillDetailPage, SKILL_DOMAINS } from './soia-pages';

declare global {
  type MatterApi = {
    Engine: { create: () => any; clear: (engine: any) => void };
    Render: { create: (options: any) => any; run: (render: any) => void; stop: (render: any) => void };
    World: { add: (world: any, bodies: any[]) => void; clear: (world: any, keepStatic: boolean) => void };
    Bodies: { rectangle: (x: number, y: number, width: number, height: number, options: any) => any };
    Runner: { create: () => any; run: (runner: any, engine: any) => void; stop: (runner: any) => void };
    Mouse: { create: (element: HTMLElement) => any };
    MouseConstraint: { create: (engine: any, options: any) => any };
    Body: { setVelocity: (body: any, velocity: { x: number; y: number }) => void; setAngularVelocity: (body: any, velocity: number) => void };
  };
  interface Window {
    __cobe?: (canvas: HTMLCanvasElement, options: Record<string, unknown>) => {
      update: (options: Record<string, unknown>) => void;
      destroy?: () => void;
    };
    Matter?: MatterApi;
  }
}

function currentLocale(): LandingLocaleCode {
  const locale = localeFromPath(window.location.pathname);
  return locale || DEFAULT_LOCALE;
}

function localPathname(): string {
  const clean = stripLocaleFromPath(window.location.pathname).pathname.replace(/\/+$/, '');
  return clean || '/';
}

function loadClassicScript(src: string, id: string): Promise<void> {
  const existing = document.getElementById(id) as HTMLScriptElement | null;
  if (existing?.dataset.loaded === 'true') return Promise.resolve();
  if (existing) {
    return new Promise((resolve) => existing.addEventListener('load', () => resolve(), { once: true }));
  }
  return new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.id = id;
    script.src = src;
    script.async = true;
    script.addEventListener('load', () => {
      script.dataset.loaded = 'true';
      resolve();
    }, { once: true });
    script.addEventListener('error', () => reject(new Error(`Unable to load ${src}`)), { once: true });
    document.head.appendChild(script);
  });
}

function useClientEnhancements() {
  useEffect(() => {
    const cleanups: Array<() => void> = [];
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const nav = document.querySelector('[data-od-id="nav"]');
    const navToggle = nav?.querySelector('[data-nav-toggle]');
    const navPrimary = nav?.querySelector('[data-nav-primary]');
    if (navToggle && navPrimary && nav) {
      const onToggle = () => {
        const open = nav.classList.toggle('is-open');
        navToggle.setAttribute('aria-expanded', String(open));
      };
      const close = () => {
        nav.classList.remove('is-open');
        navToggle.setAttribute('aria-expanded', 'false');
      };
      navToggle.addEventListener('click', onToggle);
      const onNavLink = (event: Event) => {
        if ((event.target as HTMLElement).closest('a')) close();
      };
      navPrimary.addEventListener('click', onNavLink);
      cleanups.push(() => {
        navToggle.removeEventListener('click', onToggle);
        navPrimary.removeEventListener('click', onNavLink);
      });
    }

    let lastScroll = window.scrollY;
    const chrome = document.querySelector('[data-chrome-headroom]');
    const onScroll = () => {
      const y = window.scrollY;
      chrome?.classList.toggle('is-condensed', y > 64);
      if (chrome && y > 120) chrome.classList.toggle('is-hidden', y > lastScroll + 8);
      if (chrome && y < 24) chrome.classList.remove('is-hidden');
      lastScroll = y;
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    cleanups.push(() => window.removeEventListener('scroll', onScroll));

    const revealNodes = Array.from(document.querySelectorAll<HTMLElement>('[data-reveal]'));
    const revealObserver = 'IntersectionObserver' in window
      ? new IntersectionObserver((entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              (entry.target as HTMLElement).dataset.revealed = 'true';
              revealObserver?.unobserve(entry.target);
            }
          });
        }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' })
      : null;
    revealNodes.forEach((node) => revealObserver?.observe(node));
    if (!revealObserver) revealNodes.forEach((node) => { node.dataset.revealed = 'true'; });
    cleanups.push(() => revealObserver?.disconnect());

    const lazyNodes = Array.from(document.querySelectorAll<HTMLImageElement>('[data-precise-src]'));
    const activateImage = (img: HTMLImageElement) => {
      const src = img.dataset.preciseSrc;
      if (src && img.getAttribute('src') !== src) img.src = src;
      img.removeAttribute('data-precise-src');
    };
    const lazyObserver = 'IntersectionObserver' in window
      ? new IntersectionObserver((entries) => entries.forEach((entry) => {
          if (entry.isIntersecting) {
            activateImage(entry.target as HTMLImageElement);
            lazyObserver?.unobserve(entry.target);
          }
        }), { rootMargin: '300px 0px' })
      : null;
    lazyNodes.forEach((node) => lazyObserver?.observe(node));
    if (!lazyObserver) lazyNodes.forEach(activateImage);

    const preciseBackgrounds = Array.from(document.querySelectorAll<HTMLElement>('[data-precise-bg]'));
    const backgroundObserver = 'IntersectionObserver' in window
      ? new IntersectionObserver((entries) => entries.forEach((entry) => {
          if (entry.isIntersecting) {
            (entry.target as HTMLElement).classList.add('precise-bg-in');
            backgroundObserver?.unobserve(entry.target);
          }
        }), { rootMargin: '300px 0px' })
      : null;
    preciseBackgrounds.forEach((node) => backgroundObserver?.observe(node));
    if (!backgroundObserver) preciseBackgrounds.forEach((node) => node.classList.add('precise-bg-in'));

    const stage = document.querySelector<HTMLElement>('.lab-stage');
    const artifact = stage?.querySelector<HTMLImageElement>('[data-lab-artifact]');
    const videoArtifact = stage?.querySelector<HTMLVideoElement>('[data-lab-video]');
    const dockItems = Array.from(document.querySelectorAll<HTMLElement>('[data-dock-item]'));
    const swapArtifact = (item: HTMLElement) => {
      const videoSrc = item.dataset.previewVideo;
      if (videoSrc && videoArtifact) {
        if (artifact) {
          artifact.classList.remove('is-visible');
          artifact.hidden = true;
        }
        videoArtifact.hidden = false;
        if (videoArtifact.src !== new URL(videoSrc, window.location.href).href) videoArtifact.src = videoSrc;
        videoArtifact.classList.add('is-visible');
        videoArtifact.load();
        void videoArtifact.play().catch(() => undefined);
      } else {
        const src = item.dataset.previewSrc;
        if (!artifact || !src) return;
        if (videoArtifact) {
          videoArtifact.pause();
          videoArtifact.classList.remove('is-visible');
          videoArtifact.hidden = true;
        }
        artifact.hidden = false;
        artifact.src = src;
        artifact.classList.toggle('is-wide', item.hasAttribute('data-preview-wide'));
        artifact.classList.add('is-visible');
        artifact.alt = item.dataset.previewTitle ?? '';
      }
      dockItems.forEach((dockItem) => dockItem.classList.toggle('active', dockItem === item));
    };
    dockItems.forEach((item) => {
      const onEnter = () => swapArtifact(item);
      const onClick = () => swapArtifact(item);
      item.addEventListener('mouseenter', onEnter);
      item.addEventListener('focus', onEnter);
      item.addEventListener('click', onClick);
      cleanups.push(() => {
        item.removeEventListener('mouseenter', onEnter);
        item.removeEventListener('focus', onEnter);
        item.removeEventListener('click', onClick);
      });
    });
    if (dockItems[0]) swapArtifact(dockItems[0]);

    // The upstream homepage renders this as a scroll-driven module. The
    // static React port keeps the exact markup, so wire the missing behavior
    // here: every step is a real keyboard/click target and the active art
    // follows the user's scroll position through the sticky track.
    const capScrolly = document.querySelector<HTMLElement>('[data-cap-scrolly]');
    const capSteps = Array.from(document.querySelectorAll<HTMLElement>('[data-cap-step]'));
    const capFrames = Array.from(document.querySelectorAll<HTMLElement>('[data-cap-frame]'));
    if (capScrolly && capSteps.length && capFrames.length) {
      let activeCapIndex = 0;
      const setCapActive = (rawIndex: number) => {
        const index = Math.max(0, Math.min(capSteps.length - 1, rawIndex));
        activeCapIndex = index;
        capSteps.forEach((step, stepIndex) => {
          const active = stepIndex === index;
          step.classList.toggle('is-active', active);
          step.setAttribute('aria-current', active ? 'step' : 'false');
        });
        capFrames.forEach((frame, frameIndex) => {
          const active = frameIndex === index;
          frame.classList.toggle('is-active', active);
          frame.style.zIndex = String(active ? capFrames.length + 1 : frameIndex);
        });
      };
      const onCapScroll = () => {
        const rect = capScrolly.getBoundingClientRect();
        const travel = Math.max(1, capScrolly.offsetHeight - window.innerHeight * 0.46);
        const progress = Math.max(0, Math.min(1, ((window.innerHeight * 0.22) - rect.top) / travel));
        setCapActive(Math.round(progress * (capSteps.length - 1)));
      };
      capSteps.forEach((step, index) => {
        step.setAttribute('role', 'button');
        step.setAttribute('tabindex', '0');
        step.setAttribute('aria-current', index === 0 ? 'step' : 'false');
        const onStepClick = (event: Event) => {
          event.preventDefault();
          setCapActive(index);
        };
        const onStepKey = (event: KeyboardEvent) => {
          if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            setCapActive(index);
          }
        };
        step.addEventListener('click', onStepClick);
        step.addEventListener('keydown', onStepKey);
        cleanups.push(() => {
          step.removeEventListener('click', onStepClick);
          step.removeEventListener('keydown', onStepKey);
        });
      });
      setCapActive(activeCapIndex);
      window.addEventListener('scroll', onCapScroll, { passive: true });
      window.addEventListener('resize', onCapScroll);
      onCapScroll();
      cleanups.push(() => {
        window.removeEventListener('scroll', onCapScroll);
        window.removeEventListener('resize', onCapScroll);
      });
    }

    document.querySelectorAll<HTMLFormElement>('form[data-newsletter]').forEach((form) => {
      const onSubmit = (event: Event) => {
        event.preventDefault();
        const done = document.createElement('p');
        done.className = 'newsletter-done';
        done.textContent = form.dataset.newsletterDone || 'Thanks!';
        form.replaceWith(done);
      };
      form.addEventListener('submit', onSubmit);
      cleanups.push(() => form.removeEventListener('submit', onSubmit));
    });

    const canvas = document.querySelector<HTMLCanvasElement>('[data-testimonial-globe] canvas');
    let globeFrame = 0;
    let globeInstance: { update: (options: Record<string, unknown>) => void; destroy?: () => void } | undefined;
    let globeObserver: IntersectionObserver | undefined;
    const initGlobe = () => {
      if (!canvas || !window.__cobe || globeInstance) return;
      const markers = [
        { location: [37.7749, -122.4194], size: 0.055 },
        { location: [40.7128, -74.006], size: 0.045 },
        { location: [52.52, 13.405], size: 0.052 },
        { location: [35.6762, 139.6503], size: 0.05 },
        { location: [31.2304, 121.4737], size: 0.045 },
        { location: [1.3521, 103.8198], size: 0.04 },
        { location: [-23.5505, -46.6333], size: 0.042 },
        { location: [-33.8688, 151.2093], size: 0.042 },
      ];
      const size = () => Math.max(260, Math.floor(canvas.offsetWidth || 360));
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      let phi = 0.32;
      globeInstance = window.__cobe(canvas, {
        devicePixelRatio: dpr,
        width: size() * dpr,
        height: size() * dpr,
        phi,
        theta: 0.28,
        dark: 0,
        diffuse: 0,
        mapSamples: 12000,
        mapBrightness: 1,
        mapBaseBrightness: 0,
        baseColor: [1, 1, 1],
        markerColor: [0.31, 0.98, 0.08],
        glowColor: [1, 1, 1],
        opacity: 1,
        scale: 1,
        markerElevation: 0.015,
        markers,
      });
      const render = () => {
        if (!globeInstance) return;
        if (!reducedMotion) phi += 0.0042;
        globeInstance.update({ width: size() * dpr, height: size() * dpr, phi });
        globeFrame = window.requestAnimationFrame(render);
      };
      if (!globeObserver) {
        globeObserver = new IntersectionObserver(([entry]) => {
          if (entry?.isIntersecting) {
            if (!globeFrame) globeFrame = window.requestAnimationFrame(render);
          } else if (globeFrame) {
            window.cancelAnimationFrame(globeFrame);
            globeFrame = 0;
          }
        }, { threshold: 0.05 });
        globeObserver.observe(canvas);
      }
      canvas.dataset.globeReady = 'true';
    };
    if (canvas) {
      loadClassicScript('/enhancers/cobe.js', 'open-design-cobe')
        .then(() => initGlobe())
        .catch(() => { canvas.dataset.globeReady = 'fallback'; });
    }

    const falling = document.querySelector<HTMLElement>('[data-falling-text]');
    let matterCleanup: (() => void) | undefined;
    const initMatter = () => {
      if (!falling || !window.Matter || falling.dataset.fallingReady === 'true') return;
      const target = falling.querySelector<HTMLElement>('.falling-text-target');
      const canvasContainer = falling.querySelector<HTMLElement>('.falling-text-canvas');
      if (!target || !canvasContainer) return;
      const { Engine, Render, World, Bodies, Runner, Mouse, MouseConstraint, Body } = window.Matter;
      const rect = falling.getBoundingClientRect();
      if (rect.width <= 0 || rect.height <= 0) return;
      const engine = Engine.create();
      engine.world.gravity.y = Number.parseFloat(falling.dataset.gravity || '0.9');
      const render = Render.create({ element: canvasContainer, engine, options: { width: rect.width, height: rect.height, background: 'transparent', wireframes: false } });
      const wall = { isStatic: true, render: { fillStyle: 'transparent' } };
      const bodies = Array.from(target.querySelectorAll<HTMLElement>('.falling-word')).map((element) => {
        const box = element.getBoundingClientRect();
        const body = Bodies.rectangle(box.left - rect.left + box.width / 2, box.top - rect.top + box.height / 2, box.width, box.height, { restitution: 0.8, frictionAir: 0.01, friction: 0.2, render: { fillStyle: 'transparent' } });
        Body.setVelocity(body, { x: (Math.random() - 0.5) * 5, y: 0 });
        Body.setAngularVelocity(body, (Math.random() - 0.5) * 0.05);
        element.style.position = 'absolute';
        element.style.margin = '0';
        return { element, body };
      });
      const floor = Bodies.rectangle(rect.width / 2, rect.height + 25, rect.width, 50, wall);
      const leftWall = Bodies.rectangle(-25, rect.height / 2, 50, rect.height, wall);
      const rightWall = Bodies.rectangle(rect.width + 25, rect.height / 2, 50, rect.height, wall);
      const ceiling = Bodies.rectangle(rect.width / 2, -25, rect.width, 50, wall);
      const mouse = Mouse.create(falling);
      mouse.element.removeEventListener('wheel', mouse.mousewheel);
      const constraint = MouseConstraint.create(engine, { mouse, constraint: { stiffness: 0.9, render: { visible: false } } });
      render.mouse = mouse;
      World.add(engine.world, [floor, leftWall, rightWall, ceiling, constraint, ...bodies.map(({ body }) => body)]);
      const runner = Runner.create();
      Runner.run(runner, engine);
      Render.run(render);
      falling.dataset.fallingReady = 'true';
      falling.querySelector('[data-falling-reveal]')?.classList.add('is-visible');
      let frame = 0;
      const sync = () => {
        bodies.forEach(({ element, body }) => {
          element.style.left = `${body.position.x}px`;
          element.style.top = `${body.position.y}px`;
          element.style.transform = `translate(-50%, -50%) rotate(${body.angle}rad)`;
        });
        frame = window.requestAnimationFrame(sync);
      };
      sync();
      matterCleanup = () => {
        window.cancelAnimationFrame(frame);
        Runner.stop(runner);
        Render.stop(render);
        World.clear(engine.world, false);
        Engine.clear(engine);
        canvasContainer.replaceChildren();
      };
    };
    if (falling) {
      const showStaticFalling = () => {
        falling.dataset.fallingReady = 'true';
        falling.querySelector('[data-falling-reveal]')?.classList.add('is-visible');
      };
      if (reducedMotion) showStaticFalling();
      else loadClassicScript('/enhancers/matter.min.js', 'open-design-matter').then(initMatter).catch(showStaticFalling);
    }

    cleanups.push(() => {
      if (globeFrame) window.cancelAnimationFrame(globeFrame);
      globeObserver?.disconnect();
      globeInstance?.destroy?.();
      matterCleanup?.();
      lazyObserver?.disconnect();
      backgroundObserver?.disconnect();
    });
    return () => cleanups.forEach((cleanup) => cleanup());
  }, []);
}

function HomeRoute({ locale }: { locale: LandingLocaleCode }) {
  const faq = useMemo(() => getHomeFaq(locale, { origin: 'https://soia-team.github.io/', repo: REPO }), [locale]);
  return <OpenDesignHome counts={COUNTS} github={GITHUB} faq={faq} locale={locale} />;
}

function NotFound({ locale }: { locale: LandingLocaleCode }) {
  const zh = locale === 'zh';
  const ja = locale === 'ja';
  return (
    <SubpageLayout locale={locale}>
      <article className="info-page od-not-found">
        <header className="catalog-head">
          <span className="label">SOIA</span>
          <h1 className="display">{zh ? '页面未找到。' : ja ? 'ページが見つかりません。' : 'This page wandered off.'}</h1>
          <p className="lead">
            {zh
              ? '该路径当前没有对应页面。你可以返回首页，或直接浏览 SoiaDeck 与开源技能目录。'
              : ja
                ? '指定されたパスにはページが存在しません。ホームに戻るか、SoiaDeck やオープンソーススキル一覧をご覧ください。'
                : 'No page is mapped to this path. Head back home or browse SoiaDeck and Open Skills.'}
          </p>
          <div className="od-route-actions">
            <a className="btn btn-primary" href={hrefFor('/', locale)}>{zh ? '回到首页' : ja ? 'ホームへ戻る' : 'Back home'}</a>
            <a className="btn btn-ghost" href={hrefFor('/skills/', locale)}>{zh ? '浏览开源技能' : ja ? 'オープンソーススキルを見る' : 'Open skills'}</a>
            <a className="btn btn-ghost" href={hrefFor('/soiadeck/', locale)}>SoiaDeck</a>
          </div>
        </header>
      </article>
    </SubpageLayout>
  );
}

export default function App() {
  const [locale, setLocale] = useState<LandingLocaleCode>(() => currentLocale());
  const path = localPathname();
  const isHome = path === '/';
  const isFaq = path === '/faq';
  const isAbout = path === '/about';
  const isPricing = path === '/pricing';
  const isPrivacy = path === '/privacy';
  const isTerms = path === '/terms';
  const zh = locale === 'zh';
  const ja = locale === 'ja';

  const pageTitle =
    isHome ? (zh ? 'SOIA — SoiaDeck 桌面 AI 平台' : ja ? 'SOIA — ローカル優先の Agent プラットフォームと SoiaDeck' : 'SOIA — SoiaDeck desktop AI platform')
    : path === '/soiadeck' ? (zh ? 'SoiaDeck — 桌面 AI 平台，即将开源' : ja ? 'SoiaDeck — デスクトップ AI プラットフォーム（オープンソース準備中）' : 'SoiaDeck — desktop AI platform, coming open source')
    : path === '/soiacode' ? (zh ? 'SoiaCode (si) — 轻量 Rust Coding Agent' : ja ? 'SoiaCode (si) — 軽量 Rust Coding Agent 仕様' : 'SoiaCode (si) — lightweight Rust coding agent')
    : path === '/soia' ? (zh ? 'SOIA Runtime — 开源 Agent Operating System' : ja ? 'SOIA Runtime — オープンソース Agent OS' : 'SOIA Runtime — open-source Agent OS')
    : path === '/skills' ? (zh ? '开源技能 — 47 个技能，4 个领域' : ja ? 'オープンソーススキル — 4 領域 47 スキル' : 'Open skills — 47 skills, 4 domains')
    : path.startsWith('/skills/') ? `SOIA Skills — ${path.slice('/skills/'.length).replace(/\/+$/, '')}`
    : isFaq ? (zh ? '常见问题 — SOIA' : ja ? 'よくある質問 — SOIA' : 'FAQ — SOIA')
    : isAbout ? (zh ? '关于 — SOIA' : ja ? 'SOIA について' : 'About — SOIA')
    : isPricing ? (zh ? '服务与定价 — SOIA' : ja ? 'サービスと料金 — SOIA' : 'Services & Pricing — SOIA')
    : isPrivacy ? (zh ? '隐私政策 — SOIA' : ja ? 'プライバシーポリシー — SOIA' : 'Privacy Policy — SOIA')
    : isTerms ? (zh ? '服务条款 — SOIA' : ja ? '利用規約 — SOIA' : 'Terms of Service — SOIA')
    : 'SOIA';

  useEffect(() => {
    const sync = () => setLocale(currentLocale());
    window.addEventListener('popstate', sync);
    document.documentElement.lang = getLocaleDefinition(locale).htmlLang;
    document.title = pageTitle;
    return () => window.removeEventListener('popstate', sync);
  }, [isHome, locale, path, pageTitle]);

  useEffect(() => {
    const scrollToHash = () => {
      const rawHash = window.location.hash.replace(/^#/, '');
      if (!rawHash) return;
      const targetId = decodeURIComponent(rawHash);
      const attempt = () => {
        const el = document.getElementById(targetId);
        if (el) el.scrollIntoView({ behavior: 'auto', block: 'start' });
      };
      requestAnimationFrame(() => {
        attempt();
        window.setTimeout(attempt, 180);
      });
    };
    scrollToHash();
    window.addEventListener('hashchange', scrollToHash);
    return () => window.removeEventListener('hashchange', scrollToHash);
  }, [path, locale]);

  useClientEnhancements();

  useEffect(() => {
    document.body.classList.toggle('sub-page', !isHome);
    return () => document.body.classList.remove('sub-page');
  }, [isHome]);

  if (isHome) return <HomeRoute locale={locale} />;
  if (path === '/soiadeck') return <SoiaDeckPage locale={locale} />;
  if (path === '/soiacode') return <SoiaCodePage locale={locale} />;
  if (path === '/soia') return <SoiaRuntimePage locale={locale} />;
  if (path === '/skills') return <SkillsHubPage locale={locale} />;
  if (path.startsWith('/skills/')) {
    const parts = path.slice('/skills/'.length).split('/').filter(Boolean);
    const [domainSlug, skillSlug] = parts;
    if (domainSlug && SKILL_DOMAINS.some((domain) => domain.slug === domainSlug)) {
      if (skillSlug) {
        return (
          <SkillDetailPage
            locale={locale}
            slug={domainSlug as (typeof SKILL_DOMAINS)[number]['slug']}
            skill={skillSlug}
          />
        );
      }
      return <SkillDomainPage locale={locale} slug={domainSlug as (typeof SKILL_DOMAINS)[number]['slug']} />;
    }
  }
  if (isFaq) return <FaqPage locale={locale} />;
  if (isAbout) return <AboutPage locale={locale} />;
  if (isPricing) return <PricingPage locale={locale} />;
  if (isPrivacy) return <LegalPage locale={locale} kind="privacy" />;
  if (isTerms) return <LegalPage locale={locale} kind="terms" />;
  return <NotFound locale={locale} />;
}
