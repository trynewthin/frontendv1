<template>
  <div class="car-detail-view" :class="{ 'dark-theme': currentTheme === 'dark' }">
    <!-- 添加aheader组件 -->
    <aheader title="车辆详情">
      <template #left-content>
        <BackButton />
      </template>
      <template #right-content>
        <!-- 添加主题切换按钮 -->
        <ThemeToggle />
      </template>
    </aheader>
    
    <div class="detail-container">
      <div v-if="loading" class="loading-state">
        <va-inner-loading :loading="true">
          <div class="loading-placeholder"></div>
        </va-inner-loading>
      </div>
      
      <div v-else-if="error" class="error-state">
        <p>{{ error }}</p>
        <BackButton />
      </div>
      
      <div v-else-if="carBasic" class="car-info">
        <!-- 使用图片轮播组件 -->
        <CarImageGallery 
          :images="rawImages"
          :images-loading="imagesLoading"
          :car-brand="carBasic.brand"
          :car-model="carBasic.model"
        />
        
        <!-- 使用组件显示结构 -->
        <div class="info-columns">
          <!-- 左侧：基本信息组件 -->
          <div class="left-column">
            <CarBasicInfo :car-basic="carBasic" />
            <CarActionButtons 
              :car-basic="carBasic"
              :car-id="carId"
            />
          </div>
          
          <!-- 右侧：详细参数组件 -->
          <div class="right-column">
            <CarDetailInfo :car-detail="carDetail" />
          </div>
        </div>
      </div>
      
      <div v-else class="empty-state">
        <p>未找到车辆信息</p>
        <BackButton />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed, watch, provide } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useToast } from 'vuestic-ui';
import carService from '@/api/carService';
import aheader from '@/components/header/aheader.vue';
import BackButton from '@/components/button/BackButton.vue';
import ThemeToggle from '@/components/button/ThemeToggle.vue';

// 导入新组件
import CarImageGallery from './components/CarImageGallery.vue';
import CarBasicInfo from './components/CarBasicInfo.vue';
import CarDetailInfo from './components/CarDetailInfo.vue';
import CarActionButtons from './components/CarActionButtons.vue';

const route = useRoute();
const router = useRouter();
const { init: initToast } = useToast();

const carId = ref(route.params.id);
const carData = ref(null);
const carBasic = ref(null);
const carDetail = ref(null);
const rawImages = ref([]);
const loading = ref(true);
const error = ref(null);
const imagesLoading = ref(false);
const currentImageIndex = ref(0);

// 获取车辆详情
const fetchCarDetail = async () => {
  loading.value = true;
  error.value = null;
  
  try {
    const response = await carService.getCarDetail(carId.value);
    
    if (response.success && response.data) {
      carData.value = response.data;
      carBasic.value = response.data.basic || null;
      carDetail.value = response.data.detail || null;
      
      // 获取车辆图片
      if (carBasic.value) {
        getCarImages();
      }
    } else {
      error.value = '获取车辆信息失败';
    }
  } catch (err) {
    error.value = '获取车辆信息时发生错误';
  } finally {
    loading.value = false;
  }
};

// 获取车辆图片
const getCarImages = async () => {
  imagesLoading.value = true;
  
  try {
    const response = await carService.getCarImages(carId.value);
    
    if (response.success && response.data) {
      rawImages.value = response.data || [];
    } else {
      initToast({
        message: '获取车辆图片失败',
        color: 'warning'
      });
    }
  } catch (err) {
    initToast({
      message: '获取车辆图片时发生错误',
      color: 'warning'
    });
  } finally {
    imagesLoading.value = false;
  }
};

// 格式化价格显示
const formatPrice = (price) => {
  if (!price && price !== 0) return '暂无价格';
  return price.toLocaleString('zh-CN');
};

// 格式化车辆状态
const formatStatus = (status) => {
  const statusMap = {
    0: '未上架',
    1: '在售中',
    2: '已售出',
    3: '已下架'
  };
  return statusMap[status] || '未知状态';
};

// 格式化日期时间
const formatDateTime = (dateTimeStr) => {
  if (!dateTimeStr) return '暂无数据';
  try {
    const date = new Date(dateTimeStr);
    return date.toLocaleString('zh-CN');
  } catch (err) {
    return dateTimeStr;
  }
};

