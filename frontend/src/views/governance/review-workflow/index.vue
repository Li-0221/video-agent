<script setup lang="ts">
import { computed, markRaw, ref } from 'vue';
import type { Connection, Edge, Node, NodeTypesObject } from '@vue-flow/core';
import { MarkerType, VueFlow } from '@vue-flow/core';
import { Background } from '@vue-flow/background';
import { Controls } from '@vue-flow/controls';
import '@vue-flow/core/dist/style.css';
import '@vue-flow/core/dist/theme-default.css';
import '@vue-flow/controls/dist/style.css';
import { useSchoolStore } from '@/store/modules/school';
import WorkflowFlowNode from './modules/workflow-node.vue';
import type { WorkflowField, WorkflowNodeData, WorkflowTemplate } from './modules/types';

defineOptions({
  name: 'GovernanceReviewWorkflow'
});

type FlowNode = Node<WorkflowNodeData> & { data: WorkflowNodeData };
type FlowEdge = Edge;

type SceneKey = 'school' | 'platform';

const schoolStore = useSchoolStore();

const nodeTypes = markRaw({
  workflow: WorkflowFlowNode
}) as NodeTypesObject;

const workflowTemplates: WorkflowTemplate[] = [
  {
    kind: 'input-audit',
    title: '输入审核',
    description: '对用户指令、补充说明和学校敏感词注入后的提示词做前置审核。',
    stage: '输入阶段',
    owner: '系统',
    badge: '同步审核',
    accent: '#3b82f6',
    roleScope: '学校管理员可调阈值',
    phaseLabel: '学校侧',
    defaultMode: '同步审核',
    defaultQueue: 'input-audit',
    defaultBizType: 'edu-input-review',
    defaultFallbackAction: '直接拦截',
    defaultThreshold: 90,
    defaultTimeout: 8
  },
  {
    kind: 'script-review',
    title: '教师脚本审核',
    description: '教师必须确认旁白、画面和镜头顺序后，才能进入素材生成与视频审核阶段。',
    stage: '脚本阶段',
    owner: '教师',
    badge: '强制确认',
    accent: '#8b5cf6',
    roleScope: '教师确认节点',
    phaseLabel: '学校侧',
    defaultMode: '单次',
    defaultQueue: 'script-review',
    defaultBizType: 'edu-script-review',
    defaultFallbackAction: '退回修改',
    defaultThreshold: 75,
    defaultTimeout: 120
  },
  {
    kind: 'video-audit',
    title: '输出机审',
    description: '对字幕、关键帧、音频和成片做多模态审核，输出风险分和结构化结论。',
    stage: '输出阶段',
    owner: '系统',
    badge: '异步审核',
    accent: '#2563eb',
    roleScope: '平台能力节点',
    phaseLabel: '平台基线',
    defaultMode: '异步审核',
    defaultQueue: 'video-review',
    defaultBizType: 'edu-video-review',
    defaultFallbackAction: '进入人工复审',
    defaultThreshold: 60,
    defaultTimeout: 30
  },
  {
    kind: 'manual-review',
    title: '人工复审',
    description: '命中历史人物、高风险或中风险区间时，转老师或运营做人工确认。',
    stage: '复审阶段',
    owner: '教师 / 运营',
    badge: '人工节点',
    accent: '#f59e0b',
    roleScope: '学校管理员 / 平台运营',
    phaseLabel: '协同节点',
    defaultMode: '单次',
    defaultQueue: 'teacher-review',
    defaultBizType: 'edu-manual-review',
    defaultFallbackAction: '退回修改',
    defaultThreshold: 70,
    defaultTimeout: 120
  },
  {
    kind: 'condition',
    title: '风险分流',
    description: '根据机审风险分决定自动通过、人工复审或直接拦截。',
    stage: '路由策略',
    owner: '规则中台',
    badge: '条件节点',
    accent: '#14b8a6',
    roleScope: '平台运营维护基线',
    phaseLabel: '平台基线',
    defaultMode: '按风险分流',
    defaultQueue: 'strategy-router',
    defaultBizType: 'edu-risk-router',
    defaultFallbackAction: '进入人工复审',
    defaultThreshold: 60,
    defaultTimeout: 6
  },
  {
    kind: 'publish',
    title: '发布入库',
    description: '把审核通过的视频写入视频库，并按角色同步可见性与审计记录。',
    stage: '发布阶段',
    owner: '系统',
    badge: '结果节点',
    accent: '#22c55e',
    roleScope: '结果回写',
    phaseLabel: '发布侧',
    defaultMode: '返回变量',
    defaultQueue: 'publish',
    defaultBizType: 'edu-publish-review',
    defaultFallbackAction: '结束流程',
    defaultThreshold: 0,
    defaultTimeout: 15
  }
];

const scenePresets: Record<
  SceneKey,
  {
    label: string;
    audience: string;
    description: string;
    highlight: string;
  }
> = {
  school: {
    label: '本校审核模板',
    audience: '学校管理员主用',
    description: '适合演示学校如何调整本校脚本审核、人工复审流向和学校级阈值。',
    highlight: '保留教师脚本审核，强调学校侧责任边界。'
  },
  platform: {
    label: '平台基线模板',
    audience: '平台运营维护',
    description: '适合演示平台如何维护跨校基线流程、全局审核策略和默认节点能力。',
    highlight: '突出平台统一风控和模板下发能力。'
  }
};

