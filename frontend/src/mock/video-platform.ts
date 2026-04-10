export type CreatorRole = '教师' | '学生';

export type TaskStatus = 'draft' | 'generating' | 'review' | 'approved' | 'blocked';

export type StepStatus = 'done' | 'active' | 'todo';

export type ReviewSeverity = '低' | '中' | '高';

export interface PlatformMetric {
  label: string;
  value: string;
  desc: string;
}

export interface WorkflowStage {
  title: string;
  owner: string;
  desc: string;
}

export interface TemplatePreset {
  id: string;
  category: string;
  title: string;
  tone: string;
  description: string;
  scenes: number;
}

export interface SchoolPreset {
  id: string;
  name: string;
  watermarkMode: string;
  desc: string;
}

export interface SchoolThemeProfile {
  id: string;
  schoolName: string;
  shortName: string;
  schoolType: '小学' | '中学';
  officialSite: string;
  systemName: string;
  slogan: string;
  watermarkText: string;
  logoText: string;
  theme: {
    primary: string;
    secondary: string;
    accent: string;
    surface: string;
  };
}

export interface GradePreset {
  id: string;
  label: string;
  speechRate: string;
  style: string;
  languageLevel: string;
  summary: string;
}

export interface StoryboardScene {
  id: string;
  title: string;
  duration: string;
  visual: string;
  narration: string;
  teacherTip: string;
}

export interface VideoTask {
  id: string;
  schoolId: string;
  title: string;
  templateId: string;
  creatorRole: CreatorRole;
  owner: string;
  gradeBand: string;
  status: TaskStatus;
  progress: number;
  updatedAt: string;
  queue: string;
  quota: string;
  output: string;
  riskSummary: string;
  summary: string;
  steps: Array<{
    name: string;
    status: StepStatus;
  }>;
}

export interface ReviewCase {
  id: string;
  schoolId: string;
  taskId: string;
  title: string;
  severity: ReviewSeverity;
  school: string;
  applicant: string;
  machine: string;
  notes: string;
  tags: string[];
  keyframes: Array<{
    time: string;
    label: string;
    note: string;
  }>;
  subtitleSegments: Array<{
    time: string;
    text: string;
    level: 'safe' | 'warn' | 'block';
  }>;
  modules: Array<{
    key: 'text' | 'image' | 'video' | 'audio';
    title: string;
    summary: string;
    points: string[];
  }>;
  history: Array<{
    time: string;
    title: string;
    desc: string;
  }>;
}

export interface SchoolAsset {
  id: string;
  schoolId: string;
  type: string;
  title: string;
  source: string;
  usage: string;
  description: string;
  access: string;
}

export interface PublishItem {
  id: string;
  schoolId: string;
  taskId: string;
  title: string;
  status: 'published' | 'review' | 'draft';
  version: string;
  visibility: string;
  operator: string;
  updatedAt: string;
}

export interface RoleProfile {
  id: string;
  role: string;
  dailyLimit: string;
  desc: string;
  capabilities: string[];
}

export interface ReviewRule {
  id: string;
  name: string;
  stage: '输入' | '脚本' | '图片' | '音频' | '视频' | '发布';
  riskLevel: '低' | '中' | '高';
  weight: number;
  scope: '全局' | '学校';
  enabled: boolean;
  description: string;
  hitHint: string;
  owner: string;
  updatedAt: string;
}

export interface InputAuditCheckpoint {
  id: string;
  title: string;
  type: 'safe' | 'warn' | 'block';
  summary: string;
  detail: string;
}

export interface QueueInsight {
  label: string;
  value: string;
  desc: string;
  tone: 'default' | 'info' | 'success' | 'warning' | 'error';
}

export interface TaskSceneRuntime {
  id: string;
  title: string;
  duration: string;
  status: 'ready' | 'rendering' | 'voice' | 'review' | 'completed';
  visual: string;
  narration: string;
  updatedAt: string;
  operator: string;
  actionHint: string;
}

export interface TaskActivityLog {
  time: string;
  title: string;
  desc: string;
  actor: string;
}

export interface ReviewDecisionGuide {
  id: string;
  label: string;
  when: string;
  action: string;
  desc: string;
}

export interface RuleSimulationCase {
  id: string;
  title: string;
  summary: string;
  hitRuleIds: string[];
  recommendation: string;
  riskScore: number;
}

export interface KnowledgeTagGroup {
  id: string;
  name: string;
  scope: '平台' | '学校';
  owner: string;
  description: string;
  tags: string[];
}

export interface WatermarkPreset {
  id: string;
  schoolId: string;
  name: string;
  mode: string;
  position: string;
  opacity: string;
  sceneUsage: string;
  desc: string;
}

export interface TechArchitectureLayer {
  id: string;
  title: string;
  summary: string;
  items: string[];
}

export interface DeliveryPhase {
  id: string;
  phase: string;
  goal: string;
  scope: string;
  milestone: string;
  riskControl: string;
}

export interface DemoAccountCard {
  key: string;
  label: string;
  loginName: string;
  school: string;
  focusRoute: string;
  highlights: string[];
}

export interface LibraryAuditSnapshot {
  posterTitle: string;
  classroomUse: string;
  retention: string;
  restrictions: string[];
  auditTrail: Array<{
    time: string;
    title: string;
    desc: string;
  }>;
}

export const platformMetrics: PlatformMetric[] = [
  {
    label: '今日待处理任务',
    value: '18',
    desc: '覆盖教师发起、学生代审、脚本退回和输出复审。'
  },
  {
    label: '教师剩余配额',
    value: '6 / 10',
    desc: '角色配额可按学校和学段策略独立配置。'
  },
  {
    label: '当前排队峰值',
    value: '200 并发',
    desc: '公开课高峰启用排队并展示预计等待时间。'
  },
  {
    label: '学校定制资产',
    value: '15 项',
    desc: '包含校徽、校训、校园背景与本校知识点标签。'
  }
];

