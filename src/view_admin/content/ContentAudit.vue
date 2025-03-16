<template>
  <div class="content-audit-page">
    <base-panel title="车辆审核管理" content-class="content-panel">
      <!-- 筛选区域组件 -->
      <car-filter-section
        :brand-options="brandOptions"
        :initial-filters="filters"
        @apply-filters="applyFilters"
        @reset-filters="resetFilters"
      />

      <!-- 车辆审核表格组件 -->
      <car-audit-table
        :cars="displayedAudits"
        :loading="loading"
        :page="pagination.currentPage"
        :total-items="pagination.total"
        :page-size="pagination.pageSize"
        :formatters="{
          brand: formatBrand,
          status: formatAuditStatus,
          price: formatPrice,
          date: formatDate
        }"
        @page-change="handlePageChange"
        @approve="handleApprove"
        @reject="showRejectDialog"
        @view="viewCarDetails"
        @preview="showCarPreview"
        @edit="showEditDialog"
        @delete="showDeleteConfirm"
        @reload="loadCarAudits"
      />
    </base-panel>

    <!-- 车辆预览对话框 -->
    <car-preview-modal
      v-model="previewDialog.show"
      :car-data="previewDialog.car"
      :formatters="{
        brand: formatBrand,
        status: formatAuditStatus,
        price: formatPrice,
        date: formatDate
      }"
      @close="previewDialog.car = null"
    />

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
    <car-edit-form
      v-model="editDialog.show"
      :title="'编辑车辆信息'"
      :car-id="editDialog.car.carId"
      :car-data="editDialog.car"
      @saved="handleEditSaved"
      @close="editDialog.show = false"
    />

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
import BasePanel from '@/components/card/BasePanel.vue';

// 导入组件
import CarFilterSection from './components/CarFilterSection.vue';
import CarAuditTable from './components/CarAuditTable.vue';
import CarPreviewModal from './components/CarPreviewModal.vue';
import CarEditForm from './components/CarEditForm.vue';

