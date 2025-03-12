<template>
  <div class="appointment-management">
    <div class="page-header">
      <h2>预约管理</h2>
      <va-button @click="goBack" preset="secondary" icon="arrow_back" size="small">返回首页</va-button>
    </div>

    <div class="filter-section">
      <va-button @click="fetchAppointments" icon="refresh" preset="secondary">刷新</va-button>
    </div>
    
    <!-- 加载状态 -->
    <div v-if="loading" class="loading-container">
      <va-progress-circle indeterminate color="primary" />
      <p>加载预约数据中...</p>
    </div>
    
    <!-- 空状态 -->
    <div v-else-if="appointments.length === 0" class="empty-container">
      <va-icon name="event_busy" size="large" />
      <p>{{ errorMessage || '暂无预约记录' }}</p>
      <va-button @click="fetchAppointments" preset="primary" size="small">重新加载</va-button>
    </div>
    
    <!-- 预约列表 -->
    <div v-else class="appointments-list">
      <div v-for="appointment in appointments" :key="appointment.id" class="appointment-card">
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
            @click="cancelAppointment(appointment.id)"
            preset="danger"
            size="small"
            :loading="cancelingId === appointment.id"
          >
            取消预约
          </va-button>
          
          <va-button
            v-if="appointment.dealerId"
            @click="contactDealer(appointment.dealerId)"
            preset="secondary"
            size="small"
            icon="chat"
          >
            联系经销商
          </va-button>
        </div>
      </div>
      
      <!-- 分页器 -->
      <div class="pagination-wrapper" v-if="total > pageSize">
        <va-pagination
          v-model="currentPage"
          :pages="Math.ceil(total / pageSize)"
          :visible-pages="5"
          @update:modelValue="handlePageChange"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useToast } from 'vuestic-ui';
import appointmentService from '@/api/appointmentService';

const router = useRouter();
const { init: toast } = useToast();

// 返回首页
const goBack = () => {
  router.push('/');
};

// 状态定义
const appointments = ref([]);
const loading = ref(false);
const errorMessage = ref('');
const cancelingId = ref(null);
const total = ref(0);
const currentPage = ref(1);
const pageSize = ref(10);

// 获取预约列表
const fetchAppointments = async () => {
  loading.value = true;
  errorMessage.value = '';
  
  try {
    const params = {
      pageNum: currentPage.value,
      pageSize: pageSize.value
    };
    
    const response = await appointmentService.getUserAppointments(params);
    
    // 只在明确的失败情况下设置错误
    if (!response) {
      errorMessage.value = '获取预约失败: 无响应';
      return;
    }
    
    if (response.code !== 200) {
      errorMessage.value = `获取预约失败: ${response.message || '未知错误'}`;
      return;
    }
    
    // 处理成功情况
    if (!response.data || !Array.isArray(response.data.list)) {
      appointments.value = [];
      total.value = 0;
    } else {
      appointments.value = response.data.list;
      total.value = response.data.total || 0;
      currentPage.value = response.data.pageNum || 1;
      pageSize.value = response.data.pageSize || 10;
    }
    
    // 只有在没有数据时才设置提示信息
    if (appointments.value.length === 0) {
      errorMessage.value = '暂无预约记录';
    }
    
  } catch (error) {
    errorMessage.value = `获取预约异常: ${error.message || '未知错误'}`;
  } finally {
    loading.value = false;
  }
};

// 取消预约
const cancelAppointment = async (id) => {
  if (!id) return;
  
  cancelingId.value = id;
  
  try {
    const response = await appointmentService.cancelAppointment(id);
    
    if (response && response.code === 200) {
      // 更新本地状态
      const index = appointments.value.findIndex(item => item.id === id);
      if (index !== -1) {
        appointments.value[index].status = '已取消';
      }
      
      toast({
        message: '预约已成功取消',
        color: 'success'
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
  } finally {
    cancelingId.value = null;
  }
};

// 联系经销商
const contactDealer = (dealerId) => {
  if (!dealerId) return;
  router.push(`/chat/${dealerId}`);
};

// 页码变化处理
const handlePageChange = () => {
  fetchAppointments();
};

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

// 组件挂载时加载数据
onMounted(() => {
  fetchAppointments();
});
</script>

<style scoped>
.appointment-management {
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
}

.page-header {
  margin-bottom: 24px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.filter-section {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  margin-bottom: 24px;
}

.loading-container,
.empty-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 0;
  text-align: center;
}

.loading-container p,
.empty-container p {
  margin: 16px 0;
  color: #666;
}

.appointments-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.appointment-card {
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  padding: 20px;
}

.appointment-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
  padding-bottom: 12px;
  border-bottom: 1px solid #f0f0f0;
}

.appointment-title {
  margin: 0;
  font-size: 18px;
  font-weight: 600;
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
  color: #666;
  flex-shrink: 0;
}

.info-value {
  color: #333;
  font-weight: 500;
}

.appointment-actions {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}

.pagination-wrapper {
  display: flex;
  justify-content: center;
  margin-top: 32px;
}

@media (max-width: 768px) {
  .filter-section {
    flex-direction: column;
    align-items: flex-end;
    gap: 16px;
  }
  
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