import { post, get } from '../utils/request'

export const login = (data) => post('/api/auth/login', data)
export const logout = () => post('/api/auth/logout')
export const getProfile = () => get('/api/auth/profile')
