<template>
  <div class="bheader-wrapper" ref="headerWrapper">
    <!-- 顶部安全区域，防止内容被标题栏遮挡 -->
    <div class="safe-area-top" ref="safeArea" :style="safeAreaStyle"></div>
    
    <div class="bheader" ref="header">
      <div class="panel-container">
        <!-- 所有按钮在同一行 -->
        <div class="buttons-row">
          <div class="left-button-wrapper">
            <back-button v-if="showBackButton" />
            <slot name="left-content"></slot>
          </div>
          <div class="center-buttons" v-if="modes && modes.length > 0">
            <button 
              v-for="mode in modes" 
              :key="mode.value"
              type="button"
              :class="['mode-btn', { active: currentMode === mode.value }]"
              @click="setMode(mode.value)"
            >
              {{ mode.label }}
            </button>
          </div>
          <div class="center-title" v-else>
            <h2 class="page-title">{{ title }}</h2>
          </div>
          <div class="right-button-wrapper">
            <slot name="right-content">
              <theme-toggle v-if="showThemeToggle" />
            </slot>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import ThemeToggle from '@components/button/ThemeToggle.vue';
import BackButton from '@components/button/BackButton.vue';

export default {
  name: 'BHeader',
  components: {
    ThemeToggle,
    BackButton
  },
  props: {
    title: {
      type: String,
      default: '页面标题'
    },
    currentMode: {
      type: String,
      default: ''
    },
    modes: {
      type: Array,
      default: () => []
    },
    showBackButton: {
      type: Boolean,
      default: true
    },
    showThemeToggle: {
      type: Boolean,
      default: true
    },
    extraSpace: {
      type: Number,
      default: 20 // 默认额外空间为20px
    }
  },
  data() {
    return {
      headerHeight: 0,
      safeAreaStyle: {
        height: '100px'
      }
    };
  },
  mounted() {
    this.updateSafeAreaHeight();
    // 监听窗口大小变化，更新安全区域高度
    window.addEventListener('resize', this.updateSafeAreaHeight);
    // 使用MutationObserver监听DOM变化
    this.observer = new MutationObserver(this.updateSafeAreaHeight);
    this.observer.observe(this.$refs.header, {
      attributes: true,
      childList: true,
      subtree: true
    });
  },
  beforeUnmount() {
    window.removeEventListener('resize', this.updateSafeAreaHeight);
    if (this.observer) {
      this.observer.disconnect();
    }
  },
  methods: {
    setMode(mode) {
      this.$emit('set-mode', mode);
    },
    toggleMode() {
      this.$emit('toggle-mode');
    },
    goToHome() {
      this.$emit('go-home');
    },
    updateSafeAreaHeight() {
      // 延迟执行，确保DOM已经渲染
      this.$nextTick(() => {
        if (this.$refs.header) {
          // 获取header的实际高度
          const headerRect = this.$refs.header.getBoundingClientRect();
          
          // 计算top偏移量(3%的视口高度)
          const viewportHeight = window.innerHeight;
          const topOffset = viewportHeight * 0.03; // 3%的视口高度
          
          // 在移动设备上使用不同的偏移量
          const isMobile = window.innerWidth <= 768;
          const actualTopOffset = isMobile ? 15 : topOffset; // 移动设备上是15px
          
          // 计算安全区域高度 = header高度 + top偏移量 + 额外空间
          const newHeight = headerRect.height + actualTopOffset + this.extraSpace;
          
          // 更新安全区域样式
          this.safeAreaStyle = {
            height: `${newHeight}px`
          };
        }
      });
    }
  }
};
</script>

<style scoped>
.bheader-wrapper {
  width: 100%;
  position: relative;
}

/* 顶部安全区域，防止内容被标题栏遮挡 */
.safe-area-top {
  width: 100%;
  flex-shrink: 0;
  transition: height 0.3s ease;
}

.bheader {
  position: fixed;
  top: 3%; /* 向下移动一点 */
  left: 0;
  right: 0;
  width: auto;
  max-width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 0;
  z-index: 1000;
  /* 防止所有内容被选择 */
  user-select: none;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  transform: translateZ(0);
  will-change: backdrop-filter;
  isolation: isolate;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.bheader-inner {
  width: auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 0 auto;
}

.panel-container {
  position: relative;
  border-radius: 16px;
  padding: 20px;
  width: auto;
  min-width: min-content;
  max-width: 100%;
  display: inline-flex;
  flex-direction: column;
  align-items: center;
  margin: 0 auto;
  transition: all 0.3s ease;
  transform: translateZ(0);
  isolation: isolate;
  z-index: 1;
  /* 重要：让内容不受伪元素影响 */
  overflow: visible;
  background-color: transparent; /* 移除原来的背景色 */
}

/* 使用伪元素 ::before 实现高斯模糊效果 */
.panel-container::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  border-radius: 16px;
  background-color: rgba(255, 255, 255, 0.98);
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.08), 0 1px 3px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(0, 0, 0, 0.05);
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
  z-index: -1;
  transition: all 0.3s ease;
}

