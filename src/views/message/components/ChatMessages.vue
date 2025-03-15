<template>
  <div class="chat-container chat-messages" ref="chatContainer">
    <!-- 加载更多按钮 - 放在容器顶部，使用绝对定位和高斯模糊效果 -->
    <div class="load-more-container" v-if="hasMoreMessages && !isLoadingMore">
      <div class="load-more-blur-backdrop"></div>
      <LoadMoreButton @loadMore="handleLoadMore" />
    </div>
    
    <!-- 加载更多状态 -->
    <div class="loading-more" v-if="isLoadingMore">
      <div class="load-more-blur-backdrop"></div>
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
            'message-sent': message.fromUserId == currentUserId && message.fromUserId !== 'system',
            'message-received': message.fromUserId != currentUserId && message.fromUserId !== 'system',
            'message-system': message.fromUserId === 'system' || message.isSystemMessage
          }"
        >
          <!-- 系统消息 -->
          <div v-if="message.fromUserId === 'system' || message.isSystemMessage" class="system-message">
            <div class="system-icon">
              <va-icon name="notifications" size="large" color="#f5a623" />
            </div>
            <div class="system-content">
              <div class="system-title">{{ message.fromUserName || '系统通知' }}</div>
              <div class="system-bubble">
                <div v-if="message.title" class="message-title">{{ message.title }}</div>
                <div class="message-content">{{ message.content }}</div>
              </div>
              <div class="message-time">
                {{ formatMessageTime(message.sendTime) }}
              </div>
            </div>
          </div>
          
          <!-- 用户消息 -->
          <template v-else>
            <!-- 用户头像 -->
            <div class="message-avatar" v-if="message.fromUserId != currentUserId">
              <img :src="getAvatarUrl(message.fromUserAvatar || '/images/avatars/default.png')" alt="avatar" />
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
          </template>
        </div>
      </template>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUpdated, watchEffect, onBeforeUnmount, nextTick } from 'vue';
import authService from '@/api/authService';
import dealerService from '@/api/dealerService';
import { useToast } from 'vuestic-ui';
import { chatMessageService, messageService, userInfoService } from '@/services';
import LoadMoreButton from '@/components/button/LoadMoreButton.vue';

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
const contactUsers = ref(new Map()); // 缓存联系人信息

// 格式化消息时间
const formatMessageTime = (dateStr) => {
  if (!dateStr) return '';
  return chatMessageService.formatMessageTime(dateStr);
};

// 滚动到底部
const scrollToBottom = () => {
  if (chatContainer.value) {
    chatContainer.value.scrollTop = chatContainer.value.scrollHeight + 1000;
    
    // 尝试获取消息容器
    const messagesContainer = document.querySelector('.messages-container');
    if (messagesContainer) {
      messagesContainer.scrollTop = messagesContainer.scrollHeight + 1000;
    }
  }
};

// 获取用户信息并更新头像
const fetchAndUpdateUserInfo = async (userId) => {
  // 如果已经有缓存，跳过
  if (contactUsers.value.has(userId)) return;
  
  try {
    // 尝试使用userInfoService获取用户信息
    try {
      const userResponse = await userInfoService.getUserInfo(userId);
      if (userResponse.success && userResponse.data) {
        console.log('获取用户信息成功:', {
          userId,
          userData: userResponse.data,
          avatar: userResponse.data.avatar
        });
        // 保存到缓存
        contactUsers.value.set(userId, userResponse.data);
        
        // 更新消息列表中的用户信息
        messages.value = messages.value.map(message => {
          if (message.fromUserId === userId) {
            return {
              ...message,
              fromUserAvatar: userResponse.data.avatar,
              fromUserName: userResponse.data.username
            };
          }
          return message;
        });
        return;
      }
    } catch (userError) {
      console.error('通过userInfoService获取用户信息失败:', userError);
      // 继续尝试其他方法获取用户信息
    }
    
    // 作为备选，尝试获取经销商信息
    try {
      const dealerResponse = await dealerService.getDealerDetail(userId);
      if (dealerResponse.success && dealerResponse.data) {
        console.log('获取经销商信息成功:', {
          userId,
          dealerData: dealerResponse.data,
          avatar: dealerResponse.data.avatar
        });
        // 保存到缓存
        contactUsers.value.set(userId, dealerResponse.data);
        
        // 更新消息列表中的用户信息
        messages.value = messages.value.map(message => {
          if (message.fromUserId === userId) {
            return {
              ...message,
              fromUserAvatar: dealerResponse.data.avatar,
              fromUserName: dealerResponse.data.username
            };
          }
          return message;
        });
        return;
      }
    } catch (dealerError) {
      console.error('通过dealerService获取经销商信息失败:', dealerError);
    }
  } catch (err) {
    console.error('获取用户信息失败:', err);
  }
};

