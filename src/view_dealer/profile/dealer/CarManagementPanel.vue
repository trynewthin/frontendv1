<template>
  <div class="car-management-panel">
    <div class="panel-header">
      <h2>车辆管理</h2>
      <button class="close-button" @click="$emit('close')">
        <i class="fa fa-times"></i>
      </button>
    </div>
    
    <div class="panel-content">
      <!-- 使用CarList组件显示车辆列表 -->
      <CarList
        :cars="cars"
        :loading="loading"
        :error="error"
        :current-page="currentPage"
        :total-pages="totalPages"
        @reload="loadDealerCars"
        @add-car="$emit('add-car')"
        @edit="handleEdit"
        @toggle-status="handleToggleStatus"
        @delete="handleDelete"
        @page-change="handlePageChange"
      />
    </div>
    
    <!-- 使用ConfirmDialog组件显示删除确认对话框 -->
    <ConfirmDialog
      :show="showDeleteConfirm"
      title="确认删除"
      message="您确定要删除该车辆信息吗？此操作不可恢复。"
      confirm-text="确认删除"
      @confirm="confirmDelete"
      @cancel="showDeleteConfirm = false"
    />

    <!-- 编辑车辆对话框 -->
    <div v-if="showEditForm" class="edit-dialog-overlay">
      <div class="edit-dialog">
        <button class="close-edit-button" @click="closeEditForm">
          <i class="fa fa-times"></i>
        </button>
        <CarEditForm 
          :carId="editingCarId" 
          @close="closeEditForm" 
          @success="handleEditSuccess" 
          :key="editingCarId" 
        />
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, computed } from 'vue';
import carService from '@/api/carService';
import CarEditForm from './CarEditForm.vue';
import CarList from './CarList.vue';
import ConfirmDialog from './ConfirmDialog.vue';

