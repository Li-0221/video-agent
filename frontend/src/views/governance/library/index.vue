<script setup lang="ts">
import { computed, ref } from 'vue';
import { publishItems, reviewCases, videoTasks } from '@/mock/video-platform';

const activePublishId = ref(publishItems[0].id);

const activePublish = computed(() => publishItems.find(item => item.id === activePublishId.value) || publishItems[0]);
const linkedTask = computed(() => videoTasks.find(item => item.id === activePublish.value.taskId));
const linkedReview = computed(() => reviewCases.find(item => item.taskId === activePublish.value.taskId));

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
            通过的视频进入教师视频库；学生发起的视频只有在教师确认后才对学生可见，同时所有关键动作都必须保留审计链路。
          </p>
        </div>
        <div class="flex flex-wrap gap-8px">
          <NButton @click="notify('导出 MP4')">导出 MP4</NButton>
          <NButton type="primary" ghost @click="notify('同步学生可见状态')">同步学生可见状态</NButton>
        </div>
      </div>
    </NCard>

    <NGrid cols="1 xl:3" responsive="screen" :x-gap="16" :y-gap="16">
      <NGi>
        <NCard title="视频库列表" :bordered="false" class="card-wrapper">
          <div class="flex-col-stretch gap-12px">
            <button
              v-for="item in publishItems"
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
        </NCard>
      </NGi>

      <NGi span="1 xl:2">
        <NCard :title="activePublish.title" :bordered="false" class="card-wrapper">
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

            <div class="library-block">
              <div class="text-14px text-[#111827] font-600">审计动作流</div>
              <NTimeline class="mt-12px">
                <NTimelineItem type="info">
                  <template #header>脚本确认完成</template>
                  <template #default>
                    <div>教师完成逐镜审稿，允许进入素材批量生成。</div>
                    <div class="timeline-time">昨天 16:48</div>
                  </template>
                </NTimelineItem>
                <NTimelineItem type="success">
                  <template #header>终审通过</template>
                  <template #default>
                    <div>教师完成完整看片与结果确认，视频进入视频库。</div>
                    <div class="timeline-time">昨天 17:38</div>
                  </template>
                </NTimelineItem>
                <NTimelineItem type="success">
                  <template #header>学生可见同步</template>
                  <template #default>
                    <div>仅学生发起的作品需要这一步；教师发起作品默认进入教师视频库。</div>
                    <div class="timeline-time">今天 09:20</div>
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
      </NGi>
    </NGrid>
  </div>
</template>

<style scoped>
.publish-item,
.library-block {
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

.library-block {
  background: #f8fafc;
}

.timeline-time {
  margin-top: 8px;
  font-size: 12px;
  color: #94a3b8;
}
</style>
