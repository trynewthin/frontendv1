<template>
  <div v-if="carDetail" class="detail-info-card">
    <h2 class="section-title">详细参数</h2>
    <div class="detail-grid">
      <div class="detail-item" v-if="carDetail.engine">
        <span class="label">发动机:</span>
        <span class="value">{{ carDetail.engine }}</span>
      </div>
      <div class="detail-item" v-if="carDetail.transmission">
        <span class="label">变速箱:</span>
        <span class="value">{{ carDetail.transmission }}</span>
      </div>
      <div class="detail-item" v-if="carDetail.fuelType">
        <span class="label">燃油类型:</span>
        <span class="value">{{ carDetail.fuelType }}</span>
      </div>
      <div class="detail-item" v-if="carDetail.fuelConsumption">
        <span class="label">油耗(L/100km):</span>
        <span class="value">{{ carDetail.fuelConsumption }}</span>
      </div>
      <div class="detail-item" v-if="carDetail.seats">
        <span class="label">座位数:</span>
        <span class="value">{{ carDetail.seats }}</span>
      </div>
      <div class="detail-item" v-if="carDetail.color">
        <span class="label">颜色:</span>
        <span class="value">{{ carDetail.color }}</span>
      </div>
      <div class="detail-item" v-if="carDetail.bodySize">
        <span class="label">车身尺寸:</span>
        <span class="value">{{ carDetail.bodySize }}</span>
      </div>
      <div class="detail-item" v-if="carDetail.wheelbase">
        <span class="label">轴距(mm):</span>
        <span class="value">{{ carDetail.wheelbase }}</span>
      </div>
    </div>
    
    <div class="features-section" v-if="carDetail.features">
      <h3 class="features-title">配置特性</h3>
      <p class="features-text">{{ carDetail.features }}</p>
    </div>
    
    <div class="warranty-section" v-if="carDetail.warranty">
      <h3 class="warranty-title">质保信息</h3>
      <p class="warranty-text">{{ carDetail.warranty }}</p>
    </div>
  </div>
  <div v-else class="no-detail-info">
    <p>暂无车辆详情信息</p>
  </div>
</template>

<script setup>
import { defineProps, defineEmits, computed } from 'vue';

const emit = defineEmits(['info-ready']);

const props = defineProps({
  carDetail: {
    type: Object,
    default: null
  },
  loading: {
    type: Boolean,
    default: false
  }
});

// 计算是否有详细信息
const hasDetails = computed(() => {
  return props.carDetail && Object.keys(props.carDetail).some(key => {
    return props.carDetail[key] !== null && props.carDetail[key] !== undefined;
  });
});

// 获取引擎和变速箱组合信息
const getEngineDrivetrainInfo = computed(() => {
  if (!props.carDetail) return '暂无信息';
  
  const parts = [];
  if (props.carDetail.engine) parts.push(props.carDetail.engine);
  if (props.carDetail.transmission) parts.push(props.carDetail.transmission);
  
  return parts.length ? parts.join(' + ') : '暂无信息';
});

// 获取燃油消耗信息
const getFuelInfo = computed(() => {
  if (!props.carDetail) return '暂无信息';
  
  const parts = [];
  if (props.carDetail.fuelType) parts.push(props.carDetail.fuelType);
  if (props.carDetail.fuelConsumption) parts.push(`${props.carDetail.fuelConsumption}L/100km`);
  
  return parts.length ? parts.join(' · ') : '暂无信息';
});

// 获取最重要的几点参数
const getHighlights = computed(() => {
  if (!props.carDetail) return [];
  
  const highlights = [];
  
  if (props.carDetail.engine) highlights.push({
    title: '发动机',
    value: props.carDetail.engine
  });
  
  if (props.carDetail.transmission) highlights.push({
    title: '变速箱',
    value: props.carDetail.transmission
  });
  
  if (props.carDetail.fuelConsumption) highlights.push({
    title: '油耗',
    value: `${props.carDetail.fuelConsumption}L/100km`
  });
  
  if (props.carDetail.seats) highlights.push({
    title: '座位数',
    value: `${props.carDetail.seats}座`
  });
  
  return highlights;
});
</script>

<style scoped>
.detail-info-card {
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

.detail-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1rem;
}

.detail-item {
  display: flex;
  align-items: center;
  margin-bottom: 0.5rem;
}

.label {
  color: var(--va-text-secondary);
  font-size: 0.9rem;
  margin-right: 0.5rem;
  flex-shrink: 0;
}

.value {
  color: var(--va-text-primary);
  font-weight: 500;
  flex-grow: 1;
}

.features-section,
.warranty-section {
  margin-top: 1.5rem;
  padding-top: 1.5rem;
  border-top: 1px solid var(--va-border);
}

.features-title,
.warranty-title {
  font-size: 1.1rem;
  margin-bottom: 0.5rem;
  color: var(--va-text-primary);
}

.features-text,
.warranty-text {
  color: var(--va-text-primary);
  line-height: 1.6;
  white-space: pre-wrap; /* 保留文本格式 */
}

.no-detail-info {
  padding: 2rem;
  text-align: center;
  color: var(--va-text-secondary);
  background-color: var(--va-background-element);
  border-radius: 8px;
  margin-bottom: 2rem;
}

/* 深色模式样式 */
:root[data-theme="dark"] .detail-info-card {
  background-color: #2a2a2a !important;
  box-shadow: 0 1px 8px rgba(0, 0, 0, 0.6) !important;
  border: 1px solid rgba(255, 255, 255, 0.1) !important;
}

:root[data-theme="dark"] .section-title {
  color: #ffffff !important;
  border-bottom-color: rgba(255, 255, 255, 0.1) !important;
}

:root[data-theme="dark"] .label {
  color: rgba(255, 255, 255, 0.7) !important;
}

:root[data-theme="dark"] .value {
  color: #e0e0e0 !important;
}

:root[data-theme="dark"] .features-section,
:root[data-theme="dark"] .warranty-section {
  border-top-color: rgba(255, 255, 255, 0.1) !important;
}

:root[data-theme="dark"] .features-title,
:root[data-theme="dark"] .warranty-title {
  color: #ffffff !important;
}

:root[data-theme="dark"] .features-text,
:root[data-theme="dark"] .warranty-text {
  color: #e0e0e0 !important;
}

:root[data-theme="dark"] .no-detail-info {
  background-color: #1e1e1e !important;
  color: rgba(255, 255, 255, 0.7) !important;
}

/* 响应式调整 */
@media (max-width: 768px) {
  .detail-grid {
    grid-template-columns: 1fr;
  }
}
</style> 