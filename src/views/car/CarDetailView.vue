<template>
  <div class="car-detail-view">
    <div class="detail-container">
      <div class="header-section">
        <h1 class="detail-title">车辆详情</h1>
        <va-button @click="goBack" preset="secondary" icon="arrow_back">返回</va-button>
      </div>
      
      <div v-if="loading" class="loading-state">
        <va-inner-loading :loading="true">
          <div class="loading-placeholder"></div>
        </va-inner-loading>
      </div>
      
      <div v-else-if="error" class="error-state">
        <p>{{ error }}</p>
        <va-button @click="goBack" preset="secondary">返回</va-button>
      </div>
      
      <div v-else-if="carBasic" class="car-info">
        <!-- 车辆图片展示区 -->
        <div class="image-showcase">
          <div v-if="imagesLoading" class="image-loading">
            <va-inner-loading :loading="true">
              <div class="image-placeholder"></div>
            </va-inner-loading>
          </div>
          <div v-else-if="processedImages && processedImages.length > 0" class="car-images">
            <div class="main-image">
              <img :src="currentImage.fullUrl" :alt="`${carBasic.brand} ${carBasic.model}`" />
            </div>
            <div class="thumbnails" v-if="processedImages.length > 1">
              <div 
                v-for="(image, index) in processedImages" 
                :key="index" 
                class="thumbnail" 
                :class="{ active: index === currentImageIndex }"
                @click="currentImageIndex = index"
              >
                <img :src="image.fullUrl" alt="缩略图" />
              </div>
            </div>
          </div>
          <div v-else class="no-images">
            <p>暂无车辆图片</p>
          </div>
        </div>

        <!-- 基本信息卡片 -->
        <div class="basic-info-card">
          <h2 class="section-title">基本信息</h2>
          <div class="brand-model">
            <h3>{{ carBasic.brand }} {{ carBasic.model }} {{ carBasic.year }}</h3>
          </div>
          <div class="price">
            <span class="price-tag">￥{{ formatPrice(carBasic.price) }}</span>
          </div>
          <div class="info-grid">
            <div class="info-item">
              <span class="label">类别:</span>
              <span class="value">{{ carBasic.category }}</span>
            </div>
            <div class="info-item">
              <span class="label">状态:</span>
              <span class="value">{{ formatStatus(carBasic.status) }}</span>
            </div>
            <div class="info-item">
              <span class="label">创建时间:</span>
              <span class="value">{{ formatDateTime(carBasic.createTime) }}</span>
            </div>
          </div>
        </div>

        <!-- 详细信息卡片 -->
        <div class="detail-info-card" v-if="carDetail">
          <h2 class="section-title">详细参数</h2>
          <div class="detail-grid">
            <div class="detail-item" v-if="carDetail.engine">
              <span class="label">发动机:</span>
              <span class="value">{{ carDetail.engine }}</span>
            </div>
            <div class="detail-item" v-if="carDetail.transmission">
              <span class="label">变速箱:</span>
              <span class="value">{{ carDetail.transmission }}</span>
            </div>
            <div class="detail-item" v-if="carDetail.fuelType">
              <span class="label">燃油类型:</span>
              <span class="value">{{ carDetail.fuelType }}</span>
            </div>
            <div class="detail-item" v-if="carDetail.fuelConsumption">
              <span class="label">油耗(L/100km):</span>
              <span class="value">{{ carDetail.fuelConsumption }}</span>
            </div>
            <div class="detail-item" v-if="carDetail.seats">
              <span class="label">座位数:</span>
              <span class="value">{{ carDetail.seats }}</span>
            </div>
            <div class="detail-item" v-if="carDetail.color">
              <span class="label">颜色:</span>
              <span class="value">{{ carDetail.color }}</span>
            </div>
            <div class="detail-item" v-if="carDetail.bodySize">
              <span class="label">车身尺寸:</span>
              <span class="value">{{ carDetail.bodySize }}</span>
            </div>
            <div class="detail-item" v-if="carDetail.wheelbase">
              <span class="label">轴距(mm):</span>
              <span class="value">{{ carDetail.wheelbase }}</span>
            </div>
          </div>
          
          <div class="features-section" v-if="carDetail.features">
            <h3 class="features-title">配置特性</h3>
            <p class="features-text">{{ carDetail.features }}</p>
          </div>
          
          <div class="warranty-section" v-if="carDetail.warranty">
            <h3 class="warranty-title">质保信息</h3>
            <p class="warranty-text">{{ carDetail.warranty }}</p>
          </div>
        </div>
        
        <div class="no-detail-info" v-else>
          <p>暂无车辆详情信息</p>
        </div>
      </div>
      
      <div v-else class="empty-state">
        <p>未找到车辆信息</p>
        <va-button @click="goBack" preset="secondary">返回</va-button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useToast } from 'vuestic-ui';
import carService from '@/api/carService';

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

