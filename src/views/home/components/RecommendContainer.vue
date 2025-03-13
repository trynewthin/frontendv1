<template>
  <div class="recommend-container">
    <!-- 顶部导航栏 - 自定义实现 -->
    <div v-if="!loading && !error" class="custom-tabs-container">
      <div class="custom-tabs">
        <div 
          v-if="showNewCarRecommendations && newCarRecommendations.length > 0" 
          class="custom-tab-item" 
          :class="{ 'active': activeTab === 'newCar' }"
          @click="activeTab = 'newCar'"
        >
          新车推荐
        </div>
        <div 
          v-if="showHotRecommendations && hotRecommendations.length > 0" 
          class="custom-tab-item" 
          :class="{ 'active': activeTab === 'hot' }"
          @click="activeTab = 'hot'"
        >
          热门推荐
        </div>
        <div 
          v-if="isLoggedIn && showPreferenceRecommendations && preferenceRecommendations.length > 0" 
          class="custom-tab-item" 
          :class="{ 'active': activeTab === 'preference' }"
          @click="activeTab = 'preference'"
        >
          偏好推荐
        </div>
        <div 
          v-if="isLoggedIn && showBehaviorRecommendations && behaviorRecommendations.length > 0" 
          class="custom-tab-item" 
          :class="{ 'active': activeTab === 'behavior' }"
          @click="activeTab = 'behavior'"
        >
          行为推荐
        </div>
      </div>
    </div>

    <div v-if="loading" class="loading-state">
      <va-progress-circle indeterminate color="primary" />
      <p>正在加载推荐车辆...</p>
    </div>
    
    <div v-else-if="error" class="error-state">
      <va-alert color="danger" icon="warning">
        {{ error }}
      </va-alert>
      <va-button class="mt-3" color="primary" @click="fetchRecommendations">
        重试
      </va-button>
    </div>
    
    <div v-else>
      <!-- 新车推荐 -->
      <div v-if="activeTab === 'newCar' && showNewCarRecommendations && newCarRecommendations.length > 0" class="recommendation-section">
        <div class="car-grid">
          <div v-for="car in newCarRecommendations" :key="car.carId" class="car-grid-item">
            <car-card :car="car" />
          </div>
        </div>
      </div>
      
      <!-- 热门推荐 -->
      <div v-if="activeTab === 'hot' && showHotRecommendations && hotRecommendations.length > 0" class="recommendation-section">
        <div class="car-grid">
          <div v-for="car in hotRecommendations" :key="car.carId" class="car-grid-item">
            <car-card :car="car" />
          </div>
        </div>
      </div>
      
      <!-- 偏好推荐 (需要登录) -->
      <div v-if="activeTab === 'preference' && isLoggedIn && showPreferenceRecommendations && preferenceRecommendations.length > 0" class="recommendation-section">
        <div class="car-grid">
          <div v-for="car in preferenceRecommendations" :key="car.carId" class="car-grid-item">
            <car-card :car="car" />
          </div>
        </div>
      </div>
      
      <!-- 行为推荐 (需要登录) -->
      <div v-if="activeTab === 'behavior' && isLoggedIn && showBehaviorRecommendations && behaviorRecommendations.length > 0" class="recommendation-section">
        <div class="car-grid">
          <div v-for="car in behaviorRecommendations" :key="car.carId" class="car-grid-item">
            <car-card :car="car" />
          </div>
        </div>
      </div>
      
      <!-- 没有推荐数据时显示 -->
      <div v-if="noRecommendationsAvailable" class="no-data">
        <va-alert color="info" icon="info">
          暂无推荐车辆
        </va-alert>
      </div>
    </div>
  </div>
</template>

<script>
import CarCard from '../../../components/car/CarCard.vue';
import recommendationService from '../../../api/recommendationService';

