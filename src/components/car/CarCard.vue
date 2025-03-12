<template>
  <div class="car-card">
    <div class="car-image">
      <img :src="imageWithPrefix" :alt="car.brand + ' ' + car.model" />
    </div>
    <div class="car-info">
      <h3 class="car-title">{{ car.brand }} {{ car.model }}</h3>
      <div class="car-meta">
        <span class="car-year">{{ car.year }}年</span>
        <span class="car-category">{{ car.category }}</span>
      </div>
      <div class="car-price">¥{{ formatPrice(car.price) }}</div>
      <div class="car-stats">
        <div class="car-stat">
          <i class="icon-view"></i>
          <span>{{ car.viewCount || 0 }}浏览</span>
        </div>
        <div class="car-stat">
          <i class="icon-favorite"></i>
          <span>{{ car.favoriteCount || 0 }}收藏</span>
        </div>
      </div>
      <div v-if="car.recommendReason" class="car-reason">
        <p>推荐理由: {{ car.recommendReason }}</p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'CarCard',
  props: {
    car: {
      type: Object,
      required: true
    }
  },
  computed: {
    // 添加localhost:8090前缀到车辆图片
    imageWithPrefix() {
      if (!this.car.mainImage) return '';
      // 检查图片路径是否已经包含前缀
      if (this.car.mainImage.startsWith('http')) {
        return this.car.mainImage;
      }
      return `http://localhost:8090${this.car.mainImage}`;
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
  background-color: #fff;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  display: flex;
  flex-direction: column;
  height: 100%;
}

.car-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
}

.car-image {
  width: 100%;
  height: 180px;
  overflow: hidden;
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

.car-info {
  padding: 16px;
  display: flex;
  flex-direction: column;
  flex-grow: 1;
}

.car-title {
  margin: 0 0 8px 0;
  font-size: 18px;
  font-weight: 600;
  color: #333;
  line-height: 1.2;
  height: 44px;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}

.car-meta {
  display: flex;
  margin-bottom: 12px;
  color: #666;
  font-size: 14px;
}

.car-year {
  margin-right: 8px;
  padding-right: 8px;
  border-right: 1px solid #e0e0e0;
}

.car-category {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.car-price {
  font-size: 20px;
  font-weight: 700;
  color: #e53935;
  margin-bottom: 16px;
}

.car-stats {
  display: flex;
  margin-top: auto;
  color: #888;
  font-size: 13px;
}

.car-stat {
  display: flex;
  align-items: center;
  margin-right: 16px;
}

.car-stat i {
  margin-right: 4px;
  font-size: 16px;
}

.icon-view:before {
  content: "👁️";
}

.icon-favorite:before {
  content: "❤️";
}

.car-reason {
  margin-top: 12px;
  padding-top: 12px;
  border-top: 1px solid #f0f0f0;
  font-size: 13px;
  color: #666;
}

.car-reason p {
  margin: 0;
  line-height: 1.4;
}

@media (max-width: 768px) {
  .car-image {
    height: 150px;
  }
  
  .car-title {
    font-size: 16px;
    height: 38px;
  }
  
  .car-price {
    font-size: 18px;
  }
}
</style> 