// 处理图片URL，添加前缀
const processedImages = computed(() => {
  if (!rawImages.value || rawImages.value.length === 0) return [];
  
  return rawImages.value.map(img => {
    const imgCopy = { ...img };
    
    // 为imageUrl添加前缀
    if (imgCopy.imageUrl) {
      if (imgCopy.imageUrl.startsWith('http')) {
        imgCopy.fullUrl = imgCopy.imageUrl;
      } else {
        // 添加API基础URL前缀
        imgCopy.fullUrl = `${import.meta.env.VITE_API_IMAGE_URL || 'http://localhost:8090'}${imgCopy.imageUrl}`;
      }
    } else if (imgCopy.url) {
      // 如果有url字段而不是imageUrl
      if (imgCopy.url.startsWith('http')) {
        imgCopy.fullUrl = imgCopy.url;
      } else {
        imgCopy.fullUrl = `${import.meta.env.VITE_API_IMAGE_URL || 'http://localhost:8090'}${imgCopy.url}`;
      }
    } else if (imgCopy.fullUrl) {
      // 已经有fullUrl的情况
      if (!imgCopy.fullUrl.startsWith('http')) {
        imgCopy.fullUrl = `${import.meta.env.VITE_API_IMAGE_URL || 'http://localhost:8090'}${imgCopy.fullUrl}`;
      }
    } else {
      // 没有任何URL字段，使用默认图片
      imgCopy.fullUrl = '/assets/images/car-placeholder.jpg';
    }
    
    return imgCopy;
  });
});

// 获取当前显示图片
const currentImage = computed(() => {
  if (processedImages.value && processedImages.value.length > 0) {
    return processedImages.value[currentImageIndex.value];
  }
  return { fullUrl: '/assets/images/car-placeholder.jpg' };
});

// 添加主题相关逻辑
const currentTheme = ref('light');

// 监听主题变化
const updateTheme = () => {
  const theme = document.documentElement.getAttribute('data-theme') || 'light';
  currentTheme.value = theme;
};

// 提供主题给子组件
provide('currentTheme', currentTheme);

// 组件挂载时初始化主题并设置监听
onMounted(() => {
  fetchCarDetail();
  
  // 初始化主题
  updateTheme();
  
  // 添加 theme-changed 事件监听
  window.addEventListener('theme-changed', (event) => {
    currentTheme.value = event.detail.theme;
    
    // 为了确保深色模式被正确应用
    if (event.detail.theme === 'dark') {
      document.querySelector('.car-detail-view').style.backgroundColor = '#121212';
    } else {
      document.querySelector('.car-detail-view').style.backgroundColor = '';
    }
  });
  
  // 使用 MutationObserver 监听 data-theme 属性变化
  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      if (
        mutation.type === 'attributes' && 
        mutation.attributeName === 'data-theme'
      ) {
        updateTheme();
      }
    });
  });
  
  // 开始观察 document.documentElement 的属性变化
  observer.observe(document.documentElement, { attributes: true });
});
</script>

<style scoped>
.car-detail-view {
  position: fixed !important;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  width: 100vw !important;
  height: 100vh !important;
  margin: 0 !important;
  padding: 0 !important;
  background-color: var(--va-background-primary) !important; 
  overflow-y: hidden;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
}

.detail-container {
  flex: 1;
  width: 100%;
  max-width: 100%;
  margin: 0;
  padding: 0 0 2rem;
  background: var(--va-background);
  box-shadow: 0 2px 12px var(--va-shadow);
  overflow-y: auto;
}

.loading-placeholder {
  height: 400px;
}

.error-state,
.empty-state {
  text-align: center;
  padding: 4rem 2rem;
  color: var(--va-text-secondary);
  min-height: 300px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.car-info {
  max-width: 100%;
  margin-left: auto;
  margin-right: auto;
  width: 100%;
  padding-top: 0;
}

.info-columns {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
  width: 100%;
  padding: 0 2rem;
  box-sizing: border-box;
  align-items: stretch;
}

.left-column,
.right-column {
  display: flex;
  flex-direction: column;
  height: 100%;
}

/* 确保左右两侧的卡片容器能够填充整个高度 */
.left-column > *,
.right-column > * {
  height: 100%;
  display: flex;
  flex-direction: column;
}

/* 确保CarActionButtons组件在底部 */
.left-column > :last-child {
  margin-top: auto;
}

/* 深色模式样式 - 使用硬编码颜色以提高优先级 */
:root[data-theme="dark"] .car-detail-view {
  background-color: #121212 !important;
  color: #e0e0e0 !important;
}

.dark-theme {
  background-color: #121212 !important;
  color: #e0e0e0 !important;
}

/* 单独的深色模式样式 */
:root[data-theme="dark"] .detail-container {
  background-color: #1e1e1e !important;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.5) !important;
  color: #e0e0e0 !important;
}

:root[data-theme="dark"] .car-info {
  background-color: #1e1e1e !important;
}

:root[data-theme="dark"] .error-state,
:root[data-theme="dark"] .empty-state {
  color: rgba(255, 255, 255, 0.7);
}

/* 响应式调整 */
@media (max-width: 768px) {
  .detail-container {
    padding: 0 0 1rem;
  }
  
  .info-columns {
    grid-template-columns: 1fr;
    gap: 1rem;
    padding: 0 1rem;
  }
}
</style> 