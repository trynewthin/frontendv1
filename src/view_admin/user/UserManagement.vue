<template>
  <BasePanel title="用户管理" class="user-management">
    <div class="content-wrapper">
      <!-- 搜索和筛选区域 -->
      <div class="filter-section">
        <div class="search-box">
          <input 
            type="text" 
            v-model="searchKeyword" 
            placeholder="搜索用户名/邮箱/手机号" 
            class="search-input"
            @keyup.enter="onFilterChange"
          />
          <button class="search-btn" @click="onFilterChange">搜索</button>
        </div>
        <div class="filter-controls">
          <div class="filter-item">
            <label>用户状态:</label>
            <select v-model="filters.status" @change="onFilterChange">
              <option value="">全部</option>
              <option value="ACTIVE">正常</option>
              <option value="INACTIVE">已禁用</option>
            </select>
          </div>
          <div class="filter-item">
            <label>用户类型:</label>
            <select v-model="filters.userType" @change="onFilterChange">
              <option value="">全部</option>
              <option value="NORMAL_USER">普通用户</option>
              <option value="DEALER">经销商</option>
            </select>
          </div>
          <div class="filter-item date-filter">
            <label>注册日期:</label>
            <input type="date" v-model="filters.startDate" @change="onFilterChange" />
            <span>至</span>
            <input type="date" v-model="filters.endDate" @change="onFilterChange" />
          </div>
        </div>
      </div>

      <!-- 用户列表区域 -->
      <div class="users-table-container">
        <table class="users-table" v-if="!loading && users.length > 0">
          <thead>
            <tr>
              <th>用户ID</th>
              <th>用户名</th>
              <th>邮箱</th>
              <th>手机号</th>
              <th>用户类型</th>
              <th>注册日期</th>
              <th>状态</th>
              <th>操作</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="user in users" :key="user.id">
              <td>{{ user.id }}</td>
              <td>{{ user.username }}</td>
              <td>{{ user.email || '未设置' }}</td>
              <td>{{ user.phone || '未设置' }}</td>
              <td>{{ formatUserType(user.userType) }}</td>
              <td>{{ formatDate(user.registerTime) }}</td>
              <td>
                <span 
                  class="status-badge" 
                  :class="{ 'active': user.status === 'ACTIVE', 'inactive': user.status === 'INACTIVE' }"
                >
                  {{ user.status === 'ACTIVE' ? '正常' : '已禁用' }}
                </span>
              </td>
              <td class="action-buttons">
                <button 
                  class="toggle-btn" 
                  :class="{ 'disable-btn': user.status === 'ACTIVE', 'enable-btn': user.status === 'INACTIVE' }"
                  @click="toggleUserStatus(user)"
                >
                  {{ user.status === 'ACTIVE' ? '禁用' : '启用' }}
                </button>
                <button class="reset-btn" @click="showResetPasswordModal(user.id, user.username)">重置密码</button>
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
        <div v-if="!loading && users.length === 0" class="empty-container">
          <div class="empty-icon">
            <i class="fa fa-inbox"></i>
          </div>
          <p>暂无用户数据</p>
          <p class="empty-tip">请调整筛选条件后重试</p>
        </div>

        <!-- 分页控件 -->
        <div class="pagination-controls" v-if="!loading && users.length > 0">
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

    <!-- 用户状态变更弹窗 -->
    <ModalDialog
      v-model="showStatusModal"
      :title="statusModalTitle"
      :loading="statusUpdateLoading"
      @confirm="confirmStatusChange"
    >
      <template v-if="targetUser && targetUser.status === 'ACTIVE'">
        <p>您确定要禁用用户 <strong>{{ targetUser.username }}</strong> 吗？</p>
        <div class="form-group">
          <label>禁用原因：</label>
          <textarea 
            v-model="disableReason" 
            rows="3" 
            placeholder="请输入禁用原因..."
          ></textarea>
          <div class="form-tip">
            <i class="fa fa-info-circle"></i>
            拒绝申请时，禁用原因必填，将发送给用户作为反馈
          </div>
        </div>
      </template>
      <template v-else-if="targetUser">
        <p>您确定要启用用户 <strong>{{ targetUser.username }}</strong> 吗？</p>
      </template>
    </ModalDialog>

    <!-- 重置密码确认弹窗 -->
    <ModalDialog
      v-model="showResetPwdModal"
      title="重置用户密码"
      :loading="resetPwdLoading"
      @confirm="confirmResetPassword"
    >
      <p>您确定要重置用户 <strong>{{ resetPwdUsername }}</strong> 的密码吗？</p>
      <p>重置后，新密码将发送到用户邮箱。</p>
    </ModalDialog>
  </BasePanel>
