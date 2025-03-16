<template>
  <div class="car-card">
    <!-- 上部分：车辆图片 -->
    <div v-if="showImage" 
      class="car-image" 
      :class="{'no-image': !hasImage}" 
      @click="goToDetail">
      <!-- 状态标签（左上） -->
      <div v-if="showStatus && localCarData.status !== undefined" class="car-status-tag">
        {{ localCarData.status === 1 ? '在售' : '下架' }}
      </div>
      
      <!-- 图片加载状态 -->
      <div v-if="isLoadingImage" class="image-loading">
        <va-progress-circle indeterminate color="primary" :size="40" />
      </div>
      
      <!-- 车辆图片 -->
      <img v-if="imageWithPrefix" :src="imageWithPrefix" :alt="localCarData.brand + ' ' + localCarData.model" />
      
      <!-- 价格标签（右下） -->
      <div v-if="showPrice" class="car-price-tag">
        ¥{{ formatPrice(localCarData.price) }}
      </div>
    </div>
    
    <!-- 下部分：信息面板 -->
    <div class="car-info">
      <!-- 第一行：车型与品牌 -->
      <div v-if="showModelBrand" class="car-header">
        <h3 v-if="showModel" class="car-model">{{ localCarData.model }}</h3>
        <span v-if="showBrand" class="car-brand">{{ localCarData.brand }}</span>
      </div>
      
      <!-- 第二行：类别、年份、浏览量和收藏量 -->
      <div v-if="showMeta" class="car-meta">
        <span v-if="showCategory" class="car-category">{{ localCarData.category }}</span>
        <span v-if="showYear && localCarData.year" class="car-year">
          {{ localCarData.year }}年
        </span>
        <div v-if="showStats" class="car-stats">
          <div v-if="showViewCount" class="car-stat">
            <i class="icon-view"></i>
            <span>{{ localCarData.viewCount || 0 }}</span>
          </div>
          <div v-if="showFavoriteCount" class="car-stat">
            <i class="icon-favorite"></i>
            <span>{{ localCarData.favoriteCount || 0 }}</span>
          </div>
        </div>
      </div>
      
      <!-- 推荐理由 -->
      <div v-if="showRecommendReason && localCarData.recommendReason" class="car-reason">
        <p>{{ localCarData.recommendReason }}</p>
      </div>
      
      <!-- 添加收藏按钮在右下角 -->
      <div v-if="showFavoriteButton" class="card-actions">
        <FavoriteButton 
          :carId="localCarData.carId" 
          size="small"
          :autoCheck="true"
          :inCard="true"
          @favorite-changed="onFavoriteChanged"
        />
      </div>
    </div>
  </div>
</template>

<script>
import { useRouter } from 'vue-router';
import { ref, onMounted, watch, computed, onUnmounted } from 'vue';
import carService from '@/api/carService';
import FavoriteButton from '@/components/button/FavoriteButton.vue';

