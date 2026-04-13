import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { login as loginApi, getProfile as getProfileApi } from '../api/auth'

export const useAuthStore = defineStore('auth', () => {
  // State
  const token = ref(localStorage.getItem('token') || '')
  const user = ref(null)

  // Getters
  const isLoggedIn = computed(() => !!token.value)
  const username = computed(() => user.value?.username || '')
  const userRole = computed(() => user.value?.role || '')

  // Actions
  const setToken = (newToken) => {
    token.value = newToken
    localStorage.setItem('token', newToken)
  }

  const clearToken = () => {
    token.value = ''
    user.value = null
    localStorage.removeItem('token')
  }

  const login = async (data) => {
    const res = await loginApi(data)
    if (res.token) {
      setToken(res.token)
      user.value = res.user
    }
    return res
  }

  const logout = () => {
    clearToken()
  }

  const getProfile = async () => {
    const res = await getProfileApi()
    user.value = res.data
    return res
  }

  return {
    token,
    user,
    isLoggedIn,
    username,
    userRole,
    login,
    logout,
    getProfile,
    setToken,
    clearToken
  }
})
