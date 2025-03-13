<template>
  <div class="chat-container" ref="chatContainer">
    <!-- 加载更多按钮 -->
    <div class="load-more-container" v-if="hasMoreMessages && !isLoadingMore">
      <va-button @click="handleLoadMore" size="small" preset="secondary">加载更多</va-button>
    </div>
    
    <!-- 加载更多状态 -->
    <div class="loading-more" v-if="isLoadingMore">
      <va-progress-circle indeterminate size="small" />
      <span>加载更多消息...</span>
    </div>
    
    <!-- 消息内容区域 -->
    <div class="messages-container">
      <div v-if="messages.length === 0 && !isLoading" class="empty-messages">
        <va-icon name="forum" size="large" />
        <p>{{ errorMessage || '暂无消息记录' }}</p>
      </div>
      
      <template v-else>
        <div 
          v-for="(message, index) in messages" 
          :key="message.id || index" 
          class="message-item"
          :class="{ 
            'message-sent': message.fromUserId == currentUserId,
            'message-received': message.fromUserId != currentUserId
          }"
        >
          <!-- 用户头像 -->
          <div class="message-avatar" v-if="message.fromUserId != currentUserId">
            <img :src="message.fromUserAvatar || '/images/avatars/default.png'" alt="avatar" />
            <div class="user-name">
              {{ message.fromUserId == contactId ? contactName : (message.fromUserName || '用户') }}
            </div>
          </div>
          
          <!-- 消息气泡 -->
          <div class="message-bubble">
            <div class="message-content">{{ message.content }}</div>
          </div>
          <!-- 消息时间 - 独立于气泡 -->
          <div class="message-time" :class="{ 'time-sent': message.fromUserId == currentUserId, 'time-received': message.fromUserId != currentUserId }">
            {{ formatMessageTime(message.sendTime) }}
          </div>
        </div>
      </template>
    </div>
  </div>
</template>

<script setup>
import { ref, defineProps, defineExpose, defineEmits, onMounted, onUpdated, watchEffect, onBeforeUnmount } from 'vue';
import authService from '@/api/authService';
import { useToast } from 'vuestic-ui';
import { chatMessageService } from '@/services';

// 初始化toast
const { init: initToast } = useToast();

// 定义组件属性
const props = defineProps({
  // 当前用户ID
  currentUserId: {
    type: [Number, String],
    required: true
  },
  // 联系人ID
  contactId: {
    type: [Number, String],
    default: null
  },
  // 联系人名称
  contactName: {
    type: String,
    default: ''
  },
  // 车辆ID
  carId: {
    type: [Number, String],
    default: null
  },
  // 是否自动加载
  autoLoad: {
    type: Boolean,
    default: true
  },
  // 是否启用自动轮询
  enablePolling: {
    type: Boolean,
    default: true
  },
  // 轮询间隔(毫秒)
  pollingInterval: {
    type: Number,
    default: 5000
  }
});

// 定义事件
const emit = defineEmits(['loadMore', 'messagesLoaded', 'messageError']);

// 聊天容器引用
const chatContainer = ref(null);

// 消息状态
const messages = ref([]);
const isLoading = ref(true);
const isLoadingMore = ref(false);
const errorMessage = ref('');
const hasMoreMessages = ref(false);
const currentPage = ref(1);
const pageSize = ref(20);
const totalMessages = ref(0);
const pollInterval = ref(null);

// 格式化消息时间
const formatMessageTime = (dateStr) => {
  return chatMessageService.formatMessageTime(dateStr);
};

// 滚动到底部
const scrollToBottom = () => {
  if (chatContainer.value) {
    chatContainer.value.scrollTop = chatContainer.value.scrollHeight;
  }
};

// 加载消息
const loadMessages = async (page = 1, append = false) => {
  if (!props.contactId || !authService.isLoggedIn()) {
    errorMessage.value = '无法加载消息';
    isLoading.value = false;
    emit('messageError', '无法加载消息');
    return;
  }
  
  if (page === 1) {
    isLoading.value = true;
  } else {
    isLoadingMore.value = true;
  }
  
  errorMessage.value = '';
  
  try {
    // 使用chatMessageService获取聊天记录
    const response = await chatMessageService.getChatMessages(props.contactId, {
      carId: props.carId,
      page: page,
      size: pageSize.value
    });
    
    console.log('加载消息响应:', response);
    
    if (response.success) {
      // 获取消息列表
      const messageList = response.data || [];
      
      if (append) {
        // 追加消息到列表前面（历史消息应该在前面）
        messages.value = [...messageList.reverse(), ...messages.value];
      } else {
        // 覆盖消息列表（最新消息）
        messages.value = messageList.reverse();
      }
      
      // 更新分页信息
      totalMessages.value = response.total || 0;
      currentPage.value = page;
      hasMoreMessages.value = response.hasMore;
      
      // 发出消息加载完成事件
      emit('messagesLoaded', {
        messages: messages.value,
        total: totalMessages.value,
        hasMore: hasMoreMessages.value
      });
    } else {
      console.error('加载消息响应无效:', response);
      errorMessage.value = response.message || '获取消息失败';
      emit('messageError', errorMessage.value);
    }
  } catch (err) {
    console.error('加载消息失败:', err);
    errorMessage.value = '加载消息失败，请重试';
    emit('messageError', errorMessage.value);
  } finally {
    isLoading.value = false;
    isLoadingMore.value = false;
  }
};

