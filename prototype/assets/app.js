const NAV_ITEMS = [
  { id: "dashboard", label: "首页工作台", icon: "01" },
  { id: "workspace", label: "课程主题工作台", icon: "02" },
  { id: "templates", label: "模板中心", icon: "03" },
  { id: "tasks", label: "任务与生成结果", icon: "04" },
  { id: "review", label: "审核工作台", icon: "05" },
  { id: "assets", label: "素材资产库", icon: "06" },
  { id: "publish", label: "发布与审计中心", icon: "07" },
  { id: "org", label: "组织与权限中心", icon: "08" },
  { id: "ops", label: "成本与运营中心", icon: "09" }
];

const TEMPLATE_LIBRARY = [
  {
    id: "tpl-hero",
    category: "课程主题",
    title: "英雄人物微课模板",
    tone: "庄重叙事",
    description: "适合讲述榜样人物、生平片段与价值提炼。",
    scenes: 8
  },
  {
    id: "tpl-history",
    category: "国风历史",
    title: "历史场景分镜模板",
    tone: "写意纪实",
    description: "适合历史事件、节点事件与时代变迁叙述。",
    scenes: 10
  },
  {
    id: "tpl-event",
    category: "专题活动",
    title: "节日主题宣讲模板",
    tone: "温和激励",
    description: "适合清明、国庆、学雷锋等专题教育活动。",
    scenes: 6
  },
  {
    id: "tpl-flagship",
    category: "示范课",
    title: "示范课堂精品模板",
    tone: "镜头精致",
    description: "适合精品课与样板内容，强调镜头节奏与字幕质量。",
    scenes: 12
  }
];

