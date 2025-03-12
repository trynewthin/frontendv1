<template>
  <div class="user-profile-container user-profile-view">
    <div class="profile-header">
      <h1 class="page-title">个人中心</h1>
    </div>
    
    <!-- 工具标题栏 -->
    <div class="tools-bar">
      <!-- 返回主页按钮 -->
      <button class="tool-button" @click="goToHome">
        <i class="fa fa-home"></i> 返回主页
      </button>
    </div>
    
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
import { ref } from 'vue';
import UserInfoPanel from '@/components/user/UserInfoPanel.vue';
import UserPreferencePanel from '@/components/user/UserPreferencePanel.vue';
import UserFavoritePanel from '@/components/user/UserFavoritePanel.vue';
import UserBrowseHistoryPanel from '@/components/user/UserBrowseHistoryPanel.vue';
import UserSearchHistoryPanel from '@/components/user/UserSearchHistoryPanel.vue';

// 路由实例
const router = useRouter();

// 返回主页方法
const goToHome = () => {
  router.push('/');
};
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

.profile-header {
  margin-bottom: 1.5rem;
  border-bottom: none;
  padding: 1rem 1rem 0.5rem; /* 将padding移到这里 */
  text-align: left;
}

.page-title {
  font-size: 2rem;
  color: var(--va-primary);
  font-weight: 600;
  display: inline-block;
  border-bottom: 2px solid var(--va-primary);
  padding-bottom: 0.5rem;
  margin-bottom: 0;
}

.tools-bar {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  margin-bottom: 1.5rem;
  padding: 0.5rem 1rem; /* 保持左右内边距一致 */
}

.tool-button {
  padding: 0.5rem 1rem;
  background-color: var(--va-primary);
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.9rem;
  transition: background-color 0.2s;
}

.tool-button:hover {
  background-color: rgb(146, 183, 252);
  color: rgb(0, 0, 0);
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
  padding: 0 1rem 1rem; /* 保持左右和底部内边距 */
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
  .profile-header,
  .tools-bar,
  .panels-container {
    padding-left: 0.5rem;
    padding-right: 0.5rem;
  }
  
  .page-title {
    font-size: 1.5rem;
  }
  
  .tools-bar {
    gap: 0.5rem;
    margin-bottom: 1rem;
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
</style> 