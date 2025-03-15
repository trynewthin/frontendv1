<template>
  <div class="chat-input">
    <div class="input-container">
      <va-textarea
        v-model="message"
        :disabled="isLoading || isSending"
        placeholder="输入消息..."
        autosize
        class="message-textarea"
        @keydown="handleKeyDown"
      />
      <button
        class="send-button"
        @click="sendMessage"
        :disabled="!message.trim() || isLoading || isSending || isProcessing"
      >
        <i class="send-icon">
          <img src="/icons/send.svg" alt="发送" />
        </i>
      </button>
    </div>
    <div v-if="error" class="error-message">{{ error }}</div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue';

const props = defineProps({
  isLoading: {
    type: Boolean,
    default: false
  },
  isSending: {
    type: Boolean,
    default: false
  }
});

const emit = defineEmits(['send', 'scroll-to-bottom']);

const message = ref('');
const error = ref('');
let isProcessing = ref(false); // 修改为ref，以便在模板中使用

// 处理键盘事件
const handleKeyDown = (e) => {
  // 如果是回车键，并且没有按住Shift键，则发送消息
  if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault();
    sendMessage();
  }
};

// 发送消息
const sendMessage = () => {
  if (!message.value.trim() || props.isLoading || props.isSending || isProcessing.value) {
    return;
  }
  
  try {
    isProcessing.value = true; // 设置处理标志
    const messageContent = message.value.trim();
    emit('send', messageContent);
    message.value = '';
    error.value = '';
    
    // 发送消息后触发滚动到底部事件
    emit('scroll-to-bottom');
    
    // 延迟重置处理标志，防止重复发送
    setTimeout(() => {
      isProcessing.value = false;
    }, 500);
  } catch (err) {
    error.value = '发送消息失败，请重试';
    console.error('发送消息失败:', err);
    isProcessing.value = false;
  }
};

// 当发送状态从true变为false时，如果有错误，清除错误信息
watch(() => props.isSending, (newVal, oldVal) => {
  if (oldVal && !newVal && !error.value) {
    error.value = '';
  }
  
  // 发送完成后重置处理标志
  if (oldVal && !newVal) {
    isProcessing.value = false;
    // 发送消息成功完成后再次触发滚动到底部
    emit('scroll-to-bottom');
  }
});
</script>

<style scoped>
.chat-input {
  padding: 12px 16px;
  border-top: 1px solid #e0e0e0;
  background-color: #f5f5f5;
  width: 100%;
  box-sizing: border-box;
}

/* 深色模式下的聊天输入区域 */
:root[data-theme="dark"] .chat-input {
  background-color: var(--va-background);
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

.input-container {
  display: flex;
  align-items: flex-start;
  gap: 8px;
}

.message-textarea {
  flex: 1;
  border-radius: 20px;
  padding: 12px 16px;
  border: 1px solid #ddd;
  background-color: #fff;
  resize: none;
  max-height: 120px;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
  transition: border-color 0.3s, box-shadow 0.3s;
}

/* 深色模式下的输入框 */
:root[data-theme="dark"] .message-textarea {
  background-color: rgba(255, 255, 255, 0.05);
  border-color: rgba(255, 215, 0, 0.2);
  color: #ffffff;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
}

.message-textarea:focus {
  border-color: #1976d2;
  box-shadow: 0 1px 4px rgba(25, 118, 210, 0.2);
  outline: none;
}

/* 深色模式下的输入框聚焦样式 */
:root[data-theme="dark"] .message-textarea:focus {
  border-color: #FFD700;
  box-shadow: 0 1px 4px rgba(255, 215, 0, 0.2);
}

.send-button {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  border: none;
  background-color: #1976d2;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  padding: 0;
  transition: background-color 0.3s;
}

/* 深色模式下的发送按钮 */
:root[data-theme="dark"] .send-button {
  background-color: #FFD700;
}

.send-button:hover {
  background-color: #1565c0;
}

/* 深色模式下的发送按钮悬停样式 */
:root[data-theme="dark"] .send-button:hover {
  background-color: #FFC400;
}

.send-button:disabled {
  background-color: #bbdefb;
  cursor: not-allowed;
}

/* 深色模式下的禁用发送按钮 */
:root[data-theme="dark"] .send-button:disabled {
  background-color: rgba(255, 215, 0, 0.3);
}

.send-icon {
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.send-icon img {
  width: 100%;
  height: 100%;
}

/* 深色模式下的发送图标 */
:root[data-theme="dark"] .send-icon img {
  filter: brightness(0) invert(0.2); /* 调整滤镜使图标在深色模式下变为深色 */
}

/* 浅色模式下的发送图标 */
:root[data-theme="light"] .send-icon img {
  filter: brightness(0) invert(1); /* 使图标在浅色模式下变为白色 */
}

.error-message {
  color: #f44336;
  font-size: 0.8rem;
  margin-top: 8px;
  text-align: center;
}

/* 深色模式下的错误消息 */
:root[data-theme="dark"] .error-message {
  color: #ff6b6b;
}

/* 响应式调整 */
@media (max-width: 768px) {
  .chat-input {
    padding: 10px;
  }
  
  .message-textarea {
    padding: 10px 14px;
  }
  
  .send-button {
    width: 36px;
    height: 36px;
  }
  
  .send-icon {
    width: 18px;
    height: 18px;
  }
}
</style> 