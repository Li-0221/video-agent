<script setup lang="ts">
import { computed } from 'vue';
import { Handle, Position } from '@vue-flow/core';
import type { WorkflowNodeData } from './types';

const props = defineProps<{
  data: WorkflowNodeData;
  selected?: boolean;
}>();

const isStart = computed(() => props.data.kind === 'start');
const isEnd = computed(() => props.data.kind === 'end');
const isCondition = computed(() => props.data.kind === 'condition');
</script>

<template>
  <div class="workflow-node" :class="{ 'workflow-node--selected': selected, 'workflow-node--locked': data.locked }">
    <Handle v-if="!isStart" type="target" :position="Position.Left" class="workflow-node__handle" />

    <div class="workflow-node__stripe" :style="{ background: data.accent }"></div>

    <div class="workflow-node__body">
      <div class="workflow-node__meta">
        <span class="workflow-node__stage">{{ data.stage }}</span>
        <span class="workflow-node__phase">{{ data.phaseLabel }}</span>
      </div>

      <div class="workflow-node__title-row">
        <div class="workflow-node__title">{{ data.title }}</div>
        <span class="workflow-node__badge" :style="{ color: data.accent, background: `${data.accent}14` }">
          {{ data.badge }}
        </span>
      </div>

      <div class="workflow-node__desc">{{ data.description }}</div>

      <div class="workflow-node__footer">
        <span>负责人：{{ data.owner }}</span>
        <span>{{ data.roleScope }}</span>
      </div>

      <div v-if="isCondition" class="workflow-node__condition-tip">
        支持多条分支线，适合演示风险分流与人工复审兜底。
      </div>
    </div>

    <Handle v-if="!isEnd" type="source" :position="Position.Right" class="workflow-node__handle" />
  </div>
</template>

<style scoped>
.workflow-node {
  position: relative;
  display: flex;
  width: 320px;
  min-height: 168px;
  border-radius: 24px;
  background: linear-gradient(180deg, rgb(255 255 255 / 0.98) 0%, rgb(248 250 252 / 0.96) 100%);
  border: 1px solid rgb(148 163 184 / 0.18);
  box-shadow: 0 18px 60px rgb(15 23 42 / 0.08);
  overflow: hidden;
  transition:
    transform 0.18s ease,
    box-shadow 0.18s ease,
    border-color 0.18s ease;
}

.workflow-node:hover {
  transform: translateY(-2px);
  box-shadow: 0 24px 70px rgb(15 23 42 / 0.12);
}

.workflow-node--selected {
  border-color: rgb(79 70 229 / 0.45);
  box-shadow:
    0 0 0 2px rgb(99 102 241 / 0.18),
    0 24px 70px rgb(79 70 229 / 0.14);
}

.workflow-node--locked {
  background: linear-gradient(180deg, #fff 0%, #f8fafc 100%);
}

.workflow-node__stripe {
  width: 8px;
  flex: 0 0 auto;
}

.workflow-node__body {
  flex: 1;
  padding: 18px 20px 16px;
}

.workflow-node__meta {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  font-size: 12px;
}

.workflow-node__stage {
  color: #475569;
  font-weight: 700;
}

.workflow-node__phase {
  display: inline-flex;
  align-items: center;
  padding: 4px 10px;
  border-radius: 999px;
  color: #6366f1;
  background: rgb(99 102 241 / 0.09);
  font-weight: 600;
}

.workflow-node__title-row {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 10px;
  margin-top: 14px;
}

.workflow-node__title {
  font-size: 20px;
  line-height: 1.2;
  color: #0f172a;
  font-weight: 800;
}

.workflow-node__badge {
  display: inline-flex;
  align-items: center;
  padding: 5px 10px;
  border-radius: 999px;
  font-size: 12px;
  font-weight: 700;
  white-space: nowrap;
}

.workflow-node__desc {
  margin-top: 12px;
  color: #475569;
  font-size: 13px;
  line-height: 1.7;
}

.workflow-node__footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  margin-top: 14px;
  color: #64748b;
  font-size: 12px;
}

.workflow-node__condition-tip {
  margin-top: 12px;
  padding: 8px 10px;
  border-radius: 14px;
  background: rgb(20 184 166 / 0.1);
  color: #0f766e;
  font-size: 12px;
  line-height: 1.5;
}

:deep(.workflow-node__handle) {
  width: 12px;
  height: 12px;
  border: 2px solid #fff;
  background: #4f46e5;
  box-shadow: 0 0 0 6px rgb(99 102 241 / 0.12);
}
</style>
