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
          <div class="last-message" v-if="sender.lastMessage">{{ sender.lastMessage }}</div>
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
const contacts = ref([]); // 修改为contacts，存储联系人列表
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

// 获取消息联系人列表
const fetchMessages = async () => {
  isLoading.value = true;
  error.value = null;
  
  try {
    // 确保有当前用户ID
    if (!currentUserId.value) {
      currentUserId.value = await getCurrentUserId();
    }
    
    // 使用新的getMessageContacts方法获取联系人列表
    const response = await messageService.getMessageContacts();
    
    if (response.success) {
      selectedSenderId.value = null; // 重置选中的发送者
      
      // API只返回ID数组，我们需要为每个ID创建一个基本的联系人对象
      const contactIds = response.contactIds || [];
      contacts.value = contactIds.map(userId => {
        // 检查是否为系统消息用户ID
        const isSystemUser = userId === 'system' || userId === 1 || userId === '1';
        return {
          userId: userId,
          name: isSystemUser ? '系统通知' : `用户 #${userId}`,
          avatar: null,
          lastMessage: '', // 空字符串代替"加载中..."
          lastMessageTime: new Date(), // 使用当前时间作为默认值
          unreadCount: 0,
          isSystem: isSystemUser
        };
      });
      
      // 记录日志
      logService.info('成功获取消息联系人列表', { 
        contactsCount: contacts.value.length 
      });
      
      // 为每个联系人异步加载详细信息
      contacts.value.forEach(contact => {
        fetchContactInfo(contact.userId);
      });
    } else {
      error.value = response.message || '获取消息联系人失败';
      logService.warn('获取消息联系人列表失败', response);
    }
  } catch (err) {
    logService.error('获取消息联系人异常', err);
    error.value = err.message || '获取消息联系人时发生错误';
  } finally {
    isLoading.value = false;
  }
};

// 计算处理后的发送者列表
const sendersList = computed(() => {
  return contacts.value.map(contact => ({
    userId: contact.userId,
    name: contact.username || contact.name || `用户 #${contact.userId}`,
    avatar: contact.avatar,
    lastMessage: contact.lastMessage || '',
    lastTime: contact.lastMessageTime || new Date(),
    unreadCount: contact.unreadCount || 0,
    isSystem: contact.isSystem || contact.userType === 'SYSTEM' || contact.userId === 'system'
  }));
});

// 选择发送者
const selectSender = (sender) => {
  selectedSenderId.value = sender.userId;
  
  // 向父组件发送事件
  emit('select-sender', {
    senderId: sender.userId,
    senderName: sender.name,
    // 不再传递messages数组，因为新API不提供消息内容，只提供联系人信息
    contactInfo: sender
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
        console.log('获取用户信息成功:', {
          userId,
          userData: userResponse.data,
          avatar: userResponse.data.avatar
        });
        // 保存到缓存
        contactUsers.value.set(userId, userResponse.data);
        
        // 更新联系人列表中的用户信息
        contacts.value = contacts.value.map(contact => {
          if (contact.userId === userId) {
            return {
              ...contact,
              avatar: userResponse.data.avatar,
              name: userResponse.data.username
            };
          }
          return contact;
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
        
        // 更新联系人列表中的用户信息
        contacts.value = contacts.value.map(contact => {
          if (contact.userId === userId) {
            return {
              ...contact,
              avatar: dealerResponse.data.avatar,
              name: dealerResponse.data.username
            };
          }
          return contact;
        });
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

// 组件挂载时执行
onMounted(async () => {
  // 初始化Lucide图标
  if (window.lucide) {
    window.lucide.createIcons();
  }
  
  // 获取消息联系人列表
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

/* 深色模式下的边框颜色 */
:root[data-theme="dark"] .panel-header {
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.panel-title {
  margin: 0;
  font-size: 1.1rem;
  font-weight: 500;
  color: #333;
}

/* 深色模式下标题颜色 */
:root[data-theme="dark"] .panel-title {
  color: #ffffff;
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

/* 深色模式下空状态和加载状态颜色 */
:root[data-theme="dark"] .panel-loading,
:root[data-theme="dark"] .panel-empty {
  color: rgba(255, 255, 255, 0.7);
}

.panel-empty i {
  margin-bottom: 1rem;
  color: #ccc;
  width: 48px;
  height: 48px;
  stroke-width: 1;
}

/* 深色模式下空状态图标颜色 */
:root[data-theme="dark"] .panel-empty i {
  color: rgba(255, 255, 255, 0.5);
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

/* 深色模式下发送者名称颜色 */
:root[data-theme="dark"] .sender-name {
  color: #ffffff;
}

.sender-name.system-name {
  color: #f5a623;
  font-weight: 600;
}

/* 深色模式下系统发送者名称颜色 */
:root[data-theme="dark"] .sender-name.system-name {
  color: #FFD700;
}

.last-message {
  color: #666;
  font-size: 0.85rem;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  max-width: 100%;
}

/* 深色模式下最后消息颜色 */
:root[data-theme="dark"] .last-message {
  color: rgba(255, 255, 255, 0.7);
}

.message-time {
  font-size: 0.75rem;
  color: #999;
  align-self: flex-start;
  margin-top: 4px;
}

/* 深色模式下时间颜色 */
:root[data-theme="dark"] .message-time {
  color: rgba(255, 255, 255, 0.5);
}

/* 深色模式下为头像添加白色边框 */
:root[data-theme="dark"] .sender-avatar img {
  border: 2px solid rgba(255, 255, 255, 0.7);
  box-sizing: border-box;
}

/* 深色模式下的悬停效果 */
:root[data-theme="dark"] .sender-item:hover {
  background-color: rgba(255, 255, 255, 0.05);
}

/* 深色模式下的选中效果 */
:root[data-theme="dark"] .sender-item.active {
  background-color: rgba(255, 215, 0, 0.1);
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