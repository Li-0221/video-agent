const PAGE_FILES = {
  dashboard: "dashboard.html",
  workspace: "workspace.html",
  chat: "chat.html",
  templates: "templates.html",
  tasks: "tasks.html",
  review: "review.html",
  assets: "assets.html",
  publish: "publish.html",
  org: "org.html",
  ops: "ops.html"
};

const NAV_ITEMS = [
  { id: "dashboard", label: "首页工作台", icon: "01" },
  { id: "workspace", label: "课程主题工作台", icon: "02" },
  { id: "chat", label: "AI 创作对话室", icon: "03" },
  { id: "templates", label: "模板中心", icon: "04" },
  { id: "tasks", label: "任务与生成结果", icon: "05" },
  { id: "review", label: "审核工作台", icon: "06" },
  { id: "assets", label: "素材资产库", icon: "07" },
  { id: "publish", label: "发布与审计中心", icon: "08" },
  { id: "org", label: "组织与权限中心", icon: "09" },
  { id: "ops", label: "成本与运营中心", icon: "10" }
];

const PAGE_META = {
  login: {
    title: "投标演示版",
    desc: "中小学思政 AI 内容支持平台 · 一期 Web 原型"
  },
  dashboard: {
    title: "首页工作台",
    desc: "以学校与教育局可交付为目标的一期 Web 原型总览。"
  },
  workspace: {
    title: "课程主题工作台",
    desc: "面向教师的主题创建、模板套用与生成入口。"
  },
  chat: {
    title: "AI 创作对话室",
    desc: "通过多轮对话澄清教学目标、镜头重点与表达边界，再生成课程视频。"
  },
  templates: {
    title: "模板中心",
    desc: "统一学段、活动与精品课输出风格。"
  },
  tasks: {
    title: "任务与生成结果",
    desc: "查看脚本、分镜、生成进度与审核流转。"
  },
  review: {
    title: "审核工作台",
    desc: "展示机审、人工复核和发布前留痕能力。"
  },
  assets: {
    title: "素材资产库",
    desc: "沉淀可复用素材资产与字幕模板。"
  },
  publish: {
    title: "发布与审计中心",
    desc: "管理版本、渠道同步和下架回溯。"
  },
  org: {
    title: "组织与权限中心",
    desc: "支持教育局、学校和教研组的多级权限。"
  },
  ops: {
    title: "成本与运营中心",
    desc: "以成本、审核和复用率支撑平台长期运营。"
  }
};

const TEMPLATE_LIBRARY = [
  {
    id: "tpl-hero",
    category: "课程主题",
    title: "英雄人物微课模板",
    tone: "庄重叙事",
    description: "适合讲述榜样人物、生平片段与价值提炼，适配人物精神导入课。",
    scenes: 8
  },
  {
    id: "tpl-history",
    category: "国风历史",
    title: "历史场景分镜模板",
    tone: "写意纪实",
    description: "适合历史事件、节点事件与时代变迁叙述，强调镜头层次与课堂导入。",
    scenes: 10
  },
  {
    id: "tpl-event",
    category: "专题活动",
    title: "节日主题宣讲模板",
    tone: "温和启发",
    description: "适合清明、国庆、学雷锋等专题教育活动，以可感知场景引导学生表达。",
    scenes: 6
  },
  {
    id: "tpl-flagship",
    category: "示范课",
    title: "示范课堂精品模板",
    tone: "镜头精致",
    description: "适合精品课与样板内容，强调镜头节奏、字幕质量与价值提炼收束。",
    scenes: 12
  }
];

const STORAGE_KEY = "video-agent-prototype-v2";
const TOAST_KEY = "video-agent-prototype-toast";
const authRequired = document.body.dataset.auth === "1";
const currentPage = document.body.dataset.page || "login";
const basePath = document.body.dataset.base || ".";
const params = new URLSearchParams(window.location.search);

let state = loadState();

if (params.get("demo") === "1") {
  state.loggedIn = true;
  saveState();
}

function defaultState() {
  return {
    version: 2,
    loggedIn: false,
    user: {
      name: "李老师",
      role: "天府新区实验学校 / 思政教师",
      bidRole: "一期投标演示身份"
    },
    ui: {
      templateFilter: "全部",
      taskFilter: "全部",
      assetFilter: "全部",
      publishFilter: "全部",
      orgNode: "school",
      opsTab: "概览",
      activeTaskId: "task-101",
      activeReviewId: "rv-1",
      activeAssetId: "asset-2",
      activeMemberId: "mb-1",
      activePublishId: "pub-1",
      reviewDrawerOpen: true,
      reviewAuditTab: "text"
    },
    workspaceForm: {
      phase: "小学",
      grade: "五年级",
      edition: "统编版",
      topic: "雷锋精神与当代少年责任",
      goal: "让学生理解雷锋精神的时代价值，并能联系校园生活进行表达。",
      tone: "温和启发",
      duration: "60秒微课",
      templateId: "tpl-event"
    },
    conversation: {
      messages: [
        {
          id: "msg-1",
          role: "assistant",
          kind: "analysis",
          text:
            "我先基于当前主题做一轮澄清：这节视频更适合从校园日常切入，而不是先讲抽象概念。建议先确认三个点：1）希望更偏人物故事还是校园行为案例；2）结尾是课堂提问还是行动倡议；3）整体语气保持温和启发还是更庄重。"
        },
        {
          id: "msg-2",
          role: "user",
          kind: "reply",
          text: "更偏校园行为案例，结尾希望有行动倡议，整体语气保持温和启发。"
        },
        {
          id: "msg-3",
          role: "assistant",
          kind: "analysis",
          text:
            "收到。我会把视频结构收敛为“校园小事 -> 雷锋精神解释 -> 少年行动倡议”。如果用于五年级课堂，我建议控制在 60 秒内，并减少空泛口号，让画面更贴近图书角、值日、志愿服务这些学生熟悉的场景。"
        }
      ],
      summary: {
        audience: "小学五年级",
        angle: "校园日常中的雷锋精神",
        ending: "行动倡议",
        style: "温和启发",
        mustInclude: ["图书角整理", "志愿服务场景", "课堂提问收束"]
      }
    },
    tasks: [
      {
        id: "task-101",
        title: "雷锋精神与当代少年责任",
        templateId: "tpl-event",
        status: "draft",
        owner: "李老师",
        progress: 72,
        updatedAt: "今天 14:35",
        modelChain: "腾讯混元 + MiniMax-Hailuo-2.3-Fast",
        steps: [
          { name: "教学脚本", status: "done" },
          { name: "分镜生成", status: "done" },
          { name: "图片生成", status: "done" },
          { name: "视频合成", status: "active" },
          { name: "字幕配音", status: "todo" }
        ],
        script:
          "从校园日常切入，通过“帮同学整理图书角”“社区志愿清扫”等具体场景，让学生理解雷锋精神并不是遥远口号，而是今天也能做到的真实行动。",
        storyboard: [
          "镜头1：晨光中的校园与书角，字幕引入“什么是雷锋精神”。",
          "镜头2：学生帮助同学整理图书，旁白解释“从小事做起”。",
          "镜头3：社区清扫场景，结尾提出“少年也能成为温暖他人的人”。"
        ],
        riskSummary: "当前风险较低，待视频合成完成后进入机审。"
      },
      {
        id: "task-102",
        title: "钱学森与科技报国",
        templateId: "tpl-hero",
        status: "review",
        owner: "王教研员",
        progress: 100,
        updatedAt: "今天 11:20",
        modelChain: "腾讯混元 + 腾讯云审核中台",
        steps: [
          { name: "教学脚本", status: "done" },
          { name: "分镜生成", status: "done" },
          { name: "图片生成", status: "done" },
          { name: "视频合成", status: "done" },
          { name: "字幕配音", status: "done" }
        ],
        script: "围绕人物精神与国家发展关系展开，适合科技报国主题教育。",
        storyboard: ["人物剪影", "科研场景", "结尾价值升华"],
        riskSummary: "已提交审核，等待人工复核。"
      },
      {
        id: "task-103",
        title: "红旗渠精神导入短片",
        templateId: "tpl-history",
        status: "approved",
        owner: "陈老师",
        progress: 100,
        updatedAt: "昨天 17:40",
        modelChain: "腾讯混元 + Kling Video 3.0",
        steps: [
          { name: "教学脚本", status: "done" },
          { name: "分镜生成", status: "done" },
          { name: "图片生成", status: "done" },
          { name: "视频合成", status: "done" },
          { name: "字幕配音", status: "done" }
        ],
        script: "结合艰苦奋斗与集体精神，适合思政导入片。",
        storyboard: ["山体开凿", "劳动场景", "课堂提问"],
        riskSummary: "审核通过，可进入发布。"
      }
    ],
    reviews: [
      {
        id: "rv-1",
        taskId: "task-102",
        title: "钱学森与科技报国",
        school: "天府新区教师发展中心",
        applicant: "王教研员",
        severity: "中",
        tags: ["人物史实核验", "字幕表述收敛", "发布前复核"],
        machine: "文本安全通过；图像安全通过；视频关键帧命中 1 条表述建议。",
        notes:
          "建议将“世界顶尖”修订为“重要贡献”，避免夸饰性表达；其余内容符合教材一致性要求。",
        auditModules: {
          text: {
            title: "文本审校",
            summary: "已通过文本内容安全与教材一致性规则。",
            points: [
              "角色表述基本准确，无敏感内容命中。",
              "结尾鼓励表达适龄，未超出思政课堂边界。",
              "个别定语略显夸饰，建议收敛为教材表述。"
            ]
          },
          image: {
            title: "图像审校",
            summary: "人物画面、版面和插图符合学校传播规范。",
            points: [
              "人物肖像未出现不合规二创。",
              "背景元素简洁，适合课堂播放。",
              "建议控制红色高饱和区域面积。"
            ]
          },
          video: {
            title: "视频关键帧",
            summary: "镜头节奏稳定，仅 00:18 处字幕与旁白语气偏满。",
            points: [
              "00:05 人物介绍镜头正常。",
              "00:18 关键帧字幕建议修订。",
              "00:31 结尾价值升华镜头可保留。"
            ]
          },
          audio: {
            title: "音频与配音",
            summary: "语速适中，适合中小学课堂播放。",
            points: [
              "语速未超过建议阈值。",
              "配乐音量低于旁白，符合课堂环境。",
              "无情绪化、煽动式表达。"
            ]
          }
        },
        keyframes: [
          { time: "00:05", label: "人物出场", note: "安全通过" },
          { time: "00:18", label: "字幕修订点", note: "建议弱化措辞" },
          { time: "00:31", label: "结尾升华", note: "课堂导向明确" }
        ],
        subtitleSegments: [
          { time: "00:07", text: "钱学森为我国航天事业作出了重要贡献。", level: "safe" },
          { time: "00:18", text: "他是世界顶尖科学家。", level: "warn" },
          { time: "00:33", text: "科技报国不仅是历史，也是今天的使命。", level: "safe" }
        ],
        history: [
          { time: "09:25", title: "输入前审校通过", desc: "未发现敏感词与违禁素材。" },
          { time: "11:08", title: "输出机审完成", desc: "文本、图像安全通过，视频关键帧命中 1 条表述建议。" },
          { time: "11:26", title: "人工复核建议", desc: "建议调整字幕措辞后发布。" }
        ]
      },
      {
        id: "rv-2",
        taskId: "task-101",
        title: "雷锋精神与当代少年责任",
        school: "实验小学五年级组",
        applicant: "李老师",
        severity: "低",
        tags: ["待机审完成"],
        machine: "视频合成中，暂未产出完整审核结果。",
        notes: "等待成片后进入正式审核。",
        auditModules: {
          text: { title: "文本审校", summary: "脚本已通过初步校验。", points: ["表达贴近校园生活。"] },
          image: { title: "图像审校", summary: "待生成完成。", points: ["暂无结果。"] },
          video: { title: "视频关键帧", summary: "待合成完成。", points: ["暂无结果。"] },
          audio: { title: "音频与配音", summary: "待字幕配音完成。", points: ["暂无结果。"] }
        },
        keyframes: [{ time: "00:00", label: "待生成", note: "生成完成后更新" }],
        subtitleSegments: [{ time: "00:00", text: "暂无字幕结果。", level: "safe" }],
        history: [{ time: "14:35", title: "已提交生成", desc: "等待视频合成完成后进入机审。" }]
      }
    ],
    assets: [
      {
        id: "asset-1",
        type: "视频片段",
        title: "校园志愿劳动镜头组",
        source: "审核通过 / 区域共建",
        usage: "已复用 18 次",
        description: "适合劳动教育、责任担当主题视频的通用片段。",
        access: "学校可用 / 区域共享"
      },
      {
        id: "asset-2",
        type: "字幕模板",
        title: "思政微课双栏字幕",
        source: "系统模板",
        usage: "已复用 42 次",
        description: "左侧关键词、右侧释义，适合小学中高段内容讲解。",
        access: "全平台模板"
      },
      {
        id: "asset-3",
        type: "人物模板",
        title: "英雄人物生平模板",
        source: "学校定制",
        usage: "已复用 7 次",
        description: "统一英雄人物类脚本结构、分镜节奏和结尾价值升华。",
        access: "校内模板"
      }
    ],
    publishItems: [
      {
        id: "pub-1",
        taskId: "task-103",
        title: "红旗渠精神导入短片",
        status: "published",
        version: "v1.2",
        channel: "新区资源平台",
        operator: "审核员 张敏",
        updatedAt: "今天 09:20"
      },
      {
        id: "pub-2",
        taskId: "task-102",
        title: "钱学森与科技报国",
        status: "review",
        version: "v0.9",
        channel: "待发布",
        operator: "审核员 王宁",
        updatedAt: "今天 11:32"
      },
      {
        id: "pub-3",
        taskId: "task-101",
        title: "雷锋精神与当代少年责任",
        status: "draft",
        version: "v0.4",
        channel: "草稿箱",
        operator: "李老师",
        updatedAt: "今天 14:35"
      }
    ],
    orgNodes: [
      { id: "bureau", name: "教育局平台", description: "区域级资源管理与监管" },
      { id: "district", name: "新区资源中心", description: "模板与素材统筹" },
      { id: "school", name: "实验学校", description: "学校级内容生产与发布" },
      { id: "group", name: "思政教研组", description: "组内共建与审核协同" }
    ],
    members: [
      {
        id: "mb-1",
        name: "李老师",
        role: "教师",
        scope: "主题创建、草稿编辑、提交审核"
      },
      {
        id: "mb-2",
        name: "王宁",
        role: "审核员",
        scope: "审核工作台、发布审计、下架回溯"
      },
      {
        id: "mb-3",
        name: "周主任",
        role: "学校管理员",
        scope: "组织成员、模板分配、资产授权"
      }
    ]
  };
}

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultState();
    const parsed = JSON.parse(raw);
    if (parsed.version !== 2) return defaultState();
    return parsed;
  } catch (error) {
    return defaultState();
  }
}

