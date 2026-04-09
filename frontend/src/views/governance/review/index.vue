<script setup lang="ts">
import { computed, ref } from 'vue';
import { reviewCases } from '@/mock/video-platform';

const activeReviewId = ref(reviewCases[0].id);
const activeModuleKey = ref<'text' | 'image' | 'video' | 'audio'>('video');

const activeReview = computed(() => reviewCases.find(item => item.id === activeReviewId.value) || reviewCases[0]);
const activeModule = computed(
  () => activeReview.value.modules.find(item => item.key === activeModuleKey.value) || activeReview.value.modules[0]
);

function getSeverityType(level: string): NaiveUI.ThemeColor {
  if (level === '高') return 'error';
  if (level === '中') return 'warning';
  return 'success';
}

function getSubtitleType(level: string): NaiveUI.ThemeColor {
  if (level === 'block') return 'error';
  if (level === 'warn') return 'warning';
  return 'success';
}

function notify(action: string) {
  window.$message?.success(`${action} 已记录到审核日志。`);
}
</script>

<template>
  <div class="flex-col-stretch gap-16px">
    <NCard :bordered="false" class="card-wrapper">
      <div class="flex flex-wrap items-center justify-between gap-12px">
        <div>
          <h2 class="text-28px text-[#111827] font-700">输出安全复审</h2>
          <p class="mt-8px text-14px text-[#475569] leading-24px">
            集中处理输入拦截、0.6~0.9 置信度复审、0.9 自动拦截，以及历史人物全量教师复核等关键安全规则。
          </p>
        </div>
        <div class="flex flex-wrap gap-8px">
          <NButton @click="notify('退回修改')">退回修改</NButton>
          <NButton type="warning" @click="notify('要求重新生成')">要求重新生成</NButton>
          <NButton type="primary" @click="notify('教师通过')">教师通过</NButton>
        </div>
      </div>
    </NCard>

    <NGrid cols="1 xl:3" responsive="screen" :x-gap="16" :y-gap="16">
      <NGi>
        <NCard title="待处理案例" :bordered="false" class="card-wrapper">
          <div class="flex-col-stretch gap-12px">
            <button
              v-for="item in reviewCases"
              :key="item.id"
              type="button"
              class="review-item"
              :class="{ 'review-item--active': activeReview.id === item.id }"
              @click="activeReviewId = item.id"
            >
              <div class="flex items-center justify-between gap-10px">
                <div class="text-15px text-[#111827] font-600">{{ item.title }}</div>
                <NTag size="small" :bordered="false" :type="getSeverityType(item.severity)">{{ item.severity }}</NTag>
              </div>
              <div class="mt-8px text-13px text-[#64748b] leading-22px">{{ item.machine }}</div>
              <div class="mt-10px flex flex-wrap gap-8px">
                <NTag v-for="tag in item.tags" :key="tag" size="small" :bordered="false">{{ tag }}</NTag>
              </div>
            </button>
          </div>
        </NCard>
      </NGi>

      <NGi span="1 xl:2">
        <NCard :title="activeReview.title" :bordered="false" class="card-wrapper">
          <div class="grid gap-16px">
            <div class="review-summary">
              <div class="grid gap-6px text-13px text-[#475569]">
                <div>申请单位：{{ activeReview.school }}</div>
                <div>申请人：{{ activeReview.applicant }}</div>
                <div>机审结论：{{ activeReview.machine }}</div>
              </div>
              <p class="mt-10px text-13px text-[#334155] leading-22px">{{ activeReview.notes }}</p>
            </div>

            <NTabs v-model:value="activeModuleKey" type="segment">
              <NTabPane v-for="item in activeReview.modules" :key="item.key" :name="item.key" :tab="item.title">
                <div class="module-card">
                  <p class="text-13px text-[#475569] leading-22px">{{ activeModule.summary }}</p>
                  <ul class="module-points">
                    <li v-for="point in activeModule.points" :key="point">{{ point }}</li>
                  </ul>
                </div>
              </NTabPane>
            </NTabs>

            <NGrid cols="1 l:2" responsive="screen" :x-gap="16" :y-gap="16">
              <NGi>
                <div class="detail-block">
                  <div class="text-15px text-[#111827] font-600">关键帧提醒</div>
                  <div class="grid mt-12px gap-10px">
                    <div
                      v-for="frame in activeReview.keyframes"
                      :key="`${frame.time}-${frame.label}`"
                      class="frame-row"
                    >
                      <div class="text-13px text-[#111827] font-600">{{ frame.time }} · {{ frame.label }}</div>
                      <div class="mt-4px text-12px text-[#64748b]">{{ frame.note }}</div>
                    </div>
                  </div>
                </div>
              </NGi>
              <NGi>
                <div class="detail-block">
                  <div class="text-15px text-[#111827] font-600">字幕风险片段</div>
                  <div class="grid mt-12px gap-10px">
                    <div v-for="subtitle in activeReview.subtitleSegments" :key="subtitle.time" class="frame-row">
                      <div class="flex items-center justify-between gap-8px">
                        <div class="text-13px text-[#111827] font-600">{{ subtitle.time }}</div>
                        <NTag size="small" :bordered="false" :type="getSubtitleType(subtitle.level)">
                          {{ subtitle.level }}
                        </NTag>
                      </div>
                      <div class="mt-4px text-12px text-[#64748b]">{{ subtitle.text }}</div>
                    </div>
                  </div>
                </div>
              </NGi>
            </NGrid>

            <div class="detail-block">
              <div class="text-15px text-[#111827] font-600">审核历史</div>
              <NTimeline class="mt-12px">
                <NTimelineItem v-for="item in activeReview.history" :key="`${item.time}-${item.title}`" type="info">
                  <template #header>{{ item.title }}</template>
                  <template #default>
                    <div>{{ item.desc }}</div>
                    <div class="timeline-time">{{ item.time }}</div>
                  </template>
                </NTimelineItem>
              </NTimeline>
            </div>
          </div>
        </NCard>
      </NGi>
    </NGrid>
  </div>
</template>

<style scoped>
.review-item,
.review-summary,
.module-card,
.detail-block,
.frame-row {
  border-radius: 18px;
  border: 1px solid rgb(148 163 184 / 0.16);
  background: #fff;
}

.review-item {
  width: 100%;
  padding: 16px;
  text-align: left;
}

.review-item--active {
  border-color: rgb(245 158 11 / 0.4);
  box-shadow: 0 8px 28px rgb(245 158 11 / 0.08);
}

.review-summary,
.module-card,
.detail-block {
  padding: 16px;
  background: #f8fafc;
}

.frame-row {
  padding: 12px;
}

.module-points {
  margin: 12px 0 0;
  padding-left: 18px;
  display: grid;
  gap: 8px;
  color: #475569;
  font-size: 13px;
  line-height: 1.8;
}

.timeline-time {
  margin-top: 8px;
  font-size: 12px;
  color: #94a3b8;
}
</style>
