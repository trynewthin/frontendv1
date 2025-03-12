<template>
  <div class="recommendation-test-view">
    <div class="header">
      <h1>推荐服务测试页面</h1>
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
              <p>您当前未登录，部分推荐功能需要登录后才能使用</p>
            </div>
          </div>
        </div>
        
        <!-- 推荐服务测试区域 -->
        <div class="recommendation-test-section">
          <h3>推荐服务功能测试</h3>
          
          <div class="test-options">
            <div class="options-header">
              <h4>查询参数设置</h4>
            </div>
            <div class="options-form">
              <div class="form-row">
                <label for="limit">推荐数量限制:</label>
                <input type="number" id="limit" v-model="queryParams.limit" min="1" max="50" />
              </div>
              
              <div class="form-row">
                <label for="category">车辆类别:</label>
                <input type="text" id="category" v-model="queryParams.category" placeholder="可选参数" />
              </div>
              
              <div class="form-row">
                <label for="days">统计天数:</label>
                <input type="number" id="days" v-model="queryParams.days" min="1" max="365" placeholder="可选参数" />
              </div>
            </div>
          </div>
          
          <div class="test-actions">
            <button @click="getPreferenceRecommendations" class="action-button" :disabled="!isLoggedIn">
              获取偏好推荐
            </button>
            <button @click="getNewCarRecommendations" class="action-button">
              获取新车推荐
            </button>
            <button @click="getHotRecommendations" class="action-button">
              获取热门推荐
            </button>
            <button @click="getHomeRecommendations" class="action-button">
              获取首页推荐
            </button>
            <button @click="getBehaviorRecommendations" class="action-button" :disabled="!isLoggedIn">
              获取行为推荐
            </button>
            <button @click="getAllRecommendations" class="action-button">
              获取所有推荐
            </button>
          </div>
          
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
import recommendationService from '../../api/recommendationService';

export default {
  name: 'RecommendationTestView',
  data() {
    return {
      isLoggedIn: false,
      queryParams: {
        limit: 10,
        category: '',
        days: ''
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
      this.isLoggedIn = recommendationService.isLoggedIn();
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
    
    // 获取偏好推荐
    async getPreferenceRecommendations() {
      try {
        this.responseStatus = { type: 'loading', message: '正在获取偏好推荐...' };
        const response = await recommendationService.getPreferenceRecommendations(this.queryParams);
        this.handleResponse(response, '获取偏好推荐');
      } catch (error) {
        this.responseStatus = { type: 'error', message: `获取偏好推荐失败: ${error.message}` };
        this.responseData = { error: error.message };
      }
    },
    
    // 获取新车推荐
    async getNewCarRecommendations() {
      try {
        this.responseStatus = { type: 'loading', message: '正在获取新车推荐...' };
        const response = await recommendationService.getNewCarRecommendations(this.queryParams);
        this.handleResponse(response, '获取新车推荐');
      } catch (error) {
        this.responseStatus = { type: 'error', message: `获取新车推荐失败: ${error.message}` };
        this.responseData = { error: error.message };
      }
    },
    
    // 获取热门推荐
    async getHotRecommendations() {
      try {
        this.responseStatus = { type: 'loading', message: '正在获取热门推荐...' };
        const response = await recommendationService.getHotRecommendations(this.queryParams);
        this.handleResponse(response, '获取热门推荐');
      } catch (error) {
        this.responseStatus = { type: 'error', message: `获取热门推荐失败: ${error.message}` };
        this.responseData = { error: error.message };
      }
    },
    
    // 获取首页推荐
    async getHomeRecommendations() {
      try {
        this.responseStatus = { type: 'loading', message: '正在获取首页推荐...' };
        const response = await recommendationService.getHomeRecommendations(this.queryParams);
        this.handleResponse(response, '获取首页推荐');
      } catch (error) {
        this.responseStatus = { type: 'error', message: `获取首页推荐失败: ${error.message}` };
        this.responseData = { error: error.message };
      }
    },
    
    // 获取行为推荐
    async getBehaviorRecommendations() {
      try {
        this.responseStatus = { type: 'loading', message: '正在获取行为推荐...' };
        const response = await recommendationService.getBehaviorRecommendations(this.queryParams);
        this.handleResponse(response, '获取行为推荐');
      } catch (error) {
        this.responseStatus = { type: 'error', message: `获取行为推荐失败: ${error.message}` };
        this.responseData = { error: error.message };
      }
    },
    
    // 获取所有推荐
    async getAllRecommendations() {
      try {
        this.responseStatus = { type: 'loading', message: '正在获取所有推荐...' };
        const response = await recommendationService.getAllRecommendations(this.queryParams);
        this.handleResponse(response, '获取所有推荐');
      } catch (error) {
        this.responseStatus = { type: 'error', message: `获取所有推荐失败: ${error.message}` };
        this.responseData = { error: error.message };
      }
    }
  }
};
</script>

<style scoped>
.recommendation-test-view {
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

.recommendation-test-section {
  margin-top: 1rem;
}

.test-options {
  background-color: #f9f9f9;
  border-radius: 8px;
  padding: 1rem;
  margin-bottom: 1.5rem;
}

.options-header {
  margin-bottom: 1rem;
}

.options-header h4 {
  margin: 0;
  color: #555;
}

.options-form {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
}

.form-row {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  flex: 1;
  min-width: 200px;
}

.form-row label {
  font-weight: 500;
  color: #555;
}

.form-row input {
  padding: 0.5rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
}

.test-actions {
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

.token-value {
  font-size: 0.9rem;
  color: #555;
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
  
  .options-form {
    flex-direction: column;
  }
  
  .form-row {
    width: 100%;
  }
  
  .test-actions {
    flex-direction: column;
  }
  
  .action-button {
    width: 100%;
  }
}
</style> 