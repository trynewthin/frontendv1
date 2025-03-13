<template>
  <div class="image-carousel">
    <div class="carousel-container" ref="carouselContainer">
      <!-- 轮播图片区域 -->
      <div 
        class="carousel-slides" 
        :style="{ transform: `translateX(-${currentIndex * 100}%)` }"
      >
        <div 
          v-for="(slide, index) in slides" 
          :key="index" 
          class="carousel-slide"
        >
          <div class="slide-content">
            <img 
              :src="slide.imageUrl" 
              :alt="slide.title" 
              class="slide-image"
              @error="handleImageError($event, index)"
            />
            
            <div class="slide-info" v-if="slide.title || slide.description">
              <h3 class="slide-title" v-if="slide.title">{{ slide.title }}</h3>
              <p class="slide-description" v-if="slide.description">{{ slide.description }}</p>
              <div class="slide-action" v-if="slide.actionText">
                <router-link 
                  v-if="slide.actionLink" 
                  :to="slide.actionLink" 
                  class="action-button"
                >
                  {{ slide.actionText }}
                </router-link>
                <a 
                  v-else-if="slide.actionUrl" 
                  :href="slide.actionUrl" 
                  target="_blank" 
                  class="action-button"
                >
                  {{ slide.actionText }}
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- 导航指示器 -->
      <div class="carousel-indicators" v-if="showIndicators && slides.length > 1">
        <button 
          v-for="(slide, index) in slides" 
          :key="index"
          class="indicator-dot" 
          :class="{ active: index === currentIndex }"
          @click="goToSlide(index)"
          :aria-label="`转到幻灯片 ${index + 1}`"
        ></button>
      </div>
      
      <!-- 导航按钮 -->
      <button 
        v-if="showControls && slides.length > 1" 
        class="carousel-control prev"
        @click="prevSlide"
        aria-label="上一张"
      >
        <span class="control-icon">&#10094;</span>
      </button>
      
      <button 
        v-if="showControls && slides.length > 1" 
        class="carousel-control next"
        @click="nextSlide"
        aria-label="下一张"
      >
        <span class="control-icon">&#10095;</span>
      </button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ImageCarousel',
  props: {
    // 轮播项数据
    slides: {
      type: Array,
      default: () => [],
      validator: (value) => {
        return value.every(slide => 
          typeof slide === 'object' && 
          'imageUrl' in slide
        );
      }
    },
    // 是否自动播放
    autoplay: {
      type: Boolean,
      default: true
    },
    // 自动播放间隔（毫秒）
    interval: {
      type: Number,
      default: 5000
    },
    // 是否显示指示器
    showIndicators: {
      type: Boolean,
      default: true
    },
    // 是否显示控制按钮
    showControls: {
      type: Boolean,
      default: true
    },
    // 轮播高度
    height: {
      type: String,
      default: '400px'
    }
  },
  data() {
    return {
      currentIndex: 0,
      autoplayTimer: null,
      isHovering: false,
      touchStartX: 0,
      touchEndX: 0
    };
  },
  computed: {
    // 计算轮播项总数
    slidesCount() {
      return this.slides.length;
    }
  },
  mounted() {
    // 设置轮播容器高度
    if (this.$refs.carouselContainer) {
      this.$refs.carouselContainer.style.height = this.height;
    }
    
    // 启动自动播放
    this.startAutoplay();
    
    // 添加触摸事件监听
    this.addTouchListeners();
    
    // 添加窗口大小变化监听
    window.addEventListener('resize', this.handleResize);
  },
  beforeUnmount() {
    // 清除自动播放定时器
    this.stopAutoplay();
    
    // 移除触摸事件监听
    this.removeTouchListeners();
    
    // 移除窗口大小变化监听
    window.removeEventListener('resize', this.handleResize);
  },
  methods: {
    // 切换到下一张幻灯片
    nextSlide() {
      this.currentIndex = (this.currentIndex + 1) % this.slidesCount;
    },
    
    // 切换到上一张幻灯片
    prevSlide() {
      this.currentIndex = (this.currentIndex - 1 + this.slidesCount) % this.slidesCount;
    },
    
    // 切换到指定幻灯片
    goToSlide(index) {
      this.currentIndex = index;
    },
    
    // 启动自动播放
    startAutoplay() {
      if (this.autoplay && this.slidesCount > 1 && !this.isHovering) {
        this.stopAutoplay(); // 先清除可能存在的定时器
        this.autoplayTimer = setInterval(() => {
          this.nextSlide();
        }, this.interval);
      }
    },
    
    // 停止自动播放
    stopAutoplay() {
      if (this.autoplayTimer) {
        clearInterval(this.autoplayTimer);
        this.autoplayTimer = null;
      }
    },
    
    // 处理鼠标进入
    handleMouseEnter() {
      this.isHovering = true;
      this.stopAutoplay();
    },
    
    // 处理鼠标离开
    handleMouseLeave() {
      this.isHovering = false;
      this.startAutoplay();
    },
    
    // 添加触摸事件监听
    addTouchListeners() {
      if (this.$refs.carouselContainer) {
        const container = this.$refs.carouselContainer;
        container.addEventListener('touchstart', this.handleTouchStart, { passive: true });
        container.addEventListener('touchend', this.handleTouchEnd, { passive: true });
        
        // 鼠标事件
        container.addEventListener('mouseenter', this.handleMouseEnter);
        container.addEventListener('mouseleave', this.handleMouseLeave);
      }
    },
    
    // 移除触摸事件监听
    removeTouchListeners() {
      if (this.$refs.carouselContainer) {
        const container = this.$refs.carouselContainer;
        container.removeEventListener('touchstart', this.handleTouchStart);
        container.removeEventListener('touchend', this.handleTouchEnd);
        
        // 鼠标事件
        container.removeEventListener('mouseenter', this.handleMouseEnter);
        container.removeEventListener('mouseleave', this.handleMouseLeave);
      }
    },
    
    // 处理触摸开始
    handleTouchStart(event) {
      this.touchStartX = event.touches[0].clientX;
      this.stopAutoplay();
    },
    
    // 处理触摸结束
    handleTouchEnd(event) {
      this.touchEndX = event.changedTouches[0].clientX;
      this.handleSwipe();
      this.startAutoplay();
    },
    
    // 处理滑动
    handleSwipe() {
      const threshold = 50; // 滑动阈值
      const diff = this.touchEndX - this.touchStartX;
      
      if (diff > threshold) {
        // 向右滑动，显示上一张
        this.prevSlide();
      } else if (diff < -threshold) {
        // 向左滑动，显示下一张
        this.nextSlide();
      }
    },
    
    // 处理窗口大小变化
    handleResize() {
      // 重新设置轮播容器高度
      if (this.$refs.carouselContainer) {
        this.$refs.carouselContainer.style.height = this.height;
      }
    },
    
    // 处理图片加载错误
    handleImageError(event, index) {
      console.error(`轮播图片加载失败: ${this.slides[index].imageUrl}`);
      // 设置默认图片
      event.target.src = 'https://via.placeholder.com/800x400?text=图片加载失败';
    }
  },
  watch: {
    // 监听自动播放属性变化
    autoplay(newValue) {
      if (newValue) {
        this.startAutoplay();
      } else {
        this.stopAutoplay();
      }
    },
    
    // 监听间隔时间变化
    interval() {
      if (this.autoplay) {
        this.startAutoplay();
      }
    },
    
    // 监听高度变化
    height(newValue) {
      if (this.$refs.carouselContainer) {
        this.$refs.carouselContainer.style.height = newValue;
      }
    }
  }
};
</script>

