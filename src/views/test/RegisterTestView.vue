<template>
  <div class="register-test-view">
    <div class="header">
      <h1>注册测试页面</h1>
      <router-link to="/test" class="back-link">返回测试导航</router-link>
    </div>
    
    <div class="content">
      <div class="test-container">
        <!-- 注册测试区域 -->
        <div class="tabs-container">
          <div class="tabs">
            <button 
              class="tab-button active"
            >
              注册测试
            </button>
          </div>
          
          <!-- 注册测试 -->
          <div class="tab-content">
            <div class="register-container">
              <register-form @register-success="handleRegisterSuccess" />
            </div>
            
            <div class="results-section">
              <div class="result-container" v-if="registerResult">
                <h3>注册结果</h3>
                <pre>{{ registerResultJson }}</pre>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import RegisterForm from '../../components/RegisterForm.vue';

export default {
  name: 'RegisterTestView',
  components: {
    RegisterForm
  },
  data() {
    return {
      registerResult: null
    };
  },
  computed: {
    registerResultJson() {
      return JSON.stringify(this.registerResult, null, 2);
    }
  },
  methods: {
    handleRegisterSuccess(data) {
      console.log('注册成功回调:', data);
      this.registerResult = data;
    }
  }
};
</script>

<style scoped>
.register-test-view {
  display: flex;
  flex-direction: column;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  width: 100vw;
  height: 100vh;
  margin: 0;
  padding: 0;
  background-color: #f5f7fa;
  overflow-y: auto;
  box-sizing: border-box;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 2rem;
  background-color: white;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  box-sizing: border-box;
  width: 100%;
}

.content {
  flex: 1;
  display: flex;
  width: 100%;
  padding: 1rem;
  box-sizing: border-box;
  overflow: auto;
}

h1 {
  margin: 0;
  color: #333;
  font-size: 1.8rem;
  width: auto;
}

h3 {
  margin-top: 0;
  margin-bottom: 15px;
  color: #333;
  width: auto;
}

.back-link {
  padding: 8px 16px;
  background-color: #f5f5f5;
  color: #333;
  border-radius: 4px;
  text-decoration: none;
  font-weight: 500;
  transition: background-color 0.2s;
  width: auto;
}

.back-link:hover {
  background-color: #e0e0e0;
}

.test-container {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding: 0;
  box-sizing: border-box;
}

/* 标签页 */
.tabs-container {
  width: 100%;
  padding: 0 1rem;
  box-sizing: border-box;
}

.tabs {
  display: flex;
  border-bottom: 1px solid #dee2e6;
  margin-bottom: 20px;
  width: 100%;
  box-sizing: border-box;
}

.tab-button {
  padding: 10px 20px;
  background-color: transparent;
  border: none;
  cursor: pointer;
  font-size: 16px;
  color: #6c757d;
  transition: all 0.2s;
  position: relative;
  width: auto;
}

.tab-button:hover {
  color: #495057;
}

.tab-button.active {
  color: #4a9cf6;
  font-weight: 500;
}

.tab-button.active:after {
  content: '';
  position: absolute;
  bottom: -1px;
  left: 0;
  right: 0;
  height: 2px;
  background-color: #4a9cf6;
}

.tab-content {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  width: 100%;
  box-sizing: border-box;
}

.register-container {
  flex: 1;
  min-width: 300px;
  box-sizing: border-box;
}

.test-action {
  margin: 20px 0;
  width: 100%;
}

.results-section {
  flex: 1;
  min-width: 300px;
  display: flex;
  flex-direction: column;
  gap: 20px;
  box-sizing: border-box;
}

.result-container {
  background-color: white;
  padding: 1.5rem;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  border-radius: 4px;
  width: 100%;
  box-sizing: border-box;
}

pre {
  background-color: #f0f2f5;
  padding: 15px;
  border-radius: 4px;
  overflow-x: auto;
  color: #333;
  font-size: 14px;
  line-height: 1.5;
  width: 100%;
  box-sizing: border-box;
}

@media (max-width: 768px) {
  .header {
    padding: 1rem;
    flex-direction: column;
    gap: 1rem;
    text-align: center;
  }
  
  .tabs {
    flex-direction: column;
    border-bottom: none;
  }
  
  .tab-button {
    border-bottom: 1px solid #dee2e6;
    text-align: left;
  }
  
  .tab-button.active:after {
    height: 100%;
    width: 3px;
    top: 0;
    bottom: 0;
    left: 0;
    right: auto;
  }
  
  .tab-content {
    flex-direction: column;
  }
}
</style> 