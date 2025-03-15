// 导入API客户端与相关模型

import { api } from './apiService';

/**
 * 预约管理服务
 * 处理预约的创建、查询和取消等操作
 */
class AppointmentService {
  /**
   * 检查用户是否已登录
   * @returns {boolean} 是否已登录
   */
  isLoggedIn() {
    return !!localStorage.getItem('token');
  }

  /**
   * 获取当前用户的预约列表
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
      const opts = {
        status: queryParams.status,
        pageNum: queryParams.pageNum || 1,
        pageSize: queryParams.pageSize || 10
      };

      // 调用API获取用户预约列表
      const response = await api.getUserAppointments(opts);
      console.log('获取用户预约列表响应:', response);
      
      // 检查响应状态
      if (response.code === 200) {
        // 获取成功，返回数据
        // 注意：这里直接返回原始响应，不做转换
        return response;
      }
      
      // 获取失败
      return {
        success: false,
        message: response.message || '获取预约列表失败',
        data: null,
        total: 0,
        page: 1,
        size: 10
      };
    } catch (error) {
      console.error('获取预约列表过程中发生错误:', error);
      return {
        success: false,
        message: error.response?.data?.message || error.message || '获取预约列表过程中发生错误',
        data: null,
        total: 0,
        page: 1,
        size: 10
      };
    }
  }

  /**
   * 获取经销商的预约列表
   * @param {Object} [queryParams] 查询参数
   * @param {string} [queryParams.status] 预约状态：待确认、已确认、已完成、已取消
   * @param {number} [queryParams.page] 页码（从1开始）
   * @param {number} [queryParams.size] 每页数量
   * @returns {Promise<{success: boolean, message: string, data: Array|null, total: number, page: number, size: number}>} 查询结果
   */
  async getDealerAppointments(queryParams = {}) {
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
        status: queryParams.status,
        page: queryParams.page || 1,
        size: queryParams.size || 10
      };

      // 调用API获取经销商预约列表
      const response = await api.getDealerAppointments(opts);
      console.log('获取经销商预约列表响应:', response);
      
      // 检查响应状态
      if (response.code === 200 || response.code === 0) {
        // 获取成功，返回数据
        return {
          success: true,
          message: '获取预约列表成功',
          data: response.data?.content || [],
          total: response.data?.totalElements || 0,
          page: response.data?.number + 1 || 1,
          size: response.data?.size || 10
        };
      }
      
