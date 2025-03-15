<template>
  <ModalDialog
    :modelValue="modelValue"
    @update:modelValue="$emit('update:modelValue', $event)"
    :title="modalTitle"
    confirm-text="保存"
    cancel-text="取消"
    :loading="loading"
    @confirm="handleSave"
    class="centered-modal"
  >
    <div class="edit-profile-modal">
      <!-- 编辑资料内容 -->
      <div v-if="activeTab === 'profile'" class="tab-content">
        <div class="edit-profile-content">
          <div v-if="profileLoading" class="loading-container">
            <va-progress-circle indeterminate color="primary" />
            <p>加载中...</p>
          </div>
          
          <div v-else-if="profileError" class="error-container">
            <va-icon name="warning" color="danger" />
            <p>{{ profileError }}</p>
            <va-button @click="fetchUserInfo">重试</va-button>
          </div>
          
          <div v-else class="form-container">
            <va-form ref="profileForm" @submit.prevent="submitProfileForm">
              <!-- 邮箱 -->
              <va-input
                v-model="profileData.email"
                label="邮箱"
                class="mb-3"
                :rules="[
                  value => !!value || '邮箱不能为空',
                  value => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) || '请输入有效的邮箱地址'
                ]"
              />
              
              <!-- 手机号 -->
              <va-input
                v-model="profileData.phone"
                label="手机号"
                class="mb-3"
                :rules="[
                  value => !value || /^1[3-9]\d{9}$/.test(value) || '请输入有效的手机号'
                ]"
              />
            </va-form>
          </div>
        </div>
      </div>

      <!-- 修改密码内容 -->
      <div v-else-if="activeTab === 'password'" class="tab-content">
        <div class="change-password-content">
          <div v-if="passwordLoading" class="loading-container">
            <va-progress-circle indeterminate color="primary" />
            <p>加载中...</p>
          </div>
          
          <div v-else-if="passwordError" class="error-container">
            <va-icon name="warning" color="danger" />
            <p>{{ passwordError }}</p>
            <va-button @click="resetPasswordForm">重试</va-button>
          </div>
          
          <div v-else-if="passwordSuccess" class="success-container">
            <va-icon name="check_circle" color="success" />
            <p>密码修改成功！</p>
            <va-button @click="handleClose">返回个人中心</va-button>
          </div>
          
          <div v-else class="form-container">
            <va-form ref="passwordForm" @submit.prevent="submitPasswordForm">
              <!-- 当前密码 -->
              <va-input
                v-model="passwordData.currentPassword"
                label="当前密码"
                type="password"
                class="mb-3"
                :rules="[value => !!value || '当前密码不能为空']"
              />
              
              <!-- 新密码 -->
              <va-input
                v-model="passwordData.newPassword"
                label="新密码"
                type="password"
                class="mb-3"
                :rules="[
                  value => !!value || '新密码不能为空',
                  value => value.length >= 6 || '密码长度不能少于6个字符',
                  value => value !== passwordData.currentPassword || '新密码不能与当前密码相同'
                ]"
              />
              
              <!-- 确认新密码 -->
              <va-input
                v-model="passwordData.confirmPassword"
                label="确认新密码"
                type="password"
                class="mb-3"
                :rules="[
                  value => !!value || '请确认新密码',
                  value => value === passwordData.newPassword || '两次输入的密码不一致'
                ]"
              />
            </va-form>
          </div>
        </div>
      </div>
    </div>
  </ModalDialog>
</template>

<script setup>
import { ref, reactive, computed, watch, onMounted, defineProps, defineEmits } from 'vue';
import ModalDialog from '@/components/modelwindow/ModalDialog.vue';
import authService from '@/api/authService';

const props = defineProps({
  // 是否显示对话框
  modelValue: {
    type: Boolean,
    default: false
  },
  // 初始激活的标签
  initialTab: {
    type: String,
    default: 'profile', // 'profile' 或 'password'
    validator: (value) => ['profile', 'password'].includes(value)
  },
  // 用户信息
  userInfo: {
    type: Object,
    default: () => ({})
  }
});

const emit = defineEmits(['update:modelValue', 'success', 'avatar-updated', 'close']);

// 当前激活的标签
const activeTab = ref(props.initialTab);

// 加载状态
const loading = ref(false);

// 计算标题
const modalTitle = computed(() => {
  return activeTab.value === 'profile' ? '编辑个人资料' : '修改密码';
});

// 监听modelValue变化
watch(() => props.modelValue, (newValue) => {
  if (newValue) {
    // 打开时重置为初始标签
    activeTab.value = props.initialTab;
    
    // 如果是编辑资料标签，加载用户信息
    if (activeTab.value === 'profile') {
      fetchUserInfo();
    }
  }
});

// 监听initialTab变化
watch(() => props.initialTab, (newValue) => {
  activeTab.value = newValue;
  
  // 如果是编辑资料标签，加载用户信息
  if (activeTab.value === 'profile' && props.modelValue) {
    fetchUserInfo();
  }
});

