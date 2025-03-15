<template>
  <ModalDialog
    :modelValue="true"
    @update:modelValue="handleClose"
    title="编辑购车偏好"
    confirm-text="保存偏好"
    cancel-text="取消"
    :loading="submitting"
    @confirm="submitForm"
    @cancel="handleClose"
    class="centered-modal"
  >
    <div class="edit-preference-modal">
      <div v-if="loading" class="loading-container">
        <div class="loading-spinner"></div>
        <p>加载中...</p>
      </div>
      
      <div v-else-if="error" class="error-container">
        <span class="error-icon">⚠️</span>
        <p>{{ error }}</p>
        <button class="btn btn-primary" @click="fetchUserPreference">重试</button>
      </div>
      
      <div v-else class="form-container">
        <va-form ref="form" @submit.prevent="submitForm">
          <!-- 价格区间 -->
          <div class="price-range mb-4">
            <p class="form-section-label">价格区间（元）</p>
            <div class="price-inputs">
              <va-input
                v-model="formData.priceMin"
                label="最低价格"
                type="number"
                class="price-input"
                :rules="[
                  value => !value || value >= 0 || '价格不能为负数',
                  value => !value || !formData.priceMax || parseInt(value) <= parseInt(formData.priceMax) || '最低价格不能高于最高价格'
                ]"
              />
              <span class="price-separator">至</span>
              <va-input
                v-model="formData.priceMax"
                label="最高价格"
                type="number"
                class="price-input"
                :rules="[
                  value => !value || value >= 0 || '价格不能为负数',
                  value => !value || !formData.priceMin || parseInt(value) >= parseInt(formData.priceMin) || '最高价格不能低于最低价格'
                ]"
              />
            </div>
          </div>
          
          <!-- 偏好品牌 -->
          <div class="preferred-brands mb-4">
            <p class="form-section-label">偏好品牌</p>
            <div class="checkbox-group">
              <div
                v-for="brand in CAR_BRANDS"
                :key="brand.value"
                class="brand-checkbox-wrapper"
              >
                <va-checkbox
                  v-model="brandSelection[brand.value]"
                  :label="brand.label"
                  @update:model-value="updateSelectedBrands"
                />
              </div>
            </div>
          </div>
          
          <!-- 偏好车型类别 -->
          <div class="preferred-categories mb-4">
            <p class="form-section-label">偏好车型</p>
            <div class="checkbox-group">
              <div
                v-for="category in CAR_CATEGORIES"
                :key="category.value"
                class="category-checkbox-wrapper"
              >
                <va-checkbox
                  v-model="categorySelection[category.value]"
                  :label="category.label"
                  @update:model-value="updateSelectedCategories"
                />
              </div>
            </div>
          </div>
          
          <!-- 其他偏好 -->
          <va-textarea
            v-model="formData.otherPreferences"
            label="其他偏好"
            class="mb-4"
            rows="3"
            placeholder="请描述您的其他购车偏好，如颜色、配置等"
            :rules="[
              value => !value || value.length <= 500 || '其他偏好不能超过500个字符'
            ]"
          />
        </va-form>
      </div>
    </div>
  </ModalDialog>
</template>

<script setup>
import { ref, reactive, onMounted, computed } from 'vue';
import preferenceService from '@/api/preferenceService';
import { CAR_BRANDS, CAR_CATEGORIES } from '@/constants/carEnums';
import ModalDialog from '@/components/modelwindow/ModalDialog.vue';

// 状态变量
const loading = ref(true);
const submitting = ref(false);
const error = ref('');
const form = ref(null);

// 表单数据
const formData = reactive({
  priceMin: '',
  priceMax: '',
  otherPreferences: ''
});

// 选中的品牌和车型
const selectedBrands = ref([]);
const selectedCategories = ref([]);

// 用于跟踪每个复选框状态的对象
const brandSelection = reactive({});
const categorySelection = reactive({});

// 事件
const emit = defineEmits(['close', 'success']);

// 返回/关闭
const handleClose = () => {
  emit('close');
};

// 更新选中的品牌数组
const updateSelectedBrands = () => {
  selectedBrands.value = Object.keys(brandSelection).filter(key => brandSelection[key]);
};

// 更新选中的车型数组
const updateSelectedCategories = () => {
  selectedCategories.value = Object.keys(categorySelection).filter(key => categorySelection[key]);
};

