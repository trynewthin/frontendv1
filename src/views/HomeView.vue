<script setup>
import HelloWorld from '../components/HelloWorld.vue'
</script>

<template>
  <div class="home-view">
    <div class="content">
      <div class="home">
        <h1>首页</h1>
        <HelloWorld msg="欢迎来到Vue 3应用" />
        
        <div class="links">
          <h2>导航链接</h2>
          <router-link to="/test" class="nav-link">功能测试中心</router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.home-view {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100%;
  width: 100%;
  background: linear-gradient(to bottom, #f5f7fa, #e4e7eb);
}

.content {
  width: 100%;
  max-width: 1200px;
  padding: 2rem;
}

.home {
  text-align: center;
  background-color: white;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
}

h1 {
  margin-bottom: 2rem;
  color: #333;
}

.links {
  margin-top: 2rem;
  padding: 1rem;
  background-color: #f5f5f5;
  border-radius: 8px;
}

h2 {
  margin: 0 0 1rem 0;
  color: #555;
}

.nav-link {
  display: inline-block;
  margin-top: 0.5rem;
  padding: 0.7rem 1.2rem;
  background-color: #4a9cf6;
  color: white;
  text-decoration: none;
  border-radius: 4px;
  font-weight: bold;
  transition: background-color 0.3s;
}

.nav-link:hover {
  background-color: #3a8ce6;
}

@media (max-width: 768px) {
  .content {
    padding: 1rem;
  }
  
  .home {
    padding: 1.5rem;
  }
}
</style> 