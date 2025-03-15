<template>
  <div class="appointment-card">
    <div class="appointment-header">
      <h3 class="appointment-title">预约 #{{ appointment.id }}</h3>
      <div class="status-badge" :class="getStatusClass(appointment.status)">
        {{ getStatusText(appointment.status) }}
      </div>
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
      <button 
        v-if="canCancel(appointment)" 
        @click="showCancelConfirm = true"
        class="custom-button danger-button"
      >
        取消预约
      </button>
      
      <ContactSellerButton 
        v-if="appointment.dealerId"
        :dealer-id="appointment.dealerId"
        size="small"
      />
    </div>
    
    <!-- 取消预约确认对话框 -->
    <ModalDialog
      v-model="showCancelConfirm"
      title="取消预约"
      message="确定要取消此预约吗？取消后无法恢复。"
      confirm-text="确认取消"
      cancel-text="再想想"
      :loading="cancelLoading"
      @confirm="cancelAppointment"
    />
    
    <!-- 取消成功对话框 -->
    <ModalDialog
      v-model="showCancelSuccess"
      title="操作成功"
      message="预约已成功取消"
      confirm-text="确定"
      :cancel-text="null"
    />
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue';
import { useRouter } from 'vue-router';
import { useToast } from 'vuestic-ui';
import appointmentService from '@/api/appointmentService';
import dealerUserService from '@/services/user/dealerUserService';
import ContactSellerButton from '@/components/button/ContactSellerButton.vue';
import ModalDialog from '@/components/modelwindow/ModalDialog.vue';

const router = useRouter();
const { init: toast } = useToast();

const props = defineProps({
  appointment: {
    type: Object,
    required: true
  }
});

// 用于存储经销商详细信息
const dealerInfo = ref({
  contactPerson: null,
  contactPhone: null,
  loading: false
});

// 取消预约相关状态
const showCancelConfirm = ref(false);
const showCancelSuccess = ref(false);
const cancelLoading = ref(false);

// 获取经销商信息
const fetchDealerInfo = async () => {
  if (!props.appointment.dealerId) return;
  
  dealerInfo.value.loading = true;
  try {
    const response = await dealerUserService.getDealerContactPerson(props.appointment.dealerId);
    if (response.success) {
      dealerInfo.value.contactPerson = response.contactPerson;
      dealerInfo.value.contactPhone = response.contactPhone;
    }
  } catch (error) {
    console.error('获取经销商信息失败:', error);
  } finally {
    dealerInfo.value.loading = false;
  }
};

// 监听预约信息变化，重新获取经销商信息
watch(() => props.appointment.dealerId, (newDealerId, oldDealerId) => {
  if (newDealerId && newDealerId !== oldDealerId) {
    fetchDealerInfo();
  }
});

// 组件挂载时获取经销商信息
onMounted(() => {
  fetchDealerInfo();
});

// 取消预约
const cancelAppointment = async () => {
  if (!props.appointment.id) return;
  
  cancelLoading.value = true;
  
  try {
    // 立即关闭确认对话框
    showCancelConfirm.value = false;
    
    // 先触发一次刷新操作，确保立即响应用户操作
    emit('refresh');
    
    const response = await appointmentService.cancelAppointment(props.appointment.id);
    
    if (response && response.code === 200) {
      // 显示成功对话框
      showCancelSuccess.value = true;
      
      // 触发父组件更新
      emit('update', {
        ...props.appointment,
        status: '已取消'
      });
      
      // 再次触发刷新操作以确保数据最新
      emit('refresh');
    } else {
      // 仅在失败时使用toast提示
      toast({
        message: response?.message || '取消预约失败',
        color: 'danger'
      });
      
      // 操作失败也需要刷新以恢复状态
      emit('refresh');
    }
  } catch (error) {
    toast({
      message: '取消预约失败，请稍后重试',
      color: 'danger'
    });
    
    // 发生错误也需要刷新以恢复状态
    emit('refresh');
  } finally {
    cancelLoading.value = false;
  }
};

const emit = defineEmits(['update', 'refresh']);

// 辅助函数
const getCarName = (appointment) => {
  if (appointment.carInfo) {
    return `${appointment.carInfo.brand} ${appointment.carInfo.model}`;
  }
  return `车辆ID: ${appointment.carId}`;
};

const getDealerName = (appointment) => {
  // 优先使用API获取的联系人信息
  if (dealerInfo.value.contactPerson) {
    return dealerInfo.value.contactPerson;
  }
  
  // 其次使用预约中的经销商名称
  if (appointment.dealerName) {
    return appointment.dealerName;
  }
  
  // 最后显示经销商ID（如果正在加载则显示加载中）
  return dealerInfo.value.loading ? '加载中...' : `经销商ID: ${appointment.dealerId}`;
};

const formatDateTime = (dateString) => {
  if (!dateString) return '未知时间';
  const date = new Date(dateString);
  return date.toLocaleString('zh-CN');
};

const getStatusClass = (status) => {
  const statusMap = {
    '待确认': 'status-warning',
    '已确认': 'status-info',
    '已完成': 'status-success',
    '已取消': 'status-danger'
  };
  return statusMap[status] || 'status-default';
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
/* 卡片基础样式 */
.appointment-card {
  background-color: #ffffff;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  padding: 20px;
  transition: all 0.3s ease;
  margin-bottom: 16px;
  width: 100%;
  max-width: 900px;
  margin-left: auto;
  margin-right: auto;
}

/* 深色模式下的卡片样式 */
@media (prefers-color-scheme: dark) {
  .appointment-card {
    background-color: #2c2c2c;
    box-shadow: 0 2px 8px rgba(255, 215, 0, 0.1);
  }
}

:root[data-theme="dark"] .appointment-card {
  background-color: #2c2c2c;
  box-shadow: 0 2px 8px rgba(255, 215, 0, 0.1);
}

/* 卡片头部样式 */
.appointment-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
  padding-bottom: 12px;
  border-bottom: 1px solid #f0f0f0;
}

:root[data-theme="dark"] .appointment-header {
  border-bottom: 1px solid #3a3a3a;
}

/* 标题样式 */
.appointment-title {
  margin: 0;
  font-size: 18px;
  font-weight: 600;
  color: #333333;
}

:root[data-theme="dark"] .appointment-title {
  color: #ffffff;
}

/* 状态标签样式 */
.status-badge {
  padding: 4px 10px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 500;
  color: white;
}

.status-warning {
  background-color: #f2994a;
}

.status-info {
  background-color: #2f80ed;
}

.status-success {
  background-color: #27ae60;
}

.status-danger {
  background-color: #eb5757;
}

.status-default {
  background-color: #bdbdbd;
}

/* 内容区域样式 */
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
  color: #666666;
  flex-shrink: 0;
}

:root[data-theme="dark"] .info-label {
  color: rgba(255, 255, 255, 0.6);
}

.info-value {
  color: #333333;
  font-weight: 500;
}

:root[data-theme="dark"] .info-value {
  color: #ffffff;
}

/* 操作区域样式 */
.appointment-actions {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}

/* 自定义按钮样式 */
.custom-button {
  padding: 8px 16px;
  border-radius: 4px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  border: none;
  transition: all 0.3s ease;
}

.danger-button {
  background-color: #eb5757;
  color: white;
}

.danger-button:hover {
  background-color: #d64545;
}

:root[data-theme="dark"] .danger-button {
  background-color: #c53030;
}

:root[data-theme="dark"] .danger-button:hover {
  background-color: #9b2c2c;
}

/* 响应式布局 */
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