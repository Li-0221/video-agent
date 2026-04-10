<script setup lang="ts">
import { computed, ref } from 'vue';
import { useSchoolStore } from '@/store/modules/school';
import { useDemoAccess } from '@/hooks/business/demo-access';
import { libraryAuditSnapshots, publishItems, reviewCases, videoTasks } from '@/mock/video-platform';

const schoolStore = useSchoolStore();
const { hasButton, isPlatformOps } = useDemoAccess();

const visiblePublishItems = computed(() =>
  isPlatformOps.value ? publishItems : publishItems.filter(item => item.schoolId === schoolStore.activeSchool.id)
);

const activePublishId = ref(visiblePublishItems.value[0]?.id || '');

const activePublish = computed(
  () => visiblePublishItems.value.find(item => item.id === activePublishId.value) || visiblePublishItems.value[0]
);
const linkedTask = computed(() => videoTasks.find(item => item.id === activePublish.value?.taskId));
const linkedReview = computed(() => reviewCases.find(item => item.taskId === activePublish.value?.taskId));
const activeSnapshot = computed(() =>
  activePublish.value ? libraryAuditSnapshots[activePublish.value.taskId] : undefined
);

function getPublishType(status: string): NaiveUI.ThemeColor {
  if (status === 'published') return 'success';
  if (status === 'review') return 'warning';
  return 'default';
}

function notify(action: string) {
  window.$message?.success(`${action} 已写入审计记录。`);
}
</script>

