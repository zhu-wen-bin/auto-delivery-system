import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useAppStore = defineStore('app', () => {
  // State - 从 localStorage 读取初始值
  const sidebarCollapsed = ref(localStorage.getItem('sidebarCollapsed') === 'true')

  // Actions
  const toggleSidebar = () => {
    sidebarCollapsed.value = !sidebarCollapsed.value
    // 持久化到 localStorage
    localStorage.setItem('sidebarCollapsed', sidebarCollapsed.value)
  }

  const setSidebarCollapsed = (value) => {
    sidebarCollapsed.value = value
    localStorage.setItem('sidebarCollapsed', value)
  }

  return {
    sidebarCollapsed,
    toggleSidebar,
    setSidebarCollapsed
  }
})