export default {
  name: 'RecommendContainer',
  components: {
    CarCard
  },
  props: {
    // 控制显示哪些推荐类型
    showNewCarRecommendations: {
      type: Boolean,
      default: true
    },
    showHotRecommendations: {
      type: Boolean,
      default: true
    },
    showPreferenceRecommendations: {
      type: Boolean,
      default: true
    },
    showBehaviorRecommendations: {
      type: Boolean,
      default: true
    },
    // 每种推荐类型的数量限制
    limit: {
      type: Number,
      default: 4
    },
    // 是否显示所有推荐
    showAllRecommendations: {
      type: Boolean,
      default: false
    },
    // 默认选中的标签
    defaultTab: {
      type: String,
      default: 'newCar',
      validator: (value) => ['newCar', 'hot', 'preference', 'behavior'].includes(value)
    },
    // 查询参数
    queryParams: {
      type: Object,
      default: () => ({})
    }
  },
  data() {
    return {
      loading: true,
      error: null,
      newCarRecommendations: [],
      hotRecommendations: [],
      preferenceRecommendations: [],
      behaviorRecommendations: [],
      activeTab: this.defaultTab // 当前激活的标签
    };
  },
  computed: {
    isLoggedIn() {
      return !!localStorage.getItem('token');
    },
    noRecommendationsAvailable() {
      return (
        this.newCarRecommendations.length === 0 &&
        this.hotRecommendations.length === 0 &&
        this.preferenceRecommendations.length === 0 &&
        this.behaviorRecommendations.length === 0
      );
    },
    // 合并默认查询参数和传入的查询参数
    mergedQueryParams() {
      return {
        limit: this.limit,
        ...this.queryParams
      };
    }
  },
  watch: {
    // 监听数据加载完成，自动选择第一个可用的标签
    loading(newValue) {
      if (!newValue && !this.error) {
        this.selectFirstAvailableTab();
      }
    }
  },
  mounted() {
    this.fetchRecommendations();
  },
  methods: {
    // 选择第一个可用的标签
    selectFirstAvailableTab() {
      // 检查默认标签是否可用
      const defaultTabValid = this.isTabAvailable(this.activeTab);
      
      if (!defaultTabValid) {
        // 按优先级检查各标签是否可用
        if (this.showNewCarRecommendations && this.newCarRecommendations.length > 0) {
          this.activeTab = 'newCar';
        } else if (this.showHotRecommendations && this.hotRecommendations.length > 0) {
          this.activeTab = 'hot';
        } else if (this.isLoggedIn && this.showPreferenceRecommendations && this.preferenceRecommendations.length > 0) {
          this.activeTab = 'preference';
        } else if (this.isLoggedIn && this.showBehaviorRecommendations && this.behaviorRecommendations.length > 0) {
          this.activeTab = 'behavior';
        }
      }
    },
    
    // 检查标签是否可用
    isTabAvailable(tab) {
      switch (tab) {
        case 'newCar':
          return this.showNewCarRecommendations && this.newCarRecommendations.length > 0;
        case 'hot':
          return this.showHotRecommendations && this.hotRecommendations.length > 0;
        case 'preference':
          return this.isLoggedIn && this.showPreferenceRecommendations && this.preferenceRecommendations.length > 0;
        case 'behavior':
          return this.isLoggedIn && this.showBehaviorRecommendations && this.behaviorRecommendations.length > 0;
        default:
          return false;
      }
    },
    
    async fetchRecommendations() {
      this.loading = true;
      this.error = null;
      
      try {
        if (this.showAllRecommendations) {
          // 获取所有推荐
          await this.fetchAllRecommendations();
        } else {
          // 并行获取各类推荐
          const promises = [];
          
          if (this.showNewCarRecommendations) {
            promises.push(this.fetchNewCarRecommendations());
          }
          
          if (this.showHotRecommendations) {
            promises.push(this.fetchHotRecommendations());
          }
          
          if (this.showPreferenceRecommendations && this.isLoggedIn) {
            promises.push(this.fetchPreferenceRecommendations());
          }
          
          if (this.showBehaviorRecommendations && this.isLoggedIn) {
            promises.push(this.fetchBehaviorRecommendations());
          }
          
          await Promise.all(promises);
        }
      } catch (error) {
        console.error('获取推荐数据失败:', error);
        this.error = '获取推荐数据失败，请稍后重试';
      } finally {
        this.loading = false;
      }
    },
    
    async fetchAllRecommendations() {
      const response = await recommendationService.getAllRecommendations(this.mergedQueryParams);
      
      if (response.success && response.data) {
        this.newCarRecommendations = response.data.newCar || [];
        this.hotRecommendations = response.data.hot || [];
        this.preferenceRecommendations = response.data.preference || [];
        this.behaviorRecommendations = response.data.behavior || [];
      } else {
        throw new Error(response.message || '获取所有推荐失败');
      }
    },
    
    async fetchNewCarRecommendations() {
      try {
        const response = await recommendationService.getNewCarRecommendations(this.mergedQueryParams);
        
        if (response.success && response.data) {
          this.newCarRecommendations = Array.isArray(response.data) ? response.data : [response.data];
        } else {
          console.warn('获取新车推荐失败:', response.message);
          this.newCarRecommendations = [];
        }
      } catch (error) {
        console.error('获取新车推荐出错:', error);
        this.newCarRecommendations = [];
      }
    },
    
    async fetchHotRecommendations() {
      try {
        const response = await recommendationService.getHotRecommendations(this.mergedQueryParams);
        
        if (response.success && response.data) {
          this.hotRecommendations = Array.isArray(response.data) ? response.data : [response.data];
        } else {
          console.warn('获取热门推荐失败:', response.message);
          this.hotRecommendations = [];
        }
      } catch (error) {
        console.error('获取热门推荐出错:', error);
        this.hotRecommendations = [];
      }
    },
    
    async fetchPreferenceRecommendations() {
      try {
        const response = await recommendationService.getPreferenceRecommendations(this.mergedQueryParams);
        
        if (response.success && response.data) {
          this.preferenceRecommendations = Array.isArray(response.data) ? response.data : [response.data];
        } else {
          console.warn('获取偏好推荐失败:', response.message);
          this.preferenceRecommendations = [];
        }
      } catch (error) {
        console.error('获取偏好推荐出错:', error);
        this.preferenceRecommendations = [];
      }
    },
    
    async fetchBehaviorRecommendations() {
      try {
        const response = await recommendationService.getBehaviorRecommendations(this.mergedQueryParams);
        
        if (response.success && response.data) {
          this.behaviorRecommendations = Array.isArray(response.data) ? response.data : [response.data];
        } else {
          console.warn('获取行为推荐失败:', response.message);
          this.behaviorRecommendations = [];
        }
      } catch (error) {
        console.error('获取行为推荐出错:', error);
        this.behaviorRecommendations = [];
      }
    }
  }
};
</script>

