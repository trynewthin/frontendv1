<template>
  <div class="user-panel-container user-preference-panel">
    <div class="card user-preference-panel">
      <div class="card-content">
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
          
          <!-- 操作按钮 -->
          <div class="action-buttons">
            <button class="btn btn-primary" @click="openEditPreference">
              修改偏好
            </button>
          </div>
        </div>
      </div>
    </div>
    
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
.user-panel-container {
  position: relative;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
  width: 100%;
  min-height: 320px; /* 设置最小高度确保内容显示 */
  display: flex;
  flex-direction: column;
}

.card {
  background-color: var(--card-bg-color, #ffffff);
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
  overflow: hidden;
  transition: all 0.3s ease;
  width: 100%;
  height: 100%; /* 让卡片填满容器高度 */
  border: 1px solid var(--card-border-color, #eaeaea);
  color: var(--text-color, #333333);
  display: flex;
  flex-direction: column;
}

.card-content {
  padding: 1.25rem;
  display: flex;
  flex-direction: column;
  flex: 1; /* 让内容区域填满卡片 */
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
  gap: 1rem;
  position: relative;
  flex: 1; /* 让内容区域填满空间 */
  min-height: 210px; /* 设置内容区域最小高度 */
}

.preference-info-layout {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  background-color: var(--item-bg-color, #f9f9f9);
  border-radius: 6px;
  padding: 1rem;
  border: 1px solid var(--item-border-color, #eee);
  margin-bottom: 1rem;
  flex: 1; /* 让信息区域填满可用空间 */
  min-height: 180px; /* 设置适当的最小高度 */
}

.preference-item {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  text-align: left;
  padding: 0.5rem 0; /* 增加垂直内边距 */
  border-bottom: 1px dashed var(--item-border-color, #eee); /* 添加虚线分隔符 */
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

.action-buttons {
  display: flex;
  justify-content: flex-end;
  gap: 0.75rem;
  position: absolute; /* 使用绝对定位 */
  bottom: 0.75rem; /* 固定在底部 */
  right: 1.25rem; /* 固定在右侧 */
  padding: 0;
}

.btn {
  background: none;
  border: none;
  font-size: 0.85rem;
  font-weight: 500;
  padding: 0.5rem 1rem; /* 增加水平内边距 */
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1); /* 添加轻微阴影 */
}

.btn-primary {
  background-color: var(--btn-primary-bg, #000000);
  color: var(--btn-primary-text, #ffffff);
  border: 1px solid transparent;
}

.btn-primary:hover {
  opacity: 0.9;
}

.btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* 深色模式变量 - 默认浅色主题 */
:root {
  /* 卡片基础样式 */
  --card-bg-color: #ffffff;
  --card-border-color: #eaeaea;
  --text-color: #333333;
  --secondary-text-color: #777777;
  --border-color: #f0f0f0;
  --spinner-color: #f3f3f3;
  --primary-color: #000000;
  
  /* 列表项样式 */
  --item-bg-color: #f9f9f9;
  --item-hover-bg-color: #f0f0f0;
  --item-border-color: #eeeeee;
  
  /* 按钮 */
  --btn-primary-bg: #000000;
  --btn-primary-text: #ffffff;
}

/* 深色模式样式 */
html[data-theme="dark"] .card,
:root[data-theme="dark"] .card {
  /* 卡片基础样式 */
  --card-bg-color: #1f1f1f;
  --card-border-color: #333333;
  --text-color: #e0e0e0;
  --secondary-text-color: #aaaaaa;
  --border-color: #333333;
  --spinner-color: #333333;
  --primary-color: #ffffff;
  
  /* 列表项样式 */
  --item-bg-color: #2a2a2a;
  --item-hover-bg-color: #333333;
  --item-border-color: #444444;
  
  /* 按钮 */
  --btn-primary-bg: #ffffff;
  --btn-primary-text: #000000;
}

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

/* 小屏幕调整 */
@media (max-width: 767px) {
  .user-panel-container {
    min-height: 360px; /* 小屏幕上增加最小高度 */
  }
  
  .preference-info-layout {
    min-height: 220px; /* 小屏幕上增加信息区域最小高度 */
  }
  
  .preference-item {
    padding: 0.75rem 0; /* 增加垂直间距使触摸更容易 */
  }
  
  .action-buttons {
    width: 100%; /* 按钮容器宽度填满 */
    justify-content: center; /* 按钮居中 */
    bottom: 0.5rem; /* 调整底部位置 */
    right: 0; /* 重置右侧位置 */
  }
  
  .btn {
    padding: 0.6rem 1.2rem; /* 增大按钮尺寸更易触摸 */
  }
}

/* 暗色模式增强 */
:root[data-theme="dark"] .preference-item {
  border-bottom-color: var(--border-color, #333333);
}
</style> 