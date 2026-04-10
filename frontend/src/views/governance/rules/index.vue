<script setup lang="ts">
import { computed } from 'vue';
import { useSchoolStore } from '@/store/modules/school';
import { useDemoAccess } from '@/hooks/business/demo-access';
import { reviewRules } from '@/mock/video-platform';

defineOptions({
  name: 'GovernanceRules'
});

const schoolStore = useSchoolStore();
const { hasButton, isPlatformOps } = useDemoAccess();

const visibleRules = computed(() =>
  isPlatformOps.value ? reviewRules : reviewRules.filter(item => item.scope === '学校')
);

const ruleSummary = computed(() => {
  const highRiskCount = visibleRules.value.filter(item => item.riskLevel === '高').length;
  const enabledCount = visibleRules.value.filter(item => item.enabled).length;
  const totalWeight = visibleRules.value.reduce((sum, item) => sum + item.weight, 0);

  return [
    { label: '可见规则', value: `${visibleRules.value.length} 条`, desc: '根据角色决定展示全局规则还是学校规则。' },
    { label: '高风险规则', value: `${highRiskCount} 条`, desc: '高风险规则更偏向强制拦截与人工复审。' },
    { label: '启用中', value: `${enabledCount} 条`, desc: '禁用后不会参与当前命中说明演示。' },
    { label: '总权重', value: `${totalWeight}`, desc: '用于演示规则调权后影响命中说明。' }
  ];
});

function getRiskType(level: string): NaiveUI.ThemeColor {
  if (level === '高') return 'error';
  if (level === '中') return 'warning';
  return 'success';
}

function notify(action: string, ruleName: string) {
  window.$message?.success(`${action}：${ruleName}`);
}
</script>