// 加载更多消息（历史消息）
const handleLoadMore = () => {
  if (hasMoreMessages.value && !isLoadingMore.value) {
    loadMessages(currentPage.value + 1, true);
    emit('loadMore');
  }
};

// 添加新消息
const addMessage = (message) => {
  messages.value.push(message);
  setTimeout(scrollToBottom, 50);
};

// 刷新消息（只获取最新的消息）
const refreshMessages = async () => {
  if (!props.contactId || !authService.isLoggedIn()) return;
  
  try {
    // 使用chatMessageService获取最新消息
    const response = await chatMessageService.getChatMessages(props.contactId, {
      carId: props.carId,
      page: 1,
      size: 10
    });
    
    if (response.success && response.data && response.data.length > 0) {
      // 获取消息列表并反转（最新的在后面）
      const latestMessages = [...response.data].reverse();
      
      // 过滤出新消息（当前列表中没有的消息）
      const existingIds = new Set(messages.value.map(m => m.id));
      const newMessages = latestMessages.filter(msg => !existingIds.has(msg.id));
      
      if (newMessages.length > 0) {
        // 追加新消息
        messages.value = [...messages.value, ...newMessages];
        // 滚动到底部
        scrollToBottom();
      }
    }
  } catch (err) {
    console.error('刷新消息失败:', err);
  }
};

// 启动轮询
const startPolling = () => {
  if (!props.enablePolling) return;
  
  // 清除可能存在的旧轮询
  if (pollInterval.value) {
    clearInterval(pollInterval.value);
  }
  
  // 每隔一段时间拉取一次新消息
  pollInterval.value = setInterval(() => {
    if (!isLoading.value && !isLoadingMore.value) {
      refreshMessages();
    }
  }, props.pollingInterval);
};

// 停止轮询
const stopPolling = () => {
  if (pollInterval.value) {
    clearInterval(pollInterval.value);
    pollInterval.value = null;
  }
};

// 重载消息
const reloadMessages = () => {
  currentPage.value = 1;
  loadMessages(1, false);
};

// 组件挂载后执行
onMounted(() => {
  if (props.autoLoad) {
    loadMessages();
  }
  
  if (props.enablePolling) {
    startPolling();
  }
});

// 组件销毁前停止轮询
onBeforeUnmount(() => {
  stopPolling();
});

// 当消息更新时，保持滚动位置在底部
onUpdated(scrollToBottom);

// 提供方法给父组件
defineExpose({
  scrollToBottom,
  loadMessages,
  refreshMessages,
  reloadMessages,
  addMessage,
  messages,
  isLoading,
  hasMoreMessages,
  errorMessage
});
</script>

<style scoped>
.chat-container {
  flex: 1;
  overflow-y: auto;
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  width: 100%;
  box-sizing: border-box;
}

.messages-container {
  display: flex;
  flex-direction: column;
  gap: 8px;
  max-width: 100%;
}

.load-more-container {
  display: flex;
  justify-content: center;
  margin-bottom: 16px;
}

.loading-more {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 16px;
  gap: 8px;
  color: #888;
  font-size: 0.9rem;
}

.empty-messages {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 16px;
  padding: 32px;
  color: #888;
  text-align: center;
}

.message-item {
  display: flex;
  flex-direction: column;
  margin-bottom: 16px;
  max-width: 85%;
}

.message-avatar {
  display: flex;
  align-items: center;
  margin-bottom: 8px;
}

.message-avatar img {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  margin-right: 8px;
}

.user-name {
  font-size: 0.9rem;
  color: #888;
}

.message-bubble {
  min-width: 80px;
  min-height: 40px;
  max-width: 100%;
  padding: 12px 16px;
  border-radius: 18px;
  position: relative;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
  display: inline-block;
}

.message-sent {
  align-self: flex-end;
}

.message-sent .message-bubble {
  background-color: #dcf8c6;
  border-top-right-radius: 4px;
  margin-left: auto;
}

.message-received {
  align-self: flex-start;
}

.message-received .message-bubble {
  background-color: #ffffff;
  border-top-left-radius: 4px;
  margin-right: auto;
}

.message-content {
  font-size: 1rem;
  line-height: 1.4;
  word-break: break-word;
  white-space: pre-wrap;
  text-align: left;
}

.message-time {
  font-size: 0.7rem;
  color: #888;
  margin-top: 4px;
  padding: 0 4px;
}

.time-sent {
  text-align: right;
  align-self: flex-end;
}

.time-received {
  text-align: left;
  align-self: flex-start;
}

/* 响应式调整 */
@media (max-width: 768px) {
  .chat-container {
    padding: 10px;
  }
  
  .empty-messages {
    padding: 20px;
  }
  
  .message-item {
    max-width: 90%;
  }
  
  .message-bubble {
    padding: 10px 14px;
    min-width: 60px;
  }
  
  .message-content {
    font-size: 0.95rem;
  }
  
  .message-time {
    font-size: 0.65rem;
  }
}
</style> 