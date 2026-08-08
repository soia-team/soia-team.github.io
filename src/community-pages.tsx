/*
 * /community/ sub-pages — React ports of the OD project's
 *   pages/community/{ambassadors,moderators,contributors,events}/index.astro
 * Copy/data from app/community-i18n.ts (zh overrides merged over EN base),
 * styles from app/community.css + the events page's is:global block.
 */
import { useEffect } from 'react';
import {
  ALLTIME_RANKING,
  AMBASSADORS,
  COMMUNITY_LINKS,
  DISCORD_CHANNELS,
  getCommunityCopy,
  GLYPH,
  MAINTAINERS,
  MODERATORS,
  WEEKLY_RANKING,
  type RankedContributor,
} from './upstream/app/community-i18n';
import { hrefFor, REPO, SubpageLayout } from './shell';
import type { LandingLocaleCode } from './upstream/app/i18n';

const pad2 = (n: number) => (n < 10 ? `0${n}` : String(n));
const fmt = (n: number | undefined) =>
  n == null ? '—' : n >= 10000 ? `${(n / 1000).toFixed(1)}k` : n.toLocaleString();

/** Rows 2..N for a leaderboard, mirroring the Astro page's `rows()`. */
function rows(list: readonly RankedContributor[], metric: 'prs' | 'commits') {
  return list.slice(1).map((c, i) => ({
    ...c,
    rank: pad2(i + 2),
    value: fmt(metric === 'prs' ? c.prs : c.commits),
  }));
}

/* ------------------------------------------------------------------ *
 * /community/ambassadors/
 * ------------------------------------------------------------------ */