export const workflowStages: WorkflowStage[] = [
  {
    title: '自然语言发起',
    owner: '教师 / 学生',
    desc: '输入主题、年级、时长、标签与学校策略，首先经过输入安全审核。'
  },
  {
    title: '教师强制审稿',
    owner: '教师',
    desc: '系统生成结构化脚本，教师必须逐镜确认旁白和画面描述。'
  },
  {
    title: '批量生成素材',
    owner: '系统',
    desc: '按确认后的分镜批量生成画面、配音、字幕和背景音乐，并纳入队列。'
  },
  {
    title: '单镜头微调',
    owner: '教师',
    desc: '只改旁白则重配音；改画面描述则重绘画面并同步重配音。'
  },
  {
    title: '输出安全复审',
    owner: '系统 + 教师',
    desc: '0.9 自动拦截，0.6~0.9 强制人工复审，历史人物全量进入教师复核。'
  },
  {
    title: '视频入库与审计',
    owner: '教师 / 学校',
    desc: '通过的视频进入视频库，学生作品经教师确认后才对学生可见。'
  }
];

export const templatePresets: TemplatePreset[] = [
  {
    id: 'tpl-moral',
    category: '课堂导入',
    title: '诚信主题故事模板',
    tone: '卡通叙事',
    description: '适合 3 分钟内课堂导入，默认包含故事、总结和行动倡议三段式结构。',
    scenes: 6
  },
  {
    id: 'tpl-hero',
    category: '历史人物',
    title: '历史人物精神主题',
    tone: '庄重叙事',
    description: '适合雷锋、周恩来、钱学森等主题，自动触发历史人物复审提醒。',
    scenes: 8
  },
  {
    id: 'tpl-campus',
    category: '学校定制',
    title: '校园场景融入模板',
    tone: '温和启发',
    description: '默认接入校徽、校训和校园背景，适合“发生在我们的校园里”的故事型视频。',
    scenes: 7
  },
  {
    id: 'tpl-student',
    category: '学生作业',
    title: '学生课后创作模板',
    tone: '轻叙事',
    description: '默认走学生发起、教师代审、教师确认后学生可见的审核链路。',
    scenes: 5
  }
];

export const schoolPresets: SchoolPreset[] = [
  {
    id: 'school-fixed',
    name: '固定叠加校徽 + 校训',
    watermarkMode: '固定叠加',
    desc: '片头片尾展示校徽和校训，支持透明度、位置和样式配置。'
  },
  {
    id: 'school-smart',
    name: '校园背景智能融入',
    watermarkMode: '智能融入',
    desc: '管理员指定校园场景图片后，可作为故事背景智能替换。'
  }
];

export const schoolThemeProfiles: SchoolThemeProfile[] = [
  {
    id: 'cdsszx',
    schoolName: '成都石室中学',
    shortName: '石室中学',
    schoolType: '中学',
    officialSite: 'https://www.cdshishi.net',
    systemName: '成都石室中学 AI 思政视频工作台',
    slogan: '文翁石室 德润课堂',
    watermarkText: '文翁石室 德润课堂',
    logoText: '石室',
    theme: {
      primary: '#6b5341',
      secondary: '#323844',
      accent: '#c52e2e',
      surface: '#f8f6f0'
    }
  },
  {
    id: 'cdwgy',
    schoolName: '成都外国语学校',
    shortName: '成都外国语',
    schoolType: '中学',
    officialSite: 'https://www.cfls.net.cn',
    systemName: '成都外国语学校 AI 思政视频平台',
    slogan: '培育盛世英才的摇篮，通向五洲四海的桥梁',
    watermarkText: '成都外国语学校 思政课堂专用',
    logoText: '成外',
    theme: {
      primary: '#9c1e21',
      secondary: '#231e1d',
      accent: '#ec222e',
      surface: '#fbf5f5'
    }
  },
  {
    id: 'cdsywgy',
    schoolName: '成都市实验外国语学校',
    shortName: '成实外',
    schoolType: '中学',
    officialSite: 'https://www.cefls.cn',
    systemName: '成实外 AI 视频创作平台',
    slogan: '厚德博学 进取卓越',
    watermarkText: '成都市实验外国语学校 校内教学专用',
    logoText: '实外',
    theme: {
      primary: '#c8102e',
      secondary: '#515151',
      accent: '#f3d9df',
      surface: '#fff7f9'
    }
  },
  {
    id: 'pxtx',
    schoolName: '成都市泡桐树小学（天府校区）',
    shortName: '泡小天府',
    schoolType: '小学',
    officialSite: 'http://www.pxtf.org',
    systemName: '泡桐树小学 AI 思政微课平台',
    slogan: '校园成长课堂',
    watermarkText: '泡桐树小学 校园成长课堂',
    logoText: '泡小',
    theme: {
      primary: '#2e8b57',
      secondary: '#245c43',
      accent: '#8fbf5a',
      surface: '#f4fbf6'
    }
  }
];

export const gradePresets: GradePreset[] = [
  {
    id: 'g1-2',
    label: '小学 1-2 年级',
    speechRate: '180 字/分钟',
    style: '卡通 / 皮影戏',
    languageLevel: '简单词汇、短句、动作导向',
    summary: '适合课堂导入和一问一答式内容表达。'
  },
  {
    id: 'g3-4',
    label: '小学 3-4 年级',
    speechRate: '190 字/分钟',
    style: '卡通插画',
    languageLevel: '生活案例 + 简洁概念',
    summary: '强化故事转折和课堂可讨论问题。'
  },
  {
    id: 'g5-6',
    label: '小学 5-6 年级',
    speechRate: '220 字/分钟',
    style: '卡通插画 / 校园写意',
    languageLevel: '可引入抽象概念和价值升华',
    summary: '适合诚信、责任、规则意识等主题。'
  },
  {
    id: 'g7-9',
    label: '初中 7-9 年级',
    speechRate: '220 字/分钟',
    style: '写实插画',
    languageLevel: '支持更高抽象度和社会议题表达',
    summary: '可承载历史人物、科技报国等主题。'
  }
];

export const knowledgeTags = ['诚信', '校园文明', '责任意识', '规则意识', '红色资源', '嘉兴红船', '井冈山精神'];

export const knowledgeTagGroups: KnowledgeTagGroup[] = [
  {
    id: 'tag-platform-outline',
    name: '平台通用大纲标签',
    scope: '平台',
    owner: '平台运营',
    description: '来自国家中小学智慧教育平台与课程大纲整理，用于平台通用提示词注入。',
    tags: ['诚信', '责任意识', '规则意识', '法治观念', '集体荣誉']
  },
  {
    id: 'tag-red-resource',
    name: '红色资源专题',
    scope: '平台',
    owner: '平台运营',
    description: '用于历史人物、红色资源和革命精神类主题。',
    tags: ['红色资源', '嘉兴红船', '井冈山精神', '雷锋精神', '科技报国']
  },
  {
    id: 'tag-school-local',
    name: '本校自定义标签',
    scope: '学校',
    owner: '学校管理员 / 教师',
    description: '学校侧可增补校本德育项目、校史馆内容和本地化资源。',
    tags: ['校园文明', '图书角公约', '班级值日', '校园成长故事']
  }
];

