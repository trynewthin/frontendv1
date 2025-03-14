<template>
  <va-button
    class="refresh-button"
    preset="secondary"
    icon
    @click="handleRefresh"
  >
    <i class="refresh-icon">
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"></path>
        <path d="M3 3v5h5"></path>
        <path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16"></path>
        <path d="M16 21h5v-5"></path>
      </svg>
    </i>
  </va-button>
</template>

<script setup>
import { defineEmits } from 'vue';

const emit = defineEmits(['refresh']);

// 处理刷新操作
const handleRefresh = () => {
  emit('refresh');
};
</script>

<style scoped>
.refresh-button {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
}

.refresh-icon {
  width: 20px;
  height: 20px;
  transition: transform 0.5s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.refresh-button:hover .refresh-icon {
  transform: rotate(180deg); /* 点击时旋转180度，模拟刷新动作 */
}

/* 深色模式下的样式 */
:root[data-theme="dark"] .refresh-icon {
  color: white;
}

/* 浅色模式下的样式 */
:root[data-theme="light"] .refresh-icon {
  color: black;
}
</style> 