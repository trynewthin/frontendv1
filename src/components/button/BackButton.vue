<template>
  <va-button
    class="back-button"
    preset="secondary"
    icon
    @click="goBack"
  >
    <i class="back-icon">
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M19 12H5"></path>
        <path d="m12 19-7-7 7-7"></path>
      </svg>
    </i>
  </va-button>
</template>

<script setup>
import { useRouter } from 'vue-router';

const router = useRouter();

// 返回上一级路由
const goBack = () => {
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
</style> 