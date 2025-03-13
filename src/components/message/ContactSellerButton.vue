<template>
  <va-button 
    @click="contactSeller" 
    preset="secondary" 
    icon="chat" 
    :disabled="!isLoggedIn || !dealerId"
    :loading="loading"
  >
    {{ buttonText }}
  </va-button>
</template>

<script setup>
import { computed, ref } from 'vue';
import { useRouter } from 'vue-router';
import { useToast } from 'vuestic-ui';
import authService from '@/api/authService';
import { logService, dealerUserService } from '@/services';

// 定义组件属性
const props = defineProps({
  // 经销商ID
  dealerId: {
    type: [Number, String],
    required: true
  },
  // 车辆ID（可选）
  carId: {
    type: [Number, String],
    default: null
  },
  // 按钮文本
  buttonText: {
    type: String,
    default: '联系卖家'
  }
});

const router = useRouter();
const { init: toast } = useToast();
const loading = ref(false);

// 判断用户是否已登录
const isLoggedIn = computed(() => {
  return authService.isLoggedIn();
});

// 联系卖家
const contactSeller = async () => {
  // 如果用户未登录，提示登录
  if (!isLoggedIn.value) {
    logService.warn('用户未登录，无法联系经销商');
    toast({
      message: '请先登录后再联系卖家',
      color: 'warning'
    });
    return;
  }
  
  // 如果缺少经销商ID，提示错误
  if (!props.dealerId) {
    logService.warn('缺少经销商ID，无法联系');
    toast({
      message: '无法获取卖家信息',
      color: 'warning'
    });
    return;
  }
  
  loading.value = true;
  
  try {
    logService.info('准备获取经销商用户ID', { dealerId: props.dealerId });
    
    // 调用服务将经销商ID转换为用户ID
    const result = await dealerUserService.getDealerUserId(props.dealerId);
    
    if (!result.success || !result.userId) {
      logService.warn('获取经销商用户ID失败', result);
      toast({
        message: result.message || '无法获取经销商用户信息',
        color: 'warning'
      });
      loading.value = false;
      return;
    }
    
    logService.info('成功获取经销商用户ID', { userId: result.userId, carId: props.carId });
    
    // 跳转到聊天页面，使用用户ID而不是经销商ID
    router.push({
      name: 'chat',
      params: { contactId: result.userId },
      query: props.carId ? { carId: props.carId } : {}
    });
  } catch (error) {
    logService.error('获取经销商用户ID出错', error);
    toast({
      message: '联系经销商失败，请稍后再试',
      color: 'danger'
    });
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>
/* 组件样式可以根据需要添加 */
</style> 