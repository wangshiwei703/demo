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

  }
]

let router = createRouter({
  history: createWebHistory(),
  routes
})
export default router