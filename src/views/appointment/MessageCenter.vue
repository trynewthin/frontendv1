<template>
  <div class="message-center">
    <div class="page-header">
      <h2>消息中心</h2>
      <va-button @click="goBack" preset="secondary" icon="arrow_back" size="small">返回首页</va-button>
    </div>

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
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useToast } from 'vuestic-ui';
import messageService from '@/api/messageService';

const router = useRouter();
const { init: toast } = useToast();

// 返回首页
const goBack = () => {
  router.push('/');
};

// 状态定义
const messages = ref([]);
const loading = ref(false);
const errorMessage = ref('');
const markReadLoading = ref(null);
const deleteLoading = ref(null);
const total = ref(0);
const currentPage = ref(1);
const pageSize = ref(20);

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

// 页码变化处理
const handlePageChange = () => {
  fetchMessages();
};

// 格式化日期
const formatDate = (dateString) => {
  if (!dateString) return '未知时间';
  const date = new Date(dateString);
  return date.toLocaleString('zh-CN');
};

// 组件挂载时加载数据
onMounted(() => {
  fetchMessages();
});
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
  align-items: center;
  margin-bottom: 24px;
}

.loading-container,
.empty-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 0;
  text-align: center;
}

.loading-container p,
.empty-container p {
  margin: 16px 0;
  color: #666;
}

.messages-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.message-card {
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  padding: 20px;
  transition: transform 0.2s, box-shadow 0.2s;
}

.message-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.message-card.unread {
  border-left: 3px solid var(--va-primary);
}

.message-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
  padding-bottom: 12px;
  border-bottom: 1px solid #f0f0f0;
}

.message-left {
  display: flex;
  align-items: center;
  gap: 8px;
}

.message-title {
  margin: 0;
  font-size: 18px;
  font-weight: 600;
  color: #333;
}

.message-time {
  font-size: 14px;
  color: #999;
}

.unread-indicator {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background-color: var(--va-primary);
}

.message-info {
  margin-bottom: 12px;
  color: #666;
}

.message-content {
  color: #333;
  line-height: 1.6;
  margin-bottom: 16px;
}

.message-actions {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}

.pagination-wrapper {
  display: flex;
  justify-content: center;
  margin-top: 32px;
}

@media (max-width: 768px) {
  .filter-section {
    flex-direction: column;
    align-items: flex-end;
    gap: 16px;
  }
  
  .message-card {
    padding: 16px;
  }
}
</style> 