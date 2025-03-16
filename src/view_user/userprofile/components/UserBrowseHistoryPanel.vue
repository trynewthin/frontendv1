<template>
  <div class="user-browse-history-container">
    <base-panel title="浏览历史" class="browse-history-panel">
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
        <button class="btn btn-primary" @click="fetchBrowseHistory">重试</button>
      </div>
      
      <div v-else-if="historyList.length === 0" class="empty-container">
        <span class="empty-icon">👁️</span>
        <p>暂无浏览历史</p>
      </div>
      
      <div v-else class="history-content">
        <ul class="history-list">
          <card-list-item 
            v-for="item in historyList" 
            :key="item.id"
            iconSrc="/icons/view.svg"
            iconAlt="浏览"
          >
            <!-- 内容区域 -->
            <div class="car-details">
              <div class="car-name">{{ item.carName }}</div>
              <div class="browse-time">{{ formatDate(item.browseTime) }}</div>
              <div class="duration" v-if="item.duration">浏览时长: {{ formatDuration(item.duration) }}</div>
            </div>
            
            <!-- 按钮区域 -->
            <template #actions>
              <button 
                class="btn btn-primary delete-btn" 
                @click="deleteBrowseRecord(item.carId)" 
                :disabled="deletingIds[item.carId]"
                title="删除记录"
              >
                <span v-if="deletingIds[item.carId]" class="loading-dot"></span>
                <span v-else>删除</span>
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
      
      <!-- 底部按钮 -->
      <template #footer>
        <button class="btn btn-primary" @click="clearBrowseHistory" :disabled="clearing">
          <span v-if="clearing" class="loading-dot"></span>
          <span v-else>清空浏览历史</span>
        </button>
      </template>
    </base-panel>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import behaviorService from '@/api/behaviorService';
import BasePanel from '@/components/card/BasePanel.vue';
import CardListItem from '@/components/card/CardListItem.vue';

// 状态变量
const loading = ref(true);
const error = ref('');
const historyList = ref([]);
const currentPage = ref(1);
const pageSize = ref(10);
const totalRecords = ref(0);
const clearing = ref(false);
const deletingIds = ref({});
const debugInfo = ref(null);

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
.user-browse-history-container {
  position: relative;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
  width: 100%;
  height: 100%;
}

.browse-history-panel {
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

.history-content {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  height: 100%;
  overflow-y: auto;
}

.history-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

/* 浏览历史内容样式 */
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
}

.browse-time,
.duration {
  font-size: 0.85rem;
  color: var(--secondary-text-color, #777);
  text-align: left;
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

/* 深色模式适配 */
:root[data-theme="dark"] .history-item {
  background-color: var(--item-bg-color, #2a2a2a);
  border-color: var(--item-border-color, #444444);
}

:root[data-theme="dark"] .history-item:hover {
  background-color: var(--item-hover-bg-color, #333333);
}

:root[data-theme="dark"] .btn-icon {
  color: var(--icon-color, #aaaaaa);
}

:root[data-theme="dark"] .btn-icon:hover {
  background-color: var(--icon-hover-bg-color, #444444);
  color: var(--icon-hover-color, #ffffff);
}
</style> 