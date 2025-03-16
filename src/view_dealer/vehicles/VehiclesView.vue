<template>
  <div class="vehicles-container">
    <transition name="fade" mode="out-in">
      <div class="vehicles-content">
        <!-- 使用新的CarList组件 -->
        <car-list
          ref="carListRef"
          :dealerId="currentUserId"
          @edit="handleEditCar"
          @add-car="handleAddCar"
        />
      </div>
    </transition>
    
    <!-- 编辑车辆对话框 -->
    <div v-if="showEditForm" class="edit-dialog-overlay">
      <div class="edit-dialog">
        <button class="close-edit-button" @click="closeEditForm">
          <i class="fa fa-times"></i>
        </button>
        <car-edit-form 
          :carId="editingCarId" 
          @close="closeEditForm" 
          @success="handleEditSuccess" 
          :key="editingCarId" 
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue';
import CarList from './components/CarList.vue';
import CarEditForm from './components/CarEditForm.vue';

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

// 处理添加车辆
const handleAddCar = () => {
  // 添加车辆逻辑
  console.log('添加车辆');
  // 这里可以打开添加车辆的表单或对话框
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

// 监听用户ID变化
watch(() => props.currentUserId, (newUserId) => {
  if (newUserId && carListRef.value) {
    // 重新加载车辆列表数据
    console.log('用户ID变化，重新加载车辆列表');
    carListRef.value.loadDealerCars();
  }
}, { immediate: true });

// 组件挂载时加载数据
onMounted(() => {
  console.log('VehiclesView组件挂载，准备加载车辆列表');
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
  
  .edit-dialog {
    width: 95%;
    max-height: 95vh;
  }
}

/* 深色模式适配 */
:root[data-theme="dark"] .edit-dialog {
  background-color: var(--card-bg-color, #1f1f1f);
  color: var(--text-color, #e0e0e0);
}

:root[data-theme="dark"] .close-edit-button {
  background-color: #333;
  color: #e0e0e0;
}
</style> 