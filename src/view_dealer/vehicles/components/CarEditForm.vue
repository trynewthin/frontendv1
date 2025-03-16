<template>
  <div class="car-edit-form">
    <h3 class="form-title">编辑车辆信息</h3>
    
    <div v-if="loading" class="loading-container">
      <div class="spinner"></div>
      <p>正在加载车辆信息...</p>
    </div>
    
    <div v-else-if="success" class="success-container">
      <p>{{ successMessage }}</p>
      <div class="action-buttons">
        <button class="primary-button" @click="$emit('close')">关闭</button>
      </div>
    </div>
    
    <div v-else-if="error" class="error-container">
      <p class="error-title">加载失败</p>
      <p class="error-message">{{ error }}</p>
      <div class="action-buttons">
        <button class="secondary-button" @click="$emit('close')">关闭</button>
        <button class="primary-button" @click="loadCarData">重试</button>
      </div>
    </div>
    
    <div v-else>
      <div class="info-message">
        <p>请修改车辆信息，所有带 * 的字段为必填项。</p>
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
        
        <!-- 图片管理部分 -->
        <div class="form-section">
          <h4 class="section-title">车辆图片</h4>
          
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
        
        <div class="error-message" v-if="error">
          {{ error }}
        </div>
        
        <div class="action-buttons">
          <button type="button" class="secondary-button" @click="$emit('close')">取消</button>
          <button type="submit" class="primary-button" :disabled="loading">保存修改</button>
        </div>
      </form>
    </div>
  </div>
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