// 获取车辆详情
const fetchCarDetail = async () => {
  loading.value = true;
  error.value = null;
  
  try {
    const response = await carService.getCarDetail(carId.value);
    console.log('获取车辆详情响应:', response);
    
    if (response.success && response.data) {
      carData.value = response.data;
      
      // 从嵌套结构中提取数据
      if (response.data.basic) {
        carBasic.value = response.data.basic;
        console.log('基本信息:', carBasic.value);
      } else {
        // 如果数据结构是扁平的而不是嵌套的
        carBasic.value = response.data;
      }
      
      if (response.data.detail) {
        carDetail.value = response.data.detail;
        console.log('详细信息:', carDetail.value);
      } else if (response.data.carDetail) {
        carDetail.value = response.data.carDetail;
      } else if (response.data.detail === null) {
        console.log('没有详细信息');
        carDetail.value = null;
      }
      
      if (response.data.images && Array.isArray(response.data.images)) {
        rawImages.value = response.data.images;
        console.log('图片信息:', rawImages.value);
      } else {
        // 如果没有图片数据，尝试获取图片
        fetchCarImages();
      }
    } else {
      error.value = response.message || '获取车辆详情失败';
      initToast({
        message: error.value,
        color: 'danger'
      });
    }
  } catch (err) {
    console.error('获取车辆详情出错:', err);
    error.value = '获取车辆详情时发生错误';
    initToast({
      message: error.value,
      color: 'danger'
    });
  } finally {
    loading.value = false;
  }
};

// 获取车辆图片
const fetchCarImages = async () => {
  imagesLoading.value = true;
  
  try {
    const response = await carService.getCarImages(carId.value);
    console.log('获取车辆图片响应:', response);
    
    if (response.success && response.data) {
      rawImages.value = response.data || [];
      console.log('处理后的车辆图片:', processedImages.value);
    } else {
      console.warn('获取车辆图片失败:', response.message);
      initToast({
        message: '获取车辆图片失败',
        color: 'warning'
      });
    }
  } catch (err) {
    console.error('获取车辆图片出错:', err);
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
    console.error('日期格式化错误:', err);
    return dateTimeStr;
  }
};

// 返回上一页
const goBack = () => {
  router.back();
};

// 组件挂载时获取数据
onMounted(() => {
  fetchCarDetail();
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
  background-color: #f5f7fa !important; 
  overflow-y: auto;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
}

.detail-container {
  flex: 1;
  width: 100%;
  max-width: 100%;
  margin: 0;
  padding: 2rem;
  background: #fff;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
  overflow-y: auto;
}

.header-section {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  max-width: 1400px;
  margin-left: auto;
  margin-right: auto;
  width: 100%;
}

.detail-title {
  margin: 0;
  font-size: 1.8rem;
  color: #333;
}

.loading-placeholder {
  height: 400px;
}

.error-state,
.empty-state {
  text-align: center;
  padding: 4rem 2rem;
  color: #909399;
  min-height: 300px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.car-info {
  display: grid;
  grid-template-columns: 1fr;
  gap: 2rem;
  max-width: 1400px;
  margin-left: auto;
  margin-right: auto;
  width: 100%;
}

.image-showcase {
  width: 100%;
  margin-bottom: 2rem;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 1px 8px rgba(0, 0, 0, 0.1);
}

.image-loading,
.image-placeholder {
  height: 400px;
  background-color: #f5f7fa;
}

.no-images {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 300px;
  background-color: #f5f7fa;
  color: #909399;
}

.car-images {
  display: flex;
  flex-direction: column;
}

.main-image {
  width: 100%;
  height: 400px;
  overflow: hidden;
}

.main-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.thumbnails {
  display: flex;
  gap: 10px;
  margin-top: 10px;
  overflow-x: auto;
  padding: 5px 0;
}

.thumbnail {
  width: 80px;
  height: 60px;
  cursor: pointer;
  border: 2px solid transparent;
  border-radius: 4px;
  overflow: hidden;
  transition: border-color 0.3s;
}

.thumbnail.active {
  border-color: #1e88e5;
}

.thumbnail img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.section-title {
  font-size: 1.4rem;
  margin-bottom: 1.5rem;
  color: #333;
  border-bottom: 1px solid #eee;
  padding-bottom: 0.5rem;
}

.basic-info-card,
.detail-info-card {
  padding: 1.5rem;
  border-radius: 8px;
  box-shadow: 0 1px 8px rgba(0, 0, 0, 0.1);
  margin-bottom: 2rem;
  background-color: #fff;
}

.brand-model h3 {
  font-size: 1.6rem;
  margin: 0 0 1rem 0;
  color: #333;
}

.price-tag {
  font-size: 1.8rem;
  color: #e74c3c;
  font-weight: bold;
  display: block;
  margin: 1rem 0;
}

.info-grid,
.detail-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
}

.info-item,
.detail-item {
  margin-bottom: 0.5rem;
}

.label {
  color: #666;
  font-size: 0.9rem;
  margin-right: 0.5rem;
}

.value {
  color: #333;
  font-weight: 500;
}

.features-section,
.warranty-section {
  margin-top: 1.5rem;
  padding-top: 1.5rem;
  border-top: 1px solid #eee;
}

.features-title,
.warranty-title {
  font-size: 1.1rem;
  margin-bottom: 0.5rem;
  color: #333;
}

.features-text,
.warranty-text {
  color: #555;
  line-height: 1.6;
  white-space: pre-wrap; /* 保留文本格式 */
}

.no-detail-info {
  padding: 2rem;
  text-align: center;
  color: #909399;
  background-color: #f5f7fa;
  border-radius: 8px;
}

@media (max-width: 768px) {
  .detail-container {
    padding: 1rem;
  }
  
  .info-grid,
  .detail-grid {
    grid-template-columns: 1fr;
  }
  
  .main-image {
    height: 250px;
  }
}

@media (min-width: 992px) {
  .car-info {
    grid-template-columns: 1fr 1fr;
  }
  
  .image-showcase {
    grid-column: span 2;
  }
}
</style> 