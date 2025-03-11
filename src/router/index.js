import { createRouter, createWebHistory } from 'vue-router'

import HomeView from '../views/HomeView.vue'

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView
  },
  // 测试页面相关路由
  {
    path: '/test',
    name: 'test-home',
    component: () => import('../views/test/TestHome.vue')
  },
  {
    path: '/test/login',
    name: 'test-login',
    component: () => import('../views/test/LoginTestView.vue')
  },
  {
    path: '/test/register',
    name: 'test-register',
    component: () => import('../views/test/RegisterTestView.vue')
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

export default router 