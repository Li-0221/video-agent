<script setup lang="ts">
import { computed } from 'vue';
import type { Component } from 'vue';
import { mixColor } from '@sa/color';
import { loginModuleRecord } from '@/constants/app';
import { useAppStore } from '@/store/modules/app';
import { useThemeStore } from '@/store/modules/theme';
import { $t } from '@/locales';
import PwdLogin from './modules/pwd-login.vue';
import CodeLogin from './modules/code-login.vue';
import Register from './modules/register.vue';
import ResetPwd from './modules/reset-pwd.vue';

interface Props {
  /** The login module */
  module?: UnionKey.LoginModule;
}

const props = defineProps<Props>();

const appStore = useAppStore();
const themeStore = useThemeStore();

interface LoginModule {
  label: App.I18n.I18nKey;
  component: Component;
}

const moduleMap: Record<UnionKey.LoginModule, LoginModule> = {
  'pwd-login': { label: loginModuleRecord['pwd-login'], component: PwdLogin },
  'code-login': { label: loginModuleRecord['code-login'], component: CodeLogin },
  register: { label: loginModuleRecord.register, component: Register },
  'reset-pwd': { label: loginModuleRecord['reset-pwd'], component: ResetPwd }
};

const activeModule = computed(() => moduleMap[props.module || 'pwd-login']);

const bgThemeColor = computed(() =>
  themeStore.darkMode ? mixColor(themeStore.themeColor, '#000000', 0.5) : themeStore.themeColor
);
</script>

<template>
  <div class="relative size-full flex overflow-hidden bg-white dark:bg-[#121212]">
    <!-- Left Side: Brand Area (Hidden on mobile) -->
    <div class="relative hidden h-full w-1/2 flex-col items-center justify-center overflow-hidden md:flex">
      <!-- Gradient Overlay -->
      <div class="absolute inset-0 z-10 from-primary/90 to-primary/70 bg-gradient-to-br"></div>
      <!-- Wave Background -->
      <WaveBg :theme-color="bgThemeColor" class="absolute inset-0 z-0" />

      <!-- Content -->
      <div class="relative z-20 flex flex-col items-center gap-6 p-10 text-white">
        <!-- Logo Wrapper with glass effect -->
        <div class="size-120px flex-center border border-white/20 rounded-3xl bg-white/20 shadow-xl backdrop-blur-sm">
          <SystemLogo class="text-64px text-white" />
        </div>

        <div class="max-w-lg text-center">
          <h2 class="mb-4 text-42px font-bold leading-tight tracking-wide">{{ $t('system.title') }}</h2>
          <p class="text-18px text-white/90 font-light leading-relaxed">
            A fresh and elegant admin template based on Vite 7, TypeScript and Naive UI.
          </p>
        </div>
      </div>
    </div>

    <!-- Right Side: Login Form -->
    <div class="relative h-full flex flex-col flex-1 bg-white dark:bg-[#18181c]">
      <!-- Header Utility (Top Right) -->
      <header class="absolute right-0 top-0 z-50 flex items-center gap-4 p-6">
        <ThemeSchemaSwitch
          :theme-schema="themeStore.themeScheme"
          class="cursor-pointer text-20px text-gray-500 transition-colors hover:text-primary"
          @switch="themeStore.toggleThemeScheme"
        />
        <LangSwitch
          v-if="themeStore.header.multilingual.visible"
          :lang="appStore.locale"
          :lang-options="appStore.localeOptions"
          class="cursor-pointer text-20px text-gray-500 transition-colors hover:text-primary"
          @change-lang="appStore.changeLocale"
        />
      </header>

      <!-- Main Content Center -->
      <div class="flex-center flex-1 overflow-y-auto">
        <div class="max-w-420px w-full px-8 py-12">
          <!-- Mobile Logo (Hidden on Desktop) -->
          <div class="mb-10 flex flex-col items-center gap-4 md:hidden">
            <SystemLogo class="text-48px text-primary" />
            <h3 class="text-24px text-primary font-bold">{{ $t('system.title') }}</h3>
          </div>

          <!-- Welcome Text -->
          <div class="mb-10 text-left">
            <h3 class="mb-3 text-32px text-gray-900 font-bold dark:text-white">{{ $t(activeModule.label) }}</h3>
            <p class="text-16px text-gray-500 font-medium">Welcome back! Please enter your details.</p>
          </div>

          <!-- Transition Wrapper for Form -->
          <div class="login-form-wrapper w-full">
            <Transition :name="themeStore.page.animateMode" mode="out-in" appear>
              <component :is="activeModule.component" />
            </Transition>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
