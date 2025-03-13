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
        <!-- 车辆发布趋势图 -->
        <div class="chart-panel">
          <h3 class="chart-title">车辆发布趋势</h3>
          <div class="chart-wrapper">
            <table class="stats-table">
              <thead>
                <tr>
                  <th>日期</th>
                  <th>新增车辆</th>
                  <th>可用车辆</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(item, index) in detailedStats.cars" :key="index">
                  <td>{{ item.date }}</td>
                  <td>{{ item.newCars }}</td>
                  <td>{{ item.availableCars }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- 品牌分布图 -->
        <div class="chart-panel">
          <h3 class="chart-title">品牌分布</h3>
          <div class="chart-wrapper">
            <table class="stats-table">
              <thead>
                <tr>
                  <th>品牌</th>
                  <th>数量</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(item, index) in detailedStats.brands" :key="index">
                  <td>{{ item.brand }}</td>
                  <td>{{ item.count }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- 价格分布图 -->
        <div class="chart-panel">
          <h3 class="chart-title">价格分布</h3>
          <div class="chart-wrapper">
            <table class="stats-table">
              <thead>
                <tr>
                  <th>价格区间</th>
                  <th>数量</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(item, index) in detailedStats.prices" :key="index">
                  <td>{{ item.range }}</td>
                  <td>{{ item.count }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- 类别分布图 -->
        <div class="chart-panel">
          <h3 class="chart-title">类别分布</h3>
          <div class="chart-wrapper">
            <table class="stats-table">
              <thead>
                <tr>
                  <th>类别</th>
                  <th>数量</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(item, index) in detailedStats.categories" :key="index">
                  <td>{{ item.category }}</td>
                  <td>{{ item.count }}</td>
                </tr>
              </tbody>
            </table>
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
import statisticsService from '@/api/statisticsService';
import { useToast } from 'vuestic-ui';
import userAdminService from '@/api/userAdminService';
import carService from '@/api/carService';
import dealerService from '@/api/dealerService';
import appointmentService from '@/api/appointmentService';

// 状态
const activeTab = ref('users');
const loading = ref(false);
const { init: initToast } = useToast();

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
  appointments: [],
  brands: [],
  prices: [],
  categories: []
});

// 生命周期钩子
onMounted(() => {
  loadAllStatistics();
});

// 加载所有统计数据
async function loadAllStatistics() {
  loading.value = true;
  try {
    // 获取用户统计
    const userResponse = await userAdminService.getUserList();
    const userList = userResponse.data || [];
    const normalUsers = userList.filter(user => user.userType === 'USER').length;
    const dealerUsers = userList.filter(user => user.userType === 'DEALER').length;
    const activeUsers = userList.filter(user => user.status === 'ACTIVE').length;
    const newUsers = userList.filter(user => {
      const createTime = new Date(user.createTime);
      const startDate = new Date(dateRange.startDate);
      return createTime >= startDate;
    }).length;

    // 获取车辆统计
    const carResponse = await carService.getCars();
    const carList = carResponse.data || [];
    const totalCars = carList.length;
    const availableCars = carList.filter(car => car.status === 'AVAILABLE').length;
    const newCars = carList.filter(car => {
      const createTime = new Date(car.createTime);
      const startDate = new Date(dateRange.startDate);
      return createTime >= startDate;
    }).length;

    // 获取经销商统计
    const dealerResponse = await dealerService.getDealerList();
    const dealerList = dealerResponse.data || [];
    const totalDealers = dealerList.length;
    const newDealers = dealerList.filter(dealer => {
      const createTime = new Date(dealer.createTime);
      const startDate = new Date(dateRange.startDate);
      return createTime >= startDate;
    }).length;

    // 获取预约统计
    const appointmentResponse = await appointmentService.getUserAppointments();
    const appointmentList = appointmentResponse.data?.list || [];
    const totalAppointments = appointmentList.length;
    const newAppointments = appointmentList.filter(appointment => {
      const createTime = new Date(appointment.createTime);
      const startDate = new Date(dateRange.startDate);
      return createTime >= startDate;
    }).length;
    const confirmedAppointments = appointmentList.filter(appointment => appointment.status === '已确认').length;
    const completedAppointments = appointmentList.filter(appointment => appointment.status === '已完成').length;
    const cancelledAppointments = appointmentList.filter(appointment => appointment.status === '已取消').length;

    // 更新概览数据
    overview.value = {
      totalUsers: userList.length,
      totalCars,
      totalDealers,
      totalAppointments,
      userGrowthRate: userList.length ? (newUsers / userList.length) * 100 : 0,
      carGrowthRate: totalCars ? (newCars / totalCars) * 100 : 0,
      dealerGrowthRate: totalDealers ? (newDealers / totalDealers) * 100 : 0,
      appointmentGrowthRate: totalAppointments ? (newAppointments / totalAppointments) * 100 : 0
    };

    // 更新用户趋势数据
    detailedStats.users = [{
      date: formatDate(new Date()),
      newUsers,
      activeUsers,
      normalUsers,
      dealerUsers
    }];

    // 更新车辆趋势数据
    detailedStats.cars = [{
      date: formatDate(new Date()),
      newCars,
      availableCars
    }];

    // 更新预约趋势数据
    detailedStats.appointments = [{
      date: formatDate(new Date()),
      newAppointments,
      confirmedAppointments,
      completedAppointments,
      cancelledAppointments
    }];

    // 更新品牌分布数据
    const brandMap = new Map();
    carList.forEach(car => {
      const brand = car.brand || '未知品牌';
      brandMap.set(brand, (brandMap.get(brand) || 0) + 1);
    });
    detailedStats.brands = Array.from(brandMap.entries()).map(([brand, count]) => ({
      brand,
      count
    }));

    // 更新价格分布数据
    const priceRanges = [
      { min: 0, max: 100000, label: '10万以下' },
      { min: 100000, max: 200000, label: '10-20万' },
      { min: 200000, max: 300000, label: '20-30万' },
      { min: 300000, max: 500000, label: '30-50万' },
      { min: 500000, max: Infinity, label: '50万以上' }
    ];

    const priceMap = new Map();
    carList.forEach(car => {
      const price = Number(car.price) || 0;
      const range = priceRanges.find(r => price >= r.min && price < r.max);
      if (range) {
        priceMap.set(range.label, (priceMap.get(range.label) || 0) + 1);
      }
    });
    detailedStats.prices = Array.from(priceMap.entries()).map(([range, count]) => ({
      range,
      count
    }));

    // 更新类别分布数据
    const categoryMap = new Map();
    carList.forEach(car => {
      const category = car.category || '未知类别';
      categoryMap.set(category, (categoryMap.get(category) || 0) + 1);
    });
    detailedStats.categories = Array.from(categoryMap.entries()).map(([category, count]) => ({
      category,
      count
    }));

    initToast({
      message: '统计数据加载成功',
      color: 'success',
      timeout: 3000
    });
  } catch (error) {
    console.error('加载统计数据失败:', error);
    initToast({
      message: '加载统计数据失败: ' + (error.message || '未知错误'),
      color: 'danger',
      timeout: 3000
    });
  } finally {
    loading.value = false;
  }
}

// 格式化函数
function formatDateForInput(date) {
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function formatDate(dateString) {
  if (!dateString) return '';
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    }).replace(/\//g, '-');
  } catch (error) {
    return dateString;
  }
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