import {
  createRouter,
  createWebHistory
} from "vue-router";



const routes = [
  {
    path: '/',
    name: 'root',
    component: () => import('@/views/root.vue'),
    meta: {
      requiresAuth: true,
      keepAlive: true
    }
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('@/views/login/index.vue'),
    meta: {
      requiresAuth: true,
      keepAlive: true
    }
  }
]
const _base = import.meta.env.VITE_APP_BASE
let router = createRouter({
  history: createWebHistory(_base),
  routes
})
export default router