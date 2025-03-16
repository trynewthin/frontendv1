<template>
  <div class="dealer-submit-form">
    <h3 class="form-title">提交经销商信息</h3>
    
    <div v-if="loading" class="loading-container">
      <div class="spinner"></div>
      <p>提交中...</p>
    </div>
    
    <div v-else-if="success" class="success-container">
      <p>{{ successMessage }}</p>
      <div class="action-buttons">
        <button class="primary-button" @click="$emit('close')">关闭</button>
      </div>
    </div>
    
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
        
        <div class="action-buttons">
          <button type="button" class="secondary-button" @click="$emit('close')">取消</button>
          <button type="submit" class="primary-button" :disabled="loading">提交</button>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import { ref, reactive, onMounted } from 'vue';
import dealerService from '@/api/dealerService';

export default {
  name: 'DealerSubmitForm',
  
  props: {
    // 如果有现有的经销商信息，可以传入进行编辑
    dealerInfo: {
      type: Object,
      default: null
    }
  },
  
  emits: ['close', 'success'],
  
  setup(props, { emit }) {
    const loading = ref(false);
    const error = ref('');
    const success = ref(false);
    const successMessage = ref('');
    
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
    const submitDealerInfo = async () => {
      // 验证必填字段
      if (!formData.dealerName) {
        error.value = '经销商名称不能为空';
        return;
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
          success.value = true;
          successMessage.value = '经销商信息提交成功！';
          emit('success', response.data);
        } else {
          error.value = response.message || '提交经销商信息失败';
        }
      } catch (err) {
        console.error('提交经销商信息出错:', err);
        error.value = err.message || '提交经销商信息时发生错误';
      } finally {
        loading.value = false;
      }
    };
    
    // 组件挂载时初始化表单数据
    onMounted(() => {
      initFormData();
    });
    
    return {
      loading,
      error,
      success,
      successMessage,
      formData,
      submitDealerInfo
    };
  }
}
</script>

<style scoped>
.dealer-submit-form {
  padding: 20px;
  max-width: 600px;
  margin: 0 auto;
}

.form-title {
  font-size: 18px;
  color: #333;
  margin-bottom: 20px;
  padding-bottom: 10px;
  border-bottom: 1px solid #eee;
}

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

.error-message {
  color: #e74c3c;
  font-size: 14px;
  margin-top: 5px;
}

.action-buttons {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 20px;
}

.primary-button,
.secondary-button {
  padding: 8px 16px;
  border-radius: 4px;
  font-size: 14px;
  cursor: pointer;
  border: none;
  transition: background-color 0.2s;
}

.primary-button {
  background-color: var(--va-primary);
  color: white;
}

.primary-button:hover {
  background-color: rgb(146, 183, 252);
  color: rgb(0, 0, 0);
}

.secondary-button {
  background-color: #f0f0f0;
  color: #333;
}

.secondary-button:hover {
  background-color: #e0e0e0;
}

.loading-container,
.success-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 30px 0;
  text-align: center;
}

.spinner {
  width: 30px;
  height: 30px;
  border: 3px solid rgba(0, 0, 0, 0.1);
  border-radius: 50%;
  border-top-color: var(--va-primary);
  animation: spin 1s ease-in-out infinite;
  margin-bottom: 10px;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.success-container {
  color: #2ecc71;
}
</style> 