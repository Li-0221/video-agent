<script setup lang="ts">
import { computed } from 'vue';
import {
  acceptanceChecklist,
  platformMetrics,
  quotaMetrics,
  reviewCases,
  roleProfiles,
  videoTasks,
  workflowStages
} from '@/mock/video-platform';

const activeReviewCount = computed(() => reviewCases.length);
const blockedTaskCount = computed(() => videoTasks.filter(item => item.status === 'blocked').length);
</script>

<template>
  <div class="video-page flex-col-stretch gap-16px">
    <section class="hero-panel">
      <div class="hero-copy">
        <p class="hero-kicker">AI + 思政教育视频工作流平台</p>
        <h2 class="hero-title">把 PRD 里的“教师强制审稿 + 安全复审 + 学校定制”真正落到后台系统里</h2>
        <p class="hero-desc">
          这个前端以教师主流程为核心，串起学生代审、学校素材隔离、输出多模态复审、配额排队与视频审计，
          目标不是展示效果图，而是让业务、产品、研发和运营都能直接对齐交付范围。
        </p>
        <div class="hero-tags">
          <span>教师主导</span>
          <span>学生参与但需代审</span>
          <span>学校资产隔离</span>
          <span>审核日志可追溯</span>
        </div>
      </div>
      <div class="hero-side">
        <div class="hero-side-label">当前焦点</div>
        <div class="hero-side-value">{{ activeReviewCount }} 个待复审任务</div>
        <p class="hero-side-desc">
          其中 {{ blockedTaskCount }} 个在输入阶段即被拦截，剩余任务分布在教师强制审稿、素材生成和终审环节。
        </p>
      </div>
    </section>

    <NGrid cols="1 s:2 l:4" responsive="screen" :x-gap="16" :y-gap="16">
      <NGi v-for="metric in platformMetrics" :key="metric.label">
        <NCard :bordered="false" class="metric-card card-wrapper">
          <div class="text-13px text-[#6b7280]">{{ metric.label }}</div>
          <div class="mt-10px text-30px text-[#19233c] font-700">{{ metric.value }}</div>
          <div class="mt-8px text-13px text-[#64748b] leading-22px">{{ metric.desc }}</div>
        </NCard>
      </NGi>
    </NGrid>

    <NGrid cols="1 xl:2" responsive="screen" :x-gap="16" :y-gap="16">
      <NGi>
        <NCard title="主流程拆解" :bordered="false" class="card-wrapper">
          <div class="flex-col-stretch gap-12px">
            <div v-for="(stage, index) in workflowStages" :key="stage.title" class="stage-row">
              <div class="stage-index">{{ index + 1 }}</div>
              <div class="flex-1">
                <div class="flex items-center gap-8px">
                  <h3 class="text-16px text-[#111827] font-600">{{ stage.title }}</h3>
                  <NTag size="small" :bordered="false" type="info">{{ stage.owner }}</NTag>
                </div>
                <p class="mt-6px text-13px text-[#64748b] leading-22px">{{ stage.desc }}</p>
              </div>
            </div>
          </div>
        </NCard>
      </NGi>
      <NGi>
        <NCard title="角色边界" :bordered="false" class="card-wrapper">
          <div class="grid gap-12px">
            <div v-for="role in roleProfiles" :key="role.id" class="role-card">
              <div class="flex items-start justify-between gap-12px">
                <div>
                  <div class="text-16px text-[#111827] font-600">{{ role.role }}</div>
                  <p class="mt-6px text-13px text-[#64748b] leading-22px">{{ role.desc }}</p>
                </div>
                <NTag size="small" :bordered="false" type="success">{{ role.dailyLimit }}</NTag>
              </div>
              <div class="mt-10px flex flex-wrap gap-8px">
                <span v-for="item in role.capabilities" :key="item" class="tag-pill">{{ item }}</span>
              </div>
            </div>
          </div>
        </NCard>
      </NGi>
    </NGrid>

    <NGrid cols="1 xl:2" responsive="screen" :x-gap="16" :y-gap="16">
      <NGi>
        <NCard title="非功能约束" :bordered="false" class="card-wrapper">
          <div class="grid gap-12px md:grid-cols-2">
            <div v-for="item in quotaMetrics" :key="item.title" class="quota-card">
              <div class="text-13px text-[#6b7280]">{{ item.title }}</div>
              <div class="mt-8px text-26px text-[#19233c] font-700">{{ item.value }}</div>
              <p class="mt-8px text-13px text-[#64748b] leading-22px">{{ item.desc }}</p>
            </div>
          </div>
        </NCard>
      </NGi>
      <NGi>
        <NCard title="验收关注点" :bordered="false" class="card-wrapper">
          <ul class="acceptance-list">
            <li v-for="item in acceptanceChecklist" :key="item">{{ item }}</li>
          </ul>
        </NCard>
      </NGi>
    </NGrid>
  </div>
