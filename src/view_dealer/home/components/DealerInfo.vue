<template>
  <div class="dealer-info-container">
    <base-panel title="经销商信息" class="dealer-info-panel">
      <!-- 加载状态 -->
      <div v-if="loading" class="loading-container">
        <div class="loading-spinner"></div>
        <p>加载中...</p>
      </div>
      
      <!-- 错误状态 -->
      <div v-else-if="error" class="error-container">
        <span class="error-icon">⚠️</span>
        <p>{{ error }}</p>
        <button class="btn btn-primary" @click="loadUserDetail(userId)">重试</button>
      </div>
      
      <!-- 空状态 -->
      <div v-else-if="!dealerInfo" class="empty-container">
        <p>无经销商信息</p>
      </div>
      
      <!-- 信息内容 -->
      <div v-else class="dealer-info-content">
        <!-- 经销商主要信息 -->
        <div class="dealer-header">
          <div class="dealer-name">{{ dealerInfo.dealerName }}</div>
          <div class="dealer-status" :class="{ 'status-active': dealerInfo.status }">
            {{ dealerInfo.status ? '正常' : '禁用' }}
          </div>
        </div>
        
        <!-- 经销商详细信息列表 -->
        <div class="info-list">
          <div class="info-item">
            <strong>经销商ID：</strong>{{ dealerInfo.dealerId }}
          </div>
          
          <div class="info-item">
            <strong>地址：</strong>{{ dealerInfo.address }}
          </div>
          
          <div class="info-item">
            <strong>营业执照：</strong>{{ dealerInfo.businessLicense }}
          </div>
          
          <div class="info-item">
            <strong>联系人：</strong>{{ dealerInfo.contactPerson }}
          </div>
          
          <div class="info-item">
            <strong>联系电话：</strong>{{ dealerInfo.contactPhone }}
          </div>
          
          <div class="info-item description">
            <strong>描述：</strong>
            <span class="description-text">{{ dealerInfo.description }}</span>
          </div>
        </div>
      </div>
      
      <!-- 操作按钮 -->
      <template #footer>
        <button class="btn btn-primary" @click="refreshDealerInfo">
          刷新信息
        </button>
      </template>
    </base-panel>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue';
import userAdminService from '@/api/userAdminService';
import BasePanel from '@components/card/BasePanel.vue';

// 定义属性
const props = defineProps({
  // 用户ID，如果提供则自动加载该用户的经销商信息
  userId: {
    type: [Number, String],
    default: null
  },
  // 直接提供经销商信息对象
  dealerInfoData: {
    type: Object,
    default: null
  }
});

// 定义事件
const emit = defineEmits(['loaded', 'error']);

// 定义内部状态
const dealerInfo = ref(props.dealerInfoData);
const loading = ref(false);
const error = ref('');

// 加载用户详情以获取经销商信息
const loadUserDetail = async (userId) => {
  if (!userId) {
    console.log('DealerInfo: userId为空，无法加载经销商信息');
    return;
  }
  
  console.log('DealerInfo: 开始加载经销商信息，userId:', userId);
  loading.value = true;
  error.value = '';
  
  try {
    console.log('DealerInfo: 调用userAdminService.getUserDetailNoAuth, userId:', userId);
    const response = await userAdminService.getUserDetailNoAuth(userId);
    console.log('DealerInfo: 获取用户详情响应:', response);
    
    if (response.success && response.data) {
      dealerInfo.value = response.data.dealerInfo || null;
      console.log('DealerInfo: 经销商信息:', dealerInfo.value);
      emit('loaded', dealerInfo.value);
    } else {
      error.value = response.message || '获取经销商信息失败';
      console.error('DealerInfo: 获取经销商信息失败:', error.value);
      emit('error', error.value);
    }
  } catch (err) {
    console.error('DealerInfo: 加载经销商信息出错:', err);
    error.value = err.message || '加载经销商信息时发生错误';
    emit('error', error.value);
  } finally {
    loading.value = false;
  }
};

// 刷新经销商信息
const refreshDealerInfo = () => {
  if (props.userId) {
    loadUserDetail(props.userId);
  }
};

// 更新经销商信息
const updateDealerInfo = () => {
  if (props.dealerInfoData) {
    dealerInfo.value = props.dealerInfoData;
    loading.value = false;
    error.value = '';
  } else if (props.userId) {
    loadUserDetail(props.userId);
  }
};

// 初始化
onMounted(() => {
  updateDealerInfo();
});

// 监听属性变化
watch(() => props.userId, (newVal) => {
  if (newVal) {
    loadUserDetail(newVal);
  }
});

watch(() => props.dealerInfoData, (newVal) => {
  if (newVal) {
    dealerInfo.value = newVal;
    loading.value = false;
    error.value = '';
  }
});
</script>

<style scoped>
.dealer-info-container {
  position: relative;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
  width: 100%;
  height: 100%;
}

.dealer-info-panel {
  width: 100%;
  height: 100%;
}

.loading-container,
.error-container,
.empty-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 1rem;
  gap: 0.75rem;
  text-align: center;
  height: 100%;
}

.loading-spinner {
  width: 30px;
  height: 30px;
  border: 3px solid var(--spinner-color, #f3f3f3);
  border-top: 3px solid var(--primary-color, #000000);
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.error-icon {
  font-size: 1.5rem;
}

.dealer-info-content {
  display: flex;
  flex-direction: column;
  height: 100%;
  padding: 1rem;
}

.dealer-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  padding-bottom: 0.5rem;
  border-bottom: 1px solid var(--border-color, #eaeaea);
}

.dealer-name {
  font-size: 1.1rem;
  font-weight: 600;
}

.dealer-status {
  padding: 0.2rem 0.6rem;
  border-radius: 1rem;
  font-size: 0.75rem;
  font-weight: 500;
  background-color: #e74c3c;
  color: white;
}

.dealer-status.status-active {
  background-color: var(--primary-color, #000000);
}

.info-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding: 0.5rem 0;
}

.info-item {
  font-size: 0.95rem;
  line-height: 1.5;
  display: flex;
  align-items: baseline;
}

.info-item strong {
  font-weight: 600;
  margin-right: 0.5rem;
  min-width: 90px;
}

.info-item.description {
  flex-direction: column;
  margin-top: 0.5rem;
}

.description-text {
  margin-top: 0.5rem;
  white-space: pre-line;
}

/* 按钮样式 */
.btn {
  background: none;
  border: none;
  font-size: 0.85rem;
  font-weight: 500;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-primary {
  background-color: var(--btn-primary-bg, #000000);
  color: var(--btn-primary-text, #ffffff);
  border: 1px solid transparent;
}

.btn-primary:hover {
  opacity: 0.9;
}

/* 深色模式适配 */
:root[data-theme="dark"] .dealer-status.status-active {
  background-color: var(--primary-color, #ffffff);
  color: black;
}

/* 响应式调整 */
@media (max-width: 768px) {
  .info-item {
    font-size: 0.9rem;
  }
  
  .info-item strong {
    min-width: 80px;
  }
}
</style> 