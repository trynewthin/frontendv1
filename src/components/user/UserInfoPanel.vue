<template>
  <div class="user-panel-container">
    <va-card class="user-info-panel">
      <va-card-title class="panel-title">个人信息</va-card-title>
      
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
        
        <div v-else class="user-info-content">
          <div class="user-info-layout">
            <!-- 左侧：用户头像 -->
            <div class="avatar-section">
              <va-avatar 
                :src="userInfo.avatar || '/images/avatars/default.png'" 
                size="medium" 
                class="user-avatar"
              />
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
                <va-button preset="primary" @click="openEditProfile" size="small">
                  编辑资料
                </va-button>
                <va-button preset="secondary" @click="openChangePassword" size="small">
                  修改密码
                </va-button>
              </div>
            </div>
          </div>
        </div>
      </va-card-content>
    </va-card>
    
    <!-- 编辑资料弹窗 -->
    <va-modal v-model="showEditProfileModal" hide-default-actions size="large" class="edit-profile-modal">
      <UserEditProfile 
        @close="closeEditProfile" 
        @success="handleProfileUpdateSuccess" 
        @avatar-updated="handleAvatarUpdated"
      />
    </va-modal>
    
    <!-- 修改密码弹窗 -->
    <va-modal v-model="showChangePasswordModal" hide-default-actions size="large" class="change-password-modal">
      <UserChangePassword @close="closeChangePassword" @success="handlePasswordUpdateSuccess" />
    </va-modal>
  </div>
</template>

<script setup>
import { ref, onMounted, defineProps, defineEmits } from 'vue';
import authService from '../../api/authService';
import UserEditProfile from './UserEditProfile.vue';
import UserChangePassword from './UserChangePassword.vue';

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
const showEditProfileModal = ref(false);
const showChangePasswordModal = ref(false);

// 打开编辑资料弹窗
const openEditProfile = () => {
  console.log('触发编辑资料事件');
  emit('edit-profile');
};

// 关闭编辑资料弹窗
const closeEditProfile = () => {
  showEditProfileModal.value = false;
};

// 打开修改密码弹窗
const openChangePassword = () => {
  console.log('触发修改密码事件');
  emit('change-password');
};

// 关闭修改密码弹窗
const closeChangePassword = () => {
  showChangePasswordModal.value = false;
};

// 处理资料更新成功
const handleProfileUpdateSuccess = () => {
  closeEditProfile();
  fetchUserInfo();
};

// 处理密码更新成功
const handlePasswordUpdateSuccess = () => {
  closeChangePassword();
};

// 处理头像更新
const handleAvatarUpdated = async () => {
  console.log('收到头像更新事件，立即刷新用户信息');
  await fetchUserInfo();
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
}

.user-info-panel {
  width: auto;
  height: auto;
  max-width: 500px; /* 限制最大宽度 */
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  margin: 0;
}

.panel-title {
  font-size: 1rem;
  padding: 0.5rem 0.75rem;
  border-bottom: 1px solid #f0f0f0;
}

.panel-content {
  padding: 0.5rem;
}

.loading-container,
.error-container,
.success-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 1rem;
  gap: 0.75rem;
  text-align: center;
}

.success-container {
  color: var(--va-success);
}

.user-info-content {
  padding: 0;
}

.user-info-layout {
  display: flex;
  gap: 0.75rem;
}

/* 左侧头像部分 */
.avatar-section {
  flex: 0 0 auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.3rem;
  padding: 0.4rem;
  border-right: 1px solid #eee;
  width: 80px;
}

.user-avatar {
  width: 70px;
  height: 70px;
  border: 2px solid var(--va-primary);
}

.username-display {
  font-size: 0.95rem;
  font-weight: 600;
  color: #333;
  margin-top: 0.2rem;
  text-align: center;
  word-break: break-all;
}

.user-type-badge {
  background-color: var(--va-primary);
  color: white;
  padding: 0.15rem 0.5rem;
  border-radius: 1rem;
  font-size: 0.7rem;
  font-weight: 500;
  text-align: center;
}

/* 右侧信息部分 */
.info-section {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 0.25rem 0;
  min-width: 0; /* 防止内容溢出 */
}

.info-list {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.info-item {
  font-size: 0.85rem;
  color: #333;
  line-height: 1.3;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.info-item strong {
  font-weight: 600;
  color: #555;
}

.action-buttons {
  display: flex;
  gap: 0.5rem;
  margin-top: 0.75rem;
  justify-content: flex-start;
}

/* 弹窗样式 */
.edit-profile-modal, .change-password-modal {
  padding: 0;
}

@media (max-width: 768px) {
  .user-info-layout {
    flex-direction: column;
  }
  
  .avatar-section {
    border-right: none;
    border-bottom: 1px solid #eee;
    padding-bottom: 0.75rem;
    margin-bottom: 0.75rem;
    width: 100%;
  }
  
  .info-item {
    white-space: normal;
  }
}
</style> 