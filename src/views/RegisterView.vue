<template>
  <div class="register-view">
    <div class="header">
      <h1>用户注册</h1>
      <router-link to="/" class="home-link">返回首页</router-link>
    </div>
    
    <div class="content">
      <register-component @register-success="handleRegisterSuccess" />
    </div>
  </div>
</template>

<script>
import RegisterComponent from '../components/auth/RegisterComponent.vue';

export default {
  name: 'RegisterView',
  components: {
    RegisterComponent
  },
  methods: {
    handleRegisterSuccess(data) {
      console.log('注册成功:', data);
      // 可以在这里添加注册成功后的逻辑，比如跳转到登录页面
      // this.$router.push('/login');
    }
  }
};
</script>

<style scoped>
.register-view {
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