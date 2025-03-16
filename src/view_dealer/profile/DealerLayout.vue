<template>
  <div class="dealer-layout user-profile-view">
    <!-- 添加动画背景组件 -->
    <AnimatedBackground 
      :showTitle="true"
      :showRouteText="true"
      routeText="经销商中心"
    />
    
    <!-- 使用bheader组件替换原有标题栏 -->
    <bheader 
      title="经销商中心"
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
          <component :is="Component" :currentUserId="currentUserId" />
        </transition>
      </router-view>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import Bheader from '@components/header/bheader.vue';
import ThemeToggle from '@components/button/ThemeToggle.vue';
import AnimatedBackground from '@components/background/AnimatedBackground.vue';
import HomeButton from '@components/button/HomeButton.vue';
import authService from '@/api/authService';

// 路由相关
const router = useRouter();
const route = useRoute();

// 导航模式
const navModes = [
  { label: '主页', value: 'home' },
  { label: '预约管理', value: 'appointments' },
  { label: '车辆管理', value: 'vehicles' }
];

// 根据当前路由计算当前模式
const currentMode = computed(() => {
  const routeName = route.name;
  if (routeName === 'dealer-appointments') return 'appointments';
  if (routeName === 'dealer-vehicles') return 'vehicles';
  return 'home'; // 默认为主页
});

// 处理模式切换
const handleModeChange = (mode) => {
  console.log('切换到模式:', mode);
  
  // 根据模式导航到相应的路由
  if (mode === 'home') {
    router.push({ name: 'dealer-home' });
  } else if (mode === 'appointments') {
    router.push({ name: 'dealer-appointments' });
  } else if (mode === 'vehicles') {
    router.push({ name: 'dealer-vehicles' });
  }
};

// 当前用户信息
const currentUserId = ref(null);
const loading = ref(false);
const error = ref('');

// 获取当前用户信息
const fetchUserInfo = async () => {
  loading.value = true;
  error.value = '';
  
  try {
    // 获取当前登录用户的信息
    console.log('DealerLayout: 尝试获取当前用户信息');
    const result = await authService.fetchUserProfile();
    console.log('DealerLayout: 用户信息结果:', result);
    
    if (result.success && result.data) {
      // 使用userId字段
      if (result.data.userId) {
        currentUserId.value = result.data.userId;
        console.log('DealerLayout: 获取到用户ID:', currentUserId.value);
      } else {
        console.error('DealerLayout: 用户数据中没有userId字段:', result.data);
        error.value = '用户数据中没有userId字段';
      }
    } else {
      error.value = result.message || '获取用户信息失败';
      console.error('DealerLayout: 获取用户信息失败:', error.value);
    }
  } catch (err) {
    console.error('DealerLayout: 获取用户信息出错:', err);
    error.value = '获取用户信息时发生错误';
  } finally {
    loading.value = false;
  }
};

// 组件挂载时获取用户信息
onMounted(async () => {
  await fetchUserInfo();
});
</script>

<style scoped>
.dealer-layout {
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
  padding: 0;
  margin-top: 100px; /* 为header留出空间 */
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
:root[data-theme="dark"] .dealer-layout {
  background-color: #1a1a1a !important;
}

/* 响应式布局 - 移动设备 */
@media (max-width: 768px) {
  .main-content {
    padding: 0;
  }
}
</style> 