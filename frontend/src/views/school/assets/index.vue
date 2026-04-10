<script setup lang="ts">
import { computed } from 'vue';
import { useSchoolStore } from '@/store/modules/school';
import { knowledgeTagGroups, schoolAssets, schoolPresets, schoolWatermarkPresets } from '@/mock/video-platform';

const schoolStore = useSchoolStore();

const visibleAssets = computed(() => schoolAssets.filter(item => item.schoolId === schoolStore.activeSchool.id));
const visibleWatermarks = computed(() =>
  schoolWatermarkPresets.filter(item => item.schoolId === schoolStore.activeSchool.id)
);
const schoolTagGroups = computed(() => knowledgeTagGroups.filter(item => item.scope === '学校'));

function notify(action: string) {
  window.$message?.success(`${action} 已保存到学校级 mock 配置。`);
}
</script>

<template>
  <div class="flex-col-stretch gap-16px">
    <NCard :bordered="false" class="card-wrapper">
      <div class="flex flex-wrap items-center justify-between gap-12px">
        <div>
          <h2 class="text-28px text-[#111827] font-700">学校素材与标签</h2>
          <p class="mt-8px text-14px text-[#475569] leading-24px">
            当前学校为
            {{ schoolStore.activeSchool.schoolName }}。学校管理员在这里维护校徽、校训、校园背景图和本校红色资源标签，
            所有学校资产都按学校 ID 隔离，不允许跨校串用。
          </p>
        </div>
        <div class="flex flex-wrap gap-8px">
          <NButton @click="notify('上传校园背景图')">上传背景图</NButton>
          <NButton type="primary" ghost @click="notify('更新水印样式')">更新水印样式</NButton>
        </div>
      </div>
    </NCard>

    <NGrid cols="1 xl:2" responsive="screen" :x-gap="16" :y-gap="16">
      <NGi>
        <NCard title="学校品牌总览" :bordered="false" class="card-wrapper">
          <div class="brand-panel">
            <div class="brand-panel__meta">
              <div class="text-12px text-[#64748b] tracking-[0.18em] uppercase">School Identity</div>
              <h3 class="mt-8px text-24px text-[#111827] font-700">{{ schoolStore.activeSchool.systemName }}</h3>
              <p class="mt-10px text-13px text-[#475569] leading-22px">{{ schoolStore.activeSchool.slogan }}</p>
            </div>
            <div class="brand-chip-wrap">
              <span class="brand-chip" :style="{ backgroundColor: schoolStore.activeSchool.theme.primary }">主色</span>
              <span class="brand-chip" :style="{ backgroundColor: schoolStore.activeSchool.theme.secondary }">
                辅色
              </span>
              <span
                class="brand-chip brand-chip--dark"
                :style="{ backgroundColor: schoolStore.activeSchool.theme.accent }"
              >
                强调色
              </span>
            </div>
          </div>
        </NCard>
      </NGi>

      <NGi>
        <NCard title="学校预设策略" :bordered="false" class="card-wrapper">
          <div class="grid gap-12px">
            <div v-for="item in schoolPresets" :key="item.id" class="asset-card">
              <div class="flex items-center justify-between gap-10px">
                <div class="text-15px text-[#111827] font-600">{{ item.name }}</div>
                <NTag size="small" :bordered="false">{{ item.watermarkMode }}</NTag>
              </div>
              <p class="mt-8px text-13px text-[#475569] leading-22px">{{ item.desc }}</p>
            </div>
          </div>
        </NCard>
      </NGi>
    </NGrid>

    <NGrid cols="1 xl:2" responsive="screen" :x-gap="16" :y-gap="16">
      <NGi>
        <NCard title="学校素材库" :bordered="false" class="card-wrapper">
          <div class="theme-summary">
            <div>
              <div class="theme-summary__label">系统名称</div>
              <div class="theme-summary__value">{{ schoolStore.activeSchool.systemName }}</div>
            </div>
            <div>
              <div class="theme-summary__label">水印文案</div>
              <div class="theme-summary__value">{{ schoolStore.activeSchool.watermarkText }}</div>
            </div>
          </div>
          <div class="grid mt-12px gap-12px">
            <div v-for="item in visibleAssets" :key="item.id" class="asset-card">
              <div class="flex items-center justify-between gap-10px">
                <div>
                  <div class="text-15px text-[#111827] font-600">{{ item.title }}</div>
                  <div class="mt-4px text-12px text-[#64748b]">{{ item.type }}</div>
                </div>
                <NTag size="small" :bordered="false" type="info">{{ item.usage }}</NTag>
              </div>
              <p class="mt-8px text-13px text-[#475569] leading-22px">{{ item.description }}</p>
              <div class="mt-8px text-12px text-[#64748b]">{{ item.source }} · {{ item.access }}</div>
            </div>
            <NEmpty v-if="!visibleAssets.length" description="当前学校还没有配置素材" />
          </div>
        </NCard>
      </NGi>

      <NGi>
        <div class="flex-col-stretch gap-16px">
          <NCard title="水印与校园背景方案" :bordered="false" class="card-wrapper">
            <div class="grid gap-12px">
              <div v-for="item in visibleWatermarks" :key="item.id" class="asset-card">
                <div class="flex items-center justify-between gap-10px">
                  <div class="text-15px text-[#111827] font-600">{{ item.name }}</div>
                  <NTag size="small" :bordered="false" type="success">{{ item.mode }}</NTag>
                </div>
                <div class="grid mt-10px gap-6px text-12px text-[#64748b]">
                  <div>位置：{{ item.position }}</div>
                  <div>透明度：{{ item.opacity }}</div>
                  <div>适用场景：{{ item.sceneUsage }}</div>
                </div>
                <p class="mt-8px text-13px text-[#475569] leading-22px">{{ item.desc }}</p>
              </div>
            </div>
          </NCard>

          <NCard title="学校自定义标签" :bordered="false" class="card-wrapper">
            <div class="grid gap-12px">
              <div v-for="group in schoolTagGroups" :key="group.id" class="asset-card">
                <div class="flex items-center justify-between gap-10px">
                  <div class="text-15px text-[#111827] font-600">{{ group.name }}</div>
                  <NTag size="small" :bordered="false" type="warning">{{ group.owner }}</NTag>
                </div>
                <p class="mt-8px text-13px text-[#475569] leading-22px">{{ group.description }}</p>
                <div class="mt-10px flex flex-wrap gap-8px">
                  <span v-for="tag in group.tags" :key="tag" class="tag-pill">{{ tag }}</span>
                </div>
              </div>
            </div>
          </NCard>
        </div>
      </NGi>
    </NGrid>
  </div>
</template>

<style scoped>
.brand-panel,
.theme-summary {
  display: grid;
  gap: 12px;
  padding: 16px;
  border-radius: 18px;
  background: #f8fafc;
  border: 1px solid rgb(148 163 184 / 0.16);
}

.brand-chip-wrap {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.brand-chip {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 72px;
  padding: 8px 14px;
  border-radius: 9999px;
  color: #fff;
  font-size: 12px;
  font-weight: 700;
}

.brand-chip--dark {
  color: #111827;
}

.theme-summary {
  grid-template-columns: repeat(2, minmax(0, 1fr));
}

.theme-summary__label {
  font-size: 12px;
  color: #64748b;
}

.theme-summary__value {
  margin-top: 6px;
  font-size: 14px;
  color: #111827;
  font-weight: 600;
}

.asset-card {
  padding: 16px;
  border-radius: 18px;
  border: 1px solid rgb(148 163 184 / 0.16);
  background: #fff;
}

.tag-pill {
  display: inline-flex;
  align-items: center;
  padding: 6px 12px;
  border-radius: 9999px;
  background: #f8fafc;
  color: #334155;
  font-size: 12px;
  font-weight: 600;
  border: 1px solid rgb(148 163 184 / 0.18);
}
</style>
