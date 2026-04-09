import type { RouteMeta } from 'vue-router';
import ElegantVueRouter from '@elegant-router/vue/vite';
import type { RouteKey } from '@elegant-router/types';

const routeMetaMap: Partial<Record<RouteKey, Partial<RouteMeta>>> = {
  home: {
    icon: 'mdi:compass-rose',
    order: 1
  },
  workflow: {
    icon: 'mdi:creation-outline',
    order: 2
  },
  workflow_workspace: {
    icon: 'mdi:lightbulb-on-outline',
    order: 1
  },
  'workflow_script-review': {
    icon: 'mdi:script-text-outline',
    order: 2
  },
  workflow_tasks: {
    icon: 'mdi:timeline-clock-outline',
    order: 3
  },
  governance: {
    icon: 'mdi:shield-check-outline',
    order: 3
  },
  governance_review: {
    icon: 'mdi:file-search-outline',
    order: 1
  },
  governance_library: {
    icon: 'mdi:folder-play-outline',
    order: 2
  },
  school: {
    icon: 'mdi:school-outline',
    order: 4
  },
  school_assets: {
    icon: 'mdi:image-multiple-outline',
    order: 1
  },
  operations: {
    icon: 'mdi:cog-outline',
    order: 5
  },
  operations_org: {
    icon: 'mdi:account-group-outline',
    order: 1
  },
  operations_ops: {
    icon: 'mdi:chart-line',
    order: 2
  },
  manage: {
    icon: 'carbon:cloud-service-management',
    order: 98,
    roles: ['R_ADMIN']
  },
  manage_user: {
    icon: 'ic:round-manage-accounts',
    order: 1,
    roles: ['R_ADMIN']
  },
  manage_menu: {
    icon: 'material-symbols:route',
    order: 2,
    roles: ['R_ADMIN'],
    keepAlive: true
  },
  'manage_user-detail': {
    hideInMenu: true,
    roles: ['R_ADMIN'],
    activeMenu: 'manage_user'
  }
};

export function setupElegantRouter() {
  return ElegantVueRouter({
    layouts: {
      base: 'src/layouts/base-layout/index.vue',
      blank: 'src/layouts/blank-layout/index.vue'
    },
    routePathTransformer(routeName, routePath) {
      const key = routeName as RouteKey;

      if (key === 'login') {
        const modules: UnionKey.LoginModule[] = ['pwd-login', 'code-login', 'register', 'reset-pwd'];

        const moduleReg = modules.join('|');

        return `/login/:module(${moduleReg})?`;
      }

      return routePath;
    },
    onRouteMetaGen(routeName) {
      const key = routeName as RouteKey;

      const constantRoutes: RouteKey[] = ['login', '403', '404', '500'];

      const meta: Partial<RouteMeta> = {
        title: key,
        i18nKey: `route.${key}` as App.I18n.I18nKey
      };

      if (constantRoutes.includes(key)) {
        meta.constant = true;
      }

      return {
        ...meta,
        ...routeMetaMap[key]
      };
    }
  });
}
