<template>
  <va-button
    class="theme-toggle"
    preset="secondary"
    icon
    @click="toggleTheme"
  >
    <i :data-lucide="isDark ? 'sun' : 'moon'" class="theme-icon"></i>
  </va-button>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue';
import iconService from '@/services/utils/iconService';

const isDark = ref(false);

// 初始化图标
onMounted(async () => {
  await iconService.loadLucideIcons();
  // 从localStorage获取主题设置
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme) {
    isDark.value = savedTheme === 'dark';
    applyTheme(isDark.value);
  }
  // 确保图标被正确初始化
  iconService.initLucideIcons();
});

// 监听主题变化，重新初始化图标
watch(isDark, () => {
  iconService.initLucideIcons();
});

// 切换主题
const toggleTheme = () => {
  isDark.value = !isDark.value;
  applyTheme(isDark.value);
  // 保存主题设置
  localStorage.setItem('theme', isDark.value ? 'dark' : 'light');
};

// 应用主题
const applyTheme = (dark) => {
  document.documentElement.setAttribute('data-theme', dark ? 'dark' : 'light');
};
</script>

<style scoped>
.theme-toggle {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
}

.theme-icon {
  width: 20px;
  height: 20px;
  transition: transform 0.3s ease;
  stroke: currentColor;
}

.theme-toggle:hover .theme-icon {
  transform: rotate(180deg);
}

/* 深色模式下的样式 */
:root[data-theme="dark"] .theme-icon {
  color: white;
}

/* 浅色模式下的样式 */
:root[data-theme="light"] .theme-icon {
  color: black;
}
</style> 