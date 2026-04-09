<script setup lang="ts">
import { schoolAssets, schoolPresets } from '@/mock/video-platform';

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
            学校管理员在这里维护校徽、校训、校园背景图和本校红色资源标签。所有学校资产都按学校 ID 隔离，不允许跨校串用。
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
        <NCard title="学校素材库" :bordered="false" class="card-wrapper">
          <div class="grid gap-12px">
            <div v-for="item in schoolAssets" :key="item.id" class="asset-card">
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
          </div>
        </NCard>
      </NGi>

      <NGi>
        <div class="flex-col-stretch gap-16px">
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

          <NCard title="学校隔离规则" :bordered="false" class="card-wrapper">
            <ul class="asset-list">
              <li>校徽、校训、校园背景和本校红色资源标签均按学校 ID 进行资源隔离。</li>
              <li>教师只能看到本校素材和由本校教师新增的自定义标签。</li>
              <li>平台运营仅维护公共课程大纲标签，不直接覆盖学校个性化素材。</li>
              <li>学生不直接接触资产库，只能透过教师或学校管理员配置后的结果使用。</li>
            </ul>
          </NCard>
        </div>
      </NGi>
    </NGrid>
  </div>
</template>

<style scoped>
.asset-card {
  padding: 16px;
  border-radius: 18px;
  border: 1px solid rgb(148 163 184 / 0.16);
  background: #fff;
}

.asset-list {
  margin: 0;
  padding-left: 18px;
  display: grid;
  gap: 10px;
  color: #475569;
  font-size: 13px;
  line-height: 1.8;
}
</style>
