<template>
  <div class="auth-mode-toggle">
    <div class="panel-container">
      <!-- 所有按钮在同一行 -->
      <div class="buttons-row">
        <div class="home-button-wrapper">
          <back-button />
        </div>
        <div class="center-buttons">
          <button 
            type="button"
            :class="['mode-btn', { active: currentMode === 'login' }]"
            @click="setMode('login')"
          >
            登录
          </button>
          <button 
            type="button"
            :class="['mode-btn', { active: currentMode === 'register' }]"
            @click="setMode('register')"
          >
            注册
          </button>
        </div>
        <div class="theme-toggle-wrapper">
          <theme-toggle />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import ThemeToggle from '../../../components/button/ThemeToggle.vue';
import BackButton from '../../../components/button/BackButton.vue';

export default {
  name: 'AuthModeToggle',
  components: {
    ThemeToggle,
    BackButton
  },
  props: {
    currentMode: {
      type: String,
      required: true,
      validator: value => ['login', 'register'].includes(value)
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
    }
  }
};
</script>

<style scoped>
.auth-mode-toggle {
  position: relative;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 0;
}

.panel-container {
  /* 浅色模式下高斯模糊 */
  background-color: rgba(255, 255, 255, 0.7);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border-radius: 16px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  padding: 20px;
  width: auto;
  min-width: 400px;
  display: inline-flex;
  flex-direction: column;
  align-items: center;
}

/* 所有按钮在同一行的布局 */
.buttons-row {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 25px;
}

.home-button-wrapper {
  display: flex;
}

.center-buttons {
  display: flex;
  gap: 20px;
}

.theme-toggle-wrapper {
  display: flex;
  align-items: center;
}

.mode-btn {
  padding: 12px 20px;
  background-color: rgba(245, 245, 245, 0.7);
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  min-width: 100px;
  text-align: center;
}

.mode-btn:hover {
  background-color: rgba(232, 232, 232, 0.9);
}

.mode-btn.active {
  background-color: #000; /* 黑底 */
  color: white; /* 白字 */
  border-color: #000;
}

@media (max-width: 768px) {
  .panel-container {
    padding: 15px;
    width: 100%;
    min-width: unset;
  }
  
  .buttons-row {
    flex-wrap: wrap;
    gap: 20px;
    justify-content: center;
  }
  
  .center-buttons {
    order: 3;
    width: 100%;
    justify-content: center;
  }
  
  .home-button-wrapper {
    order: 1;
  }
  
  .theme-toggle-wrapper {
    order: 2;
  }
  
  .mode-btn {
    flex: 1;
    min-width: 80px;
    padding: 10px 15px;
  }
}

/* 深色模式样式 */
:root[data-theme="dark"] .panel-container {
  /* 深色模式下高斯模糊 */
  background-color: rgba(26, 26, 26, 0.7);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
}

:root[data-theme="dark"] .mode-btn {
  background-color: rgba(51, 51, 51, 0.7);
  color: #e0e0e0;
  border-color: #444;
}

:root[data-theme="dark"] .mode-btn:hover {
  background-color: rgba(68, 68, 68, 0.9);
}

:root[data-theme="dark"] .mode-btn.active {
  background-color: #fff; /* 白底 */
  color: #000; /* 黑字 */
  border-color: #fff;
}
</style> 