<template>
  <div class="flex-col-stretch gap-16px">
    <NCard :bordered="false" class="card-wrapper">
      <div class="flex flex-wrap items-center justify-between gap-12px">
        <div>
          <h2 class="text-28px text-[#111827] font-700">审核规则管理</h2>
          <p class="mt-8px text-14px text-[#475569] leading-24px">
            {{
              isPlatformOps
                ? '平台运营可维护全局规则和权重阈值。'
                : `当前仅展示 ${schoolStore.activeSchool.shortName} 的学校侧规则。`
            }}
            页面重点演示规则描述、作用阶段、权重、命中说明以及启停状态。
          </p>
        </div>
        <div class="flex flex-wrap gap-8px">
          <NButton v-if="hasButton('rules:manage')" type="primary" @click="notify('新增规则', '新规则')">
            新增规则
          </NButton>
          <NButton
            v-if="hasButton('threshold:manage')"
            ghost
            type="warning"
            @click="notify('调整权重阈值', '全局阈值')"
          >
            调整权重阈值
          </NButton>
        </div>
      </div>
    </NCard>

    <NGrid cols="1 s:2 l:4" responsive="screen" :x-gap="16" :y-gap="16">
      <NGi v-for="item in ruleSummary" :key="item.label">
        <NCard :bordered="false" class="summary-card card-wrapper">
          <div class="text-13px text-[#64748b]">{{ item.label }}</div>
          <div class="mt-10px text-28px text-[#111827] font-700">{{ item.value }}</div>
          <div class="mt-8px text-13px text-[#64748b] leading-22px">{{ item.desc }}</div>
        </NCard>
      </NGi>
    </NGrid>

    <NGrid cols="1 xl:3" responsive="screen" :x-gap="16" :y-gap="16">
      <NGi span="1 xl:2">
        <NCard title="规则列表" :bordered="false" class="card-wrapper">
          <div class="grid gap-12px">
            <div v-for="rule in visibleRules" :key="rule.id" class="rule-card">
              <div class="flex flex-wrap items-start justify-between gap-12px">
                <div>
                  <div class="flex flex-wrap items-center gap-8px">
                    <div class="text-16px text-[#111827] font-700">{{ rule.name }}</div>
                    <NTag size="small" :bordered="false" :type="getRiskType(rule.riskLevel)">{{ rule.riskLevel }}</NTag>
                    <NTag size="small" :bordered="false" type="info">{{ rule.stage }}</NTag>
                    <NTag size="small" :bordered="false">{{ rule.scope }}</NTag>
                  </div>
                  <p class="mt-8px text-13px text-[#475569] leading-22px">{{ rule.description }}</p>
                </div>
                <div class="weight-badge">
                  <span>权重</span>
                  <strong>{{ rule.weight }}</strong>
                </div>
              </div>

              <div class="grid mt-14px gap-10px md:grid-cols-2">
                <div class="rule-detail">
                  <div class="rule-detail__label">命中说明</div>
                  <div class="rule-detail__value">{{ rule.hitHint }}</div>
                </div>
                <div class="rule-detail">
                  <div class="rule-detail__label">维护人 / 更新时间</div>
                  <div class="rule-detail__value">{{ rule.owner }} · {{ rule.updatedAt }}</div>
                </div>
              </div>

              <div class="mt-14px flex flex-wrap items-center justify-between gap-12px">
                <NSpace>
                  <NButton v-if="hasButton('rules:manage')" size="small" @click="notify('编辑规则', rule.name)">
                    编辑权重
                  </NButton>
                  <NButton v-if="hasButton('rules:manage')" size="small" ghost @click="notify('调整说明', rule.name)">
                    修改描述
                  </NButton>
                  <NButton
                    v-if="hasButton('rules:school-view')"
                    size="small"
                    tertiary
                    @click="notify('查看规则说明', rule.name)"
                  >
                    查看适用说明
                  </NButton>
                </NSpace>
                <NTag :bordered="false" :type="rule.enabled ? 'success' : 'default'">
                  {{ rule.enabled ? '启用中' : '已停用' }}
                </NTag>
              </div>
            </div>
          </div>
        </NCard>
      </NGi>

      <NGi>
        <div class="flex-col-stretch gap-16px">
          <NCard title="规则生效逻辑" :bordered="false" class="card-wrapper">
            <ul class="guide-list">
              <li>全局规则优先处理跨校一致性的红线问题，例如政治敏感表达和历史人物复审。</li>
              <li>学校规则用于品牌完整性、学段表达适配和校本素材要求。</li>
              <li>权重越高，越容易在命中说明和处理建议中被优先展示。</li>
              <li>平台运营可改权重与阈值，学校管理员重点查看学校侧规则说明。</li>
            </ul>
          </NCard>

          <NCard title="演示建议" :bordered="false" class="card-wrapper">
            <div class="grid gap-10px">
              <div class="rule-detail">
                <div class="rule-detail__label">教师视角</div>
                <div class="rule-detail__value">只看到命中的复审结果，不直接维护规则。</div>
              </div>
              <div class="rule-detail">
                <div class="rule-detail__label">学校管理员视角</div>
                <div class="rule-detail__value">可查看学校规则的权重与描述，说明为什么品牌素材必须补齐。</div>
              </div>
              <div class="rule-detail">
                <div class="rule-detail__label">平台运营视角</div>
                <div class="rule-detail__value">可跨校调整全局权重，演示“改完立即生效”的产品价值。</div>
              </div>
            </div>
          </NCard>
        </div>
      </NGi>
    </NGrid>
  </div>
</template>

<style scoped>
.summary-card,
.rule-card,
.rule-detail {
  border-radius: 18px;
  border: 1px solid rgb(148 163 184 / 0.16);
  background: #fff;
}

.rule-card {
  padding: 18px;
}

.rule-detail {
  padding: 14px 16px;
  background: #f8fafc;
}

.rule-detail__label {
  font-size: 12px;
  color: #64748b;
}

.rule-detail__value {
  margin-top: 6px;
  font-size: 13px;
  line-height: 1.8;
  color: #334155;
}

.weight-badge {
  min-width: 82px;
  display: grid;
  justify-items: center;
  padding: 10px 14px;
  border-radius: 16px;
  background: linear-gradient(180deg, #fff7ed 0%, #fffbeb 100%);
  color: #9a3412;
}

.weight-badge span {
  font-size: 11px;
}

.weight-badge strong {
  margin-top: 4px;
  font-size: 24px;
  line-height: 1;
}

.guide-list {
  margin: 0;
  padding-left: 18px;
  display: grid;
  gap: 10px;
  color: #475569;
  font-size: 13px;
  line-height: 1.8;
}
</style>
