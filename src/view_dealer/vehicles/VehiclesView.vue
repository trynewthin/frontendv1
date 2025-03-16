<template>
  <div class="vehicles-container">
    <transition name="fade" mode="out-in">
      <div class="vehicles-content">
        <!-- 使用新的CarList组件，传递actualDealerId而不是currentUserId -->
        <car-list
          ref="carListRef"
          :dealerId="actualDealerId"
          :key="componentKey"
          @edit="handleEditCar"
          @add-car="handleAddCar"
        />
      </div>
    </transition>
    
    <!-- 编辑车辆对话框（Modal版本） -->
    <car-edit-form-new
      v-if="showEditForm"
      :carId="editingCarId"
      @close="closeEditForm"
      @success="handleEditSuccess"
      :key="editingCarId"
    />

    <!-- 添加车辆对话框（Modal版本） -->
    <car-upload-form-new
      v-if="showAddForm"
      @close="closeAddForm"
      @success="handleAddSuccess"
    />
  </div>
</template>

<script setup>
import { ref, onMounted, watch, onActivated } from 'vue';
import { useRoute } from 'vue-router';
import CarList from './components/CarList.vue';
import CarEditFormNew from './components/CarEditForm.vue';
import CarUploadFormNew from './components/CarUploadForm.vue';
import userAdminService from '@api/userAdminService';

// 获取路由
const route = useRoute();

// 接收从父组件传递的用户ID
const props = defineProps({
  currentUserId: {
    type: [Number, String],
    default: null
  }
});

// 编辑相关状态
const showEditForm = ref(false);
const editingCarId = ref(null);
const carListRef = ref(null);
// 添加组件key，用于强制重新渲染
const componentKey = ref(0);
// 存储从用户ID转换得到的实际经销商ID
const actualDealerId = ref(null);
// 加载状态
const isLoadingDealerId = ref(false);
// 添加车辆表单显示状态
const showAddForm = ref(false);

// 处理添加车辆
const handleAddCar = () => {
  // 显示添加车辆表单
  showAddForm.value = true;
};

// 关闭添加表单
const closeAddForm = () => {
  showAddForm.value = false;
};

// 处理添加成功
const handleAddSuccess = (newCar) => {
  console.log('车辆添加成功:', newCar);
  
  // 关闭添加表单
  closeAddForm();
  
  // 重新加载车辆列表
  if (carListRef.value) {
    carListRef.value.loadDealerCars();
  }
};

// 处理编辑车辆
const handleEditCar = (car) => {
  console.log('编辑车辆:', car);
  editingCarId.value = car.carId;
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
  
  // 调用CarList组件的handleEditSuccess方法更新列表数据
  if (carListRef.value) {
    carListRef.value.handleEditSuccess(updatedCar);
  }
  
  // 关闭编辑表单
  closeEditForm();
};

// 强制重新加载组件
const forceReload = () => {
  componentKey.value += 1;
};

// 获取用户对应的经销商ID
const fetchDealerId = async (userId) => {
  if (!userId) {
    return null;
  }
  
  try {
    isLoadingDealerId.value = true;
    
    // 从localStorage检查缓存的经销商ID
    const cachedDealerId = localStorage.getItem('cachedDealerId');
    if (cachedDealerId) {
      actualDealerId.value = cachedDealerId;
      return cachedDealerId;
    }
    
    // 调用API获取用户详情
    const response = await userAdminService.getUserDetailNoAuth(userId);
    
    if (response.success && response.data && response.data.dealerInfo && response.data.dealerInfo.dealerId) {
      const dealerId = response.data.dealerInfo.dealerId;
      
      // 缓存经销商ID到localStorage
      localStorage.setItem('cachedDealerId', dealerId);
      
      // 更新组件状态
      actualDealerId.value = dealerId;
      return dealerId;
    } else {
      return null;
    }
  } catch (err) {
    return null;
  } finally {
    isLoadingDealerId.value = false;
  }
};

// 组件激活时确保数据加载
onActivated(() => {
  if (carListRef.value) {
    setTimeout(() => {
      carListRef.value.loadDealerCars();
    }, 50); // 短暂延迟，确保组件完全挂载
  }
});

// 监听路由变化
watch(() => route.fullPath, () => {
  forceReload();
});

// 监听用户ID变化
watch(() => props.currentUserId, async (newUserId) => {
  if (newUserId) {
    // 获取经销商ID
    await fetchDealerId(newUserId);
    
    // 重新加载车辆列表数据
    forceReload();
    if (carListRef.value) {
      carListRef.value.loadDealerCars();
    }
  }
}, { immediate: true });

// 组件挂载时加载数据
onMounted(async () => {
  // 如果有用户ID，先获取经销商ID
  if (props.currentUserId) {
    await fetchDealerId(props.currentUserId);
  }
  
  // 加载车辆数据
  if (carListRef.value) {
    carListRef.value.loadDealerCars();
  }
});
</script>

<style scoped>
.vehicles-container {
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0;
  box-sizing: border-box;
}

.vehicles-content {
  width: 100%;
}

/* 路由切换动画 */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease, transform 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(10px);
}

/* 响应式布局 - 移动设备 */
@media (max-width: 768px) {
  .vehicles-container {
    padding: 0;
  }
}
</style> 