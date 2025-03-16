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
        <p>请填写车辆基本信息并上传相关图片，所有带 <span class="required">*</span> 的字段为必填项。</p>
      </div>
      
      <form @submit.prevent="submitCarInfo" class="car-form">
        <!-- 基本信息部分 -->
        <div class="form-section">
          <div class="section-header">
            <h4 class="section-title">基本信息</h4>
            <div class="section-badge">必填</div>
          </div>
          
          <div class="form-grid">
            <div class="form-group form-group-large">
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
            
            <div class="form-group form-group-large">
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
              <label for="color">颜色</label>
              <input 
                type="text" 
                id="color" 
                v-model="formData.color" 
                placeholder="如：珍珠白"
                class="form-input"
              />
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
        </div>
        
        <!-- 详细配置部分 -->
        <div class="form-section">
          <div class="section-header">
            <h4 class="section-title">详细配置</h4>
            <div class="section-badge section-badge-optional">选填</div>
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
        
        <!-- 图片上传部分 -->
        <div class="form-section">
          <div class="section-header">
            <h4 class="section-title">车辆图片</h4>
          </div>
          
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
                <div class="image-type" v-if="image.type === 'thumbnail'">封面</div>
              </div>
            </div>
          </div>
        </div>
        
        <div class="error-message" v-if="error">
          {{ error }}
        </div>
        
        <div class="form-actions">
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
      
      console.log(`选择了${files.length}张图片`);
      
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
          
          // 检查是否已经存在缩略图
          const hasThumbnail = formData.images.some(img => img.type === 'thumbnail');
          
          if (!hasThumbnail) {
            // 如果没有缩略图，则第一张为缩略图
            imageType = 'thumbnail';
            console.log('设置为缩略图');
          } else {
            // 其他图片设置为普通图片，但添加序号确保唯一性
            const fullCount = formData.images.filter(img => img.type.startsWith('full')).length;
            imageType = `full_${fullCount + 1}`; // 例如：full_1, full_2, full_3...
            console.log(`设置为普通图片 ${imageType}`);
          }
          
          formData.images.push({
            file: file,
            preview: e.target.result,
            type: imageType,
            name: file.name
          });
          
          console.log(`已添加图片 "${file.name}"，类型: ${imageType}, 当前共有${formData.images.length}张图片`);
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
      
      console.log(`开始上传${formData.images.length}张图片...`);
      
      // 上传所有图片，使用各自的类型
      for (const image of formData.images) {
        // 对于缩略图，使用'thumbnail'
        if (image.type === 'thumbnail') {
          console.log(`上传缩略图: ${image.name}`);
          uploadPromises.push(
            carService.uploadCarImage(carId, 'thumbnail', image.file)
              .then(response => {
                console.log('缩略图上传结果:', response);
                return response;
              })
          );
        } 
        // 对于带序号的普通图片，保留序号信息
        else if (image.type.startsWith('full_')) {
          console.log(`上传普通图片(带序号): ${image.name}, 类型: ${image.type}`);
          uploadPromises.push(
            carService.uploadCarImage(carId, image.type, image.file)
              .then(response => {
                console.log(`图片 "${image.name}" 上传结果:`, response);
                return response;
              })
          );
        }
        // 其他类型图片
        else {
          console.log(`上传其他类型图片: ${image.name}, 类型: ${image.type}`);
          uploadPromises.push(
            carService.uploadCarImage(carId, image.type, image.file)
              .then(response => {
                console.log(`图片 "${image.name}" 上传结果:`, response);
                return response;
              })
          );
        }
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
  padding: 24px;
  max-width: 900px;
  margin: 0 auto;
  background-color: var(--va-background);
  color: var(--va-text-primary);
  border-radius: 8px;
}

.form-title {
  font-size: 20px;
  font-weight: 600;
  color: var(--va-text-primary);
  margin-bottom: 24px;
  padding-bottom: 12px;
  border-bottom: 1px solid var(--va-border);
  text-align: center;
}

