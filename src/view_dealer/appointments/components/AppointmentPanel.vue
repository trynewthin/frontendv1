<template>
  <BasePanel title="预约处理">
    <div class="appointment-panel-content">
      <!-- 顶部状态过滤器 -->
      <div class="filter-container">
        <div class="status-filter">
          <span class="filter-label">预约状态:</span>
          <div class="status-buttons">
            <button 
              class="status-btn" 
              :class="{ active: selectedStatus === '' }"
              @click="setStatusFilter('')">全部</button>
            <button 
              class="status-btn" 
              :class="{ active: selectedStatus === '待确认' }"
              @click="setStatusFilter('待确认')">待确认</button>
            <button 
              class="status-btn" 
              :class="{ active: selectedStatus === '已确认' }"
              @click="setStatusFilter('已确认')">已确认</button>
            <button 
              class="status-btn" 
              :class="{ active: selectedStatus === '已完成' }"
              @click="setStatusFilter('已完成')">已完成</button>
            <button 
              class="status-btn" 
              :class="{ active: selectedStatus === '已取消' }"
              @click="setStatusFilter('已取消')">已取消</button>
          </div>
        </div>
      </div>
      
      <!-- 消息提示区 -->
      <div v-if="message" :class="['message-container', messageType]">
        <span class="message-text">{{ message }}</span>
        <button class="close-btn" @click="clearMessage">×</button>
      </div>
      
      <!-- 预约数据展示区域 -->
      <div class="appointments-container">
        <!-- 加载状态显示 -->
        <div v-if="loading" class="loading-container">
          <div class="loading-spinner"></div>
          <p>加载预约数据中...</p>
        </div>
        
        <!-- 数据为空时显示 -->
        <div v-else-if="!appointmentList || appointmentList.length === 0" class="empty-state">
          <p class="empty-message">{{ errorMessage || '暂无预约数据' }}</p>
          <button class="refresh-btn" @click="loadAppointments">刷新</button>
        </div>
        
        <!-- 数据列表 -->
        <div v-else class="appointment-list">
          <AppointmentItem 
            v-for="item in appointmentList" 
            :key="item.id"
            :appointment="item"
            :processing="processingId === item.id"
            @update-status="updateStatus"
          />
        </div>
        
        <!-- 分页控件 -->
        <div v-if="totalItems > 0" class="pagination">
          <button 
            class="page-btn" 
            :disabled="currentPage <= 1"
            @click="changePage(currentPage - 1)">上一页</button>
          <span class="page-info">{{ currentPage }} / {{ totalPages }}</span>
          <button 
            class="page-btn" 
            :disabled="currentPage >= totalPages"
            @click="changePage(currentPage + 1)">下一页</button>
        </div>
        
        <p class="dealer-id">经销商ID: {{ currentUserId || '未获取' }}</p>
      </div>
    </div>
    
    <template #footer>
      <button class="btn btn-primary" @click="loadAppointments">刷新数据</button>
    </template>
  </BasePanel>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import BasePanel from '@/components/card/BasePanel.vue';
import appointmentAxiosService from '@/services/appointment/appointmentAxiosService';
import AppointmentItem from './AppointmentItem.vue';

// 接收从父组件传递的用户ID
const props = defineProps({
  currentUserId: {
    type: [Number, String],
    default: null
  }
});

// 定义响应式状态
const loading = ref(false);
const appointmentList = ref([]);
const errorMessage = ref('');
const selectedStatus = ref('');
const currentPage = ref(1);
const pageSize = ref(10);
const totalItems = ref(0);
const message = ref('');
const messageType = ref('');
const processingId = ref(null); // 正在处理中的预约ID

// 计算属性
const totalPages = computed(() => {
  return Math.ceil(totalItems.value / pageSize.value);
});

// 设置状态过滤器
const setStatusFilter = (status) => {
  selectedStatus.value = status;
  currentPage.value = 1; // 重置到第一页
  loadAppointments();
};

// 切换页面
const changePage = (page) => {
  if (page < 1 || page > totalPages.value) return;
  currentPage.value = page;
  loadAppointments();
};

// 加载预约数据
const loadAppointments = async () => {
  try {
    loading.value = true;
    errorMessage.value = '';
    
    const queryParams = {
      status: selectedStatus.value,
      page: currentPage.value,
      size: pageSize.value
    };
    
    const response = await appointmentAxiosService.getDealerAppointments(queryParams);
    
    if (response.success) {
      appointmentList.value = response.data.list || [];
      totalItems.value = response.data.total || 0;
    } else {
      errorMessage.value = response.message || '获取预约列表失败';
      appointmentList.value = [];
    }
  } catch (error) {
    console.error('加载预约数据错误:', error);
    errorMessage.value = '获取预约列表出错';
    appointmentList.value = [];
  } finally {
    loading.value = false;
  }
};

