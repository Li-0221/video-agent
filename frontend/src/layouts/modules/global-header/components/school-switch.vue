<script setup lang="ts">
import { computed } from 'vue';
import { useSchoolStore } from '@/store/modules/school';

defineOptions({
  name: 'SchoolSwitch'
});

const schoolStore = useSchoolStore();

const schoolOptions = computed(() =>
  schoolStore.schoolOptions.map(item => ({
    label: item.label,
    value: item.value
  }))
);
</script>

<template>
  <div class="school-switch">
    <div class="school-switch__meta">
      <span class="school-switch__label">演示学校</span>
      <span class="school-switch__type">{{ schoolStore.activeSchool.schoolType }}</span>
    </div>
    <NSelect
      :value="schoolStore.selectedSchoolId"
      :options="schoolOptions"
      size="small"
      class="school-switch__select"
      @update:value="schoolStore.setSelectedSchool"
    />
  </div>
</template>

<style scoped>
.school-switch {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px 12px;
  border-radius: 16px;
  background: rgb(248 250 252 / 0.92);
  border: 1px solid rgb(148 163 184 / 0.16);
}

.school-switch__meta {
  display: grid;
  gap: 2px;
}

.school-switch__label {
  font-size: 11px;
  line-height: 1;
  color: #64748b;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.school-switch__type {
  font-size: 12px;
  line-height: 1.2;
  color: #0f172a;
  font-weight: 700;
}

.school-switch__select {
  min-width: 220px;
}
</style>
