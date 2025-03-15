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
      <!-- 筛选面板 -->
      <div class="panel-container">
        <FilterPanel
          v-model:filters="filters"
          v-model:sortOption="sortOption"
          @change="applyFilters"
        />
      </div>
      
      <!-- 加载状态 -->
      <div v-if="loading" class="loading-container">
        <va-progress-circle indeterminate color="primary" />
        <p>加载预约数据中...</p>
      </div>
      
      <!-- 空状态 -->
      <div v-else-if="filteredAppointments.length === 0" class="empty-container">
        <va-icon name="event_busy" size="large" />
        <p>{{ errorMessage || '当前筛选下暂无预约记录' }}</p>
      </div>
      
      <!-- 预约列表 -->
      <div v-else class="appointments-list">
        <AppointmentCard
          v-for="appointment in paginatedAppointments"
          :key="appointment.id"
          :appointment="appointment"
          @update="updateAppointment"
          @refresh="fetchAppointments"
        />
        
        <!-- 分页器 -->
        <div class="pagination-wrapper" v-if="filteredAppointments.length > 0">
          <div class="pagination-info">
            共 {{ filteredTotal }} 条记录，当前第 {{ currentPage }}/{{ Math.max(1, Math.ceil(filteredTotal / pageSize)) }} 页
          </div>
          <va-pagination
            v-model="currentPage"
            :pages="Math.max(1, Math.ceil(filteredTotal / pageSize))"
            :visible-pages="5"
            @update:modelValue="handlePageChange"
          />
          <div class="page-size-selector">
            <span class="page-size-label">每页显示:</span>
            <va-select
              v-model="pageSize"
              :options="pageSizeOptions"
              text-by="label"
              value-by="value"
              @update:modelValue="handleSizeChange"
              size="small"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useToast } from 'vuestic-ui';
import appointmentService from '@/api/appointmentService';
import AppointmentCard from './components/AppointmentCard.vue';
import RefreshButton from './components/RefreshButton.vue';
import FilterPanel from './components/FilterPanel.vue';
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

// 页面大小选项
const pageSizeOptions = computed(() => {
  return [10, 20, 30, 50].map(size => ({
    label: `${size}条/页`,
    value: size
  }));
});

// 筛选和排序状态
const filters = ref({
  showActive: true,
  showTestDrive: true,
  showViewCar: true
});
const sortOption = ref('createTime-desc');

// 筛选后的预约列表
const filteredAppointments = computed(() => {
  let result = [...appointments.value];
  
  // 应用筛选条件
  if (filters.value.showActive) {
    result = result.filter(item => item.status !== '已取消');
  }
  
  // 筛选预约类型
  const typeFilters = [];
  if (filters.value.showTestDrive) typeFilters.push('试驾');
  if (filters.value.showViewCar) typeFilters.push('看车');
  
  if (typeFilters.length > 0 && typeFilters.length < 2) {
    result = result.filter(item => typeFilters.includes(item.appointmentType));
  }
  
  // 应用排序
  const [field, direction] = sortOption.value.split('-');
  
  result.sort((a, b) => {
    let valueA, valueB;
    
    // 根据字段获取值
    if (field === 'id') {
      valueA = Number(a.id);
      valueB = Number(b.id);
    } else if (field === 'appointmentTime') {
      valueA = new Date(a.appointmentTime || 0).getTime();
      valueB = new Date(b.appointmentTime || 0).getTime();
    } else if (field === 'createTime') {
      valueA = new Date(a.createTime || 0).getTime();
      valueB = new Date(b.createTime || 0).getTime();
    }
    
    // 根据方向排序
    if (direction === 'asc') {
      return valueA - valueB;
    } else {
      return valueB - valueA;
    }
  });
  
  return result;
});

// 计算筛选后的总数量
const filteredTotal = computed(() => filteredAppointments.value.length);

// 计算当前页显示的预约列表
const paginatedAppointments = computed(() => {
  const startIndex = (currentPage.value - 1) * pageSize.value;
  const endIndex = startIndex + pageSize.value;
  return filteredAppointments.value.slice(startIndex, endIndex);
});

// 更新预约状态
const updateAppointment = (updatedAppointment) => {
  const index = appointments.value.findIndex(item => item.id === updatedAppointment.id);
  if (index !== -1) {
    appointments.value[index] = updatedAppointment;
  }
};

