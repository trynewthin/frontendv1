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
        <button class="btn btn-secondary" @click="showSubmitForm = true">
          {{ dealerInfo ? '修改信息' : '上传信息' }}
        </button>
        <button class="btn btn-primary" @click="refreshDealerInfo">
          刷新信息
        </button>
      </template>
    </base-panel>
    
    <!-- 添加经销商信息提交表单 -->
    <modal-dialog
      v-model="showSubmitForm"
      :title="dealerInfo ? '修改经销商信息' : '上传经销商信息'"
      :loading="formLoading"
      confirm-text="提交审核"
      cancel-text="取消"
      :close-on-click-overlay="false"
      @confirm="handleSubmitAndReviewClick"
      @cancel="closeSubmitForm"
      @update:model-value="handleModalVisibilityChange"
    >
      <template #default>
        <DealerSubmitForm 
          ref="submitFormRef"
          :dealerInfo="dealerInfo"
          @close="closeSubmitForm"
          @success="handleSubmitSuccess"
          @loading="updateLoading"
          @submit-and-review="handleSubmitAndReview"
        />
      </template>
      
      <template #footer>
        <div class="modal-footer">
          <button class="modal-button cancel-button" @click="closeSubmitForm">
            取消
          </button>
          <button class="modal-button confirm-button" :disabled="formLoading" @click="handleSubmitAndReviewClick">
            <div v-if="formLoading" class="loading-spinner"></div>
            <span>提交审核</span>
          </button>
        </div>
      </template>
    </modal-dialog>

    <!-- 添加审核申请表单 -->
    <modal-dialog
      v-model="showReviewForm"
      title="提交审核申请"
      :loading="reviewFormLoading"
      confirm-text="提交审核"
      cancel-text="取消"
      :close-on-click-overlay="false"
      @confirm="handleReviewConfirm"
      @cancel="closeReviewForm"
      @update:model-value="handleReviewModalVisibilityChange"
    >
      <template #default>
        <DealerReviewForm 
          ref="reviewFormRef"
          @close="closeReviewForm"
          @success="handleReviewSuccess"
          @loading="updateReviewLoading"
        />
      </template>
      
      <template #footer>
        <div class="modal-footer">
          <button class="modal-button cancel-button" @click="closeReviewForm">
            取消
          </button>
          <button class="modal-button confirm-button" :disabled="reviewFormLoading" @click="handleReviewConfirm">
            <div v-if="reviewFormLoading" class="loading-spinner"></div>
            <span>提交审核</span>
          </button>
        </div>
      </template>
    </modal-dialog>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue';
import userAdminService from '@/api/userAdminService';
import BasePanel from '@components/card/BasePanel.vue';
import DealerSubmitForm from './DealerSubmitForm.vue';
import ModalDialog from '@components/modelwindow/ModalDialog.vue';
import DealerReviewForm from './DealerReviewForm.vue';

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

// 控制表单显示和加载状态
const showSubmitForm = ref(false);
const formLoading = ref(false);
const submitFormRef = ref(null);

// 审核表单相关状态
const showReviewForm = ref(false);
const reviewFormLoading = ref(false);
const reviewFormRef = ref(null);

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
      
      // 同步更新localStorage中的经销商信息
      if (dealerInfo.value) {
        try {
          const userInfoStr = localStorage.getItem('userInfo');
          if (userInfoStr) {
            const userInfo = JSON.parse(userInfoStr);
            // 更新经销商ID
            userInfo.dealerId = dealerInfo.value.dealerId;
            localStorage.setItem('userInfo', JSON.stringify(userInfo));
            console.log('DealerInfo: 已同步更新localStorage中的经销商ID:', dealerInfo.value.dealerId);
          }
        } catch (e) {
          console.error('DealerInfo: 更新localStorage中的经销商ID失败:', e);
        }
      }
      
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

// 处理表单提交成功
const handleSubmitSuccess = (data) => {
  // 更新经销商信息
  dealerInfo.value = data;
  // 重置loading状态
  formLoading.value = false;
  // 关闭表单
  showSubmitForm.value = false;
  // 刷新经销商信息
  refreshDealerInfo();
};

// 点击确认按钮时调用表单提交方法
const handleConfirm = () => {
  if (submitFormRef.value) {
    submitFormRef.value.submitDealerInfo();
  }
};

// 更新加载状态 (处理DealerSubmitForm组件的loading状态)
const updateLoading = (isLoading) => {
  formLoading.value = isLoading;
};

// 关闭表单并重置状态
const closeSubmitForm = () => {
  showSubmitForm.value = false;
  formLoading.value = false;
  // 重置表单组件状态
  if (submitFormRef.value) {
    submitFormRef.value.resetForm();
  }
};

