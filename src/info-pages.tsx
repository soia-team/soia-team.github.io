/*
 * Source-aligned standalone information pages.
 *
 * These pages close the links that the Open Design footer exposes directly:
 * community, FAQ, privacy and terms.  The copy and the page rhythm follow
 * the corresponding Astro source in the Open Design project; the React port
 * keeps the content explicit instead of routing these URLs through NotFound.
 */
import { getHomeFaq, type LandingLocaleCode } from './upstream/app/i18n';
import { getInfoPageCopy } from './upstream/app/info-page-i18n';
import { COMMUNITY_LINKS, getCommunityCopy, GLYPH } from './upstream/app/community-i18n';
import { hrefFor, REPO, SubpageLayout } from './shell';

const COMMUNITY_CARD = '/community/contributor-card.png';

const COMMUNITY_COPY = {
  en: {
    title: 'Community — Open Design',
    lead: 'Open Design is built by people, in public. Skills, DESIGN.md systems, plugins, docs: every commit is a brushstroke. Pick a door below, find your room.',
    heading: 'Open design <em>takes shape</em><br/>when you ship it.',
    cards: [
      ['I', 'Contributors', 'The hands that <em>ship</em> the work.', 'Maintainers, weekly leaderboards, the all-time roll, and open issues you can claim today.'],
      ['II', 'Ambassadors', "Open Design's <em>voice</em> in your city.", 'Open a local atelier. Convene meetups, demos and critiques with a direct line to the core team.'],
      ['III', 'Moderators', 'The room where <em>contributors</em> hang out.', 'Meet the stewards keeping Discord warm while the community ships plugins, docs and systems.'],
    ],
    meta: ['Auto-minted on first merge', 'PNG · shared on X'],
    cardAlt: 'Open Design contributor honor card',
    cta: '加入 Discord ↗',
  },
  zh: {
    title: '社区 — Open Design',
    lead: 'Open Design 由人构建，在公开场合完成。Skills、DESIGN.md 系统、插件、文档：每一次提交都是一笔。选下面的一扇门，找到属于你的房间。',
    heading: '开放的设计，<em>在你交付时</em><br/>才真正成形。',
    cards: [
      ['I', '贡献者', '<em>交付</em>作品的那双手。', '维护者、每周榜单、历史总榜，以及你今天就能认领的开放 issue。'],
      ['II', '大使', 'Open Design 在你城市里的<em>声音</em>。', '开设一间本地工坊，召集聚会、演示、深夜评图，并与核心团队保持连接。'],
      ['III', '版主', '<em>贡献者</em>聚在一起的那间屋子。', '认识让 Discord 始终温暖的守护者，一起交付作品、开放插件、解决卡点。'],
    ],
    meta: ['首次合并时自动铸造', 'PNG · 分享到 X'],
    cardAlt: 'Open Design 贡献者荣誉卡',
    cta: '加入 Discord ↗',
  },
} as const;

const LEGAL_COPY = {
  privacy: {
    en: { title: 'Privacy Policy', updated: 'Last updated: July 6, 2026' },
    zh: { title: '隐私政策', updated: '最后更新：2026 年 7 月 6 日' },
  },
  terms: {
    en: { title: 'Terms of Service', updated: 'Last updated: July 6, 2026' },
    zh: { title: '服务条款', updated: '最后更新：2026 年 7 月 6 日' },
  },
} as const;

type LegalSection = { heading: string; paragraphs: string[]; bullets?: string[] };

