<template>
  <div class="car-search-view">
    <!-- 顶部安全区域 -->
    <div class="safe-area-top"></div>
    
    <!-- 添加aheader组件 -->
    <aheader title="车辆综合检索" />
    
    <!-- 1. 检索面板 -->
    <div class="search-filters">
      <!-- 将搜索框和重置按钮移到顶部 -->
      <div class="filter-actions">
        <div class="search-action-container">
          <div class="left-side">
            <input 
              type="text" 
              class="simple-search-input" 
              placeholder="搜索车辆品牌、型号、类别..." 
              v-model="searchKeyword"
              @keyup.enter="handleKeywordSearch"
            />
            <button class="simple-search-button" @click="handleKeywordSearch">
              <img src="/icons/search.svg" alt="搜索" class="search-icon" />
            </button>
          </div>
          
          <button
            class="reset-button"
            @click="resetFilters"
          >
            重置筛选
          </button>
        </div>
      </div>
      
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

    <!-- 2. 使用新的车辆显示容器组件 -->
    <div class="car-list">
      <CarDisplayContainer
        :displayedCars="displayedCars"
        :loading="loading"
        :total="total"
        :currentPage="currentPage"
        :pageSize="pageSize"
        :pageSizeOptions="pageSizeOptions"
        @update:currentPage="currentPage = $event"
        @update:pageSize="pageSize = $event"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, computed, watch } from 'vue';
import { useToast } from 'vuestic-ui';
import { useRouter, useRoute } from 'vue-router';
import aheader from '@/components/header/aheader.vue';
import carService from '@/api/carService';
import CarDisplayContainer from './components/CarDisplayContainer.vue';
// 直接导入默认导出
import carEnums from '@/constants/carEnums';
// 导入搜索服务
import { searchCars, formatCarData } from '@/services/car/carSearchService';
// 导入行为服务
import behaviorService from '@/services/behavior/behaviorService';
import LoginConfirmDialog from '@/components/modelwindow/LoginConfirmDialog.vue';

const { init: initToast } = useToast();
const router = useRouter();
const route = useRoute();

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
const searchKeyword = ref('');

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

