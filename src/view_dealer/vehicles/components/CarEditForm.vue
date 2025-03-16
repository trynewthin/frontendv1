<template>
  <modal-dialog
    v-model="showModal"
    :title="'编辑车辆信息'"
    :confirm-text="loading ? '保存中...' : '保存修改'"
    :cancel-text="success ? '关闭' : '取消'"
    :loading="loading"
    @confirm="submitCarInfo"
    @cancel="$emit('close')"
  >
    <!-- 加载中 -->
    <div v-if="loading && !dataLoaded" class="loading-container">
      <div class="spinner"></div>
      <p>正在加载车辆信息...</p>
    </div>
    
    <!-- 成功提示 -->
    <div v-else-if="success" class="success-container">
      <p>{{ successMessage }}</p>
    </div>
    
    <!-- 加载错误 -->
    <div v-else-if="error && !dataLoaded" class="error-container">
      <p class="error-title">加载失败</p>
      <p class="error-message">{{ error }}</p>
      <div class="action-buttons">
        <button class="secondary-button" @click="$emit('close')">关闭</button>
        <button class="primary-button" @click="loadCarData">重试</button>
      </div>
    </div>
    
    <!-- 表单内容 -->
    <div v-else>
      <div class="info-message">
        <p>请修改车辆信息，所有带 <span class="required">*</span> 的字段为必填项。</p>
      </div>
      
      <form @submit.prevent="submitCarInfo" class="car-form">
        <!-- 基本信息部分 -->
        <div class="form-section">
          <div class="section-header">
            <h4 class="section-title">基本信息</h4>
          </div>
          
          <div class="form-grid">
            <div class="form-group">
              <label for="brand">品牌 <span class="required">*</span></label>
              <select 
                id="brand" 
                v-model="formData.brand" 
                required 
                class="form-input"
              >
                <option value="">请选择车辆品牌</option>
                <option v-for="brand in CAR_BRANDS" :key="brand.value" :value="brand.value">
                  {{ brand.label }}
                </option>
              </select>
            </div>
            
            <div class="form-group">
              <label for="model">型号 <span class="required">*</span></label>
              <input 
                type="text" 
                id="model" 
                v-model="formData.model" 
                required 
                placeholder="请输入车辆型号"
                class="form-input"
              />
            </div>
            
            <div class="form-group">
              <label for="year">年份 <span class="required">*</span></label>
              <input 
                type="number" 
                id="year" 
                v-model="formData.year" 
                required 
                placeholder="如：2023"
                class="form-input"
                min="1900"
                max="2100"
              />
            </div>
            
            <div class="form-group">
              <label for="price">价格(万元) <span class="required">*</span></label>
              <input 
                type="number" 
                id="price" 
                v-model="formData.price" 
                required 
                placeholder="如：25.8"
                class="form-input"
                min="0"
                step="0.1"
              />
            </div>
            
            <div class="form-group">
              <label for="category">车辆类别 <span class="required">*</span></label>
              <select 
                id="category" 
                v-model="formData.category" 
                required
                class="form-input"
              >
                <option value="">请选择车辆类别</option>
                <option v-for="category in CAR_CATEGORIES" :key="category.value" :value="category.value">
                  {{ category.label }}
                </option>
              </select>
            </div>
            
            <div class="form-group">
              <label for="mileage">里程(公里)</label>
              <input 
                type="number" 
                id="mileage" 
                v-model="formData.mileage" 
                placeholder="如：15000"
                class="form-input"
                min="0"
              />
            </div>
            
            <div class="form-group">
              <label for="color">颜色</label>
              <input 
                type="text" 
                id="color" 
                v-model="formData.color" 
                placeholder="如：珍珠白"
                class="form-input"
              />
            </div>
          </div>
        </div>
        
        <!-- 详细配置部分 -->
        <div class="form-section">
          <div class="section-header">
            <h4 class="section-title">详细配置</h4>
          </div>
          
          <div class="form-grid">
            <div class="form-group">
              <label for="engineType">发动机类型</label>
              <input 
                type="text" 
                id="engineType" 
                v-model="formData.engineType" 
                placeholder="如：2.0T 涡轮增压"
                class="form-input"
              />
            </div>
            
            <div class="form-group">
              <label for="transmission">变速箱</label>
              <input 
                type="text" 
                id="transmission" 
                v-model="formData.transmission" 
                placeholder="如：8挡手自一体"
                class="form-input"
              />
            </div>
            
            <div class="form-group">
              <label for="fuelType">燃油类型</label>
              <select 
                id="fuelType" 
                v-model="formData.fuelType" 
                class="form-input"
              >
                <option value="">请选择燃油类型</option>
                <option v-for="fuelType in FUEL_TYPES" :key="fuelType.value" :value="fuelType.value">
                  {{ fuelType.label }}
                </option>
              </select>
            </div>
            
            <div class="form-group">
              <label for="seats">座位数</label>
              <select 
                id="seats" 
                v-model="formData.seats" 
                class="form-input"
              >
                <option value="">请选择座位数</option>
                <option value="2">2座</option>
                <option value="4">4座</option>
                <option value="5">5座</option>
                <option value="6">6座</option>
                <option value="7">7座</option>
                <option value="8">8座或以上</option>
              </select>
            </div>
            
            <div class="form-group">
              <label for="bodySize">车身尺寸</label>
              <input 
                type="text" 
                id="bodySize" 
                v-model="formData.bodySize" 
                placeholder="如：4850×1860×1480mm"
                class="form-input"
              />
            </div>
            
            <div class="form-group">
              <label for="wheelbase">轴距(mm)</label>
              <input 
                type="number" 
                id="wheelbase" 
                v-model="formData.wheelbase" 
                placeholder="如：2850"
                class="form-input"
                min="0"
              />
            </div>
            
            <div class="form-group form-group-large">
              <label for="features">车辆特性</label>
              <input 
                type="text" 
                id="features" 
                v-model="formData.features" 
                placeholder="如：全景天窗,自动驻车,无钥匙启动"
                class="form-input"
              />
            </div>
            
            <div class="form-group form-group-large">
              <label for="warranty">保修信息</label>
              <input 
                type="text" 
                id="warranty" 
                v-model="formData.warranty" 
                placeholder="如：三年或10万公里"
                class="form-input"
              />
            </div>
            
            <div class="form-group form-group-full">
              <label for="description">车辆描述</label>
              <textarea 
                id="description" 
                v-model="formData.description" 
                placeholder="请输入车辆详细描述信息"
                class="form-textarea"
                rows="4"
              ></textarea>
            </div>
          </div>
        </div>
        
        <!-- 图片管理部分 -->
        <div class="form-section">
          <div class="section-header">
            <h4 class="section-title">车辆图片</h4>
          </div>
          
          <div class="upload-container">
            <div class="upload-tip">
              <p>管理车辆照片，您可以添加新图片或删除现有图片</p>
            </div>
            
            <div class="upload-button-container">
              <label for="car-image-upload" class="upload-button">
                <i class="fa fa-upload"></i> 选择图片
                <input 
                  type="file" 
                  id="car-image-upload" 
                  @change="handleFileSelect" 
                  accept="image/jpeg,image/png,image/gif"
                  multiple
                  class="hidden-input"
                />
              </label>
              <span class="upload-hint">支持jpg、png格式，单张不超过5MB</span>
            </div>
            
            <div class="image-preview-container">
              <p v-if="existingImages.length === 0 && formData.images.length === 0" class="no-images">暂无图片</p>
              
              <!-- 显示现有图片 -->
              <div v-for="(image, index) in existingImages" :key="`existing-${index}`" class="image-preview">
                <img :src="image.fullUrl" :alt="`图片${index + 1}`" />
                <button type="button" class="remove-image" title="删除" @click="handleDeleteExistingImage(image)">
                  <i class="fa fa-times"></i>
                </button>
              </div>
              
              <!-- 显示新上传的图片 -->
              <div v-for="(image, index) in formData.images" :key="`new-${index}`" class="image-preview">
                <img :src="image.preview" :alt="`新图片${index + 1}`" />
                <button type="button" class="remove-image" title="删除" @click="removeImage(index)">
                  <i class="fa fa-times"></i>
                </button>
              </div>
            </div>
          </div>
        </div>
        
        <div class="error-message" v-if="error && dataLoaded">
          {{ error }}
        </div>
      </form>
    </div>
  </modal-dialog>
