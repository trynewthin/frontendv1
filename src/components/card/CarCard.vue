<template>
  <div class="car-card">
    <!-- 上部分：车辆图片 -->
    <div v-if="showImage" 
      class="car-image" 
      :class="{'no-image': !hasImage}" 
      @click="goToDetail">
      <!-- 状态标签（左上） -->
      <div v-if="showStatus && car.status !== undefined" class="car-status-tag">
        {{ car.status === 1 ? '在售' : '下架' }}
      </div>
      
      <!-- 图片加载状态 -->
      <div v-if="isLoadingImage" class="image-loading">
        <va-progress-circle indeterminate color="primary" :size="40" />
      </div>
      
      <!-- 车辆图片 -->
      <img v-if="imageWithPrefix" :src="imageWithPrefix" :alt="car.brand + ' ' + car.model" />
      
      <!-- 价格标签（右下） -->
      <div v-if="showPrice" class="car-price-tag">
        ¥{{ formatPrice(car.price) }}
      </div>
    </div>
    
    <!-- 下部分：信息面板 -->
    <div class="car-info">
      <!-- 第一行：车型与品牌 -->
      <div v-if="showModelBrand" class="car-header">
        <h3 v-if="showModel" class="car-model">{{ car.model }}</h3>
        <span v-if="showBrand" class="car-brand">{{ car.brand }}</span>
      </div>
      
      <!-- 第二行：类别、年份、浏览量和收藏量 -->
      <div v-if="showMeta" class="car-meta">
        <span v-if="showCategory" class="car-category">{{ car.category }}</span>
        <span v-if="showYear && car.year" class="car-year">
          {{ car.year }}年
        </span>
        <div v-if="showStats" class="car-stats">
          <div v-if="showViewCount" class="car-stat">
            <i class="icon-view"></i>
            <span>{{ car.viewCount || 0 }}</span>
          </div>
          <div v-if="showFavoriteCount" class="car-stat">
            <i class="icon-favorite"></i>
            <span>{{ car.favoriteCount || 0 }}</span>
          </div>
        </div>
      </div>
      
      <!-- 推荐理由 -->
      <div v-if="showRecommendReason && car.recommendReason" class="car-reason">
        <p>{{ car.recommendReason }}</p>
      </div>
    </div>
  </div>
</template>

<script>
import { useRouter } from 'vue-router';
import { ref, onMounted, watch, computed } from 'vue';
import carService from '@/api/carService';

