<template>
  <div class="filter-section">
    <div class="filter-row">
      <div class="filter-group">
        <label class="filter-label">关键词:</label>
        <input 
          type="text" 
          v-model="filterValues.keyword" 
          placeholder="品牌/型号/ID" 
          class="filter-input"
          @keyup.enter="applyFilters"
        />
      </div>
      
      <div class="filter-group">
        <label class="filter-label">状态:</label>
        <select v-model="filterValues.status" class="filter-select">
          <option value="">全部</option>
          <option value="0">待审核</option>
          <option value="1">已通过</option>
          <option value="2">已拒绝</option>
        </select>
      </div>
      
      <div class="filter-group">
        <label class="filter-label">品牌:</label>
        <select v-model="filterValues.brand" class="filter-select">
          <option value="">全部</option>
          <option v-for="brand in brandOptions" :key="brand.value" :value="brand.value">
            {{ brand.label }}
          </option>
        </select>
      </div>
      
      <div class="filter-group">
        <va-button small @click="toggleAdvancedFilters">
          {{ showAdvancedFilters ? '收起筛选' : '高级筛选' }}
          <va-icon :name="showAdvancedFilters ? 'expand_less' : 'expand_more'" />
        </va-button>
      </div>
    </div>
    
    <!-- 高级筛选选项 -->
    <div v-if="showAdvancedFilters" class="advanced-filters">
      <div class="filter-row">
        <div class="filter-group">
          <label class="filter-label">价格范围:</label>
          <div class="range-inputs">
            <input 
              type="number" 
              v-model="filterValues.minPrice" 
              placeholder="最低价" 
              class="filter-input range-input"
            />
            <span class="range-separator">至</span>
            <input 
              type="number" 
              v-model="filterValues.maxPrice" 
              placeholder="最高价" 
              class="filter-input range-input"
            />
          </div>
        </div>
        
        <div class="filter-group">
          <label class="filter-label">年份:</label>
          <div class="range-inputs">
            <input 
              type="number" 
              v-model="filterValues.minYear" 
              placeholder="起始年份" 
              class="filter-input range-input"
            />
            <span class="range-separator">至</span>
            <input 
              type="number" 
              v-model="filterValues.maxYear" 
              placeholder="结束年份" 
              class="filter-input range-input"
            />
          </div>
        </div>
        
        <div class="filter-group">
          <label class="filter-label">创建时间:</label>
          <div class="range-inputs">
            <input 
              type="date" 
              v-model="filterValues.startDate" 
              class="filter-input date-input"
            />
            <span class="range-separator">至</span>
            <input 
              type="date" 
              v-model="filterValues.endDate" 
              class="filter-input date-input"
            />
          </div>
        </div>
      </div>
    </div>
    
    <!-- 筛选按钮 -->
    <div class="filter-actions">
      <va-button small color="primary" @click="applyFilters">
        应用筛选
      </va-button>
      <va-button small color="gray" @click="resetFilters">
        重置筛选
      </va-button>
    </div>
  </div>
</template>

<script>
import { ref, reactive, computed, watch } from 'vue';

export default {
  name: "CarFilterSection",
  props: {
    // 品牌选项
    brandOptions: {
      type: Array,
      default: () => []
    },
    // 初始筛选条件
    initialFilters: {
      type: Object,
      default: () => ({
        keyword: '',
        status: '',
        brand: '',
        minPrice: '',
        maxPrice: '',
        minYear: '',
        maxYear: '',
        startDate: '',
        endDate: ''
      })
    }
  },
  emits: ['apply-filters', 'reset-filters'],
  setup(props, { emit }) {
    // 显示/隐藏高级筛选
    const showAdvancedFilters = ref(false);
    
    // 筛选条件
    const filterValues = reactive({...props.initialFilters});
    
    // 监听初始筛选条件变化
    watch(() => props.initialFilters, (newFilters) => {
      Object.keys(newFilters).forEach(key => {
        filterValues[key] = newFilters[key];
      });
    }, { deep: true });
    
    // 切换高级筛选显示状态
    const toggleAdvancedFilters = () => {
      showAdvancedFilters.value = !showAdvancedFilters.value;
    };
    
    // 应用筛选
    const applyFilters = () => {
      emit('apply-filters', {...filterValues});
    };
    
    // 重置筛选条件
    const resetFilters = () => {
      Object.keys(filterValues).forEach(key => {
        filterValues[key] = '';
      });
      emit('reset-filters');
    };

    return {
      showAdvancedFilters,
      filterValues,
      toggleAdvancedFilters,
      applyFilters,
      resetFilters
    };
  }
};
</script>

