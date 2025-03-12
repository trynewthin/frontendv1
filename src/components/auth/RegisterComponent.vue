<template>
  <div class="register-component">
    <div class="register-container">
      <h2 class="register-title">用户注册</h2>
      
      <div v-if="errorMessage" class="error-message">
        {{ errorMessage }}
      </div>
      
      <div class="form-group">
        <label for="username">用户名</label>
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
      
      <div class="form-group">
        <label for="password">密码</label>
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
      
      <div class="form-group">
        <label for="confirmPassword">确认密码</label>
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
      
      <div class="form-group">
        <label for="email">电子邮箱</label>
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
      
      <div class="form-group">
        <label for="phone">手机号</label>
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
      
      <div class="form-group user-type">
        <label>用户类型</label>
        <div class="user-type-options">
          <label class="radio-option">
            <input 
              type="radio" 
              v-model="userType" 
              value="NORMAL_USER" 
              :disabled="isLoading"
            />
            <span>普通用户</span>
          </label>
          <label class="radio-option">
            <input 
              type="radio" 
              v-model="userType" 
              value="DEALER" 
              :disabled="isLoading"
            />
            <span>经销商</span>
          </label>
        </div>
        <div v-if="userTypeError" class="field-error">
          {{ userTypeError }}
        </div>
      </div>
      
      <div class="register-actions">
        <button 
          class="register-button" 
          @click="handleRegister" 
          :disabled="isLoading || !isFormValid"
        >
          {{ isLoading ? '注册中...' : '注册' }}
        </button>
      </div>
      
      <div class="register-options">
        <router-link to="/login" class="login-link">已有账号？去登录</router-link>
      </div>
    </div>
    
    <div v-if="registerSuccess" class="register-status">
      <div class="status-header">
        <h3>注册成功</h3>
      </div>
      
      <div class="success-info">
        <p>您的账号已成功注册！</p>
        <div class="info-item">
          <span class="info-label">用户名:</span>
          <span>{{ registeredUser?.username || username }}</span>
        </div>
        
        <div class="info-item">
          <span class="info-label">用户类型:</span>
          <span>{{ userType === 'NORMAL_USER' ? '普通用户' : '经销商' }}</span>
        </div>
        
        <div class="action-buttons">
          <router-link to="/login" class="go-login-button">
            去登录
          </router-link>
          <button @click="resetForm" class="reset-button">
            继续注册
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import authService from '../../api/authService';

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
      
      isLoading: false,
      registerSuccess: false,
      registeredUser: null
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
      this.registerSuccess = false;
      this.registeredUser = null;
    },
    
    async handleRegister() {
      if (!this.isFormValid) {
        return;
      }
      
      this.isLoading = true;
      this.errorMessage = '';
      
      try {
        // 构建用户数据
        const userData = {
          username: this.username,
          password: this.password,
          email: this.email,
          userType: this.userType
        };
        
        // 如果提供了手机号，添加到数据中
        if (this.phone) {
          userData.phone = this.phone;
        }
        
        // 调用注册服务
        const result = await authService.register(userData);
        
        if (result.success) {
          // 注册成功
          this.registerSuccess = true;
          this.registeredUser = result.data;
          this.$emit('register-success', result.data);
        } else {
          // 注册失败
          this.errorMessage = result.message || '注册失败，请检查您的输入';
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
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
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

label {
  display: block;
  margin-bottom: 8px;
  font-weight: 500;
  color: #333;
  font-size: 16px;
}

input[type="text"],
input[type="password"],
input[type="email"] {
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

.user-type-options {
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

.register-actions {
  margin-top: 25px;
}

.register-button {
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

.register-button:hover:not(:disabled) {
  background-color: #3a8ce6;
}

.register-button:disabled {
  background-color: #a7c7e7;
  cursor: not-allowed;
}

.field-error {
  color: #e74c3c;
  font-size: 14px;
  margin-top: 5px;
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

.register-options {
  display: flex;
  justify-content: center;
  margin-top: 20px;
  font-size: 14px;
}

.login-link {
  color: #4a9cf6;
  text-decoration: none;
  transition: color 0.3s;
}

.login-link:hover {
  color: #3a8ce6;
  text-decoration: underline;
}

/* 注册成功状态样式 */
.register-status {
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
  padding: 20px;
}

.status-header {
  margin-bottom: 15px;
  text-align: center;
}

.status-header h3 {
  margin: 0;
  font-size: 20px;
  color: #28a745;
}

.success-info {
  background-color: #f8f9fa;
  padding: 20px;
  border-radius: 6px;
  text-align: center;
}

.success-info p {
  margin-bottom: 20px;
  font-size: 16px;
  color: #333;
}

.info-item {
  display: flex;
  justify-content: center;
  margin-bottom: 10px;
}

.info-label {
  font-weight: 500;
  margin-right: 10px;
  color: #555;
}

.action-buttons {
  display: flex;
  justify-content: center;
  gap: 15px;
  margin-top: 25px;
}

.go-login-button {
  padding: 10px 20px;
  background-color: #4a9cf6;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  text-decoration: none;
  transition: background-color 0.2s;
}

.go-login-button:hover {
  background-color: #3a8ce6;
}

.reset-button {
  padding: 10px 20px;
  background-color: #f8f9fa;
  color: #333;
  border: 1px solid #ddd;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  transition: background-color 0.2s;
}

.reset-button:hover {
  background-color: #e9ecef;
}

@media (max-width: 768px) {
  .register-container {
    padding: 20px;
  }
  
  .user-type-options {
    flex-direction: column;
    gap: 10px;
  }
  
  .action-buttons {
    flex-direction: column;
    gap: 10px;
  }
}
</style> 