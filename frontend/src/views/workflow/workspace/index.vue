<script setup lang="ts">
import { computed, reactive } from 'vue';
import { gradePresets, knowledgeTags, schoolPresets, templatePresets, videoTasks } from '@/mock/video-platform';

const formModel = reactive({
  creatorRole: '教师',
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

const tagOptions = computed(() => knowledgeTags.map(item => ({ label: item, value: item })));

function submitTask() {
  window.$message?.success('Mock 任务已创建，后续会进入“脚本审核台”和“生成队列”。');
}
</script>

<template>
  <div class="flex-col-stretch gap-16px">
    <NGrid cols="1 xl:3" responsive="screen" :x-gap="16" :y-gap="16">
      <NGi span="1 xl:2">
        <NCard title="视频创作发起台" :bordered="false" class="card-wrapper">
          <NForm :model="formModel" label-placement="top">
            <NGrid cols="1 m:2" responsive="screen" :x-gap="16">
              <NFormItemGi label="发起角色">
                <NRadioGroup v-model:value="formModel.creatorRole" name="creatorRole">
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
                <NSelect v-model:value="formModel.tags" multiple clearable :options="tagOptions" />
              </NFormItemGi>
            </NGrid>
          </NForm>

          <div
            class="mt-8 flex flex-wrap items-center justify-between gap-12px rounded-20px bg-[#f8fafc] px-18px py-16px"
          >
            <div>
              <div class="text-15px text-[#111827] font-600">发起后系统会先做输入审核，再生成结构化脚本供教师确认</div>
              <div class="mt-8px text-13px text-[#64748b]">如果当前为学生发起，脚本审核权会自动切换给任课教师。</div>
            </div>
            <NButton type="primary" size="large" round @click="submitTask">创建任务</NButton>
          </div>
        </NCard>
      </NGi>

      <NGi>
        <NCard title="年级与模板预设" :bordered="false" class="card-wrapper">
          <div class="flex-col-stretch gap-12px">
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
    </NGrid>

    <NGrid cols="1 xl:2" responsive="screen" :x-gap="16" :y-gap="16">
      <NGi>
        <NCard title="模板库" :bordered="false" class="card-wrapper">
          <div class="grid gap-12px">
            <div v-for="item in templatePresets" :key="item.id" class="library-card">
              <div class="flex items-center justify-between gap-8px">
                <div>
                  <div class="text-15px text-[#111827] font-600">{{ item.title }}</div>
                  <div class="mt-4px text-12px text-[#64748b]">{{ item.category }}</div>
                </div>
                <NTag size="small" :bordered="false">{{ item.scenes }} 镜头</NTag>
              </div>
              <p class="mt-8px text-13px text-[#475569] leading-22px">{{ item.description }}</p>
            </div>
          </div>
        </NCard>
      </NGi>
      <NGi>
        <NCard title="最近发起任务" :bordered="false" class="card-wrapper">
          <div class="grid gap-12px">
            <div v-for="item in videoTasks.slice(0, 3)" :key="item.id" class="task-brief">
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
.preset-card,
.library-card,
.task-brief {
  padding: 16px;
  border-radius: 18px;
  border: 1px solid rgb(148 163 184 / 0.16);
  background: linear-gradient(180deg, #ffffff 0%, #fbfdff 100%);
}
</style>
