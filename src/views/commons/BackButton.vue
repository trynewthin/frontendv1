<template>
  <va-button 
    class="back-button" 
    @click="handleClick" 
    preset="secondary"
    text-color="#333333" 
    size="small"
    flat
  >
    <i data-lucide="arrow-left"></i>
    <span class="button-text">返回</span>
  </va-button>
</template>

<script setup>
import { defineProps, defineEmits, onMounted } from 'vue';

const props = defineProps({
  to: {
    type: [String, Object],
    default: null
  }
});

const emit = defineEmits(['click']);

const handleClick = (event) => {
  emit('click', event);
};

// 确保图标正确渲染
onMounted(() => {
  if (window.lucide) {
    window.lucide.createIcons();
  }
});
</script>

<style scoped>
.back-button {
  font-weight: 500;
  border-radius: 4px;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
}

.back-button i {
  width: 18px;
  height: 18px;
  stroke-width: 2;
}

.button-text {
  margin-left: 2px;
}

/* 深色模式下的样式 */
:root[data-theme="dark"] .back-button {
  color: #FFD700 !important;
}

:root[data-theme="dark"] .back-button:hover {
  background-color: rgba(255, 215, 0, 0.1);
}

@media (max-width: 768px) {
  .back-button {
    padding: 4px 8px;
  }
  
  .back-button i {
    width: 16px;
    height: 16px;
  }
  
  .button-text {
    font-size: 0.9rem;
  }
}
</style> 