// 应用筛选和排序
const applyFilters = () => {
  // 当筛选条件变化时，重置为第一页
  currentPage.value = 1;
  
  // 保存用户偏好
  localStorage.setItem('appointmentFilters', JSON.stringify(filters.value));
  localStorage.setItem('appointmentSortOption', sortOption.value);
};

// 获取预约列表
const fetchAppointments = async () => {
  console.log('开始获取预约列表...');
  loading.value = true;
  errorMessage.value = '';
  
  try {
    const params = {
      pageNum: 1,  // 始终获取所有数据，前端进行筛选和分页
      pageSize: 1000  // 设置一个较大的值以获取尽可能多的数据
    };
    
    console.log('调用API获取预约数据，参数:', params);
    const response = await appointmentService.getUserAppointments(params);
    
    // 只在明确的失败情况下设置错误
    if (!response) {
      console.error('获取预约失败: 无响应');
      errorMessage.value = '获取预约失败: 无响应';
      return;
    }
    
    if (response.code !== 200) {
      console.error('获取预约失败:', response.message || '未知错误');
      errorMessage.value = `获取预约失败: ${response.message || '未知错误'}`;
      return;
    }
    
    console.log('成功获取预约数据:', response.data);
    
    // 处理成功情况
    if (!response.data || !Array.isArray(response.data.list)) {
      appointments.value = [];
      total.value = 0;
    } else {
      appointments.value = response.data.list;
      // 总数将在 filteredTotal 计算属性中更新
      total.value = response.data.total || 0;
    }
    
    // 只有在没有数据时才设置提示信息
    if (appointments.value.length === 0) {
      errorMessage.value = '暂无预约记录';
    }
    
    console.log('预约数据处理完成，当前列表长度:', appointments.value.length);
    
  } catch (error) {
    console.error('获取预约异常:', error);
    errorMessage.value = `获取预约异常: ${error.message || '未知错误'}`;
  } finally {
    loading.value = false;
    console.log('预约获取流程结束');
  }
};

// 页码变化处理
const handlePageChange = () => {
  // 前端分页，不需要重新请求数据
  // 只需要重置页面滚动位置
  window.scrollTo(0, 0);
};

// 页面大小变化处理
const handleSizeChange = (val) => {
  pageSize.value = val;
  currentPage.value = 1; // 重置为第一页
  window.scrollTo(0, 0);
  
  // 保存页面大小到本地存储
  localStorage.setItem('appointmentPageSize', val);
};

// 组件挂载时加载数据和恢复筛选设置
onMounted(() => {
  // 恢复用户筛选偏好
  const savedFilters = localStorage.getItem('appointmentFilters');
  const savedSortOption = localStorage.getItem('appointmentSortOption');
  const savedPageSize = localStorage.getItem('appointmentPageSize');
  
  if (savedFilters) {
    try {
      filters.value = JSON.parse(savedFilters);
    } catch (e) {
      console.error('恢复筛选设置失败:', e);
    }
  }
  
  if (savedSortOption) {
    sortOption.value = savedSortOption;
  }
  
  if (savedPageSize) {
    pageSize.value = parseInt(savedPageSize, 10);
  }
  
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

/* 面板容器样式 */
.panel-container {
  width: 100%;
  display: flex;
  justify-content: center;
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
  max-width: 100%;
  margin: 0 auto;
  align-items: center;
}

.pagination-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 32px;
  margin-bottom: 16px;
  padding: 16px;
  background-color: #ffffff;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  width: 100%;
  max-width: 900px;
  margin-left: auto;
  margin-right: auto;
}

:root[data-theme="dark"] .pagination-wrapper {
  background-color: #2c2c2c;
  box-shadow: 0 2px 8px rgba(255, 215, 0, 0.1);
}

.page-size-selector {
  display: flex;
  align-items: center;
  margin-left: 16px;
}

.page-size-label {
  margin-right: 8px;
  color: #666;
  font-size: 14px;
}

:root[data-theme="dark"] .page-size-label {
  color: rgba(255, 255, 255, 0.7);
}

.pagination-info {
  margin-right: 16px;
  color: #666;
  font-size: 14px;
}

:root[data-theme="dark"] .pagination-info {
  color: rgba(255, 255, 255, 0.7);
}

@media (max-width: 768px) {
  .content-container {
    padding: 0.8rem;
  }
  
  .pagination-wrapper {
    flex-direction: column;
    gap: 16px;
    padding: 12px;
  }
  
  .pagination-info {
    margin-right: 0;
    margin-bottom: 8px;
    text-align: center;
  }
  
  .page-size-selector {
    margin-left: 0;
    margin-top: 8px;
  }
}
</style> 