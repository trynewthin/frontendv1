<template>
  <va-modal
    :modelValue="modelValue"
    @update:modelValue="$emit('update:modelValue', $event)"
    :title="title"
    size="large"
    hide-default-actions
    :max-width="900"
  >
    <!-- 加载中 -->
    <div v-if="loading && !dataLoaded" class="loading-container">
      <va-progress-circle indeterminate color="primary" />
      <p>正在加载车辆信息...</p>
    </div>
    
    <!-- 成功提示 -->
    <div v-else-if="success" class="success-container">
      <va-icon name="check_circle" color="success" size="48" />
      <p>{{ successMessage }}</p>
      <div class="d-flex justify-end mt-4">
        <va-button color="primary" @click="close">关闭</va-button>
      </div>
    </div>
    
    <!-- 加载错误 -->
    <div v-else-if="error && !dataLoaded" class="error-container">
      <va-icon name="error" color="danger" size="48" />
      <p class="error-title">加载失败</p>
      <p class="error-message">{{ error }}</p>
      <div class="d-flex justify-end mt-4">
        <va-button color="gray" class="mr-3" @click="close">关闭</va-button>
        <va-button color="primary" @click="loadCarData">重试</va-button>
      </div>
    </div>
    
    <!-- 表单内容 -->
    <div v-else>
      <div class="info-message">
        <p>请修改车辆信息，所有带 <span class="required">*</span> 的字段为必填项。</p>
      </div>
      
      <va-form @submit.prevent="submitCarInfo" class="car-form">
        <!-- 基本信息部分 -->
        <div class="form-section">
          <div class="section-header">
            <h4 class="section-title">基本信息</h4>
          </div>
          
          <div class="form-grid">
            <va-form-item label="品牌" class="form-group">
              <span class="required">*</span>
              <va-select
                v-model="formData.brand"
                :options="CAR_BRANDS"
                text-by="label"
                value-by="value"
                placeholder="请选择车辆品牌"
                class="form-input"
              />
            </va-form-item>
            
            <va-form-item label="型号" class="form-group">
              <span class="required">*</span>
              <va-input
                v-model="formData.model"
                placeholder="请输入车辆型号"
                class="form-input"
              />
            </va-form-item>
            
            <va-form-item label="年份" class="form-group">
              <span class="required">*</span>
              <va-input
                v-model="formData.year"
                type="number"
                min="1900"
                :max="currentYear"
                placeholder="请输入生产年份"
                class="form-input"
              />
            </va-form-item>
            
            <va-form-item label="价格(元)" class="form-group">
              <span class="required">*</span>
              <va-input
                v-model="formData.price"
                type="number"
                min="0"
                placeholder="请输入价格"
                class="form-input"
              />
            </va-form-item>
            
            <va-form-item label="车辆类型" class="form-group">
              <va-select
                v-model="formData.category"
                :options="CAR_CATEGORIES"
                text-by="label"
                value-by="value"
                placeholder="请选择车辆类型"
                class="form-input"
              />
            </va-form-item>
            
            <va-form-item label="颜色" class="form-group">
              <va-select
                v-model="formData.color"
                :options="CAR_COLORS"
                text-by="label"
                value-by="value"
                placeholder="请选择车辆颜色"
                class="form-input"
              />
            </va-form-item>
          </div>
        </div>
        
        <!-- 详细参数部分 -->
        <div class="form-section">
          <div class="section-header">
            <h4 class="section-title">详细参数</h4>
          </div>
          
          <div class="form-grid">
            <va-form-item label="发动机" class="form-group">
              <va-input
                v-model="formData.engine"
                placeholder="请输入发动机信息"
                class="form-input"
              />
            </va-form-item>
            
            <va-form-item label="变速箱" class="form-group">
              <va-select
                v-model="formData.transmission"
                :options="CAR_TRANSMISSIONS"
                text-by="label"
                value-by="value"
                placeholder="请选择变速箱类型"
                class="form-input"
              />
            </va-form-item>
            
            <va-form-item label="燃油类型" class="form-group">
              <va-select
                v-model="formData.fuelType"
                :options="CAR_FUEL_TYPES"
                text-by="label"
                value-by="value"
                placeholder="请选择燃油类型"
                class="form-input"
              />
            </va-form-item>
            
            <va-form-item label="座位数" class="form-group">
              <va-input
                v-model="formData.seats"
                type="number"
                min="1"
                max="100"
                placeholder="请输入座位数"
                class="form-input"
              />
            </va-form-item>
            
            <va-form-item label="里程数(km)" class="form-group">
              <va-input
                v-model="formData.mileage"
                type="number"
                min="0"
                placeholder="请输入里程数"
                class="form-input"
              />
            </va-form-item>
          </div>
        </div>
      </va-form>
      
      <!-- 操作按钮 -->
      <div class="d-flex justify-end mt-4">
        <va-button 
          color="gray" 
          class="mr-3" 
          @click="close"
        >
          取消
        </va-button>
        <va-button 
          color="primary" 
          :loading="loading" 
          @click="submitCarInfo"
        >
          保存修改
        </va-button>
      </div>
    </div>
  </va-modal>
