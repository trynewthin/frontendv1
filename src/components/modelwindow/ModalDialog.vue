<template>
  <Teleport to="body">
    <transition name="fade" appear>
      <div v-if="modelValue" class="modal-overlay" @click="handleOverlayClick">
        <div class="modal-wrapper">
          <div class="modal-content" @click.stop>
            <!-- 标题栏 -->
            <div class="modal-header">
              <h3 class="modal-title">{{ title }}</h3>
              <button 
                v-if="showCloseButton" 
                class="close-button" 
                @click="handleCancel"
                type="button"
              >×</button>
            </div>
            
            <!-- 内容区域 -->
            <div class="modal-body">
              <slot>
                <p class="modal-message">{{ message }}</p>
              </slot>
            </div>
            
            <!-- 按钮区域 -->
            <div class="modal-footer">
              <button 
                v-if="cancelText" 
                class="modal-button cancel-button" 
                @click="handleCancel"
                :disabled="loading"
                type="button"
              >
                {{ cancelText }}
              </button>
              <button 
                class="modal-button confirm-button" 
                @click="handleConfirm"
                :disabled="loading"
                type="button"
              >
                <div v-if="loading && showLoadingSpinner" class="loading-spinner"></div>
                <span>{{ confirmText }}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </transition>
  </Teleport>
</template>

<script setup>
import { defineProps, defineEmits, watch, onMounted, onUnmounted } from 'vue';

const props = defineProps({
  // 是否显示对话框
  modelValue: {
    type: Boolean,
    default: false
  },
  // 对话框标题
  title: {
    type: String,
    default: '确认'
  },
  // 对话框消息内容
  message: {
    type: String,
    default: '确定要执行此操作吗？'
  },
  // 确认按钮文本
  confirmText: {
    type: String,
    default: '确定'
  },
  // 取消按钮文本
  cancelText: {
    type: String,
    default: '取消'
  },
  // 是否正在加载
  loading: {
    type: Boolean,
    default: false
  },
  // 是否显示关闭按钮
  showCloseButton: {
    type: Boolean,
    default: true
  },
  // 点击遮罩层是否可关闭
  closeOnClickOverlay: {
    type: Boolean,
    default: true
  }
});

const emit = defineEmits(['update:modelValue', 'confirm', 'cancel']);

// 监听modelValue变化
watch(() => props.modelValue, (newValue) => {
  if (newValue) {
    disableBodyScroll();
  } else {
    enableBodyScroll();
  }
});

// 处理确认按钮点击
const handleConfirm = () => {
  emit('confirm');
  // 如果没有取消按钮，点击确认后自动关闭对话框
  if (!props.cancelText) {
    emit('update:modelValue', false);
  }
};

// 处理取消按钮点击
const handleCancel = () => {
  if (props.loading) return;
  emit('cancel');
  emit('update:modelValue', false);
};

// 处理遮罩层点击
const handleOverlayClick = (event) => {
  if (props.closeOnClickOverlay && !props.loading) {
    handleCancel();
  }
};

// 禁用body滚动
const disableBodyScroll = () => {
  document.body.style.overflow = 'hidden';
};

// 启用body滚动
const enableBodyScroll = () => {
  document.body.style.overflow = '';
};

// 处理ESC键关闭对话框
const handleKeyDown = (e) => {
  if (e.key === 'Escape' && props.modelValue && !props.loading) {
    handleCancel();
  }
};

// 组件挂载时
onMounted(() => {
  window.addEventListener('keydown', handleKeyDown);
  // 初始状态根据modelValue决定是否启用滚动
  if (props.modelValue) {
    disableBodyScroll();
  }
});

// 组件卸载时
onUnmounted(() => {
  window.removeEventListener('keydown', handleKeyDown);
  enableBodyScroll();
});
</script>

<style scoped>
/* 透明无色高斯模糊遮罩层 */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  /* 透明无色背景 */
  background-color: rgba(255, 255, 255, 0.2);
  /* 高斯模糊效果 */
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  z-index: 9999;
  overflow: hidden;
}

/* 包装器 - 负责居中定位 */
.modal-wrapper {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  margin: 0;
  padding: 0;
  width: calc(100% - 40px);
  max-width: 500px;
  max-height: 90vh;
  box-sizing: border-box;
}

/* 内容容器 */
.modal-content {
  background-color: #ffffff;
  border-radius: 8px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
  width: 100%;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  max-height: 90vh;
}

