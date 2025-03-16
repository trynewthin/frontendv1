<template>
  <BasePanel title="经销商管理" class="dealer-management">
    <div class="content-wrapper">
      <!-- 搜索和筛选区域 -->
      <div class="filter-section">
        <div class="search-box">
          <input 
            type="text" 
            v-model="searchKeyword" 
            placeholder="搜索经销商名称/联系人/联系方式" 
            class="search-input"
            @keyup.enter="onFilterChange"
          />
          <button class="search-btn" @click="onFilterChange">搜索</button>
        </div>
        <div class="filter-controls">
          <div class="filter-item">
            <label>认证状态:</label>
            <select v-model="filters.verifyStatus" @change="onFilterChange">
              <option value="">全部</option>
              <option value="PENDING">待审核</option>
              <option value="APPROVED">已认证</option>
              <option value="REJECTED">已拒绝</option>
            </select>
          </div>
          <div class="filter-item">
            <label>地区:</label>
            <select v-model="filters.region" @change="onFilterChange">
              <option value="">全部</option>
              <option value="华北">华北</option>
              <option value="华东">华东</option>
              <option value="华南">华南</option>
              <option value="西南">西南</option>
              <option value="西北">西北</option>
              <option value="东北">东北</option>
              <option value="华中">华中</option>
            </select>
          </div>
        </div>
      </div>

      <!-- 经销商列表区域 -->
      <div class="dealers-table-container">
        <!-- 错误提示 -->
        <div v-if="error" class="error-container">
          <div class="error-icon">
            <i class="fa fa-exclamation-triangle"></i>
          </div>
          <div class="error-message">{{ error }}</div>
          <button class="retry-btn" @click="loadDealers">重试</button>
        </div>
        
        <table class="dealers-table" v-if="!loading && !error && dealers.length > 0">
          <thead>
            <tr>
              <th>ID</th>
              <th>经销商名称</th>
              <th>联系人</th>
              <th>联系电话</th>
              <th>所在地区</th>
              <th>认证状态</th>
              <th>操作</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="dealer in dealers" :key="dealer.id">
              <td>{{ dealer.id }}</td>
              <td>{{ dealer.name }}</td>
              <td>{{ dealer.contactPerson || '-' }}</td>
              <td>{{ dealer.contactPhone || '-' }}</td>
              <td>{{ dealer.region || '-' }}</td>
              <td>
                <span 
                  class="status-badge" 
                  :class="{
                    'pending': dealer.verifyStatus === 'PENDING',
                    'approved': dealer.verifyStatus === 'APPROVED',
                    'rejected': dealer.verifyStatus === 'REJECTED'
                  }"
                >
                  {{ formatVerifyStatus(dealer.verifyStatus) }}
                </span>
              </td>
              <td class="action-buttons">
                <button class="view-btn" @click="viewDealerDetail(dealer.id)">查看</button>
                <button 
                  class="audit-btn" 
                  v-if="dealer.verifyStatus === 'PENDING'"
                  @click="openAuditModal(dealer)"
                >
                  审核
                </button>
                <button 
                  class="delete-btn" 
                  @click="confirmDelete(dealer)"
                >
                  删除
                </button>
              </td>
            </tr>
          </tbody>
        </table>

        <!-- 加载状态 -->
        <div v-if="loading" class="loading-container">
          <div class="loading-spinner"></div>
          <p>加载中...</p>
        </div>

        <!-- 无数据状态 -->
        <div v-if="!loading && !error && dealers.length === 0" class="empty-container">
          <div class="empty-icon">
            <i class="fa fa-inbox"></i>
          </div>
          <p>暂无经销商数据</p>
          <p class="empty-tip">请调整筛选条件或尝试稍后再试</p>
        </div>

        <!-- 分页控件 -->
        <div class="pagination-controls" v-if="!loading && !error && dealers.length > 0">
          <button 
            class="page-btn" 
            :disabled="currentPage <= 1" 
            @click="changePage(currentPage - 1)"
          >
            上一页
          </button>
          <span class="page-info">第 {{ currentPage }} 页 / 共 {{ totalPages }} 页</span>
          <button 
            class="page-btn" 
            :disabled="currentPage >= totalPages" 
            @click="changePage(currentPage + 1)"
          >
            下一页
          </button>
        </div>
      </div>
    </div>

    <!-- 经销商审核弹窗 -->
    <ModalDialog
      v-model="showAuditModal"
      title="经销商审核"
      :loading="auditSubmitting"
      @confirm="submitAudit"
    >
      <div v-if="selectedDealer" class="dealer-info">
        <div class="info-row">
          <span class="info-label">经销商名称:</span>
          <span class="info-value">{{ selectedDealer.name }}</span>
        </div>
        <div class="info-row">
          <span class="info-label">联系人:</span>
          <span class="info-value">{{ selectedDealer.contactPerson || '-' }}</span>
        </div>
        <div class="info-row">
          <span class="info-label">联系电话:</span>
          <span class="info-value">{{ selectedDealer.contactPhone || '-' }}</span>
        </div>
        <div class="info-row">
          <span class="info-label">所在地区:</span>
          <span class="info-value">{{ selectedDealer.region || '-' }}</span>
        </div>
      </div>
      <div class="audit-actions">
        <div class="form-group">
          <label>审核结果:</label>
          <div class="radio-group">
            <label class="radio-label">
              <input type="radio" v-model="auditResult" value="APPROVED" />
              通过
            </label>
            <label class="radio-label">
              <input type="radio" v-model="auditResult" value="REJECTED" />
              拒绝
            </label>
          </div>
        </div>
        <div class="form-group">
          <label>审核意见:</label>
          <textarea 
            v-model="auditComment" 
            rows="3" 
            placeholder="请输入审核意见..."
          ></textarea>
          <div class="form-tip" v-if="auditResult === 'REJECTED'">
            <i class="fa fa-info-circle"></i>
            拒绝申请时，审核意见必填，将发送给经销商作为反馈
          </div>
        </div>
      </div>
    </ModalDialog>

    <!-- 删除确认弹窗 -->
    <ModalDialog
      v-model="showDeleteModal"
      title="删除经销商"
      :loading="deleteSubmitting"
      confirmText="确认删除"
      @confirm="deleteDealer"
    >
      <p>您确定要删除经销商 <strong>{{ selectedDealer?.name }}</strong> 吗？此操作不可恢复。</p>
    </ModalDialog>

    <!-- 查看经销商详情弹窗 -->
    <ModalDialog
      v-model="showDealerViewModal"
      title="经销商详情"
      :loading="dealerViewLoading"
      confirmText="关闭"
      cancelText=""
      @confirm="closeDealerViewModal"
    >
      <div v-if="selectedDealerDetail" class="dealer-view-content">
        <div class="dealer-view-header">
          <h4>{{ selectedDealerDetail.name }}</h4>
          <span 
            class="status-badge" 
            :class="{
              'pending': selectedDealerDetail.verifyStatus === 'PENDING',
              'approved': selectedDealerDetail.verifyStatus === 'APPROVED',
              'rejected': selectedDealerDetail.verifyStatus === 'REJECTED'
            }"
          >
            {{ formatVerifyStatus(selectedDealerDetail.verifyStatus) }}
          </span>
        </div>
        <div class="dealer-view-info">
          <div class="info-row">
            <span class="info-label">经销商ID:</span>
            <span class="info-value">{{ selectedDealerDetail.id }}</span>
          </div>
          <div class="info-row">
            <span class="info-label">联系人:</span>
            <span class="info-value">{{ selectedDealerDetail.contactPerson || '未设置' }}</span>
          </div>
          <div class="info-row">
            <span class="info-label">联系电话:</span>
            <span class="info-value">{{ selectedDealerDetail.contactPhone || '未设置' }}</span>
          </div>
          <div class="info-row">
            <span class="info-label">所在地区:</span>
            <span class="info-value">{{ selectedDealerDetail.region || '未设置' }}</span>
          </div>
          <div class="info-row">
            <span class="info-label">地址:</span>
            <span class="info-value">{{ selectedDealerDetail.address || '未设置' }}</span>
          </div>
          <div class="info-row">
            <span class="info-label">营业执照:</span>
            <span class="info-value">{{ selectedDealerDetail.businessLicense || '未提供' }}</span>
          </div>
          <div class="info-row">
            <span class="info-label">注册时间:</span>
            <span class="info-value">{{ formatDate(selectedDealerDetail.registerTime) }}</span>
          </div>
          <div class="info-row" v-if="selectedDealerDetail.auditTime && selectedDealerDetail.verifyStatus !== 'PENDING'">
            <span class="info-label">审核时间:</span>
            <span class="info-value">{{ formatDate(selectedDealerDetail.auditTime) }}</span>
          </div>
          <div class="info-row" v-if="selectedDealerDetail.rejectReason && selectedDealerDetail.verifyStatus === 'REJECTED'">
            <span class="info-label">拒绝原因:</span>
            <span class="info-value rejection-reason">{{ selectedDealerDetail.rejectReason }}</span>
          </div>
        </div>
        
        <div class="info-description" v-if="selectedDealerDetail.description">
          <h5>经销商介绍</h5>
          <p>{{ selectedDealerDetail.description }}</p>
        </div>
        
        <!-- 操作按钮 -->
        <div class="action-buttons" v-if="selectedDealerDetail.verifyStatus === 'PENDING'">
          <button class="approve-btn" @click="auditFromDetailView('APPROVED')">通过审核</button>
          <button class="reject-btn" @click="auditFromDetailView('REJECTED')">拒绝申请</button>
        </div>
        
        <!-- 附件预览 -->
        <div class="dealer-attachments" v-if="selectedDealerDetail.attachments && selectedDealerDetail.attachments.length">
          <h5>照片与证件</h5>
          <div class="attachments-grid">
            <div 
              v-for="(attachment, index) in selectedDealerDetail.attachments" 
              :key="index"
              class="attachment-item"
            >
              <img :src="attachment.url" :alt="attachment.name" @click="viewAttachment(attachment)" />
              <span class="attachment-name">{{ attachment.name }}</span>
            </div>
          </div>
        </div>
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
  </BasePanel>
