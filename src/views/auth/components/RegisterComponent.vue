<template>
  <div class="register-component">
    <div class="register-container">
      <h2 class="register-title">注册</h2>
      
      <div v-if="errorMessage" class="error-message">
        {{ errorMessage }}
      </div>
      
      <div class="form-group user-type">
        <div class="button-group-container">
          <div class="button-group top-group">
            <button 
              type="button"
              :class="['btn-option', { active: userType === 'NORMAL_USER' }]"
              @click="userType = 'NORMAL_USER'"
              :disabled="isLoading"
            >
              普通用户
            </button>
            <button 
              type="button"
              :class="['btn-option', { active: userType === 'DEALER' }]"
              @click="userType = 'DEALER'"
              :disabled="isLoading"
            >
              经销商
            </button>
          </div>
        </div>
        <div v-if="userTypeError" class="field-error user-type-error">
          {{ userTypeError }}
        </div>
      </div>
      
      <div class="form-group">
        <div class="form-field">
          <label for="username">用户名</label>
          <div class="input-container">
            <input 
              type="text" 
              id="username" 
              v-model="username" 
              placeholder="请输入用户名"
              :disabled="isLoading"
            />
            <div v-if="usernameError" class="field-error">
              {{ usernameError }}
            </div>
          </div>
        </div>
      </div>
      
      <div class="form-group">
        <div class="form-field">
          <label for="email">电子邮箱</label>
          <div class="input-container">
            <input 
              type="email" 
              id="email" 
              v-model="email" 
              placeholder="请输入电子邮箱"
              :disabled="isLoading"
            />
            <div v-if="emailError" class="field-error">
              {{ emailError }}
            </div>
          </div>
        </div>
      </div>
      
      <div class="form-group">
        <div class="form-field">
          <label for="phone">手机号</label>
          <div class="input-container">
            <input 
              type="text" 
              id="phone" 
              v-model="phone" 
              placeholder="请输入手机号"
              :disabled="isLoading"
            />
            <div v-if="phoneError" class="field-error">
              {{ phoneError }}
            </div>
          </div>
        </div>
      </div>
      
      <div class="form-group">
        <div class="form-field">
          <label for="password">密码</label>
          <div class="input-container">
            <input 
              type="password" 
              id="password" 
              v-model="password" 
              placeholder="请输入密码"
              :disabled="isLoading"
            />
            <div v-if="passwordError" class="field-error">
              {{ passwordError }}
            </div>
          </div>
        </div>
      </div>
      
      <div class="form-group">
        <div class="form-field">
          <label for="confirmPassword">确认密码</label>
          <div class="input-container">
            <input 
              type="password" 
              id="confirmPassword" 
              v-model="confirmPassword" 
              placeholder="请再次输入密码"
              :disabled="isLoading"
            />
            <div v-if="confirmPasswordError" class="field-error">
              {{ confirmPasswordError }}
            </div>
          </div>
        </div>
      </div>
      
      <div class="register-actions-container">
        <div class="register-actions">
          <button 
            class="register-button" 
            @click="handleRegister" 
            :disabled="isLoading || !isFormValid"
          >
            {{ isLoading ? '注册中...' : '注册' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import authService from '../../../api/authService';

export default {
  name: 'RegisterComponent',
  data() {
    return {
      username: '',
      password: '',
      confirmPassword: '',
      email: '',
      phone: '',
      userType: 'NORMAL_USER', // 默认为普通用户
      
      // 错误信息
      usernameError: '',
      passwordError: '',
      confirmPasswordError: '',
      emailError: '',
      phoneError: '',
      userTypeError: '',
      errorMessage: '',
      
      isLoading: false
    };
  },
  computed: {
    isFormValid() {
      // 清除所有错误信息
      this.clearErrors();
      let isValid = true;
      
      // 验证用户名
      if (!this.username.trim()) {
        this.usernameError = '用户名不能为空';
        isValid = false;
      } else if (this.username.length < 3) {
        this.usernameError = '用户名至少需要3个字符';
        isValid = false;
      }
      
      // 验证密码
      if (!this.password) {
        this.passwordError = '密码不能为空';
        isValid = false;
      } else if (this.password.length < 6) {
        this.passwordError = '密码至少需要6个字符';
        isValid = false;
      }
      
      // 验证确认密码
      if (this.password !== this.confirmPassword) {
        this.confirmPasswordError = '两次输入的密码不一致';
        isValid = false;
      }
      
      // 验证邮箱
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!this.email.trim()) {
        this.emailError = '电子邮箱不能为空';
        isValid = false;
      } else if (!emailRegex.test(this.email)) {
        this.emailError = '请输入有效的电子邮箱';
        isValid = false;
      }
      
      // 验证手机号(如果提供)
      if (this.phone && !/^1[3-9]\d{9}$/.test(this.phone)) {
        this.phoneError = '请输入有效的手机号';
        isValid = false;
      }
      
      // 验证用户类型
      if (!this.userType) {
        this.userTypeError = '请选择用户类型';
        isValid = false;
      }
      
      return isValid;
    }
  },
  methods: {
    clearErrors() {
      this.usernameError = '';
      this.passwordError = '';
      this.confirmPasswordError = '';
      this.emailError = '';
      this.phoneError = '';
      this.userTypeError = '';
      this.errorMessage = '';
    },
    
    resetForm() {
      this.username = '';
      this.password = '';
      this.confirmPassword = '';
      this.email = '';
      this.phone = '';
      this.userType = 'NORMAL_USER';
      this.clearErrors();
    },
    
    async handleRegister() {
      if (!this.isFormValid) {
        return;
      }
      
      this.isLoading = true;
      this.errorMessage = '';
      
      try {
        const userData = {
          username: this.username,
          password: this.password,
          email: this.email,
          phone: this.phone || undefined,
          userType: this.userType
        };
        
        // 调用注册服务
        const result = await authService.register(userData);
        
        if (result.success) {
          // 注册成功
          this.errorMessage = '注册成功！';
        } else {
          // 注册失败
          this.errorMessage = result.message || '注册失败，请稍后再试';
        }
      } catch (error) {
        this.errorMessage = '注册过程中发生错误，请稍后再试';
        console.error('注册错误:', error);
      } finally {
        this.isLoading = false;
      }
    }
  }
};
</script>

<style scoped>
.register-component {
  display: flex;
  flex-direction: column;
  gap: 20px;
  width: 100%;
  max-width: 800px;
  margin: 0 auto;
}

.register-container {
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 3px 15px rgba(0, 0, 0, 0.2); /* 黑色阴影 */
  padding: 30px;
  width: 100%;
}

.register-title {
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
  align-items: flex-start;
}

.input-container {
  flex: 1;
}

label {
  display: block;
  font-weight: 500;
  color: #333;
  font-size: 16px;
  width: 100px;
  text-align: left;
  flex-shrink: 0;
  padding-top: 12px;
}

input[type="text"],
input[type="password"],
input[type="email"] {
  width: 100%;
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

.field-error {
  margin-top: 5px;
  color: #d32f2f;
  font-size: 14px;
}

.user-type-error {
  margin-top: 8px;
  text-align: center;
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
  justify-content: center; /* 按钮组居中 */
  width: 100%;
  max-width: 400px;
}

.top-group {
  width: 100%;
  margin-bottom: 10px;
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

.register-actions-container {
  width: 100%;
  display: flex;
  justify-content: center;
  margin-top: 30px;
}

.register-actions {
  width: 100%;
  max-width: 400px;
}

.register-button {
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

.register-button:hover:not(:disabled) {
  background-color: #333;
}

.register-button:disabled {
  background-color: #666;
  cursor: not-allowed;
}

.register-options {
  margin-top: 20px;
  text-align: center;
}

.login-link {
  color: #4a90e2;
  text-decoration: none;
  font-weight: 500;
  transition: color 0.2s;
}

.login-link:hover {
  color: #3a80d2;
  text-decoration: underline;
}

.error-message {
  padding: 12px;
  background-color: #ffebee;
  color: #d32f2f;
  border-radius: 4px;
  margin-bottom: 20px;
  font-size: 14px;
}

/* 深色模式样式 */
:root[data-theme="dark"] .register-component {
  color: #e0e0e0;
}

:root[data-theme="dark"] .register-container,
:root[data-theme="dark"] .register-status {
  background-color: #1a1a1a;
  box-shadow: 0 3px 15px rgba(255, 223, 175, 0.3); /* 白金色阴影 */
}

:root[data-theme="dark"] .register-title {
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

:root[data-theme="dark"] .field-error {
  color: #ff6b6b;
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

:root[data-theme="dark"] .register-button {
  background-color: #fff; /* 白底 */
  color: #000; /* 黑字 */
}

:root[data-theme="dark"] .register-button:hover:not(:disabled) {
  background-color: #e0e0e0;
}

:root[data-theme="dark"] .register-button:disabled {
  background-color: #aaa;
}

:root[data-theme="dark"] .login-link {
  color: #4a90e2;
}

:root[data-theme="dark"] .login-link:hover {
  color: #6aa8e7;
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

:root[data-theme="dark"] .success-info p {
  color: #66bb6a;
}

:root[data-theme="dark"] .info-label {
  color: #aaa;
}

:root[data-theme="dark"] .go-login-button {
  background-color: #fff; /* 白底 */
  color: #000; /* 黑字 */
}

:root[data-theme="dark"] .go-login-button:hover {
  background-color: #e0e0e0;
}

:root[data-theme="dark"] .reset-button {
  background-color: #333;
  color: #e0e0e0;
  border-color: #444;
}

:root[data-theme="dark"] .reset-button:hover {
  background-color: #444;
}
</style> 