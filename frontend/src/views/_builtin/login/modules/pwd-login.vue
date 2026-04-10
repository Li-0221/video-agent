<script setup lang="ts">
import { computed, reactive } from 'vue';
import { loginModuleRecord } from '@/constants/app';
import { useAuthStore } from '@/store/modules/auth';
import { useRouterPush } from '@/hooks/common/router';
import { useFormRules, useNaiveForm } from '@/hooks/common/form';
import { $t } from '@/locales';

defineOptions({
  name: 'PwdLogin'
});

const authStore = useAuthStore();
const { toggleLoginModule } = useRouterPush();
const { formRef, validate } = useNaiveForm();

interface FormModel {
  userName: string;
  password: string;
}

const model: FormModel = reactive({
  userName: 'Soybean',
  password: '123456'
});

const demoAccounts = [
  { label: '教师', userName: 'teacher', desc: '发起任务、强制审稿、终审放行' },
  { label: '学生', userName: 'student', desc: '提交作业、查看可见作品、违规重提' },
  { label: '学校管理员', userName: 'admin', desc: '维护校徽校训、学校素材和标签' },
  { label: '平台运营', userName: 'operator', desc: '跨校巡检、规则调权、治理运营' }
];

const rules = computed<Record<keyof FormModel, App.Global.FormRule[]>>(() => {
  // inside computed to make locale reactive, if not apply i18n, you can define it without computed
  const { formRules } = useFormRules();

  return {
    userName: formRules.userName,
    password: formRules.pwd
  };
});

async function handleSubmit() {
  await validate();
  await authStore.login(model.userName, model.password);
}

function applyDemoAccount(userName: string) {
  model.userName = userName;
  model.password = '123456';
}
</script>

<template>
  <NForm ref="formRef" :model="model" :rules="rules" size="large" :show-label="false" @keyup.enter="handleSubmit">
    <NFormItem path="userName">
      <NInput v-model:value="model.userName" :placeholder="$t('page.login.common.userNamePlaceholder')" />
    </NFormItem>
    <NFormItem path="password">
      <NInput
        v-model:value="model.password"
        type="password"
        show-password-on="click"
        :placeholder="$t('page.login.common.passwordPlaceholder')"
      />
    </NFormItem>
    <div class="mb-16px">
      <div class="mb-8px text-13px text-[#64748b]">快捷演示身份</div>
      <div class="grid gap-10px">
        <NButton
          v-for="item in demoAccounts"
          :key="item.userName"
          size="small"
          class="demo-role-btn"
          tertiary
          @click="applyDemoAccount(item.userName)"
        >
          <div class="demo-role-btn__content">
            <div class="demo-role-btn__title">{{ item.label }}</div>
            <div class="demo-role-btn__desc">{{ item.desc }}</div>
          </div>
        </NButton>
      </div>
    </div>
    <NSpace vertical :size="24">
      <div class="flex-y-center justify-between">
        <NCheckbox>{{ $t('page.login.pwdLogin.rememberMe') }}</NCheckbox>
        <NButton quaternary @click="toggleLoginModule('reset-pwd')">
          {{ $t('page.login.pwdLogin.forgetPassword') }}
        </NButton>
      </div>
      <NButton type="primary" size="large" round block :loading="authStore.loginLoading" @click="handleSubmit">
        {{ $t('common.confirm') }}
      </NButton>
      <div class="flex-y-center justify-between gap-12px">
        <NButton class="flex-1" block @click="toggleLoginModule('code-login')">
          {{ $t(loginModuleRecord['code-login']) }}
        </NButton>
        <NButton class="flex-1" block @click="toggleLoginModule('register')">
          {{ $t(loginModuleRecord.register) }}
        </NButton>
      </div>
    </NSpace>
  </NForm>
</template>

<style scoped>
.demo-role-btn {
  justify-content: flex-start;
  height: auto;
  padding: 10px 12px;
  border-radius: 18px;
}

.demo-role-btn__content {
  display: grid;
  gap: 4px;
  text-align: left;
}

.demo-role-btn__title {
  font-size: 13px;
  font-weight: 700;
  color: #111827;
}

.demo-role-btn__desc {
  font-size: 12px;
  line-height: 1.5;
  color: #64748b;
  white-space: normal;
}
</style>
