<template>
  <div class="message-center">
    <div class="page-header">
      <h2>消息中心</h2>
      <va-button @click="goBack" preset="secondary" icon="arrow_back" size="small">返回首页</va-button>
    </div>
    
    <!-- 标签页 -->
    <va-tabs v-model="activeTab" grow>
      <va-tab name="system">系统消息</va-tab>
      <va-tab name="interaction">交互消息</va-tab>
    </va-tabs>
    
    <!-- 系统消息内容 -->
    <div v-if="activeTab === 'system'">
      <div class="filter-section">
        <va-button @click="fetchMessages" icon="refresh" preset="secondary">刷新</va-button>
      </div>
      
      <!-- 加载状态 -->
      <div v-if="loading" class="loading-container">
        <va-progress-circle indeterminate color="primary" />
        <p>加载消息数据中...</p>
      </div>
      
      <!-- 空状态 -->
      <div v-else-if="messages.length === 0" class="empty-container">
        <va-icon name="inbox" size="large" />
        <p>{{ errorMessage || '暂无消息记录' }}</p>
        <va-button @click="fetchMessages" preset="primary" size="small">重新加载</va-button>
      </div>
      
      <!-- 消息列表 -->
      <div v-else class="messages-list">
        <div v-for="message in messages" :key="message.id" class="message-card" :class="{ 'unread': !message.read }">
          <div class="message-header">
            <div class="message-left">
              <div v-if="!message.read" class="unread-indicator"></div>
              <h3 class="message-title">{{ message.title || '系统通知' }}</h3>
            </div>
            <span class="message-time">{{ formatDate(message.sendTime || message.createTime) }}</span>
          </div>
          
          <div class="message-info" v-if="message.fromUserName">
            <span class="message-from">来自: {{ message.fromUserName }}</span>
          </div>
          
          <div class="message-content">
            {{ message.content }}
          </div>
          
          <div class="message-actions">
            <va-button 
              v-if="!message.read" 
              @click="markAsRead(message.id)"
              preset="primary"
              size="small"
              icon="mark_email_read"
              :loading="markReadLoading === message.id"
            >
              标记已读
            </va-button>
            
            <va-button 
              @click="deleteMessage(message.id)"
              preset="danger"
              size="small"
              icon="delete"
              :loading="deleteLoading === message.id"
            >
              删除
            </va-button>
          </div>
        </div>
        
        <!-- 分页器 -->
        <div class="pagination-wrapper" v-if="total > pageSize">
          <va-pagination
            v-model="currentPage"
            :pages="Math.ceil(total / pageSize)"
            :visible-pages="5"
            @update:modelValue="handlePageChange"
          />
        </div>
      </div>
    </div>
    
    <!-- 交互消息内容 -->
    <div v-else-if="activeTab === 'interaction'">
      <div class="filter-section">
        <va-button @click="fetchInteractionMessages" icon="refresh" preset="secondary">刷新</va-button>
      </div>
      
      <!-- 加载状态 -->
      <div v-if="interactionLoading" class="loading-container">
        <va-progress-circle indeterminate color="primary" />
        <p>加载交互消息数据中...</p>
      </div>
      
      <!-- 空状态 -->
      <div v-else-if="interactionMessages.length === 0" class="empty-container">
        <va-icon name="forum" size="large" />
        <p>{{ interactionErrorMessage || '暂无交互消息' }}</p>
        <va-button @click="fetchInteractionMessages" preset="primary" size="small">重新加载</va-button>
      </div>
      
      <!-- 交互消息列表 -->
      <div v-else class="messages-list">
        <!-- ... 交互消息列表内容 ... -->
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue';
import { useRouter } from 'vue-router';
import { useToast } from 'vuestic-ui';
import messageService from '@/api/messageService';

const router = useRouter();
const { init: toast } = useToast();

// 标签页状态
const activeTab = ref('system');

// 返回首页
const goBack = () => {
  router.push('/');
};

// 系统消息状态定义
const messages = ref([]);
const loading = ref(false);
const errorMessage = ref('');
const markReadLoading = ref(null);
const deleteLoading = ref(null);
const total = ref(0);
const currentPage = ref(1);
const pageSize = ref(20);

// 交互消息状态定义
const interactionMessages = ref([]);
const interactionLoading = ref(false);
const interactionErrorMessage = ref('');
const interactionTotal = ref(0);
const interactionCurrentPage = ref(1);
const interactionPageSize = ref(20);

// 获取系统消息列表
const fetchMessages = async () => {
  loading.value = true;
  errorMessage.value = '';
  
  try {
    const params = {
      pageNum: currentPage.value,
      pageSize: pageSize.value
    };
    
    const response = await messageService.getSystemMessages(params);
    
    // 只在明确的失败情况下设置错误
    if (!response) {
      errorMessage.value = '获取消息失败: 无响应';
      return;
    }
    
    if (response.code !== 200) {
      errorMessage.value = `获取消息失败: ${response.message || '未知错误'}`;
      return;
    }
    
    // 处理成功情况
    if (!response.data || !Array.isArray(response.data.list)) {
      messages.value = [];
      total.value = 0;
    } else {
      messages.value = response.data.list;
      total.value = response.data.total || 0;
      currentPage.value = response.data.pageNum || 1;
      pageSize.value = response.data.pageSize || 20;
    }
    
    // 只有在没有数据时才设置提示信息
    if (messages.value.length === 0) {
      errorMessage.value = '暂无消息';
    }
    
  } catch (error) {
    errorMessage.value = `获取消息异常: ${error.message || '未知错误'}`;
  } finally {
    loading.value = false;
  }
};