function saveState() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function pendingToast() {
  const message = sessionStorage.getItem(TOAST_KEY);
  if (!message) return "";
  sessionStorage.removeItem(TOAST_KEY);
  return message;
}

function setPendingToast(message) {
  sessionStorage.setItem(TOAST_KEY, message);
}

function mount() {
  if (authRequired && !state.loggedIn) {
    window.location.href = loginUrl();
    return;
  }
  const app = document.getElementById("app");
  app.className = "grain min-h-screen";
  if (currentPage === "login") {
    app.innerHTML = renderLogin();
  } else {
    app.innerHTML = renderShell();
  }
  bindEvents();
  const message = pendingToast();
  if (message) showToast(message);
}

function loginUrl() {
  return `${basePath}/index.html`;
}

function pageUrl(pageId) {
  return `${basePath}/pages/${PAGE_FILES[pageId]}`;
}

function renderLogin() {
  return `
    <div class="relative min-h-screen overflow-hidden px-6 py-10 md:px-12">
      <div class="tender-grid"></div>
      <div class="hero-ring left-[-6rem] top-[-4rem] h-64 w-64"></div>
      <div class="hero-ring right-[-7rem] top-10 h-[26rem] w-[26rem]"></div>
      <div class="mx-auto grid min-h-[calc(100vh-5rem)] max-w-7xl items-center gap-8 lg:grid-cols-[1.08fr_0.92fr]">
        <section class="login-stage fade-up section-frame panel rounded-[2.4rem] p-8 md:p-10">
          <div class="relative z-10">
            <div class="proposal-chip">
              <span>PROPOSAL</span>
              <strong>一期投标演示版</strong>
            </div>
            <p class="mt-8 text-xs uppercase tracking-[0.48em] text-slate">Web Prototype / Phase 1</p>
            <h1 class="font-display mt-5 max-w-3xl text-4xl leading-tight text-ink md:text-6xl">
              中小学思政 AI 内容支持平台
            </h1>
            <p class="mt-6 max-w-2xl text-base leading-8 text-slate md:text-lg">
              本演示稿围绕“内容生产、全链路审核、资产沉淀、发布审计、组织权限、成本运营”
              六大能力展开，模拟学校与教育局可交付的一期 Web 平台形态。
            </p>
            <div class="mt-10 grid gap-3 md:grid-cols-2">
              ${proposalLine("项目定位", "中小学思政 AI 内容生产与审核一体化平台")}
              ${proposalLine("一期重点", "先完成 Web 管理端闭环，移动端进入二期")}
              ${proposalLine("服务对象", "学校教师、审核员、学校管理员、教育局管理员")}
              ${proposalLine("设计气质", "克制、稳定、可交付，偏正式投标演示风格")}
            </div>
          </div>
        </section>
        <section class="panel panel-strong fade-up rounded-[2.2rem] p-7 md:p-9">
          <div class="mb-8">
            <div class="proposal-chip">
              <span>SIGN IN</span>
              <strong>进入控制台</strong>
            </div>
            <h2 class="font-display mt-4 text-3xl text-ink">一期原型总入口</h2>
            <p class="mt-3 text-sm leading-7 text-slate">
              当前默认以学校教师视角进入，也可在系统内继续查看审核、管理和运营类页面。
            </p>
          </div>
          <div class="space-y-4">
            ${loginField("账号", "teacher@tianfu.edu.cn")}
            ${loginField("密码", "••••••", true)}
            <label class="block">
              <span class="mb-2 block text-sm text-slate">角色</span>
              <select class="w-full rounded-[1.4rem] border border-line bg-white/70 px-4 py-3 outline-none transition focus:border-ocean">
                <option>思政教师</option>
                <option>审核员</option>
                <option>学校管理员</option>
                <option>教育局管理员</option>
              </select>
            </label>
          </div>
          <button data-action="login" class="mt-8 w-full rounded-full bg-ocean px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#243642]">
            进入一期投标演示版
          </button>
          <div class="mt-6 grid gap-3 md:grid-cols-3">
            ${metricCard("核心入口", "10 个管理页面")}
            ${metricCard("闭环能力", "工作台 -> 对话 -> 审核 -> 发布")}
            ${metricCard("扩展预留", "移动端与区域素材库")}
          </div>
        </section>
      </div>
    </div>
  `;
}

function renderShell() {
  const meta = PAGE_META[currentPage];
  return `
    <div class="min-h-screen p-4 md:p-5">
      <div class="mx-auto grid min-h-[calc(100vh-2rem)] max-w-[1620px] grid-cols-1 gap-4 lg:grid-cols-[292px_minmax(0,1fr)]">
        <aside class="panel rounded-[2rem] px-5 py-6">
          <div class="border-b border-line pb-5">
            <div class="proposal-chip">
              <span>PHASE 1</span>
              <strong>投标演示版</strong>
            </div>
            <h1 class="font-display mt-4 text-2xl leading-tight text-ink">思政 AI 内容支持平台</h1>
            <p class="mt-3 text-sm leading-7 text-slate">以学校和教育局可交付为目标的一期 Web 管理端原型。</p>
          </div>
          <nav class="mt-5 space-y-1.5">
            ${NAV_ITEMS.map((item) => navItem(item)).join("")}
          </nav>
          <div class="mt-6 rounded-[1.75rem] border border-line bg-white/60 p-4">
            <p class="text-xs uppercase tracking-[0.28em] text-slate">当前身份</p>
            <p class="mt-2 text-lg font-semibold text-ink">${state.user.name}</p>
            <p class="mt-1 text-sm text-slate">${state.user.role}</p>
            <div class="mt-4 flex flex-wrap gap-2">
              <span class="tag-chip">多页面演示</span>
              <span class="tag-chip">一期闭环</span>
            </div>
            <button data-action="logout" class="mt-4 rounded-full border border-line px-4 py-2 text-xs font-semibold text-slate transition hover:bg-white">
              返回登录页
            </button>
          </div>
        </aside>
        <main class="panel rounded-[2rem] overflow-hidden">
          <header class="section-frame relative border-b border-line px-6 py-5 md:px-8 md:py-6">
            <div class="tender-grid"></div>
            <div class="relative z-10 flex flex-col gap-5 xl:flex-row xl:items-end xl:justify-between">
              <div>
                <p class="text-xs uppercase tracking-[0.34em] text-slate">一期原型 · ${meta.title}</p>
                <h2 class="font-display mt-3 text-3xl md:text-4xl">${meta.title}</h2>
                <p class="mt-2 max-w-3xl text-sm leading-7 text-slate">${meta.desc}</p>
              </div>
              <div class="flex flex-wrap gap-2 xl:justify-end">
                <span class="proposal-chip"><strong>正式演示</strong> 多文件多页面版</span>
                <span class="proposal-chip"><strong>闭环</strong> 生成 / 审核 / 发布</span>
                <span class="proposal-chip"><strong>状态</strong> 可直接浏览演示</span>
              </div>
            </div>
          </header>
          <section class="p-6 md:p-7">${renderCurrentPage()}</section>
        </main>
      </div>
      <div id="toast-root"></div>
    </div>
  `;
}