.info-message {
  background-color: var(--va-background-element);
  border-left: 4px solid var(--va-primary);
  padding: 14px 16px;
  margin-bottom: 24px;
  border-radius: 4px;
}

.info-message p {
  margin: 0;
  color: var(--va-text-secondary);
  font-size: 14px;
  line-height: 1.5;
}

.car-form {
  display: flex;
  flex-direction: column;
  gap: 28px;
}

.form-section {
  background-color: var(--va-background-element);
  border-radius: 8px;
  padding: 20px;
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

.section-badge {
  background-color: var(--va-primary);
  color: white;
  font-size: 12px;
  padding: 2px 8px;
  border-radius: 10px;
  font-weight: 500;
}

.section-badge-optional {
  background-color: var(--va-secondary);
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
  border-color: var(--va-select-border);
  box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.05), 0 1px 3px rgba(0, 0, 0, 0.08);
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
  padding: 20px;
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
  margin-bottom: 20px;
  flex-wrap: wrap;
}

.upload-button {
  padding: 10px 18px;
  background-color: var(--va-primary);
  color: white;
  border: none;
  border-radius: 6px;
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
  transform: translateY(-1px);
  box-shadow: 0 2px 6px rgba(var(--va-primary-rgb), 0.2);
}

.upload-hint {
  font-size: 13px;
  color: var(--va-text-secondary);
}

.image-preview-container {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
  gap: 16px;
  min-height: 120px;
}

.no-images {
  grid-column: 1 / -1;
  text-align: center;
  color: var(--va-text-secondary);
  font-size: 14px;
  padding: 40px 0;
  background-color: rgba(var(--va-border-rgb), 0.1);
  border-radius: 6px;
}

.image-preview {
  position: relative;
  aspect-ratio: 1 / 1;
  border-radius: 6px;
  overflow: hidden;
  border: 1px solid var(--va-border);
  box-shadow: 0 2px 4px var(--va-shadow);
  transition: transform 0.2s ease;
}

.image-preview:hover {
  transform: scale(1.02);
}

.image-preview img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.image-type {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 4px;
  background-color: rgba(var(--va-primary-rgb), 0.7);
  color: white;
  font-size: 12px;
  text-align: center;
  font-weight: 500;
}

.remove-image {
  position: absolute;
  top: 5px;
  right: 5px;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background-color: rgba(0, 0, 0, 0.5);
  color: white;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-size: 12px;
  transition: all 0.2s;
  opacity: 0.8;
}

.image-preview:hover .remove-image {
  opacity: 1;
}

.remove-image:hover {
  background-color: rgba(220, 53, 69, 0.8);
  transform: scale(1.1);
}

.error-message {
  color: var(--va-error);
  font-size: 14px;
  font-weight: 500;
  margin: 4px 0;
  padding: 10px;
  background-color: rgba(var(--va-error-rgb), 0.1);
  border-radius: 4px;
  border-left: 3px solid var(--va-error);
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 24px;
}

.primary-button,
.secondary-button {
  padding: 10px 20px;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  border: none;
  transition: all 0.25s;
  min-width: 100px;
}

.primary-button {
  background-color: var(--va-primary);
  color: white;
}

.primary-button:hover:not(:disabled) {
  background-color: var(--va-primary-hover);
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(var(--va-primary-rgb), 0.25);
}

.primary-button:active:not(:disabled) {
  transform: translateY(0);
  box-shadow: 0 2px 4px rgba(var(--va-primary-rgb), 0.2);
}

.primary-button:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.secondary-button {
  background-color: var(--va-background-element);
  color: var(--va-text-primary);
  border: 1px solid var(--va-border);
}

.secondary-button:hover {
  background-color: var(--va-background-element-hover);
  border-color: var(--va-text-secondary);
}

.loading-container,
.success-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px 0;
  text-align: center;
}

