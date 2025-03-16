<template>
  <base-panel title="车辆列表">
    <!-- 主体内容区域 -->
    <template #default>
      <!-- 过滤和搜索栏 -->
      <div class="filter-bar">
        <div class="search-box">
          <input 
            type="text" 
            placeholder="搜索车辆..." 
            class="search-input" 
            v-model="searchQuery"
            @keyup.enter="handleSearch"
          />
          <button class="search-button" @click="handleSearch">搜索</button>
        </div>
        <div class="filter-options">
          <select 
            class="filter-select" 
            v-model="statusFilter"
            @change="handleStatusFilter"
          >
            <option value="all">所有状态</option>
            <option value="1">在售</option>
            <option value="0">下架</option>
            <option value="2">已售</option>
          </select>
        </div>
      </div>

      <!-- 加载状态 -->
      <div v-if="loading" class="loading-container">
        <div class="loading-spinner"></div>
        <p>正在加载车辆信息...</p>
      </div>
      
      <!-- 错误信息 -->
      <div v-else-if="error" class="error-message">
        <i class="fa fa-exclamation-circle"></i>
        <p>{{ error }}</p>
      </div>
      
      <!-- 无车辆数据 -->
      <div v-else-if="filteredCars.length === 0" class="empty-message">
        <i class="fa fa-car"></i>
        <p v-if="cars.length === 0">您还没有上传任何车辆信息</p>
        <p v-else>没有符合当前筛选条件的车辆</p>
        <button v-if="cars.length === 0" class="add-button" @click="$emit('add-car')">添加车辆</button>
        <button v-else class="reset-button" @click="resetFilters">重置筛选</button>
      </div>
      
      <!-- 车辆列表 -->
      <div v-else class="cars-list">
        <div class="list-header">
          <div class="list-column col-id">ID</div>
          <div class="list-column col-brand">品牌</div>
          <div class="list-column col-model">型号</div>
          <div class="list-column col-year">年份</div>
          <div class="list-column col-price">价格(万)</div>
          <div class="list-column col-status">状态</div>
          <div class="list-column col-actions">操作</div>
        </div>
        
        <div v-for="car in filteredCars" :key="car.carId" class="list-item">
          <div class="list-column col-id" data-label="ID">{{ car.carId }}</div>
          <div class="list-column col-brand" data-label="品牌">{{ car.brand }}</div>
          <div class="list-column col-model" data-label="型号">{{ car.model }}</div>
          <div class="list-column col-year" data-label="年份">{{ car.year }}</div>
          <div class="list-column col-price" data-label="价格(万)">{{ (car.price / 10000).toFixed(2) }}</div>
          <div class="list-column col-status" data-label="状态">
            <span :class="getStatusClass(car.status)">{{ getStatusText(car.status) }}</span>
          </div>
          <div class="list-column col-actions" data-label="操作">
            <button class="action-button edit-button" @click="handleEdit(car)">
              <i class="fa fa-edit"></i> 编辑
            </button>
            <button class="action-button toggle-status-button" @click="handleToggleStatus(car)">
              {{ car.status === 1 ? '下架' : '上架' }}
            </button>
            <button class="action-button delete-button" @click="handleDelete(car)">
              <i class="fa fa-trash"></i> 删除
            </button>
          </div>
        </div>
      </div>
    </template>
    
    <!-- 底部分页区域 -->
    <template #footer>
      <div class="panel-footer-content">
        <div v-if="filteredCars.length > 0" class="pagination">
          <button 
            :disabled="currentPage <= 1" 
            @click="handlePageChange(currentPage - 1)"
            class="page-button"
          >
            上一页
          </button>
          <span class="page-info">{{ currentPage }} / {{ totalPages }}</span>
          <button 
            :disabled="currentPage >= totalPages" 
            @click="handlePageChange(currentPage + 1)"
            class="page-button"
          >
            下一页
          </button>
        </div>
        <button class="add-car-button" @click="$emit('add-car')">
          <i class="fa fa-plus"></i> 添加车辆
        </button>
      </div>
    </template>
  </base-panel>
</template>

<script setup>
import { defineProps, defineEmits, ref, computed, watch, onMounted, onUnmounted, onActivated, nextTick } from 'vue';
import { useRoute } from 'vue-router';
import BasePanel from '@/components/card/BasePanel.vue';
import carService from '@/api/carService';
import userAdminService from '@/api/userAdminService';

