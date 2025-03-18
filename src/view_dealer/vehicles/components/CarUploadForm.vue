<template>
  <modal-dialog
    v-model="showModal"
    :title="'车辆信息上传'"
    :confirm-text="loading ? '上传中...' : '提交'"
    :cancel-text="success ? '关闭' : '取消'"
    :loading="loading"
    @confirm="submitCarInfo"
    @cancel="$emit('close')"
  >
    <!-- 成功提示 -->
    <div v-if="success" class="success-container">
      <p>{{ successMessage }}</p>
    </div>
    
    <!-- 表单内容 -->
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
              <button type="button" class="upload-button" @click.stop.prevent="triggerFileInput">
                <i class="fa fa-upload"></i> 选择图片
              </button>
              <input 
                type="file" 
                id="car-image-upload" 
                ref="fileInput"
                @change="handleFileSelect" 
                accept="image/jpeg,image/png,image/gif"
                multiple
                class="hidden-input"
              />
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
      </form>
    </div>
  </modal-dialog>
</template>

<script>
import { ref, reactive } from 'vue';
import carService from '@api/carService';
import { 
  CAR_CATEGORIES, 
  CAR_BRANDS, 
  FUEL_TYPES, 
  IMAGE_TYPES 
} from '@/constants/carEnums';
import ModalDialog from '@components/modelwindow/ModalDialog.vue';

export default {
  name: 'CarUploadFormNew',
  
  components: {
    ModalDialog
  },
  
  emits: ['close', 'success'],
  
  setup(props, { emit }) {
    const showModal = ref(true);
    const loading = ref(false);
    const error = ref('');
    const success = ref(false);
    const successMessage = ref('');
    const fileInput = ref(null);
    
    // 触发文件选择
    const triggerFileInput = () => {
      fileInput.value.click();
    };
    
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
      
      // 上传前先验证车辆所属权
      try {
        await verifyCarOwnership(carId);
      } catch (err) {
        console.error('验证车辆所属权失败:', err);
        throw new Error('无法上传图片：' + err.message);
      }
      
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
    
    // 验证车辆所属权
    const verifyCarOwnership = async (carId) => {
      try {
        // 获取当前用户经销商ID
        const userInfoStr = localStorage.getItem('userInfo');
        if (!userInfoStr) {
          throw new Error('用户未登录，请先登录');
        }
        
        const userInfo = JSON.parse(userInfoStr);
        if (!userInfo.dealerId) {
          throw new Error('当前用户没有关联经销商信息，请完成经销商认证');
        }
        
        // 获取车辆详情以验证所属权
        const response = await carService.getCarDetail(carId);
        if (response.success && response.data && response.data.basic) {
          const carDealerId = response.data.basic.dealerId;
          if (userInfo.dealerId !== carDealerId) {
            throw new Error('您不是该车辆的经销商，无权操作此车辆');
          }
        }
        
        return true;
      } catch (err) {
        console.error('验证车辆所属权失败:', err);
        throw err;
      }
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
        // 获取经销商ID
        let dealerId = null;
        
        // 从localStorage获取用户信息
        const userInfoStr = localStorage.getItem('userInfo');
        if (!userInfoStr) {
          throw new Error('用户未登录，请先登录');
        }
        
        const userInfo = JSON.parse(userInfoStr);
        if (!userInfo.dealerId) {
          throw new Error('未找到经销商信息，请确保您已完成经销商认证');
        }
        
        dealerId = userInfo.dealerId;
        console.log('使用经销商ID:', dealerId);
        
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
      showModal,
      ...carEnums, // 展开枚举值
      loading,
      error,
      success,
      successMessage,
      formData,
      fileInput,
      triggerFileInput,
      handleFileSelect,
      removeImage,
      validateForm,
      submitCarInfo
    };
  }
}
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
  padding: 10px 20px;
  background-color: var(--va-primary);
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 15px;
  font-weight: 600;
  transition: all 0.2s ease;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.upload-button:hover {
  background-color: var(--va-primary-hover);
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

.upload-button:active {
  transform: translateY(0);
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
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

.image-type {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 2px 4px;
  background-color: rgba(var(--va-primary-rgb), 0.7);
  color: white;
  font-size: 12px;
  text-align: center;
  font-weight: 500;
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

.error-message {
  color: var(--va-error);
  font-size: 14px;
  padding: 8px 12px;
  background-color: rgba(var(--va-error-rgb), 0.1);
  border-radius: 4px;
  border-left: 3px solid var(--va-error);
}

.success-container {
  text-align: center;
  padding: 20px 0;
}

.success-container p {
  color: var(--va-success);
  font-size: 16px;
  margin: 0;
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

/* 深色模式支持 */
:root[data-theme="dark"] {
  /* 深色模式下的变量覆盖 */
  --va-background-element: #333333;
  --va-shadow: rgba(0, 0, 0, 0.3);
  --va-text-primary: #ffffff; /* 改为纯白色，增加对比度 */
  --va-text-secondary: #e0e0e0; /* 改为更亮的灰色，增加对比度 */
  --va-input-border: #555555;
  --va-input-background: #444444;
  --va-border: #555555;
  
  /* 确保按钮和其他关键元素在深色模式下依然可见 */
  .upload-button {
    background-color: var(--va-primary);
    color: white;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
  }
  
  .upload-button:hover {
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.4);
  }
  
  /* 表单元素样式调整 */
  .form-input,
  .form-textarea {
    background-color: #444444;
    color: #ffffff; /* 改为纯白色，增加对比度 */
    border-color: #555555;
  }
  
  .form-input:focus,
  .form-textarea:focus {
    border-color: var(--va-primary);
    box-shadow: 0 0 0 2px rgba(var(--va-primary-rgb), 0.25), inset 0 1px 3px rgba(0, 0, 0, 0.15);
  }
  
  /* 标签文字颜色 */
  .form-group label {
    color: #ffffff; /* 改为纯白色，增加对比度 */
  }
  
  /* 表单部分背景 */
  .form-section {
    background-color: #333333;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
  }
  
  /* 信息提示 */
  .info-message {
    background-color: rgba(var(--va-primary-rgb), 0.15);
  }
  
  .info-message p {
    color: #ffffff; /* 改为纯白色，增加对比度 */
  }
  
  /* 错误信息 */
  .error-message {
    background-color: rgba(var(--va-error-rgb), 0.15);
    color: #ff6b6b; /* 使用更亮的红色，增加对比度 */
  }
  
  /* 上传提示文字 */
  .upload-tip p, .upload-hint {
    color: #ffffff; /* 改为纯白色，增加对比度 */
  }
  
  /* 图片上传容器 */
  .upload-container {
    background-color: #333333;
    border-color: #555555;
  }
  
  /* 图片预览 */
  .image-preview {
    border-color: #555555;
    background-color: #222222;
  }
  
  /* 无图片提示 */
  .no-images {
    background-color: rgba(85, 85, 85, 0.2);
    color: #ffffff; /* 改为纯白色，增加对比度 */
  }
  
  /* 成功容器 */
  .success-container p {
    color: #4caf50;
  }
  
  /* 徽章样式调整 */
  .section-badge {
    color: #000000;
  }
  
  /* 下拉菜单选项 */
  select.form-input option {
    background-color: #444444;
    color: #ffffff;
  }
  
  /* 标题文字 */
  .section-title {
    color: #ffffff; /* 改为纯白色，增加对比度 */
  }
  
  /* 下拉选择框图标颜色调整 */
  select.form-input {
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%23ffffff' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E");
  }
}
</style> 