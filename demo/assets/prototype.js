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
  { id: "dashboard", label: "MVP 总览", icon: "01" },
  { id: "workspace", label: "视频创作发起台", icon: "02" },
  { id: "chat", label: "强制脚本审核台", icon: "03" },
  { id: "templates", label: "年级与风格预设", icon: "04" },
  { id: "tasks", label: "生成队列与微调", icon: "05" },
  { id: "review", label: "输出安全复审", icon: "06" },
  { id: "assets", label: "学校素材与标签", icon: "07" },
  { id: "publish", label: "视频库与审计", icon: "08" },
  { id: "org", label: "角色与权限", icon: "09" },
  { id: "ops", label: "配额、队列与成本", icon: "10" }
];

const PAGE_META = {
  login: {
    title: "产品原型",
    desc: "AI+思政教育视频工作流平台 · MVP Web 原型"
  },
  dashboard: {
    title: "MVP 总览",
    desc: "围绕“教师发起 -> 教师强制审稿 -> 自动生成 -> 微调 -> 输出审核 -> 入库”的主流程总览。"
  },
  workspace: {
    title: "视频创作发起台",
    desc: "教师或学生从一句自然语言指令发起任务，并绑定年级、知识点标签、学校定制参数。"
  },
  chat: {
    title: "强制脚本审核台",
    desc: "系统先自动产出脚本，教师必须逐镜确认或修改，未确认前不得进入素材生成。"
  },
  templates: {
    title: "年级与风格预设",
    desc: "统一低年级卡通、高年级写实插画、学生作业等预设，保证适龄表达。"
  },
  tasks: {
    title: "生成队列与微调",
    desc: "查看排队、素材批量生成、单分镜重生成、配音与字幕微调等任务细节。"
  },
  review: {
    title: "输出安全复审",
    desc: "覆盖输入拦截、0.6~0.9 人工复审、0.9 自动拦截、历史人物强制复审等规则。"
  },
  assets: {
    title: "学校素材与标签",
    desc: "管理校徽、校训、校园背景、思政标签与本校红色资源，支持学校级隔离。"
  },
  publish: {
    title: "视频库与审计",
    desc: "通过的视频进入教师视频库，学生作品需教师确认后可见，并保留完整审计记录。"
  },
  org: {
    title: "角色与权限",
    desc: "体现教师、学生、学校管理员、平台运营四类角色权限与每日生成上限。"
  },
  ops: {
    title: "配额、队列与成本",
    desc: "展示 50/200 并发、5 分钟 SLA、每日配额、30 天保留与模型成本等运营指标。"
  }
};

