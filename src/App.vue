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
  width: 100%;
  margin: 0;
  padding: 0;
}

html, body {
  height: 100%;
  width: 100%;
  margin: 0;
  padding: 0;
  overflow-x: hidden;
}

#app {
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
}

.app-container {
  flex: 1;
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  overflow-y: auto;
}
</style>
