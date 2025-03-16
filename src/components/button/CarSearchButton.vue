<template>
  <va-button
    class="car-search-button"
    preset="secondary"
    icon
    @click="handleClick"
  >
    <i class="search-icon">
      <img src="/icons/search.svg" alt="搜索车辆" />
    </i>
  </va-button>
  
  <!-- 登录确认对话框 -->
  <LoginConfirmDialog
    v-model="showLoginDialog"
    :return-action="'search'"
  />
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { userAuthService } from '@services/user';
import LoginConfirmDialog from '@components/modelwindow/LoginConfirmDialog.vue';

const router = useRouter();
const emit = defineEmits(['click']);
const showLoginDialog = ref(false);

// 处理点击事件
const handleClick = (event) => {
  // 触发click事件给父组件，传递event对象
  emit('click', event);
  
  // 检查是否有父组件阻止默认行为
  if (event && event.defaultPrevented) {
    return;
  }
  
  // 检查是否已登录
  if (!userAuthService.isLoggedIn()) {
    // 未登录，显示登录确认对话框
    showLoginDialog.value = true;
    return;
  }
  
  // 已登录，导航到车辆搜索页面
  router.push('/car-search');
};
</script>

<style scoped>
.car-search-button {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
}

.search-icon {
  width: 20px;
  height: 20px;
  transition: transform 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.search-icon img {
  width: 100%;
  height: 100%;
}

.car-search-button:hover .search-icon {
  transform: scale(1.1); /* 悬停时略微放大图标 */
}

/* 深色模式下的样式 */
:root[data-theme="dark"] .search-icon {
  color: white;
}

/* 浅色模式下的样式 */
:root[data-theme="light"] .search-icon {
  color: black;
}

/* 深色模式下的样式 */
:root[data-theme="dark"] .search-icon img {
  filter: brightness(0) invert(1); /* 反转颜色使其在深色背景下显示为白色 */
}

/* 浅色模式下的样式 */
:root[data-theme="light"] .search-icon img {
  filter: none;
}
</style> 