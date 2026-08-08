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
  type LandingLocaleCode,
} from './upstream/app/i18n';
import { getInfoPageCopy as getInfoCopy, getInfoPageCopy, type AgentGuideCopy, type AgentRichBlock } from './upstream/app/info-page-i18n';
import { getCodexSlidesCopy } from './upstream/app/codex-slides-i18n';
import { getSolutionsIndexCopy } from './upstream/app/solutions-index-i18n';
import { getSolutionPageCopy } from './upstream/app/solution-pages-i18n';
import { AGENTS, AGENT_ROUTE_TO_SLUG, PRODUCT_ROUTES, type ProductRouteSpec } from './routes';
import {
  BlogArticlePage,
  BlogPage,
  getCatalogTitle,
  PluginCollectionPage,
  PluginDetailPage,
  PluginsPage,
  PricingPage,
} from './catalog-pages';
import { SolutionsIndexPage, SolutionDetailPage, SOLUTION_ROUTES, DownloadPage } from './solution-pages';
import { ALTERNATIVE_SLUGS, AlternativeDetailPage, ComparePage } from './comparison-pages';
import { OpenDesignPluginPage, QuickstartPage } from './action-pages';
import { CommunityPage, FaqPage, LegalPage, AboutPage, CareersPage, OfficialPage } from './info-pages';
import { AmbassadorsPage, ContributorsPage, EventsPage, ModeratorsPage } from './community-pages';
import { IkigaiOnePage, SeungkiKimPage, StoriesIndexPage, StuartGardollPage } from './stories-pages';
import { COUNTS, GITHUB, hrefFor, REPO, SubpageLayout } from './shell';

const ZH = 'zh' as LandingLocaleCode;

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
  const path = window.location.pathname.replace(/\/+$/, '') || '/';
  if (path === '/zh') return '/';
  if (path.startsWith('/zh/')) return path.slice(3) || '/';
  return path;
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
  const faq = useMemo(() => getHomeFaq(locale, { origin: 'https://open-design.ai/', repo: REPO }), [locale]);
  return <OpenDesignHome counts={COUNTS} github={GITHUB} faq={faq} locale={locale} />;
}

function slugId(value: string): string {
  return value.toLowerCase().replace(/[^a-z0-9\u4e00-\u9fff]+/g, '-').replace(/^-|-$/g, '');
}

