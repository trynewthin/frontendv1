<template>
  <div class="statistics-container">
    <h2 class="page-title">数据统计</h2>
    <div class="content-wrapper">
      <!-- 时间筛选区域 -->
      <div class="filter-section">
        <div class="filter-row">
          <div class="filter-item date-filter">
            <label>统计周期:</label>
            <input type="date" v-model="dateRange.startDate" @change="loadAllStatistics" />
            <span>至</span>
            <input type="date" v-model="dateRange.endDate" @change="loadAllStatistics" />
          </div>
          <div class="filter-item">
            <label>数据分组:</label>
            <select v-model="dateRange.groupBy" @change="loadAllStatistics">
              <option value="DAY">按天</option>
              <option value="WEEK">按周</option>
              <option value="MONTH">按月</option>
            </select>
          </div>
          <button class="query-btn" @click="loadAllStatistics">查询</button>
        </div>
      </div>
      
      <!-- 数据概览卡片 -->
      <div class="stats-overview">
        <div class="stats-card">
          <div class="stats-icon user-icon">
            <i class="fas fa-user"></i>
          </div>
          <div class="stats-content">
            <div class="stats-label">用户总数</div>
            <div class="stats-value">{{ overview.totalUsers }}</div>
            <div class="stats-trend" :class="{'up': overview.userGrowthRate > 0, 'down': overview.userGrowthRate < 0}">
              {{ formatGrowthRate(overview.userGrowthRate) }}
            </div>
          </div>
        </div>
        
        <div class="stats-card">
          <div class="stats-icon car-icon">
            <i class="fas fa-car"></i>
          </div>
          <div class="stats-content">
            <div class="stats-label">车辆总数</div>
            <div class="stats-value">{{ overview.totalCars }}</div>
            <div class="stats-trend" :class="{'up': overview.carGrowthRate > 0, 'down': overview.carGrowthRate < 0}">
              {{ formatGrowthRate(overview.carGrowthRate) }}
            </div>
          </div>
        </div>
        
        <div class="stats-card">
          <div class="stats-icon dealer-icon">
            <i class="fas fa-store"></i>
          </div>
          <div class="stats-content">
            <div class="stats-label">经销商总数</div>
            <div class="stats-value">{{ overview.totalDealers }}</div>
            <div class="stats-trend" :class="{'up': overview.dealerGrowthRate > 0, 'down': overview.dealerGrowthRate < 0}">
              {{ formatGrowthRate(overview.dealerGrowthRate) }}
            </div>
          </div>
        </div>
        
        <div class="stats-card">
          <div class="stats-icon appointment-icon">
            <i class="fas fa-calendar-check"></i>
          </div>
          <div class="stats-content">
            <div class="stats-label">预约总数</div>
            <div class="stats-value">{{ overview.totalAppointments }}</div>
            <div class="stats-trend" :class="{'up': overview.appointmentGrowthRate > 0, 'down': overview.appointmentGrowthRate < 0}">
              {{ formatGrowthRate(overview.appointmentGrowthRate) }}
            </div>
          </div>
        </div>
      </div>

      <!-- 图表区域 -->
      <div class="charts-container">
        <!-- 用户增长趋势图 -->
        <div class="chart-panel">
          <h3 class="chart-title">用户增长趋势</h3>
          <div class="chart-wrapper">
            <div class="chart-placeholder">
              这里将显示用户增长趋势图表
            </div>
          </div>
        </div>

        <!-- 车辆发布趋势图 -->
        <div class="chart-panel">
          <h3 class="chart-title">车辆发布趋势</h3>
          <div class="chart-wrapper">
            <div class="chart-placeholder">
              这里将显示车辆发布趋势图表
            </div>
          </div>
        </div>
        
        <!-- 用户类型分布图 -->
        <div class="chart-panel">
          <h3 class="chart-title">用户类型分布</h3>
          <div class="chart-wrapper">
            <div class="chart-placeholder">
              这里将显示用户类型分布图表
            </div>
          </div>
        </div>

        <!-- 热门车型排行 -->
        <div class="chart-panel">
          <h3 class="chart-title">热门车型排行</h3>
          <div class="chart-wrapper">
            <div class="chart-placeholder">
              这里将显示热门车型排行图表
            </div>
          </div>
        </div>
      </div>
      
      <!-- 详细数据统计表格 -->
      <div class="detailed-stats">
        <h3 class="section-title">详细统计数据</h3>
        
        <!-- 标签页切换 -->
        <div class="tabs">
          <button 
            class="tab-btn" 
            :class="{ active: activeTab === 'users' }"
            @click="activeTab = 'users'"
          >
            用户统计
          </button>
          <button 
            class="tab-btn" 
            :class="{ active: activeTab === 'cars' }"
            @click="activeTab = 'cars'"
          >
            车辆统计
          </button>
          <button 
            class="tab-btn" 
            :class="{ active: activeTab === 'appointments' }"
            @click="activeTab = 'appointments'"
          >
            预约统计
          </button>
        </div>
        
        <!-- 用户统计表格 -->
        <div v-if="activeTab === 'users'" class="stats-table-container">
          <table class="stats-table">
            <thead>
              <tr>
                <th>日期</th>
                <th>新增用户</th>
                <th>活跃用户</th>
                <th>普通用户</th>
                <th>经销商用户</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(item, index) in detailedStats.users" :key="index">
                <td>{{ item.date }}</td>
                <td>{{ item.newUsers }}</td>
                <td>{{ item.activeUsers }}</td>
                <td>{{ item.normalUsers }}</td>
                <td>{{ item.dealerUsers }}</td>
              </tr>
            </tbody>
          </table>
        </div>
        
        <!-- 车辆统计表格 -->
        <div v-if="activeTab === 'cars'" class="stats-table-container">
          <table class="stats-table">
            <thead>
              <tr>
                <th>日期</th>
                <th>新增车辆</th>
                <th>已售车辆</th>
                <th>浏览量</th>
                <th>收藏量</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(item, index) in detailedStats.cars" :key="index">
                <td>{{ item.date }}</td>
                <td>{{ item.newCars }}</td>
                <td>{{ item.soldCars }}</td>
                <td>{{ item.viewCount }}</td>
                <td>{{ item.favoriteCount }}</td>
              </tr>
            </tbody>
          </table>
        </div>
        
        <!-- 预约统计表格 -->
        <div v-if="activeTab === 'appointments'" class="stats-table-container">
          <table class="stats-table">
            <thead>
              <tr>
                <th>日期</th>
                <th>新增预约</th>
                <th>已确认</th>
                <th>已完成</th>
                <th>已取消</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(item, index) in detailedStats.appointments" :key="index">
                <td>{{ item.date }}</td>
                <td>{{ item.newAppointments }}</td>
                <td>{{ item.confirmedAppointments }}</td>
                <td>{{ item.completedAppointments }}</td>
                <td>{{ item.cancelledAppointments }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue';

// 导入统计服务
// 在实际开发中，这里应该引入 statisticsService
// import StatisticsService from '@/api/statisticsService';
// const statsService = new StatisticsService();

// 状态
const activeTab = ref('users');
const loading = ref(false);
const dateRange = reactive({
  startDate: formatDateForInput(new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)), // 默认30天前
  endDate: formatDateForInput(new Date()),
  groupBy: 'DAY'
});

