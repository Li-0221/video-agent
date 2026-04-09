<script setup lang="ts">
import { quotaMetrics } from '@/mock/video-platform';

const costBreakdown = [
  { label: '文本脚本生成', value: '18%', desc: '自然语言生成脚本与知识点注入' },
  { label: '文生图 / 文生视频', value: '46%', desc: '素材生成是当前最主要的成本来源' },
  { label: 'TTS 配音与字幕', value: '14%', desc: '受语速、音色和字幕重试影响' },
  { label: '多模态审核', value: '22%', desc: '覆盖文本、图像、视频关键帧和音频' }
];
</script>

<template>
  <div class="flex-col-stretch gap-16px">
    <NCard :bordered="false" class="card-wrapper">
      <h2 class="text-28px text-[#111827] font-700">配额、队列与成本</h2>
      <p class="mt-8px text-14px text-[#475569] leading-24px">
        MVP 阶段必须把并发、排队、留存、时延和成本控制放在前台，因为它们直接决定这个系统能不能在学校场景里稳定落地。
      </p>
    </NCard>

    <NGrid cols="1 s:2 l:4" responsive="screen" :x-gap="16" :y-gap="16">
      <NGi v-for="item in quotaMetrics" :key="item.title">
        <NCard :bordered="false" class="ops-card card-wrapper">
          <div class="text-13px text-[#64748b]">{{ item.title }}</div>
          <div class="mt-10px text-28px text-[#111827] font-700">{{ item.value }}</div>
          <p class="mt-8px text-13px text-[#475569] leading-22px">{{ item.desc }}</p>
        </NCard>
      </NGi>
    </NGrid>

    <NGrid cols="1 xl:2" responsive="screen" :x-gap="16" :y-gap="16">
      <NGi>
        <NCard title="队列与 SLA 看板" :bordered="false" class="card-wrapper">
          <div class="grid gap-16px">
            <div>
              <div class="mb-8px text-13px text-[#64748b]">当前排队占用</div>
              <NProgress type="line" :percentage="62" indicator-placement="inside" />
            </div>
            <div>
              <div class="mb-8px text-13px text-[#64748b]">平均单任务完成率</div>
              <NProgress type="line" :percentage="81" status="success" indicator-placement="inside" />
            </div>
            <div>
              <div class="mb-8px text-13px text-[#64748b]">高峰期额外等待</div>
              <NProgress type="line" :percentage="38" status="warning" indicator-placement="inside" />
            </div>
          </div>
        </NCard>
      </NGi>

      <NGi>
        <NCard title="模型成本拆分" :bordered="false" class="card-wrapper">
          <div class="grid gap-12px">
            <div v-for="item in costBreakdown" :key="item.label" class="ops-cost">
              <div class="flex items-center justify-between gap-10px">
                <div class="text-14px text-[#111827] font-600">{{ item.label }}</div>
                <div class="text-18px text-[#111827] font-700">{{ item.value }}</div>
              </div>
              <p class="mt-8px text-13px text-[#475569] leading-22px">{{ item.desc }}</p>
            </div>
          </div>
        </NCard>
      </NGi>
    </NGrid>
  </div>
</template>

<style scoped>
.ops-card,
.ops-cost {
  border-radius: 18px;
  background: linear-gradient(180deg, #ffffff 0%, #fbfdff 100%);
}

.ops-cost {
  padding: 16px;
  border: 1px solid rgb(148 163 184 / 0.16);
}
</style>
