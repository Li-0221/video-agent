<script setup lang="ts">
import { computed } from 'vue';
import { useAuthStore } from '@/store/modules/auth';
import { useSchoolStore } from '@/store/modules/school';
import { useDemoAccess } from '@/hooks/business/demo-access';
import { demoAccounts, roleProfiles } from '@/mock/video-platform';

const authStore = useAuthStore();
const schoolStore = useSchoolStore();
const { isPlatformOps, isSchoolAdmin, isStudent, isTeacher } = useDemoAccess();

const permissionMatrix = [
  ['自由输入指令', '教师 / 学生', '学生能提交但不能审稿'],
  ['脚本强制审核', '教师', '教师确认前禁止进入批量生成'],
  ['审批学生视频', '教师', '决定学生作品是否可见'],
  ['上传校徽 / 校训 / 背景图', '学校管理员', '学校素材只在本校生效'],
  ['查看全校生成记录', '学校管理员', '不允许跨校查看'],
  ['维护全局审核阈值', '平台运营', '跨校统一规则与阈值管理']
];

const currentRole = computed(() => {
  if (isTeacher.value) return '教师';
  if (isStudent.value) return '学生';
  if (isSchoolAdmin.value) return '学校管理员';
  if (isPlatformOps.value) return '平台运营';
  return '未登录';
});

const menuMatrix = computed(() => [
  { menu: '创作发起台', visible: isTeacher.value || isStudent.value, desc: '教师与学生可见，学生仅能提交与重提。' },
  { menu: '脚本审核台', visible: isTeacher.value, desc: '仅教师拥有逐镜审核权。' },
  { menu: '生成队列', visible: isTeacher.value || isStudent.value, desc: '教师可微调，学生仅查看和重提。' },
  { menu: '安全复审', visible: isTeacher.value || isPlatformOps.value, desc: '教师负责终审，平台运营可跨校巡检。' },
  {
    menu: '审核规则管理',
    visible: isSchoolAdmin.value || isPlatformOps.value,
    desc: '学校管理员看校级规则，平台运营看全局规则。'
  },
  { menu: '学校素材与标签', visible: isSchoolAdmin.value, desc: '仅学校管理员维护校徽、校训和校园背景。' }
]);
</script>

<template>
  <div class="flex-col-stretch gap-16px">
    <NCard :bordered="false" class="card-wrapper">
      <h2 class="text-28px text-[#111827] font-700">角色与权限中心</h2>
      <p class="mt-8px text-14px text-[#475569] leading-24px">
        平台围绕教师、学生、学校管理员、平台运营四种核心角色设计，权限控制强调“学生可参与创作，但不拥有审稿权与终审权”。
      </p>
      <div class="current-role-bar">
        <div>
          <div class="current-role-bar__label">当前登录</div>
          <div class="current-role-bar__value">{{ authStore.userInfo.userName }} / {{ currentRole }}</div>
        </div>
        <NTag size="large" :bordered="false" type="info">{{ schoolStore.activeSchool.schoolName }}</NTag>
      </div>
    </NCard>

    <NGrid cols="1 l:2" responsive="screen" :x-gap="16" :y-gap="16">
      <NGi v-for="role in roleProfiles" :key="role.id">
        <NCard :title="role.role" :bordered="false" class="card-wrapper">
          <div class="flex items-center justify-between gap-10px">
            <p class="text-13px text-[#475569] leading-22px">{{ role.desc }}</p>
            <NTag size="small" :bordered="false" type="info">{{ role.dailyLimit }}</NTag>
          </div>
          <div class="mt-12px flex flex-wrap gap-8px">
            <span v-for="item in role.capabilities" :key="item" class="capability-pill">{{ item }}</span>
          </div>
        </NCard>
      </NGi>
    </NGrid>

    <NCard title="演示账号与推荐讲解路径" :bordered="false" class="card-wrapper">
      <div class="grid gap-12px md:grid-cols-2">
        <div v-for="item in demoAccounts" :key="item.key" class="account-card">
          <div class="flex items-center justify-between gap-10px">
            <div>
              <div class="text-15px text-[#111827] font-700">{{ item.label }}</div>
              <div class="mt-4px text-12px text-[#64748b]">登录名：{{ item.loginName }}</div>
            </div>
            <NTag size="small" :bordered="false" type="success">{{ item.school }}</NTag>
          </div>
          <div class="mt-10px text-13px text-[#475569]">建议从 {{ item.focusRoute }} 开始讲。</div>
          <div class="mt-10px flex flex-wrap gap-8px">
            <span v-for="point in item.highlights" :key="point" class="capability-pill">{{ point }}</span>
          </div>
        </div>
      </div>
    </NCard>

    <NCard title="关键权限矩阵" :bordered="false" class="card-wrapper">
      <div class="overflow-x-auto">
        <table class="permission-table">
          <thead>
            <tr>
              <th>能力项</th>
              <th>允许角色</th>
              <th>限制说明</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in permissionMatrix" :key="item[0]">
              <td>{{ item[0] }}</td>
              <td>{{ item[1] }}</td>
              <td>{{ item[2] }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </NCard>

    <NCard title="演示菜单可见性" :bordered="false" class="card-wrapper">
      <div class="grid gap-12px">
        <div v-for="item in menuMatrix" :key="item.menu" class="menu-card">
          <div>
            <div class="text-14px text-[#111827] font-600">{{ item.menu }}</div>
            <div class="mt-4px text-12px text-[#64748b]">{{ item.desc }}</div>
          </div>
          <NTag :bordered="false" :type="item.visible ? 'success' : 'default'">
            {{ item.visible ? '当前可见' : '当前隐藏' }}
          </NTag>
        </div>
      </div>
    </NCard>
  </div>
</template>

<style scoped>
.current-role-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-top: 16px;
  padding: 14px 16px;
  border-radius: 18px;
  background: #f8fafc;
}

.current-role-bar__label {
  font-size: 12px;
  color: #64748b;
}

.current-role-bar__value {
  margin-top: 4px;
  font-size: 16px;
  color: #111827;
  font-weight: 700;
}

.capability-pill {
  display: inline-flex;
  align-items: center;
  padding: 6px 12px;
  border-radius: 9999px;
  background: #f8fafc;
  color: #334155;
  font-size: 12px;
  font-weight: 600;
  border: 1px solid rgb(148 163 184 / 0.18);
}

.account-card,
.menu-card {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
  padding: 16px;
  border-radius: 18px;
  background: linear-gradient(180deg, #ffffff 0%, #fbfdff 100%);
  border: 1px solid rgb(148 163 184 / 0.16);
}

.permission-table {
  width: 100%;
  border-collapse: collapse;
}

.permission-table th,
.permission-table td {
  padding: 12px 14px;
  border-bottom: 1px solid rgb(226 232 240);
  text-align: left;
  font-size: 13px;
  color: #334155;
}

.permission-table th {
  color: #0f172a;
  font-weight: 700;
  background: #f8fafc;
}
</style>
