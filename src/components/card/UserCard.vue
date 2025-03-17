<template>
  <div class="user-panel-container">
    <base-panel title="用户信息" class="user-card">
      <div v-if="loading" class="loading-container">
        <div class="loading-spinner"></div>
        <p>加载中...</p>
      </div>
      
      <div v-else-if="error" class="error-container">
        <span class="error-icon">⚠️</span>
        <p>{{ error }}</p>
        <button class="btn btn-primary" @click="fetchUserInfo">重试</button>
      </div>
      
      <div v-else class="user-info-content">
        <!-- 头像和用户信息放在顶部 -->
        <div class="avatar-section">
          <div class="avatar-wrapper" @click="uploadAvatar">
            <img 
              :src="getAvatarUrlWithTimestamp(userInfo.avatar)" 
              alt="用户头像"
              class="user-avatar"
              @error="handleImageError"
            />
            <div class="avatar-hover-overlay">
              <span class="camera-icon">更换</span>
            </div>
          </div>
          <div class="user-info-brief">
            <div class="username-display">{{ userInfo.username }}</div>
            <div class="user-type-badge">{{ formatUserType(userInfo.userType) }}</div>
          </div>
        </div>
        
        <!-- 用户详细信息列表 -->
        <div class="info-list">
          <div class="info-item">
            <strong>邮箱：</strong>{{ userInfo.email }}
          </div>
          
          <div class="info-item">
            <strong>手机号：</strong>{{ userInfo.phone || '未设置' }}
          </div>
          
          <div class="info-item">
            <strong>注册时间：</strong>{{ formatDate(userInfo.registerTime) }}
          </div>
          
          <div class="info-item">
            <strong>上次登录：</strong>{{ formatDate(userInfo.lastLoginTime) }}
          </div>
        </div>
      </div>
      
      <!-- 操作按钮 -->
      <template #footer>
        <button class="btn btn-primary" @click="openChangePassword">
          修改密码
        </button>
        <button class="btn btn-primary" @click="openEditProfile">
          编辑资料
        </button>
      </template>
    </base-panel>
    
    <!-- 使用原有的模态框组件 -->
    <EditProfileModal
      v-model="showProfileModal"
      :initial-tab="activeModalTab"
      :userInfo="userInfo"
      @success="handleModalSuccess"
      @avatar-updated="handleAvatarUpdated"
      @close="closeProfileModal"
    />
  </div>
</template>

<script setup>
import { ref, onMounted, defineProps, defineEmits } from 'vue';
import authService from '@/api/authService';
import EditProfileModal from '@/components/modelwindow/EditProfileModal.vue';
import BasePanel from '@/components/card/BasePanel.vue';
import { getImageUrlWithTimestamp, handleImageError as handleImageErrorUtil } from '@/utils/imageUtils';

// 定义props接收外部传入的用户信息
const props = defineProps({
  userInfo: {
    type: Object,
    default: () => ({})
  }
});

// 定义emit
const emit = defineEmits(['edit-profile', 'change-password']);

// 用户信息状态变量
const userInfo = ref(props.userInfo || {});
const loading = ref(!Object.keys(props.userInfo).length);
const error = ref('');

// 弹窗状态
const showProfileModal = ref(false);
const activeModalTab = ref('profile');
const avatarUploading = ref(false);
const avatarTimestamp = ref(Date.now());

// 打开编辑资料弹窗
const openEditProfile = () => {
  console.log('触发编辑资料事件');
  activeModalTab.value = 'profile';
  showProfileModal.value = true;
  emit('edit-profile');
};

// 关闭编辑资料弹窗
const closeProfileModal = () => {
  showProfileModal.value = false;
};

// 打开修改密码弹窗
const openChangePassword = () => {
  console.log('触发修改密码事件');
  activeModalTab.value = 'password';
  showProfileModal.value = true;
  emit('change-password');
};

// 处理模态框操作成功
const handleModalSuccess = (type) => {
  if (type === 'profile') {
    fetchUserInfo();
  }
  closeProfileModal();
};

// 处理头像更新
const handleAvatarUpdated = async () => {
  console.log('收到头像更新事件，立即刷新用户信息');
  await fetchUserInfo();
};

