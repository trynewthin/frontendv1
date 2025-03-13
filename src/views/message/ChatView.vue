<template>
  <div class="chat-view">
    <div class="chat-header">
      <va-button @click="goBack" preset="secondary" icon="arrow_back" size="small">返回</va-button>
      <h2 class="contact-name">{{ contactName }}</h2>
      <div class="chat-status" v-if="isLoading">
        <va-progress-circle indeterminate size="small" />
      </div>
    </div>
    
    <div class="chat-container" ref="chatContainer">
      <!-- 加载更多按钮 -->
      <div class="load-more-container" v-if="hasMoreMessages && !isLoadingMore">
        <va-button @click="loadMoreMessages" size="small" preset="secondary">加载更多</va-button>
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
          <p>{{ errorMessage || '暂无消息记录，开始聊天吧' }}</p>
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
              <div class="user-name">{{ message.fromUserName || '用户' }}</div>
            </div>
            
            <!-- 消息气泡 -->
            <div class="message-bubble">
              <div class="message-content">{{ message.content }}</div>
              <div class="message-time">{{ formatMessageTime(message.sendTime) }}</div>
            </div>
          </div>
        </template>
      </div>
    </div>
    
    <!-- 输入区域 -->
    <div class="chat-input-area">
      <va-textarea
        v-model="newMessage"
        placeholder="请输入消息..."
        rows="3"
        :disabled="isLoading || isSending"
        @keydown.enter.prevent="handleEnterKey"
      />
      <div class="input-actions">
        <!-- 预约试驾快捷按钮 -->
        <va-button
          v-if="carId"
          @click="sendTestDriveMessage"
          preset="secondary"
          icon="time_to_leave"
          :loading="isSending"
          :disabled="isLoading"
          class="test-drive-btn"
        >
          预约试驾
        </va-button>
        <va-button
          @click="sendMessage"
          preset="primary"
          icon="send"
          :loading="isSending"
          :disabled="newMessage.trim() === '' || isLoading"
        >
          发送
        </va-button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, nextTick, onBeforeUnmount } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useToast } from 'vuestic-ui';
import messageService from '@/api/messageService';
import authService from '@/api/authService';
import dealerService from '@/api/dealerService';

const route = useRoute();
const router = useRouter();
const { init: initToast } = useToast();

// 获取路由参数
const contactId = ref(parseInt(route.params.contactId) || null);
const carId = ref(parseInt(route.query.carId) || null);

// 用户状态
const currentUserId = ref(null);
const contactUser = ref(null);
const contactName = ref('聊天');

// 消息状态
const messages = ref([]);
const newMessage = ref('');
const isLoading = ref(true);
const isSending = ref(false);
const errorMessage = ref('');
const isLoadingMore = ref(false);
const hasMoreMessages = ref(false);
const currentPage = ref(1);
const pageSize = ref(20);
const totalMessages = ref(0);

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
    // 先尝试获取经销商信息
    const dealerResponse = await dealerService.getDealerDetail(contactId.value);
    if (dealerResponse.success && dealerResponse.data) {
      contactUser.value = dealerResponse.data;
      contactName.value = dealerResponse.data.dealerName || `经销商 #${contactId.value}`;
      return;
    }
    
    // 如果不是经销商，则可能是普通用户
    // 直接设置默认名称，因为普通用户无法获取其他用户的详细信息
    contactName.value = `用户 #${contactId.value}`;
  } catch (err) {
    console.error('获取联系人信息失败:', err);
    contactName.value = `联系人 #${contactId.value}`;
  }
};

