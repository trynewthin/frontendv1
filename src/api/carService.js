// 导入API客户端与相关模型

import CarDTO from '../../apiclient/src/model/CarDTO';
import CarDetailDTO from '../../apiclient/src/model/CarDetailDTO';
import UploadCarImageRequest from '../../apiclient/src/model/UploadCarImageRequest';
import { api } from './apiService';

/**
 * 车辆管理服务
 * 处理车辆信息的增删改查操作
 */
class CarService {
  /**
   * 检查用户是否已登录
   * @returns {boolean} 是否已登录
   */
  isLoggedIn() {
    return !!localStorage.getItem('token');
  }

  /**
   * 创建新车辆
   * @param {Object} carData 车辆基本信息
   * @param {number} carData.dealerId 经销商ID
   * @param {string} carData.brand 品牌
   * @param {string} carData.model 型号
   * @param {number} carData.year 年份
   * @param {number} carData.price 价格
   * @param {string} carData.category 类别
   * @param {number} [carData.status] 状态（可选）
   * @returns {Promise<{success: boolean, message: string, data: Object|null}>} 创建结果
   */
  async createCar(carData) {
    try {
      // 检查是否已登录
      if (!this.isLoggedIn()) {
        return {
          success: false,
          message: '用户未登录',
          data: null
        };
      }

      // 验证必填字段
      const requiredFields = ['dealerId', 'brand', 'model', 'year', 'price', 'category'];
      for (const field of requiredFields) {
        if (carData[field] === undefined || carData[field] === null) {
          return {
            success: false,
            message: `${field}字段不能为空`,
            data: null
          };
        }
      }

      // 创建CarDTO对象
      const carDTO = new CarDTO(
        carData.dealerId,
        carData.brand,
        carData.model,
        carData.year,
        carData.price,
        carData.category
      );

      // 设置可选字段
      if (carData.status !== undefined) {
        carDTO.status = carData.status;
      }

      // 调用API创建车辆
      const response = await api.createCar(carDTO);
      console.log('创建车辆响应:', response);
      
      // 检查响应状态
      if (response.code === 200 || response.code === 0 || response.code === 201) {
        // 创建成功，返回数据
        return {
          success: true,
          message: response.message || '车辆创建成功',
          data: response.data
        };
      }
      
      // 创建失败
      return {
        success: false,
        message: response.message || '车辆创建失败',
        data: null
      };
    } catch (error) {
      console.error('创建车辆过程中发生错误:', error);
      return {
        success: false,
        message: error.response?.data?.message || error.message || '创建车辆过程中发生错误',
        data: null
      };
    }
  }

  /**
   * 获取车辆列表
   * @param {Object} [queryParams] 查询参数
   * @param {number} [queryParams.page] 页码（从1开始）
   * @param {number} [queryParams.size] 每页数量
   * @param {string} [queryParams.sort] 排序字段
   * @returns {Promise<{success: boolean, message: string, data: Object|null, total: number, page: number, size: number}>} 查询结果
   */
  async getCars(queryParams = {}) {
    try {
      // 设置默认分页参数
      const opts = {
        page: queryParams.page || 1,
        size: queryParams.size || 10,
        sort: queryParams.sort
      };

      // 调用API获取车辆列表
      const response = await api.getCars(opts);
      console.log('获取车辆列表响应:', response);
      
      // 检查响应状态
      if (response.code === 200 || response.code === 0) {
        // 获取成功，返回数据
        // 根据实际返回的数据结构调整
        return {
          success: true,
          message: '获取车辆列表成功',
          data: response.data?.cars || [], // 改为使用data.cars
          total: response.data?.total || 0, // 使用正确的total字段
          page: response.data?.current || 1, // 使用current作为当前页码
          size: queryParams.size || 10 // 使用请求中的size
        };
      }
      
      // 获取失败
      return {
        success: false,
        message: response.message || '获取车辆列表失败',
        data: null,
        total: 0,
        page: 1,
        size: 10
      };
    } catch (error) {
      console.error('获取车辆列表过程中发生错误:', error);
      return {
        success: false,
        message: error.response?.data?.message || error.message || '获取车辆列表过程中发生错误',
        data: null,
        total: 0,
        page: 1,
        size: 10
      };
    }
  }

