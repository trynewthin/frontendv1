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
      <!-- 第一列：用户信息和偏好面板 -->
      <div class="panels-column">
        <!-- 用户信息面板 -->
        <UserCard class="user-panel" />
        
        <!-- 用户偏好面板 -->
        <UserPreferencePanel class="user-panel" />
      </div>
      
      <!-- 第二列：历史记录和收藏 -->
      <div class="panels-column">
        <!-- 用户收藏列表面板 (独立面板) -->
        <UserFavoritePanel class="user-panel" />
        
        <!-- 用户浏览历史面板 -->
        <UserBrowseHistoryPanel class="user-panel" />
        
        <!-- 用户搜索历史面板 -->
        <UserSearchHistoryPanel class="user-panel" />
      </div>
    </div>
  </div>
</template>

<script setup>
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

.panels-column {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  width: 100%;
  align-items: stretch;
}

.user-panel {
  flex: 0 0 auto;
  width: 100%;
  max-width: 100%;
  margin: 0;
  border-radius: 8px;
}

/* 响应式布局 - 移动设备 */
@media (max-width: 599px) {
  .panels-container {
    padding: 1rem;
    gap: 1rem;
  }
  
  .panels-column {
    gap: 1rem;
  }
}

/* 响应式布局 - 平板 */
@media (min-width: 600px) and (max-width: 959px) {
  .panels-container {
    padding: 1.25rem;
    gap: 1.25rem;
  }
  
  .panels-column {
    gap: 1.25rem;
  }
}

/* 响应式布局 - 小型桌面 */
@media (min-width: 960px) {
  .panels-container {
    flex-direction: row;
    flex-wrap: wrap;
    align-items: flex-start;
  }
  
  .panels-column {
    flex: 1;
    min-width: 0;
    width: calc(50% - 1rem);
    max-width: calc(50% - 1rem);
  }
  
  /* 确保两列之间有足够间距 */
  .panels-column:nth-child(odd) {
    margin-right: 1rem;
  }
  
  .panels-column:nth-child(even) {
    margin-left: 1rem;
  }
}

/* 响应式布局 - 中型桌面 */
@media (min-width: 960px) and (max-width: 1279px) {
  .panels-container {
    padding: 1.5rem;
    gap: 1.5rem;
  }
}

/* 响应式布局 - 大型桌面 */
@media (min-width: 1280px) {
  .panels-container {
    padding: 2rem;
    gap: 2rem;
    max-width: 1600px;
  }
  
  .panels-column {
    width: calc(50% - 1.5rem);
    max-width: calc(50% - 1.5rem);
  }
  
  .panels-column:nth-child(odd) {
    margin-right: 1.5rem;
  }
  
  .panels-column:nth-child(even) {
    margin-left: 1.5rem;
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