const typeOptions = [
  { label: 'String', value: 'string' },
  { label: 'Number', value: 'number' },
  { label: 'Boolean', value: 'boolean' },
  { label: 'Array', value: 'array' },
  { label: 'Object', value: 'object' }
];

const modeOptions = [
  { label: '自动触发', value: '自动触发' },
  { label: '单次', value: '单次' },
  { label: '同步审核', value: '同步审核' },
  { label: '异步审核', value: '异步审核' },
  { label: '按风险分流', value: '按风险分流' },
  { label: '返回变量', value: '返回变量' }
];

const queueOptions = [
  { label: 'default', value: 'default' },
  { label: 'workflow-entry', value: 'workflow-entry' },
  { label: 'workflow-finish', value: 'workflow-finish' },
  { label: 'input-audit', value: 'input-audit' },
  { label: 'script-review', value: 'script-review' },
  { label: 'teacher-review', value: 'teacher-review' },
  { label: 'video-review', value: 'video-review' },
  { label: 'publish', value: 'publish' }
];

const fallbackOptions = [
  { label: '继续执行', value: '继续执行' },
  { label: '进入人工复审', value: '进入人工复审' },
  { label: '直接拦截', value: '直接拦截' },
  { label: '退回修改', value: '退回修改' },
  { label: '结束流程', value: '结束流程' }
];

const activeScene = ref<SceneKey>('school');
const selectedTemplateKind = ref<WorkflowTemplate['kind']>('manual-review');
const selectedNodeId = ref('start-node');
const flowNodes = ref<FlowNode[]>([]);
const flowEdges = ref<FlowEdge[]>([]);

let nodeIndex = 40;
let fieldIndex = 100;
let edgeIndex = 100;

function createField(partial?: Partial<WorkflowField>): WorkflowField {
  fieldIndex += 1;

  return {
    id: `field-${fieldIndex}`,
    name: partial?.name || 'newField',
    type: partial?.type || 'string',
    required: partial?.required ?? true,
    source: partial?.source || '引用',
    description: partial?.description || '字段说明',
    ...partial
  };
}

function getTemplate(kind: WorkflowTemplate['kind']) {
  return workflowTemplates.find(item => item.kind === kind) || workflowTemplates[0];
}

function createNodeData(template: WorkflowTemplate, overrides?: Partial<WorkflowNodeData>): WorkflowNodeData {
  return {
    kind: template.kind,
    title: template.title,
    description: template.description,
    stage: template.stage,
    owner: template.owner,
    badge: template.badge,
    accent: template.accent,
    roleScope: template.roleScope,
    phaseLabel: template.phaseLabel,
    inputs: [
      createField({
        name: template.kind === 'manual-review' ? 'reviewPayload' : 'input',
        description: '来自上一个节点的输入数据'
      })
    ],
    outputs: [
      createField({
        name: template.kind === 'publish' ? 'publishResult' : 'output',
        description: '当前节点输出给下一步的数据'
      })
    ],
    settings: {
      mode: template.defaultMode,
      threshold: template.defaultThreshold,
      queue: template.defaultQueue,
      bizType: template.defaultBizType,
      fallbackAction: template.defaultFallbackAction,
      timeout: template.defaultTimeout
    },
    ...overrides
  };
}

function createFlowNode(
  kind: WorkflowTemplate['kind'],
  position: { x: number; y: number },
  overrides?: Partial<WorkflowNodeData> & Pick<Partial<FlowNode>, 'id' | 'draggable'>
): FlowNode {
  const template = getTemplate(kind);
  nodeIndex += 1;

  return {
    id: overrides?.id || `node-${nodeIndex}`,
    type: 'workflow',
    position,
    draggable: overrides?.draggable ?? true,
    data: createNodeData(template, overrides)
  };
}

function createStartNode(scene: SceneKey): FlowNode {
  return {
    id: 'start-node',
    type: 'workflow',
    draggable: false,
    position: { x: 80, y: 230 },
    data: {
      kind: 'start',
      title: 'Start',
      description:
        scene === 'school'
          ? '工作流起始节点，用于接收学校任务、创作者角色、学校规则上下文与本校素材信息。'
          : '平台基线工作流入口，接收平台审核任务、学校标识和多模态审核上下文。',
      stage: '触发入口',
      owner: '系统',
      badge: '固定节点',
      accent: '#4f46e5',
      roleScope: '系统触发',
      phaseLabel: '固定节点',
      locked: true,
      inputs: [
        createField({ name: 'taskId', description: '视频任务 ID' }),
        createField({ name: 'schoolId', description: '学校 ID' }),
        createField({ name: 'creatorRole', description: '教师 / 学生' })
      ],
      outputs: [createField({ name: 'inputPayload', description: '工作流入口上下文' })],
      settings: {
        mode: '自动触发',
        threshold: 0,
        queue: 'workflow-entry',
        bizType: 'edu-workflow-entry',
        fallbackAction: '结束流程',
        timeout: 5
      }
    }
  };
}

