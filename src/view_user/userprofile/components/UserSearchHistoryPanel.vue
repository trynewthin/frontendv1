<template>
  <div class="search-history-panel-container">
    <va-card class="user-search-history-panel">
      <va-card-title class="panel-title">搜索历史</va-card-title>
      
      <va-card-content class="panel-content">
        <div v-if="loading" class="loading-container">
          <va-progress-circle indeterminate color="primary" />
          <p>加载中...</p>
        </div>
        
        <div v-else-if="error" class="error-container">
          <va-icon name="warning" color="danger" />
          <p>{{ error }}</p>
          <va-button @click="fetchSearchHistory">重试</va-button>
        </div>
        
        <div v-else-if="historyList.length === 0" class="empty-container">
          <va-icon name="search" />
          <p>暂无搜索历史</p>
        </div>
        
        <div v-else class="history-content">
          <ul class="history-list">
            <li v-for="item in historyList" :key="item.id" class="history-item">
              <div class="item-content">
                <div class="keyword">
                  <va-icon name="search" />
                  <span>{{ item.keyword }}</span>
                </div>
                <div class="search-time">{{ formatDate(item.createTime) }}</div>
              </div>
              <div class="item-actions">
                <va-button icon="delete" size="small" flat color="danger" 
                  @click="deleteSearchRecord(item.id)" :loading="deletingIds[item.id]" />
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
            <va-button preset="secondary" @click="clearSearchHistory" :loading="clearing" size="small">
              清空搜索历史
            </va-button>
          </div>
        </div>
      </va-card-content>
    </va-card>
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

// 获取搜索历史
const fetchSearchHistory = async () => {
  loading.value = true;
  error.value = '';
  
  try {
    const result = await behaviorService.getSearchHistory({
      page: currentPage.value,
      size: pageSize.value
    });
    
    console.log('搜索历史组件获取的数据:', result);
    
    if (result.success) {
      historyList.value = result.data;
      totalRecords.value = result.total;
      currentPage.value = result.page;
    } else {
      error.value = result.message || '获取搜索历史失败';
    }
  } catch (err) {
    console.error('获取搜索历史出错:', err);
    error.value = '获取搜索历史时发生错误';
    loading.value = false;
  } finally {
    loading.value = false;
  }
};

// 处理页码变化
const handlePageChange = (page) => {
  currentPage.value = page;
  fetchSearchHistory();
};

// 删除单条搜索记录
const deleteSearchRecord = async (searchId) => {
  deletingIds.value[searchId] = true;
  
  try {
    const result = await behaviorService.deleteSearchRecord(searchId);
    
    if (result.success) {
      // 从列表中移除已删除的记录
      historyList.value = historyList.value.filter(item => item.id !== searchId);
      
      // 如果当前页没有数据了，且不是第一页，则回到上一页
      if (historyList.value.length === 0 && currentPage.value > 1) {
        currentPage.value -= 1;
        fetchSearchHistory();
      }
      
      // 更新总记录数
      totalRecords.value -= 1;
    } else {
      // 提示错误
      alert(result.message || '删除搜索记录失败');
    }
  } catch (err) {
    console.error('删除搜索记录出错:', err);
    alert('删除搜索记录时发生错误');
  } finally {
    deletingIds.value[searchId] = false;
  }
};

// 清空搜索历史
const clearSearchHistory = async () => {
  // 确认是否清空
  if (!confirm('确定要清空所有搜索历史吗？此操作不可恢复。')) {
    return;
  }
  
  clearing.value = true;
  
  try {
    const result = await behaviorService.clearSearchHistory();
    
    if (result.success) {
      // 清空列表
      historyList.value = [];
      totalRecords.value = 0;
    } else {
      // 提示错误
      alert(result.message || '清空搜索历史失败');
    }
  } catch (err) {
    console.error('清空搜索历史出错:', err);
    alert('清空搜索历史时发生错误');
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

// 组件挂载时获取搜索历史
onMounted(() => {
  fetchSearchHistory();
});
</script>

<style scoped>
.search-history-panel-container {
  position: relative;
}

.user-search-history-panel {
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
  gap: 8px;
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
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.keyword {
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 500;
}

.search-time {
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