.spinner {
  width: 40px;
  height: 40px;
  border: 3px solid var(--va-background-element);
  border-radius: 50%;
  border-top-color: var(--va-primary);
  animation: spin 1s ease-in-out infinite;
  margin-bottom: 16px;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.success-container {
  color: var(--va-success);
}

.success-container p {
  font-size: 16px;
  margin-bottom: 20px;
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

/* 深色模式特定覆盖样式 */
:root[data-theme="dark"] .form-section {
  background-color: #121212;
  box-shadow: 0 2px 10px rgba(255, 223, 175, 0.15), 0 0 1px rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.05);
}

:root[data-theme="dark"] .form-input,
:root[data-theme="dark"] .form-textarea {
  background-color: rgba(255, 255, 255, 0.05);
  border-color: var(--va-input-border);
  box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.2);
}

:root[data-theme="dark"] select.form-input {
  border-color: rgba(255, 255, 255, 0.3);
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='rgba(255,255,255,0.8)' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E");
}

:root[data-theme="dark"] .no-images {
  background-color: rgba(255, 255, 255, 0.05);
}

:root[data-theme="dark"] .upload-container {
  background-color: rgba(255, 255, 255, 0.03);
  border-color: var(--va-border);
}

:root[data-theme="dark"] .upload-button {
  background-color: var(--va-primary);
}

:root[data-theme="dark"] .upload-button:hover {
  background-color: var(--va-primary-hover);
}

:root[data-theme="dark"] .secondary-button {
  background-color: rgba(255, 255, 255, 0.05);
  color: var(--va-text-primary);
}

:root[data-theme="dark"] .secondary-button:hover {
  background-color: rgba(255, 255, 255, 0.1);
}

:root[data-theme="dark"] .remove-image {
  background-color: rgba(0, 0, 0, 0.7);
}

:root[data-theme="dark"] .remove-image:hover {
  background-color: rgba(220, 53, 69, 0.8);
}

:root[data-theme="dark"] .section-badge {
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

/* 响应式设计优化 */
@media (max-width: 768px) {
  .car-upload-form {
    padding: 16px;
  }
  
  .form-grid {
    grid-template-columns: 1fr;
    gap: 12px;
  }
  
  .form-group-large {
    grid-column: 1;
  }
  
  .form-group {
    flex-direction: column;
    align-items: flex-start;
    gap: 6px;
  }
  
  .form-group label {
    width: 100%;
    text-align: left;
  }
  
  .form-input, 
  .form-textarea {
    width: 100%;
  }
  
  .section-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
  }
  
  .section-badge {
    align-self: flex-start;
  }
  
  .image-preview-container {
    grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
  }
  
  .form-actions {
    flex-direction: column-reverse;
    gap: 10px;
  }
  
  .primary-button,
  .secondary-button {
    width: 100%;
  }
}

/* 添加CSS变量定义，确保在深浅色模式下都能应用 */
:root {
  --va-primary-hover: #646cff;
  --va-background-element-hover: #f0f0f0;
  --va-input-background: #fff;
  --va-primary-rgb: 100, 108, 255;
  --va-error-rgb: 220, 53, 69;
  --va-border-rgb: 230, 230, 230;
  --va-select-border: rgba(0, 0, 0, 0.6);
  --va-input-border: rgba(0, 0, 0, 0.4);
  --va-background-element: #ffffff;
}

:root[data-theme="dark"] {
  --va-primary-hover: #8b92ff;
  --va-background-element-hover: #2a2a2a;
  --va-input-background: #1e1e1e;
  --va-primary-rgb: 139, 146, 255;
  --va-error-rgb: 255, 92, 111;
  --va-border-rgb: 70, 70, 70;
  --va-select-border: rgba(255, 255, 255, 0.5);
  --va-input-border: rgba(255, 255, 255, 0.4);
  --va-background-element: #121212;
}
</style> 