const PRODUCT_BODY: Record<string, Record<string, string>> = {
  '/html-anything': {
    '为什么需要它': '你最终发布的是渲染后的内容表面，不是源文件。HTML Anything 补齐从原始笔记到精致页面之间的最后一步。',
    'Markdown 是草稿，HTML 才是读者看到的页面。': '你最终发布的是渲染后的内容表面，不是源文件。HTML Anything 补齐从原始笔记到精致页面之间的最后一步。',
    '你的 Agent 已经认识你。': '不用新账号、不用新 API key、不用额外订阅。终端里的 CLI 就是渲染引擎，HTML Anything 只负责运行你的 skill。',
    'Skill 是文件夹，不是黑盒。': '75 个模板都是可 fork、可编辑、可复用的 SKILL.md 文件夹。选择器本质上就是一个可浏览的目录。',
    '工作流程': '一句输入进去，Agent 选择 Skill 并把结果实时渲染成可发布的 HTML，再按渠道导出。',
    '放入输入内容': '支持 Markdown、CSV、TSV、JSON、SQL、Excel 或纯文本。表格数据在浏览器内解析，内容不会离开你的电脑。',
    '选择 Skill，由 Agent 渲染': '从 SKILL.md 模板中选择一个。你已经登录的本地 CLI 会把 stdout 流进沙盒预览，可以实时看到布局生成。',
    '导出到目标渠道': '一键导出到微信 MP、X / 微博 / 小红书、知乎、独立 HTML 或 2× PNG。输出是可发布成品，不是起手架。',
    '示例': '每个卡片都对应 registry 里的真实 Skill，可以 fork 文件夹、替换内容、直接导出。',
  },
  '/html-video': {
    '为什么需要它': 'Hyperframes、Remotion、Motion Canvas、Manim，每个都要你学它那一套写法。html-video 是凌驾在它们之上的 meta-layer。',
    'HTML 转视频是个真实的品类——但每个引擎都有自己的脾气。': '每个渲染引擎都有自己的语法与限制。html-video 把 storyboard 和 render() adapter 解耦。',
    '你跟 agent 对话，由它选引擎。': 'Agent 决定 storyboard，引擎决定怎么画——两者互不渗透。接入一个新后端，所有模板都自动受益。',
    '一个链接进去，一个 MP4 出来——全在本地。': '无头 Chromium 逐帧录制动画 HTML，ffmpeg 编码成 MP4。不走云渲染，没有按次计费。',
    '工作流程': '一句话或一个链接进去，一个真实 MP4 出来。无论从 prompt、文章还是仓库开始，流水线都一样。',
    '抓取源': '粘贴一个 URL 或 GitHub 仓库，studio 抓取并压平成 Markdown。',
    'Agent 循环': '本地 agent 读取素材和模板风格，输出一个 content-graph storyboard。',
    'Content-graph': '多帧中间表示：节点与边被拓扑排序成帧序和时序。',
    '逐帧 HTML': '每个节点变成磁盘上一段自包含的动画 HTML。',
    'Hyperframes 渲染': '无头 Chromium 加载每一帧并录制，自动覆盖该帧自身的动画。',
    'ffmpeg → 你的.mp4': '每个 webm 编码成 MP4 再拼接成一段视频。',
  },
  '/codex-slides': {
    '为什么会有它': '一套幻灯片不是一次生成问题，而是一连串关于内容、顺序和视觉语言的决策。Codex Slides 把每一步都留在项目里。',
    '它是怎么运作的': '从澄清需求、研究事实、打磨大纲，到锁定视觉方向、并行渲染、就地修改，再到演示和导出。',
    '先把需求问清楚': '在写作开始之前确认受众、页数、比例、语言、分辨率和视觉意图。',
    '把事实查扎实': '可选的多轮研究生成可检查、可编辑的 source-backed brief。',
    '把大纲打磨好': '编辑标题和 talking points，添加、删除、重排页面，或让 agent 重新组织故事。',
    '锁定视觉方向': '从样式库中选择视觉方向，锁定之后再并行渲染。',
    '并行渲染': 'Fast mode 让页面同时渲染，而不是一页一页等待。',
    '就地修改': '重写、标记区域、替换图片、重排页面、设置转场并写 speaker notes。',
    '演示和导出': '在 Presenter Mode 中演示，再导出真正的 PPTX 与可打印 PDF。',
    '交付真正的文件': 'PPTX、PDF 和 speaker notes 都保留在本地项目中，方便继续修改。',
  },
};

function ProductPage({ spec, locale }: { spec: ProductRouteSpec; locale: LandingLocaleCode }) {
  const href = (path: string) => hrefFor(path, locale);
  const body = PRODUCT_BODY[spec.path] ?? {};
  const codexCopy = spec.path === '/codex-slides' ? getCodexSlidesCopy(locale) : null;
  const bodyFor = (heading: string) => body[heading] ?? spec.intro;
  return (
    <SubpageLayout active="home" locale={locale}>
      <nav className="breadcrumb" aria-label="面包屑"><a href={href('/')}>Open Design</a><span>/</span><span aria-current="page">{spec.title}</span></nav>
      <article className="info-page od-product-page" data-od-id={`route-${slugId(spec.path)}`}>
        <header className="catalog-head">
          <span className="label">Open Design · 姊妹项目</span>
          <h1 className="display">{spec.heading}</h1>
          <p className="lead">{codexCopy?.lead ?? spec.intro}</p>
          <div className="od-route-actions">
            <a className="btn btn-primary" href={href('/download/')}>下载桌面端</a>
            <a className="btn btn-ghost" href={REPO} target="_blank" rel="noreferrer noopener">在 GitHub 查看 ↗</a>
          </div>
        </header>
        <figure className="od-product-hero"><img src={spec.image} alt={spec.imageAlt} /></figure>
        <div className="info-toc" aria-label="本页内容"><span>本页内容</span>{spec.sections.filter((section, index) => index === 0 || !spec.sections[index - 1]?.startsWith('为什么') && !spec.sections[index - 1]?.startsWith('工作')).slice(0, 10).map((section) => <a key={section} href={`#${slugId(section)}`}>{section}</a>)}</div>
        {spec.sections.map((heading, index) => {
          const major = index === 0 || ['工作流程', '示例', '引擎', '幻灯片长什么样', '看真实产品', '六类工作流', '交付真正的文件', '来自 Open Design 家族'].includes(heading);
          return (
            <section className={`info-section${major ? ' od-major-section' : ''}`} id={slugId(heading)} key={`${heading}-${index}`}>
              {major ? <h2>{heading}</h2> : <h3>{heading}</h3>}
              <p>{bodyFor(heading)}</p>
              {heading === '示例' || heading === '幻灯片长什么样' || heading === '看真实产品' ? (
                <div className="od-product-grid">
                  {['/lab-cards/card-1.webp', '/lab-cards/card-2.webp', '/lab-cards/card-3.webp'].map((src) => <img key={src} src={src} alt="Open Design 本地输出示例" loading="lazy" />)}
                </div>
              ) : null}
            </section>
          );
        })}
        <section className="info-cta" aria-label="Open Design 下载">
          <div><h2>来自 Open Design 家族</h2><p>Open Design 是开源、本地优先的 vibe design workspace；所有项目文件都留在自己的电脑上。</p></div>
          <div className="info-cta-actions"><a className="btn btn-primary" href={href('/download/')}>下载桌面端</a><a className="btn btn-ghost" href={REPO} target="_blank" rel="noreferrer noopener">GitHub</a></div>
        </section>
      </article>
    </SubpageLayout>
  );
}

