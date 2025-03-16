<template>
  <button
    @click="handleFavoriteClick"
    class="favorite-button"
    :class="[
      variant === 'primary' ? 'primary' : '',
      size === 'small' ? 'small' : '',
      isFavorited ? 'favorited' : ''
    ]"
    type="button"
    :disabled="isLoading"
  >
    <span class="button-icon heart-icon"></span>
    <span class="button-text">{{ buttonText }}</span>
  </button>
  
  <!-- 登录确认对话框 -->
  <ModalDialog
    v-if="showLoginDialog"
    v-model="showLoginDialog"
    title="需要登录"
    message="您需要登录后才能收藏车辆，是否前往登录页面？"
    confirm-text="前往登录"
    cancel-text="取消"
    @confirm="goToLogin"
  />
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRouter } from 'vue-router';
import { toastService } from '@/services';
import { userAuthService } from '@/services/user';
import favoriteService from '@/services/favorite';
import ModalDialog from '@/components/modelwindow/ModalDialog.vue';

const props = defineProps({
  carId: {
    type: [String, Number],
    required: true
  },
  // 未收藏时的文本
  favoriteText: {
    type: String,
    default: '收藏'
  },
  // 已收藏时的文本
  unfavoriteText: {
    type: String,
    default: '取消收藏'
  },
  variant: {
    type: String,
    default: 'secondary' // 'primary' 或 'secondary'
  },
  size: {
    type: String,
    default: 'normal' // 'normal' 或 'small'
  },
  autoCheck: {
    type: Boolean,
    default: true // 自动检查是否已收藏
  },
  // 是否在CarCard中显示简化文本（固定只显示"收藏"）
  inCard: {
    type: Boolean,
    default: false
  }
});

const emit = defineEmits(['favorite-changed']);
const router = useRouter();
const isLoading = ref(false);
const isFavorited = ref(false);
const showLoginDialog = ref(false);

// 计算按钮显示文本
const buttonText = computed(() => {
  // 如果在卡片中，简化显示
  if (props.inCard) {
    return props.favoriteText;
  }
  
  // 根据收藏状态显示不同文本
  return isFavorited.value ? props.unfavoriteText : props.favoriteText;
});

// 组件挂载后检查是否已收藏
onMounted(async () => {
  if (props.autoCheck && props.carId && userAuthService.isLoggedIn()) {
    await checkFavoriteStatus();
  }
});

// 检查收藏状态
const checkFavoriteStatus = async () => {
  if (!props.carId) return;
  
  try {
    isLoading.value = true;
    // 使用查询方法检查收藏状态，而不是尝试添加
    isFavorited.value = await favoriteService.isCarFavorited(props.carId);
  } catch (error) {
    console.error('检查收藏状态失败:', error);
  } finally {
    isLoading.value = false;
  }
};

// 确保提示信息可用，不依赖于外部toast服务
const showMessage = (type, message) => {
  if (toastService && typeof toastService[type] === 'function') {
    try {
      toastService[type](message);
    } catch (error) {
      console.log(message); // 如果toast服务失败，至少在控制台输出信息
    }
  } else {
    console.log(`${type}: ${message}`);
  }
};

// 处理收藏点击
const handleFavoriteClick = async () => {
  // 检查是否已登录
  if (!userAuthService.isLoggedIn()) {
    showLoginDialog.value = true;
    return;
  }
  
  if (!props.carId) {
    showMessage('error', '无效的车辆信息');
    // 即使出错也触发事件以刷新卡片
    triggerFavoriteChangedEvents(isFavorited.value);
    return;
  }
  
  try {
    isLoading.value = true;
    
    // 根据当前状态执行不同操作
    if (isFavorited.value) {
      // 已收藏状态，执行取消收藏
      const result = await favoriteService.removeFromFavorite(props.carId);
      
      if (result.code === 200) {
        isFavorited.value = false;
        showMessage('success', '已取消收藏');
      } else if (result.code === 404) {
        isFavorited.value = false;
        showMessage('info', '未收藏该车辆');
      } else {
        showMessage('error', result.message || '取消收藏失败');
        // 操作失败时，重新检查收藏状态
        await checkFavoriteStatus();
      }
      
      // 无论结果如何都触发事件
      triggerFavoriteChangedEvents(false);
    } else {
      // 未收藏状态，执行添加收藏
      const result = await favoriteService.addToFavorite(props.carId);
      
      if (result.code === 200) {
        isFavorited.value = true;
        showMessage('success', '收藏成功');
      } else if (result.code === 409) {
        isFavorited.value = true;
        showMessage('info', '已收藏该车辆');
      } else {
        showMessage('error', result.message || '收藏失败');
        // 操作失败时，重新检查收藏状态
        await checkFavoriteStatus();
      }
      
      // 无论结果如何都触发事件
      triggerFavoriteChangedEvents(true);
    }
  } catch (error) {
    console.error('收藏操作失败:', error);
    showMessage('error', '操作失败，请稍后重试');
    
    // 即使出现异常也触发事件以刷新卡片
    triggerFavoriteChangedEvents(isFavorited.value);
    
    // 异常情况下，重新检查收藏状态
    await checkFavoriteStatus();
  } finally {
    isLoading.value = false;
  }
};

