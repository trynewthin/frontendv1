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
        :limit="4"
      />
      
      <!-- 添加浏览更多按钮 -->
      <div class="view-more-cars mt-4 mb-4">
        <va-button
          color="primary"
          :to="{ name: 'car-search' }"
          size="large"
          class="view-more-button"
        >
          浏览更多车辆
        </va-button>
      </div>
    </div>
  </div>
</template>

<script setup>
import RecommendContainer from '../../components/recommendation/RecommendContainer.vue';
import ImageCarousel from '../../components/common/ImageCarousel.vue';
import { homeCarouselSlides } from '../../data/carouselData';
</script>

<style scoped>
.default-view {
  width: 100%;
}

.carousel-area {
  width: 100%;
  max-width: 100%;
  margin-top: 0;
}

.recommendation-area {
  width: 100%;
  max-width: 1200px;
  padding: 0 2rem;
  margin-top: 3rem;
  margin-left: auto;
  margin-right: auto;
}

@media (max-width: 768px) {
  .recommendation-area {
    padding: 0 1rem;
  }
  
  .carousel-area :deep(.carousel-container) {
    height: 300px !important;
  }
}

/* 浏览更多按钮样式 */
.view-more-cars {
  width: 100%;
  display: flex;
  justify-content: center;
  margin-top: 2rem;
}

.view-more-button {
  min-width: 180px;
}
</style> 