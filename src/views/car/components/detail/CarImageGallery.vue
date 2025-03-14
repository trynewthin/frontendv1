<template>
  <div class="image-showcase">
    <div v-if="imagesLoading" class="image-loading">
      <va-inner-loading :loading="true">
        <div class="image-placeholder"></div>
      </va-inner-loading>
    </div>
    <div v-else-if="processedImages && processedImages.length > 0" class="car-images">
      <div class="main-image">
        <img :src="currentImage.fullUrl" :alt="imageAlt" />
      </div>
      <div class="thumbnails" v-if="processedImages.length > 1">
        <div 
          v-for="(image, index) in processedImages" 
          :key="index" 
          class="thumbnail" 
          :class="{ active: index === currentImageIndex }"
          @click="currentImageIndex = index"
        >
          <img :src="image.fullUrl" alt="缩略图" />
        </div>
      </div>
    </div>
    <div v-else class="no-images">
      <p>暂无车辆图片</p>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, defineProps, defineEmits } from 'vue';
import carService from '@/api/carService';

const emit = defineEmits(['images-loaded']);

const props = defineProps({
  images: {
    type: Array,
    default: () => []
  },
  imagesLoading: {
    type: Boolean,
    default: false
  },
  carBrand: {
    type: String,
    default: ''
  },
  carModel: {
    type: String,
    default: ''
  },
  carId: {
    type: [String, Number],
    default: ''
  }
});

const currentImageIndex = ref(0);
const loading = ref(false);
const rawImages = ref([]);

// 处理图片URL，添加前缀
const processedImages = computed(() => {
  if (!props.images || props.images.length === 0) {
    // 如果外部没有传入图片，尝试使用组件内部加载的图片
    if (rawImages.value && rawImages.value.length > 0) {
      return processImageUrls(rawImages.value);
    }
    return [];
  }
  
  return processImageUrls(props.images);
});

// 获取当前显示图片
const currentImage = computed(() => {
  if (processedImages.value && processedImages.value.length > 0) {
    return processedImages.value[currentImageIndex.value];
  }
  return { fullUrl: '/assets/images/car-placeholder.jpg' };
});

// 图片alt文本
const imageAlt = computed(() => {
  return `${props.carBrand} ${props.carModel}`;
});

// 处理图片URL数组，为每个图片添加完整URL
function processImageUrls(images) {
  return images.map(img => {
    const imgCopy = { ...img };
    
    // 为imageUrl添加前缀
    if (imgCopy.imageUrl) {
      if (imgCopy.imageUrl.startsWith('http')) {
        imgCopy.fullUrl = imgCopy.imageUrl;
      } else {
        // 添加API基础URL前缀
        imgCopy.fullUrl = `${import.meta.env.VITE_API_IMAGE_URL || 'http://localhost:8090'}${imgCopy.imageUrl}`;
      }
    } else if (imgCopy.url) {
      // 如果有url字段而不是imageUrl
      if (imgCopy.url.startsWith('http')) {
        imgCopy.fullUrl = imgCopy.url;
      } else {
        imgCopy.fullUrl = `${import.meta.env.VITE_API_IMAGE_URL || 'http://localhost:8090'}${imgCopy.url}`;
      }
    } else if (imgCopy.fullUrl) {
      // 已经有fullUrl的情况
      if (!imgCopy.fullUrl.startsWith('http')) {
        imgCopy.fullUrl = `${import.meta.env.VITE_API_IMAGE_URL || 'http://localhost:8090'}${imgCopy.fullUrl}`;
      }
    } else {
      // 没有任何URL字段，使用默认图片
      imgCopy.fullUrl = '/assets/images/car-placeholder.jpg';
    }
    
    return imgCopy;
  });
}

// 如果需要，直接从组件内部加载图片
const loadImages = async () => {
  if (props.carId && (!props.images || props.images.length === 0)) {
    loading.value = true;
    try {
      const response = await carService.getCarImages(props.carId);
      if (response.success && response.data) {
        rawImages.value = response.data || [];
        emit('images-loaded', rawImages.value);
      }
    } catch (err) {
      // 错误处理
    } finally {
      loading.value = false;
    }
  }
};
</script>

<style scoped>
.image-showcase {
  width: 100%;
  margin-bottom: 1rem;
  border-radius: 0;
  overflow: hidden;
  box-shadow: 0 1px 8px var(--va-shadow);
}

.image-loading,
.image-placeholder {
  height: 400px;
  background-color: var(--va-background-element);
}

.no-images {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 300px;
  background-color: var(--va-background-element);
  color: var(--va-text-secondary);
}

.car-images {
  display: flex;
  flex-direction: column;
  width: 100%;
}

.main-image {
  width: 100%;
  height: 400px;
  overflow: hidden;
}

.main-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.thumbnails {
  display: flex;
  gap: 10px;
  margin-top: 10px;
  overflow-x: auto;
  padding: 5px 20px;
  width: 100%;
  box-sizing: border-box;
}

.thumbnail {
  width: 80px;
  height: 60px;
  cursor: pointer;
  border: 2px solid transparent;
  border-radius: 4px;
  overflow: hidden;
  transition: border-color 0.3s;
  flex-shrink: 0;
}

.thumbnail.active {
  border-color: var(--va-primary);
}

.thumbnail img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

/* 深色模式样式 */
:root[data-theme="dark"] .image-showcase {
  box-shadow: 0 1px 8px rgba(0, 0, 0, 0.6);
  border: 1px solid rgba(255, 255, 255, 0.1);
}

:root[data-theme="dark"] .image-loading,
:root[data-theme="dark"] .image-placeholder {
  background-color: var(--va-background-element);
}

:root[data-theme="dark"] .no-images {
  background-color: var(--va-background-element);
  color: rgba(255, 255, 255, 0.7);
}

:root[data-theme="dark"] .thumbnail {
  border-color: rgba(255, 255, 255, 0.1);
}

:root[data-theme="dark"] .thumbnail.active {
  border-color: var(--va-primary);
  box-shadow: 0 0 5px var(--va-primary);
}

@media (max-width: 768px) {
  .main-image {
    height: 250px;
  }
  
  .image-showcase {
    margin-bottom: 0.5rem;
    border-radius: 0;
  }
  
  .thumbnails {
    padding: 5px 10px;
  }
}
</style> 