<template>
  <div class="message-panel">
    <!-- 标题 -->
    <div class="panel-header">
      <h3 class="panel-title">消息列表</h3>
      <va-button 
        class="refresh-button" 
        @click="fetchMessages" 
        :loading="isLoading" 
        icon="refresh" 
        color="transparent"
        flat
      />
    </div>
    
    <!-- 加载状态 -->
    <div v-if="isLoading" class="panel-loading">
      <va-progress-circle indeterminate color="primary" />
      <p>加载消息中...</p>
    </div>
    
    <!-- 空状态 -->
    <div v-else-if="sendersList.length === 0" class="panel-empty">
      <i data-lucide="inbox"></i>
      <p>暂无消息</p>
    </div>
    
    <!-- 发送者列表 -->
    <div v-else class="senders-list">
      <div 
        v-for="sender in sendersList" 
        :key="sender.userId"
        class="sender-item"
        :class="{ 
          'active': selectedSenderId === sender.userId,
          'system-sender': sender.isSystem 
        }"
        @click="selectSender(sender)"
      >
        <div class="sender-avatar" :class="{ 'system-avatar': sender.isSystem }">
          <template v-if="sender.isSystem">
            <template v-if="sender.avatar && sender.avatar !== ''">
              <img :src="getAvatarUrl(sender.avatar)" alt="系统" />
            </template>
            <template v-else>
              <va-icon name="notifications" color="#f5a623" />
            </template>
          </template>
          <template v-else>
            <img :src="getAvatarUrl(sender.avatar || '/images/avatars/default.png')" alt="头像">
          </template>
          <span v-if="sender.unreadCount" class="unread-badge">{{ sender.unreadCount }}</span>
        </div>
        <div class="sender-info">
          <div class="sender-name" :class="{ 'system-name': sender.isSystem }">
            {{ getFormattedContactName(sender) }}
          </div>
          <div class="last-message">{{ sender.lastMessage }}</div>
        </div>
        <div class="message-time">{{ formatTime(sender.lastTime) }}</div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed, defineEmits } from 'vue';
import { messageService, logService, userInfoService } from '@/services';
import dealerService from '@/api/dealerService';

const emit = defineEmits(['select-sender']);

// 状态变量
const isLoading = ref(false);
const messages = ref([]);
const currentUserId = ref(null);
const selectedSenderId = ref(null);
const error = ref(null);
const contactUsers = ref(new Map()); // 缓存联系人信息

// 获取当前用户ID
const getCurrentUserId = async () => {
  try {
    // 尝试从localStorage获取
    const userInfoStr = localStorage.getItem('userInfo');
    if (userInfoStr) {
      const userInfo = JSON.parse(userInfoStr);
      if (userInfo && (userInfo.userId || userInfo.id)) {
        return userInfo.userId || userInfo.id;
      }
    }
    
    // 尝试从用户服务获取
    const userInfo = await userInfoService.getCurrentUser();
    if (userInfo && (userInfo.userId || userInfo.id)) {
      return userInfo.userId || userInfo.id;
    }
    
    return null;
  } catch (err) {
    logService.error('获取当前用户ID失败', err);
    return null;
  }
};

// 获取消息列表
const fetchMessages = async () => {
  isLoading.value = true;
  error.value = null;
  
  try {
    // 确保有当前用户ID
    if (!currentUserId.value) {
      currentUserId.value = await getCurrentUserId();
    }
    
    // 使用messageService的方法获取并处理所有消息
    const response = await messageService.getAllMessagesGroupedBySender({
      page: 1,
      size: 100,
      pageNum: 1,
      pageSize: 100
    });
    
    if (response.success) {
      // 直接使用服务返回的分组后的发送者列表
      selectedSenderId.value = null; // 重置选中的发送者
      messages.value = response.senders || []; // 使用返回的发送者列表
      
      // 记录日志
      logService.info('成功获取消息列表', { 
        sendersCount: messages.value.length 
      });
    } else {
      error.value = response.message || '获取消息失败';
      logService.warn('获取消息列表失败', response);
    }
  } catch (err) {
    logService.error('获取消息异常', err);
    error.value = err.message || '获取消息时发生错误';
  } finally {
    isLoading.value = false;
  }
};

// 计算处理后的发送者列表
const sendersList = computed(() => {
  return messages.value;
});

// 选择发送者
const selectSender = (sender) => {
  selectedSenderId.value = sender.userId;
  
  // 向父组件发送事件
  emit('select-sender', {
    senderId: sender.userId,
    senderName: sender.name,
    messages: sender.messages
  });
  
  logService.info('选择发送者', { 
    senderId: sender.userId, 
    senderName: sender.name 
  });
};

// 获取格式化的联系人名称
const getFormattedContactName = (sender) => {
  // 如果是系统消息，直接返回系统类型的名称
  if (sender.isSystem) {
    return sender.name;
  }
  
  // 如果已经缓存了该用户的信息，使用缓存
  if (contactUsers.value.has(sender.userId)) {
    const contactUser = contactUsers.value.get(sender.userId);
    
    // 根据用户类型确定显示的名称
    if (userInfoService.isDealer(contactUser)) {
      // 经销商用户：显示联系人姓名
      if (contactUser.dealerInfo && contactUser.dealerInfo.contactPerson) {
        return contactUser.dealerInfo.contactPerson;
      } else {
        return contactUser.username || `经销商 #${sender.userId}`;
      }
    } else {
      // 普通用户或管理员：显示用户名
      return contactUser.username || `用户 #${sender.userId}`;
    }
  }
  
  // 如果没有缓存，先返回默认名称，然后异步加载
  fetchContactInfo(sender.userId);
  return sender.name || `用户 #${sender.userId}`;
};

