<script setup>
import UserStatusBar from '../components/auth/UserStatusBar.vue';
import { useRouter } from 'vue-router';

const router = useRouter();

// 跳转到预约管理页面
const goToAppointments = () => {
  router.push('/appointments');
};

// 跳转到消息中心页面
const goToMessages = () => {
  router.push('/messages');
};
</script>

<template>
  <div class="home-view">
    <div class="va-navbar app-header">
      <div class="va-navbar__left">
        <h1 class="va-navbar__item">智选车</h1>
      </div>
      <div class="va-navbar__right">
        <!-- 预约管理按钮 -->
        <va-button 
          class="nav-button" 
          preset="primary" 
          @click="goToAppointments"
          v-tooltip="'预约管理'"
          size="large"
        >
          <svg class="icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11zM7 10h5v5H7v-5z" fill="currentColor"/>
          </svg>
        </va-button>
        
        <!-- 消息中心按钮 -->
        <va-button 
          class="nav-button" 
          preset="primary" 
          @click="goToMessages"
          v-tooltip="'消息中心'"
          size="large"
        >
          <svg class="icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 22C13.1 22 14 21.1 14 20H10C10 21.1 10.9 22 12 22ZM18 16V11C18 7.93 16.37 5.36 13.5 4.68V4C13.5 3.17 12.83 2.5 12 2.5C11.17 2.5 10.5 3.17 10.5 4V4.68C7.64 5.36 6 7.92 6 11V16L4 18V19H20V18L18 16ZM16 17H8V11C8 8.52 9.51 6.5 12 6.5C14.49 6.5 16 8.52 16 11V17Z" fill="currentColor"/>
          </svg>
        </va-button>
        
        <UserStatusBar />
      </div>
    </div>
    
    <div class="app-content">
      <!-- 添加过渡效果 -->
      <router-view v-slot="{ Component }">
        <transition name="page-transition" mode="out-in">
          <component :is="Component" />
        </transition>
      </router-view>
    </div>
  </div>
</template>

<style scoped>
/* 特定于首页的样式 */
.home-view {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  width: 100%;
  overflow: hidden; /* 防止整体出现滚动条 */
}

.app-header {
  background-color: var(--va-primary);
  color: white;
  display: flex;
  justify-content: space-between;
  padding: 0.5rem 2rem;
  height: 80px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  flex-shrink: 0; /* 防止头部被压缩 */
}

.va-navbar__left,
.va-navbar__right {
  display: flex;
  align-items: center;
  height: 100%;
  padding: 0.5rem 0;
}

.va-navbar__right {
  gap: 1rem; /* 添加右侧元素之间的间距 */
}

.nav-button {
  width: 44px;
  height: 44px;
  border-radius: 50%;
  padding: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: rgba(255, 255, 255, 0.15);
  border: none;
  transition: all 0.3s ease;
  color: white !important; /* 确保图标颜色为白色 */
}

.nav-button:hover {
  background-color: rgba(255, 255, 255, 0.25);
  transform: scale(1.05);
}

.icon {
  width: 22px;
  height: 22px;
  color: white;
}

.va-navbar__item {
  font-size: 1.5rem;
  font-weight: 600;
  margin: 0;
  padding: 0.5rem 0;
}

.app-content {
  flex: 1;
  padding: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  overflow-y: auto; /* 允许内容区域滚动 */
  width: 100%;
  height: calc(100vh - 80px); /* 减去头部高度 */
  position: relative;
}

/* 页面过渡效果 */
.page-transition-enter-active,
.page-transition-leave-active {
  transition: all 0.3s ease;
}

.page-transition-enter-from {
  opacity: 0;
  filter: blur(10px);
  transform: scale(0.95);
}

.page-transition-leave-to {
  opacity: 0;
  filter: blur(5px);
  transform: scale(1.05);
}

/* 添加滚动条样式 */
::-webkit-scrollbar {
  width: 6px;
}

::-webkit-scrollbar-track {
  background: transparent;
}

::-webkit-scrollbar-thumb {
  background-color: rgba(0, 0, 0, 0.1);
  border-radius: 3px;
}

::-webkit-scrollbar-thumb:hover {
  background-color: rgba(0, 0, 0, 0.2);
}

/* 轮播图区域样式 */
.carousel-area {
  width: 100%;
  max-width: 100%;
  margin-top: 0;
}

.va-card {
  width: 100%;
  max-width: 1000px;
}

.title-large {
  font-size: 1.8rem;
  font-weight: 600;
}

.system-navigation {
  font-size: 1.4rem;
  font-weight: 500;
  margin-bottom: 1.5rem;
  color: var(--va-text-primary);
}

.center {
  display: flex;
  justify-content: center;
}

.mt-3 {
  margin-top: 1rem;
}

.mx-auto {
  margin-left: auto;
  margin-right: auto;
}

.mt-5 {
  margin-top: 2rem;
}

.mb-5 {
  margin-bottom: 2rem;
}

/* 添加推荐区域的样式 */
.recommendation-area {
  width: 100%;
  max-width: 1200px;
  padding: 0 2rem;
  margin-top: 3rem;
}

/* 测试按钮区域样式 */
.test-button-area {
  width: 100%;
  max-width: 1000px;
  padding: 0 2rem;
}

/* 查看更多车辆按钮样式 */
.view-more-cars {
  width: 100%;
  display: flex;
  justify-content: center;
}

.view-more-button {
  min-width: 180px;
}

@media (max-width: 768px) {
  .app-header {
    padding: 0.3rem 1rem;
    height: 64px;
  }
  
  .app-content {
    height: calc(100vh - 64px); /* 移动端头部高度 */
  }
  
  .va-navbar__left,
  .va-navbar__right {
    padding: 0.3rem 0;
  }
  
  .va-navbar__item {
    font-size: 1.3rem;
    padding: 0.3rem 0;
  }
  
  .nav-button {
    width: 36px;
    height: 36px;
  }
  
  .icon {
    width: 18px;
    height: 18px;
  }
  
  .recommendation-area,
  .test-button-area {
    padding: 0 1rem;
  }
  
  .carousel-area :deep(.carousel-container) {
    height: 300px !important;
  }
  
  .title-large {
    font-size: 1.6rem;
  }
  
  .system-navigation {
    font-size: 1.2rem;
  }
}
</style> 