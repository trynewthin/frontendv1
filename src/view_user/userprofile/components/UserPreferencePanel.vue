<template>
  <div class="user-preference-container">
    <base-panel title="偏好设置" class="preference-panel">
      <div v-if="loading" class="loading-container">
        <div class="loading-spinner"></div>
        <p>加载中...</p>
      </div>
      
      <div v-else-if="error" class="error-container">
        <span class="error-icon">⚠️</span>
        <p>{{ error }}</p>
        <button class="btn btn-primary" @click="fetchUserPreference">重试</button>
      </div>
      
      <div v-else class="preference-content">
        <div class="preference-info-layout">
          <!-- 价格区间 -->
          <div class="preference-item">
            <strong>价格区间：</strong>
            <span v-if="hasPreference('price')">
              {{ formatPrice(preference.priceMin) }} - {{ formatPrice(preference.priceMax) }}
            </span>
            <span v-else class="no-preference">未设置</span>
          </div>
          
          <!-- 偏好品牌 -->
          <div class="preference-item">
            <strong>偏好品牌：</strong>
            <span v-if="hasPreference('brands')">
              {{ formatBrands(preference.preferredBrands) }}
            </span>
            <span v-else class="no-preference">未设置</span>
          </div>
          
          <!-- 偏好车型类别 -->
          <div class="preference-item">
            <strong>偏好车型：</strong>
            <span v-if="hasPreference('categories')">
              {{ formatCategories(preference.preferredCategories) }}
            </span>
            <span v-else class="no-preference">未设置</span>
          </div>
          
          <!-- 其他偏好 -->
          <div class="preference-item">
            <strong>其他偏好：</strong>
            <span v-if="hasPreference('other')">{{ preference.otherPreferences }}</span>
            <span v-else class="no-preference">未设置</span>
          </div>
        </div>
      </div>
      
      <!-- 操作按钮 -->
      <template #footer>
        <button class="btn btn-primary" @click="openEditPreference">
          修改偏好
        </button>
      </template>
    </base-panel>
    
    <!-- 编辑偏好弹窗 -->
    <UserEditPreference 
      v-model="showEditPreferenceModal"
      @success="handlePreferenceUpdateSuccess" 
    />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import preferenceService from '@/api/preferenceService';
import UserEditPreference from './UserEditPreference.vue';
import { CAR_BRANDS, CAR_CATEGORIES } from '@/constants/carEnums';
import BasePanel from '@/components/card/BasePanel.vue';

// 用户偏好状态变量
const preference = ref({});
const loading = ref(true);
const error = ref('');

// 弹窗状态
const showEditPreferenceModal = ref(false);

// 打开编辑偏好弹窗
const openEditPreference = () => {
  console.log('打开编辑偏好弹窗');
  showEditPreferenceModal.value = true;
};

// 处理偏好更新成功
const handlePreferenceUpdateSuccess = () => {
  fetchUserPreference();
};

// 获取用户偏好
const fetchUserPreference = async () => {
  loading.value = true;
  error.value = '';
  
  try {
    const result = await preferenceService.getUserPreference();
    
    if (result.success) {
      preference.value = result.data || {};
    } else {
      error.value = result.message || '获取用户偏好失败';
    }
  } catch (err) {
    console.error('获取用户偏好出错:', err);
    error.value = '获取用户偏好时发生错误';
  } finally {
    loading.value = false;
  }
};

// 检查是否有特定偏好
const hasPreference = (type) => {
  if (!preference.value) return false;
  
  switch (type) {
    case 'price':
      return preference.value.priceMin != null && 
             preference.value.priceMax != null;
    case 'brands':
      return preference.value.preferredBrands && 
             preference.value.preferredBrands.trim() !== '';
    case 'categories':
      return preference.value.preferredCategories && 
             preference.value.preferredCategories.trim() !== '';
    case 'other':
      return preference.value.otherPreferences && 
             preference.value.otherPreferences.trim() !== '';
    default:
      return false;
  }
};

// 格式化价格
const formatPrice = (price) => {
  if (price === undefined || price === null) return '不限';
  return `￥${price.toLocaleString('zh-CN')}`;
};

// 格式化品牌
const formatBrands = (brandsStr) => {
  if (!brandsStr) return '';
  
  const brandValues = brandsStr.split(',');
  const brandMap = Object.fromEntries(CAR_BRANDS.map(b => [b.value, b.label]));
  
  return brandValues
    .map(value => brandMap[value] || value)
    .join('、');
};

// 格式化车型类别
const formatCategories = (categoriesStr) => {
  if (!categoriesStr) return '';
  
  const categoryValues = categoriesStr.split(',');
  const categoryMap = Object.fromEntries(CAR_CATEGORIES.map(c => [c.value, c.label]));
  
  return categoryValues
    .map(value => categoryMap[value] || value)
    .join('、');
};

// 组件挂载时获取用户偏好
onMounted(() => {
  fetchUserPreference();
});
</script>

<style scoped>
.user-preference-container {
  position: relative;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
  width: 100%;
  height: 100%;
}

.preference-panel {
  width: 100%;
  height: 100%;
  min-height: 320px;
}

.loading-container,
.error-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 1.5rem;
  gap: 0.75rem;
  text-align: center;
  height: 100%;
}

.loading-spinner {
  width: 30px;
  height: 30px;
  border: 3px solid var(--spinner-color, #f3f3f3);
  border-top: 3px solid var(--primary-color, #000000);
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.error-icon {
  font-size: 1.5rem;
}

.preference-content {
  display: flex;
  flex-direction: column;
  height: 100%;
  padding: 1rem 0;
}

.preference-info-layout {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  background-color: var(--item-bg-color, #f9f9f9);
  border-radius: 6px;
  padding: 1rem;
  border: 1px solid var(--item-border-color, #eee);
  flex: 1;
}

.preference-item {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  text-align: left;
  padding: 0.5rem 0;
  border-bottom: 1px dashed var(--item-border-color, #eee);
}

/* 最后一个项目不需要下边框 */
.preference-item:last-child {
  border-bottom: none;
}

.preference-item strong {
  color: var(--secondary-text-color, #777);
  font-weight: 500;
}

.no-preference {
  color: var(--secondary-text-color, #777);
  font-style: italic;
}

/* 按钮样式 */
.btn {
  background: none;
  border: none;
  font-size: 0.85rem;
  font-weight: 500;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-primary {
  background-color: var(--btn-primary-bg, #000000);
  color: var(--btn-primary-text, #ffffff);
  border: 1px solid transparent;
}

.btn-primary:hover {
  opacity: 0.9;
}

/* 深色模式按钮样式 */
:root[data-theme="dark"] .btn-primary {
  background-color: var(--btn-primary-bg, #ffffff);
  color: var(--btn-primary-text, #000000);
}

/* 深色模式适配 */
:root[data-theme="dark"] .preference-info-layout {
  background-color: var(--item-bg-color, #2a2a2a);
  border-color: var(--item-border-color, #444444);
}

:root[data-theme="dark"] .preference-item {
  border-bottom-color: var(--border-color, #333333);
}

/* 响应式布局 */
@media (min-width: 768px) {
  .preference-item {
    flex-direction: row;
    align-items: center;
    gap: 0.5rem;
  }
  
  .preference-item strong {
    min-width: 100px;
  }
}

@media (max-width: 767px) {
  .preference-item {
    padding: 0.75rem 0;
  }
}
</style> 