const PRIVACY: Record<'en' | 'zh', LegalSection[]> = {
  en: [
    { heading: '1. Open Design is local-first', paragraphs: ['The Open Design desktop application runs on your own machine. Your projects, prompts, designs, and local BYOK keys stay on your device and are sent directly to the model providers you configure. Open Design Cloud is different: hosted accounts, model calls, usage metering and billing require the information needed to provide and secure those services.'] },
    { heading: '2. Information the website collects', paragraphs: ['When you visit open-design.ai we collect limited, standard analytics to understand traffic and improve the site. We do not sell your personal information.'], bullets: ['Usage analytics — pages viewed, referrer, approximate location, device and browser type.', 'Cookies and local storage — used for analytics and to remember preferences such as language.'] },
    { heading: '3. Information Open Design Cloud collects', paragraphs: ['When you register or sign in, we collect account and authentication information such as name, email, password hash, verification records, sessions and basic profile information returned by third-party login providers. We do not receive your Google or GitHub password.', 'Hosted model requests are transmitted to the upstream model or infrastructure provider that processes the request. Open Design does not intentionally use request content to train its own models.'] },
    { heading: '4. How we use information', paragraphs: ['We use information to create accounts, secure access, issue API keys, authorize CLI access, process wallet and billing activity, route requests, provide support, debug failures, improve the product and meet legal, tax and security obligations.', 'With your consent, we may send product updates. Contact privacy@open-design.ai to opt out of marketing messages.'] },
    { heading: '5. Third-party services and sharing', paragraphs: ['The website and Cloud services may use analytics, hosting, infrastructure, database, email, security, payment, login and model providers. We do not sell personal information or share it for cross-context behavioral advertising. We may disclose information where required for legal compliance, security incidents, disputes, mergers or asset transfers.'] },
    { heading: '6. Cookies, local storage and security checks', paragraphs: ['Open Design uses necessary cookies, session tokens and local storage to maintain login state, remember language preferences and protect the service. Cloudflare Turnstile may process device, network and interaction signals to distinguish normal users from automated access.'] },
    { heading: '7. Data retention and security', paragraphs: ['Account information is retained while an account remains active. After closure, non-essential information will be deleted or anonymized within a reasonable period. Recharge, payment, invoice, usage, fraud prevention and audit records may be retained for legal and security needs. No method of transmission or storage is completely secure.'] },
    { heading: '8. Your choices and rights', paragraphs: ['Depending on your location, you may have the right to access, correct or delete personal data, and to object to or restrict processing. Contact us to exercise these rights; we may verify your identity before acting.'] },
    { heading: '9. International processing', paragraphs: ['Open Design uses global cloud, payment, login, security and model services, so information may be processed outside your country or region. We follow applicable cross-border transfer requirements.'] },
    { heading: '10. Minors', paragraphs: ['The website and local application are not directed to children under 13. Open Design Cloud is not intended for users under 18 without guardian consent.'] },
    { heading: '11. Changes', paragraphs: ['We may update this policy from time to time. Material changes will be reflected by the Last updated date above.'] },
    { heading: '12. Contact', paragraphs: ['For privacy-related inquiries, contact privacy@open-design.ai or dpo@open-design.ai. For product and community questions, use the Open Design GitHub repository or Discord.'] },
  ],
  zh: [
    { heading: '1. Open Design 采用本地优先', paragraphs: ['Open Design 桌面应用运行在你自己的机器上。项目、提示词、设计、生成物以及本地 BYOK 密钥保留在你的设备中，并直接发送给你配置的模型供应商。Open Design Cloud 不同：云端账号、模型调用、用量统计和计费会处理提供与保护托管服务所必需的信息。'] },
    { heading: '2. 网站收集的信息', paragraphs: ['访问 open-design.ai 时，我们只收集用于理解流量和改进网站的基础分析信息。我们不会出售你的个人信息。'], bullets: ['使用分析——浏览页面、来源、约略位置、设备与浏览器类型。', 'Cookie / 本地存储——用于分析和记住语言等偏好。'] },
    { heading: '3. Open Design Cloud 收集的信息', paragraphs: ['注册或登录时，我们会收集姓名、邮箱、密码哈希、验证记录、会话及第三方登录返回的基本资料，但不会收到你的 Google 或 GitHub 密码。', '通过 Cloud 发送的模型请求会传给负责处理请求的上游模型或基础设施供应商。Open Design 不会有意使用请求内容训练自己的模型。'] },
    { heading: '4. 我们如何使用信息', paragraphs: ['我们使用信息创建账号、保护访问、签发 API 密钥、授权 CLI、处理钱包和账单、路由请求、提供支持、排查故障、改进产品，并履行法律、税务和安全义务。', '在获得同意后，我们可能发送产品更新。你可以通过 privacy@open-design.ai 退订营销信息。'] },
    { heading: '5. 第三方服务与共享', paragraphs: ['网站和 Cloud 服务可能使用分析、托管、基础设施、数据库、邮件、安全、支付、登录和模型供应商。我们不会出售个人信息，也不会用于跨场景行为广告；法律合规、安全事件、争议、合并或资产转让时可能披露必要信息。'] },
    { heading: '6. Cookie、本地存储与安全校验', paragraphs: ['Open Design 使用必要的 Cookie、会话令牌和本地存储来保持登录、记住语言偏好并保护服务。Cloudflare Turnstile 可能处理设备、网络和交互信号，以区分正常用户和自动化访问。'] },
    { heading: '7. 数据保留与安全', paragraphs: ['账号信息会在账号有效期间保留。账号关闭后，非必要信息会在合理期限内删除或匿名化；充值、支付、发票、用量、反欺诈和审计记录可能因法律与安全需要继续保留。没有任何传输或存储方式可以保证绝对安全。'] },
    { heading: '8. 你的选择与权利', paragraphs: ['根据所在地法律，你可能有权访问、更正或删除我们持有的个人数据，也可以反对或限制某些处理。请联系我们行使这些权利，我们可能先验证你的身份。'] },
    { heading: '9. 跨境处理', paragraphs: ['Open Design 使用全球云、支付、登录、安全和模型服务，信息可能在你所在国家或地区之外处理。我们会遵守适用的跨境传输要求。'] },
    { heading: '10. 未成年人', paragraphs: ['网站和本地应用不面向 13 岁以下儿童。Open Design Cloud 不面向 18 岁以下用户，除非获得监护人同意。'] },
    { heading: '11. 政策变更', paragraphs: ['我们可能不时更新本政策，重大变更会体现在上方的最后更新时间。'] },
    { heading: '12. 联系方式', paragraphs: ['隐私问题请联系 privacy@open-design.ai 或 dpo@open-design.ai；产品和社区问题可以通过 Open Design GitHub 仓库或 Discord 联系。'] },
  ],
};

