/**
 * 基于Axios的预约服务
 * 使用axiosApiService替代旧的API客户端，解决响应解析问题
 */

import axiosInstance from '@/services/axios/axiosApiService';

/**
 * 预约管理服务 - Axios版本
 * 处理预约的创建和管理
 */
class AppointmentAxiosService {
  /**
   * 检查用户是否已登录
   * @returns {boolean} 是否已登录
   */
  isLoggedIn() {
    return !!localStorage.getItem('token');
  }

  /**
   * 创建预约
   * @param {Object} appointmentData 预约数据
   * @param {number} appointmentData.carId 车辆ID
   * @param {number} appointmentData.dealerId 经销商ID
   * @param {string} appointmentData.appointmentType 预约类型：看车、试驾
   * @param {Date|string} appointmentData.appointmentTime 预约时间，格式为：yyyy-MM-dd HH:mm:ss
   * @param {string} [appointmentData.remarks] 备注信息
   * @returns {Promise<{success: boolean, message: string, data: number|null}>} 创建结果，data为预约ID
   */
  async createAppointment(appointmentData) {
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
      const requiredFields = ['carId', 'dealerId', 'appointmentType', 'appointmentTime'];
      for (const field of requiredFields) {
        if (appointmentData[field] === undefined || appointmentData[field] === null) {
          return {
            success: false,
            message: `${field}不能为空`,
            data: null
          };
        }
      }

      // 验证预约类型
      const validTypes = ['看车', '试驾'];
      if (!validTypes.includes(appointmentData.appointmentType)) {
        return {
          success: false,
          message: '预约类型无效，必须是"看车"或"试驾"',
          data: null
        };
      }

      // 组装请求参数
      const queryParams = {
        carId: appointmentData.carId,
        dealerId: appointmentData.dealerId,
        appointmentType: appointmentData.appointmentType,
        appointmentTime: appointmentData.appointmentTime,
      };

      const requestBody = {
        remarks: appointmentData.remarks || ''
      };

      // 记录请求信息，便于调试
      console.log('创建预约请求参数:', queryParams, requestBody);

      // 使用Axios发送请求
      const response = await axiosInstance.post(
        `/appointment/create`, 
        requestBody, 
        { params: queryParams }
      );
      
      console.log('创建预约响应:', response);

      // Axios会自动解析JSON响应
      // 根据响应中的code判断请求是否成功
      if (response && response.code === 200) {
        return {
          success: true,
          message: response.message || '预约创建成功',
          data: response.data
        };
      } else {
        return {
          success: false,
          message: response?.message || '预约创建失败',
          data: null,
          error: response
        };
      }
    } catch (error) {
      console.error('创建预约请求异常:', error);
      
      // 获取错误响应
      const errorResponse = error.response?.data;
      
      return {
        success: false,
        message: errorResponse?.message || error.message || '创建预约失败，请稍后重试',
        data: null,
        error: errorResponse || error
      };
    }
  }
  
  /**
   * 取消预约
   * @param {number} appointmentId 预约ID
   * @returns {Promise<{success: boolean, message: string}>} 取消结果
   */
  async cancelAppointment(appointmentId) {
    try {
      // 检查是否已登录
      if (!this.isLoggedIn()) {
        return {
          success: false,
          message: '用户未登录'
        };
      }

      // 验证参数
      if (!appointmentId) {
        return {
          success: false,
          message: '预约ID不能为空'
        };
      }

      // 使用Axios发送请求
      const response = await axiosInstance.post(`/appointment/cancel/${appointmentId}`);
      
      console.log('取消预约响应:', response);
      
      // 根据响应中的code判断请求是否成功
      if (response && response.code === 200) {
        return {
          success: true,
          message: response.message || '预约取消成功'
        };
      } else {
        return {
          success: false,
          message: response?.message || '预约取消失败',
          error: response
        };
      }
    } catch (error) {
      console.error('取消预约请求异常:', error);
      
      // 获取错误响应
      const errorResponse = error.response?.data;
      
      return {
        success: false,
        message: errorResponse?.message || error.message || '取消预约失败，请稍后重试',
        error: errorResponse || error
      };
    }
  }
  
  /**
   * 获取用户的预约列表
   * @param {Object} [queryParams] 查询参数
   * @param {string} [queryParams.status] 预约状态：待确认、已确认、已完成、已取消
   * @param {number} [queryParams.pageNum] 页码（从1开始）
   * @param {number} [queryParams.pageSize] 每页数量
   * @returns {Promise<{success: boolean, message: string, data: Array|null, total: number, page: number, size: number}>} 查询结果
   */
  async getUserAppointments(queryParams = {}) {
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
      const params = {
        status: queryParams.status,
        pageNum: queryParams.pageNum || 1,
        pageSize: queryParams.pageSize || 10
      };

      // 使用Axios发送请求
      const response = await axiosInstance.get('/appointment/user/list', { params });
      
      console.log('获取用户预约列表响应:', response);
      
      // 根据响应中的code判断请求是否成功
      if (response && response.code === 200) {
        return {
          success: true,
          message: '获取预约列表成功',
          data: response.data?.records || [],
          total: response.data?.total || 0,
          page: params.pageNum,
          size: params.pageSize
        };
      } else {
        return {
          success: false,
          message: response?.message || '获取预约列表失败',
          data: null,
          total: 0,
          page: 1,
          size: 10
        };
      }
    } catch (error) {
      console.error('获取用户预约列表请求异常:', error);
      
      return {
        success: false,
        message: error.response?.data?.message || error.message || '获取预约列表失败，请稍后重试',
        data: null,
        total: 0,
        page: 1,
        size: 10
      };
    }
  }

  /**
   * 获取经销商的预约列表（仅经销商可用）
   * @param {Object} [queryParams] 查询参数
   * @param {string} [queryParams.status] 预约状态：待确认、已确认、已完成、已取消
   * @param {number} [queryParams.page] 页码（从1开始）
   * @param {number} [queryParams.size] 每页数量
   * @returns {Promise<{success: boolean, message: string, data: {list: Array, total: number, pageNum: number, pageSize: number, pages: number}|null}>} 查询结果
   */
  async getDealerAppointments(queryParams = {}) {
    try {
      // 检查是否已登录
      if (!this.isLoggedIn()) {
        return {
          success: false,
          message: '用户未登录',
          data: null
        };
      }

      // 设置默认分页参数
      const params = {
        status: queryParams.status,
        page: queryParams.page || 1,
        size: queryParams.size || 10
      };

      // 使用Axios发送请求
      const response = await axiosInstance.get('/appointment/dealer', { params });
      
      console.log('获取经销商预约列表响应:', response);
      
      // 根据响应中的code判断请求是否成功
      if (response && response.code === 200) {
        return {
          success: true,
          message: '获取经销商预约列表成功',
          data: response.data || {
            list: [],
            total: 0,
            pageNum: params.page,
            pageSize: params.size,
            pages: 0
          }
        };
      } else {
        return {
          success: false,
          message: response?.message || '获取经销商预约列表失败',
          data: null
        };
      }
    } catch (error) {
      console.error('获取经销商预约列表请求异常:', error);
      
      // 获取错误响应
      const errorResponse = error.response?.data;
      
      return {
        success: false,
        message: errorResponse?.message || error.message || '获取经销商预约列表失败，请稍后重试',
        data: null,
        error: errorResponse || error
      };
    }
  }

  /**
   * 经销商更新预约状态（仅经销商可用）
   * @param {number} appointmentId 预约ID
   * @param {string} status 新状态：已确认、已完成、已取消
   * @returns {Promise<{success: boolean, message: string}>} 更新结果
   */
  async updateAppointmentStatus(appointmentId, status) {
    try {
      // 检查是否已登录
      if (!this.isLoggedIn()) {
        return {
          success: false,
          message: '用户未登录'
        };
      }

      // 验证参数
      if (!appointmentId) {
        return {
          success: false,
          message: '预约ID不能为空'
        };
      }

      // 验证状态
      const validStatuses = ['已确认', '已完成', '已取消'];
      if (!validStatuses.includes(status)) {
        return {
          success: false,
          message: '状态无效，必须是"已确认"、"已完成"或"已取消"'
        };
      }

      // 使用Axios发送请求
      const response = await axiosInstance.put(
        `/appointment/dealer/${appointmentId}/status`, 
        null, 
        { params: { status } }
      );
      
      console.log('更新预约状态响应:', response);
      
      // 根据响应中的code判断请求是否成功
      if (response && response.code === 200) {
        return {
          success: true,
          message: response.message || '更新预约状态成功'
        };
      } else {
        return {
          success: false,
          message: response?.message || '更新预约状态失败',
          error: response
        };
      }
    } catch (error) {
      console.error('更新预约状态请求异常:', error);
      
      // 获取错误响应
      const errorResponse = error.response?.data;
      
      return {
        success: false,
        message: errorResponse?.message || error.message || '更新预约状态失败，请稍后重试',
        error: errorResponse || error
      };
    }
  }
}

// 创建单例实例并导出
const appointmentAxiosService = new AppointmentAxiosService();
export default appointmentAxiosService; 