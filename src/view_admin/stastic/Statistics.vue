<template>
  <div class="statistics-page">    
    <!-- 筛选面板 -->
    <div class="filter-panel" v-if="false">
      <div class="filter-row">
        <div class="filter-item date-filter">
          <label>统计周期:</label>
          <input type="date" v-model="dateRange.startDate" @change="onFilterChange" />
          <span>至</span>
          <input type="date" v-model="dateRange.endDate" @change="onFilterChange" />
        </div>
        <div class="filter-item">
          <label>数据分组:</label>
          <select v-model="dateRange.groupBy" @change="onFilterChange">
            <option value="DAY">按天</option>
            <option value="WEEK">按周</option>
            <option value="MONTH">按月</option>
          </select>
        </div>
        <button class="query-btn" @click="onFilterChange">查询</button>
      </div>
    </div>
    
    <!-- 面板切换按钮 -->
    <div class="tab-panel">
      <div class="tab-navigation">
        <button 
          class="tab-btn" 
          :class="{ active: activeTab === 'system' }"
          @click="activeTab = 'system'"
        >
          系统概览
        </button>
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
      </div>
    </div>
    
    <!-- 面板显示区域 -->
    <div class="panel-content">
      <!-- 系统概览统计面板 -->
      <div v-if="activeTab === 'system'" class="statistics-panel">
        <SystemStatisticsPanel 
          :start-date="dateRange.startDate"
          :end-date="dateRange.endDate"
          @loaded="handleSystemStatsLoaded"
          @error="handleError"
        />
      </div>
      
      <!-- 用户统计面板 -->
      <div v-if="activeTab === 'users'" class="statistics-panel">
        <UserStatisticsPanel 
          :start-date="dateRange.startDate"
          :end-date="dateRange.endDate"
          :group-by="dateRange.groupBy"
          :user-type="'ALL'"
          @loaded="handleUserStatsLoaded"
          @error="handleError"
        />
      </div>
      
      <!-- 车辆统计面板 -->
      <div v-if="activeTab === 'cars'" class="statistics-panel">
        <ContentStatisticsPanel 
          :start-date="dateRange.startDate"
          :end-date="dateRange.endDate"
          :group-by="dateRange.groupBy"
          @loaded="handleContentStatsLoaded"
          @error="handleError"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, watch } from 'vue';
import { useToast } from 'vuestic-ui';
import UserStatisticsPanel from './components/UserStatisticsPanel.vue';
import SystemStatisticsPanel from './components/SystemStatisticsPanel.vue';
import ContentStatisticsPanel from './components/ContentStatisticsPanel.vue';

// 状态
const activeTab = ref('system'); // 默认选中系统概览
const loading = ref(false);
const { init: initToast } = useToast();

const dateRange = reactive({
  startDate: formatDateForInput(new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)), // 默认30天前
  endDate: formatDateForInput(new Date()),
  groupBy: 'DAY'
});

// 监听标签页变化
watch(activeTab, (newTab) => {
  // 可以在这里添加标签页切换逻辑
  console.log('切换到标签页:', newTab);
});

// 处理筛选条件变更
function onFilterChange() {
  // 不需要额外处理，因为日期变更会自动传递给子组件
  console.log('应用筛选条件:', dateRange);
}

// 处理用户统计数据加载完成
function handleUserStatsLoaded(data) {
  console.log('用户统计数据加载完成:', data);
}

// 处理系统统计数据加载完成
function handleSystemStatsLoaded(data) {
  console.log('系统统计数据加载完成:', data);
}

// 处理内容统计数据加载完成
function handleContentStatsLoaded(data) {
  console.log('内容统计数据加载完成:', data);
}

// 处理错误
function handleError(errorMsg) {
  console.error('统计数据加载错误:', errorMsg);
  initToast({
    message: errorMsg || '加载统计数据失败',
    color: 'danger',
    timeout: 3000
  });
}

// 格式化函数
function formatDateForInput(date) {
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  return `${year}-${month}-${day}`;
}

// 初始化
onMounted(() => {
  // 组件加载时的初始化逻辑
});
</script>

<style scoped>
.statistics-page {
  width: 100%;
  height: 100%;
  padding: 1.5rem;
  background-color: transparent;
  overflow-y: auto;
}

