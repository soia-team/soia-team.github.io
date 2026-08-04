export type ProductRouteSpec = {
  path: string;
  title: string;
  heading: string;
  intro: string;
  sections: string[];
  image: string;
  imageAlt: string;
};

/**
 * The top-level product pages below are the exact Chinese route evidence from
 * RECON/routes-clone/clone-route-map.md. The React shell keeps those strings
 * and route names stable while the local media makes each page useful offline.
 */
export const PRODUCT_ROUTES: ProductRouteSpec[] = [
  {
    path: '/html-anything',
    title: '开源 HTML Anything 官方',
    heading: 'HTML Anything — 你的本地 AI Agent 写 HTML，你负责发布.',
    intro: 'HTML Anything 是 Open Design 家族里的 Agent 原生 HTML 编辑器：把 Markdown、CSV 或 JSON 交给你已经登录的本地 coding agent，输出可交付的 HTML。',
    sections: [
      '为什么需要它',
      'Markdown 是草稿，HTML 才是读者看到的页面。',
      '你的 Agent 已经认识你。',
      'Skill 是文件夹，不是黑盒。',
      '工作流程',
      '放入输入内容',
      '选择 Skill，由 Agent 渲染',
      '导出到目标渠道',
      '示例',
      '页面之外的两种形态',
      '九种内容形态',
      '自动识别八种 coding agent',
      '导出目标',
      '快速开始',
      '路线图',
      '来自 Open Design 家族',
    ],
    image: '/hero-product-1920.webp',
    imageAlt: 'Open Design 本地工作台',
  },
  {
    path: '/html-video',
    title: 'html-video — HTML 转视频，面向 coding agent 的程序化视频 · Hyperframes',
    heading: 'html-video — HTML 转视频，就在你的电脑上.',
    intro: 'html-video 把 HTML 变成视频，就在你的电脑上：由本地 coding agent 生成逐帧 HTML，再输出真实 MP4。',
    sections: [
      '为什么需要它',
      'HTML 转视频是个真实的品类——但每个引擎都有自己的脾气。',
      '你跟 agent 对话，由它选引擎。',
      '一个链接进去，一个 MP4 出来——全在本地。',
      '工作流程',
      '抓取源',
      'Agent 循环',
      'Content-graph',
      '逐帧 HTML',
      'Hyperframes 渲染',
      'ffmpeg → 你的.mp4',
      '示例',
      '引擎',
      '九种内容形态',
      '自动识别八种 coding agent',
      'AI 配乐',
      '快速开始',
      '路线图',
      '来自 Open Design 家族',
    ],
    image: '/lab-stage-art.webp',
    imageAlt: 'HTML 视频与 Hyperframes 预览',
  },
  {
    path: '/codex-slides',
    title: 'Codex Slides — 住在 Codex 里的开源 AI 幻灯片工作室 · PPTX 与 PDF',
    heading: 'Codex Slides: 住在你编码 agent 里的 AI 幻灯片工作室.',
    intro: 'Codex Slides 是住在 Codex 里的开源、image-native AI 幻灯片工作室：研究、提纲、视觉方向、渲染、编辑、演示和 PPTX/PDF 导出都在同一个项目里。',
    sections: [
      '为什么会有它',
      '你看着它一步步长出来，而不是干等一个文件。',
      '每一套幻灯片都是长期存在的项目，而不是一次下载。',
      'image-native：幻灯片本身就是画布。',
      '它是怎么运作的',
      '先把需求问清楚',
      '把事实查扎实',
      '把大纲打磨好',
      '锁定视觉方向',
      '并行渲染',
      '就地修改',
      '演示和导出',
      '幻灯片长什么样',
      '看真实产品',
      '六类工作流',
      '交付真正的文件',
      '快速且无摩擦',
      'Open Design 家族的一员',
    ],
    image: '/lab-cards/slides.png',
    imageAlt: 'Codex Slides 幻灯片工作室',
  },
];

export const AGENTS = [
  { slug: 'claude-code', name: 'Claude Code', vendor: 'Anthropic', route: 'claude-code-design' },
  { slug: 'codex', name: 'Codex', vendor: 'OpenAI', route: 'codex-design' },
  { slug: 'cursor', name: 'Cursor Agent', vendor: 'Cursor', route: 'cursor-design' },
  { slug: 'gemini', name: 'Gemini CLI', vendor: 'Google', route: 'gemini-design' },
  { slug: 'copilot', name: 'GitHub Copilot CLI', vendor: 'GitHub', route: 'copilot-design' },
  { slug: 'opencode', name: 'OpenCode', vendor: 'community', route: 'opencode-design' },
  { slug: 'qwen', name: 'Qwen Code', vendor: 'Alibaba', route: 'qwen-design' },
  { slug: 'grok', name: 'Grok Build', vendor: 'xAI', route: 'grok-design' },
  { slug: 'hermes', name: 'Hermes', vendor: 'community', route: 'hermes-design' },
  { slug: 'kimi', name: 'Kimi CLI', vendor: 'Moonshot', route: 'kimi-design' },
  { slug: 'devin', name: 'Devin for Terminal', vendor: 'Cognition', route: 'devin-design' },
  { slug: 'deepseek', name: 'DeepSeek TUI', vendor: 'DeepSeek', route: 'deepseek-design' },
  { slug: 'pi', name: 'Pi', vendor: 'community', route: 'pi-design' },
  { slug: 'vibe', name: 'Mistral Vibe CLI', vendor: 'Mistral', route: 'vibe-cli-design' },
  { slug: 'kiro', name: 'Kiro CLI', vendor: 'Amazon (preview)', route: 'kiro-design' },
  { slug: 'kilo', name: 'Kilo', vendor: 'community', route: 'kilo-design' },
  { slug: 'qoder', name: 'Qoder CLI', vendor: 'Alibaba', route: 'qoder-design' },
  { slug: 'trae-cli', name: 'Trae CLI', vendor: 'ByteDance', route: 'trae-cli-design' },
  { slug: 'aider', name: 'Aider', vendor: 'community', route: 'aider-design' },
  { slug: 'antigravity', name: 'Antigravity', vendor: 'Google', route: 'antigravity-design' },
  { slug: 'reasonix', name: 'DeepSeek Reasonix', vendor: 'community', route: 'reasonix-design' },
] as const;

export const AGENT_ROUTE_TO_SLUG: Record<string, string> = Object.fromEntries(
  AGENTS.map((agent) => [agent.route, agent.slug]),
);

export const ROUTE_COVERAGE = [
  '/',
  ...PRODUCT_ROUTES.map((page) => page.path),
  '/plugins',
  '/plugins/templates',
  '/plugins/skills',
  '/plugins/systems',
  '/pricing',
  '/blog',
  '/agents',
  ...AGENTS.map((agent) => `/agents/${agent.route}`),
];
