<template>
  <va-card class="edit-profile-panel">
    <va-card-title class="panel-title">
      <div class="title-with-back">
        <va-button icon="arrow_back" size="small" flat @click="goBack"></va-button>
        编辑个人资料
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
        <va-button @click="fetchUserInfo">重试</va-button>
      </div>
      
      <div v-else class="form-container">
        <va-form ref="form" @submit.prevent="submitForm">
          <!-- 头像 -->
          <div class="avatar-upload mb-4">
            <p class="upload-label">个人头像</p>
            <div class="avatar-preview">
              <div class="avatar-container" @click="uploadAvatar">
                <va-avatar 
                  :src="formData.avatar || '/images/avatars/default.png'" 
                  size="large"
                  class="user-avatar"
                />
                <div class="avatar-hover-overlay">
                  <va-icon name="photo_camera" />
                  <span>点击更换</span>
                </div>
              </div>
              <div class="avatar-info">
                <p class="avatar-tip">点击头像或右侧按钮更换个人头像</p>
                <p class="avatar-tip-sub">支持JPG、PNG、GIF格式，文件大小不超过2MB</p>
                <va-button size="small" preset="primary" class="upload-btn" @click="uploadAvatar">
                  <va-icon name="upload" /> 上传头像
                </va-button>
              </div>
            </div>
          </div>
          
          <!-- 邮箱 -->
          <va-input
            v-model="formData.email"
            label="邮箱"
            class="mb-3"
            :rules="[
              value => !!value || '邮箱不能为空',
              value => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) || '请输入有效的邮箱地址'
            ]"
          />
          
          <!-- 手机号 -->
          <va-input
            v-model="formData.phone"
            label="手机号"
            class="mb-3"
            :rules="[
              value => !value || /^1[3-9]\d{9}$/.test(value) || '请输入有效的手机号'
            ]"
          />
          
          <!-- 提交按钮 -->
          <div class="form-actions">
            <va-button type="submit" preset="primary" :loading="submitting">
              保存修改
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
import { ref, reactive, onMounted, defineProps, defineEmits } from 'vue';
import { useRouter } from 'vue-router';
import authService from '@/api/authService';

// 定义props接收外部传入的用户信息
const props = defineProps({
  userInfo: {
    type: Object,
    default: () => ({})
  }
});

// 路由实例
const router = useRouter();

// 定义事件
const emit = defineEmits(['close', 'success', 'avatar-updated']);

// 状态变量
const loading = ref(!Object.keys(props.userInfo).length);
const submitting = ref(false);
const error = ref('');
const formData = reactive({
  email: props.userInfo?.email || '',
  phone: props.userInfo?.phone || '',
  avatar: props.userInfo?.avatar || ''
});

// 获取用户信息
const fetchUserInfo = async () => {
  // 如果已经传入了userInfo，则直接使用
  if (Object.keys(props.userInfo).length) {
    formData.email = props.userInfo.email || '';
    formData.phone = props.userInfo.phone || '';
    formData.avatar = props.userInfo.avatar || '';
    loading.value = false;
    return;
  }
  
  loading.value = true;
  error.value = '';
  
  try {
    const result = await authService.fetchUserProfile();
    
    if (result.success) {
      // 填充表单数据
      formData.email = result.data.email || '';
      formData.phone = result.data.phone || '';
      formData.avatar = result.data.avatar || '';
    } else {
      error.value = result.message || '获取用户信息失败';
    }
  } catch (err) {
    console.error('获取用户信息出错:', err);
    error.value = '获取用户信息时发生错误';
  } finally {
    loading.value = false;
  }
};

