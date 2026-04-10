<script setup lang="ts">
import { deliveryPhases, quotaMetrics, techArchitectureLayers } from '@/mock/video-platform';

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
      <h2 class="text-28px text-[#111827] font-700">配额、队列、成本与技术路线</h2>
      <p class="mt-8px text-14px text-[#475569] leading-24px">
        这个页面把后端技术实施路径也拉进前端 demo 里，方便在现场同时讲清楚“为什么产品能跑起来”和“为什么后续可以扩展”。
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

    <NCard title="后端能力架构" :bordered="false" class="card-wrapper">
      <NGrid cols="1 xl:3" responsive="screen" :x-gap="16" :y-gap="16">
        <NGi v-for="item in techArchitectureLayers" :key="item.id">
          <div class="ops-cost">
            <div class="text-16px text-[#111827] font-700">{{ item.title }}</div>
            <p class="mt-8px text-13px text-[#475569] leading-22px">{{ item.summary }}</p>
            <div class="mt-10px flex flex-wrap gap-8px">
              <span v-for="tag in item.items" :key="tag" class="ops-pill">{{ tag }}</span>
            </div>
          </div>
        </NGi>
      </NGrid>
    </NCard>

    <NCard title="实施路径" :bordered="false" class="card-wrapper">
      <div class="grid gap-12px">
        <div v-for="item in deliveryPhases" :key="item.id" class="phase-card">
          <div class="flex flex-wrap items-start justify-between gap-12px">
            <div>
              <div class="text-12px text-[#64748b] tracking-[0.18em] uppercase">{{ item.phase }}</div>
              <div class="mt-8px text-18px text-[#111827] font-700">{{ item.goal }}</div>
            </div>
            <NTag size="small" :bordered="false" type="info">{{ item.scope }}</NTag>
          </div>
          <div class="grid mt-12px gap-10px md:grid-cols-2">
            <div class="phase-block">
              <div class="phase-block__label">里程碑</div>
              <div class="phase-block__value">{{ item.milestone }}</div>
            </div>
            <div class="phase-block">
              <div class="phase-block__label">风险控制</div>
              <div class="phase-block__value">{{ item.riskControl }}</div>
            </div>
          </div>
        </div>
      </div>
    </NCard>
  </div>
</template>

<style scoped>
.ops-card,
.ops-cost,
.phase-card,
.phase-block {
  border-radius: 18px;
  background: linear-gradient(180deg, #ffffff 0%, #fbfdff 100%);
}

.ops-cost,
.phase-card,
.phase-block {
  padding: 16px;
  border: 1px solid rgb(148 163 184 / 0.16);
}

.ops-pill {
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

.phase-block {
  background: #f8fafc;
}

.phase-block__label {
  font-size: 12px;
  color: #64748b;
}

.phase-block__value {
  margin-top: 6px;
  font-size: 13px;
  line-height: 1.8;
  color: #334155;
}
</style>
