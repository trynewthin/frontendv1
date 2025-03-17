/**
 * 车辆服务导出文件
 */

import carSearchService from './carSearchService';

export * from './carSearchService';

// 默认导出所有车辆相关服务
export default {
  ...carSearchService
}; 