  /**
   * 获取车辆详情
   * @param {number} carId 车辆ID
   * @returns {Promise<{success: boolean, message: string, data: Object|null}>} 查询结果
   */
  async getCarDetail(carId) {
    try {
      // 验证参数
      if (!carId) {
        return {
          success: false,
          message: '车辆ID不能为空',
          data: null
        };
      }

      // 调用API获取车辆详情
      const response = await api.getCarDetail(carId);
      console.log('获取车辆详情响应:', response);
      
      // 检查响应状态
      if (response.code === 200 || response.code === 0) {
        // 获取成功，返回数据
        return {
          success: true,
          message: '获取车辆详情成功',
          data: response.data
        };
      }
      
      // 获取失败
      return {
        success: false,
        message: response.message || '获取车辆详情失败',
        data: null
      };
    } catch (error) {
      console.error('获取车辆详情过程中发生错误:', error);
      return {
        success: false,
        message: error.response?.data?.message || error.message || '获取车辆详情过程中发生错误',
        data: null
      };
    }
  }

  /**
   * 更新车辆基本信息
   * @param {number} carId 车辆ID
   * @param {Object} carData 车辆更新信息
   * @param {string} [carData.brand] 品牌
   * @param {string} [carData.model] 型号
   * @param {number} [carData.year] 年份
   * @param {number} [carData.price] 价格
   * @param {string} [carData.category] 类别
   * @param {number} [carData.status] 状态
   * @returns {Promise<{success: boolean, message: string, data: Object|null}>} 更新结果
   */
  async updateCar(carId, carData) {
    try {
      // 检查是否已登录
      if (!this.isLoggedIn()) {
        return {
          success: false,
          message: '用户未登录',
          data: null
        };
      }

      // 验证参数
      if (!carId) {
        return {
          success: false,
          message: '车辆ID不能为空',
          data: null
        };
      }

      // 先获取当前车辆信息
      const currentCarResponse = await api.getCarDetail(carId);
      if (currentCarResponse.code !== 200 && currentCarResponse.code !== 0) {
        return {
          success: false,
          message: currentCarResponse.message || '获取当前车辆信息失败',
          data: null
        };
      }

      const currentCar = currentCarResponse.data;
      
      // 创建CarDTO对象，合并当前数据和更新数据
      const carDTO = new CarDTO(
        currentCar.dealerId,
        carData.brand || currentCar.brand,
        carData.model || currentCar.model,
        carData.year || currentCar.year,
        carData.price || currentCar.price,
        carData.category || currentCar.category
      );

      // 设置ID和可选字段
      carDTO.carId = carId;
      if (carData.status !== undefined) {
        carDTO.status = carData.status;
      } else if (currentCar.status !== undefined) {
        carDTO.status = currentCar.status;
      }

      // 调用API更新车辆
      const response = await api.updateCar(carId, carDTO);
      console.log('更新车辆响应:', response);
      
      // 检查响应状态
      if (response.code === 200 || response.code === 0) {
        // 更新成功，返回数据
        return {
          success: true,
          message: response.message || '车辆更新成功',
          data: response.data
        };
      }
      
      // 更新失败
      return {
        success: false,
        message: response.message || '车辆更新失败',
        data: null
      };
    } catch (error) {
      console.error('更新车辆过程中发生错误:', error);
      return {
        success: false,
        message: error.response?.data?.message || error.message || '更新车辆过程中发生错误',
        data: null
      };
    }
  }

