<script lang="ts" setup>
import { computed } from 'vue';
import { useSchoolStore } from '@/store/modules/school';

defineOptions({ name: 'SystemLogo' });

interface Props {
  compact?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  compact: false
});

const schoolStore = useSchoolStore();

const activeTheme = computed(() => schoolStore.activeSchool.theme);
</script>

<template>
  <div
    class="school-logo"
    :class="{ 'school-logo--compact': props.compact }"
    :style="{
      '--school-primary': activeTheme.primary,
      '--school-secondary': activeTheme.secondary,
      '--school-accent': activeTheme.accent
    }"
  >
    <div class="school-logo__mark">
      <span>{{ schoolStore.activeSchool.logoText }}</span>
    </div>
  </div>
</template>

<style scoped>
.school-logo {
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.school-logo__mark {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 42px;
  height: 42px;
  border-radius: 14px;
  background:
    radial-gradient(circle at top left, rgb(255 255 255 / 0.88), transparent 38%),
    linear-gradient(145deg, var(--school-primary) 0%, var(--school-secondary) 100%);
  box-shadow:
    inset 0 1px 0 rgb(255 255 255 / 0.18),
    0 10px 24px rgb(15 23 42 / 0.12);
}

.school-logo__mark span {
  color: white;
  font-size: 13px;
  font-weight: 800;
  letter-spacing: 0.08em;
}

.school-logo--compact .school-logo__mark {
  width: 34px;
  height: 34px;
  border-radius: 12px;
}

.school-logo--compact .school-logo__mark span {
  font-size: 11px;
}
</style>