function AgentIcon({ slug }: { slug: string }) {
  const map: Record<string, string> = {
    'claude-code': 'claude.svg',
    cursor: 'cursor-agent.svg',
    copilot: 'copilot.svg',
    grok: 'grok-build.svg',
    'trae-cli': 'trae-cli.png',
    devin: 'devin.png',
    aider: 'aider.png',
  };
  const ext = map[slug] ?? `${slug}.svg`;
  return <img className="od-agent-icon" src={`/agent-icons/${ext}`} alt="" loading="lazy" />;
}

function AgentHub({ locale }: { locale: LandingLocaleCode }) {
  const copy = getInfoCopy(locale);
  const page = copy.agents;
  const href = (path: string) => hrefFor(path, locale);
  const tierGroups = [AGENTS.slice(0, 7), AGENTS.slice(7, 13), AGENTS.slice(13)];
  return (
    <SubpageLayout active="agent" locale={locale}>
      <nav className="breadcrumb" aria-label={page.breadcrumb}><a href={href('/')}>Open Design</a><span>/</span><span aria-current="page">{page.breadcrumb}</span></nav>
      <article className="info-page agents-hub" data-od-id="agents-hub">
        <header className="catalog-head catalog-head-bare"><h1 className="display">{page.heading(AGENTS.length)}</h1><p className="lead">{page.lead(AGENTS.length)}</p></header>
        <section className="info-section"><h2>{page.adaptersTitle}</h2><p>{page.adaptersBody}</p>
          {page.tiers.map((tier, tierIndex) => <div className="od-agent-tier" key={tier.label}><h3>{tier.label}</h3><p>{tier.blurb}</p><ul className="agent-grid">{(tierGroups[tierIndex] ?? []).map((agent) => <li className="agent-card" id={agent.slug} key={`${tier.label}-${agent.slug}`}><AgentIcon slug={agent.slug} /><h3><a href={href(`/agents/${agent.route}/`)}>{agent.name}</a></h3><p><strong>{page.vendor}:</strong> {agent.vendor}</p><p><strong>{page.credential}:</strong> {copy.agentGuides?.[agent.slug]?.credential ?? `${page.byokTitle} · ${agent.vendor}`}</p></li>)}</ul></div>)}
        </section>
        <section className="info-section" id="byok"><h2>{page.byokTitle}</h2><p>{page.byokLead}</p><ul>{page.byokItems.map((item) => <li key={item}>{item}</li>)}</ul></section>
        <section className="info-cta" aria-label={page.ctaTitle(AGENTS.length)}><div><h2>{page.ctaTitle(AGENTS.length)}</h2><p>{page.ctaBody}</p></div><div className="info-cta-actions"><a className="btn btn-primary" href={href('/download/')}>下载桌面端</a><a className="btn btn-ghost" href={REPO} target="_blank" rel="noreferrer noopener">GitHub</a></div></section>
      </article>
    </SubpageLayout>
  );
}