<style scoped>
.image-carousel {
  width: 100vw;
  overflow: hidden;
  position: relative;
  border-radius: 0;
  box-shadow: none;
  margin-left: -50vw;
  margin-right: -50vw;
  left: 50%;
  right: 50%;
  position: relative;
}

.carousel-container {
  position: relative;
  width: 100%;
  overflow: hidden;
  border-radius: 0;
}

.carousel-slides {
  display: flex;
  transition: transform 0.5s ease;
  width: 100%;
  height: 100%;
}

.carousel-slide {
  flex: 0 0 100%;
  position: relative;
  width: 100%;
  height: 100%;
}

.slide-content {
  position: relative;
  width: 100%;
  height: 100%;
}

.slide-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
  margin: 0;
  padding: 0;
}

.slide-info {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 20px;
  background: linear-gradient(to top, rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0));
  color: white;
  text-align: left;
}

.slide-title {
  margin: 0 0 8px 0;
  font-size: 1.5rem;
  font-weight: 600;
}

.slide-description {
  margin: 0 0 15px 0;
  font-size: 1rem;
  opacity: 0.9;
}

.slide-action {
  margin-top: 10px;
}

.action-button {
  display: inline-block;
  padding: 8px 16px;
  background-color: var(--va-primary, #4a9cf6);
  color: white;
  border-radius: 4px;
  text-decoration: none;
  font-weight: 500;
  transition: background-color 0.2s;
}

.action-button:hover {
  background-color: var(--va-primary-darken, #3a8ce6);
}

.carousel-indicators {
  position: absolute;
  bottom: 15px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 8px;
  z-index: 10;
}

.indicator-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background-color: rgba(255, 255, 255, 0.5);
  border: none;
  padding: 0;
  cursor: pointer;
  transition: background-color 0.2s;
}

.indicator-dot.active {
  background-color: white;
}

.carousel-control {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  width: 40px;
  height: 40px;
  background-color: rgba(0, 0, 0, 0.3);
  border: none;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: white;
  font-size: 18px;
  transition: background-color 0.2s;
  z-index: 10;
}

.carousel-control:hover {
  background-color: rgba(0, 0, 0, 0.5);
}

.carousel-control.prev {
  left: 15px;
}

.carousel-control.next {
  right: 15px;
}

.control-icon {
  display: block;
  line-height: 1;
}

@media (max-width: 768px) {
  .slide-title {
    font-size: 1.2rem;
  }
  
  .slide-description {
    font-size: 0.9rem;
  }
  
  .carousel-control {
    width: 36px;
    height: 36px;
    font-size: 16px;
  }
  
  .indicator-dot {
    width: 8px;
    height: 8px;
  }
}
</style> 