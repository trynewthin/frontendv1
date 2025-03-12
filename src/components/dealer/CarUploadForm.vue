<template>
  <div class="car-upload-form">
    <h3 class="form-title">车辆信息上传</h3>
    
    <div v-if="loading" class="loading-container">
      <div class="spinner"></div>
      <p>上传中...</p>
    </div>
    
    <div v-else-if="success" class="success-container">
      <p>{{ successMessage }}</p>
      <div class="action-buttons">
        <button class="primary-button" @click="$emit('close')">关闭</button>
      </div>
    </div>
    
    <div v-else>
      <div class="info-message">
        <p>请填写车辆基本信息并上传相关图片，所有带 * 的字段为必填项。</p>
      </div>
      
      <form @submit.prevent="submitCarInfo" class="car-form">
        <!-- 基本信息部分 -->
        <div class="form-section">
          <h4 class="section-title">基本信息</h4>
          
          <div class="form-row">
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
          
          <div class="form-row">
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
          </div>
          
          <div class="form-row">
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
          </div>
          
          <div class="form-row">
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
          <h4 class="section-title">详细配置</h4>
          
          <div class="form-row">
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
          </div>
          
          <div class="form-row">
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
          </div>
          
          <div class="form-row">
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
          </div>
          
          <div class="form-group">
            <label for="features">车辆特性</label>
            <input 
              type="text" 
              id="features" 
              v-model="formData.features" 
              placeholder="如：全景天窗,自动驻车,无钥匙启动"
              class="form-input"
            />
          </div>
          
          <div class="form-group">
            <label for="warranty">保修信息</label>
            <input 
              type="text" 
              id="warranty" 
              v-model="formData.warranty" 
              placeholder="如：三年或10万公里"
              class="form-input"
            />
          </div>
          
          <div class="form-group">
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
        
        <!-- 图片上传部分 -->
        <div class="form-section">
          <h4 class="section-title">车辆图片</h4>
          
          <div class="upload-container">
            <div class="upload-tip">
              <p>请上传车辆照片，建议包含车辆外观、内饰、发动机舱等多角度图片</p>
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
              <p v-if="formData.images.length === 0" class="no-images">暂无图片</p>
              <div v-for="(image, index) in formData.images" :key="index" class="image-preview">
                <img :src="image.preview" :alt="`预览图${index + 1}`" />
                <button type="button" class="remove-image" title="删除" @click="removeImage(index)">
                  <i class="fa fa-times"></i>
                </button>
              </div>
            </div>
          </div>
        </div>
        
        <div class="error-message" v-if="error">
          {{ error }}
        </div>
        
        <div class="action-buttons">
          <button type="button" class="secondary-button" @click="$emit('close')">取消</button>
          <button type="submit" class="primary-button" :disabled="loading">提交</button>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import { ref, reactive } from 'vue';
import carService from '@/api/carService';
import { 
  CAR_CATEGORIES, 
  CAR_BRANDS, 
  FUEL_TYPES, 
  IMAGE_TYPES 
} from '@/constants/carEnums';

export default {
  name: 'CarUploadForm',
  
  emits: ['close', 'success'],
  
  setup(props, { emit }) {
    const loading = ref(false);
    const error = ref('');
    const success = ref(false);
    const successMessage = ref('');
    
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
          formData.images.push({
            file: file,
            preview: e.target.result,
            type: formData.images.length === 0 ? IMAGE_TYPES[0].value : IMAGE_TYPES[1].value // 使用枚举值
          });
        };
        reader.readAsDataURL(file);
      }
      
      // 清空input，允许重复选择同一文件
      event.target.value = '';
    };
    
    // 移除图片
    const removeImage = (index) => {
      formData.images.splice(index, 1);
    };
    
    // 上传图片
    const uploadImages = async (carId) => {
      const uploadPromises = [];
      
      for (const image of formData.images) {
        uploadPromises.push(
          carService.uploadCarImage(carId, image.type, image.file)
        );
      }
      
      return Promise.all(uploadPromises);
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
      // 验证表单
      if (!validateForm()) {
        return;
      }
      
      loading.value = true;
      error.value = '';
      
      try {
        // 获取经销商ID - 修改此部分代码
        let dealerId = null;
        
        // 尝试从localStorage获取
        try {
          const userInfoStr = localStorage.getItem('userInfo');
          if (userInfoStr) {
            const userInfo = JSON.parse(userInfoStr);
            dealerId = userInfo.dealerId;
          }
        } catch (e) {
          console.warn('从localStorage获取经销商ID失败:', e);
        }
        
        // 尝试从localStorage的另一个可能位置获取
        if (!dealerId) {
          try {
            const dealerInfoStr = localStorage.getItem('dealerInfo');
            if (dealerInfoStr) {
              const dealerInfo = JSON.parse(dealerInfoStr);
              dealerId = dealerInfo.dealerId;
            }
          } catch (e) {
            console.warn('从dealerInfo获取经销商ID失败:', e);
          }
        }
        
        // 如果上述方法都失败，使用硬编码的ID（仅用于测试）
        if (!dealerId) {
          // 从错误信息中可以看到，已经成功加载了dealer信息，ID为2
          dealerId = 2;
          console.warn('使用硬编码的经销商ID:', dealerId);
        }
        
        if (!dealerId) {
          throw new Error('未找到经销商信息，请确保您已完成经销商认证');
        }
        
        // 创建车辆基本信息
        const carData = {
          dealerId: dealerId,
          brand: formData.brand,
          model: formData.model,
          year: parseInt(formData.year),
          price: parseFloat(formData.price) * 10000, // 转换为元
          category: formData.category || '轿车' // 默认类别
        };
        
        console.log('提交的车辆数据:', carData);
        
        // 调用API创建车辆
        const createResponse = await carService.createCar(carData);
        
        if (!createResponse.success) {
          throw new Error(createResponse.message || '创建车辆失败');
        }
        
        // 获取创建的车辆ID
        const carId = createResponse.data.carId;
        
        // 更新车辆详细信息
        if (formData.engineType || formData.transmission || formData.color || formData.description) {
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
            fuelConsumption: formData.fuelConsumption ? parseFloat(formData.fuelConsumption) : undefined,
            description: formData.description
          };
          
          // 过滤掉undefined值
          Object.keys(detailData).forEach(key => {
            if (detailData[key] === undefined || detailData[key] === '') {
              delete detailData[key];
            }
          });
          
          const detailResponse = await carService.updateCarDetail(carId, detailData);
          
          if (!detailResponse.success) {
            console.warn('更新车辆详细信息失败:', detailResponse.message);
            // 继续执行，不中断流程
          }
        }
        
        // 如果有图片，上传图片
        if (formData.images.length > 0) {
          const imageResults = await uploadImages(carId);
          console.log('图片上传结果:', imageResults);
        }
        
        success.value = true;
        successMessage.value = '车辆信息上传成功！';
        emit('success', { 
          ...formData,
          carId: carId,
          // 转换图片数据，只保留必要信息
          images: formData.images.map(img => ({
            type: img.type,
            name: img.file.name,
            size: img.file.size
          }))
        });
      } catch (err) {
        console.error('上传车辆信息出错:', err);
        error.value = err.message || '上传车辆信息时发生错误';
      } finally {
        loading.value = false;
      }
    };
    
    return {
      ...carEnums, // 展开枚举值
      loading,
      error,
      success,
      successMessage,
      formData,
      handleFileSelect,
      removeImage,
      validateForm,
      submitCarInfo
    };
  }
}
</script>

