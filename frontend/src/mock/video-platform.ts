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
  type: string;
  title: string;
  source: string;
  usage: string;
  description: string;
  access: string;
}

export interface PublishItem {
  id: string;
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

export const platformMetrics: PlatformMetric[] = [
  {
    label: '今日待处理任务',
    value: '12',
    desc: '覆盖教师发起、学生代审和输出复审'
  },
  {
    label: '教师剩余配额',
    value: '6 / 10',
    desc: '每日上限可按角色和学校策略配置'
  },
  {
    label: '当前排队峰值',
    value: '200 并发',
    desc: '高峰期进入排队并展示预计等待时间'
  },
  {
    label: '学校定制资产',
    value: '8 项',
    desc: '校徽、校训、校园背景和本校红色资源标签'
  }
];

export const workflowStages: WorkflowStage[] = [
  {
    title: '自然语言发起',
    owner: '教师 / 学生',
    desc: '输入主题、时长、年级、知识点标签和学校定制参数，并先经过输入安全审核。'
  },
  {
    title: '教师强制审稿',
    owner: '教师',
    desc: '系统自动生成结构化脚本，教师必须逐镜确认旁白和画面描述，未确认前不得进入素材生成。'
  },
  {
    title: '自动批量生成',
    owner: '系统',
    desc: '按确认后的分镜批量生成画面、配音、字幕和背景音乐，并将任务纳入排队体系。'
  },
  {
    title: '单镜头微调',
    owner: '教师',
    desc: '修改旁白仅重合成配音，修改画面描述则重绘画面并重新合成配音。'
  },
  {
    title: '输出安全复审',
    owner: '系统 + 教师',
    desc: '0.9 自动拦截，0.6~0.9 强制人工复审，真实历史人物全量进入教师复核。'
  },
  {
    title: '视频入库与审计',
    owner: '教师 / 学校',
    desc: '通过的视频进入教师视频库，学生作品经教师确认后才对学生可见，并保留完整审计日志。'
  }
];

export const templatePresets: TemplatePreset[] = [
  {
    id: 'tpl-moral',
    category: '课堂导入',
    title: '诚信主题故事模板',
    tone: '卡通叙事',
    description: '适合 3 分钟以内课堂导入，默认包含故事、总结和行动倡议三段式结构。',
    scenes: 6
  },
  {
    id: 'tpl-hero',
    category: '历史人物',
    title: '历史人物精神主题',
    tone: '庄重叙事',
    description: '适合雷锋、周恩来等人物主题，自动触发历史人物强制复审提醒。',
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
    description: '默认走学生发起、教师代审、教师确认可见的审核链路。',
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
  }
];

export const reviewCases: ReviewCase[] = [
  {
    id: 'rv-1',
    taskId: 'task-102',
    title: '钱学森与科技报国',
    severity: '中',
    school: '天府新区教师发展中心',
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
    taskId: 'task-104',
    title: '学生违规指令待重提',
    severity: '高',
    school: '实验小学五年级组',
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
  }
];

export const schoolAssets: SchoolAsset[] = [
  {
    id: 'asset-1',
    type: '校园背景图',
    title: '实验小学操场全景',
    source: '学校管理员上传',
    usage: '已复用 18 次',
    description: '管理员指定为“背景替换模式”默认图，可在故事发生场景中智能融入校园环境。',
    access: '本校隔离可用'
  },
  {
    id: 'asset-2',
    type: '校徽与校训',
    title: '固定叠加校徽 + 校训',
    source: '学校管理员上传',
    usage: '已复用 42 次',
    description: '用于片头片尾固定叠加，支持透明度、位置和水印样式配置。',
    access: '本校隔离可用'
  },
  {
    id: 'asset-3',
    type: '知识点标签',
    title: '本校红色资源标签包',
    source: '教师自定义',
    usage: '已复用 7 次',
    description: '包含“嘉兴红船”“井冈山精神”等本校可见标签，可注入脚本提示词。',
    access: '本校隔离可用'
  }
];

export const publishItems: PublishItem[] = [
  {
    id: 'pub-1',
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
    taskId: 'task-101',
    title: '诚信主题 3 分钟课堂视频',
    status: 'draft',
    version: 'v0.4',
    visibility: '教师草稿箱',
    operator: '李老师',
    updatedAt: '今天 14:35'
  }
];

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
  'TC09 高峰期 200 并发时，系统不崩溃并展示用户当前排队位置与预计等待时间。'
];

export const mockAuthUsers: Record<string, Api.Auth.UserInfo> = {
  teacher: {
    userId: 'teacher-001',
    userName: '李老师',
    roles: ['R_TEACHER'],
    buttons: ['video:create', 'script:review', 'video:publish']
  },
  student: {
    userId: 'student-001',
    userName: '张同学',
    roles: ['R_STUDENT'],
    buttons: ['video:create']
  },
  admin: {
    userId: 'admin-001',
    userName: '周主任',
    roles: ['R_SCHOOL_ADMIN'],
    buttons: ['asset:manage', 'watermark:config', 'record:view']
  }
};
