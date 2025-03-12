<template>
  <div class="car-test-view">
    <div class="header">
      <h1>车辆服务测试页面</h1>
      <router-link to="/test" class="back-link">返回测试导航</router-link>
    </div>
    
    <div class="content">
      <div class="test-container">
        <!-- 登录状态检测区域 -->
        <div class="status-section">
          <div class="status-container">
            <div class="status-header">
              <h3>当前登录状态</h3>
              <button @click="checkLoginStatus" class="refresh-button">
                <span>刷新状态</span>
              </button>
            </div>
            
            <div class="status-body">
              <div class="status-item">
                <div class="status-label">登录状态:</div>
                <div class="status-badge" :class="isLoggedIn ? 'logged-in' : 'logged-out'">
                  {{ isLoggedIn ? '已登录' : '未登录' }}
                </div>
              </div>
              
              <div v-if="isLoggedIn" class="status-item">
                <div class="status-label">Token:</div>
                <div class="token-value">{{ getStoredToken() }}</div>
              </div>
            </div>
            
            <div v-if="!isLoggedIn" class="status-info">
              <p>您当前未登录，部分车辆功能需要登录后才能使用</p>
            </div>
          </div>
        </div>
        
        <!-- 车辆服务测试区域 -->
        <div class="car-test-section">
          <!-- 查询选项卡 -->
          <div class="tabs">
            <div 
              v-for="tab in tabs" 
              :key="tab.value" 
              :class="['tab-item', { active: currentTab === tab.value }]"
              @click="currentTab = tab.value"
            >
              {{ tab.label }}
            </div>
          </div>
          
          <!-- 基本车辆查询 -->
          <div v-if="currentTab === 'list'" class="tab-content">
            <h3>获取车辆列表</h3>
            
            <div class="query-options">
              <div class="form-row">
                <label for="limit">数量限制:</label>
                <input type="number" id="limit" v-model="queryParams.limit" min="1" max="50" />
              </div>
              
              <div class="form-row">
                <label for="page">页码:</label>
                <input type="number" id="page" v-model="queryParams.page" min="1" />
              </div>
              
              <div class="form-row">
                <label for="sortBy">排序字段:</label>
                <select id="sortBy" v-model="queryParams.sortBy">
                  <option value="">不排序</option>
                  <option v-for="field in sortFields" :key="field.value" :value="field.value">
                    {{ field.label }}
                  </option>
                </select>
              </div>
              
              <div class="form-row">
                <label for="sortOrder">排序方向:</label>
                <select id="sortOrder" v-model="queryParams.sortOrder">
                  <option v-for="direction in sortDirections" :key="direction.value" :value="direction.value">
                    {{ direction.label }}
                  </option>
                </select>
              </div>
            </div>
            
            <div class="action-row">
              <button @click="getCars" class="action-button">
                获取车辆列表
              </button>
            </div>
          </div>
          
          <!-- 车辆详情查询 -->
          <div v-if="currentTab === 'detail'" class="tab-content">
            <h3>获取车辆详情</h3>
            
            <div class="query-options">
              <div class="form-row full-width">
                <label for="carId">车辆ID:</label>
                <input type="number" id="carId" v-model="detailParams.carId" min="1" required />
              </div>
            </div>
            
            <div class="action-row">
              <button @click="getCarDetail" class="action-button" :disabled="!detailParams.carId">
                获取车辆详情
              </button>
              <button @click="getCarImages" class="action-button" :disabled="!detailParams.carId">
                获取车辆图片
              </button>
            </div>
          </div>
          
          <!-- 按品牌查询 -->
          <div v-if="currentTab === 'brand'" class="tab-content">
            <h3>按品牌查询车辆</h3>
            
            <div class="query-options">
              <div class="form-row full-width">
                <label for="brand">品牌名称:</label>
                <div class="brand-selection">
                  <input type="text" id="brand" v-model="brandParams.brand" list="brand-list" required />
                  <datalist id="brand-list">
                    <option v-for="brand in carBrands" :key="brand.value" :value="brand.value">
                      {{ brand.label }}
                    </option>
                  </datalist>
                </div>
              </div>
              
              <div class="form-row">
                <label for="brandLimit">数量限制:</label>
                <input type="number" id="brandLimit" v-model="brandParams.limit" min="1" max="50" />
              </div>
              
              <div class="form-row">
                <label for="brandPage">页码:</label>
                <input type="number" id="brandPage" v-model="brandParams.page" min="1" />
              </div>
            </div>
            
            <div class="action-row">
              <button @click="getCarsByBrand" class="action-button" :disabled="!brandParams.brand">
                按品牌查询车辆
              </button>
            </div>
          </div>
          
          <!-- 按类别查询 -->
          <div v-if="currentTab === 'category'" class="tab-content">
            <h3>按类别查询车辆</h3>
            
            <div class="query-options">
              <div class="form-row full-width">
                <label for="category">车辆类别:</label>
                <select id="category" v-model="categoryParams.category" required>
                  <option value="">请选择类别</option>
                  <option v-for="category in carCategories" :key="category.value" :value="category.value">
                    {{ category.label }}
                  </option>
                </select>
              </div>
              
              <div class="form-row">
                <label for="categoryLimit">数量限制:</label>
                <input type="number" id="categoryLimit" v-model="categoryParams.limit" min="1" max="50" />
              </div>
              
              <div class="form-row">
                <label for="categoryPage">页码:</label>
                <input type="number" id="categoryPage" v-model="categoryParams.page" min="1" />
              </div>
            </div>
            
            <div class="action-row">
              <button @click="getCarsByCategory" class="action-button" :disabled="!categoryParams.category">
                按类别查询车辆
              </button>
            </div>
          </div>
          
          <!-- 按价格区间查询 -->
          <div v-if="currentTab === 'price'" class="tab-content">
            <h3>按价格区间查询车辆</h3>
            
            <div class="query-options">
              <div class="form-row">
                <label for="minPrice">最低价格:</label>
                <input type="number" id="minPrice" v-model="priceParams.minPrice" min="0" />
              </div>
              
              <div class="form-row">
                <label for="maxPrice">最高价格:</label>
                <input type="number" id="maxPrice" v-model="priceParams.maxPrice" min="0" />
              </div>
              
              <div class="form-row">
                <label for="priceLimit">数量限制:</label>
                <input type="number" id="priceLimit" v-model="priceParams.limit" min="1" max="50" />
              </div>
              
              <div class="form-row">
                <label for="pricePage">页码:</label>
                <input type="number" id="pricePage" v-model="priceParams.page" min="1" />
              </div>
            </div>
            
            <div class="action-row">
              <button @click="getCarsByPriceRange" class="action-button" :disabled="!priceParams.minPrice || !priceParams.maxPrice">
                按价格区间查询车辆
              </button>
            </div>
          </div>
          
          <!-- 响应结果展示 -->
          <div class="response-section">
            <div class="response-header">
              <h4>API 响应结果</h4>
              <span class="response-status" :class="responseStatus.type">{{ responseStatus.message }}</span>
            </div>
            <div class="response-body">
              <pre>{{ responseJson }}</pre>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import carService from '../../api/carService';
