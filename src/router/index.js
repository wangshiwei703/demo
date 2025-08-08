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
    path: '/zyys',
    name: 'zyys',
    component: () => import('@/views/page/zyys/index.vue'),
    meta: {
      requiresAuth: true,
      keepAlive: true
    }
  },
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