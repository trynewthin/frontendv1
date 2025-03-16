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
    >
      <template #right-content>
        <theme-toggle />
      </template>
    </bheader>
    
    <!-- 主内容区域 -->
    <div class="main-content">
      <UserCard class="user-panel" />
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import UserCard from '@components/card/UserCard.vue';
import Bheader from '@components/header/bheader.vue';
import ThemeToggle from '@components/button/ThemeToggle.vue';
import AnimatedBackground from '@components/background/AnimatedBackground.vue';

// 当前用户ID
const currentUserId = ref(null);
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
  padding: 1rem;
  margin-top: 100px; /* 为header留出空间 */
}

.user-panel {
  width: 100%;
  max-width: 600px;
  margin: 0 auto;
  border-radius: 8px;
}

@media (max-width: 768px) {
  .main-content {
    padding: 0.5rem;
  }
}

/* 深色模式适配 */
:root[data-theme="dark"] .user-profile-view {
  background-color: #1a1a1a !important;
}
</style> 