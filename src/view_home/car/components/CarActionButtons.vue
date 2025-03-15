<template>
  <div class="action-buttons-card">
    <h2 class="section-title">操作</h2>
    <div class="action-buttons">
      <div class="button-wrapper">
        <button 
          @click="handleAppointmentClick" 
          class="native-button primary-button"
          type="button"
        >
          <span class="button-icon car-icon"></span>
          <span class="button-text">预约看车/试驾</span>
        </button>
      </div>
      
      <div class="button-wrapper">
        <ContactSellerButton
          v-if="carBasic.dealerId"
          :dealer-id="carBasic.dealerId"
          :car-id="carId"
          variant="secondary"
          class="action-button"
        />
      </div>
    </div>
    
    <!-- 登录确认对话框 -->
    <ModalDialog
      v-model="showLoginDialog"
      title="需要登录"
      message="您需要登录后才能执行此操作，是否前往登录页面？"
      confirm-text="前往登录"
      cancel-text="取消"
      @confirm="goToLogin"
    />
    
    <!-- 车辆状态提示对话框 -->
    <ModalDialog
      v-model="showStatusDialog"
      title="无法预约"
      :message="`该车辆当前${formatStatus(carBasic.status)}，无法预约`"
      confirm-text="确定"
      :cancel-text="null"
    />
    
    <!-- 预约对话框 -->
    <AppointmentModal
      v-model="showAppointmentModal"
      :car-basic="carBasic"
      :car-id="carId"
      @appointment-success="handleAppointmentSuccess"
    />
  </div>
</template>

<script setup>
import { defineProps, defineEmits, ref, onMounted, onUnmounted, computed } from 'vue';
import { toastService } from '@/services';
import { useRouter } from 'vue-router';
import ModalDialog from '@/components/modelwindow/ModalDialog.vue';
import AppointmentModal from './AppointmentModal.vue';
import { userAuthService } from '@/services/user';
import ContactSellerButton from '@/components/button/ContactSellerButton.vue';

const props = defineProps({
  carBasic: {
    type: Object,
    required: true
  },
  carId: {
    type: [String, Number],
    required: true
  }
});

const emit = defineEmits(['show-appointment']);
const router = useRouter();

// 初始化toast服务
toastService.init();

// 登录状态
const isLoggedIn = ref(false);
// 登录确认对话框显示状态
const showLoginDialog = ref(false);
// 车辆状态提示对话框显示状态
const showStatusDialog = ref(false);
// 预约对话框显示状态
const showAppointmentModal = ref(false);
// 记录当前操作类型（预约或聊天）
const currentAction = ref('');

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

// 格式化车辆状态
const formatStatus = (status) => {
  const statusMap = {
    0: '未上架',
    1: '在售中',
    2: '已售出',
    3: '已下架'
  };
  return statusMap[status] || '未知状态';
};

// 处理预约按钮点击
const handleAppointmentClick = () => {
  // 如果车辆不是"在售中"状态，显示状态提示对话框
  if (props.carBasic.status !== 1) {
    showStatusDialog.value = true;
    return;
  }
  
  // 如果未登录，显示登录确认对话框
  if (!isLoggedIn.value) {
    currentAction.value = 'appointment';
    showLoginDialog.value = true;
    return;
  }
  
  // 已登录，显示预约对话框
  showAppointmentModal.value = true;
};

// 处理预约成功
const handleAppointmentSuccess = () => {
  // 不再显示Toast提示，因为AppointmentModal.vue中已经有了更详细的提示
  // 此处留空，仅作为事件处理函数
};

// 前往登录页面
const goToLogin = () => {
  // 记录当前页面路径和操作，以便登录后返回
  const returnPath = router.currentRoute.value.fullPath;
  const returnAction = currentAction.value;
  
  // 存储到localStorage
  localStorage.setItem('loginReturnPath', returnPath);
  localStorage.setItem('loginReturnAction', returnAction);
  
  // 跳转到登录页面
  router.push('/auth/login');
};
</script>

<style scoped>
.action-buttons-card {
  padding: 1.5rem;
  border-radius: 8px;
  box-shadow: 0 1px 8px var(--va-shadow);
  margin-bottom: 2rem;
  background-color: var(--va-card-background);
  height: 100%;
  display: flex;
  flex-direction: column;
}

.section-title {
  font-size: 1.4rem;
  margin-bottom: 1.5rem;
  color: var(--va-text-primary);
  border-bottom: 1px solid var(--va-border);
  padding-bottom: 0.5rem;
}

.action-buttons {
  margin-top: 1.5rem;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  flex-grow: 1;
  justify-content: center;
}

.button-wrapper {
  position: relative;
  margin-bottom: 1rem;
  width: 100%;
}

.action-button {
  width: 100%;
}

/* 原生按钮样式 */
.native-button {
  width: 100%;
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
}

.primary-button {
  background-color: #333;
  color: white;
}

.primary-button:hover {
  background-color: #000;
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

.car-icon {
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23ffffff'%3E%3Cpath d='M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.21.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99zM6.5 16c-.83 0-1.5-.67-1.5-1.5S5.67 13 6.5 13s1.5.67 1.5 1.5S7.33 16 6.5 16zm11 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zM5 11l1.5-4.5h11L19 11H5z'/%3E%3C/svg%3E");
}

/* 深色模式样式 */
:root[data-theme="dark"] .action-buttons-card {
  background-color: #2a2a2a !important;
  box-shadow: 0 1px 8px rgba(0, 0, 0, 0.6) !important;
  border: 1px solid rgba(255, 255, 255, 0.1) !important;
}

:root[data-theme="dark"] .section-title {
  color: #ffffff !important;
  border-bottom-color: rgba(255, 255, 255, 0.1) !important;
}

:root[data-theme="dark"] .primary-button {
  background-color: #ffffff;
  color: #000;
}

:root[data-theme="dark"] .primary-button:hover {
  background-color: #e0e0e0;
}

:root[data-theme="dark"] .car-icon {
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23000000'%3E%3Cpath d='M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.21.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99zM6.5 16c-.83 0-1.5-.67-1.5-1.5S5.67 13 6.5 13s1.5.67 1.5 1.5S7.33 16 6.5 16zm11 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zM5 11l1.5-4.5h11L19 11H5z'/%3E%3C/svg%3E");
}

/* 响应式样式 */
@media (max-width: 768px) {
  .action-buttons {
    width: 100%;
  }
  
  .native-button {
    width: 100%;
    margin-bottom: 0.5rem;
  }
}
</style> 