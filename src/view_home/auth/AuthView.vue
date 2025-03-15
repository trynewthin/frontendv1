<template>
  <div class="auth-view">
    <!-- 顶部标题栏 -->
    <div class="header-container">
      <bheader 
        :currentMode="currentMode"
        :modes="[
          { label: '登录', value: 'login' },
          { label: '注册', value: 'register' }
        ]"
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
    
    <!-- 使用新的背景组件 -->
    <animated-background 
      :showTitle="true" 
      title="智选车 zhixuanche" 
      :showRouteText="true"
      :routeText="currentMode === 'login' ? '登录' : '注册'"
    />
  </div>
</template>

<script>
import LoginComponent from './components/LoginComponent.vue';
import RegisterComponent from './components/RegisterComponent.vue';
import Bheader from '@components/header/bheader.vue';
import AnimatedBackground from '@components/background/AnimatedBackground.vue';

export default {
  name: 'AuthView',
  components: {
    LoginComponent,
    RegisterComponent,
    Bheader,
    AnimatedBackground
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

.header-container {
  width: 100%;
  display: flex;
  justify-content: center;
  padding: 0;
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
  height: 10%;
  width: 100%;
  max-width: 800px;
}

@media (max-width: 768px) {
  .header-container {
    padding: 0;
  }
  
  .content {
    padding: 0 1rem 1rem;
  }
}

/* 深色模式样式 */
:root[data-theme="dark"] .auth-view {
  background-color: #121212;
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
</style> 