// 定义props
const props = defineProps({
  loading: {
    type: Boolean,
    default: false
  },
  error: {
    type: String,
    default: ''
  },
  currentPage: {
    type: Number,
    default: 1
  },
  pageSize: {
    type: Number,
    default: 10
  },
  // dealerId可以从props接收或在组件内部获取
  dealerId: {
    type: [Number, String],
    default: null
  }
});

// 定义emits
const emits = defineEmits(['add-car', 'edit', 'edit-success', 'toggle-status-success', 'delete-success']);

// 本地状态
const searchQuery = ref('');
const statusFilter = ref('all');
const cars = ref([]);
const loading = ref(false);
const error = ref('');
const currentPage = ref(props.currentPage);
const pageSize = ref(props.pageSize);
const total = ref(0);
const dealerId = ref(props.dealerId);
const searchTimeout = ref(null); // 用于防抖处理

// 获取路由信息
const route = useRoute();

// 计算属性
const totalPages = computed(() => {
  return Math.ceil(total.value / pageSize.value) || 1;
});

// 计算过滤后的车辆列表
const filteredCars = computed(() => {
  let result = [...cars.value];
  
  // 应用状态筛选
  if (statusFilter.value !== 'all') {
    result = result.filter(car => car.status.toString() === statusFilter.value);
  }
  
  // 应用搜索查询
  if (searchQuery.value.trim()) {
    const query = searchQuery.value.toLowerCase().trim();
    result = result.filter(car => 
      car.brand?.toLowerCase().includes(query) || 
      car.model?.toLowerCase().includes(query) ||
      car.carId?.toString().includes(query)
    );
  }
  
  return result;
});

// 获取经销商ID的方法
const getDealerId = async () => {
  try {
    // 首先检查dealerId是否已存在，避免重复获取
    if (dealerId.value) {
      return dealerId.value;
    }
    
    // 尝试从props中获取
    if (props.dealerId) {
      try {
        const response = await userAdminService.getUserDetailNoAuth(props.dealerId);
        
        if (response.success && response.data) {
          if (response.data.dealerInfo && response.data.dealerInfo.dealerId) {
            dealerId.value = response.data.dealerInfo.dealerId;
            
            // 保存到localStorage，避免频繁请求
            try {
              localStorage.setItem('cachedDealerId', dealerId.value);
            } catch (err) {}
            
            return dealerId.value;
          }
        }
      } catch (err) {}
    }
    
    // 从localStorage获取缓存的dealerId
    try {
      const cachedDealerId = localStorage.getItem('cachedDealerId');
      if (cachedDealerId) {
        dealerId.value = cachedDealerId;
        return cachedDealerId;
      }
    } catch (err) {}
    
    // 从localStorage获取用户信息，并通过用户ID获取经销商信息
    try {
      const userInfoStr = localStorage.getItem('userInfo');
      if (userInfoStr) {
        const userInfo = JSON.parse(userInfoStr);
        if (userInfo && userInfo.userId) {
          // 如果用户有dealerId字段
          if (userInfo.dealerId) {
            dealerId.value = userInfo.dealerId;
            return userInfo.dealerId;
          }
          
          // 调用API获取用户详情
          const response = await userAdminService.getUserDetailNoAuth(userInfo.userId);
          
          if (response.success && response.data && response.data.dealerInfo && response.data.dealerInfo.dealerId) {
            dealerId.value = response.data.dealerInfo.dealerId;
            
            // 保存到localStorage
            try {
              localStorage.setItem('cachedDealerId', dealerId.value);
            } catch (err) {}
            
            return dealerId.value;
          }
        }
      }
    } catch (err) {}
    
    // 从localStorage获取经销商信息
    try {
      const dealerInfoStr = localStorage.getItem('dealerInfo');
      if (dealerInfoStr) {
        const dealerInfo = JSON.parse(dealerInfoStr);
        if (dealerInfo && dealerInfo.dealerId) {
          dealerId.value = dealerInfo.dealerId;
          return dealerInfo.dealerId;
        }
      }
    } catch (err) {}
    
    error.value = '无法获取经销商信息，请确保您已登录并完成经销商认证';
    return null;
  } catch (err) {
    error.value = '获取经销商信息失败: ' + (err.message || '未知错误');
    return null;
  }
};

