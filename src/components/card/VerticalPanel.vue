<template>
  <div class="vertical-panel">
    <!-- 左侧垂直标题区域 (1份宽度) -->
    <div class="panel-title-column">
      <h3 class="vertical-title">{{ title }}</h3>
    </div>
    
    <!-- 右侧内容区域 (9份宽度) -->
    <div class="panel-content-column">
      <!-- 上部分内容区域 (8份高度) -->
      <div class="panel-body" :class="contentClass">
        <slot></slot>
      </div>
      
      <!-- 下部分操作区域 (2份高度) -->
      <div class="panel-actions">
        <slot name="actions"></slot>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, onUnmounted } from 'vue';

// 定义组件属性
const props = defineProps({
  // 面板标题
  title: {
    type: String,
    default: ''
  },
  // 内容区域自定义类名
  contentClass: {
    type: String,
    default: ''
  }
});

// 处理主题变化
const handleThemeChange = (event) => {
  // 这里可以添加主题变化后的特定逻辑
  // 由于使用了CSS变量，大部分样式会自动适应主题
};

// 监听主题变化事件
onMounted(() => {
  window.addEventListener('theme-changed', handleThemeChange);
});

// 组件卸载时移除事件监听
onUnmounted(() => {
  window.removeEventListener('theme-changed', handleThemeChange);
});
</script>

<style scoped>
.vertical-panel {
  display: flex;
  background-color: var(--card-bg-color, #ffffff);
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
  overflow: hidden;
  transition: all 0.3s ease;
  border: 1px solid var(--card-border-color, #eaeaea);
  color: var(--text-color, #333333);
  width: 100%;
  height: 100%;
  min-height: 300px; /* 确保面板有足够高度以便垂直标题显示完整 */
}

/* 左侧标题列，占1/10宽度 */
.panel-title-column {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: var(--primary-color, #000000);
  color: white;
  padding: 1rem 0.5rem;
  box-sizing: border-box;
  position: relative;
}

/* 垂直标题样式 */
.vertical-title {
  writing-mode: vertical-rl;
  text-orientation: mixed;
  transform: rotate(180deg); /* 让文字从上到下显示 */
  font-size: 1.2rem;
  font-weight: 600;
  letter-spacing: 0.1em;
  margin: 0;
  white-space: nowrap;
  text-align: center;
}

/* 右侧内容列，占9/10宽度 */
.panel-content-column {
  flex: 9;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

/* 上部分内容区域，占8/10高度 */
.panel-body {
  flex: 8;
  padding: 1.25rem;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  background-color: var(--card-bg-color, #ffffff);
}

/* 下部分操作区域，占2/10高度 */
.panel-actions {
  flex: 2;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  padding: 0.75rem 1.25rem;
  background-color: var(--border-color, #f0f0f0);
  gap: 0.75rem;
  min-height: 60px; /* 确保操作区域有足够的高度 */
}

/* 按钮样式 */
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

/* 深色模式变量 - 自动适应全局深浅色设定 */
:root {
  --card-bg-color: #ffffff;
  --card-border-color: #eaeaea;
  --text-color: #333333;
  --border-color: #f0f0f0;
  --primary-color: #000000;
  --btn-primary-bg: #000000;
  --btn-primary-text: #ffffff;
}

/* 深色模式样式 */
:root[data-theme="dark"] .vertical-panel {
  --card-bg-color: #1f1f1f;
  --card-border-color: #333333;
  --text-color: #e0e0e0;
  --border-color: #333333;
  --primary-color: #ffffff;
  --btn-primary-bg: #ffffff;
  --btn-primary-text: #000000;
}

:root[data-theme="dark"] .panel-title-column {
  background-color: var(--primary-color, #ffffff);
  color: #000000;
}

:root[data-theme="dark"] .panel-actions {
  background-color: rgba(255, 255, 255, 0.1);
}

/* 响应式布局 */
@media (max-width: 768px) {
  .vertical-panel {
    flex-direction: column;
    min-height: auto;
  }
  
  .panel-title-column {
    flex: none;
    width: 100%;
    padding: 0.75rem;
  }
  
  .vertical-title {
    writing-mode: horizontal-tb;
    transform: none;
    letter-spacing: normal;
  }
  
  .panel-content-column {
    flex: none;
    width: 100%;
  }
  
  .panel-body {
    padding: 1rem;
  }
  
  .panel-actions {
    padding: 0.75rem 1rem;
  }
}
</style> 