// 触发组件和全局收藏变化事件
const triggerFavoriteChangedEvents = (isFavorited) => {
  console.log('触发收藏变化事件:', props.carId, isFavorited);
  
  // 触发组件事件
  emit('favorite-changed', isFavorited);
  
  // 触发全局事件，添加forceRefresh=true属性告知所有组件强制刷新
  const eventDetail = { 
    carId: props.carId, 
    isFavorited: isFavorited,
    forceRefresh: true, // 添加强制刷新标志
    timestamp: Date.now() // 添加时间戳确保事件唯一性
  };
  
  console.log('发送全局收藏变化事件:', eventDetail);
  window.dispatchEvent(new CustomEvent('favorite-changed', {
    detail: eventDetail
  }));
};

// 前往登录页面
const goToLogin = () => {
  router.push({
    path: '/login',
    query: { redirect: router.currentRoute.value.fullPath }
  });
};
</script>

<style scoped>
.favorite-button {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  background-color: var(--btn-secondary-bg, #f5f5f5);
  color: var(--btn-secondary-text, #333);
  border: 1px solid var(--border-color, #ddd);
  border-radius: 4px;
  padding: 10px 16px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  outline: none;
  box-shadow: none;
}

.favorite-button:hover {
  background-color: var(--btn-secondary-hover-bg, #e8e8e8);
}

.favorite-button.primary {
  background-color: var(--btn-primary-bg, #000);
  color: var(--btn-primary-text, #fff);
  border: 1px solid var(--btn-primary-bg, #000);
}

.favorite-button.primary:hover {
  background-color: var(--btn-primary-hover-bg, #333);
  border-color: var(--btn-primary-hover-bg, #333);
}

.favorite-button.small {
  padding: 6px 12px;
  font-size: 12px;
}

.button-icon {
  width: 18px;
  height: 18px;
  display: inline-block;
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
}

.heart-icon {
  background-image: url('/icons/heart-outline.svg');
  transition: all 0.2s ease;
}

.favorited .heart-icon {
  background-image: url('/icons/heart-filled.svg');
  /* 添加轻微的红色阴影，表示已收藏状态 */
  filter: drop-shadow(0 0 1px rgba(255, 0, 0, 0.3));
}

/* 深色模式下的图标反色处理 */
:root[data-theme="dark"] .heart-icon {
  filter: brightness(0) invert(1); /* 深色模式下图标反色为白色 */
}

:root[data-theme="dark"] .favorited .heart-icon {
  /* 深色模式下已收藏图标使用金色阴影效果 */
  filter: brightness(0) invert(0.9) sepia(1) saturate(5) hue-rotate(350deg) drop-shadow(0 0 1px gold);
}

.button-text {
  white-space: nowrap;
}

/* 深色模式适配 */
:root[data-theme="dark"] .favorite-button {
  background-color: var(--btn-secondary-bg, #333);
  color: var(--btn-secondary-text, #fff);
  border-color: var(--border-color, #444);
}

:root[data-theme="dark"] .favorite-button:hover {
  background-color: var(--btn-secondary-hover-bg, #444);
}

:root[data-theme="dark"] .favorite-button.primary {
  background-color: var(--btn-primary-bg, #fff);
  color: var(--btn-primary-text, #000);
  border-color: var(--btn-primary-bg, #fff);
}

:root[data-theme="dark"] .favorite-button.primary:hover {
  background-color: var(--btn-primary-hover-bg, #ddd);
  border-color: var(--btn-primary-hover-bg, #ddd);
}

/* 禁用状态 */
.favorite-button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}
</style> 