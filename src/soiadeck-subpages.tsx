import { useRef, useState } from 'react';
import { SubpageLayout, hrefFor } from './shell';
import type { LandingLocaleCode } from './upstream/app/i18n';
import { ZoomableFigure, AgentMatrix } from './soia-pages';
import './missing-pages.css';

/** SoiaDeck 二级页：桌面基础能力、作业台、本地 LLM、AI 网络、手机端。内容与截图都取自 SoiaDeck 设计原型。 */
type T = { zh: string; en: string; ja: string };
const L = (zh: string, en: string, ja: string): T => ({ zh, en, ja });
type Phone = { img: string; cap: T };
type Section = { id: string; title: T; body: T; points?: T[]; img?: string; alt?: T; phones?: Phone[]; shots?: Phone[]; preview?: boolean; agents?: boolean; packs?: boolean };
type Group = 'deck' | 'works' | 'mobile';
type SubPage = { slug: string; group: Group; heroShots?: Phone[]; name: T; kicker: T; tagline: T; lead: T; hero?: string; heroAlt?: T; heroPhones?: Phone[]; sections: Section[] };

const P = '/soia/products/soiadeck-';

export const DECK_SUBPAGES: readonly SubPage[] = [
  {
    slug: 'desktop', heroShots: [{ img: P + 'home.png', cap: L('首页', 'Home', 'ホーム') }, { img: P + 'd-monitor.webp', cap: L('本机状态', 'Machine status', 'マシン状態') }, { img: P + 'remote.png', cap: L('远程访问', 'Remote access', 'リモートアクセス') }, { img: P + 'd-devices.webp', cap: L('设备授权', 'Device authorisation', '端末認可') }, { img: P + 'd-security.webp', cap: L('安全事件', 'Security events', 'セキュリティイベント') }, { img: P + 'd-notifs.webp', cap: L('通知', 'Notifications', '通知') }], group: 'deck',
    name: L('桌面基础能力', 'Desktop foundation', 'デスクトップ基盤'),
    kicker: L('SoiaDeck 桌面', 'SoiaDeck desktop', 'SoiaDeck デスクトップ'),
    tagline: L('这台电脑现在怎么样、谁能连进来、出过什么事。', 'How this machine is doing, who can reach it and what has happened.', 'このマシンの状態、誰が接続できるか、何が起きたか。'),
    lead: L(
      '三个插件之外，桌面端自己管的是这台主机：本机状态、远程访问、设备授权、访问与安全记录、日志、通知和设置。这些是作业台、本地 LLM、AI 网络共同站着的地基。',
      'Beyond its three plugins, the desktop app looks after the host itself: machine status, remote access, device authorisation, access and security records, logs, notifications and settings — the ground the workbench, local LLM and AI network stand on.',
      '三つのプラグインとは別に、デスクトップアプリはホスト自体を管理します。マシン状態、リモートアクセス、端末認可、アクセス・セキュリティ記録、ログ、通知、設定。作業台・ローカル LLM・AI ネットワークの土台です。',
    ),
    hero: P + 'home.png',
    heroAlt: L('SoiaDeck 桌面首页', 'SoiaDeck desktop home', 'SoiaDeck デスクトップホーム'),
    sections: [
      { id: 'home', shots: [{ img: P + 'home.png', cap: L('首页：本机概况与待处理', 'Home: machine and pending items', 'ホーム：概況と対応待ち') }, { img: P + 'd-welcome.webp', cap: L('第一次打开：在本机开始或连别的主机', 'First run: start here or connect to another host', '初回起動：このマシンで開始、または他のホストへ接続') }], title: L('首页：本机概况和等你处理的事', 'Home: the machine and what is waiting on you', 'ホーム：マシンの概況と対応待ち'), body: L('最上面是这台主机的 CPU、内存、显卡和磁盘；下面是所有等你处理的操作：命令审批、设备配对请求、插件提醒，不用一个个点进去找。', 'On top, this host’s CPU, memory, GPU and disk; below, everything waiting on you — command approvals, device pairing requests, plugin notices — without hunting through pages.', '上部にこのホストの CPU・メモリ・GPU・ディスク、下に対応待ちの操作（コマンド承認、端末ペアリング要求、プラグイン通知）がまとまります。'), },
      { id: 'monitor', shots: [{ img: P + 'd-monitor.webp', cap: L('概览', 'Overview', '概要') }, { img: P + 'd-mon-cpu.webp', cap: L('CPU', 'CPU', 'CPU') }, { img: P + 'd-mon-mem.webp', cap: L('内存', 'Memory', 'メモリ') }, { img: P + 'd-mon-gpu.webp', cap: L('显卡', 'GPU', 'GPU') }], title: L('本机状态', 'Machine status', 'マシン状態'), body: L('CPU、内存、显卡、磁盘、网络和电源的实时曲线。点开一个进程，比如正在服务的模型，能看到它的内存里各部分占了多少。', 'Live curves for CPU, memory, GPU, disk, network and power. Open a process — a model being served, say — to see how its memory breaks down.', 'CPU・メモリ・GPU・ディスク・ネットワーク・電源のリアルタイム推移。提供中のモデルなどのプロセスを開くと、メモリの内訳が見られます。'), },
      { id: 'remote', shots: [{ img: P + 'remote.png', cap: L('总览：直连与中继的开关', 'Overview: direct and relay switches', '概要：直接接続とリレーのスイッチ') }, { img: P + 'd-gw-conn.webp', cap: L('在线连接：现在谁连着', 'Live connections: who is connected now', '接続中：現在の接続元') }, { img: P + 'd-gw-pol.webp', cap: L('访问规则：每个接口谁能调', 'Access rules: who may call each endpoint', 'アクセスルール：各エンドポイントの許可') }], title: L('远程访问', 'Remote access', 'リモートアクセス'), body: L('让别的设备连到这台电脑的总开关。局域网直连和中继两种连法各有开关和状态，最近的同步记录列在下面。', 'The master switch for letting other devices reach this computer. LAN direct and relay each have their own switch and status, with recent sync records below.', '他の端末からこのパソコンへの接続を制御するメインスイッチ。LAN 直接接続とリレーそれぞれにスイッチと状態があり、最近の同期記録も確認できます。'), },
      { id: 'hosts', shots: [{ img: P + 'd-dir.webp', cap: L('主机列表', 'Host list', 'ホスト一覧') }, { img: P + 'd-hosts.webp', cap: L('多台主机总览', 'Fleet overview', '複数ホストの概要') }, { img: P + 'd-devices.webp', cap: L('设备授权与有效期', 'Device authorisation and validity', '端末認可と有効期間') }, { img: P + 'd-pairing.webp', cap: L('添加设备：出码配对', 'Add a device: pair with a code', '端末追加：コードでペアリング') }], title: L('主机与设备授权', 'Hosts & device authorisation', 'ホストと端末認可'), body: L('你管理的所有主机在一处，按分组看在线、离线和需要处理的。每台连进来的设备都有权限档位和授权有效期，时间线上一眼看出谁快到期、谁已收回。', 'All hosts you manage in one place, grouped, with online, offline and needs-attention states. Every connecting device has a permission tier and a validity window; the timeline shows who is about to expire and who was revoked.', '管理するすべてのホストを一か所に。グループ別にオンライン・オフライン・要対応を表示。接続する各端末には権限レベルと有効期間があり、タイムラインで期限切れ間近や失効済みが分かります。'), },
      { id: 'audit', shots: [{ img: P + 'd-access.webp', cap: L('访问记录', 'Access records', 'アクセス記録') }, { img: P + 'd-security.webp', cap: L('安全事件', 'Security events', 'セキュリティイベント') }], title: L('访问记录与安全事件', 'Access records & security events', 'アクセス記録とセキュリティイベント'), body: L('每一次远程访问留一条记录：哪台设备、调了哪个接口、结果、耗时。未知设备、过期授权、签名不符这类可疑访问单独列成安全事件，并写明是怎么处理的。', 'Every remote access leaves a record: which device, which endpoint, result and duration. Suspicious ones — unknown device, expired authorisation, bad signature — are listed separately as security events with how they were handled.', 'リモートアクセスは毎回記録（端末・エンドポイント・結果・所要時間）。未知の端末、期限切れ、署名不一致などの疑わしいアクセスはセキュリティイベントとして別掲し、対処結果も示します。'), },
      { id: 'logs', shots: [{ img: P + 'd-logs.webp', cap: L('日志概览', 'Log overview', 'ログ概要') }, { img: P + 'd-obs-logs.webp', cap: L('搜索事件', 'Search events', 'イベント検索') }, { img: P + 'd-obs-traces.webp', cap: L('对话轨迹：一轮里每一步花了多久', 'Session traces: how long each step took', 'セッショントレース：各ステップの所要時間') }], title: L('运行日志', 'Runtime logs', '実行ログ'), body: L('错误率、延迟、各来源的日志量，以及哪里有缺口。出了问题先在这里定位，再去看具体日志和调用链。', 'Error rate, latency, log volume by source and where the gaps are. Locate the problem here first, then drill into logs and traces.', 'エラー率・遅延・ソース別ログ量と欠落箇所。まずここで問題を特定し、詳細ログやトレースへ進みます。'), },
      { id: 'notifs', title: L('通知', 'Notifications', '通知'), body: L('任务完成、等你审批、设备请求配对、版本更新，都进同一个通知页，按「待处理 / 提醒 / 系统」分类，能直接在这里批准或拒绝。', 'Finished tasks, approvals waiting, pairing requests and updates all land on one notifications page, sorted into to-do, reminders and system, where you can approve or deny directly.', 'タスク完了、承認待ち、ペアリング要求、更新はすべて同じ通知ページへ。「対応待ち / リマインダー / システム」に分類され、その場で承認・拒否できます。'), img: P + 'd-notifs.webp', alt: L('通知', 'Notifications', '通知') },
      { id: 'shell', shots: [{ img: P + 'shell-boot.webp', cap: L('启动页', 'Startup', '起動画面') }, { img: P + 'shell-fail.webp', cap: L('启动失败：说清原因和做法', 'Startup failed: cause and what to do', '起動失敗：原因と対処') }, { img: P + 'shell-quit.webp', cap: L('退出确认：还有对话在跑', 'Quit confirmation: sessions still running', '終了確認：実行中のセッションあり') }, { img: P + 'shell-perm.webp', cap: L('系统权限：用到时才申请', 'System permissions: asked when needed', 'システム権限：必要なときに要求') }, { img: P + 'shell-keep.webp', cap: L('应用菜单：退出后保持后台运行', 'App menu: keep running after quit', 'アプリメニュー：終了後も常駐') }, { img: P + 'shell-crash.webp', cap: L('后台断开：自动重连并提示', 'Backend lost: reconnects and tells you', 'バックエンド切断：自動再接続して通知') }, { img: P + 'shell-tray.webp', cap: L('托盘面板', 'Tray panel', 'トレイパネル') }, { img: P + 'shell-login.webp', cap: L('登录回跳', 'Login callback', 'ログインコールバック') }], title: L('应用外壳：那些不起眼但要做对的事', 'The app shell: small things that have to be right', 'アプリシェル：地味でも正しくあるべきこと'), body: L('后台没准备好时的启动页和启动失败页；还有任务在跑时的退出确认；退出后是否保持后台运行；托盘菜单；向系统申请权限时说清楚为什么要；后台崩溃或反复重启时提示你。', 'A startup page while the backend gets ready and a clear page when startup fails; a quit confirmation while tasks are running; whether to keep running in the background; a tray menu; saying why when asking the system for a permission; telling you when the backend crashes or keeps restarting.', 'バックエンド準備中の起動画面と起動失敗時の案内、タスク実行中の終了確認、終了後のバックグラウンド常駐、トレイメニュー、権限要求時の理由説明、バックエンドのクラッシュや再起動ループの通知。') },
    ],
  },
  {
    slug: 'settings', heroShots: [{ img: P + 'd-settings.webp', cap: L('通用', 'General', '一般') }, { img: P + 'pack-set-aurora.webp', cap: L('主题套装', 'Theme packs', 'テーマパック') }, { img: P + 'set-account.webp', cap: L('账号', 'Account', 'アカウント') }, { img: P + 'set-backup.webp', cap: L('备份', 'Backup', 'バックアップ') }, { img: P + 'set-notifications.webp', cap: L('通知', 'Notifications', '通知') }, { img: P + 'set-releases.webp', cap: L('更新记录', 'Release notes', '更新履歴') }], group: 'deck',
    name: L('桌面设置', 'Desktop settings', 'デスクトップ設定'),
    kicker: L('SoiaDeck 桌面', 'SoiaDeck desktop', 'SoiaDeck デスクトップ'),
    tagline: L('先挑一套你喜欢的样子：21 套主题套装，一键换。', 'Start by picking a look: 21 theme packs, one click to switch.', 'まずは見た目から。21 のテーマパックをワンクリックで切り替え。'),
    lead: L(
      '设置管的是整台主机和这个应用本身，对作业台、本地 LLM、AI 网络三个插件都生效；插件自己的选项在各自页面里。下面是几个主要分区。',
      'Settings cover the whole host and the app itself and apply to all three plugins — workbench, local LLM and AI network; each plugin keeps its own options on its own page. These are the main sections.',
      '設定はホスト全体とアプリ自体を対象とし、作業台・ローカル LLM・AI ネットワークの三つのプラグインすべてに適用されます。プラグイン固有の設定は各ページにあります。主なセクションは次のとおりです。',
    ),
    hero: P + 'd-settings.webp',
    heroAlt: L('SoiaDeck 设置 · 通用', 'SoiaDeck settings · general', 'SoiaDeck 設定 · 一般'),
    sections: [
      { id: 'themes', packs: true, title: L('主题套装：21 套，一键换', 'Theme packs: 21 of them, one click', 'テーマパック：21 種をワンクリックで'),
        body: L('天天对着的界面，值得有自己喜欢的样子。一套主题套装一次换掉强调色、按钮、圆角、底色和背景；其中五套还带一幅用代码画的、会动的景——像素星夜、像素晴日、霓虹雨夜、星图、极光。点下面任意一张看大图。', 'A screen you look at all day deserves a look you like. One pack swaps accent, buttons, corners, surface and background together; five of them also carry an animated scene drawn entirely in code — pixel night, pixel day, neon rain, a star chart and aurora. Pick any one below to see it large.', '毎日見る画面だから、好きな見た目に。パック一つでアクセント色・ボタン・角丸・地色・背景をまとめて切り替えます。うち五つはコードで描いた動く景色付き（ピクセルの夜・ピクセルの昼・ネオンの雨・星図・オーロラ）。下から選ぶと大きく表示します。'),
        points: [L('浅色、深色或跟随系统；有的套装两种都有，有的只有夜', 'Light, dark or follow the system; some packs have both, some are night-only', 'ライト／ダーク／システムに合わせる。両対応のパックと夜専用のパックがあります'), L('不满意可以在「细项」里单独改强调色、圆角、材质和背景', 'Fine-tune accent, corners, material and background separately under Details', '「詳細」でアクセント色・角丸・質感・背景を個別に調整'), L('系统开了「减少动效」时，会动的景自动停住', 'Animated scenes stop when the system asks for reduced motion', '「視差効果を減らす」設定では動く景色が停止')] },
      { id: 'general', title: L('通用：语言与外观', 'General: language and appearance', '一般：言語と外観'), body: L('界面语言和字号；浅色、深色或跟随系统；背景图、主题套装、圆角与材质、图标底色。改了立刻生效。', 'Interface language and text size; light, dark or follow the system; background, theme pack, corner and material options, icon colour. Changes apply at once.', '表示言語と文字サイズ、ライト／ダーク／システムに合わせる、背景・テーマパック・角丸と質感・アイコン色。変更はすぐ反映されます。'), img: P + 'd-settings.webp', alt: L('设置 · 通用', 'Settings · general', '設定 · 一般') },
      { id: 'account', points: [L('主机连接：这个界面连的是哪台主机的后台、什么版本、数据放在哪，退出应用后后台是否继续运行', 'Host connection: which host’s backend this interface talks to, its version and data directory, and whether it keeps running after quit', 'ホスト接続：接続先のバックエンド、バージョン、データ保存先、終了後も動かすか')], shots: [{ img: P + 'set-account.webp', cap: L('账号', 'Account', 'アカウント') }, { img: P + 'set-connections.webp', cap: L('主机连接', 'Host connection', 'ホスト接続') }], title: L('账号与主机连接', 'Account & host connection', 'アカウントとホスト接続'), body: L('不登录也能完整使用。登录 SoiaDeck 账号后，可以把这台电脑绑到名下，在账号网页上统一管理主机和登录设备。', 'Everything works without signing in. With a SoiaDeck account you can bind this computer to it and manage hosts and signed-in devices from the account web.', 'ログインしなくてもすべて使えます。SoiaDeck アカウントにログインすると、このパソコンを紐付け、アカウント Web でホストと端末を一元管理できます。'), },
      { id: 'backup', points: [L('通知：应用内、系统横幅、手机推送三个通道分别开关，可设定时免打扰和保留多久', 'Notifications: in-app, system banner and phone push switched separately, with quiet hours and retention', '通知：アプリ内・システムバナー・スマホプッシュを個別に切替。おやすみ時間と保存期間も設定')], shots: [{ img: P + 'set-backup.webp', cap: L('备份', 'Backup', 'バックアップ') }, { img: P + 'set-notifications.webp', cap: L('通知', 'Notifications', '通知') }], title: L('备份与通知', 'Backup & notifications', 'バックアップと通知'), body: L('上次备份的时间和完整性、自动还是手动。每次备份按平台数据、运行日志、作业台、本地 LLM、AI 网络等部分分别校验，哪一份没通过一眼看出。', 'When the last backup ran and whether it is intact, automatic or manual. Each backup is verified part by part — platform data, runtime logs, workbench, local LLM, AI network — so a failed part stands out.', '前回のバックアップ時刻と完全性、自動か手動か。各バックアップはプラットフォームデータ・実行ログ・作業台・ローカル LLM・AI ネットワークなどの部分ごとに検証され、失敗した部分がすぐ分かります。'), },
      { id: 'releases', shots: [{ img: P + 'set-releases.webp', cap: L('更新记录', 'Release notes', '更新履歴') }, { img: P + 'set-usage.webp', cap: L('使用统计', 'Usage statistics', '使用統計') }, { img: P + 'set-about.webp', cap: L('关于', 'About', 'このアプリについて') }], title: L('更新、使用统计与关于', 'Updates, usage and about', '更新・使用統計・アプリ情報'), body: L('每个版本改了什么都能查到，并在这里检查更新。', 'See what changed in each version and check for updates here.', '各バージョンの変更内容を確認し、ここで更新を確認できます。'), points: [L('使用统计：今天和最近 14 天用了多久、各模型跑了多久，只在本机统计', 'Usage statistics: time used today and over 14 days and per-model run time, counted on this machine only', '使用統計：今日と直近 14 日の使用時間、モデル別の稼働時間。集計はこのマシン内のみ'), L('关于：一键复制版本信息，方便反馈问题', 'About: copy the version details in one click for a bug report', 'アプリ情報：バージョン情報をワンクリックでコピー'), L('检查到新版本后在应用内下载，显示进度、完成和失败三种状态', 'When an update is found it downloads in the app, with progress, done and failed states', '更新があればアプリ内でダウンロード。進行中・完了・失敗の状態を表示')], preview: true },
    ],
  },
  {
    slug: 'local-llm', heroShots: [{ img: P + 'llm.png', cap: L('已安装', 'Installed', 'インストール済み') }, { img: P + 'llm-market.webp', cap: L('下载模型', 'Download models', 'モデルのダウンロード') }, { img: P + 'llm-engines.webp', cap: L('运行引擎', 'Engines', '実行エンジン') }, { img: P + 'router.png', cap: L('模型转发', 'Router', 'ルーター') }], group: 'works',
    name: L('本地 LLM', 'Local LLM', 'ローカル LLM'),
    kicker: L('SoiaWorks 工坊 · 插件', 'SoiaWorks workshop · plugin', 'SoiaWorks · プラグイン'),
    tagline: L('本机的模型：装了什么、跑着什么、怎么调用。', 'Models on this machine: what is installed, what is running, how to call them.', 'このマシンのモデル：何があり、何が動き、どう呼ぶか。'),
    lead: L(
      '发现、下载、启停本机模型，并把它们收在一个 OpenAI 兼容的入口后面。推理引擎目前以 MLX 系为主，所以在 Apple Silicon 上最完整。作业台本身不依赖本地模型，用不用由你。',
      'Discover, download, start and stop models on this machine and put them behind one OpenAI-compatible endpoint. Engines are mostly MLX today, so Apple Silicon is the most complete. The workbench does not depend on local models — using them is up to you.',
      'ローカルモデルの検出・ダウンロード・起動・停止を行い、OpenAI 互換のエンドポイント一つにまとめます。現在は MLX 系が中心で Apple Silicon が最も充実。作業台はローカルモデルに依存せず、使うかどうかは自由です。',
    ),
    hero: P + 'llm.png',
    heroAlt: L('SoiaDeck 本地 LLM', 'SoiaDeck local LLM', 'SoiaDeck ローカル LLM'),
    sections: [
      { id: 'installed', title: L('已安装：内存先看清', 'Installed: memory first', 'インストール済み：まずメモリ'), body: L('顶上一条内存占用，哪个模型占了多少一目了然；下面是每个模型的大小、格式与量化、速度和状态，可以直接启停。', 'A memory bar on top shows which model takes how much; below, each model’s size, format and quantisation, speed and state, with start and stop right there.', '上部のメモリバーでモデルごとの使用量を把握。下に各モデルのサイズ・形式と量子化・速度・状態が並び、その場で起動・停止できます。'), img: P + 'llm.png', alt: L('已安装的模型', 'Installed models', 'インストール済みモデル') },
      { id: 'market', title: L('下载模型', 'Download models', 'モデルのダウンロード'), body: L('搜索模型并下载，可以按这台机器的内存能不能装下来筛，下载进度和速度看得见。', 'Search and download models, filter by whether they fit this machine’s memory, and watch progress and speed.', 'モデルを検索してダウンロード。このマシンのメモリに収まるかで絞り込み、進捗と速度を確認できます。'), img: P + 'llm-market.webp', alt: L('下载模型', 'Model downloads', 'モデルダウンロード') },
      { id: 'engines', title: L('运行引擎', 'Engines', '実行エンジン'), body: L('模型要靠引擎才能跑。这一页检查基础环境，列出各个引擎装没装、什么版本，没装的给出安装方式。', 'Models need an engine to run. This page checks the base environment and lists each engine with whether it is installed and at what version, plus how to install the missing ones.', 'モデルの実行にはエンジンが必要です。このページで基本環境を確認し、各エンジンの導入状況とバージョン、未導入のものの導入方法を示します。'), img: P + 'llm-engines.webp', alt: L('运行引擎', 'Engines', '実行エンジン') },
      { id: 'router', title: L('模型转发：一个地址，多个模型', 'Router: one address, many models', 'ルーター：一つのアドレスで複数モデル'), body: L('把本机模型收在一个 OpenAI 兼容入口后面，客户端只配一个地址，由它按模型名转发。页面上给出可以直接复制的 baseURL 和调用示例。', 'Put local models behind one OpenAI-compatible endpoint: clients configure a single address and it routes by model name. The page gives a baseURL and call examples you can copy.', 'ローカルモデルを OpenAI 互換エンドポイント一つにまとめ、クライアントは一つのアドレスだけ設定。モデル名で振り分けます。コピーできる baseURL と呼び出し例も表示します。'), img: P + 'router.png', alt: L('模型转发', 'Model router', 'モデルルーター') },
    ],
  },
  {
    slug: 'ai-network', heroShots: [{ img: P + 'net.png', cap: L('概览', 'Overview', '概要') }, { img: P + 'net-conn.webp', cap: L('连通性', 'Reachability', '到達性') }, { img: P + 'net-app.webp', cap: L('按应用', 'By app', 'アプリ別') }, { img: P + 'net-nic.webp', cap: L('网卡', 'Interfaces', 'インタフェース') }], group: 'works',
    name: L('AI 网络', 'AI network', 'AI ネットワーク'),
    kicker: L('SoiaWorks 工坊 · 插件', 'SoiaWorks workshop · plugin', 'SoiaWorks · プラグイン'),
    tagline: L('Agent 卡住了，是它的问题，还是网的问题？', 'The agent is stuck — is it the agent, or the network?', 'Agent が止まった。原因は Agent か、ネットワークか。'),
    lead: L(
      'Coding Agent 离不开网络。AI 网络这一页回答三个问题：这台机器到各家 AI 服务通不通、流量是从哪条路出去的、是哪个应用在占带宽。核心管理能力断网时仍然可用。',
      'Coding agents live on the network. This page answers three questions: can this machine reach each AI service, which path does the traffic take, and which app is using the bandwidth. Core management keeps working offline.',
      'Coding Agent はネットワークなしでは動きません。このページは三つの問いに答えます。各 AI サービスに届くか、通信はどの経路を通るか、どのアプリが帯域を使っているか。主要な管理機能はオフラインでも動作します。',
    ),
    hero: P + 'net.png',
    heroAlt: L('SoiaDeck AI 网络', 'SoiaDeck AI network', 'SoiaDeck AI ネットワーク'),
    sections: [
      { id: 'overview', img: P + 'net.png', alt: L('AI 网络 · 概览', 'AI network · overview', 'AI ネットワーク · 概要'), title: L('概览：速度、延迟、连通性', 'Overview: speed, latency, reachability', '概要：速度・遅延・到達性'), body: L('下行、上行和延迟的实时曲线；直连能通几家、走代理能通几家；出公网的流量和本机回环的流量分开看。', 'Live curves for download, upload and latency; how many services are reachable directly and through a proxy; internet-bound and loopback traffic shown separately.', '下り・上り・遅延のリアルタイム推移、直接および代理経由で届くサービス数、外向き通信とループバック通信を分けて表示します。') },
      { id: 'notable', preview: true, img: P + 'net-notable.webp', alt: L('AI 网络 · 值得一看', 'AI network · worth a look', 'AI ネットワーク · 要注目'), title: L('值得一看：把异常挑出来', 'Worth a look: the anomalies picked out', '要注目：異常を抜き出す'), body: L('不用自己盯曲线。某家服务走代理不通、某个进程占了大部分出公网流量、最近一段时间有一次下行飙高，这类事会被单独列出来，并说明影响。', 'You do not have to stare at curves. A service unreachable through the proxy, one process taking most of the outbound traffic, a recent download spike — these are listed on their own with what they affect.', 'グラフを見続ける必要はありません。代理経由で届かないサービス、外向き通信の大半を占めるプロセス、直近の下りスパイクなどを個別に挙げ、影響も示します。') },
      { id: 'views', title: L('四个视角', 'Four views', '四つの視点'), body: L('概览、连通性、按应用、网卡四个标签。排查时先看连通性确定是不是网的问题，再按应用找出是谁在用。', 'Tabs for overview, reachability, by app and interfaces. When troubleshooting, check reachability to see whether it is the network, then go by app to find who is using it.', '概要・到達性・アプリ別・インタフェースの四つのタブ。まず到達性でネットワークの問題かを切り分け、次にアプリ別で使用元を特定します。') },
    ],
  },
  {
    slug: 'workbench', heroShots: [{ img: P + 'wb-session.webp', cap: L('对话', 'Session', 'セッション') }, { img: P + 'workbench.png', cap: L('审批卡', 'Approval card', '承認カード') }, { img: P + 'wbx-model.webp', cap: L('切换 Agent', 'Switch agents', 'Agent 切替') }, { img: P + 'wbx-changes.webp', cap: L('改动', 'Changes', '変更') }, { img: P + 'wbx-split.webp', cap: L('并排', 'Side by side', '並列表示') }, { img: P + 'wb-plans.webp', cap: L('计划', 'Plans', '計画') }, { img: P + 'wb-bot.webp', cap: L('DeckBot', 'DeckBot', 'DeckBot') }], group: 'works',
    name: L('作业台', 'Workbench', '作業台'),
    kicker: L('SoiaWorks 工坊 · 插件', 'SoiaWorks workshop · plugin', 'SoiaWorks · プラグイン'),
    tagline: L('和 AI 一起改项目的地方。', 'Where you and your agents change a project together.', 'AI と一緒にプロジェクトを変える場所。'),
    lead: L(
      '作业台是 SoiaDeck 里用得最多的一页：选好项目、分支和工作树，说一句要做什么，然后看着 Agent 干活、在它要动手前拍板、随时查看它改了什么。同一套界面驱动不同的 Coding Agent。',
      'The workbench is where most of the time goes: pick a project, branch and worktree, say what you want, then watch the agent work, decide before it acts and review what it changed. One interface drives different coding agents.',
      '作業台は SoiaDeck で最も長く使う画面です。プロジェクト・ブランチ・Worktree を選び、やりたいことを伝え、Agent の作業を見守り、実行前に判断し、変更を確認します。同じ画面で異なる Coding Agent を動かせます。',
    ),
    hero: P + 'wb-session.webp',
    heroAlt: L('SoiaDeck 作业台对话', 'SoiaDeck workbench session', 'SoiaDeck 作業台のセッション'),
    sections: [
      {
        id: 'start', shots: [{ img: P + 'wb-home.png', cap: L('首页：一个输入框', 'Home: one composer', 'ホーム：入力欄ひとつ') }, { img: P + 'wbx-model.webp', cap: L('选 Agent 和模型', 'Pick agent and model', 'Agent とモデルを選択') }, { img: P + 'wbx-perm.webp', cap: L('权限模式', 'Permission modes', '権限モード') }], title: L('从一句话开始', 'Start from one sentence', '一言から始める'),
        body: L('首页只有一个输入框。上面一行选项目、分支、要不要开工作树；下面一行选 Agent、模型、推理强度和权限模式。', 'The home view is one composer. The row above it picks project, branch and whether to use a worktree; the row below picks agent, model, reasoning effort and permission mode.', 'ホームは入力欄ひとつ。上の行でプロジェクト・ブランチ・Worktree、下の行で Agent・モデル・推論強度・権限モードを選びます。'),
        points: [L('权限五档：每次都问、自动接受编辑、计划模式、完全访问、自动判断', 'Five permission modes: ask every time, auto-accept edits, plan mode, full access, auto', '権限は五段階：毎回確認／編集を自動承認／計画モード／フルアクセス／自動判断'), L('推理强度单独可调', 'Reasoning effort is set separately', '推論強度は個別に調整'), L('@ 引用文件、/ 调命令', '@ to reference files, / for commands', '@ でファイル参照、/ でコマンド'), L('工作树让每个任务在自己的目录里改，互不干扰', 'A worktree gives each task its own directory so tasks do not collide', 'Worktree でタスクごとに作業ディレクトリを分離')],
       
      },
      {
        id: 'session', title: L('对话：看得见 Agent 在做什么', 'Session: see what the agent is doing', 'セッション：Agent の作業が見える'),
        body: L('每一轮里读了哪些文件、调了什么工具都折叠成一行，要看就展开。上下文快满时会提示自动压缩；底部一条显示轮数、速度、累计用量和缓存命中。', 'Each turn folds file reads and tool calls into single lines you can expand. It tells you when context is being compacted, and a footer shows turns, speed, total usage and cache hits.', '各ターンのファイル読み込みやツール呼び出しは一行に折りたたまれ、必要なら展開できます。コンテキスト圧縮は通知され、下部にターン数・速度・累計使用量・キャッシュ率が表示されます。'),
        points: [L('对话由本机后端持有：关掉窗口继续跑，重开从缓冲重放', 'The local daemon owns the session: it keeps running with the window closed and replays on reopen', 'セッションはローカル daemon が保持。閉じても続行し、再表示で再生'), L('运行中继续发的消息进排队，本轮结束后按顺序投递，可调序、编辑、删除', 'Messages sent mid-run are queued and delivered in order; reorder, edit or delete them', '実行中のメッセージはキューに入り順番に送信。並べ替え・編集・削除が可能'), L('子 Agent 各自在做什么、做完没有，点标题栏就能看', 'Open the title bar to see what each sub-agent is doing and whether it has finished', 'タイトルバーからサブ Agent の作業内容と完了状況を確認'), L('两个对话可以并排开，一边跑一边看另一边', 'Two sessions can sit side by side, one running while you read the other', '二つのセッションを並べて表示し、片方を動かしながらもう片方を確認')],
        shots: [{ img: P + 'wb-session.webp', cap: L('对话与排队消息', 'Session and queue', 'セッションとキュー') }, { img: P + 'wbx-sub.webp', cap: L('子 Agent', 'Sub-agents', 'サブ Agent') }, { img: P + 'wbx-split.webp', cap: L('两个对话并排', 'Two sessions side by side', '二つのセッションを並列表示') }],
      },
      {
        id: 'approvals', shots: [{ img: P + 'workbench.png', cap: L('对话里的审批卡', 'Approval card in a session', 'セッション内の承認カード') }, { img: P + 'wbx-bell.webp', cap: L('铃铛：所有项目里等你的事', 'The bell: everything waiting across projects', 'ベル：全プロジェクトの対応待ち') }, { img: P + 'home.png', cap: L('桌面首页的待处理', 'Pending items on the desktop home', 'デスクトップホームの対応待ち') }], title: L('审批卡：它要动手，你来拍板', 'Approval cards: it wants to act, you decide', '承認カード：実行はあなたが決める'),
        body: L('Agent 要执行命令、写工作区外的文件或联网时，会话里会出现一张卡：要运行的命令原文、风险说明、三个选项。', 'When the agent wants to run a command, write outside the workspace or go online, a card appears in the session with the exact command, a risk note and three choices.', 'コマンド実行・ワークスペース外への書き込み・外部通信の前に、実行内容とリスク説明、三つの選択肢を持つカードが表示されます。'),
        points: [L('不管开着哪个项目，铃铛里汇总所有对话：等你审批的、还在跑的、跑完没看的', 'Whatever project is open, the bell gathers every session: waiting, running, finished and unread', 'どのプロジェクトを開いていても、ベルに全セッションの状態（承認待ち・実行中・完了未読）がまとまる'), L('允许一次 / 本对话内允许 / 拒绝', 'Allow once / allow for this conversation / deny', '今回のみ許可／この会話で許可／拒否'), L('多张待审批逐张处理，可用键盘 A / B / C', 'Several pending cards are handled one at a time, with A / B / C on the keyboard', '複数の承認は一件ずつ。キーボードの A / B / C でも操作'), L('每次决定都进会话记录', 'Every decision is written into the session record', 'すべての判断をセッション記録に保存')],
       
      },
      {
        id: 'multi-agent', title: L('多 Agent，一个窗口里切换', 'Many agents, switched in one window', '複数の Agent を一つのウィンドウで切り替え'),
        body: L('以前每个 Coding Agent 都是自己的终端、自己的登录、自己的用法。作业台把它们收进同一个窗口：这条对话用 Claude Code，下一条换 Codex，再下一条用 dsh，界面、审批、排队、看改动的方式完全一样。', 'Each coding agent used to mean its own terminal, its own login and its own habits. The workbench brings them into one window: Claude Code for this conversation, Codex for the next, dsh for the one after — with the same interface, approvals, queue and way of reviewing changes.', 'これまで Coding Agent ごとにターミナルもログインも使い方も別々でした。作業台はそれらを一つのウィンドウにまとめます。この会話は Claude Code、次は Codex、その次は dsh。画面も承認もキューも変更確認も同じです。'),
        points: [
          L('换 Agent 不用换窗口：在输入框里点一下，左边选 Agent、右边选模型', 'Switch agents without switching windows: one click in the composer, agent on the left, model on the right', 'ウィンドウを替えずに Agent を切り替え。入力欄をクリックし、左で Agent、右でモデル'),
          L('dsh 是 SOIA 深度定制的 Agent：原生审批、会话续接、模型清单、子 Agent、git diff 回退和实时上下文用量都接进了作业台', 'dsh is SOIA’s own deeply customised agent: native approvals, resume, model catalog, sub-agents, git-diff fallback and live context usage are all wired into the workbench', 'dsh は SOIA が深くカスタマイズした Agent。ネイティブ承認・セッション再開・モデル一覧・サブ Agent・git diff フォールバック・リアルタイムのコンテキスト使用量を作業台に統合'),
          L('Agent 管理：哪些装了、什么版本、是否已登录、默认用哪个模型，一页看完；没装的给出安装命令', 'Agent management: which are installed, at what version, signed in or not, and each one’s default model on one page, with install commands for the rest', 'Agent 管理：導入状況・バージョン・ログイン状態・既定モデルを一ページで確認。未導入のものには導入コマンドを表示'),
          L('订阅额度：在对话里点一下就能看这个 Agent 的 5 小时和 7 天额度用了多少、何时重置', 'Subscription quota: one click in the session shows how much of this agent’s 5-hour and 7-day windows is used and when they reset', '契約枠：セッション内のワンクリックで、この Agent の 5 時間枠・7 日枠の使用量とリセット時刻を表示'),
          L('上下文用量：输入框下方常驻显示，快满时提示压缩', 'Context usage: always shown under the composer, with a prompt to compact when it fills up', 'コンテキスト使用量：入力欄の下に常時表示し、上限が近づくと圧縮を案内'),
        ],
        shots: [{ img: P + 'wbx-model.webp', cap: L('在一个窗口里切换 Agent 和模型', 'Switch agent and model in one window', '一つのウィンドウで Agent とモデルを切り替え') }, { img: P + 'wbx-agent.webp', cap: L('Agent 管理：安装、版本、登录、默认模型', 'Agent management: install, version, login, default model', 'Agent 管理：導入・バージョン・ログイン・既定モデル') }, { img: P + 'wbx-ring.webp', cap: L('对话里看订阅额度', 'Subscription quota inside the session', 'セッション内で契約枠を確認') }, { img: P + 'wb-usage.webp', cap: L('套餐用量页', 'Plan usage page', 'プラン使用量ページ') }],
      },
      {
        id: 'agents', agents: true, title: L('支持的 19 个 Coding Agent', 'The 19 coding agents it supports', '対応する 19 種の Coding Agent'),
        body: L('以 SoiaDeck 的静态清单（agent-manifest-index.json）为准：正式支持 4 个（stream-json / app-server / ACP / pi-rpc），试验接入 9 个（统一走 ACP stdio），计划接入 6 个。每个 Agent 的协议、版本要求和认证方式都列在下面，可按状态筛选。', 'Tracked in SoiaDeck’s agent-manifest-index.json: 4 supported (stream-json, app-server, ACP, pi-rpc), 9 experimental (all over ACP stdio) and 6 planned. Protocol, version requirement and auth for each agent are listed below and can be filtered by status.', 'SoiaDeck の静的マニフェスト（agent-manifest-index.json）に基づき、正式対応 4（stream-json / app-server / ACP / pi-rpc）、試験接続 9（ACP stdio）、予定 6。各 Agent のプロトコル・バージョン要件・認証方式を下に示し、ステータスで絞り込めます。'),
      },
      {
        id: 'files', shots: [{ img: P + 'wbx-files.webp', cap: L('文件标签', 'Files tab', 'ファイルタブ') }, { img: P + 'wbx-changes.webp', cap: L('改动标签与提交', 'Changes tab and commit', '変更タブとコミット') }, { img: P + 'wb-files.webp', cap: L('对话旁的改动栏', 'Changes panel beside the session', 'セッション横の変更パネル') }, { img: P + 'wbx-term.webp', cap: L('对话下方的终端', 'Terminal under the session', 'セッション下のターミナル') }], title: L('文件、改动与终端', 'Files, changes and terminal', 'ファイル・変更・ターミナル'),
        body: L('二级栏顶上有「对话 / 文件 / 改动」三个标签。「文件」是这个项目的文件树，被改过的标出来；「改动」列出这次动过的所有文件和增删行数，下面可以直接写提交说明。对话右边还能再开一栏，边聊边看改动。', 'Three tabs sit on top of the sidebar: Conversation, Files and Changes. Files is the project tree with touched files marked; Changes lists every file touched with lines added and removed, with a commit message box below. A panel on the right of the session lets you read changes while you talk.', 'サイドバー上部に「会話 / ファイル / 変更」の三つのタブ。「ファイル」はプロジェクトツリーで、変更されたファイルが分かります。「変更」は変更ファイルと増減行数の一覧で、下にコミットメッセージ欄。セッション右側にもパネルを開き、会話しながら変更を確認できます。'),
        points: [L('要自己跑命令时，终端就开在对话下面，目录是这个对话的工作树', 'When you want to run a command yourself, the terminal opens under the session in its worktree', '自分でコマンドを実行するときは、セッションの下にその Worktree でターミナルを開く'), L('勾选要提交的文件，写一句说明就能提交', 'Tick the files to commit, write a line and commit', 'コミットするファイルを選び、一言書いてコミット'), L('每个任务可以在自己的工作树里改，互不干扰', 'Each task can work in its own worktree without colliding', 'タスクごとに Worktree を分けて干渉を防ぐ')],
      },
      {
        id: 'sidebar', shots: [{ img: P + 'wb-bots.webp', cap: L('Bot 分组与项目树', 'Bot groups and project tree', 'Bot グループとプロジェクトツリー') }, { img: P + 'wbx-wide.webp', cap: L('拖宽后：每条会话用过的 Agent 叠着显示', 'Widened: each session shows the agents it used', '幅を広げると、使った Agent を重ねて表示') }, { img: P + 'wb-settings.webp', cap: L('二级栏的显示方式可以自己定', 'How the sidebar displays is up to you', 'サイドバーの表示は自分で設定') }], title: L('二级栏：所有项目和会话一眼看完', 'Sidebar: every project and session at a glance', 'サイドバー：全プロジェクトとセッションを一望'),
        body: L('上面是常驻的 DeckBot，下面是项目树。每条会话显示用过哪些 Agent、现在是运行中、等你确认还是有未读。', 'DeckBots sit on top, the project tree below. Each session shows which agents it used and whether it is running, waiting for you or unread.', '上に常駐の DeckBot、下にプロジェクトツリー。各セッションは使った Agent と、実行中・確認待ち・未読の状態を表示します。'),
        points: [L('当前 Agent 的图标在最前，状态角标叠在图标右下', 'The current agent icon comes first, with a status badge on its corner', '現在の Agent アイコンが先頭、状態バッジは右下に'), L('Bot 可以分组、拖动整理', 'Bots can be grouped and dragged into order', 'Bot はグループ化とドラッグ整理が可能'), L('运行中的标题有一道从左到右的扫光', 'Running titles carry a left-to-right shimmer', '実行中のタイトルには光が流れる'), L('二级栏窄的时候只留图标，不挤压标题', 'When the sidebar is narrow it keeps the icons and does not squeeze titles', '幅が狭いときはアイコンだけ残し、タイトルを圧迫しない')],
        preview: true,
      },
      {
        id: 'plans', points: [L('全部项目排成一张表：路径、分支、待审批、运行中、未读、最近活动，可搜索筛选', 'All projects in one table — path, branch, pending approvals, running, unread, last activity — searchable', '全プロジェクトを一つの表に（パス・ブランチ・承認待ち・実行中・未読・最終更新）。検索・絞り込み可')], shots: [{ img: P + 'wb-plans.webp', cap: L('计划：拆成若干条，各交给不同 Agent', 'Plans: items handed to different agents', '計画：項目ごとに別の Agent へ') }, { img: P + 'wb-projects.webp', cap: L('全部项目：一张表', 'All projects: one table', '全プロジェクト：一つの表') }], title: L('计划与全部项目', 'Plans and all projects', '計画と全プロジェクト'),
        body: L('一个计划拆成若干条，每条可以交给不同的 Agent，分「进行中 / 待办 / 完成」看进度。', 'A plan breaks into items, each of which can go to a different agent, tracked as in progress, to do and done.', '計画を項目に分け、項目ごとに別の Agent に任せられます。進行中・未着手・完了で進捗を確認。'),
       
      },
      {
        id: 'deckbot', title: L('DeckBot：常驻的小助手', 'DeckBot: assistants that stay on', 'DeckBot：常駐するアシスタント'),
        body: L('像巡检员、CI 守夜、文档官这样的 Bot 一直在，有自己的角色设定、定时任务和记忆；它发现问题会来找你，你也可以直接和它说话。', 'Bots such as a patrol, a CI night watch or a docs keeper stay on with their own role, schedule and memory; they come to you when something is off, and you can talk to them directly.', '巡回・CI の夜間監視・ドキュメント係などの Bot が常駐し、役割・定期タスク・記憶を持ちます。問題があれば知らせ、直接話しかけることもできます。'),
        img: P + 'wb-bot.webp', alt: L('DeckBot 巡检员', 'DeckBot patrol', 'DeckBot 巡回'),
      },
      {
        id: 'settings', shots: [{ img: P + 'wb-settings.webp', cap: L('通用', 'General', '一般') }, { img: P + 'wbx-tree.webp', cap: L('工作树', 'Worktrees', 'Worktree') }, { img: P + 'wbx-git.webp', cap: L('Git', 'Git', 'Git') }, { img: P + 'wbx-agent.webp', cap: L('Agent', 'Agents', 'Agent') }], title: L('作业台设置', 'Workbench settings', '作業台の設定'),
        body: L('通用、工作树、套餐用量、Git、Agent 几个分区。通用里可以调二级栏的显示方式、每页轮数和本地缓存上限。', 'Sections for general, worktrees, usage, Git and agents. General covers how the sidebar displays, turns per page and the local cache limit.', '一般・Worktree・使用量・Git・Agent の各セクション。一般ではサイドバーの表示、1 ページのターン数、ローカルキャッシュ上限を調整できます。'),
       
      },
    ],
  },
  {
    slug: 'account', heroShots: [{ img: P + 'acc-hosts.webp', cap: L('名下主机', 'Bound hosts', '紐付けホスト') }, { img: P + 'acc-login.webp', cap: L('登录', 'Sign in', 'ログイン') }, { img: P + 'acc-bind.webp', cap: L('批准绑定', 'Approve binding', '紐付け承認') }, { img: P + 'acc-devices.webp', cap: L('登录设备', 'Devices', '端末') }, { img: P + 'acc-passkeys.webp', cap: L('Passkey', 'Passkeys', 'Passkey') }], group: 'mobile',
    name: L('账号网页', 'Account web', 'アカウント Web'),
    kicker: L('给使用者的网页 · 可选', 'A web page for users · optional', '利用者向け Web · 任意'),
    tagline: L('名下有哪些电脑、哪些设备登录过，丢了怎么办。', 'Which computers are yours, which devices signed in, and what to do when one is lost.', '自分のパソコン、ログインした端末、紛失時の対処。'),
    lead: L(
      '不登录账号，SoiaDeck 也能完整使用。账号网页解决的是另一件事：电脑不止一台、手机会换会丢的时候，有一个地方能统一看、统一收回。它只管身份和授权，不保存你的对话和代码。',
      'SoiaDeck works fully without an account. The account web solves a different problem: when you have more than one computer and phones get replaced or lost, there is one place to see everything and revoke it. It handles identity and authorisation only and does not store your sessions or code.',
      'SoiaDeck はアカウントなしでもすべて使えます。アカウント Web が解決するのは別の問題です。パソコンが複数あり、スマホを買い替えたり紛失したりしたとき、一か所で確認し失効できます。扱うのは本人確認と認可だけで、セッションやコードは保存しません。',
    ),
    hero: P + 'acc-hosts.webp',
    heroAlt: L('账号网页 · 名下主机', 'Account web · bound hosts', 'アカウント Web · 紐付けホスト'),
    sections: [
      { id: 'login', shots: [{ img: P + 'acc-login.webp', cap: L('登录', 'Sign in', 'ログイン') }, { img: P + 'acc-register.webp', cap: L('注册：需要受邀邮箱', 'Register: invited email required', '登録：招待済みメールが必要') }], title: L('登录：Passkey 优先', 'Sign in: Passkey first', 'ログイン：Passkey 優先'), body: L('推荐用 Passkey（面容、指纹或系统密码），也可以用发到邮箱的 6 位验证码。注册需要受邀邮箱。', 'Passkey is recommended (face, fingerprint or system password); a six-digit code sent to your email also works. Registration needs an invited email.', 'Passkey（顔・指紋・システムパスワード）を推奨。メールに届く 6 桁コードでもログインできます。登録には招待済みメールが必要です。'), },
      { id: 'bind', points: [L('名下主机：每台电脑的指纹、在线状态、最后在线时间，可以解绑；下面是各主机经中继的用量', 'Bound hosts: fingerprint, online state and last seen for each computer, with unbind; relay usage per host below', '紐付けホスト：各パソコンの指紋・オンライン状態・最終オンライン。解除も可能。下に各ホストのリレー使用量')], shots: [{ img: P + 'acc-bind.webp', cap: L('批准绑定：核对绑定码和指纹', 'Approve binding: check code and fingerprint', '紐付け承認：コードと指紋を確認') }, { img: P + 'acc-hosts.webp', cap: L('名下主机与中继用量', 'Bound hosts and relay usage', '紐付けホストとリレー使用量') }], title: L('绑定电脑与名下主机', 'Binding a computer and your hosts', 'パソコンの紐付けとホスト一覧'), body: L('电脑上出一个绑定码，你在网页上核对绑定码和主机指纹，一致再批准。只批准你面前的那台。', 'The computer shows a binding code; on the web you check the code and the host fingerprint and approve only if they match — and only for the machine in front of you.', 'パソコンに表示された紐付けコードとホスト指紋を Web で確認し、一致した場合のみ承認します。目の前のマシンだけを承認してください。'), },
      { id: 'devices', points: [L('主机回执：收回请求发给了哪些主机、各自执行了没有，一条条列出；不在线的写明已跳过', 'Host receipts: which hosts received a revocation and whether each carried it out; offline ones are shown as skipped', '受領記録：失効リクエストの送信先ホストと実行結果を一件ずつ表示。オフラインはスキップと記録')], shots: [{ img: P + 'acc-devices.webp', cap: L('登录设备：丢了就标记', 'Devices: mark it when lost', '端末：紛失したらマーク') }, { img: P + 'acc-receipts.webp', cap: L('主机回执：收回生效了没有', 'Host receipts: did the revocation land', '受領記録：失効が効いたか') }], title: L('登录设备与收回', 'Devices and revocation', '端末と失効'), body: L('登录过这个账号的手机和浏览器都列在这里。手机丢了，点「标记丢失」：它立即退出登录，并通知各主机收回对它的授权。', 'Phones and browsers that signed in are listed here. If a phone is lost, mark it: it is signed out at once and each host is told to revoke its authorisation.', 'ログインしたスマホやブラウザを一覧表示。紛失したら「紛失としてマーク」。即座にログアウトし、各ホストに認可の失効を通知します。'), },
      { id: 'passkeys', points: [L('Passkey 全丢了可以用邮箱恢复，但要等 24 小时，期间可一键取消', 'Lose every Passkey and you can recover by email after a 24-hour wait that you can cancel in one click', 'すべての Passkey を失ってもメールで復旧可能。24 時間の待機中はワンクリックで取り消せる'), L('删除账号先解绑所有主机，30 天后才彻底清除', 'Deleting an account unbinds all hosts first and is final only after 30 days', 'アカウント削除はまず全ホストを解除し、30 日後に完全消去')], shots: [{ img: P + 'acc-passkeys.webp', cap: L('我的 Passkey', 'My Passkeys', 'Passkey の管理') }, { img: P + 'acc-recover.webp', cap: L('恢复账号：等 24 小时', 'Recover: a 24-hour wait', '復旧：24 時間の待機') }, { img: P + 'acc-delete.webp', cap: L('删除账号：30 天后清除', 'Delete: final after 30 days', '削除：30 日後に消去') }], title: L('Passkey、恢复与删除', 'Passkeys, recovery and deletion', 'Passkey・復旧・削除'), body: L('添加或移除 Passkey，建议至少留两把，比如一把在手机里、一把是安全密钥。账号至少要留一把。', 'Add or remove Passkeys; keeping at least two is wise — one on your phone and one security key, say. The account must keep at least one.', 'Passkey の追加・削除。スマホとセキュリティキーなど、二つ以上の登録を推奨。少なくとも一つは必要です。'), },
    ],
  },
  {
    slug: 'mobile', group: 'mobile',
    name: L('手机端', 'Mobile', 'モバイル'),
    kicker: L('随身的窗口', 'The window you carry', '持ち歩ける窓'),
    tagline: L('人不在电脑前，事情照样能推进。', 'Not at your desk, and the work still moves.', '席にいなくても、作業は進む。'),
    lead: L(
      '手机端是一个网页，不用装 App，加到主屏后像 App 一样打开。它连回你自己的电脑：看对话进度、回消息、批准或拒绝、看改动、必要时叫停。对话和代码始终在电脑上，手机只是一个远程的窗口。',
      'The mobile surface is a web page — nothing to install, and it opens like an app once added to the home screen. It connects back to your own computer to follow sessions, reply, approve or deny, read changes and stop a turn. Sessions and code stay on the computer; the phone is a remote window.',
      'モバイルは Web ページで、インストール不要。ホーム画面に追加すればアプリのように開けます。自分のパソコンに接続し、進捗確認・返信・承認／拒否・変更の閲覧・停止ができます。セッションもコードもパソコンに残り、スマホは遠隔の窓です。',
    ),
    heroPhones: [
      { img: P + 'ph-chat.webp', cap: L('对话', 'Session', 'セッション') },
      { img: P + 'ph-approve.webp', cap: L('批准', 'Approve', '承認') },
      { img: P + 'ph-diff.webp', cap: L('看改动', 'Read the diff', 'Diff を見る') },
      { img: P + 'ph-drawer.webp', cap: L('侧滑抽屉', 'Drawer', 'ドロワー') },
    ],
    sections: [
      {
        id: 'pair', title: L('配对：扫码，再核对 6 位码', 'Pairing: scan, then check a 6-digit code', 'ペアリング：スキャンして 6 桁コードを確認'),
        body: L('电脑上出一个二维码，手机扫；两边显示的 6 位核对码一致才继续，然后选这台手机能做什么。授权有有效期，到期重新配对。', 'The computer shows a QR code and the phone scans it; you continue only if the 6-digit code matches on both sides, then choose what this phone may do. Authorisation expires and is renewed by pairing again.', 'パソコンに表示された QR をスマホで読み取り、両方の 6 桁コードが一致したら続行。このスマホに許可する操作を選びます。認可には有効期限があり、期限後は再ペアリングします。'),
        points: [L('主机列表里看每台电脑的指纹、上次连接和授权到期时间', 'The host list shows each computer’s fingerprint, last connection and expiry', 'ホスト一覧で指紋・最終接続・有効期限を確認'), L('同一局域网直连；不在一起时经加密中继，中继看不到内容', 'Direct on the same LAN; through an encrypted relay elsewhere, and the relay cannot read the content', '同一 LAN では直接、外では暗号化リレー経由。リレーは内容を見られません')],
        phones: [{ img: P + 'ph-pair.webp', cap: L('核对码', 'Check code', '確認コード') }, { img: P + 'ph-hosts.webp', cap: L('主机', 'Hosts', 'ホスト') }],
      },
      {
        id: 'chat', title: L('对话：看进度、回消息', 'Session: follow along and reply', 'セッション：進捗を見て返信'),
        body: L('和桌面是同一条对话。Agent 还在跑的时候发的消息会排队；它需要你选的时候，直接在气泡里点选项。', 'It is the same conversation as on the desktop. Messages sent while the agent is running are queued; when it needs a choice, you tap one right in the thread.', 'デスクトップと同じ会話です。実行中に送ったメッセージはキューに入り、選択が必要なときはその場で選べます。'),
        points: [L('顶上一条常驻显示连的是哪台主机、是否经中继', 'A strip at the top always shows which host you are on and whether it is via relay', '上部に接続中のホストとリレー経由かどうかを常時表示'), L('「另有 N 个对话等你处理」一点就到', 'A “N more waiting for you” bar takes you straight there', '「他に N 件が対応待ち」バーからすぐ移動')],
        phones: [{ img: P + 'ph-chat.webp', cap: L('对话', 'Session', 'セッション') }, { img: P + 'ph-queue.webp', cap: L('运行中 · 排队', 'Running · queued', '実行中 · キュー') }, { img: P + 'ph-ask.webp', cap: L('Agent 提问', 'Agent asks', 'Agent の質問') }],
      },
      {
        id: 'approve', title: L('审批：在手机上放行或拒绝', 'Approvals: allow or deny from the phone', '承認：スマホで許可・拒否'),
        body: L('待批准的事从底部抽上来：要做什么、在哪个对话、哪台主机，一屏看完再决定。通知页把所有等你处理的事排在一起。', 'A pending request slides up from the bottom: what it wants to do, in which conversation, on which host — read it, then decide. The notifications page lines up everything waiting on you.', '承認待ちは下からシートで表示。何を・どの会話で・どのホストで行うかを確認してから判断します。通知ページには対応待ちがまとまります。'),
        points: [L('批准、拒绝，或对给定范围始终允许', 'Approve, deny, or always allow for the given scope', '承認・拒否、または指定範囲を常に許可'), L('通知里可以直接批、直接拒', 'Approve or deny straight from a notification', '通知から直接承認・拒否')],
        phones: [{ img: P + 'ph-approve.webp', cap: L('待批准', 'Pending', '承認待ち') }, { img: P + 'ph-notify.webp', cap: L('通知', 'Notifications', '通知') }],
      },
      {
        id: 'review', title: L('看改动，必要时止损', 'Read the changes, stop when you must', '変更を見て、必要なら止める'),
        body: L('先看这次对话动了哪些文件，再逐个文件看 Diff；手机上只能看，不能改。觉得跑偏了，停掉这一轮。', 'See which files the conversation touched, then read the diff file by file; the phone can read, not edit. If it has gone off track, stop the turn.', 'このセッションで変更されたファイルを確認し、ファイルごとに Diff を閲覧。スマホでは閲覧のみで編集はできません。逸れたと感じたらターンを停止します。'),
        points: [L('停止本轮不删除对话，也不清空排队的消息', 'Stopping a turn does not delete the conversation or clear the queue', 'ターン停止では会話もキューも消えません')],
        phones: [{ img: P + 'ph-files.webp', cap: L('改动文件', 'Changed files', '変更ファイル') }, { img: P + 'ph-diff.webp', cap: L('Diff', 'Diff', 'Diff') }, { img: P + 'ph-stop.webp', cap: L('停止本轮', 'Stop the turn', 'ターン停止') }],
      },
      {
        id: 'nav', title: L('一只手够用的导航', 'Navigation that works with one hand', '片手で使えるナビゲーション'),
        body: L('入口都收在侧滑抽屉里：新对话、对话列表、通知、主机、Agent、远程访问、设置，下面直接列出等你处理和运行中的对话。输入框固定在底部。', 'Everything lives in a side drawer — new conversation, list, notifications, hosts, agents, remote access, settings — with waiting and running sessions listed right below. The composer stays at the bottom.', '入口はサイドドロワーに集約（新規会話・一覧・通知・ホスト・Agent・リモートアクセス・設定）。その下に対応待ちと実行中のセッションが並び、入力欄は下部に固定です。'),
        phones: [{ img: P + 'ph-drawer.webp', cap: L('侧滑抽屉', 'Drawer', 'ドロワー') }],
      },
      {
        id: 'failure', title: L('连不上的时候，告诉你为什么', 'When it cannot connect, it says why', 'つながらないときは理由を伝える'),
        body: L('主机不在线、中继不通、授权过期、版本不匹配……连不上有十几种原因，每一种都有自己的失败页，写明发生了什么、你能做什么，并带一个可以复制的错误码。中继维护时会在 90 秒内自动续上。', 'Host offline, relay unreachable, authorisation expired, version mismatch — there are more than a dozen ways to fail, and each has its own page saying what happened and what you can do, with an error code you can copy. During relay maintenance it reconnects within 90 seconds.', 'ホストがオフライン、リレー不通、認可切れ、バージョン不一致など、十数種類の失敗それぞれに専用ページがあり、何が起きたか・何ができるかとコピー可能なエラーコードを示します。リレーのメンテナンス時は 90 秒以内に自動再接続します。'),
      },
    ],
  },
];

