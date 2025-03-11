<template>
  <div class="login-form">
    <h2>用户登录</h2>
    
    <div v-if="errorMessage" class="error-message">
      {{ errorMessage }}
    </div>
    
    <div class="form-group">
      <label for="loginIdentity">邮箱或手机号 <span class="required">*</span></label>
      <input 
        type="text" 
        id="loginIdentity" 
        v-model="loginIdentity" 
        placeholder="请输入邮箱或手机号"
        :disabled="isLoading"
      />
    </div>
    
    <div class="form-group">
      <label for="password">密码 <span class="required">*</span></label>
      <input 
        type="password" 
        id="password" 
        v-model="password" 
        placeholder="请输入密码"
        :disabled="isLoading"
      />
    </div>
    
    <div class="form-group">
      <label>登录类型 <span class="required">*</span></label>
      <div class="login-type-options">
        <label class="radio-label">
          <input 
            type="radio" 
            v-model="loginType" 
            value="phone" 
            :disabled="isLoading"
          />
          手机号
        </label>
        <label class="radio-label">
          <input 
            type="radio" 
            v-model="loginType" 
            value="email" 
            :disabled="isLoading"
          />
          邮箱
        </label>
      </div>
      <div v-if="loginTypeError" class="field-error">
        {{ loginTypeError }}
      </div>
    </div>
    
    <div class="form-actions">
      <button 
        class="login-button" 
        @click="handleLogin" 
        :disabled="isLoading || !isFormValid"
      >
        {{ isLoading ? '登录中...' : '登录' }}
      </button>
    </div>
  </div>
</template>

<script>
import authService from '../api/authService';

export default {
  name: 'LoginForm',
  data() {
    return {
      loginIdentity: '',
      password: '',
      loginType: 'phone', // 默认为手机号登录
      errorMessage: '',
      loginTypeError: '',
      isLoading: false
    };
  },
  computed: {
    isFormValid() {
      // 验证表单
      if (this.loginIdentity.trim() === '') {
        return false;
      }
      
      if (this.password.trim() === '') {
        return false;
      }
      
      if (!this.loginType) {
        this.loginTypeError = '请选择登录类型';
        return false;
      }
      
      if (this.loginType !== 'phone' && this.loginType !== 'email') {
        this.loginTypeError = '登录类型必须是"phone"或"email"';
        return false;
      }
      
      this.loginTypeError = '';
      return true;
    }
  },
  methods: {
    async handleLogin() {
      if (!this.isFormValid) {
        return;
      }
      
      this.isLoading = true;
      this.errorMessage = '';
      
      try {
        // 调用登录服务，传入登录类型
        const result = await authService.login(this.loginIdentity, this.password, this.loginType);
        
        if (result.success) {
          // 登录成功
          this.$emit('login-success', result.data);
          
          // 如果需要路由跳转，可以使用下面的代码
          // this.$router.push('/dashboard');
        } else {
          // 登录失败
          this.errorMessage = result.message || '登录失败，请检查您的用户名和密码';
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
.login-form {
  max-width: 400px;
  margin: 0 auto;
  padding: 20px;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

h2 {
  text-align: center;
  margin-bottom: 20px;
  color: #333;
}

.form-group {
  margin-bottom: 15px;
}

label {
  display: block;
  margin-bottom: 5px;
  font-weight: 600;
  color: #555;
}

.required {
  color: #e74c3c;
  margin-left: 2px;
}

input[type="text"],
input[type="password"] {
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
}

input:focus {
  outline: none;
  border-color: #4a9cf6;
  box-shadow: 0 0 0 2px rgba(74, 156, 246, 0.2);
}

.login-type-options {
  display: flex;
  gap: 20px;
}

.radio-label {
  display: flex;
  align-items: center;
  font-weight: normal;
  cursor: pointer;
}

.radio-label input {
  margin-right: 6px;
}

.field-error {
  color: #e74c3c;
  font-size: 12px;
  margin-top: 5px;
}

.form-actions {
  margin-top: 20px;
}

.login-button {
  width: 100%;
  padding: 12px;
  background-color: #4a9cf6;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 16px;
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
  padding: 10px;
  background-color: #fff8f8;
  border-left: 4px solid #e74c3c;
  color: #e74c3c;
  margin-bottom: 15px;
  font-size: 14px;
}
</style> 