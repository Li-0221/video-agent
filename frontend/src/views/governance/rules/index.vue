<script setup lang="ts">
import { computed, ref } from 'vue';
import { useSchoolStore } from '@/store/modules/school';
import { useDemoAccess } from '@/hooks/business/demo-access';
import { reviewRules, ruleSimulationCases } from '@/mock/video-platform';

defineOptions({
  name: 'GovernanceRules'
});

const schoolStore = useSchoolStore();
const { hasButton, isPlatformOps } = useDemoAccess();

const rulesModel = ref(structuredClone(reviewRules));
const selectedScenarioId = ref(ruleSimulationCases[0].id);

const visibleRules = computed(() =>
  isPlatformOps.value ? rulesModel.value : rulesModel.value.filter(item => item.scope === '学校')
);

const selectedScenario = computed(
  () => ruleSimulationCases.find(item => item.id === selectedScenarioId.value) || ruleSimulationCases[0]
);

const hitRules = computed(() =>
  visibleRules.value.filter(item => selectedScenario.value.hitRuleIds.includes(item.id) && item.enabled)
);

const simulatedResult = computed(() => {
  const totalWeight = hitRules.value.reduce((sum, item) => sum + item.weight, 0);

  if (totalWeight >= 90) return '直接拦截';
  if (totalWeight >= 60) return '进入人工复审';
  if (totalWeight >= 20) return '提示后继续';
  return '默认放行';
});

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
            这个页面除了展示规则列表，也支持现场演示“改权重、关开关、看命中结果”的业务价值。
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
                <NSwitch v-model:value="rule.enabled" />
              </div>

              <div class="mt-14px">
                <div class="mb-8px flex items-center justify-between gap-10px">
                  <span class="text-12px text-[#64748b]">规则权重</span>
                  <span class="text-18px text-[#111827] font-700">{{ rule.weight }}</span>
                </div>
                <NSlider v-model:value="rule.weight" :min="0" :max="100" :step="5" />
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
                    编辑规则
                  </NButton>
                  <NButton v-if="hasButton('rules:manage')" size="small" ghost @click="notify('调整说明', rule.name)">
                    修改说明
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
          <NCard title="命中结果模拟器" :bordered="false" class="card-wrapper">
            <NForm label-placement="top">
              <NFormItem label="演示场景">
                <NSelect
                  v-model:value="selectedScenarioId"
                  :options="ruleSimulationCases.map(item => ({ label: item.title, value: item.id }))"
                />
              </NFormItem>
            </NForm>

            <div class="sim-card">
              <div class="text-15px text-[#111827] font-700">{{ selectedScenario.title }}</div>
              <p class="mt-8px text-13px text-[#475569] leading-22px">{{ selectedScenario.summary }}</p>
              <div class="mt-10px text-12px text-[#64748b]">推荐动作：{{ selectedScenario.recommendation }}</div>
            </div>

            <div class="sim-result">
              <div>
                <div class="text-12px text-[#64748b]">命中规则</div>
                <div class="mt-8px flex flex-wrap gap-8px">
                  <NTag
                    v-for="item in hitRules"
                    :key="item.id"
                    size="small"
                    :bordered="false"
                    :type="getRiskType(item.riskLevel)"
                  >
                    {{ item.name }}
                  </NTag>
                </div>
              </div>
              <div>
                <div class="text-12px text-[#64748b]">模拟结果</div>
                <div class="mt-6px text-18px text-[#111827] font-700">{{ simulatedResult }}</div>
                <div class="mt-6px text-12px text-[#64748b]">场景风险分：{{ selectedScenario.riskScore }}</div>
              </div>
            </div>
          </NCard>

          <NCard title="演示建议" :bordered="false" class="card-wrapper">
            <ul class="guide-list">
              <li>先展示全局规则和学校规则的差异，说明平台和学校的责任边界。</li>
              <li>再切换模拟场景，实时调整权重或关闭规则，说明结果会立即变化。</li>
              <li>教师视角只看命中结果；学校管理员看学校规则；平台运营才看完整权重。</li>
              <li>现场讲解时，优先用“历史人物复审”和“学生输入拦截”两个场景最容易理解。</li>
            </ul>
          </NCard>
        </div>
      </NGi>
    </NGrid>
  </div>
</template>

<style scoped>
.summary-card,
.rule-card,
.rule-detail,
.sim-card,
.sim-result {
  border-radius: 18px;
  border: 1px solid rgb(148 163 184 / 0.16);
  background: #fff;
}

.rule-card {
  padding: 18px;
}

.rule-detail,
.sim-card,
.sim-result {
  padding: 14px 16px;
  background: #f8fafc;
}

.sim-result {
  margin-top: 12px;
  display: grid;
  gap: 12px;
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
