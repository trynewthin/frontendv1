<template>
  <div class="chat-header">
    <div class="header-grid">
      <div class="back-button-container">
        <BackButton @click="goBack" />
      </div>
      <div class="contact-name">{{ loading ? '加载中...' : contactName }}</div>
      <div class="status-container">
        <div v-if="loading" class="loading-state">
          <va-progress-circle indeterminate color="primary" size="small" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, nextTick } from 'vue';
import BackButton from '@/components/button/BackButton.vue';
import { iconService } from '@/services';

onMounted(async () => {
  // 加载Lucide图标
  await iconService.loadLucideIcons();
  // 确保DOM已更新，然后手动创建图标
  nextTick(() => {
    if (window.lucide && window.lucide.createIcons) {
      window.lucide.createIcons();
    }
  });
});

// 定义组件属性
const props = defineProps({
  // 联系人名称
  contactName: {
    type: String,
    default: '聊天'
  },
  // 是否正在加载
  loading: {
    type: Boolean,
    default: false
  }
});

// 定义组件事件
const emit = defineEmits(['goBack']);

// 返回上一页 - 修改为关闭聊天界面
const goBack = (event) => {
  if (event) {
    // 阻止事件冒泡和默认行为
    event.stopPropagation && event.stopPropagation();
    event.preventDefault && event.preventDefault();
  }
  
  // 触发关闭聊天界面事件
  emit('goBack');
};
</script>

<style scoped>
.chat-header {
  padding: 12px 16px;
  border-bottom: 1px solid #e0e0e0;
  background-color: #f5f5f5;
  z-index: 10;
  width: 100%;
  box-sizing: border-box;
}

/* 深色模式下的聊天头部 */
:root[data-theme="dark"] .chat-header {
  background-color: var(--va-background);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.header-grid {
  display: grid;
  grid-template-columns: 1fr 2fr 1fr;
  align-items: center;
}

.back-button-container {
  justify-self: start;
}

.contact-name {
  font-size: 1.1rem;
  font-weight: 500;
  text-align: center;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  padding: 0 8px;
  color: #333;
}

/* 深色模式下的联系人名称 */
:root[data-theme="dark"] .contact-name {
  color: #ffffff;
}

.status-container {
  justify-self: end;
}

.loading-state {
  display: flex;
  justify-content: flex-end;
}

/* 响应式调整 */
@media (max-width: 768px) {
  .chat-header {
    padding: 10px;
  }
  
  .contact-name {
    font-size: 1rem;
  }
}
</style> 