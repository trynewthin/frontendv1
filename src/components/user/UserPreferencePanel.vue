<template>
  <div class="preference-panel-container">
    <va-card class="user-preference-panel">
      <va-card-title class="panel-title">购车偏好</va-card-title>
      
      <va-card-content class="panel-content">
        <div v-if="loading" class="loading-container">
          <va-progress-circle indeterminate color="primary" />
          <p>加载中...</p>
        </div>
        
        <div v-else-if="error" class="error-container">
          <va-icon name="warning" color="danger" />
          <p>{{ error }}</p>
          <va-button @click="fetchUserPreference">重试</va-button>
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
          
          <!-- 操作按钮 -->
          <div class="action-buttons">
            <va-button preset="primary" @click="openEditPreference" size="small">
              修改偏好
            </va-button>
          </div>
        </div>
      </va-card-content>
    </va-card>
    
    <!-- 编辑偏好弹窗 -->
    <va-modal v-model="showEditPreferenceModal" hide-default-actions size="large" class="edit-preference-modal">
      <UserEditPreference 
        @close="closeEditPreference" 
        @success="handlePreferenceUpdateSuccess" 
      />
    </va-modal>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import preferenceService from '../../api/preferenceService';
import UserEditPreference from './UserEditPreference.vue';
import { CAR_BRANDS, CAR_CATEGORIES } from '../../constants/carEnums';

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

// 关闭编辑偏好弹窗
const closeEditPreference = () => {
  showEditPreferenceModal.value = false;
};

// 处理偏好更新成功
const handlePreferenceUpdateSuccess = () => {
  closeEditPreference();
  fetchUserPreference();
};

// 获取用户偏好
const fetchUserPreference = async () => {
  loading.value = true;
  error.value = '';
  
  try {
    const result = await preferenceService.getUserPreference();
    
    if (result.success) {
      preference.value = result.data;
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
      return preference.value.priceMin !== undefined && 
             preference.value.priceMax !== undefined;
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
.preference-panel-container {
  position: relative;
}

.user-preference-panel {
  width: auto;
  height: auto;
  max-width: 500px; /* 限制最大宽度 */
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  margin: 0;
}

.panel-title {
  font-size: 1.25rem;
  font-weight: 600;
  padding: 16px 24px;
  border-bottom: 1px solid var(--va-gray-2);
}

.panel-content {
  padding: 24px;
}

.loading-container, 
.error-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  gap: 1rem;
}

.preference-content {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.preference-info-layout {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.preference-item {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.preference-item strong {
  color: var(--va-gray-4);
  font-weight: 500;
}

.no-preference {
  color: var(--va-gray-3);
  font-style: italic;
}

.action-buttons {
  display: flex;
  justify-content: flex-start;
  gap: 12px;
  margin-top: 16px;
}

@media (min-width: 768px) {
  .preference-item {
    flex-direction: row;
    align-items: center;
    gap: 8px;
  }
  
  .preference-item strong {
    min-width: 100px;
  }
}
</style> 