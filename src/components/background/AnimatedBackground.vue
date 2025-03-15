<template>
  <div class="bg-animation-container">
    <div class="bg-animation-element"></div>
    <!-- 平台名称可选显示 -->
    <div v-if="showTitle" class="platform-title">
      <div class="title-wrapper">
        <h1>{{ title }}</h1>
      </div>
    </div>
    <!-- 右下角路由文字 -->
    <div v-if="showRouteText" class="route-text">
      <h2>{{ routeText }}</h2>
    </div>
  </div>
</template>

<script>
export default {
  name: 'AnimatedBackground',
  props: {
    showTitle: {
      type: Boolean,
      default: false
    },
    title: {
      type: String,
      default: '智选车'
    },
    showRouteText: {
      type: Boolean,
      default: false
    },
    routeText: {
      type: String,
      default: ''
    }
  }
};
</script>

<style scoped>
/* 背景动画容器 */
.bg-animation-container {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: -1;
  overflow: hidden;
  pointer-events: none;
  transition: background-color 0.8s cubic-bezier(0.4, 0, 0.2, 1);
}

.bg-animation-element {
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  background: radial-gradient(circle at center, rgba(255, 255, 255, 0.2) 0%, rgba(255, 255, 255, 0) 70%);
  opacity: 0;
  transition: all 1.2s cubic-bezier(0.4, 0, 0.2, 1);
  animation: rotateBg 25s linear infinite;
}

@keyframes rotateBg {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

/* 平台名称样式 - 使用容器包裹确保不超出屏幕 */
.platform-title {
  position: absolute;
  top: 1%;
  left: 5%;
  z-index: 0;
  overflow: visible;
  transition: all 0.6s cubic-bezier(0.4, 0, 0.2, 1);
}

.title-wrapper {
  transform: rotate(90deg);
  transform-origin: left top;
  display: block;
}

.platform-title h1 {
  font-size: min(40px, 5vw);
  font-weight: 900; /* 加粗 */
  color: white;
  text-shadow: none;
  margin: 0;
  padding: 0;
  letter-spacing: 2px;
  opacity: 0.6;
  pointer-events: none; /* 确保文本不会干扰点击事件 */
  white-space: nowrap;
  transition: all 0.6s cubic-bezier(0.4, 0, 0.2, 1);
}

/* 右下角路由文字样式 */
.route-text {
  position: absolute;
  bottom: 5%;
  right: 5%;
  z-index: 0;
  max-width: 80%; /* 限制最大宽度 */
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  transition: all 0.6s cubic-bezier(0.4, 0, 0.2, 1);
}

.route-text h2 {
  font-size: min(36px, 6vw); /* 响应式字体大小 */
  font-weight: 700;
  color: white;
  text-shadow: none;
  margin: 0;
  padding: 0;
  letter-spacing: 1px;
  opacity: 0.7;
  pointer-events: none; /* 确保文本不会干扰点击事件 */
  transition: all 0.6s cubic-bezier(0.4, 0, 0.2, 1);
}

/* 深色模式样式 */
:root[data-theme="dark"] .bg-animation-container {
  background-color: #000;
}

:root[data-theme="dark"] .bg-animation-element {
  background: radial-gradient(circle at center, rgba(40, 40, 80, 0.15) 0%, rgba(0, 0, 0, 0) 70%);
  opacity: 0.8;
  animation: rotateBgDark 30s linear infinite;
}

@keyframes rotateBgDark {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

/* 浅色模式特定动画 */
:root[data-theme="light"] .bg-animation-container {
  background-color: #f5f7fa;
}

:root[data-theme="light"] .bg-animation-element {
  background: radial-gradient(circle at center, rgba(255, 255, 255, 0.4) 0%, rgba(255, 255, 255, 0) 60%);
  opacity: 0.6;
}

/* 浅色模式下文字颜色改为黑色 */
:root[data-theme="light"] .platform-title h1,
:root[data-theme="light"] .route-text h2 {
  color: #000;
  opacity: 0.8;
  transition: color 0.6s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.6s cubic-bezier(0.4, 0, 0.2, 1);
}

/* 在深色模式下添加阴影和更高的不透明度 */
:root[data-theme="dark"] .platform-title h1,
:root[data-theme="dark"] .route-text h2 {
  color: #fff;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
  opacity: 0.9;
  transition: color 0.6s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.6s cubic-bezier(0.4, 0, 0.2, 1), text-shadow 0.6s cubic-bezier(0.4, 0, 0.2, 1);
}

/* 主题切换动画 */
@keyframes fadeTheme {
  0% {
    opacity: 0;
    transform: scale(0.98);
  }
  100% {
    opacity: 1;
    transform: scale(1);
  }
}

:root[data-theme="dark"] .bg-animation-container {
  animation: fadeTheme 0.8s forwards cubic-bezier(0.4, 0, 0.2, 1);
}

:root[data-theme="light"] .bg-animation-container {
  animation: fadeTheme 0.8s forwards cubic-bezier(0.4, 0, 0.2, 1);
}

/* 小屏幕设备的响应式调整 */
@media (max-width: 768px) {
  .platform-title {
    top: 15px;
    left: 15px;
  }
  
  .platform-title h1 {
    font-size: min(30px, 4.5vw);
  }
  
  .route-text {
    bottom: 3%;
    right: 5%;
  }
  
  .route-text h2 {
    font-size: min(24px, 5vw);
  }
}

/* 超小屏幕设备的额外调整 */
@media (max-width: 480px) {
  .platform-title {
    top: 10px;
    left: 10px;
  }
  
  .platform-title h1 {
    font-size: min(24px, 4vw);
  }
  
  .route-text {
    bottom: 2%;
    right: 3%;
    max-width: 70%;
  }
}

/* 确保在横屏模式下也能正常显示 */
@media (orientation: landscape) and (max-height: 500px) {
  .platform-title {
    top: 10px;
    left: 10px;
  }
  
  .platform-title h1 {
    font-size: min(20px, 4vh);
  }
  
  .route-text {
    bottom: 5%;
  }
  
  .route-text h2 {
    font-size: min(20px, 5vh);
  }
}
</style> 