export const scriptReviewScenes: StoryboardScene[] = [
  {
    id: 'scene-1',
    title: '借书角发现问题',
    duration: '20 秒',
    visual: '教室借书角，学生发现借书卡上的名字与实际归还人不一致，画面使用校园卡通背景和暖色灯光。',
    narration:
      '午后的教室里，借书角安静地摆着故事书。小文发现，借书卡上的名字和归还的人不一样，大家开始思考，诚信到底是什么？',
    teacherTip: '建议保留“校园借书角”作为生活场景起点，方便课堂进入。'
  },
  {
    id: 'scene-2',
    title: '主动承认错误',
    duration: '35 秒',
    visual: '主人公主动承认自己忘记按时归还图书，同学围成半圆，老师站在一旁鼓励表达。',
    narration: '原来，是小宇借走图书后忘记登记归还。他鼓起勇气站出来说：“这是我的疏忽，我愿意马上改正。”',
    teacherTip: '如果只改旁白，不需重绘画面，可仅重合成配音。'
  },
  {
    id: 'scene-3',
    title: '老师总结升华',
    duration: '25 秒',
    visual: '老师站在黑板前总结“诚信不是口号，而是守约和尊重”，背景切入校园徽标与班级公约。',
    narration: '老师微笑着说，诚信不仅是说真话，更是守约、负责和尊重他人。今天放学前，你准备做一件什么样的诚信小事呢？',
    teacherTip: '可在这里接入课堂提问，便于老师在播放后衔接互动。'
  }
];

export const videoTasks: VideoTask[] = [
  {
    id: 'task-101',
    schoolId: 'cdsszx',
    title: '诚信主题 3 分钟课堂视频',
    templateId: 'tpl-moral',
    creatorRole: '教师',
    owner: '李老师',
    gradeBand: '小学 5-6 年级',
    status: 'generating',
    progress: 68,
    updatedAt: '今天 14:35',
    queue: '排队第 3 位，预计 2 分钟',
    quota: '教师今日已用 4 / 10 次',
    output: '720p / MP4 / 2 分 46 秒',
    riskSummary: '普通校园题材，待成片后进入机审。',
    summary: '围绕“借书忘还 -> 主动归还 -> 同学理解诚信价值 -> 教师总结升华”展开。',
    steps: [
      { name: '输入审核', status: 'done' },
      { name: '脚本确认', status: 'done' },
      { name: '素材生成', status: 'active' },
      { name: '微调处理', status: 'todo' },
      { name: '输出审核', status: 'todo' }
    ]
  },
  {
    id: 'task-102',
    schoolId: 'cdsywgy',
    title: '钱学森与科技报国',
    templateId: 'tpl-hero',
    creatorRole: '教师',
    owner: '王教研员',
    gradeBand: '初中 7-9 年级',
    status: 'review',
    progress: 100,
    updatedAt: '今天 11:20',
    queue: '已完成，等待教师复审',
    quota: '教师今日已用 7 / 10 次',
    output: '720p / MP4 / 2 分 58 秒',
    riskSummary: '命中真实历史人物规则，强制进入教师复审。',
    summary: '人物精神与国家发展关系主题，需完整看片后才能通过。',
    steps: [
      { name: '输入审核', status: 'done' },
      { name: '脚本确认', status: 'done' },
      { name: '素材生成', status: 'done' },
      { name: '微调处理', status: 'done' },
      { name: '输出审核', status: 'active' }
    ]
  },
  {
    id: 'task-103',
    schoolId: 'pxtx',
    title: '学生作业：校园文明一分钟短片',
    templateId: 'tpl-student',
    creatorRole: '学生',
    owner: '陈老师',
    gradeBand: '小学 3-4 年级',
    status: 'approved',
    progress: 100,
    updatedAt: '昨天 17:40',
    queue: '已完成并同步学生可见',
    quota: '学生今日已用 1 / 2 次',
    output: '720p / MP4 / 58 秒',
    riskSummary: '教师代审通过，已进入视频库。',
    summary: '学生提交后由班主任完成脚本审核、合成与终审，当前已对学生可见。',
    steps: [
      { name: '输入审核', status: 'done' },
      { name: '脚本确认', status: 'done' },
      { name: '素材生成', status: 'done' },
      { name: '微调处理', status: 'done' },
      { name: '输出审核', status: 'done' }
    ]
  },
  {
    id: 'task-104',
    schoolId: 'pxtx',
    title: '学生违规指令待重提',
    templateId: 'tpl-student',
    creatorRole: '学生',
    owner: '五年级二班',
    gradeBand: '小学 5-6 年级',
    status: 'blocked',
    progress: 12,
    updatedAt: '今天 09:10',
    queue: '输入审核已拦截',
    quota: '该学生近 24 小时触发 2 次违规',
    output: '未生成',
    riskSummary: '命中输入审核敏感规则，需要修改指令后重试。',
    summary: '系统已记录违规内容、用户和时间，教师端可查看。',
    steps: [
      { name: '输入审核', status: 'active' },
      { name: '脚本确认', status: 'todo' },
      { name: '素材生成', status: 'todo' },
      { name: '微调处理', status: 'todo' },
      { name: '输出审核', status: 'todo' }
    ]
  },
  {
    id: 'task-105',
    schoolId: 'cdwgy',
    title: '校园礼仪双语导入视频',
    templateId: 'tpl-campus',
    creatorRole: '教师',
    owner: '国际课程组',
    gradeBand: '初中 7-9 年级',
    status: 'draft',
    progress: 34,
    updatedAt: '今天 10:05',
    queue: '脚本等待教师确认',
    quota: '教师今日已用 2 / 10 次',
    output: '720p / MP4 / 2 分 12 秒',
    riskSummary: '学校品牌素材已注入，等待教师确认是否启用校园背景。',
    summary: '用于班会导入，演示学校定制素材和校园背景智能融入能力。',
    steps: [
      { name: '输入审核', status: 'done' },
      { name: '脚本确认', status: 'active' },
      { name: '素材生成', status: 'todo' },
      { name: '微调处理', status: 'todo' },
      { name: '输出审核', status: 'todo' }
    ]
  }
];