</template>

<script setup>
import { ref, reactive, onMounted, computed } from 'vue';
import { useRouter } from 'vue-router';
import BasePanel from '../../components/card/BasePanel.vue';
import ModalDialog from '../../components/modelwindow/ModalDialog.vue';

// 导入经销商管理服务和详情面板
import dealerService from '../../api/dealerService';

// 路由
const router = useRouter();

// 状态
const dealers = ref([]);
const loading = ref(false);
const error = ref('');
const currentPage = ref(1);
const totalPages = ref(1);
const totalDealers = ref(0);
const pageSize = ref(10);
const searchKeyword = ref('');
const filters = reactive({
  verifyStatus: '',
  region: ''
});

// 弹窗状态
const showAuditModal = ref(false);
const showDeleteModal = ref(false);
const selectedDealer = ref(null);
const auditResult = ref('APPROVED');
const auditComment = ref('');
const auditSubmitting = ref(false);
const deleteSubmitting = ref(false);

// 查看经销商详情弹窗状态
const showDealerViewModal = ref(false);
const dealerViewLoading = ref(false);
const selectedDealerDetail = ref(null);

// 附件查看器状态
const showAttachmentViewer = ref(false);
const currentAttachment = ref(null);

// 生命周期钩子
onMounted(() => {
  // 调试用户权限问题
  const userInfoString = localStorage.getItem('userInfo');
  console.log('经销商管理页面 - 当前用户信息:', userInfoString ? JSON.parse(userInfoString) : null);
  console.log('经销商管理页面 - isAdmin():', dealerService.isAdmin ? dealerService.isAdmin() : 'isAdmin方法不存在');
  
  // 加载经销商列表
  loadDealers();
});

