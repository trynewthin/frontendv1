<template>
  <div class="dealer-submit-form">
    <!-- 成功状态 -->
    <div v-if="success" class="success-container">
      <p>{{ successMessage }}</p>
    </div>
    
    <!-- 表单内容 -->
    <div v-else>
      <form @submit.prevent="submitDealerInfo" class="dealer-form">
        <div class="form-group">
          <label for="dealerName">经销商名称 <span class="required">*</span></label>
          <input 
            type="text" 
            id="dealerName" 
            v-model="formData.dealerName" 
            required 
            placeholder="请输入经销商名称"
            class="form-input"
          />
        </div>
        
        <div class="form-group">
          <label for="address">地址</label>
          <input 
            type="text" 
            id="address" 
            v-model="formData.address" 
            placeholder="请输入经销商地址"
            class="form-input"
          />
        </div>
        
        <div class="form-group">
          <label for="businessLicense">营业执照号</label>
          <input 
            type="text" 
            id="businessLicense" 
            v-model="formData.businessLicense" 
            placeholder="请输入营业执照号"
            class="form-input"
          />
        </div>
        
        <div class="form-group">
          <label for="contactPerson">联系人</label>
          <input 
            type="text" 
            id="contactPerson" 
            v-model="formData.contactPerson" 
            placeholder="请输入联系人姓名"
            class="form-input"
          />
        </div>
        
        <div class="form-group">
          <label for="contactPhone">联系电话</label>
          <input 
            type="text" 
            id="contactPhone" 
            v-model="formData.contactPhone" 
            placeholder="请输入联系电话"
            class="form-input"
          />
        </div>
        
        <div class="form-group">
          <label for="description">描述</label>
          <textarea 
            id="description" 
            v-model="formData.description" 
            placeholder="请输入经销商描述信息"
            class="form-textarea"
            rows="4"
          ></textarea>
        </div>
        
        <div class="error-message" v-if="error">
          {{ error }}
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, watch, defineExpose } from 'vue';
import dealerService from '@/api/dealerService';

const props = defineProps({
  // 如果有现有的经销商信息，可以传入进行编辑
  dealerInfo: {
    type: Object,
    default: null
  }
});

const emit = defineEmits(['close', 'success', 'loading', 'submit-and-review']);

const loading = ref(false);
const error = ref('');
const success = ref(false);
const successMessage = ref('');

// 监听loading状态变化，通知父组件
watch(loading, (newValue) => {
  emit('loading', newValue);
});

// 表单数据
const formData = reactive({
  dealerName: '',
  address: '',
  businessLicense: '',
  contactPerson: '',
  contactPhone: '',
  description: ''
});

// 初始化表单数据
const initFormData = () => {
  if (props.dealerInfo) {
    formData.dealerName = props.dealerInfo.dealerName || '';
    formData.address = props.dealerInfo.address || '';
    formData.businessLicense = props.dealerInfo.businessLicense || '';
    formData.contactPerson = props.dealerInfo.contactPerson || '';
    formData.contactPhone = props.dealerInfo.contactPhone || '';
    formData.description = props.dealerInfo.description || '';
  }
};

// 提交经销商信息
const submitDealerInfo = async (shouldEmitReview = false) => {
  // 验证必填字段
  if (!formData.dealerName) {
    error.value = '经销商名称不能为空';
    return false;
  }
  
  loading.value = true;
  error.value = '';
  
  try {
    const response = await dealerService.submitDealerInfo({
      dealerName: formData.dealerName,
      address: formData.address,
      businessLicense: formData.businessLicense,
      contactPerson: formData.contactPerson,
      contactPhone: formData.contactPhone,
      description: formData.description
    });
    
    if (response.success) {
      if (shouldEmitReview) {
        // 成功后触发提交并审核事件，父组件处理审核表单的打开
        emit('submit-and-review', response.data);
      } else {
        // 普通提交成功后不再设置内部success状态，直接发出成功事件并关闭
        emit('success', response.data);
        // 确保父组件能立即关闭并重置状态
        emit('loading', false);
        emit('close');
      }
      return true;
    } else {
      error.value = response.message || '提交经销商信息失败';
      return false;
    }
  } catch (err) {
    console.error('提交经销商信息出错:', err);
    error.value = err.message || '提交经销商信息时发生错误';
    return false;
  } finally {
    loading.value = false;
  }
};

// 提交并审核 - 先提交信息，成功后触发审核事件
const submitAndReview = async () => {
  const success = await submitDealerInfo(true);
  if (success) {
    // 提交成功后，父组件会处理审核表单的打开
    console.log('经销商信息提交成功，准备提交审核');
  }
};

// 重置表单状态
const resetForm = () => {
  loading.value = false;
  success.value = false;
  error.value = '';
  // 如果需要清空表单数据，可以取消注释下面的代码
  // formData.dealerName = '';
  // formData.address = '';
  // formData.businessLicense = '';
  // formData.contactPerson = '';
  // formData.contactPhone = '';
  // formData.description = '';
  
  // 重新初始化表单数据（如果有传入的dealerInfo）
  initFormData();
};

// 组件挂载时初始化表单数据
onMounted(() => {
  initFormData();
});

// 暴露方法供父组件调用
defineExpose({
  submitDealerInfo,
  submitAndReview,
  resetForm
});
</script>

<style scoped>
.dealer-submit-form {
  padding: 20px;
}

/* 表单布局 */
.dealer-form {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.form-group label {
  font-size: 14px;
  color: #555;
  font-weight: 500;
}

.required {
  color: #e74c3c;
}

/* 表单输入样式 */
.form-input,
.form-textarea {
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
  transition: border-color 0.2s;
}

.form-input:focus,
.form-textarea:focus {
  border-color: var(--va-primary);
  outline: none;
}

.form-textarea {
  resize: vertical;
  min-height: 80px;
}

/* 错误信息 */
.error-message {
  color: #e74c3c;
  font-size: 14px;
  margin-top: 5px;
}

/* 成功状态 */
.success-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 30px 0;
  text-align: center;
  color: #2ecc71;
}

/* 深色模式适配 */
:root[data-theme="dark"] .form-group label {
  color: #aaa;
}

:root[data-theme="dark"] .form-input,
:root[data-theme="dark"] .form-textarea {
  background-color: #333;
  color: #e0e0e0;
  border-color: #444;
}
</style> 