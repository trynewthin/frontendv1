<template>
  <div class="chat-view" :class="{ 'embedded-mode': isEmbedded }">
    <!-- 标题栏组件 -->
    <ChatHeader 
      :contact-name="contactName" 
      :loading="isLoading"
      @go-back="handleGoBack"
    />
    
    <!-- 消息展示组件 -->
    <ChatMessages
      ref="messagesRef"
      :current-user-id="currentUserId"
      :contact-id="contactId"
      :contact-name="contactName"
      :car-id="carId"
      :auto-load="false"
      :enable-polling="true"
      @load-more="handleLoadMore"
      @messages-loaded="handleMessagesLoaded"
      @message-error="handleMessageError"
    />
    
    <!-- 消息输入组件 -->
    <ChatInput
      :is-loading="isLoading"
      :is-sending="isSending"
      @send="sendMessage"
      @scroll-to-bottom="scrollToBottom"
    />
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, defineEmits, defineProps, nextTick } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useToast } from 'vuestic-ui';
import messageService from '@/api/messageService';
import authService from '@/api/authService';
import dealerService from '@/api/dealerService';
import { userInfoService } from '@/services';
import ChatHeader from './components/ChatHeader.vue';
import ChatMessages from './components/ChatMessages.vue';
import ChatInput from './components/ChatInput.vue';

const props = defineProps({
  isEmbedded: {
    type: Boolean,
    default: false
  },
  contactId: {
    type: [Number, String],
    default: null
  },
  contactName: {
    type: String,
    default: null
  },
  carId: {
    type: [Number, String],
    default: null
  }
});

const route = useRoute();
const router = useRouter();
const { init: initToast } = useToast();

// 获取路由参数或者props传入的值
const contactId = ref(props.contactId || parseInt(route.params.contactId) || null);
const carId = ref(props.carId || parseInt(route.query.carId) || null);

// 用户状态
const currentUserId = ref(null);
const contactUser = ref(null);
const contactName = ref(props.contactName || '聊天');

// 消息状态
const newMessage = ref('');
const isLoading = ref(true);
const isSending = ref(false);
const sentMessageIds = ref(new Set()); // 用于跟踪已发送的消息ID

// 组件引用
const messagesRef = ref(null);
const chatContainerRef = ref(null);

// 定义组件事件
const emit = defineEmits(['go-back']);

// 改进的滚动到底部方法
const scrollToBottom = () => {
  nextTick(() => {

    // 尝试方法2：直接操作DOM (更可靠)
    try {
      // 尝试获取聊天容器
      const chatContainer = document.querySelector('.chat-container');
      if (chatContainer) {
        chatContainer.scrollTop = chatContainer.scrollHeight + 10000;
      }
      
      // 尝试获取消息容器
      const messagesContainer = document.querySelector('.messages-container');
      if (messagesContainer) {
        messagesContainer.scrollTop = messagesContainer.scrollHeight + 10000;
      }
    } catch (err) {
      console.error('直接操作DOM滚动失败:', err);
    }
  });
};

// 获取当前用户ID
const getCurrentUserId = () => {
  try {
    // 优先尝试从localStorage直接获取
    const userInfoStr = localStorage.getItem('userInfo');
    if (userInfoStr) {
      const userInfo = JSON.parse(userInfoStr);
      // 优先使用userId字段，如果没有再尝试使用id字段
      if (userInfo && (userInfo.userId || userInfo.id)) {
        return userInfo.userId || userInfo.id;
      }
    }
    
    // 作为备选，使用authService
    const userInfoFromService = authService.getCurrentUser();
    if (userInfoFromService && (userInfoFromService.userId || userInfoFromService.id)) {
      return userInfoFromService.userId || userInfoFromService.id;
    }
    
    return null;
  } catch (err) {
    console.error('获取当前用户ID失败');
    return null;
  }
};