</template>

<script setup>
import { ref, reactive, onMounted, computed } from 'vue';
import userAdminService from '@api/userAdminService';
import BasePanel from '../../components/card/BasePanel.vue';
import ModalDialog from '../../components/modelwindow/ModalDialog.vue';

// 状态
const users = ref([]);
const loading = ref(false);
const currentPage = ref(1);
const totalPages = ref(1);
const totalUsers = ref(0);
const pageSize = ref(10);
const searchKeyword = ref('');
const filters = reactive({
  status: '',
  userType: '',
  startDate: '',
  endDate: ''
});

// 用户状态变更相关
const showStatusModal = ref(false);
const statusUpdateLoading = ref(false);
const targetUser = ref(null);
const disableReason = ref('');
const statusModalTitle = computed(() => {
  if (!targetUser.value) return '更改用户状态';
  return targetUser.value.status === 'ACTIVE' ? '禁用用户' : '启用用户';
});

// 重置密码相关
const showResetPwdModal = ref(false);
const resetPwdLoading = ref(false);
const resetPwdUserId = ref(null);
const resetPwdUsername = ref('');

// 生命周期钩子
onMounted(() => {
  // 输出用户信息和权限状态，帮助调试
  const userInfoString = localStorage.getItem('userInfo');
  console.log('当前用户信息:', userInfoString ? JSON.parse(userInfoString) : null);
  console.log('isAdmin():', userAdminService.isAdmin());
  console.log('isLoggedIn():', userAdminService.isLoggedIn());
  
  // 加载用户列表
  loadUsers();
});

// 当过滤器改变时，重置到第一页
function onFilterChange() {
  currentPage.value = 1;
  loadUsers();
}

// 方法
function loadUsers() {
  if (loading.value) return; // 如果正在加载，不重复发起请求
  
  loading.value = true;
  console.log('开始加载用户数据, 当前页:', currentPage.value);
  
  userAdminService.getUserList({
    keyword: searchKeyword.value,
    status: filters.status,
    userType: filters.userType,
    startDate: filters.startDate,
    endDate: filters.endDate,
    page: currentPage.value,
    size: pageSize.value
  }).then(response => {
    console.log('获取用户列表响应:', response);
    if (response.success) {
      users.value = response.data || []; // 确保data是数组
      totalPages.value = Math.ceil(response.total / pageSize.value) || 1;
      totalUsers.value = response.total || 0;
      console.log('用户数据加载成功，共', users.value.length, '条记录, 总页数:', totalPages.value);
    } else {
      console.error('获取用户列表失败:', response.message);
      users.value = []; // 清空用户列表
    }
  }).catch(error => {
    console.error('获取用户列表出错:', error);
    users.value = []; // 出错时清空用户列表
  }).finally(() => {
    loading.value = false;
  });
}

function changePage(page) {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page;
    loadUsers();
  }
}

function toggleUserStatus(user) {
  targetUser.value = user;
  disableReason.value = '';
  showStatusModal.value = true;
}

function confirmStatusChange() {
  if (!targetUser.value) return;
  
  const newStatus = targetUser.value.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';
  const reason = targetUser.value.status === 'ACTIVE' ? disableReason.value : '';
  
  // 如果是禁用操作且没有填写原因，则不执行
  if (targetUser.value.status === 'ACTIVE' && !reason.trim()) {
    return;
  }
  
  statusUpdateLoading.value = true;
  console.log('更新用户状态:', {
    userId: targetUser.value.id,
    oldStatus: targetUser.value.status,
    newStatus: newStatus,
    reason: reason
  });
  
  userAdminService.updateUserStatus(targetUser.value.id, newStatus, reason)
    .then(response => {
      console.log('更新用户状态响应:', response);
      if (response.success) {
        // 更新列表中的用户状态
        const userIndex = users.value.findIndex(u => u.id === targetUser.value.id);
        if (userIndex !== -1) {
          users.value[userIndex].status = newStatus;
        }
        alert(response.message || '用户状态更新成功');
      } else {
        alert(response.message || '用户状态更新失败');
      }
    })
    .catch(error => {
      console.error('更新用户状态出错:', error);
      alert('操作失败，请重试');
    })
    .finally(() => {
      statusUpdateLoading.value = false;
      showStatusModal.value = false;
    });
}

