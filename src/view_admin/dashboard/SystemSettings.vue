<template>
  <div class="system-settings-container">
    <h2 class="page-title">系统设置</h2>
    <div class="content-wrapper">
      <!-- 标签页切换 -->
      <div class="tabs">
        <button 
          class="tab-btn" 
          :class="{ active: activeTab === 'general' }"
          @click="activeTab = 'general'"
        >
          基本设置
        </button>
        <button 
          class="tab-btn" 
          :class="{ active: activeTab === 'security' }"
          @click="activeTab = 'security'"
        >
          安全设置
        </button>
        <button 
          class="tab-btn" 
          :class="{ active: activeTab === 'system-log' }"
          @click="activeTab = 'system-log'"
        >
          系统日志
        </button>
        <button 
          class="tab-btn" 
          :class="{ active: activeTab === 'backup' }"
          @click="activeTab = 'backup'"
        >
          备份与恢复
        </button>
      </div>
      
      <!-- 基本设置 -->
      <div v-if="activeTab === 'general'" class="tab-content">
        <form class="settings-form" @submit.prevent="saveGeneralSettings">
          <div class="form-section">
            <h3 class="section-title">系统信息</h3>
            
            <div class="form-group">
              <label>网站名称</label>
              <input type="text" v-model="generalSettings.siteName" />
            </div>
            
            <div class="form-group">
              <label>网站描述</label>
              <textarea v-model="generalSettings.siteDescription" rows="3"></textarea>
            </div>
            
            <div class="form-group">
              <label>管理员邮箱</label>
              <input type="email" v-model="generalSettings.adminEmail" />
            </div>
            
            <div class="form-group">
              <label>客服电话</label>
              <input type="text" v-model="generalSettings.servicePhone" />
            </div>
          </div>
          
          <div class="form-section">
            <h3 class="section-title">展示设置</h3>
            
            <div class="form-group">
              <label>每页显示数量</label>
              <input type="number" v-model="generalSettings.pageSize" min="10" max="100" />
            </div>
            
            <div class="form-group checkbox-group">
              <input type="checkbox" id="enableUserRegistration" v-model="generalSettings.enableUserRegistration" />
              <label for="enableUserRegistration">允许用户注册</label>
            </div>
            
            <div class="form-group checkbox-group">
              <input type="checkbox" id="enableDealerRegistration" v-model="generalSettings.enableDealerRegistration" />
              <label for="enableDealerRegistration">允许经销商注册</label>
            </div>
            
            <div class="form-group checkbox-group">
              <input type="checkbox" id="enableComments" v-model="generalSettings.enableComments" />
              <label for="enableComments">允许用户评论</label>
            </div>
          </div>
          
          <div class="form-actions">
            <button type="submit" class="save-btn">保存设置</button>
          </div>
        </form>
      </div>
      
      <!-- 安全设置 -->
      <div v-if="activeTab === 'security'" class="tab-content">
        <form class="settings-form" @submit.prevent="saveSecuritySettings">
          <div class="form-section">
            <h3 class="section-title">密码策略</h3>
            
            <div class="form-group">
              <label>密码最小长度</label>
              <input type="number" v-model="securitySettings.passwordMinLength" min="6" max="20" />
            </div>
            
            <div class="form-group checkbox-group">
              <input type="checkbox" id="requireUppercase" v-model="securitySettings.requireUppercase" />
              <label for="requireUppercase">要求包含大写字母</label>
            </div>
            
            <div class="form-group checkbox-group">
              <input type="checkbox" id="requireNumber" v-model="securitySettings.requireNumber" />
              <label for="requireNumber">要求包含数字</label>
            </div>
            
            <div class="form-group checkbox-group">
              <input type="checkbox" id="requireSpecialChar" v-model="securitySettings.requireSpecialChar" />
              <label for="requireSpecialChar">要求包含特殊字符</label>
            </div>
          </div>
          
          <div class="form-section">
            <h3 class="section-title">登录设置</h3>
            
            <div class="form-group">
              <label>登录失败尝试次数</label>
              <input type="number" v-model="securitySettings.loginAttempts" min="3" max="10" />
            </div>
            
            <div class="form-group">
              <label>锁定时间（分钟）</label>
              <input type="number" v-model="securitySettings.lockoutDuration" min="5" max="60" />
            </div>
            
            <div class="form-group checkbox-group">
              <input type="checkbox" id="enableCaptcha" v-model="securitySettings.enableCaptcha" />
              <label for="enableCaptcha">启用验证码</label>
            </div>
          </div>
          
          <div class="form-actions">
            <button type="submit" class="save-btn">保存设置</button>
          </div>
        </form>
      </div>
      
      <!-- 系统日志 -->
      <div v-if="activeTab === 'system-log'" class="tab-content">
        <div class="log-filter">
          <div class="filter-item">
            <label>日志级别:</label>
            <select v-model="logFilter.level" @change="loadSystemLogs">
              <option value="">全部</option>
              <option value="INFO">信息</option>
              <option value="WARNING">警告</option>
              <option value="ERROR">错误</option>
            </select>
          </div>
          
          <div class="filter-item date-filter">
            <label>日期范围:</label>
            <input type="date" v-model="logFilter.startDate" @change="loadSystemLogs" />
            <span>至</span>
            <input type="date" v-model="logFilter.endDate" @change="loadSystemLogs" />
          </div>
          
          <div class="filter-item">
            <label>关键词:</label>
            <input type="text" v-model="logFilter.keyword" placeholder="输入关键词搜索" />
          </div>
          
          <button class="query-btn" @click="loadSystemLogs">查询</button>
        </div>
        
        <div class="logs-table-container">
          <table class="logs-table" v-if="!loading && systemLogs.length > 0">
            <thead>
              <tr>
                <th style="width: 180px;">时间</th>
                <th style="width: 80px;">级别</th>
                <th>内容</th>
                <th style="width: 100px;">操作者</th>
                <th style="width: 120px;">IP地址</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(log, index) in systemLogs" :key="index">
                <td>{{ formatLogTime(log.timestamp) }}</td>
                <td>
                  <span 
                    class="log-level" 
                    :class="{
                      'info': log.level === 'INFO',
                      'warning': log.level === 'WARNING',
                      'error': log.level === 'ERROR'
                    }"
                  >
                    {{ log.level }}
                  </span>
                </td>
                <td class="log-content">{{ log.content }}</td>
                <td>{{ log.operator }}</td>
                <td>{{ log.ipAddress }}</td>
              </tr>
            </tbody>
          </table>
          
          <!-- 加载状态 -->
          <div v-if="loading" class="loading-container">
            <div class="loading-spinner"></div>
            <p>加载中...</p>
          </div>
          
          <!-- 无数据状态 -->
          <div v-if="!loading && systemLogs.length === 0" class="empty-container">
            <p>暂无日志数据</p>
          </div>
          
          <!-- 分页控件 -->
          <div class="pagination-controls" v-if="!loading && systemLogs.length > 0">
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
      
      <!-- 备份与恢复 -->
      <div v-if="activeTab === 'backup'" class="tab-content">
        <div class="form-section">
          <h3 class="section-title">数据备份</h3>
          
          <div class="backup-actions">
            <button class="backup-btn" @click="createBackup">
              <i class="fas fa-download"></i>
              创建备份
            </button>
            
            <div class="backup-info">
              <p>上次备份时间: {{ lastBackupTime || '从未备份' }}</p>
              <p>备份说明: 备份包含系统所有数据，包括用户数据、车辆信息、经销商资料等</p>
            </div>
          </div>
        </div>
        
        <div class="form-section">
          <h3 class="section-title">备份历史</h3>
          
          <table class="backup-table" v-if="backupHistory.length > 0">
            <thead>
              <tr>
                <th>备份日期</th>
                <th>备份大小</th>
                <th>创建者</th>
                <th>操作</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(backup, index) in backupHistory" :key="index">
                <td>{{ backup.date }}</td>
                <td>{{ backup.size }}</td>
                <td>{{ backup.creator }}</td>
                <td class="action-buttons">
                  <button class="download-btn" @click="downloadBackup(backup.id)">下载</button>
                  <button class="restore-btn" @click="confirmRestore(backup.id)">恢复</button>
                  <button class="delete-btn" @click="confirmDeleteBackup(backup.id)">删除</button>
                </td>
              </tr>
            </tbody>
          </table>
          
          <div v-else class="empty-container">
            <p>暂无备份历史记录</p>
          </div>
        </div>
      </div>
    </div>

    <!-- 恢复确认弹窗 -->
    <div class="modal-overlay" v-if="showRestoreModal" @click.self="showRestoreModal = false">
      <div class="modal-content">
        <h3>恢复确认</h3>
        <div class="modal-body">
          <p class="warning-text">警告：恢复操作将覆盖当前系统中的所有数据，此操作不可撤销！</p>
          <p>请输入"CONFIRM"确认操作:</p>
          <input type="text" v-model="restoreConfirmText" placeholder="输入CONFIRM确认" class="confirm-input" />
        </div>
        <div class="modal-footer">
          <button class="cancel-btn" @click="showRestoreModal = false">取消</button>
          <button 
            class="danger-btn" 
            :disabled="restoreConfirmText !== 'CONFIRM'"
            @click="restoreBackup"
          >
            确认恢复
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue';

