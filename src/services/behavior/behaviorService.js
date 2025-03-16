/**
 * 用户行为服务
 * 处理用户行为相关的API请求，如浏览记录等
 */

import axiosInstance from '@services/axios/axiosApiService';

/**
 * 用户行为服务类
 */
class BehaviorService {
  /**
   * 记录用户对特定车辆的浏览行为
   * 如果之前已有浏览记录，会更新时间和累加浏览时长
   * 
   * @param {number} carId - 车辆ID
   * @returns {Promise<Object>} - 返回记录浏览行为的结果
   * 
   * 可能的响应:
   * - 成功: {code: 200, message: "操作成功", data: "记录成功"}
   * - 参数错误: {code: 400, message: "参数错误：缺少car_id", data: null}
   * - 未授权: {code: 401, message: "请先登录", data: null}
   */
  async recordBrowseBehavior(carId) {
    try {
      if (!carId) {
        throw new Error('参数错误：缺少car_id');
      }
      
      // 发送记录浏览行为请求
      const response = await axiosInstance.post(`/behavior/browse?car_id=${carId}`);
      return response;
    } catch (error) {
      // 如果是已知错误类型，直接返回错误信息
      if (error.response) {
        return error.response.data;
      }
      
      // 未知错误，构造一个错误响应
      return {
        code: error.code || 500,
        message: error.message || '记录浏览行为失败',
        data: null
      };
    }
  }
  
  /**
   * 自动记录浏览行为
   * 在用户打开车辆详情页时自动调用，简化开发流程
   * 
   * @param {number} carId - 车辆ID 
   * @param {boolean} silent - 是否静默记录（不显示错误提示）
   * @returns {Promise<boolean>} - 返回是否成功记录
   */
  async autoBrowse(carId, silent = true) {
    try {
      if (!carId) return false;
      
      const response = await this.recordBrowseBehavior(carId);
      return response.code === 200;
    } catch (error) {
      if (!silent) {
        console.error('记录浏览行为失败:', error);
      }
      return false;
    }
  }
}

// 创建并导出用户行为服务实例
const behaviorService = new BehaviorService();
export default behaviorService; 