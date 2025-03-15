<template>
  <va-button
    class="back-button"
    preset="secondary"
    icon
    @click="handleClick"
  >
    <i class="back-icon">
      <img src="/icons/back.svg" alt="返回" />
    </i>
  </va-button>
</template>

<script setup>
import { useRouter } from 'vue-router';

const router = useRouter();
const emit = defineEmits(['click']);

// 处理点击事件
const handleClick = (event) => {
  // 触发click事件给父组件，传递event对象
  emit('click', event);
  
  // 检查是否有父组件阻止默认行为
  if (event && event.defaultPrevented) {
    return;
  }
  
  // 使用默认行为（返回上一级）
  router.back();
};
</script>

<style scoped>
.back-button {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
}

.back-icon {
  width: 20px;
  height: 20px;
  transition: transform 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.back-icon img {
  width: 100%;
  height: 100%;
}

.back-button:hover .back-icon {
  transform: translateX(-3px); /* 悬停时向左移动，表示后退动作 */
}

/* 深色模式下的样式 */
:root[data-theme="dark"] .back-icon {
  color: white;
}

/* 浅色模式下的样式 */
:root[data-theme="light"] .back-icon {
  color: black;
}

/* 深色模式下的样式 */
:root[data-theme="dark"] .back-icon img {
  filter: brightness(0) invert(1); /* 反转颜色使其在深色背景下显示为白色 */
}

/* 浅色模式下的样式 */
:root[data-theme="light"] .back-icon img {
  filter: none;
}
</style> 