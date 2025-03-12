// 导入API客户端与相关模型

import ContentAuditDTO from '../../apiclient/src/model/ContentAuditDTO';
import { api } from './apiService';

/**
 * 内容审核服务
 * 处理系统内容的审核相关操作
 */
class ContentAuditService {
  /**
   * 检查用户是否已登录
   * @returns {boolean} 是否已登录
   */
  isLoggedIn() {
    return !!localStorage.getItem('token');
  }

  /**
   * 获取待审核车辆列表
   * @param {Object} [queryParams] 查询参数
   * @param {string} [queryParams.keyword] 关键词
   * @param {string} [queryParams.auditStatus] 审核状态
   * @param {number} [queryParams.dealerId] 经销商ID
   * @param {string} [queryParams.startDate] 提交起始日期
   * @param {string} [queryParams.endDate] 提交结束日期
   * @param {number} [queryParams.page] 页码（从1开始）
   * @param {number} [queryParams.size] 每页数量
   * @returns {Promise<{success: boolean, message: string, data: Array|null, total: number, page: number, size: number}>} 查询结果
   */
  async getCarAuditList(queryParams = {}) {
    try {
      // 检查是否已登录
      if (!this.isLoggedIn()) {
        return {
          success: false,
          message: '用户未登录',
          data: null,
          total: 0,
          page: 1,
          size: 20
        };
      }

      // 设置默认分页参数
      const opts = {
        keyword: queryParams.keyword,
        auditStatus: queryParams.auditStatus,
        dealerId: queryParams.dealerId,
        startDate: queryParams.startDate,
        endDate: queryParams.endDate,
        page: queryParams.page || 1,
        size: queryParams.size || 20
      };

      // 调用API获取待审核车辆列表
      const response = await api.getCarAuditList(opts);
      console.log('获取待审核车辆列表响应:', response);
      
      // 检查响应状态
      if (response.code === 200 || response.code === 0) {
        // 获取成功，返回数据
        return {
          success: true,
          message: '获取待审核车辆列表成功',
          data: response.data?.content || [],
          total: response.data?.totalElements || 0,
          page: response.data?.number + 1 || 1,
          size: response.data?.size || 20
        };
      }
      
      // 获取失败
      return {
        success: false,
        message: response.message || '获取待审核车辆列表失败',
        data: null,
        total: 0,
        page: 1,
        size: 20
      };
    } catch (error) {
      console.error('获取待审核车辆列表过程中发生错误:', error);
      return {
        success: false,
        message: error.response?.data?.message || error.message || '获取待审核车辆列表过程中发生错误',
        data: null,
        total: 0,
        page: 1,
        size: 20
      };
    }
  }

