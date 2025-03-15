<template>
  <div class="favorite-panel-container">
    <va-card class="user-favorite-panel">
      <va-card-title class="panel-title">我的收藏</va-card-title>
      
      <va-card-content class="panel-content">
        <!-- 调试信息 -->
        <div v-if="debugInfo" class="debug-info">
          <pre>{{ debugInfo }}</pre>
        </div>
        
        <div v-if="loading" class="loading-container">
          <va-progress-circle indeterminate color="primary" />
          <p>加载中...</p>
        </div>
        
        <div v-else-if="error" class="error-container">
          <va-icon name="warning" color="danger" />
          <p>{{ error }}</p>
          <va-button @click="fetchFavorites">重试</va-button>
        </div>
        
        <div v-else-if="favoriteList.length === 0" class="empty-container">
          <va-icon name="favorite_border" />
          <p>暂无收藏的车辆</p>
          <va-button preset="primary" size="small" @click="goToCarList">
            去挑选车辆
          </va-button>
        </div>
        
        <div v-else class="favorite-content">
          <ul class="favorite-list">
            <li v-for="item in favoriteList" :key="item.carId" class="favorite-item">
              <div class="item-content">
                <img 
                  :src="item.carImage || '/images/cars/default-car.png'" 
                  :alt="item.carName"
                  class="car-image"
                />
                <div class="car-info">
                  <div class="car-name">{{ item.carName || `${item.brand} ${item.model}` }}</div>
                  <div class="car-price">￥{{ formatPrice(item.carPrice) }}</div>
                  <div class="favorite-time">收藏于 {{ formatDate(item.favoriteTime) }}</div>
                </div>
              </div>
              <div class="item-actions">
                <va-button 
                  icon="visibility" 
                  size="small" 
                  class="action-btn" 
                  @click="viewCar(item.carId)"
                  title="查看车辆"
                ></va-button>
                <va-button 
                  icon="delete" 
                  size="small" 
                  color="danger" 
                  class="action-btn"
                  @click="removeFavorite(item.carId)" 
                  :loading="removingIds[item.carId]"
                  title="取消收藏"
                ></va-button>
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
      </va-card-content>
    </va-card>
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
.favorite-panel-container {
  position: relative;
}

.user-favorite-panel {
  width: auto;
  height: auto;
  max-width: 500px; /* 限制最大宽度 */
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  margin: 0;
}

.panel-title {
  font-size: 1.25rem;
  font-weight: 600;
  padding: 16px 24px;
  border-bottom: 1px solid var(--va-gray-2);
}

.panel-content {
  padding: 24px;
}

.loading-container, 
.error-container,
.empty-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  gap: 1rem;
  color: var(--va-gray-3);
}

.favorite-content {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.favorite-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.favorite-item {
  display: flex;
  justify-content: space-between;
  padding: 12px;
  background-color: var(--va-background-element);
  border-radius: 8px;
  transition: background-color 0.2s;
}

.favorite-item:hover {
  background-color: var(--va-background-primary);
}

.item-content {
  display: flex;
  gap: 16px;
  flex: 1;
}

.car-image {
  width: 120px;
  height: 80px;
  object-fit: cover;
  border-radius: 4px;
}

.car-info {
  display: flex;
  flex-direction: column;
  gap: 4px;
  justify-content: center;
  flex: 1;
}

.car-name {
  font-weight: 500;
  font-size: 1.1rem;
}

.car-price {
  color: var(--va-primary);
  font-weight: 600;
}

.favorite-time {
  font-size: 0.85rem;
  color: var(--va-gray-3);
  margin-top: 4px;
}

.item-actions {
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 8px;
}

.action-btn {
  margin: 0;
}

.pagination-container {
  display: flex;
  justify-content: center;
  margin-top: 16px;
}

@media (max-width: 768px) {
  .car-image {
    width: 80px;
    height: 60px;
  }
  
  .item-actions {
    flex-direction: row;
  }
}
</style> 