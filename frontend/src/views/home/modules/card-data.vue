<script setup lang="ts">
import { computed } from 'vue';
import { $t } from '@/locales';

defineOptions({
  name: 'CardData'
});

interface CardData {
  key: string;
  title: string;
  value: number;
  unit: string;
  icon: string;
}

const cardData = computed<CardData[]>(() => [
  {
    key: 'visitCount',
    title: $t('page.home.visitCount'),
    value: 9725,
    unit: '',
    icon: 'ant-design:bar-chart-outlined'
  },
  {
    key: 'turnover',
    title: $t('page.home.turnover'),
    value: 1026,
    unit: '$',
    icon: 'ant-design:money-collect-outlined'
  },
  {
    key: 'downloadCount',
    title: $t('page.home.downloadCount'),
    value: 970925,
    unit: '',
    icon: 'carbon:document-download'
  },
  {
    key: 'dealCount',
    title: $t('page.home.dealCount'),
    value: 9527,
    unit: '',
    icon: 'ant-design:trademark-circle-outlined'
  }
]);
</script>

<template>
  <NGrid cols="s:1 m:2 l:4" responsive="screen" :x-gap="16" :y-gap="16">
    <NGi v-for="item in cardData" :key="item.key">
      <NCard :bordered="false" class="h-full rounded-12px shadow-sm transition-shadow duration-300 hover:shadow-md">
        <div class="flex items-center justify-between">
          <div class="flex flex-col gap-4px">
            <span class="text-14px text-gray-500 font-500">{{ item.title }}</span>
            <div class="flex items-baseline gap-4px">
              <span v-if="item.unit" class="text-16px text-gray-500">{{ item.unit }}</span>
              <CountTo :start-value="1" :end-value="item.value" class="text-28px text-[var(--n-text-color)] font-600" />
            </div>
          </div>
          <div class="rounded-8px bg-primary/10 p-12px text-primary">
            <SvgIcon :icon="item.icon" class="text-24px" />
          </div>
        </div>
      </NCard>
    </NGi>
  </NGrid>
</template>

<style scoped></style>
