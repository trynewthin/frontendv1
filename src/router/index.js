import { createRouter, createWebHistory } from 'vue-router'

import HomeView from '../views/HomeView.vue'

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView
  },
  // 登录页面路由
  {
    path: '/login',
    name: 'login',
    component: () => import('../views/LoginView.vue')
  },
  // 注册页面路由
  {
    path: '/register',
    name: 'register',
    component: () => import('../views/RegisterView.vue')
  },
  // 测试页面相关路由
  {
    path: '/test',
    name: 'test-home',
    component: () => import('../views/test/TestHome.vue'),
    children: [
      {
        path: 'login',
        name: 'test-login',
        component: () => import('../views/test/LoginTestView.vue')
      },
      {
        path: 'register',
        name: 'test-register',
        component: () => import('../views/test/RegisterTestView.vue')
      },
      {
        path: 'recommendation',
        name: 'test-recommendation',
        component: () => import('../views/test/RecommendationTestView.vue')
      },
      {
        path: 'car',
        name: 'test-car',
        component: () => import('../views/test/CarTestView.vue')
      },
      {
        path: 'dealer',
        name: 'test-dealer',
        component: () => import('../views/test/DealerTestView.vue')
      }
    ]
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

export default router 