<style scoped>
/* 筛选区域样式 */
.filter-section {
  background-color: var(--audit-filter-bg, #f5f7fa);
  border-radius: 8px;
  padding: 16px;
  margin-bottom: 20px;
  box-shadow: 0 1px 3px var(--audit-card-shadow, rgba(0, 0, 0, 0.05));
}

.filter-row {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin-bottom: 12px;
}

.filter-group {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
}

.filter-label {
  font-size: 0.9rem;
  color: var(--audit-secondary-text, #666666);
  margin-right: 8px;
  white-space: nowrap;
}

.filter-input,
.filter-select {
  padding: 6px 10px;
  border: 1px solid var(--audit-input-border, #ddd);
  border-radius: 4px;
  font-size: 0.9rem;
  min-width: 120px;
  background-color: var(--audit-bg-color, #ffffff);
  color: var(--audit-text-color, #333333);
}

.range-inputs {
  display: flex;
  align-items: center;
}

.range-input {
  width: 100px;
}

.date-input {
  width: 150px;
}

.range-separator {
  margin: 0 8px;
  color: var(--audit-light-text, #999999);
}

.advanced-filters {
  border-top: 1px dashed var(--audit-border-color, #eee);
  padding-top: 12px;
  margin-top: 8px;
}

.filter-actions {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
  margin-top: 16px;
}

/* CSS变量定义 */
:root {
  /* 亮色模式变量 */
  --audit-bg-color: #ffffff;
  --audit-text-color: #333333;
  --audit-secondary-text: #666666;
  --audit-light-text: #999999;
  --audit-border-color: #eee;
  --audit-filter-bg: #f5f7fa;
  --audit-input-border: #ddd;
  --audit-card-shadow: rgba(0, 0, 0, 0.05);
  --audit-button-hover: rgba(0, 0, 0, 0.05);
}

/* 深色模式变量 */
[data-theme="dark"] {
  --audit-bg-color: #1e1e2d;
  --audit-text-color: #e0e0e0;
  --audit-secondary-text: #b0b0b0;
  --audit-light-text: #888888;
  --audit-border-color: #333344;
  --audit-filter-bg: #2c2c3c;
  --audit-input-border: #444455;
  --audit-card-shadow: rgba(0, 0, 0, 0.2);
  --audit-button-hover: rgba(255, 255, 255, 0.05);
}

/* 深色模式下的特殊覆盖样式 */
[data-theme="dark"] .filter-input,
[data-theme="dark"] .filter-select {
  background-color: var(--audit-bg-color);
  color: var(--audit-text-color);
  border-color: var(--audit-input-border);
}

[data-theme="dark"] .filter-input::placeholder,
[data-theme="dark"] .filter-select::placeholder {
  color: var(--audit-light-text);
}

[data-theme="dark"] .filter-label {
  color: var(--audit-secondary-text);
}

[data-theme="dark"] .filter-section {
  background-color: var(--audit-filter-bg);
  box-shadow: 0 1px 3px var(--audit-card-shadow);
  border: 1px solid rgba(255, 255, 255, 0.1);
}

[data-theme="dark"] .advanced-filters {
  border-top-color: var(--audit-border-color);
}

/* 按钮样式增强 */
.va-button {
  transition: all 0.2s ease;
}

[data-theme="dark"] .va-button:hover:not([disabled]) {
  background-color: var(--audit-button-hover);
}

/* 输入框聚焦状态 */
.filter-input:focus,
.filter-select:focus {
  outline: none;
  border-color: var(--va-primary, #154ec1);
  box-shadow: 0 0 0 2px rgba(21, 78, 193, 0.25);
}

[data-theme="dark"] .filter-input:focus,
[data-theme="dark"] .filter-select:focus {
  box-shadow: 0 0 0 2px rgba(21, 78, 193, 0.4);
}

@media (max-width: 768px) {
  .filter-group {
    width: 100%;
    margin-bottom: 10px;
  }
  
  .filter-input,
  .filter-select {
    flex: 1;
  }
  
  .filter-actions {
    justify-content: center;
  }
}
</style> 