</template>

<script>
import { ref, reactive, computed, onMounted, watch } from 'vue';
import carService from '@/api/carService';
import carEnums from '@/constants/carEnums';
import { useToast } from 'vuestic-ui';

export default {
  name: 'CarEditForm',
  
  props: {
    modelValue: {
      type: Boolean,
      default: false
    },
    title: {
      type: String,
      default: '编辑车辆信息'
    },
    carId: {
      type: [String, Number],
      default: ''
    },
    carData: {
      type: Object,
      default: () => ({})
    }
  },
  
  emits: ['update:modelValue', 'saved', 'close'],
  
  setup(props, { emit }) {
    const { init: initToast } = useToast();
    
    // 状态
    const dataLoaded = ref(false);
    const loading = ref(false);
    const success = ref(false);
    const successMessage = ref('');
    const error = ref('');
    
    // 导入枚举
    const { 
      CAR_BRANDS,
      CAR_CATEGORIES,
      CAR_TRANSMISSIONS,
      CAR_FUEL_TYPES, 
      CAR_COLORS 
    } = carEnums;
    
    // 计算当前年份
    const currentYear = new Date().getFullYear();
    
    // 表单数据
    const formData = reactive({
      brand: '',
      model: '',
      year: '',
      price: '',
      category: '',
      color: '',
      engine: '',
      transmission: '',
      fuelType: '',
      seats: '',
      mileage: '',
      images: []
    });
    
    // 监听外部传入的车辆数据
    watch(() => props.carData, (newVal) => {
      if (newVal && Object.keys(newVal).length > 0) {
        initFormData(newVal);
        dataLoaded.value = true;
      }
    }, { immediate: true, deep: true });
    
    // 监听carId变化，加载车辆数据
    watch(() => props.carId, (newVal) => {
      if (newVal && props.modelValue) {
        loadCarData();
      }
    });
    
    // 监听模态框显示状态
    watch(() => props.modelValue, (newVal) => {
      if (newVal && props.carId) {
        loadCarData();
      } else if (!newVal) {
        resetForm();
      }
    });
    
    // 初始化表单数据
    const initFormData = (carData) => {
      if (!carData) return;
      
      // 基本信息
      formData.brand = carData.brand || '';
      formData.model = carData.model || '';
      formData.year = carData.year || '';
      formData.price = carData.price || '';
      formData.category = carData.category || '';
      formData.color = carData.color || '';
      
      // 详细参数 - 可能在detail对象中
      const detail = carData.detail || {};
      formData.engine = detail.engine || carData.engine || '';
      formData.transmission = detail.transmission || carData.transmission || '';
      formData.fuelType = detail.fuelType || carData.fuelType || '';
      formData.seats = detail.seats || carData.seats || '';
      formData.mileage = detail.mileage || carData.mileage || '';
      
      // 图片
      formData.images = carData.images || [];
      
      dataLoaded.value = true;
    };
    
    // 加载车辆数据
    const loadCarData = async () => {
      if (!props.carId) return;
      
      try {
        loading.value = true;
        error.value = '';
        
        const response = await carService.getCarDetail(props.carId);
        
        if (response.success && response.data) {
          initFormData(response.data);
          success.value = false;
        } else {
          error.value = response.message || '加载车辆信息失败';
        }
      } catch (err) {
        console.error('加载车辆信息出错:', err);
        error.value = err.message || '加载车辆信息出错';
      } finally {
        loading.value = false;
      }
    };
    
    // 提交车辆信息
    const submitCarInfo = async () => {
      // 验证必填字段
      if (!formData.brand || !formData.model || !formData.year || !formData.price) {
        initToast({
          message: '请填写必填字段',
          color: 'warning',
          timeout: 3000
        });
        return;
      }
      
      try {
        loading.value = true;
        error.value = '';
        
        // 准备提交的数据
        const carData = {
          brand: formData.brand,
          model: formData.model,
          year: Number(formData.year),
          price: Number(formData.price),
          category: formData.category,
          color: formData.color,
          detail: {
            engine: formData.engine,
            transmission: formData.transmission,
            fuelType: formData.fuelType,
            seats: formData.seats ? Number(formData.seats) : '',
            mileage: formData.mileage ? Number(formData.mileage) : ''
          }
        };
        
        let response;
        if (props.carId) {
          response = await carService.updateCar(props.carId, carData);
        } else {
          response = await carService.createCar(carData);
        }
        
        if (response.success) {
          success.value = true;
          successMessage.value = props.carId ? '车辆信息已成功更新' : '车辆信息已成功创建';
          
          emit('saved', response.data);
          
          // 短暂延迟后关闭
          setTimeout(() => {
            close();
          }, 1500);
        } else {
          error.value = response.message || '保存车辆信息失败';
          initToast({
            message: error.value,
            color: 'danger',
            timeout: 3000
          });
        }
      } catch (err) {
        console.error('保存车辆信息出错:', err);
        error.value = err.message || '保存车辆信息出错';
        initToast({
          message: error.value,
          color: 'danger',
          timeout: 3000
        });
      } finally {
        loading.value = false;
      }
    };
    
    // 重置表单
    const resetForm = () => {
      Object.keys(formData).forEach(key => {
        formData[key] = '';
      });
      formData.images = [];
      
      success.value = false;
      successMessage.value = '';
      error.value = '';
      dataLoaded.value = false;
    };
    
    // 关闭模态框
    const close = () => {
      emit('update:modelValue', false);
      emit('close');
      resetForm();
    };
    
    // 组件挂载时
    onMounted(() => {
      if (props.modelValue && props.carId) {
        loadCarData();
      } else if (props.carData && Object.keys(props.carData).length > 0) {
        initFormData(props.carData);
      }
    });
    
    return {
      dataLoaded,
      loading,
      success,
      successMessage,
      error,
      formData,
      CAR_BRANDS,
      CAR_CATEGORIES,
      CAR_TRANSMISSIONS,
      CAR_FUEL_TYPES,
      CAR_COLORS,
      currentYear,
      submitCarInfo,
      close,
      loadCarData
    };
  }
};
</script>

