<template>
  <div class="admin-dashboard-container">
    <!-- 添加动画背景组件 -->
    <AnimatedBackground 
      :showTitle="true"
      :showRouteText="true"
      routeText="系统管理后台"
    />
    
    <!-- 使用bheader组件 -->
    <bheader 
      title="系统管理后台"
      :showBackButton="false"
      :showThemeToggle="true"
      :modes="navModes"
      :currentMode="currentMode"
      @set-mode="handleModeChange"
    >
      <template #left-content>
        <home-button />
      </template>
      <template #right-content>
        <theme-toggle />
      </template>
    </bheader>
    
    <!-- 主内容区域 - 显示各个子路由页面 -->
    <div class="main-content">
      <router-view v-slot="{ Component }">
        <transition name="fade" mode="out-in">
          <component :is="Component" />
        </transition>
      </router-view>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import Bheader from '@components/header/bheader.vue';
import ThemeToggle from '@components/button/ThemeToggle.vue';
import AnimatedBackground from '@components/background/AnimatedBackground.vue';
import HomeButton from '@components/button/HomeButton.vue';

// 路由相关
const router = useRouter();
const route = useRoute();

// 导航模式
const navModes = [
  { label: '数据统计', value: 'statistics' },
  { label: '用户管理', value: 'users' },
  { label: '经销商管理', value: 'dealers' },
  { label: '车辆审核', value: 'content-audit' }
];

// 根据当前路由计算当前模式
const currentMode = computed(() => {
  const path = route.path;
  if (path.includes('/admin/users')) return 'users';
  if (path.includes('/admin/dealers')) return 'dealers';
  if (path.includes('/admin/content-audit')) return 'content-audit';
  return 'statistics'; // 默认为数据统计
});

// 处理模式切换
const handleModeChange = (mode) => {
  // 根据模式导航到相应的路由
  router.push(`/admin/${mode}`);
};
</script>

<style scoped>
.admin-dashboard-container {
  position: fixed !important;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  width: 100vw !important;
  height: 100vh !important;
  margin: 0 !important;
  padding: 0 !important;
  background-color: #ffffff !important; 
  overflow-y: auto;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
}

.main-content {
  flex: 1;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-left: 5%;
  padding-right: 5%;
  padding-bottom: 5%;
}

/* 页面切换动画 */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* 深色模式适配 */
:root[data-theme="dark"] .admin-dashboard-container {
  background-color: #1a1a1a !important;
}

/* 响应式布局 - 移动设备 */
@media (max-width: 768px) {
  .main-content {
    padding: 0;
  }
}
</style> 