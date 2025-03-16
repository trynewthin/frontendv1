/**
 * 服务统一导出文件
 */

import * as communicationServices from './communication';
import * as statisticsServices from './statistics';
// 导入各个分类的服务
import * as userServices from './user';
import * as utilsServices from './utils';

// 导出预约服务
import appointmentAxiosService from './appointment/appointmentAxiosService';
import contentStatisticsService from './statistics/contentStatisticsService';
// Utils 服务
import iconService from './utils/iconService';
import logService from './utils/logService';
import systemStatisticsService from './statistics/systemStatisticsService';
import toastService from './utils/toastService';
// 统计服务
import userStatisticsService from './statistics/userStatisticsService';

// 从分类导出
export * from './user';
export * from './communication';
export * from './utils';
export * from './statistics';

// 导出分类服务集合
export {
  userServices,
  communicationServices,
  utilsServices,
  statisticsServices
};

// 默认导出所有服务
export default {
  ...userServices.default,
  ...communicationServices.default,
  ...utilsServices.default,
  ...statisticsServices.default
};

export {
  appointmentAxiosService,
  userStatisticsService,
  systemStatisticsService,
  contentStatisticsService,
  iconService,
  logService,
  toastService
}; 