const TERMS: Record<'en' | 'zh', LegalSection[]> = {
  en: [
    { heading: '1. The software is open source', paragraphs: ['The Open Design software is released under the Apache License 2.0. Your use, modification and distribution of the software are governed by that license. These Terms cover the website and hosted services.'] },
    { heading: '2. Local-first BYOK and hosted Cloud services', paragraphs: ['The local Open Design app is local-first and BYOK: you connect your own model-provider credentials and are responsible for the keys and provider costs. Open Design Cloud provides hosted model routing, wallet credits, usage metering and billing; models, prices, providers, routes and features may change.'] },
    { heading: '3. Account and credential security', paragraphs: ['You must provide accurate information and protect accounts, passwords, API keys, CLI authorization codes and access tokens. Activity through your account or credentials is treated as authorized by you.'] },
    { heading: '4. User content and compliance', paragraphs: ['You are responsible for prompts, files, images, code, input data, API requests and model outputs submitted through Open Design. You represent that you have lawful rights to process that content and will not submit illegal, infringing, confidential, unauthorized, malicious or policy-violating content. You retain ownership of what you create.'] },
    { heading: '5. Prohibited uses and high-risk contexts', paragraphs: ['You must not use Open Design for illegal activity, fraud, phishing, spam, malware, attacks, security bypass, privacy violations, intellectual-property infringement or policy circumvention. Without written approval, do not use Open Design for high-risk automated decisions involving medical, legal, financial, employment, credit, insurance, law enforcement, critical infrastructure or personal safety contexts.'] },
    { heading: '6. Model outputs', paragraphs: ['Model outputs may be inaccurate, incomplete or unsuitable for your purpose. You are responsible for reviewing outputs and actions taken from them. Open Design does not provide professional advice.'] },
    { heading: '7. Wallet, recharge and billing', paragraphs: ['Wallet credits are only for Open Design-supported model calls and related services. Recharge, discounts, invoices, refunds, taxes and disputes are governed by checkout pages, order records, campaign rules and applicable law.'] },
    { heading: '8. Limits, suspension and termination', paragraphs: ['Open Design may apply limits to accounts, API keys, request rates, balances, models or endpoints, and may suspend or terminate service for non-payment, abuse, legal risk, provider failure, security incidents or breach of these Terms.'] },
    { heading: '9. Third-party services', paragraphs: ['Third-party login, payment, security, email, cloud and model providers are governed by their own terms and privacy policies. Open Design does not guarantee continuous availability of third-party services.'] },
    { heading: '10. Intellectual property and trademarks', paragraphs: ['Open Design, Powerformer, related logos, the hosted interface, documentation and service design belong to Powerformer, Inc. or its licensors. Third-party names and brands belong to their respective owners.'] },
    { heading: '11. No warranty', paragraphs: ['To the fullest extent permitted by law, Open Design is provided as-is and as-available. We do not guarantee uninterrupted, error-free service or that it will meet every business objective.'] },
    { heading: '12. Limitation of liability', paragraphs: ['To the maximum extent permitted by law, Powerformer, Inc. will not be liable for indirect damages, lost profits, data loss, business interruption, third-party service failures or consequences of model outputs.'] },
    { heading: '13. Updates', paragraphs: ['Open Design may update these Terms. Material changes will be communicated through the page, an in-app notice or email. Continued use after changes take effect means you accept the updated Terms.'] },
    { heading: '14. Contact', paragraphs: ['Questions? Reach us via the Open Design GitHub repository or the community Discord.'] },
  ],
  zh: [
    { heading: '1. 软件采用开源协议', paragraphs: ['Open Design 软件采用 Apache License 2.0。软件的使用、修改和分发由该协议约束；本条款主要适用于网站和托管服务。'] },
    { heading: '2. 本地优先 BYOK 与 Cloud 服务', paragraphs: ['本地 Open Design 应用采用本地优先和 BYOK：你连接自己的模型供应商凭据，并承担密钥和供应商费用。Open Design Cloud 提供托管模型路由、钱包额度、用量统计和计费；模型、价格、供应商、路由和功能可能变化。'] },
    { heading: '3. 账号与凭据安全', paragraphs: ['你必须提供准确的信息并保护账号、密码、API 密钥、CLI 授权码和访问令牌。通过你的账号或凭据发生的活动视为已获你授权。'] },
    { heading: '4. 用户内容与合规', paragraphs: ['你对通过 Open Design 提交的提示词、文件、图片、代码、输入数据、API 请求和模型输出负责。你应确保拥有合法处理这些内容的权利，不提交违法、侵权、机密、未授权、恶意或违反政策的内容。你保留自己创作内容的所有权。'] },
    { heading: '5. 禁止用途与高风险场景', paragraphs: ['不得将 Open Design 用于违法活动、欺诈、钓鱼、垃圾信息、恶意软件、攻击、绕过安全、侵犯隐私、侵犯知识产权或规避模型供应商政策。未经书面批准，不得用于医疗、法律、金融、就业、信贷、保险、执法、关键基础设施或人身安全等高风险自动决策。'] },
    { heading: '6. 模型输出', paragraphs: ['模型输出可能不准确、不完整或不适合你的目的。你应审阅输出以及基于输出采取的行动；Open Design 不提供专业建议。'] },
    { heading: '7. 钱包、充值与计费', paragraphs: ['钱包额度仅用于 Open Design 支持的模型调用及相关服务。充值、折扣、发票、退款、税费和争议以结账页面、订单记录、活动规则及适用法律为准。'] },
    { heading: '8. 限制、暂停与终止', paragraphs: ['Open Design 可以对账号、API 密钥、请求速率、余额、模型或端点施加限制，并可能因未付款、滥用、法律风险、供应商故障、安全事件或违反本条款而暂停或终止服务。'] },
    { heading: '9. 第三方服务', paragraphs: ['第三方登录、支付、安全、邮件、云和模型供应商受其自身条款和隐私政策约束。Open Design 不保证第三方服务持续可用。'] },
    { heading: '10. 知识产权与商标', paragraphs: ['Open Design、Powerformer、相关标识、托管界面、文档和服务设计属于 Powerformer, Inc. 或其许可方；第三方名称与品牌归各自所有者所有。'] },
    { heading: '11. 不作保证', paragraphs: ['在法律允许的最大范围内，Open Design 按现状和可用状态提供。我们不保证服务不间断、无错误或一定满足每个业务目标。'] },
    { heading: '12. 责任限制', paragraphs: ['在法律允许的最大范围内，Powerformer, Inc. 不对间接损失、利润损失、数据丢失、业务中断、第三方服务故障或模型输出后果承担责任。'] },
    { heading: '13. 条款更新', paragraphs: ['Open Design 可能更新本条款。重大变更会通过页面、应用内通知或邮件说明；变更生效后继续使用即表示接受更新后的条款。'] },
    { heading: '14. 联系方式', paragraphs: ['如有问题，请通过 Open Design GitHub 仓库或社区 Discord 联系我们。'] },
  ],
};

