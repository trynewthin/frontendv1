<template>
  <div class="user-status-bar">
    <!-- 未登录状态 -->
    <div v-if="!isLoggedIn" class="guest-actions">
      <router-link to="/login" class="login-button">登录</router-link>
      <router-link to="/register" class="register-button">注册</router-link>
    </div>
    
    <!-- 已登录状态 -->
    <div v-else class="user-actions">
      <!-- 用户头像 -->
      <div class="avatar-container" @click="handleAvatarClick">
        <img 
          v-if="userInfo && userInfo.avatar" 
          :src="userInfo.avatar" 
          class="user-avatar" 
          alt="用户头像"
        />
        <div v-else class="default-avatar">
          {{ userInfo?.username?.charAt(0)?.toUpperCase() || 'U' }}
        </div>
      </div>
      
      <!-- 菜单按钮 -->
      <div class="menu-button" @click.stop="toggleMenu">
        <i class="menu-icon">&#9776;</i>
      </div>
      
      <!-- 下拉菜单 -->
      <div v-if="menuVisible" class="dropdown-menu" @click.stop>
        <div class="menu-header">
          <span class="username">{{ userInfo?.username || '用户' }}</span>
          <span class="user-type">{{ getUserType }}</span>
        </div>
        <div class="menu-divider"></div>
        <div class="menu-items">
          <!-- 根据用户角色显示对应的选项 -->
          <div v-if="isNormalUser" class="menu-item" @click="goToUserCenter">
            <i class="item-icon">👤</i>
            <span>个人中心</span>
          </div>
          <div v-if="isDealerUser" class="menu-item" @click="goToDealerCenter">
            <i class="item-icon">🏢</i>
            <span>经销商中心</span>
          </div>
          <div v-if="isAdminUser" class="menu-item" @click="goToAdminCenter">
            <i class="item-icon">⚙️</i>
            <span>管理后台</span>
          </div>
          <div class="menu-item logout" @click="handleLogout">
            <i class="item-icon">🚪</i>
            <span>退出登录</span>
          </div>
        </div>
      </div>
    </div>
    
    <!-- 点击外部区域关闭菜单的遮罩层 -->
    <div v-if="menuVisible" class="menu-backdrop" @click="closeMenu"></div>
  </div>
</template>

<script>
import authService from '../../api/authService';

export default {
  name: 'UserStatusBar',
  data() {
    return {
      isLoggedIn: false,
      userInfo: null,
      menuVisible: false,
      isLoggingOut: false
    };
  },
  computed: {
    isDealerUser() {
      return this.userInfo && this.userInfo.userType === 'DEALER';
    },
    isAdminUser() {
      return this.userInfo && this.userInfo.userType === 'ADMIN';
    },
    isNormalUser() {
      return this.userInfo && this.userInfo.userType === 'NORMAL_USER';
    },
    getUserType() {
      if (!this.userInfo) return '';
      
      switch (this.userInfo.userType) {
        case 'DEALER':
          return '经销商';
        case 'NORMAL_USER':
          return '普通用户';
        case 'ADMIN':
          return '系统管理员';
        default:
          return this.userInfo.userType || '';
      }
    }
  },
  created() {
    // 组件创建时检查登录状态
    this.checkLoginStatus();
    
    // 监听登录状态变化事件
    window.addEventListener('storage', this.handleStorageChange);
    
    // 添加自定义事件监听器，用于监听登录状态变化
    window.addEventListener('auth-state-changed', this.checkLoginStatus);
  },
  mounted() {
    // 添加全局点击事件监听
    document.addEventListener('click', this.handleOutsideClick);
    
    // 定期检查登录状态，以防止token过期等情况
    this.loginCheckInterval = setInterval(() => {
      this.checkLoginStatus();
    }, 60000); // 每分钟检查一次
  },
  beforeUnmount() {
    // 组件销毁前移除事件监听
    window.removeEventListener('storage', this.handleStorageChange);
    document.removeEventListener('click', this.handleOutsideClick);
    window.removeEventListener('auth-state-changed', this.checkLoginStatus);
    
    // 清除定时器
    if (this.loginCheckInterval) {
      clearInterval(this.loginCheckInterval);
    }
  },
  methods: {
    // 检查登录状态
    checkLoginStatus() {
      const wasLoggedIn = this.isLoggedIn;
      const previousUserType = this.userInfo?.userType;
      
      this.isLoggedIn = authService.isLoggedIn();
      
      if (this.isLoggedIn) {
        this.userInfo = authService.getCurrentUser();
        console.log('当前登录用户:', this.userInfo);
        
        // 如果用户类型发生变化，关闭菜单
        if (previousUserType && previousUserType !== this.userInfo?.userType) {
          this.closeMenu();
        }
      } else {
        this.userInfo = null;
        this.menuVisible = false;
        console.log('当前未登录');
        
        // 如果之前是登录状态，现在变为未登录，可能需要重定向
        if (wasLoggedIn) {
          // 可以在这里添加重定向逻辑，例如回到首页
          // this.$router.push('/');
        }
      }
    },
    
    // 处理本地存储变化（用于跨标签页同步登录状态）
    handleStorageChange(event) {
      if (event.key === 'token' || event.key === 'userInfo') {
        this.checkLoginStatus();
      }
    },
    
    // 处理点击外部区域
    handleOutsideClick() {
      if (this.menuVisible) {
        this.closeMenu();
      }
    },
    
    // 切换菜单显示状态
    toggleMenu(event) {
      if (event) {
        event.stopPropagation();
      }
      this.menuVisible = !this.menuVisible;
    },
    
    // 关闭菜单
    closeMenu() {
      this.menuVisible = false;
    },
    
    // 处理头像点击
    handleAvatarClick() {
      if (this.isAdminUser) {
        this.goToAdminCenter();
      } else if (this.isDealerUser) {
        this.goToDealerCenter();
      } else {
        this.goToUserCenter();
      }
    },
    
    // 前往用户中心
    goToUserCenter() {
      this.closeMenu();
      // 根据实际路由配置调整
      this.$router.push('/user');
    },
    
    // 前往经销商中心
    goToDealerCenter() {
      this.closeMenu();
      // 根据实际路由配置调整
      this.$router.push('/dealer');
    },
    
    // 前往管理后台
    goToAdminCenter() {
      this.closeMenu();
      // 根据实际路由配置调整
      this.$router.push('/admin/dashboard');
    },
    
    // 处理登出
    async handleLogout() {
      if (this.isLoggingOut) return;
      
      this.isLoggingOut = true;
      this.closeMenu();
      
      try {
        // 调用注销API
        const result = await authService.logout();
        
        if (result.success) {
          // 注销成功
          this.$emit('logout-success');
          // 更新登录状态
          this.checkLoginStatus();
          // 触发自定义事件，通知其他组件登录状态已变化
          window.dispatchEvent(new CustomEvent('auth-state-changed'));
        } else {
          console.error('注销失败:', result.message);
        }
      } catch (error) {
        console.error('注销过程中发生错误:', error);
      } finally {
        this.isLoggingOut = false;
      }
    }
  }
};
</script>

