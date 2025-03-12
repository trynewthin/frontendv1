<template>
  <div class="dealer-test-view">
    <div class="header">
      <h1>经销商服务测试页面</h1>
      <router-link to="/test" class="back-link">返回测试导航</router-link>
    </div>
    
    <div class="content">
      <div class="test-container">
        <!-- 登录状态检测区域 -->
        <div class="status-section">
          <div class="status-container">
            <div class="status-header">
              <h3>当前登录状态</h3>
              <button @click="checkLoginStatus" class="refresh-button">
                <span>刷新状态</span>
              </button>
            </div>
            
            <div class="status-body">
              <div class="status-item">
                <div class="status-label">登录状态:</div>
                <div class="status-badge" :class="isLoggedIn ? 'logged-in' : 'logged-out'">
                  {{ isLoggedIn ? '已登录' : '未登录' }}
                </div>
              </div>
              
              <div v-if="isLoggedIn" class="status-item">
                <div class="status-label">Token:</div>
                <div class="token-value">{{ getStoredToken() }}</div>
              </div>
            </div>
            
            <div v-if="!isLoggedIn" class="status-info">
              <p>您当前未登录，部分经销商功能需要登录后才能使用</p>
            </div>
          </div>
        </div>
        
        <!-- 经销商服务测试区域 -->
        <div class="dealer-test-section">
          <!-- 查询选项卡 -->
          <div class="tabs">
            <div 
              v-for="tab in tabs" 
              :key="tab.value" 
              :class="['tab-item', { active: currentTab === tab.value }]"
              @click="currentTab = tab.value"
            >
              {{ tab.label }}
            </div>
          </div>
          
          <!-- 基本经销商查询 -->
          <div v-if="currentTab === 'list'" class="tab-content">
            <h3>获取经销商列表</h3>
            
            <div class="query-options">
              <div class="form-row">
                <label for="keyword">关键词:</label>
                <input type="text" id="keyword" v-model="queryParams.keyword" placeholder="经销商名称关键词" />
              </div>
              
              <div class="form-row">
                <label for="verifyStatus">认证状态:</label>
                <select id="verifyStatus" v-model="queryParams.verifyStatus">
                  <option value="">全部状态</option>
                  <option v-for="status in verifyStatus" :key="status.value" :value="status.value">
                    {{ status.label }}
                  </option>
                </select>
              </div>
              
              <div class="form-row">
                <label for="region">所在地区:</label>
                <select id="region" v-model="queryParams.region">
                  <option value="">全部地区</option>
                  <option v-for="region in regions" :key="region.value" :value="region.value">
                    {{ region.label }}
                  </option>
                </select>
              </div>
              
              <div class="form-row">
                <label for="page">页码:</label>
                <input type="number" id="page" v-model="queryParams.page" min="1" />
              </div>
              
              <div class="form-row">
                <label for="size">每页数量:</label>
                <input type="number" id="size" v-model="queryParams.size" min="1" max="50" />
              </div>
            </div>
            
            <div class="action-row">
              <button @click="getDealerList" class="action-button">
                获取经销商列表
              </button>
            </div>
          </div>
          
          <!-- 经销商详情查询 -->
          <div v-if="currentTab === 'detail'" class="tab-content">
            <h3>获取经销商详情</h3>
            
            <div class="query-options">
              <div class="form-row full-width">
                <label for="dealerId">经销商ID:</label>
                <input type="number" id="dealerId" v-model="detailParams.dealerId" min="1" required />
              </div>
            </div>
            
            <div class="action-row">
              <button @click="getDealerDetail" class="action-button" :disabled="!detailParams.dealerId">
                获取经销商详情
              </button>
            </div>
          </div>
          
          <!-- 提交经销商信息 -->
          <div v-if="currentTab === 'submit'" class="tab-content">
            <h3>提交经销商信息</h3>
            
            <div class="query-options">
              <div class="form-row full-width">
                <label for="dealerName">经销商名称: <span class="required">*</span></label>
                <input type="text" id="dealerName" v-model="submitParams.dealerName" required />
              </div>
              
              <div class="form-row full-width">
                <label for="address">经销商地址:</label>
                <input type="text" id="address" v-model="submitParams.address" />
              </div>
              
              <div class="form-row">
                <label for="businessLicense">营业执照号:</label>
                <input type="text" id="businessLicense" v-model="submitParams.businessLicense" />
              </div>
              
              <div class="form-row">
                <label for="contactPerson">联系人:</label>
                <input type="text" id="contactPerson" v-model="submitParams.contactPerson" />
              </div>
              
              <div class="form-row">
                <label for="contactPhone">联系电话:</label>
                <input type="text" id="contactPhone" v-model="submitParams.contactPhone" />
              </div>
              
              <div class="form-row full-width">
                <label for="description">描述:</label>
                <textarea id="description" v-model="submitParams.description" rows="3"></textarea>
              </div>
            </div>
            
            <div class="action-row">
              <button @click="submitDealerInfo" class="action-button" :disabled="!submitParams.dealerName || !isLoggedIn">
                提交经销商信息
              </button>
            </div>
          </div>
          
          <!-- 审核申请 -->
          <div v-if="currentTab === 'review'" class="tab-content">
            <h3>提交审核申请</h3>
            
            <div class="query-options">
              <div class="form-row full-width">
                <div class="status-info">
                  <p>提交审核申请将向平台管理员发起经销商认证申请</p>
                  <p>请确保您已经填写了完整的经销商信息后再提交申请</p>
                </div>
              </div>
            </div>
            
            <div class="action-row">
              <button @click="submitDealerReview" class="action-button" :disabled="!isLoggedIn">
                提交审核申请
              </button>
            </div>
          </div>
          
          <!-- 审核经销商 -->
          <div v-if="currentTab === 'audit'" class="tab-content">
            <h3>审核经销商</h3>
            
            <div class="query-options">
              <div class="form-row">
                <label for="auditDealerId">经销商ID: <span class="required">*</span></label>
                <input type="number" id="auditDealerId" v-model="auditParams.dealerId" min="1" required />
              </div>
              
              <div class="form-row">
                <label for="auditStatus">审核状态: <span class="required">*</span></label>
                <select id="auditStatus" v-model="auditParams.status" required>
                  <option value="">请选择审核结果</option>
                  <option :value="1">通过</option>
                  <option :value="2">拒绝</option>
                </select>
              </div>
              
              <div class="form-row full-width">
                <label for="remarks">备注说明:</label>
                <textarea id="remarks" v-model="auditParams.remarks" rows="3"></textarea>
              </div>
            </div>
            
            <div class="action-row">
              <button @click="auditDealer" class="action-button" :disabled="!auditParams.dealerId || !auditParams.status || !isLoggedIn">
                提交审核
              </button>
            </div>
          </div>
          
          <!-- 删除经销商 -->
          <div v-if="currentTab === 'delete'" class="tab-content">
            <h3>删除经销商</h3>
            
            <div class="query-options">
              <div class="form-row full-width">
                <label for="deleteDealerId">经销商ID: <span class="required">*</span></label>
                <input type="number" id="deleteDealerId" v-model="deleteParams.dealerId" min="1" required />
              </div>
              
              <div class="form-row full-width">
                <div class="warning-info">
                  <p>警告：删除经销商操作不可逆，请谨慎操作！</p>
                </div>
              </div>
            </div>
            
            <div class="action-row">
              <button @click="deleteDealer" class="action-button danger" :disabled="!deleteParams.dealerId || !isLoggedIn">
                删除经销商
              </button>
            </div>
          </div>
          
          <!-- 响应结果展示 -->
          <div class="response-section">
            <div class="response-header">
              <h4>API 响应结果</h4>
              <span class="response-status" :class="responseStatus.type">{{ responseStatus.message }}</span>
            </div>
            <div class="response-body">
              <pre>{{ responseJson }}</pre>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import dealerService from '../../api/dealerService';
