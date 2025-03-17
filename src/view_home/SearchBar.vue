<template>
  <div class="search-bar" :class="{ 'dark-mode': isDarkMode }">
    <input 
      type="text" 
      class="search-input" 
      placeholder="搜索车辆品牌、型号、类别..." 
      v-model="keyword"
      @keyup.enter="handleSearch"
    />
    <button class="search-button" @click="handleSearch">
      <img src="/icons/search.svg" alt="搜索" class="search-icon" />
    </button>
  </div>
  
  <!-- 添加登录确认对话框 -->
  <LoginConfirmDialog
    v-model="showLoginDialog"
    :return-action="`search:${keyword}`"
  />
</template>

<script setup>
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import LoginConfirmDialog from '@/components/modelwindow/LoginConfirmDialog.vue';
import { searchCars } from '@/services/car/carSearchService';

// 获取router实例
const router = useRouter();

// 搜索关键词
const keyword = ref('');
// 登录确认对话框显示状态
const showLoginDialog = ref(false);

// 检测是否为深色模式
const isDarkMode = computed(() => {
  // 获取根元素的data-theme属性
  return document.documentElement.getAttribute('data-theme') === 'dark';
});

// 检查用户是否已登录
const isUserLoggedIn = () => {
  // 获取localStorage中的token
  const token = localStorage.getItem('token');
  return !!token; // 如果token存在则返回true，否则返回false
};

// 处理搜索事件
const handleSearch = () => {
  // 确保关键词不为空
  if (!keyword.value.trim()) {
    return;
  }
  
  // 检查用户是否已登录
  if (!isUserLoggedIn()) {
    // 显示登录确认对话框
    showLoginDialog.value = true;
    return;
  }
  
  // 用户已登录，执行搜索
  executeSearch();
};

// 执行搜索
const executeSearch = () => {
  // 导航到搜索结果页面，并传递搜索关键词
  router.push({
    path: '/car/search',
    query: { keyword: keyword.value.trim() }
  });
};
</script>

<style scoped>
.search-bar {
  display: flex;
  align-items: center;
  width: 100%;
  max-width: 500px;
  height: 40px;
  border: 1px solid rgba(0, 0, 0, 0.1);
  border-radius: 20px;
  overflow: hidden;
  transition: all 0.3s ease;
  background-color: rgba(255, 255, 255, 0.3);
  margin: 0 auto;
  position: relative;
  z-index: 1;
}

.search-bar:hover, 
.search-bar:focus-within {
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  border-color: rgba(0, 0, 0, 0.2);
  background-color: rgba(255, 255, 255, 0.5);
}

.search-input {
  flex-grow: 1;
  height: 100%;
  padding: 0 16px;
  border: none;
  outline: none;
  background-color: transparent;
  font-size: 14px;
  color: #333;
}

.search-input::placeholder {
  color: rgba(0, 0, 0, 0.6);
}

.search-button {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 40px;
  height: 40px;
  border: none;
  background-color: transparent;
  cursor: pointer;
  transition: all 0.3s ease;
}

.search-button:hover {
  background-color: rgba(0, 0, 0, 0.05);
}

.search-icon {
  width: 20px;
  height: 20px;
  color: #333;
}

/* 深色模式样式 */
.search-bar.dark-mode {
  border-color: rgba(255, 255, 255, 0.1);
  background-color: rgba(0, 0, 0, 0.3);
}

.search-bar.dark-mode:hover,
.search-bar.dark-mode:focus-within {
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
  border-color: rgba(255, 255, 255, 0.2);
  background-color: rgba(0, 0, 0, 0.5);
}

.search-bar.dark-mode .search-input {
  color: #fff;
}

.search-bar.dark-mode .search-input::placeholder {
  color: rgba(255, 255, 255, 0.6);
}

.search-bar.dark-mode .search-button:hover {
  background-color: rgba(255, 255, 255, 0.1);
}

.search-bar.dark-mode .search-icon {
  filter: invert(1) brightness(1.2);
  opacity: 0.9;
}

@media (max-width: 768px) {
  .search-bar {
    max-width: 280px;
    height: 36px;
  }
  
  .search-button {
    width: 36px;
    height: 36px;
  }
  
  .search-icon {
    width: 18px;
    height: 18px;
  }
  
  .search-input {
    font-size: 13px;
  }
}
</style>