import { CAR_CATEGORIES, CAR_BRANDS, CAR_SORT_FIELDS, SORT_DIRECTIONS } from '../../constants/carEnums';

export default {
  name: 'CarTestView',
  data() {
    return {
      isLoggedIn: false,
      currentTab: 'list',
      tabs: [
        { label: '车辆列表', value: 'list' },
        { label: '车辆详情', value: 'detail' },
        { label: '按品牌查询', value: 'brand' },
        { label: '按类别查询', value: 'category' },
        { label: '按价格区间', value: 'price' }
      ],
      carCategories: CAR_CATEGORIES,
      carBrands: CAR_BRANDS,
      sortFields: CAR_SORT_FIELDS,
      sortDirections: SORT_DIRECTIONS,
      queryParams: {
        limit: 10,
        page: 1,
        sortBy: '',
        sortOrder: 'asc'
      },
      detailParams: {
        carId: ''
      },
      brandParams: {
        brand: '',
        limit: 10,
        page: 1
      },
      categoryParams: {
        category: '',
        limit: 10,
        page: 1
      },
      priceParams: {
        minPrice: '',
        maxPrice: '',
        limit: 10,
        page: 1
      },
      responseData: null,
      responseStatus: {
        type: 'info',
        message: '等待操作'
      },
      currentOperation: ''
    };
  },
  computed: {
    responseJson() {
      return this.responseData ? JSON.stringify(this.responseData, null, 2) : '暂无数据';
    }
  },
  mounted() {
    this.checkLoginStatus();
  },
  methods: {
    checkLoginStatus() {
      this.isLoggedIn = carService.isLoggedIn();
    },
    
    getStoredToken() {
      return localStorage.getItem('token') || '未找到Token';
    },
    
    // 处理API响应
    handleResponse(response, operationName) {
      this.responseData = response;
      this.currentOperation = operationName;
      
      if (response.success) {
        this.responseStatus = {
          type: 'success',
          message: `${operationName}成功`
        };
      } else {
        this.responseStatus = {
          type: 'error',
          message: `${operationName}失败: ${response.message}`
        };
      }
    },
    
    // 获取车辆列表
    async getCars() {
      try {
        this.responseStatus = { type: 'loading', message: '正在获取车辆列表...' };
        const response = await carService.getCars(this.queryParams);
        this.handleResponse(response, '获取车辆列表');
      } catch (error) {
        this.responseStatus = { type: 'error', message: `获取车辆列表失败: ${error.message}` };
        this.responseData = { error: error.message };
      }
    },
    
    // 获取车辆详情
    async getCarDetail() {
      try {
        this.responseStatus = { type: 'loading', message: '正在获取车辆详情...' };
        const response = await carService.getCarDetail(this.detailParams.carId);
        this.handleResponse(response, '获取车辆详情');
      } catch (error) {
        this.responseStatus = { type: 'error', message: `获取车辆详情失败: ${error.message}` };
        this.responseData = { error: error.message };
      }
    },
    
    // 获取车辆图片
    async getCarImages() {
      try {
        this.responseStatus = { type: 'loading', message: '正在获取车辆图片...' };
        const response = await carService.getCarImages(this.detailParams.carId);
        this.handleResponse(response, '获取车辆图片');
      } catch (error) {
        this.responseStatus = { type: 'error', message: `获取车辆图片失败: ${error.message}` };
        this.responseData = { error: error.message };
      }
    },
    
    // 按品牌查询车辆
    async getCarsByBrand() {
      try {
        this.responseStatus = { type: 'loading', message: '正在按品牌查询车辆...' };
        const { brand, ...queryParams } = this.brandParams;
        const response = await carService.getCarsByBrand(brand, queryParams);
        this.handleResponse(response, '按品牌查询车辆');
      } catch (error) {
        this.responseStatus = { type: 'error', message: `按品牌查询车辆失败: ${error.message}` };
        this.responseData = { error: error.message };
      }
    },
    
    // 按类别查询车辆
    async getCarsByCategory() {
      try {
        this.responseStatus = { type: 'loading', message: '正在按类别查询车辆...' };
        const { category, ...queryParams } = this.categoryParams;
        const response = await carService.getCarsByCategory(category, queryParams);
        this.handleResponse(response, '按类别查询车辆');
      } catch (error) {
        this.responseStatus = { type: 'error', message: `按类别查询车辆失败: ${error.message}` };
        this.responseData = { error: error.message };
      }
    },
    
    // 按价格区间查询车辆
    async getCarsByPriceRange() {
      try {
        this.responseStatus = { type: 'loading', message: '正在按价格区间查询车辆...' };
        const { minPrice, maxPrice, ...queryParams } = this.priceParams;
        const response = await carService.getCarsByPriceRange(minPrice, maxPrice, queryParams);
        this.handleResponse(response, '按价格区间查询车辆');
      } catch (error) {
        this.responseStatus = { type: 'error', message: `按价格区间查询车辆失败: ${error.message}` };
        this.responseData = { error: error.message };
      }
    }
  }
};
</script>