// 当过滤器改变时，重置到第一页
function onFilterChange() {
  currentPage.value = 1;
  loadDealers();
}

// 方法
function loadDealers() {
  if (loading.value) return; // 如果正在加载，不重复发起请求
  
  loading.value = true;
  error.value = '';
  console.log('开始加载经销商数据, 当前页:', currentPage.value);
  
  dealerService.getDealerList({
    keyword: searchKeyword.value,
    verifyStatus: filters.verifyStatus,
    region: filters.region,
    page: currentPage.value,
    size: pageSize.value
  }).then(response => {
    console.log('获取经销商列表响应:', response);
    if (response.success) {
      dealers.value = response.data || []; // 确保data是数组
      totalPages.value = Math.ceil(response.total / pageSize.value) || 1;
      totalDealers.value = response.total || 0;
      console.log('经销商数据加载成功，共', dealers.value.length, '条记录, 总页数:', totalPages.value);
    } else {
      console.error('获取经销商列表失败:', response.message);
      error.value = response.message || '获取经销商列表失败';
      dealers.value = []; // 清空经销商列表
    }
  }).catch(err => {
    console.error('获取经销商列表出错:', err);
    error.value = err.message || '加载数据时发生错误，请稍后再试';
    dealers.value = []; // 出错时清空经销商列表
  }).finally(() => {
    loading.value = false;
  });
}

