<template>
  <div class="register-form">
    <h2>用户注册</h2>
    
    <div v-if="errorMessage" class="error-message">
      {{ errorMessage }}
    </div>
    
    <div class="form-group">
      <label for="username">用户名 <span class="required">*</span></label>
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
      <label for="password">密码 <span class="required">*</span></label>
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
      <label for="confirmPassword">确认密码 <span class="required">*</span></label>
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
      <label for="email">电子邮箱 <span class="required">*</span></label>
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
    
    <div class="form-group">
      <label>用户类型 <span class="required">*</span></label>
      <div class="user-type-options">
        <label class="radio-label">
          <input 
            type="radio" 
            v-model="userType" 
            value="NORMAL_USER" 
            :disabled="isLoading"
          />
          普通用户
        </label>
        <label class="radio-label">
          <input 
            type="radio" 
            v-model="userType" 
            value="DEALER" 
            :disabled="isLoading"
          />
          经销商
        </label>
      </div>
      <div v-if="userTypeError" class="field-error">
        {{ userTypeError }}
      </div>
    </div>
    
    <div class="form-actions">
      <button 
        class="register-button" 
        @click="handleRegister" 
        :disabled="isLoading || !isFormValid"
      >
        {{ isLoading ? '注册中...' : '注册' }}
      </button>
    </div>
  </div>
</template>

<script>
import authService from '../api/authService';

export default {
  name: 'RegisterForm',
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
.register-form {
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
input[type="password"],
input[type="email"] {
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

.user-type-options {
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

.register-button {
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

.register-button:hover:not(:disabled) {
  background-color: #3a8ce6;
}

.register-button:disabled {
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