<style scoped>
.recommend-container {
  width: 100%;
  padding: 20px 20px;
  box-sizing: border-box;
}

/* 自定义标签导航样式 */
.custom-tabs-container {
  display: flex;
  justify-content: center;
  margin-bottom: 30px;
}

.custom-tabs {
  display: flex;
  justify-content: center;
  gap: 30px;
  width: 100%;
  max-width: 800px;
  border-bottom: 1px solid #333;
  padding-bottom: 12px;
  box-sizing: border-box;
}

:root[data-theme="dark"] .custom-tabs {
  border-bottom: 1px solid #FFD700;
}

.custom-tab-item {
  font-size: 20px;
  font-weight: 500;
  color: #333;
  padding: 10px 6px;
  cursor: pointer;
  position: relative;
  white-space: nowrap;
  transition: all 0.3s;
}

:root[data-theme="dark"] .custom-tab-item {
  color: #FFD700;
}

.custom-tab-item:hover {
  color: #000;
}

:root[data-theme="dark"] .custom-tab-item:hover {
  color: #FFF;
}

.custom-tab-item.active {
  color: #000;
  font-weight: 600;
}

:root[data-theme="dark"] .custom-tab-item.active {
  color: #FFF;
  font-weight: 600;
}

.custom-tab-item.active::after {
  content: '';
  position: absolute;
  bottom: -13px;
  left: 0;
  width: 100%;
  height: 3px;
  background-color: #333;
  border-radius: 2px;
}

:root[data-theme="dark"] .custom-tab-item.active::after {
  background-color: #FFD700;
}

.loading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px 0;
}

.error-state {
  text-align: center;
  padding: 40px 0;
}

.mt-3 {
  margin-top: 1rem;
}

.recommendation-section {
  margin-bottom: 40px;
}

.section-title {
  font-size: 24px;
  font-weight: 600;
  margin-bottom: 20px;
  color: #333;
  position: relative;
  padding-left: 12px;
}

.section-title::before {
  content: '';
  position: absolute;
  left: 0;
  top: 4px;
  bottom: 4px;
  width: 4px;
  background-color: #4a9cf6;
  border-radius: 2px;
}

.car-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 24px;
}

.car-grid-item {
  height: 100%;
}

.no-data {
  text-align: center;
  padding: 60px 0;
}

@media (max-width: 768px) {
  .recommend-container {
    padding: 16px 0;
  }
  
  .custom-tabs {
    gap: 20px;
    max-width: 100%;
    padding-left: 16px;
    padding-right: 16px;
    overflow-x: auto;
  }
  
  .custom-tab-item {
    font-size: 16px;
    padding: 8px 5px;
  }
  
  .car-grid {
    grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
    gap: 16px;
  }
  
  .section-title {
    font-size: 20px;
    margin-bottom: 16px;
  }
}
</style> 