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
        component: () => import('../views/home/CarSearchView.vue')
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
  // 检查是否需要从用户个人中心进入
  if (to.meta.fromUserProfile && !from.path.includes('/user')) {
    next({ name: 'user-profile' });
  } else {
    next();
  }
});

export default router 