export const taskQueueInsights: QueueInsight[] = [
  {
    label: '排队中任务',
    value: '7',
    desc: '包含生成中和等待复审两类耗时节点。',
    tone: 'info'
  },
  {
    label: '平均等待时间',
    value: '02:40',
    desc: '公开课周自动开启排队位置和预计等待时长提示。',
    tone: 'warning'
  },
  {
    label: '今日重生成次数',
    value: '9 次',
    desc: '其中 6 次仅重配音，3 次重绘画面并重配音。',
    tone: 'success'
  },
  {
    label: '输入拦截',
    value: '2 条',
    desc: '全部进入教师可见的违规日志链路。',
    tone: 'error'
  }
];

export const taskSceneRuntimes: Record<string, TaskSceneRuntime[]> = {
  'task-101': [
    {
      id: 'ts-101-1',
      title: '镜头 1 · 借书角发现问题',
      duration: '20 秒',
      status: 'completed',
      visual: '教室借书角暖色卡通场景，突出借书卡与归还动作。',
      narration: '小文在借书角发现登记信息和实际情况不一致，诚信问题被自然抛出。',
      updatedAt: '今天 14:08',
      operator: '系统首轮生成',
      actionHint: '已完成，无需调整。'
    },
    {
      id: 'ts-101-2',
      title: '镜头 2 · 主动承认错误',
      duration: '35 秒',
      status: 'voice',
      visual: '学生围绕主人公形成半圆构图，老师在背景中鼓励表达。',
      narration: '主人公主动承认忘记登记归还图书，班级氛围从怀疑转向理解。',
      updatedAt: '今天 14:20',
      operator: '李老师修改旁白后触发',
      actionHint: '如果继续改旁白，建议只重配音。'
    },
    {
      id: 'ts-101-3',
      title: '镜头 3 · 老师总结升华',
      duration: '25 秒',
      status: 'rendering',
      visual: '黑板前总结诚信概念，背景带校徽和班级公约。',
      narration: '老师引导学生把诚信落到“今天的一件小事”上。',
      updatedAt: '今天 14:31',
      operator: '系统生成中',
      actionHint: '如需替换班级公约文案，可改画面描述后重绘。'
    }
  ],
  'task-102': [
    {
      id: 'ts-102-1',
      title: '镜头 1 · 人物出场',
      duration: '22 秒',
      status: 'completed',
      visual: '写实插画风格呈现钱学森人物形象与科研背景。',
      narration: '钱学森回国后投身祖国航天事业，为科技强国奠定重要基础。',
      updatedAt: '今天 10:40',
      operator: '系统首轮生成',
      actionHint: '无需改动。'
    },
    {
      id: 'ts-102-2',
      title: '镜头 2 · 科技报国升华',
      duration: '26 秒',
      status: 'review',
      visual: '历史画面与现代校园实验室交叉剪影。',
      narration: '科技报国不仅是历史故事，更是当代青少年的精神坐标。',
      updatedAt: '今天 11:18',
      operator: '等待教师复审',
      actionHint: '建议修订“世界顶尖”表述后再通过。'
    }
  ],
  'task-103': [
    {
      id: 'ts-103-1',
      title: '镜头 1 · 校园问候',
      duration: '18 秒',
      status: 'completed',
      visual: '校门口早晨问好场景，低年级卡通风。',
      narration: '同学们互相问好，班级的一天从礼貌开始。',
      updatedAt: '昨天 16:44',
      operator: '教师代审通过',
      actionHint: '已发布。'
    }
  ],
  'task-104': [
    {
      id: 'ts-104-1',
      title: '输入阶段拦截',
      duration: '-',
      status: 'review',
      visual: '未生成画面。',
      narration: '未通过输入审核，不进入脚本生成阶段。',
      updatedAt: '今天 09:10',
      operator: '系统拦截',
      actionHint: '需修改原始指令后重新提交。'
    }
  ],
  'task-105': [
    {
      id: 'ts-105-1',
      title: '镜头 1 · 校园礼仪场景',
      duration: '24 秒',
      status: 'ready',
      visual: '校园门厅和教学楼场景，适配学校品牌主题色。',
      narration: '礼仪不是口号，而是每天都能做到的尊重与秩序。',
      updatedAt: '今天 09:58',
      operator: '国际课程组初稿',
      actionHint: '可先确认是否启用双语字幕。'
    }
  ]
};

export const taskActivityLogs: Record<string, TaskActivityLog[]> = {
  'task-101': [
    {
      time: '14:02',
      title: '输入审核通过',
      desc: '系统完成主题、标签和学校素材策略的前置审核。',
      actor: '系统'
    },
    {
      time: '14:06',
      title: '教师确认脚本',
      desc: '李老师修改了第二镜头的旁白，并确认进入素材生成。',
      actor: '教师'
    },
    {
      time: '14:20',
      title: '仅重配音',
      desc: '第二镜头改旁白后，系统只触发配音重合成，没有重绘画面。',
      actor: '系统'
    },
    {
      time: '14:31',
      title: '第三镜头重绘中',
      desc: '教师补充了“班级公约”画面元素，系统正在重绘并同步重配音。',
      actor: '系统'
    }
  ],
  'task-102': [
    {
      time: '10:22',
      title: '历史人物标签注入',
      desc: '系统自动加入“真实历史人物需终审复核”的提示语。',
      actor: '系统'
    },
    {
      time: '11:08',
      title: '输出机审完成',
      desc: '视频整体安全，但因历史人物主题被送入教师复审。',
      actor: '系统'
    },
    {
      time: '11:20',
      title: '等待完整看片',
      desc: '教师需要看完整片并确认字幕修订建议。',
      actor: '教师'
    }
  ],
  'task-104': [
    {
      time: '09:08',
      title: '输入违规拦截',
      desc: '系统提示“内容违规，请修改后重试”，并写入教师可见日志。',
      actor: '系统'
    }
  ]
};

