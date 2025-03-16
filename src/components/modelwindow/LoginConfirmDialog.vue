<template>
  <ModalDialog
    :modelValue="modelValue"
    @update:modelValue="$emit('update:modelValue', $event)"
    :title="title"
    :message="message"
    :confirm-text="confirmText"
    :cancel-text="cancelText"
    @confirm="handleConfirm"
    @cancel="handleCancel"
  />
</template>

<script setup>
import { defineProps, defineEmits, defineExpose, ref } from 'vue';
import { useRouter } from 'vue-router';
import ModalDialog from './ModalDialog.vue';

const props = defineProps({
  // 对话框显示状态
  modelValue: {
    type: Boolean,
    default: false
  },
  // 对话框标题
  title: {
    type: String,
    default: '需要登录'
  },
  // 对话框消息
  message: {
    type: String,
    default: '您需要登录后才能执行此操作，是否前往登录页面？'
  },
  // 确认按钮文本
  confirmText: {
    type: String,
    default: '前往登录'
  },
  // 取消按钮文本
  cancelText: {
    type: String,
    default: '取消'
  },
  // 登录后执行的动作
  returnAction: {
    type: String,
    default: ''
  },
  // 登录页面路径
  loginPath: {
    type: String,
    default: '/auth/login'
  }
});

const emit = defineEmits(['update:modelValue', 'confirm', 'cancel']);
const router = useRouter();
const customReturnPath = ref('');
const customReturnAction = ref('');

// 处理确认按钮点击
const handleConfirm = () => {
  // 记录当前页面路径和操作，以便登录后返回
  const path = customReturnPath.value || router.currentRoute.value.fullPath;
  const action = customReturnAction.value || props.returnAction || '';
  
  // 存储到localStorage
  localStorage.setItem('loginReturnPath', path);
  if (action) {
    localStorage.setItem('loginReturnAction', action);
  }
  
  // 触发确认事件
  emit('confirm');
  
  // 关闭对话框
  emit('update:modelValue', false);
  
  // 跳转到登录页面
  router.push(props.loginPath);
};

// 处理取消按钮点击
const handleCancel = () => {
  emit('cancel');
  emit('update:modelValue', false);
};

// 暴露方法供父组件调用
defineExpose({
  // 打开对话框并设置相关信息
  open(action = '', path = '') {
    if (action) {
      customReturnAction.value = action;
    }
    if (path) {
      customReturnPath.value = path;
    }
    emit('update:modelValue', true);
  }
});
</script> 