// 获取用户或经销商信息
const getContactInfo = async () => {
  if (!contactId.value) return;
  
  try {
    // 尝试使用userInfoService获取用户信息
    try {
      const userResponse = await userInfoService.getUserInfo(contactId.value);
      if (userResponse.success && userResponse.data) {
        contactUser.value = userResponse.data;
        
        // 根据用户类型确定显示的名称
        if (userInfoService.isDealer(userResponse.data)) {
          // 经销商用户：显示联系人姓名
          if (userResponse.data.dealerInfo && userResponse.data.dealerInfo.contactPerson) {
            contactName.value = userResponse.data.dealerInfo.contactPerson;
          } else {
            contactName.value = userResponse.data.username || `经销商 #${contactId.value}`;
          }
        } else {
          // 普通用户或管理员：显示用户名
          contactName.value = userResponse.data.username || `用户 #${contactId.value}`;
        }
        return;
      }
    } catch (userError) {
      console.error('通过userInfoService获取用户信息失败:', userError);
      // 继续尝试其他方法获取用户信息
    }
    
    // 作为备选，尝试获取经销商信息
    try {
      const dealerResponse = await dealerService.getDealerDetail(contactId.value);
      if (dealerResponse.success && dealerResponse.data) {
        contactUser.value = dealerResponse.data;
        // 优先使用联系人姓名，其次是经销商名称
        contactName.value = dealerResponse.data.contactPerson || dealerResponse.data.dealerName || `经销商 #${contactId.value}`;
        return;
      }
    } catch (dealerError) {
      console.error('通过dealerService获取经销商信息失败:', dealerError);
    }
    
    // 如果都失败，则设置默认名称
    contactName.value = `联系人 #${contactId.value}`;
  } catch (err) {
    console.error('获取联系人信息失败:', err);
    contactName.value = `联系人 #${contactId.value}`;
  }
};

// 处理消息加载完成
const handleMessagesLoaded = (data) => {
  isLoading.value = false;
  // 可以在这里处理其他逻辑，如更新未读消息状态等
  
  // 首次加载消息完成后滚动到底部
  scrollToBottom();
};

// 处理消息加载错误
const handleMessageError = (errorMsg) => {
  isLoading.value = false;
  initToast({
    message: errorMsg,
    color: 'danger',
    duration: 3000
  });
};

// 处理加载更多消息
const handleLoadMore = () => {
  // 此方法可以为空，因为ChatMessages组件内部处理了加载更多的逻辑
  // 或者可以在这里添加额外的UI反馈
};

// 发送消息
const sendMessage = async (content) => {
  if (!contactId.value || !authService.isLoggedIn() || !content || content.trim() === '') {
    console.error('发送消息失败: 参数无效或未登录');
    return;
  }
  
  if (isSending.value) {
    console.warn('消息发送中，请稍后再试');
    return;
  }
  
  isSending.value = true;
  const messageContent = content.trim();
  const targetContactId = contactId.value;
  const targetCarId = carId.value;
  const tempId = `temp-${Date.now()}`;
  
  try {
    const response = await messageService.sendMessage(targetContactId, messageContent, targetCarId);
    
    if (response.success) {
      // 获取当前用户信息
      const userInfoStr = localStorage.getItem('userInfo');
      let userName = '当前用户';
      let userAvatar = '/images/avatars/default.png';
      
      try {
        if (userInfoStr) {
          const userInfo = JSON.parse(userInfoStr);
          if (userInfo) {
            userName = userInfo.nickname || userInfo.username || `用户${currentUserId.value}`;
            userAvatar = userInfo.avatar || '/images/avatars/default.png';
          }
        }
      } catch (e) {
        console.error('解析用户信息失败:', e);
      }
      
      // 获得真实的消息ID
      const messageId = response.data || tempId;
      
      // 检查该消息是否已经添加过
      if (sentMessageIds.value.has(messageId)) {
        console.log('该消息已经添加过，不重复添加', messageId);
        return;
      }
      
      // 记录已发送的消息ID
      sentMessageIds.value.add(messageId);
      
      // 消息发送成功，添加到列表 - 使用与后端一致的格式
      const sentMessage = {
        id: messageId,
        fromUserId: currentUserId.value,
        toUserId: targetContactId,
        fromUserName: userName,
        fromUserAvatar: userAvatar,
        carId: targetCarId || null,
        content: messageContent,
        sendTime: new Date().toISOString(),
        read: false,
        messageType: null,
        interactionType: "CONSULTATION"
      };
      
      // 添加消息到ChatMessages组件
      messagesRef.value.addMessage(sentMessage);
      newMessage.value = '';
      
      // 发送成功后滚动到底部
      scrollToBottom();
      
      // 显示成功提示
      initToast({
        message: '消息发送成功',
        color: 'success',
        duration: 1500
      });
    } else {
      console.error('消息发送失败:', response.message);
      
      // 显示失败提示
      initToast({
        message: response.message || '发送失败，请重试',
        color: 'warning',
        duration: 3000
      });
    }
  } catch (err) {
    console.error('发送消息失败:', err.message);
    
    // 显示失败提示
    initToast({
      message: '发送消息失败，网络问题，请稍后再试',
      color: 'warning',
      duration: 3000
    });
  } finally {
    isSending.value = false;
  }
};

