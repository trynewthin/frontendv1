<template>
  <div class="car-audit-table-wrapper">
    <!-- 加载状态 -->
    <div v-if="loading" class="loading-container">
      <div class="loading-spinner"></div>
      <p>加载中...</p>
    </div>

    <!-- 数据表格 -->
    <table class="cars-table" v-if="!loading && cars.length > 0">
      <thead>
        <tr>
          <th width="80">ID</th>
          <th width="120">品牌</th>
          <th>型号</th>
          <th width="180">创建时间</th>
          <th width="100">状态</th>
          <th width="220">操作</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="car in cars" :key="car.carId">
          <!-- ID列 -->
          <td>{{ car.carId || '暂无ID' }}</td>
          
          <!-- 品牌列 -->
          <td>{{ formatBrand(car.brand) || '暂无品牌' }}</td>
          
          <!-- 型号列 -->
          <td>
            <div>{{ car.model || '暂无型号' }}</div>
            <div v-if="car.year || car.price" class="text-gray text-sm">
              {{ car.year || '' }}年 {{ car.price ? `· ${formatPrice(car.price)}` : '' }}
            </div>
          </td>
          
          <!-- 创建时间列 -->
          <td>{{ formatDate(car.createTime) || '无日期' }}</td>
          
          <!-- 状态列 -->
          <td>
            <span 
              class="status-badge" 
              :class="getStatusClass(car.status)"
            >
              {{ formatAuditStatus(car.status) }}
            </span>
          </td>
          
          <!-- 操作列 -->
          <td class="action-buttons">
            <button 
              v-if="car.status === 0" 
              class="action-btn approve-btn"
              @click="$emit('approve', car.carId)"
            >
              通过
            </button>
            <button 
              v-if="car.status === 0" 
              class="action-btn reject-btn"
              @click="$emit('reject', car.carId)"
            >
              拒绝
            </button>
            <button 
              class="action-btn preview-btn"
              @click="$emit('preview', car)"
            >
              预览
            </button>
            <button 
              class="action-btn edit-btn"
              @click="$emit('edit', car)"
            >
              编辑
            </button>
            <button 
              class="action-btn delete-btn"
              @click="$emit('delete', car.carId)"
            >
              删除
            </button>
          </td>
        </tr>
      </tbody>
    </table>
    
    <!-- 空数据时的提示 -->
    <div v-if="!loading && cars.length === 0" class="empty-container">
      <p>暂无审核数据</p>
      <button class="reload-btn" @click="$emit('reload')">重新加载</button>
    </div>

    <!-- 分页控件 -->
    <div class="pagination-controls" v-if="!loading && cars.length > 0">
      <button 
        class="page-btn" 
        :disabled="currentPage <= 1" 
        @click="handlePageChange(currentPage - 1)"
      >
        上一页
      </button>
      <span class="page-info">第 {{ currentPage }} 页 / 共 {{ totalPages }} 页</span>
      <button 
        class="page-btn" 
        :disabled="currentPage >= totalPages" 
        @click="handlePageChange(currentPage + 1)"
      >
        下一页
      </button>
    </div>
  </div>
</template>

<script>
import { computed } from 'vue';