  /**
   * 更新车辆详细信息
   * @param {number} carId 车辆ID
   * @param {Object} detailData 车辆详细信息
   * @param {string} [detailData.engine] 发动机
   * @param {string} [detailData.transmission] 变速箱
   * @param {string} [detailData.fuelType] 燃油类型
   * @param {number} [detailData.fuelConsumption] 油耗
   * @param {number} [detailData.seats] 座位数
   * @param {string} [detailData.color] 颜色
   * @param {string} [detailData.bodySize] 车身尺寸
   * @param {number} [detailData.wheelbase] 轴距
   * @param {string} [detailData.features] 特性
   * @param {string} [detailData.warranty] 保修信息
   * @returns {Promise<{success: boolean, message: string, data: Object|null}>} 更新结果
   */
  async updateCarDetail(carId, detailData) {
    try {
      // 检查是否已登录
      if (!this.isLoggedIn()) {
        return {
          success: false,
          message: '用户未登录',
          data: null
        };
      }

      // 验证参数
      if (!carId) {
        return {
          success: false,
          message: '车辆ID不能为空',
          data: null
        };
      }

      // 创建CarDetailDTO对象
      const carDetailDTO = new CarDetailDTO();
      
      // 设置字段
      carDetailDTO.carId = carId;
      
      // 复制所有提供的字段
      const fields = [
        'engine', 'transmission', 'fuelType', 'fuelConsumption', 
        'seats', 'color', 'bodySize', 'wheelbase', 'features', 'warranty'
      ];
      
      for (const field of fields) {
        if (detailData[field] !== undefined) {
          carDetailDTO[field] = detailData[field];
        }
      }

      // 调用API更新车辆详情
      const response = await api.updateCarDetail(carId, carDetailDTO);
      console.log('更新车辆详情响应:', response);
      
      // 检查响应状态
      if (response.code === 200 || response.code === 0) {
        // 更新成功，返回数据
        return {
          success: true,
          message: response.message || '车辆详情更新成功',
          data: response.data
        };
      }
      
      // 更新失败
      return {
        success: false,
        message: response.message || '车辆详情更新失败',
        data: null
      };
    } catch (error) {
      console.error('更新车辆详情过程中发生错误:', error);
      return {
        success: false,
        message: error.response?.data?.message || error.message || '更新车辆详情过程中发生错误',
        data: null
      };
    }
  }

  /**
   * 删除车辆详情
   * @param {number} carId 车辆ID
   * @returns {Promise<{success: boolean, message: string}>} 删除结果
   */
  async deleteCarDetail(carId) {
    try {
      // 检查是否已登录
      if (!this.isLoggedIn()) {
        return {
          success: false,
          message: '用户未登录'
        };
      }

      // 验证参数
      if (!carId) {
        return {
          success: false,
          message: '车辆ID不能为空'
        };
      }

      // 调用API删除车辆详情
      const response = await api.deleteCarDetail(carId);
      console.log('删除车辆详情响应:', response);
      
      // 检查响应状态
      if (response.code === 200 || response.code === 0) {
        // 删除成功
        return {
          success: true,
          message: response.message || '删除车辆详情成功'
        };
      }
      
      // 删除失败
      return {
        success: false,
        message: response.message || '删除车辆详情失败'
      };
    } catch (error) {
      console.error('删除车辆详情过程中发生错误:', error);
      return {
        success: false,
        message: error.response?.data?.message || error.message || '删除车辆详情过程中发生错误'
      };
    }
  }

  /**
   * 删除车辆
   * @param {number} carId 车辆ID
   * @returns {Promise<{success: boolean, message: string}>} 删除结果
   */
  async deleteCar(carId) {
    try {
      // 检查是否已登录
      if (!this.isLoggedIn()) {
        return {
          success: false,
          message: '用户未登录'
        };
      }

      // 验证参数
      if (!carId) {
        return {
          success: false,
          message: '车辆ID不能为空'
        };
      }

      // 调用API删除车辆
      const response = await api.deleteCar(carId);
      console.log('删除车辆响应:', response);
      
      // 检查响应状态
      if (response.code === 200 || response.code === 0 || response.code === 204) {
        // 删除成功
        return {
          success: true,
          message: response.message || '车辆删除成功'
        };
      }
      
      // 删除失败
      return {
        success: false,
        message: response.message || '车辆删除失败'
      };
    } catch (error) {
      console.error('删除车辆过程中发生错误:', error);
      return {
        success: false,
        message: error.response?.data?.message || error.message || '删除车辆过程中发生错误'
      };
    }
  }

