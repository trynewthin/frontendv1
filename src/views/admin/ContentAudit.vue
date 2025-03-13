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
    <va-modal v-model="previewDialog.show" title="车辆预览" size="medium" hide-default-actions>
      <div class="car-preview-container">
        <car-card 
          v-if="previewDialog.car" 
          :car="previewDialog.car"
          :showImage="true"
          :showStatus="true"
          :showPrice="true"
          :showModelBrand="true"
          :showMeta="true"
        />
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
  </div>
</template>

<script>
import { ref, reactive, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import carService from '@/api/carService';
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
              color: 'success'
            });
          } else {
            initToast({
              message: '暂无车辆数据',
              color: 'info'
            });
          }
        } else {
          carAudits.value = [];
          initToast({
            message: response?.message || '获取车辆列表失败',
            color: 'danger'
          });
        }
      } catch (error) {
        console.error('加载车辆列表失败:', error);
        carAudits.value = [];
        initToast({
          message: '加载车辆列表失败: ' + (error.message || '未知错误'),
          color: 'danger'
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
    const showCarPreview = (car) => {
      previewDialog.car = car;
      previewDialog.show = true;
    };

    // 处理通过
    const handleApprove = async (carId) => {
      try {
        loading.value = true;
        const response = await carService.updateCarStatus(carId, 'APPROVED');
        if (response.success) {
          initToast({
            message: '审核通过成功',
            color: 'success'
          });
          await loadCarAudits();
        } else {
          initToast({
            message: response.message || '审核通过失败',
            color: 'danger'
          });
        }
      } catch (error) {
        console.error('审核通过失败:', error);
        initToast({
          message: '审核通过失败: ' + (error.message || '未知错误'),
          color: 'danger'
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
          color: 'warning'
        });
        return;
      }

      try {
        rejectDialog.loading = true;
        const response = await carService.updateCarStatus(rejectDialog.carId, 'REJECTED', rejectDialog.reason);
        if (response.success) {
          initToast({
            message: '审核拒绝成功',
            color: 'success'
          });
          rejectDialog.show = false;
          await loadCarAudits();
        } else {
          initToast({
            message: response.message || '审核拒绝失败',
            color: 'danger'
          });
        }
      } catch (error) {
        console.error('审核拒绝失败:', error);
        initToast({
          message: '审核拒绝失败: ' + (error.message || '未知错误'),
          color: 'danger'
        });
      } finally {
        rejectDialog.loading = false;
      }
    };

    // 查看车辆详情
    const viewCarDetails = (carId) => {
      router.push({ path: `/admin/cars/${carId}` });
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

    return {
      displayedAudits,
      loading,
      pagination,
      rejectDialog,
      previewDialog,
      handlePageChange,
      showRejectDialog,
      showCarPreview,
      handleApprove,
      handleReject,
      viewCarDetails,
      loadCarAudits,
      formatBrand,
      formatAuditStatus,
      formatDate,
      formatPrice,
      getStatusColor
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
  max-width: 500px;
  margin: 0 auto;
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
</style>
