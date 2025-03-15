<template>
  <div class="filter-panel">
    <div class="filter-row">
      <div class="filter-label">筛选</div>
      <div class="filter-content">
        <label class="filter-checkbox">
          <input type="checkbox" v-model="filterOptions.showActive" @change="emitChange">
          <span>显示未取消的预约</span>
        </label>
        <label class="filter-checkbox">
          <input type="checkbox" v-model="filterOptions.showTestDrive" @change="emitChange">
          <span>显示试驾预约</span>
        </label>
        <label class="filter-checkbox">
          <input type="checkbox" v-model="filterOptions.showViewCar" @change="emitChange">
          <span>显示看车预约</span>
        </label>
      </div>
    </div>
    
    <div class="filter-row">
      <div class="filter-label">排序</div>
      <div class="filter-content">
        <select v-model="sortOptionValue" class="sort-select" @change="emitChange">
          <option value="id-desc">ID (从高到低)</option>
          <option value="id-asc">ID (从低到高)</option>
          <option value="appointmentTime-desc">预约时间 (从新到旧)</option>
          <option value="appointmentTime-asc">预约时间 (从旧到新)</option>
          <option value="createTime-desc">创建时间 (从新到旧)</option>
          <option value="createTime-asc">创建时间 (从旧到新)</option>
        </select>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, defineProps, defineEmits } from 'vue';

const props = defineProps({
  filters: {
    type: Object,
    default: () => ({
      showActive: true,
      showTestDrive: true,
      showViewCar: true
    })
  },
  sortOption: {
    type: String,
    default: 'createTime-desc'
  }
});

const emit = defineEmits(['update:filters', 'update:sortOption', 'change']);

// 创建本地响应式数据，与props同步
const filterOptions = ref({...props.filters});
const sortOptionValue = ref(props.sortOption);

// 监听props变化，更新本地数据
watch(() => props.filters, (newVal) => {
  filterOptions.value = {...newVal};
}, { deep: true });

watch(() => props.sortOption, (newVal) => {
  sortOptionValue.value = newVal;
});

// 当本地数据变化时，向父组件发送更新事件
const emitChange = () => {
  emit('update:filters', {...filterOptions.value});
  emit('update:sortOption', sortOptionValue.value);
  emit('change');
};
</script>

<style scoped>
.filter-panel {
  background-color: #ffffff;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  padding: 16px;
  margin-bottom: 20px;
  width: 100%;
  max-width: 900px;
  margin-left: auto;
  margin-right: auto;
}

:root[data-theme="dark"] .filter-panel {
  background-color: #2c2c2c;
  box-shadow: 0 2px 8px rgba(255, 215, 0, 0.1);
}

.filter-row {
  display: flex;
  align-items: center;
  margin-bottom: 16px;
}

.filter-row:last-child {
  margin-bottom: 0;
}

.filter-label {
  font-size: 16px;
  font-weight: 600;
  color: #333333;
  width: 80px;
  flex-shrink: 0;
}

:root[data-theme="dark"] .filter-label {
  color: #ffffff;
}

.filter-content {
  flex: 1;
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}

.filter-checkbox {
  display: flex;
  align-items: center;
  cursor: pointer;
  margin-right: 16px;
  color: #333333;
}

:root[data-theme="dark"] .filter-checkbox {
  color: #e0e0e0;
}

.filter-checkbox input {
  margin-right: 8px;
}

.sort-select {
  padding: 8px 12px;
  border-radius: 4px;
  border: 1px solid #ddd;
  background-color: #fff;
  color: #333;
  font-size: 14px;
  min-width: 200px;
}

:root[data-theme="dark"] .sort-select {
  background-color: #333;
  color: #e0e0e0;
  border-color: #444;
}

@media (max-width: 768px) {
  .filter-row {
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
  }
  
  .filter-label {
    width: 100%;
    margin-bottom: 8px;
  }
  
  .filter-content {
    width: 100%;
  }
  
  .sort-select {
    width: 100%;
  }
}
</style> 