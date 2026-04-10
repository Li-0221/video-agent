import { computed } from 'vue';
import { useAuthStore } from '@/store/modules/auth';

export function useDemoAccess() {
  const authStore = useAuthStore();

  const roleSet = computed(() => new Set(authStore.userInfo.roles));
  const buttonSet = computed(() => new Set(authStore.userInfo.buttons));

  const isTeacher = computed(() => roleSet.value.has('R_TEACHER'));
  const isStudent = computed(() => roleSet.value.has('R_STUDENT'));
  const isSchoolAdmin = computed(() => roleSet.value.has('R_SCHOOL_ADMIN'));
  const isPlatformOps = computed(() => roleSet.value.has('R_PLATFORM_OPS'));

  function hasButton(code: string) {
    return buttonSet.value.has(code);
  }

  return {
    isTeacher,
    isStudent,
    isSchoolAdmin,
    isPlatformOps,
    hasButton
  };
}
