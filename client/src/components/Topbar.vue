<template>
  <header class="topbar">
    <!-- 左侧：折叠按钮 + 页面标题 -->
    <div class="left-section">
      <button 
        class="toggle-btn"
        @click="appStore.toggleSidebar"
        :title="appStore.sidebarCollapsed ? '展开侧边栏' : '收起侧边栏'"
      >
        <el-icon :size="18">
          <Fold v-if="!appStore.sidebarCollapsed" />
          <Expand v-else />
        </el-icon>
      </button>
      <div class="page-title">
        <h1>{{ currentPageTitle }}</h1>
      </div>
    </div>

    <!-- 右侧：用户信息 -->
    <div class="right-section">
      <el-dropdown @command="handleCommand" trigger="click">
        <div class="user-info">
          <div class="avatar">
            <el-icon :size="20"><UserFilled /></el-icon>
          </div>
          <span class="username">{{ authStore.username || '管理员' }}</span>
          <el-icon class="dropdown-arrow"><ArrowDown /></el-icon>
        </div>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item command="logout">
              <el-icon><SwitchButton /></el-icon>
              <span>退出登录</span>
            </el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
  </header>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import { useAppStore } from '../stores/app'
import { Fold, Expand, UserFilled, ArrowDown, SwitchButton } from '@element-plus/icons-vue'

const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()
const appStore = useAppStore()

// 根据当前路由计算页面标题
const currentPageTitle = computed(() => {
  const path = route.path
  if (path === '/dashboard') return '数据统计'
  if (path === '/products') return '商品管理'
  if (path === '/products/add') return '添加商品'
  if (path.startsWith('/products/edit')) return '编辑商品'
  return '控制台'
})

const handleCommand = (command) => {
  if (command === 'logout') {
    authStore.logout()
    router.push('/login')
  }
}
</script>

<style scoped>
.topbar {
  height: 60px;
  background: #fff;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 24px;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.05);
  position: sticky;
  top: 0;
  z-index: 50;
}

/* 左侧区域 */
.left-section {
  display: flex;
  align-items: center;
  gap: 16px;
}

.toggle-btn {
  width: 36px;
  height: 36px;
  border: none;
  background: transparent;
  border-radius: 8px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #64748b;
  transition: all 0.2s ease;
}

.toggle-btn:hover {
  background: #f1f5f9;
  color: #6366f1;
}

.page-title h1 {
  font-size: 18px;
  font-weight: 600;
  color: #1e293b;
  margin: 0;
  letter-spacing: 0.3px;
}

/* 右侧区域 */
.right-section {
  display: flex;
  align-items: center;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 6px 12px 6px 6px;
  border-radius: 24px;
  cursor: pointer;
  transition: all 0.2s ease;
  background: #f8fafc;
  border: 1px solid #e2e8f0;
}

.user-info:hover {
  background: #f1f5f9;
  border-color: #cbd5e1;
}

.avatar {
  width: 32px;
  height: 32px;
  background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
}

.username {
  font-size: 14px;
  font-weight: 500;
  color: #334155;
}

.dropdown-arrow {
  font-size: 12px;
  color: #94a3b8;
  margin-left: 2px;
}

/* 下拉菜单样式 */
:deep(.el-dropdown-menu) {
  padding: 6px;
  border-radius: 10px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.12);
  border: 1px solid #e2e8f0;
}

:deep(.el-dropdown-menu__item) {
  padding: 10px 16px;
  border-radius: 6px;
  font-size: 14px;
  display: flex;
  align-items: center;
  gap: 8px;
  color: #475569;
}

:deep(.el-dropdown-menu__item:hover) {
  background: #f1f5f9;
  color: #6366f1;
}

:deep(.el-dropdown-menu__item .el-icon) {
  font-size: 16px;
}
</style>
