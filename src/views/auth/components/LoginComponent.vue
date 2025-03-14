<template>
  <div class="login-component">
    <div class="login-container">
      <h2 class="login-title">登录</h2>
      
      <div v-if="errorMessage" class="error-message">
        {{ errorMessage }}
      </div>
      
      <div class="form-group login-type">
        <div class="button-group-container">
          <div class="button-group">
            <button 
              type="button"
              :class="['btn-option', { active: loginType === 'phone' }]"
              @click="loginType = 'phone'"
              :disabled="isLoading"
            >
              手机号
            </button>
            <button 
              type="button"
              :class="['btn-option', { active: loginType === 'email' }]"
              @click="loginType = 'email'"
              :disabled="isLoading"
            >
              邮箱
            </button>
          </div>
        </div>
      </div>
      
      <div class="form-group">
        <div class="form-field">
          <label for="loginIdentity">账号</label>
          <input 
            type="text" 
            id="loginIdentity" 
            v-model="loginIdentity" 
            placeholder="请输入邮箱或手机号"
            :disabled="isLoading"
          />
        </div>
      </div>
      
      <div class="form-group">
        <div class="form-field">
          <label for="password">密码</label>
          <input 
            type="password" 
            id="password" 
            v-model="password" 
            placeholder="请输入密码"
            :disabled="isLoading"
          />
        </div>
      </div>
      
      <div class="login-actions-container">
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
    </div>
  </div>
</template>

<script>
import authService from '../../../api/authService';