// 返回上一页
const goBack = () => {
  router.back();
};

// 处理返回按钮点击
const handleGoBack = () => {
  emit('go-back');
  // 只有非嵌入模式才执行路由返回
  if (!props.isEmbedded) {
    goBack();
  }
};

// 组件挂载后执行
onMounted(async () => {
  // 检查登录状态
  checkLoginStatus();
  
  // 监听登录状态变化事件
  window.addEventListener('storage', handleStorageChange);
  window.addEventListener('auth-state-changed', checkLoginStatus);
});

// 组件销毁前停止轮询和移除事件监听
onBeforeUnmount(() => {
  // 移除事件监听
  window.removeEventListener('storage', handleStorageChange);
  window.removeEventListener('auth-state-changed', checkLoginStatus);
});

// 检查登录状态
const checkLoginStatus = async () => {
  // 获取当前用户ID
  currentUserId.value = getCurrentUserId();
  
  if (!currentUserId.value) {
    console.error('未能获取到用户ID');
    initToast({
      message: '您需要登录才能查看消息',
      color: 'warning'
    });
    router.push('/login');
    return;
  }
  
  if (!contactId.value) {
    isLoading.value = false;
    initToast({
      message: '联系人ID无效',
      color: 'danger'
    });
    return;
  }
  
  // 获取联系人信息
  await getContactInfo();
  
  // 通过messagesRef组件加载消息
  if (messagesRef.value) {
    messagesRef.value.loadMessages();
  } else {
    console.warn('消息组件引用不存在，无法加载消息');
  }
};

// 处理本地存储变化
const handleStorageChange = (event) => {
  if (event.key === 'token' || event.key === 'userInfo') {
    checkLoginStatus();
  }
};
</script>

<style scoped>
.chat-view {
  display: flex;
  flex-direction: column;
  background-color: var(--va-background);
  box-sizing: border-box;
  overflow: hidden; /* 防止整个视图滚动 */
  height: 100%;
  width: 100%;
}

/* 默认全屏模式 */
.chat-view:not(.embedded-mode) {
  position: fixed !important;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  width: 100vw !important;
  height: 100vh !important;
  margin: 0 !important;
  padding: 0 !important;
  z-index: 1000; /* 确保在其他元素之上 */
}

/* 嵌入模式样式 */
.chat-view.embedded-mode {
  position: relative;
  border-radius: 4px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  height: 100%; /* 确保高度填满父容器 */
  background-color: var(--va-background);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

/* 深色模式下的阴影 */
:root[data-theme="dark"] .chat-view.embedded-mode {
  box-shadow: 0 2px 8px rgba(255, 215, 0, 0.1);
}

/* 确保所有聊天组件占满宽度 */
:deep(.chat-header), 
:deep(.chat-container),
:deep(.chat-input) {
  width: 100% !important;
  max-width: 100% !important;
  margin-left: 0 !important;
  margin-right: 0 !important;
  box-sizing: border-box !important;
}

/* 修正消息容器选择器 */
:deep(.chat-messages) {
  flex: 1;
  min-height: 0; /* 允许flex子元素收缩 */
  display: flex;
  flex-direction: column;
  width: 100% !important;
}

/* 确保消息布局正确 */
:deep(.message-sent) {
  align-self: flex-end !important;
  text-align: right !important;
}

:deep(.message-received) {
  align-self: flex-start !important;
  text-align: left !important;
}

/* 修正消息气泡样式 */
:deep(.message-bubble) {
  max-width: 100% !important;
  box-sizing: border-box !important;
}

:deep(.message-item) {
  width: auto !important;
  max-width: 85% !important;
}

/* 深色模式下的消息气泡和输入框样式 */
:root[data-theme="dark"] :deep(.message-bubble) {
  background-color: rgba(255, 255, 255, 0.1);
  color: #ffffff;
}

:root[data-theme="dark"] :deep(.message-sent .message-bubble) {
  background-color: rgba(255, 215, 0, 0.2);
  color: #ffffff;
}

:root[data-theme="dark"] :deep(.message-textarea) {
  background-color: var(--va-background-secondary);
  border-color: rgba(255, 215, 0, 0.2);
  color: #ffffff;
}

:root[data-theme="dark"] :deep(.chat-header) {
  background-color: var(--va-background);
  border-bottom-color: rgba(255, 215, 0, 0.2);
}

@media (max-width: 768px) {
  /* 在移动设备上，即使是嵌入模式也使用全屏 */
  .chat-view.embedded-mode {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    width: 100vw;
    height: 100vh;
    z-index: 1000;
  }
}
</style> 