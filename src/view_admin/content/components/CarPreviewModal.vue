<template>
  <va-modal 
    :modelValue="modelValue" 
    @update:modelValue="$emit('update:modelValue', $event)"
    title="车辆预览" 
    size="large" 
    hide-default-actions
  >
    <div class="car-preview-container" v-if="car">
      <div class="car-preview-header">
        <h2 class="car-preview-title">{{ formatBrand(car.brand) }} {{ car.model }} {{ car.year }}</h2>
        <va-badge
          :color="getStatusColor(car.status)"
          :text="formatAuditStatus(car.status)"
        />
      </div>
      
      <!-- 车辆图片区域 -->
      <div class="car-preview-images" v-if="car.images && car.images.length > 0">
        <img 
          :src="getImageUrl(car.images[0])" 
          :alt="car.model"
          class="preview-main-image" 
        />
      </div>

      <!-- 基本信息 -->
      <div class="car-preview-info">
        <div class="car-preview-section">
          <h3 class="section-title">基本信息</h3>
          <div class="info-grid">
            <div class="info-item">
              <span class="info-label">ID:</span>
              <span class="info-value">{{ car.carId || '暂无' }}</span>
            </div>
            <div class="info-item">
              <span class="info-label">品牌:</span>
              <span class="info-value">{{ formatBrand(car.brand) || '暂无' }}</span>
            </div>
            <div class="info-item">
              <span class="info-label">型号:</span>
              <span class="info-value">{{ car.model || '暂无' }}</span>
            </div>
            <div class="info-item">
              <span class="info-label">年份:</span>
              <span class="info-value">{{ car.year || '暂无' }}</span>
            </div>
            <div class="info-item">
              <span class="info-label">价格:</span>
              <span class="info-value price">{{ formatPrice(car.price) }}</span>
            </div>
            <div class="info-item">
              <span class="info-label">创建时间:</span>
              <span class="info-value">{{ formatDate(car.createTime) }}</span>
            </div>
          </div>
        </div>
        
        <!-- 详细参数 -->
        <div class="car-preview-section" v-if="car.detail">
          <h3 class="section-title">详细参数</h3>
          <div class="info-grid">
            <div class="info-item" v-if="car.detail.engine">
              <span class="info-label">发动机:</span>
              <span class="info-value">{{ car.detail.engine }}</span>
            </div>
            <div class="info-item" v-if="car.detail.transmission">
              <span class="info-label">变速箱:</span>
              <span class="info-value">{{ car.detail.transmission }}</span>
            </div>
            <div class="info-item" v-if="car.detail.fuelType">
              <span class="info-label">燃油类型:</span>
              <span class="info-value">{{ car.detail.fuelType }}</span>
            </div>
            <div class="info-item" v-if="car.detail.color">
              <span class="info-label">颜色:</span>
              <span class="info-value">{{ car.detail.color }}</span>
            </div>
            <div class="info-item" v-if="car.detail.seats">
              <span class="info-label">座位数:</span>
              <span class="info-value">{{ car.detail.seats }}</span>
            </div>
            <div class="info-item" v-if="car.detail.mileage">
              <span class="info-label">里程数:</span>
              <span class="info-value">{{ car.detail.mileage }} 公里</span>
            </div>
          </div>
        </div>
        
        <div class="car-card-container">
          <car-card 
            :car="car"
            :showImage="true"
            :showStatus="true"
            :showPrice="true"
            :showModelBrand="true"
            :showMeta="true"
          />
        </div>
      </div>
    </div>
    <div class="d-flex justify-end mt-4">
      <va-button 
        color="primary" 
        @click="closeModal"
      >
        关闭
      </va-button>
    </div>
  </va-modal>
</template>

<script>
import { defineComponent, computed, watch } from 'vue';
import CarCard from '@/components/card/CarCard.vue';

