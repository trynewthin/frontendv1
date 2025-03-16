<template>
  <div class="appointment-item">
    <!-- 左侧：预约类型和状态 -->
    <div class="appointment-left">
      <div class="appointment-type-icon">
        <i :class="getTypeIconClass(appointment.appointmentType)"></i>
      </div>
      <div class="appointment-type-label">{{ appointment.appointmentType }}</div>
      <div class="appointment-status" :class="getStatusClass(appointment.status)">
        {{ appointment.status }}
      </div>
    </div>
    
    <!-- 中间：预约详细信息 -->
    <div class="appointment-center">
      <div class="appointment-info">
        <div class="info-row">
          <span class="info-label">预约ID:</span>
          <span class="info-value">{{ appointment.id }}</span>
        </div>
        <div class="info-row">
          <span class="info-label">客户ID:</span>
          <span class="info-value">{{ appointment.userId }}</span>
        </div>
        <div class="info-row">
          <span class="info-label">预约时间:</span>
          <span class="info-value">{{ formatDate(appointment.appointmentTime) }}</span>
        </div>
        <div class="info-row">
          <span class="info-label">创建时间:</span>
          <span class="info-value">{{ formatDate(appointment.createTime) }}</span>
        </div>
        <div class="info-row remarks">
          <span class="info-label">备注:</span>
          <span class="info-value">{{ appointment.remarks || '无' }}</span>
        </div>
      </div>
    </div>
    
    <!-- 右侧：操作按钮 -->
    <div class="appointment-right">
      <template v-if="appointment.status === '待确认'">
        <button 
          class="action-btn confirm-btn" 
          @click="updateStatus('已确认')"
          :disabled="processing">
          确认预约
        </button>
        <button 
          class="action-btn cancel-btn" 
          @click="updateStatus('已取消')"
          :disabled="processing">
          取消预约
        </button>
      </template>
      <template v-else-if="appointment.status === '已确认'">
        <button 
          class="action-btn complete-btn" 
          @click="updateStatus('已完成')"
          :disabled="processing">
          完成预约
        </button>
        <button 
          class="action-btn cancel-btn" 
          @click="updateStatus('已取消')"
          :disabled="processing">
          取消预约
        </button>
      </template>
      <div v-else-if="appointment.status === '已完成' || appointment.status === '已取消'" class="status-info">
        <span>{{ appointment.status === '已完成' ? '此预约已完成' : '此预约已取消' }}</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue';

// 定义组件属性
const props = defineProps({
  appointment: {
    type: Object,
    required: true
  },
  processing: {
    type: Boolean,
    default: false
  }
});

// 定义组件事件
const emit = defineEmits(['update-status']);

// 更新预约状态
const updateStatus = (newStatus) => {
  emit('update-status', props.appointment.id, newStatus);
};

// 获取预约类型图标类
const getTypeIconClass = (type) => {
  switch (type) {
    case '看车': return 'icon-car';
    case '试驾': return 'icon-drive';
    default: return 'icon-default';
  }
};

// 获取状态样式类
const getStatusClass = (status) => {
  switch (status) {
    case '待确认': return 'status-pending';
    case '已确认': return 'status-confirmed';
    case '已完成': return 'status-completed';
    case '已取消': return 'status-cancelled';
    default: return '';
  }
};

// 格式化日期
const formatDate = (dateString) => {
  if (!dateString) return '-';
  
  try {
    const date = new Date(dateString);
    return date.toLocaleString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  } catch (e) {
    return dateString;
  }
};
</script>

