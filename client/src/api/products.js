import { get, post, put, del } from '../utils/request'

export const getProducts = (params) => get('/api/products', params)
export const getProduct = (id) => get(`/api/products/${id}`)
export const getPublicProduct = (id) => get(`/api/products/public/${id}`)
export const createProduct = (data) => post('/api/products', data)
export const updateProduct = (id, data) => put(`/api/products/${id}`, data)
export const deleteProduct = (id) => del(`/api/products/${id}`)
