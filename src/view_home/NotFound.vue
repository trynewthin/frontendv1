<template>
  <div class="not-found-container">
    <div class="not-found-content">
      <div class="error-code">404</div>
      <h1 class="error-title">页面未找到</h1>
      <p class="error-message">抱歉，您访问的页面不存在或已被移除。</p>
      
      <div class="action-buttons">
        <va-button 
          color="primary" 
          class="home-button" 
          size="large"
          @click="goToHome"
        >
          返回首页
        </va-button>
        
        <va-button 
          color="secondary" 
          class="back-button" 
          size="large"
          @click="goBack"
        >
          返回上一页
        </va-button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router';
import { onMounted } from 'vue';

const router = useRouter();

// 返回首页
const goToHome = () => {
  router.push('/');
};

// 返回上一页
const goBack = () => {
  // 如果有历史记录，则返回上一页，否则返回首页
  if (window.history.length > 1) {
    router.go(-1);
  } else {
    router.push('/');
  }
};

// 确保页面铺满整个视口
onMounted(() => {
  document.body.style.overflow = 'hidden';
  
  return () => {
    document.body.style.overflow = '';
  };
});
</script>

<style scoped>
.not-found-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  height: 100vh;
  width: 100vw;
  margin: 0;
  padding: 0;
  background-color: #f5f7fa;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  overflow: auto;
  z-index: 9999;
}

.not-found-content {
  text-align: center;
  max-width: 600px;
  width: 90%;
  padding: 3rem;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  margin: auto;
  animation: fadeIn 0.5s ease-in-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.error-code {
  font-size: 8rem;
  font-weight: 700;
  color: var(--va-primary);
  line-height: 1;
  margin-bottom: 1rem;
}

.error-title {
  font-size: 2rem;
  font-weight: 600;
  margin-bottom: 1rem;
  color: #333;
}

.error-message {
  font-size: 1.1rem;
  color: #666;
  margin-bottom: 2rem;
}

.action-buttons {
  display: flex;
  justify-content: center;
  gap: 1rem;
}

.home-button,
.back-button {
  padding: 0.75rem 1.5rem;
  font-size: 1rem;
  min-width: 140px;
}

@media (max-width: 768px) {
  .not-found-content {
    padding: 2rem;
    width: 85%;
  }
  
  .error-code {
    font-size: 6rem;
  }
  
  .error-title {
    font-size: 1.5rem;
  }
  
  .error-message {
    font-size: 1rem;
  }
  
  .action-buttons {
    flex-direction: column;
    gap: 0.75rem;
  }
  
  .home-button,
  .back-button {
    width: 100%;
    margin: 0;
  }
}

@media (max-height: 600px) {
  .not-found-content {
    padding: 1.5rem;
  }
  
  .error-code {
    font-size: 5rem;
    margin-bottom: 0.5rem;
  }
  
  .error-title {
    margin-bottom: 0.5rem;
  }
  
  .error-message {
    margin-bottom: 1rem;
  }
}
</style> 