<template>
  <va-card class="change-password-panel">
    <va-card-title class="panel-title">
      <div class="title-with-back">
        <va-button icon="arrow_back" size="small" flat @click="goBack"></va-button>
        修改密码
      </div>
    </va-card-title>
    
    <va-card-content class="panel-content">
      <div v-if="loading" class="loading-container">
        <va-progress-circle indeterminate color="primary" />
        <p>加载中...</p>
      </div>
      
      <div v-else-if="error" class="error-container">
        <va-icon name="warning" color="danger" />
        <p>{{ error }}</p>
        <va-button @click="resetForm">重试</va-button>
      </div>
      
      <div v-else-if="success" class="success-container">
        <va-icon name="check_circle" color="success" />
        <p>密码修改成功！</p>
        <va-button @click="goBack">返回个人中心</va-button>
      </div>
      
      <div v-else class="form-container">
        <va-form ref="form" @submit.prevent="submitForm">
          <!-- 当前密码 -->
          <va-input
            v-model="formData.currentPassword"
            label="当前密码"
            type="password"
            class="mb-3"
            :rules="[value => !!value || '当前密码不能为空']"
          />
          
          <!-- 新密码 -->
          <va-input
            v-model="formData.newPassword"
            label="新密码"
            type="password"
            class="mb-3"
            :rules="[
              value => !!value || '新密码不能为空',
              value => value.length >= 6 || '密码长度不能少于6个字符',
              value => value !== formData.currentPassword || '新密码不能与当前密码相同'
            ]"
          />
          
          <!-- 确认新密码 -->
          <va-input
            v-model="formData.confirmPassword"
            label="确认新密码"
            type="password"
            class="mb-3"
            :rules="[
              value => !!value || '请确认新密码',
              value => value === formData.newPassword || '两次输入的密码不一致'
            ]"
          />
          
          <!-- 提交按钮 -->
          <div class="form-actions">
            <va-button type="submit" preset="primary" :loading="submitting">
              确认修改
            </va-button>
            <va-button preset="secondary" @click="goBack">
              取消
            </va-button>
          </div>
        </va-form>
      </div>
    </va-card-content>
  </va-card>
</template>

<script setup>
import { ref, reactive } from 'vue';
import { useRouter } from 'vue-router';
import authService from '@/api/authService';

// 定义事件
const emit = defineEmits(['close', 'success']);

// 路由实例
const router = useRouter();

// 状态变量
const loading = ref(false);
const submitting = ref(false);
const error = ref('');
const success = ref(false);
const formData = reactive({
  currentPassword: '',
  newPassword: '',
  confirmPassword: ''
});

// 重置表单
const resetForm = () => {
  error.value = '';
  formData.currentPassword = '';
  formData.newPassword = '';
  formData.confirmPassword = '';
};

// 提交表单
const submitForm = async () => {
  submitting.value = true;
  error.value = '';
  
  try {
    // 调用API更新密码
    const result = await authService.updatePassword(formData.currentPassword, formData.newPassword);
    
    if (result.success) {
      // 更新成功
      success.value = true;
      resetForm();
      // 通知父组件
      emit('success');
    } else {
      error.value = result.message || '修改密码失败';
    }
  } catch (err) {
    console.error('修改密码出错:', err);
    error.value = '修改密码时发生错误';
  } finally {
    submitting.value = false;
  }
};

// 返回上一页
const goBack = () => {
  emit('close');
};
</script>

<style scoped>
.change-password-panel {
  width: 100%;
  max-width: 500px;
  margin: 0 auto;
}

.panel-title {
  font-size: 1rem;
  padding: 0.75rem 1rem;
  border-bottom: 1px solid #f0f0f0;
}

.title-with-back {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.panel-content {
  padding: 1rem;
}

.loading-container,
.error-container,
.success-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  gap: 1rem;
  text-align: center;
}

.success-container {
  color: var(--va-success);
}

.form-container {
  padding: 0.5rem;
}

.mb-3 {
  margin-bottom: 1rem;
}

.form-actions {
  display: flex;
  gap: 1rem;
  margin-top: 1.5rem;
}

@media (max-width: 768px) {
  .form-actions {
    flex-direction: column;
    gap: 0.5rem;
  }
}
</style> 