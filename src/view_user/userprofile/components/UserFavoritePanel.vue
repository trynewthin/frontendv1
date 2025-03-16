<template>
  <div class="user-favorite-container">
    <base-panel title="我的收藏" class="favorite-panel">
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
          <card-list-item 
            v-for="item in favoriteList" 
            :key="item.carId"
            iconSrc="/icons/favorite.svg"
            iconAlt="收藏"
          >
            <!-- 内容区域 -->
            <div class="car-details">
              <div class="car-name">{{ item.carName || `${item.brand} ${item.model}` }}</div>
              <div class="car-price">￥{{ formatPrice(item.carPrice) }}</div>
              <div class="favorite-time">收藏于 {{ formatDate(item.favoriteTime) }}</div>
            </div>
            
            <!-- 按钮区域 -->
            <template #actions>
              <button 
                class="btn btn-primary" 
                @click="viewCar(item.carId)"
                title="查看车辆"
              >
                查看
              </button>
              <button 
                class="btn btn-primary delete-btn"
                @click="removeFavorite(item.carId)" 
                :disabled="removingIds[item.carId]"
                title="取消收藏"
              >
                <span v-if="removingIds[item.carId]" class="loading-dot"></span>
                <span v-else>取消</span>
              </button>
            </template>
          </card-list-item>
        </ul>
        
        <div class="pagination-container" v-if="totalRecords > pageSize">
          <va-pagination
            v-model="currentPage"
            :pages="totalPages"
            @click="handlePageChange"
          />
        </div>
      </div>
    </base-panel>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import favoriteService from '@/api/favoriteService';
import BasePanel from '@/components/card/BasePanel.vue';
import CardListItem from '@/components/card/CardListItem.vue';

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
  router.push(`/car/${carId}`);
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
.user-favorite-container {
  position: relative;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
  width: 100%;
  height: 100%;
}

.favorite-panel {
  width: 100%;
  height: 100%;
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
  height: 100%;
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
  height: 100%;
  overflow-y: auto;
}

.favorite-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

/* 收藏项目内容样式 */
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

.btn-primary:hover {
  opacity: 0.9;
}

.pagination-container {
  display: flex;
  justify-content: center;
  margin-top: 1rem;
}

/* 深色模式适配 */
:root[data-theme="dark"] .car-price {
  color: var(--primary-color, #ffffff);
}
</style> 