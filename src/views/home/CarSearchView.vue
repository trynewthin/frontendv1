<template>
  <div class="car-search-view">
    <!-- 1. 检索面板 -->
    <div class="search-header">
      <HomeButton class="back-home-btn" />
      <h1 class="search-title">车辆综合检索</h1>
    </div>
    <div class="search-filters">
      <!-- 搜索过滤器 - 使用网格布局避免元素重叠 -->
      <div class="filters-grid">
        <!-- 品牌搜索 -->
        <div class="filter-item">
          <label class="filter-label">品牌</label>
          <va-select
            v-model="filters.brand"
            placeholder="不限"
            @update:modelValue="handleSearch"
            :options="brandOptions"
            text-by="label"
            value-by="value"
          />
        </div>

        <!-- 类别筛选 -->
        <div class="filter-item">
          <label class="filter-label">车型类别</label>
          <va-select
            v-model="filters.category"
            placeholder="不限"
            @update:modelValue="handleSearch"
            :options="categoryOptions"
            text-by="label"
            value-by="value"
          />
        </div>

        <!-- 价格区间 -->
        <div class="filter-item">
          <label class="filter-label">价格区间</label>
          <div class="price-range">
            <va-input
              v-model="filters.minPrice"
              type="number"
              :min="0"
              :step="1"
              placeholder="最低价格"
              @update:modelValue="handleSearch"
            />
            <span class="separator">-</span>
            <va-input
              v-model="filters.maxPrice"
              type="number"
              :min="0"
              :step="1"
              placeholder="最高价格"
              @update:modelValue="handleSearch"
            />
          </div>
        </div>

        <!-- 排序方式 -->
        <div class="filter-item">
          <label class="filter-label">排序方式</label>
          <va-select
            v-model="filters.sort"
            placeholder="默认排序"
            :options="sortOptions"
            text-by="label"
            value-by="value"
            @update:modelValue="handleSearch"
          />
        </div>
      </div>
    </div>

    <!-- 2. 显示面板 -->
    <div class="car-list">
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

        <!-- 3. 分页显示组件 -->
        <div class="pagination-container" v-if="total > 0">
          <div class="pagination-wrapper">
            <va-pagination
              v-model="currentPage"
              :model-value="currentPage"
              :pages="Math.ceil(total / pageSize)"
              :total="total"
              :visible-pages="6"
              :boundary-links="false"
              :limit="6"
              @update:modelValue="handleCurrentChange"
            />
            <va-select
              v-model="pageSize"
              class="page-size-select"
              @update:modelValue="handleSizeChange"
              :options="pageSizeOptions"
              text-by="label"
              value-by="value"
            />
          </div>
        </div>
      </va-inner-loading>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, computed, watch } from 'vue';
import { useToast } from 'vuestic-ui';
import { useRouter } from 'vue-router';
import CarCard from '@/components/car/CarCard.vue';
import HomeButton from '@/views/commons/HomeButton.vue';
import carService from '@/api/carService';
// 直接导入默认导出
import carEnums from '@/constants/carEnums';

const { init: initToast } = useToast();
const router = useRouter();

// 解构出需要的枚举
const { 
  CAR_CATEGORIES, 
  CAR_BRANDS, 
  CAR_SORT_FIELDS, 
  SORT_DIRECTIONS 
} = carEnums;

// 状态数据
const cars = ref([]);
const loading = ref(false);
const currentPage = ref(1);
const pageSize = ref(12);
const total = ref(0);

// 筛选条件 - 设置默认值为空字符串，表示"不限"
const filters = reactive({
  brand: '不限',  // 默认显示"不限"
  category: '不限', // 默认显示"不限"
  minPrice: null,
  maxPrice: null,
  sort: '默认排序'  // 默认显示"默认排序"
});

// 添加默认选项到品牌列表
const brandOptions = computed(() => {
  return [
    { label: '不限', value: '不限' },  // 修改value为"不限"而不是空字符串
    ...CAR_BRANDS
  ];
});

// 添加默认选项到类别列表
const categoryOptions = computed(() => {
  return [
    { label: '不限', value: '不限' },  // 修改value为"不限"而不是空字符串
    ...CAR_CATEGORIES
  ];
});

