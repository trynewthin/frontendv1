<template>
  <div class="message-header">
    <div class="header-left">
      <HomeButton />
    </div>
    <div class="header-center">
      <h2 class="page-title">{{ title }}</h2>
    </div>
    <div class="header-right">
      <slot name="right-content"></slot>
    </div>
  </div>
</template>

<script setup>
import { defineProps } from 'vue';
import HomeButton from '../button/HomeButton.vue';

const props = defineProps({
  title: {
    type: String,
    default: '页面标题'
  }
});
</script>

<style scoped>
.message-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.8rem 1rem;
  background-color: #fff;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
  width: 100%;
  z-index: 10;
  flex-shrink: 0;
  /* 防止文字被选择 */
  user-select: none;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
}

/* 深色模式下的标题栏 */
:root[data-theme="dark"] .message-header {
  background-color: var(--va-background);
  box-shadow: 0 2px 12px rgba(255, 215, 0, 0.1);
}

.header-left, .header-right {
  flex: 1;
  display: flex;
  align-items: center;
}

.header-left {
  justify-content: flex-start;
}

.header-right {
  justify-content: flex-end;
}

.header-center {
  flex: 2;
  display: flex;
  justify-content: center;
  align-items: center;
}

.page-title {
  margin: 0;
  font-size: 1.25rem;
  font-weight: 600;
  text-align: center;
  color: #333;
  /* 防止文字被选择 */
  user-select: none;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
}

/* 深色模式下的页面标题 */
:root[data-theme="dark"] .page-title {
  color: #ffffff;
}

@media (max-width: 768px) {
  .message-header {
    padding: 0.5rem 0.8rem;
  }
  
  .page-title {
    font-size: 1.1rem;
  }
}
</style> 