// 更新预约状态
const updateStatus = async (appointmentId, newStatus) => {
  try {
    processingId.value = appointmentId;
    
    const response = await appointmentAxiosService.updateAppointmentStatus(appointmentId, newStatus);
    
    if (response.success) {
      displayMessage('success', `预约状态已更新为"${newStatus}"`);
      // 更新本地数据
      const index = appointmentList.value.findIndex(item => item.id === appointmentId);
      if (index !== -1) {
        appointmentList.value[index].status = newStatus;
      }
    } else {
      displayMessage('error', response.message || '更新预约状态失败');
    }
  } catch (error) {
    console.error('更新预约状态错误:', error);
    displayMessage('error', '更新预约状态出错');
  } finally {
    processingId.value = null;
  }
};

// 显示消息
const displayMessage = (type, text) => {
  message.value = text;
  messageType.value = type;
  
  // 5秒后自动清除消息
  setTimeout(() => {
    clearMessage();
  }, 5000);
};

// 清除消息
const clearMessage = () => {
  message.value = '';
  messageType.value = '';
};

// 组件挂载时加载数据
onMounted(() => {
  loadAppointments();
});
</script>

<style scoped>
.appointment-panel-content {
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;
  padding: 0.5rem;
  gap: 1rem;
}

/* 消息提示区样式 */
.message-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem 1rem;
  border-radius: 4px;
  margin-bottom: 0.5rem;
}

.message-container.success {
  background-color: rgba(40, 167, 69, 0.1);
  border: 1px solid rgba(40, 167, 69, 0.3);
  color: #28a745;
}

.message-container.error {
  background-color: rgba(220, 53, 69, 0.1);
  border: 1px solid rgba(220, 53, 69, 0.3);
  color: #dc3545;
}

.message-text {
  flex: 1;
}

.close-btn {
  background: none;
  border: none;
  font-size: 1.2rem;
  cursor: pointer;
  padding: 0;
  margin-left: 0.5rem;
  opacity: 0.7;
}

.close-btn:hover {
  opacity: 1;
}

/* 过滤器样式 */
.filter-container {
  padding: 0.5rem;
  border-bottom: 1px solid var(--border-color, #eaeaea);
}

.status-filter {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.5rem;
}

.filter-label {
  font-size: 0.9rem;
  color: var(--secondary-text-color, #666);
  white-space: nowrap;
}

.status-buttons {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.status-btn {
  padding: 0.25rem 0.75rem;
  border-radius: 4px;
  border: 1px solid var(--border-color, #eaeaea);
  background-color: transparent;
  font-size: 0.85rem;
  cursor: pointer;
  transition: all 0.2s ease;
}

.status-btn:hover {
  background-color: rgba(0, 0, 0, 0.05);
}

.status-btn.active {
  background-color: var(--primary-color, #000000);
  color: #ffffff;
  border-color: var(--primary-color, #000000);
}

/* 预约容器 */
.appointments-container {
  flex: 1;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  position: relative;
  min-height: 200px;
}

/* 加载状态 */
.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  min-height: 200px;
  gap: 1rem;
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 4px solid var(--spinner-color, #f3f3f3);
  border-top: 4px solid var(--primary-color, #000000);
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

/* 空状态 */
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  min-height: 200px;
  gap: 1rem;
}

.empty-message {
  color: var(--secondary-text-color, #666);
  text-align: center;
}

.refresh-btn {
  padding: 0.5rem 1rem;
  background-color: transparent;
  border: 1px solid var(--border-color, #eaeaea);
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.9rem;
}

.refresh-btn:hover {
  background-color: rgba(0, 0, 0, 0.05);
}

/* 预约列表 */
.appointment-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding-bottom: 1rem;
}

/* 分页控件 */
.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 1rem 0;
  gap: 1rem;
}

.page-btn {
  padding: 0.4rem 0.8rem;
  border: 1px solid var(--border-color, #eaeaea);
  background-color: transparent;
  border-radius: 4px;
  font-size: 0.85rem;
  cursor: pointer;
  transition: all 0.2s ease;
}

.page-btn:hover:not(:disabled) {
  background-color: rgba(0, 0, 0, 0.05);
}

.page-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.page-info {
  font-size: 0.9rem;
  color: var(--secondary-text-color, #666);
}

.dealer-id {
  font-size: 0.8rem;
  color: var(--secondary-text-color, #666);
  opacity: 0.6;
  text-align: center;
  margin-top: auto;
}

/* 深色模式适配 */
:root[data-theme="dark"] .status-btn:hover {
  background-color: rgba(255, 255, 255, 0.1);
}

:root[data-theme="dark"] .refresh-btn:hover {
  background-color: rgba(255, 255, 255, 0.1);
}

:root[data-theme="dark"] .page-btn:hover:not(:disabled) {
  background-color: rgba(255, 255, 255, 0.1);
}

:root[data-theme="dark"] .message-container.success {
  background-color: rgba(40, 167, 69, 0.15);
  border-color: rgba(40, 167, 69, 0.3);
}

:root[data-theme="dark"] .message-container.error {
  background-color: rgba(220, 53, 69, 0.15);
  border-color: rgba(220, 53, 69, 0.3);
}

/* 响应式布局 */
@media (max-width: 768px) {
  .status-filter {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .pagination {
    flex-wrap: wrap;
  }
}
</style> 