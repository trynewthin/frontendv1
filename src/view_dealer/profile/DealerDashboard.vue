<template>
  <div class="user-profile-container user-profile-view">
    <!-- 添加动画背景组件 -->
    <AnimatedBackground 
      :showTitle="true"
      :showRouteText="true"
      routeText="经销商中心"
    />
    
    <!-- 使用bheader组件替换原有标题栏 -->
    <bheader 
      title="经销商中心"
      :showBackButton="true"
      :showThemeToggle="true"
      :modes="navModes"
      :currentMode="currentMode"
      @set-mode="handleModeChange"
    >
      <template #right-content>
        <theme-toggle />
      </template>
    </bheader>
    
    <!-- 主内容区域 -->
    <div class="main-content">
      <!-- 面板显示容器 -->
      <div class="panels-container">
        <!-- 根据当前模式显示不同的内容 -->
        <div v-if="currentMode === 'home'" class="user-row-panels">
          <!-- 用户信息和经销商信息面板横向排列 -->
          <UserCard class="user-panel user-row-panel" />
          <DealerInfo 
            class="dealer-panel user-row-panel" 
            :userId="currentUserId"
          />
        </div>

        <!-- 预约管理页面 -->
        <div v-else-if="currentMode === 'appointments'" class="full-panel">
          <div class="placeholder-panel">
            <h3>预约管理</h3>
            <p>此功能正在开发中，敬请期待...</p>
          </div>
        </div>

        <!-- 车辆管理页面 -->
        <div v-else-if="currentMode === 'vehicles'" class="full-panel">
          <div class="placeholder-panel">
            <h3>车辆管理</h3>
            <p>此功能正在开发中，敬请期待...</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import UserCard from '@components/card/UserCard.vue';
import Bheader from '@components/header/bheader.vue';
import ThemeToggle from '@components/button/ThemeToggle.vue';
import AnimatedBackground from '@components/background/AnimatedBackground.vue';
import DealerInfo from '../home/components/DealerInfo.vue';
import userAdminService from '@/api/userAdminService';
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
    // 先通过authService获取当前登录用户的ID
    console.log('DashBoard: 尝试获取当前用户信息');
    const result = await authService.fetchUserProfile();
    console.log('DashBoard: 用户信息结果:', result);
    
    if (result.success && result.data) {
      // 使用userId字段而不是id字段
      if (result.data.userId) {
        currentUserId.value = result.data.userId;
        console.log('DashBoard: 获取到用户ID:', currentUserId.value, '类型:', typeof currentUserId.value);
      } else {
        console.error('DashBoard: 用户数据中没有userId字段:', result.data);
        error.value = '用户数据中没有userId字段';
      }
    } else {
      error.value = result.message || '获取用户信息失败';
      console.error('DashBoard: 获取用户信息失败:', error.value);
    }
  } catch (err) {
    console.error('DashBoard: 获取用户信息出错:', err);
    error.value = '获取用户信息时发生错误';
  } finally {
    loading.value = false;
  }
};

// 组件挂载时获取用户信息
onMounted(async () => {
  await fetchUserInfo();
  
  // 如果通过用户ID拿不到经销商信息，可以尝试直接测试API
  if (currentUserId.value && !loading.value) {
    console.log('DashBoard: 直接测试userAdminService.getUserDetailNoAuth方法');
    try {
      const response = await userAdminService.getUserDetailNoAuth(currentUserId.value);
      console.log('DashBoard: 直接调用API结果:', response);
      
      if (response.success && response.data) {
        console.log('DashBoard: API返回的dealerInfo:', response.data.dealerInfo);
        
        // 如果API返回了dealerInfo但组件中没显示，可能是组件的问题
        if (!response.data.dealerInfo) {
          console.warn('DashBoard: API返回的数据中没有dealerInfo字段，这可能是因为当前用户不是经销商');
        }
      }
    } catch (err) {
      console.error('DashBoard: 直接测试API出错:', err);
    }
  }
});
</script>

<style scoped>
.user-profile-view {
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
}

.user-profile-container {
  padding: 0;
  min-height: 100vh;
  width: 100%;
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
  overflow-y: auto;
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

.panels-container {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  min-height: auto;
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  background-color: transparent;
  border-radius: 0;
  overflow: visible;
  gap: 1.5rem;
  padding: 1.5rem;
  box-sizing: border-box;
}

/* 用户信息和经销商信息面板横向排列容器 */
.user-row-panels {
  display: flex;
  flex-direction: row;
  gap: 1.5rem;
  width: 100%;
  justify-content: center;
  align-items: stretch;
  min-height: 350px;
  max-width: 1200px;
}

/* 横向面板样式 */
.user-row-panel {
  flex: 1;
  max-width: calc(50% - 0.75rem);
  min-height: 320px;
  height: auto;
  display: flex;
  flex-direction: column;
  position: relative;
}

/* 全宽面板容器 */
.full-panel {
  width: 100%;
  min-height: 350px;
  display: flex;
  justify-content: center;
  align-items: stretch;
}

/* 占位面板 */
.placeholder-panel {
  width: 100%;
  background-color: var(--card-bg-color, #ffffff);
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
  border: 1px solid var(--card-border-color, #eaeaea);
  padding: 2rem;
  text-align: center;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  min-height: 300px;
}

.placeholder-panel h3 {
  font-size: 1.5rem;
  margin-bottom: 1rem;
  color: var(--text-color, #333);
}

.placeholder-panel p {
  color: var(--secondary-text-color, #666);
  font-size: 1rem;
}

/* 响应式布局 - 移动设备 */
@media (max-width: 768px) {
  .main-content {
    padding: 0;
  }
  
  .panels-container {
    padding: 1rem;
    gap: 1rem;
  }
  
  /* 移动设备上用户信息和经销商信息面板改为垂直排列 */
  .user-row-panels {
    flex-direction: column;
    gap: 1rem;
  }
  
  .user-row-panel {
    max-width: 100%;
  }
  
  .placeholder-panel {
    padding: 1.5rem;
    min-height: 250px;
  }
  
  .placeholder-panel h3 {
    font-size: 1.2rem;
  }
}

/* 深色模式适配 */
:root[data-theme="dark"] .user-profile-view {
  background-color: #1a1a1a !important;
}

:root[data-theme="dark"] .placeholder-panel {
  background-color: var(--card-bg-color, #1f1f1f);
  border-color: var(--card-border-color, #333333);
}

:root[data-theme="dark"] .placeholder-panel h3 {
  color: var(--text-color, #e0e0e0);
}

:root[data-theme="dark"] .placeholder-panel p {
  color: var(--secondary-text-color, #aaaaaa);
}
</style> 