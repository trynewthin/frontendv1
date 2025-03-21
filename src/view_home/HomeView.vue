<script setup>
import UserStatusBar from '@home/UserStatusBar.vue';
import ThemeToggle from '@components/button/ThemeToggle.vue';
import { onMounted } from 'vue';
import iconService from '@/services/utils/iconService';

// 初始化图标
onMounted(async () => {
  await iconService.loadLucideIcons();
  iconService.initLucideIcons();
});
</script>

<template>
  <div class="home-view">
    <!-- 先放置路由内容 -->
    <div class="background-content">
      <router-view v-slot="{ Component }">
        <transition name="page-transition" mode="out-in">
          <component :is="Component" />
        </transition>
      </router-view>
    </div>
    
    <!-- 然后放置标题栏，它会覆盖在路由内容上并应用模糊效果 -->
    <div class="va-navbar app-header">
      <div class="va-navbar__left">
        <h1 class="va-navbar__item">智选车</h1>
      </div>
      
      <div class="va-navbar__right">
        <!-- 主题切换按钮 -->
        <ThemeToggle class="nav-button" />
        
        <UserStatusBar />
      </div>
    </div>
  </div>
</template>

<style scoped>
/* 特定于首页的样式 */
.home-view {
  position: relative;
  min-height: 100vh;
  width: 100%;
  overflow: hidden;
  background-color: #f5f7fa;
  color: #333;
}

:root[data-theme="dark"] .home-view {
  background-color: #1a1a1a;
  color: #fff;
}

.background-content {
  position: absolute;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  overflow-y: auto;
  padding-top: 80px;
}

/* 确保路由内容占满宽度 */
.background-content :deep(> *) {
  width: 100%;
  max-width: 100%;
}

.app-header {
  background-color: rgba(255, 255, 255, 0.5);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  color: #333;
  display: flex;
  justify-content: space-between;
  padding: 0.5rem 3rem;
  height: 80px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  transform: translateZ(0);
  will-change: backdrop-filter;
  isolation: isolate;
}

.va-navbar__left,
.va-navbar__right {
  display: flex;
  align-items: center;
  height: 100%;
  padding: 0.5rem 0;
  flex: 0 0 auto;
  position: relative;
  z-index: 2;
}

/* 添加中间导航区域样式 */
.va-navbar__center {
  display: flex;
  align-items: center;
  justify-content: center;
  flex: 1;
  height: 100%;
  padding: 0.5rem 0;
  position: absolute; /* 绝对定位 */
  left: 0;
  right: 0;
  margin: auto; /* 水平居中 */
  z-index: 0; /* 确保在左右两侧元素下面 */
  width: 100%;
}

.va-navbar__right {
  gap: 1.5rem;
  min-width: 250px;
}

.nav-button {
  min-width: 44px;
  width: 44px;
  min-height: 44px;
  height: 44px;
  border-radius: 50%;
  padding: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: rgba(0, 0, 0, 0.05);
  border: 1px solid rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  color: #333 !important;
  box-sizing: border-box;
  overflow: hidden;
}

.nav-button:hover {
  background-color: rgba(0, 0, 0, 0.1);
  transform: scale(1.05);
}

.theme-icon {
  width: 20px;
  height: 20px;
  transition: transform 0.3s ease;
  stroke: currentColor;
}

.nav-button:hover .theme-icon {
  transform: rotate(180deg);
}

.va-navbar__item {
  font-size: 1.5rem;
  font-weight: 600;
  margin: 0;
  padding: 0.5rem 0;
  color: #333;
}

/* 页面过渡效果 */
.page-transition-enter-active,
.page-transition-leave-active {
  transition: all 0.3s ease;
}

.page-transition-enter-from,
.page-transition-leave-to {
  opacity: 0;
  filter: blur(5px);
}

:root[data-theme="dark"] .page-transition-enter-from,
:root[data-theme="dark"] .page-transition-leave-to {
  filter: blur(5px) brightness(0.8);
}

/* 添加滚动条样式 */
::-webkit-scrollbar {
  width: 6px;
}

::-webkit-scrollbar-track {
  background: transparent;
}

