import { createRouter, createWebHistory } from 'vue-router'

import HomeView from '@home/HomeView.vue'

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView,
    children: [
      {
        path: '',
        name: 'home-default',
        component: () => import('@home/home/DefaultView.vue')
      },
      {
        path: 'car-search',
        name: 'car-search',
        component: () => import('@home/car/CarSearchView.vue')
      },
      {
        path: 'appointments',
        name: 'appointmentCenter',
        component: () => import('@user/appointment/AppointmentCenter.vue')
      },
      {
        path: 'messages',
        name: 'messageCenter',
        component: () => import('@home/message/MessageCenter.vue')
      }
    ]
  },
  // 认证页面路由
  {
    path: '/auth',
    name: 'auth',
    component: () => import('@home/auth/AuthView.vue'),
    children: [
      {
        path: '',
        redirect: { name: 'login' }
      },
      {
        path: 'login',
        name: 'login',
        component: () => import('@home/auth/AuthView.vue')
      },
      {
        path: 'register',
        name: 'register',
        component: () => import('@home/auth/AuthView.vue')
      }
    ]
  },
  // 用户中心路由
  {
    path: '/user',
    name: 'user',
    component: () => import('@user/userprofile/UserProfile.vue')
  },
  // 经销商中心路由
  {
    path: '/dealer',
    name: 'dealer',
    component: () => import('@dealer/profile/DealerDashboard.vue')
  },
  // 管理员后台路由
  {
    path: '/admin',
    name: 'admin',
    component: () => import('@admin/dashboard/AdminDashboard.vue'),
    children: [
      {
        path: '',
        name: 'admin-dashboard',
        redirect: { name: 'admin-statistics' }
      },
      {
        path: 'users',
        name: 'admin-users',
        component: () => import('@admin/dashboard/UserManagement.vue')
      },
      {
        path: 'dealers',
        name: 'admin-dealers',
        component: () => import('@admin/dashboard/DealerManagement.vue')
      },
      {
        path: 'content-audit',
        name: 'admin-content-audit',
        component: () => import('@admin/dashboard/ContentAudit.vue')
      },
      {
        path: 'statistics',
        name: 'admin-statistics',
        component: () => import('@admin/dashboard/Statistics.vue')
      }
    ]
  },
  // 车辆详情页路由
  {
    path: '/car/:id',
    name: 'CarDetail',
    component: () => import('@home/car/CarDetailView.vue')
  },
  // 聊天页面路由
  {
    path: '/chat/:contactId',
    name: 'chat',
    component: () => import('@home/message/ChatView.vue')
  },
  // 404页面路由 - 必须放在最后
  {
    path: '/:pathMatch(.*)*',
    name: 'not-found',
    component: () => import('@home/NotFound.vue')
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

// 添加路由前置守卫
router.beforeEach((to, from, next) => {
  console.log('路由导航:', { from: from.path, to: to.path, meta: to.meta });
  
  // 直接允许所有导航
  next();
});

export default router 