function languageKey(locale: LandingLocaleCode): 'en' | 'zh' {
  return locale === 'en' ? 'en' : 'zh';
}

export function CommunityPage({ locale }: { locale: LandingLocaleCode }) {
  const t = getCommunityCopy(locale).hub;
  const href = (path: string) => hrefFor(path, locale);
  const cardHrefs = [
    href('/community/contributors/'),
    href('/community/ambassadors/'),
    href('/community/moderators/'),
    href('/community/events/'),
  ];
  const hubCards = [
    ...t.cards,
    {
      ord: 'IV',
      title: 'Events',
      sub: 'Local rooms where <em>Open Design</em> becomes practical.',
      body: 'Browse community events: read the Osaka recap, then see upcoming hands-on sessions like the Shanghai AI workshop.',
    },
  ];
  return (
    <SubpageLayout active="community" locale={locale}>
      <div className="od-community">
        <section className="hero">
          <div className="hero-decor"></div>
          <div className="wrap hero-grid">
            <div className="hero-copy">
              <h1 className="h-display" dangerouslySetInnerHTML={{ __html: t.heroTitle }} />
              <p className="lead">{t.heroLead}</p>
            </div>
            <div className="hero-card">
              <div className="card-frame">
                <img src={COMMUNITY_LINKS.heroCardImage} alt={t.cardHeroAlt} loading="eager" />
              </div>
              <div className="card-meta">
                <span className="h">{t.cardMetaH}</span>
                <span className="s">{t.cardMetaS}</span>
              </div>
            </div>
          </div>

          <div className="wrap">
            <div className="hub-cards">
              {hubCards.map((card, i) => (
                <a className="hub-card" href={cardHrefs[i]} key={card.ord}>
                  <span className="ord">{card.ord}</span>
                  <h3>{card.title}</h3>
                  <p className="hub-sub" dangerouslySetInnerHTML={{ __html: card.sub }} />
                  <p>{card.body}</p>
                  <span className="hub-arrow ri" aria-hidden="true">{GLYPH.arrow}</span>
                </a>
              ))}
            </div>
          </div>
        </section>
      </div>
    </SubpageLayout>
  );
}

