<!-- 聊天页面加载更多按钮 -->
<template>
  <va-button
    class="load-more-button"
    preset="secondary"
    size="small"
    @click="$emit('loadMore')"
  >
    <i class="load-more-icon">
      <img src="/icons/refresh.svg" alt="加载更多" />
    </i>
    <span class="load-more-text">加载更多</span>
  </va-button>
</template>

<script setup>
defineEmits(['loadMore']);
</script>

<style scoped>
.load-more-button {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  transition: all 0.3s ease;
  padding: 8px 16px;
  border-radius: 20px;
}

.load-more-icon {
  width: 16px;
  height: 16px;
  transition: transform 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.load-more-icon img {
  width: 100%;
  height: 100%;
}

.load-more-button:hover .load-more-icon {
  transform: rotate(180deg); /* 旋转动画，模拟刷新/加载效果 */
}

.load-more-text {
  font-size: 0.9rem;
}

/* 深色模式下的样式 */
:root[data-theme="dark"] .load-more-icon {
  color: white;
}

/* 浅色模式下的样式 */
:root[data-theme="light"] .load-more-icon {
  color: black;
}

/* 深色模式下的样式 */
:root[data-theme="dark"] .load-more-icon img {
  filter: brightness(0) invert(1); /* 反转颜色使其在深色背景下显示为白色 */
}

/* 浅色模式下的样式 */
:root[data-theme="light"] .load-more-icon img {
  filter: none;
}
</style> 