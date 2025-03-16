<template>
  <div class="system-statistics-panel">
    <!-- 统计概览卡片区域 -->
    <BasePanel class="stats-overview-panel" title="系统概览">
      <div class="stats-overview">
        <!-- 用户统计卡片 -->
        <div class="stats-card">
          <div class="stats-icon user-icon">
            <i class="fas fa-users"></i>
          </div>
          <div class="stats-content">
            <div class="stats-label">活跃用户数</div>
            <div class="stats-value">{{ statsData.user_activity_stats?.active_users || 0 }}</div>
            <div class="stats-desc">
              总用户数：{{ statsData.user_activity_stats?.total_users || 0 }}
            </div>
          </div>
        </div>

        <!-- 车辆统计卡片 -->
        <div class="stats-card">
          <div class="stats-icon car-icon">
            <i class="fas fa-car"></i>
          </div>
          <div class="stats-content">
            <div class="stats-label">车辆总数</div>
            <div class="stats-value">{{ statsData.car_stats?.total_cars || 0 }}</div>
            <div class="stats-desc">
              可用车辆：{{ statsData.car_stats?.inventory_stats?.available_cars || 0 }}
            </div>
          </div>
        </div>

        <!-- 经销商统计卡片 -->
        <div class="stats-card">
          <div class="stats-icon dealer-icon">
            <i class="fas fa-store"></i>
          </div>
          <div class="stats-content">
            <div class="stats-label">经销商数量</div>
            <div class="stats-value">{{ statsData.dealer_stats?.total_dealers || 0 }}</div>
            <div class="stats-desc">
              活跃经销商：{{ statsData.dealer_stats?.active_dealers || 0 }}
            </div>
          </div>
        </div>

        <!-- 预约统计卡片 -->
        <div class="stats-card">
          <div class="stats-icon appointment-icon">
            <i class="fas fa-calendar-check"></i>
          </div>
          <div class="stats-content">
            <div class="stats-label">预约总数</div>
            <div class="stats-value">{{ statsData.appointment_stats?.total_appointments || 0 }}</div>
            <div class="stats-desc">
              新增：{{ statsData.appointment_stats?.new_appointments || 0 }}
            </div>
          </div>
        </div>
      </div>
    </BasePanel>

    <!-- 车辆统计详情 -->
    <div class="stats-section">
      <div class="stats-row">
        <!-- 车辆库存状态 -->
        <BasePanel class="stats-panel" title="车辆库存状态">
          <table class="stats-table">
            <tbody>
              <tr>
                <th>总车辆数</th>
                <td>{{ statsData.car_stats?.total_cars || 0 }}</td>
              </tr>
              <tr>
                <th>可用车辆</th>
                <td>{{ statsData.car_stats?.inventory_stats?.available_cars || 0 }}</td>
              </tr>
              <tr>
                <th>已预约车辆</th>
                <td>{{ statsData.car_stats?.inventory_stats?.reserved_cars || 0 }}</td>
              </tr>
              <tr>
                <th>已售车辆</th>
                <td>{{ statsData.car_stats?.inventory_stats?.sold_cars || 0 }}</td>
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
              <tr v-for="(count, status) in statsData.car_stats?.status_distribution" :key="status">
                <td>{{ formatCarStatus(status) }}</td>
                <td>{{ count }}</td>
              </tr>
              <tr v-if="!statsData.car_stats?.status_distribution">
                <td colspan="2" class="no-data">暂无数据</td>
              </tr>
            </tbody>
          </table>
        </BasePanel>
      </div>

      <!-- 品牌分布 -->
      <BasePanel class="stats-panel" title="品牌分布" v-if="hasBrandData">
        <table class="stats-table">
          <thead>
            <tr>
              <th>品牌</th>
              <th>数量</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(count, brand) in statsData.car_stats?.brand_distribution" :key="brand">
              <td>{{ brand }}</td>
              <td>{{ count }}</td>
            </tr>
          </tbody>
        </table>
      </BasePanel>
    </div>

    <!-- 预约统计详情 -->
    <div class="stats-section">
      <div class="stats-row">
        <!-- 预约完成情况 -->
        <BasePanel class="stats-panel" title="预约完成情况">
          <table class="stats-table">
            <tbody>
              <tr>
                <th>总预约数</th>
                <td>{{ statsData.appointment_stats?.total_appointments || 0 }}</td>
              </tr>
              <tr>
                <th>待处理预约</th>
                <td>{{ statsData.appointment_stats?.completion_stats?.pending_appointments || 0 }}</td>
              </tr>
              <tr>
                <th>已完成预约</th>
                <td>{{ statsData.appointment_stats?.completion_stats?.completed_appointments || 0 }}</td>
              </tr>
              <tr>
                <th>已取消预约</th>
                <td>{{ statsData.appointment_stats?.completion_stats?.cancelled_appointments || 0 }}</td>
              </tr>
            </tbody>
          </table>
        </BasePanel>

        <!-- 预约状态分布 -->
        <BasePanel class="stats-panel" title="预约状态分布">
          <table class="stats-table">
            <thead>
              <tr>
                <th>状态</th>
                <th>数量</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(count, status) in statsData.appointment_stats?.status_distribution" :key="status">
                <td>{{ status }}</td>
                <td>{{ count }}</td>
              </tr>
              <tr v-if="!statsData.appointment_stats?.status_distribution">
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
      <p>正在加载系统统计数据...</p>
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
import { systemStatisticsService } from '@/services';
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
const hasBrandData = computed(() => {
  return statsData.value && 
         statsData.value.car_stats?.brand_distribution && 
         Object.keys(statsData.value.car_stats.brand_distribution).length > 0;
});

// 监听日期变化，重新加载数据
watch(() => [props.startDate, props.endDate], () => {
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
      endDate: props.endDate
    };
    
    const response = await systemStatisticsService.getSystemStatistics(params);
    
    if (response.code === 200) {
      statsData.value = response.data || {};
      emit('loaded', statsData.value);
    } else {
      error.value = response.message || '获取系统统计数据失败';
      emit('error', error.value);
    }
  } catch (err) {
    error.value = err.message || '获取系统统计数据出错';
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
.system-statistics-panel {
  width: 100%;
}

/* 统计概览面板 */
.stats-overview-panel {
  margin-bottom: 2rem;
  min-height: auto !important;
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

.car-icon {
  background-color: #52c41a;
}

.dealer-icon {
  background-color: #fa8c16;
}

.appointment-icon {
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

.stats-desc {
  font-size: 0.85rem;
  color: var(--secondary-text-color);
  white-space: nowrap;
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