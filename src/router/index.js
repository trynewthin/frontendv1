import { createRouter, createWebHistory } from 'vue-router'

import HomeView from '../views/HomeView.vue'

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView,
    children: [
      {
        path: '',
        name: 'home-default',
        component: () => import('../views/home/DefaultView.vue')
      },
      {
        path: 'car-search',
        name: 'car-search',
        component: () => import('../views/car/CarSearchView.vue')
      },
      {
        path: 'appointments',
        name: 'appointmentCenter',
        component: () => import('../views/appointment/AppointmentCenter.vue')
      },
      {
        path: 'messages',
        name: 'messageCenter',
        component: () => import('../views/message/MessageCenter.vue')
      }
    ]
  },
  // 认证页面路由
  {
    path: '/auth',
    name: 'auth',
    component: () => import('../views/auth/AuthView.vue'),
    children: [
      {
        path: '',
        redirect: { name: 'login' }
      },
      {
        path: 'login',
        name: 'login',
        component: () => import('../views/auth/AuthView.vue')
      },
      {
        path: 'register',
        name: 'register',
        component: () => import('../views/auth/AuthView.vue')
      }
    ]
  },
  // 登录页面路由别名
  {
    path: '/login',
    redirect: { name: 'login' }
  },
  // 注册页面路由别名
  {
    path: '/register',
    redirect: { name: 'register' }
  },
  // 用户中心路由
  {
    path: '/user',
    name: 'user',
    component: () => import('../views/user/UserProfile.vue')
  },
  // 经销商中心路由
  {
    path: '/dealer',
    name: 'dealer',
    component: () => import('../views/dealer/DealerDashboard.vue')
  },
  // 管理员后台路由
  {
    path: '/admin',
    name: 'admin',
    component: () => import('../views/admin/AdminDashboard.vue'),
    children: [
      {
        path: '',
        name: 'admin-dashboard',
        redirect: { name: 'admin-statistics' }
      },
      {
        path: 'users',
        name: 'admin-users',
        component: () => import('../views/admin/UserManagement.vue')
      },
      {
        path: 'dealers',
        name: 'admin-dealers',
        component: () => import('../views/admin/DealerManagement.vue')
      },
      {
        path: 'content-audit',
        name: 'admin-content-audit',
        component: () => import('../views/admin/ContentAudit.vue')
      },
      {
        path: 'statistics',
        name: 'admin-statistics',
        component: () => import('../views/admin/Statistics.vue')
      }
    ]
  },
  // 车辆详情页路由
  {
    path: '/car/:id',
    name: 'CarDetail',
    component: () => import('../views/car/CarDetailView.vue')
  },
  // 聊天页面路由
  {
    path: '/chat/:contactId',
    name: 'chat',
    component: () => import('../views/message/ChatView.vue')
  },
  // 404页面路由 - 必须放在最后
  {
    path: '/:pathMatch(.*)*',
    name: 'not-found',
    component: () => import('../views/NotFound.vue')
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