// 获取用户偏好
const fetchUserPreference = async () => {
  loading.value = true;
  error.value = '';
  
  try {
    const result = await preferenceService.getUserPreference();
    
    if (result.success) {
      // 填充表单数据
      const preference = result.data;
      
      // 价格区间
      formData.priceMin = preference.priceMin !== undefined ? preference.priceMin : '';
      formData.priceMax = preference.priceMax !== undefined ? preference.priceMax : '';
      
      // 其他偏好
      formData.otherPreferences = preference.otherPreferences || '';
      
      // 偏好品牌
      if (preference.preferredBrands) {
        const brandArray = preference.preferredBrands.split(',');
        selectedBrands.value = brandArray;
        
        // 初始化复选框状态
        CAR_BRANDS.forEach(brand => {
          brandSelection[brand.value] = brandArray.includes(brand.value);
        });
      } else {
        selectedBrands.value = [];
        CAR_BRANDS.forEach(brand => {
          brandSelection[brand.value] = false;
        });
      }
      
      // 偏好车型
      if (preference.preferredCategories) {
        const categoryArray = preference.preferredCategories.split(',');
        selectedCategories.value = categoryArray;
        
        // 初始化复选框状态
        CAR_CATEGORIES.forEach(category => {
          categorySelection[category.value] = categoryArray.includes(category.value);
        });
      } else {
        selectedCategories.value = [];
        CAR_CATEGORIES.forEach(category => {
          categorySelection[category.value] = false;
        });
      }
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

// 提交表单
const submitForm = async () => {
  // 表单验证
  const isValid = await form.value.validate();
  
  if (!isValid) {
    return;
  }
  
  submitting.value = true;
  
  try {
    // 准备提交数据
    const preferenceData = {
      priceMin: formData.priceMin === '' ? null : parseInt(formData.priceMin),
      priceMax: formData.priceMax === '' ? null : parseInt(formData.priceMax),
      preferredBrands: selectedBrands.value.join(','),
      preferredCategories: selectedCategories.value.join(','),
      otherPreferences: formData.otherPreferences
    };
    
    // 调用API更新偏好
    const result = await preferenceService.updateUserPreference(preferenceData);
    
    if (result.success) {
      // 成功后直接触发success事件，父组件会关闭弹窗
      emit('success');
    } else {
      error.value = result.message || '更新偏好失败';
    }
  } catch (err) {
    console.error('更新偏好出错:', err);
    error.value = '更新偏好时发生错误';
  } finally {
    submitting.value = false;
  }
};

// 组件挂载时加载用户偏好
onMounted(() => {
  fetchUserPreference();
});
</script>

<style scoped>
.edit-preference-modal {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
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
  width: 100%;
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

.form-container {
  padding: 0.5rem;
  width: 100%;
  max-width: 500px;
  margin: 0 auto;
}

.form-section-label {
  font-weight: 500;
  color: var(--secondary-text-color, #777);
  margin-bottom: 0.5rem;
}

.price-range {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.price-inputs {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  flex-wrap: wrap;
}

.price-input {
  flex: 1;
  min-width: 120px;
}

.price-separator {
  font-weight: 500;
  color: var(--secondary-text-color, #777);
}

.checkbox-group {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  padding: 0.5rem;
  background-color: var(--item-bg-color, #f9f9f9);
  border-radius: 6px;
  border: 1px solid var(--item-border-color, #eee);
}

.brand-checkbox-wrapper,
.category-checkbox-wrapper {
  flex: 0 0 auto;
  min-width: 150px;
  padding: 0.5rem;
  border-radius: 4px;
  transition: background-color 0.2s;
}

.brand-checkbox-wrapper:hover,
.category-checkbox-wrapper:hover {
  background-color: var(--item-hover-bg-color, #f0f0f0);
}

.btn {
  background: none;
  border: none;
  font-size: 0.85rem;
  font-weight: 500;
  padding: 0.5rem 0.75rem;
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

.mb-4 {
  margin-bottom: 1.5rem;
}

/* 居中模态框样式 */
:deep(.centered-modal) {
  display: flex;
  align-items: center;
  justify-content: center;
}

:deep(.centered-modal .modal-content) {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  max-height: 90vh;
}

:deep(.centered-modal .modal-body) {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
}

:deep(.centered-modal .modal-wrapper) {
  display: flex;
  justify-content: center;
  align-items: center;
}

:deep(.centered-modal .modal-footer) {
  width: 100%;
  display: flex;
  justify-content: center;
}

/* 确保表单内容在模态框中居中 */
:deep(.va-form) {
  width: 100%;
}

@media (max-width: 768px) {
  .price-inputs {
    flex-direction: column;
    align-items: stretch;
  }
  
  .price-separator {
    align-self: center;
  }
}

/* 使用与其他组件一致的CSS变量 */
:root {
  --secondary-text-color: #777777;
  --spinner-color: #f3f3f3;
  --primary-color: #000000;
  --item-bg-color: #f9f9f9;
  --item-hover-bg-color: #f0f0f0;
  --item-border-color: #eeeeee;
  --btn-primary-bg: #000000;
  --btn-primary-text: #ffffff;
}

/* 深色模式样式 */
html[data-theme="dark"],
:root[data-theme="dark"] {
  --secondary-text-color: #aaaaaa;
  --spinner-color: #333333;
  --primary-color: #ffffff;
  --item-bg-color: #2a2a2a;
  --item-hover-bg-color: #333333;
  --item-border-color: #444444;
  --btn-primary-bg: #ffffff;
  --btn-primary-text: #000000;
}
</style> 