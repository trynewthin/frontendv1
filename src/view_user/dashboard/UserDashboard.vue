<template>
  <div class="user-dashboard-container user-dashboard-view">
    <!-- 使用bheader组件作为导航栏 -->
    <bheader 
      title="用户主页"
      :showBackButton="true"
      :showThemeToggle="true"
    >
      <template #right-content>
        <theme-toggle />
      </template>
    </bheader>
    
    <!-- 仪表盘内容容器 -->
    <div class="dashboard-content">
      <h1>用户仪表盘</h1>
      
      <!-- BasePanel组件示例 -->
      <base-panel title="控制面板" class="dashboard-panel">
        <div class="panel-demo-content">
          <!-- 移除示例内容文字，保留状态显示和交互元素 -->
          <div class="stats-container">
            <div class="stat-item">
              <div class="stat-value">89</div>
              <div class="stat-label">完成</div>
            </div>
            <div class="stat-item">
              <div class="stat-value">12</div>
              <div class="stat-label">进行中</div>
            </div>
            <div class="stat-item">
              <div class="stat-value">5</div>
              <div class="stat-label">待办</div>
            </div>
          </div>
          <div class="demo-actions">
            <button class="demo-btn" @click="toggleDemoStatus">切换状态</button>
          </div>
        </div>
        
        <template #actions>
          <button class="panel-action-btn">
            <i class="action-icon">⚙️</i>
          </button>
          <button class="btn">查看详情</button>
          <button class="btn btn-primary">刷新数据</button>
        </template>
        
        <template #footer>
          <button class="btn btn-primary">确认</button>
        </template>
      </base-panel>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import Bheader from '@/components/header/bheader.vue';
import ThemeToggle from '@/components/button/ThemeToggle.vue';
import BasePanel from '@/components/card/BasePanel.vue';

// 路由实例
const router = useRouter();

// 示例组件状态
const isDemoActive = ref(true);

// 切换示例状态
const toggleDemoStatus = () => {
  isDemoActive.value = !isDemoActive.value;
};
</script>

<style scoped>
.user-dashboard-view {
  position: fixed !important;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  width: 100vw !important;
  height: 100vh !important;
  margin: 0 !important;
  padding: 0 !important;
  background-color: var(--bg-color, #ffffff) !important; 
  overflow-y: auto;
  box-sizing: border-box;
}

.user-dashboard-container {
  padding: 0;
  min-height: 100vh;
  width: 100%;
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
  overflow-y: auto;
}

.dashboard-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  padding: 1.5rem;
  background-color: var(--bg-color, #ffffff);
  gap: 1.5rem;
}

/* 面板示例样式 */
.dashboard-panel {
  max-width: 800px;
  margin: 1rem auto;
  height: 400px;
}

.panel-demo-content {
  padding: 1rem 0;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.stats-container {
  display: flex;
  justify-content: space-around;
  margin: 2rem 0;
}

.stat-item {
  text-align: center;
  padding: 1rem;
}

.stat-value {
  font-size: 2.5rem;
  font-weight: 700;
  color: var(--primary-color, #000000);
}

.stat-label {
  font-size: 0.95rem;
  color: var(--secondary-text-color, #777777);
  margin-top: 0.5rem;
}

.status-display {
  text-align: center;
  margin: 1rem 0;
}

.status-badge {
  display: inline-block;
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  background-color: var(--primary-color, #000000);
  color: white;
  font-size: 0.875rem;
  font-weight: 500;
}

.demo-actions {
  margin-top: 1.5rem;
  text-align: center;
}

.demo-btn {
  padding: 0.5rem 1rem;
  background-color: var(--btn-primary-bg, #000000);
  color: var(--btn-primary-text, #ffffff);
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.875rem;
  transition: all 0.2s ease;
}

.demo-btn:hover {
  opacity: 0.9;
}

.panel-action-btn {
  background: none;
  border: none;
  cursor: pointer;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  transition: all 0.2s ease;
}

.panel-action-btn:hover {
  background-color: rgba(0, 0, 0, 0.05);
}

.btn {
  background: none;
  border: none;
  font-size: 0.85rem;
  font-weight: 500;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-primary {
  background-color: var(--btn-primary-bg, #000000);
  color: var(--btn-primary-text, #ffffff);
  border: 1px solid transparent;
}

.btn-primary:hover {
  opacity: 0.9;
}

:root[data-theme="dark"] .panel-action-btn:hover {
  background-color: rgba(255, 255, 255, 0.1);
}

:root[data-theme="dark"] .stat-value {
  color: var(--primary-color, #ffffff);
}

:root[data-theme="dark"] .stat-label {
  color: var(--secondary-text-color, #aaaaaa);
}

/* 深色模式适配 */
:root[data-theme="dark"] .user-dashboard-view {
  background-color: var(--bg-color-dark, #1a1a1a) !important;
}

:root[data-theme="dark"] .dashboard-content {
  background-color: var(--bg-color-dark, #1a1a1a);
}

/* 响应式布局 - 移动设备 */
@media (max-width: 599px) {
  .dashboard-content {
    padding: 1rem;
  }
  
  .stats-container {
    flex-direction: column;
    gap: 0.75rem;
  }
  
  .stat-item {
    padding: 0.5rem;
  }
}

/* 响应式布局 - 平板 */
@media (min-width: 600px) and (max-width: 959px) {
  .dashboard-content {
    padding: 1.25rem;
  }
}
</style> 