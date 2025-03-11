# Api.DefaultApi

All URIs are relative to *http://localhost:8080/api*

Method | HTTP request | Description
------------- | ------------- | -------------
[**addFavorite**](DefaultApi.md#addFavorite) | **POST** /favorites | 添加收藏
[**auditCar**](DefaultApi.md#auditCar) | **POST** /admin/audit/cars/{carId} | 审核车辆信息
[**auditDealer**](DefaultApi.md#auditDealer) | **POST** /admin/dealers/{dealerId}/audit | 审核经销商
[**batchDeleteMessages**](DefaultApi.md#batchDeleteMessages) | **DELETE** /message/batch | 批量删除消息
[**batchMarkRead**](DefaultApi.md#batchMarkRead) | **PUT** /message/read/batch | 批量标记消息为已读
[**cancelAppointment**](DefaultApi.md#cancelAppointment) | **PUT** /appointment/{appointmentId}/cancel | 取消预约
[**changeCarStatus**](DefaultApi.md#changeCarStatus) | **PUT** /cars/{car_id}/status | 修改车辆状态
[**checkAppointmentTime**](DefaultApi.md#checkAppointmentTime) | **GET** /appointment/check-time | 检查预约时间是否可用
[**checkIsFavorite**](DefaultApi.md#checkIsFavorite) | **GET** /favorites/check/{carId} | 检查是否收藏
[**clearBrowseHistory**](DefaultApi.md#clearBrowseHistory) | **DELETE** /behavior/browse | 清空浏览历史
[**clearSearchHistory**](DefaultApi.md#clearSearchHistory) | **DELETE** /behavior/search | 清空搜索历史
[**createAppointment**](DefaultApi.md#createAppointment) | **POST** /appointment/create | 创建预约
[**createCar**](DefaultApi.md#createCar) | **POST** /cars | 创建新车辆
[**deleteBrowseRecord**](DefaultApi.md#deleteBrowseRecord) | **DELETE** /behavior/browse/{carId} | 删除浏览记录
[**deleteCar**](DefaultApi.md#deleteCar) | **DELETE** /cars/{car_id} | 删除车辆
[**deleteCar1**](DefaultApi.md#deleteCar1) | **DELETE** /admin/audit/cars/{carId} | 删除车辆
[**deleteCarDetail**](DefaultApi.md#deleteCarDetail) | **DELETE** /cars/{car_id}/detail | 删除车辆详情
[**deleteCarImage**](DefaultApi.md#deleteCarImage) | **DELETE** /cars/{carId}/images/{imageId} | 删除车辆图片
[**deleteDealer**](DefaultApi.md#deleteDealer) | **DELETE** /admin/dealers/{dealerId} | 删除经销商
[**deleteMessage**](DefaultApi.md#deleteMessage) | **DELETE** /message/{messageId} | 删除消息
[**deleteSearchRecord**](DefaultApi.md#deleteSearchRecord) | **DELETE** /behavior/search/{searchId} | 删除搜索记录
[**deleteUser**](DefaultApi.md#deleteUser) | **DELETE** /admin/users/{userId} | 删除用户
[**filterCars**](DefaultApi.md#filterCars) | **POST** /cars/filter | 多条件筛选车辆
[**getBehaviorRecommendations**](DefaultApi.md#getBehaviorRecommendations) | **GET** /recommendations/behavior | 获取行为推荐
[**getBrands**](DefaultApi.md#getBrands) | **GET** /cars/brands | 获取品牌列表
[**getBrowseHistory**](DefaultApi.md#getBrowseHistory) | **GET** /behavior/browse | 获取浏览历史
[**getCarAppointments**](DefaultApi.md#getCarAppointments) | **GET** /appointment/car/{carId} | 获取指定车辆的预约
[**getCarAuditList**](DefaultApi.md#getCarAuditList) | **GET** /admin/audit/cars | 获取待审核车辆
[**getCarDetail**](DefaultApi.md#getCarDetail) | **GET** /cars/{car_id} | 获取车辆详情
[**getCarDetail1**](DefaultApi.md#getCarDetail1) | **GET** /cars/{car_id}/detail | 获取车辆详情
[**getCarDetail2**](DefaultApi.md#getCarDetail2) | **GET** /admin/audit/cars/{carId}/detail | 获取车辆详情
[**getCarFavoriteCount**](DefaultApi.md#getCarFavoriteCount) | **GET** /favorites/count/{carId} | 获取车辆被收藏数量
[**getCarImages**](DefaultApi.md#getCarImages) | **GET** /cars/{carId}/images | 获取车辆图片
[**getCars**](DefaultApi.md#getCars) | **GET** /cars | 获取车辆列表
[**getCarsByBrand**](DefaultApi.md#getCarsByBrand) | **GET** /cars/brand/{brand} | 按品牌查询车辆
[**getCarsByCategory**](DefaultApi.md#getCarsByCategory) | **GET** /cars/category/{category} | 按类别查询车辆
[**getCarsByPriceRange**](DefaultApi.md#getCarsByPriceRange) | **GET** /cars/price | 按价格区间查询
[**getCategories**](DefaultApi.md#getCategories) | **GET** /cars/categories | 获取车型类别
[**getChatMessages**](DefaultApi.md#getChatMessages) | **GET** /message/chat/{contactId} | 获取聊天记录
[**getContentStatistics**](DefaultApi.md#getContentStatistics) | **GET** /admin/statistics/content | 获取内容统计
[**getDealerAppointments**](DefaultApi.md#getDealerAppointments) | **GET** /appointment/dealer | 获取经销商预约列表
[**getDealerDetail**](DefaultApi.md#getDealerDetail) | **GET** /admin/dealers/{dealerId} | 获取经销商详情
[**getDealerList**](DefaultApi.md#getDealerList) | **GET** /admin/dealers | 获取经销商列表
[**getFavoriteCount**](DefaultApi.md#getFavoriteCount) | **GET** /favorites/count | 获取收藏数量
[**getFavoriteList**](DefaultApi.md#getFavoriteList) | **GET** /favorites | 获取收藏列表
[**getHomeRecommendations**](DefaultApi.md#getHomeRecommendations) | **GET** /recommendations/home | 获取首页推荐
[**getHotRecommendations**](DefaultApi.md#getHotRecommendations) | **GET** /recommendations/hot | 获取热门推荐
[**getInteractionMessages**](DefaultApi.md#getInteractionMessages) | **GET** /message/interaction | 获取交互消息
[**getNewCarRecommendations**](DefaultApi.md#getNewCarRecommendations) | **GET** /recommendations/new | 获取新车推荐
[**getPendingCount**](DefaultApi.md#getPendingCount) | **GET** /appointment/pending/count | 获取待确认的预约数量
[**getPendingDealers**](DefaultApi.md#getPendingDealers) | **GET** /dealers/admin/pending | 获取待审核列表
[**getPreferenceRecommendations**](DefaultApi.md#getPreferenceRecommendations) | **GET** /recommendations/preference | 获取偏好推荐
[**getSearchHistory**](DefaultApi.md#getSearchHistory) | **GET** /behavior/search | 获取搜索历史
[**getSystemMessages**](DefaultApi.md#getSystemMessages) | **GET** /message/system | 获取系统消息
[**getSystemStatistics**](DefaultApi.md#getSystemStatistics) | **GET** /admin/statistics/system | 获取系统统计
[**getUnreadCount**](DefaultApi.md#getUnreadCount) | **GET** /message/unread/count | 获取未读消息统计
[**getUpcomingAppointments**](DefaultApi.md#getUpcomingAppointments) | **GET** /appointment/upcoming | 获取即将到来的预约
[**getUserAppointments**](DefaultApi.md#getUserAppointments) | **GET** /appointment/user | 获取用户预约列表
[**getUserDetail**](DefaultApi.md#getUserDetail) | **GET** /admin/users/{userId} | 获取用户详情
[**getUserInterests**](DefaultApi.md#getUserInterests) | **GET** /behavior/interests | 获取用户兴趣分析
[**getUserList**](DefaultApi.md#getUserList) | **GET** /admin/users | 获取用户列表
[**getUserPreference**](DefaultApi.md#getUserPreference) | **GET** /users/preference | 获取偏好设置
[**getUserProfile**](DefaultApi.md#getUserProfile) | **GET** /users/profile | 获取用户资料
[**getUserStatistics**](DefaultApi.md#getUserStatistics) | **GET** /admin/statistics/users | 获取用户统计
[**login**](DefaultApi.md#login) | **POST** /users/login | 用户登录
[**logout**](DefaultApi.md#logout) | **POST** /users/logout | 用户登出
[**markMessageRead**](DefaultApi.md#markMessageRead) | **PUT** /message/{messageId}/read | 标记消息为已读
[**recordBrowse**](DefaultApi.md#recordBrowse) | **POST** /behavior/browse | 记录浏览行为
[**recordSearch**](DefaultApi.md#recordSearch) | **POST** /behavior/search | 记录搜索行为
[**register**](DefaultApi.md#register) | **POST** /users/register | 用户注册
[**removeFavorite**](DefaultApi.md#removeFavorite) | **DELETE** /favorites/{carId} | 取消收藏
[**resetUserPassword**](DefaultApi.md#resetUserPassword) | **POST** /admin/users/{userId}/reset-password | 重置用户密码
[**saveCarDetail**](DefaultApi.md#saveCarDetail) | **POST** /cars/{car_id}/detail | 保存车辆详情
[**searchCars**](DefaultApi.md#searchCars) | **GET** /cars/search | 搜索车辆
[**sendMessage**](DefaultApi.md#sendMessage) | **POST** /message/send | 发送消息
[**submitDealerInfo**](DefaultApi.md#submitDealerInfo) | **POST** /dealers/info | 提交经销商信息
[**submitDealerReview**](DefaultApi.md#submitDealerReview) | **POST** /dealers/review | 提交审核申请
[**updateCar**](DefaultApi.md#updateCar) | **PUT** /cars/{car_id} | 更新车辆信息
[**updateCarDetail**](DefaultApi.md#updateCarDetail) | **PUT** /cars/{car_id}/detail | 更新车辆详情
[**updatePassword**](DefaultApi.md#updatePassword) | **PUT** /users/password | 修改密码
[**updateStatusByDealer**](DefaultApi.md#updateStatusByDealer) | **PUT** /appointment/dealer/{appointmentId}/status | 更新预约状态
[**updateUserPreference**](DefaultApi.md#updateUserPreference) | **PUT** /users/preference | 更新偏好设置
[**updateUserProfile**](DefaultApi.md#updateUserProfile) | **PUT** /users/profile | 更新用户资料
[**updateUserStatus**](DefaultApi.md#updateUserStatus) | **PUT** /admin/users/{userId}/status | 更新用户状态
[**uploadAvatar**](DefaultApi.md#uploadAvatar) | **POST** /users/avatar | 上传头像
[**uploadCarImage**](DefaultApi.md#uploadCarImage) | **POST** /cars/{carId}/images | 上传车辆图片



## addFavorite

> addFavorite(UNKNOWN_PARAMETER_NAME, requestBody)

添加收藏

将指定车辆添加到当前用户的收藏列表中。如果已收藏，则返回409状态码。

### Example

```javascript
import Api from 'api';
let defaultClient = Api.ApiClient.instance;
// Configure API key authorization: Sa-Token
let Sa-Token = defaultClient.authentications['Sa-Token'];
Sa-Token.apiKey = 'YOUR API KEY';
// Uncomment the following line to set a prefix for the API key, e.g. "Token" (defaults to null)
//Sa-Token.apiKeyPrefix = 'Token';

let apiInstance = new Api.DefaultApi();
let UNKNOWN_PARAMETER_NAME = new Api.null(); //  | 车辆ID
let requestBody = {key: null}; // {String: Number} | 
apiInstance.addFavorite(UNKNOWN_PARAMETER_NAME, requestBody).then(() => {
  console.log('API called successfully.');
}, (error) => {
  console.error(error);
});

```

### Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **UNKNOWN_PARAMETER_NAME** | [****](.md)| 车辆ID | 
 **requestBody** | [**{String: Number}**](Number.md)|  | 

### Return type

null (empty response body)

### Authorization

[Sa-Token](../README.md#Sa-Token)

### HTTP request headers

- **Content-Type**: application/json
- **Accept**: application/json


## auditCar

> Result auditCar(carId, contentAuditDTO)

审核车辆信息

对车辆信息进行审核

### Example

```javascript
import Api from 'api';
let defaultClient = Api.ApiClient.instance;
// Configure API key authorization: Sa-Token
let Sa-Token = defaultClient.authentications['Sa-Token'];
Sa-Token.apiKey = 'YOUR API KEY';
// Uncomment the following line to set a prefix for the API key, e.g. "Token" (defaults to null)
//Sa-Token.apiKeyPrefix = 'Token';

let apiInstance = new Api.DefaultApi();
let carId = 56; // Number | 车辆ID
let contentAuditDTO = new Api.ContentAuditDTO(); // ContentAuditDTO | 
apiInstance.auditCar(carId, contentAuditDTO).then((data) => {
  console.log('API called successfully. Returned data: ' + data);
}, (error) => {
  console.error(error);
});

```

### Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **carId** | **Number**| 车辆ID | 
 **contentAuditDTO** | [**ContentAuditDTO**](ContentAuditDTO.md)|  | 

### Return type

[**Result**](Result.md)

### Authorization

[Sa-Token](../README.md#Sa-Token)

### HTTP request headers

- **Content-Type**: application/json
- **Accept**: */*


## auditDealer

> Result auditDealer(dealerId, dealerAuditDTO)

审核经销商

审核经销商资质

### Example

```javascript
import Api from 'api';
let defaultClient = Api.ApiClient.instance;
// Configure API key authorization: Sa-Token
let Sa-Token = defaultClient.authentications['Sa-Token'];
Sa-Token.apiKey = 'YOUR API KEY';
// Uncomment the following line to set a prefix for the API key, e.g. "Token" (defaults to null)
//Sa-Token.apiKeyPrefix = 'Token';

let apiInstance = new Api.DefaultApi();
let dealerId = 56; // Number | 经销商ID
let dealerAuditDTO = new Api.DealerAuditDTO(); // DealerAuditDTO | 
apiInstance.auditDealer(dealerId, dealerAuditDTO).then((data) => {
  console.log('API called successfully. Returned data: ' + data);
}, (error) => {
  console.error(error);
});

```

### Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **dealerId** | **Number**| 经销商ID | 
 **dealerAuditDTO** | [**DealerAuditDTO**](DealerAuditDTO.md)|  | 

### Return type

[**Result**](Result.md)

### Authorization

[Sa-Token](../README.md#Sa-Token)

### HTTP request headers

- **Content-Type**: application/json
- **Accept**: */*


## batchDeleteMessages

> Result batchDeleteMessages(body)

批量删除消息

批量删除多条消息

### Example

```javascript
import Api from 'api';
let defaultClient = Api.ApiClient.instance;
// Configure API key authorization: Sa-Token
let Sa-Token = defaultClient.authentications['Sa-Token'];
Sa-Token.apiKey = 'YOUR API KEY';
// Uncomment the following line to set a prefix for the API key, e.g. "Token" (defaults to null)
//Sa-Token.apiKeyPrefix = 'Token';

let apiInstance = new Api.DefaultApi();
let body = "body_example"; // String | 消息ID列表
apiInstance.batchDeleteMessages(body).then((data) => {
  console.log('API called successfully. Returned data: ' + data);
}, (error) => {
  console.error(error);
});

```

### Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **body** | **String**| 消息ID列表 | 

### Return type

[**Result**](Result.md)

### Authorization

[Sa-Token](../README.md#Sa-Token)

### HTTP request headers

- **Content-Type**: application/json
- **Accept**: */*


## batchMarkRead

> Result batchMarkRead(body)

批量标记消息为已读

将多条消息批量标记为已读状态

### Example

```javascript
import Api from 'api';
let defaultClient = Api.ApiClient.instance;
// Configure API key authorization: Sa-Token
let Sa-Token = defaultClient.authentications['Sa-Token'];
Sa-Token.apiKey = 'YOUR API KEY';
// Uncomment the following line to set a prefix for the API key, e.g. "Token" (defaults to null)
//Sa-Token.apiKeyPrefix = 'Token';

let apiInstance = new Api.DefaultApi();
let body = "body_example"; // String | 消息ID列表
apiInstance.batchMarkRead(body).then((data) => {
  console.log('API called successfully. Returned data: ' + data);
}, (error) => {
  console.error(error);
});

```

### Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **body** | **String**| 消息ID列表 | 

### Return type

[**Result**](Result.md)

### Authorization

[Sa-Token](../README.md#Sa-Token)

### HTTP request headers

- **Content-Type**: application/json
- **Accept**: */*


## cancelAppointment

> Result cancelAppointment(appointmentId)

取消预约

用户取消自己的预约

### Example

```javascript
import Api from 'api';
let defaultClient = Api.ApiClient.instance;
// Configure API key authorization: Sa-Token
let Sa-Token = defaultClient.authentications['Sa-Token'];
Sa-Token.apiKey = 'YOUR API KEY';
// Uncomment the following line to set a prefix for the API key, e.g. "Token" (defaults to null)
//Sa-Token.apiKeyPrefix = 'Token';

let apiInstance = new Api.DefaultApi();
let appointmentId = 56; // Number | 预约ID
apiInstance.cancelAppointment(appointmentId).then((data) => {
  console.log('API called successfully. Returned data: ' + data);
}, (error) => {
  console.error(error);
});

```

### Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **appointmentId** | **Number**| 预约ID | 

### Return type

[**Result**](Result.md)

### Authorization

[Sa-Token](../README.md#Sa-Token)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: */*


## changeCarStatus

> Result changeCarStatus(carId, requestBody)

修改车辆状态

修改车辆的上架/下架状态

### Example

```javascript
import Api from 'api';
let defaultClient = Api.ApiClient.instance;
// Configure API key authorization: Sa-Token
let Sa-Token = defaultClient.authentications['Sa-Token'];
Sa-Token.apiKey = 'YOUR API KEY';
// Uncomment the following line to set a prefix for the API key, e.g. "Token" (defaults to null)
//Sa-Token.apiKeyPrefix = 'Token';

let apiInstance = new Api.DefaultApi();
let carId = 56; // Number | 车辆ID
let requestBody = {key: null}; // {String: Number} | 
apiInstance.changeCarStatus(carId, requestBody).then((data) => {
  console.log('API called successfully. Returned data: ' + data);
}, (error) => {
  console.error(error);
});

```

### Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **carId** | **Number**| 车辆ID | 
 **requestBody** | [**{String: Number}**](Number.md)|  | 

### Return type

[**Result**](Result.md)

### Authorization

[Sa-Token](../README.md#Sa-Token)

### HTTP request headers

- **Content-Type**: application/json
- **Accept**: */*


## checkAppointmentTime

> Boolean checkAppointmentTime(dealerId, appointmentTime)

检查预约时间是否可用

检查指定经销商在指定时间是否可以预约

### Example

```javascript
import Api from 'api';
let defaultClient = Api.ApiClient.instance;
// Configure API key authorization: Sa-Token
let Sa-Token = defaultClient.authentications['Sa-Token'];
Sa-Token.apiKey = 'YOUR API KEY';
// Uncomment the following line to set a prefix for the API key, e.g. "Token" (defaults to null)
//Sa-Token.apiKeyPrefix = 'Token';

let apiInstance = new Api.DefaultApi();
let dealerId = 56; // Number | 经销商ID
let appointmentTime = new Date("2013-10-20T19:20:30+01:00"); // Date | 预约时间，格式：yyyy-MM-dd HH:mm:ss
apiInstance.checkAppointmentTime(dealerId, appointmentTime).then((data) => {
  console.log('API called successfully. Returned data: ' + data);
}, (error) => {
  console.error(error);
});

```

### Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **dealerId** | **Number**| 经销商ID | 
 **appointmentTime** | **Date**| 预约时间，格式：yyyy-MM-dd HH:mm:ss | 

### Return type

**Boolean**

### Authorization

[Sa-Token](../README.md#Sa-Token)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: */*


## checkIsFavorite

> checkIsFavorite(carId)

检查是否收藏

检查指定车辆是否已被当前用户收藏

### Example

```javascript
import Api from 'api';
let defaultClient = Api.ApiClient.instance;
// Configure API key authorization: Sa-Token
let Sa-Token = defaultClient.authentications['Sa-Token'];
Sa-Token.apiKey = 'YOUR API KEY';
// Uncomment the following line to set a prefix for the API key, e.g. "Token" (defaults to null)
//Sa-Token.apiKeyPrefix = 'Token';

let apiInstance = new Api.DefaultApi();
let carId = 1; // Number | 车辆ID
apiInstance.checkIsFavorite(carId).then(() => {
  console.log('API called successfully.');
}, (error) => {
  console.error(error);
});

```

### Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **carId** | **Number**| 车辆ID | 

### Return type

null (empty response body)

### Authorization

[Sa-Token](../README.md#Sa-Token)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: application/json


## clearBrowseHistory

> clearBrowseHistory()

清空浏览历史

清空当前用户的所有浏览记录

### Example

```javascript
import Api from 'api';
let defaultClient = Api.ApiClient.instance;
// Configure API key authorization: Sa-Token
let Sa-Token = defaultClient.authentications['Sa-Token'];
Sa-Token.apiKey = 'YOUR API KEY';
// Uncomment the following line to set a prefix for the API key, e.g. "Token" (defaults to null)
//Sa-Token.apiKeyPrefix = 'Token';

let apiInstance = new Api.DefaultApi();
apiInstance.clearBrowseHistory().then(() => {
  console.log('API called successfully.');
}, (error) => {
  console.error(error);
});

```

### Parameters

This endpoint does not need any parameter.

### Return type

null (empty response body)

### Authorization

[Sa-Token](../README.md#Sa-Token)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: application/json


## clearSearchHistory

> clearSearchHistory()

清空搜索历史

清空当前用户的所有搜索记录

### Example

```javascript
import Api from 'api';
let defaultClient = Api.ApiClient.instance;
// Configure API key authorization: Sa-Token
let Sa-Token = defaultClient.authentications['Sa-Token'];
Sa-Token.apiKey = 'YOUR API KEY';
// Uncomment the following line to set a prefix for the API key, e.g. "Token" (defaults to null)
//Sa-Token.apiKeyPrefix = 'Token';

let apiInstance = new Api.DefaultApi();
apiInstance.clearSearchHistory().then(() => {
  console.log('API called successfully.');
}, (error) => {
  console.error(error);
});

```

### Parameters

This endpoint does not need any parameter.

### Return type

null (empty response body)

### Authorization

[Sa-Token](../README.md#Sa-Token)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: application/json


## createAppointment

> Number createAppointment(carId, dealerId, appointmentType, appointmentTime, opts)

创建预约

创建一个新的预约，需要指定车辆ID、经销商ID、预约类型和时间

### Example

```javascript
import Api from 'api';
let defaultClient = Api.ApiClient.instance;
// Configure API key authorization: Sa-Token
let Sa-Token = defaultClient.authentications['Sa-Token'];
Sa-Token.apiKey = 'YOUR API KEY';
// Uncomment the following line to set a prefix for the API key, e.g. "Token" (defaults to null)
//Sa-Token.apiKeyPrefix = 'Token';

let apiInstance = new Api.DefaultApi();
let carId = 56; // Number | 车辆ID
let dealerId = 56; // Number | 经销商ID
let appointmentType = "appointmentType_example"; // String | 预约类型：看车、试驾
let appointmentTime = new Date("2013-10-20T19:20:30+01:00"); // Date | 预约时间，格式：yyyy-MM-dd HH:mm:ss
let opts = {
  'remarks': "remarks_example" // String | 备注信息
};
apiInstance.createAppointment(carId, dealerId, appointmentType, appointmentTime, opts).then((data) => {
  console.log('API called successfully. Returned data: ' + data);
}, (error) => {
  console.error(error);
});

```

### Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **carId** | **Number**| 车辆ID | 
 **dealerId** | **Number**| 经销商ID | 
 **appointmentType** | **String**| 预约类型：看车、试驾 | 
 **appointmentTime** | **Date**| 预约时间，格式：yyyy-MM-dd HH:mm:ss | 
 **remarks** | **String**| 备注信息 | [optional] 

### Return type

**Number**

### Authorization

[Sa-Token](../README.md#Sa-Token)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: */*


## createCar

> Result createCar(carDTO)

创建新车辆

创建新的车辆信息，包括基本信息和详细配置

### Example

```javascript
import Api from 'api';
let defaultClient = Api.ApiClient.instance;
// Configure API key authorization: Sa-Token
let Sa-Token = defaultClient.authentications['Sa-Token'];
Sa-Token.apiKey = 'YOUR API KEY';
// Uncomment the following line to set a prefix for the API key, e.g. "Token" (defaults to null)
//Sa-Token.apiKeyPrefix = 'Token';

let apiInstance = new Api.DefaultApi();
let carDTO = new Api.CarDTO(); // CarDTO | 
apiInstance.createCar(carDTO).then((data) => {
  console.log('API called successfully. Returned data: ' + data);
}, (error) => {
  console.error(error);
});

```

### Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **carDTO** | [**CarDTO**](CarDTO.md)|  | 

### Return type

[**Result**](Result.md)

### Authorization

[Sa-Token](../README.md#Sa-Token)

### HTTP request headers

- **Content-Type**: application/json
- **Accept**: */*


## deleteBrowseRecord

> deleteBrowseRecord(carId)

删除浏览记录

删除当前用户特定车辆的浏览记录

### Example

```javascript
import Api from 'api';
let defaultClient = Api.ApiClient.instance;
// Configure API key authorization: Sa-Token
let Sa-Token = defaultClient.authentications['Sa-Token'];
Sa-Token.apiKey = 'YOUR API KEY';
// Uncomment the following line to set a prefix for the API key, e.g. "Token" (defaults to null)
//Sa-Token.apiKeyPrefix = 'Token';

let apiInstance = new Api.DefaultApi();
let carId = 1; // Number | 车辆ID
apiInstance.deleteBrowseRecord(carId).then(() => {
  console.log('API called successfully.');
}, (error) => {
  console.error(error);
});

```

### Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **carId** | **Number**| 车辆ID | 

### Return type

null (empty response body)

### Authorization

[Sa-Token](../README.md#Sa-Token)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: application/json


## deleteCar

> Result deleteCar(carId)

删除车辆

删除指定车辆及其所有相关信息（详情、图片等）

### Example

```javascript
import Api from 'api';
let defaultClient = Api.ApiClient.instance;
// Configure API key authorization: Sa-Token
let Sa-Token = defaultClient.authentications['Sa-Token'];
Sa-Token.apiKey = 'YOUR API KEY';
// Uncomment the following line to set a prefix for the API key, e.g. "Token" (defaults to null)
//Sa-Token.apiKeyPrefix = 'Token';

let apiInstance = new Api.DefaultApi();
let carId = 56; // Number | 车辆ID
apiInstance.deleteCar(carId).then((data) => {
  console.log('API called successfully. Returned data: ' + data);
}, (error) => {
  console.error(error);
});

```

### Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **carId** | **Number**| 车辆ID | 

### Return type

[**Result**](Result.md)

### Authorization

[Sa-Token](../README.md#Sa-Token)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: */*


## deleteCar1

> Result deleteCar1(carId)

删除车辆

删除指定的车辆及其关联信息

### Example

```javascript
import Api from 'api';
let defaultClient = Api.ApiClient.instance;
// Configure API key authorization: Sa-Token
let Sa-Token = defaultClient.authentications['Sa-Token'];
Sa-Token.apiKey = 'YOUR API KEY';
// Uncomment the following line to set a prefix for the API key, e.g. "Token" (defaults to null)
//Sa-Token.apiKeyPrefix = 'Token';

let apiInstance = new Api.DefaultApi();
let carId = 56; // Number | 车辆ID
apiInstance.deleteCar1(carId).then((data) => {
  console.log('API called successfully. Returned data: ' + data);
}, (error) => {
  console.error(error);
});

```

### Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **carId** | **Number**| 车辆ID | 

### Return type

[**Result**](Result.md)

### Authorization

[Sa-Token](../README.md#Sa-Token)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: */*


## deleteCarDetail

> Result deleteCarDetail(carId)

删除车辆详情

删除指定车辆的详细配置信息

### Example

```javascript
import Api from 'api';
let defaultClient = Api.ApiClient.instance;
// Configure API key authorization: Sa-Token
let Sa-Token = defaultClient.authentications['Sa-Token'];
Sa-Token.apiKey = 'YOUR API KEY';
// Uncomment the following line to set a prefix for the API key, e.g. "Token" (defaults to null)
//Sa-Token.apiKeyPrefix = 'Token';

let apiInstance = new Api.DefaultApi();
let carId = 56; // Number | 车辆ID
apiInstance.deleteCarDetail(carId).then((data) => {
  console.log('API called successfully. Returned data: ' + data);
}, (error) => {
  console.error(error);
});

```

### Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **carId** | **Number**| 车辆ID | 

### Return type

[**Result**](Result.md)

### Authorization

[Sa-Token](../README.md#Sa-Token)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: */*


## deleteCarImage

> ApiResponseObject deleteCarImage(carId, imageId)

删除车辆图片

删除指定的车辆图片

### Example

```javascript
import Api from 'api';
let defaultClient = Api.ApiClient.instance;
// Configure API key authorization: Sa-Token
let Sa-Token = defaultClient.authentications['Sa-Token'];
Sa-Token.apiKey = 'YOUR API KEY';
// Uncomment the following line to set a prefix for the API key, e.g. "Token" (defaults to null)
//Sa-Token.apiKeyPrefix = 'Token';

let apiInstance = new Api.DefaultApi();
let carId = 56; // Number | 
let imageId = 56; // Number | 
apiInstance.deleteCarImage(carId, imageId).then((data) => {
  console.log('API called successfully. Returned data: ' + data);
}, (error) => {
  console.error(error);
});

```

### Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **carId** | **Number**|  | 
 **imageId** | **Number**|  | 

### Return type

[**ApiResponseObject**](ApiResponseObject.md)

### Authorization

[Sa-Token](../README.md#Sa-Token)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: */*


## deleteDealer

> Result deleteDealer(dealerId)

删除经销商

删除指定经销商及其关联信息

### Example

```javascript
import Api from 'api';
let defaultClient = Api.ApiClient.instance;
// Configure API key authorization: Sa-Token
let Sa-Token = defaultClient.authentications['Sa-Token'];
Sa-Token.apiKey = 'YOUR API KEY';
// Uncomment the following line to set a prefix for the API key, e.g. "Token" (defaults to null)
//Sa-Token.apiKeyPrefix = 'Token';

let apiInstance = new Api.DefaultApi();
let dealerId = 56; // Number | 经销商ID
apiInstance.deleteDealer(dealerId).then((data) => {
  console.log('API called successfully. Returned data: ' + data);
}, (error) => {
  console.error(error);
});

```

### Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **dealerId** | **Number**| 经销商ID | 

### Return type

[**Result**](Result.md)

### Authorization

[Sa-Token](../README.md#Sa-Token)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: */*


## deleteMessage

> Result deleteMessage(messageId)

删除消息

删除指定的消息

### Example

```javascript
import Api from 'api';
let defaultClient = Api.ApiClient.instance;
// Configure API key authorization: Sa-Token
let Sa-Token = defaultClient.authentications['Sa-Token'];
Sa-Token.apiKey = 'YOUR API KEY';
// Uncomment the following line to set a prefix for the API key, e.g. "Token" (defaults to null)
//Sa-Token.apiKeyPrefix = 'Token';

let apiInstance = new Api.DefaultApi();
let messageId = 56; // Number | 消息ID
apiInstance.deleteMessage(messageId).then((data) => {
  console.log('API called successfully. Returned data: ' + data);
}, (error) => {
  console.error(error);
});

```

### Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **messageId** | **Number**| 消息ID | 

### Return type

[**Result**](Result.md)

### Authorization

[Sa-Token](../README.md#Sa-Token)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: */*


## deleteSearchRecord

> deleteSearchRecord(searchId)

删除搜索记录

删除特定的搜索记录

### Example

```javascript
import Api from 'api';
let defaultClient = Api.ApiClient.instance;
// Configure API key authorization: Sa-Token
let Sa-Token = defaultClient.authentications['Sa-Token'];
Sa-Token.apiKey = 'YOUR API KEY';
// Uncomment the following line to set a prefix for the API key, e.g. "Token" (defaults to null)
//Sa-Token.apiKeyPrefix = 'Token';

let apiInstance = new Api.DefaultApi();
let searchId = 10; // Number | 搜索记录ID
apiInstance.deleteSearchRecord(searchId).then(() => {
  console.log('API called successfully.');
}, (error) => {
  console.error(error);
});

```

### Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **searchId** | **Number**| 搜索记录ID | 

### Return type

null (empty response body)

### Authorization

[Sa-Token](../README.md#Sa-Token)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: application/json


## deleteUser

> Result deleteUser(userId)

删除用户

删除指定用户及其关联信息

### Example

```javascript
import Api from 'api';
let defaultClient = Api.ApiClient.instance;
// Configure API key authorization: Sa-Token
let Sa-Token = defaultClient.authentications['Sa-Token'];
Sa-Token.apiKey = 'YOUR API KEY';
// Uncomment the following line to set a prefix for the API key, e.g. "Token" (defaults to null)
//Sa-Token.apiKeyPrefix = 'Token';

let apiInstance = new Api.DefaultApi();
let userId = 56; // Number | 用户ID
apiInstance.deleteUser(userId).then((data) => {
  console.log('API called successfully. Returned data: ' + data);
}, (error) => {
  console.error(error);
});

```

### Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **userId** | **Number**| 用户ID | 

### Return type

[**Result**](Result.md)

### Authorization

[Sa-Token](../README.md#Sa-Token)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: */*


## filterCars

> Result filterCars(requestBody)

多条件筛选车辆

根据多个条件筛选车辆，支持品牌、类别、价格区间等组合查询

### Example

```javascript
import Api from 'api';
let defaultClient = Api.ApiClient.instance;
// Configure API key authorization: Sa-Token
let Sa-Token = defaultClient.authentications['Sa-Token'];
Sa-Token.apiKey = 'YOUR API KEY';
// Uncomment the following line to set a prefix for the API key, e.g. "Token" (defaults to null)
//Sa-Token.apiKeyPrefix = 'Token';

let apiInstance = new Api.DefaultApi();
let requestBody = {key: null}; // {String: Object} | 
apiInstance.filterCars(requestBody).then((data) => {
  console.log('API called successfully. Returned data: ' + data);
}, (error) => {
  console.error(error);
});

```

### Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **requestBody** | [**{String: Object}**](Object.md)|  | 

### Return type

[**Result**](Result.md)

### Authorization

[Sa-Token](../README.md#Sa-Token)

### HTTP request headers

- **Content-Type**: application/json
- **Accept**: */*


## getBehaviorRecommendations

> Result getBehaviorRecommendations(opts)

获取行为推荐

根据用户浏览历史推荐相似车辆

### Example

```javascript
import Api from 'api';
let defaultClient = Api.ApiClient.instance;
// Configure API key authorization: Sa-Token
let Sa-Token = defaultClient.authentications['Sa-Token'];
Sa-Token.apiKey = 'YOUR API KEY';
// Uncomment the following line to set a prefix for the API key, e.g. "Token" (defaults to null)
//Sa-Token.apiKeyPrefix = 'Token';

let apiInstance = new Api.DefaultApi();
let opts = {
  'limit': 10 // Number | 推荐数量限制
};
apiInstance.getBehaviorRecommendations(opts).then((data) => {
  console.log('API called successfully. Returned data: ' + data);
}, (error) => {
  console.error(error);
});

```

### Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **limit** | **Number**| 推荐数量限制 | [optional] [default to 10]

### Return type

[**Result**](Result.md)

### Authorization

[Sa-Token](../README.md#Sa-Token)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: */*


## getBrands

> Result getBrands()

获取品牌列表

获取所有车辆品牌及其数量统计

### Example

```javascript
import Api from 'api';
let defaultClient = Api.ApiClient.instance;
// Configure API key authorization: Sa-Token
let Sa-Token = defaultClient.authentications['Sa-Token'];
Sa-Token.apiKey = 'YOUR API KEY';
// Uncomment the following line to set a prefix for the API key, e.g. "Token" (defaults to null)
//Sa-Token.apiKeyPrefix = 'Token';

let apiInstance = new Api.DefaultApi();
apiInstance.getBrands().then((data) => {
  console.log('API called successfully. Returned data: ' + data);
}, (error) => {
  console.error(error);
});

```

### Parameters

This endpoint does not need any parameter.

### Return type

[**Result**](Result.md)

### Authorization

[Sa-Token](../README.md#Sa-Token)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: */*


## getBrowseHistory

> Result getBrowseHistory(opts)

获取浏览历史

获取当前用户的浏览历史记录列表，包含车辆基本信息和浏览时间、时长等信息。支持分页查询。

### Example

```javascript
import Api from 'api';
let defaultClient = Api.ApiClient.instance;
// Configure API key authorization: Sa-Token
let Sa-Token = defaultClient.authentications['Sa-Token'];
Sa-Token.apiKey = 'YOUR API KEY';
// Uncomment the following line to set a prefix for the API key, e.g. "Token" (defaults to null)
//Sa-Token.apiKeyPrefix = 'Token';

let apiInstance = new Api.DefaultApi();
let opts = {
  'page': 1, // Number | 页码
  'size': 10 // Number | 每页条数
};
apiInstance.getBrowseHistory(opts).then((data) => {
  console.log('API called successfully. Returned data: ' + data);
}, (error) => {
  console.error(error);
});

```

### Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **page** | **Number**| 页码 | [optional] [default to 1]
 **size** | **Number**| 每页条数 | [optional] [default to 10]

### Return type

[**Result**](Result.md)

### Authorization

[Sa-Token](../README.md#Sa-Token)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: application/json


## getCarAppointments

> Result getCarAppointments(carId)

获取指定车辆的预约

获取当前用户关于指定车辆的所有预约

### Example

```javascript
import Api from 'api';
let defaultClient = Api.ApiClient.instance;
// Configure API key authorization: Sa-Token
let Sa-Token = defaultClient.authentications['Sa-Token'];
Sa-Token.apiKey = 'YOUR API KEY';
// Uncomment the following line to set a prefix for the API key, e.g. "Token" (defaults to null)
//Sa-Token.apiKeyPrefix = 'Token';

let apiInstance = new Api.DefaultApi();
let carId = 56; // Number | 车辆ID
apiInstance.getCarAppointments(carId).then((data) => {
  console.log('API called successfully. Returned data: ' + data);
}, (error) => {
  console.error(error);
});

```

### Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **carId** | **Number**| 车辆ID | 

### Return type

[**Result**](Result.md)

### Authorization

[Sa-Token](../README.md#Sa-Token)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: */*


## getCarAuditList

> Result getCarAuditList(opts)

获取待审核车辆

获取待审核的车辆信息列表

### Example

```javascript
import Api from 'api';
let defaultClient = Api.ApiClient.instance;
// Configure API key authorization: Sa-Token
let Sa-Token = defaultClient.authentications['Sa-Token'];
Sa-Token.apiKey = 'YOUR API KEY';
// Uncomment the following line to set a prefix for the API key, e.g. "Token" (defaults to null)
//Sa-Token.apiKeyPrefix = 'Token';

let apiInstance = new Api.DefaultApi();
let opts = {
  'keyword': "keyword_example", // String | 关键词
  'auditStatus': "auditStatus_example", // String | 审核状态
  'dealerId': 56, // Number | 经销商ID
  'startDate': "startDate_example", // String | 提交起始日期
  'endDate': "endDate_example", // String | 提交结束日期
  'page': 1, // Number | 页码
  'size': 20 // Number | 每页记录数
};
apiInstance.getCarAuditList(opts).then((data) => {
  console.log('API called successfully. Returned data: ' + data);
}, (error) => {
  console.error(error);
});

```

### Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **keyword** | **String**| 关键词 | [optional] 
 **auditStatus** | **String**| 审核状态 | [optional] 
 **dealerId** | **Number**| 经销商ID | [optional] 
 **startDate** | **String**| 提交起始日期 | [optional] 
 **endDate** | **String**| 提交结束日期 | [optional] 
 **page** | **Number**| 页码 | [optional] [default to 1]
 **size** | **Number**| 每页记录数 | [optional] [default to 20]

### Return type

[**Result**](Result.md)

### Authorization

[Sa-Token](../README.md#Sa-Token)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: */*


## getCarDetail

> Result getCarDetail(carId)

获取车辆详情

根据车辆ID获取完整的车辆信息，包括基本信息、详细配置和图片

### Example

```javascript
import Api from 'api';
let defaultClient = Api.ApiClient.instance;
// Configure API key authorization: Sa-Token
let Sa-Token = defaultClient.authentications['Sa-Token'];
Sa-Token.apiKey = 'YOUR API KEY';
// Uncomment the following line to set a prefix for the API key, e.g. "Token" (defaults to null)
//Sa-Token.apiKeyPrefix = 'Token';

let apiInstance = new Api.DefaultApi();
let carId = 56; // Number | 车辆ID
apiInstance.getCarDetail(carId).then((data) => {
  console.log('API called successfully. Returned data: ' + data);
}, (error) => {
  console.error(error);
});

```

### Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **carId** | **Number**| 车辆ID | 

### Return type

[**Result**](Result.md)

### Authorization

[Sa-Token](../README.md#Sa-Token)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: */*


## getCarDetail1

> Result getCarDetail1(carId)

获取车辆详情

获取指定车辆的详细配置信息

### Example

```javascript
import Api from 'api';
let defaultClient = Api.ApiClient.instance;
// Configure API key authorization: Sa-Token
let Sa-Token = defaultClient.authentications['Sa-Token'];
Sa-Token.apiKey = 'YOUR API KEY';
// Uncomment the following line to set a prefix for the API key, e.g. "Token" (defaults to null)
//Sa-Token.apiKeyPrefix = 'Token';

let apiInstance = new Api.DefaultApi();
let carId = 56; // Number | 车辆ID
apiInstance.getCarDetail1(carId).then((data) => {
  console.log('API called successfully. Returned data: ' + data);
}, (error) => {
  console.error(error);
});

```

### Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **carId** | **Number**| 车辆ID | 

### Return type

[**Result**](Result.md)

### Authorization

[Sa-Token](../README.md#Sa-Token)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: */*


## getCarDetail2

> Result getCarDetail2(carId)

获取车辆详情

获取待审核车辆的详细信息

### Example

```javascript
import Api from 'api';
let defaultClient = Api.ApiClient.instance;
// Configure API key authorization: Sa-Token
let Sa-Token = defaultClient.authentications['Sa-Token'];
Sa-Token.apiKey = 'YOUR API KEY';
// Uncomment the following line to set a prefix for the API key, e.g. "Token" (defaults to null)
//Sa-Token.apiKeyPrefix = 'Token';

let apiInstance = new Api.DefaultApi();
let carId = 56; // Number | 车辆ID
apiInstance.getCarDetail2(carId).then((data) => {
  console.log('API called successfully. Returned data: ' + data);
}, (error) => {
  console.error(error);
});

```

### Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **carId** | **Number**| 车辆ID | 

### Return type

[**Result**](Result.md)

### Authorization

[Sa-Token](../README.md#Sa-Token)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: */*


## getCarFavoriteCount

> getCarFavoriteCount(carId)

获取车辆被收藏数量

获取指定车辆被所有用户收藏的总次数

### Example

```javascript
import Api from 'api';
let defaultClient = Api.ApiClient.instance;
// Configure API key authorization: Sa-Token
let Sa-Token = defaultClient.authentications['Sa-Token'];
Sa-Token.apiKey = 'YOUR API KEY';
// Uncomment the following line to set a prefix for the API key, e.g. "Token" (defaults to null)
//Sa-Token.apiKeyPrefix = 'Token';

let apiInstance = new Api.DefaultApi();
let carId = 1; // Number | 车辆ID
apiInstance.getCarFavoriteCount(carId).then(() => {
  console.log('API called successfully.');
}, (error) => {
  console.error(error);
});

```

### Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **carId** | **Number**| 车辆ID | 

### Return type

null (empty response body)

### Authorization

[Sa-Token](../README.md#Sa-Token)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: application/json


## getCarImages

> ApiResponseObject getCarImages(carId)

获取车辆图片

获取指定车辆的所有图片列表

### Example

```javascript
import Api from 'api';
let defaultClient = Api.ApiClient.instance;
// Configure API key authorization: Sa-Token
let Sa-Token = defaultClient.authentications['Sa-Token'];
Sa-Token.apiKey = 'YOUR API KEY';
// Uncomment the following line to set a prefix for the API key, e.g. "Token" (defaults to null)
//Sa-Token.apiKeyPrefix = 'Token';

let apiInstance = new Api.DefaultApi();
let carId = 56; // Number | 
apiInstance.getCarImages(carId).then((data) => {
  console.log('API called successfully. Returned data: ' + data);
}, (error) => {
  console.error(error);
});

```

### Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **carId** | **Number**|  | 

### Return type

[**ApiResponseObject**](ApiResponseObject.md)

### Authorization

[Sa-Token](../README.md#Sa-Token)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: */*


## getCars

> Result getCars(opts)

获取车辆列表

分页获取车辆列表，支持按状态和经销商ID筛选

### Example

```javascript
import Api from 'api';
let defaultClient = Api.ApiClient.instance;
// Configure API key authorization: Sa-Token
let Sa-Token = defaultClient.authentications['Sa-Token'];
Sa-Token.apiKey = 'YOUR API KEY';
// Uncomment the following line to set a prefix for the API key, e.g. "Token" (defaults to null)
//Sa-Token.apiKeyPrefix = 'Token';

let apiInstance = new Api.DefaultApi();
let opts = {
  'page': 1, // Number | 页码，默认1
  'size': 10, // Number | 每页数量，默认10
  'status': 56, // Number | 车辆状态：1-在售，0-下架
  'dealerId': 56 // Number | 经销商ID
};
apiInstance.getCars(opts).then((data) => {
  console.log('API called successfully. Returned data: ' + data);
}, (error) => {
  console.error(error);
});

```

### Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **page** | **Number**| 页码，默认1 | [optional] [default to 1]
 **size** | **Number**| 每页数量，默认10 | [optional] [default to 10]
 **status** | **Number**| 车辆状态：1-在售，0-下架 | [optional] 
 **dealerId** | **Number**| 经销商ID | [optional] 

### Return type

[**Result**](Result.md)

### Authorization

[Sa-Token](../README.md#Sa-Token)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: */*


## getCarsByBrand

> Result getCarsByBrand(brand, opts)

按品牌查询车辆

分页获取指定品牌的车辆列表

### Example

```javascript
import Api from 'api';
let defaultClient = Api.ApiClient.instance;
// Configure API key authorization: Sa-Token
let Sa-Token = defaultClient.authentications['Sa-Token'];
Sa-Token.apiKey = 'YOUR API KEY';
// Uncomment the following line to set a prefix for the API key, e.g. "Token" (defaults to null)
//Sa-Token.apiKeyPrefix = 'Token';

let apiInstance = new Api.DefaultApi();
let brand = "brand_example"; // String | 品牌名称
let opts = {
  'page': 1, // Number | 页码，默认1
  'size': 10 // Number | 每页数量，默认10
};
apiInstance.getCarsByBrand(brand, opts).then((data) => {
  console.log('API called successfully. Returned data: ' + data);
}, (error) => {
  console.error(error);
});

```

### Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **brand** | **String**| 品牌名称 | 
 **page** | **Number**| 页码，默认1 | [optional] [default to 1]
 **size** | **Number**| 每页数量，默认10 | [optional] [default to 10]

### Return type

[**Result**](Result.md)

### Authorization

[Sa-Token](../README.md#Sa-Token)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: */*


## getCarsByCategory

> Result getCarsByCategory(category, opts)

按类别查询车辆

分页获取指定类别的车辆列表

### Example

```javascript
import Api from 'api';
let defaultClient = Api.ApiClient.instance;
// Configure API key authorization: Sa-Token
let Sa-Token = defaultClient.authentications['Sa-Token'];
Sa-Token.apiKey = 'YOUR API KEY';
// Uncomment the following line to set a prefix for the API key, e.g. "Token" (defaults to null)
//Sa-Token.apiKeyPrefix = 'Token';

let apiInstance = new Api.DefaultApi();
let category = "category_example"; // String | 车型类别
let opts = {
  'page': 1, // Number | 页码，默认1
  'size': 10 // Number | 每页数量，默认10
};
apiInstance.getCarsByCategory(category, opts).then((data) => {
  console.log('API called successfully. Returned data: ' + data);
}, (error) => {
  console.error(error);
});

```

### Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **category** | **String**| 车型类别 | 
 **page** | **Number**| 页码，默认1 | [optional] [default to 1]
 **size** | **Number**| 每页数量，默认10 | [optional] [default to 10]

### Return type

[**Result**](Result.md)

### Authorization

[Sa-Token](../README.md#Sa-Token)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: */*


## getCarsByPriceRange

> Result getCarsByPriceRange(min, max, opts)

按价格区间查询

分页获取指定价格区间内的车辆列表

### Example

```javascript
import Api from 'api';
let defaultClient = Api.ApiClient.instance;
// Configure API key authorization: Sa-Token
let Sa-Token = defaultClient.authentications['Sa-Token'];
Sa-Token.apiKey = 'YOUR API KEY';
// Uncomment the following line to set a prefix for the API key, e.g. "Token" (defaults to null)
//Sa-Token.apiKeyPrefix = 'Token';

let apiInstance = new Api.DefaultApi();
let min = 3.4; // Number | 最低价格
let max = 3.4; // Number | 最高价格
let opts = {
  'page': 1, // Number | 页码，默认1
  'size': 10 // Number | 每页数量，默认10
};
apiInstance.getCarsByPriceRange(min, max, opts).then((data) => {
  console.log('API called successfully. Returned data: ' + data);
}, (error) => {
  console.error(error);
});

```

### Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **min** | **Number**| 最低价格 | 
 **max** | **Number**| 最高价格 | 
 **page** | **Number**| 页码，默认1 | [optional] [default to 1]
 **size** | **Number**| 每页数量，默认10 | [optional] [default to 10]

### Return type

[**Result**](Result.md)

### Authorization

[Sa-Token](../README.md#Sa-Token)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: */*


## getCategories

> Result getCategories()

获取车型类别

获取所有车型类别（如轿车、SUV等）及其数量统计

### Example

```javascript
import Api from 'api';
let defaultClient = Api.ApiClient.instance;
// Configure API key authorization: Sa-Token
let Sa-Token = defaultClient.authentications['Sa-Token'];
Sa-Token.apiKey = 'YOUR API KEY';
// Uncomment the following line to set a prefix for the API key, e.g. "Token" (defaults to null)
//Sa-Token.apiKeyPrefix = 'Token';

let apiInstance = new Api.DefaultApi();
apiInstance.getCategories().then((data) => {
  console.log('API called successfully. Returned data: ' + data);
}, (error) => {
  console.error(error);
});

```

### Parameters

This endpoint does not need any parameter.

### Return type

[**Result**](Result.md)

### Authorization

[Sa-Token](../README.md#Sa-Token)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: */*


## getChatMessages

> Result getChatMessages(contactId, opts)

获取聊天记录

获取当前用户与指定联系人的聊天记录，支持关联车辆和分页

### Example

```javascript
import Api from 'api';
let defaultClient = Api.ApiClient.instance;
// Configure API key authorization: Sa-Token
let Sa-Token = defaultClient.authentications['Sa-Token'];
Sa-Token.apiKey = 'YOUR API KEY';
// Uncomment the following line to set a prefix for the API key, e.g. "Token" (defaults to null)
//Sa-Token.apiKeyPrefix = 'Token';

let apiInstance = new Api.DefaultApi();
let contactId = 56; // Number | 联系人ID
let opts = {
  'carId': 56, // Number | 关联车辆ID，可选
  'page': 1, // Number | 当前页码，默认1
  'size': 20 // Number | 每页大小，默认20
};
apiInstance.getChatMessages(contactId, opts).then((data) => {
  console.log('API called successfully. Returned data: ' + data);
}, (error) => {
  console.error(error);
});

```

### Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **contactId** | **Number**| 联系人ID | 
 **carId** | **Number**| 关联车辆ID，可选 | [optional] 
 **page** | **Number**| 当前页码，默认1 | [optional] [default to 1]
 **size** | **Number**| 每页大小，默认20 | [optional] [default to 20]

### Return type

[**Result**](Result.md)

### Authorization

[Sa-Token](../README.md#Sa-Token)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: */*


## getContentStatistics

> Result getContentStatistics(opts)

获取内容统计

获取内容相关统计数据

### Example

```javascript
import Api from 'api';
let defaultClient = Api.ApiClient.instance;
// Configure API key authorization: Sa-Token
let Sa-Token = defaultClient.authentications['Sa-Token'];
Sa-Token.apiKey = 'YOUR API KEY';
// Uncomment the following line to set a prefix for the API key, e.g. "Token" (defaults to null)
//Sa-Token.apiKeyPrefix = 'Token';

let apiInstance = new Api.DefaultApi();
let opts = {
  'startDate': "startDate_example", // String | 起始日期
  'endDate': "endDate_example", // String | 结束日期
  'contentType': "'ALL'", // String | 内容类型
  'groupBy': "'DAY'" // String | 分组方式
};
apiInstance.getContentStatistics(opts).then((data) => {
  console.log('API called successfully. Returned data: ' + data);
}, (error) => {
  console.error(error);
});

```

### Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **startDate** | **String**| 起始日期 | [optional] 
 **endDate** | **String**| 结束日期 | [optional] 
 **contentType** | **String**| 内容类型 | [optional] [default to &#39;ALL&#39;]
 **groupBy** | **String**| 分组方式 | [optional] [default to &#39;DAY&#39;]

### Return type

[**Result**](Result.md)

### Authorization

[Sa-Token](../README.md#Sa-Token)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: */*


## getDealerAppointments

> Result getDealerAppointments(opts)

获取经销商预约列表

获取当前经销商的预约列表，可根据状态筛选（仅经销商可用）

### Example

```javascript
import Api from 'api';
let defaultClient = Api.ApiClient.instance;
// Configure API key authorization: Sa-Token
let Sa-Token = defaultClient.authentications['Sa-Token'];
Sa-Token.apiKey = 'YOUR API KEY';
// Uncomment the following line to set a prefix for the API key, e.g. "Token" (defaults to null)
//Sa-Token.apiKeyPrefix = 'Token';

let apiInstance = new Api.DefaultApi();
let opts = {
  'status': "status_example", // String | 预约状态：待确认、已确认、已完成、已取消
  'page': 1, // Number | 当前页码，默认1
  'size': 10 // Number | 每页大小，默认10
};
apiInstance.getDealerAppointments(opts).then((data) => {
  console.log('API called successfully. Returned data: ' + data);
}, (error) => {
  console.error(error);
});

```

### Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **status** | **String**| 预约状态：待确认、已确认、已完成、已取消 | [optional] 
 **page** | **Number**| 当前页码，默认1 | [optional] [default to 1]
 **size** | **Number**| 每页大小，默认10 | [optional] [default to 10]

### Return type

[**Result**](Result.md)

### Authorization

[Sa-Token](../README.md#Sa-Token)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: */*


## getDealerDetail

> Result getDealerDetail(dealerId)

获取经销商详情

获取指定经销商的详细信息

### Example

```javascript
import Api from 'api';
let defaultClient = Api.ApiClient.instance;
// Configure API key authorization: Sa-Token
let Sa-Token = defaultClient.authentications['Sa-Token'];
Sa-Token.apiKey = 'YOUR API KEY';
// Uncomment the following line to set a prefix for the API key, e.g. "Token" (defaults to null)
//Sa-Token.apiKeyPrefix = 'Token';

let apiInstance = new Api.DefaultApi();
let dealerId = 56; // Number | 经销商ID
apiInstance.getDealerDetail(dealerId).then((data) => {
  console.log('API called successfully. Returned data: ' + data);
}, (error) => {
  console.error(error);
});

```

### Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **dealerId** | **Number**| 经销商ID | 

### Return type

[**Result**](Result.md)

### Authorization

[Sa-Token](../README.md#Sa-Token)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: */*


## getDealerList

> Result getDealerList(opts)

获取经销商列表

根据条件获取经销商列表，支持分页和条件筛选

### Example

```javascript
import Api from 'api';
let defaultClient = Api.ApiClient.instance;
// Configure API key authorization: Sa-Token
let Sa-Token = defaultClient.authentications['Sa-Token'];
Sa-Token.apiKey = 'YOUR API KEY';
// Uncomment the following line to set a prefix for the API key, e.g. "Token" (defaults to null)
//Sa-Token.apiKeyPrefix = 'Token';

let apiInstance = new Api.DefaultApi();
let opts = {
  'keyword': "keyword_example", // String | 关键词
  'verifyStatus': "verifyStatus_example", // String | 认证状态
  'region': "region_example", // String | 地区
  'page': 1, // Number | 页码
  'size': 20 // Number | 每页记录数
};
apiInstance.getDealerList(opts).then((data) => {
  console.log('API called successfully. Returned data: ' + data);
}, (error) => {
  console.error(error);
});

```

### Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **keyword** | **String**| 关键词 | [optional] 
 **verifyStatus** | **String**| 认证状态 | [optional] 
 **region** | **String**| 地区 | [optional] 
 **page** | **Number**| 页码 | [optional] [default to 1]
 **size** | **Number**| 每页记录数 | [optional] [default to 20]

### Return type

[**Result**](Result.md)

### Authorization

[Sa-Token](../README.md#Sa-Token)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: */*


## getFavoriteCount

> getFavoriteCount()

获取收藏数量

获取当前用户的收藏总数

### Example

```javascript
import Api from 'api';
let defaultClient = Api.ApiClient.instance;
// Configure API key authorization: Sa-Token
let Sa-Token = defaultClient.authentications['Sa-Token'];
Sa-Token.apiKey = 'YOUR API KEY';
// Uncomment the following line to set a prefix for the API key, e.g. "Token" (defaults to null)
//Sa-Token.apiKeyPrefix = 'Token';

let apiInstance = new Api.DefaultApi();
apiInstance.getFavoriteCount().then(() => {
  console.log('API called successfully.');
}, (error) => {
  console.error(error);
});

```

### Parameters

This endpoint does not need any parameter.

### Return type

null (empty response body)

### Authorization

[Sa-Token](../README.md#Sa-Token)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: application/json


## getFavoriteList

> Result getFavoriteList(opts)

获取收藏列表

获取当前用户的收藏车辆列表，包含车辆基本信息。支持分页查询。

### Example

```javascript
import Api from 'api';
let defaultClient = Api.ApiClient.instance;
// Configure API key authorization: Sa-Token
let Sa-Token = defaultClient.authentications['Sa-Token'];
Sa-Token.apiKey = 'YOUR API KEY';
// Uncomment the following line to set a prefix for the API key, e.g. "Token" (defaults to null)
//Sa-Token.apiKeyPrefix = 'Token';

let apiInstance = new Api.DefaultApi();
let opts = {
  'page': 1, // Number | 页码
  'size': 10 // Number | 每页条数
};
apiInstance.getFavoriteList(opts).then((data) => {
  console.log('API called successfully. Returned data: ' + data);
}, (error) => {
  console.error(error);
});

```

### Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **page** | **Number**| 页码 | [optional] [default to 1]
 **size** | **Number**| 每页条数 | [optional] [default to 10]

### Return type

[**Result**](Result.md)

### Authorization

[Sa-Token](../README.md#Sa-Token)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: application/json


## getHomeRecommendations

> Result getHomeRecommendations(opts)

获取首页推荐

获取首页的个性化推荐和热门推荐

### Example

```javascript
import Api from 'api';
let defaultClient = Api.ApiClient.instance;
// Configure API key authorization: Sa-Token
let Sa-Token = defaultClient.authentications['Sa-Token'];
Sa-Token.apiKey = 'YOUR API KEY';
// Uncomment the following line to set a prefix for the API key, e.g. "Token" (defaults to null)
//Sa-Token.apiKeyPrefix = 'Token';

let apiInstance = new Api.DefaultApi();
let opts = {
  'limit': 10 // Number | 推荐数量限制
};
apiInstance.getHomeRecommendations(opts).then((data) => {
  console.log('API called successfully. Returned data: ' + data);
}, (error) => {
  console.error(error);
});

```

### Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **limit** | **Number**| 推荐数量限制 | [optional] [default to 10]

### Return type

[**Result**](Result.md)

### Authorization

[Sa-Token](../README.md#Sa-Token)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: */*


## getHotRecommendations

> Result getHotRecommendations(opts)

获取热门推荐

获取系统内热门车辆推荐

### Example

```javascript
import Api from 'api';
let defaultClient = Api.ApiClient.instance;
// Configure API key authorization: Sa-Token
let Sa-Token = defaultClient.authentications['Sa-Token'];
Sa-Token.apiKey = 'YOUR API KEY';
// Uncomment the following line to set a prefix for the API key, e.g. "Token" (defaults to null)
//Sa-Token.apiKeyPrefix = 'Token';

let apiInstance = new Api.DefaultApi();
let opts = {
  'category': "SUV", // String | 车辆类别
  'limit': 10, // Number | 推荐数量限制
  'days': 7 // Number | 统计天数
};
apiInstance.getHotRecommendations(opts).then((data) => {
  console.log('API called successfully. Returned data: ' + data);
}, (error) => {
  console.error(error);
});

```

### Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **category** | **String**| 车辆类别 | [optional] 
 **limit** | **Number**| 推荐数量限制 | [optional] [default to 10]
 **days** | **Number**| 统计天数 | [optional] [default to 7]

### Return type

[**Result**](Result.md)

### Authorization

[Sa-Token](../README.md#Sa-Token)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: */*


## getInteractionMessages

> Result getInteractionMessages(opts)

获取交互消息

获取当前用户的交互消息列表，支持已读/未读过滤、交互类型过滤和分页

### Example

```javascript
import Api from 'api';
let defaultClient = Api.ApiClient.instance;
// Configure API key authorization: Sa-Token
let Sa-Token = defaultClient.authentications['Sa-Token'];
Sa-Token.apiKey = 'YOUR API KEY';
// Uncomment the following line to set a prefix for the API key, e.g. "Token" (defaults to null)
//Sa-Token.apiKeyPrefix = 'Token';

let apiInstance = new Api.DefaultApi();
let opts = {
  'read': true, // Boolean | 是否已读：true-已读，false-未读，null-全部
  'interactionType': "interactionType_example", // String | 交互类型：COMMENT/REPLY/QUESTION/CONSULTATION等
  'targetType': "targetType_example", // String | 目标类型：VEHICLE/COMMENT/POST/DEALER等
  'startDate': "startDate_example", // String | 开始日期，格式：yyyy-MM-dd
  'endDate': "endDate_example", // String | 结束日期，格式：yyyy-MM-dd
  'page': 1, // Number | 当前页码，默认1
  'size': 20 // Number | 每页大小，默认20
};
apiInstance.getInteractionMessages(opts).then((data) => {
  console.log('API called successfully. Returned data: ' + data);
}, (error) => {
  console.error(error);
});

```

### Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **read** | **Boolean**| 是否已读：true-已读，false-未读，null-全部 | [optional] 
 **interactionType** | **String**| 交互类型：COMMENT/REPLY/QUESTION/CONSULTATION等 | [optional] 
 **targetType** | **String**| 目标类型：VEHICLE/COMMENT/POST/DEALER等 | [optional] 
 **startDate** | **String**| 开始日期，格式：yyyy-MM-dd | [optional] 
 **endDate** | **String**| 结束日期，格式：yyyy-MM-dd | [optional] 
 **page** | **Number**| 当前页码，默认1 | [optional] [default to 1]
 **size** | **Number**| 每页大小，默认20 | [optional] [default to 20]

### Return type

[**Result**](Result.md)

### Authorization

[Sa-Token](../README.md#Sa-Token)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: */*


## getNewCarRecommendations

> Result getNewCarRecommendations(opts)

获取新车推荐

获取最新上架的车辆推荐

### Example

```javascript
import Api from 'api';
let defaultClient = Api.ApiClient.instance;
// Configure API key authorization: Sa-Token
let Sa-Token = defaultClient.authentications['Sa-Token'];
Sa-Token.apiKey = 'YOUR API KEY';
// Uncomment the following line to set a prefix for the API key, e.g. "Token" (defaults to null)
//Sa-Token.apiKeyPrefix = 'Token';

let apiInstance = new Api.DefaultApi();
let opts = {
  'category': "轿车", // String | 车辆类别
  'limit': 10, // Number | 推荐数量限制
  'days': 30 // Number | 统计天数
};
apiInstance.getNewCarRecommendations(opts).then((data) => {
  console.log('API called successfully. Returned data: ' + data);
}, (error) => {
  console.error(error);
});

```

### Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **category** | **String**| 车辆类别 | [optional] 
 **limit** | **Number**| 推荐数量限制 | [optional] [default to 10]
 **days** | **Number**| 统计天数 | [optional] [default to 30]

### Return type

[**Result**](Result.md)

### Authorization

[Sa-Token](../README.md#Sa-Token)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: */*


## getPendingCount

> Number getPendingCount()

获取待确认的预约数量

获取当前经销商待确认的预约数量（仅经销商可用）

### Example

```javascript
import Api from 'api';
let defaultClient = Api.ApiClient.instance;
// Configure API key authorization: Sa-Token
let Sa-Token = defaultClient.authentications['Sa-Token'];
Sa-Token.apiKey = 'YOUR API KEY';
// Uncomment the following line to set a prefix for the API key, e.g. "Token" (defaults to null)
//Sa-Token.apiKeyPrefix = 'Token';

let apiInstance = new Api.DefaultApi();
apiInstance.getPendingCount().then((data) => {
  console.log('API called successfully. Returned data: ' + data);
}, (error) => {
  console.error(error);
});

```

### Parameters

This endpoint does not need any parameter.

### Return type

**Number**

### Authorization

[Sa-Token](../README.md#Sa-Token)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: */*


## getPendingDealers

> ApiResponseObject getPendingDealers(opts)

获取待审核列表

获取待审核的经销商列表（管理员接口）

### Example

```javascript
import Api from 'api';
let defaultClient = Api.ApiClient.instance;
// Configure API key authorization: Sa-Token
let Sa-Token = defaultClient.authentications['Sa-Token'];
Sa-Token.apiKey = 'YOUR API KEY';
// Uncomment the following line to set a prefix for the API key, e.g. "Token" (defaults to null)
//Sa-Token.apiKeyPrefix = 'Token';

let apiInstance = new Api.DefaultApi();
let opts = {
  'page': 1, // Number | 
  'size': 10 // Number | 
};
apiInstance.getPendingDealers(opts).then((data) => {
  console.log('API called successfully. Returned data: ' + data);
}, (error) => {
  console.error(error);
});

```

### Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **page** | **Number**|  | [optional] [default to 1]
 **size** | **Number**|  | [optional] [default to 10]

### Return type

[**ApiResponseObject**](ApiResponseObject.md)

### Authorization

[Sa-Token](../README.md#Sa-Token)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: */*


## getPreferenceRecommendations

> Result getPreferenceRecommendations(opts)

获取偏好推荐

根据用户设置的购车偏好推荐车辆

### Example

```javascript
import Api from 'api';
let defaultClient = Api.ApiClient.instance;
// Configure API key authorization: Sa-Token
let Sa-Token = defaultClient.authentications['Sa-Token'];
Sa-Token.apiKey = 'YOUR API KEY';
// Uncomment the following line to set a prefix for the API key, e.g. "Token" (defaults to null)
//Sa-Token.apiKeyPrefix = 'Token';

let apiInstance = new Api.DefaultApi();
let opts = {
  'limit': 10 // Number | 推荐数量限制
};
apiInstance.getPreferenceRecommendations(opts).then((data) => {
  console.log('API called successfully. Returned data: ' + data);
}, (error) => {
  console.error(error);
});

```

### Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **limit** | **Number**| 推荐数量限制 | [optional] [default to 10]

### Return type

[**Result**](Result.md)

### Authorization

[Sa-Token](../README.md#Sa-Token)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: */*


## getSearchHistory

> getSearchHistory(opts)

获取搜索历史

获取当前用户的搜索历史记录列表，包含搜索关键词和搜索时间。支持分页查询。

### Example

```javascript
import Api from 'api';
let defaultClient = Api.ApiClient.instance;
// Configure API key authorization: Sa-Token
let Sa-Token = defaultClient.authentications['Sa-Token'];
Sa-Token.apiKey = 'YOUR API KEY';
// Uncomment the following line to set a prefix for the API key, e.g. "Token" (defaults to null)
//Sa-Token.apiKeyPrefix = 'Token';

let apiInstance = new Api.DefaultApi();
let opts = {
  'page': 1, // Number | 页码
  'size': 10 // Number | 每页条数
};
apiInstance.getSearchHistory(opts).then(() => {
  console.log('API called successfully.');
}, (error) => {
  console.error(error);
});

```

### Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **page** | **Number**| 页码 | [optional] [default to 1]
 **size** | **Number**| 每页条数 | [optional] [default to 10]

### Return type

null (empty response body)

### Authorization

[Sa-Token](../README.md#Sa-Token)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: application/json


## getSystemMessages

> Result getSystemMessages(opts)

获取系统消息

获取当前用户的系统消息列表，支持已读/未读过滤和分页

### Example

```javascript
import Api from 'api';
let defaultClient = Api.ApiClient.instance;
// Configure API key authorization: Sa-Token
let Sa-Token = defaultClient.authentications['Sa-Token'];
Sa-Token.apiKey = 'YOUR API KEY';
// Uncomment the following line to set a prefix for the API key, e.g. "Token" (defaults to null)
//Sa-Token.apiKeyPrefix = 'Token';

let apiInstance = new Api.DefaultApi();
let opts = {
  'read': true, // Boolean | 是否已读：true-已读，false-未读，null-全部
  'messageType': "messageType_example", // String | 消息类型：SYSTEM/MARKETING/NOTICE/ACTIVITY等
  'startDate': "startDate_example", // String | 开始日期，格式：yyyy-MM-dd
  'endDate': "endDate_example", // String | 结束日期，格式：yyyy-MM-dd
  'page': 1, // Number | 当前页码，默认1
  'size': 20 // Number | 每页大小，默认20
};
apiInstance.getSystemMessages(opts).then((data) => {
  console.log('API called successfully. Returned data: ' + data);
}, (error) => {
  console.error(error);
});

```

### Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **read** | **Boolean**| 是否已读：true-已读，false-未读，null-全部 | [optional] 
 **messageType** | **String**| 消息类型：SYSTEM/MARKETING/NOTICE/ACTIVITY等 | [optional] 
 **startDate** | **String**| 开始日期，格式：yyyy-MM-dd | [optional] 
 **endDate** | **String**| 结束日期，格式：yyyy-MM-dd | [optional] 
 **page** | **Number**| 当前页码，默认1 | [optional] [default to 1]
 **size** | **Number**| 每页大小，默认20 | [optional] [default to 20]

### Return type

[**Result**](Result.md)

### Authorization

[Sa-Token](../README.md#Sa-Token)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: */*


## getSystemStatistics

> Result getSystemStatistics(opts)

获取系统统计

获取系统相关统计数据

### Example

```javascript
import Api from 'api';
let defaultClient = Api.ApiClient.instance;
// Configure API key authorization: Sa-Token
let Sa-Token = defaultClient.authentications['Sa-Token'];
Sa-Token.apiKey = 'YOUR API KEY';
// Uncomment the following line to set a prefix for the API key, e.g. "Token" (defaults to null)
//Sa-Token.apiKeyPrefix = 'Token';

let apiInstance = new Api.DefaultApi();
let opts = {
  'startDate': "startDate_example", // String | 起始日期
  'endDate': "endDate_example" // String | 结束日期
};
apiInstance.getSystemStatistics(opts).then((data) => {
  console.log('API called successfully. Returned data: ' + data);
}, (error) => {
  console.error(error);
});

```

### Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **startDate** | **String**| 起始日期 | [optional] 
 **endDate** | **String**| 结束日期 | [optional] 

### Return type

[**Result**](Result.md)

### Authorization

[Sa-Token](../README.md#Sa-Token)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: */*


## getUnreadCount

> Result getUnreadCount()

获取未读消息统计

获取当前用户未读消息的数量统计，按消息类型分组

### Example

```javascript
import Api from 'api';
let defaultClient = Api.ApiClient.instance;
// Configure API key authorization: Sa-Token
let Sa-Token = defaultClient.authentications['Sa-Token'];
Sa-Token.apiKey = 'YOUR API KEY';
// Uncomment the following line to set a prefix for the API key, e.g. "Token" (defaults to null)
//Sa-Token.apiKeyPrefix = 'Token';

let apiInstance = new Api.DefaultApi();
apiInstance.getUnreadCount().then((data) => {
  console.log('API called successfully. Returned data: ' + data);
}, (error) => {
  console.error(error);
});

```

### Parameters

This endpoint does not need any parameter.

### Return type

[**Result**](Result.md)

### Authorization

[Sa-Token](../README.md#Sa-Token)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: */*


## getUpcomingAppointments

> Result getUpcomingAppointments(opts)

获取即将到来的预约

获取当前用户即将到来的预约列表（状态为待确认或已确认）

### Example

```javascript
import Api from 'api';
let defaultClient = Api.ApiClient.instance;
// Configure API key authorization: Sa-Token
let Sa-Token = defaultClient.authentications['Sa-Token'];
Sa-Token.apiKey = 'YOUR API KEY';
// Uncomment the following line to set a prefix for the API key, e.g. "Token" (defaults to null)
//Sa-Token.apiKeyPrefix = 'Token';

let apiInstance = new Api.DefaultApi();
let opts = {
  'page': 1, // Number | 当前页码，默认1
  'size': 10 // Number | 每页大小，默认10
};
apiInstance.getUpcomingAppointments(opts).then((data) => {
  console.log('API called successfully. Returned data: ' + data);
}, (error) => {
  console.error(error);
});

```

### Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **page** | **Number**| 当前页码，默认1 | [optional] [default to 1]
 **size** | **Number**| 每页大小，默认10 | [optional] [default to 10]

### Return type

[**Result**](Result.md)

### Authorization

[Sa-Token](../README.md#Sa-Token)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: */*


## getUserAppointments

> Result getUserAppointments(opts)

获取用户预约列表

获取当前用户的预约列表，可根据状态筛选

### Example

```javascript
import Api from 'api';
let defaultClient = Api.ApiClient.instance;
// Configure API key authorization: Sa-Token
let Sa-Token = defaultClient.authentications['Sa-Token'];
Sa-Token.apiKey = 'YOUR API KEY';
// Uncomment the following line to set a prefix for the API key, e.g. "Token" (defaults to null)
//Sa-Token.apiKeyPrefix = 'Token';

let apiInstance = new Api.DefaultApi();
let opts = {
  'status': "status_example", // String | 预约状态：待确认、已确认、已完成、已取消
  'page': 1, // Number | 当前页码，默认1
  'size': 10 // Number | 每页大小，默认10
};
apiInstance.getUserAppointments(opts).then((data) => {
  console.log('API called successfully. Returned data: ' + data);
}, (error) => {
  console.error(error);
});

```

### Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **status** | **String**| 预约状态：待确认、已确认、已完成、已取消 | [optional] 
 **page** | **Number**| 当前页码，默认1 | [optional] [default to 1]
 **size** | **Number**| 每页大小，默认10 | [optional] [default to 10]

### Return type

[**Result**](Result.md)

### Authorization

[Sa-Token](../README.md#Sa-Token)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: */*


## getUserDetail

> Result getUserDetail(userId)

获取用户详情

获取指定用户的详细信息

### Example

```javascript
import Api from 'api';
let defaultClient = Api.ApiClient.instance;
// Configure API key authorization: Sa-Token
let Sa-Token = defaultClient.authentications['Sa-Token'];
Sa-Token.apiKey = 'YOUR API KEY';
// Uncomment the following line to set a prefix for the API key, e.g. "Token" (defaults to null)
//Sa-Token.apiKeyPrefix = 'Token';

let apiInstance = new Api.DefaultApi();
let userId = 56; // Number | 用户ID
apiInstance.getUserDetail(userId).then((data) => {
  console.log('API called successfully. Returned data: ' + data);
}, (error) => {
  console.error(error);
});

```

### Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **userId** | **Number**| 用户ID | 

### Return type

[**Result**](Result.md)

### Authorization

[Sa-Token](../README.md#Sa-Token)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: */*


## getUserInterests

> getUserInterests()

获取用户兴趣分析

获取基于用户行为的兴趣分析数据，包括最常浏览的品牌、最常搜索的关键词、各类行为的数量等统计信息

### Example

```javascript
import Api from 'api';
let defaultClient = Api.ApiClient.instance;
// Configure API key authorization: Sa-Token
let Sa-Token = defaultClient.authentications['Sa-Token'];
Sa-Token.apiKey = 'YOUR API KEY';
// Uncomment the following line to set a prefix for the API key, e.g. "Token" (defaults to null)
//Sa-Token.apiKeyPrefix = 'Token';

let apiInstance = new Api.DefaultApi();
apiInstance.getUserInterests().then(() => {
  console.log('API called successfully.');
}, (error) => {
  console.error(error);
});

```

### Parameters

This endpoint does not need any parameter.

### Return type

null (empty response body)

### Authorization

[Sa-Token](../README.md#Sa-Token)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: application/json


## getUserList

> Result getUserList(opts)

获取用户列表

根据条件获取用户列表，支持分页和条件筛选

### Example

```javascript
import Api from 'api';
let defaultClient = Api.ApiClient.instance;
// Configure API key authorization: Sa-Token
let Sa-Token = defaultClient.authentications['Sa-Token'];
Sa-Token.apiKey = 'YOUR API KEY';
// Uncomment the following line to set a prefix for the API key, e.g. "Token" (defaults to null)
//Sa-Token.apiKeyPrefix = 'Token';

let apiInstance = new Api.DefaultApi();
let opts = {
  'keyword': "keyword_example", // String | 关键词
  'status': "status_example", // String | 用户状态
  'userType': "userType_example", // String | 用户类型
  'startDate': "startDate_example", // String | 注册起始日期
  'endDate': "endDate_example", // String | 注册结束日期
  'page': 1, // Number | 页码
  'size': 20 // Number | 每页记录数
};
apiInstance.getUserList(opts).then((data) => {
  console.log('API called successfully. Returned data: ' + data);
}, (error) => {
  console.error(error);
});

```

### Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **keyword** | **String**| 关键词 | [optional] 
 **status** | **String**| 用户状态 | [optional] 
 **userType** | **String**| 用户类型 | [optional] 
 **startDate** | **String**| 注册起始日期 | [optional] 
 **endDate** | **String**| 注册结束日期 | [optional] 
 **page** | **Number**| 页码 | [optional] [default to 1]
 **size** | **Number**| 每页记录数 | [optional] [default to 20]

### Return type

[**Result**](Result.md)

### Authorization

[Sa-Token](../README.md#Sa-Token)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: */*


## getUserPreference

> ApiResponseUserPreference getUserPreference()

获取偏好设置

获取当前登录用户的偏好设置

### Example

```javascript
import Api from 'api';
let defaultClient = Api.ApiClient.instance;
// Configure API key authorization: Sa-Token
let Sa-Token = defaultClient.authentications['Sa-Token'];
Sa-Token.apiKey = 'YOUR API KEY';
// Uncomment the following line to set a prefix for the API key, e.g. "Token" (defaults to null)
//Sa-Token.apiKeyPrefix = 'Token';

let apiInstance = new Api.DefaultApi();
apiInstance.getUserPreference().then((data) => {
  console.log('API called successfully. Returned data: ' + data);
}, (error) => {
  console.error(error);
});

```

### Parameters

This endpoint does not need any parameter.

### Return type

[**ApiResponseUserPreference**](ApiResponseUserPreference.md)

### Authorization

[Sa-Token](../README.md#Sa-Token)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: */*


## getUserProfile

> ApiResponseUser getUserProfile()

获取用户资料

获取当前登录用户的资料信息

### Example

```javascript
import Api from 'api';
let defaultClient = Api.ApiClient.instance;
// Configure API key authorization: Sa-Token
let Sa-Token = defaultClient.authentications['Sa-Token'];
Sa-Token.apiKey = 'YOUR API KEY';
// Uncomment the following line to set a prefix for the API key, e.g. "Token" (defaults to null)
//Sa-Token.apiKeyPrefix = 'Token';

let apiInstance = new Api.DefaultApi();
apiInstance.getUserProfile().then((data) => {
  console.log('API called successfully. Returned data: ' + data);
}, (error) => {
  console.error(error);
});

```

### Parameters

This endpoint does not need any parameter.

### Return type

[**ApiResponseUser**](ApiResponseUser.md)

### Authorization

[Sa-Token](../README.md#Sa-Token)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: */*


## getUserStatistics

> Result getUserStatistics(opts)

获取用户统计

获取用户相关统计数据

### Example

```javascript
import Api from 'api';
let defaultClient = Api.ApiClient.instance;
// Configure API key authorization: Sa-Token
let Sa-Token = defaultClient.authentications['Sa-Token'];
Sa-Token.apiKey = 'YOUR API KEY';
// Uncomment the following line to set a prefix for the API key, e.g. "Token" (defaults to null)
//Sa-Token.apiKeyPrefix = 'Token';

let apiInstance = new Api.DefaultApi();
let opts = {
  'startDate': "startDate_example", // String | 起始日期
  'endDate': "endDate_example", // String | 结束日期
  'userType': "'ALL'", // String | 用户类型
  'groupBy': "'DAY'" // String | 分组方式
};
apiInstance.getUserStatistics(opts).then((data) => {
  console.log('API called successfully. Returned data: ' + data);
}, (error) => {
  console.error(error);
});

```

### Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **startDate** | **String**| 起始日期 | [optional] 
 **endDate** | **String**| 结束日期 | [optional] 
 **userType** | **String**| 用户类型 | [optional] [default to &#39;ALL&#39;]
 **groupBy** | **String**| 分组方式 | [optional] [default to &#39;DAY&#39;]

### Return type

[**Result**](Result.md)

### Authorization

[Sa-Token](../README.md#Sa-Token)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: */*


## login

> ApiResponseObject login(loginDTO)

用户登录

用户登录接口，支持邮箱和手机号登录

### Example

```javascript
import Api from 'api';

let apiInstance = new Api.DefaultApi();
let loginDTO = new Api.LoginDTO(); // LoginDTO | 
apiInstance.login(loginDTO).then((data) => {
  console.log('API called successfully. Returned data: ' + data);
}, (error) => {
  console.error(error);
});

```

### Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **loginDTO** | [**LoginDTO**](LoginDTO.md)|  | 

### Return type

[**ApiResponseObject**](ApiResponseObject.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: application/json
- **Accept**: */*


## logout

> ApiResponseObject logout()

用户登出

用户登出接口

### Example

```javascript
import Api from 'api';
let defaultClient = Api.ApiClient.instance;
// Configure API key authorization: Sa-Token
let Sa-Token = defaultClient.authentications['Sa-Token'];
Sa-Token.apiKey = 'YOUR API KEY';
// Uncomment the following line to set a prefix for the API key, e.g. "Token" (defaults to null)
//Sa-Token.apiKeyPrefix = 'Token';

let apiInstance = new Api.DefaultApi();
apiInstance.logout().then((data) => {
  console.log('API called successfully. Returned data: ' + data);
}, (error) => {
  console.error(error);
});

```

### Parameters

This endpoint does not need any parameter.

### Return type

[**ApiResponseObject**](ApiResponseObject.md)

### Authorization

[Sa-Token](../README.md#Sa-Token)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: */*


## markMessageRead

> Result markMessageRead(messageId)

标记消息为已读

将指定消息标记为已读状态

### Example

```javascript
import Api from 'api';
let defaultClient = Api.ApiClient.instance;
// Configure API key authorization: Sa-Token
let Sa-Token = defaultClient.authentications['Sa-Token'];
Sa-Token.apiKey = 'YOUR API KEY';
// Uncomment the following line to set a prefix for the API key, e.g. "Token" (defaults to null)
//Sa-Token.apiKeyPrefix = 'Token';

let apiInstance = new Api.DefaultApi();
let messageId = 56; // Number | 消息ID
apiInstance.markMessageRead(messageId).then((data) => {
  console.log('API called successfully. Returned data: ' + data);
}, (error) => {
  console.error(error);
});

```

### Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **messageId** | **Number**| 消息ID | 

### Return type

[**Result**](Result.md)

### Authorization

[Sa-Token](../README.md#Sa-Token)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: */*


## recordBrowse

> recordBrowse(UNKNOWN_PARAMETER_NAME, requestBody)

记录浏览行为

记录用户对特定车辆的浏览行为。如果之前已有浏览记录，会更新时间和累加浏览时长。

### Example

```javascript
import Api from 'api';
let defaultClient = Api.ApiClient.instance;
// Configure API key authorization: Sa-Token
let Sa-Token = defaultClient.authentications['Sa-Token'];
Sa-Token.apiKey = 'YOUR API KEY';
// Uncomment the following line to set a prefix for the API key, e.g. "Token" (defaults to null)
//Sa-Token.apiKeyPrefix = 'Token';

let apiInstance = new Api.DefaultApi();
let UNKNOWN_PARAMETER_NAME = new Api.null(); //  | 车辆ID
let requestBody = {key: null}; // {String: Number} | 
apiInstance.recordBrowse(UNKNOWN_PARAMETER_NAME, requestBody).then(() => {
  console.log('API called successfully.');
}, (error) => {
  console.error(error);
});

```

### Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **UNKNOWN_PARAMETER_NAME** | [****](.md)| 车辆ID | 
 **requestBody** | [**{String: Number}**](Number.md)|  | 

### Return type

null (empty response body)

### Authorization

[Sa-Token](../README.md#Sa-Token)

### HTTP request headers

- **Content-Type**: application/json
- **Accept**: application/json


## recordSearch

> recordSearch(UNKNOWN_PARAMETER_NAME, requestBody)

记录搜索行为

记录用户的搜索关键词，每次搜索都会创建新的记录

### Example

```javascript
import Api from 'api';
let defaultClient = Api.ApiClient.instance;
// Configure API key authorization: Sa-Token
let Sa-Token = defaultClient.authentications['Sa-Token'];
Sa-Token.apiKey = 'YOUR API KEY';
// Uncomment the following line to set a prefix for the API key, e.g. "Token" (defaults to null)
//Sa-Token.apiKeyPrefix = 'Token';

let apiInstance = new Api.DefaultApi();
let UNKNOWN_PARAMETER_NAME = new Api.null(); //  | 搜索关键词
let requestBody = {key: "null"}; // {String: String} | 
apiInstance.recordSearch(UNKNOWN_PARAMETER_NAME, requestBody).then(() => {
  console.log('API called successfully.');
}, (error) => {
  console.error(error);
});

```

### Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **UNKNOWN_PARAMETER_NAME** | [****](.md)| 搜索关键词 | 
 **requestBody** | [**{String: String}**](String.md)|  | 

### Return type

null (empty response body)

### Authorization

[Sa-Token](../README.md#Sa-Token)

### HTTP request headers

- **Content-Type**: application/json
- **Accept**: application/json


## register

> ApiResponseUser register(userDTO)

用户注册

新用户注册接口

### Example

```javascript
import Api from 'api';

let apiInstance = new Api.DefaultApi();
let userDTO = new Api.UserDTO(); // UserDTO | 
apiInstance.register(userDTO).then((data) => {
  console.log('API called successfully. Returned data: ' + data);
}, (error) => {
  console.error(error);
});

```

### Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **userDTO** | [**UserDTO**](UserDTO.md)|  | 

### Return type

[**ApiResponseUser**](ApiResponseUser.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: application/json
- **Accept**: */*


## removeFavorite

> removeFavorite(carId)

取消收藏

将指定车辆从当前用户的收藏列表中移除。如果未收藏，则返回404状态码。

### Example

```javascript
import Api from 'api';
let defaultClient = Api.ApiClient.instance;
// Configure API key authorization: Sa-Token
let Sa-Token = defaultClient.authentications['Sa-Token'];
Sa-Token.apiKey = 'YOUR API KEY';
// Uncomment the following line to set a prefix for the API key, e.g. "Token" (defaults to null)
//Sa-Token.apiKeyPrefix = 'Token';

let apiInstance = new Api.DefaultApi();
let carId = 2; // Number | 车辆ID
apiInstance.removeFavorite(carId).then(() => {
  console.log('API called successfully.');
}, (error) => {
  console.error(error);
});

```

### Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **carId** | **Number**| 车辆ID | 

### Return type

null (empty response body)

### Authorization

[Sa-Token](../README.md#Sa-Token)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: application/json


## resetUserPassword

> Result resetUserPassword(userId, opts)

重置用户密码

重置用户密码为随机密码

### Example

```javascript
import Api from 'api';
let defaultClient = Api.ApiClient.instance;
// Configure API key authorization: Sa-Token
let Sa-Token = defaultClient.authentications['Sa-Token'];
Sa-Token.apiKey = 'YOUR API KEY';
// Uncomment the following line to set a prefix for the API key, e.g. "Token" (defaults to null)
//Sa-Token.apiKeyPrefix = 'Token';

let apiInstance = new Api.DefaultApi();
let userId = 56; // Number | 用户ID
let opts = {
  'notifyUser': true // Boolean | 是否通知用户
};
apiInstance.resetUserPassword(userId, opts).then((data) => {
  console.log('API called successfully. Returned data: ' + data);
}, (error) => {
  console.error(error);
});

```

### Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **userId** | **Number**| 用户ID | 
 **notifyUser** | **Boolean**| 是否通知用户 | [optional] [default to true]

### Return type

[**Result**](Result.md)

### Authorization

[Sa-Token](../README.md#Sa-Token)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: */*


## saveCarDetail

> Result saveCarDetail(carId, carDetailDTO)

保存车辆详情

保存或更新车辆的详细配置信息

### Example

```javascript
import Api from 'api';
let defaultClient = Api.ApiClient.instance;
// Configure API key authorization: Sa-Token
let Sa-Token = defaultClient.authentications['Sa-Token'];
Sa-Token.apiKey = 'YOUR API KEY';
// Uncomment the following line to set a prefix for the API key, e.g. "Token" (defaults to null)
//Sa-Token.apiKeyPrefix = 'Token';

let apiInstance = new Api.DefaultApi();
let carId = 56; // Number | 车辆ID
let carDetailDTO = new Api.CarDetailDTO(); // CarDetailDTO | 
apiInstance.saveCarDetail(carId, carDetailDTO).then((data) => {
  console.log('API called successfully. Returned data: ' + data);
}, (error) => {
  console.error(error);
});

```

### Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **carId** | **Number**| 车辆ID | 
 **carDetailDTO** | [**CarDetailDTO**](CarDetailDTO.md)|  | 

### Return type

[**Result**](Result.md)

### Authorization

[Sa-Token](../README.md#Sa-Token)

### HTTP request headers

- **Content-Type**: application/json
- **Accept**: */*


## searchCars

> Result searchCars(keyword, opts)

搜索车辆

根据关键词搜索车辆，支持品牌、型号、类别等字段

### Example

```javascript
import Api from 'api';
let defaultClient = Api.ApiClient.instance;
// Configure API key authorization: Sa-Token
let Sa-Token = defaultClient.authentications['Sa-Token'];
Sa-Token.apiKey = 'YOUR API KEY';
// Uncomment the following line to set a prefix for the API key, e.g. "Token" (defaults to null)
//Sa-Token.apiKeyPrefix = 'Token';

let apiInstance = new Api.DefaultApi();
let keyword = "keyword_example"; // String | 搜索关键词
let opts = {
  'page': 1, // Number | 页码，默认1
  'size': 10 // Number | 每页数量，默认10
};
apiInstance.searchCars(keyword, opts).then((data) => {
  console.log('API called successfully. Returned data: ' + data);
}, (error) => {
  console.error(error);
});

```

### Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **keyword** | **String**| 搜索关键词 | 
 **page** | **Number**| 页码，默认1 | [optional] [default to 1]
 **size** | **Number**| 每页数量，默认10 | [optional] [default to 10]

### Return type

[**Result**](Result.md)

### Authorization

[Sa-Token](../README.md#Sa-Token)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: */*


## sendMessage

> Number sendMessage(receiverId, content, opts)

发送消息

向指定用户发送消息，可选关联车辆

### Example

```javascript
import Api from 'api';
let defaultClient = Api.ApiClient.instance;
// Configure API key authorization: Sa-Token
let Sa-Token = defaultClient.authentications['Sa-Token'];
Sa-Token.apiKey = 'YOUR API KEY';
// Uncomment the following line to set a prefix for the API key, e.g. "Token" (defaults to null)
//Sa-Token.apiKeyPrefix = 'Token';

let apiInstance = new Api.DefaultApi();
let receiverId = 56; // Number | 接收者ID
let content = "content_example"; // String | 消息内容
let opts = {
  'carId': 56 // Number | 关联车辆ID
};
apiInstance.sendMessage(receiverId, content, opts).then((data) => {
  console.log('API called successfully. Returned data: ' + data);
}, (error) => {
  console.error(error);
});

```

### Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **receiverId** | **Number**| 接收者ID | 
 **content** | **String**| 消息内容 | 
 **carId** | **Number**| 关联车辆ID | [optional] 

### Return type

**Number**

### Authorization

[Sa-Token](../README.md#Sa-Token)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: */*


## submitDealerInfo

> ApiResponseDealer submitDealerInfo(dealerDTO)

提交经销商信息

提交经销商基本信息

### Example

```javascript
import Api from 'api';
let defaultClient = Api.ApiClient.instance;
// Configure API key authorization: Sa-Token
let Sa-Token = defaultClient.authentications['Sa-Token'];
Sa-Token.apiKey = 'YOUR API KEY';
// Uncomment the following line to set a prefix for the API key, e.g. "Token" (defaults to null)
//Sa-Token.apiKeyPrefix = 'Token';

let apiInstance = new Api.DefaultApi();
let dealerDTO = new Api.DealerDTO(); // DealerDTO | 
apiInstance.submitDealerInfo(dealerDTO).then((data) => {
  console.log('API called successfully. Returned data: ' + data);
}, (error) => {
  console.error(error);
});

```

### Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **dealerDTO** | [**DealerDTO**](DealerDTO.md)|  | 

### Return type

[**ApiResponseDealer**](ApiResponseDealer.md)

### Authorization

[Sa-Token](../README.md#Sa-Token)

### HTTP request headers

- **Content-Type**: application/json
- **Accept**: */*


## submitDealerReview

> ApiResponseDealer submitDealerReview()

提交审核申请

提交经销商审核申请

### Example

```javascript
import Api from 'api';
let defaultClient = Api.ApiClient.instance;
// Configure API key authorization: Sa-Token
let Sa-Token = defaultClient.authentications['Sa-Token'];
Sa-Token.apiKey = 'YOUR API KEY';
// Uncomment the following line to set a prefix for the API key, e.g. "Token" (defaults to null)
//Sa-Token.apiKeyPrefix = 'Token';

let apiInstance = new Api.DefaultApi();
apiInstance.submitDealerReview().then((data) => {
  console.log('API called successfully. Returned data: ' + data);
}, (error) => {
  console.error(error);
});

```

### Parameters

This endpoint does not need any parameter.

### Return type

[**ApiResponseDealer**](ApiResponseDealer.md)

### Authorization

[Sa-Token](../README.md#Sa-Token)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: */*


## updateCar

> Result updateCar(carId, carDTO)

更新车辆信息

更新指定车辆的基本信息和详细配置

### Example

```javascript
import Api from 'api';
let defaultClient = Api.ApiClient.instance;
// Configure API key authorization: Sa-Token
let Sa-Token = defaultClient.authentications['Sa-Token'];
Sa-Token.apiKey = 'YOUR API KEY';
// Uncomment the following line to set a prefix for the API key, e.g. "Token" (defaults to null)
//Sa-Token.apiKeyPrefix = 'Token';

let apiInstance = new Api.DefaultApi();
let carId = 56; // Number | 车辆ID
let carDTO = new Api.CarDTO(); // CarDTO | 
apiInstance.updateCar(carId, carDTO).then((data) => {
  console.log('API called successfully. Returned data: ' + data);
}, (error) => {
  console.error(error);
});

```

### Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **carId** | **Number**| 车辆ID | 
 **carDTO** | [**CarDTO**](CarDTO.md)|  | 

### Return type

[**Result**](Result.md)

### Authorization

[Sa-Token](../README.md#Sa-Token)

### HTTP request headers

- **Content-Type**: application/json
- **Accept**: */*


## updateCarDetail

> Result updateCarDetail(carId, carDetailDTO)

更新车辆详情

更新指定车辆的详细配置信息

### Example

```javascript
import Api from 'api';
let defaultClient = Api.ApiClient.instance;
// Configure API key authorization: Sa-Token
let Sa-Token = defaultClient.authentications['Sa-Token'];
Sa-Token.apiKey = 'YOUR API KEY';
// Uncomment the following line to set a prefix for the API key, e.g. "Token" (defaults to null)
//Sa-Token.apiKeyPrefix = 'Token';

let apiInstance = new Api.DefaultApi();
let carId = 56; // Number | 车辆ID
let carDetailDTO = new Api.CarDetailDTO(); // CarDetailDTO | 
apiInstance.updateCarDetail(carId, carDetailDTO).then((data) => {
  console.log('API called successfully. Returned data: ' + data);
}, (error) => {
  console.error(error);
});

```

### Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **carId** | **Number**| 车辆ID | 
 **carDetailDTO** | [**CarDetailDTO**](CarDetailDTO.md)|  | 

### Return type

[**Result**](Result.md)

### Authorization

[Sa-Token](../README.md#Sa-Token)

### HTTP request headers

- **Content-Type**: application/json
- **Accept**: */*


## updatePassword

> ApiResponse updatePassword(passwordUpdateDTO)

修改密码

修改当前登录用户的密码

### Example

```javascript
import Api from 'api';
let defaultClient = Api.ApiClient.instance;
// Configure API key authorization: Sa-Token
let Sa-Token = defaultClient.authentications['Sa-Token'];
Sa-Token.apiKey = 'YOUR API KEY';
// Uncomment the following line to set a prefix for the API key, e.g. "Token" (defaults to null)
//Sa-Token.apiKeyPrefix = 'Token';

let apiInstance = new Api.DefaultApi();
let passwordUpdateDTO = new Api.PasswordUpdateDTO(); // PasswordUpdateDTO | 
apiInstance.updatePassword(passwordUpdateDTO).then((data) => {
  console.log('API called successfully. Returned data: ' + data);
}, (error) => {
  console.error(error);
});

```

### Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **passwordUpdateDTO** | [**PasswordUpdateDTO**](PasswordUpdateDTO.md)|  | 

### Return type

[**ApiResponse**](ApiResponse.md)

### Authorization

[Sa-Token](../README.md#Sa-Token)

### HTTP request headers

- **Content-Type**: application/json
- **Accept**: application/json


## updateStatusByDealer

> Result updateStatusByDealer(appointmentId, status)

更新预约状态

经销商更新预约的状态（仅经销商可用）

### Example

```javascript
import Api from 'api';
let defaultClient = Api.ApiClient.instance;
// Configure API key authorization: Sa-Token
let Sa-Token = defaultClient.authentications['Sa-Token'];
Sa-Token.apiKey = 'YOUR API KEY';
// Uncomment the following line to set a prefix for the API key, e.g. "Token" (defaults to null)
//Sa-Token.apiKeyPrefix = 'Token';

let apiInstance = new Api.DefaultApi();
let appointmentId = 56; // Number | 预约ID
let status = "status_example"; // String | 新状态：已确认、已完成、已取消
apiInstance.updateStatusByDealer(appointmentId, status).then((data) => {
  console.log('API called successfully. Returned data: ' + data);
}, (error) => {
  console.error(error);
});

```

### Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **appointmentId** | **Number**| 预约ID | 
 **status** | **String**| 新状态：已确认、已完成、已取消 | 

### Return type

[**Result**](Result.md)

### Authorization

[Sa-Token](../README.md#Sa-Token)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: */*


## updateUserPreference

> ApiResponseUserPreference updateUserPreference(preferenceDTO)

更新偏好设置

更新当前登录用户的偏好设置

### Example

```javascript
import Api from 'api';
let defaultClient = Api.ApiClient.instance;
// Configure API key authorization: Sa-Token
let Sa-Token = defaultClient.authentications['Sa-Token'];
Sa-Token.apiKey = 'YOUR API KEY';
// Uncomment the following line to set a prefix for the API key, e.g. "Token" (defaults to null)
//Sa-Token.apiKeyPrefix = 'Token';

let apiInstance = new Api.DefaultApi();
let preferenceDTO = new Api.PreferenceDTO(); // PreferenceDTO | 
apiInstance.updateUserPreference(preferenceDTO).then((data) => {
  console.log('API called successfully. Returned data: ' + data);
}, (error) => {
  console.error(error);
});

```

### Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **preferenceDTO** | [**PreferenceDTO**](PreferenceDTO.md)|  | 

### Return type

[**ApiResponseUserPreference**](ApiResponseUserPreference.md)

### Authorization

[Sa-Token](../README.md#Sa-Token)

### HTTP request headers

- **Content-Type**: application/json
- **Accept**: */*


## updateUserProfile

> ApiResponseUser updateUserProfile(userProfileDTO)

更新用户资料

更新当前登录用户的资料信息

### Example

```javascript
import Api from 'api';
let defaultClient = Api.ApiClient.instance;
// Configure API key authorization: Sa-Token
let Sa-Token = defaultClient.authentications['Sa-Token'];
Sa-Token.apiKey = 'YOUR API KEY';
// Uncomment the following line to set a prefix for the API key, e.g. "Token" (defaults to null)
//Sa-Token.apiKeyPrefix = 'Token';

let apiInstance = new Api.DefaultApi();
let userProfileDTO = new Api.UserProfileDTO(); // UserProfileDTO | 
apiInstance.updateUserProfile(userProfileDTO).then((data) => {
  console.log('API called successfully. Returned data: ' + data);
}, (error) => {
  console.error(error);
});

```

### Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **userProfileDTO** | [**UserProfileDTO**](UserProfileDTO.md)|  | 

### Return type

[**ApiResponseUser**](ApiResponseUser.md)

### Authorization

[Sa-Token](../README.md#Sa-Token)

### HTTP request headers

- **Content-Type**: application/json
- **Accept**: */*


## updateUserStatus

> Result updateUserStatus(userId, userStatusDTO)

更新用户状态

启用或禁用用户账号

### Example

```javascript
import Api from 'api';
let defaultClient = Api.ApiClient.instance;
// Configure API key authorization: Sa-Token
let Sa-Token = defaultClient.authentications['Sa-Token'];
Sa-Token.apiKey = 'YOUR API KEY';
// Uncomment the following line to set a prefix for the API key, e.g. "Token" (defaults to null)
//Sa-Token.apiKeyPrefix = 'Token';

let apiInstance = new Api.DefaultApi();
let userId = 56; // Number | 用户ID
let userStatusDTO = new Api.UserStatusDTO(); // UserStatusDTO | 
apiInstance.updateUserStatus(userId, userStatusDTO).then((data) => {
  console.log('API called successfully. Returned data: ' + data);
}, (error) => {
  console.error(error);
});

```

### Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **userId** | **Number**| 用户ID | 
 **userStatusDTO** | [**UserStatusDTO**](UserStatusDTO.md)|  | 

### Return type

[**Result**](Result.md)

### Authorization

[Sa-Token](../README.md#Sa-Token)

### HTTP request headers

- **Content-Type**: application/json
- **Accept**: */*


## uploadAvatar

> ApiResponse uploadAvatar(file)

上传头像

上传当前登录用户的头像 - 支持的格式：JPG、PNG、GIF - 文件大小限制：2MB - 文件命名规则：avatar_timestamp.extension 

### Example

```javascript
import Api from 'api';
let defaultClient = Api.ApiClient.instance;
// Configure API key authorization: Sa-Token
let Sa-Token = defaultClient.authentications['Sa-Token'];
Sa-Token.apiKey = 'YOUR API KEY';
// Uncomment the following line to set a prefix for the API key, e.g. "Token" (defaults to null)
//Sa-Token.apiKeyPrefix = 'Token';

let apiInstance = new Api.DefaultApi();
let file = "/path/to/file"; // File | 头像文件 - 支持的格式：JPG、PNG、GIF - 最大大小：2MB 
apiInstance.uploadAvatar(file).then((data) => {
  console.log('API called successfully. Returned data: ' + data);
}, (error) => {
  console.error(error);
});

```

### Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **file** | **File**| 头像文件 - 支持的格式：JPG、PNG、GIF - 最大大小：2MB  | 

### Return type

[**ApiResponse**](ApiResponse.md)

### Authorization

[Sa-Token](../README.md#Sa-Token)

### HTTP request headers

- **Content-Type**: multipart/form-data
- **Accept**: application/json


## uploadCarImage

> ApiResponseObject uploadCarImage(carId, type, opts)

上传车辆图片

上传车辆图片，支持缩略图和完整图，每种类型最多一张

### Example

```javascript
import Api from 'api';
let defaultClient = Api.ApiClient.instance;
// Configure API key authorization: Sa-Token
let Sa-Token = defaultClient.authentications['Sa-Token'];
Sa-Token.apiKey = 'YOUR API KEY';
// Uncomment the following line to set a prefix for the API key, e.g. "Token" (defaults to null)
//Sa-Token.apiKeyPrefix = 'Token';

let apiInstance = new Api.DefaultApi();
let carId = 56; // Number | 
let type = "type_example"; // String | 
let opts = {
  'uploadCarImageRequest': new Api.UploadCarImageRequest() // UploadCarImageRequest | 
};
apiInstance.uploadCarImage(carId, type, opts).then((data) => {
  console.log('API called successfully. Returned data: ' + data);
}, (error) => {
  console.error(error);
});

```

### Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **carId** | **Number**|  | 
 **type** | **String**|  | 
 **uploadCarImageRequest** | [**UploadCarImageRequest**](UploadCarImageRequest.md)|  | [optional] 

### Return type

[**ApiResponseObject**](ApiResponseObject.md)

### Authorization

[Sa-Token](../README.md#Sa-Token)

### HTTP request headers

- **Content-Type**: application/json
- **Accept**: */*