function renderCurrentPage() {
  switch (currentPage) {
    case "dashboard":
      return renderDashboard();
    case "workspace":
      return renderWorkspace();
    case "chat":
      return renderChat();
    case "templates":
      return renderTemplates();
    case "tasks":
      return renderTasks();
    case "review":
      return renderReview();
    case "assets":
      return renderAssets();
    case "publish":
      return renderPublish();
    case "org":
      return renderOrg();
    case "ops":
      return renderOps();
    default:
      return renderDashboard();
  }
}

function renderDashboard() {
  const pendingTasks = state.tasks.filter((task) => task.status !== "approved").length;
  return `
    <div class="space-y-6 fade-up">
      <div class="grid gap-4 xl:grid-cols-[1.35fr_0.85fr]">
        <div class="section-frame panel panel-strong rounded-[2rem] p-6">
          <div class="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <div class="proposal-chip">
                <span>OVERVIEW</span>
                <strong>一期投标演示首页</strong>
              </div>
              <h3 class="font-display mt-4 text-3xl text-ink">欢迎回来，${state.user.name}</h3>
              <p class="mt-3 max-w-2xl text-sm leading-8 text-slate">
                平台围绕“主题创建、模板套用、内容生成、全链路审核、发布审计、资产沉淀”形成交付闭环，
                当前共有 ${state.tasks.length} 个任务在系统流转，其中 ${pendingTasks} 个仍需处理。
              </p>
            </div>
            <div class="rounded-[1.6rem] border border-line bg-white/60 px-5 py-4">
              <div class="text-xs uppercase tracking-[0.24em] text-slate">一期里程碑</div>
              <div class="mt-2 text-lg font-semibold text-ink">Web 端最小可用闭环已具备演示形态</div>
            </div>
          </div>
          <div class="mt-6 grid gap-3 md:grid-cols-4">
            ${statCard("待处理任务", String(pendingTasks), "生成中与待审核")}
            ${statCard("今日生成量", "12", "脚本 / 分镜 / 视频")}
            ${statCard("复用资产", "68%", "模板与素材复用率")}
            ${statCard("审核通过率", "92%", "近一周区域样本")}
          </div>
        </div>
        <div class="panel panel-strong rounded-[2rem] p-6">
          <h3 class="font-display text-2xl">本次投标演示重点</h3>
          <div class="mt-5 space-y-3">
            ${todoCard("学校教师输入主题并直接发起生成", "演示课程工作台", pageUrl("workspace"))}
            ${todoCard("AI 多轮对话补齐镜头重点与课堂语气", "演示 AI 创作对话室", pageUrl("chat"))}
            ${todoCard("审核员查看机审摘要并打开完整审核抽屉", "演示审核工作台", pageUrl("review"))}
            ${todoCard("学校管理员检查发布留痕与权限配置", "演示发布与组织中心", pageUrl("publish"))}
          </div>
        </div>
      </div>
      <div class="grid gap-4 xl:grid-cols-[1.08fr_0.92fr_0.9fr]">
        <div class="panel panel-strong rounded-[2rem] p-6">
          <div class="flex items-center justify-between">
            <h3 class="font-display text-2xl">一期业务闭环</h3>
            <a href="${pageUrl("workspace")}" class="text-sm text-slate underline underline-offset-4">进入工作台</a>
          </div>
          <div class="mt-6 grid gap-3 md:grid-cols-5">
            ${processStep("主题输入", "学段、教材、目标")}
            ${processStep("AI 对话澄清", "多轮确认角度与镜头重点")}
            ${processStep("内容生成", "脚本 / 分镜 / 视频")}
            ${processStep("安全审核", "机审 + 人审")}
            ${processStep("发布归档", "审计与回溯")}
          </div>
        </div>
        <div class="panel panel-strong rounded-[2rem] p-6">
          <h3 class="font-display text-2xl">审核指标</h3>
          <div class="mt-5 space-y-4">
            ${progressRow("文本安全通过", "96%")}
            ${progressRow("图片安全通过", "94%")}
            ${progressRow("视频关键帧修订", "18%")}
            ${progressRow("人工复核命中", "11%")}
          </div>
        </div>
        <div class="panel panel-strong rounded-[2rem] p-6">
          <h3 class="font-display text-2xl">推荐演示顺序</h3>
          <div class="mt-5 space-y-3">
            ${smallStep("01", "课程主题工作台", "输入主题、套用模板、发起生成")}
            ${smallStep("02", "AI 创作对话室", "多轮澄清教学目标与镜头")}
            ${smallStep("03", "任务与生成结果", "查看脚本、分镜与结果")}
            ${smallStep("04", "审核工作台", "打开完整审核详情抽屉")}
            ${smallStep("05", "发布与审计中心", "演示发布与回溯")}
          </div>
        </div>
      </div>
    </div>
  `;
}

function renderWorkspace() {
  const template = currentTemplate();
  return `
    <div class="grid gap-6 xl:grid-cols-[0.96fr_1.04fr] fade-up">
      <div class="panel panel-strong rounded-[2rem] p-6">
        <div class="flex items-center justify-between">
          <div>
            <div class="proposal-chip">
              <span>WORKSPACE</span>
              <strong>教师主题输入</strong>
            </div>
            <h3 class="font-display mt-4 text-2xl">课程主题工作台</h3>
          </div>
          <a href="${pageUrl("templates")}" class="rounded-full border border-line px-4 py-2 text-sm text-slate transition hover:bg-white">浏览模板</a>
        </div>
        <div class="mt-6 grid gap-4 md:grid-cols-2">
          ${field("学段", "phase", state.workspaceForm.phase, ["小学", "初中", "高中"])}
          ${field("年级", "grade", state.workspaceForm.grade, ["五年级", "六年级", "初一"])}
          ${field("教材版本", "edition", state.workspaceForm.edition, ["统编版", "地方版", "校本拓展"])}
          ${field("内容风格", "tone", state.workspaceForm.tone, ["温和启发", "庄重叙事", "写意纪实"])}
          ${field("课时主题", "topic", state.workspaceForm.topic)}
          ${field("时长", "duration", state.workspaceForm.duration, ["60秒微课", "90秒导入片", "3分钟宣讲片"])}
        </div>
        <label class="mt-4 block">
          <span class="mb-2 block text-sm text-slate">教学目标</span>
          <textarea data-field="goal" class="h-32 w-full rounded-[1.5rem] border border-line bg-white/70 px-4 py-3 text-sm leading-7 outline-none transition focus:border-ocean">${state.workspaceForm.goal}</textarea>
        </label>
        <div class="mt-6 flex flex-wrap gap-3">
          <button data-action="save-draft" class="rounded-full border border-line px-5 py-3 text-sm font-semibold text-ink transition hover:bg-white">保存草稿</button>
          <button data-action="enter-chat" class="rounded-full bg-ocean px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#243642]">进入 AI 对话创作</button>
        </div>
      </div>
      <div class="space-y-6">
        <div class="panel panel-strong rounded-[2rem] p-6">
          <div class="flex items-start justify-between gap-4">
            <div>
              <div class="proposal-chip">
                <span>TEMPLATE</span>
                <strong>当前套用模板</strong>
              </div>
              <h3 class="font-display mt-4 text-2xl">${template.title}</h3>
            </div>
            <span class="status-pill status-draft">${template.category}</span>
          </div>
          <p class="mt-4 text-sm leading-7 text-slate">${template.description}</p>
          <div class="mt-5 grid gap-3 md:grid-cols-3">
            ${miniInfo("叙事风格", template.tone)}
            ${miniInfo("标准镜头", `${template.scenes} 个`)}
            ${miniInfo("适用场景", template.category)}
          </div>
        </div>
        <div class="panel panel-strong rounded-[2rem] p-6">
          <div class="flex items-center justify-between">
            <h3 class="font-display text-2xl">系统预估生成链路</h3>
            <span class="text-sm text-slate">多模型编排已开启</span>
          </div>
          <div class="mt-6 space-y-4">
            ${stepRow("AI 多轮澄清", "围绕主题、课堂目标与镜头重点进行对话补全。", "active")}
            ${stepRow("脚本生成", "文本模型根据对话结果生成教学脚本。", "done")}
            ${stepRow("分镜与视频生成", "根据题材选择主生产模型或成本优化模型。", "todo")}
            ${stepRow("字幕与配音", "自动生成字幕并套用适龄配音模板。", "todo")}
            ${stepRow("提交审核", "进入机审与人工复核闭环。", "todo")}
          </div>
        </div>
      </div>
    </div>
  `;
}