// 状态
const activeTab = ref('general');
const loading = ref(false);
const currentPage = ref(1);
const totalPages = ref(1);

// 基本设置
const generalSettings = reactive({
  siteName: '智选车管理系统',
  siteDescription: '智能汽车交易平台后台管理系统',
  adminEmail: 'admin@zhixuanche.com',
  servicePhone: '400-123-4567',
  pageSize: 20,
  enableUserRegistration: true,
  enableDealerRegistration: true,
  enableComments: true
});

// 安全设置
const securitySettings = reactive({
  passwordMinLength: 8,
  requireUppercase: true,
  requireNumber: true,
  requireSpecialChar: false,
  loginAttempts: 5,
  lockoutDuration: 15,
  enableCaptcha: true
});

// 日志筛选
const logFilter = reactive({
  level: '',
  startDate: '',
  endDate: '',
  keyword: ''
});

// 日志数据
const systemLogs = ref([]);

// 备份相关
const lastBackupTime = ref('2023-09-15 14:30:22');
const backupHistory = ref([]);
const showRestoreModal = ref(false);
const restoreConfirmText = ref('');
const selectedBackupId = ref(null);

// 生命周期钩子
onMounted(() => {
  // 加载设置
  loadSettings();
  
  // 加载系统日志
  loadSystemLogs();
  
  // 加载备份历史
  loadBackupHistory();
});