<style scoped>
.car-test-view {
  display: flex;
  flex-direction: column;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  width: 100vw;
  height: 100vh;
  margin: 0;
  padding: 0;
  background-color: #f5f7fa;
  overflow-y: auto;
  box-sizing: border-box;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 2rem;
  background-color: white;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  box-sizing: border-box;
  width: 100%;
}

.content {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: flex-start;
  width: 100%;
  padding: 1rem;
  box-sizing: border-box;
  overflow: auto;
}

h1 {
  margin: 0;
  color: #333;
  font-size: 1.8rem;
  width: auto;
}

.back-link {
  padding: 8px 16px;
  background-color: #f5f5f5;
  color: #333;
  border-radius: 4px;
  text-decoration: none;
  font-weight: 500;
  transition: background-color 0.2s;
  width: auto;
}

.back-link:hover {
  background-color: #e0e0e0;
}

.test-container {
  width: 100%;
  background-color: white;
  padding: 1.5rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  box-sizing: border-box;
  overflow: visible;
  height: auto;
}

.status-section {
  margin-bottom: 2rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid #eee;
}

.status-container {
  background-color: #f9f9f9;
  border-radius: 8px;
  padding: 1rem;
}

.status-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.status-header h3 {
  margin: 0;
}

.refresh-button {
  background-color: #f0f0f0;
  border: none;
  border-radius: 4px;
  padding: 6px 12px;
  cursor: pointer;
  display: flex;
  align-items: center;
  color: #444;
  font-weight: 500;
  transition: background-color 0.2s;
}