function changePage(page) {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page;
    loadDealers();
  }
}

function viewDealerDetail(dealerId) {
  loadDealerDetailForView(dealerId);
}

function loadDealerDetailForView(dealerId) {
  dealerViewLoading.value = true;
  showDealerViewModal.value = true;
  
  dealerService.getDealerDetail(dealerId)
    .then(response => {
      if (response.success && response.data) {
        selectedDealerDetail.value = {
          id: response.data.dealerId,
          name: response.data.dealerName,
          contactPerson: response.data.contactPerson,
          contactPhone: response.data.contactPhone,
          region: response.data.region,
          address: response.data.address,
          businessLicense: response.data.businessLicense,
          verifyStatus: response.data.status,
          description: response.data.description,
          registerTime: response.data.createTime,
          auditTime: response.data.updateTime,
          rejectReason: response.data.rejectReason,
          attachments: processAttachments(response.data.attachments)
        };
      } else {
        alert(response.message || '获取经销商详情失败');
      }
    })
    .catch(error => {
      console.error('获取经销商详情出错:', error);
      alert('获取经销商详情失败，请重试');
    })
    .finally(() => {
      dealerViewLoading.value = false;
    });
}

// 处理附件列表
function processAttachments(attachments) {
  if (!attachments || !Array.isArray(attachments)) return [];
  
  return attachments.map((attachment, index) => {
    return {
      url: attachment.url || attachment,
      name: attachment.name || `附件${index + 1}`
    };
  });
}

// 查看附件
function viewAttachment(attachment) {
  currentAttachment.value = attachment;
  showAttachmentViewer.value = true;
}

// 关闭附件查看器
function closeAttachmentViewer() {
  showAttachmentViewer.value = false;
  currentAttachment.value = null;
}

// 从详情视图发起审核
function auditFromDetailView(action) {
  closeDealerViewModal();
  
  // 构建一个简单的dealer对象，包含必要的信息用于审核
  const dealer = {
    id: selectedDealerDetail.value.id,
    name: selectedDealerDetail.value.name
  };
  
  // 调用现有的审核方法
  selectedDealer.value = dealer;
  auditResult.value = action;
  auditComment.value = '';
  showAuditModal.value = true;
}

function closeDealerViewModal() {
  showDealerViewModal.value = false;
  selectedDealerDetail.value = null;
}

function openAuditModal(dealer) {
  selectedDealer.value = dealer;
  auditResult.value = 'APPROVED';
  auditComment.value = '';
  showAuditModal.value = true;
}

function confirmDelete(dealer) {
  selectedDealer.value = dealer;
  showDeleteModal.value = true;
}