function InlineText({ text }: { text: string }) {
  const parts = text.split(/(\[[^\]]+\]\([^\)]+\))/g);
  return <>{parts.map((part, index) => {
    const match = /^\[([^\]]+)\]\(([^\)]+)\)$/.exec(part);
    if (!match) return <span key={index}>{part}</span>;
    const target = match[2].startsWith('http') ? match[2] : hrefFor(match[2], ZH);
    return <a key={index} href={target} target={match[2].startsWith('http') ? '_blank' : undefined} rel={match[2].startsWith('http') ? 'noreferrer noopener' : undefined}>{match[1]}</a>;
  })}</>;
}

function RichBlock({ block }: { block: AgentRichBlock }) {
  if (block.kind === 'p') return <p><InlineText text={block.text} /></p>;
  if (block.kind === 'ul') return <ul>{block.items.map((item) => <li key={item}><InlineText text={item} /></li>)}</ul>;
  if (block.kind === 'ol') return <ol>{block.items.map((item) => <li key={item}><InlineText text={item} /></li>)}</ol>;
  if (block.kind === 'steps') return <ul className="agent-steps">{block.items.map((item) => <li key={item.label}><strong>{item.label}:</strong> <InlineText text={item.body} /></li>)}</ul>;
  if (block.kind === 'code') return <pre className="agent-code"><code>{block.code}</code></pre>;
  if (block.kind === 'table') return <div className="compare-table-wrap"><table className="compare-table"><thead><tr>{block.columns.map((column) => <th key={column}>{column}</th>)}</tr></thead><tbody>{block.rows.map((row) => <tr key={row.join('|')}>{row.map((cell, index) => index === 0 ? <th scope="row" key={cell}>{cell}</th> : <td key={cell}>{cell}</td>)}</tr>)}</tbody></table></div>;
  if (block.kind === 'split') return <div className={`agent-split agent-split--img-${block.imageSide}`}><figure className="agent-split-img"><img src={block.image.src.startsWith('/') ? block.image.src : '/hero-product-1920.webp'} alt={block.image.alt} loading="lazy" />{block.image.caption ? <figcaption>{block.image.caption}</figcaption> : null}</figure><div className="agent-split-text">{block.text.map((text) => <p key={text}><InlineText text={text} /></p>)}</div></div>;
  return <figure className="agent-section-img"><img src={block.src.startsWith('/') ? block.src : '/hero-product-1920.webp'} alt={block.alt} loading="lazy" />{block.caption ? <figcaption>{block.caption}</figcaption> : null}</figure>;
}

