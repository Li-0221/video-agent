import type { CustomRoute, ElegantConstRoute, ElegantRoute } from '@elegant-router/types';
import { generatedRoutes } from '../elegant/routes';
import { layouts, views } from '../elegant/imports';
import { transformElegantRoutesToVueRoutes } from '../elegant/transform';

/**
 * custom routes
 *
 * @link https://github.com/soybeanjs/elegant-router?tab=readme-ov-file#custom-route
 */
const customRoutes: CustomRoute[] = [];

const routeMetaPatches: Record<string, Record<string, any>> = {
  workflow: { roles: ['R_TEACHER', 'R_STUDENT'] },
  workflow_workspace: { roles: ['R_TEACHER', 'R_STUDENT'] },
  'workflow_script-review': { roles: ['R_TEACHER'] },
  workflow_tasks: { roles: ['R_TEACHER', 'R_STUDENT'] },
  governance: { roles: ['R_TEACHER', 'R_SCHOOL_ADMIN', 'R_PLATFORM_OPS'] },
  governance_review: { roles: ['R_TEACHER', 'R_PLATFORM_OPS'] },
  governance_library: { roles: ['R_TEACHER', 'R_SCHOOL_ADMIN', 'R_PLATFORM_OPS'] },
  governance_rules: {
    roles: ['R_SCHOOL_ADMIN', 'R_PLATFORM_OPS'],
    icon: 'mdi:tune-vertical-variant',
    order: 3
  },
  school: { roles: ['R_SCHOOL_ADMIN'] },
  school_assets: { roles: ['R_SCHOOL_ADMIN'] },
  operations: { roles: ['R_SCHOOL_ADMIN', 'R_PLATFORM_OPS'] },
  operations_org: { roles: ['R_SCHOOL_ADMIN', 'R_PLATFORM_OPS'] },
  operations_ops: { roles: ['R_PLATFORM_OPS'] }
};

function patchRouteMeta<T>(routes: T[]): T[] {
  return routes.map(route => {
    const nextRoute = { ...(route as Record<string, any>) };
    const metaPatch = routeMetaPatches[String(nextRoute.name)] || {};

    if (nextRoute.meta) {
      nextRoute.meta = {
        ...nextRoute.meta,
        ...metaPatch
      };
    }

    if (Array.isArray(nextRoute.children)) {
      nextRoute.children = patchRouteMeta(nextRoute.children);
    }

    return nextRoute as T;
  });
}

/** create routes when the auth route mode is static */
export function createStaticRoutes() {
  const constantRoutes: ElegantRoute[] = [];

  const authRoutes: ElegantRoute[] = [];

  const patchedRoutes = patchRouteMeta([...(customRoutes as ElegantRoute[]), ...(generatedRoutes as ElegantRoute[])]);

  patchedRoutes.forEach(item => {
    if (item.meta?.constant) {
      constantRoutes.push(item);
    } else {
      authRoutes.push(item);
    }
  });

  return {
    constantRoutes,
    authRoutes
  };
}

/**
 * Get auth vue routes
 *
 * @param routes Elegant routes
 */
export function getAuthVueRoutes(routes: ElegantConstRoute[]) {
  return transformElegantRoutesToVueRoutes(routes, layouts, views);
}