export default {
  name: 'LoginComponent',
  data() {
    return {
      loginIdentity: '',
      password: '',
      loginType: 'email', // 默认为手机号登录
      errorMessage: '',
      isLoading: false
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
  methods: {
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
  box-shadow: 0 3px 15px rgba(0, 0, 0, 0.2); /* 黑色阴影 */
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

.form-field {
  display: flex;
  align-items: center;
}

label {
  display: block;
  font-weight: 500;
  color: #333;
  font-size: 16px;
  width: 80px;
  text-align: left;
  flex-shrink: 0;
}

input[type="text"],
input[type="password"],
input[type="email"] {
  flex: 1;
  padding: 12px 15px;
  border: 1px solid #000; /* 黑色边框 */
  border-radius: 4px;
  font-size: 16px;
  color: #333;
  transition: border-color 0.3s;
}

input[type="text"]:focus,
input[type="password"]:focus,
input[type="email"]:focus {
  border-color: #000;
  outline: none;
}

.button-group-container {
  width: 100%;
  display: flex;
  justify-content: center;
  margin-bottom: 10px;
}

.button-group {
  display: flex;
  gap: 10px;
  width: 100%;
  justify-content: center; /* 按钮组居中 */
  max-width: 400px; /* 限制最大宽度 */
}

.btn-option {
  padding: 10px 20px;
  background-color: #f5f5f5;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 15px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  flex: 1;
  min-width: 100px;
  max-width: 200px;
}

.btn-option:hover:not(:disabled) {
  background-color: #e8e8e8;
}

.btn-option.active {
  background-color: #000; /* 黑底 */
  color: white; /* 白字 */
  border-color: #000;
}

.btn-option:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.login-actions-container {
  width: 100%;
  display: flex;
  justify-content: center;
  margin-top: 30px;
}

.login-actions {
  width: 100%;
  max-width: 400px;
}

.login-button {
  width: 100%;
  padding: 14px;
  background-color: #000; /* 黑底 */
  color: white; /* 白字 */
  border: none;
  border-radius: 4px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.3s;
  min-width: 150px;
}

.login-button:hover:not(:disabled) {
  background-color: #333;
}

.login-button:disabled {
  background-color: #666;
  cursor: not-allowed;
}

.error-message {
  padding: 12px;
  background-color: #ffebee;
  color: #d32f2f;
  border-radius: 4px;
  margin-bottom: 20px;
  font-size: 14px;
}

/* 登录状态样式 */
.login-status {
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 3px 15px rgba(0, 0, 0, 0.2); /* 黑色阴影 */
  padding: 20px;
  margin-top: 20px;
}

.status-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
  padding-bottom: 10px;
  border-bottom: 1px solid #eee;
}

.status-header h3 {
  margin: 0;
  color: #333;
  font-size: 18px;
}

.refresh-button {
  padding: 6px 12px;
  background-color: #f5f5f5;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.refresh-button:hover {
  background-color: #e0e0e0;
}

.user-info {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.info-item {
  display: flex;
  align-items: center;
}

.info-label {
  width: 100px;
  font-weight: 500;
  color: #555;
}

.status-badge {
  padding: 3px 8px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 600;
}

.logged-in {
  background-color: #e8f5e9;
  color: #2e7d32;
}

.logout-action {
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
}

.logout-button {
  padding: 8px 16px;
  background-color: #ffebee;
  color: #d32f2f;
  border: 1px solid #ffcdd2;
  border-radius: 4px;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s;
}

.logout-button:hover:not(:disabled) {
  background-color: #ffcdd2;
}

.logout-button:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.login-options {
  margin-top: 20px;
  text-align: center;
}

.register-link {
  color: #4a90e2;
  text-decoration: none;
  font-weight: 500;
  transition: color 0.2s;
}

.register-link:hover {
  color: #3a80d2;
  text-decoration: underline;
}

@media (max-width: 768px) {
  .login-container,
  .login-status {
    padding: 20px;
  }
  
  .login-title {
    font-size: 22px;
  }
  
  .form-field {
    flex-direction: column;
    align-items: flex-start;
  }
  
  label {
    width: 100%;
    margin-bottom: 8px;
  }
  
  input[type="text"],
  input[type="password"],
  input[type="email"] {
    width: 100%;
    padding: 10px 12px;
  }
  
  .button-group,
  .login-actions {
    max-width: 100%;
  }
  
  .login-button {
    padding: 12px;
  }
}

/* 深色模式样式 */
:root[data-theme="dark"] .login-component {
  color: #e0e0e0;
}

:root[data-theme="dark"] .login-container,
:root[data-theme="dark"] .login-status {
  background-color: #1a1a1a;
  box-shadow: 0 3px 15px rgba(255, 223, 175, 0.3); /* 白金色阴影 */
}

:root[data-theme="dark"] .login-title {
  color: #fff;
}

:root[data-theme="dark"] label {
  color: #e0e0e0;
}

:root[data-theme="dark"] input[type="text"],
:root[data-theme="dark"] input[type="password"],
:root[data-theme="dark"] input[type="email"] {
  background-color: #2a2a2a;
  color: #fff;
  border-color: #fff; /* 白色边框 */
}

:root[data-theme="dark"] input[type="text"]:focus,
:root[data-theme="dark"] input[type="password"]:focus,
:root[data-theme="dark"] input[type="email"]:focus {
  border-color: #fff;
}

:root[data-theme="dark"] .btn-option {
  background-color: #333;
  color: #e0e0e0;
  border-color: #444;
}

:root[data-theme="dark"] .btn-option:hover:not(:disabled) {
  background-color: #444;
}

:root[data-theme="dark"] .btn-option.active {
  background-color: #fff; /* 白底 */
  color: #000; /* 黑字 */
  border-color: #fff;
}

:root[data-theme="dark"] .login-button {
  background-color: #fff; /* 白底 */
  color: #000; /* 黑字 */
}

:root[data-theme="dark"] .login-button:hover:not(:disabled) {
  background-color: #e0e0e0;
}

:root[data-theme="dark"] .login-button:disabled {
  background-color: #aaa;
}

:root[data-theme="dark"] .error-message {
  background-color: rgba(211, 47, 47, 0.2);
  color: #ff6b6b;
}

:root[data-theme="dark"] .status-header {
  border-bottom-color: #333;
}

:root[data-theme="dark"] .status-header h3 {
  color: #fff;
}

:root[data-theme="dark"] .refresh-button {
  background-color: #333;
  color: #e0e0e0;
  border-color: #444;
}

:root[data-theme="dark"] .refresh-button:hover {
  background-color: #444;
}

:root[data-theme="dark"] .info-label {
  color: #aaa;
}

:root[data-theme="dark"] .logout-button {
  background-color: rgba(211, 47, 47, 0.2);
  color: #ff6b6b;
  border-color: rgba(211, 47, 47, 0.3);
}

:root[data-theme="dark"] .logout-button:hover:not(:disabled) {
  background-color: rgba(211, 47, 47, 0.3);
}

:root[data-theme="dark"] .register-link {
  color: #4a90e2;
}

:root[data-theme="dark"] .register-link:hover {
  color: #6aa8e7;
}
</style> 