import type {
  AgentCtaAction,
  AgentRichSection,
  AlternativeDetailCopy,
} from './upstream/app/info-page-i18n';

type Feature = AlternativeDetailCopy['features'][number];
type Reason = AlternativeDetailCopy['reasons'][number];
type Faq = { name: string; text: string };

type MissingAlternativeSpec = {
  slug: string;
  competitor: string;
  title: string;
  description: string;
  breadcrumb: string;
  label: string;
  heading: string;
  lead: string;
  tldrBody: string;
  heroCtaLead: string;
  intro: string[];
  image: { src: string; alt: string };
  sections: AgentRichSection[];
  reasons: Reason[];
  localByokTitle: string;
  localByokBody: string[];
  features: Feature[];
  whoTitle: string;
  pickCompetitorTitle: string;
  pickCompetitor: string[];
  pickOpen: string[];
  migrateTitle: string;
  migrateLead: string;
  migrateSteps: string[];
  migrateClosing: string;
  faq: Faq[];
  ctaTitle: string;
  ctaBody: string;
};

const DOWNLOAD: AgentCtaAction = { label: 'Download Open Design', href: '/download/', variant: 'primary' };
const GITHUB: AgentCtaAction = { label: 'Star on GitHub', href: 'https://github.com/nexu-io/open-design', variant: 'ghost', external: true };

function makeAlternative(spec: MissingAlternativeSpec): AlternativeDetailCopy {
  const toc = spec.sections.map((section) => ({ id: section.id, label: section.heading }));
  return {
    title: spec.title,
    description: spec.description,
    breadcrumb: spec.breadcrumb,
    label: spec.label,
    heading: spec.heading,
    lead: spec.lead,
    tldrTitle: 'TL;DR',
    tldrBody: spec.tldrBody,
    toc: [...toc.map((item) => item.label), 'FAQ'],
    whyTitle: spec.sections[2]?.heading ?? `Why teams look for a ${spec.competitor} alternative`,
    whyLead: `Teams look for a ${spec.competitor} alternative when the hosted workflow gets in the way of ownership, consistency, or shipping.`,
    reasons: spec.reasons,
    localByokTitle: spec.localByokTitle,
    localByokBody: spec.localByokBody,
    featureTitle: 'Feature comparison',
    features: spec.features,
    whoTitle: spec.whoTitle,
    pickClaudeTitle: spec.pickCompetitorTitle,
    pickClaude: spec.pickCompetitor,
    pickOpenTitle: 'Pick Open Design if',
    pickOpen: spec.pickOpen,
    migrateTitle: spec.migrateTitle,
    migrateLead: spec.migrateLead,
    migrateSteps: spec.migrateSteps,
    migrateClosing: spec.migrateClosing,
    faqTitle: 'FAQ',
    faq: spec.faq,
    ctaTitle: spec.ctaTitle,
    ctaBody: spec.ctaBody,
    rich: {
      heroCtaLead: spec.heroCtaLead,
      heroCtaActions: [DOWNLOAD, GITHUB],
      intro: spec.intro,
      heroImage: spec.image,
      tocLabel: 'On this page',
      toc,
      sections: spec.sections,
      faqTitle: 'FAQ',
      faq: spec.faq,
      ctaTitle: spec.ctaTitle,
      ctaBody: spec.ctaBody,
      ctaActions: [DOWNLOAD, GITHUB],
      hubLinkLabel: 'See all comparisons',
    },
  };
}

const commonFeatures = (competitor: string): Feature[] => [
  { name: 'Primary surface', od: 'Agent-driven design workflow + local files', cd: `${competitor} hosted design surface` },
  { name: 'License', od: 'Apache-2.0, full source on GitHub', cd: 'Closed-source product' },
  { name: 'Runtime', od: 'Local-first; self-hostable', cd: 'Vendor-hosted or account-bound' },
  { name: 'Agent / model', od: 'BYOK: Claude Code, Codex, Cursor, Gemini, OpenCode, Qwen', cd: 'Vendor-selected or vendor-optimized models' },
  { name: 'Design system', od: 'Portable DESIGN.md in your repo', cd: 'Per-project or in-tool styling' },
  { name: 'Output ownership', od: 'Files in your repository', cd: 'Hosted workspace plus export or sync' },
];