<style scoped>
.user-status-bar {
  position: relative;
  display: flex;
  align-items: center;
  height: 100%;
  padding: 0.5rem 0;
}

/* 未登录状态样式 */
.guest-actions {
  display: flex;
  gap: 12px;
  height: 100%;
  align-items: center;
  padding: 0.5rem 0;
}

.login-button,
.register-button {
  padding: 10px 20px;
  border-radius: 4px;
  font-size: 15px;
  font-weight: 500;
  text-decoration: none;
  transition: all 0.2s;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 40px;
}

.login-button {
  background-color: white;
  color: var(--va-primary);
  border: none;
}

.login-button:hover {
  background-color: rgba(255, 255, 255, 0.9);
}

.register-button {
  background-color: transparent;
  color: white;
  border: 1px solid white;
}

.register-button:hover {
  background-color: rgba(255, 255, 255, 0.1);
}

/* 已登录状态样式 */
.user-actions {
  display: flex;
  align-items: center;
  gap: 12px;
  height: 100%;
  padding: 0.5rem 0;
}

.avatar-container {
  width: 46px;
  height: 46px;
  border-radius: 50%;
  overflow: hidden;
  cursor: pointer;
  transition: transform 0.2s;
  border: 2px solid rgba(255, 255, 255, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
}

.avatar-container:hover {
  transform: scale(1.05);
  border-color: white;
}

.user-avatar {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.default-avatar {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: rgba(255, 255, 255, 0.2);
  color: white;
  font-weight: bold;
  font-size: 18px;
}

.menu-button {
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  border-radius: 4px;
  transition: background-color 0.2s;
}

.menu-button:hover {
  background-color: rgba(255, 255, 255, 0.1);
}

.menu-icon {
  font-size: 22px;
  color: white;
}

/* 下拉菜单样式 */
.dropdown-menu {
  position: absolute;
  top: 100%;
  right: 0;
  width: 220px;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  margin-top: 8px;
  z-index: 1000;
  overflow: hidden;
}

.menu-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 999;
}

.menu-header {
  padding: 15px;
  background-color: #f8f9fa;
  display: flex;
  flex-direction: column;
}

.username {
  font-weight: 600;
  color: #333;
  font-size: 16px;
  margin-bottom: 4px;
}

.user-type {
  font-size: 14px;
  color: #666;
}

.menu-divider {
  height: 1px;
  background-color: #eee;
}

.menu-items {
  color: #000000;
  padding: 8px 0;
}

.menu-item {
  padding: 12px 16px;
  display: flex;
  align-items: center;
  cursor: pointer;
  transition: background-color 0.2s;
}

.menu-item:hover {
  background-color: #f5f7fa;
}

.item-icon {
  margin-right: 12px;
  font-size: 18px;
}

.logout {
  color: #dc3545;
}

@media (max-width: 768px) {
  .user-status-bar,
  .guest-actions,
  .user-actions {
    padding: 0.3rem 0;
  }
  
  .login-button,
  .register-button {
    padding: 8px 16px;
    font-size: 14px;
    height: 36px;
  }
  
  .avatar-container {
    width: 38px;
    height: 38px;
  }
  
  .menu-button {
    width: 32px;
    height: 32px;
  }
  
  .menu-icon {
    font-size: 20px;
  }
}
</style> 