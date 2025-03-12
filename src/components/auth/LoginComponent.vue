<template>
  <div class="login-component">
    <div class="login-container">
      <h2 class="login-title">用户登录</h2>
      
      <div v-if="errorMessage" class="error-message">
        {{ errorMessage }}
      </div>
      
      <div class="form-group">
        <label for="loginIdentity">账号</label>
        <input 
          type="text" 
          id="loginIdentity" 
          v-model="loginIdentity" 
          placeholder="请输入邮箱或手机号"
          :disabled="isLoading"
        />
      </div>
      
      <div class="form-group">
        <label for="password">密码</label>
        <input 
          type="password" 
          id="password" 
          v-model="password" 
          placeholder="请输入密码"
          :disabled="isLoading"
        />
      </div>
      
      <div class="form-group login-type">
        <label>登录方式</label>
        <div class="login-type-options">
          <label class="radio-option">
            <input 
              type="radio" 
              v-model="loginType" 
              value="phone" 
              :disabled="isLoading"
            />
            <span>手机号</span>
          </label>
          <label class="radio-option">
            <input 
              type="radio" 
              v-model="loginType" 
              value="email" 
              :disabled="isLoading"
            />
            <span>邮箱</span>
          </label>
        </div>
      </div>
      
      <div class="login-actions">
        <button 
          class="login-button" 
          @click="handleLogin" 
          :disabled="isLoading || !isFormValid"
        >
          {{ isLoading ? '登录中...' : '登录' }}
        </button>
      </div>
    </div>
    
    <div v-if="isLoggedIn" class="login-status">
      <div class="status-header">
        <h3>登录状态</h3>
        <button @click="checkLoginStatus" class="refresh-button">
          刷新状态
        </button>
      </div>
      
      <div class="user-info">
        <div class="info-item">
          <span class="info-label">状态:</span>
          <span class="status-badge logged-in">已登录</span>
        </div>
        
        <div class="info-item">
          <span class="info-label">用户名:</span>
          <span>{{ userInfo?.username || '未知' }}</span>
        </div>
        
        <div class="info-item">
          <span class="info-label">用户类型:</span>
          <span>{{ userInfo?.userType || '未知' }}</span>
        </div>
        
        <div class="logout-action">
          <button 
            @click="handleLogout" 
            class="logout-button" 
            :disabled="isLoggingOut"
          >
            {{ isLoggingOut ? '注销中...' : '退出登录' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import authService from '../../api/authService';

export default {
  name: 'LoginComponent',
  data() {
    return {
      loginIdentity: '',
      password: '',
      loginType: 'phone', // 默认为手机号登录
      errorMessage: '',
      isLoading: false,
      isLoggedIn: false,
      userInfo: null,
      isLoggingOut: false
    };
  },
  computed: {
    isFormValid() {
      // 验证表单
      return this.loginIdentity.trim() !== '' && 
             this.password.trim() !== '' && 
             (this.loginType === 'phone' || this.loginType === 'email');
    }
  },
  created() {
    // 组件创建时检查登录状态
    this.checkLoginStatus();
  },
  methods: {
    // 检查登录状态
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
    
    // 处理登录
    async handleLogin() {
      if (!this.isFormValid) {
        return;
      }
      
      this.isLoading = true;
      this.errorMessage = '';
      
      try {
        // 调用登录服务
        const result = await authService.login(this.loginIdentity, this.password, this.loginType);
        
        if (result.success) {
          // 登录成功
          this.$emit('login-success', result.data);
          
          // 清空表单
          this.loginIdentity = '';
          this.password = '';
          
          // 更新登录状态
          this.checkLoginStatus();
        } else {
          // 登录失败
          this.errorMessage = result.message || '登录失败，请检查您的账号和密码';
        }
      } catch (error) {
        this.errorMessage = '登录过程中发生错误，请稍后再试';
        console.error('登录错误:', error);
      } finally {
        this.isLoading = false;
      }
    },
    
    // 处理注销
    async handleLogout() {
      if (this.isLoggingOut) return;
      
      this.isLoggingOut = true;
      
      try {
        // 调用注销API
        const result = await authService.logout();
        
        if (result.success) {
          // 注销成功
          this.$emit('logout-success');
        } else {
          console.error('注销失败:', result.message);
        }
        
        // 无论成功与否，都更新登录状态
        this.checkLoginStatus();
      } catch (error) {
        console.error('注销过程中发生错误:', error);
      } finally {
        this.isLoggingOut = false;
      }
    }
  }
};
</script>

<style scoped>
.login-component {
  display: flex;
  flex-direction: column;
  gap: 20px;
  width: 100%;
  max-width: 800px;
  margin: 0 auto;
}

.login-container {
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
  padding: 30px;
  width: 100%;
}

.login-title {
  text-align: center;
  margin-bottom: 25px;
  color: #333;
  font-size: 24px;
  font-weight: 600;
}

.form-group {
  margin-bottom: 20px;
}

label {
  display: block;
  margin-bottom: 8px;
  font-weight: 500;
  color: #333;
  font-size: 16px;
}

input[type="text"],
input[type="password"] {
  width: 100%;
  padding: 12px 15px;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 16px;
  transition: border-color 0.3s, box-shadow 0.3s;
}

input:focus {
  outline: none;
  border-color: #4a9cf6;
  box-shadow: 0 0 0 3px rgba(74, 156, 246, 0.2);
}

.login-type-options {
  display: flex;
  gap: 30px;
}

.radio-option {
  display: flex;
  align-items: center;
  cursor: pointer;
  font-weight: normal;
}

.radio-option input {
  margin-right: 8px;
}

.login-actions {
  margin-top: 25px;
}

.login-button {
  width: 100%;
  padding: 14px;
  background-color: #4a9cf6;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.3s;
}

.login-button:hover:not(:disabled) {
  background-color: #3a8ce6;
}

.login-button:disabled {
  background-color: #a7c7e7;
  cursor: not-allowed;
}

.error-message {
  padding: 12px 15px;
  background-color: #fff8f8;
  border-left: 4px solid #e74c3c;
  color: #e74c3c;
  margin-bottom: 20px;
  font-size: 14px;
  border-radius: 4px;
}

.login-options {
  display: flex;
  justify-content: space-between;
  margin-top: 20px;
  font-size: 14px;
}

.forgot-password,
.register-link {
  color: #4a9cf6;
  text-decoration: none;
  transition: color 0.3s;
}

.forgot-password:hover,
.register-link:hover {
  color: #3a8ce6;
  text-decoration: underline;
}

/* 登录状态样式 */
.login-status {
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
  padding: 20px;
  margin-top: 20px;
}

.status-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
}

.status-header h3 {
  margin: 0;
  font-size: 18px;
  color: #333;
}

.refresh-button {
  background-color: #f0f2f5;
  border: 1px solid #ddd;
  padding: 6px 12px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  transition: background-color 0.2s;
}

.refresh-button:hover {
  background-color: #e4e6e9;
}

.user-info {
  background-color: #f8f9fa;
  padding: 15px;
  border-radius: 6px;
}

.info-item {
  display: flex;
  margin-bottom: 10px;
}

.info-label {
  font-weight: 500;
  width: 80px;
  color: #555;
}

.status-badge {
  padding: 4px 10px;
  border-radius: 20px;
  font-size: 14px;
  font-weight: 500;
}

.logged-in {
  background-color: #d4edda;
  color: #155724;
}

.logout-action {
  margin-top: 15px;
}

.logout-button {
  padding: 8px 16px;
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
  .login-container {
    padding: 20px;
  }
  
  .login-type-options {
    flex-direction: column;
    gap: 10px;
  }
}
</style> 