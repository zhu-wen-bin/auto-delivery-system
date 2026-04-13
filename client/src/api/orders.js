import { get, post, del } from '../utils/request'

export function getOrders(params) { return get('/api/orders', params) }
export function deleteOrder(id) { return del(`/api/orders/${id}`) }
export function createOrder(data) { return post('/api/orders/create', data) }