// 监听模态框可见性变化
const handleModalVisibilityChange = (isVisible) => {
  if (!isVisible) {
    formLoading.value = false;
    // 重置表单组件状态
    if (submitFormRef.value) {
      submitFormRef.value.resetForm();
    }
  }
};

// 处理提交并审核事件
const handleSubmitAndReview = (data) => {
  // 先更新经销商信息
  dealerInfo.value = data;
  // 关闭提交表单
  closeSubmitForm();
  // 刷新经销商信息
  refreshDealerInfo();
  // 打开审核申请表单
  showReviewForm.value = true;
};

// 点击确认按钮时调用审核表单提交方法
const handleReviewConfirm = () => {
  if (reviewFormRef.value) {
    reviewFormRef.value.submitReviewRequest();
  }
};

// 更新审核表单加载状态
const updateReviewLoading = (isLoading) => {
  reviewFormLoading.value = isLoading;
};

// 关闭审核表单并重置状态
const closeReviewForm = () => {
  showReviewForm.value = false;
  reviewFormLoading.value = false;
  // 重置表单组件状态
  if (reviewFormRef.value) {
    reviewFormRef.value.resetForm();
  }
};

// 监听审核表单模态框可见性变化
const handleReviewModalVisibilityChange = (isVisible) => {
  if (!isVisible) {
    reviewFormLoading.value = false;
    // 重置表单组件状态
    if (reviewFormRef.value) {
      reviewFormRef.value.resetForm();
    }
  }
};

// 处理审核表单提交成功
const handleReviewSuccess = (data) => {
  // 更新经销商信息
  if (dealerInfo.value) {
    dealerInfo.value.isReviewed = true;
  }
  // 重置loading状态
  reviewFormLoading.value = false;
  // 关闭表单
  showReviewForm.value = false;
  // 刷新经销商信息
  refreshDealerInfo();
};

// 点击"提交审核"按钮
const handleSubmitAndReviewClick = () => {
  if (submitFormRef.value) {
    submitFormRef.value.submitAndReview();
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

.btn-secondary {
  background-color: var(--btn-secondary-bg, #f0f0f0);
  color: var(--btn-secondary-text, #333333);
  border: 1px solid var(--border-color, #dddddd);
  margin-right: 8px;
}

.btn-secondary:hover {
  background-color: var(--btn-secondary-hover-bg, #e0e0e0);
}

/* 深色模式适配 */
:root[data-theme="dark"] .dealer-status.status-active {
  background-color: var(--primary-color, #ffffff);
  color: black;
}

:root[data-theme="dark"] .btn-secondary {
  background-color: var(--btn-secondary-bg, #333333);
  color: var(--btn-secondary-text, #e0e0e0);
  border-color: var(--border-color, #444444);
}

:root[data-theme="dark"] .btn-secondary:hover {
  background-color: var(--btn-secondary-hover-bg, #444444);
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

/* 模态框样式 */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-container {
  background-color: var(--card-bg-color, #ffffff);
  border-radius: 8px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
  width: 90%;
  max-width: 600px;
  max-height: 90vh;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
}

.modal-header {
  padding: 16px 20px;
  border-bottom: 1px solid var(--border-color, #eaeaea);
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.modal-header h3 {
  margin: 0;
  font-size: 1.2rem;
  color: var(--text-color, #333333);
}

.close-button {
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: var(--text-color, #333333);
  padding: 0;
  line-height: 1;
}

.modal-body {
  padding: 0;
  overflow-y: auto;
}

.modal-footer {
  padding: 16px 20px;
  border-top: 1px solid #eee;
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}

.modal-button {
  min-width: 100px;
  padding: 10px 16px;
  border-radius: 4px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  justify-content: center;
  align-items: center;
}

.modal-button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.cancel-button {
  background-color: #f5f5f5;
  color: #333;
  border: 1px solid #ddd;
}

.cancel-button:hover:not(:disabled) {
  background-color: #e8e8e8;
}

.confirm-button {
  background-color: #000;
  color: #fff;
  border: none;
}

.confirm-button:hover:not(:disabled) {
  background-color: #333;
}

.submit-review-button {
  background-color: #4a6fa5;
  color: white;
  border: none;
}

.submit-review-button:hover:not(:disabled) {
  background-color: #3a5980;
}

.loading-spinner {
  display: inline-block;
  width: 16px;
  height: 16px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  border-top-color: #fff;
  animation: spin 1s linear infinite;
  margin-right: 8px;
}
</style> 