/**
 * 日志服务
 * 提供统一的日志记录接口，方便以后扩展为不同的日志展示方式（控制台、UI界面、远程服务等）
 */
class LogService {
  constructor() {
    // 日志级别定义
    this.LOG_LEVELS = {
      DEBUG: 0,
      INFO: 1,
      WARN: 2,
      ERROR: 3,
      NONE: 4
    };
    
    // 默认日志级别，可根据环境配置不同的级别
    this.currentLevel = process.env.NODE_ENV === 'production' 
      ? this.LOG_LEVELS.INFO 
      : this.LOG_LEVELS.DEBUG;
    
    // 日志输出目标，默认为控制台
    this.targets = [this.consoleTarget];
  }
  
  /**
   * 设置日志级别
   * @param {string} level 日志级别，可选值：'DEBUG', 'INFO', 'WARN', 'ERROR', 'NONE'
   */
  setLevel(level) {
    if (this.LOG_LEVELS[level] !== undefined) {
      this.currentLevel = this.LOG_LEVELS[level];
    }
  }
  
  /**
   * 添加日志输出目标
   * @param {Function} target 日志输出目标函数，格式为 (level, ...args) => void
   */
  addTarget(target) {
    if (typeof target === 'function') {
      this.targets.push(target);
    }
  }
  
  /**
   * 清除所有日志输出目标
   */
  clearTargets() {
    this.targets = [];
  }
  
  /**
   * 控制台日志输出目标
   * @param {string} level 日志级别
   * @param {Array} args 日志参数
   */
  consoleTarget(level, ...args) {
    switch (level) {
      case 'DEBUG':
        console.debug(...args);
        break;
      case 'INFO':
        console.log(...args);
        break;
      case 'WARN':
        console.warn(...args);
        break;
      case 'ERROR':
        console.error(...args);
        break;
    }
  }
  
  /**
   * 记录调试日志
   * @param {...any} args 日志内容
   */
  debug(...args) {
    if (this.currentLevel <= this.LOG_LEVELS.DEBUG) {
      this._log('DEBUG', ...args);
    }
  }
  
  /**
   * 记录信息日志
   * @param {...any} args 日志内容
   */
  info(...args) {
    if (this.currentLevel <= this.LOG_LEVELS.INFO) {
      this._log('INFO', ...args);
    }
  }
  
  /**
   * 记录警告日志
   * @param {...any} args 日志内容
   */
  warn(...args) {
    if (this.currentLevel <= this.LOG_LEVELS.WARN) {
      this._log('WARN', ...args);
    }
  }
  
  /**
   * 记录错误日志
   * @param {...any} args 日志内容
   */
  error(...args) {
    if (this.currentLevel <= this.LOG_LEVELS.ERROR) {
      this._log('ERROR', ...args);
    }
  }
  
  /**
   * 内部日志记录方法
   * @param {string} level 日志级别
   * @param {...any} args 日志内容
   */
  _log(level, ...args) {
    this.targets.forEach(target => {
      try {
        target(level, ...args);
      } catch (e) {
        console.error('日志记录失败:', e);
      }
    });
  }
}

// 创建单例实例
const logService = new LogService();

// 导出服务实例
export default logService; 