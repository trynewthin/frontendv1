<template>
  <div class="default-view">
    <!-- 轮播图区域 -->
    <div class="carousel-area">
      <ImageCarousel 
        :slides="homeCarouselSlides" 
        height="500px"
        :autoplay="true"
        :interval="5000"
      />
    </div>
    
    <!-- 添加推荐车辆展示区域 -->
    <div class="recommendation-area mt-5">
      <RecommendContainer 
        :show-home-recommendations="true"
        :show-new-car-recommendations="true"
        :show-hot-recommendations="true"
        :show-preference-recommendations="true"
        :limit="12"
      />
    </div>

    <!-- 分隔线 -->
    <div class="divider"></div>
    
    <!-- 浏览更多按钮区域 -->
    <div class="view-more-section">
      <va-button
        class="view-more-button"
        size="large"
        @click="handleViewMoreClick"
      >
        浏览更多车辆
      </va-button>
      
      <!-- 登录确认对话框 -->
      <LoginConfirmDialog
        v-model="showLoginDialog"
        :return-action="'browse'"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRouter } from 'vue-router';
import { userAuthService } from '@services/user';
import LoginConfirmDialog from '@components/modelwindow/LoginConfirmDialog.vue';
import RecommendContainer from './components/RecommendContainer.vue';
import ImageCarousel from '@/components/common/ImageCarousel.vue';
import { homeCarouselSlides } from '@/data/carouselData';

// 设置响应式变量
const showLoginDialog = ref(false);
const router = useRouter();

// 处理"浏览更多"按钮点击
const handleViewMoreClick = () => {
  // 检查是否已登录
  if (!userAuthService.isLoggedIn()) {
    // 未登录，显示登录确认对话框
    showLoginDialog.value = true;
    return;
  }
  
  // 已登录，导航到车辆搜索页面
  router.push({ name: 'car-search' });
};
</script>

<style scoped>
.default-view {
  width: 100%;
  min-height: 100%;
  position: relative;
  overflow-x: hidden;
}

.carousel-area {
  width: 100vw;
  max-width: 100vw;
  margin-top: 0;
  margin-left: calc(-50vw + 50%);
  margin-right: calc(-50vw + 50%);
  position: relative;
  left: 50%;
  right: 50%;
  transform: translateX(-50%);
}

.recommendation-area {
  width: 100%;
  max-width: 1200px;
  padding: 2rem 0;
  margin-top: 3rem;
  margin-left: auto;
  margin-right: auto;
  border-radius: 8px;
  box-sizing: border-box;
  display: flex;
  justify-content: center;
}

/* 推荐区域内部元素样式 */
.recommendation-area > div {
  width: 100%;
  max-width: 1120px;
}

/* 深色主题适配 */
:root[data-theme="dark"] .recommendation-area {
  background-color: rgba(255, 255, 255, 0.05);
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.2);
}

@media (max-width: 768px) {
  .recommendation-area {
    padding: 1rem 0;
    margin: 1rem auto;
    width: calc(100% - 2rem);
  }
  
  .recommendation-area > div {
    max-width: 100%;
  }
  
  .carousel-area :deep(.carousel-container) {
    height: 300px !important;
  }
}

/* 分隔线样式 */
.divider {
  width: 90%;
  height: 1px;
  background-color: #333;
  margin: 2rem auto;
  max-width: 1120px;
  position: relative;
  left: 50%;
  transform: translateX(-50%);
}

:root[data-theme="dark"] .divider {
  background-color: #FFD700;
}

/* 浏览更多按钮区域样式 */
.view-more-section {
  width: 100%;
  max-width: 1120px;
  margin: 2rem auto 4rem;
  display: flex;
  justify-content: center;
  padding: 0;
  position: relative;
  left: 50%;
  transform: translateX(-50%);
}

.view-more-button {
  min-width: 180px !important;
  font-size: 1.1rem !important;
  height: 48px !important;
}

@media (max-width: 768px) {
  .divider {
    margin: 1.5rem auto;
  }
  
  .view-more-section {
    margin: 1.5rem auto 3rem;
    padding: 0 1rem;
  }
  
  .view-more-button {
    min-width: 160px !important;
    height: 44px !important;
    font-size: 1rem !important;
  }
}
</style> 