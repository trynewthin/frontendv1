<template>
  <div class="user-panel-container">
    <div class="card user-favorite-panel">
      <div class="card-content">
        <!-- 标题 -->
        <div class="card-title">我的收藏</div>
        
        <!-- 调试信息 -->
        <div v-if="debugInfo" class="debug-info">
          <pre>{{ debugInfo }}</pre>
        </div>
        
        <div v-if="loading" class="loading-container">
          <div class="loading-spinner"></div>
          <p>加载中...</p>
        </div>
        
        <div v-else-if="error" class="error-container">
          <span class="error-icon">⚠️</span>
          <p>{{ error }}</p>
          <button class="btn btn-primary" @click="fetchFavorites">重试</button>
        </div>
        
        <div v-else-if="favoriteList.length === 0" class="empty-container">
          <span class="empty-icon">❤️</span>
          <p>暂无收藏的车辆</p>
          <button class="btn btn-primary" @click="goToCarList">
            去挑选车辆
          </button>
        </div>
        
        <div v-else class="favorite-content">
          <ul class="favorite-list">
            <li v-for="item in favoriteList" :key="item.carId" class="favorite-item">
              <div class="item-content">
                <div class="car-info">
                  <div class="car-details">
                    <div class="car-name">{{ item.carName || `${item.brand} ${item.model}` }}</div>
                    <div class="car-price">￥{{ formatPrice(item.carPrice) }}</div>
                    <div class="favorite-time">收藏于 {{ formatDate(item.favoriteTime) }}</div>
                  </div>
                </div>
              </div>
              <div class="item-actions">
                <button 
                  class="btn btn-icon view-btn" 
                  @click="viewCar(item.carId)"
                  title="查看车辆"
                >
                  <span>👁️</span>
                </button>
                <button 
                  class="btn btn-icon delete-btn"
                  @click="removeFavorite(item.carId)" 
                  :disabled="removingIds[item.carId]"
                  title="取消收藏"
                >
                  <span v-if="removingIds[item.carId]" class="loading-dot"></span>
                  <span v-else>×</span>
                </button>
              </div>
            </li>
          </ul>
          
          <div class="pagination-container" v-if="totalRecords > pageSize">
            <va-pagination
              v-model="currentPage"
              :pages="totalPages"
              @click="handlePageChange"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import favoriteService from '@/api/favoriteService';

// 路由
const router = useRouter();

// 状态变量
const loading = ref(true);
const error = ref('');
const favoriteList = ref([]);
const currentPage = ref(1);
const pageSize = ref(10);
const totalRecords = ref(0);
const removingIds = ref({});
const debugInfo = ref(null);

// 计算总页数
const totalPages = computed(() => {
  return Math.ceil(totalRecords.value / pageSize.value);
});

// 获取收藏列表
const fetchFavorites = async () => {
  loading.value = true;
  error.value = '';
  
  try {
    const result = await favoriteService.getFavoriteList({
      page: currentPage.value,
      size: pageSize.value
    });
    
    console.log('收藏组件获取的数据:', result);
    
    if (result.success) {
      favoriteList.value = result.data;
      totalRecords.value = result.total;
      currentPage.value = result.page;
      
      console.log('处理后的收藏列表:', favoriteList.value);
    } else {
      error.value = result.message || '获取收藏列表失败';
    }
  } catch (err) {
    console.error('获取收藏列表出错:', err);
    error.value = '获取收藏列表时发生错误';
  } finally {
    loading.value = false;
  }
};

// 处理页码变化
const handlePageChange = (page) => {
  currentPage.value = page;
  fetchFavorites();
};

// 取消收藏
const removeFavorite = async (carId) => {
  // 确认是否取消收藏
  if (!confirm('确定要取消收藏此车辆吗？')) {
    return;
  }
  
  removingIds.value[carId] = true;
  
  try {
    const result = await favoriteService.removeFavorite(carId);
    
    if (result.success) {
      // 从列表中移除已取消的收藏
      favoriteList.value = favoriteList.value.filter(item => item.carId !== carId);
      
      // 如果当前页没有数据了，且不是第一页，则回到上一页
      if (favoriteList.value.length === 0 && currentPage.value > 1) {
        currentPage.value -= 1;
        fetchFavorites();
      }
      
      // 更新总记录数
      totalRecords.value -= 1;
    } else {
      // 提示错误
      alert(result.message || '取消收藏失败');
    }
  } catch (err) {
    console.error('取消收藏出错:', err);
    alert('取消收藏时发生错误');
  } finally {
    removingIds.value[carId] = false;
  }
};

// 查看车辆详情
const viewCar = (carId) => {
  router.push(`/cars/${carId}`);
};

// 跳转到车辆列表页
const goToCarList = () => {
  router.push('/cars');
};

// 格式化价格
const formatPrice = (price) => {
  if (!price) return '0';
  return price.toLocaleString('zh-CN');
};

// 格式化日期
const formatDate = (dateString) => {
  if (!dateString) return '未知';
  
  const date = new Date(dateString);
  return date.toLocaleString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  });
};

// 组件挂载时获取收藏列表
onMounted(() => {
  fetchFavorites();
});
</script>

<style scoped>
.user-panel-container {
  position: relative;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
}

