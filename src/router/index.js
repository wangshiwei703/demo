import {
  createRouter,
  createWebHistory
} from "vue-router";



const routes = [
  {
    path: '/',
    redirect: '/jfcp',
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
    path: '/ftjfct2',
    name: 'ftjfct2',
    component: () => import('@/views/page/ftjfct2/index.vue'),
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