// 加载消息
const loadMessages = async (page = 1, append = false) => {
  if (!contactId.value || !authService.isLoggedIn()) {
    errorMessage.value = '无法加载消息';
    isLoading.value = false;
    return;
  }
  
  if (page === 1) {
    isLoading.value = true;
  } else {
    isLoadingMore.value = true;
  }
  
  errorMessage.value = '';
  
  try {
    const response = await messageService.getChatMessages(contactId.value, {
      carId: carId.value,
      page: page,
      size: pageSize.value
    });
    
    if (response.success && response.data && Array.isArray(response.data.list)) {
      // 获取消息列表
      const messageList = [...response.data.list]; // 创建数组副本
      
      // 根据当前用户ID和联系人ID筛选属于当前聊天的消息
      const currentUserID = currentUserId.value;
      const contactID = contactId.value;
      
      const filteredMessages = messageList.filter(msg => {
        // 消息必须是当前用户和联系人之间的
        return (msg.fromUserId == currentUserID && msg.toUserId == contactID) || 
               (msg.fromUserId == contactID && msg.toUserId == currentUserID);
      });
      
      if (append) {
        // 追加消息到列表前面（历史消息应该在前面）
        messages.value = [...filteredMessages.reverse(), ...messages.value];
      } else {
        // 覆盖消息列表（最新消息）
        messages.value = filteredMessages.reverse();
      }
      
      // 更新分页信息
      totalMessages.value = response.data.total || 0;
      currentPage.value = page;
      hasMoreMessages.value = (page * pageSize.value) < totalMessages.value;
    } else {
      console.error('加载消息响应无效:', response);
      errorMessage.value = response.message || '获取消息失败';
    }
  } catch (err) {
    console.error('加载消息失败:', err);
    errorMessage.value = '加载消息失败，请重试';
  } finally {
    isLoading.value = false;
    isLoadingMore.value = false;
  }
};

// 加载更多消息（历史消息）
const loadMoreMessages = () => {
  if (hasMoreMessages.value && !isLoadingMore.value) {
    loadMessages(currentPage.value + 1, true);
  }
};

// 发送消息
const sendMessage = async () => {
  if (!contactId.value || !authService.isLoggedIn() || newMessage.value.trim() === '') {
    console.error('发送消息失败: 参数无效或未登录');
    return;
  }
  
  isSending.value = true;
  const content = newMessage.value.trim();
  const targetContactId = contactId.value;
  const targetCarId = carId.value;
  
  try {
    const response = await messageService.sendMessage(targetContactId, content, targetCarId);
    
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
      
      // 消息发送成功，添加到列表 - 使用与后端一致的格式
      const sentMessage = {
        id: response.data || `temp-${Date.now()}`,
        fromUserId: currentUserId.value,
        toUserId: targetContactId,
        fromUserName: userName,
        fromUserAvatar: userAvatar,
        carId: targetCarId || null,
        content: content,
        sendTime: new Date().toISOString(),
        read: false,
        messageType: null,
        interactionType: "CONSULTATION"
      };
      
      messages.value.push(sentMessage);
      newMessage.value = '';
      
      // 滚动到底部
      await scrollToBottom();
      
      // 显示成功提示
      initToast({
        message: '消息发送成功',
        color: 'success',
        duration: 1500
      });
    } else {
      console.error('消息发送失败:', response.message);
      
      // 如果API调用失败，仍然显示消息（但是标记为本地消息）
      const sentMessage = {
        id: `local-${Date.now()}`,
        fromUserId: currentUserId.value,
        toUserId: targetContactId,
        fromUserName: '当前用户',
        fromUserAvatar: '/images/avatars/default.png',
        content: content,
        sendTime: new Date().toISOString(),
        read: false,
        carId: targetCarId || null,
        isLocal: true
      };
      
      messages.value.push(sentMessage);
      newMessage.value = '';
      
      // 滚动到底部
      await scrollToBottom();
      
      // 尝试重新发送
      initToast({
        message: response.message || '发送失败，但消息已保存到本地。可尝试重新发送',
        color: 'warning',
        duration: 3000
      });
    }
  } catch (err) {
    console.error('发送消息失败:', err.message);
    
    // 显示本地消息
    const sentMessage = {
      id: `local-${Date.now()}`,
      fromUserId: currentUserId.value,
      toUserId: targetContactId,
      fromUserName: '当前用户',
      fromUserAvatar: '/images/avatars/default.png',
      content: content,
      sendTime: new Date().toISOString(),
      read: false,
      carId: targetCarId || null,
      isLocal: true
    };
    
    messages.value.push(sentMessage);
    newMessage.value = '';
    
    // 滚动到底部
    await scrollToBottom();
    
    initToast({
      message: '发送消息失败，但消息已保存到本地。网络问题，请稍后再试',
      color: 'warning',
      duration: 3000
    });
  } finally {
    isSending.value = false;
  }
};

