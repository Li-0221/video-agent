<script setup lang="ts">
import { computed } from 'vue';
import type { Component } from 'vue';
import { mixColor } from '@sa/color';
import { loginModuleRecord } from '@/constants/app';
import { useAppStore } from '@/store/modules/app';
import { useSchoolStore } from '@/store/modules/school';
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
const schoolStore = useSchoolStore();
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

const loginHighlights = computed(() => ['教师强制审稿', '学生提交后代审', '学校品牌素材隔离', '规则中台与复审']);
</script>

<template>
  <div class="login-shell relative size-full flex overflow-hidden bg-white dark:bg-[#121212]">
    <!-- Left Side: Brand Area (Hidden on mobile) -->
    <div
      class="login-brand-panel relative hidden h-full w-1/2 flex-col items-center justify-center overflow-hidden md:flex"
    >
      <!-- Gradient Overlay -->
      <div class="absolute inset-0 z-10 from-primary/90 to-primary/70 bg-gradient-to-br"></div>
      <!-- Wave Background -->
      <WaveBg :theme-color="bgThemeColor" class="absolute inset-0 z-0" />

      <!-- Content -->
      <div class="login-brand-content relative z-20 flex flex-col items-center gap-6 p-10 text-white">
        <!-- Logo Wrapper with glass effect -->
        <div
          class="login-brand-logo size-120px flex-center border border-white/20 rounded-3xl bg-white/20 shadow-xl backdrop-blur-sm"
        >
          <SystemLogo class="text-64px text-white" />
        </div>

        <div class="max-w-lg text-center">
          <h2 class="mb-4 text-42px font-bold leading-tight tracking-wide">
            {{ schoolStore.activeSchool.systemName }}
          </h2>
          <p class="text-18px text-white/90 font-light leading-relaxed">
            {{ schoolStore.activeSchool.slogan }}，覆盖发起、审稿、生成、复审和学校定制。
          </p>
        </div>

        <div class="login-highlight-grid">
          <div v-for="item in loginHighlights" :key="item" class="login-highlight-chip">{{ item }}</div>
        </div>
      </div>
    </div>

    <!-- Right Side: Login Form -->
    <div class="login-form-panel relative h-full flex flex-col flex-1 bg-white dark:bg-[#18181c]">
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
        <div class="login-form-surface max-w-460px w-full px-8 py-12">
          <!-- Mobile Logo (Hidden on Desktop) -->
          <div class="mb-10 flex flex-col items-center gap-4 md:hidden">
            <SystemLogo class="text-48px text-primary" />
            <h3 class="text-24px text-primary font-bold">{{ schoolStore.activeSchool.shortName }}</h3>
          </div>

          <!-- Welcome Text -->
          <div class="mb-10 text-left">
            <h3 class="mb-3 text-32px text-gray-900 font-bold dark:text-white">{{ $t(activeModule.label) }}</h3>
            <p class="text-16px text-gray-500 font-medium">
              当前演示学校：{{
                schoolStore.activeSchool.schoolName
              }}。可使用快捷身份体验教师、学生、学校管理员和平台运营视角。
            </p>
          </div>

          <div class="login-insight-strip">
            <div class="login-insight-strip__item">
              <span class="login-insight-strip__label">当前学校</span>
              <strong>{{ schoolStore.activeSchool.shortName }}</strong>
            </div>
            <div class="login-insight-strip__item">
              <span class="login-insight-strip__label">演示重点</span>
              <strong>多角色工作流</strong>
            </div>
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

<style scoped>
.login-shell::before {
  content: '';
  position: absolute;
  inset: 20px;
  border-radius: 36px;
  background:
    radial-gradient(circle at top left, rgb(255 255 255 / 0.78), transparent 18%),
    linear-gradient(135deg, rgb(255 255 255 / 0.42), transparent 36%);
  pointer-events: none;
}

.login-brand-panel::after {
  content: '';
  position: absolute;
  inset: auto -120px -120px auto;
  width: 320px;
  height: 320px;
  border-radius: 9999px;
  background: rgb(255 255 255 / 0.16);
  filter: blur(8px);
}

.login-brand-content {
  animation: brand-float-in 0.8s ease both;
}

.login-brand-logo {
  box-shadow:
    0 16px 40px rgb(15 23 42 / 0.18),
    inset 0 1px 0 rgb(255 255 255 / 0.24);
}

.login-highlight-grid {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 10px;
  max-width: 620px;
}

.login-highlight-chip {
  padding: 8px 14px;
  border-radius: 9999px;
  background: rgb(255 255 255 / 0.16);
  border: 1px solid rgb(255 255 255 / 0.18);
  backdrop-filter: blur(10px);
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.04em;
}

.login-form-panel {
  background:
    radial-gradient(circle at top, rgb(191 219 254 / 0.16), transparent 28%),
    linear-gradient(180deg, rgb(255 255 255 / 0.88) 0%, rgb(248 250 252 / 0.96) 100%);
}

.login-form-surface {
  position: relative;
}

.login-insight-strip {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 12px;
  margin-bottom: 24px;
  padding: 12px;
  border-radius: 20px;
  border: 1px solid rgb(148 163 184 / 0.14);
  background: rgb(255 255 255 / 0.72);
  box-shadow: 0 16px 32px rgb(15 23 42 / 0.06);
}

.login-insight-strip__item {
  display: grid;
  gap: 4px;
  padding: 10px 12px;
  border-radius: 16px;
  background: rgb(248 250 252 / 0.88);
}

.login-insight-strip__item strong {
  color: #111827;
  font-size: 14px;
}

.login-insight-strip__label {
  font-size: 11px;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: #64748b;
}

@keyframes brand-float-in {
  from {
    opacity: 0;
    transform: translateY(18px) scale(0.98);
  }

  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}
</style>