// 数据概览
const overview = ref({
  totalUsers: 0,
  totalCars: 0,
  totalDealers: 0,
  totalAppointments: 0,
  userGrowthRate: 0,
  carGrowthRate: 0,
  dealerGrowthRate: 0,
  appointmentGrowthRate: 0
});

// 详细统计数据
const detailedStats = reactive({
  users: [],
  cars: [],
  appointments: []
});

// 生命周期钩子
onMounted(() => {
  loadAllStatistics();
});

// 方法
function loadAllStatistics() {
  loading.value = true;
  
  // 加载数据概览
  loadOverviewStats();
  
  // 加载用户统计
  loadUserStats();
  
  // 加载车辆统计
  loadCarStats();
  
  // 加载预约统计
  loadAppointmentStats();
}

function loadOverviewStats() {
  // 模拟API调用
  setTimeout(() => {
    // 这里应该是调用实际API的地方
    // statsService.getOverviewStatistics({
    //   startDate: dateRange.startDate,
    //   endDate: dateRange.endDate
    // }).then(response => {
    //   if (response.success) {
    //     overview.value = response.data;
    //   }
    // });
    
    // 使用模拟数据
    overview.value = {
      totalUsers: 3452,
      totalCars: 1876,
      totalDealers: 258,
      totalAppointments: 965,
      userGrowthRate: 8.5,
      carGrowthRate: 12.3,
      dealerGrowthRate: -2.5,
      appointmentGrowthRate: 15.8
    };
  }, 500);
}