// 回车键发送
const handleEnterKey = (event) => {
  // 按下回车键且未按Shift键时发送
  if (event.keyCode === 13 && !event.shiftKey) {
    event.preventDefault();
    sendMessage();
  }
};

// 滚动到底部
const chatContainer = ref(null);
const scrollToBottom = async () => {
  await nextTick();
  if (chatContainer.value) {
    chatContainer.value.scrollTop = chatContainer.value.scrollHeight;
  }
};

// 格式化消息时间
const formatMessageTime = (dateStr) => {
  if (!dateStr) return '';
  
  const date = new Date(dateStr);
  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');
  
  return `${hours}:${minutes}`;
};

// 返回上一页
const goBack = () => {
  router.back();
};

// 定期拉取新消息
const pollInterval = ref(null);
const startPolling = () => {
  // 每5秒拉取一次新消息
  pollInterval.value = setInterval(() => {
    if (!isLoading.value && !isSending.value) {
      refreshMessages();
    }
  }, 5000);
};

// 刷新消息（只获取最新的消息）
const refreshMessages = async () => {
  if (!contactId.value || !authService.isLoggedIn()) return;
  
  try {
    const response = await messageService.getChatMessages(contactId.value, {
      carId: carId.value,
      page: 1,
      size: 10
    });
    
    if (response.success && response.data && Array.isArray(response.data.list) && response.data.list.length > 0) {
      // 根据当前用户ID和联系人ID筛选属于当前聊天的消息
      const currentUserID = currentUserId.value;
      const contactID = contactId.value;
      
      // 获取消息列表并反转（最新的在后面）
      const latestMessages = [...response.data.list].reverse();
      
      // 筛选当前聊天的消息
      const filteredMessages = latestMessages.filter(msg => {
        // 消息必须是当前用户和联系人之间的
        return (msg.fromUserId == currentUserID && msg.toUserId == contactID) || 
               (msg.fromUserId == contactID && msg.toUserId == currentUserID);
      });
      
      // 过滤出新消息（当前列表中没有的消息）
      const existingIds = new Set(messages.value.map(m => m.id));
      const newMessages = filteredMessages.filter(msg => !existingIds.has(msg.id));
      
      if (newMessages.length > 0) {
        // 追加新消息
        messages.value = [...messages.value, ...newMessages];
        // 滚动到底部
        await scrollToBottom();
      }
    }
  } catch (err) {
    console.error('刷新消息失败:', err);
  }
};

