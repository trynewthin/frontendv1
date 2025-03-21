<template>
  <va-button
    class="appointment-button"
    preset="secondary"
    icon
    @click="goToAppointments"
    v-tooltip="'预约管理'"
  >
    <i class="appointment-icon">
      <img src="/icons/calendar.svg" alt="预约管理" />
    </i>
  </va-button>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import authService from '@/api/authService';

const router = useRouter();
const isDealer = ref(false);

// 检测当前用户是否为经销商
const checkUserRole = async () => {
  try {
    const result = await authService.fetchUserProfile();
    if (result.success && result.data) {
      // 判断用户类型是否为DEALER
      isDealer.value = result.data.userType === 'DEALER';
      console.log('用户是经销商:', isDealer.value);
    }
  } catch (err) {
    console.error('获取用户信息出错:', err);
  }
};

// 跳转到预约管理页面
const goToAppointments = () => {
  // 如果是经销商，跳转到经销商的预约管理页面
  if (isDealer.value) {
    router.push('/dealer/appointments');
  } else {
    // 普通用户跳转到预约中心
    router.push('/appointments');
  }
};

// 组件挂载时检查用户角色
onMounted(async () => {
  await checkUserRole();
});
</script>

<style scoped>
.appointment-button {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
}

.appointment-icon {
  width: 20px;
  height: 20px;
  transition: transform 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.appointment-icon img {
  width: 100%;
  height: 100%;
}

.appointment-button:hover .appointment-icon {
  transform: rotate(15deg); /* 悬停时轻微旋转 */
}

/* 深色模式下的样式 */
:root[data-theme="dark"] .appointment-icon {
  color: white;
}

/* 浅色模式下的样式 */
:root[data-theme="light"] .appointment-icon {
  color: black;
}

/* 深色模式下的样式 */
:root[data-theme="dark"] .appointment-icon img {
  filter: brightness(0) invert(1); /* 反转颜色使其在深色背景下显示为白色 */
}

/* 浅色模式下的样式 */
:root[data-theme="light"] .appointment-icon img {
  filter: none;
}
</style> 