export const reviewCases: ReviewCase[] = [
  {
    id: 'rv-1',
    schoolId: 'cdsywgy',
    taskId: 'task-102',
    title: '钱学森与科技报国',
    severity: '中',
    school: '成都市实验外国语学校',
    applicant: '王教研员',
    machine: '输出机审置信度 0.71，且命中真实历史人物规则，强制进入人工复审。',
    notes: '建议将“世界顶尖”修订为“作出重要贡献”，教师需观看完整视频后再决定是否通过。',
    tags: ['历史人物强制复审', '字幕措辞收敛', '全片复核'],
    keyframes: [
      { time: '00:05', label: '人物出场', note: '安全通过' },
      { time: '00:18', label: '字幕修订点', note: '建议弱化措辞并复核史实表述' },
      { time: '00:31', label: '价值升华', note: '课堂导向明确，但需完整观看后确认' }
    ],
    subtitleSegments: [
      { time: '00:07', text: '钱学森为我国航天事业作出了重要贡献。', level: 'safe' },
      { time: '00:18', text: '他是世界顶尖科学家。', level: 'warn' },
      { time: '00:33', text: '科技报国不仅是历史，也是今天的使命。', level: 'safe' }
    ],
    modules: [
      {
        key: 'text',
        title: '文本审校',
        summary: '文本与教材方向一致，但个别措辞需要收敛。',
        points: ['无敏感内容命中', '价值导向明确', '个别定语偏满，需要改成教材表述']
      },
      {
        key: 'image',
        title: '图像审校',
        summary: '人物画面和背景符合课堂传播规范。',
        points: ['无不合规二创', '背景简洁适合课堂播放', '建议控制高饱和红色面积']
      },
      {
        key: 'video',
        title: '视频关键帧',
        summary: '镜头节奏稳定，00:18 处需要字幕修订。',
        points: ['00:05 人物介绍正常', '00:18 关键帧需改字', '00:31 结尾升华可保留']
      },
      {
        key: 'audio',
        title: '音频与配音',
        summary: '语速适中，适合中小学课堂播放。',
        points: ['语速未超阈值', '配乐低于旁白', '无情绪化、煽动式表达']
      }
    ],
    history: [
      { time: '09:25', title: '输入前审校通过', desc: '未发现敏感词与违禁素材。' },
      { time: '11:08', title: '输出机审完成', desc: '文本、图像安全通过，视频关键帧命中 1 条表述建议。' },
      { time: '11:26', title: '人工复核提醒', desc: '涉及真实历史人物，需教师完整观看后再确认。' }
    ]
  },
  {
    id: 'rv-2',
    schoolId: 'pxtx',
    taskId: 'task-104',
    title: '学生违规指令待重提',
    severity: '高',
    school: '成都市泡桐树小学（天府校区）',
    applicant: '学生提交',
    machine: '输入审核直接拦截，判定为不适宜未成年人内容方向。',
    notes: '学生可修改后重新提交；若累计 3 次恶意违规，则限制使用 24 小时。',
    tags: ['输入审核拦截', '学生重提', '教师可见日志'],
    keyframes: [{ time: '00:00', label: '未进入生成', note: '输入阶段即被拦截' }],
    subtitleSegments: [{ time: '00:00', text: '暂无视频字幕。', level: 'block' }],
    modules: [
      {
        key: 'text',
        title: '输入审查',
        summary: '指令命中敏感输入规则，未进入脚本生成阶段。',
        points: ['已记录用户和时间', '教师端可查看违规历史', '支持修改指令后重新提交']
      },
      {
        key: 'image',
        title: '图像审校',
        summary: '未生成画面。',
        points: ['输入阶段拦截，无后续素材']
      },
      {
        key: 'video',
        title: '视频审校',
        summary: '未生成视频。',
        points: ['无需进入输出审核']
      },
      {
        key: 'audio',
        title: '音频审校',
        summary: '未生成配音。',
        points: ['未触发 TTS']
      }
    ],
    history: [
      { time: '09:08', title: '输入违规拦截', desc: '系统提示“内容违规，请修改后重试”。' },
      { time: '09:09', title: '教师可见记录', desc: '该条违规已经写入教师审核日志。' }
    ]
  },
  {
    id: 'rv-3',
    schoolId: 'cdsszx',
    taskId: 'task-101',
    title: '诚信主题 3 分钟课堂视频',
    severity: '低',
    school: '成都石室中学',
    applicant: '李老师',
    machine: '当前处于成片前机审阶段，暂无高风险命中。',
    notes: '预计成片后可自动通过，若后续启用校园背景智能融入，需要再看一次画面一致性。',
    tags: ['普通复核', '可自动通过'],
    keyframes: [
      { time: '00:04', label: '借书角镜头', note: '低龄友好' },
      { time: '00:36', label: '主动承认错误', note: '教师建议保留' }
    ],
    subtitleSegments: [
      { time: '00:12', text: '诚信就是说真话、做对事。', level: 'safe' },
      { time: '00:35', text: '勇敢承认错误也是诚信的一部分。', level: 'safe' }
    ],
    modules: [
      {
        key: 'text',
        title: '文本审校',
        summary: '表达符合小学高段课程目标，鼓励行动倡议。',
        points: ['故事清晰', '结尾有课堂追问', '没有超龄抽象词汇']
      },
      {
        key: 'image',
        title: '图像审校',
        summary: '校园卡通画面一致性较好。',
        points: ['角色统一', '场景安全', '校徽叠加正确']
      },
      {
        key: 'video',
        title: '视频关键帧',
        summary: '节奏平稳，适合作为课堂导入。',
        points: ['镜头衔接自然', '转场不过度炫技']
      },
      {
        key: 'audio',
        title: '音频与配音',
        summary: '语速与年级匹配，配乐控制得当。',
        points: ['220 字/分钟', '字幕同步正常']
      }
    ],
    history: [
      { time: '14:02', title: '输入审核通过', desc: '自然语言指令安全通过。' },
      { time: '14:06', title: '教师确认脚本', desc: '允许进入批量生成阶段。' },
      { time: '14:33', title: '成片前检查', desc: '系统判定大概率自动通过。' }
    ]
  }
];