// 上传头像
const uploadAvatar = async () => {
  try {
    // 创建一个隐藏的文件输入元素
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = 'image/jpeg,image/png,image/gif';
    fileInput.style.display = 'none';
    document.body.appendChild(fileInput);
    
    // 监听文件选择事件
    fileInput.onchange = async (event) => {
      const file = event.target.files[0];
      if (!file) return;
      
      // 显示上传中状态
      submitting.value = true;
      const originalAvatar = formData.avatar;
      formData.avatar = '/images/avatars/uploading.gif'; // 可以替换为合适的上传中图标
      
      try {
        // 调用API上传头像
        const result = await authService.uploadAvatar(file);
        
        if (result.success) {
          // 上传成功，更新头像 - 使用服务器返回的URL
          if (result.avatarUrl) {
            formData.avatar = result.avatarUrl;
          } else if (result.data && result.data.avatarPath) {
            // 处理可能的不同格式返回
            const avatarPath = result.data.avatarPath;
            formData.avatar = avatarPath.startsWith('http') 
              ? avatarPath 
              : `${import.meta.env.VITE_API_IMAGE_URL || 'http://localhost:8090'}${avatarPath}`;
          }
          
          console.log('头像上传成功，新头像路径:', formData.avatar);
          
          // 立即通知父组件更新用户信息
          emit('avatar-updated');
          
          // 显示成功提示
          error.value = '';
        } else {
          // 上传失败，恢复原头像
          formData.avatar = originalAvatar;
          console.error('头像上传失败:', result.message);
          error.value = result.message || '头像上传失败';
          setTimeout(() => { error.value = ''; }, 3000); // 3秒后清除错误信息
        }
      } catch (err) {
        // 出错，恢复原头像
        formData.avatar = originalAvatar;
        console.error('头像上传出错:', err);
        error.value = '头像上传出错';
        setTimeout(() => { error.value = ''; }, 3000); // 3秒后清除错误信息
      } finally {
        // 移除文件输入元素
        document.body.removeChild(fileInput);
        submitting.value = false;
      }
    };
    
    // 触发文件选择对话框
    fileInput.click();
  } catch (err) {
    console.error('打开文件选择器出错:', err);
    error.value = '打开文件选择器出错';
    setTimeout(() => { error.value = ''; }, 3000); // 3秒后清除错误信息
  }
};

// 提交表单
const submitForm = async () => {
  submitting.value = true;
  error.value = '';
  
  try {
    // 构建更新数据 - 注意：根据API只需要email和phone
    const updateData = {
      email: formData.email,
      phone: formData.phone
    };
    
    // 头像会由authService自动处理，我们不需要手动处理
    
    console.log('提交的更新数据:', updateData);
    
    // 调用API更新用户资料
    const result = await authService.updateUserProfile(updateData);
    
    if (result.success) {
      // 更新成功，发送成功事件
      console.log('用户资料更新成功:', result);
      emit('success');
    } else {
      console.error('更新用户资料失败:', result);
      error.value = result.message || '更新用户资料失败';
    }
  } catch (err) {
    console.error('更新用户资料出错:', err);
    error.value = '更新用户资料时发生错误';
  } finally {
    submitting.value = false;
  }
};

// 返回上一页
const goBack = () => {
  emit('close');
};

// 组件挂载时获取用户信息（如果需要）
onMounted(() => {
  if (!Object.keys(props.userInfo).length) {
    fetchUserInfo();
  }
});
</script>

<style scoped>
.edit-profile-panel {
  width: 100%;
  max-width: 600px;
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
.error-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  gap: 1rem;
}

.form-container {
  padding: 0.5rem;
}

.mb-3 {
  margin-bottom: 1rem;
}

.mb-4 {
  margin-bottom: 1.5rem;
}

.avatar-upload {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  background-color: #f8f9fa;
  padding: 1.25rem;
  border-radius: 8px;
  border: 1px dashed #ddd;
  margin-bottom: 1.5rem;
}

.upload-label {
  font-size: 1rem;
  color: #333;
  font-weight: 600;
  margin-bottom: 0.5rem;
}

.avatar-preview {
  display: flex;
  align-items: center;
  gap: 1.5rem;
}

.avatar-container {
  position: relative;
  cursor: pointer;
  border-radius: 50%;
  overflow: hidden;
  width: 100px;
  height: 100px;
  display: flex;
  justify-content: center;
  align-items: center;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  border: 3px solid white;
  transition: all 0.3s ease;
}

.avatar-container:hover {
  transform: scale(1.05);
}

.user-avatar {
  width: 100px !important;
  height: 100px !important;
}

.avatar-hover-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  opacity: 0;
  transition: opacity 0.3s ease;
  color: white;
  cursor: pointer;
}

.avatar-container:hover .avatar-hover-overlay {
  opacity: 1;
}

.avatar-hover-overlay span {
  font-size: 0.8rem;
  margin-top: 0.25rem;
}

.avatar-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.avatar-tip {
  margin: 0;
  font-size: 0.9rem;
  color: #444;
}

.avatar-tip-sub {
  margin: 0;
  font-size: 0.8rem;
  color: #777;
  margin-bottom: 0.75rem;
}

.upload-btn {
  align-self: flex-start;
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