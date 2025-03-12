// 导入API客户端

import { api } from './apiService';

/**
 * 用户行为管理服务
 * 处理用户搜索历史、浏览历史和兴趣分析等行为数据的管理
 */
class BehaviorService {
  /**
   * 检查用户是否已登录
   * @returns {boolean} 是否已登录
   */
  isLoggedIn() {
    return !!localStorage.getItem('token');
  }

  /**
   * 获取搜索历史
   * @param {Object} [queryParams] 查询参数
   * @param {number} [queryParams.page] 页码（从1开始）
   * @param {number} [queryParams.size] 每页数量
   * @returns {Promise<{success: boolean, message: string, data: Array|null, total: number, page: number, size: number}>} 查询结果
   */
  async getSearchHistory(queryParams = {}) {
    try {
      // 检查是否已登录
      if (!this.isLoggedIn()) {
        return {
          success: false,
          message: '用户未登录',
          data: null,
          total: 0,
          page: 1,
          size: 10
        };
      }

      // 设置默认分页参数
      const page = queryParams.page || 1;
      const size = queryParams.size || 10;
      
      // 构建请求URL
      const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api';
      const url = `${baseUrl}/behavior/search?page=${page}&size=${size}`;
      
      // 获取token
      const token = localStorage.getItem('token');
      
      // 直接使用fetch API发送请求，不依赖生成的客户端
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token
        }
      });
      
      // 解析JSON响应
      const result = await response.json();
      console.log('获取搜索历史响应:', result);
      
      // 检查响应是否为空
      if (!result) {
        return {
          success: true,
          message: '暂无搜索记录',
          data: [],
          total: 0,
          page: 1,
          size: 10
        };
      }
      
      // 检查响应状态
      if (result.code === 200 || result.code === 0) {
        // 适配数据结构
        const records = result.data?.records || [];
        
        // 将搜索记录数据转换为前端组件所需格式
        const formattedData = records.map(record => ({
          id: record.behaviorId || Math.random().toString(36).substr(2, 9),
          keyword: record.searchKeywords || '未知搜索',
          createTime: record.searchTime || new Date().toISOString(),
          userId: record.userId
        }));
        
        return {
          success: true,
          message: result.message || (formattedData.length > 0 ? '获取搜索历史成功' : '暂无搜索记录'),
          data: formattedData,
          total: result.data?.total || 0,
          page: result.data?.current || 1,
          size: result.data?.size || 10
        };
      }
      
      // 获取失败
      return {
        success: false,
        message: result.message || '获取搜索历史失败',
        data: null,
        total: 0,
        page: 1,
        size: 10
      };
    } catch (error) {
      console.error('获取搜索历史过程中发生错误:', error);
      return {
        success: false,
        message: error.message || '获取搜索历史过程中发生错误',
        data: null,
        total: 0,
        page: 1,
        size: 10
      };
    }
  }

  /**
   * 记录搜索行为
   * @param {string} keyword 搜索关键词
   * @returns {Promise<{success: boolean, message: string}>} 记录结果
   */
  async recordSearch(keyword) {
    try {
      // 检查是否已登录
      if (!this.isLoggedIn()) {
        return {
          success: false,
          message: '用户未登录'
        };
      }

      // 验证关键词
      if (!keyword || keyword.trim() === '') {
        return {
          success: false,
          message: '搜索关键词不能为空'
        };
      }

      // 创建请求体
      const requestBody = {
        keyword: keyword.trim()
      };

      // 调用API记录搜索行为
      await api.recordSearch(keyword.trim(), requestBody);
      console.log('记录搜索行为成功:', keyword);
      
      return {
        success: true,
        message: '记录搜索行为成功'
      };
    } catch (error) {
      console.error('记录搜索行为过程中发生错误:', error);
      return {
        success: false,
        message: error.response?.data?.message || error.message || '记录搜索行为过程中发生错误'
      };
    }
  }

  /**
   * 清空搜索历史
   * @returns {Promise<{success: boolean, message: string}>} 清空结果
   */
  async clearSearchHistory() {
    try {
      // 检查是否已登录
      if (!this.isLoggedIn()) {
        return {
          success: false,
          message: '用户未登录'
        };
      }

      // 调用API清空搜索历史
      await api.clearSearchHistory();
      console.log('清空搜索历史成功');
      
      return {
        success: true,
        message: '清空搜索历史成功'
      };
    } catch (error) {
      console.error('清空搜索历史过程中发生错误:', error);
      return {
        success: false,
        message: error.response?.data?.message || error.message || '清空搜索历史过程中发生错误'
      };
    }
  }

  /**
   * 删除搜索记录
   * @param {number} searchId 搜索记录ID
   * @returns {Promise<{success: boolean, message: string}>} 删除结果
   */
  async deleteSearchRecord(searchId) {
    try {
      // 检查是否已登录
      if (!this.isLoggedIn()) {
        return {
          success: false,
          message: '用户未登录'
        };
      }

      // 验证搜索记录ID
      if (!searchId) {
        return {
          success: false,
          message: '搜索记录ID不能为空'
        };
      }

      // 调用API删除搜索记录
      await api.deleteSearchRecord(searchId);
      console.log('删除搜索记录成功:', searchId);
      
      return {
        success: true,
        message: '删除搜索记录成功'
      };
    } catch (error) {
      console.error('删除搜索记录过程中发生错误:', error);
      return {
        success: false,
        message: error.response?.data?.message || error.message || '删除搜索记录过程中发生错误'
      };
    }
  }

  /**
   * 获取浏览历史
   * @param {Object} [queryParams] 查询参数
   * @param {number} [queryParams.page] 页码（从1开始）
   * @param {number} [queryParams.size] 每页数量
   * @returns {Promise<{success: boolean, message: string, data: Array|null, total: number, page: number, size: number}>} 查询结果
   */
  async getBrowseHistory(queryParams = {}) {
    try {
      // 检查是否已登录
      if (!this.isLoggedIn()) {
        return {
          success: false,
          message: '用户未登录',
          data: null,
          total: 0,
          page: 1,
          size: 10
        };
      }

      // 设置默认分页参数
      const opts = {
        page: queryParams.page || 1,
        size: queryParams.size || 10
      };

      // 调用API获取浏览历史
      const response = await api.getBrowseHistory(opts);
      console.log('获取浏览历史响应:', response);
      
      // 检查响应是否为空，如果为空则返回空数组（表示暂无记录）
      if (!response) {
        return {
          success: true,
          message: '暂无浏览记录',
          data: [],
          total: 0,
          page: 1,
          size: 10
        };
      }
      
      // 检查响应状态
      if (response.code === 200 || response.code === 0) {
        // 适配新的数据结构
        const records = response.data?.records || [];
        
        // 将汽车数据转换为前端组件所需格式
        const formattedData = records.map(record => ({
          id: record.id || Math.random().toString(36).substr(2, 9),
          carId: record.carId,
          carName: `${record.brand} ${record.model}`,
          carThumbnail: record.image || '/images/cars/default-car.png',
          browseTime: record.browseTime || new Date().toISOString(),
          duration: record.duration || 0,
          brand: record.brand,
          model: record.model
        }));
        
        return {
          success: true,
          message: response.message || (formattedData.length > 0 ? '获取浏览历史成功' : '暂无浏览记录'),
          data: formattedData,
          total: response.data?.total || 0,
          page: response.data?.current || 1,
          size: response.data?.size || 10
        };
      }
      
      // 获取失败
      return {
        success: false,
        message: response.message || '获取浏览历史失败',
        data: null,
        total: 0,
        page: 1,
        size: 10
      };
    } catch (error) {
      console.error('获取浏览历史过程中发生错误:', error);
      return {
        success: false,
        message: error.response?.data?.message || error.message || '获取浏览历史过程中发生错误',
        data: null,
        total: 0,
        page: 1,
        size: 10
      };
    }
  }

  /**
   * 记录浏览行为
   * @param {number} carId 车辆ID
   * @param {number} [duration] 浏览时长(秒)
   * @returns {Promise<{success: boolean, message: string}>} 记录结果
   */
  async recordBrowse(carId, duration = 0) {
    try {
      // 检查是否已登录
      if (!this.isLoggedIn()) {
        return {
          success: false,
          message: '用户未登录'
        };
      }

      // 验证车辆ID
      if (!carId) {
        return {
          success: false,
          message: '车辆ID不能为空'
        };
      }

      // 创建请求体
      const requestBody = {
        duration: duration || 0
      };

      // 调用API记录浏览行为
      await api.recordBrowse(carId, requestBody);
      console.log('记录浏览行为成功:', carId, '浏览时长:', duration, '秒');
      
      return {
        success: true,
        message: '记录浏览行为成功'
      };
    } catch (error) {
      console.error('记录浏览行为过程中发生错误:', error);
      return {
        success: false,
        message: error.response?.data?.message || error.message || '记录浏览行为过程中发生错误'
      };
    }
  }

  /**
   * 清空浏览历史
   * @returns {Promise<{success: boolean, message: string}>} 清空结果
   */
  async clearBrowseHistory() {
    try {
      // 检查是否已登录
      if (!this.isLoggedIn()) {
        return {
          success: false,
          message: '用户未登录'
        };
      }

      // 调用API清空浏览历史
      await api.clearBrowseHistory();
      console.log('清空浏览历史成功');
      
      return {
        success: true,
        message: '清空浏览历史成功'
      };
    } catch (error) {
      console.error('清空浏览历史过程中发生错误:', error);
      return {
        success: false,
        message: error.response?.data?.message || error.message || '清空浏览历史过程中发生错误'
      };
    }
  }

  /**
   * 删除浏览记录
   * @param {number} carId 车辆ID
   * @returns {Promise<{success: boolean, message: string}>} 删除结果
   */
  async deleteBrowseRecord(carId) {
    try {
      // 检查是否已登录
      if (!this.isLoggedIn()) {
        return {
          success: false,
          message: '用户未登录'
        };
      }

      // 验证车辆ID
      if (!carId) {
        return {
          success: false,
          message: '车辆ID不能为空'
        };
      }

      // 调用API删除浏览记录
      await api.deleteBrowseRecord(carId);
      console.log('删除浏览记录成功:', carId);
      
      return {
        success: true,
        message: '删除浏览记录成功'
      };
    } catch (error) {
      console.error('删除浏览记录过程中发生错误:', error);
      return {
        success: false,
        message: error.response?.data?.message || error.message || '删除浏览记录过程中发生错误'
      };
    }
  }

  /**
   * 获取用户兴趣分析
   * @returns {Promise<{success: boolean, message: string, data: Object|null}>} 分析结果
   */
  async getUserInterests() {
    try {
      // 检查是否已登录
      if (!this.isLoggedIn()) {
        return {
          success: false,
          message: '用户未登录',
          data: null
        };
      }

      // 调用API获取用户兴趣分析
      const response = await api.getUserInterests();
      console.log('获取用户兴趣分析响应:', response);
      
      // 检查响应状态
      if (response.code === 200 || response.code === 0) {
        // 获取成功，返回数据
        return {
          success: true,
          message: '获取用户兴趣分析成功',
          data: response.data || null
        };
      }
      
      // 获取失败
      return {
        success: false,
        message: response.message || '获取用户兴趣分析失败',
        data: null
      };
    } catch (error) {
      console.error('获取用户兴趣分析过程中发生错误:', error);
      return {
        success: false,
        message: error.response?.data?.message || error.message || '获取用户兴趣分析过程中发生错误',
        data: null
      };
    }
  }

  /**
   * 获取行为推荐
   * @param {number} [limit=10] 推荐数量限制
   * @returns {Promise<{success: boolean, message: string, data: Array|null}>} 推荐结果
   */
  async getBehaviorRecommendations(limit = 10) {
    try {
      // 检查是否已登录
      if (!this.isLoggedIn()) {
        return {
          success: false,
          message: '用户未登录',
          data: null
        };
      }

      // 设置参数
      const opts = {
        limit: limit
      };

      // 调用API获取行为推荐
      const response = await api.getBehaviorRecommendations(opts);
      console.log('获取行为推荐响应:', response);
      
      // 检查响应状态
      if (response.code === 200 || response.code === 0) {
        // 获取成功，返回数据
        return {
          success: true,
          message: '获取行为推荐成功',
          data: response.data || []
        };
      }
      
      // 获取失败
      return {
        success: false,
        message: response.message || '获取行为推荐失败',
        data: null
      };
    } catch (error) {
      console.error('获取行为推荐过程中发生错误:', error);
      return {
        success: false,
        message: error.response?.data?.message || error.message || '获取行为推荐过程中发生错误',
        data: null
      };
    }
  }
}

// 创建单例实例
const behaviorService = new BehaviorService();

export default behaviorService; 