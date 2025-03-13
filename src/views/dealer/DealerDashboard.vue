<template>
  <div class="user-profile-container user-profile-view">
    <div class="profile-header">
      <h1 class="page-title">经销商中心</h1>
    </div>
    
    <!-- 工具标题栏 -->
    <div class="tools-bar">
      <!-- 返回主页按钮 -->
      <button class="tool-button" @click="goToHome">
        <i class="fa fa-home"></i> 返回主页
      </button>
      
      <!-- 提交经销商信息按钮 -->
      <button class="tool-button" @click="openSubmitDealerForm">
        <i class="fa fa-edit"></i> 提交经销商信息
      </button>
      
      <!-- 提交审核申请按钮 -->
      <button class="tool-button" @click="openSubmitReviewForm">
        <i class="fa fa-check-circle"></i> 提交审核申请
      </button>
      
      <!-- 车辆信息上传按钮 -->
      <button class="tool-button" @click="openCarUploadForm">
        <i class="fa fa-car"></i> 车辆信息上传
      </button>
      
      <!-- 车辆管理按钮 -->
      <button class="tool-button" @click="openCarManagementPanel">
        <i class="fa fa-list"></i> 车辆管理
      </button>
    </div>
    
    <!-- 面板显示容器 -->
    <div class="panels-container">
      <!-- 第一列：用户信息和经销商信息面板 -->
      <div class="panels-column">
        <!-- 用户信息面板 -->
        <UserInfoPanel class="user-panel" />
        
        <!-- 经销商信息面板 -->
        <DealerInfo 
          class="dealer-panel" 
          :userId="currentUserId"
          @loaded="handleDealerInfoLoaded" 
          @error="handleDealerInfoError"
        />
      </div>
    </div>
  </div>
  
  <!-- 提交经销商信息弹窗 -->
  <div v-if="showDealerSubmitForm" class="modal-overlay" @click.self="closeDealerSubmitForm">
    <div class="modal-container">
      <DealerSubmitForm 
        :dealerInfo="dealerInfo" 
        @close="closeDealerSubmitForm" 
        @success="handleDealerSubmitSuccess"
      />
    </div>
  </div>
  
  <!-- 提交审核申请弹窗 -->
  <div v-if="showReviewSubmitForm" class="modal-overlay" @click.self="closeReviewSubmitForm">
    <div class="modal-container">
      <DealerReviewForm 
        @close="closeReviewSubmitForm" 
        @success="handleReviewSubmitSuccess"
      />
    </div>
  </div>
  
  <!-- 车辆信息上传弹窗 -->
  <div v-if="showCarUploadForm" class="modal-overlay" @click.self="closeCarUploadForm">
    <div class="modal-container modal-container-large">
      <CarUploadForm 
        @close="closeCarUploadForm" 
        @success="handleCarUploadSuccess"
      />
    </div>
  </div>
  
  <!-- 车辆管理面板弹窗 -->
  <div v-if="showCarManagementPanel" class="modal-overlay" @click.self="closeCarManagementPanel">
    <div class="modal-container modal-container-large modal-container-wider">
      <CarManagementPanel 
        :externalDealerId="dealerInfo?.dealerId"
        @close="closeCarManagementPanel" 
        @add-car="handleAddCar"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import DealerInfo from '@/components/dealer/DealerInfo.vue';
import UserInfoPanel from '@/components/user/UserInfoPanel.vue';
import DealerSubmitForm from '@/components/dealer/DealerSubmitForm.vue';
import DealerReviewForm from '@/components/dealer/DealerReviewForm.vue';
import CarUploadForm from '@/components/dealer/CarUploadForm.vue';
import CarManagementPanel from '@/components/dealer/CarManagementPanel.vue';

// 路由实例
const router = useRouter();

// 当前用户ID
const currentUserId = ref(null);

// 经销商信息
const dealerInfo = ref(null);

// 弹窗状态
const showDealerSubmitForm = ref(false);
const showReviewSubmitForm = ref(false);
const showCarUploadForm = ref(false);
const showCarManagementPanel = ref(false);

// 初始化方法
onMounted(() => {
  // 从localStorage获取当前用户信息
  const userInfoStr = localStorage.getItem('userInfo');
  if (userInfoStr) {
    try {
      const userInfo = JSON.parse(userInfoStr);
      currentUserId.value = userInfo.userId;
    } catch (error) {
      console.error('解析用户信息出错:', error);
    }
  }
});

// 处理经销商信息加载完成
const handleDealerInfoLoaded = (info) => {
  dealerInfo.value = info;
  console.log('经销商信息加载成功:', info);
  
  // 存储经销商信息到localStorage，确保其他组件可以使用
  try {
    localStorage.setItem('dealerInfo', JSON.stringify({
      dealerId: info.dealerId,
      dealerName: info.dealerName,
      address: info.address,
      status: info.status
    }));
    console.log('经销商信息已存储到localStorage');
  } catch (e) {
    console.error('存储经销商信息失败:', e);
  }
};

// 处理经销商信息加载错误
const handleDealerInfoError = (errorMsg) => {
  console.error('加载经销商信息出错:', errorMsg);
};

// 返回主页方法
const goToHome = () => {
  router.push('/');
};