// 加载经销商车辆数据
const loadDealerCars = async (filterOptions = {}) => {
  loading.value = true;
  error.value = '';
  
  try {
    // 确保有经销商ID
    const id = await getDealerId();
    if (!id) {
      loading.value = false;
      error.value = error.value || '无法获取经销商ID，请确保您已登录并完成经销商认证';
      return;
    }
    
    const queryParams = {
      page: currentPage.value,
      size: pageSize.value,
      query: searchQuery.value,
      status: statusFilter.value !== 'all' ? statusFilter.value : undefined,
      ...filterOptions
    };
    
    const response = await carService.getCarsByDealerId(id, queryParams);
    
    if (response.success) {
      cars.value = response.data || [];
      total.value = response.total || 0;
      if (cars.value.length === 0 && response.total > 0 && currentPage.value > 1) {
        // 当前页没有数据但总数不为0，说明可能是页码过大，尝试加载第一页
        currentPage.value = 1;
        await loadDealerCars(filterOptions);
      }
    } else {
      error.value = response.message || '获取车辆列表失败';
    }
  } catch (err) {
    error.value = '加载车辆信息失败: ' + (err.message || '未知错误');
  } finally {
    loading.value = false;
  }
};

// 处理搜索 - 添加防抖
const handleSearch = () => {
  // 清除之前的定时器
  if (searchTimeout.value) {
    clearTimeout(searchTimeout.value);
  }
  
  // 设置新的定时器，300ms后执行搜索
  searchTimeout.value = setTimeout(() => {
    const filterOptions = {
      query: searchQuery.value,
      status: statusFilter.value
    };
    currentPage.value = 1; // 重置分页
    loadDealerCars(filterOptions);
  }, 300);
};

// 处理状态筛选
const handleStatusFilter = () => {
  const filterOptions = {
    query: searchQuery.value,
    status: statusFilter.value
  };
  currentPage.value = 1; // 重置分页
  loadDealerCars(filterOptions);
};

// 重置筛选器
const resetFilters = () => {
  searchQuery.value = '';
  statusFilter.value = 'all';
  currentPage.value = 1;
  loadDealerCars({ query: '', status: 'all' });
};

// 处理分页变化
const handlePageChange = (page) => {
  currentPage.value = page;
  loadDealerCars({
    query: searchQuery.value,
    status: statusFilter.value
  });
};

// 处理上传/下架车辆
const handleToggleStatus = async (car) => {
  try {
    loading.value = true;
    const newStatus = car.status === 1 ? 0 : 1; // 在售(1) <-> 下架(0)
    
    // 使用专门的更新状态方法
    const response = await carService.changeCarStatus(car.carId, newStatus);
    
    if (response.success) {
      // 验证返回的数据中的状态是否与我们期望的一致
      if (response.data && response.data.status !== undefined) {
        // 使用返回的状态
        const actualStatus = response.data.status;
        const index = cars.value.findIndex(c => c.carId === car.carId);
        if (index !== -1) {
          cars.value[index].status = actualStatus;
        }
      } else {
        // 使用请求的状态
        const index = cars.value.findIndex(c => c.carId === car.carId);
        if (index !== -1) {
          cars.value[index].status = newStatus;
        }
      }
      
      // 触发成功事件
      emits('toggle-status-success', car);
    } else {
      error.value = response.message || '更新车辆状态失败';
      setTimeout(() => { error.value = ''; }, 3000);
    }
  } catch (err) {
    error.value = '更新车辆状态失败，请稍后重试';
    setTimeout(() => { error.value = ''; }, 3000);
  } finally {
    loading.value = false;
  }
};

// 处理删除车辆
const handleDelete = async (car) => {
  if (!confirm(`确定要删除${car.brand} ${car.model}吗？此操作不可恢复。`)) {
    return;
  }
  
  try {
    loading.value = true;
    
    const response = await carService.deleteCar(car.carId);
    
    if (response.success) {
      // 从列表中移除
      cars.value = cars.value.filter(c => c.carId !== car.carId);
      
      // 如果当前页没有数据了，且不是第一页，则返回上一页
      if (cars.value.length === 0 && currentPage.value > 1) {
        currentPage.value--;
        await loadDealerCars({
          query: searchQuery.value,
          status: statusFilter.value
        });
      }
      
      error.value = '车辆已成功删除！';
      emits('delete-success', car);
      setTimeout(() => { error.value = ''; }, 3000);
    } else {
      error.value = response.message || '删除车辆失败';
      setTimeout(() => { error.value = ''; }, 3000);
    }
  } catch (err) {
    console.error('删除车辆失败:', err);
    error.value = '删除车辆失败，请稍后重试';
    setTimeout(() => { error.value = ''; }, 3000);
  } finally {
    loading.value = false;
  }
};

// 处理编辑车辆
const handleEdit = (car) => {
  emits('edit', car);
};

