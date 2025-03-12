<template>
  <div class="test-home">
    <div class="header">
      <h1>测试功能导航</h1>
      <router-link to="/" class="back-link">返回主页</router-link>
    </div>
    
    <div class="content">
      <div class="test-links-container">
        <h2>API 测试页面</h2>
        <h2>用户模块</h2>
        <div class="test-links">
          <router-link to="/test/login" class="test-link">
            <div class="test-card">
              <h3>登录功能测试</h3>
              <p>测试用户登录和注销功能，检验API响应</p>
            </div>
          </router-link>
          
          <router-link to="/test/register" class="test-link">
            <div class="test-card">
              <h3>注册功能测试</h3>
              <p>测试用户注册功能，支持普通用户和经销商注册</p>
            </div>
          </router-link>

          <router-link to="/test/recommendation" class="test-link">
            <div class="test-card">
              <h3>推荐服务测试</h3>
              <p>测试系统推荐功能，包括偏好推荐、热门推荐、新车推荐等</p>
            </div>
          </router-link>
          
          <router-link to="/test/car" class="test-link">
            <div class="test-card">
              <h3>车辆服务测试</h3>
              <p>测试车辆查询、详情获取、按品牌/类别/价格筛选等功能</p>
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
  justify-content: center;
  align-items: flex-start;
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

.test-links-container {
  width: 100%;
  background-color: white;
  padding: 1.5rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  box-sizing: border-box;
  overflow: visible;
  height: auto;
}

h2 {
  margin-top: 0;
  margin-bottom: 1.5rem;
  color: #444;
  font-size: 1.4rem;
  border-bottom: 1px solid #eee;
  padding-bottom: 0.5rem;
  width: auto;
}

.test-links {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
  width: 100%;
  box-sizing: border-box;
}

.test-link {
  text-decoration: none;
  color: inherit;
  width: 100%;
  box-sizing: border-box;
}

.test-card {
  background-color: #f9f9f9;
  border-radius: 8px;
  padding: 1.5rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  transition: transform 0.2s, box-shadow 0.2s;
  height: 100%;
  width: 100%;
  box-sizing: border-box;
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
  width: auto;
}

p {
  margin-bottom: 0;
  color: #666;
  line-height: 1.5;
  width: auto;
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
  
  .test-links {
    grid-template-columns: 1fr;
  }
}
</style> 