<template>
  <va-button
    class="message-button"
    preset="secondary"
    icon
    @click="goToMessages"
    v-tooltip="'消息中心'"
  >
    <i class="message-icon">
      <img src="/icons/message-circle.svg" alt="消息中心" />
    </i>
  </va-button>
</template>

<script setup>
import { useRouter } from 'vue-router';

const router = useRouter();

// 跳转到消息中心页面
const goToMessages = () => {
  router.push('/messages');
};
</script>

<style scoped>
.message-button {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
}

.message-icon {
  width: 20px;
  height: 20px;
  transition: transform 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.message-icon img {
  width: 100%;
  height: 100%;
}

.message-button:hover .message-icon {
  transform: scale(1.1); /* 悬停时放大 */
}

/* 深色模式下的样式 */
:root[data-theme="dark"] .message-icon {
  color: white;
}

/* 浅色模式下的样式 */
:root[data-theme="light"] .message-icon {
  color: black;
}

/* 深色模式下的样式 */
:root[data-theme="dark"] .message-icon img {
  filter: brightness(0) invert(1); /* 反转颜色使其在深色背景下显示为白色 */
}

/* 浅色模式下的样式 */
:root[data-theme="light"] .message-icon img {
  filter: none;
}
</style> 