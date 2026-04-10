<script setup lang="ts">
import { computed, reactive, ref } from 'vue';
import { useSchoolStore } from '@/store/modules/school';
import { useDemoAccess } from '@/hooks/business/demo-access';
import { gradePresets, scriptReviewScenes } from '@/mock/video-platform';

const schoolStore = useSchoolStore();
const { hasButton } = useDemoAccess();

const originalScenes = structuredClone(scriptReviewScenes);
const scenes = ref(structuredClone(scriptReviewScenes));
const activeSceneId = ref(scenes.value[0]?.id || '');

const reviewConfig = reactive({
  gradeBand: '小学 5-6 年级',
  voice: '温和女声',
  speechRate: '220 字/分钟',
  subtitleStyle: '课堂黄底字幕',
  backgroundMusic: '轻钢琴'
});

const activeScene = computed(() => scenes.value.find(item => item.id === activeSceneId.value) || scenes.value[0]);
const totalDuration = computed(() =>
  scenes.value.reduce((total, item) => total + Number(item.duration.replace(/[^\d]/g, '') || 0), 0)
);
const changedSceneCount = computed(
  () =>
    scenes.value.filter((item, index) => {
      const original = originalScenes[index];

      return original && (item.visual !== original.visual || item.narration !== original.narration);
    }).length
);
const activeSceneIndex = computed(() => scenes.value.findIndex(item => item.id === activeSceneId.value));
const activeGrade = computed(() => gradePresets.find(item => item.label === reviewConfig.gradeBand) || gradePresets[2]);

const reviewSummary = computed(() => [
  {
    label: '镜头总数',
    value: `${scenes.value.length} 个`,
    desc: '教师可逐镜检查，也可在这里做顺序微调。'
  },
  {
    label: '总时长',
    value: `${totalDuration.value} 秒`,
    desc: 'MVP 默认控制在 3 分钟以内。'
  },
  {
    label: '已修改镜头',
    value: `${changedSceneCount.value} 个`,
    desc: '系统会根据修改内容决定只重配音还是重绘画面。'
  },
  {
    label: '适龄参数',
    value: activeGrade.value.speechRate,
    desc: `${activeGrade.value.style} · ${activeGrade.value.languageLevel}`
  }
]);

const guardChecklist = [
  '教师必须逐镜确认旁白和画面描述，未确认前不得进入批量生成。',
  '只改旁白时只重合成配音和字幕，不重绘画面，节约时延与成本。',
  '改画面描述时必须重新生成该镜头画面，并同步重合成配音。',
  '若涉及历史人物、敏感表达或低龄词汇偏难，终审阶段仍需重点复查。'
];

function moveScene(direction: 'up' | 'down') {
  const index = activeSceneIndex.value;

  if (direction === 'up' && index > 0) {
    [scenes.value[index - 1], scenes.value[index]] = [scenes.value[index], scenes.value[index - 1]];
  }

  if (direction === 'down' && index < scenes.value.length - 1) {
    [scenes.value[index], scenes.value[index + 1]] = [scenes.value[index + 1], scenes.value[index]];
  }
}

function confirmScript() {
  window.$message?.success('脚本已确认，系统可以继续进入素材批量生成阶段。');
}

function regenerateVoice(sceneTitle: string) {
  window.$message?.success(`已按“仅重合成配音”策略处理：${sceneTitle}`);
}

function regenerateScene(sceneTitle: string) {
  window.$message?.success(`已按“重绘画面 + 重合成配音”策略处理：${sceneTitle}`);
}
</script>