export default {
  name: 'CarEditForm',
  
  props: {
    carId: {
      type: Number,
      required: true
    }
  },
  
  emits: ['close', 'success'],
  
  setup(props, { emit }) {
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
        console.log('车辆数据:', carData);
        
        // 填充基本信息
        formData.brand = carData.brand || '';
        formData.model = carData.model || '';
        formData.year = carData.year || new Date().getFullYear();
        formData.price = carData.price ? (carData.price / 10000).toFixed(1) : ''; // 转换为万元
        formData.category = carData.category || '';
        formData.mileage = carData.mileage || '';
        
        // 填充详细信息
        if (carData.detail) {
          console.log('车辆详细信息:', carData.detail);
          
          // 确保所有字段都被正确提取
          formData.color = carData.detail.color || '';
          formData.engineType = carData.detail.engine || '';
          formData.transmission = carData.detail.transmission || '';
          formData.fuelType = carData.detail.fuelType || '';
          formData.seats = carData.detail.seats ? carData.detail.seats.toString() : '';
          formData.bodySize = carData.detail.bodySize || '';
          formData.wheelbase = carData.detail.wheelbase ? carData.detail.wheelbase.toString() : '';
          formData.features = carData.detail.features || '';
          
          // 特别检查保修信息字段
          if (carData.detail.warranty) {
            formData.warranty = carData.detail.warranty;
            console.log('已加载保修信息:', formData.warranty);
          } else {
            console.log('API返回数据中没有保修信息');
          }
          
          formData.description = carData.detail.description || '';
        } else if (typeof carData.detail === 'undefined') {
          console.warn('API返回的数据中没有detail字段');
          
          // 尝试从主对象获取详细信息
          formData.color = carData.color || '';
          formData.engineType = carData.engine || '';
          formData.transmission = carData.transmission || '';
          formData.fuelType = carData.fuelType || '';
          formData.seats = carData.seats ? carData.seats.toString() : '';
          formData.bodySize = carData.bodySize || '';
          formData.wheelbase = carData.wheelbase ? carData.wheelbase.toString() : '';
          formData.features = carData.features || '';
          formData.warranty = carData.warranty || '';
          formData.description = carData.description || '';
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
        console.log('获取车辆图片API响应:', imagesResponse);
        
        if (imagesResponse.success) {
          existingImages.value = imagesResponse.data || [];
          console.log('成功加载车辆图片:', existingImages.value.length, '张');
          
          // 处理图片URL，确保所有图片都有正确的URL
          existingImages.value = existingImages.value.map(img => {
            console.log('处理图片:', img);
            
            // 如果没有fullUrl字段，但有url字段
            if (!img.fullUrl && img.url) {
              if (img.url.startsWith('http')) {
                img.fullUrl = img.url;
              } else {
                img.fullUrl = `${import.meta.env.VITE_API_IMAGE_URL || 'http://localhost:8090'}${img.url}`;
              }
              console.log('生成fullUrl:', img.fullUrl);
            }
            
            // 如果既没有fullUrl也没有url，但有imageUrl
            if (!img.fullUrl && !img.url && img.imageUrl) {
              if (img.imageUrl.startsWith('http')) {
                img.fullUrl = img.imageUrl;
              } else {
                img.fullUrl = `${import.meta.env.VITE_API_IMAGE_URL || 'http://localhost:8090'}${img.imageUrl}`;
              }
              console.log('从imageUrl生成fullUrl:', img.fullUrl);
            }
            
            return img;
          });
          
          // 检查处理后的图片是否都有fullUrl
          console.log('处理后的图片列表:', existingImages.value);
          const missingUrls = existingImages.value.filter(img => !img.fullUrl);
          if (missingUrls.length > 0) {
            console.warn(`${missingUrls.length}张图片缺少fullUrl:`, missingUrls);
          }
        } else {
          console.warn('获取车辆图片失败:', imagesResponse.message);
          // 不中断表单加载流程，将作为警告显示
          error.value = `获取车辆图片失败: ${imagesResponse.message}`;
          setTimeout(() => {
            if (error.value.startsWith('获取车辆图片失败')) {
              error.value = '';
            }
          }, 3000);
        }
      } catch (err) {
        console.error('加载车辆图片失败:', err);
        // 不阻止表单加载，显示警告
        error.value = '图片加载失败，您仍可以编辑其他信息';
        setTimeout(() => {
          if (error.value === '图片加载失败，您仍可以编辑其他信息') {
            error.value = '';
          }
        }, 3000);
      }
    };
    
    // 处理删除现有图片
    const handleDeleteExistingImage = async (image) => {
      try {
        if (!confirm('确定要删除这张图片吗？此操作不可恢复。')) {
          return;
        }
        
        // 使用临时变量记录当前loading状态，确保界面不会闪烁
        const tempLoading = loading.value;
        loading.value = true;
        
        // 如果图片有ID，标记为需要删除
        if (image.imageId) {
          // 添加到待删除列表
          imagesToDelete.value.push(image.imageId);
          // 从现有图片中移除显示
          existingImages.value = existingImages.value.filter(img => img.imageId !== image.imageId);
          console.log(`已标记图片#${image.imageId}为待删除`);
        }
        
        // 恢复原来的loading状态
        loading.value = tempLoading;
      } catch (err) {
        console.error('标记删除图片失败:', err);
        error.value = '标记删除图片失败，请稍后重试';
        setTimeout(() => {
          if (error.value === '标记删除图片失败，请稍后重试') {
            error.value = '';
          }
        }, 3000);
      }
    };
    
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
          
          // 检查是否已经存在缩略图（包括已有图片和新上传图片）
          const hasThumbnail = existingImages.value.some(img => img.type === 'thumbnail') || 
                             formData.images.some(img => img.type === 'thumbnail');
          
          if (!hasThumbnail) {
            // 如果没有缩略图，则第一张为缩略图
            imageType = 'thumbnail';
            console.log('设置为缩略图');
          } else {
            // 其他图片设置为普通图片，但添加序号确保唯一性
            const fullCount = [...existingImages.value, ...formData.images]
              .filter(img => img.type && img.type.startsWith('full')).length;
            imageType = `full_${fullCount + 1}`; // 例如：full_1, full_2, full_3...
            console.log(`设置为普通图片 ${imageType}`);
          }
          
          formData.images.push({
            file: file,
            preview: e.target.result,
            type: imageType,
            name: file.name
          });
          
          console.log(`已添加图片 "${file.name}"，类型: ${imageType}, 当前共有${formData.images.length}张新图片`);
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
    
    // 上传新图片
    const uploadImages = async (carId) => {
      const uploadPromises = [];
      
      console.log(`开始上传${formData.images.length}张图片...`);
      
      // 先检查现有图片中是否已有缩略图
      const hasExistingThumbnail = existingImages.value.some(img => img.type === 'thumbnail');
      
      // 对新上传的图片进行处理
      for (const image of formData.images) {
        let uploadType = image.type;
        
        // 如果已有缩略图但新图也是缩略图，则将其上传为普通图片
        if (hasExistingThumbnail && uploadType === 'thumbnail') {
          // 生成一个新的full_x类型
          const fullCount = existingImages.value.filter(img => img.type && img.type.startsWith('full')).length;
          uploadType = `full_${fullCount + 1}`;
          console.log(`已有缩略图，将图片 "${image.name}" 改为普通图片类型: ${uploadType}`);
        }
        
        console.log(`上传图片: ${image.name}, 类型: ${uploadType}`);
        uploadPromises.push(
          carService.uploadCarImage(carId, uploadType, image.file)
            .then(response => {
              console.log(`图片 "${image.name}" 上传结果:`, response);
              return response;
            })
        );
      }
      
      return Promise.all(uploadPromises);
    };
    
    // 删除标记的现有图片
    const deleteMarkedImages = async () => {
      const deletePromises = [];
      
      for (const imageId of imagesToDelete.value) {
        console.log(`正在删除图片 #${imageId}...`);
        deletePromises.push(
          carService.deleteCarImage(props.carId, imageId)
            .then(response => {
              console.log(`图片 #${imageId} 删除结果:`, response);
              return response;
            })
        );
      }
      
      return Promise.all(deletePromises);
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
        // 更新车辆基本信息
        const carData = {
          brand: formData.brand,
          model: formData.model,
          year: parseInt(formData.year),
          price: parseFloat(formData.price) * 10000, // 转换为元
          category: formData.category
        };
        
        console.log('提交的车辆更新数据:', carData);
        
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
        
        const detailResponse = await carService.updateCarDetail(props.carId, detailData);
        
        if (!detailResponse.success) {
          console.warn('更新车辆详细信息失败:', detailResponse.message);
          // 继续执行，不中断流程
        }
        
        // 删除标记的图片
        if (imagesToDelete.value.length > 0) {
          const deleteResults = await deleteMarkedImages();
          console.log('删除图片结果:', deleteResults);
        }
        
        // 如果有新图片，上传图片
        if (formData.images.length > 0) {
          const imageResults = await uploadImages(props.carId);
          console.log('图片上传结果:', imageResults);
        }
        
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
      ...carEnums, // 展开枚举值
      loading,
      error,
      success,
      successMessage,
      formData,
      existingImages,
      dataLoaded,
      loadCarData,
      handleFileSelect,
      removeImage,
      handleDeleteExistingImage,
      validateForm,
      submitCarInfo
    };
  }
}
</script>