  /**
   * 按品牌搜索车辆
   * @param {string} brand 品牌名称
   * @param {Object} [queryParams] 查询参数
   * @param {number} [queryParams.page] 页码（从1开始）
   * @param {number} [queryParams.size] 每页数量
   * @returns {Promise<{success: boolean, message: string, data: Object|null, total: number, page: number, size: number}>} 查询结果
   */
  async getCarsByBrand(brand, queryParams = {}) {
    try {
      // 验证参数
      if (!brand) {
        return {
          success: false,
          message: '品牌名称不能为空',
          data: null,
          total: 0,
          page: 1,
          size: 10
        };
      }

      // 设置分页参数
      const opts = {
        page: queryParams.page || 1,
        size: queryParams.size || 10
      };

      // 调用API获取车辆列表
      const response = await api.getCarsByBrand(brand, opts);
      console.log('按品牌搜索车辆响应:', response);
      
      // 检查响应状态
      if (response.code === 200 || response.code === 0) {
        // 获取成功，返回数据
        return {
          success: true,
          message: '搜索车辆成功',
          data: response.data?.cars || [], // 改为使用data.cars
          total: response.data?.total || 0, // 使用正确的total字段
          page: response.data?.current || 1, // 使用current作为当前页码
          size: queryParams.size || 10 // 使用请求中的size
        };
      }
      
      // 获取失败
      return {
        success: false,
        message: response.message || '搜索车辆失败',
        data: null,
        total: 0,
        page: 1,
        size: 10
      };
    } catch (error) {
      console.error('搜索车辆过程中发生错误:', error);
      return {
        success: false,
        message: error.response?.data?.message || error.message || '搜索车辆过程中发生错误',
        data: null,
        total: 0,
        page: 1,
        size: 10
      };
    }
  }

  /**
   * 按类别搜索车辆
   * @param {string} category 类别名称
   * @param {Object} [queryParams] 查询参数
   * @param {number} [queryParams.page] 页码（从1开始）
   * @param {number} [queryParams.size] 每页数量
   * @returns {Promise<{success: boolean, message: string, data: Object|null, total: number, page: number, size: number}>} 查询结果
   */
  async getCarsByCategory(category, queryParams = {}) {
    try {
      // 验证参数
      if (!category) {
        return {
          success: false,
          message: '类别名称不能为空',
          data: null,
          total: 0,
          page: 1,
          size: 10
        };
      }

      // 设置分页参数
      const opts = {
        page: queryParams.page || 1,
        size: queryParams.size || 10
      };

      // 调用API获取车辆列表
      const response = await api.getCarsByCategory(category, opts);
      console.log('按类别搜索车辆响应:', response);
      
      // 检查响应状态
      if (response.code === 200 || response.code === 0) {
        // 获取成功，返回数据
        return {
          success: true,
          message: '搜索车辆成功',
          data: response.data?.cars || [], // 改为使用data.cars
          total: response.data?.total || 0, // 使用正确的total字段
          page: response.data?.current || 1, // 使用current作为当前页码
          size: queryParams.size || 10 // 使用请求中的size
        };
      }
      
      // 获取失败
      return {
        success: false,
        message: response.message || '搜索车辆失败',
        data: null,
        total: 0,
        page: 1,
        size: 10
      };
    } catch (error) {
      console.error('搜索车辆过程中发生错误:', error);
      return {
        success: false,
        message: error.response?.data?.message || error.message || '搜索车辆过程中发生错误',
        data: null,
        total: 0,
        page: 1,
        size: 10
      };
    }
  }

  /**
   * 按价格范围搜索车辆
   * @param {number} minPrice 最低价格
   * @param {number} maxPrice 最高价格
   * @param {Object} [queryParams] 查询参数
   * @param {number} [queryParams.page] 页码（从1开始）
   * @param {number} [queryParams.size] 每页数量
   * @returns {Promise<{success: boolean, message: string, data: Object|null, total: number, page: number, size: number}>} 查询结果
   */
  async getCarsByPriceRange(minPrice, maxPrice, queryParams = {}) {
    try {
      // 验证参数
      if (minPrice === undefined || minPrice === null || maxPrice === undefined || maxPrice === null) {
        return {
          success: false,
          message: '价格范围不能为空',
          data: null,
          total: 0,
          page: 1,
          size: 10
        };
      }

      // 验证价格范围
      if (minPrice > maxPrice) {
        return {
          success: false,
          message: '最低价格不能高于最高价格',
          data: null,
          total: 0,
          page: 1,
          size: 10
        };
      }

      // 设置分页参数
      const opts = {
        page: queryParams.page || 1,
        size: queryParams.size || 10
      };

      // 调用API获取车辆列表
      const response = await api.getCarsByPriceRange(minPrice, maxPrice, opts);
      console.log('按价格范围搜索车辆响应:', response);
      
      // 检查响应状态
      if (response.code === 200 || response.code === 0) {
        // 获取成功，返回数据
        return {
          success: true,
          message: '搜索车辆成功',
          data: response.data?.cars || [], // 改为使用data.cars
          total: response.data?.total || 0, // 使用正确的total字段
          page: response.data?.current || 1, // 使用current作为当前页码
          size: queryParams.size || 10 // 使用请求中的size
        };
      }
      
      // 获取失败
      return {
        success: false,
        message: response.message || '搜索车辆失败',
        data: null,
        total: 0,
        page: 1,
        size: 10
      };
    } catch (error) {
      console.error('搜索车辆过程中发生错误:', error);
      return {
        success: false,
        message: error.response?.data?.message || error.message || '搜索车辆过程中发生错误',
        data: null,
        total: 0,
        page: 1,
        size: 10
      };
    }
  }