// 计算排序选项
const sortOptions = computed(() => {
  const options = [{ label: '默认排序', value: '默认排序' }];  // 修改value为"默认排序"而不是空字符串
  
  CAR_SORT_FIELDS.forEach(field => {
    SORT_DIRECTIONS.forEach(direction => {
      options.push({
        label: `${field.label}${direction.label === '升序' ? '从低到高' : '从高到低'}`,
        value: `${field.value}_${direction.value}`
      });
    });
  });
  
  return options;
});

// 页面大小选项
const pageSizeOptions = computed(() => {
  return [12, 24, 36, 48].map(size => ({
    label: `${size}条/页`,
    value: size
  }));
});

// 前端排序和筛选后的车辆列表
const displayedCars = computed(() => {
  let result = [...cars.value];
  
  // 品牌筛选（如果已设置且不是"不限"）
  if (filters.brand && filters.brand !== '不限') {
    result = result.filter(car => car.brand === filters.brand);
  }
  
  // 类别筛选（如果已设置且不是"不限"）
  if (filters.category && filters.category !== '不限') {
    result = result.filter(car => car.category === filters.category);
  }
  
  // 价格筛选（如果已设置）
  if (filters.minPrice && filters.maxPrice) {
    result = result.filter(car => 
      car.price >= filters.minPrice && car.price <= filters.maxPrice
    );
  } else if (filters.minPrice) {
    result = result.filter(car => car.price >= filters.minPrice);
  } else if (filters.maxPrice) {
    result = result.filter(car => car.price <= filters.maxPrice);
  }
  
  // 排序（如果已设置且不是"默认排序"）
  if (filters.sort && filters.sort !== '默认排序') {
    const [field, direction] = filters.sort.split('_');
    
    result.sort((a, b) => {
      // 处理空值
      if (a[field] === undefined || a[field] === null) return 1;
      if (b[field] === undefined || b[field] === null) return -1;
      
      // 根据字段类型排序
      const aValue = typeof a[field] === 'string' ? a[field].toLowerCase() : a[field];
      const bValue = typeof b[field] === 'string' ? b[field].toLowerCase() : b[field];
      
      // 升序或降序
      if (direction === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });
  }
  
  // 更新总数（反映筛选后的结果）
  total.value = result.length;
  
  // 分页
  const startIndex = (currentPage.value - 1) * pageSize.value;
  return result.slice(startIndex, startIndex + pageSize.value);
});

// 搜索车辆
const searchCars = async () => {
  loading.value = true;
  try {
    let response;
    const queryParams = {
      page: 1, // 获取所有数据，前端进行排序和分页
      size: 1000, // 设置一个较大的值以获取尽可能多的数据
    };

    // 获取所有车辆数据，然后在前端进行筛选
    response = await carService.getCars(queryParams);

    if (response.success) {
      cars.value = response.data;
      // 总数将在 displayedCars 计算属性中更新
    } else {
      initToast({
        message: response.message || '获取车辆列表失败',
        color: 'danger'
      });
    }
  } catch (error) {
    console.error('搜索车辆出错:', error);
    initToast({
      message: '搜索车辆时发生错误',
      color: 'danger'
    });
  } finally {
    loading.value = false;
  }
};

// 监听筛选条件变化
watch([
  () => filters.brand, 
  () => filters.category, 
  () => filters.minPrice, 
  () => filters.maxPrice, 
  () => filters.sort
], () => {
  // 当筛选条件变化时，不需要重新请求数据，只需要重新计算显示的车辆
  currentPage.value = 1; // 重置为第一页
});

// 事件处理函数
const handleSearch = () => {
  currentPage.value = 1;
  // 不需要重新请求数据，因为我们已经在前端进行筛选
};

const handleSizeChange = (val) => {
  pageSize.value = val;
  currentPage.value = 1; // 重置为第一页
};

const handleCurrentChange = (val) => {
  currentPage.value = val;
};

// 返回主页
const goToHome = () => {
  router.push('/');
};

// 页面加载时获取车辆列表
onMounted(() => {
  searchCars();
});
</script>

<style scoped>
.car-search-view {
  padding: 2rem;
  width: 100%;
  max-width: 100%;
  box-sizing: border-box;
}

.search-header {
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  width: 100%;
  margin-bottom: 1.5rem;
}

.search-title {
  margin-bottom: 0;
  font-size: 1.5rem;
  color: var(--va-text-color);
  text-align: center;
  flex-grow: 1;
}

.back-home-btn {
  position: absolute;
  left: 0;
}

.search-filters {
  background: var(--va-background);
  padding: 1.5rem;
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
  margin-bottom: 2rem;
  width: 100%;
  box-sizing: border-box;
  overflow: hidden;
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
}

/* 深色模式下的搜索面板样式 */
:root[data-theme="dark"] .search-filters {
  box-shadow: 0 2px 12px rgba(255, 215, 0, 0.1);
}

/* 使用网格布局避免元素重叠 */
.filters-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
  margin-bottom: 1.5rem;
  width: 100%;
  box-sizing: border-box;
}

