<template>
  <div class="user-profile-container">
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
      <!-- 用户信息面板 -->
      <UserInfoPanel class="user-info-panel-container" />
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router';
import UserInfoPanel from '@/components/user/UserInfoPanel.vue';

// 路由实例
const router = useRouter();

// 返回主页方法
const goToHome = () => {
  router.push('/');
};
</script>

<style scoped>
.user-profile-container {
  padding: 1rem;
  height: 100vh; /* 占满整个视口高度 */
  width: 100%;
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
  overflow-y: auto;
}

.profile-header {
  margin-bottom: 1.5rem;
  border-bottom: none;
  padding-bottom: 0.5rem;
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
  padding: 0.5rem 0;
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
  background-color: transparent;
  border-radius: 8px;
  overflow: hidden;
  align-items: flex-start; /* 让子元素不拉伸 */
}

.user-info-panel-container {
  flex: 0 0 auto; /* 不拉伸，不收缩，保持自然大小 */
  max-width: 600px; /* 限制最大宽度 */
}

@media (max-width: 768px) {
  .user-profile-container {
    padding: 0.75rem;
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
  }
}

@media (min-width: 1201px) {
  .panels-container {
    flex-direction: row;
    gap: 1.5rem;
  }
}
</style> 