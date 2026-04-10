<script setup lang="ts">
import { useSchoolStore } from '@/store/modules/school';

defineOptions({
  name: 'GlobalLogo'
});

interface Props {
  /** Whether to show the title */
  showTitle?: boolean;
}

withDefaults(defineProps<Props>(), {
  showTitle: true
});

const schoolStore = useSchoolStore();
</script>

<template>
  <RouterLink to="/" class="w-full flex-center nowrap-hidden">
    <SystemLogo class="text-32px text-primary" />
    <h2
      v-show="showTitle"
      class="pl-8px text-nowrap text-16px text-[var(--n-text-color)] font-bold transition duration-300 ease-in-out"
    >
      {{ schoolStore.activeSchool.systemName }}
    </h2>
  </RouterLink>
</template>

<style scoped></style>