// ===== 编辑资料相关 =====
const profileLoading = ref(!Object.keys(props.userInfo).length);
const profileSubmitting = ref(false);
const profileError = ref('');
const profileData = reactive({
  email: props.userInfo?.email || '',
  phone: props.userInfo?.phone || '',
  avatar: props.userInfo?.avatar || ''
});

// 获取用户信息
const fetchUserInfo = async () => {
  // 如果已经传入了userInfo，则直接使用
  if (Object.keys(props.userInfo).length) {
    profileData.email = props.userInfo.email || '';
    profileData.phone = props.userInfo.phone || '';
    profileData.avatar = props.userInfo.avatar || '';
    profileLoading.value = false;
    return;
  }
  
  profileLoading.value = true;
  profileError.value = '';
  
  try {
    const result = await authService.fetchUserProfile();
    
    if (result.success) {
      // 填充表单数据
      profileData.email = result.data.email || '';
      profileData.phone = result.data.phone || '';
      profileData.avatar = result.data.avatar || '';
    } else {
      profileError.value = result.message || '获取用户信息失败';
    }
  } catch (err) {
    console.error('获取用户信息出错:', err);
    profileError.value = '获取用户信息时发生错误';
  } finally {
    profileLoading.value = false;
  }
};

// 提交个人资料表单
const submitProfileForm = async () => {
  profileSubmitting.value = true;
  profileError.value = '';
  
  try {
    // 构建更新数据 - 注意：根据API只需要email和phone
    const updateData = {
      email: profileData.email,
      phone: profileData.phone
    };
    
    console.log('提交的更新数据:', updateData);
    
    // 调用API更新用户资料
    const result = await authService.updateUserProfile(updateData);
    
    if (result.success) {
      // 更新成功，发送成功事件
      console.log('用户资料更新成功:', result);
      emit('success', 'profile');
      handleClose();
    } else {
      console.error('更新用户资料失败:', result);
      profileError.value = result.message || '更新用户资料失败';
    }
  } catch (err) {
    console.error('更新用户资料出错:', err);
    profileError.value = '更新用户资料时发生错误';
  } finally {
    profileSubmitting.value = false;
  }
};

// ===== 修改密码相关 =====
const passwordLoading = ref(false);
const passwordSubmitting = ref(false);
const passwordError = ref('');
const passwordSuccess = ref(false);
const passwordData = reactive({
  currentPassword: '',
  newPassword: '',
  confirmPassword: ''
});

// 重置密码表单
const resetPasswordForm = () => {
  passwordError.value = '';
  passwordData.currentPassword = '';
  passwordData.newPassword = '';
  passwordData.confirmPassword = '';
};

// 提交密码表单
const submitPasswordForm = async () => {
  passwordSubmitting.value = true;
  passwordError.value = '';
  
  try {
    // 调用API更新密码
    const result = await authService.updatePassword(passwordData.currentPassword, passwordData.newPassword);
    
    if (result.success) {
      // 更新成功
      passwordSuccess.value = true;
      resetPasswordForm();
      // 通知父组件
      emit('success', 'password');
    } else {
      passwordError.value = result.message || '修改密码失败';
    }
  } catch (err) {
    console.error('修改密码出错:', err);
    passwordError.value = '修改密码时发生错误';
  } finally {
    passwordSubmitting.value = false;
  }
};

// 处理保存
const handleSave = async () => {
  loading.value = true;
  try {
    if (activeTab.value === 'profile') {
      await submitProfileForm();
    } else if (activeTab.value === 'password') {
      await submitPasswordForm();
    }
  } finally {
    loading.value = false;
  }
};

// 处理关闭
const handleClose = () => {
  emit('update:modelValue', false);
  emit('close');
};

// 组件挂载时获取用户信息（如果需要）
onMounted(() => {
  if (activeTab.value === 'profile' && !Object.keys(props.userInfo).length) {
    fetchUserInfo();
  }
});

// 暴露方法给父组件
defineExpose({
  saveProfile: submitProfileForm,
  savePassword: submitPasswordForm
});
</script>

<style scoped>
.edit-profile-modal {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.tab-content {
  flex: 1;
  overflow-y: auto;
  width: 100%;
  display: flex;
  justify-content: center;
}

/* 编辑资料样式 */
.edit-profile-content {
  width: 100%;
  max-width: 400px;
  margin: 0 auto;
  padding: 1rem;
  display: flex;
  flex-direction: column;
  align-items: center;
}

/* 修改密码样式 */
.change-password-content {
  width: 100%;
  max-width: 400px;
  margin: 0 auto;
  padding: 1rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

/* 通用样式 */
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
  width: 100%;
}

.success-container {
  color: var(--va-success);
}

.form-container {
  padding: 0.5rem;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}

.form-container form {
  width: 100%;
  max-width: 350px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

/* 确保输入框宽度一致且居中 */
:deep(.va-input) {
  width: 100%;
  max-width: 350px;
}

:deep(.va-input__container) {
  width: 100%;
}

/* 确保按钮居中 */
:deep(.va-button) {
  margin: 0 auto;
}

.mb-3 {
  margin-bottom: 1rem;
}

.mb-4 {
  margin-bottom: 1.5rem;
}

/* 深色模式适配 */
:root[data-theme="dark"] .change-password-content {
  color: #e0e0e0;
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
</style> 