/* 所有按钮在同一行的布局 */
.buttons-row {
  width: auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 25px;
  flex-wrap: nowrap;
  position: relative; /* 确保内容在伪元素上方 */
  z-index: 2;
}

.left-button-wrapper {
  display: flex;
  align-items: center;
  flex-shrink: 0;
}

.center-buttons {
  display: flex;
  gap: 20px;
  flex-shrink: 0;
}

.center-title {
  display: flex;
  align-items: center;
  justify-content: center;
  flex: 0 1 auto;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  min-width: 0;
}

.page-title {
  margin: 0;
  font-size: 1.25rem;
  font-weight: 600;
  text-align: center;
  color: #333;
  /* 防止文字被选择 */
  user-select: none;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  position: relative;
  z-index: 2;
}

.right-button-wrapper {
  display: flex;
  align-items: center;
  flex-shrink: 0;
}

.mode-btn {
  padding: 12px 20px;
  background-color: rgba(240, 240, 240, 0.9);
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  min-width: 100px;
  text-align: center;
  /* 防止按钮文字被选择 */
  user-select: none;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  position: relative;
  z-index: 2;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
}

.mode-btn:hover {
  background-color: rgba(230, 230, 230, 0.95);
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  transform: translateY(-1px);
}

.mode-btn.active {
  background-color: #000; /* 黑底 */
  color: white; /* 白字 */
  border-color: #000;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
}

/* 确保所有图标不可选择 */
:deep(i), 
:deep(svg), 
:deep(img),
:deep(.va-button),
:deep(.va-button__content) {
  user-select: none;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  pointer-events: auto;
}

@media (max-width: 768px) {
  .bheader {
    top: 15px; /* 移动设备上稍微向下移动少一点 */
  }
  
  .panel-container {
    padding: 15px;
    width: 100%;
    min-width: unset;
  }
  
  .buttons-row {
    flex-wrap: wrap;
    gap: 20px;
    justify-content: center;
    width: 100%;
  }
  
  .center-buttons {
    order: 3;
    width: 100%;
    justify-content: center;
  }
  
  .left-button-wrapper {
    order: 1;
  }
  
  .right-button-wrapper {
    order: 2;
  }
  
  .mode-btn {
    flex: 1;
    min-width: 80px;
    padding: 10px 15px;
  }
  
  .page-title {
    font-size: 1.1rem;
  }
}

/* 深色模式样式 */
:root[data-theme="dark"] .panel-container::before {
  background-color: rgba(20, 20, 20, 0.98);
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2), 0 1px 4px rgba(0, 0, 0, 0.3), 0 0 2px rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.15);
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);
}

/* 添加主题切换动画 */
@keyframes headerThemeTransition {
  0% {
    opacity: 0.8;
  }
  100% {
    opacity: 1;
  }
}

:root[data-theme="dark"] .bheader,
:root[data-theme="light"] .bheader {
  animation: headerThemeTransition 0.4s forwards cubic-bezier(0.4, 0, 0.2, 1);
}

/* 增加提示，帮助检查CSS计算样式 */
.debug-info {
  display: none;
  position: absolute;
  bottom: -20px;
  left: 0;
  font-size: 10px;
  color: red;
  background: white;
  padding: 2px;
  z-index: 9999;
}

/* 深色模式下移动设备样式 */
@media (max-width: 768px) {
  :root[data-theme="dark"] .panel-container::before {
    background-color: rgba(20, 20, 20, 0.98);
  }
  
  .panel-container::before {
    background-color: rgba(255, 255, 255, 0.98);
  }
}

:root[data-theme="dark"] .mode-btn {
  background-color: rgba(60, 60, 60, 0.95);
  color: #e0e0e0;
  border: 1px solid rgba(255, 255, 255, 0.2);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2), 0 0 1px rgba(255, 255, 255, 0.1);
}

:root[data-theme="dark"] .mode-btn:hover {
  background-color: rgba(75, 75, 75, 0.98);
  border-color: rgba(255, 255, 255, 0.3);
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.3), 0 0 2px rgba(255, 255, 255, 0.2);
  transform: translateY(-1px);
}

:root[data-theme="dark"] .mode-btn.active {
  background-color: #fff; /* 白底 */
  color: #000; /* 黑字 */
  border-color: rgba(255, 255, 255, 0.8);
  box-shadow: 0 0 8px rgba(255, 255, 255, 0.3), 0 0 2px rgba(255, 255, 255, 0.5);
}

:root[data-theme="dark"] .page-title {
  color: #ffffff;
}
</style> 