<style scoped>
.appointment-item {
  display: flex;
  border: 1px solid var(--border-color, #eaeaea);
  border-radius: 6px;
  overflow: hidden;
  background-color: var(--card-bg-color, #ffffff);
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  transition: all 0.2s ease;
}

.appointment-item:hover {
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
}

/* 左侧样式 */
.appointment-left {
  flex: 0 0 120px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 1rem;
  background-color: rgba(0, 0, 0, 0.02);
  border-right: 1px solid var(--border-color, #eaeaea);
  gap: 0.5rem;
}

.appointment-type-icon {
  font-size: 1.8rem;
  color: var(--primary-color, #000000);
  margin-bottom: 0.5rem;
}

.appointment-type-label {
  font-weight: 600;
  font-size: 1rem;
  text-align: center;
}

.appointment-status {
  font-size: 0.8rem;
  padding: 0.2rem 0.6rem;
  border-radius: 99px;
  font-weight: 500;
  text-align: center;
  margin-top: 0.5rem;
  min-width: 80px;
}

/* 预约状态颜色 */
.status-pending {
  background-color: #ffaa00;
  color: #ffffff;
}

.status-confirmed {
  background-color: #007bff;
  color: #ffffff;
}

.status-completed {
  background-color: #28a745;
  color: #ffffff;
}

.status-cancelled {
  background-color: #dc3545;
  color: #ffffff;
}

/* 中间样式 */
.appointment-center {
  flex: 1;
  padding: 1rem;
  overflow: hidden;
}

.appointment-info {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.info-row {
  display: flex;
  font-size: 0.9rem;
  line-height: 1.5;
}

.info-label {
  flex: 0 0 90px;
  color: var(--secondary-text-color, #666);
  font-weight: 500;
}

.info-value {
  flex: 1;
  color: var(--text-color, #333);
}

.remarks {
  margin-top: 0.25rem;
  align-items: flex-start;
}

/* 右侧样式 */
.appointment-right {
  flex: 0 0 150px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 1rem;
  background-color: rgba(0, 0, 0, 0.01);
  border-left: 1px solid var(--border-color, #eaeaea);
  gap: 0.75rem;
}

.action-btn {
  width: 100%;
  padding: 0.5rem 0.75rem;
  border-radius: 4px;
  font-size: 0.85rem;
  cursor: pointer;
  transition: all 0.2s ease;
  border: none;
  text-align: center;
}

.action-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.confirm-btn {
  background-color: #007bff;
  color: white;
}

.confirm-btn:hover:not(:disabled) {
  background-color: #0069d9;
}

.complete-btn {
  background-color: #28a745;
  color: white;
}

.complete-btn:hover:not(:disabled) {
  background-color: #218838;
}

.cancel-btn {
  background-color: #dc3545;
  color: white;
}

.cancel-btn:hover:not(:disabled) {
  background-color: #c82333;
}

.status-info {
  width: 100%;
  text-align: center;
  padding: 0.75rem 0.5rem;
  background-color: rgba(0, 0, 0, 0.03);
  border-radius: 4px;
  font-size: 0.9rem;
  color: var(--secondary-text-color, #666);
}

/* 深色模式适配 */
:root[data-theme="dark"] .appointment-left,
:root[data-theme="dark"] .appointment-right {
  background-color: rgba(255, 255, 255, 0.03);
}

:root[data-theme="dark"] .status-info {
  background-color: rgba(255, 255, 255, 0.05);
}

/* 图标样式 */
.icon-car::before {
  content: "🚗";
}

.icon-drive::before {
  content: "🚘";
}

.icon-default::before {
  content: "📅";
}

/* 响应式布局 */
@media (max-width: 768px) {
  .appointment-item {
    flex-direction: column;
  }
  
  .appointment-left {
    flex: none;
    width: 100%;
    flex-direction: row;
    padding: 0.75rem;
    border-right: none;
    border-bottom: 1px solid var(--border-color, #eaeaea);
    justify-content: space-between;
  }
  
  .appointment-type-icon {
    margin-bottom: 0;
    margin-right: 0.5rem;
  }
  
  .appointment-status {
    margin-top: 0;
    margin-left: auto;
  }
  
  .appointment-center {
    padding: 0.75rem;
  }
  
  .info-row {
    flex-direction: column;
  }
  
  .info-label {
    flex: none;
    margin-bottom: 0.25rem;
  }
  
  .appointment-right {
    flex: none;
    width: 100%;
    flex-direction: row;
    padding: 0.75rem;
    border-left: none;
    border-top: 1px solid var(--border-color, #eaeaea);
  }
  
  .action-btn {
    flex: 1;
  }
}
</style> 