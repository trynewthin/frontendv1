<template>
  <div class="dealer-management-container">
    <h2 class="page-title">经销商管理</h2>
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
              <th>注册时间</th>
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
              <td>{{ formatDate(dealer.registerTime) }}</td>
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
    <div class="modal-overlay" v-if="showAuditModal" @click.self="showAuditModal = false">
      <div class="modal-content">
        <h3>经销商审核</h3>
        <div class="modal-body">
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
        </div>
        <div class="modal-footer">
          <button class="cancel-btn" @click="showAuditModal = false">取消</button>
          <button 
            class="confirm-btn" 
            :disabled="auditSubmitting || (auditResult === 'REJECTED' && !auditComment.trim())"
            @click="submitAudit"
          >
            <span v-if="auditSubmitting">处理中...</span>
            <span v-else>确认</span>
          </button>
        </div>
      </div>
    </div>

    <!-- 删除确认弹窗 -->
    <div class="modal-overlay" v-if="showDeleteModal" @click.self="showDeleteModal = false">
      <div class="modal-content">
        <h3>删除经销商</h3>
        <div class="modal-body">
          <p>您确定要删除经销商 <strong>{{ selectedDealer?.name }}</strong> 吗？此操作不可恢复。</p>
        </div>
        <div class="modal-footer">
          <button class="cancel-btn" @click="showDeleteModal = false">取消</button>
          <button 
            class="delete-confirm-btn" 
            :disabled="deleteSubmitting"
            @click="deleteDealer"
          >
            <span v-if="deleteSubmitting">处理中...</span>
            <span v-else>确认删除</span>
          </button>
        </div>
      </div>
    </div>

    <!-- 添加经销商详情侧边栏 -->
    <DealerDetailPanel
      :dealer-id="selectedDealerId"
      :visible="showDealerDetailPanel"
      @close="closeDealerDetailPanel"
      @dealer-updated="handleDealerUpdated"
    />
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue';
import { useRouter } from 'vue-router';

// 导入经销商管理服务和详情面板
import dealerService from '../../api/dealerService';
import DealerDetailPanel from '../../components/admin/DealerDetailPanel.vue';

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

// 侧边详情面板状态
const showDealerDetailPanel = ref(false);
const selectedDealerId = ref(null);

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
  // 打开侧边详情面板
  selectedDealerId.value = dealerId;
  showDealerDetailPanel.value = true;
}

function closeDealerDetailPanel() {
  showDealerDetailPanel.value = false;
}

function handleDealerUpdated() {
  // 经销商信息更新后重新加载列表
  loadDealers();
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
        
        // 关闭弹窗
        showAuditModal.value = false;
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
        
        // 关闭弹窗
        showDeleteModal.value = false;
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
.dealer-management-container {
  height: 100%;
  display: flex;
  flex-direction: column;
  width: 100%;
}

.page-title {
  font-size: 1.6rem;
  color: var(--va-primary);
  margin-bottom: 1rem;
  border-bottom: 1px solid #eee;
  padding-bottom: 0.5rem;
}

.content-wrapper {
  flex: 1;
  overflow-y: auto;
  background-color: #fff;
  width: 100%;
}

/* 搜索和筛选区域 */
.filter-section {
  background-color: #f9f9f9;
  padding: 1rem;
  border-radius: 8px;
  margin-bottom: 1.5rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.search-box {
  display: flex;
  margin-bottom: 1rem;
}

.search-input {
  flex: 1;
  padding: 0.5rem;
  border: 1px solid #ddd;
  border-right: none;
  border-radius: 4px 0 0 4px;
  font-size: 0.9rem;
}

.search-btn {
  padding: 0.5rem 1rem;
  background-color: var(--va-primary);
  color: white;
  border: none;
  border-radius: 0 4px 4px 0;
  cursor: pointer;
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
  color: #555;
}

.filter-item select,
.filter-item input[type="date"] {
  padding: 0.35rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 0.9rem;
}

/* 经销商列表表格 */
.dealers-table-container {
  width: 100%;
  overflow-x: auto;
}

.dealers-table {
  width: 100%;
  border-collapse: collapse;
  border: 1px solid #eee;
}

.dealers-table th,
.dealers-table td {
  padding: 0.75rem;
  text-align: left;
  border-bottom: 1px solid #eee;
}

.dealers-table th {
  background-color: #f5f5f5;
  font-weight: 600;
  color: #333;
}

.dealers-table tr:hover {
  background-color: #f9f9f9;
}

.status-badge {
  display: inline-block;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-size: 0.8rem;
}

.status-badge.pending {
  background-color: #e6f7ff;
  color: #1890ff;
}

.status-badge.approved {
  background-color: #e6f7ed;
  color: #52c41a;
}

.status-badge.rejected {
  background-color: #fff1f0;
  color: #ff4d4f;
}

.action-buttons {
  display: flex;
  gap: 0.5rem;
}

.action-buttons button {
  padding: 0.25rem 0.5rem;
  font-size: 0.8rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.view-btn {
  background-color: #e6f7ff;
  color: #1890ff;
}

.audit-btn {
  background-color: #fff7e6;
  color: #fa8c16;
}

.delete-btn {
  background-color: #fff1f0;
  color: #ff4d4f;
}

/* 加载、错误和空数据状态 */
.loading-container,
.empty-container,
.error-container {
  padding: 3rem 1rem;
  text-align: center;
  color: #666;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 200px;
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
  color: #ff4d4f;
  margin-bottom: 1rem;
}

.empty-tip {
  color: #999;
  font-size: 0.9rem;
  margin-top: 0.5rem;
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
  border: 1px solid #ddd;
  background-color: white;
  border-radius: 4px;
  cursor: pointer;
}

.page-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.page-info {
  margin: 0 1rem;
  color: #666;
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
  background-color: white;
  padding: 1.5rem;
  border-radius: 8px;
  width: 90%;
  max-width: 500px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.modal-content h3 {
  margin-top: 0;
  margin-bottom: 1rem;
  color: #333;
  border-bottom: 1px solid #eee;
  padding-bottom: 0.5rem;
}

.modal-body {
  margin-bottom: 1.5rem;
}

.dealer-info {
  background-color: #f9f9f9;
  padding: 1rem;
  border-radius: 4px;
  margin-bottom: 1rem;
}

.info-row {
  margin-bottom: 0.5rem;
  display: flex;
}

.info-label {
  color: #666;
  width: 80px;
  flex-shrink: 0;
}

.info-value {
  font-weight: 500;
  color: #333;
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
  color: #555;
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
  .page-title {
    font-size: 1.4rem;
  }
  
  .filter-controls {
    flex-direction: column;
    gap: 0.5rem;
  }
  
  .action-buttons {
    flex-direction: column;
  }
  
  .dealers-table th,
  .dealers-table td {
    padding: 0.5rem;
    font-size: 0.85rem;
  }
  
  .info-row {
    flex-direction: column;
  }
  
  .info-label {
    width: 100%;
    margin-bottom: 0.2rem;
  }
  
  .radio-group {
    flex-direction: column;
    gap: 0.5rem;
  }
}
</style> 