import { computed, effectScope, onScopeDispose, ref, watch } from 'vue';
import { defineStore } from 'pinia';
import { localStg } from '@/utils/storage';
import { SetupStoreId } from '@/enum';
import { schoolThemeProfiles } from '@/mock/video-platform';
import { useAuthStore } from '../auth';
import { useThemeStore } from '../theme';

export const useSchoolStore = defineStore(SetupStoreId.School, () => {
  const scope = effectScope();
  const authStore = useAuthStore();
  const themeStore = useThemeStore();

  const selectedSchoolId = ref(localStg.get('selectedSchoolId') || schoolThemeProfiles[0].id);

  const schoolOptions = computed(() =>
    schoolThemeProfiles.map(item => ({
      label: item.schoolName,
      value: item.id
    }))
  );

  const activeSchool = computed(
    () => schoolThemeProfiles.find(item => item.id === selectedSchoolId.value) || schoolThemeProfiles[0]
  );

  function applySchoolTheme() {
    const school = activeSchool.value;

    themeStore.updateThemeColors('primary', school.theme.primary);
    themeStore.watermark.text = school.watermarkText;
  }

  function setSelectedSchool(schoolId: string) {
    selectedSchoolId.value = schoolId;
    localStg.set('selectedSchoolId', schoolId);
    applySchoolTheme();
  }

  function syncSchoolFromUser() {
    if (authStore.userInfo.schoolId && authStore.userInfo.schoolId !== selectedSchoolId.value) {
      setSelectedSchool(authStore.userInfo.schoolId);
      return;
    }

    applySchoolTheme();
  }

  scope.run(() => {
    watch(
      () => authStore.userInfo.schoolId,
      () => {
        syncSchoolFromUser();
      },
      { immediate: true }
    );
  });

  onScopeDispose(() => {
    scope.stop();
  });

  return {
    selectedSchoolId,
    schoolOptions,
    activeSchool,
    setSelectedSchool,
    syncSchoolFromUser
  };
});
