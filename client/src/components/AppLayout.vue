<template>
  <div class="app-layout">
    <!-- 侧边栏 -->
    <Sidebar />
    
    <!-- 主内容区 -->
    <main 
      class="main-container"
      :class="{ 'is-collapsed': appStore.sidebarCollapsed }"
    >
      <!-- 顶部栏 -->
      <Topbar />
      
      <!-- 页面内容 -->
      <div class="page-content">
        <router-view v-slot="{ Component }">
          <transition name="fade" mode="out-in">
            <component :is="Component" />
          </transition>
        </router-view>
      </div>
    </main>
  </div>
</template>

<script setup>
import Sidebar from './Sidebar.vue'
import Topbar from './Topbar.vue'
import { useAppStore } from '../stores/app'

const appStore = useAppStore()
</script>

<style scoped>
.app-layout {
  min-height: 100vh;
  display: flex;
}

.main-container {
  flex: 1;
  margin-left: 220px;
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  transition: margin-left 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  background-color: #f0f2f5;
}

.main-container.is-collapsed {
  margin-left: 64px;
}

.page-content {
  flex: 1;
  padding: 20px;
  overflow-y: auto;
}

/* 页面切换动画 */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease, transform 0.2s ease;
}

.fade-enter-from {
  opacity: 0;
  transform: translateY(8px);
}

.fade-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}
</style>