function renderChat() {
  return `
    <div class="grid gap-6 xl:grid-cols-[1.08fr_0.92fr] fade-up">
      <div class="panel panel-strong rounded-[2rem] p-6">
        <div class="flex flex-wrap items-center justify-between gap-3">
          <div>
            <div class="proposal-chip">
              <span>MULTI-TURN CHAT</span>
              <strong>AI 创作对话室</strong>
            </div>
            <h3 class="font-display mt-4 text-2xl">先对话澄清，再生成课程视频</h3>
            <p class="mt-2 text-sm leading-7 text-slate">
              当前原型模拟教师与 AI 的多轮对话过程，用于补齐表达角度、课堂语气、镜头重点和结尾方式。
            </p>
          </div>
          <div class="flex gap-3">
            <button data-action="chat-reset" class="rounded-full border border-line px-4 py-2 text-sm font-medium text-ink transition hover:bg-white">重置对话</button>
            <button data-action="chat-confirm-generate" class="rounded-full bg-ocean px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#243642]">确认对话并生成任务</button>
          </div>
        </div>
        <div class="mt-6 rounded-[1.8rem] border border-line bg-white/55 p-5">
          <div class="space-y-4">
            ${state.conversation.messages.map((message) => chatBubble(message)).join("")}
          </div>
        </div>
        <div class="mt-5">
          <div class="text-sm font-semibold text-ink">快捷补充</div>
          <div class="mt-3 flex flex-wrap gap-2">
            ${[
              "更强调课堂导入",
              "增加校园案例",
              "改成更庄重的语气",
              "结尾加入行动倡议",
              "控制在 60 秒内"
            ]
              .map(
                (prompt) => `
                  <button data-action="chat-quick-reply" data-prompt="${prompt}" class="tag-chip">
                    ${prompt}
                  </button>
                `
              )
              .join("")}
          </div>
        </div>
      </div>
      <div class="space-y-6">
        <div class="panel panel-strong rounded-[2rem] p-6">
          <div class="proposal-chip">
            <span>CONVERSATION SUMMARY</span>
            <strong>当前确认结果</strong>
          </div>
          <div class="mt-5 grid gap-3 md:grid-cols-2">
            ${miniInfo("适用对象", state.conversation.summary.audience)}
            ${miniInfo("表达角度", state.conversation.summary.angle)}
            ${miniInfo("结尾方式", state.conversation.summary.ending)}
            ${miniInfo("整体语气", state.conversation.summary.style)}
          </div>
          <div class="mt-5 rounded-[1.5rem] border border-line bg-white/55 p-5">
            <div class="text-sm font-semibold text-ink">必须保留的画面 / 内容点</div>
            <div class="mt-3 flex flex-wrap gap-2">
              ${state.conversation.summary.mustInclude.map((item) => `<span class="tag-chip active">${item}</span>`).join("")}
            </div>
          </div>
        </div>
        <div class="panel panel-strong rounded-[2rem] p-6">
          <div class="proposal-chip">
            <span>AI OUTPUT</span>
            <strong>下一步生成预期</strong>
          </div>
          <div class="mt-5 space-y-4">
            ${stepRow("教学脚本", "基于已确认的对话结果输出教学脚本。", "done")}
            ${stepRow("分镜设计", "围绕校园案例与行动倡议构建镜头节奏。", "active")}
            ${stepRow("字幕与配音", "按五年级理解水平收敛表达强度。", "todo")}
          </div>
          <div class="mt-5 rounded-[1.5rem] border border-line bg-white/55 p-5 text-sm leading-7 text-slate">
            这一步的意义在于让教师和 AI 先对齐“要讲什么、怎么讲、讲给谁听”，避免直接生成导致脚本方向偏差。
          </div>
        </div>
      </div>
    </div>
  `;
}

function renderTemplates() {
  const categories = ["全部", ...new Set(TEMPLATE_LIBRARY.map((item) => item.category))];
  const templates = TEMPLATE_LIBRARY.filter(
    (item) => state.ui.templateFilter === "全部" || item.category === state.ui.templateFilter
  );
  return `
    <div class="space-y-6 fade-up">
      <div class="panel panel-strong rounded-[2rem] p-6">
        <div class="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <div class="proposal-chip">
              <span>LIBRARY</span>
              <strong>标准模板中心</strong>
            </div>
            <h3 class="font-display mt-4 text-2xl">统一思政内容结构与风格</h3>
            <p class="mt-2 text-sm leading-7 text-slate">模板不仅提高效率，也用于保证不同学校产出的内容风格与表达边界一致。</p>
          </div>
          <div class="flex flex-wrap gap-2">
            ${categories
              .map((category) => filterChip("template-filter", category, state.ui.templateFilter))
              .join("")}
          </div>
        </div>
      </div>
      <div class="grid gap-4 lg:grid-cols-2 2xl:grid-cols-4">
        ${templates.map((item) => templateCard(item)).join("")}
      </div>
    </div>
  `;
}