// 打开提交经销商信息弹窗
const openSubmitDealerForm = () => {
  showDealerSubmitForm.value = true;
};

// 关闭提交经销商信息弹窗
const closeDealerSubmitForm = () => {
  showDealerSubmitForm.value = false;
};

// 打开提交审核申请弹窗
const openSubmitReviewForm = () => {
  showReviewSubmitForm.value = true;
};

// 关闭提交审核申请弹窗
const closeReviewSubmitForm = () => {
  showReviewSubmitForm.value = false;
};

// 打开车辆信息上传弹窗
const openCarUploadForm = () => {
  showCarUploadForm.value = true;
};

// 关闭车辆信息上传弹窗
const closeCarUploadForm = () => {
  showCarUploadForm.value = false;
};

// 打开车辆管理面板
const openCarManagementPanel = () => {
  showCarManagementPanel.value = true;
};

// 关闭车辆管理面板
const closeCarManagementPanel = () => {
  showCarManagementPanel.value = false;
};

// 处理经销商信息提交成功
const handleDealerSubmitSuccess = (data) => {
  closeDealerSubmitForm();
  // 刷新经销商信息
  if (currentUserId.value) {
    // 这里可以直接更新dealerInfo，也可以触发DealerInfo组件重新加载
    dealerInfo.value = data;
  }
};

// 处理审核申请提交成功
const handleReviewSubmitSuccess = () => {
  closeReviewSubmitForm();
  // 可以在这里添加其他逻辑，比如显示成功消息等
};

// 处理车辆信息上传成功
const handleCarUploadSuccess = (data) => {
  closeCarUploadForm();
  console.log('车辆信息上传成功:', data);
  
  // 上传成功后，自动打开车辆管理面板
  setTimeout(() => {
    openCarManagementPanel();
  }, 500); // 延迟半秒打开，给用户一个视觉反馈
};

// 处理添加车辆
const handleAddCar = () => {
  // 关闭车辆管理面板
  closeCarManagementPanel();
  // 打开车辆上传表单
  openCarUploadForm();
};
</script>

<style scoped>
.user-profile-view {
  position: fixed !important;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  width: 100vw !important;
  height: 100vh !important;
  margin: 0 !important;
  padding: 0 !important;
  background-color: #ffffff !important; 
  overflow-y: auto;
  box-sizing: border-box;
}

.user-profile-container {
  padding: 0;
  min-height: 100vh;
  width: 100%;
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
  overflow-y: auto;
}

.profile-header {
  margin-bottom: 1.5rem;
  border-bottom: none;
  padding: 1rem 1rem 0.5rem; /* 将padding移到这里 */
  text-align: left;
}

.page-title {
  font-size: 2rem;
  color: var(--va-primary);
  font-weight: 600;
  display: inline-block;
  border-bottom: 2px solid var(--va-primary);
  padding-bottom: 0.5rem;
  margin-bottom: 0;
}

.tools-bar {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  margin-bottom: 1.5rem;
  padding: 0.5rem 1rem; /* 保持左右内边距一致 */
}

.tool-button {
  padding: 0.5rem 1rem;
  background-color: var(--va-primary);
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.9rem;
  transition: background-color 0.2s;
}

.tool-button:hover {
  background-color: rgb(146, 183, 252);
  color: rgb(0, 0, 0);
}

.panels-container {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-height: 400px;
  width: 100%;
  background-color: transparent;
  border-radius: 0; /* 移除边框圆角 */
  overflow: visible;
  gap: 1rem; /* 稍微减小间距 */
  padding: 0 1rem 1rem; /* 保持左右和底部内边距 */
}

.panels-column {
  display: flex;
  flex-direction: column;
  gap: 1rem; /* 减小列内间距 */
  width: 100%;
  align-items: stretch;
}

.user-panel,
.dealer-panel {
  flex: 0 0 auto;
  width: 100%;
  max-width: 100%;
  margin: 0; /* 确保没有外边距 */
  border-radius: 8px; /* 保持面板的圆角 */
}

@media (max-width: 768px) {
  .profile-header,
  .tools-bar,
  .panels-container {
    padding-left: 0.5rem;
    padding-right: 0.5rem;
  }
  
  .page-title {
    font-size: 1.5rem;
  }
  
  .tools-bar {
    gap: 0.5rem;
    margin-bottom: 1rem;
  }
}

@media (min-width: 769px) and (max-width: 1200px) {
  .panels-container {
    flex-direction: row;
    flex-wrap: wrap;
    gap: 1rem;
    align-items: flex-start;
  }
  
  .panels-column {
    flex: 1;
    min-width: 350px;
    width: calc(50% - 0.5rem); /* 调整宽度计算 */
    max-width: none; /* 移除最大宽度限制 */
  }
}

@media (min-width: 1201px) {
  .panels-container {
    flex-direction: row;
    gap: 1.5rem;
    align-items: flex-start;
  }
  
  .panels-column {
    flex: 1;
    min-width: 400px;
  }
}

/* 弹窗样式 */
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
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  width: 90%;
  max-width: 600px;
  max-height: 90vh;
  overflow-y: auto;
}

.modal-container-large {
  width: 95%;
  max-width: 900px;
}

.modal-container-wider {
  width: 100%;
  max-width: 1200px;
}
</style> 