export default defineComponent({
  name: "CarPreviewModal",
  components: {
    CarCard
  },
  props: {
    // 是否显示
    modelValue: {
      type: Boolean,
      default: false
    },
    // 车辆数据
    carData: {
      type: Object,
      default: null
    },
    // 图片基础URL
    imageBaseUrl: {
      type: String,
      default: ''
    },
    // 格式化函数
    formatters: {
      type: Object,
      default: () => ({})
    }
  },
  emits: ['update:modelValue', 'close'],
  setup(props, { emit }) {
    // 车辆数据
    const car = computed(() => props.carData);
    
    // 关闭模态框
    const closeModal = () => {
      emit('update:modelValue', false);
      emit('close');
    };
    
    // 获取状态颜色
    const getStatusColor = (status) => {
      status = Number(status);
      if (status === 0) return 'info';      // 待审核
      if (status === 1) return 'success';   // 已通过
      if (status === 2) return 'danger';    // 已拒绝
      return 'gray';
    };
    
    // 格式化审核状态
    const formatAuditStatus = (status) => {
      if (props.formatters && props.formatters.status) {
        return props.formatters.status(status);
      }
      
      status = Number(status);
      const statusMap = {
        0: '待审核',
        1: '已通过',
        2: '已拒绝'
      };
      return statusMap[status] || '未知状态';
    };
    
    // 格式化品牌
    const formatBrand = (brand) => {
      if (props.formatters && props.formatters.brand) {
        return props.formatters.brand(brand);
      }
      
      if (!brand) return '暂无品牌';
      
      // 常见品牌映射
      const brandMap = {
        'BMW': '宝马',
        'Audi': '奥迪',
        'Mercedes': '奔驰',
        'Mercedes-Benz': '奔驰',
        'Porsche': '保时捷',
        'Toyota': '丰田',
        'Honda': '本田',
        'Nissan': '日产',
        'Ford': '福特',
        'Chevrolet': '雪佛兰',
        'Volkswagen': '大众'
      };
      
      return brandMap[brand] || brand;
    };
    
    // 格式化价格
    const formatPrice = (price) => {
      if (props.formatters && props.formatters.price) {
        return props.formatters.price(price);
      }
      
      if (price === undefined || price === null) return '0元';
      
      // 处理价格值
      let priceValue = Number(price);
      if (isNaN(priceValue)) return '0元';
      
      // 直接展示元为单位的价格
      return priceValue.toLocaleString() + '元';
    };
    
    // 格式化日期
    const formatDate = (dateString) => {
      if (props.formatters && props.formatters.date) {
        return props.formatters.date(dateString);
      }
      
      if (!dateString) return '无日期';
      try {
        const date = new Date(dateString);
        if (isNaN(date.getTime())) return '无效日期';
        
        return date.toLocaleString('zh-CN', {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
          hour: '2-digit',
          minute: '2-digit'
        }).replace(/\//g, '-');
      } catch (error) {
        return '无效日期';
      }
    };
    
    // 获取图片URL
    const getImageUrl = (image) => {
      if (!image) return '/assets/images/car-placeholder.jpg';
      
      if (image.fullUrl) return image.fullUrl;
      
      let url = '';
      if (image.imageUrl) {
        url = image.imageUrl;
      } else if (image.url) {
        url = image.url;
      } else {
        return '/assets/images/car-placeholder.jpg';
      }
      
      if (url.startsWith('http')) {
        return url;
      } else {
        return `${props.imageBaseUrl || import.meta.env.VITE_API_IMAGE_URL || 'http://localhost:8090'}${url}`;
      }
    };
    
    return {
      car,
      closeModal,
      getStatusColor,
      formatAuditStatus,
      formatBrand,
      formatPrice,
      formatDate,
      getImageUrl
    };
  }
});
</script>

<style scoped>
.car-preview-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 1rem;
  color: var(--audit-text-color, #333333);
}

.car-preview-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
  border-bottom: 1px solid var(--audit-border-color, #eee);
  padding-bottom: 0.5rem;
}

.car-preview-title {
  margin: 0;
  font-size: 1.5rem;
  color: var(--audit-text-color, #333333);
}

.car-preview-images {
  width: 100%;
  margin-bottom: 1rem;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 1px 8px var(--audit-card-shadow, rgba(0, 0, 0, 0.05));
  text-align: center;
  background-color: var(--audit-bg-color, #ffffff);
}

.preview-main-image {
  width: 100%;
  max-height: 300px;
  object-fit: cover;
}

.car-preview-info {
  margin-top: 1rem;
}

.car-preview-section {
  margin-bottom: 1.5rem;
}

.section-title {
  font-size: 1.2rem;
  margin-bottom: 1rem;
  color: var(--audit-section-title, #333);
  font-weight: 600;
  border-bottom: 1px solid var(--audit-border-color, #eee);
  padding-bottom: 0.5rem;
}

.info-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 0.5rem 1rem;
}

.info-item {
  padding: 0.5rem 0;
}

.info-label {
  color: var(--audit-secondary-text, #666666);
  margin-right: 0.5rem;
  font-weight: 500;
}

.info-value {
  color: var(--audit-text-color, #333333);
}

.info-value.price {
  color: var(--audit-price-color, #e64a19);
  font-weight: bold;
}

.car-card-container {
  margin-top: 1.5rem;
  border-top: 1px solid var(--audit-border-color, #eee);
  padding-top: 1.5rem;
}

.d-flex {
  display: flex;
}

.justify-end {
  justify-content: flex-end;
}

.mt-4 {
  margin-top: 1rem;
}

@media (max-width: 768px) {
  .info-grid {
    grid-template-columns: 1fr;
  }
  
  .car-preview-header {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .car-preview-title {
    margin-bottom: 0.5rem;
  }
}
</style> 