// 加载消息
const loadMessages = async (page = 1, append = false) => {
  if (!authService.isLoggedIn()) {
    errorMessage.value = '用户未登录，无法加载消息';
    isLoading.value = false;
    emit('messageError', '用户未登录，无法加载消息');
    return;
  }
  
  if (page === 1) {
    isLoading.value = true;
  } else {
    isLoadingMore.value = true;
  }
  
  errorMessage.value = '';
  
  try {
    console.log('开始加载消息，参数:', { contactId: props.contactId, carId: props.carId, page, size: pageSize.value });
    
    let chatResponse = { success: false, data: [] };
    
    // 获取系统消息 - 只有在查看系统通知时才加载
    if (props.contactId === 'system' || props.contactId === 1 || props.contactId === '1') {
      try {
        // 不再使用特殊的系统消息API，而是使用通用消息API
        chatResponse = await chatMessageService.getChatMessages(props.contactId, {
          carId: props.carId,
          page: page,
          size: pageSize.value
        });
        console.log('系统消息加载成功:', chatResponse);
      } catch (sysErr) {
        console.error('加载系统消息失败:', sysErr);
        chatResponse = { success: false, data: [] };
      }
    } 
    // 获取聊天消息 - 只有在联系人ID不是系统时才加载
    else if (props.contactId && props.contactId !== 'system' && props.contactId !== 1 && props.contactId !== '1') {
      try {
        chatResponse = await chatMessageService.getChatMessages(props.contactId, {
          carId: props.carId,
          page: page,
          size: pageSize.value
        });
        console.log('聊天消息加载成功:', chatResponse);
      } catch (chatErr) {
        console.error('加载聊天消息失败:', chatErr);
        chatResponse = { success: false, data: [] };
      }
    } else {
      console.log('未指定联系人ID或是系统消息，跳过相应消息加载');
    }
    
    // 处理聊天消息
    const chatMessages = chatResponse.success ? (chatResponse.data || []) : [];
    
    // 系统消息直接使用聊天消息结果，不单独处理
    let systemMessages = [];
    
    console.log('系统消息数量:', systemMessages.length);
    console.log('聊天消息数量:', chatMessages.length);
    
    // 合并聊天消息和系统消息
    const allMessages = [...chatMessages, ...systemMessages];
    
    // 对消息列表进行排序 - 后端返回的消息是最新的在前面，我们需要反转顺序，确保旧消息在前（上方）
    const sortedMessages = [...allMessages].sort((a, b) => {
      const timeA = new Date(a.sendTime || a.createTime || 0).getTime();
      const timeB = new Date(b.sendTime || b.createTime || 0).getTime();
      return timeB - timeA; // 按时间降序排序（晚->早），因为后端返回的是最新在前
    });
    
    console.log('合并排序后的消息数量:', sortedMessages.length);
    
    if (append) {
      // 追加历史消息到列表前面
      messages.value = [...sortedMessages.reverse(), ...messages.value]; // 反转消息顺序，确保历史消息在前
    } else {
      // 首次加载消息
      messages.value = sortedMessages.reverse(); // 反转消息顺序，确保旧消息在前，新消息在后
    }
    
    // 获取所有发送者的用户信息
    const uniqueSenderIds = new Set(messages.value.map(msg => msg.fromUserId));
    for (const senderId of uniqueSenderIds) {
      if (senderId !== 'system' && senderId !== props.currentUserId) {
        await fetchAndUpdateUserInfo(senderId);
      }
    }
    
    // 更新分页信息 - 使用聊天消息的分页信息
    totalMessages.value = chatResponse.total || 0;
    currentPage.value = page;
    hasMoreMessages.value = chatResponse.hasMore || chatMessages.length >= pageSize.value;
    
    // 如果不是加载更多，则滚动到底部
    if (!append) {
      setTimeout(scrollToBottom, 100);
    }
    
    // 发出消息加载完成事件
    emit('messagesLoaded', {
      messages: messages.value,
      total: totalMessages.value,
      hasMore: hasMoreMessages.value
    });
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
  // 创建消息对象的副本
  const newMessage = {...message};
  
  // 确保消息有发送时间
  if (!newMessage.sendTime) {
    newMessage.sendTime = new Date().toISOString();
  }
  
  // 添加到消息列表末尾（按照聊天界面的展示逻辑，新消息总是在底部）
  messages.value.push(newMessage);
  
  // 强制DOM更新后滚动到底部
  nextTick(() => {
    scrollToBottom();
  });
};

// 刷新消息（只获取最新的消息）
const refreshMessages = async () => {
  if (!authService.isLoggedIn()) return;
  
  try {
    console.log('刷新消息开始');
    
    let chatResponse = { success: false, data: [] };
    
    // 获取最新系统消息 - 只有在查看系统通知时才加载
    if (props.contactId === 'system' || props.contactId === 1 || props.contactId === '1') {
      try {
        chatResponse = await chatMessageService.getChatMessages(props.contactId, {
          carId: props.carId,
          page: 1,
          size: 10
        });
        console.log('刷新系统消息成功:', chatResponse);
      } catch (sysErr) {
        console.error('刷新系统消息失败:', sysErr);
        chatResponse = { success: false, data: [] };
      }
    } 
    // 获取最新聊天消息 - 只有在联系人ID不是系统时才加载
    else if (props.contactId && props.contactId !== 'system' && props.contactId !== 1 && props.contactId !== '1') {
      try {
        chatResponse = await chatMessageService.getChatMessages(props.contactId, {
          carId: props.carId,
          page: 1,
          size: 10
        });
        console.log('刷新聊天消息成功:', chatResponse);
      } catch (chatErr) {
        console.error('刷新聊天消息失败:', chatErr);
        chatResponse = { success: false, data: [] };
      }
    }
    
    // 处理聊天消息
    const chatMessages = chatResponse.success ? (chatResponse.data || []) : [];
    
    // 系统消息直接使用聊天消息结果，不单独处理
    let systemMessages = [];
    
    console.log('刷新后的系统消息数量:', systemMessages.length);
    console.log('刷新后的聊天消息数量:', chatMessages.length);
    
    // 合并聊天消息和系统消息
    const allMessages = [...chatMessages, ...systemMessages];
    
    // 获取消息列表并排序 - 后端返回的是最新在前，需要反转
    const newMessages = [...allMessages].sort((a, b) => {
      const timeA = new Date(a.sendTime || a.createTime || 0).getTime();
      const timeB = new Date(b.sendTime || b.createTime || 0).getTime();
      return timeB - timeA; // 按时间降序排序（晚->早）
    }).reverse(); // 反转顺序，确保旧消息在前
    
    // 过滤出新消息（当前列表中没有的消息）
    const existingIds = new Set(messages.value.map(m => m.id));
    const uniqueNewMessages = newMessages.filter(msg => !existingIds.has(msg.id));
    
    console.log('检测到新消息数量:', uniqueNewMessages.length);
    
    if (uniqueNewMessages.length > 0) {
      // 追加新消息到末尾
      messages.value = [...messages.value, ...uniqueNewMessages];
      // 滚动到底部
      setTimeout(scrollToBottom, 100);
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
onUpdated(() => {
  // 只有当有消息且不是在加载更多时才自动滚动到底部
  if (messages.value.length > 0 && !isLoadingMore.value) {
    scrollToBottom();
  }
});

// 处理头像URL
const getAvatarUrl = (url) => {
  console.log('处理头像URL:', { url });
  
  if (!url) {
    console.log('头像URL为空，使用默认头像');
    return '/images/avatars/default.png';
  }
  
  // 如果已经是完整URL，直接返回
  if (url.startsWith('http')) {
    console.log('使用完整URL:', url);
    return url;
  }
  
  // 处理相对路径
  const baseUrl = import.meta.env.VITE_API_IMAGE_URL || '';
  const cleanUrl = url.startsWith('/') ? url : `/${url}`;
  const fullUrl = `${baseUrl}${cleanUrl}`;
  
  console.log('生成完整头像URL:', {
    baseUrl,
    cleanUrl,
    fullUrl
  });
  
  // 对URL进行编码，处理特殊字符
  return encodeURI(fullUrl);
};

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
  position: relative;
  height: 0;
  min-height: 0;
  max-height: calc(100vh - 120px);
  background-color: #f5f5f5;
}

/* 深色模式下的聊天容器 */
:root[data-theme="dark"] .chat-container {
  background-color: var(--va-background);
}

.messages-container {
  display: flex;
  flex-direction: column;
  gap: 8px;
  width: 100%; /* 确保消息容器占满宽度 */
  max-width: 100%;
  flex: 1;
  overflow-y: auto;
  min-height: 0;
  padding-right: 4px; /* 添加一点右侧padding，防止内容紧贴滚动条 */
  padding-top: 60px; /* 为加载更多按钮留出空间 */
}

.load-more-container {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 16px;
  z-index: 10;
  width: 100%; /* 确保加载更多按钮容器占满宽度 */
}

.load-more-blur-backdrop {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(to bottom, 
                rgba(245, 245, 245, 0.9) 0%, 
                rgba(245, 245, 245, 0.8) 50%, 
                rgba(245, 245, 245, 0) 100%);
  backdrop-filter: blur(5px);
  -webkit-backdrop-filter: blur(5px);
  z-index: -1;
  border-bottom-left-radius: 20px;
  border-bottom-right-radius: 20px;
}

/* 深色模式下的高斯模糊背景 */
:root[data-theme="dark"] .load-more-blur-backdrop {
  background: linear-gradient(to bottom, 
                rgba(30, 30, 30, 0.9) 0%, 
                rgba(30, 30, 30, 0.8) 50%, 
                rgba(30, 30, 30, 0) 100%);
}

.loading-more {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 16px;
  gap: 8px;
  color: #888;
  font-size: 0.9rem;
  width: 100%; /* 确保加载更多状态占满宽度 */
  z-index: 10;
}

/* 深色模式下的加载更多 */
:root[data-theme="dark"] .loading-more {
  color: rgba(255, 255, 255, 0.7);
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
  width: 100%; /* 确保空消息状态占满宽度 */
}

/* 深色模式下的空消息状态 */
:root[data-theme="dark"] .empty-messages {
  color: rgba(255, 255, 255, 0.7);
}

.message-item {
  display: flex;
  flex-direction: column;
  margin-bottom: 16px;
  max-width: 85%;
  width: auto; /* 允许消息项根据内容调整宽度 */
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

/* 深色模式下的头像边框 */
:root[data-theme="dark"] .message-avatar img {
  border: 2px solid rgba(255, 255, 255, 0.2);
}

.user-name {
  font-size: 0.9rem;
  color: #888;
}

/* 深色模式下的用户名 */
:root[data-theme="dark"] .user-name {
  color: rgba(255, 255, 255, 0.7);
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

/* 深色模式下的发送消息气泡 */
:root[data-theme="dark"] .message-sent .message-bubble {
  background-color: rgba(255, 215, 0, 0.2);
  color: #ffffff;
}

.message-received {
  align-self: flex-start;
}

.message-received .message-bubble {
  background-color: #ffffff;
  border-top-left-radius: 4px;
  margin-right: auto;
}

/* 深色模式下的接收消息气泡 */
:root[data-theme="dark"] .message-received .message-bubble {
  background-color: rgba(255, 255, 255, 0.1);
  color: #ffffff;
}

/* 系统消息样式 */
.message-system {
  align-self: center;
  max-width: 90%;
  width: 100%;
}

.system-message {
  display: flex;
  align-items: flex-start;
  background-color: rgba(0, 0, 0, 0.03);
  border-radius: 8px;
  padding: 10px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  width: 100%; /* 确保系统消息占满容器宽度 */
}

.system-icon {
  margin-right: 12px;
  flex-shrink: 0; /* 防止图标被压缩 */
}

.system-icon img {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background-color: #fef0e0;
  padding: 4px;
}

.system-content {
  flex: 1;
  width: 100%; /* 确保系统消息内容占满剩余宽度 */
}

.system-title {
  font-weight: 500;
  color: #f5a623;
  margin-bottom: 6px;
  font-size: 0.9rem;
}

/* 深色模式下的系统消息标题 */
:root[data-theme="dark"] .system-title {
  color: #FFD700;
}

.system-bubble {
  background-color: #fef9f0;
  border-radius: 8px;
  padding: 10px 14px;
  border-left: 3px solid #f5a623;
  width: 100%; /* 确保系统消息气泡占满容器宽度 */
  box-sizing: border-box;
}

/* 深色模式下的系统消息气泡 */
:root[data-theme="dark"] .system-bubble {
  background-color: rgba(255, 215, 0, 0.1);
  border-left: 3px solid #FFD700;
}

.system-bubble .message-title {
  font-weight: 600;
  margin-bottom: 6px;
  color: #333;
  font-size: 0.95rem;
  border-bottom: 1px solid rgba(245, 166, 35, 0.2);
  padding-bottom: 6px;
}

/* 深色模式下的系统消息标题 */
:root[data-theme="dark"] .system-bubble .message-title {
  color: #ffffff;
  border-bottom: 1px solid rgba(255, 215, 0, 0.3);
}

.system-bubble .message-content {
  color: #555;
}

/* 深色模式下的系统消息内容 */
:root[data-theme="dark"] .system-bubble .message-content {
  color: rgba(255, 255, 255, 0.9);
}

.message-content {
  font-size: 1rem;
  line-height: 1.4;
  word-break: break-word;
  white-space: pre-wrap;
  text-align: left;
  color: #333;
}

/* 深色模式下的消息内容 */
:root[data-theme="dark"] .message-content {
  color: #ffffff;
}

.message-time {
  font-size: 0.7rem;
  color: #888;
  margin-top: 4px;
  padding: 0 4px;
}

/* 深色模式下的消息时间 */
:root[data-theme="dark"] .message-time {
  color: rgba(255, 255, 255, 0.6);
}

.time-sent {
  text-align: right;
  align-self: flex-end;
}

.time-received {
  text-align: left;
  align-self: flex-start;
}

/* 嵌入模式中的样式调整 */
:deep(.embedded-mode) .chat-container {
  max-height: calc(100% - 120px);
}

@media (max-width: 768px) {
  .chat-container {
    padding: 10px;
    max-height: calc(100vh - 100px);
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
  
  .system-message {
    padding: 8px;
  }
  
  .system-icon img {
    width: 28px;
    height: 28px;
  }
  
  .message-system {
    max-width: 95%;
  }
  
  .load-more-container,
  .loading-more {
    padding: 12px;
  }
}

/* 修改滚动条样式 */
::-webkit-scrollbar {
  width: 6px;
}

::-webkit-scrollbar-track {
  background: transparent;
}

::-webkit-scrollbar-thumb {
  background-color: rgba(0, 0, 0, 0.1);
  border-radius: 3px;
}

/* 深色模式下的滚动条 */
:root[data-theme="dark"] ::-webkit-scrollbar-thumb {
  background-color: rgba(255, 255, 255, 0.1);
}

::-webkit-scrollbar-thumb:hover {
  background-color: rgba(0, 0, 0, 0.2);
}

/* 深色模式下的滚动条悬停 */
:root[data-theme="dark"] ::-webkit-scrollbar-thumb:hover {
  background-color: rgba(255, 255, 255, 0.2);
}
</style> 