// 处理编辑成功回调
const handleEditSuccess = (updatedCar) => {
  // 更新列表中的车辆数据
  const index = cars.value.findIndex(c => c.carId === updatedCar.carId);
  if (index !== -1) {
    // 更新基本信息
    cars.value[index] = { ...cars.value[index], ...updatedCar };
  }
  
  // 显示成功消息
  error.value = '车辆信息更新成功！';
  emits('edit-success', updatedCar);
  setTimeout(() => { error.value = ''; }, 3000);
};

// 获取状态文本
const getStatusText = (status) => {
  switch (status) {
    case 1: return '在售';
    case 0: return '下架';
    case 2: return '已售';
    default: return '未知';
  }
};

// 获取状态样式类
const getStatusClass = (status) => {
  switch (status) {
    case 1: return 'status-active';
    case 0: return 'status-inactive';
    case 2: return 'status-sold';
    default: return '';
  }
};

// 监听路由变化 - 修改为全局事件方式
const handleRouteChange = () => {
  if (cars.value.length === 0 || document.visibilityState === 'visible') {
    nextTick(() => {
      loadDealerCars();
    });
  }
};

// 监听窗口可见性变化
const handleVisibilityChange = () => {
  if (document.visibilityState === 'visible') {
    if (cars.value.length === 0) {
      loadDealerCars();
    }
  }
};

// 组件挂载时添加更多事件监听
onMounted(() => {
  // 确保只有在没有通过props.dealerId触发watch的情况下才执行初始加载
  if (!props.dealerId && !dealerId.value) {
    getDealerId();
    loadDealerCars();
  }
  
  // 添加页面可见性变化监听
  document.addEventListener('visibilitychange', handleVisibilityChange);
  
  // 添加全局路由变化监听
  window.addEventListener('popstate', handleRouteChange);
  
  // 延迟检查数据是否加载
  setTimeout(() => {
    if (cars.value.length === 0 && !loading.value) {
      loadDealerCars();
    }
  }, 1000);
});

// 组件激活时强制加载数据
onActivated(() => {
  nextTick(() => {
    // 无论如何都要重新加载数据
    loadDealerCars();
  });
});

// 组件卸载前清除所有资源
onUnmounted(() => {
  if (searchTimeout.value) {
    clearTimeout(searchTimeout.value);
  }
  
  // 移除所有事件监听
  document.removeEventListener('visibilitychange', handleVisibilityChange);
  window.removeEventListener('popstate', handleRouteChange);
});

// 监听props变化
watch(() => props.dealerId, (newDealerId) => {
  if (newDealerId) {
    dealerId.value = newDealerId;
    // 重置页码和筛选条件
    currentPage.value = 1;
    loadDealerCars();
  }
}, { immediate: true });

// 监听cars变化
watch(() => cars.value, (newCars) => {
  if (newCars.length > 0 && filteredCars.value.length === 0) {
    // 当有车辆数据但筛选后没有结果时，提示用户
  }
});

// 监听searchQuery和statusFilter变化，自动触发搜索
watch([searchQuery, statusFilter], () => {
  handleSearch();
});

// 对外暴露部分方法
defineExpose({
  loadDealerCars,
  handleEditSuccess
});
</script>

<style scoped>
.filter-bar {
  padding: 1rem;
  border-bottom: 1px solid var(--card-border-color, #eaeaea);
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 1rem;
  margin-bottom: 1rem;
}

/* 使BasePanel内有一定的内边距和最小高度 */
:deep(.panel-body) {
  padding: 1rem 1.5rem;
  min-height: 500px;
}

/* 设置整个面板的样式 */
:deep(.base-panel) {
  margin: 0 1rem;
  min-height: 600px;
}

/* 深色模式适配 */
:root[data-theme="dark"] :deep(.base-panel) {
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.25);
}

/* 响应式设计 - 大屏幕增加边距 */
@media (min-width: 1200px) {
  :deep(.base-panel) {
    margin: 0 2rem;
  }
}

/* 响应式设计 - 小屏幕减小边距 */
@media (max-width: 768px) {
  :deep(.base-panel) {
    margin: 0 0.5rem;
  }
  
  :deep(.panel-body) {
    padding: 1rem;
  }
}

/* 底部面板内容对齐和间距 */
.panel-footer-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  padding: 0.5rem 1rem;
}

.search-box {
  display: flex;
  gap: 0.5rem;
  flex: 1;
}

.search-input {
  flex: 1;
  padding: 0.5rem 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 0.9rem;
}