::-webkit-scrollbar-thumb {
  background-color: rgba(0, 0, 0, 0.2);
}

:root[data-theme="dark"] ::-webkit-scrollbar-thumb {
  background-color: rgba(255, 255, 255, 0.2);
}

::-webkit-scrollbar-thumb:hover {
  background-color: rgba(0, 0, 0, 0.3);
}

:root[data-theme="dark"] ::-webkit-scrollbar-thumb:hover {
  background-color: rgba(255, 255, 255, 0.3);
}

/* 轮播图区域样式 */
.carousel-area {
  width: 100vw;
  max-width: 100vw;
  margin-top: 0;
  margin-left: calc(-50vw + 50%);
  margin-right: calc(-50vw + 50%);
}

.va-card {
  width: 100%;
  max-width: 1000px;
  background-color: #fff;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
}

:root[data-theme="dark"] .va-card {
  background-color: #2d2d2d;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.2);
}

.title-large {
  font-size: 1.8rem;
  font-weight: 600;
  color: #333;
}

:root[data-theme="dark"] .title-large {
  color: #fff;
}

.system-navigation {
  font-size: 1.4rem;
  font-weight: 500;
  margin-bottom: 1.5rem;
  color: #333;
}

:root[data-theme="dark"] .system-navigation {
  color: #fff;
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
  margin-left: auto;
  margin-right: auto;
}

:root[data-theme="dark"] .recommendation-area {
  background-color: rgba(255, 255, 255, 0.05);
}

/* 测试按钮区域样式 */
.test-button-area {
  width: 100%;
  max-width: 1000px;
  padding: 0 2rem;
  margin-left: auto;
  margin-right: auto;
}

/* 查看更多车辆按钮样式 */
.view-more-cars {
  width: 100%;
  display: flex;
  justify-content: center;
}

.view-more-button {
  min-width: 180px;
  background-color: var(--va-primary);
  color: white;
}

:root[data-theme="dark"] .view-more-button {
  background-color: var(--va-primary-darken);
}

@media (max-width: 768px) {
  .app-header {
    padding: 0.3rem 1.5rem;
    height: 64px;
  }
  
  .va-navbar__left,
  .va-navbar__right,
  .va-navbar__center {
    padding: 0.3rem 0;
  }
  
  .va-navbar__item {
    font-size: 1.3rem;
    padding: 0.3rem 0;
  }
  
  .nav-button {
    min-width: 36px;
    width: 36px;
    min-height: 36px;
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
  
  .va-navbar__right {
    gap: 1rem;
    min-width: auto;
  }
}

/* 深色主题适配 */
:root[data-theme="dark"] .app-header {
  background-color: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  color: #fff;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

:root[data-theme="dark"] .nav-button {
  background-color: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: #fff !important;
  box-sizing: border-box;
}

:root[data-theme="dark"] .nav-button:hover {
  background-color: rgba(255, 255, 255, 0.1);
}

:root[data-theme="dark"] .theme-icon {
  color: white;
}

:root[data-theme="dark"] .va-navbar__item {
  color: #fff;
}

/* 主题切换按钮样式适配 */
:deep(.theme-toggle) {
  background-color: rgba(0, 0, 0, 0.05) !important;
  border: 1px solid rgba(0, 0, 0, 0.1) !important;
  color: #333 !important;
}

:deep(.theme-toggle:hover) {
  background-color: rgba(0, 0, 0, 0.1) !important;
}

:deep(.theme-icon) {
  color: #333;
}

:root[data-theme="dark"] :deep(.theme-toggle) {
  background-color: rgba(255, 255, 255, 0.05) !important;
  border: 1px solid rgba(255, 255, 255, 0.1) !important;
  color: #fff !important;
}

:root[data-theme="dark"] :deep(.theme-toggle:hover) {
  background-color: rgba(255, 255, 255, 0.1) !important;
}

:root[data-theme="dark"] :deep(.theme-icon) {
  color: #fff;
}

/* 浅色模式下的样式 */
:root[data-theme="light"] .theme-icon {
  color: black;
}
</style> 