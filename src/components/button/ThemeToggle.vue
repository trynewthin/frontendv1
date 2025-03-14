<template>
  <va-button
    class="theme-toggle"
    preset="secondary"
    icon
    @click="toggleTheme"
  >
    <i class="theme-icon" v-if="isDark">
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <circle cx="12" cy="12" r="4"></circle>
        <path d="M12 2v2"></path>
        <path d="M12 20v2"></path>
        <path d="m4.93 4.93 1.41 1.41"></path>
        <path d="m17.66 17.66 1.41 1.41"></path>
        <path d="M2 12h2"></path>
        <path d="M20 12h2"></path>
        <path d="m6.34 17.66-1.41 1.41"></path>
        <path d="m19.07 4.93-1.41 1.41"></path>
      </svg>
    </i>
    <i class="theme-icon" v-else>
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"></path>
      </svg>
    </i>
  </va-button>
</template>

<script setup>
import { ref, onMounted } from 'vue';

const isDark = ref(false);

// 初始化主题
onMounted(() => {
  // 从localStorage获取主题设置
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme) {
    isDark.value = savedTheme === 'dark';
    applyTheme(isDark.value);
  } else {
    // 如果没有保存的主题，检查系统偏好
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    isDark.value = prefersDark;
    applyTheme(prefersDark);
    localStorage.setItem('theme', prefersDark ? 'dark' : 'light');
  }
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
  display: flex;
  align-items: center;
  justify-content: center;
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