.card {
  background-color: var(--card-bg-color, #ffffff);
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
  overflow: hidden;
  transition: all 0.3s ease;
  width: 100%;
  max-width: 450px;
  height: auto;
  border: 1px solid var(--card-border-color, #eaeaea);
  color: var(--text-color, #333333);
}

.card-content {
  padding: 1.25rem;
}

.card-title {
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: 1.25rem;
  color: var(--text-color, #333333);
  border-bottom: 1px solid var(--border-color, #f0f0f0);
  padding-bottom: 0.75rem;
}

.loading-container,
.error-container,
.empty-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 1.5rem;
  gap: 0.75rem;
  text-align: center;
}

.loading-spinner {
  width: 30px;
  height: 30px;
  border: 3px solid var(--spinner-color, #f3f3f3);
  border-top: 3px solid var(--primary-color, #000000);
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.error-icon,
.empty-icon {
  font-size: 1.5rem;
}

.favorite-content {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.favorite-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.favorite-item {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  padding: 0.75rem;
  background-color: var(--item-bg-color, #f9f9f9);
  border-radius: 6px;
  transition: background-color 0.2s;
  border: 1px solid var(--item-border-color, #eee);
  text-align: left;
}

.favorite-item:hover {
  background-color: var(--item-hover-bg-color, #f0f0f0);
}

.item-content {
  flex: 1;
  overflow: hidden;
  text-align: left;
}

.car-info {
  display: flex;
  align-items: flex-start;
  text-align: left;
}

.car-details {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  width: 100%;
  text-align: left;
}

.car-name {
  font-weight: 500;
  color: var(--text-color, #333);
  text-align: left;
  font-size: 1rem;
}

.car-price {
  color: var(--primary-color, #000000);
  font-weight: 600;
  text-align: left;
}

.favorite-time {
  font-size: 0.85rem;
  color: var(--secondary-text-color, #777);
  text-align: left;
  margin-top: 0.25rem;
}

.item-actions {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  margin-left: 0.75rem;
  gap: 0.5rem;
}

.btn {
  background: none;
  border: none;
  font-size: 0.85rem;
  font-weight: 500;
  padding: 0.5rem 0.75rem;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-primary {
  background-color: var(--btn-primary-bg, #000000);
  color: var(--btn-primary-text, #ffffff);
  border: 1px solid transparent;
}

.btn-secondary {
  background-color: var(--btn-secondary-bg, #000000);
  color: var(--btn-secondary-text, #ffffff);
  border: 1px solid transparent;
  opacity: 0.85;
  font-size: 0.8rem;
}

.btn-icon {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0;
  font-size: 1.2rem;
  color: var(--icon-color, #777);
  background-color: var(--icon-bg-color, transparent);
}

.view-btn {
  color: var(--view-icon-color, #555);
}

.delete-btn {
  color: var(--delete-icon-color, #d32f2f);
}

.btn-icon:hover {
  background-color: var(--icon-hover-bg-color, #eee);
  color: var(--icon-hover-color, #333);
}

.btn-primary:hover {
  opacity: 0.9;
}

.btn-secondary:hover {
  opacity: 0.75;
}

.btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.pagination-container {
  display: flex;
  justify-content: center;
  margin-top: 1rem;
}

.loading-dot {
  display: inline-block;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background-color: currentColor;
  animation: pulse 1s infinite;
}

@keyframes pulse {
  0% { opacity: 0.3; }
  50% { opacity: 1; }
  100% { opacity: 0.3; }
}

/* 深色模式变量 - 默认浅色主题 */
:root {
  /* 卡片基础样式 */
  --card-bg-color: #ffffff;
  --card-border-color: #eaeaea;
  --text-color: #333333;
  --secondary-text-color: #777777;
  --border-color: #f0f0f0;
  --spinner-color: #f3f3f3;
  --primary-color: #000000;
  
  /* 列表项样式 */
  --item-bg-color: #f9f9f9;
  --item-hover-bg-color: #f0f0f0;
  --item-border-color: #eeeeee;
  
  /* 图标样式 */
  --icon-color: #777777;
  --icon-hover-color: #333333;
  --icon-bg-color: transparent;
  --icon-hover-bg-color: #eeeeee;
  --view-icon-color: #555555;
  --delete-icon-color: #d32f2f;
  
  /* 按钮 */
  --btn-primary-bg: #000000;
  --btn-primary-text: #ffffff;
  --btn-secondary-bg: #000000;
  --btn-secondary-text: #ffffff;
}

/* 深色模式样式 */
html[data-theme="dark"] .card,
:root[data-theme="dark"] .card {
  /* 卡片基础样式 */
  --card-bg-color: #1f1f1f;
  --card-border-color: #333333;
  --text-color: #e0e0e0;
  --secondary-text-color: #aaaaaa;
  --border-color: #333333;
  --spinner-color: #333333;
  --primary-color: #ffffff;
  
  /* 列表项样式 */
  --item-bg-color: #2a2a2a;
  --item-hover-bg-color: #333333;
  --item-border-color: #444444;
  
  /* 图标样式 */
  --icon-color: #aaaaaa;
  --icon-hover-color: #ffffff;
  --icon-bg-color: transparent;
  --icon-hover-bg-color: #444444;
  --view-icon-color: #aaaaaa;
  --delete-icon-color: #ff6b6b;
  
  /* 按钮 */
  --btn-primary-bg: #ffffff;
  --btn-primary-text: #000000;
  --btn-secondary-bg: #ffffff;
  --btn-secondary-text: #000000;
}

@media (max-width: 768px) {
  .item-actions {
    flex-direction: row;
    gap: 0.5rem;
  }
}
</style> 