function loadUserStats() {
  // 模拟API调用
  setTimeout(() => {
    // 这里应该是调用实际API的地方
    // statsService.getUserStatistics({
    //   startDate: dateRange.startDate,
    //   endDate: dateRange.endDate,
    //   groupBy: dateRange.groupBy
    // }).then(response => {
    //   if (response.success) {
    //     detailedStats.users = response.data;
    //   }
    // });
    
    // 使用模拟数据
    detailedStats.users = generateMockUserStats();
    loading.value = false;
  }, 800);
}

function loadCarStats() {
  // 模拟API调用
  setTimeout(() => {
    // 这里应该是调用实际API的地方
    // statsService.getCarStatistics({
    //   startDate: dateRange.startDate,
    //   endDate: dateRange.endDate,
    //   groupBy: dateRange.groupBy
    // }).then(response => {
    //   if (response.success) {
    //     detailedStats.cars = response.data;
    //   }
    // });
    
    // 使用模拟数据
    detailedStats.cars = generateMockCarStats();
  }, 800);
}

function loadAppointmentStats() {
  // 模拟API调用
  setTimeout(() => {
    // 这里应该是调用实际API的地方
    // statsService.getAppointmentStatistics({
    //   startDate: dateRange.startDate,
    //   endDate: dateRange.endDate,
    //   groupBy: dateRange.groupBy
    // }).then(response => {
    //   if (response.success) {
    //     detailedStats.appointments = response.data;
    //   }
    // });
    
    // 使用模拟数据
    detailedStats.appointments = generateMockAppointmentStats();
  }, 800);
}