// 方法
function loadSettings() {
  // 这里应该是从服务器加载设置的代码
  // 以下仅用于演示
  console.log('加载系统设置');
}

function saveGeneralSettings() {
  // 保存基本设置
  console.log('保存基本设置:', generalSettings);
  alert('基本设置已保存');
}

function saveSecuritySettings() {
  // 保存安全设置
  console.log('保存安全设置:', securitySettings);
  alert('安全设置已保存');
}

function loadSystemLogs() {
  loading.value = true;
  
  // 模拟API调用
  setTimeout(() => {
    // 使用模拟数据
    systemLogs.value = generateMockLogs();
    totalPages.value = 10;
    loading.value = false;
  }, 800);
}

function changePage(page) {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page;
    loadSystemLogs();
  }
}

function loadBackupHistory() {
  // 模拟加载备份历史
  backupHistory.value = [
    { id: 1, date: '2023-09-15 14:30:22', size: '256 MB', creator: 'admin' },
    { id: 2, date: '2023-09-01 10:15:33', size: '248 MB', creator: 'admin' },
    { id: 3, date: '2023-08-15 09:22:10', size: '240 MB', creator: 'system' }
  ];
}

function createBackup() {
  // 创建备份
  console.log('创建系统备份');
  alert('备份创建成功');
  
  // 刷新备份历史
  loadBackupHistory();
}

