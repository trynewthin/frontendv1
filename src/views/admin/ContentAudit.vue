<template>
  <div class="content-audit-page">
    <va-card class="mb-4">
      <va-card-title>
        车辆审核管理
      </va-card-title>
      <va-card-content>
        <!-- 加载状态 -->
        <div v-if="loading" class="text-center py-5">
          <va-progress-circle indeterminate color="primary" />
          <div class="mt-3">正在加载车辆数据...</div>
        </div>

        <!-- 数据表格 -->
        <div v-else>
          <!-- 使用原生表格 -->
          <table class="car-audit-table" v-if="displayedAudits.length > 0">
            <thead>
              <tr>
                <th width="80" class="text-center">ID</th>
                <th width="120">品牌</th>
                <th>型号</th>
                <th width="180">创建时间</th>
                <th width="100" class="text-center">状态</th>
                <th width="200" class="text-center">操作</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="item in displayedAudits" :key="item.carId" class="car-row">
                <!-- ID列 -->
                <td class="text-center font-weight-bold">{{ item.carId || '暂无ID' }}</td>
                
                <!-- 品牌列 -->
                <td class="font-weight-bold">{{ formatBrand(item.brand) || '暂无品牌' }}</td>
                
                <!-- 型号列 -->
                <td>
                  <div>{{ item.model || '暂无型号' }}</div>
                  <div v-if="item.year || item.price" class="text-gray text-sm">
                    {{ item.year || '' }}年 {{ item.price ? `· ${formatPrice(item.price)}` : '' }}
                  </div>
                </td>
                
                <!-- 创建时间列 -->
                <td>{{ formatDate(item.createTime) || '无日期' }}</td>
                
                <!-- 状态列 -->
                <td class="text-center">
                  <va-badge
                    :color="getStatusColor(item.status)"
                    :text="formatAuditStatus(item.status)"
                  />
                </td>
                
                <!-- 操作列 -->
                <td class="text-center">
                  <div class="d-flex justify-center">
                    <va-button 
                      v-if="item.status === 0" 
                      small 
                      color="success" 
                      class="ma-1"
                      @click="handleApprove(item.carId)"
                    >
                      通过
                    </va-button>
                    <va-button 
                      v-if="item.status === 0" 
                      small 
                      color="danger" 
                      class="ma-1"
                      @click="showRejectDialog(item.carId)"
                    >
                      拒绝
                    </va-button>
                    <va-button 
                      small 
                      color="info" 
                      class="ma-1"
                      @click="viewCarDetails(item.carId)"
                    >
                      查看
                    </va-button>
                    <va-button 
                      small 
                      color="primary" 
                      class="ma-1"
                      @click="showCarPreview(item)"
                    >
                      预览
                    </va-button>
                    <va-button 
                      small 
                      color="warning" 
                      class="ma-1"
                      @click="showEditDialog(item)"
                    >
                      编辑
                    </va-button>
                    <va-button 
                      small 
                      color="danger" 
                      class="ma-1"
                      @click="showDeleteConfirm(item.carId)"
                    >
                      删除
                    </va-button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
          
          <!-- 空数据时的提示 -->
          <div v-else class="text-center pa-5">
            <va-icon name="inbox" size="50" color="gray" />
            <div class="mt-3">暂无审核数据</div>
            <va-button class="mt-4" @click="loadCarAudits">重新加载</va-button>
          </div>
        </div>

        <!-- 分页控件 -->
        <div v-if="pagination.total > 0" class="d-flex justify-end">
          <va-pagination
            v-model="pagination.currentPage"
            :pages="Math.ceil(pagination.total / pagination.pageSize)"
            :visible-pages="5"
            @update:modelValue="handlePageChange"
          />
        </div>
      </va-card-content>
    </va-card>

    <!-- 车辆预览对话框 -->
    <va-modal v-model="previewDialog.show" title="车辆预览" size="large" hide-default-actions>
      <div class="car-preview-container" v-if="previewDialog.car">
        <div class="car-preview-header">
          <h2 class="car-preview-title">{{ formatBrand(previewDialog.car.brand) }} {{ previewDialog.car.model }} {{ previewDialog.car.year }}</h2>
          <va-badge
            :color="getStatusColor(previewDialog.car.status)"
            :text="formatAuditStatus(previewDialog.car.status)"
          />
        </div>
        
        <!-- 车辆图片区域 -->
        <div class="car-preview-images" v-if="previewDialog.car.images && previewDialog.car.images.length > 0">
          <img 
            :src="getImageUrl(previewDialog.car.images[0])" 
            :alt="previewDialog.car.model"
            class="preview-main-image" 
          />
        </div>

        <!-- 基本信息 -->
        <div class="car-preview-info">
          <div class="car-preview-section">
            <h3 class="section-title">基本信息</h3>
            <div class="info-grid">
              <div class="info-item">
                <span class="info-label">ID:</span>
                <span class="info-value">{{ previewDialog.car.carId || '暂无' }}</span>
              </div>
              <div class="info-item">
                <span class="info-label">品牌:</span>
                <span class="info-value">{{ formatBrand(previewDialog.car.brand) || '暂无' }}</span>
              </div>
              <div class="info-item">
                <span class="info-label">型号:</span>
                <span class="info-value">{{ previewDialog.car.model || '暂无' }}</span>
              </div>
              <div class="info-item">
                <span class="info-label">年份:</span>
                <span class="info-value">{{ previewDialog.car.year || '暂无' }}</span>
              </div>
              <div class="info-item">
                <span class="info-label">价格:</span>
                <span class="info-value price">{{ formatPrice(previewDialog.car.price) }}</span>
              </div>
              <div class="info-item">
                <span class="info-label">创建时间:</span>
                <span class="info-value">{{ formatDate(previewDialog.car.createTime) }}</span>
              </div>
            </div>
          </div>
          
          <!-- 详细参数 -->
          <div class="car-preview-section" v-if="previewDialog.car.detail">
            <h3 class="section-title">详细参数</h3>
            <div class="info-grid">
              <div class="info-item" v-if="previewDialog.car.detail.engine">
                <span class="info-label">发动机:</span>
                <span class="info-value">{{ previewDialog.car.detail.engine }}</span>
              </div>
              <div class="info-item" v-if="previewDialog.car.detail.transmission">
                <span class="info-label">变速箱:</span>
                <span class="info-value">{{ previewDialog.car.detail.transmission }}</span>
              </div>
              <div class="info-item" v-if="previewDialog.car.detail.fuelType">
                <span class="info-label">燃油类型:</span>
                <span class="info-value">{{ previewDialog.car.detail.fuelType }}</span>
              </div>
              <div class="info-item" v-if="previewDialog.car.detail.color">
                <span class="info-label">颜色:</span>
                <span class="info-value">{{ previewDialog.car.detail.color }}</span>
              </div>
              <div class="info-item" v-if="previewDialog.car.detail.seats">
                <span class="info-label">座位数:</span>
                <span class="info-value">{{ previewDialog.car.detail.seats }}</span>
              </div>
              <div class="info-item" v-if="previewDialog.car.detail.mileage">
                <span class="info-label">里程数:</span>
                <span class="info-value">{{ previewDialog.car.detail.mileage }} 公里</span>
              </div>
            </div>
          </div>
          
          <div class="car-card-container">
            <car-card 
              :car="previewDialog.car"
              :showImage="true"
              :showStatus="true"
              :showPrice="true"
              :showModelBrand="true"
              :showMeta="true"
            />
          </div>
        </div>
      </div>
      <div class="d-flex justify-end mt-4">
        <va-button 
          color="primary" 
          @click="previewDialog.show = false"
        >
          关闭
        </va-button>
      </div>
    </va-modal>

    <!-- 拒绝原因对话框 -->
    <va-modal v-model="rejectDialog.show" title="拒绝原因" hide-default-actions>
      <va-form>
        <va-form-item label="请输入拒绝原因">
          <va-textarea 
            v-model="rejectDialog.reason" 
            rows="4" 
            placeholder="请输入拒绝原因"
          />
        </va-form-item>
      </va-form>
      <div class="d-flex justify-end mt-4">
        <va-button 
          color="gray" 
          class="mr-3" 
          @click="rejectDialog.show = false"
        >
          取消
        </va-button>
        <va-button 
          color="danger" 
          :loading="rejectDialog.loading" 
          @click="handleReject"
        >
          确认拒绝
        </va-button>
      </div>
    </va-modal>

    <!-- 编辑车辆对话框 -->
    <va-modal v-model="editDialog.show" title="编辑车辆信息" size="medium" hide-default-actions>
      <va-form class="edit-form">
        <va-form-item label="品牌">
          <va-input v-model="editDialog.car.brand" />
        </va-form-item>
        <va-form-item label="型号">
          <va-input v-model="editDialog.car.model" />
        </va-form-item>
        <va-form-item label="年份">
          <va-input type="number" v-model="editDialog.car.year" />
        </va-form-item>
        <va-form-item label="价格">
          <va-input type="number" v-model="editDialog.car.price" />
        </va-form-item>
        <va-form-item label="类别">
          <va-input v-model="editDialog.car.category" />
        </va-form-item>
      </va-form>
      <div class="d-flex justify-end mt-4">
        <va-button 
          color="gray" 
          class="mr-3" 
          @click="editDialog.show = false"
        >
          取消
        </va-button>
        <va-button 
          color="primary" 
          :loading="editDialog.loading" 
          @click="handleSaveEdit"
        >
          保存
        </va-button>
      </div>
    </va-modal>

    <!-- 删除确认对话框 -->
    <va-modal v-model="deleteDialog.show" title="确认删除" hide-default-actions>
      <p>确定要删除ID为 {{ deleteDialog.carId }} 的车辆信息吗？此操作不可恢复。</p>
      <div class="d-flex justify-end mt-4">
        <va-button 
          color="gray" 
          class="mr-3" 
          @click="deleteDialog.show = false"
        >
          取消
        </va-button>
        <va-button 
          color="danger" 
          :loading="deleteDialog.loading" 
          @click="handleDelete"
        >
          确认删除
        </va-button>
      </div>
    </va-modal>
  </div>