function AgentDetail({ slug, locale }: { slug: string; locale: LandingLocaleCode }) {
  const copy = getInfoCopy(locale);
  const page: AgentGuideCopy | undefined = copy.agentGuides?.[slug] ?? getInfoCopy(DEFAULT_LOCALE).agentGuides?.[slug];
  const agent = AGENTS.find((entry) => entry.slug === slug);
  const href = (path: string) => hrefFor(path, locale);
  if (!page || !agent) return <NotFound locale={locale} />;
  const rich = page.rich;
  return (
    <SubpageLayout active="agent" locale={locale}>
      <nav className="breadcrumb" aria-label={copy.common.breadcrumbAria}><a href={href('/')}>Open Design</a><span>/</span><a href={href('/agents/')}>{copy.agents.breadcrumb}</a><span>/</span><span aria-current="page">{page.breadcrumb}</span></nav>
      <article className={`info-page solution-page agent-rich agent-rich-hub od-agent-page${rich ? '' : ' od-agent-page-compact'}`} data-od-id={`agent-${slug}`}>
        <header className="catalog-head agent-rich-head"><div className="od-agent-heading-row"><AgentIcon slug={slug} /><div><h1 className="display">{page.heading}</h1><p className="lead">{page.lead}</p></div></div><div className="solution-hero-cta"><a className="btn btn-primary" href={href('/download/')}>下载桌面端</a><a className="btn btn-ghost" href={REPO} target="_blank" rel="noreferrer noopener">GitHub ↗</a></div></header>
        {rich ? <div className="agent-rich-body"><aside className="agent-toc-rail"><nav className="info-toc" aria-label={rich.tocLabel}><span>{rich.tocLabel}</span>{rich.toc.map((toc) => <a href={`#${toc.id}`} key={toc.id}>{toc.label}</a>)}</nav></aside><div className="agent-rich-main">{rich.heroImage ? <figure className="agent-hero-banner"><img src={rich.heroImage.src.startsWith('/') ? rich.heroImage.src : '/hero-product-1920.webp'} alt={rich.heroImage.alt} loading="eager" /></figure> : null}<div className="agent-intro"><p className="agent-hero-lead">{rich.heroCtaLead}</p>{rich.intro.map((paragraph) => <p key={paragraph}><InlineText text={paragraph} /></p>)}</div>{rich.sections.map((section) => <section className="info-section" id={section.id} key={section.id}><h2>{section.heading}</h2>{section.blocks.map((block, index) => <RichBlock block={block} key={`${section.id}-${index}`} />)}</section>)}<section className="info-section" id="faq"><h2>{rich.faqTitle}</h2><ol className="faq-list">{rich.faq.map((faq, index) => <li className="faq-item" key={faq.name}><details><summary><span className="faq-index">{String(index + 1).padStart(2, '0')}</span><span className="faq-q">{faq.name}</span><span className="faq-toggle" aria-hidden="true">+</span></summary><p className="faq-a">{faq.text}</p></details></li>)}</ol></section><section className="info-cta" aria-label={rich.ctaTitle}><div><h2>{rich.ctaTitle}</h2><p>{rich.ctaBody}</p></div><div className="info-cta-actions">{rich.ctaActions.map((action) => <a className={`btn ${action.variant === 'primary' ? 'btn-primary' : 'btn-ghost'}`} href={action.external ? action.href : href(action.href)} target={action.external ? '_blank' : undefined} rel={action.external ? 'noreferrer noopener' : undefined} key={action.label}>{action.label}</a>)}</div></section></div></div> : <CompactAgentGuide page={page} locale={locale} />}
      </article>
    </SubpageLayout>
  );
}

function CompactAgentGuide({ page, locale }: { page: AgentGuideCopy; locale: LandingLocaleCode }) {
  const href = (path: string) => hrefFor(path, locale);
  return <div className="od-agent-compact-body"><div className="tldr-card"><h3>{page.tldrTitle}</h3><p>{page.tldrBody}</p></div><nav className="info-toc" aria-label="本页内容"><span>本页内容</span>{page.toc.map((item) => <a href={`#${slugId(item)}`} key={item}>{item}</a>)}</nav><section className="info-section" id="about"><h2>{page.aboutTitle}</h2>{page.aboutBody.map((text) => <p key={text}>{text}</p>)}<ul><li><strong>{page.vendorLabel}:</strong> {page.vendor}</li><li><strong>{page.credentialLabel}:</strong> {page.credential}</li></ul></section><section className="info-section" id="design"><h2>{page.designTitle}</h2><p>{page.designLead}</p><ol>{page.designPoints.map((item) => <li key={item.label}><strong>{item.label}</strong> {item.body}</li>)}</ol></section><section className="info-section" id="resources"><h2>{page.linksTitle}</h2><p>{page.linksLead}</p><ul className="resource-list">{page.links.map((link) => <li key={link.href}><a href={link.href} target="_blank" rel="noreferrer noopener">{link.label}</a><span className="resource-source">{link.source}</span></li>)}</ul></section><section className="info-section" id="with-od"><h2>{page.withOdTitle}</h2><p>{page.withOdLead}</p><ol>{page.withOdSteps.map((step) => <li key={step}>{step}</li>)}</ol><p>{page.withOdClosing}</p></section><section className="info-section" id="faq"><h2>{page.faqTitle}</h2><ol className="faq-list">{page.faq.map((faq, index) => <li className="faq-item" key={faq.name}><details><summary><span className="faq-index">{String(index + 1).padStart(2, '0')}</span><span className="faq-q">{faq.name}</span><span className="faq-toggle" aria-hidden="true">+</span></summary><p className="faq-a">{faq.text}</p></details></li>)}</ol></section><section className="info-cta" aria-label={page.ctaTitle}><div><h2>{page.ctaTitle}</h2><p>{page.ctaBody}</p></div><div className="info-cta-actions"><a className="btn btn-primary" href={href('/download/')}>下载桌面端</a><a className="btn btn-ghost" href={REPO} target="_blank" rel="noreferrer noopener">GitHub</a></div></section></div>;
}

