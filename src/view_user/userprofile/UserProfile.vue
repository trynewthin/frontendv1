<template>
  <div class="user-profile-container user-profile-view">
    <!-- 添加动画背景组件 -->
    <AnimatedBackground 
      :showTitle="true"
      :showRouteText="true"
      routeText="个人中心"
    />
    
    <!-- 使用bheader组件替换原有标题栏 -->
    <bheader 
      title="个人中心"
      :showBackButton="true"
      :showThemeToggle="true"
    >
      <template #right-content>
        <theme-toggle />
      </template>
    </bheader>
    
    <!-- 主内容区域 -->
    <div class="main-content">
      <!-- 面板显示容器 -->
      <div class="panels-container">
        <!-- 用户信息和偏好面板横向排列 -->
        <div class="user-row-panels">
          <!-- 用户信息面板 -->
          <UserCard class="user-panel user-row-panel" />
          
          <!-- 用户偏好面板 -->
          <UserPreferencePanel class="user-panel user-row-panel" />
        </div>
        
        <!-- 新增容器，宽度与上面的面板一致 -->
        <div class="additional-container">
          <!-- 切换按钮 -->
          <div class="panel-tabs">
            <button 
              @click="activeHistoryPanel = 'favorite'" 
              :class="{ active: activeHistoryPanel === 'favorite' }"
              class="tab-button"
            >
              我的收藏
            </button>
            <button 
              @click="activeHistoryPanel = 'browse'" 
              :class="{ active: activeHistoryPanel === 'browse' }"
              class="tab-button"
            >
              浏览历史
            </button>
            <button 
              @click="activeHistoryPanel = 'search'" 
              :class="{ active: activeHistoryPanel === 'search' }"
              class="tab-button"
            >
              搜索历史
            </button>
          </div>
          
          <!-- 面板内容区域 -->
          <div class="history-panels">
            <transition name="fade-slide" mode="out-in">
              <component 
                :is="activeHistoryPanel === 'favorite' 
                  ? UserFavoritePanel 
                  : activeHistoryPanel === 'browse' 
                    ? UserBrowseHistoryPanel 
                    : UserSearchHistoryPanel"
                :key="activeHistoryPanel"
              />
            </transition>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
// 从components/card目录导入新的UserCard组件
import UserCard from '@components/card/UserCard.vue';
import UserPreferencePanel from './components/UserPreferencePanel.vue';
import UserFavoritePanel from './components/UserFavoritePanel.vue';
import UserBrowseHistoryPanel from './components/UserBrowseHistoryPanel.vue';
import UserSearchHistoryPanel from './components/UserSearchHistoryPanel.vue';
import Bheader from '@components/header/bheader.vue';
import ThemeToggle from '@components/button/ThemeToggle.vue';
import AnimatedBackground from '@components/background/AnimatedBackground.vue';

// 路由实例
const router = useRouter();

// 当前激活的历史面板
const activeHistoryPanel = ref('favorite');
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

.panels-container {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  min-height: auto; /* 改为自适应高度 */
  width: 100%;
  max-width: 1400px;
  margin: 0 auto;
  background-color: transparent;
  border-radius: 0;
  overflow: visible;
  gap: 1.5rem;
  padding: 1.5rem;
  box-sizing: border-box;
}

/* 用户信息和偏好面板横向排列容器 */
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

/* 新增容器样式 */
.additional-container {
  width: 100%;
  min-height: 700px; /* 增加最小高度 */
  display: flex;
  flex-direction: column;
  gap: 1rem;
  max-width: 1200px;
  margin-bottom: 2rem; /* 添加底部边距 */
}

