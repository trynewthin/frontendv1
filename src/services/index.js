/**
 * 服务统一导出文件
 */

import * as communicationServices from './communication';
// 导入各个分类的服务
import * as userServices from './user';
import * as utilsServices from './utils';

// 导出预约服务
import appointmentAxiosService from './appointment/appointmentAxiosService';

// Utils 服务
import iconService from './utils/iconService';
import logService from './utils/logService';
import toastService from './utils/toastService';

// 从分类导出
export * from './user';
export * from './communication';
export * from './utils';

// 导出分类服务集合
export {
  userServices,
  communicationServices,
  utilsServices
};

// 默认导出所有服务
export default {
  ...userServices.default,
  ...communicationServices.default,
  ...utilsServices.default
};

export { appointmentAxiosService };

// 导出所有服务
export {
  // ... existing exports ...
  iconService,
  logService,
  toastService
}; 