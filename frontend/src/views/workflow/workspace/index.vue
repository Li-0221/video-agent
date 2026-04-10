<script setup lang="ts">
import { computed, reactive } from 'vue';
import { useAuthStore } from '@/store/modules/auth';
import { useSchoolStore } from '@/store/modules/school';
import { useDemoAccess } from '@/hooks/business/demo-access';
import {
  gradePresets,
  inputAuditCheckpoints,
  knowledgeTagGroups,
  schoolPresets,
  templatePresets,
  videoTasks
} from '@/mock/video-platform';

const authStore = useAuthStore();
const schoolStore = useSchoolStore();
const { isStudent, isTeacher } = useDemoAccess();

const formModel = reactive({
  creatorRole: isStudent.value ? '学生' : '教师',
  gradeBand: '小学 5-6 年级',
  edition: '统编版',
  duration: '3 分钟内',
  templateId: 'tpl-moral',
  schoolPreset: 'school-fixed',
  topic: '生成关于“小学道德与法治课程中诚信主题”的 3 分钟动画视频，包含故事、总结及核心观点升华。',
  goal: '用于课堂导入，必须包含校园故事、课程总结与学生可执行的行动倡议。',
  tags: ['诚信', '校园文明', '责任意识']
});

const templateOptions = computed(() =>
  templatePresets.map(item => ({
    label: `${item.title} · ${item.tone}`,
    value: item.id
  }))
);

const schoolPresetOptions = computed(() =>
  schoolPresets.map(item => ({
    label: item.name,
    value: item.id
  }))
);

const gradeOptions = computed(() =>
  gradePresets.map(item => ({
    label: item.label,
    value: item.label
  }))
);

const tagOptions = computed(() =>
  knowledgeTagGroups.flatMap(group => group.tags.map(tag => ({ label: `${tag} · ${group.scope}`, value: tag })))
);

const recentTasks = computed(() =>
  videoTasks.filter(item => item.schoolId === schoolStore.activeSchool.id).slice(0, 3)
);

const activeTemplate = computed(
  () => templatePresets.find(item => item.id === formModel.templateId) || templatePresets[0]
);
const activeGrade = computed(() => gradePresets.find(item => item.label === formModel.gradeBand) || gradePresets[2]);
const activePreset = computed(() => schoolPresets.find(item => item.id === formModel.schoolPreset) || schoolPresets[0]);

const launchHints = computed(() => {
  if (isStudent.value) {
    return {
      title: '学生发起后会自动转给教师代审',
      desc: '学生只能提交创意和修改被拦截内容，脚本确认与终审都由教师完成。'
    };
  }

  return {
    title: '教师发起后可直接进入脚本审核链路',
    desc: '教师拥有逐镜确认、送审与成片放行权限，系统会记录完整审计日志。'
  };
});

const promptPreview = computed(() => {
  const tagText = formModel.tags.length ? `注入知识点：${formModel.tags.join('、')}。` : '本次未额外注入知识点标签。';

  return [
    `你是面向 ${formModel.gradeBand} 的思政课堂视频编导助手。`,
    `请基于 ${formModel.edition} 教材，生成一支 ${formModel.duration} 的 ${activeTemplate.value.tone} 视频。`,
    `主题：${formModel.topic}`,
    `教学目标：${formModel.goal}`,
    `学校定制策略：${activePreset.value.name}，学校水印文案为“${schoolStore.activeSchool.watermarkText}”。`,
    `语言层级要求：${activeGrade.value.languageLevel}；语速控制在 ${activeGrade.value.speechRate}；默认画风 ${activeGrade.value.style}。`,
    tagText,
    '输出格式必须为结构化脚本：镜头编号、画面描述、旁白、时长估算、课堂提问收束。'
  ].join('\n');
});

const launchSummary = computed(() => [
  {
    label: '发起角色',
    value: formModel.creatorRole,
    desc: formModel.creatorRole === '学生' ? '需教师代审与终审' : '可直接进入教师审稿台'
  },
  {
    label: '模板镜头数',
    value: `${activeTemplate.value.scenes} 镜头`,
    desc: activeTemplate.value.description
  },
  {
    label: '年级表达',
    value: activeGrade.value.speechRate,
    desc: `${activeGrade.value.style} · ${activeGrade.value.languageLevel}`
  },
  {
    label: '学校策略',
    value: activePreset.value.watermarkMode,
    desc: activePreset.value.desc
  }
]);

