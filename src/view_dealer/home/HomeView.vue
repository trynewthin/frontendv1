<template>
  <div class="panels-container">
    <!-- 用户信息和经销商信息面板横向排列 -->
    <div class="user-row-panels">
      <UserCard class="user-panel user-row-panel" />
      <DealerInfo 
        class="dealer-panel user-row-panel" 
        :userId="currentUserId"
      />
    </div>
  </div>
</template>

<script setup>
import { defineProps } from 'vue';
import UserCard from '@components/card/UserCard.vue';
import DealerInfo from './components/DealerInfo.vue';

// 接收从父组件传递的用户ID
const props = defineProps({
  currentUserId: {
    type: [Number, String],
    default: null
  }
});
</script>

<style scoped>
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

/* 响应式布局 - 移动设备 */
@media (max-width: 768px) {
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
}
</style> 