export const reviewDecisionGuides: ReviewDecisionGuide[] = [
  {
    id: 'approve',
    label: '教师通过',
    when: '机审安全或仅有低风险提示时',
    action: '视频直接进入教师视频库；若为学生作品，再同步学生可见状态。',
    desc: '适用于普通课堂导入、校园文明等低风险场景。'
  },
  {
    id: 'regen',
    label: '要求重新生成',
    when: '画面或字幕需要明显修订，但主题方向可保留时',
    action: '系统保留原任务号并生成新版本，审计链路不断裂。',
    desc: '适用于历史人物字幕措辞需要修正、校园背景素材要替换等情况。'
  },
  {
    id: 'reject',
    label: '退回修改',
    when: '输入方向本身不合适，或学生需重新组织表达时',
    action: '任务回到发起台，学生只能修改后重提，教师可看到退回原因。',
    desc: '适用于输入审核拦截、年级表达明显不匹配等场景。'
  }
];

export const inputAuditCheckpoints: InputAuditCheckpoint[] = [
  {
    id: 'input-1',
    title: '未成年人保护',
    type: 'safe',
    summary: '禁止引导危险模仿、欺凌、极端表达和不适宜未成年人的剧情。',
    detail: '前置审核优先拦截问题输入，减少无效算力浪费。'
  },
  {
    id: 'input-2',
    title: '真人形象禁令',
    type: 'warn',
    summary: '允许卡通或插画风历史人物，不允许真实学生、教师照片替换。',
    detail: '教师若上传校园素材，只能作为背景或品牌资产，不能用于真人换脸。'
  },
  {
    id: 'input-3',
    title: '学校品牌策略',
    type: 'safe',
    summary: '校徽、校训和校园背景按学校隔离注入，不跨校复用。',
    detail: '切换学校后，系统名称、主题色和素材注入策略同步变化。'
  },
  {
    id: 'input-4',
    title: '高风险表达拦截',
    type: 'block',
    summary: '命中敏感表达时直接中断流程，并写入教师可见日志。',
    detail: '学生累计 3 次恶意违规后可被限制 24 小时。'
  }
];

export const schoolAssets: SchoolAsset[] = [
  {
    id: 'asset-1',
    schoolId: 'pxtx',
    type: '校园背景图',
    title: '实验小学操场全景',
    source: '学校管理员上传',
    usage: '已复用 18 次',
    description: '管理员指定为“背景替换模式”默认图，可在故事发生场景中智能融入校园环境。',
    access: '本校隔离可用'
  },
  {
    id: 'asset-2',
    schoolId: 'cdsszx',
    type: '校徽与校训',
    title: '固定叠加校徽 + 校训',
    source: '学校管理员上传',
    usage: '已复用 42 次',
    description: '用于片头片尾固定叠加，支持透明度、位置和水印样式配置。',
    access: '本校隔离可用'
  },
  {
    id: 'asset-3',
    schoolId: 'cdsszx',
    type: '知识点标签',
    title: '本校红色资源标签包',
    source: '教师自定义',
    usage: '已复用 7 次',
    description: '包含“嘉兴红船”“井冈山精神”等本校可见标签，可注入脚本提示词。',
    access: '本校隔离可用'
  },
  {
    id: 'asset-4',
    schoolId: 'cdwgy',
    type: '系统主题配置',
    title: '成都外国语品牌主题包',
    source: '学校管理员上传',
    usage: '已复用 12 次',
    description: '包含系统名称、主色、校内水印文案和首页欢迎语，用于学校切换演示。',
    access: '本校隔离可用'
  },
  {
    id: 'asset-5',
    schoolId: 'cdsywgy',
    type: '校训视觉资源',
    title: '厚德博学 进取卓越',
    source: '官网公开信息整理',
    usage: '已复用 9 次',
    description: '用于学校品牌主题展示和片尾校训叠加，可与学校标识一并配置。',
    access: '本校隔离可用'
  },
  {
    id: 'asset-6',
    schoolId: 'cdwgy',
    type: '校园背景图',
    title: '国际交流长廊',
    source: '学校管理员上传',
    usage: '已复用 5 次',
    description: '用于礼仪主题和校园故事主题的默认背景。',
    access: '本校隔离可用'
  }
];

export const schoolWatermarkPresets: WatermarkPreset[] = [
  {
    id: 'wm-1',
    schoolId: 'cdsszx',
    name: '片头片尾固定叠加',
    mode: '固定叠加',
    position: '左下角 + 片尾居中',
    opacity: '72%',
    sceneUsage: '课堂导入、教师备课',
    desc: '适合正式课堂视频，强调学校品牌和课程归属。'
  },
  {
    id: 'wm-2',
    schoolId: 'cdwgy',
    name: '品牌主题轻水印',
    mode: '固定叠加',
    position: '右上角',
    opacity: '54%',
    sceneUsage: '学生作业展示',
    desc: '保留品牌识别，同时不干扰字幕和主要画面。'
  },
  {
    id: 'wm-3',
    schoolId: 'pxtx',
    name: '校园背景智能融入',
    mode: '智能融入',
    position: '背景内嵌',
    opacity: '自适应',
    sceneUsage: '校园故事、班级活动',
    desc: '把校园场景作为故事背景融入，不单独叠加硬水印。'
  }
];

export const publishItems: PublishItem[] = [
  {
    id: 'pub-1',
    schoolId: 'pxtx',
    taskId: 'task-103',
    title: '学生作业：校园文明一分钟短片',
    status: 'published',
    version: 'v1.2',
    visibility: '教师视频库 / 学生可见',
    operator: '班主任 李老师',
    updatedAt: '今天 09:20'
  },
  {
    id: 'pub-2',
    schoolId: 'cdsywgy',
    taskId: 'task-102',
    title: '钱学森与科技报国',
    status: 'review',
    version: 'v0.9',
    visibility: '待教师复审',
    operator: '审核员 王宁',
    updatedAt: '今天 11:32'
  },
  {
    id: 'pub-3',
    schoolId: 'cdsszx',
    taskId: 'task-101',
    title: '诚信主题 3 分钟课堂视频',
    status: 'draft',
    version: 'v0.4',
    visibility: '教师草稿箱',
    operator: '李老师',
    updatedAt: '今天 14:35'
  },
  {
    id: 'pub-4',
    schoolId: 'cdwgy',
    taskId: 'task-105',
    title: '校园礼仪双语导入视频',
    status: 'draft',
    version: 'v0.3',
    visibility: '待脚本确认',
    operator: '国际课程组',
    updatedAt: '今天 10:05'
  }
];

