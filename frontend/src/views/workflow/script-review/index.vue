<script setup lang="ts">
import { ref } from 'vue';
import { scriptReviewScenes } from '@/mock/video-platform';

const scenes = ref(structuredClone(scriptReviewScenes));

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
            审稿台覆盖 PRD 中的三个关键动作：逐镜核对旁白与画面、明确修改只影响哪一层素材、
            以及在点击“确认脚本无误”之前，阻止任何素材批量生成。
          </p>
        </div>
        <NButton type="primary" round size="large" @click="confirmScript">确认脚本无误</NButton>
      </div>
    </NCard>

    <NGrid cols="1 xl:3" responsive="screen" :x-gap="16" :y-gap="16">
      <NGi span="1 xl:2">
        <div class="flex-col-stretch gap-16px">
          <NCard v-for="scene in scenes" :key="scene.id" :title="scene.title" :bordered="false" class="card-wrapper">
            <div class="mb-12px flex items-center gap-10px text-12px text-[#64748b]">
              <NTag size="small" :bordered="false" type="info">{{ scene.duration }}</NTag>
              <span>教师可直接修改旁白与画面描述</span>
            </div>
            <NForm label-placement="top">
              <NFormItem label="画面描述">
                <NInput v-model:value="scene.visual" type="textarea" :autosize="{ minRows: 3, maxRows: 5 }" />
              </NFormItem>
              <NFormItem label="旁白文本">
                <NInput v-model:value="scene.narration" type="textarea" :autosize="{ minRows: 3, maxRows: 5 }" />
              </NFormItem>
            </NForm>
            <div class="flex flex-wrap items-center justify-between gap-12px">
              <p class="text-13px text-[#64748b] leading-22px">{{ scene.teacherTip }}</p>
              <NSpace>
                <NButton round @click="regenerateVoice(scene.title)">仅重合成配音</NButton>
                <NButton type="primary" ghost round @click="regenerateScene(scene.title)">重绘画面并重配音</NButton>
              </NSpace>
            </div>
          </NCard>
        </div>
      </NGi>

      <NGi>
        <NCard title="适龄表达校对单" :bordered="false" class="card-wrapper">
          <div class="check-list">
            <div class="check-item">
              <h3>1. 学段是否匹配</h3>
              <p>当前预设为“小学 5-6 年级”，语速建议 220 字/分钟，可手动覆盖。</p>
            </div>
            <div class="check-item">
              <h3>2. 每个镜头是否有明确画面</h3>
              <p>确认画面描述足够具体，否则后续文生图 / 文生视频容易失焦。</p>
            </div>
            <div class="check-item">
              <h3>3. 结尾是否能承接课堂</h3>
              <p>应保留行动倡议或课堂追问，让视频成为教学的一部分而不是独立播放素材。</p>
            </div>
            <div class="check-item">
              <h3>4. 是否触发强制复审规则</h3>
              <p>涉及真实历史人物、敏感标签或中高风险提示时，终审必须由教师完整看片确认。</p>
            </div>
          </div>
        </NCard>

        <NCard title="修改影响范围" :bordered="false" class="card-wrapper">
          <ul class="impact-list">
            <li>只改旁白：保留画面素材，只重合成配音和字幕。</li>
            <li>改画面描述：重新生成画面素材，并同步重合成配音。</li>
            <li>改音色 / 语速 / 配乐：不影响脚本镜头结构，仅影响音轨层。</li>
            <li>未点击教师确认：禁止系统进入批量生成阶段。</li>
          </ul>
        </NCard>
      </NGi>
    </NGrid>
  </div>
</template>

<style scoped>
.check-list,
.impact-list {
  display: grid;
  gap: 12px;
}

.check-item {
  padding: 14px 16px;
  border-radius: 16px;
  background: #f8fafc;
  border: 1px solid rgb(148 163 184 / 0.16);
}

.check-item h3 {
  margin: 0;
  font-size: 14px;
  font-weight: 700;
  color: #111827;
}

.check-item p,
.impact-list li {
  margin: 8px 0 0;
  font-size: 13px;
  line-height: 1.8;
  color: #475569;
}

.impact-list {
  margin: 0;
  padding-left: 18px;
}
</style>
