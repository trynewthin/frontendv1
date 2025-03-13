<template>
  <va-button 
    class="back-button" 
    @click="handleClick" 
    :text-color="textColor" 
    :color="color"
    flat
  >
    <i data-lucide="arrow-left"></i>
  </va-button>
</template>

<script setup>
import { defineProps, defineEmits, onMounted } from 'vue';

const props = defineProps({
  textColor: {
    type: String,
    default: '#333'
  },
  color: {
    type: String,
    default: 'transparent'
  },
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
  width: 36px;
  height: 36px;
  min-width: 36px;
  border-radius: 50%;
  padding: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  border: none !important;
  outline: none !important;
}

.back-button:focus,
.back-button:active {
  box-shadow: none !important;
  border: none !important;
  outline: none !important;
}

.back-button i {
  width: 20px;
  height: 20px;
  stroke-width: 2;
}

@media (max-width: 768px) {
  .back-button {
    width: 32px;
    height: 32px;
    min-width: 32px;
  }
  
  .back-button i {
    width: 18px;
    height: 18px;
  }
}
</style> 