function createEndNode(scene: SceneKey, x = 2240): FlowNode {
  return {
    id: 'end-node',
    type: 'workflow',
    draggable: false,
    position: { x, y: 230 },
    data: {
      kind: 'end',
      title: 'End',
      description:
        scene === 'school'
          ? '输出最终审核结论、学校可见范围、人工复审记录和入库状态。'
          : '返回平台统一审核结果、模板命中信息和跨校审计记录。',
      stage: '结果回写',
      owner: '系统',
      badge: '固定节点',
      accent: '#4f46e5',
      roleScope: '系统回写',
      phaseLabel: '固定节点',
      locked: true,
      inputs: [
        createField({ name: 'finalDecision', description: '最终审核结论' }),
        createField({ name: 'videoVisibility', description: '教师可见 / 学生可见 / 拦截' })
      ],
      outputs: [createField({ name: 'result', description: '回写前端和审计中心的结果' })],
      settings: {
        mode: '返回变量',
        threshold: 0,
        queue: 'workflow-finish',
        bizType: 'edu-workflow-finish',
        fallbackAction: '结束流程',
        timeout: 5
      }
    }
  };
}

function createEdge(config: {
  source: string;
  target: string;
  label: string;
  overrides?: Partial<FlowEdge>;
}): FlowEdge {
  edgeIndex += 1;

  return {
    id: config.overrides?.id || `edge-${edgeIndex}`,
    source: config.source,
    target: config.target,
    label: config.label,
    type: 'smoothstep',
    markerEnd: MarkerType.ArrowClosed,
    style: { stroke: '#6366f1', strokeWidth: 2.2 },
    labelStyle: { fill: '#334155', fontWeight: 700, fontSize: '12px' },
    labelBgPadding: [8, 5],
    labelBgBorderRadius: 10,
    labelBgStyle: { fill: '#fff', fillOpacity: 0.96, stroke: '#cbd5e1' },
    ...config.overrides
  };
}

function buildSchoolScene() {
  const start = createStartNode('school');
  const inputAudit = createFlowNode(
    'input-audit',
    { x: 420, y: 80 },
    {
      title: '输入审核',
      inputs: [
        createField({ name: 'inputPayload', description: '来自 Start 的任务载荷' }),
        createField({ name: 'schoolRules', description: '学校侧规则与敏感词库', required: false })
      ],
      outputs: [
        createField({ name: 'auditScore', type: 'number', description: '机审风险分' }),
        createField({ name: 'normalizedPrompt', description: '清洗后的提示词' })
      ]
    }
  );
  const scriptReview = createFlowNode(
    'script-review',
    { x: 780, y: 80 },
    {
      title: '教师脚本审核',
      owner: '教师',
      inputs: [
        createField({ name: 'normalizedPrompt', description: '输入审核后的提示词' }),
        createField({ name: 'shotPlan', description: '自动拆解后的镜头脚本' })
      ],
      outputs: [createField({ name: 'scriptDecision', description: 'approved / revise / reject' })]
    }
  );
  const videoAudit = createFlowNode(
    'video-audit',
    { x: 1140, y: 80 },
    {
      title: '输出机审',
      outputs: [
        createField({ name: 'riskScore', type: 'number', description: '输出风险分' }),
        createField({ name: 'riskReason', description: '命中的风险说明' })
      ]
    }
  );
  const condition = createFlowNode(
    'condition',
    { x: 1500, y: 80 },
    {
      title: '风险分流',
      outputs: [createField({ name: 'route', description: 'low / medium / high' })]
    }
  );
  const manualReview = createFlowNode(
    'manual-review',
    { x: 1500, y: 390 },
    {
      title: '教师人工复审',
      owner: '教师 / 平台运营',
      settings: {
        mode: '单次',
        threshold: 70,
        queue: 'teacher-review',
        bizType: 'edu-manual-review',
        fallbackAction: '退回修改',
        timeout: 120
      },
      outputs: [createField({ name: 'manualDecision', description: 'approved / rejected / regenerate' })]
    }
  );
  const publish = createFlowNode(
    'publish',
    { x: 1860, y: 230 },
    {
      title: '发布入库',
      outputs: [createField({ name: 'publishResult', description: '写入视频库并同步可见性' })]
    }
  );
  const end = createEndNode('school', 2230);

  const nodes = [start, inputAudit, scriptReview, videoAudit, condition, manualReview, publish, end];
  const edges = [
    createEdge({ source: start.id, target: inputAudit.id, label: '任务进入本校流程' }),
    createEdge({ source: inputAudit.id, target: scriptReview.id, label: '前置通过' }),
    createEdge({ source: scriptReview.id, target: videoAudit.id, label: '教师确认脚本' }),
    createEdge({ source: videoAudit.id, target: condition.id, label: '机审输出风险分' }),
    createEdge({ source: condition.id, target: publish.id, label: '低风险直发' }),
    createEdge({ source: condition.id, target: manualReview.id, label: '中风险转人工', overrides: { animated: true } }),
    createEdge({
      source: condition.id,
      target: end.id,
      label: '高风险拦截',
      overrides: { style: { stroke: '#ef4444', strokeWidth: 2.2 } }
    }),
    createEdge({ source: manualReview.id, target: publish.id, label: '人工通过后入库', overrides: { animated: true } }),
    createEdge({ source: publish.id, target: end.id, label: '回写学校视频库' })
  ];

  return { nodes, edges, focusId: scriptReview.id };
}