export const DECK_SUBPAGE_SLUGS: readonly string[] = DECK_SUBPAGES.map((p) => p.slug);

export function deckSubpageTitle(slug: string, locale: LandingLocaleCode): string | null {
  const page = DECK_SUBPAGES.find((p) => p.slug === slug);
  if (!page) return null;
  const l = locale === 'zh' ? 'zh' : locale === 'ja' ? 'ja' : 'en';
  return `SoiaDeck · ${page.name[l]}`;
}

/** 主题套装：21 套。前 5 套带一幅用代码画的、会动的景（设计预览），后 16 套是经典配色与背景。 */
const PACKS: readonly { id: string; scene?: boolean; name: T }[] = [
  { id: 'set-pixel', scene: true, name: L('像素 · 星夜', 'Pixel · Starry Night', 'ピクセル · 星夜') },
  { id: 'set-pixel-day', scene: true, name: L('像素 · 晴日', 'Pixel · Sunny Day', 'ピクセル · 晴日') },
  { id: 'set-neon', scene: true, name: L('霓虹 · 雨夜', 'Neon · Rainy Night', 'ネオン · 雨夜') },
  { id: 'set-astro', scene: true, name: L('星图', 'Star Chart', '星図') },
  { id: 'set-aurora', scene: true, name: L('极光', 'Aurora', 'オーロラ') },
  { id: 'default', name: L('默认 · 暮色山峦', 'Default · Dusk Hills', 'デフォルト · 夕暮れの山並み') },
  { id: 'polar', name: L('极夜', 'Polar Night', '極夜') },
  { id: 'meadow', name: L('水彩原野', 'Watercolour Meadow', '水彩の草原') },
  { id: 'dune', name: L('琥珀沙丘', 'Amber Dunes', '琥珀の砂丘') },
  { id: 'glacier', name: L('冰川', 'Glacier', '氷河') },
  { id: 'forest', name: L('林间', 'Forest', '森') },
  { id: 'deep', name: L('深海', 'Deep Sea', '深海') },
  { id: 'sakura', name: L('樱粉', 'Sakura', '桜') },
  { id: 'aurora', name: L('极光紫', 'Aurora Violet', 'オーロラバイオレット') },
  { id: 'ember', name: L('余烬', 'Ember', '残り火') },
  { id: 'bokeh', name: L('虚焦夜', 'Bokeh Night', 'ボケの夜') },
  { id: 'glass', name: L('云白玻璃', 'Cloud Glass', 'クラウドグラス') },
  { id: 'sage', name: L('鼠尾草', 'Sage', 'セージ') },
  { id: 'mono', name: L('石墨极简', 'Graphite Minimal', 'グラファイト') },
  { id: 'ascii', name: L('ASCII 星球', 'ASCII Planet', 'ASCII プラネット') },
  { id: 'asciil', name: L('ASCII 浪', 'ASCII Waves', 'ASCII ウェーブ') },
];

