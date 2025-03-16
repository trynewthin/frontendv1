<template>
  <div class="dealer-review-form">
    <h3 class="form-title">提交审核申请</h3>
    
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
      <div class="info-message">
        <p>提交审核申请后，管理员将对您的经销商信息进行审核。审核通过后，您的经销商账号将被激活。</p>
      </div>
      
      <form @submit.prevent="submitReviewRequest" class="review-form">
        <div class="error-message" v-if="error">
          {{ error }}
        </div>
        
        <div class="action-buttons">
          <button type="button" class="secondary-button" @click="$emit('close')">取消</button>
          <button type="submit" class="primary-button" :disabled="loading">提交审核</button>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import { ref, reactive } from 'vue';
import dealerService from '@/api/dealerService';

export default {
  name: 'DealerReviewForm',
  
  emits: ['close', 'success'],
  
  setup(props, { emit }) {
    const loading = ref(false);
    const error = ref('');
    const success = ref(false);
    const successMessage = ref('');
    
    // 表单数据
    const formData = reactive({
      remarks: ''
    });
    
    // 提交审核申请
    const submitReviewRequest = async () => {
      loading.value = true;
      error.value = '';
      
      try {
        const response = await dealerService.submitReviewRequest({
          remarks: formData.remarks
        });
        
        if (response.success) {
          success.value = true;
          successMessage.value = '审核申请提交成功！请耐心等待管理员审核。';
          emit('success', response.data);
        } else {
          error.value = response.message || '提交审核申请失败';
        }
      } catch (err) {
        console.error('提交审核申请出错:', err);
        error.value = err.message || '提交审核申请时发生错误';
      } finally {
        loading.value = false;
      }
    };
    
    return {
      loading,
      error,
      success,
      successMessage,
      formData,
      submitReviewRequest
    };
  }
}
</script>

<style scoped>
.dealer-review-form {
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

.info-message {
  background-color: #f8f9fa;
  border-left: 4px solid var(--va-primary);
  padding: 12px 15px;
  margin-bottom: 20px;
  border-radius: 4px;
}

.info-message p {
  margin: 0;
  color: #555;
  font-size: 14px;
  line-height: 1.5;
}

.review-form {
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

.form-textarea {
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
  transition: border-color 0.2s;
  resize: vertical;
  min-height: 80px;
}

.form-textarea:focus {
  border-color: var(--va-primary);
  outline: none;
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