function downloadBackup(backupId) {
  // 下载备份
  console.log('下载备份:', backupId);
  alert('备份文件下载中...');
}

function confirmRestore(backupId) {
  // 显示恢复确认弹窗
  selectedBackupId.value = backupId;
  restoreConfirmText.value = '';
  showRestoreModal.value = true;
}

function restoreBackup() {
  if (restoreConfirmText.value === 'CONFIRM' && selectedBackupId.value) {
    // 恢复备份
    console.log('恢复备份:', selectedBackupId.value);
    
    // 关闭弹窗
    showRestoreModal.value = false;
    
    // 显示成功提示
    alert('系统已成功恢复至备份状态');
  }
}

function confirmDeleteBackup(backupId) {
  // 确认删除备份
  if (confirm('确定要删除这个备份吗？此操作不可撤销。')) {
    console.log('删除备份:', backupId);
    
    // 从列表中移除
    backupHistory.value = backupHistory.value.filter(item => item.id !== backupId);
    
    // 显示成功提示
    alert('备份已删除');
  }
}

// 格式化函数
function formatLogTime(timestamp) {
  if (!timestamp) return '';
  const date = new Date(timestamp);
  return `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')} ${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}:${date.getSeconds().toString().padStart(2, '0')}`;
}

// 生成模拟数据
function generateMockLogs() {
  const logs = [];
  const levels = ['INFO', 'WARNING', 'ERROR'];
  const operators = ['admin', 'system', 'scheduler'];
  const contents = [
    '用户登录成功',
    '用户登录失败，密码错误',
    '创建新车辆信息',
    '删除车辆信息',
    '经销商认证审核通过',
    '用户注册',
    '修改系统设置',
    '数据库备份完成',
    '系统启动',
    '系统关闭'
  ];
  
  for (let i = 0; i < 20; i++) {
    const date = new Date();
    date.setMinutes(date.getMinutes() - i * 30);
    
    logs.push({
      timestamp: date.toISOString(),
      level: levels[Math.floor(Math.random() * levels.length)],
      content: contents[Math.floor(Math.random() * contents.length)],
      operator: operators[Math.floor(Math.random() * operators.length)],
      ipAddress: `192.168.1.${Math.floor(Math.random() * 255)}`
    });
  }
  
  return logs;
}
</script>

