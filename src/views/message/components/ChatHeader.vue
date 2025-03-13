<template>
  <div class="chat-header">
    <div class="header-grid">
      <div class="back-button-container">
        <button class="back-button" @click="goBack">
          <i data-lucide="chevron-left" class="lucide-icon"></i>
          <span class="back-text">返回</span>
        </button>
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
import { onMounted } from 'vue';
import { defineProps, defineEmits } from 'vue';
import { iconService } from '@/services';

onMounted(() => {
  // 加载Lucide图标
  iconService.loadLucideIcons();
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

// 返回上一页
const goBack = () => {
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

.header-grid {
  display: grid;
  grid-template-columns: 1fr 2fr 1fr;
  align-items: center;
}

.back-button-container {
  justify-self: start;
}

.back-button {
  display: flex;
  align-items: center;
  gap: 4px;
  background: none;
  border: none;
  color: #1976d2;
  cursor: pointer;
  padding: 6px 8px;
  border-radius: 4px;
  font-size: 0.9rem;
  transition: background-color 0.3s;
}

.back-button:hover {
  background-color: rgba(25, 118, 210, 0.1);
}

.lucide-icon {
  width: 20px;
  height: 20px;
  stroke-width: 2;
}

.contact-name {
  font-size: 1.1rem;
  font-weight: 500;
  text-align: center;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  padding: 0 8px;
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
  
  .back-text {
    display: none;
  }
  
  .back-button {
    padding: 4px;
  }
}
</style> 