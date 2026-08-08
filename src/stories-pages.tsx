/*
 * /stories/ hub + detail pages — React ports of the OD project's
 *   pages/stories/{index,ikigai-one,stuart-gardoll,seungki-kim}.astro
 * Story bodies are the pre-rendered per-locale HTML articles imported via
 * Vite ?raw from app/_partials/*-main.zh.html (set:html, same as upstream).
 */
import { INDEX_UI, STORY_BODY as IKIGAI_BODY, STORY_META as IKIGAI_META, STORY_CARD as IKIGAI_CARD, STORY_VP } from './upstream/app/_partials/ikigai-one-i18n';
import { STORY_BODY as STUART_BODY, STORY_META as STUART_META, STORY_CARD as STUART_CARD } from './upstream/app/_partials/stuart-gardoll-i18n';
import { STORY_BODY as SEUNGKI_BODY, STORY_META as SEUNGKI_META, STORY_CARD as SEUNGKI_CARD } from './upstream/app/_partials/seungki-kim-i18n';
import './upstream/app/stories.css';
import './upstream/app/_partials/ikigai-one.css';
import './upstream/app/_partials/stuart-gardoll.css';
import './upstream/app/_partials/seungki-kim.css';
import { hrefFor, SubpageLayout } from './shell';
import type { LandingLocaleCode } from './upstream/app/i18n';

const zh = (locale: LandingLocaleCode): 'en' | 'zh' => (locale === 'en' ? 'en' : 'zh');

interface StoryEntry {
  slug: string;
  company: string;
  cover: string;
  coverPosition: string;
  title: string;
  blurb: string;
}

function storyList(locale: LandingLocaleCode): StoryEntry[] {
  const k = zh(locale);
  return [
    { slug: 'seungki-kim', company: 'FABOR', cover: '/stories/seungki-kim-cover.webp', coverPosition: 'left', ...SEUNGKI_CARD[k] },
    { slug: 'stuart-gardoll', company: 'Stuart Gardoll', cover: '/stories/stuart-gardoll-cover.webp', coverPosition: 'left', ...STUART_CARD[k] },
    { slug: 'ikigai-one', company: 'Ikigai One', cover: '/stories/ikigai-one-og.jpg', coverPosition: 'left', ...IKIGAI_CARD[k] },
  ];
}

export function StoriesIndexPage({ locale }: { locale: LandingLocaleCode }) {
  const ui = INDEX_UI[locale] ?? INDEX_UI.en!;
  const vp = STORY_VP[locale] ?? STORY_VP.en!;
  const href = (path: string) => hrefFor(path, locale);
  const stories = storyList(locale);
  return (
    <SubpageLayout active="stories" locale={locale}>
      <main className="sx-shell">
        <section className="sx-masthead">
          <div className="container">
            <p className="sx-kicker">{ui.eyebrow}</p>
            <h1 className="sx-title">{ui.heading}</h1>
            <p className="sx-dek">{ui.sub}</p>
          </div>
        </section>

        <section className="sx-feature">
          <div className="container">
            <div className="sx-grid">
              {stories.map((s) => (
                <a className="sx-card" href={href(`/stories/${s.slug}/`)} key={s.slug}>
                  <span className="sx-media">
                    <img src={s.cover} alt={s.company} loading="eager" style={{ objectPosition: s.coverPosition }} />
                  </span>
                  <span className="sx-copy">
                    <span className="sx-cat">{s.company}</span>
                    <h2 className="sx-card-title">{s.title}</h2>
                    <p className="sx-card-summary">{s.blurb}</p>
                    <span className="sx-cta">{ui.readMore}</span>
                  </span>
                </a>
              ))}
            </div>
          </div>
        </section>

        <section className="sx-why">
          <div className="container">
            <h2 className="sx-why-title">{vp.heading}</h2>
            <div className="sx-why-grid">
              {vp.items.map((it, i) => (
                <div className="sx-vp" key={i}>
                  <span className="sx-vp-num">{`0${i + 1}`}</span>
                  <h3 className="sx-vp-h">{it.h}{it.badge && <span className="sx-vp-badge">{it.badge}</span>}</h3>
                  <p className="sx-vp-p">{it.p}</p>
                </div>
              ))}
            </div>
            <p className="sx-why-foot">{vp.foot}</p>
          </div>
        </section>
      </main>
    </SubpageLayout>
  );
}

function StoryDetail({ slug, title, description, body, locale }: {
  slug: string; title: string; description: string; body: string; locale: LandingLocaleCode;
}) {
  const href = (path: string) => hrefFor(path, locale);
  return (
    <SubpageLayout active="stories" locale={locale}>
      <div className="shell">
        <main className="story-page">
          <a className="story-back" href={href('/stories/')}>← {getStoriesLabel(locale)}</a>
          <div className="story-body" dangerouslySetInnerHTML={{ __html: body }} />
        </main>
      </div>
    </SubpageLayout>
  );
}

function getStoriesLabel(locale: LandingLocaleCode): string {
  return (INDEX_UI[locale] ?? INDEX_UI.en!).eyebrow;
}

export function IkigaiOnePage({ locale }: { locale: LandingLocaleCode }) {
  const k = zh(locale);
  return <StoryDetail slug="ikigai-one" title={IKIGAI_META[k].title} description={IKIGAI_META[k].description} body={IKIGAI_BODY[k]} locale={locale} />;
}

export function StuartGardollPage({ locale }: { locale: LandingLocaleCode }) {
  const k = zh(locale);
  return <StoryDetail slug="stuart-gardoll" title={STUART_META[k].title} description={STUART_META[k].description} body={STUART_BODY[k]} locale={locale} />;
}

export function SeungkiKimPage({ locale }: { locale: LandingLocaleCode }) {
  const k = zh(locale);
  return <StoryDetail slug="seungki-kim" title={SEUNGKI_META[k].title} description={SEUNGKI_META[k].description} body={SEUNGKI_BODY[k]} locale={locale} />;
}
