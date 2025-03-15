<template>
  <div class="base-panel" :class="{ 'has-title': title }">
    <!-- 左侧垂直标题区域 (1份宽度) -->
    <div v-if="title" class="panel-title-column">
      <!-- 标题作为背景元素 -->
      <h3 class="vertical-title-background">{{ title }}</h3>
      <!-- 左侧透明覆盖层(无模糊) -->
      <div class="left-overlay"></div>
      <!-- 右侧半透明高斯模糊覆盖层 -->
      <div class="right-blur-overlay"></div>
    </div>
    
    <!-- 右侧内容区域 (9份宽度) -->
    <div class="panel-content-column">
      <!-- 内容区域 (占整个高度) -->
      <div class="panel-body" :class="contentClass">
        <slot></slot>
      </div>
      
      <!-- 底部触发区域 -->
      <div class="footer-trigger-area"></div>
      
      <!-- 底部区域 - 可选，悬浮在内容之上 -->
      <div v-if="$slots.footer" class="panel-footer">
        <div class="panel-footer-blur"></div>
        <div class="panel-footer-content">
          <slot name="footer"></slot>
        </div>
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
.base-panel {
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
  flex: 0.9;
  position: relative;
  overflow: hidden;
  border-right: 1px solid var(--card-border-color, #eaeaea);
}

/* 垂直标题背景元素 */
.vertical-title-background {
  position: absolute;
  top: 1rem; 
  left: 0.2rem; /* 减小左侧边距 */
  width: auto; /* 宽度自适应而非100% */
  writing-mode: vertical-rl;
  text-orientation: mixed;
  font-size: 3.5rem;
  font-weight: 800;
  letter-spacing: 0.1em;
  margin: 0;
  white-space: nowrap;
  text-align: left; /* 左对齐 */
  opacity: 0.5; /* 增加不透明度，使颜色更明显 */
  color: #000000; /* 浅色模式固定为黑色 */
  z-index: 1; /* 确保标题在覆盖层的下面 */
  user-select: none; /* 禁止选择文字 */
}

/* 左侧透明覆盖层(无模糊) */
.left-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 45%; /* 减少宽度以匹配右侧模糊层的扩展 */
  height: 100%;
  background-color: transparent; /* 完全透明 */
  z-index: 2;
}

/* 右侧高斯模糊覆盖层 */
.right-blur-overlay {
  position: absolute;
  top: 0;
  right: 0;
  width: 55%; /* 增加宽度，向左扩展 */
  height: 100%;
  /* 使用平方曲线的渐变背景，透明度变化遵循平方函数 */
  background: linear-gradient(
    to right,
    rgba(255, 255, 255, 0) 0%, /* 起始值为完全透明 */
    rgba(255, 255, 255, 0.05) 25%,
    rgba(255, 255, 255, 0.15) 40%,
    rgba(255, 255, 255, 0.3) 55%,
    rgba(255, 255, 255, 0.6) 70%,
    rgba(255, 255, 255, 0.85) 85%,
    rgba(255, 255, 255, 0.95) 100%
  );
  backdrop-filter: blur(4px);
  z-index: 2;
}

/* 右侧内容列，占9/10宽度 */
.panel-content-column {
  flex: 9;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  z-index: 3; /* 确保内容在最前面 */
  position: relative; /* 添加相对定位，作为底部区域的定位参考 */
}