/* 面板切换选项卡 */
.panel-tabs {
  display: flex;
  border-bottom: 1px solid var(--border-color, #eaeaea);
  gap: 1rem;
  padding-bottom: 0.5rem;
  justify-content: center; /* 使按钮居中 */
}

.tab-button {
  background: none;
  border: none;
  padding: 0.5rem 1rem;
  font-size: 1rem;
  cursor: pointer;
  border-radius: 4px;
  transition: all 0.2s ease;
  font-weight: 500;
  color: var(--text-color, #333333);
}

.tab-button.active {
  background-color: var(--btn-primary-bg, #000000);
  color: var(--btn-primary-text, #ffffff);
}

.tab-button:hover:not(.active) {
  background-color: rgba(0, 0, 0, 0.05);
}

/* 历史面板区域 */
.history-panels {
  position: relative;
  flex: 1;
  min-height: 650px; /* 保持最小高度 */
  overflow: hidden; /* 防止动画过程中出现滚动条 */
}

/* 横向面板样式 */
.user-row-panel {
  flex: 1;
  max-width: calc(50% - 0.75rem);
  min-height: 320px; /* 确保最小高度 */
  height: auto; /* 允许高度自适应 */
  display: flex;
  flex-direction: column;
  position: relative; /* 确保相对定位上下文 */
  padding-bottom: 0; /* 移除底部内边距，让子组件自己管理空间 */
}

/* 确保偏好面板的按钮能够正确显示 */
.user-preference-panel {
  position: relative; /* 确保偏好面板也有相对定位上下文 */
  height: 100%; /* 让偏好面板填满容器高度 */
  display: flex;
  flex-direction: column;
}

/* 为偏好面板的按钮指定特殊样式 */
.user-preference-panel .action-buttons {
  bottom: 0.75rem !important; /* 强制覆盖子组件的样式 */
  right: 1.25rem !important;
}

/* 响应式布局 - 移动设备 */
@media (max-width: 599px) {
  .panels-container {
    padding: 1rem;
    gap: 1rem;
  }
  
  /* 移动设备上用户信息和偏好面板改为垂直排列 */
  .user-row-panels {
    flex-direction: column;
    gap: 1rem;
  }
  
  .user-row-panel {
    max-width: 100%;
  }
  
  /* 移动设备上调整标签样式 */
  .panel-tabs {
    gap: 0.5rem;
  }
  
  .tab-button {
    padding: 0.5rem;
    font-size: 0.9rem;
  }
  
  .footer-content {
    padding: 0 1rem;
  }
  
  .footer-links {
    gap: 1rem;
    margin-top: 0.5rem;
  }
}

/* 响应式布局 - 平板 */
@media (min-width: 600px) and (max-width: 959px) {
  .panels-container {
    padding: 1.25rem;
    gap: 1.25rem;
  }
  
  .user-row-panels {
    gap: 1.25rem;
  }
  
  .user-row-panel {
    max-width: calc(50% - 0.625rem);
  }
}

/* 响应式布局 - 小型桌面 */
@media (min-width: 960px) {
  .panels-container {
    flex-direction: column;
  }
}

/* 响应式布局 - 中型桌面 */
@media (min-width: 960px) and (max-width: 1279px) {
  .panels-container {
    padding: 1.5rem;
    gap: 1.5rem;
  }
  
  .user-row-panels {
    gap: 1.5rem;
  }
  
  .user-row-panel {
    max-width: calc(50% - 0.75rem);
  }
}

/* 响应式布局 - 大型桌面 */
@media (min-width: 1280px) {
  .panels-container {
    padding: 2rem;
    gap: 2rem;
    max-width: 1600px;
  }
  
  .user-row-panels,
  .additional-container {
    gap: 2rem;
    max-width: 1400px;
  }
  
  .user-row-panel {
    max-width: calc(50% - 1rem);
  }
}

/* 响应式布局 - 超大型屏幕 */
@media (min-width: 1600px) {
  .panels-container {
    max-width: 1800px;
  }
  
  .user-row-panels,
  .additional-container {
    max-width: 1600px;
  }
}

/* 添加主内容区域样式 */
.main-content {
  flex: 1;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
}

/* 全宽底部栏样式 */
.full-width-footer {
  width: 100%;
  background-color: var(--footer-bg-color, #f5f5f5);
  border-top: 1px solid var(--border-color, #eaeaea);
  padding: 1.5rem 0;
  margin-top: auto; /* 确保底部栏在底部 */
}

.footer-content {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 1.5rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: 1rem;
}

.footer-content p {
  margin: 0;
  color: var(--secondary-text-color, #777777);
  font-size: 0.9rem;
}

.footer-links {
  display: flex;
  gap: 1.5rem;
  flex-wrap: wrap;
  justify-content: center;
}

.footer-links a {
  color: var(--text-color, #333333);
  text-decoration: none;
  font-size: 0.9rem;
  transition: color 0.2s ease;
}

.footer-links a:hover {
  color: var(--primary-color, #000000);
  text-decoration: underline;
}

/* 深色模式适配 */
:root[data-theme="dark"] .user-profile-view {
  background-color: #1a1a1a !important;
}

:root[data-theme="dark"] .tab-button:hover:not(.active) {
  background-color: rgba(255, 255, 255, 0.1);
}

:root[data-theme="dark"] .full-width-footer {
  background-color: var(--footer-bg-color, #222222);
  border-top: 1px solid var(--border-color, #333333);
}

:root[data-theme="dark"] .footer-links a:hover {
  color: var(--primary-color, #ffffff);
}

/* 确保深色模式下按钮颜色正确 */
:root[data-theme="dark"] .tab-button.active {
  background-color: var(--btn-primary-bg, #ffffff);
  color: var(--btn-primary-text, #000000);
}

/* 添加面板切换动画 */
.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: all 0.3s ease;
}

.fade-slide-enter-from {
  opacity: 0;
  transform: translateX(30px);
}

.fade-slide-leave-to {
  opacity: 0;
  transform: translateX(-30px);
}
</style> 