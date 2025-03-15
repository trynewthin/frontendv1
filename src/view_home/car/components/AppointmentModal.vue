<template>
  <div>
    <!-- 预约对话框 -->
    <ModalDialog
      v-model="showModal"
      title="预约看车/试驾"
      :close-on-click-overlay="true"
      :show-close-button="true"
      :loading="appointmentLoading"
      @confirm="createAppointment"
      @cancel="handleCancel"
      confirm-text="提交预约"
      cancel-text="取消"
    >
      <div class="appointment-dialog-content">
        <div v-if="dealerLoading" class="appointment-loading">
          <div class="loading-spinner"></div>
          <p>加载经销商信息...</p>
        </div>
        <div v-else>
          <div class="dealer-info" v-if="dealerInfo">
            <h3 class="dealer-name">{{ dealerInfo.dealerName }}</h3>
            <p class="dealer-address" v-if="dealerInfo.address">
              <span class="icon">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16">
                  <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" fill="currentColor"/>
                </svg>
              </span>
              {{ dealerInfo.address }}
            </p>
            <p class="dealer-contact" v-if="dealerInfo.contactPhone">
              <span class="icon">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16">
                  <path d="M20.01 15.38c-1.23 0-2.42-.2-3.53-.56-.35-.12-.74-.03-1.01.24l-1.57 1.97c-2.83-1.35-5.48-3.9-6.89-6.83l1.95-1.66c.27-.28.35-.67.24-1.02-.37-1.11-.56-2.3-.56-3.53 0-.54-.45-.99-.99-.99H4.19C3.65 3 3 3.24 3 3.99 3 13.28 10.73 21 20.01 21c.71 0 .99-.63.99-1.18v-3.45c0-.54-.45-.99-.99-.99z" fill="currentColor"/>
                </svg>
              </span>
              {{ dealerInfo.contactPhone }}
            </p>
          </div>
          
          <div class="car-info-summary">
            <h4>预约车辆：{{ carBasic.brand }} {{ carBasic.model }}</h4>
            <div class="car-details">
              <span class="car-year">{{ carBasic.year }}年</span>
              <span class="car-price" v-if="carBasic.price">{{ formatPrice(carBasic.price) }}元</span>
            </div>
          </div>
          
          <div class="appointment-form">
            <div class="form-group">
              <label>预约类型 <span class="required">*</span></label>
              <div class="appointment-type-selection">
                <label class="button-option" :class="{ 'selected': appointmentForm.appointmentType === '试驾' }">
                  <input type="radio" v-model="appointmentForm.appointmentType" value="试驾">
                  <span class="button-icon">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20">
                      <path d="M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.21.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99zM6.5 16c-.83 0-1.5-.67-1.5-1.5S5.67 13 6.5 13s1.5.67 1.5 1.5S7.33 16 6.5 16zm11 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zM5 11l1.5-4.5h11L19 11H5z" fill="currentColor"/>
                    </svg>
                  </span>
                  <span class="button-text">试驾</span>
                </label>
                <label class="button-option" :class="{ 'selected': appointmentForm.appointmentType === '看车' }">
                  <input type="radio" v-model="appointmentForm.appointmentType" value="看车">
                  <span class="button-icon">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20">
                      <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z" fill="currentColor"/>
                    </svg>
                  </span>
                  <span class="button-text">看车</span>
                </label>
              </div>
            </div>
            
            <div class="form-group">
              <label for="appointmentTime">预约时间 <span class="required">*</span></label>
              <div class="appointment-time-selector">
                <!-- 日期选择器 -->
                <div class="date-selector">
                  <h5 class="selector-title">选择日期</h5>
                  <div class="date-options">
                    <div 
                      v-for="date in availableDates" 
                      :key="date.dateStr"
                      class="date-option" 
                      :class="{ 'selected': selectedDate === date.dateStr }"
                      @click="selectedDate = date.dateStr"
                    >
                      <div class="date-label">{{ date.label }}</div>
                      <div class="date-value">{{ date.display }}</div>
                    </div>
                  </div>
                </div>
                
                <!-- 时间选择器 -->
                <div class="time-selector">
                  <h5 class="selector-title">选择时间</h5>
                  
                  <!-- 上午时间段 -->
                  <div class="time-period">
                    <h6 class="period-title">上午</h6>
                    <div class="time-options">
                      <div 
                        v-for="time in availableTimes.morning" 
                        :key="time.value"
                        class="time-option" 
                        :class="{ 'selected': selectedTime === time.value }"
                        @click="selectedTime = time.value"
                      >
                        {{ time.display }}
                      </div>
                    </div>
                  </div>
                  
                  <!-- 下午时间段 -->
                  <div class="time-period">
                    <h6 class="period-title">下午</h6>
                    <div class="time-options">
                      <div 
                        v-for="time in availableTimes.afternoon" 
                        :key="time.value"
                        class="time-option" 
                        :class="{ 'selected': selectedTime === time.value }"
                        @click="selectedTime = time.value"
                      >
                        {{ time.display }}
                      </div>
                    </div>
                  </div>
                </div>
                
                <!-- 隐藏的输入框，用于表单提交 -->
                <input 
                  id="appointmentTime" 
                  v-model="appointmentForm.appointmentTime" 
                  type="hidden"
                  required
                />
              </div>
            </div>
            
            <div class="form-group">
              <label for="remarks">备注信息</label>
              <div class="textarea-wrapper">
                <textarea
                  id="remarks"
                  v-model="appointmentForm.remarks"
                  placeholder="请填写您的其他要求或问题"
                  rows="3"
                  class="form-textarea"
                ></textarea>
                <div class="textarea-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="18" height="18">
                    <path d="M20 2H4c-1.1 0-1.99.9-1.99 2L2 22l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-2 12H6v-2h12v2zm0-3H6V9h12v2zm0-3H6V6h12v2z" fill="currentColor"/>
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ModalDialog>
    
    <!-- 预约成功对话框 -->
    <ModalDialog
      v-model="isSuccessDialogVisible"
      title="预约成功"
      confirm-text="查看我的预约"
      cancel-text="继续浏览"
      @confirm="goToAppointmentManagement"
      @cancel="handleSuccessCancel"
    >
      <div class="success-dialog-content">
        <div class="success-icon">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="48" height="48">
            <circle cx="12" cy="12" r="10" fill="#4CAF50" />
            <path d="M9 16.2l-3.5-3.5c-.39-.39-.39-1.01 0-1.4.39-.39 1.01-.39 1.4 0L9 13.4l7.29-7.29c.39-.39 1.02-.39 1.41 0 .39.39.39 1.02 0 1.41L9 16.2z" fill="white" />
          </svg>
        </div>
        <h3 class="success-title">预约{{ successAppointmentType }}申请已提交</h3>
        <p class="success-message">您的预约{{ successAppointmentType }}申请已成功提交，请等待经销商确认。经销商确认后会通过站内消息通知您。</p>
      </div>
    </ModalDialog>
  </div>
