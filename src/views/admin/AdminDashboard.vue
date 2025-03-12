<template>
  <div class="admin-dashboard-container">
    <div class="dashboard-header">
      <h1 class="page-title">系统管理后台</h1>
    </div>
    <div class="dashboard-content">
      <p class="placeholder-text">管理员后台内容将在这里显示</p>
    </div>
  </div>
</template>

<script setup>
// 管理员后台页面逻辑将在这里实现
</script>

<style scoped>
.admin-dashboard-container {
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
}

.dashboard-header {
  margin-bottom: 2rem;
  border-bottom: 1px solid #eee;
  padding-bottom: 1rem;
}

.page-title {
  font-size: 2rem;
  color: var(--va-primary);
  font-weight: 600;
}

.dashboard-content {
  min-height: 400px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.placeholder-text {
  font-size: 1.2rem;
  color: #666;
}

@media (max-width: 768px) {
  .admin-dashboard-container {
    padding: 1rem;
  }
  
  .page-title {
    font-size: 1.5rem;
  }
}
</style> 