// 使用carSearchService搜索车辆
const searchCarsWithService = async (keyword) => {
  if (!keyword) return;
  
  loading.value = true;
  try {
    const response = await searchCars(keyword, 1, 1000); // 设置较大的size以获取所有结果
    
    if (response && response.code === 200) {
      // 使用formatCarData处理返回的数据
      const formattedData = formatCarData(response.data);
      cars.value = formattedData.cars;
      total.value = formattedData.total;
      
      // 如果有品牌信息，自动设置筛选条件
      if (formattedData.cars.length > 0) {
        // 检查是否所有车辆都属于同一品牌
        const firstCarBrand = formattedData.cars[0].brand;
        const allSameBrand = formattedData.cars.every(car => car.brand === firstCarBrand);
        
        if (allSameBrand) {
          filters.brand = firstCarBrand;
        }
      }
    } else {
      initToast({
        message: (response && response.message) || '获取车辆列表失败',
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

// 搜索车辆 (使用现有的API方法作为备选)
const searchCarsWithLegacy = async () => {
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

// 监听路由变化，以获取搜索关键词
watch(
  () => route.query.keyword,
  (newVal) => {
    if (newVal) {
      searchKeyword.value = newVal;
      searchCarsWithService(newVal);
    }
  },
  { immediate: true } // 组件加载时立即执行一次
);

// 事件处理函数
const handleSearch = () => {
  currentPage.value = 1;
  // 使用 searchKeyword 进行搜索
  searchCarsWithService(searchKeyword.value);
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

// 如果没有从URL获取到关键词，则使用备选方法加载车辆列表
onMounted(() => {
  if (!route.query.keyword) {
    searchCarsWithLegacy();
  }
});

// 重置所有筛选条件并重新加载
const resetFilters = () => {
  // 重置筛选条件
  filters.brand = '不限';
  filters.category = '不限';
  filters.minPrice = null;
  filters.maxPrice = null;
  filters.sort = '默认排序';
  
  // 重置页码
  currentPage.value = 1;
  
  // 清除URL中的关键词
  if (route.query.keyword) {
    router.replace({
      path: route.path,
      query: { ...route.query, keyword: undefined }
    });
  }
  
  searchKeyword.value = '';
  
  // 重新加载数据
  searchCarsWithLegacy();
};

// 检测是否为深色模式
const isDarkMode = computed(() => {
  return document.documentElement.getAttribute('data-theme') === 'dark';
});

// 检查用户是否已登录
const isUserLoggedIn = () => {
  const token = localStorage.getItem('token');
  return !!token;
};

// 处理关键词搜索
const handleKeywordSearch = () => {
  // 确保关键词不为空
  if (!searchKeyword.value.trim()) {
    return;
  }
  
  // 检查用户是否已登录
  if (!isUserLoggedIn()) {
    // 显示登录确认对话框
    initToast({
      message: '请先登录后再进行搜索',
      color: 'warning'
    });
    return;
  }
  
  // 重置页码
  currentPage.value = 1;
  
  // 更新路由查询参数
  router.replace({
    path: route.path,
    query: { ...route.query, keyword: searchKeyword.value.trim() }
  });
  
  // 记录搜索行为
  recordSearchBehavior(searchKeyword.value.trim());
  
  // 执行搜索
  searchCarsWithService(searchKeyword.value.trim());
};

// 记录搜索行为的方法
const recordSearchBehavior = async (keyword) => {
  try {
    // 使用行为服务的自动搜索方法记录搜索行为
    console.log('尝试记录搜索行为:', keyword);
    const result = await behaviorService.autoSearch(keyword, false);
    console.log('搜索行为记录结果:', result);
    
    // 如果记录失败但不影响用户体验
    if (!result) {
      console.warn('搜索行为记录失败，但不影响用户体验');
    }
  } catch (error) {
    console.error('记录搜索行为时出错:', error);
    // 静默处理错误，不影响用户体验
  }
};
</script>

<style scoped>
.car-search-view {
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
:root[data-theme="dark"] .car-search-view {
  background-color: var(--va-background);
}

/* 检索面板样式 */
.search-filters {
  background: var(--va-background);
  padding: 1rem;
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
  margin: 0 2rem 1.5rem;
  width: auto;
  box-sizing: border-box;
  overflow: hidden;
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
}

/* 深色模式下的搜索面板样式 */
:root[data-theme="dark"] .search-filters {
  box-shadow: 0 2px 12px rgba(255, 215, 0, 0.1);
}

.car-list {
  margin: 0 2rem;
  flex: 1;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  height: calc(100% - 12rem); /* 减去顶部安全区域和检索面板的高度 */
}

/* 使用网格布局避免元素重叠 */
.filters-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1rem;
  width: 100%;
  box-sizing: border-box;
}

.filter-item {
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
  width: 100%;
  min-width: 0;
  box-sizing: border-box;
}

.filter-label {
  font-size: 0.85rem;
  color: #333333;
  font-weight: 600;
  margin-bottom: 0;
  white-space: nowrap;
}

/* 深色模式下的标签文字颜色 */
:root[data-theme="dark"] .filter-label {
  color: #ffffff;
}

.price-range {
  display: flex;
  align-items: center;
  gap: 0.35rem;
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

/* 确保分页组件在小屏幕上也保持在一行 */
@media (max-width: 768px) {
  .search-filters,
  .car-list {
    margin: 0 1rem 1rem;
  }
  
  .filters-grid {
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
  .search-filters {
    flex-direction: column;
    width: 100%;
  }
  
  .search-filters .va-button {
    width: 100%;
  }
}

/* 添加筛选操作按钮区域样式 */
.filter-actions {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 1.5rem;
  padding-bottom: 1.5rem;
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
  width: 100%;
}

.search-action-container {
  display: flex;
  align-items: center;
  max-width: 600px;
  width: 100%;
}

.left-side {
  display: flex;
  flex: 1;
  position: relative;
  margin-right: 1rem;
}

.simple-search-input {
  border: 1px solid rgba(0, 0, 0, 0.1);
  border-radius: 20px;
  height: 40px;
  padding: 0 40px 0 16px;
  width: 100%;
  font-size: 14px;
  background-color: rgba(255, 255, 255, 0.3);
  color: #333;
}

.simple-search-input:focus {
  outline: none;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  border-color: rgba(0, 0, 0, 0.2);
  background-color: rgba(255, 255, 255, 0.5);
}

.simple-search-button {
  position: absolute;
  right: 0;
  top: 0;
  width: 40px;
  height: 40px;
  border: none;
  background: transparent;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
}

.search-icon {
  width: 20px;
  height: 20px;
}

/* 深色模式样式 */
:root[data-theme="dark"] .simple-search-input {
  background-color: rgba(0, 0, 0, 0.3);
  border-color: rgba(255, 255, 255, 0.1);
  color: #fff;
}

:root[data-theme="dark"] .simple-search-input::placeholder {
  color: rgba(255, 255, 255, 0.6);
}

:root[data-theme="dark"] .simple-search-input:focus {
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
  border-color: rgba(255, 255, 255, 0.2);
  background-color: rgba(0, 0, 0, 0.5);
}

:root[data-theme="dark"] .search-icon {
  filter: invert(1) brightness(1.2);
  opacity: 0.9;
}

@media (max-width: 768px) {
  .filter-actions {
    padding-bottom: 1rem;
    margin-bottom: 1rem;
  }
  
  .search-action-container {
    flex-direction: column;
    align-items: stretch;
    gap: 1rem;
  }
  
  .left-side {
    width: 100%;
    margin-right: 0;
  }
  
  .reset-button {
    width: 100%;
  }
}

/* 深色模式下的分隔线 */
:root[data-theme="dark"] .filter-actions {
  border-bottom-color: rgba(255, 255, 255, 0.1);
}

/* 重置按钮样式 */
.reset-button {
  min-width: 120px;
  padding: 0.5rem 1rem;
  transition: all 0.3s ease;
  background-color: #212121; /* 黑底 */
  color: white; /* 白字 */
  border: 1px solid transparent;
  border-radius: 4px;
  font-family: inherit;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-left: 1rem;
}

.reset-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  opacity: 0.9;
}

/* 深色模式下的按钮样式 */
:root[data-theme="dark"] .reset-button {
  background-color: white; /* 白底 */
  color: #212121; /* 黑字 */
  border: 1px solid rgba(255, 255, 255, 0.1);
}

:root[data-theme="dark"] .reset-button:hover {
  box-shadow: 0 4px 8px rgba(255, 255, 255, 0.1);
}
</style> 