/* 上部分内容区域，占据整个高度 */
.panel-body {
  flex: 1;
  padding: 1.25rem;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  background-color: var(--card-bg-color, #ffffff);
  width: 100%;
  height: 100%;
}

/* 底部触发区域 */
.footer-trigger-area {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 20px; /* 触发区域高度 */
  z-index: 9;
}

/* 底部区域 - 悬浮在内容之上 */
.panel-footer {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: auto;
  z-index: 10;
  user-select: none; /* 禁止选择文字 */
  display: flex;
  justify-content: flex-end;
  align-items: center;
  padding: 0;
  transform: translateY(100%); /* 默认隐藏在底部外 */
  transition: transform 0.3s ease; /* 添加平滑过渡效果 */
}

/* 当鼠标悬停在底部触发区域时显示底部区域 */
.footer-trigger-area:hover + .panel-footer,
.panel-footer:hover {
  transform: translateY(0); /* 显示底部区域 */
}

/* 底部区域模糊背景 */
.panel-footer-blur {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  /* 使用垂直渐变，透明度从上到下遵循平方增长曲线 */
  background: linear-gradient(
    to bottom,
    rgba(255, 255, 255, 0) 0%,
    rgba(255, 255, 255, 0.05) 25%,
    rgba(255, 255, 255, 0.15) 40%,
    rgba(255, 255, 255, 0.3) 60%,
    rgba(255, 255, 255, 0.6) 80%,
    rgba(255, 255, 255, 0.85) 100%
  );
  backdrop-filter: blur(8px);
  border-top: 1px solid var(--border-color, #f0f0f0);
  z-index: -1;
}

/* 底部区域内容容器 */
.panel-footer-content {
  padding: 0.75rem 1.25rem; /* 减小上下内边距 */
  display: flex;
  justify-content: flex-end;
  align-items: center;
  gap: 0.75rem;
  width: 100%;
}

/* 按钮样式 - 在底部区域中的按钮更紧凑 */
.panel-footer .btn {
  padding: 0.35rem 0.85rem; /* 更小的内边距 */
  font-size: 0.8rem; /* 稍小一点的字体 */
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

.btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* 当没有标题时调整布局 */
.base-panel:not(.has-title) .panel-content-column {
  flex: 1;
}

/* 深色模式变量 - 自动适应全局深浅色设定 */
:root {
  /* 卡片基础样式 */
  --card-bg-color: #ffffff;
  --card-border-color: #eaeaea;
  --text-color: #333333;
  --secondary-text-color: #777777;
  --border-color: #f0f0f0;
  --spinner-color: #f3f3f3;
  --primary-color: #000000;
  --error-color: #dc3545;
  
  /* 按钮 */
  --btn-primary-bg: #000000;
  --btn-primary-text: #ffffff;
}

/* 深色模式样式 */
:root[data-theme="dark"] .base-panel {
  /* 卡片基础样式 */
  --card-bg-color: #1f1f1f;
  --card-border-color: #333333;
  --text-color: #e0e0e0;
  --secondary-text-color: #aaaaaa;
  --border-color: #333333;
  --spinner-color: #333333;
  --primary-color: #ffffff;
  --error-color: #ff6b70;
  
  /* 按钮 */
  --btn-primary-bg: #ffffff;
  --btn-primary-text: #000000;
}

/* 深色模式下标题和覆盖层 */
:root[data-theme="dark"] .vertical-title-background {
  color: #ffffff; /* 深色模式固定为白色 */
  opacity: 0.45; /* 增加不透明度，使颜色更明显 */
}

:root[data-theme="dark"] .right-blur-overlay {
  /* 深色模式下的平方曲线渐变背景 */
  background: linear-gradient(
    to right,
    rgba(0, 0, 0, 0) 0%, /* 起始值为完全透明 */
    rgba(0, 0, 0, 0.05) 25%,
    rgba(0, 0, 0, 0.15) 40%,
    rgba(0, 0, 0, 0.3) 55%,
    rgba(0, 0, 0, 0.6) 70%,
    rgba(0, 0, 0, 0.85) 85%,
    rgba(0, 0, 0, 0.95) 100%
  );
}

/* 深色模式下的底部区域样式 */
:root[data-theme="dark"] .panel-footer-blur {
  /* 深色模式下的垂直渐变背景 */
  background: linear-gradient(
    to bottom,
    rgba(0, 0, 0, 0) 0%,
    rgba(0, 0, 0, 0.05) 25%,
    rgba(0, 0, 0, 0.15) 40%,
    rgba(0, 0, 0, 0.3) 60%,
    rgba(0, 0, 0, 0.6) 80%,
    rgba(0, 0, 0, 0.85) 100%
  );
  border-top: 1px solid var(--border-color, #333333);
}

:root[data-theme="dark"] .panel-actions {
  background-color: rgba(255, 255, 255, 0.1);
}

/* 响应式布局 */
@media (max-width: 768px) {
  .base-panel {
    flex-direction: column;
    min-height: auto;
  }
  
  .panel-title-column {
    flex: none;
    height: 50px; /* 在移动设备上调整为固定高度 */
    width: 100%;
  }
  
  .vertical-title-background {
    writing-mode: horizontal-tb;
    position: absolute;
    bottom: auto;
    top: 50%;
    transform: translateY(-50%);
    width: 100%;
    text-align: center;
    font-size: 1.5rem;
  }
  
  .left-overlay, .right-blur-overlay {
    width: 100%;
    height: 50%;
  }
  
  .left-overlay {
    top: 0;
    bottom: 50%;
  }
  
  .right-blur-overlay {
    top: 50%;
    bottom: 0;
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
  
  .panel-footer-content {
    padding: 0.6rem 1rem; /* 移动设备上更小的内边距 */
  }
}
</style> 