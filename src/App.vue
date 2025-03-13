<script setup>
// 在这里导入全局需要的内容
</script>

<template>
  <div class="app-container">
    <!-- 路由视图，显示当前路由对应的组件 -->
    <router-view />
  </div>
</template>

<style>
/* 全局样式 */
* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

html, body {
  height: 100%;
  width: 100%;
  margin: 0;
  padding: 0;
  overflow-x: hidden;
  overflow-y: hidden; /* 防止全局滚动 */
}

#app {
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
  overflow: hidden; /* 防止应用级别滚动 */
}

.app-container {
  flex: 1;
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  overflow: hidden; /* 修改：从 overflow-y: auto 改为 overflow: hidden */
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
  overflow: hidden; /* 修改：从 overflow-y: auto 改为 overflow: hidden */
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
  padding: 1rem;
  box-sizing: border-box;
  overflow: auto; /* 只保留内容区的滚动 */
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
</style>