export const MISSING_ALTERNATIVE_COPY: Record<string, AlternativeDetailCopy> = {
  'figma-make': makeAlternative({
    slug: 'figma-make',
    competitor: 'Figma Make',
    title: 'Best Figma Make alternative for design — Open Design',
    description: "Figma Make turns prompts into React apps inside Figma's cloud. Open Design is the open-source, local-first, BYOK alternative with files you own.",
    breadcrumb: 'Best Figma Make alternative',
    label: 'Alternative · Figma Make',
    heading: 'Best Figma Make alternative for design.',
    lead: 'Open Design is the open-source, local-first alternative to Figma Make — your coding agent, your key, your files, and a portable design system you keep in your repo, with no Figma cloud lock-in and no credit meter.',
    tldrBody: 'Figma Make is the fastest path from an existing Figma frame to a hosted React prototype. Open Design takes the ownership path: your agent, your key, and every generated artifact as files in your repository.',
    heroCtaLead: 'Open Design is the open-source, local-first design layer around the coding agent you already use — your key, your files, and a portable brand.',
    intro: [
      'Figma Make turns a prompt or an existing Figma frame into a running React + TypeScript app inside Figma. Open Design is a different posture: an open-source, local-first design agent that writes the work into your own repository.',
      'This comparison is about Figma Make specifically — not the full Figma canvas. It credits Make\'s designer-friendly first mile and explains where cloud hosting, paid seats, and monthly AI credits push teams to look elsewhere.',
    ],
    image: { src: '/alternatives/figma-make/figma-make-hero.webp', alt: 'Open Design vs Figma Make — a prompt converging into a design hub you own' },
    sections: [
      { id: 'what-is-figma-make', heading: 'What Figma Make is', blocks: [
        { kind: 'p', text: "Figma Make is Figma's prompt-to-app tool. You can describe an app or attach an existing Figma frame, then refine a live React + TypeScript app through chat, point-and-edit, and point-and-prompt." },
        { kind: 'p', text: 'It genuinely wins when a team already lives in Figma: the frame is the source of truth, the first prototype stays beside the canvas, and Supabase can provide a quick backend path.' },
        { kind: 'image', src: '/alternatives/figma-make/figma-make-product.webp', alt: 'Figma Make — prompt-to-app inside the Figma ecosystem' },
      ] },
      { id: 'why-switch', heading: 'Why teams look for a Figma Make alternative', blocks: [
        { kind: 'p', text: 'Figma Make runs in hosted Figma cloud, authoring requires a paid Full seat, and meaningful actions spend AI credits that reset monthly. The output can be exported, but the working surface and runtime remain tied to Figma.' },
        { kind: 'steps', items: [
          { label: 'Own the pipeline', body: 'Keep components, pages, tokens, and the design system as files in your repo.' },
          { label: 'Avoid the credit meter', body: 'Use your own coding agent and pay the model provider directly.' },
          { label: 'Work beyond React', body: 'Use a design workflow that is not limited to Figma Make\'s React + TypeScript surface.' },
        ] },
      ] },
      { id: 'local-byok', heading: 'Local-first + BYOK, explained', blocks: [
        { kind: 'p', text: 'Local-first means the agent runs on your machine, against your repo, and the artifacts — components, pages, tokens, and DESIGN.md — are committed as files you control.' },
        { kind: 'p', text: 'BYOK means you point Open Design at the coding agent you already trust with your own key. You pick the model, pay your provider directly, and own both the output and the engine driving it.' },
        { kind: 'image', src: '/alternatives/figma-make/figma-make-design-systems.webp', alt: 'Open Design design-system library — brands and tokens kept as files you own' },
      ] },
      { id: 'compare', heading: 'Open Design vs Figma Make, feature by feature', blocks: [{ kind: 'table', columns: ['Feature', 'Open Design', 'Figma Make'], rows: commonFeatures('Figma Make').map((row) => [row.name, row.od, row.cd]) }] },
      { id: 'who-picks', heading: 'Which should you pick', blocks: [
        { kind: 'p', text: 'Pick Figma Make when an existing Figma frame, the hosted canvas, one-click publishing, or a Supabase-backed prototype is the job. Pick Open Design when ownership, local files, model choice, and a portable design system matter more than staying inside Figma.' },
      ] },
      { id: 'migrate', heading: 'Moving from Figma Make to Open Design', blocks: [
        { kind: 'ol', items: ['Export the React/TypeScript source or capture the frame and its key states.', 'Point your coding agent at the exported source, screenshots, and existing tokens.', 'Extract the reusable brand into DESIGN.md.', 'Render the next screen with an Open Design skill and keep the result in your repo.'] },
      ] },
    ],
    reasons: [
      { label: 'Own the output.', body: 'Design and code should live as files in your repo, not inside a hosted project.' },
      { label: 'Choose your agent.', body: 'Bring the coding agent and provider key you already use.' },
      { label: 'Keep the brand portable.', body: 'A DESIGN.md system survives tool changes and new projects.' },
    ],
    localByokTitle: 'Local-first + BYOK, explained',
    localByokBody: ['Open Design runs locally and writes design artifacts and DESIGN.md directly into your repository.', 'You bring the agent and key; inference bills to your provider, with no Figma credit meter in between.'],
    features: commonFeatures('Figma Make'),
    whoTitle: 'Which should you pick',
    pickCompetitorTitle: 'Pick Figma Make if',
    pickCompetitor: ['You already work in Figma and need a clickable prototype from a frame quickly.', 'You want hosted publishing and a Supabase path without setting up a repo first.'],
    pickOpen: ['You want the repo to be the source of truth.', 'You want BYOK and a provider-neutral workflow.', 'You want a portable design system and artifacts beyond one hosted canvas.'],
    migrateTitle: 'Moving from Figma Make to Open Design',
    migrateLead: 'There is no automatic import today. Start with the source and references you already have:',
    migrateSteps: ['Export the React/TypeScript source or capture the frame.', 'Extract the brand into DESIGN.md.', 'Choose a skill and render the next state locally.', 'Commit the resulting files beside your code.'],
    migrateClosing: 'The first migration is manual; subsequent screens inherit the same brand without re-prompting every token.',
    faq: [
      { name: 'Does Open Design replace Figma Make?', text: 'Not literally. Figma Make wins at the Figma-native first mile; Open Design is the alternative when local ownership and an open pipeline are the priority.' },
      { name: 'Can I export from Figma Make?', text: 'Yes. Figma Make can export a React/TypeScript app or push it to a GitHub repository, though the hosted runtime and Supabase wiring remain part of the Figma workflow.' },
      { name: 'Does Open Design require a seat or account?', text: 'No. It is Apache-2.0 and local-first; you bring your own coding agent and model key.' },
      { name: 'Is this affiliated with Figma?', text: 'No. This is an independent comparison of two different workflows.' },
    ],
    ctaTitle: 'Own your output — from prompt to repo.',
    ctaBody: 'Keep Figma Make for the Figma-native prototype path. Bring Open Design in when the design system and the shipped files need to belong to you.',
  }),
  'genspark': makeAlternative({
    slug: 'genspark',
    competitor: 'Genspark AI Designer',
    title: 'Best Genspark AI Designer alternative for design — Open Design',
    description: 'Looking for a Genspark AI Designer alternative for product design? Open Design is an open-source, local-first design agent.',
    breadcrumb: 'Best Genspark AI Designer alternative',
    label: 'Alternative · Genspark AI Designer',
    heading: 'Best Genspark AI Designer alternative for design.',
    lead: 'Open Design is the open-source, local-first alternative to Genspark for product UI — your coding agent, your key, your files, and a portable design system you keep in your repo.',
    tldrBody: 'Genspark is excellent at one-shot marketing graphics. Open Design is for product UI, components, flows, and the code behind them — with output you keep as files.',
    heroCtaLead: 'Open Design is the open-source, local-first design layer for product UI, driven by the coding agent you already use.',
    intro: ['Genspark AI Designer turns one prompt into logos, posters, social graphics, packaging, menus, and brand systems. Open Design solves a different job: product UI, design systems, and code you own.', 'This comparison is candid about Genspark\'s marketing-graphics breadth and Open Design\'s repo-native product workflow.'],
    image: { src: '/alternatives/genspark/genspark-hero.webp', alt: 'Open Design vs Genspark — a prompt converging into a design hub you own' },
    sections: [
      { id: 'what-is-genspark', heading: 'What Genspark AI Designer is', blocks: [
        { kind: 'p', text: 'Genspark AI Designer is the visual-design product inside Genspark\'s all-in-one AI super-agent. A top-level agent decomposes a brief, routes it across specialist agents, and returns finished, on-brand graphic assets.' },
        { kind: 'p', text: 'Its strongest surface is marketing design: logos, posters, flyers, social graphics, packaging, menus, product ads, and complete brand systems. It can produce UI prototypes, but that is one slice of a broader visual-design product.' },
        { kind: 'image', src: '/alternatives/genspark/genspark-product.webp', alt: 'Genspark AI Designer — generates posters, logos and social graphics from a prompt' },
      ] },
      { id: 'why-switch', heading: 'Why teams look for a Genspark alternative', blocks: [
        { kind: 'p', text: 'Teams look elsewhere when the deliverable is product UI and they care about owning editable source, a repeatable design system, or the code behind the interface.' },
        { kind: 'steps', items: [
          { label: 'Product UI first', body: 'Design screens, flows, components, and the implementation behind them.' },
          { label: 'Own the source', body: 'Keep the output in your repository rather than in a hosted AI Drive.' },
          { label: 'No vendor credit meter', body: 'Bring your own coding agent and provider key.' },
        ] },
      ] },
      { id: 'local-byok', heading: 'Local-first + BYOK, explained', blocks: [
        { kind: 'p', text: 'Open Design writes product UI, components, and a portable DESIGN.md directly to your repo. They remain yours whether or not you keep using the tool.' },
        { kind: 'p', text: 'You supply the model through the coding agent you already use. API spend bills to your account at provider rates.' },
        { kind: 'image', src: '/alternatives/genspark/genspark-design-systems.webp', alt: 'Open Design design-system library — brands and tokens kept as files you own' },
      ] },
      { id: 'compare', heading: 'Open Design vs Genspark AI Designer, feature by feature', blocks: [{ kind: 'table', columns: ['Feature', 'Open Design', 'Genspark AI Designer'], rows: commonFeatures('Genspark AI Designer').map((row) => [row.name, row.od, row.cd]) }] },
      { id: 'who-picks', heading: 'Where Genspark genuinely wins — and which to pick', blocks: [{ kind: 'p', text: 'Genspark wins when the job is “I need an on-brand logo, poster, or launch graphic tonight.” Open Design wins when the job is “I need a product interface, a design system, and code that stays in my repo.” Keeping both is reasonable because the roles barely overlap.' }] },
      { id: 'migrate', heading: 'Moving from Genspark to Open Design', blocks: [{ kind: 'ol', items: ['Keep the graphics you want as visual references.', 'Ask your agent to extract the useful brand rules — color, type, spacing, and tone — into DESIGN.md.', 'Choose a product UI skill.', 'Render the first screen and commit the source files to your repo.'] }] },
    ],
    reasons: [
      { label: 'Editable product source.', body: 'Keep UI and code rather than flattened graphic exports.' },
      { label: 'Design-system continuity.', body: 'Use one portable DESIGN.md across screens and projects.' },
      { label: 'Separate the jobs.', body: 'Use a product workflow for product UI instead of a broad graphics generator.' },
    ],
    localByokTitle: 'Local-first + BYOK, explained',
    localByokBody: ['Open Design runs locally and puts product UI and DESIGN.md into your repository.', 'Your agent and model provider are yours; there is no hosted AI Drive or vendor credit meter in the design loop.'],
    features: commonFeatures('Genspark AI Designer'),
    whoTitle: 'Where Genspark genuinely wins — and which to pick',
    pickCompetitorTitle: 'Pick Genspark if',
    pickCompetitor: ['You need polished logos, posters, social graphics, or a launch kit from one prompt.', 'You prefer a hosted, zero-setup graphics workflow.'],
    pickOpen: ['You are designing product UI and the code behind it.', 'You need editable source and a version-controlled brand system.', 'You want to use your own coding agent and key.'],
    migrateTitle: 'Moving from Genspark to Open Design',
    migrateLead: 'There is no automatic import. Start with the brand assets you want to carry forward:',
    migrateSteps: ['Use the assets as visual references.', 'Extract the brand into DESIGN.md.', 'Render product UI with a selected skill.', 'Commit the resulting files to your repo.'],
    migrateClosing: 'Keep Genspark for marketing graphics if it fits; use Open Design for the product surface and source you own.',
    faq: [
      { name: 'What is Genspark best at?', text: 'Graphic and marketing design: logos, posters, flyers, social graphics, packaging, and brand systems. Open Design is built specifically for product UI and the code behind it.' },
      { name: 'Does Open Design have a credit meter?', text: 'No. Open Design is free and open source; you bring your own agent key and pay the provider directly.' },
      { name: 'Are Genspark assets editable source files?', text: 'The hosted workflow primarily returns exported graphic assets. Open Design writes UI and code as files in your own repository.' },
      { name: 'Are the projects affiliated?', text: 'No. Open Design is independent of Genspark and Mainfunc.' },
    ],
    ctaTitle: 'Design product UI as files you own.',
    ctaBody: 'Keep Genspark for the logo and launch poster. Bring Open Design in for product UI, the design system, and the code behind it.',
  }),
  'pencil-dev': makeAlternative({
    slug: 'pencil-dev',
    competitor: 'Pencil.dev',
    title: 'Best Pencil.dev alternative for design — Open Design',
    description: 'Pencil.dev is an agent-driven design canvas that stores .pen files in your repo. Open Design is the fully open-source, local-first alternative.',
    breadcrumb: 'Best Pencil.dev alternative',
    label: 'Alternative · Pencil.dev',
    heading: 'Best Pencil.dev alternative for design.',
    lead: 'Open Design is the fully open-source, local-first alternative to Pencil — an agent-native design workspace driven by the coding agent you already use, your key, your files, and a portable design system.',
    tldrBody: 'Pencil has the stronger hands-on vector canvas and native Figma paste. Open Design owns the whole tool under Apache-2.0, supports provider-neutral BYOK, and spans UI, decks, prototypes, and portable design systems.',
    heroCtaLead: 'Open Design is the fully open-source design layer around your existing coding agent — not just an open file format.',
    intro: ['Pencil puts an agent-driven, Figma-like vector canvas inside the IDE and keeps .pen JSON files in the repo. Open Design is unusually close in spirit, but the ownership contract is different: the whole app is Apache-2.0 and the workflow is provider-neutral BYOK.', 'This page gives Pencil credit for the canvas it does well, then explains where an open, repo-native design workflow is the better fit.'],
    image: { src: '/alternatives/pencil-dev/pencil-dev-hero.webp', alt: 'Open Design vs Pencil.dev — a prompt converging into a design hub you own' },
    sections: [
      { id: 'what-is-pencil', heading: 'What Pencil is', blocks: [
        { kind: 'p', text: 'Pencil is an agent-driven design tool from a16z Speedrun. It puts an infinite vector canvas inside the IDE, stores .pen JSON in the repo, and exposes a local MCP server so coding agents can read and write the design.' },
        { kind: 'p', text: 'The surface is polished: layers, a properties inspector, drag-and-drop components, prompt blocks, native Figma copy-paste with auto-layout, and built-in UI kits such as Shadcn, Lunaris, Halo, and Nitro.' },
        { kind: 'image', src: '/alternatives/pencil-dev/pencil-dev-product.webp', alt: 'Pencil.dev — an IDE-native vector canvas with agent support' },
      ] },
      { id: 'why-switch', heading: 'Why teams look for a Pencil alternative', blocks: [
        { kind: 'p', text: 'Pencil is a strong fit for developers who design. The reasons to look elsewhere cluster around what happens after early access: the app is closed-source, the experience is tuned first for Claude, and the free period is not the long-term ownership model.' },
        { kind: 'steps', items: [
          { label: 'Open the whole tool', body: 'Apache-2.0 covers the application, renderer, skills, and design-system library — not just the file format.' },
          { label: 'Stay provider-neutral', body: 'Use Claude, Codex, Cursor, Gemini, OpenCode, or Qwen with your own key.' },
          { label: 'Work beyond a canvas', body: 'Produce UI, decks, prototypes, and DESIGN.md systems as files.' },
        ] },
      ] },
      { id: 'local-byok', heading: 'Open source + BYOK, explained', blocks: [
        { kind: 'p', text: 'Both tools keep design as files in the repo. Open Design goes further: the entire application is Apache-2.0, so it can be audited, forked, and self-hosted.' },
        { kind: 'p', text: 'Credentials stay in local configuration or environment variables. Open Design does not proxy them, and model spend bills directly to your provider.' },
        { kind: 'image', src: '/alternatives/pencil-dev/pencil-dev-design-systems.webp', alt: 'Open Design design-system library — brands and tokens kept as files you own' },
      ] },
      { id: 'compare', heading: 'Open Design vs Pencil, feature by feature', blocks: [{ kind: 'table', columns: ['Feature', 'Open Design', 'Pencil.dev'], rows: [
        ['License', 'Apache-2.0 — the whole app is open source', 'Closed-source app; .pen format documented'],
        ['Primary surface', 'Agent-driven workflow + web preview', 'IDE-native Figma-like vector canvas'],
        ['Model choice', 'Provider-neutral BYOK', 'Several agents via MCP; optimized first for Claude'],
        ['Design files', 'DESIGN.md plus generated artifacts', '.pen JSON files in Git'],
        ['Output', 'UI, landing pages, decks, prototypes, systems', 'UI screens and components to code'],
        ['Figma import', 'Agent-assisted reference extraction', 'Native paste with layers and auto-layout'],
      ] }] },
      { id: 'who-picks', heading: 'Where Pencil genuinely wins — and which to pick', blocks: [{ kind: 'p', text: 'Pencil wins on the hands-on canvas: direct vector editing, native Figma paste, and built-in UI kits inside the IDE. Open Design wins on ownership and range: the whole app is open source, BYOK is provider-neutral, and the output is a broader set of files you keep.' }] },
      { id: 'migrate', heading: 'Moving a design from Pencil into Open Design', blocks: [{ kind: 'ol', items: ['Keep the .pen file and export or screenshot the states you want to preserve.', 'Ask your agent to extract colors, type, spacing, and components into DESIGN.md.', 'Choose an Open Design skill and render the same brand.', 'Commit the UI, code, and design system under version control.'] }] },
    ],
    reasons: [
      { label: 'Own more than the format.', body: 'Open Design makes the entire application and library available under Apache-2.0.' },
      { label: 'Bring any agent.', body: 'Provider-neutral BYOK avoids a Claude-first workflow.' },
      { label: 'Expand the output.', body: 'Use the same brand for UI, decks, prototypes, and systems.' },
    ],
    localByokTitle: 'Open source + BYOK, explained',
    localByokBody: ['Both tools are local-first and keep design in the repo. Open Design also makes the complete app and renderer open source.', 'Use your own coding agent and key; credentials stay local and provider spend bills directly to you.'],
    features: commonFeatures('Pencil.dev'),
    whoTitle: 'Where Pencil genuinely wins — and which to pick',
    pickCompetitorTitle: 'Pick Pencil if',
    pickCompetitor: ['You want a polished, Figma-like vector canvas inside your IDE.', 'Native Figma paste, layers, auto-layout, and built-in UI kits are central to the job.'],
    pickOpen: ['You want the whole tool to be open source and self-hostable.', 'You want provider-neutral BYOK across several coding agents.', 'You want a broader artifact workflow than UI-to-code alone.'],
    migrateTitle: 'Moving a design from Pencil into Open Design',
    migrateLead: 'Because both tools keep design as files, the move is design-first rather than a lossy cloud export:',
    migrateSteps: ['Preserve the .pen file and references.', 'Extract the brand into DESIGN.md.', 'Render with an Open Design skill.', 'Commit the resulting files under version control.'],
    migrateClosing: 'The brand becomes portable even if you stop using either design surface.',
    faq: [
      { name: 'Is Pencil open source?', text: 'The app is not. Pencil documents its .pen file format, but the application is closed-source. Open Design is fully open source under Apache-2.0.' },
      { name: 'Is Pencil free?', text: 'It is free today during early access, but that is not the same as a permanent open-source pricing contract.' },
      { name: 'Which is better for a hands-on canvas?', text: 'Pencil. Its direct vector canvas and native Figma paste are stronger than Open Design\'s agent-first flow today.' },
      { name: 'Are the projects affiliated?', text: 'No. Open Design is independent of Pencil.dev and its backers.' },
    ],
    ctaTitle: 'Own the whole tool, not just the file format.',
    ctaBody: 'Choose Pencil for the canvas. Choose Open Design when the application, agent, and design system all need to remain yours.',
  }),
  'qoder': makeAlternative({
    slug: 'qoder',
    competitor: 'QoderWork Design',
    title: 'Best QoderWork Design alternative for design — Open Design',
    description: 'QoderWork Design is a polished design-as-code canvas. Open Design is the Apache-2.0, local-first, BYOK alternative with repo-native output.',
    breadcrumb: 'Best QoderWork Design alternative',
    label: 'Alternative · QoderWork Design',
    heading: 'Best QoderWork Design alternative for design.',
    lead: 'Open Design is the open-source, local-first alternative to QoderWork Design — the same design-as-code idea, but Apache-2.0, BYOK with your own coding agent, and output that lives in your repo.',
    tldrBody: 'Qoder is one of the closest peers: its Questions → Design Plan → Nudge loop and interactive canvas are genuinely polished. Open Design trades that integrated canvas for open source, your own agent, and repo-native ownership.',
    heroCtaLead: 'Open Design is the open-source design layer around the coding agent you already use — no closed canvas or vendor model required.',
    intro: ['QoderWork Design turns a prompt into runnable HTML or React on an infinite canvas, asks clarifying Questions, previews a Design Plan, and exposes Nudge controls for color, spacing, and radius.', 'The honest difference is everything around generation: Qoder is a closed, credit-metered product at its best inside Qoder IDE; Open Design is Apache-2.0, local-first, and BYOK.'],
    image: { src: '/alternatives/qoder/qoder-hero.webp', alt: 'Open Design vs Qoder — a prompt converging into a design hub you own' },
    sections: [
      { id: 'what-is-qoder', heading: 'What QoderWork Design is', blocks: [
        { kind: 'p', text: 'QoderWork Design is an AI-native design-as-code workbench from Alibaba\'s Qoder team. It treats design as runnable code: designers and engineers operate on the same output and can hand it to Qoder IDE without a lossy export.' },
        { kind: 'steps', items: [
          { label: 'Questions', body: 'Clarify intent before generation instead of guessing from an underspecified prompt.' },
          { label: 'Design Plan', body: 'Preview layout, style, and content hierarchy before pixels are produced.' },
          { label: 'Nudge', body: 'Tune color, spacing, and radius after generation without re-describing the whole screen.' },
        ] },
        { kind: 'image', src: '/alternatives/qoder/qoder-product.webp', alt: 'QoderWork Design — design-as-code on an interactive canvas' },
      ] },
      { id: 'why-switch', heading: 'Why teams look for a Qoder alternative', blocks: [
        { kind: 'p', text: 'Qoder is strong at its core job, so the reasons to look elsewhere are about ownership and freedom rather than basic output quality.' },
        { kind: 'steps', items: [
          { label: 'Open source', body: 'Read, fork, audit, and self-host the complete design workflow.' },
          { label: 'Use your own agent', body: 'Choose the model and coding agent instead of a vendor-selected runtime.' },
          { label: 'Make the repo the surface', body: 'Keep source in the repository rather than treating local files as a downstream sync target.' },
        ] },
      ] },
      { id: 'local-byok', heading: 'Local-first + BYOK, explained', blocks: [
        { kind: 'p', text: 'In Open Design, the repo is the product: source, artifacts, and DESIGN.md are versioned, reviewable, and usable even if you stop using the tool.' },
        { kind: 'p', text: 'BYOK means no model is bundled and no inference is proxied. Point Open Design at Claude Code, Codex, Cursor, Gemini, OpenCode, or Qwen with your own key.' },
        { kind: 'image', src: '/alternatives/qoder/qoder-design-systems.webp', alt: 'Open Design design-system library — brands and tokens kept as files you own' },
      ] },
      { id: 'compare', heading: 'Open Design vs QoderWork Design, feature by feature', blocks: [{ kind: 'table', columns: ['Feature', 'Open Design', 'QoderWork Design'], rows: [
        ['Primary surface', 'Repo-native files + agent-driven preview', 'Interactive hosted canvas'],
        ['License', 'Apache-2.0, full source', 'Closed-source product'],
        ['Model', 'BYOK with your chosen coding agent', 'Qoder models behind credits'],
        ['Pre-generation loop', 'Prompt, skill, design system, references', 'Questions → Design Plan'],
        ['Post-generation loop', 'Edit files and re-render', 'Nudge live parameters and canvas regions'],
        ['IDE handoff', 'Any editor, CI, or review process', 'Best inside Qoder IDE'],
      ] }] },
      { id: 'who-picks', heading: 'Which should you pick', blocks: [{ kind: 'p', text: 'Qoder wins if a polished interactive canvas and one-click Qoder IDE handoff are the center of the job. Open Design wins if the source of truth must be open, portable, and driven by the agent and model you already use.' }] },
      { id: 'migrate', heading: 'Moving from QoderWork Design to Open Design', blocks: [{ kind: 'ol', items: ['Export or copy the runnable HTML/React source.', 'Bring the source and screenshots into your repository.', 'Extract the brand into DESIGN.md.', 'Continue the design loop with your existing coding agent.'] }] },
    ],
    reasons: [
      { label: 'Own the source.', body: 'Make the repository the primary surface rather than a sync target.' },
      { label: 'Choose the model.', body: 'Use BYOK with the agent and provider you already trust.' },
      { label: 'Avoid vendor lock-in.', body: 'Keep the workflow usable in any editor, CI, or review process.' },
    ],
    localByokTitle: 'Local-first + BYOK, explained',
    localByokBody: ['Open Design stores source and DESIGN.md in the repo and treats those files as the product.', 'Bring your own agent and key; there are no Qoder credits or vendor-selected models in the loop.'],
    features: commonFeatures('QoderWork Design'),
    whoTitle: 'Which should you pick',
    pickCompetitorTitle: 'Pick QoderWork Design if',
    pickCompetitor: ['You want the strongest interactive canvas and live Nudge controls.', 'Your team already lives in Qoder IDE and values one-click handoff.'],
    pickOpen: ['You want Apache-2.0 source and a self-hostable workflow.', 'You want BYOK and no IDE or model lock-in.', 'You want the repo itself to remain the source of truth.'],
    migrateTitle: 'Moving from QoderWork Design to Open Design',
    migrateLead: 'Both tools speak runnable code, so the move does not require redrawing the design:',
    migrateSteps: ['Export the runnable source.', 'Extract the brand into DESIGN.md.', 'Render with your chosen skill and agent.', 'Commit the result in the repo.'],
    migrateClosing: 'The files remain usable in any editor and can enter your existing review and deployment process.',
    faq: [
      { name: 'Are Qoder and Open Design direct competitors?', text: 'They are close peers in prompt-to-runnable UI. The main difference is the surrounding contract: Qoder is closed and vendor-led; Open Design is open, local-first, and BYOK.' },
      { name: 'Is Open Design open source?', text: 'Yes. The app, renderer, skills, and design-system library are available under Apache-2.0.' },
      { name: 'Can Qoder projects be used locally?', text: 'Qoder can pin a project to a local folder and hand it to Qoder IDE, but the main surface remains its hosted canvas.' },
      { name: 'Are the projects affiliated?', text: 'No. Open Design is independent of Qoder and Alibaba.' },
    ],
    ctaTitle: 'Own the design-as-code pipeline.',
    ctaBody: 'Choose the polished canvas when that is the priority. Choose Open Design when the agent, source, and design system need to remain yours.',
  }),
  'stitch': makeAlternative({
    slug: 'stitch',
    competitor: 'Google Stitch',
    title: 'Best Google Stitch alternative for design — Open Design',
    description: 'Google Stitch is a fast, free, cloud UI generator. Open Design is the open-source, local-first, BYOK alternative with a design system you own.',
    breadcrumb: 'Best Google Stitch alternative',
    label: 'Alternative · Google Stitch',
    heading: 'Best Google Stitch alternative for design.',
    lead: 'Open Design is the open-source, local-first alternative to Google Stitch — prompt-to-UI with the coding agent you already use, your key, your files, and a portable design system in your repo.',
    tldrBody: 'Stitch is hard to beat for a free, zero-setup first draft and Figma paste. Open Design is for work that must outlive the draft: open source, local files, BYOK, and a design system that remains in your codebase.',
    heroCtaLead: 'Open Design keeps prompt-to-UI local and makes the source, brand system, and output portable files you own.',
    intro: ['Google Stitch turns a prompt, screenshot, sketch, or voice description into high-fidelity UI on a hosted Gemini canvas. Open Design offers the same prompt-to-UI entry point with a different ownership model.', 'This page credits Stitch\'s speed and Figma handoff, then explains why teams move when caps, account gating, and missing local design systems become the constraint.'],
    image: { src: '/alternatives/stitch/stitch-hero.webp', alt: 'Open Design vs Google Stitch — a prompt converging into a design hub you own' },
    sections: [
      { id: 'what-is-stitch', heading: 'What Google Stitch is', blocks: [
        { kind: 'p', text: 'Google Stitch is a Google Labs design tool that turns natural-language prompts or uploaded images into web or mobile UI, with Gemini doing the design work inside a browser canvas.' },
        { kind: 'p', text: 'It can export HTML/CSS and React and supports paste into Figma with auto-layout, named layers, and editable text. The trade-offs are cloud-only execution, a Google account, a monthly generation cap, and no BYOK or self-host mode.' },
        { kind: 'image', src: '/alternatives/stitch/stitch-product.webp', alt: 'Google Stitch — describe a UI and Gemini generates it in a hosted canvas' },
      ] },
      { id: 'why-switch', heading: 'Why teams look for a Google Stitch alternative', blocks: [
        { kind: 'p', text: 'Stitch is excellent at a fast first screen. The friction starts when the team iterates hard, needs brand consistency, or wants the design to live inside the codebase rather than in a hosted Labs experiment.' },
        { kind: 'steps', items: [
          { label: 'No monthly cap', body: 'Keep going with your own provider spend instead of an app-level generation pool.' },
          { label: 'No vendor sign-in', body: 'Run the local workflow without a Google account gating the project.' },
          { label: 'Enforce the brand', body: 'Use DESIGN.md rather than re-prompting colors and spacing every session.' },
        ] },
      ] },
      { id: 'local-byok', heading: 'Local-first + BYOK, explained', blocks: [
        { kind: 'p', text: 'Open Design runs a desktop app, local daemon, and Markdown skill and design-system catalogs on your machine. The brand is a portable DESIGN.md file every skill respects.' },
        { kind: 'p', text: 'You bring your own agent key. Credentials stay in local configuration or environment variables, and API spend bills directly to you.' },
        { kind: 'image', src: '/alternatives/stitch/stitch-design-systems.webp', alt: 'Open Design design-system library — brands and tokens kept as files you own' },
      ] },
      { id: 'compare', heading: 'Open Design vs Google Stitch, feature by feature', blocks: [{ kind: 'table', columns: ['Feature', 'Open Design', 'Google Stitch'], rows: [
        ['Runtime', 'Local-first and self-hostable', 'Cloud-only Google Labs product'],
        ['Account', 'No product account required', 'Google account required'],
        ['Model', 'BYOK with your chosen agent', 'Gemini-powered vendor service'],
        ['Output', 'Files in your repo: UI, code, decks, systems', 'HTML/CSS, React, and Figma paste'],
        ['Design system', 'Portable DESIGN.md', 'No enforceable repo-native system'],
        ['Generation limits', 'Provider usage only', 'App-level monthly cap'],
      ] }] },
      { id: 'who-picks', heading: 'Where Google Stitch genuinely wins — and which to pick', blocks: [{ kind: 'p', text: 'Stitch wins on zero-setup speed, a free Gemini-backed first draft, and clean Figma paste. Open Design wins when the work must outlive that first draft and stay in your codebase with no vendor cap.' }] },
      { id: 'migrate', heading: 'Moving a design from Google Stitch into Open Design', blocks: [{ kind: 'ol', items: ['Export the HTML/CSS or React and keep the screenshots you like.', 'Ask your agent to extract the brand into DESIGN.md.', 'Choose a skill and render the next state locally.', 'Commit the source and design system under version control.'] }] },
    ],
    reasons: [
      { label: 'Keep iterating.', body: 'Avoid an app-level cap when a design needs many passes.' },
      { label: 'Keep the source local.', body: 'Make the repository the home of the output.' },
      { label: 'Keep the brand consistent.', body: 'Use DESIGN.md instead of repeating visual instructions.' },
    ],
    localByokTitle: 'Local-first + BYOK, explained',
    localByokBody: ['Open Design runs locally and keeps the brand and artifacts in your repo.', 'Use your own coding agent and key; there is no Google account or app-level generation pool in the workflow.'],
    features: commonFeatures('Google Stitch'),
    whoTitle: 'Where Google Stitch genuinely wins — and which to pick',
    pickCompetitorTitle: 'Pick Google Stitch if',
    pickCompetitor: ['You need a polished first concept in minutes with zero setup.', 'Figma paste and a free Gemini-backed canvas are the main deliverables.'],
    pickOpen: ['You need local files and a portable design system.', 'You want BYOK, no app-level cap, and an open-source workflow.', 'You want the output to live in your repo from the first render.'],
    migrateTitle: 'Moving a design from Google Stitch into Open Design',
    migrateLead: 'There is no automatic import today. Start from the exported code and references:',
    migrateSteps: ['Export HTML/CSS or React.', 'Extract the brand into DESIGN.md.', 'Render the next state with a skill.', 'Commit the files to your repository.'],
    migrateClosing: 'From then on, each skill renders in your brand without re-prompting every hex value.',
    faq: [
      { name: 'Is Google Stitch free?', text: 'It is a free Google Labs product, but it is account-bound, cloud-only, and subject to a generation cap that can change.' },
      { name: 'Can Stitch run locally?', text: 'No. Stitch is a hosted Google service; Open Design is the local-first alternative.' },
      { name: 'Does Stitch export code?', text: 'Yes. It can export HTML/CSS and React and supports paste into Figma. Open Design writes source directly into your repo.' },
      { name: 'Are the projects affiliated?', text: 'No. Open Design is independent of Google Stitch.' },
    ],
    ctaTitle: 'Own your design, in three commands.',
    ctaBody: 'Use Stitch for a fast first draft. Use Open Design when the source, system, and next fifty renders need to remain yours.',
  }),
  'trae': makeAlternative({
    slug: 'trae',
    competitor: 'Trae',
    title: 'Best Trae alternative for design — Open Design',
    description: 'Trae is a VS Code-based AI IDE with design-to-code. Open Design is the open-source, local-first, design-first layer for the system behind the code.',
    breadcrumb: 'Best Trae alternative for design',
    label: 'Alternative · Trae',
    heading: 'Best Trae alternative for design.',
    lead: 'Open Design is the open-source, local-first, design-first alternative to Trae — it owns your design system as portable files, runs on your own coding agent, and pairs with the IDE you already use.',
    tldrBody: 'Trae is the better complete AI IDE and full-stack builder. Open Design is the design layer: it owns DESIGN.md, supports provider-neutral BYOK, and keeps design artifacts in your repo. The two are complementary, not substitutes.',
    heroCtaLead: 'Open Design owns the design system and lets an IDE like Trae consume the same portable files.',
    intro: ['Trae is a ByteDance AI-native IDE with multimodal chat, screenshot and Figma-to-code, and an agentic builder. The center of gravity is writing and shipping code.', 'Open Design starts from the other end: a design-first agent whose job is to establish a system, keep it consistent, and produce artifacts you own.'],
    image: { src: '/alternatives/trae/trae-hero.webp', alt: 'Open Design vs Trae — a prompt converging into a design hub you own' },
    sections: [
      { id: 'what-is-trae', heading: 'What Trae is', blocks: [
        { kind: 'p', text: 'Trae is an AI-native IDE from ByteDance, forked from the VS Code core. It keeps the familiar editor and extension model while adding multimodal chat, design-to-code from screenshots or Figma, and an agentic builder.' },
        { kind: 'p', text: 'Its design capabilities are features inside a complete coding environment. Open Design is a complementary design layer: it makes the system itself portable and lets Trae or another IDE consume the resulting files.' },
        { kind: 'image', src: '/alternatives/trae/trae-product.webp', alt: 'Trae — ByteDance AI-native IDE with design-to-code' },
      ] },
      { id: 'why-switch', heading: 'Why teams look for a Trae alternative for design', blocks: [
        { kind: 'p', text: 'Teams look for an alternative when the real problem is the design system, not the code editor.' },
        { kind: 'steps', items: [
          { label: 'Design-first, not IDE-first', body: 'Make tokens, components, and consistency the primary work.' },
          { label: 'Own the system', body: 'Keep DESIGN.md and artifacts beside the code and review them in Git.' },
          { label: 'Pair tools cleanly', body: 'Let Trae write and ship code while Open Design owns the system code consumes.' },
        ] },
      ] },
      { id: 'local-byok', heading: 'Local-first + BYOK, explained', blocks: [
        { kind: 'p', text: 'Open Design produces a portable DESIGN.md plus design artifacts directly in the repository. They remain usable even if you stop using the tool.' },
        { kind: 'p', text: 'Open Design does not lock you to bundled models. Bring Claude Code, Codex, Cursor, Gemini, OpenCode, or Qwen with your own key and use the same system alongside Trae.' },
        { kind: 'image', src: '/alternatives/trae/trae-design-systems.webp', alt: 'Open Design design-system library — brands and tokens kept as files you own' },
      ] },
      { id: 'compare', heading: 'Open Design vs Trae, feature by feature', blocks: [{ kind: 'table', columns: ['Feature', 'Open Design', 'Trae'], rows: [
        ['Primary job', 'Design system, artifacts, and design workflow', 'AI coding IDE and full-stack builder'],
        ['Runtime', 'Local-first design layer', 'Desktop/web IDE product'],
        ['Model choice', 'BYOK with your own agent and key', 'Bundled model selection in product'],
        ['Design-to-code', 'Design system and artifacts as files', 'Screenshot/Figma → React/Tailwind'],
        ['Output ownership', 'DESIGN.md and source in your repo', 'Code written into the IDE project'],
        ['Best relationship', 'Design layer for any IDE', 'IDE that can consume the files'],
      ] }] },
      { id: 'who-picks', heading: 'Which should you pick', blocks: [{ kind: 'p', text: 'Pick Trae if you need a complete AI IDE, design-to-code, refactoring, and end-to-end full-stack generation. Pick Open Design if the missing layer is a portable design system and a workflow that survives IDE and model changes. Many teams should use both.' }] },
      { id: 'migrate', heading: 'Using Trae and Open Design together', blocks: [{ kind: 'ol', items: ['Use Open Design to establish or update DESIGN.md.', 'Point Trae at the same repository and let it implement or ship the UI.', 'Render and review against the system.', 'Commit design-system changes so both tools consume the same source of truth.'] }] },
    ],
    reasons: [
      { label: 'Own the design system.', body: 'Keep DESIGN.md as a portable source of truth.' },
      { label: 'Separate the layers.', body: 'Use a design-first workflow alongside the IDE that writes and ships code.' },
      { label: 'Avoid model lock-in.', body: 'Bring the agent and provider you already trust.' },
    ],
    localByokTitle: 'Local-first + BYOK, explained',
    localByokBody: ['Open Design produces DESIGN.md and artifacts in the repo so they can be consumed by Trae, VS Code, CI, or another IDE.', 'Use your own agent and key; the design layer is not tied to Trae\'s bundled model choices.'],
    features: commonFeatures('Trae'),
    whoTitle: 'Which should you pick',
    pickCompetitorTitle: 'Pick Trae if',
    pickCompetitor: ['You want a complete AI IDE that writes, refactors, and ships code.', 'Screenshot/Figma-to-React and full-stack generation are central to the job.'],
    pickOpen: ['You need a design system that survives IDE changes.', 'You want a provider-neutral, open-source design layer.', 'You want to use Trae and other agents against the same DESIGN.md.'],
    migrateTitle: 'Using Trae and Open Design together',
    migrateLead: 'There is no migration problem when both tools share a repository:',
    migrateSteps: ['Establish DESIGN.md with Open Design.', 'Let Trae implement and ship the UI.', 'Review the result against the system.', 'Commit system changes for both tools to consume.'],
    migrateClosing: 'Trae owns the coding layer; Open Design owns the portable design layer. They work better together than as a forced either/or choice.',
    faq: [
      { name: 'Is Open Design a replacement for Trae?', text: 'Not for the complete IDE job. Trae is stronger at coding and full-stack generation; Open Design is the design-first layer for the system and artifacts behind that code.' },
      { name: 'Can Trae and Open Design be used together?', text: 'Yes. Open Design writes files in the repository, so Trae can consume DESIGN.md and implement the resulting UI.' },
      { name: 'Does Open Design bundle models?', text: 'No. It uses BYOK with the coding agent and provider you choose.' },
      { name: 'Are the projects affiliated?', text: 'No. Open Design is independent of Trae and ByteDance.' },
    ],
    ctaTitle: 'Own your design system, on your own terms.',
    ctaBody: 'Keep Trae for the IDE. Add Open Design when the design system itself needs to be portable, open, and owned by your team.',
  }),
};