      // 获取失败
      return {
        success: false,
        message: response.message || '获取预约列表失败',
        data: null,
        total: 0,
        page: 1,
        size: 10
      };
    } catch (error) {
      console.error('获取预约列表过程中发生错误:', error);
      return {
        success: false,
        message: error.response?.data?.message || error.message || '获取预约列表过程中发生错误',
        data: null,
        total: 0,
        page: 1,
        size: 10
      };
    }
  }

  /**
   * 获取车辆的预约列表
   * @param {number} carId 车辆ID
   * @returns {Promise<{success: boolean, message: string, data: Array|null}>} 查询结果
   */
  async getCarAppointments(carId) {
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

      // 调用API获取车辆预约列表
      const response = await api.getCarAppointments(carId);
      console.log('获取车辆预约列表响应:', response);
      
      // 检查响应状态
      if (response.code === 200 || response.code === 0) {
        // 获取成功，返回数据
        return {
          success: true,
          message: '获取车辆预约列表成功',
          data: response.data || []
        };
      }
      
      // 获取失败
      return {
        success: false,
        message: response.message || '获取车辆预约列表失败',
        data: null
      };
    } catch (error) {
      console.error('获取车辆预约列表过程中发生错误:', error);
      return {
        success: false,
        message: error.response?.data?.message || error.message || '获取车辆预约列表过程中发生错误',
        data: null
      };
    }
  }

  /**
   * 创建预约
   * @param {Object} appointmentData 预约数据
   * @param {number} appointmentData.carId 车辆ID
   * @param {number} appointmentData.dealerId 经销商ID
   * @param {string} appointmentData.appointmentType 预约类型：看车、试驾
   * @param {Date|string} appointmentData.appointmentTime 预约时间，如果是字符串，格式应为：yyyy-MM-dd HH:mm:ss
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

      // 组装参数
      const params = {
        carId: appointmentData.carId,
        dealerId: appointmentData.dealerId,
        appointmentType: appointmentData.appointmentType,
        appointmentTime: appointmentData.appointmentTime,  // 直接使用已格式化的时间字符串
        remarks: appointmentData.remarks
      };

      // 记录实际发送的参数，便于调试
      console.log('发送到API的预约参数:', JSON.stringify(params));

      // 调用API创建预约
      const rawResponse = await api.createAppointment(
        params.carId,
        params.dealerId,
        params.appointmentType,
        params.appointmentTime,
        { remarks: params.remarks }
      );
      
      console.log('API原始响应:', rawResponse);
      
      // =====================================
      // 下面开始处理各种可能的响应格式
      // =====================================
      
      // 1. 处理NaN响应
      if (Number.isNaN(rawResponse)) {
        return {
          success: false,
          message: '服务器返回了无效数据',
          data: null
        };
      }
      
      // 2. 处理数字ID响应 - 视为成功
      if (typeof rawResponse === 'number') {
        return {
          success: true,
          message: '预约创建成功',
          data: rawResponse
        };
      }
      
      // 3. 处理字符串响应 - 尝试解析JSON
      if (typeof rawResponse === 'string') {
        try {
          // 尝试解析JSON字符串
          const jsonData = JSON.parse(rawResponse);
          
          // 检查是否包含错误码
          if (jsonData.code !== undefined && jsonData.code !== 200) {
            return {
              success: false,
              message: jsonData.message || '预约创建失败',
              data: null,
              error: jsonData
            };
          }
          
          // 否则视为成功
          return {
            success: true,
            message: jsonData.message || '预约创建成功',
            data: jsonData.data
          };
        } catch (e) {
          // 不是有效的JSON，返回原始字符串
          return {
            success: true, // 默认视为成功
            message: '预约创建成功',
            data: rawResponse
          };
        }
      }
      
      // 4. 处理对象响应
      if (typeof rawResponse === 'object' && rawResponse !== null) {
        // 4.1 检查响应对象是否直接包含code字段
        if (rawResponse.code !== undefined) {
          if (rawResponse.code !== 200) {
            return {
              success: false,
              message: rawResponse.message || '预约创建失败',
              data: null,
              error: rawResponse
            };
          }
          
          // 有code=200，视为成功
          return {
            success: true,
            message: rawResponse.message || '预约创建成功',
            data: rawResponse.data
          };
        }
        
        // 4.2 检查response.body是否包含code字段
        if (rawResponse.body && rawResponse.body.code !== undefined) {
          if (rawResponse.body.code !== 200) {
            return {
              success: false,
              message: rawResponse.body.message || '预约创建失败',
              data: null,
              error: rawResponse.body
            };
          }
          
          // body中有code=200，视为成功
          return {
            success: true,
            message: rawResponse.body.message || '预约创建成功',
            data: rawResponse.body.data
          };
        }
        
        // 4.3 检查response.text是否为JSON字符串
        if (rawResponse.text && typeof rawResponse.text === 'string') {
          try {
            const textData = JSON.parse(rawResponse.text);
            
            // 检查解析后的JSON是否包含错误码
            if (textData.code !== undefined && textData.code !== 200) {
              return {
                success: false,
                message: textData.message || '预约创建失败',
                data: null,
                error: textData
              };
            }
            
            // 否则视为成功
            return {
              success: true,
              message: textData.message || '预约创建成功',
              data: textData.data
            };
          } catch (e) {
            // 解析失败，忽略
          }
        }
        
        // 4.4 如果所有检查都通过，默认视为成功
        return {
          success: true,
          message: '预约创建成功',
          data: rawResponse.data || rawResponse
        };
      }
      
      // 5. 默认情况 - 无法识别的响应
      return {
        success: false,
        message: '服务器返回了无法识别的响应',
        data: null,
        error: { rawResponse }
      };
    } catch (error) {
      console.error('创建预约API请求异常:', error);
      
      // 检查错误对象是否包含响应体
      if (error.response) {
        // 尝试从响应体获取错误信息
        let errorMsg = '预约创建失败';
        let errorData = null;
        
        if (error.response.body) {
          errorData = error.response.body;
          errorMsg = error.response.body.message || errorMsg;
        } else if (error.response.text) {
          try {
            const textObj = JSON.parse(error.response.text);
            errorData = textObj;
            errorMsg = textObj.message || errorMsg;
          } catch (e) {
            // 解析失败，使用原始错误信息
          }
        }
        
        return {
          success: false,
          message: errorMsg,
          data: null,
          error: errorData || error.response
        };
      }
      
      // 抛出异常，让调用者处理
      throw error;
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

      // 调用API取消预约
      const response = await api.cancelAppointment(appointmentId);
      console.log('取消预约响应:', response);
      
      // 检查响应状态
      if (response.code === 200 || response.code === 0) {
        // 取消成功
        return {
          success: true,
          message: response.message || '预约取消成功'
        };
      }
      
      // 取消失败
      return {
        success: false,
        message: response.message || '预约取消失败'
      };
    } catch (error) {
      console.error('取消预约过程中发生错误:', error);
      return {
        success: false,
        message: error.response?.data?.message || error.message || '取消预约过程中发生错误'
      };
    }
  }

  /**
   * 检查预约时间是否可用
   * @param {number} dealerId 经销商ID
   * @param {Date|string} appointmentTime 预约时间，如果是字符串，格式应为：yyyy-MM-dd HH:mm:ss
   * @returns {Promise<{success: boolean, message: string, available: boolean}>} 检查结果
   */
  async checkAppointmentTime(dealerId, appointmentTime) {
    try {
      // 检查是否已登录
      if (!this.isLoggedIn()) {
        return {
          success: false,
          message: '用户未登录',
          available: false
        };
      }

      // 验证参数
      if (!dealerId) {
        return {
          success: false,
          message: '经销商ID不能为空',
          available: false
        };
      }

      if (!appointmentTime) {
        return {
          success: false,
          message: '预约时间不能为空',
          available: false
        };
      }

      // 预约时间格式化处理
      if (appointmentTime instanceof Date) {
        appointmentTime = appointmentTime.toISOString().replace('T', ' ').substring(0, 19);
      }

      // 调用API检查时间可用性
      const available = await api.checkAppointmentTime(dealerId, appointmentTime);
      console.log('检查预约时间响应:', available);
      
      // 直接返回检查结果
      return {
        success: true,
        message: available ? '预约时间可用' : '预约时间不可用',
        available: available
      };
    } catch (error) {
      console.error('检查预约时间过程中发生错误:', error);
      return {
        success: false,
        message: error.response?.data?.message || error.message || '检查预约时间过程中发生错误',
        available: false
      };
    }
  }

  /**
   * 更新预约状态（经销商用）
   * @param {number} appointmentId 预约ID
   * @param {string} status 新状态值：已确认、已完成、已取消
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

      if (!status) {
        return {
          success: false,
          message: '状态不能为空'
        };
      }

      // 验证状态值
      const validStatuses = ['已确认', '已完成', '已取消'];
      if (!validStatuses.includes(status)) {
        return {
          success: false,
          message: '状态值无效，必须是"已确认"、"已完成"或"已取消"'
        };
      }

      // 调用API更新预约状态
      const response = await api.updateStatusByDealer(appointmentId, status);
      console.log('更新预约状态响应:', response);
      
      // 检查响应状态
      if (response.code === 200 || response.code === 0) {
        // 更新成功
        return {
          success: true,
          message: response.message || '预约状态更新成功'
        };
      }
      
      // 更新失败
      return {
        success: false,
        message: response.message || '预约状态更新失败'
      };
    } catch (error) {
      console.error('更新预约状态过程中发生错误:', error);
      return {
        success: false,
        message: error.response?.data?.message || error.message || '更新预约状态过程中发生错误'
      };
    }
  }

  /**
   * 获取即将到来的预约
   * @param {Object} [queryParams] 查询参数
   * @param {number} [queryParams.page] 页码（从1开始）
   * @param {number} [queryParams.size] 每页数量
   * @returns {Promise<{success: boolean, message: string, data: Array|null, total: number, page: number, size: number}>} 查询结果
   */
  async getUpcomingAppointments(queryParams = {}) {
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

      // 调用API获取即将到来的预约
      const response = await api.getUpcomingAppointments(opts);
      console.log('获取即将到来的预约响应:', response);
      
      // 检查响应状态
      if (response.code === 200 || response.code === 0) {
        // 获取成功，返回数据
        return {
          success: true,
          message: '获取即将到来的预约成功',
          data: response.data?.content || [],
          total: response.data?.totalElements || 0,
          page: response.data?.number + 1 || 1,
          size: response.data?.size || 10
        };
      }
      
      // 获取失败
      return {
        success: false,
        message: response.message || '获取即将到来的预约失败',
        data: null,
        total: 0,
        page: 1,
        size: 10
      };
    } catch (error) {
      console.error('获取即将到来的预约过程中发生错误:', error);
      return {
        success: false,
        message: error.response?.data?.message || error.message || '获取即将到来的预约过程中发生错误',
        data: null,
        total: 0,
        page: 1,
        size: 10
      };
    }
  }

  /**
   * 获取待确认的预约数量（经销商用）
   * @returns {Promise<{success: boolean, message: string, count: number}>} 数量结果
   */
  async getPendingAppointmentCount() {
    try {
      // 检查是否已登录
      if (!this.isLoggedIn()) {
        return {
          success: false,
          message: '用户未登录',
          count: 0
        };
      }

      // 调用API获取待确认的预约数量
      const count = await api.getPendingCount();
      console.log('获取待确认的预约数量响应:', count);
      
      // 返回结果
      return {
        success: true,
        message: '获取待确认的预约数量成功',
        count: count || 0
      };
    } catch (error) {
      console.error('获取待确认的预约数量过程中发生错误:', error);
      return {
        success: false,
        message: error.response?.data?.message || error.message || '获取待确认的预约数量过程中发生错误',
        count: 0
      };
    }
  }
}

// 创建单例实例
const appointmentService = new AppointmentService();

export default appointmentService; 