</template>

<script>
import { ref, reactive, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import carService from '@/api/carService';
import contentAuditService from '@/api/contentAuditService';
import carEnums from '@/constants/carEnums';
import dealerEnums from '@/constants/dealerEnums';
import { useToast } from 'vuestic-ui';
import CarCard from '@/components/car/CarCard.vue';

export default {
  name: 'ContentAudit',
  components: {
    CarCard
  },
  setup() {
    const router = useRouter();
    const { init: initToast } = useToast();
    
    // 解构导入的枚举
    const { CAR_BRANDS } = carEnums;
    const { DEALER_VERIFY_STATUS } = dealerEnums;
    
    // 表格数据
    const carAudits = ref([]);
    const loading = ref(false);

    // 分页信息
    const pagination = reactive({
      currentPage: 1,
      pageSize: 20,
      total: 0
    });

    // 计算显示的数据
    const displayedAudits = computed(() => {
      const result = [...carAudits.value];
      
      // 更新总数
      pagination.total = result.length;
      
      // 分页
      const startIndex = (pagination.currentPage - 1) * pagination.pageSize;
      return result.slice(startIndex, startIndex + pagination.pageSize);
    });

    // 拒绝对话框
    const rejectDialog = reactive({
      show: false,
      carId: null,
      reason: '',
      loading: false
    });

    // 车辆预览对话框
    const previewDialog = reactive({
      show: false,
      car: null
    });

    // 编辑对话框
    const editDialog = reactive({
      show: false,
      car: {},
      loading: false
    });

    // 删除对话框
    const deleteDialog = reactive({
      show: false,
      carId: null,
      loading: false
    });

    // 加载车辆审核列表
    const loadCarAudits = async () => {
      loading.value = true;
      carAudits.value = []; // 清空现有数据
      
      try {
        // 获取所有数据
        const response = await carService.getCars({
          page: 1,
          size: 1000 // 设置较大的值以获取所有数据
        });
        
        if (response?.success) {
          // 识别API返回的数据结构
          let cars = [];
          
          if (response.data && Array.isArray(response.data)) {
            cars = response.data;
          } else if (response.data?.cars && Array.isArray(response.data.cars)) {
            cars = response.data.cars;
          } else if (response.data?.list && Array.isArray(response.data.list)) {
            cars = response.data.list;
          } else if (response.data?.content && Array.isArray(response.data.content)) {
            cars = response.data.content;
          }
          
          if (cars.length > 0) {
            // 直接使用原始数据赋值给carAudits
            carAudits.value = cars;
            
            // 设置总数
            pagination.total = response.data?.total || cars.length;
            
            // 成功提示
            initToast({
              message: `成功加载${cars.length}条车辆数据`,
              color: 'success',
              timeout: 3000
            });
          } else {
            initToast({
              message: '暂无车辆数据',
              color: 'info',
              timeout: 3000
            });
          }
        } else {
          carAudits.value = [];
          initToast({
            message: response?.message || '获取车辆列表失败',
            color: 'danger',
            timeout: 3000
          });
        }
      } catch (error) {
        console.error('加载车辆列表失败:', error);
        carAudits.value = [];
        initToast({
          message: '加载车辆列表失败: ' + (error.message || '未知错误'),
          color: 'danger',
          timeout: 3000
        });
      } finally {
        loading.value = false;
      }
    };

    // 处理分页
    const handlePageChange = (page) => {
      pagination.currentPage = page;
    };

    // 显示拒绝对话框
    const showRejectDialog = (carId) => {
      rejectDialog.carId = carId;
      rejectDialog.reason = '';
      rejectDialog.show = true;
    };

    // 显示车辆预览
    const showCarPreview = async (car) => {
      try {
        // 开启加载状态
        loading.value = true;
        
        // 尝试获取更详细的车辆信息
        const detailResponse = await carService.getCarDetail(car.carId);
        
        if (detailResponse.success && detailResponse.data) {
          // 使用更详细的数据
          const detailedCar = { ...car, ...detailResponse.data };
          
          // 如果有嵌套结构，合并它们
          if (detailResponse.data.basic) {
            Object.assign(detailedCar, detailResponse.data.basic);
          }
          
          if (detailResponse.data.detail) {
            detailedCar.detail = detailResponse.data.detail;
          }
          
          // 更新图片
          if (detailResponse.data.images && Array.isArray(detailResponse.data.images)) {
            detailedCar.images = detailResponse.data.images;
          } else {
            // 如果详细数据中没有图片，尝试单独获取
            try {
              const imagesResponse = await carService.getCarImages(car.carId);
              if (imagesResponse.success && imagesResponse.data) {
                detailedCar.images = imagesResponse.data;
              }
            } catch (imgError) {
              console.error('获取车辆图片失败:', imgError);
            }
          }
          
          // 显示弹窗
          previewDialog.car = detailedCar;
        } else {
          // 如果获取详情失败，就使用原始数据
          previewDialog.car = car;
        }
      } catch (error) {
        console.error('获取车辆详情失败:', error);
        // 如果获取详情失败，就使用原始数据
        previewDialog.car = car;
      } finally {
        loading.value = false;
        previewDialog.show = true;
      }
    };

    // 处理通过
    const handleApprove = async (carId) => {
      try {
        loading.value = true;
        // 使用contentAuditService.auditCar方法
        // 状态1表示通过
        const response = await contentAuditService.auditCar(carId, 1);
        if (response.success) {
          initToast({
            message: '审核通过成功',
            color: 'success',
            timeout: 3000
          });
          await loadCarAudits();
        } else {
          initToast({
            message: response.message || '审核通过失败',
            color: 'danger',
            timeout: 3000
          });
        }
      } catch (error) {
        console.error('审核通过失败:', error);
        initToast({
          message: '审核通过失败: ' + (error.message || '未知错误'),
          color: 'danger',
          timeout: 3000
        });
      } finally {
        loading.value = false;
      }
    };

    // 处理拒绝
    const handleReject = async () => {
      if (!rejectDialog.reason.trim()) {
        initToast({
          message: '请输入拒绝原因',
          color: 'warning',
          timeout: 3000
        });
        return;
      }

      try {
        rejectDialog.loading = true;
        // 使用contentAuditService.auditCar方法
        // 状态2表示拒绝
        // 第三个参数是备注（拒绝原因）
        const response = await contentAuditService.auditCar(rejectDialog.carId, 2, rejectDialog.reason);
        if (response.success) {
          initToast({
            message: '审核拒绝成功',
            color: 'success',
            timeout: 3000
          });
          rejectDialog.show = false;
          await loadCarAudits();
        } else {
          initToast({
            message: response.message || '审核拒绝失败',
            color: 'danger',
            timeout: 3000
          });
        }
      } catch (error) {
        console.error('审核拒绝失败:', error);
        initToast({
          message: '审核拒绝失败: ' + (error.message || '未知错误'),
          color: 'danger',
          timeout: 3000
        });
      } finally {
        rejectDialog.loading = false;
      }
    };

    // 查看车辆详情
    const viewCarDetails = (carId) => {
      // 跳转到车辆详情页面
      router.push({ path: `/car/${carId}` });
    };

    // 显示编辑对话框
    const showEditDialog = (car) => {
      // 创建一个副本以避免直接修改原始数据
      editDialog.car = { ...car };
      editDialog.show = true;
    };

    // 处理保存编辑
    const handleSaveEdit = async () => {
      try {
        editDialog.loading = true;
        
        // 验证必填字段
        if (!editDialog.car.brand || !editDialog.car.model || !editDialog.car.year || !editDialog.car.price) {
          initToast({
            message: '请填写所有必填字段',
            color: 'warning',
            timeout: 3000
          });
          return;
        }
        
        // 调用API更新车辆信息
        const carData = {
          brand: editDialog.car.brand,
          model: editDialog.car.model,
          year: Number(editDialog.car.year),
          price: Number(editDialog.car.price),
          category: editDialog.car.category
        };
        
        const response = await carService.updateCar(editDialog.car.carId, carData);
        
        if (response.success) {
          initToast({
            message: '车辆信息更新成功',
            color: 'success',
            timeout: 3000
          });
          editDialog.show = false;
          await loadCarAudits();
        } else {
          initToast({
            message: response.message || '车辆信息更新失败',
            color: 'danger',
            timeout: 3000
          });
        }
      } catch (error) {
        console.error('更新车辆信息失败:', error);
        initToast({
          message: '更新车辆信息失败: ' + (error.message || '未知错误'),
          color: 'danger',
          timeout: 3000
        });
      } finally {
        editDialog.loading = false;
      }
    };

    // 显示删除确认对话框
    const showDeleteConfirm = (carId) => {
      deleteDialog.carId = carId;
      deleteDialog.show = true;
    };

    // 处理删除
    const handleDelete = async () => {
      try {
        deleteDialog.loading = true;
        
        // 调用API删除车辆
        const response = await carService.deleteCar(deleteDialog.carId);
        
        if (response.success) {
          initToast({
            message: '车辆删除成功',
            color: 'success',
            timeout: 3000
          });
          deleteDialog.show = false;
          await loadCarAudits();
        } else {
          initToast({
            message: response.message || '车辆删除失败',
            color: 'danger',
            timeout: 3000
          });
        }
      } catch (error) {
        console.error('删除车辆失败:', error);
        initToast({
          message: '删除车辆失败: ' + (error.message || '未知错误'),
          color: 'danger',
          timeout: 3000
        });
      } finally {
        deleteDialog.loading = false;
      }
    };

    // 页面加载时
    onMounted(() => {
      loadCarAudits();
    });

    // 辅助函数
    // 格式化品牌
    const formatBrand = (brand) => {
      if (!brand) return '暂无品牌';
      
      // 从枚举中查找匹配的品牌
      const brandObj = CAR_BRANDS.find(item => 
        item.value.toLowerCase() === brand.toLowerCase()
      );
      
      if (brandObj) {
        return brandObj.label;
      }
      
      // 常见品牌映射
      const brandMap = {
        'BMW': '宝马',
        'Audi': '奥迪',
        'Mercedes': '奔驰',
        'Mercedes-Benz': '奔驰',
        'Porsche': '保时捷',
        'Toyota': '丰田',
        'Honda': '本田',
        'Nissan': '日产',
        'Ford': '福特',
        'Chevrolet': '雪佛兰',
        'Volkswagen': '大众'
      };
      
      return brandMap[brand] || brand;
    };

    // 获取状态颜色
    const getStatusColor = (status) => {
      status = Number(status);
      if (status === 0) return 'info';      // 待审核
      if (status === 1) return 'success';   // 已通过
      if (status === 2) return 'danger';    // 已拒绝
      return 'gray';
    };

    // 格式化审核状态
    const formatAuditStatus = (status) => {
      status = Number(status);
      // 使用枚举值
      const statusObj = DEALER_VERIFY_STATUS.find(item => item.value === status);
      if (statusObj) {
        return statusObj.label;
      }
      
      // 备用映射
      const statusMap = {
        0: '待审核',
        1: '已通过',
        2: '已拒绝'
      };
      return statusMap[status] || '未知状态';
    };

    // 格式化价格
    const formatPrice = (price) => {
      if (price === undefined || price === null) return '0元';
      
      // 处理价格值
      let priceValue = Number(price);
      if (isNaN(priceValue)) return '0元';
      
      // 直接展示元为单位的价格，不做单位换算
      return priceValue.toLocaleString() + '元';
    };

    // 格式化日期
    const formatDate = (dateString) => {
      if (!dateString) return '无日期';
      try {
        const date = new Date(dateString);
        if (isNaN(date.getTime())) return '无效日期';
        
        return date.toLocaleString('zh-CN', {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
          hour: '2-digit',
          minute: '2-digit'
        }).replace(/\//g, '-');
      } catch (error) {
        return '无效日期';
      }
    };

    // 获取图片URL
    const getImageUrl = (image) => {
      if (!image) return '/assets/images/car-placeholder.jpg';
      
      if (image.fullUrl) return image.fullUrl;
      
      let url = '';
      if (image.imageUrl) {
        url = image.imageUrl;
      } else if (image.url) {
        url = image.url;
      } else {
        return '/assets/images/car-placeholder.jpg';
      }
      
      if (url.startsWith('http')) {
        return url;
      } else {
        return `${import.meta.env.VITE_API_IMAGE_URL || 'http://localhost:8090'}${url}`;
      }
    };

    return {
      displayedAudits,
      loading,
      pagination,
      rejectDialog,
      previewDialog,
      editDialog,
      deleteDialog,
      handlePageChange,
      showRejectDialog,
      showCarPreview,
      handleApprove,
      handleReject,
      viewCarDetails,
      loadCarAudits,
      showEditDialog,
      handleSaveEdit,
      showDeleteConfirm,
      handleDelete,
      formatBrand,
      formatAuditStatus,
      formatDate,
      formatPrice,
      getStatusColor,
      getImageUrl
    };
  }
};
</script>

<style scoped>
.content-audit-page {
  padding: 16px;
}

.text-gray {
  color: #666;
}

.text-sm {
  font-size: 0.875rem;
}

.car-preview-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 1rem;
}

.text-center {
  text-align: center;
}

.font-weight-bold {
  font-weight: bold;
}

/* 原生表格样式 */
.car-audit-table {
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 16px;
  table-layout: fixed; /* 添加固定表格布局 */
}

.car-audit-table th {
  background-color: #f5f7fa;
  font-weight: 600;
  padding: 12px 8px;
  text-align: left;
  border-bottom: 2px solid #ddd;
}

.car-audit-table td {
  padding: 12px 8px;
  border-bottom: 1px solid #eee;
  vertical-align: middle;
  word-break: break-word; /* 允许长文本换行 */
}

.car-audit-table tbody tr:nth-child(odd) {
  background-color: rgba(0, 0, 0, 0.02);
}

.car-audit-table tbody tr:hover {
  background-color: rgba(21, 78, 193, 0.1);
}

.d-flex {
  display: flex;
}

.justify-center {
  justify-content: center;
}

.car-preview-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
  border-bottom: 1px solid #eee;
  padding-bottom: 0.5rem;
}

.car-preview-title {
  margin: 0;
  font-size: 1.5rem;
  color: #333;
}

.car-preview-images {
  width: 100%;
  margin-bottom: 1rem;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 1px 8px rgba(0, 0, 0, 0.1);
  text-align: center;
}

.preview-main-image {
  width: 100%;
  max-height: 300px;
  object-fit: cover;
}

.car-preview-info {
  margin-top: 1rem;
}

.car-preview-section {
  margin-bottom: 1.5rem;
}

.section-title {
  font-size: 1.2rem;
  margin-bottom: 1rem;
  color: #333;
  font-weight: 600;
  border-bottom: 1px solid #eee;
  padding-bottom: 0.5rem;
}

.info-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 0.5rem 1rem;
}

.info-item {
  padding: 0.5rem 0;
}

.info-label {
  color: #666;
  margin-right: 0.5rem;
  font-weight: 500;
}

.info-value {
  color: #333;
}

.info-value.price {
  color: #e64a19;
  font-weight: bold;
}

.car-card-container {
  margin-top: 1.5rem;
  border-top: 1px solid #eee;
  padding-top: 1.5rem;
}

.edit-form {
  padding: 1rem 0;
}
</style>