</template>

<script setup>
import { ref, defineProps, defineEmits, defineExpose, computed, watch } from 'vue';
import { useRouter } from 'vue-router';
import { toastService, appointmentAxiosService } from '@/services';
import dealerService from '@/api/dealerService';
// import appointmentService from '@/api/appointmentService'; // 不再使用旧的服务
import ModalDialog from '@/components/modelwindow/ModalDialog.vue';

// 格式化日期为输入框格式 (YYYY-MM-DDThh:mm)
const formatDateForInput = (date) => {
  if (!date) return '';
  
  try {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    
    return `${year}-${month}-${day}T${hours}:${minutes}`;
  } catch (err) {
    return '';
  }
};

// 获取未来15天的日期数组（含当天）
const getAvailableDates = () => {
  const dates = [];
  const now = new Date();
  
  for (let i = 0; i <= 15; i++) {
    const date = new Date(now);
    date.setDate(now.getDate() + i);
    
    // 提取日期信息
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const dayOfWeek = date.toLocaleDateString('zh-CN', { weekday: 'short' });
    const isToday = i === 0;
    
    // 日期对象
    const dateObj = {
      dateStr: `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`,
      display: `${month}月${day}日`, // 确保月和日显示在一起
      dayOfWeek: dayOfWeek,
      isToday: isToday,
      label: isToday ? '今天' : dayOfWeek
    };
    
    dates.push(dateObj);
  }
  
  return dates;
};