  /**
   * 获取车辆图片
   * @param {number} carId 车辆ID
   * @returns {Promise<{success: boolean, message: string, data: Array|null}>} 查询结果
   */
  async getCarImages(carId) {
    try {
      // 验证参数
      if (!carId) {
        return {
          success: false,
          message: '车辆ID不能为空',
          data: null
        };
      }

      // 调用API获取车辆图片
      const response = await api.getCarImages(carId);
      console.log('获取车辆图片响应:', response);
      
      // 检查响应状态
      if (response.code === 200 || response.code === 0) {
        // 获取成功，返回数据
        const imageList = response.data || [];
        
        // 处理图片URL，添加完整路径
        const processedImageList = imageList.map(img => {
          if (img.url && img.url.startsWith('/')) {
            img.fullUrl = `${import.meta.env.VITE_API_IMAGE_URL || 'http://localhost:8090'}${img.url}`;
          } else {
            img.fullUrl = img.url;
          }
          return img;
        });
        
        return {
          success: true,
          message: '获取车辆图片成功',
          data: processedImageList
        };
      }
      
      // 获取失败
      return {
        success: false,
        message: response.message || '获取车辆图片失败',
        data: null
      };
    } catch (error) {
      console.error('获取车辆图片过程中发生错误:', error);
      return {
        success: false,
        message: error.response?.data?.message || error.message || '获取车辆图片过程中发生错误',
        data: null
      };
    }
  }