// 上传头像
const uploadAvatar = async () => {
  if (avatarUploading.value) return;
  
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
      avatarUploading.value = true;
      const originalAvatar = userInfo.value.avatar;
      
      try {
        // 调用API上传头像
        const result = await authService.uploadAvatar(file);
        
        if (result.success) {
          // 上传成功，更新头像 - 使用服务器返回的URL
          if (typeof result.data === 'string' && result.data.includes('/images/avatars/')) {
            // 直接使用服务器返回的完整URL (如果是字符串形式的URL)
            userInfo.value.avatar = result.data;
          } else if (result.avatarUrl) {
            // 使用处理后的avatarUrl
            userInfo.value.avatar = result.avatarUrl;
          } else if (result.data && result.data.avatarPath) {
            // 处理可能的不同格式返回
            const avatarPath = result.data.avatarPath;
            userInfo.value.avatar = avatarPath.startsWith('http') 
              ? avatarPath 
              : `${import.meta.env.VITE_API_IMAGE_URL || 'http://localhost:8090'}${avatarPath}`;
          }
          
          // 更新时间戳，强制刷新头像
          avatarTimestamp.value = Date.now();
          
          console.log('头像上传成功，新头像路径:', userInfo.value.avatar);
          
          // 显示成功提示
          error.value = '';
        } else {
          // 上传失败，恢复原头像
          userInfo.value.avatar = originalAvatar;
          console.error('头像上传失败:', result.message);
          error.value = result.message || '头像上传失败';
          setTimeout(() => { error.value = ''; }, 3000); // 3秒后清除错误信息
        }
      } catch (err) {
        // 出错，恢复原头像
        userInfo.value.avatar = originalAvatar;
        console.error('头像上传出错:', err);
        error.value = '头像上传出错';
        setTimeout(() => { error.value = ''; }, 3000); // 3秒后清除错误信息
      } finally {
        // 移除文件输入元素
        document.body.removeChild(fileInput);
        avatarUploading.value = false;
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

// 获取用户信息 - 只在未提供userInfo时从API获取
const fetchUserInfo = async () => {
  // 如果已经传入了userInfo，则直接使用
  if (Object.keys(props.userInfo).length) {
    userInfo.value = props.userInfo;
    loading.value = false;
    return;
  }
  
  loading.value = true;
  error.value = '';
  
  try {
    const result = await authService.fetchUserProfile();
    
    if (result.success) {
      userInfo.value = result.data;
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

// 格式化日期
const formatDate = (dateString) => {
  if (!dateString) return '未知';
  
  const date = new Date(dateString);
  return date.toLocaleString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  });
};

// 格式化用户类型
const formatUserType = (type) => {
  const typeMap = {
    'NORMAL_USER': '普通用户',
    'DEALER': '经销商',
    'ADMIN': '管理员'
  };
  
  return typeMap[type] || type;
};

// 添加时间戳到头像URL，强制浏览器重新加载图片
const getAvatarUrlWithTimestamp = (url) => {
  return getImageUrlWithTimestamp(url, 'avatars');
};

// 处理图片加载错误
const handleImageError = (e) => {
  handleImageErrorUtil(e, 'avatars');
};

// 组件挂载时获取用户信息（如果需要）
onMounted(() => {
  if (!Object.keys(props.userInfo).length) {
    fetchUserInfo();
  } else {
    userInfo.value = props.userInfo;
  }
});
</script>

<style scoped>
.user-panel-container {
  position: relative;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
  width: 100%;
  height: 100%;
}

.user-card {
  width: 100%;
  height: 100%;
}

.loading-container,
.error-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 1rem;
  gap: 0.75rem;
  text-align: center;
  height: 100%;
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

.user-info-content {
  display: flex;
  flex-direction: column;
  height: 100%;
  padding: 1rem;
}

.avatar-section {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  gap: 1.5rem;
  width: 100%;
  margin-bottom: 2rem;
  padding: 0.5rem;
}

.user-info-brief {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  align-items: flex-start;
}

.avatar-wrapper {
  width: 90px;
  height: 90px;
  border-radius: 50%;
  overflow: hidden;
  border: 2px solid var(--primary-color, #000000);
  padding: 2px;
  position: relative;
  cursor: pointer;
  transition: transform 0.2s ease;
  flex-shrink: 0;
}

.avatar-wrapper:hover {
  transform: scale(1.05);
}

.avatar-hover-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  justify-content: center;
  align-items: center;
  opacity: 0;
  transition: opacity 0.3s ease;
  color: white;
  border-radius: 50%;
}

.avatar-wrapper:hover .avatar-hover-overlay {
  opacity: 1;
}

.camera-icon {
  font-size: 0.8rem;
}

.user-avatar {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 50%;
}

.username-display {
  font-size: 1.1rem;
  font-weight: 600;
  margin: 0;
  text-align: left;
}

.user-type-badge {
  background-color: var(--primary-color, #000000);
  color: white;
  padding: 0.2rem 0.6rem;
  border-radius: 1rem;
  font-size: 0.75rem;
  font-weight: 500;
}

.info-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding: 0.5rem 0;
}

.info-item {
  font-size: 0.95rem;
  line-height: 1.5;
  display: flex;
  align-items: baseline;
}

.info-item strong {
  font-weight: 600;
  margin-right: 0.5rem;
  min-width: 90px;
}

/* 深色模式适配 */
:root[data-theme="dark"] .avatar-wrapper {
  border-color: var(--primary-color, #ffffff);
}

:root[data-theme="dark"] .user-type-badge {
  background-color: var(--primary-color, #ffffff);
  color: black;
}

/* 响应式调整 */
@media (max-width: 768px) {
  .info-item {
    font-size: 0.9rem;
  }
  
  .info-item strong {
    min-width: 80px;
  }
}

/* 按钮样式恢复 */
.btn {
  background: none;
  border: none;
  font-size: 0.85rem;
  font-weight: 500;
  padding: 0.5rem 1rem;
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

/* 深色模式按钮样式 */
:root[data-theme="dark"] .btn-primary {
  background-color: var(--btn-primary-bg, #ffffff);
  color: var(--btn-primary-text, #000000);
}
</style> 