// 异步获取联系人信息
const fetchContactInfo = async (userId) => {
  // 如果已经有缓存，跳过
  if (contactUsers.value.has(userId)) return;
  
  try {
    // 尝试使用userInfoService获取用户信息
    try {
      const userResponse = await userInfoService.getUserInfo(userId);
      if (userResponse.success && userResponse.data) {
        // 保存到缓存
        contactUsers.value.set(userId, userResponse.data);
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
        // 保存到缓存
        contactUsers.value.set(userId, dealerResponse.data);
        return;
      }
    } catch (dealerError) {
      console.error('通过dealerService获取经销商信息失败:', dealerError);
    }
  } catch (err) {
    console.error('获取联系人信息失败:', err);
  }
};

// 格式化时间
const formatTime = (timeString) => {
  if (!timeString) return '';
  
  const date = new Date(timeString);
  const now = new Date();
  const diffDays = Math.floor((now - date) / (24 * 60 * 60 * 1000));
  
  if (diffDays === 0) {
    // 今天 - 显示时:分
    return date.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' });
  } else if (diffDays === 1) {
    // 昨天
    return '昨天';
  } else if (diffDays < 7) {
    // 一周内 - 显示周几
    const days = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
    return days[date.getDay()];
  } else {
    // 更早 - 显示月/日
    return `${date.getMonth() + 1}/${date.getDate()}`;
  }
};

// 处理头像URL
const getAvatarUrl = (url) => {
  if (!url) return 'http://localhost:8090/images/avatars/default.png';
  
  // 如果已经是完整URL，直接返回
  if (url.startsWith('http')) return url;
  
  // 否则添加基础URL
  return `http://localhost:8090${url.startsWith('/') ? '' : '/'}${url}`;
};

// 组件挂载时执行
onMounted(async () => {
  // 初始化Lucide图标
  if (window.lucide) {
    window.lucide.createIcons();
  }
  
  // 获取消息列表
  await fetchMessages();
});
</script>

<style scoped>
.message-panel {
  height: 100%;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  padding: 1rem;
  box-sizing: border-box;
}

.panel-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-bottom: 1rem;
  border-bottom: 1px solid #eee;
  margin-bottom: 1rem;
  flex-shrink: 0;
}

.panel-title {
  margin: 0;
  font-size: 1.1rem;
  font-weight: 500;
  color: #333;
}

.refresh-button {
  width: 32px;
  height: 32px;
  min-width: 32px;
  border-radius: 50%;
  padding: 0;
  display: flex;
  justify-content: center;
  align-items: center;
}

.panel-loading,
.panel-empty {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  color: #888;
  padding: 2rem 0;
}

.panel-empty i {
  margin-bottom: 1rem;
  color: #ccc;
  width: 48px;
  height: 48px;
  stroke-width: 1;
}

.senders-list {
  flex: 1;
  overflow-y: auto;
  min-height: 0;
  height: 0;
}

.sender-item {
  display: flex;
  align-items: center;
  padding: 0.8rem;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.2s ease;
  margin-bottom: 0.5rem;
}

.sender-item:hover {
  background-color: rgba(0, 0, 0, 0.03);
}

.sender-item.active {
  background-color: rgba(var(--va-primary-rgb), 0.08);
}

.sender-item.system-sender {
  background-color: rgba(245, 166, 35, 0.05);
  border-left: 3px solid #f5a623;
}

.sender-item.system-sender.active {
  background-color: rgba(245, 166, 35, 0.1);
}

.sender-avatar {
  position: relative;
  width: 40px;
  height: 40px;
  margin-right: 0.8rem;
}

.sender-avatar.system-avatar {
  background-color: #fef0e0;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  border: 1px solid #f5a623;
}

.sender-avatar img {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  object-fit: cover;
}

.unread-badge {
  position: absolute;
  top: -5px;
  right: -5px;
  background-color: var(--va-primary);
  color: white;
  border-radius: 50%;
  width: 18px;
  height: 18px;
  font-size: 0.7rem;
  display: flex;
  justify-content: center;
  align-items: center;
}

.sender-info {
  flex: 1;
  overflow: hidden;
  margin-right: 0.5rem;
}

.sender-name {
  font-weight: 500;
  margin-bottom: 0.2rem;
  color: #333;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.sender-name.system-name {
  color: #f5a623;
  font-weight: 600;
}

.last-message {
  color: #666;
  font-size: 0.85rem;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  max-width: 100%;
}

.message-time {
  font-size: 0.75rem;
  color: #999;
  align-self: flex-start;
  margin-top: 4px;
}

@media (max-width: 768px) {
  .message-panel {
    padding: 0.8rem;
  }
  
  .sender-avatar {
    width: 36px;
    height: 36px;
  }
  
  .panel-header {
    padding-bottom: 0.8rem;
    margin-bottom: 0.8rem;
  }
  
  .sender-item {
    padding: 0.6rem;
  }
}
</style> 