.page-title {
  font-size: 1.5rem;
  font-weight: 600;
  color: var(--text-color, #333);
  margin-bottom: 1.5rem;
}

/* 筛选面板 */
.filter-panel {
  background-color: transparent;
  padding: 1.25rem 0;
  margin-bottom: 1.5rem;
  border: none;
  box-shadow: none;
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
  color: var(--text-color, #333);
  font-weight: 500;
}

.filter-item select,
.filter-item input[type="date"] {
  padding: 0.35rem;
  border: 1px solid var(--card-border-color, rgba(0, 0, 0, 0.1));
  border-radius: 4px;
  font-size: 0.9rem;
  background-color: var(--card-bg-color, #fff);
  color: var(--text-color, #333);
}

.date-filter {
  display: flex;
  align-items: center;
}

.date-filter span {
  margin: 0 0.5rem;
  color: var(--text-color, #333);
}

.query-btn {
  padding: 0.35rem 1rem;
  background-color: var(--primary-color, #1867c0);
  color: var(--btn-primary-text, #fff);
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 500;
}

.query-btn:hover {
  opacity: 0.9;
}

/* 面板切换按钮 */
.tab-panel {
  background-color: var(--card-bg-color, #fff);
  border-radius: 8px;
  padding: 1rem;
  margin-bottom: 1.5rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  border: 1px solid var(--card-border-color, rgba(0, 0, 0, 0.1));
}

.tab-navigation {
  display: flex;
  justify-content: center;
  border-bottom: none;
  background-color: transparent;
  border-radius: 0;
  overflow: hidden;
  gap: 2rem;
  width: 100%;
}

.tab-btn {
  padding: 0.5rem 1.2rem;
  background: var(--card-bg-color, #fff);
  border: 1px solid var(--card-border-color, rgba(0, 0, 0, 0.1));
  cursor: pointer;
  font-size: 0.9rem;
  color: var(--text-color, #333);
  transition: all 0.3s;
  margin: 0;
  border-radius: 4px;
}

.tab-btn:hover {
  opacity: 0.9;
  transform: translateY(-2px);
}

.tab-btn.active {
  color: #fff;
  background-color: #333;
  font-weight: 500;
  border-color: #333;
}

/* 面板显示区域 */
.panel-content {
  background-color: transparent;
  border-radius: 0;
  padding: 0;
  box-shadow: none;
  border: none;
}

.statistics-panel {
  min-height: 400px;
}

/* 深色模式适配 */
:root[data-theme="dark"] {
  .statistics-page {
    background-color: transparent;
  }
  
  .filter-panel,
  .tab-navigation,
  .panel-content {
    background-color: transparent;
    border-color: var(--card-border-color, rgba(255, 255, 255, 0.1));
  }
  
  .tab-btn {
    background: rgba(30, 30, 30, 0.8);
    color: rgba(255, 255, 255, 0.85);
    border-color: rgba(255, 255, 255, 0.1);
  }
  
  .tab-btn:hover {
    background: rgba(40, 40, 40, 0.9);
  }
  
  .tab-btn.active {
    background-color: #000;
    color: #fff;
    border-color: #000;
  }
  
  .tab-panel {
    background-color: rgba(30, 30, 30, 0.8);
    border-color: rgba(255, 255, 255, 0.1);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
  }
}

@media (max-width: 768px) {
  .statistics-page {
    padding: 1rem;
  }
  
  .filter-row {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .filter-item {
    width: 100%;
    margin-bottom: 0.75rem;
  }
  
  .date-filter {
    flex-wrap: wrap;
  }
  
  .query-btn {
    width: 100%;
  }
  
  .tab-navigation {
    overflow-x: auto;
    gap: 1rem;
    justify-content: flex-start;
    padding: 0.5rem 0;
  }
  
  .tab-btn {
    padding: 0.4rem 0.8rem;
    font-size: 0.85rem;
    white-space: nowrap;
    margin: 0;
  }
  
  .panel-content {
    padding: 0;
  }
  
  .tab-panel {
    padding: 0.75rem 0.5rem;
    margin-bottom: 1rem;
  }
}
</style> 