<template>
  <div class="flex-col-stretch gap-16px">
    <NCard :bordered="false" class="card-wrapper">
      <div class="flex flex-wrap items-center justify-between gap-12px">
        <div>
          <h2 class="text-28px text-[#111827] font-700">视频库与审计中心</h2>
          <p class="mt-8px text-14px text-[#475569] leading-24px">
            {{
              isPlatformOps
                ? '当前为跨校视频库巡检视角。'
                : `当前仅展示 ${schoolStore.activeSchool.shortName} 的视频库数据。`
            }}
            通过的视频进入教师视频库；学生发起的视频只有在教师确认后才对学生可见，同时所有关键动作都保留审计链路。
          </p>
        </div>
        <div class="flex flex-wrap gap-8px">
          <NButton v-if="hasButton('record:view')" @click="notify('导出 MP4')">导出 MP4</NButton>
          <NButton v-if="hasButton('video:publish')" type="primary" ghost @click="notify('同步学生可见状态')">
            同步学生可见状态
          </NButton>
        </div>
      </div>
    </NCard>

    <NGrid cols="1 xl:3" responsive="screen" :x-gap="16" :y-gap="16">
      <NGi>
        <NCard title="视频库列表" :bordered="false" class="card-wrapper">
          <div v-if="visiblePublishItems.length" class="flex-col-stretch gap-12px">
            <button
              v-for="item in visiblePublishItems"
              :key="item.id"
              type="button"
              class="publish-item"
              :class="{ 'publish-item--active': activePublish.id === item.id }"
              @click="activePublishId = item.id"
            >
              <div class="flex items-center justify-between gap-10px">
                <div class="text-15px text-[#111827] font-600">{{ item.title }}</div>
                <NTag size="small" :bordered="false" :type="getPublishType(item.status)">{{ item.status }}</NTag>
              </div>
              <div class="mt-8px text-13px text-[#64748b]">{{ item.visibility }}</div>
              <div class="mt-8px text-12px text-[#475569]">{{ item.version }} · {{ item.updatedAt }}</div>
            </button>
          </div>
          <NEmpty v-else description="当前学校暂无视频库记录" />
        </NCard>
      </NGi>

      <NGi span="1 xl:2">
        <NCard v-if="activePublish" :title="activePublish.title" :bordered="false" class="card-wrapper">
          <div class="grid gap-16px">
            <div class="grid gap-12px md:grid-cols-2">
              <div class="library-block">
                <div class="text-14px text-[#111827] font-600">发布信息</div>
                <div class="grid mt-8px gap-6px text-13px text-[#475569]">
                  <div>版本：{{ activePublish.version }}</div>
                  <div>可见范围：{{ activePublish.visibility }}</div>
                  <div>操作人：{{ activePublish.operator }}</div>
                  <div>更新时间：{{ activePublish.updatedAt }}</div>
                </div>
              </div>
              <div v-if="linkedTask" class="library-block">
                <div class="text-14px text-[#111827] font-600">任务关联</div>
                <div class="grid mt-8px gap-6px text-13px text-[#475569]">
                  <div>任务标题：{{ linkedTask.title }}</div>
                  <div>发起角色：{{ linkedTask.creatorRole }}</div>
                  <div>学段：{{ linkedTask.gradeBand }}</div>
                  <div>输出规格：{{ linkedTask.output }}</div>
                </div>
              </div>
            </div>

            <div v-if="activeSnapshot" class="library-block">
              <div class="text-14px text-[#111827] font-600">课堂使用与留存策略</div>
              <div class="grid mt-12px gap-10px md:grid-cols-2">
                <div class="snapshot-item">
                  <div class="snapshot-item__label">课堂使用方式</div>
                  <div class="snapshot-item__value">{{ activeSnapshot.classroomUse }}</div>
                </div>
                <div class="snapshot-item">
                  <div class="snapshot-item__label">留存策略</div>
                  <div class="snapshot-item__value">{{ activeSnapshot.retention }}</div>
                </div>
              </div>
              <div class="mt-12px flex flex-wrap gap-8px">
                <span v-for="item in activeSnapshot.restrictions" :key="item" class="rule-pill">{{ item }}</span>
              </div>
            </div>

            <div class="library-block">
              <div class="text-14px text-[#111827] font-600">审计动作流</div>
              <NTimeline class="mt-12px">
                <NTimelineItem
                  v-for="item in activeSnapshot?.auditTrail || []"
                  :key="`${item.time}-${item.title}`"
                  type="info"
                >
                  <template #header>{{ item.title }}</template>
                  <template #default>
                    <div>{{ item.desc }}</div>
                    <div class="timeline-time">{{ item.time }}</div>
                  </template>
                </NTimelineItem>
              </NTimeline>
            </div>

            <div v-if="linkedReview" class="library-block">
              <div class="text-14px text-[#111827] font-600">关联复审结论</div>
              <p class="mt-8px text-13px text-[#475569] leading-22px">{{ linkedReview.notes }}</p>
            </div>
          </div>
        </NCard>
        <NCard v-else :bordered="false" class="card-wrapper">
          <NEmpty description="当前学校暂无可查看的视频发布详情" />
        </NCard>
      </NGi>
    </NGrid>
  </div>
</template>

<style scoped>
.publish-item,
.library-block,
.snapshot-item {
  padding: 16px;
  border-radius: 18px;
  border: 1px solid rgb(148 163 184 / 0.16);
  background: #fff;
}

.publish-item {
  width: 100%;
  text-align: left;
}

.publish-item--active {
  border-color: rgb(34 197 94 / 0.32);
  box-shadow: 0 8px 28px rgb(34 197 94 / 0.08);
}

.library-block,
.snapshot-item {
  background: #f8fafc;
}

.snapshot-item__label {
  font-size: 12px;
  color: #64748b;
}

.snapshot-item__value {
  margin-top: 6px;
  font-size: 13px;
  line-height: 1.8;
  color: #334155;
}

.rule-pill {
  display: inline-flex;
  align-items: center;
  padding: 6px 12px;
  border-radius: 9999px;
  background: #fff;
  color: #334155;
  font-size: 12px;
  font-weight: 600;
  border: 1px solid rgb(148 163 184 / 0.18);
}

.timeline-time {
  margin-top: 8px;
  font-size: 12px;
  color: #94a3b8;
}
</style>
