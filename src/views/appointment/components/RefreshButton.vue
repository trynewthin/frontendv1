<template>
  <va-button
    class="refresh-button"
    preset="secondary"
    icon
    @click="handleRefresh"
  >
    <i class="refresh-icon">
      <img src="/icons/refresh.svg" alt="刷新" />
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

.refresh-icon img {
  width: 100%;
  height: 100%;
}

/* 深色模式下的样式 */
:root[data-theme="dark"] .refresh-icon img {
  filter: brightness(0) invert(1); /* 反转颜色使其在深色背景下显示为白色 */
}

/* 浅色模式下的样式 */
:root[data-theme="light"] .refresh-icon img {
  filter: none;
}
</style> 