</template>

<script>
import { ref, reactive, onMounted } from 'vue';
import carService from '@/api/carService';
import { 
  CAR_CATEGORIES, 
  CAR_BRANDS, 
  FUEL_TYPES, 
  IMAGE_TYPES 
} from '@/constants/carEnums';
import ModalDialog from '@/components/modelwindow/ModalDialog.vue';

export default {
  name: 'CarEditFormNew',
  
  components: {
    ModalDialog
  },
  
  props: {
    carId: {
      type: Number,
      required: true
    }
  },
  
  emits: ['close', 'success'],
  
  setup(props, { emit }) {
    const showModal = ref(true);
    const loading = ref(true);
    const error = ref('');
    const success = ref(false);
    const successMessage = ref('');
    const existingImages = ref([]);
    const imagesToDelete = ref([]);
    const dataLoaded = ref(false);
    
    // 提供枚举值给模板使用
    const carEnums = {
      CAR_CATEGORIES,
      CAR_BRANDS,
      FUEL_TYPES,
      IMAGE_TYPES
    };
    
    // 表单数据
    const formData = reactive({
      brand: '',
      model: '',
      year: new Date().getFullYear(),
      price: '',
      category: '',
      mileage: '',
      color: '',
      engineType: '',
      transmission: '',
      fuelType: '',
      seats: '',
      bodySize: '',
      wheelbase: '',
      features: '',
      warranty: '',
      description: '',
      images: []
    });
    
    // 加载车辆数据
    const loadCarData = async () => {
      loading.value = true;
      error.value = '';
      
      try {
        // 获取车辆基本信息
        const carResponse = await carService.getCarDetail(props.carId);
        console.log('获取到的车辆详情数据:', carResponse);
        
        if (!carResponse.success) {
          throw new Error(carResponse.message || '获取车辆信息失败');
        }
        
        const carData = carResponse.data;
        
        // 填充基本信息
        formData.brand = carData.brand || '';
        formData.model = carData.model || '';
        formData.year = carData.year || new Date().getFullYear();
        formData.price = carData.price ? (carData.price / 10000).toFixed(1) : ''; // 转换为万元
        formData.category = carData.category || '';
        formData.mileage = carData.mileage || '';
        
        // 填充详细信息
        if (carData.detail) {
          formData.color = carData.detail.color || '';
          formData.engineType = carData.detail.engine || '';
          formData.transmission = carData.detail.transmission || '';
          formData.fuelType = carData.detail.fuelType || '';
          formData.seats = carData.detail.seats ? carData.detail.seats.toString() : '';
          formData.bodySize = carData.detail.bodySize || '';
          formData.wheelbase = carData.detail.wheelbase ? carData.detail.wheelbase.toString() : '';
          formData.features = carData.detail.features || '';
          formData.warranty = carData.detail.warranty || '';
          formData.description = carData.detail.description || '';
        }
        
        // 加载图片
        await loadCarImages();
        
        // 标记数据已加载完成
        dataLoaded.value = true;
        
      } catch (err) {
        console.error('加载车辆数据失败:', err);
        error.value = err.message || '加载车辆数据失败，请稍后重试';
      } finally {
        loading.value = false;
      }
    };
    
    // 加载车辆图片
    const loadCarImages = async () => {
      try {
        const imagesResponse = await carService.getCarImages(props.carId);
        
        if (imagesResponse.success) {
          existingImages.value = imagesResponse.data || [];
          
          // 处理图片URL，确保所有图片都有正确的URL
          existingImages.value = existingImages.value.map(img => {
            // 如果没有fullUrl字段，但有url字段
            if (!img.fullUrl && img.url) {
              img.fullUrl = `${import.meta.env.VITE_API_IMAGE_URL || 'http://localhost:8090'}${img.url}`;
            }
            
            // 如果既没有fullUrl也没有url，但有imageUrl
            if (!img.fullUrl && !img.url && img.imageUrl) {
              img.fullUrl = `${import.meta.env.VITE_API_IMAGE_URL || 'http://localhost:8090'}${img.imageUrl}`;
            }
            
            return img;
          });
        }
      } catch (err) {
        console.error('加载车辆图片失败:', err);
        error.value = '图片加载失败，您仍可以编辑其他信息';
      }
    };
    
    // 处理删除现有图片
    const handleDeleteExistingImage = (image) => {
      // 如果图片有ID，标记为需要删除
      if (image.imageId) {
        // 添加到待删除列表
        imagesToDelete.value.push(image.imageId);
        // 从现有图片中移除显示
        existingImages.value = existingImages.value.filter(img => img.imageId !== image.imageId);
        console.log(`已标记图片#${image.imageId}为待删除`);
      }
    };
    
    // 处理文件选择
    const handleFileSelect = (event) => {
      const files = event.target.files;
      if (!files || files.length === 0) return;
      
      // 验证文件
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        
        // 验证文件类型
        const validTypes = ['image/jpeg', 'image/png', 'image/gif'];
        if (!validTypes.includes(file.type)) {
          error.value = '图片格式不支持，请使用JPG、PNG或GIF格式';
          continue;
        }
        
        // 验证文件大小 (最大5MB)
        const maxSize = 5 * 1024 * 1024; // 5MB
        if (file.size > maxSize) {
          error.value = '图片文件大小超过限制，最大支持5MB';
          continue;
        }
        
        // 创建预览
        const reader = new FileReader();
        reader.onload = (e) => {
          // 确定图片类型
          let imageType = '';
          
          // 检查是否已经存在缩略图（包括已有图片和新上传图片）
          const hasThumbnail = existingImages.value.some(img => img.type === 'thumbnail') || 
                            formData.images.some(img => img.type === 'thumbnail');
          
          if (!hasThumbnail) {
            // 如果没有缩略图，则第一张为缩略图
            imageType = 'thumbnail';
          } else {
            // 其他图片设置为普通图片，但添加序号确保唯一性
            const fullCount = [...existingImages.value, ...formData.images]
              .filter(img => img.type && img.type.startsWith('full')).length;
            imageType = `full_${fullCount + 1}`;
          }
          
          formData.images.push({
            file: file,
            preview: e.target.result,
            type: imageType,
            name: file.name
          });
        };
        reader.readAsDataURL(file);
      }
      
      // 清空input，允许重复选择同一文件
      event.target.value = '';
    };
    
    // 移除新上传的图片
    const removeImage = (index) => {
      formData.images.splice(index, 1);
    };
    
    // 验证表单
    const validateForm = () => {
      // 验证必填字段
      const requiredFields = [
        { field: 'brand', name: '品牌' },
        { field: 'model', name: '型号' },
        { field: 'year', name: '年份' },
        { field: 'price', name: '价格' },
        { field: 'category', name: '车辆类别' }
      ];
      
      for (const { field, name } of requiredFields) {
        if (!formData[field]) {
          error.value = `请填写${name}`;
          return false;
        }
      }
      
      // 验证年份范围
      const currentYear = new Date().getFullYear();
      const year = parseInt(formData.year);
      if (year < 1900 || year > currentYear + 1) {
        error.value = `年份必须在1900至${currentYear + 1}之间`;
        return false;
      }
      
      // 验证价格
      const price = parseFloat(formData.price);
      if (isNaN(price) || price <= 0) {
        error.value = '价格必须大于0';
        return false;
      }
      
      return true;
    };
    
    // 提交车辆信息
    const submitCarInfo = async () => {
      // 已经成功，直接关闭
      if (success.value) {
        emit('close');
        return;
      }
      
      // 验证表单
      if (!validateForm()) {
        return;
      }
      
      loading.value = true;
      error.value = '';
      
      try {
        // 更新车辆基本信息
        const carData = {
          brand: formData.brand,
          model: formData.model,
          year: parseInt(formData.year),
          price: parseFloat(formData.price) * 10000, // 转换为元
          category: formData.category
        };
        
        // 调用API更新车辆基本信息
        const updateResponse = await carService.updateCar(props.carId, carData);
        
        if (!updateResponse.success) {
          throw new Error(updateResponse.message || '更新车辆基本信息失败');
        }
        
        // 更新车辆详细信息
        const detailData = {
          engine: formData.engineType,
          transmission: formData.transmission,
          color: formData.color,
          fuelType: formData.fuelType,
          seats: formData.seats ? parseInt(formData.seats) : undefined,
          bodySize: formData.bodySize,
          wheelbase: formData.wheelbase ? parseInt(formData.wheelbase) : undefined,
          features: formData.features,
          warranty: formData.warranty,
          description: formData.description
        };
        
        // 过滤掉undefined值
        Object.keys(detailData).forEach(key => {
          if (detailData[key] === undefined || detailData[key] === '') {
            delete detailData[key];
          }
        });
        
        await carService.updateCarDetail(props.carId, detailData);
        
        // 这里会有删除图片和上传新图片的逻辑...
        
        success.value = true;
        successMessage.value = '车辆信息更新成功！';
        emit('success', { 
          carId: props.carId,
          brand: formData.brand,
          model: formData.model,
          year: parseInt(formData.year),
          price: parseFloat(formData.price) * 10000,
          category: formData.category
        });
      } catch (err) {
        console.error('更新车辆信息出错:', err);
        error.value = err.message || '更新车辆信息时发生错误';
      } finally {
        loading.value = false;
      }
    };
    
    // 组件挂载时加载数据
    onMounted(() => {
      loadCarData();
    });
    
    return {
      showModal,
      ...carEnums, // 展开枚举值
      loading,
      error,
      success,
      successMessage,
      formData,
      existingImages,
      imagesToDelete,
      dataLoaded,
      loadCarData,
      handleFileSelect,
      removeImage,
      handleDeleteExistingImage,
      validateForm,
      submitCarInfo
    };
  }
};
</script>

