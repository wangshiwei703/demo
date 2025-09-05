import {
  createRouter,
  createWebHistory
} from "vue-router";



const routes = [
  {
    path: '/',
    name: 'backStage',
    redirect: 'overview',
    component: () => import('@/views/page/background/index.vue'),
    meta: {
      requiresAuth: true,
      keepAlive: true
    },
    children: [{
      path: 'overview',
      name: 'overview',
      component: () => import('@/views/page/background/container/overview/index.vue'),
      meta: {
        requiresAuth: true,
        keepAlive: true
      }
    }, {
      path: 'businessManage',
      name: 'businessManage',
      component: () => import('@/views/page/background/container/businessManage/index.vue'),
      meta: {
        requiresAuth: true,
        keepAlive: true
      },
      children: [{
        path: 'PMList',
        name: 'PMList',
        component: () => import('@/views/page/background/container/businessManage/PMList/index.vue'),
        meta: {
          requiresAuth: true,
          keepAlive: true
        }
      }, {
        path: 'PMGroupList',
        name: 'PMGroupList',
        component: () => import('@/views/page/background/container/businessManage/PMGroupList/index.vue'),
        meta: {
          requiresAuth: true,
          keepAlive: true
        }
      }]
    },]
  },
{
    path: '/root',
    name: 'root',
    component: () => import('@/views/root.vue'),
    meta: {
      requiresAuth: true,
      keepAlive: true
    }
  },
  {
    path: '/jfcp',
    name: 'jfcp',
    component: () => import('@/views/page/jfcp/index.vue'),
    meta: {
      requiresAuth: true,
      keepAlive: true
    }
  },
  {
    path: '/jfbd',
    name: 'jfbd',
    component: () => import('@/views/page/jfbd/index.vue'),
    meta: {
      requiresAuth: true,
      keepAlive: true
    }
  },
  {
    path: '/jfct',
    name: 'jfct',
    component: () => import('@/views/page/jfct/index.vue'),
    meta: {
      requiresAuth: true,
      keepAlive: true
    }
  },
  {
    path: '/ftjfct',
    name: 'ftjfct',
    component: () => import('@/views/page/ftjfct/index.vue'),
    meta: {
      requiresAuth: true,
      keepAlive: true
    }
  },
  {
    path: '/ftjfct3',
    name: 'ftjfct3',
    component: () => import('@/views/page/ftjfct3/index.vue'),
    meta: {
      requiresAuth: true,
      keepAlive: true
    }
  },
  {
    path: '/ftsm',
    name: 'ftsm',
    component: () => import('@/views/page/ftsm/index.vue'),
    meta: {
      requiresAuth: true,
      keepAlive: true
    }
  },
  {
    path: '/ftsm2',
    name: 'ftsm2',
    component: () => import('@/views/page/ftsm2/index.vue'),
    meta: {
      requiresAuth: true,
      keepAlive: true
    }
  },
  {
    path: '/ftsmtk',
    name: 'ftsmtk',
    component: () => import('@/views/page/ftsmtk/index.vue'),
    meta: {
      requiresAuth: true,
      keepAlive: true
    }
  },
  {
    path: '/zyys',
    name: 'zyys',
    component: () => import('@/views/page/zyys/index.vue'),
    meta: {
      requiresAuth: true,
      keepAlive: true
    }
  },
  {
    path: '/zycp',
    name: 'zycp',
    component: () => import('@/views/page/zycp/index.vue'),
    meta: {
      requiresAuth: true,
      keepAlive: true
    }
  },
  {
    path: '/privacyPolicy',
    name: 'privacyPolicy',
    component: () => import('@/views/privacyPolicy.vue'),
    meta: {
      requiresAuth: true,
      keepAlive: true
    }
  }
  // {
  //   path: '/login',
  //   name: 'login',
  //   component: () => import('@/views/login/index.vue'),
  //   meta: {
  //     requiresAuth: true,
  //     keepAlive: true
  //   }
  // }
]
const _base = import.meta.env.VITE_APP_BASE
let router = createRouter({
  history: createWebHistory(_base),
  routes
})
export default router