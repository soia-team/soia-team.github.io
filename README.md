# SOIA public website

This repository is the deployment mirror for [soia-team.github.io](https://soia-team.github.io/).
The React/Vite source lives in [`soia-site/`](./soia-site/); the generated
GitHub Pages files are kept at the repository root.

## Local development

```bash
cd soia-site
pnpm install
pnpm dev
```

Open <http://127.0.0.1:4174/>.

## Build and validate

```bash
pnpm --dir soia-site install
pnpm validate
pnpm build
pnpm test
```

`pnpm build` generates the root Pages output and a `404.html` SPA fallback.
`pnpm test` checks the generated shell, assets, route manifest, sitemap,
public-only copy, and required governance files.

## Public information architecture

- `/` — SOIA capability overview
- `/products/` — Skill, Workflow, Plugin, and Expert product shapes
- `/open/` — 80 public Skills across 8 capability domains
- `/open/<domain>/` — capability-domain pages
- `/open/<domain>/<skill>/` — individual Skill detail pages
- `/open/experts/` — 8 role-based Experts
- `/course/` — AI Content System practical course
- `/services/` — scoped private workflow delivery
- `/pricing/`, `/docs/`, `/blog/`, `/showcase/`, `/spec/`, `/about/`
- `/en/...` — English route family

Public capability is free to inspect and install. Private delivery is scoped,
authorized, and kept separate from the public repository. No payments,
credentials, private customer material, or internal operating plans are
processed by this site.

## Source and attribution

The implementation was built from the local Open Design project while keeping
SOIA copy, taxonomy, application code, and capability data original. Selected
neutral visual assets and the design direction are documented in
[`soia-site/THIRD_PARTY_NOTICES.md`](./soia-site/THIRD_PARTY_NOTICES.md).

## License

MIT. See [LICENSE](./LICENSE).