function submitAudit() {
  if (!selectedDealer.value || auditSubmitting.value) return;
  
  // 如果是拒绝操作，需要填写拒绝原因
  if (auditResult.value === 'REJECTED' && !auditComment.value.trim()) {
    alert('请填写拒绝原因');
    return;
  }
  
  // 显示处理中状态
  auditSubmitting.value = true;
  
  // 将前端状态值转换为API期望的值
  const apiStatus = auditResult.value === 'APPROVED' ? 1 : 2;
  
  // 发起审核请求
  dealerService.auditDealer(selectedDealer.value.id, apiStatus, auditComment.value)
    .then(response => {
      console.log('审核经销商响应:', response);
      if (response.success) {
        // 更新本地列表数据
        const index = dealers.value.findIndex(d => d.id === selectedDealer.value.id);
        if (index !== -1) {
          dealers.value[index].verifyStatus = auditResult.value;
        }
        
        // 提示成功
        alert(response.message || '审核操作成功');
      } else {
        // 审核失败
        alert(response.message || '操作失败，请重试');
      }
    })
    .catch(error => {
      console.error('审核经销商出错:', error);
      alert('操作失败，请重试');
    })
    .finally(() => {
      auditSubmitting.value = false;
      showAuditModal.value = false;
      
      // 重新加载列表数据
      loadDealers();
    });
}

function deleteDealer() {
  if (!selectedDealer.value || deleteSubmitting.value) return;
  
  // 显示处理中状态
  deleteSubmitting.value = true;
  
  dealerService.deleteDealer(selectedDealer.value.id)
    .then(response => {
      console.log('删除经销商响应:', response);
      if (response.success) {
        // 从列表中移除
        dealers.value = dealers.value.filter(d => d.id !== selectedDealer.value.id);
        
        // 提示成功
        alert(response.message || '经销商删除成功');
      } else {
        // 删除失败
        alert(response.message || '删除失败，请重试');
      }
    })
    .catch(error => {
      console.error('删除经销商出错:', error);
      alert('操作失败，请重试');
    })
    .finally(() => {
      deleteSubmitting.value = false;
      showDeleteModal.value = false;
    });
}

// 格式化函数
function formatDate(dateString) {
  if (!dateString) return '未知';
  const date = new Date(dateString);
  return `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`;
}

function formatVerifyStatus(status) {
  const statusMap = {
    'PENDING': '待审核',
    'APPROVED': '已认证',
    'REJECTED': '已拒绝'
  };
  return statusMap[status] || status;
}
</script>

<style scoped>
.dealer-management {
  height: 100%;
  width: 100%;
}

.content-wrapper {
  height: 100%;
  width: 100%;
  overflow-y: auto;
}

/* 搜索和筛选区域 */
.filter-section {
  background-color: var(--card-bg-color);
  padding: 1rem;
  border-radius: 8px;
  margin-bottom: 1.5rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  border: 1px solid rgba(0, 0, 0, 0.1);
}

.search-box {
  display: flex;
  margin-bottom: 1rem;
}

.search-input {
  flex: 1;
  padding: 0.5rem;
  border: 1px solid rgba(0, 0, 0, 0.15);
  border-right: none;
  border-radius: 4px 0 0 4px;
  font-size: 0.9rem;
  background-color: var(--card-bg-color);
  color: var(--text-color);
}

.search-input::placeholder {
  color: rgba(0, 0, 0, 0.45);
}

.search-btn {
  padding: 0.5rem 1rem;
  background-color: var(--primary-color);
  color: var(--btn-primary-text);
  border: 1px solid rgba(0, 0, 0, 0.3);
  border-radius: 0 4px 4px 0;
  cursor: pointer;
}

.search-btn:hover {
  border-color: rgba(0, 0, 0, 0.5);
}

.filter-controls {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
}

.filter-item {
  display: flex;
  align-items: center;
}

.filter-item label {
  margin-right: 0.5rem;
  font-size: 0.9rem;
  color: rgba(0, 0, 0, 0.85);
  font-weight: 500;
}

.filter-item select {
  padding: 0.35rem;
  border: 1px solid rgba(0, 0, 0, 0.15);
  border-radius: 4px;
  font-size: 0.9rem;
  background-color: var(--card-bg-color);
  color: rgba(0, 0, 0, 0.85);
}

/* 经销商列表表格 */
.dealers-table-container {
  width: 100%;
  overflow-x: auto;
}

