<script setup lang="ts">
import { computed } from 'vue';
import { $t } from '@/locales';

defineOptions({
  name: 'ProjectNews'
});

interface NewsItem {
  id: number;
  content: string;
  time: string;
}

const newses = computed<NewsItem[]>(() => [
  { id: 1, content: $t('page.home.projectNews.desc1'), time: '2021-05-28 22:22:22' },
  { id: 2, content: $t('page.home.projectNews.desc2'), time: '2021-10-27 10:24:54' },
  { id: 3, content: $t('page.home.projectNews.desc3'), time: '2021-10-31 22:43:12' },
  { id: 4, content: $t('page.home.projectNews.desc4'), time: '2021-11-03 20:33:31' },
  { id: 5, content: $t('page.home.projectNews.desc5'), time: '2021-11-07 22:45:32' }
]);
</script>

<template>
  <NCard
    :title="$t('page.home.projectNews.title')"
    :bordered="false"
    size="small"
    segmented
    class="h-full rounded-12px shadow-sm transition-shadow duration-300 hover:shadow-md"
  >
    <template #header-extra>
      <a class="text-14px text-primary hover:underline" href="javascript:;">
        {{ $t('page.home.projectNews.moreNews') }}
      </a>
    </template>
    <NList>
      <NListItem v-for="item in newses" :key="item.id">
        <template #prefix>
          <ProjectAvatar class="size-40px!" />
        </template>
        <div class="ml-4px flex flex-col gap-4px">
          <span class="text-14px text-[var(--n-text-color)]">{{ item.content }}</span>
          <span class="text-12px text-gray-400">{{ item.time }}</span>
        </div>
      </NListItem>
    </NList>
  </NCard>
</template>

<style scoped></style>
