<template>
  <div class="login-view">
    <div class="header">
      <h1>用户登录</h1>
      <router-link to="/" class="home-link">返回首页</router-link>
    </div>
    
    <div class="content">
      <login-component @login-success="handleLoginSuccess" @logout-success="handleLogoutSuccess" />
    </div>
  </div>
</template>

<script>
import LoginComponent from '../components/auth/LoginComponent.vue';

export default {
  name: 'LoginView',
  components: {
    LoginComponent
  },
  methods: {
    handleLoginSuccess(data) {
      console.log('登录成功:', data);
      // 可以在这里添加登录成功后的逻辑，比如跳转到首页
      this.$router.push('/');
    },
    handleLogoutSuccess() {
      console.log('注销成功');
      // 可以在这里添加注销成功后的逻辑
    }
  }
};
</script>

<style scoped>
.login-view {
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
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 2rem;
  background-color: white;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  width: 100%;
  box-sizing: border-box;
}

h1 {
  margin: 0;
  color: #333;
  font-size: 1.8rem;
}

.home-link {
  padding: 8px 16px;
  background-color: #f5f5f5;
  color: #333;
  border-radius: 4px;
  text-decoration: none;
  font-weight: 500;
  transition: background-color 0.2s;
}

.home-link:hover {
  background-color: #e0e0e0;
}

.content {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: flex-start;
  padding: 2rem;
  width: 100%;
  box-sizing: border-box;
  overflow-y: auto;
}

@media (max-width: 768px) {
  .header {
    padding: 1rem;
    flex-direction: column;
    gap: 1rem;
    text-align: center;
  }
  
  .content {
    padding: 1rem;
  }
}
</style> 