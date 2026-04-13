<template>
  <aside 
    class="sidebar" 
    :class="{ 'is-collapsed': appStore.sidebarCollapsed }"
  >
    <!-- Logo 区域 -->
    <div class="logo-area">
      <div class="logo-icon">
        <el-icon :size="28"><DataLine /></el-icon>
      </div>
      <span v-show="!appStore.sidebarCollapsed" class="logo-text">数据管理系统</span>
    </div>

    <!-- 菜单区域 -->
    <nav class="menu-area">
      <router-link 
        to="/dashboard" 
        class="menu-item"
        :class="{ 'is-active': $route.path === '/dashboard' }"
      >
        <div class="menu-icon">
          <el-icon :size="20"><Odometer /></el-icon>
        </div>
        <span v-show="!appStore.sidebarCollapsed" class="menu-text">数据统计</span>
      </router-link>

      <router-link 
        to="/products" 
        class="menu-item"
        :class="{ 'is-active': $route.path.startsWith('/products') }"
      >
        <div class="menu-icon">
          <el-icon :size="20"><Box /></el-icon>
        </div>
        <span v-show="!appStore.sidebarCollapsed" class="menu-text">商品管理</span>
      </router-link>

      <router-link 
        to="/orders" 
        class="menu-item"
        :class="{ 'is-active': $route.path.startsWith('/orders') }"
      >
        <div class="menu-icon">
          <el-icon :size="20"><Document /></el-icon>
        </div>
        <span v-show="!appStore.sidebarCollapsed" class="menu-text">订单管理</span>
      </router-link>
    </nav>

    <!-- 底部区域 -->
    <div class="sidebar-footer" v-show="!appStore.sidebarCollapsed">
      <span class="version">v1.0.0</span>
    </div>
  </aside>
</template>

<script setup>
import { useRoute } from 'vue-router'
import { useAppStore } from '../stores/app'
import { DataLine, Odometer, Box, Document } from '@element-plus/icons-vue'

const $route = useRoute()
const appStore = useAppStore()
</script>

<style scoped>
.sidebar {
  width: 220px;
  height: 100vh;
  background: linear-gradient(180deg, #1d1e2c 0%, #2d2e3e 100%);
  display: flex;
  flex-direction: column;
  transition: width 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: fixed;
  left: 0;
  top: 0;
  z-index: 100;
  box-shadow: 4px 0 20px rgba(0, 0, 0, 0.15);
}

.sidebar.is-collapsed {
  width: 64px;
}

/* Logo 区域 */
.logo-area {
  height: 70px;
  display: flex;
  align-items: center;
  padding: 0 16px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
  gap: 12px;
  flex-shrink: 0;
}

.logo-icon {
  width: 36px;
  height: 36px;
  background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  flex-shrink: 0;
  box-shadow: 0 4px 12px rgba(99, 102, 241, 0.35);
}

.logo-text {
  font-size: 16px;
  font-weight: 600;
  color: #fff;
  letter-spacing: 0.5px;
  white-space: nowrap;
  opacity: 1;
  transition: opacity 0.2s ease;
}

/* 菜单区域 */
.menu-area {
  flex: 1;
  padding: 16px 12px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  overflow-y: auto;
}

.menu-item {
  display: flex;
  align-items: center;
  padding: 12px 14px;
  border-radius: 10px;
  text-decoration: none;
  transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
}

.menu-item::before {
  content: '';
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, rgba(99, 102, 241, 0.15) 0%, transparent 100%);
  opacity: 0;
  transition: opacity 0.25s ease;
}

.menu-item:hover {
  background: rgba(255, 255, 255, 0.06);
  transform: translateX(2px);
}

.menu-item:hover::before {
  opacity: 1;
}

.menu-item.is-active {
  background: linear-gradient(90deg, rgba(99, 102, 241, 0.2) 0%, rgba(139, 92, 246, 0.1) 100%);
}

.menu-item.is-active::before {
  opacity: 1;
}

.menu-item.is-active .menu-icon {
  color: #818cf8;
}

.menu-item.is-active .menu-text {
  color: #fff;
  font-weight: 500;
}

.menu-icon {
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #94a3b8;
  flex-shrink: 0;
  transition: color 0.25s ease;
}

.menu-item:hover .menu-icon {
  color: #c4b5fd;
}

.menu-text {
  margin-left: 12px;
  font-size: 14px;
  color: #cbd5e1;
  white-space: nowrap;
  opacity: 1;
  transition: opacity 0.2s ease, color 0.25s ease;
}

.menu-item:hover .menu-text {
  color: #fff;
}

/* 底部区域 */
.sidebar-footer {
  padding: 16px;
  border-top: 1px solid rgba(255, 255, 255, 0.08);
  text-align: center;
  flex-shrink: 0;
}

.version {
  font-size: 12px;
  color: #64748b;
  letter-spacing: 0.5px;
}

/* 折叠状态下的调整 */
.sidebar.is-collapsed .logo-area {
  justify-content: center;
  padding: 0;
}

.sidebar.is-collapsed .menu-item {
  justify-content: center;
  padding: 12px;
}

.sidebar.is-collapsed .menu-icon {
  margin: 0;
}

/* 滚动条样式 */
.menu-area::-webkit-scrollbar {
  width: 4px;
}

.menu-area::-webkit-scrollbar-track {
  background: transparent;
}

.menu-area::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 2px;
}

.menu-area::-webkit-scrollbar-thumb:hover {
  background: rgba(255, 255, 255, 0.2);
}
</style>