<style scoped>
/* 表单样式 */
.car-form {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.info-message {
  background-color: var(--va-background-element);
  border-left: 4px solid var(--va-primary);
  padding: 12px 16px;
  margin-bottom: 20px;
  border-radius: 4px;
}

.info-message p {
  margin: 0;
  color: var(--va-text-secondary);
  font-size: 14px;
  line-height: 1.5;
}

.form-section {
  background-color: var(--va-background-element);
  border-radius: 8px;
  padding: 16px;
  box-shadow: 0 1px 3px var(--va-shadow);
}

.section-header {
  display: flex;
  align-items: center;
  margin-bottom: 16px;
}

.section-title {
  font-size: 16px;
  font-weight: 600;
  color: var(--va-text-primary);
  margin: 0;
  flex: 1;
}

.form-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
}

.form-group {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 12px;
}

.form-group label {
  font-size: 14px;
  color: var(--va-text-secondary);
  font-weight: 500;
  width: 90px;
  min-width: 90px;
  flex-shrink: 0;
  text-align: left;
}

.form-group-large {
  grid-column: span 2;
}

.form-group-full {
  grid-column: 1 / -1;
}

.required {
  color: var(--va-error);
  margin-left: 2px;
}

.form-input,
.form-textarea {
  padding: 10px 12px;
  border: 1.5px solid var(--va-input-border);
  border-radius: 6px;
  font-size: 14px;
  transition: all 0.2s;
  background-color: var(--va-input-background);
  color: var(--va-text-primary);
  width: 100%;
  box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.05);
}

