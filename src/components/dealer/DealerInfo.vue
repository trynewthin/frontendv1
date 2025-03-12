<template>
  <div class="dealer-info-container">
    <h2 class="dealer-info-title">经销商信息</h2>
    
    <div v-if="loading" class="dealer-info-loading">
      <div class="spinner"></div>
      <p>加载中...</p>
    </div>
    
    <div v-else-if="error" class="dealer-info-error">
      <p>{{ error }}</p>
    </div>
    
    <div v-else-if="!dealerInfo" class="dealer-info-empty">
      <p>无经销商信息</p>
    </div>
    
    <div v-else class="dealer-info-content">
      <div class="dealer-info-item">
        <span class="dealer-info-label">经销商ID：</span>
        <span class="dealer-info-value">{{ dealerInfo.dealerId }}</span>
      </div>
      
      <div class="dealer-info-item">
        <span class="dealer-info-label">经销商名称：</span>
        <span class="dealer-info-value">{{ dealerInfo.dealerName }}</span>
      </div>
      
      <div class="dealer-info-item">
        <span class="dealer-info-label">地址：</span>
        <span class="dealer-info-value">{{ dealerInfo.address }}</span>
      </div>
      
      <div class="dealer-info-item">
        <span class="dealer-info-label">营业执照：</span>
        <span class="dealer-info-value">{{ dealerInfo.businessLicense }}</span>
      </div>
      
      <div class="dealer-info-item">
        <span class="dealer-info-label">联系人：</span>
        <span class="dealer-info-value">{{ dealerInfo.contactPerson }}</span>
      </div>
      
      <div class="dealer-info-item">
        <span class="dealer-info-label">联系电话：</span>
        <span class="dealer-info-value">{{ dealerInfo.contactPhone }}</span>
      </div>
      
      <div class="dealer-info-item">
        <span class="dealer-info-label">状态：</span>
        <span class="dealer-info-value">{{ dealerInfo.status ? '正常' : '禁用' }}</span>
      </div>
      
      <div class="dealer-info-item dealer-info-description">
        <span class="dealer-info-label">描述：</span>
        <span class="dealer-info-value">{{ dealerInfo.description }}</span>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, watch } from 'vue';
import userAdminService from '@/api/userAdminService';

export default {
  name: 'DealerInfo',
  
  props: {
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
  },
  
  emits: ['loaded', 'error'],
  
  setup(props, { emit }) {
    const dealerInfo = ref(props.dealerInfoData);
    const loading = ref(false);
    const error = ref('');
    
    // 加载用户详情以获取经销商信息
    const loadUserDetail = async (userId) => {
      if (!userId) return;
      
      loading.value = true;
      error.value = '';
      
      try {
        const response = await userAdminService.getUserDetailNoAuth(userId);
        
        if (response.success && response.data) {
          dealerInfo.value = response.data.dealerInfo || null;
          emit('loaded', dealerInfo.value);
        } else {
          error.value = response.message || '获取经销商信息失败';
          emit('error', error.value);
        }
      } catch (err) {
        console.error('加载经销商信息出错:', err);
        error.value = err.message || '加载经销商信息时发生错误';
        emit('error', error.value);
      } finally {
        loading.value = false;
      }
    };
    
    // 监听props变化
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
    
    // 监听props变化
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
    
    // 暴露方法和数据
    return {
      dealerInfo,
      loading,
      error,
      loadUserDetail
    };
  }
}
</script>

<style scoped>
.dealer-info-container {
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
  padding: 20px;
  margin-bottom: 20px;
}

.dealer-info-title {
  font-size: 18px;
  color: #333;
  margin-bottom: 20px;
  padding-bottom: 10px;
  border-bottom: 1px solid #eee;
}

.dealer-info-loading,
.dealer-info-error,
.dealer-info-empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 30px 0;
  color: #666;
}

.spinner {
  width: 30px;
  height: 30px;
  border: 3px solid rgba(0, 0, 0, 0.1);
  border-radius: 50%;
  border-top-color: #3498db;
  animation: spin 1s ease-in-out infinite;
  margin-bottom: 10px;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.dealer-info-error {
  color: #e74c3c;
}

.dealer-info-content {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.dealer-info-item {
  display: flex;
  align-items: flex-start;
}

.dealer-info-label {
  min-width: 100px;
  font-weight: 500;
  color: #666;
}

.dealer-info-value {
  flex: 1;
  color: #333;
}

.dealer-info-description {
  margin-top: 10px;
}

.dealer-info-description .dealer-info-value {
  white-space: pre-line;
}
</style> 