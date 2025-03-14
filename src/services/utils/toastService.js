/**
 * Toast通知服务
 * 包装vuestic-ui的toast功能，提供统一的通知接口
 */

import { useToast } from 'vuestic-ui';

class ToastService {
  constructor() {
    this.toast = null;
    this.defaultOptions = {
      position: 'top-right',
      duration: 3000,
      closeable: true,
      zIndex: 9999,
    };
  }

  /**
   * 初始化toast服务
   * 必须在使用其他方法前调用此方法
   */
  init() {
    const { init } = useToast();
    this.toast = init;
    return this;
  }

  /**
   * 显示成功通知
   * @param {string} message 通知消息
   * @param {object} options 额外选项
   */
  success(message, options = {}) {
    this._ensureInitialized();
    this.toast({
      message,
      color: 'success',
      ...this.defaultOptions,
      ...options,
    });
  }

  /**
   * 显示错误通知
   * @param {string} message 通知消息
   * @param {object} options 额外选项
   */
  error(message, options = {}) {
    this._ensureInitialized();
    this.toast({
      message,
      color: 'danger',
      ...this.defaultOptions,
      ...options,
    });
  }

  /**
   * 显示警告通知
   * @param {string} message 通知消息
   * @param {object} options 额外选项
   */
  warning(message, options = {}) {
    this._ensureInitialized();
    this.toast({
      message,
      color: 'warning',
      ...this.defaultOptions,
      ...options,
    });
  }

  /**
   * 显示信息通知
   * @param {string} message 通知消息
   * @param {object} options 额外选项
   */
  info(message, options = {}) {
    this._ensureInitialized();
    this.toast({
      message,
      color: 'info',
      ...this.defaultOptions,
      ...options,
    });
  }

  /**
   * 显示自定义通知
   * @param {object} options 通知选项
   */
  show(options = {}) {
    this._ensureInitialized();
    this.toast({
      ...this.defaultOptions,
      ...options,
    });
  }

  /**
   * 确保服务已初始化
   * @private
   */
  _ensureInitialized() {
    if (!this.toast) {
      throw new Error('Toast服务未初始化，请先调用init()方法');
    }
  }
}

// 创建单例实例
const toastService = new ToastService();

// 导出服务实例
export default toastService; 