  /**
   * 审核车辆信息
   * @param {number} carId 车辆ID
   * @param {number} status 审核状态（1=通过, 2=拒绝）
   * @param {string} [remarks] 备注说明
   * @returns {Promise<{success: boolean, message: string}>} 审核结果
   */
  async auditCar(carId, status, remarks) {
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

      if (status !== 1 && status !== 2) {
        return {
          success: false,
          message: '审核状态无效，必须是1(通过)或2(拒绝)'
        };
      }

      // 创建ContentAuditDTO对象
      const contentAuditDTO = new ContentAuditDTO(status);
      
      // 设置备注
      if (remarks) {
        contentAuditDTO.remarks = remarks;
      }

      // 调用API审核车辆
      const response = await api.auditCar(carId, contentAuditDTO);
      console.log('审核车辆响应:', response);
      
      // 检查响应状态
      if (response.code === 200 || response.code === 0) {
        // 审核成功
        return {
          success: true,
          message: response.message || '车辆审核成功'
        };
      }
      
      // 审核失败
      return {
        success: false,
        message: response.message || '车辆审核失败'
      };
    } catch (error) {
      console.error('审核车辆过程中发生错误:', error);
      return {
        success: false,
        message: error.response?.data?.message || error.message || '审核车辆过程中发生错误'
      };
    }
  }

  /**
   * 获取内容统计信息
   * @param {string} [contentType='ALL'] 内容类型
   * @returns {Promise<{success: boolean, message: string, data: Object|null}>} 统计结果
   */
  async getContentStatistics(contentType = 'ALL') {
    try {
      // 检查是否已登录
      if (!this.isLoggedIn()) {
        return {
          success: false,
          message: '用户未登录',
          data: null
        };
      }

      // 调用API获取内容统计
      const opts = {
        contentType: contentType
      };
      
      const response = await api.getContentStatistics(opts);
      console.log('获取内容统计响应:', response);
      
      // 检查响应状态
      if (response.code === 200 || response.code === 0) {
        // 获取成功，返回数据
        return {
          success: true,
          message: '获取内容统计成功',
          data: response.data
        };
      }
      
      // 获取失败
      return {
        success: false,
        message: response.message || '获取内容统计失败',
        data: null
      };
    } catch (error) {
      console.error('获取内容统计过程中发生错误:', error);
      return {
        success: false,
        message: error.response?.data?.message || error.message || '获取内容统计过程中发生错误',
        data: null
      };
    }
  }

  /**
   * 批量审核车辆信息
   * @param {Array<number>} carIds 车辆ID数组
   * @param {number} status 审核状态（1=通过, 2=拒绝）
   * @param {string} [remarks] 备注说明
   * @returns {Promise<{success: boolean, message: string, successCount: number, failCount: number}>} 批量审核结果
   */
  async batchAuditCars(carIds, status, remarks) {
    try {
      // 检查是否已登录
      if (!this.isLoggedIn()) {
        return {
          success: false,
          message: '用户未登录',
          successCount: 0,
          failCount: 0
        };
      }

      // 验证参数
      if (!carIds || !Array.isArray(carIds) || carIds.length === 0) {
        return {
          success: false,
          message: '车辆ID列表不能为空',
          successCount: 0,
          failCount: 0
        };
      }

      if (status !== 1 && status !== 2) {
        return {
          success: false,
          message: '审核状态无效，必须是1(通过)或2(拒绝)',
          successCount: 0,
          failCount: 0
        };
      }

      // 创建ContentAuditDTO对象
      const contentAuditDTO = new ContentAuditDTO(status);
      
      // 设置备注
      if (remarks) {
        contentAuditDTO.remarks = remarks;
      }

      // 记录成功和失败的数量
      let successCount = 0;
      let failCount = 0;

      // 逐个调用API审核车辆
      for (const carId of carIds) {
        try {
          const response = await api.auditCar(carId, contentAuditDTO);
          
          if (response.code === 200 || response.code === 0) {
            successCount++;
          } else {
            failCount++;
            console.error(`审核车辆 ${carId} 失败:`, response.message);
          }
        } catch (error) {
          failCount++;
          console.error(`审核车辆 ${carId} 过程中发生错误:`, error);
        }
      }
      
      // 返回批量审核结果
      if (failCount === 0) {
        return {
          success: true,
          message: `批量审核成功，共审核 ${successCount} 个车辆`,
          successCount,
          failCount
        };
      } else if (successCount === 0) {
        return {
          success: false,
          message: `批量审核失败，${failCount} 个车辆审核失败`,
          successCount,
          failCount
        };
      } else {
        return {
          success: true,
          message: `批量审核部分成功，${successCount} 个成功，${failCount} 个失败`,
          successCount,
          failCount
        };
      }
    } catch (error) {
      console.error('批量审核车辆过程中发生错误:', error);
      return {
        success: false,
        message: error.message || '批量审核车辆过程中发生错误',
        successCount: 0,
        failCount: carIds?.length || 0
      };
    }
  }
}

// 创建单例实例
const contentAuditService = new ContentAuditService();

export default contentAuditService; 