<style scoped>
.car-edit-form {
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

.form-input,
.form-textarea {
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
  transition: border-color 0.3s;
}

.form-input:focus,
.form-textarea:focus {
  border-color: var(--va-primary);
  outline: none;
}

.form-textarea {
  resize: vertical;
  min-height: 100px;
}

.required {
  color: #e53935;
}

.upload-container {
  margin-top: 10px;
}

.upload-tip {
  margin-bottom: 10px;
}

.upload-tip p {
  font-size: 14px;
  color: #666;
  margin: 0;
}

.upload-button-container {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 15px;
}

.upload-button {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  padding: 8px 15px;
  background-color: #1976d2;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  transition: background-color 0.3s;
}

.upload-button:hover {
  background-color: #1565c0;
}

.hidden-input {
  display: none;
}

.upload-hint {
  font-size: 12px;
  color: #666;
}

.image-preview-container {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-top: 10px;
}

.no-images {
  font-style: italic;
  color: #888;
  width: 100%;
  text-align: center;
  padding: 20px 0;
}

.image-preview {
  position: relative;
  width: 120px;
  height: 120px;
  border: 1px solid #ddd;
  border-radius: 4px;
  overflow: hidden;
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
  transition: background-color 0.3s;
}

.remove-image:hover {
  background-color: rgba(0, 0, 0, 0.7);
}

.spinner {
  width: 40px;
  height: 40px;
  border: 4px solid rgba(0, 0, 0, 0.1);
  border-left-color: var(--va-primary);
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto 15px;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.loading-container,
.success-container {
  text-align: center;
  padding: 40px 20px;
}

.loading-container p,
.success-container p {
  margin: 0;
  color: #666;
}

.success-container p {
  font-size: 16px;
  color: #4caf50;
  margin-bottom: 20px;
}

.error-message {
  color: #e53935;
  padding: 10px;
  border-radius: 4px;
  background-color: #ffebee;
  margin-bottom: 15px;
}

.action-buttons {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}

.primary-button,
.secondary-button {
  padding: 8px 16px;
  border-radius: 4px;
  border: none;
  font-size: 14px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.primary-button {
  background-color: #1976d2;
  color: white;
}

.primary-button:hover {
  background-color: #1565c0;
}

.primary-button:disabled {
  background-color: #bbdefb;
  cursor: not-allowed;
}

.secondary-button {
  background-color: #e0e0e0;
  color: #333;
}

.secondary-button:hover {
  background-color: #bdbdbd;
}

/* 响应式调整 */
@media (max-width: 768px) {
  .form-row {
    flex-direction: column;
    gap: 0;
  }
  
  .image-preview {
    width: 100px;
    height: 100px;
  }
}

.error-container {
  text-align: center;
  padding: 40px 20px;
  background-color: #ffebee;
  border-radius: 8px;
  margin-bottom: 20px;
}

.error-title {
  font-size: 18px;
  color: #d32f2f;
  margin-bottom: 10px;
  font-weight: bold;
}

.error-message {
  color: #e53935;
  margin-bottom: 20px;
}
</style> 