// 获取交互消息列表
const fetchInteractionMessages = async () => {
  interactionLoading.value = true;
  interactionErrorMessage.value = '';
  
  try {
    const params = {
      page: interactionCurrentPage.value,
      size: interactionPageSize.value
    };
    
    const response = await messageService.getInteractionMessages(params);
    console.log('获取交互消息响应:', response);
    
    if (response.success) {
      interactionMessages.value = response.data;
      interactionTotal.value = response.total;
      
      if (interactionMessages.value.length === 0) {
        interactionErrorMessage.value = '暂无交互消息';
      }
    } else {
      interactionErrorMessage.value = response.message || '获取交互消息失败';
      interactionMessages.value = [];
    }
  } catch (error) {
    console.error('获取交互消息异常:', error);
    interactionErrorMessage.value = `获取交互消息异常: ${error.message || '未知错误'}`;
  } finally {
    interactionLoading.value = false;
  }
};

// 标记消息为已读
const markAsRead = async (messageId) => {
  if (!messageId) return;
  
  markReadLoading.value = messageId;
  
  try {
    const response = await messageService.markMessageRead(messageId);
    
    if (response && response.code === 200) {
      // 更新本地消息状态
      const index = messages.value.findIndex(msg => msg.id === messageId);
      if (index !== -1) {
        messages.value[index].read = true;
      }
      
      toast({
        message: '消息已标记为已读',
        color: 'success'
      });
    } else {
      toast({
        message: response?.message || '标记消息已读失败',
        color: 'danger'
      });
    }
  } catch (error) {
    toast({
      message: '标记消息已读失败，请稍后重试',
      color: 'danger'
    });
  } finally {
    markReadLoading.value = null;
  }
};

// 删除消息
const deleteMessage = async (messageId) => {
  if (!messageId) return;
  
  deleteLoading.value = messageId;
  
  try {
    const response = await messageService.deleteMessage(messageId);
    
    if (response && response.code === 200) {
      // 从本地列表中移除该消息
      messages.value = messages.value.filter(msg => msg.id !== messageId);
      
      toast({
        message: '消息已成功删除',
        color: 'success'
      });
    } else {
      toast({
        message: response?.message || '删除消息失败',
        color: 'danger'
      });
    }
  } catch (error) {
    toast({
      message: '删除消息失败，请稍后重试',
      color: 'danger'
    });
  } finally {
    deleteLoading.value = null;
  }
};

// 批量标记消息为已读
const markAllRead = async () => {
  // ... 保持不变 ...
};

// 批量删除消息
const deleteAllMessages = async () => {
  // ... 保持不变 ...
};

// 格式化日期
const formatDate = (dateString) => {
  if (!dateString) return '未知时间';
  
  const date = new Date(dateString);
  const now = new Date();
  
  // 计算时间差（毫秒）
  const diff = now.getTime() - date.getTime();
  
  // 1小时内显示"x分钟前"
  if (diff < 3600000) {
    const minutes = Math.floor(diff / 60000);
    return minutes <= 0 ? '刚刚' : `${minutes}分钟前`;
  }
  
  // 24小时内显示"x小时前"
  if (diff < 86400000) {
    const hours = Math.floor(diff / 3600000);
    return `${hours}小时前`;
  }
  
  // 7天内显示星期几
  if (diff < 604800000) {
    const days = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
    return days[date.getDay()];
  }
  
  // 其他情况显示具体日期
  return `${date.getMonth() + 1}月${date.getDate()}日`;
};

// 页码变化处理
const handlePageChange = () => {
  fetchMessages();
};

// 初始化页面
onMounted(() => {
  // 加载系统消息
  fetchMessages();
});

// 监听标签页切换
watch(activeTab, (newValue) => {
  if (newValue === 'system') {
    fetchMessages();
  } else if (newValue === 'interaction') {
    fetchInteractionMessages();
  }
});

// 直接进入聊天详情页
const goToChat = (dealerId, carId = null) => {
  const route = {
    name: 'chat',
    params: { contactId: dealerId }
  };
  
  if (carId) {
    route.query = { carId };
  }
  
  router.push(route);
};
</script>

<style scoped>
.message-center {
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
}

.page-header {
  margin-bottom: 24px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.filter-section {
  display: flex;
  justify-content: flex-end;
  margin: 16px 0;
}

.loading-container,
.empty-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px;
  gap: 16px;
  color: #666;
  text-align: center;
}

.messages-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-top: 16px;
}

.message-card {
  background-color: #fff;
  border-radius: 8px;
  padding: 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
}

.message-card:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.message-card.unread {
  border-left: 3px solid var(--va-primary);
}

.message-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.message-left {
  display: flex;
  align-items: center;
  gap: 8px;
}

.unread-indicator {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background-color: var(--va-primary);
}

.message-title {
  margin: 0;
  font-size: 1.1rem;
}

.message-time {
  font-size: 0.85rem;
  color: #888;
}

.message-info {
  margin-bottom: 8px;
  font-size: 0.9rem;
  color: #666;
}

.message-content {
  margin-bottom: 16px;
  white-space: pre-line;
  line-height: 1.5;
}

.message-actions {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
}

.pagination-wrapper {
  display: flex;
  justify-content: center;
  margin-top: 24px;
}

/* 移除联系人列表相关样式 */
.chat-contacts-list {
  display: none;
}

/* 添加说明提示样式 */
.chat-instruction {
  text-align: center;
  padding: 20px;
  margin: 20px 0;
  background-color: #f9f9f9;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.chat-instruction p {
  margin-bottom: 10px;
}

.chat-instruction va-button {
  margin-top: 10px;
}
</style> 