export default {
  name: 'CarCard',
  props: {
    car: {
      type: Object,
      required: true
    },
    // 控制各个元素显示的props
    showImage: {
      type: Boolean,
      default: true
    },
    showStatus: {
      type: Boolean,
      default: true
    },
    showPrice: {
      type: Boolean,
      default: true
    },
    showModelBrand: {
      type: Boolean,
      default: true
    },
    showModel: {
      type: Boolean,
      default: true
    },
    showBrand: {
      type: Boolean,
      default: true
    },
    showMeta: {
      type: Boolean,
      default: true
    },
    showCategory: {
      type: Boolean,
      default: true
    },
    showYear: {
      type: Boolean,
      default: true
    },
    showStats: {
      type: Boolean,
      default: true
    },
    showViewCount: {
      type: Boolean,
      default: true
    },
    showFavoriteCount: {
      type: Boolean,
      default: true
    },
    showRecommendReason: {
      type: Boolean,
      default: false
    }
  },
  setup(props) {
    const router = useRouter();
    const carImage = ref('');
    const isLoadingImage = ref(false);
    
    // 计算是否有图片
    const hasImage = computed(() => {
      return !!(carImage.value || (props.car && props.car.mainImage));
    });
    
    // 添加一个方法来检查图片是否可以加载
    const checkImageExists = (url) => {
      return new Promise((resolve) => {
        const img = new Image();
        img.onload = () => resolve(true);
        img.onerror = () => resolve(false);
        img.src = url;
      });
    };
    
    // 跳转到详情页
    const goToDetail = () => {
      if (props.car && props.car.carId) {
        router.push(`/car/${props.car.carId}`);
      }
    };
    
    // 获取车辆图片
    const fetchCarImages = async () => {
      if (!props.car.mainImage && props.car.carId) {
        isLoadingImage.value = true;
        try {
          // 使用carService中的getCarImages方法获取车辆图片
          const response = await carService.getCarImages(props.car.carId);
          console.log('获取车辆图片API响应:', JSON.stringify(response));
          
          if (response.success && response.data && response.data.length > 0) {
            // 使用第一张图片作为主图
            const firstImage = response.data[0];
            console.log('第一张图片数据:', JSON.stringify(firstImage));
            
            // 直接检查图片对象的所有属性
            console.log('图片对象所有属性:', Object.keys(firstImage));
            
            // 尝试直接使用API返回的数据
            if (firstImage.fullUrl) {
              carImage.value = firstImage.fullUrl;
              console.log('使用fullUrl字段:', carImage.value);
            } else if (firstImage.url) {
              carImage.value = firstImage.url;
              console.log('使用url字段:', carImage.value);
            } else if (firstImage.imageUrl) {
              // 检查imageUrl字段
              if (firstImage.imageUrl.startsWith('http')) {
                carImage.value = firstImage.imageUrl;
                console.log('使用完整imageUrl字段:', carImage.value);
              } else {
                // 添加API基础URL前缀
                carImage.value = `http://localhost:8090${firstImage.imageUrl}`;
                console.log('添加前缀后的imageUrl:', carImage.value);
              }
            } else {
              // 如果没有找到URL字段，记录整个对象以便调试
              console.log('未找到图片URL字段，完整对象:', JSON.stringify(firstImage));
            }
            
            console.log('最终加载的车辆图片URL:', carImage.value);
          } else {
            console.log('未找到车辆图片或获取失败:', response.message);
          }
        } catch (error) {
          console.error('获取车辆图片失败:', error);
        } finally {
          isLoadingImage.value = false;
        }
      }
    };
    
    // 监听car属性变化，当car变化时重新获取图片
    watch(() => props.car, (newCar) => {
      if (newCar && newCar.carId && !newCar.mainImage) {
        carImage.value = ''; // 清空之前的图片
        fetchCarImages();
      }
    }, { deep: true });
    
    // 组件挂载时获取图片
    onMounted(() => {
      if (props.car && props.car.carId) {
        fetchCarImages();
      }
    });
    
    return {
      goToDetail,
      carImage,
      isLoadingImage,
      fetchCarImages,
      hasImage
    };
  },
  computed: {
    // 添加localhost:8090前缀到车辆图片
    imageWithPrefix() {
      // 如果有从API获取的图片，优先使用
      if (this.carImage) {
        console.log('使用API获取的图片:', this.carImage);
        // 不再处理URL前缀，直接使用API返回的URL
        return this.carImage;
      }
      
      // 否则使用车辆的mainImage
      if (!this.car.mainImage) {
        console.log('没有主图片，也没有API获取的图片');
        return '';
      }
      
      // 检查图片路径是否已经包含前缀
      if (this.car.mainImage.startsWith('http')) {
        console.log('使用完整URL的主图片:', this.car.mainImage);
        return this.car.mainImage;
      }
      
      // 添加前缀
      const url = `http://localhost:8090${this.car.mainImage}`;
      console.log('使用添加前缀的主图片:', url);
      return url;
    }
  },
  methods: {
    // 格式化价格，添加千位分隔符
    formatPrice(price) {
      if (!price && price !== 0) return '暂无价格';
      return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    }
  }
}
</script>

<style scoped>
.car-card {
  width: 100%;
  border-radius: 8px;
  background-color: var(--va-background);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  display: flex;
  flex-direction: column;
  height: 100%;
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
}

.car-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
}