export function FaqPage({ locale }: { locale: LandingLocaleCode }) {
  const faq = getHomeFaq(locale, { origin: 'open-design.ai', repo: REPO });
  const zh = languageKey(locale) === 'zh';
  return (
    <SubpageLayout active="resources" locale={locale}>
      <article className="standalone-info faq-page" data-od-id="faq">
        <header className="standalone-head"><span className="standalone-kicker">{zh ? '常见问题' : 'FAQ'}</span><h1>{zh ? 'Open Design 常见问题' : 'Open Design FAQ'}<span>.</span></h1><p>{zh ? '关于 Open Design 的常见问题——它是什么、怎么用、如何上手。' : 'Common questions about Open Design — what it is, how it works, and how to get started.'}</p></header>
        <dl className="standalone-faq-list">{faq.map((item) => <div className="standalone-faq-item" key={item.q}><dt>{item.q}</dt><dd>{item.a}</dd></div>)}</dl>
      </article>
    </SubpageLayout>
  );
}

export function LegalPage({ locale, kind }: { locale: LandingLocaleCode; kind: 'privacy' | 'terms' }) {
  const key = languageKey(locale);
  const meta = LEGAL_COPY[kind][key];
  const sections = kind === 'privacy' ? PRIVACY[key] : TERMS[key];
  return (
    <SubpageLayout active="resources" locale={locale}>
      <article className="standalone-info legal-page" data-od-id={kind}>
        <header className="standalone-head"><span className="standalone-kicker">{kind === 'privacy' ? 'PRIVACY' : 'TERMS'} / OPEN DESIGN</span><h1>{meta.title}</h1><p className="legal-updated">{meta.updated}</p></header>
        {sections.map((section) => <section className="legal-section" key={section.heading}><h2>{section.heading}</h2>{section.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}{section.bullets ? <ul>{section.bullets.map((bullet) => <li key={bullet}>{bullet}</li>)}</ul> : null}</section>)}
        <footer className="legal-contact"><a href="mailto:privacy@open-design.ai">privacy@open-design.ai</a><span>·</span><a href={REPO} target="_blank" rel="noreferrer noopener">GitHub</a><span>·</span><a href="https://discord.gg/mHAjSMV6gz" target="_blank" rel="noreferrer noopener">Discord</a></footer>
      </article>
    </SubpageLayout>
  );
}

