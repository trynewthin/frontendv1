<template>
  <div class="login-test-view">
    <div class="header">
      <h1>登录测试页面</h1>
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
            
            <div v-if="isLoggedIn" class="user-info status-info">
              <h4>用户信息</h4>
              <pre>{{ userInfoJson }}</pre>
            </div>
            
            <div v-else class="status-info">
              <p>您当前未登录，请使用下方登录表单进行登录，或者查看测试记录</p>
            </div>
          </div>
        </div>
        
        <div class="tabs-container">
          <div class="tabs">
            <button 
              @click="activeTab = 'login'" 
              class="tab-button" 
              :class="{ active: activeTab === 'login' }"
            >
              登录测试
            </button>
            <button 
              @click="activeTab = 'logout'" 
              class="tab-button" 
              :class="{ active: activeTab === 'logout' }"
            >
              注销测试
            </button>
          </div>
          
          <!-- 登录测试 -->
          <div v-if="activeTab === 'login'" class="tab-content">
            <div class="login-container">
              <login-form @login-success="handleLoginSuccess" />
            </div>
            
            <div class="results-section">
              <div class="result-container" v-if="loginResult">
                <h3>登录结果</h3>
                <pre>{{ loginResultJson }}</pre>
              </div>
            </div>
          </div>
          
          <!-- 注销测试 -->
          <div v-if="activeTab === 'logout'" class="tab-content">
            <div class="logout-test-container">
              <h3>注销测试</h3>
              <p>点击下方按钮测试注销功能，无论当前是否已经登录</p>
              
              <div class="test-action">
                <button 
                  @click="handleLogout" 
                  class="logout-button" 
                  :disabled="isLoggingOut"
                >
                  {{ isLoggingOut ? '注销中...' : '执行注销' }}
                </button>
              </div>
              
              <div class="result-container" v-if="logoutResult">
                <h3>注销结果</h3>
                <pre>{{ logoutResultJson }}</pre>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import LoginForm from '../../components/LoginForm.vue';
import authService from '../../api/authService';

export default {
  name: 'LoginTestView',
  components: {
    LoginForm
  },
  data() {
    return {
      activeTab: 'login',
      loginResult: null,
      logoutResult: null,
      isLoggedIn: false,
      isLoggingOut: false,
      userInfo: null
    };
  },
  computed: {
    loginResultJson() {
      return JSON.stringify(this.loginResult, null, 2);
    },
    logoutResultJson() {
      return JSON.stringify(this.logoutResult, null, 2);
    },
    userInfoJson() {
      return JSON.stringify(this.userInfo, null, 2);
    }
  },
  created() {
    // 检查用户是否已经登录
    this.checkLoginStatus();
  },
  methods: {
    checkLoginStatus() {
      console.log('检查登录状态');
      this.isLoggedIn = authService.isLoggedIn();
      if (this.isLoggedIn) {
        this.userInfo = authService.getCurrentUser();
        console.log('当前登录用户:', this.userInfo);
      } else {
        this.userInfo = null;
        console.log('当前未登录');
      }
    },
    handleLoginSuccess(data) {
      console.log('登录成功回调:', data);
      this.loginResult = data;
      
      // 登录成功后主动检查状态
      setTimeout(() => {
        this.checkLoginStatus();
      }, 100);
    },
    async handleLogout() {
      if (this.isLoggingOut) return;
      
      this.isLoggingOut = true;
      
      try {
        // 调用注销API
        const result = await authService.logout();
        this.logoutResult = result;
        
        // 注销后主动检查状态
        setTimeout(() => {
          this.checkLoginStatus();
        }, 100);
      } catch (error) {
        this.logoutResult = {
          success: false,
          message: error.message || '注销过程中发生错误'
        };
        
        // 即使出错也检查状态
        this.checkLoginStatus();
      } finally {
        this.isLoggingOut = false;
      }
    },
    getStoredToken() {
      return localStorage.getItem('token') || '无token';
    }
  }
};
</script>

<style scoped>
.login-test-view {
  display: flex;
  flex-direction: column;
  min-height: 100%;
  width: 100%;
  margin: 0;
  padding: 0;
  background-color: #f5f7fa;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 2rem;
  background-color: white;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
}

