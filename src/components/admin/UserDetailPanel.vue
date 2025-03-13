<template>
  <div class="user-detail-panel" v-if="visible">
    <div class="panel-header">
      <div class="title-with-back">
        <button class="back-btn" @click="closePanel">
          <i class="fa fa-arrow-left"></i>
          返回列表
        </button>
        <h3>用户详情</h3>
      </div>
      <button class="close-btn" @click="closePanel">
        <i class="fa fa-times"></i>
      </button>
    </div>
    
    <div class="panel-content">
      <div v-if="loading" class="loading-container">
        <div class="loading-spinner"></div>
        <p>加载中...</p>
      </div>
      
      <div v-else-if="error" class="error-container">
        <p class="error-message">{{ error }}</p>
        <button class="retry-btn" @click="loadUserDetail">重试</button>
      </div>
      
      <div v-else class="user-info-container">
        <!-- 使用UserInfoPanel组件显示用户信息 -->
        <UserInfoPanel 
          :user-info="userDetail" 
          @edit-profile="showEditProfile = true"
          @change-password="showChangePassword = true"
        />
        
        <!-- 编辑用户资料弹窗 -->
        <div class="modal-overlay" v-if="showEditProfile" @click.self="showEditProfile = false">
          <div class="modal-content">
            <UserEditProfile 
              :user-info="userDetail"
              @close="showEditProfile = false" 
              @success="handleProfileUpdated" 
            />
          </div>
        </div>
        
        <!-- 修改密码弹窗 -->
        <div class="modal-overlay" v-if="showChangePassword" @click.self="showChangePassword = false">
          <div class="modal-content">
            <UserChangePassword 
              @close="showChangePassword = false" 
              @success="handlePasswordUpdated" 
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue';
import UserInfoPanel from '../user/UserInfoPanel.vue';
import UserEditProfile from '../user/UserEditProfile.vue';
import UserChangePassword from '../user/UserChangePassword.vue';
import userAdminService from '../../api/userAdminService';

// 接收props
const props = defineProps({
  userId: {
    type: [Number, String],
    required: true
  },
  visible: {
    type: Boolean,
    default: false
  }
});

// 定义emit
const emit = defineEmits(['close', 'user-updated']);

// 状态
const loading = ref(false);
const error = ref('');
const userDetail = ref({});
const showEditProfile = ref(false);
const showChangePassword = ref(false);

// 监听userId变化，重新加载用户详情
watch(() => props.userId, (newVal) => {
  if (newVal && props.visible) {
    loadUserDetail();
  }
});

// 监听visible变化，当变为true时加载用户详情
watch(() => props.visible, (newVal) => {
  if (newVal && props.userId) {
    loadUserDetail();
  }
});

// 加载用户详情
const loadUserDetail = async () => {
  if (!props.userId) return;
  
  loading.value = true;
  error.value = '';
  
  try {
    const response = await userAdminService.getUserDetail(props.userId);
    
    if (response.success && response.data) {
      // 将后端返回的用户数据转换为前端需要的格式
      userDetail.value = formatUserData(response.data);
    } else {
      error.value = response.message || '获取用户详情失败';
    }
  } catch (err) {
    console.error('获取用户详情出错:', err);
    error.value = '获取用户详情时发生错误';
  } finally {
    loading.value = false;
  }
};

// 格式化用户数据，适配UserInfoPanel组件需要的格式
const formatUserData = (userData) => {
  // 处理用户状态
  const status = userData.status === 1 ? 'ACTIVE' : 'INACTIVE';
  
  return {
    id: userData.userId,
    username: userData.username,
    email: userData.email,
    phone: userData.phone,
    userType: userData.userType,
    registerTime: userData.registerTime,
    lastLoginTime: userData.lastLoginTime,
    status: status,
    avatar: userData.avatar,
    // 其他可能需要的字段
  };
};

// 处理资料更新
const handleProfileUpdated = () => {
  // 重新加载用户详情
  loadUserDetail();
  // 关闭编辑面板
  showEditProfile.value = false;
  // 通知父组件用户信息已更新
  emit('user-updated');
};

// 处理密码更新
const handlePasswordUpdated = () => {
  // 关闭密码修改面板
  showChangePassword.value = false;
  // 提示用户密码已更新
  alert('密码已成功修改');
};

// 关闭面板
const closePanel = () => {
  emit('close');
};

// 组件挂载时加载用户详情
onMounted(() => {
  if (props.visible && props.userId) {
    loadUserDetail();
  }
});
</script>

<style scoped>
.user-detail-panel {
  position: fixed;
  top: 0;
  right: 0;
  width: 500px;
  max-width: 100%;
  height: 100vh;
  background-color: white;
  box-shadow: -2px 0 8px rgba(0, 0, 0, 0.15);
  z-index: 1000;
  display: flex;
  flex-direction: column;
  animation: slideIn 0.3s ease-out;
}

@keyframes slideIn {
  from { transform: translateX(100%); }
  to { transform: translateX(0); }
}

.panel-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  border-bottom: 1px solid #eee;
  background-color: #f8f9fa;
}

.title-with-back {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.back-btn {
  background: none;
  border: none;
  color: #666;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem;
  font-size: 0.9rem;
}

.back-btn:hover {
  color: var(--va-primary);
}

.close-btn {
  background: none;
  border: none;
  font-size: 1.2rem;
  color: #666;
  cursor: pointer;
  padding: 0.5rem;
}

.close-btn:hover {
  color: #ff4d4f;
}

.panel-content {
  flex: 1;
  overflow-y: auto;
  padding: 1rem;
}

.loading-container,
.error-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 200px;
  gap: 1rem;
}

.loading-spinner {
  width: 2rem;
  height: 2rem;
  border: 3px solid rgba(0, 0, 0, 0.1);
  border-top-color: var(--va-primary);
  border-radius: 50%;
  animation: spin 1s infinite linear;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.error-message {
  color: #ff4d4f;
  text-align: center;
}

.retry-btn {
  background-color: #f5f5f5;
  border: 1px solid #ddd;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
}

.user-info-container {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

/* 弹窗样式 */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 2000;
}

.modal-content {
  background-color: white;
  padding: 1rem;
  border-radius: 8px;
  width: 90%;
  max-width: 600px;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

@media (max-width: 768px) {
  .user-detail-panel {
    width: 100%;
  }
}
</style> 