function getCheckpointType(type: string): NaiveUI.ThemeColor {
  if (type === 'block') return 'error';
  if (type === 'warn') return 'warning';
  return 'success';
}

function submitTask() {
  window.$message?.success('Mock 任务已创建，后续会进入“脚本审核台”和“生成队列”。');
}
</script>

<template>
  <div class="flex-col-stretch gap-16px">
    <NCard :bordered="false" class="card-wrapper">
      <div class="flex flex-wrap items-center justify-between gap-12px">
        <div>
          <h2 class="text-28px text-[#111827] font-700">视频创作发起台</h2>
          <p class="mt-8px text-14px text-[#475569] leading-24px">
            当前学校为 {{ schoolStore.activeSchool.schoolName }}，登录身份是 {{ authStore.userInfo.userName }}。
            系统会根据角色自动调整默认发起身份、模板建议、审核责任与最终可见范围。
          </p>
        </div>
        <NTag size="large" :bordered="false" type="info">{{ schoolStore.activeSchool.slogan }}</NTag>
      </div>
    </NCard>

    <NGrid cols="1 xl:3" responsive="screen" :x-gap="16" :y-gap="16">
      <NGi span="1 xl:2">
        <NCard title="创作表单" :bordered="false" class="card-wrapper">
          <NForm :model="formModel" label-placement="top">
            <NGrid cols="1 m:2" responsive="screen" :x-gap="16">
              <NFormItemGi label="发起角色">
                <NRadioGroup v-model:value="formModel.creatorRole" name="creatorRole" :disabled="!isTeacher">
                  <NSpace>
                    <NRadioButton value="教师">教师</NRadioButton>
                    <NRadioButton value="学生">学生</NRadioButton>
                  </NSpace>
                </NRadioGroup>
              </NFormItemGi>
              <NFormItemGi label="学段 / 年级">
                <NSelect v-model:value="formModel.gradeBand" :options="gradeOptions" />
              </NFormItemGi>
              <NFormItemGi label="教材版本">
                <NInput v-model:value="formModel.edition" />
              </NFormItemGi>
              <NFormItemGi label="时长约束">
                <NInput v-model:value="formModel.duration" />
              </NFormItemGi>
              <NFormItemGi span="2" label="预设模板">
                <NSelect v-model:value="formModel.templateId" :options="templateOptions" />
              </NFormItemGi>
              <NFormItemGi span="2" label="学校定制策略">
                <NSelect v-model:value="formModel.schoolPreset" :options="schoolPresetOptions" />
              </NFormItemGi>
              <NFormItemGi span="2" label="自然语言指令">
                <NInput v-model:value="formModel.topic" type="textarea" :autosize="{ minRows: 4, maxRows: 6 }" />
              </NFormItemGi>
              <NFormItemGi span="2" label="教学目标">
                <NInput v-model:value="formModel.goal" type="textarea" :autosize="{ minRows: 3, maxRows: 5 }" />
              </NFormItemGi>
              <NFormItemGi span="2" label="思政知识点标签">
                <NSelect v-model:value="formModel.tags" multiple clearable filterable :options="tagOptions" />
              </NFormItemGi>
            </NGrid>
          </NForm>

          <div class="launch-banner">
            <div>
              <div class="text-15px text-[#111827] font-600">{{ launchHints.title }}</div>
              <div class="mt-8px text-13px text-[#64748b] leading-22px">{{ launchHints.desc }}</div>
            </div>
            <NButton type="primary" size="large" round @click="submitTask">创建任务</NButton>
          </div>
        </NCard>
      </NGi>

      <NGi>
        <div class="flex-col-stretch gap-16px">
          <NCard title="本次发起摘要" :bordered="false" class="card-wrapper">
            <div class="grid gap-12px">
              <div v-for="item in launchSummary" :key="item.label" class="summary-card">
                <div class="flex items-center justify-between gap-10px">
                  <div class="text-13px text-[#64748b]">{{ item.label }}</div>
                  <div class="text-16px text-[#111827] font-700">{{ item.value }}</div>
                </div>
                <p class="mt-8px text-13px text-[#475569] leading-22px">{{ item.desc }}</p>
              </div>
            </div>
          </NCard>

          <NCard title="输入安全校验" :bordered="false" class="card-wrapper">
            <div class="grid gap-12px">
              <div v-for="item in inputAuditCheckpoints" :key="item.id" class="checkpoint-card">
                <div class="flex items-center justify-between gap-10px">
                  <div class="text-14px text-[#111827] font-700">{{ item.title }}</div>
                  <NTag size="small" :bordered="false" :type="getCheckpointType(item.type)">
                    {{ item.type }}
                  </NTag>
                </div>
                <p class="mt-8px text-13px text-[#475569] leading-22px">{{ item.summary }}</p>
              </div>
            </div>
          </NCard>
        </div>
      </NGi>
    </NGrid>

    <NGrid cols="1 xl:2" responsive="screen" :x-gap="16" :y-gap="16">
      <NGi>
        <NCard title="最终生成提示词预览" :bordered="false" class="card-wrapper">
          <pre class="prompt-preview">{{ promptPreview }}</pre>
        </NCard>
      </NGi>
      <NGi>
        <NCard title="知识点标签来源" :bordered="false" class="card-wrapper">
          <div class="grid gap-12px">
            <div v-for="group in knowledgeTagGroups" :key="group.id" class="tag-group-card">
              <div class="flex items-center justify-between gap-10px">
                <div class="text-15px text-[#111827] font-700">{{ group.name }}</div>
                <NTag size="small" :bordered="false" :type="group.scope === '平台' ? 'info' : 'success'">
                  {{ group.scope }}
                </NTag>
              </div>
              <p class="mt-8px text-13px text-[#475569] leading-22px">{{ group.description }}</p>
              <div class="mt-10px flex flex-wrap gap-8px">
                <span v-for="tag in group.tags" :key="tag" class="tag-pill">{{ tag }}</span>
              </div>
            </div>
          </div>
        </NCard>
      </NGi>
    </NGrid>

    <NGrid cols="1 xl:2" responsive="screen" :x-gap="16" :y-gap="16">
      <NGi>
        <NCard title="模板与年级预设" :bordered="false" class="card-wrapper">
          <div class="grid gap-12px">
            <div v-for="item in gradePresets" :key="item.id" class="preset-card">
              <div class="flex items-center justify-between gap-10px">
                <h3 class="text-15px text-[#111827] font-600">{{ item.label }}</h3>
                <NTag size="small" :bordered="false" type="info">{{ item.speechRate }}</NTag>
              </div>
              <div class="mt-8px text-13px text-[#64748b] leading-22px">{{ item.summary }}</div>
              <div class="grid grid-cols-1 mt-10px gap-6px text-12px text-[#475569]">
                <div>默认画风：{{ item.style }}</div>
                <div>语言层级：{{ item.languageLevel }}</div>
              </div>
            </div>
          </div>
        </NCard>
      </NGi>
      <NGi>
        <NCard title="最近发起任务" :bordered="false" class="card-wrapper">
          <div class="grid gap-12px">
            <div v-for="item in recentTasks" :key="item.id" class="task-brief">
              <div class="flex items-center justify-between gap-10px">
                <div class="text-15px text-[#111827] font-600">{{ item.title }}</div>
                <NTag size="small" :bordered="false" :type="item.creatorRole === '学生' ? 'warning' : 'success'">
                  {{ item.creatorRole }}
                </NTag>
              </div>
              <div class="mt-8px text-13px text-[#64748b] leading-22px">{{ item.summary }}</div>
              <div class="mt-10px flex flex-wrap gap-8px text-12px text-[#475569]">
                <span>{{ item.gradeBand }}</span>
                <span>{{ item.queue }}</span>
                <span>{{ item.quota }}</span>
              </div>
            </div>
          </div>
        </NCard>
      </NGi>
    </NGrid>
  </div>
</template>

<style scoped>
.launch-banner {
  margin-top: 8px;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 18px;
  border-radius: 20px;
  background: linear-gradient(135deg, #f8fafc 0%, #eff6ff 100%);
}

.summary-card,
.checkpoint-card,
.preset-card,
.task-brief,
.tag-group-card {
  padding: 16px;
  border-radius: 18px;
  border: 1px solid rgb(148 163 184 / 0.16);
  background: linear-gradient(180deg, #ffffff 0%, #fbfdff 100%);
}

.prompt-preview {
  margin: 0;
  white-space: pre-wrap;
  word-break: break-word;
  padding: 18px;
  border-radius: 18px;
  background: #0f172a;
  color: #e2e8f0;
  font-size: 13px;
  line-height: 1.9;
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