function buildPlatformScene() {
  const start = createStartNode('platform');
  const inputAudit = createFlowNode(
    'input-audit',
    { x: 420, y: 230 },
    {
      title: '平台输入审核',
      phaseLabel: '平台基线',
      roleScope: '平台统一入口'
    }
  );
  const videoAudit = createFlowNode(
    'video-audit',
    { x: 780, y: 80 },
    {
      title: '跨模态输出机审',
      phaseLabel: '平台基线'
    }
  );
  const condition = createFlowNode(
    'condition',
    { x: 1140, y: 80 },
    {
      title: '全局风险分流',
      phaseLabel: '平台基线'
    }
  );
  const manualReview = createFlowNode(
    'manual-review',
    { x: 1140, y: 390 },
    {
      title: '平台巡检复审',
      owner: '平台运营',
      phaseLabel: '平台基线',
      roleScope: '平台运营维护'
    }
  );
  const publish = createFlowNode(
    'publish',
    { x: 1500, y: 230 },
    {
      title: '回传学校与审计中心',
      phaseLabel: '平台基线'
    }
  );
  const end = createEndNode('platform', 1860);

  const nodes = [start, inputAudit, videoAudit, condition, manualReview, publish, end];
  const edges = [
    createEdge({ source: start.id, target: inputAudit.id, label: '平台接管任务' }),
    createEdge({ source: inputAudit.id, target: videoAudit.id, label: '进入统一机审' }),
    createEdge({ source: videoAudit.id, target: condition.id, label: '风控判定' }),
    createEdge({ source: condition.id, target: publish.id, label: '低风险自动放行' }),
    createEdge({
      source: condition.id,
      target: manualReview.id,
      label: '中风险平台复核',
      overrides: { animated: true }
    }),
    createEdge({
      source: condition.id,
      target: end.id,
      label: '高风险拦截',
      overrides: { style: { stroke: '#ef4444', strokeWidth: 2.2 } }
    }),
    createEdge({ source: manualReview.id, target: publish.id, label: '平台放行' }),
    createEdge({ source: publish.id, target: end.id, label: '结果同步学校' })
  ];

  return { nodes, edges, focusId: condition.id };
}

function loadScene(scene: SceneKey, silent = false) {
  activeScene.value = scene;

  const graph = scene === 'school' ? buildSchoolScene() : buildPlatformScene();

  flowNodes.value = graph.nodes;
  flowEdges.value = graph.edges;
  selectedNodeId.value = graph.focusId;

  if (!silent) {
    window.$message?.success(`已切换到${scenePresets[scene].label}`);
  }
}

const selectedNode = computed(() => {
  return flowNodes.value.find(item => item.id === selectedNodeId.value) || flowNodes.value[0] || null;
});

const selectedNodeData = computed(() => selectedNode.value?.data || null);

const summaryCards = computed(() => {
  const manualCount = flowNodes.value.filter(item => item.data.kind === 'manual-review').length;
  const conditionCount = flowNodes.value.filter(item => item.data.kind === 'condition').length;

  return [
    {
      label: '当前模板',
      value: scenePresets[activeScene.value].label,
      desc: scenePresets[activeScene.value].audience
    },
    {
      label: '节点总数',
      value: `${flowNodes.value.length}`,
      desc: '包含 Start / End 固定节点与中间可配置节点。'
    },
    {
      label: '分支节点',
      value: `${conditionCount}`,
      desc: '用于演示风控分流、人工复审与拦截逻辑。'
    },
    {
      label: '人工节点',
      value: `${manualCount}`,
      desc: `${schoolStore.activeSchool.shortName} 当前挂载学校规则与平台能力。`
    }
  ];
});

const canOperateSelected = computed(() => {
  if (!selectedNode.value) return false;
  return !selectedNode.value.data.locked;
});

const selectedTemplate = computed(() => getTemplate(selectedTemplateKind.value));

function handleNodeClick(event: { node?: FlowNode }, node?: FlowNode) {
  const nextNode = node || event?.node;

  if (nextNode) {
    selectedNodeId.value = nextNode.id;
  }
}

function addNode() {
  const selected = selectedNode.value;
  const node = createFlowNode(selectedTemplateKind.value, {
    x: (selected?.position.x || 1080) + 340,
    y: selected?.data.kind === 'condition' ? (selected.position.y || 180) + 260 : selected?.position.y || 180
  });

  flowNodes.value = [...flowNodes.value, node];

  if (selected) {
    if (selected.id === 'end-node') {
      flowEdges.value = [
        ...flowEdges.value,
        createEdge({ source: node.id, target: selected.id, label: '接入结束节点' })
      ];
    } else {
      const outgoingEdges = flowEdges.value.filter(edge => edge.source === selected.id);

      if (selected.data.kind !== 'condition' && outgoingEdges.length === 1) {
        const nextEdge = outgoingEdges[0];
        flowEdges.value = flowEdges.value.filter(edge => edge.id !== nextEdge.id);
        flowEdges.value = [
          ...flowEdges.value,
          createEdge({ source: selected.id, target: node.id, label: '插入新节点' }),
          createEdge({
            source: node.id,
            target: nextEdge.target,
            label: typeof nextEdge.label === 'string' ? nextEdge.label : '继续流转'
          })
        ];
      } else {
        flowEdges.value = [...flowEdges.value, createEdge({ source: selected.id, target: node.id, label: '新增节点' })];
      }
    }
  }

  selectedNodeId.value = node.id;
  window.$message?.success(`已新增节点：${node.data.title}`);
}

