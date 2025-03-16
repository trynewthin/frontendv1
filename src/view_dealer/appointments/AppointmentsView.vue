<template>
  <div class="panels-container">
    <div class="full-panel">
      <AppointmentPanel :currentUserId="currentUserId" />
    </div>
  </div>
</template>

<script setup>
import { defineProps } from 'vue';
import AppointmentPanel from './components/AppointmentPanel.vue';

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

/* 全宽面板容器 */
.full-panel {
  width: 100%;
  min-height: 350px;
  display: flex;
  justify-content: center;
  align-items: stretch;
}

/* 占位面板 */
.placeholder-panel {
  width: 100%;
  background-color: var(--card-bg-color, #ffffff);
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
  border: 1px solid var(--card-border-color, #eaeaea);
  padding: 2rem;
  text-align: center;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  min-height: 300px;
}

.placeholder-panel h3 {
  font-size: 1.5rem;
  margin-bottom: 1rem;
  color: var(--text-color, #333);
}

.placeholder-panel p {
  color: var(--secondary-text-color, #666);
  font-size: 1rem;
}

.small-text {
  font-size: 0.8rem;
  margin-top: 2rem;
  opacity: 0.6;
}

/* 响应式布局 - 移动设备 */
@media (max-width: 768px) {
  .panels-container {
    padding: 1rem;
    gap: 1rem;
  }
  
  .placeholder-panel {
    padding: 1.5rem;
    min-height: 250px;
  }
  
  .placeholder-panel h3 {
    font-size: 1.2rem;
  }
}

/* 深色模式适配 */
:root[data-theme="dark"] .placeholder-panel {
  background-color: var(--card-bg-color, #1f1f1f);
  border-color: var(--card-border-color, #333333);
}

:root[data-theme="dark"] .placeholder-panel h3 {
  color: var(--text-color, #e0e0e0);
}

:root[data-theme="dark"] .placeholder-panel p {
  color: var(--secondary-text-color, #aaaaaa);
}
</style> 