// 获取可用时间段
const getAvailableTimes = () => {
  const morningTimes = [];
  const afternoonTimes = [];
  
  // 上午9-11点
  for (let hour = 9; hour <= 11; hour++) {
    morningTimes.push({
      value: `${String(hour).padStart(2, '0')}:00`,
      display: `${hour}:00`
    });
  }
  
  // 下午13-17点
  for (let hour = 13; hour <= 17; hour++) {
    afternoonTimes.push({
      value: `${String(hour).padStart(2, '0')}:00`,
      display: `${hour}:00`
    });
  }
  
  return {
    morning: morningTimes,
    afternoon: afternoonTimes
  };
};

// 添加小时
const addHours = (date, hours) => {
  const result = new Date(date);
  result.setHours(result.getHours() + hours);
  return result;
};

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false
  },
  carBasic: {
    type: Object,
    required: true
  },
  carId: {
    type: [String, Number],
    required: true
  }
});

const emit = defineEmits(['update:modelValue', 'appointment-success']);
const router = useRouter();

// 初始化toast服务
toastService.init();

// 预约对话框状态
const showModal = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
});

// 预约相关的状态
const appointmentLoading = ref(false);
const appointmentForm = ref({
  appointmentTime: formatDateForInput(new Date(Date.now() + 24 * 60 * 60 * 1000)), // 默认为明天
  appointmentType: '试驾', // 默认为试驾
  remarks: ''
});
const dealerInfo = ref(null);
const dealerLoading = ref(false);

// 成功对话框
const isSuccessDialogVisible = ref(false);
const successAppointmentType = ref('试驾');

// 日期和时间选择状态
const selectedDate = ref('');
const selectedTime = ref('');
const availableDates = ref(getAvailableDates());
const availableTimes = ref(getAvailableTimes());

// 监听日期和时间选择变化，并更新appointmentTime
watch([selectedDate, selectedTime], ([date, time]) => {
  if (date && time) {
    appointmentForm.value.appointmentTime = `${date}T${time}`;
  }
}, { immediate: false });

// 格式化价格显示
const formatPrice = (price) => {
  if (!price && price !== 0) return '暂无价格';
  return price.toLocaleString('zh-CN');
};

