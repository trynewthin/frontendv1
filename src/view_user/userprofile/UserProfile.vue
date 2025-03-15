<template>
  <div class="user-profile-container user-profile-view">
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
    
    <!-- 面板显示容器 -->
    <div class="panels-container">
      <!-- 用户信息和偏好面板横向排列 -->
      <div class="user-row-panels">
        <!-- 用户信息面板 -->
        <UserCard class="user-panel user-row-panel" />
        
        <!-- 用户偏好面板 -->
        <UserPreferencePanel class="user-panel user-row-panel" />
      </div>
      
      <!-- 历史记录和收藏切换面板 -->
      <div class="history-favorites-switch-panel user-panel">
        <div class="switch-buttons">
          <button @click="activePanel = 'favorites'" :class="{ active: activePanel === 'favorites' }">收藏</button>
          <button @click="activePanel = 'browseHistory'" :class="{ active: activePanel === 'browseHistory' }">浏览历史</button>
          <button @click="activePanel = 'searchHistory'" :class="{ active: activePanel === 'searchHistory' }">搜索历史</button>
        </div>
        <div class="panel-content">
          <UserFavoritePanel v-if="activePanel === 'favorites'" />
          <UserBrowseHistoryPanel v-if="activePanel === 'browseHistory'" />
          <UserSearchHistoryPanel v-if="activePanel === 'searchHistory'" />
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
import Bheader from '@/components/header/bheader.vue';
import ThemeToggle from '@/components/button/ThemeToggle.vue';

// 路由实例
const router = useRouter();

// 当前激活的面板
const activePanel = ref('favorites');
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
  min-height: 400px;
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

/* 历史记录和收藏切换面板样式 */
.history-favorites-switch-panel {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  width: 100%;
  max-width: 100%;
  margin: 0;
  border-radius: 8px;
  background-color: var(--card-bg-color, #ffffff);
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
  padding: 1.5rem;
  border: 1px solid var(--card-border-color, #eaeaea);
}

.switch-buttons {
  display: flex;
  justify-content: space-around;
  margin-bottom: 1rem;
}

.switch-buttons button {
  background: none;
  border: none;
  font-size: 1rem;
  font-weight: 500;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.switch-buttons button.active {
  background-color: var(--btn-primary-bg, #000000);
  color: var(--btn-primary-text, #ffffff);
}

.panel-content {
  flex: 1;
  display: flex;
  flex-direction: column;
}

/* 响应式布局 - 移动设备 */
@media (max-width: 599px) {
  .panels-container {
    padding: 1rem;
    gap: 1rem;
  }
  
  .history-favorites-switch-panel {
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
}

/* 响应式布局 - 平板 */
@media (min-width: 600px) and (max-width: 959px) {
  .panels-container {
    padding: 1.25rem;
    gap: 1.25rem;
  }
  
  .history-favorites-switch-panel {
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
    align-items: center;
  }
  
  .user-row-panels {
    max-width: 1200px;
  }
}

/* 响应式布局 - 中型桌面 */
@media (min-width: 960px) and (max-width: 1279px) {
  .panels-container {
    padding: 1.5rem;
    gap: 1.5rem;
  }
  
  .history-favorites-switch-panel {
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
  
  .history-favorites-switch-panel {
    gap: 2rem;
  }
  
  .user-row-panels {
    gap: 2rem;
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
}

/* 深色模式适配 */
:root[data-theme="dark"] .user-profile-view {
  background-color: #1a1a1a !important;
}
</style> 