</template>

<style scoped>
.video-page {
  display: flex;
}

.hero-panel {
  position: relative;
  overflow: hidden;
  display: grid;
  gap: 20px;
  grid-template-columns: minmax(0, 1.6fr) minmax(280px, 0.8fr);
  padding: 28px;
  border-radius: 28px;
  background:
    radial-gradient(circle at top left, rgb(212 228 255 / 0.95), transparent 34%),
    linear-gradient(135deg, #f7fbff 0%, #eef4ff 52%, #f8f5ed 100%);
  border: 1px solid rgb(148 163 184 / 0.18);
}

.hero-panel::after {
  content: '';
  position: absolute;
  inset: auto -60px -80px auto;
  width: 220px;
  height: 220px;
  border-radius: 9999px;
  background: rgb(15 23 42 / 0.06);
  filter: blur(8px);
}

.hero-copy,
.hero-side {
  position: relative;
  z-index: 1;
}

.hero-kicker {
  margin: 0;
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.28em;
  color: #475569;
  text-transform: uppercase;
}

.hero-title {
  margin: 14px 0 0;
  max-width: 900px;
  font-size: 34px;
  line-height: 1.25;
  font-weight: 800;
  color: #111827;
}

.hero-desc {
  margin: 14px 0 0;
  max-width: 860px;
  font-size: 14px;
  line-height: 1.9;
  color: #475569;
}

.hero-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-top: 18px;
}

.hero-tags span,
.tag-pill {
  display: inline-flex;
  align-items: center;
  padding: 6px 12px;
  border-radius: 9999px;
  background: rgb(255 255 255 / 0.82);
  color: #334155;
  font-size: 12px;
  font-weight: 600;
  border: 1px solid rgb(148 163 184 / 0.18);
}

.hero-side {
  align-self: end;
  padding: 20px;
  border-radius: 24px;
  background: rgb(255 255 255 / 0.72);
  border: 1px solid rgb(148 163 184 / 0.18);
  backdrop-filter: blur(8px);
}

.hero-side-label {
  font-size: 12px;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: #64748b;
}

.hero-side-value {
  margin-top: 12px;
  font-size: 30px;
  line-height: 1.2;
  font-weight: 800;
  color: #0f172a;
}

.hero-side-desc {
  margin: 12px 0 0;
  font-size: 13px;
  line-height: 1.8;
  color: #475569;
}

.metric-card,
.quota-card,
.role-card {
  border-radius: 20px;
  background: linear-gradient(180deg, #ffffff 0%, #fbfdff 100%);
}

.stage-row {
  display: flex;
  gap: 14px;
  align-items: flex-start;
  padding: 12px 0;
  border-bottom: 1px dashed rgb(148 163 184 / 0.22);
}

.stage-row:last-child {
  border-bottom: none;
  padding-bottom: 0;
}

.stage-index {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 34px;
  height: 34px;
  border-radius: 9999px;
  background: linear-gradient(135deg, #17314f 0%, #325c88 100%);
  color: #fff;
  font-weight: 700;
  flex-shrink: 0;
}

.role-card,
.quota-card {
  padding: 16px;
  border: 1px solid rgb(148 163 184 / 0.16);
}

.acceptance-list {
  display: grid;
  gap: 10px;
  margin: 0;
  padding-left: 20px;
  color: #334155;
}

.acceptance-list li {
  font-size: 13px;
  line-height: 1.8;
}

@media (max-width: 1280px) {
  .hero-panel {
    grid-template-columns: 1fr;
  }

  .hero-title {
    font-size: 28px;
  }
}
</style>