// 显示预约对话框
const showAppointmentDialog = async () => {
  // 如果车辆不是"在售中"状态，提示无法预约
  if (props.carBasic?.status !== 1) {
    toastService.error(`该车辆当前${formatStatus(props.carBasic?.status)}，无法预约`);
    return;
  }
  
  // 获取经销商信息
  dealerLoading.value = true;
  
  try {
    if (props.carBasic?.dealerId) {
      const response = await dealerService.getDealerDetail(props.carBasic.dealerId);
      if (response.success && response.data) {
        dealerInfo.value = response.data;
      } else {
        toastService.error('获取经销商信息失败');
      }
    } else {
      toastService.error('该车辆未关联经销商信息');
      return;
    }
  } catch (err) {
    toastService.error('获取经销商信息时发生错误');
    return;
  } finally {
    dealerLoading.value = false;
  }
  
  // 重置预约表单和选择器状态
  appointmentForm.value = {
    appointmentTime: '', // 将由日期和时间选择器组成
    appointmentType: '试驾', // 默认为试驾
    remarks: ''
  };
  
  // 更新可选日期和时间
  availableDates.value = getAvailableDates();
  
  // 默认选择明天和第一个可用时间
  const tomorrow = availableDates.value[1]?.dateStr || availableDates.value[0]?.dateStr;
  selectedDate.value = tomorrow;
  selectedTime.value = availableTimes.value.morning[0]?.value || '';
  
  // 触发监听器更新appointmentTime
  if (selectedDate.value && selectedTime.value) {
    appointmentForm.value.appointmentTime = `${selectedDate.value}T${selectedTime.value}`;
  }
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

// 创建预约
const createAppointment = async () => {
  try {
    if (!appointmentForm.value.appointmentTime) {
      toastService.error('请选择预约时间');
      return;
    }

    appointmentLoading.value = true;
    appointmentForm.value.errorMessage = '';

    // 格式化时间为后端期望的格式 yyyy-MM-dd HH:mm:ss
    const formattedTime = appointmentForm.value.appointmentTime.replace('T', ' ') + ':00';

    // 使用新的appointmentAxiosService服务
    const result = await appointmentAxiosService.createAppointment({
      carId: props.carId,
      dealerId: props.carBasic.dealerId,
      appointmentType: appointmentForm.value.appointmentType,
      appointmentTime: formattedTime, // 使用格式化后的时间
      remarks: appointmentForm.value.remarks
    });

    console.log('创建预约结果:', result);

    // 根据API返回结果处理
    if (result.success) {
      // 预约创建成功
      showModal.value = false;
      emit('appointment-success');
      showSuccessDialog();
      
      setTimeout(() => {
        toastService.success(`预约${appointmentForm.value.appointmentType}申请已提交，请等待经销商确认`);
      }, 800);
    } else {
      // 所有失败情况一律作为时间冲突处理
      toastService.warning('该时间段已被预约，请选择其他时间');
    }
  } catch (error) {
    console.error('创建预约异常:', error);
    toastService.error('系统异常，请稍后重试');
  } finally {
    appointmentLoading.value = false;
  }
};

// 显示预约成功对话框
const showSuccessDialog = () => {
  successAppointmentType.value = appointmentForm.value.appointmentType || '试驾';
  isSuccessDialogVisible.value = true;
};

// 处理取消
const handleCancel = () => {
  showModal.value = false;
};

// 处理成功对话框取消
const handleSuccessCancel = () => {
  isSuccessDialogVisible.value = false;
};

// 前往预约管理页面
const goToAppointmentManagement = () => {
  isSuccessDialogVisible.value = false;
  router.push('/appointments');
};

// 监听弹窗变化，初始化数据
const watchModal = computed(() => props.modelValue);
watch(watchModal, async (newVal) => {
  if (newVal) {
    await showAppointmentDialog();
  }
});

// 对外暴露方法
defineExpose({
  showAppointmentDialog
});
</script>

<style scoped>
/* 预约对话框基础样式 */
.appointment-dialog-content {
  padding: 1rem;
  max-width: 100%;
  color: var(--va-text-primary, #333);
}

/* 加载状态样式 */
.appointment-loading {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 2rem;
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 3px solid rgba(0, 0, 0, 0.1);
  border-radius: 50%;
  border-top-color: var(--va-primary, #333);
  animation: spin 1s ease-in-out infinite;
  margin-bottom: 1rem;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

/* 经销商信息样式 */
.dealer-info {
  margin-bottom: 1.5rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid var(--va-border, #eee);
}

.dealer-name {
  font-size: 1.25rem;
  margin-bottom: 0.5rem;
  color: var(--va-text-primary, #333);
}

.dealer-address,
.dealer-contact {
  display: flex;
  align-items: center;
  margin-bottom: 0.3rem;
  color: var(--va-text-secondary, #666);
  font-size: 0.95rem;
}

.icon {
  display: flex;
  align-items: center;
  margin-right: 0.5rem;
  color: var(--va-text-secondary, #666);
}

/* 车辆信息摘要 */
.car-info-summary {
  margin-bottom: 1.5rem;
  padding: 1rem;
  background-color: rgba(0, 0, 0, 0.03);
  border-radius: 8px;
}

.car-info-summary h4 {
  margin-bottom: 0.5rem;
  font-size: 1.1rem;
  font-weight: 500;
}

.car-details {
  display: flex;
  gap: 1rem;
  color: var(--va-text-secondary, #666);
  font-size: 0.95rem;
}

/* 表单样式 */
.appointment-form {
  margin-top: 1.5rem;
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.6rem;
  color: var(--va-text-primary, #333);
  font-weight: 500;
  font-size: 0.95rem;
}

.required {
  color: var(--va-error, #ff4d4f);
  margin-left: 0.2rem;
}

/* 预约类型选择 */
.appointment-type-selection {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  margin-bottom: 1rem;
  width: 100%;
}

.button-option {
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  padding: 0.8rem 1rem;
  background-color: #f5f5f5;
  border-radius: 6px;
  transition: all 0.25s ease;
  border: 1px solid #ddd;
  position: relative;
  flex: 1;
  min-width: calc(50% - 0.5rem);
  text-align: center;
  box-shadow: 0 1px 2px rgba(0,0,0,0.05);
}

.button-option:hover {
  background-color: #e8e8e8;
  border-color: #ccc;
  transform: translateY(-1px);
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.button-option.selected {
  background-color: var(--va-primary, #333);
  color: white;
  border-color: var(--va-primary, #333);
  box-shadow: 0 2px 4px rgba(0,0,0,0.2);
}

.button-option input[type="radio"] {
  position: absolute;
  opacity: 0;
  width: 0;
  height: 0;
}

.button-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 0.5rem;
  color: #666;
  transition: color 0.25s ease;
}

.button-option.selected .button-icon {
  color: white;
}

.button-icon svg,
.button-icon svg path {
  fill: currentColor;
}

.button-text {
  font-size: 1rem;
  font-weight: 500;
  color: #333;
  transition: color 0.25s ease;
}

.button-option.selected .button-text {
  color: white;
  font-weight: 600;
}

/* 日期时间选择器样式 */
.appointment-time-selector {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  margin-top: 0.5rem;
}

.selector-title {
  font-size: 1rem;
  font-weight: 500;
  margin-bottom: 0.8rem;
  color: var(--va-text-primary, #333);
}

/* 日期选择器 */
.date-options {
  display: flex;
  gap: 0.5rem;
  overflow-x: auto;
  padding-bottom: 0.5rem;
  -webkit-overflow-scrolling: touch;
}

.date-option {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-width: 80px;
  height: 70px;
  padding: 0.5rem;
  border-radius: 6px;
  background-color: #f5f5f5;
  border: 1px solid #ddd;
  cursor: pointer;
  transition: all 0.2s ease;
}

.date-option:hover {
  background-color: #e8e8e8;
  transform: translateY(-2px);
}

.date-option.selected {
  background-color: var(--va-primary, #333);
  color: white;
  border-color: var(--va-primary, #333);
  transform: translateY(-2px);
  box-shadow: 0 2px 6px rgba(0,0,0,0.15);
}

.date-label {
  font-size: 0.85rem;
  margin-bottom: 0.3rem;
}

.date-value {
  font-size: 0.9rem;
  font-weight: 500;
  white-space: nowrap; /* 防止文本换行 */
}

/* 时间选择器 */
.time-period {
  margin-bottom: 1.2rem;
}

.period-title {
  font-size: 0.9rem;
  color: var(--va-text-secondary, #666);
  margin-bottom: 0.5rem;
  font-weight: 500;
}

.time-options {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.time-option {
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 70px;
  height: 40px;
  padding: 0 0.8rem;
  border-radius: 6px;
  background-color: #f5f5f5;
  border: 1px solid #ddd;
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 0.9rem;
}

.time-option:hover {
  background-color: #e8e8e8;
}

.time-option.selected {
  background-color: var(--va-primary, #333);
  color: white;
  border-color: var(--va-primary, #333);
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

/* 表单输入控件 */
.form-input,
.form-textarea {
  width: 100%;
  padding: 0.8rem 1rem;
  border: 1px solid var(--va-border, #ddd);
  border-radius: 6px;
  font-size: 1rem;
  background-color: var(--va-background, #fff);
  color: var(--va-text-primary, #333);
  transition: all 0.2s ease;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
}

.input-wrapper,
.textarea-wrapper {
  position: relative;
}

.form-input:focus,
.form-textarea:focus {
  outline: none;
  border-color: var(--va-primary, #333);
  box-shadow: 0 0 0 3px rgba(51, 51, 51, 0.1);
}

.form-textarea {
  width: 100%;
  padding: 0.8rem 1rem;
  border: 2px solid var(--va-border, #bbb);
  border-radius: 6px;
  font-size: 1rem;
  background-color: var(--va-background, #fff);
  color: var(--va-text-primary, #333);
  transition: all 0.2s ease;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.08);
  resize: vertical;
  min-height: 100px;
}

.form-textarea:focus {
  outline: none;
  border-color: var(--va-primary, #333);
  border-width: 2px;
  box-shadow: 0 0 0 3px rgba(51, 51, 51, 0.15);
}

.input-icon,
.textarea-icon {
  position: absolute;
  top: 50%;
  right: 1rem;
  transform: translateY(-50%);
  color: var(--va-text-secondary, #666);
  pointer-events: none;
}

.textarea-icon {
  top: 1rem;
  transform: none;
}

/* 成功对话框样式 */
.success-dialog-content {
  text-align: center;
  padding: 2rem 1rem;
}

.success-icon {
  margin-bottom: 1.5rem;
}

.success-title {
  font-size: 1.25rem;
  margin-bottom: 1rem;
  color: var(--va-success, #4CAF50);
}

.success-message {
  color: var(--va-text-secondary, #666);
  line-height: 1.5;
}

/* 深色模式适配 */
:root[data-theme="dark"] .date-option,
:root[data-theme="dark"] .time-option {
  background-color: #333;
  border-color: #444;
  color: #e0e0e0;
}

:root[data-theme="dark"] .date-option:hover,
:root[data-theme="dark"] .time-option:hover {
  background-color: #444;
}

:root[data-theme="dark"] .date-option.selected,
:root[data-theme="dark"] .time-option.selected {
  background-color: #ffffff;
  color: #000000;
  border-color: #ffffff;
}

:root[data-theme="dark"] .period-title,
:root[data-theme="dark"] .selector-title {
  color: #e0e0e0;
}

:root[data-theme="dark"] .date-label,
:root[data-theme="dark"] .date-value {
  color: #e0e0e0;
}

:root[data-theme="dark"] .car-info-summary {
  background-color: rgba(255, 255, 255, 0.05);
}

:root[data-theme="dark"] .dealer-info {
  border-color: rgba(255, 255, 255, 0.1);
}

:root[data-theme="dark"] .date-options::-webkit-scrollbar {
  height: 4px;
}

:root[data-theme="dark"] .date-options::-webkit-scrollbar-track {
  background: #333;
}

:root[data-theme="dark"] .date-options::-webkit-scrollbar-thumb {
  background-color: #666;
  border-radius: 4px;
}

/* 响应式调整 */
@media (max-width: 768px) {
  .appointment-time-selector {
    gap: 1rem;
  }
  
  .date-option {
    min-width: 75px;
    height: 60px;
  }
  
  .time-option {
    min-width: 65px;
    height: 36px;
  }
}

/* 备注输入框区域样式增强 */
.form-group:last-child {
  background-color: rgba(0, 0, 0, 0.02);
  padding: 1rem;
  border-radius: 8px;
  border-left: 3px solid var(--va-primary, #333);
  margin-top: 2rem;
}

:root[data-theme="dark"] .form-group:last-child {
  background-color: rgba(255, 255, 255, 0.05);
  border-left: 3px solid var(--va-primary, #fff);
}

:root[data-theme="dark"] .form-textarea {
  background-color: rgba(0, 0, 0, 0.2);
  border-color: #555;
}

:root[data-theme="dark"] .form-textarea:focus {
  border-color: var(--va-primary, #fff);
  box-shadow: 0 0 0 3px rgba(255, 255, 255, 0.15);
}
</style> 