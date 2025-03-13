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
        @click.once="sendMessage"
        :disabled="!message.trim() || isLoading || isSending"
      >
        <i data-lucide="send" class="lucide-icon"></i>
      </button>
    </div>
    <div v-if="error" class="error-message">{{ error }}</div>
  </div>
</template>

<script setup>
import { ref, watch, onMounted, nextTick } from 'vue';
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

const emit = defineEmits(['send']);

const message = ref('');
const error = ref('');
let isProcessing = false; // 防止重复发送的标志

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
  if (!message.value.trim() || props.isLoading || props.isSending || isProcessing) {
    return;
  }
  
  try {
    isProcessing = true; // 设置处理标志
    const messageContent = message.value.trim();
    emit('send', messageContent);
    message.value = '';
    error.value = '';
    // 延迟重置处理标志，防止重复发送
    setTimeout(() => {
      isProcessing = false;
    }, 500);
  } catch (err) {
    error.value = '发送消息失败，请重试';
    console.error('发送消息失败:', err);
    isProcessing = false;
  }
};

// 当发送状态从true变为false时，如果有错误，清除错误信息
watch(() => props.isSending, (newVal, oldVal) => {
  if (oldVal && !newVal && !error.value) {
    error.value = '';
  }
  
  // 发送完成后重置处理标志
  if (oldVal && !newVal) {
    isProcessing = false;
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

.message-textarea:focus {
  border-color: #1976d2;
  box-shadow: 0 1px 4px rgba(25, 118, 210, 0.2);
  outline: none;
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

.send-button:hover {
  background-color: #1565c0;
}

.send-button:disabled {
  background-color: #bbdefb;
  cursor: not-allowed;
}

.lucide-icon {
  width: 20px;
  height: 20px;
  stroke-width: 2;
  color: white;
}

.error-message {
  color: #f44336;
  font-size: 0.8rem;
  margin-top: 8px;
  text-align: center;
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
  
  .lucide-icon {
    width: 18px;
    height: 18px;
  }
}
</style> 