/* 修改选择框样式 */
select.form-input {
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 12px center;
  padding-right: 36px;
}

.form-input:focus,
.form-textarea:focus {
  border-color: var(--va-primary);
  outline: none;
  box-shadow: 0 0 0 2px rgba(var(--va-primary-rgb), 0.15), inset 0 1px 3px rgba(0, 0, 0, 0.05);
}

.form-input:hover,
.form-textarea:hover {
  border-color: var(--va-primary-hover);
}

.form-textarea {
  resize: vertical;
  min-height: 100px;
}

.upload-container {
  background-color: var(--va-background-element);
  border: 1px dashed var(--va-border);
  border-radius: 6px;
  padding: 16px;
}

.upload-tip {
  margin-bottom: 16px;
}

.upload-tip p {
  margin: 0;
  font-size: 14px;
  color: var(--va-text-secondary);
}

.upload-button-container {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 16px;
  flex-wrap: wrap;
}

.upload-button {
  padding: 8px 16px;
  background-color: var(--va-primary);
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  font-weight: 500;
  transition: all 0.2s ease;
}

.upload-button:hover {
  background-color: var(--va-primary-hover);
}

.upload-hint {
  font-size: 13px;
  color: var(--va-text-secondary);
}

.image-preview-container {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
  gap: 12px;
}