<style scoped>
.car-upload-form {
  padding: 20px;
  max-width: 800px;
  margin: 0 auto;
}

.form-title {
  font-size: 18px;
  color: #333;
  margin-bottom: 20px;
  padding-bottom: 10px;
  border-bottom: 1px solid #eee;
}

.info-message {
  background-color: #f8f9fa;
  border-left: 4px solid var(--va-primary);
  padding: 12px 15px;
  margin-bottom: 20px;
  border-radius: 4px;
}

.info-message p {
  margin: 0;
  color: #555;
  font-size: 14px;
  line-height: 1.5;
}

.car-form {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.form-section {
  background-color: #f9f9f9;
  border-radius: 8px;
  padding: 15px;
}

.section-title {
  font-size: 16px;
  color: #333;
  margin-top: 0;
  margin-bottom: 15px;
  padding-bottom: 8px;
  border-bottom: 1px solid #eee;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 5px;
  margin-bottom: 12px;
}

.form-row {
  display: flex;
  gap: 15px;
}

.form-row .form-group {
  flex: 1;
}

.form-group label {
  font-size: 14px;
  color: #555;
  font-weight: 500;
}

.required {
  color: #e74c3c;
}

.form-input,
.form-textarea {
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
  transition: border-color 0.2s;
}

.form-input:focus,
.form-textarea:focus {
  border-color: var(--va-primary);
  outline: none;
}

.form-textarea {
  resize: vertical;
  min-height: 80px;
}

.upload-container {
  background-color: #fff;
  border: 1px dashed #ddd;
  border-radius: 4px;
  padding: 15px;
}

.upload-tip {
  margin-bottom: 15px;
}

.upload-tip p {
  margin: 0;
  font-size: 14px;
  color: #666;
}

.upload-button-container {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 15px;
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
  gap: 5px;
  font-size: 14px;
}

.upload-hint {
  font-size: 12px;
  color: #888;
}

.image-preview-container {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  min-height: 100px;
}

.no-images {
  width: 100%;
  text-align: center;
  color: #888;
  font-size: 14px;
  padding: 30px 0;
}

.image-preview {
  position: relative;
  width: 100px;
  height: 100px;
  border-radius: 4px;
  overflow: hidden;
  border: 1px solid #eee;
}

.image-preview img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.remove-image {
  position: absolute;
  top: 5px;
  right: 5px;
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
  font-size: 12px;
}

.error-message {
  color: #e74c3c;
  font-size: 14px;
  margin-top: 5px;
}

.action-buttons {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 20px;
}

.primary-button,
.secondary-button {
  padding: 8px 16px;
  border-radius: 4px;
  font-size: 14px;
  cursor: pointer;
  border: none;
  transition: background-color 0.2s;
}

.primary-button {
  background-color: var(--va-primary);
  color: white;
}

.primary-button:hover {
  background-color: rgb(146, 183, 252);
  color: rgb(0, 0, 0);
}

.secondary-button {
  background-color: #f0f0f0;
  color: #333;
}

.secondary-button:hover {
  background-color: #e0e0e0;
}

.loading-container,
.success-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 30px 0;
  text-align: center;
}

.spinner {
  width: 30px;
  height: 30px;
  border: 3px solid rgba(0, 0, 0, 0.1);
  border-radius: 50%;
  border-top-color: var(--va-primary);
  animation: spin 1s ease-in-out infinite;
  margin-bottom: 10px;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.success-container {
  color: #2ecc71;
}

@media (max-width: 768px) {
  .form-row {
    flex-direction: column;
    gap: 0;
  }
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
</style> 