function cloneNode() {
  if (!selectedNode.value || !canOperateSelected.value) {
    return;
  }

  const source = selectedNode.value;
  const template = getTemplate(source.data.kind as WorkflowTemplate['kind']);
  const cloned = createFlowNode(
    template.kind,
    {
      x: source.position.x + 60,
      y: source.position.y + 220
    },
    {
      title: `${source.data.title} 副本`,
      description: source.data.description,
      stage: source.data.stage,
      owner: source.data.owner,
      badge: source.data.badge,
      accent: source.data.accent,
      roleScope: source.data.roleScope,
      phaseLabel: source.data.phaseLabel,
      inputs: source.data.inputs.map(item => createField({ ...item })),
      outputs: source.data.outputs.map(item => createField({ ...item })),
      settings: { ...source.data.settings }
    }
  );

  flowNodes.value = [...flowNodes.value, cloned];
  selectedNodeId.value = cloned.id;
  window.$message?.success('已复制当前节点');
}

function removeNode() {
  if (!selectedNode.value || !canOperateSelected.value) {
    return;
  }

  const nodeId = selectedNode.value.id;
  const incomingEdges = flowEdges.value.filter(edge => edge.target === nodeId);
  const outgoingEdges = flowEdges.value.filter(edge => edge.source === nodeId);

  flowNodes.value = flowNodes.value.filter(node => node.id !== nodeId);
  flowEdges.value = flowEdges.value.filter(edge => edge.source !== nodeId && edge.target !== nodeId);

  if (incomingEdges.length === 1 && outgoingEdges.length === 1) {
    flowEdges.value = [
      ...flowEdges.value,
      createEdge({
        source: incomingEdges[0].source,
        target: outgoingEdges[0].target,
        label: typeof outgoingEdges[0].label === 'string' ? outgoingEdges[0].label : '继续流转'
      })
    ];
  }

  selectedNodeId.value = 'start-node';
  window.$message?.success('已删除当前节点');
}

function addField(target: 'inputs' | 'outputs') {
  selectedNode.value?.data[target].push(
    createField({
      name: target === 'inputs' ? 'newInput' : 'newOutput',
      description: target === 'inputs' ? '新增输入参数' : '新增输出参数'
    })
  );
}

function removeField(target: 'inputs' | 'outputs', fieldId: string) {
  const list = selectedNode.value?.data[target];

  if (!list) return;

  const index = list.findIndex(item => item.id === fieldId);

  if (index >= 0) {
    list.splice(index, 1);
  }
}

function handleConnect(connection: Connection) {
  if (!connection.source || !connection.target || connection.source === connection.target) {
    return;
  }

  const exists = flowEdges.value.some(edge => edge.source === connection.source && edge.target === connection.target);

  if (exists) {
    return;
  }

  flowEdges.value = [
    ...flowEdges.value,
    createEdge({ source: connection.source, target: connection.target, label: '手动连接' })
  ];
  window.$message?.success('已新增一条连线');
}

function autoLayoutNodes() {
  const nextNodes = flowNodes.value.map(node => ({
    ...node,
    position: { ...node.position }
  }));
  const middleNodes = nextNodes
    .filter(node => !node.data.locked)
    .sort((left, right) => left.position.x - right.position.x || left.position.y - right.position.y);

  let cursor = 420;

  middleNodes.forEach((node, index) => {
    const target = nextNodes.find(item => item.id === node.id);

    if (!target) return;

    target.position = {
      x: cursor,
      y: index % 2 === 0 ? 90 : 390
    };

    cursor += 360;
  });

  const start = nextNodes.find(node => node.id === 'start-node');
  const end = nextNodes.find(node => node.id === 'end-node');

  if (start) {
    start.position = { x: 80, y: 230 };
  }

  if (end) {
    end.position = { x: cursor, y: 230 };
  }

  flowNodes.value = nextNodes;
  window.$message?.success('已自动整理画布布局');
}

function resetWorkflow() {
  loadScene(activeScene.value, true);
  window.$message?.success('已恢复当前模板的默认配置');
}

function saveWorkflow() {
  window.$message?.success('工作流配置已保存到本地 mock，当前用于前端演示。');
}

loadScene(activeScene.value, true);
</script>

