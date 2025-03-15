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
        <UserInfoPanel class="user-panel" />
        
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
import UserInfoPanel from './components/UserInfoPanel.vue';
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
  background-color: transparent;
  border-radius: 0; /* 移除边框圆角 */
  overflow: visible;
  gap: 1rem; /* 稍微减小间距 */
  padding: 1rem; /* 保持左右和底部内边距 */
  margin-top: 1rem; /* 添加顶部间距 */
}

.panels-column {
  display: flex;
  flex-direction: column;
  gap: 1rem; /* 减小列内间距 */
  width: 100%;
  align-items: stretch;
}

.user-panel {
  flex: 0 0 auto;
  width: 100%;
  max-width: 100%;
  margin: 0; /* 确保没有外边距 */
  border-radius: 8px; /* 保持面板的圆角 */
}

@media (max-width: 768px) {
  .panels-container {
    padding: 0.5rem;
  }
}

@media (min-width: 769px) and (max-width: 1200px) {
  .panels-container {
    flex-direction: row;
    flex-wrap: wrap;
    gap: 1rem;
    align-items: flex-start;
  }
  
  .panels-column {
    flex: 1;
    min-width: 350px;
    width: calc(50% - 0.5rem); /* 调整宽度计算 */
    max-width: none; /* 移除最大宽度限制 */
  }
}

@media (min-width: 1201px) {
  .panels-container {
    flex-direction: row;
    gap: 1.5rem;
    align-items: flex-start;
  }
  
  .panels-column {
    flex: 1;
    min-width: 400px;
  }
}

/* 深色模式适配 */
:root[data-theme="dark"] .user-profile-view {
  background-color: #1a1a1a !important;
}
</style> 