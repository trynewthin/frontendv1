<script setup>
</script>

<template>
  <div class="home-view">
    <div class="va-navbar app-header">
      <div class="va-navbar__left">
        <h1 class="va-navbar__item">智选车</h1>
      </div>
    </div>
    
    <div class="app-content">
      <div class="va-card mx-auto mt-5">
        <div class="va-card__title title-large">欢迎使用智选车平台</div>
        
        <div class="va-card__content">
          <p>智选车是一个专业的汽车选购平台，为您提供全面的汽车信息和便捷的选车体验。</p>
        </div>
        
        <div class="va-card__content">
          <h3 class="system-navigation">系统导航</h3>
          <div class="center mt-3">
            <va-button
              color="primary" 
              to="/test" 
              size="large"
            >
              功能测试中心
            </va-button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* 特定于首页的样式 */
.home-view {
  display: flex;
  flex-direction: column;
  height: 100vh;
  width: 100%;
}

.app-header {
  background-color: var(--va-primary);
  color: white;
}

.app-content {
  flex: 1;
  padding: 2rem;
  display: flex;
  justify-content: center;
  align-items: flex-start;
}

.va-card {
  width: 100%;
  max-width: 1000px;
}

.title-large {
  font-size: 1.8rem;
  font-weight: 600;
}

.system-navigation {
  font-size: 1.4rem;
  font-weight: 500;
  margin-bottom: 1.5rem;
  color: var(--va-text-primary);
}

.center {
  display: flex;
  justify-content: center;
}

.mt-3 {
  margin-top: 1rem;
}

.mx-auto {
  margin-left: auto;
  margin-right: auto;
}

.mt-5 {
  margin-top: 2rem;
}

@media (max-width: 768px) {
  .app-content {
    padding: 1.5rem 1rem;
  }
  
  .title-large {
    font-size: 1.6rem;
  }
  
  .system-navigation {
    font-size: 1.2rem;
  }
}
</style> 