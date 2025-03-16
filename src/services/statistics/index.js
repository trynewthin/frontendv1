/**
 * 统计服务索引文件
 * 导出所有统计相关服务
 */

import contentStatisticsService from './contentStatisticsService';
import systemStatisticsService from './systemStatisticsService';
import userStatisticsService from './userStatisticsService';

export {
  userStatisticsService,
  systemStatisticsService,
  contentStatisticsService
};

/**
 * 默认导出所有统计服务
 */
export default {
  userStatisticsService,
  systemStatisticsService,
  contentStatisticsService
}; 