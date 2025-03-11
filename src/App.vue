<script setup>
// 不需要导入HelloWorld组件，因为它将在HomePage中使用
import { useCounterStore } from './stores/counter'

// 获取状态管理示例
const counterStore = useCounterStore()
</script>

<template>
  <header>
    <div class="wrapper">
      <nav>
        <router-link to="/">首页</router-link>
        <router-link to="/about">关于</router-link>
      </nav>
      <div class="counter-demo">
        <p>Pinia 状态管理示例: {{ counterStore.count }}</p>
        <p>双倍计数: {{ counterStore.doubleCount }}</p>
        <button @click="counterStore.increment">增加</button>
        <button @click="counterStore.decrement">减少</button>
        <button @click="counterStore.reset">重置</button>
        <button @click="counterStore.incrementAsync">异步增加</button>
      </div>
    </div>
  </header>

  <main>
    <!-- 路由视图，显示当前路由对应的组件 -->
    <router-view />
  </main>
</template>

<style scoped>
header {
  line-height: 1.5;
  max-height: 100vh;
}

.wrapper {
  margin: 0 auto;
  padding: 2rem;
  display: flex;
  flex-direction: column;
  align-items: center;
}

nav {
  width: 100%;
  font-size: 16px;
  text-align: center;
  margin-bottom: 2rem;
}

nav a {
  display: inline-block;
  padding: 0 1rem;
  border-radius: 4px;
  text-decoration: none;
  color: #333;
  margin: 0 0.5rem;
  transition: background-color 0.3s, color 0.3s;
}

nav a:hover {
  background-color: #f0f0f0;
}

nav a.router-link-active {
  color: #42b983;
  font-weight: bold;
}

.counter-demo {
  margin: 1rem 0;
  padding: 1rem;
  background-color: #f9f9f9;
  border-radius: 8px;
  text-align: center;
}

.counter-demo button {
  margin: 0.5rem;
  padding: 0.5rem 1rem;
  background-color: #42b983;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.counter-demo button:hover {
  background-color: #3aa876;
}
</style>
