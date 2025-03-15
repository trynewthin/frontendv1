<template>
  <div class="user-panel-container">
    <div class="card user-info-panel">
      <div class="card-content">
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
          <div class="user-info-layout">
            <!-- 左侧：用户头像 -->
            <div class="avatar-section">
              <div class="avatar-wrapper" @click="uploadAvatar">
                <img 
                  :src="userInfo.avatar || '/images/avatars/default.png'" 
                  alt="用户头像"
                  class="user-avatar"
                />
                <div class="avatar-hover-overlay">
                  <span class="camera-icon">更换</span>
                </div>
              </div>
              <div class="username-display">{{ userInfo.username }}</div>
              <div class="user-type-badge">{{ formatUserType(userInfo.userType) }}</div>
            </div>
            
            <!-- 右侧：用户基本信息 -->
            <div class="info-section">
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
              
              <!-- 操作按钮 -->
              <div class="action-buttons">
                <button class="btn btn-primary" @click="openEditProfile">
                  编辑资料
                </button>
                <button class="btn btn-secondary" @click="openChangePassword">
                  修改密码
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <!-- 使用新的整合组件替代原来的两个模态框 -->
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
          if (result.avatarUrl) {
            userInfo.value.avatar = result.avatarUrl;
          } else if (result.data && result.data.avatarPath) {
            // 处理可能的不同格式返回
            const avatarPath = result.data.avatarPath;
            userInfo.value.avatar = avatarPath.startsWith('http') 
              ? avatarPath 
              : `${import.meta.env.VITE_API_IMAGE_URL || 'http://localhost:8090'}${avatarPath}`;
          }
          
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

.card {
  background-color: var(--card-bg-color, #ffffff);
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
  overflow: hidden;
  transition: all 0.3s ease;
  width: 100%;
  height: 100%;
  border: 1px solid var(--card-border-color, #eaeaea);
  color: var(--text-color, #333333);
  display: flex;
  flex-direction: column;
}

.card-content {
  padding: 1.25rem;
  flex: 1;
  display: flex;
  flex-direction: column;
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
  padding: 0;
  display: flex;
  flex-direction: column;
  flex: 1;
  position: relative;
  min-height: 200px; /* 确保最小高度 */
}

.user-info-layout {
  display: flex;
  gap: 1.5rem;
  flex: 1;
}

/* 左侧头像部分 */
.avatar-section {
  flex: 0 0 auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.75rem;
  padding: 0.5rem;
  width: 100px;
}

.avatar-wrapper {
  width: 90px;
  height: 90px;
  border-radius: 50%;
  overflow: hidden;
  border: 2px solid var(--avatar-border-color, #000000);
  padding: 2px;
  position: relative;
  cursor: pointer;
  transition: transform 0.2s ease;
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
  flex-direction: column;
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
  font-size: 1.5rem;
  margin-bottom: 0.25rem;
}

.upload-text {
  font-size: 0.7rem;
  text-align: center;
}

.user-avatar {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 50%;
}

.username-display {
  font-size: 1rem;
  font-weight: 600;
  color: var(--text-color, #333);
  margin-top: 0.2rem;
  text-align: center;
  word-break: break-all;
}

.user-type-badge {
  background-color: var(--badge-bg-color, #000000);
  color: var(--badge-text-color, #ffffff);
  padding: 0.2rem 0.6rem;
  border-radius: 1rem;
  font-size: 0.75rem;
  font-weight: 500;
  text-align: center;
}

/* 右侧信息部分 */
.info-section {
  flex: 1;
  display: flex;
  flex-direction: column;
  padding: 0.25rem 0;
  min-width: 0; /* 防止内容溢出 */
  align-items: flex-start; /* 确保内容靠左对齐 */
}

.info-list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  width: 100%; /* 确保列表占满整个宽度 */
  align-items: flex-start; /* 列表项靠左对齐 */
  margin-bottom: 4rem; /* 增加底部边距，为按钮留出更多空间 */
}

.info-item {
  font-size: 0.9rem;
  color: var(--text-color, #333);
  line-height: 1.4;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  width: 100%; /* 确保每个项目占满整个宽度 */
  text-align: left; /* 文本靠左对齐 */
}

.info-item strong {
  font-weight: 600;
  color: var(--label-color, #555);
}

/* 操作按钮 */
.action-buttons {
  display: flex;
  gap: 0.75rem;
  position: absolute;
  bottom: 0.75rem; /* 调整按钮位置，增加与底部的距离 */
  right: 1.25rem; /* 增加右侧边距 */
  padding: 1rem 0;
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

.btn-secondary {
  background-color: var(--btn-secondary-bg, #000000);
  color: var(--btn-secondary-text, #ffffff);
  border: 1px solid transparent;
  opacity: 0.85;
}

.btn-primary:hover {
  opacity: 0.9;
}

.btn-secondary:hover {
  opacity: 0.75;
}

@media (max-width: 768px) {
  .user-info-layout {
    flex-direction: column;
  }
  
  .avatar-section {
    padding-bottom: 0.75rem;
    margin-bottom: 0.75rem;
    width: 100%;
  }
  
  .info-item {
    white-space: normal;
  }
}

/* 深色模式变量 - 默认浅色主题 */
:root {
  /* 卡片基础样式 */
  --card-bg-color: #ffffff;
  --card-border-color: #eaeaea;
  --text-color: #333333;
  --border-color: #f0f0f0;
  --label-color: #555555;
  --spinner-color: #f3f3f3;
  
  /* 头像和标签 */
  --avatar-border-color: #000000;
  --badge-bg-color: #000000;
  --badge-text-color: #ffffff;
  
  /* 按钮 */
  --btn-primary-bg: #000000;
  --btn-primary-text: #ffffff;
  --btn-secondary-bg: #000000;
  --btn-secondary-text: #ffffff;
}

/* 深色模式样式 */
html[data-theme="dark"] .card,
:root[data-theme="dark"] .card {
  /* 卡片基础样式 */
  --card-bg-color: #1f1f1f;
  --card-border-color: #333333;
  --text-color: #e0e0e0;
  --border-color: #333333;
  --label-color: #cccccc;
  --spinner-color: #333333;
  
  /* 头像和标签 */
  --avatar-border-color: #ffffff;
  --badge-bg-color: #ffffff;
  --badge-text-color: #000000;
  
  /* 按钮 */
  --btn-primary-bg: #ffffff;
  --btn-primary-text: #000000;
  --btn-secondary-bg: #ffffff;
  --btn-secondary-text: #000000;
}
</style> 