<template>
  <div class="flex-col-stretch gap-16px">
    <NCard :bordered="false" class="card-wrapper">
      <div class="flex flex-wrap items-start justify-between gap-16px">
        <div class="max-w-920px">
          <div class="flex items-center gap-10px">
            <h2 class="text-28px text-[#111827] font-700">审核工作流配置</h2>
            <NTag type="warning" :bordered="false" size="small">二期规划</NTag>
            <NTag type="info" :bordered="false" size="small">Vue Flow Demo</NTag>
          </div>
          <p class="mt-8px text-14px text-[#475569] leading-24px">
            这里改成了基于 `vue-flow`
            的可视化审核流程画布，适合演示“学校管理员配置本校链路、平台运营维护平台模板”的二期能力。
            当前所有数据都走前端本地 mock，可编辑、可拖拽、可手动连线，风格上更接近 Coze 类工作流产品。
          </p>
        </div>

        <div class="flex flex-wrap gap-8px">
          <NButton @click="autoLayoutNodes">自动排布</NButton>
          <NButton @click="resetWorkflow">恢复默认</NButton>
          <NButton type="primary" @click="saveWorkflow">保存配置</NButton>
        </div>
      </div>

      <div class="mt-16px flex flex-wrap gap-10px">
        <NButton
          v-for="(scene, key) in scenePresets"
          :key="key"
          strong
          :type="activeScene === key ? 'primary' : 'default'"
          @click="loadScene(key as SceneKey)"
        >
          {{ scene.label }}
        </NButton>
      </div>
    </NCard>

    <NGrid cols="1 s:2 l:4" responsive="screen" :x-gap="16" :y-gap="16">
      <NGi v-for="item in summaryCards" :key="item.label">
        <NCard :bordered="false" class="summary-card card-wrapper">
          <div class="text-13px text-[#64748b]">{{ item.label }}</div>
          <div class="mt-10px text-28px text-[#111827] font-700">{{ item.value }}</div>
          <div class="mt-8px text-13px text-[#64748b] leading-22px">{{ item.desc }}</div>
        </NCard>
      </NGi>
    </NGrid>

    <NCard :bordered="false" class="card-wrapper">
      <div class="flex flex-wrap gap-12px">
        <div class="role-hint role-hint--primary">
          <div class="role-hint__title">学校管理员</div>
          <div class="role-hint__desc">主负责本校审核链路、学校阈值、学校规则接入和人工复审流向。</div>
        </div>
        <div class="role-hint">
          <div class="role-hint__title">平台运营</div>
          <div class="role-hint__desc">负责平台默认模板、跨校基线流程和条件分流策略。</div>
        </div>
        <div class="role-hint">
          <div class="role-hint__title">教师 / 学生</div>
          <div class="role-hint__desc">不开放流程编排，只消费审核结果与既有流程能力。</div>
        </div>
      </div>
    </NCard>

    <div class="workflow-config-layout">
      <div class="workflow-panel">
        <NCard :bordered="false" class="workflow-panel-card card-wrapper">
          <div class="panel-title">模板说明</div>
          <div class="panel-desc">{{ scenePresets[activeScene].description }}</div>
          <div class="scene-badge">
            <span>{{ scenePresets[activeScene].audience }}</span>
            <span>{{ scenePresets[activeScene].highlight }}</span>
          </div>
        </NCard>

        <NCard :bordered="false" class="workflow-panel-card card-wrapper">
          <div class="panel-title">节点库</div>
          <div class="panel-desc">点击卡片可以快速切换要新增的节点类型，再把它插入到当前选中节点后面。</div>

          <div class="template-list">
            <button
              v-for="item in workflowTemplates"
              :key="item.kind"
              type="button"
              class="template-card"
              :class="{ 'template-card--active': selectedTemplateKind === item.kind }"
              @click="selectedTemplateKind = item.kind"
            >
              <div class="template-card__head">
                <span class="template-card__dot" :style="{ background: item.accent }"></span>
                <span class="template-card__title">{{ item.title }}</span>
              </div>
              <div class="template-card__desc">{{ item.description }}</div>
              <div class="template-card__meta">{{ item.phaseLabel }} / {{ item.roleScope }}</div>
            </button>
          </div>

          <NButton class="mt-16px w-full" type="primary" @click="addNode">新增 {{ selectedTemplate.title }}</NButton>
          <NButton class="mt-10px w-full" :disabled="!canOperateSelected" @click="cloneNode">复制当前节点</NButton>
          <NButton class="mt-10px w-full" tertiary type="error" :disabled="!canOperateSelected" @click="removeNode">
            删除当前节点
          </NButton>
        </NCard>
      </div>

      <NCard :bordered="false" class="workflow-canvas-card card-wrapper">
        <div class="mb-12px flex items-center justify-between gap-12px">
          <div>
            <div class="text-16px text-[#0f172a] font-700">审核流程画布</div>
            <div class="mt-4px text-13px text-[#64748b]">
              支持拖拽节点、手动连线、点击节点后直接在画布内编辑配置，适合现场演示“流程可视化配置”的二期方向。
            </div>
          </div>
          <NTag :bordered="false" type="success">当前学校：{{ schoolStore.activeSchool.shortName }}</NTag>
        </div>

        <div class="workflow-canvas-shell">
          <div class="workflow-canvas-stage">
            <VueFlow
              v-model:nodes="flowNodes"
              v-model:edges="flowEdges"
              class="review-flow-canvas"
              :node-types="nodeTypes"
              :default-zoom="0.6"
              :min-zoom="0.3"
              :max-zoom="1.4"
              fit-view-on-init
              @node-click="handleNodeClick"
              @connect="handleConnect"
            >
              <Background :gap="24" pattern-color="#dbe3f0" />
              <Controls position="bottom-right" />
            </VueFlow>
          </div>

          <div class="canvas-inspector">
            <div v-if="selectedNode && selectedNodeData" class="canvas-inspector__inner">
              <div class="canvas-inspector__head">
                <div>
                  <div class="panel-title">节点配置</div>
                  <div class="panel-desc">当前选中：{{ selectedNodeData.title }}</div>
                </div>
                <NTag size="small" :bordered="false" :type="selectedNodeData.locked ? 'default' : 'info'">
                  {{ selectedNodeData.locked ? '固定节点' : '画布内编辑' }}
                </NTag>
              </div>

              <NAlert class="mt-14px" type="info" :bordered="false">
                {{
                  selectedNodeData.locked
                    ? 'Start / End 为固定节点，可编辑字段但不允许删除。'
                    : '当前节点可拖拽、可复制、可删除，也可手动改字段和策略。'
                }}
              </NAlert>

              <NForm class="mt-16px" label-placement="top">
                <NFormItem label="节点名称">
                  <NInput v-model:value="selectedNodeData.title" placeholder="请输入节点名称" />
                </NFormItem>

                <NFormItem label="节点说明">
                  <NInput
                    v-model:value="selectedNodeData.description"
                    type="textarea"
                    :autosize="{ minRows: 3, maxRows: 5 }"
                    placeholder="请输入节点说明"
                  />
                </NFormItem>

                <div class="grid gap-12px md:grid-cols-2">
                  <NFormItem label="负责人">
                    <NInput v-model:value="selectedNodeData.owner" placeholder="负责人" />
                  </NFormItem>
                  <NFormItem label="角色范围">
                    <NInput v-model:value="selectedNodeData.roleScope" placeholder="角色范围" />
                  </NFormItem>
                </div>

                <div class="grid gap-12px md:grid-cols-2">
                  <NFormItem label="执行模式">
                    <NSelect v-model:value="selectedNodeData.settings.mode" :options="modeOptions" />
                  </NFormItem>
                  <NFormItem label="队列">
                    <NSelect v-model:value="selectedNodeData.settings.queue" :options="queueOptions" />
                  </NFormItem>
                </div>

                <div class="grid gap-12px md:grid-cols-2">
                  <NFormItem label="风险阈值">
                    <NInputNumber
                      v-model:value="selectedNodeData.settings.threshold"
                      class="w-full"
                      :min="0"
                      :max="100"
                    />
                  </NFormItem>
                  <NFormItem label="超时时间（秒）">
                    <NInputNumber
                      v-model:value="selectedNodeData.settings.timeout"
                      class="w-full"
                      :min="1"
                      :max="600"
                    />
                  </NFormItem>
                </div>

                <NFormItem label="BizType">
                  <NInput v-model:value="selectedNodeData.settings.bizType" placeholder="请输入 BizType" />
                </NFormItem>

                <NFormItem label="兜底动作">
                  <NSelect v-model:value="selectedNodeData.settings.fallbackAction" :options="fallbackOptions" />
                </NFormItem>
              </NForm>

              <div class="field-section">
                <div class="field-section__head">
                  <div>
                    <div class="panel-title text-15px">输入字段</div>
                    <div class="panel-desc">用于模拟节点输入参数与上下文引用。</div>
                  </div>
                  <NButton size="small" @click="addField('inputs')">新增</NButton>
                </div>

                <div class="field-list">
                  <div v-for="field in selectedNodeData.inputs" :key="field.id" class="field-card">
                    <div class="grid gap-10px md:grid-cols-2">
                      <NInput v-model:value="field.name" placeholder="字段名" />
                      <NSelect v-model:value="field.type" :options="typeOptions" />
                    </div>
                    <NInput v-model:value="field.description" class="mt-10px" placeholder="字段描述" />
                    <div class="mt-10px flex items-center justify-between gap-10px">
                      <NSpace>
                        <NCheckbox v-model:checked="field.required">必填</NCheckbox>
                      </NSpace>
                      <NButton text type="error" @click="removeField('inputs', field.id)">删除</NButton>
                    </div>
                  </div>
                </div>
              </div>

              <div class="field-section">
                <div class="field-section__head">
                  <div>
                    <div class="panel-title text-15px">输出字段</div>
                    <div class="panel-desc">用于演示节点输出给下一步的数据结构。</div>
                  </div>
                  <NButton size="small" @click="addField('outputs')">新增</NButton>
                </div>

                <div class="field-list">
                  <div v-for="field in selectedNodeData.outputs" :key="field.id" class="field-card">
                    <div class="grid gap-10px md:grid-cols-2">
                      <NInput v-model:value="field.name" placeholder="字段名" />
                      <NSelect v-model:value="field.type" :options="typeOptions" />
                    </div>
                    <NInput v-model:value="field.description" class="mt-10px" placeholder="字段描述" />
                    <div class="mt-10px flex items-center justify-between gap-10px">
                      <NSpace>
                        <NCheckbox v-model:checked="field.required">必填</NCheckbox>
                      </NSpace>
                      <NButton text type="error" @click="removeField('outputs', field.id)">删除</NButton>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="workflow-legend mt-12px">
          <span>
            <i class="legend-dot legend-dot--school"></i>
            学校侧节点
          </span>
          <span>
            <i class="legend-dot legend-dot--platform"></i>
            平台基线节点
          </span>
          <span>
            <i class="legend-dot legend-dot--manual"></i>
            人工复审 / 协同节点
          </span>
        </div>
      </NCard>
    </div>
  </div>
