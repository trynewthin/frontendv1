<script setup>
// 在这里导入全局需要的内容
</script>

<template>
  <div class="app-container">
    <!-- 路由视图，显示当前路由对应的组件 -->
    <router-view v-slot="{ Component }">
      <transition 
        name="page" 
        mode="out-in"
      >
        <component :is="Component" />
      </transition>
    </router-view>
  </div>
</template>

<style>
/* 全局样式 */
* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

html, body, #app {
  height: 100%;
  width: 100%;
  margin: 0;
  padding: 0;
  overflow-x: hidden;
  overflow-y: auto;
}

.app-container {
  flex: 1;
  display: flex;
  flex-direction: column;
  width: 100vw;
  height: 100vh;
  overflow-y: auto;
  max-width: 100%;
  padding: 0 !important;
  margin: 0 !important;
  position: absolute;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
}

/* 自动应用于所有视图容器的基本布局样式 */
.register-test-view,
.login-test-view,
.test-home,
.home-view {
  display: flex;
  flex-direction: column;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  width: 100vw;
  height: 100vh;
  margin: 0;
  padding: 0;
  background-color: #f5f7fa;
  overflow-y: auto; /* 允许垂直滚动 */
  overflow-x: hidden; /* 防止水平滚动 */
  box-sizing: border-box;
}

/* 所有页面的通用标题栏样式 */
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 2rem;
  background-color: white;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  box-sizing: border-box;
  width: 100%;
}

/* 所有页面的通用内容区样式 */
.content {
  flex: 1;
  display: flex;
  width: 100%;
  padding: 0; /* 移除内边距 */
  box-sizing: border-box;
  overflow: auto;
}

/* 文本元素基本样式 */
h1, h2, h3, h4, p, a, button, span {
  width: auto;
}

/* 全局滚动条样式 */
::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}

::-webkit-scrollbar-track {
  background: transparent;
}

::-webkit-scrollbar-thumb {
  background-color: rgba(0, 0, 0, 0.1);
  border-radius: 3px;
}

::-webkit-scrollbar-thumb:hover {
  background-color: rgba(0, 0, 0, 0.2);
}

/* 响应式设计 */
@media (max-width: 768px) {
  .header {
    padding: 1rem;
    flex-direction: column;
    gap: 1rem;
    text-align: center;
  }
}

/* 添加一个全局样式确保轮播图和其他内容占满宽度 */
.carousel-area, .recommendation-area {
  width: 100vw !important;
  max-width: 100vw !important;
  margin-left: 0 !important;
  margin-right: 0 !important;
  padding-left: 0 !important;
  padding-right: 0 !important;
  box-sizing: border-box !important;
  position: relative !important;
  left: 0 !important;
  right: 0 !important;
}

/* 强制移除所有可能的边距和内边距 */
body * {
  margin-left: 0 !important;
  margin-right: 0 !important;
}

/* 路由过渡动画 */
.page-enter-active,
.page-leave-active {
  transition: all 0.3s ease;
}

.page-enter-from {
  opacity: 0;
  filter: blur(10px);
  transform: scale(0.98);
}

.page-leave-to {
  opacity: 0;
  filter: blur(10px);
  transform: scale(1.02);
}

.page-enter-to,
.page-leave-from {
  opacity: 1;
  filter: blur(0);
  transform: scale(1);
}
</style>
