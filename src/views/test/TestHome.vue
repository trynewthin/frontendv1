<template>
  <div class="test-home">
    <div class="header">
      <h1>测试功能导航</h1>
      <router-link to="/" class="back-link">返回主页</router-link>
    </div>
    
    <div class="content">
      <div class="test-links-container">
        <h2>API 测试页面</h2>
        <div class="test-links">
          <router-link to="/test/login" class="test-link">
            <div class="test-card">
              <h3>登录功能测试</h3>
              <p>测试用户登录和注销功能，检验API响应</p>
            </div>
          </router-link>
          
          <!-- 可以在此处添加更多测试页面链接 -->
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'TestHome'
}
</script>

<style scoped>
.test-home {
  display: flex;
  flex-direction: column;
  min-height: 100%;
  width: 100%;
  background-color: #f5f7fa;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 2rem;
  background-color: white;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
}

.content {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: flex-start;
  width: 100%;
}

h1 {
  margin: 0;
  color: #333;
  font-size: 1.8rem;
}

.back-link {
  padding: 8px 16px;
  background-color: #f5f5f5;
  color: #333;
  border-radius: 4px;
  text-decoration: none;
  font-weight: 500;
  transition: background-color 0.2s;
}

.back-link:hover {
  background-color: #e0e0e0;
}

.test-links-container {
  width: 100%;
  max-width: 1200px;
  background-color: white;
  padding: 1.5rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
}

h2 {
  margin-top: 0;
  margin-bottom: 1.5rem;
  color: #444;
  font-size: 1.4rem;
  border-bottom: 1px solid #eee;
  padding-bottom: 0.5rem;
}

.test-links {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
}

.test-link {
  text-decoration: none;
  color: inherit;
}

.test-card {
  background-color: #f9f9f9;
  border-radius: 8px;
  padding: 1.5rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  transition: transform 0.2s, box-shadow 0.2s;
  height: 100%;
}

.test-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
}

h3 {
  margin-top: 0;
  color: #4a9cf6;
  font-size: 1.2rem;
  margin-bottom: 0.5rem;
}

p {
  margin-bottom: 0;
  color: #666;
  line-height: 1.5;
}

@media (max-width: 768px) {
  .header {
    padding: 1rem;
    flex-direction: column;
    gap: 1rem;
    text-align: center;
  }
  
  .test-links-container {
    padding: 1rem;
  }
}
</style> 