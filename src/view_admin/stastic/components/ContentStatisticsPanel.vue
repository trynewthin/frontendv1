<template>
  <div class="content-statistics-panel">
    <!-- 车辆分布统计 -->
    <div class="stats-section">
      <div class="stats-row">
        <!-- 价格分布 -->
        <BasePanel class="stats-panel" title="价格分布">
          <table class="stats-table">
            <thead>
              <tr>
                <th>价格区间</th>
                <th>数量</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(item, index) in statsData.car_price_distribution" :key="index">
                <td>{{ item.range }}</td>
                <td>{{ item.count }}</td>
              </tr>
              <tr v-if="!statsData.car_price_distribution || statsData.car_price_distribution.length === 0">
                <td colspan="2" class="no-data">暂无数据</td>
              </tr>
            </tbody>
          </table>
        </BasePanel>

        <!-- 车辆状态分布 -->
        <BasePanel class="stats-panel" title="车辆状态分布">
          <table class="stats-table">
            <thead>
              <tr>
                <th>状态</th>
                <th>数量</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(count, status) in statsData.car_status_distribution" :key="status">
                <td>{{ formatCarStatus(status) }}</td>
                <td>{{ count }}</td>
              </tr>
              <tr v-if="!statsData.car_status_distribution || Object.keys(statsData.car_status_distribution).length === 0">
                <td colspan="2" class="no-data">暂无数据</td>
              </tr>
            </tbody>
          </table>
        </BasePanel>
      </div>

      <div class="stats-row">
        <!-- 车型分类分布 -->
        <BasePanel class="stats-panel" title="车型分类分布">
          <table class="stats-table">
            <thead>
              <tr>
                <th>车型分类</th>
                <th>数量</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(item, index) in statsData.car_category_distribution" :key="index">
                <td>{{ item.category }}</td>
                <td>{{ item.count }}</td>
              </tr>
              <tr v-if="!statsData.car_category_distribution || statsData.car_category_distribution.length === 0">
                <td colspan="2" class="no-data">暂无数据</td>
              </tr>
            </tbody>
          </table>
        </BasePanel>

        <!-- 品牌分布 -->
        <BasePanel class="stats-panel" title="品牌分布">
          <table class="stats-table">
            <thead>
              <tr>
                <th>品牌</th>
                <th>数量</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(item, index) in statsData.car_brand_distribution" :key="index">
                <td>{{ item.brand }}</td>
                <td>{{ item.count }}</td>
              </tr>
              <tr v-if="!statsData.car_brand_distribution || statsData.car_brand_distribution.length === 0">
                <td colspan="2" class="no-data">暂无数据</td>
              </tr>
            </tbody>
          </table>
        </BasePanel>
      </div>
    </div>

    <!-- 加载状态 -->
    <div v-if="loading" class="loading-container">
      <div class="loading-spinner"></div>
      <p>正在加载内容统计数据...</p>
    </div>

    <!-- 错误信息 -->
    <div v-if="error" class="error-message">
      <i class="fas fa-exclamation-triangle"></i>
      <span>{{ error }}</span>
      <button @click="fetchStatistics" class="retry-btn">重试</button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import { contentStatisticsService } from '@/services';
import BasePanel from '../../../components/card/BasePanel.vue';

const props = defineProps({
  startDate: {
    type: String,
    default: () => {
      const date = new Date();
      date.setDate(date.getDate() - 30);
      return `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`;
    }
  },
  endDate: {
    type: String,
    default: () => {
      const date = new Date();
      return `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`;
    }
  },
  contentType: {
    type: String,
    default: 'ALL'
  },
  groupBy: {
    type: String,
    default: 'DAY'
  },
  autoLoad: {
    type: Boolean,
    default: true
  }
});

const emit = defineEmits(['loaded', 'error']);

// 状态
const loading = ref(false);
const error = ref('');
const statsData = ref({});

// 计算属性
const hasTrendData = computed(() => {
  return statsData.value && 
         statsData.value.car_trend && 
         statsData.value.car_trend.length > 0;
});

