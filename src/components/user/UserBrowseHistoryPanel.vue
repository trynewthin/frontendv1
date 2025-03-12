<template>
  <div class="browse-history-panel-container">
    <va-card class="user-browse-history-panel">
      <va-card-title class="panel-title">浏览历史</va-card-title>
      
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
          <va-button @click="fetchBrowseHistory">重试</va-button>
        </div>
        
        <div v-else-if="historyList.length === 0" class="empty-container">
          <va-icon name="visibility" />
          <p>暂无浏览历史</p>
        </div>
        
        <div v-else class="history-content">
          <ul class="history-list">
            <li v-for="item in historyList" :key="item.id" class="history-item">
              <div class="item-content">
                <div class="car-info">
                  <img 
                    :src="item.carThumbnail || '/images/cars/default-car.png'" 
                    :alt="item.carName"
                    class="car-thumbnail"
                  />
                  <div class="car-details">
                    <div class="car-name">{{ item.carName }}</div>
                    <div class="browse-time">{{ formatDate(item.browseTime) }}</div>
                    <div class="duration" v-if="item.duration">浏览时长: {{ formatDuration(item.duration) }}</div>
                  </div>
                </div>
              </div>
              <div class="item-actions">
                <va-button icon="delete" size="small" flat color="danger" 
                  @click="deleteBrowseRecord(item.carId)" :loading="deletingIds[item.carId]" />
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
          
          <div class="action-buttons">
            <va-button preset="secondary" @click="clearBrowseHistory" :loading="clearing" size="small">
              清空浏览历史
            </va-button>
          </div>
        </div>
      </va-card-content>
    </va-card>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import behaviorService from '../../api/behaviorService';

// 状态变量
const loading = ref(true);
const error = ref('');
const historyList = ref([]);
const currentPage = ref(1);
const pageSize = ref(10);
const totalRecords = ref(0);
const clearing = ref(false);
const deletingIds = ref({});

// 计算总页数
const totalPages = computed(() => {
  return Math.ceil(totalRecords.value / pageSize.value);
});

// 获取浏览历史
const fetchBrowseHistory = async () => {
  loading.value = true;
  error.value = '';
  
  try {
    const result = await behaviorService.getBrowseHistory({
      page: currentPage.value,
      size: pageSize.value
    });
    
    if (result.success) {
      historyList.value = result.data;
      totalRecords.value = result.total;
      currentPage.value = result.page;
    } else {
      error.value = result.message || '获取浏览历史失败';
    }
  } catch (err) {
    console.error('获取浏览历史出错:', err);
    error.value = '获取浏览历史时发生错误';
  } finally {
    loading.value = false;
  }
};

// 处理页码变化
const handlePageChange = (page) => {
  currentPage.value = page;
  fetchBrowseHistory();
};

// 删除单条浏览记录
const deleteBrowseRecord = async (carId) => {
  deletingIds.value[carId] = true;
  
  try {
    const result = await behaviorService.deleteBrowseRecord(carId);
    
    if (result.success) {
      // 从列表中移除已删除的记录
      historyList.value = historyList.value.filter(item => item.carId !== carId);
      
      // 如果当前页没有数据了，且不是第一页，则回到上一页
      if (historyList.value.length === 0 && currentPage.value > 1) {
        currentPage.value -= 1;
        fetchBrowseHistory();
      }
      
      // 更新总记录数
      totalRecords.value -= 1;
    } else {
      // 提示错误
      alert(result.message || '删除浏览记录失败');
    }
  } catch (err) {
    console.error('删除浏览记录出错:', err);
    alert('删除浏览记录时发生错误');
  } finally {
    deletingIds.value[carId] = false;
  }
};

// 清空浏览历史
const clearBrowseHistory = async () => {
  // 确认是否清空
  if (!confirm('确定要清空所有浏览历史吗？此操作不可恢复。')) {
    return;
  }
  
  clearing.value = true;
  
  try {
    const result = await behaviorService.clearBrowseHistory();
    
    if (result.success) {
      // 清空列表
      historyList.value = [];
      totalRecords.value = 0;
    } else {
      // 提示错误
      alert(result.message || '清空浏览历史失败');
    }
  } catch (err) {
    console.error('清空浏览历史出错:', err);
    alert('清空浏览历史时发生错误');
  } finally {
    clearing.value = false;
  }
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

// 格式化浏览时长
const formatDuration = (seconds) => {
  if (seconds < 60) {
    return `${seconds}秒`;
  } else if (seconds < 3600) {
    const minutes = Math.floor(seconds / 60);
    const remainSeconds = seconds % 60;
    return `${minutes}分${remainSeconds > 0 ? remainSeconds + '秒' : ''}`;
  } else {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return `${hours}小时${minutes > 0 ? minutes + '分' : ''}`;
  }
};

// 组件挂载时获取浏览历史
onMounted(() => {
  fetchBrowseHistory();
});
</script>

<style scoped>
.browse-history-panel-container {
  position: relative;
}

.user-browse-history-panel {
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

.empty-container {
  font-style: italic;
}

.history-content {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.history-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.history-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  background-color: var(--va-background-element);
  border-radius: 8px;
  transition: background-color 0.2s;
}

.history-item:hover {
  background-color: var(--va-background-primary);
}

.item-content {
  flex: 1;
  overflow: hidden;
}

.car-info {
  display: flex;
  gap: 12px;
  align-items: center;
}

.car-thumbnail {
  width: 64px;
  height: 48px;
  object-fit: cover;
  border-radius: 4px;
}

.car-details {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.car-name {
  font-weight: 500;
}

.browse-time,
.duration {
  font-size: 0.85rem;
  color: var(--va-gray-3);
}

.pagination-container {
  display: flex;
  justify-content: center;
  margin-top: 16px;
}

.action-buttons {
  display: flex;
  justify-content: flex-end;
  margin-top: 16px;
}
</style> 