import { DEALER_VERIFY_STATUS, DEALER_REGIONS, DEALER_SORT_FIELDS, SORT_DIRECTIONS } from '../../constants/dealerEnums';

export default {
  name: 'DealerTestView',
  data() {
    return {
      isLoggedIn: false,
      currentTab: 'list',
      tabs: [
        { label: '经销商列表', value: 'list' },
        { label: '经销商详情', value: 'detail' },
        { label: '提交信息', value: 'submit' },
        { label: '提交审核', value: 'review' },
        { label: '审核经销商', value: 'audit' },
        { label: '删除经销商', value: 'delete' }
      ],
      verifyStatus: DEALER_VERIFY_STATUS,
      regions: DEALER_REGIONS,
      sortFields: DEALER_SORT_FIELDS,
      sortDirections: SORT_DIRECTIONS,
      queryParams: {
        keyword: '',
        verifyStatus: '',
        region: '',
        page: 1,
        size: 20
      },
      detailParams: {
        dealerId: ''
      },
      submitParams: {
        dealerName: '',
        address: '',
        businessLicense: '',
        contactPerson: '',
        contactPhone: '',
        description: ''
      },
      auditParams: {
        dealerId: '',
        status: '',
        remarks: ''
      },
      deleteParams: {
        dealerId: ''
      },
      responseData: null,
      responseStatus: {
        type: 'info',
        message: '等待操作'
      },
      currentOperation: ''
    };
  },
  computed: {
    responseJson() {
      return this.responseData ? JSON.stringify(this.responseData, null, 2) : '暂无数据';
    }
  },
  mounted() {
    this.checkLoginStatus();
  },
  methods: {
    checkLoginStatus() {
      this.isLoggedIn = dealerService.isLoggedIn();
    },
    
    getStoredToken() {
      return localStorage.getItem('token') || '未找到Token';
    },
    
    // 处理API响应
    handleResponse(response, operationName) {
      this.responseData = response;
      this.currentOperation = operationName;
      
      if (response.success) {
        this.responseStatus = {
          type: 'success',
          message: `${operationName}成功`
        };
      } else {
        this.responseStatus = {
          type: 'error',
          message: `${operationName}失败: ${response.message}`
        };
      }
    },
    
    // 获取经销商列表
    async getDealerList() {
      try {
        this.responseStatus = { type: 'loading', message: '正在获取经销商列表...' };
        
        // 记录查询参数
        console.log('经销商列表查询参数:', JSON.stringify(this.queryParams));
        
        // 调用服务获取数据
        const response = await dealerService.getDealerList(this.queryParams);
        
        // 记录原始响应
        console.log('经销商列表原始响应:', response);
        
        // 特殊处理：如果返回成功但数据为空数组，尝试不带任何过滤条件重新查询
        if (response.success && Array.isArray(response.data) && response.data.length === 0) {
          console.log('尝试不带过滤条件重新查询经销商列表');
          // 清空所有过滤条件，仅保留分页
          const baseParams = {
            page: this.queryParams.page || 1,
            size: this.queryParams.size || 20
          };
          
          const retryResponse = await dealerService.getDealerList(baseParams);
          console.log('不带过滤条件的重试响应:', retryResponse);
          this.handleResponse(retryResponse, '获取经销商列表');
        } else {
          this.handleResponse(response, '获取经销商列表');
        }
      } catch (error) {
        console.error('获取经销商列表出错:', error);
        this.responseStatus = { type: 'error', message: `获取经销商列表失败: ${error.message}` };
        this.responseData = { error: error.message };
      }
    },
    
    // 获取经销商详情
    async getDealerDetail() {
      try {
        this.responseStatus = { type: 'loading', message: '正在获取经销商详情...' };
        const response = await dealerService.getDealerDetail(this.detailParams.dealerId);
        this.handleResponse(response, '获取经销商详情');
      } catch (error) {
        this.responseStatus = { type: 'error', message: `获取经销商详情失败: ${error.message}` };
        this.responseData = { error: error.message };
      }
    },
    
    // 提交经销商信息
    async submitDealerInfo() {
      try {
        this.responseStatus = { type: 'loading', message: '正在提交经销商信息...' };
        const response = await dealerService.submitDealerInfo(this.submitParams);
        this.handleResponse(response, '提交经销商信息');
      } catch (error) {
        this.responseStatus = { type: 'error', message: `提交经销商信息失败: ${error.message}` };
        this.responseData = { error: error.message };
      }
    },
    
    // 提交审核申请
    async submitDealerReview() {
      try {
        this.responseStatus = { type: 'loading', message: '正在提交审核申请...' };
        const response = await dealerService.submitDealerReview();
        this.handleResponse(response, '提交审核申请');
      } catch (error) {
        this.responseStatus = { type: 'error', message: `提交审核申请失败: ${error.message}` };
        this.responseData = { error: error.message };
      }
    },
    
    // 审核经销商
    async auditDealer() {
      try {
        this.responseStatus = { type: 'loading', message: '正在提交审核结果...' };
        const { dealerId, status, remarks } = this.auditParams;
        const response = await dealerService.auditDealer(dealerId, status, remarks);
        this.handleResponse(response, '审核经销商');
      } catch (error) {
        this.responseStatus = { type: 'error', message: `审核经销商失败: ${error.message}` };
        this.responseData = { error: error.message };
      }
    },
    
    // 删除经销商
    async deleteDealer() {
      try {
        if (!confirm('确定要删除该经销商吗？此操作不可恢复！')) {
          return;
        }
        this.responseStatus = { type: 'loading', message: '正在删除经销商...' };
        const response = await dealerService.deleteDealer(this.deleteParams.dealerId);
        this.handleResponse(response, '删除经销商');
      } catch (error) {
        this.responseStatus = { type: 'error', message: `删除经销商失败: ${error.message}` };
        this.responseData = { error: error.message };
      }
    }
  }
};
</script>

