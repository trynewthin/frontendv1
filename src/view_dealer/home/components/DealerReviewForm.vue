<template>
  <div class="dealer-review-form">
    <!-- 成功状态 -->
    <div v-if="success" class="success-container">
      <p>{{ successMessage }}</p>
    </div>
    
    <!-- 表单内容 -->
    <div v-else>
      <div class="info-message">
        <p>提交审核申请后，管理员将对您的经销商信息进行审核。审核通过后，您的信息会正确修改，并且账号解除禁用。</p>
      </div>
      
      <form @submit.prevent="submitReviewRequest" class="review-form">
        <div class="error-message" v-if="error">
          {{ error }}
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, watch, defineExpose } from 'vue';
import dealerService from '@/api/dealerService';

// 定义事件
const emit = defineEmits(['close', 'success', 'loading']);

// 定义状态
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
      // 提交成功后不再设置内部success状态，直接发出成功事件并关闭
      emit('success', response.data);
      // 确保父组件能立即关闭并重置状态
      emit('loading', false);
      emit('close');
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

// 重置表单状态
const resetForm = () => {
  loading.value = false;
  success.value = false;
  error.value = '';
  formData.remarks = '';
};

// 暴露方法供父组件调用
defineExpose({
  submitReviewRequest,
  resetForm
});
</script>

<style scoped>
.dealer-review-form {
  padding: 20px;
}

.info-message {
  background-color: #f8f9fa;
  border-left: 4px solid var(--va-primary, #000);
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
:root[data-theme="dark"] .info-message {
  background-color: #2a2a2a;
  border-left-color: var(--va-primary, #fff);
}

:root[data-theme="dark"] .info-message p {
  color: #aaa;
}
</style> 