const ABOUT_COPY = {
  en: {
    eyebrow: 'ABOUT',
    title: 'About Open Design',
    lead: 'Open Design is built by Powerformer, Inc. We have shipped open-source tools for years — including Refly and Nexu — and in 2026 released a one-stop, agent-native design platform.',
    vision: 'Our vision',
    paragraphs: ['For decades, design barely changed: you opened an app and dragged shapes around a canvas by hand. We think that is about to shift. Design is becoming a capability every agent can call — woven into how products get built, the way coding already is.', '2026 is the inflection point: models finally have real aesthetic judgment. Paired with the right design system, world-class design can become a default anyone can reach.', 'Open Design lets the coding agent already on your laptop step out of the code window to design, produce and ship — local-first, open-source, BYOK at every layer and neutral to any agent runtime.', 'Our goal is to rekindle curiosity for beauty, so people who are not designers can still make things that look great.'],
    closing: 'Open Design is Apache-2.0 and built in the open.',
  },
  zh: {
    eyebrow: '关于',
    title: '关于 Open Design',
    lead: 'Open Design 由 Powerformer, Inc. 打造。我们做开源产品已有多年——包括 Refly、Nexu，并在 2026 年发布了一站式的 agent-native 设计平台。',
    vision: '我们的愿景',
    paragraphs: ['过去几十年，设计这件事几乎没变过：打开软件，在画布上用鼠标一个个拖图形。我们判断，这正在改变——设计会从“一个要打开的软件”，变成“每个 agent 都能随时调用的能力”，像今天的 coding 一样融进生产流程。', '2026 是拐点：模型第一次真正有了审美。配上一套设计系统，世界级的“好看”可以成为人人都能调用的默认能力。', 'Open Design 让你电脑里已有的 coding agent 走出代码窗口，真正去做设计、做产品、做交付——本地优先、开源、每一层都支持 BYOK，且对任何 agent runtime 保持中立。', '我们想把对美的好奇心重新点亮，让不只是设计师的人也能做出好看的东西。'],
    closing: 'Open Design 采用 Apache-2.0，完全开源构建。',
  },
} as const;