export function AmbassadorsPage({ locale }: { locale: LandingLocaleCode }) {
  const copy = getCommunityCopy(locale).ambassadors;
  const href = (path: string) => hrefFor(path, locale);
  return (
    <SubpageLayout active="community" locale={locale}>
      <div className="od-community">
        <section className="hero">
          <div className="hero-decor"></div>
          <div className="wrap">
            <div className="hero-copy">
              <h1 className="h-display" dangerouslySetInnerHTML={{ __html: copy.heroTitle }} />
              <p className="lead">{copy.heroLead}</p>
            </div>
          </div>
        </section>

        <section className="section ambassadors" id="ambassadors">
          <div className="wrap">
            <div className="section-head">
              <div>
                <span className="kicker"><span className="dot"></span>{copy.program.kicker}</span>
                <h2 className="h-display" dangerouslySetInnerHTML={{ __html: copy.program.h2 }} />
              </div>
              <div className="right amb-side">
                <a className="btn btn-coral amb-apply" href={COMMUNITY_LINKS.ambassadorForm} target="_blank" rel="noopener">
                  <span className="ri" aria-hidden="true">{GLYPH.discord}</span>
                  {copy.program.applyCta}
                  <span className="ri" aria-hidden="true">{GLYPH.arrow}</span>
                </a>
                <p>{copy.program.applyNote}</p>
              </div>
            </div>

            <div className="amb-grid">
              {copy.program.cols.map((col) => (
                <div className="amb-col" key={col.n}>
                  <div className="n">{col.n}</div>
                  <h3 dangerouslySetInnerHTML={{ __html: col.h3 }} />
                  <p className="lede">{col.lede}</p>
                  <ul>
                    {col.items.map((item, i) => (
                      <li key={i}>
                        <span className="ic ri" aria-hidden="true">{GLYPH.check}</span>
                        <span dangerouslySetInnerHTML={{ __html: item }} />
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="section ambassador-roster" id="roster">
          <div className="wrap">
            <div className="section-head">
              <div>
                <span className="kicker"><span className="dot"></span>{copy.roster.kicker}</span>
                <h2 className="h-display" dangerouslySetInnerHTML={{ __html: copy.roster.h2 }} />
              </div>
              <p className="right">{copy.roster.intro}</p>
            </div>

            <div className="ambassador-cards">
              {AMBASSADORS.map((amb, i) => (
                <article className="ambassador-card" key={amb.name}>
                  <div className="ambassador-avatar">
                    <img src={amb.avatar} alt={amb.name} loading="lazy" />
                  </div>
                  <div className="ambassador-identity">
                    <h3>{amb.name}</h3>
                    <p className="ambassador-place">{copy.roster.places[i]}</p>
                  </div>
                  <div className={amb.socials.length ? 'ambassador-links' : 'ambassador-links ambassador-links-empty'}>
                    {amb.socials.map((s) => (
                      <a href={s.href} target="_blank" rel="noopener" aria-label={s.label} title={s.type} key={s.label}>
                        <span className="ri" aria-hidden="true">{s.glyph}</span>
                      </a>
                    ))}
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>
      </div>
    </SubpageLayout>
  );
}

/* ------------------------------------------------------------------ *
 * /community/moderators/
 * ------------------------------------------------------------------ */
export function ModeratorsPage({ locale }: { locale: LandingLocaleCode }) {
  const copy = getCommunityCopy(locale).moderators;
  const t = copy.discord;
  return (
    <SubpageLayout active="community" locale={locale}>
      <div className="od-community">
        <section className="hero">
          <div className="hero-decor"></div>
          <div className="wrap">
            <div className="hero-copy">
              <h1 className="h-display" dangerouslySetInnerHTML={{ __html: copy.heroTitle }} />
              <p className="lead">{copy.heroLead}</p>
            </div>
          </div>
        </section>

        <section className="discord" id="discord">
          <div className="wrap">
            <div className="discord-card">
              <div>
                <span className="kicker"><span className="dot"></span>{t.kicker}</span>
                <h2 dangerouslySetInnerHTML={{ __html: t.h2 }} />
                <p>{t.body}</p>
                <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap' }}>
                  <a className="btn btn-primary" href={COMMUNITY_LINKS.discord} target="_blank" rel="noopener">
                    <span className="ri" aria-hidden="true">{GLYPH.discord}</span>
                    {t.joinCta}
                  </a>
                  <a className="btn btn-ghost" href={COMMUNITY_LINKS.discussions} target="_blank" rel="noopener">{t.discussionsCta}</a>
                </div>
              </div>
              <div className="discord-side">
                <div className="mod-row">
                  {MODERATORS.map((mod, i) => (
                    <article className="moderator-card" key={mod.name}>
                      <div className="mod-avatar">
                        <img src={mod.avatar} alt={`${mod.name} — Open Design`} loading="lazy" />
                      </div>
                      <span className="mod-role">{t.cards[i]?.role}</span>
                      <h3 className="mod-name">{mod.name}</h3>
                      <p className="mod-bio">{t.cards[i]?.bio}</p>
                    </article>
                  ))}
                </div>
                <div className="stack">
                  {DISCORD_CHANNELS.map((channel, i) => (
                    <div className="row-d" key={channel}>
                      <span className="dot-g"></span>{channel}<span className="h">{t.channelNotes[i]}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </SubpageLayout>
  );
}

/* ------------------------------------------------------------------ *
 * /community/contributors/
 * ------------------------------------------------------------------ */
export function ContributorsPage({ locale }: { locale: LandingLocaleCode }) {
  const copy = getCommunityCopy(locale).contributors;
  const weeklyLead = WEEKLY_RANKING[0];
  const alltimeLead = ALLTIME_RANKING[0];
  const weeklyBlurb = weeklyLead
    ? copy.weekly.blurbTemplate.replace('{name}', weeklyLead.login).replace('{prs}', String(weeklyLead.prs ?? 0))
    : '';
  const weeklyRows = rows(WEEKLY_RANKING, 'prs');
  const alltimeRows = rows(ALLTIME_RANKING, 'commits');

  useEffect(() => {
    // Good-first-issues loader (mirrors the Astro inline script) + copy button.
    const API = 'https://api.github.com';
    const repo = 'nexu-io/open-design';
    const HEADERS = { Accept: 'application/vnd.github+json' };
    const gh = async (path: string) => {
      const res = await fetch(`${API}${path}`, { headers: HEADERS });
      if (!res.ok) throw new Error(`GitHub ${res.status}`);
      return res.json();
    };
    const escapeHtml = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
    const langOf = (t: string) => {
      const n = t.toLowerCase();
      if (n.includes('typescript') || n.includes('.ts')) return 'TS';
      if (n.includes('python')) return 'PY';
      if (n.includes('css') || n.includes('html') || n.includes('design')) return 'CSS';
      if (n.includes('docs') || n.includes('readme')) return 'MD';
      return 'JS/TS';
    };
    const labelClassOf = (name: string) => {
      const n = name.toLowerCase();
      if (n.includes('doc')) return 'docs';
      if (n.includes('bug')) return 'bug';
      if (n.includes('design') || n.includes('ui')) return 'design';
      return 'lang';
    };
    (async () => {
      const list = document.getElementById('issue-list');
      if (!list) return;
      const pad2n = (n: number) => (n < 10 ? `0${n}` : String(n));
      try {
        const r = await gh(`/search/issues?q=repo:${repo}+is:issue+is:open+label:%22good+first+issue%22&sort=created&order=desc&per_page=8`);
        const items = Array.isArray(r.items) ? r.items : [];
        const countEl = document.getElementById('issue-count');
        if (countEl) countEl.textContent = String(items.length);
        if (items.length === 0) {
          list.innerHTML = `<div class="issue" style="color:var(--text-faint);padding:36px 0">${escapeHtml(copy.issues.empty)}</div>`;
          return;
        }
        list.innerHTML = items.map((issue: { html_url: string; title: string; labels?: Array<{ name?: string }> }, i: number) => {
          const lang = langOf(issue.title);
          const extra = (issue.labels ?? [])
            .filter((l) => l.name !== 'good first issue')
            .slice(0, 3)
            .map((l) => `<span class="label ${labelClassOf(l.name ?? '')}">${escapeHtml(l.name ?? '')}</span>`)
            .join('');
          return `<a class="issue" href="${issue.html_url}" target="_blank" rel="noopener"><span class="num">${pad2n(i + 1)}</span><div class="body"><div class="title">${escapeHtml(issue.title)}</div><div class="meta"><span class="label good">${escapeHtml(copy.issues.loading)}</span>${extra}</div></div><span class="lang">${lang}</span><span class="arr ri" aria-hidden="true">${GLYPH.arrow}</span></a>`;
        }).join('');
      } catch {
        const countEl = document.getElementById('issue-count');
        if (countEl) countEl.textContent = '—';
        list.innerHTML = `<a class="issue" href="https://github.com/${repo}/issues?q=is%3Aopen+is%3Aissue+label%3A%22good+first+issue%22" target="_blank" rel="noopener"><div class="body"><div class="title">${escapeHtml(copy.issues.rateLimited)}</div></div></a>`;
      }
    })();
    document.querySelectorAll('[data-install] [data-copy]').forEach((btn) => {
      const onClick = async () => {
        const cmd = btn.parentElement?.getAttribute('data-install') || '';
        const copied = btn.getAttribute('data-copied-label') || 'Copied';
        const original = btn.getAttribute('data-copy-label') || btn.textContent || '';
        try {
          await navigator.clipboard.writeText(cmd);
          btn.textContent = copied;
          setTimeout(() => { btn.textContent = original; }, 2000);
        } catch { /* clipboard unavailable */ }
      };
      btn.addEventListener('click', onClick);
    });
  }, [copy.issues.empty, copy.issues.rateLimited]);

  return (
    <SubpageLayout active="community" locale={locale}>
      <div className="od-community">
        <section className="hero">
          <div className="hero-decor"></div>
          <div className="wrap">
            <div className="hero-copy">
              <h1 className="h-display" dangerouslySetInnerHTML={{ __html: copy.heroTitle }} />
              <p className="lead">{copy.heroLead}</p>
            </div>
          </div>
        </section>

        <section className="section showcase" id="showcase">
          <div className="wrap">
            <div className="section-head">
              <div>
                <span className="kicker"><span className="dot"></span>{copy.showcase.kicker}</span>
                <h2 className="h-display" dangerouslySetInnerHTML={{ __html: copy.showcase.h2 }} />
              </div>
              <p className="right">{copy.showcase.intro}</p>
            </div>

            <div className="showcase-grid">
              <div className="showcase-tenets">
                {copy.showcase.tenets.map((tenet, i) => (
                  <div className="showcase-tenet" key={i}>
                    <div className="ord">{['I', 'II', 'III', 'IV'][i]}</div>
                    <div>
                      <h3 dangerouslySetInnerHTML={{ __html: tenet.h3 }} />
                      <p dangerouslySetInnerHTML={{ __html: tenet.body }} />
                    </div>
                  </div>
                ))}
              </div>

              <aside className="contrib-card" id="contribute">
                <div>
                  <div className="pane-kicker"><span className="dot"></span>{copy.showcase.pane.kicker}</div>
                  <h3 dangerouslySetInnerHTML={{ __html: copy.showcase.pane.h3 }} />
                  <p className="pane-lede">{copy.showcase.pane.lede}</p>
                </div>
                <div className="contrib-install" data-install={COMMUNITY_LINKS.installCommand}>
                  <span className="cmd">{COMMUNITY_LINKS.installCommand}</span>
                  <button type="button" data-copy data-copy-label={copy.showcase.pane.copy} data-copied-label={copy.showcase.pane.copied}>{copy.showcase.pane.copy}</button>
                </div>
                <div className="contrib-steps">
                  {copy.showcase.pane.steps.map((step, i) => (
                    <div className="contrib-step" key={i}>
                      <span className="n">{pad2(i + 1)}</span>
                      <div>
                        <h4>{step.h4}</h4>
                        <p dangerouslySetInnerHTML={{ __html: step.body }} />
                      </div>
                    </div>
                  ))}
                </div>
              </aside>
            </div>
          </div>
        </section>

        <section className="section" id="maintainers">
          <div className="wrap">
            <div className="section-head">
              <div>
                <span className="kicker"><span className="dot"></span>{copy.maintainers.kicker}</span>
                <h2 className="h-display" dangerouslySetInnerHTML={{ __html: copy.maintainers.h2 }} />
              </div>
              <p className="right">{copy.maintainers.intro}</p>
            </div>

            <div className="maintainers-grid">
              {MAINTAINERS.map((m, i) => (
                <article className="m-card" key={m.login}>
                  <div className="av"><img src={m.avatar} alt={m.login} loading="lazy" /></div>
                  <div>
                    <div className="n" id={`m-${i + 1}-name`}>{m.login}</div>
                    <div className="role">{copy.maintainers.role}</div>
                  </div>
                  <p className="bio">{copy.maintainers.bios[m.login]}</p>
                  <div className="links">
                    <a href={m.github} target="_blank" rel="noopener"><span className="ri" aria-hidden="true">{GLYPH.github}</span>github</a>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="section signal alltime" id="alltime">
          <div className="wrap">
            <div className="section-head">
              <div>
                <span className="kicker"><span className="dot"></span>{copy.allTime.kicker}</span>
                <h2 className="h-display" dangerouslySetInnerHTML={{ __html: copy.allTime.h2 }} />
              </div>
              <p className="right">{copy.allTime.intro}</p>
            </div>
            <div className="signal-grid">
              <article className="signal-feature alltime">
                <div className="top">
                  <div className="rank"><span className="badge">01</span> {copy.allTime.rankLabel}</div>
                  <div className="week">{copy.allTime.week}</div>
                </div>
                <div className="body">
                  <div className="avatar"><img src={alltimeLead?.avatar} alt={alltimeLead?.login} /></div>
                  <div className="name">{alltimeLead?.login}</div>
                  <div className="handle">@{alltimeLead?.login} {copy.allTime.handleSuffix}</div>
                  <p className="quote">{copy.allTime.quote}</p>
                </div>
                <div className="feature-stats">
                  <div className="item"><div className="v coral">{fmt(alltimeLead?.commits)}</div><div className="l">{copy.allTime.statCommits}</div></div>
                  <div className="item"><div className="v">#01</div><div className="l">{copy.allTime.statExternalRank}</div></div>
                </div>
              </article>

              <div className="leaderboard">
                <div className="leaderboard-head">
                  <span>#</span>
                  <span>{copy.allTime.headContributor}</span>
                  <span>{copy.allTime.headCommits}</span>
                  <span>{copy.allTime.headRank}</span>
                  <span></span>
                </div>
                <div>
                  {alltimeRows.map((c) => (
                    <a className="row" href={`https://github.com/${c.login}`} target="_blank" rel="noopener" key={c.login}>
                      <span className="rk">{c.rank}</span>
                      <span className="who">
                        <img src={c.avatar} alt={c.login} loading="lazy" />
                        <span><span className="n">{c.login}</span><span className="h">@{c.login}</span></span>
                      </span>
                      <span className="v">{c.value}</span>
                      <span className="v coral">#{c.rank}</span>
                      <span className="arr ri" aria-hidden="true">{GLYPH.arrow}</span>
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="section signal weekly" id="signal">
          <div className="wrap">
            <div className="section-head">
              <div>
                <span className="kicker"><span className="dot"></span>{copy.weekly.kicker}</span>
                <h2 className="h-display" dangerouslySetInnerHTML={{ __html: copy.weekly.h2 }} />
              </div>
              <p className="right">{copy.weekly.intro}</p>
            </div>
            <div className="signal-grid">
              <article className="signal-feature">
                <div className="top">
                  <div className="rank"><span className="badge">01</span> {copy.weekly.rankLabel}</div>
                  <div className="week">{copy.weekly.week}</div>
                </div>
                <div className="body">
                  <div className="avatar"><img src={weeklyLead?.avatar} alt={weeklyLead?.login} /></div>
                  <div className="name">{weeklyLead?.login}</div>
                  <div className="handle">@{weeklyLead?.login} {copy.weekly.handleSuffix}</div>
                  <p className="quote">{weeklyBlurb}</p>
                </div>
                <div className="feature-stats">
                  <div className="item"><div className="v coral">#01</div><div className="l">{copy.weekly.statRank}</div></div>
                  <div className="item"><div className="v">{weeklyLead?.prs}</div><div className="l">{copy.weekly.statPrs}</div></div>
                </div>
              </article>

              <div className="leaderboard">
                <div className="leaderboard-head">
                  <span>#</span>
                  <span>{copy.weekly.headContributor}</span>
                  <span>{copy.weekly.headPrs}</span>
                  <span>{copy.weekly.headRank}</span>
                  <span></span>
                </div>
                <div>
                  {weeklyRows.map((c) => (
                    <a className="row" href={`https://github.com/${c.login}`} target="_blank" rel="noopener" key={c.login}>
                      <span className="rk">{c.rank}</span>
                      <span className="who">
                        <img src={c.avatar} alt={c.login} loading="lazy" />
                        <span><span className="n">{c.login}</span><span className="h">@{c.login}</span></span>
                      </span>
                      <span className="v">{c.value}</span>
                      <span className="v coral">#{c.rank}</span>
                      <span className="arr ri" aria-hidden="true">{GLYPH.arrow}</span>
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="section issues" id="issues">
          <div className="wrap">
            <div className="section-head">
              <div>
                <span className="kicker"><span className="dot"></span>{copy.issues.kicker}</span>
                <h2 className="h-display" dangerouslySetInnerHTML={{ __html: copy.issues.h2 }} />
              </div>
              <p className="right">{copy.issues.intro}</p>
            </div>
            <div className="issue-list" id="issue-list"><span id="issue-count" style={{ display: 'none' }}></span></div>
            <div className="issues-foot">
              <span dangerouslySetInnerHTML={{ __html: copy.issues.foot }} />
              <a href={COMMUNITY_LINKS.goodFirstIssues} target="_blank" rel="noopener" style={{ color: 'var(--link)' }}>{copy.issues.seeAll} <span className="ri" aria-hidden="true">{GLYPH.arrow}</span></a>
            </div>
          </div>
        </section>

        <section className="section onboard" id="how">
          <div className="wrap">
            <div className="section-head">
              <div>
                <span className="kicker"><span className="dot"></span>{copy.onboard.kicker}</span>
                <h2 className="h-display" dangerouslySetInnerHTML={{ __html: copy.onboard.h2 }} />
              </div>
              <p className="right">{copy.onboard.intro}</p>
            </div>
            <div className="steps">
              {copy.onboard.steps.map((step, i) => (
                <div className="step" key={i}>
                  <div className="ic"><span className="ri" aria-hidden="true">{[GLYPH.stepSpark, GLYPH.stepDraft, GLYPH.stepReview, GLYPH.stepMerge][i]}</span></div>
                  <div className="n">{step.n}</div>
                  <h3 dangerouslySetInnerHTML={{ __html: step.h3 }} />
                  <p>{step.body}</p>
                </div>
              ))}
            </div>
            <div className="onboard-foot">
              <a className="btn btn-coral" href={COMMUNITY_LINKS.contributing} target="_blank" rel="noopener">
                {copy.onboard.cta}
                <span className="ri" aria-hidden="true">{GLYPH.arrow}</span>
              </a>
            </div>
          </div>
        </section>
      </div>
    </SubpageLayout>
  );
}

/* ------------------------------------------------------------------ *
 * /community/events/ — the live original keeps this page in English
 * (the Astro route is a locale wrapper around the same en content).
 * ------------------------------------------------------------------ */
export function EventsPage({ locale }: { locale: LandingLocaleCode }) {
  const href = (path: string) => hrefFor(path, locale);
  return (
    <SubpageLayout active="community" locale={locale}>
      <main className="od-events">
        <section className="events-hero">
          <div className="events-wrap">
            <p className="events-kicker">Community · Events</p>
            <h1>Events where Open Design becomes hands-on.</h1>
            <p>
              Recaps from local rooms, plus upcoming sessions where builders, designers,
              educators, and community organizers make editable AI artifacts together.
            </p>
          </div>
        </section>

        <section className="events-section">
          <div className="events-wrap">
            <div className="events-section-head">
              <p className="events-kicker">Latest recap</p>
              <h2>Open Design Osaka Workshop</h2>
            </div>
            <a className="event-feature" href={href('/community/open-design-osaka-meetup/')}>
              <span className="event-feature-media">
                <img src="/stories/osaka-kyoto-group-room.jpg" alt="Participants gathered for the Osaka Open Design meetup" loading="eager" />
              </span>
              <span className="event-feature-copy">
                <span className="event-pill">Recap · Osaka · July 6</span>
                <strong>Open Design Osaka Meetup Recap</strong>
                <span>
                  A warm offline session near Nipponbashi Station: AI-powered PPT workflows,
                  real estate brochures, local website concepts, and the lesson that editable
                  artifacts beat one-off generation.
                </span>
                <span className="event-link">Read the recap -&gt;</span>
              </span>
            </a>
          </div>
        </section>

        <section className="events-section events-upcoming">
          <div className="events-wrap">
            <div className="events-section-head">
              <p className="events-kicker">Coming soon</p>
              <h2>Upcoming community sessions.</h2>
            </div>
            <div className="event-grid">
              <a className="event-card" href={href('/blog/open-design-shanghai-ai-workshop/')}>
                <span className="event-card-media">
                  <img src="/blog/open-design-shanghai-ai-workshop-cover.webp" alt="Open Design AI Workshop in Shanghai" loading="lazy" />
                </span>
                <span className="event-card-body">
                  <span className="event-pill">Upcoming · Shanghai · July 25</span>
                  <strong>Open Design AI Workshop is coming to Shanghai</strong>
                  <span>
                    A hands-on workshop for students, developers, designers, and AI tool
                    builders to turn prompts and references into real AI artifacts.
                  </span>
                  <span className="event-link">View event details -&gt;</span>
                </span>
              </a>
            </div>
          </div>
        </section>
      </main>
    </SubpageLayout>
  );
}