function showResetPasswordModal(userId, username) {
  resetPwdUserId.value = userId;
  resetPwdUsername.value = username || '未知用户';
  showResetPwdModal.value = true;
}

function confirmResetPassword() {
  if (!resetPwdUserId.value) return;
  
  resetPwdLoading.value = true;
  console.log('重置用户密码:', resetPwdUserId.value);
  
  userAdminService.resetUserPassword(resetPwdUserId.value)
    .then(response => {
      console.log('重置密码响应:', response);
      if (response.success) {
        alert(response.message || '密码重置成功，新密码已发送到用户邮箱');
      } else {
        alert(response.message || '密码重置失败');
      }
    })
    .catch(error => {
      console.error('重置密码出错:', error);
      alert('操作失败，请重试');
    })
    .finally(() => {
      resetPwdLoading.value = false;
      showResetPwdModal.value = false;
    });
}

// 格式化函数
function formatDate(dateString) {
  if (!dateString) return '未知';
  const date = new Date(dateString);
  return `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`;
}

function formatUserType(type) {
  const typeMap = {
    'NORMAL_USER': '普通用户',
    'DEALER': '经销商',
    'ADMIN': '管理员',
    'SUPER_ADMIN': '超级管理员'
  };
  return typeMap[type] || type;
}

// 格式化用户状态（数字转文本）
function formatUserStatus(status) {
  return status === 'ACTIVE' ? '正常' : '已禁用';
}

// 判断用户状态类型
function getUserStatusClass(status) {
  return status === 'ACTIVE' ? 'active' : 'inactive';
}
</script>