export default {
  name: 'CarManagementPanel',
  
  components: {
    CarEditForm,
    CarList,
    ConfirmDialog
  },
  
  emits: ['close', 'add-car'],
  
  setup(props, { emit }) {
    // 状态变量
    const loading = ref(false);
    const error = ref('');
    const cars = ref([]);
    const currentPage = ref(1);
    const pageSize = ref(10);
    const total = ref(0);
    const dealerId = ref(null);
    const showDeleteConfirm = ref(false);
    const carToDelete = ref(null);
    
    // 编辑相关状态
    const showEditForm = ref(false);
    const editingCarId = ref(null);
    
    // 计算总页数
    const totalPages = computed(() => {
      return Math.ceil(total.value / pageSize.value) || 1;
    });
    
    // 获取经销商ID
    const getDealerId = () => {
      try {
        const userInfoStr = localStorage.getItem('userInfo');
        if (userInfoStr) {
          const userInfo = JSON.parse(userInfoStr);
          if (userInfo.dealerId) {
            dealerId.value = userInfo.dealerId;
            return userInfo.dealerId;
          }
        }
        
        const dealerInfoStr = localStorage.getItem('dealerInfo');
        if (dealerInfoStr) {
          const dealerInfo = JSON.parse(dealerInfoStr);
          if (dealerInfo.dealerId) {
            dealerId.value = dealerInfo.dealerId;
            return dealerInfo.dealerId;
          }
        }
        
        throw new Error('未找到经销商ID');
      } catch (err) {
        console.error('获取经销商ID失败:', err);
        error.value = '无法获取经销商信息，请确保您已登录并完成经销商认证';
        return null;
      }
    };
    
    // 加载经销商车辆数据
    const loadDealerCars = async () => {
      loading.value = true;
      error.value = '';
      
      try {
        const id = dealerId.value || getDealerId();
        if (!id) {
          loading.value = false;
          return;
        }
        
        const queryParams = {
          page: currentPage.value,
          size: pageSize.value
        };
        
        console.log('加载经销商车辆列表，参数:', { dealerId: id, ...queryParams });
        const response = await carService.getCarsByDealerId(id, queryParams);
        
        if (response.success) {
          cars.value = response.data;
          total.value = response.total;
          console.log(`成功加载${cars.value.length}辆车，总计${total.value}辆`);
        } else {
          error.value = response.message || '获取车辆列表失败';
          console.error('获取车辆列表失败:', response.message);
        }
      } catch (err) {
        console.error('加载车辆信息失败:', err);
        error.value = '加载车辆信息失败，请稍后重试';
      } finally {
        loading.value = false;
      }
    };
    
    // 处理分页变化
    const handlePageChange = (page) => {
      currentPage.value = page;
      loadDealerCars();
    };
    
    // 获取状态文本
    const getStatusText = (status) => {
      switch (status) {
        case 1: return '在售';
        case 0: return '下架';
        case 2: return '已售';
        default: return '未知';
      }
    };
    
    // 获取状态样式类
    const getStatusClass = (status) => {
      switch (status) {
        case 1: return 'status-active';
        case 0: return 'status-inactive';
        case 2: return 'status-sold';
        default: return '';
      }
    };
    
    // 处理编辑车辆
    const handleEdit = (car) => {
      console.log('编辑车辆:', car);
      
      // 确保每次点击编辑时总是会触发组件重新挂载
      editingCarId.value = car.carId;
      
      // 显示编辑表单
      showEditForm.value = true;
    };
    
    // 关闭编辑表单
    const closeEditForm = () => {
      showEditForm.value = false;
      editingCarId.value = null;
    };
    
    // 处理编辑成功
    const handleEditSuccess = (updatedCar) => {
      console.log('车辆更新成功:', updatedCar);
      
      // 更新列表中的车辆数据
      const index = cars.value.findIndex(c => c.carId === updatedCar.carId);
      if (index !== -1) {
        // 更新基本信息
        cars.value[index] = { ...cars.value[index], ...updatedCar };
      }
      
      // 显示成功消息
      error.value = '车辆信息更新成功！';
      setTimeout(() => { error.value = ''; }, 3000);
      
      // 关闭编辑表单
      closeEditForm();
    };
    
    // 处理切换车辆状态
    const handleToggleStatus = async (car) => {
      try {
        loading.value = true;
        const newStatus = car.status === 1 ? 0 : 1; // 在售(1) <-> 下架(0)
        
        // 使用专门的更新状态方法而不是updateCar
        const response = await carService.changeCarStatus(car.carId, newStatus);
        
        if (response.success) {
          // 验证返回的数据中的状态是否与我们期望的一致
          if (response.data && response.data.status !== undefined) {
            // 使用返回的状态
            const actualStatus = response.data.status;
            const index = cars.value.findIndex(c => c.carId === car.carId);
            if (index !== -1) {
              cars.value[index].status = actualStatus;
              console.log(`车辆状态已更新: carId=${car.carId}, newStatus=${actualStatus}`);
            }
          } else {
            // 使用请求的状态
            const index = cars.value.findIndex(c => c.carId === car.carId);
            if (index !== -1) {
              cars.value[index].status = newStatus;
              console.log(`车辆状态已更新: carId=${car.carId}, newStatus=${newStatus}`);
            }
          }
          
          // 显示成功消息
          error.value = ''; // 清除错误信息
          const statusText = newStatus === 1 ? '上架' : '下架';
          // 只是临时使用error字段来显示成功信息
          error.value = `车辆已成功${statusText}！`;
          setTimeout(() => { error.value = ''; }, 3000);
        } else {
          error.value = response.message || '更新车辆状态失败';
          setTimeout(() => { error.value = ''; }, 3000);
        }
      } catch (err) {
        console.error('更新车辆状态失败:', err);
        error.value = '更新车辆状态失败，请稍后重试';
        setTimeout(() => { error.value = ''; }, 3000);
      } finally {
        loading.value = false;
      }
    };
    
    // 处理删除车辆
    const handleDelete = (car) => {
      carToDelete.value = car;
      showDeleteConfirm.value = true;
    };
    
    // 确认删除车辆
    const confirmDelete = async () => {
      if (!carToDelete.value) {
        showDeleteConfirm.value = false;
        return;
      }
      
      try {
        loading.value = true;
        
        const response = await carService.deleteCar(carToDelete.value.carId);
        
        if (response.success) {
          // 从列表中移除
          cars.value = cars.value.filter(c => c.carId !== carToDelete.value.carId);
          
          // 如果当前页没有数据了，且不是第一页，则返回上一页
          if (cars.value.length === 0 && currentPage.value > 1) {
            currentPage.value--;
            await loadDealerCars();
          }
        } else {
          error.value = response.message || '删除车辆失败';
          setTimeout(() => { error.value = ''; }, 3000);
        }
      } catch (err) {
        console.error('删除车辆失败:', err);
        error.value = '删除车辆失败，请稍后重试';
        setTimeout(() => { error.value = ''; }, 3000);
      } finally {
        loading.value = false;
        showDeleteConfirm.value = false;
        carToDelete.value = null;
      }
    };
    
    // 组件挂载时加载数据
    onMounted(() => {
      loadDealerCars();
    });
    
    return {
      loading,
      error,
      cars,
      currentPage,
      totalPages,
      showDeleteConfirm,
      showEditForm,
      editingCarId,
      loadDealerCars,
      handlePageChange,
      getStatusText,
      getStatusClass,
      handleEdit,
      closeEditForm,
      handleEditSuccess,
      handleToggleStatus,
      handleDelete,
      confirmDelete
    };
  }
};
</script>

<style scoped>
.car-management-panel {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.panel-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  border-bottom: 1px solid #e0e0e0;
}

.panel-header h2 {
  margin: 0;
  font-size: 1.5rem;
  color: #333;
}

.close-button {
  background: none;
  border: none;
  font-size: 1.2rem;
  color: #666;
  cursor: pointer;
}

.close-button:hover {
  color: #333;
}

.panel-content {
  flex: 1;
  padding: 1rem;
  overflow-y: auto;
}

/* 编辑对话框样式 */
.edit-dialog-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1100;
  overflow-y: auto;
  padding: 20px;
}

.edit-dialog {
  background-color: white;
  border-radius: 8px;
  width: 90%;
  max-width: 900px;
  max-height: 90vh;
  overflow-y: auto;
  position: relative;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
}

.close-edit-button {
  position: absolute;
  top: 10px;
  right: 10px;
  width: 30px;
  height: 30px;
  background-color: #f0f0f0;
  border: none;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  z-index: 10;
}

.close-edit-button:hover {
  background-color: #e0e0e0;
}

/* 响应式调整 */
@media (max-width: 768px) {
  .edit-dialog {
    width: 95%;
    max-height: 95vh;
  }
}
</style> 