export default {
  name: 'CarCard',
  components: {
    FavoriteButton
  },
  props: {
    car: {
      type: Object,
      required: true
    },
    // 新增刷新间隔prop，默认不自动刷新
    autoRefreshInterval: {
      type: Number,
      default: 0 // 单位为毫秒，0表示不自动刷新
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
    },
    showFavoriteButton: {
      type: Boolean,
      default: true
    }
  },
  emits: ['data-updated'],
  setup(props, { emit }) {
    const router = useRouter();
    const carImage = ref('');
    const isLoadingImage = ref(false);
    const localCarData = ref({...props.car}); // 本地数据副本
    const refreshTimer = ref(null);
    
    // 计算是否有图片
    const hasImage = computed(() => {
      return !!(carImage.value || (localCarData.value && localCarData.value.mainImage));
    });
    
    // 处理收藏状态变化
    const onFavoriteChanged = (isFavorited) => {
      console.log('收藏按钮点击，状态变更为:', isFavorited);
      
      // 立即发送一个强制刷新所有卡片的事件
      window.dispatchEvent(new CustomEvent('refresh-all-cards', {
        detail: { 
          timestamp: Date.now(),
          source: 'favorite-button',
          carId: localCarData.value.carId
        }
      }));
      
      // 触发全局收藏事件，让其他组件知道收藏状态已变化
      window.dispatchEvent(new CustomEvent('favorite-changed', {
        detail: { 
          carId: localCarData.value.carId, 
          isFavorited,
          forceRefresh: true
        }
      }));
      
      // 立即刷新数据
      console.log('收藏状态变化，立即刷新数据:', localCarData.value.carId);
      refreshCarData();
    };
    
    // 跳转到详情页
    const goToDetail = () => {
      if (localCarData.value && localCarData.value.carId) {
        // 触发浏览事件
        window.dispatchEvent(new CustomEvent('car-viewed', {
          detail: { carId: localCarData.value.carId }
        }));
        
        router.push(`/car/${localCarData.value.carId}`);
      }
    };
    
    // 刷新车辆数据
    const refreshCarData = async () => {
      if (!localCarData.value || !localCarData.value.carId) return;
      
      try {
        console.log('开始刷新车辆数据:', localCarData.value.carId);
        const response = await carService.getCarDetail(localCarData.value.carId);
        
        if (response && response.success && response.data && response.data.basic) {
          // 只更新需要的字段，保留其他字段不变
          const updatedData = { ...localCarData.value };
          
          // 更新浏览量和收藏量
          if (response.data.basic.viewCount !== undefined) {
            updatedData.viewCount = response.data.basic.viewCount;
          }
          if (response.data.basic.favoriteCount !== undefined) {
            updatedData.favoriteCount = response.data.basic.favoriteCount;
          }
          // 更新状态
          if (response.data.basic.status !== undefined) {
            updatedData.status = response.data.basic.status;
          }
          
          // 更新本地数据
          localCarData.value = updatedData;
          
          // 通知父组件数据已更新
          emit('data-updated', updatedData);
          
          console.log('车辆卡片数据已刷新:', localCarData.value.carId, '收藏数:', updatedData.favoriteCount);
        } else {
          console.warn('刷新车辆数据失败，响应不完整:', response);
        }
      } catch (error) {
        console.error('刷新车辆数据失败:', error);
      }
    };
    
    // 设置自动刷新定时器
    const setupAutoRefresh = () => {
      // 清除旧定时器
      if (refreshTimer.value) {
        clearInterval(refreshTimer.value);
        refreshTimer.value = null;
      }
      
      // 设置新定时器（如果间隔>0）
      if (props.autoRefreshInterval > 0) {
        refreshTimer.value = setInterval(() => {
          refreshCarData();
        }, props.autoRefreshInterval);
      }
    };
    
    // 获取车辆图片
    const fetchCarImages = async () => {
      if (!localCarData.value.mainImage && localCarData.value.carId) {
        isLoadingImage.value = true;
        try {
          // 使用carService中的getCarImages方法获取车辆图片
          const response = await carService.getCarImages(localCarData.value.carId);
          
          if (response.success && response.data && response.data.length > 0) {
            // 使用第一张图片作为主图
            const firstImage = response.data[0];
            
            // 尝试直接使用API返回的数据
            if (firstImage.fullUrl) {
              carImage.value = firstImage.fullUrl;
            } else if (firstImage.url) {
              carImage.value = firstImage.url;
            } else if (firstImage.imageUrl) {
              // 检查imageUrl字段
              if (firstImage.imageUrl.startsWith('http')) {
                carImage.value = firstImage.imageUrl;
              } else {
                // 添加API基础URL前缀
                carImage.value = `http://localhost:8090${firstImage.imageUrl}`;
              }
            }
          }
        } catch (error) {
          console.error('获取车辆图片失败:', error);
        } finally {
          isLoadingImage.value = false;
        }
      }
    };
    
    // 监听原始car属性变化
    watch(() => props.car, (newCar) => {
      if (newCar) {
        localCarData.value = {...newCar};
        
        // 如果有carId但没有图片，获取图片
        if (newCar.carId && !newCar.mainImage) {
          fetchCarImages();
        }
      }
    }, { deep: true });
    
    // 组件挂载时初始化
    onMounted(() => {
      // 初始化本地数据
      localCarData.value = {...props.car};
      
      // 获取图片
      if (props.car && props.car.carId && !props.car.mainImage) {
        fetchCarImages();
      }
      
      // 设置自动刷新
      setupAutoRefresh();
      
      // 监听收藏状态变化事件，刷新数据
      const handleFavoriteEvent = (event) => {
        // 无论是否为同一辆车，都刷新数据
        console.log('收到收藏状态变化事件:', event.detail);
        refreshCarData();
      };
      
      // 监听浏览事件，刷新数据
      const handleViewEvent = (event) => {
        // 检查是否是同一辆车
        if (event.detail && event.detail.carId == localCarData.value.carId) {
          console.log('收到浏览事件:', event.detail);
          refreshCarData();
        }
      };
      
      // 监听刷新所有卡片事件
      const handleRefreshAllCards = (event) => {
        console.log('收到刷新所有卡片事件:', event.detail);
        // 立即刷新当前卡片
        refreshCarData();
      };
      
      window.addEventListener('favorite-changed', handleFavoriteEvent);
      window.addEventListener('car-viewed', handleViewEvent);
      window.addEventListener('refresh-all-cards', handleRefreshAllCards);
      
      // 存储事件处理函数引用以便清理
      localCarData.value._eventHandlers = {
        favoriteHandler: handleFavoriteEvent,
        viewHandler: handleViewEvent,
        refreshAllHandler: handleRefreshAllCards
      };
    });
    
    // 组件卸载时清理
    onUnmounted(() => {
      // 清除定时器
      if (refreshTimer.value) {
        clearInterval(refreshTimer.value);
      }
      
      // 移除事件监听
      if (localCarData.value._eventHandlers) {
        window.removeEventListener('favorite-changed', localCarData.value._eventHandlers.favoriteHandler);
        window.removeEventListener('car-viewed', localCarData.value._eventHandlers.viewHandler);
        window.removeEventListener('refresh-all-cards', localCarData.value._eventHandlers.refreshAllHandler);
      }
    });
    
    return {
      goToDetail,
      carImage,
      isLoadingImage,
      fetchCarImages,
      hasImage,
      localCarData, // 返回本地数据副本供模板使用
      refreshCarData,
      onFavoriteChanged
    };
  },
  computed: {
    // 添加localhost:8090前缀到车辆图片
    imageWithPrefix() {
      // 如果有从API获取的图片，优先使用
      if (this.carImage) {
        // 不再处理URL前缀，直接使用API返回的URL
        return this.carImage;
      }
      
      // 否则使用车辆的mainImage
      if (!this.localCarData.mainImage) {
        return '';
      }
      
      // 检查图片路径是否已经包含前缀
      if (this.localCarData.mainImage.startsWith('http')) {
        return this.localCarData.mainImage;
      }
      
      // 添加前缀
      return `http://localhost:8090${this.localCarData.mainImage}`;
    }
  },
  methods: {
    // 格式化价格，添加千位分隔符
    formatPrice(price) {
      if (!price && price !== 0) return '暂无价格';
      return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    },
    // 为父组件提供刷新方法
    refresh() {
      if (this.refreshCarData) {
        console.log('手动触发卡片刷新:', this.localCarData.carId);
        this.refreshCarData();
      }
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
  position: relative;
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

/* 卡片操作区 */
.card-actions {
  position: absolute;
  bottom: 16px;
  right: 16px;
  z-index: 2;
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