<style scoped>
.system-settings-container {
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

/* 标签页 */
.tabs {
  display: flex;
  border-bottom: 1px solid #eee;
  margin-bottom: 1.5rem;
}

.tab-btn {
  padding: 0.75rem 1.5rem;
  background: none;
  border: none;
  cursor: pointer;
  font-size: 1rem;
  border-bottom: 2px solid transparent;
  transition: all 0.3s;
}

.tab-btn:hover {
  color: var(--va-primary);
}

.tab-btn.active {
  color: var(--va-primary);
  border-bottom-color: var(--va-primary);
  font-weight: 500;
}

/* 表单样式 */
.tab-content {
  padding: 0 1rem;
}

.settings-form {
  max-width: 800px;
}

.form-section {
  margin-bottom: 2rem;
  background-color: #f9f9f9;
  padding: 1.5rem;
  border-radius: 8px;
}

.section-title {
  font-size: 1.2rem;
  color: #333;
  margin-bottom: 1.5rem;
  padding-bottom: 0.5rem;
  border-bottom: 1px solid #eee;
}

.form-group {
  margin-bottom: 1.25rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  color: #555;
  font-weight: 500;
}

.form-group input[type="text"],
.form-group input[type="email"],
.form-group input[type="number"],
.form-group textarea,
.form-group select {
  width: 100%;
  padding: 0.6rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 0.95rem;
}

.checkbox-group {
  display: flex;
  align-items: center;
}

.checkbox-group input[type="checkbox"] {
  margin-right: 0.5rem;
  cursor: pointer;
}

.checkbox-group label {
  margin-bottom: 0;
  cursor: pointer;
}

.form-actions {
  margin-top: 2rem;
  padding-top: 1rem;
  border-top: 1px solid #eee;
}

.save-btn {
  padding: 0.6rem 1.5rem;
  background-color: var(--va-primary);
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1rem;
}

/* 日志筛选区域 */
.log-filter {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  margin-bottom: 1.5rem;
  padding: 1rem;
  background-color: #f9f9f9;
  border-radius: 8px;
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
.filter-item input[type="date"],
.filter-item input[type="text"] {
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

.query-btn {
  padding: 0.35rem 1rem;
  background-color: var(--va-primary);
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

/* 日志表格 */
.logs-table-container {
  width: 100%;
  overflow-x: auto;
}

.logs-table {
  width: 100%;
  border-collapse: collapse;
  border: 1px solid #eee;
}

.logs-table th,
.logs-table td {
  padding: 0.75rem;
  text-align: left;
  border-bottom: 1px solid #eee;
}

.logs-table th {
  background-color: #f5f5f5;
  font-weight: 600;
  color: #333;
}

.logs-table tr:hover {
  background-color: #f9f9f9;
}

.log-level {
  display: inline-block;
  padding: 0.2rem 0.5rem;
  border-radius: 4px;
  font-size: 0.8rem;
  text-align: center;
}

.log-level.info {
  background-color: #e6f7ff;
  color: #1890ff;
}

.log-level.warning {
  background-color: #fff7e6;
  color: #fa8c16;
}

.log-level.error {
  background-color: #fff1f0;
  color: #ff4d4f;
}

.log-content {
  max-width: 500px;
  word-break: break-all;
}

/* 备份区域 */
.backup-actions {
  display: flex;
  gap: 2rem;
  margin-bottom: 1rem;
}

.backup-btn {
  padding: 0.75rem 1.5rem;
  background-color: var(--va-primary);
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.backup-info p {
  margin: 0.5rem 0;
  color: #666;
}

.backup-table {
  width: 100%;
  border-collapse: collapse;
  border: 1px solid #eee;
  margin-top: 1rem;
}

.backup-table th,
.backup-table td {
  padding: 0.75rem;
  text-align: left;
  border-bottom: 1px solid #eee;
}

.backup-table th {
  background-color: #f5f5f5;
  font-weight: 600;
  color: #333;
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

.download-btn {
  background-color: #e6f7ff;
  color: #1890ff;
}

.restore-btn {
  background-color: #fff7e6;
  color: #fa8c16;
}

.delete-btn {
  background-color: #fff1f0;
  color: #ff4d4f;
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

.warning-text {
  color: #ff4d4f;
  font-weight: 500;
  margin-bottom: 1rem;
}

.confirm-input {
  width: 100%;
  padding: 0.6rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  margin-top: 0.5rem;
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

.danger-btn {
  padding: 0.5rem 1rem;
  background-color: #ff4d4f;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.danger-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

@media (max-width: 768px) {
  .page-title {
    font-size: 1.4rem;
  }
  
  .tab-content {
    padding: 0;
  }
  
  .tabs {
    overflow-x: auto;
  }
  
  .tab-btn {
    padding: 0.6rem 1rem;
    font-size: 0.9rem;
    white-space: nowrap;
  }
  
  .form-section {
    padding: 1rem;
  }
  
  .log-filter {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .filter-item {
    width: 100%;
    margin-bottom: 0.5rem;
  }
  
  .filter-item label {
    width: 80px;
  }
  
  .date-filter {
    flex-wrap: wrap;
  }
  
  .date-filter input {
    flex: 1;
  }
  
  .query-btn {
    width: 100%;
  }
  
  .backup-actions {
    flex-direction: column;
    gap: 1rem;
  }
  
  .backup-btn {
    width: 100%;
  }
  
  .action-buttons {
    flex-direction: column;
  }
  
  .action-buttons button {
    margin-bottom: 0.5rem;
  }
}
</style> 