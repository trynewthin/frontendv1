<template>
  <div class="action-buttons">
    <va-button @click="showAppointmentDialog" preset="primary" icon="directions_car" :disabled="!isLoggedIn || carBasic.status !== 1">
      预约看车/试驾
    </va-button>
    <ContactSellerButton 
      :dealer-id="carBasic.dealerId" 
      :car-id="carId" 
    />
    <p v-if="!isLoggedIn" class="login-tip">请先登录后再操作</p>
    <p v-else-if="carBasic.status !== 1" class="status-tip">该车辆当前{{ formatStatus(carBasic.status) }}，无法预约</p>
  </div>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue';
import ContactSellerButton from '@/components/message/ContactSellerButton.vue';

const props = defineProps({
  carBasic: {
    type: Object,
    required: true
  },
  carId: {
    type: [String, Number],
    required: true
  },
  isLoggedIn: {
    type: Boolean,
    required: true
  }
});

const emit = defineEmits(['show-appointment']);

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

// 显示预约对话框
const showAppointmentDialog = () => {
  emit('show-appointment');
};
</script>

<style scoped>
.action-buttons {
  margin-top: 1.5rem;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

.login-tip, 
.status-tip {
  margin-top: 0.5rem;
  color: var(--va-text-secondary);
  font-size: 0.9rem;
}

.action-buttons .va-button {
  margin-bottom: 1rem;
}

/* 深色模式样式 */
:root[data-theme="dark"] .login-tip, 
:root[data-theme="dark"] .status-tip {
  color: rgba(255, 255, 255, 0.7);
}

:root[data-theme="dark"] .action-buttons .va-button--primary {
  background-color: var(--va-primary) !important;
  color: #000 !important;
}

:root[data-theme="dark"] .action-buttons .va-button--secondary {
  background-color: var(--va-secondary) !important;
  color: var(--va-white) !important;
}

/* 响应式样式 */
@media (max-width: 768px) {
  .action-buttons {
    width: 100%;
  }
  
  .action-buttons .va-button {
    width: 100%;
    margin-bottom: 0.5rem;
  }
}
</style> 