</template>

<style scoped>
.workflow-config-layout {
  display: grid;
  grid-template-columns: 320px minmax(0, 1fr);
  gap: 16px;
  align-items: start;
}

.workflow-panel {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.workflow-panel-card {
  position: sticky;
  top: 0;
}

.workflow-canvas-card {
  min-height: 860px;
}

.workflow-canvas-shell {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 380px;
  height: 760px;
  border-radius: 26px;
  overflow: hidden;
  border: 1px solid rgb(148 163 184 / 0.16);
  background:
    radial-gradient(circle at top, rgb(79 70 229 / 0.08), transparent 38%),
    linear-gradient(180deg, #f8fbff 0%, #f8fafc 100%);
}

.workflow-canvas-stage {
  min-width: 0;
}

.review-flow-canvas {
  width: 100%;
  height: 100%;
}

.canvas-inspector {
  min-width: 0;
  padding: 14px;
  border-left: 1px solid rgb(148 163 184 / 0.14);
  background: linear-gradient(180deg, rgb(255 255 255 / 0.86) 0%, rgb(248 250 252 / 0.96) 100%);
  backdrop-filter: blur(12px);
}

.canvas-inspector__inner {
  height: 100%;
  overflow: auto;
  padding: 12px;
  border-radius: 22px;
  background: rgb(255 255 255 / 0.72);
  box-shadow: inset 0 0 0 1px rgb(148 163 184 / 0.14);
}

.canvas-inspector__head {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
}

.panel-title {
  color: #0f172a;
  font-size: 16px;
  font-weight: 800;
}

.panel-desc {
  margin-top: 6px;
  color: #64748b;
  font-size: 13px;
  line-height: 1.7;
}

.scene-badge {
  display: grid;
  gap: 8px;
  margin-top: 16px;
}

.scene-badge span {
  display: inline-flex;
  align-items: center;
  padding: 10px 12px;
  border-radius: 16px;
  background: linear-gradient(180deg, #fff 0%, #f8fafc 100%);
  border: 1px solid rgb(148 163 184 / 0.16);
  color: #334155;
  font-size: 13px;
}

.template-list {
  display: grid;
  gap: 12px;
  margin-top: 16px;
}

.template-card {
  padding: 14px;
  border: 1px solid rgb(148 163 184 / 0.16);
  border-radius: 20px;
  background: linear-gradient(180deg, #fff 0%, #fbfdff 100%);
  text-align: left;
  transition:
    transform 0.18s ease,
    box-shadow 0.18s ease,
    border-color 0.18s ease;
}

.template-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 16px 44px rgb(15 23 42 / 0.08);
}

.template-card--active {
  border-color: rgb(79 70 229 / 0.35);
  box-shadow: 0 0 0 2px rgb(99 102 241 / 0.12);
}

.template-card__head {
  display: flex;
  align-items: center;
  gap: 10px;
}

.template-card__dot {
  width: 10px;
  height: 10px;
  border-radius: 999px;
}

.template-card__title {
  color: #0f172a;
  font-size: 15px;
  font-weight: 700;
}

.template-card__desc {
  margin-top: 10px;
  color: #475569;
  font-size: 13px;
  line-height: 1.7;
}

.template-card__meta {
  margin-top: 10px;
  color: #64748b;
  font-size: 12px;
  font-weight: 600;
}

.workflow-legend {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  color: #475569;
  font-size: 12px;
  font-weight: 600;
}

.legend-dot {
  display: inline-flex;
  width: 10px;
  height: 10px;
  margin-right: 6px;
  border-radius: 999px;
}

.legend-dot--school {
  background: #8b5cf6;
}

.legend-dot--platform {
  background: #2563eb;
}

.legend-dot--manual {
  background: #f59e0b;
}

.role-hint {
  min-width: 0;
  flex: 1 1 280px;
  padding: 16px 18px;
  border-radius: 18px;
  background: linear-gradient(180deg, #fff 0%, #fbfdff 100%);
  border: 1px solid rgb(148 163 184 / 0.16);
}

.role-hint--primary {
  background: linear-gradient(135deg, rgb(79 70 229 / 0.08), rgb(59 130 246 / 0.05));
  border-color: rgb(79 70 229 / 0.2);
}

.role-hint__title {
  color: #0f172a;
  font-size: 15px;
  font-weight: 800;
}

.role-hint__desc {
  margin-top: 8px;
  color: #475569;
  font-size: 13px;
  line-height: 1.7;
}

.field-section {
  margin-top: 20px;
  padding-top: 18px;
  border-top: 1px solid rgb(226 232 240 / 0.8);
}

.field-section__head {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
}

.field-list {
  display: grid;
  gap: 12px;
  margin-top: 14px;
}

.field-card {
  padding: 14px;
  border-radius: 18px;
  background: linear-gradient(180deg, #ffffff 0%, #f8fafc 100%);
  border: 1px solid rgb(148 163 184 / 0.14);
}

:deep(.vue-flow__controls) {
  box-shadow: 0 16px 38px rgb(15 23 42 / 0.12);
  border-radius: 18px;
  overflow: hidden;
  border: 1px solid rgb(148 163 184 / 0.16);
}

:deep(.vue-flow__controls-button) {
  width: 38px;
  height: 38px;
  background: rgb(255 255 255 / 0.96);
  border-bottom: 1px solid rgb(226 232 240 / 0.9);
}

:deep(.vue-flow__edge-path) {
  stroke-linecap: round;
}

@media (width <= 1480px) {
  .workflow-config-layout {
    grid-template-columns: 1fr;
  }

  .workflow-panel-card {
    position: relative;
  }

  .workflow-canvas-shell {
    grid-template-columns: 1fr;
    height: auto;
  }

  .workflow-canvas-stage {
    height: 620px;
  }

  .canvas-inspector {
    border-left: 0;
    border-top: 1px solid rgb(148 163 184 / 0.14);
  }
}
</style>
