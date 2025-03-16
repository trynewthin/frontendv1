<template>
  <div class="user-statistics-panel">
    <!-- 用户统计概览 -->
    <BasePanel title="用户统计概览" class="stats-overview-panel">
      <div class="stats-overview">
        <div class="stats-card">
          <div class="stats-icon user-icon">
            <i class="fas fa-user"></i>
          </div>
          <div class="stats-content">
            <div class="stats-label">用户总数</div>
            <div class="stats-value">{{ statsData.total_users || 0 }}</div>
            <div class="stats-trend" :class="{'up': statsData.user_growth > 0, 'down': statsData.user_growth < 0}">
              {{ formatGrowthRate(statsData.user_growth) }}
            </div>
          </div>
        </div>
        
        <div class="stats-card">
          <div class="stats-icon customer-icon">
            <i class="fas fa-users"></i>
          </div>
          <div class="stats-content">
            <div class="stats-label">普通用户</div>
            <div class="stats-value">{{ statsData.customer_count || 0 }}</div>
            <div class="stats-trend">
              {{ formatPercentage(statsData.customer_count, statsData.total_users) }}
            </div>
          </div>
        </div>
        
        <div class="stats-card">
          <div class="stats-icon dealer-icon">
            <i class="fas fa-store"></i>
          </div>
          <div class="stats-content">
            <div class="stats-label">经销商用户</div>
            <div class="stats-value">{{ statsData.dealer_count || 0 }}</div>
            <div class="stats-trend">
              {{ formatPercentage(statsData.dealer_count, statsData.total_users) }}
            </div>
          </div>
        </div>
        
        <div class="stats-card">
          <div class="stats-icon admin-icon">
            <i class="fas fa-user-shield"></i>
          </div>
          <div class="stats-content">
            <div class="stats-label">管理员</div>
            <div class="stats-value">{{ statsData.admin_count || 0 }}</div>
            <div class="stats-trend">
              {{ formatPercentage(statsData.admin_count, statsData.total_users) }}
            </div>
          </div>
        </div>
      </div>
    </BasePanel>

    <!-- 活跃用户统计 -->
    <BasePanel title="用户活跃趋势" class="stats-panel">
      <table class="stats-table">
        <thead>
          <tr>
            <th>日期</th>
            <th>活跃用户</th>
            <th>新增用户</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(item, index) in statsData.user_trend || []" :key="index">
            <td>{{ item.date }}</td>
            <td>{{ item.active_users }}</td>
            <td>{{ item.new_users }}</td>
          </tr>
          <tr v-if="!statsData.user_trend || statsData.user_trend.length === 0">
            <td colspan="3" class="no-data">暂无数据</td>
          </tr>
        </tbody>
      </table>
    </BasePanel>

    <!-- 用户地区分布 -->
    <BasePanel v-if="hasRegionData" title="用户地区分布" class="stats-panel">
      <table class="stats-table">
        <thead>
          <tr>
            <th>地区</th>
            <th>用户数</th>
            <th>占比</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(count, region) in statsData.user_region_distribution" :key="region">
            <td>{{ region || '未知' }}</td>
            <td>{{ count }}</td>
            <td>{{ formatPercentage(count, statsData.total_users) }}</td>
          </tr>
          <tr v-if="!hasRegionData">
            <td colspan="3" class="no-data">暂无数据</td>
          </tr>
        </tbody>
      </table>
    </BasePanel>

    <!-- 加载状态 -->
    <div v-if="loading" class="loading-container">
      <div class="loading-spinner"></div>
      <p>正在加载用户统计数据...</p>
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
import { ref, computed, defineProps, defineEmits, onMounted, watch } from 'vue';
import { userStatisticsService } from '@/services';
import BasePanel from '../../../components/card/BasePanel.vue';

// 格式化日期为YYYY-MM-DD字符串的辅助函数
function formatDateToString(date) {
  return `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`;
}

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
  groupBy: {
    type: String,
    default: 'DAY',
    validator: (value) => ['DAY', 'WEEK', 'MONTH'].includes(value)
  },
  userType: {
    type: String,
    default: 'ALL'
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
const hasRegionData = computed(() => {
  return statsData.value && 
         statsData.value.user_region_distribution && 
         Object.keys(statsData.value.user_region_distribution).length > 0;
});

// 监听属性变化，重新加载数据
watch(() => [props.startDate, props.endDate, props.groupBy, props.userType], () => {
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
      groupBy: props.groupBy,
      userType: props.userType
    };
    
    const response = await userStatisticsService.getUserStatistics(params);
    
    if (response.code === 200) {
      statsData.value = response.data || {};
      emit('loaded', statsData.value);
    } else {
      error.value = response.message || '获取用户统计数据失败';
      emit('error', error.value);
    }
  } catch (err) {
    error.value = err.message || '获取用户统计数据出错';
    emit('error', error.value);
  } finally {
    loading.value = false;
  }
}

// 格式化百分比
function formatPercentage(value, total) {
  if (!total) return '0%';
  const percentage = (value / total * 100).toFixed(1);
  return `${percentage}%`;
}

// 格式化增长率
function formatGrowthRate(rate) {
  if (!rate && rate !== 0) return '0.0%';
  
  if (rate > 0) {
    return `↑ ${rate.toFixed(1)}%`;
  } else if (rate < 0) {
    return `↓ ${Math.abs(rate).toFixed(1)}%`;
  } else {
    return `0.0%`;
  }
}

// 初始化加载
onMounted(() => {
  if (props.autoLoad) {
    fetchStatistics();
  }
});
</script>

<style scoped>
.user-statistics-panel {
  width: 100%;
}

/* 统计概览面板 */
.stats-overview-panel {
  margin-bottom: 2rem;
}

/* 统计概览卡片 */
.stats-overview {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 1.5rem;
}

.stats-card {
  background-color: var(--card-bg-color, #ffffff);
  border-radius: 8px;
  padding: 1.5rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
  border: 1px solid var(--card-border-color, rgba(0, 0, 0, 0.1));
}

.stats-icon {
  width: 3rem;
  height: 3rem;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  color: white;
  font-size: 1.5rem;
  margin-right: 1rem;
}

.user-icon {
  background-color: #1890ff;
}

.customer-icon {
  background-color: #52c41a;
}

.dealer-icon {
  background-color: #fa8c16;
}

.admin-icon {
  background-color: #722ed1;
}

.stats-content {
  flex: 1;
}

.stats-label {
  color: var(--text-color);
  font-size: 0.9rem;
  margin-bottom: 0.25rem;
}

.stats-value {
  font-size: 1.5rem;
  font-weight: 600;
  color: var(--text-color);
  margin-bottom: 0.25rem;
}

.stats-trend {
  font-size: 0.85rem;
  color: var(--secondary-text-color);
}

.stats-trend.up {
  color: #52c41a;
}

.stats-trend.down {
  color: #ff4d4f;
}

/* 统计面板 */
.stats-panel {
  margin-bottom: 2rem;
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
  .stats-card {
    background-color: var(--card-bg-color, #1f1f1f);
    border-color: var(--card-border-color, rgba(255, 255, 255, 0.1));
  }
  
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
  .stats-overview {
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