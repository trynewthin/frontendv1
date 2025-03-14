<template>
  <va-button
    class="home-button"
    preset="secondary"
    icon
    @click="goToHome"
  >
    <i class="home-icon">
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
        <polyline points="9 22 9 12 15 12 15 22"></polyline>
      </svg>
    </i>
  </va-button>
</template>

<script setup>
import { useRouter } from 'vue-router';

const router = useRouter();

// 返回主页
const goToHome = () => {
  router.push('/');
};
</script>

<style scoped>
.home-button {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
}

.home-icon {
  width: 20px;
  height: 20px;
  transition: transform 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.home-button:hover .home-icon {
  transform: translateY(-2px);
}

/* 深色模式下的样式 */
:root[data-theme="dark"] .home-icon {
  color: white;
}

/* 浅色模式下的样式 */
:root[data-theme="light"] .home-icon {
  color: black;
}
</style> 