const CAREERS_COPY = {
  en: {
    eyebrow: 'CAREERS', title: 'Join Open Design',
    lead: 'Open Design is one of the fastest-growing open-source projects in the world — and we are just getting started. We are building the agent-native design platform: the coding agent already on your laptop, stepping out of the code window to design, produce and ship.',
    apply: 'Email your resume and tell us which direction fits. Compensation is open for the right person.', rolesHead: 'Open roles', location: 'Based in Shanghai, China · on-site', closing: 'Not sure which role fits? Email us anyway.',
    roles: [['Product Manager (Growth × Agent Strategy)', 'Turn agent capability into growth and revenue — own the free-to-paid journey, pricing and the roadmap.'], ['Growth Engineer', 'Engineer global organic growth: produce and distribute content at scale with almost no paid spend.'], ['ML / Model Engineer', 'Drive models end-to-end — clean, fine-tune and ship efficient models off real session data.'], ['QA Engineer', 'Keep code quality and merge speed high under a firehose of external PRs.'], ['Agent SRE', 'Scale the infrastructure and keep massive agent concurrency stable and compliant.'], ['Product Engineer', 'Ship product end-to-end with coding agents, from idea to launch.'], ['Product-Growth Designer', 'Drive monetization through world-class design across the entire user journey.'], ['Performance & KOL Marketing', 'Build paid growth: performance ads, SEM and a KOL/KOC network.'], ['And more', 'Full-stack engineers, PMs and other roles — we are always hiring for the right fit.']],
  },
  zh: {
    eyebrow: '招聘', title: '加入 Open Design',
    lead: 'Open Design 是全球增长最快的开源项目之一——而我们才刚刚开始。我们在做 agent-native 的设计平台：让你电脑里已有的 coding agent 走出代码窗口，真正去做设计、做产品、做交付。',
    apply: '把简历发邮件给我们，并说明你适合的方向。人选合适，薪资空间开放。', rolesHead: '开放岗位', location: '工作地点：中国 · 上海', closing: '还没想好投哪个岗位？直接发简历给我们也可以。',
    roles: [['产品经理（增长商业化 × Agent 策略）', '站在增长、商业化与 Agent 策略的交叉点，把 Agent 能力做成可增长、可变现的产品路径。'], ['增长工程师', '以工程化方式做全球自然增长，批量生产分发内容，在低投放下做出量级。'], ['算法 / 模型工程师', '端到端推进自有模型落地，用真实 session 数据完成清洗、微调、上线。'], ['QA 工程师', '在高频外部 PR 合并节奏下保障代码质量与合并效率。'], ['Agent SRE 工程师', '支撑大规模 Agent 并发，保障产品上云后的基础设施稳定与运维。'], ['产品工程师', '借助 Coding 工具端到端快速迭代产品，从想法到上线，并对增长与商业化负责。'], ['产品增长设计师', '以世界一流的设计驱动整条用户旅程的商业化转化，不止界面，更对转化负责。'], ['效果营销 · SEM · KOL 运营', '搭建付费投放、SEM 与 KOL/KOC 体系，作为自然增长之外的增长杠杆。'], ['更多岗位', '全栈工程师、产品经理等岗位持续招聘，人选合适薪资均可开放沟通。']],
  },
} as const;

export function AboutPage({ locale }: { locale: LandingLocaleCode }) {
  const copy = ABOUT_COPY[languageKey(locale)];
  const href = (path: string) => hrefFor(path, locale);
  return <SubpageLayout locale={locale}><article className="standalone-info about-page" data-od-id="about"><header className="standalone-head"><span className="standalone-kicker">{copy.eyebrow}</span><h1>{copy.title}<span>.</span></h1><p>{copy.lead}</p></header><section className="about-body"><h2>{copy.vision}</h2>{copy.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}<p className="about-closing">{copy.closing}</p></section><div className="info-cta-actions"><a className="btn btn-primary" href={REPO} target="_blank" rel="noreferrer noopener">GitHub ↗</a><a className="btn btn-ghost" href={href('/plugins/')}>Open Design 插件 ↗</a></div></article></SubpageLayout>;
}

