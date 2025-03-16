<template>
  <div class="car-list">
    <!-- 加载状态 -->
    <div v-if="loading" class="loading-container">
      <div class="loading-spinner"></div>
      <p>正在加载车辆信息...</p>
    </div>
    
    <!-- 错误信息 -->
    <div v-else-if="error" class="error-message">
      <i class="fa fa-exclamation-circle"></i>
      <p>{{ error }}</p>
      <button class="retry-button" @click="$emit('reload')">重试</button>
    </div>
    
    <!-- 无车辆数据 -->
    <div v-else-if="cars.length === 0" class="empty-message">
      <i class="fa fa-car"></i>
      <p>您还没有上传任何车辆信息</p>
      <button class="add-button" @click="$emit('add-car')">添加车辆</button>
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
      
      <div v-for="car in cars" :key="car.carId" class="list-item">
        <div class="list-column col-id">{{ car.carId }}</div>
        <div class="list-column col-brand">{{ car.brand }}</div>
        <div class="list-column col-model">{{ car.model }}</div>
        <div class="list-column col-year">{{ car.year }}</div>
        <div class="list-column col-price">{{ (car.price / 10000).toFixed(2) }}</div>
        <div class="list-column col-status">
          <span :class="getStatusClass(car.status)">{{ getStatusText(car.status) }}</span>
        </div>
        <div class="list-column col-actions">
          <button class="action-button edit-button" @click="$emit('edit', car)">
            <i class="fa fa-edit"></i> 编辑
          </button>
          <button class="action-button toggle-status-button" @click="$emit('toggle-status', car)">
            {{ car.status === 1 ? '下架' : '上架' }}
          </button>
          <button class="action-button delete-button" @click="$emit('delete', car)">
            <i class="fa fa-trash"></i> 删除
          </button>
        </div>
      </div>
      
      <!-- 分页控件 -->
      <div class="pagination">
        <button 
          :disabled="currentPage <= 1" 
          @click="$emit('page-change', currentPage - 1)"
          class="page-button"
        >
          上一页
        </button>
        <span class="page-info">{{ currentPage }} / {{ totalPages }}</span>
        <button 
          :disabled="currentPage >= totalPages" 
          @click="$emit('page-change', currentPage + 1)"
          class="page-button"
        >
          下一页
        </button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'CarList',
  
  props: {
    cars: {
      type: Array,
      required: true
    },
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
      required: true
    },
    totalPages: {
      type: Number,
      required: true
    }
  },
  
  emits: ['reload', 'add-car', 'edit', 'toggle-status', 'delete', 'page-change'],
  
  setup() {
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
    
    return {
      getStatusText,
      getStatusClass
    };
  }
};
</script>

<style scoped>
.car-list {
  width: 100%;
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
.add-button {
  margin-top: 1rem;
  padding: 0.5rem 1rem;
  background-color: #3498db;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.retry-button:hover,
.add-button:hover {
  background-color: #2980b9;
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

.status-active {
  color: #27ae60;
  font-weight: bold;
}

.status-inactive {
  color: #7f8c8d;
}

.status-sold {
  color: #3498db;
  font-weight: bold;
}

.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 1rem;
  gap: 1rem;
}

.page-button {
  padding: 0.5rem 1rem;
  background-color: #f5f5f5;
  border: 1px solid #ddd;
  border-radius: 4px;
  cursor: pointer;
}

.page-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.page-button:not(:disabled):hover {
  background-color: #e0e0e0;
}

.page-info {
  font-size: 0.9rem;
  color: #666;
}

/* 响应式调整 */
@media (max-width: 768px) {
  .list-header {
    display: none; /* 在移动端隐藏表头 */
  }
  
  .list-item {
    flex-direction: column;
    align-items: flex-start;
    padding: 1rem 0.5rem;
    position: relative;
  }
  
  .list-column {
    width: 100% !important;
    padding: 0.25rem 0;
    text-overflow: ellipsis;
    white-space: normal;
  }
  
  .col-id:before { content: "ID: "; font-weight: bold; }
  .col-brand:before { content: "品牌: "; font-weight: bold; }
  .col-model:before { content: "型号: "; font-weight: bold; }
  .col-year:before { content: "年份: "; font-weight: bold; }
  .col-price:before { content: "价格(万): "; font-weight: bold; }
  .col-status:before { content: "状态: "; font-weight: bold; }
  
  .col-actions {
    margin-top: 0.5rem;
    justify-content: flex-start;
  }
}
</style> 