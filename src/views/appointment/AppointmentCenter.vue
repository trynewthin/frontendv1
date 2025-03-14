<template>
  <div class="appointment-center">
    <!-- 顶部安全区域 -->
    <div class="safe-area-top"></div>
    
    <!-- 使用aheader组件 -->
    <aheader title="预约中心">
      <template #right-content>
        <RefreshButton @refresh="fetchAppointments" />
      </template>
    </aheader>
    
    <div class="content-container">
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
        <AppointmentCard
          v-for="appointment in appointments"
          :key="appointment.id"
          :appointment="appointment"
          @update="updateAppointment"
        />
        
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
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useToast } from 'vuestic-ui';
import appointmentService from '@/api/appointmentService';
import AppointmentCard from './components/AppointmentCard.vue';
import RefreshButton from './components/RefreshButton.vue';
import aheader from '@/components/header/aheader.vue';

const router = useRouter();
const { init: toast } = useToast();

// 状态定义
const appointments = ref([]);
const loading = ref(false);
const errorMessage = ref('');
const total = ref(0);
const currentPage = ref(1);
const pageSize = ref(10);

// 更新预约状态
const updateAppointment = (updatedAppointment) => {
  const index = appointments.value.findIndex(item => item.id === updatedAppointment.id);
  if (index !== -1) {
    appointments.value[index] = updatedAppointment;
  }
};

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

// 页码变化处理
const handlePageChange = () => {
  fetchAppointments();
};

// 组件挂载时加载数据
onMounted(() => {
  fetchAppointments();
});
</script>

<style scoped>
.appointment-center {
  width: 100%;
  height: 100vh;
  background-color: #f5f7fa;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  position: fixed; /* 固定定位，不随页面滚动 */
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
}

/* 顶部安全区域，防止内容被遮挡 */
.safe-area-top {
  width: 100%;
  height: 5rem; /* 与标题栏高度相当 */
  flex-shrink: 0;
}

/* 深色模式下的背景色 */
:root[data-theme="dark"] .appointment-center {
  background-color: var(--va-background);
}

.content-container {
  flex: 1;
  padding: 1rem;
  width: 100%;
  box-sizing: border-box;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
}

.loading-container,
.empty-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 0;
  text-align: center;
  flex: 1;
}

.loading-container p,
.empty-container p {
  margin: 16px 0;
  color: #666;
}

/* 深色模式下的文字颜色 */
:root[data-theme="dark"] .loading-container p,
:root[data-theme="dark"] .empty-container p {
  color: rgba(255, 255, 255, 0.7);
}

.appointments-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
}

.pagination-wrapper {
  display: flex;
  justify-content: center;
  margin-top: 32px;
  margin-bottom: 16px;
}

@media (max-width: 768px) {
  .content-container {
    padding: 0.8rem;
  }
}
</style> 