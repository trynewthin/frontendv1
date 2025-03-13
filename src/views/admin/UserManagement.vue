<template>
  <div class="user-management-container">
    <h2 class="page-title">用户管理</h2>
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
                <button class="view-btn" @click="viewUserDetail(user.id)">查看</button>
                <button 
                  class="toggle-btn" 
                  :class="{ 'disable-btn': user.status === 'ACTIVE', 'enable-btn': user.status === 'INACTIVE' }"
                  @click="toggleUserStatus(user)"
                >
                  {{ user.status === 'ACTIVE' ? '禁用' : '启用' }}
                </button>
                <button class="reset-btn" @click="resetUserPassword(user.id)">重置密码</button>
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
          <p>暂无用户数据</p>
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
    <div class="modal-overlay" v-if="showStatusModal" @click.self="showStatusModal = false">
      <div class="modal-content">
        <h3>{{ targetUser && targetUser.status === 'ACTIVE' ? '禁用用户' : '启用用户' }}</h3>
        <div class="modal-body">
          <template v-if="targetUser && targetUser.status === 'ACTIVE'">
            <p>您确定要禁用用户 <strong>{{ targetUser.username }}</strong> 吗？</p>
            <div class="form-group">
              <label>禁用原因：</label>
              <textarea v-model="disableReason" rows="3" placeholder="请输入禁用原因..."></textarea>
            </div>
          </template>
          <template v-else-if="targetUser">
            <p>您确定要启用用户 <strong>{{ targetUser.username }}</strong> 吗？</p>
          </template>
        </div>
        <div class="modal-footer">
          <button class="cancel-btn" @click="showStatusModal = false">取消</button>
          <button class="confirm-btn" @click="confirmStatusChange">确认</button>
        </div>
      </div>
    </div>
    
    <!-- 用户详情侧边栏 -->
    <UserDetailPanel
      :user-id="selectedUserId"
      :visible="showUserDetailPanel"
      @close="closeUserDetailPanel"
      @user-updated="handleUserUpdated"
    />
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue';
import UserDetailPanel from '../../components/admin/UserDetailPanel.vue';
import userAdminService from '../../api/userAdminService';

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
const targetUser = ref(null);
const disableReason = ref('');

// 用户详情面板相关
const showUserDetailPanel = ref(false);
const selectedUserId = ref(null);

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

function viewUserDetail(userId) {
  // 打开用户详情侧边栏
  selectedUserId.value = userId;
  showUserDetailPanel.value = true;
}

function closeUserDetailPanel() {
  showUserDetailPanel.value = false;
}

function handleUserUpdated() {
  // 用户信息更新后重新加载用户列表
  loadUsers();
}

function toggleUserStatus(user) {
  targetUser.value = user;
  disableReason.value = '';
  showStatusModal.value = true;
}

function confirmStatusChange() {
  if (targetUser.value) {
    const newStatus = targetUser.value.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';
    const reason = targetUser.value.status === 'ACTIVE' ? disableReason.value : '';
    
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
      });
    
    // 关闭弹窗
    showStatusModal.value = false;
  }
}

function resetUserPassword(userId) {
  if (confirm('确定要重置该用户的密码吗？')) {
    console.log('重置用户密码:', userId);
    
    userAdminService.resetUserPassword(userId)
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
      });
  }
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
.user-management-container {
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

.date-filter {
  display: flex;
  align-items: center;
}

.date-filter span {
  margin: 0 0.5rem;
}

/* 用户列表表格 */
.users-table-container {
  width: 100%;
  overflow-x: auto;
}

.users-table {
  width: 100%;
  border-collapse: collapse;
  border: 1px solid #eee;
}

.users-table th,
.users-table td {
  padding: 0.75rem;
  text-align: left;
  border-bottom: 1px solid #eee;
}

.users-table th {
  background-color: #f5f5f5;
  font-weight: 600;
  color: #333;
}

.users-table tr:hover {
  background-color: #f9f9f9;
}

.status-badge {
  display: inline-block;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-size: 0.8rem;
}

.status-badge.active {
  background-color: #e6f7ed;
  color: #52c41a;
}

.status-badge.inactive {
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

.toggle-btn {
  background-color: #fff1f0;
  color: #ff4d4f;
}

.toggle-btn.enable-btn {
  background-color: #e6f7ed;
  color: #52c41a;
}

.reset-btn {
  background-color: #f5f5f5;
  color: #555;
}

/* 加载和空数据状态 */
.loading-container,
.empty-container {
  padding: 3rem 1rem;
  text-align: center;
  color: #666;
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

.form-group {
  margin-top: 1rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  color: #555;
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

.cancel-btn {
  padding: 0.5rem 1rem;
  background-color: #f5f5f5;
  border: 1px solid #ddd;
  border-radius: 4px;
  cursor: pointer;
}

.confirm-btn {
  padding: 0.5rem 1rem;
  background-color: var(--va-primary);
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
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
  
  .users-table th,
  .users-table td {
    padding: 0.5rem;
    font-size: 0.85rem;
  }
}
</style> 