.modal-header {
  padding: 16px 20px;
  border-bottom: 1px solid #eee;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.modal-title {
  margin: 0;
  font-size: 18px;
  font-weight: 600;
  color: #333;
}

.close-button {
  background: none;
  border: none;
  font-size: 24px;
  color: #999;
  cursor: pointer;
  padding: 0;
  margin: 0;
  width: 24px;
  height: 24px;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 50%;
}

.close-button:hover {
  background-color: rgba(0, 0, 0, 0.05);
  color: #666;
}

.modal-body {
  flex: 1;
  overflow-y: auto;
  padding: 20px;
  min-height: 100px;
}

.modal-message {
  margin: 0;
  font-size: 16px;
  line-height: 1.5;
  color: #333;
  text-align: center;
}

.modal-footer {
  padding: 16px 20px;
  border-top: 1px solid #eee;
  display: flex;
  justify-content: center;
  gap: 12px;
}

.modal-button {
  min-width: 100px;
  padding: 10px 16px;
  border-radius: 4px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  justify-content: center;
  align-items: center;
}

.modal-button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.cancel-button {
  background-color: #f5f5f5;
  color: #333;
  border: 1px solid #ddd;
}

.cancel-button:hover:not(:disabled) {
  background-color: #e8e8e8;
}

.confirm-button {
  background-color: #000;
  color: #fff;
  border: none;
}

.confirm-button:hover:not(:disabled) {
  background-color: #333;
}

.loading-spinner {
  display: inline-block;
  width: 16px;
  height: 16px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  border-top-color: #fff;
  animation: spin 1s linear infinite;
  margin-right: 8px;
}

/* 过渡动画 */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

/* 移动设备适配 */
@media (max-width: 768px) {
  .modal-wrapper {
    width: calc(100% - 30px);
  }
  
  .modal-footer {
    flex-direction: column-reverse;
  }
  
  .modal-button {
    width: 100%;
  }
}

/* 深色模式 */
@media (prefers-color-scheme: dark) {
  .modal-overlay {
    /* 深色模式下的遮罩层 */
    background-color: rgba(0, 0, 0, 0.2);
    backdrop-filter: blur(10px);
    -webkit-backdrop-filter: blur(10px);
  }

  .modal-content {
    background-color: #1e1e1e;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.5);
  }
  
  .modal-header {
    border-bottom-color: #333;
  }
  
  .modal-title {
    color: #e0e0e0;
  }
  
  .close-button {
    color: #aaa;
  }
  
  .close-button:hover {
    background-color: rgba(255, 255, 255, 0.1);
    color: #ddd;
  }
  
  .modal-message {
    color: #e0e0e0;
  }
  
  .modal-footer {
    border-top-color: #333;
  }
  
  .cancel-button {
    background-color: #333;
    color: #e0e0e0;
    border-color: #444;
  }
  
  .cancel-button:hover:not(:disabled) {
    background-color: #444;
  }
  
  .confirm-button {
    background-color: #ffffff;
    color: #000;
  }
  
  .confirm-button:hover:not(:disabled) {
    background-color: #e0e0e0;
  }
}

/* 支持data-theme属性的深色模式 */
:root[data-theme="dark"] .modal-overlay {
  background-color: rgba(0, 0, 0, 0.2);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
}

:root[data-theme="dark"] .modal-content {
  background-color: #1e1e1e;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.5);
}

:root[data-theme="dark"] .modal-header {
  border-bottom-color: #333;
}

:root[data-theme="dark"] .modal-title {
  color: #e0e0e0;
}

:root[data-theme="dark"] .close-button {
  color: #aaa;
}

:root[data-theme="dark"] .close-button:hover {
  background-color: rgba(255, 255, 255, 0.1);
  color: #ddd;
}

:root[data-theme="dark"] .modal-message {
  color: #e0e0e0;
}

:root[data-theme="dark"] .modal-footer {
  border-top-color: #333;
}

:root[data-theme="dark"] .cancel-button {
  background-color: #333;
  color: #e0e0e0;
  border-color: #444;
}

:root[data-theme="dark"] .cancel-button:hover:not(:disabled) {
  background-color: #444;
}

:root[data-theme="dark"] .confirm-button {
  background-color: #ffffff;
  color: #000;
}

:root[data-theme="dark"] .confirm-button:hover:not(:disabled) {
  background-color: #e0e0e0;
}
</style> 