// 格式化函数
function formatDateForInput(date) {
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function formatGrowthRate(rate) {
  if (rate > 0) {
    return `↑ ${rate.toFixed(1)}%`;
  } else if (rate < 0) {
    return `↓ ${Math.abs(rate).toFixed(1)}%`;
  } else {
    return `0.0%`;
  }
}

// 生成模拟数据
function generateMockUserStats() {
  const result = [];
  const days = 7; // 假设展示最近7天数据
  
  for (let i = 0; i < days; i++) {
    const date = new Date();
    date.setDate(date.getDate() - (days - i - 1));
    const dateStr = formatDateForInput(date);
    
    result.push({
      date: dateStr,
      newUsers: Math.floor(Math.random() * 50) + 10,
      activeUsers: Math.floor(Math.random() * 300) + 100,
      normalUsers: Math.floor(Math.random() * 40) + 5,
      dealerUsers: Math.floor(Math.random() * 10) + 2
    });
  }
  
  return result;
}

function generateMockCarStats() {
  const result = [];
  const days = 7; // 假设展示最近7天数据
  
  for (let i = 0; i < days; i++) {
    const date = new Date();
    date.setDate(date.getDate() - (days - i - 1));
    const dateStr = formatDateForInput(date);
    
    result.push({
      date: dateStr,
      newCars: Math.floor(Math.random() * 40) + 5,
      soldCars: Math.floor(Math.random() * 20) + 2,
      viewCount: Math.floor(Math.random() * 1000) + 200,
      favoriteCount: Math.floor(Math.random() * 100) + 30
    });
  }
  
  return result;
}

function generateMockAppointmentStats() {
  const result = [];
  const days = 7; // 假设展示最近7天数据
  
  for (let i = 0; i < days; i++) {
    const date = new Date();
    date.setDate(date.getDate() - (days - i - 1));
    const dateStr = formatDateForInput(date);
    
    const newAppts = Math.floor(Math.random() * 30) + 5;
    const confirmed = Math.floor(Math.random() * newAppts * 0.8);
    const completed = Math.floor(Math.random() * confirmed * 0.7);
    const cancelled = Math.floor(Math.random() * newAppts * 0.2);
    
    result.push({
      date: dateStr,
      newAppointments: newAppts,
      confirmedAppointments: confirmed,
      completedAppointments: completed,
      cancelledAppointments: cancelled
    });
  }
  
  return result;
}
</script>

<style scoped>
.statistics-container {
  height: 100%;
  display: flex;
  flex-direction: column;
  width: 100%;
}

.page-title {
  font-size: 1.6rem;
  color: var(--va-primary);
  margin-bottom: 1rem;
  border-bottom: 1px solid #eee;
  padding-bottom: 0.5rem;
}

.content-wrapper {
  flex: 1;
  overflow-y: auto;
  background-color: #fff;
  width: 100%;
}

/* 筛选区域 */
.filter-section {
  background-color: #f9f9f9;
  padding: 1rem;
  border-radius: 8px;
  margin-bottom: 1.5rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.filter-row {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 1rem;
}

.filter-item {
  display: flex;
  align-items: center;
}

.filter-item label {
  margin-right: 0.5rem;
  font-size: 0.9rem;
  color: #555;
}

.filter-item select,
.filter-item input[type="date"] {
  padding: 0.35rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 0.9rem;
}

.date-filter {
  display: flex;
  align-items: center;
}

.date-filter span {
  margin: 0 0.5rem;
}

.query-btn {
  padding: 0.35rem 1rem;
  background-color: var(--va-primary);
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

/* 数据概览卡片 */
.stats-overview {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.stats-card {
  background-color: #fff;
  border-radius: 8px;
  padding: 1.5rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
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
  color: #666;
  font-size: 0.9rem;
  margin-bottom: 0.25rem;
}

.stats-value {
  font-size: 1.5rem;
  font-weight: 600;
  color: #333;
  margin-bottom: 0.25rem;
}

.stats-trend {
  font-size: 0.9rem;
}

.stats-trend.up {
  color: #52c41a;
}

.stats-trend.down {
  color: #ff4d4f;
}

/* 图表区域 */
.charts-container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(500px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
}

@media (max-width: 1100px) {
  .charts-container {
    grid-template-columns: 1fr;
  }
}

.chart-panel {
  background-color: #fff;
  border-radius: 8px;
  padding: 1rem;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.1);
}

.chart-title {
  font-size: 1.2rem;
  color: #333;
  margin-bottom: 1rem;
  padding-bottom: 0.5rem;
  border-bottom: 1px solid #eee;
}

.chart-wrapper {
  height: 300px;
}

.chart-placeholder {
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  color: #999;
  background-color: #f9f9f9;
  border-radius: 4px;
}

/* 详细数据统计 */
.detailed-stats {
  background-color: #fff;
  border-radius: 8px;
  padding: 1.5rem;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.1);
}

.section-title {
  font-size: 1.3rem;
  color: #333;
  margin-bottom: 1rem;
}

/* 标签页 */
.tabs {
  display: flex;
  border-bottom: 1px solid #eee;
  margin-bottom: 1.5rem;
}

.tab-btn {
  padding: 0.75rem 1.5rem;
  background: none;
  border: none;
  cursor: pointer;
  font-size: 1rem;
  border-bottom: 2px solid transparent;
  transition: all 0.3s;
}

.tab-btn:hover {
  color: var(--va-primary);
}

.tab-btn.active {
  color: var(--va-primary);
  border-bottom-color: var(--va-primary);
  font-weight: 500;
}

/* 统计表格 */
.stats-table-container {
  width: 100%;
  overflow-x: auto;
}

.stats-table {
  width: 100%;
  border-collapse: collapse;
  border: 1px solid #eee;
}

.stats-table th,
.stats-table td {
  padding: 0.75rem;
  text-align: center;
  border-bottom: 1px solid #eee;
}

.stats-table th {
  background-color: #f5f5f5;
  font-weight: 600;
  color: #333;
}

.stats-table tr:hover {
  background-color: #f9f9f9;
}

@media (max-width: 768px) {
  .page-title {
    font-size: 1.4rem;
  }
  
  .filter-row {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .filter-item {
    width: 100%;
  }
  
  .date-filter {
    flex-wrap: wrap;
  }
  
  .query-btn {
    width: 100%;
  }
  
  .stats-overview {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
  
  .charts-container {
    grid-template-columns: 1fr;
  }
  
  .stats-table th,
  .stats-table td {
    padding: 0.5rem;
    font-size: 0.85rem;
  }
  
  .tabs {
    overflow-x: auto;
  }
  
  .tab-btn {
    padding: 0.6rem 1rem;
    font-size: 0.9rem;
    white-space: nowrap;
  }
}
</style> 