export default {
  name: 'ContentAudit',
  components: {
    BasePanel,
    CarFilterSection,
    CarAuditTable,
    CarPreviewModal,
    CarEditForm
  },
  setup() {
    const router = useRouter();
    const { init: initToast } = useToast();
    
    // 解构导入的枚举
    const { CAR_BRANDS } = carEnums;
    const { DEALER_VERIFY_STATUS } = dealerEnums;
    
    // 表格数据
    const carAudits = ref([]);
    const allCarAudits = ref([]); // 存储所有未过滤的数据
    const loading = ref(false);

    // 品牌选项
    const brandOptions = computed(() => {
      // 确保 CAR_BRANDS 存在且是数组
      if (!CAR_BRANDS || !Array.isArray(CAR_BRANDS)) {
        return [
          { value: 'BMW', label: '宝马' },
          { value: 'Audi', label: '奥迪' },
          { value: 'Mercedes-Benz', label: '奔驰' },
          { value: 'Toyota', label: '丰田' },
          { value: 'Honda', label: '本田' }
        ];
      }
      return CAR_BRANDS;
    });

    // 筛选条件
    const filters = reactive({
      keyword: '',
      status: '',
      brand: '',
      minPrice: '',
      maxPrice: '',
      minYear: '',
      maxYear: '',
      startDate: '',
      endDate: ''
    });

    // 分页信息
    const pagination = reactive({
      currentPage: 1,
      pageSize: 20,
      total: 0
    });

    // 计算显示的数据 (应用筛选和分页)
    const displayedAudits = computed(() => {
      // 先应用筛选
      let result = [...carAudits.value];
      
      // 更新总数
      pagination.total = result.length;
      
      // 分页
      const startIndex = (pagination.currentPage - 1) * pagination.pageSize;
      return result.slice(startIndex, startIndex + pagination.pageSize);
    });

    // 应用筛选
    const applyFilters = (newFilters) => {
      // 更新本地筛选条件
      Object.keys(newFilters).forEach(key => {
        filters[key] = newFilters[key];
      });
      
      // 从所有数据中筛选
      let filteredData = [...allCarAudits.value];
      
      // 应用关键词筛选
      if (filters.keyword) {
        const keyword = filters.keyword.toLowerCase();
        filteredData = filteredData.filter(car => 
          (car.brand && car.brand.toLowerCase().includes(keyword)) ||
          (car.model && car.model.toLowerCase().includes(keyword)) ||
          (car.carId && car.carId.toString().includes(keyword))
        );
      }
      
      // 应用状态筛选
      if (filters.status !== '') {
        filteredData = filteredData.filter(car => car.status == filters.status);
      }
      
      // 应用品牌筛选
      if (filters.brand) {
        filteredData = filteredData.filter(car => car.brand == filters.brand);
      }
      
      // 应用价格范围筛选
      if (filters.minPrice) {
        filteredData = filteredData.filter(car => car.price >= Number(filters.minPrice));
      }
      if (filters.maxPrice) {
        filteredData = filteredData.filter(car => car.price <= Number(filters.maxPrice));
      }
      
      // 应用年份筛选
      if (filters.minYear) {
        filteredData = filteredData.filter(car => car.year >= Number(filters.minYear));
      }
      if (filters.maxYear) {
        filteredData = filteredData.filter(car => car.year <= Number(filters.maxYear));
      }
      
      // 应用创建时间筛选
      if (filters.startDate) {
        const startDate = new Date(filters.startDate);
        filteredData = filteredData.filter(car => {
          if (!car.createTime) return false;
          return new Date(car.createTime) >= startDate;
        });
      }
      if (filters.endDate) {
        const endDate = new Date(filters.endDate);
        // 将结束日期设置为当天的23:59:59
        endDate.setHours(23, 59, 59);
        filteredData = filteredData.filter(car => {
          if (!car.createTime) return false;
          return new Date(car.createTime) <= endDate;
        });
      }
      
      // 更新筛选后的数据
      carAudits.value = filteredData;
      
      // 重置到第一页
      pagination.currentPage = 1;
      
      // 显示筛选结果提示
      initToast({
        message: `找到${filteredData.length}条符合条件的记录`,
        color: 'info',
        timeout: 3000
      });
    };
    
    // 重置筛选条件
    const resetFilters = () => {
      Object.keys(filters).forEach(key => {
        filters[key] = '';
      });
      
      // 重置数据
      carAudits.value = [...allCarAudits.value];
      pagination.currentPage = 1;
      
      initToast({
        message: '已重置所有筛选条件',
        color: 'info',
        timeout: 3000
      });
    };

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
      allCarAudits.value = []; // 清空所有数据
      
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
            // 存储所有数据
            allCarAudits.value = [...cars];
            
            // 直接使用原始数据赋值给carAudits
            carAudits.value = [...cars];
            
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
          allCarAudits.value = [];
          initToast({
            message: response?.message || '获取车辆列表失败',
            color: 'danger',
            timeout: 3000
          });
        }
      } catch (error) {
        console.error('加载车辆列表失败:', error);
        carAudits.value = [];
        allCarAudits.value = [];
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

    // 处理编辑保存完成
    const handleEditSaved = (updatedCar) => {
      // 更新成功后重新加载数据
      loadCarAudits();
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

    // 格式化函数
    // 格式化品牌
    const formatBrand = (brand) => {
      if (!brand) return '暂无品牌';
      
      // 从枚举中查找匹配的品牌
      const brandObj = CAR_BRANDS && Array.isArray(CAR_BRANDS) ? 
        CAR_BRANDS.find(item => 
          item.value && brand && 
          item.value.toLowerCase() === brand.toLowerCase()
        ) : null;
      
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
      const statusObj = DEALER_VERIFY_STATUS && Array.isArray(DEALER_VERIFY_STATUS) ? 
        DEALER_VERIFY_STATUS.find(item => item.value === status) : null;
      
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

    return {
      displayedAudits,
      loading,
      pagination,
      rejectDialog,
      previewDialog,
      editDialog,
      deleteDialog,
      filters,
      brandOptions,
      handlePageChange,
      showRejectDialog,
      showCarPreview,
      handleApprove,
      handleReject,
      viewCarDetails,
      loadCarAudits,
      showEditDialog,
      handleEditSaved,
      showDeleteConfirm,
      handleDelete,
      formatBrand,
      formatAuditStatus,
      formatDate,
      formatPrice,
      getStatusColor,
      applyFilters,
      resetFilters
    };
  }
};
</script>

<style scoped>
/* CSS变量定义 */
:root {
  /* 亮色模式变量 */
  --audit-bg-color: #ffffff;
  --audit-text-color: #333333;
  --audit-secondary-text: #666666;
  --audit-light-text: #999999;
  --audit-border-color: #eee;
  --audit-filter-bg: #f5f7fa;
  --audit-input-border: #ddd;
  --audit-table-header-bg: #f5f7fa;
  --audit-table-border: #eee;
  --audit-table-hover: rgba(21, 78, 193, 0.1);
  --audit-table-stripe: rgba(0, 0, 0, 0.02);
  --audit-card-shadow: rgba(0, 0, 0, 0.05);
  --audit-price-color: #e64a19;
  --audit-section-title: #333;
}

/* 深色模式变量 */
[data-theme="dark"] {
  --audit-bg-color: #1e1e2d;
  --audit-text-color: #e0e0e0;
  --audit-secondary-text: #b0b0b0;
  --audit-light-text: #888888;
  --audit-border-color: #333344;
  --audit-filter-bg: #2c2c3c;
  --audit-input-border: #444455;
  --audit-table-header-bg: #2c2c3c;
  --audit-table-border: #333344;
  --audit-table-hover: rgba(21, 78, 193, 0.2);
  --audit-table-stripe: rgba(255, 255, 255, 0.03);
  --audit-card-shadow: rgba(0, 0, 0, 0.2);
  --audit-price-color: #ff7043;
  --audit-section-title: #e0e0e0;
}

.content-audit-page {
  height: 100%;
  width: 100%;
  color: var(--audit-text-color);
}

.content-panel {
  padding: 1rem;
  height: 100%;
  width: 100%;
  overflow-y: auto;
}

/* 基础布局样式 */
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

/* 深色模式下的特殊覆盖样式 */
[data-theme="dark"] .va-modal {
  background-color: var(--audit-filter-bg);
  color: var(--audit-text-color);
}

[data-theme="dark"] .edit-form .va-input,
[data-theme="dark"] .edit-form .va-select {
  background-color: var(--audit-bg-color);
  color: var(--audit-text-color);
}
</style>
