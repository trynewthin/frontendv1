<template>
  <div class="admin-dashboard-container">
    <div class="dashboard-header">
      <div class="header-container">
        <div class="header-left">
          <router-link to="/" class="home-button">
            <span class="back-icon">←</span> 返回主页
          </router-link>
        </div>
        <h1 class="page-title">系统管理后台</h1>
      </div>
    </div>
    
    <div class="dashboard-layout">
      <!-- 左侧导航菜单 - 固定在左侧 -->
      <nav class="sidebar-menu">
        <router-link to="/admin/statistics" class="menu-item" exact>
          <span class="menu-text">数据统计</span>
        </router-link>
        <router-link to="/admin/users" class="menu-item">
          <span class="menu-text">用户管理</span>
        </router-link>
        <router-link to="/admin/dealers" class="menu-item">
          <span class="menu-text">经销商管理</span>
        </router-link>
        <router-link to="/admin/content-audit" class="menu-item">
          <span class="menu-text">车辆审核</span>
        </router-link>
      </nav>
      
      <!-- 主内容区 - 固定大小的路由容器 -->
      <div class="content-area">
        <div class="content-container">
          <router-view></router-view>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();

// 当进入后台时自动重定向到数据统计页面
onMounted(() => {
  if (router.currentRoute.value.path === '/admin') {
    router.push('/admin/statistics');
  }
});
</script>

<style scoped>
.admin-dashboard-container {
  position: fixed !important;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  width: 100vw !important;
  height: 100vh !important;
  margin: 0 !important;
  padding: 0 !important;
  background-color: #f5f7fa !important;
  overflow: hidden;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  z-index: 1000;
}

.dashboard-header {
  padding: 1rem 2rem;
  border-bottom: 1px solid #eee;
  background-color: white;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.05);
}

.header-container {
  display: flex;
  align-items: center;
  position: relative;
}

.header-left {
  position: absolute;
  left: 0;
}

.home-button {
  display: flex;
  align-items: center;
  color: var(--va-primary);
  text-decoration: none;
  font-weight: 500;
  transition: opacity 0.2s;
}

.home-button:hover {
  opacity: 0.8;
}

.back-icon {
  margin-right: 4px;
  font-size: 1.2rem;
}

.page-title {
  flex: 1;
  font-size: 1.8rem;
  color: var(--va-primary);
  font-weight: 600;
  margin: 0;
  text-align: center;
}

.dashboard-layout {
  display: flex;
  flex: 1;
  overflow: hidden;
}

.sidebar-menu {
  width: 220px;
  background-color: #f5f5f5;
  padding: 1rem 0;
  overflow-y: auto;
  height: 100%;
  box-shadow: 2px 0 5px rgba(0, 0, 0, 0.05);
  z-index: 10;
}

.menu-item {
  display: block;
  padding: 0.75rem 1.25rem;
  text-decoration: none;
  color: #333;
  font-weight: 500;
  transition: all 0.2s ease;
  border-left: 3px solid transparent;
}

.menu-item:hover {
  background-color: rgba(0, 0, 0, 0.05);
}

.menu-item.router-link-active {
  background-color: var(--va-primary);
  color: white;
  border-left: 3px solid #ffc107;
}

.content-area {
  flex: 1;
  overflow-y: auto;
  background-color: #fff;
  height: 100%;
  padding: 0;
  width: 100%;
}

.content-container {
  padding: 2rem;
  max-width: 1400px;
  margin: 0 auto;
  width: 100%;
  box-sizing: border-box;
}

.dashboard-content {
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.placeholder-text {
  font-size: 1.2rem;
  color: #666;
}

@media (max-width: 768px) {
  .dashboard-header {
    padding: 0.75rem 1rem;
  }
  
  .dashboard-layout {
    flex-direction: column;
    overflow: visible;
  }
  
  .sidebar-menu {
    width: 100%;
    position: static;
    height: auto;
    margin-bottom: 0;
  }
  
  .content-area {
    height: auto;
    min-height: 400px;
  }
  
  .content-container {
    padding: 1rem;
  }
  
  .header-container {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .header-left {
    position: static;
    margin-bottom: 0.5rem;
  }
  
  .page-title {
    text-align: left;
    font-size: 1.5rem;
  }
  
  .admin-dashboard-container {
    position: relative !important;
    height: auto !important;
    min-height: 100vh;
  }
}
</style> 