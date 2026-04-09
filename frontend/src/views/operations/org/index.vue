<script setup lang="ts">
import { roleProfiles } from '@/mock/video-platform';

const permissionMatrix = [
  ['自由输入指令', '教师', '学生'],
  ['脚本强制审核', '教师', '-'],
  ['审批学生视频', '教师', '-'],
  ['上传校徽 / 校训 / 背景图', '学校管理员', '-'],
  ['查看全校生成记录', '学校管理员', '-'],
  ['维护全局审核阈值', '平台运营', '-']
];
</script>

<template>
  <div class="flex-col-stretch gap-16px">
    <NCard :bordered="false" class="card-wrapper">
      <h2 class="text-28px text-[#111827] font-700">角色与权限中心</h2>
      <p class="mt-8px text-14px text-[#475569] leading-24px">
        平台围绕教师、学生、学校管理员、平台运营四种核心角色设计，权限控制强调“学生可参与创作，但不拥有审稿权与终审权”。
      </p>
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
              <td>{{ item[2] === '-' ? '按平台默认规则执行' : item[2] }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </NCard>
  </div>
</template>

<style scoped>
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
