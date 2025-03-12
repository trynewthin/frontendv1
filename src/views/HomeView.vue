<script setup>
import RecommendContainer from '../components/recommendation/RecommendContainer.vue';
import UserStatusBar from '../components/auth/UserStatusBar.vue';
import ImageCarousel from '../components/common/ImageCarousel.vue';
import { homeCarouselSlides } from '../data/carouselData';
</script>

<template>
  <div class="home-view">
    <div class="va-navbar app-header">
      <div class="va-navbar__left">
        <h1 class="va-navbar__item">智选车</h1>
      </div>
      <div class="va-navbar__right">
        <UserStatusBar />
      </div>
    </div>
    
    <div class="app-content">
      <!-- 子路由视图 -->
      <router-view></router-view>
    </div>
  </div>
</template>

<style scoped>
/* 特定于首页的样式 */
.home-view {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  width: 100%;
}

.app-header {
  background-color: var(--va-primary);
  color: white;
  display: flex;
  justify-content: space-between;
  padding: 0.5rem 2rem;
  height: 80px; /* 增加导航栏高度 */
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
}

.va-navbar__left,
.va-navbar__right {
  display: flex;
  align-items: center;
  height: 100%;
  padding: 0.5rem 0;
}

.va-navbar__item {
  font-size: 1.5rem;
  font-weight: 600;
  margin: 0;
  padding: 0.5rem 0;
}

.app-content {
  flex: 1;
  padding: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
}

/* 轮播图区域样式 */
.carousel-area {
  width: 100%;
  max-width: 100%;
  margin-top: 0;
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

.mb-5 {
  margin-bottom: 2rem;
}

/* 添加推荐区域的样式 */
.recommendation-area {
  width: 100%;
  max-width: 1200px;
  padding: 0 2rem;
  margin-top: 3rem;
}

/* 测试按钮区域样式 */
.test-button-area {
  width: 100%;
  max-width: 1000px;
  padding: 0 2rem;
}

/* 查看更多车辆按钮样式 */
.view-more-cars {
  width: 100%;
  display: flex;
  justify-content: center;
}

.view-more-button {
  min-width: 180px;
}

@media (max-width: 768px) {
  .app-header {
    padding: 0.3rem 1rem;
    height: 64px; /* 移动端稍微降低高度 */
  }
  
  .va-navbar__left,
  .va-navbar__right {
    padding: 0.3rem 0;
  }
  
  .va-navbar__item {
    font-size: 1.3rem;
    padding: 0.3rem 0;
  }
  
  .recommendation-area,
  .test-button-area {
    padding: 0 1rem;
  }
  
  .carousel-area :deep(.carousel-container) {
    height: 300px !important;
  }
  
  .title-large {
    font-size: 1.6rem;
  }
  
  .system-navigation {
    font-size: 1.2rem;
  }
}
</style> 