.filter-item {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  width: 100%;
  min-width: 0;
  box-sizing: border-box;
}

.filter-label {
  font-size: 0.9rem;
  color: #333333;
  font-weight: 600;
  margin-bottom: 0.25rem;
  white-space: nowrap;
}

/* 深色模式下的标签文字颜色 */
:root[data-theme="dark"] .filter-label {
  color: #ffffff;
}

.price-range {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  width: 100%;
  flex-wrap: nowrap;
}

.price-range :deep(.va-input) {
  min-width: 0;
  flex: 1;
}

.separator {
  color: var(--va-text-color-secondary);
  flex-shrink: 0;
  padding: 0 4px;
}

.car-list {
  margin-top: 2rem;
  width: 100%;
}

.car-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 2rem;
  margin-bottom: 2rem;
  width: 100%;
}

.car-item {
  height: 100%;
}

.pagination-container {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 2rem;
  width: 100%;
}

.pagination-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-wrap: nowrap;
  gap: 1rem;
}

.page-size-select {
  width: 120px;
  flex-shrink: 0;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 3rem;
  color: var(--va-text-color-secondary);
  width: 100%;
}

.empty-icon {
  font-size: 2rem;
  color: var(--va-primary);
  margin-bottom: 1rem;
}

.empty-state p {
  margin-top: 1rem;
  font-size: 1rem;
}

/* 确保所有Vuestic组件在容器中正确缩放 */
:deep(.va-select),
:deep(.va-input) {
  width: 100%;
  max-width: 100%;
}

/* 自定义下拉箭头 */
:deep(.va-select__value)::after {
  content: "▼";
  font-size: 0.7rem;
  color: var(--va-primary);
  margin-left: 0.5rem;
}

/* 自定义选中状态 */
:deep(.va-select-option--selected) {
  background-color: var(--va-primary) !important;
  color: white !important;
}

/* 深色模式下的输入框和选择框样式 */
:root[data-theme="dark"] :deep(.va-input),
:root[data-theme="dark"] :deep(.va-select) {
  background-color: var(--va-background-secondary);
  border-color: rgba(255, 215, 0, 0.2);
}

:root[data-theme="dark"] :deep(.va-input:focus),
:root[data-theme="dark"] :deep(.va-select:focus) {
  border-color: #FFD700;
  box-shadow: 0 0 0 2px rgba(255, 215, 0, 0.1);
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
  
  .car-search-view {
    padding: 1rem;
  }

  .search-filters {
    padding: 1rem;
  }

  .filters-grid {
    grid-template-columns: 1fr;
    gap: 1rem;
  }

  .car-grid {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
  
  .price-range {
    flex-direction: column;
    align-items: stretch;
  }
  
  .separator {
    display: none;
  }
  
  .price-range :deep(.va-input:first-child)::after {
    content: "至";
    display: block;
    text-align: center;
    padding: 4px 0;
    color: var(--va-text-color-secondary);
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
  
  .search-filters {
    flex-direction: column;
    width: 100%;
  }
  
  .search-filters .va-button {
    width: 100%;
  }
}
</style> 