<script setup lang="ts">
import { $t } from '@/locales';

defineOptions({
  name: 'CreativityBanner'
});
</script>

<template>
  <NCard
    :title="$t('page.home.creativity')"
    :bordered="false"
    size="small"
    class="h-full rounded-12px shadow-sm transition-shadow duration-300 hover:shadow-md"
  >
    <div class="h-full flex-center">
      <icon-local-banner class="text-400px text-primary sm:text-320px" />
    </div>
  </NCard>
</template>

<style scoped></style>