// 监听参数变化，重新加载数据
watch(() => [props.startDate, props.endDate, props.contentType, props.groupBy], () => {
  if (props.autoLoad) {
    fetchStatistics();
  }
}, { deep: true });

// 获取统计数据
async function fetchStatistics() {
  loading.value = true;
  error.value = '';
  
  try {
    const params = {
      startDate: props.startDate,
      endDate: props.endDate,
      contentType: props.contentType,
      groupBy: props.groupBy
    };
    
    const response = await contentStatisticsService.getContentStatistics(params);
    
    if (response && response.code === 200) {
      statsData.value = response.data || {};
      emit('loaded', statsData.value);
    } else {
      error.value = response.message || '获取内容统计数据失败';
      emit('error', error.value);
    }
  } catch (err) {
    error.value = err.message || '获取内容统计数据出错';
    emit('error', error.value);
  } finally {
    loading.value = false;
  }
}

// 格式化车辆状态
function formatCarStatus(status) {
  const statusMap = {
    '0': '待审核',
    '1': '已通过',
    '2': '已拒绝'
  };
  return statusMap[status] || status;
}

// 初始化加载
onMounted(() => {
  if (props.autoLoad) {
    fetchStatistics();
  }
});
</script>

<style scoped>
.content-statistics-panel {
  width: 100%;
}

/* 统计区域 */
.stats-section {
  margin-bottom: 2rem;
}

.section-title {
  font-size: 1.2rem;
  color: var(--text-color);
  margin-bottom: 1rem;
  font-weight: 500;
}

.stats-row {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1.5rem;
  margin-bottom: 1.5rem;
}

.stats-panel {
  min-height: auto !important;
  height: auto !important;
  margin-bottom: 1.5rem;
}

/* 统计表格 */
.stats-table {
  width: 100%;
  border-collapse: collapse;
}

.stats-table th,
.stats-table td {
  padding: 0.75rem;
  text-align: left;
  border-bottom: 1px solid var(--card-border-color);
  color: var(--text-color);
}

.stats-table th {
  font-weight: 600;
  color: var(--text-color);
}

.no-data {
  text-align: center;
  color: var(--secondary-text-color);
  font-style: italic;
  padding: 1rem 0;
}

/* 加载状态 */
.loading-container {
  padding: 2rem;
  text-align: center;
  color: var(--text-color);
}

.loading-spinner {
  display: inline-block;
  width: 2rem;
  height: 2rem;
  border: 3px solid rgba(0, 0, 0, 0.1);
  border-top-color: var(--primary-color);
  border-radius: 50%;
  animation: spin 1s infinite linear;
  margin-bottom: 1rem;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

/* 错误信息 */
.error-message {
  padding: 1rem;
  text-align: center;
  color: #ff4d4f;
  background-color: rgba(255, 77, 79, 0.1);
  border-radius: 8px;
  margin: 1rem 0;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
}

.retry-btn {
  background-color: rgba(0, 0, 0, 0.05);
  color: var(--text-color);
  border: 1px solid rgba(0, 0, 0, 0.1);
  padding: 0.25rem 0.75rem;
  border-radius: 4px;
  margin-left: 1rem;
  cursor: pointer;
}

.retry-btn:hover {
  background-color: rgba(0, 0, 0, 0.08);
}

/* 深色模式适配 */
:root[data-theme="dark"] {
  .loading-spinner {
    border-color: rgba(255, 255, 255, 0.1);
    border-top-color: var(--primary-color);
  }

  .error-message {
    background-color: rgba(255, 77, 79, 0.15);
  }

  .retry-btn {
    background-color: rgba(255, 255, 255, 0.04);
    border-color: rgba(255, 255, 255, 0.15);
  }

  .retry-btn:hover {
    background-color: rgba(255, 255, 255, 0.08);
  }
}

@media (max-width: 768px) {
  .stats-row {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
  
  .stats-table th,
  .stats-table td {
    padding: 0.5rem;
    font-size: 0.85rem;
  }
}
</style>