.refresh-button:hover {
  background-color: #e0e0e0;
}

.status-body {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.status-item {
  display: flex;
  align-items: center;
}

.status-label {
  font-weight: 500;
  margin-right: 0.5rem;
  min-width: 80px;
}

.status-badge {
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 0.9rem;
  font-weight: 500;
}

.logged-in {
  background-color: #e6f7e6;
  color: #2e7d32;
}

.logged-out {
  background-color: #ffebee;
  color: #c62828;
}

.status-info {
  margin-top: 1rem;
  padding: 0.75rem;
  background-color: #f5f5f5;
  border-radius: 4px;
  color: #666;
}

.token-value {
  font-size: 0.9rem;
  color: #555;
}

.car-test-section {
  margin-top: 1rem;
}

.tabs {
  display: flex;
  border-bottom: 1px solid #ddd;
  margin-bottom: 1.5rem;
  overflow-x: auto;
}

.tab-item {
  padding: 0.75rem 1.5rem;
  cursor: pointer;
  color: #555;
  font-weight: 500;
  border-bottom: 2px solid transparent;
  white-space: nowrap;
}

.tab-item:hover {
  color: #4a9cf6;
}

.tab-item.active {
  color: #4a9cf6;
  border-bottom-color: #4a9cf6;
}

.tab-content {
  margin-bottom: 2rem;
}

.query-options {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  margin-bottom: 1.5rem;
  background-color: #f9f9f9;
  border-radius: 8px;
  padding: 1rem;
}

.form-row {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  flex: 1;
  min-width: 200px;
}

.form-row.full-width {
  flex: 100%;
  width: 100%;
}

.form-row label {
  font-weight: 500;
  color: #555;
}

.form-row input, .form-row select {
  padding: 0.5rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
}

.action-row {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.action-button {
  padding: 0.75rem 1rem;
  background-color: #4a9cf6;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 500;
  transition: background-color 0.2s;
  flex: 1;
  min-width: 200px;
}

.action-button:hover {
  background-color: #3a8ce6;
}

.action-button:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}

.response-section {
  background-color: #f9f9f9;
  border-radius: 8px;
  padding: 1rem;
  margin-top: 1rem;
}

.response-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.response-header h4 {
  margin: 0;
  color: #555;
}

.response-status {
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 0.9rem;
  font-weight: 500;
}

.response-status.success {
  background-color: #e6f7e6;
  color: #2e7d32;
}

.response-status.error {
  background-color: #ffebee;
  color: #c62828;
}

.response-status.loading {
  background-color: #e3f2fd;
  color: #1565c0;
}

.response-status.info {
  background-color: #f5f5f5;
  color: #555;
}

.response-body {
  background-color: #f5f5f5;
  border-radius: 4px;
  padding: 1rem;
  overflow-x: auto;
  max-height: 400px;
  overflow-y: auto;
}

.response-body pre {
  margin: 0;
  white-space: pre-wrap;
  word-break: break-word;
  font-family: 'Courier New', Courier, monospace;
  color: #444;
}

@media (max-width: 768px) {
  .header {
    padding: 1rem;
    flex-direction: column;
    gap: 1rem;
    text-align: center;
  }
  
  .test-container {
    padding: 1rem;
  }
  
  .tabs {
    margin-bottom: 1rem;
  }
  
  .tab-item {
    padding: 0.5rem 1rem;
  }
  
  .query-options {
    flex-direction: column;
  }
  
  .form-row {
    width: 100%;
  }
  
  .action-row {
    flex-direction: column;
  }
  
  .action-button {
    width: 100%;
  }
}
</style> 