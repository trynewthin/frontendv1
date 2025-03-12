<template>
  <div class="car-detail-view">
    <div class="detail-container">
      <h1 class="detail-title">车辆详情</h1>
      
      <div v-if="loading" class="loading-state">
        <va-inner-loading :loading="true">
          <div class="loading-placeholder"></div>
        </va-inner-loading>
      </div>
      
      <div v-else-if="error" class="error-state">
        <p>{{ error }}</p>
        <va-button @click="goBack" preset="secondary">返回</va-button>
      </div>
      
      <div v-else-if="car" class="car-info">
        <p class="car-id">车辆ID: {{ carId }}</p>
        <p>这是{{ car.brand }} {{ car.model }}的详情页</p>
        <va-button @click="goBack" preset="primary">返回列表</va-button>
      </div>
      
      <div v-else class="empty-state">
        <p>未找到车辆信息</p>
        <va-button @click="goBack" preset="secondary">返回</va-button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useToast } from 'vuestic-ui';
import carService from '@/api/carService';

const route = useRoute();
const router = useRouter();
const { init: initToast } = useToast();

const carId = ref(route.params.id);
const car = ref(null);
const loading = ref(true);
const error = ref(null);

// 获取车辆详情
const fetchCarDetail = async () => {
  loading.value = true;
  error.value = null;
  
  try {
    // 这里假设carService有getCarById方法
    // 如果没有，可以从cars列表中筛选或者创建一个模拟数据
    const response = await carService.getCars();
    
    if (response.success) {
      // 从所有车辆中找到当前ID的车辆
      const foundCar = response.data.find(c => c.carId == carId.value);
      
      if (foundCar) {
        car.value = foundCar;
      } else {
        error.value = '未找到该车辆信息';
      }
    } else {
      error.value = response.message || '获取车辆详情失败';
    }
  } catch (err) {
    console.error('获取车辆详情出错:', err);
    error.value = '获取车辆详情时发生错误';
  } finally {
    loading.value = false;
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
  padding: 2rem;
  width: 100%;
  box-sizing: border-box;
}

.detail-container {
  max-width: 1200px;
  margin: 0 auto;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
  padding: 2rem;
}

.detail-title {
  margin-bottom: 2rem;
  font-size: 1.8rem;
  color: #333;
  text-align: center;
}

.loading-placeholder {
  height: 300px;
}

.error-state,
.empty-state {
  text-align: center;
  padding: 2rem;
  color: #909399;
}

.car-info {
  padding: 1rem;
}

.car-id {
  color: #666;
  margin-bottom: 1rem;
  font-size: 0.9rem;
}

@media (max-width: 768px) {
  .car-detail-view {
    padding: 1rem;
  }
  
  .detail-container {
    padding: 1.5rem;
  }
}
</style> 