export function CareersPage({ locale }: { locale: LandingLocaleCode }) {
  const copy = CAREERS_COPY[languageKey(locale)];
  return <SubpageLayout locale={locale}><article className="standalone-info careers-page" data-od-id="careers"><header className="standalone-head"><span className="standalone-kicker">{copy.eyebrow}</span><h1>{copy.title}<span>.</span></h1><p>{copy.lead}</p><p className="careers-apply">{copy.apply} <a href="mailto:join@open-design.ai">join@open-design.ai</a></p></header><section className="careers-roles"><div className="careers-roles-head"><h2>{copy.rolesHead}</h2><span>{copy.location}</span></div><div className="careers-grid">{copy.roles.map(([title, blurb], index) => <article className="career-card" key={title}><span>{String(index + 1).padStart(2, '0')}</span><h3>{title}</h3><p>{blurb}</p></article>)}</div><p className="careers-closing">{copy.closing}</p></section></article></SubpageLayout>;
}

export function OfficialPage({ locale }: { locale: LandingLocaleCode }) {
  const copy = getInfoPageCopy(locale);
  const page = copy.official;
  const common = copy.common;
  const href = (path: string) => hrefFor(path, locale);
  const sources = page.sources.map((source, index) => {
    const urls = [
      'https://open-design.ai/', REPO, `${REPO}/releases`, `${REPO}/issues`, 'https://discord.gg/mHAjSMV6gz', `${REPO}#readme`, `${REPO}/blob/main/LICENSE`, href('/plugins/skills/'), href('/plugins/systems/'), href('/plugins/templates/'),
    ];
    return { ...source, href: urls[index] };
  });
  return <SubpageLayout active="resources" locale={locale}><article className="info-page official-page" data-od-id="official"><nav className="breadcrumb" aria-label={common.breadcrumbAria}><a href={href('/')}>Open Design</a><span>/</span><span>{page.breadcrumb}</span></nav><header className="catalog-head"><span className="label">{page.label}</span><h1 className="display">{page.heading}</h1><p className="lead">{page.lead}</p></header><section className="info-section"><h2>{page.canonicalTitle}</h2><p>{page.canonicalBody}</p><div className="source-card">{sources.map((source) => <a href={source.href} target={source.href.startsWith('http') ? '_blank' : undefined} rel={source.href.startsWith('http') ? 'noreferrer noopener' : undefined} key={source.name}><span><span className="label">{source.label}</span><br /><strong>{source.name}</strong></span><span className="arrow">→</span></a>)}</div></section><section className="info-section"><h2>{page.aliasesTitle}</h2><p>{page.aliasesLead}</p><ul>{page.aliases.map((item) => <li key={item.label}><strong>{item.label}</strong> — {item.body}</li>)}</ul><p>{page.aliasesClosing}</p></section><section className="info-section"><h2>{page.maintainerTitle}</h2><p>{page.maintainerBody}</p></section><section className="info-section"><h2>{page.runtimeTitle}</h2><p>{page.runtimeBody}</p><ul>{page.runtimeItems.map((item) => <li key={item.label}><strong>{item.label}</strong> — {item.body}</li>)}</ul></section><section className="info-section"><h2>{page.nextTitle}</h2><ul>{page.nextItems.map((item, index) => <li key={item.label}><a className="inline-link" href={href(['/quickstart/', '/agents/', '/alternatives/claude-design/', '/plugins/skills/', '/plugins/systems/'][index])}>{item.label}</a> — {item.body}</li>)}</ul></section></article></SubpageLayout>;
}
