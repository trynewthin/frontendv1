<template>
  <div class="dealer-detail-panel" :class="{ 'visible': visible }">
    <div class="panel-overlay" @click="closePanel"></div>
    <div class="panel-content-wrapper" v-if="visible">
      <div class="panel-header">
        <div class="title-with-back">
          <button class="back-btn" @click="closePanel">
            <i class="fa fa-arrow-left"></i>
            返回列表
          </button>
          <h3>经销商详情</h3>
        </div>
        <button class="close-btn" @click="closePanel">
          <i class="fa fa-times"></i>
        </button>
      </div>
      
      <div class="panel-content">
        <div v-if="loading" class="loading-container">
          <div class="loading-spinner"></div>
          <p>正在加载经销商信息...</p>
        </div>
        
        <div v-else-if="error" class="error-container">
          <div class="error-icon">
            <i class="fa fa-exclamation-triangle"></i>
          </div>
          <p class="error-message">{{ error }}</p>
          <p class="error-tip">请检查网络连接或稍后再试</p>
          <button class="retry-btn" @click="loadDealerDetail">
            <i class="fa fa-refresh"></i> 重新加载
          </button>
        </div>
        
        <div v-else class="dealer-info-container">
          <!-- 经销商详情 -->
          <div class="dealer-info-card">
            <div class="status-badge-container">
              <span 
                class="status-badge"
                :class="{
                  'pending': dealerDetail.verifyStatus === 'PENDING',
                  'approved': dealerDetail.verifyStatus === 'APPROVED',
                  'rejected': dealerDetail.verifyStatus === 'REJECTED'
                }"
              >
                {{ formatVerifyStatus(dealerDetail.verifyStatus) }}
              </span>
            </div>
            
            <h4 class="dealer-name">{{ dealerDetail.name }}</h4>
            
            <div class="info-section">
              <div class="info-row">
                <span class="info-label">经销商ID:</span>
                <span class="info-value">{{ dealerDetail.id }}</span>
              </div>
              <div class="info-row">
                <span class="info-label">联系人:</span>
                <span class="info-value">{{ dealerDetail.contactPerson || '未设置' }}</span>
              </div>
              <div class="info-row">
                <span class="info-label">联系电话:</span>
                <span class="info-value">{{ dealerDetail.contactPhone || '未设置' }}</span>
              </div>
              <div class="info-row">
                <span class="info-label">所在地区:</span>
                <span class="info-value">{{ dealerDetail.region || '未设置' }}</span>
              </div>
              <div class="info-row">
                <span class="info-label">地址:</span>
                <span class="info-value">{{ dealerDetail.address || '未设置' }}</span>
              </div>
              <div class="info-row">
                <span class="info-label">营业执照:</span>
                <span class="info-value">{{ dealerDetail.businessLicense || '未提供' }}</span>
              </div>
              <div class="info-row">
                <span class="info-label">注册时间:</span>
                <span class="info-value">{{ formatDate(dealerDetail.registerTime) }}</span>
              </div>
              <div class="info-row" v-if="dealerDetail.verifyStatus !== 'PENDING'">
                <span class="info-label">审核时间:</span>
                <span class="info-value">{{ formatDate(dealerDetail.auditTime) }}</span>
              </div>
              <div class="info-row" v-if="dealerDetail.verifyStatus === 'REJECTED'">
                <span class="info-label">拒绝原因:</span>
                <span class="info-value rejection-reason">{{ dealerDetail.rejectReason || '未提供原因' }}</span>
              </div>
            </div>
            
            <div class="info-description" v-if="dealerDetail.description">
              <h5>经销商介绍</h5>
              <p>{{ dealerDetail.description }}</p>
            </div>
            
            <!-- 操作按钮 -->
            <div class="action-buttons" v-if="dealerDetail.verifyStatus === 'PENDING'">
              <button class="approve-btn" @click="openAuditDialog('APPROVED')">通过审核</button>
              <button class="reject-btn" @click="openAuditDialog('REJECTED')">拒绝申请</button>
            </div>
          </div>
          
          <!-- 经销商照片或证件 -->
          <div class="dealer-attachments" v-if="dealerDetail.attachments && dealerDetail.attachments.length">
            <h5>照片与证件</h5>
            <div class="attachments-grid">
              <div 
                v-for="(attachment, index) in dealerDetail.attachments" 
                :key="index"
                class="attachment-item"
              >
                <img :src="attachment.url" :alt="attachment.name" @click="viewAttachment(attachment)" />
                <span class="attachment-name">{{ attachment.name }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- 审核对话框 -->
      <ModalDialog
        v-model="showAuditModal"
        :title="auditAction === 'APPROVED' ? '通过审核' : '拒绝申请'"
        :loading="auditSubmitting"
        :confirmText="auditAction === 'APPROVED' ? '确认通过' : '确认拒绝'"
        @confirm="submitAudit"
      >
        <p>您确定要{{ auditAction === 'APPROVED' ? '通过' : '拒绝' }}经销商 <strong>{{ dealerDetail.name }}</strong> 的认证申请吗？</p>
        
        <div class="form-group" v-if="auditAction === 'REJECTED'">
          <label>拒绝原因：</label>
          <textarea v-model="auditRemark" rows="3" placeholder="请输入拒绝原因..."></textarea>
        </div>
        
        <div class="form-group" v-else>
          <label>备注：<span class="optional">(选填)</span></label>
          <textarea v-model="auditRemark" rows="2" placeholder="可添加备注说明..."></textarea>
        </div>
      </ModalDialog>
      
      <!-- 附件查看器 -->
      <ModalDialog
        v-model="showAttachmentViewer"
        title="查看附件"
        cancelText=""
        confirmText="关闭"
        @confirm="closeAttachmentViewer"
      >
        <div class="attachment-viewer-content">
          <img v-if="currentAttachment" :src="currentAttachment.url" :alt="currentAttachment.name" class="attachment-image" />
          <div class="attachment-name">{{ currentAttachment?.name }}</div>
        </div>
      </ModalDialog>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue';
import dealerService from '../../api/dealerService';
import ModalDialog from '../../components/modelwindow/ModalDialog.vue';

// 接收props
const props = defineProps({
  dealerId: {
    type: [Number, String],
    required: true
  },
  visible: {
    type: Boolean,
    default: false
  }
});

// 定义emit
const emit = defineEmits(['close', 'dealer-updated']);

// 状态
const loading = ref(false);
const error = ref('');
const dealerDetail = ref({});

// 审核相关
const showAuditModal = ref(false);
const auditAction = ref('APPROVED');
const auditRemark = ref('');
const auditSubmitting = ref(false);

// 附件查看器
const showAttachmentViewer = ref(false);
const currentAttachment = ref(null);

// 监听dealerId变化，重新加载经销商详情
watch(() => props.dealerId, (newVal) => {
  if (newVal && props.visible) {
    loadDealerDetail();
  }
});

// 监听visible变化，当变为true时加载经销商详情
watch(() => props.visible, (newVal) => {
  if (newVal && props.dealerId) {
    loadDealerDetail();
  }
});

// 加载经销商详情
const loadDealerDetail = async () => {
  if (!props.dealerId) return;
  
  loading.value = true;
  error.value = '';
  
  try {
    const response = await dealerService.getDealerDetail(props.dealerId);
    
    if (response.success && response.data) {
      // 处理经销商详情数据
      dealerDetail.value = {
        id: response.data.dealerId,
        name: response.data.dealerName,
        contactPerson: response.data.contactPerson,
        contactPhone: response.data.contactPhone,
        address: response.data.address,
        region: response.data.region || extractRegionFromAddress(response.data.address),
        businessLicense: response.data.businessLicense,
        verifyStatus: response.data.status,
        description: response.data.description,
        registerTime: response.data.createTime,
        auditTime: response.data.updateTime,
        rejectReason: response.data.rejectReason,
        attachments: processAttachments(response.data.attachments)
      };
    } else {
      error.value = response.message || '获取经销商详情失败';
    }
  } catch (err) {
    console.error('获取经销商详情出错:', err);
    error.value = '获取经销商详情时发生错误';
  } finally {
    loading.value = false;
  }
};

// 从地址中提取地区信息
const extractRegionFromAddress = (address) => {
  if (!address) return '未知';
  
  const regions = [
    '北京', '上海', '广州', '深圳', 
    '天津', '重庆', '河北', '山西', 
    '辽宁', '吉林', '黑龙江', '江苏', 
    '浙江', '安徽', '福建', '江西', 
    '山东', '河南', '湖北', '湖南', 
    '广东', '海南', '四川', '贵州', 
    '云南', '陕西', '甘肃', '青海', 
    '台湾', '内蒙古', '广西', '西藏', 
    '宁夏', '新疆', '香港', '澳门'
  ];
  
  for (const region of regions) {
    if (address.includes(region)) {
      return region;
    }
  }
  
  return '未知';
};

// 处理附件列表
const processAttachments = (attachments) => {
  if (!attachments || !Array.isArray(attachments)) return [];
  
  return attachments.map((attachment, index) => {
    return {
      url: attachment.url || attachment,
      name: attachment.name || `附件${index + 1}`
    };
  });
};

// 格式化日期
const formatDate = (dateString) => {
  if (!dateString) return '未知';
  
  const date = new Date(dateString);
  return date.toLocaleString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  });
};