const state = {
  loggedIn: false,
  currentPage: "dashboard",
  toast: "",
  user: {
    name: "李老师",
    role: "天府新区实验学校 / 思政教师"
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
  tasks: [
    {
      id: "task-101",
      title: "雷锋精神与当代少年责任",
      templateId: "tpl-event",
      status: "draft",
      owner: "李老师",
      progress: 72,
      updatedAt: "今天 14:35",
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
      severity: "中",
      tags: ["人物史实核验", "字幕表述收敛"],
      machine: "文本安全通过；图像安全通过；视频关键帧命中 1 条“表述建议”。",
      notes:
        "建议将“世界顶尖”修订为“重要贡献”，避免夸饰性表达；其余内容符合教材一致性要求。"
    },
    {
      id: "rv-2",
      taskId: "task-101",
      title: "雷锋精神与当代少年责任",
      school: "实验小学五年级组",
      severity: "低",
      tags: ["待机审完成"],
      machine: "视频合成中，暂未产出完整审核结果。",
      notes: "等待成片后进入正式审核。"
    }
  ],
  assets: [
    {
      id: "asset-1",
      type: "视频片段",
      title: "校园志愿劳动镜头组",
      source: "审核通过 / 区域共建",
      usage: "已复用 18 次",
      description: "适合劳动教育、责任担当主题视频的通用片段。"
    },
    {
      id: "asset-2",
      type: "字幕模板",
      title: "思政微课双栏字幕",
      source: "系统模板",
      usage: "已复用 42 次",
      description: "左侧关键词、右侧释义，适合小学中高段内容讲解。"
    },
    {
      id: "asset-3",
      type: "人物模板",
      title: "英雄人物生平模板",
      source: "学校定制",
      usage: "已复用 7 次",
      description: "统一英雄人物类脚本结构、分镜节奏和结尾价值升华。"
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
      scope: "主题创建、草稿编辑、提交审核",
      status: "正常"
    },
    {
      id: "mb-2",
      name: "王宁",
      role: "审核员",
      scope: "审核工作台、发布审计、下架回溯",
      status: "正常"
    },
    {
      id: "mb-3",
      name: "周主任",
      role: "学校管理员",
      scope: "组织成员、模板分配、资产授权",
      status: "正常"
    }
  ]
};

function bootstrapState() {
  const params = new URLSearchParams(window.location.search);
  const route = window.location.hash.replace("#", "");
  if (params.get("autologin") === "1") {
    state.loggedIn = true;
  }
  if (NAV_ITEMS.some((item) => item.id === route)) {
    state.currentPage = route;
  }
}

function mount() {
  const app = document.getElementById("app");
  app.className = "grain min-h-screen";
  app.innerHTML = state.loggedIn ? renderShell() : renderLogin();
  syncLocation();
  bindEvents();
}

function syncLocation() {
  if (!window.history || !window.history.replaceState) return;
  const params = new URLSearchParams(window.location.search);
  if (state.loggedIn) {
    params.set("autologin", "1");
    window.history.replaceState({}, "", `${window.location.pathname}?${params.toString()}#${state.currentPage}`);
  } else {
    params.delete("autologin");
    const query = params.toString();
    window.history.replaceState({}, "", `${window.location.pathname}${query ? `?${query}` : ""}`);
  }
}

function renderLogin() {
  return `
    <div class="relative min-h-screen overflow-hidden px-6 py-10 md:px-12">
      <div class="hero-ring left-[-8rem] top-[-5rem] h-72 w-72"></div>
      <div class="hero-ring right-[-6rem] top-12 h-96 w-96"></div>
      <div class="mx-auto flex min-h-[calc(100vh-5rem)] max-w-7xl items-center gap-10 lg:grid lg:grid-cols-[1.1fr_0.9fr]">
        <section class="fade-up">
          <p class="mb-5 text-sm uppercase tracking-[0.45em] text-slate">Web Prototype / Phase 1</p>
          <h1 class="font-display max-w-3xl text-4xl leading-tight text-ink md:text-6xl">
            中小学思政 AI 内容支持平台
          </h1>
          <p class="mt-6 max-w-2xl text-base leading-8 text-slate md:text-lg">
            一期原型围绕“内容生成、审核闭环、资产沉淀、组织权限、发布审计”展开，
            采用克制的教育平台风格，强调稳定、清晰与流程可追踪。
          </p>
          <div class="mt-10 flex flex-wrap gap-3">
            ${["课程工作台", "模板中心", "审核工作台", "资产库", "发布审计", "组织权限", "成本运营"]
              .map((item) => `<span class="tag-chip">${item}</span>`)
              .join("")}
          </div>
        </section>
        <section class="panel panel-strong fade-up rounded-[2rem] p-7 md:p-9">
          <div class="mb-8">
            <p class="text-sm uppercase tracking-[0.35em] text-slate">Sign In</p>
            <h2 class="font-display mt-3 text-3xl text-ink">进入一期原型</h2>
            <p class="mt-3 text-sm leading-7 text-slate">
              当前演示角色默认以学校教师身份登录，同时可在系统内切换查看审核、管理和运营视角。
            </p>
          </div>
          <div class="space-y-4">
            <label class="block">
              <span class="mb-2 block text-sm text-slate">账号</span>
              <input class="w-full rounded-2xl border border-line bg-white/70 px-4 py-3 outline-none transition focus:border-ocean" value="teacher@tianfu.edu.cn" />
            </label>
            <label class="block">
              <span class="mb-2 block text-sm text-slate">密码</span>
              <input type="password" class="w-full rounded-2xl border border-line bg-white/70 px-4 py-3 outline-none transition focus:border-ocean" value="123456" />
            </label>
            <label class="block">
              <span class="mb-2 block text-sm text-slate">角色</span>
              <select class="w-full rounded-2xl border border-line bg-white/70 px-4 py-3 outline-none transition focus:border-ocean">
                <option>思政教师</option>
                <option>审核员</option>
                <option>学校管理员</option>
                <option>教育局管理员</option>
              </select>
            </label>
          </div>
          <button data-action="login" class="mt-8 w-full rounded-full bg-ocean px-5 py-3 text-sm font-semibold text-white transition hover:translate-y-[-1px] hover:bg-[#273841]">
            进入平台原型
          </button>
          <div class="mt-6 grid gap-3 md:grid-cols-3">
            ${metricCard("工作流", "主题输入 -> 生成 -> 审核 -> 发布")}
            ${metricCard("一期重点", "生成审核闭环")}
            ${metricCard("移动端", "二期扩展")}
          </div>
        </section>
      </div>
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

function renderShell() {
  const nav = NAV_ITEMS.map(
    (item) => `
      <button
        data-nav="${item.id}"
        class="nav-link ${state.currentPage === item.id ? "active" : ""} flex w-full items-center gap-3 rounded-2xl border border-transparent px-4 py-3 text-left text-sm text-slate"
      >
        <span class="inline-flex h-9 w-9 items-center justify-center rounded-full border border-line bg-white/60 text-[0.7rem] font-bold text-ink">${item.icon}</span>
        <span>${item.label}</span>
      </button>
    `
  ).join("");

  return `
    <div class="min-h-screen p-4 md:p-5">
      <div class="mx-auto grid min-h-[calc(100vh-2rem)] max-w-[1600px] grid-cols-1 gap-4 lg:grid-cols-[280px_minmax(0,1fr)]">
        <aside class="panel rounded-[2rem] px-5 py-6">
          <div class="border-b border-line pb-5">
            <p class="text-xs uppercase tracking-[0.42em] text-slate">Phase 1</p>
            <h1 class="font-display mt-3 text-2xl leading-tight text-ink">思政 AI 内容支持平台</h1>
            <p class="mt-3 text-sm leading-7 text-slate">以学校和教育局可交付为目标的一期 Web 原型。</p>
          </div>
          <nav class="mt-5 space-y-1.5">${nav}</nav>
          <div class="mt-6 rounded-[1.75rem] border border-line bg-white/60 p-4">
            <p class="text-xs uppercase tracking-[0.28em] text-slate">当前身份</p>
            <p class="mt-2 text-lg font-semibold text-ink">${state.user.name}</p>
            <p class="mt-1 text-sm text-slate">${state.user.role}</p>
            <button data-action="logout" class="mt-4 rounded-full border border-line px-4 py-2 text-xs font-semibold text-slate transition hover:bg-white">
              返回登录页
            </button>
          </div>
        </aside>
        <main class="panel rounded-[2rem]">
          <header class="flex flex-col gap-4 border-b border-line px-6 py-5 md:flex-row md:items-center md:justify-between">
            <div>
              <p class="text-xs uppercase tracking-[0.34em] text-slate">一期原型演示</p>
              <h2 class="font-display mt-2 text-2xl md:text-3xl">${pageMeta(state.currentPage).title}</h2>
              <p class="mt-1 text-sm leading-7 text-slate">${pageMeta(state.currentPage).desc}</p>
            </div>
            <div class="flex flex-wrap items-center gap-3">
              <button data-action="quick-template" class="rounded-full border border-line bg-white/75 px-4 py-2 text-sm font-medium text-ink transition hover:bg-white">套用模板</button>
              <button data-action="quick-review" class="rounded-full border border-line bg-white/75 px-4 py-2 text-sm font-medium text-ink transition hover:bg-white">查看审核队列</button>
              <button data-action="quick-publish" class="rounded-full bg-ocean px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#273841]">进入发布闭环</button>
            </div>
          </header>
          <section class="p-6 md:p-7">${renderCurrentPage()}</section>
        </main>
      </div>
      ${state.toast ? `<div class="fixed bottom-6 left-1/2 z-50 -translate-x-1/2 rounded-full bg-[#24343d] px-5 py-3 text-sm font-medium text-white shadow-soft">${state.toast}</div>` : ""}
    </div>
  `;
}

function pageMeta(pageId) {
  const meta = {
    dashboard: {
      title: "首页工作台",
      desc: "平台概览、待办提醒和关键入口，帮助教师与管理角色快速进入闭环。"
    },
    workspace: {
      title: "课程主题工作台",
      desc: "输入学段、教材与教学目标，联动模板和模型完成内容生产。"
    },
    templates: {
      title: "模板中心",
      desc: "沉淀标准化模板，确保不同学校产出的内容风格与质量一致。"
    },
    tasks: {
      title: "任务与生成结果",
      desc: "查看任务进度、脚本分镜与生成状态，并可直接发起审核。"
    },
    review: {
      title: "审核工作台",
      desc: "展示机审结果、风险标签、人工复核意见和审核留痕。"
    },
    assets: {
      title: "素材资产库",
      desc: "沉淀复用视频、图片、字幕与人物模板，形成学校与区域资产。"
    },
    publish: {
      title: "发布与审计中心",
      desc: "管理版本、发布状态、回溯记录与导出留痕，完成交付闭环。"
    },
    org: {
      title: "组织与权限中心",
      desc: "支持教育局、学校、教研组等多级组织和角色权限管理。"
    },
    ops: {
      title: "成本与运营中心",
      desc: "监控模型成本、审核命中与资产复用，支撑平台持续运营。"
    }
  };
  return meta[pageId];
}

function renderCurrentPage() {
  switch (state.currentPage) {
    case "dashboard":
      return renderDashboard();
    case "workspace":
      return renderWorkspace();
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
  const todoCount = state.tasks.filter((task) => task.status !== "approved").length;
  const reviewCount = state.reviews.length;
  return `
    <div class="space-y-6 fade-up">
      <div class="grid gap-4 xl:grid-cols-[1.35fr_0.85fr]">
        <div class="panel panel-strong rounded-[2rem] p-6">
          <div class="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p class="text-xs uppercase tracking-[0.3em] text-slate">Today</p>
              <h3 class="font-display mt-3 text-3xl text-ink">欢迎回来，${state.user.name}</h3>
              <p class="mt-3 max-w-2xl text-sm leading-7 text-slate">
                一期平台以“教师发起主题，系统生成内容，审核完成闭环”为中心。当前已有
                ${state.tasks.length} 个任务在系统内流转，其中 ${reviewCount} 个待审核。
              </p>
            </div>
            <div class="rounded-[1.6rem] border border-line bg-white/60 px-5 py-4">
              <div class="text-xs uppercase tracking-[0.24em] text-slate">一期里程碑</div>
              <div class="mt-2 text-lg font-semibold text-ink">Web 生成审核闭环已具备原型形态</div>
            </div>
          </div>
          <div class="mt-6 grid gap-3 md:grid-cols-4">
            ${statCard("待处理任务", String(todoCount), "生成中与待审核")}
            ${statCard("今日生成量", "12", "脚本/分镜/视频任务")}
            ${statCard("复用资产", "68%", "模板与素材复用率")}
            ${statCard("审核通过率", "92%", "本周区域样本")}
          </div>
        </div>
        <div class="panel panel-strong rounded-[2rem] p-6">
          <h3 class="font-display text-2xl">今日待办</h3>
          <div class="mt-5 space-y-3">
            ${todoItem("完成“雷锋精神”视频合成并提交审核", "生成任务", "workspace")}
            ${todoItem("复核“钱学森与科技报国”的字幕措辞", "审核工作台", "review")}
            ${todoItem("检查学校资产库中新增字幕模板的授权范围", "资产与权限", "org")}
          </div>
        </div>
      </div>
      <div class="grid gap-4 xl:grid-cols-[1.15fr_0.85fr_0.85fr]">
        <div class="panel panel-strong rounded-[2rem] p-6">
          <div class="flex items-center justify-between">
            <h3 class="font-display text-2xl">闭环流程</h3>
            <button data-nav="workspace" class="text-sm text-slate underline underline-offset-4">进入工作台</button>
          </div>
          <div class="mt-6 grid gap-3 md:grid-cols-5">
            ${processStep("主题输入", "学段、教材、目标")}
            ${processStep("模板匹配", "选择课程或活动模板")}
            ${processStep("内容生成", "脚本/分镜/图片/视频")}
            ${processStep("安全审核", "机审 + 人工复核")}
            ${processStep("发布归档", "发布渠道与审计留痕")}
          </div>
        </div>
        <div class="panel panel-strong rounded-[2rem] p-6">
          <h3 class="font-display text-2xl">审核概览</h3>
          <div class="mt-5 space-y-4">
            ${progressRow("文本安全通过", "96%")}
            ${progressRow("图片安全通过", "94%")}
            ${progressRow("视频关键帧修订", "18%")}
            ${progressRow("人工复核命中", "11%")}
          </div>
        </div>
        <div class="panel panel-strong rounded-[2rem] p-6">
          <h3 class="font-display text-2xl">快捷入口</h3>
          <div class="mt-5 grid gap-3">
            ${quickCard("新建课程主题", "进入一期最核心入口", "workspace")}
            ${quickCard("查看模板库", "统一课程风格与结构", "templates")}
            ${quickCard("进入发布中心", "查看版本与导出记录", "publish")}
          </div>
        </div>
      </div>
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

function todoItem(text, scope, target) {
  return `
    <button data-nav="${target}" class="w-full rounded-[1.4rem] border border-line bg-white/55 px-4 py-4 text-left transition hover:bg-white/80">
      <div class="text-sm font-semibold text-ink">${text}</div>
      <div class="mt-2 text-xs uppercase tracking-[0.2em] text-slate">${scope}</div>
    </button>
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

function progressRow(label, value) {
  const width = value;
  return `
    <div>
      <div class="mb-2 flex items-center justify-between text-sm">
        <span class="text-ink">${label}</span>
        <span class="text-slate">${value}</span>
      </div>
      <div class="data-bar h-3 rounded-full bg-[#dce3e6]" style="--bar-width:${width};"></div>
    </div>
  `;
}

function quickCard(title, desc, target) {
  return `
    <button data-nav="${target}" class="rounded-[1.5rem] border border-line bg-white/60 px-4 py-4 text-left transition hover:bg-white">
      <div class="text-base font-semibold text-ink">${title}</div>
      <div class="mt-2 text-sm leading-7 text-slate">${desc}</div>
    </button>
  `;
}

function renderWorkspace() {
  const template = currentTemplate();
  return `
    <div class="grid gap-6 xl:grid-cols-[0.95fr_1.05fr] fade-up">
      <div class="panel panel-strong rounded-[2rem] p-6">
        <div class="flex items-center justify-between">
          <h3 class="font-display text-2xl">主题输入</h3>
          <button data-nav="templates" class="rounded-full border border-line px-4 py-2 text-sm text-slate transition hover:bg-white">浏览模板</button>
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
          <button data-action="generate-task" class="rounded-full bg-ocean px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#273841]">生成教学内容</button>
        </div>
      </div>
      <div class="space-y-6">
        <div class="panel panel-strong rounded-[2rem] p-6">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-xs uppercase tracking-[0.24em] text-slate">Selected Template</p>
              <h3 class="font-display mt-2 text-2xl">${template.title}</h3>
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
            ${stepRow("脚本生成", "文本模型根据主题、目标和模板生成教学脚本。", "done")}
            ${stepRow("分镜设计", "按镜头节奏自动拆解画面与旁白。", "done")}
            ${stepRow("图片与视频生成", "根据题材选择主生产模型或成本优化模型。", "active")}
            ${stepRow("字幕与配音", "自动生成字幕并套用适龄配音模板。", "todo")}
            ${stepRow("提交审核", "进入机审与人工复核闭环。", "todo")}
          </div>
        </div>
      </div>
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

function miniInfo(label, value) {
  return `
    <div class="rounded-[1.4rem] border border-line bg-white/65 p-4">
      <div class="text-xs uppercase tracking-[0.22em] text-slate">${label}</div>
      <div class="mt-2 text-base font-semibold text-ink">${value}</div>
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

function renderTemplates() {
  const categories = ["全部", ...new Set(TEMPLATE_LIBRARY.map((item) => item.category))];
  const templates = TEMPLATE_LIBRARY.filter(
    (item) => state.templateFilter === "全部" || item.category === state.templateFilter
  );
  return `
    <div class="space-y-6 fade-up">
      <div class="panel panel-strong rounded-[2rem] p-6">
        <div class="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h3 class="font-display text-2xl">标准模板库</h3>
            <p class="mt-2 text-sm leading-7 text-slate">沉淀课程、活动、人物和示范课模板，保证不同学校内容风格统一。</p>
          </div>
          <div class="flex flex-wrap gap-2">
            ${categories
              .map(
                (category) => `
                  <button data-template-filter="${category}" class="tag-chip ${state.templateFilter === category ? "active" : ""}">
                    ${category}
                  </button>
                `
              )
              .join("")}
          </div>
        </div>
      </div>
      <div class="grid gap-4 lg:grid-cols-2 2xl:grid-cols-4">
        ${templates
          .map(
            (item) => `
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
                  <button data-action="use-template" data-template-id="${item.id}" class="rounded-full bg-ocean px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#273841]">套用模板</button>
                </div>
              </article>
            `
          )
          .join("")}
      </div>
    </div>
  `;
}

function renderTasks() {
  const tasks = state.tasks.filter((task) => state.taskFilter === "全部" || task.status === state.taskFilter);
  const activeTask = currentTask();
  const template = TEMPLATE_LIBRARY.find((item) => item.id === activeTask.templateId);
  return `
    <div class="grid gap-6 xl:grid-cols-[0.82fr_1.18fr] fade-up">
      <div class="space-y-4">
        <div class="panel panel-strong rounded-[2rem] p-5">
          <div class="flex flex-wrap gap-2">
            ${["全部", "draft", "review", "approved"]
              .map(
                (filter) => `
                  <button data-task-filter="${filter}" class="tag-chip ${state.taskFilter === filter ? "active" : ""}">
                    ${filter === "draft" ? "生成中/草稿" : filter === "review" ? "待审核" : filter === "approved" ? "已通过" : "全部"}
                  </button>
                `
              )
              .join("")}
          </div>
        </div>
        ${tasks
          .map(
            (task) => `
              <button data-task-select="${task.id}" class="panel panel-strong w-full rounded-[2rem] p-5 text-left transition ${task.id === state.activeTaskId ? "border-ocean" : ""}">
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
            `
          )
          .join("")}
      </div>
      <div class="space-y-4">
        <div class="panel panel-strong rounded-[2rem] p-6">
          <div class="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p class="text-xs uppercase tracking-[0.24em] text-slate">Task Detail</p>
              <h3 class="font-display mt-2 text-3xl">${activeTask.title}</h3>
              <p class="mt-2 text-sm leading-7 text-slate">套用模板：${template.title} · 最近更新：${activeTask.updatedAt}</p>
            </div>
            <div class="flex gap-3">
              <button data-action="submit-review" class="rounded-full border border-line px-4 py-2 text-sm font-medium text-ink transition hover:bg-white">提交审核</button>
              <button data-nav="review" class="rounded-full bg-ocean px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#273841]">去审核工作台</button>
            </div>
          </div>
          <div class="mt-6 grid gap-3 md:grid-cols-5">
            ${activeTask.steps
              .map(
                (step) => `
                  <div class="rounded-[1.4rem] border border-line bg-white/60 p-4">
                    <div class="flex items-center gap-3">
                      <span class="step-dot ${step.status}"></span>
                      <span class="text-sm font-semibold text-ink">${step.name}</span>
                    </div>
                  </div>
                `
              )
              .join("")}
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
  const task = state.tasks.find((item) => item.id === active.taskId);
  return `
    <div class="grid gap-6 xl:grid-cols-[0.75fr_1.1fr_0.8fr] fade-up">
      <div class="space-y-4">
        ${state.reviews
          .map(
            (review) => `
              <button data-review-select="${review.id}" class="panel panel-strong w-full rounded-[2rem] p-5 text-left transition ${review.id === state.activeReviewId ? "border-ocean" : ""}">
                <div class="flex items-center justify-between gap-3">
                  <div class="text-lg font-semibold text-ink">${review.title}</div>
                  <span class="status-pill ${review.severity === "低" ? "status-approved" : "status-review"}">${review.severity}风险</span>
                </div>
                <div class="mt-3 text-sm text-slate">${review.school}</div>
                <div class="mt-4 flex flex-wrap gap-2">
                  ${review.tags.map((tag) => `<span class="tag-chip">${tag}</span>`).join("")}
                </div>
              </button>
            `
          )
          .join("")}
      </div>
      <div class="space-y-4">
        <div class="panel panel-strong rounded-[2rem] p-6">
          <div class="flex flex-wrap items-start justify-between gap-3">
            <div>
              <p class="text-xs uppercase tracking-[0.24em] text-slate">Machine Review</p>
              <h3 class="font-display mt-2 text-3xl">${active.title}</h3>
              <p class="mt-2 text-sm leading-7 text-slate">任务状态：${task ? task.updatedAt : "刚刚更新"} · 风险等级：${active.severity}</p>
            </div>
            <div class="rounded-[1.5rem] border border-line bg-white/65 px-4 py-3 text-sm leading-7 text-slate">
              机审覆盖：文本 / 图片 / 视频 / 字幕
            </div>
          </div>
          <div class="mt-6 grid gap-4 lg:grid-cols-[1fr_0.8fr]">
            <div class="rounded-[1.8rem] border border-line bg-white/55 p-5">
              <div class="aspect-[16/10] rounded-[1.5rem] bg-gradient-to-br from-[#566870] via-[#88979d] to-[#d1dade]"></div>
              <div class="mt-5 grid gap-3 md:grid-cols-3">
                ${keyFrame("00:05", "人物画面正常")}
                ${keyFrame("00:18", "字幕表述建议")}
                ${keyFrame("00:31", "镜头切换正常")}
              </div>
            </div>
            <div class="rounded-[1.8rem] border border-line bg-white/55 p-5">
              <div class="text-sm font-semibold text-ink">关键字幕片段</div>
              <div class="mt-4 space-y-3 text-sm leading-7 text-slate">
                <div class="rounded-[1.2rem] border border-line bg-white/60 p-4">“钱学森为我国航天事业作出了重要贡献。”</div>
                <div class="rounded-[1.2rem] border border-line bg-[#eadfd7] p-4 text-[#77534c]">“世界顶尖科学家”建议调整为更克制表述。</div>
                <div class="rounded-[1.2rem] border border-line bg-white/60 p-4">“科技报国不仅是历史，也是今天的使命。”</div>
              </div>
            </div>
          </div>
        </div>
        <div class="panel panel-strong rounded-[2rem] p-6">
          <h4 class="font-display text-2xl">审核轨迹</h4>
          <div class="relative mt-5 space-y-5 pl-6">
            <div class="timeline-line"></div>
            ${timelineItem("09:25", "输入前审校通过", "未发现敏感词与违禁素材。")}
            ${timelineItem("11:08", "输出机审完成", active.machine)}
            ${timelineItem("11:26", "人工复核建议", active.notes)}
          </div>
        </div>
      </div>
      <div class="panel panel-strong rounded-[2rem] p-6">
        <h4 class="font-display text-2xl">人工复核决策</h4>
        <div class="mt-5 rounded-[1.6rem] border border-line bg-white/55 p-5">
          <div class="text-sm font-semibold text-ink">风险标签</div>
          <div class="mt-3 flex flex-wrap gap-2">
            ${active.tags.map((tag) => `<span class="tag-chip active">${tag}</span>`).join("")}
          </div>
        </div>
        <label class="mt-5 block">
          <span class="mb-2 block text-sm text-slate">复核意见</span>
          <textarea id="review-note" class="h-40 w-full rounded-[1.5rem] border border-line bg-white/70 px-4 py-3 text-sm leading-7 outline-none transition focus:border-ocean">${active.notes}</textarea>
        </label>
        <div class="mt-5 flex flex-wrap gap-3">
          <button data-action="review-approve" class="rounded-full bg-ocean px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#273841]">审核通过</button>
          <button data-action="review-reject" class="rounded-full border border-line px-5 py-3 text-sm font-semibold text-ink transition hover:bg-white">退回修改</button>
        </div>
        <div class="mt-6 rounded-[1.6rem] border border-line bg-white/55 p-5 text-sm leading-7 text-slate">
          发布前仍保留二次抽检与下架回溯能力，确保平台具备完整审计留痕。
        </div>
      </div>
    </div>
  `;
}

function keyFrame(time, text) {
  return `
    <div class="rounded-[1.3rem] border border-line bg-white/55 p-4">
      <div class="text-xs uppercase tracking-[0.2em] text-slate">${time}</div>
      <div class="mt-2 text-sm font-medium text-ink">${text}</div>
    </div>
  `;
}

function timelineItem(time, title, desc) {
  return `
    <div class="relative rounded-[1.4rem] border border-line bg-white/55 p-4">
      <span class="absolute left-[-1.32rem] top-5 h-3 w-3 rounded-full bg-[#7a8d96]"></span>
      <div class="text-xs uppercase tracking-[0.2em] text-slate">${time}</div>
      <div class="mt-2 text-sm font-semibold text-ink">${title}</div>
      <div class="mt-2 text-sm leading-7 text-slate">${desc}</div>
    </div>
  `;
}

function renderAssets() {
  const types = ["全部", ...new Set(state.assets.map((asset) => asset.type))];
  const assets = state.assets.filter((asset) => state.assetFilter === "全部" || asset.type === state.assetFilter);
  const active = currentAsset();
  return `
    <div class="grid gap-6 xl:grid-cols-[1fr_0.95fr] fade-up">
      <div class="space-y-4">
        <div class="panel panel-strong rounded-[2rem] p-5">
          <div class="flex flex-wrap gap-2">
            ${types
              .map(
                (type) => `
                  <button data-asset-filter="${type}" class="tag-chip ${state.assetFilter === type ? "active" : ""}">
                    ${type}
                  </button>
                `
              )
              .join("")}
          </div>
        </div>
        <div class="grid gap-4 lg:grid-cols-2">
          ${assets
            .map(
              (asset) => `
                <button data-asset-select="${asset.id}" class="panel panel-strong rounded-[2rem] p-5 text-left transition ${asset.id === state.activeAssetId ? "border-ocean" : ""}">
                  <div class="flex items-center justify-between gap-3">
                    <span class="status-pill status-draft">${asset.type}</span>
                    <span class="text-xs uppercase tracking-[0.2em] text-slate">${asset.usage}</span>
                  </div>
                  <h4 class="font-display mt-4 text-2xl leading-tight">${asset.title}</h4>
                  <p class="mt-3 text-sm leading-7 text-slate">${asset.description}</p>
                </button>
              `
            )
            .join("")}
        </div>
      </div>
      <div class="panel panel-strong rounded-[2rem] p-6">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-xs uppercase tracking-[0.24em] text-slate">Asset Detail</p>
            <h3 class="font-display mt-2 text-3xl">${active.title}</h3>
          </div>
          <button data-action="reuse-asset" class="rounded-full bg-ocean px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#273841]">复用到当前任务</button>
        </div>
        <div class="mt-5 grid gap-3 md:grid-cols-3">
          ${miniInfo("类型", active.type)}
          ${miniInfo("来源", active.source)}
          ${miniInfo("复用次数", active.usage)}
        </div>
        <div class="mini-chart mt-5 rounded-[1.8rem] p-5">
          <div class="rounded-[1.5rem] bg-[#d4dce0] p-5">
            <div class="aspect-[16/9] rounded-[1.3rem] bg-gradient-to-br from-[#61747c] to-[#ced8dc]"></div>
          </div>
        </div>
        <div class="mt-5 rounded-[1.6rem] border border-line bg-white/55 p-5 text-sm leading-7 text-slate">
          ${active.description}
        </div>
        <div class="mt-5 grid gap-3 md:grid-cols-2">
          ${miniInfo("授权范围", "学校可用 / 区域复用")}
          ${miniInfo("审核状态", "已通过机审与人工复核")}
        </div>
      </div>
    </div>
  `;
}

function renderPublish() {
  const filters = ["全部", "draft", "review", "published", "recalled"];
  const items = state.publishItems.filter(
    (item) => state.publishFilter === "全部" || item.status === state.publishFilter
  );
  const active = currentPublish();
  return `
    <div class="grid gap-6 xl:grid-cols-[0.88fr_1.12fr] fade-up">
      <div class="space-y-4">
        <div class="panel panel-strong rounded-[2rem] p-5">
          <div class="flex flex-wrap gap-2">
            ${filters
              .map(
                (filter) => `
                  <button data-publish-filter="${filter}" class="tag-chip ${state.publishFilter === filter ? "active" : ""}">
                    ${filter === "draft" ? "草稿" : filter === "review" ? "待发布" : filter === "published" ? "已发布" : filter === "recalled" ? "已下架" : "全部"}
                  </button>
                `
              )
              .join("")}
          </div>
        </div>
        ${items
          .map(
            (item) => `
              <button data-publish-select="${item.id}" class="panel panel-strong w-full rounded-[2rem] p-5 text-left transition ${item.id === state.activePublishId ? "border-ocean" : ""}">
                <div class="flex items-center justify-between gap-3">
                  <div class="text-lg font-semibold text-ink">${item.title}</div>
                  ${statusBadge(item.status)}
                </div>
                <div class="mt-3 text-sm text-slate">${item.version} · ${item.updatedAt}</div>
                <div class="mt-2 text-sm text-slate">${item.channel}</div>
              </button>
            `
          )
          .join("")}
      </div>
      <div class="panel panel-strong rounded-[2rem] p-6">
        <div class="flex flex-wrap items-start justify-between gap-3">
          <div>
            <p class="text-xs uppercase tracking-[0.24em] text-slate">Publish Detail</p>
            <h3 class="font-display mt-2 text-3xl">${active.title}</h3>
          </div>
          <div class="flex gap-3">
            <button data-action="publish-item" class="rounded-full bg-ocean px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#273841]">发布</button>
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
  const node = state.orgNodes.find((item) => item.id === state.orgNode);
  const member = currentMember();
  return `
    <div class="grid gap-6 xl:grid-cols-[0.68fr_0.8fr_0.72fr] fade-up">
      <div class="panel panel-strong rounded-[2rem] p-6">
        <h3 class="font-display text-2xl">组织树</h3>
        <div class="mt-5 space-y-3">
          ${state.orgNodes
            .map(
              (item, index) => `
                <button data-org-node="${item.id}" class="w-full rounded-[1.5rem] border ${item.id === state.orgNode ? "border-ocean bg-white" : "border-line bg-white/55"} px-4 py-4 text-left transition hover:bg-white">
                  <div class="text-xs uppercase tracking-[0.2em] text-slate">0${index + 1}</div>
                  <div class="mt-2 text-lg font-semibold text-ink">${item.name}</div>
                  <div class="mt-2 text-sm leading-7 text-slate">${item.description}</div>
                </button>
              `
            )
            .join("")}
        </div>
      </div>
      <div class="panel panel-strong rounded-[2rem] p-6">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-xs uppercase tracking-[0.24em] text-slate">当前节点</p>
            <h3 class="font-display mt-2 text-3xl">${node.name}</h3>
          </div>
          <button class="rounded-full border border-line px-4 py-2 text-sm text-slate transition hover:bg-white">新增成员</button>
        </div>
        <div class="mt-6 space-y-3">
          ${state.members
            .map(
              (item) => `
                <button data-member-select="${item.id}" class="w-full rounded-[1.5rem] border ${item.id === state.activeMemberId ? "border-ocean bg-white" : "border-line bg-white/55"} px-4 py-4 text-left transition hover:bg-white">
                  <div class="flex items-center justify-between gap-3">
                    <div class="text-lg font-semibold text-ink">${item.name}</div>
                    <span class="status-pill status-draft">${item.role}</span>
                  </div>
                  <div class="mt-3 text-sm leading-7 text-slate">${item.scope}</div>
                </button>
              `
            )
            .join("")}
        </div>
      </div>
      <div class="panel panel-strong rounded-[2rem] p-6">
        <h3 class="font-display text-2xl">权限详情</h3>
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

function permissionItem(label, enabled) {
  return `
    <div class="flex items-center justify-between rounded-[1.3rem] border border-line bg-white/55 px-4 py-3">
      <span class="text-sm font-medium text-ink">${label}</span>
      <span class="status-pill ${enabled ? "status-approved" : "status-rejected"}">${enabled ? "已开启" : "未授权"}</span>
    </div>
  `;
}

function renderOps() {
  const tabs = ["概览", "模型成本", "审核表现"];
  return `
    <div class="space-y-6 fade-up">
      <div class="panel panel-strong rounded-[2rem] p-5">
        <div class="flex flex-wrap gap-2">
          ${tabs
            .map(
              (tab) => `
                <button data-ops-tab="${tab}" class="tag-chip ${state.opsTab === tab ? "active" : ""}">
                  ${tab}
                </button>
              `
            )
            .join("")}
        </div>
      </div>
      <div class="grid gap-4 xl:grid-cols-4">
        ${statCard("标准路线单条成本", "1.65 元", "混元 + 审核组合")}
        ${statCard("常规月度预算", "3300 元", "按 2000 条测算")}
        ${statCard("精品内容单条成本", "3.30 元", "用于样板课与示范片")}
        ${statCard("审核人工介入率", "11%", "本周样本测算")}
      </div>
      <div class="grid gap-4 xl:grid-cols-[1.15fr_0.85fr]">
        <div class="panel panel-strong rounded-[2rem] p-6">
          <div class="flex items-center justify-between">
            <h3 class="font-display text-2xl">${state.opsTab}</h3>
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

function bindEvents() {
  document.querySelectorAll("[data-nav]").forEach((button) => {
    button.addEventListener("click", () => {
      state.currentPage = button.dataset.nav;
      mount();
    });
  });

  document.querySelectorAll("[data-field]").forEach((element) => {
    element.addEventListener("input", () => {
      state.workspaceForm[element.dataset.field] = element.value;
    });
    element.addEventListener("change", () => {
      state.workspaceForm[element.dataset.field] = element.value;
    });
  });

  bindAction("login", () => {
    state.loggedIn = true;
    state.currentPage = "dashboard";
    toast("已进入一期原型。");
    mount();
  });

  bindAction("logout", () => {
    state.loggedIn = false;
    state.toast = "";
    mount();
  });

  bindAction("save-draft", () => {
    const task = state.tasks[0];
    task.title = state.workspaceForm.topic;
    task.updatedAt = "刚刚保存";
    task.status = "draft";
    task.script = `${state.workspaceForm.goal} 系统已按“${currentTemplate().title}”生成新的脚本草稿。`;
    state.activeTaskId = task.id;
    toast("草稿已保存。");
    mount();
  });

  bindAction("generate-task", () => {
    const task = state.tasks[0];
    task.title = state.workspaceForm.topic;
    task.templateId = state.workspaceForm.templateId;
    task.updatedAt = "刚刚生成";
    task.progress = 84;
    task.status = "draft";
    task.steps[3].status = "done";
    task.steps[4].status = "active";
    task.script = `${state.workspaceForm.goal} 系统根据${state.workspaceForm.phase}${state.workspaceForm.grade}、${state.workspaceForm.edition}与“${currentTemplate().title}”自动生成脚本，并匹配适龄化旁白节奏。`;
    task.storyboard = [
      "镜头1：课堂提问引入，说明本节主题与现实关联。",
      "镜头2：校园或历史场景切入，突出价值观的可感知表达。",
      "镜头3：结尾以行动倡议收束，方便教师课堂延展。"
    ];
    state.activeTaskId = task.id;
    state.currentPage = "tasks";
    toast("生成任务已启动，并自动跳转到结果页。");
    mount();
  });

  bindAction("quick-template", () => {
    state.currentPage = "templates";
    mount();
  });

  bindAction("quick-review", () => {
    state.currentPage = "review";
    mount();
  });

  bindAction("quick-publish", () => {
    state.currentPage = "publish";
    mount();
  });

  document.querySelectorAll("[data-template-filter]").forEach((button) => {
    button.addEventListener("click", () => {
      state.templateFilter = button.dataset.templateFilter;
      mount();
    });
  });

  bindAction("preview-template", (button) => {
    const template = TEMPLATE_LIBRARY.find((item) => item.id === button.dataset.templateId);
    toast(`已预览模板：${template.title}`);
    mount();
  });

  bindAction("use-template", (button) => {
    state.workspaceForm.templateId = button.dataset.templateId;
    state.currentPage = "workspace";
    toast("模板已套用到课程主题工作台。");
    mount();
  });

  document.querySelectorAll("[data-task-filter]").forEach((button) => {
    button.addEventListener("click", () => {
      state.taskFilter = button.dataset.taskFilter;
      mount();
    });
  });

  document.querySelectorAll("[data-task-select]").forEach((button) => {
    button.addEventListener("click", () => {
      state.activeTaskId = button.dataset.taskSelect;
      mount();
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
        severity: "低",
        tags: ["新提交任务"],
        machine: "脚本与字幕已过机审，等待视频关键帧人工抽检。",
        notes: "建议复核结尾字幕是否更适合课堂语言。"
      });
    }
    state.activeReviewId = state.reviews[0].id;
    toast("任务已提交审核。");
    mount();
  });

  document.querySelectorAll("[data-review-select]").forEach((button) => {
    button.addEventListener("click", () => {
      state.activeReviewId = button.dataset.reviewSelect;
      mount();
    });
  });

  bindAction("review-approve", () => {
    const review = currentReview();
    const task = state.tasks.find((item) => item.id === review.taskId);
    if (task) {
      task.status = "approved";
      task.updatedAt = "刚刚审核通过";
    }
    const publishItem = state.publishItems.find((item) => item.taskId === review.taskId);
    if (publishItem) {
      publishItem.status = "review";
      publishItem.updatedAt = "刚刚进入待发布";
    } else {
      state.publishItems.unshift({
        id: `pub-${Date.now()}`,
        taskId: review.taskId,
        title: review.title,
        status: "review",
        version: "v1.0",
        channel: "待发布",
        operator: "审核员 当前用户",
        updatedAt: "刚刚进入待发布"
      });
      state.activePublishId = state.publishItems[0].id;
    }
    state.currentPage = "publish";
    toast("审核已通过，已流转至发布中心。");
    mount();
  });

  bindAction("review-reject", () => {
    const review = currentReview();
    const task = state.tasks.find((item) => item.id === review.taskId);
    if (task) {
      task.status = "draft";
      task.updatedAt = "刚刚退回修改";
    }
    toast("内容已退回工作台修改。");
    mount();
  });

  document.querySelectorAll("[data-asset-filter]").forEach((button) => {
    button.addEventListener("click", () => {
      state.assetFilter = button.dataset.assetFilter;
      mount();
    });
  });

  document.querySelectorAll("[data-asset-select]").forEach((button) => {
    button.addEventListener("click", () => {
      state.activeAssetId = button.dataset.assetSelect;
      mount();
    });
  });

  bindAction("reuse-asset", () => {
    toast(`已将“${currentAsset().title}”加入当前任务素材篮。`);
    mount();
  });

  document.querySelectorAll("[data-publish-filter]").forEach((button) => {
    button.addEventListener("click", () => {
      state.publishFilter = button.dataset.publishFilter;
      mount();
    });
  });

  document.querySelectorAll("[data-publish-select]").forEach((button) => {
    button.addEventListener("click", () => {
      state.activePublishId = button.dataset.publishSelect;
      mount();
    });
  });

  bindAction("publish-item", () => {
    const item = currentPublish();
    item.status = "published";
    item.channel = "新区资源平台";
    item.updatedAt = "刚刚发布";
    toast("内容已发布，并生成审计记录。");
    mount();
  });

  bindAction("recall-item", () => {
    const item = currentPublish();
    item.status = "recalled";
    item.updatedAt = "刚刚下架";
    toast("内容已下架，并保留回溯记录。");
    mount();
  });

  document.querySelectorAll("[data-org-node]").forEach((button) => {
    button.addEventListener("click", () => {
      state.orgNode = button.dataset.orgNode;
      mount();
    });
  });

  document.querySelectorAll("[data-member-select]").forEach((button) => {
    button.addEventListener("click", () => {
      state.activeMemberId = button.dataset.memberSelect;
      mount();
    });
  });

  document.querySelectorAll("[data-ops-tab]").forEach((button) => {
    button.addEventListener("click", () => {
      state.opsTab = button.dataset.opsTab;
      mount();
    });
  });
}

function bindAction(name, handler) {
  document.querySelectorAll(`[data-action="${name}"]`).forEach((button) => {
    button.addEventListener("click", () => handler(button));
  });
}

function statusBadge(status) {
  return `<span class="status-pill ${badgeClass(status)}">${humanStatus(status)}</span>`;
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
    draft: "草稿/生成中",
    review: "待审核/待发布",
    approved: "审核通过",
    published: "已发布",
    recalled: "已下架"
  };
  return map[status] || status;
}

function currentTemplate() {
  return TEMPLATE_LIBRARY.find((item) => item.id === state.workspaceForm.templateId) || TEMPLATE_LIBRARY[0];
}

function currentTask() {
  return state.tasks.find((item) => item.id === state.activeTaskId) || state.tasks[0];
}

function currentReview() {
  return state.reviews.find((item) => item.id === state.activeReviewId) || state.reviews[0];
}

function currentAsset() {
  return state.assets.find((item) => item.id === state.activeAssetId) || state.assets[0];
}

function currentMember() {
  return state.members.find((item) => item.id === state.activeMemberId) || state.members[0];
}

function currentPublish() {
  return state.publishItems.find((item) => item.id === state.activePublishId) || state.publishItems[0];
}

function toast(message) {
  state.toast = message;
  clearTimeout(window.__prototypeToastTimer);
  window.__prototypeToastTimer = setTimeout(() => {
    state.toast = "";
    mount();
  }, 2200);
}

bootstrapState();
mount();