export function PackGallery({ locale }: { locale: LandingLocaleCode }) {
  const l = locale === 'zh' ? 'zh' : locale === 'ja' ? 'ja' : 'en';
  const tx = (v: T) => v[l];
  const [cur, setCur] = useState(0);
  const pack = PACKS[cur] ?? PACKS[0];
  const img = (id: string) => `/soia/products/soiadeck-pack-${id}.webp`;
  return (
    <div className="dk-packs">
      <ZoomableFigure src={img(pack.id)} alt={`SoiaDeck · ${tx(pack.name)}`} locale={locale} className="dk-shot" />
      <p className="dk-packs-cur">
        <strong>{tx(pack.name)}</strong>
        {pack.scene ? <span className="dk-preview-tag">{tx(L('会动的景 · 设计预览', 'Animated scene · design preview', '動く景色 · デザインプレビュー'))}</span> : null}
        <em>{cur + 1} / {PACKS.length}</em>
      </p>
      <div className="dk-packs-grid" role="tablist" aria-label={tx(L('主题套装', 'Theme packs', 'テーマパック'))}>
        {PACKS.map((pk, i) => (
          <button type="button" role="tab" aria-selected={cur === i} className={cur === i ? 'is-on' : undefined} key={pk.id} onClick={() => setCur(i)}>
            <img src={img(pk.id)} alt="" loading="lazy" />
            <span>{tx(pk.name)}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

/** 一个框里放多张图：鼠标按住左右拖、触控板或滚轮横向滑、点两侧箭头或下面的圆点都能换；点图片看大图。 */
function ShotCarousel({ shots, locale, label }: { shots: Phone[]; locale: LandingLocaleCode; label: string }) {
  const l = locale === 'zh' ? 'zh' : locale === 'ja' ? 'ja' : 'en';
  const ref = useRef<HTMLDivElement>(null);
  const drag = useRef({ on: false, x: 0, left: 0, moved: false });
  const [cur, setCur] = useState(0);
  const go = (i: number) => {
    const el = ref.current;
    if (!el) return;
    const n = Math.max(0, Math.min(shots.length - 1, i));
    el.scrollTo({ left: n * el.clientWidth, behavior: 'smooth' });
  };
  // 松手时：拖过框宽的 12% 就翻到那一侧的下一张，否则弹回原位
  const settle = () => {
    const d = drag.current;
    const el = ref.current;
    if (!d.on || !el) return;
    d.on = false;
    // 先滑到目标再恢复吸附，否则吸附会立刻把它拉回最近的一张
    window.setTimeout(() => el.classList.remove('is-drag'), 420);
    const w = Math.max(1, el.clientWidth);
    const from = Math.round(d.left / w);
    const delta = el.scrollLeft - d.left;
    go(Math.abs(delta) > w * 0.12 ? from + (delta > 0 ? 1 : -1) : from);
  };
  const prevLabel = l === 'zh' ? '上一张' : l === 'ja' ? '前へ' : 'Previous';
  const nextLabel = l === 'zh' ? '下一张' : l === 'ja' ? '次へ' : 'Next';
  return (
    <div className="dk-car" role="group" aria-roledescription="carousel" aria-label={label}>
      <div className="dk-car-frame">
        <div className="dk-car-view">
        <div
          className="dk-car-track"
          ref={ref}
          tabIndex={0}
          onScroll={(e) => { const el = e.currentTarget; setCur(Math.round(el.scrollLeft / Math.max(1, el.clientWidth))); }}
          onKeyDown={(e) => { if (e.key === 'ArrowRight') { e.preventDefault(); go(cur + 1); } if (e.key === 'ArrowLeft') { e.preventDefault(); go(cur - 1); } }}
          onPointerDown={(e) => { if (e.pointerType !== 'mouse' || !ref.current) return; drag.current = { on: true, x: e.clientX, left: ref.current.scrollLeft, moved: false }; ref.current.classList.add('is-drag'); }}
          onPointerMove={(e) => { const d = drag.current; if (!d.on || !ref.current) return; const dx = e.clientX - d.x; if (Math.abs(dx) > 5) d.moved = true; ref.current.scrollLeft = d.left - dx; }}
          onPointerUp={() => settle()}
          onPointerLeave={() => settle()}
          onClickCapture={(e) => { if (drag.current.moved) { e.stopPropagation(); e.preventDefault(); drag.current.moved = false; } }}
        >
          {shots.map((sh) => (
            <div className="dk-car-slide" key={sh.img}>
              <ZoomableFigure src={sh.img} alt={`SoiaDeck · ${sh.cap[l]}`} locale={locale} lazy className="dk-car-fig" />
            </div>
          ))}
        </div>
        </div>
        {shots.length > 1 && (
          <>
            <button type="button" className="dk-car-nav is-prev" aria-label={prevLabel} disabled={cur === 0} onClick={() => go(cur - 1)}>‹</button>
            <button type="button" className="dk-car-nav is-next" aria-label={nextLabel} disabled={cur === shots.length - 1} onClick={() => go(cur + 1)}>›</button>
          </>
        )}
      <div className="dk-car-dock">
        {shots.length > 1 && (
          <div className="dk-car-thumbs" role="tablist" aria-label={label}>
            {shots.map((sh, i) => (
              <button type="button" role="tab" key={sh.img} title={sh.cap[l]} aria-label={sh.cap[l]} aria-selected={cur === i} className={cur === i ? 'is-on' : undefined} onClick={() => go(i)}>
                <img src={sh.img} alt="" loading="lazy" draggable={false} />
              </button>
            ))}
          </div>
        )}
        <p><b>{shots[cur]?.cap[l]}</b>{shots.length > 1 && <em>{cur + 1} / {shots.length}</em>}</p>
      </div>
      </div>
    </div>
  );
}

/** Tabs shared by the SoiaDeck overview and its sub-pages. */
export function DeckSubnav({ locale, active }: { locale: LandingLocaleCode; active: string }) {
  const l = locale === 'zh' ? 'zh' : locale === 'ja' ? 'ja' : 'en';
  const href = (path: string) => hrefFor(path, locale);
  const groups: { key: Group; label: T }[] = [
    { key: 'deck', label: L('SoiaDeck 桌面', 'SoiaDeck desktop', 'SoiaDeck デスクトップ') },
    { key: 'works', label: L('SoiaWorks 工坊 · 插件', 'SoiaWorks · plugins', 'SoiaWorks · プラグイン') },
    { key: 'mobile', label: L('随身与账号', 'On the go & account', 'モバイルとアカウント') },
  ];
  const link = (slug: string, name: T) => (
    <a key={slug || 'overview'} href={href(slug ? `/soiadeck/${slug}/` : '/soiadeck/')} className={active === slug ? 'is-active' : undefined} aria-current={active === slug ? 'page' : undefined}>
      {name[l]}
    </a>
  );
  return (
    <nav className="dk-subnav" aria-label="SoiaDeck">
      {link('', L('总览', 'Overview', '概要'))}
      {groups.map((g) => (
        <span className="dk-subnav-group" key={g.key}>
          <em>{g.label[l]}</em>
          {DECK_SUBPAGES.filter((p) => p.group === g.key).map((p) => link(p.slug, p.name))}
        </span>
      ))}
    </nav>
  );
}

export function SoiaDeckSubPage({ locale, slug }: { locale: LandingLocaleCode; slug: string }) {
  const l = locale === 'zh' ? 'zh' : locale === 'ja' ? 'ja' : 'en';
  const tx = (v: T) => v[l];
  const href = (path: string) => hrefFor(path, locale);
  const page = DECK_SUBPAGES.find((p) => p.slug === slug) ?? DECK_SUBPAGES[0];
  const idx = DECK_SUBPAGES.indexOf(page);
  const next = DECK_SUBPAGES[(idx + 1) % DECK_SUBPAGES.length];
  const previewTag = <span className="dk-preview-tag">{tx(L('设计预览', 'Design preview', 'デザインプレビュー'))}</span>;
  const phoneRow = (phones: Phone[], big = false) => (
    <div className={`dk-phones${big ? ' is-hero' : ''}`}>
      {phones.map((ph) => (
        <figure key={ph.img}>
          <img src={ph.img} alt={`SoiaDeck ${tx(ph.cap)}`} loading="lazy" />
          <figcaption>{tx(ph.cap)}</figcaption>
        </figure>
      ))}
    </div>
  );
  return (
    <SubpageLayout active="product" locale={locale}>
      <article className="missing-page dk-page dk-sub">
        <nav className="breadcrumb" aria-label="breadcrumb">
          <a href={href('/')}>SOIA</a><span>/</span><a href={href('/soiadeck/')}>SoiaDeck</a><span>/</span><span>{tx(page.name)}</span>
        </nav>
        <DeckSubnav locale={locale} active={page.slug} />
        <header className="dk-hero">
          <span className="label">SoiaDeck · {tx(page.kicker)}</span>
          <h1 className="display">{tx(page.name)}</h1>
          <p className="dk-tagline">{tx(page.tagline)}</p>
          <p className="lead">{tx(page.lead)}</p>
          <p className="dk-note">{tx(L('本页截图来自 SoiaDeck 设计原型，界面文字为中文；标「设计预览」的部分还没进产品。', 'Screenshots on this page come from the SoiaDeck design prototype and show the Chinese UI; parts marked “Design preview” are not in the product yet.', 'このページの画面は SoiaDeck のデザインプロトタイプ（中国語 UI）です。「デザインプレビュー」と記した部分はまだ製品に入っていません。'))}</p>
        </header>
        {page.heroShots ? <section className="deck-showcase"><ShotCarousel shots={page.heroShots} locale={locale} label={tx(page.name)} /></section> : page.heroPhones ? phoneRow(page.heroPhones, true) : page.hero ? (
          <section className="deck-showcase"><ZoomableFigure src={page.hero} alt={tx(page.heroAlt ?? page.name)} locale={locale} className="dk-shot" /></section>
        ) : null}
        <nav className="dk-nav" aria-label={tx(L('本页内容', 'On this page', '目次'))}>
          {page.sections.map((s) => <a href={`#${s.id}`} key={s.id}>{tx(s.title).split(/[：:]/)[0]}</a>)}
        </nav>
        {page.sections.map((s, i) => {
          const text = (
            <div className="dk-feature-text">
              <span className="dk-kicker">{String(i + 1).padStart(2, '0')}{s.preview ? previewTag : null}</span>
              <h2>{tx(s.title)}</h2>
              <p>{tx(s.body)}</p>
              {s.points ? <ul>{s.points.map((pt) => <li key={pt.en}>{tx(pt)}</li>)}</ul> : null}
            </div>
          );
          const strip = s.shots ? <ShotCarousel shots={s.shots} locale={locale} label={tx(s.title)} /> : null;
          if (s.packs) return <section className="dk-block dk-agent-sec" id={s.id} key={s.id}>{text}<PackGallery locale={locale} /></section>;
          if (s.agents) return <section className="dk-block dk-agent-sec" id={s.id} key={s.id}>{text}<AgentMatrix locale={locale} /></section>;
          if (strip) return <section className="dk-block dk-agent-sec" id={s.id} key={s.id}>{text}{strip}</section>;
          if (s.phones) return <section className={`dk-feature dk-feature-phones${i % 2 ? ' is-flip' : ''}`} id={s.id} key={s.id}>{text}{phoneRow(s.phones)}</section>;
          if (s.img && !(i === 0 && s.img === page.hero)) return <section className={`dk-feature${i % 2 ? ' is-flip' : ''}`} id={s.id} key={s.id}>{text}<ZoomableFigure src={s.img} alt={tx(s.alt ?? s.title)} locale={locale} lazy className="dk-shot" /></section>;
          return <section className="dk-feature is-text" id={s.id} key={s.id}>{text}</section>;
        })}
        <section className="dk-block dk-more">
          <a className="dk-next" href={href(`/soiadeck/${next.slug}/`)}>
            <span>{tx(L('接着看', 'Next', '次へ'))}</span>
            <strong>{tx(next.name)} →</strong>
            <em>{tx(next.tagline)}</em>
          </a>
          <div className="missing-cta">
            <a className="btn btn-primary" href={href('/soiadeck/')}>{tx(L('回到 SoiaDeck 总览', 'Back to SoiaDeck overview', 'SoiaDeck 概要に戻る'))}</a>
            <a className="btn btn-ghost" href={href('/soiadeck/#agents')}>{tx(L('19 个 Agent 接入清单', '19-agent matrix', '19 Agent 対応表'))}</a>
          </div>
        </section>
      </article>
    </SubpageLayout>
  );
}
