import { useEffect } from 'react';
import { Link, Route, Routes, useLocation } from 'react-router-dom';
import { Layout, useLocale } from './components/SiteChrome';
import { HomePage } from './pages/HomePage';
import { DomainPage, ExpertPage, ExpertsPage, OpenPage, SkillPage } from './pages/CatalogPages';
import { CoursePage, PricingPage, ProductsPage, ServicesPage, SolutionPage } from './pages/CommercialPages';
import { AboutPage, BlogPage, BlogPostPage, DocsPage, ShowcasePage, SpecPage } from './pages/ResourcePages';
import { localizedPath } from './data/site';

const routeFamilies = [
  { path: '/', element: <HomePage /> },
  { path: '/index.html', element: <HomePage /> },
  { path: '/products/', element: <ProductsPage /> },
  { path: '/open/', element: <OpenPage /> },
  { path: '/open/experts/', element: <ExpertsPage /> },
  { path: '/open/experts/:expert/', element: <ExpertPage /> },
  { path: '/open/:domain/', element: <DomainPage /> },
  { path: '/open/:domain/:skill/', element: <SkillPage /> },
  { path: '/course/', element: <CoursePage /> },
  { path: '/services/', element: <ServicesPage /> },
  { path: '/pricing/', element: <PricingPage /> },
  { path: '/solutions/:solution/', element: <SolutionPage /> },
  { path: '/docs/', element: <DocsPage /> },
  { path: '/blog/', element: <BlogPage /> },
  { path: '/blog/:post/', element: <BlogPostPage /> },
  { path: '/showcase/', element: <ShowcasePage /> },
  { path: '/spec/', element: <SpecPage /> },
  { path: '/about/', element: <AboutPage /> },
];

export function App() {
  const location = useLocation();
  useEffect(() => {
    const english = location.pathname.startsWith('/en');
    const clean = location.pathname.replace(/^\/en/, '') || '/';
    const titleZh: Record<string, string> = {
      '/': 'SOIA｜把 AI 能力落进真实工作',
      '/products/': 'SOIA 产品体系｜Skill、Workflow、Plugin 与 Expert',
      '/open/': 'SOIA 开放生态｜公开、可检查的 Agent 能力',
      '/course/': 'SOIA AI 内容系统实操课｜首期内测 ¥980',
      '/services/': 'SOIA 私有流程服务｜从一个真实场景开始',
      '/pricing/': 'SOIA 价格与边界',
      '/docs/': 'SOIA 文档',
      '/blog/': 'SOIA 博客',
      '/spec/': 'SOIA 产品规格',
      '/about/': '关于 SOIA',
    };
    const titleEn: Record<string, string> = {
      '/': 'SOIA | Capability for real work',
      '/products/': 'SOIA Product System | Skill, Workflow, Plugin, Expert',
      '/open/': 'SOIA Open Ecosystem | Inspectable Agent capabilities',
      '/course/': 'SOIA AI Content System Course | First cohort ¥980',
      '/services/': 'SOIA Private Workflow Services',
      '/pricing/': 'SOIA Pricing and Boundaries',
      '/docs/': 'SOIA Documentation',
      '/blog/': 'SOIA Blog',
      '/spec/': 'SOIA Product Specification',
      '/about/': 'About SOIA',
    };
    document.documentElement.lang = english ? 'en' : 'zh-CN';
    document.title = (english ? titleEn : titleZh)[clean] ?? (english ? 'SOIA | Agent Capability System' : 'SOIA｜Agent Capability System');
  }, [location.pathname]);

  return <Layout><Routes>{routeFamilies.flatMap((route) => [
    <Route key={route.path} path={route.path} element={route.element} />,
    <Route key={`/en${route.path}`} path={`/en${route.path}`} element={route.element} />,
  ])}<Route path="*" element={<NotFoundPage />} /></Routes></Layout>;
}

function NotFoundPage() {
  const locale = useLocale();
  return <section className="missing"><p>404</p><h1>{locale === 'zh' ? '这条工作路径还不存在。' : 'This work path does not exist yet.'}</h1><Link to={localizedPath('/', locale)}>{locale === 'zh' ? '返回首页' : 'Back home'} →</Link></section>;
}