  /**
   * 上传车辆图片
   * @param {number} carId 车辆ID
   * @param {string} type 图片类型（'thumbnail'或'full'或'full_1'、'full_2'等）
   * @param {File} file 图片文件
   * @returns {Promise<{success: boolean, message: string, data: Object|null, imageUrl: string|null}>} 上传结果
   */
  async uploadCarImage(carId, type, file) {
    try {
      // 检查是否已登录
      if (!this.isLoggedIn()) {
        return {
          success: false,
          message: '用户未登录',
          data: null,
          imageUrl: null
        };
      }

      // 验证参数
      if (!carId) {
        return {
          success: false,
          message: '车辆ID不能为空',
          data: null,
          imageUrl: null
        };
      }

      // 将类型转换为后端期望的格式
      let apiType;
      if (type === 'thumbnail') {
        apiType = '缩略图';
      } else if (type === 'full') {
        apiType = '完整图1';
      } else if (type.startsWith('full_')) {
        // 提取序号，映射到对应的后端类型
        const index = parseInt(type.split('_')[1], 10);
        
        // 保证序号在有效范围内（1-5）
        if (index >= 1 && index <= 5) {
          apiType = `完整图${index}`;
        } else {
          // 超出范围则使用其他图片类型
          apiType = '细节图'; // 默认使用细节图类型
        }
        console.log(`将前端类型 ${type} 映射为后端类型 ${apiType}`);
      } else if (type === 'exterior') {
        apiType = '外观图';
      } else if (type === 'interior') {
        apiType = '内饰图';
      } else if (type === 'detail') {
        apiType = '细节图';
      } else {
        return {
          success: false,
          message: '图片类型无效，必须是有效的类型标识',
          data: null,
          imageUrl: null
        };
      }

      if (!file) {
        return {
          success: false,
          message: '请选择要上传的图片文件',
          data: null,
          imageUrl: null
        };
      }

      // 验证文件类型
      const validTypes = ['image/jpeg', 'image/png', 'image/gif'];
      if (!validTypes.includes(file.type)) {
        return {
          success: false,
          message: '图片格式不支持，请使用JPG、PNG或GIF格式',
          data: null,
          imageUrl: null
        };
      }

      // 验证文件大小 (最大5MB)
      const maxSize = 5 * 1024 * 1024; // 5MB
      if (file.size > maxSize) {
        return {
          success: false,
          message: '图片文件大小超过限制，最大支持5MB',
          data: null,
          imageUrl: null
        };
      }

      // 创建FormData对象来正确处理multipart/form-data请求
      const formData = new FormData();
      formData.append('file', file);
      formData.append('type', apiType); // 使用转换后的类型作为请求参数
      
      // 获取token并设置headers
      const token = localStorage.getItem('token');
      const headers = {};
      
      // 与apiService.js保持一致的认证头格式
      if (token) {
        headers['Authorization'] = token; // 直接使用token作为值
      }
      
      // 使用 axios 直接发送请求
      const axios = (await import('axios')).default;
      
      // 确定API基础URL
      const baseURL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';
      console.log('API基础URL:', baseURL);
      
      // 使用相对URL，让Vite代理处理请求
      // 这样可以避免CORS问题
      const apiUrl = `/api/cars/${carId}/images`;
      
      // 修正API路径
      console.log(`正在上传图片到: ${apiUrl}`);
      console.log('上传的文件:', file.name, '类型:', file.type, '大小:', file.size, 'bytes');
      console.log('上传的类型参数:', apiType);
      console.log('使用的认证头:', headers.Authorization ? '已设置' : '未设置');
      
      // 定义response变量
      let response;
      
      try {
        // 直接发送multipart请求
        console.log('发送POST请求:', {
          url: apiUrl,
          formData: '包含文件和类型参数',
          headers: {
            Authorization: headers.Authorization ? '已设置' : '未设置',
            'Content-Type': 'multipart/form-data'
          }
        });
        
        const res = await axios.post(
          apiUrl, 
          formData,
          { 
            headers: {
              ...headers,
              'Content-Type': 'multipart/form-data'
            }
          }
        );
        
        // 转换响应格式以匹配现有代码期望
        response = {
          code: res.status,
          data: res.data.data || res.data, // 兼容不同的响应结构
          message: res.data.message || '图片上传成功'
        };
        
        console.log('上传车辆图片响应:', response);
      } catch (err) {
        console.error('图片上传请求失败:', err);
        console.error('详细错误信息:', err.response?.data || err.message);
        console.error('请求配置:', err.config);
        
        // 设置错误响应
        response = {
          code: err.response?.status || 500,
          data: null,
          message: err.response?.data?.message || err.message || '图片上传失败'
        };
      }
      
      // 检查响应状态
      if (response.code === 200 || response.code === 0 || response.code === 201) {
        // 上传成功，处理返回的数据
        let imageUrl = null;
        
        // 从响应中获取图片URL
        if (response.data && response.data.url) {
          imageUrl = response.data.url.startsWith('http') 
            ? response.data.url 
            : `${import.meta.env.VITE_API_IMAGE_URL || 'http://localhost:8090'}${response.data.url}`;
        }
        
        return {
          success: true,
          message: response.message || '图片上传成功',
          data: response.data,
          imageUrl: imageUrl
        };
      }
      
      // 上传失败
      return {
        success: false,
        message: response.message || '图片上传失败',
        data: null,
        imageUrl: null
      };
    } catch (error) {
      console.error('上传车辆图片过程中发生错误:', error);
      return {
        success: false,
        message: error.response?.data?.message || error.message || '上传车辆图片过程中发生错误',
        data: null,
        imageUrl: null
      };
    }
  }

  /**
   * 删除车辆图片
   * @param {number} carId 车辆ID
   * @param {number} imageId 图片ID
   * @returns {Promise<{success: boolean, message: string}>} 删除结果
   */
  async deleteCarImage(carId, imageId) {
    try {
      // 检查是否已登录
      if (!this.isLoggedIn()) {
        return {
          success: false,
          message: '用户未登录'
        };
      }

      // 验证参数
      if (!carId) {
        return {
          success: false,
          message: '车辆ID不能为空'
        };
      }

      if (!imageId) {
        return {
          success: false,
          message: '图片ID不能为空'
        };
      }

      // 调用API删除图片
      const response = await api.deleteCarImage(carId, imageId);
      console.log('删除车辆图片响应:', response);
      
      // 检查响应状态
      if (response.code === 200 || response.code === 0 || response.code === 204) {
        // 删除成功
        return {
          success: true,
          message: response.message || '图片删除成功'
        };
      }
      
      // 删除失败
      return {
        success: false,
        message: response.message || '图片删除失败'
      };
    } catch (error) {
      console.error('删除车辆图片过程中发生错误:', error);
      return {
        success: false,
        message: error.response?.data?.message || error.message || '删除车辆图片过程中发生错误'
      };
    }
  }

