import type { ReactNode } from 'react';

export function PageHero({ eyebrow, title, lead, aside, compact = false }: { eyebrow: string; title: ReactNode; lead: ReactNode; aside?: ReactNode; compact?: boolean }) {
  return (
    <section className={compact ? 'page-hero is-compact' : 'page-hero'}>
      <div className="page-hero-main"><p className="lime-kicker">{eyebrow}</p><h1>{title}</h1><div className="page-lead">{lead}</div></div>
      {aside && <aside className="page-hero-aside">{aside}</aside>}
    </section>
  );
}

export function Status({ children, tone = 'green' }: { children: ReactNode; tone?: 'green' | 'dark' | 'plain' }) {
  return <span className={`status status-${tone}`}>{children}</span>;
}

export function NumberedList({ items }: { items: Array<{ title: string; body: string }> }) {
  return <ol className="numbered-list">{items.map((item, index) => <li key={item.title}><span>{String(index + 1).padStart(2, '0')}</span><div><h3>{item.title}</h3><p>{item.body}</p></div></li>)}</ol>;
}

export function CodeBlock({ children }: { children: string }) {
  return <div className="code-block"><code>{children}</code><button type="button" onClick={() => navigator.clipboard?.writeText(children)}>COPY</button></div>;
}
