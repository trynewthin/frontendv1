<template>
  <va-button
    class="appointment-button"
    preset="secondary"
    icon
    @click="goToAppointments"
    v-tooltip="'预约中心'"
  >
    <i class="appointment-icon">
      <img src="/icons/calendar.svg" alt="预约中心" />
    </i>
  </va-button>
</template>

<script setup>
import { useRouter } from 'vue-router';

const router = useRouter();

// 跳转到预约管理页面
const goToAppointments = () => {
  router.push('/appointments');
};
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