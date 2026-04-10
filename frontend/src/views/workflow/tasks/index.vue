<script setup lang="ts">
import { computed, ref } from 'vue';
import { useSchoolStore } from '@/store/modules/school';
import { useDemoAccess } from '@/hooks/business/demo-access';
import { videoTasks } from '@/mock/video-platform';

const schoolStore = useSchoolStore();
const { hasButton, isPlatformOps, isStudent } = useDemoAccess();

const statusFilter = ref<'all' | 'draft' | 'generating' | 'review' | 'approved' | 'blocked'>('all');

const scopedTasks = computed(() =>
  isPlatformOps.value ? videoTasks : videoTasks.filter(item => item.schoolId === schoolStore.activeSchool.id)
);

const filteredTasks = computed(() => {
  const source = scopedTasks.value;

  if (statusFilter.value === 'all') {
    return source;
  }

  return source.filter(item => item.status === statusFilter.value);
});

const activeTaskId = ref(filteredTasks.value[0]?.id || '');

const activeTask = computed(
  () => filteredTasks.value.find(item => item.id === activeTaskId.value) || filteredTasks.value[0]
);

function getStatusType(status: string): NaiveUI.ThemeColor {
  const colorMap: Record<string, NaiveUI.ThemeColor> = {
    draft: 'default',
    generating: 'info',
    review: 'warning',
    approved: 'success',
    blocked: 'error'
  };

  return colorMap[status] || 'default';
}

function setActiveTask(id: string) {
  activeTaskId.value = id;
}

function notify(action: string) {
  window.$message?.success(`${action} 已加入 mock 队列。`);
}
</script>

<template>
  <div class="flex-col-stretch gap-16px">
    <NCard :bordered="false" class="card-wrapper">
      <div class="flex flex-wrap items-center justify-between gap-12px">
        <div>
          <h2 class="text-28px text-[#111827] font-700">生成队列与微调中心</h2>
          <p class="mt-8px text-14px text-[#475569] leading-24px">
            当前展示 {{ isPlatformOps ? '跨校总览' : `${schoolStore.activeSchool.shortName} 的任务队列` }}，
            按角色控制“重提、重配音、重绘、送审”等按钮的可见性。
          </p>
        </div>
        <NRadioGroup v-model:value="statusFilter" name="statusFilter">
          <NSpace>
            <NRadioButton value="all">全部</NRadioButton>
            <NRadioButton value="generating">生成中</NRadioButton>
            <NRadioButton value="review">待复审</NRadioButton>
            <NRadioButton value="blocked">已拦截</NRadioButton>
          </NSpace>
        </NRadioGroup>
      </div>
    </NCard>

    <NGrid cols="1 xl:3" responsive="screen" :x-gap="16" :y-gap="16">
      <NGi>
        <NCard title="任务队列" :bordered="false" class="card-wrapper">
          <div class="flex-col-stretch gap-12px">
            <button
              v-for="item in filteredTasks"
              :key="item.id"
              type="button"
              class="task-list-item"
              :class="{ 'task-list-item--active': activeTask?.id === item.id }"
              @click="setActiveTask(item.id)"
            >
              <div class="flex items-center justify-between gap-10px text-left">
                <div class="text-15px text-[#111827] font-600">{{ item.title }}</div>
                <NTag size="small" :bordered="false" :type="getStatusType(item.status)">{{ item.status }}</NTag>
              </div>
              <div class="mt-8px text-left text-13px text-[#64748b] leading-22px">{{ item.summary }}</div>
              <div class="mt-10px text-left text-12px text-[#475569]">{{ item.queue }}</div>
            </button>
          </div>
        </NCard>
      </NGi>

      <NGi span="1 xl:2">
        <NCard v-if="activeTask" :title="activeTask.title" :bordered="false" class="card-wrapper">
          <div class="grid gap-16px">
            <div class="rounded-20px bg-[#f8fafc] px-18px py-16px">
              <div class="flex flex-wrap items-center justify-between gap-12px">
                <div class="grid gap-6px text-13px text-[#475569]">
                  <div>发起角色：{{ activeTask.creatorRole }}</div>
                  <div>负责人：{{ activeTask.owner }}</div>
                  <div>学段：{{ activeTask.gradeBand }}</div>
                  <div>输出规格：{{ activeTask.output }}</div>
                </div>
                <div class="max-w-260px w-full">
                  <div class="mb-8px text-13px text-[#64748b]">任务进度</div>
                  <NProgress type="line" :percentage="activeTask.progress" :show-indicator="true" />
                </div>
              </div>
            </div>

            <div class="grid gap-10px">
              <div v-for="step in activeTask.steps" :key="step.name" class="step-card">
                <div class="flex items-center justify-between gap-10px">
                  <div class="text-14px text-[#111827] font-600">{{ step.name }}</div>
                  <NTag
                    size="small"
                    :bordered="false"
                    :type="getStatusType(step.status === 'active' ? activeTask.status : step.status)"
                  >
                    {{ step.status }}
                  </NTag>
                </div>
              </div>
            </div>

            <div class="grid gap-10px md:grid-cols-2">
              <div class="detail-card">
                <div class="text-14px text-[#111827] font-600">排队与配额</div>
                <p class="mt-8px text-13px text-[#475569] leading-22px">{{ activeTask.queue }}</p>
                <p class="mt-6px text-13px text-[#475569] leading-22px">{{ activeTask.quota }}</p>
              </div>
              <div class="detail-card">
                <div class="text-14px text-[#111827] font-600">风险摘要</div>
                <p class="mt-8px text-13px text-[#475569] leading-22px">{{ activeTask.riskSummary }}</p>
              </div>
            </div>

            <div class="flex flex-wrap gap-12px">
              <NButton v-if="hasButton('scene:voice-regenerate')" @click="notify('仅重合成配音')">仅重合成配音</NButton>
              <NButton
                v-if="hasButton('scene:visual-regenerate')"
                type="primary"
                ghost
                @click="notify('重绘画面并重配音')"
              >
                重绘画面并重配音
              </NButton>
              <NButton v-if="hasButton('review:approve')" type="warning" @click="notify('送入输出复审')">
                送入输出复审
              </NButton>
              <NButton
                v-if="isStudent && activeTask.status === 'blocked' && hasButton('task:resubmit')"
                type="error"
                ghost
                @click="notify('修改后重新提交')"
              >
                修改后重新提交
              </NButton>
            </div>
          </div>
        </NCard>
      </NGi>
    </NGrid>
  </div>
</template>

<style scoped>
.task-list-item {
  width: 100%;
  padding: 16px;
  border-radius: 18px;
  border: 1px solid rgb(148 163 184 / 0.18);
  background: #fff;
  transition: all 0.2s ease;
}

.task-list-item--active {
  border-color: rgb(37 99 235 / 0.4);
  box-shadow: 0 8px 30px rgb(37 99 235 / 0.08);
  transform: translateY(-1px);
}

.step-card,
.detail-card {
  padding: 14px 16px;
  border-radius: 16px;
  background: #f8fafc;
  border: 1px solid rgb(148 163 184 / 0.16);
}
</style>