.search-button {
  padding: 0.5rem 1rem;
  background-color: var(--primary-color, #000);
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.filter-options {
  display: flex;
  gap: 0.5rem;
}

.filter-select {
  padding: 0.5rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  background-color: white;
  font-size: 0.9rem;
}

.loading-container,
.error-message,
.empty-message {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 200px;
  text-align: center;
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 4px solid #f3f3f3;
  border-top: 4px solid #3498db;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 1rem;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.error-message {
  color: #e74c3c;
}

.error-message i,
.empty-message i {
  font-size: 2.5rem;
  margin-bottom: 1rem;
}

.retry-button,
.add-button,
.reset-button {
  margin-top: 1rem;
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.retry-button,
.add-button {
  background-color: #3498db;
  color: white;
}

.reset-button {
  background-color: #95a5a6;
  color: white;
}

.retry-button:hover,
.add-button:hover {
  background-color: #2980b9;
}

.reset-button:hover {
  background-color: #7f8c8d;
}

.cars-list {
  width: 100%;
}

.list-header,
.list-item {
  display: flex;
  align-items: center;
  padding: 0.75rem 0;
  border-bottom: 1px solid #e0e0e0;
}

.list-header {
  font-weight: bold;
  background-color: #f5f5f5;
  padding: 0.75rem 0.5rem;
}

.list-column {
  padding: 0 0.5rem;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.col-id { width: 50px; }
.col-brand, .col-model { width: 120px; }
.col-year { width: 80px; }
.col-price { width: 100px; }
.col-status { width: 80px; }
.col-actions { 
  flex: 1;
  min-width: 200px;
  display: flex;
  justify-content: flex-end;
  gap: 0.5rem;
}

.status-active {
  color: #27ae60;
  font-weight: 600;
}

.status-inactive {
  color: #7f8c8d;
}

.status-sold {
  color: #e74c3c;
  font-weight: 600;
}

.action-button {
  padding: 0.25rem 0.5rem;
  font-size: 0.85rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.edit-button {
  background-color: #3498db;
  color: white;
}

.edit-button:hover {
  background-color: #2980b9;
}

.toggle-status-button {
  background-color: #f39c12;
  color: white;
}

.toggle-status-button:hover {
  background-color: #d35400;
}

.delete-button {
  background-color: #e74c3c;
  color: white;
}

.delete-button:hover {
  background-color: #c0392b;
}

.pagination {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  gap: 1rem;
}

.page-button {
  padding: 0.5rem 1rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  background-color: #f9f9f9;
  cursor: pointer;
  transition: all 0.2s;
}

.page-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.page-button:not(:disabled):hover {
  background-color: #eee;
}

.page-info {
  font-size: 0.9rem;
  color: #666;
}

/* 深色模式适配 */
:root[data-theme="dark"] .search-input,
:root[data-theme="dark"] .filter-select {
  background-color: #333;
  color: #e0e0e0;
  border-color: #444;
}

:root[data-theme="dark"] .search-button {
  background-color: var(--primary-color, #333);
  color: #e0e0e0;
}

:root[data-theme="dark"] .list-header {
  background-color: #333;
}

:root[data-theme="dark"] .list-item {
  border-color: #444;
}

:root[data-theme="dark"] .page-button {
  background-color: #333;
  color: #e0e0e0;
  border-color: #444;
}

:root[data-theme="dark"] .page-button:not(:disabled):hover {
  background-color: #444;
}

:root[data-theme="dark"] .page-info {
  color: #aaa;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .filter-bar {
    flex-direction: column;
    align-items: stretch;
  }
  
  .search-box,
  .filter-options,
  .filter-select {
    width: 100%;
  }
  
  .list-header {
    display: none;
  }
  
  .list-item {
    flex-direction: column;
    padding: 1rem 0;
    border-bottom: 1px solid #e0e0e0;
  }
  
  .list-column {
    width: 100% !important;
    padding: 0.25rem 0;
    display: flex;
  }
  
  .list-column::before {
    content: attr(data-label);
    width: 100px;
    font-weight: bold;
  }
  
  .col-actions {
    justify-content: flex-start;
    margin-top: 0.5rem;
  }
}

.add-car-button {
  padding: 0.5rem 1.2rem;
  background-color: var(--primary-color, #000);
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 0.9rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.add-car-button:hover {
  opacity: 0.9;
}

.add-car-button i {
  font-size: 0.85rem;
}

/* 深色模式适配 */
:root[data-theme="dark"] .add-car-button {
  background-color: var(--primary-color, #000000);
  color: #000000;
}

/* 移动端适配 */
@media (max-width: 768px) {
  .panel-footer-content {
    flex-direction: column;
    gap: 1rem;
  }
  
 .pagination {
    width: 100%;
    justify-content: center;
  }
  
  .add-car-button {
    width: 100%;
    justify-content: center;
  }
}
</style> 