const TEMPLATE_LIBRARY = [
  {
    id: "tpl-moral",
    category: "校园案例",
    title: "道德与法治课堂导入",
    tone: "卡通叙事",
    description: "适合 3 分钟内的课堂导入视频，默认包含故事、总结与行动倡议三段式结构。",
    scenes: 6
  },
  {
    id: "tpl-hero",
    category: "历史人物",
    title: "历史人物精神主题",
    tone: "庄重叙事",
    description: "适合雷锋、周恩来等人物主题，自动触发历史人物强制复审提醒。",
    scenes: 8
  },
  {
    id: "tpl-campus",
    category: "学校定制",
    title: "校园场景融入模板",
    tone: "温和启发",
    description: "默认调入校徽、校训和指定校园背景，适合展示“发生在我们的校园里”的故事型视频。",
    scenes: 7
  },
  {
    id: "tpl-student",
    category: "学生作品",
    title: "学生课后创作模板",
    tone: "轻叙事",
    description: "默认走“学生发起 -> 教师代审 -> 教师确认可见”的审核链路，突出安全边界。",
    scenes: 5
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
      role: "天府新区实验学校 / 道德与法治教师",
      bidRole: "教师主流程演示身份"
    },
    ui: {
      templateFilter: "全部",
      taskFilter: "全部",
      assetFilter: "全部",
      publishFilter: "全部",
      orgNode: "school",
      opsTab: "配额与队列",
      activeTaskId: "task-101",
      activeReviewId: "rv-1",
      activeAssetId: "asset-2",
      activeMemberId: "mb-1",
      activePublishId: "pub-1",
      reviewDrawerOpen: true,
      reviewAuditTab: "video"
    },
    workspaceForm: {
      creatorRole: "教师",
      gradeBand: "小学5-6年级",
      edition: "统编版",
      topic: "生成关于“小学道德与法治课程中诚信主题”的3分钟动画视频，包含故事、总结及核心观点升华。",
      goal: "用于课堂导入，必须包含校园故事、课程总结与学生可执行的行动倡议。",
      tone: "卡通叙事",
      duration: "3分钟内",
      templateId: "tpl-moral",
      schoolPreset: "固定叠加校徽+校训",
      knowledgeTags: "诚信, 校园文明, 小学道德与法治"
    },
    conversation: {
      messages: [
        {
          id: "msg-1",
          role: "assistant",
          kind: "analysis",
          text:
            "系统已自动生成 6 个分镜脚本草案，当前处于“教师强制审核”阶段。未点击“确认脚本无误”前，系统不会启动素材批量生成。"
        },
        {
          id: "msg-2",
          role: "assistant",
          kind: "analysis",
          text: "建议优先检查三项：1）低年级词汇是否足够简单；2）每个分镜是否包含明确画面描述；3）结尾是否有课堂可承接的行动倡议。"
        },
        {
          id: "msg-3",
          role: "assistant",
          kind: "analysis",
          text:
            "当前年级预设为“小学5-6年级”，系统已将默认语速设置为 220 字/分钟，画风为卡通插画；如教师手动覆盖，新的参数会同步到后续配音与字幕。"
        }
      ],
      summary: {
        audience: "小学5-6年级",
        angle: "校园诚信故事",
        ending: "行动倡议",
        style: "卡通叙事",
        mustInclude: ["班级借书小故事", "诚信失而复得的转折", "教师可承接的课堂提问"]
      }
    },
    tasks: [
      {
        id: "task-101",
        title: "诚信主题 3 分钟课堂视频",
        templateId: "tpl-moral",
        status: "draft",
        owner: "李老师",
        progress: 68,
        updatedAt: "今天 14:35",
        modelChain: "文本大模型 + 文生图/视频 + 配音合成 + 多模态审核",
        queue: "排队第 3 位 / 预计 2 分钟",
        quota: "教师今日已用 4 / 10 次",
        studentSource: "教师本人发起",
        steps: [
          { name: "输入审核", status: "done" },
          { name: "脚本确认", status: "done" },
          { name: "素材生成", status: "active" },
          { name: "微调处理", status: "todo" },
          { name: "输出审核", status: "todo" }
        ],
        script:
          "视频围绕“借书忘还 -> 主动归还 -> 同学理解诚信价值 -> 教师总结升华”展开，确保包含故事、总结和核心观点升华，适合小学课堂导入。",
        storyboard: [
          "镜头1：教室借书角，学生发现借书卡上名字与实际归还不一致，旁白引出“诚信是什么”。",
          "镜头2：主人公主动承认自己忘记归还，画面保持校园卡通场景，突出“敢于认错”。",
          "镜头3：老师总结诚信不仅是守约，也是对同学的尊重，并提出“今天你准备怎么做”的课堂追问。"
        ],
        riskSummary: "当前为低风险普通校园题材，待素材生成完成后进行输出机审。"
      },
      {
        id: "task-102",
        title: "钱学森与科技报国",
        templateId: "tpl-hero",
        status: "review",
        owner: "王教研员",
        progress: 100,
        updatedAt: "今天 11:20",
        modelChain: "文本大模型 + 视频生成 + 多模态审核",
        queue: "已完成",
        quota: "教师今日已用 7 / 10 次",
        studentSource: "教师本人发起",
        steps: [
          { name: "输入审核", status: "done" },
          { name: "脚本确认", status: "done" },
          { name: "素材生成", status: "done" },
          { name: "微调处理", status: "done" },
          { name: "输出审核", status: "done" }
        ],
        script: "围绕人物精神与国家发展关系展开，因包含真实历史人物形象，自动进入教师人工复审。",
        storyboard: ["镜头1：人物出场", "镜头2：科研场景", "镜头3：结尾价值升华"],
        riskSummary: "已命中“真实历史人物”规则，需教师观看全片后确认。"
      },
      {
        id: "task-103",
        title: "学生作业：校园文明一分钟短片",
        templateId: "tpl-student",
        status: "approved",
        owner: "陈老师",
        progress: 100,
        updatedAt: "昨天 17:40",
        modelChain: "文本大模型 + 图片生成 + 配音合成",
        queue: "已完成",
        quota: "学生今日已用 1 / 2 次",
        studentSource: "学生发起，教师代审后通过",
        steps: [
          { name: "输入审核", status: "done" },
          { name: "脚本确认", status: "done" },
          { name: "素材生成", status: "done" },
          { name: "微调处理", status: "done" },
          { name: "输出审核", status: "done" }
        ],
        script: "学生提交后由班主任完成脚本审核、合成与终审，当前已对学生可见。",
        storyboard: ["镜头1：课间礼让", "镜头2：文明提醒", "镜头3：结尾倡议"],
        riskSummary: "审核通过，可进入教师视频库，并同步给学生查看。"
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
        tags: ["历史人物强制复审", "字幕表述收敛", "观看全片后确认"],
        machine: "输入审核通过；输出机审置信度 0.71；因涉及真实历史人物，强制进入教师复审。",
        notes:
          "建议将“世界顶尖”修订为“作出重要贡献”，避免夸饰性表达；教师需看完整片后再决定是否通过。",
        auditModules: {
          text: {
            title: "文本审校",
            summary: "已通过文本内容安全与教材一致性规则，但存在需要收敛的表述。",
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
            summary: "镜头节奏稳定，00:18 处字幕与旁白语气偏满，且命中历史人物复审规则。",
            points: [
              "00:05 人物介绍镜头正常。",
              "00:18 关键帧字幕建议修订。",
              "00:31 结尾价值升华镜头可保留，但须看完整片后确认。"
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
          { time: "00:18", label: "字幕修订点", note: "建议弱化措辞并复核史实表述" },
          { time: "00:31", label: "结尾升华", note: "课堂导向明确，但需教师完整观看后确认" }
        ],
        subtitleSegments: [
          { time: "00:07", text: "钱学森为我国航天事业作出了重要贡献。", level: "safe" },
          { time: "00:18", text: "他是世界顶尖科学家。", level: "warn" },
          { time: "00:33", text: "科技报国不仅是历史，也是今天的使命。", level: "safe" }
        ],
        history: [
          { time: "09:25", title: "输入前审校通过", desc: "未发现敏感词与违禁素材。" },
          { time: "11:08", title: "输出机审完成", desc: "文本、图像安全通过，视频关键帧命中 1 条表述建议，置信度 0.71。" },
          { time: "11:26", title: "人工复核提醒", desc: "涉及真实历史人物，需教师完整观看后再确认是否通过。" }
        ]
      },
      {
        id: "rv-2",
        taskId: "task-101",
        title: "诚信主题 3 分钟课堂视频",
        school: "实验小学五年级组",
        applicant: "李老师",
        severity: "低",
        tags: ["待机审完成", "普通校园题材"],
        machine: "视频素材生成中，暂未产出完整审核结果。",
        notes: "等待成片后进入正式机审；当前不涉及历史人物与高风险题材。",
        auditModules: {
          text: { title: "文本审校", summary: "脚本已通过初步校验。", points: ["表达贴近校园生活。", "无敏感输入命中。"] },
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
        type: "校园背景图",
        title: "实验小学操场全景",
        source: "学校管理员上传",
        usage: "已复用 18 次",
        description: "管理员指定为“背景替换模式”默认图，可在故事发生场景中智能融入校园环境。",
        access: "本校隔离可用"
      },
      {
        id: "asset-2",
        type: "校徽与校训",
        title: "固定叠加校徽+校训",
        source: "学校管理员上传",
        usage: "已复用 42 次",
        description: "用于片头片尾固定叠加，支持透明度、位置和水印样式设置，是学校定制化 MVP 的核心资产。",
        access: "本校隔离可用"
      },
      {
        id: "asset-3",
        type: "知识点标签",
        title: "本校红色资源标签包",
        source: "教师自定义",
        usage: "已复用 7 次",
        description: "包含“嘉兴红船”“井冈山精神”等本校可见标签，可注入脚本提示词以确保贴合本地教学资源。",
        access: "本校隔离可用"
      }
    ],
    publishItems: [
      {
        id: "pub-1",
        taskId: "task-103",
        title: "学生作业：校园文明一分钟短片",
        status: "published",
        version: "v1.2",
        channel: "教师视频库 / 学生可见",
        operator: "班主任 李老师",
        updatedAt: "今天 09:20"
      },
      {
        id: "pub-2",
        taskId: "task-102",
        title: "钱学森与科技报国",
        status: "review",
        version: "v0.9",
        channel: "待教师复审",
        operator: "审核员 王宁",
        updatedAt: "今天 11:32"
      },
      {
        id: "pub-3",
        taskId: "task-101",
        title: "诚信主题 3 分钟课堂视频",
        status: "draft",
        version: "v0.4",
        channel: "草稿箱",
        operator: "李老师",
        updatedAt: "今天 14:35"
      }
    ],
    orgNodes: [
      { id: "bureau", name: "平台运营", description: "全局审核阈值、标签库和高风险内容管理" },
      { id: "district", name: "区域资源中心", description: "模板与素材统筹，支持区域共建" },
      { id: "school", name: "实验学校", description: "学校级定制素材、视频库与权限配置" },
      { id: "group", name: "班级/教研组", description: "教师代审学生作品与组内协同" }
    ],
    members: [
      {
        id: "mb-1",
        name: "李老师",
        role: "教师",
        scope: "自由输入指令、强制审核脚本、可修改分镜/配音/字幕、审批学生生成的视频，每日上限 10 个"
      },
      {
        id: "mb-2",
        name: "张同学",
        role: "学生",
        scope: "输入指令、查看教师通过后的作品、违规后重新提交，每日上限 2 个"
      },
      {
        id: "mb-3",
        name: "周主任",
        role: "学校管理员",
        scope: "上传校徽/校训/校园图片、配置水印样式、设置年级默认参数、查看全校生成记录"
      },
      {
        id: "mb-4",
        name: "平台运营",
        role: "平台运营",
        scope: "维护思政知识点标签库、审核高风险内容、管理全局审核模型阈值"
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
              <span>MVP</span>
              <strong>教师主导视频工作流</strong>
            </div>
            <p class="mt-8 text-xs uppercase tracking-[0.48em] text-slate">Web Prototype / AI Video Workflow</p>
            <h1 class="font-display mt-5 max-w-3xl text-4xl leading-tight text-ink md:text-6xl">
              AI+思政教育视频工作流平台
            </h1>
            <p class="mt-6 max-w-2xl text-base leading-8 text-slate md:text-lg">
              原型围绕“一句自然语言发起视频 -> 教师强制审核脚本 -> 自动生成素材 ->
              可选单镜头微调 -> 输出安全复审 -> 入库与学校定制”展开，面向教师、学生、
              学校管理员与平台运营四类角色。
            </p>
            <div class="mt-10 grid gap-3 md:grid-cols-2">
              ${proposalLine("项目定位", "中小学思政视频生成、审核、入库一体化平台")}
              ${proposalLine("MVP 目标", "10 分钟内产出 3 分钟教学视频，支持教师强制审稿")}
              ${proposalLine("服务对象", "教师、学生、学校管理员、平台运营")}
              ${proposalLine("核心约束", "未成年人内容安全、学校定制、配额与审计留痕")}
            </div>
          </div>
        </section>
        <section class="panel panel-strong fade-up rounded-[2.2rem] p-7 md:p-9">
          <div class="mb-8">
            <div class="proposal-chip">
              <span>SIGN IN</span>
              <strong>进入原型控制台</strong>
            </div>
            <h2 class="font-display mt-4 text-3xl text-ink">MVP 原型总入口</h2>
            <p class="mt-3 text-sm leading-7 text-slate">
              当前默认以教师视角进入，也可切换查看学生、学校管理员和平台运营所关心的页面。
            </p>
          </div>
          <div class="space-y-4">
            ${loginField("账号", "teacher@tianfu.edu.cn")}
            ${loginField("密码", "••••••", true)}
            <label class="block">
              <span class="mb-2 block text-sm text-slate">角色</span>
              <select class="surface-input">
                <option>思政教师</option>
                <option>审核员</option>
                <option>学校管理员</option>
                <option>教育局管理员</option>
              </select>
            </label>
          </div>
          <button data-action="login" class="mt-8 w-full rounded-full bg-ocean px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#243642]">
            进入视频工作流原型
          </button>
          <div class="mt-6 grid gap-3 md:grid-cols-3">
            ${metricCard("核心入口", "10 个业务页面")}
            ${metricCard("闭环能力", "发起 -> 审稿 -> 生成 -> 审核 -> 入库")}
            ${metricCard("扩展预留", "移动端预览与区域共建")}
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
              <span>MVP</span>
              <strong>视频工作流原型</strong>
            </div>
            <h1 class="font-display mt-4 text-2xl leading-tight text-ink">AI+思政教育视频工作流平台</h1>
            <p class="mt-3 text-sm leading-7 text-slate">以教师主流程为核心，补齐学生代审、学校定制、安全复审与运营指标的 MVP Web 原型。</p>
          </div>
          <nav class="mt-5 space-y-1.5">
            ${NAV_ITEMS.map((item) => navItem(item)).join("")}
          </nav>
          <div class="surface-block surface-block-quiet mt-6 p-4">
            <p class="text-xs uppercase tracking-[0.28em] text-slate">当前身份</p>
            <p class="mt-2 text-lg font-semibold text-ink">${state.user.name}</p>
            <p class="mt-1 text-sm text-slate">${state.user.role}</p>
            <div class="mt-4 flex flex-wrap gap-2">
              <span class="tag-chip">教师主流程</span>
              <span class="tag-chip">学校定制</span>
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
                <p class="text-xs uppercase tracking-[0.34em] text-slate">MVP 原型 · ${meta.title}</p>
                <h2 class="font-display mt-3 text-3xl md:text-4xl">${meta.title}</h2>
                <p class="mt-2 max-w-3xl text-sm leading-7 text-slate">${meta.desc}</p>
              </div>
              <div class="flex flex-wrap gap-2 xl:justify-end">
                <span class="proposal-chip"><strong>主链路</strong> 发起 / 审稿 / 生成 / 复审</span>
                <span class="proposal-chip"><strong>约束</strong> 配额 / 排队 / 审计</span>
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
                <span>WORKFLOW</span>
                <strong>教师主导视频生成闭环</strong>
              </div>
              <h3 class="font-display mt-4 text-3xl text-ink">一句话发起，教师必须先审稿，再进入自动生成</h3>
              <p class="mt-3 max-w-2xl text-sm leading-8 text-slate">
                当前共有 ${state.tasks.length} 个任务在系统中流转，其中 ${pendingTasks} 个仍需处理。MVP 重点展示教师主流程、
                学生代审流程、学校定制素材、内容安全阈值与配额/排队机制，而不是泛化的内容平台能力。
              </p>
            </div>
            <div class="surface-block surface-block-quiet px-5 py-4">
              <div class="text-xs uppercase tracking-[0.24em] text-slate">当前里程碑</div>
              <div class="mt-2 text-lg font-semibold text-ink">教师主流程、输出复审、学校定制与运营约束均已进入演示形态</div>
            </div>
          </div>
          <div class="mt-6 grid gap-3 md:grid-cols-4">
            ${statCard("教师剩余配额", "6 / 10", "教师每日上限 10 个")}
            ${statCard("学生待教师处理", "3 个", "学生提交后需教师代审")}
            ${statCard("当前排队", "12 人", "高峰期展示预计等待时间")}
            ${statCard("学校定制资产", "8 项", "校徽 / 校训 / 校园背景 / 标签")}
          </div>
        </div>
        <div class="panel panel-strong rounded-[2rem] p-6">
          <h3 class="font-display text-2xl">本次原型重点</h3>
          <div class="mt-5 space-y-3">
            ${todoCard("教师输入自然语言指令并绑定年级、标签、学校预设", "发起台", pageUrl("workspace"))}
            ${todoCard("系统生成脚本后，教师必须逐镜确认才能继续", "脚本审核台", pageUrl("chat"))}
            ${todoCard("查看排队、生成进度和单分镜重生成逻辑", "生成队列与微调", pageUrl("tasks"))}
            ${todoCard("演示输出机审、人工复审和完整审核日志", "输出安全复审", pageUrl("review"))}
          </div>
        </div>
      </div>
      <div class="grid gap-4 xl:grid-cols-[1.08fr_0.92fr_0.9fr]">
        <div class="panel panel-strong rounded-[2rem] p-6">
          <div class="flex items-center justify-between">
            <h3 class="font-display text-2xl">MVP 业务闭环</h3>
            <a href="${pageUrl("workspace")}" class="text-sm text-slate underline underline-offset-4">进入发起台</a>
          </div>
          <div class="mt-6 grid gap-3 md:grid-cols-6">
            ${processStep("输入指令", "一句话描述主题、时长与表达方式")}
            ${processStep("自动脚本", "系统输出结构化分镜、旁白与时长")}
            ${processStep("教师确认", "必须逐镜确认或修改脚本")}
            ${processStep("批量生成素材", "文生图/视频与配音自动生成")}
            ${processStep("单镜头微调", "仅重配音或重生画面+配音")}
            ${processStep("输出审核入库", "阈值判定、人审、进入视频库")}
          </div>
        </div>
        <div class="panel panel-strong rounded-[2rem] p-6">
          <h3 class="font-display text-2xl">安全阈值</h3>
          <div class="mt-5 space-y-4">
            ${progressRow("输入审核通过", "93%")}
            ${progressRow("0.9 以上自动拦截", "4%")}
            ${progressRow("0.6~0.9 人工复审", "11%")}
            ${progressRow("历史人物强制复审", "100%")}
          </div>
        </div>
        <div class="panel panel-strong rounded-[2rem] p-6">
          <h3 class="font-display text-2xl">推荐演示顺序</h3>
          <div class="mt-5 space-y-3">
            ${smallStep("01", "视频创作发起台", "输入指令，绑定年级、标签和学校预设")}
            ${smallStep("02", "强制脚本审核台", "展示教师必须确认脚本的核心门槛")}
            ${smallStep("03", "生成队列与微调", "演示队列、耗时、单分镜重生成")}
            ${smallStep("04", "输出安全复审", "展示 0.6 / 0.9 阈值和复审日志")}
            ${smallStep("05", "学校素材与标签", "展示校徽校训与校内标签隔离")}
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
              <span>INPUT</span>
              <strong>一句话发起视频</strong>
            </div>
            <h3 class="font-display mt-4 text-2xl">视频创作发起台</h3>
          </div>
          <a href="${pageUrl("templates")}" class="rounded-full border border-line px-4 py-2 text-sm text-slate transition hover:bg-white">查看预设</a>
        </div>
        <div class="mt-6 grid gap-4 md:grid-cols-2">
          ${field("发起主体", "creatorRole", state.workspaceForm.creatorRole, ["教师", "学生（需教师代审）"])}
          ${field("学段/年级", "gradeBand", state.workspaceForm.gradeBand, ["小学1-2年级", "小学3-4年级", "小学5-6年级", "初中7-9年级"])}
          ${field("教材版本", "edition", state.workspaceForm.edition, ["统编版", "地方版", "校本拓展"])}
          ${field("默认画风", "tone", state.workspaceForm.tone, ["卡通叙事", "皮影戏", "写实插画"])}
          ${field("创作指令", "topic", state.workspaceForm.topic)}
          ${field("视频时长", "duration", state.workspaceForm.duration, ["1分钟内", "90秒内", "3分钟内"])}
          ${field("学校定制", "schoolPreset", state.workspaceForm.schoolPreset, ["固定叠加校徽+校训", "智能融入校园背景", "仅使用系统默认样式"])}
        </div>
        <label class="mt-4 block">
          <span class="mb-2 block text-sm text-slate">课堂目标与必须包含内容</span>
          <textarea data-field="goal" class="surface-input h-32 text-sm leading-7">${state.workspaceForm.goal}</textarea>
        </label>
        <label class="mt-4 block">
          <span class="mb-2 block text-sm text-slate">知识点标签</span>
          <input data-field="knowledgeTags" value="${state.workspaceForm.knowledgeTags}" class="surface-input text-sm" />
        </label>
        <div class="mt-6 flex flex-wrap gap-3">
          <button data-action="save-draft" class="rounded-full border border-line px-5 py-3 text-sm font-semibold text-ink transition hover:bg-white">保存发起单</button>
          <button data-action="enter-chat" class="rounded-full bg-ocean px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#243642]">生成脚本并进入审核</button>
        </div>
      </div>
      <div class="space-y-6">
        <div class="panel panel-strong rounded-[2rem] p-6">
          <div class="flex items-start justify-between gap-4">
            <div>
              <div class="proposal-chip">
                <span>PRESET</span>
                <strong>当前套用预设</strong>
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
            <span class="text-sm text-slate">MVP 主链路已开启</span>
          </div>
          <div class="mt-6 space-y-4">
            ${stepRow("输入审核", "先拦截敏感、不当或诱导类指令；学生违规会留痕并可重试。", "done")}
            ${stepRow("自动生成脚本", "系统产出结构化分镜、旁白、时长和画面描述。", "active")}
            ${stepRow("教师强制审核", "教师必须确认脚本无误，未经确认不得进入下阶段。", "todo")}
            ${stepRow("批量生成素材", "逐镜生成画面、配音、字幕，并根据年级自动调节语速和画风。", "todo")}
            ${stepRow("输出审核与入库", "按阈值决定自动通过、教师复审或自动拦截。", "todo")}
          </div>
        </div>
        <div class="panel panel-strong rounded-[2rem] p-6">
          <div class="proposal-chip">
            <span>MVP RULES</span>
            <strong>当前任务会自动带上的约束</strong>
          </div>
          <div class="mt-5 grid gap-3 md:grid-cols-2">
            ${miniInfo("教师配额", "每日 10 个")}
            ${miniInfo("学生配额", "每日 2 个")}
            ${miniInfo("输出规格", "MP4 / 720p / ≤3分钟")}
            ${miniInfo("数据保留", "视频库 30 天")}
          </div>
          <div class="surface-block mt-5 p-5 text-sm leading-7 text-slate">
            如果发起主体切换为学生，脚本审核与最终确认都会自动流转到任课教师，学生本人无脚本审核权。
          </div>
        </div>
      </div>
    </div>
  `;
}

function renderChat() {
  const summary = state.conversation.summary;
  const duration = state.workspaceForm.duration || "3分钟内";
  const previewFrames = [
    {
      time: "镜头 01 · 35秒",
      title: "故事引子",
      desc: `用“${summary.mustInclude[0]}”建立情境，先让学生进入熟悉的校园事件。`
    },
    {
      time: "镜头 02 · 55秒",
      title: "价值解释",
      desc: `围绕“${summary.angle}”展开主体镜头，把抽象价值还原到真实校园行为。`
    },
    {
      time: "镜头 03 · 30秒",
      title: "总结升华",
      desc: `用“${summary.ending}”收尾，并保留“${summary.mustInclude[2]}”作为课堂追问钩子。`
    }
  ];
  return `
    <div class="grid gap-6 xl:grid-cols-[1.04fr_0.96fr] fade-up">
      <div class="panel panel-strong rounded-[2rem] p-6">
        <div class="flex flex-wrap items-center justify-between gap-3">
          <div>
            <div class="proposal-chip">
              <span>MANDATORY REVIEW</span>
              <strong>教师强制脚本审核</strong>
            </div>
            <h3 class="font-display mt-4 text-2xl">脚本没确认，素材生成按钮不会开放</h3>
            <p class="mt-2 text-sm leading-7 text-slate">
              系统已经按你的指令自动生成脚本草案。当前页面重点不是聊天，而是展示“教师必须审核/修改任意分镜并确认无误”这一核心门槛。
            </p>
          </div>
          <div class="flex gap-3">
            <button data-action="chat-reset" class="rounded-full border border-line px-4 py-2 text-sm font-medium text-ink transition hover:bg-white">恢复系统草案</button>
            <button data-action="chat-confirm-generate" class="rounded-full bg-ocean px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#243642]">确认脚本无误并生成素材</button>
          </div>
        </div>
        <div class="mt-6 rounded-[1.6rem] border border-[#d9c9b6] bg-[#fbf4eb] px-5 py-4 text-sm leading-7 text-[#76584a]">
          按需求，教师必须在此页完成脚本审核。若是学生发起任务，脚本同样在这里由任课教师完成审核，学生本人无法跳过。
        </div>
        <div class="mt-5 space-y-4">
          <div class="surface-block p-5">
            <div class="text-sm font-semibold text-ink">审核提示</div>
            <div class="mt-3 space-y-3">
              ${state.conversation.messages.map((message) => chatBubble(message)).join("")}
            </div>
          </div>
        </div>
        <div class="mt-5">
          <div class="text-sm font-semibold text-ink">常见调整动作</div>
          <div class="mt-3 flex flex-wrap gap-2">
            ${[
              "改成更低年级词汇",
              "加入校园真实案例",
              "改成庄重叙事",
              "结尾加入行动倡议",
              "压缩到 90 秒"
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
          <div class="flex items-start justify-between gap-4">
            <div>
              <div class="proposal-chip">
                <span>SCRIPT BOARD</span>
                <strong>自动脚本草案</strong>
              </div>
              <h3 class="font-display mt-4 text-2xl">当前脚本已经符合“故事 + 总结 + 升华”结构</h3>
            </div>
            <span class="status-pill status-review">待教师确认</span>
          </div>
          <div class="mt-5 rounded-[1.8rem] border border-[#2d4049]/10 bg-[#22343e] p-4 text-white shadow-[0_18px_40px_rgba(25,38,45,0.18)]">
            <div class="rounded-[1.5rem] border border-white/10 bg-[radial-gradient(circle_at_top_left,_rgba(214,227,233,0.22),_transparent_28%),linear-gradient(135deg,_#2d4752_0%,_#1f2d35_55%,_#152027_100%)] p-5">
              <div class="flex items-center justify-between text-[11px] uppercase tracking-[0.28em] text-white/65">
                <span>Script Preview</span>
                <span>${duration}</span>
              </div>
              <div class="mt-5 grid gap-4 lg:grid-cols-[1.15fr_0.85fr]">
                <div class="rounded-[1.4rem] border border-white/10 bg-white/5 p-5">
                  <div class="flex items-center justify-between">
                    <div>
                      <div class="text-xs uppercase tracking-[0.24em] text-white/45">脚本主轴</div>
                      <div class="mt-2 font-display text-2xl text-white">${summary.angle}</div>
                    </div>
                    <div class="grid h-14 w-14 place-items-center rounded-full border border-white/15 bg-white/10">
                      <div class="text-xs uppercase tracking-[0.26em] text-white/72">OK</div>
                    </div>
                  </div>
                  <p class="mt-4 max-w-md text-sm leading-7 text-white/72">
                    当前脚本会优先围绕 ${summary.mustInclude[1]} 这些学生熟悉场景展开，再用 ${summary.ending} 方式完成价值收束。
                  </p>
                  <div class="mt-6 grid gap-3 sm:grid-cols-3">
                    ${chatPreviewMetric("适用对象", summary.audience)}
                    ${chatPreviewMetric("语气设定", summary.style)}
                    ${chatPreviewMetric("建议时长", duration)}
                  </div>
                </div>
                <div class="space-y-3">
                  ${chatPreviewStrip("画面描述 01", summary.mustInclude[0], "h-24 bg-[linear-gradient(135deg,_rgba(248,251,252,0.20),_rgba(166,190,201,0.10)),radial-gradient(circle_at_20%_20%,_rgba(255,255,255,0.26),_transparent_38%),linear-gradient(180deg,_#5c7884_0%,_#364e59_100%)]")}
                  ${chatPreviewStrip("画面描述 02", summary.mustInclude[1], "h-24 bg-[linear-gradient(135deg,_rgba(223,232,214,0.18),_rgba(147,171,152,0.08)),radial-gradient(circle_at_78%_24%,_rgba(255,255,255,0.22),_transparent_26%),linear-gradient(180deg,_#566c61_0%,_#2f4038_100%)]")}
                  ${chatPreviewStrip("画面描述 03", summary.mustInclude[2], "h-24 bg-[linear-gradient(135deg,_rgba(235,224,206,0.18),_rgba(181,150,111,0.08)),radial-gradient(circle_at_50%_18%,_rgba(255,255,255,0.24),_transparent_30%),linear-gradient(180deg,_#75624a_0%,_#46392a_100%)]")}
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="panel panel-strong rounded-[2rem] p-6">
          <div class="proposal-chip">
            <span>STORYBOARD DRAFT</span>
            <strong>待确认分镜编排</strong>
          </div>
          <div class="mt-5 space-y-3">
            ${previewFrames.map((frame, index) => chatPreviewFrame(frame, index)).join("")}
          </div>
        </div>
        <div class="panel panel-strong rounded-[2rem] p-6">
          <div class="proposal-chip">
            <span>AFTER CONFIRM</span>
            <strong>确认后将启动的动作</strong>
          </div>
          <div class="mt-5 grid gap-3 md:grid-cols-2">
            ${miniInfo("表达角度", summary.angle)}
            ${miniInfo("结尾方式", summary.ending)}
            ${miniInfo("整体语气", summary.style)}
            ${miniInfo("适龄设置", summary.audience)}
          </div>
          <div class="mt-5 space-y-4">
            ${stepRow("批量生成素材", "系统会为每个分镜自动调用文生图/视频模型。", "done")}
            ${stepRow("字幕与配音", "依据当前年级设置自动生成语速与字幕样式。", "active")}
            ${stepRow("输出审核", "成片后再根据 0.6 / 0.9 阈值决定自动通过、复审或拦截。", "todo")}
          </div>
          <div class="surface-block mt-5 p-5 text-sm leading-7 text-slate">
            如果教师修改旁白但不改画面描述，后续“重新生成该分镜”只会重配音；如果改了画面描述，则会重生成画面 + 配音。
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
              <span>PRESET LIBRARY</span>
              <strong>年级与风格预设</strong>
            </div>
            <h3 class="font-display mt-4 text-2xl">统一适龄表达、画风和审核路径</h3>
            <p class="mt-2 text-sm leading-7 text-slate">预设不仅提高效率，也用于保证低年级词汇、高年级画风、历史人物复审与学生作品代审这些规则被默认带上。</p>
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
                <strong>排队、生成与微调</strong>
              </div>
              <h3 class="font-display mt-4 text-3xl">${activeTask.title}</h3>
              <p class="mt-2 text-sm leading-7 text-slate">套用模板：${template.title} · 模型链路：${activeTask.modelChain}</p>
            </div>
            <div class="flex gap-3">
              <button data-action="submit-review" class="rounded-full border border-line px-4 py-2 text-sm font-medium text-ink transition hover:bg-white">提交审核</button>
              <button data-action="open-review-from-task" class="rounded-full bg-ocean px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#243642]">查看审核详情</button>
            </div>
          </div>
          <div class="mt-6 grid gap-3 md:grid-cols-4">
            ${miniInfo("排队状态", activeTask.queue)}
            ${miniInfo("发起来源", activeTask.studentSource)}
            ${miniInfo("今日配额", activeTask.quota)}
            ${miniInfo("当前状态", humanStatus(activeTask.status))}
          </div>
          <div class="mt-4 grid gap-3 md:grid-cols-5">
            ${activeTask.steps.map((step) => stepCard(step)).join("")}
          </div>
        </div>
        <div class="grid gap-4 xl:grid-cols-[1fr_0.9fr]">
          <div class="panel panel-strong rounded-[2rem] p-6">
            <h4 class="font-display text-2xl">脚本与单分镜微调</h4>
            <div class="surface-block mt-4 p-5 text-sm leading-8 text-slate">
              ${activeTask.script}
            </div>
            <div class="mt-5 space-y-3">
              ${activeTask.storyboard
                .map(
                  (item, index) => `
                    <div class="surface-block px-4 py-4">
                      <div class="flex flex-wrap items-center justify-between gap-3">
                        <div class="text-sm font-semibold text-ink">镜头 ${index + 1}</div>
                        <div class="flex gap-2">
                          <button class="tag-chip">仅重配音</button>
                          <button class="tag-chip active">重生成该分镜</button>
                        </div>
                      </div>
                      <div class="mt-2 text-sm leading-7 text-slate">${item}</div>
                      <div class="mt-3 text-xs uppercase tracking-[0.18em] text-slate">
                        修改旁白不改画面描述 -> 仅重配音 ｜ 修改画面描述 -> 重生成画面 + 配音
                      </div>
                    </div>
                  `
                )
                .join("")}
            </div>
          </div>
          <div class="panel panel-strong rounded-[2rem] p-6">
            <h4 class="font-display text-2xl">结果预览与风控</h4>
            <div class="mini-chart mt-5 p-4">
              <div class="aspect-[4/3] rounded-[1.3rem] bg-gradient-to-br from-[#5f7078] via-[#7f9198] to-[#ccd6da]"></div>
            </div>
            <div class="surface-block mt-5 p-5">
              <div class="text-sm font-semibold text-ink">风控摘要</div>
              <div class="mt-2 text-sm leading-7 text-slate">${activeTask.riskSummary}</div>
            </div>
            <div class="mt-5 grid gap-3 md:grid-cols-2">
              ${miniInfo("成片规格", "MP4 / 720p")}
              ${miniInfo("预计总时长", state.workspaceForm.duration)}
              ${miniInfo("字幕样式", "自动适龄字号")}
              ${miniInfo("背景音乐", "可选微调")}
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
                  <span>OUTPUT SAFETY</span>
                  <strong>输出审核概览</strong>
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
              ${miniInfo("复审触发", "0.6~0.9 或历史人物")}
              ${miniInfo("人工复核", "需观看完整视频")}
              ${miniInfo("发布状态", "未发布")}
            </div>
          </div>
          <div class="grid gap-4 xl:grid-cols-[1fr_0.9fr]">
            <div class="panel panel-strong rounded-[2rem] p-6">
              <h4 class="font-display text-2xl">关键风险摘要</h4>
              <div class="mt-5 space-y-3">
                ${active.tags.map((tag) => `<span class="tag-chip active">${tag}</span>`).join("")}
              </div>
              <div class="surface-block mt-5 p-5 text-sm leading-8 text-slate">
                ${active.machine}
              </div>
              <div class="surface-block mt-5 p-5 text-sm leading-8 text-slate">
                ${active.notes}
              </div>
              <div class="mt-5 grid gap-3 md:grid-cols-3">
                ${miniInfo("自动拦截", "置信度 ≥ 0.9")}
                ${miniInfo("教师复审", "0.6 ~ 0.9")}
                ${miniInfo("自动通过", "置信度 < 0.6")}
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
        <div class="surface-block surface-block-quiet mt-6 p-5">
          <div class="text-sm font-semibold text-ink">审核模块切换</div>
          <div class="mt-4 flex flex-wrap gap-2">
            ${["text", "image", "video", "audio"]
              .map((tab) => filterChip("audit-tab", tab, state.ui.reviewAuditTab, auditTabLabel(tab)))
              .join("")}
          </div>
          <div class="surface-block mt-5 p-5">
            <div class="text-lg font-semibold text-ink">${module.title}</div>
            <div class="mt-2 text-sm leading-7 text-slate">${module.summary}</div>
            <div class="mt-4 space-y-3">
              ${module.points
                .map(
                  (point) => `
                    <div class="surface-block px-4 py-3 text-sm leading-7 text-slate">
                      ${point}
                    </div>
                  `
                )
                .join("")}
            </div>
          </div>
        </div>
        <div class="mt-6 grid gap-4 lg:grid-cols-[0.95fr_1.05fr]">
          <div class="surface-block surface-block-quiet p-5">
            <div class="text-sm font-semibold text-ink">关键帧联动查看</div>
            <div class="mt-4 space-y-3">
              ${active.keyframes
                .map(
                  (frame) => `
                    <div class="surface-block p-4">
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
          <div class="surface-block surface-block-quiet p-5">
            <div class="text-sm font-semibold text-ink">字幕片段与复核建议</div>
            <div class="mt-4 space-y-3">
              ${active.subtitleSegments
                .map(
                  (segment) => `
                    <div class="${segment.level === "warn" ? "rounded-[1.3rem] border border-line bg-[#ecdfd9]" : "surface-block"} p-4">
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
        <div class="surface-block surface-block-quiet mt-6 p-5">
          <div class="text-sm font-semibold text-ink">人工复核意见</div>
          <textarea id="review-note" class="surface-input mt-4 h-32 text-sm leading-7">${active.notes}</textarea>
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
            <span>SCHOOL ASSETS</span>
            <strong>学校素材筛选</strong>
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
              <strong>学校定制详情</strong>
            </div>
            <h3 class="font-display mt-4 text-3xl">${active.title}</h3>
          </div>
          <button data-action="reuse-asset" class="rounded-full bg-ocean px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#243642]">应用到当前任务</button>
        </div>
        <div class="mt-5 grid gap-3 md:grid-cols-3">
          ${miniInfo("类型", active.type)}
          ${miniInfo("来源", active.source)}
          ${miniInfo("授权范围", active.access)}
        </div>
        <div class="mini-chart mt-5 p-4">
          <div class="aspect-[16/9] rounded-[1.3rem] bg-gradient-to-br from-[#61747c] to-[#ced8dc]"></div>
        </div>
        <div class="surface-block mt-5 p-5 text-sm leading-7 text-slate">${active.description}</div>
        <div class="mt-5 grid gap-3 md:grid-cols-2">
          ${miniInfo("复用次数", active.usage)}
          ${miniInfo("隔离策略", "按学校 ID 独立调用")}
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
              <span>VIDEO LIBRARY</span>
              <strong>视频库与审计详情</strong>
            </div>
            <h3 class="font-display mt-4 text-3xl">${active.title}</h3>
          </div>
          <div class="flex gap-3">
            <button data-action="publish-item" class="rounded-full bg-ocean px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#243642]">入库 / 公开给授权对象</button>
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
          <div class="surface-block p-5">
            <div class="text-sm font-semibold text-ink">审计留痕</div>
            <div class="mt-4 space-y-3 text-sm leading-7 text-slate">
              <div>09:05 审核通过，保留机审报告与人工复核意见。</div>
              <div>09:12 生成导出包并写入视频库记录。</div>
              <div>09:20 若是学生作品，仅在教师确认后对学生本人可见。</div>
            </div>
          </div>
          <div class="surface-block p-5">
            <div class="text-sm font-semibold text-ink">发布说明</div>
            <textarea class="surface-input mt-4 h-40 text-sm leading-7">适用于校内教学使用，默认保留 30 天。禁止一键分享到公共社交平台，如需外发需教师下载后自行处理。</textarea>
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
          <strong>权限与上限</strong>
        </div>
        <div class="surface-block mt-5 p-5">
          <div class="text-sm font-semibold text-ink">${member.name} · ${member.role}</div>
          <div class="mt-3 text-sm leading-7 text-slate">${member.scope}</div>
        </div>
        <div class="mt-5 space-y-3">
          ${permissionItem("发起视频任务", member.role !== "平台运营")}
          ${permissionItem("脚本强制审核", member.role === "教师" || member.role === "学校管理员" || member.role === "平台运营")}
          ${permissionItem("审批学生作品", member.role === "教师" || member.role === "学校管理员")}
          ${permissionItem("配置学校素材", member.role === "学校管理员")}
          ${permissionItem("维护审核阈值", member.role === "平台运营")}
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
          <strong>配额、队列与成本</strong>
        </div>
        <div class="mt-4 flex flex-wrap gap-2">
          ${["配额与队列", "模型成本", "审核表现"]
            .map((tab) => filterChip("ops-tab", tab, state.ui.opsTab))
            .join("")}
        </div>
      </div>
      <div class="grid gap-4 xl:grid-cols-4">
        ${statCard("教师每日上限", "10 个", "学生为 2 个 / 日")}
        ${statCard("常态并发", "50 人", "同校可同时生成")}
        ${statCard("高峰并发", "200 人", "公开课周进入排队")}
        ${statCard("生成 SLA", "≤5 分钟", "不含人工审核时间")}
      </div>
      <div class="grid gap-4 xl:grid-cols-[1.15fr_0.85fr]">
        <div class="panel panel-strong rounded-[2rem] p-6">
          <div class="flex items-center justify-between">
            <h3 class="font-display text-2xl">${state.ui.opsTab}</h3>
            <span class="text-sm text-slate">本页强调 MVP 的可运营性，而非复杂 BI</span>
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
            ${progressRow("排队后成功完成", "94%")}
            ${progressRow("学校素材接入率", "61%")}
          </div>
          <div class="surface-block mt-6 p-5 text-sm leading-7 text-slate">
            MVP 还需要明确展示数据保留与清理策略：视频库默认保留 30 天，长时间未使用内容可按 180 天策略自动清理，教师可手动导出保存。
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
      <div class="surface-block mt-5 p-4">
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
      <div class="mt-2 text-sm text-slate">${task.studentSource}</div>
      <div class="mt-4">
        <div class="mb-2 flex justify-between text-xs text-slate">
          <span>${task.queue}</span>
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
      <div class="mt-3 text-xs uppercase tracking-[0.18em] text-slate">${asset.access}</div>
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
    <button data-org-node="${item.id}" class="w-full ${item.id === state.ui.orgNode ? "rounded-[1.5rem] border border-ocean bg-white" : "surface-block surface-block-quiet"} px-4 py-4 text-left transition hover:bg-white">
      <div class="text-xs uppercase tracking-[0.2em] text-slate">0${index + 1}</div>
      <div class="mt-2 text-lg font-semibold text-ink">${item.name}</div>
      <div class="mt-2 text-sm leading-7 text-slate">${item.description}</div>
    </button>
  `;
}

function memberCard(item) {
  return `
    <button data-member-select="${item.id}" class="w-full ${item.id === state.ui.activeMemberId ? "rounded-[1.5rem] border border-ocean bg-white" : "surface-block surface-block-quiet"} px-4 py-4 text-left transition hover:bg-white">
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
    <div class="surface-block relative p-4">
      <span class="absolute left-[-1.32rem] top-5 h-3 w-3 rounded-full bg-[#7a8d96]"></span>
      <div class="text-xs uppercase tracking-[0.2em] text-slate">${item.time}</div>
      <div class="mt-2 text-sm font-semibold text-ink">${item.title}</div>
      <div class="mt-2 text-sm leading-7 text-slate">${item.desc}</div>
    </div>
  `;
}

function field(label, key, value, options) {
  const input = options
    ? `<select data-field="${key}" class="surface-input text-sm">
        ${options.map((option) => `<option ${option === value ? "selected" : ""}>${option}</option>`).join("")}
      </select>`
    : `<input data-field="${key}" value="${value}" class="surface-input text-sm" />`;
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
      <input ${isPassword ? 'type="password"' : ""} value="${value}" class="surface-input" />
    </label>
  `;
}

function proposalLine(label, value) {
  return `
    <div class="surface-block p-4">
      <div class="text-xs uppercase tracking-[0.24em] text-slate">${label}</div>
      <div class="mt-2 text-sm leading-7 text-ink">${value}</div>
    </div>
  `;
}

function metricCard(label, value) {
  return `
    <div class="surface-block p-4">
      <div class="text-xs uppercase tracking-[0.2em] text-slate">${label}</div>
      <div class="mt-2 text-sm font-semibold text-ink">${value}</div>
    </div>
  `;
}

function todoCard(text, scope, href) {
  return `
    <a href="${href}" class="surface-block surface-block-quiet block px-4 py-4 text-left transition hover:bg-white/70">
      <div class="text-sm font-semibold text-ink">${text}</div>
      <div class="mt-2 text-xs uppercase tracking-[0.2em] text-slate">${scope}</div>
    </a>
  `;
}

function processStep(title, desc) {
  return `
    <div class="surface-block p-4">
      <div class="text-sm font-semibold text-ink">${title}</div>
      <div class="mt-2 text-xs leading-6 text-slate">${desc}</div>
    </div>
  `;
}

function smallStep(no, title, desc) {
  return `
    <div class="surface-block surface-block-quiet px-4 py-4">
      <div class="text-xs uppercase tracking-[0.24em] text-slate">${no}</div>
      <div class="mt-2 text-sm font-semibold text-ink">${title}</div>
      <div class="mt-2 text-sm leading-7 text-slate">${desc}</div>
    </div>
  `;
}

function statCard(label, value, hint) {
  return `
    <div class="surface-block p-4">
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
    <div class="surface-block surface-block-quiet p-4">
      <div class="flex items-center gap-3">
        <span class="step-dot ${step.status}"></span>
        <span class="text-sm font-semibold text-ink">${step.name}</span>
      </div>
    </div>
  `;
}

function stepRow(title, desc, status) {
  return `
    <div class="surface-block surface-block-quiet flex items-start gap-4 p-4">
      <span class="step-dot ${status} mt-1 shrink-0"></span>
      <div>
        <div class="text-base font-semibold text-ink">${title}</div>
        <div class="mt-2 text-sm leading-7 text-slate">${desc}</div>
      </div>
    </div>
  `;
}

function chatPreviewMetric(label, value) {
  return `
    <div class="rounded-[1.2rem] border border-white/10 bg-white/6 px-4 py-3">
      <div class="text-[11px] uppercase tracking-[0.22em] text-white/48">${label}</div>
      <div class="mt-2 text-sm font-semibold text-white">${value}</div>
    </div>
  `;
}

function chatPreviewStrip(label, value, toneClass) {
  return `
    <div class="rounded-[1.3rem] border border-white/10 p-3 ${toneClass}">
      <div class="text-[11px] uppercase tracking-[0.22em] text-white/58">${label}</div>
      <div class="mt-7 text-sm font-semibold text-white">${value}</div>
    </div>
  `;
}

function chatPreviewFrame(frame, index) {
  return `
    <div class="surface-block surface-block-quiet flex items-start gap-4 p-4">
      <div class="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-[#dbe4e7] text-sm font-semibold text-[#314550]">
        0${index + 1}
      </div>
      <div class="min-w-0 flex-1">
        <div class="flex flex-wrap items-center justify-between gap-2">
          <div class="text-base font-semibold text-ink">${frame.title}</div>
          <span class="text-xs uppercase tracking-[0.18em] text-slate">${frame.time}</span>
        </div>
        <div class="mt-2 text-sm leading-7 text-slate">${frame.desc}</div>
      </div>
    </div>
  `;
}

function miniInfo(label, value) {
  return `
    <div class="surface-block p-4">
      <div class="text-xs uppercase tracking-[0.22em] text-slate">${label}</div>
      <div class="mt-2 text-base font-semibold text-ink">${value}</div>
    </div>
  `;
}

function chartBlock(label, value) {
  return `
    <div class="surface-block surface-block-quiet p-4">
      <div class="text-xs uppercase tracking-[0.18em] text-slate">${label}</div>
      <div class="mini-chart mt-4 h-32 p-3">
        <div class="h-full rounded-[1rem] bg-gradient-to-t from-[#5d727b] to-[#d5dee2]" style="clip-path: polygon(0 100%, 0 70%, 18% 62%, 36% 78%, 55% 45%, 72% 52%, 100% 22%, 100% 100%);"></div>
      </div>
      <div class="mt-3 text-lg font-semibold text-ink">${value}</div>
    </div>
  `;
}

function permissionItem(label, enabled) {
  return `
    <div class="surface-block surface-block-quiet flex items-center justify-between px-4 py-3">
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
          `系统已根据“${state.workspaceForm.topic}”自动生成脚本草案，面向 ${state.workspaceForm.gradeBand}，默认画风为 ${state.workspaceForm.tone}。当前必须由教师确认每个分镜的旁白、画面描述和时长后，才能进入素材生成。`
      },
      {
        id: `msg-${Date.now()}-2`,
        role: "assistant",
        kind: "analysis",
        text:
          "已自动带入学校定制参数、知识点标签和年级适配规则。若你修改了旁白但没改画面描述，后面只会重配音；若改动画面描述，则会重生成画面与配音。"
      }
    ],
    summary: {
      audience: state.workspaceForm.gradeBand,
      angle: "校园诚信故事",
      ending: "课堂行动倡议",
      style: state.workspaceForm.tone,
      mustInclude: ["班级借书小故事", "学生熟悉的校园场景", "结尾行动倡议"]
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
    text: "我已根据你的补充修改脚本审核建议。新的结论会同步到右侧脚本预览，并影响后续素材生成和适龄表达。"
  };
  if (lowerPrompt.includes("低年级")) {
    state.conversation.summary.style = "更简单词汇";
    next.text = "已切到更低年级的表达方式，后续旁白会减少抽象词汇，并把句子压短。";
  } else if (lowerPrompt.includes("校园")) {
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
  } else if (lowerPrompt.includes("90 秒")) {
    next.text = "我会压缩镜头数量和字幕密度，把总时长稳定在 90 秒左右，适合课堂导入。";
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
      setPendingToast("已进入视频工作流原型。");
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
    task.queue = "待发起 / 未进入排队";
    task.script = `${state.workspaceForm.goal} 系统已按“${currentTemplate().title}”生成新的脚本草稿，并预装知识点标签：${state.workspaceForm.knowledgeTags}。`;
    state.ui.activeTaskId = task.id;
    saveState();
    showToast("发起单已保存。");
  });

  bindAction("enter-chat", () => {
    state.conversation = buildConversationFromForm();
    saveState();
    setPendingToast("已进入强制脚本审核台。");
    window.location.href = pageUrl("chat");
  });

  bindAction("chat-reset", () => {
    state.conversation = buildConversationFromForm();
    saveState();
    showToast("脚本草案已恢复为系统建议版本。");
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
    task.updatedAt = "刚刚确认脚本";
    task.progress = 84;
    task.status = "draft";
    task.queue = "排队第 1 位 / 预计 1 分钟";
    task.modelChain = "脚本确认后进入文生图/视频与配音合成链路";
    task.steps[2].status = "done";
    task.steps[3].status = "active";
    task.steps[4].status = "todo";
    task.script = `${state.workspaceForm.goal} 教师已确认“${state.conversation.summary.angle}”作为主表达角度，并结合 ${state.workspaceForm.gradeBand}、${state.workspaceForm.edition} 与 “${currentTemplate().title}” 生成适龄化脚本。`;
    task.storyboard = [
      `镜头1：${state.conversation.summary.mustInclude[0]}，用借书或守约情境引入主题。`,
      `镜头2：${state.conversation.summary.mustInclude[1]}，解释诚信与校园日常行为的关联。`,
      `镜头3：${state.conversation.summary.mustInclude[2]}，以${state.conversation.summary.ending}收束。`
    ];
    state.ui.activeTaskId = task.id;
    saveState();
    setPendingToast("脚本确认完成，已进入素材生成与微调页。");
    window.location.href = pageUrl("tasks");
  });

  bindAction("preview-template", (button) => {
    const template = templateById(button.dataset.templateId);
    showToast(`已预览模板：${template.title}`);
  });

  bindAction("use-template", (button) => {
    state.workspaceForm.templateId = button.dataset.templateId;
    saveState();
    setPendingToast("预设已套用到视频创作发起台。");
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
    task.queue = "已完成生成 / 等待审核";
    if (!state.reviews.find((item) => item.taskId === task.id)) {
      state.reviews.unshift({
        id: `rv-${Date.now()}`,
        taskId: task.id,
        title: task.title,
        school: "实验学校思政组",
        applicant: "李老师",
        severity: "低",
        tags: ["新提交任务", "普通校园题材"],
        machine: "脚本、字幕与配音已过机审，等待视频关键帧人工抽检。",
        notes: "建议复核结尾字幕是否更适合课堂语言，再决定是否入库。",
        auditModules: {
          text: { title: "文本审校", summary: "文本初审通过。", points: ["语言适龄。", "无敏感词命中。"] },
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
      task.queue = "审核通过 / 可入库";
    }
    let publish = state.publishItems.find((item) => item.taskId === review.taskId);
    if (!publish) {
      publish = {
        id: `pub-${Date.now()}`,
        taskId: review.taskId,
        title: review.title,
        status: "review",
        version: "v1.0",
        channel: "待进入视频库",
        operator: "当前审核教师",
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
      task.queue = "退回微调 / 等待重新生成";
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
    showToast(`已将“${currentAsset().title}”应用到当前任务。`);
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
    item.channel = item.title.includes("学生作业") ? "教师视频库 / 学生可见" : "教师视频库";
    item.updatedAt = "刚刚发布";
    saveState();
    showToast("内容已入库，并生成审计记录。");
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
