<template>
  <button
    @click="handleContactClick"
    class="contact-button"
    :class="[
      variant === 'primary' ? 'primary' : '',
      size === 'small' ? 'small' : ''
    ]"
    type="button"
  >
    <span class="button-icon chat-icon"></span>
    <span class="button-text">{{ buttonText }}</span>
  </button>
  
  <!-- 登录确认对话框 -->
  <ModalDialog
    v-if="showLoginDialog"
    v-model="showLoginDialog"
    title="需要登录"
    message="您需要登录后才能执行此操作，是否前往登录页面？"
    confirm-text="前往登录"
    cancel-text="取消"
    @confirm="goToLogin"
  />
</template>

<script setup>
import { ref, onMounted, onUnmounted, defineProps } from 'vue';
import { useRouter } from 'vue-router';
import { toastService } from '@/services';
import { userAuthService, dealerUserService } from '@/services/user';
import ModalDialog from '@/components/modelwindow/ModalDialog.vue';

const props = defineProps({
  dealerId: {
    type: [String, Number],
    required: true
  },
  carId: {
    type: [String, Number],
    default: null
  },
  buttonText: {
    type: String,
    default: '在线聊天'
  },
  variant: {
    type: String,
    default: 'secondary' // 'primary' 或 'secondary'
  },
  size: {
    type: String,
    default: 'normal' // 'small' 或 'normal'
  }
});

const router = useRouter();

// 登录状态
const isLoggedIn = ref(false);
// 登录确认对话框显示状态
const showLoginDialog = ref(false);

// 检查登录状态
const checkLoginStatus = async () => {
  isLoggedIn.value = await userAuthService.isLoggedIn();
};

// 组件挂载时检查登录状态
onMounted(() => {
  checkLoginStatus();
  
  // 监听登录状态变化事件
  window.addEventListener('auth-state-changed', checkLoginStatus);
});

// 组件卸载时移除事件监听
onUnmounted(() => {
  window.removeEventListener('auth-state-changed', checkLoginStatus);
});

// 处理联系按钮点击
const handleContactClick = async () => {
  // 如果未登录，显示登录确认对话框
  if (!isLoggedIn.value) {
    showLoginDialog.value = true;
    return;
  }
  
  // 已登录，获取经销商用户ID并跳转到聊天页面
  try {
    const dealerId = props.dealerId;
    
    if (!dealerId) {
      toastService.error('无法获取经销商信息');
      return;
    }
    
    // 调用服务将经销商ID转换为用户ID
    const result = await dealerUserService.getDealerUserId(dealerId);
    
    if (!result.success || !result.userId) {
      toastService.warning(result.message || '无法获取经销商用户信息');
      return;
    }
    
    // 跳转到聊天页面，使用用户ID作为contactId路由参数
    router.push({
      path: `/chat/${result.userId}`,
      query: props.carId ? { carId: props.carId } : {}
    });
  } catch (error) {
    console.error('联系经销商失败:', error);
    toastService.error('联系经销商失败，请稍后再试');
  }
};

// 前往登录页面
const goToLogin = () => {
  // 记录当前页面路径和操作，以便登录后返回
  const returnPath = router.currentRoute.value.fullPath;
  
  // 存储到localStorage
  localStorage.setItem('loginReturnPath', returnPath);
  localStorage.setItem('loginReturnAction', 'contact');
  
  // 跳转到登录页面
  router.push('/auth/login');
};
</script>

<style scoped>
.contact-button {
  padding: 12px 16px;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
  border: none;
  background-color: #f5f5f5;
  color: #333;
  border: 1px solid #ddd;
}

.contact-button:hover {
  background-color: #e8e8e8;
}

.contact-button.primary {
  background-color: #333;
  color: white;
  border: none;
}

.contact-button.primary:hover {
  background-color: #000;
}

.contact-button.small {
  padding: 8px 12px;
  font-size: 14px;
  border-radius: 6px;
}

.button-icon {
  display: inline-block;
  width: 20px;
  height: 20px;
  margin-right: 8px;
  background-repeat: no-repeat;
  background-position: center;
  background-size: contain;
}

.chat-icon {
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23333333'%3E%3Cpath d='M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z'/%3E%3C/svg%3E");
}

/* 深色模式样式 */
:root[data-theme="dark"] .contact-button {
  background-color: #333;
  color: #e0e0e0;
  border-color: #444;
}

:root[data-theme="dark"] .contact-button:hover {
  background-color: #444;
}

:root[data-theme="dark"] .contact-button.primary {
  background-color: #ffffff;
  color: #000;
  border: none;
}

:root[data-theme="dark"] .contact-button.primary:hover {
  background-color: #e0e0e0;
}

:root[data-theme="dark"] .chat-icon {
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23e0e0e0'%3E%3Cpath d='M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z'/%3E%3C/svg%3E");
}

/* 主要按钮深色模式下的图标 */
:root[data-theme="dark"] .contact-button.primary .chat-icon {
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23000000'%3E%3Cpath d='M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z'/%3E%3C/svg%3E");
}
</style> 