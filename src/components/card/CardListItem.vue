<template>
  <li class="card-list-item" :class="customClass">
    <!-- 左侧图标区域 -->
    <div class="item-icon" v-if="$slots.icon || icon || iconSrc">
      <slot name="icon">
        <span v-if="icon" class="default-icon">{{ icon }}</span>
        <span v-else-if="iconSrc" class="svg-icon">
          <img :src="iconSrc" :alt="iconAlt || '图标'" />
        </span>
      </slot>
    </div>
    
    <!-- 中间内容区域 -->
    <div class="item-content">
      <slot></slot>
    </div>
    
    <!-- 右侧按钮区域 -->
    <div class="item-actions">
      <slot name="actions"></slot>
    </div>
  </li>
</template>

<script setup>
defineProps({
  // 默认图标（emoji）
  icon: {
    type: String,
    default: ''
  },
  // 图标路径（SVG）
  iconSrc: {
    type: String,
    default: ''
  },
  // 图标alt文本
  iconAlt: {
    type: String,
    default: ''
  },
  // 自定义类名
  customClass: {
    type: String,
    default: ''
  }
});
</script>

<style scoped>
.card-list-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem;
  background-color: var(--item-bg-color, #f9f9f9);
  border-radius: 6px;
  transition: background-color 0.2s;
  border: 1px solid var(--item-border-color, #eee);
  text-align: left;
  gap: 0.75rem;
}

.card-list-item:hover {
  background-color: var(--item-hover-bg-color, #f0f0f0);
}

.item-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2rem;
  color: var(--icon-color, #777);
  flex-shrink: 0;
  width: 36px;
  height: 36px;
  border-radius: 4px;
  position: relative;
}

.default-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  transition: transform 0.3s ease;
  line-height: 1;
}

.svg-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  transition: transform 0.3s ease;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

.svg-icon img {
  width: 100%;
  height: 100%;
  transition: filter 0.3s ease;
  display: block;
}

.card-list-item:hover .default-icon {
  transform: scale(1.1);
}

.card-list-item:hover .svg-icon {
  transform: translate(-50%, -50%) scale(1.1);
}

.item-content {
  flex: 1;
  min-width: 0;
  overflow: hidden;
  padding-top: 0;
}

.item-actions {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 0.5rem;
  margin-left: 0.5rem;
  flex-shrink: 0;
}

/* 按钮基础样式 */
.btn-icon {
  background: none;
  border: none;
  font-size: 0.85rem;
  font-weight: 500;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--btn-primary-text, #ffffff);
  background-color: var(--btn-primary-bg, #000000);
  border: 1px solid transparent;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-icon:hover {
  opacity: 0.9;
}

.btn-icon:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* 查看按钮样式 */
.view-btn {
  background-color: var(--btn-primary-bg, #000000);
  color: var(--btn-primary-text, #ffffff);
}

/* 删除按钮样式 */
.delete-btn {
  background-color: var(--error-color, #d32f2f);
  color: white;
}

/* 加载动画 */
.loading-dot {
  display: inline-block;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background-color: currentColor;
  animation: pulse 1s infinite;
}

@keyframes pulse {
  0% { opacity: 0.3; }
  50% { opacity: 1; }
  100% { opacity: 0.3; }
}

/* 响应式调整 */
@media (max-width: 768px) {
  .item-actions {
    flex-direction: row;
  }
}

/* 深色模式适配 */
:root[data-theme="dark"] .card-list-item {
  background-color: var(--item-bg-color, #2a2a2a);
  border-color: var(--item-border-color, #444444);
}

:root[data-theme="dark"] .card-list-item:hover {
  background-color: var(--item-hover-bg-color, #333333);
}

:root[data-theme="dark"] .view-btn {
  color: var(--view-icon-color, #aaaaaa);
}

:root[data-theme="dark"] .delete-btn {
  color: var(--delete-icon-color, #ff6b6b);
}

:root[data-theme="dark"] .btn-icon {
  background-color: var(--btn-primary-bg, #ffffff);
  color: var(--btn-primary-text, #000000);
}

:root[data-theme="dark"] .delete-btn {
  background-color: var(--error-color, #ff6b6b);
  color: black;
}

/* SVG图标深色模式适配 */
:root[data-theme="dark"] .svg-icon img {
  filter: brightness(0) invert(1); /* 深色模式下图标显示为白色 */
}

/* 浅色模式下的样式 */
:root[data-theme="light"] .svg-icon img {
  filter: none; /* 浅色模式下保持原色 */
}

.btn-primary {
  background-color: var(--btn-primary-bg, #000000);
  color: var(--btn-primary-text, #ffffff);
  border: 1px solid transparent;
}

.btn-primary:hover {
  opacity: 0.9;
}

.btn-primary.delete-btn {
  background-color: var(--error-color, #d32f2f);
  color: white;
}

/* 深色模式适配 */
:root[data-theme="dark"] .btn-primary {
  background-color: var(--btn-primary-bg, #ffffff);
  color: var(--btn-primary-text, #000000);
}

:root[data-theme="dark"] .btn-primary.delete-btn {
  background-color: var(--error-color, #ff6b6b);
  color: black;
}
</style> 