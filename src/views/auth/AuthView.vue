<template>
  <div class="auth-view">
    <!-- 顶部标题栏 -->
    <div class="header-container">
      <auth-mode-toggle 
        :current-mode="currentMode"
        @set-mode="setMode"
        @toggle-mode="toggleMode"
        @go-home="goToHome"
      />
    </div>
    
    <!-- 主内容区域 -->
    <div class="content">
      <div class="auth-container">
        <!-- 登录组件 -->
        <login-component 
          v-if="currentMode === 'login'" 
          @login-success="handleLoginSuccess"
          @switch-mode="setMode('register')"
        />
        
        <!-- 注册组件 -->
        <register-component 
          v-if="currentMode === 'register'" 
          @register-success="handleRegisterSuccess"
          @switch-mode="setMode('login')"
        />
      </div>
    </div>
    
    <!-- 底部平台名称 -->
    <div class="platform-title">
      <h1>智选车平台</h1>
    </div>
    
    <!-- 背景动画元素 -->
    <div class="bg-animation-container">
      <div class="bg-animation-element"></div>
    </div>
  </div>
</template>

<script>
import LoginComponent from './components/LoginComponent.vue';
import RegisterComponent from './components/RegisterComponent.vue';
import AuthModeToggle from './components/AuthModeToggle.vue';

export default {
  name: 'AuthView',
  components: {
    LoginComponent,
    RegisterComponent,
    AuthModeToggle
  },
  data() {
    return {
      currentMode: 'login' // 默认显示登录模式
    };
  },
  created() {
    // 根据当前路由路径设置初始模式
    const path = this.$route.path;
    if (path.includes('/register') || path.includes('auth/register')) {
      this.currentMode = 'register';
    } else {
      this.currentMode = 'login';
    }
  },
  methods: {
    setMode(mode) {
      this.currentMode = mode;
      
      // 更新路由路径，但不重新加载
      const newPath = mode === 'login' ? '/auth/login' : '/auth/register';
      if (!this.$route.path.endsWith(newPath)) {
        this.$router.replace({ path: newPath });
      }
    },
    
    toggleMode() {
      this.setMode(this.currentMode === 'login' ? 'register' : 'login');
    },
    
    goToHome() {
      this.$router.push('/');
    },
    
    handleLoginSuccess(data) {
      console.log('登录成功:', data);
      this.$router.push('/');
    },
    
    handleRegisterSuccess(data) {
      console.log('注册成功:', data);
      // 注册成功后切换到登录模式
      this.setMode('login');
    }
  }
};
</script>

<style scoped>
.auth-view {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  width: 100%;
  background-color: #f5f7fa;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  overflow-y: auto;
  transition: background-color 0.6s ease;
}

/* 背景动画容器 */
.bg-animation-container {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: -1;
  overflow: hidden;
  pointer-events: none;
}

.bg-animation-element {
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  background: radial-gradient(circle at center, rgba(255, 255, 255, 0.2) 0%, rgba(255, 255, 255, 0) 70%);
  opacity: 0;
  transition: opacity 0.8s ease;
  animation: rotateBg 25s linear infinite;
}

@keyframes rotateBg {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

.header-container {
  width: 100%;
  display: flex;
  justify-content: center;
  padding: 20px 0;
  position: sticky;
  top: 0;
  z-index: 10;
}

.content {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: flex-start;
  padding: 0 2rem 2rem;
  width: 100%;
  box-sizing: border-box;
  overflow-y: auto;
}

.auth-container {
  width: 100%;
  max-width: 800px;
}

@media (max-width: 768px) {
  .header-container {
    padding: 15px 0;
  }
  
  .content {
    padding: 0 1rem 1rem;
  }
}

/* 深色模式样式 */
:root[data-theme="dark"] .auth-view {
  background-color: #121212;
}

:root[data-theme="dark"] .bg-animation-element {
  background: radial-gradient(circle at center, rgba(100, 100, 255, 0.15) 0%, rgba(0, 0, 0, 0) 70%);
  opacity: 0.8;
  animation: rotateBgDark 30s linear infinite;
}

@keyframes rotateBgDark {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

/* 浅色模式特定动画 */
:root[data-theme="light"] .auth-view .bg-animation-element {
  background: radial-gradient(circle at center, rgba(255, 255, 255, 0.4) 0%, rgba(255, 255, 255, 0) 60%);
  opacity: 0.6;
}

/* 主题切换时的动画效果 */
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

:root[data-theme="dark"] .auth-view {
  animation: fadeIn 0.8s ease-out;
}

:root[data-theme="light"] .auth-view {
  animation: fadeIn 0.8s ease-out;
}

/* 平台名称样式 */
.platform-title {
  position: fixed;
  bottom: 40px;
  left: 0;
  right: 0;
  text-align: center;
  z-index: 1;
}

.platform-title h1 {
  font-size: 60px;
  font-weight: 700;
  color: white;
  text-shadow: none;
  margin: 0;
  padding: 0;
  letter-spacing: 2px;
  opacity: 0.6;
}

/* 在深色模式下添加阴影和更高的不透明度 */
:root[data-theme="dark"] .platform-title h1 {
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
  opacity: 0.9;
}

@media (max-width: 768px) {
  .platform-title h1 {
    font-size: 36px;
  }
}
</style> 