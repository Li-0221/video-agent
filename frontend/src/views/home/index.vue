<script setup lang="ts">
import { computed } from 'vue';
import { useAuthStore } from '@/store/modules/auth';
import { useSchoolStore } from '@/store/modules/school';
import { useDemoAccess } from '@/hooks/business/demo-access';
import {
  acceptanceChecklist,
  platformMetrics,
  quotaMetrics,
  reviewCases,
  roleProfiles,
  schoolAssets,
  schoolThemeProfiles,
  videoTasks,
  workflowStages
} from '@/mock/video-platform';

const authStore = useAuthStore();
const schoolStore = useSchoolStore();
const { isPlatformOps, isSchoolAdmin, isStudent, isTeacher } = useDemoAccess();

const currentTasks = computed(() =>
  isPlatformOps.value ? videoTasks : videoTasks.filter(item => item.schoolId === schoolStore.activeSchool.id)
);

const currentReviewCases = computed(() =>
  isPlatformOps.value ? reviewCases : reviewCases.filter(item => item.schoolId === schoolStore.activeSchool.id)
);

const currentSchoolAssets = computed(() => schoolAssets.filter(item => item.schoolId === schoolStore.activeSchool.id));

const activeReviewCount = computed(() => currentReviewCases.value.length);
const blockedTaskCount = computed(() => currentTasks.value.filter(item => item.status === 'blocked').length);

const roleLabel = computed(() => {
  if (isTeacher.value) return '教师';
  if (isStudent.value) return '学生';
  if (isSchoolAdmin.value) return '学校管理员';
  if (isPlatformOps.value) return '平台运营';
  return '访客';
});

const heroTags = computed(() => {
  const baseTags = ['菜单按角色裁剪', '按钮按权限显示', '看板按学校过滤'];

  if (isTeacher.value) return [...baseTags, '教师强制审稿', '终审责任在教师'];
  if (isStudent.value) return [...baseTags, '仅可发起与重提', '无脚本审核权限'];
  if (isSchoolAdmin.value) return [...baseTags, '学校素材隔离', '品牌主题切换'];
  if (isPlatformOps.value) return [...baseTags, '跨校巡检', '全局规则权重管理'];

  return baseTags;
});

const focusCards = computed(() => {
  if (isTeacher.value) {
    return [
      { label: '本校待复审', value: `${currentReviewCases.value.length} 个`, desc: '教师需要完整看片并给出终审结论。' },
      {
        label: '生成中任务',
        value: `${currentTasks.value.filter(item => item.status === 'generating').length} 个`,
        desc: '支持只重配音或重绘画面。'
      },
      {
        label: '高风险提醒',
        value: `${currentTasks.value.filter(item => item.status === 'blocked').length} 个`,
        desc: '输入阶段拦截会直接回流到教师视角。'
      }
    ];
  }

  if (isStudent.value) {
    return [
      {
        label: '我的可见作品',
        value: `${currentTasks.value.filter(item => item.status === 'approved').length} 个`,
        desc: '仅教师确认后的作品会同步到学生端。'
      },
      {
        label: '待修改作业',
        value: `${currentTasks.value.filter(item => item.status === 'blocked').length} 个`,
        desc: '学生只能修改后重新提交，不能直接放行。'
      },
      { label: '校内模板', value: `${currentSchoolAssets.value.length} 项`, desc: '素材由教师和学校管理员预先配置。' }
    ];
  }

  if (isSchoolAdmin.value) {
    return [
      {
        label: '本校素材',
        value: `${currentSchoolAssets.value.length} 项`,
        desc: '校徽、校训、校园背景与标签全部按学校隔离。'
      },
      { label: '启用规则', value: '4 条', desc: '可查看学校侧规则说明与权重对业务的影响。' },
      { label: '品牌主题', value: schoolStore.activeSchool.shortName, desc: '切换学校即可同步主题色、系统名和水印。' }
    ];
  }

  return [
    { label: '已接学校', value: `${schoolThemeProfiles.length} 所`, desc: '平台运营可跨校查看演示数据和品牌配置。' },
    { label: '全局规则', value: '2 条', desc: '聚焦跨校复审策略与审核阈值。' },
    { label: '待巡检案例', value: `${reviewCases.length} 个`, desc: '支持跨学校抽查高风险视频和命中规则。' }
  ];
});

const constraintMetrics = computed(() =>
  (isPlatformOps.value ? platformMetrics : quotaMetrics).map(item => ({
    title: 'label' in item ? item.label : item.title,
    value: item.value,
    desc: item.desc
  }))
);
</script>

<template>
  <div class="video-page flex-col-stretch gap-16px">
    <section class="hero-panel">
      <div class="hero-copy">
        <p class="hero-kicker">{{ schoolStore.activeSchool.schoolName }} · {{ roleLabel }}视角</p>
        <h2 class="hero-title">{{ schoolStore.activeSchool.systemName }}</h2>
        <p class="hero-desc">
          当前登录人为 {{ authStore.userInfo.userName }}。看板会按照角色与学校双重维度做裁剪，同一套页面能演示教师创作、
          学生提交、学校品牌配置和平台运营巡检四种工作方式。
        </p>
        <div class="hero-tags">
          <span v-for="tag in heroTags" :key="tag">{{ tag }}</span>
        </div>
      </div>
      <div class="hero-side">
        <div class="hero-side-label">当前学校主题</div>
        <div class="hero-side-value">{{ schoolStore.activeSchool.shortName }}</div>
        <p class="hero-side-desc">
          主色已同步为 {{ schoolStore.activeSchool.theme.primary }}。当前学校下共有
          {{ activeReviewCount }} 个待处理案例，其中 {{ blockedTaskCount }} 个在输入阶段已被拦截。
        </p>
      </div>
    </section>

    <NGrid cols="1 s:2 l:4" responsive="screen" :x-gap="16" :y-gap="16">
      <NGi v-for="metric in focusCards" :key="metric.label">
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
                  <div class="flex items-center gap-8px">
                    <div class="text-16px text-[#111827] font-600">{{ role.role }}</div>
                    <NTag v-if="role.role === roleLabel" size="small" :bordered="false" type="warning">当前角色</NTag>
                  </div>
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
            <div v-for="item in constraintMetrics" :key="item.title" class="quota-card">
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