export const libraryAuditSnapshots: Record<string, LibraryAuditSnapshot> = {
  'task-103': {
    posterTitle: '校园文明一分钟短片',
    classroomUse: '班会导入 / 学生自评 / 家校沟通',
    retention: '默认保存 30 天，教师可手动导出',
    restrictions: ['仅限校内教学使用', '禁止一键分享到公共社交平台', '学生仅能看到教师确认版本'],
    auditTrail: [
      {
        time: '昨天 16:48',
        title: '教师完成脚本确认',
        desc: '学生提交后由班主任完成代审。'
      },
      {
        time: '昨天 17:38',
        title: '终审通过',
        desc: '视频进入教师视频库。'
      },
      {
        time: '今天 09:20',
        title: '同步学生可见',
        desc: '学生端可以观看和下载该作品。'
      }
    ]
  },
  'task-102': {
    posterTitle: '钱学森与科技报国',
    classroomUse: '历史人物主题班会 / 科技报国主题活动',
    retention: '复审完成后才写入正式视频库',
    restrictions: ['需教师完整看片', '涉及历史人物的版本必须保留审计链路'],
    auditTrail: [
      {
        time: '今天 11:08',
        title: '机审完成',
        desc: '命中历史人物复审规则。'
      },
      {
        time: '今天 11:26',
        title: '教师复审提醒',
        desc: '等待教师完整看片和结论。'
      }
    ]
  }
};

export const roleProfiles: RoleProfile[] = [
  {
    id: 'teacher',
    role: '教师',
    dailyLimit: '10 个视频 / 日',
    desc: '课堂教学视频生成、审核学生作品和最终发布的核心操作者。',
    capabilities: ['自由输入指令', '强制审核脚本', '修改分镜 / 配音 / 字幕', '审批学生视频', '查看违规记录']
  },
  {
    id: 'student',
    role: '学生',
    dailyLimit: '2 个视频 / 日',
    desc: '课后作业和课堂创作参与者，但无脚本审核权。',
    capabilities: ['输入指令', '查看教师通过后的作品', '违规后修改重提']
  },
  {
    id: 'school-admin',
    role: '学校管理员',
    dailyLimit: '不限',
    desc: '负责校内素材、标签和学校默认参数的维护。',
    capabilities: ['上传校徽 / 校训 / 校园图片', '设置水印样式', '维护年级默认参数', '查看全校生成记录']
  },
  {
    id: 'platform-ops',
    role: '平台运营',
    dailyLimit: '不限',
    desc: '负责全局审核阈值、知识点标签库和高风险内容处理。',
    capabilities: ['维护思政知识点标签库', '审核高风险内容', '管理全局模型阈值']
  }
];

export const demoAccounts: DemoAccountCard[] = [
  {
    key: 'teacher',
    label: '教师视角',
    loginName: 'teacher',
    school: '成都石室中学',
    focusRoute: '/workflow/workspace',
    highlights: ['发起任务', '逐镜审稿', '微调镜头', '终审放行']
  },
  {
    key: 'student',
    label: '学生视角',
    loginName: 'student',
    school: '成都市泡桐树小学（天府校区）',
    focusRoute: '/workflow/tasks',
    highlights: ['提交作业', '查看可见作品', '被拦截后重提']
  },
  {
    key: 'admin',
    label: '学校管理员视角',
    loginName: 'admin',
    school: '成都外国语学校',
    focusRoute: '/school/assets',
    highlights: ['维护校徽校训', '配置水印', '查看学校规则']
  },
  {
    key: 'ops',
    label: '平台运营视角',
    loginName: 'operator',
    school: '成都市实验外国语学校',
    focusRoute: '/governance/review',
    highlights: ['跨校巡检', '调规则权重', '看全局技术与成本']
  }
];

export const quotaMetrics = [
  {
    title: '并发能力',
    value: '50 / 200',
    desc: '单校常态 50 人并发，高峰公开课周支持 200 并发。'
  },
  {
    title: '生成 SLA',
    value: '≤ 5 分钟',
    desc: '不含人工审核时间，从指令输入到合成完成应控制在 5 分钟内。'
  },
  {
    title: '视频保留策略',
    value: '30 天',
    desc: '生成视频默认保留 30 天，教师可主动导出保存。'
  },
  {
    title: '历史清理',
    value: '180 天',
    desc: '长时间未使用的历史视频将自动清理，降低存储成本。'
  }
];

export const acceptanceChecklist = [
  'TC01 教师不修改脚本直接确认后，应生成完整视频，时长 ≤ 3 分钟，720p，校徽水印正确。',
  'TC02 教师仅修改某个分镜的旁白并重新生成时，只重合成配音，画面保持不变。',
  'TC03 教师修改画面描述并重新生成时，应同时重绘画面并重合成配音。',
  'TC04 学生输入敏感词时，系统必须拦截、记录日志，并允许修改后重新提交。',
  'TC05 视频出现历史人物形象时，应强制进入教师完整看片复审流程。',
  'TC06 学校管理员上传校徽并启用固定叠加后，所有新视频片头片尾自动带校徽。',
  'TC07 选择小学 1-2 年级时，应自动切换慢语速、简单词汇和卡通风格。',
  'TC08 同一学生当日第 3 次发起时，系统应提示达到上限并拒绝生成。',
  'TC09 高峰期 200 并发时，系统不崩溃并展示用户当前排队位置与预计等待时间。',
  'TC10 不同角色登录后，只能看到对应菜单、按钮和看板卡片。',
  'TC11 切换不同学校时，系统名称、主题色、学校标识和学校资产同步切换。',
  'TC12 调整审核规则权重后，新的命中说明和处理结果即时生效。'
];

