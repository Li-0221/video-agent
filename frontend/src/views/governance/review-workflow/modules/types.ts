export type WorkflowNodeKind =
  | 'start'
  | 'input-audit'
  | 'script-review'
  | 'video-audit'
  | 'manual-review'
  | 'condition'
  | 'publish'
  | 'end';

export type WorkflowFieldType = 'string' | 'number' | 'boolean' | 'array' | 'object';

export interface WorkflowField {
  id: string;
  name: string;
  type: WorkflowFieldType;
  required: boolean;
  source: string;
  description: string;
}

export interface WorkflowNodeSettings {
  mode: string;
  threshold: number;
  queue: string;
  bizType: string;
  fallbackAction: string;
  timeout: number;
}

export interface WorkflowNodeData {
  kind: WorkflowNodeKind;
  title: string;
  description: string;
  stage: string;
  owner: string;
  badge: string;
  accent: string;
  roleScope: string;
  phaseLabel: string;
  locked?: boolean;
  inputs: WorkflowField[];
  outputs: WorkflowField[];
  settings: WorkflowNodeSettings;
}

export interface WorkflowTemplate {
  kind: Exclude<WorkflowNodeKind, 'start' | 'end'>;
  title: string;
  description: string;
  stage: string;
  owner: string;
  badge: string;
  accent: string;
  roleScope: string;
  phaseLabel: string;
  defaultMode: string;
  defaultQueue: string;
  defaultBizType: string;
  defaultFallbackAction: string;
  defaultThreshold: number;
  defaultTimeout: number;
}