// 格式化验证状态
const formatVerifyStatus = (status) => {
  const statusMap = {
    'PENDING': '待审核',
    'APPROVED': '已认证',
    'REJECTED': '已拒绝'
  };
  
  return statusMap[status] || status;
};

// 打开审核对话框
const openAuditDialog = (action) => {
  auditAction.value = action;
  auditRemark.value = '';
  showAuditModal.value = true;
};

// 关闭审核对话框
const closeAuditDialog = () => {
  showAuditModal.value = false;
};

// 提交审核
const submitAudit = async () => {
  if (auditSubmitting.value) return;
  
  // 如果是拒绝操作，需要填写拒绝原因
  if (auditAction.value === 'REJECTED' && !auditRemark.value.trim()) {
    alert('请填写拒绝原因');
    return;
  }
  
  auditSubmitting.value = true;
  
  try {
    // 将前端状态值转换为API期望的值
    const apiStatus = auditAction.value === 'APPROVED' ? 1 : 2;
    
    // 调用API进行审核
    const response = await dealerService.auditDealer(
      props.dealerId,
      apiStatus,
      auditRemark.value
    );
    
    if (response.success) {
      // 审核成功，更新本地状态
      dealerDetail.value.verifyStatus = auditAction.value;
      dealerDetail.value.auditTime = new Date().toISOString();
      
      if (auditAction.value === 'REJECTED') {
        dealerDetail.value.rejectReason = auditRemark.value;
      }
      
      // 提示成功
      alert(response.message || `经销商${auditAction.value === 'APPROVED' ? '认证通过' : '申请已拒绝'}`);
      
      // 通知父组件更新列表
      emit('dealer-updated');
    } else {
      // 审核失败
      alert(response.message || '操作失败，请重试');
    }
  } catch (err) {
    console.error('审核经销商出错:', err);
    alert('操作失败，请重试');
  } finally {
    auditSubmitting.value = false;
    showAuditModal.value = false;
  }
};