// 发送预约试驾消息
const sendTestDriveMessage = async () => {
  if (!contactId.value || !authService.isLoggedIn() || !carId.value) {
    console.error('发送预约试驾消息失败: 参数无效或未登录');
    
    initToast({
      message: '发送失败，请确认您已登录且有关联车辆',
      color: 'danger',
      duration: 3000
    });
    return;
  }
  
  isSending.value = true;
  
  try {
    // 获取车辆信息（如果已有可以直接使用）
    let carInfo = '此车辆';
    try {
      // 这里可以添加获取车辆信息的逻辑，例如通过carService
      // const carResponse = await carService.getCarDetail(carId.value);
      // if (carResponse.success && carResponse.data) {
      //   carInfo = `${carResponse.data.brand} ${carResponse.data.model}`;
      // }
    } catch (err) {
      console.error('获取车辆信息失败:', err.message);
    }
    
    // 构建预约试驾消息
    const content = `您好，我对${carInfo}很感兴趣，希望预约试驾。请问最近什么时间方便？`;
    
    // 调用发送消息方法
    const response = await messageService.sendMessage(contactId.value, content, carId.value);
    
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
        console.error('解析用户信息失败:', e.message);
      }
      
      // 消息发送成功，添加到列表 - 使用与后端一致的格式
      const sentMessage = {
        id: response.data || `temp-${Date.now()}`,
        fromUserId: currentUserId.value,
        toUserId: contactId.value,
        fromUserName: userName,
        fromUserAvatar: userAvatar,
        carId: carId.value,
        content: content,
        sendTime: new Date().toISOString(),
        read: false,
        messageType: null,
        interactionType: "TEST_DRIVE"
      };
      
      messages.value.push(sentMessage);
      
      // 滚动到底部
      await scrollToBottom();
      
      // 显示成功提示
      initToast({
        message: '预约试驾消息发送成功',
        color: 'success',
        duration: 1500
      });
    } else {
      console.error('预约试驾消息发送失败:', response.message);
      
      // 显示本地消息
      const sentMessage = {
        id: `local-${Date.now()}`,
        fromUserId: currentUserId.value,
        toUserId: contactId.value,
        fromUserName: '当前用户',
        fromUserAvatar: '/images/avatars/default.png',
        content: content,
        sendTime: new Date().toISOString(),
        read: false,
        carId: carId.value,
        isLocal: true,
        interactionType: "TEST_DRIVE"
      };
      
      messages.value.push(sentMessage);
      
      // 滚动到底部
      await scrollToBottom();
      
      initToast({
        message: response.message || '发送失败，但消息已保存到本地',
        color: 'warning',
        duration: 3000
      });
    }
  } catch (err) {
    console.error('发送预约试驾消息失败:', err.message);
    
    // 构建消息内容
    const content = `您好，我对这辆车很感兴趣，希望预约试驾。请问最近什么时间方便？`;
    
    // 显示本地消息
    const sentMessage = {
      id: `local-${Date.now()}`,
      fromUserId: currentUserId.value,
      toUserId: contactId.value,
      fromUserName: '当前用户',
      fromUserAvatar: '/images/avatars/default.png',
      content: content,
      sendTime: new Date().toISOString(),
      read: false,
      carId: carId.value,
      isLocal: true,
      interactionType: "TEST_DRIVE"
    };
    
    messages.value.push(sentMessage);
    
    // 滚动到底部
    await scrollToBottom();
    
    initToast({
      message: '发送预约试驾消息失败，但消息已保存到本地',
      color: 'warning',
      duration: 3000
    });
  } finally {
    isSending.value = false;
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
  if (pollInterval.value) {
    clearInterval(pollInterval.value);
  }
  
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
    errorMessage.value = '联系人ID无效';
    isLoading.value = false;
    return;
  }
  
  // 获取联系人信息
  await getContactInfo();
  
  // 加载消息
  await loadMessages();
  
  // 滚动到底部
  await scrollToBottom();
  
  // 启动轮询
  startPolling();
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
  height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: #f5f5f5;
}

.chat-header {
  display: flex;
  align-items: center;
  padding: 12px 16px;
  background-color: #fff;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  z-index: 10;
}

.contact-name {
  margin: 0 0 0 16px;
  font-size: 1.2rem;
  flex-grow: 1;
}

.chat-status {
  margin-left: 8px;
}

.chat-container {
  flex: 1;
  overflow-y: auto;
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.messages-container {
  display: flex;
  flex-direction: column;
  gap: 8px;
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
  margin-bottom: 8px;
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
  max-width: 80%;
  padding: 8px 12px;
  border-radius: 16px;
  position: relative;
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
  word-break: break-word;
  white-space: pre-wrap;
}

.message-time {
  font-size: 0.7rem;
  color: #888;
  text-align: right;
  margin-top: 4px;
}

.chat-input-area {
  padding: 16px;
  background-color: #fff;
  box-shadow: 0 -1px 3px rgba(0, 0, 0, 0.1);
  z-index: 10;
}

.input-actions {
  display: flex;
  justify-content: flex-end;
  margin-top: 8px;
  gap: 10px;
}

.test-drive-btn {
  background-color: #f0f8ff;
  border: 1px solid #1976d2;
  color: #1976d2;
  transition: all 0.3s ease;
}

.test-drive-btn:hover {
  background-color: #e3f2fd;
  transform: translateY(-2px);
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}

/* 响应式调整 */
@media (max-width: 768px) {
  .message-bubble {
    max-width: 85%;
  }
}
</style> 