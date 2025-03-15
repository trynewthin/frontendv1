<template>
  <ModalDialog
    :modelValue="modelValue"
    @update:modelValue="$emit('update:modelValue', $event)"
    :title="modalTitle"
    confirm-text="保存偏好"
    cancel-text="取消"
    :loading="submitting"
    @confirm="handleSave"
    class="centered-modal"
  >
    <div class="edit-preference-modal">
      <div v-if="loading" class="loading-container">
        <va-progress-circle indeterminate color="primary" />
        <p>加载中...</p>
      </div>
      
      <div v-else-if="error" class="error-container">
        <va-icon name="warning" color="danger" />
        <p>{{ error }}</p>
        <va-button @click="fetchUserPreference">重试</va-button>
      </div>
      
      <div v-else class="form-container">
        <va-form ref="form" @submit.prevent="submitForm">
          <!-- 价格区间 - 修改单位为万元 -->
          <div class="price-range mb-4">
            <p class="form-section-label">价格区间（万元）</p>
            <div class="price-inputs">
              <va-input
                v-model="formData.priceMin"
                label="最低价格"
                type="number"
                class="price-input"
                :rules="[
                  value => !value || value >= 0 || '价格不能为负数',
                  value => !value || !formData.priceMax || parseFloat(value) <= parseFloat(formData.priceMax) || '最低价格不能高于最高价格'
                ]"
              >
                <template #append>
                  <span class="unit-label">万</span>
                </template>
              </va-input>
              <span class="price-separator">至</span>
              <va-input
                v-model="formData.priceMax"
                label="最高价格"
                type="number"
                class="price-input"
                :rules="[
                  value => !value || value >= 0 || '价格不能为负数',
                  value => !value || !formData.priceMin || parseFloat(value) >= parseFloat(formData.priceMin) || '最高价格不能低于最低价格'
                ]"
              >
                <template #append>
                  <span class="unit-label">万</span>
                </template>
              </va-input>
            </div>
          </div>
          
          <!-- 偏好品牌 - 可折叠 -->
          <div class="collapsible-section mb-4">
            <div class="collapsible-header" @click="toggleBrandsCollapse">
              <p class="form-section-label">偏好品牌</p>
              <div class="collapse-icon">
                <va-icon :name="brandsCollapsed ? 'expand_more' : 'expand_less'" />
              </div>
            </div>
            <div class="collapsible-content" :class="{'collapsed': brandsCollapsed}">
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
          </div>
          
          <!-- 偏好车型类别 - 可折叠 -->
          <div class="collapsible-section mb-4">
            <div class="collapsible-header" @click="toggleCategoriesCollapse">
              <p class="form-section-label">偏好车型</p>
              <div class="collapse-icon">
                <va-icon :name="categoriesCollapsed ? 'expand_more' : 'expand_less'" />
              </div>
            </div>
            <div class="collapsible-content" :class="{'collapsed': categoriesCollapsed}">
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
          </div>
          
          <!-- 其他偏好 -->
          <div class="full-width-input mb-4">
            <va-textarea
              v-model="formData.otherPreferences"
              label="其他偏好"
              rows="3"
              placeholder="请描述您的其他购车偏好，如颜色、配置等"
              :rules="[
                value => !value || value.length <= 500 || '其他偏好不能超过500个字符'
              ]"
            />
          </div>
        </va-form>
      </div>
    </div>
  </ModalDialog>
</template>

<script setup>
import { ref, reactive, onMounted, computed, defineProps, defineEmits, watch } from 'vue';
import preferenceService from '@/api/preferenceService';
import { CAR_BRANDS, CAR_CATEGORIES } from '@/constants/carEnums';
import ModalDialog from '@/components/modelwindow/ModalDialog.vue';

const props = defineProps({
  // 是否显示对话框
  modelValue: {
    type: Boolean,
    default: false
  }
});

// 状态变量
const loading = ref(false);
const submitting = ref(false);
const error = ref('');
const form = ref(null);

// 折叠面板状态
const brandsCollapsed = ref(false);
const categoriesCollapsed = ref(false);

// 折叠面板切换函数
const toggleBrandsCollapse = () => {
  brandsCollapsed.value = !brandsCollapsed.value;
};

const toggleCategoriesCollapse = () => {
  categoriesCollapsed.value = !categoriesCollapsed.value;
};

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

// 计算标题
const modalTitle = computed(() => '编辑购车偏好');

