<template>
  <div class="user-panel-container">
    <div class="card user-browse-history-panel">
      <div class="card-content">
        <!-- 标题 -->
        <div class="card-title">浏览历史</div>
        
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
            <li v-for="item in historyList" :key="item.id" class="history-item">
              <div class="item-content">
                <div class="car-info">
                  <div class="car-details">
                    <div class="car-name">{{ item.carName }}</div>
                    <div class="browse-time">{{ formatDate(item.browseTime) }}</div>
                    <div class="duration" v-if="item.duration">浏览时长: {{ formatDuration(item.duration) }}</div>
                  </div>
                </div>
              </div>
              <div class="item-actions">
                <button class="btn btn-icon" @click="deleteBrowseRecord(item.carId)" :disabled="deletingIds[item.carId]">
                  <span v-if="deletingIds[item.carId]" class="loading-dot"></span>
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
          
          <div class="action-buttons">
            <button class="btn btn-secondary" @click="clearBrowseHistory" :disabled="clearing">
              <span v-if="clearing" class="loading-dot"></span>
              <span v-else>清空浏览历史</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import behaviorService from '@/api/behaviorService';

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

.history-content {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.history-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.history-item {
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

.history-item:hover {
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
}

.browse-time,
.duration {
  font-size: 0.85rem;
  color: var(--secondary-text-color, #777);
  text-align: left;
}

.item-actions {
  display: flex;
  align-items: flex-start;
  margin-left: 0.75rem;
  padding-top: 0.25rem;
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

.action-buttons {
  display: flex;
  justify-content: flex-end;
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
  
  /* 列表项样式 */
  --item-bg-color: #f9f9f9;
  --item-hover-bg-color: #f0f0f0;
  --item-border-color: #eeeeee;
  
  /* 图标样式 */
  --icon-color: #777777;
  --icon-hover-color: #333333;
  --icon-bg-color: transparent;
  --icon-hover-bg-color: #eeeeee;
  
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
  
  /* 列表项样式 */
  --item-bg-color: #2a2a2a;
  --item-hover-bg-color: #333333;
  --item-border-color: #444444;
  
  /* 图标样式 */
  --icon-color: #aaaaaa;
  --icon-hover-color: #ffffff;
  --icon-bg-color: transparent;
  --icon-hover-bg-color: #444444;
  
  /* 按钮 */
  --btn-primary-bg: #ffffff;
  --btn-primary-text: #000000;
  --btn-secondary-bg: #ffffff;
  --btn-secondary-text: #000000;
}
</style> 