  /**
   * 按经销商ID获取车辆列表
   * @param {number} dealerId 经销商ID
   * @param {Object} [queryParams] 查询参数
   * @param {number} [queryParams.page] 页码（从1开始）
   * @param {number} [queryParams.size] 每页数量
   * @param {string} [queryParams.sort] 排序字段
   * @returns {Promise<{success: boolean, message: string, data: Object|null, total: number, page: number, size: number}>} 查询结果
   */
  async getCarsByDealerId(dealerId, queryParams = {}) {
    try {
      // 验证参数
      if (!dealerId) {
        return {
          success: false,
          message: '经销商ID不能为空',
          data: null,
          total: 0,
          page: 1,
          size: 10
        };
      }

      // 设置默认分页参数
      const opts = {
        page: queryParams.page || 1,
        size: queryParams.size || 10,
        sort: queryParams.sort,
        dealerId: dealerId
      };

      // 调用API获取车辆列表
      // 注意：这里复用了getCars方法，在实际情况下可能需要后端提供专门的端点
      const response = await api.getCars(opts);
      console.log('获取经销商车辆列表响应:', response);
      
      // 检查响应状态
      if (response.code === 200 || response.code === 0) {
        // 获取成功，返回数据
        return {
          success: true,
          message: '获取经销商车辆列表成功',
          data: response.data?.cars || [], // 使用data.cars
          total: response.data?.total || 0, // 使用total字段
          page: response.data?.current || 1, // 使用current作为当前页码
          size: queryParams.size || 10 // 使用请求中的size
        };
      }
      
      // 获取失败
      return {
        success: false,
        message: response.message || '获取经销商车辆列表失败',
        data: null,
        total: 0,
        page: 1,
        size: 10
      };
    } catch (error) {
      console.error('获取经销商车辆列表过程中发生错误:', error);
      return {
        success: false,
        message: error.response?.data?.message || error.message || '获取经销商车辆列表过程中发生错误',
        data: null,
        total: 0,
        page: 1,
        size: 10
      };
    }
  }

  /**
   * 更新车辆状态（上架/下架）
   * @param {number} carId 车辆ID
   * @param {number} status 状态值：1-上架，0-下架
   * @returns {Promise<{success: boolean, message: string, data: Object|null}>} 更新结果
   */
  async changeCarStatus(carId, status) {
    try {
      // 检查是否已登录
      if (!this.isLoggedIn()) {
        return {
          success: false,
          message: '用户未登录',
          data: null
        };
      }

      // 验证参数
      if (!carId) {
        return {
          success: false,
          message: '车辆ID不能为空',
          data: null
        };
      }

      if (status !== 0 && status !== 1) {
        return {
          success: false,
          message: '状态值无效，应为0(下架)或1(上架)',
          data: null
        };
      }

      // 构造请求体
      const requestBody = {
        status: status
      };

      // 调用API更新车辆状态
      console.log(`正在更新车辆状态：carId=${carId}, status=${status}`);
      const response = await api.changeCarStatus(carId, requestBody);
      console.log('更新车辆状态响应:', response);
      
      // 检查响应状态
      if (response.code === 200 || response.code === 0) {
        // 更新成功，返回数据
        return {
          success: true,
          message: response.message || (status === 1 ? '车辆已上架' : '车辆已下架'),
          data: response.data
        };
      }
      
      // 更新失败
      return {
        success: false,
        message: response.message || '更新车辆状态失败',
        data: null
      };
    } catch (error) {
      console.error('更新车辆状态过程中发生错误:', error);
      return {
        success: false,
        message: error.response?.data?.message || error.message || '更新车辆状态过程中发生错误',
        data: null
      };
    }
  }
}

// 创建单例实例
const carService = new CarService();

export default carService; 