<style scoped>
.user-management {
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

.filter-item select,
.filter-item input[type="date"] {
  padding: 0.35rem;
  border: 1px solid rgba(0, 0, 0, 0.15);
  border-radius: 4px;
  font-size: 0.9rem;
  background-color: var(--card-bg-color);
  color: rgba(0, 0, 0, 0.85);
}

.date-filter {
  display: flex;
  align-items: center;
}

.date-filter span {
  margin: 0 0.5rem;
  color: rgba(0, 0, 0, 0.85);
}

/* 用户列表表格 */
.users-table-container {
  width: 100%;
  overflow-x: auto;
}

.users-table {
  width: 100%;
  border-collapse: collapse;
  border: 1px solid rgba(0, 0, 0, 0.1);
  background-color: var(--card-bg-color);
  font-size: 0.9rem;
}

.users-table th,
.users-table td {
  padding: 0.6rem;
  text-align: left;
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
  color: rgba(0, 0, 0, 0.85);
  vertical-align: middle;
}

.users-table th {
  background-color: rgba(0, 0, 0, 0.02);
  font-weight: 600;
  color: rgba(0, 0, 0, 0.85);
  font-size: 0.95rem;
}

.users-table tr:hover {
  background-color: rgba(0, 0, 0, 0.02);
}

.status-badge {
  display: inline-block;
  padding: 0.2rem 0.4rem;
  border-radius: 3px;
  font-size: 0.75rem;
  font-weight: 500;
}

.status-badge.active {
  background-color: #f6ffed;
  color: #389e0d;
  border: 1px solid #b7eb8f;
}

.status-badge.inactive {
  background-color: #fff2f0;
  color: #cf1322;
  border: 1px solid #ffccc7;
}

.action-buttons {
  display: flex;
  gap: 0.4rem;
}

.action-buttons button {
  padding: 0.2rem 0.6rem;
  font-size: 0.75rem;
  border: none;
  border-radius: 3px;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.2s ease;
}

.toggle-btn {
  background-color: #fff2f0;
  color: #cf1322;
  border: 1px solid #ffa39e;
}

.toggle-btn:hover {
  background-color: #ffccc7;
}

.toggle-btn.enable-btn {
  background-color: #f6ffed;
  color: #389e0d;
  border: 1px solid #b7eb8f;
}

.toggle-btn.enable-btn:hover {
  background-color: #d9f7be;
}

.reset-btn {
  background-color: rgba(0, 0, 0, 0.02);
  color: rgba(0, 0, 0, 0.65);
  border: 1px solid rgba(0, 0, 0, 0.15);
}

.reset-btn:hover {
  background-color: rgba(0, 0, 0, 0.04);
  border-color: rgba(0, 0, 0, 0.25);
}

/* 加载和空数据状态 */
.loading-container,
.empty-container {
  padding: 3rem 1rem;
  text-align: center;
  color: rgba(0, 0, 0, 0.65);
}

.loading-spinner {
  display: inline-block;
  width: 2rem;
  height: 2rem;
  border: 3px solid rgba(0, 0, 0, 0.1);
  border-top-color: var(--primary-color);
  border-radius: 50%;
  animation: spin 1s infinite linear;
  margin-bottom: 1rem;
}

.empty-icon {
  font-size: 2.5rem;
  color: rgba(0, 0, 0, 0.25);
  margin-bottom: 1rem;
}

.empty-tip {
  color: rgba(0, 0, 0, 0.45);
  font-size: 0.9rem;
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
  background-color: rgba(0, 0, 0, 0.08);
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

.form-group {
  margin-top: 1rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  color: rgba(0, 0, 0, 0.85);
  font-weight: 500;
}

.form-group textarea {
  width: 100%;
  padding: 0.5rem;
  border: 1px solid rgba(0, 0, 0, 0.15);
  border-radius: 4px;
  font-family: inherit;
  font-size: 0.9rem;
  background-color: var(--card-bg-color);
  color: rgba(0, 0, 0, 0.85);
}

.form-tip {
  font-size: 0.8rem;
  color: #ff4d4f;
  margin-top: 0.5rem;
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
}

.cancel-btn,
.confirm-btn {
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
}

.cancel-btn {
  background-color: rgba(0, 0, 0, 0.02);
  border: 1px solid rgba(0, 0, 0, 0.15);
  color: rgba(0, 0, 0, 0.65);
}

.confirm-btn {
  background-color: var(--primary-color);
  color: var(--btn-primary-text);
  border: none;
}

.confirm-btn:disabled {
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
  
  .filter-item select,
  .filter-item input[type="date"] {
    flex: 1;
  }
  
  .date-filter {
    flex-wrap: wrap;
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

  .filter-item select,
  .filter-item input[type="date"] {
    color: var(--text-primary);
    border-color: rgba(255, 255, 255, 0.15);
    background-color: var(--card-bg-color);
  }

  .date-filter span {
    color: var(--text-primary);
  }

  .users-table {
    border-color: rgba(255, 255, 255, 0.15);
  }

  .users-table th,
  .users-table td {
    color: var(--text-primary);
    border-color: rgba(255, 255, 255, 0.15);
  }

  .users-table th {
    background-color: rgba(255, 255, 255, 0.04);
  }

  .users-table tr:hover {
    background-color: rgba(255, 255, 255, 0.04);
  }

  /* 状态标签深色模式 */
  .status-badge.active {
    background-color: rgba(56, 158, 13, 0.15);
    color: #73d13d;
    border-color: rgba(115, 209, 61, 0.3);
  }

  .status-badge.inactive {
    background-color: rgba(207, 19, 34, 0.15);
    color: #ff7875;
    border-color: rgba(255, 120, 117, 0.3);
  }

  /* 按钮深色模式 */
  .toggle-btn {
    background-color: rgba(207, 19, 34, 0.15);
    color: #ff7875;
    border-color: rgba(255, 120, 117, 0.3);
  }

  .toggle-btn:hover {
    background-color: rgba(207, 19, 34, 0.25);
  }

  .toggle-btn.enable-btn {
    background-color: rgba(56, 158, 13, 0.15);
    color: #73d13d;
    border-color: rgba(115, 209, 61, 0.3);
  }

  .toggle-btn.enable-btn:hover {
    background-color: rgba(56, 158, 13, 0.25);
  }

  .reset-btn {
    background-color: rgba(255, 255, 255, 0.04);
    border-color: rgba(255, 255, 255, 0.15);
    color: var(--text-primary);
  }

  .reset-btn:hover {
    background-color: rgba(255, 255, 255, 0.08);
    border-color: rgba(255, 255, 255, 0.25);
  }

  /* 加载和空状态深色模式 */
  .loading-container,
  .empty-container {
    color: var(--text-secondary);
  }

  .loading-spinner {
    border-color: rgba(255, 255, 255, 0.1);
    border-top-color: rgba(255, 255, 255, 0.85);
  }

  .empty-icon {
    color: rgba(255, 255, 255, 0.25);
  }

  .empty-tip {
    color: var(--text-disabled);
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

  /* 弹窗深色模式 */
  .modal-content {
    border-color: rgba(255, 255, 255, 0.15);
  }

  .modal-content h3 {
    color: var(--text-primary);
    border-color: rgba(255, 255, 255, 0.15);
  }

  .form-group label {
    color: var(--text-primary);
  }

  .form-group textarea {
    color: var(--text-primary);
    background-color: var(--card-bg-color);
    border-color: rgba(255, 255, 255, 0.15);
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
}
</style> 