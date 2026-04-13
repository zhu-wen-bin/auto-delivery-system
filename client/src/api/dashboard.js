import { get } from '../utils/request'

export const getStats = () => get('/api/dashboard/stats')
