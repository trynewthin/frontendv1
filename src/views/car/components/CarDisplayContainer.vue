<template>
  <div class="car-display-container">
    <va-inner-loading :loading="loading">
      <!-- 车辆列表 -->
      <div v-if="displayedCars.length > 0" class="car-grid">
        <CarCard
          v-for="car in displayedCars"
          :key="car.id"
          :car="car"
          class="car-item"
          :showImage="true"
          :showStatus="true"
          :showPrice="true"
          :showModelBrand="true"
          :showModel="true"
          :showBrand="true"
          :showMeta="true"
          :showCategory="true"
          :showYear="true"
          :showStats="false"
          :showViewCount="false"
          :showFavoriteCount="false"
          :showRecommendReason="false"
        />
      </div>
      
      <!-- 无数据提示 -->
      <div v-else class="empty-state">
        <p>暂无符合条件的车辆</p>
      </div>

      <!-- 分页显示组件 -->
      <div class="pagination-container" v-if="total > 0">
        <div class="pagination-wrapper">
          <va-pagination
            :model-value="currentPage"
            :pages="Math.ceil(total / pageSize)"
            :total="total"
            :visible-pages="6"
            :boundary-links="false"
            :limit="6"
            @update:model-value="handleCurrentChange"
          />
          <va-select
            :model-value="pageSize"
            class="page-size-select"
            @update:model-value="handleSizeChange"
            :options="pageSizeOptions"
            text-by="label"
            value-by="value"
          />
        </div>
      </div>
    </va-inner-loading>
  </div>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue';
import CarCard from '@/components/car/CarCard.vue';

// 定义组件接收的属性
const props = defineProps({
  displayedCars: {
    type: Array,
    required: true
  },
  loading: {
    type: Boolean,
    default: false
  },
  total: {
    type: Number,
    default: 0
  },
  currentPage: {
    type: Number,
    default: 1
  },
  pageSize: {
    type: Number,
    default: 12
  },
  pageSizeOptions: {
    type: Array,
    default: () => []
  }
});

// 定义组件发出的事件
const emit = defineEmits(['update:currentPage', 'update:pageSize']);

// 事件处理方法
const handleCurrentChange = (val) => {
  emit('update:currentPage', val);
};

const handleSizeChange = (val) => {
  emit('update:pageSize', val);
};
</script>

<style scoped>
.car-display-container {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  overflow-y: auto;
  padding: 0.5rem 1rem 2rem;
  box-sizing: border-box;
}

.car-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 2rem;
  margin-bottom: 2rem;
  width: 100%;
  padding: 0.5rem;
  box-sizing: border-box;
}

.car-item {
  height: 100%;
  min-height: 300px;
  display: flex;
  flex-direction: column;
  margin-bottom: 0.5rem;
}

.pagination-container {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 2rem;
  width: 100%;
  padding: 1rem;
  box-sizing: border-box;
}

.pagination-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-wrap: nowrap;
  gap: 1rem;
  padding: 0.5rem;
}

.page-size-select {
  width: 120px;
  flex-shrink: 0;
  margin-left: 0.5rem;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 3rem;
  color: var(--va-text-color-secondary);
  width: 100%;
  min-height: 300px;
  box-sizing: border-box;
  margin: 1.5rem 0;
}

.empty-icon {
  font-size: 2rem;
  color: var(--va-primary);
  margin-bottom: 1.5rem;
}

.empty-state p {
  margin-top: 1.5rem;
  font-size: 1rem;
}

/* 深色模式下的分页样式 */
:root[data-theme="dark"] :deep(.va-pagination__item) {
  color: var(--va-text-color);
  background-color: var(--va-background-secondary);
  border-color: rgba(255, 215, 0, 0.2);
}

:root[data-theme="dark"] :deep(.va-pagination__item--active) {
  background-color: #FFD700;
  color: #000;
  border-color: #FFD700;
}

:root[data-theme="dark"] :deep(.va-pagination__item:hover) {
  background-color: rgba(255, 215, 0, 0.1);
  border-color: #FFD700;
}

/* 深色模式下的加载状态样式 */
:root[data-theme="dark"] :deep(.va-inner-loading) {
  background-color: rgba(0, 0, 0, 0.5);
}

/* 确保分页组件在小屏幕上也保持在一行 */
@media (max-width: 768px) {
  .pagination-wrapper {
    flex-wrap: nowrap;
    width: auto;
  }
  
  .car-grid {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
}

@media (max-width: 480px) {
  .pagination-container {
    flex-direction: row;
  }
  
  .pagination-wrapper {
    flex-direction: row;
    align-items: center;
    gap: 0.5rem;
  }
  
  .page-size-select {
    width: 100px;
    margin-top: 0;
  }
  
  :deep(.va-pagination__item) {
    min-width: 28px;
    height: 28px;
    font-size: 0.8rem;
  }
}
</style> 