export const reviewRules: ReviewRule[] = [
  {
    id: 'rule-001',
    name: '政治敏感表达拦截',
    stage: '输入',
    riskLevel: '高',
    weight: 100,
    scope: '全局',
    enabled: true,
    description: '对明显不适宜未成年人教育场景的敏感政治表达直接拦截，不进入脚本生成阶段。',
    hitHint: '命中后直接提示“内容违规，请修改后重试”。',
    owner: '平台运营',
    updatedAt: '今天 10:12'
  },
  {
    id: 'rule-002',
    name: '历史人物形象强制复审',
    stage: '视频',
    riskLevel: '中',
    weight: 80,
    scope: '全局',
    enabled: true,
    description: '涉及雷锋、周恩来、钱学森等真实历史人物时，即使机审通过，也必须进入教师完整看片复审。',
    hitHint: '命中后在复审页高亮关键帧和字幕片段。',
    owner: '平台运营',
    updatedAt: '今天 09:46'
  },
  {
    id: 'rule-003',
    name: '校徽 / 校训缺失提醒',
    stage: '发布',
    riskLevel: '低',
    weight: 20,
    scope: '学校',
    enabled: true,
    description: '学校开启品牌叠加策略后，如片头片尾缺失校徽或校训，发布前给出补全提醒。',
    hitHint: '命中后允许继续保存草稿，但不能直接发布。',
    owner: '学校管理员',
    updatedAt: '今天 08:58'
  },
  {
    id: 'rule-004',
    name: '低龄词汇难度提醒',
    stage: '脚本',
    riskLevel: '低',
    weight: 15,
    scope: '学校',
    enabled: true,
    description: '当小学低年级脚本中出现过多抽象词汇时，提示教师优化语言难度，但不强制拦截。',
    hitHint: '命中后在脚本审核台展示“适龄表达”提醒。',
    owner: '学校管理员',
    updatedAt: '今天 11:06'
  }
];

export const ruleSimulationCases: RuleSimulationCase[] = [
  {
    id: 'sim-1',
    title: '学生输入含敏感表达',
    summary: '用于演示前置审核在输入阶段直接拦截，不浪费后续算力。',
    hitRuleIds: ['rule-001'],
    recommendation: '直接拦截并要求修改后重试。',
    riskScore: 96
  },
  {
    id: 'sim-2',
    title: '历史人物主题成片',
    summary: '用于演示“机审安全 + 历史人物强制复审”的业务逻辑。',
    hitRuleIds: ['rule-002'],
    recommendation: '进入教师完整看片复审。',
    riskScore: 74
  },
  {
    id: 'sim-3',
    title: '低龄脚本词汇偏难',
    summary: '用于演示学校侧规则只提醒不直接阻断流程。',
    hitRuleIds: ['rule-004'],
    recommendation: '提示教师调整用词难度后继续。',
    riskScore: 28
  },
  {
    id: 'sim-4',
    title: '发布前缺少校徽',
    summary: '用于演示学校品牌策略不满足时，视频只能保存草稿。',
    hitRuleIds: ['rule-003'],
    recommendation: '保留草稿，不允许直接发布。',
    riskScore: 42
  }
];

export const techArchitectureLayers: TechArchitectureLayer[] = [
  {
    id: 'layer-api',
    title: '统一 API 服务层',
    summary: '承载登录、任务发起、脚本编辑、审核结果查询与管理后台接口。',
    items: ['FastAPI', '角色权限 + 数据范围控制', '统一接入网关演进空间']
  },
  {
    id: 'layer-workflow',
    title: '工作流编排中心',
    summary: '管理视频任务状态机、子任务拆分、失败重试和排队调度。',
    items: ['Redis 队列', 'Celery / ARQ', 'pending / running / waiting_review / blocked / completed']
  },
  {
    id: 'layer-generator',
    title: '生成适配层',
    summary: '统一封装脚本生成、Seedance 2.0、TTS、字幕与 FFmpeg 合成。',
    items: ['generate_storyboard_assets', 'regenerate_scene_visual', 'synthesize_voice', 'compose_video']
  },
  {
    id: 'layer-review',
    title: '审核中台',
    summary: '封装腾讯云 TMS / CI、自定义规则、风险分级和人工复审流转。',
    items: ['前置输入审核', '后置视频审核', '规则版本管理', '命中明细留存']
  },
  {
    id: 'layer-assets',
    title: '资产中心',
    summary: '管理学校素材、模板、标签库、输出视频和审计附件。',
    items: ['COS / MinIO', '学校隔离资产', '视频库与审计链路']
  }
];

export const deliveryPhases: DeliveryPhase[] = [
  {
    id: 'phase-1',
    phase: 'MVP 交付',
    goal: '先把教师主流程与学生差异流程跑通，确保可 demo、可验收、可上线试点。',
    scope: 'PC Web 端、单体增强型后端、前置 + 后置审核闭环。',
    milestone: '10 分钟内完成 3 分钟课堂视频的发起、审稿、生成、复审和入库演示。',
    riskControl: '先用任务队列和规则中台保护稳定性，避免一开始追求复杂分布式。'
  },
  {
    id: 'phase-2',
    phase: '学校接入扩展',
    goal: '支持更多学校接入与多学校品牌配置复用。',
    scope: '学校素材库、标签库、默认参数、校级规则独立维护。',
    milestone: '能在同一套平台下快速切换多学校主题和资产。 ',
    riskControl: '坚持学校资源隔离，避免素材和日志串校。'
  },
  {
    id: 'phase-3',
    phase: '分布式演进',
    goal: '应对更高并发和更多工作流节点。',
    scope: '统一接入网关、服务拆分、K8s 部署、可观测性增强。',
    milestone: '生成编排、审核中台、权限中心可以独立扩容。',
    riskControl: '先保持接口稳定，再逐步拆服务，避免 MVP 期过度设计。'
  }
];

export const mockAuthUsers: Record<string, Api.Auth.UserInfo> = {
  teacher: {
    userId: 'teacher-001',
    userName: '李老师',
    schoolId: 'cdsszx',
    schoolName: '成都石室中学',
    roles: ['R_TEACHER'],
    buttons: [
      'video:create',
      'script:review',
      'video:publish',
      'review:approve',
      'scene:voice-regenerate',
      'scene:visual-regenerate'
    ]
  },
  student: {
    userId: 'student-001',
    userName: '张同学',
    schoolId: 'pxtx',
    schoolName: '成都市泡桐树小学（天府校区）',
    roles: ['R_STUDENT'],
    buttons: ['video:create', 'task:resubmit']
  },
  admin: {
    userId: 'admin-001',
    userName: '周主任',
    schoolId: 'cdwgy',
    schoolName: '成都外国语学校',
    roles: ['R_SCHOOL_ADMIN'],
    buttons: ['asset:manage', 'watermark:config', 'record:view', 'school:theme-config', 'rules:school-view']
  },
  ops: {
    userId: 'ops-001',
    userName: '平台运营 何老师',
    schoolId: 'cdsywgy',
    schoolName: '成都市实验外国语学校',
    roles: ['R_PLATFORM_OPS'],
    buttons: ['review:approve', 'rules:manage', 'threshold:manage', 'record:view']
  }
};