// 查看附件
const viewAttachment = (attachment) => {
  currentAttachment.value = attachment;
  showAttachmentViewer.value = true;
};

// 关闭附件查看器
const closeAttachmentViewer = () => {
  showAttachmentViewer.value = false;
  currentAttachment.value = null;
};

// 关闭面板
const closePanel = () => {
  emit('close');
};

// 组件挂载时加载经销商详情
onMounted(() => {
  if (props.visible && props.dealerId) {
    loadDealerDetail();
  }
});
</script>

<style scoped>
.dealer-detail-panel {
  position: fixed;
  top: 0;
  right: -100%;
  width: 100%;
  max-width: 600px;
  height: 100vh;
  background-color: white;
  box-shadow: -2px 0 10px rgba(0, 0, 0, 0.1);
  z-index: 1000;
  transition: right 0.3s ease;
  display: flex;
  flex-direction: column;
}

.dealer-detail-panel.visible {
  right: 0;
}

.panel-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 999;
  display: none;
}

.dealer-detail-panel.visible .panel-overlay {
  display: block;
}

.panel-content-wrapper {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  background-color: white;
  position: relative;
  z-index: 1001;
}

.panel-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  border-bottom: 1px solid #eee;
  background-color: #f8f9fa;
}

.title-with-back {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.back-btn {
  background: none;
  border: none;
  color: #666;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem;
  font-size: 0.9rem;
}

.back-btn:hover {
  color: var(--va-primary);
}

.close-btn {
  background: none;
  border: none;
  font-size: 1.2rem;
  color: #666;
  cursor: pointer;
  padding: 0.5rem;
}

.close-btn:hover {
  color: #ff4d4f;
}

.panel-content {
  flex: 1;
  overflow-y: auto;
  padding: 1rem;
}

.loading-container,
.error-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 200px;
  gap: 1rem;
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 3px solid rgba(0, 0, 0, 0.1);
  border-top-color: var(--va-primary);
  border-radius: 50%;
  animation: spin 1s infinite linear;
  margin-bottom: 1rem;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.error-icon {
  font-size: 3rem;
  color: #ff4d4f;
  margin-bottom: 1rem;
}

.error-message {
  font-size: 1.1rem;
  color: #ff4d4f;
  margin-bottom: 0.5rem;
}

.error-tip {
  color: #999;
  margin-bottom: 1.5rem;
  font-size: 0.9rem;
}

.retry-btn {
  padding: 0.5rem 1rem;
  background-color: #f5f5f5;
  border: 1px solid #ddd;
  border-radius: 4px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.retry-btn:hover {
  background-color: #e8e8e8;
}

.dealer-info-container {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.dealer-info-card {
  background: white;
  border: 1px solid #eee;
  border-radius: 8px;
  padding: 1.5rem;
  position: relative;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.status-badge-container {
  position: absolute;
  top: 1rem;
  right: 1rem;
}

.status-badge {
  display: inline-block;
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.85rem;
  font-weight: 500;
  text-align: center;
}

.status-badge.pending {
  background-color: #e6f7ff;
  color: #1890ff;
}

.status-badge.approved {
  background-color: #f6ffed;
  color: #52c41a;
}

.status-badge.rejected {
  background-color: #fff2f0;
  color: #ff4d4f;
}

.dealer-name {
  font-size: 1.5rem;
  margin: 0 0 1rem;
  padding-bottom: 0.75rem;
  border-bottom: 1px solid #f0f0f0;
}

.info-section {
  display: grid;
  grid-template-columns: 1fr;
  gap: 0.5rem;
  margin-bottom: 1rem;
}

.info-row {
  display: flex;
  align-items: flex-start;
}

.info-label {
  min-width: 80px;
  font-weight: 600;
  color: #666;
}

.info-value {
  flex: 1;
  color: #333;
}

.rejection-reason {
  color: #ff4d4f;
}

.info-description {
  margin-top: 1.5rem;
}

.info-description h5 {
  font-size: 1rem;
  margin: 0 0 0.5rem;
}

.info-description p {
  color: #666;
  margin: 0;
  line-height: 1.6;
  white-space: pre-line;
}

.action-buttons {
  display: flex;
  gap: 1rem;
  margin-top: 1.5rem;
  padding-top: 1rem;
  border-top: 1px solid #f0f0f0;
}

.approve-btn, .reject-btn {
  flex: 1;
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.3s;
}

.approve-btn {
  background-color: #52c41a;
  color: white;
}

.approve-btn:hover {
  background-color: #389e0d;
}

.reject-btn {
  background-color: #ff4d4f;
  color: white;
}

.reject-btn:hover {
  background-color: #cf1322;
}

.dealer-attachments {
  background: white;
  border: 1px solid #eee;
  border-radius: 8px;
  padding: 1.5rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.dealer-attachments h5 {
  font-size: 1rem;
  margin: 0 0 1rem;
}

.attachments-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
  gap: 1rem;
}

.attachment-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
}

.attachment-item img {
  width: 100%;
  height: 100px;
  object-fit: cover;
  border-radius: 4px;
  cursor: pointer;
  border: 1px solid #eee;
  transition: transform 0.2s;
}

.attachment-item img:hover {
  transform: scale(1.05);
}

.attachment-name {
  font-size: 0.8rem;
  color: #666;
  text-align: center;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  max-width: 100%;
}

/* 附件查看器样式 */
.attachment-viewer-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.attachment-image {
  max-width: 100%;
  max-height: 400px;
  object-fit: contain;
  margin-bottom: 1rem;
  border: 1px solid #eee;
}

.attachment-name {
  font-weight: 500;
  text-align: center;
  margin-top: 0.5rem;
}

/* 表单样式 */
.form-group {
  margin-bottom: 1rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
}

.form-group textarea {
  width: 100%;
  padding: 0.5rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  resize: vertical;
}

.optional {
  font-weight: normal;
  color: #999;
  font-size: 0.9em;
}

@media (max-width: 768px) {
  .dealer-detail-panel {
    width: 100%;
  }
  
  .info-section {
    grid-template-columns: 1fr;
  }
  
  .action-buttons {
    flex-direction: column;
  }
}
</style> 