<template>
  <va-button
    class="home-button"
    preset="secondary"
    icon
    @click="goToHome"
  >
    <i class="home-icon">
      <img src="/icons/home.svg" alt="主页" />
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

.home-icon img {
  width: 100%;
  height: 100%;
}

.home-button:hover .home-icon {
  transform: rotate(-30deg); /* 旋转动画，向左旋转30度 */
}

/* 深色模式下的样式 */
:root[data-theme="dark"] .home-icon {
  color: white;
}

/* 浅色模式下的样式 */
:root[data-theme="light"] .home-icon {
  color: black;
}

/* 深色模式下的样式 */
:root[data-theme="dark"] .home-icon img {
  filter: brightness(0) invert(1); /* 反转颜色使其在深色背景下显示为白色 */
}

/* 浅色模式下的样式 */
:root[data-theme="light"] .home-icon img {
  filter: none;
}
</style> 