// 事件
const emit = defineEmits(['update:modelValue', 'success']);

// 监听modelValue变化
watch(() => props.modelValue, (newValue) => {
  if (newValue) {
    // 打开弹窗时获取用户偏好
    fetchUserPreference();
  }
});

// 处理关闭
const handleClose = () => {
  emit('update:modelValue', false);
};

// 更新选中的品牌数组
const updateSelectedBrands = () => {
  selectedBrands.value = Object.keys(brandSelection).filter(key => brandSelection[key]);
};

// 更新选中的车型数组
const updateSelectedCategories = () => {
  selectedCategories.value = Object.keys(categorySelection).filter(key => categorySelection[key]);
};

// 价格单位转换 - 元到万元
const yuanToWan = (yuan) => {
  if (yuan === undefined || yuan === null || yuan === '') return '';
  return (yuan / 10000).toFixed(2); // 转换为万元并保留两位小数
};

// 价格单位转换 - 万元到元
const wanToYuan = (wan) => {
  if (!wan) return null;
  return Math.round(parseFloat(wan) * 10000); // 转换为元并四舍五入到整数
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
      
      // 价格区间 - 从元转为万元显示
      formData.priceMin = preference.priceMin !== undefined ? yuanToWan(preference.priceMin) : '';
      formData.priceMax = preference.priceMax !== undefined ? yuanToWan(preference.priceMax) : '';
      
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
    // 准备提交数据 - 将万元转换为元
    const preferenceData = {
      priceMin: formData.priceMin === '' ? null : wanToYuan(formData.priceMin),
      priceMax: formData.priceMax === '' ? null : wanToYuan(formData.priceMax),
      preferredBrands: selectedBrands.value.join(','),
      preferredCategories: selectedCategories.value.join(','),
      otherPreferences: formData.otherPreferences
    };
    
    console.log('提交的数据:', preferenceData);
    
    // 调用API更新偏好
    const result = await preferenceService.updateUserPreference(preferenceData);
    
    if (result.success) {
      // 成功后触发success事件，并关闭弹窗
      emit('success');
      emit('update:modelValue', false);
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

// 处理保存按钮点击
const handleSave = async () => {
  await submitForm();
};

// 组件挂载时不再自动获取用户偏好，改为通过watch modelValue来触发
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
  padding: 2rem;
  gap: 1rem;
  text-align: center;
  width: 100%;
}

.form-container {
  padding: 0.5rem;
  width: 100%;
  max-width: 500px;
  margin: 0 auto;
  display: flex;
  justify-content: center;
  align-items: center;
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

/* 单位标签样式 */
.unit-label {
  padding: 0 8px;
  color: var(--secondary-text-color, #777);
}

/* 可折叠部分样式 */
.collapsible-section {
  width: 100%;
  border: 1px solid var(--item-border-color, #eee);
  border-radius: 6px;
  overflow: hidden;
}

.collapsible-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem 1rem;
  background-color: var(--item-bg-color, #f9f9f9);
  cursor: pointer;
  transition: background-color 0.2s;
}

.collapsible-header:hover {
  background-color: var(--item-hover-bg-color, #f0f0f0);
}

.collapsible-header p {
  margin: 0;
}

.collapse-icon {
  display: flex;
  align-items: center;
  justify-content: center;
}

.collapsible-content {
  max-height: 300px;
  overflow-y: auto;
  transition: max-height 0.3s ease-in-out;
}

.collapsible-content.collapsed {
  max-height: 0;
  overflow: hidden;
}

.checkbox-group {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  padding: 0.75rem;
  background-color: #fff;
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

.mb-4 {
  margin-bottom: 1.5rem;
}

/* 确保表单内容在模态框中居中 */
:deep(.va-form) {
  width: 100%;
}

/* 全宽输入框样式 */
.full-width-input {
  width: 100%;
}

:deep(.full-width-input .va-textarea) {
  width: 100%;
}

:deep(.full-width-input .va-input__container) {
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

/* 使用与其他组件一致的CSS变量 */
:root {
  --secondary-text-color: #777777;
  --item-bg-color: #f9f9f9;
  --item-hover-bg-color: #f0f0f0;
  --item-border-color: #eeeeee;
}

/* 深色模式样式 */
:root[data-theme="dark"] {
  --secondary-text-color: #aaaaaa;
  --item-bg-color: #2a2a2a;
  --item-hover-bg-color: #333333;
  --item-border-color: #444444;
}
</style> 