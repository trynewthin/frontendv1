<template>
  <va-button
    class="theme-toggle"
    preset="secondary"
    icon
    @click="toggleTheme"
  >
    <i class="theme-icon" v-if="isDark">
      <img src="/icons/sun.svg" alt="亮色模式" />
    </i>
    <i class="theme-icon" v-else>
      <img src="/icons/moon.svg" alt="暗色模式" />
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
  
  // 触发事件通知应用主题已更改
  window.dispatchEvent(new CustomEvent('theme-changed', {
    detail: { theme: isDark.value ? 'dark' : 'light' }
  }));
  
  // 深色模式处理
  if (isDark.value) {
    document.body.classList.add('theme-dark');
    document.body.style.backgroundColor = '#121212';
  } else {
    document.body.classList.remove('theme-dark');
    document.body.style.backgroundColor = '';
  }
};

// 应用主题
const applyTheme = (dark) => {
  document.documentElement.setAttribute('data-theme', dark ? 'dark' : 'light');
  
  // 同时设置 body 的背景色
  if (dark) {
    document.body.style.backgroundColor = '#121212';
  } else {
    document.body.style.backgroundColor = '';
  }
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

.theme-icon img {
  width: 100%;
  height: 100%;
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

/* 深色模式下的样式 */
:root[data-theme="dark"] .theme-icon img {
  filter: brightness(0) invert(1); /* 反转颜色使其在深色背景下显示为白色 */
}

/* 浅色模式下的样式 */
:root[data-theme="light"] .theme-icon img {
  filter: none;
}
</style> 