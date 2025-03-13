<template>
  <va-button 
    class="home-button" 
    @click="goToHome" 
    preset="secondary" 
    icon="arrow_back" 
    size="small"
  >
    返回首页
  </va-button>
</template>

<script setup>
import { useRouter } from 'vue-router';

const router = useRouter();

// 返回首页
const goToHome = () => {
  router.push('/');
};
</script>

<style scoped>
.home-button {
  font-weight: 500;
  border-radius: 4px;
  transition: all 0.3s ease;
}

/* 深色模式下的样式 */
:root[data-theme="dark"] .home-button {
  color: #FFD700;
}

:root[data-theme="dark"] .home-button:hover {
  background-color: rgba(255, 215, 0, 0.1);
}
</style> 