/* 深色模式下的阴影效果 */
:root[data-theme="dark"] .car-card {
  box-shadow: 0 2px 8px rgba(255, 215, 0, 0.1);
}

:root[data-theme="dark"] .car-card:hover {
  box-shadow: 0 8px 16px rgba(255, 215, 0, 0.2);
}

/* 图片部分 */
.car-image {
  width: 100%;
  height: 180px;
  overflow: hidden;
  position: relative;
  cursor: pointer;
  background-color: var(--va-background-secondary);
  display: flex;
  justify-content: center;
  align-items: center;
}

.car-image::after {
  content: "暂无图片";
  display: flex;
  justify-content: center;
  align-items: center;
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  color: var(--va-text-color);
  font-size: 14px;
  opacity: 0;
}

/* 使用类名控制显示，而不是:has选择器 */
.car-image.no-image::after {
  opacity: 1;
}

.car-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.car-card:hover .car-image img {
  transform: scale(1.05);
}

/* 状态标签（左上） */
.car-status-tag {
  position: absolute;
  top: 10px;
  left: 10px;
  background-color: rgba(0, 0, 0, 0.6);
  color: white;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  z-index: 1;
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
}

/* 价格标签（右下） */
.car-price-tag {
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: rgba(255, 255, 255, 0.9);
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-weight: 600;
  color: #333333;
  font-size: 1.1rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  z-index: 2;
}

/* 深色模式下的价格标签样式 */
:root[data-theme="dark"] .car-price-tag {
  background: rgba(0, 0, 0, 0.7);
  color: #ffffff;
  box-shadow: 0 2px 8px rgba(255, 215, 0, 0.2);
}

/* 信息面板部分 */
.car-info {
  padding: 16px;
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  background-color: var(--va-background);
}

/* 车型与品牌 */
.car-header {
  display: flex;
  align-items: baseline;
  margin-bottom: 8px;
}

.car-model {
  margin: 0;
  font-size: 18px;
  font-weight: 600;
  color: var(--va-text-color);
  margin-right: 8px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.car-brand {
  font-size: 14px;
  color: var(--va-text-color-secondary);
  font-weight: normal;
}

/* 深色模式下的品牌标签颜色 */
:root[data-theme="dark"] .car-brand {
  color: #FFD700;
}

/* 第二行信息 */
.car-meta {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  margin-bottom: 12px;
  color: var(--va-text-color-secondary);
  font-size: 14px;
  gap: 12px;
  justify-content: flex-start;
}

.car-category {
  background-color: var(--va-background-secondary);
  padding: 2px 8px;
  border-radius: 4px;
  font-size: 12px;
  color: var(--va-text-color);
}

/* 深色模式下的类别标签颜色 */
:root[data-theme="dark"] .car-category {
  color: #FFD700;
  background-color: rgba(255, 215, 0, 0.1);
}

.car-year {
  font-size: 12px;
  color: var(--va-text-color-secondary);
}

.car-stats {
  display: flex;
  margin-left: auto;
  color: var(--va-text-color-secondary);
  font-size: 12px;
  gap: 10px;
}

.car-stat {
  display: flex;
  align-items: center;
}

.car-stat i {
  margin-right: 4px;
  font-size: 14px;
}

.icon-view:before {
  content: "👁️";
}

.icon-favorite:before {
  content: "❤️";
}

.car-reason {
  margin-top: 8px;
  padding-top: 8px;
  border-top: 1px solid var(--va-background-secondary);
  font-size: 13px;
  color: var(--va-text-color-secondary);
}

.car-reason p {
  margin: 0;
  line-height: 1.4;
}

@media (max-width: 768px) {
  .car-image {
    height: 150px;
  }
  
  .car-model {
    font-size: 16px;
  }
  
  .car-meta {
    gap: 8px;
  }
}

/* 图片加载状态 */
.image-loading {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: rgba(var(--va-background-rgb), 0.7);
  z-index: 2;
  backdrop-filter: blur(5px);
  -webkit-backdrop-filter: blur(5px);
}
</style> 