export default {
  name: "CarAuditTable",
  props: {
    // 车辆数据
    cars: {
      type: Array,
      required: true
    },
    // 加载状态
    loading: {
      type: Boolean,
      default: false
    },
    // 当前页码
    page: {
      type: Number,
      default: 1
    },
    // 兼容旧版本的currentPage
    currentPage: {
      type: Number,
      default: 1
    },
    // 总条目数
    totalItems: {
      type: Number,
      default: 0
    },
    // 每页条目数
    pageSize: {
      type: Number,
      default: 10
    },
    // 格式化函数
    formatters: {
      type: Object,
      default: () => ({})
    }
  },
  emits: [
    'page-change', 
    'approve', 
    'reject', 
    'view', 
    'preview', 
    'edit', 
    'delete', 
    'reload'
  ],
  setup(props, { emit }) {
    // 计算属性：总页数
    const totalPages = computed(() => {
      return Math.ceil(props.totalItems / props.pageSize) || 1;
    });
    
    // 处理页码变化
    const handlePageChange = (page) => {
      // 确保页码在有效范围内
      if (page >= 1 && page <= totalPages.value) {
        emit('page-change', page);
      }
    };
    
    // 格式化状态
    const formatAuditStatus = (status) => {
      if (props.formatters && props.formatters.status) {
        return props.formatters.status(status);
      }
      
      status = Number(status);
      const statusMap = {
        0: '待审核',
        1: '已通过',
        2: '已拒绝'
      };
      return statusMap[status] || '未知状态';
    };
    
    // 获取状态样式类
    const getStatusClass = (status) => {
      status = Number(status);
      if (status === 0) return 'pending';    // 待审核
      if (status === 1) return 'active';     // 已通过
      if (status === 2) return 'inactive';   // 已拒绝
      return '';
    };
    
    // 格式化品牌
    const formatBrand = (brand) => {
      if (props.formatters && props.formatters.brand) {
        return props.formatters.brand(brand);
      }
      
      if (!brand) return '暂无品牌';
      
      // 常见品牌映射
      const brandMap = {
        'BMW': '宝马',
        'Audi': '奥迪',
        'Mercedes': '奔驰',
        'Mercedes-Benz': '奔驰',
        'Porsche': '保时捷',
        'Toyota': '丰田',
        'Honda': '本田',
        'Nissan': '日产',
        'Ford': '福特',
        'Chevrolet': '雪佛兰',
        'Volkswagen': '大众'
      };
      
      return brandMap[brand] || brand;
    };
    
    // 格式化价格
    const formatPrice = (price) => {
      if (props.formatters && props.formatters.price) {
        return props.formatters.price(price);
      }
      
      if (price === undefined || price === null) return '0元';
      
      // 处理价格值
      let priceValue = Number(price);
      if (isNaN(priceValue)) return '0元';
      
      // 直接展示元为单位的价格
      return priceValue.toLocaleString() + '元';
    };
    
    // 格式化日期
    const formatDate = (dateString) => {
      if (props.formatters && props.formatters.date) {
        return props.formatters.date(dateString);
      }
      
      if (!dateString) return '无日期';
      try {
        const date = new Date(dateString);
        if (isNaN(date.getTime())) return '无效日期';
        
        return date.toLocaleString('zh-CN', {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
          hour: '2-digit',
          minute: '2-digit'
        }).replace(/\//g, '-');
      } catch (error) {
        return '无效日期';
      }
    };

    return {
      currentPage: computed(() => props.page || props.currentPage),
      totalPages,
      handlePageChange,
      formatAuditStatus,
      formatBrand,
      formatPrice,
      formatDate,
      getStatusClass
    };
  }
};
</script>

<style scoped>
.car-audit-table-wrapper {
  width: 100%;
}

/* 表格样式 */
.cars-table {
  width: 100%;
  border-collapse: collapse;
  border: none;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
}

.cars-table th,
.cars-table td {
  padding: 0.75rem;
  text-align: left;
  border-bottom: none;
}

.cars-table th {
  background-color: #f5f5f5;
  font-weight: 600;
  color: #333;
  border-bottom: 1px solid #eee;
}

.cars-table tr:hover {
  background-color: #f9f9f9;
}

/* 加载和空数据状态 */
.loading-container,
.empty-container {
  padding: 3rem 1rem;
  text-align: center;
  color: #666;
}

.loading-spinner {
  display: inline-block;
  width: 2rem;
  height: 2rem;
  border: 3px solid rgba(0, 0, 0, 0.1);
  border-top-color: var(--va-primary);
  border-radius: 50%;
  animation: spin 1s infinite linear;
  margin-bottom: 1rem;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.reload-btn {
  margin-top: 1rem;
  padding: 0.5rem 1rem;
  background-color: #f5f5f5;
  border: 1px solid #ddd;
  border-radius: 4px;
  cursor: pointer;
}

/* 状态标签 */
.status-badge {
  display: inline-block;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-size: 0.8rem;
}

.status-badge.active {
  background-color: #e6f7ed;
  color: #52c41a;
}

.status-badge.inactive {
  background-color: #fff1f0;
  color: #ff4d4f;
}

.status-badge.pending {
  background-color: #e6f7ff;
  color: #1890ff;
}

/* 操作按钮 */
.action-buttons {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.action-btn {
  padding: 0.25rem 0.5rem;
  font-size: 0.8rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  white-space: nowrap;
}

.approve-btn {
  background-color: #e6f7ed;
  color: #52c41a;
}

.reject-btn {
  background-color: #fff1f0;
  color: #ff4d4f;
}

.view-btn {
  background-color: #e6f7ff;
  color: #1890ff;
}

.preview-btn {
  background-color: #f0f5ff;
  color: #597ef7;
}

.edit-btn {
  background-color: #fff7e6;
  color: #fa8c16;
}

.delete-btn {
  background-color: #fff1f0;
  color: #ff4d4f;
}

/* 分页控件 */
.pagination-controls {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 1.5rem;
  padding: 1rem 0;
}

.page-btn {
  padding: 0.4rem 0.8rem;
  border: 1px solid #ddd;
  background-color: white;
  border-radius: 4px;
  cursor: pointer;
}

.page-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.page-info {
  margin: 0 1rem;
  color: #666;
}

/* 辅助类 */
.text-gray {
  color: #666666;
}

.text-sm {
  font-size: 0.875rem;
}

/* 深色模式适配 */
[data-theme="dark"] .cars-table {
  border-color: #444;
  color: #fff;
}

[data-theme="dark"] .cars-table th {
  background-color: #333;
  color: #fff;
  border-bottom-color: #444;
}

[data-theme="dark"] .cars-table td {
  border-bottom-color: #444;
  color: #fff;
}

[data-theme="dark"] .cars-table tr:hover {
  background-color: #2c2c2c;
}

[data-theme="dark"] .text-gray {
  color: #bbb;
}

[data-theme="dark"] .loading-container,
[data-theme="dark"] .empty-container {
  color: #bbb;
}

[data-theme="dark"] .loading-spinner {
  border-color: rgba(255, 255, 255, 0.1);
  border-top-color: #fff;
}

[data-theme="dark"] .reload-btn,
[data-theme="dark"] .page-btn {
  background-color: #333;
  border-color: #555;
  color: #fff;
}

[data-theme="dark"] .page-info {
  color: #bbb;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .cars-table th,
  .cars-table td {
    padding: 0.5rem;
    font-size: 0.85rem;
  }
  
  .action-buttons {
    flex-direction: column;
    gap: 0.3rem;
  }
  
  .action-btn {
    font-size: 0.75rem;
    padding: 0.2rem 0.4rem;
  }
}
</style> 