<template>
  <div class="message-center">
    <div class="message-header">
      <div class="header-left">
        <BackButton @click="goBack" />
      </div>
      <div class="header-center">
        <h2 class="page-title">消息中心</h2>
      </div>
      <div class="header-right"></div>
    </div>
    
    <div class="content-container">
      <!-- 消息容器 - 左侧 -->
      <div class="message-container">
        <MessagePanel @select-sender="handleSenderSelect" />
      </div>
      
      <!-- 聊天容器 - 右侧 -->
      <div class="chat-container">
        <div v-if="!selectedSender" class="placeholder-content">
          <i data-lucide="message-circle"></i>
          <p>选择一个联系人开始聊天</p>
        </div>
        
        <ChatView 
          v-else
          ref="chatViewRef"
          :key="'chat-' + selectedSender.senderId"
          :contact-id="selectedSender.senderId"
          :contact-name="selectedSender.senderName"
          :is-embedded="true"
          @go-back="clearSelectedSender"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, nextTick } from 'vue';
import { useRouter } from 'vue-router';
import { messageService, logService } from '@/services';
import BackButton from '../commons/BackButton.vue';
import MessagePanel from './components/MessagePanel.vue';
import ChatView from './ChatView.vue';

const router = useRouter();
const chatViewRef = ref(null);
const selectedSender = ref(null);

const goBack = () => {
  logService.info('用户从消息中心返回首页');
  router.push('/');
};

// 处理发送者选择
const handleSenderSelect = (sender) => {
  selectedSender.value = sender;
  logService.info('选择了发送者', { senderId: sender.senderId, name: sender.senderName });
  
  // 等待ChatView组件挂载完成后加载消息
  nextTick(() => {
    if (chatViewRef.value) {
      // ChatView组件自身会负责加载消息，无需在这里触发
      logService.info('ChatView组件已初始化', { contactId: sender.senderId });
    }
  });
};

// 清除选中的发送者
const clearSelectedSender = () => {
  selectedSender.value = null;
};

// 确保在使用Lucide图标的地方正确初始化
onMounted(() => {
  if (window.lucide) {
    window.lucide.createIcons();
  }
});
</script>

<style scoped>
.message-center {
  width: 100%;
  height: 100vh;
  background-color: #f5f7fa;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  position: relative;
}

.message-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.8rem 1rem;
  background-color: #fff;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
  max-width: 1400px;
  margin-left: auto;
  margin-right: auto;
  width: 100%;
  z-index: 10;
  flex-shrink: 0;
}

.header-left, .header-right {
  flex: 1;
  display: flex;
  align-items: center;
}

.header-left {
  justify-content: flex-start;
}

.header-right {
  justify-content: flex-end;
}

.header-center {
  flex: 2;
  display: flex;
  justify-content: center;
  align-items: center;
}

.page-title {
  margin: 0;
  font-size: 1.25rem;
  font-weight: 600;
  text-align: center;
}

.content-container {
  display: flex;
  flex-direction: row;
  flex: 1;
  width: 100%;
  max-width: 1400px;
  margin: 1rem auto 0;
  gap: 1rem;
  height: 0;
  min-height: 0;
  overflow: hidden;
  position: relative;
  padding: 0 1rem 1rem;
  box-sizing: border-box;
}

.message-container {
  width: 30%;
  background: #fff;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
  border-radius: 4px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  height: 95%;
  position: relative;
  min-width: 250px;
}

.chat-container {
  width: 70%;
  background: #fff;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
  border-radius: 4px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  height: 95%;
  position: relative;
  min-width: 320px;
}

.placeholder-content {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100%;
  color: #888;
  background-color: #f9f9f9;
}

.placeholder-content i {
  width: 64px;
  height: 64px;
  stroke-width: 1;
  margin-bottom: 1rem;
  color: #ccc;
}

.placeholder-content p {
  font-size: 1.1rem;
}

@media (max-width: 768px) {
  .message-header {
    padding: 0.5rem 0.8rem;
  }
  
  .content-container {
    flex-direction: column;
    margin-top: 0.5rem;
    height: 0;
    padding: 0 0.5rem 0.5rem;
  }
  
  .message-container,
  .chat-container {
    width: 100%;
    margin-top: 0.5rem;
    height: 50%;
    min-height: 0;
    min-width: 0;
  }
  
  .message-center {
    height: 100vh;
    overflow: hidden;
  }
  
  .page-title {
    font-size: 1.1rem;
  }
  
  .placeholder-content i {
    width: 48px;
    height: 48px;
  }
  
  .placeholder-content p {
    font-size: 1rem;
  }
}
</style> 