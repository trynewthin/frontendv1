<template>
  <div class="basic-info-card">
    <h2 class="section-title">基本信息</h2>
    <div class="brand-model">
      <h3>{{ carBasic.brand }} {{ carBasic.model }} {{ carBasic.year }}</h3>
    </div>
    <div class="price">
      <span class="price-tag">￥{{ formatPrice(carBasic.price) }}</span>
    </div>
    <div class="info-grid">
      <div class="info-item">
        <span class="label">类别:</span>
        <span class="value">{{ carBasic.category }}</span>
      </div>
      <div class="info-item">
        <span class="label">状态:</span>
        <span class="value">{{ formatStatus(carBasic.status) }}</span>
      </div>
      <div class="info-item">
        <span class="label">创建时间:</span>
        <span class="value">{{ formatDateTime(carBasic.createTime) }}</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { defineProps } from 'vue';

const props = defineProps({
  carBasic: {
    type: Object,
    required: true
  }
});

// 格式化价格显示
const formatPrice = (price) => {
  if (!price && price !== 0) return '暂无价格';
  return price.toLocaleString('zh-CN');
};

// 格式化车辆状态
const formatStatus = (status) => {
  const statusMap = {
    0: '未上架',
    1: '在售中',
    2: '已售出',
    3: '已下架'
  };
  return statusMap[status] || '未知状态';
};

// 格式化日期时间
const formatDateTime = (dateTimeStr) => {
  if (!dateTimeStr) return '暂无数据';
  try {
    const date = new Date(dateTimeStr);
    return date.toLocaleString('zh-CN');
  } catch (err) {
    console.error('日期格式化错误:', err);
    return dateTimeStr;
  }
};
</script>

<style scoped>
.basic-info-card {
  padding: 1.5rem;
  border-radius: 8px;
  box-shadow: 0 1px 8px var(--va-shadow);
  margin-bottom: 2rem;
  background-color: var(--va-card-background);
}

.section-title {
  font-size: 1.4rem;
  margin-bottom: 1.5rem;
  color: var(--va-text-primary);
  border-bottom: 1px solid var(--va-border);
  padding-bottom: 0.5rem;
}

.brand-model h3 {
  font-size: 1.6rem;
  margin: 0 0 1rem 0;
  color: var(--va-text-primary);
}

.price-tag {
  font-size: 1.8rem;
  color: var(--va-error);
  font-weight: bold;
  display: block;
  margin: 1rem 0;
}

.info-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
}

.info-item {
  margin-bottom: 0.5rem;
}

.label {
  color: var(--va-text-secondary);
  font-size: 0.9rem;
  margin-right: 0.5rem;
}

.value {
  color: var(--va-text-primary);
  font-weight: 500;
}

/* 深色模式样式 */
:root[data-theme="dark"] .basic-info-card {
  background-color: #2a2a2a !important;
  box-shadow: 0 1px 8px rgba(0, 0, 0, 0.6) !important;
  border: 1px solid rgba(255, 255, 255, 0.1) !important;
}

:root[data-theme="dark"] .section-title {
  color: #ffffff !important;
  border-bottom-color: rgba(255, 255, 255, 0.1) !important;
}

:root[data-theme="dark"] .brand-model h3 {
  color: #ffffff !important;
}

:root[data-theme="dark"] .price-tag {
  color: #ff6b6b !important;
}

:root[data-theme="dark"] .label {
  color: rgba(255, 255, 255, 0.7) !important;
}

:root[data-theme="dark"] .value {
  color: #e0e0e0 !important;
}

/* 响应式调整 */
@media (max-width: 768px) {
  .info-grid {
    grid-template-columns: 1fr;
  }
}
</style> 