.content {
  flex: 1;
  display: flex;
  width: 100%;
}

h1 {
  margin: 0;
  color: #333;
  font-size: 1.8rem;
}

h3 {
  margin-top: 0;
  margin-bottom: 15px;
  color: #333;
}

h4 {
  margin-top: 0;
  margin-bottom: 10px;
  color: #444;
}

.back-link {
  padding: 8px 16px;
  background-color: #f5f5f5;
  color: #333;
  border-radius: 4px;
  text-decoration: none;
  font-weight: 500;
  transition: background-color 0.2s;
}

.back-link:hover {
  background-color: #e0e0e0;
}

.test-container {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding: 0;
}

/* 状态检测区域 */
.status-section {
  width: 100%;
  padding: 0 1rem;
}

.status-container {
  background-color: white;
  padding: 1.5rem;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  border-radius: 4px;
}

.status-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
}

.status-body {
  margin-bottom: 20px;
}

.status-item {
  display: flex;
  align-items: center;
  margin-bottom: 10px;
}

.status-label {
  font-weight: 500;
  width: 100px;
}

.token-value {
  font-family: monospace;
  padding: 5px 10px;
  background-color: #f5f5f5;
  border-radius: 4px;
  max-width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.status-badge {
  padding: 5px 15px;
  border-radius: 20px;
  font-weight: 500;
  font-size: 14px;
}

.logged-in {
  background-color: #d4edda;
  color: #155724;
}

.logged-out {
  background-color: #f8d7da;
  color: #721c24;
}

.refresh-button {
  background-color: #f8f9fa;
  border: 1px solid #ddd;
  padding: 5px 10px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  transition: background-color 0.2s;
}

.refresh-button:hover {
  background-color: #e9ecef;
}

.status-info {
  margin-top: 15px;
  background-color: #f8f9fa;
  padding: 15px;
  border-radius: 4px;
}

/* 标签页 */
.tabs-container {
  width: 100%;
  padding: 0 1rem;
}

.tabs {
  display: flex;
  border-bottom: 1px solid #dee2e6;
  margin-bottom: 20px;
}

.tab-button {
  padding: 10px 20px;
  background-color: transparent;
  border: none;
  cursor: pointer;
  font-size: 16px;
  color: #6c757d;
  transition: all 0.2s;
  position: relative;
}

.tab-button:hover {
  color: #495057;
}

.tab-button.active {
  color: #4a9cf6;
  font-weight: 500;
}

.tab-button.active:after {
  content: '';
  position: absolute;
  bottom: -1px;
  left: 0;
  right: 0;
  height: 2px;
  background-color: #4a9cf6;
}

.tab-content {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
}

.login-container, 
.logout-test-container {
  flex: 1;
  min-width: 300px;
}

.logout-test-container {
  background-color: white;
  padding: 1.5rem;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  border-radius: 4px;
}

.test-action {
  margin: 20px 0;
}

.results-section {
  flex: 1;
  min-width: 300px;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.result-container {
  background-color: white;
  padding: 1.5rem;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  border-radius: 4px;
}

pre {
  background-color: #f0f2f5;
  padding: 15px;
  border-radius: 4px;
  overflow-x: auto;
  color: #333;
  font-size: 14px;
  line-height: 1.5;
}

.user-info {
  padding-top: 20px;
}

.logout-button {
  padding: 10px 20px;
  background-color: #dc3545;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  transition: background-color 0.2s;
}

.logout-button:hover:not(:disabled) {
  background-color: #c82333;
}

.logout-button:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

@media (max-width: 768px) {
  .header {
    padding: 1rem;
    flex-direction: column;
    gap: 1rem;
    text-align: center;
  }
  
  .tabs {
    flex-direction: column;
    border-bottom: none;
  }
  
  .tab-button {
    border-bottom: 1px solid #dee2e6;
    text-align: left;
  }
  
  .tab-button.active:after {
    height: 100%;
    width: 3px;
    top: 0;
    bottom: 0;
    left: 0;
    right: auto;
  }
}
</style> 