<template>
  <div class="flex-col-stretch gap-16px">
    <NCard :bordered="false" class="card-wrapper">
      <div class="flex flex-wrap items-start justify-between gap-16px">
        <div>
          <p class="text-12px text-[#64748b] tracking-[0.24em] uppercase">Teacher Required Review</p>
          <h2 class="mt-8px text-28px text-[#111827] font-700">系统已经产出结构化脚本，但必须由教师确认后才能继续</h2>
          <p class="mt-10px max-w-960px text-14px text-[#475569] leading-24px">
            当前学校为 {{ schoolStore.activeSchool.schoolName }}。这里完整对应 PRD 中的“教师强制脚本审核”节点：
            逐镜核对旁白与画面、判断修改只影响哪一层素材、在点击“确认脚本无误”之前阻止任何批量生成。
          </p>
        </div>
        <NButton v-if="hasButton('script:review')" type="primary" round size="large" @click="confirmScript">
          确认脚本无误
        </NButton>
      </div>
    </NCard>

    <NGrid cols="1 s:2 l:4" responsive="screen" :x-gap="16" :y-gap="16">
      <NGi v-for="item in reviewSummary" :key="item.label">
        <NCard :bordered="false" class="summary-card card-wrapper">
          <div class="text-13px text-[#64748b]">{{ item.label }}</div>
          <div class="mt-10px text-28px text-[#111827] font-700">{{ item.value }}</div>
          <div class="mt-8px text-13px text-[#64748b] leading-22px">{{ item.desc }}</div>
        </NCard>
      </NGi>
    </NGrid>

    <NGrid cols="1 xl:4" responsive="screen" :x-gap="16" :y-gap="16">
      <NGi>
        <NCard title="镜头顺序" :bordered="false" class="card-wrapper">
          <div class="flex-col-stretch gap-12px">
            <button
              v-for="(scene, index) in scenes"
              :key="scene.id"
              type="button"
              class="scene-nav"
              :class="{ 'scene-nav--active': activeScene?.id === scene.id }"
              @click="activeSceneId = scene.id"
            >
              <div class="flex items-center justify-between gap-8px">
                <span class="text-14px text-[#111827] font-700">镜头 {{ index + 1 }}</span>
                <NTag size="small" :bordered="false" type="info">{{ scene.duration }}</NTag>
              </div>
              <div class="mt-8px text-13px text-[#334155]">{{ scene.title }}</div>
            </button>
          </div>
        </NCard>
      </NGi>

      <NGi span="1 xl:2">
        <NCard v-if="activeScene" :title="activeScene.title" :bordered="false" class="card-wrapper">
          <div class="grid gap-16px">
            <div class="scene-meta">
              <div class="scene-meta__item">
                <div class="scene-meta__label">当前镜头</div>
                <div class="scene-meta__value">第 {{ activeSceneIndex + 1 }} 镜</div>
              </div>
              <div class="scene-meta__item">
                <div class="scene-meta__label">修改建议</div>
                <div class="scene-meta__value">优先先改旁白，再判断是否需要动画面</div>
              </div>
            </div>

            <div class="flex flex-wrap gap-10px">
              <NButton size="small" :disabled="activeSceneIndex <= 0" @click="moveScene('up')">上移一镜</NButton>
              <NButton size="small" :disabled="activeSceneIndex >= scenes.length - 1" @click="moveScene('down')">
                下移一镜
              </NButton>
            </div>

            <NForm label-placement="top">
              <NFormItem label="画面描述">
                <NInput v-model:value="activeScene.visual" type="textarea" :autosize="{ minRows: 4, maxRows: 6 }" />
              </NFormItem>
              <NFormItem label="旁白文本">
                <NInput v-model:value="activeScene.narration" type="textarea" :autosize="{ minRows: 4, maxRows: 6 }" />
              </NFormItem>
            </NForm>

            <div class="impact-panel">
              <div class="text-14px text-[#111827] font-700">修改影响范围</div>
              <p class="mt-8px text-13px text-[#475569] leading-22px">{{ activeScene.teacherTip }}</p>
            </div>

            <div class="flex flex-wrap items-center justify-between gap-12px">
              <p class="text-13px text-[#64748b] leading-22px">
                如果这里只改旁白，建议先走“仅重合成配音”；如果补充了背景、角色或道具描述，就走“重绘画面并重配音”。
              </p>
              <NSpace>
                <NButton v-if="hasButton('scene:voice-regenerate')" round @click="regenerateVoice(activeScene.title)">
                  仅重合成配音
                </NButton>
                <NButton
                  v-if="hasButton('scene:visual-regenerate')"
                  type="primary"
                  ghost
                  round
                  @click="regenerateScene(activeScene.title)"
                >
                  重绘画面并重配音
                </NButton>
              </NSpace>
            </div>
          </div>
        </NCard>
      </NGi>

      <NGi>
        <div class="flex-col-stretch gap-16px">
          <NCard title="合成参数" :bordered="false" class="card-wrapper">
            <NForm label-placement="top">
              <NFormItem label="适配年级">
                <NSelect
                  v-model:value="reviewConfig.gradeBand"
                  :options="gradePresets.map(item => ({ label: item.label, value: item.label }))"
                />
              </NFormItem>
              <NFormItem label="默认音色">
                <NInput v-model:value="reviewConfig.voice" />
              </NFormItem>
              <NFormItem label="语速">
                <NInput v-model:value="reviewConfig.speechRate" />
              </NFormItem>
              <NFormItem label="字幕样式">
                <NInput v-model:value="reviewConfig.subtitleStyle" />
              </NFormItem>
              <NFormItem label="背景音乐">
                <NInput v-model:value="reviewConfig.backgroundMusic" />
              </NFormItem>
            </NForm>
          </NCard>

          <NCard title="教师审稿守则" :bordered="false" class="card-wrapper">
            <ul class="guide-list">
              <li v-for="item in guardChecklist" :key="item">{{ item }}</li>
            </ul>
          </NCard>
        </div>
      </NGi>
    </NGrid>
  </div>
</template>

<style scoped>
.summary-card,
.scene-nav,
.scene-meta,
.impact-panel {
  border-radius: 18px;
  border: 1px solid rgb(148 163 184 / 0.16);
  background: linear-gradient(180deg, #ffffff 0%, #fbfdff 100%);
}

.summary-card,
.scene-meta,
.impact-panel {
  padding: 16px;
}

.scene-nav {
  width: 100%;
  padding: 14px;
  text-align: left;
  transition: all 0.2s ease;
}

.scene-nav--active {
  border-color: rgb(59 130 246 / 0.35);
  box-shadow: 0 8px 24px rgb(59 130 246 / 0.1);
}

.scene-meta {
  display: grid;
  gap: 12px;
}

.scene-meta__item {
  padding: 12px 14px;
  border-radius: 14px;
  background: #f8fafc;
}

.scene-meta__label {
  font-size: 12px;
  color: #64748b;
}

.scene-meta__value {
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