<style scoped>
.dealer-test-view {
  display: flex;
  flex-direction: column;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  width: 100vw;
  height: 100vh;
  margin: 0;
  padding: 0;
  background-color: #f5f7fa;
  overflow-y: auto;
  box-sizing: border-box;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 2rem;
  background-color: white;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  box-sizing: border-box;
  width: 100%;
}

.content {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: flex-start;
  width: 100%;
  padding: 1rem;
  box-sizing: border-box;
  overflow: auto;
}

h1 {
  margin: 0;
  color: #333;
  font-size: 1.8rem;
  width: auto;
}

.back-link {
  padding: 8px 16px;
  background-color: #f5f5f5;
  color: #333;
  border-radius: 4px;
  text-decoration: none;
  font-weight: 500;
  transition: background-color 0.2s;
  width: auto;
}

.back-link:hover {
  background-color: #e0e0e0;
}

.test-container {
  width: 100%;
  background-color: white;
  padding: 1.5rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  box-sizing: border-box;
  overflow: visible;
  height: auto;
}

.status-section {
  margin-bottom: 2rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid #eee;
}

.status-container {
  background-color: #f9f9f9;
  border-radius: 8px;
  padding: 1rem;
}

.status-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.status-header h3 {
  margin: 0;
}

.refresh-button {
  background-color: #f0f0f0;
  border: none;
  border-radius: 4px;
  padding: 6px 12px;
  cursor: pointer;
  display: flex;
  align-items: center;
  color: #444;
  font-weight: 500;
  transition: background-color 0.2s;
}