.dealers-table {
  width: 100%;
  border-collapse: collapse;
  border: none;
  background-color: var(--card-bg-color);
}

.dealers-table th,
.dealers-table td {
  padding: 0.75rem;
  text-align: left;
  color: rgba(0, 0, 0, 0.85);
}

.dealers-table th {
  background-color: rgba(0, 0, 0, 0.02);
  font-weight: 600;
  color: rgba(0, 0, 0, 0.85);
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
}

.dealers-table td {
  border-bottom: none; /* 移除单元格底部边框 */
}

.dealers-table tr:hover {
  background-color: rgba(0, 0, 0, 0.02);
}

.status-badge {
  display: inline-block;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-size: 0.8rem;
  font-weight: 500;
}

.status-badge.pending {
  background-color: #e6f7ff;
  color: #0958d9;
  border: 1px solid #91caff;
}

.status-badge.approved {
  background-color: #f6ffed;
  color: #389e0d;
  border: 1px solid #b7eb8f;
}

.status-badge.rejected {
  background-color: #fff2f0;
  color: #cf1322;
  border: 1px solid #ffccc7;
}

.action-buttons {
  display: flex;
  gap: 0.5rem;
}

.action-buttons button {
  padding: 0.25rem 0.75rem;
  font-size: 0.8rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.2s ease;
}

.view-btn {
  background-color: #e6f4ff;
  color: #0958d9;
  border: 1px solid #91caff;
}

.view-btn:hover {
  background-color: #bae0ff;
}

.audit-btn {
  background-color: #fff7e6;
  color: #d46b08;
  border: 1px solid #ffd591;
}

.audit-btn:hover {
  background-color: #ffe7ba;
}

.delete-btn {
  background-color: #fff1f0;
  color: #cf1322;
  border: 1px solid #ffa39e;
}

.delete-btn:hover {
  background-color: #ffccc7;
}

/* 加载、错误和空数据状态 */
.loading-container,
.empty-container,
.error-container {
  padding: 3rem 1rem;
  text-align: center;
  color: rgba(0, 0, 0, 0.65);
}

.loading-spinner {
  display: inline-block;
  width: 2rem;
  height: 2rem;
  border: 3px solid rgba(0, 0, 0, 0.1);
  border-top-color: var(--va-primary);
  border-radius: 50%;
  animation: spin 1s infinite linear;
  margin-bottom: 1rem;
}

.error-icon,
.empty-icon {
  font-size: 2.5rem;
  margin-bottom: 1rem;
}

.error-icon {
  color: #ff4d4f;
}

.empty-icon {
  color: #bbb;
}

.error-message {
  color: #cf1322;
  font-weight: 500;
}

.empty-tip {
  color: rgba(0, 0, 0, 0.45);
}

.retry-btn {
  background-color: #f5f5f5;
  border: 1px solid #ddd;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
  margin-top: 1rem;
}