.no-images {
  grid-column: 1 / -1;
  text-align: center;
  color: var(--va-text-secondary);
  font-size: 14px;
  padding: 20px 0;
  background-color: rgba(var(--va-border-rgb), 0.1);
  border-radius: 4px;
}

.image-preview {
  position: relative;
  aspect-ratio: 1 / 1;
  border-radius: 4px;
  overflow: hidden;
  border: 1px solid var(--va-border);
  box-shadow: 0 1px 3px var(--va-shadow);
}

.image-preview img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.remove-image {
  position: absolute;
  top: 4px;
  right: 4px;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background-color: rgba(0, 0, 0, 0.5);
  color: white;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-size: 10px;
  opacity: 0.8;
}

.image-preview:hover .remove-image {
  opacity: 1;
}

.loading-container,
.success-container,
.error-container {
  text-align: center;
  padding: 30px 0;
}

.loading-container .spinner {
  width: 40px;
  height: 40px;
  border: 3px solid #f3f3f3;
  border-top: 3px solid var(--va-primary);
  border-radius: 50%;
  margin: 0 auto 15px;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.error-container {
  color: var(--va-error);
}

.error-title {
  font-weight: bold;
  margin-bottom: 10px;
}

.error-message {
  color: var(--va-error);
  font-size: 14px;
  padding: 8px 12px;
  background-color: rgba(var(--va-error-rgb), 0.1);
  border-radius: 4px;
  border-left: 3px solid var(--va-error);
}

.success-container p {
  color: var(--va-success);
  font-size: 16px;
  margin: 0;
}

.action-buttons {
  display: flex;
  justify-content: center;
  gap: 12px;
  margin-top: 15px;
}

.primary-button,
.secondary-button {
  padding: 8px 16px;
  border-radius: 4px;
  font-size: 14px;
  cursor: pointer;
  border: none;
}

.primary-button {
  background-color: var(--va-primary);
  color: white;
}

.secondary-button {
  background-color: #e0e0e0;
  color: #333;
}

.hidden-input {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  border: 0;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .form-grid {
    grid-template-columns: 1fr;
  }
  
  .form-group-large {
    grid-column: auto;
  }
  
  .form-group {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .form-group label {
    width: 100%;
  }
}

/* 变量定义 */
:root {
  --va-primary-rgb: 100, 108, 255;
  --va-error-rgb: 220, 53, 69;
  --va-border-rgb: 230, 230, 230;
}
</style> 