function NotFound({ locale }: { locale: LandingLocaleCode }) {
  return <SubpageLayout locale={locale}><article className="info-page od-not-found"><header className="catalog-head"><span className="label">Open Design</span><h1 className="display">This page wandered off.</h1><p className="lead">本地 React 复刻没有为这个路径生成页面。</p><div className="od-route-actions"><a className="btn btn-primary" href={hrefFor('/', locale)}>回到首页</a><a className="btn btn-ghost" href={hrefFor('/agents/', locale)}>浏览 Agent</a></div></header></article></SubpageLayout>;
}

export default function App() {
  const [locale, setLocale] = useState<LandingLocaleCode>(() => currentLocale());
  const path = localPathname();
  const product = PRODUCT_ROUTES.find((route) => route.path === path);
  const agentSlug = path.startsWith('/agents/') ? AGENT_ROUTE_TO_SLUG[path.slice('/agents/'.length)] : undefined;
  const isHome = path === '/';
  const isSolutionsIndex = path === '/solutions';
  const solutionSlug = path.startsWith('/solutions/') ? path.slice('/solutions/'.length).replace(/\/+$/, '') : undefined;
  const isDownload = path === '/download';
  const isQuickstart = path === '/quickstart';
  const isOpenDesignPlugin = path === '/open-design-pugin';
  const isCommunity = path === '/community';
  const isCommunityAmbassadors = path === '/community/ambassadors';
  const isCommunityContributors = path === '/community/contributors';
  const isCommunityModerators = path === '/community/moderators';
  const isCommunityEvents = path === '/community/events';
  const isStories = path === '/stories';
  const storySlug = path.startsWith('/stories/') ? path.slice('/stories/'.length).replace(/\/+$/, '') : undefined;
  const isStoryIkigai = storySlug === 'ikigai-one';
  const isStoryStuart = storySlug === 'stuart-gardoll';
  const isStorySeungki = storySlug === 'seungki-kim';
  const isFaq = path === '/faq';
  const isAbout = path === '/about';
  const isCareers = path === '/careers';
  const isOfficial = path === '/official';
  const isPrivacy = path === '/privacy';
  const isTerms = path === '/terms';
  const isCompare = path === '/compare';
  const alternativeSlug = path.startsWith('/alternatives/')
    ? path.slice('/alternatives/'.length).replace(/\/+$/, '')
    : undefined;
  const pluginCollection = path === '/plugins/templates' || path === '/plugins/skills' || path === '/plugins/systems'
    ? path.slice('/plugins/'.length) as 'templates' | 'skills' | 'systems'
    : undefined;
  const pluginParts = path.startsWith('/plugins/') ? path.slice('/plugins/'.length).split('/').filter(Boolean) : [];
  const pluginSlug = path.startsWith('/plugins/') && !pluginCollection && path !== '/plugins'
    ? (pluginParts[0] === 'templates' && pluginParts[1] ? pluginParts[1] : pluginParts[0])
    : undefined;
  const blogSlug = path.startsWith('/blog/') ? path.slice('/blog/'.length).split('/').filter(Boolean)[0] : undefined;

  const pageTitle =
    isHome ? 'Open Design —— 最佳 Claude Design 开源替代'
    : isSolutionsIndex ? getSolutionsIndexCopy(locale).heading
    : solutionSlug && SOLUTION_ROUTES[solutionSlug] ? getSolutionPageCopy(locale, SOLUTION_ROUTES[solutionSlug].key).title
    : isDownload ? getInfoPageCopy(locale).download.title
    : isQuickstart ? getInfoPageCopy(locale).quickstart.title
    : isOpenDesignPlugin ? 'Open Design for Codex/ChatGPT | 安装 Open Design Cloud 插件'
    : isCommunity ? '社区 — Open Design'
    : isCommunityAmbassadors ? '社区大使 — Open Design'
    : isCommunityContributors ? '贡献者 — Open Design'
    : isCommunityModerators ? '社区版主 — Open Design'
    : isCommunityEvents ? '社区活动 — Open Design'
    : isStories ? '客户故事 — Open Design'
    : isStoryIkigai || isStoryStuart || isStorySeungki ? '客户故事 — Open Design'
    : isFaq ? '常见问题 — Open Design'
    : isAbout ? '关于 — Open Design'
    : isCareers ? '加入我们 — Open Design'
    : isOfficial ? '官方资源 — Open Design'
    : isPrivacy ? '隐私政策 — Open Design'
    : isTerms ? '服务条款 — Open Design'
    : isCompare ? getInfoPageCopy(locale).compare.title
    : alternativeSlug && (ALTERNATIVE_SLUGS as readonly string[]).includes(alternativeSlug)
      ? (getInfoCopy(locale).alternatives?.[alternativeSlug]?.title ?? `Open Design vs ${alternativeSlug}`)
    : (product?.title ?? getCatalogTitle(path) ?? 'Open Design');

  useEffect(() => {
    const sync = () => setLocale(currentLocale());
    window.addEventListener('popstate', sync);
    document.documentElement.lang = getLocaleDefinition(locale).htmlLang;
    document.title = pageTitle;
    return () => window.removeEventListener('popstate', sync);
  }, [isHome, locale, path, product?.title, pageTitle]);

  useClientEnhancements();

  useEffect(() => {
    document.body.classList.toggle('sub-page', !isHome);
    return () => document.body.classList.remove('sub-page');
  }, [isHome]);

  if (isHome) return <HomeRoute locale={locale} />;
  if (isSolutionsIndex) return <SolutionsIndexPage locale={locale} />;
  if (solutionSlug && SOLUTION_ROUTES[solutionSlug]) return <SolutionDetailPage slug={solutionSlug} locale={locale} />;
  if (isDownload) return <DownloadPage locale={locale} />;
  if (isQuickstart) return <QuickstartPage locale={locale} />;
  if (isOpenDesignPlugin) return <OpenDesignPluginPage locale={locale} />;
  if (isCommunity) return <CommunityPage locale={locale} />;
  if (isCommunityAmbassadors) return <AmbassadorsPage locale={locale} />;
  if (isCommunityContributors) return <ContributorsPage locale={locale} />;
  if (isCommunityModerators) return <ModeratorsPage locale={locale} />;
  if (isCommunityEvents) return <EventsPage locale={locale} />;
  if (isStories) return <StoriesIndexPage locale={locale} />;
  if (isStoryIkigai) return <IkigaiOnePage locale={locale} />;
  if (isStoryStuart) return <StuartGardollPage locale={locale} />;
  if (isStorySeungki) return <SeungkiKimPage locale={locale} />;
  if (isFaq) return <FaqPage locale={locale} />;
  if (isAbout) return <AboutPage locale={locale} />;
  if (isCareers) return <CareersPage locale={locale} />;
  if (isOfficial) return <OfficialPage locale={locale} />;
  if (isPrivacy) return <LegalPage locale={locale} kind="privacy" />;
  if (isTerms) return <LegalPage locale={locale} kind="terms" />;
  if (isCompare) return <ComparePage locale={locale} />;
  if (alternativeSlug && (ALTERNATIVE_SLUGS as readonly string[]).includes(alternativeSlug)) return <AlternativeDetailPage slug={alternativeSlug} locale={locale} />;
  if (product) return <ProductPage spec={product} locale={locale} />;
  if (path === '/plugins') return <PluginsPage locale={locale} />;
  if (pluginCollection) return <PluginCollectionPage locale={locale} kind={pluginCollection} />;
  if (pluginSlug) return <PluginDetailPage locale={locale} slug={pluginSlug} />;
  if (path === '/pricing') return <PricingPage locale={locale} />;
  if (path === '/blog') return <BlogPage locale={locale} />;
  if (blogSlug) return <BlogArticlePage locale={locale} slug={blogSlug} />;
  if (path === '/agents') return <AgentHub locale={locale} />;
  if (agentSlug) return <AgentDetail slug={agentSlug} locale={locale} />;
  return <NotFound locale={locale} />;
}