<style scoped>
/* 表单布局样式 */
.car-form {
  margin-top: 16px;
}

.form-section {
  margin-bottom: 24px;
  border: 1px solid var(--va-divider);
  border-radius: 8px;
  overflow: hidden;
}

.section-header {
  background-color: var(--va-background-element);
  padding: 12px 16px;
  border-bottom: 1px solid var(--va-divider);
}

.section-title {
  margin: 0;
  font-size: 1rem;
  font-weight: 600;
  color: var(--va-text-primary);
}

.form-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 16px;
  padding: 16px;
}

.form-group {
  position: relative;
}

.form-input {
  width: 100%;
}

/* 必填项标记 */
.required {
  color: var(--va-danger);
  margin-left: 4px;
}

/* 加载、成功和错误状态样式 */
.loading-container, 
.success-container, 
.error-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 32px;
  text-align: center;
}

.error-title {
  font-size: 1.2rem;
  font-weight: bold;
  margin: 16px 0 8px;
  color: var(--va-danger);
}

.error-message {
  color: var(--va-text-secondary);
  margin-bottom: 16px;
}

.info-message {
  margin-bottom: 16px;
  padding: 8px 16px;
  background-color: var(--va-background-element);
  border-radius: 4px;
  color: var(--va-text-secondary);
}

/* 布局辅助类 */
.d-flex {
  display: flex;
}

.justify-end {
  justify-content: flex-end;
}

.mt-4 {
  margin-top: 1rem;
}

.mr-3 {
  margin-right: 0.75rem;
}
</style> 