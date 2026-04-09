<script setup lang="ts">
import { computed } from 'vue';
import { useAuthStore } from '@/store/modules/auth';
import ProjectAvatar from '@/components/custom/project-avatar.vue';
import { $t } from '@/locales';

defineOptions({
  name: 'HeaderBanner'
});

const authStore = useAuthStore();

interface StatisticData {
  id: number;
  label: string;
  value: string;
}

const statisticData = computed<StatisticData[]>(() => [
  {
    id: 0,
    label: $t('page.home.projectCount'),
    value: '25'
  },
  {
    id: 1,
    label: $t('page.home.todo'),
    value: '4/16'
  },
  {
    id: 2,
    label: $t('page.home.message'),
    value: '12'
  }
]);
</script>

<template>
  <div class="px-12px">
    <div class="flex items-center justify-between">
      <div class="flex items-center gap-16px">
        <ProjectAvatar class="size-64px shrink-0 rounded-full bg-primary/10 p-4px" />
        <div>
          <h3 class="text-24px text-[var(--n-text-color)] font-600">
            {{ $t('page.home.greeting', { userName: authStore.userInfo.userName }) }}
          </h3>
          <p class="mt-4px text-14px text-gray-500">{{ $t('page.home.weatherDesc') }}</p>
        </div>
      </div>

      <NSpace :size="32" class="hidden sm:flex">
        <div v-for="item in statisticData" :key="item.id" class="flex flex-col items-end">
          <span class="mb-4px text-12px text-gray-400">{{ item.label }}</span>
          <span class="text-20px text-[var(--n-text-color)] font-600">{{ item.value }}</span>
        </div>
      </NSpace>
    </div>
  </div>
</template>

<style scoped></style>
