<template>
  <div class="appointment-card">
    <div class="appointment-header">
      <h3 class="appointment-title">预约 #{{ appointment.id }}</h3>
      <va-badge :color="getStatusColor(appointment.status)" :text="getStatusText(appointment.status)" />
    </div>
    
    <div class="appointment-content">
      <div class="appointment-info">
        <div class="info-item">
          <span class="info-label">预约车辆:</span>
          <span class="info-value">{{ getCarName(appointment) }}</span>
        </div>
        <div class="info-item">
          <span class="info-label">经销商:</span>
          <span class="info-value">{{ getDealerName(appointment) }}</span>
        </div>
        <div class="info-item">
          <span class="info-label">预约类型:</span>
          <span class="info-value">{{ appointment.appointmentType || '未指定' }}</span>
        </div>
        <div class="info-item">
          <span class="info-label">预约时间:</span>
          <span class="info-value">{{ formatDateTime(appointment.appointmentTime) }}</span>
        </div>
        <div class="info-item">
          <span class="info-label">备注:</span>
          <span class="info-value">{{ appointment.remarks || '无' }}</span>
        </div>
      </div>
    </div>
    
    <div class="appointment-actions">
      <va-button 
        v-if="canCancel(appointment)" 
        @click="cancelAppointment"
        preset="danger"
        size="small"
      >
        取消预约
      </va-button>
      
      <va-button
        v-if="appointment.dealerId"
        @click="contactDealer"
        preset="secondary"
        size="small"
        icon="chat"
      >
        联系经销商
      </va-button>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useToast } from 'vuestic-ui';
import appointmentService from '@/api/appointmentService';

const router = useRouter();
const { init: toast } = useToast();

const props = defineProps({
  appointment: {
    type: Object,
    required: true
  }
});

// 取消预约
const cancelAppointment = async () => {
  if (!props.appointment.id) return;
  
  try {
    const response = await appointmentService.cancelAppointment(props.appointment.id);
    
    if (response && response.code === 200) {
      toast({
        message: '预约已成功取消',
        color: 'success'
      });
      // 触发父组件更新
      emit('update', {
        ...props.appointment,
        status: '已取消'
      });
    } else {
      toast({
        message: response?.message || '取消预约失败',
        color: 'danger'
      });
    }
  } catch (error) {
    toast({
      message: '取消预约失败，请稍后重试',
      color: 'danger'
    });
  }
};

// 联系经销商
const contactDealer = () => {
  if (!props.appointment.dealerId) return;
  router.push(`/chat/${props.appointment.dealerId}`);
};

const emit = defineEmits(['update']);

// 辅助函数
const getCarName = (appointment) => {
  if (appointment.carInfo) {
    return `${appointment.carInfo.brand} ${appointment.carInfo.model}`;
  }
  return `车辆ID: ${appointment.carId}`;
};

const getDealerName = (appointment) => {
  return appointment.dealerName || `经销商ID: ${appointment.dealerId}`;
};

const formatDateTime = (dateString) => {
  if (!dateString) return '未知时间';
  const date = new Date(dateString);
  return date.toLocaleString('zh-CN');
};

const getStatusColor = (status) => {
  const statusMap = {
    '待确认': 'warning',
    '已确认': 'info',
    '已完成': 'success',
    '已取消': 'danger'
  };
  return statusMap[status] || 'gray';
};

const getStatusText = (status) => {
  // 如果状态已经是中文，直接返回
  if (['待确认', '已确认', '已完成', '已取消'].includes(status)) {
    return status;
  }
  
  // 英文状态转中文
  const statusMap = {
    'pending': '待确认',
    'confirmed': '已确认',
    'completed': '已完成',
    'canceled': '已取消'
  };
  return statusMap[status] || status;
};

const canCancel = (appointment) => {
  return appointment.status === '待确认' || appointment.status === '已确认';
};
</script>

<style scoped>
.appointment-card {
  background-color: var(--va-background);
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  padding: 20px;
  transition: all 0.3s ease;
}

/* 深色模式下的卡片样式 */
:root[data-theme="dark"] .appointment-card {
  background-color: rgba(255, 255, 255, 0.05);
  box-shadow: 0 2px 8px rgba(255, 215, 0, 0.1);
}

.appointment-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
  padding-bottom: 12px;
  border-bottom: 1px solid var(--va-background-secondary);
}

.appointment-title {
  margin: 0;
  font-size: 18px;
  font-weight: 600;
  color: var(--va-text-color);
}

.appointment-content {
  margin-bottom: 16px;
}

.appointment-info {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 12px;
}

.info-item {
  display: flex;
  margin-bottom: 8px;
}

.info-label {
  width: 100px;
  color: var(--va-text-color-secondary);
  flex-shrink: 0;
}

.info-value {
  color: var(--va-text-color);
  font-weight: 500;
}

/* 深色模式下的文字颜色 */
:root[data-theme="dark"] .info-label {
  color: rgba(255, 255, 255, 0.6);
}

:root[data-theme="dark"] .info-value {
  color: #ffffff;
}

.appointment-actions {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}

@media (max-width: 768px) {
  .appointment-info {
    grid-template-columns: 1fr;
  }
  
  .info-item {
    flex-direction: column;
  }
  
  .info-label {
    width: auto;
    margin-bottom: 4px;
  }
}
</style> 