.refresh-button:hover {
  background-color: #e0e0e0;
}

.status-body {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.status-item {
  display: flex;
  align-items: center;
}

.status-label {
  font-weight: 500;
  margin-right: 0.5rem;
  min-width: 80px;
}

.status-badge {
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 0.9rem;
  font-weight: 500;
}

.logged-in {
  background-color: #e6f7e6;
  color: #2e7d32;
}

.logged-out {
  background-color: #ffebee;
  color: #c62828;
}

.status-info {
  margin-top: 1rem;
  padding: 0.75rem;
  background-color: #f5f5f5;
  border-radius: 4px;
  color: #666;
}

.warning-info {
  padding: 0.75rem;
  background-color: #fff3e0;
  border-radius: 4px;
  color: #e65100;
  margin: 0.5rem 0;
}

.token-value {
  font-size: 0.9rem;
  color: #555;
}

.dealer-test-section {
  margin-top: 1rem;
}

.tabs {
  display: flex;
  border-bottom: 1px solid #ddd;
  margin-bottom: 1.5rem;
  overflow-x: auto;
}

.tab-item {
  padding: 0.75rem 1.5rem;
  cursor: pointer;
  color: #555;
  font-weight: 500;
  border-bottom: 2px solid transparent;
  white-space: nowrap;
}

.tab-item:hover {
  color: #4a9cf6;
}

.tab-item.active {
  color: #4a9cf6;
  border-bottom-color: #4a9cf6;
}

.tab-content {
  margin-bottom: 2rem;
}

.query-options {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  margin-bottom: 1.5rem;
  background-color: #f9f9f9;
  border-radius: 8px;
  padding: 1rem;
}

.form-row {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  flex: 1;
  min-width: 200px;
}

.form-row.full-width {
  flex: 100%;
  width: 100%;
}

.form-row label {
  font-weight: 500;
  color: #555;
}

.form-row input, .form-row select, .form-row textarea {
  padding: 0.5rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
}

.required {
  color: #f44336;
}

.action-row {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.action-button {
  padding: 0.75rem 1rem;
  background-color: #4a9cf6;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 500;
  transition: background-color 0.2s;
  flex: 1;
  min-width: 200px;
}

.action-button:hover {
  background-color: #3a8ce6;
}

.action-button:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}

.action-button.danger {
  background-color: #f44336;
}

.action-button.danger:hover {
  background-color: #e53935;
}

.response-section {
  background-color: #f9f9f9;
  border-radius: 8px;
  padding: 1rem;
  margin-top: 1rem;
}

.response-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.response-header h4 {
  margin: 0;
  color: #555;
}

.response-status {
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 0.9rem;
  font-weight: 500;
}

.response-status.success {
  background-color: #e6f7e6;
  color: #2e7d32;
}

.response-status.error {
  background-color: #ffebee;
  color: #c62828;
}

.response-status.loading {
  background-color: #e3f2fd;
  color: #1565c0;
}

.response-status.info {
  background-color: #f5f5f5;
  color: #555;
}

.response-body {
  background-color: #f5f5f5;
  border-radius: 4px;
  padding: 1rem;
  overflow-x: auto;
  max-height: 400px;
  overflow-y: auto;
}

.response-body pre {
  margin: 0;
  white-space: pre-wrap;
  word-break: break-word;
  font-family: 'Courier New', Courier, monospace;
  color: #444;
}

@media (max-width: 768px) {
  .header {
    padding: 1rem;
    flex-direction: column;
    gap: 1rem;
    text-align: center;
  }
  
  .test-container {
    padding: 1rem;
  }
  
  .tabs {
    margin-bottom: 1rem;
  }
  
  .tab-item {
    padding: 0.5rem 1rem;
  }
  
  .query-options {
    flex-direction: column;
  }
  
  .form-row {
    width: 100%;
  }
  
  .action-row {
    flex-direction: column;
  }
}
</style> 