function renderTasks() {
  const tasks = state.tasks.filter(
    (task) => state.ui.taskFilter === "全部" || task.status === state.ui.taskFilter
  );
  const activeTask = currentTask();
  const template = templateById(activeTask.templateId);
  return `
    <div class="grid gap-6 xl:grid-cols-[0.82fr_1.18fr] fade-up">
      <div class="space-y-4">
        <div class="panel panel-strong rounded-[2rem] p-5">
          <div class="flex flex-wrap gap-2">
            ${["全部", "draft", "review", "approved"]
              .map((filter) => filterChip("task-filter", filter, state.ui.taskFilter, statusLabel(filter)))
              .join("")}
          </div>
        </div>
        ${tasks.map((task) => taskCard(task)).join("")}
      </div>
      <div class="space-y-4">
        <div class="panel panel-strong rounded-[2rem] p-6">
          <div class="flex flex-wrap items-center justify-between gap-3">
            <div>
              <div class="proposal-chip">
                <span>TASK DETAIL</span>
                <strong>生成结果展示</strong>
              </div>
              <h3 class="font-display mt-4 text-3xl">${activeTask.title}</h3>
              <p class="mt-2 text-sm leading-7 text-slate">套用模板：${template.title} · 模型链路：${activeTask.modelChain}</p>
            </div>
            <div class="flex gap-3">
              <button data-action="submit-review" class="rounded-full border border-line px-4 py-2 text-sm font-medium text-ink transition hover:bg-white">提交审核</button>
              <button data-action="open-review-from-task" class="rounded-full bg-ocean px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#243642]">查看审核详情</button>
            </div>
          </div>
          <div class="mt-6 grid gap-3 md:grid-cols-5">
            ${activeTask.steps.map((step) => stepCard(step)).join("")}
          </div>
        </div>
        <div class="grid gap-4 xl:grid-cols-[1fr_0.9fr]">
          <div class="panel panel-strong rounded-[2rem] p-6">
            <h4 class="font-display text-2xl">脚本与分镜</h4>
            <div class="mt-4 rounded-[1.5rem] border border-line bg-white/55 p-5 text-sm leading-8 text-slate">
              ${activeTask.script}
            </div>
            <div class="mt-5 space-y-3">
              ${activeTask.storyboard
                .map(
                  (item, index) => `
                    <div class="rounded-[1.4rem] border border-line bg-white/55 p-4">
                      <div class="text-sm font-semibold text-ink">镜头 ${index + 1}</div>
                      <div class="mt-2 text-sm leading-7 text-slate">${item}</div>
                    </div>
                  `
                )
                .join("")}
            </div>
          </div>
          <div class="panel panel-strong rounded-[2rem] p-6">
            <h4 class="font-display text-2xl">结果预览</h4>
            <div class="mini-chart mt-5 rounded-[1.8rem] p-5">
              <div class="rounded-[1.5rem] bg-[#cfd8dc] p-5">
                <div class="aspect-[4/3] rounded-[1.3rem] bg-gradient-to-br from-[#5f7078] via-[#7f9198] to-[#ccd6da]"></div>
              </div>
            </div>
            <div class="mt-5 rounded-[1.5rem] border border-line bg-white/55 p-5">
              <div class="text-sm font-semibold text-ink">风控摘要</div>
              <div class="mt-2 text-sm leading-7 text-slate">${activeTask.riskSummary}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
}

function renderReview() {
  const active = currentReview();
  return `
    <div class="space-y-6 fade-up">
      <div class="grid gap-6 xl:grid-cols-[0.72fr_1.28fr]">
        <div class="space-y-4">
          ${state.reviews.map((review) => reviewQueueCard(review)).join("")}
        </div>
        <div class="space-y-4">
          <div class="panel panel-strong rounded-[2rem] p-6">
            <div class="flex flex-wrap items-start justify-between gap-3">
              <div>
                <div class="proposal-chip">
                  <span>REVIEW SUMMARY</span>
                  <strong>审核概览</strong>
                </div>
                <h3 class="font-display mt-4 text-3xl">${active.title}</h3>
                <p class="mt-2 text-sm leading-7 text-slate">${active.school} · 提交人 ${active.applicant}</p>
              </div>
              <div class="flex gap-3">
                ${statusBadge(active.severity === "低" ? "approved" : "review", `${active.severity}风险`)}
                <button data-action="open-review-drawer" class="rounded-full bg-ocean px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#243642]">
                  打开完整审核详情
                </button>
              </div>
            </div>
            <div class="mt-6 grid gap-3 md:grid-cols-4">
              ${miniInfo("机审状态", "文本 / 图像通过")}
              ${miniInfo("视频关键帧", "1 条建议")}
              ${miniInfo("人工复核", "待确认发布")}
              ${miniInfo("发布状态", "未发布")}
            </div>
          </div>
          <div class="grid gap-4 xl:grid-cols-[1fr_0.9fr]">
            <div class="panel panel-strong rounded-[2rem] p-6">
              <h4 class="font-display text-2xl">关键风险摘要</h4>
              <div class="mt-5 space-y-3">
                ${active.tags.map((tag) => `<span class="tag-chip active">${tag}</span>`).join("")}
              </div>
              <div class="mt-5 rounded-[1.5rem] border border-line bg-white/55 p-5 text-sm leading-8 text-slate">
                ${active.machine}
              </div>
              <div class="mt-5 rounded-[1.5rem] border border-line bg-white/55 p-5 text-sm leading-8 text-slate">
                ${active.notes}
              </div>
            </div>
            <div class="panel panel-strong rounded-[2rem] p-6">
              <h4 class="font-display text-2xl">审核轨迹</h4>
              <div class="relative mt-5 space-y-5 pl-6">
                <div class="timeline-line"></div>
                ${active.history.map((item) => timelineItem(item)).join("")}
              </div>
            </div>
          </div>
        </div>
      </div>
      ${state.ui.reviewDrawerOpen ? renderReviewDrawer(active) : ""}
    </div>
  `;
}

function renderReviewDrawer(active) {
  const module = active.auditModules[state.ui.reviewAuditTab];
  return `
    <div class="drawer-backdrop fade-in" data-action="close-review-drawer"></div>
    <aside class="drawer-panel">
      <div class="h-full overflow-auto px-6 py-6 md:px-7">
        <div class="flex items-start justify-between gap-4">
          <div>
            <div class="proposal-chip">
              <span>FULL DRAWER</span>
              <strong>完整审核详情</strong>
            </div>
            <h3 class="font-display mt-4 text-3xl">${active.title}</h3>
            <p class="mt-2 text-sm leading-7 text-slate">${active.school} · 提交人 ${active.applicant}</p>
          </div>
          <button data-action="close-review-drawer" class="rounded-full border border-line px-4 py-2 text-sm text-slate transition hover:bg-white">关闭</button>
        </div>
        <div class="mt-6 grid gap-3 md:grid-cols-2">
          ${miniInfo("所属任务", active.taskId)}
          ${miniInfo("风控等级", `${active.severity}风险`)}
          ${miniInfo("审核链路", "输入前审校 -> 机审 -> 人工复核")}
          ${miniInfo("建议结论", "修改后可发布")}
        </div>
        <div class="mt-6 rounded-[1.6rem] border border-line bg-white/60 p-5">
          <div class="text-sm font-semibold text-ink">审核模块切换</div>
          <div class="mt-4 flex flex-wrap gap-2">
            ${["text", "image", "video", "audio"]
              .map((tab) => filterChip("audit-tab", tab, state.ui.reviewAuditTab, auditTabLabel(tab)))
              .join("")}
          </div>
          <div class="mt-5 rounded-[1.4rem] border border-line bg-white/65 p-5">
            <div class="text-lg font-semibold text-ink">${module.title}</div>
            <div class="mt-2 text-sm leading-7 text-slate">${module.summary}</div>
            <div class="mt-4 space-y-3">
              ${module.points
                .map(
                  (point) => `
                    <div class="rounded-[1.2rem] border border-line bg-white/55 px-4 py-3 text-sm leading-7 text-slate">
                      ${point}
                    </div>
                  `
                )
                .join("")}
            </div>
          </div>
        </div>
        <div class="mt-6 grid gap-4 lg:grid-cols-[0.95fr_1.05fr]">
          <div class="rounded-[1.6rem] border border-line bg-white/60 p-5">
            <div class="text-sm font-semibold text-ink">关键帧联动查看</div>
            <div class="mt-4 space-y-3">
              ${active.keyframes
                .map(
                  (frame) => `
                    <div class="rounded-[1.3rem] border border-line bg-white/55 p-4">
                      <div class="flex items-center justify-between gap-3">
                        <span class="text-sm font-semibold text-ink">${frame.label}</span>
                        <span class="text-xs uppercase tracking-[0.2em] text-slate">${frame.time}</span>
                      </div>
                      <div class="mt-3 aspect-[16/9] rounded-[1rem] bg-gradient-to-br from-[#62757e] to-[#d4dde1]"></div>
                      <div class="mt-3 text-sm leading-7 text-slate">${frame.note}</div>
                    </div>
                  `
                )
                .join("")}
            </div>
          </div>
          <div class="rounded-[1.6rem] border border-line bg-white/60 p-5">
            <div class="text-sm font-semibold text-ink">字幕片段与复核建议</div>
            <div class="mt-4 space-y-3">
              ${active.subtitleSegments
                .map(
                  (segment) => `
                    <div class="rounded-[1.3rem] border border-line ${segment.level === "warn" ? "bg-[#ecdfd9]" : "bg-white/55"} p-4">
                      <div class="flex items-center justify-between gap-3">
                        <span class="text-xs uppercase tracking-[0.2em] text-slate">${segment.time}</span>
                        <span class="status-pill ${segment.level === "warn" ? "status-review" : "status-approved"}">
                          ${segment.level === "warn" ? "建议修订" : "正常"}
                        </span>
                      </div>
                      <div class="mt-3 text-sm leading-7 ${segment.level === "warn" ? "text-[#765149]" : "text-slate"}">
                        ${segment.text}
                      </div>
                    </div>
                  `
                )
                .join("")}
            </div>
          </div>
        </div>
        <div class="mt-6 rounded-[1.6rem] border border-line bg-white/60 p-5">
          <div class="text-sm font-semibold text-ink">人工复核意见</div>
          <textarea id="review-note" class="mt-4 h-32 w-full rounded-[1.4rem] border border-line bg-white/70 px-4 py-3 text-sm leading-7 outline-none transition focus:border-ocean">${active.notes}</textarea>
          <div class="mt-5 flex flex-wrap gap-3">
            <button data-action="review-approve" class="rounded-full bg-ocean px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#243642]">审核通过并进入发布</button>
            <button data-action="review-reject" class="rounded-full border border-line px-5 py-3 text-sm font-semibold text-ink transition hover:bg-white">退回修改</button>
          </div>
        </div>
      </div>
    </aside>
  `;
}

function renderAssets() {
  const types = ["全部", ...new Set(state.assets.map((asset) => asset.type))];
  const assets = state.assets.filter(
    (asset) => state.ui.assetFilter === "全部" || asset.type === state.ui.assetFilter
  );
  const active = currentAsset();
  return `
    <div class="grid gap-6 xl:grid-cols-[1fr_0.95fr] fade-up">
      <div class="space-y-4">
        <div class="panel panel-strong rounded-[2rem] p-5">
          <div class="proposal-chip">
            <span>ASSET FILTER</span>
            <strong>资产筛选</strong>
          </div>
          <div class="mt-4 flex flex-wrap gap-2">
            ${types.map((type) => filterChip("asset-filter", type, state.ui.assetFilter)).join("")}
          </div>
        </div>
        <div class="grid gap-4 lg:grid-cols-2">
          ${assets.map((asset) => assetCard(asset)).join("")}
        </div>
      </div>
      <div class="panel panel-strong rounded-[2rem] p-6">
        <div class="flex items-center justify-between">
          <div>
            <div class="proposal-chip">
              <span>DETAIL</span>
              <strong>资产详情</strong>
            </div>
            <h3 class="font-display mt-4 text-3xl">${active.title}</h3>
          </div>
          <button data-action="reuse-asset" class="rounded-full bg-ocean px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#243642]">复用到当前任务</button>
        </div>
        <div class="mt-5 grid gap-3 md:grid-cols-3">
          ${miniInfo("类型", active.type)}
          ${miniInfo("来源", active.source)}
          ${miniInfo("授权范围", active.access)}
        </div>
        <div class="mini-chart mt-5 rounded-[1.8rem] p-5">
          <div class="rounded-[1.5rem] bg-[#d4dce0] p-5">
            <div class="aspect-[16/9] rounded-[1.3rem] bg-gradient-to-br from-[#61747c] to-[#ced8dc]"></div>
          </div>
        </div>
        <div class="mt-5 rounded-[1.6rem] border border-line bg-white/55 p-5 text-sm leading-7 text-slate">${active.description}</div>
        <div class="mt-5 grid gap-3 md:grid-cols-2">
          ${miniInfo("复用次数", active.usage)}
          ${miniInfo("审核状态", "已通过机审与人工复核")}
        </div>
      </div>
    </div>
  `;
}

function renderPublish() {
  const items = state.publishItems.filter(
    (item) => state.ui.publishFilter === "全部" || item.status === state.ui.publishFilter
  );
  const active = currentPublish();
  return `
    <div class="grid gap-6 xl:grid-cols-[0.88fr_1.12fr] fade-up">
      <div class="space-y-4">
        <div class="panel panel-strong rounded-[2rem] p-5">
          <div class="proposal-chip">
            <span>STATUS</span>
            <strong>发布状态筛选</strong>
          </div>
          <div class="mt-4 flex flex-wrap gap-2">
            ${["全部", "draft", "review", "published", "recalled"]
              .map((filter) => filterChip("publish-filter", filter, state.ui.publishFilter, statusLabel(filter)))
              .join("")}
          </div>
        </div>
        ${items.map((item) => publishCard(item)).join("")}
      </div>
      <div class="panel panel-strong rounded-[2rem] p-6">
        <div class="flex flex-wrap items-start justify-between gap-3">
          <div>
            <div class="proposal-chip">
              <span>PUBLISH</span>
              <strong>发布详情</strong>
            </div>
            <h3 class="font-display mt-4 text-3xl">${active.title}</h3>
          </div>
          <div class="flex gap-3">
            <button data-action="publish-item" class="rounded-full bg-ocean px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#243642]">发布</button>
            <button data-action="recall-item" class="rounded-full border border-line px-4 py-2 text-sm font-medium text-ink transition hover:bg-white">下架回溯</button>
          </div>
        </div>
        <div class="mt-6 grid gap-3 md:grid-cols-4">
          ${miniInfo("当前版本", active.version)}
          ${miniInfo("状态", humanStatus(active.status))}
          ${miniInfo("发布渠道", active.channel)}
          ${miniInfo("最近操作人", active.operator)}
        </div>
        <div class="mt-5 grid gap-4 lg:grid-cols-2">
          <div class="rounded-[1.6rem] border border-line bg-white/55 p-5">
            <div class="text-sm font-semibold text-ink">审计留痕</div>
            <div class="mt-4 space-y-3 text-sm leading-7 text-slate">
              <div>09:05 审核通过，保留机审报告与人工复核意见。</div>
              <div>09:12 生成导出包并写入发布记录。</div>
              <div>09:20 已同步至新区资源平台，版本号自动上浮。</div>
            </div>
          </div>
          <div class="rounded-[1.6rem] border border-line bg-white/55 p-5">
            <div class="text-sm font-semibold text-ink">发布说明</div>
            <textarea class="mt-4 h-40 w-full rounded-[1.4rem] border border-line bg-white/65 px-4 py-3 text-sm leading-7 outline-none transition focus:border-ocean">适用于思政导入课，面向区域学校共享。已完成人工复核与导出留痕。</textarea>
          </div>
        </div>
      </div>
    </div>
  `;
}

function renderOrg() {
  const node = state.orgNodes.find((item) => item.id === state.ui.orgNode);
  const member = currentMember();
  return `
    <div class="grid gap-6 xl:grid-cols-[0.68fr_0.8fr_0.72fr] fade-up">
      <div class="panel panel-strong rounded-[2rem] p-6">
        <div class="proposal-chip">
          <span>ORGANIZATION</span>
          <strong>多级组织树</strong>
        </div>
        <div class="mt-5 space-y-3">
          ${state.orgNodes.map((item, index) => orgNodeCard(item, index)).join("")}
        </div>
      </div>
      <div class="panel panel-strong rounded-[2rem] p-6">
        <div class="flex items-center justify-between">
          <div>
            <div class="proposal-chip">
              <span>CURRENT NODE</span>
              <strong>节点成员</strong>
            </div>
            <h3 class="font-display mt-4 text-3xl">${node.name}</h3>
          </div>
          <button class="rounded-full border border-line px-4 py-2 text-sm text-slate transition hover:bg-white">新增成员</button>
        </div>
        <div class="mt-6 space-y-3">
          ${state.members.map((item) => memberCard(item)).join("")}
        </div>
      </div>
      <div class="panel panel-strong rounded-[2rem] p-6">
        <div class="proposal-chip">
          <span>PERMISSION</span>
          <strong>权限说明</strong>
        </div>
        <div class="mt-5 rounded-[1.6rem] border border-line bg-white/55 p-5">
          <div class="text-sm font-semibold text-ink">${member.name} · ${member.role}</div>
          <div class="mt-3 text-sm leading-7 text-slate">${member.scope}</div>
        </div>
        <div class="mt-5 space-y-3">
          ${permissionItem("课程主题创建", true)}
          ${permissionItem("模板分配与修改", member.role !== "教师")}
          ${permissionItem("人工审核与驳回", member.role !== "教师")}
          ${permissionItem("发布与下架", member.role !== "教师")}
          ${permissionItem("查看成本运营", member.role === "学校管理员")}
        </div>
      </div>
    </div>
  `;
}

function renderOps() {
  return `
    <div class="space-y-6 fade-up">
      <div class="panel panel-strong rounded-[2rem] p-5">
        <div class="proposal-chip">
          <span>OPS PANEL</span>
          <strong>成本与运营概览</strong>
        </div>
        <div class="mt-4 flex flex-wrap gap-2">
          ${["概览", "模型成本", "审核表现"]
            .map((tab) => filterChip("ops-tab", tab, state.ui.opsTab))
            .join("")}
        </div>
      </div>
      <div class="grid gap-4 xl:grid-cols-4">
        ${statCard("标准路线单条成本", "1.65 元", "混元 + 审核组合")}
        ${statCard("常规月度预算", "3300 元", "按 2000 条测算")}
        ${statCard("精品内容单条成本", "3.30 元", "样板课与示范片")}
        ${statCard("审核人工介入率", "11%", "近一周样本")}
      </div>
      <div class="grid gap-4 xl:grid-cols-[1.15fr_0.85fr]">
        <div class="panel panel-strong rounded-[2rem] p-6">
          <div class="flex items-center justify-between">
            <h3 class="font-display text-2xl">${state.ui.opsTab}</h3>
            <span class="text-sm text-slate">本页用于一期展示运营与成本可视化能力</span>
          </div>
          <div class="mt-6 grid gap-4 md:grid-cols-3">
            ${chartBlock("周一", "42%")}
            ${chartBlock("周二", "58%")}
            ${chartBlock("周三", "71%")}
            ${chartBlock("周四", "64%")}
            ${chartBlock("周五", "79%")}
            ${chartBlock("周六", "52%")}
          </div>
        </div>
        <div class="panel panel-strong rounded-[2rem] p-6">
          <h3 class="font-display text-2xl">运营摘要</h3>
          <div class="mt-5 space-y-4">
            ${progressRow("模板复用率", "68%")}
            ${progressRow("机审一次通过", "89%")}
            ${progressRow("重点人工复核", "16%")}
            ${progressRow("资产沉淀增长", "61%")}
          </div>
          <div class="mt-6 rounded-[1.6rem] border border-line bg-white/55 p-5 text-sm leading-7 text-slate">
            一期阶段重点不是追求极复杂 BI，而是让学校与区域管理者能看见成本、审核和复用情况，具备持续交付依据。
          </div>
        </div>
      </div>
    </div>
  `;
}

function navItem(item) {
  const active = item.id === currentPage;
  return `
    <a href="${pageUrl(item.id)}" class="nav-link ${active ? "active" : ""} flex w-full items-center gap-3 rounded-2xl border border-transparent px-4 py-3 text-left text-sm text-slate">
      <span class="inline-flex h-9 w-9 items-center justify-center rounded-full border border-line bg-white/60 text-[0.7rem] font-bold text-ink">${item.icon}</span>
      <span>${item.label}</span>
    </a>
  `;
}

function templateCard(item) {
  return `
    <article class="panel panel-strong rounded-[2rem] p-5">
      <div class="flex items-start justify-between gap-3">
        <span class="status-pill status-draft">${item.category}</span>
        <span class="text-xs uppercase tracking-[0.2em] text-slate">${item.scenes} scenes</span>
      </div>
      <h4 class="font-display mt-4 text-2xl leading-tight">${item.title}</h4>
      <p class="mt-3 text-sm leading-7 text-slate">${item.description}</p>
      <div class="mt-5 rounded-[1.4rem] border border-line bg-white/55 p-4">
        <div class="text-xs uppercase tracking-[0.22em] text-slate">默认气质</div>
        <div class="mt-2 text-sm font-semibold text-ink">${item.tone}</div>
      </div>
      <div class="mt-5 flex gap-3">
        <button data-action="preview-template" data-template-id="${item.id}" class="rounded-full border border-line px-4 py-2 text-sm font-medium text-ink transition hover:bg-white">预览</button>
        <button data-action="use-template" data-template-id="${item.id}" class="rounded-full bg-ocean px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#243642]">套用模板</button>
      </div>
    </article>
  `;
}

function taskCard(task) {
  return `
    <button data-task-select="${task.id}" class="panel panel-strong w-full rounded-[2rem] p-5 text-left transition ${task.id === state.ui.activeTaskId ? "border-ocean" : ""}">
      <div class="flex items-center justify-between gap-3">
        <div class="text-lg font-semibold text-ink">${task.title}</div>
        ${statusBadge(task.status)}
      </div>
      <div class="mt-3 text-sm text-slate">${task.owner} · ${task.updatedAt}</div>
      <div class="mt-4">
        <div class="mb-2 flex justify-between text-xs text-slate">
          <span>任务完成度</span>
          <span>${task.progress}%</span>
        </div>
        <div class="data-bar h-3 rounded-full bg-[#dce3e6]" style="--bar-width:${task.progress}%"></div>
      </div>
    </button>
  `;
}

function reviewQueueCard(review) {
  return `
    <button data-review-select="${review.id}" class="panel panel-strong w-full rounded-[2rem] p-5 text-left transition ${review.id === state.ui.activeReviewId ? "border-ocean" : ""}">
      <div class="flex items-center justify-between gap-3">
        <div class="text-lg font-semibold text-ink">${review.title}</div>
        <span class="status-pill ${review.severity === "低" ? "status-approved" : "status-review"}">${review.severity}风险</span>
      </div>
      <div class="mt-3 text-sm text-slate">${review.school}</div>
      <div class="mt-4 flex flex-wrap gap-2">
        ${review.tags.map((tag) => `<span class="tag-chip">${tag}</span>`).join("")}
      </div>
    </button>
  `;
}

function assetCard(asset) {
  return `
    <button data-asset-select="${asset.id}" class="panel panel-strong rounded-[2rem] p-5 text-left transition ${asset.id === state.ui.activeAssetId ? "border-ocean" : ""}">
      <div class="flex items-center justify-between gap-3">
        <span class="status-pill status-draft">${asset.type}</span>
        <span class="text-xs uppercase tracking-[0.2em] text-slate">${asset.usage}</span>
      </div>
      <h4 class="font-display mt-4 text-2xl leading-tight">${asset.title}</h4>
      <p class="mt-3 text-sm leading-7 text-slate">${asset.description}</p>
    </button>
  `;
}

function publishCard(item) {
  return `
    <button data-publish-select="${item.id}" class="panel panel-strong w-full rounded-[2rem] p-5 text-left transition ${item.id === state.ui.activePublishId ? "border-ocean" : ""}">
      <div class="flex items-center justify-between gap-3">
        <div class="text-lg font-semibold text-ink">${item.title}</div>
        ${statusBadge(item.status)}
      </div>
      <div class="mt-3 text-sm text-slate">${item.version} · ${item.updatedAt}</div>
      <div class="mt-2 text-sm text-slate">${item.channel}</div>
    </button>
  `;
}

function orgNodeCard(item, index) {
  return `
    <button data-org-node="${item.id}" class="w-full rounded-[1.5rem] border ${item.id === state.ui.orgNode ? "border-ocean bg-white" : "border-line bg-white/55"} px-4 py-4 text-left transition hover:bg-white">
      <div class="text-xs uppercase tracking-[0.2em] text-slate">0${index + 1}</div>
      <div class="mt-2 text-lg font-semibold text-ink">${item.name}</div>
      <div class="mt-2 text-sm leading-7 text-slate">${item.description}</div>
    </button>
  `;
}

function memberCard(item) {
  return `
    <button data-member-select="${item.id}" class="w-full rounded-[1.5rem] border ${item.id === state.ui.activeMemberId ? "border-ocean bg-white" : "border-line bg-white/55"} px-4 py-4 text-left transition hover:bg-white">
      <div class="flex items-center justify-between gap-3">
        <div class="text-lg font-semibold text-ink">${item.name}</div>
        <span class="status-pill status-draft">${item.role}</span>
      </div>
      <div class="mt-3 text-sm leading-7 text-slate">${item.scope}</div>
    </button>
  `;
}

function timelineItem(item) {
  return `
    <div class="relative rounded-[1.4rem] border border-line bg-white/55 p-4">
      <span class="absolute left-[-1.32rem] top-5 h-3 w-3 rounded-full bg-[#7a8d96]"></span>
      <div class="text-xs uppercase tracking-[0.2em] text-slate">${item.time}</div>
      <div class="mt-2 text-sm font-semibold text-ink">${item.title}</div>
      <div class="mt-2 text-sm leading-7 text-slate">${item.desc}</div>
    </div>
  `;
}

function field(label, key, value, options) {
  const input = options
    ? `<select data-field="${key}" class="w-full rounded-[1.4rem] border border-line bg-white/70 px-4 py-3 text-sm outline-none transition focus:border-ocean">
        ${options.map((option) => `<option ${option === value ? "selected" : ""}>${option}</option>`).join("")}
      </select>`
    : `<input data-field="${key}" value="${value}" class="w-full rounded-[1.4rem] border border-line bg-white/70 px-4 py-3 text-sm outline-none transition focus:border-ocean" />`;
  return `
    <label class="block">
      <span class="mb-2 block text-sm text-slate">${label}</span>
      ${input}
    </label>
  `;
}

function loginField(label, value, isPassword = false) {
  return `
    <label class="block">
      <span class="mb-2 block text-sm text-slate">${label}</span>
      <input ${isPassword ? 'type="password"' : ""} value="${value}" class="w-full rounded-[1.4rem] border border-line bg-white/70 px-4 py-3 outline-none transition focus:border-ocean" />
    </label>
  `;
}

function proposalLine(label, value) {
  return `
    <div class="rounded-[1.4rem] border border-line bg-white/55 p-4">
      <div class="text-xs uppercase tracking-[0.24em] text-slate">${label}</div>
      <div class="mt-2 text-sm leading-7 text-ink">${value}</div>
    </div>
  `;
}

function metricCard(label, value) {
  return `
    <div class="rounded-2xl border border-line bg-white/55 p-4">
      <div class="text-xs uppercase tracking-[0.2em] text-slate">${label}</div>
      <div class="mt-2 text-sm font-semibold text-ink">${value}</div>
    </div>
  `;
}

function todoCard(text, scope, href) {
  return `
    <a href="${href}" class="block rounded-[1.4rem] border border-line bg-white/55 px-4 py-4 text-left transition hover:bg-white/80">
      <div class="text-sm font-semibold text-ink">${text}</div>
      <div class="mt-2 text-xs uppercase tracking-[0.2em] text-slate">${scope}</div>
    </a>
  `;
}

function processStep(title, desc) {
  return `
    <div class="rounded-[1.4rem] border border-line bg-white/65 p-4">
      <div class="text-sm font-semibold text-ink">${title}</div>
      <div class="mt-2 text-xs leading-6 text-slate">${desc}</div>
    </div>
  `;
}

function smallStep(no, title, desc) {
  return `
    <div class="rounded-[1.4rem] border border-line bg-white/60 px-4 py-4">
      <div class="text-xs uppercase tracking-[0.24em] text-slate">${no}</div>
      <div class="mt-2 text-sm font-semibold text-ink">${title}</div>
      <div class="mt-2 text-sm leading-7 text-slate">${desc}</div>
    </div>
  `;
}

function statCard(label, value, hint) {
  return `
    <div class="rounded-[1.5rem] border border-line bg-white/70 p-4">
      <div class="text-sm text-slate">${label}</div>
      <div class="mt-3 text-3xl font-semibold text-ink">${value}</div>
      <div class="mt-2 text-xs leading-6 text-slate">${hint}</div>
    </div>
  `;
}

function progressRow(label, value) {
  return `
    <div>
      <div class="mb-2 flex items-center justify-between text-sm">
        <span class="text-ink">${label}</span>
        <span class="text-slate">${value}</span>
      </div>
      <div class="data-bar h-3 rounded-full bg-[#dce3e6]" style="--bar-width:${value};"></div>
    </div>
  `;
}

function stepCard(step) {
  return `
    <div class="rounded-[1.4rem] border border-line bg-white/60 p-4">
      <div class="flex items-center gap-3">
        <span class="step-dot ${step.status}"></span>
        <span class="text-sm font-semibold text-ink">${step.name}</span>
      </div>
    </div>
  `;
}

function stepRow(title, desc, status) {
  return `
    <div class="flex items-start gap-4 rounded-[1.5rem] border border-line bg-white/55 p-4">
      <span class="step-dot ${status} mt-1 shrink-0"></span>
      <div>
        <div class="text-base font-semibold text-ink">${title}</div>
        <div class="mt-2 text-sm leading-7 text-slate">${desc}</div>
      </div>
    </div>
  `;
}

function miniInfo(label, value) {
  return `
    <div class="rounded-[1.4rem] border border-line bg-white/65 p-4">
      <div class="text-xs uppercase tracking-[0.22em] text-slate">${label}</div>
      <div class="mt-2 text-base font-semibold text-ink">${value}</div>
    </div>
  `;
}

function chartBlock(label, value) {
  return `
    <div class="rounded-[1.5rem] border border-line bg-white/60 p-4">
      <div class="text-xs uppercase tracking-[0.18em] text-slate">${label}</div>
      <div class="mini-chart mt-4 h-32 rounded-[1.2rem] p-3">
        <div class="h-full rounded-[1rem] bg-gradient-to-t from-[#5d727b] to-[#d5dee2]" style="clip-path: polygon(0 100%, 0 70%, 18% 62%, 36% 78%, 55% 45%, 72% 52%, 100% 22%, 100% 100%);"></div>
      </div>
      <div class="mt-3 text-lg font-semibold text-ink">${value}</div>
    </div>
  `;
}

function permissionItem(label, enabled) {
  return `
    <div class="flex items-center justify-between rounded-[1.3rem] border border-line bg-white/55 px-4 py-3">
      <span class="text-sm font-medium text-ink">${label}</span>
      <span class="status-pill ${enabled ? "status-approved" : "status-rejected"}">${enabled ? "已开启" : "未授权"}</span>
    </div>
  `;
}

function filterChip(type, value, current, label = value) {
  return `<button data-filter-type="${type}" data-filter-value="${value}" class="tag-chip ${current === value ? "active" : ""}">${label}</button>`;
}

function statusBadge(status, overrideLabel) {
  return `<span class="status-pill ${badgeClass(status)}">${overrideLabel || humanStatus(status)}</span>`;
}

function badgeClass(status) {
  switch (status) {
    case "draft":
      return "status-draft";
    case "review":
      return "status-review";
    case "approved":
      return "status-approved";
    case "published":
      return "status-published";
    case "recalled":
      return "status-recalled";
    default:
      return "status-draft";
  }
}

function humanStatus(status) {
  const map = {
    draft: "草稿 / 生成中",
    review: "待审核 / 待发布",
    approved: "审核通过",
    published: "已发布",
    recalled: "已下架",
    "全部": "全部"
  };
  return map[status] || status;
}

function statusLabel(filter) {
  if (filter === "全部") return "全部";
  return humanStatus(filter);
}

function auditTabLabel(tab) {
  const labels = { text: "文本", image: "图像", video: "视频", audio: "音频" };
  return labels[tab];
}

function buildConversationFromForm() {
  return {
    messages: [
      {
        id: `msg-${Date.now()}-1`,
        role: "assistant",
        kind: "analysis",
        text:
          `我先复述一下你的创作意图：面向${state.workspaceForm.phase}${state.workspaceForm.grade}，围绕“${state.workspaceForm.topic}”制作一条${state.workspaceForm.duration}视频。为了让内容更适合课堂使用，我建议先确认表达角度、结尾方式和镜头重点。`
      },
      {
        id: `msg-${Date.now()}-2`,
        role: "assistant",
        kind: "analysis",
        text:
          "从一期平台使用习惯看，最好不要直接进入生成，而是先通过 2 到 3 轮对话把课堂语气、学生熟悉场景和镜头节奏补齐。这样后面的脚本和分镜更稳定，也更容易通过审核。"
      }
    ],
    summary: {
      audience: `${state.workspaceForm.phase}${state.workspaceForm.grade}`,
      angle: `${state.workspaceForm.topic}的校园表达`,
      ending: "课堂行动倡议",
      style: state.workspaceForm.tone,
      mustInclude: ["课堂提问引入", "学生熟悉的校园场景", "结尾行动倡议"]
    }
  };
}

function appendConversationTurn(prompt) {
  const lowerPrompt = prompt || "";
  state.conversation.messages.push({
    id: `msg-${Date.now()}-u`,
    role: "user",
    kind: "reply",
    text: lowerPrompt
  });
  const next = {
    id: `msg-${Date.now()}-a`,
    role: "assistant",
    kind: "analysis",
    text: "我已根据你的补充调整创作方向。新的对话结论会同步到右侧摘要，并作为生成脚本与分镜的依据。"
  };
  if (lowerPrompt.includes("课堂导入")) {
    state.conversation.summary.angle = "先提问再进入案例";
    state.conversation.summary.mustInclude[0] = "课堂提问引入";
    next.text = "好的，我会把第一镜头改成更明确的课堂提问式导入，让老师更容易承接到讲授环节。";
  } else if (lowerPrompt.includes("校园案例")) {
    state.conversation.summary.angle = "校园真实案例优先";
    state.conversation.summary.mustInclude[1] = "图书角、值日与志愿服务";
    next.text = "收到，我会用更贴近学生生活的校园案例替换抽象表述，让视频更像课堂前置导入。";
  } else if (lowerPrompt.includes("庄重")) {
    state.conversation.summary.style = "庄重叙事";
    next.text = "我会把旁白语气调整得更庄重，同时保留适龄表达，不做过度煽情。";
  } else if (lowerPrompt.includes("行动倡议")) {
    state.conversation.summary.ending = "行动倡议";
    state.conversation.summary.mustInclude[2] = "结尾行动倡议";
    next.text = "结尾会改成“今天我们能做什么”的行动倡议，方便教师顺势发问。";
  } else if (lowerPrompt.includes("60 秒")) {
    next.text = "我会控制镜头数量和字幕密度，把总时长稳定在 60 秒左右，适合课堂导入。";
  }
  state.conversation.messages.push(next);
}

function chatBubble(message) {
  const isAssistant = message.role === "assistant";
  return `
    <div class="flex ${isAssistant ? "justify-start" : "justify-end"}">
      <div class="max-w-[88%] rounded-[1.6rem] border border-line ${isAssistant ? "bg-white/70" : "bg-[#dde5e8]"} px-5 py-4">
        <div class="mb-2 text-xs uppercase tracking-[0.22em] ${isAssistant ? "text-slate" : "text-[#41545d]"}">
          ${isAssistant ? "AI 创作助手" : "教师补充"}
        </div>
        <div class="text-sm leading-8 ${isAssistant ? "text-slate" : "text-ink"}">${message.text}</div>
      </div>
    </div>
  `;
}

function templateById(id) {
  return TEMPLATE_LIBRARY.find((item) => item.id === id) || TEMPLATE_LIBRARY[0];
}

function currentTemplate() {
  return templateById(state.workspaceForm.templateId);
}

function currentTask() {
  return state.tasks.find((item) => item.id === state.ui.activeTaskId) || state.tasks[0];
}

function currentReview() {
  return state.reviews.find((item) => item.id === state.ui.activeReviewId) || state.reviews[0];
}

function currentAsset() {
  return state.assets.find((item) => item.id === state.ui.activeAssetId) || state.assets[0];
}

function currentMember() {
  return state.members.find((item) => item.id === state.ui.activeMemberId) || state.members[0];
}

function currentPublish() {
  return state.publishItems.find((item) => item.id === state.ui.activePublishId) || state.publishItems[0];
}

function bindEvents() {
  document.querySelectorAll("[data-action='login']").forEach((button) => {
    button.addEventListener("click", () => {
      state.loggedIn = true;
      saveState();
      setPendingToast("已进入一期投标演示版。");
      window.location.href = pageUrl("dashboard");
    });
  });

  document.querySelectorAll("[data-action='logout']").forEach((button) => {
    button.addEventListener("click", () => {
      state.loggedIn = false;
      saveState();
      setPendingToast("已返回登录页。");
      window.location.href = loginUrl();
    });
  });

  document.querySelectorAll("[data-field]").forEach((element) => {
    const eventName = element.tagName === "SELECT" ? "change" : "input";
    element.addEventListener(eventName, () => {
      state.workspaceForm[element.dataset.field] = element.value;
      saveState();
    });
  });

  document.querySelectorAll("[data-filter-type]").forEach((button) => {
    button.addEventListener("click", () => {
      const type = button.dataset.filterType;
      const value = button.dataset.filterValue;
      if (type === "template-filter") state.ui.templateFilter = value;
      if (type === "task-filter") state.ui.taskFilter = value;
      if (type === "asset-filter") state.ui.assetFilter = value;
      if (type === "publish-filter") state.ui.publishFilter = value;
      if (type === "ops-tab") state.ui.opsTab = value;
      if (type === "audit-tab") state.ui.reviewAuditTab = value;
      saveState();
      remount();
    });
  });

  bindAction("save-draft", () => {
    const task = state.tasks[0];
    task.title = state.workspaceForm.topic;
    task.updatedAt = "刚刚保存";
    task.status = "draft";
    task.script = `${state.workspaceForm.goal} 系统已按“${currentTemplate().title}”生成新的脚本草稿。`;
    state.ui.activeTaskId = task.id;
    saveState();
    showToast("草稿已保存。");
  });

  bindAction("enter-chat", () => {
    state.conversation = buildConversationFromForm();
    saveState();
    setPendingToast("已进入 AI 多轮对话创作室。");
    window.location.href = pageUrl("chat");
  });

  bindAction("chat-reset", () => {
    state.conversation = buildConversationFromForm();
    saveState();
    showToast("对话已重置为基于当前主题的建议版本。");
    remount();
  });

  bindAction("chat-quick-reply", (button) => {
    appendConversationTurn(button.dataset.prompt);
    saveState();
    remount();
  });

  bindAction("chat-confirm-generate", () => {
    const task = state.tasks[0];
    task.title = state.workspaceForm.topic;
    task.templateId = state.workspaceForm.templateId;
    task.updatedAt = "刚刚生成";
    task.progress = 84;
    task.status = "draft";
    task.modelChain = "腾讯混元 + AI 对话澄清链路";
    task.steps[3].status = "done";
    task.steps[4].status = "active";
    task.script = `${state.workspaceForm.goal} AI 已根据多轮对话确认“${state.conversation.summary.angle}”作为主表达角度，并结合${state.workspaceForm.phase}${state.workspaceForm.grade}、${state.workspaceForm.edition}与“${currentTemplate().title}”生成适龄化脚本。`;
    task.storyboard = [
      `镜头1：${state.conversation.summary.mustInclude[0]}，用课堂提问引入主题。`,
      `镜头2：${state.conversation.summary.mustInclude[1]}，解释价值观与现实生活的关联。`,
      `镜头3：${state.conversation.summary.mustInclude[2]}，以${state.conversation.summary.ending}收束。`
    ];
    state.ui.activeTaskId = task.id;
    saveState();
    setPendingToast("对话确认完成，已生成任务并跳转到结果页。");
    window.location.href = pageUrl("tasks");
  });

  bindAction("preview-template", (button) => {
    const template = templateById(button.dataset.templateId);
    showToast(`已预览模板：${template.title}`);
  });

  bindAction("use-template", (button) => {
    state.workspaceForm.templateId = button.dataset.templateId;
    saveState();
    setPendingToast("模板已套用到课程主题工作台。");
    window.location.href = pageUrl("workspace");
  });

  document.querySelectorAll("[data-task-select]").forEach((button) => {
    button.addEventListener("click", () => {
      state.ui.activeTaskId = button.dataset.taskSelect;
      saveState();
      remount();
    });
  });

  bindAction("submit-review", () => {
    const task = currentTask();
    task.status = "review";
    task.updatedAt = "刚刚提交审核";
    if (!state.reviews.find((item) => item.taskId === task.id)) {
      state.reviews.unshift({
        id: `rv-${Date.now()}`,
        taskId: task.id,
        title: task.title,
        school: "实验学校思政组",
        applicant: "李老师",
        severity: "低",
        tags: ["新提交任务"],
        machine: "脚本与字幕已过机审，等待视频关键帧人工抽检。",
        notes: "建议复核结尾字幕是否更适合课堂语言。",
        auditModules: {
          text: { title: "文本审校", summary: "文本初审通过。", points: ["语言适龄。"] },
          image: { title: "图像审校", summary: "图像未发现异常。", points: ["可进入下一步。"] },
          video: { title: "视频关键帧", summary: "待人工抽检。", points: ["建议确认结尾镜头节奏。"] },
          audio: { title: "音频与配音", summary: "配音待最终确认。", points: ["语速建议保持当前水平。"] }
        },
        keyframes: [{ time: "00:12", label: "待人工抽检", note: "提交后新增的待审关键帧。" }],
        subtitleSegments: [{ time: "00:21", text: "待进一步确认字幕表达。", level: "safe" }],
        history: [{ time: "刚刚", title: "任务提交审核", desc: "系统已创建审核记录，等待复核。" }]
      });
      state.ui.activeReviewId = state.reviews[0].id;
    }
    saveState();
    showToast("任务已提交审核。");
    remount();
  });

  bindAction("open-review-from-task", () => {
    const task = currentTask();
    const review = state.reviews.find((item) => item.taskId === task.id) || state.reviews[0];
    state.ui.activeReviewId = review.id;
    state.ui.reviewDrawerOpen = true;
    saveState();
    setPendingToast("已定位到对应审核详情。");
    window.location.href = pageUrl("review");
  });

  document.querySelectorAll("[data-review-select]").forEach((button) => {
    button.addEventListener("click", () => {
      state.ui.activeReviewId = button.dataset.reviewSelect;
      state.ui.reviewDrawerOpen = true;
      saveState();
      remount();
    });
  });

  bindAction("open-review-drawer", () => {
    state.ui.reviewDrawerOpen = true;
    saveState();
    remount();
  });

  bindAction("close-review-drawer", () => {
    state.ui.reviewDrawerOpen = false;
    saveState();
    remount();
  });

  bindAction("review-approve", () => {
    const review = currentReview();
    const task = state.tasks.find((item) => item.id === review.taskId);
    if (task) {
      task.status = "approved";
      task.updatedAt = "刚刚审核通过";
    }
    let publish = state.publishItems.find((item) => item.taskId === review.taskId);
    if (!publish) {
      publish = {
        id: `pub-${Date.now()}`,
        taskId: review.taskId,
        title: review.title,
        status: "review",
        version: "v1.0",
        channel: "待发布",
        operator: "审核员 当前用户",
        updatedAt: "刚刚进入待发布"
      };
      state.publishItems.unshift(publish);
    } else {
      publish.status = "review";
      publish.updatedAt = "刚刚进入待发布";
    }
    state.ui.activePublishId = publish.id;
    saveState();
    setPendingToast("审核已通过，已流转至发布中心。");
    window.location.href = pageUrl("publish");
  });

  bindAction("review-reject", () => {
    const review = currentReview();
    const task = state.tasks.find((item) => item.id === review.taskId);
    if (task) {
      task.status = "draft";
      task.updatedAt = "刚刚退回修改";
    }
    saveState();
    showToast("内容已退回工作台修改。");
    remount();
  });

  document.querySelectorAll("[data-asset-select]").forEach((button) => {
    button.addEventListener("click", () => {
      state.ui.activeAssetId = button.dataset.assetSelect;
      saveState();
      remount();
    });
  });

  bindAction("reuse-asset", () => {
    showToast(`已将“${currentAsset().title}”加入当前任务素材篮。`);
  });

  document.querySelectorAll("[data-publish-select]").forEach((button) => {
    button.addEventListener("click", () => {
      state.ui.activePublishId = button.dataset.publishSelect;
      saveState();
      remount();
    });
  });

  bindAction("publish-item", () => {
    const item = currentPublish();
    item.status = "published";
    item.channel = "新区资源平台";
    item.updatedAt = "刚刚发布";
    saveState();
    showToast("内容已发布，并生成审计记录。");
    remount();
  });

  bindAction("recall-item", () => {
    const item = currentPublish();
    item.status = "recalled";
    item.updatedAt = "刚刚下架";
    saveState();
    showToast("内容已下架，并保留回溯记录。");
    remount();
  });

  document.querySelectorAll("[data-org-node]").forEach((button) => {
    button.addEventListener("click", () => {
      state.ui.orgNode = button.dataset.orgNode;
      saveState();
      remount();
    });
  });

  document.querySelectorAll("[data-member-select]").forEach((button) => {
    button.addEventListener("click", () => {
      state.ui.activeMemberId = button.dataset.memberSelect;
      saveState();
      remount();
    });
  });
}

function bindAction(name, handler) {
  document.querySelectorAll(`[data-action="${name}"]`).forEach((button) => {
    button.addEventListener("click", () => handler(button));
  });
}

function remount() {
  mount();
}

function showToast(message) {
  const root = document.getElementById("toast-root");
  if (!root) return;
  root.innerHTML = `<div class="fixed bottom-6 left-1/2 z-[60] -translate-x-1/2 rounded-full bg-[#24343d] px-5 py-3 text-sm font-medium text-white shadow-soft fade-in">${message}</div>`;
  clearTimeout(window.__prototypeToastTimer);
  window.__prototypeToastTimer = setTimeout(() => {
    root.innerHTML = "";
  }, 2200);
}

mount();