.retry-btn:hover {
  background-color: #e8e8e8;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

/* 分页控件 */
.pagination-controls {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 1.5rem;
  padding: 1rem 0;
}

.page-btn {
  padding: 0.4rem 0.8rem;
  border: 1px solid rgba(0, 0, 0, 0.15);
  background-color: var(--card-bg-color);
  border-radius: 4px;
  cursor: pointer;
  color: rgba(0, 0, 0, 0.85);
  font-weight: 500;
  transition: all 0.2s ease;
}

.page-btn:hover:not(:disabled) {
  background-color: rgba(0, 0, 0, 0.04);
  border-color: rgba(0, 0, 0, 0.25);
}

.page-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.page-info {
  margin: 0 1rem;
  color: rgba(0, 0, 0, 0.85);
  font-weight: 500;
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

.modal-content {
  background-color: var(--card-bg-color);
  padding: 1.5rem;
  border-radius: 8px;
  width: 90%;
  max-width: 500px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  border: 1px solid rgba(0, 0, 0, 0.1);
}

.modal-content h3 {
  margin-top: 0;
  margin-bottom: 1rem;
  color: rgba(0, 0, 0, 0.85);
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
  padding-bottom: 0.5rem;
  font-weight: 600;
}

.modal-body {
  margin-bottom: 1.5rem;
}

.dealer-info {
  background-color: rgba(0, 0, 0, 0.02);
  padding: 1rem;
  border-radius: 4px;
  margin-bottom: 1rem;
  border: 1px solid rgba(0, 0, 0, 0.1);
}

.info-row {
  margin-bottom: 0.5rem;
  display: flex;
}

.info-label {
  color: rgba(0, 0, 0, 0.65);
  width: 80px;
  flex-shrink: 0;
  font-weight: 500;
}

.info-value {
  font-weight: 500;
  color: rgba(0, 0, 0, 0.85);
}

.audit-actions {
  margin-top: 1rem;
}

.form-group {
  margin-bottom: 1rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  color: rgba(0, 0, 0, 0.85);
  font-weight: 500;
}

.form-tip {
  font-size: 0.8rem;
  color: #ff4d4f;
  margin-top: 0.5rem;
}

.radio-group {
  display: flex;
  gap: 1.5rem;
}

.radio-label {
  display: flex;
  align-items: center;
  cursor: pointer;
}

.radio-label input {
  margin-right: 0.5rem;
}

.form-group textarea {
  width: 100%;
  padding: 0.5rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-family: inherit;
  font-size: 0.9rem;
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
}

.cancel-btn, .confirm-btn, .delete-confirm-btn {
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
}

.cancel-btn {
  background-color: #f5f5f5;
  border: 1px solid #ddd;
  color: #666;
}

.confirm-btn {
  background-color: var(--va-primary);
  color: white;
  border: none;
}

.confirm-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.delete-confirm-btn {
  background-color: #ff4d4f;
  color: white;
  border: none;
}

.delete-confirm-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

@media (max-width: 768px) {
  .filter-controls {
    flex-direction: column;
    gap: 0.5rem;
  }
  
  .filter-item {
    width: 100%;
  }
  
  .filter-item select {
    flex: 1;
  }
  
  .search-input,
  .search-btn {
    font-size: 0.85rem;
    padding: 0.4rem 0.8rem;
  }
}

/* 深色模式适配 */
:root[data-theme="dark"] {
  /* 文字颜色变量 */
  --text-primary: rgba(255, 255, 255, 0.85);
  --text-secondary: rgba(255, 255, 255, 0.65);
  --text-disabled: rgba(255, 255, 255, 0.45);

  .search-input {
    color: var(--text-primary);
    border-color: rgba(255, 255, 255, 0.15);
  }

  .search-input::placeholder {
    color: var(--text-disabled);
  }

  .filter-item label {
    color: var(--text-primary);
  }

  .filter-item select {
    color: var(--text-primary);
    border-color: rgba(255, 255, 255, 0.15);
    background-color: var(--card-bg-color);
  }

  .filter-item select option {
    background-color: var(--card-bg-color);
    color: var(--text-primary);
  }

  .dealers-table {
    border-color: rgba(255, 255, 255, 0.15);
  }

  .dealers-table th,
  .dealers-table td {
    color: var(--text-primary);
    border-color: rgba(255, 255, 255, 0.15);
  }

  .dealers-table th {
    background-color: rgba(255, 255, 255, 0.04);
  }

  .dealers-table tr:hover {
    background-color: rgba(255, 255, 255, 0.04);
  }

  /* 状态标签深色模式 */
  .status-badge.pending {
    background-color: rgba(9, 88, 217, 0.15);
    color: #40a9ff;
    border-color: rgba(64, 169, 255, 0.3);
  }

  .status-badge.approved {
    background-color: rgba(56, 158, 13, 0.15);
    color: #73d13d;
    border-color: rgba(115, 209, 61, 0.3);
  }

  .status-badge.rejected {
    background-color: rgba(207, 19, 34, 0.15);
    color: #ff7875;
    border-color: rgba(255, 120, 117, 0.3);
  }

  /* 按钮深色模式 */
  .view-btn {
    background-color: rgba(9, 88, 217, 0.15);
    color: #40a9ff;
    border-color: rgba(64, 169, 255, 0.3);
  }

  .view-btn:hover {
    background-color: rgba(9, 88, 217, 0.25);
  }

  .audit-btn {
    background-color: rgba(212, 107, 8, 0.15);
    color: #ffa940;
    border-color: rgba(255, 169, 64, 0.3);
  }

  .audit-btn:hover {
    background-color: rgba(212, 107, 8, 0.25);
  }

  .delete-btn {
    background-color: rgba(207, 19, 34, 0.15);
    color: #ff7875;
    border-color: rgba(255, 120, 117, 0.3);
  }

  .delete-btn:hover {
    background-color: rgba(207, 19, 34, 0.25);
  }

  /* 分页控件深色模式 */
  .page-btn {
    color: var(--text-primary);
    border-color: rgba(255, 255, 255, 0.15);
    background-color: var(--card-bg-color);
  }

  .page-btn:hover:not(:disabled) {
    background-color: rgba(255, 255, 255, 0.08);
    border-color: rgba(255, 255, 255, 0.25);
  }

  .page-info {
    color: var(--text-primary);
  }

  /* 加载和空状态深色模式 */
  .loading-container,
  .empty-container,
  .error-container {
    color: var(--text-secondary);
  }

  .loading-spinner {
    border-color: rgba(255, 255, 255, 0.1);
    border-top-color: rgba(255, 255, 255, 0.85);
  }

  .empty-icon {
    color: rgba(255, 255, 255, 0.25);
  }

  .error-message {
    color: #ff7875;
  }

  .empty-tip {
    color: var(--text-disabled);
  }

  .retry-btn {
    background-color: rgba(255, 255, 255, 0.04);
    border-color: rgba(255, 255, 255, 0.15);
    color: var(--text-primary);
  }

  .retry-btn:hover {
    background-color: rgba(255, 255, 255, 0.08);
  }

  /* 弹窗深色模式 */
  .modal-content {
    border-color: rgba(255, 255, 255, 0.15);
  }

  .modal-content h3 {
    color: var(--text-primary);
    border-color: rgba(255, 255, 255, 0.15);
  }

  .dealer-info {
    background-color: rgba(255, 255, 255, 0.04);
    border-color: rgba(255, 255, 255, 0.15);
  }

  .info-label {
    color: var(--text-secondary);
  }

  .info-value {
    color: var(--text-primary);
  }

  .form-group label {
    color: var(--text-primary);
  }

  .form-group textarea {
    color: var(--text-primary);
    background-color: var(--card-bg-color);
    border-color: rgba(255, 255, 255, 0.15);
  }

  .radio-label {
    color: var(--text-primary);
  }

  .cancel-btn {
    background-color: rgba(255, 255, 255, 0.04);
    border-color: rgba(255, 255, 255, 0.15);
    color: var(--text-primary);
  }

  .confirm-btn {
    background-color: #1890ff;
    color: #ffffff;
  }

  .delete-confirm-btn {
    background-color: #ff4d4f;
    color: #ffffff;
  }
}

/* 新增的详情弹窗样式 */
.dealer-view-content {
  padding: 0.5rem;
}

.dealer-view-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
  padding-bottom: 0.5rem;
  border-bottom: 1px solid #eee;
}

.dealer-view-header h4 {
  margin: 0;
  font-size: 1.2rem;
}

.dealer-view-info {
  margin-bottom: 1.5rem;
}

.info-row {
  display: flex;
  margin-bottom: 0.5rem;
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
  margin: 1.5rem 0;
  padding-top: 1rem;
  border-top: 1px solid #f0f0f0;
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
  margin: 1.5rem 0;
}

.approve-btn, .reject-btn {
  flex: 1;
  padding: 0.5rem 1rem;
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

/* 附件查看样式 */
.dealer-attachments {
  margin-top: 1.5rem;
  padding-top: 1rem;
  border-top: 1px solid #f0f0f0;
}

.dealer-attachments h5 {
  font-size: 1rem;
  margin: 0 0 0.75rem;
}

.attachments-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
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
  height: 75px;
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
  margin-bottom: 0.5rem;
  border: 1px solid #eee;
}
</style> 